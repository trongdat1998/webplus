// 订单header
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";

import styles from "./order.style";
import route_map from "../../config/route_map";

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
            pathname == route_map.lever_current_entrust ? "active" : ""
          }
        >
          <a href={route_map.lever_current_entrust}>
            {this.props.intl.formatMessage({ id: "当前委托" })}
          </a>
        </li>
        <li
          className={
            pathname == route_map.lever_history_entrust ? "active" : ""
          }
        >
          <a href={route_map.lever_history_entrust}>
            {this.props.intl.formatMessage({ id: "历史委托" })}
          </a>
        </li>
        <li
          className={pathname == route_map.lever_history_order ? "active" : ""}
        >
          <a href={route_map.lever_history_order}>
            {this.props.intl.formatMessage({ id: "历史成交" })}
          </a>
        </li>
        <li
          className={pathname == route_map.lever_margin_order ? "active" : ""}
        >
          <a href={route_map.lever_margin_order}>
            {this.props.intl.formatMessage({ id: "借还记录" })}
          </a>
        </li>
      </ul>
    );
  }
}
OrderHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(injectIntl(OrderHeader));
