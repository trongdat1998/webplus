// 行情
import React from "react";
import { Iconfont } from "../../lib";
import { injectIntl } from "react-intl";
import helper from "../../utils/helper";
import route_map from "../../config/route_map";
import classnames from "classnames";
import CONST from "../../config/const";
import { Grid, Button, CircularProgress } from "@material-ui/core";
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
      clear: "false",
      firstloading: false,
    };
    this.focus = this.focus.bind(this);
    this.favorite = this.favorite.bind(this);
    this.goto = this.goto.bind(this);
    this.getMore = this.getMore.bind(this);
    this.itemClick = this.itemClick.bind(this);
    this.clear = this.clear.bind(this);
  }
  componentDidMount() {
    let funs = {};
    let functions = this.props.config.functions || {};
    let quoteToken = [],
      futureQuoteToken = [],
      optionQuoteToken = [];
    if (functions.exchange) {
      funs["币币交易"] = 1;
      quoteToken = this.props.config.customQuoteToken.map(
        (item) => item.tokenId
      );
    }
    if (functions.futures) {
      funs["永续合约"] = 1;
      futureQuoteToken = this.props.config.futuresUnderlying.map(
        (item) => item.id
      );
    }
    this.setState({
      functions: funs,
      quoteTokens: ["CHOOSE", ...quoteToken],
      quoteToken: quoteToken.length ? 1 : 0,
      futureQuoteToken: futureQuoteToken,
      optionQuoteToken: optionQuoteToken,
    });

    setTimeout(() => {
      this.setState({
        firstloading: true,
      });
    }, 5000);
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
    this.setState({
      firstloading: true,
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
    if (!this.state.firstloading) {
      this.setState({
        firstloading: true,
      });
    }
  };
  itemClick(record, tokenId, exchangeId, index) {
    this.goto(exchangeId, record.symbolId, tokenId);
  }
  goto(exchangeId, symbolId, tokenId, index) {
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
    if (this.state.tab == "永续合约") {
      url += route_map.future + "/" + symbolId;
    }

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
        id: "24h最高价",
      }),
      this.props.intl.formatMessage({
        id: "24h最低价",
      }),
      this.props.intl.formatMessage({
        id: "24h成交量",
      }),
      this.props.intl.formatMessage({
        id: "24h成交额",
      }),
    ];
    const style = n == 6 ? { justifyContent: "flex-end" } : {};
    return (
      <div onClick={this.sort(n)} className={classes.sort} style={style}>
        <div>
          {prefix}
          {titles[n]}
        </div>
        <span>
          <em className={this.state.sort[n] == 2 ? "active" : ""} />
          <em className={this.state.sort[n] == 1 ? "active" : ""} />
        </span>
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

  clear(bool) {
    this.setState({
      clear: bool ? "true" : "false",
      search_text: "",
    });
  }

  renderItem = (record) => {
    const favorite = this.props.favorite;
    let sysmbols = this.props.config.symbols_obj;
    const d = sysmbols.all[record.symbolId];
    const coin =
      this.state.tab == "永续合约"
        ? d.baseTokenFutures.displayTokenId
        : d.quoteTokenId;
    const coin_qv = d.baseTokenFutures
      ? d.baseTokenFutures.coinToken
      : d.quoteTokenId;
    // 成交额
    const cRates_qv =
      coin_qv && record.s
        ? helper.currencyValue(
            this.props.rates,
            record ? record.qv : 0,
            coin_qv
          )
        : [<span>-</span>, <span>-</span>];
    // 最低价
    const cRates_l =
      coin && record.s
        ? helper.currencyValue(this.props.rates, record ? record.l : 0, coin)
        : ["", ""];
    // 最高价
    const cRates_h =
      coin && record.s
        ? helper.currencyValue(this.props.rates, record ? record.h : 0, coin)
        : ["", ""];
    // 最新价
    const cRates_c =
      coin && record.s
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
        key={record.symbolId}
        onClick={this.itemClick.bind(
          this,
          record,
          d.quoteTokenId,
          d.exchangeId,
          this.state.quoteToken
        )}
      >
        <div>
          {this.state.tab == "币币交易" ? (
            <Iconfont
              type={favorite[record.symbolId] ? "favorited" : "favorite"}
              size={24}
              className={favorite[record.symbolId] ? classes.choose : ""}
              onClick={this.favorite.bind(this, record.symbolId, d.exchangeId)}
            />
          ) : (
            ""
          )}
        </div>
        <div>
          {this.state.tab == "币币交易" ? (
            <p>
              {d.baseTokenName}/{d.quoteTokenName}
            </p>
          ) : (
            <p>{d.symbolName}</p>
          )}
          {d.label && d.label.labelValue ? (
            <span
              className="label"
              style={
                d.label.colorCode
                  ? {
                      color: d.label.colorCode,
                      borderColor: d.label.colorCode,
                    }
                  : {}
              }
            >
              {d.label.labelValue}
            </span>
          ) : (
            ""
          )}
        </div>
        <div>
          <em>
            {record.s
              ? helper.digits(record.c, CONST["depth"][d["minPricePrecision"]])
              : ""}
          </em>
          <span>{cRates_c[0] ? `/${cRates_c[0]}${cRates_c[1]}` : "--"}</span>
        </div>
        <div>
          <em className={(record.m || 0) >= 0 ? classes.up : classes.down}>
            {Number(record.m || 0) > 0 ? "+" : ""}
            {helper.format(Math.floor(Number(record.m || 0) * 10000) / 100, 2) +
              "%"}
          </em>
        </div>
        <div>
          <em>
            {record.s
              ? helper.digits(record.h, CONST["depth"][d["minPricePrecision"]])
              : ""}
          </em>
          <span>{cRates_h[0] ? `/${cRates_h[0]}${cRates_h[1]}` : "--"}</span>
        </div>
        <div>
          <em>
            {record.s
              ? helper.digits(record.l, CONST["depth"][d["minPricePrecision"]])
              : ""}
          </em>
          <span>{cRates_l[0] ? `/${cRates_l[0]}${cRates_l[1]}` : "--"}</span>
        </div>
        <div>{record.s ? helper.digits(record.v, 2) : <span>--</span>}</div>
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
    const quoteToken = this.props.config.customQuoteToken;
    const classes = this.props.classes;
    let showQuoteTokens = [];
    if (this.state.tab == "币币交易") {
      let tokens = this.props.config.customQuoteToken.map(
        (item) => item.tokenName
      );
      showQuoteTokens = ["CHOOSE", ...tokens];
    } else if (this.state.tab == "永续合约") {
      showQuoteTokens = this.props.config.futuresUnderlying.map(
        (item) => item.name
      );
    }
    if (this.state.tab == "币币交易" && sysmbols.coin) {
      if (this.state.quoteToken == 0) {
        quoteToken.map((item) => {
          (item.quoteTokenSymbols || []).map((it) => {
            const d = this.props.symbol_quote[it.symbolId] || {};
            if (
              //d.s &&
              this.props.favorite[it.symbolId] &&
              `${it.symbolId}${it.symbolName}`.indexOf(
                (this.state.search_text || "").toUpperCase()
              ) > -1
            ) {
              if (
                data.findIndex((item) => item.symbolId == it.symbolId) == -1
              ) {
                const coin_qv = sysmbols.coin[it.symbolId]
                  ? sysmbols.coin[it.symbolId]["quoteTokenId"]
                  : "";
                // 成交额
                const cRates_qv =
                  coin_qv && d && d.s
                    ? helper.currencyValue(
                        this.props.rates,
                        d ? d.qv : 0,
                        coin_qv
                      )
                    : ["", ""];
                d.qv_fiat = (cRates_qv[1] || "").replace(/,/g, "");
                data.push({ ...it, ...d });
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
              ) > -1
              // && d.s
            ) {
              const coin_qv = sysmbols.coin[item.symbolId]
                ? sysmbols.coin[item.symbolId]["quoteTokenId"]
                : "";
              // 成交额
              const cRates_qv =
                coin_qv && d && d.s
                  ? helper.currencyValue(
                      this.props.rates,
                      d ? d.qv : 0,
                      coin_qv
                    )
                  : ["", ""];

              d.qv_fiat = (cRates_qv[1] || "").replace(/,/g, "");
              data.push({ ...item, ...d });
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
    if (this.state.tab == "永续合约" && sysmbols.futures) {
      Object.keys(sysmbols.futures).map((item) => {
        const d = this.props.symbol_quote[item] || {};
        //if (d) {
        if (
          this.state.futureQuoteToken[this.state.quoteToken] ==
            sysmbols.futures[item].firstLevelUnderlyingId &&
          sysmbols.futures[item].symbolName.indexOf(
            (this.state.search_text || "").toUpperCase()
          ) > -1
        ) {
          const coin_qv = sysmbols.futures[item]
            ? sysmbols.futures[item].baseTokenFutures.coinToken
            : "";
          // 成交额
          const cRates_qv =
            coin_qv && d && d.s
              ? helper.currencyValue(this.props.rates, d ? d.qv : 0, coin_qv)
              : ["", ""];

          d.qv_fiat = (cRates_qv[1] || "").replace(/,/g, "");
          data.push({ ...sysmbols.futures[item], ...d });
        }
        //}
      });
    }
    data.sort((_a, _b) => {
      const a = {
        s: _a.symbolId,
        c: _a.c || 0,
        m: _a.m || 0,
        h: _a.h || 0,
        l: _a.l || 0,
        v: _a.v || 0,
        qv_fiat: _a.qv_fiat || 0,
      };
      const b = {
        s: _b.symbolId,
        c: _b.c || 0,
        m: _b.m || 0,
        h: _b.h || 0,
        l: _b.l || 0,
        v: _b.v || 0,
        qv_fiat: _b.qv_fiat || 0,
      };
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
        if (a.qv_fiat == b.qv_fiat) {
          return a.s.toUpperCase() >= b.s.toUpperCase() ? 1 : -1;
        }
        if (this.state.sort[6] == 1) {
          return Number(a.qv_fiat) > Number(b.qv_fiat) ? -1 : 1;
        } else {
          return Number(a.qv_fiat) > Number(b.qv_fiat) ? 1 : -1;
        }
      }

      // return a.s.toUpperCase() >= b.s.toUpperCase() ? 1 : -1;
    });
    const symbols_config = this.props.index_config.indexModules.symbols || {
      content: 0,
    };
    const maxHeight = symbols_config.content
      ? { maxHeight: Math.max(56 * symbols_config.content, 400) }
      : {};
    return (
      <div className={classes.tokenList}>
        <Grid container className={classes.tokenType} alignItems="center">
          {(Object.keys(this.state.functions) || []).map((item) => {
            return (
              <Grid item key={item} className={classes.tokenTypeItem}>
                <Button
                  onClick={this.changStep(item)}
                  size="large"
                  color={this.state.tab == item ? "primary" : "inherit"}
                  className={classes.tokenTypeBtn}
                >
                  {this.props.intl.formatMessage({ id: item })}
                </Button>
                {this.state.tab == item ? (
                  <span className={classes.tokens_arrow} />
                ) : (
                  ""
                )}
              </Grid>
            );
          })}
        </Grid>
        {/* {this.state.tab == "币币交易" ? ( */}
        <div className={classes.token_title}>
          <div className={classes.tokens}>
            {showQuoteTokens.map((item, i) => {
              return (
                <Button
                  key={i}
                  className={this.state.quoteToken == i ? "on" : ""}
                  // color={this.state.quoteToken == i ? "primary" : "default"}
                  onClick={this.changeIndex(i)}
                >
                  {item == "CHOOSE"
                    ? this.props.intl.formatMessage({
                        id: "自选",
                      })
                    : item}
                </Button>
              );
            })}
          </div>
          <div
            className={
              this.state.search
                ? classnames(classes.search, classes.focus)
                : classes.search
            }
          >
            <TextFieldCN
              value={this.state.search_text}
              onChange={this.search}
              onFocus={this.focus}
              onBlur={this.focus}
              placeholder={this.props.intl.formatMessage({ id: "搜索" })}
              variant="outlined"
              InputProps={{
                startAdornment: <Iconfont type="search" size={24} value="" />,
                endAdornment: this.state.search_text ? (
                  <Iconfont
                    type="delete"
                    size={24}
                    onClick={this.clear.bind(this, true)}
                  />
                ) : (
                  ""
                ),
                classes: {
                  root: classes.inputRoot,
                  focused: classes.inputFocused,
                },
              }}
            />
          </div>
        </div>

        <div className={classes.list_title}>
          <div className={classes.list_item} />
          <div className={classes.list_item}>{this.renderTitle(0)}</div>
          <div className={classes.list_item}>{this.renderTitle(1)}</div>
          <div className={classes.list_item}>{this.renderTitle(2)}</div>
          <div className={classes.list_item}>{this.renderTitle(3)}</div>
          <div className={classes.list_item}>{this.renderTitle(4)}</div>
          <div className={classes.list_item}>{this.renderTitle(5)}</div>
          <div className={classes.list_item}>{this.renderTitle(6)}</div>
        </div>

        <div className={classes.list_data}>
          {!this.state.firstloading ? (
            <div className={classes.nodata}>
              <CircularProgress />
            </div>
          ) : data.length ? (
            <div className={classes.order_table} style={maxHeight}>
              {data.map((item) => {
                return this.renderItem(item);
              })}
            </div>
          ) : (
            <div className={classes.nodata}>
              <img alt="" src={require("../../assets/noData.png")} />
              <p>{this.props.intl.formatMessage({ id: "暂无数据" })}</p>
            </div>
          )}
          {/* {!data.length ? (
            this.state.firstloading ? (
              <div className={classes.nodata}>
                <img alt="" src={require("../../assets/noData.png")} />
                <p>{this.props.intl.formatMessage({ id: "暂无数据" })}</p>
              </div>
            ) : (
              <div className={classes.nodata}>
                <CircularProgress />
              </div>
            )
          ) : (
            <div className={classes.order_table} style={maxHeight}>
              {data.map(item => {
                return this.renderItem(item);
              })}
            </div>
          )} */}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Quotes));
