// 限价交易
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import classnames from "classnames";
import {
  Button,
  CircularProgress,
  Slider,
  OutlinedInput,
} from "@material-ui/core";
import { message } from "../../lib";
import route_map from "../../config/route_map";
import vali from "../../utils/validator";
import helper from "../../utils/helper";
import math from "../../utils/mathjs";
import CONST from "../../config/const";
import { withStyles } from "@material-ui/core/styles";
import styles from "../public/quote_style";
import TooltipCommon from "../public/tooltip";

class LimitTrading extends React.Component {
  constructor() {
    super();
    this.state = {
      max: 99999999,
      marks: [
        {
          value: 0,
        },
        {
          value: 25,
        },
        {
          value: 50,
        },
        {
          value: 75,
        },
        {
          value: 100,
        },
      ],
      buy_focus: false,
      sell_focus: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.progressChange = this.progressChange.bind(this);
    this.orderCreate = this.orderCreate.bind(this);
    this.fix_digits = this.fix_digits.bind(this);
    this.equalDigit = this.equalDigit.bind(this);
    this.focus = this.focus.bind(this);
  }
  componentDidMount() {
    this.props.dispatch({
      type: "lever/save",
      payload: {
        setProgress: this.progressChange,
      },
    });
  }
  componentDidUpdate() {
    // 写入输入框价格
    const params = this.props.match.params;
    const symbol_quote = this.props.symbol_quote;
    const symbolId = `${params.token1.toUpperCase()}${params.token2.toUpperCase()}`;
    const tokenQuote = symbol_quote[symbolId] || {};
    if (this.props.buy_price === "" && tokenQuote.c && !this.props.buy_auto) {
      this.props.dispatch({
        type: "lever/handleChange",
        payload: {
          buy_price: tokenQuote.c || "",
          buy_auto: true,
        },
      });
    }
    if (this.props.sale_price === "" && tokenQuote.c && !this.props.sale_auto) {
      this.props.dispatch({
        type: "lever/handleChange",
        payload: {
          sale_price: tokenQuote.c || "",
          sale_auto: true,
        },
      });
    }
  }
  // 精度是否相等
  // d 100,10,1,0,0.1,0.01
  equalDigit(v, d) {
    if (!v && v !== 0) return false;
    if (!d && d !== 0) return false;
    let s = `${v}`.split(".");
    s = s[1] || "";
    if (d - 1 >= 0 || d == 0) {
      if (s.length > 0 || v < d) {
        return false;
      } else {
        return true;
      }
    }
    if (s.length > CONST["depth"][d]) return false;
    return true;
  }
  // 是否为精度整倍数
  // d  100，10，1，0.1，0.01，0.001
  multipleDigit = (v, d) => {
    if (!v && v !== 0) return false;
    if (!d && d !== 0) return false;
    const r = math
      .chain(math.bignumber(v))
      .divide(d)
      .format({ notation: "fixed" })
      .done();
    if (!vali.isInt(r)) {
      return false;
    }
    return true;
  };
  /**
   * 下单验证规则
   * 限价买
   * 价格：精度(min_price_precision)，可输入最大值(99,999,999)
   * 数量：精度(base_precision)及精度倍数，最小值(min_trade_quantity)
   * 金额：无

   * 限价卖
   * 价格：精度(min_price_precision)，可输入最大值(99,999,999)
   * 数量：精度(base_precision)及精度倍数，最小值(min_trade_quantity)
   * 金额：无

   * 市价买
   * 金额：最小值(min_trade_amount)，精度(quote_precision)及精度倍数

   * 市价卖
   * 数量：精度(base_precision)及精度倍数，最小值(min_trade_quantity)
   *
   */
  async orderCreate(order_type, order_side, e) {
    // 最小交易价格, 最小交易数量 不存在,拒绝交易
    if (
      (!this.props.min_price_precision &&
        this.props.min_price_precision !== 0) ||
      (!this.props.min_trade_quantity && this.props.min_trade_quantity !== 0)
    ) {
      window.console.error(
        "最小交易价格, 最小交易数量 不存在",
        this.props.min_price_precision,
        this.props.min_trade_quantity
      );
      message.error(
        this.props.intl.formatMessage({
          id: "价格错误，请重新输入",
        })
      );
      return;
    }

    // sale
    if (order_side === "SELL") {
      // 价格不存在或=0
      if (!Number(this.props.sale_price)) {
        window.console.error("价格不存在", this.props.sale_price);
        message.error(
          this.props.intl.formatMessage({
            id: "卖出价格不正确",
          })
        );
        return;
      }
      // 价格小于最小值
      if (
        Number(this.props.sale_price) < Number(this.props.min_price_precision)
      ) {
        window.console.error(
          "价格小于最小值",
          this.props.sale_price,
          this.props.min_price_precision
        );
        message.error(
          this.props.intl.formatMessage({
            id: "卖出价格不能小于",
          }) + this.props.min_price_precision
        );
        return;
      }
      // 价格大于最大值
      if (Number(this.props.sale_price) > this.state.max) {
        window.console.error(
          "价格大于最大值",
          this.props.sale_price,
          this.state.max
        );
        message.error(
          this.props.intl.formatMessage({
            id: "卖出价格不能大于",
          }) + this.state.max
        );
        return;
      }
      // 价格精度不正确
      if (
        !this.equalDigit(
          Number(this.props.sale_price),
          this.props.min_price_precision
        )
      ) {
        window.console.error(
          "价格精度不正确",
          this.props.sale_price,
          this.props.min_price_precision
        );
        message.error(
          this.props.intl.formatMessage({
            id: "卖出价格精度不正确",
          })
        );
        return;
      }

      // 卖出数量不存在
      if (!Number(this.props.sale_quantity)) {
        window.console.error("卖出数量不存在", this.props.sale_quantity);
        message.error(
          this.props.intl.formatMessage({
            id: "卖出数量不正确",
          })
        );
        return;
      }
      // 卖出数量小于最小值
      if (
        Number(this.props.sale_quantity) < Number(this.props.min_trade_quantity)
      ) {
        window.console.error(
          "卖出数量小于最小值",
          this.props.sale_quantity,
          this.props.min_trade_quantity
        );
        message.error(
          this.props.intl.formatMessage({
            id: "卖出数量不能小于",
          }) + this.props.min_trade_quantity
        );
        return;
      }
      // 卖出数量大于最大值
      if (Number(this.props.sale_quantity) > this.state.max) {
        window.console.error(
          "卖出数量大于最大值",
          this.props.sale_quantity,
          this.state.max
        );
        message.error(
          this.props.intl.formatMessage({
            id: "卖出数量不能大于",
          }) + this.state.max
        );
        return;
      }
      // 数量大于最大值
      if (
        Number(this.props.sale_quantity) > Number(this.props.token1_quantity)
      ) {
        window.console.error(
          "数量大于最大值",
          this.props.sale_quantity,
          this.props.token1_quantity
        );
        message.error(
          this.props.intl.formatMessage({
            id: "卖出数量超出余额",
          })
        );
        return;
      }
      // 数量精度不正确, 非整倍数
      if (
        !this.equalDigit(
          Number(this.props.sale_quantity),
          math
            .chain(math.pow(10, math.bignumber(-this.props.base_precision)))
            .format({ notation: "fixed" })
            .done()
        ) ||
        !this.multipleDigit(
          Number(this.props.sale_quantity),
          math
            .chain(math.pow(10, math.bignumber(-this.props.base_precision)))
            .format({ notation: "fixed" })
            .done()
        )
      ) {
        window.console.error(
          "数量精度不正确",
          this.props.sale_quantity,
          this.props.base_precision
        );
        message.error(
          this.props.intl.formatMessage({
            id: "数量精度不正确",
          })
        );
        return;
      }

      // 最小交易金额判断
      // const amount = math
      //   .chain(math.bignumber(this.props.sale_price || 0))
      //   .multiply(math.bignumber(this.props.sale_quantity || 0))
      //   .format({ notation: "fixed" })
      //   .done();
      // if (amount < this.props.min_trade_amount) {
      //   window.console.error(
      //     "交易金额小于：",
      //     amount,
      //     this.props.min_trade_amount
      //   );
      //   message.error(
      //     this.props.intl.formatMessage({
      //       id: "交易金额小于"
      //     }) + this.props.min_trade_amount
      //   );
      //   return;
      // }
    }
    // buy
    if (order_side === "BUY") {
      // 价格不存在或=0
      if (!Number(this.props.buy_price)) {
        window.console.error("价格不存在", this.props.buy_price);
        message.error(
          this.props.intl.formatMessage({
            id: "买入价格不正确",
          })
        );
        return;
      }
      // 价格小于最小值
      if (
        Number(this.props.buy_price) < Number(this.props.min_price_precision)
      ) {
        window.console.error(
          "价格小于最小值",
          this.props.buy_price,
          this.props.min_price_precision
        );
        message.error(
          this.props.intl.formatMessage({
            id: "买入价格不能小于",
          }) + this.props.min_price_precision
        );
        return;
      }
      // 价格大于最大值
      if (Number(this.props.buy_price) > Number(this.state.max)) {
        window.console.error(
          "价格大于最大值",
          this.props.buy_price,
          this.state.max
        );
        message.error(
          this.props.intl.formatMessage({
            id: "买入价格不能大于",
          }) + this.state.max
        );
        return;
      }
      // 价格精度不正确
      if (
        !this.equalDigit(
          Number(this.props.buy_price),
          this.props.min_price_precision
        )
      ) {
        window.console.error(
          "价格精度不正确",
          this.props.buy_price,
          this.props.min_price_precision
        );
        message.error(
          this.props.intl.formatMessage({
            id: "买入价格精度不正确",
          })
        );
        return;
      }

      // 数量不存在
      if (!Number(this.props.buy_quantity)) {
        window.console.error("数量不存在", this.props.buy_quantity);
        message.error(
          this.props.intl.formatMessage({
            id: "买入数量不正确",
          })
        );
        return;
      }
      // 数量精度不正确
      if (
        !this.equalDigit(
          Number(this.props.buy_quantity),
          math
            .chain(math.pow(10, math.bignumber(-this.props.base_precision)))
            .format({ notation: "fixed" })
            .done()
        ) ||
        !this.multipleDigit(
          Number(this.props.buy_quantity),
          math
            .chain(math.pow(10, math.bignumber(-this.props.base_precision)))
            .format({ notation: "fixed" })
            .done()
        )
      ) {
        window.console.error(
          "数量精度不正确",
          this.props.buy_quantity,
          this.props.base_precision
        );
        message.error(
          this.props.intl.formatMessage({
            id: "买入数量精度不正确",
          })
        );
        return;
      }
      // 数量小于最小值
      if (
        Number(this.props.buy_quantity) < Number(this.props.min_trade_quantity)
      ) {
        window.console.error(
          "数量小于最小值",
          this.props.buy_quantity,
          this.props.min_trade_quantity
        );
        message.error(
          this.props.intl.formatMessage({
            id: "买入数量不能小于",
          }) + this.props.min_trade_quantity
        );
        return;
      }
      // 数量大于最大值
      if (Number(this.props.buy_quantity) > this.state.max) {
        window.console.error(
          "数量大于最大值",
          this.props.buy_quantity,
          this.state.max
        );
        message.error(
          this.props.intl.formatMessage({
            id: "买入数量不能大于",
          }) + this.state.max
        );
        return;
      }
      // buy_max 为0
      if (!this.props.buy_max) {
        window.console.error("买入最大值不存在", this.props.buy_max);
        message.error(
          this.props.intl.formatMessage({
            id: "买入数量不正确",
          })
        );
        return;
      }
      // 数量大于buy_max
      if (Number(this.props.buy_quantity) > this.props.buy_max) {
        window.console.error(
          "数量大于买入最大值",
          this.props.buy_quantity,
          this.props.buy_max
        );
        message.error(
          this.props.intl.formatMessage({
            id: "买入数量超出余额",
          })
        );
        return;
      }
      // 最小交易金额判断
      // const amount = math
      //   .chain(math.bignumber(this.props.buy_price || 0))
      //   .multiply(math.bignumber(this.props.buy_quantity || 0))
      //   .format({ notation: "fixed" })
      //   .done();
      // if (amount < this.props.min_trade_amount) {
      //   window.console.error(
      //     "交易金额小于：",
      //     amount,
      //     this.props.min_trade_amount
      //   );
      //   message.error(
      //     this.props.intl.formatMessage({
      //       id: "交易金额小于"
      //     }) + this.props.min_trade_amount
      //   );
      //   return;
      // }
    }
    await this.props.dispatch({
      type: "lever/create_order",
      payload: {
        type: ["limit", "market"][order_type],
        side: order_side,
        price:
          order_side == "SELL" ? this.props.sale_price : this.props.buy_price,
        quantity:
          order_side == "SELL"
            ? this.props.sale_quantity
            : this.props.buy_quantity,
        symbol_id: this.props.symbol_id,
        order_time: this.props.order_time,
        client_order_id: new Date().getTime(),
        account_id: this.props.userinfo.defaultAccountId,
        exchange_id: this.props.exchange_id,
      },
      success: () => {
        // 清空表单
        if (order_side === "SELL") {
          this.props.dispatch({
            type: "lever/handleChange",
            payload: {
              sale_quantity: "",
              sale_progress: 0,
            },
          });
        }
        if (order_side === "BUY") {
          this.props.dispatch({
            type: "lever/handleChange",
            payload: {
              buy_quantity: "",
              buy_progress: 0,
            },
          });
        }
        this.getLeverAsset();
      },
    });
  }
  getLeverAsset = async () => {
    await this.props.dispatch({
      type: "lever/getLeverAsset",
      payload: {},
    });
  };
  /**
   * 精度判断
   * @param {String} v v=number时，传入999. , 返回的数值会被忽略.
   * @param {Number} digits   -10,-1,1,2,3,4
   */
  fix_digits(v, digits) {
    if (!digits) {
      return v ? Math.floor(v) : v;
    }
    if (!v && v !== 0) return v;
    if (digits <= 0) {
      return Math.floor(v);
    }
    let string_v = `${v}`;
    let d = string_v.split(".");
    if (!d[1] || d[1].length <= digits) {
      return string_v;
    }
    d[1] = d[1].split("");
    d[1].length = digits;
    d[1] = d[1].join("");
    return d[0] + "." + d[1];
  }
  /**
   * 输入框判断
   * 1、价格精度判断，
   * 2、数量精度
   * 3、金额精度
   */
  handleChange(e) {
    const t = e.target;
    const n = t.name;
    let v = t.type == "checkbox" ? t.checked : t.value;
    v = v
      .replace(/[^0-9\.]/, "")
      .replace(/^0{1,}/, "0")
      .replace(/^(0)([1-9])/, ($1, $2) => {
        return $2;
      })
      .replace(/^\./, "0.");
    if (!v) {
      let data = {
        [n]: "",
      };
      if (n.indexOf("buy") > -1) {
        data.buy_progress = 0;
      }
      this.props.dispatch({
        type: "lever/handleChange",
        payload: data,
      });
      return;
    }
    if (v && !vali.isFloat(v)) {
      return;
    }

    let data = {
      [n]: v ? v : "",
    };

    // 买入价格
    // 精度判断
    // <= max
    if (n == "buy_price") {
      let d = v ? (Number(v) >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(
        `${d}`,
        CONST["depth"][this.props.min_price_precision]
      );
      data[n] = d;
      data.buy_auto = true;

      // 重新计算最大值
      data["buy_max"] =
        Number(d) && Number(this.props.token2_quantity)
          ? helper.digits(
              math
                .chain(math.bignumber(this.props.token2_quantity))
                .divide(math.bignumber(d))
                .format({ notation: "fixed" })
                .done(),
              this.props.base_precision
            )
          : 0;

      // 如果有数量，重新计算进度条的值
      data["buy_progress"] = 0;
      if (
        (Number(this.props.buy_quantity) ||
          Number(this.props.buy_quantity) === 0) &&
        data["buy_max"]
      ) {
        let progress = Number(data["buy_max"])
          ? math
              .chain(this.props.buy_quantity)
              .divide(data["buy_max"])
              .multiply(100)
              .format({ notation: "fixed" })
              .done()
          : 0;
        progress = Math.max(0, Math.min(100, progress));
        data["buy_progress"] = progress;
      }

      // if (Number(this.props.buy_progress) && Number(this.props.buy_quantity)) {
      //   data.buy_quantity =
      //     vv && data["buy_max"]
      //       ? Acc.mul(data["buy_max"], Acc.div(this.props.buy_progress, 100, 4))
      //       : "";
      // }
      // if (!Number(this.props.buy_progress) && Number(this.props.buy_quantity)) {
      //   data.buy_progress =
      //     vv && data["buy_max"]
      //       ? Acc.div(this.props["buy_quantity"], data["buy_max"], 4) * 100
      //       : 0;
      // }
      // if (!data["buy_max"]) {
      //   data.buy_progress = 0;
      // }
    }
    // 买入数量
    // 精度判断,重置进度条
    // <= max
    if (n == "buy_quantity") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, this.props.base_precision);
      let progress = 0;
      if (d && Number(this.props.buy_max) && this.props.buy_price) {
        progress = Math.min(
          100,
          math
            .chain(d)
            .divide(this.props.buy_max)
            .multiply(100)
            .format({ notation: "fixed", precision: 4 })
            //.round(4)
            .done()
        );
      }
      // if (vv && this.props.buy_max) {
      //   if (Number(vv) > Number(this.props.buy_max)) {
      //     v = this.props.buy_max;
      //   }
      //   if (vv < 0) {
      //     v = 0;
      //   }
      // }
      data = {
        [n]: d || d === 0 ? d : "",
        buy_progress: progress,
      };
    }

    // 卖出价格
    // 精度判断
    // <= max
    if (n == "sale_price") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, CONST["depth"][this.props.min_price_precision]);
      data[n] = d;
      data.sale_auto = true;
    }
    // 卖出数量
    // 精度判断
    // <= max
    if (n == "sale_quantity") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, this.props.base_precision);
      let progress = 0;
      if (d && Number(this.props.token1_quantity)) {
        progress = Math.min(
          100,
          math
            .chain(d)
            .divide(this.props.token1_quantity)
            .multiply(100)
            .format({ notation: "fixed", precision: 4 })
            //.round(4)
            .done()
        );
      }
      // if (vv && this.props.sale_max) {
      //   if (Number(vv) > Number(this.props.sale_max)) {
      //     v = this.props.sale_max;
      //   }
      //   if (vv < 0) {
      //     v = 0;
      //   }
      // }
      data = {
        [n]: d,
        sale_progress: progress,
      };
    }
    this.props.dispatch({
      type: "lever/handleChange",
      payload: {
        ...data,
      },
    });
  }
  focus(name, isFocus) {
    this.setState({
      [name]: isFocus,
    });
  }
  progressChange(n, v, sliderValue) {
    if (n == "buy_progress") {
      if (!Number(this.props.buy_price) || !Number(this.props.buy_max)) return;
      this.props.dispatch({
        type: "lever/handleChange",
        payload: {
          [n]: sliderValue,
          buy_quantity: sliderValue
            ? helper.digits(
                math
                  .chain(math.bignumber(sliderValue))
                  .divide(100)
                  .multiply(math.bignumber(this.props.buy_max))
                  .format({ notation: "fixed" })
                  .done(),
                this.props.base_precision
              )
            : "",
        },
      });
    }
    if (n == "sale_progress") {
      if (!Number(this.props.token1_quantity)) return;
      this.props.dispatch({
        type: "lever/handleChange",
        payload: {
          [n]: sliderValue,
          sale_quantity: sliderValue
            ? helper.digits(
                math
                  .chain(math.bignumber(sliderValue))
                  .divide(100)
                  .multiply(math.bignumber(this.props.token1_quantity))
                  .format({ notation: "fixed" })
                  .done(),
                this.props.base_precision
              )
            : "",
        },
      });
    }
  }
  valueLabelFormat(value) {
    return `${value.toFixed(0)}%`;
  }
  render() {
    const { classes, hasAnimation } = this.props;
    const token1_name = this.props.tokens[this.props.token1]
      ? this.props.tokens[this.props.token1]["tokenName"]
      : "";
    const token2_name = this.props.tokens[this.props.token2]
      ? this.props.tokens[this.props.token2]["tokenName"]
      : "";

    const account_id = this.props.userinfo.defaultAccountId;
    const buy_price_rates = helper.currencyValue(
      this.props.rates,
      this.props.buy_price,
      this.props.token2,
      window.localStorage.unit,
      true
    );
    const buy_amount_rates = helper.currencyValue(
      this.props.rates,
      (this.props.buy_price || 0) * (this.props.buy_quantity || 0),
      this.props.token2,
      window.localStorage.unit,
      true
    );
    const sale_price_rates = helper.currencyValue(
      this.props.rates,
      this.props.sale_price,
      this.props.token2,
      window.localStorage.unit,
      true
    );
    const sale_amount_rates = helper.currencyValue(
      this.props.rates,
      (this.props.sale_price || 0) * (this.props.sale_quantity || 0),
      this.props.token2,
      window.localStorage.unit,
      true
    );
    return (
      <div className={classes.exchange}>
        <div className={classes.limitTrading}>
          <div align="between" className={classes.trading}>
            <div className={classes.form} span={12}>
              <h3>
                {this.props.intl.formatMessage({
                  id: "买入",
                })}{" "}
                {token1_name}
              </h3>
              <div className={classes.t1}>
                <div>
                  {this.props.intl.formatMessage({
                    id: "可用",
                  })}{" "}
                  <i>
                    {account_id
                      ? helper.digits(this.props.token2_quantity, 8)
                      : "--"}{" "}
                    {token2_name}
                  </i>
                </div>
                <div span={4}>
                  {account_id ? (
                    <a
                      className={classes.link}
                      href={route_map.rechange + "/" + this.props.token2}
                    >
                      {this.props.intl.formatMessage({
                        id: "充币",
                      })}
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className={classes.t2}>
                <div>
                  {this.props.intl.formatMessage({
                    id: "价格",
                  })}
                </div>
                <OutlinedInput
                  name="buy_price"
                  value={this.props.buy_price}
                  onChange={this.handleChange}
                  onFocus={this.focus.bind(this, "buy_focus", true)}
                  onBlur={this.focus.bind(this, "buy_focus", false)}
                  autoComplete="off"
                  classes={{
                    root: classes.inputRoot,
                    focused: classes.inputFocused,
                    input: hasAnimation ? classes.inputAnimation : "",
                  }}
                  startAdornment={
                    this.props.buy_price && this.state.buy_focus ? (
                      <p className={classes.startAdorn}>
                        {this.props.buy_price &&
                        this.props.rates[this.props.token2]
                          ? `≈ ${buy_price_rates[1]}${buy_price_rates[2]}`
                          : ""}
                      </p>
                    ) : (
                      ""
                    )
                  }
                  endAdornment={
                    <span className={classes.endAdorn}>{token2_name}</span>
                  }
                />
              </div>
              <div className={classes.t2}>
                <div>
                  {this.props.intl.formatMessage({
                    id: "数量",
                  })}
                </div>
                <OutlinedInput
                  name="buy_quantity"
                  value={this.props.buy_quantity}
                  onChange={this.handleChange}
                  autoComplete="off"
                  classes={{
                    root: classes.inputRoot,
                    focused: classes.inputFocused,
                  }}
                  endAdornment={
                    <span className={classes.endAdorn}>{token1_name}</span>
                  }
                />
              </div>
              <div className={classes.progress}>
                <Slider
                  // defaultValue={0}
                  step={1}
                  marks={this.state.marks}
                  value={this.props.buy_progress}
                  valueLabelFormat={this.valueLabelFormat}
                  onChange={this.progressChange.bind(this, "buy_progress")}
                  valueLabelDisplay="auto"
                  aria-labelledby="buy_progress"
                  ValueLabelComponent={TooltipCommon}
                  // ValueLabelComponent={ValueLabelComponent}
                />
              </div>
              <p className={classes.amount}>
                <FormattedMessage id="交易金额" />
                <i>
                  {math
                    .chain(math.bignumber(this.props.buy_price || 0))
                    .multiply(math.bignumber(this.props.buy_quantity || 0))
                    .format({ notation: "fixed" })
                    .done()}{" "}
                  {token2_name}{" "}
                  {this.props.rates[this.props.token2]
                    ? `≈ ${buy_amount_rates[1]}${buy_amount_rates[2]}`
                    : ""}
                </i>
              </p>
              {this.props.userinfo.userId ? (
                this.props.loading.effects["lever/create_order"] &&
                this.props.limitBUY ? (
                  <Button className={classes.btn} disabled>
                    <div className={classes.btn_loading}>
                      <CircularProgress size={18} color="primary" />
                    </div>
                  </Button>
                ) : this.props.buy_config ? (
                  <Button
                    onClick={this.orderCreate.bind(this, 0, "BUY")}
                    className={classnames(classes.btn, "green")}
                  >
                    {this.props.intl.formatMessage({
                      id: "买入",
                    })}{" "}
                    {token1_name}
                  </Button>
                ) : (
                  <Button disabled className={classes.btn}>
                    {this.props.intl.formatMessage({
                      id: "买入",
                    })}{" "}
                    {token1_name}
                  </Button>
                )
              ) : (
                <div className={classes.btn}>
                  <a
                    href={
                      route_map.login +
                      "?redirect=" +
                      encodeURIComponent(window.location.href)
                    }
                  >
                    {this.props.intl.formatMessage({
                      id: "登录",
                    })}
                  </a>{" "}
                  {this.props.intl.formatMessage({
                    id: "或",
                  })}{" "}
                  <a
                    href={
                      route_map.register +
                      "?redirect=" +
                      encodeURIComponent(window.location.href)
                    }
                  >
                    {this.props.intl.formatMessage({
                      id: "注册",
                    })}
                  </a>
                </div>
              )}
            </div>
            <div className={classes.form} span={12}>
              <h3>
                {" "}
                {this.props.intl.formatMessage({
                  id: "卖出",
                })}{" "}
                {token1_name}
              </h3>
              <div className={classes.t1}>
                <div span={20}>
                  {this.props.intl.formatMessage({
                    id: "可用",
                  })}{" "}
                  <i>
                    {account_id
                      ? helper.digits(this.props.token1_quantity, 8)
                      : "--"}{" "}
                    {token1_name}
                  </i>
                </div>
                <div span={4}>
                  {account_id ? (
                    <a
                      className={classes.link}
                      href={route_map.rechange + "/" + this.props.token1}
                    >
                      {this.props.intl.formatMessage({
                        id: "充币",
                      })}
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className={classes.t2}>
                <div>
                  {this.props.intl.formatMessage({
                    id: "价格",
                  })}
                </div>
                <OutlinedInput
                  name="sale_price"
                  value={this.props.sale_price}
                  onChange={this.handleChange}
                  onFocus={this.focus.bind(this, "sale_focus", true)}
                  onBlur={this.focus.bind(this, "sale_focus", false)}
                  autoComplete="off"
                  classes={{
                    root: classes.inputRoot,
                    focused: classes.inputFocused,
                    input: hasAnimation ? classes.inputAnimation : "",
                  }}
                  startAdornment={
                    this.props.sale_price && this.state.sale_focus ? (
                      <p className={classes.startAdorn}>
                        {this.props.sale_price &&
                        this.props.rates[this.props.token2]
                          ? `≈ ${sale_price_rates[1]}${sale_price_rates[2]}`
                          : ""}
                      </p>
                    ) : (
                      ""
                    )
                  }
                  endAdornment={
                    <span className={classes.endAdorn}>{token2_name}</span>
                  }
                />
              </div>
              <div className={classes.t2}>
                <div>
                  {this.props.intl.formatMessage({
                    id: "数量",
                  })}
                </div>
                <OutlinedInput
                  name="sale_quantity"
                  value={this.props.sale_quantity}
                  onChange={this.handleChange}
                  classes={{
                    root: classes.inputRoot,
                    focused: classes.inputFocused,
                  }}
                  autoComplete="off"
                  endAdornment={
                    <span className={classes.endAdorn}>{token1_name}</span>
                  }
                />
              </div>
              <div className={classnames(classes.progress, "red")}>
                {/* <Slider
                  marks={this.state.marks}
                  value={this.props.sale_progress}
                  onChange={this.progressChange.bind(this, "sale_progress")}
                  tipFormatter={value => `${value}%`}
                /> */}
                <Slider
                  // defaultValue={0}
                  step={1}
                  marks={this.state.marks}
                  value={this.props.sale_progress}
                  valueLabelFormat={this.valueLabelFormat}
                  onChange={this.progressChange.bind(this, "sale_progress")}
                  valueLabelDisplay="auto"
                  aria-labelledby="sale_progress"
                  ValueLabelComponent={TooltipCommon}
                  // ValueLabelComponent={ValueLabelComponent}
                />
              </div>
              <p className={classes.amount}>
                <FormattedMessage id="交易金额" />
                <i>
                  {math
                    .chain(math.bignumber(this.props.sale_price || 0))
                    .multiply(math.bignumber(this.props.sale_quantity || 0))
                    .format({ notation: "fixed" })
                    .done()}{" "}
                  {token2_name}{" "}
                  {this.props.rates[this.props.token2]
                    ? `≈ ${sale_amount_rates[1]}${sale_amount_rates[2]}`
                    : ""}
                </i>
              </p>

              {this.props.userinfo.userId ? (
                this.props.loading.effects["lever/create_order"] &&
                this.props.limitSELL ? (
                  <Button disabled className={classes.btn}>
                    <div className={classes.btn_loading}>
                      <CircularProgress size={18} color="primary" />
                    </div>
                  </Button>
                ) : this.props.sell_config ? (
                  <Button
                    onClick={this.orderCreate.bind(this, 0, "SELL")}
                    className={classnames(classes.btn, "red")}
                  >
                    {this.props.intl.formatMessage({
                      id: "卖出",
                    })}{" "}
                    {token1_name}
                  </Button>
                ) : (
                  <Button disabled className={classes.btn}>
                    {this.props.intl.formatMessage({
                      id: "卖出",
                    })}{" "}
                    {token1_name}
                  </Button>
                )
              ) : (
                <div className={classes.btn}>
                  <a
                    href={
                      route_map.login +
                      "?redirect=" +
                      encodeURIComponent(window.location.href)
                    }
                  >
                    {this.props.intl.formatMessage({
                      id: "登录",
                    })}
                  </a>{" "}
                  {this.props.intl.formatMessage({
                    id: "或",
                  })}{" "}
                  <a
                    href={
                      route_map.register +
                      "?redirect=" +
                      encodeURIComponent(window.location.href)
                    }
                  >
                    {this.props.intl.formatMessage({
                      id: "注册",
                    })}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(LimitTrading));
