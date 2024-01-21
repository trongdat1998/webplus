// 注册
import React from "react";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import { parse } from "search-params";
import {
  TextField,
  Button,
  CircularProgress,
  Paper,
  Checkbox,
} from "@material-ui/core";

import { message, Iconfont } from "../../lib";
import Vali from "../../utils/validator";
import route_map from "../../config/route_map";
import VerfiCodeRC from "../public/verificationCode_mui";
import helper from "../../utils/helper";
import SelectRC from "../public/select";
import CONST from "../../config/const";
import SenseCaptcha from "../public/sense_captcha"; // 极验
import GoogleCaptcha from "../public/google_captcha"; // google 验证

import styles from "./login_style";

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      isopen: false, // google 人机验证layer
      type: 1, // 邮箱 or 手机注册
      sendVerfiCode: false,
      status: true,
      email: {
        status: "",
        msg: "",
        value: "",
      },
      mobile: {
        status: "",
        msg: "",
        value: "",
      },
      password1: {
        status: "",
        msg: "",
        value: "",
      },
      password2: {
        status: "",
        msg: "",
        value: "",
      },
      agreement: {
        status: "",
        msg: "",
        value: false,
      },
      verify_code: {
        status: "",
        msg: "",
        value: "",
      },
      invite_code: {
        status: "",
        msg: "",
        value: "",
      },
      national_code: CONST.DEFAULT_NATIONAL_CODE,
      country_name: "",
    };
    this.formSubmit = this.formSubmit.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.areaCodeChange = this.areaCodeChange.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.changeType = this.changeType.bind(this);
    this.dropchange = this.dropchange.bind(this);

    // 极验
    this.senseSuccess = this.senseSuccess.bind(this);
    this.senseError = this.senseError.bind(this);
    this.senseClose = this.senseClose.bind(this);
    this.senseNextWillShow = this.senseNextWillShow.bind(this);
  }

  dropchange(v) {
    const d = v.value.split("-");
    this.setState({
      national_code: d[0],
      country_name: d[1],
    });
  }
  changeType(n) {
    this.setState({
      type: n,
      sendVerfiCode: false,
      email: {
        status: "",
        msg: "",
        value: "",
      },
      mobile: {
        status: "",
        msg: "",
        value: "",
      },
      password1: {
        status: "",
        msg: "",
        value: "",
      },
      password2: {
        status: "",
        msg: "",
        value: "",
      },
      agreement: {
        status: "",
        msg: "",
        value: false,
      },
      verify_code: {
        status: "",
        msg: "",
        value: "",
      },
    });
    this.verfiCode && this.verfiCode.reset();
  }
  parseSearch = (url) => {
    let search = (url || this.props.location.search).replace("?", "");
    search = parse(search);
    return search;
  };
  componentDidMount() {
    // 移动端
    if (helper.changeVersion()) {
      const location = window.location;
      window.location.href = location.href.replace("/register", "/m/register");
      return;
    }
    /**
     * 注册地址的邀请码支持3种方式
     * 1、 /register/123456
     * 2、 /register?invite_code=123456
     * 3、 /register?redirect=http%3A%2F%2Flocalhost%3A3001%2Fm%2Fguild%2Fhome%3Finvite_code%3D123456
     */
    const search = this.parseSearch();
    let invite_code =
      this.props.match.params.invite_code || search.invite_code || "";
    if (search.redirect) {
      const s = decodeURIComponent(search.redirect);
      const code = s.match(/invite_code\=([^&]{0,})/);
      if (code && code[1]) {
        invite_code = code[1];
      }
    }
    const account = search.account || "";

    const isClosePhoneRegister =
      (window.WEB_CONFIG.registerOption ==
        CONST.REGISTER_OPTIONS.EMAIL_AND_CHINA_PHONE &&
        window.localStorage.lang != "zh-cn") ||
      window.WEB_CONFIG.registerOption == CONST.REGISTER_OPTIONS.ONLY_EMAIL;
    let type = isClosePhoneRegister ? 0 : 1; // // 0 邮箱 1 手机 默认手机
    if (account) {
      if (account.indexOf("@") > -1) {
        type = 0;
      }
    }
    this.setState({
      type,
      email: {
        status: "",
        msg: "",
        value: type == 0 ? account : "",
      },
      mobile: {
        status: "",
        msg: "",
        value: type == 1 ? account : "",
      },
      invite_code: {
        status: "",
        msg: "",
        value: invite_code,
      },
      national_code:
        this.props.areacode[window.localStorage.lang] ||
        this.props.areacode["zh-cn"],
    });
  }
  SelectChange = (v) => {
    this.setState({
      national_code: v,
    });
  };
  changeStatus(n, e) {
    let t = e.target;
    // 需要重置google recaptcha 和 验证码
    if (n === "email" || n === "mobile") {

      this.setState({
        sendVerfiCode: false,
        verify_code: {
          status: "",
          msg: "",
          value: "",
        },
      });
    }
    let value =
      t.type == "checkbox"
        ? !this.state.agreement.value
        : helper.removeEmoji(t.value.replace(/\s/g, ""));
    this.setState({
      [n]: {
        status: "",
        msg: "",
        value,
      },
    });
  }
  areaCodeChange(value, prevValue, allValues) {
    const d = (value || "").split("-");
    return d[0];
  }
  // 发送验证码
  sendVerfiCode(e) {
    const email = this.state.email.value;
    const mobile = this.state.mobile.value;
    if (this.state.type == 0) {
      if (!email) {
        this.verfiCode.reset();
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
        return;
      }
      if (!Vali.isEmail(email)) {
        this.verfiCode.reset();
        this.setState({
          email: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "无效的邮箱地址",
                })}
              </React.Fragment>
            ),
            value: this.state.email.value,
          },
        });
        return;
      }
    } else {
      if (!mobile) {
        this.verfiCode.reset();
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
        return;
      }
    }

    if (
      this.state.type == 1 &&
      this.state.national_code == 86 &&
      !/^1[3456789]\d{9}$/.test(mobile)
    ) {
      this.verfiCode.reset();
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
          value: mobile,
        },
      });
      return;
    }

    // 调用极验
    this.setState({
      isopen: true,
    });
    this.recaptcha.execute();
  }
  // 极验，验证成功
  senseSuccess({ captcha_response, captcha_id, challenge }) {
    this.setState(
      {
        sendVerfiCode: true,
        verify_code: {
          status: "",
          msg: "",
          value: "",
        },
        isopen: false,
      },
      () => {
        let data = {
          national_code: this.state.national_code,
          mobile: this.state.mobile.value,
          captcha_response: captcha_response,
          captcha_id,
          challenge,
        };
        if (this.state.type == 0) {
          data = {
            email: this.state.email.value,
            captcha_response,
            captcha_id,
            challenge,
          };
        }
        data.type = 1; // 注册
        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          errorCallback: () => {
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
  senseNextWillShow() {}

  // google 验证成功回调
  onCaptchaSuccess(response) {
    this.setState(
      {
        sendVerfiCode: true,
        verify_code: {
          status: "",
          msg: "",
          value: "",
        },
        isopen: false,
      },
      () => {
        let data = {
          national_code: this.state.national_code,
          mobile: this.state.mobile.value,
          captcha_response: response,
        };
        if (this.state.type == 0) {
          data = {
            email: this.state.email.value,
            captcha_response: response,
          };
        }
        data.type = 1; // 注册
        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          errorCallback: () => {
            this.verfiCode.reset();
          }, // 验证码错误回调
        });
        this.recaptcha.reset();
      }
    );
  }

  onCaptchaError(err) {
    this.setState({
      isopen: false,
    });
    this.verfiCode.reset();
    message.error(err.msg);
  }
  formSubmit(e) {
    e && e.preventDefault();

    const email = this.state.email.value;
    const verify_code = this.state.verify_code.value;
    const mobile = this.state.mobile.value;
    const password1 = this.state.password1.value;
    const password2 =
      window.location.href.indexOf("hideRepassword") > -1
        ? this.state.password1.value
        : this.state.password2.value;

    if (this.state.type == 0) {
      if (!email) {
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
            value: email,
          },
        });
        return;
      }
      if (!Vali.isEmail(email)) {
        this.setState({
          email: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "无效的邮箱地址",
                })}
              </React.Fragment>
            ),
            value: email,
          },
        });
        return;
      }
    }
    if (this.state.type == 1) {
      if (!mobile) {
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
            value: mobile,
          },
        });
        return;
      }
      if (this.state.national_code == 86 && !/^1[3456789]\d{9}$/.test(mobile)) {
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
            value: mobile,
          },
        });
        return;
      }
    }

    if (!password1) {
      this.setState({
        password1: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "此项不能为空",
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
    if (!verify_code) {
      this.setState({
        verify_code: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "此项不能为空",
              })}
            </React.Fragment>
          ),
          value: verify_code,
        },
      });
      return;
    }
    if (!/^\d{6}$/.test(verify_code)) {
      this.setState({
        verify_code: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "验证码错误",
              })}
            </React.Fragment>
          ),
          value: verify_code,
        },
      });
      return;
    }
    if (!this.state.agreement.value) {
      this.setState({
        agreement: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请阅读并同意服务协议",
              })}
            </React.Fragment>
          ),
          value: this.state.agreement.value,
        },
      });
      return;
    }
    let values = {
      verify_code,
      password1,
      password2,
      invite_code: this.state.invite_code.value,
      type: this.state.type,
      order_id: this.props.order_id,
    };
    if (this.state.type == 0) {
      values.email = email;
    } else {
      values.mobile = mobile;
      values.national_code = this.state.national_code;
    }
    let search = this.props.location.search;
    search = search ? search.replace("?", "") : "";
    this.props.dispatch({
      type: "user/register",
      payload: {
        ...values,
      },
      redirect: search ? parse(search)["redirect"] : "",
      history: this.props.history,
    });
  }
  render() {
    const s = this.props.classes;
    let options = [];
    const lang = window.localStorage.lang;
    const registerOption = window.WEB_CONFIG.registerOption;
    if (
      registerOption == CONST.REGISTER_OPTIONS.EMAIL_AND_CHINA_PHONE &&
      lang === "zh-cn"
    ) {
      // 中文的话，过滤一下contries
      this.props.countries
        .filter((item) => item.nationalCode == "86")
        .forEach((item) => {
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
    } else if (
      registerOption == CONST.REGISTER_OPTIONS.ALL ||
      registerOption == CONST.REGISTER_OPTIONS.ONLY_PHONE
    ) {
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
    }

    const showTab =
      registerOption == CONST.REGISTER_OPTIONS.ALL ||
      (registerOption == CONST.REGISTER_OPTIONS.EMAIL_AND_CHINA_PHONE &&
        lang == "zh-cn");
    const firstFormItemStyle = { marginTop: 16 };

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
    if (background.regPage) {
      if (background.regPage.type == 1) {
        // style.width = "520px";
        // style.background = "rgba(0, 0, 0,.7)";
      } else {
        //如果设置了背景色，原来层是透明层，所以指定背景色增加视觉反差。
        if (background.regPage.wrapBackground) {
          style.width = "1040px";
          //style.background = "rgba(255, 255, 255,.7)";
        }
        if (background.regPage.layoutBackground) {
          style.backgroundImage = `url(${background.regPage.layoutBackground})`;
          style.backgroundPosition = `480px center`;
          style.backgroundRepeat = `no-repeat`;
          style.backgroundSize = "auto 100%";
        }
      }
      if (background.regPage.wrapBackground) {
        wrapStyle.background = `url(${background.regPage.wrapBackground}) no-repeat center`;
        wrapStyle.backgroundSize = "cover";
      }
    }
    const search = this.parseSearch();
    let invite_code =
      this.props.match.params.invite_code || search.invite_code || "";
    return (
      <div className={s.wrap} style={wrapStyle}>
        <div className={s.login}>
          <Paper className={s.content} style={style}>
            <div style={{ width: 400 }}>
              <h1>{this.props.intl.formatMessage({ id: "创建您的账号" })}</h1>
              <div className={s.link}>
                <div>
                  {this.props.intl.formatMessage({ id: "已有账号" })}?{" "}
                  <a href={route_map.login + window.location.search}>
                    {this.props.intl.formatMessage({ id: "登录" })}
                  </a>
                </div>
              </div>
              {showTab ? (
                <div className={s.tab}>
                  <div
                    className={this.state.type == 1 ? s.tab_on : ""}
                    onClick={this.changeType.bind(this, 1)}
                  >
                    {this.props.intl.formatMessage({ id: "手机" })}
                  </div>
                  <div
                    className={this.state.type == 0 ? s.tab_on : ""}
                    onClick={this.changeType.bind(this, 0)}
                  >
                    {this.props.intl.formatMessage({ id: "邮箱" })}
                  </div>
                </div>
              ) : (
                ""
              )}
              {this.state.type == 0 ? (
                <div
                  className={s.formItem}
                  style={showTab ? {} : firstFormItemStyle}
                >
                  <TextField
                    fullWidth
                    autoComplete="new-password"
                    value={this.state.email.value}
                    onChange={this.changeStatus.bind(this, "email")}
                    error={Boolean(this.state.email.msg)}
                    label={this.props.intl.formatMessage({ id: "邮箱" })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入邮箱",
                    })}
                    helperText={this.state.email.msg}
                  />
                </div>
              ) : (
                <div
                  className={classnames(s.formItem, s.mobile)}
                  style={showTab ? {} : firstFormItemStyle}
                >
                  <div className={s.selectbox}>
                    <SelectRC
                      options={options}
                      value={this.state.national_code}
                      onChange={this.SelectChange}
                      label={this.props.intl.formatMessage({
                        id: "区号",
                      })}
                    />
                  </div>
                  <TextField
                    fullWidth
                    autoComplete="new-password"
                    onChange={this.changeStatus.bind(this, "mobile")}
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入手机号",
                    })}
                    label={this.props.intl.formatMessage({ id: "手机号" })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.mobile.value}
                    error={Boolean(this.state.mobile.msg)}
                    helperText={this.state.mobile.msg}
                  />
                </div>
              )}
              <div className={s.formItem}>
                {this.state.show ? (
                  <TextField
                    autoComplete="new-password"
                    fullWidth
                    value={this.state.password1.value}
                    error={Boolean(this.state.password1.msg)}
                    helperText={this.state.password1.msg}
                    onChange={this.changeStatus.bind(this, "password1")}
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入密码",
                    })}
                    label={this.props.intl.formatMessage({ id: "登录密码" })}
                    InputLabelProps={{
                      shrink: true,
                    }}
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
                    autoComplete="new-password"
                    fullWidth
                    value={this.state.password1.value}
                    error={Boolean(this.state.password1.msg)}
                    helperText={this.state.password1.msg}
                    onChange={this.changeStatus.bind(this, "password1")}
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入密码",
                    })}
                    label={this.props.intl.formatMessage({ id: "登录密码" })}
                    InputLabelProps={{
                      shrink: true,
                    }}
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
              </div>
              <div className={s.formItem}>
                {this.state.show2 ? (
                  <TextField
                    fullWidth
                    autoComplete="new-password"
                    value={this.state.password2.value}
                    error={Boolean(this.state.password2.msg)}
                    helperText={this.state.password2.msg}
                    onChange={this.changeStatus.bind(this, "password2")}
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入确认密码",
                    })}
                    label={this.props.intl.formatMessage({ id: "确认密码" })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <Iconfont
                          type="unhidden"
                          onClick={() => {
                            this.setState({
                              show2: false,
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
                    autoComplete="new-password"
                    value={this.state.password2.value}
                    error={Boolean(this.state.password2.msg)}
                    helperText={this.state.password2.msg}
                    onChange={this.changeStatus.bind(this, "password2")}
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入确认密码",
                    })}
                    label={this.props.intl.formatMessage({ id: "确认密码" })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <Iconfont
                          type="hidden"
                          onClick={() => {
                            this.setState({
                              show2: true,
                            });
                          }}
                        />
                      ),
                    }}
                  />
                )}
              </div>

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
                        value={
                          this.state.type === 0
                            ? this.state.email
                            : this.state.mobile
                        }
                        onClick={this.sendVerfiCode}
                        className={s.verfCode}
                        variant="text"
                        ref={(ref) => (this.verfiCode = ref)}
                      />
                    ),
                  }}
                />
              </div>
              <div className={classnames(s.formItem, s.inviteCode)}>
                {invite_code ? (
                  <TextField
                    fullWidth
                    autoComplete="new-password"
                    value={this.state.invite_code.value}
                    error={Boolean(this.state.invite_code.msg)}
                    helperText={this.state.invite_code.msg}
                    placeholder={this.props.intl.formatMessage({
                      id: window.WEB_CONFIG.checkInviteCode
                        ? "邀请码"
                        : "邀请码(选填)",
                    })}
                    disabled
                    label={this.props.intl.formatMessage({
                      id: window.WEB_CONFIG.checkInviteCode
                        ? "邀请码"
                        : "邀请码(选填)",
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    autoComplete="new-password"
                    error={Boolean(this.state.invite_code.msg)}
                    helperText={this.state.invite_code.msg}
                    value={this.state.invite_code.value}
                    onChange={this.changeStatus.bind(this, "invite_code")}
                    placeholder={this.props.intl.formatMessage({
                      id: window.WEB_CONFIG.checkInviteCode
                        ? "邀请码"
                        : "邀请码(选填)",
                    })}
                    label={this.props.intl.formatMessage({
                      id: window.WEB_CONFIG.checkInviteCode
                        ? "邀请码"
                        : "邀请码(选填)",
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              </div>
              <div className={s.checkbox}>
                <Checkbox
                  color="primary"
                  checked={this.state.agreement.value}
                  onChange={this.changeStatus.bind(this, "agreement")}
                  style={{ padding: "4px 4px 4px 0" }}
                />
                {this.props.intl.formatMessage({ id: "我已阅读并同意" })}{" "}
                <a
                  href={this.props.index_config.userAgreement}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.props.intl.formatMessage({ id: "服务协议" })}
                </a>{" "}
                <a
                  href={this.props.index_config.privacyAgreement}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.props.intl.formatMessage({ id: "隐私协议" })}
                </a>
              </div>
              <div className={s.forgetpwd}>
                <span>{this.state.agreement.msg}</span>
              </div>

              {this.props.loading.effects["user/register"] ||
              this.state.isopen ? (
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  disabled
                  className={s.loginbtn}
                >
                  <CircularProgress size={32} color="primary" />
                </Button>
              ) : (
                <Button
                  fullWidth
                  className={s.loginbtn}
                  color="primary"
                  variant="contained"
                  onClick={this.formSubmit}
                >
                  {this.props.intl.formatMessage({ id: "注册" })}
                </Button>
              )}
            </div>
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
                  type="1"
                  dispatch={this.props.dispatch}
                  geetestData={this.props.geetestData}
                  lang={window.localStorage.lang === "zh-cn" ? "zh-cn" : "en"}
                  onSuccess={this.senseSuccess}
                  onError={this.senseError}
                  onClose={this.senseClose}
                  onNextWillShow={this.senseNextWillShow}
                  ref={(ref) => (this.recaptcha = ref)}
                />
              )}
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Register));
