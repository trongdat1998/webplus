/**
 * 充币提币
 */
import getData from "../services/getData";
import { message } from "../lib";
import route_map from "../config/route_map";
import { routerRedux } from "dva/router";
import Cookie from "../utils/cookie";
import helper from "../utils/helper";
import md5 from "md5";

const limit = 20;
export default {
  namespace: "finance",

  state: {
    // 充币
    deposit: {
      allowDeposit: "", // 是否允许充币
      address: "", // 地址
      qrcode: "", // 二维码
      minQuantity: "", // 最小充值额
    },
    // 提币
    cash_status: false, // 提币状态
    cash: {
      available: "0", // 可用
      minQuantity: "0", // 最小提币数量
      dayQuota: "0", // 24小时最大提币额度
      usedQuota: "", // 已使用额度
      fee: "0", // 手续费
      minMinerFee: "0", // 最小矿工费
      maxMinerFee: "0", // 最大矿工费
      suggestMinerFee: "0", // 建议矿工费
      convertFee: "0",
      convertRate: "0",
      allowWithdraw: true, // 是否允许提币
      refuseReason: "", // allowWithdraw=false的时候的不能提现的原因
      internalWithdrawFee: 0, // 内部地址手续费
    },
    withdraw: {
      address_id: "", // 地址id
      quantity: "", // 数量
      verficode: "", // 验证码
    },
    address_list: [], // 提币地址列表
    address_check: {}, // 提币地址检查结果
    // 充币记录
    rechangeLog: [],
    rechange_more: true,
    // 提币记录
    cashLog: [],
    cash_more: true,
    // 其他
    otherLog: [],
    other_more: true,
    // 币多多资产记录
    coinplusLog: [],
    coinplus_more: true,
    // 定期
    stakingLog: [],
    staking_more: true,
    // 永续合约记录
    futureLog: [],
    future_more: true,
    // 杠杆记录
    leverLog: [],
    lever_more: true,

    hideZero:
      sessionStorage.hideZero == undefined
        ? 0
        : parseInt(sessionStorage.hideZero),
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      history.listen((location) => {
        const pathname = location.pathname;
        const ar = pathname.split("/");
        // 地址管理
        if (pathname.indexOf(route_map.address) > -1) {
          // 获取地址列表
          dispatch({
            type: "address_list",
            payload: {
              tokenId: ar[ar.length - 1],
            },
          });
        }
      });
    },
  },

  effects: {
    // 资产追溯
    *proff({ payload, cb }, { call, put }) {
      const result = yield call(getData("proff"), { payload });
      cb && cb(result);
    },
    // 禁止划转
    *forbid_time({ payload, cb }, { call, put }) {
      const result = yield call(getData("account_limit"), { payload });
      if (result.code == "OK") {
        yield put({
          type: "layout/account_list",
          payload: {},
        });
        cb && cb();
      } else {
        result.msg && message.error(result.msg);
      }
    },
    // 订单状态
    *order_status({ payload, cb }, { call, put }) {
      let result = { code: "error" };
      try {
        result = yield call(getData("withdrawal_order"), { payload });
      } catch (e) {}
      cb && cb(result);
    },
    // 添加地址
    *address_add({ payload, success, fail }, { call, put, select }) {
      const result = yield call(getData("add_withraw_address"), {
        payload,
      });
      if (result.code == "OK") {
        let address_list = yield select((state) => state.finance.address_list);
        yield put({
          type: "save",
          payload: {
            address_list: [result.data].concat(address_list),
          },
        });
        success && success();
      } else {
        message.error(result.msg);
        fail && fail(result.code);
      }
    },
    // 删除提币地址
    *address_del({ payload, n, success }, { call, put, select }) {
      const result = yield call(getData("del_withraw_address"), {
        payload,
      });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["删除成功"]);
        const list = yield select((state) => state.finance.address_list);
        const data = helper.arrayClone(list);
        if (n || n === 0) {
          data.splice(n, 1);
        }
        yield put({
          type: "save",
          payload: {
            address_list: data,
          },
        });
        success && success();
      } else {
        message.error(result.msg);
      }
    },
    // 提币地址列表
    *address_list({ payload }, { call, put }) {
      const result = yield call(getData("get_withraw_address"), {
        payload: {
          token_id: payload.tokenId,
          chain_type: payload.chain_type || "",
        },
      });
      if (result.code == "OK") {
        yield put({
          type: "save",
          payload: {
            address_list: result.data,
          },
        });
      }
    },
    // 地址判断
    *address_check({ payload, success }, { call, put }) {
      const result = yield call(getData("withdraw_address_check"), { payload });
      if (result.code == "OK") {
        success && success(result.data);
        yield put({
          type: "save",
          payload: {
            address_check: result.data,
          },
        });
      }
    },
    // 提币 step1
    *withdraw_step1({ payload, success, fail }, { call, put, select }) {
      const { defaultAccountId } = yield select(
        (state) => state.layout.userinfo
      );
      if (!defaultAccountId) {
        message.error(window.appLocale.messages["未登录"]);
        return;
      }
      const cash_status = yield select((state) => state.finance.cash_status);
      if (cash_status) return;
      yield put({
        type: "save",
        payload: {
          cash_status: true,
        },
      });
      payload.account_id = defaultAccountId;
      payload.trade_password = md5(payload.trade_password);
      try {
        const result = yield call(getData("withdraw"), {
          payload,
        });
        if (result.code == "OK") {
          success({
            request_id: result.data.requestId,
            code_order_id: result.data.codeOrderId,
            needCheckIdCardNo: result.data.needCheckIdCardNo,
            timeLeft: result.data.timeLeft,
            order_info: result.data.orderInfo,
          });
        } else {
          fail(result.code, result.msg);
        }
      } catch (err) {}
      yield put({
        type: "save",
        payload: {
          cash_status: false,
        },
      });
    },
    // 提币 step2 重新发送验证码
    *cash_re_verify_code({ payload, fail, success }, { call, put }) {
      const result = yield call(getData("withdrawal_verify_code"), {
        payload,
      });
      if (result.code === "OK") {
        success({
          code_order_id: result.data.codeOrderId,
        });
      } else {
        message.error(result.msg);
        fail(result.code);
      }
    },
    // 提币 step2 验证码
    *withdraw_step2(
      { payload, history, success, fail },
      { call, put, select }
    ) {
      const cash_status = yield select((state) => state.finance.cash_status);
      if (cash_status) return;
      yield put({
        type: "save",
        payload: {
          cash_status: true,
        },
      });
      try {
        const r = yield call(getData("withdraw_verify"), {
          payload,
        });
        if (r.code == "OK") {
          // 提币未结束
          if (!r.data.processIsEnd) {
            if (Number(r.data.codeOrderId) > 0) {
              success &&
                success({
                  code_order_id: r.data.codeOrderId,
                  order_info: r.data.orderInfo,
                });
            }
          } else {
            // 提币结束
            if (r.data && r.data.withdrawOrderId) {
              window.location.href =
                route_map.cash_status + "/" + r.data.withdrawOrderId;
            } else {
              window.location.href = route_map.finance_list;
            }
          }
        } else {
          message.error(r.msg);
          fail(r.code);
        }
      } catch (err) {}
      yield put({
        type: "save",
        payload: {
          cash_status: false,
        },
      });
    },
    // router change
    *jump({ payload }, { put }) {
      yield put(routerRedux.push(payload.to));
    },
    // state change
    *propsChange({ payload }, { put }) {
      yield put({
        type: "save",
        payload,
      });
    },
    // 获取币 余额
    *quota_info({ payload }, { call, put, select }) {
      let userinfo = yield select((state) => state.layout.userinfo);
      if (!userinfo.defaultAccountId) {
        const result = yield call(getData("userinfo"), {
          payload: {},
          method: "get",
        });
        if (result.code == "OK") {
          userinfo = {};
          userinfo.defaultAccountId = result.data.defaultAccountId;
        } else {
          message.error(result.msg);
          return;
        }
      }
      const result = yield call(getData("quota_info"), {
        payload: {
          token_id: payload.tokenId,
          chain_type: payload.chain_type || "",
        },
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            cash: result.data,
          },
        });
      } else {
        yield put({
          type: "save",
          payload: {
            case: {},
          },
        });
      }
    },
    // 获取币地址
    *getAddress({ payload, errorCallback }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        const r = yield call(getData("userinfo"), {
          payload: {},
          method: "get",
        });
        if (r.code == "OK") {
          defaultAccountId = r.data.defaultAccountId;
        }
      }
      const result = yield call(getData("get_token_address"), {
        payload,
        method: "get",
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            //tokenId: payload.tokenId,
            deposit: {
              ...result.data,
            },
          },
        });
      } else {
        if (result.msg) {
          errorCallback && errorCallback(result.code, result.msg);
          //message.error(result.msg);
        }
        yield put({
          type: "save",
          payload: {
            deposit: {},
          },
        });
      }
    },
    // 取消提币
    *cancelCash({ payload, success, fail }, { call, put, select }) {
      const result = yield call(getData("withdrawal_order_cancel"), {
        payload,
      });
      if (result.code == "OK" && result.data.success) {
        success && success(result);
      } else {
        fail && fail(result);
      }
    },
    // 获取充提币记录
    *getOrders({ payload }, { call, put, select }) {
      const defaultAccountId = Cookie.read("account_id");
      const {
        rechangeLog,
        cashLog,
        otherLog,
        optionLog,
        coinplusLog,
        futureLog,
        leverLog,
        stakingLog,
      } = yield select((state) => state.finance);
      const apiMap = {
        rechange: "deposit_order_list",
        cash: "withdrawal_order_list",
        option: "option_record",
        other: "other_order_list",
        coinplus: "coinplus_order_list",
        future: "future_record",
        lever: "lever_record",
        staking: "staking_record",
      };
      let from_order_id = "";
      if (!payload.firstReq) {
        if (payload.column == "rechange") {
          from_order_id = rechangeLog.length
            ? rechangeLog[rechangeLog.length - 1]["orderId"]
            : "";
        } else if (payload.column == "cash") {
          from_order_id = cashLog.length
            ? cashLog[cashLog.length - 1]["orderId"]
            : "";
        } else if (payload.column == "option") {
          from_order_id = optionLog.length
            ? optionLog[optionLog.length - 1]["id"]
            : "";
        } else if (payload.column == "coinplus") {
          from_order_id = coinplusLog.length
            ? coinplusLog[coinplusLog.length - 1]["id"]
            : 0;
        } else if (payload.column == "staking") {
          from_order_id = stakingLog.length
            ? stakingLog[stakingLog.length - 1]["id"]
            : 0;
        } else if (payload.column == "lever") {
          from_order_id = leverLog.length
            ? leverLog[leverLog.length - 1]["id"]
            : 0;
        } else {
          from_order_id = otherLog.length
            ? otherLog[otherLog.length - 1]["id"]
            : "";
        }
      }
      if (payload.firstReq && payload.column == "coinplus") {
        from_order_id = 0;
      }
      let params = {
        account_id: defaultAccountId,
        limit,
      };
      if (payload.column == "staking") {
        params["start_id"] = from_order_id;
      } else {
        params["from_order_id"] = from_order_id;
      }
      const result = yield call(getData(apiMap[payload.column]), {
        payload: params,
        method: "get",
      });
      if (result.code === "OK") {
        let data = {};
        if (payload.column == "rechange") {
          data.rechangeLog = payload.firstReq
            ? result.data
            : [...rechangeLog].concat(result.data);
          data.rechange_more = result.data.length < limit ? false : true;
        } else if (payload.column == "cash") {
          data.cashLog = payload.firstReq
            ? result.data
            : [...cashLog].concat(result.data);
          data.cash_more = result.data.length < limit ? false : true;
        } else if (payload.column == "option") {
          data.optionLog = payload.firstReq
            ? result.data
            : [...optionLog].concat(result.data);
          data.option_more = result.data.length < limit ? false : true;
        } else if (payload.column == "coinplus") {
          data.coinplusLog = payload.firstReq
            ? result.data
            : [...coinplusLog].concat(result.data);
          data.coinplus_more = result.data.length < limit ? false : true;
        } else if (payload.column == "staking") {
          data.stakingLog = payload.firstReq
            ? result.data
            : [...stakingLog].concat(result.data);
          data.staking_more = result.data.length < limit ? false : true;
        } else if (payload.column == "future") {
          data.futureLog = payload.firstReq
            ? result.data
            : [...futureLog].concat(result.data);
          data.future_more = result.data.length < limit ? false : true;
        } else if (payload.column == "lever") {
          data.leverLog = payload.firstReq
            ? result.data
            : [...leverLog].concat(result.data);
          data.lever_more = result.data.length < limit ? false : true;
        } else {
          data.otherLog = payload.firstReq
            ? result.data
            : [...otherLog].concat(result.data);
          data.other_more = result.data.length < limit ? false : true;
        }
        yield put({
          type: "save",
          payload: data,
        });
      }
    },
    *commonReq({ payload, url, success, fail }, { call, put, select }) {
      if (!url) return;
      const result = yield call(getData(url), { payload });
      // success && success(result.data);
      if (result.code === "OK") {
        success && success(result.data, result.msg);
      } else {
        fail && fail(result.code, result.msg);
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveHideZero(state, action) {
      sessionStorage.hideZero = action.payload ? 1 : 0;
      return {
        ...state,
        hideZero: action.payload ? 1 : 0,
      };
    },
  },
};
