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
import { Table } from "../../../lib";
import SelectRC from "./select";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      sid: "",
      sname: "",
      eid: "",
      data: [],
      limit: 10,
      side: "next",
      loading: false,
      index: "",
      quote: {},
    };
  }
  componentDidMount() {
    this.update();
  }
  update = async () => {
    await helper.delay(3000);
    if (this.state.sid) {
      try {
        await this.httpAction();
      } catch (e) {}
    }
    this.update();
  };
  httpAction = async (payload) => {
    const symbol_info = this.props.config.symbols_obj.all[this.state.sid] || {};
    await this.props.dispatch({
      type: "layout/commonRequest",
      urlKey: "indices",
      payload: {
        symbol: symbol_info.baseTokenFutures.displayIndexToken,
      },
      cb: (res) => {
        if (res.code == "OK" && res.data && res.data.data) {
          const index =
            res.data.data[symbol_info.baseTokenFutures.displayIndexToken] || "";
          this.setState({
            index: index
              ? helper.digits(index, CONST.depth[symbol_info.minPricePrecision])
              : "",
          });
        }
      },
    });
    await this.props.dispatch({
      type: "layout/commonRequest",
      urlKey: "quote",
      payload: {
        realtimeInterval: window.WEB_CONFIG.realtimeInterval,
      },
      cb: (res) => {
        if (res.code == "OK" && res.data && res.data.data) {
          res.data.data.map((item) => {
            if (item.s == this.state.sid) {
              this.setState({
                quote: item,
              });
            }
          });
        }
      },
    });
    await this.props.dispatch({
      type: "future/get_funding_rates",
      payload: {
        symbol_id: this.state.sid,
      },
    });
  };
  onChange = (sid, sname, eid) => {
    this.setState(
      {
        sid,
        sname,
        eid,
        index: "",
        quote: {},
      },
      () => {
        this.httpAction();
      }
    );
  };
  render() {
    const { classes, contractInfo, ...otherProps } = this.props;
    let symbolInfo = this.state.sid
      ? this.props.config.symbols_obj.all[this.state.sid]
      : {};
    let baseTokenFutures = symbolInfo.baseTokenFutures
      ? symbolInfo.baseTokenFutures
      : {};
    let futuresRiskLimits = baseTokenFutures.riskLimits
      ? baseTokenFutures.riskLimits
      : [];
    return (
      <div className={classes.content}>
        <div className={classes.nav}>
          <MenuRC />
        </div>
        <div className={classes.con}>
          <h2>{this.props.intl.formatMessage({ id: "合约介绍" })}</h2>
          <div className={classes.item}>
            <p>
              {this.props.intl.formatMessage({
                id: "合约介绍",
              })}
            </p>
            <FormattedHTMLMessage
              id="future.history.data.info.desc"
              tagName="p"
            />
          </div>
          <div className={classes.item}>
            <p>{this.props.intl.formatMessage({ id: "选择合约" })}</p>
            <Grid container justify="space-between">
              <Grid item>
                <SelectRC onChange={this.onChange} {...otherProps} />
              </Grid>
              <Grid item></Grid>
            </Grid>
          </div>
          <div className={classes.item}>
            <Grid container className={classes.table}>
              <Grid item xs={6}>
                {this.props.intl.formatMessage({ id: "合约名称" })}
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                {this.state.sname}
              </Grid>
              <Grid item xs={6}>
                {this.props.intl.formatMessage({ id: "指数价格" })}
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                {this.state.index}
              </Grid>
              <Grid item xs={6}>
                {this.props.intl.formatMessage({ id: "资金费率" })}
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                {helper.digits((contractInfo.fundingRate || 0) * 100, 4)}%
              </Grid>
              <Grid item xs={6}>
                {this.props.intl.formatMessage({ id: "结算时间" })}
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                8{this.props.intl.formatMessage({ id: "小时" })}
              </Grid>
              <Grid item xs={6}>
                {this.props.intl.formatMessage({ id: "预计资金费率" })}
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                {helper.digits((contractInfo.settleRate || 0) * 100, 4)}%
              </Grid>
              <Grid item xs={6}>
                {this.props.intl.formatMessage({ id: "起始保证金" })}
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                {futuresRiskLimits[0]
                  ? helper.digits(
                      (futuresRiskLimits[0].initialMargin || 0) * 100,
                      2
                    )
                  : ""}
                %
              </Grid>
              <Grid item xs={6}>
                {this.props.intl.formatMessage({ id: "维持保证金" })}
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                {futuresRiskLimits[0]
                  ? helper.digits(
                      (futuresRiskLimits[0].maintainMargin || 0) * 100,
                      2
                    )
                  : ""}
                %
              </Grid>
              <Grid item xs={6}>
                {this.props.intl.formatMessage({ id: "最小价格变化" })}
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                {symbolInfo.minPricePrecision}
              </Grid>
              <Grid item xs={6}>
                {this.props.intl.formatMessage({ id: "最小委托数量" })}
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                {symbolInfo.minTradeQuantity}
              </Grid>
              <Grid item xs={6}>
                {this.props.intl.formatMessage({ id: "24H交易额" })}(
                {symbolInfo.quoteTokenName})
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                {this.state.quote.qv
                  ? Number(helper.digits(this.state.quote.qv, 2))
                  : "--"}
              </Grid>
              <Grid item xs={6}>
                {this.props.intl.formatMessage({ id: "24H交易量" })}(
                {this.props.intl.formatMessage({ id: "张" })})
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                {this.state.quote.v
                  ? Number(helper.digits(this.state.quote.v, 2))
                  : "--"}
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
