// 注册引导页
import React from "react";
import { injectIntl } from "react-intl";
import style from "./login_style";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import route_map from "../../config/route_map";

class GuideRC extends React.PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.register_guide}>
        <h2>{this.props.intl.formatMessage({ id: "注册成功" })}</h2>
        <div style={{ margin: "0 0 8px" }}>
          <img src={require("../../assets/icon_guide.png")} />
        </div>
        <p style={{ margin: "0 0 48px" }}>
          {this.props.intl.formatMessage({
            id: "为了保障您的交易便捷，请先选择入金通道"
          })}
        </p>
        <div
          style={{
            margin: "0 auto 33px",
            display: "flex",
            justifyContent: "space-between",
            width: 320
          }}
        >
          <Button
            color="primary"
            variant="contained"
            style={{ width: 140 }}
            href={
              window.location.protocol +
              "//" +
              (window.location.hostname.indexOf("www") > -1
                ? window.location.hostname.replace("www", "otc")
                : `otc.${window.location.hostname}`)
            }
          >
            {this.props.intl.formatMessage({ id: "法币购买" })}
          </Button>
          <Button
            color="primary"
            style={{ width: 140 }}
            variant="contained"
            href={route_map.finance_list}
          >
            {this.props.intl.formatMessage({ id: "充币" })}
          </Button>
        </div>
        <p>
          <a href={route_map.index} style={{ fontWeight: 700 }}>
            {this.props.intl.formatMessage({ id: "先去逛逛" })}
          </a>
        </p>
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(GuideRC));
