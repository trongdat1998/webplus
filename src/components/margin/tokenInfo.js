// 币对信息
import React from "react";
import helper from "../../utils/helper";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Popover,
  Paper,
  CircularProgress,
  ClickAwayListener,
  Grid,
  Switch,
} from "@material-ui/core";
import { Iconfont } from "../../lib";
import CONST from "../../config/const";
import { withStyles } from "@material-ui/core/styles";
import styles from "../public/quote_style";
import WSDATA from "../../models/data_source";

let timer = null;
class TokenInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null,
      timer: null,
      chartType: "kline",
      mode: localStorage.quoteMode == "Dark",
    };
    this.change = this.change.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    const token1 = (this.props.match.params.token1 || "").toUpperCase();
    if (token1) {
      this.getTokenInfo(token1);
    }
    this.init();
  }
  init = () => {
    const token1 = (this.props.match.params.token1 || "").toUpperCase();
    const token2 = (this.props.match.params.token2 || "").toUpperCase();
    const token1_name = this.props.config.tokens[token1]
      ? this.props.config.tokens[token1]["tokenName"]
      : "";
    const token2_name = this.props.config.tokens[token2]
      ? this.props.config.tokens[token2]["tokenName"]
      : "";
    const symbol_info = this.props.config.symbols[token1 + token2] || {};

    const symbol_id = symbol_info["symbolId"];

    const exchange_id = symbol_info["exchangeId"];
    const tokenInfo = this.props.symbol_quote[symbol_id] || {};

    this.props.dispatch({
      type: "lever/save",
      payload: {
        token1,
        token1_name,
        token2,
        token2_name,
        exchange_id,
        symbol_id,
        symbol_info,
        sale_quantity: "",
        sale_price: tokenInfo.c || "",
        sale_progress: 0,
        buy_quantity: "",
        buy_price: tokenInfo.c || "",
        buy_progress: 0,

        digitMerge: (symbol_info.digitMerge || "").split(","),
        aggTrade_digits: CONST.depth[symbol_info.minPricePrecision],
        max_digits: CONST.depth[symbol_info.minPricePrecision],
        base_precision: CONST.depth[symbol_info.basePrecision], // 数量精度 如 8 表示小数留8位
        quote_precision: CONST.depth[symbol_info.quotePrecision], // 金额精度 如 8 表示小数留8位
        min_price_precision: symbol_info.minPricePrecision, // 价格交易step, 如 0.1
        min_trade_quantity: symbol_info.minTradeQuantity, // 数量交易step 如 0.1
        min_trade_amount: symbol_info.minTradeAmount, // 金额交易step  如 0.1
      },
    });

    this.props.dispatch({
      type: "lever/sell_config",
      payload: {
        exchange_id,
        symbol_id,
      },
    });
  };
  getTokenInfo = (token_id) => {
    if (!token_id || this.state[token_id]) {
      return;
    }
    this.props.dispatch({
      type: "lever/token_info",
      payload: {
        token_id,
      },
      callback: (data) => {
        this.setState({
          [token_id]: data,
        });
      },
    });
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.token1 !== nextProps.token1) {
      this.getTokenInfo(nextProps.token1);
      //this.init();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const loading =
      this.props.loading && this.props.loading.effects
        ? this.props.loading.effects
        : {};
    const nextloading =
      nextProps.loading && nextProps.loading.effects
        ? nextProps.loading.effects
        : {};
    if (loading["layout/get_rates"] != nextloading["layout/get_rates"]) {
      return true;
    }
    return true;
  }
  change(t) {
    this.props.dispatch({
      type: "lever/save",
      payload: {
        chartType: t,
      },
    });
  }
  clear = () => {
    timer && clearTimeout(timer);
  };
  handlePopoverOpen = (e) => {
    this.clear();
    this.setState({
      anchorEl: e.target,
    });
  };
  handlePopoverClose = () => {
    this.clear();
    timer = setTimeout(() => {
      this.setState({
        anchorEl: null,
      });
    }, 200);
  };
  handleChange = () => {
    if (this.props.tvwidget && this.props.tvwidget._ready) {
      let check = this.state.mode;
      localStorage.quoteMode = check ? "Light" : "Dark";
      this.setState({
        mode: !check,
      });
      this.props.dispatch({
        type: "lever/save",
        payload: {
          quoteMode: localStorage.quoteMode,
        },
      });
    }
  };
  update = async () => {
    const data = WSDATA.getData("symbol_quote_source");
    const symbol_id = this.props.symbol_id;
    const digitMerge = this.props.max_digits;
    if (this.currentRef && this.currentRef2 && symbol_id && data[symbol_id]) {
      const item = data[symbol_id];
      const c = item.c && digitMerge;
      const cRates = helper.currencyValue(
        this.props.rates,
        item ? item.c : 0,
        this.props.token2,
        window.localStorage.unit,
        true
      );
      this.currentRef.innerHTML = item.c
        ? helper.digits(item.c, digitMerge)
        : "";
      this.currentRef3.innerHTML = "≈ " + (cRates[1] || "-") + " " + cRates[2];
      this.currentRef2.innerHTML =
        (Number(item.m) > 0 ? "+" : "") + Number(item.m)
          ? Math.floor(Number(item.m) * 10000) / 100 + "%"
          : "0.00%";
      document.title =
        c +
        "≈" +
        cRates[0] +
        cRates[1] +
        " " +
        this.props.token1_name +
        "/" +
        this.props.token2_name +
        " | " +
        (this.props.index_config.title || "");
    }
    await helper.delay(CONST.refresh);
    this.update();
  };
  render() {
    const { classes } = this.props;
    if (!this.props.match.params.token1 || !this.props.match.params.token2) {
      return <div className={classes.tokenInfo} />;
    }
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const token1 = this.props.match.params.token1.toUpperCase();
    const token2 = this.props.match.params.token2.toUpperCase();
    const tokenInfo = symbol_quote[token1 + token2] || {};
    const symbol_info =
      this.props.config.symbols_obj.lever[token1 + token2] || {};
    const token1_name = this.props.config.tokens[token1]
      ? this.props.config.tokens[token1]["tokenName"]
      : "";
    const token2_name = this.props.config.tokens[token2]
      ? this.props.config.tokens[token2]["tokenName"]
      : "";
    let cRates = ["", "", ""];
    let cRates2 = helper.currencyValue(
      this.props.rates,
      tokenInfo.qv,
      token2,
      window.localStorage.unit,
      true
    );
    if (tokenInfo.c && token1_name) {
      cRates = helper.currencyValue(
        this.props.rates,
        tokenInfo.c,
        token2,
        window.localStorage.unit,
        true
      );
      document.title =
        tokenInfo.c +
        "≈" +
        cRates[0] +
        cRates[1] +
        " " +
        token1_name +
        "/" +
        token2_name +
        " | " +
        (this.props.index_config.title || "");
    }
    const token_info = this.state[token1] ? this.state[token1] : {};
    const lineColor = helper.hex_to_rgba(
      window.palette2[localStorage.quoteMode].grey[500],
      0.5
    );
    return (
      <div className={classes.tokenInfo}>
        <div className={classes.symbol_name}>
          <em
            onMouseEnter={this.handlePopoverOpen}
            onMouseLeave={this.handlePopoverClose}
          >
            <Iconfont type="brief" size="20" />
            {token1_name}
          </em>
          /{token2_name}
          <p>
            <FormattedMessage id="成交量" />:
            {tokenInfo.v ? helper.digits(tokenInfo.v, 2) : ""}
            {token1_name}
          </p>
        </div>
        <div className={classes.info}>
          <div>
            <span
              className={
                Number(tokenInfo.c) >= Number(tokenInfo.o)
                  ? classes.up
                  : classes.down
              }
              style={{ fontSize: "16px", fontWeight: 500 }}
              ref={(ref) => (this.currentRef = ref)}
            >
              {helper.digits(
                tokenInfo.c,
                CONST["depth"][symbol_info.minPricePrecision || 8]
              )}
            </span>
            <br />
            <i ref={(ref) => (this.currentRef3 = ref)}>
              {tokenInfo.c && this.props.rates[token2]
                ? `≈${cRates[1]} ${cRates[2]}`
                : ""}
            </i>
          </div>
          <div>
            <span>
              24H
              {this.props.intl.formatMessage({ id: "涨跌" })}
            </span>
            <br />
            {tokenInfo.c && Number(tokenInfo.o) ? (
              <i
                className={
                  tokenInfo.c - tokenInfo.o >= 0 ? classes.up : classes.down
                }
                ref={(ref) => (this.currentRef2 = ref)}
              >
                {Number(tokenInfo.m) > 0 ? "+" : ""}
                {Number(tokenInfo.m)
                  ? helper.format(
                      Math.floor(Number(tokenInfo.m) * 10000) / 100,
                      2
                    ) + "%"
                  : "0.00%"}
              </i>
            ) : (
              ""
            )}
          </div>
          <div>
            <span>
              24H
              {this.props.intl.formatMessage({ id: "高" })}
            </span>
            <br />
            {helper.digits(tokenInfo.h, this.props.max_digits)}
          </div>
          <div>
            <span>
              24H
              {this.props.intl.formatMessage({ id: "低" })}
            </span>
            <br />
            {helper.digits(tokenInfo.l, this.props.max_digits)}
          </div>
          <div>
            <span>
              24H
              {this.props.intl.formatMessage({ id: "成交额" })}
            </span>
            <br />
            {cRates2[1]} {cRates2[2]}
          </div>
        </div>
        <div className={classes.switch}>
          <Switch
            checked={this.state.mode}
            color="primary"
            name="mode"
            value="mode"
            checkedIcon={<Iconfont type="dark" size="16" />}
            icon={<Iconfont type="whiite" size="16" />}
            onClick={this.handleChange}
          />
        </div>

        <Popover
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={this.handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          className={classes.popover}
          disableRestoreFocus
        >
          <ClickAwayListener onClickAway={this.handlePopoverClose}>
            <Paper
              className={classes.token_info}
              onMouseEnter={this.clear}
              onMouseLeave={this.handlePopoverClose}
            >
              {!token_info["tokenName"] ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 370,
                    width: 630,
                  }}
                >
                  <CircularProgress color="primary" fontSize="20" />
                </div>
              ) : (
                <div>
                  <div
                    className={classes.token_info_title}
                    style={{
                      borderBottom: `1px solid ${lineColor}`,
                    }}
                  >
                    <p>{this.props.intl.formatMessage({ id: "币种简介" })}</p>
                  </div>
                  <div
                    style={{
                      padding: "0 24px",
                    }}
                  >
                    <Grid
                      container
                      className={classes.token_info_link}
                      justify="space-between"
                      style={{
                        borderBottom: `1px solid ${lineColor}`,
                      }}
                    >
                      <Grid item>
                        {this.props.config.tokens[token1] ? (
                          <img
                            src={this.props.config.tokens[token1]["iconUrl"]}
                          />
                        ) : (
                          ""
                        )}
                        <br />
                        <p>{token_info["tokenName"]}</p>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                        >
                          <Grid item xs={4} className="label">
                            <span>
                              {this.props.intl.formatMessage({
                                id: "发行时间",
                              })}
                            </span>
                          </Grid>
                          <Grid item xs={8} className="item1">
                            {token_info.publishTime || "--"}
                          </Grid>
                          <Grid item xs={4} className="label">
                            <span>
                              {this.props.intl.formatMessage({
                                id: "发行总量",
                              })}
                            </span>
                          </Grid>
                          <Grid item xs={8} className="item1">
                            {token_info.maxQuantitySupplied
                              ? helper.format(
                                  token_info.maxQuantitySupplied.replace(
                                    /,/g,
                                    ""
                                  )
                                )
                              : "--"}
                          </Grid>
                          <Grid item xs={4} className="label">
                            <span>
                              {this.props.intl.formatMessage({
                                id: "流通总量",
                              })}
                            </span>
                          </Grid>
                          <Grid item xs={8} className="item1">
                            {token_info.currentTurnover
                              ? helper.format(
                                  token_info.currentTurnover.replace(/,/g, "")
                                )
                              : "--"}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item style={{ width: 250 }}>
                        <Grid container justify="space-between">
                          <Grid
                            item
                            xs={4}
                            className="label"
                            style={{
                              width: 110,
                            }}
                          >
                            <span>
                              {this.props.intl.formatMessage({ id: "白皮书" })}
                            </span>
                          </Grid>
                          <Grid xs={8} item className="item">
                            {token_info.whitePaperUrl ? (
                              <a
                                href={token_info.whitePaperUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {token_info.whitePaperUrl}
                              </a>
                            ) : (
                              "--"
                            )}
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            className="label"
                            style={{
                              width: 110,
                            }}
                          >
                            <span>
                              {this.props.intl.formatMessage({ id: "官网" })}
                            </span>
                          </Grid>
                          <Grid xs={8} item className="item">
                            {token_info.officialWebsiteUrl ? (
                              <a
                                href={token_info.officialWebsiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {token_info.officialWebsiteUrl}
                              </a>
                            ) : (
                              "--"
                            )}
                          </Grid>
                          <Grid item xs={4} className="label">
                            <span>
                              {this.props.intl.formatMessage({
                                id: "区块查询",
                              })}
                            </span>
                          </Grid>
                          <Grid xs={8} item className="item">
                            {token_info.exploreUrl ? (
                              <a
                                href={token_info.exploreUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {token_info.exploreUrl}
                              </a>
                            ) : (
                              "--"
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                  <div className={classes.token_info_content}>
                    {token_info["description"] ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: token_info["description"],
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
            </Paper>
          </ClickAwayListener>
        </Popover>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TokenInfo));
