// websocket
import helper from "./helper";
import pako from "pako";

/**
 * ws
 * 订阅：当ws链接状态是1，直接订阅；未链接时，使用httpAction查询信息，传入payload，callback2个参数；拿到数据后，调用callback
 * 查询：当ws链接状态是1，直接查询；未链接时，使用httpAction查询信息，传入payload，callback2个参数；拿到数据后，调用callback
 *
 */

const worker_url = "/static/worker_v1.0.js";
const worker_url_1 = "/static/worker_v1.1.js";
const safari =
  /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);

let report_datas = {};

class WSClass {
  constructor(path) {
    this.path = path;
    this.ws = null;
    this.worker = null;
    // 已订阅数据
    this.subs = {
      /**
       *  id: {
       *     payload:{id:'kline_15m',topic:'kline_15m',event:'sub',params:{}},
       *     httpAction: ()=>{},  http降级方法
       *     callback: function读取到数据后调用
       *     subed_callback: 订阅成功回调
       *  }
       */
    };
    // 查询
    this.reqs = {
      /**
       * id: {
       *    payload:{}, 查询条件
       *    callback: ()=>{}  回调方法
       * }
       */
    };
    this.count = 0; // ping pong 计数

    // 启动ping
    this.ping();
    // 启动http轮询
    this.httpAction();
    // 启动ws
    this.start();
    // 启动worker
    this.start_worker();
  }
  start_worker = () => {
    if (window.Worker) {
      if (!this.worker) {
        this.worker = new Worker(safari ? worker_url_1 : worker_url);
        this.worker.onmessage = (e) => {
          this.callFn(e.data);
        };
      }
    }
  };
  start = () => {
    if (!this.path) {
      console.log("缺少ws path");
      return;
    }
    this.ws = new WebSocket(this.path + "?lang=" + window.localStorage.lang);
    this.ws_start = new Date().getTime();
    this.ws.addEventListener("open", this.open);
    this.ws.addEventListener("message", this.message);
    this.ws.addEventListener("close", this.close);
    this.ws.addEventListener("error", this.close);
  };
  open = () => {
    this.track("ws_open_time", new Date().getTime() - this.ws_start);
    // 重置pong 计数
    this.count = 0;
    // 重新订阅已有的sub
    for (let id in this.subs) {
      const sub = this.subs[id];
      this.sub(
        sub.payload,
        sub.httpAction,
        sub.callback,
        sub.subed_callback,
        true
      );
    }
  };
  close = async (err) => {
    this.track(
      "ws_close",
      "",
      err ? JSON.stringify(err) : "触发websocket close事件"
    );
    this.count = 0;
    this.ws.removeEventListener("open", this.open);
    this.ws.removeEventListener("message", this.message);
    this.ws.removeEventListener("close", this.close);
    this.ws.removeEventListener("error", this.close);
    this.ws = null;
    await helper.delay(3000);
    this.start();
  };
  callFn = (data) => {
    const id = data.id || data.topic;
    if (!id) return;
    if (this.subs[id]) {
      this.subs[id]["callback"] && this.subs[id]["callback"](data);
    }
    if (this.reqs[id]) {
      this.reqs[id]["callback"] && this.reqs[id]["callback"](data);
    }
    if (
      data.sendTime &&
      (data.topic == "mergedDepth" || data.topic == "trade")
    ) {
      let d = {
        sendTime: data.sendTime,
        currentTime: new Date().getTime(),
        diffTime: window.diff_time,
        id: data.id,
        topic: data.topic,
        channel: "ws",
      };
      d.fix = d.currentTime - d.sendTime - (window.diff_time || 0);
      if (d.fix >= 5000 && Math.abs(window.diff_time) <= 5000) {
        report_datas[d.id || d.topic] = d;
      }
    }
  };
  message = (res) => {
    let data = res.data;
    if (data && data != null) {
      // pong
      if (/pong/i.test(data)) {
        this.pong();
        return;
      }
      // ping
      if (/ping/.test(data)) {
        this.ws.send(data.replace("ping", "pong"));
        return;
      }
      if (data instanceof Blob) {
        if (this.worker && !safari) {
          this.worker.postMessage(data);
        } else {
          let reader = new FileReader();
          reader.onload = (evt) => {
            if (evt.target.readyState == FileReader.DONE) {
              if (this.worker && safari) {
                this.worker.postMessage(evt.target.result);
              } else {
                let result = new Uint8Array(evt.target.result);
                let data = JSON.parse(pako.inflate(result, { to: "string" }));
                this.callFn(data);
              }
            }
          };
          reader.readAsArrayBuffer(data);
        }
      } else {
        data = JSON.parse(data);
        this.callFn(data);
      }
    }
  };
  /**
   * 订阅,如果ws链接状态，直接订阅，并存储订阅信息； 其他状态，仅存储信息，链接后再订阅
   * @param {object} payload
   * @param {string} payload.id  订阅唯一标识
   * @param {string} payload.topic 频道
   * @param {string} payload.event 事件：sub，cancel，cancelAll，req
   * @param {string} payload.symbol 币对
   * @param {object} payload.params 参数
   * @param {boolean} payload.params.binary 是否加密
   * @param {function} httpAction http降级方法
   * @param {function} callback 成功回调
   * @param {function} subed_callback 订阅成功回调
   */
  sub = (payload, httpAction, callback, subed_callback, reopen) => {
    if (!reopen) {
      if (!payload || !payload.id || this.subs[payload.id]) {
        return;
      }
    }
    this.subs[payload.id] = {
      payload,
      _status: "subing",
      httpAction,
      callback,
      subed_callback,
    };
    if (this.ws && this.ws.readyState == 1) {
      this.ws.send(JSON.stringify(payload));
      subed_callback && subed_callback(payload.id, reopen);
      this.subs[payload.id]["_status"] = "subed";
    }
    return () => {
      this.cancel(payload.id);
    };
  };
  /**
   * 取消订阅
   * 1、取消id的订阅, 如：kline_btcusdt_15m，
   * 2、取消以id开头的订阅,如 kline_, 则取消已kline_开头的所有订阅
   * @param {string} id ,
   */
  // 取消订阅
  // cancel = (id) => {
  //   if (!id) {
  //     console.error("缺少id");
  //     return;
  //   }
  //   if (this.ws && this.ws.readyState == 1) {
  //     if (this.subs[id]) {
  //       this.ws.send(
  //         JSON.stringify(this.subs[id]["payload"]).replace("sub", "cancel")
  //       );
  //     }
  //   }
  //   delete this.subs[id];
  // };
  cancel = (id) => {
    if (!id) {
      console.error("缺少id");
      return;
    }
    if (this.ws && this.ws.readyState == 1) {
      // 1 准确取消id的订阅
      if (this.subs[id]) {
        this.ws.send(
          JSON.stringify(this.subs[id]["payload"]).replace("sub", "cancel")
        );
        delete this.subs[id];
      }
      // 2、模糊取消 ^id 的订阅
      const reg = new RegExp("^" + id);
      for (let k in this.subs) {
        if (!this.subs[id] && reg.test(k)) {
          this.ws.send(
            JSON.stringify(this.subs[k]["payload"]).replace("sub", "cancel")
          );
          delete this.subs[k];
        }
      }
    }
  };
  // 查询
  // ws：发送payload，callback回调
  // http: 调用httpAction, 并传送payload，callback作为2个参数
  req = (payload, httpAction, callback) => {
    if (!payload || !payload.id) return;
    if (this.ws && this.ws.readyState == 1) {
      this.ws.send(JSON.stringify(payload));
      this.reqs[payload.id] = { payload, callback };
    } else {
      httpAction && httpAction(payload);
    }
  };
  // 主动ping 服务端
  ping = async () => {
    const data = { ping: new Date().getTime() };
    if (this.ws && this.ws.readyState == 1) {
      this.count = 1 + Number(this.count);
      this.ws.send(JSON.stringify(data));
      if (this.count > 2) {
        this.ws.close();
      }
    }
    await helper.delay(5000);
    this.ping();
  };
  // 服务端返回pong
  pong = () => {
    this.count = Math.max(0, this.count - 1);
  };
  // ws未链接时，启动http轮询
  httpAction = async () => {
    if (!this.ws || this.ws.readyState != 1) {
      let funs = [];
      for (let key in this.subs) {
        const d = this.subs[key];
        if (d.httpAction) {
          funs.push(d.httpAction());
          // try {
          //   await d.httpAction();
          // } catch (e) {
          //   console.error(e);
          // }
        }
      }
      await Promise.all(funs);
    }
    await helper.delay(3000);
    this.httpAction();
  };
  track = (type, cost, msg) => {
    window.trackPageError({
      type,
      cost,
      error_message: msg,
    });
  };
}

async function report() {
  await helper.delay(60 * 1000);
  Object.keys(report_datas).map((item) => {
    if (report_datas[item]) {
      window.trackPageError({
        type: "delay",
        data: report_datas[item],
      });
    }
  });
  report_datas = {};
  report();
}
report();

export default WSClass;
