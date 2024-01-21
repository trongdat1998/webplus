// 绑定二次验证，email，ga，mobile
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import VerfiCodeRC from "../public/verificationCode_mui";
import Vali from "../../utils/validator";
import helper from "../../utils/helper";
import { TextField, Button, Grid } from "@material-ui/core";
import styles from "./usercenter_style";
import { withStyles } from "@material-ui/core/styles";
import GoBackRC from "./goBack";

class UserCenterBindEmail extends React.Component {
  constructor() {
    super();
    this.state = {
      sendVerfiCode: false, // moblie发送验证码按钮点击状态
      sendEmailVerfiCode: false, // email发送验证码按钮点击状态
      email: {
        value: "",
        msg: ""
      },
      emailCode: {
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
    if (order_id_name === "email_order_id") {
      if (!this.state.email.value) {
        this.setState({
          email: {
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
                  id: "无效的邮箱地址"
                })}
              </React.Fragment>
            ),
            value: this.state.email.value
          }
        });
        this.verfiCode.reset();
        return;
      }
    }
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
          n: data.email ? 0 : 1,
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
    if (n === "email") {
      this.verfiCode.reset();
      this.setState({
        sendEmailVerfiCode: false,
        emailCode: {
          value: "",
          msg: ""
        }
      });
    }
    this.setState({
      [n]: {
        msg: "",
        value: helper.removeEmoji(t.value.replace(/\s/g, ""))
      }
    });
  }

  // 绑定
  bindEmail() {
    // 请输入邮箱
    if (!this.state.email.value) {
      this.setState({
        email: {
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
      this.verfiCode.reset();
      return;
    }
    // 请输入正确的邮箱
    if (!Vali.isEmail(this.state.email.value)) {
      this.setState({
        email: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "无效的邮箱地址"
              })}
            </React.Fragment>
          ),
          value: this.state.email.value
        }
      });
      this.verfiCode.reset();
      return;
    }

    // 请获取邮箱验证码
    if (!this.state.sendEmailVerfiCode) {
      this.setState({
        emailCode: {
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
      this.verfiCode.reset();
      return;
    }
    // 邮箱验证码不正确
    if (!/^[a-z0-9A-Z]{6,8}$/.test(this.state.emailCode.value)) {
      this.setState({
        emailCode: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "验证码错误"
              })}
            </React.Fragment>
          ),
          value: this.state.emailCode.value
        }
      });
      this.verfiCode.reset();
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
      type: "user/bind_email",
      payload: {
        email: this.state.email.value,
        email_order_id: this.props.email_order_id,
        email_verify_code: this.state.emailCode.value,
        order_id: this.props.order_id,
        verify_code: this.state.mobileCode.value
      },
      history: this.props.history
    });
  }

  render() {
    const classes = this.props.classes;
    if (this.props.userinfo.email) {
      return (
        <div className={classes.center}>
          <Grid container>
            <Grid item xs={3}>
              <GoBackRC />
            </Grid>
            <Grid item xs={6}>
              <div className={classes.password_title}>
                <FormattedMessage id="邮箱已绑定" />
              </div>
              <div className={classes.formItem}>
                <div className={classes.formContent} style={{ flex: 1 }}>
                  <TextField
                    value={this.props.userinfo.email}
                    fullWidth
                    disabled
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
        </div>
      );
    }
    return (
      <div className={classes.center}>
        <Grid container>
          <Grid item xs={3}>
            <GoBackRC />
          </Grid>
          <Grid item xs={6}>
            <div className={classes.password_title}>
              <FormattedMessage id="绑定邮箱验证" />
            </div>
            <div className={classes.forget}>
              <div className={classes.g_form}>
                <div className={classes.formItem}>
                  <div className={classes.formContent} style={{ flex: 1 }}>
                    <TextField
                      value={this.state.email.value}
                      onChange={this.changeStatus.bind(this, "email")}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入邮箱"
                      })}
                      label={this.props.intl.formatMessage({ id: "邮箱" })}
                      error={Boolean(this.state.email.msg)}
                      helperText={this.state.email.msg}
                      fullWidth
                    />
                  </div>
                </div>

                <div className={classes.formItem}>
                  <div className={classes.formContent} style={{ flex: 1 }}>
                    <TextField
                      value={this.state.emailCode.value}
                      onChange={this.changeStatus.bind(this, "emailCode")}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入验证码"
                      })}
                      label={this.props.intl.formatMessage({
                        id: "邮箱验证码"
                      })}
                      error={Boolean(this.state.emailCode.msg)}
                      helperText={this.state.emailCode.msg}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <VerfiCodeRC
                            value={this.props.userinfo.mobile}
                            onClick={this.sendVerfiCode.bind(
                              this,
                              "email_order_id"
                            )}
                            className={classes.verfCode}
                            ref={ref => (this.verfiCode = ref)}
                            variant="text"
                          />
                        )
                      }}
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
                    {this.props.loading.effects["user/bind_email"] ? (
                      <Button
                        color="primary"
                        variant="contained"
                        disabled
                        loading
                      >
                        {this.props.intl.formatMessage({
                          id: "确定"
                        })}
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
