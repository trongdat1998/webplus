// 换绑email
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { TextField, Button, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import VerfiCodeRC from "../public/verificationCode_mui";
import Vali from "../../utils/validator";
import helper from "../../utils/helper";
import styles from "./usercenter_style";
import GoBackRC from "./goBack";
import CONST from "../../config/const";

class UserCenterChangeBindEmail extends React.Component {
  constructor() {
    super();
    this.state = {
      
      sendMobileVerfiCode: true, // moblie发送验证码按钮点击状态
      sendEmailVerfiCode: true, // email发送验证码按钮点击状态
      emailCode: {
        value: "",
        msg: "",
      },
      mobileCode: {
        value: "",
        msg: "",
      },
      email_order_id: "",
      mobile_order_id: "",
      newEmail: {
        value: '',
        msg:'',
      },
      newEmailCode: {
        value: "",
        msg: '',
      },
      new_email_order_id: '',
      sendNewEmailVerifyCode: true,
    };
    this.changeStatus = this.changeStatus.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.changeBindEmail = this.changeBindEmail.bind(this);
    this.mobileVerifyCodeRef = React.createRef();
    this.emailVerifyCodeRef = React.createRef();
    this.newEmailVerifyCodeRef = React.createRef();
  }
  componentDidMount() {}

  // 发送验证码
  sendVerfiCode(order_id_name) {
    let receiver_type;
    if (order_id_name === "email_order_id") {
      receiver_type = CONST.RECEIVER_TYPE.EMAIL
    } else if (order_id_name == 'mobile_order_id') {
      receiver_type = CONST.RECEIVER_TYPE.MOBILE;
    }
    let data = {
      receiver_type,
      type: CONST.CODE_TYPE.CHANGE_BIND_EMAIL,
    };
    this.props
      .dispatch({
        type: "layout/send_verify_code",
        payload: data,
        errorCallback: () => {
          this.setState({
            [order_id_name === "email_order_id" 
              ? "sendEmailVerfiCode"
              : "sendMobileVerfiCode"]: false,
          });
          if (order_id_name === "email_order_id") {
            this.emailVerifyCodeRef.current.reset();
          } else {
            this.mobileVerifyCodeRef.current.reset();
          }
        }, // 验证码错误回调
      })
      .then((ret) => {
        this.setState({
          [order_id_name === "email_order_id"
            ? "sendEmailVerfiCode"
            : "sendMobileVerfiCode"]: true,
          [order_id_name]: ret.orderId,
        });
      });
  }
  // 发送需要换绑的邮箱验证码
  sendNewVerifyCode() {
    this.props.dispatch({
      type: "layout/send_common_verify_code",
      payload: {
        receiver_type: CONST.RECEIVER_TYPE.EMAIL,
        type: CONST.CODE_TYPE.CHANGE_BIND_EMAIL,
        email: this.state.newEmail.value,
      },
      errorCallback: () => {
        this.setState({
         sendNewEmailVerifyCode: false,
        });
        this.newEmailVerifyCodeRef.current.reset();
      }, // 验证码错误回调
    }).then(ret => {
      this.setState({
        sendNewEmailVerifyCode: true,
        new_email_order_id: ret.orderId,
      })
    });
  }
  changeStatus(key, e) {
    const value = e.target.value;
    this.setState({
      [key]: {
        msg: "",
        value: helper.removeEmoji(value.replace(/\s/g, "")),
      },
    });
  }

  // 绑定
  changeBindEmail() {
    if (!this.state.sendEmailVerfiCode) {
      this.setState({
        emailCode: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请获取验证码",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      this.emailVerifyCodeRef.current.reset();
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
                id: "验证码错误",
              })}
            </React.Fragment>
          ),
          value: this.state.emailCode.value,
        },
      });
      this.emailVerifyCodeRef.current.reset();
      return;
    }
    // 请获取手机验证码
    if (!this.state.sendMobileVerfiCode) {
      this.setState({
        mobileCode: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请获取验证码",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      this.mobileVerifyCodeRef.current.reset();
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
      this.mobileVerifyCodeRef.current.reset();
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
      this.mobileVerifyCodeRef.current.reset();
      return;
    }

    if (!this.state.sendNewEmailVerifyCode) {
      this.setState({
        newEmailCode: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请获取验证码",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      this.newEmailVerifyCodeRef.current.reset();
      return;
    }
    // 邮箱验证码不正确
    if (!/^[a-z0-9A-Z]{6,8}$/.test(this.state.newEmailCode.value)) {
      this.setState({
        newEmailCode: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "验证码错误",
              })}
            </React.Fragment>
          ),
          value: this.state.newEmailCode.value,
        },
      });
      this.newEmailVerifyCodeRef.current.reset();
      return;
    }

    this.props.dispatch({
      type: "user/change_bind_email",
      payload: {
        original_email_order_id: this.state.email_order_id,
        original_email_verify_code: this.state.emailCode.value,
        mobile_order_id: this.state.mobile_order_id,
        mobile_verify_code: this.state.mobileCode.value,
        email: this.state.newEmail.value,
        alter_email_order_id: this.state.new_email_order_id,
        alter_email_verify_code: this.state.newEmailCode.value,
      },
      history: this.props.history,
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
                <FormattedMessage id="更换邮箱验证" />
              </div>
              <div className={classes.password_tip}>
                {this.props.intl.formatMessage({
                  id: "提示：更换成功后，24小时内不可提现资产",
                })}
              </div>
              <div className={classes.forget}>
                <div className={classes.g_form}>
                  <div className={classes.formItem}>
                    <div className={classes.formContent} style={{ flex: 1 }}>
                      <TextField
                        value={this.props.userinfo.email}
                        label={this.props.intl.formatMessage({ id: "邮箱" })}
                        fullWidth
                        disabled
                      />
                    </div>
                  </div>
                  <div className={classes.formItem}>
                    <div className={classes.formContent} style={{ flex: 1 }}>
                      <TextField
                        value={this.state.emailCode.value}
                        onChange={this.changeStatus.bind(this, "emailCode")}
                        placeholder={this.props.intl.formatMessage({
                          id: "请输入验证码",
                        })}
                        label={this.props.intl.formatMessage({
                          id: "邮箱验证码",
                        })}
                        error={Boolean(this.state.emailCode.msg)}
                        helperText={this.state.emailCode.msg}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <VerfiCodeRC
                              value={this.props.userinfo.email}
                              onClick={this.sendVerfiCode.bind(
                                this,
                                "email_order_id"
                              )}
                              className={classes.verfCode}
                              ref={this.emailVerifyCodeRef}
                              variant="text"
                            />
                          ),
                        }}
                      />
                    </div>
                  </div>

                  <div className={classes.formItem}>
                    <div className={classes.formContent} style={{ flex: 1 }}>
                      <TextField
                        value={this.props.userinfo.mobile}
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
                          id: "请输入验证码",
                        })}
                        fullWidth
                        label={this.props.intl.formatMessage({
                          id: "手机验证码",
                        })}
                        error={Boolean(this.state.mobileCode.msg)}
                        helperText={this.state.mobileCode.msg}
                        InputProps={{
                          endAdornment: (
                            <VerfiCodeRC
                              value={this.props.userinfo.mobile}
                              onClick={this.sendVerfiCode.bind(
                                this,
                                "mobile_order_id"
                              )}
                              className={classes.verfCode}
                              ref={this.mobileVerifyCodeRef}
                              variant="text"
                            />
                          ),
                        }}
                      />
                    </div>
                  </div>

                  <div className={classes.formItem}>
                  <div className={classes.formContent} style={{ flex: 1 }}>
                    <TextField
                      value={this.state.newEmail.value}
                      onChange={this.changeStatus.bind(this, "newEmail")}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入邮箱"
                      })}
                      label={this.props.intl.formatMessage({ id: "新邮箱" })}
                      error={Boolean(this.state.newEmail.msg)}
                      helperText={this.state.newEmail.msg}
                      fullWidth
                    />
                  </div>
                </div>

                <div className={classes.formItem}>
                  <div className={classes.formContent} style={{ flex: 1 }}>
                    <TextField
                      value={this.state.newEmailCode.value}
                      onChange={this.changeStatus.bind(this, "newEmailCode")}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入验证码"
                      })}
                      label={this.props.intl.formatMessage({
                        id: "新邮箱验证码"
                      })}
                      error={Boolean(this.state.newEmailCode.msg)}
                      helperText={this.state.newEmailCode.msg}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <VerfiCodeRC
                            onClick={this.sendNewVerifyCode.bind(
                              this,
                              "new_email_order_id"
                            )}
                            value={this.state.newEmail.value}
                            className={classes.verfCode}
                            ref={this.newEmailVerifyCodeRef}
                            variant="text"
                          />
                        )
                      }}
                    />
                  </div>
                </div>

                  <div className={classes.formItem}>
                    <div className={classes.formContent} style={{ flex: 1 }}>
                      {this.props.loading.effects["user/change_bind_email"] ? (
                        <Button
                          color="primary"
                          variant="contained"
                          disabled
                          loading
                        >
                          {this.props.intl.formatMessage({
                            id: "确定",
                          })}
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={this.changeBindEmail}
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
            </Grid>
            <Grid item xs={3} />
          </Grid>
        </div>
      );
    }
  }
}

export default withStyles(styles)(injectIntl(UserCenterChangeBindEmail));
