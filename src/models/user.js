import getData from "../services/getData";
import { message } from "../lib";
import route_map from "../config/route_map";
import helper from "../utils/helper";
import Cookie from "../utils/cookie";
import md5 from "md5";
import CONST from "../config/const";

const LIMIT = 10;
export default {
  namespace: "user",

  state: {
    // 登录验证方式
    loginVerify: {
      bindMobile: false,
      bindEmail: false,
      bindGA: false,
      requestId: "",
      registerType: 0,
      email: "",
      mobile: "",
    },
    //countries: [], // 国家列表
    id_card_type: [], // 证件类型
    api_list: [], // api list
    // ga info
    ga_info: {
      secretKey: "",
      qrcode: "",
    },
    new_ga_info: {},
    // 重置密码order id
    resetpwdId: "",
    need2FA: false, // 是否需要二次验证
    authType: "", // 二次验证方式 MOBILE: 手机; EMAIL: 邮箱; GA: Google Auth; ID_CARD: 身份证号
    pwdOrderId: "0", // 找回密码的二次验证码orderId, GA、ID_CARD默认“0”
    checked2FA: false, // 二次验证完成
    checkModalIsOpen: false, // 二次验证弹框
    sendVerfiCode2FA: false, // 2FA验证码
    // 实名信息
    verify_info: {},
    // 用户全部KYC级别信息,各等级认证信息
    user_kycinfo: [],
    // 用户当前kyc等级信息
    current_level_info: {},
    // 三级认证是否开启
    needVedioVerify: false,
    // 登录日志
    authorize_log: [],
    authorize_log_more: true,

    // 邀请信息
    invite_info: {},
    // 邀请分享信息
    invite_share_info: {},
    // 返佣记录
    bonus_list: [],
    bonus_list_more: true,
    // 邀请详细记录
    bonus_info_list: [],
    bonus_info_list_more: true,

    total: 0, // 总条数
    page: 0, // 页码
    rowsPerPage: CONST.rowsPerPage, // 每页条数
    rowsPerPage1: CONST.rowsPerPage1, // 成员列表加载条数
    rowsPerPageOptions: CONST.rowsPerPageOptions, // 条数选项
    tableData: [], // 列表数据
    // 用户等级信息
    user_level_info: {}, // 用户享有的等级权益信息
    level_configs: [], // 等级配置信息
    have_token_discount: {}, // 等级折扣信息
    borrowableTokens: [], // 杠杆可借的币种
    marginLevelInterest: {}, // 杠杆利率
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      history.listen((location) => {
        const pathname = location.pathname;
        if (
          pathname.indexOf(route_map.register) > -1 ||
          pathname.indexOf(route_map.login) > -1 ||
          pathname.indexOf(route_map.user_bind) > -1
        ) {
          // dispatch({
          //   type: "getCountries",
          //   payload: {}
          // });
        }
        if (pathname.indexOf(route_map.user_kyc) > -1) {
          dispatch({
            type: "getIdCardType",
            payload: {},
          });
          // dispatch({
          //   type: "getCountries",
          //   payload: {}
          // });
          // dispatch({
          //   type: "verify_info",
          //   payload: {}
          // });
        }
        if (pathname.indexOf(route_map.user_api) > -1) {
          dispatch({
            type: "api_list",
            payload: {},
          });
        }
        if (pathname === route_map.user_center) {
          dispatch({
            type: "authorize_log",
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    // 获取国家区号
    *getCountries({ payload }, { call, put }) {
      const result = yield call(getData("countries"), {
        payload,
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            countries: result.data,
          },
        });
      }
    },

    *handleChange({ payload }, { call, put, select }) {
      let user = yield select((state) => state.user);
      if (payload.register) {
        user.register = Object.assign({}, user.register, payload.register);
      }
      if (payload.login) {
        user.login = Object.assign({}, user.login, payload.login);
      }
      yield put({
        type: "save",
        payload: {
          ...user,
        },
      });
    },
    *propsChange({ payload }, { put }) {
      yield put({
        type: "save",
        payload,
      });
    },
    // 提交注册
    *register({ payload, history, redirect }, { call, put, select }) {
      let data = payload;
      data.password1 = md5(payload.password1);
      data.password2 = md5(payload.password2);
      const result = yield call(
        getData(payload.type == 0 ? "register" : "register_mobile"),
        {
          payload: data,
        }
      );
      // 注册成功，跳转登录页
      if (result.code == "OK") {
        //message.info(window.appLocale.messages["注册成功"]);
        if (redirect) {
          const url = decodeURIComponent(redirect);
          if (url && helper.sameDomain(url)) {
            window.location.href = helper.filterRedirect(url);
          } else {
            window.location.href = route_map.register_guide;
          }
        } else {
          window.location.href = route_map.register_guide;
        }
      } else {
        message.error(result.msg);
      }
    },
    // 登录 step1
    *login_step1(
      { payload, history, success, fail, redirect, channel },
      { call, put }
    ) {
      let data = payload;
      data.password = md5(payload.password);
      let url = payload.type == 0 ? "login" : "quick_authorize";
      if (channel && channel == "login" && payload.type == 0) {
        url = "login_all";
      }
      const result = yield call(getData(url), {
        payload: data,
      });
      if (result.code === "OK") {
        if (
          // 密码登录成功
          (!result.data.bindGA &&
            !result.data.bindEmail &&
            !result.data.bindMobile &&
            payload.type == 0) ||
          // 快捷登录成功
          (payload.type == 1 && !result.data.needCheckPassword)
        ) {
          window.localStorage.removeItem("resetpwdType");
          window.sessionStorage.userinfo = JSON.stringify(result.data);
          yield put({
            type: "layout/save",
            payload: {
              userinfo: result.data,
            },
          });
          if (redirect && helper.sameDomain(redirect)) {
            const url = helper.filterRedirect(decodeURIComponent(redirect));
            window.location.href = url;
          } else {
            window.location.href = route_map.index;
          }
          return;
        }
        yield put({
          type: "save",
          payload: {
            loginVerify: result.data,
          },
        });
        success();
      } else {
        // 业务需求，在组件内判断是否弹message
        //message.error(result.msg)
        fail(result.code, result.msg);
      }
    },
    // 登录 step2
    *login_step2(
      { payload, history, redirect, errorCallback, errorClear },
      { call, put }
    ) {
      let data = payload;
      data.password = md5(payload.password);
      const result = yield call(
        getData(payload.type == 0 ? "login_step2" : "quick_authorize_advance"),
        {
          payload: data,
        }
      );
      if (result.code === "OK") {
        window.localStorage.removeItem("resetpwdType");
        //message.info(window.appLocale.messages["登录成功"]);
        window.sessionStorage.userinfo = JSON.stringify(result.data);
        yield put({
          type: "layout/save",
          payload: {
            userinfo: result.data,
          },
        });
        if (redirect && helper.sameDomain(redirect)) {
          const url = helper.filterRedirect(decodeURIComponent(redirect));
          window.location.href = url;
        } else {
          window.location.href = route_map.index;
          //history.push(route_map.index);
        }
      } else {
        errorCallback && errorCallback(errorClear, result.code, result.msg);
        message.error(result.msg);
      }
    },
    // ga_info bind ga step1
    *ga_info({ payload }, { call, put }) {
      const result = yield call(getData("ga_info"), {
        payload,
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            ga_info: result.data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    // bind ga step2
    *bind_ga({ payload, errorCallback, history }, { call, put }) {
      const result = yield call(getData("bind_ga"), {
        payload,
      });
      if (result.code == "OK") {
        //message.info(window.appLocale.messages["谷歌绑定成功"]);
        window.location.href = route_map.user_center;
        //history.push(route_map.user_center);
      } else {
        message.error(result.msg);
        errorCallback();
      }
    },
    // bind ga step2
    *unbind_ga({ payload, errorCallback, history }, { call, put }) {
      const result = yield call(getData("unbind_ga"), {
        payload,
      });
      if (result.code == "OK") {
        window.location.href = route_map.user_center;
      } else {
        message.error(result.msg);
        errorCallback();
      }
    },
    *change_bind_ga({ payload, errorCallback, history }, { call, put }) {
      const result = yield call(getData("change_bind_ga"), {
        payload,
      });
      if (result.code == "OK") {
        message.success(window.appLocale.messages["GA更换成功"]);
        window.location.href = route_map.user_center;
      } else {
        message.error(result.msg);
        errorCallback();
      }
    },
    // 替换GA时，获取新的GA信息
    *new_ga_info({ payload }, { call, put }) {
      const result = yield call(getData("new_ga_info"), {
        payload,
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            new_ga_info: result.data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    // bind mobile
    *bind_mobile({ payload, history, success }, { call }) {
      const result = yield call(getData("bind_mobile"), {
        payload,
      });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["手机绑定成功"]);
        if (success) {
          success();
        } else {
          window.location.href = route_map.user_center;
          //history.push(route_map.user_center);
        }
      } else {
        // 登录失效
        message.error(result.msg);
      }
    },
    *unbind_mobile({ payload, history }, { call }) {
      const result = yield call(getData("unbind_mobile"), {
        payload,
      });
      if (result.code === "OK") {
        window.location.href = route_map.user_center;
      } else {
        message.error(result.msg);
      }
    },
    // bind email
    *bind_email({ payload, history }, { call }) {
      const result = yield call(getData("bind_email"), {
        payload,
      });
      if (result.code === "OK") {
        window.location.href = route_map.user_center;
      } else {
        message.error(result.msg);
      }
    },
    *unbind_email({ payload, history }, { call }) {
      const result = yield call(getData("unbind_email"), {
        payload,
      });
      if (result.code === "OK") {
        window.location.href = route_map.user_center;
      } else {
        message.error(result.msg);
      }
    },
    *change_bind_email({ payload, history }, { call }) {
      const result = yield call(getData("change_bind_email"), {
        payload,
      });
      if (result.code === "OK") {
        window.location.href = route_map.user_center;
      } else {
        message.error(result.msg);
      }
    },
    *change_bind_mobile({ payload, history }, { call }) {
      const result = yield call(getData("change_bind_mobile"), {
        payload,
      });
      if (result.code === "OK") {
        window.location.href = route_map.user_center;
      } else {
        message.error(result.msg);
      }
    },
    // 设置密码
    *set_pwd({ payload, history }, { call }) {
      let values = { ...payload };
      values.password1 = md5(payload.password1);
      values.password2 = md5(payload.password2);
      const result = yield call(getData("set_password"), {
        payload: values,
      });
      if (result.code === "OK") {
        window.location.href = route_map.user_center;
      } else {
        message.error(result.msg);
      }
    },
    // 登录日志
    *authorize_log({ payload }, { call, put, select }) {
      // const defaultAccountId = Cookie.read("account_id");
      const authorize_log = yield select((state) => state.user.authorize_log);
      const result = yield call(getData("authorize_log"), {
        payload: {
          log_id: authorize_log.length
            ? authorize_log[authorize_log.length - 1]["id"]
            : "",
          limit: LIMIT,
        },
      });
      if (result.code === "OK") {
        let data = {};
        data.authorize_log = helper
          .arrayClone(authorize_log)
          .concat(result.data);
        data.authorize_log_more = result.data.length < LIMIT ? false : true;
        yield put({
          type: "save",
          payload: data,
        });
      }
    },
    // forget password
    *forgetpassword({ payload, errorCallback }, { call, put }) {
      const result = yield call(
        getData(payload.email ? "email_find_password" : "mobile_find_password"),
        {
          payload,
        }
      );
      if (result.code === "OK") {
        window.localStorage.resetpwdType = payload.email ? 0 : 1;
        yield put({
          type: "save",
          payload: {
            resetpwdId: result.data.requestId,
            need2FA: result.data.need2FA,
            checkModalIsOpen: result.data.need2FA,
            authType: result.data.authType,
          },
        });
      } else {
        message.error(result.msg);
        errorCallback && errorCallback();
      }
    },
    // send 2FA code
    *send2FACode({ payload }, { call, put }) {
      const result = yield call(getData("find_pwd"), {
        payload,
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            pwdOrderId: result.data.orderId,
            sendVerfiCode2FA: true,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    // check 2FA
    *check2FA({ payload }, { call, put }) {
      const result = yield call(getData("find_pwd_check2"), {
        payload,
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            checked2FA: true,
            checkModalIsOpen: false,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    *onCancel({ payload }, { call, put }) {
      yield put({
        type: "save",
        payload: {
          checkModalIsOpen: false,
        },
      });
    },
    // resetpwd
    *resetpwd({ payload, history }, { call, put }) {
      let data = payload;
      data.password1 = md5(payload.password1);
      data.password2 = md5(payload.password2);
      const result = yield call(getData("reset_password"), {
        payload: data,
      });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["密码重置成功,请重新登录"]);
        window.location.href = route_map.login;
      } else {
        // 登录失效
        message.error(result.msg);
      }
    },
    // 修改密码
    *editpassword({ payload, history }, { call, put }) {
      let data = payload;
      data.old_password = md5(payload.old_password);
      data.password1 = md5(payload.password1);
      data.password2 = md5(payload.password2);
      const result = yield call(getData("update_pwd"), {
        payload: data,
      });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["修改成功，请重新登录"]);
        Cookie.del("account_id");
        window.location.href = route_map.login;
      } else {
        // 登录失效
        message.error(result.msg);
      }
    },
    // 资金密码
    *fundpassword({ payload, history, errorCallback }, { call, put }) {
      let data = payload;
      data.trade_pwd = md5(payload.password1);
      data.trade_pwd2 = md5(payload.password2);
      delete data.password1;
      delete data.password2;
      const result = yield call(getData("fund_password"), {
        payload: data,
      });
      if (result.code === "OK") {
        window.location.href = route_map.user_center;
        //history.push(route_map.user_center);
      } else {
        message.error(result.msg);
        errorCallback && errorCallback(result);
      }
    },
    // 证件类型
    *getIdCardType({ payload }, { call, put }) {
      const result = yield call(getData("id_card_type"), {
        payload,
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            id_card_type: result.data,
          },
        });
      }
    },
    // 实名认证
    *kyc({ payload, history }, { call, put }) {
      const result = yield call(getData("kyc"), {
        payload,
      });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["提交成功"]);
        window.location.href = route_map.user_center;
        //history.push(route_map.user_center);
      } else {
        // 登录失效
        message.error(result.msg);
      }
    },
    *verify_info({ payload, callback }, { call, put }) {
      const result = yield call(getData("verify_info"), {
        payload,
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            verify_info: result.data,
          },
        });
        callback &&
          callback(result.data.displayLevel, result.data.verifyStatus);
      }
    },
    // api list
    *api_list({ payload }, { call, put }) {
      const result = yield call(getData("api_list"), {
        payload,
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            api_list: result.data,
          },
        });
      } else {
        // 登录失效
        //message.error(result.msg);
      }
    },
    // api create
    *api_create({ payload, success }, { call, put, select }) {
      const result = yield call(getData("api_create"), {
        payload,
      });
      if (result.code === "OK") {
        let list = yield select((state) => state.user.api_list);
        list.unshift(result.data);
        yield put({
          type: "save",
          payload: {
            api_list: list,
          },
        });
        success && success(result.data.securityKey);
      } else {
        message.error(result.msg);
      }
    },
    // api update
    *api_update({ payload, success }, { call, put }) {
      const result = yield call(getData("api_update"), {
        payload,
      });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["修改成功"]);
        success && success();
      } else {
        message.error(result.msg);
      }
    },
    // api status
    *api_status({ payload, success, i }, { call, put, select }) {
      const result = yield call(getData("api_status"), {
        payload,
      });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["设置成功"]);
        success && success();
        const api_list = yield select((state) => state.user.api_list);
        let data = helper.arrayClone(api_list);
        data[i]["status"] = payload.status;
        yield put({
          type: "save",
          payload: {
            api_list: data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    // api del
    *api_del({ payload, success, i }, { call, put, select }) {
      const result = yield call(getData("api_del"), {
        payload,
      });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["删除成功"]);
        success && success();
        const api_list = yield select((state) => state.user.api_list);
        let data = helper.arrayClone(api_list);
        data.splice(i, 1);
        yield put({
          type: "save",
          payload: {
            api_list: data,
          },
        });
      } else {
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
              ...result.data.inviteInfoDTO,
            },
          },
        });
      }
    },
    // 邀请分享信息
    *invite_share_info({ payload }, { call, put }) {
      const result = yield call(getData("invite_share_info"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            invite_share_info: result.data,
          },
        });
      }
    },
    // 返佣记录
    *invite_list({ payload }, { call, put, select }) {
      const bonus_list = yield select((state) => state.user.bonus_list);
      const result = yield call(getData("bonus_list"), {
        payload: {
          beforeId: bonus_list.length
            ? bonus_list[bonus_list.length - 1]["id"]
            : "",
          limit: 20,
        },
      });
      if (result.code === "OK") {
        let newdata = [...bonus_list].concat(result.data.recordList);
        newdata = helper.excludeRepeatArray("id", newdata);
        yield put({
          type: "save",
          payload: {
            bonus_list: newdata,
            bonus_list_more: result.data.recordList.length < 20 ? false : true,
          },
        });
      }
    },
    // 返佣记录
    *bonus_info_list({ payload }, { call, put, select }) {
      const bonus_info_list = yield select(
        (state) => state.user.bonus_info_list
      );
      const result = yield call(getData("bonus_info_list"), {
        payload: {
          from_id:
            bonus_info_list.length &&
            bonus_info_list[bonus_info_list.length - 1]
              ? bonus_info_list[bonus_info_list.length - 1]["inviteId"]
              : "",
          limit: 20,
        },
      });
      if (result.code === "OK" && result.data && result.data.data) {
        let newdata = [...bonus_info_list].concat(result.data.data);
        newdata = helper.excludeRepeatArray("inviteId", newdata);
        yield put({
          type: "save",
          payload: {
            bonus_info_list: newdata,
            bonus_info_list_more: result.data.data.length < 20 ? false : true,
          },
        });
      }
    },
    /**
     * 统一表格获取数据方法
     * @param {Object} payload {page,size,...}
     * @param {String} api  api path
     *
     * param page, 控件的翻页从0开始，接口从1开始，需要处理
     */
    *getTableData({ payload, api }, { call, put }) {
      const result = yield call(getData(api), {
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
        const data = result.data;
        const { total, page, size, list, ...props } = data;
        yield put({
          type: "save",
          payload: {
            total: Number(total),
            page: page - 1,
            rowsPerPage: size,
            tableData: list,
            ...props,
          },
        });
      }
    },
    /**
     * 清除table记录
     */
    *clearTableData({ payload }, { put }) {
      yield put({
        type: "save",
        payload: {
          total: 0,
          page: 0,
          rowsPerPage: CONST.rowsPerPage,
          tableData: [],
        },
      });
    },
    /**
     * 获取用户KYC级别信息
     */
    *get_user_kycinfo({ payload }, { call, put, select }) {
      const result = yield call(getData("get_user_kycinfo"), {
        payload,
        method: "get",
      });
      if (result.code === "OK") {
        let needVedioVerify = result.data.find(
          (data) => data.displayLevel == "3"
        );
        yield put({
          type: "save",
          payload: {
            user_kycinfo: result.data,
            current_level_info:
              result.data.find(
                (data) => data.displayLevel == payload.current_level
              ) || {},
            needVedioVerify: needVedioVerify
              ? needVedioVerify.allowVerify
              : false, // 三级kyc是否打开
          },
        });
      }
    },
    /**
     * 保存用户KYC基础信息
     */
    *save_basicverify({ payload }, { call, put, select }) {
      const verify_info = yield select((state) => state.user.verify_info);
      const result = yield call(getData("kyc_basic_verify"), { payload });
      if (result.code === "OK") {
        verify_info["verifyStatus"] = result.data.success ? 2 : 3;
        verify_info["displayLevel"] = "0";
      } else {
        verify_info["verifyStatus"] = 3;
      }
      yield put({
        type: "save",
        payload: {
          verify_info: verify_info,
        },
      });
    },
    /**
     * 保存用户KYC高级认证信息
     */
    *save_seniorverify({ payload, callback }, { call, put, select }) {
      const verify_info = yield select((state) => state.user.verify_info);
      const result = yield call(getData("kyc_photo_verify"), { payload });
      if (result.code === "OK") {
        verify_info["verifyStatus"] = 1; // 审核中
        callback && callback();
      } else {
        verify_info["verifyStatus"] = 3; // 审核失败
        verify_info["refusedReason"] = result.msg;
      }
    },
    /**
     * 获取用户等级信息
     */
    *get_level_info({ payload }, { call, put }) {
      const result = yield call(getData("user_level_info"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            user_level_info: result.data.userLevelInfo || {},
          },
        });
      }
    },
    /**
     * 获取等级配置信息
     */
    *get_level_configs({ payload }, { call, put }) {
      const result = yield call(getData("user_level_configs"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            level_configs: result.data.levelConfigs || [],
            have_token_discount: result.data.haveTokenDiscount || {},
          },
        });
      }
    },
    /**
     * 设置防钓鱼码
     */
    *setFishCode({ payload, success }, { call, put, select }) {
      const result = yield call(getData("fish_code"), { payload });
      if (result.code == "OK") {
        const userinfo = yield select((state) => state.layout.userinfo);
        yield put({
          type: "layout/userinfo",
          payload: {},
        });
        success && success();
      } else {
        result.msg && message.error(result.msg);
      }
    },
    // 杠杆币种查询
    *getMarginTokens({ payload }, { call, put }) {
      const result = yield call(getData("get_margin_tokens"), {
        payload,
        method: "GET",
      });
      if (result.code == "OK" && result.data) {
        const borrowableTokens = [];
        // 可借币种倍数
        result.data.forEach((item) => {
          if (item.canBorrow == true) {
            borrowableTokens.push(item);
          }
        });
        yield put({
          type: "save",
          payload: {
            borrowableTokens,
          },
        });
      } else {
        result.msg && message.error(result.msg);
      }
    },
    // 获取杠杆利率
    *getMarginLevelInterest({ payload }, { call, put }) {
      const result = yield call(getData("margin_level_interest"), {
        payload,
        method: "GET",
      });
      if (result.code == "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            marginLevelInterest: result.data,
          },
        });
      } else {
        result.msg && message.error(result.msg);
      }
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
