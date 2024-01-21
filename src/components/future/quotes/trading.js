// 交易模块
import React from "react";
import LimitTrading from "./limitTrading";
import { injectIntl } from "react-intl";
import { Iconfont } from "../../../lib";
import ModalCalculator from "./modal_calculator";

// 设置弹层
import ModalSetting from "./modal_setting";
import ModalGlossary from "./modal_desc";
import { withStyles } from "@material-ui/core/styles";
import styles from "./quote_style";
import { Tabs, Tab } from "@material-ui/core";
import classnames from "classnames";
import WSDATA from "../../../models/data_source";

class Trading extends React.Component {
  constructor() {
    super();
    this.state = {
      index: 0,
      tabs: ["开仓", "平仓"],
    };
    this.change = this.change.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }

  change(event, key) {
    if (key == this.state.index) return;
    this.setState({
      index: key,
    });

    let data = {
      order_choose: key,
    };
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const symbolId = this.props.match.params.symbolId;
    const tokenQuote = symbol_quote ? symbol_quote[symbolId] : { c: "" };

    data.buy_max = 0;
    data.buy_progress = 0;
    data.buy_price = tokenQuote ? tokenQuote.c : "";
    data.buy_type = 0;
    data.buy_price_type = 0;
    data.buy_trigger_price = 0;
    data.buy_leverage =
      window.localStorage[symbolId.toUpperCase() + key + "buy_leverage"];
    data.buy_quantity = "";
    data.buy_max = 0;

    data.sale_max = 0;
    data.sale_progress = 0;
    data.sale_price = tokenQuote ? tokenQuote.c : "";
    data.sale_type = 0;
    data.sale_price_type = 0;
    data.sale_trigger_price = 0;
    data.sale_leverage =
      window.localStorage[symbolId.toUpperCase() + key + "sale_leverage"];
    data.sale_quantity = "";
    data.sale_max = 0;

    if (this.props.future.setProgress) {
      this.props.future.setProgress("buy_progress", 0);
      this.props.future.setProgress("sale_progress", 0);
    }
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        ...data,
      },
    });
  }
  changeStatus() {
    let open = this.props.future.showFinance;
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        showFinance: !open,
      },
    });
  }
  render() {
    const { classes } = this.props;
    return [
      <div className={classes.shrink} key="icon">
        <Iconfont
          type={this.props.future.showFinance ? "flod" : "unflod"}
          size="16"
          onClick={this.changeStatus.bind(this)}
        />
      </div>,
      <div className={classes.tradingForm} key="form">
        <Tabs
          value={this.state.index}
          onChange={this.change}
          indicatorColor="primary"
          textColor="inherit"
          className={classes.tabs}
        >
          {this.state.tabs.map((item, i) => {
            return (
              <Tab
                value={i}
                key={i}
                label={this.props.intl.formatMessage({
                  id: item,
                })}
              />
            );
          })}
        </Tabs>
        <div className={classnames(classes.more, classes.tradeMore)} key="more">
          <ModalCalculator
            {...this.props.layout}
            {...this.props.future}
            match={this.props.match}
            loading={this.props.loading}
            dispatch={this.props.dispatch}
            location={this.props.location}
            history={this.props.history}
          />
          <Iconfont
            type="info_line"
            size="24"
            onClick={() => {
              this.props.dispatch({
                type: "future/handleChange",
                payload: {
                  modal_glossary: true,
                },
              });
            }}
          />
          {this.props.layout.userinfo && this.props.layout.userinfo.userId ? (
            <Iconfont
              type="settings"
              size="24"
              onClick={() => {
                this.props.dispatch({
                  type: "future/handleChange",
                  payload: {
                    modal_setting: true,
                  },
                });
              }}
            />
          ) : (
            ""
          )}
        </div>
        <LimitTrading
          {...this.props.layout}
          {...this.props.future}
          {...this.props.ws}
          match={this.props.match}
          loading={this.props.loading}
          dispatch={this.props.dispatch}
          location={this.props.location}
          history={this.props.history}
        />
        <ModalSetting
          open={this.props.future.modal_setting}
          {...this.props.layout}
          {...this.props.future}
          match={this.props.match}
          loading={this.props.loading}
          dispatch={this.props.dispatch}
          location={this.props.location}
          history={this.props.history}
        />
        <ModalGlossary
          open={this.props.future.modal_glossary}
          {...this.props.layout}
          {...this.props.future}
          match={this.props.match}
          loading={this.props.loading}
          dispatch={this.props.dispatch}
          location={this.props.location}
          history={this.props.history}
        />
      </div>,
    ];
  }
}

export default withStyles(styles)(injectIntl(Trading));
