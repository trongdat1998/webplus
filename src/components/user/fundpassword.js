// 资金密码
import React from "react";
import VerfiCodeRC from "../public/verificationCode_mui";
import { FormattedMessage, injectIntl } from "react-intl";
import helper from "../../utils/helper";
import { TextField, Button, Grid } from "@material-ui/core";
import styles from "./usercenter_style";
import { withStyles } from "@material-ui/core/styles";
import GoBackRC from "./goBack";

class FundPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      sendVerfiCode: false,
      code: {
        value: "",
        msg: ""
      },
      password1: {
        value: "",
        msg: ""
      },
      password2: {
        value: "",
        msg: ""
      },
      isopen: false
    };

    this.renderForm = this.renderForm.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.submit = this.submit.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }
  changeStatus(n, e) {
    const obj = Object.assign({}, this.state[n]);
    obj.value = helper.removeEmoji(e.target.value);
    obj.msg = "";
    this.setState({
      [n]: obj
    });
  }
  // 发送验证码
  sendVerfiCode() {
    const edit = Boolean(this.props.userinfo.bindTradePwd);
    this.setState(
      {
        sendVerfiCode: true,
        isopen: false
      },
      () => {
        let data = {};
        if (this.props.userinfo.registerType == 2) {
          data.email = this.props.userinfo.email;
        }
        data.type = edit ? 16 : 15;

        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          n: 1,
          errorCallback: () => {
            this.setState({
              sendVerfiCode: false
            });
          } // 验证码错误回调
        });
      }
    );
  }

  submit() {
    const password1 = this.state.password1.value;
    const password2 = this.state.password2.value;
    if (!this.state.password1.value) {
      this.setState({
        password1: {
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
    if (password1.length < 6 || password1.length > 20) {
      this.setState({
        password1: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "密码仅限6-20位字符"
              })}
            </React.Fragment>
          ),
          value: password1
        }
      });
      this.verfiCode.reset();
      return;
    }
    if (!this.state.password2.value) {
      this.setState({
        password2: {
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
    if (password2.length < 6 || password2.length > 20) {
      this.setState({
        password2: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "密码仅限6-20位字符"
              })}
            </React.Fragment>
          ),
          value: password2
        }
      });
      this.verfiCode.reset();
      return;
    }
    if (password1 != password2) {
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
      this.verfiCode.reset();
      return;
    }
    if (!this.state.sendVerfiCode) {
      this.setState({
        code: {
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
    // 请获取手机验证码
    if (!this.state.code.value) {
      this.setState({
        code: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请输入验证码"
              })}
            </React.Fragment>
          ),
          value: ""
        }
      });
      this.verfiCode.reset();
      return;
    }
    if (!/^[a-z0-9A-Z]{6,8}$/.test(this.state.code.value)) {
      this.setState({
        code: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "验证码错误"
              })}
            </React.Fragment>
          ),
          value: this.state.code.value
        }
      });
      return;
    }

    const edit = Boolean(this.props.userinfo.bindTradePwd);

    let data = {};
    data.order_id = this.props.order_id;
    data.verify_code = this.state.code.value;
    data.password1 = this.state.password1.value;
    data.password2 = this.state.password2.value;
    data.type = edit ? 2 : 1;

    this.props.dispatch({
      type: "user/fundpassword",
      payload: data,
      history: this.props.history,
      errorCallback: res => {
        this.verfiCode.reset();
      }
    });
  }

  renderForm() {
    const edit = Boolean(this.props.userinfo.bindTradePwd);
    const classes = this.props.classes;
    return (
      <div className={classes.forget}>
        <div className={classes.g_form}>
          <div className={classes.formItem}>
            <div className={classes.g_formContent} style={{ flex: 1 }}>
              <TextField
                type="password"
                autoComplete="new-password"
                value={this.state.password1.value}
                onChange={this.changeStatus.bind(this, "password1")}
                label={
                  !edit
                    ? this.props.intl.formatMessage({ id: "新密码" })
                    : this.props.intl.formatMessage({ id: "资金密码" })
                }
                placeholder={this.props.intl.formatMessage({
                  id: "请输入密码"
                })}
                fullWidth
                error={Boolean(this.state.password1.msg)}
                helperText={this.state.password1.msg}
              />
            </div>
          </div>
          <div className={classes.formItem}>
            <div className={classes.g_formContent} style={{ flex: 1 }}>
              <TextField
                type="password"
                autoComplete="new-password"
                value={this.state.password2.value}
                onChange={this.changeStatus.bind(this, "password2")}
                placeholder={this.props.intl.formatMessage({
                  id: "请输入确认密码"
                })}
                label={
                  !edit
                    ? this.props.intl.formatMessage({ id: "确认新密码" })
                    : this.props.intl.formatMessage({ id: "确认密码" })
                }
                fullWidth
                error={Boolean(this.state.password2.msg)}
                helperText={this.state.password2.msg}
              />
            </div>
          </div>
          <div className={classes.formItem} style={{ flex: 1 }}>
            {/* {this.props.userinfo.registerType == 1 ? (
              <label className={classnames(classes.g_formLabel,)}>
                <FormattedMessage id="手机号" />
                <em>{this.props.userinfo.mobile}</em>
              </label>
            ) : (
              <label className={classnames(classes.g_formLabel)}>
                <FormattedMessage id="邮箱" />
                <em>{this.props.userinfo.email}</em>
              </label>
            )} */}
            <TextField
              value={
                this.props.userinfo.registerType == 1
                  ? this.props.userinfo.mobile
                  : this.props.userinfo.email
              }
              disabled
              placeholder={this.props.intl.formatMessage({
                id: "请输入确认密码"
              })}
              label={
                this.props.userinfo.registerType == 1
                  ? this.props.intl.formatMessage({ id: "手机号" })
                  : this.props.intl.formatMessage({ id: "邮箱" })
              }
              fullWidth
            />
          </div>

          <div className={classes.formItem}>
            <div className={classes.formContent} style={{ flex: 1 }}>
              <TextField
                value={this.state.code.value}
                onChange={this.changeStatus.bind(this, "code")}
                placeholder={this.props.intl.formatMessage({
                  id: "请输入验证码"
                })}
                label={this.props.intl.formatMessage({
                  id:
                    this.props.userinfo.registerType == 1
                      ? "手机验证码"
                      : "邮箱验证码"
                })}
                fullWidth
                error={Boolean(this.state.code.msg)}
                helperText={this.state.code.msg}
                InputProps={{
                  endAdornment: (
                    <VerfiCodeRC
                      value={
                        this.props.userinfo.registerType == 1
                          ? this.props.userinfo.mobile
                          : this.props.userinfo.email
                      }
                      onClick={this.sendVerfiCode}
                      className={classes.verfCode}
                      variant="text"
                      ref={ref => (this.verfiCode = ref)}
                    />
                  )
                }}
              />
            </div>
          </div>

          <div className={classes.formItem}>
            <div className={classes.g_formContent} style={{ flex: 1 }}>
              {this.props.loading.effects["user/fundpassword"] ? (
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.btn}
                  disabled
                >
                  {this.props.intl.formatMessage({
                    id: "确定"
                  })}
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.btn}
                  onClick={this.submit}
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
    );
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
              <FormattedMessage id="资金密码" />
            </div>
            <div className={classes.password_tip}>
              {this.props.intl.formatMessage({
                id: "修改资金密码后24小时内暂停提币"
              })}
            </div>
            {this.renderForm()}
          </Grid>
          <Grid item xs={3} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(FundPassword));
