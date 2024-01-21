// 首页
import React from "react";
import { injectIntl } from "react-intl";
import { Button } from "@material-ui/core";
import { Iconfont } from "../../lib";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style.js";
import classnames from "classnames";
import TooltipCommon from "../public/tooltip";

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      amount: "",
      coin: "USDT",
      hover: false,
      suffix: "CNY",
    };
    this.getLastPrice = this.getLastPrice.bind(this);
  }
  componentDidMount() {
    if (window.WEB_CONFIG.otcToken && window.WEB_CONFIG.otcToken.length) {
      this.setState({
        coin: window.WEB_CONFIG.otcToken[0].tokenName,
      });
      if (window.localStorage.lang == "zh-cn") {
        this.getLastPrice(window.WEB_CONFIG.otcToken[0].tokenName);
      }
    }
  }
  getLastPrice(coin) {
    coin = coin || this.state.coin;
    const select_lang = window.WEB_CONFIG.supportLanguages.filter(
      (list) => list.lang == window.localStorage.unit
    );
    this.setState({
      suffix:
        select_lang && select_lang.length
          ? select_lang[0].suffix
          : this.state.suffix,
    });
    this.props.dispatch({
      type: "index/getLastPrice",
      payload: {
        tokenId: coin,
        currencyId:
          select_lang && select_lang.length
            ? select_lang[0].suffix
            : this.state.suffix,
        side: 1,
      },
    });
    setTimeout(this.getLastPrice, 5000);
  }
  buy(e) {
    this.setState({
      amount: e.target.value,
    });
  }
  changeCoin(coin, e) {
    e.stopPropagation();
    this.setState({
      coin: coin,
      hover: false,
    });
    this.getLastPrice(coin);
  }
  change(status) {
    this.setState({
      hover: status,
    });
  }
  render() {
    const { classes } = this.props;
    const select_lang = window.WEB_CONFIG.supportLanguages.filter(
      (list) => list.lang == window.localStorage.unit
    );
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    if (window.localStorage.lang != "zh-cn") {
      return "";
    }
    return (
      <div className={classes.buy_bg}>
        <div className={classnames("item", classes.refer_price)}>
          <p>
            {this.props.intl.formatMessage({
              id: "参考价",
            })}
            <TooltipCommon
              title={this.props.intl.formatMessage({
                id: "非最终交易单价，仅供参考",
              })}
              placement="top"
            >
              <span>
                <Iconfont type="info_line" size="22" className={classes.more} />
              </span>
            </TooltipCommon>
          </p>
          <p>
            {this.props.lastPrice}{" "}
            {select_lang && select_lang.length
              ? select_lang[0].suffix
              : this.state.suffix}
            /{this.state.coin}
          </p>
        </div>
        <div className={classes.buy}>
          <div
            className={classes.icon_select}
            onMouseEnter={this.change.bind(this, true)}
            onMouseLeave={this.change.bind(this, false)}
          >
            <img
              src={
                this.props.config.tokens[this.state.coin]
                  ? this.props.config.tokens[this.state.coin]["iconUrl"]
                  : ""
              }
            />
            <div>
              <p>{this.state.coin}</p>
              <Iconfont type="arrowDown" size="24" className={classes.more} />
            </div>
            <ul
              className={classes.dMenuList}
              style={{ display: this.state.hover ? "block" : "none" }}
            >
              {window.WEB_CONFIG.otcToken && window.WEB_CONFIG.otcToken.length
                ? window.WEB_CONFIG.otcToken.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className={classes.dMenuItem}
                        onClick={this.changeCoin.bind(this, item.tokenName)}
                      >
                        <img
                          src={
                            this.props.config.tokens[item.tokenName]
                              ? this.props.config.tokens[item.tokenName][
                                  "iconUrl"
                                ]
                              : ""
                          }
                        />
                        {item.tokenName}
                      </li>
                    );
                  })
                : ""}
            </ul>
          </div>
          <div className={classes.buy_input}>
            <input
              placeholder={this.props.intl.formatMessage({
                id: "请输入购买金额",
              })}
              onChange={this.buy.bind(this)}
            />
            <span className={classes.union}>
              {select_lang && select_lang.length ? select_lang[0].suffix : ""}
            </span>
          </div>
          <a
            href={
              protocol +
              "//" +
              (hostname.indexOf("www") > -1
                ? hostname.replace("www", "otc")
                : `otc.${hostname}`) +
              `/otc/trade/${this.state.coin}?amount=${this.state.amount}&side=1`
            }
            target="_blank"
          >
            <Button
              variant="contained"
              size="large"
              color="primary"
              className={classes.margin}
            >
              {this.props.intl.formatMessage({ id: "一键购买" })}
            </Button>
          </a>
        </div>
        <div className="item"></div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Index));
