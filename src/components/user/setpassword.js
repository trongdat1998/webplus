// 设置密码
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import VerfiCodeRC from "../public/verificationCode_mui";
import Vali from "../../utils/validator";
import helper from "../../utils/helper";
import { TextField, Button, Grid, CircularProgress } from "@material-ui/core";
import styles from "./usercenter_style";
import { withStyles } from "@material-ui/core/styles";
import GoBackRC from "./goBack";

class UserCenterBindEmail extends React.Component {
  constructor() {
    super();
    this.state = {
      sendVerfiCode: false, // moblie发送验证码按钮点击状态
      sendEmailVerfiCode: false, // email发送验证码按钮点击状态
      password1: {
        value: "",
        msg: ""
      },
      password2: {
        value: "",
        msg: ""
      },
      mobileCode: {
        value: "",
        msg: ""
      }
    };
    this.changeStatus = this.changeStatus.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.bindEmail = this.bindEmail.bind(this);
  }
  componentDidMount() {}
  // 发送验证码
  sendVerfiCode(order_id_name) {
    this.setState(
      {
        [order_id_name ? "sendEmailVerfiCode" : "sendVerfiCode"]: true
      },
      () => {
        let data = {};

        if (order_id_name) {
          data.email = this.state.email.value;
        } else {
          data.mobile = this.props.userinfo.mobile;
        }
        // type=6 绑定邮箱
        data.type = 6;

        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          n: 3,
          order_id_name: order_id_name || "order_id",
          errorCallback: () => {
            this.setState({
              [order_id_name ? "sendEmailVerfiCode" : "sendVerfiCode"]: false
            });
            if (order_id_name) {
              this.verfiCode.reset();
            } else {
              this.verfiCode2.reset();
            }
          } // 验证码错误回调
        });
      }
    );
  }
  changeStatus(n, e) {
    const t = e.target;
    this.setState({
      [n]: {
        msg: "",
        value: helper.removeEmoji(t.value.replace(/\s/g, ""))
      }
    });
  }

  // 绑定
  bindEmail() {
    const password1 = this.state.password1.value;
    const password2 = this.state.password2.value;

    if (!password1) {
      this.setState({
        password1: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请输入密码"
              })}
            </React.Fragment>
          ),
          value: password1
        }
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
                id: "密码8-20位字符，必须包含大小写字母和数字"
              })}
            </React.Fragment>
          ),
          value: password1
        }
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
                id: "两次密码输入不一致"
              })}
            </React.Fragment>
          ),
          value: password2
        }
      });
      return;
    }
    // 请获取手机验证码
    if (!this.state.sendVerfiCode) {
      this.setState({
        mobileCode: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请获取验证码"
              })}
            </React.Fragment>
          ),
          value: ""
        }
      });
      this.verfiCode2.reset();
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
                id: "此项不能为空"
              })}
            </React.Fragment>
          ),
          value: ""
        }
      });
      this.verfiCode2.reset();
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
                id: "验证码错误"
              })}
            </React.Fragment>
          ),
          value: this.state.mobileCode.value
        }
      });
      this.verfiCode2.reset();
      return;
    }

    this.props.dispatch({
      type: "user/set_pwd",
      payload: {
        password1: this.state.password1.value,
        password2: this.state.password2.value,
        order_id: this.props.order_id,
        verify_code: this.state.mobileCode.value
      }
    });
  }

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.center}>
        <Grid container>
          <Grid item xs={3}>
            <GoBackRC />
          </Grid>
          <Grid item xs={6}>
            <div className={classes.password_title}>
              <FormattedMessage id="设置密码" />
            </div>
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
                      onChange={this.changeStatus.bind(this, "password2")}
                      label={this.props.intl.formatMessage({ id: "确认密码" })}
                      error={Boolean(this.state.password2.msg)}
                      helperText={this.state.password2.msg}
                      fullWidth
                    />
                  </div>
                </div>

                <div className={classes.formItem}>
                  <div className={classes.formContent} style={{ flex: 1 }}>
                    <TextField
                      value={this.props.userinfo.mobile}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入验证码"
                      })}
                      label={this.props.intl.formatMessage({ id: "手机" })}
                      fullWidth
                      disabled
                    />
                  </div>
                </div>

                <div className={classes.formItem}>
                  <div className={classes.formContent} style={{ flex: 1 }}>
                    <TextField
                      value={this.state.mobileCode.value}
                      onChange={this.changeStatus.bind(this, "mobileCode")}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入验证码"
                      })}
                      fullWidth
                      label={this.props.intl.formatMessage({
                        id: "手机验证码"
                      })}
                      error={Boolean(this.state.mobileCode.msg)}
                      helperText={this.state.mobileCode.msg}
                      InputProps={{
                        endAdornment: (
                          <VerfiCodeRC
                            value={this.props.userinfo.mobile}
                            onClick={this.sendVerfiCode.bind(this, "")}
                            className={classes.verfCode}
                            ref={ref => (this.verfiCode2 = ref)}
                            variant="text"
                          />
                        )
                      }}
                    />
                  </div>
                </div>

                <div className={classes.formItem}>
                  <div className={classes.formContent} style={{ flex: 1 }}>
                    {this.props.loading.effects["user/set_pwd"] ? (
                      <Button color="primary" variant="contained" disabled>
                        <CircularProgress size={20} />
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={this.bindEmail}
                      >
                        {this.props.intl.formatMessage({
                          id: "确定"
                        })}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(UserCenterBindEmail));
