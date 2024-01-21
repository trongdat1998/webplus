// 计划委托
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import classnames from "classnames";
import {
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Slider,
  Input,
  Paper,
  OutlinedInput,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { Iconfont, message } from "../../lib";
import route_map from "../../config/route_map";
import vali from "../../utils/validator";
import helper from "../../utils/helper";
import math from "../../utils/mathjs";
import CONST from "../../config/const";
import styles from "../public/quote_style";
import TooltipCommon from "../public/tooltip";
import WSDATA from "../../models/data_source";

let progress_time = new Date().getTime();
let progress_timer = null;

const SelectIcon = (props) => (
  <Iconfont {...props} type="arrowDown" size="20" />
);

class PlanTrading extends React.Component {
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
      buy_focus: false,
      buy_trigger_price_focus: false,
      sell_focus: false,
      sell_trigger_price_focus: false,
      dialog_order_confirm: false, // 下单确认框
      order_confirm: { buy: false, sell: false }, // 是否已确认
      order_side: "", // 下单方向
      buy_type: CONST.ORDER_TYPE.LIMIT, // 普通委托
      buy_trigger_price: "",
      sale_trigger_price: "",
      sale_type: CONST.ORDER_TYPE.LIMIT,
    };
    this.handleChange = this.handleChange.bind(this);
    this.progressChange = this.progressChange.bind(this);
    this.orderCreate = this.orderCreate.bind(this);
    this.fix_digits = this.fix_digits.bind(this);
    this.focus = this.focus.bind(this);
    this.inputSelectRef = React.createRef();
  }
  componentDidMount() {
    this.props.dispatch({
      type: "exchange/handleChange",
      payload: {
        setProgress: this.setProgress,
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
        type: "exchange/handleChange",
        payload: {
          buy_price: tokenQuote.c || "",
          buy_auto: true,
        },
      });
    }
    if (this.props.sale_price === "" && tokenQuote.c && !this.props.sale_auto) {
      this.props.dispatch({
        type: "exchange/handleChange",
        payload: {
          sale_price: tokenQuote.c || "",
          sale_auto: true,
        },
      });
    }
  }
  shouldComponentUpdate(preProps, preState) {
    const props = [
      this.props.token1,
      this.props.token2,

      this.props.buy_price,
      this.props.buy_quantity,
      this.props.buy_progress,
      this.props.token2_quantity,
      this.props.buy_config,

      this.props.sale_price,
      this.props.sale_quantity,
      this.props.sale_progress,
      this.props.token1_quantity,
      this.props.quoteMode,
    ];
    const pres = [
      preProps.token1,
      preProps.token2,

      preProps.buy_price,
      preProps.buy_quantity,
      preProps.buy_progress,
      preProps.token2_quantity,
      preProps.buy_config,

      preProps.sale_price,
      preProps.sale_quantity,
      preProps.sale_progress,
      preProps.token1_quantity,
    ];

    const state = [
      this.state.buy_trigger_price,
      this.state.sell_trigger_price,
      this.state.sell_trigger_price_focus,
      this.state.buy_trigger_price_focus,
      this.state.buy_focus,
      this.state.sale_focus,
    ];
    const prestate = [
      preState.buy_trigger_price,
      preState.sell_trigger_price,
      preState.sell_trigger_price_focus,
      preState.buy_trigger_price_focus,
      preState.buy_focus,
      preState.sale_focus,
    ];

    const loading =
      this.props.loading && this.props.loading.effects
        ? this.props.loading.effects
        : {};
    const nextloading =
      preProps.loading && preProps.loading.effects
        ? preProps.loading.effects
        : {};
    if (
      loading["layout/get_rates"] != nextloading["layout/get_rates"] ||
      loading["exchange/createPlanOrder"] !=
        nextloading["exchange/createPlanOrder"]
    ) {
      return true;
    }

    let r = false;
    props.map((item, i) => {
      if (item != pres[i]) {
        r = true;
      }
    });
    state.map((item, i) => {
      if (item != prestate[i]) {
        r = true;
      }
    });

    return r;
  }

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
  async orderCreate(order_side, e) {
    try {
      if (
        vali.isValidOrder(
          {
            order_side,
            order_type:
              order_side == "BUY" ? this.state.buy_type : this.state.sale_type,
            buy_price: this.props.buy_price,
            sale_price: this.props.sale_price,
            buy_quantity: this.props.buy_quantity,
            sale_quantity: this.props.sale_quantity,
            trigger_price:
              order_side == "BUY"
                ? this.state.buy_trigger_price
                : this.state.sale_trigger_price,
          },
          {
            base_precision: this.props.base_precision,
            min_price_precision: this.props.min_price_precision,
            min_trade_quantity: this.props.min_trade_quantity,
            quote_precision: this.props.quote_precision,
            min_trade_amount: this.props.min_trade_amount,
            token1_quantity: this.props.token1_quantity,
            token2_quantity: this.props.token2_quantity,
            buy_max: this.props.buy_max,
          }
        )
      ) {
        if (this.props.match.params.token1 && this.props.match.params.token2) {
          const symbol_quote = WSDATA.getData("symbol_quote_source");
          const token1 = this.props.match.params.token1.toUpperCase();
          const token2 = this.props.match.params.token2.toUpperCase();
          const tokenInfo = symbol_quote[token1 + token2] || {};

          // 买单 高于最新价20%
          if (
            order_side == "BUY" &&
            this.state.buy_type == CONST.ORDER_TYPE.LIMIT &&
            Number(tokenInfo.c) &&
            this.props.buy_price / tokenInfo.c > 1.2 &&
            !this.state.order_confirm.buy
          ) {
            this.setState({
              dialog_order_confirm: true,
              order_side: "BUY",
            });
            return;
          }

          // 卖单 低于最新价20%
          if (
            order_side == "SELL" &&
            this.state.sale_type == CONST.ORDER_TYPE.LIMIT &&
            Number(tokenInfo.c) &&
            tokenInfo.c * 0.8 - this.props.sale_price > 0 &&
            !this.state.order_confirm.sell
          ) {
            this.setState({
              dialog_order_confirm: true,
              order_side: "SELL",
            });
            return;
          }
        }
        await this.props.dispatch({
          type: "exchange/createPlanOrder",
          payload: {
            symbol_id: this.props.symbol_id,
            type:
              order_side == "SELL" ? this.state.sale_type : this.state.buy_type,
            side: order_side,
            trigger_price:
              order_side == "SELL"
                ? this.state.sale_trigger_price
                : this.state.buy_trigger_price,
            price:
              order_side == "SELL"
                ? this.props.sale_price
                : this.props.buy_price,
            quantity:
              order_side == "SELL"
                ? this.props.sale_quantity
                : this.props.buy_quantity,
            client_order_id: new Date().getTime(),
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
              this.setState({
                order_confirm: { sell: false, buy: false },
                dialog_order_confirm: false,
                order_side: "",
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
              this.setState({
                order_confirm: { sell: false, buy: false },
                dialog_order_confirm: false,
                order_side: "",
              });
            }
            // 拉取最新资产
            this.getLastAccount();
          },
        });
      }
    } catch (err) {
      if (err.value) {
        message.error(window.appLocale.messages[err.message] + err.value);
      } else {
        message.error(window.appLocale.messages[err.message]);
      }
    }
  }
  // 确认下单后，继续下单
  nextStep = () => {
    this.setState(
      {
        dialog_order_confirm: false,
        order_confirm: {
          buy: true,
          sell: true,
        },
      },
      () => {
        this.orderCreate(0, this.state.order_side);
      }
    );
  };
  getLastAccount = async () => {
    await this.props.dispatch({
      type: "layout/getAccount",
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
    let v = t.value;
    v = v
      .replace(/[^0-9\.]/, "")
      .replace(/^0{1,}/, "0")
      .replace(/^(0)([1-9])/, ($1, $2) => {
        return $2;
      })
      .replace(/^\./, "0.");

    if (n == "sale_trigger_price" || n == "buy_trigger_price") {
      this.setState({
        [n]: v,
      });
      return;
    } else {
      // 没有输入
      if (!v) {
        let data = {
          [n]: "",
        };
        if (n.indexOf("buy") > -1) {
          data.buy_progress = 0;
        }
        if (n.indexOf("sale") > -1) {
          data.sale_progress = 0;
        }
        this.props.dispatch({
          type: "exchange/handleChange",
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
      // 买入价格 <= max
      // 精度判断
      if (n == "buy_price") {
        let d = v
          ? Number(v) >= this.state.max
            ? `${this.state.max}`
            : v
          : "";
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
      }
      // 买入数量 <= max
      // 精度判断,重置进度条
      if (n == "buy_quantity") {
        let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
        d = this.fix_digits(
          d,
          this.state.buy_type == CONST.ORDER_TYPE.LIMIT
            ? this.props.base_precision
            : this.props.quote_precision
        );
        let progress = 0;
        // 市价买
        if (
          this.state.buy_type == CONST.ORDER_TYPE.MARKET &&
          Number(d) &&
          Number(this.props.token2_quantity)
        ) {
          progress = Math.min(
            100,
            math
              .chain(d)
              .divide(this.props.token2_quantity)
              .multiply(100)
              .format({ notation: "fixed", precision: 4 })
              .done()
          );
        }
        // 限价main
        else if (
          this.state.buy_type == CONST.ORDER_TYPE.LIMIT &&
          Number(d) &&
          Number(this.props.buy_max) &&
          this.props.buy_price
        ) {
          progress = Math.min(
            100,
            math
              .chain(d)
              .divide(this.props.buy_max)
              .multiply(100)
              .format({ notation: "fixed", precision: 4 })
              .done()
          );
        }
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
              .done()
          );
        }
        data = {
          [n]: d,
          sale_progress: progress,
        };
      }
      this.props.dispatch({
        type: "exchange/handleChange",
        payload: {
          ...data,
        },
      });
    }
  }

  focus(name, isFocus) {
    this.setState({
      [name]: isFocus,
    });
  }

  setProgress = (key, v) => {
    this.setState({
      [key]: v,
    });
  };

  progressChange(n, v, sliderValue) {
    if (n == "buy_progress") {
      if (!Number(this.props.token2_quantity)) {
        return;
      }
      this.recomputeBuyQty(sliderValue);
    }
    if (n == "sale_progress") {
      if (!Number(this.props.token1_quantity)) {
        return;
      }
      this.recomputeSellQty(sliderValue);
    }
  }

  valueLabelFormat(value) {
    return `${value.toFixed(0)}%`;
  }

  closeConfirm = () => {
    this.setState({
      dialog_order_confirm: false,
      order_confirm: { sell: false, buy: false },
      order_side: "",
    });
  };

  onBuyTypeChange = (event) => {
    const buyType = event.target.value;
    this.setState(
      {
        buy_type: buyType,
      },
      () => {
        this.recomputeBuyQty();
      }
    );
  };

  /**
   * 重新计算购买数量
   */
  recomputeBuyQty = (progress) => {
    const { buy_type } = this.state;
    if (progress == undefined) {
      progress = this.props.buy_progress;
    }
    if (buy_type == CONST.ORDER_TYPE.MARKET) {
      // 市价买的时候，买入
      const buyMax = this.props.token2_quantity;
      let buyQty = "";
      if (progress) {
        buyQty = helper.digits(
          math
            .chain(math.bignumber(buyMax))
            .multiply(math.bignumber(progress))
            .divide(math.bignumber(100))
            .format({ notation: "fixed" })
            .done(),
          this.props.quote_precision
        );
      }
      this.props.dispatch({
        type: "exchange/handleChange",
        payload: {
          buy_max: buyMax,
          buy_quantity: buyQty,
          buy_progress: progress,
        },
      });
    } else {
      if (!this.props.buy_price) {
        this.props.dispatch({
          type: "exchange/handleChange",
          payload: {
            buy_max: 0,
            buy_quantity: "",
            buy_progress: 0,
          },
        });
        return;
      }
      const buyMax = math
        .chain(math.bignumber(this.props.token2_quantity))
        .divide(math.bignumber(this.props.buy_price))
        .format({ notation: "fixed" })
        .done();
      let buyQty = "";
      if (progress) {
        buyQty = helper.digits(
          math
            .chain(math.bignumber(buyMax))
            .multiply(math.bignumber(progress))
            .divide(math.bignumber(100))
            .format({ notation: "fixed" })
            .done(),
          this.props.base_precision
        );
      }
      this.props.dispatch({
        type: "exchange/handleChange",
        payload: {
          buy_max: buyMax,
          buy_quantity: buyQty,
          buy_progress: progress,
        },
      });
    }
  };

  onSellTypeChange = (event) => {
    this.setState(
      {
        sale_type: event.target.value,
      },
      () => {
        this.recomputeSellQty();
      }
    );
  };

  /**
   * 重新计算出售数量
   */
  recomputeSellQty = (progress) => {
    if (progress == undefined) {
      progress = this.props.sell_progress;
    }
    let sellQty = "";
    if (progress) {
      sellQty = helper.digits(
        math
          .chain(math.bignumber(progress))
          .divide(100)
          .multiply(math.bignumber(this.props.token1_quantity))
          .format({ notation: "fixed" })
          .done(),
        this.props.base_precision
      );
    }
    this.props.dispatch({
      type: "exchange/handleChange",
      payload: {
        sale_quantity: sellQty,
        sale_progress: progress,
      },
    });
  };

  render() {
    const { classes } = this.props;
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
      window.localStorage.lang,
      true
    );
    const buy_amount_rates = helper.currencyValue(
      this.props.rates,
      (this.props.buy_price || 0) * (this.props.buy_quantity || 0),
      this.props.token2,
      window.localStorage.lang,
      true
    );
    const sale_price_rates = helper.currencyValue(
      this.props.rates,
      this.props.sale_price,
      this.props.token2,
      window.localStorage.lang,
      true
    );
    const sale_amount_rates = helper.currencyValue(
      this.props.rates,
      (this.props.sale_price || 0) * (this.props.sale_quantity || 0),
      this.props.token2,
      window.localStorage.lang,
      true
    );
    return (
      <div>
        <div align="between" className={classes.trading}>
          <div className={classes.form} span={12}>
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
                  id: "触发价",
                })}
              </div>
              <OutlinedInput
                name="buy_trigger_price"
                onChange={this.handleChange}
                autoComplete="off"
                onFocus={this.focus.bind(this, "buy_trigger_price_focus", true)}
                onBlur={this.focus.bind(this, "buy_trigger_price_focus", false)}
                classes={{
                  root: classes.inputRoot,
                  focused: classes.inputFocused,
                }}
                startAdornment={
                  this.state.buy_trigger_price &&
                  this.state.buy_trigger_price_focus ? (
                    <p className={classes.startAdorn}>
                      {this.state.buy_trigger_price &&
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
                value={this.state.buy_trigger_price}
              />
            </div>
            <div className={classes.t2}>
              <div>
                {this.props.intl.formatMessage({
                  id: "价格",
                })}
              </div>
              <div
                className={classnames({
                  [classes.inputSelectGroup]: true,
                  [classes.inputFocused]: false,
                })}
              >
                <Input
                  name="buy_price"
                  value={
                    this.state.buy_type == CONST.ORDER_TYPE.LIMIT
                      ? this.props.buy_price
                      : this.props.intl.formatMessage({
                          id: "以市场上最优价格买入",
                        })
                  }
                  onChange={this.handleChange}
                  onFocus={this.focus.bind(this, "buy_focus", true)}
                  onBlur={this.focus.bind(this, "buy_focus", false)}
                  autoComplete="off"
                  readOnly={this.state.buy_type == CONST.ORDER_TYPE.MARKET}
                  classes={{
                    root: classes.inputSelectGroup_inputRoot,
                    focused: classes.inputSelectGroup_inputFocus,
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
                <Select
                  value={this.state.buy_type}
                  classes={{
                    root: classes.inputSelectGroup_selectRoot,
                    icon: classes.selectIcon,
                    select: classes.inputSelectGroup_select,
                  }}
                  IconComponent={SelectIcon}
                  MenuProps={{
                    disableScrollLock: true,
                    getContentAnchorEl: null,
                    anchorOrigin: { horizontal: "left", vertical: "bottom" },
                    classes: {
                      paper: classes.commonPaper,
                      list: classes.menuList,
                    },
                  }}
                  onChange={this.onBuyTypeChange}
                >
                  <MenuItem
                    className={classes.menuItem}
                    value={CONST.ORDER_TYPE.LIMIT}
                  >
                    {this.props.intl.formatMessage({
                      id: "限价",
                    })}
                  </MenuItem>
                  <MenuItem
                    className={classes.menuItem}
                    value={CONST.ORDER_TYPE.MARKET}
                  >
                    {this.props.intl.formatMessage({
                      id: "市价",
                    })}
                  </MenuItem>
                </Select>
              </div>
            </div>
            {this.state.buy_type == CONST.ORDER_TYPE.LIMIT ? (
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
            ) : (
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
            )}
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
            <div className={classes.planTradingBtn}>
              {this.props.userinfo.userId ? (
                this.props.loading.effects["exchange/createPlanOrder"] &&
                this.props.createBUYPlanOrderStatus ? (
                  <Button className={classes.btn} disabled>
                    <p className={classes.btn_loading}>
                      <CircularProgress size={18} color="primary" />
                    </p>
                  </Button>
                ) : this.props.buy_config ? (
                  <Button
                    onClick={this.orderCreate.bind(this, "BUY")}
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
          </div>
          <div className={classes.form} span={12}>
            <div className={classes.t1}>
              <div>
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
                  id: "触发价",
                })}
              </div>
              <OutlinedInput
                name="sale_trigger_price"
                value={this.state.sale_trigger_price}
                onChange={this.handleChange}
                onFocus={this.focus.bind(
                  this,
                  "sale_trigger_price_focus",
                  true
                )}
                onBlur={this.focus.bind(
                  this,
                  "sale_trigger_price_focus",
                  false
                )}
                autoComplete="off"
                classes={{
                  root: classes.inputRoot,
                  focused: classes.inputFocused,
                }}
                startAdornment={
                  this.state.sale_trigger_price &&
                  this.state.sale_trigger_price_focus ? (
                    <p className={classes.startAdorn}>
                      {this.state.sale_trigger_price &&
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
                  id: "价格",
                })}
              </div>
              <div
                className={classnames({
                  [classes.inputSelectGroup]: true,
                  [classes.inputFocused]: false,
                })}
              >
                <Input
                  name="sale_price"
                  value={
                    this.state.sale_type == CONST.ORDER_TYPE.LIMIT
                      ? this.props.sale_price
                      : this.props.intl.formatMessage({
                          id: "以市场上最优价格卖出",
                        })
                  }
                  readOnly={this.state.sale_type == CONST.ORDER_TYPE.MARKET}
                  onChange={this.handleChange}
                  onFocus={this.focus.bind(this, "sale_focus", true)}
                  onBlur={this.focus.bind(this, "sale_focus", false)}
                  autoComplete="off"
                  classes={{
                    root: classes.inputSelectGroup_inputRoot,
                    focused: classes.inputSelectGroup_inputFocus,
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
                <Select
                  value={this.state.sale_type}
                  ref={this.inputSelectRef}
                  classes={{
                    root: classes.inputSelectGroup_selectRoot,
                    icon: classes.selectIcon,
                    select: classes.inputSelectGroup_select,
                  }}
                  IconComponent={SelectIcon}
                  MenuProps={{
                    disableScrollLock: true,
                    getContentAnchorEl: null,
                    anchorOrigin: { horizontal: "left", vertical: "bottom" },
                    classes: {
                      paper: classes.commonPaper,
                      list: classes.menuList,
                    },
                  }}
                  onChange={this.onSellTypeChange}
                >
                  <MenuItem
                    className={classes.menuItem}
                    value={CONST.ORDER_TYPE.LIMIT}
                  >
                    {this.props.intl.formatMessage({
                      id: "限价",
                    })}
                  </MenuItem>
                  <MenuItem
                    className={classes.menuItem}
                    value={CONST.ORDER_TYPE.MARKET}
                  >
                    {this.props.intl.formatMessage({
                      id: "市价",
                    })}
                  </MenuItem>
                </Select>
              </div>
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

            <div className={classes.planTradingBtn}>
              {this.props.userinfo.userId ? (
                this.props.loading.effects["exchange/createPlanOrder"] &&
                this.props.createSELLPlanOrderStatus ? (
                  <Button disabled className={classes.btn}>
                    <p className={classes.btn_loading}>
                      <CircularProgress size={18} color="primary" />
                    </p>
                  </Button>
                ) : this.props.sell_config ? (
                  <Button
                    onClick={this.orderCreate.bind(this, "SELL")}
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
        <Dialog
          open={this.state.dialog_order_confirm}
          onClose={this.closeConfirm}
        >
          <DialogContent>
            <p className={classes.order_confirm}>
              {this.props.intl.formatMessage(
                {
                  id:
                    this.state.order_side == "BUY"
                      ? "您的委托价格高于最新成交价{percent}%，是否确定下单？"
                      : "您的委托价格低于最新成交价{percent}%，是否确定下单？",
                },
                {
                  percent: 20,
                }
              )}
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeConfirm}>
              {this.props.intl.formatMessage({ id: "取消" })}
            </Button>
            <Button color="primary" onClick={this.nextStep}>
              {this.props.intl.formatMessage({ id: "确认" })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(PlanTrading));
