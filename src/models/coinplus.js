import getData from "../services/getData";
// import route_map from "../config/route_map";
// import URLS from "../config/api";
// import CONST from "../config/const";
// import Cookie from "../utils/cookie";
// import { parse, build } from "search-params";
import { message } from "../lib";
// import helper from "../utils/helper";
import { routerRedux } from "dva/router";
import route_map from "../config/route_map";

export default {
  namespace: "coinplus",

  state: {
    totalBtcValue: 0, // 币多多资产折合
    financeList: [], // 币多多资产列表
    coinPlusIndexProductList: [], //填币频道首页产品列表
    product: {}, //币多多产品详情
    wallet: {}, //币多多个人钱包
    userLastLimit: 0, //币多多可支配余额
    resultData: {}, //币多多订单结果查询
    homeIndexProductList: [],
    userBalance: {},
    periodicalList: [], // 定期产品列表
    periodicalFinanceList: [], // 定期资产列表
    periodic: {}, // 定期产品信息
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getCoinplusList({ payload, dispatch }, { call, put, select }) {
      const result = yield call(getData("get_coinplus_index_product_list"), {
        payload,
        method: "post",
      });
      if (result.code == "OK" && Array.isArray(result.data)) {
        yield put({
          type: "save",
          payload: {
            coinplusIndexProductList: result.data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    getCoinplusListTimer({ payload, dispatch }, { call, put, select }) {
      const run = () => {
        dispatch({
          type: "coinplus/getCoinplusList",
          payload,
        });
        dispatch({
          type: "coinplus/getFinancialList",
          payload,
        });
      };
      run();
      const n = setInterval(run, payload.timer);
    },
    *getFinancialList({ payload, dispatch }, { call, put, select }) {
      const result = yield call(getData("get_staking_product_list"), {
        payload,
        method: "get",
      });
      if (result.code == "OK" && Array.isArray(result.data)) {
        let periodicalList = result.data;
        yield put({
          type: "save",
          payload: {
            periodicalList,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    *getProductDetail({ payload, history }, { call, put, select }) {
      const result = yield call(getData("get_coinplus_detail"), {
        payload,
        method: "post",
      });
      if (result.code == "OK") {
        yield put({
          type: "save",
          payload: {
            product: result.data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    *getPeriodicDetail({ payload, history }, { call, put, select }) {
      const periodic = yield select((state) => state.coinplus.periodic);
      const result = yield call(getData("get_periodic_detail"), {
        payload,
        method: "get",
      });
      if (result.code == "OK") {
        if (periodic.timeToSubscribe !== undefined) {
          result.data["timeToSubscribe"] = periodic.timeToSubscribe;
        }
        yield put({
          type: "save",
          payload: {
            periodic: result.data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    *getCoinplusAsset({ payload }, { call, put, select }) {
      const result = yield call(getData("get_coinplus_asset"), {
        payload,
        method: "post",
      });
      if (result.code == "OK") {
        yield put({
          type: "save",
          payload: {
            wallet: result.data.wallet,
            userBalance: result.data.balance,
            userLastLimit: result.data.userLastLimit,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    *purchase({ payload, dispatch, history }, { call, put, select }) {
      const result = yield call(getData("coinplus_purchase"), {
        payload,
        method: "post",
      });
      if (result.code === "OK" && result.data.recordId) {
        window.location.href =
          route_map.coinplusResult + "/" + result.data.recordId;
        // yield put(
        //   routerRedux.push(
        //     route_map.coinplusResult + "/" + result.data.recordId
        //   )
        // );
      } else {
        message.error(result.msg);
      }
    },
    *redeem({ payload, dispatch }, { call, put, select }) {
      const result = yield call(getData("coinplus_redeem"), {
        payload,
        method: "post",
      });
      if (result.code === "OK") {
        window.location.href =
          route_map.coinplusResult + "/" + result.data.recordId;
        // yield put(
        //   routerRedux.push(
        //     route_map.coinplusResult + "/" + result.data.recordId
        //   )
        // );
      } else {
        message.error(result.msg);
      }
    },
    *result({ payload, dispatch }, { call, put, select }) {
      const result = yield call(getData("get_coinplus_result"), {
        payload,
        method: "post",
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            resultData: result.data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    *getFinance({ payload }, { call, put, select }) {
      const result = yield call(getData("get_coinplus_finance"), {
        payload,
        method: "post",
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            financeList: result.data.balanceInfoList,
            totalBtcValue: result.data.totalBtcValue,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    *getPeriodicalFinance({ payload }, { call, put, select }) {
      const result = yield call(getData("get_staking_assets_list"), {
        payload,
        method: "get",
      });
      if (result.code === "OK" && Array.isArray(result.data.assetInfoList)) {
        const periodicalFinanceList = result.data.assetInfoList;
        yield put({
          type: "save",
          payload: {
            periodicalFinanceList,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    // 理财定期申购
    *staking_subscribe({ payload, error }, { call, put, select }) {
      const result = yield call(getData("staking_subscribe"), {
        payload,
        method: "post",
      });
      if (result.code === "OK") {
        window.location.href = `${route_map.staking_result}/${payload.product_id}/${result.data.transferId}`;
      } else {
        message.error(result.msg);
        error && error();
      }
    },
    *commonReq({ payload, url }, { call }) {
      return yield call(getData(url), {
        payload,
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
