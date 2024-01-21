// ws推送数据源
import CONST from "../config/const";

const diff_worker = "/static/diff_worker.js";
let worker = null;
let funs = {};

// 按顺序执行 diff数据合并
let diff_datas = [];
let diff_loading = false;

if (window.Worker) {
  if (!worker) {
    worker = new Worker(diff_worker);
    worker.onmessage = (e) => {
      const data = e.data;
      if (data.type == "diff") {
        const payload = data.payload;
        // 全量更新数据
        funs.setData(payload.name, [payload.source], payload.type, 1);
        diff_loading = false;
        diff_by_order();
      }
    };
    worker.onerror = (e) => {
      console.error(e);
      diff_loading = false;
      diff_by_order();
    };
  }
}

function diff_by_order() {
  if (diff_loading) return;
  if (diff_datas.length) {
    let data = diff_datas.shift();
    diff_loading = true;
    worker.postMessage({
      ...data,
      payload: {
        ...data.payload,
        source: funs.getData(data.payload.name, data.payload.type),
      },
    });
  } else {
    setTimeout(diff_by_order, 50);
  }
}

diff_by_order();

let count = 0;
let obj = {
  // 资产
  user_balance_source: {},
  // 订单ws推送 当前委托，历史委托
  new_order_source: [],
  // 计划委托订阅
  new_plan_order_source: [],
  // 成交订阅
  history_trades_source: [],
  kline_source: {
    // kline_301BTCUSDT15m: {},
  },
  // K线历史数据
  kline_source_f: {},
  // 指数k线
  indexKline_source: {},
  indexKline_source_f: {},
  // 深度订阅
  depth_source: {
    a: [],
    b: [],
  },
  // 合并深度订阅
  mergedDepth_source: {
    a: [],
    b: [],
  },
  // 最新成交
  newTradeSource: {},
  // 24小时行情
  symbol_quote_source: {},
  // 新成交订单通知
  order_notice: 0,
  // 指数
  indices_source: {},
  // 永续合约资产
  future_balance_source: {},
  // 永续合约可交易信息
  future_tradeable_source: {},
  // 永续合约订单推送 当前委托
  future_order_source: [],
  // 永续合约订单推送 当前持仓
  future_position_source: [],

  // 杠杆账户资产
  margin_balance_source: {},
  // 订单
  margin_new_order_source: [],
  margin_plan_order_source: [],
  // 成交
  margin_trades_source: [],
  // 安全度
  margin_safety_source: {},
};

funs = {
  clearAll: (type) => {
    if (type === "qws") {
      obj.depth_source = { a: [], b: [] };
      obj.mergedDepth_source = { a: [], b: [] };
      obj.newTradeSource = [];
      obj.indices_source = {};
      obj.kline_source = {};
      obj.indexKline_source = {};
      obj.indexKline_source_f = {};
    }
    if (type === "ws") {
      obj.user_balance_source = {};
      obj.new_order_source = [];
      obj.plan_order_source = [];
      obj.history_trades_source = [];
      obj.option_order_source = [];
      // obj.option_position_source = [];
      obj.option_balance_source = {};
      obj.option_tradeable_source = {};
      obj.future_balance_source = {};
      obj.future_tradeable_source = {};
      obj.future_order_source = [];
      // obj.future_position_source = [];
      obj.futures_order_filled = [];
      //
      obj.margin_balance_source = [];
    }
    obj.order_notice = 0;
  },
  clear: (name, type) => {
    if (name === "option_balance_source" || name == "option_tradeable_source") {
      obj[name] = {};
      return;
    }
    if (name === "future_balance_source" || name == "future_tradeable_source") {
      obj[name] = {};
      return;
    }
    if (name === "order_notice") {
      obj[name] = 0;
      return;
    }
    if (name == "indices") {
      obj.indices_source = {};
      return;
    }
    if (
      name === "user_balance_source" ||
      name === "depth_source" ||
      name === "symbol_quote_source" ||
      name === "kline_source" ||
      name === "kline_source_f" ||
      name === "indexKline_source" ||
      name === "indexKline_source_f"
    ) {
      obj[name] = {};
      return;
    }
    if (name === "depth_source" || name == "mergedDepth_source") {
      obj[name] = {
        a: [],
        b: [],
      };
      return;
    }
    obj[name] = [];
    // if (
    //   name === "new_order_source" ||
    //   name === "history_trades_source" ||
    //   name === "newTradeSource" ||
    //   name === "option_order_source" ||
    //   name === "option_position_source" ||
    //   name == "future_order_source" ||
    //   name == "future_position_source" ||
    //   name == "futures_order_filled"
    // ) {
    //   obj[name] = [];
    //   return;
    // }
  },
  getData: (name, type) => {
    if (type) {
      return obj[name][type];
    }
    return obj[name];
  },
  setData: (name, data, type, f, sendTime) => {
    count++;
    if (name === "future_tradeable_source") {
      if (!data || !data.length) return;
      let d = {};
      data.map((item) => {
        d[item["tokenId"]] = item;
      });
      obj["future_tradeable_source"] = d;
      return;
    }
    if (name === "option_tradeable_source") {
      if (!data.length) return;
      data.map((item) => {
        obj.option_tradeable_source[item["tokenId"]] = item;
      });
      return;
    }
    if (name === "kline_source" || name === "indexKline_source") {
      if (!data || !type) return;
      // 首次为历史数据
      if (f) {
        obj[name + "_f"][type] = data;
        obj[name][type] = data[data.length - 1];
      } else {
        obj[name][type] = data[data.length - 1];
      }
    }
    if (name === "user_balance_source") {
      if (!data.length) return;
      data.map((item) => {
        obj.user_balance_source[item["tokenId"]] = item;
      });
      return;
    }
    if (name === "order_notice") {
      if (type) {
        obj.order_notice = data;
      } else {
        obj.order_notice = obj.order_notice + data;
      }
      return;
    }
    if (name == "indices_source") {
      if (!Object.keys(data).length) return;
      obj["indices_source"] = { ...obj["indices_source"], ...data };
    }
    if (name === "depth_source" || name === "mergedDepth_source") {
      if (!data || !data[0] || !type) return;
      if (window.localStorage.log_price) {
        worker.postMessage({
          type: "log",
          payload: {
            price: window.localStorage.log_price,
          },
        });
      }
      // 首次数据
      if (f) {
        obj[name][type] = {
          a: data[0].a,
          b: data[0].b,
        };
        return;
      }
      diff_datas.push({
        type: "diff",
        payload: {
          target: data[0],
          name,
          type,
          sendTime,
        },
      });
    }
    if (name === "newTradeSource") {
      if (!data || !type) return;
      if (type) {
        obj[name][type] = obj[name][type]
          ? data.reverse().concat(obj[name][type])
          : data.reverse();
        obj[name][type].length = Math.min(
          obj[name][type].length,
          CONST.trade_limit
        );
      }
      return;
    }
    if (name === "symbol_quote_source") {
      if (!data.length) return;
      data.map((item) => {
        obj.symbol_quote_source[item.s] = item;
      });
      return;
    }
    if (name === "new_order_source") {
      if (!data) return;
      obj.new_order_source = obj.new_order_source.concat(data);
      return;
    }
    if (name === "new_plan_order_source") {
      if (!data) return;
      obj.new_plan_order_source = obj.new_plan_order_source.concat(data);
      return;
    }
    if (name === "history_trades_source") {
      if (!data || !data.length) return;
      obj.history_trades_source = obj.history_trades_source.concat(data);
    }
    if (name === "option_order_source") {
      if (!data) return;
      obj.option_order_source.push(data);
      return;
    }
    if (name === "option_position_source") {
      if (!data) return;
      obj.option_position_source = data;
    }
    if (name === "option_balance_source") {
      if (!data || !data.length) return;
      obj.option_balance_source = data[0];
    }
    if (name === "future_balance_source") {
      if (!data || !data.length) return;
      obj.future_balance_source = data[0];
    }
    if (name === "future_order_source") {
      if (!data) return;
      obj.future_order_source = obj.future_order_source.concat(data);
      return;
    }
    if (name === "future_position_source") {
      if (!data) return;
      obj.future_position_source = data;
      return;
    }
    if (name === "futures_order_filled") {
      if (!data) return;
      obj.futures_order_filled.push(data);
      return;
    }

    if (name === "margin_balance_source") {
      obj.margin_balance_source = {};
      data.map((item) => {
        obj.margin_balance_source[item["tokenId"]] = item;
      });
      return;
    }

    if (name === "margin_new_order_source") {
      if (!data.length) return;
      obj.margin_new_order_source = obj.margin_new_order_source.concat(data);
      return;
    }

    if (name === "margin_plan_order_source") {
      if (!data.length) return;
      obj.margin_plan_order_source = obj.margin_plan_order_source.concat(data);
      return;
    }

    if (name === "margin_trades_source") {
      if (!data.length) return;
      obj.margin_trades_source = obj.margin_trades_source.concat(data);
      return;
    }

    if (name === "margin_safety") {
      obj.margin_safety_source = data;
      return;
    }
  },
};

export default funs;
