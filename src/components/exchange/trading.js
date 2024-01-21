// 交易模块
import React from "react";
import LimitTrading from "../../components/exchange/limitTrading";
import MarketTrading from "../../components/exchange/marketTrading";
import PlanTrading from "../../components/exchange/planTrading";
import { injectIntl } from "react-intl";
import WSDATA from "../../models/data_source";
import { withStyles } from "@material-ui/core/styles";
import styles from "../public/quote_style";
import { Tabs, Tab } from "@material-ui/core";
import { Iconfont } from "../../lib";
import route_map from "../../config/route_map";
import CONSTS from "../../config/const";

class Trading extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
      tab: "limit",
      risk: false,
    };
    this.change = this.change.bind(this);
  }
  componentDidMount() {
    const token1 = (this.props.match.params.token1 || "").toUpperCase();
    const key = `risk.${token1}.${this.props.layout.userinfo.userId}`;
    this.setRisk(key, 0);
  }
  componentDidUpdate(preProps) {
    if (this.props.layout.ws && !this.state.subed) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.props.layout.ws.sub(
            {
              id: "balance",
              topic: "balance",
              event: "sub",
            },
            this.httpAction,
            this.callback,
            this.reopen
          );
          this.httpAction();
        }
      );
    }
    const token1 = (this.props.match.params.token1 || "").toUpperCase();
    if (preProps.exchange.symbol_info != this.props.exchange.symbol_info) {
      const { symbol_info } = this.props.exchange;
      if (!symbol_info.allowPlan && this.state.tab == CONSTS.ORDER_TYPE.PLAN) {
        this.setState({
          tab: CONSTS.ORDER_TYPE.LIMIT,
        });
      }
    }

    const key = `risk.${token1}.${this.props.layout.userinfo.userId}`;
    this.setRisk(key, Number(window.localStorage[key]));
  }
  reopen = (id, reopen) => {
    if (reopen) {
      this.httpAction();
    }
  };
  httpAction = async (payload) => {
    await this.props.dispatch({
      type: "ws/balance_http",
      payload,
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
    data &&
      data.data &&
      data.data.length &&
      WSDATA.setData("user_balance_source", data.data);
  };
  change = (event, value) => {
    const exchange = this.props.exchange;
    let data = {
      order_type: value,
    };
    this.setState({
      tab: value,
    });
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const symbolId =
      this.props.match.params.token1.toUpperCase() +
      this.props.match.params.token2.toUpperCase();
    let tokenQuote = symbol_quote
      ? symbol_quote[symbolId] || { c: "" }
      : { c: "" };
    // 限价交易
    if (value === "limit" || value == "plan") {
      data.buy_max = 0;
      data.buy_progress = 0;
      data.buy_price = tokenQuote.c || "";
      data.buy_quantity = "";
      data.buy_auto = tokenQuote.c ? true : false;

      data.sale_max = exchange.token1_quantity || 0;
      data.sale_progress = 0;
      data.sale_price = tokenQuote.c || "";
      data.sale_quantity = "";
      data.sale_auto = tokenQuote.c ? true : false;
    } else if (value === "market") {
      data.buy_max = exchange.token2_quantity;
      data.buy_progress = 0;
      data.buy_quantity = "";
      data.buy_price = tokenQuote.c || "";
      data.buy_auto = true;

      data.sale_max = exchange.token1_quantity || 0;
      data.sale_progress = 0;
      data.sale_price = tokenQuote.c || "";
      data.sale_quantity = "";
      data.sale_auto = true;
    }

    this.props.dispatch({
      type: "exchange/handleChange",
      payload: {
        ...data,
      },
    });
    this.props.dispatch({
      type: "exchange/setProgress",
      payload: {
        buy_progress: 0,
        sale_progress: 0,
      },
    });
    // if (this.props.exchange.setProgress) {
    //   this.props.exchange.setProgress("buy_progress", 0);
    //   this.props.exchange.setProgress("sale_progress", 0);
    // }
    // if (this.props.exchange.setProgressMarket) {
    //   this.props.exchange.setProgressMarket("buy_progress", 0);
    //   this.props.exchange.setProgressMarket("sale_progress", 0);
    // }
  };
  close = (token1) => () => {
    const key = `risk.${token1}.${this.props.layout.userinfo.userId}`;
    this.setRisk(key, 1);
  };
  setRisk = (k, v) => {
    if (v == 1) {
      window.localStorage[k] = 1;
    }
    if (this.state.risk !== (v == 1 ? false : true)) {
      this.setState({
        risk: v == 1 ? false : true,
      });
    }
  };
  render() {
    const { classes, exchange, layout } = this.props;
    const token1 = (this.props.match.params.token1 || "").toUpperCase();
    const { symbol_info } = exchange;
    let tokenInfo =
      token1 && layout.config.tokens && layout.config.tokens[token1]
        ? layout.config.tokens[token1]
        : {};
    return (
      <div className={classes.tradingForm}>
        <Tabs
          value={this.state.tab}
          onChange={this.change}
          indicatorColor="primary"
          textColor="inherit"
          className={classes.tabs}
        >
          <Tab
            value="limit"
            label={this.props.intl.formatMessage({
              id: "限价交易",
            })}
          />
          <Tab
            value="market"
            label={this.props.intl.formatMessage({
              id: "市价交易",
            })}
          />
          {symbol_info.allowPlan ? (
            <Tab
              value="plan"
              label={this.props.intl.formatMessage({
                id: "计划委托",
              })}
            />
          ) : (
            ""
          )}
        </Tabs>
        <div style={{ display: this.state.tab === "limit" ? "block" : "none" }}>
          <LimitTrading
            {...this.props.layout}
            {...this.props.exchange}
            {...this.props.ws}
            match={this.props.match}
            loading={this.props.loading}
            dispatch={this.props.dispatch}
            location={this.props.location}
            history={this.props.history}
          />
        </div>
        <div
          style={{ display: this.state.tab === "market" ? "block" : "none" }}
        >
          <MarketTrading
            {...this.props.layout}
            {...this.props.exchange}
            {...this.props.ws}
            match={this.props.match}
            loading={this.props.loading}
            dispatch={this.props.dispatch}
            location={this.props.location}
            history={this.props.history}
          />
        </div>
        {symbol_info.allowPlan ? (
          <div
            style={{ display: this.state.tab === "plan" ? "block" : "none" }}
          >
            <PlanTrading
              {...this.props.layout}
              {...this.props.exchange}
              {...this.props.ws}
              match={this.props.match}
              loading={this.props.loading}
              dispatch={this.props.dispatch}
              location={this.props.location}
              history={this.props.history}
            />
          </div>
        ) : (
          ""
        )}
        {tokenInfo.isHighRiskToken && this.state.risk ? (
          <div className={classes.riskwarning}>
            <div>
              <Iconfont type="Suspended" size={22} />
              <p>
                {this.props.intl.formatMessage(
                  { id: "{token}riskwarning" },
                  {
                    token: tokenInfo.tokenName,
                  }
                )}
                <a href={route_map.currency_list + "/" + tokenInfo.tokenId}>
                  {this.props.intl.formatMessage({ id: "币种资料" })}
                </a>
              </p>
              <Iconfont type="close" size={22} onClick={this.close(token1)} />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Trading));
