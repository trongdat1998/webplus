// 交易面板订单测试
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./index_order_style";
import CONST from "../../config/const";
import helper from "../../utils/helper";
import { Grid } from "@material-ui/core";
import WSDATA from "../../models/data_source";

class introduce extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    const symbolId = (this.props.match.params.symbolId || "").toUpperCase();
    this.props.dispatch({
        type: "future/get_funding_rates",
        payload: {
            symbol_id: symbolId
        }
    });
  }
  render() {
    const { classes, contractInfo } = this.props;
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const symbolId = (this.props.match.params.symbolId || "").toUpperCase();
    const tokenQuote = symbol_quote[symbolId] || {};
    // 币对信息
    let symbolInfo = this.props.config.symbols_obj.all[symbolId];
    let symbolName = symbolInfo.symbolName;
    let token2_name = "";
    token2_name = symbolInfo.quoteTokenName;

    let current_funding_rates = {};
    (this.props.funding_rates || []).map(item => {
      if (item.tokenId == symbolId) {
        current_funding_rates = item;
      }
    });
    let baseTokenFutures = symbolInfo.baseTokenFutures;
    let futuresRiskLimits = baseTokenFutures ? symbolInfo.baseTokenFutures.riskLimits : [];
    return (
        <div className={classes.future_introduce}>
            <div style={{minWidth: 842}}>
                <h3>{symbolName}</h3>
                <Grid container>
                <Grid item xs={5}>
                    <p>
                        <label>{this.props.intl.formatMessage({id: "指数价格"})}</label>
                        <span>
                        {symbolInfo.baseTokenFutures &&
                        this.props.indices[symbolInfo.baseTokenFutures.displayIndexToken]
                            ? helper.digits(
                                this.props.indices[
                                symbolInfo.baseTokenFutures.displayIndexToken
                                ],
                                CONST.depth[symbolInfo.minPricePrecision]
                            )
                            : "--"}
                        </span>
                    </p>
                    <p>
                        <label>{this.props.intl.formatMessage({id: "资金费率"})}</label>
                        <span>
                            {helper.digits((contractInfo.fundingRate || 0) * 100, 4)}%
                        </span>
                    </p>
                    <p>
                        <label>{this.props.intl.formatMessage({id: "结算时间"})}</label>
                        <span>8{this.props.intl.formatMessage({id: "小时"})}</span>
                    </p>
                    <p>
                        <label>{this.props.intl.formatMessage({id: "预计资金费率"})}</label>
                        <span>
                            {helper.digits((contractInfo.settleRate || 0) * 100, 4)}%
                        </span>
                    </p>
                    <p>
                        <label>{this.props.intl.formatMessage({id: "起始保证金"})}</label>
                        <span>{helper.digits((futuresRiskLimits[0].initialMargin || 0) * 100, 2)}%</span>
                    </p>
                </Grid>
                <Grid item xs={5}>
                    <p>
                        <label>
                            {this.props.intl.formatMessage({id: "24H交易额"})}
                            ({token2_name})
                        </label>
                        <span>
                        {tokenQuote.qv ? Number(helper.digits(tokenQuote.qv, 2)) : "--"}
                        </span>
                    </p>
                    <p>
                        <label>
                            {this.props.intl.formatMessage({id: "24H交易量"})}
                            ({this.props.intl.formatMessage({id: "张"})})
                        </label>
                        <span>{tokenQuote.v ? Number(helper.digits(tokenQuote.v, 2)) : "--"}</span>
                    </p>
                    <p>
                        <label>{this.props.intl.formatMessage({id: "最小价格变化"})}</label>
                        <span>{symbolInfo.minPricePrecision}</span>
                    </p>
                    <p>
                        <label>{this.props.intl.formatMessage({id: "最小委托数量"})}</label>
                        <span>{symbolInfo.minTradeQuantity}</span>
                    </p>
                    <p>
                        <label>{this.props.intl.formatMessage({id: "维持保证金"})}</label>
                        <span>{helper.digits((futuresRiskLimits[0].maintainMargin || 0) * 100, 2)}%</span>
                    </p>
                </Grid>
            </Grid>
            </div>
        </div>
    );
  }
}
introduce.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(injectIntl(introduce));
