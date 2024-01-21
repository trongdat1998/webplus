// 融币借还记录列表
import React from "react";
import PropTypes from "prop-types";
import { Table } from "../../lib";
import { injectIntl } from "react-intl";
import moment from "moment";
import route_map from "../../config/route_map";

class OrderList extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.getMore = this.getMore.bind(this);
    this.update = this.update.bind(this);
  }
  componentDidMount() {
    this.init();
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.params.side !== nextProps.params.side ||
      this.props.params.time_range !== nextProps.params.time_range
    ) {
      this.update(nextProps);
    }
  }

  async update(nextProps) {
    await this.setState({
      params: nextProps.params,
    });
    this.getMore(true);
  }
  async init() {
    await this.setState({
      params: this.props.params,
    });
    this.getMore(true);
  }

  getMore(firstReq) {
    let params = this.state.params;
    params.firstReq = firstReq;
    this.props.dispatch({
      type: "lever/getHistoryOrder",
      payload: params,
    });
  }
  render() {
    const { classes } = this.props;
    const column_detail = [
      {
        title: this.props.intl.formatMessage({
          id: "借币时间",
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
          id: "币种",
        }),
        key: "symbolName",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "仓位类型",
        }),
        key: "type",
        render: (text, record) => {
          return (
            <span>
              {this.props.intl.formatMessage({
                id: text,
              })}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "借币数量",
        }),
        key: "",
      },
      {
        title: this.props.intl.formatMessage({
          id: "未还数量",
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
          id: "币息",
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
          id: "未还利息",
        }),
        key: "quantity",
        render: (text, record) => {
          return (
            <span>
              {text} {this.props.intl.formatMessage({ id: "张" })}
            </span>
          );
        },
      },
    ];
    let data = this.props.history_order;
    if (this.props.checked) {
      data = data.filter(
        (item) => item.symbolId == this.props.match.params.symbolId
      );
    }
    const userinfo = this.props.userinfo;
    return this.props.tab == "4" || !this.props.tab ? (
      <Table
        className={this.props.className}
        titles={column_detail}
        widthStyle={this.props.widthStyle}
        data={data}
        useWindow={this.props.useWindow}
        noResultText=""
        showNoMoreData={true}
        hasMore={
          !this.props.loading.effects["lever/getHistoryOrder"] &&
          this.props.history_order_more
        }
        getMore={this.getMore.bind(this, false)}
        loading={
          userinfo.userId
            ? Boolean(
                this.props.loading.effects["lever/getHistoryOrder"] ||
                  this.props.ws_order_req
              )
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
