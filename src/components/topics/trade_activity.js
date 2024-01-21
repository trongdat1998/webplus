import React from "react";
import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { injectIntl } from "react-intl";
import { Date } from "core-js";
import Cookie from "../../utils/cookie";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import TextFieldCN from "../public/textfiled";
import { Iconfont } from "../../lib";
import classnames from "classnames";

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

class TradeRC extends React.Component {
  constructor() {
    super();
    this.state = {
      timer: null,
      endTime: 0,
      tab: 0,
      tabs: [
        {
          i: 3,
          name: "今日收益率排行榜",
        },
        {
          i: 1,
          name: "总收益率排行榜",
        },
        {
          i: 4,
          name: "今日收益额排行榜",
        },
        {
          i: 2,
          name: "总收益额排行榜",
        },
      ],
      status: 0, // 0 活动页，1 报名页， 2 报名结果
      error: false,
    };
  }

  componentDidMount() {
    const ua = window.navigator.userAgent;
    const competitionCode = this.props.match.params.competitionCode;
    const pathname = window.location.pathname;
    if (/iphone|android|ipad/i.test(ua) && competitionCode) {
      window.location.href = "/m" + pathname;
    }
    if (competitionCode) {
      this.init();
      this.run();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.info && !this.props.info.endTime && nextProps.info.endTime) {
      this.setState({
        endTime: nextProps.info.endTime - Date.now(),
      });
    }
  }
  init = () => {
    let competitionCode = this.props.match.params.competitionCode;
    if (competitionCode) {
      if (this.props.userinfo && this.props.userinfo.userId) {
        this.props.dispatch({
          type: "topic/personal_info",
          payload: {
            competitionCode: competitionCode,
          },
        });
      }
      this.props.dispatch({
        type: "topic/info",
        payload: {
          competitionCode: competitionCode,
          rankType: 0,
        },
        callback: (tab) => {
          this.setState({
            tab: tab,
          });
        },
      });
    }
  };
  run = () => {
    this.setState(
      {
        endTime: Math.max(0, this.state.endTime - 1000),
      },
      () => {
        setTimeout(this.run, 1000);
      }
    );
  };
  changeTab(tab) {
    this.setState({
      tab: tab,
    });
    this.props.dispatch({
      type: "topic/info",
      payload: {
        competitionCode: this.props.match.params.competitionCode,
        rankType: tab,
      },
    });
  }
  goToSignUp() {
    this.setState({
      status: 1,
    });
  }
  change(e) {
    const { name, value } = e.target;
    if (name === "nickname") {
      this.setState({
        error: false,
      });
    }
    this.setState({
      [name]: value,
    });
  }
  signUp() {
    let { nickname, wechat, tab } = this.state;
    const competitionCode = this.props.match.params.competitionCode;
    const that = this;
    if (!helper.trim(nickname)) {
      this.setState({
        error: true,
      });
      return;
    }
    this.props.dispatch({
      type: "topic/sign_up",
      payload: {
        nickName: helper.trim(nickname),
        wechat: helper.trim(wechat),
        competitionCode,
      },
      callback: () => {
        that.setState({
          status: 2,
        });
      },
    });
  }
  back() {
    let { tab } = this.state;
    const competitionCode = this.props.match.params.competitionCode;
    this.props.dispatch({
      type: "topic/info",
      payload: {
        competitionCode,
        rankType: tab,
      },
    });
    this.setState({ status: 0 });
  }
  renderItem = () => {
    const { classes, intl } = this.props;
    const orderImg = [
      require(`../../assets/first.png`),
      require(`../../assets/second.png`),
      require(`../../assets/third.png`),
    ];
    if (
      this.props.loading.effects &&
      this.props.loading.effects["topic/info"]
    ) {
      return (
        <TableRow>
          <TableCell
            className={classes.noborder}
            colSpan="5"
            style={{ height: 40 * 10 + "px" }}
          >
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ height: 40 * 10 + "px" }}
            >
              <CircularProgress className={classes.loading} />
            </Grid>
          </TableCell>
        </TableRow>
      );
    }
    if (!this.props.rankList || !this.props.rankList.length) {
      return (
        <TableRow>
          <TableCell
            className={classes.noborder}
            colSpan="5"
            style={{ height: 40 * 10 + "px" }}
          >
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ height: 40 * 10 + "px" }}
            >
              <div className={classes.noData}>
                <img alt="" src={require("../../assets/noData.png")} />
                <p>{intl.formatMessage({ id: "暂无记录" })}</p>
              </div>
            </Grid>
          </TableCell>
        </TableRow>
      );
    }
    return (
      <React.Fragment>
        {this.props.rankList.map((row, key) => {
          let userId = row.userId;
          userId =
            userId.length > 10
              ? userId.substr(0, 5) +
                new Array(userId.length - 9).join("*") +
                userId.substr(-5)
              : userId;
          let rate = (row.rate * 100).toFixed(2); // 收益率
          return (
            <TableRow tabIndex={-1} key={key}>
              <TableCell>
                {key < 3 ? <img src={orderImg[key]} /> : <span>{key + 1}</span>}
              </TableCell>
              <TableCell>{userId}</TableCell>
              <TableCell>
                <p>{row.nickname}</p>
              </TableCell>
              {[1, 3].indexOf(this.state.tab) > -1 ? (
                <TableCell className={row.rate < 0 ? classes.down : classes.up}>
                  {(row.rate > 0 ? "+" : "") + rate}%
                </TableCell>
              ) : (
                ""
              )}
              {[2, 4].indexOf(this.state.tab) > -1 ? (
                <TableCell
                  className={row.incomeAmount < 0 ? classes.down : classes.up}
                >
                  {(row.incomeAmount > 0 ? "+" : "") +
                    helper.digits(row.incomeAmount, 8)}
                </TableCell>
              ) : (
                ""
              )}
            </TableRow>
          );
        })}
      </React.Fragment>
    );
  };
  renderStatus = () => {
    const { classes, intl } = this.props;
    if (!Cookie.read("account_id")) {
      return (
        <Grid className={classes.status}>
          <p>
            <em></em>
            {intl.formatMessage({ id: "未登录" })}，
            <a
              href={
                route_map.login +
                "?redirect=" +
                encodeURIComponent(window.location.href)
              }
            >
              {intl.formatMessage({ id: "立即登录" })}
            </a>
            <em></em>
          </p>
        </Grid>
      );
    } else if (this.props.info.isWhite) {
      return (
        <Grid className={classes.status}>
          <p>
            <em></em>
            {intl.formatMessage({ id: "已获得参赛资格" })}
            <em></em>
          </p>
        </Grid>
      );
    } else if (!this.props.info.isWhite) {
      return (
        <Grid className={classes.status}>
          <p>
            <em></em>
            {intl.formatMessage({ id: "暂未获得参赛资格" })}，
            <a onClick={this.goToSignUp.bind(this)}>
              {intl.formatMessage({ id: "立即报名>>" })}
            </a>
            <em></em>
          </p>
        </Grid>
      );
    }
  };
  render() {
    const { classes, intl } = this.props;
    let {
      earningsAmountTotal,
      earningsAmountToday,
      earningsRateTotal,
      earningsRateToday,
    } = this.props;
    let columns = [
      { id: "order", label: "排名" },
      { id: "userId", label: "用户ID" },
      { id: "nickname", label: "昵称" },
    ];
    let columnMap = {
      1: { id: "rate", label: "总收益率" },
      2: { id: "incomeAmount", label: "总收益额" },
      3: { id: "rate", label: "今日收益率" },
      4: { id: "incomeAmount", label: "今日收益额" },
    };
    if (this.state.tab) {
      columns.push(columnMap[this.state.tab]);
    }
    const endTime = deadlineFormat(this.state.endTime);
    let totalRate = (earningsRateTotal * 100).toFixed(2);
    let todayRate = (earningsRateToday * 100).toFixed(2);
    let userId = this.props.userinfo && this.props.userinfo.userId;
    return (
      <div className={classes.trade}>
        <Grid
          className={classes.banner}
          style={{
            backgroundImage: `url(${this.props.info.bannerUrl})`,
          }}
        >
          {/* <img src={this.props.info.bannerUrl} /> */}
        </Grid>
        {this.state.status == 1 ? (
          <div>
            <div className={classes.status}>
              <p>
                <em></em>
              </p>
            </div>
            <div className={classnames(classes.sign_up, classes.bg)}>
              <h2>{intl.formatMessage({ id: "参赛报名" })}</h2>
              <div>
                <TextFieldCN
                  name="nickname"
                  value={this.state.nickname}
                  onChange={this.change.bind(this)}
                  className={classes.text}
                  variant="outlined"
                  autoComplete="off"
                  error={this.state.error}
                  placeholder={intl.formatMessage({ id: "昵称" })}
                  InputProps={{
                    classes: {
                      root: classes.root,
                      input: classes.input,
                    },
                  }}
                />
                <TextFieldCN
                  name="wechat"
                  value={this.state.wechat}
                  onChange={this.change.bind(this)}
                  className={classes.text}
                  variant="outlined"
                  autoComplete="off"
                  placeholder={intl.formatMessage({
                    id: "微信/Telegram（选填）",
                  })}
                  InputProps={{
                    classes: {
                      root: classes.root,
                      input: classes.input,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={this.signUp.bind(this)}
                >
                  {intl.formatMessage({ id: "报名" })}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.status == 2 ? (
          <div>
            <div className={classes.status}>
              <p>
                <em></em>
              </p>
            </div>
            <div className={classnames(classes.result, classes.bg)}>
              <div>
                <Iconfont type="check" size="66" />
                <h2>{intl.formatMessage({ id: "报名成功" })}</h2>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={this.back.bind(this)}
                >
                  {intl.formatMessage({ id: "返回" })}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.status == 0 ? (
          <div>
            {this.renderStatus()}
            <Grid container className={classes.info}>
              <Grid item xs={6} className={classes.personal_info}>
                <div className={classes.t1}>
                  <p>{intl.formatMessage({ id: "我的成绩" })}</p>
                </div>
                <ul>
                  <li>
                    <label>
                      {intl.formatMessage({ id: "总收益额" })}(
                      {this.props.tradeToken})
                    </label>
                    {userId ? (
                      <p>
                        {helper.digits(earningsAmountTotal, 8)}{" "}
                        {this.props.tradeToken}
                      </p>
                    ) : (
                      <p>--</p>
                    )}
                  </li>
                  <li>
                    <label>
                      {intl.formatMessage({ id: "今日收益额" })}(
                      {this.props.tradeToken})
                    </label>
                    {userId ? (
                      <p>
                        {helper.digits(earningsAmountToday, 8)}{" "}
                        {this.props.tradeToken}
                      </p>
                    ) : (
                      <p>--</p>
                    )}
                  </li>
                  <li>
                    <label>{intl.formatMessage({ id: "总收益率" })}</label>
                    {userId ? (
                      <p
                        className={
                          earningsRateTotal < 0 ? classes.down : classes.up
                        }
                      >
                        {(earningsRateTotal > 0 ? "+" : "") + totalRate}%
                      </p>
                    ) : (
                      <p>--</p>
                    )}
                  </li>
                  <li>
                    <label>{intl.formatMessage({ id: "今日收益率" })}</label>
                    {userId ? (
                      <p
                        className={
                          earningsRateToday < 0 ? classes.down : classes.up
                        }
                      >
                        {(earningsRateToday > 0 ? "+" : "") + todayRate}%
                      </p>
                    ) : (
                      <p>--</p>
                    )}
                  </li>
                </ul>
              </Grid>
              <Grid item xs={6} className={classes.time}>
                <div className={classes.t1}>
                  <p>{intl.formatMessage({ id: "结束倒计时" })}</p>
                </div>
                <div className={classes.t2}>
                  <div>
                    <em></em>
                    <p>
                      {endTime[0]}
                      <span>{intl.formatMessage({ id: "天" })}</span>
                    </p>
                  </div>
                  <em>:</em>
                  <div>
                    <em></em>
                    <p>
                      {endTime[1]}
                      <span>{intl.formatMessage({ id: "时" })}</span>
                    </p>
                  </div>
                  <em>:</em>
                  <div>
                    <em></em>
                    <p>
                      {endTime[2]}
                      <span>{intl.formatMessage({ id: "分" })}</span>
                    </p>
                  </div>
                  <em>:</em>
                  <div>
                    <em></em>
                    <p>
                      {endTime[3]}
                      <span>{intl.formatMessage({ id: "秒" })}</span>
                    </p>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid className={classes.list}>
              <div className={classes.tabs}>
                {this.state.tabs.map((item, i) => {
                  return this.props.rankTypes.indexOf(item.i) > -1 ? (
                    <p
                      key={i}
                      className={this.state.tab == item.i ? "active" : ""}
                      onClick={this.changeTab.bind(this, item.i)}
                    >
                      <span>{intl.formatMessage({ id: item.name })}</span>
                    </p>
                  ) : (
                    ""
                  );
                })}
              </div>
              <div>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns.map((item) => (
                        <TableCell
                          key={item.id}
                          style={{ minWidth: item.minWidth }}
                        >
                          {intl.formatMessage({ id: item.label })}
                          {item.id == "incomeAmount"
                            ? `(${this.props.tradeToken})`
                            : ""}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>{this.renderItem()}</TableBody>
                </Table>
              </div>
            </Grid>
            <Grid className={classes.rule}>
              <h3>{intl.formatMessage({ id: "活动规则" })}</h3>
              {this.props.info && this.props.info.description ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.props.info.description,
                  }}
                />
              ) : (
                ""
              )}
            </Grid>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TradeRC));
