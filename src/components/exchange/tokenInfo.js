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
import route_map from "../../config/route_map";
import TooltipCommon from "../public/tooltip";
import math from "../../utils/mathjs";

let timer = null;
class TokenInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
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
    // this.update();
  }
  componentDidUpdate(preProps, preState) {
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const token1 = this.props.match.params.token1.toUpperCase();
    const token2 = this.props.match.params.token2.toUpperCase();
    const tokenInfo = symbol_quote[token1 + token2] || {};
    const etfPrice = window.WEB_CONFIG.etfPrice
      ? window.WEB_CONFIG.etfPrice[tokenInfo.s]
      : "";
    if (preProps.symbol_id !== this.props.symbol_id) {
      this.setState({
        subed: false,
      });
    }
    if (this.props.qws && !this.state.subed && etfPrice) {
      this.setState(
        {
          subed: true,
        },
        () => {
          // 当前币对数据
          this.sub(
            "index" + this.props.exchange_id + etfPrice.contractSymbolId,
            etfPrice.underlyingIndexId
          );
        }
      );
    }
  }
  sub = (id, symbol) => {
    this.props.qws.sub(
      {
        id: id,
        topic: "index",
        event: "sub",
        symbol: symbol,
        params: {
          binary: !Boolean(window.localStorage.ws_binary),
        },
      },
      this.httpAction,
      this.callback
    );
  };
  httpAction = async (payload) => {
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const token1 = this.props.match.params.token1.toUpperCase();
    const token2 = this.props.match.params.token2.toUpperCase();
    const tokenInfo = symbol_quote[token1 + token2] || {};
    const etfPrice = window.WEB_CONFIG.etfPrice
      ? window.WEB_CONFIG.etfPrice[tokenInfo.s]
      : "";
    if (etfPrice) {
      await this.props.dispatch({
        type: "ws/get_indices_data",
        payload: {
          symbol: etfPrice.underlyingIndexId,
        },
      });
    }
  };
  /**
   * data={
   *   topic:'broker',
   *   params:{},
   *   f: true/false,
   *   id: 'broker,
   *   shared: true/false,
   *   data:[{t:123123123123,s:'BTCUSDT',c:1,o:1,e:301,h:1,l:1,m:0,v:0,qv:0}] m:涨跌幅
   * }
   */
  callback = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("indices_source", {
        [data.data[0]["symbol"]]: data.data[0]["index"],
      });
  };
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
      type: "exchange/save",
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
      type: "exchange/sell_config",
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
      type: "exchange/token_info",
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
      type: "exchange/save",
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
        type: "exchange/save",
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
        // tokenInfo.c +
        // "≈" +
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
  getETFPrice(data, minPrecision) {
    const token = this.props.match.params.token1.toUpperCase();
    const token_name = this.props.config.tokens[token]
      ? this.props.config.tokens[token]["tokenName"]
      : "";
    const indices = this.props.indices[data.underlyingIndexId];
    if (!indices) {
      return "--";
    }
    const coinPrice = helper.digits(indices, 4);
    const leverage = data.leverage;
    // 上个调整时点的净值*[1±3*(现货最新成交价-现货上个调整时点价格)/现货上个调整时点价格*100%]
    const n = data.isLong ? 0 + leverage : 0 - leverage;
    const count =
      1 +
      (n * parseFloat(coinPrice - data.underlyingPrice)) /
        parseFloat(data.underlyingPrice);
    return helper.format(
      math
        .chain(parseFloat(data.etfPrice))
        .multiply(count)
        .format({ notation: "fixed" })
        .done(),
      minPrecision
    );
  }
  render() {
    const { classes, history, intl } = this.props;
    if (!this.props.match.params.token1 || !this.props.match.params.token2) {
      return <div className={classes.tokenInfo} />;
    }
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const token1 = this.props.match.params.token1.toUpperCase();
    const token2 = this.props.match.params.token2.toUpperCase();
    const tokenInfo = symbol_quote[token1 + token2] || {};
    const symbol_info =
      this.props.config.symbols_obj.all[token1 + token2] || {};
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
    const etfPrice = window.WEB_CONFIG.etfPrice
      ? window.WEB_CONFIG.etfPrice[tokenInfo.s]
      : "";
    let indices = "",
      contractInfo = {};
    if (this.props.indices && etfPrice && etfPrice.underlyingIndexId) {
      indices = this.props.indices[etfPrice.underlyingIndexId];
    }
    if (etfPrice && etfPrice.contractSymbolId) {
      contractInfo =
        this.props.config.symbols_obj.all[etfPrice.contractSymbolId] || {};
    }
    return (
      <div className={classes.tokenInfo}>
        <div className={classes.symbol_name}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <em
              onMouseEnter={this.handlePopoverOpen}
              onMouseLeave={this.handlePopoverClose}
            >
              <Iconfont type="brief" size="20" />
              {token1_name}
            </em>
            /{token2_name}
            {symbol_info.label &&
            symbol_info.label.labelValue &&
            this.state.quoteToken != 0 ? (
              <span
                className="label"
                style={
                  symbol_info.label.colorCode
                    ? {
                        color: symbol_info.label.colorCode,
                        borderColor: symbol_info.label.colorCode,
                      }
                    : {}
                }
              >
                {symbol_info.label.labelValue}
              </span>
            ) : (
              ""
            )}
          </div>
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
          {etfPrice ? (
            <div>
              <TooltipCommon
                title={intl.formatMessage({
                  id:
                    "净值=上个调整时点的净值*[1±3*(现货最新成交价-现货上个调整时点价格)/现货上个调整时点价格*100%]",
                })}
                placement="bottom"
                mode={true}
              >
                <span className={classes.underline}>
                  {intl.formatMessage({
                    id: "净值",
                  })}
                </span>
              </TooltipCommon>
              <br />
              {this.getETFPrice(
                etfPrice,
                CONST["depth"][symbol_info.minPricePrecision || 8]
              )}
            </div>
          ) : (
            ""
          )}
          <div>
            <span>
              24H
              {intl.formatMessage({ id: "涨跌" })}
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
              {intl.formatMessage({ id: "高" })}
            </span>
            <br />
            {helper.digits(tokenInfo.h, this.props.max_digits)}
          </div>
          <div>
            <span>
              24H
              {intl.formatMessage({ id: "低" })}
            </span>
            <br />
            {helper.digits(tokenInfo.l, this.props.max_digits)}
          </div>
          <div>
            <span>
              24H
              {intl.formatMessage({ id: "成交额" })}
            </span>
            <br />
            {cRates2[1]} {cRates2[2]}
          </div>
          {etfPrice ? (
            <div>
              <span>
                {intl.formatMessage({
                  id: "BTC指数价",
                })}
              </span>
              <br />
              {indices && contractInfo && contractInfo.minPricePrecision
                ? helper.digits(
                    indices,
                    CONST.depth[contractInfo.minPricePrecision || 4]
                  )
                : "--"}
            </div>
          ) : (
            ""
          )}
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
                    <p
                      onClick={() => {
                        this.props.history.replace(
                          route_map.currency_list + "/" + token_info["tokenId"]
                        );
                      }}
                    >
                      {intl.formatMessage({ id: "币种简介" })}{" "}
                      <Iconfont type="arrowRight" size={20} />
                    </p>
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
                              {intl.formatMessage({
                                id: "发行时间",
                              })}
                            </span>
                          </Grid>
                          <Grid item xs={8} className="item1">
                            {token_info.publishTime || "--"}
                          </Grid>
                          <Grid item xs={4} className="label">
                            <span>
                              {intl.formatMessage({
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
                              {intl.formatMessage({
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
                            <span>{intl.formatMessage({ id: "白皮书" })}</span>
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
                            <span>{intl.formatMessage({ id: "官网" })}</span>
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
                              {intl.formatMessage({
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
                          __html: helper.dataReform(token_info["description"]),
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
