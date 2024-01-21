// 绑定二次验证，email，ga，mobile
import React from "react";
import classnames from "classnames";
import { FormattedMessage, injectIntl } from "react-intl";
import { TextField, Button, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import VerfiCodeRC from "../public/verificationCode_mui";
import styles from "./usercenter_style";
import helper from "../../utils/helper";
import CONST from "../../config/const";
import GoBackRC from "./goBack";
import SelectRC from "../public/select";

class UserCenterBindMobile extends React.Component {
  constructor() {
    super();
    this.state = {
      national_code: CONST.DEFAULT_NATIONAL_CODE,
      sendVerfiCode: false, // email发送验证码按钮点击状态
      sendMobileVerfiCode: false, // mobile发送验证码按钮点击状态
      mobile: {
        value: "",
        msg: "",
      },
      mobileCode: {
        value: "",
        msg: "",
      },
      emailCode: {
        value: "",
        msg: "",
      },
    };
    this.changeStatus = this.changeStatus.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.bindMobile = this.bindMobile.bind(this);
    this.dropchange = this.dropchange.bind(this);
  }
  componentDidMount() {
    this.setState({
      national_code:
        this.props.areacode[window.localStorage.lang] ||
        this.props.areacode["zh-cn"],
    });
  }
  dropchange(n, v) {
    const d = v.value.split("-");
    this.setState({
      national_code: d[0],
      country_name: d[1],
    });
  }
  SelectChange = (v) => {
    this.setState({
      national_code: v,
    });
  };
  // 发送验证码
  sendVerfiCode(order_id_name) {
    if (order_id_name === "mobile_order_id") {
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
    this.setState(
      {
        [order_id_name ? "sendMobileVerfiCode" : "sendVerfiCode"]: true,
      },
      () => {
        let data = {};

        if (order_id_name) {
          data.mobile = this.state.mobile.value;
          data.national_code = this.state.national_code;
        } else {
          data.email = this.props.userinfo.email;
        }
        data.type = 5;

        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          n: data.mobile ? 0 : 1,
          order_id_name: order_id_name || "order_id",
          errorCallback: () => {
            this.setState({
              [order_id_name ? "sendMobileVerfiCode" : "sendVerfiCode"]: false,
            });
            if (order_id_name) {
              this.verfiCode.reset();
            } else {
              this.verfiCode2.reset();
            }
          }, // 验证码错误回调
        });
      }
    );
  }
  changeStatus(n, e) {
    const t = e.target;
    if (n === "mobile") {
      this.verfiCode.reset();
      this.setState({
        sendMobileVerfiCode: false,
        mobileCode: {
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
  bindMobile() {
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
      this.verfiCode.reset();
      return;
    }
    // 请获取邮箱验证码
    if (!this.state.sendVerfiCode) {
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
      this.verfiCode.reset();
      return;
    }
    // 请输入手机号
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
    // 请输入正确的手机号
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
      this.verfiCode.reset();
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
      this.verfiCode2.reset();
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
      this.verfiCode2.reset();
      return;
    }

    this.props.dispatch({
      type: "user/bind_mobile",
      payload: {
        national_code: this.state.national_code,
        mobile: this.state.mobile.value,
        mobile_order_id: this.props.mobile_order_id,
        mobile_verify_code: this.state.mobileCode.value,
        order_id: this.props.order_id,
        verify_code: this.state.emailCode.value,
      },
      history: this.props.history,
    });
  }

  render() {
    const { classes } = this.props;
    if (this.props.userinfo.mobile) {
      return (
        <div className={classes.center}>
          <Grid container>
            <Grid item xs={3}>
              <GoBackRC />
            </Grid>
            <Grid item xs={6}>
              <div className={classes.password_title}>
                <FormattedMessage id="手机已绑定" />
              </div>
              <div className={classes.formItem}>
                <div className={classes.formContent} style={{ flex: 1 }}>
                  <TextField
                    value={this.props.userinfo.mobile}
                    fullWidth
                    disabled
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      );
    }
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
      <div className={classes.center}>
        <Grid container>
          <Grid item xs={3}>
            <GoBackRC />
          </Grid>
          <Grid item xs={6}>
            <div className={classes.password_title}>
              <FormattedMessage id="绑定手机验证" />
            </div>

            <div className={classes.g_form}>
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
                    value={this.state.mobile.value}
                    onChange={this.changeStatus.bind(this, "mobile")}
                    label={this.props.intl.formatMessage({ id: "手机号" })}
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入手机号",
                    })}
                    error={Boolean(this.state.mobile.msg)}
                    helperText={this.state.mobile.msg}
                    fullWidth
                  />
                </div>
              </div>

              <div className={classes.formItem}>
                <div className={classes.formContent} style={{ flex: 1 }}>
                  <TextField
                    value={this.state.mobileCode.value}
                    onChange={this.changeStatus.bind(this, "mobileCode")}
                    label={this.props.intl.formatMessage({ id: "手机验证码" })}
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
                          ref={(ref) => (this.verfiCode = ref)}
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
                          value={this.props.userinfo.email}
                          onClick={this.sendVerfiCode.bind(this, "")}
                          className={classes.verfCode}
                          ref={(ref) => (this.verfiCode2 = ref)}
                          variant="text"
                        />
                      ),
                    }}
                  />
                </div>
              </div>

              <div className={classes.formItem}>
                <div className={classes.g_formContent} style={{ flex: 1 }}>
                  {this.props.loading.effects["user/bind_mobile"] ? (
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
                      onClick={this.bindMobile}
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

export default withStyles(styles)(injectIntl(UserCenterBindMobile));
