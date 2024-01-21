// 杠杆最新成交
import React from "react";
import moment from "moment";
import { injectIntl } from "react-intl";
import helper from "../../utils/helper";
import WSDATA from "../../models/data_source";
import CONST from "../../config/const";
import { withStyles } from "@material-ui/core/styles";
import styles from "../public/quote_style";

let refresh_time = new Date().getTime();

class LastTrading extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
      refresh_status: 0,
    };
    this.click = this.click.bind(this);
  }
  componentDidMount() {
    this.update();
  }
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
  // 200ms 更新一次当前价格
  update = async () => {
    await helper.delay(CONST.refresh_trade);
    this.setState({
      refresh_status: 1 - this.state.refresh_status,
    });
    this.update();
  };
  shouldComponentUpdate(preProps, preState) {
    if (
      preProps.symbol_id != this.props.symbol_id ||
      preState.refresh_status != this.state.refresh_status
    ) {
      return true;
    }
    return false;
  }
  componentWillUnmount() {
    this.cancel("trade" + this.props.exchange_id + "." + this.props.symbol_id);
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
    this.props.dispatch({
      type: "lever/handleChange",
      payload: {
        sale_price: p,
        buy_price: p,
        hasAnimation: true,
      },
    });
    const that = this;
    setTimeout(() => {
      that.props.dispatch({
        type: "lever/handleChange",
        payload: {
          hasAnimation: false,
        },
      });
    }, 1000);
  }
  render() {
    //window.console.log("lastTrading render");
    const { classes } = this.props;
    let palette2 = window.palette2[localStorage.quoteMode];
    if (!this.props.match.params.token1 || !this.props.match.params.token2) {
      return <div className={classes.lists} />;
    }
    const token1 = this.props.match.params.token1.toUpperCase();
    const token2 = this.props.match.params.token2.toUpperCase();
    const token1_name = this.props.tokens[token1]
      ? this.props.tokens[token1]["tokenName"]
      : "";
    const token2_name = this.props.tokens[token2]
      ? this.props.tokens[token2]["tokenName"]
      : "";
    const data = helper.excludeRepeatArray(
      "v",
      (WSDATA.getData("newTradeSource") || {})[
        "trade" + this.props.exchange_id + "." + this.props.symbol_id
      ] || []
    );
    const width = window.document.documentElement.offsetWidth;
    return (
      <div className={classes.lists}>
        {width > 1850 ? (
          <div className={classes.handicap_title}>
            <span style={{ color: palette2.white }}>
              {this.props.intl.formatMessage({
                id: "最新成交",
              })}
            </span>
          </div>
        ) : (
          ""
        )}
        <ol className={classes.header}>
          <li>
            {this.props.intl.formatMessage({
              id: "时间",
            })}
          </li>
          {/* <li span={4}>
            {this.props.intl.formatMessage({
              id: "方向"
            })}
          </li> */}
          <li>
            {this.props.intl.formatMessage({
              id: "价格",
            })}
            ({token2_name})
          </li>
          <li>
            {this.props.intl.formatMessage({
              id: "数量",
            })}
            ({token1_name})
          </li>
        </ol>
        <div className="list">
          {data.map((item, i) => {
            return (
              <ul key={item.v} onClick={this.click.bind(this, item.m, item.p)}>
                <li>{moment.utc(item.t).local().format("HH:mm:ss")}</li>
                {/* <li span={4} style={{ color: item.m ? "#51d372" : "#f73a46" }}>
                  {item.m
                    ? this.props.intl.formatMessage({
                        id: "买入"
                      })
                    : this.props.intl.formatMessage({
                        id: "卖出"
                      })}
                </li> */}
                <li className={item.m ? classes.up : classes.down}>
                  {helper.digits(item.p, this.props.max_digits)}
                </li>
                <li>{helper.digits(item.q, this.props.base_precision)}</li>
              </ul>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(LastTrading));
