// 二次验证
import React from "react";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import VerfiCodeRC from "./verificationCode_mui";
import classnames from "classnames";
import helper from "../../utils/helper";
import { withStyles } from "@material-ui/core/styles";
import styles from "./secVerify_style";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  DialogTitle
} from "@material-ui/core";

/**
 * @class SecVerify
 * @param {String} isopen
 * @param {String} verifyType 验证码发送类别
 * @param {Number} n 接口类别，0=登录前，1=登录后，默认1
 * @param {Object} userinfo 用户信息
 * @param {Number} userinfo.registerType 注册类型
 * @param {String} userinfo.email
 * @param {String} userinfo.mobile
 * @param {Boolean} loading 按钮loading状态
 * @param {Boolean} showCloseBtn 是否显示右上角关闭按钮
 */
class SecVerify extends React.Component {
  constructor() {
    super();
    this.state = {
      sendVerfiCode: false,
      type: -1, // 验证方式切换,0=ga,1=email,mobile
      islogin: true, // 是否登录
      trade: {
        msg: "",
        value: ""
      },
      ga: {
        msg: "",
        value: ""
      },
      mobile: {
        msg: "",
        value: ""
      },
      email: {
        msg: "",
        value: ""
      },
      TabValue: ""
    };
    this.ga_input = React.createRef();
    this.email_input = React.createRef();
    this.mobile_input = React.createRef();
    this.trade_input = React.createRef();

    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.changeType = this.changeType.bind(this);
    this.change = this.change.bind(this);
    this.success = this.success.bind(this);
    this.preAction = this.preAction.bind(this);
    this.goback = this.goback.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.renderInitType = this.renderInitType.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.setErrorMsg = this.setErrorMsg.bind(this);
  }
  setFocus() {
    let [initType] = this.renderInitType();
    if (
      this.props.userinfo.bindTradePwd &&
      window.location.pathname.indexOf(route_map.cash) > -1
    ) {
      this["trade_input"] && this["trade_input"].focus();
    } else {
      this[initType + "_input"] && this[initType + "_input"].focus();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isopen && !this.props.isopen) {
      setTimeout(this.setFocus, 10);
    }
    return true;
  }
  setErrorMsg(name, msg) {
    let obj = this.state[name];
    obj.msg = msg;
    this.setState({
      [name]: obj
    });
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   // 未登录
  //   if (window.location.href.indexOf(route_map.login) > -1) {
  //     if (!this.props.userinfo.requestId && nextProps.userinfo.requestId) {
  //       this.setState(
  //         {
  //           type: nextProps.userinfo.bindGA ? 0 : 1,
  //           islogin: false
  //         },
  //         () => {
  //           //window.console.log(this.state);
  //         }
  //       );
  //     }
  //   } else {
  //     if (!this.props.userinfo.userId && nextProps.userinfo.userId) {
  //       // 登录后
  //       this.setState(
  //         {
  //           type: nextProps.userinfo.bindGA ? 0 : 1
  //         },
  //         () => {
  //           //window.console.log(this.state, nextProps.userinfo);
  //         }
  //       );
  //     }
  //   }
  //   return true;
  // }
  onCancel() {
    this.setState({
      trade: {
        msg: "",
        value: ""
      },
      ga: {
        msg: "",
        value: ""
      },
      mobile: {
        msg: "",
        value: ""
      },
      email: {
        msg: "",
        value: ""
      },
      sendVerfiCode: false
    });
    this.verfiCode && this.verfiCode.reset();
    this.props.onCancel && this.props.onCancel();
  }
  goback() {
    if (this.props.goback) {
      this.props.goback();
    } else {
      window.history.back();
    }
  }
  changeType(n) {
    this.setState({
      type: n
    });
  }
  change(n, e) {
    let value = e.target.value;
    value = value.replace(/\s/g, "");
    value = helper.removeEmoji(value);
    this.setState(
      {
        [n]: {
          value,
          msg: ""
        }
      },
      () => {
        // 如果不是提现页面，长度为6时，自动提交表单
        if (
          window.location.href.indexOf(route_map.cash) == -1 &&
          value.length == 6
        ) {
          this.preAction();
        }
      }
    );
  }
  sendVerfiCode(type) {
    this.setState(
      {
        sendVerfiCode: true
      },
      () => {
        let data = {};

        if (type === "email") {
          data.email = this.props.userinfo.email;
        } else {
          data.mobile = this.props.userinfo.mobile;
          data.national_code = "";
        }
        // verifyType, 短信验证码发送类别
        data.type = this.props.verifyType;
        // 未登录，二次验证发送验证码需要requestId
        if (this.props.requestId) {
          data.request_id = this.props.requestId;
        }
        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          n: this.props.n || this.props.n === 0 ? this.props.n : 1,
          errorCallback: () => {
            // 验证码错误回调
            // this.setState({
            //   sendVerfiCode: false
            // });
            this.verfiCode && this.verfiCode.reset();
          }
        });
      }
    );
  }
  preAction() {
    let v = "";
    if (
      this.props.userinfo.bindTradePwd &&
      window.location.pathname.indexOf(route_map.cash) > -1
    ) {
      v = this.state.trade.value;
      if (!v) {
        this.setState({
          trade: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "此项不能为空"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
      if (v.length < 6 || v.length > 20) {
        this.setState({
          trade: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "密码仅限6-20位字符"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
    }
    // ga
    if (this.state.type === 0) {
      v = this.state.ga.value;
      if (!v) {
        this.setState({
          ga: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "此项不能为空"
                })}
              </React.Fragment>
            )
          }
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
                  id: "验证码错误"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
    }
    if (this.state.type === 1) {
      if (!this.state.sendVerfiCode) {
        this.setState({
          [this.props.userinfo.registerType === 1 ? "email" : "mobile"]: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "请获取验证码"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
      // 手机注册，验证邮箱
      if (this.props.userinfo.registerType === 1) {
        v = this.state.email.value;
        if (!v) {
          this.setState({
            email: {
              value: v,
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "此项不能为空"
                  })}
                </React.Fragment>
              )
            }
          });
          return;
        }
        if (!/^[0-9a-zA-Z]{6,8}$/.test(v)) {
          this.setState({
            email: {
              value: v,
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "验证码错误"
                  })}
                </React.Fragment>
              )
            }
          });
          return;
        }
      }
      // 邮箱注册，验证手机
      if (this.props.userinfo.registerType === 2) {
        v = this.state.mobile.value;
        if (!v) {
          this.setState({
            mobile: {
              value: v,
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "此项不能为空"
                  })}
                </React.Fragment>
              )
            }
          });
          return;
        }
        if (!/^[0-9a-zA-Z]{6,8}$/.test(v)) {
          this.setState({
            mobile: {
              value: v,
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "验证码错误"
                  })}
                </React.Fragment>
              )
            }
          });
          return;
        }
      }
    }
    this.success();
  }
  // 确定回调
  success() {
    this.verfiCode && this.verfiCode.reset();
    const ga = this.state.ga.value;
    const email = this.state.email.value;
    const mobile = this.state.mobile.value;
    const [initType] = this.renderInitType();
    const values = { ga: ga, email: email, mobile: mobile };
    const types = { ga: 3, email: 2, mobile: 1 };
    const trade_password = this.state.trade.value;
    let verify_code = "";
    let auth_type = "";
    if (this.state.type == -1) {
      verify_code = values[initType];
      auth_type = types[initType];
    } else {
      if (this.state.type === 0) {
        verify_code = ga;
        auth_type = 3;
      } else {
        verify_code = this.props.userinfo.registerType === 1 ? email : mobile;
        auth_type = this.props.userinfo.registerType === 1 ? 2 : 1;
      }
    }

    // 重置状态
    this.setState(
      {
        //sendVerfiCode: false,
        ga: {
          msg: "",
          value: ""
        },
        mobile: {
          msg: "",
          value: ""
        },
        email: {
          msg: "",
          value: ""
        }
      },
      () => {
        this.props.callback &&
          this.props.callback({
            verify_code,
            auth_type,
            trade_password
          });
      }
    );
  }
  renderInitType() {
    // 已登录
    let bindGA = this.props.userinfo.bindGA;

    let bindEmail =
      this.props.userinfo.registerType == 1 ? this.props.userinfo.email : false;
    let bindMobile =
      this.props.userinfo.registerType == 2
        ? this.props.userinfo.mobile
        : false;

    // 未登录
    if (!this.props.userinfo.userId) {
      bindEmail = this.props.userinfo.bindEmail;
      bindMobile = this.props.userinfo.bindMobile;
    }

    let userBindType =
      this.props.userinfo.registerType == 1
        ? [bindGA, bindEmail]
        : [bindGA, bindMobile];
    let initType = "ga";
    if (userBindType[0]) {
      initType = "ga";
    } else {
      if (this.props.userinfo.registerType == 1) {
        initType = "email";
      } else {
        initType = "mobile";
      }
    }
    if (!this.state.TabValue) {
      this.setState({
        TabValue: initType
      });
    }
    return [initType, userBindType];
  }
  handleChange = (e, value) => {
    this.setState({
      TabValue: value
    });
  };
  render() {
    let [initType, userBindType] = this.renderInitType();
    const { classes } = this.props;
    // step1 引导去key
    if (!userBindType[0] && !userBindType[1] && this.props.userinfo.userId) {
      return (
        <Dialog open={true} onClose={() => {}}>
          <DialogTitle className={classes.noVerify_title}>
            {this.props.intl.formatMessage({
              id: "安全提示"
            })}
          </DialogTitle>
          <DialogContent className={classes.noVerify}>
            <p>
              {this.props.intl.formatMessage({
                id: "为了您的账户安全，请进行二次验证"
              })}
            </p>
            <div>
              <a href={route_map.user_bind + "/ga"}>
                {this.props.intl.formatMessage({
                  id: "谷歌验证"
                })}
                <i>
                  {this.props.intl.formatMessage({
                    id: "推荐"
                  })}
                </i>
              </a>
              {this.props.userinfo.registerType == 1 ? (
                <a href={route_map.user_bind + "/email"}>
                  {this.props.intl.formatMessage({
                    id: "邮箱验证"
                  })}
                </a>
              ) : (
                <a href={route_map.user_bind + "/mobile"}>
                  {this.props.intl.formatMessage({
                    id: "手机验证"
                  })}
                </a>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.goback}>
              {this.props.intl.formatMessage({
                id: "暂不需要"
              })}
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    // step2 二次验证
    const title_classname =
      userBindType[0] && userBindType[1]
        ? classes.title
        : classnames(classes.title, classes.title_one);
    return (
      <Dialog open={Boolean(this.props.isopen)} onClose={this.onCancel}>
        <DialogTitle className={classes.verify_title}>
          {userBindType[0] ? (
            <span
              onClick={this.changeType.bind(this, 0)}
              className={
                this.state.type === 0 ||
                (this.state.type === -1 && initType == "ga")
                  ? classes.choose
                  : ""
              }
            >
              {this.props.intl.formatMessage({ id: "谷歌验证" })}
            </span>
          ) : (
            ""
          )}
          {this.props.userinfo.registerType == 1 && userBindType[1] ? (
            <span
              onClick={this.changeType.bind(this, 1)}
              className={
                this.state.type === 1 ||
                (this.state.type === -1 && initType == "email")
                  ? classes.choose
                  : ""
              }
            >
              {this.props.intl.formatMessage({ id: "邮箱验证" })}
            </span>
          ) : (
            ""
          )}
          {this.props.userinfo.registerType == 2 && userBindType[1] ? (
            <span
              onClick={this.changeType.bind(this, 1)}
              className={
                this.state.type === 1 ||
                (this.state.type === -1 && initType == "mobile")
                  ? classes.choose
                  : ""
              }
            >
              {this.props.intl.formatMessage({ id: "手机验证" })}
            </span>
          ) : (
            ""
          )}
        </DialogTitle>
        <DialogContent className={classes.veriBox}>
          {/* 资金密码 */}
          {this.props.userinfo.bindTradePwd &&
          window.location.pathname.indexOf(route_map.cash) > -1 ? (
            <TextField
              type="password"
              placeholder={this.props.intl.formatMessage({
                id: "请输入资金密码"
              })}
              fullWidth
              inputRef={ref => (this.trade_input = ref)}
              value={this.state.trade.value}
              onChange={this.change.bind(this, "trade")}
              error={Boolean(this.state.trade.msg)}
              helperText={this.state.trade.msg}
              style={{ margin: "0 0 20px" }}
            />
          ) : (
            ""
          )}
          {(userBindType[0] && this.state.type === 0) ||
          (this.state.type === -1 && initType == "ga") ? (
            <TextField
              placeholder={this.props.intl.formatMessage({
                id: "请输入谷歌验证码"
              })}
              fullWidth
              error={Boolean(this.state.ga.msg)}
              inputRef={ref => (this.ga_input = ref)}
              value={this.state.ga.value}
              onChange={this.change.bind(this, "ga")}
              helperText={this.state.ga.msg}
            />
          ) : (
            ""
          )}
          {(this.props.userinfo.registerType == 1 &&
            userBindType[1] &&
            this.state.type === 1) ||
          (this.state.type === -1 && initType == "email") ? (
            <div className={classes.emailtype}>
              <TextField
                placeholder={this.props.intl.formatMessage({
                  id: "请输入验证码"
                })}
                fullWidth
                inputRef={ref => (this.email_input = ref)}
                value={this.state.email.value}
                onChange={this.change.bind(this, "email")}
                helperText={this.state.email.msg}
                error={Boolean(this.state.email.msg)}
                style={{ flex: 1 }}
                InputProps={{
                  endAdornment: (
                    <VerfiCodeRC
                      value={this.props.userinfo.mobile}
                      onClick={this.sendVerfiCode.bind(this, "email")}
                      className={classes.verfCode}
                      variant="text"
                      ref={ref => (this.verfiCode = ref)}
                    />
                  )
                }}
              />
            </div>
          ) : (
            ""
          )}
          {(this.props.userinfo.registerType == 2 &&
            userBindType[1] &&
            this.state.type === 1) ||
          (this.state.type === -1 && initType == "mobile") ? (
            <div className={classes.emailtype}>
              <TextField
                placeholder={this.props.intl.formatMessage({
                  id: "请输入验证码"
                })}
                value={this.state.mobile.value}
                onChange={this.change.bind(this, "mobile")}
                inputRef={ref => (this.mobile_input = ref)}
                helperText={this.state.mobile.msg}
                error={Boolean(this.state.mobile.msg)}
                style={{ flex: 1 }}
                InputProps={{
                  endAdornment: (
                    <VerfiCodeRC
                      value={this.props.userinfo.email}
                      onClick={this.sendVerfiCode.bind(this, "mobile")}
                      className={classes.verfCode}
                      variant="text"
                      ref={ref => (this.verfiCode = ref)}
                    />
                  )
                }}
              />
            </div>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onCancel}>
            {this.props.intl.formatMessage({
              id: "取消"
            })}
          </Button>
          {this.props.loading ? (
            <Button color="primary" disabled>
              {this.props.intl.formatMessage({
                id: "确定"
              })}
            </Button>
          ) : (
            <Button color="primary" onClick={this.preAction}>
              {this.props.intl.formatMessage({
                id: "确定"
              })}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(injectIntl(SecVerify, { withRef: true }));
