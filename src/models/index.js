import getData from "../services/getData";
import helper from "../utils/helper";
export default {
  namespace: "index",

  //
  state: {
    isSellOut: false,
    remainTime: 1207563,
    pointBaseQuota: {},
    getEvent: false,
    stage: 0,
    totalCount: 0,
    remainCount: 0,
    packList: [], // 点卡售卖列表
    coinplusList: [], //首页用的币多多列表
    lastPrice: ""
  },

  subscriptions: {
    setup({ dispatch, history }) {}
  },

  effects: {
    *getMultiKline({ payload, callback }, { call, put }) {
      const result = yield call(getData("multi_kline"), {
        payload,
        method: "get"
      });
      if (result.code === "OK" && result.data) {
        callback && callback(result.data.data);
      }
    },
    *getCoinplusForIndex({ payload, dispatch }, { call, put }) {
      const result = yield call(getData("get_coinplus_list"), {
        payload: {},
        method: "get"
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            coinplusList: result.data
          }
        });
      }
    },
    getCoinplusListTimer({ payload, dispatch }, { call, put }) {
      const run = () => {
        dispatch({
          type: "index/getCoinplusForIndex",
          payload
        });
      };
      run();
      const n = setInterval(run, payload.timer);
    },
    *handleChange({ payload }, { call, put }) {
      yield put({
        type: "save",
        payload
      });
    },
    *getPointEvent({ payload }, { call, put }) {
      const result = yield call(getData("get_point_event"), {
        payload,
        method: "get"
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            isSellOut: result.data.isSellOut,
            remainTime: result.data.remainTime,
            pointBaseQuota: result.data.pointBaseQuota,
            getEvent: true
          }
        });
      }
    },
    *getPackList({ payload }, { call, put }) {
      const result = yield call(getData("get_pact_list"), {
        payload,
        method: "get"
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            stage: result.data.stage,
            packList: result.data.list,
            totalCount: result.data.totalCount,
            remainCount: result.data.remainCount
          }
        });
      }
    },
    *getCardList({ payload }, { call, put }) {
      const result = yield call(getData("get_card_list"), {
        payload: {},
        method: "get"
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: { packList: result.data.packList }
        });
      }
    },
    *getLastPrice({ payload }, { call, put }) {
      const result = yield call(getData("last_price"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: { lastPrice: result.data.lastPrice }
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
