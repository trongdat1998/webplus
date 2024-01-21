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
  DialogTitle,
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
class SecVerifyLogin extends React.Component {
  constructor() {
    super();
    this.state = {
      sendVerfiCode: false,
      type: -1, // 验证方式切换,0=ga,1=email,mobile
      islogin: true, // 是否登录

      ga: {
        msg: "",
        value: "",
      },
      mobile: {
        msg: "",
        value: "",
      },
      email: {
        msg: "",
        value: "",
      },
    };
    this.ga_input = React.createRef();
    this.email_input = React.createRef();
    this.mobile_input = React.createRef();

    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.changeType = this.changeType.bind(this);
    this.change = this.change.bind(this);
    this.success = this.success.bind(this);
    this.preAction = this.preAction.bind(this);
    this.goback = this.goback.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.setFocus = this.setFocus.bind(this);
  }
  setFocus() {
    this[this.type() + "_input"] && this[this.type() + "_input"].focus();
  }
  type = () => {
    if (this.props.userinfo) {
      if (this.props.userinfo.bindGA) {
        return "ga";
      }
      if (this.props.userinfo.bindMobile) {
        return "mobile";
      }
      if (this.props.userinfo.bindEmail) {
        return "email";
      }
    }
    return "ga";
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isopen && !this.props.isopen) {
      setTimeout(this.setFocus, 10);
    }
    return true;
  }
  onCancel() {
    this.setState({
      ga: {
        msg: "",
        value: "",
      },
      mobile: {
        msg: "",
        value: "",
      },
      email: {
        msg: "",
        value: "",
      },
      sendVerfiCode: false,
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
      type: n,
    });
  }
  change(n, e) {
    let value = e.target.value;
    value = value.replace(/\s/g, "");
    this.setState(
      {
        [n]: {
          value,
          msg: "",
        },
      },
      () => {
        if (value.length == 6) {
          this.preAction();
        }
      }
    );
  }
  sendVerfiCode(type) {
    this.setState(
      {
        sendVerfiCode: true,
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
          },
        });
      }
    );
  }
  preAction() {
    let v = "";
    // ga
    if (this.type() === "ga") {
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
    // email
    if (this.type() === "email") {
      if (!this.state.sendVerfiCode) {
        this.setState({
          ["email"]: {
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
        return;
      }
      v = this.state.email.value;
      if (!v) {
        this.setState({
          email: {
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
      if (!/^[0-9a-zA-Z]{6,8}$/.test(v)) {
        this.setState({
          email: {
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
    // mobile
    if (this.type() == "mobile") {
      if (!this.state.sendVerfiCode) {
        this.setState({
          ["mobile"]: {
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
        return;
      }
      v = this.state.mobile.value;
      if (!v) {
        this.setState({
          mobile: {
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
      if (!/^[0-9a-zA-Z]{6,8}$/.test(v)) {
        this.setState({
          mobile: {
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
    this.success();
  }
  // 确定回调
  async success() {
    this.verfiCode && this.verfiCode.reset();
    const ga = this.state.ga.value;
    const email = this.state.email.value;
    const mobile = this.state.mobile.value;
    const values = { ga: ga, email: email, mobile: mobile };
    const types = { ga: 3, email: 2, mobile: 1 };
    let verify_code = "";
    let auth_type = "";

    verify_code = values[this.type()];
    auth_type = types[this.type()];

    const that = this;
    // 重置状态
    this.props.callback &&
      this.props.callback(
        {
          verify_code,
          auth_type,
        },
        function () {
          that.setState({
            sendVerfiCode: false,
            ga: {
              msg: "",
              value: "",
            },
            mobile: {
              msg: "",
              value: "",
            },
            email: {
              msg: "",
              value: "",
            },
          });
        }
      );
  }

  render() {
    const { classes } = this.props;
    // step2 二次验证
    return (
      <Dialog open={Boolean(this.props.isopen)} onClose={this.onCancel}>
        <DialogTitle className={classes.verify_title}>
          {this.type() == "ga" ? (
            <span
              onClick={this.changeType.bind(this, 0)}
              className={this.state.type === 0 ? classes.choose : ""}
            >
              {this.props.intl.formatMessage({ id: "谷歌验证" })}
            </span>
          ) : (
            ""
          )}
          {this.type() == "email" ? (
            <span
              onClick={this.changeType.bind(this, 1)}
              className={this.state.type === 1 ? classes.choose : ""}
            >
              {this.props.intl.formatMessage({ id: "邮箱验证" })}
            </span>
          ) : (
            ""
          )}
          {this.type() == "mobile" ? (
            <span
              onClick={this.changeType.bind(this, 1)}
              className={this.state.type === 1 ? classes.choose : ""}
            >
              {this.props.intl.formatMessage({ id: "手机验证" })}
            </span>
          ) : (
            ""
          )}
        </DialogTitle>
        <DialogContent className={classes.veriBox}>
          {/* ga */}
          {this.type() == "ga" ? (
            <TextField
              placeholder={this.props.intl.formatMessage({
                id: "请输入谷歌验证码",
              })}
              fullWidth
              error={Boolean(this.state.ga.msg)}
              inputRef={(ref) => (this.ga_input = ref)}
              value={this.state.ga.value}
              onChange={this.change.bind(this, "ga")}
              helperText={this.state.ga.msg}
            />
          ) : (
            ""
          )}
          {this.type() == "email" ? (
            // 验证 email
            <div className={classes.emailtype}>
              <TextField
                placeholder={this.props.intl.formatMessage({
                  id: "请输入验证码",
                })}
                fullWidth
                inputRef={(ref) => (this.email_input = ref)}
                value={this.state.email.value}
                onChange={this.change.bind(this, "email")}
                helperText={this.state.email.msg}
                error={Boolean(this.state.email.msg)}
                style={{ flex: 1 }}
                InputProps={{
                  endAdornment: (
                    <VerfiCodeRC
                      value={this.props.userinfo.email}
                      onClick={this.sendVerfiCode.bind(this, "email")}
                      className={classes.verfCode}
                      variant="text"
                      ref={(ref) => (this.verfiCode = ref)}
                    />
                  ),
                }}
              />
            </div>
          ) : (
            ""
          )}
          {this.type() == "mobile" ? (
            // 验证mobile
            <div className={classes.emailtype}>
              <TextField
                placeholder={this.props.intl.formatMessage({
                  id: "请输入验证码",
                })}
                value={this.state.mobile.value}
                onChange={this.change.bind(this, "mobile")}
                inputRef={(ref) => (this.mobile_input = ref)}
                helperText={this.state.mobile.msg}
                error={Boolean(this.state.mobile.msg)}
                style={{ flex: 1 }}
                InputProps={{
                  endAdornment: (
                    <VerfiCodeRC
                      value={this.props.userinfo.mobile}
                      onClick={this.sendVerfiCode.bind(this, "mobile")}
                      className={classes.verfCode}
                      variant="text"
                      ref={(ref) => (this.verfiCode = ref)}
                    />
                  ),
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
              id: "取消",
            })}
          </Button>
          {this.props.loading ? (
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
}

export default withStyles(styles)(
  injectIntl(SecVerifyLogin, { withRef: true })
);
