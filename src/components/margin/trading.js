// 杠杆模块
import React from "react";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Tab } from "@material-ui/core";

import LimitTrading from "../../components/margin/limitTrading";
import MarketTrading from "../../components/margin/marketTrading";
import PlanTrading from "../../components/margin/planTrading";
import CONSTS from "../../config/const";
import WSDATA from "../../models/data_source";
import styles from "./trading.style";
import route_map from "../../config/route_map";

class Trading extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
      tab: CONSTS.ORDER_TYPE.LIMIT,
      transferOpen: false,
    };
    this.change = this.change.bind(this);
  }
  reopen = (id, reopen) => {
    if (reopen) {
      this.httpAction();
    }
  };
  httpAction = async (payload) => {
    await this.props.dispatch({
      type: "ws/lever_balance_http",
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
      WSDATA.setData("margin_balance_source", data.data);
  };

  change = (event, value) => {
    const lever = this.props.lever;
    let data = {
      order_type: value,
    };
    this.setState({
      tab: value,
    });
    const symbol_quote = this.props.layout.symbol_quote;
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

      data.sale_max = lever.token1_quantity || 0;
      data.sale_progress = 0;
      data.sale_price = tokenQuote.c || "";
      data.sale_quantity = "";
      data.sale_auto = tokenQuote.c ? true : false;
    }
    if (value === "market") {
      data.buy_max = lever.token2_quantity;
      data.buy_progress = 0;
      data.buy_quantity = "";
      data.buy_price = tokenQuote.c || "";
      data.buy_auto = true;

      data.sale_max = lever.token1_quantity || 0;
      data.sale_progress = 0;
      data.sale_price = tokenQuote.c || "";
      data.sale_quantity = "";
      data.sale_auto = true;
    }
    this.props.dispatch({
      type: "lever/handleChange",
      payload: {
        ...data,
      },
    });
  };
  // 打开转账dialog
  openTransferDialog() {
    this.setState({
      transferOpen: true,
    });
  }

  componentDidUpdate(preProps) {
    if (preProps.lever.symbol_info != this.props.lever.symbol_info) {
      const { symbol_info } = this.props.lever;
      if (!symbol_info.allowPlan && this.state.tab == CONSTS.ORDER_TYPE.PLAN) {
        this.setState({
          tab: CONSTS.ORDER_TYPE.LIMIT,
        });
      }
    }
  }

  render() {
    const { intl, classes, lever } = this.props;
    const { symbol_info } = lever;
    return (
      <>
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
          <div
            style={{
              display:
                this.state.tab === CONSTS.ORDER_TYPE.LIMIT ? "block" : "none",
            }}
          >
            <LimitTrading
              {...this.props.layout}
              {...this.props.lever}
              {...this.props.ws}
              match={this.props.match}
              loading={this.props.loading}
              dispatch={this.props.dispatch}
              location={this.props.location}
              history={this.props.history}
            />
          </div>
          <div
            style={{
              display:
                this.state.tab === CONSTS.ORDER_TYPE.MARKET ? "block" : "none",
            }}
          >
            <MarketTrading
              {...this.props.layout}
              {...this.props.lever}
              {...this.props.ws}
              match={this.props.match}
              loading={this.props.loading}
              dispatch={this.props.dispatch}
              location={this.props.location}
              history={this.props.history}
            />
          </div>
          <div
            style={{
              display:
                this.state.tab === CONSTS.ORDER_TYPE.PLAN ? "block" : "none",
            }}
          >
            <PlanTrading
              {...this.props.layout}
              {...this.props.lever}
              {...this.props.ws}
              match={this.props.match}
              loading={this.props.loading}
              dispatch={this.props.dispatch}
              location={this.props.location}
              history={this.props.history}
            ></PlanTrading>
          </div>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(injectIntl(Trading));
