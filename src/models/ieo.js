import getData from "../services/getData";
import { message } from "../lib";

export default {
  namespace: "ieo",

  state: {
    basic_info: {},
    ordering: false,
    ieo_orders: [],
    ieo_order_more: true,
    ieo_project_more: true,
    ieo_project_loading: false,
    project_list: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *basic_info({ payload, dispatch }, { call, put, select }) {
      const result = yield call(getData("ieo_basic_info"), {
        payload,
        method: "post",
      });
      if (result.code === "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            basic_info: result.data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    *project_list({ payload }, { call, put, select }) {
      const { project_list, ieo_project_loading } = yield select(
        (state) => state.ieo
      );
      if (ieo_project_loading) {
        return;
      }
      yield put({
        type: "save",
        payload: {
          ieo_project_loading: true,
        },
      });
      const limit = 100;
      const opt = {
        limit: limit,
        fromId: project_list.length
          ? project_list[project_list.length - 1]["id"]
          : "",
      };
      try {
        const result = yield call(getData("ioe_project_list"), {
          payload: { ...payload, ...opt },
        });
        if (result.code == "OK" && result.data) {
          const newdata = [...project_list].concat(result.data);
          const ieo_project_more = result.data.length >= limit ? true : false;
          yield put({
            type: "save",
            payload: {
              project_list: newdata,
              ieo_project_more,
            },
          });
        }
      } catch (e) {}
      yield put({
        type: "save",
        payload: {
          ieo_project_loading: false,
        },
      });
    },
    *getOrder({ payload }, { call, put, select }) {
      const { ieo_orders, ordering } = yield select((state) => state.ieo);
      if (ordering) return;
      yield put({
        type: "save",
        payload: {
          ordering: true,
        },
      });
      const opt = {
        limit: 100,
        fromId: ieo_orders.length
          ? ieo_orders[ieo_orders.length - 1]["orderId"]
          : "",
      };
      try {
        const result = yield call(getData("ieo_orders"), {
          payload: { ...payload, ...opt },
        });
        if (result.code == "OK" && result.data) {
          const newdata = [...ieo_orders].concat(result.data);
          const ieo_order_more = result.data.length >= 100 ? true : false;
          yield put({
            type: "save",
            payload: {
              ieo_orders: newdata,
              ieo_order_more,
            },
          });
        }
      } catch (e) {}
      yield put({
        type: "save",
        payload: {
          ordering: false,
        },
      });
    },
    *create_order({ payload, success, fail }, { call, put, select }) {
      const ordering = yield select((state) => state.ieo.ordering);
      if (ordering) {
        return;
      }
      yield put({
        type: "save",
        payload: {
          ordering: true,
        },
      });
      try {
        const result = yield call(getData("ieo_order"), {
          payload,
        });
        if (result.code === "OK") {
          success && success();
        } else {
          fail && fail(result.code, result.msg);
        }
      } catch (e) {
        fail(0, e);
      }
      yield put({
        type: "save",
        payload: {
          ordering: false,
        },
      });
    },
    *handleChange({ payload, success }, { put }) {
      yield put({
        type: "save",
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
