import getData from "../services/getData";
import { message } from "../lib";

export default {
  namespace: "payment",

  state: {
    orderInfo: {},
    userInfo: {},
    authType: "",
    payStatus: "",
    payList: [], // 支付列表
    prepayList: [], // 预付列表
    mapList: [], // 映射金额
    codeOrderId: "",
    isMapping: false,
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
    *getPayData({ payload }, { call, put }) {
      const result = yield call(getData("get_payment_data"), {
        payload,
        method: "get",
      });
      if (result.code == "OK") {
        let payList = result.data.orderInfo.payInfo.filter(
          (list) => list.payType == "PAY"
        );
        let prepayList = result.data.orderInfo.payInfo.filter(
          (list) => list.payType == "PREPAY"
        );
        yield put({
          type: "save",
          payload: {
            orderInfo: result.data.orderInfo,
            userInfo: result.data.userInfo,
            authType: result.data.authType,
            payStatus: result.data.orderInfo.status,
            payList: payList,
            prepayList: prepayList,
            isMapping: result.data.orderInfo.isMapping,
            mapList: result.data.orderInfo.productInfo,
            need2FA: result.data.need2FA,
          },
        });
      } else {
        yield put({
          type: "save",
          payload: {
            payStatus: "FAIL",
          },
        });
      }
    },
    *sendVerifyCode({ payload }, { call, put }) {
      const result = yield call(getData("send_payment_verify_code"), {
        payload,
        method: "get",
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: { codeOrderId: result.data.orderId },
        });
      } else {
        message.error(result.msg);
      }
    },
    *pay({ payload }, { call, put }) {
      const result = yield call(getData("payment_order_v2"), {
        payload,
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            payStatus: result.data.orderInfo.status,
            need2FA: result.data.need2FA,
          },
        });
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
