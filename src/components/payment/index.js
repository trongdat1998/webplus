import React from "react";
import { Button, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { FormattedHTMLMessage, injectIntl } from "react-intl";
import { Date } from "core-js";
import { parse } from "search-params";
import VerfiCodeRC from "../public/verificationCode_mui";

function deadlineFormat(t) {
  const n = Number(t);
  if (!n) {
    return ["00", "00", "00", "00"];
  }
  const d = Math.floor(n / (24 * 60 * 60 * 1000));
  const h = Math.floor((t - d * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
  const m = Math.floor(
    (t - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000) / (60 * 1000)
  );
  const s = Math.floor(
    (t - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000 - m * 60 * 1000) / 1000
  );
  return [format(d), format(h), format(m), format(s)];
}
function format(i) {
  return i > 9 ? i : "0" + i;
}
class PaymentRC extends React.Component {
  constructor() {
    super();
    this.state = {
      mobile: "",
      mobileCode: "",
      emailCode: "",
      gaCode: "",
      codeMsg: "",
      remainTime: 0,
    };
    this.renderAuthType = this.renderAuthType.bind(this);
    this.renderCode = this.renderCode.bind(this);
  }

  componentDidMount() {
    const ua = window.navigator.userAgent;
    const pathname = window.location.pathname;
    const search = window.location.search;
    if (/iphone|android|ipad/i.test(ua)) {
      window.location.href = "/m" + pathname + search;
    }
    const orderid = parse(this.props.location.search.replace("?", "")).orderid;
    this.props.dispatch({
      type: "payment/getPayData",
      payload: {
        order_id: orderid,
      },
    });
    if (orderid) {
      this.run();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.orderInfo &&
      !this.props.orderInfo.expired &&
      nextProps.orderInfo.expired
    ) {
      this.setState({
        remainTime: nextProps.orderInfo.expired - Date.now(),
      });
    }
  }
  run = () => {
    if (
      this.state.remainTime &&
      Math.max(0, this.state.remainTime - 1000) <= 0
    ) {
      this.props.dispatch({
        type: "payment/handleChange",
        payload: {
          payStatus: "EXPIRED",
        },
      });
    }
    this.setState(
      {
        remainTime: Math.max(0, this.state.remainTime - 1000),
      },
      () => {
        setTimeout(this.run, 1000);
      }
    );
  };
  changeStatus(n, e) {
    const t = e.target;
    let value = t.value;
    value = value.replace(/\s/g, "");
    this.setState({
      [n]: value,
    });
  }
  sendCode() {
    const orderid = parse(this.props.location.search.replace("?", "")).orderid;
    this.props.dispatch({
      type: "payment/sendVerifyCode",
      payload: {
        order_id: orderid,
      },
    });
  }
  pay(type) {
    let msg = "";
    let typeMap = {
      MOBILE: "mobileCode",
      EMAIL: "emailCode",
      GA: "gaCode",
    };
    const orderid = parse(this.props.location.search.replace("?", "")).orderid;
    if (this.props.need2FA && !this.state[typeMap[type]]) {
      msg = this.props.intl.formatMessage({
        id: "此项不能为空",
      });
      this.setState({
        codeMsg: msg,
      });
      return;
    }
    this.props.dispatch({
      type: "payment/pay",
      payload: {
        order_id: orderid,
        verify_code_order_id: this.props.codeOrderId,
        verify_code: this.state[typeMap[type]],
      },
    });
  }
  renderAuthType() {
    const { classes } = this.props;
    const authType = this.props.authType;
    if (authType == "MOBILE") {
      return (
        <li>
          <span>{this.props.intl.formatMessage({ id: "手机号码" })} ：</span>
          <p className={classes.grey}>{this.props.userInfo.mobile}</p>
        </li>
      );
    } else if (authType == "EMAIL") {
      return (
        <li>
          <span>{this.props.intl.formatMessage({ id: "邮箱" })} ：</span>
          <p className={classes.grey}>{this.props.userInfo.email}</p>
        </li>
      );
    } else {
      return "";
    }
  }
  renderCode() {
    const { classes } = this.props;
    const authType = this.props.authType;
    if (authType == "MOBILE") {
      return (
        <TextField
          placeholder={this.props.intl.formatMessage({
            id: "请输入手机验证码pay",
          })}
          value={this.state.mobileCode}
          onChange={this.changeStatus.bind(this, "mobileCode")}
          inputRef={(ref) => (this.mobile_input = ref)}
          helperText={this.state.codeMsg}
          error={Boolean(this.state.codeMsg)}
          style={{ flex: 1, width: "100%" }}
          InputProps={{
            endAdornment: (
              <VerfiCodeRC
                value={this.props.userInfo.mobile}
                onClick={this.sendCode.bind(this)}
                className={classes.verfCode}
                variant="text"
                ref={(ref) => (this.verfiCode = ref)}
              />
            ),
          }}
        />
      );
    } else if (authType == "EMAIL") {
      return (
        <TextField
          placeholder={this.props.intl.formatMessage({
            id: "请输入邮箱验证码pay",
          })}
          value={this.state.emailCode}
          onChange={this.changeStatus.bind(this, "emailCode")}
          inputRef={(ref) => (this.email_input = ref)}
          helperText={this.state.codeMsg}
          error={Boolean(this.state.codeMsg)}
          style={{ flex: 1, width: "100%" }}
          InputProps={{
            endAdornment: (
              <VerfiCodeRC
                value={this.props.userInfo.email}
                onClick={this.sendCode.bind(this)}
                className={classes.verfCode}
                variant="text"
                ref={(ref) => (this.verfiCode = ref)}
              />
            ),
          }}
        />
      );
    } else {
      return (
        <TextField
          placeholder={this.props.intl.formatMessage({
            id: "请输入谷歌验证码pay",
          })}
          value={this.state.gaCode}
          onChange={this.changeStatus.bind(this, "gaCode")}
          inputRef={(ref) => (this.ga_input = ref)}
          helperText={this.state.codeMsg}
          error={Boolean(this.state.codeMsg)}
          style={{ flex: 1, width: "100%" }}
        />
      );
    }
  }
  render() {
    const { classes } = this.props;
    let { authType, payStatus, need2FA } = this.props;
    const remainTime = deadlineFormat(this.state.remainTime);
    if (payStatus == "") {
      return <div></div>;
    } else if (payStatus == "WAIT_FOR_PAYMENT") {
      // 待支付
      return (
        <div className={classes.payment}>
          <h1>
            {this.props.intl.formatMessage({ id: "请确认以下为本人操作" })}
          </h1>
          <div className={classes.info}>
            <ul>
              <li>
                <span>{this.props.intl.formatMessage({ id: "用途" })} ：</span>
                <p>{this.props.orderInfo.desc}</p>
              </li>
              {this.props.payList && this.props.payList.length ? (
                <li>
                  <span>
                    {this.props.intl.formatMessage({ id: "支付金额" })} ：
                  </span>
                  <p>
                    {this.props.payList.map((item, index) => {
                      return (
                        <span key={index}>
                          {item.amount} {item.tokenId}
                        </span>
                      );
                    })}
                  </p>
                </li>
              ) : (
                ""
              )}
              {this.props.prepayList && this.props.prepayList.length ? (
                <li>
                  <span>
                    {this.props.intl.formatMessage({ id: "预付金额" })} ：
                  </span>
                  <p>
                    {this.props.prepayList.map((item, index) => {
                      return (
                        <span key={index}>
                          {item.amount} {item.tokenId}
                        </span>
                      );
                    })}
                  </p>
                </li>
              ) : (
                ""
              )}
              {this.props.isMapping ? (
                <li>
                  <span>
                    {this.props.intl.formatMessage({ id: "映射金额" })} ：
                  </span>
                  <p>
                    {this.props.mapList.map((item, index) => {
                      return (
                        <span key={index}>
                          {item.amount} {item.tokenId}
                        </span>
                      );
                    })}
                  </p>
                </li>
              ) : (
                ""
              )}
              {need2FA && authType ? this.renderAuthType() : ""}
              {need2FA ? (
                <li>
                  <span>
                    {this.props.intl.formatMessage({ id: "验证码" })} ：
                  </span>
                  <div className={classes.emailtype}>
                    {authType ? this.renderCode() : ""}
                  </div>
                </li>
              ) : (
                ""
              )}
            </ul>
            <Button
              variant="contained"
              color="primary"
              fullWidth={true}
              onClick={this.pay.bind(this, authType)}
            >
              {this.props.intl.formatMessage({ id: "确认本人操作" })}
            </Button>
          </div>
          <FormattedHTMLMessage
            id="请在{time}之内完成操作"
            values={{
              time:
                (remainTime[0] != "00" ? remainTime[0] : "") +
                (remainTime[0] != "00"
                  ? this.props.intl.formatMessage({ id: "天" }) + " "
                  : "") +
                remainTime[1] +
                ":" +
                remainTime[2] +
                ":" +
                remainTime[3],
            }}
            tagName="p"
          />
        </div>
      );
    } else if (payStatus == "FAIL" || payStatus == "EXPIRED") {
      let text = {
        FAIL: "支付失败",
        EXPIRED: "订单已失效",
      };
      return (
        <div className={classes.status}>
          <img src={require("../../assets/fail.png")} />
          <h1>{this.props.intl.formatMessage({ id: text[payStatus] })}</h1>
        </div>
      );
    } else if (payStatus == "COMPLETED" || payStatus == "PROCESSING") {
      let text = {
        COMPLETED: "支付成功",
        PROCESSING: "已经成功提交付款，请耐心等待",
      };
      return (
        <div className={classes.status}>
          <img src={require("../../assets/success.png")} />
          <h1>{this.props.intl.formatMessage({ id: text[payStatus] })}</h1>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default withStyles(styles)(injectIntl(PaymentRC));
