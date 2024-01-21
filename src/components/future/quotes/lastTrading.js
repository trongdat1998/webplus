// 最新成交
import React from "react";
import moment from "moment";
import { injectIntl } from "react-intl";
import helper from "../../../utils/helper";
import WSDATA from "../../../models/data_source";
import CONST from "../../../config/const";
import { withStyles } from "@material-ui/core/styles";
import styles from "./quote_style";

class LastTrading extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
    };
    this.click = this.click.bind(this);
  }
  componentDidMount() {}
  componentDidUpdate(preProps) {
    if (
      this.props.qws &&
      !this.state.subed &&
      this.props.exchange_id &&
      this.props.symbol_id
    ) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.sub(this.props.exchange_id, this.props.symbol_id);
        }
      );
    }
    // symbol_id,exchange_id变化时，取消之前的订阅，重新订阅，重置digit
    if (
      (this.props.symbol_id != preProps.symbol_id ||
        this.props.exchange_id != preProps.exchange_id) &&
      preProps.symbol_id &&
      preProps.exchange_id
    ) {
      // 取消之前的订阅
      if (preProps.exchange_id && preProps.symbol_id) {
        this.cancel("trade" + preProps.exchange_id + "." + preProps.symbol_id);
      }
      // 重新订阅
      this.sub(this.props.exchange_id, this.props.symbol_id);
    }
  }
  sub = (exchange_id, symbol_id) => {
    this.props.qws.sub(
      {
        id: "trade" + exchange_id + "." + symbol_id,
        topic: "trade",
        event: "sub",
        limit: CONST["trade_limit"],
        symbol: exchange_id + "." + symbol_id,
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
    if (this.props.qws && id) {
      this.props.qws.cancel(id);
    }
  };
  httpAction = async (payload) => {
    await this.props.dispatch({
      type: "ws/trade_http",
      payload: {
        symbol: this.props.exchange_id + "." + this.props.symbol_id,
        limit: CONST["trade_limit"],
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
    if (data.f) {
      WSDATA.clear("newTradeSource");
    }
    data.data &&
      data.data.length &&
      WSDATA.setData("newTradeSource", data.data, data.id);
  };
  click(m, p) {
    const price = helper.digits(p, this.props.max_digits);
    let position_list = [];
    // 价格写入到当前持仓价格框
    if (this.props.position_list && this.props.position_list.length) {
      this.props.position_list.map((item) => {
        let d = { ...item };
        // id相同，且没有主动填值
        if (item.symbolId == this.props.symbol_id) {
          d.exitPrice = p;
        }
        position_list.push(d);
      });
    }
    let data = {
      type: "future/handleChange",
      payload: {
        sale_price: price,
        buy_price: price,
        hasAnimation: true,
      },
    };
    if (position_list.length) {
      data.payload = { ...data.payload, position_list };
    }
    this.props.dispatch(data);
    const that = this;
    setTimeout(() => {
      that.props.dispatch({
        type: "future/handleChange",
        payload: {
          hasAnimation: false,
        },
      });
    }, 1000);
  }
  render() {
    //window.console.log("lastTrading render");
    const { classes } = this.props;
    let palette2 = window.palette2[localStorage.futureQuoteMode];
    if (!this.props.match.params.symbolId) {
      return <div className={classes.lists} />;
    }
    const symbolId = this.props.match.params.symbolId.toUpperCase();
    const symbol_info = this.props.config.symbols_obj.all[symbolId];
    const token2_name = symbol_info.quoteTokenName;

    const data = helper.excludeRepeatArray(
      "v",
      (WSDATA.getData("newTradeSource") || {})[
        "trade" + this.props.exchange_id + "." + this.props.symbol_id
      ] || []
    );
    const width = window.document.documentElement.offsetWidth;
    return (
      <div className={classes.lists}>
        {/* {width > 1440 ? */}
        <div className={classes.handicap_title}>
          <span style={{ color: palette2.white }}>
            {this.props.intl.formatMessage({
              id: "最新成交",
            })}
          </span>
        </div>
        {/* : ""
        } */}
        <ol className={classes.header}>
          <li>
            {this.props.intl.formatMessage({
              id: "价格",
            })}
            (
            {symbol_info.baseTokenFutures
              ? symbol_info.baseTokenFutures.displayTokenId
              : ""}
            )
          </li>
          <li>
            {this.props.intl.formatMessage({
              id: "数量",
            })}
            ({this.props.intl.formatMessage({ id: "张" })})
          </li>
          <li>
            {this.props.intl.formatMessage({
              id: "成交时间",
            })}
          </li>
        </ol>
        <div className="list">
          {data.map((item, i) => {
            return (
              <ul key={item.v} onClick={this.click.bind(this, item.m, item.p)}>
                <li className={item.m ? classes.up : classes.down}>
                  {helper.digits(item.p, this.props.max_digits)}
                </li>
                <li>{helper.digits(item.q, this.props.base_precision)}</li>
                <li>{moment.utc(item.t).local().format("HH:mm:ss")}</li>
              </ul>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(LastTrading));
