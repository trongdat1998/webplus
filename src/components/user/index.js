// 个人中心
import React from "react";
import route_map from "../../config/route_map";
import { FormattedMessage, injectIntl } from "react-intl";
import classnames from "classnames";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import style from "./usercenter_style";
import { withStyles } from "@material-ui/core/styles";
import { Iconfont, message } from "../../lib";
import { CopyToClipboard } from "react-copy-to-clipboard";
import VerfiCodeRC from "../public/verificationCode_mui";
import helper from "../../utils/helper";
import CONSTS from "../../config/const";

class UserCenter extends React.Component {
  constructor() {
    super();
    this.state = {
      fishopen: false,
      fishCode: {
        value: "",
        msg: "",
      },
      emailCode: {
        value: "",
        msg: "",
      },
      verfCodeTip: "",
    };
    this.getMore = this.getMore.bind(this);
    this.renderText = this.renderText.bind(this);
  }

  componentDidMount() {
    this.props.dispatch({
      type: "user/verify_info",
      payload: {},
      callback: (displayLevel, verifyStatus) => {
        let current_level = displayLevel;
        if (displayLevel == "0") {
          current_level = "1";
        } else if (displayLevel == "1" && verifyStatus == 2) {
          current_level = "2";
        } else if (displayLevel == "2" && verifyStatus == 2) {
          current_level = "3";
        }
        this.props.dispatch({
          type: "user/get_user_kycinfo",
          payload: {
            current_level: current_level,
          },
        });
      },
    });
  }
  // 获取更多
  getMore() {
    this.props.dispatch({
      type: "user/authorize_log",
      payload: {},
    });
  }
  copy = () => {
    message.info(
      this.props.intl.formatMessage({
        id: "复制成功",
      })
    );
  };
  renderText(displayLevel, verifyStatus) {
    if (displayLevel == "0" || (displayLevel == "1" && verifyStatus == 0)) {
      return <FormattedMessage id="未实名" />;
    } else if (
      (displayLevel == "1" && verifyStatus == 2) ||
      (displayLevel == "2" && verifyStatus == 0) ||
      (displayLevel == "3" &&
        verifyStatus == 0 &&
        this.props.needVedioVerify) ||
      (displayLevel == "2" && verifyStatus == 2 && this.props.needVedioVerify)
    ) {
      return <FormattedMessage id="继续认证" />;
    } else if (
      (displayLevel == "2" &&
        verifyStatus == 2 &&
        !this.props.needVedioVerify) ||
      (displayLevel == "3" &&
        verifyStatus == 0 &&
        !this.props.needVedioVerify) ||
      (displayLevel == "3" && verifyStatus == 2)
    ) {
      return <FormattedMessage id="认证完成" />;
    } else if (verifyStatus == 3) {
      return <FormattedMessage id="审核失败" />;
    } else {
      return <FormattedMessage id="审核中" />;
    }
  }
  // 未绑定邮箱提示
  tip = () => {
    message.info(this.props.intl.formatMessage({ id: "请先绑定邮箱" }));
  };
  toggleOpen = () => {
    this.setState({
      fishopen: !this.state.fishopen,
    });
  };
  changeStatus = (n, e) => {
    const t = e.target;
    if (n === "fishCode") {
      this.verfiCode.reset();
      this.setState({
        sendEmailVerfiCode: false,
        emailCode: {
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
  };
  // 发送验证码
  sendVerfiCode = () => {
    if (!this.state.fishCode.value) {
      this.setState({
        fishCode: {
          status: "error",
          msg: this.props.intl.formatMessage({
            id: "此项不能为空",
          }),
          value: "",
        },
      });
      this.verfiCode.reset();
      return;
    }
    if (!/^[0-9a-zA-Z]{3,10}$/.test(this.state.fishCode.value)) {
      this.setState({
        fishCode: {
          status: "error",
          msg: this.props.intl.formatMessage({
            id: "3-10数字英文",
          }),
          value: "",
        },
      });
      this.verfiCode.reset();
      return;
    }
    this.setState(
      {
        sendVerfiCode: true,
        verfCodeTip: this.props.intl.formatMessage(
          { id: "验证码已发送至{email}" },
          { email: this.props.userinfo.email }
        ),
      },
      () => {
        let data = {};

        data.email = this.props.userinfo.email;

        // type=24 防钓鱼码验证码
        data.type = 24;

        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          n: 1,
          order_id_name: "order_id",
          errorCallback: () => {
            this.setState({
              ["sendVerfiCode"]: false,
              verfCodeTip: "",
            });
            this.verfiCode.reset();
          }, // 验证码错误回调
        });
      }
    );
  };
  submit = () => {
    if (!this.state.fishCode.value) {
      this.setState({
        fishCode: {
          status: "error",
          msg: this.props.intl.formatMessage({
            id: "此项不能为空",
          }),
          value: "",
        },
      });
      this.verfiCode.reset();
      return;
    }
    if (!/^[0-9a-zA-Z]{3,10}$/.test(this.state.fishCode.value)) {
      this.setState({
        fishCode: {
          status: "error",
          msg: this.props.intl.formatMessage({
            id: "3-10数字英文",
          }),
          value: "",
        },
      });
      this.verfiCode.reset();
      return;
    }
    if (!this.state.sendVerfiCode) {
      this.verfiCode.reset();
      this.setState({
        emailCode: {
          value: "",
          msg: this.props.intl.formatMessage({ id: "请先获取验证码" }),
        },
      });
      return;
    }
    if (!this.state.emailCode.value) {
      this.setState({
        emailCode: {
          value: "",
          msg: this.props.intl.formatMessage({ id: "此项不能为空" }),
        },
      });
      return;
    }
    // 验证码不正确
    if (!/^[a-z0-9A-Z]{6,8}$/.test(this.state.emailCode.value)) {
      this.setState({
        emailCode: {
          status: "error",
          msg: this.props.intl.formatMessage({
            id: "验证码错误",
          }),
          value: this.state.emailCode.value,
        },
      });
      this.verfiCode.reset();
      return;
    }

    this.props.dispatch({
      type: "user/setFishCode",
      payload: {
        anti_phishing_code: this.state.fishCode.value,
        auth_type: 2,
        order_id: this.props.order_id,
        verify_code: this.state.emailCode.value,
      },
      success: () => {
        this.setState({
          fishCode: {
            value: "",
            msg: "",
          },
          emailCode: {
            value: "",
            msg: "",
          },
          sendVerfiCode: false,
          fishopen: false,
          verfCodeTip: "",
        });
      },
    });
  };
  render() {
    const { classes } = this.props;
    const { displayLevel, verifyStatus } = this.props.verify_info;
    return (
      <div className={classnames(classes.center)}>
        <div className={classes.userinfo}>
          <img alt="" src={require("../../assets/defaulticon.png")} />
          <ul>
            <li>
              <strong>
                {this.props.userinfo.registerType == 1
                  ? this.props.userinfo.mobile
                  : this.props.userinfo.email}
              </strong>
              {displayLevel == "0" ||
              (displayLevel == "1" && verifyStatus != 2) ? (
                <a href={route_map.user_kyc}>
                  {this.props.intl.formatMessage({ id: "未实名认证" })}
                </a>
              ) : (
                ""
              )}
              {(displayLevel == "1" && verifyStatus == 2) ||
              (displayLevel == "2" && verifyStatus != 2) ? (
                <a href={route_map.user_kyc}>
                  {this.props.intl.formatMessage({ id: "级别1" })}
                </a>
              ) : (
                ""
              )}
              {(displayLevel == "2" && verifyStatus == 2) ||
              (displayLevel == "3" && verifyStatus != 2) ? (
                <a href={route_map.user_kyc}>
                  {this.props.intl.formatMessage({ id: "级别2" })}
                </a>
              ) : (
                ""
              )}
              {displayLevel == "3" && verifyStatus == 2 ? (
                <span>{this.props.intl.formatMessage({ id: "级别3" })}</span>
              ) : (
                ""
              )}
              {this.props.userinfo.userType === 1 ? (
                ""
              ) : (
                <em>{this.props.intl.formatMessage({ id: "机构用户" })}</em>
              )}
              {this.props.userinfo.customLabelList &&
              this.props.userinfo.customLabelList.length
                ? this.props.userinfo.customLabelList.map((item, index) => {
                    return item.labelValue ? (
                      <em
                        key={index}
                        style={{
                          color: item.colorCode,
                          borderColor: item.colorCode,
                        }}
                      >
                        {item.labelValue}
                      </em>
                    ) : (
                      ""
                    );
                  })
                : ""}
            </li>
            <li>
              <CopyToClipboard
                text={this.props.userinfo.userId}
                onCopy={this.copy}
              >
                <p>
                  UID {this.props.userinfo.userId}
                  <Iconfont type="paste1" size="24" />
                </p>
              </CopyToClipboard>
            </li>
          </ul>
        </div>
        <div className={classes.moduleBox}>
          <Grid container wrap="wrap" className={classes.module}>
            <Grid item xs={4} className={classes.module_item}>
              <div>
                <h2>
                  <FormattedMessage id="登录密码" />
                </h2>
                <p />
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  href={
                    this.props.userinfo.bindPassword
                      ? route_map.resetpwd
                      : route_map.setpwd
                  }
                >
                  <FormattedMessage
                    id={this.props.userinfo.bindPassword ? "修改" : "设置"}
                  />
                </Button>
              </div>
            </Grid>
            <Grid item xs={4} className={classes.module_item}>
              <div>
                <h2>
                  <FormattedMessage id="资金密码" />
                </h2>
                <p>
                  <FormattedMessage id="用户提现，法币交易及转账设置" />
                </p>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  href={route_map.fund_password}
                >
                  {Boolean(this.props.userinfo.bindTradePwd)
                    ? this.props.intl.formatMessage({ id: "修改" })
                    : this.props.intl.formatMessage({ id: "设置" })}
                </Button>
              </div>
            </Grid>
            <Grid item xs={4} className={classes.module_item}>
              <div>
                <h2>
                  <FormattedMessage id="实名认证" />
                </h2>
                <p>
                  <FormattedMessage id="用户提现，法币交易及API设置验证" />
                </p>
                {this.props.userinfo.userType == 1 ? (
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    href={route_map.user_kyc}
                  >
                    {this.renderText(displayLevel, verifyStatus)}
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </Grid>
            <Grid item xs={4} className={classes.module_item}>
              <div>
                <h2>
                  <FormattedMessage id="邮箱" />
                  <i>{this.props.userinfo.email}</i>
                </h2>
                <p>
                  <FormattedMessage id="用于登录、提现及安全设置验证" />
                </p>
                {this.props.userinfo.email ?
                (
                  this.props.userinfo.registerType ==
                  CONSTS.REGIST_TYPE.EMAIL ? (
                    <Button size="small" disabled variant="contained">
                      <FormattedMessage id="已绑定" />
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      href={route_map.user_change_bind + "/email"}
                    >
                      <FormattedMessage id="更换" />
                    </Button>
                  )
                )
                 : (
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    href={route_map.user_bind + "/email"}
                  >
                    <FormattedMessage id="绑定" />
                  </Button>
                )}
              </div>
            </Grid>
            <Grid item xs={4} className={classes.module_item}>
              <div>
                <h2>
                  <FormattedMessage id="手机" />
                  <i>{this.props.userinfo.mobile}</i>
                </h2>
                <p>
                  <FormattedMessage id="用于登录、提现及安全设置验证" />
                </p>
                {this.props.userinfo.mobile ?
                 (
                  this.props.userinfo.registerType ==
                  CONSTS.REGIST_TYPE.MOBILE ? (
                    <Button size="small" disabled variant="contained">
                      <FormattedMessage id="已绑定" />
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      href={route_map.user_change_bind + "/mobile"}
                    >
                      <FormattedMessage id="更换" />
                    </Button>
                  )
                )
                : (
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    href={route_map.user_bind + "/mobile"}
                  >
                    <FormattedMessage id="绑定" />
                  </Button>
                )}
              </div>
            </Grid>
            <Grid item xs={4} className={classes.module_item}>
              <div>
                <h2>
                  <FormattedMessage id="谷歌验证" />
                </h2>
                <p>
                  <FormattedMessage id="用于登录、提现及安全设置验证" />
                </p>
                {this.props.userinfo.bindGA ? 
                (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    href={route_map.user_change_bind + "/ga"}
                  >
                    {this.props.intl.formatMessage({ id: "更换" })}
                  </Button>
                )
                 : (
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    href={route_map.user_bind + "/ga"}
                  >
                    {this.props.intl.formatMessage({ id: "绑定" })}
                  </Button>
                )}
              </div>
            </Grid>
            <Grid item xs={4} className={classes.module_item}>
              <div>
                <h2>
                  {this.props.intl.formatMessage({ id: "防钓鱼码" })}{" "}
                  <i>{this.props.userinfo.antiPhishingCode}</i>
                </h2>
                <p>{this.props.intl.formatMessage({ id: "fishing.code" })}</p>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={
                    this.props.userinfo.email ? this.toggleOpen : this.tip
                  }
                >
                  {this.props.intl.formatMessage({
                    id: this.props.userinfo.antiPhishingCode ? "修改" : "设置",
                  })}
                </Button>
              </div>
            </Grid>
            <Grid item xs={4} className={classes.module_item}>
              <div>
                <h2>API</h2>
                <p>
                  <FormattedMessage id="api.desc.1" />
                </p>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  href={route_map.user_api}
                >
                  <FormattedMessage id="设置" />
                </Button>
              </div>
            </Grid>

            <Grid item xs={4} className={classes.module_item}>
              <div>
                <h2>{this.props.intl.formatMessage({ id: "偏好设置" })}</h2>
                <p></p>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  href={route_map.custom_config}
                >
                  <FormattedMessage id="设置" />
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className={classes.layout}>
          <div className={classes.usercenter_title}>
            <FormattedMessage id="最近登录" />
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ paddingLeft: 0 }}>
                  {this.props.intl.formatMessage({ id: "登录时间" })}
                </TableCell>
                <TableCell>
                  {this.props.intl.formatMessage({ id: "IP地址" })}
                </TableCell>
                <TableCell align="right">
                  {this.props.intl.formatMessage({ id: "状态" })}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.authorize_log && this.props.authorize_log.length ? (
                this.props.authorize_log.map((item) => {
                  return (
                    <TableRow key={item.created}>
                      <TableCell style={{ paddingLeft: 0 }}>
                        {moment
                          .utc(Number(item.created))
                          .local()
                          .format("YYYY/MM/DD HH:mm:ss")}
                      </TableCell>
                      <TableCell>{item.ip}</TableCell>
                      <TableCell align="right">
                        {
                          [
                            "",
                            <FormattedMessage id="成功" />,
                            <FormattedMessage id="失败" />,
                            <FormattedMessage id="未完成" />,
                          ][item.status]
                        }
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow />
              )}
            </TableBody>
          </Table>
          {/* <Table
            className={classes.authorize_log}
            widthStyle={classes.authorize_logTitle}
            data={this.props.authorize_log}
            titles={column}
            hasMore={false}
            getMore={this.getMore}
            loading={this.props.loadinclasses.effects["user/authorize_log"]}
          /> */}
        </div>
        <Dialog open={this.state.fishopen}>
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "防钓鱼码设置" })}
          </DialogTitle>
          <DialogContent>
            <Grid container style={{ width: 300 }}>
              <Grid item xs={12} style={{ height: 56 }}>
                <TextField
                  value={this.state.fishCode.value}
                  onChange={this.changeStatus.bind(this, "fishCode")}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入防钓鱼码",
                  })}
                  error={Boolean(this.state.fishCode.msg)}
                  helperText={this.state.fishCode.msg}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} style={{ height: 56 }}>
                <TextField
                  value={this.state.emailCode.value}
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
                        value={this.state.fishCode.value}
                        onClick={this.sendVerfiCode}
                        className={classes.verfCode}
                        ref={(ref) => (this.verfiCode = ref)}
                        variant="text"
                      />
                    ),
                  }}
                />
                <p className={classes.sendTip}>
                  {this.state.emailCode.msg ? "" : this.state.verfCodeTip}
                </p>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleOpen}>
              {this.props.intl.formatMessage({ id: "取消" })}
            </Button>
            <Button color="primary" onClick={this.submit}>
              {this.props.intl.formatMessage({ id: "确认" })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(UserCenter));
