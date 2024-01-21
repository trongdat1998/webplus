// 绑定二次验证，email，ga，mobile
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import VerfiCodeRC from "../public/verificationCode_mui";
import helper from "../../utils/helper";
import { TextField, Button, Grid } from "@material-ui/core";
import styles from "./usercenter_style";
import { withStyles } from "@material-ui/core/styles";
import GoBackRC from "./goBack";

class UserCenterBindGA extends React.Component {
  constructor() {
    super();
    this.state = {
      sendVerfiCode: false, // ga发送验证码按钮点击状态， email发送验证码按钮点击状态
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
      gaCode: {
        value: "",
        msg: "",
      },
    };
    this.changeStatus = this.changeStatus.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.bindGA_step1 = this.bindGA_step1.bind(this);
    this.bindGA_step2 = this.bindGA_step2.bind(this);
  }
  componentDidMount() {
    const type = this.props.match.params.type.toLowerCase();
    if (type == "ga" && !this.props.userinfo.bindGA) {
      this.bindGA_step1();
    }
  }
  // 发送验证码
  sendVerfiCode(order_id_name) {
    const type = this.props.match.params.type.toLowerCase();
    this.setState(
      {
        sendVerfiCode: true,
      },
      () => {
        let data = {};
        if (this.props.userinfo.registerType == 1) {
          data.mobile = this.props.userinfo.mobile;
        }
        if (this.props.userinfo.registerType == 2) {
          data.email = this.props.userinfo.email;
        }
        if (type === "ga") {
          data.type = 7;
        }
        if (type === "email") {
          data.type = 5;
        }
        if (type === "mobile") {
          data.type = 6;
        }
        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          n: 1,
          errorCallback: () => {
            this.setState({
              sendVerfiCode: false,
            });
            this.verfiCode.reset();
          }, // 验证码错误回调
        });
      }
    );
  }
  changeStatus(n, e) {
    const t = e.target;
    this.setState({
      [n]: {
        msg: "",
        value: helper.removeEmoji(t.value.replace(/\s/g, "")),
      },
    });
  }
  // 绑定GA step1
  bindGA_step1() {
    this.props.dispatch({
      type: "user/ga_info",
      payload: {},
    });
  }
  // 绑定ga step2
  bindGA_step2() {
    //验证数据
    const name =
      this.props.userinfo.registerType == 1 ? "mobileCode" : "emailCode";

    // 未获取验证码
    if (!this.state.sendVerfiCode) {
      this.setState({
        [name]: {
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
      return;
    }
    // 验证码 不能为空
    if (!this.state[name]["value"]) {
      this.setState({
        [name]: {
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
    // 验证码 格式不正确
    if (!/[a-z0-9A-Z]{6,8}/.test(this.state[name]["value"])) {
      this.setState({
        [name]: {
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "验证码错误",
              })}
            </React.Fragment>
          ),
          value: this.state[name]["value"],
        },
      });
      return;
    }
    // gaCode 不能为空
    if (!this.state.gaCode.value) {
      this.setState({
        gaCode: {
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

    this.props.dispatch({
      type: "user/bind_ga",
      payload: {
        ga_code: this.state.gaCode.value,
        order_id: this.props.order_id,
        verify_code: this.state[name]["value"],
      },
      history: this.props.history,
      errorCallback: () => {
        // 绑定失败，重新获取谷歌key及二维码
        //this.bindGA_step1();
      },
    });
  }

  render() {
    const { classes } = this.props;
    if (this.props.userinfo.bindGA) {
      // return (
      //   <div className={classes.center}>
      //     <Grid container>
      //       <Grid item xs={3}>
      //         <GoBackRC />
      //       </Grid>
      //       <Grid item xs={6}>
      //         <div className={classes.password_title}>
      //           <FormattedMessage id="谷歌已绑定" />
      //         </div>
      //         <div className={classes.password_tip}>
      //           {this.props.intl.formatMessage({
      //             id: "用于登录、提现及安全设置验证"
      //           })}
      //         </div>
      //       </Grid>
      //       <Grid item xs={3}></Grid>
      //     </Grid>
      //   </div>
      // );
    }
    const lang = window.localStorage.lang;
    return (
      <div className={classes.center}>
        <Grid container>
          <Grid item xs={3}>
            <GoBackRC />
          </Grid>
          <Grid item xs={6}>
            <div className={classes.password_title}>
              <FormattedMessage id="绑定谷歌验证" />
            </div>
            <div className={classes.password_tip}>
              {this.props.intl.formatMessage({
                id: "用于登录、提现及安全设置验证",
              })}
            </div>

            <div className={classes.ga_item}>
              <dl>
                <dt>
                  <i>01</i>
                </dt>
                <dd>
                  <p>
                    {this.props.intl.formatMessage({
                      id:
                        "在手机上下载并安装“Google Authenticator(身份验证器)”",
                    })}
                  </p>
                </dd>
              </dl>
              <div className={classes.ga_link}>
                <a
                  href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lang === "zh-cn" ? (
                    <img alt="" src={require("../../assets/google.png")} />
                  ) : (
                    <img alt="" src={require("../../assets/google_en.png")} />
                  )}
                </a>
                <a
                  href="https://itunes.apple.com/us/app/google-authenticator/id388497605"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lang === "zh-cn" ? (
                    <img alt="" src={require("../../assets/apple.png")} />
                  ) : (
                    <img alt="" src={require("../../assets/apple_en.png")} />
                  )}
                </a>
              </div>
            </div>
            <div className={classes.ga_item}>
              <dl>
                <dt>
                  <i>02</i>
                </dt>
                <dd>
                  <p>
                    {this.props.intl.formatMessage({
                      id:
                        "使用“Google Authenticator(身份验证器)”扫描下方二维码",
                    })}
                  </p>
                </dd>
              </dl>
              <div className={classes.qrcode}>
                {this.props.ga_info.qrcode ? (
                  <img
                    alt=""
                    src={"data:image/png;base64," + this.props.ga_info.qrcode}
                    style={{ maxWidth: 150, margin: "0 0 15px" }}
                  />
                ) : (
                  ""
                )}
                <br />
                <strong>{this.props.ga_info.secretKey}</strong>
              </div>
            </div>
            <div className={classes.ga_item}>
              <dl>
                <dt>
                  <i>03</i>
                </dt>
                <dd>
                  <p>
                    {this.props.intl.formatMessage({
                      id:
                        "请将16位密钥记录在纸上，并保存在安全的地方。如遇手机丢失，你可以通过该密钥恢复你的谷歌验证",
                    })}
                  </p>
                </dd>
              </dl>
            </div>
            <div className={classes.ga_item}>
              <dl>
                <dt>
                  <i>04</i>
                </dt>
                <dd>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "下方输入Google验证码，完成认证",
                    })}
                  </p>
                </dd>
              </dl>
            </div>

            <div className={classes.g_form}>
              {this.props.userinfo.registerType == 1 ? (
                <React.Fragment>
                  <div className={classes.formItem}>
                    <div className={classes.formContent} style={{ flex: 1 }}>
                      <TextField
                        value={this.props.userinfo.mobile}
                        disabled
                        label={this.props.intl.formatMessage({ id: "手机" })}
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className={classes.formItem}>
                    <div className={classes.g_formContent} style={{ flex: 1 }}>
                      <TextField
                        value={this.state.mobileCode.value}
                        label={this.props.intl.formatMessage({
                          id: "手机验证码",
                        })}
                        onChange={this.changeStatus.bind(this, "mobileCode")}
                        placeholder={this.props.intl.formatMessage({
                          id: "请输入验证码",
                        })}
                        error={Boolean(this.state.mobileCode.msg)}
                        helperText={this.state.mobileCode.msg}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <VerfiCodeRC
                              value={this.props.userinfo.mobile}
                              onClick={this.sendVerfiCode}
                              className={classes.verfCode}
                              ref={(ref) => (this.verfiCode = ref)}
                              variant="text"
                            />
                          ),
                        }}
                      />
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className={classes.formItem}>
                    <div className={classes.formContent} style={{ flex: 1 }}>
                      <TextField
                        value={this.props.userinfo.email}
                        disabled
                        label={this.props.intl.formatMessage({ id: "邮箱" })}
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className={classes.formItem}>
                    <div className={classes.formContent} style={{ flex: 1 }}>
                      <TextField
                        value={this.state.emailCode.value}
                        label={this.props.intl.formatMessage({
                          id: "邮箱验证码",
                        })}
                        onChange={this.changeStatus.bind(this, "emailCode")}
                        placeholder={this.props.intl.formatMessage({
                          id: "请输入验证码",
                        })}
                        error={Boolean(this.state.emailCode.msg)}
                        helperText={this.state.emailCode.msg}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <VerfiCodeRC
                              value={this.props.userinfo.email}
                              onClick={this.sendVerfiCode}
                              className={classes.verfCode}
                              ref={(ref) => (this.verfiCode = ref)}
                              variant="text"
                            />
                          ),
                        }}
                      />
                    </div>
                  </div>
                </React.Fragment>
              )}

              <div className={classes.formItem}>
                <div className={classes.formContent} style={{ flex: 1 }}>
                  <TextField
                    value={this.state.gaCode.value}
                    onChange={this.changeStatus.bind(this, "gaCode")}
                    label={this.props.intl.formatMessage({ id: "谷歌验证码" })}
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入验证码",
                    })}
                    error={Boolean(this.state.gaCode.msg)}
                    helperText={this.state.gaCode.msg}
                    fullWidth
                  />
                </div>
              </div>

              <div className={classes.formItem}>
                <div className={classes.formContent} style={{ flex: 1 }}>
                  {this.props.loading.effects["user/bind_ga"] ? (
                    <Button
                      color="primary"
                      variant="contained"
                      className={classes.btn}
                      disabled="disabled"
                      loading
                    >
                      {this.props.intl.formatMessage({
                        id: "完成",
                      })}
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      variant="contained"
                      className={classes.btn}
                      onClick={this.bindGA_step2}
                    >
                      {this.props.intl.formatMessage({
                        id: "完成",
                      })}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className={classes.password_tip}>
              <p>
                <FormattedMessage id="温馨提示" />
              </p>
              <ul>
                <li>
                  <FormattedMessage id="如果您无法扫描成功二维码，您还可以手动添加账户，并输入如下密匙:" />
                  <i>{this.props.ga_info.secretKey}</i>
                </li>
                <li>
                  <FormattedMessage id="请勿删除此双重验证密码账户，否则会导致您无法进行账户操作；" />
                </li>
              </ul>
            </div>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(UserCenterBindGA));
