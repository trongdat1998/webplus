// 币对信息
import React from "react";
import helper from "../../../utils/helper";
import { injectIntl } from "react-intl";
import route_map from "../../../config/route_map";
import WSDATA from "../../../models/data_source";
import { Grid } from "@material-ui/core";
import ModalFuture from "./modal_future";
import CONST from "../../../config/const";
import TooltipCommon from "../../public/tooltip";
import { Switch } from "@material-ui/core";
import { Iconfont } from "../../../lib";
import classnames from "classnames";
import styles from "../../public/quote_style";
import { withStyles } from "@material-ui/core/styles";
import math from "../../../utils/mathjs";
import TokenList from "./tokenList";

let timer = null;
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
class TokenInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      indices: "",
      time: null,
      timer: null,
      text: "",
      getTime: false,
      count: 0,
      subed: false,
      anchorEl: null,
      mode: localStorage.futureQuoteMode == "Dark",
    };
    this.change = this.change.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  componentDidMount() {
    // this.loop();
    // this.update();
    if (this.props.match.params.symbolId) {
      this.props.dispatch({
        type: "future/funding_rates",
        payload: {},
      });
      this.run();
      this.init();
    }
  }
  init = () => {
    const symbol_id = (this.props.match.params.symbolId || "").toUpperCase();
    if (!symbol_id) {
      return;
    }
    const symbol_info = this.props.config.symbols_obj.all[symbol_id] || {};

    this.props.dispatch({
      type: "future/save",
      payload: {
        token1: symbol_info.baseTokenId,
        token1_name: symbol_info.baseTokenName,
        token2: symbol_info.quoteTokenId,
        token2_name: symbol_info.quoteTokenName,
        future_info: symbol_info,
        indexToken: symbol_info.baseTokenFutures.displayIndexToken,
        exchange_id: symbol_info.exchangeId,
        symbol_id,
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
  };
  change(t) {
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        chartType: t,
      },
    });
  }

  sub = (id, symbol) => {
    // 订阅指数价
    this.props.qws.sub(
      {
        id: id,
        topic: "index",
        event: "sub",
        symbol: symbol,
        params: {
          org: this.props.config.orgId,
          binary: !Boolean(window.localStorage.ws_binary),
        },
      },
      this.httpAction,
      this.callback
    );
  };
  cancel = (id) => {
    this.props.qws && this.props.qws.cancel(id);
  };
  httpAction = async (payload) => {
    const symbol_info =
      this.props.config.symbols_obj.all[this.props.symbol_id] || {};
    await this.props.dispatch({
      type: "ws/get_indices_data",
      payload: {
        symbol: symbol_info.baseTokenFutures.displayIndexToken,
      },
    });
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

  run = async () => {
    const funding_rates = this.props.funding_rates
      ? [...this.props.funding_rates]
      : [];
    let hasChange = false;
    if (window.location.pathname.indexOf(route_map.future) == -1) {
      return;
    }
    funding_rates.map((item) => {
      if (
        Number(item.nextSettleTime) &&
        Number(item.curServerTime) &&
        item.nextSettleTime - item.curServerTime >= 0
      ) {
        if (!item.fixTime && item.fixTime !== 0) {
          item.fixTime = item.nextSettleTime - item.curServerTime;
        } else {
          item.fixTime = Math.max(0, item.fixTime - 1000);
        }
        if (
          item.fixTime === 0 &&
          window.location.pathname.indexOf(item.tokenId) > -1
        ) {
          hasChange = true;
        }
      }
    });
    await this.props.dispatch({
      type: "save",
      payload: {
        funding_rates,
      },
    });
    if (hasChange) {
      try {
        await this.props.dispatch({
          type: "future/funding_rates",
          payload: {},
        });
      } catch (e) {}
    }
    this.setState(
      {
        count: Number(this.state.count) + 1,
      },
      () => {
        setTimeout(() => {
          this.run();
        }, 1000);
      }
    );
    //await helper.delay(1000);
  };
  handlePopoverOpen = (e) => {
    clearTimeout(timer);
    timer = null;
    this.setState({
      anchorEl: e.target,
    });
  };
  handlePopoverClose = () => {
    clearTimeout(timer);
    timer = null;
    let that = this;
    timer = setTimeout(() => {
      that.setState({
        anchorEl: null,
      });
    }, 100);
  };
  handleChange = () => {
    if (this.props.tvwidget && this.props.tvwidget._ready) {
      let check = this.state.mode;
      localStorage.futureQuoteMode = check ? "Light" : "Dark";
      this.setState({
        mode: !check,
      });
      this.props.dispatch({
        type: "future/save",
        payload: {
          quoteMode: localStorage.futureQuoteMode,
        },
      });
    }
  };
  closeModal() {
    this.setState({
      anchorEl: null,
    });
  }
  render() {
    const { classes } = this.props;
    const s = classes;
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const symbolId = (this.props.match.params.symbolId || "").toUpperCase();
    if (!symbolId) {
      return <div className={s.tokenInfo} />;
    }
    const tokenQuote = symbol_quote[symbolId] || {};

    // 币对信息
    let symbolInfo = this.props.config.symbols_obj.all[symbolId] || {};
    let symbolName = symbolInfo.symbolName;

    if (tokenQuote.c) {
      document.title =
        helper.digits(tokenQuote.c, this.props.max_digits) +
        " | " +
        (this.props.index_config.title || "");
    }
    let current_funding_rates = {};
    (this.props.funding_rates || []).map((item) => {
      if (item.tokenId == symbolId) {
        current_funding_rates = item;
      }
    });
    const d = deadlineFormat(current_funding_rates.fixTime);
    const cRates = symbolInfo.baseTokenFutures
      ? helper.currencyValue(
          this.props.rates,
          tokenQuote ? tokenQuote.c : 0,
          symbolInfo.baseTokenFutures.displayTokenId,
          window.localStorage.unit,
          true
        )
      : ["", "", ""];
    return (
      <div className={s.tokenInfo} style={{ padding: "4px 8px 4px 16px" }}>
        <div
          className={s.future_symbol_name}
          onMouseEnter={this.handlePopoverOpen}
          onMouseLeave={this.handlePopoverClose}
        >
          <em>{symbolName}</em>
          {symbolInfo.label && symbolInfo.label.labelValue ? (
            <span
              className="label"
              style={
                symbolInfo.label.colorCode
                  ? {
                      color: symbolInfo.label.colorCode,
                      borderColor: symbolInfo.label.colorCode,
                    }
                  : {}
              }
            >
              {symbolInfo.label.labelValue}
            </span>
          ) : (
            ""
          )}
          <Iconfont type="arrowDown" size="24" />
          <div
            className={classnames(
              s.tokenListModal,
              Boolean(this.state.anchorEl) ? "on" : ""
            )}
          >
            <TokenList {...this.props} callback={this.closeModal} />
          </div>
        </div>
        <Grid
          container
          justify="space-around"
          alignItems="center"
          className={classnames(s.info, s.option_info)}
        >
          <Grid item>
            <span
              className={Number(tokenQuote.m) >= 0 ? classes.up : classes.down}
              style={{ fontSize: "16px", fontWeight: 500 }}
            >
              {helper.digits(
                math.chain(tokenQuote.c).done(),
                Number(this.props.max_digits)
              )}
            </span>
            <br />
            <i>
              {tokenQuote.c && tokenQuote.o
                ? `≈${cRates[1]}${cRates[2]}`
                : "--"}
            </i>
          </Grid>
          <Grid item>
            <span>
              {this.props.intl.formatMessage({
                id: "涨跌幅",
              })}
            </span>
            <br />
            {tokenQuote.m ? (
              <i className={Number(tokenQuote.m) >= 0 ? s.up : s.down}>
                {Number(tokenQuote.m) > 0 ? "+" : ""}
                {helper.format(
                  Math.floor(Number(tokenQuote.m) * 10000) / 100,
                  2
                ) + "%"}
              </i>
            ) : (
              <i>--</i>
            )}
          </Grid>
          <Grid item>
            <span>
              24H
              {this.props.intl.formatMessage({
                id: "最低",
              })}
            </span>
            <br />
            {tokenQuote.l
              ? Number(helper.digits(tokenQuote.l, this.props.max_digits))
              : "--"}
          </Grid>
          <Grid item>
            <span>
              24H
              {this.props.intl.formatMessage({
                id: "最高",
              })}
            </span>
            <br />
            {tokenQuote.h
              ? Number(helper.digits(tokenQuote.h, this.props.max_digits))
              : "--"}
          </Grid>
          <Grid item>
            <span>
              24H
              {this.props.intl.formatMessage({
                id: "成交量",
              })}
              ({this.props.intl.formatMessage({ id: "张" })})
            </span>
            <br />
            {tokenQuote.v ? Number(helper.digits(tokenQuote.v, 2)) : "--"}
          </Grid>
          <Grid item>
            <TooltipCommon
              title={this.props.intl.formatMessage({
                id: "资金费率结算的倒计时",
              })}
              placement="bottom"
              mode={true}
            >
              <span className={s.underline}>
                {this.props.intl.formatMessage({
                  id: "结算",
                })}
              </span>
            </TooltipCommon>
            <br />
            {d[1] < 10 ? "0" + d[1] : d[1]}:{d[2] < 10 ? "0" + d[2] : d[2]}:
            {d[3] < 10 ? "0" + d[3] : d[3]}
          </Grid>
          <Grid item>
            <TooltipCommon
              title={
                <React.Fragment>
                  <span>
                    {this.props.intl.formatMessage({
                      id: "当前时间段资金费率预测。如果资金费率为正，多头向空头支付资金费率；反之亦然。",
                    })}
                  </span>
                  <a href={route_map.future_history_data_rate + `/${symbolId}`}>
                    {this.props.intl.formatMessage({ id: "查看详情" })}
                  </a>
                </React.Fragment>
              }
              placement="bottom"
              mode={true}
              interactive
            >
              <span className={s.underline}>
                <a href={route_map.future_history_data_rate + `/${symbolId}`}>
                  {this.props.intl.formatMessage({
                    id: "预测资金费率",
                  })}
                </a>
              </span>
            </TooltipCommon>
            <br />
            {current_funding_rates.fundingRate
              ? helper.digits(current_funding_rates.fundingRate * 100, 4) + "%"
              : current_funding_rates.fundingRate}
            {Number(current_funding_rates.fundingRate) ||
            Number(current_funding_rates.fundingRate) === 0
              ? Number(current_funding_rates.fundingRate) >= 0
                ? this.props.intl.formatMessage({ id: "多仓付" })
                : this.props.intl.formatMessage({ id: "空仓付" })
              : "--"}
          </Grid>
          <Grid item>
            <TooltipCommon
              title={
                <React.Fragment>
                  <span>
                    {this.props.intl.formatMessage({
                      id: "强平仓位的参考指数",
                    })}
                  </span>{" "}
                  <a
                    href={route_map.future_history_data_index + `/${symbolId}`}
                  >
                    {this.props.intl.formatMessage({ id: "查看详情" })}
                  </a>
                </React.Fragment>
              }
              placement="bottom"
              mode={true}
              interactive
            >
              <span className={s.underline}>
                <a href={route_map.future_history_data_index + `/${symbolId}`}>
                  {this.props.intl.formatMessage({
                    id: "指数价",
                  })}
                </a>
              </span>
            </TooltipCommon>
            <br />
            {symbolInfo.baseTokenFutures &&
            this.props.indices[symbolInfo.baseTokenFutures.displayIndexToken]
              ? helper.digits(
                  this.props.indices[
                    symbolInfo.baseTokenFutures.displayIndexToken
                  ],
                  CONST.depth[symbolInfo.minPricePrecision]
                )
              : "--"}
          </Grid>
          {/* <Grid item>
            <TooltipCommon
              title={this.props.intl.formatMessage({
                id: ""
              })}
              placement="bottom"
            >
              <span className={s.underline}>
                {this.props.intl.formatMessage({
                  id: "标记价"
                })}
              </span>
            </TooltipCommon>
            <br />
            {symbolInfo.baseTokenFutures &&
            this.props.indices[symbolInfo.baseTokenFutures.displayIndexToken]
              ? helper.digits(
                  this.props.indices[
                    symbolInfo.baseTokenFutures.displayIndexToken
                  ],
                  CONST.depth[symbolInfo.minPricePrecision]
                )
              : "--"}
          </Grid> */}
        </Grid>
        <div className={s.switch}>
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
        <ModalFuture open={this.props.modal_future} {...this.props} />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TokenInfo));
