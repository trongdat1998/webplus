import React from "react";
import classnames from "classnames";
import helper from "../../../utils/helper";
import { injectIntl } from "react-intl";
import WSDATA from "../../../models/data_source";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { Grid } from "@material-ui/core";
import CONST from "../../../config/const";
import route_map from "../../../config/route_map";

class MenuRC extends React.Component {
  constructor() {
    super();
  }
  render() {
    const pathname = window.location.pathname;
    const { classes } = this.props;
    return (
      <div className={classes.menu}>
        <div>{this.props.intl.formatMessage({ id: "历史数据" })}</div>
        <ul>
          <li>
            <a
              href={route_map.future_history_data_index}
              className={
                pathname.indexOf(route_map.future_history_data_index) > -1
                  ? "on"
                  : ""
              }
            >
              {this.props.intl.formatMessage({ id: "指数价格" })}
            </a>
          </li>
          <li>
            <a
              href={route_map.future_history_data_rate}
              className={
                pathname.indexOf(route_map.future_history_data_rate) > -1
                  ? "on"
                  : ""
              }
            >
              {this.props.intl.formatMessage({ id: "资金费率" })}
            </a>
          </li>
          <li>
            <a
              href={route_map.future_history_data_funding}
              className={
                pathname.indexOf(route_map.future_history_data_funding) > -1
                  ? "on"
                  : ""
              }
            >
              {this.props.intl.formatMessage({ id: "保险基金" })}
            </a>
          </li>
        </ul>
        <br />
        <br />
        <div>{this.props.intl.formatMessage({ id: "合约帮助" })}</div>
        <ul>
          <li>
            <a
              href={route_map.future_history_data_info}
              className={
                pathname.indexOf(route_map.future_history_data_info) > -1
                  ? "on"
                  : ""
              }
            >
              {this.props.intl.formatMessage({ id: "合约介绍" })}
            </a>
          </li>
          {/* <li>
            <a
              href={route_map.future_history_data_qa}
              className={
                pathname.indexOf(route_map.future_history_data_qa) > -1
                  ? "on"
                  : ""
              }
            >
              {this.props.intl.formatMessage({ id: "常见问题" })}
            </a>
          </li> */}
        </ul>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(MenuRC));
