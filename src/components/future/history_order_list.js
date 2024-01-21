// 永续合约 历史成交列表
import React from "react";
import PropTypes from "prop-types";
import { Table } from "../../lib";
import { injectIntl } from "react-intl";
import moment from "moment";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import CONST from "../../config/const";

class OrderList extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.getMore = this.getMore.bind(this);
  }
  componentDidMount() {
    this.init();
    this.updateData();
    
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.params.underlying_id !== nextProps.params.underlying_id ||
      this.props.params.side !== nextProps.params.side ||
      this.props.params.time_range !== nextProps.params.time_range
    ) {
      this.init(nextProps);
    }
  }
  async init(nextProps) {
    await this.setState({
      params: nextProps ? nextProps.params : this.props.params
    });
    this.getMore(true);
  }
  // http轮询
  async updateData() {
    // 下拉等待完成后再更新
    if (this.props.loading.effects["future/getOrders"]) {
      await helper.delay(200);
      return this.updateData();
    }
    // future/updateHistoryOrder 如果触发错误，直接抛出异常，后面的await就不执行了
    if (!this.props.tab || this.props.tab == 4) {
      try {
        await this.props.dispatch({
          type: "future/updateHistoryOrder",
          payload: { ...this.props.params }
        });
      } catch (err) {}
    }
    // 3s 后再次更新数据
    await helper.delay(3000);
    if (
      window.location.href.indexOf(route_map.future) > -1 ||
      window.location.href.indexOf(route_map.future_history_order) > -1
    ) {
      this.updateData();
    }
  }
  // 获取更多
  getMore(firstReq) {
    let params = this.state.params;
    params.firstReq = firstReq;
    params.function = "historyOrder";
    params.api = "futures_history_order";
    let obj = { ...params };
    delete obj.time_range;
    this.props.dispatch({
      type: "future/getOrders",
      payload: obj
    });
  }
  render() {
    const { classes, config } = this.props;
    let sideMap = CONST.sideMap;
    let symbols = config.symbols_obj.futures;
    const column_detail = [
      {
        title: this.props.intl.formatMessage({
          id: "合约"
        }),
        key: "symbolName",
        render: (text, record) => {
          return (
            <span data-tradeid={record.tradeId} data-orderid={record.orderId}>
              {text}
            </span>
          );
        }
      },
      {
        title: this.props.intl.formatMessage({
          id: "时间"
        }),
        key: "time",
        render: (text, record) => {
          return (
            <span>
              {moment
                .utc(Number(text))
                .local()
                .format("MM-DD HH:mm:ss")}
            </span>
          );
        }
      },
      // {
      //   title: this.props.intl.formatMessage({
      //     id: "杠杆"
      //   }),
      //   key: "leverage",
      //   render: (text, record) => {
      //     // 平仓单不显示杠杆
      //     if (record.side.indexOf("CLOSE") > -1) {
      //       return <span>--</span>;
      //     }
      //     debugger
      //     return text ? <span>{text}X</span> : <span>--</span>
      //   }
      // },
      {
        title: this.props.intl.formatMessage({
          id: "方向"
        }),
        key: "side",
        render: (text, record) => {
          return (
            <span>
              {sideMap[text]
                ? this.props.intl.formatMessage({
                    id: sideMap[text]
                  })
                : ""}
            </span>
          );
        }
      },
      {
        title: `${this.props.intl.formatMessage({
          id: "成交数量"
        })}(${this.props.intl.formatMessage({ id: "张" })})`,
        key: "quantity",
        render: (text, record) => {
          return <span>{text}</span>;
        }
      },
      {
        title: this.props.intl.formatMessage({
          id: "成交价格"
        }),
        key: "price",
        render: (text, record) => {
          return (
            <span>
              {text}{" "}
              {symbols[record.symbolId] &&
              symbols[record.symbolId]["baseTokenFutures"]
                ? symbols[record.symbolId]["baseTokenFutures"]["displayTokenId"]
                : ""}
            </span>
          );
        }
      },
      {
        title: this.props.intl.formatMessage({ id: "盈亏" }),
        key: "pnl",
        render: (text, record) => {
          return (
            <p>
              {text} {record.quoteTokenName}
            </p>
          );
        }
      },
      {
        title: this.props.intl.formatMessage({
          id: "手续费"
        }),
        key: "fee",
        render: (text, record) => {
          return (
            <span>
              {text} {record.feeTokenName}
            </span>
          );
        }
      }
    ];
    let data = this.props.history_order;
    if (!this.props.checked) {
      data = data.filter(
        item => item.symbolId == this.props.match.params.symbolId
      ); // 当前永续合约id
    }
    if (this.props.params.order_type) {
      data = data.filter(item => item.type == this.props.params.order_type);
    }
    if (this.props.params.time_range && this.props.sever_time) {
      const server_time = this.props.sever_time;
      const w = 7 * 24 * 60 * 60 * 1000;
      data = data.filter(item => {
        if (this.props.params.time_range == "1w") {
          return server_time - item.time <= w;
        } else {
          return server_time - item.time >= w;
        }
      });
    }
    // 强平单不显示
    data = data.filter(item => item.liquidationType != "IOC");
    const userinfo = this.props.userinfo;
    return (
      <div>
        {this.props.tab == "4" || !this.props.tab ? (
          <Table
            titles={column_detail}
            widthStyle={classes.history_trade_table_width}
            data={(
              helper.excludeRepeatArray("tradeId", data, "time") || []
            ).sort((a, b) => (a.time - b.time > 0 ? -1 : 1))}
            useWindow={this.props.useWindow}
            noResultText=""
            showNoMoreData={true}
            hasMore={
              !this.props.loading.effects["future/getOrders"] &&
              this.props.history_order_more
            }
            getMore={this.getMore.bind(this, false)}
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["future/getOrders"])
                : false
            }
            className={this.props.tab == "4" ? classes.commonTable : ""}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
OrderList.propTypes = {
  classes: PropTypes.object.isRequired
};
export default injectIntl(OrderList);
