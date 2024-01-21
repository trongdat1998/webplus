// 行情
import React from "react";
import { Iconfont } from "../../lib";
import { injectIntl } from "react-intl";
import helper from "../../utils/helper";
import route_map from "../../config/route_map";
import classnames from "classnames";
import CONST from "../../config/const";
import TextFieldCN from "../public/textfiled";
import { withStyles } from "@material-ui/core/styles";
import styles from "./quote";
import WSDATA from "../../models/data_source";

class Quotes extends React.Component {
  constructor() {
    super();
    this.state = {
      focus: false,
      functions: {},
      tab: "币币交易",
      search: false,
      search_text: "",
      quoteTokens: [],
      futureQuoteToken: [],
      optionQuoteToken: [],
      quoteToken: 1,
      sort: [0, 0, 0, 0, 0, 0, 0], // 市场，最新价，涨跌幅，24h最高价，24h最低价，24h成交量，24h成交额， 0=无排序，1=从高到底，2=从低到高
    };
    this.focus = this.focus.bind(this);
    this.favorite = this.favorite.bind(this);
    this.goto = this.goto.bind(this);
    this.getMore = this.getMore.bind(this);
    this.itemClick = this.itemClick.bind(this);
  }
  componentDidMount() {
    let funs = {};
    let functions = this.props.config.functions || {};
    let quoteToken = [];
    if (functions.exchange) {
      funs["币币交易"] = 1;
      quoteToken = this.props.config.quoteToken.map((item) => item.tokenId);
    }
    this.setState({
      functions: funs,
      quoteTokens: ["CHOOSE", ...quoteToken],
      quoteToken: quoteToken.length ? 1 : 0,
    });
  }
  componentDidUpdate() {
    if (this.props.qws && !this.state.subed) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.props.qws.sub(
            {
              id: "broker",
              topic: "broker",
              event: "sub",
              params: {
                org: this.props.config.orgId,
                realtimeInterval: window.WEB_CONFIG.realtimeInterval,
                binary: !Boolean(window.localStorage.ws_binary),
              },
            },
            this.httpAction,
            this.callback
          );
        }
      );
    }
  }

  httpAction = async (payload) => {
    await this.props.dispatch({
      type: "ws/broker_quote_http",
      payload,
    });
  };
  /**
   * data={
   *   topic:'broker',
   *   params:{},
   *   f: true/false,
   *   id: 'broker,
   *   shared: true/false,
   *   data:[{t:123123123123,s:'BTCUSDT',c:1,o:1,e:301,h:1,l:1,m:0,v:0,qv:0}] m:涨跌幅
   * }
   */
  callback = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("symbol_quote_source", data.data);
  };
  itemClick(record, tokenId, exchangeId) {
    this.goto(exchangeId, record.s, tokenId);
  }
  goto(exchangeId, symbolId, tokenId) {
    let info = {};
    const host = window.location.host;
    const protocol = window.location.protocol;
    let url = protocol + "//" + host;
    if (this.state.tab == "币币交易") {
      info = this.props.config.symbols_obj.all[symbolId];
      url +=
        route_map.exchange + "/" + info.baseTokenId + "/" + info.quoteTokenId;
      if (this.state.quoteToken == 0) {
        url += "?favorite";
      }
    }
    // window.location.href = url.toLowerCase();
    window.location.href = url;
  }
  getMore() {}
  focus() {
    this.setState({
      search: !this.state.search,
    });
  }
  favorite(symbolId, exchangeId, e) {
    e.stopPropagation();
    this.props.dispatch({
      type: "layout/favorite",
      payload: {
        symbolId,
        exchangeId,
      },
    });
  }
  changeIndex = (i) => () => {
    this.setState({
      quoteToken: i,
    });
  };
  onChangeIndex = (v) => {
    this.setState({
      quoteToken: v,
    });
  };
  search = (e) => {
    this.setState({
      search_text: e.target.value,
    });
  };
  sort = (i) => (e) => {
    let d = [0, 0, 0, 0, 0, 0, 0];
    d[i] = this.state.sort[i];
    d[i]++;
    if (d[i] > 2) {
      d[i] = 0;
    }
    this.setState({
      sort: d,
    });
  };
  renderTitle = (n, prefix = "") => {
    const classes = this.props.classes;
    const titles = [
      this.props.intl.formatMessage({
        id: "市场",
      }),
      this.props.intl.formatMessage({
        id: "最新价",
      }),
      this.props.intl.formatMessage({
        id: "涨跌幅",
      }),
      this.props.intl.formatMessage({
        id: "最高价",
      }),
      this.props.intl.formatMessage({
        id: "最低价",
      }),
      this.props.intl.formatMessage({
        id: "成交量",
      }),
      this.props.intl.formatMessage({
        id: "24h成交额",
      }),
    ];
    const style = n == 2 || n == 6 ? { justifyContent: "flex-end" } : {};
    return (
      <div
        onClick={this.sort(n)}
        className={
          // this.state.sort[n] > 0
          // ? classnames(classes.choose, classes.sort)
          // :
          "sort"
        }
        style={style}
      >
        <div>
          {prefix}
          {titles[n]}
        </div>
        <span>
          <em className={this.state.sort[n] == 2 ? "active" : ""} />
          <em className={this.state.sort[n] == 1 ? "active" : ""} />
        </span>
        {/* {this.state.sort[n] == 1 ? (
          <span>
            <Iconfont type="reverse" />
          </span>
        ) : (
          ""
        )}
        {this.state.sort[n] == 2 ? (
          <span>
            <Iconfont type="positive" />
          </span>
        ) : (
          ""
        )} */}
      </div>
    );
  };
  changStep = (index) => () => {
    let i = index == "币币交易" ? 1 : 0;
    this.setState({
      quoteToken: i,
    });
    this.setState({
      tab: index,
    });
  };

  renderItem = (record) => {
    const favorite = this.props.favorite;
    let sysmbols = this.props.config.symbols_obj;
    const d = sysmbols.all[record.s];
    const coin = d.baseTokenFutures
      ? d.baseTokenFutures.displayTokenId
      : d.quoteTokenId;
    // 成交额
    const cRates_qv = coin
      ? helper.currencyValue(this.props.rates, record ? record.qv : 0, coin)
      : ["", ""];
    // 最低价
    const cRates_l = coin
      ? helper.currencyValue(this.props.rates, record ? record.l : 0, coin)
      : ["", ""];
    // 最高价
    const cRates_h = coin
      ? helper.currencyValue(this.props.rates, record ? record.h : 0, coin)
      : ["", ""];
    // 最新价
    const cRates_c = coin
      ? helper.currencyValue(this.props.rates, record ? record.c : 0, coin)
      : ["", ""];
    const classes = this.props.classes;
    if (
      this.state.tab == "币币交易" &&
      !d.showStatus &&
      !this.state.search_text
    ) {
      return "";
    }
    return (
      <div
        className={classes.order_table_width}
        key={record.s}
        onClick={this.itemClick.bind(
          this,
          record,
          d.quoteTokenId,
          d.exchangeId
        )}
      >
        <div>
          <div
            className={classes.fav}
            onClick={this.favorite.bind(this, record.s, d.exchangeId)}
          >
            <Iconfont
              type={favorite[record.s] ? "favorited" : "favorite"}
              key={record.s}
              size={20}
              className={favorite[record.s] ? "choose" : ""}
            />
          </div>
        </div>
        <div>
          <em>{d.baseTokenName}</em>
          <span>/{d.quoteTokenName}</span>
        </div>
        <div>
          <em>
            {helper.digits(record.c, CONST["depth"][d["minPricePrecision"]])}
          </em>
          <span>{cRates_c[0] ? `/${cRates_c[0]}${cRates_c[1]}` : ""}</span>
        </div>
        <div>
          <div className={record.m >= 0 ? "up" : "down"}>
            <span>
              {Number(record.m) > 0 ? "+" : ""}
              {helper.format(Math.floor(Number(record.m) * 10000) / 100, 2) +
                "%"}
            </span>
            {Number(record.m) >= 0 ? (
              <Iconfont type="positive" />
            ) : (
              <Iconfont type="reverse" />
            )}
          </div>
        </div>
        <div>
          <em>
            {helper.digits(record.h, CONST["depth"][d["minPricePrecision"]])}
          </em>
        </div>
        <div>
          <em>
            {helper.digits(record.l, CONST["depth"][d["minPricePrecision"]])}
          </em>
        </div>
        <div>{helper.digits(record.v, 2)}</div>
        <div>
          {cRates_qv[0]}
          {cRates_qv[1]}
        </div>
      </div>
    );
  };

  render() {
    //window.console.log("quotes render");
    const data = [];
    let sysmbols = this.props.config.symbols_obj;
    const classes = this.props.classes;
    let showQuoteTokens = this.state.quoteTokens;
    const quoteToken = this.props.config.quoteToken;
    if (this.state.tab == "币币交易" && sysmbols.coin) {
      if (this.state.quoteToken == 0) {
        quoteToken.map((item) => {
          (item.quoteTokenSymbols || []).map((it) => {
            const d = this.props.symbol_quote[it.symbolId] || {};
            if (
              d.s &&
              this.props.favorite[d.s] &&
              `${it.symbolId}${it.symbolName}`.indexOf(
                (this.state.search_text || "").toUpperCase()
              ) > -1
            ) {
              if (data.findIndex((item) => item.s == d.s) == -1) {
                data.push(d);
              }
            }
          });
        });
      } else {
        quoteToken.length &&
          (
            quoteToken[this.state.quoteToken - 1]["quoteTokenSymbols"] || []
          ).map((item) => {
            const d = this.props.symbol_quote[item.symbolId] || {};
            if (
              `${item.symbolId}${item.symbolName}`.indexOf(
                (this.state.search_text || "").toUpperCase()
              ) > -1 &&
              d.s
            ) {
              data.push(d);
            }
          });
      }

      // Object.keys(sysmbols.coin).map(item => {
      //   const d = this.props.symbol_quote[item];
      //   if (d) {
      //     if (this.state.quoteToken == 0) {
      //       if (
      //         this.props.favorite[d.s] &&
      //         item.indexOf((this.state.search_text || "").toUpperCase()) > -1
      //       ) {
      //         data.push(this.props.symbol_quote[item]);
      //       }
      //     }
      //     if (this.state.quoteToken > 0) {
      //       const reg = new RegExp(
      //         `${this.state.quoteTokens[this.state.quoteToken]}$`
      //       );
      //       if (
      //         reg.test(item) &&
      //         item.indexOf((this.state.search_text || "").toUpperCase()) > -1
      //       ) {
      //         data.push(this.props.symbol_quote[item]);
      //       }
      //     }
      //   }
      // });
    }
    data.sort((a, b) => {
      // 市场
      if (this.state.sort[0] > 0) {
        if (this.state.sort[0] == 1) {
          return a.s.toUpperCase() >= b.s.toUpperCase() ? 1 : -1;
        }
        return a.s.toUpperCase() >= b.s.toUpperCase() ? -1 : 1;
      }
      // 最新价
      if (this.state.sort[1] > 0) {
        if (a.c == b.c) {
          return a.s.toUpperCase() > b.s.toUpperCase() ? 1 : -1;
        }
        if (this.state.sort[1] == 1) {
          return Number(a.c) >= Number(b.c) ? -1 : 1;
        } else {
          return Number(a.c) > Number(b.c) ? 1 : -1;
        }
      }
      // 涨跌幅
      if (this.state.sort[2] > 0) {
        if (a.m == b.m) {
          return a.s.toUpperCase() > b.s.toUpperCase() ? 1 : -1;
        }
        if (this.state.sort[2] == 1) {
          return Number(a.m) >= Number(b.m) ? -1 : 1;
        } else {
          return Number(a.m) > Number(b.m) ? 1 : -1;
        }
      }
      // 最高价
      if (this.state.sort[3] > 0) {
        if (a.h == b.h) {
          return a.s.toUpperCase() > b.s.toUpperCase() ? 1 : -1;
        }
        if (this.state.sort[3] == 1) {
          return Number(a.h) >= Number(b.h) ? -1 : 1;
        } else {
          return Number(a.h) > Number(b.h) ? 1 : -1;
        }
      }
      // 最低价
      if (this.state.sort[4] > 0) {
        if (a.l == b.l) {
          return a.s.toUpperCase() > b.s.toUpperCase() ? 1 : -1;
        }
        if (this.state.sort[4] == 1) {
          return Number(a.l) >= Number(b.l) ? -1 : 1;
        } else {
          return Number(a.l) > Number(b.l) ? 1 : -1;
        }
      }
      // 成交量
      if (this.state.sort[5] > 0) {
        if (a.v == b.v) {
          return a.s.toUpperCase() >= b.s.toUpperCase() ? 1 : -1;
        }
        if (this.state.sort[5] == 1) {
          return Number(a.v) > Number(b.v) ? -1 : 1;
        } else {
          return Number(a.v) > Number(b.v) ? 1 : -1;
        }
      }
      // 成交额
      if (this.state.sort[6] > 0) {
        if (a.qv == b.qv) {
          return a.s.toUpperCase() >= b.s.toUpperCase() ? 1 : -1;
        }
        if (this.state.sort[6] == 1) {
          return Number(a.qv) > Number(b.qv) ? -1 : 1;
        } else {
          return Number(a.qv) > Number(b.qv) ? 1 : -1;
        }
      }

      // return a.s.toUpperCase() >= b.s.toUpperCase() ? 1 : -1;
    });

    return (
      <div className={classes.tokenList}>
        {/* {this.state.tab == "币币交易" ? ( */}
        <div className={classes.token_title}>
          {showQuoteTokens.map((item, i) => {
            const symbolId = this.props.symbolId_types[i];
            const tokens = this.props.tokens;
            return (
              <div
                key={i}
                className={this.state.quoteToken == i ? "on" : ""}
                onClick={this.changeIndex(i)}
              >
                <div className="title_item">
                  {item == "CHOOSE" ? (
                    <img src={require(`../../assets/tokens/${item}@2x.png`)} />
                  ) : tokens[symbolId] && tokens[symbolId]["iconUrl"] ? (
                    <img src={tokens[symbolId]["iconUrl"]} />
                  ) : (
                    ""
                  )}
                  {item == "CHOOSE"
                    ? this.props.intl.formatMessage({
                        id: "自选",
                      })
                    : item}
                </div>
              </div>
            );
          })}
          <div
            className={
              this.state.search
                ? classnames(classes.search, classes.focus)
                : classes.search
            }
          >
            <TextFieldCN
              value={this.state.search_text}
              onFocus={this.focus}
              onBlur={this.focus}
              onChange={this.search}
              className={classes.search_area}
              variant="outlined"
              InputProps={{
                endAdornment: <Iconfont type="search" size={30} />,
                classes: {
                  input: classes.search_text,
                },
              }}
            />
          </div>
        </div>
        {/* ) : (
          ""
        )} */}

        <div className={classes.list_title}>
          <div className={classes.list_item} />
          <div className={classes.list_item}>{this.renderTitle(0)}</div>
          <div className={classes.list_item}>{this.renderTitle(1)}</div>
          <div className={classes.list_item}>{this.renderTitle(2)}</div>
          <div className={classes.list_item}>{this.renderTitle(3, "24h")}</div>
          <div className={classes.list_item}>{this.renderTitle(4, "24h")}</div>
          <div className={classes.list_item}>{this.renderTitle(5, "24h")}</div>
          <div className={classes.list_item}>{this.renderTitle(6)}</div>
        </div>

        <div className={classes.list_data}>
          {!data.length ? (
            <div className={classes.nodata}>
              <img alt="" src={require("../../assets/noData.png")} />
              <p>{this.props.intl.formatMessage({ id: "暂无数据" })}</p>
            </div>
          ) : (
            <div className={classes.order_table}>
              {data.map((item) => {
                return this.renderItem(item);
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Quotes));
