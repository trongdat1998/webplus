// 解绑ga
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import { TextField, Button, Grid } from "@material-ui/core";
import VerfiCodeRC from "../public/verificationCode_mui";

import helper from "../../utils/helper";
import styles from "./usercenter_style";
import GoBackRC from "./goBack";
import CONST from "../../config/const";

class UserCenterchangeBindGA extends React.Component {
  constructor() {
    super();
    this.state = {
      sendVerfiCode: true,
      order_id: "",
      mobileCode: {
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
      newGACode: {
        value: "",
        msg: "",
      },
    };
    this.changeStatus = this.changeStatus.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.changeBindGA = this.changeBindGA.bind(this);
  }

  componentDidMount() {
    this.fetchNewGAInfo();
  }
  // 发送验证码
  sendVerfiCode(order_id_name) {
    let data = {
      type: CONST.CODE_TYPE.CHANGE_BIND_GA,
      receiver_type: this.props.userinfo.registerType,
    };
    this.props
      .dispatch({
        type: "layout/send_verify_code",
        payload: data,
        errorCallback: () => {
          this.setState({
            sendVerfiCode: false,
          });
          this.verfiCode.reset();
        }, // 验证码错误回调
      })
      .then((ret) => {
        this.setState({
          sendVerfiCode: true,
          order_id: ret.orderId,
        });
      });
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

  fetchNewGAInfo() {
    this.props.dispatch({
      type: "user/new_ga_info",
      payload: {},
    });
  }
  // 绑定ga step2
  changeBindGA() {
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

    // newGACode 不能为空
    if (!this.state.newGACode.value) {
      this.setState({
        newGACode: {
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
      type: "user/change_bind_ga",
      payload: {
        original_ga_code: this.state.gaCode.value,
        order_id: this.state.order_id,
        verify_code: this.state[name]["value"],
        alter_ga_code: this.state.newGACode.value,
      },
      history: this.props.history,
      errorCallback: () => {},
    });
  }

  render() {
    const { classes } = this.props;

    if (this.props.userinfo.bindGA) {
      return (
        <div className={classes.center}>
          <Grid container>
            <Grid item xs={3}>
              <GoBackRC />
            </Grid>
            <Grid item xs={6}>
              <div className={classes.password_title}>
                <FormattedMessage id="更换谷歌验证" />
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
                        value={this.state.gaCode.value}
                        onChange={this.changeStatus.bind(this, "gaCode")}
                        label={this.props.intl.formatMessage({
                          id: "旧谷歌验证码",
                        })}
                        placeholder={this.props.intl.formatMessage({
                          id: "请输入验证码",
                        })}
                        error={Boolean(this.state.gaCode.msg)}
                        helperText={this.state.gaCode.msg}
                        fullWidth
                      />
                    </div>
                  </div>
                  {this.props.userinfo.registerType == 1 ? (
                    <React.Fragment>
                      <div className={classes.formItem}>
                        <div
                          className={classes.formContent}
                          style={{ flex: 1 }}
                        >
                          <TextField
                            value={this.props.userinfo.mobile}
                            disabled
                            label={this.props.intl.formatMessage({
                              id: "手机",
                            })}
                            fullWidth
                          />
                        </div>
                      </div>
                      <div className={classes.formItem}>
                        <div
                          className={classes.g_formContent}
                          style={{ flex: 1 }}
                        >
                          <TextField
                            value={this.state.mobileCode.value}
                            label={this.props.intl.formatMessage({
                              id: "手机验证码",
                            })}
                            onChange={this.changeStatus.bind(
                              this,
                              "mobileCode"
                            )}
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
                        <div
                          className={classes.formContent}
                          style={{ flex: 1 }}
                        >
                          <TextField
                            value={this.props.userinfo.email}
                            disabled
                            label={this.props.intl.formatMessage({
                              id: "邮箱",
                            })}
                            fullWidth
                          />
                        </div>
                      </div>
                      <div className={classes.formItem}>
                        <div
                          className={classes.formContent}
                          style={{ flex: 1 }}
                        >
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
                  <div className={classes.ga_item}>
                    <dl>
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
                      {this.props.new_ga_info.qrcode ? (
                        <img
                          alt=""
                          src={
                            "data:image/png;base64," +
                            this.props.new_ga_info.qrcode
                          }
                          style={{ maxWidth: 150, margin: "0 0 15px" }}
                        />
                      ) : (
                        ""
                      )}
                      <br />
                      <strong>{this.props.new_ga_info.secretKey}</strong>
                    </div>
                  </div>
                  <div className={classes.ga_item}>
                    <dl>
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
                  <div className={classes.formItem}>
                    <div className={classes.formContent} style={{ flex: 1 }}>
                      <TextField
                        value={this.state.newGACode.value}
                        onChange={this.changeStatus.bind(this, "newGACode")}
                        label={this.props.intl.formatMessage({
                          id: "新谷歌验证码",
                        })}
                        placeholder={this.props.intl.formatMessage({
                          id: "请输入验证码",
                        })}
                        error={Boolean(this.state.newGACode.msg)}
                        helperText={this.state.newGACode.msg}
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className={classes.formItem}>
                    <div className={classes.formContent} style={{ flex: 1 }}>
                      {this.props.loading.effects["user/CHANGE_BIND_GA"] ? (
                        <Button
                          color="primary"
                          variant="contained"
                          className={classes.btn}
                          disabled="disabled"
                          loading
                        >
                          {this.props.intl.formatMessage({
                            id: "更换",
                          })}
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          className={classes.btn}
                          onClick={this.changeBindGA}
                        >
                          {this.props.intl.formatMessage({
                            id: "更换",
                          })}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
        </div>
      );
    }
  }
}

export default withStyles(styles)(injectIntl(UserCenterchangeBindGA));
