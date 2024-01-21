import getData from "../services/getData";
import { message } from "../lib";

export default {
  namespace: "broker",

  state: {
    limit: 20, 
    agent_info: {}, // 经纪人信息
    user_list: [], // 直属用户列表
    broker_list: [], // 直属经纪人列表
    commission_list: [], // 分佣列表
    member_count: 0, // 直属下级代理总数
    // 邀请信息
    invite_info: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {}
  },

  effects: {
    *handleChange({ payload, success }, { put }) {
        yield put({
            type: "save",
            payload
        });
        success && success();
    },
    // 经纪人信息
    *get_agent_info({ payload }, { call, put }) {
        const result = yield call(getData("agent_info"), { payload });
        if (result.code === "OK") {
          yield put({
            type: "save",
            payload: {
              agent_info: result.data
            }
          });
        }
    },
    // 直属用户列表
    *get_userlist({ payload }, { call, put, select }) {
      const { limit, user_list } = yield select(state => state.broker);
      const result = yield call(getData("query_user_list"), { 
        payload: {
          ...payload,
          limit: payload.limit || limit,
          end_id: (payload.direction && user_list.length) ? (payload.direction == "prev" ? user_list[0]["id"] : "") : "",
          from_id: (payload.direction && user_list.length) ? (payload.direction == "next" ? user_list[user_list.length - 1]["id"] : "") : ""
        } 
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            user_list: result.data
          }
        });
      }
    },
    // 直属经纪人列表
    *get_brokerlist({ payload }, { call, put, select }) {
      const { limit, broker_list } = yield select(state => state.broker);
      const result = yield call(getData("query_broker_list"), { 
        payload: {
          ...payload,
          limit: payload.limit || limit,
          end_id: (payload.direction && broker_list.length) ? (payload.direction == "prev" ? broker_list[0]["id"] : "") : "",
          from_id: (payload.direction && broker_list.length) ? (payload.direction == "next" ? broker_list[broker_list.length - 1]["id"] : "") : ""
        } 
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            broker_list: result.data.agentList,
            member_count: result.data.allSubMemberCount
          }
        });
      }
    },
    // 直属经纪人列表
    *get_commission_list({ payload }, { call, put, select }) {
      const { limit, commission_list } = yield select(state => state.broker);
      // if(payload.target_user_id){
        const result = yield call(getData("query_commission_list"), { 
          payload: {
            ...payload,
            limit: payload.limit || limit,
            end_id: (payload.direction && commission_list.length) ? (payload.direction == "prev" ? commission_list[0]["id"] : "") : "",
            from_id: (payload.direction && commission_list.length) ? (payload.direction == "next" ? commission_list[commission_list.length - 1]["id"] : "") : ""
          } 
        });
        if (result.code === "OK") {
          yield put({
            type: "save",
            payload: {
              commission_list: result.data
            }
          });
        }
      // }
    },
    *upgrade({ payload, callback }, { call, put, select }) {
      const result = yield call(getData("user_upgrade"), { payload });
      if (result.code === "OK") {
        callback && callback();
      }else {
        message.error(result.msg);
      }
    },
    *update_broker({ payload, callback }, { call, put, select }) {
      const result = yield call(getData("update_broker"), { payload });
      if (result.code === "OK") {
        callback && callback();
      }else {
        message.error(result.msg);
      }
    },
    // 邀请信息
    *invite({ payload }, { call, put }) {
      const result = yield call(getData("invite_info"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            invite_info: {
              inviteCode: result.data.inviteCode,
              ...result.data.inviteInfoDTO
            }
          }
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
