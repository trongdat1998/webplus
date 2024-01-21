import getData from "../services/getData";
import Cookie from "../utils/cookie";
import { message } from "../lib";
import helper from "../utils/helper";
import math from "../utils/mathjs";
import WSDATA from "./data_source";
import cookie from "../utils/cookie";
import CONST from "../config/const";
import _ from "lodash";
import route_map from "../config/route_map";
import { routerRedux } from "dva/router";
export default {
  namespace: "future",

  state: {
    quoteMode: localStorage.futureQuoteMode,
    current_list: [], // 当前委托
    current_more: false,
    position_list: [], //持仓
    position_more: false,
    history_entrust: [], // 历史委托
    history_entrust_more: false,
    history_order: [], // 历史成交
    history_order_more: false,
    delivery_order: [], // 交割记录
    delivery_more: false,
    fund_list: [], // 保险基金列表
    fund_more: false,
    future_balances: [],
    // 永续合约状态
    future_status: 0, // 0 = 交易中， 1 = 交割中  2 = 已交割

    /**
     * 永续合约可交易信息,资产信息
     * {
     *  symbolId:{
     *    symbolId:'',
     *    availPosition:[左可平量,右可平量],
     *    positionNum:[左值仓位,右值仓位],
     *    profitLoss:{
     *       "coinAvailable":10000.89,//可用保证金
     *       "margin":2000.89,//仓位保证金
     *       "orderMargin":300.89,//委托保证金
     *       "realisedPnl":5000.89,//已实现盈亏
     *       "unrealisedPnl":200.00//未实现盈亏
     *    }
     *  }
     * }
     */
    future_tradeable: {},
    // 是否已启动htt轮询
    tradeable_http_status: false,
    // 是否已启动更新轮询
    updateTradeableStatus: false,

    // 永续合约下单配置项
    /**
     * 永续合约下单配置项
     * {
     *  symbolId: {
     *    symbolId:'',
     *    symbolName: '',
     *    orderFee:{
     *      takerFeeRate:'0.1', // taker,maker取最大值
     *      makerFeeRate:'0.2',
     *    },
     *    orderSetting:{
     *      "orderCondition":"1", //是"被动委托或取消"条件，参数：1=是，0=否
     *      "effectiveTime":"1", //"生效时间"选项，参数：1=一直生效 2=全部成交或取消 3=立刻成交或取消
     *      "alertConfirm":"1"//"下单弹窗确认"条件，参数：1=开启 0=关闭
     *    },
     *    orderRiskLimit:{
     *      riskLimitId: 1,
     *    },
     *  }
     * }
     */
    order_setting: {},

    // 下单
    order_chooses: ["OPEN", "CLOSE"],
    order_choose: 0, // OPEN = 开仓， CLOSE = 平仓

    order_sides: ["BUY", "SELL"],
    order_side: 0, // BUY=买, SELL = 卖

    order_types: ["LIMIT", "STOP"],
    //order_type: 0, // LIMIT=限价, STOP = 计划委托

    price_types: ["INPUT", "MARKET_PRICE", "OPPONENT", "QUEUE", "OVER"],
    price_types_desc: ["限价", "市价", "对手价", "排队价", "超价"],
    // symbol_name: "", // 币名称
    // symbol: "", // 币对名称
    future_info: {},
    symbol_id: "", // 币对ID
    exchange_id: "", // market id
    client_order_id: "", // 客户端订单id
    time_in_force: 0, // GTC = 取消前有效, FOK = 全数执行或立即取消，IOC = 立刻执行或取消

    buy_lever: null, // 杠杠dom节点
    buy_type: 0, // 0= 限价， 1 = 计划委托
    buy_price: "", // 价格
    buy_price_type: 0, // 价格类型 : price_types[n]
    buy_trigger_price: "", // 计划委托触发价格
    buy_leverage: "", // 杠杆值
    buy_quantity: "", // 数量
    buy_progress: 0, // 买入进度条
    buy_max: 0, // 限价买入最大值，根据用户价格进行计算
    buy_risk: "", // 风险限额id

    sale_lever: null, // 杠杠下拉选项 dom节点
    sale_type: 0, // 0= 限价， 1 = 计划委托
    sale_price: "", // 价格
    sale_price_type: 0, // 价格类型 : price_types[n]
    sale_trigger_price: "", // 计划委托触发价格
    sale_leverage: "", // 杠杆值
    sale_quantity: "", // 数量
    sale_max: 0, // 限价卖出最大值，用户余额
    sale_progress: 0, // 卖出进度条
    sale_risk: "", // 风险限额id

    funding_rates: [], // 资金费率

    // modal_setting
    modal_setting: false, //设置弹层
    modal_glossary: false, // 名词解释
    modal_order: false, // 下单确认弹层
    modal_margin: false, // 保证金弹层
    modal_future: false, // 合约介绍
    modal_risk: false, // 风险限额

    // 可卖
    token1: "", // token1 id
    token1_name: "",
    // 可用余额
    token2: "", // token2 id
    token2_name: "",
    // 下单状态
    // createOrderStatus: {
    //   BUY: false,
    //   SELL: false,
    // },
    orderStatusBUY: false,
    orderStatusSELL: false,

    digitMerge: [], // 币对的小数位配置 , 如：0.1,0.01,0.0001
    aggTrade_digits: "", // 默认选择小数位，行情深度合并使用
    max_digits: "", // 价格精度 小数位最大值,如 8 表示小数留8位
    base_precision: "", // 数量精度 如 8 表示小数留8位
    quote_precision: "", // 金额精度 如 8 表示小数留8位
    min_price_precision: "", // 价格交易step, 如 0.1
    min_trade_quantity: "", // 数量交易step 如 0.1
    min_trade_amount: "", // 金额交易step  如 0.1

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

    // 期权费率
    order_fee: {},
    // 默认费率
    defaultFee: 0.005,

    // 盘口数据
    aggTrade_data: {
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

    // 期权指数
    indices_source: {},
    indices: {},

    // 深度图数据, 盘口数据
    depth_source: {
      a: [],
      b: [],
    },
    depth: {
      sell: [],
      buy: [],
    },

    // tokenInfo
    tokenInfo: {},
    tokenInfoSource: {},
    indexToken: "",

    datafeed_reset: false,
    Limit: 50,
    maxLimit: 100,
    tableData: [],
    // 翻页数据
    total: 0, // 总条数
    page: 0, // 页码
    rowsPerPage: CONST.rowsPerPage, // 每页条数
    tableData: [], // 列表数据
    showFinance: true, // 行情页资产是否展示
    buy_price_type_modal: null, // 开多价格类型弹框
    sale_price_type_modal: null, // 开空价格类型弹框
    contractInfo: {}, // 合约信息
    settingCombin: {
      GTC: [0, 1, 2, 3, 4],
      MAKER: [0, 3],
      IOC: [0, 1, 2, 4],
      FOK: [0, 1, 2, 4],
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({
        type: "getServerTime",
      });
      dispatch({
        type: "fetchIfOpenedFuture",
      });
      history.listen((location) => {});
    },
  },

  effects: {
    // 合约计算器
    *calculator({ payload, key, callback }, { call }) {
      const result = yield call(getData(key), { payload, method: "get" });
      callback && callback(result);
    },
    // 资金费率
    *funding_rates({ payload }, { call, put }) {
      const result = yield call(getData("funding_rates"), {
        payload,
        method: "get",
      });
      if (result.code === "OK" && result.data && result.data.length) {
        yield put({
          type: "save",
          payload: {
            funding_rates: result.data,
          },
        });
      }
    },
    // 增加，减少保证金
    *modify_margin({ payload, callback }, { call, put }) {
      const result = yield call(getData("modify_margin"), { payload });
      callback && callback(result);
    },
    *tradeable_req({ payload }, { call, put, select, take }) {
      let { config } = yield select((state) => state.layout);
      let symbol_ids = [];
      let exchange_id = "";
      const futuresSymbol = config.futuresSymbol;
      (futuresSymbol || []).map((item) => {
        symbol_ids.push(item.symbolId);
        exchange_id = item.exchangeId;
      });
      if (!Cookie.read("user_id")) {
        return;
      }
      const result = yield call(getData("futures_tradeable"), {
        payload: {
          token_ids: symbol_ids.join(","),
          exchange_id,
        },
      });
      if (result.code == "OK") {
        let d = {};
        (result.data || []).map((item) => {
          d[item["tokenId"]] = item;
        });
        yield put({
          type: "save",
          payload: {
            future_tradeable: d,
          },
        });
        WSDATA.setData("future_tradeable_source", result.data);
      }
    },
    // http轮询 永续合约可交易信息
    *tradeable({ payload }, { call, put, select }) {
      const tradeable_http_status = yield select(
        (state) => state.future.tradeable_http_status
      );
      if (tradeable_http_status) {
        return;
      }
      yield put({
        type: "save",
        tradeable_http_status: true,
      });

      while (true) {
        const { config, userinfo } = yield select((state) => state.layout);
        const futuresSymbol = config.futuresSymbol;
        // symbol存在 and 已登录 and ws非链接状态，启动http请求
        if (
          futuresSymbol &&
          futuresSymbol.length &&
          userinfo.defaultAccountId
        ) {
          let symbol_ids = [];
          let exchange_id = "";
          futuresSymbol.map((item) => {
            symbol_ids.push(item.symbolId);
            exchange_id = item.exchangeId;
          });
          try {
            const result = yield call(getData("futures_tradeable"), {
              payload: {
                token_ids: symbol_ids.join(","),
                exchange_id,
              },
            });
            if (result.code == "OK") {
              WSDATA.setData("future_tradeable_source", result.data);
            }
          } catch (e) {}
        }
        yield helper.delay(2000);
      }
    },
    // 定时更新 永续合约可交易信息
    *updateTradeable({ payload }, { put, select }) {
      const { updateTradeableStatus } = yield select((state) => state.future);
      if (updateTradeableStatus) {
        return;
      }
      yield put({
        type: "save",
        payload: {
          updateTradeableStatus: true,
        },
      });
      while (true) {
        let future_tradeable_source = WSDATA.getData("future_tradeable_source");
        if (
          future_tradeable_source &&
          Object.keys(future_tradeable_source).length
        ) {
          yield put({
            type: "save",
            payload: {
              future_tradeable: future_tradeable_source,
            },
          });
        }
        yield helper.delay(400);
      }
    },
    // 永续合约状态查询
    *settleStatus({ payload }, { call, put }) {
      const result = yield call(getData("settle_status"), { payload });
      if (result.code === "OK" && result.data && result.data[0]) {
        yield put({
          type: "save",
          payload: {
            future_status:
              CONST["optionStatus"][result.data[0]["settleStatus"]],
          },
        });
      }
    },
    // 获取所有永续合约的个性配置
    *getOrderSetting({ payload }, { call, put, select, take }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId || "undefined" == defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
        if (!defaultAccountId) {
          return;
        }
      }
      const params = window.location.pathname.split("/");
      if (!params[3]) {
        return;
      }
      let { config } = yield select((state) => state.layout);
      const futuresSymbol = config.futuresSymbol;
      if (!futuresSymbol.length) {
        yield helper.delay(200);
        yield put({
          type: "getOrderSetting",
          payload: {},
        });
        return;
        // yield take("layout/get_all_token");
        // futuresSymbol = yield select(state => state.layout.futuresSymbol);
      }
      let symbol_ids = [];
      let exchange_id = "";
      futuresSymbol.map((item) => {
        symbol_ids.push(item.symbolId);
        exchange_id = item.exchangeId;
      });
      const result = yield call(getData("futures_order_setting"), {
        payload: {
          symbol_ids: symbol_ids.join(","),
          exchange_id,
        },
      });
      if (result.code == "OK" && result.data && result.data.length) {
        let obj = {};
        result.data.map((item) => {
          obj[item.symbolId] = item;
        });
        yield put({
          type: "save",
          payload: {
            order_setting: obj,
          },
        });
      }
    },
    // 设置下单选项
    *set_order_setting({ payload, dispatch, callback }, { call, put }) {
      const result = yield call(getData("set_order_setting"), { payload });
      if (result.code == "OK") {
        // yield dispatch({
        //   type: "future/getOrderSetting",
        //   payload: {},
        // });
        yield put({
          type: "getOrderSetting",
          payload: {},
        });
        callback && callback();
      } else {
        message.error(result.msg);
      }
    },
    *update_order_setting({ payload, callback }, { call, put, select }) {
      let order_setting = yield select((state) => state.future.order_setting) ||
        {};
      order_setting.orderSetting = payload;
      yield put({
        type: "save",
        payload: {
          order_setting: order_setting,
        },
      });
      callback && callback();
    },
    // 设置风险限额
    *set_risk_limit({ payload, dispatch }, { call, put }) {
      const result = yield call(getData("set_risk_limit"), { payload });
      if (result.code == "OK") {
        yield put({
          type: "save",
          payload: {
            modal_risk: false,
            [payload.key]: payload.risk_limit_id,
          },
        });
        yield dispatch({
          type: "future/getOrderSetting",
          payload: {},
        });
      } else {
        result.msg && message.error(result.msg);
      }
    },
    // 获取当前委托列表
    *getCurrentEntrust({ payload }, { call, put, select }) {
      let defaultAccountId = Cookie.read("account_id");
      if (!defaultAccountId) {
        return;
      }
      if (defaultAccountId) {
        const { current_list, maxLimit } = yield select(
          (state) => state.future
        );
        // 参数处理
        let opt = {
          limit: maxLimit,
          from_order_id: payload.firstReq
            ? ""
            : current_list.length
            ? current_list[current_list.length - 1]["orderId"]
            : "",
        };
        // 区分websocket和http
        // const ws = yield select(state => state.layout.ws);
        // if (ws.oid && ws.oid.readyState == 1) {
        //   let data = {
        //     event: "req",
        //     topic: "futures_order",
        //     extData: {
        //       dataType: "futures_current_order",
        //       fromId: payload.firstReq
        //         ? ""
        //         : current_list.length
        //         ? current_list[current_list.length - 1]["orderId"]
        //         : "",
        //       limit: maxLimit,
        //       type: payload.order_type
        //     }
        //   };
        //   // 第一次拉取，先清空原有数据
        //   if (payload.firstReq) {
        //     yield put({
        //       type: "save",
        //       payload: {
        //         ws_order_req: true,
        //         current_list: [],
        //         current_more: true
        //       }
        //     });
        //     WSDATA.clear("future_order_source");
        //   } else {
        //     yield put({
        //       type: "save",
        //       payload: {
        //         ws_order_req: true
        //       }
        //     });
        //   }
        //   ws.oid.send(JSON.stringify(data));
        // } else {
        payload = { ...payload, ...opt, type: payload.order_type };
        const result = yield call(
          getData(
            payload.order_type == "STOP_LOSS"
              ? "stop_profit_loss_open_orders"
              : "futures_current_entrust"
          ),
          {
            payload,
            method: "get",
          }
        );
        if (result.code === "OK") {
          let data = {};
          data.current_list = payload.firstReq
            ? result.data
            : [...current_list].concat(result.data);
          data.current_more = result.data.length < maxLimit ? false : true;
          data.current_list = helper.excludeRepeatArray(
            "orderId",
            data.current_list
          );
          data.current_list.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
          yield put({
            type: "save",
            payload: data,
          });
        } else {
          if (payload.from_order_id) {
            message.error(result.msg);
          }
        }
        // }
      }
    },
    /**
     * http 轮询更新当前委托
     * 当前委托：全量更新，如果数据量较大，全量更新前100条
     */
    *updateCurrentEntrust({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { current_list, maxLimit } = yield select((state) => state.future);
      const end_order_id = current_list[0] ? current_list[0]["orderId"] : 0;
      let new_current = yield call(
        getData(
          payload.order_type == "STOP_LOSS"
            ? "stop_profit_loss_open_orders"
            : "futures_current_entrust"
        ),
        {
          payload: {
            ...payload,
            type: payload.order_type,
            end_order_id: 0,
            limit: maxLimit,
          },
        }
      );
      // 处理当前委托，查询第一条数据的位置,轮询过程中，可能有新下订单
      let n = current_list.length;
      end_order_id &&
        current_list.map((item, i) => {
          if (item.orderId === end_order_id) {
            n = i;
            return;
          }
        });
      let data = {};
      if (new_current.code === "OK") {
        data.current_list = helper
          .arrayClone(current_list)
          .slice(0, n)
          .concat(new_current.data || []);
        data.current_list = helper.excludeRepeatArray(
          "orderId",
          data.current_list
        );
        data.current_list.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
      }
      WSDATA.clear("future_order_source");
      yield put({
        type: "save",
        payload: data,
      });
    },
    // 获取持仓列表
    *getPositionOrder({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId || "undefined" == defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
        if (!defaultAccountId) {
          return;
        }
      }
      if (defaultAccountId) {
        const { position_list, maxLimit } = yield select(
          (state) => state.future
        );
        // 参数处理
        let opt = {
          limit: maxLimit,
          from_position_id: payload.firstReq
            ? ""
            : position_list.length
            ? position_list[position_list.length - 1]["positionId"]
            : "",
        };
        yield put({
          type: "getHttpPositionOrder",
          payload: payload,
        });
        return;
        if (payload.http) {
        }
        // // 区分websocket和http
        // const ws = yield select(state => state.layout.ws);
        // if (ws.ws.readyState == 1) {
        //   let data = {
        //     event: "req",
        //     topic: "futures_position",
        //     extData: {
        //       dataType: "futures_position",
        //       fromId: opt.from_position_id || 0,
        //       limit: maxLimit
        //     }
        //   };
        //   // 第一次拉取，先清空原有数据
        //   if (payload.firstReq) {
        //     yield put({
        //       type: "save",
        //       payload: {
        //         ws_order_req: true,
        //         //position_list: [],
        //         position_more: true
        //       }
        //     });
        //     //WSDATA.clear("future_position_source");
        //   } else {
        //     yield put({
        //       type: "save",
        //       payload: {
        //         ws_order_req: true
        //       }
        //     });
        //   }
        //   ws.oid.send(JSON.stringify(data));
        // } else {
        payload = { ...payload, ...opt };
        yield put({
          type: "getHttpPositionOrder",
          payload: payload,
        });
        // }
      }
    },
    *getHttpPositionOrder({ payload }, { call, put, select }) {
      const { position_list, maxLimit } = yield select((state) => state.future);
      const config = yield select((state) => state.layout.config) || [];
      const result = yield call(getData("futures_option_list"), {
        payload,
        method: "get",
      });
      if (result.code === "OK") {
        let data = {};
        if (result.data) {
          result.data.map((item, index) => {
            const configItem = config.symbols_obj.futures[item.symbolId];
            const basePrecision = configItem
              ? Number(configItem.basePrecision) > 0.1
                ? 0
                : CONST["depth"][configItem.basePrecision]
              : 0;
            result.data[index].exitPrice = result.data[index].price;
            result.data[index].exitQuantity = helper.digits(
              result.data[index].available,
              basePrecision
            );
            result.data[index].priceMsg = "";
            result.data[index].quantityMsg = "";
            result.data[index].type = "INPUT";
          });
        }
        data.position_list = payload.firstReq
          ? result.data
          : [...position_list].concat(result.data);
        // 进行排重
        data.position_list = helper.excludeRepeatArray(
          "positionId",
          data.position_list
        );
        // data.position_list.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
        data.position_more = result.data.length < maxLimit ? false : true;
        WSDATA.setData("future_position_source", data.position_list);
        yield put({
          type: "save",
          payload: data,
        });
      } else {
        if (payload.from_position_id) {
          message.error(result.msg);
        }
      }
    },
    /**
     * http 轮询更新当前持仓
     * 当前持仓：全量更新，如果数据量较大，全量更新前100条
     */
    *updatePositionOrder({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      let { position_list, maxLimit } = yield select((state) => state.future);
      const config = yield select((state) => state.layout.config) || [];
      let new_position = yield call(getData("futures_option_list"), {
        payload: {
          end_order_id: 0,
          limit: maxLimit,
        },
      });

      if (!new_position || !new_position.data) {
        new_position.data = [];
      }

      if (
        new_position &&
        new_position.code == "OK" &&
        new_position.data &&
        new_position.data.length == 0
      ) {
        WSDATA.setData("future_position_source", []);
        yield put({
          type: "save",
          payload: { position_list: [] },
        });
        return;
      }

      new_position.data.map((item, i) => {
        let n = -1;
        position_list.map((it, j) => {
          if (item.positionId === it.positionId) {
            n = j;
          }
        });
        const configItem = config.symbols_obj.futures[item.symbolId];
        const basePrecision = configItem
          ? Number(configItem.basePrecision) > 0.1
            ? 0
            : CONST["depth"][configItem.basePrecision]
          : 0;
        let exitQuantity =
          n === -1
            ? helper.digits(item.available, basePrecision)
            : position_list[n].exitQuantity;
        exitQuantity = exitQuantity === "" ? "" : exitQuantity;
        item.exitPrice = n === -1 ? item.price : position_list[n].exitPrice;
        item.exitQuantity =
          exitQuantity === ""
            ? ""
            : Number(item.available) < Number(exitQuantity)
            ? helper.digits(item.available, basePrecision)
            : exitQuantity;
        item.priceMsg = n === -1 ? "" : position_list[n].priceMsg;
        item.quantityMsg = n === -1 ? "" : position_list[n].quantityMsg;
        item.type = n === -1 ? "INPUT" : position_list[n].type;
      });
      if (new_position.code === "OK") {
        WSDATA.setData("future_position_source", new_position.data);
        yield put({
          type: "save",
          payload: { position_list: new_position.data },
        });
      }
    },
    // 历史委托
    *getHistoryEntrust({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { history_entrust, Limit } = yield select((state) => state.future);
      // 参数处理
      let opt = {
        limit: Limit,
        from_order_id: payload.firstReq
          ? ""
          : history_entrust.length
          ? history_entrust[history_entrust.length - 1]["orderId"]
          : "",
      };
      payload = { ...payload, ...opt, type: payload.order_type };
      const result = yield call(
        getData(
          payload.order_type == "STOP_LOSS"
            ? "stop_profit_loss_trade_orders"
            : "futures_history_entrust"
        ),
        {
          payload,
          method: "get",
        }
      );
      if (result.code === "OK") {
        let data = {};
        data.history_entrust = payload.firstReq
          ? result.data
          : [...history_entrust].concat(result.data);
        data.history_entrust_more = result.data.length < Limit ? false : true;
        data.history_entrust = helper.excludeRepeatArray(
          "orderId",
          data.history_entrust
        );
        data.history_entrust.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
        yield put({
          type: "save",
          payload: data,
        });
      } else {
        if (payload.from_order_id) {
          message.error(result.msg);
        }
      }
    },
    /**
     * http 轮询更新
     * 历史委托：只请求最新的数据
     */
    *updateHistoryEntrust({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { history_entrust, Limit } = yield select((state) => state.future);
      const end_order_id = history_entrust[0]
        ? history_entrust[0]["orderId"]
        : 0;
      let new_history = yield call(
        getData(
          payload.order_type == "STOP_LOSS"
            ? "stop_profit_loss_trade_orders"
            : "futures_history_entrust"
        ),
        {
          payload: {
            ...payload,
            end_order_id,
            limit: Limit,
            from_order_id: "",
            type: payload.order_type,
          },
        }
      );
      let newList = helper.arrayClone(history_entrust);
      if (new_history.code === "OK") {
        if (new_history.data.length) {
          // WSDATA.setData("order_notice", new_history.data.length);
          newList = new_history.data.concat(newList);
        }
      }
      newList = helper.excludeRepeatArray("orderId", newList, "time");
      newList.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
      yield put({
        type: "save",
        payload: {
          history_entrust: newList,
        },
      });
    },
    // 历史成交
    *getHistoryOrder({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { history_order, Limit } = yield select((state) => state.future);
      // 参数处理
      let opt = {
        limit: Limit,
        from_trade_id: payload.firstReq
          ? ""
          : history_order.length
          ? history_order[history_order.length - 1]["tradeId"]
          : "",
      };
      payload = { ...payload, ...opt };
      const result = yield call(getData("futures_history_order"), {
        payload,
        method: "get",
      });
      if (result.code === "OK") {
        let data = {};
        data.history_order = payload.firstReq
          ? result.data
          : [...history_order].concat(result.data);
        data.history_order_more = result.data.length < Limit ? false : true;
        data.history_order = helper.excludeRepeatArray(
          "tradeId",
          data.history_order,
          "time"
        );
        data.history_order.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
        yield put({
          type: "save",
          payload: data,
        });
      } else {
        if (payload.from_trade_id) {
          message.error(result.msg);
        }
      }
    },
    /**
     * http 轮询更新
     * 历史成交：只请求最新的数据
     */
    *updateHistoryOrder({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { history_order, Limit } = yield select((state) => state.future);
      //const end_trade_id = history_order[0] ? history_order[0]["tradeId"] : 0;
      // 拉取最新数据，不能拉取 end_trade_id 到当前的订单，可能有早于end_trade_id之前的订单，成交了。
      const end_trade_id = 0;
      let new_history = yield call(getData("futures_history_order"), {
        payload: {
          ...payload.params,
          end_trade_id,
          limit: Math.min(Math.max(history_order.length, Limit), 100),
          //from_trade_id: ""
        },
      });
      let newList = helper.arrayClone(history_order);
      if (new_history.code === "OK") {
        if (new_history.data.length) {
          newList = new_history.data.concat(newList);
        }
      }
      newList = helper.excludeRepeatArray("tradeId", newList, "time");
      newList.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
      yield put({
        type: "save",
        payload: {
          history_order: newList,
        },
      });
    },
    // 交割记录
    // *getDeliveryOrder({ payload }, { call, put, select }) {
    //   let { defaultAccountId } = yield select(state => state.layout.userinfo);
    //   if (!defaultAccountId) {
    //     defaultAccountId = Cookie.read("account_id");
    //   }
    //   if (!defaultAccountId) return;
    //   const { delivery_order, Limit } = yield select(state => state.future);
    //   // 参数处理
    //   let opt = {
    //     limit: Limit,
    //     from_settlement_id: payload.firstReq
    //       ? ""
    //       : delivery_order.length
    //       ? delivery_order[delivery_order.length - 1]["settlementId"]
    //       : ""
    //   };
    //   payload = { ...payload, ...opt };
    //   const result = yield call(getData("future_delivery_order"), {
    //     payload,
    //     method: "get"
    //   });
    //   if (result.code === "OK") {
    //     let data = {};
    //     data.delivery_order = payload.firstReq
    //       ? result.data
    //       : [...delivery_order].concat(result.data);
    //     data.delivery_more = result.data.length < Limit ? false : true;
    //     yield put({
    //       type: "save",
    //       payload: data
    //     });
    //   } else {
    //     if (payload.from_settlement_id) {
    //       message.error(result.msg);
    //     }
    //   }
    // },
    /**
     * http 轮询更新
     * 交割记录：只请求最新的数据
     */
    *updateDeliveryOrder({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { delivery_order, Limit } = yield select((state) => state.future);
      const end_settlement_id = delivery_order[0]
        ? delivery_order[0]["settlementId"]
        : 0;
      let new_delivery = yield call(getData("future_delivery_order"), {
        payload: {
          ...payload.params,
          end_settlement_id,
          limit: Limit,
          from_settlement_id: "",
        },
      });
      let newList = helper.arrayClone(delivery_order);
      if (new_delivery.code === "OK") {
        if (new_delivery.data.length) {
          newList = new_delivery.data.concat(newList);
        }
      }
      yield put({
        type: "save",
        payload: {
          delivery_order: newList,
        },
      });
    },
    // 保险基金
    *getInsuranceFund({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { fund_list, Limit } = yield select((state) => state.future);
      // 参数处理
      let opt = {
        limit: Limit,
        from_settlement_id: payload.firstReq
          ? ""
          : fund_list.length
          ? fund_list[fund_list.length - 1]["settlementId"]
          : "",
      };
      payload = { ...payload, ...opt };
      const result = yield call(getData("future_delivery_order"), {
        payload,
        method: "get",
      });
      if (result.code === "OK") {
        let data = {};
        data.fund_list = payload.firstReq
          ? result.data
          : [...fund_list].concat(result.data);
        data.fund_more = result.data.length < Limit ? false : true;
        yield put({
          type: "save",
          payload: data,
        });
      } else {
        if (payload.from_settlement_id) {
          message.error(result.msg);
        }
      }
    },
    // 获取交割记录、保险基金列表
    *getOrders({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { delivery_order, fund_list, history_order, Limit } = yield select(
        (state) => state.future
      );
      // 参数处理
      let listMap = {
        delivery: {
          name: "delivery_order",
          list: delivery_order,
          fromIdName: "from_settlement_id",
          paramsId: "settlementId",
          more: "delivery_more",
        },
        fund: {
          name: "fund_list",
          list: fund_list,
          fromIdName: "from_id",
          paramsId: "id",
          more: "fund_more",
        },
        historyOrder: {
          name: "history_order",
          list: history_order,
          fromIdName: "from_trade_id",
          paramsId: "tradeId",
          more: "history_order_more",
        },
      };
      let listItem = listMap[payload.function];
      let lists = listItem.list; // 订单列表
      let fromIdName = listItem.fromIdName; // 传给接口的orderId名称
      let paramsId = listItem.paramsId;
      let opt = {
        limit: Limit,
        [fromIdName]: payload.firstReq
          ? ""
          : lists.length
          ? lists[lists.length - 1][paramsId]
          : "",
      };
      payload = { ...payload, ...opt };
      const result = yield call(getData(payload.api), {
        payload,
        method: "get",
      });
      if (result.code === "OK") {
        let data = {};
        data[listItem.name] = payload.firstReq
          ? result.data
          : [...lists].concat(result.data);
        data[listItem.more] = result.data.length < Limit ? false : true;
        yield put({
          type: "save",
          payload: data,
        });
      } else {
        if (payload[fromIdName]) {
          message.error(result.msg);
        }
      }
    },
    // 撤单
    *cancelOrder({ payload, success }, { call, put, select }) {
      if (!Cookie.read("account_id")) return;
      let { current_list, maxLimit } = yield select((state) => state.future);
      const result = yield call(getData("futures_order_cancel"), { payload });
      const ws = yield select((state) => state.layout.ws);
      const lastId = current_list.length
        ? current_list[current_list.length - 1]["orderId"]
        : "";
      // 撤单成功
      if (
        result.code === "OK" &&
        result.data &&
        (result.data.status == "CANCELED" ||
          result.data.status == "ORDER_CANCELED")
      ) {
        message.info(window.appLocale.messages["撤单成功"]);
        success && success();
        // 删除当前委托
        current_list = current_list.filter(
          (list) => list.orderId != payload.order_id
        );
        yield put({
          type: "save",
          payload: {
            current_list: current_list,
          },
        });
        return;
      } else {
        message.error(
          result.msg || window.appLocale.messages["撤单失败"] || "Cancel Failed"
        );
      }
    },
    // 全部撤单
    *cancelAllOrder({ payload, success }, { call, put, select }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("cancel_all_order"), { payload });
      //const ws = yield select(state => state.layout.ws);
      let { current_list, maxLimit } = yield select((state) => state.future);
      const lastId = current_list.length
        ? current_list[current_list.length - 1]["orderId"]
        : "";
      // 撤单成功
      if (result.code === "OK") {
        message.info(window.appLocale.messages["撤单成功"]);
        success && success();
        // 删除全部委托
        // ws.oid 存活状态，不写入，等待推送
        // if (!ws.oid) {
        //   yield put({
        //     type: "save",
        //     payload: {
        //       current_list: []
        //     }
        //   });
        // } else {
        //   let data = {
        //     event: "req",
        //     topic: "future_order",
        //     extData: {
        //       dataType: "future_current_order",
        //       fromId: lastId || 0,
        //       limit: maxLimit
        //     }
        //   };
        //   // 第一次拉取，先清空原有数据
        //   if (payload.firstReq) {
        //     yield put({
        //       type: "save",
        //       payload: {
        //         ws_order_req: true,
        //         current_list: [],
        //         current_more: true
        //       }
        //     });
        //     WSDATA.clear("future_order_source");
        //   } else {
        //     yield put({
        //       type: "save",
        //       payload: {
        //         ws_order_req: true
        //       }
        //     });
        //   }
        //   ws.oid.send(JSON.stringify(data));
        // }
      } else {
        message.error(result.msg);
      }
    },
    // 资产
    *getFutureAsset({ payload, callback }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      delete payload.dispatch;
      while (true) {
        try {
          const result = yield call(getData("get_futures_asset"), {
            payload,
            method: "get",
          });
          if (result.code === "OK") {
            yield put({
              type: "save",
              payload: {
                future_balances: result.data || [],
              },
            });
          }
          yield put({
            type: "layout/getTotalAsset",
            payload: {
              unit: "USDT",
            },
          });
        } catch (e) {}
        callback && callback();
        yield helper.delay(2000);
      }
    },
    // 持仓-市价、限价状态切换
    *changePositionStatus({ payload }, { put, select }) {
      const { position_list } = yield select((state) => state.future);
      let newData = helper.arrayClone(position_list);
      let index = newData.findIndex((list) => list.positionId == payload.id);
      if (index > -1) {
        newData[index].type = payload.type;
      }
      yield put({
        type: "save",
        payload: {
          position_list: newData,
        },
      });
    },
    // 持仓信息修改
    *changePositionInfo({ payload }, { put, select }) {
      const { position_list } = yield select((state) => state.future);
      let newData = helper.arrayClone(position_list);
      let index = newData.findIndex((list) => list.positionId == payload.id);
      if (index > -1) {
        newData[index][payload.name] = payload.value;
      }
      yield put({
        type: "save",
        payload: {
          position_list: newData,
        },
      });
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
    },
    // http 获取深度图 盘口数据
    *get_depth_data({ payload }, { call, select }) {
      const aggTrade_digits = yield select(
        (state) => state.layout.aggTrade_digits
      );
      if (aggTrade_digits === "") return;
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
    // 深度图更新数据
    *updateDepth({ payload }, { put, select }) {
      //const depth_source = yield select(state => state.option.depth_source);
      const depth_source = WSDATA.getData("depth_source");
      const depth_limit = yield select((state) => state.layout.depth_limit);
      const depth = {
        a: [],
        b: [],
      };

      const ar = new Array(depth_limit).fill(1);
      ar.map((item, i) => {
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
        (state) => state.future
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
      ar.map((item, i) => {
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
          // 累加
          sell[sell.length - 1]["grandTotal"] = math
            .chain(
              sell[sell.length - 2] ? sell[sell.length - 2]["grandTotal"] : 0
            )
            .add(sell[sell.length - 1]["amount"])
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
          // 累加
          buy[buy.length - 1]["grandTotal"] = math
            .chain(buy[buy.length - 2] ? buy[buy.length - 2]["grandTotal"] : 0)
            .add(buy[buy.length - 1]["amount"])
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

    // update 下单数字，buy_max
    // 下单
    *createOrder({ payload, success, callback }, { call, put, select }) {
      const future = yield select((state) => state.future);
      if (future[`orderStatus${payload.order_side}`]) {
        // window.console.log(order_sides[order_side] + " 下单中");
        return;
      }
      yield put({
        type: "save",
        payload: {
          [`orderStatus${payload.order_side}`]: true,
        },
      });

      try {
        let pay = { ...payload };
        if (pay.price_type != "INPUT") {
          delete pay.price;
        }
        const result = yield call(getData("futures_order_create"), {
          payload: pay,
        });
        const ws = yield select((state) => state.layout.ws);
        // 下单成功
        if (result.code == "OK") {
          // 放入当前委托列表
          // ws.oid 存活状态，不写入，等待推送
          let { current_list, position_list, Limit } = yield select(
            (state) => state.future
          );
          if (payload.futures) {
            message.info(window.appLocale.messages["提交成功"]);
            position_list.map((item, index) => {
              if (item.symbolId == payload.symbol_id) {
                item.exitQuantity = "";
              }
            });
            if (callback && typeof callback === "function") {
              callback();
            }
          } else {
            message.info(window.appLocale.messages["下单成功"]);
          }
          yield put({
            type: "save",
            payload: {
              position_list,
            },
          });
          success && success();
        } else {
          result.msg && message.error(result.msg);
        }
      } catch (err) {}

      yield put({
        type: "save",
        payload: {
          order_type: payload.type,
          // order_side: payload.side,
          [`orderStatus${payload.order_side}`]: false,
          // createOrderStatus: Object.assign({}, createOrderStatus, {
          //   [order_sides[order_side]]: false,
          // }),
        },
      });
    },
    *handleChange({ payload }, { select, put }) {
      yield put({
        type: "save",
        payload,
      });
      if (payload && payload["aggTrade_type"]) {
        const aggTrade_type = yield select(
          (state) => state.future.aggTrade_type
        );
        if (payload["aggTrade_type"] != aggTrade_type) {
          const quote_precision = yield select(
            (state) => state.layout.quote_precision
          );
          payload.quote_precision = quote_precision;
          yield put({
            type: "setAverage",
            payload,
          });
        }
      }
    },
    /**
     * 统一表格获取数据方法
     * @param {Object} payload {page,size,...}
     * @param {String} api  api path
     *
     * param page, 控件的翻页0开始，接口从1开始，需要处理
     */
    *getTableData({ payload, api, callback }, { call, put, select }) {
      let result = yield call(getData(api), {
        payload: {
          ...payload,
          page: payload.page === undefined ? 1 : 1 + Number(payload.page),
          size:
            payload.size === undefined
              ? CONST.rowsPerPage
              : Number(payload.size),
        },
      });
      if (result.code === "OK") {
        const res = result.data;
        let symbolIdArr = [];
        // 获取期权对应的exchangeId
        const { total, page, size, ...props } = res;
        let { data } = res;
        if (data) {
          if (data.length) {
            data.map((item) => {
              symbolIdArr.push(item.symbolId);
            });
            const r = yield call(getData("symbol_info"), {
              payload: { symbol_ids: symbolIdArr.join(",") },
            });
            if (r.code === "OK") {
              if (r.data && r.data.length) {
                data.map((it, index) => {
                  let symbol = r.data.find(
                    (list) => list.symbolId == it.symbolId
                  );
                  if (symbol) {
                    data[index].exchangeId = symbol.exchangeId;
                  }
                });
              }
            } else {
              message.error(r.msg);
            }
          }
          yield put({
            type: "save",
            payload: {
              total: Number(total),
              page: page - 1,
              size: size,
              tableData: data,
              ...props,
            },
          });
        }
      } else {
        message.error(result.msg);
      }
    },
    // 是否开通合约
    *fetchIfOpenedFuture({ payload, api }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      const { functions } = yield select((state) => state.layout);
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
        if (
          result.data &&
          result.data.openFuture !== true &&
          window.location.href.indexOf(route_map.future_guest) == -1
        ) {
          window.location.href = route_map.future_guest;
        }
      }
    },
    // 开通合约
    *openFuture({ payload, api }, { call, put, select }) {
      const result = yield call(getData("open_future"), {
        payload,
        method: "get",
      });
      if (result.data && result.data.success === true) {
        const config = yield select((state) => state.layout.config) || [];
        const futuresSymbol = config.futuresSymbol;
        const futureUrl = route_map.future + "/" + futuresSymbol[0]["symbolId"];
        window.location.href = futureUrl;
      } else if (result.msg) {
        message.error(result.msg);
      }
    },
    // 查询当前止盈止损
    *stop_profit_loss_get({ payload, cb }, { call, put }) {
      const result = yield call(getData("stop_profit_loss_get"), { payload });
      cb && cb(result);
    },
    // 取消止盈止损
    *stop_profit_loss_cancel({ payload, cb }, { call }) {
      const result = yield call(getData("stop_profit_loss_cancel"), {
        payload,
      });
      cb && cb(result);
    },
    // 设置止盈止损
    *stop_profit_loss_set({ payload, cb }, { call }) {
      const result = yield call(getData("stop_profit_loss_set"), { payload });
      cb && cb(result);
    },
    *get_funding_rates({ payload }, { call, put }) {
      const result = yield call(getData("funding_rates"), {
        payload,
        method: "get",
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            contractInfo: result.data[0],
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    // 闪电平仓
    *flashClosePosition({ payload, callback }, { select, call, put }) {
      const result = yield call(getData("flash_close_position"), {
        payload,
      });
      if (result.code === "OK") {
        message.info(window.appLocale.messages["提交成功"]);
        callback && callback();
      } else {
        message.error(result.msg);
      }
    },
  },

  reducers: {
    // 最新成交新增数据
    add_trade(state, action) {
      let data = action.payload.add_trade.concat(state.newTradeSource);
      data.length = state.newTradingLimit;
      return { ...state, newTradeSource: data };
    },
    setDepth(state, action) {
      let buy = [];
      let sell = [];
      let data = action.payload.depth;
      const ar = new Array(Math.max(data.b.length, data.a.length)).fill(1);
      ar.map((item, i) => {
        if (i < action.payload.depth_limit) {
          if (data.b[i] && data.b[i][0]) {
            buy.push({
              price: data.b[i][0],
              amount: data.b[i][1],
            });
          }
          if (data.a[i] && data.a[i][0]) {
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
        ar.map((item, i) => {
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
        ar.map((item, i) => {
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
        ar.map((item, i) => {
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
    // 订单ws订阅, 批量处理订单变化
    // 新订单或订单变化
    update_order(state, action) {
      const new_order_source = action.payload.future_order_source;
      let current_list = helper.arrayClone(state.current_list);
      let history_entrust = helper.arrayClone(state.history_entrust);
      const l = new_order_source.length;
      if (!l) {
        return { ...state };
      }
      new_order_source.map((item, i) => {
        const status = item.status;
        let n = -1;
        current_list.map((it, j) => {
          if (item.orderId === it.orderId) {
            n = j;
            return;
          }
        });
        // 新订单 or 部分成交
        if (status === "NEW" || status === "PARTIALLY_FILLED") {
          if (n === -1) {
            if (
              !current_list.length ||
              (current_list.length &&
                item.time - current_list[current_list.length - 1]["time"] > 0)
            ) {
              current_list.unshift(item);
            }
          } else {
            current_list[n] = item;
          }
          return;
        }
        let m = -1;
        history_entrust.forEach((it, k) => {
          if (it.orderId === item.orderId) {
            m = k;
            return;
          }
        });
        // 完全成交、已撤销
        if (status === "FILLED" || status === "CANCELED") {
          if (status === "FILLED") {
            WSDATA.setData("order_notice", 1, false);
          }
          if (!action.payload.oneWeekAgo) {
            // 当时间筛选为一周前，推送数据不放入历史委托
            if (m === -1) {
              if (
                !history_entrust.length ||
                (history_entrust.length &&
                  item.time -
                    history_entrust[history_entrust.length - 1]["time"] >
                    0)
              ) {
                history_entrust.unshift(item);
              }
            } else {
              history_entrust[m] = item;
            }
          }
          if (n > -1) {
            current_list.splice(n, 1);
          }
        }
      });
      WSDATA.clear("future_order_source");
      current_list = helper.excludeRepeatArray("orderId", current_list);
      current_list.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
      history_entrust = helper.excludeRepeatArray("orderId", history_entrust);
      history_entrust.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
      return {
        ...state,
        current_list,
        history_entrust,
      };
    },
    // 订单ws订阅, 批量处理订单变化
    // 新订单或订单变化
    update_position(state, action) {
      const new_order_source = action.payload.future_position_source;
      const config = action.payload.config;
      let position_list = helper.arrayClone(state.position_list);
      const l = new_order_source.length;
      if (!l) return { ...state, position_list: [] };
      new_order_source.map((item, i) => {
        let n = -1;
        position_list.map((it, j) => {
          if (item.positionId === it.positionId) {
            n = j;
            return;
          }
        });
        const configItem = config.symbols_obj.futures[item.symbolId];
        const basePrecision = configItem
          ? Number(configItem.basePrecision) > 0.1
            ? 0
            : CONST["depth"][configItem.basePrecision]
          : 0;
        let exitQuantity =
          n === -1
            ? helper.digits(item.available, basePrecision)
            : position_list[n].exitQuantity;
        exitQuantity = exitQuantity === "" ? "" : exitQuantity;
        item.exitPrice = n === -1 ? item.price : position_list[n].exitPrice;
        item.exitQuantity =
          exitQuantity === ""
            ? ""
            : Number(item.available) < Number(exitQuantity)
            ? helper.digits(item.available, basePrecision)
            : exitQuantity;
        item.priceMsg = n === -1 ? "" : position_list[n].priceMsg;
        item.quantityMsg = n === -1 ? "" : position_list[n].quantityMsg;
        item.type = n === -1 ? "INPUT" : position_list[n].type;
      });
      return {
        ...state,
        position_list: new_order_source,
      };
    },
  },
};
