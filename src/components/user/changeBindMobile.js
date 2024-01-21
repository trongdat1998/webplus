// 更换手机
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import classnames from "classnames";
import { TextField, Button, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import VerfiCodeRC from "../public/verificationCode_mui";
import helper from "../../utils/helper";
import styles from "./usercenter_style";
import GoBackRC from "./goBack";
import SelectRC from "../public/select";
import CONST from "../../config/const";

class UserCenterChangeBindMobile extends React.Component {
  constructor() {
    super();
    this.state = {
      sendEmailVerifyCode: false, // email发送验证码按钮点击状态
      sendMobileVerifyCode: false, // mobile发送验证码按钮点击状态
      sendNewMobileVerifyCode: false,
      mobileCode: {
        value: "",
        msg: "",
      },
      emailCode: {
        value: "",
        msg: "",
      },
      newMobile: {
        value: "",
        msg: "",
      },
      national_code: CONST.DEFAULT_NATIONAL_CODE,
      newMobileCode: {
        value: "",
        msg: "",
      },
      email_order_id: "",
      mobile_order_id: "",
      new_mobile_order_id: "",
    };
    this.changeStatus = this.changeStatus.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.changeBindMobile = this.changeBindMobile.bind(this);

    this.mobileVerifyCodeRef = React.createRef();
    this.emailVerifyCodeRef = React.createRef();
    this.newMobileVerifyCodeRef = React.createRef();
  }
  componentDidMount() {}

  // 发送验证码
  sendVerfiCode(order_id_name) {
    let data = {
      type: CONST.CODE_TYPE.CHANGE_BIND_MOBILE,
      receiver_type:
        order_id_name == "mobile_order_id"
          ? CONST.RECEIVER_TYPE.MOBILE
          : CONST.RECEIVER_TYPE.EMAIL,
    };
    this.props
      .dispatch({
        type: "layout/send_verify_code",
        payload: data,
        errorCallback: () => {
          this.setState({
            [order_id_name == "mobile_order_id"
              ? "sendMobileVerfiCode"
              : "sendEmailVerfiCode"]: false,
          });
          if (order_id_name == "mobile_order_id") {
            this.mobileVerifyCodeRef.current.reset();
          } else {
            this.emailVerifyCodeRef.current.reset();
          }
        }, // 验证码错误回调
      })
      .then((ret) => {
        this.setState({
          [order_id_name === "mobile_order_id"
            ? "sendMobileVerifyCode"
            : "sendEmailVerifyCode"]: true,
          [order_id_name]: ret.orderId,
        });
      });
  }

  // 发送需要换绑的手机验证码
  sendNewVerifyCode() {
    this.props
      .dispatch({
        type: "layout/send_common_verify_code",
        payload: {
          receiver_type: CONST.RECEIVER_TYPE.MOBILE,
          type: CONST.CODE_TYPE.CHANGE_BIND_MOBILE,
          national_code: this.state.national_code,
          mobile: this.state.newMobile.value,
        },
        errorCallback: () => {
          this.setState({
            sendNewMobileVerifyCode: false,
          });
          this.newMobileVerifyCodeRef.current.reset();
        }, // 验证码错误回调
      })
      .then((ret) => {
        this.setState({
          sendNewMobileVerifyCode: true,
          new_mobile_order_id: ret.orderId,
        });
      });
  }
  changeStatus(n, e) {
    const t = e.target;
    if (n === "newMobile") {
      this.newMobileVerifyCodeRef.current.reset();
      this.setState({
        sendNewMobileVerifyCode: false,
        newMobileCode: {
          value: "",
          msg: "",
        },
      });
    }
    this.setState({
      [n]: {
        msg: "",
        value: helper.removeEmoji(t.value.replace(/\s/g, "")),
      },
    });
  }

  // 绑定
  changeBindMobile() {
    // 请获取手机验证码
    if (!this.state.sendMobileVerifyCode) {
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
    // 请获取邮箱验证码
    if (!this.state.sendEmailVerifyCode) {
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
      this.mobileVerifyCodeRef.current.reset();
      return;
    }
    // 请输入手机验证码
    if (!this.state.mobileCode.value) {
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
          value: "",
        },
      });
      this.mobileVerifyCodeRef.current.reset();
      return;
    }

    // 请输入邮箱验证码
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
          value: "",
        },
      });
      this.emailVerifyCodeRef.current.reset();
      return;
    }

    this.props.dispatch({
      type: "user/change_bind_mobile",
      payload: {
        original_mobile_order_id: this.state.mobile_order_id,
        original_mobile_verify_code: this.state.mobileCode.value,
        email_order_id: this.state.email_order_id,
        email_verify_code: this.state.emailCode.value,
        national_code: this.state.national_code,
        mobile: this.state.newMobile.value,
        alter_mobile_order_id: this.state.new_mobile_order_id,
        alter_mobile_verify_code: this.state.newMobileCode.value,
      },
      history: this.props.history,
    });
  }

  render() {
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
    if (this.props.userinfo.mobile) {
      return (
        <div className={classes.center}>
          <Grid container>
            <Grid item xs={3}>
              <GoBackRC />
            </Grid>
            <Grid item xs={6}>
              <div className={classes.password_title}>
                <FormattedMessage id="更换手机验证" />
              </div>
              <div className={classes.password_tip}>
                {this.props.intl.formatMessage({
                  id: "提示：更换成功后，24小时内不可提现资产",
                })}
              </div>
              <div className={classes.g_form}>
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
                      label={this.props.intl.formatMessage({
                        id: "手机验证码",
                      })}
                      fullWidth
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入验证码",
                      })}
                      error={Boolean(this.state.mobileCode.msg)}
                      helperText={this.state.mobileCode.msg}
                      InputProps={{
                        endAdornment: (
                          <VerfiCodeRC
                            value={this.props.userinfo.email}
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
                      value={this.props.userinfo.email}
                      label={this.props.intl.formatMessage({ id: "邮箱" })}
                      fullWidth
                      disabled
                    />
                  </div>
                </div>

                <div className={classes.formItem}>
                  <div className={classes.g_formContent} style={{ flex: 1 }}>
                    <TextField
                      value={this.state.emailCode.value}
                      onChange={this.changeStatus.bind(this, "emailCode")}
                      label={this.props.intl.formatMessage({
                        id: "邮箱验证码",
                      })}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入验证码",
                      })}
                      fullWidth
                      error={Boolean(this.state.emailCode.msg)}
                      helperText={this.state.emailCode.msg}
                      InputProps={{
                        endAdornment: (
                          <VerfiCodeRC
                            value={this.props.userinfo.email}
                            onClick={this.sendVerfiCode.bind(
                              this,
                              "email_order_id"
                            )}
                            className={classes.verfCode}
                            ref={(ref) => (this.emailVerifyCodeRef = ref)}
                            variant="text"
                          />
                        ),
                      }}
                    />
                  </div>
                </div>

                <div className={classes.formItem}>
                  <div className={classes.formContent} style={{ width: 80 }}>
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
                      value={this.state.newMobile.value}
                      onChange={this.changeStatus.bind(this, "newMobile")}
                      label={this.props.intl.formatMessage({ id: "手机号" })}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入手机号",
                      })}
                      error={Boolean(this.state.newMobile.msg)}
                      helperText={this.state.newMobile.msg}
                      fullWidth
                    />
                  </div>
                </div>

                <div className={classes.formItem}>
                  <div className={classes.formContent} style={{ flex: 1 }}>
                    <TextField
                      value={this.state.newMobileCode.value}
                      onChange={this.changeStatus.bind(this, "newMobileCode")}
                      label={this.props.intl.formatMessage({
                        id: "手机验证码",
                      })}
                      fullWidth
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入验证码",
                      })}
                      error={Boolean(this.state.newMobileCode.msg)}
                      helperText={this.state.newMobileCode.msg}
                      InputProps={{
                        endAdornment: (
                          <VerfiCodeRC
                            value={this.props.userinfo.email}
                            onClick={this.sendNewVerifyCode.bind(
                              this,
                              "new_mobile_order_id"
                            )}
                            className={classes.verfCode}
                            ref={this.newMobileVerifyCodeRef}
                            variant="text"
                          />
                        ),
                      }}
                    />
                  </div>
                </div>

                <div className={classes.formItem}>
                  <div className={classes.g_formContent} style={{ flex: 1 }}>
                    {this.props.loading.effects["user/change_bind_mobile"] ? (
                      <Button
                        color="primary"
                        variant="contained"
                        className={classes.btn}
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
                        className={classes.btn}
                        onClick={this.changeBindMobile}
                      >
                        {this.props.intl.formatMessage({
                          id: "确定",
                        })}
                      </Button>
                    )}
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

export default withStyles(styles)(injectIntl(UserCenterChangeBindMobile));
