import WSDATA from "./data_source";
import getData from "../services/getData";
import helper from "../utils/helper";
import route_map from "../config/route_map";
import CONST from "../config/const";

export default {
  namespace: "ws",

  state: {
    /**
     * 币对的行情数据
     * symbol_quote : {
     *  '301ETCBTC': {
     *    "t": "1531193421003",//time
     *    "s": "USDTBTC", // symbol
     *    "c": "0.1531193171219",//close price
     *    "h": "0.1531193171219",//high price
     *    "l": "0.1531193168802",//low price
     *    "o": "0.1531193171219", //open price
     *    "v": "0.0", //volume
     *    "qv": 123123, // 成交额
     *    "e": "301" //exchange id,
     *    "m": -0.1, // 涨跌幅
     *  }
     * }
     */
    symbol_quote: {},
    /**
     * {
     * balanceCreatedAt: "1563440481906"
     * balanceUpdatedAt: "1566997406037"
     * btcValue: "0"
     * free: "10000"
     * locked: "30000"
     * position: "0"
     * tokenId: ""
     * tokenName: ""
     * total: "40000"
     * usdtValue: "0"
     * }
     */
    user_balance: [],
    // 盘口
    merged_depth: {
      // 301.BTCUSDT2:{
      //   a:[],
      //   b:[]
      // }
    },
    // 深度图
    depth: {
      // 301.BTCUSDT:{
      //   a:[],
      //   b:[]
      // }
    },
    // 最新成交
    trades: {
      // 301ETCBTC:[]
    },
    // 指数
    indices: {
      //USDT:{}
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({
        type: "sync",
        payload: {},
      });
    },
  },

  effects: {
    // 同步data_source数据到model
    *sync({ payload }, { put, select }) {
      while (true) {
        const quotes = WSDATA.getData("symbol_quote_source");
        const user_balance = WSDATA.getData("user_balance_source");
        const mergedDepth_source = WSDATA.getData("mergedDepth_source");
        const depth_source = WSDATA.getData("depth_source");
        const newTradeSource = WSDATA.getData("newTradeSource");
        const indices = WSDATA.getData("indices_source");
        yield put({
          type: "save",
          payload: {
            symbol_quote: { ...quotes },
            merged_depth: mergedDepth_source,
            depth: depth_source,
            trades: newTradeSource,
            indices,
          },
        });
        const userinfo = yield select((state) => state.layout.userinfo);
        const config = yield select((state) => state.layout.config) || [];
        const new_order_source = WSDATA.getData("new_order_source");
        const new_plan_order_source = WSDATA.getData("new_plan_order_source");
        const history_trades_source = WSDATA.getData("history_trades_source");
        const option_tradeable_source = WSDATA.getData(
          "option_tradeable_source"
        );
        const option_balance_source = WSDATA.getData("option_balance_source");
        const option_order_source = WSDATA.getData("option_order_source");
        const option_position_source = WSDATA.getData("option_position_source");
        const future_tradeable_source = WSDATA.getData(
          "future_tradeable_source"
        );
        const future_order_source = WSDATA.getData("future_order_source");
        const future_position_source = WSDATA.getData("future_position_source");

        const margin_order_source = WSDATA.getData("margin_new_order_source");
        const margin_plan_order_source = WSDATA.getData(
          "margin_plan_order_source"
        );
        const margin_trades_source = WSDATA.getData("margin_trades_source");
        const margin_balance_source = WSDATA.getData("margin_balance_source");
        const margin_safety_source = WSDATA.getData("margin_safety_source");

        const pathname = window.location.pathname;
        if (userinfo.userId) {
          // 同步资产信息
          if (pathname.indexOf(route_map.exchange) > -1) {
            yield put({
              type: "exchange/setAvailable",
              payload: {
                user_balance,
              },
            });
          }
          // 同步币币资产
          if (Object.keys(user_balance).length) {
            yield put({
              type: "user_balance",
              payload: {
                user_balance_source: user_balance,
              },
            });
          }
          // 同步当前委托，历史委托订单信息
          if (new_order_source && new_order_source.length) {
            yield put({
              type: "layout/new_order",
              payload: {
                new_order_source,
              },
            });
          }
          // 计划委托，历史计划委托
          if (new_plan_order_source && new_plan_order_source.length) {
            yield put({
              type: "layout/plan_order",
              payload: {
                new_plan_order_source,
              },
            });
          }
          // 历史成交
          if (history_trades_source && history_trades_source.length) {
            yield put({
              type: "layout/history_trades",
              payload: {
                history_trades_source,
              },
            });
          }
          // 合约 资产
          if (Object.keys(future_tradeable_source).length) {
            yield put({
              type: "future/save",
              payload: {
                future_tradeable: future_tradeable_source,
              },
            });
          }
          // 合约 当前委托
          if (future_order_source.length) {
            yield put({
              type: "future/update_order",
              payload: {
                future_order_source,
              },
            });
          }
          // 合约 当前持仓
          yield put({
            type: "future/update_position",
            payload: {
              future_position_source,
              config,
            },
          });

          // 杠杆 当前持仓
          yield put({
            type: "lever/setAvailable",
            payload: {
              lever_balance: margin_balance_source,
            },
          });

          // 同步当前委托，历史委托订单信息
          if (margin_order_source && margin_order_source.length) {
            yield put({
              type: "lever/ws_margin_new_order",
              payload: {
                margin_order_source,
              },
            });
          }

          // 同步计划委托，历史计划委托订单信息
          if (margin_plan_order_source && margin_plan_order_source.length) {
            yield put({
              type: "lever/ws_margin_plan_order",
              payload: {
                margin_plan_order_source,
              },
            });
          }

          // 历史成交
          if (margin_trades_source && margin_trades_source.length) {
            yield put({
              type: "lever/ws_margin_trades",
              payload: {
                margin_trades_source,
              },
            });
          }
          // 安全度
          yield put({
            type: "lever/ws_margin_safety",
            payload: {
              margin_safety_source,
            },
          });
        }
        yield helper.delay(CONST.refresh_ws);
      }
    },
    // symbol_quote http loop
    *broker_quote_http({ payload }, { call }) {
      try {
        const result = yield call(getData("quote"), { payload, method: "get" });
        if (result.code == "OK" && result.data && result.data.data) {
          WSDATA.setData("symbol_quote_source", result.data.data);
        }
      } catch (e) {}
    },
    // 用户资产http
    *balance_http({ payload }, { call }) {
      try {
        const result = yield call(getData("get_asset"), {
          payload,
          method: "get",
        });
        if (result.code == "OK" && result.data) {
          WSDATA.setData("user_balance_source", result.data);
        }
      } catch (e) {}
    },
    *merge_depth_http({ payload }, { call }) {
      try {
        const result = yield call(getData("depth"), { payload, method: "get" });
        if (result.code == "OK" && result.data && result.data.data) {
          WSDATA.setData(
            "mergedDepth_source",
            result.data.data,
            payload.symbol +
              (payload.dumpScale <= 0
                ? Number(payload.dumpScale) + 1
                : payload.dumpScale),
            1
          );
          if (result.data.data[0]) {
            const data = result.data.data[0];
            let d = {
              sendTime: data.t,
              currentTime: new Date().getTime(),
              diffTime: window.diff_time,
              id: data.e + data.s,
              topic: "mergedDepth",
              channel: "http",
            };
            d.fix = d.currentTime - d.sendTime - (window.diff_time || 0);
            if (d.fix >= 5000 && Math.abs(window.diff_time) <= 5000) {
              window.trackPageError({
                type: "delay",
                data: d,
              });
            }
          }
        }
      } catch (e) {}
    },
    *depth_http({ payload }, { call }) {
      try {
        const result = yield call(getData("depth"), { payload, method: "get" });
        if (result.code == "OK" && result.data && result.data.data) {
          WSDATA.setData(
            "depth_source",
            result.data.data,
            "depth" + payload.symbol,
            1
          );
        }
      } catch (e) {}
    },
    *trade_http({ payload }, { call }) {
      try {
        const result = yield call(getData("trade"), { payload, method: "get" });
        if (result.code == "OK" && result.data && result.data.data) {
          WSDATA.setData(
            "newTradeSource",
            result.data.data,
            "trade" + payload.symbol
          );
          const data = result.data.data[result.data.data.length - 1];
          let d = {
            sendTime: data.t,
            currentTime: new Date().getTime(),
            diffTime: window.diff_time,
            id: payload.symbol,
            topic: "trade",
            channel: "http",
          };
          d.fix = d.currentTime - d.sendTime - (window.diff_time || 0);
          // 误差在
          if (d.fix >= 5000 && Math.abs(window.diff_time) <= 5000) {
            window.trackPageError({
              type: "delay",
              data: d,
            });
          }
        }
      } catch (e) {}
    },
    *kline_http({ payload }, { call }) {
      try {
        const result = yield call(getData("kline_history"), {
          payload,
          method: "get",
        });
        if (result.code == "OK" && result.data && result.data.data) {
          WSDATA.setData(
            "kline_source",
            result.data.data,
            "kline_" + payload.id + payload.interval
          );
        }
      } catch (e) {}
    },
    // http 获取指数
    *get_indices_data({ payload }, { call }) {
      let indices_source = {};
      // http 请求数据
      try {
        const result = yield call(getData("indices"), {
          payload,
          method: "get",
        });
        if (result.code == "OK" && result.data) {
          indices_source = result.data.data;
        }
        // 更新深度数据
        WSDATA.setData("indices_source", indices_source);
      } catch (e) {}
    },
    // 指数k线 http
    *index_http({ payload }, { call }) {
      let indexKline_source = {};
      try {
        const result = yield call(getData("index_kline"), {
          payload,
          method: "get",
        });
        if (result.code == "OK" && result.data) {
          indexKline_source = result.data.data;
        }
        // 更新深度数据
        WSDATA.setData(
          "indexKline_source",
          indexKline_source,
          "indexKline_" + payload.symbol + "." + payload.interval
        );
      } catch (e) {}
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    // 更新资产
    user_balance(state, action) {
      const user_balance_source = action.payload.user_balance_source;
      if (!Object.keys(user_balance_source).length) {
        return { ...state };
      }
      const user_balance = helper.arrayClone(state.user_balance);
      let obj = {};
      user_balance.forEach((item) => {
        obj[item.tokenId] = item;
      });
      obj = Object.assign({}, obj, user_balance_source);
      let ar = [];
      Object.keys(obj).forEach((item) => {
        ar.push(obj[item]);
      });
      return { ...state, user_balance: ar };
    },
  },
};
