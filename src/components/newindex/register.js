// 首页
import React from "react";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style.js";

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      account: ""
    };
    this.gotoRegister = this.gotoRegister.bind(this);
  }
  change(e) {
    let v = e.target.value;
    this.setState({
      account: v
    });
  }
  gotoRegister() {
    window.location.href = `${route_map.register}?account=${this.state.account}`;
  }
  render() {
    const { classes, index_config } = this.props;
    const indexModules = index_config.indexModules || {};
    const quickRegistration = indexModules.quickRegistration;
    if (this.props.userinfo.userId) {
      return "";
    }
    let style = {};
    let title = "";
    if (quickRegistration && quickRegistration.content) {
      title = quickRegistration.content.title;
      if (quickRegistration.content.image) {
        style.backgroundImage = `url(${quickRegistration.content.image})`;
        style.backgroundPosition = "center";
        // style.backgroundSize = "cover";
      }
      if (quickRegistration.content.background) {
        style.backgroundColor = quickRegistration.content.background;
      }
    }
    return (
      <div className={classes.register} style={style}>
        <h1 className={classes.title}>{title}</h1>
        <div>
          <input
            placeholder={this.props.intl.formatMessage({
              id: "输入你的邮箱或者手机号"
            })}
            value={this.state.account}
            onChange={this.change.bind(this)}
          />
          <Button
            variant="contained"
            size="large"
            color="primary"
            className={classes.margin}
            onClick={this.gotoRegister}
          >
            {this.props.intl.formatMessage({ id: "注册" })}
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Index));
