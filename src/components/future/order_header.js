// 订单header
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "./order_style";
import route_map from "../../config/route_map";
import { injectIntl } from "react-intl";

class OrderHeader extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {}

  render() {
    const { classes } = this.props;
    const pathname = window.location.pathname;
    return (
      <ul>
        <li
          className={
            pathname == route_map.future_position ? "active" : ""
          }
        >
          <a href={route_map.future_position}>
            {this.props.intl.formatMessage({ id: "当前持仓" })}
          </a>
        </li>
        <li
          className={
            pathname == route_map.future_current_entrust ? "active" : ""
          }
        >
          <a href={route_map.future_current_entrust}>
            {this.props.intl.formatMessage({ id: "未完成委托" })}
          </a>
        </li>
        <li
          className={
            pathname == route_map.future_history_entrust ? "active" : ""
          }
        >
          <a href={route_map.future_history_entrust}>
            {this.props.intl.formatMessage({ id: "历史委托" })}
          </a>
        </li>
        <li
          className={pathname == route_map.future_history_order ? "active" : ""}
        >
          <a href={route_map.future_history_order}>
            {this.props.intl.formatMessage({ id: "历史成交" })}
          </a>
        </li>
      </ul>
    );
  }
}
OrderHeader.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(injectIntl(OrderHeader));
