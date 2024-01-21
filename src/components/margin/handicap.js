// 盘口
import React from "react";
import HandicapList from "./handicapList";
import CONST from "../../config/const";
import math from "../../utils/mathjs";
import helper from "../../utils/helper";
import { FormattedMessage, injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import route_map from "../../config/route_map";
import WSDATA from "../../models/data_source";
import styles from "../public/quote_style";
import classnames from "classnames";
import { Iconfont } from "../../lib";
import {
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from "@material-ui/core";
import TooltipCommon from "../public/tooltip";
let prices = {};
let refresh_time = new Date().getTime();
class Handicap extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      subed: false,
      digit: "",
      limit: 22,
      setPriceOnce: false,
      aggTrade_type: "all",
      anchorEl: null,
      refresh_status: 0,
    };
    this.change = this.change.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    this.scrollTo();
    this.update();
  }
  componentDidUpdate(preProps, preState) {
    prices = {};
    (this.props.open_orders || []).map((item) => {
      if (
        item.symbolId == this.props.symbol_id &&
        item.price &&
        this.state.digit !== ""
      ) {
        prices[helper.digits(item.price, this.state.digit)] = 1;
      }
    });
    if (this.props.qws && !this.state.subed && this.props.max_digits) {
      this.setState(
        {
          subed: true,
          digit: this.state.digit === "" ? this.props.max_digits : "",
        },
        () => {
          this.sub(
            this.props.exchange_id,
            this.props.symbol_id,
            this.state.digit === "" ? this.props.max_digits : this.state.digit
          );
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
          preProps.exchange_id + "." + preProps.symbol_id + preState.digit
        );
      }
      this.setState(
        {
          digit: this.props.max_digits,
        },
        () => {
          // 重新订阅
          this.sub(
            this.props.exchange_id,
            this.props.symbol_id,
            this.state.digit
          );
        }
      );
    }
    if (
      !this.state.setPriceOnce &&
      this.props.symbol_quote[this.props.symbol_id]
    ) {
      this.setState(
        {
          setPriceOnce: true,
        },
        () => {
          this.props.symbol_quote[this.props.symbol_id] &&
            this.setPrice(this.props.symbol_quote[this.props.symbol_id]["c"]);
        }
      );
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.cancel(
      this.props.exchange_id + "." + this.props.symbol_id + this.state.digit
    );
  }
  shouldComponentUpdate(preProps, preState) {
    const states = [
      this.state.digit,
      this.state.limit,
      this.state.aggTrade_type,
      this.state.anchorEl,
      this.state.refresh_status,
      this.props.quoteMode,
      this.props.symbol_id,
    ];
    const preStates = [
      preState.digit,
      preState.limit,
      preState.aggTrade_type,
      preState.anchorEl,
      preState.suffix,
      preState.refresh_status,
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
  // 200ms 更新一次当前价格
  update = async () => {
    await helper.delay(CONST.refresh);
    let now = new Date().getTime();
    if (now - refresh_time > CONST.refresh_handicap && this._isMounted) {
      this.setState({
        refresh_status: 1 - this.state.refresh_status,
      });
      refresh_time = now;
    }
    if (this._isMounted) {
      this.update();
    }
  };
  httpAction = async (payload) => {
    await this.props.dispatch({
      type: "ws/merge_depth_http",
      payload: {
        dumpScale:
          this.state.digit <= 0 ? this.state.digit - 1 : this.state.digit,
        symbol: this.props.exchange_id + "." + this.props.symbol_id,
        limit: this.state.limit,
      },
    });
  };
  /**
   * data={
   *   topic:'mergedDepth',
   *   params:{},
   *   f: true/false,
   *   id: 'mergedDepth2,
   *   shared: true/false,
   *   data:[{a:[ [120,1],[111,2] ],b:[ [12,3], [123,13] ]}] m:涨跌幅
   * }
   */
  callback = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("mergedDepth_source", data.data, data.id, 1);
    if (data.f && this._isMounted) {
      this.setState({
        refresh_status: 1 - this.state.refresh_status,
      });
    }
  };
  sub = (exchange_id, symbol_id, digit) => {
    this.props.qws.sub(
      {
        id: exchange_id + "." + symbol_id + "" + digit,
        topic: "mergedDepth",
        event: "sub",
        symbol: exchange_id + "." + symbol_id,
        limit: this.state.limit,
        params: {
          dumpScale: digit <= 0 ? digit - 1 : digit,
          binary: !Boolean(window.localStorage.ws_binary),
        },
      },
      this.httpAction,
      this.callback
    );
  };
  // 取消之前的订阅
  cancel = (id) => {
    if (this.props.qws && id) {
      this.props.qws.cancel(id);
    }
  };
  changeDigit = (v) => {
    // 取消之前的订阅
    this.closeModal();
    this.cancel(
      this.props.exchange_id + "." + this.props.symbol_id + this.state.digit
    );
    this.setState(
      {
        digit: v,
      },
      () => {
        this.sub(
          this.props.exchange_id,
          this.props.symbol_id,
          this.state.digit
        );
        this.props.dispatch({
          type: "lever/save",
          payload: {
            aggTrade_digits: this.state.digit,
          },
        });
      }
    );
  };
  getCurrentQuote = () => {
    const quotes = WSDATA.getData("symbol_quote_source");
    const s_id = this.props.symbol_id;
    return quotes[s_id] || { c: 0, m: 0 };
  };
  countShadow = () => {
    const digit = this.state.digit;
    const datas = WSDATA.getData("mergedDepth_source");
    if (
      !this.props.symbol_id ||
      this.state.digit === "" ||
      !datas[this.props.exchange_id + "." + this.props.symbol_id + digit]
    ) {
      return {
        a: [],
        b: [],
        fix: 0,
      };
    }

    const data =
      datas[this.props.exchange_id + "." + this.props.symbol_id + digit];
    if (!data) {
      return {
        a: [],
        b: [],
        fix: 0,
      };
    }
    const c = this.getCurrentQuote();
    // 计算平均值 =  ( sell平均值 + buy平均值 ) /2
    let a = []; // [price, amount, price*amount]
    let b = [];
    let fix_a = 0;
    let fix_b = 0;
    let fix = 0;
    let ar = new Array(this.state.limit).fill(1);
    // sell数据反转
    ar.map((item, i) => {
      const d = data.a[i];
      if (d && Number(d[0]) >= 0 && this.state.digit !== "") {
        a.push([helper.digits(d[0], this.state.digit), d[1], d[0] * d[1]]);
        fix_a = Number(a[a.length - 1][2]) + Number(fix_a);
        a[a.length - 1][3] = fix_a;
        a[a.length - 1][4] =
          Number(a[a.length - 1][1]) +
          (a.length - 2 >= 0 ? Number(a[a.length - 2][4]) : 0);
        a[a.length - 1][5] = d[2];
      }
    });
    fix_a = a.length ? fix_a / a.length : 0;
    a.length = this.state.limit;
    a.reverse();
    (data.b || []).map((item) => {
      if (Number(item[0]) >= 0 && this.state.digit !== "") {
        b.push([
          helper.digits(item[0], this.state.digit),
          item[1],
          item[0] * item[1],
        ]);
        fix_b = Number(b[b.length - 1][2]) + Number(fix_b);
        b[b.length - 1][3] = fix_b;
        b[b.length - 1][4] =
          Number(b[b.length - 1][1]) +
          (b.length - 2 >= 0 ? Number(b[b.length - 2][4]) : 0);
        b[b.length - 1][5] = item[2];
      }
    });
    fix_b = b.length ? fix_b / b.length : 0;
    b.length = this.state.limit;
    fix = (Number(fix_a) + Number(fix_b)) / 2;
    return {
      a,
      b,
      fix,
    };
  };
  scrollTo = () => {
    if (this.refbox) {
      this.refbox.scrollTop = Math.floor(
        ((this.state.limit * 2 + 2) * 20 - this.refbox.offsetHeight) / 2 + 2
      );
    }
  };
  change(n, v) {
    if (n == "aggTrade_type") {
      this.setState(
        {
          [n]: v,
          limit: v == "all" ? 22 : 40,
        },
        () => {
          if (v == "all") {
            this.scrollTo();
          }
        }
      );
      return;
    }
  }
  setPrice = (p) => {
    if (!p && p !== 0) return;
    // 写入输入框价格
    this.props.dispatch({
      type: "lever/handleChange",
      payload: {
        buy_price: p || this.props.buy_price || "",
        sale_price: p || this.props.sale_price || "",
        buy_auto: true,
        sale_auto: true,
        hasAnimation: true,
      },
    });
    const that = this;
    setTimeout(() => {
      that.props.dispatch({
        type: "lever/handleChange",
        payload: {
          hasAnimation: false,
        },
      });
    }, 1000);
  };
  openModal = (e) => {
    this.setState({
      anchorEl: e.currentTarget,
    });
  };
  closeModal = (e) => {
    this.setState({
      anchorEl: null,
    });
  };
  renderTitle(tokenInfo) {
    const { classes } = this.props;
    const cRates = helper.currencyValue(
      this.props.rates,
      tokenInfo ? tokenInfo.c : 0,
      this.props.match.params.token2
        ? this.props.match.params.token2.toUpperCase()
        : null,
      window.localStorage.unit,
      true
    );
    return (
      <div
        className={classes.arrow}
        onClick={this.setPrice.bind(this, tokenInfo.c)}
      >
        <em>
          {tokenInfo.c ? (
            <i
              className={Number(tokenInfo.m) >= 0 ? classes.up : classes.down}
              ref={(ref) => (this.currentRef = ref)}
            >
              {helper.digits(
                math.chain(tokenInfo.c).done(),
                Number(this.props.max_digits)
              )}
            </i>
          ) : (
            ""
          )}
          {tokenInfo.c &&
          tokenInfo.o &&
          this.props.rates[this.props.match.params.token2.toUpperCase()] ? (
            <i
              ref={(ref) => (this.currentRef2 = ref)}
            >{` ≈ ${cRates[1]} ${cRates[2]}`}</i>
          ) : (
            ""
          )}
        </em>
        <div>
          {this.props.qws.ws && this.props.qws.ws.readyState == 1 ? (
            <img alt="" src={require("../../assets/xin.png")} />
          ) : (
            <img alt="" src={require("../../assets/xin.gif")} />
          )}
        </div>
      </div>
    );
  }
  render() {
    //window.console.log("handicap render");
    const { classes } = this.props;
    let palette2 = window.palette2[localStorage.quoteMode];
    const digitMerge = this.props.digitMerge ? this.props.digitMerge : [];
    const data = this.countShadow();
    let options = [];
    digitMerge.forEach((item) => {
      options.push({
        label: `${
          CONST["depth"][item] <= 0
            ? 1 + Math.abs(CONST["depth"][item])
            : CONST["depth"][item]
        }${this.props.intl.formatMessage({
          id: CONST["depth"][item] <= 0 ? "位整数" : "位小数",
        })}`,
        value: `${CONST["depth"][item]}`,
      });
    });
    const selected = {
      label: `${
        this.state.digit <= 0
          ? 1 + Math.abs(this.state.digit)
          : this.state.digit
      }${this.props.intl.formatMessage({
        id: this.state.digit <= 0 ? "位整数" : "位小数",
      })}`,
      value: `${this.state.digit}`,
    };
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    if (!this.props.match.params.token1 || !this.props.match.params.token2) {
      return <div className={classes.handicap} />;
    }
    const token1 = this.props.match.params.token1.toUpperCase();
    const token2 = this.props.match.params.token2.toUpperCase();
    const tokenInfo = symbol_quote[token1 + token2] || {};
    const symbol_info = this.props.config.symbols[token1 + token2] || {};
    const width = window.document.documentElement.offsetWidth;
    const id = this.state.anchorEl ? "anchorEl" : undefined;
    return (
      <div className={classes.handicap}>
        {width > 1850 ? (
          <div className={classes.handicap_title}>
            <span style={{ color: palette2.white }}>
              {this.props.intl.formatMessage({
                id: "盘口",
              })}
            </span>
          </div>
        ) : (
          ""
        )}
        <div className={classes.title}>
          <div className={classes.icons}>
            <TooltipCommon
              title={this.props.intl.formatMessage({
                id: "买卖盘",
              })}
              placement="top"
              mode={true}
            >
              <span
                className={this.state.aggTrade_type == "all" ? "on" : ""}
                onClick={this.change.bind(this, "aggTrade_type", "all")}
              >
                <img
                  alt=""
                  style={{
                    transform:
                      Number(window.localStorage.up_down) == 1
                        ? "rotateX(180deg)"
                        : "rotateX(0deg)",
                  }}
                  src={require("../../assets/icon_all@2x.png")}
                />
              </span>
            </TooltipCommon>
            <TooltipCommon
              title={this.props.intl.formatMessage({
                id: "买盘",
              })}
              placement="top"
              mode={true}
            >
              <span
                className={this.state.aggTrade_type == "buy" ? "on" : ""}
                onClick={this.change.bind(this, "aggTrade_type", "buy")}
              >
                <img
                  alt=""
                  src={
                    Number(window.localStorage.up_down) == 1
                      ? require("../../assets/icon_sell@2x.png")
                      : require("../../assets/icon_buy@2x.png")
                  }
                />
              </span>
            </TooltipCommon>
            <TooltipCommon
              title={this.props.intl.formatMessage({
                id: "卖盘",
              })}
              placement="top"
              mode={true}
            >
              <span
                className={this.state.aggTrade_type == "sell" ? "on" : ""}
                onClick={this.change.bind(this, "aggTrade_type", "sell")}
              >
                <img
                  alt=""
                  src={
                    Number(window.localStorage.up_down) == 1
                      ? require("../../assets/icon_buy@2x.png")
                      : require("../../assets/icon_sell@2x.png")
                  }
                />
              </span>
            </TooltipCommon>
          </div>
          <div className={classes.choose}>
            <div
              className={classnames(
                classes.select,
                this.state.anchorEl ? "on" : ""
              )}
              onClick={this.openModal}
            >
              <span>{selected.label}</span>
              <Iconfont
                aria-describedby={id}
                type="arrowDown"
                aria-haspopup="true"
                size="16"
              />
            </div>
          </div>
        </div>
        <ol className={classes.header}>
          <li>
            {this.props.intl.formatMessage({
              id: "价格",
            })}
            ({symbol_info.quoteTokenName})
          </li>
          <li>
            {this.props.intl.formatMessage({
              id: "数量",
            })}
            ({symbol_info.baseTokenName})
          </li>
          <li>
            {this.props.intl.formatMessage({
              id: "累计",
            })}
            ({symbol_info.baseTokenName})
          </li>
        </ol>
        {this.state.aggTrade_type == "all" ? (
          <div
            className={classes.handicap_list_all}
            ref={(ref) => (this.refbox = ref)}
          >
            <HandicapList
              data={data.a}
              prices={prices}
              fix={data.fix}
              aggTrade_type={this.state.aggTrade_type}
              symbol_id={this.props.symbol_id}
              average={this.props.aggTrade_average}
              length={this.state.limit}
              aggTrade_digits={this.state.digit}
              base_precision={this.props.base_precision}
              quote_precision={this.props.quote_precision}
              token2_quantity={this.props.token2_quantity}
              buy_quantity={this.props.buy_quantity}
              aggTrade_total_sell={this.props.aggTrade_total_sell}
              type="0"
              token1_quantity={this.props.token1_quantity}
              order_type={this.props.order_type}
              dispatch={this.props.dispatch}
            />
            {this.renderTitle(tokenInfo)}
            <HandicapList
              data={data.b}
              prices={prices}
              fix={data.fix}
              aggTrade_type={this.state.aggTrade_type}
              symbol_id={this.props.symbol_id}
              average={this.props.aggTrade_average}
              length={this.state.limit}
              aggTrade_digits={this.state.digit}
              aggTrade_total_buy={this.props.aggTrade_total_buy}
              base_precision={this.props.base_precision}
              quote_precision={this.props.quote_precision}
              token2_quantity={this.props.token2_quantity}
              buy_quantity={this.props.buy_quantity}
              type="1"
              token1_quantity={this.props.token1_quantity}
              order_type={this.props.order_type}
              dispatch={this.props.dispatch}
            />
          </div>
        ) : this.state.aggTrade_type == "buy" ? (
          <div className={classes.handicap_list}>
            {this.renderTitle(tokenInfo)}
            <HandicapList
              data={data.b}
              prices={prices}
              fix={data.fix}
              aggTrade_type={this.state.aggTrade_type}
              symbol_id={this.props.symbol_id}
              average={this.props.aggTrade_average}
              length={this.state.limit}
              aggTrade_digits={this.state.digit}
              base_precision={this.props.base_precision}
              quote_precision={this.props.quote_precision}
              token2_quantity={this.props.token2_quantity}
              aggTrade_total_buy={this.props.aggTrade_total_buy}
              buy_quantity={this.props.buy_quantity}
              type="1"
              token1_quantity={this.props.token1_quantity}
              order_type={this.props.order_type}
              dispatch={this.props.dispatch}
            />
          </div>
        ) : this.state.aggTrade_type == "rating" ? (
          ""
        ) : (
          <div className={classes.handicap_list}>
            <HandicapList
              data={data.a}
              prices={prices}
              fix={data.fix}
              aggTrade_type={this.state.aggTrade_type}
              symbol_id={this.props.symbol_id}
              average={this.props.aggTrade_average}
              length={this.state.limit}
              aggTrade_total_sell={this.props.aggTrade_total_sell}
              aggTrade_digits={this.state.digit}
              base_precision={this.props.base_precision}
              quote_precision={this.props.quote_precision}
              token2_quantity={this.props.token2_quantity}
              buy_quantity={this.props.buy_quantity}
              type="0"
              token1_quantity={this.props.token1_quantity}
              order_type={this.props.order_type}
              dispatch={this.props.dispatch}
            />
            {this.renderTitle(tokenInfo)}
          </div>
        )}
        <Popper
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          id={id}
          onClose={this.closeModal}
          placement="bottom-end"
          style={{ zIndex: 2 }}
        >
          <Paper className={classes.paper}>
            <ClickAwayListener onClickAway={this.closeModal}>
              <MenuList className={classes.menulist}>
                {options.map((item) => {
                  return (
                    <MenuItem
                      key={item.value}
                      selected={selected.value === item.value}
                      onClick={this.changeDigit.bind(this, item.value)}
                      classes={{ selected: classes.menuselect }}
                    >
                      {item.label}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Handicap));
