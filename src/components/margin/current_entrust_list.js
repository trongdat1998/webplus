// 当前委托列表
import React from "react";
import PropTypes from "prop-types";
import { Table } from "../../lib";
import { injectIntl } from "react-intl";
import moment from "moment";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import math from "../../utils/mathjs";
import WSDATA from "../../models/data_source";
import CONST from "../../config/const";
class OrderList extends React.Component {
  constructor() {
    super();
    this.state = {
      params: {},
    };
    this.getMore = this.getMore.bind(this);
  }
  componentDidMount() {
    this.first();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      params: nextProps.params,
    });
  }

  // 获取更多
  getMore(firstReq) {
    let params = this.state.params;
    params.firstReq = firstReq;
    this.props.dispatch({
      type: "lever/getCurrentEntrust",
      payload: params,
    });
  }
  async cancel(id) {
    await this.props.dispatch({
      type: "lever/cancelOrder",
      payload: {
        order_id: id,
        client_order_id: new Date().getTime(),
      },
    });
  }
  async goto(exchangeId, symbolId) {
    const busdt =
      window.location.pathname.indexOf(route_map.option_busdt) > -1
        ? true
        : false;
    let url =
      (busdt ? route_map.option_busdt : route_map.lever) + "/" + symbolId;
    if (
      window.location.pathname.indexOf(route_map.option_current_entrust) > -1
    ) {
      window.location.href = url;
      return;
    }
    this.props.history.push(url);

    let symbol_info = this.props.config.symbols_obj.lever[symbolId] || {};
    let token2 = symbol_info.quoteTokenId;
    let token2_name = symbol_info.quoteTokenName;

    const symbol_quote = this.props.symbol_quote;
    const tokenInfo = symbol_quote[symbolId] || {};
    await this.props.dispatch({
      type: "lever/handleChange",
      payload: {
        symbol_id: symbolId, // 币对id
        exchange_id: exchangeId,
        sale_quantity: "",
        sale_price: tokenInfo.c || "",
        sale_progress: 0,
        buy_quantity: "",
        buy_price: tokenInfo.c || "",
        buy_progress: 0,
        token2,
        token2_name,
        option_info: symbol_info,
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
    WSDATA.clearAll("qws");
    this.props.dispatch({
      type: "ws/save",
      payload: {
        merged_depth: {},
        depth: {},
        trades: {},
      },
    });
  }
  render() {
    const { classes } = this.props;
    const column_detail = [
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "time",
        render: (text, record) => {
          return (
            <span>
              {moment
                .utc(Number(record.time))
                .local()
                .format("YYYY/MM/DD HH:mm")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "交易类型",
        }),
        key: "type",
        render: (text, record) => {
          return (
            <span>
              {this.props.intl.formatMessage({
                id: text == "LIMIT" ? "限价" : "市价",
              })}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "市场",
        }),
        key: "symbolName",
        render: (text, record) => {
          return (
            <span
              onClick={this.goto.bind(
                this,
                record.exchangeId,
                record.symbolId,
                record.quoteTokenId
              )}
              style={{ cursor: "pointer" }}
            >
              {text}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "方向",
        }),
        key: "side",
        render: (text, record) => {
          return (
            <span className={text === "BUY" ? classes.up : classes.down}>
              {this.props.intl.formatMessage({
                id: text === "BUY" ? "做多" : "做空",
              })}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "价格",
        }),
        key: "price",
        render: (text, record) => {
          return (
            <span>
              {text} {record.quoteTokenId}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "数量",
        }),
        key: "origQty",
        render: (text, record) => {
          return (
            <span>
              {Math.abs(text)} {this.props.intl.formatMessage({ id: "张" })}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "金额",
        }),
        key: "amount",
        render: (text, record) => {
          return (
            <span>
              {text} {record.quoteTokenId}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "已成交数量",
        }),
        key: "executedQty",
        render: (text, record) => {
          return (
            <span>
              {text} {this.props.intl.formatMessage({ id: "张" })}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "未成交数量",
        }),
        key: "describe",
        render: (text, record) => {
          return (
            <span>
              {math
                .chain(math.bignumber(Math.abs(record.origQty)))
                .subtract(math.bignumber(record.executedQty))
                .format({
                  notation: "fixed",
                })
                .done()}{" "}
              {this.props.intl.formatMessage({ id: "张" })}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "orderId",
        render: (text, record) => {
          return (
            <span
              className={classes.operate}
              onClick={this.cancel.bind(this, record.orderId)}
            >
              {this.props.intl.formatMessage({
                id: "撤单",
              })}
            </span>
          );
        },
      },
    ];
    let data = this.props.current_list;
    if (this.props.checked) {
      data = data.filter(
        (item) => item.symbolId == this.props.match.params.symbolId
      );
    }
    const userinfo = this.props.userinfo;
    return this.props.tab === "1" || !this.props.tab ? (
      <Table
        className={this.props.className}
        titles={column_detail}
        widthStyle={this.props.widthStyle}
        data={(
          helper.excludeRepeatArray("orderId", data, "time") || []
        ).sort((a, b) => (a.time - b.time > 0 ? -1 : 1))}
        useWindow={this.props.useWindow}
        noResultText=""
        hasMore={this.props.current_more}
        showNoMoreData={true}
        getMore={this.getMore.bind(this, false)}
        loading={
          userinfo.userId
            ? Boolean(this.props.loading.effects["lever/getCurrentEntrust"])
            : false
        }
      />
    ) : (
      <div />
    );
  }
}
OrderList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default injectIntl(OrderList);
