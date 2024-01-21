import React from "react";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Input,
  FormControl,
  FormHelperText,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";
import styles from "./order_style";
import classNames from "classnames";
import route_map from "../../config/route_map";

class Order extends React.Component {
  constructor() {
    super();
    this.state = {
      value: "",
      errorText: "",
      hasError: false,
      checked: false,
      checkAlert: false,
    };
    this.sendOrder = this.sendOrder.bind(this);
    this.change = this.change.bind(this);
    this.check = this.check.bind(this);
    this.confirm = this.confirm.bind(this);
    this.validator = this.validator.bind(this);
    this.recharge = this.recharge.bind(this);
    this.goLogin = this.goLogin.bind(this);
    this.checkResult = this.checkResult.bind(this);
  }

  componentDidMount() {
    if (this.props.orderType == "redeem") {
      this.setState({
        checked: true,
      });
    }
  }

  validator(value) {
    let result = {
      pass: true,
      text: "",
    };
    if (value.trim() == "") {
      result.pass = false;
      result.text = this.lang("此项不能为空");
      return result;
    }
    if (this.props.orderType == "order") {
      //开放额度
      if (Number(value) > Number(this.props.left)) {
        result.pass = false;
        result.text = this.lang("剩余开放额度不足");
        return result;
      }
      //单人限额
      if (Number(value) > Number(this.props.userLastLimit)) {
        result.pass = false;
        result.text = `${this.lang("每人限购")}${this.props.userLimit}${
          this.props.unit
        }， ${this.lang("最多还能买")}${this.props.userLastLimit}${
          this.props.unit
        }`;
        return result;
      }
      //个人余额
      if (Number(value) > Number(this.props.balance)) {
        result.pass = false;
        result.text = this.lang("余额不足，请充值后操作");
        return result;
      }
      //最小值
      if (Number(value) < Number(this.props.orderMinTrade || value == 0)) {
        result.pass = false;
        result.text = `${this.lang("输入的价格小于最小成交值")},${
          this.props.orderMinTrade
        }${this.props.unit}${this.lang("起购")}, ${
          this.props.tradeScaleNumber
        }${this.props.unit}${this.lang("递增")}`;
        return result;
      }
      //超精度
      if (
        value.split(".")[1] &&
        value.split(".")[1].length > this.props.tradeScale
      ) {
        result.pass = false;
        result.text = `${this.lang("输入数字长度超过精度最小值")},${
          this.props.orderMinTrade
        }${this.props.unit}${this.lang("起购")},${this.props.tradeScaleNumber}${
          this.props.unit
        }${this.lang("递增")}`;
        return result;
      }
    } else {
      if (value.trim() == "") {
        result.pass = false;
        result.text = this.lang("此项不能为空");
        return result;
      }
      if (Number(value) > this.props.redeemBalance) {
        result.pass = false;
        result.text = this.lang("可取金额不足，请重新填写");
        return result;
      }
      //超精度
      if (
        value.split(".")[1] &&
        value.split(".")[1].length > this.props.tradeScale
      ) {
        result.pass = false;
        result.text = this.lang("输入数字长度超过精度最小值");
        return result;
      }
      //最小值
      if (Number(value) < Number(this.props.redeemMinTrade) || value == 0) {
        result.pass = false;
        result.text = this.lang("输入的价格小于最小成交值");
        return result;
      }
    }
    return result;
  }

  sendOrder() {
    if (!this.props.match || !this.props.match.params.product_id) return;
    const { product_id } = this.props.match.params;
    this.props.orderType == "order" &&
      this.props.dispatch({
        type: "coinplus/purchase",
        payload: {
          productId: product_id,
          amount: this.state.value,
        },
        dispatch: this.props.dispatch,
        history: this.props.history,
      });

    this.props.orderType == "redeem" &&
      this.props.dispatch({
        type: "coinplus/redeem",
        payload: {
          productId: product_id,
          amount: this.state.value,
        },
      });
  }

  recharge() {
    window.location.href = route_map.rechange + "/" + this.props.unit;
  }

  change(e) {
    let { value } = e.currentTarget;
    if (isNaN(value)) return false;
    if (
      value.split(".")[1] &&
      value.split(".")[1].length > this.props.inputDigitLength
    )
      return false;
    this.checkResult(value);
  }

  checkResult(value) {
    const error = this.validator(value);
    this.setState({
      value: value,
      hasError: !error.pass,
      errorText: error.pass ? "" : error.text,
    });
  }

  check() {
    const checked = this.state.checked;
    this.setState({
      checked: !checked,
      checkAlert: checked,
    });
  }

  confirm() {
    if (this.props.orderType == "order") {
      if (!this.state.checked) {
        this.setState({
          checkAlert: true,
        });
        return false;
      }
    }
    const result = this.validator(this.state.value);
    if (result.pass) {
      this.sendOrder();
    } else {
      this.setState({
        errorText: result.text,
        hasError: true,
      });
    }
  }

  lang(str) {
    if (!str) return "";
    return this.props.intl.formatMessage({ id: str });
  }

  goLogin() {
    const url = route_map.login + "?redirect=" + window.location.href;
    window.location.href = url;
  }

  render() {
    if (!this.props.orderType) {
      return null;
    }
    const isLogin = this.props.userinfo && this.props.userinfo.userId;
    const isOrder = this.props.orderType == "order";
    const { unit, balance, redeemBalance } = this.props;
    const placeHolder = isOrder
      ? `${this.props.orderMinTrade}${this.props.unit} ${this.lang("起购")}, ${
          this.props.tradeScaleNumber
        }${this.props.unit} ${this.lang("递增")}`
      : `${this.props.tradeScaleNumber}${this.props.unit} ${this.lang("递增")}`;
    const c = this.props.classes;
    const { errorText, hasError, value, checked } = this.state;
    const formatBalance = isOrder ? balance : redeemBalance;
    return (
      <div className={c.orderWrap}>
        <div className={c.top}>
          {isLogin ? (
            <div className={c.flex}>
              <span className={c.available}>
                {isOrder ? this.lang("钱包可用额度") : this.lang("可取金额")}
                <span className={c.highLight}> {formatBalance} </span>
                {unit}
              </span>
              {isOrder ? (
                <span className={c.recharge} onClick={this.recharge}>
                  {this.lang("充值")}
                </span>
              ) : (
                <span
                  className={c.recharge}
                  onClick={() => {
                    this.setState(
                      { value: formatBalance },
                      this.checkResult(formatBalance)
                    );
                  }}
                >
                  {this.lang("全部")}
                </span>
              )}
            </div>
          ) : (
            <span className={c.available}>
              {this.lang("钱包可用额度")}
              <em onClick={this.goLogin}>{this.lang("登录")}</em>
              {this.lang("可见")}
            </span>
          )}
        </div>

        <FormGroup>
          <FormControl className={c.order} error={hasError}>
            <Input
              className={c.input}
              name={"order"}
              value={value}
              placeholder={placeHolder}
              error={hasError}
              autoComplete="off"
              endAdornment={
                <InputAdornment position="end">{unit || ""}</InputAdornment>
              }
              onChange={this.change}
            />
            <FormHelperText className={c.helper}>{errorText}</FormHelperText>
          </FormControl>
          {isOrder ? (
            <FormControlLabel
              className={c.select}
              classes={{
                label: c.label,
              }}
              control={
                <Checkbox
                  color="primary"
                  checked={checked}
                  name="check"
                  onChange={this.check}
                  classes={{
                    root: c.checkRoot,
                  }}
                />
              }
              label={
                isOrder ? (
                  <span>
                    <span
                      className={classNames({
                        [c.checkAlert]: this.state.checkAlert,
                      })}
                    >
                      {this.lang("我已阅读并同意")}
                    </span>
                    <a
                      className={c.agreement}
                      target="_blank"
                      href={route_map.protocols + "/bonus"}
                    >
                      {this.lang("《活期协议》")}
                    </a>
                  </span>
                ) : (
                  <span>{this.lang("取出至钱包账户")}</span>
                )
              }
            />
          ) : (
            <span className={c.bottomText}>{this.lang("取出至钱包账户")}</span>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={isLogin ? this.confirm : this.goLogin}
            className={c.bottomButton}
            disabled={
              (isOrder && !this.props.allowPurchase) ||
              (!isOrder && !this.props.allowRedeem)
            }
          >
            {isLogin
              ? isOrder
                ? this.lang("确认申购")
                : this.lang("确认赎回")
              : isOrder
              ? this.lang("登录后申购")
              : this.lang("登录后赎回")}
          </Button>
        </FormGroup>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Order));
