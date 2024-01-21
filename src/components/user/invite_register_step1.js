// 注册
import React from "react";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";

import { parse } from "search-params";
import style from "./login_style";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

class RegisterStep1 extends React.Component {
  constructor() {
    super();
    this.state = {
      invite_code: "",
      broker: "",
      account: "",
    };
  }
  parseSearch = (url) => {
    let search = (url || this.props.location.search).replace("?", "");
    search = parse(search);
    return search;
  };
  componentDidMount() {
    // 移动端
    if (/iphone|android/i.test(navigator.userAgent)) {
      window.location.href = window.location.href.replace(
        "/invite/register",
        "/m/invite/register"
      );
      return;
    }
    const search = this.parseSearch();
    this.setState({
      invite_code: search.invite_code || "",
      broker: (search.broker || "").toUpperCase(),
      account: search.account || "",
    });
    setTimeout(() => {
      const dom = window.document.querySelector("#_g_mask");
      dom && (dom.style.display = "none");
    }, 200);
  }
  render() {
    const { classes } = this.props;
    const ismobile = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|MicroMessenger/i.test(
      window.navigator.userAgent
    );
    let link =
      route_map.register + `?invite_code=${this.state.invite_code}&hidelogin=1`;
    if (ismobile) {
      link += `&redirect=${encodeURIComponent(
        route_map.invite_register_step2
      )}`;
    }
    const download_app_url =
      (this.props.index_config.shareConfig || {})["openUrl"] || "";
    return (
      <div className={classes.invite_register}>
        <div className={classes.invite_user}>
          <strong>{this.state.account}</strong>
          <span>
            {this.props.intl.formatMessage({
              id: "邀请您注册",
            })}
          </span>
        </div>
        <div className={classes.invite_logo}>{this.state.broker}</div>
        <div className={classes.invite_btn}>
          {this.state.invite_code ? (
            <Button variant="contained" color="primary" href={link}>
              {this.props.intl.formatMessage({
                id: "立即注册",
              })}
            </Button>
          ) : (
            ""
          )}
          {download_app_url ? (
            <p style={{ margin: "16px 0 0", fontSize: 12 }}>
              {this.props.intl.formatMessage({ id: "注册后下载APP" })}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(RegisterStep1));
