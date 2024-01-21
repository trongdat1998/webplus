// 持仓
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Table } from "../../lib";
import { injectIntl } from "react-intl";
import moment from "moment";
import styles from "./order_style";
import route_map from "../../config/route_map";
import { MenuItem, Select } from "@material-ui/core";

class Order extends React.Component {
  constructor() {
    super();
    this.state = {
      underlying_id: "",
    };
    this.getMore = this.getMore.bind(this);
  }
  componentDidMount() {
    this.getMore(true);
  }
  async handleChange(type, e) {
    await this.setState({
      [type]: e.target.value,
    });
    this.getMore(true);
  }
  // 获取更多
  getMore(firstReq) {
    let params = this.state;
    params.firstReq = firstReq;
    params.function = "delivery";
    params.api = "futures_delivery_order";
    this.props.dispatch({
      type: "future/getOrders",
      payload: params,
    });
  }
  render() {
    const { classes, userinfo, delivery_order, delivery_more } = this.props;
    const column_detail = [
      {
        title: this.props.intl.formatMessage({
          id: "合约",
        }),
        key: "symbolName",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "settlementTime",
        render: (text, record) => {
          return (
            <span>
              {moment.utc(Number(text)).local().format("YYYY/MM/DD HH:mm")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "状态",
        }),
        key: "status",
        render: (text, record) => {
          return (
            <span>
              {this.props.intl.formatMessage({
                id: text == "DOING" ? "交割完成" : "交割中",
              })}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "交割指数",
        }),
        key: "indice",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
    ];
    return (
      <div className={classes.order}>
        <h2>{this.props.intl.formatMessage({ id: "永续合约" })}</h2>
        <div className={classes.order_header}>
          <ul>
            <li className="active">
              <a href={route_map.future_delivery}>
                {this.props.intl.formatMessage({ id: "交割记录" })}
              </a>
            </li>
            <li>
              <a href={route_map.future_insurance_fund}>
                {this.props.intl.formatMessage({ id: "保险基金" })}
              </a>
            </li>
          </ul>
          <div className={classes.action_position}>
            <Select
              value={this.state.underlying_id}
              onChange={this.handleChange.bind(this, "underlying_id")}
              className={classes.select}
              classes={{ icon: classes.icon }}
              displayEmpty
              inputProps={{
                name: "underlying_id",
                id: "underlying_id",
              }}
            >
              <MenuItem value="" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "全部" })}
              </MenuItem>
              {this.props.target_list.length
                ? this.props.target_list.map((item) => {
                    return (
                      <MenuItem
                        value={item.id}
                        key={item.id}
                        className={classes.menuItem}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  })
                : ""}
            </Select>
          </div>
        </div>
        <Table
          titles={column_detail}
          data={delivery_order}
          widthStyle={classes.order_table_width1}
          useWindow={false}
          noResultText=""
          showNoMoreData={true}
          hasMore={
            !this.props.loading.effects["future/getOrders"] && delivery_more
          }
          loading={
            userinfo.userId
              ? Boolean(this.props.loading.effects["future/getOrders"])
              : false
          }
          getMore={this.getMore.bind(this, false)}
        />
      </div>
    );
  }
}
Order.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(injectIntl(Order));
