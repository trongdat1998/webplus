// token 列表
import React from "react";
import { Iconfont } from "../../../lib";
import { injectIntl } from "react-intl";
import classnames from "classnames";
import helper from "../../../utils/helper";
import route_map from "../../../config/route_map";
import CONST from "../../../config/const";
import WSDATA from "../../../models/data_source";
import styles from "./tokenList.style";
import quote_style from "../../public/quote_style";
import { withStyles } from "@material-ui/core/styles";
import TextFieldCN from "../../public/textfiled";

class TokenList extends React.Component {
  constructor() {
    super();
    this.state = {
      first_loading: true,
      focus: false,
      token2: "",
      underlying: "",
      search: false,
      search_text: "",
      quoteTokens: [],
      quoteToken: -1,
      tab: "永续合约",
      sort: [0, 0, 0, 0, 0, 0, 0], // 市场，最新价，涨跌幅，24h最高价，24h最低价，24h成交量，24h成交额， 0=无排序，1=从高到底，2=从低到高
    };
    this.focus = this.focus.bind(this);
    this.favorite = this.favorite.bind(this);
    this.renderPrec = this.renderPrec.bind(this);
  }
  componentDidMount() {
    // window.addEventListener("offline", this.offline);
    // window.addEventListener("online", this.online);
    this.setState({
      quoteTokens: this.props.config.futuresUnderlying,
    });
  }
  componentDidUpdate() {
    const symbol_id = this.props.match.params.symbolId || "";
    if (this.props.config.futuresSymbol && this.props.config.futuresSymbol) {
      const symbold =
        this.props.config.symbols_obj.futures[symbol_id.toUpperCase()];
      if (
        symbold &&
        symbold["firstLevelUnderlyingId"] != this.state.underlying
      ) {
        this.setState({
          underlying: symbold["firstLevelUnderlyingId"],
          quoteToken:
            this.state.quoteToken == -1
              ? this.state.quoteTokens.findIndex(
                  (item) => item.id == symbold["firstLevelUnderlyingId"]
                )
              : this.state.quoteToken,
        });
      }
    }
    if (this.props.qws && !this.state.subed) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.props.qws.sub(
            {
              id: "broker",
              topic: "slowBroker",
              event: "sub",
              params: {
                org: this.props.config.orgId,
                realtimeInterval: window.WEB_CONFIG.realtimeInterval,
                // binary: !Boolean(window.localStorage.ws_binary),
                binary: false,
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
      first_loading: false,
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
    // debugger;
    data.data &&
      data.data.length &&
      WSDATA.setData("symbol_quote_source", data.data);
    this.setState({
      first_loading: false,
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
  goto = async (exchangeId, symbolId) => {
    // if (window.g_k_line_loading) return;
    // window.g_k_line_loading = true;

    // k线未ready时不允许切换
    if (!this.props.tvwidget || !this.props.tvwidget._ready) {
      return;
    }
    let url = route_map.future + "/" + symbolId;
    if (window.location.search) {
      url += "/" + window.location.search;
    }
    this.props.history.push(url);
    // 取消订阅
    // await this.props.dispatch({
    //   type: "layout/qws_cancel",
    //   payload: {}
    // });
    // 清除k线时间记录
    window.g_k_update_time = 0;
    // 更新服务器时间
    // await this.props.dispatch({
    //   type: "layout/getServerTime",
    //   payload: {}
    // });
    // 清除最新成交,深度，盘口数据

    let future_info = this.props.config.symbols_obj.all[symbolId];
    let token2 = future_info.quoteTokenId;
    let token2_name = future_info.quoteTokenName;
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const tokenInfo = symbol_quote[symbolId] || {};
    const buy =
      symbolId.toUpperCase() + this.props.order_choose + "buy_leverage";
    const sale =
      symbolId.toUpperCase() + this.props.order_choose + "sale_leverage";

    const order_setting =
      this.props.order_setting[symbolId.toUpperCase()] || {};
    let buy_risk = "";
    let sale_risk = "";
    (order_setting.riskLimit || []).map((item) => {
      if (item.side == "BUY_OPEN") {
        buy_risk = item.riskLimitId;
      }
      if (item.side == "SELL_OPEN") {
        sale_risk = item.riskLimitId;
      }
    });

    WSDATA.clearAll("qws");
    this.props.dispatch({
      type: "ws/save",
      payload: {
        merged_depth: {},
        depth: {},
        trades: {},
      },
    });
    this.props.callback && this.props.callback();
    await this.props.dispatch({
      type: "future/handleChange",
      payload: {
        newTrade: [],
        depth: {
          sell: [],
          buy: [],
        },
        symbol_id: symbolId, // 币对id
        exchange_id: exchangeId,

        sale_quantity: "",
        sale_price: tokenInfo.c || "",
        sale_lever: null, // 杠杠dom节点
        sale_type: 0, // 0= 限价， 1 = 计划委托
        sale_price_type: 0, // 价格类型 : price_types[n]
        sale_trigger_price: "", // 计划委托触发价格
        sale_leverage:
          window.localStorage[sale] || future_info.baseTokenFutures.levers[0], // 杠杆值
        sale_progress: 0, // 买入进度条
        sale_max: 0, // 限价买入最大值，根据用户价格进行计算
        sale_risk, // 风险限额id

        buy_quantity: "",
        buy_price: tokenInfo.c || "",
        buy_lever: null, // 杠杠dom节点
        buy_type: 0, // 0= 限价， 1 = 计划委托
        buy_price_type: 0, // 价格类型 : price_types[n]
        buy_trigger_price: "", // 计划委托触发价格
        buy_leverage:
          window.localStorage[buy] || future_info.baseTokenFutures.levers[0], // 杠杆值
        buy_progress: 0, // 买入进度条
        buy_max: 0, // 限价买入最大值，根据用户价格进行计算
        buy_risk, // 风险限额id

        digitMerge: (future_info.digitMerge || "").split(","),
        aggTrade_digits: CONST.depth[future_info.minPricePrecision],
        max_digits: CONST.depth[future_info.minPricePrecision],
        base_precision: CONST.depth[future_info.basePrecision], // 数量精度 如 8 表示小数留8位
        quote_precision: CONST.depth[future_info.quotePrecision], // 金额精度 如 8 表示小数留8位
        min_price_precision: future_info.minPricePrecision, // 价格交易step, 如 0.1
        min_trade_quantity: future_info.minTradeQuantity, // 数量交易step 如 0.1
        min_trade_amount: future_info.minTradeAmount, // 金额交易step  如 0.1

        token2,
        token2_name,
        future_info: future_info,
        indexToken: future_info.baseTokenFutures.displayIndexToken,
      },
    });
    this.props.dispatch({
      type: "future/get_funding_rates",
      payload: {
        symbol_id: symbolId,
      },
    });

    if (this.props.setProgress) {
      this.props.setProgress("buy_progress", 0);
      this.props.setProgress("sale_progress", 0);
    }

    // 更新余额
    // await this.props.dispatch({
    //   type: "layout/getOptionAssetAva",
    //   payload: {
    //     token_ids: this.props.match.params.symbolId
    //   }
    // });
    // 更新永续合约资产
    // await this.props.dispatch({
    //   type: "layout/getFuturesAsset",
    //   payload: {}
    // });
    // 更新币对信息
    // await this.props.dispatch({
    //   type: "layout/filterChange",
    //   payload: {},
    //   reset: true
    // });
    // // 重新订阅
    // await this.props.dispatch({
    //   type: "layout/qws_sub",
    //   payload: {},
    //   dispatch: this.props.dispatch
    // });
    // // 更新kline， reset
    // if (this.props.datafeed_reset) {
    //   this.props.datafeed_reset(
    //     symbolId,
    //     CONST["k"][this.props.max_digits],
    //     this.props.base_precision,
    //     this.props.max_digits
    //   );
    //   if (this.props.tvwidget) {
    //     this.props.tvwidget.chart().resetData();
    //     this.props.tvwidget.chart().setSymbol(future_info.symbolName);
    //   }
    // }
    // setTimeout(() => {
    //   window.g_k_line_loading = false;
    // }, 1000);
  };
  focus() {
    this.setState({
      search: !this.state.search,
    });
  }
  favorite(exchangeId, symbolId) {
    this.props.dispatch({
      type: "layout/favorite",
      payload: {
        symbolId,
        exchangeId,
      },
    });
  }
  renderPrec(item) {
    const { classes } = this.props;
    const s = classes;
    if (item) {
      return (
        <div className={Number(item.m) >= 0 ? s.up : s.down}>
          {Number(item.m) > 0 ? "+" : ""}
          {Number(item.m)
            ? helper.format(Math.floor(Number(item.m) * 10000) / 100, 2) + "%"
            : "0.00%"}
          {/* {item.quote.close - item.quote.open >= 0 ? (
            <Iconfont type="positive" />
          ) : (
            <Iconfont type="reverse" />
          )} */}
        </div>
      );
    } else {
      return "";
    }
  }
  renderTitle(n, prefix = "") {
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
        id: "成交额",
      }),
    ];
    const { classes } = this.props;
    const s = classes;
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
  renderData = (data, underlyId) => {
    const { classes } = this.props;
    const s = classes;
    if (this.state.first_loading) {
      return (
        <div className={s.noresult}>
          {this.props.intl.formatMessage({ id: "加载中..." })}
        </div>
      );
    }
    if (!data.length) {
      return (
        <div className={s.noresult}>
          {this.props.intl.formatMessage({ id: "暂无数据" })}
        </div>
      );
    }
    const pathname = window.location.pathname.toUpperCase();
    const params = pathname.split("/");
    let sysmbols = this.props.config.symbols_obj;
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    return data.map((it, i) => {
      const d = sysmbols.all[it.symbolId];
      const item = symbol_quote[it.symbolId] || {};
      let digitMerge = d.digitMerge.split(",");
      digitMerge = digitMerge[digitMerge.length - 1];
      //if (d.firstLevelUnderlyingId != underlyId) return;
      const displayTokenId = d.baseTokenFutures
        ? d.baseTokenFutures.displayTokenId
        : "";
      const basePrecision = d.basePrecision
        ? CONST["depth"][d.basePrecision]
        : 2;
      const cRates =
        item && item.c && displayTokenId
          ? helper.currencyValue(this.props.rates, item.c, displayTokenId)
          : ["", ""];
      return (
        <div
          className={
            params.length && params[params.length - 1] == d.symbolId
              ? classnames(s.item, s.item_on)
              : s.item
          }
          key={i}
          onClick={this.goto.bind(this, d.exchangeId, d.symbolId)}
        >
          <div>
            {d.symbolName}
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
          <div>
            {item && item.c
              ? helper.digits(item.c, CONST["depth"][digitMerge])
              : "-"}
          </div>
          {this.renderPrec(item)}
          <div>
            {item && item.v ? helper.digits(item.v, basePrecision) : ""}{" "}
            {this.props.intl.formatMessage({ id: "张" })}
          </div>
        </div>
      );
    });
  };
  changeUnderlying = (i) => (e) => {
    this.setState({
      quoteToken: i,
    });
  };
  clear() {
    this.setState({
      search_text: "",
    });
  }
  render() {
    //window.console.log("tokenList render");
    const { classes } = this.props;
    const s = classes;
    let sysmbols = this.props.config.symbols_obj;
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    let data = [];
    Object.keys(sysmbols.futures || {}).map((item) => {
      const info = sysmbols.futures[item];
      if (
        item.indexOf((this.state.search_text || "").toUpperCase()) > -1 &&
        this.state.quoteToken > -1 &&
        info.firstLevelUnderlyingId ==
          this.state.quoteTokens[this.state.quoteToken]["id"]
      ) {
        data.push(info);
      }
    });
    data.sort((_a, _b) => {
      const a = symbol_quote[_a.symbolId] || {
        s: _a.symbolId,
        c: 0,
        m: 0,
        h: 0,
        l: 0,
        v: 0,
        qv: 0,
      };
      const b = symbol_quote[_b.symbolId] || {
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
      <div
        className={classnames(
          s.tokenList,
          window.localStorage.lang == "en-us" ? s.tokenList_en : ""
        )}
      >
        {/* <div
          className={
            this.state.focus ? classnames(s.search, s.focus) : s.search
          }
        >
          <Input2
            placeholder={this.props.intl.formatMessage({
              id: "搜索"
            })}
            value={this.state.search_text}
            onInputChange={this.search}
            onFocus={this.focus}
            onBlur={this.focus}
            suffix={<Icon type="search" />}
          />
        </div> */}
        <div className={s.list_data}>
          <div>
            <div className={s.list_type}>
              {this.props.config.futuresUnderlying.map((item, i) => {
                return (
                  <span
                    className={i == this.state.quoteToken ? s.check : ""}
                    onClick={this.changeUnderlying(i)}
                    key={item.id}
                  >
                    {this.props.intl.formatMessage({ id: item.name })}
                  </span>
                );
              })}
              <TextFieldCN
                value={this.state.search_text}
                onChange={this.search}
                onFocus={this.focus}
                onBlur={this.focus}
                className={classes.search}
                placeholder={this.props.intl.formatMessage({ id: "搜索" })}
                variant="outlined"
                InputProps={{
                  startAdornment: <Iconfont type="search" size={22} />,
                  endAdornment: this.state.search_text ? (
                    <Iconfont
                      type="delete"
                      size={16}
                      onClick={this.clear.bind(this, true)}
                    />
                  ) : (
                    ""
                  ),
                  classes: {
                    root: classes.inputroot,
                    focused: classes.inputfocused,
                  },
                }}
              />
            </div>
            <div className={s.list_title}>
              <div className={s.list_item}>{this.renderTitle(0)}</div>
              <div className={s.list_item}>{this.renderTitle(1)}</div>
              <div className={s.list_item}>{this.renderTitle(2)}</div>
              <div className={s.list_item}>{this.renderTitle(5)}</div>
            </div>
            <div>{this.renderData(data, this.state.underlying)}</div>
          </div>
          {/* {(this.props.config.futuresUnderlying || []).map(item => {
            return (
              <div key={item.id}>
                <div className={s.list_type}>{item.name}</div>
                {this.renderData(data, item.id)}
              </div>
            );
          })} */}
          {/* <div className={s.list_type2}>
            <a href={route_map.future_delivery}>
              {this.props.intl.formatMessage({ id: "交割记录" })}
            </a>
          </div> */}
          {/* <div className={s.list_type3}>
            <a href={route_map.future_insurance_fund}>
              {this.props.intl.formatMessage({ id: "保险基金" })}
            </a>
          </div> */}
          {/* {this.renderData(symbol_data)} */}
        </div>
      </div>
    );
  }
}

export default withStyles((theme) => ({
  ...quote_style(theme),
  ...styles(theme),
}))(injectIntl(TokenList));
