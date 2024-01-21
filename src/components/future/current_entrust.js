// 未完成委托
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./order_style";
import helper from "../../utils/helper";
import { Select, MenuItem } from "@material-ui/core";
import List from "./current_entrust_list";
import Header from "./order_header";

class Order extends React.Component {
  constructor() {
    super();
    this.state = {
      // modalOpen: false,
      underlying_id: "",
      side: "",
      order_type: "LIMIT",
      time_range: "",
    };
  }
  componentDidMount() {
    // 启动订阅
    //this.sub();
    this.update();
  }
  async update() {
    // future/updatePositionOrder 如果触发错误，直接抛出异常，后面的await就不执行了
    try {
      await this.props.dispatch({
        type: "future/updateCurrentEntrust",
        payload: {
          order_type: this.state.order_type,
        },
      });
    } catch (err) {}
    // 3s 后再次更新数据
    await helper.delay(3000);
    this.update();
  }

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
            <Select
              value={this.state.order_type}
              onChange={this.handleChange.bind(this, "order_type")}
              className={classes.select}
              classes={{ icon: classes.icon }}
              displayEmpty
              inputProps={{
                name: "order_type",
                id: "order_type",
              }}
            >
              <MenuItem value="LIMIT" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "普通委托" })}
              </MenuItem>
              <MenuItem value="STOP" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "计划委托" })}
              </MenuItem>
              <MenuItem value="STOP_LOSS" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "止盈止损" })}
              </MenuItem>
            </Select>
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
