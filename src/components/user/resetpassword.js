// 修改密码
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import GoBackRC from "./goBack";
import { TextField, Button, Grid } from "@material-ui/core";
import styles from "./usercenter_style";
import { withStyles } from "@material-ui/core/styles";

class EditPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      old_password: {
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
      }
    };
    this.resetpwd = this.resetpwd.bind(this);
  }
  changeStatus(n, e) {
    const t = e.target;
    let value = t.value;
    value = value.replace(/\s/g, "");
    this.setState({
      [n]: {
        msg: "",
        value
      }
    });
  }
  resetpwd() {
    const old_password = this.state.old_password.value;
    const password1 = this.state.password1.value;
    const password2 = this.state.password2.value;
    if (!old_password) {
      this.setState({
        old_password: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请输入旧密码"
              })}
            </React.Fragment>
          ),
          value: ""
        }
      });
      return;
    }
    // 密码 大于 8位，
    if (
      old_password.length < 8 ||
      old_password.length > 20 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(old_password)
    ) {
      this.setState({
        old_password: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "密码8-20位字符，必须包含大小写字母和数字"
              })}
            </React.Fragment>
          ),
          value: old_password
        }
      });
      return;
    }
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
    if (password1 && password1 === old_password) {
      this.setState({
        password1: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "新密码不能与旧密码相同"
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

    this.props.dispatch({
      type: "user/editpassword",
      payload: {
        old_password,
        password1,
        password2
      },
      history: this.props.history
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
              <FormattedMessage id="重置密码" />
            </div>
            <div className={classes.password_tip}>
              {this.props.intl.formatMessage({
                id: "提示:重置密码成功后，24小时内不可提现资产"
              })}
            </div>

            <div className={classes.foget}>
              <div className={classes.g_form}>
                <div className={classes.formItem}>
                  <div className={classes.formContent} style={{ flex: 1 }}>
                    <TextField
                      type="password"
                      autoComplete="new-password"
                      value={this.state.old_password.value}
                      onChange={this.changeStatus.bind(this, "old_password")}
                      label={this.props.intl.formatMessage({ id: "旧密码" })}
                      error={Boolean(this.state.old_password.msg)}
                      helperText={this.state.old_password.msg}
                      fullWidth
                    />
                  </div>
                </div>

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
                    {this.props.loading.effects["user/editpassword"] ? (
                      <Button
                        className={classes.btn}
                        color="primary"
                        variant="contained"
                        disabled
                      >
                        {this.props.intl.formatMessage({ id: "确定" })}
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        variant="contained"
                        className={classes.btn}
                        onClick={this.resetpwd}
                      >
                        {this.props.intl.formatMessage({ id: "确定" })}
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

export default withStyles(styles)(injectIntl(EditPassword));
