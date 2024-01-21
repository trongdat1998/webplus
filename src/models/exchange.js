/**
 * 行情交易
 */
import getData from "../services/getData";
import { message } from "../lib";
import route_map from "../config/route_map";
import helper from "../utils/helper";
import math from "../utils/mathjs";
import WSDATA from "./data_source";
import cookie from "../utils/cookie";

export default {
  namespace: "exchange",

  state: {
    quoteMode: localStorage.quoteMode || "Dark",
    // 下单
    order_side: "BUY", // BUY=买, SELL = 卖
    order_type: "limit", // LIMIT=限价买, MARKET = 市价
    symbol_id: "", // 币对ID
    symbol_info: {},
    exchange_id: "", // market id
    client_order_id: "", // 客户端订单id
    order_time: 0, // GTC = 取消前有效, FOK = 全数执行或立即取消，IOC = 立刻执行或取消
    buy_price: "", // 买入价格
    buy_quantity: "", // 买入数量
    buy_max: 0, // 限价买入最大值，根据用户价格进行计算
    sale_price: "", // 卖出价格
    sale_quantity: "", // 卖出数量
    sale_max: 0, // 限价卖出最大值，用户余额

    buy_auto: false,
    sale_auto: false,

    buy_progress: 0, // 买入进度条
    sale_progress: 0, // 卖出进度条

    digitMerge: [], // 币对的小数位配置 , 如：0.1,0.01,0.0001
    aggTrade_digits: "", // 默认选择小数位，行情深度合并使用
    max_digits: "", // 价格精度 小数位最大值,如 8 表示小数留8位
    base_precision: "", // 数量精度 如 8 表示小数留8位
    quote_precision: "", // 金额精度 如 8 表示小数留8位
    min_price_precision: "", // 价格交易step, 如 0.1
    min_trade_quantity: "", // 数量交易step 如 0.1
    min_trade_amount: "", // 金额交易step  如 0.1

    // 卖出币种id,name及数量
    token1: "", // token1 id
    token1_name: "",
    token1_quantity: "0.00000000", // 市价交易买入最大值
    // 买入币种及数量
    token2: "", // token2 id
    token2_name: "",
    token2_quantity: "0.00000000", // 市价交易卖出最大值
    // 下单状态
    createOrderStatus: {
      "limit-BUY": false,
      "limit-SELL": false,
      "market-BUY": false,
      "market-SELL": false,
    },

    limitBUY: false,
    limitSELL: false,
    marketBUY: false,
    marketSELL: false,

    // 计划下单状态
    // createPlanOrderStatus: {
    //   BUY: false,
    //   SELL: false,
    // },
    createBUYPlanOrderStatus: false,
    createSELLPlanOrderStatus: false,

    // 当前图标 kline or depth
    chartType: "kline",

    // 最新成交
    newTrade: [],
    newTradeSource: [], // 源数据
    newTradeDigits: 8, // 最新成交数据小数位
    newTradingLimit: 20,

    // 盘口阴影分母，计算规则：buy+sell取平均值
    aggTrade_average: 10000000, // 平均值
    aggTrade_total_buy: 0, // 买盘交易总额
    aggTrade_total_sell: 0, // 买盘交易总额
    aggTrade_type: "all", // 展示选项，all，buy，sell
    aggTrade_mount: 40, // buy，sell显示条数
    aggTrade_limit: 40, // 盘口数据量

    // 盘口数据
    aggTrade_data: {
      sell: [],
      buy: [],
    },

    // 深度图数据, 盘口数据
    depth_source: {
      a: [],
      b: [],
    },
    depth: {
      sell: [],
      buy: [],
    },
    // 合并深度数据
    mergedDepth_source: {
      a: [],
      b: [],
    },
    mergedDepth: {
      a: [],
      b: [],
    },

    // tokenInfo
    tokenInfo: {},
    tokenInfoSource: {},

    datafeed_reset: false,

    sell_config: true, // 默认可售
    buy_config: true, //默认可买
    indices_source: {},
    indices: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *token_info({ payload, callback }, { call, put }) {
      const result = yield call(getData("token_info"), { payload });
      if (result.code === "OK") {
        callback && callback(result.data);
      } else {
        console.error(result.msg);
      }
    },
    *sell_config({ payload }, { call, put, select }) {
      if (!cookie.read("account_id")) return;

      const result = yield call(getData("sell_config"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            sell_config: Boolean(result.data && result.data.canSell),
            buy_config: Boolean(result.data && result.data.canBuy),
          },
        });
      }
    },
    // 最新成交
    // todelete 2020.08.31
    // *set_newTrade({ payload }, { call, put }) {
    //   let newTradeSource = [];
    //   if (payload.newTradeSource) {
    //     newTradeSource = payload.newTradeSource;
    //   } else {
    //     const result = yield call(getData("trade"), {
    //       payload: {
    //         symbol: payload.symbol,
    //         limit: payload.limit,
    //       },
    //       method: "get",
    //     });
    //     if (result.code == "OK") {
    //       newTradeSource = result.data.data;
    //     }
    //   }
    //   WSDATA.clear("newTradeSource");
    //   WSDATA.setData("newTradeSource", newTradeSource);
    //   // yield put({
    //   //   type: "save",
    //   //   payload: {
    //   //     newTradeSource
    //   //   }
    //   // });
    // },

    // http 获取深度图 盘口数据
    // todelete 2020.08.31
    // *get_depth_data({ payload }, { call, select }) {
    //   const aggTrade_digits = yield select(
    //     (state) => state.layout.aggTrade_digits
    //   );
    //   if (!aggTrade_digits) return;
    //   // http 请求数据
    //   const [result, result2] = [
    //     yield call(getData("depth"), {
    //       payload,
    //       method: "get",
    //     }),
    //     yield call(getData("depth"), {
    //       payload: {
    //         ...payload,
    //         dumpScale:
    //           aggTrade_digits <= 0 ? aggTrade_digits - 1 : aggTrade_digits,
    //       },
    //       method: "get",
    //     }),
    //   ];
    //   if (result.code == "OK" && result.data && result.data.data[0]) {
    //     const depth_source = result.data.data[0];
    //     // 更新深度数据
    //     WSDATA.setData("depth_source", depth_source);
    //   }
    //   if (result2.code == "OK" && result2.data && result2.data.data[0]) {
    //     const mergedDepth_source = result2.data.data[0];
    //     // 更新深度数据
    //     WSDATA.setData("mergedDepth_source", mergedDepth_source);
    //   }
    // },
    // 深度图更新数据
    // todelete 2020.08.31
    // *updateDepth({ payload }, { put, select }) {
    //   //const depth_source = yield select(state => state.exchange.depth_source);
    //   const depth_source = WSDATA.getData("depth_source");
    //   const depth_limit = yield select((state) => state.layout.depth_limit);
    //   const depth = {
    //     a: [],
    //     b: [],
    //   };

    //   const ar = new Array(depth_limit).fill(1);
    //   ar.forEach((item, i) => {
    //     if (depth_source.a && depth_source.a[i]) {
    //       depth.a.push(depth_source.a[i]);
    //     }
    //     if (depth_source.b && depth_source.b[i]) {
    //       depth.b.push(depth_source.b[i]);
    //     }
    //   });
    //   yield put({
    //     type: "setDepth",
    //     payload: {
    //       depth,
    //       depth_limit,
    //     },
    //   });
    // },
    //  盘口数据更新
    // todelete 2020.08.31
    // *updateHandicap({ payload }, { call, put, select }) {
    //   const depth_source = WSDATA.getData("mergedDepth_source");
    //   const { aggTrade_type, aggTrade_limit } = yield select(
    //     (state) => state.exchange
    //   );
    //   const { quote_precision, aggTrade_digits } = yield select(
    //     (state) => state.layout
    //   );
    //   const ar = new Array(
    //     aggTrade_type === "all" ? aggTrade_limit : aggTrade_limit * 2
    //   ).fill(1);
    //   let sell = [];
    //   let buy = [];
    //   //if(aggTrade_type === 'all'){
    //   ar.forEach((item, i) => {
    //     if (
    //       depth_source.a &&
    //       depth_source.a[i] &&
    //       (aggTrade_type === "all" || aggTrade_type === "sell")
    //     ) {
    //       let p = helper.digits2(depth_source.a[i][0], aggTrade_digits);
    //       if (p <= 0) return;
    //       if (sell.length) {
    //         if (p !== sell[sell.length - 1]["price"]) {
    //           sell.push({
    //             price: p,
    //             amount: depth_source.a[i][1],
    //           });
    //         } else {
    //           sell[sell.length - 1]["amount"] = math
    //             .chain(math.bignumber(sell[sell.length - 1]["amount"] || 0))
    //             .add(math.bignumber(depth_source.a[i][1] || 0))
    //             .format({
    //               notation: "fixed",
    //             })
    //             .done();
    //         }
    //       } else {
    //         sell.push({
    //           price: p,
    //           amount: depth_source.a[i][1],
    //           total: helper.digits(
    //             math
    //               .chain(math.bignumber(p))
    //               .multiply(math.bignumber(depth_source.a[i][1]))
    //               .format({
    //                 notation: "fixed",
    //               })
    //               .done(),
    //             quote_precision
    //           ),
    //         });
    //       }
    //       sell[sell.length - 1]["total"] = helper.digits(
    //         math
    //           .chain(math.bignumber(sell[sell.length - 1]["price"]))
    //           .multiply(math.bignumber(sell[sell.length - 1]["amount"]))
    //           .format({
    //             notation: "fixed",
    //           })
    //           .done(),
    //         quote_precision
    //       );
    //       // 累加 交易额
    //       sell[sell.length - 1]["grandTotal"] = helper.digits(
    //         math
    //           .chain(
    //             sell[sell.length - 2]
    //               ? math.bignumber(sell[sell.length - 2]["grandTotal"])
    //               : 0
    //           )
    //           .add(math.bignumber(sell[sell.length - 1]["total"]))
    //           .format({
    //             notation: "fixed",
    //           })
    //           .done(),
    //         quote_precision
    //       );
    //       // 累加 数量
    //       sell[sell.length - 1]["grandAmount"] = math
    //         .chain(
    //           sell[sell.length - 2]
    //             ? math.bignumber(sell[sell.length - 2]["grandAmount"])
    //             : 0
    //         )
    //         .add(math.bignumber(sell[sell.length - 1]["amount"]))
    //         .format({
    //           notation: "fixed",
    //         })
    //         .done();
    //     }
    //     if (
    //       depth_source.b &&
    //       depth_source.b[i] &&
    //       (aggTrade_type === "all" || aggTrade_type === "buy")
    //     ) {
    //       let p = helper.digits(depth_source.b[i][0], aggTrade_digits);
    //       if (p <= 0) return;
    //       if (buy.length) {
    //         if (p !== buy[buy.length - 1]["price"]) {
    //           buy.push({
    //             price: p,
    //             amount: depth_source.b[i][1],
    //           });
    //         } else {
    //           buy[buy.length - 1]["amount"] = math
    //             .chain(math.bignumber(buy[buy.length - 1]["amount"] || 0))
    //             .add(math.bignumber(depth_source.b[i][1] || 0))
    //             .format({
    //               notation: "fixed",
    //             })
    //             .done();
    //         }
    //       } else {
    //         buy.push({
    //           price: p,
    //           amount: depth_source.b[i][1],
    //         });
    //       }
    //       buy[buy.length - 1]["total"] = helper.digits(
    //         math
    //           .chain(math.bignumber(buy[buy.length - 1]["price"]))
    //           .multiply(math.bignumber(buy[buy.length - 1]["amount"]))
    //           .format({
    //             notation: "fixed",
    //           })
    //           .done(),
    //         quote_precision
    //       );
    //       // 累加 交易额
    //       buy[buy.length - 1]["grandTotal"] = helper.digits(
    //         math
    //           .chain(
    //             buy[buy.length - 2]
    //               ? math.bignumber(buy[buy.length - 2]["grandTotal"])
    //               : 0
    //           )
    //           .add(math.bignumber(buy[buy.length - 1]["total"]))
    //           .format({
    //             notation: "fixed",
    //           })
    //           .done(),
    //         quote_precision
    //       );
    //       // 累加 数量
    //       buy[buy.length - 1]["grandAmount"] = math
    //         .chain(
    //           buy[buy.length - 2]
    //             ? math.bignumber(buy[buy.length - 2]["grandAmount"])
    //             : 0
    //         )
    //         .add(math.bignumber(buy[buy.length - 1]["amount"]))
    //         .format({
    //           notation: "fixed",
    //         })
    //         .done();
    //     }
    //   });
    //   //sell.reverse();
    //   //}
    //   yield put({
    //     type: "save",
    //     payload: {
    //       aggTrade_data: {
    //         sell,
    //         buy,
    //       },
    //     },
    //   });

    //   // 设置 盘口平均值
    //   yield put({
    //     type: "setAverage",
    //     payload: {
    //       aggTrade_type,
    //       quote_precision,
    //     },
    //   });
    // },
    // 请求币种余额
    *get_available({ payload }, { call, put, select }) {
      if (!cookie.read("account_id")) return;
      payload.token_ids = payload.tokenId;
      const result = yield call(getData("get_asset"), {
        payload,
      });
      if (result.code === "OK" && result.data[0]) {
        let data = {
          [payload.name + "_quantity"]: result.data[0]["free"],
        };
        if (payload.name == "token1") {
          data["sale_max"] = result.data[0]["free"];
        }
        const buy_price = yield select((state) => state.exchange.buy_price);
        // 最大值保持数量精度
        const base_precision = yield select(
          (state) => state.layout.base_precision
        );
        if (payload.name == "token2" && buy_price) {
          data["buy_max"] = helper.digits(
            math
              .chain(math.bignumber(result.data[0]["free"]))
              .divide(math.bignumber(buy_price))
              .format({
                notation: "fixed",
              })
              .done(),
            base_precision
          );
        }
        yield put({
          type: "save",
          payload: {
            ...data,
          },
        });
      } else {
        // 登录失效
        if (result.code === 30000) {
          message.error(result.msg);
        }
      }
    },
    // update 下单数字，buy_max
    // 下单
    *createOrder({ payload, success }, { call, put, select }) {
      // const { createOrderStatus } = yield select((state) => state.exchange);
      // Modified by Coda 因为有买卖同时进行的bug
      const exchange = yield select((state) => state.exchange);
      if (exchange[`${payload.type}${payload.side}`]) {
        return;
      }
      yield put({
        type: "save",
        payload: {
          [`${payload.type}${payload.side}`]: true,
          // createOrderStatus: Object.assign({}, createOrderStatus, {
          //   [payload.type + "-" + payload.side]: true,
          // }),
        },
      });
      const { order_type, tokenInfo } = yield select((state) => state.exchange);
      let data = { ...payload };
      // 市价下单时，
      if (order_type == "market") {
        data.price = tokenInfo.c;
        delete data.price;
      }
      try {
        const result = yield call(getData("createOrder"), {
          payload: data,
        });
        const ws = yield select((state) => state.layout.ws);
        // 下单成功
        if (result.code == "OK") {
          if (ws.ws.readyState != 1) {
            let open_orders = yield select((state) => state.layout.open_orders);
            yield put({
              type: "layout/save",
              payload: {
                open_orders: [result.data].concat(open_orders),
              },
            });
          }
          success && success();
        } else {
          message.error(result.msg);
        }
      } catch (err) {
        message.error(err);
      }
      yield put({
        type: "save",
        payload: {
          order_type: payload.order_type,
          order_side: payload.order_side,
          [`${payload.type}${payload.side}`]: false,
          // createOrderStatus: Object.assign({}, createOrderStatus, {
          //   [payload.type + "-" + payload.side]: false,
          // }),
        },
      });
    },

    *order_cancel_all({ payload }, { all, call, put }) {
      const result = yield call(getData("order_cancel_all"), {
        payload,
      });
      if (result.code == "OK" && result.data && result.data.success) {
        message.info(window.appLocale.messages["已成功提交全部撤单申请"]);
      } else {
        result.msg && message.error(result.msg);
      }
    },

    *handleChange({ payload }, { select, put }) {
      yield put({
        type: "save",
        payload,
      });
    },

    // http 获取指数 或 ws 写入指数数据
    *get_indices_data({ payload }, { call, put, select }) {
      let indices_source = {};
      // ws 写入数据
      if (payload.indices_source) {
        indices_source = payload.indices_source;
      } else {
        // http 请求数据
        const result = yield call(getData("indices"), {
          payload,
          method: "get",
        });
        if (result.code == "OK" && result.data) {
          indices_source = result.data.data;
        }
      }
      // 更新深度数据
      WSDATA.setData("indices_source", indices_source);
    },

    // 创建计划委托
    *createPlanOrder({ payload, success }, { select, call, put }) {
      const exchange = yield select((state) => state.exchange);
      if (exchange[`create${payload.side}PlanOrderStatus`]) {
        return;
      }
      yield put({
        type: "save",
        payload: {
          [`create${payload.side}PlanOrderStatus`]: true,
        },
      });
      const result = yield call(getData("create_plan_order"), {
        payload,
      });
      if (result.code == "OK" && result.data) {
        message.info(window.appLocale.messages["下单成功"]);
        success && success();
      } else {
        message.error(result.msg);
      }
      yield put({
        type: "save",
        payload: {
          [`create${payload.side}PlanOrderStatus`]: false,
        },
      });
    },

    *cancelPlanOrder({ payload }, { call, put }) {
      const result = yield call(getData("cancel_plan_order"), {
        payload,
      });
      if (result.code == "OK" && result.data) {
        message.info(window.appLocale.messages["撤单成功"]);
      }
    },

    *cancelAllPlanOrder({ payload }, { call, put }) {
      const result = yield call(getData("cancel_all_plan_order"), {
        payload,
      });
      if (result.code == "OK" && result.data) {
        message.info(window.appLocale.messages["撤单成功"]);
      }
    },

    *getPlanOrderDetail({ payload }, { call, put }) {
      const result = yield call(getData("get_plan_order_detail"), {
        payload,
      });
      if (result.code == "OK" && result.data) {
        return result.data;
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    // 余额更新
    // action.payload = { user_balance:{}, base_precision: xxx }
    setAvailable(state, action) {
      const token1 = state.token1;
      const token2 = state.token2;
      const buy_price = state.buy_price;
      const data = action.payload.user_balance || {};
      const base_precision = state.base_precision;
      let obj = {};
      obj["token1_quantity"] = data[token1] ? data[token1].free : 0;
      obj["sale_max"] = data[token1] ? data[token1].free : 0;
      obj["token2_quantity"] = data[token2] ? data[token2].free : 0;
      obj["buy_max"] = 0;
      if (buy_price && obj["token2_quantity"]) {
        obj["buy_max"] = helper.digits(
          math
            .chain(math.bignumber(obj["token2_quantity"]))
            .divide(math.bignumber(buy_price))
            .format({ notation: "fixed" })
            .done(),
          base_precision
        );
      }
      return { ...state, ...obj };
    },

    // todelete 20200828
    // setAvailable(state, action) {
    //   const token1 = state.token1;
    //   const token2 = state.token2;
    //   const buy_price = state.buy_price;
    //   const data = action.payload.user_balance;
    //   const base_precision = action.payload.base_precision;
    //   let obj = {
    //     token1_quantity: 0,
    //     sale_max: 0,
    //     token2_quantity: 0,
    //     buy_max: 0
    //   };
    //   data.forEach(item => {
    //     if (item.tokenId === token1) {
    //       obj["token1_quantity"] = item.free;
    //       obj["sale_max"] = item.free;
    //     }
    //     if (item.tokenId === token2) {
    //       obj["token2_quantity"] = item.free;
    //       if (buy_price) {
    //         obj["buy_max"] = helper.digits(
    //           math
    //             .chain(math.bignumber(item.free))
    //             .divide(math.bignumber(buy_price))
    //             .format({
    //               notation: "fixed"
    //             })
    //             .done(),
    //           base_precision
    //         );
    //       }
    //     }
    //   });
    //   return { ...state, ...obj };
    // },

    // 最新成交新增数据
    // todelete 2020.08.31
    //   add_trade(state, action) {
    //     let data = action.payload.add_trade.concat(state.newTradeSource);
    //     data.length = state.newTradingLimit;
    //     return { ...state, newTradeSource: data };
    //   },

    //   setDepth(state, action) {
    //     let buy = [];
    //     let sell = [];
    //     let data = action.payload.depth;

    //     const ar = new Array(Math.max(data.b.length, data.a.length)).fill(1);
    //     ar.forEach((item, i) => {
    //       if (i < action.payload.depth_limit) {
    //         if (
    //           data.b[i] &&
    //           data.b[i][0] &&
    //           data.b[0] &&
    //           data.b[0][0] &&
    //           Math.abs((data.b[i][0] - data.b[0][0]) / data.b[0][0]) <= 0.3
    //         ) {
    //           buy.push({
    //             price: data.b[i][0],
    //             amount: data.b[i][1],
    //           });
    //         }
    //         if (
    //           data.a[i] &&
    //           data.a[i][0] &&
    //           data.a[0] &&
    //           data.a[0][0] &&
    //           Math.abs((data.a[i][0] - data.a[0][0]) / data.a[0][0]) <= 0.3
    //         ) {
    //           sell.push({
    //             price: data.a[i][0],
    //             amount: data.a[i][1],
    //           });
    //         }
    //       }
    //     });
    //     //sell.reverse();
    //     for (let i = 0; i < buy.length; i++) {
    //       let t = 0;
    //       for (let n = 0; n <= i; n++) {
    //         t += buy[n]["amount"] * 1;
    //       }
    //       buy[i]["total"] = t;
    //     }
    //     for (let i = 0; i < sell.length; i++) {
    //       let t = 0;
    //       for (let n = 0; n <= i; n++) {
    //         t += sell[n]["amount"] * 1;
    //       }
    //       sell[i]["total"] = t;
    //     }
    //     return {
    //       ...state,
    //       depth: {
    //         buy,
    //         sell,
    //       },
    //     };
    //   },

    //   // 设置盘口平均值
    //   setAverage(state, action) {
    //     let total = 0;
    //     let total2 = 0;
    //     let average = 0;
    //     let ar = [];
    //     const aggTrade_data = state.aggTrade_data;
    //     const quote_precision = action.payload.quote_precision || 6;
    //     //if (state.depth.buy.length && state.depth.sell.length) {
    //     // 重新计算平均值 aggTrade_average
    //     if (action.payload.aggTrade_type == "all") {
    //       ar = new Array(state.aggTrade_mount).fill(1);
    //       ar.forEach((item, i) => {
    //         if (aggTrade_data.buy[i]) {
    //           // total += Acc.mul(
    //           //   Number(aggTrade_data.buy[i].amount),
    //           //   Number(aggTrade_data.buy[i].price)
    //           // );
    //           total = helper.digits(
    //             math
    //               .chain(math.bignumber(total))
    //               .add(math.bignumber(aggTrade_data.buy[i]["total"]))
    //               .format({
    //                 notation: "fixed",
    //               })
    //               .done(),
    //             quote_precision
    //           );
    //         }
    //         if (aggTrade_data.sell[i]) {
    //           // total2 += Acc.mul(
    //           //   Number(aggTrade_data.sell[i].amount),
    //           //   Number(aggTrade_data.sell[i].price)
    //           // );
    //           total2 = helper.digits(
    //             math
    //               .chain(math.bignumber(total2))
    //               .add(math.bignumber(aggTrade_data.sell[i]["total"]))
    //               .format({
    //                 notation: "fixed",
    //               })
    //               .done(),
    //             quote_precision
    //           );
    //         }
    //       });

    //       let a1 = aggTrade_data.buy.length
    //         ? helper.digits(
    //             math
    //               .chain(math.bignumber(total))
    //               .divide(Math.min(aggTrade_data.buy.length, ar.length))
    //               .format({
    //                 notation: "fixed",
    //               })
    //               .done(),
    //             quote_precision
    //           )
    //         : 0;
    //       let a2 = aggTrade_data.sell.length
    //         ? helper.digits(
    //             math
    //               .chain(math.bignumber(total2))
    //               .divide(Math.min(aggTrade_data.sell.length, ar.length))
    //               .format({
    //                 notation: "fixed",
    //               })
    //               .done(),
    //             quote_precision
    //           )
    //         : 0;
    //       // average = aggTrade_data.buy.length
    //       //   ? Acc.div(total, aggTrade_data.buy.length, 8)
    //       //   : 0 +
    //       //     (aggTrade_data.sell.length
    //       //       ? Acc.div(total2, aggTrade_data.sell.length, 8)
    //       //       : 0);
    //       average = math
    //         .chain(math.bignumber(a1))
    //         .add(math.bignumber(a2))
    //         .divide(2)
    //         .format({
    //           notation: "fixed",
    //           precision: 6,
    //         })
    //         //.round(quote_precision)
    //         .done();
    //     }
    //     if (action.payload.aggTrade_type == "buy") {
    //       ar = new Array(state.aggTrade_mount * 2).fill(1);
    //       ar.forEach((item, i) => {
    //         if (aggTrade_data.buy[i]) {
    //           // total += Acc.mul(
    //           //   Number(aggTrade_data.buy[i].amount),
    //           //   Number(aggTrade_data.buy[i].price)
    //           // );
    //           total = math
    //             .chain(math.bignumber(total))
    //             .add(math.bignumber(aggTrade_data.buy[i]["total"]))
    //             .format({
    //               notation: "fixed",
    //             })
    //             .done();
    //         }
    //       });
    //       // average =  Acc.div(
    //       //   total,
    //       //   Math.min(aggTrade_data.buy.length, ar.length),
    //       //   8
    //       // );
    //       average = math
    //         .chain(math.bignumber(total))
    //         .divide(Math.min(aggTrade_data.buy.length, ar.length))
    //         .format({
    //           notation: "fixed",
    //           precision: 6,
    //         })
    //         //.round(6)
    //         .done();
    //     }
    //     if (action.payload.aggTrade_type == "sell") {
    //       ar = new Array(state.aggTrade_mount * 2).fill(1);
    //       ar.forEach((item, i) => {
    //         if (aggTrade_data.sell[i]) {
    //           // total += Acc.mul(
    //           //   aggTrade_data.sell[i].amount,
    //           //   aggTrade_data.sell[i].price
    //           // );
    //           total2 = math
    //             .chain(math.bignumber(total2))
    //             .add(math.bignumber(aggTrade_data.sell[i]["total"]))
    //             .format({
    //               notation: "fixed",
    //             })
    //             .done();
    //         }
    //       });
    //       // average = Acc.div(
    //       //   total,
    //       //   Math.min(aggTrade_data.sell.length, ar.length),
    //       //   8
    //       // );
    //       average = math
    //         .chain(math.bignumber(total2))
    //         .divide(Math.min(aggTrade_data.sell.length, ar.length))
    //         .format({
    //           notation: "fixed",
    //           precision: 6,
    //         })
    //         //.round(6)
    //         .done();
    //     }
    //     //}
    //     return {
    //       ...state,
    //       ...action.payload,
    //       aggTrade_average: average,
    //       aggTrade_total_buy: total || 0,
    //       aggTrade_total_sell: total2 || 0,
    //     };
    //   },

    setProgress(state, { payload }) {
      return {
        ...state,
        sale_progress: payload.sale_progress,
        buy_progress: payload.buy_progress,
      };
    },
  },
};
