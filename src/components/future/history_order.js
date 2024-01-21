// 历史成交
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./order_style";
import List from "./history_order_list";
import Header from "./order_header";
import helper from "../../utils/helper";

class Order extends React.Component {
  constructor() {
    super();
    this.state = {
      underlying_id: "",
      side: "",
      order_type: "LIMIT",
      time_range: "",
    };
  }
  componentDidMount() {}

  handleChange(type, e) {
    this.setState({
      [type]: e.target.value,
    });
  }

  changeTime(type) {
    this.setState({
      time_range: type,
    });
  }

  render() {
    const { classes } = this.props;
    let params = this.state;
    return (
      <div className={classes.order}>
        <h2>{this.props.intl.formatMessage({ id: "永续合约订单" })}</h2>
        <div className={classes.order_header}>
          <Header />
          <div className={classes.action_position}>
            {/* <Select
              value={this.state.order_type}
              onChange={this.handleChange.bind(this, "order_type")}
              className={classes.select}
              classes={{ icon: classes.icon }}
              displayEmpty
              inputProps={{
                name: "order_type",
                id: "order_type"
              }}
            >
              <MenuItem value="LIMIT" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "普通委托" })}
              </MenuItem>
              <MenuItem value="STOP" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "计划委托" })}
              </MenuItem>
            </Select> */}
            {/* <Select
              value={this.state.underlying_id}
              onChange={this.handleChange.bind(this, "underlying_id")}
              className={classes.select}
              classes={{ icon: classes.icon }}
              displayEmpty
              inputProps={{
                name: "underlying_id",
                id: "underlying_id"
              }}
            >
              <MenuItem value="" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "全部" })}
              </MenuItem>
              {this.props.target_list.length
                ? this.props.target_list.map(item => {
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
            </Select> */}
            {/* <Select
              value={this.state.side}
              onChange={this.handleChange.bind(this, "side")}
              className={classes.select}
              classes={{ icon: classes.icon }}
              displayEmpty
              inputProps={{
                name: "side",
                id: "side"
              }}
            >
              <MenuItem value="" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "全部" })}
              </MenuItem>
              <MenuItem value="BUY_OPEN" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "买入开多" })}
              </MenuItem>
              <MenuItem value="SELL_OPEN" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "卖出平多" })}
              </MenuItem>
              <MenuItem value="BUY_CLOSE" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "买入平空" })}
              </MenuItem>
              <MenuItem value="SELL_CLOSE" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "卖出平空" })}
              </MenuItem>
            </Select>*/}
            {/* <div className={classes.time_select}>
              <span
                className={this.state.time_range == "1w" ? "active" : ""}
                onClick={this.changeTime.bind(this, "1w")}
              >
                {this.props.intl.formatMessage({ id: "最近一周" })}
              </span>
              <span
                className={this.state.time_range == "1w" ? "" : "active"}
                onClick={this.changeTime.bind(this, "-1w")}
              >
                {this.props.intl.formatMessage({ id: "一周以前" })}
              </span>
            </div> */}
          </div>
        </div>
        <List
          params={params}
          classes={classes}
          {...this.props}
          checked={true}
          useWindow={false}
        />
      </div>
    );
  }
}
Order.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(injectIntl(Order));
