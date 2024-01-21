import getData from "../services/getData";
import { message } from "../lib";

export default {
  namespace: "topic",

  state: {
    info: {},
    rankList: [],
    rankTypes: [],
    rankType: 0,
    tradeToken: "",
    earningsRateTotal: "0", //收益率
    earningsRateToday: "0", //当日收益率
    earningsAmountTotal: "0", //收益额
    earningsAmountToday: "0", //当日收益额
    miningInfo: {}, // 平台挖矿总收益
    miningIncome: {}, // 用户挖矿收益详情
    limit: 20,
    daily_list: [], // 平台每日挖矿汇总列表
    daily_list_more: false,
    daily_first: true,
    mine_list: [], // 用户挖矿详情
    mine_list_more: false,
    mine_first: true,
    vote_info: {},
    vote_result: {},
    get_vote_info: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *handleChange({ payload, success }, { put }) {
      yield put({
        type: "save",
        payload,
      });
      success && success();
    },
    *info({ payload, dispatch, callback }, { call, put, select }) {
      const result = yield call(getData("topic_trade_activity"), {
        payload,
        method: "post",
      });
      if (result.code === "OK" && result.data) {
        if (!payload.rankType || payload.rankType == result.data.rankType) {
          yield put({
            type: "save",
            payload: {
              info: result.data,
              rankList: result.data.rankList || [],
              rankTypes: result.data.rankTypes || [],
              tradeToken: result.data.token,
            },
          });
          callback && callback(result.data.rankType);
        }
      } else {
        message.error(result.msg);
      }
    },
    // 交易大赛个人信息
    *personal_info({ payload }, { call, put }) {
      const result = yield call(getData("topic_personal_info"), {
        payload,
        method: "get",
      });
      if (result.code === "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            earningsRateTotal: result.data.earningsRateTotal || "0", //收益率
            earningsRateToday: result.data.earningsRateToday || "0", //当日收益率
            earningsAmountTotal: result.data.earningsAmountTotal || "0", //收益额
            earningsAmountToday: result.data.earningsAmountToday || "0", //当日收益额
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    *get_mining_info({ payload }, { call, put }) {
      const result = yield call(getData("mine_mining_info"), {
        payload,
        method: "get",
      });
      if (result.code === "OK" && result.data) {
        let data = result.data;
        data.tokenId = "HBC";
        yield put({
          type: "save",
          payload: {
            miningInfo: data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    *get_mining_income({ payload }, { call, put }) {
      const result = yield call(getData("mine_miner_income"), {
        payload: {},
        method: "get",
      });
      if (result.code === "OK" && result.data) {
        let data = result.data;
        data.tokenId = "HBC";
        yield put({
          type: "save",
          payload: {
            miningIncome: data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    *get_daily_list({ payload }, { call, put, select }) {
      const { daily_list, limit } = yield select((state) => state.topic);
      const result = yield call(getData("mine_daily_list"), {
        payload: {
          fromId: daily_list.length
            ? daily_list[daily_list.length - 1]["id"]
            : "",
          limit: limit,
        },
      });
      if (result.code === "OK") {
        let newdata = [...daily_list].concat(result.data);
        yield put({
          type: "save",
          payload: {
            daily_list: newdata,
            daily_list_more: result.data.length < limit ? false : true,
            daily_first: false,
          },
        });
      }
    },
    *get_user_mine_list({ payload }, { call, put, select }) {
      const { mine_list, limit } = yield select((state) => state.topic);
      const result = yield call(getData("mine_user_mine_list"), {
        payload: {
          fromId: mine_list.length ? mine_list[mine_list.length - 1]["id"] : "",
          limit: limit,
        },
      });
      if (result.code === "OK") {
        let newdata = [...mine_list].concat(result.data);
        yield put({
          type: "save",
          payload: {
            mine_list: newdata,
            mine_list_more: result.data.length < limit ? false : true,
            mine_first: false,
          },
        });
      }
    },
    *get_vote_info({ payload }, { call, put }) {
      const result = yield call(getData("vote_info"), {
        payload,
        method: "get",
      });
      if (result.code === "OK" && result.data) {
        let data = result.data;
        yield put({
          type: "save",
          payload: {
            vote_info: data,
            vote_result: data.infoResult,
            get_vote_info: true,
          },
        });
      }
    },
    *vote({ payload, callback, error }, { call, put }) {
      const result = yield call(getData("vote"), {
        payload,
      });
      if (result.code === "OK" && result.data) {
        let data = result.data;
        yield put({
          type: "save",
          payload: {
            vote_info: data,
            vote_result: data.infoResult,
          },
        });
        callback && callback();
      } else {
        message.error(result.msg);
        error && error();
      }
    },
    *sign_up({ payload, callback }, { call, put }) {
      const result = yield call(getData("activity_sign_up"), {
        payload,
      });
      if (result.code === "OK") {
        callback && callback();
      } else {
        message.error(result.msg);
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
