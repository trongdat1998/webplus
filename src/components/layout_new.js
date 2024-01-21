// 白色版本layout
import React from "react";
import NProgress from "nprogress";
import PublicHeader2 from "./public/header_mui";
import PublicFooter2 from "./public/footer_mui";
import { message, Iconfont } from "../lib";
import helper from "../utils/helper";
import route_map from "../config/route_map";
import WSDATA from "../models/data_source";
import styles from "./layout_style";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import Cookie from "../utils/cookie";
import classnames from "classnames";

let timer = null;
class LayoutRC extends React.Component {
  constructor() {
    super();
    this.state = {
      display: 0,
      open: false,
      preview: 0,
    };
    this.updateRates = this.updateRates.bind(this);
    this.order_notice = this.order_notice.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
      const dom = window.document.querySelector("#_g_mask");
      dom && (dom.style.display = "none");
    }, 200);
    if (
      window.WEB_CONFIG.riskIpDisabled &&
      window.WEB_CONFIG.riskIpDisabled.description
    ) {
      window.location.href = route_map.noaccess;
    }
    NProgress.done();
    this.order_notice();
    this.updateRates();

    // 预览模式
    if (/preview/.test(window.location.search) || Cookie.read("preview")) {
      this.setState({
        preview: 1,
      });
    }

    window.addEventListener(
      "offline",
      () => {
        // 断网
        if (!navigator.onLine) {
          message.info(
            window.WEB_LOCALES_ALL["网络连接中断,请刷新页面重试"] ||
              "网络连接中断,请刷新页面重试"
          );
        }
      },
      false
    );
    const isMobile = /android|iphone|ipad/i.test(navigator.userAgent);
    if (isMobile && window.sessionStorage.display != 1) {
      this.setState({
        display: 1,
      });
    }
  }
  componentDidUpdate() {
    this.update();
  }
  async update() {
    if (this.props.getWarning) {
      await this.props.dispatch({
        type: "layout/handleChange",
        payload: {
          getWarning: false,
        },
      });
      this.setState({
        open:
          !window.localStorage.riskIndicated &&
          this.props.indexWarningStatus &&
          this.props.indexWarning.description,
      });
    }
  }
  async order_notice() {
    const aid = this.props.userinfo.defaultAccountId;
    const order_notice = WSDATA.getData("order_notice");
    if (aid && order_notice && window.appLocale.messages["order_notice"]) {
      message.info(
        window.appLocale.messages["order_notice"].replace("{n}", order_notice)
      );
      WSDATA.clear("order_notice");
    }
    await helper.delay(2000);
    this.order_notice();
  }
  async updateRates() {
    try {
      await this.props.dispatch({
        type: "layout/get_rates",
        payload: {},
      });
    } catch (e) {}
    await helper.delay(10000);
    this.updateRates();
  }
  componentWillUnmount() {
    NProgress.start();
  }
  change = () => {
    window.sessionStorage.display = 1;
    this.setState({
      display: 0,
    });
  };
  isApp() {
    return /bhe.?App/i.test(navigator.userAgent);
  }
  handleClose() {
    this.setState({
      open: false,
    });
    window.localStorage.riskIndicated = true;
  }
  gotoH5 = () => {
    window.localStorage.removeItem("keepWeb");
    window.location.href = "/m/";
  };
  changeVersion = () => {
    if (helper.isMobile() && window.location.pathname == route_map.index) {
      const classes = this.props.classes;
      return (
        <div className={classes.version}>
          <div>
            <i onClick={this.gotoH5}>
              {this.props.intl.formatMessage({ id: "体验H5版" })}
            </i>
          </div>
        </div>
      );
    }
  };
  cancelPreview = () => {
    let domain = window.location.origin.split(".");
    if (domain.length > 2) {
      domain.splice(0, 1);
    }
    domain = [""].concat(domain);
    if (window.location.href.indexOf("localhost") > -1) {
      domain = ["localhost"];
    }
    Cookie.del("preview", { domain: domain.join(".") });
    let search = window.location.search || "";
    if (search) {
      search = search.toLowerCase().replace(/preview(=true)?(&)?/, "");
    }
    window.location.href = window.location.pathname + search;
  };
  // 预览条
  renderPreview = () => {
    const classes = this.props.classes;
    if (this.state.preview) {
      return (
        <div className={classes.preview}>
          <div>
            <i onClick={this.cancelPreview}>
              {this.props.intl.formatMessage({
                id: "预览模式 - 点击切换线上模式",
              })}
            </i>
          </div>
        </div>
      );
    }
  };
  render() {
    const pathname = window.location.pathname;
    const display = this.state.display;
    const { classes, style, ...otherProps } = this.props;
    const shareConfig = this.props.index_config.shareConfig || {};
    const g_contentbox =
      pathname.indexOf("/guild") > -1 && pathname != route_map.guild_home
        ? classes.g_guild
        : classes.g_contentbox;
    return [
      <div className={classes.g_headerBox} key="header" style={style || {}}>
        {this.renderPreview()}
        {this.changeVersion()}
        {this.isApp() && pathname.indexOf(route_map.protocols) > -1 ? null : (
          <PublicHeader2 {...otherProps} />
        )}
        <div
          className={classnames(
            g_contentbox,
            this.props.darkBg ? classes.g_contentbox_q : ""
          )}
        >
          {this.props.children}
        </div>
      </div>,
      <PublicFooter2 {...otherProps} key="footer" />,
      <div
        key="layer"
        style={{ display: display && shareConfig.openUrl ? "block" : "none" }}
      >
        {display && shareConfig.openUrl ? (
          <div className={classes.download_layer}>
            <div>
              {shareConfig.logoUrl ? <img src={shareConfig.logoUrl} /> : ""}
            </div>
            <div>
              <h2>{shareConfig.title}</h2>
              <p>{shareConfig.description}</p>
            </div>
            <div>
              {shareConfig.openUrl ? (
                <a
                  href={shareConfig.openUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.props.intl.formatMessage({ id: "APP下载" })}
                </a>
              ) : (
                ""
              )}
            </div>
            <div onClick={this.change} style={{ padding: "0 28px" }}>
              <Iconfont type="close" size="64" />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>,
      <Dialog
        open={Boolean(this.state.open)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ scrollPaper: classes.tip_dialog }}
        key="tip_dialog"
      >
        <DialogContent className={classes.tip_content}>
          <div
            dangerouslySetInnerHTML={{
              __html: helper.dataReform(
                this.props.indexWarning && this.props.indexWarning.description
                  ? this.props.indexWarning.description.replace(
                      /<script>|<\/script>/gi,
                      ""
                    )
                  : ""
              ),
            }}
          />
        </DialogContent>
        <DialogActions className={classes.tip_action}>
          <Button
            onClick={this.handleClose}
            variant="contained"
            color="primary"
          >
            {this.props.intl.formatMessage({ id: "我已阅读并同意" })}
          </Button>
        </DialogActions>
      </Dialog>,
    ];
  }
}

export default withStyles(styles)(injectIntl(LayoutRC));
