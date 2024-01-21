// token 列表
import React from "react";
import { Iconfont } from "../../lib";
import { injectIntl } from "react-intl";
import classnames from "classnames";
import helper from "../../utils/helper";
import route_map from "../../config/route_map";
import CONST from "../../config/const";
import WSDATA from "../../models/data_source";
import { withStyles } from "@material-ui/core/styles";
import styles from "./tokenList.style";
import { OutlinedInput } from "@material-ui/core";

let refresh_time = new Date().getTime();
class TokenList extends React.Component {
  constructor() {
    super();
    this.state = {
      focus: false,
      search: false,
      search_text: "",
      quoteTokens: [],
      quoteToken: 1,
      tab: "币币交易",
      sort: [0, 0, 0, 0, 0, 0, 0], // 市场，最新价，涨跌幅，24h最高价，24h最低价，24h成交量，24h成交额， 0=无排序，1=从高到底，2=从低到高
      show: true, // 资产是否隐藏
      suffix: false,
      refresh_status: 0,
    };
    this.currentRef = null;
    this.currentRef2 = null;
    this.focus = this.focus.bind(this);
    this.favorite = this.favorite.bind(this);
    this.goto = this.goto.bind(this);
    this.clear = this.clear.bind(this);
  }
  componentDidMount() {
    const quoteToken = this.props.config.customQuoteToken.map(
      (item) => item.tokenId
    );
    const token2 = (this.props.match.params.token2 || "").toUpperCase();
    const token1 = (this.props.match.params.token1 || "").toUpperCase();
    let index = 1;
    let v = 0;
    this.props.config.customQuoteToken.map((item, i) => {
      (item.quoteTokenSymbols || []).map((it) => {
        if (it.baseTokenId == token1 && it.quoteTokenId == token2 && !v) {
          v = 1;
          index = i + 1;
        }
      });
    });
    this.setState({
      quoteTokens: ["CHOOSE", ...quoteToken],
      quoteToken: /favorite/i.test(this.props.history.location.search)
        ? 0
        : index,
      suffix: JSON.parse(localStorage.suffix || false),
    });
    this.props.dispatch({
      type: "layout/getTotalAsset",
      payload: {
        unit: "USDT",
      },
    });

    this.update();
  }
  // 0.2s 更新当前币对数据
  update = async () => {
    
    await helper.delay(CONST.refresh);
    let now = new Date().getTime();
    if (now - refresh_time > CONST.refresh_tokens) {
      this.setState({
        refresh_status: 1 - this.state.refresh_status,
      });
      refresh_time = now;
    }
    this.update();
  };
  componentDidUpdate(preProps) {
    if (this.props.qws && !this.state.subed) {
      this.setState(
        {
          subed: true,
        },
        () => {
          // 所有币对数据
          this.props.qws.sub(
            {
              id: "broker",
              topic: "slowBroker",
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
          // 当前币对数据
          this.sub();
        }
      );
    }
    if (preProps.symbol_id && preProps.symbol_id != this.props.symbol_id) {
      this.cancel("realtimes");
      this.sub();
    }
  }
  /**
   * 限制组件刷新频率
   * 除使用到数据变化更新外，1.5s主动全量刷新一次
   * 当前币对数据0.2s 刷新一次
   */
  shouldComponentUpdate(preProps, preState) {
    const states = [
      this.state.search_text,
      this.state.quoteToken,
      this.state.sort.join(""),
      this.state.show,
      this.state.suffix,
      this.state.refresh_status,
      Object.keys(this.props.favorite).length,
      this.props.quoteMode,
      this.props.symbol_id,
    ];
    const preStates = [
      preState.search_text,
      preState.quoteToken,
      preState.sort.join(""),
      preState.show,
      preState.suffix,
      preState.refresh_status,
      Object.keys(preProps.favorite).length,
      preProps.quoteMode,
      preProps.symbol_id,
    ];
    let r = false;
    states.map((item, i) => {
      if (item != preStates[i]) {
        r = true;
      }
    });
    return r;
  }
  // 取消某个币对订阅
  cancel = (id) => {
    if (id && this.props.qws) {
      this.props.qws.cancel(id);
    }
  };
  // 订阅单个币对数据
  sub = () => {
    this.props.qws.sub(
      {
        id: "realtimes",
        topic: "realtimes",
        event: "sub",
        symbol: this.props.exchange_id + "." + this.props.symbol_id,
        params: {
          realtimeInterval: window.WEB_CONFIG.realtimeInterval,
          binary: !Boolean(window.localStorage.ws_binary),
        },
      },
      null,
      this.callback
    );
  };
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
    if (data.f && data.topic == "slowBroker") {
      this.setState({
        refresh_status: 1 - this.state.refresh_status,
      });
    }
  };
  changeIndex = (i) => () => {
    this.setState({
      quoteToken: i,
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
  async goto(exchangeId, baseToken, quoteToken) {
    //window.console.log(exchangeId, baseToken, quoteToken);
    const pathname = window.location.pathname.toUpperCase();
    if (pathname.indexOf(`/${baseToken}/${quoteToken}`) > -1) {
      return;
    }
    // k线未ready时不允许切换
    if (!this.props.tvwidget || !this.props.tvwidget._ready) {
      return;
    }
    let url = route_map.exchange + "/" + baseToken + "/" + quoteToken;
    if (/favorite/i.test(this.props.history.location.search)) {
      url += "?favorite";
    }
    const baseTokenName = this.props.config.tokens[baseToken]
      ? this.props.config.tokens[baseToken]["tokenName"]
      : "";
    const quoteTokenName = this.props.config.tokens[quoteToken]
      ? this.props.config.tokens[quoteToken]["tokenName"]
      : "";
    // window.location.href = url.toLowerCase();
    //this.props.history.push(url);
    const symbol_quote = this.props.symbol_quote;
    const tokenInfo =
      symbol_quote[`${baseToken.toUpperCase()}${quoteToken.toUpperCase()}`] ||
      {};
    const symbol_info = this.props.config.symbols[baseToken + quoteToken] || {};
    this.props.dispatch({
      type: "exchange/save",
      payload: {
        token1: baseToken,
        token1_name: baseTokenName,
        token2: quoteToken,
        token2_name: quoteTokenName,
        exchange_id: exchangeId,
        symbol_id: (baseToken + quoteToken + "").toUpperCase(),
        symbol_info,
        sale_quantity: "",
        sale_price: tokenInfo.c || "",
        sale_progress: 0,
        buy_quantity: "",
        buy_price: tokenInfo.c || "",
        buy_progress: 0,

        digitMerge: (symbol_info.digitMerge || "").split(","),
        aggTrade_digits: CONST.depth[symbol_info.minPricePrecision],
        max_digits: CONST.depth[symbol_info.minPricePrecision],
        base_precision: CONST.depth[symbol_info.basePrecision], // 数量精度 如 8 表示小数留8位
        quote_precision: CONST.depth[symbol_info.quotePrecision], // 金额精度 如 8 表示小数留8位
        min_price_precision: symbol_info.minPricePrecision, // 价格交易step, 如 0.1
        min_trade_quantity: symbol_info.minTradeQuantity, // 数量交易step 如 0.1
        min_trade_amount: symbol_info.minTradeAmount, // 金额交易step  如 0.1
      },
    });
    if (this.props.setProgress) {
      this.props.setProgress("buy_progress", 0);
      this.props.setProgress("sale_progress", 0);
    }
    if (this.props.setProgressMarket) {
      this.props.setProgressMarket("buy_progress", 0);
      this.props.setProgressMarket("sale_progress", 0);
    }
    // 清除行情数据
    WSDATA.clearAll("qws");
    this.props.dispatch({
      type: "ws/save",
      payload: {
        merged_depth: {},
        depth: {},
        trades: {},
      },
    });
    this.props.history.replace(url);
  }
  focus() {
    this.setState({
      focus: !this.state.focus,
      search: !this.state.search,
    });
  }
  favorite(exchangeId, symbolId, e) {
    e.stopPropagation();
    this.props.dispatch({
      type: "layout/favorite",
      payload: {
        symbolId,
        exchangeId,
      },
    });
  }
  clear() {
    this.setState({
      search_text: "",
    });
  }
  changeSuffix() {
    let suffix = this.state.suffix;
    localStorage.suffix = !suffix;
    this.setState({
      suffix: !suffix,
    });
  }
  renderTitle(n, prefix = "") {
    // let lang =
    //   window.localStorage.lang == "ko-kr" ||
    //   window.localStorage.lang == "zh-cn" ||
    //   window.localStorage.lang == "ja-jp"
    //     ? window.localStorage.lang
    //     : "en-us";
    let lang = window.localStorage.unit;
    let currentLang =
      window.WEB_CONFIG.supportLanguages.find((list) => list.lang == lang) ||
      {};
    const titles = [
      this.props.intl.formatMessage({
        id: "币种",
      }),
      this.props.intl.formatMessage({
        id: "最新价",
      }) + (this.state.suffix ? `(${currentLang.suffix})` : ""),
      this.props.intl.formatMessage({
        id: "涨幅",
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
        id: "成交额",
      }),
    ];
    return (
      <div
        className={
          this.state.sort[n] > 0
            ? classnames("hoc_choose", "hoc_title")
            : "hoc_title"
        }
        onClick={this.sort(n)}
      >
        <div>
          {prefix}
          {titles[n]}
        </div>
        <span className={["", "up", "down"][this.state.sort[n]]}>
          <Iconfont type="order_up" size={16} />
          <Iconfont type="order_down" size={16} />
        </span>
      </div>
    );
  }
  renderData(data, favorite) {
    const { classes } = this.props;
    if (!data.length) {
      return (
        <div className={classes.noresult}>
          <img src={require("../../assets/noresult.png")} />
          <p>{this.props.intl.formatMessage({ id: "暂无数据" })}</p>
        </div>
      );
    }
    const hostname = window.location.pathname.toUpperCase();
    let sysmbols = this.props.config.symbols_obj;
    // let lang =
    //   window.localStorage.lang == "ko-kr" ||
    //   window.localStorage.lang == "zh-cn" ||
    //   window.localStorage.lang == "ja-jp"
    //     ? window.localStorage.lang
    //     : "en-us";
    let lang = window.localStorage.unit;
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    return data.map((it, i) => {
      const d = sysmbols.all[it.symbolId];
      const item = symbol_quote[it.symbolId] || {};
      let digitMerge = d["minPricePrecision"];
      const cRates = helper.currencyValue(
        this.props.rates,
        item ? item.c : 0,
        d.quoteTokenId,
        lang,
        true
      );
      return (
        <div
          className={
            hostname.indexOf("/" + d.baseTokenId + "/" + d.quoteTokenId) > -1
              ? classnames(classes.item, classes.item_on)
              : classes.item
          }
          key={it.symbolId}
          style={{
            display:
              Boolean(d.showStatus) || this.state.search_text ? "flex" : "none",
          }}
          onClick={this.goto.bind(
            this,
            d.exchangeId,
            d.baseTokenId,
            d.quoteTokenId
          )}
        >
          <div className={classes.fav}>
            <Iconfont
              type="favorited"
              key={d.exchangeId + d.symbolId}
              size={18}
              className={favorite[d.symbolId] ? classes.choose : ""}
              onClick={this.favorite.bind(this, d.exchangeId, d.symbolId)}
            />
            {d.baseTokenName}
            {this.state.quoteToken == 0 ? `/${d.quoteTokenName}` : ""}
            {d.label && d.label.labelValue && this.state.quoteToken != 0 ? (
              <span
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
          {this.state.suffix ? (
            <div id={d.symbolId}>
              {this.props.rates[d.quoteTokenId] ? `${cRates[1]}` : " -"}
            </div>
          ) : (
            <div id={d.symbolId}>
              {item.c ? helper.digits(item.c, CONST["depth"][digitMerge]) : "-"}
            </div>
          )}
          <div>
            <span
              id={d.symbolId + "m"}
              className={Number(item.m) >= 0 ? classes.up : classes.down}
            >
              {Number(item.m) > 0 ? "+" : ""}
              {Number(item.m)
                ? helper.format(Math.floor(Number(item.m) * 10000) / 100, 2) +
                  "%"
                : "0.00%"}
            </span>
          </div>
        </div>
      );
    });
  }
  render() {
    //window.console.log("tokenList render");
    const { classes } = this.props;
    let sysmbols = this.props.config.symbols_obj;
    let data = [];
    let totalAssetRates = ["", "", ""];
    // let lang =
    //   window.localStorage.lang == "ko-kr" ||
    //   window.localStorage.lang == "zh-cn" ||
    //   window.localStorage.lang == "ja-jp"
    //     ? window.localStorage.lang
    //     : "en-us";
    let lang = window.localStorage.unit;
    if (this.props.userinfo.userId) {
      totalAssetRates =
        this.props.total_asset && this.props.total_asset.coinAsset
          ? helper.currencyValue(
              this.props.rates,
              this.props.total_asset.coinAsset,
              this.props.total_asset.unit,
              lang,
              true
            )
          : ["", "", ""];
    }
    let currentLang =
      window.WEB_CONFIG.supportLanguages.find((list) => list.lang == lang) ||
      {};

    const quoteToken = this.props.config.customQuoteToken;
    if (this.state.quoteToken == 0) {
      quoteToken.map((item) => {
        (item.quoteTokenSymbols || []).map((it) => {
          if (
            this.props.favorite[it.symbolId] &&
            `${it.symbolId}${it.symbolName}`.indexOf(
              (this.state.search_text || "").toUpperCase()
            ) > -1
          ) {
            if (data.findIndex((item) => item.symbolId == it.symbolId) == -1) {
              data.push(it);
            }
          }
        });
      });
    }
    if (this.state.quoteToken > 0) {
      quoteToken.length &&
        (
          (quoteToken[this.state.quoteToken - 1] || {})["quoteTokenSymbols"] ||
          []
        ).map((item) => {
          if (
            `${item.symbolId}${item.symbolName}`.indexOf(
              (this.state.search_text || "").toUpperCase()
            ) > -1
          ) {
            data.push(item);
          }
        });
    }

    // Object.keys(sysmbols.coin || {}).map(item => {
    //   if (this.state.quoteToken == 0) {
    //     const d = this.props.symbol_quote[item];
    //     if (
    //       d &&
    //       this.props.favorite[d.s] &&
    //       item.indexOf((this.state.search_text || "").toUpperCase()) > -1
    //     ) {
    //       data.push(sysmbols.coin[item]);
    //     }
    //   }
    //   if (this.state.quoteToken > 0) {
    //     const reg = new RegExp(
    //       `${this.state.quoteTokens[this.state.quoteToken]}$`,
    //       "i"
    //     );
    //     if (
    //       reg.test(item) &&
    //       item.indexOf((this.state.search_text || "").toUpperCase()) > -1
    //     ) {
    //       data.push(sysmbols.coin[item]);
    //     }
    //   }
    // });
    data.sort((_a, _b) => {
      const a = this.props.symbol_quote[_a.symbolId] || {
        s: _a.symbolId,
        c: 0,
        m: 0,
        h: 0,
        l: 0,
        v: 0,
        qv: 0,
      };
      const b = this.props.symbol_quote[_b.symbolId] || {
        s: _b.symbolId,
        c: 0,
        m: 0,
        h: 0,
        l: 0,
        v: 0,
        qv: 0,
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
        {this.props.userinfo.userId ? (
          <div className={classes.finance}>
            <p>
              <span>{this.props.intl.formatMessage({ id: "资产折合" })}</span>
              {this.state.show ? (
                <Iconfont
                  type="unhidden"
                  size="24"
                  onClick={() => {
                    this.setState({
                      show: false,
                    });
                  }}
                />
              ) : (
                <Iconfont
                  type="hidden"
                  size="24"
                  onClick={() => {
                    this.setState({
                      show: true,
                    });
                  }}
                />
              )}
            </p>
            {this.state.show ? (
              <p>
                <span>
                  {this.props.total_asset && this.props.total_asset.coinAsset
                    ? helper.digits(this.props.total_asset.coinAsset, 2)
                    : ""}{" "}
                  {this.props.total_asset ? this.props.total_asset.unit : ""}
                </span>
                {this.props.total_asset &&
                this.props.total_asset.coinAsset &&
                this.props.rates[this.props.total_asset.unit]
                  ? ` ≈ ${totalAssetRates[1]} ${totalAssetRates[2]}`
                  : ""}
              </p>
            ) : (
              <p>
                <span>
                  ****{" "}
                  {this.props.total_asset ? this.props.total_asset.unit : ""}
                </span>
                {this.props.total_asset &&
                this.props.total_asset.coinAsset &&
                this.props.rates[this.props.total_asset.unit]
                  ? ` ≈ **** ${totalAssetRates[2]}`
                  : ""}
              </p>
            )}
          </div>
        ) : (
          ""
        )}
        <div className={classes.token_title}>
          {this.state.quoteTokens.map((item, i) => {
            return (
              <span
                key={item}
                className={this.state.quoteToken == i ? "on" : ""}
                onClick={this.changeIndex(i)}
              >
                {item == "CHOOSE"
                  ? this.props.intl.formatMessage({
                      id: "自选",
                    })
                  : item}
                {/* {item == "CHOOSE" ? window.appLocale.messages["自选"] : item} */}
              </span>
            );
          })}
        </div>
        <div
          className={
            this.state.focus
              ? classnames(classes.search, classes.focus)
              : classes.search
          }
        >
          <OutlinedInput
            value={this.state.search_text}
            onChange={this.search}
            onFocus={this.focus}
            onBlur={this.focus}
            placeholder={this.props.intl.formatMessage({
              id: "搜索",
            })}
            classes={{
              root: classes.inputRoot,
              focused: classes.inputFocused,
            }}
            startAdornment={<Iconfont type="search" size={22} value="" />}
            endAdornment={
              this.state.search_text ? (
                <Iconfont
                  type="delete"
                  size={16}
                  onClick={this.clear.bind(this, true)}
                />
              ) : (
                ""
              )
            }
          />
          <p
            className={classnames(
              classes.trans_switch,
              this.state.suffix ? "on" : ""
            )}
            onClick={this.changeSuffix.bind(this)}
          >
            <Iconfont type="cnyswitch" size={24} value="" />
            <span>{currentLang ? currentLang.suffix : ""}</span>
          </p>
        </div>
        <div className={classes.list_title}>
          <div className={classes.list_item}>{this.renderTitle(0)}</div>
          <div className={classes.list_item}>{this.renderTitle(1)}</div>
          <div className={classes.list_item}>{this.renderTitle(2)}</div>
        </div>
        <div
          className={classes.list_data}
          style={{
            height: this.props.userinfo.userId
              ? "calc(100% - 156px)"
              : "calc(100% - 106px)",
          }}
        >
          {this.renderData(data, this.props.favorite)}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TokenList));
