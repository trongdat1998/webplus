// 登录组件
// 登录步骤： formSubmit =>  verifyForm => onRecaptchaSuccess => login_step1
import React from "react";
import { injectIntl } from "react-intl";
import classnames from "classnames";
import { parse } from "search-params";
import { withStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  CircularProgress,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

import { message, Iconfont } from "../../lib";
import route_map from "../../config/route_map";
import SecVerifyLogin from "../public/secVerify_login"; // 二次验证
import cookie from "../../utils/cookie";
import CONST from "../../config/const";
import helper from "../../utils/helper";
import VerfiCodeRC from "../public/verificationCode_mui";
import SelectRC from "../public/select";
import SenseCaptcha from "../public/sense_captcha"; // 极验
import GoogleCaptcha from "../public/google_captcha"; // google 验证

import styles from "./login_style";

class Login extends React.Component {
  constructor() {
    super();
    this.secverifyRef = React.createRef();
    this.state = {
      show: false,
      type: 0, // 0密码登录 or 1快捷登录
      sendVerfiCode: false,
      isopen: false, // 人机layer
      isopen2: false, // 二次验证layer
      isopen3: false, // 密码框
      status: true,
      username: {
        status: "",
        msg: "",
        value: "",
      },
      mobile: {
        status: "",
        msg: "",
        value: "",
      },
      ga: {
        status: "",
        msg: "",
        value: "",
      },
      password: {
        status: "",
        msg: "",
        value: "",
      },
      verify_code: {
        status: "",
        msg: "",
      },
      national_code: CONST.DEFAULT_NATIONAL_CODE,
      country_name: "",
      outTime: false,
    };
    this.formSubmit = this.formSubmit.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.changeType = this.changeType.bind(this);
    this.login_step1 = this.login_step1.bind(this);
    this.login_step2 = this.login_step2.bind(this);
    this.onStep2Success = this.onStep2Success.bind(this);
    this.onStep1LoginFail = this.onStep1LoginFail.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.countTime = this.countTime.bind(this);
    // 极验
    this.senseSuccess = this.senseSuccess.bind(this);
    this.senseError = this.senseError.bind(this);
    this.senseClose = this.senseClose.bind(this);

    // google验证
    this.grecaptchaReset = this.grecaptchaReset.bind(this);
  }
  componentDidMount() {
    const account_id = cookie.read("account_id");
    if (account_id) {
      let search = this.props.location.search;
      search = search ? search.replace("?", "") : "";
      if (
        parse(search)["redirect"] &&
        helper.sameDomain(parse(search)["redirect"])
      ) {
        window.location.href = helper.filterRedirect(
          decodeURIComponent(parse(search)["redirect"])
        );
        return;
      }
      window.location.href = route_map.index;
      return;
    }
    // 移动端
    if (helper.changeVersion()) {
      window.location.href = window.location.href.replace("/login", "/m/login");
      return;
    }

    this.setState({
      national_code:
        this.props.areacode[window.localStorage.lang] ||
        this.props.areacode["zh-cn"],
    });
  }
  // 发送验证码
  sendVerfiCode = (e) => {
    const username = this.state.username.value;
    if (!username) {
      this.verfiCode.reset();
      this.setState({
        username: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "此项不能为空",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      return;
    }
    if (
      this.state.type == 1 &&
      this.state.national_code == 86 &&
      !/^1[3456789]\d{9}$/.test(username)
    ) {
      this.verfiCode.reset();
      this.setState({
        username: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "无效的手机",
              })}
            </React.Fragment>
          ),
          value: username,
        },
      });
      return;
    }
    // 调用极验
    this.setState({
      isopen: true,
    });
    this.recaptcha.execute();
  };
  countTime() {
    var a = () => {
      this.setState({
        outTime: true,
      });
    };
    setTimeout(a, 10000);
  }
  onCancel() {
    this.setState({
      isopen2: false,
    });
  }
  closeDialog = (key, v) => (e) => {
    this.setState({
      [key]: v,
    });
  };
  // 提交二次验证结果，进行登录
  async onStep2Success(obj, func) {
    let values = {
      password: this.state.password.value,
      username: this.state.username.value,
    };
    values.type = this.state.type;
    values.request_id = this.props.loginVerify.requestId;
    values.auth_type = obj.auth_type || "";
    values.order_id = this.props.order_id;
    values.verify_code = obj.verify_code || "";
    let search = this.props.location.search;
    search = search ? search.replace("?", "") : "";

    try {
      await this.props.dispatch({
        type: "user/login_step2",
        payload: values,
        redirect: search ? parse(search)["redirect"] : "",
        path: this.props.location.state ? this.props.location.state.path : "",
        history: this.props.history,
        errorCallback: this.onStep2Fail,
        errorClear: func,
      });
    } catch (err) {
      await this.onStep2Fail(func);
    }
  }
  onStep2Fail = (clear, code, msg) => {
    this.setState({
      isopen: false,
      isopen3: false,
    });
    // 重置快捷登录验证码
    this.verfiCode && this.verfiCode.reset();
    if (!this.secverifyRef.current) {
      this.setState({
        isopen2: false,
      });
      return;
    }
    this.setState({
      isopen2: false,
    });
    clear && clear();
  };
  /**
   * login_step1 返回的数据，然后进行二次验证
   */
  login_step2() {
    // 密码登录
    if (this.state.type == 0) {
      this.setState({
        isopen2: true,
        isopen: false,
      });
    }
    // 快捷登录
    if (this.state.type == 1) {
      this.setState({
        isopen: false,
        isopen3: true,
      });
    }
  }

  onAreaCodeChange = (v) => {
    this.setState({
      national_code: v,
    });
  };
  changeType(n) {
    this.setState({
      type: n,
      sendVerfiCode: false,
      status: true,
      username: {
        status: "",
        msg: "",
        value: "",
      },
      mobile: {
        status: "",
        msg: "",
        value: "",
      },
      password: {
        status: "",
        msg: "",
        value: "",
      },
      verify_code: {
        status: "",
        msg: "",
        value: "",
      },
    });
    this.grecaptchaReset();
  }

  changeStatus(n, e) {
    let t = e.target;
    let value = t.value;
    value = value.replace(/\s/g, "");
    this.setState({
      [n]: {
        status: "",
        msg: "",
        value,
      },
    });
  }

  onStep1LoginFail(code, msg) {
    this.recaptcha.reset();
    this.verfiCode && this.verfiCode.reset();
    if ("31019,31048,31049,31050".indexOf(code) > -1) {
      this.setState({
        password: {
          status: "error",
          msg: msg,
          value: this.state.password.value,
        },
      });
    } else {
      message.error(msg);
      this.setState({
        password: {
          status: "error",
          msg: "",
          value: this.state.password.value,
        },
      });
    }
  }
  // 极验，验证成功
  senseSuccess({ captcha_response, captcha_id, challenge }) {
    this.setState(
      {
        isopen: false,
        captcha_response,
        captcha_id,
        challenge,
        sendVerfiCode: true,
      },
      () => {
        // 密码登录
        if (this.state.type == 0) {
          this.login_step1();
        }
        // 快捷登录
        if (this.state.type == 1) {
          let data = {
            national_code: this.state.national_code,
            mobile: this.state.username.value,
            captcha_response,
            captcha_id,
            challenge,
          };
          data.type = 22; // 快捷登录
          this.props.dispatch({
            type: "layout/get_verify_code",
            payload: data,
            errorCallback: () => {
              this.verfiCode.reset();
            }, // 验证码错误回调
          });
          this.recaptcha.reset();
        }
      }
    );
  }
  // 极验 失败
  senseError(err) {
    this.setState({
      isopen: false,
    });
    message.error(err.msg);
  }
  // 极验，用户关闭
  senseClose() {
    this.setState({
      isopen: false,
    });
  }

  grecaptchaReset() {
    this.recaptcha.reset();
  }

  /**
   * 验证表单
   * @param
   * @returns
   */
  formSubmit(e) {
    e && e.preventDefault();
    let verifyResut = this.verifyForm();
    if (!verifyResut) {
      return;
    }
    this.countTime();
    // 快捷登录
    if (this.state.type == 1) {
      this.login_step1();
    } else {
      // 密码登录
      this.setState({
        isopen: true,
        outTime: false,
      });
      // 调用极验
      this.recaptcha.reset();
      this.recaptcha.execute();
    }
  }

  // 验证表单
  verifyForm() {
    const username = this.state.username.value;
    const password = this.state.password.value;
    const verify_code = this.state.verify_code.value;
    if (!username) {
      this.setState({
        username: {
          status: "error",
          msg: this.props.intl.formatMessage({
            id: "此项不能为空",
          }),
        },
      });
      return false;
    }
    // 密码登录
    if (this.state.type == 0) {
      if (!password) {
        this.setState({
          password: {
            status: "error",
            msg: this.props.intl.formatMessage({
              id: "此项不能为空",
            }),
          },
        });
        return false;
      }
      // 密码 大于 8位，
      if (
        password.length < 8 ||
        password.length > 20 ||
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)
      ) {
        this.setState({
          password: {
            status: "error",
            msg: this.props.intl.formatMessage({
              id: "密码8-20位字符，必须包含大小写字母和数字",
            }),
            value: this.state.password.value,
          },
        });
        return false;
      }
    }

    // 快捷登录
    if (this.state.type == 1) {
      if (!this.state.verify_code) {
        this.setState({
          verify_code: {
            status: "error",
            msg: this.props.intl.formatMessage({
              id: "请输入验证码",
            }),
            value: this.state.verify_code.value,
          },
        });
        return false;
      }
      if (!this.state.sendVerfiCode) {
        this.setState({
          verify_code: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "请获取验证码",
                })}
              </React.Fragment>
            ),
            value: verify_code,
          },
        });
        return;
      }
    }

    return true;
  }

  login_step1 = () => {
    let values = {
      // 密码登录
      password: this.state.password.value,
      username: this.state.username.value,
      type: this.state.type,
      captcha_response: this.state.captcha_response,
      captcha_id: this.state.captcha_id,
      challenge: this.state.challenge,
      // 快捷登录
      mobile: this.state.username.value,
      login_type: "mobile",
      order_id: this.props.order_id,
      national_code: this.state.national_code,
      verify_code: this.state.verify_code.value,
    };
    let search = this.props.location.search;
    search = search ? search.replace("?", "") : "";

    this.props.dispatch({
      type: "user/login_step1",
      payload: {
        ...values,
      },
      channel: "login",
      redirect: search ? parse(search)["redirect"] : "",
      success: this.login_step2,
      fail: this.onStep1LoginFail,
      history: this.props.history,
    });
  };

  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.formSubmit()
    }
  };

  render() {
    const s = this.props.classes;
    let options = [];
    const lang = window.localStorage.lang;

    this.props.countries.forEach((item) => {
      options.push({
        label: item.nationalCode,
        value: item.nationalCode + "/" + item.countryName,
        search:
          item.countryName +
          item.nationalCode +
          item.shortName +
          item.indexName,
        id: item.id,
      });
    });

    let source = window.getCookie("source");
    let backgroundGroup = {};

    window.WEB_CONFIG.loginReg &&
      window.WEB_CONFIG.loginReg.forEach((el) => {
        backgroundGroup[el.source] = el;
      });

    let background =
      backgroundGroup[source] || backgroundGroup["default"] || {};

    let style = {};
    let wrapStyle = {};

    if (background.loginPage && background.loginPage.wrapBackground) {
      style.backgroundColor = "rgba(0, 0, 0,.7)";
      wrapStyle.background =
        "url(" + background.loginPage.wrapBackground + ") no-repeat center";
      wrapStyle.backgroundSize = "cover";
    }

    const isCloseMobile =
      window.WEB_CONFIG.registerOption == CONST.REGISTER_OPTIONS.ONLY_EMAIL;

    return (
      <div className={s.wrap} style={wrapStyle}>
        <div className={s.login}>
          <Paper className={s.content}>
            <h1>{this.props.intl.formatMessage({ id: "欢迎登录" })}</h1>
            <div className={s.link}>
              <div>
                {this.props.intl.formatMessage({ id: "还没账号" })}?{" "}
                <a href={route_map.register + window.location.search}>
                  {this.props.intl.formatMessage({ id: "免费注册" })}
                </a>
              </div>
            </div>
            {isCloseMobile ? (
              ""
            ) : (
              <div className={s.tab}>
                <div
                  className={this.state.type == 0 ? s.tab_on : ""}
                  onClick={this.changeType.bind(this, 0)}
                >
                  {this.props.intl.formatMessage({ id: "密码登录" })}
                </div>
                <div
                  className={this.state.type == 1 ? s.tab_on : ""}
                  onClick={this.changeType.bind(this, 1)}
                >
                  {this.props.intl.formatMessage({ id: "快捷登录" })}
                </div>
              </div>
            )}
            {/* 快捷登录 */}
            {this.state.type == 1 ? (
              <div className={classnames(s.formItem, s.mobile)}>
                <div className={s.selectbox}>
                  <SelectRC
                    options={options}
                    value={this.state.national_code}
                    onChange={this.onAreaCodeChange}
                    label={this.props.intl.formatMessage({
                      id: "区号",
                    })}
                  />
                </div>
                <TextField
                  fullWidth
                  autoComplete="new-password"
                  onChange={this.changeStatus.bind(this, "username")}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入手机号",
                  })}
                  label={this.props.intl.formatMessage({ id: "手机号" })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={this.state.username.value}
                  error={Boolean(this.state.username.msg)}
                  helperText={this.state.username.msg}
                />
              </div>
            ) : (
              <div
                className={classnames({
                  [s.formItem]: true,
                  [s.noTabFormItem]: isCloseMobile,
                })}
              >
                <TextField
                  fullWidth
                  value={this.state.username.value}
                  onChange={this.changeStatus.bind(this, "username")}
                  error={Boolean(this.state.username.msg)}
                  label={this.props.intl.formatMessage({ id: "邮箱或手机号" })}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入邮箱或手机号",
                  })}
                  helperText={this.state.username.msg}
                />
              </div>
            )}
            {/* 密码登录 */}
            {this.state.type == 0 ? (
              <div className={s.formItem}>
                {this.state.show ? (
                  <TextField
                    fullWidth
                    value={this.state.password.value}
                    error={Boolean(this.state.password.msg)}
                    onChange={this.changeStatus.bind(this, "password")}
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入密码",
                    })}
                    label={this.props.intl.formatMessage({ id: "登录密码" })}
                    onKeyDown={this._handleKeyDown}
                    InputProps={{
                      endAdornment: (
                        <Iconfont
                          type="unhidden"
                          onClick={() => {
                            this.setState({
                              show: false,
                            });
                          }}
                        />
                      ),
                    }}
                  />
                ) : (
                  <TextField
                    type="password"
                    fullWidth
                    value={this.state.password.value}
                    error={Boolean(this.state.password.msg)}
                    onChange={this.changeStatus.bind(this, "password")}
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入密码",
                    })}
                    label={this.props.intl.formatMessage({ id: "登录密码" })}
                    onKeyDown={this._handleKeyDown}
                    InputProps={{
                      endAdornment: (
                        <Iconfont
                          type="hidden"
                          onClick={() => {
                            this.setState({
                              show: true,
                            });
                          }}
                        />
                      ),
                    }}
                  />
                )}
                <div className={s.forgetpwd}>
                  <span>{this.state.password.msg}</span>
                  <a href={route_map.forgetpwd + "/email"}>
                    {this.props.intl.formatMessage({ id: "忘记密码" })}
                  </a>
                </div>
              </div>
            ) : (
              /* 快捷登录 */
              <div className={s.formItem}>
                <TextField
                  fullWidth
                  autoComplete="new-password"
                  value={this.state.verify_code.value}
                  onChange={this.changeStatus.bind(this, "verify_code")}
                  className={s.verify_code}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入验证码",
                  })}
                  label={this.props.intl.formatMessage({ id: "验证码" })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={Boolean(this.state.verify_code.msg)}
                  helperText={this.state.verify_code.msg}
                  InputProps={{
                    endAdornment: (
                      <VerfiCodeRC
                        value={this.state.username.value}
                        onClick={this.sendVerfiCode}
                        className={s.verfCode}
                        variant="text"
                        ref={(ref) => (this.verfiCode = ref)}
                      />
                    ),
                  }}
                />
              </div>
            )}
            {!this.state.outTime &&
            (this.props.loading.effects["user/login_step1"] ||
              this.state.isopen2 ||
              this.state.isopen) ? (
              <Button
                fullWidth
                color="primary"
                variant="contained"
                disabled
                className={s.loginbtn}
              >
                <CircularProgress size={32} color="primary" />
              </Button>
            ) : (
              <Button
                fullWidth
                onClick={this.formSubmit}
                color="primary"
                variant="contained"
                className={s.loginbtn}
              >
                {this.props.intl.formatMessage({ id: "登录" })}
              </Button>
            )}
            <div className={s.captchaWrapper}>
              {CONST.CAPTCHA_TYPE == CONST.CAPTCHA_TYPES.GOOGLE ? (
                <GoogleCaptcha
                  style={{ marginTop: 10 }}
                  ref={(ref) => (this.recaptcha = ref)}
                  onSuccess={this.senseSuccess}
                  onError={this.senseError}
                />
              ) : (
                <SenseCaptcha
                  type="2"
                  dispatch={this.props.dispatch}
                  lang={window.localStorage.lang === "zh-cn" ? "zh-cn" : "en"}
                  onSuccess={this.senseSuccess}
                  onError={this.senseError}
                  onClose={this.senseClose}
                  geetestData={this.props.geetestData}
                  ref={(ref) => (this.recaptcha = ref)}
                />
              )}
            </div>
          </Paper>

          <SecVerifyLogin
            userinfo={this.props.loginVerify}
            dispatch={this.props.dispatch}
            verifyType={2}
            n={2}
            requestId={this.props.loginVerify.requestId}
            loading={this.props.loading.effects["user/login_step2"]}
            isopen={this.state.isopen2}
            callback={this.onStep2Success}
            showCloseBtn={true}
            onCancel={this.onCancel}
            ref={this.secverifyRef}
          />
          <Dialog
            open={this.state.isopen3}
            onClose={this.closeDialog("isopen3", false)}
          >
            <DialogContent style={{ width: 400, padding: 24 }}>
              {this.state.show ? (
                <TextField
                  fullWidth
                  value={this.state.password.value}
                  error={Boolean(this.state.password.msg)}
                  onChange={this.changeStatus.bind(this, "password")}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入密码",
                  })}
                  label={this.props.intl.formatMessage({ id: "登录密码" })}
                  onKeyDown={this._handleKeyDown}
                  InputProps={{
                    endAdornment: (
                      <Iconfont
                        type="unhidden"
                        onClick={() => {
                          this.setState({
                            show: false,
                          });
                        }}
                      />
                    ),
                  }}
                />
              ) : (
                <TextField
                  type="password"
                  fullWidth
                  value={this.state.password.value}
                  error={Boolean(this.state.password.msg)}
                  onChange={this.changeStatus.bind(this, "password")}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入密码",
                  })}
                  label={this.props.intl.formatMessage({ id: "登录密码" })}
                  onKeyDown={this._handleKeyDown}
                  InputProps={{
                    endAdornment: (
                      <Iconfont
                        type="hidden"
                        onClick={() => {
                          this.setState({
                            show: true,
                          });
                        }}
                      />
                    ),
                  }}
                />
              )}
              <div className={s.forgetpwd}>
                <span>{this.state.password.msg}</span>
                <a href={route_map.forgetpwd + "/email"}>
                  {this.props.intl.formatMessage({ id: "忘记密码" })}
                </a>
              </div>
            </DialogContent>
            <DialogActions style={{ padding: "0 16px", margin: "8px 4px" }}>
              {this.props.loading.effects &&
              this.props.loading.effects["user/login_step2"] ? (
                <Button fullWidth color="primary" variant="contained" disabled>
                  <CircularProgress size={20} color="primary" />
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  onClick={this.onStep2Success}
                >
                  {this.props.intl.formatMessage({ id: "确定" })}
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Login));
