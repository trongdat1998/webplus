import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Button, Menu, MenuItem } from "@material-ui/core";

import styles from "./finance_header_style";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import { Iconfont } from "../../lib";

class FinanceHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
  }
  componentDidMount() {}
  change = () => {
    window.localStorage.hidden_balance = !this.props.hidden_balance;
    this.props.dispatch({
      type: "layout/save",
      payload: {
        hidden_balance: !this.props.hidden_balance,
      },
    });
  };
  handleToggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };
  close = () => {
    this.setState({
      open: false,
    });
  };
  goto = (key) => (e) => {
    window.location.href = route_map.trace_back + "/" + key;
  };
  render() {
    const { classes, functions, userinfo, tab } = this.props;
    let unit = this.props.total_asset ? this.props.total_asset.unit : "";
    const totalAssetRates =
      this.props.total_asset && this.props.total_asset.totalAsset
        ? helper.currencyValue(
            this.props.rates,
            this.props.total_asset.totalAsset,
            this.props.total_asset.unit
          )
        : ["", ""];
    return (
      <div className={classes.finance_title_box}>
        <div className={classes.finance_title_con}>
          <div className={classes.finance_title}>
            <h2>{this.props.intl.formatMessage({ id: "我的资产" })}</h2>
            <p className={classes.info}>
              <span>
                {this.props.intl.formatMessage({ id: "总资产折合" })}(
                {this.props.total_asset ? this.props.total_asset.unit : ""})
                {this.props.hidden_balance ? (
                  <Iconfont type="hidden" size={24} onClick={this.change} />
                ) : (
                  <Iconfont type="unhidden" size={24} onClick={this.change} />
                )}
              </span>
              {this.props.total_asset && this.props.total_asset.totalAsset
                ? this.props.hidden_balance
                  ? "********"
                  : helper.digits(
                      this.props.total_asset.totalAsset,
                      unit == "BTC" ? 8 : 2
                    )
                : ""}{" "}
              {this.props.total_asset &&
              this.props.total_asset.totalAsset &&
              this.props.rates[this.props.total_asset.unit]
                ? `≈ ${totalAssetRates[0]}${
                    this.props.hidden_balance ? "********" : totalAssetRates[1]
                  }`
                : ""}
            </p>
            <Button
              variant="outlined"
              color="primary"
              href={route_map.finance_record}
            >
              {this.props.intl.formatMessage({ id: "资产记录" })}
            </Button>
          </div>
          <div className={classes.header}>
            <ul>
              <li className={tab == "exchange" ? "active" : ""}>
                <a href={route_map.finance_list}>
                  {this.props.intl.formatMessage({ id: "钱包资产" })}
                </a>
              </li>
              {functions && functions["futures"] ? (
                <li className={tab == "future" ? "active" : ""}>
                  <a href={route_map.future_finance}>
                    {this.props.intl.formatMessage({ id: "永续合约资产" })}
                  </a>
                </li>
              ) : (
                ""
              )}
              {functions && functions["margin"] ? (
                <li className={this.props.tab == "lever" ? "active" : ""}>
                  <a href={route_map.margin_finance}>
                    {this.props.intl.formatMessage({ id: "杠杆资产" })}
                  </a>
                </li>
              ) : (
                ""
              )}
              {functions && functions["bonus"] ? (
                <li className={tab == "bonus" ? "active" : ""}>
                  <a href={route_map.staking_finance}>
                    {this.props.intl.formatMessage({ id: "币多多资产" })}
                  </a>
                </li>
              ) : (
                ""
              )}
              {functions && functions["showSubAcco"] ? (
                <li className={tab == "child" ? "active" : ""}>
                  <a href={route_map.finance_child_account}>
                    {this.props.intl.formatMessage({ id: "子账户资产" })}
                  </a>
                </li>
              ) : (
                ""
              )}
              {userinfo.leader == 1 ? (
                <li className={tab == "activity" ? "active" : ""}>
                  <a href={route_map.finance_activity_account}>
                    {this.props.intl.formatMessage({ id: "活动账户" })}
                  </a>
                </li>
              ) : (
                ""
              )}
            </ul>
            {/localhost/i.test(window.location.href) ? (
              <Button
                ref={(ref) => (this.anchorRef = ref)}
                onClick={this.handleToggle}
                variant="outlined"
                color="primary"
                style={{ lineHeight: 1, height: 32 }}
              >
                {this.props.intl.formatMessage({ id: "资产证明" })}
                <Iconfont type="arrowDown" />
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <Menu
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          keepMounted
          open={this.state.open}
          anchorEl={this.anchorRef}
          onClose={this.close}
        >
          <MenuItem onClick={this.goto("BTC")} className={classes.menu_hover}>
            {this.props.intl.formatMessage({ id: "BTC资产证明" })}
          </MenuItem>
          <MenuItem onClick={this.goto("ETH")} className={classes.menu_hover}>
            {this.props.intl.formatMessage({ id: "ETH资产证明" })}
          </MenuItem>
          <MenuItem onClick={this.goto("USDT")} className={classes.menu_hover}>
            {this.props.intl.formatMessage({ id: "USDT资产证明" })}
          </MenuItem>
        </Menu>
      </div>
    );
  }
}
FinanceHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(injectIntl(FinanceHeader));
