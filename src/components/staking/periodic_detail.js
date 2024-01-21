import React from "react";
import { injectIntl } from "react-intl";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./periodic_style";
import {
  Button,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormHelperText,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Input,
  CircularProgress,
} from "@material-ui/core";
import helper from "../../utils/helper";
import math from "../../utils/mathjs";
import moment from "moment";
import route_map from "../../config/route_map";

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 0,
      hasError: false,
      count: "",
      errorText: "",
      checked: false,
      checkAlert: false,
      loading: false,
    };
    this.fetchProduct = this.fetchProduct.bind(this);
    this.goLogin = this.goLogin.bind(this);
    this.confirm = this.confirm.bind(this);
    this.change = this.change.bind(this);
    this.renderBtn = this.renderBtn.bind(this);
    this.sendOrder = this.sendOrder.bind(this);
    this.recharge = this.recharge.bind(this);
  }

  componentDidMount() {
    if (!this.props.match || !this.props.match.params.product_id) return;
    const { product_id } = this.props.match.params;
    this.fetchProduct(product_id);
    this.props.dispatch({
      type: "layout/getAccount",
      payload: {},
    });
    this.run();
  }
  componentDidUpdate(preProps) {
    if (
      JSON.stringify(preProps.periodic) != JSON.stringify(this.props.periodic)
    ) {
      let s = 0;
      const now = new Date().getTime();
      if (now > this.props.periodic.interestStartDate) {
        s = 1;
      }
      if (now > this.props.periodic.productEndDate) {
        s = 2;
      }
      this.setState({
        step: s,
      });
    }
  }
  run = async () => {
    let periodic = this.props.periodic || { timeToSubscribe: 0 };
    let timeToSubscribe = 0;
    if (periodic.timeToSubscribe !== undefined) {
      timeToSubscribe = Math.max(0, Number(periodic.timeToSubscribe) - 1000);
      if (periodic.timeToSubscribe == 0 && periodic.status == 0) {
        periodic.status = 1;
      }
      periodic.timeToSubscribe = Math.max(
        0,
        Number(periodic.timeToSubscribe) - 1000
      );
    }
    await this.props.dispatch({
      type: "coinplus/save",
      payload: periodic,
    });
    await helper.delay(1000);
    this.run();
  };

  goLogin() {
    const url =
      route_map.login + "?redirect=" + encodeURIComponent(window.location.href);
    window.location.href = url;
  }
  confirm() {
    const { periodic, intl } = this.props;
    const status = periodic.status;
    if (status !== 1 || !this.state.count) return false;
    if (!this.state.checked) {
      this.setState({
        checkAlert: true,
      });
      return false;
    }
    if (this.state.count < periodic.perUsrLowLots) {
      this.setState({
        errorText: intl.formatMessage(
          { id: "{lowLot}份起购，整数倍递增" },
          { lowLot: periodic.perUsrLowLots || 0 }
        ),
        hasError: true,
      });
      return false;
    } else {
      this.setState({
        errorText: "",
        hasError: false,
        loading: true,
      });
    }
    this.sendOrder();
  }
  getPrecision(amount) {
    let precision = 0;
    if (amount) {
      const arr = amount.split(".");
      precision = arr[1] && arr[1].length ? arr[1].length : 0;
    }
    return precision;
  }
  sendOrder() {
    const { periodic, match } = this.props;
    if (!match || !match.params.product_id) return;
    const { product_id } = match.params;
    let precision = this.getPrecision(periodic.perLotAmount);
    const amount = helper.digits(
      math
        .chain(this.state.count || 0)
        .multiply(periodic.perLotAmount || 0)
        .format({ notation: "fixed" })
        .done(),
      precision
    );
    this.props.dispatch({
      type: "coinplus/staking_subscribe",
      method: "post",
      payload: {
        product_id,
        lots: this.state.count,
        amount: amount,
        type: periodic.type,
      },
      error: () => {
        this.setState({
          loading: false,
        });
      },
    });
  }
  change(e) {
    const t = e.target;
    const type = t.type;
    let value = type === "checkbox" ? !this.state.checked : t.value;
    if (type === "text" && value) {
      value =
        value && Number(`${value}`.replace(/\D/gi, ""))
          ? Math.floor(Number(`${value}`.replace(/\D/gi, "")))
          : "";
      if (value) {
        let [free, part] = this.getData();
        if (part && value > part) {
          value = part;
        }
      }
      // value = Math.min(value, this.props.periodic.perUsrUpLots);
    }
    let params = {
      [t.name]: value,
    };
    if (type === "checkbox") {
      params["checkAlert"] = this.state.checked;
    }
    this.setState(params);
  }
  getLimit(precision, n) {
    const perLotAmount = this.props.periodic.perLotAmount;
    return helper.digits(
      math
        .chain(n || 0)
        .multiply(perLotAmount || 0)
        .format({ notation: "fixed" })
        .done(),
      precision
    );
  }
  async fetchProduct(product_id) {
    this.props.dispatch({
      type: "coinplus/getPeriodicDetail",
      method: "get",
      payload: {
        product_id,
      },
    });
    await helper.delay(20000);
    this.fetchProduct(product_id);
  }
  handleRate(str) {
    const arr = str.split(",");
    let res = [];
    if (arr[1]) {
      res[0] = arr[0];
      res[1] = arr[1];
    } else {
      res[0] = arr[0];
    }
    return res;
  }

  lang(str) {
    if (!str) return "";
    return this.props.intl.formatMessage({ id: str });
  }

  getData = () => {
    let free = 0;
    const user_balance = this.props.user_balance || [];
    const periodic = this.props.periodic || {};
    user_balance.map((item) => {
      if (item.tokenId == periodic.tokenId) {
        free = item.free;
      }
    });
    let part =
      (Number(free) || Number(free) === 0) && Number(periodic.perLotAmount)
        ? Math.min(
            periodic.upLimitLots,
            Math.max(periodic.upLimitLots - periodic.soldLots, 0),
            Math.max(periodic.perUsrUpLots - periodic.usrSubscribeLots, 0),
            Math.floor(Number(free) / Number(periodic.perLotAmount))
          )
        : "";
    return [free, part];
  };

  recharge() {
    const { periodic } = this.props;
    window.location.href = route_map.rechange + "/" + periodic.tokenId;
  }

  renderBtn() {
    const { classes, userinfo, periodic } = this.props;
    const { count, loading } = this.state;
    const isLogin = userinfo && userinfo.userId;
    const timeToSubscribe = periodic.timeToSubscribe;
    const start = helper.deadlineFormat(timeToSubscribe);
    const status = periodic.status;
    let [free, part] = this.getData();
    const text =
      status == 1
        ? this.lang("确认申购")
        : status == 0
        ? `${this.lang("距离开始还剩")}:${start[0]}${this.lang("天")}${
            start[1]
          }:${start[2]}:${start[3]}`
        : this.lang("结束");
    const disabled = status !== 1 || !count || !part || loading;
    if (!isLogin) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={this.goLogin}
          className={classes.bottomButton}
        >
          {this.lang("登录后申购")}
        </Button>
      );
    }
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={this.confirm}
        className={classes.bottomButton}
        disabled={disabled}
      >
        {status == undefined || loading ? (
          <CircularProgress size={21} color="white" />
        ) : (
          this.lang(text)
        )}
      </Button>
    );
  }

  render() {
    if (!this.props.periodic) return <div>{this.lang("未找到该产品")}</div>;
    const c = this.props.classes;
    let { periodic, userinfo, user_balance, intl } = this.props;
    const { classes, ...otherProps } = this.props;
    const { step, hasError, count, errorText, checked } = this.state;
    let precision = this.getPrecision(periodic.perLotAmount);
    let rate = 0;
    if (periodic.soldLots && periodic.upLimitLots) {
      rate = helper.digits(
        math
          .chain(periodic.soldLots)
          .divide(periodic.upLimitLots)
          .multiply(100)
          .format({ notation: "fixed" })
          .done(),
        2
      );
    }
    const remain = math
      .chain((periodic.upLimitLots || 0) - (periodic.soldLots || 0))
      .multiply(periodic.perLotAmount || 0)
      .format({ notation: "fixed" })
      .done();
    const userMinLimit = this.getLimit(precision, periodic.perUsrLowLots);
    const isLogin = userinfo && userinfo.userId;
    let [free, part] = this.getData();
    return (
      <div className={c.container}>
        <div className={classnames(c.screenWidth, c.screenWidthBorder)}>
          <h2 className={classnames(c.content, c.title)}>
            {periodic.productName}
          </h2>
        </div>
        <div className={classnames(c.screenWidth)}>
          <div className={c.content}>
            <div className={c.orderInfo}>
              <div className={c.infos}>
                <div className={c.info}>
                  <dl>
                    <dd className={c.highLight}>
                      {/* {periodic.referenceApr
                        ? (Number(
                            this.handleRate(periodic.referenceApr || "")[0]
                          ) *
                            10000) /
                          100
                        : 0}
                      <em>%</em> */}
                      {periodic.referenceApr}
                      <em>%</em>
                    </dd>
                    <dd>{this.lang("约定年化")}</dd>
                  </dl>
                  <dl>
                    <dd>
                      {remain == 0 ? 0 : helper.digits(remain, precision)}
                    </dd>
                    <dd>
                      {this.lang("剩余开放额度")}
                      {periodic.tokenName}
                    </dd>
                  </dl>
                  <dl>
                    <dd>
                      {periodic.timeLimit}
                      <em>{this.lang("天")}</em>
                    </dd>
                    <dd>{this.lang("锁定期限")}</dd>
                  </dl>
                </div>
                <div className={c.buyProgress}>
                  <LinearProgress
                    variant="determinate"
                    color="primary"
                    value={rate}
                    classes={{
                      root: c.progressRoot,
                      bar: c.progressBar,
                    }}
                  />
                  <p>
                    <span>
                      {this.lang("当前进度")}
                      {rate}%
                    </span>
                    <span>
                      {helper.digits(
                        math
                          .chain(Number(periodic.soldLots))
                          .multiply(Number(periodic.perLotAmount) || 0)
                          .format({ notation: "fixed" })
                          .done(),
                        precision
                      )}
                      /
                      {helper.digits(
                        math
                          .chain(Number(periodic.upLimitLots))
                          .multiply(Number(periodic.perLotAmount) || 0)
                          .format({ notation: "fixed" })
                          .done(),
                        precision
                      )}{" "}
                      {periodic.tokenName}
                    </span>
                  </p>
                </div>
              </div>
              <div className={c.order}>
                <div className={c.orderWrap}>
                  <div className={c.top}>
                    {isLogin ? (
                      <div className={c.flex}>
                        <span>
                          {this.lang("钱包可用额度")}
                          <em>{helper.digits(free, precision)}</em>
                          {periodic.tokenName}
                        </span>
                        <span className={c.link} onClick={this.recharge}>
                          {this.lang("充值")}
                        </span>
                      </div>
                    ) : (
                      <div className={c.flex}>
                        <span>
                          {this.lang("钱包可用额度")}
                          <em onClick={this.goLogin}>{this.lang("登录")}</em>
                          {this.lang("可见")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={c.top}>
                    <div className={c.flex}>
                      <span>{this.lang("当前可申购份数")}</span>
                      <span>
                        <em>{part || part === 0 ? part : "--"} </em>
                        {this.lang("份")}
                      </span>
                    </div>
                  </div>
                  <div className={c.top}>
                    <div className={c.flex}>
                      <span>{this.lang("申购份数")}</span>
                      <span>
                        {this.lang("1份")} = {periodic.perLotAmount}{" "}
                        {periodic.tokenName}
                      </span>
                    </div>
                  </div>
                  <FormGroup>
                    <FormControl className={c.order} error={hasError}>
                      <Input
                        className={c.input}
                        name="count"
                        value={count}
                        placeholder={intl.formatMessage(
                          { id: "{lowLot}份起购，整数倍递增" },
                          { lowLot: periodic.perUsrLowLots || 0 }
                        )}
                        error={hasError}
                        autoComplete="off"
                        endAdornment={
                          <InputAdornment position="end">
                            {this.lang("份")}
                          </InputAdornment>
                        }
                        onChange={this.change}
                      />
                      <FormHelperText className={c.helper}>
                        {errorText}
                      </FormHelperText>
                    </FormControl>
                    <FormControlLabel
                      className={c.select}
                      classes={{
                        label: c.label,
                      }}
                      control={
                        <Checkbox
                          color="primary"
                          checked={checked}
                          name="checked"
                          onChange={this.change}
                          classes={{
                            root: c.checkRoot,
                          }}
                        />
                      }
                      label={
                        <span>
                          <span
                            className={classnames({
                              [c.checkAlert]: this.state.checkAlert,
                            })}
                          >
                            {this.lang("我已阅读并同意")}
                          </span>
                          <a
                            className={c.agreement}
                            target="_blank"
                            rel="noopener noreferrer"
                            href={periodic.protocolUrl}
                          >
                            {this.lang("《协议》")}
                          </a>
                        </span>
                      }
                    />
                    {this.renderBtn()}
                  </FormGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={c.detail}>
          <div className={c.detail_con}>
            <div className={c.screenWidth}>
              <div className={c.detail_title}>{this.lang("项目进度")}</div>
              <div className={c.progress}>
                <Stepper activeStep={step} alternativeLabel>
                  <Step
                    classes={{
                      root: c.step_root,
                    }}
                    className={step >= 0 ? c.step_active : ""}
                  >
                    <StepLabel icon={<em>1</em>}>
                      {this.lang("申购截止时间")}
                      <span className="steps_span">
                        {moment(periodic.subscribeEndDate * 1).format(
                          "YYYY-MM-DD"
                        )}
                      </span>
                    </StepLabel>
                  </Step>
                  <Step
                    classes={{
                      root: c.step_root,
                    }}
                    className={step >= 1 ? c.step_active : ""}
                  >
                    <StepLabel icon={<em>2</em>}>
                      {this.lang("开始计息时间")}
                      <span className="steps_span">
                        {moment(periodic.interestStartDate * 1).format(
                          "YYYY-MM-DD"
                        )}
                      </span>
                    </StepLabel>
                  </Step>
                  <Step
                    classes={{
                      root: c.step_root,
                    }}
                    className={step >= 2 ? c.step_active : ""}
                  >
                    <StepLabel icon={<em>3</em>}>
                      {this.lang("到期时间")}
                      <span className="steps_span">
                        {moment(periodic.productEndDate * 1).format(
                          "YYYY-MM-DD"
                        )}
                      </span>
                    </StepLabel>
                  </Step>
                </Stepper>
              </div>
              <div
                className={classes.detail_title}
                // style={{ margin: "0 0 16px" }}
              >
                {this.lang("申购条件")}
              </div>
              {periodic.productDetails ? (
                <div
                  className={c.desc}
                  dangerouslySetInnerHTML={{
                    __html: helper.dataReform(
                      periodic.productDetails.replace(
                        /<script>|<\/script>/gi,
                        ""
                      )
                    ),
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Index));
