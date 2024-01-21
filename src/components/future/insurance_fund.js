// 保险基金
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
      coin_token_id: "",
    };
    this.getMore = this.getMore.bind(this);
  }
  componentDidMount() {
    this.init();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.fund_list.length !== this.props.fund_list.length ||
      nextProps.fund_more !== this.props.fund_more ||
      nextProps.userinfo.userId !== this.props.userinfo.userId ||
      nextState.coin_token_id !== this.state.coin_token_id ||
      nextProps.loading.effects["future/getOrders"] !==
        this.props.loading.effects["future/getOrders"]
    ) {
      return true;
    }
    return false;
  }
  async handleChange(type, e) {
    await this.setState({
      [type]: e.target.value,
    });
    this.getMore(true);
  }
  async init() {
    if (this.props.futures_coin_token.length) {
      await this.setState({
        coin_token_id:
          this.state.coin_token_id || this.props.futures_coin_token[0],
      });
    }
    this.getMore(true);
  }
  // 获取更多
  getMore(firstReq) {
    let params = this.state;
    params.firstReq = firstReq;
    params.function = "fund";
    params.api = "futures_fund_order";
    this.props.dispatch({
      type: "future/getOrders",
      payload: params,
    });
  }

  render() {
    const { classes, userinfo, fund_list, fund_more } = this.props;
    const column_detail = [
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "time",
        render: (text, record) => {
          return (
            <span>
              {moment.utc(Number(text)).local().format("YYYY/MM/DD HH:mm")}
            </span>
          );
        },
      },
      {
        title:
          this.props.intl.formatMessage({
            id: "余额",
          }) + this.state.coin_token_id,
        key: "availableValue",
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
            {/* <li>
              <a href={route_map.future_delivery}>
                {this.props.intl.formatMessage({ id: "交割记录" })}
              </a>
            </li> */}
            <li className="active">
              <a href={route_map.future_insurance_fund}>
                {this.props.intl.formatMessage({ id: "保险基金" })}
              </a>
            </li>
          </ul>
          <div className={classes.action_position}>
            <Select
              value={this.state.coin_token_id}
              onChange={this.handleChange.bind(this, "coin_token_id")}
              className={classes.select}
              classes={{ icon: classes.icon }}
              displayEmpty
              inputProps={{
                name: "coin_token_id",
                id: "coin_token_id",
              }}
            >
              {this.props.futures_coin_token.length
                ? this.props.futures_coin_token.map((item) => {
                    return (
                      <MenuItem
                        value={item}
                        className={classes.menuItem}
                        key={item}
                      >
                        {item}
                      </MenuItem>
                    );
                  })
                : ""}
            </Select>
          </div>
        </div>
        <Table
          titles={column_detail}
          data={fund_list}
          widthStyle={classes.order_table_width1}
          useWindow={false}
          noResultText=""
          showNoMoreData={true}
          hasMore={!this.props.loading.effects["future/getOrders"] && fund_more}
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
