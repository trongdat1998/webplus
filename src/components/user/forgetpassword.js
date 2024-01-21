// 忘记密码
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  TextField,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";

import { Iconfont, message } from "../../lib";
import CONST from "../../config/const";
import GoBackRC from "./goBack";
import VerfiCodeRC from "../public/verificationCode_mui";
import SelectRC from "../public/select";
import Vali from "../../utils/validator";
import Sense from "../public/sense_captcha"; // 极验
import GoogleCaptcha from "../public/google_captcha"; // google 验证

import styles from "./usercenter_style";

class ForgetPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      national_code: CONST.DEFAULT_NATIONAL_CODE,
      sendVerfiCode: false,
      type: "mobile",
      mobile: {
        value: "",
        msg: "",
      },
      mobileCode: {
        value: "",
        msg: "",
      },
      email: {
        value: "",
        msg: "",
      },
      emailCode: {
        value: "",
        msg: "",
      },
      password1: {
        value: "",
        msg: "",
      },
      password2: {
        value: "",
        msg: "",
      },
      isopen: false,
      mobileCode2: {
        value: "",
        msg: "",
      },
      emailCode2: {
        value: "",
        msg: "",
      },
      ga: {
        value: "",
        msg: "",
      },
      idCard: {
        value: "",
        msg: "",
      },
    };
    this.renderMobile = this.renderMobile.bind(this);
    this.renderEmail = this.renderEmail.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.dropchange = this.dropchange.bind(this);
    this.forgetpassword = this.forgetpassword.bind(this);
    this.getResponse = this.getResponse.bind(this);
    this.resetpwd = this.resetpwd.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.send2FACode = this.send2FACode.bind(this);
    this.preAction = this.preAction.bind(this);

    // 极验
    this.senseSuccess = this.senseSuccess.bind(this);
    this.senseError = this.senseError.bind(this);
    this.senseClose = this.senseClose.bind(this);
  }
  componentDidMount() {
    this.setState({
      national_code:
        this.props.areacode[window.localStorage.lang] ||
        this.props.areacode["zh-cn"],
      // type: /mobile/i.test(window.location.pathname) ? 1 : 0
    });
  }
  // google recaptcha success
  getResponse(token) {
    this.setState({
      isopen: false,
    });
    this.sendVerfiCode();
  }
  dropchange(v) {
    const d = v.target.value.split("-");
    this.setState({
      national_code: d[0],
    });
  }
  SelectChange = (v) => {
    this.setState({
      national_code: v,
    });
  };
  // 发送验证码
  sendVerfiCode() {
    const type = this.state.type;
    if (type === "email") {
      if (!this.state.email.value) {
        this.setState({
          email: {
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
        this.verfiCode.reset();
        return;
      }
      if (!Vali.isEmail(this.state.email.value)) {
        this.setState({
          email: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "无效的邮箱",
                })}
              </React.Fragment>
            ),
            value: "",
          },
        });
        this.verfiCode.reset();
        return;
      }
    }
    if (type === "mobile") {
      if (!this.state.mobile.value) {
        this.setState({
          mobile: {
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
        this.verfiCode.reset();
        return;
      }
      if (
        this.state.national_code === "86" &&
        !/^1[3456789]\d{9}$/.test(this.state.mobile.value)
      ) {
        this.setState({
          mobile: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "无效的手机",
                })}
              </React.Fragment>
            ),
            value: "",
          },
        });
        this.verfiCode.reset();
        return;
      }
    }

    // 调用极验
    this.setState({
      isopen: true,
    });
    this.recaptcha.execute();
  }
  send2FACode() {
    this.props.dispatch({
      type: "user/send2FACode",
      payload: {
        request_id: this.props.resetpwdId,
      },
    });
  }
  preAction() {
    let v = "";
    // ga
    if (this.props.authType == "GA") {
      v = this.state.ga.value;
      if (!v) {
        this.setState({
          ga: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "此项不能为空",
                })}
              </React.Fragment>
            ),
          },
        });
        return;
      }
      if (!/^\d{6}$/.test(v)) {
        this.setState({
          ga: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "验证码错误",
                })}
              </React.Fragment>
            ),
          },
        });
        return;
      }
    }
    // 手机、邮箱
    if (this.props.authType == "MOBILE" || this.props.authType == "EMAIL") {
      if (!this.props.sendVerfiCode2FA) {
        this.setState({
          [this.props.authType == "MOBILE" ? "mobileCode2" : "emailCode2"]: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "请获取验证码",
                })}
              </React.Fragment>
            ),
          },
        });
        this.verfiCode2.reset();
        return;
      }
      // 手机验证
      if (this.props.authType == "EMAIL") {
        v = this.state.emailCode2.value;
        if (!v) {
          this.setState({
            emailCode2: {
              value: v,
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "此项不能为空",
                  })}
                </React.Fragment>
              ),
            },
          });
          this.verfiCode2.reset();
          return;
        }
        if (!/^[0-9a-zA-Z]{6,8}$/.test(v)) {
          this.setState({
            emailCode2: {
              value: v,
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "验证码错误",
                  })}
                </React.Fragment>
              ),
            },
          });
          this.verfiCode2.reset();
          return;
        }
      }
      // 邮箱注册，验证手机
      if (this.props.authType == "MOBILE") {
        v = this.state.mobileCode2.value;
        if (!v) {
          this.setState({
            mobileCode2: {
              value: v,
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "此项不能为空",
                  })}
                </React.Fragment>
              ),
            },
          });
          this.verfiCode2.reset();
          return;
        }
        if (!/^[0-9a-zA-Z]{6,8}$/.test(v)) {
          this.setState({
            mobileCode2: {
              value: v,
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "验证码错误",
                  })}
                </React.Fragment>
              ),
            },
          });
          this.verfiCode2.reset();
          return;
        }
      }
    }
    if (this.props.authType == "ID_CARD") {
      v = this.state.idCard.value;
      if (!v) {
        this.setState({
          idCard: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "此项不能为空",
                })}
              </React.Fragment>
            ),
          },
        });
        return;
      }
    }
    this.props.dispatch({
      type: "user/check2FA",
      payload: {
        request_id: this.props.resetpwdId,
        order_id: this.props.pwdOrderId || "0",
        verify_code: v,
      },
    });
  }

  // 极验，验证成功
  senseSuccess({ captcha_id, captcha_response, challenge }) {
    this.setState(
      {
        sendVerfiCode: true,
        isopen: false,
      },
      () => {
        const type = this.state.type.toLowerCase();
        let data = {
          type: 3,
          captcha_response,
          captcha_id,
          challenge,
        };
        if (type === "email") {
          data.email = this.state.email.value;
        } else {
          data.mobile = this.state.mobile.value;
          data.national_code = this.state.national_code;
        }

        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          errorCallback: () => {
            this.setState({
              sendVerfiCode: false,
            });
            this.verfiCode.reset();
          }, // 验证码错误回调
        });
        this.recaptcha.reset();
      }
    );
  }
  // 极验 失败
  senseError(err) {
    this.setState({
      isopen: false,
    });
    this.verfiCode.reset();
    message.error(err.msg);
  }
  // 极验，用户关闭
  senseClose() {
    this.setState({
      isopen: false,
    });
    this.verfiCode.reset();
  }

  // 忘记密码
  forgetpassword() {
    const type = this.state.type.toLowerCase();

    if (type === "email") {
      if (!this.state.email.value) {
        this.setState({
          email: {
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
        this.verfiCode.reset();
        return;
      }
      if (!Vali.isEmail(this.state.email.value)) {
        this.setState({
          email: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "无效的邮箱",
                })}
              </React.Fragment>
            ),
            value: this.state.email.value,
          },
        });
        this.verfiCode.reset();
        return;
      }
      // 请获取手机验证码
      if (!this.state.sendVerfiCode) {
        this.setState({
          [type === "email" ? "emailCode" : "mobileCode"]: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: type === "email" ? "请获取验证码" : "请获取验证码",
                })}
              </React.Fragment>
            ),
            value: "",
          },
        });
        this.verfiCode.reset();
        return;
      }
      if (!this.state.emailCode.value) {
        this.setState({
          emailCode: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "请输入验证码",
                })}
              </React.Fragment>
            ),
            value: "",
          },
        });
        return;
      }
      if (!/^[a-z0-9A-Z]{6,8}$/.test(this.state.emailCode.value)) {
        this.setState({
          emailCode: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "验证码错误",
                })}
              </React.Fragment>
            ),
            value: this.state.emailCode.value,
          },
        });
        return;
      }
    }
    if (type === "mobile") {
      if (!this.state.mobile.value) {
        this.setState({
          mobile: {
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
        this.verfiCode.reset();
        return;
      }
      if (
        this.state.national_code === "86" &&
        !/^1[3456789]\d{9}$/.test(this.state.mobile.value)
      ) {
        this.setState({
          mobile: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "无效的手机",
                })}
              </React.Fragment>
            ),
            value: this.state.mobile.value,
          },
        });
        this.verfiCode.reset();
        return;
      }
      // 请获取手机验证码
      if (!this.state.sendVerfiCode) {
        this.setState({
          [type === "email" ? "emailCode" : "mobileCode"]: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: type === "email" ? "请获取验证码" : "请获取验证码",
                })}
              </React.Fragment>
            ),
            value: "",
          },
        });
        this.verfiCode.reset();
        return;
      }
      // 请输入手机验证码
      if (!this.state.mobileCode.value) {
        this.setState({
          mobileCode: {
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
      // 手机验证码不正确
      if (!/^[a-z0-9A-Z]{6,8}$/.test(this.state.mobileCode.value)) {
        this.setState({
          mobileCode: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "验证码错误",
                })}
              </React.Fragment>
            ),
            value: this.state.mobileCode.value,
          },
        });
        //this.verfiCode2.reset();
        return;
      }
    }

    let data = {};
    data.order_id = this.props.order_id;
    data.verify_code =
      type === "email"
        ? this.state.emailCode.value
        : this.state.mobileCode.value;
    if (type === "email") {
      data.email = this.state.email.value;
    }
    if (type === "mobile") {
      data.mobile = this.state.mobile.value;
      data.national_code = this.state.national_code;
    }
    this.props.dispatch({
      type: "user/forgetpassword",
      payload: data,
      errorCallback: () => {
        this.recaptcha.reset();
      },
    });
  }
  // 重置密码
  resetpwd() {
    const type = this.state.type.toLowerCase();
    const password1 = this.state.password1.value;
    const password2 = this.state.password2.value;
    if (!password1) {
      this.setState({
        password1: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请输入密码",
              })}
            </React.Fragment>
          ),
          value: password1,
        },
      });
      return;
    }
    // 密码 大于 8位，
    if (
      password1.length < 8 ||
      password1.length > 20 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password1)
    ) {
      this.setState({
        password1: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "密码8-20位字符，必须包含大小写字母和数字",
              })}
            </React.Fragment>
          ),
          value: password1,
        },
      });
      return;
    }
    if (password2 != password1) {
      this.setState({
        password2: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "两次密码输入不一致",
              })}
            </React.Fragment>
          ),
          value: password2,
        },
      });
      return;
    }

    let data = {
      request_id: this.props.resetpwdId,
      password1: this.state.password1.value,
      password2: this.state.password2.value,
    };

    if (type === "email") {
      data.email = this.state.email.value;
    }
    if (type === "mobile") {
      data.mobile = this.state.mobile.value;
      data.national_code = this.state.national_code;
    }
    this.props.dispatch({
      type: "user/resetpwd",
      payload: data,
      history: this.props.history,
    });
  }
  changeStatus(n, e) {
    const t = e.target;
    if (n === "mobile" || n === "email") {
      this.verfiCode && this.verfiCode.reset();
      this.setState({
        sendVerfiCode: false,
        [n + "Code"]: {
          value: "",
          msg: "",
        },
      });
    }
    let value = t.value;
    value = value.replace(/\s/g, "");
    this.setState({
      [n]: {
        msg: "",
        value,
      },
    });
  }
  onCancel() {
    this.setState({
      ga: {
        msg: "",
        value: "",
      },
      mobileCode2: {
        msg: "",
        value: "",
      },
      emailCode2: {
        msg: "",
        value: "",
      },
      idCard: {
        value: "",
        msg: "",
      },
      sendVerfiCode: false,
    });
    this.verfiCode && this.verfiCode.reset();
    this.verfiCode2 && this.verfiCode2.reset();
    this.props.dispatch({
      type: "user/onCancel",
    });
  }
  changeType = (n) => {
    this.setState({ type: n });
  };
  renderEmail() {
    const { classes } = this.props;
    return (
      <div className={classes.forget}>
        <div className={classes.tab}>
          <div
            className={this.state.type == "mobile" ? classes.tab_on : ""}
            onClick={this.changeType.bind(this, "mobile")}
          >
            {this.props.intl.formatMessage({ id: "手机" })}
          </div>
          <div
            className={this.state.type == "email" ? classes.tab_on : ""}
            onClick={this.changeType.bind(this, "email")}
          >
            {this.props.intl.formatMessage({ id: "邮箱" })}
          </div>
        </div>
        <div className={classes.g_form}>
          <div className={classes.formItem}>
            <div className={classes.formContent} style={{ flex: 1 }}>
              <TextField
                autoComplete="new-password"
                value={this.state.email.value}
                onChange={this.changeStatus.bind(this, "email")}
                prefix={<Iconfont type="email" />}
                label={this.props.intl.formatMessage({ id: "邮箱" })}
                placeholder={this.props.intl.formatMessage({
                  id: "请输入邮箱",
                })}
                fullWidth
                error={Boolean(this.state.email.msg)}
                helperText={this.state.email.msg}
              />
            </div>
          </div>

          <div className={classes.formItem}>
            <div className={classes.formContent} style={{ flex: 1 }}>
              <TextField
                value={this.state.emailCode.value}
                onChange={this.changeStatus.bind(this, "emailCode")}
                label={this.props.intl.formatMessage({ id: "邮箱验证码" })}
                placeholder={this.props.intl.formatMessage({
                  id: "请输入验证码",
                })}
                fullWidth
                error={Boolean(this.state.emailCode.msg)}
                helperText={this.state.emailCode.msg}
                InputProps={{
                  endAdornment: (
                    <VerfiCodeRC
                      value={this.state.email.value}
                      onClick={this.sendVerfiCode.bind(this, "email_order_id")}
                      className={classes.verfCode}
                      variant="text"
                      ref={(ref) => (this.verfiCode = ref)}
                    />
                  ),
                }}
              />
            </div>
          </div>

          <div className={classes.formItem}>
            <div className={classes.formContent}>
              {this.props.loading.effects["user/forgetpassword"] ? (
                <Button variant="contained" className={classes.btn} disabled>
                  {this.props.intl.formatMessage({
                    id: "确定",
                  })}
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.btn}
                  onClick={this.forgetpassword}
                >
                  {this.props.intl.formatMessage({
                    id: "确定",
                  })}
                </Button>
              )}
            </div>
          </div>
          <div className={classes.captchaWrapper}>
            {CONST.CAPTCHA_TYPE == CONST.CAPTCHA_TYPES.GOOGLE ? (
              <GoogleCaptcha
                style={{ marginTop: 10 }}
                ref={(ref) => (this.recaptcha = ref)}
                onSuccess={this.senseSuccess}
                onError={this.senseError}
              />
            ) : (
              <Sense
                type="0"
                lang={window.localStorage.lang === "zh-cn" ? "zh-cn" : "en"}
                dispatch={this.props.dispatch}
                geetestData={this.props.geetestData}
                onSuccess={this.senseSuccess}
                onError={this.senseError}
                onClose={this.senseClose}
                ref={(ref) => (this.recaptcha = ref)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
  renderMobile() {
    const { classes } = this.props;
    let options = [];
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
    return (
      <div className={classes.forget}>
        <div className={classes.tab}>
          <div
            className={this.state.type == "mobile" ? classes.tab_on : ""}
            onClick={this.changeType.bind(this, "mobile")}
          >
            {this.props.intl.formatMessage({ id: "手机" })}
          </div>
          <div
            className={this.state.type == "email" ? classes.tab_on : ""}
            onClick={this.changeType.bind(this, "email")}
          >
            {this.props.intl.formatMessage({ id: "邮箱" })}
          </div>
        </div>
        <div className={classes.g_form}>
          <div className={classes.formItem}>
            <div
              className={classnames(classes.formContent)}
              style={{ width: 80 }}
            >
              <SelectRC
                options={options}
                value={this.state.national_code}
                onChange={this.SelectChange}
                label={this.props.intl.formatMessage({
                  id: "区号",
                })}
              />
            </div>
            <div
              className={classnames(classes.formContent)}
              style={{ flex: 1 }}
            >
              <TextField
                value={this.state.mobile.value}
                onChange={this.changeStatus.bind(this, "mobile")}
                label={this.props.intl.formatMessage({ id: "手机号" })}
                placeholder={this.props.intl.formatMessage({
                  id: "请输入手机号",
                })}
                fullWidth
                error={Boolean(this.state.mobile.msg)}
                helperText={this.state.mobile.msg}
              />
            </div>
          </div>

          <div className={classes.formItem}>
            <div className={classes.formContent} style={{ flex: 1 }}>
              <TextField
                value={this.state.mobileCode.value}
                onChange={this.changeStatus.bind(this, "mobileCode")}
                placeholder={this.props.intl.formatMessage({
                  id: "请输入验证码",
                })}
                label={this.props.intl.formatMessage({ id: "手机验证码" })}
                fullWidth
                error={Boolean(this.state.mobileCode.msg)}
                helperText={this.state.mobileCode.msg}
                InputProps={{
                  endAdornment: (
                    <VerfiCodeRC
                      value={this.state.mobile.value}
                      onClick={this.sendVerfiCode}
                      className={classes.verfCode}
                      variant="text"
                      ref={(ref) => (this.verfiCode = ref)}
                    />
                  ),
                }}
              />
            </div>
            <div
              className={classes.formContent}
              style={{ padding: "15px 0 0" }}
            ></div>
          </div>

          <div className={classes.formItem}>
            <div className={classes.formContent}>
              {this.props.loading.effects["user/forgetpassword"] ? (
                <Button
                  color="primary"
                  variant="contained"
                  disabled
                  className={classes.btn}
                >
                  {this.props.intl.formatMessage({
                    id: "确定",
                  })}
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.btn}
                  onClick={this.forgetpassword}
                >
                  {this.props.intl.formatMessage({
                    id: "确定",
                  })}
                </Button>
              )}
            </div>
          </div>
          <div className={classes.captchaWrapper}>
            {CONST.CAPTCHA_TYPE == CONST.CAPTCHA_TYPES.GOOGLE ? (
              <GoogleCaptcha
                style={{ marginTop: 10 }}
                ref={(ref) => (this.recaptcha = ref)}
                onSuccess={this.senseSuccess}
                onError={this.senseError}
              />
            ) : (
              <Sense
                type="0"
                lang={window.localStorage.lang === "zh-cn" ? "zh-cn" : "en"}
                dispatch={this.props.dispatch}
                geetestData={this.props.geetestData}
                onSuccess={this.senseSuccess}
                onError={this.senseError}
                onClose={this.senseClose}
                ref={(ref) => (this.recaptcha = ref)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
  renderResetPwd() {
    const { classes } = this.props;
    return (
      <div className={classes.forget}>
        <div className={classes.g_form}>
          <div className={classes.formItem}>
            <div className={classes.formContent} style={{ flex: 1 }}>
              <TextField
                type="password"
                autoComplete="new-password"
                value={this.state.password1.value}
                onChange={this.changeStatus.bind(this, "password1")}
                label={this.props.intl.formatMessage({ id: "新密码" })}
                error={Boolean(this.state.password1.msg)}
                helperText={this.state.password1.msg}
                fullWidth
              />
            </div>
          </div>

          <div className={classes.formItem}>
            <div className={classes.formContent} style={{ flex: 1 }}>
              <TextField
                type="password"
                autoComplete="new-password"
                value={this.state.password2.value}
                label={this.props.intl.formatMessage({ id: "确认密码" })}
                onChange={this.changeStatus.bind(this, "password2")}
                error={Boolean(this.state.password2.msg)}
                helperText={this.state.password2.msg}
                fullWidth
              />
            </div>
          </div>
          <div className={classes.formItem}>
            <div className={classes.formContent}>
              {this.props.loading.effects["user/resetpwd"] ? (
                <Button
                  color="primary"
                  variant="contained"
                  disabled
                  className={classes.btn}
                >
                  {this.props.intl.formatMessage({
                    id: "确定",
                  })}
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.btn}
                  onClick={this.resetpwd}
                >
                  {this.props.intl.formatMessage({
                    id: "确定",
                  })}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderCheckModal() {
    const { classes } = this.props;
    return (
      <Dialog open={this.props.checkModalIsOpen} onClose={this.onCancel}>
        <DialogTitle className={classes.verify_title}>
          {this.props.authType == "GA" ? (
            <span>{this.props.intl.formatMessage({ id: "谷歌验证" })}</span>
          ) : (
            ""
          )}
          {this.props.authType == "EMAIL" ? (
            <span>{this.props.intl.formatMessage({ id: "邮箱验证" })}</span>
          ) : (
            ""
          )}
          {this.props.authType == "MOBILE" ? (
            <span>{this.props.intl.formatMessage({ id: "手机验证" })}</span>
          ) : (
            ""
          )}
          {this.props.authType == "ID_CARD" ? (
            <span>{this.props.intl.formatMessage({ id: "信息验证" })}</span>
          ) : (
            ""
          )}
        </DialogTitle>
        <DialogContent className={classes.veriBox}>
          {this.props.authType == "GA" ? (
            <TextField
              placeholder={this.props.intl.formatMessage({
                id: "请输入谷歌验证码",
              })}
              fullWidth
              error={Boolean(this.state.ga.msg)}
              inputRef={(ref) => (this.ga_input = ref)}
              value={this.state.ga.value}
              onChange={this.changeStatus.bind(this, "ga")}
              helperText={this.state.ga.msg}
            />
          ) : (
            ""
          )}
          {this.props.authType == "EMAIL" ? (
            <div className={classes.emailtype}>
              <TextField
                placeholder={this.props.intl.formatMessage({
                  id: "请输入验证码",
                })}
                fullWidth
                inputRef={(ref) => (this.email_input = ref)}
                value={this.state.emailCode2.value}
                onChange={this.changeStatus.bind(this, "emailCode2")}
                helperText={this.state.emailCode2.msg}
                error={Boolean(this.state.emailCode2.msg)}
                style={{ flex: 1 }}
                InputProps={{
                  endAdornment: (
                    <VerfiCodeRC
                      value={this.state.mobile.value}
                      onClick={this.send2FACode.bind(this, "emailCode2")}
                      className={classes.verfCode}
                      variant="text"
                      ref={(ref) => (this.verfiCode2 = ref)}
                    />
                  ),
                }}
              />
            </div>
          ) : (
            ""
          )}
          {this.props.authType == "MOBILE" ? (
            <div className={classes.emailtype}>
              <TextField
                placeholder={this.props.intl.formatMessage({
                  id: "请输入验证码",
                })}
                value={this.state.mobileCode2.value}
                onChange={this.changeStatus.bind(this, "mobileCode2")}
                inputRef={(ref) => (this.mobile_input = ref)}
                helperText={this.state.mobileCode2.msg}
                error={Boolean(this.state.mobileCode2.msg)}
                style={{ flex: 1 }}
                InputProps={{
                  endAdornment: (
                    <VerfiCodeRC
                      value={this.state.email.value}
                      onClick={this.send2FACode.bind(this, "mobileCode2")}
                      className={classes.verfCode}
                      variant="text"
                      ref={(ref) => (this.verfiCode2 = ref)}
                    />
                  ),
                }}
              />
            </div>
          ) : (
            ""
          )}
          {this.props.authType == "ID_CARD" ? (
            <TextField
              placeholder={this.props.intl.formatMessage({
                id: "请填写您在交易所的实名有效证件",
              })}
              fullWidth
              error={Boolean(this.state.idCard.msg)}
              inputRef={(ref) => (this.ga_input = ref)}
              value={this.state.idCard.value}
              onChange={this.changeStatus.bind(this, "idCard")}
              helperText={this.state.idCard.msg}
            />
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onCancel}>
            {this.props.intl.formatMessage({
              id: "取消",
            })}
          </Button>
          {this.props.loading.effects["user/check2FA"] ? (
            <Button color="primary" disabled>
              {this.props.intl.formatMessage({
                id: "确定",
              })}
            </Button>
          ) : (
            <Button color="primary" onClick={this.preAction}>
              {this.props.intl.formatMessage({
                id: "确定",
              })}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
  render() {
    const type = this.state.type;
    const { classes } = this.props;
    return (
      <div className={classes.center}>
        <Grid container>
          <Grid item xs={3}>
            <GoBackRC />
          </Grid>
          <Grid item xs={6}>
            <div className={classes.password_title}>
              {this.props.resetpwdId ? (
                <FormattedMessage id="重置密码" />
              ) : (
                <FormattedMessage id="忘记密码" />
              )}
            </div>
            <div className={classes.password_tip}>
              {this.props.intl.formatMessage({
                id: "提示:重置密码成功后，24小时内不可提现资产",
              })}
            </div>
            {this.props.resetpwdId &&
            (!this.props.need2FA ||
              (this.props.need2FA && this.props.checked2FA))
              ? this.renderResetPwd()
              : type == "email"
              ? this.renderEmail()
              : this.renderMobile()}
          </Grid>
          <Grid item xs={3} />
        </Grid>
        {this.renderCheckModal()}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(ForgetPassword));
