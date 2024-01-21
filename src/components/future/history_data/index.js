// 指数价格
import React from "react";
import classnames from "classnames";
import helper from "../../../utils/helper";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import WSDATA from "../../../models/data_source";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { Grid } from "@material-ui/core";
import CONST from "../../../config/const";
import MenuRC from "./menu";
import SelectRC from "./select";
import KlineRC from "./kline";
import route_map from "../../../config/route_map";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      symbol_id: "",
      indexToken: "",
      symbol_name: "",
      exchange_id: "",
      limit: 1500,
      same_symbol: [],
      formula: "",
    };
  }
  onChange = (symbol_id, symbol_name, exchange_id, indexToken) => {
    this.setState(
      {
        symbol_id,
        symbol_name,
        exchange_id,
        indexToken,
      },
      () => {
        this.props.history.push(
          route_map.future_history_data_index + "/" + symbol_id
        );
        this.init(symbol_id, indexToken);
        this.formula();
      }
    );
  };
  formula = () => {
    if (this.state.indexToken) {
      this.props.dispatch({
        type: "layout/commonRequest",
        payload: {
          name: this.state.indexToken,
        },
        urlKey: "index_formula",
        cb: (res) => {
          if (res.code == "OK" && res.data && res.data.data) {
            this.setState({
              formula: res.data.data.formula,
            });
          }
        },
      });
    }
  };
  init = (sid, indexToken) => {
    const symbol_id = sid;
    const symbol_info = this.props.config.symbols_obj.all[symbol_id] || {};

    let same_symbol = [];
    this.props.config.futuresSymbol.map((item) => {
      if (item.baseTokenFutures.displayIndexToken == indexToken) {
        same_symbol.push(item);
      }
    });

    this.setState({
      token1: symbol_info.baseTokenId,
      token1_name: symbol_info.baseTokenName,
      token2: symbol_info.quoteTokenId,
      token2_name: symbol_info.quoteTokenName,
      max_digits: CONST.depth[symbol_info.minPricePrecision],
      base_precision: CONST.depth[symbol_info.basePrecision], // 数量精度 如 8 表示小数留8位
      quote_precision: CONST.depth[symbol_info.quotePrecision], // 金额精度 如 8 表示小数留8位
      min_price_precision: symbol_info.minPricePrecision, // 价格交易step, 如 0.1
      min_trade_quantity: symbol_info.minTradeQuantity, // 数量交易step 如 0.1
      min_trade_amount: symbol_info.minTradeAmount, // 金额交易step  如 0.1
      indexToken,
      same_symbol,
    });
  };
  render() {
    const { classes, ...otherProps } = this.props;
    return (
      <div className={classes.content}>
        <div className={classes.nav}>
          <MenuRC />
        </div>
        <div className={classes.con}>
          <h2>{this.props.intl.formatMessage({ id: "指数价格" })}</h2>
          <div className={classes.item}>
            <FormattedHTMLMessage
              id="future.history.data.index.desc"
              tagName="p"
            />
          </div>
          <div className={classes.item}>
            <p>{this.props.intl.formatMessage({ id: "选择指数" })}</p>
            <Grid container justify="space-between">
              <Grid item>
                <SelectRC onChange={this.onChange} {...otherProps} />
              </Grid>
              <Grid item></Grid>
            </Grid>
          </div>
          <div className={classes.item}>
            <p>{this.props.intl.formatMessage({ id: "指数计算公式" })}</p>
            <p>{this.state.formula}</p>
          </div>
          <div className={classes.item}>
            <p>
              {this.props.intl.formatMessage({ id: "使用该指数的合约产品" })}
            </p>
            <p>
              {this.state.same_symbol.map((item) => {
                return (
                  <a
                    href={route_map.future + "/" + item.symbolId}
                    key={item.symbolId}
                    style={{ margin: "0 15px 0 0" }}
                  >
                    {item.symbolName}
                  </a>
                );
              })}
            </p>
          </div>
          <div className={classes.item}>
            <p>
              {this.props.intl.formatMessage(
                { id: "{sid}指数历史K线" },
                { sid: this.state.indexToken }
              )}
            </p>
            <div style={{ height: 500 }}>
              <KlineRC
                {...otherProps}
                symbol_id={this.state.symbol_id}
                exchange_id={this.state.exchange_id}
                indexToken={this.state.indexToken}
                max_digits={this.state.max_digits}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
