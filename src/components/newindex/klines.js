// 首页 klines
import React from "react";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import { withStyles } from "@material-ui/core/styles";
import styles from "./klines.style.js";
import helper from "../../utils/helper";
import CanvasLine from "../public/kline_canvas";
import math from "../../utils/mathjs";
import classnames from "classnames";

class Klines extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {},
    };
  }
  componentDidMount() {
    if (this.props.recommendSymbols) {
      this.getKlines(this.props.recommendSymbols);
      this.update();
    }
  }
  getKlines = (ar) => {
    let symbol = [];
    let exchangeId = "";
    ar &&
      ar.map((item) => {
        symbol.push(item.symbolId);
        exchangeId = item.exchangeId;
      });
    if (symbol.length && exchangeId) {
      this.props.dispatch({
        type: "index/getMultiKline",
        payload: {
          exchangeId,
          symbol: symbol.join(","),
          interval: this.props.interval || "1m",
          limit: this.props.limit || 200,
          realtimeInterval: window.WEB_CONFIG.realtimeInterval,
        },
        callback: (data) => {
          if (data) {
            this.setState({
              data,
            });
          }
        },
      });
    }
  };
  // onRef=(ref)=> {
  //   this.canvas = ref;
  // }
  update = () => {
    if (window.location.pathname !== route_map.index) return;
    const data = { ...this.state.data };
    const interval = 60000;
    for (let k in data) {
      if (data[k]) {
        const lastdata = data[k][data[k].length - 1];
        let quote = this.props.symbol_quote[k];
        if (
          quote &&
          quote.t &&
          lastdata &&
          lastdata.t &&
          Math.floor(quote.t / interval) * interval - lastdata.t > 0
        ) {
          quote.t = Math.floor(quote.t / interval) * interval;
          data[k].push(quote);
          data[k].splice(0, 1);
        }
        if (
          quote &&
          quote.t &&
          lastdata &&
          lastdata.t &&
          Math.floor(quote.t / interval) * interval == lastdata.t
        ) {
          quote.t = Math.floor(quote.t / interval) * interval;
          data[k][data[k].length - 1] = quote;
        }
      }
    }
    this.setState({ data }, () => {
      // this.canvas.draw();
      setTimeout(() => {
        this.update();
      }, 200);
    });
  };
  componentWillReceiveProps(nextProps) {
    if (!this.props.recommendSymbols && nextProps.recommendSymbols) {
      this.getKlines(nextProps.recommendSymbols);
      this.update();
    }
  }
  goto = (token1, token2, exchangeId, symbolId, isCoin) => () => {
    if (isCoin) {
      window.location.href = route_map.exchange + "/" + token1 + "/" + token2;
    }
    const isOption = Boolean(this.props.config.symbols_obj.option[symbolId]);
    const isFuture = Boolean(this.props.config.symbols_obj.futures[symbolId]);
    if (isOption) {
      window.location.href = route_map.option + "/" + symbolId;
    }
    if (isFuture) {
      window.location.href = route_map.future + "/" + symbolId;
    }
  };
  render() {
    const classes = this.props.classes;
    const recommendSymbols = this.props.recommendSymbols || [];
    const showKlineNum = 5; //k线展示个数
    return (
      <div className={classes.kline_bg}>
        {recommendSymbols.length ? (
          <div className={classes.kline_box}>
            <div className={classes.kline_content}>
              {recommendSymbols.map((item, i) => {
                const data = this.state.data[item.symbolId] || [];
                const lastdata = data.length
                  ? data[data.length - 1]
                  : { c: 0, o: 0 };
                const cRates = data.length
                  ? helper.currencyValue(
                      this.props.rates,
                      data[data.length - 1]["c"],
                      item.baseTokenFutures
                        ? item.baseTokenFutures.displayTokenId
                        : item.quoteTokenId
                    )
                  : ["", "--"];
                const cPrice = data.length ? data[data.length - 1]["c"] : "--";
                if (i > showKlineNum - 1) return "";
                const isCoin = Boolean(
                  this.props.config.symbols_obj.coin[item.symbolId]
                );
                return (
                  <div key={item.symbolId} className={classes.kline_item}>
                    <div
                      className={classes.kline_item_info}
                      onClick={this.goto(
                        item.baseTokenId,
                        item.quoteTokenId,
                        item.exchangeId,
                        item.symbolId,
                        isCoin
                      )}
                    >
                      {/* <strong>{item.baseTokenName}</strong> */}
                      <span>
                        {isCoin
                          ? `${item.baseTokenName}/${item.quoteTokenName}`
                          : item.symbolName}
                      </span>
                      <div
                        className={
                          lastdata.c - lastdata.o >= 0
                            ? classes.green
                            : classes.red
                        }
                      >
                        {lastdata.c - lastdata.o > 0 ? "+" : ""}
                        {Number(lastdata.o)
                          ? helper.digits(
                              math
                                .chain(lastdata.c)
                                .subtract(lastdata.o)
                                .divide(lastdata.o)
                                .multiply(100)
                                .done(),
                              2
                            ) + "%"
                          : "0.00%"}
                      </div>
                      <br />
                      <strong
                        className={
                          lastdata.c - lastdata.o >= 0 ? "green" : "red"
                        }
                      >
                        {cPrice}
                      </strong>
                      <p>
                        ≈{cRates[0]}
                        {cRates[1]}
                      </p>
                    </div>
                    <div className={classes.kline_canvas}>
                      <CanvasLine
                        data={this.state.data[item.symbolId] || []}
                        // onRef={this.onRef.bind(this)}
                        width={230}
                        height={112}
                        borderColor={
                          lastdata.c - lastdata.o >= 0
                            ? helper.hex_to_rgba(window.palette.up.main, 0.2)
                            : helper.hex_to_rgba(window.palette.down.main, 0.2)
                        }
                        gradientColor={
                          lastdata.c - lastdata.o >= 0
                            ? [
                                helper.hex_to_rgba(window.palette.up.main, 0.2),
                                "rgba(10, 24, 37, 0.2)",
                              ]
                            : [
                                helper.hex_to_rgba(
                                  window.palette.down.main,
                                  0.2
                                ),
                                "rgba(10, 24, 37, 0.2)",
                              ]
                        }
                      />
                    </div>
                    {/* {showKlineNum - 1 === i ? (
                      ""
                    ) : (
                      <div className={classes.kline_line}></div>
                    )} */}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Klines));
