/**
 * 行情交易
 */
import getData from "../services/getData";
import { message } from "../lib";
import route_map from "../config/route_map";
import helper from "../utils/helper";
import math from "../utils/mathjs";
import WSDATA from "./data_source";
import Cookie from "../utils/cookie";
import CONST from "../config/const";

export default {
  namespace: "lever",

  state: {
    openMargin: true, // 是否已经开启杠杆
    quoteMode: localStorage.quoteMode || "Dark",
    lever_balances: [], // 杠杆资产列表
    lever_open_orders: [], // 当前委托
    lever_open_orders_more: true,
    lever_open_plan_orders: [], // 当前计划委托
    lever_open_plan_orders_more: true,
    lever_history_orders: [], // 历史委托
    lever_history_orders_more: true,
    lever_history_plan_orders: [], // 历史计划委托
    lever_history_plan_orders_more: true,
    lever_history_trades: [], // 历史成交
    lever_history_trades_more: true,
    force_close_orders: [], // 强平订单
    force_close_orders_more: true,
    loan_orders: [], // 当前借币
    loan_orders_more: true,
    repay_records: [], // 还币记录
    repay_records_more: true,

    // 下单
    order_side: "BUY", // BUY=买, SELL = 卖
    order_type: "limit", // LIMIT=限价买, MARKET = 市价

    // symbol_name: "", // 币名称
    // symbol: "", // 币对名称
    symbol_id: "", // 币对ID
    symbol_info: {}, // 币对信息
    exchange_id: "", // market id
    client_order_id: "", // 客户端订单id
    order_time: 0, // GTC = 取消前有效, FOK = 全数执行或立即取消，IOC = 立刻执行或取消

    buy_price: "", // 价格
    buy_quantity: "", // 数量
    buy_max: 0, // 限价买入最大值，根据用户价格进行计算

    sale_price: "", // 价格
    sale_quantity: "", // 数量
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

    // token1/token2
    // 基础币种
    token1: "", // token1 id
    token1_name: "",
    token1_quantity: "0.00000000", // 市价交易买入最大值
    // 计价币种
    token2: "", // token2 id
    token2_name: "",
    token2_quantity: "0.00000000", // 市价交易卖出最大值
    // 下单状态
    // createOrderStatus: {
    //   "limit-BUY": false,
    //   "limit-SELL": false,
    //   "market-BUY": false,
    //   "market-SELL": false,
    // },
    limitBUY: false,
    limitSELL: false,
    marketBUY: false,
    marketSELL: false,

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

    riskConfig: {}, // 杠杆风险配置
    borrowableTokens: [], // 可借的币种
    marginTokens: [], // 可以作为保证金的币种
    borrowableTokenMultiple: {}, // 可借币种倍数，用map结构保存，
    safety: "",
    leverAsset: {}, // 杠杆总资产
    availWithdrawAmount: 0, //杠杆可出金数量
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: "getRiskConfig" });
      dispatch({ type: "getMarginTokens" });
    },
  },

  effects: {
    *getRiskConfig({ payload }, { call, put }) {
      const result = yield call(getData("get_risk_config"), {
        payload,
        method: "GET",
      });
      if (result.code == "OK" && result.data && result.data.length) {
        let { withdrawLine, warnLine, appendLine, stopLine } = result.data[0];
        yield put({
          type: "save",
          payload: {
            riskConfig: {
              withdrawLine: Number(withdrawLine) * 100,
              warnLine: Number(warnLine) * 100,
              appendLine: Number(appendLine) * 100,
              stopLine: Number(stopLine) * 100,
            },
          },
        });
      }
    },
    *getMarginTokens({ payload }, { call, put }) {
      const result = yield call(getData("get_margin_tokens"), {
        payload,
        method: "GET",
      });
      if (result.code == "OK" && result.data) {
        const borrowableTokens = [];
        const marginTokens = [];
        // 可借币种倍数
        const borrowableTokenMultiple = {};
        result.data.forEach((item) => {
          if (item.canBorrow == true) {
            borrowableTokens.push(item);
            borrowableTokenMultiple[item.tokenId] = item;
          }
          marginTokens.push(item);
        });
        yield put({
          type: "save",
          payload: {
            borrowableTokens,
            marginTokens,
            borrowableTokenMultiple,
          },
        });
      } else {
        result.msg && message.error(result.msg);
      }
    },
    *getSafety({ payload }, { select, call, put }) {
      const { userinfo } = yield select((state) => state.layout);
      if (!userinfo || !userinfo.openMargin) {
        return;
      }
      const result = yield call(getData("get_safety"), {
        payload,
        method: "GET",
      });
      if (result.code == "OK" && result.data) {
        // WSDATA.setData("margin_safety", result.data);
        yield put({
          type: "save",
          payload: {
            safety: Number(result.data.safety) * 100,
          },
        });
      } else {
        if (result.code === 30000) {
          Cookie.del("account_id");
          window.sessionStorage.removeItem("userinfo");
        }
        result.msg && message.error(result.msg);
      }
    },
    // 获取杠杆总资产
    *getLeverTotalAsset({ payload }, { select, call, put }) {
      const { userinfo } = yield select((state) => state.layout);
      if (!userinfo || !userinfo.openMargin) {
        return;
      }
      const result = yield call(getData("get_lever_total_asset"), {
        payload,
        method: "GET",
      });
      if (result.code == "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            leverAsset: { ...result.data, unit: "USDT" },
          },
        });
      } else {
        if (result.code === 30000) {
          Cookie.del("account_id");
          window.sessionStorage.removeItem("userinfo");
        }
        result.msg && message.error(result.msg);
      }
    },
    // 获取杠杆资产
    *getLeverAsset({ payload }, { select, call, put }) {
      let { defaultAccountId, openMargin } = yield select(
        (state) => state.layout.userinfo
      );
      if (!defaultAccountId || "undefined" == defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
        if (!defaultAccountId) {
          return;
        }
      }
      if (!openMargin) {
        return;
      }
      const result = yield call(getData("get_lever_asset"), {
        payload,
        method: "GET",
      });
      if (result.code == "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            lever_balances: result.data,
          },
        });
        WSDATA.setData("margin_balance_source", result.data);
      } else {
        result.msg && message.error(result.msg);
      }
    },
    // 利率
    *queryTokenInterest({ payload }, { call }) {
      const result = yield call(getData("get_user_interest"), {
        payload,
        method: "GET",
      });
      if (result.code == "OK" && result.data) {
        return result.data;
      }
    },
    // 查询借贷情况
    *queryLoanSituation({ payload }, { select, call }) {
      const { openMargin } = yield select((state) => state.layout.userinfo);
      if (openMargin) {
        const result = yield call(getData("get_funding_cross"), {
          payload,
          method: "GET",
        });
        if (result.code == "OK" && result.data) {
          return result.data;
        }
      }
    },
    // 借币
    *loan({ payload }, { call, put }) {
      const result = yield call(getData("loan"), {
        payload,
      });
      if (result.code == "OK" && result.data.success == true) {
        message.info(window.appLocale.messages["借币成功"]);
        yield put({
          type: "refreshLoanOrders",
          payload: {
            refresh: true,
          },
        });
        yield put({ type: "getLeverAsset" });
        yield put({ type: "getLeverAllAsset" });
        return result.data;
      } else {
        message.error(window.appLocale.messages["借币失败"]);
      }
    },
    // 当前委托，历史委托，强平订单等历史数据
    *getOrders({ payload }, { select, put, call }) {
      let { openMargin, defaultAccountId } = yield select(
        (state) => state.layout.userinfo
      );
      if (!defaultAccountId || "undefined" == defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
        if (!defaultAccountId) {
          return;
        }
      }
      if (openMargin) {
        const ROWS_PER_PAGE = CONST.rowsPerPage2;
        const state = yield select((state) => state.lever);
        const { symbol_id, api } = payload;
        if (!state[api + "_more"] || state[api + "_loading"]) {
          return;
        }
        yield put({
          type: "save",
          payload: {
            [api + "_loading"]: true,
          },
        });
        const last_id =
          state[api] && state[api].length
            ? state[api][state[api].length - 1].orderId
            : 0;
        let params = {
          account_type: CONST.ACCOUNT_TYPE.MARGIN,
          account_id: defaultAccountId,
          from_order_id: last_id || 0,
          is_liquidation_order: api == "force_close_orders",
          limit: ROWS_PER_PAGE,
        };
        if (symbol_id) {
          params.symbol_id = symbol_id;
        }
        try {
          const result = yield call(getData(api), {
            payload: params,
            method: "get",
          });
          if (result.code == "OK") {
            const data = result.data;
            const source = state[api];
            // 去重
            let ar = helper.excludeRepeatArray("orderId", [...source, ...data]);
            ar.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
            yield put({
              type: "save",
              payload: {
                [api]: ar,
                [api + "_more"]: data.length == ROWS_PER_PAGE ? true : false,
                [api + "_loading"]: false,
              },
            });
          } else {
            result.msg && message.error(result.msg);
          }
        } catch (e) {}
        yield put({
          type: "save",
          payload: {
            [api + "_loading"]: false,
          },
        });
      }
    },
    // 历史成交,
    *getDeals({ payload }, { select, put, call }) {
      let { openMargin, defaultAccountId } = yield select(
        (state) => state.layout.userinfo
      );
      if (!defaultAccountId || "undefined" == defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
        if (!defaultAccountId) {
          return;
        }
      }
      if (openMargin) {
        const ROWS_PER_PAGE = CONST.rowsPerPage2;
        const {
          lever_history_trades_more,
          lever_history_trades_loading,
          lever_history_trades,
        } = yield select((state) => state.lever);
        // 没有更多数据或者正在加载中
        if (!lever_history_trades_more || lever_history_trades_loading) {
          return;
        }
        const lastId = lever_history_trades.length
          ? lever_history_trades[lever_history_trades.length - 1].tradeId
          : 0;
        let params = {
          from_trade_id: lastId || 0,
          limit: ROWS_PER_PAGE,
          ...payload,
        };
        yield put({
          type: "save",
          payload: {
            lever_history_trades_loading: true,
          },
        });
        try {
          const result = yield call(getData("lever_history_trades"), {
            payload: params,
            method: "get",
          });
          if (result.code == "OK") {
            const data = result.data;
            let ar = helper.excludeRepeatArray("tradeId", [
              ...lever_history_trades,
              ...data,
            ]);
            ar.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
            yield put({
              type: "save",
              payload: {
                lever_history_trades: ar,
                lever_history_trades_more:
                  data.length == ROWS_PER_PAGE ? true : false,
                lever_history_trades_loading: false,
              },
            });
          } else {
            result.msg && message.error(result.msg);
          }
        } catch (e) {}
        yield put({
          type: "save",
          payload: {
            lever_history_trades_loading: false,
          },
        });
      }
    },

    // 获取借币订单
    *getLoanOrders({ payload }, { select, put, call }) {
      let { openMargin, defaultAccountId } = yield select(
        (state) => state.layout.userinfo
      );
      if (!defaultAccountId || "undefined" == defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
        if (!defaultAccountId) {
          return;
        }
      }
      if (openMargin) {
        const ROWS_PER_PAGE = CONST.rowsPerPage2;
        const {
          loan_orders,
          loan_orders_more,
          loan_orders_loading,
        } = yield select((state) => state.lever);
        if (!loan_orders_more || loan_orders_loading) {
          return;
        }
        const params = {
          from_loan_id: loan_orders.length
            ? loan_orders[loan_orders.length - 1].loanOrderId
            : 0,
          limit: ROWS_PER_PAGE,
          ...payload,
        };
        try {
          yield put({
            type: "save",
            payload: {
              loan_orders_loading: true,
            },
          });
          const result = yield call(getData("get_loan_orders"), {
            payload: params,
            method: "GET",
          });
          if (result.code == "OK") {
            const data = result.data;
            yield put({
              type: "save",
              payload: {
                loan_orders: loan_orders.concat(data),
                loan_orders_more: data.length == ROWS_PER_PAGE,
                loan_orders_loading: false,
              },
            });
          } else {
            result.msg && message.error(result.msg);
          }
        } catch (e) {}
        yield put({
          type: "save",
          payload: {
            loan_orders_loading: false,
          },
        });
      }
    },

    // 刷新借币订单
    *refreshLoanOrders({ payload }, { select, put, call }) {
      let { openMargin, defaultAccountId } = yield select(
        (state) => state.layout.userinfo
      );
      if (!defaultAccountId || "undefined" == defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
        if (!defaultAccountId) {
          return;
        }
      }
      if (openMargin) {
        const ROWS_PER_PAGE = CONST.rowsPerPage2;
        try {
          yield put({
            type: "save",
            payload: {
              loan_orders_loading: true,
            },
          });
          const result = yield call(getData("get_loan_orders"), {
            payload: {
              from_loan_id: 0,
              limit: ROWS_PER_PAGE,
            },
            method: "GET",
          });
          if (result.code == "OK") {
            const data = result.data;
            yield put({
              type: "save",
              payload: {
                loan_orders: data,
                loan_orders_more: data.length == ROWS_PER_PAGE,
                loan_orders_loading: false,
              },
            });
          } else {
            result.msg && message.error(result.msg);
          }
        } catch (e) {}
        yield put({
          type: "save",
          payload: {
            loan_orders_loading: false,
          },
        });
      }
    },

    // 获取借币订单详细
    *getLoanOrderDetail({ payload }, { select, put, call }) {
      try {
        const result = yield call(getData("get_loan_orders"), {
          payload,
          method: "GET",
        });
        if (result.code == "OK") {
          const data = result.data;
          return data;
        } else {
          result.msg && message.error(result.msg);
        }
      } catch (e) {}
    },

    *getOrderDetail({ payload }, { call }) {
      const result = yield call(getData("margin_match_info"), { payload });
      if (result.code == "OK") {
        return result.data;
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

    // 借还历史
    *getRepayRecords({ payload }, { put, call, select }) {
      let { openMargin, defaultAccountId } = yield select(
        (state) => state.layout.userinfo
      );
      if (!defaultAccountId || "undefined" == defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
        if (!defaultAccountId) {
          return;
        }
      }
      if (openMargin) {
        const ROWS_PER_PAGE = CONST.rowsPerPage2;
        const {
          repay_records,
          repay_records_more,
          repay_records_loading,
        } = yield select((state) => state.lever);
        const params = {
          from_repay_id: repay_records.length
            ? repay_records[repay_records.length - 1].repayOrderId
            : 0,
          limit: ROWS_PER_PAGE,
        };
        if (!repay_records_more || repay_records_loading) {
          return;
        }
        yield put({
          type: "save",
          payload: {
            repay_records_loading: true,
          },
        });
        try {
          const result = yield call(getData("get_repay_records"), {
            payload: params,
            method: "GET",
          });
          if (result.code == "OK") {
            const data = result.data;
            yield put({
              type: "save",
              payload: {
                repay_records: repay_records.concat(data),
                repay_records_more: data.length == ROWS_PER_PAGE,
                repay_records_loading: false,
              },
            });
          }
        } catch (e) {}
        yield put({
          type: "save",
          payload: {
            repay_records_loading: false,
          },
        });
      }
    },

    *repay({ payload }, { call, put }) {
      const { repay_all } = payload;
      let api = repay_all ? "repayAll" : "repay";
      const result = yield call(getData(api), { payload });
      if (result.code == "OK" && result.data && result.data.success) {
        message.info(window.appLocale.messages["lever.alert.repaySuccess"]);
        yield put({
          type: "refreshLoanOrders",
          payload: {
            refresh: true,
          },
        });
        yield put({ type: "getLeverAsset" });
        yield put({ type: "getLeverAllAsset" });
      } else {
        result.msg && message.error(result.msg);
      }
    },

    *token_info({ payload, callback }, { call, put }) {
      const result = yield call(getData("token_info"), { payload });
      if (result.code === "OK") {
        callback && callback(result.data);
      } else {
        console.error(result.msg);
      }
    },
    *sell_config({ payload }, { call, put, select }) {
      if (!Cookie.read("account_id")) return;

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
    *set_newTrade({ payload }, { call, put }) {
      let newTradeSource = [];
      if (payload.newTradeSource) {
        newTradeSource = payload.newTradeSource;
      } else {
        const result = yield call(getData("trade"), {
          payload: {
            symbol: payload.symbol,
            limit: payload.limit,
          },
          method: "get",
        });
        if (result.code == "OK") {
          newTradeSource = result.data.data;
        }
      }
      WSDATA.clear("newTradeSource");
      WSDATA.setData("newTradeSource", newTradeSource);
      // yield put({
      //   type: "save",
      //   payload: {
      //     newTradeSource
      //   }
      // });
    },

    // http 获取深度图 盘口数据
    *get_depth_data({ payload }, { call, select }) {
      const aggTrade_digits = yield select(
        (state) => state.lever.aggTrade_digits
      );
      if (!aggTrade_digits) return;
      // http 请求数据
      const [result, result2] = [
        yield call(getData("depth"), {
          payload,
          method: "get",
        }),
        yield call(getData("depth"), {
          payload: {
            ...payload,
            dumpScale:
              aggTrade_digits <= 0 ? aggTrade_digits - 1 : aggTrade_digits,
          },
          method: "get",
        }),
      ];
      if (result.code == "OK" && result.data && result.data.data[0]) {
        const depth_source = result.data.data[0];
        // 更新深度数据
        WSDATA.setData("depth_source", depth_source);
      }
      if (result2.code == "OK" && result2.data && result2.data.data[0]) {
        const mergedDepth_source = result2.data.data[0];
        // 更新深度数据
        WSDATA.setData("mergedDepth_source", mergedDepth_source);
      }
    },
    // 深度图更新数据
    *updateDepth({ payload }, { put, select }) {
      //const depth_source = yield select(state => state.lever.depth_source);
      const depth_source = WSDATA.getData("depth_source");
      const depth_limit = yield select((state) => state.lever.depth_limit);
      const depth = {
        a: [],
        b: [],
      };

      const ar = new Array(depth_limit).fill(1);
      ar.forEach((item, i) => {
        if (depth_source.a && depth_source.a[i]) {
          depth.a.push(depth_source.a[i]);
        }
        if (depth_source.b && depth_source.b[i]) {
          depth.b.push(depth_source.b[i]);
        }
      });
      yield put({
        type: "setDepth",
        payload: {
          depth,
          depth_limit,
        },
      });
    },
    // 盘口数据更新
    *updateHandicap({ payload }, { call, put, select }) {
      const depth_source = WSDATA.getData("mergedDepth_source");
      const { aggTrade_type, aggTrade_limit } = yield select(
        (state) => state.lever
      );
      const { quote_precision, aggTrade_digits } = yield select(
        (state) => state.layout
      );
      const ar = new Array(
        aggTrade_type === "all" ? aggTrade_limit : aggTrade_limit * 2
      ).fill(1);
      let sell = [];
      let buy = [];
      //if(aggTrade_type === 'all'){
      ar.forEach((item, i) => {
        if (
          depth_source.a &&
          depth_source.a[i] &&
          (aggTrade_type === "all" || aggTrade_type === "sell")
        ) {
          let p = helper.digits2(depth_source.a[i][0], aggTrade_digits);
          if (p <= 0) return;
          if (sell.length) {
            if (p !== sell[sell.length - 1]["price"]) {
              sell.push({
                price: p,
                amount: depth_source.a[i][1],
              });
            } else {
              sell[sell.length - 1]["amount"] = math
                .chain(math.bignumber(sell[sell.length - 1]["amount"] || 0))
                .add(math.bignumber(depth_source.a[i][1] || 0))
                .format({
                  notation: "fixed",
                })
                .done();
            }
          } else {
            sell.push({
              price: p,
              amount: depth_source.a[i][1],
              total: helper.digits(
                math
                  .chain(math.bignumber(p))
                  .multiply(math.bignumber(depth_source.a[i][1]))
                  .format({
                    notation: "fixed",
                  })
                  .done(),
                quote_precision
              ),
            });
          }
          sell[sell.length - 1]["total"] = helper.digits(
            math
              .chain(math.bignumber(sell[sell.length - 1]["price"]))
              .multiply(math.bignumber(sell[sell.length - 1]["amount"]))
              .format({
                notation: "fixed",
              })
              .done(),
            quote_precision
          );
          // 累加 交易额
          sell[sell.length - 1]["grandTotal"] = helper.digits(
            math
              .chain(
                sell[sell.length - 2]
                  ? math.bignumber(sell[sell.length - 2]["grandTotal"])
                  : 0
              )
              .add(math.bignumber(sell[sell.length - 1]["total"]))
              .format({
                notation: "fixed",
              })
              .done(),
            quote_precision
          );
          // 累加 数量
          sell[sell.length - 1]["grandAmount"] = math
            .chain(
              sell[sell.length - 2]
                ? math.bignumber(sell[sell.length - 2]["grandAmount"])
                : 0
            )
            .add(math.bignumber(sell[sell.length - 1]["amount"]))
            .format({
              notation: "fixed",
            })
            .done();
        }
        if (
          depth_source.b &&
          depth_source.b[i] &&
          (aggTrade_type === "all" || aggTrade_type === "buy")
        ) {
          let p = helper.digits(depth_source.b[i][0], aggTrade_digits);
          if (p <= 0) return;
          if (buy.length) {
            if (p !== buy[buy.length - 1]["price"]) {
              buy.push({
                price: p,
                amount: depth_source.b[i][1],
              });
            } else {
              buy[buy.length - 1]["amount"] = math
                .chain(math.bignumber(buy[buy.length - 1]["amount"] || 0))
                .add(math.bignumber(depth_source.b[i][1] || 0))
                .format({
                  notation: "fixed",
                })
                .done();
            }
          } else {
            buy.push({
              price: p,
              amount: depth_source.b[i][1],
            });
          }
          buy[buy.length - 1]["total"] = helper.digits(
            math
              .chain(math.bignumber(buy[buy.length - 1]["price"]))
              .multiply(math.bignumber(buy[buy.length - 1]["amount"]))
              .format({
                notation: "fixed",
              })
              .done(),
            quote_precision
          );
          // 累加 交易额
          buy[buy.length - 1]["grandTotal"] = helper.digits(
            math
              .chain(
                buy[buy.length - 2]
                  ? math.bignumber(buy[buy.length - 2]["grandTotal"])
                  : 0
              )
              .add(math.bignumber(buy[buy.length - 1]["total"]))
              .format({
                notation: "fixed",
              })
              .done(),
            quote_precision
          );
          // 累加 数量
          buy[buy.length - 1]["grandAmount"] = math
            .chain(
              buy[buy.length - 2]
                ? math.bignumber(buy[buy.length - 2]["grandAmount"])
                : 0
            )
            .add(math.bignumber(buy[buy.length - 1]["amount"]))
            .format({
              notation: "fixed",
            })
            .done();
        }
      });
      //sell.reverse();
      //}
      yield put({
        type: "save",
        payload: {
          aggTrade_data: {
            sell,
            buy,
          },
        },
      });

      // 设置 盘口平均值
      yield put({
        type: "setAverage",
        payload: {
          aggTrade_type,
          quote_precision,
        },
      });
    },
    // 请求币种余额
    *get_available({ payload }, { call, put, select }) {
      if (!Cookie.read("account_id")) return;
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
        const buy_price = yield select((state) => state.lever.buy_price);
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
    *create_order({ payload, success }, { call, put, select }) {
      const lever = yield select((state) => state.lever);
      if (lever[`${payload.type}${payload.side}`]) {
        return;
      }
      yield put({
        type: "save",
        payload: {
          [`${payload.type}${payload.side}`]: true,
          
        },
      });
      const { order_type, tokenInfo } = lever;
      let data = { ...payload };
      // 市价下单时，
      if (order_type == "market") {
        data.price = tokenInfo.c;
        delete data.price;
      }
      try {
        const result = yield call(getData("lever_order_create"), {
          payload: data,
        });
        // 下单成功
        if (result.code == "OK") {
          message.info(window.appLocale.messages["下单成功"]);
          yield put({
            type: "ws_margin_new_order",
            payload: {
              margin_order_source: [result.data],
            },
          });
          success && success();
        } else {
          message.error(result.msg);
        }
      } catch (err) {}

      yield put({
        type: "save",
        payload: {
          order_type: payload.order_type,
          order_side: payload.order_side,
          [`${payload.type}${payload.side}`]: false,
        },
      });
    },

    // 撤单
    *cancel_order({ payload }, { call, put, select }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("lever_order_cancel"), {
        payload,
      });
      if (result.code == "OK") {
        message.info(window.appLocale.messages["撤单成功"]);
        // 删除数组中撤单数据
        let {
          lever_open_orders,
          TradingHistoryLimit,
          lever_open_orders_more,
        } = yield select((state) => state.lever);
        let newdata = helper.arrayClone(lever_open_orders);
        newdata.splice(payload.i, 1);
        yield put({
          type: "save",
          payload: {
            lever_open_orders: newdata,
          },
        });
        // 剩余数据小于一页，并且有更多数据时，自动加载下一页
        if (newdata.length < TradingHistoryLimit && lever_open_orders_more) {
          yield put({
            type: "getOrders",
            payload: {
              column: "lever_open_orders",
            },
          });
        }
      } else {
        message.error(result.msg);
      }
    },

    // 取消订单
    *order_cancel_all({ payload }, { call, put }) {
      const result = yield call(getData("lever_order_batch_cancel"), {
        payload,
      });
      if (result.code == "OK" && result.data && result.data.success) {
        message.info(window.appLocale.messages["已成功提交全部撤单申请"]);
      } else {
        result.msg && message.error(result.msg);
      }
    },

    // 创建计划委托
    *createPlanOrder({ payload, success }, { select, call, put }) {
      const lever = yield select((state) => state.lever);
      if (lever[`create${payload.side}PlanOrderStatus`]) {
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

    /**
     * 取消订单
     * @param {*} param0
     * @param {*} param1
     */
    *cancel_plan_order({ payload }, { call, put, select }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("cancel_plan_order"), {
        payload,
      });
      if (result.code == "OK") {
        message.info(window.appLocale.messages["撤单成功"]);
        // 删除数组中撤单数据
        let {
          open_plan_orders,
          TradingHistoryLimit,
          open_plan_orders_more,
        } = yield select((state) => state.layout);
        let newData = helper.arrayClone(open_plan_orders);
        let i = payload.i;
        if (i === -1) {
          newData.map((item, _i) => {
            if (item.orderId == payload.order_id) {
              i = _i;
            }
          });
        }
        newData.splice(i, 1);
        yield put({
          type: "save",
          payload: {
            open_plan_orders: newData,
          },
        });
        // 剩余数据小于一页，并且有更多数据时，自动加载下一页
        if (newData.length < TradingHistoryLimit && open_plan_orders_more) {
          yield put({
            type: "getOrders",
            payload: {
              column: "open_plan_orders",
            },
          });
        }
      } else {
        message.error(result.msg);
      }
    },

    *cancelAllPlanOrder({ payload }, { call, put }) {
      const result = yield call(getData("cancel_all_plan_order"), {
        payload,
      });
      if (result.code == "OK" && result.data && result.data.success) {
        message.info(window.appLocale.messages["已成功提交全部撤单申请"]);
      } else {
        result.msg && message.error(result.msg);
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

    *handleChange({ payload }, { select, put }) {
      yield put({
        type: "save",
        payload,
      });
    },

    //是否已经开通杠杆
    *isLeverOpened({ payload, api }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) {
        return;
      } else {
        const result = yield call(getData("userinfo"), {
          payload,
          method: "get",
        });
        if (result.code == "OK") {
          yield put({
            type: "save",
            payload: {
              openMargin: !!result.data.openMargin,
            },
          });
        }
      }
    },
    *hideLeverProtocol({ payload, api }, { call, put }) {
      yield put({
        type: "save",
        payload: {
          openMargin: true,
        },
      });
    },

    *showLeverProtocol({ payload, api }, { call, put }) {
      yield put({
        type: "save",
        payload: {
          openMargin: false,
        },
      });
    },

    //开通杠杆
    *openMargin({ payload, api }, { call, put, select }) {
      const result = yield call(getData("open_lever"), {});
      if (result.data && result.data.success === true) {
        yield put({
          type: "layout/userinfo",
          payload: {
            openMargin: true,
          },
        });
      }
    },
    // 融币账户可出金
    *getAvailWithdraw({ payload, api }, { call, put, select }) {
      const ret = yield call(getData("get_avail_withdraw"), { payload });
      if (ret && ret.code == "OK") {
        yield put({
          type: "save",
          payload: { ...ret.data },
        });
      }
    },
    /**
     * http 轮询更新,订单信息,
     * 当前委托：全量更新，如果数据量较大，全量更新前100条
     * 历史委托：只请求最新的数据
     * 历史成交：只请求最新的数据
     */
    *httpUpdateOrder({ payload }, { call, put, select }) {
      const { userinfo } = yield select((state) => state.layout);
      const loading = yield select((state) => state.loading);
      // 切换全部币对时，暂停轮询，等待切换完成，再轮询
      if (loading.effects["lever/getOrders"]) return;
      if (!userinfo.defaultAccountId) return;
      const {
        lever_open_orders,
        lever_history_orders,
        lever_history_trades,
      } = yield select((state) => state.lever);
      // 当前委托更新, http状态下更新最新的100条
      const max_limit = 100;

      let [new_open, new_trade, new_history_trades] = yield [
        call(getData("lever_open_orders"), {
          payload: {
            account_id: userinfo.defaultAccountId,
            end_order_id: 0,
            limit: Math.min(
              max_limit,
              lever_open_orders ? lever_open_orders.length : 50
            ),
            symbol_id: payload.symbol_id,
          },
        }),
        call(getData("lever_history_orders"), {
          payload: {
            account_id: userinfo.defaultAccountId,
            end_order_id:
              lever_history_orders && lever_history_orders[0]
                ? lever_history_orders[0]["orderId"]
                : 0,
            limit: 50,
            symbol_id: payload.symbol_id,
          },
        }),
        call(getData("lever_history_trades"), {
          payload: {
            account_id: userinfo.defaultAccountId,
            end_trade_id:
              lever_history_trades && lever_history_trades[0]
                ? lever_history_trades[0]["tradeId"]
                : 0,
            limit: 50,
            symbol_id: payload.symbol_id,
          },
        }),
      ];
      let data = {};
      if (new_open.code === "OK") {
        data.lever_open_orders = new_open.data || [];
      }

      // 当前委托覆盖
      yield put({
        type: "save",
        payload: {
          lever_open_orders: data.lever_open_orders,
        },
      });

      // 历史委托
      if (lever_history_orders[0]) {
        WSDATA.setData("margin_new_order_source", new_trade.data || []);
      }

      // 历史成交
      if (lever_history_trades[0]) {
        WSDATA.setData(
          "lever_history_trades_source",
          new_history_trades.data || []
        );
      }
    },
  },
  *httpUpdatePlanOrder() {},
  reducers: {
    // 余额更新
    // action.payload = { lever_balance:[], base_precision: xxx }
    setAvailable(state, action) {
      const token1 = state.token1;
      const token2 = state.token2;
      const buy_price = state.buy_price;
      const data = action.payload.lever_balance || {};
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
    setDepth(state, action) {
      let buy = [];
      let sell = [];
      let data = action.payload.depth;

      const ar = new Array(Math.max(data.b.length, data.a.length)).fill(1);
      ar.forEach((item, i) => {
        if (i < action.payload.depth_limit) {
          if (
            data.b[i] &&
            data.b[i][0] &&
            data.b[0] &&
            data.b[0][0] &&
            Math.abs((data.b[i][0] - data.b[0][0]) / data.b[0][0]) <= 0.3
          ) {
            buy.push({
              price: data.b[i][0],
              amount: data.b[i][1],
            });
          }
          if (
            data.a[i] &&
            data.a[i][0] &&
            data.a[0] &&
            data.a[0][0] &&
            Math.abs((data.a[i][0] - data.a[0][0]) / data.a[0][0]) <= 0.3
          ) {
            sell.push({
              price: data.a[i][0],
              amount: data.a[i][1],
            });
          }
        }
      });
      //sell.reverse();
      for (let i = 0; i < buy.length; i++) {
        let t = 0;
        for (let n = 0; n <= i; n++) {
          t += buy[n]["amount"] * 1;
        }
        buy[i]["total"] = t;
      }
      for (let i = 0; i < sell.length; i++) {
        let t = 0;
        for (let n = 0; n <= i; n++) {
          t += sell[n]["amount"] * 1;
        }
        sell[i]["total"] = t;
      }
      return {
        ...state,
        depth: {
          buy,
          sell,
        },
      };
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
    // 设置盘口平均值
    setAverage(state, action) {
      let total = 0;
      let total2 = 0;
      let average = 0;
      let ar = [];
      const aggTrade_data = state.aggTrade_data;
      const quote_precision = action.payload.quote_precision || 6;
      //if (state.depth.buy.length && state.depth.sell.length) {
      // 重新计算平均值 aggTrade_average
      if (action.payload.aggTrade_type == "all") {
        ar = new Array(state.aggTrade_mount).fill(1);
        ar.forEach((item, i) => {
          if (aggTrade_data.buy[i]) {
            // total += Acc.mul(
            //   Number(aggTrade_data.buy[i].amount),
            //   Number(aggTrade_data.buy[i].price)
            // );
            total = helper.digits(
              math
                .chain(math.bignumber(total))
                .add(math.bignumber(aggTrade_data.buy[i]["total"]))
                .format({
                  notation: "fixed",
                })
                .done(),
              quote_precision
            );
          }
          if (aggTrade_data.sell[i]) {
            // total2 += Acc.mul(
            //   Number(aggTrade_data.sell[i].amount),
            //   Number(aggTrade_data.sell[i].price)
            // );
            total2 = helper.digits(
              math
                .chain(math.bignumber(total2))
                .add(math.bignumber(aggTrade_data.sell[i]["total"]))
                .format({
                  notation: "fixed",
                })
                .done(),
              quote_precision
            );
          }
        });

        let a1 = aggTrade_data.buy.length
          ? helper.digits(
              math
                .chain(math.bignumber(total))
                .divide(Math.min(aggTrade_data.buy.length, ar.length))
                .format({
                  notation: "fixed",
                })
                .done(),
              quote_precision
            )
          : 0;
        let a2 = aggTrade_data.sell.length
          ? helper.digits(
              math
                .chain(math.bignumber(total2))
                .divide(Math.min(aggTrade_data.sell.length, ar.length))
                .format({
                  notation: "fixed",
                })
                .done(),
              quote_precision
            )
          : 0;
        // average = aggTrade_data.buy.length
        //   ? Acc.div(total, aggTrade_data.buy.length, 8)
        //   : 0 +
        //     (aggTrade_data.sell.length
        //       ? Acc.div(total2, aggTrade_data.sell.length, 8)
        //       : 0);
        average = math
          .chain(math.bignumber(a1))
          .add(math.bignumber(a2))
          .divide(2)
          .format({
            notation: "fixed",
            precision: 6,
          })
          //.round(quote_precision)
          .done();
      }
      if (action.payload.aggTrade_type == "buy") {
        ar = new Array(state.aggTrade_mount * 2).fill(1);
        ar.forEach((item, i) => {
          if (aggTrade_data.buy[i]) {
            // total += Acc.mul(
            //   Number(aggTrade_data.buy[i].amount),
            //   Number(aggTrade_data.buy[i].price)
            // );
            total = math
              .chain(math.bignumber(total))
              .add(math.bignumber(aggTrade_data.buy[i]["total"]))
              .format({
                notation: "fixed",
              })
              .done();
          }
        });
        // average =  Acc.div(
        //   total,
        //   Math.min(aggTrade_data.buy.length, ar.length),
        //   8
        // );
        average = math
          .chain(math.bignumber(total))
          .divide(Math.min(aggTrade_data.buy.length, ar.length))
          .format({
            notation: "fixed",
            precision: 6,
          })
          //.round(6)
          .done();
      }
      if (action.payload.aggTrade_type == "sell") {
        ar = new Array(state.aggTrade_mount * 2).fill(1);
        ar.forEach((item, i) => {
          if (aggTrade_data.sell[i]) {
            // total += Acc.mul(
            //   aggTrade_data.sell[i].amount,
            //   aggTrade_data.sell[i].price
            // );
            total2 = math
              .chain(math.bignumber(total2))
              .add(math.bignumber(aggTrade_data.sell[i]["total"]))
              .format({
                notation: "fixed",
              })
              .done();
          }
        });
        // average = Acc.div(
        //   total,
        //   Math.min(aggTrade_data.sell.length, ar.length),
        //   8
        // );
        average = math
          .chain(math.bignumber(total2))
          .divide(Math.min(aggTrade_data.sell.length, ar.length))
          .format({
            notation: "fixed",
            precision: 6,
          })
          //.round(6)
          .done();
      }
      //}
      return {
        ...state,
        ...action.payload,
        aggTrade_average: average,
        aggTrade_total_buy: total || 0,
        aggTrade_total_sell: total2 || 0,
      };
    },
    // 杠杆订单ws推送新数据
    ws_margin_new_order(state, action) {
      // 订单ws订阅, 批量处理订单变化
      // 新订单或订单变化
      // 订单可能完成成交，需要移到历史委托
      const margin_order_source = action.payload.margin_order_source;
      let lever_open_orders = helper.arrayClone(state.lever_open_orders);
      let lever_history_orders = helper.arrayClone(state.lever_history_orders);
      const l = margin_order_source.length;
      if (!l) {
        return { ...state };
      }
      // 限价单,市价单
      // 1、NEW 新订单,放入当前委托，
      // 2、PARTIALLY_FILLED 部分成交，更新当前委托里面的某条订单信息,如果当前委托没有此订单，直接插入历史委托
      // 3、FILLED 完全成交，提醒用户有成交，当前委托的中订单信息更新，并放入历史委托，如果当前委托没有，直接插入历史委托
      // 4、CANCELED 已撤销，点击撤销按钮时，已删除当前委托中的订单，直接插入历史委托即可
      // 排序规则：按time排序，如果不在列表里并且 time大于最大的time，那么unshift到list里，不在列表里并且小于最小的time不做处理，其余排序插入对应位置
      margin_order_source.forEach((item, i) => {
        const status = item.status;
        let n = -1;
        lever_open_orders.forEach((it, j) => {
          if (item.orderId === it.orderId) {
            n = j;
            return;
          }
        });
        // 新订单 or 部分成交
        if (status === "NEW" || status === "PARTIALLY_FILLED") {
          // 如果当前委托里没有，直接插入历史委托里。
          if (n === -1) {
            if (lever_open_orders[0]) {
              // 推送过来的订单时间 大于 最大的时间
              if (
                item.time -
                  lever_open_orders[lever_open_orders.length - 1]["time"] >
                0
              ) {
                lever_open_orders.unshift(item);
              }
            } else {
              lever_open_orders[0] = item;
            }
          } else {
            lever_open_orders[n] = item;
          }
          return;
        }

        // 历史委托
        let m = -1;
        lever_history_orders.forEach((it, k) => {
          if (it.orderId === item.orderId) {
            m = k;
            return;
          }
        });

        if (status === "FILLED" || status === "CANCELED") {
          if (status === "FILLED") {
            WSDATA.setData("order_notice", 1, false);
          }
          if (m === -1) {
            // 不在当前列表中，且时间大于最后一条
            if (lever_history_orders[0]) {
              if (
                item.time -
                  lever_history_orders[lever_history_orders.length - 1][
                    "time"
                  ] >
                0
              ) {
                lever_history_orders.unshift(item);
              }
            } else {
              lever_history_orders[0] = item;
            }
          } else {
            lever_history_orders[m] = item;
          }
          if (n > -1) {
            lever_open_orders.splice(n, 1);
          }
        }
      });
      WSDATA.clear("margin_new_order_source");
      lever_open_orders.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      lever_history_orders.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      return {
        ...state,
        lever_open_orders: helper.excludeRepeatArray(
          "orderId",
          lever_open_orders
        ),
        lever_history_orders: helper.excludeRepeatArray(
          "orderId",
          lever_history_orders
        ),
      };
    },
    // 杠杆订单ws推送新数据
    ws_margin_plan_order(state, action) {
      const margin_plan_order_source = action.payload.margin_plan_order_source;
      let lever_open_plan_orders = helper.arrayClone(
        state.lever_open_plan_orders
      );
      let lever_history_plan_orders = helper.arrayClone(
        state.lever_history_plan_orders
      );
      const l = margin_plan_order_source.length;
      if (!l) {
        return { ...state };
      }
      margin_plan_order_source.forEach((item, i) => {
        const status = item.status;
        let n = -1;
        lever_open_plan_orders.forEach((it, j) => {
          if (item.orderId === it.orderId) {
            n = j;
            return;
          }
        });
        // 新订单 or 部分成交
        if (status === "ORDER_NEW") {
          // 如果当前委托里没有，直接插入历史委托里。
          if (n === -1) {
            if (lever_open_plan_orders[0]) {
              // 推送过来的订单时间 大于 最大的时间
              if (
                item.time -
                  lever_open_plan_orders[lever_open_plan_orders.length - 1][
                    "time"
                  ] >
                0
              ) {
                lever_open_plan_orders.unshift(item);
              }
            } else {
              lever_open_plan_orders[0] = item;
            }
          } else {
            lever_open_plan_orders[n] = item;
          }
          return;
        }

        // 历史委托
        let m = -1;
        lever_history_plan_orders.forEach((it, k) => {
          if (it.orderId === item.orderId) {
            m = k;
            return;
          }
        });

        if (
          status === "ORDER_FILLED" ||
          status === "ORDER_CANCELED" ||
          status === "ORDER_REJECTED"
        ) {
          if (m === -1) {
            // 不在当前列表中，且时间大于最后一条
            if (lever_history_plan_orders[0]) {
              if (
                item.time -
                  lever_history_plan_orders[
                    lever_history_plan_orders.length - 1
                  ]["time"] >
                0
              ) {
                lever_history_plan_orders.unshift(item);
              }
            } else {
              lever_history_plan_orders[0] = item;
            }
          } else {
            lever_history_plan_orders[m] = item;
          }
          if (n > -1) {
            lever_open_plan_orders.splice(n, 1);
          }
        }
      });
      WSDATA.clear("margin_new_order_source");
      lever_open_plan_orders.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      lever_history_plan_orders.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      return {
        ...state,
        lever_open_plan_orders: helper.excludeRepeatArray(
          "orderId",
          lever_open_plan_orders
        ),
        lever_history_plan_orders: helper.excludeRepeatArray(
          "orderId",
          lever_history_plan_orders
        ),
      };
    },
    // 更新订单成交信息
    ws_margin_trades(state, action) {
      let lever_history_trades = action.payload.margin_trades_source;
      lever_history_trades = lever_history_trades.concat(
        state.lever_history_trades
      );
      lever_history_trades.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      WSDATA.clear("margin_trades_source");
      return {
        ...state,
        lever_history_trades: helper.excludeRepeatArray(
          "tradeId",
          lever_history_trades
        ),
      };
    },

    ws_margin_safety(state, action) {
      let margin_safety_source = action.payload.margin_safety_source;
      if (margin_safety_source && margin_safety_source.safety) {
        return {
          ...state,
          safety: Number(margin_safety_source.safety) * 100,
        };
      } else {
        return state;
      }
    },
  },
};
