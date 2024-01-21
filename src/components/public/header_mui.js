// 公共头
import React from "react";
import classNames from "classnames";
import { routerRedux } from "dva/router";
import QRCode from "qrcode";
import { Iconfont } from "../../lib";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import Cookie from "../../utils/cookie";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./header_footer_style";
import moment from "moment";

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      times: {},
      anchorEl: null,
      anchorEl2: null,
      anchorElOrder: null,
      anchorElFinance: null,
      open2: false,
      right: false,
      read: false,
    };
    this.logout = this.logout.bind(this);
  }
  componentDidMount() {
    if (this.props.index_config.title) {
      window.document.title = this.props.index_config.title;
    }
    if (this.props.index_config.favicon) {
      // link rel="shortcut icon"
      let link = document.createElement("link");
      link.setAttribute("rel", "shortcut icon");
      link.setAttribute("href", this.props.index_config.favicon);
      window.document.querySelector("head").appendChild(link);
    }
    if (
      this.props.index_config &&
      this.props.index_config.announcements &&
      this.props.index_config.announcements.length
    ) {
      this.setState({
        read: this.props.index_config.announcements[0]
          ? this.props.index_config.announcements[0]["publishTime"] ==
            window.localStorage.read
          : false,
      });
    }
  }
  componentDidUpdate(preProps) {
    let pathname = window.location.pathname;
    if (this.props.index_config.title != preProps.index_config.title) {
      const title = this.props.index_config.title;
      if (
        title &&
        pathname.indexOf("/exchange") == -1 &&
        pathname.indexOf(route_map.option) == -1 &&
        pathname.indexOf(route_map.option_busdt) == -1
      ) {
        window.document.title = title;
      }
    }
    if (this.props.index_config.favicon != preProps.index_config.favicon) {
      let link = document.createElement("link");
      link.setAttribute("rel", "shortcut icon");
      link.setAttribute("href", this.props.index_config.favicon);
      window.document.querySelector("head").appendChild(link);
    }
    if (
      this.props.index_config.announcements !=
        preProps.index_config.announcements ||
      this.props.index_config.announcements.length !=
        preProps.index_config.announcements.length
    ) {
      this.setState({
        read: this.props.index_config.announcements[0]
          ? this.props.index_config.announcements[0]["publishTime"] ==
            window.localStorage.read
          : false,
      });
    }
  }
  logout() {
    this.setState({
      anchorEl: false,
    });
    this.props.dispatch({
      type: "layout/logout",
    });
  }
  gotoUserCenter = () => {
    this.setState({
      anchorEl: false,
    });
    routerRedux.push(route_map.user_center);
  };
  changeLang = async (lang, lang_text) => {
    await this.props.dispatch({
      type: "layout/setCustomConfig",
      payload: {
        lang: lang,
      },
    });
    let tmp = window.location.hostname.split(".");
    this.setState({
      anchorEl: false,
    });
    window.localStorage.lang = lang;
    window.localStorage.lang_text = lang_text;
    Cookie.write({
      name: "locale",
      value: lang,
      domain: window.location.hostname.replace(tmp.shift() + ".", ""),
    });
    const s = window.location.search;
    let lang2 = s.match(/lang\=([^&]{0,})/);
    if (lang2 && lang2[1]) {
      let link = window.location.href;
      link = link.replace(/lang\=[^&]{0,}/, "lang=" + lang);
      window.location.href = link;
    } else {
      window.location.reload();
    }
  };
  handleClick = (e) => {
    e && e.preventDefault();
    this.setState({ anchorEl: e.currentTarget });
  };
  handleClick2 = (e) => {
    this.setState({ anchorEl2: e.currentTarget });
  };
  handleClickOrder = (e) => {
    this.setState({ anchorElOrder: e.currentTarget });
  };
  handleClickFinance = (e) => {
    this.setState({ anchorElFinance: e.currentTarget });
  };
  handleClose = (e) => {
    this.setState({
      anchorEl: null,
      anchorEl2: null,
      anchorElOrder: null,
      anchorElFinance: null,
    });
  };
  toggleDrawer = (e) => {
    if (!e) return;
    this.setState({ right: !this.state.right });
  };
  componentDidCatch(error, info) {}
  read() {
    if (
      this.props.index_config &&
      this.props.index_config.announcements &&
      this.props.index_config.announcements.length
    ) {
      window.localStorage.read =
        this.props.index_config.announcements[0]["publishTime"];
      this.setState({ read: true });
    }
  }
  render() {
    return this.renderPC();
  }

  renderHeader(item, index) {
    const pathname = window.location.pathname;
    const link = {
      exchange: route_map.exchange,
      option: route_map.option,
      explore: route_map.option_busdt,
      guild: route_map.guild,
      bonus: route_map.staking,
      margin: route_map.margin,
      futures: route_map.future,
    };
    const { classes } = this.props;
    return (
      <div key={index} className={classNames(classes.dMenu, classes.dMenuLeft)}>
        <a
          href={item.link}
          target={item.blank ? "_blank" : ""}
          rel={item.blank ? "noopener noreferrer" : ""}
          className={
            pathname.indexOf(link[item.fun]) > -1 ? classes.active : ""
          }
        >
          {item.text}
          {item.children && item.children.length ? (
            <Iconfont type="arrowDown" size="24" className={classes.more} />
          ) : (
            ""
          )}
        </a>
        {item.tag ? (
          <em className={classes.mark} style={{ background: item.color }}>
            {item.tag}
            <i style={{ borderLeftColor: item.color }}></i>
          </em>
        ) : (
          ""
        )}
        {item.children && item.children.length ? (
          <ul className={classes.dMenuList}>
            {item.children.map((it, n) => {
              return (
                <li className={classes.dMenuItem} key={n}>
                  <a
                    rel={it.blank ? "noopener noreferrer" : ""}
                    target={it.blank ? "_blank" : ""}
                    href={it.link}
                  >
                    {it.text}
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          ""
        )}
      </div>
    );
  }
  renderPC = () => {
    const pathname = window.location.pathname;
    const option_symbol = this.props.option_symbol || [];
    const coin_symbol_list = this.props.coin_symbol_list || [];
    const future_symbold = this.props.future_symbold || [];

    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    let GENERAL_TRADE_FEE_BACK = false;
    (this.props.function_list || []).map((item) => {
      if (item.function === "GENERAL_TRADE_FEE_BACK") {
        GENERAL_TRADE_FEE_BACK = true;
      }
    });
    const functions = this.props.functions || {};
    const pointCardBalance = this.props.balanceList.filter(
      (list) =>
        list.pointCardMetadata &&
        (list.pointCardMetadata.valueBaseTokenId == "USDT" ||
          list.pointCardMetadata.valueBaseTokenId == "BTC") &&
        list.total != 0
    );
    let optionSymbol =
      option_symbol.find((list) => list.quoteTokenName != "BUSDT") || {};
    let exploreSymbol =
      option_symbol.find((list) => list.quoteTokenName == "BUSDT") || {}; //首个体验区
    let headConfigList =
      this.props.index_config && this.props.index_config.headConfigList
        ? [...this.props.index_config.headConfigList]
        : [];
    let link = {
      otc:
        protocol +
        "//" +
        (hostname.indexOf("www") > -1
          ? hostname.replace("www", "otc")
          : `otc.${hostname}`),
      exchange: route_map.exchange,
      option: route_map.option,
      explore: route_map.option_busdt,
      guild: route_map.guild,
      bonus: route_map.staking,
      futures: route_map.future,
      margin: route_map.margin,
    };
    if (coin_symbol_list.length) {
      link.exchange =
        route_map.exchange +
        "/" +
        coin_symbol_list[0]["baseTokenId"] +
        "/" +
        coin_symbol_list[0]["quoteTokenId"];
    }
    if (optionSymbol.exchangeId) {
      link.option = route_map.option + "/" + optionSymbol.symbolId;
    }
    if (exploreSymbol.exchangeId) {
      link.explore = route_map.option_busdt + "/" + exploreSymbol.symbolId;
    }
    if (future_symbold.length) {
      link.futures = route_map.future + "/" + future_symbold[0]["symbolId"];
    }
    let headConfigList_copy = [];
    headConfigList.forEach((el, i) => {
      let a = { ...el };
      a.switch = true;
      if (a.system && link[a.link]) {
        a.fun = a.link;
        a.link = link[a.link];
      }
      headConfigList_copy.push(a);
    });
    const { classes, userinfo } = this.props;
    let downloadImageBase64 = "";
    if (
      this.props.index_config &&
      this.props.index_config.shareConfig &&
      this.props.index_config.shareConfig.openUrlImgBase64
    ) {
      downloadImageBase64 =
        "data:image/png;base64," +
        this.props.index_config.shareConfig.openUrlImgBase64;
    }

    // todo 增加语言判断
    // const downloadImageUrl =
    //   this.props.index_config.shareConfig.openUrl +
    //   "?lang=" +
    //   window.localStorage.lang;
    // QRCode.toDataURL(
    //   downloadImageUrl,
    //   {
    //     errorCorrectionLevel: "H",
    //     margin: 5,
    //   },
    //   (err, url) => {
    //     downloadImageBase64 = url;
    //   }
    // );
    return (
      <div
        className={
          window.IE_Version <= 11 &&
          window.IE_Version > -1 &&
          Cookie.read("account_id")
            ? classNames(classes.header, "ie_fix")
            : classes.header
        }
      >
        <div className={classes.left}>
          <div className={classes.logo}>
            <a href={route_map.index}>
              {this.props.index_config.logo ? (
                <img src={this.props.index_config.logo} />
              ) : (
                ""
              )}
            </a>
          </div>
          <div className={classes.menu}>
            {headConfigList_copy.length
              ? headConfigList_copy.map((item, index) => {
                  return this.renderHeader(item, index);
                })
              : ""}
          </div>
        </div>
        <div className={classes.side} id="header_side">
          {userinfo.userId ? (
            <div className={classes.userInfo}>
              {functions &&
              (functions["exchange"] ||
                functions["option"] ||
                functions["bonus"] ||
                functions["futures"]) ? (
                <div className={classes.dMenu}>
                  <a
                    href={route_map.finance_list}
                    // onClick={this.handleClickFinance}
                    className={
                      pathname.match(/^\/finance/) ||
                      pathname === route_map.option_finance_list ||
                      pathname === route_map.staking_finance
                        ? classes.active
                        : ""
                    }
                  >
                    {this.props.intl.formatMessage({
                      id: "资产",
                    })}
                    <Iconfont
                      type="arrowDown"
                      size="24"
                      className={classes.more}
                    />
                  </a>
                  <ul className={classes.dMenuList}>
                    {functions && functions["exchange"] ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.finance_list}>
                          {this.props.intl.formatMessage({
                            id: "钱包资产",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {functions && functions["margin"] ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.margin_finance}>
                          {this.props.intl.formatMessage({
                            id: "lever.asset",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {functions && functions["futures"] ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.future_finance}>
                          {this.props.intl.formatMessage({
                            id: "永续合约资产",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {functions && functions["bonus"] ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.staking_finance}>
                          {this.props.intl.formatMessage({
                            id: "币多多资产",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {functions && functions["showSubAcco"] ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.finance_child_account}>
                          {this.props.intl.formatMessage({
                            id: "子账户资产",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {userinfo.leader == 1 ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.finance_activity_account}>
                          {this.props.intl.formatMessage({
                            id: "活动账户",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                  </ul>
                </div>
              ) : (
                ""
              )}
              {pathname.indexOf(route_map.guild) === -1 &&
              functions &&
              (functions["exchange"] ||
                functions["otc"] ||
                functions["option"] ||
                functions["futures"]) ? (
                <div className={classes.dMenu}>
                  <a
                    href={route_map.order}
                    className={
                      pathname === route_map.order ||
                      pathname.match(/^\/option\/order\//)
                        ? classes.active
                        : ""
                    }
                    // onClick={this.handleClickOrder}
                  >
                    {this.props.intl.formatMessage({
                      id: "订单",
                    })}
                    <Iconfont
                      type="arrowDown"
                      size="24"
                      className={classes.more}
                    />
                  </a>
                  <ul className={classes.dMenuList}>
                    {functions && functions["exchange"] ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.order}>
                          {this.props.intl.formatMessage({
                            id: "币币订单",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}

                    {functions && functions["otc"] ? (
                      <li className={classes.dMenuItem}>
                        <a
                          href={
                            protocol +
                            "//" +
                            (hostname.indexOf("www") > -1
                              ? hostname.replace("www", "otc")
                              : `otc.${hostname}`) +
                            "/otc/order"
                          }
                          target="_blank"
                        >
                          {this.props.intl.formatMessage({
                            id: "法币订单",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {functions && functions["margin"] ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.margin_order}>
                          {this.props.intl.formatMessage({
                            id: "lever.orders",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}

                    {functions && functions["futures"] ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.future_position}>
                          {this.props.intl.formatMessage({
                            id: "永续合约订单",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {functions && functions["bonus"] ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.staking_order}>
                          {this.props.intl.formatMessage({
                            id: "理财订单",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                  </ul>
                </div>
              ) : (
                ""
              )}
              <div className={classes.dMenu}>
                <a
                  className={
                    pathname.match(/^\/user/) &&
                    pathname.indexOf("/user/card") == -1
                      ? classes.active
                      : ""
                  }
                  href={route_map.user_center}
                >
                  {/* {userinfo.registerType === 2
                    ? userinfo.email
                    : userinfo.mobile} */}
                  <Iconfont type="user" size="22" className={classes.more} />
                </a>
                {userinfo.userId ? (
                  <ul className={classNames(classes.dMenuList, classes.user)}>
                    <a
                      className="info"
                      title={
                        userinfo.registerType == 1
                          ? userinfo.mobile
                          : userinfo.email
                      }
                    >
                      <img
                        alt=""
                        src={require("../../assets/defaulticon.png")}
                      />
                      <strong>
                        {userinfo.registerType == 1
                          ? userinfo.mobile
                          : userinfo.email}
                      </strong>
                    </a>
                    <li className={classes.dMenuItem}>
                      <a href={route_map.user_center}>
                        {this.props.intl.formatMessage({
                          id: "用户中心",
                        })}
                      </a>
                    </li>
                    {functions && functions["userLevel"] ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.grade}>
                          {this.props.intl.formatMessage({
                            id: "我的等级",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {functions && functions["invite"] ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.invite}>
                          {this.props.intl.formatMessage({
                            id: "我的邀请",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    {userinfo.isAgent ? (
                      <li className={classes.dMenuItem}>
                        <a href={route_map.broker}>
                          {this.props.intl.formatMessage({
                            id: "经纪人管理",
                          })}
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    <li className={classes.dMenuItem}>
                      <a onClick={this.logout}>
                        {this.props.intl.formatMessage({
                          id: "退出",
                        })}
                      </a>
                    </li>
                  </ul>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : this.props.loading &&
            this.props.loading.effects &&
            this.props.loading.effects["layout/userinfo"] ? (
            ""
          ) : (
            <div className={classes.login}>
              <div>
                <a
                  href={
                    route_map.login +
                    (window.location.search.indexOf("redirect") > -1
                      ? window.location.search
                      : "?redirect=" + encodeURIComponent(window.location.href))
                  }
                  className={pathname === route_map.login ? classes.active : ""}
                >
                  {this.props.intl.formatMessage({
                    id: "登录",
                  })}
                </a>
              </div>
              <div>
                <a
                  href={
                    window.location.href.indexOf(route_map.register) > -1 &&
                    window.location.pathname != route_map.invite_register_step1
                      ? ""
                      : route_map.register +
                        (window.location.search.indexOf("redirect") > -1
                          ? window.location.search
                          : "?redirect=" +
                            encodeURIComponent(window.location.href))
                  }
                  className={
                    pathname === route_map.register ? classes.active : ""
                  }
                >
                  {this.props.intl.formatMessage({
                    id: "注册",
                  })}
                </a>
              </div>
            </div>
          )}
          {this.props.index_config.announcements &&
          this.props.index_config.announcements.length ? (
            <div
              className={classes.dMenu}
              style={{
                // padding: "0 3px",
                textAlign: "center",
                lineHeight: "24px",
                height: "100%",
              }}
              onClick={this.read.bind(this)}
            >
              <a
                style={{
                  lineHeight: "24px",
                  position: "relative",
                  height: "100%",
                }}
              >
                <Iconfont type="announcement" size="24" />
                {!this.state.read ? (
                  <span className={classes.unread}></span>
                ) : (
                  ""
                )}
              </a>
              <ul className={classNames(classes.dMenuList, classes.announce)}>
                <h2>
                  {/* <Iconfont type="announcement" size="24"  /> */}
                  {this.props.intl.formatMessage({ id: "公告中心" })}
                </h2>
                {this.props.index_config.announcements.map((item, index) => {
                  return (
                    <li className={classes.dMenuItem} key={index}>
                      <a
                        href={item.directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.title}
                        <br />
                        <span>
                          {moment
                            .utc(Number(item.publishTime))
                            .local()
                            .format("YYYY-MM-DD")}
                        </span>
                      </a>
                    </li>
                  );
                })}
                {this.props.index_config.announcementMoreUrl ? (
                  <p>
                    <a
                      href={this.props.index_config.announcementMoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {this.props.intl.formatMessage({ id: "查看更多" })}
                      <Iconfont type="arrowRight" size="20" />
                    </a>
                  </p>
                ) : (
                  ""
                )}
              </ul>
            </div>
          ) : (
            ""
          )}
          {this.props.index_config &&
          this.props.index_config.shareConfig &&
          this.props.index_config.shareConfig.openUrlImgBase64 ? (
            <div
              className={classes.dMenu}
              style={{
                // padding: "0 10px",
                textAlign: "center",
                lineHeight: "24px",
                height: "100%",
              }}
            >
              <a
                href={this.props.index_config.shareConfig.openUrl}
                style={{
                  lineHeight: "24px",
                  height: "100%",
                }}
              >
                <Iconfont type="download" size="15" className={classes.more} />
              </a>
              <ul
                className={classNames(classes.dMenuList, classes.appdownload)}
                style={{ padding: 0 }}
              >
                <p>{this.props.intl.formatMessage({ id: "APP下载" })}</p>
                <li className={classNames(classes.dMenuItem)}>
                  <img
                    src={downloadImageBase64}
                    style={{ width: 150, display: "block" }}
                  />
                </li>
              </ul>
            </div>
          ) : (
            ""
          )}
          <div className={classNames(classes.chooselang, classes.dMenu)}>
            <a
              className={classes.chooseLangBtn}
              onClick={this.handleClick2}
              style={{
                display:
                  window.WEB_CONFIG.supportLanguages.length <= 1
                    ? "none"
                    : "flex",
              }}
            >
              {window.localStorage.lang_text}
              <Iconfont type="arrowDown" size="24" className={classes.more} />
            </a>
            {window.WEB_CONFIG && window.WEB_CONFIG.supportLanguages ? (
              <ul className={classes.dMenuList}>
                {window.WEB_CONFIG.supportLanguages.map((item) => {
                  return (
                    <li className={classes.dMenuItem} key={item.lang}>
                      <a
                        value={item.lang}
                        onClick={this.changeLang.bind(
                          this,
                          item.lang.toLowerCase(),
                          item.text
                        )}
                      >
                        {item.text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  };
}

export default withStyles(styles)(injectIntl(Header));
