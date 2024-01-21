// 市价交易
import React from "react";
import { injectIntl } from "react-intl";
import { message } from "../../lib";
import {
  Button,
  CircularProgress,
  Slider,
  OutlinedInput,
} from "@material-ui/core";
import route_map from "../../config/route_map";
import vali from "../../utils/validator";
import helper from "../../utils/helper";
import math from "../../utils/mathjs";
import classnames from "classnames";
import CONST from "../../config/const";
import { withStyles } from "@material-ui/core/styles";
import styles from "../public/quote_style";
import TooltipCommon from "../public/tooltip";

let progress_timer = null;

class MarketTrading extends React.Component {
  constructor() {
    super();
    this.state = {
      max: 999999999,
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
      buy_progress: 0,
      sale_progress: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.progressChange = this.progressChange.bind(this);
    this.orderCreate = this.orderCreate.bind(this);
    this.fix_digits = this.fix_digits.bind(this);
    this.equalDigit = this.equalDigit.bind(this);
  }

  setProgress = (key, v) => {
    this.props.dispatch({
      type: "exchange/setProgress",
      payload: {
        [key]: v,
      },
    });
  };

  componentDidMount() {
    // this.props.dispatch({
    //   type: "exchange/handleChange",
    //   payload: {
    //     setProgressMarket: this.setProgress,
    //   },
    // });
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
    //window.console.log(this.props);
    // 最小交易数量 , 最小交易金额 不存在,拒绝交易
    if (
      (!this.props.min_trade_amount && this.props.min_trade_amoun !== 0) ||
      (!this.props.min_trade_quantity && this.props.min_trade_quantity !== 0)
    ) {
      window.console.error(
        "最小交易数量 , 最小交易金额 不存在",
        this.props.min_trade_amount,
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
    if (order_side == "SELL") {
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
          "卖出数量超出余额",
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
      // 数量精度不正确
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

      // if (
      //   !Number(this.props.sale_quantity) ||
      //   Number(this.props.sale_quantity) <= 0 ||
      //   Number(this.props.sale_quantity) > Number(this.props.token1_quantity)
      // ) {
      //   message.error("卖出价格及数量值不正确");
      //   return;
      // }
    }
    // limit
    if (order_side == "BUY") {
      // 买入金额不存在
      if (!Number(this.props.buy_quantity)) {
        window.console.error("买入金额不存在", this.props.buy_quantity);
        message.error(
          this.props.intl.formatMessage({
            id: "买入金额不正确",
          })
        );
        return;
      }
      // 金额精度不正确
      if (
        !this.equalDigit(
          Number(this.props.buy_quantity),
          math
            .chain(math.pow(10, math.bignumber(-this.props.quote_precision)))
            .format({ notation: "fixed" })
            .done()
        ) ||
        !this.multipleDigit(
          Number(this.props.buy_quantity),
          math
            .chain(math.pow(10, math.bignumber(-this.props.quote_precision)))
            .format({ notation: "fixed" })
            .done()
        )
      ) {
        window.console.error(
          "买入金额精度不正确",
          this.props.buy_quantity,
          this.props.quote_precision
        );
        message.error(
          this.props.intl.formatMessage({
            id: "买入金额精度不正确",
          })
        );
        return;
      }
      // 金额小于最小值
      if (
        Number(this.props.buy_quantity) < Number(this.props.min_trade_amount)
      ) {
        window.console.error(
          "金额小于最小值",
          this.props.buy_quantity,
          this.props.min_trade_amount
        );
        message.error(
          this.props.intl.formatMessage({
            id: "买入金额不能小于",
          }) + this.props.min_trade_amount
        );
        return;
      }
      // 金额大于最大值
      if (Number(this.props.buy_quantity) > this.state.max) {
        window.console.error(
          "金额大于最大值",
          this.props.buy_quantity,
          this.state.max
        );
        message.error(
          this.props.intl.formatMessage({
            id: "买入金额不能大于",
          }) + this.state.max
        );
        return;
      }
      // buy_max 为0
      if (!this.props.token2_quantity) {
        window.console.error(
          "买入金额最大值不存在",
          this.props.token2_quantity
        );
        message.error(
          this.props.intl.formatMessage({
            id: "买入金额不正确",
          })
        );
        return;
      }
      // 金额大于buy_max
      if (
        Number(this.props.buy_quantity) > Number(this.props.token2_quantity)
      ) {
        window.console.error(
          "买入金额超出余额",
          this.props.buy_quantity,
          this.props.token2_quantity
        );
        message.error(
          this.props.intl.formatMessage({
            id: "买入金额超出余额",
          })
        );
        return;
      }
    }
    await this.props.dispatch({
      type: "exchange/createOrder",
      payload: {
        type: ["limit", "market"][order_type],
        side: order_side,
        price:
          order_side == "SELL" ? this.props.sale_price : this.props.buy_price,
        quantity:
          order_side == "SELL"
            ? this.props.sale_quantity
            : this.props.buy_quantity,
        symbol_name: this.props.token1,
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
            type: "exchange/handleChange",
            payload: {
              sale_quantity: "",
              sale_progress: 0,
            },
          });
        }
        if (order_side === "BUY") {
          this.props.dispatch({
            type: "exchange/handleChange",
            payload: {
              buy_quantity: "",
              buy_progress: 0,
            },
          });
        }
        // 拉取最新资产
        this.getLastAccount();
      },
    });
  }
  getLastAccount = async () => {
    await this.props.dispatch({
      type: "layout/getAccount",
      payload: {},
    });
    // await this.props.dispatch({
    //   type: "exchange/setAvailable",
    //   payload: {
    //     user_balance: this.props.user_balance,
    //     base_precision: this.props.base_precision,
    //   },
    // });
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
    if (v && !vali.isFloat(v)) {
      return;
    }

    // let vv = Number(v);
    let data = {
      [n]: v,
    };
    // 买入数量
    // 精度判断
    // <= token2_quantity
    if (n == "buy_quantity") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(`${d}`, this.props.quote_precision);
      let progress = 0;
      if (Number(d) && Number(this.props.token2_quantity)) {
        progress = Math.min(
          100,
          math
            .chain(d)
            .divide(this.props.token2_quantity)
            .multiply(100)
            .format({ notation: "fixed", precision: 4 })
            //.round(4)
            .done()
        );
      }
      data = {
        [n]: d || d === 0 ? d : "",
        buy_progress: progress,
      };
      this.setProgress("buy_progress", progress);
    }
    // 卖出数量
    // 精度判断
    // <= token1_quantity
    if (n == "sale_quantity") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, this.props.base_precision);
      let progress = 0;
      if (Number(d) && Number(this.props.token1_quantity)) {
        progress = Math.min(
          100,
          math
            .chain(d)
            .divide(this.props.token1_quantity)
            .multiply(100)
            .format({ notation: "fixed", precision: 4 })
            .done()
        );
      }
      data = {
        [n]: d || d === 0 ? d : "",
        sale_progress: progress,
      };
      this.setProgress("sale_progress", progress);
    }
    this.props.dispatch({
      type: "exchange/handleChange",
      payload: {
        ...data,
      },
    });
  }
  progressChange(n, v, sliderValue) {
    if (n == "buy_progress") {
      if (!Number(this.props.token2_quantity)) {
        return;
      }
      clearTimeout(progress_timer);
      progress_timer = setTimeout(() => {
        this.props.dispatch({
          type: "exchange/handleChange",
          payload: {
            buy_progress: sliderValue,
            buy_quantity: sliderValue
              ? helper.digits(
                  math
                    .chain(math.bignumber(sliderValue || 0))
                    .divide(100)
                    .multiply(math.bignumber(this.props.token2_quantity || 0))
                    .format({ notation: "fixed" })
                    .done(),
                  this.props.quote_precision
                )
              : "",
          },
        });
      }, 10);
    }
    if (n == "sale_progress") {
      if (!Number(this.props.token1_quantity)) {
        return;
      }
      clearTimeout(progress_timer);
      progress_timer = setTimeout(() => {
        this.props.dispatch({
          type: "exchange/handleChange",
          payload: {
            sale_progress: sliderValue,
            sale_quantity: sliderValue
              ? helper.digits(
                  math
                    .chain(math.bignumber(sliderValue || 0))
                    .divide(100)
                    .multiply(math.bignumber(this.props.token1_quantity || 0))
                    .format({ notation: "fixed" })
                    .done(),
                  this.props.base_precision
                )
              : "",
          },
        });
      });
    }
  }
  valueLabelFormat(value) {
    return `${value.toFixed(0)}%`;
  }
  render() {
    const { classes } = this.props;
    const token1_name = this.props.tokens[this.props.token1]
      ? this.props.tokens[this.props.token1]["tokenName"]
      : "";
    const token2_name = this.props.tokens[this.props.token2]
      ? this.props.tokens[this.props.token2]["tokenName"]
      : "";
    const account_id = this.props.userinfo.defaultAccountId;
    return (
      <div>
        <div className={classes.trading}>
          <div className={classes.form}>
            <div className={classes.t1}>
              <div span={20}>
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
                value={this.props.intl.formatMessage({
                  id: "以市场上最优价格买入",
                })}
                disabled
                classes={{
                  root: classes.inputRoot,
                  focused: classes.inputFocused,
                }}
                endAdornment={
                  <span className={classes.endAdorn}>{token2_name}</span>
                }
              />
            </div>
            <div className={classes.t2}>
              <div>
                {this.props.intl.formatMessage({
                  id: "金额",
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
                  <span className={classes.endAdorn}>{token2_name}</span>
                }
              />
            </div>
            <div className={classes.progress}>
              <Slider
                step={1}
                marks={this.state.marks}
                value={this.props.buy_progress}
                valueLabelFormat={this.valueLabelFormat}
                onChange={this.progressChange.bind(this, "buy_progress")}
                valueLabelDisplay="auto"
                aria-labelledby="buy_progress"
                ValueLabelComponent={TooltipCommon}
              />
            </div>
            <div className={classnames(classes.trading_form_footer)}>
              <p className={classes.amount} />
              {this.props.userinfo.userId ? (
                this.props.loading.effects["exchange/createOrder"] &&
                // this.props.createOrderStatus["market-BUY"] ? (
                this.props.marketBUY ? (
                  <Button className={classes.btn} disabled>
                    <p className={classes.btn_loading}>
                      <CircularProgress size={18} color="default" />
                    </p>
                  </Button>
                ) : this.props.buy_config ? (
                  <Button
                    onClick={this.orderCreate.bind(this, 1, "BUY")}
                    className={classnames(classes.btn, "green")}
                    style={{
                      background: helper.hex_to_rgba(
                        window.palette.up.main,
                        0.8
                      ),
                    }}
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
          </div>
          <div className={classes.form} span={12}>
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
                value={this.props.intl.formatMessage({
                  id: "以市场上最优价格卖出",
                })}
                disabled
                classes={{
                  root: classes.inputRoot,
                  focused: classes.inputFocused,
                }}
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
            <div className={classnames(classes.progress, "red")}>
              <Slider
                step={1}
                marks={this.state.marks}
                value={this.props.sale_progress}
                valueLabelFormat={this.valueLabelFormat}
                onChange={this.progressChange.bind(this, "sale_progress")}
                valueLabelDisplay="auto"
                aria-labelledby="sale_progress"
                ValueLabelComponent={TooltipCommon}
              />
            </div>
            <div className={classnames(classes.trading_form_footer)}>
              <p className={classes.amount} />
              {this.props.userinfo.userId ? (
                this.props.loading.effects["exchange/createOrder"] &&
                // this.props.createOrderStatus["market-SELL"] ? (
                this.props.marketSELL ? (
                  <Button className={classes.btn} disabled>
                    <p className={classes.btn_loading}>
                      <CircularProgress size={18} color="default" />
                    </p>
                  </Button>
                ) : this.props.sell_config ? (
                  <Button
                    onClick={this.orderCreate.bind(this, 1, "SELL")}
                    className={classnames(classes.btn, "red")}
                    style={{
                      background: helper.hex_to_rgba(
                        window.palette.down.main,
                        0.8
                      ),
                    }}
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

export default withStyles(styles)(injectIntl(MarketTrading));
