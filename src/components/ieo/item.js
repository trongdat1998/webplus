import React from "react";
import {
  Grid,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Divider,
  Paper,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import helper from "../../utils/helper";
import styles from "./style";
import moment from "moment";
import Icon from "@mdi/react";
import { mdiAlarm, mdiBallotOutline, mdiContactlessPayment } from "@mdi/js";
import { message } from "../../lib";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import classNames from "classnames";
import SenseCaptcha from "../public/sense_captcha"; // 极验
import CONST from "../../config/const";
import route_map from "../../config/route_map";
import GoogleCaptcha from "../public/google_captcha"; // google 验证

function deadlineFormat(t) {
  const n = Number(t);
  if (!n) {
    return [0, 0, 0, 0];
  }
  const d = Math.floor(n / (24 * 60 * 60 * 1000));
  const h = Math.floor((t - d * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
  const m = Math.floor(
    (t - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000) / (60 * 1000)
  );
  const s = Math.floor(
    (t - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000 - m * 60 * 1000) / 1000
  );
  return [d, h, m, s];
}

class ItemRC extends React.Component {
  constructor() {
    super();
    this.state = {
      timer: null,
      startTimeCountdown: 0,
      deadlineTime: 0,
      step: 0,
      count: "",
      isopen: false,
    };
    // 极验
    this.senseSuccess = this.senseSuccess.bind(this);
    this.senseError = this.senseError.bind(this);
    this.senseClose = this.senseClose.bind(this);
  }

  senseSuccess({ captcha_response, captcha_id, challenge }) {
    this.setState(
      {
        isopen: false,
        captcha_response,
        captcha_id,
        challenge,
        sendVerfiCode: true,
      },
      () => {
        let values = {
          captcha_response,
          captcha_id,
          challenge,
        };

        this.create_order(values);
      }
    );
  }

  // 极验 失败
  senseError(err) {
    this.setState({
      isopen: false,
    });
    message.error(err.msg);
  }
  // 极验，用户关闭
  senseClose() {
    this.setState({
      isopen: false,
    });
  }

  grecaptchaReset() {
    this.recaptcha.reset();
  }
  componentDidMount() {
    const projectCode = this.props.match.params.projectCode;
    if (helper.changeVersion() && projectCode) {
      window.location.href = "/activity/xo/?projectCode=" + projectCode;
      return;
    }
    if (projectCode) {
      this.init();
      this.run();
    }
  }
  init = () => {
    if (this.props.match.params.projectCode) {
      this.props.dispatch({
        type: "ieo/basic_info",
        payload: {
          projectCode: this.props.match.params.projectCode,
        },
      });
    }
    this.props.dispatch({
      type: "layout/getAccount",
      payload: {},
    });
  };
  componentWillReceiveProps(nextProps) {
    if (
      (!this.props.basic_info.startTimeCountdown &&
        nextProps.basic_info.startTimeCountdown) ||
      (!this.props.basic_info.deadlineTime && nextProps.basic_info.deadlineTime)
    ) {
      this.setState({
        startTimeCountdown: nextProps.basic_info.startTimeCountdown,
        deadlineTime: nextProps.basic_info.deadlineTime,
        step: (nextProps.basic_info.progressStatus || 1) - 1,
      });
    }
  }
  run = () => {
    if (
      Math.max(0, this.state.deadlineTime - 1000) > 0 &&
      Math.max(0, this.state.startTimeCountdown - 1000) == 0
    ) {
      let info = this.props.basic_info;
      info["progressStatus"] = 2;
      this.props.dispatch({
        type: "ieo/handleChange",
        payload: {
          basic_info: info,
        },
      });
    }
    this.setState(
      {
        startTimeCountdown: Math.max(0, this.state.startTimeCountdown - 1000),
        deadlineTime: Math.max(0, this.state.deadlineTime - 1000),
      },
      () => {
        setTimeout(this.run, 1000);
      }
    );
  };
  count = (e) => {
    let v = e.target.value;
    v =
      v && Number(`${v}`.replace(/\D/gi, ""))
        ? Math.floor(Number(`${v}`.replace(/\D/gi, "")))
        : "";
    if (v) {
      let [free, part] = this.getData();
      if (part && v > part) {
        v = part;
      }
    }
    this.setState({
      count: v,
    });
  };
  getData = () => {
    let free = 0;
    const user_balance = this.props.user_balance || [];
    const basic_info = this.props.basic_info || {};
    user_balance.map((item) => {
      if (item.tokenId == basic_info.purchaseTokenId) {
        free = item.free;
      }
    });
    let part =
      (Number(free) || Number(free) === 0) &&
      Number(basic_info.minPurchaseLimit)
        ? Math.min(
            Math.floor(
              Number(basic_info.userLimit) / Number(basic_info.minPurchaseLimit)
            ),

            Math.floor(Number(free) / Number(basic_info.minPurchaseLimit))
          )
        : "";
    return [free, part];
  };
  formSubmit = (e) => {
    this.setState({
      isopen: true,
      outTime: false,
    });
    if (this.recaptcha) {
      this.recaptcha.execute();
    } else {
      this.create_order({});
    }
  };
  create_order = (values) => {
    const basic_info = this.props.basic_info;
    this.props.dispatch({
      type: "ieo/create_order",
      payload: {
        projectCode: basic_info.projectCode,
        projectId: basic_info.projectId,
        amount: this.state.count,
        clientOrderId: new Date().getTime(),
        ...values,
      },
      success: () => {
        message.info(this.props.intl.formatMessage({ id: "下单成功" }));
        this.recaptcha && this.recaptcha.reset();
        this.init();
      },
      fail: (code, msg) => {
        this.recaptcha && this.recaptcha.reset();
        message.error(msg || this.props.intl.formatMessage({ id: "下单失败" }));
      },
    });
  };
  render() {
    const { classes } = this.props;
    const basic_info = this.props.basic_info || {};
    const activityType = basic_info.activityType || 0; // 1锁仓活动，2ioe，3抢购
    const step = this.state.step;
    let [free, part] = this.getData();
    const startTimeCountdown = deadlineFormat(this.state.startTimeCountdown);
    const deadlineTime = deadlineFormat(this.state.deadlineTime);
    return (
      <div className={classes.ieo}>
        <Grid container className={classes.s1} justify="space-between">
          <Grid item className={classes.s1_p1}>
            {basic_info.bannerUrl ? <img src={basic_info.bannerUrl} /> : ""}
          </Grid>
          <Grid item className={classes.s1_p2}>
            <h2>{basic_info.title}</h2>
            <span>{this.props.intl.formatMessage({ id: "发行价" })}</span>
            {Number(basic_info.receiveQuantity) &&
            Number(basic_info.valuationQuantity) ? (
              <h3>
                {basic_info.receiveQuantity} {basic_info.receiveTokenName} ={" "}
                {basic_info.valuationQuantity} {basic_info.purchaseTokenName}
              </h3>
            ) : (
              <h3>{this.props.intl.formatMessage({ id: "待定" })}</h3>
            )}
            <span>{this.props.intl.formatMessage({ id: "分配总量" })}</span>
            {basic_info.circulationStr ? (
              <h4>{basic_info.circulationStr}</h4>
            ) : (
              <h4>
                {basic_info.totalReceiveCirculation}{" "}
                {basic_info.receiveTokenName}
              </h4>
            )}
            <Grid container justify="space-between">
              <Grid item>
                {this.props.intl.formatMessage({ id: "申购币种" })}
              </Grid>
              <Grid item>{basic_info.purchaseTokenName}</Grid>
            </Grid>
            <Grid container justify="space-between">
              <Grid item>
                {this.props.intl.formatMessage({ id: "开始申购时间" })}
              </Grid>
              <Grid item>
                {moment(basic_info.startTime * 1).format("YYYY-MM-DD HH:mm:ss")}
              </Grid>
            </Grid>
            <Grid container justify="space-between">
              <Grid item>
                {this.props.intl.formatMessage({ id: "结束申购时间" })}
              </Grid>
              <Grid item>
                {moment(basic_info.endTime * 1).format("YYYY-MM-DD HH:mm:ss")}
              </Grid>
            </Grid>
            <Grid container justify="space-between">
              <Grid item>
                {this.props.intl.formatMessage({ id: "预计上线时间" })}
              </Grid>
              <Grid item>
                {Number(basic_info.onlineTime)
                  ? moment(basic_info.onlineTime * 1).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : Number(basic_info.onlineTime) == 0
                  ? this.props.intl.formatMessage({ id: "待定" })
                  : ""}
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.s1_p3}>
            <div className={classes.timer}>
              {basic_info.progressStatus == 1 ? (
                <React.Fragment>
                  <div>
                    <Icon
                      path={mdiAlarm}
                      size={0.8}
                      horizontal
                      color="#F69400"
                    />
                    {this.props.intl.formatMessage({ id: "距离开始还剩" })}:
                    {startTimeCountdown[0]}
                    {this.props.intl.formatMessage({ id: "天" })}
                    {startTimeCountdown[1]}
                    {this.props.intl.formatMessage({ id: "时" })}
                    {startTimeCountdown[2]}
                    {this.props.intl.formatMessage({ id: "分" })}
                    {startTimeCountdown[3]}
                    {this.props.intl.formatMessage({ id: "秒" })}
                  </div>
                  <div />
                </React.Fragment>
              ) : (
                ""
              )}
              {basic_info.progressStatus == 2 ? (
                <React.Fragment>
                  <div>
                    <Icon
                      path={mdiAlarm}
                      size={0.8}
                      horizontal
                      color="#F69400"
                    />
                    {this.props.intl.formatMessage({ id: "距离结束还剩" })}:
                    {deadlineTime[0]}
                    {this.props.intl.formatMessage({ id: "天" })}
                    {deadlineTime[1]}
                    {this.props.intl.formatMessage({ id: "时" })}
                    {deadlineTime[2]}
                    {this.props.intl.formatMessage({ id: "分" })}
                    {deadlineTime[3]}
                    {this.props.intl.formatMessage({ id: "秒" })}
                  </div>
                  <div />
                </React.Fragment>
              ) : (
                ""
              )}
              {basic_info.progressStatus == 3 ? (
                <React.Fragment>
                  <div>
                    <Icon
                      path={mdiBallotOutline}
                      size={0.8}
                      horizontal
                      color="#F69400"
                    />
                    {this.props.intl.formatMessage({ id: "结果计算中" })}
                  </div>
                  <div />
                </React.Fragment>
              ) : (
                ""
              )}
              {basic_info.progressStatus == 4 ? (
                <React.Fragment>
                  <div>
                    <Icon
                      path={mdiContactlessPayment}
                      size={0.8}
                      horizontal
                      rotate={180}
                      color="#F69400"
                    />
                    {this.props.intl.formatMessage({ id: "公布结果" })}
                  </div>
                  <div />
                </React.Fragment>
              ) : (
                ""
              )}
              {basic_info.progressStatus == 5 ? (
                <React.Fragment>
                  <div>
                    <Icon
                      path={mdiBallotOutline}
                      size={0.8}
                      horizontal
                      rotate={180}
                      color="#F69400"
                    />
                    {this.props.intl.formatMessage({ id: "已结束" })}
                  </div>
                  <div />
                </React.Fragment>
              ) : (
                ""
              )}
            </div>
            {Number(basic_info.progressStatus) < 4 ? (
              <React.Fragment>
                <Grid
                  container
                  justify="space-between"
                  className={classes.p3_2}
                >
                  <Grid item>
                    {this.props.intl.formatMessage({ id: "钱包可用额度" })}
                  </Grid>
                  <Grid item>
                    {free} {basic_info.purchaseTokenName}
                  </Grid>
                </Grid>
                <Grid
                  container
                  justify="space-between"
                  className={classes.p3_2}
                >
                  <Grid item>
                    {this.props.intl.formatMessage({ id: "当前可申购份数" })}
                  </Grid>
                  <Grid item>
                    {part || part === 0 ? part : "--"}{" "}
                    {this.props.intl.formatMessage({ id: "份" })}
                  </Grid>
                </Grid>
                <Grid
                  container
                  justify="space-between"
                  className={classes.p3_2}
                >
                  <Grid item>
                    {this.props.intl.formatMessage({ id: "申购份数" })}
                  </Grid>
                  <Grid item>
                    ({this.props.intl.formatMessage({ id: "1份" })}=
                    {basic_info.minPurchaseLimit}
                    {basic_info.purchaseTokenName})
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  value={this.state.count}
                  onChange={this.count}
                  placeholder={this.props.intl.formatMessage({
                    id: "1份起购，整数倍递增",
                  })}
                />
                <Grid
                  container
                  justify="space-between"
                  className={classes.p3_2}
                >
                  <Grid item />
                  <Grid item>
                    <a href={`/finance/deposit/${basic_info.purchaseTokenId}`}>
                      {this.props.intl.formatMessage({ id: "充值" })}
                    </a>
                  </Grid>
                </Grid>
                {this.props.userinfo && this.props.userinfo.userId ? (
                  basic_info.status == 1 &&
                  basic_info.progressStatus == 2 &&
                  !this.props.ordering &&
                  this.state.count &&
                  !this.state.isopen ? (
                    <Button
                      color="primary"
                      variant="contained"
                      className={classes.buy_btn}
                      onClick={this.formSubmit}
                      fullWidth
                    >
                      {this.props.intl.formatMessage({ id: "确认申购" })}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      className={classes.buy_btn}
                      disabled
                      fullWidth
                    >
                      {this.props.intl.formatMessage({
                        id:
                          basic_info.progressStatus == 1
                            ? "敬请期待"
                            : "确认申购",
                      })}
                    </Button>
                  )
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    className={classes.buy_btn2}
                    fullWidth
                    href={
                      "/login?redirect=" +
                      encodeURIComponent(window.location.href)
                    }
                  >
                    {this.props.intl.formatMessage({ id: "登录" })}
                  </Button>
                )}
              </React.Fragment>
            ) : (
              ""
            )}
            {Number(basic_info.progressStatus == 4) ? (
              <React.Fragment>
                <Grid
                  container
                  justify="space-between"
                  spacing={1}
                  className={classes.result}
                >
                  <Grid item xs={6}>
                    <Paper className={classes.result_title}>
                      <span>
                        {this.props.intl.formatMessage({ id: "项目目标申购" })}
                      </span>
                      <strong>
                        {basic_info.totalCirculation}{" "}
                        {basic_info.purchaseTokenName}
                      </strong>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper className={classes.result_title}>
                      <span>
                        {this.props.intl.formatMessage({ id: "实际申购" })}
                      </span>
                      <strong>
                        {basic_info.soldAmount
                          ? Number(basic_info.soldAmount)
                          : basic_info.soldAmount}
                        {basic_info.purchaseTokenName}
                      </strong>
                    </Paper>
                  </Grid>
                </Grid>
                {this.props.userinfo && this.props.userinfo.userId ? (
                  Number(basic_info.useAmount) ||
                  Number(basic_info.backAmount) ? (
                    <Paper
                      className={classNames(
                        classes.result_con,
                        classes.result_bg
                      )}
                    >
                      <strong>
                        {this.props.intl.formatMessage({ id: "恭喜您获得" })}
                      </strong>
                      <h2>
                        {this.props.intl.formatMessage(
                          {
                            id: "{useAmount}{purchaseTokenId}申购份额，价值{luckyAmount}{receiveTokenId}",
                          },
                          {
                            useAmount: basic_info.useAmount,
                            purchaseTokenId: basic_info.purchaseTokenName,
                            luckyAmount: basic_info.luckyAmount,
                            receiveTokenId: basic_info.receiveTokenName,
                          }
                        )}
                      </h2>
                      <span>
                        {this.props.intl.formatMessage(
                          {
                            id: "剩余{backAmount}{purchaseTokenId}将自动解冻",
                          },
                          {
                            backAmount: basic_info.backAmount,
                            purchaseTokenId: basic_info.purchaseTokenName,
                          }
                        )}
                      </span>
                    </Paper>
                  ) : (
                    <Paper className={classes.result_con}>
                      <p>
                        {this.props.intl.formatMessage({
                          id: "您未参与此次申购",
                        })}
                      </p>
                    </Paper>
                  )
                ) : (
                  <Paper className={classes.result_con}>
                    <p>
                      <a
                        href={
                          route_map.login +
                          "?redirect=" +
                          encodeURIComponent(window.location.href)
                        }
                      >
                        {this.props.intl.formatMessage({ id: "请先登录" })}
                      </a>
                    </p>
                  </Paper>
                )}
                {this.props.userinfo &&
                this.props.userinfo.userId &&
                (Number(basic_info.useAmount) ||
                  Number(basic_info.backAmount)) ? (
                  <div className={classes.finance}>
                    <FormattedHTMLMessage
                      id="请在<a href='/finance/'>钱包账户</a>查看资产"
                      tagName="p"
                    />
                  </div>
                ) : (
                  ""
                )}
              </React.Fragment>
            ) : (
              ""
            )}
            {Number(basic_info.progressStatus == 5) ? (
              <Paper className={classes.result_con2}>
                <img
                  src={require("../../assets/ieo_end.png")}
                  style={{ height: "100px" }}
                />
              </Paper>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
        <Divider />
        {activityType == 2 ? (
          <div className={classes.title}>
            <span />
            {this.props.intl.formatMessage({ id: "申购周期" })}
          </div>
        ) : (
          ""
        )}
        {activityType == 2 ? (
          <div className={classes.progress}>
            <Stepper activeStep={step} alternativeLabel>
              <Step className={step >= 0 ? classes.connectorCompleted : ""}>
                <StepLabel>
                  {this.props.intl.formatMessage({ id: "项目预热" })}
                </StepLabel>
              </Step>
              <Step className={step >= 1 ? classes.connectorCompleted : ""}>
                <StepLabel>
                  {this.props.intl.formatMessage({ id: "开始申购" })}
                  <span className="steps_span">
                    {moment(basic_info.startTime * 1).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </span>
                </StepLabel>
              </Step>
              <Step className={step >= 2 ? classes.connectorCompleted : ""}>
                <StepLabel>
                  {this.props.intl.formatMessage({ id: "结束申购" })}
                  <span className="steps_span">
                    {moment(basic_info.endTime * 1).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </span>
                </StepLabel>
              </Step>
              <Step className={step >= 3 ? classes.connectorCompleted : ""}>
                <StepLabel>
                  {this.props.intl.formatMessage({ id: "公布结果" })}
                  <span className="steps_span">
                    {moment(basic_info.resultTime * 1).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </span>
                </StepLabel>
              </Step>
            </Stepper>
          </div>
        ) : (
          ""
        )}
        <div className={classes.title}>
          <span />
          {this.props.intl.formatMessage({ id: "项目详情" })}
        </div>
        {basic_info.description ? (
          <div
            className={classes.desc}
            dangerouslySetInnerHTML={{ __html: basic_info.description }}
          />
        ) : (
          ""
        )}
        {CONST.CAPTCHA_TYPE == CONST.CAPTCHA_TYPES.SENSE ? (
          <SenseCaptcha
            type="2"
            geetestData={this.props.geetestData}
            dispatch={this.props.dispatch}
            lang={window.localStorage.lang === "zh-cn" ? "zh-cn" : "en"}
            onSuccess={this.senseSuccess}
            onError={this.senseError}
            onClose={this.senseClose}
            ref={(ref) => (this.recaptcha = ref)}
          />
        ) : (
          <GoogleCaptcha
            ref={(ref) => (this.recaptcha = ref)}
            onSuccess={this.senseSuccess}
            onError={this.senseError}
            badge="bottomright"
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(ItemRC));
