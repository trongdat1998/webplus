import React from "react";
import { injectIntl } from "react-intl";
import classnames from "classnames";
import { Grid, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment-timezone";

import TradingView from "../../../utils/charting_library.min";
import { getIntervalFromResolution } from "../../../utils/resoution";
import DataFeed from "./dataFeed";
import helper from "../../../utils/helper";
import { Iconfont, message } from "../../../lib";
import CONST from "../../../config/const";
import WSDATA from "../../../models/data_source";
import styles from "../../public/quote_style";
import TooltipCommon from "../../public/tooltip";

let reset_timer = null;
let orderline_timer = null;
let datafeed;
let palette2 = window.palette2[localStorage.futureQuoteMode];
function toFullScreen(dom) {
  if (dom.requestFullscreen) {
    return dom.requestFullscreen();
  } else if (dom.webkitEnterFullScreen) {
    return dom.webkitEnterFullScreen();
  } else if (dom.webkitRequestFullScreen) {
    return dom.webkitRequestFullScreen();
  } else if (dom.mozRequestFullScreen) {
    return dom.mozRequestFullScreen();
  } else if (dom.msRequestFullscreen) {
    return dom.msRequestFullscreen();
  }
}
function exitFullScreen() {
  const dom = window.document;
  if (dom.requestFullscreen) {
    return dom.requestFullscreen();
  } else if (dom.webkitExitFullScreen) {
    return dom.webkitExitFullScreen();
  } else if (dom.webkitRequestFullScreen) {
    return dom.webkitRequestFullScreen();
  } else if (dom.webkitCancelFullScreen) {
    return dom.webkitCancelFullScreen();
  } else if (dom.mozRequestFullScreen) {
    return dom.mozRequestFullScreen();
  } else if (dom.msRequestFullscreen) {
    return dom.msRequestFullscreen();
  }
}
function checkFull() {
  let isFull =
    document.fullscreenEnabled ||
    window.fullScreen ||
    document.webkitIsFullScreen ||
    document.msFullscreenEnabled;
  //to fix : false || undefined == undefined
  if (isFull === undefined) {
    isFull = false;
  }
  return isFull;
}
class Kline extends React.Component {
  constructor() {
    super();
    this.state = {
      orderline: {},
      subed: false,
      chartType: 1,
      resolution: 15,
      res: 15,
      header_buttons: CONST.kline_btns,
      theme: {
        up: window.palette.up.main,
        down: window.palette.down.main,
        bg: palette2.grey[800],
        grid: helper.hex_to_rgba(window.palette.grey[500], 0.08),
        grid2: palette2.grey[500],
        cross: "rgba(104,119,139,.7)",
        border: palette2.grey[800],
        text: palette2.grey[300],
        areatop: helper.hex_to_rgba(window.palette.primary.main, 0.5),
        areadown: helper.hex_to_rgba(window.palette.primary.main, 0.01),
        showLegend: true,
      },
      overrides: function (t) {
        return {
          volumePaneSize: "medium",
          "scalesProperties.lineColor": t.grid2,
          "scalesProperties.textColor": t.text,
          "paneProperties.background": t.bg,
          "paneProperties.vertGridProperties.color": t.grid,
          "paneProperties.horzGridProperties.color": t.grid,
          "paneProperties.crossHairProperties.color": t.cross,
          // "paneProperties.crossHairProperties.style": "",
          // "paneProperties.crossHairProperties.width": 0,
          "paneProperties.legendProperties.showLegend": !!t.showLegend,
          "paneProperties.legendProperties.showStudyArguments": !0,
          "paneProperties.legendProperties.showStudyTitles": !0,
          "paneProperties.legendProperties.showStudyValues": !0,
          "paneProperties.legendProperties.showSeriesTitle": !0,
          "paneProperties.legendProperties.showSeriesOHLC": !0,
          "mainSeriesProperties.style": t.chartType,
          "mainSeriesProperties.candleStyle.upColor": t.up,
          "mainSeriesProperties.candleStyle.downColor": t.down,
          "mainSeriesProperties.candleStyle.drawWick": !0,
          "mainSeriesProperties.candleStyle.drawBorder": !0,
          "mainSeriesProperties.candleStyle.borderColor": t.border,
          "mainSeriesProperties.candleStyle.borderUpColor": t.up,
          "mainSeriesProperties.candleStyle.borderDownColor": t.down,
          "mainSeriesProperties.candleStyle.wickUpColor": t.up,
          "mainSeriesProperties.candleStyle.wickDownColor": t.down,
          "mainSeriesProperties.candleStyle.barColorsOnPrevClose": !1,
          "mainSeriesProperties.hollowCandleStyle.upColor": t.up,
          "mainSeriesProperties.hollowCandleStyle.downColor": t.down,
          "mainSeriesProperties.hollowCandleStyle.drawWick": !0,
          "mainSeriesProperties.hollowCandleStyle.drawBorder": !0,
          "mainSeriesProperties.hollowCandleStyle.borderColor": t.border,
          "mainSeriesProperties.hollowCandleStyle.borderUpColor": t.up,
          "mainSeriesProperties.hollowCandleStyle.borderDownColor": t.down,
          "mainSeriesProperties.hollowCandleStyle.wickColor": t.line,
          "mainSeriesProperties.haStyle.upColor": t.up,
          "mainSeriesProperties.haStyle.downColor": t.down,
          "mainSeriesProperties.haStyle.drawWick": !0,
          "mainSeriesProperties.haStyle.drawBorder": !0,
          "mainSeriesProperties.haStyle.borderColor": t.border,
          "mainSeriesProperties.haStyle.borderUpColor": t.up,
          "mainSeriesProperties.haStyle.borderDownColor": t.down,
          "mainSeriesProperties.haStyle.wickColor": t.border,
          "mainSeriesProperties.haStyle.barColorsOnPrevClose": !1,
          "mainSeriesProperties.barStyle.upColor": t.up,
          "mainSeriesProperties.barStyle.downColor": t.down,
          "mainSeriesProperties.barStyle.barColorsOnPrevClose": !1,
          "mainSeriesProperties.barStyle.dontDrawOpen": !1,
          "mainSeriesProperties.lineStyle.color": t.border,
          "mainSeriesProperties.lineStyle.linewidth": 1,
          "mainSeriesProperties.lineStyle.priceSource": "close",
          "mainSeriesProperties.areaStyle.color1": t.areatop,
          "mainSeriesProperties.areaStyle.color2": t.areadown,
          "mainSeriesProperties.areaStyle.linecolor": t.border,
          "mainSeriesProperties.areaStyle.linewidth": 1,
          "mainSeriesProperties.areaStyle.priceSource": "close",
        };
      },
      getIntervalClass: (t) => {
        const e = t.resolution;
        const n = t.chartType;
        return "interval-" + e + "-" + (!n ? 1 : n);
      },
      interval: 15,
      page_hide_time: 0,
      tvwidget: null,
      datafeed: null,
      fullScreen: false,
      safari_iphone: false,
    };
    this.change = this.change.bind(this);
  }
  componentDidMount(prevProps, prevState) {
    this.start();

    const ar = [...this.state.header_buttons];
    // ar[0].slug = window.appLocale.messages["分时"];
    this.setState({
      header_buttons: ar,
    });
    // window.addEventListener("pageshow", this.pageShow, false);
    // window.addEventListener("pagehide", this.pageHide, false);

    //  for safari
    window.addEventListener(
      "resize",
      () => {
        if (this.state.fullScreen) {
          setTimeout(() => {
            if (!checkFull()) {
              this.setState({
                fullScreen: false,
              });
            }
          }, 1000);
        }
      },
      false
    );
    // chrome,firefox,ie
    this.klinebox.addEventListener(
      "fullscreenchange",
      (e) => {
        if (this.state.fullScreen && !window.document.fullscreenElement) {
          this.setState({
            fullScreen: false,
          });
        }
      },
      false
    );

    window.addEventListener(
      "online",
      () => {
        this.resetKline(1);
      },
      false
    );

    //this.updateOrderLine();
  }
  componentWillUnmount() {
    orderline_timer && clearTimeout(orderline_timer);
    orderline_timer = null;
  }
  componentDidUpdate(preProps) {
    if (this.props.qws && !this.state.subed && this.props.exchange_id) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.sub(this.props.exchange_id, this.props.symbol_id);
        }
      );
    }
    // symbol_id,exchange_id变化时，取消之前的订阅，重新订阅，重置digit
    if (
      (this.props.symbol_id != preProps.symbol_id ||
        this.props.exchange_id != preProps.exchange_id) &&
      preProps.symbol_id &&
      preProps.exchange_id
    ) {
      // 取消之前的订阅
      if (preProps.exchange_id && preProps.symbol_id) {
        this.cancel(
          "kline_" +
            preProps.exchange_id +
            preProps.symbol_id +
            this.getResolition(),
          "indexKline_"
        );
      }
      this.setState(
        {
          digit: this.props.max_digits,
        },
        () => {
          if (reset_timer) {
            clearTimeout(reset_timer);
          }
          reset_timer = setTimeout(() => {
            // 重置k线
            this.resetKline();
            this.initStudy();
          }, 100);
        }
      );
    }

    if (preProps.quoteMode != this.props.quoteMode) {
      let p = window.palette2[this.props.quoteMode];
      let t = {
        ...this.state.theme,
        ...{
          bg: p.grey[800],
          grid2: p.grey[500],
          border: p.grey[800],
          text: p.grey[300],
        },
      };
      t.chartType = this.state.res == "Time" ? 3 : 1;
      if (this.state.tvwidget && this.state.tvwidget._ready) {
        this.state.tvwidget.changeTheme(this.props.quoteMode);
        this.state.tvwidget.applyOverrides(this.state.overrides(t));
      }
    }
  }
  changeResolition = (data) => {
    const { resolution, res, chartType } = data;
    this.cancel(
      "kline_" +
        this.props.exchange_id +
        this.props.symbol_id +
        this.getResolition(),
      "indexKline_"
    );
    this.setState(
      {
        resolution: resolution,
        res: res,
        chartType: chartType || 1,
      },
      () => {
        if (this.state.datafeed) {
          this.state.datafeed.getonResetCacheNeededCallback();
          this.state.datafeed.setResolition(resolution);
        }
        if (this.state.tvwidget && this.state.tvwidget._ready) {
          //this.state.tvwidget.chart().resetData();
          this.state.tvwidget.chart().setChartType(chartType ? chartType : 1);
          this.state.tvwidget.chart().setResolution(resolution);
          this.tradviewAction("chartReset")();
          this.tradviewAction("timeScaleReset")();
          // 重置k线
          this.initStudy();
        }
        this.sub(this.props.exchange_id, this.props.symbol_id);
      }
    );
  };
  tradviewAction = (key) => (e) => {
    if (this.state.tvwidget) {
      this.state.tvwidget.chart().executeActionById(key);
    }
  };
  resetKline = async (t) => {
    // 重置k线
    const symbol_info =
      this.props.config.symbols_obj.all[this.props.symbol_id] || {};
    if (this.state.datafeed) {
      this.state.datafeed.reset(
        symbol_info.symbolName,
        CONST["k"][CONST.depth[symbol_info.minPricePrecision]],
        CONST.depth[symbol_info.basePrecision],
        CONST.depth[symbol_info.minPricePrecision],
        symbol_info.exchangeId,
        symbol_info.symbolId,
        [this.props.indexToken]
      );
      this.state.datafeed.getonResetCacheNeededCallback();
      if (t) {
        await this.state.datafeed.history(
          { name: symbol_info.symbolName },
          "",
          ""
        );
        await this.state.datafeed.history(
          { name: this.props.indexToken },
          "",
          ""
        );
      }
    }
    if (this.state.tvwidget && this.state.tvwidget._ready) {
      //await this.state.tvwidget.chart().resetData();
      this.state.tvwidget.chart().setSymbol(symbol_info.symbolName);
      this.tradviewAction("chartReset")();
      this.tradviewAction("timeScaleReset")();
    }
    // 重新订阅
    this.sub(this.props.exchange_id, this.props.symbol_id);
  };
  // ws重连成功后，重新读取k线历史数据
  reopen = (id, reopen) => {
    if (reopen) {
      this.resetKline(1);
    }
  };
  sub = (exchange_id, symbol_id) => {
    this.props.qws.sub(
      {
        id: "kline_" + exchange_id + symbol_id + this.getResolition(),
        topic: `kline_${this.getResolition()}`,
        event: "sub",
        symbol: exchange_id + "." + symbol_id,
        params: {
          binary: window.ws_binary,
          klineType: this.getResolition(),
          limit: 1500,
        },
      },
      this.httpAction,
      this.callback,
      this.reopen
    );
    this.props.qws.sub(
      {
        id: "indexKline_" + symbol_id + this.getResolition(),
        topic: "indexKline_" + this.getResolition(),
        event: "sub",
        symbol: this.props.indexToken,
        params: {
          binary: !Boolean(window.localStorage.ws_binary),
          limit: 1500,
        },
      },
      null,
      this.callback2
    );
  };
  // 取消之前的订阅
  cancel = (id, id2) => {
    if (this.props.qws) {
      id && this.props.qws.cancel(id);
      id2 && this.props.qws.cancel(id2);
    }
  };

  getResolition = (resolution) =>
    getIntervalFromResolution(resolution || this.state.resolution);

  httpAction = async () => {
    await this.props.dispatch({
      type: "ws/kline_http",
      payload: {
        interval: this.getResolition(),
        symbol: (
          this.props.exchange_id +
          "." +
          this.props.symbol_id
        ).toUpperCase(),
        id: this.props.exchange_id + this.props.symbol_id,
        from: "",
        to: "",
        limit: 1,
      },
    });
    await this.props.dispatch({
      type: "ws/index_http",
      payload: {
        symbol: this.props.indexToken,
        interval: this.getResolition(),
        limit: 1,
      },
    });
  };
  /**
   * data={
   *   topic:'kline_15m',
   *   params:{},
   *   f: true/false,
   *   id: 'kline_15m,
   *   shared: true/false,
   *   data:[]
   * }
   */
  callback = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("kline_source", data.data, data.id, data.f);
  };
  callback2 = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("indexKline_source", data.data, data.id, data.f);
    // 数据同步到原指数订阅
    data.data &&
      data.data.length &&
      WSDATA.setData("indices_source", {
        [data.data[data.data.length - 1]["s"]]:
          data.data[data.data.length - 1]["c"],
      });
  };
  change(t) {
    this.props.dispatch({
      type: "future/save",
      payload: {
        chartType: t,
      },
    });
  }
  fullScreen = async () => {
    // 全屏
    if (!this.state.fullScreen) {
      await toFullScreen(this.klinebox);
      this.setState({
        fullScreen: true,
      });
      return;
    }
    // 取消全屏
    try {
      exitFullScreen();
    } catch (e) {}
    this.setState({
      fullScreen: false,
    });
  };
  start = () => {
    if (!this.props.max_digits) {
      return setTimeout(this.start, 200);
    }
    const t = this.state.theme;
    const buttons = this.state.header_buttons;
    const overrides = this.state.overrides(t);
    let tvwidget;
    const symbolId = this.props.symbol_id;
    const exchangeId = this.props.exchange_id;
    const symbol_info = this.props.config.symbols_obj.all[symbolId] || {};

    datafeed = new DataFeed(
      symbol_info.symbolName,
      "",
      "stock",
      CONST.kline_type,
      CONST["k"][this.props.max_digits],
      this.props.base_precision,
      this.props.qws,
      this.props.qws_status,
      this.props.max_digits,
      tvwidget,
      exchangeId,
      symbol_info.symbolId,
      [this.props.indexToken]
    );

    this.setState({
      datafeed: datafeed,
    });
    // this.props.dispatch({
    //   type: "exchange/handleChange",
    //   payload: {
    //     datafeed_reset: datafeed.reset
    //   }
    // });
    const that = this;
    tvwidget = new TradingView.widget({
      //debug: true, // uncomment this line to see Library errors and warnings in the window.console
      //fullscreen: true,
      toolbar_bg: "transparent",
      loading_screen: { backgroundColor: "transparent" },
      autosize: true,
      symbol: symbol_info.symbolName,
      interval: this.state.interval,
      theme: this.props.quoteMode,
      //timeframe: "1D",
      timezone: moment.tz.guess(),
      container_id: "tv_chart_container",
      //	BEWARE: no trailing slash is expected in feed URL
      datafeed,
      library_path: "/static/charting_library/",
      locale: this.props.kline_locale[window.localStorage.lang],
      //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
      drawings_access: {
        type: "black",
        tools: [
          {
            name: "Regression Trend",
          },
        ],
      },
      // 隐藏项
      disabled_features: [
        "compare_symbol",
        "display_market_status",
        "go_to_date",
        "header_widget",
        "header_chart_type",
        "header_compare",
        "header_interval_dialog_button",
        "header_resolutions",
        "header_screenshot",
        "header_symbol_search",
        "header_undo_redo",
        "header_saveload",
        "legend_context_menu",
        "show_hide_button_in_legend",
        "show_interval_dialog_on_key_press",
        "snapshot_trading_drawings",
        "symbol_info",
        "timeframes_toolbar",
        "use_localstorage_for_settings",
        "volume_force_overlay",
      ],
      // 展示项
      enabled_features: [
        "dont_show_boolean_study_arguments",
        "hide_last_na_study_output",
        "move_logo_to_main_pane",
        "same_data_requery",
        "side_toolbar_in_fullscreen_mode",
        "disable_resolution_rebuild",
        "keep_left_toolbar_visible_on_small_screens",
        "layout_about_to_be_changed",
      ],
      //charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.13",
      // client_id: "tradingview.com",
      // user_id: "public_user_id",
      custom_css_url: "20.02.25.css",
      width: "100%",
      height: "100%",
      customFormatters: {
        timeFormatter: {
          format: function (date) {
            // if (
            //   that.props.resolution == "1d" ||
            //   that.props.resolution == "1w" ||
            //   that.props.resolution == "1M"
            // ) {
            //   return "";
            // }
            const _format_str = "%h:%m";
            let h = date.getUTCHours();
            if (h < 10) {
              h = "0" + h;
            }
            let m = date.getUTCMinutes();
            if (m < 10) {
              m = "0" + m;
            }
            let s = date.getUTCSeconds();
            if (s < 10) {
              s = "0" + s;
            }
            return _format_str
              .replace("%h", h, 2)
              .replace("%m", m, 2)
              .replace("%s", s, 2);
          },
        },
        dateFormatter: {
          format: function (date) {
            let h = date.getUTCHours();
            if (h < 10) {
              h = "0" + h;
            }
            let m = date.getUTCMinutes();
            if (m < 10) {
              m = "0" + m;
            }
            // let s = date.getUTCSeconds();
            // if (s < 10) {
            //   s = "0" + s;
            // }
            let d = ``;
            if (
              that.props.resolution == "1w" ||
              that.props.resolution == "1M"
            ) {
              d = ` ${h}:${m}`;
            }
            return (
              date.getUTCFullYear() +
              "/" +
              (date.getUTCMonth() + 1) +
              "/" +
              date.getUTCDate() +
              d
            );
          },
        },
      },
      overrides,
      studies_overrides: {
        "volume.volume.color.0": helper.hex_to_rgba(
          window.palette.down.main,
          0.3
        ),
        "volume.volume.color.1": helper.hex_to_rgba(
          window.palette.up.main,
          0.3
        ),
      },
    });
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        tvwidget,
      },
    });
    tvwidget.onChartReady(() => {
      const dom = window.document.querySelector("#tv_chart_mark");
      dom && (dom.style.display = "none");

      this.initStudy(tvwidget);
      this.setState({
        tvwidget,
      });
    });
  };
  tradviewAction = (key) => (e) => {
    if (this.state.tvwidget) {
      this.state.tvwidget.chart().executeActionById(key);
    }
  };
  renderKlineBtns(item, i) {
    const { classes } = this.props;
    const width = window.document.documentElement.offsetWidth;
    if (item.option) {
      let selected = item.option.filter((list) => this.state.res == list.res);
      if (width > 1440) {
        return item.option.map((n) => {
          return (
            <span
              className={n.res == this.state.res ? "selected" : ""}
              key={n.res}
              onClick={this.changeResolition.bind(this, n)}
            >
              {n.full}
            </span>
          );
        });
      } else {
        return (
          <div
            key={i}
            className={classnames(
              classes.select1,
              selected && selected.length ? "selected" : ""
            )}
          >
            <p>
              {selected && selected.length
                ? selected[0].slug
                : item.option[0].slug}
              <Iconfont type="order_down" size="16" />
            </p>
            <ul
              style={{
                boxShadow: `0 2px 4px ${helper.hex_to_rgba(
                  window.palette.common.black,
                  0.2
                )}`,
              }}
            >
              {item.option.map((n) => {
                return (
                  <li
                    key={n.res}
                    className={this.state.res == n.res ? "selected" : ""}
                    onClick={this.changeResolition.bind(this, n)}
                  >
                    {n.slug}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }
    }
    return (
      <span
        className={item.res == this.state.res ? "selected" : ""}
        key={item.res}
        onClick={this.changeResolition.bind(this, item)}
      >
        {width > 1440 ? item.full : item.slug}
      </span>
    );
  }
  initStudy = async (tvwidget) => {
    if (!this.state.tvwidget && !tvwidget) {
      return;
    }
    const tv = this.state.tvwidget || tvwidget;
    if (
      window.localStorage[
        "tvStudy." +
          this.props.symbol_id +
          this.state.resolution +
          this.state.chartType
      ]
    ) {
      await tv.load(
        JSON.parse(
          window.localStorage[
            "tvStudy." +
              this.props.symbol_id +
              this.state.resolution +
              this.state.chartType
          ]
        )
      );
      tv.changeTheme(this.props.quoteMode);
      setTimeout(() => {
        tv.chart().executeActionById("timeScaleReset");
        tv.chart().setChartType(this.state.chartType || 1);
      }, 100);
      return;
    }
    // const temp = window.localStorage.tvStudy_temp;
    // if (temp) {
    //   tv.load(JSON.parse(temp));
    //   return;
    // }
    await tv.chart().removeAllShapes();
    await tv.chart().removeAllStudies();
    let c = [
      "#397d51",
      "#5c7798",
      "#821f68",
      window.palette && window.palette.primary && window.palette.primary.main
        ? window.palette.primary.main
        : "#3375E0",
    ];
    let n = [30, 10, 5];
    n.forEach((item, i) => {
      try {
        tv.chart().createStudy("Moving Average", false, false, [item], null, {
          "plot.color": c[i],
          precision: this.props.max_digits,
        });
      } catch (e) {}
    });
    tv.chart().createStudy(
      "Compare",
      false,
      false,
      ["close", this.props.indexToken],
      null,
      { "plot.color": c[3], precision: this.props.max_digits }
    );
    tv.chart().getPanes()[0].getMainSourcePriceScale().setMode(0);
    tv.chart().createStudy("volume");
    tv.chart().executeActionById("timeScaleReset");
    // tv.save((res) => {
    //   window.localStorage.tvStudy_temp = JSON.stringify(res);
    // });
  };
  saveStudy = () => {
    if (this.state.tvwidget) {
      this.state.tvwidget.save((res) => {
        window.localStorage.setItem(
          "tvStudy." +
            this.props.symbol_id +
            this.state.resolution +
            this.state.chartType,
          JSON.stringify(res)
        );
        message.info(this.props.intl.formatMessage({ id: "保存成功" }));
      });
    }
  };
  clearStudy = () => {
    window.localStorage.removeItem(
      "tvStudy." +
        this.props.symbol_id +
        this.state.resolution +
        this.state.chartType
    );
    this.initStudy();
  };
  createOrderLine = (orderId, color, p, q) => {
    let obj = this.state.orderline[orderId];
    if (obj) {
      obj.setPrice(p).setQuantity(q);
      return obj;
    }
    obj = this.state.tvwidget
      .chart()
      .createOrderLine()
      .setLineColor(color)
      .setBodyTextColor(color)
      .setBodyBorderColor(color)
      .setQuantityBorderColor(color)
      .setQuantityBackgroundColor(color)
      .setCancelButtonIconColor(color)
      .setCancelButtonBorderColor(color)
      .onMove(function () {
        //this.setText(this.getPrice());
        this.setPrice(p);
      })
      .onModify("onModify called", function (text) {
        this.setText(this.props.intl.formatMessage({ id: "数量" }));
      })
      .onCancel("onCancel called", function (text) {
        // 取消订单
      })
      .setPrice(p)
      .setText(p)
      .setQuantity(q);
    // this.setState({
    //   orderline: { ...this.state.orderline, [orderId]: obj },
    // });
    return obj;
  };
  removeOrderLine = (orderId) => {
    const obj = this.state.orderline[orderId];
    if (obj) {
      obj.remove();
      // let orders = { ...this.state.orderline };
      // delete orders[orderId];
      // this.setState({
      //   orderline: orders,
      // });
    }
  };
  updateOrderLine = () => {
    if (this.state.tvwidget && this.props.userinfo.userId) {
      let list = this.props.current_list || [];
      let orders = { ...this.state.orderline };
      list.map((item) => {
        if (!(item.type == "STOP" && item.planOrderType != "STOP_COMMON")) {
          orders[item.orderId] = this.createOrderLine(
            item.orderId,
            helper.hex_to_rgba(
              item.side.indexOf("BUY") > -1
                ? window.palette.up.main
                : window.palette.down.main,
              0.8
            ),
            item.price,
            item.origQty
          );
        }
      });

      for (let k in orders) {
        const inlist = list.findIndex((item) => item.orderId == k);
        if (inlist == -1) {
          this.removeOrderLine(k);
          delete orders[k];
        }
      }
      this.setState({
        orderline: orders,
      });
    }
    clearTimeout(orderline_timer);
    orderline_timer = setTimeout(() => this.updateOrderLine(), 150);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.kline} ref={(ref) => (this.klinebox = ref)}>
        <Grid container className={classes.kline_btns} alignItems="center">
          <Grid item>
            <div
              className={classes.kline_btn}
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              {/* <p>Time</p> */}
              {this.state.header_buttons.map((item, i) => {
                return this.renderKlineBtns(item, i);
              })}
            </div>
          </Grid>
          <Grid item className={classes.kline_actions}>
            <TooltipCommon
              title={this.props.intl.formatMessage({
                id: "设置",
              })}
              placement="top"
              mode={true}
            >
              <span>
                <Iconfont
                  type="settings"
                  size="24"
                  onClick={this.tradviewAction("chartProperties")}
                />
              </span>
            </TooltipCommon>
            <TooltipCommon
              title={this.props.intl.formatMessage({
                id: "指标",
              })}
              placement="top"
              mode={true}
            >
              <span>
                <Iconfont
                  type="indicator"
                  size="24"
                  onClick={this.tradviewAction("insertIndicator")}
                />
              </span>
            </TooltipCommon>
            <TooltipCommon
              title={this.props.intl.formatMessage({
                id: "全屏",
              })}
              placement="top"
              mode={true}
            >
              <span>
                <Iconfont
                  type="fullscreen"
                  size="24"
                  onClick={this.fullScreen}
                />
              </span>
            </TooltipCommon>
            <TooltipCommon
              title={this.props.intl.formatMessage({
                id: "保存自定义配置",
              })}
              placement="top"
              mode={true}
            >
              <span>
                <Iconfont type="save" size="24" onClick={this.saveStudy} />
              </span>
            </TooltipCommon>
            {window.localStorage[
              "tvStudy." +
                this.props.symbol_id +
                this.state.resolution +
                this.state.chartType
            ] ? (
              <TooltipCommon
                title={this.props.intl.formatMessage({
                  id: "清除自定义配置",
                })}
                placement="top"
                mode={true}
              >
                <span>
                  <Iconfont
                    type="delete1"
                    size="24"
                    onClick={this.clearStudy}
                  />
                </span>
              </TooltipCommon>
            ) : (
              ""
            )}
          </Grid>
          <Grid
            style={{
              flex: 1,
              height: "24px",
              lineHeight: "24px",
              justifyContent: "flex-end",
            }}
          >
            {this.state.fullScreen ? (
              ""
            ) : (
              <div className={classes.chartype}>
                <span
                  className={this.props.chartType == "kline" ? "choose" : ""}
                  onClick={this.change.bind(this, "kline")}
                >
                  {this.props.intl.formatMessage({
                    id: "K线图",
                  })}
                </span>
                <span
                  className={this.props.chartType == "depth" ? "choose" : ""}
                  onClick={this.change.bind(this, "depth")}
                >
                  {this.props.intl.formatMessage({
                    id: "深度图",
                  })}
                </span>
              </div>
            )}
          </Grid>
        </Grid>
        <div
          id="tv_chart_container"
          className="chart"
          ref={(ref) => (this.kline = ref)}
        />
        <div className={classes.kline_mark} id="tv_chart_mark">
          <CircularProgress size={24} color="primary" />
        </div>{" "}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Kline));
