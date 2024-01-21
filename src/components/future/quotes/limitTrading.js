// 限价交易
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import classnames from "classnames";
import { message, Iconfont } from "../../../lib";
import styles from "./quote_style";
import route_map from "../../../config/route_map";
import vali from "../../../utils/validator";
import helper from "../../../utils/helper";
import math from "../../../utils/mathjs";
import CONST from "../../../config/const";
import ModalOrder from "./modal_order";
import ModalRisk from "./modal_risk";
import WSDATA from "../../../models/data_source";

import {
  FormHelperText,
  MenuItem,
  Grid,
  InputBase,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  Slider,
  OutlinedInput,
  ButtonGroup,
  Button,
  CircularProgress,
} from "@material-ui/core";
import TooltipCommon from "../../public/tooltip";

let progress_timer = null;

class LimitTrading extends React.Component {
  constructor() {
    super();
    this.state = {
      max: 9999999999,
      buy_price: {
        value: "",
        msg: "",
      },
      buy_trigger_price: {
        msg: "",
      },
      buy_quantity: {
        value: "",
        msg: "",
      },
      sale_price: {
        value: "",
        msg: "",
      },
      sale_trigger_price: {
        msg: "",
      },
      sale_quantity: {
        value: "",
        msg: "",
      },
      buy_other: {
        msg: "",
      },
      sale_other: { msg: "" },
      buy_auto: false,
      sale_auto: false,
      buy_progress: 0,
      sale_progress: 0,
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
      buy_trigger_focus: false,
      sale_trigger_focus: false,
      width: 0,
      loading: false,
      orderSetting: CONST.time_in_force,
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
      type: "future/getOrderSetting",
      payload: {},
    });
    this.props.dispatch({
      type: "future/save",
      payload: {
        setProgress: this.setProgress,
        createOrderFormChange: this.handleChange,
      },
    });
  }
  setProgress = (key, v) => {
    this.setState({
      [key]: v,
    });
  };
  componentDidUpdate() {
    let symbol_info = this.props.future_info;

    // 写入输入框价格
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const symbolId = (this.props.match.params.symbolId || "").toUpperCase();
    const tokenQuote = symbol_quote[symbolId] || {};
    if (this.props.buy_price === "" && tokenQuote.c && !this.state.buy_auto) {
      this.props.dispatch({
        type: "future/handleChange",
        payload: {
          buy_price: tokenQuote.c || "",
        },
      });
      this.setState({
        buy_auto: true,
      });
    }
    if (this.props.sale_price === "" && tokenQuote.c && !this.state.sale_auto) {
      this.props.dispatch({
        type: "future/handleChange",
        payload: {
          sale_price: tokenQuote.c || "",
        },
      });
      this.setState({
        sale_auto: true,
      });
    }
    // 写入杠杠值初始值
    if (!this.props.buy_leverage && symbolId && symbol_info.baseTokenFutures) {
      const buy =
        symbolId.toUpperCase() + this.props.order_choose + "buy_leverage";
      const sale =
        symbolId.toUpperCase() + this.props.order_choose + "sale_leverage";
      const len = symbol_info.baseTokenFutures.levers.length;
      window.localStorage[buy] =
        window.localStorage[buy] ||
        symbol_info.baseTokenFutures.levers[
          Math.max(0, Math.ceil(len / 2) - 1)
        ];
      const buy_leverage = window.localStorage[buy];
      window.localStorage[sale] =
        window.localStorage[sale] ||
        symbol_info.baseTokenFutures.levers[
          Math.max(0, Math.ceil(len / 2) - 1)
        ];
      const sale_leverage = window.localStorage[sale];

      this.props.dispatch({
        type: "future/handleChange",
        payload: {
          buy_leverage,
          sale_leverage,
        },
      });
    }
    // 写入风险限额初始值
    if (
      !this.props.buy_risk &&
      symbolId &&
      this.props.order_setting[symbolId.toUpperCase()]
    ) {
      const order_setting = this.props.order_setting[symbolId.toUpperCase()];
      if (!order_setting.riskLimit || !order_setting.riskLimit.length) return;
      let buy_risk = "";
      let sale_risk = "";
      order_setting.riskLimit.map((item) => {
        if (item.side == "BUY_OPEN") {
          buy_risk = item.riskLimitId;
        }
        if (item.side == "SELL_OPEN") {
          sale_risk = item.riskLimitId;
        }
      });
      this.props.dispatch({
        type: "future/handleChange",
        payload: {
          buy_risk,
          sale_risk,
        },
      });
    }
  }
  // 资产变化时，重新计算buymax
  componentWillReceiveProps(nextProps) {
    // id变化时，清除state msg状态
    if (this.props.symbol_id != nextProps.symbol_id) {
      this.setState({
        buy_price: {
          value: "",
          msg: "",
        },
        buy_quantity: {
          value: "",
          msg: "",
        },
        buy_trigger_price: {
          msg: "",
        },
        sale_price: {
          value: "",
          msg: "",
        },
        sale_trigger_price: {
          msg: "",
        },
        sale_quantity: {
          value: "",
          msg: "",
        },
        buy_other: {
          msg: "",
        },
        sale_other: { msg: "" },
      });
    } else {
      const old_available = this.props.future_tradeable[this.props.symbol_id];
      const new_available = nextProps.future_tradeable[this.props.symbol_id];
      if (
        old_available &&
        old_available.profitLoss &&
        new_available &&
        new_available.profitLoss &&
        old_available.profitLoss.coinAvailable !=
          new_available.profitLoss.coinAvailable
      ) {
        const buy_max = nextProps.buy_price
          ? this.getMax(
              "BUY",
              nextProps.buy_price,
              new_available.profitLoss.coinAvailable
            )
          : 0;
        const sale_max = nextProps.sale_price
          ? this.getMax(
              "SELL",
              nextProps.sale_price,
              new_available.profitLoss.coinAvailable
            )
          : 0;
        this.props.dispatch({
          type: "future/handleChange",
          payload: {
            buy_max,
            sale_max,
          },
        });
      }
    }
  }

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
   * @param {string} order_side BUY|SELL
   * @param {boolean} where 下单按钮=true, 弹窗确认按钮=false
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
  async orderCreate(order_side, where, e) {
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
      // 计划委托价格
      if (
        !Number(this.props.sale_trigger_price) &&
        this.props.sale_price !== "0" &&
        this.props.sale_type == 1
      ) {
        this.setState({
          sale_trigger_price: {
            msg: this.props.intl.formatMessage({
              id: "请填写委托价格",
            }),
          },
          sale_price: {
            msg: "",
          },
          sale_quantity: {
            msg: "",
          },
          sale_other: { msg: "" },
        });
        return;
      }
      // 价格不存在或=0, 限价时验证
      if (
        !Number(this.props.sale_price) &&
        this.props.sale_price !== "0" &&
        this.props.sale_price_type == 0
      ) {
        window.console.error("价格不存在", this.props.sale_price);
        // message.error(
        //   this.props.intl.formatMessage({
        //     id: "卖出价格不正确"
        //   })
        // );
        this.setState({
          sale_price: {
            msg: this.props.intl.formatMessage({
              id: this.props.sale_price_type == 0 ? "请填写价格" : "价格不存在",
            }),
          },
          sale_quantity: {
            msg: "",
          },
          sale_trigger_price: { msg: "" },
          sale_other: { msg: "" },
        });
        return;
      }
      // 价格小于最小值
      if (
        Number(this.props.sale_price) <
          Number(this.props.min_price_precision) &&
        this.props.sale_price_type == 0
      ) {
        window.console.error(
          "价格小于最小值",
          this.props.sale_price,
          this.props.min_price_precision
        );
        // message.error(
        //   this.props.intl.formatMessage({
        //     id: "卖出价格不能小于"
        //   }) + this.props.min_price_precision
        // );
        this.setState({
          sale_price: {
            msg:
              this.props.intl.formatMessage({
                id: "价格不能小于",
              }) + this.props.min_price_precision,
          },
          sale_quantity: {
            msg: "",
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" },
        });
        return;
      }
      // 价格大于最大值
      if (
        Number(this.props.sale_price) > this.state.max &&
        this.props.sale_price_type == 0
      ) {
        window.console.error(
          "价格大于最大值",
          this.props.sale_price,
          this.state.max
        );
        // message.error(
        //   this.props.intl.formatMessage({
        //     id: "卖出价格不能大于"
        //   }) + this.state.max
        // );
        this.setState({
          sale_price: {
            msg:
              this.props.intl.formatMessage({
                id: "价格不能大于",
              }) + this.state.max,
          },
          sale_quantity: {
            msg: "",
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" },
        });
        return;
      }
      // 价格精度不正确
      if (
        !this.equalDigit(
          Number(this.props.sale_price),
          this.props.min_price_precision
        ) &&
        this.props.sale_price_type == 0
      ) {
        window.console.error(
          "价格精度不正确",
          this.props.sale_price,
          this.props.min_price_precision
        );
        // message.error(
        //   this.props.intl.formatMessage({
        //     id: "卖出价格精度不正确"
        //   })
        // );
        this.setState({
          sale_price: {
            msg: this.props.intl.formatMessage({
              id: "价格精度不正确",
            }),
          },
          sale_quantity: {
            msg: "",
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" },
        });
        return;
      }

      // 卖出数量不存在
      if (
        !Number(this.props.sale_quantity) &&
        this.props.sale_quantity !== "0"
      ) {
        window.console.error("卖出数量不存在", this.props.sale_quantity);
        // message.error(
        //   this.props.intl.formatMessage({
        //     id: "卖出数量不正确"
        //   })
        // );
        this.setState({
          sale_quantity: {
            msg: this.props.intl.formatMessage({
              id: "请填写数量",
            }),
          },
          sale_price: {
            msg: "",
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" },
        });
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
        // message.error(
        //   this.props.intl.formatMessage({
        //     id: "卖出数量不能小于"
        //   }) + this.props.min_trade_quantity
        // );
        this.setState({
          sale_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能小于",
              }) + this.props.min_trade_quantity,
          },
          sale_price: {
            msg: "",
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" },
        });
        return;
      }
      // 卖出数量大于最大值
      if (Number(this.props.sale_quantity) > this.state.max) {
        window.console.error(
          "卖出数量大于最大值",
          this.props.sale_quantity,
          this.state.max
        );
        // message.error(
        //   this.props.intl.formatMessage({
        //     id: "卖出数量不能大于"
        //   }) + this.state.max
        // );
        this.setState({
          sale_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能大于",
              }) + this.state.max,
          },
          sale_price: {
            msg: "",
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" },
        });
        return;
      }
      // 平仓 and  数量大于最大值
      const sale_max = this.getMax("SELL");
      if (
        Number(this.props.sale_quantity) > Number(sale_max) &&
        this.props.order_choose == 1
      ) {
        window.console.error(
          "数量大于最大值",
          this.props.sale_quantity,
          sale_max
        );
        this.setState({
          sale_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能大于",
              }) + sale_max,
          },
          sale_price: {
            msg: "",
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" },
        });
        return;
      }
      // 数量精度不正确, 非整倍数
      if (
        !this.equalDigit(
          Number(this.props.sale_quantity),
          //Math.pow(10, -this.props.base_precision)
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
        this.setState({
          sale_quantity: {
            msg: this.props.intl.formatMessage({
              id: "数量精度不正确",
            }),
          },
          sale_price: {
            msg: "",
          },
          sale_trigger_price: { msg: "" },
          sale_other: { msg: "" },
        });
        return;
      }
      // 开仓验证 成本大于风险限额余额
      if (this.props.order_choose == 0) {
        const symbolId = this.props.match.params.symbolId.toUpperCase();
        // 余额
        const tradeable = this.props.future_tradeable[symbolId] || {};
        const riskLimit = this.getRiskLimit(symbolId, "SELL_OPEN");
        if (
          Number(this.props.sale_quantity) +
            Number(tradeable.shortTotal || 0) -
            Number(riskLimit.riskLimitAmount || 0) >
          0
        ) {
          console.error(
            "请调整风险限额大于仓位价值后可以开仓",
            tradeable.shortTotal,
            riskLimit.riskLimitAmount
          );
          this.setState({
            sale_quantity: {
              msg: "",
            },
            sale_other: {
              msg: this.props.intl.formatMessage({
                id: "请调整风险限额大于仓位价值后可以开仓",
              }),
            },
            sale_price: {
              msg: "",
            },
            sale_trigger_price: { msg: "" },
          });
          return;
        }
      }
    }
    // buy
    if (order_side === "BUY") {
      // 计划委托价格
      if (
        !Number(this.props.buy_trigger_price) &&
        this.props.buy_price !== "0" &&
        this.props.buy_type == 1
      ) {
        this.setState({
          buy_trigger_price: {
            msg: this.props.intl.formatMessage({
              id: "请填写委托价格",
            }),
          },
          buy_price: {
            msg: "",
          },
          buy_quantity: {
            msg: "",
          },
          buy_other: { msg: "" },
        });
        return;
      }
      // 价格不存在或=0, 限价时验证
      if (
        !Number(this.props.buy_price) &&
        this.props.buy_price !== "0" &&
        this.props.buy_price_type == 0
      ) {
        window.console.error("价格不存在", this.props.buy_price);
        // message.error(
        //   this.props.intl.formatMessage({
        //     id: "买入价格不正确"
        //   })
        // );
        this.setState({
          buy_price: {
            msg: this.props.intl.formatMessage({
              id: this.props.buy_price_type == 0 ? "请填写价格" : "价格不存在",
            }),
          },
          buy_quantity: {
            msg: "",
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" },
        });
        return;
      }
      // 价格小于最小值
      if (
        Number(this.props.buy_price) < Number(this.props.min_price_precision) &&
        this.props.buy_type == 1
      ) {
        window.console.error(
          "价格小于最小值",
          this.props.buy_price,
          this.props.min_price_precision
        );
        // message.error(
        //   this.props.intl.formatMessage({
        //     id: "买入价格不能小于"
        //   }) + this.props.min_price_precision
        // );
        this.setState({
          buy_price: {
            msg:
              this.props.intl.formatMessage({
                id: "价格不能小于",
              }) + this.props.min_price_precision,
          },
          buy_quantity: {
            msg: "",
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" },
        });
        return;
      }
      // 价格大于最大值
      if (
        Number(this.props.buy_price) > Number(this.state.max) &&
        this.props.buy_type == 1
      ) {
        window.console.error(
          "价格大于最大值",
          this.props.buy_price,
          this.state.max
        );
        // message.error(
        //   this.props.intl.formatMessage({
        //     id: "买入价格不能大于"
        //   }) + this.state.max
        // );
        this.setState({
          buy_price: {
            msg:
              this.props.intl.formatMessage({
                id: "价格不能大于",
              }) + this.state.max,
          },
          buy_quantity: {
            msg: "",
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" },
        });
        return;
      }
      // 价格精度不正确
      if (
        !this.equalDigit(
          Number(this.props.buy_price),
          this.props.min_price_precision
        ) &&
        this.props.buy_type == 1
      ) {
        window.console.error(
          "价格精度不正确",
          this.props.buy_price,
          this.props.min_price_precision
        );
        this.setState({
          buy_price: {
            msg: this.props.intl.formatMessage({
              id: "价格精度不正确",
            }),
          },
          buy_quantity: {
            msg: "",
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" },
        });
        return;
      }

      // 数量不存在
      if (!Number(this.props.buy_quantity) && this.props.buy_quantity !== "0") {
        window.console.error("数量不存在", this.props.buy_quantity);
        this.setState({
          buy_quantity: {
            msg: this.props.intl.formatMessage({
              id: "请填写数量",
            }),
          },
          buy_price: {
            msg: "",
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" },
        });
        return;
      }
      // 数量精度不正确
      if (
        !this.equalDigit(
          Number(this.props.buy_quantity),
          //Math.pow(10, -this.props.base_precision)
          math
            .chain(math.pow(10, math.bignumber(-this.props.base_precision)))
            .format({ notation: "fixed" })
            .done()
        ) ||
        !this.multipleDigit(
          Number(this.props.buy_quantity),
          //Math.pow(10, -this.props.base_precision)
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
        this.setState({
          buy_quantity: {
            msg: this.props.intl.formatMessage({
              id: "数量精度不正确",
            }),
          },
          buy_price: {
            msg: "",
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" },
        });
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
        this.setState({
          buy_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能小于",
              }) + this.props.min_trade_quantity,
          },
          buy_price: {
            msg: "",
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" },
        });
        return;
      }
      // 数量大于最大值
      if (Number(this.props.buy_quantity) > this.state.max) {
        window.console.error(
          "数量大于最大值",
          this.props.buy_quantity,
          this.state.max
        );
        this.setState({
          buy_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能大于",
              }) + this.state.max,
          },
          buy_price: {
            msg: "",
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" },
        });
        return;
      }
      // 平仓 and   buy_max 为0
      const buy_max = this.getMax("BUY");
      if (!buy_max && this.props.order_choose == 1) {
        window.console.error("买入最大值不存在", buy_max);
        this.setState({
          buy_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能大于",
              }) + buy_max,
          },
          buy_price: {
            msg: "",
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" },
        });
        return;
      }
      // 平仓 and  数量大于buy_max
      if (
        Number(this.props.buy_quantity) > buy_max &&
        this.props.order_choose == 1
      ) {
        window.console.error(
          "数量大于买入最大值",
          this.props.buy_quantity,
          buy_max
        );
        this.setState({
          buy_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能大于",
              }) + buy_max,
          },
          buy_price: {
            msg: "",
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" },
        });
        return;
      }
      // 开仓验证 成本是否大于风险限额余额
      if (this.props.order_choose == 0) {
        const symbolId = this.props.match.params.symbolId.toUpperCase();
        // 余额
        const tradeable = this.props.future_tradeable[symbolId] || {};
        const riskLimit = this.getRiskLimit(symbolId, "BUY_OPEN");
        if (
          Number(this.props.buy_quantity) +
            Number(tradeable.longTotal || 0) -
            Number(riskLimit.riskLimitAmount || 0) >
          0
        ) {
          window.console.error(
            "请调整风险限额大于仓位价值后可以开仓",
            tradeable.longTotal,
            riskLimit.riskLimitAmount
          );
          this.setState({
            buy_quantity: {
              msg: "",
            },
            buy_other: {
              msg: this.props.intl.formatMessage({
                id: "请调整风险限额大于仓位价值后可以开仓",
              }),
            },
            buy_price: {
              msg: "",
            },
            buy_trigger_price: { msg: "" },
          });
          return;
        }
      }
    }

    // 确认框出现条件：
    // 1、配置了下单再次确认
    // 2、普通委托 买入价格高于最新价20%
    // 3、普通委托 卖出价格低于最新价20%
    // 4、计划委托 买入价格高于触发价格20%
    // 5、计划委托 卖出价格低于触发价格20%
    const symbolId = (this.props.match.params.symbolId || "").toUpperCase();
    const order_setting = this.props.order_setting[symbolId];
    // 1、配置了下单确认
    const confirm1 =
      order_setting &&
      order_setting.orderSetting &&
      Boolean(order_setting.orderSetting.isConfirm) &&
      where;

    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const tokenQuote = symbol_quote[symbolId] || {};
    // 2、普通委托 买入价格高于最新价20%
    const confirm2 =
      Number(this.props.buy_type) == 0 &&
      Number(tokenQuote.c) &&
      this.props.buy_price &&
      this.props.buy_price / tokenQuote.c > 1.2 &&
      where;
    // 3、普通委托 卖出价格低于最新价20%
    const confirm3 =
      Number(this.props.buy_type) == 0 &&
      Number(tokenQuote.c) &&
      tokenQuote.c * 0.8 - this.props.sale_price > 0 &&
      where;
    // 4、计划委托 买入价格高于触发价20%
    const confirm4 =
      Number(this.props.buy_type) == 1 &&
      order_side == "BUY" &&
      Number(this.props.buy_trigger_price) &&
      this.props.buy_price / this.props.buy_trigger_price > 1.2 &&
      where;
    // 5、计划委托 卖出价格低于触发价20%
    const confirm5 =
      Number(this.props.sale_type) == 1 &&
      Number(this.props.sale_trigger_price) &&
      this.props.sale_trigger_price * 0.8 - this.props.sale_price > 0 &&
      where;
    if (confirm1 || confirm2 || confirm3 || confirm4 || confirm5) {
      this.props.dispatch({
        type: "future/handleChange",
        payload: {
          order_side: this.props.order_sides.findIndex(
            (item) => item == order_side
          ),
          modal_order: true,
        },
      });
      return;
    }

    let payload = {
      side:
        order_side + "_" + this.props.order_chooses[this.props.order_choose],
      type:
        order_side == "SELL"
          ? this.props.order_types[this.props.sale_type]
          : this.props.order_types[this.props.buy_type],
      price:
        order_side == "SELL" ? this.props.sale_price : this.props.buy_price,
      price_type:
        order_side == "SELL"
          ? this.props.price_types[this.props.sale_price_type]
          : this.props.price_types[this.props.buy_price_type],
      trigger_price:
        order_side == "SELL"
          ? this.props.sale_trigger_price
          : this.props.buy_trigger_price,
      leverage:
        this.props.order_choose == 0
          ? order_side == "SELL"
            ? this.props.sale_leverage
            : this.props.buy_leverage
          : "",
      // time_in_force: "1",
      // risk_limit_id:
      //   order_side == "SELL" ? this.props.sale_risk : this.props.buy_risk,
      quantity:
        order_side == "SELL"
          ? this.props.sale_quantity
          : this.props.buy_quantity,
      symbol_id: this.props.symbol_id,
      client_order_id: new Date().getTime(),
      exchange_id: this.props.exchange_id,
      order_side,
      time_in_force:
        this.props.buy_type == 1
          ? CONST.time_in_force
          : this.state.orderSetting,
    };
    if (this.props.order_choose == 1) {
      payload.leverage = "";
      //delete payload.leverage;
    }
    await this.props.dispatch({
      type: "future/createOrder",
      payload,
      success: () => {
        // 清空表单
        if (order_side === "SELL") {
          this.props.dispatch({
            type: "future/handleChange",
            payload: {
              sale_quantity: "",
              //sale_price: "",
              sale_progress: 0,
            },
          });
          this.setState({
            sale_progress: 0,
            sale_price: {
              msg: "",
            },
            sale_quantity: {
              msg: "",
            },
            sale_trigger_price: { msg: "" },
            sale_other: { msg: "" },
          });
        }
        if (order_side === "BUY") {
          this.props.dispatch({
            type: "future/handleChange",
            payload: {
              buy_quantity: "",
              //buy_price: "",
              buy_progress: 0,
            },
          });
          this.setState({
            buy_progress: 0,
            buy_price: {
              msg: "",
            },
            buy_quantity: {
              msg: "",
            },
            buy_trigger_price: { msg: "" },
            buy_other: { msg: "" },
          });
        }
        // 拉取最新资产
        //this.getLastAccount();
      },
    });
  }
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
  // 获取风险限额数据
  getRiskLimit = (symbolId, side) => {
    if (!symbolId || !side) return {};
    let obj = {};
    const order_setting =
      this.props.order_setting && this.props.order_setting[symbolId]
        ? this.props.order_setting[symbolId]
        : {};
    const riskLimit = order_setting.riskLimit;
    if (!riskLimit) return obj;
    riskLimit.map((item) => {
      if (item.side == side) {
        obj = item;
      }
    });
    return obj;
  };
  getFee = () => {
    let symbolId = this.props.match.params.symbolId;
    if (
      !symbolId ||
      !this.props.order_setting ||
      !this.props.order_setting[symbolId.toUpperCase()]
    )
      return 0;
    let fee = this.props.order_setting[symbolId.toUpperCase()];
    fee = fee ? fee["orderFee"] : null;
    const maxFee = fee
      ? Math.max(fee["takerFeeRate"], fee["makerFeeRate"])
      : CONST.fee;
    return maxFee;
  };
  /**
   * 输入框判断
   * 1、价格精度判断，
   * 2、数量精度
   * 3、金额精度
   */
  handleChange(e) {
    const t = e.target;
    const n = t.name;
    const from = t.from; // 盘口点击传过来的值
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
        type: "future/handleChange",
        payload: data,
      });
      this.setState({
        buy_progress: 0,
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

      // 重新计算最大值
      data["buy_max"] = this.getMax("BUY", d);

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

      this.setState({
        buy_progress: data["buy_progress"],
        buy_price: {
          msg: "",
        },
        buy_other: { msg: "" },
        buy_auto: true,
      });
    }
    // 计划委托 价格
    if (n == "buy_trigger_price") {
      let d = v ? (Number(v) >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(
        `${d}`,
        CONST["depth"][this.props.min_price_precision]
      );
      data[n] = d;
      this.setState({
        buy_trigger_price: { msg: "" },
        buy_other: { msg: "" },
      });
    }
    // 买入 杠杆
    if (n == "buy_leverage") {
      let d = v;
      d = this.fix_digits(`${d}`, CONST.lever_decimal);
      // 写入本地
      // window.localStorage[
      //   this.props.match.params.symbolId.toUpperCase() +
      //     this.props.order_choose +
      //     "buy_leverage"
      // ] = d;
      data[n] = d;
      this.closeLever.bind(this, "buy_lever");
    }
    // 买入数量
    // 精度判断,重置进度条
    // <= max
    if (n == "buy_quantity") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, this.props.base_precision);
      let progress = 0;
      const buy_max = this.getMax("BUY");
      if (d && Number(buy_max) && this.props.buy_price) {
        progress = Math.min(
          100,
          math
            .chain(d)
            .divide(buy_max)
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
      // 由于数据变化，前端计算的数量最大值与后端计算的最大值可能不同，数量输入框不能按照前端计算的最大值进行限制,
      if (d && buy_max && d - buy_max > 0 && from == "handicap") {
        d = Number(buy_max);
        d = this.fix_digits(d, this.props.base_precision);
      }
      data = {
        [n]: d || d === 0 ? d : "",
        buy_progress: progress,
        buy_max: buy_max,
      };

      this.setState({
        buy_progress: progress,
        buy_quantity: {
          msg: "",
        },
        buy_other: { msg: "" },
      });
    }

    // 卖出价格
    // 精度判断
    // <= max
    if (n == "sale_price") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, CONST["depth"][this.props.min_price_precision]);
      data[n] = d;

      // 重新计算最大值
      data["sale_max"] = this.getMax("SELL", d);

      // 如果有数量，重新计算进度条的值
      data["sale_progress"] = 0;
      if (
        (Number(this.props.sale_quantity) ||
          Number(this.props.sale_quantity) === 0) &&
        data["sale_max"]
      ) {
        let progress = Number(data["sale_max"])
          ? math
              .chain(this.props.sale_quantity)
              .divide(data["sale_max"])
              .multiply(100)
              .format({ notation: "fixed" })
              .done()
          : 0;
        progress = Math.max(0, Math.min(100, progress));
        data["sale_progress"] = progress;
      }

      this.setState({
        sale_progress: data.sale_progress,
        sale_price: {
          msg: "",
        },
        sale_other: { msg: "" },
        sale_auto: true,
      });
    }
    // 卖出 杠杆
    if (n == "sale_leverage") {
      let d = v;
      d = this.fix_digits(`${d}`, CONST.lever_decimal);
      // 写入本地
      // window.localStorage[
      //   this.props.match.params.symbolId.toUpperCase() +
      //     this.props.order_choose +
      //     "sale_leverage"
      // ] = d;
      data[n] = d;
      this.closeLever.bind(this, "sale_lever");
    }
    // 计划委托 卖出价格
    if (n == "sale_trigger_price") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, CONST["depth"][this.props.min_price_precision]);
      data[n] = d;
      this.setState({
        sale_trigger_price: { msg: "" },
        sale_other: { msg: "" },
      });
    }
    // 卖出数量
    // 精度判断
    // <= max
    if (n == "sale_quantity") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, this.props.base_precision);
      let progress = 0;
      const sale_max = this.getMax("SELL");
      if (d && Number(sale_max)) {
        progress = Math.min(
          100,
          math
            .chain(d)
            .divide(sale_max)
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
      if (d && sale_max && d - sale_max > 0 && from == "handicap") {
        d = Number(sale_max);
        d = this.fix_digits(d, this.props.base_precision);
      }
      data = {
        [n]: d,
        sale_progress: progress,
        sale_max: sale_max,
      };
      this.setState({
        sale_progress: progress,
        sale_quantity: {
          msg: "",
        },
        sale_other: { msg: "" },
      });
    }
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        ...data,
      },
    });
  }

  /**
   * 计算最大值
   * @param {string} side BUY|SELL
   * @param {string} _price 价格,非必填
   * @return {number}
   * order_choose == 1 平仓规则
   * side == BUY  max = future_tradeable[symbolId][shortAvailable]
   * side == SELL max = future_tradeable[symbolId][longAvailable]
   * order_choose == 0 开仓规则
   * price_type = 0 限价， max = (可用保证金*杠杠)/(价格*合约乘数)
   * price_type = 1 市价, max = (可用保证金*杠杠)/(最新价*(1+x)*合约乘数); 后台配置市价浮动范围marketPriceRange y=[-0.05,0.04]; 开仓买入,平仓卖出 x= y[1]; 开仓卖出,平仓买入 x = y[0];
   * price_type = 2 对手价, max = (可用保证金*杠杠)/(x*合约乘数); 开仓买入 x=卖1; 开仓卖出 x=买1； 平仓买入 x = 买1； 平仓卖出 x = 卖1；
   * price_type = 3 排队价, max = (可用保证金*杠杠)/(x*合约乘数); 开仓买入 x=买1; 开仓卖出 x=卖1； 平仓买入 x = 卖1； 平仓卖出 x = 买1；
   * price_type = 4 超价, max = (可用保证金*杠杠)/( (x + y)**合约乘数 );  后台配置超价浮动范围 overPriceRange z=[-0.05,0.04]； 开仓买入 x= 卖1, y=z[1]； 开仓卖出 x = 买1, y = z[0]； 平仓买入 x=买1,y=z[0]； 平仓卖出 x=卖1,y=z[1]；
   *
   * 反向合约
   * 价格 = 1/价格
   */
  getMax(side, _price, _abailable) {
    if (!side) return 0;
    const symbolId = (this.props.match.params.symbolId || "").toUpperCase();
    if (!symbolId) return 0;
    // 平仓
    if (this.props.order_choose == 1) {
      const available = this.props.future_tradeable[symbolId];
      let v = 0;
      if (side == "BUY") {
        v =
          available && available.shortAvailable ? available.shortAvailable : 0;
      } else {
        v = available && available.longAvailable ? available.longAvailable : 0;
      }
      return v;
    }
    // 价格类型,限价，市价等
    const price_type =
      side == "BUY" ? this.props.buy_price_type : this.props.sale_price_type;

    // 价格
    let price =
      _price || (side == "BUY" ? this.props.buy_price : this.props.sale_price);
    // 杠杠
    const leverage =
      side == "BUY" ? this.props.buy_leverage : this.props.sale_leverage;

    if (!price || !leverage) return 0;

    // 可用保证金
    const coinAvailable =
      _abailable ||
      (this.props.future_tradeable &&
      this.props.future_tradeable[symbolId] &&
      this.props.future_tradeable[symbolId]["profitLoss"]
        ? this.props.future_tradeable[symbolId]["profitLoss"]["coinAvailable"]
        : 0);
    if (!coinAvailable) return 0;
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const merged_depth = WSDATA.getData("mergedDepth_source");
    const q = symbol_quote[symbolId] || {};
    // 最新价
    let c = q.c;
    // 永续合约信息
    let symbol_info = this.props.config.symbols_obj.all[symbolId];

    // 反向合约
    if (symbol_info.isReverse) {
      price = 1 / price;
    }
    // 合约乘数
    const contractMultiplier = symbol_info
      ? symbol_info.baseTokenFutures.contractMultiplier
      : "";
    if (!contractMultiplier) return 0;
    // 开，平仓选项
    const s = this.props.order_choose;
    let v = 0;
    // 限价
    if (price_type == 0) {
      v = helper.digits(
        (coinAvailable * leverage) / (price * contractMultiplier),
        8
      );
    }
    // 市价
    if (price_type == 1) {
      const marketPriceRange = symbol_info
        ? symbol_info.baseTokenFutures.marketPriceRange
        : [0, 0];
      if (!c) return 0;

      const x =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? marketPriceRange[1]
          : marketPriceRange[0];
      let y = c * (1 + Number(x));
      // 反向合约
      if (symbol_info.isReverse) {
        //c = 1 / c;
        y = 1 / y;
      }

      v = helper.digits(
        (coinAvailable * leverage) / (y * contractMultiplier),
        8
      );
    }
    const aggTrade_data =
      merged_depth[
        this.props.exchange_id +
          "." +
          this.props.symbol_id +
          this.props.aggTrade_digits
      ] || {};
    // 对手价
    if (price_type == 2) {
      const sell = aggTrade_data.a || [];
      const buy = aggTrade_data.b || [];
      const x =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? sell[0]
            ? symbol_info.isReverse
              ? 1 / sell[0][0]
              : sell[0][0]
            : 0
          : buy[0]
          ? symbol_info.isReverse
            ? 1 / buy[0][0]
            : buy[0][0]
          : 0;
      if (!x) return 0;
      v = helper.digits(
        (coinAvailable * leverage) / (x * contractMultiplier),
        8
      );
    }
    // 排队价
    if (price_type == 3) {
      const sell = aggTrade_data.a || [];
      const buy = aggTrade_data.b || [];
      const x =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? buy[0]
            ? symbol_info.isReverse
              ? 1 / buy[0][0]
              : buy[0][0]
            : 0
          : sell[0]
          ? symbol_info.isReverse
            ? 1 / sell[0][0]
            : sell[0][0]
          : 0;
      if (!x) return 0;

      v = helper.digits(
        (coinAvailable * leverage) / (x * contractMultiplier),
        8
      );
    }
    // 超价
    if (price_type == 4) {
      const overPriceRange = symbol_info
        ? symbol_info.baseTokenFutures.overPriceRange
        : [0, 0];
      const sell = aggTrade_data.a || [];
      const buy = aggTrade_data.b || [];

      let x =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? sell[0] && sell[0][0]
            ? sell[0][0]
            : 0
          : buy[0] && buy[0][0]
          ? buy[0][0]
          : 0;
      if (!x) return 0;
      const y =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? overPriceRange[1]
          : overPriceRange[0];
      if (symbol_info.isReverse) {
        x = 1 / (Number(x) + Number(y));
      }
      v = helper.digits(
        (coinAvailable * leverage) / (Number(x) * contractMultiplier),
        8
      );
    }
    return v;
  }
  /**
   * 获取当前价格,用于计算
   * @param {string} side : BUY|SELL
   * @param {number} type : 0,1,2,3,4,5
   * @return {number}
   */
  getPrice = (side, type) => {
    let price = 0;
    const s = this.props.order_choose;
    const symbolId = (this.props.match.params.symbolId || "").toUpperCase();
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const merged_depth = WSDATA.getData("mergedDepth_source");
    const q = symbol_quote[symbolId] || {};
    // 永续合约信息
    let symbol_info = this.props.config.symbols_obj.all[symbolId] || {
      baseTokenFutures: {},
    };
    // 限价
    if (type == 0) {
      price = side == "BUY" ? this.props.buy_price : this.props.sale_price;
    }
    // 市价
    if (type == 1 && q.c) {
      const marketPriceRange =
        symbol_info && symbol_info.baseTokenFutures
          ? symbol_info.baseTokenFutures.marketPriceRange
          : [0, 0];
      const x =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? marketPriceRange[1]
          : marketPriceRange[0];
      price = q.c * (1 + Number(x));
    }
    const aggTrade_data =
      merged_depth[
        this.props.exchange_id +
          "." +
          this.props.symbol_id +
          this.props.aggTrade_digits
      ] || {};
    // 对手价
    if (type == 2) {
      const sell = aggTrade_data.a || [];
      const buy = aggTrade_data.b || [];
      price = buy[0] ? buy[0][0] : 0;
      if (side == "BUY") {
        price = sell[0] ? sell[0][0] : 0;
      }
    }
    // 排队价
    if (type == 3) {
      const sell = aggTrade_data.a || [];
      const buy = aggTrade_data.b || [];
      price = buy[0] ? buy[0][0] : 0;
      if (side == "SELL") {
        price = sell[0] ? sell[0][0] : 0;
      }
    }
    // 超价
    if (type == 4) {
      const overPriceRange = symbol_info
        ? symbol_info.baseTokenFutures.overPriceRange
        : [0, 0];
      const y =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? overPriceRange[1]
          : overPriceRange[0];
      const sell = aggTrade_data.a || [];
      const buy = aggTrade_data.b || [];
      price = buy[0] ? buy[0][0] : "";
      if (side == "BUY") {
        price = sell[0] ? sell[0][0] : "";
      }
      if (price && Number(y)) {
        price = Number(price) + Number(y);
      }
    }
    return price;
  };
  // 杠杠blur检查范围
  leverBlurChange = (name, levers) => (e) => {
    let value = this.props[name];
    if (!levers.length)
      return setTimeout(() => {
        this.closeLever("buy_lever");
        this.closeLever("sale_lever");
      }, 200);
    if (Number(value) < Number(levers[0])) {
      value = levers[0];
      this.props.dispatch({
        type: "future/handleChange",
        payload: {
          [name]: value,
        },
      });
    }
    if (Number(value) > Number(levers[levers.length - 1])) {
      value = levers[levers.length - 1];
      this.props.dispatch({
        type: "future/handleChange",
        payload: {
          [name]: value,
        },
      });
    }
    window.localStorage[
      this.props.match.params.symbolId.toUpperCase() +
        this.props.order_choose +
        name
    ] = value;
    setTimeout(() => {
      this.closeLever("buy_lever");
      this.closeLever("sale_lever");
    }, 200);
  };
  focus(name, isFocus) {
    this.setState({
      [name]: isFocus,
    });
  }
  progressChange(n, v, sliderValue) {
    //window.console.log(this.props.buy_max);
    if (n == "buy_progress") {
      const buy_max = this.getMax("BUY");
      if (!Number(buy_max)) return;
      this.setState({
        buy_progress: sliderValue,
      });
      clearTimeout(progress_timer);
      progress_timer = setTimeout(() => {
        this.props.dispatch({
          type: "future/handleChange",
          payload: {
            [n]: sliderValue,
            buy_quantity: sliderValue
              ? helper.digits(
                  math
                    .chain(math.bignumber(sliderValue))
                    .divide(100)
                    .multiply(math.bignumber(buy_max))
                    .format({ notation: "fixed" })
                    .done(),
                  this.props.base_precision
                )
              : "",
          },
        });
      }, 10);
    }
    if (n == "sale_progress") {
      const sale_max = this.getMax("SELL");
      if (!Number(sale_max)) return;
      this.setState({
        sale_progress: sliderValue,
      });
      clearTimeout(progress_timer);
      progress_timer = setTimeout(() => {
        this.props.dispatch({
          type: "future/handleChange",
          payload: {
            [n]: sliderValue,
            sale_quantity: sliderValue
              ? helper.digits(
                  math
                    .chain(math.bignumber(sliderValue))
                    .divide(100)
                    .multiply(math.bignumber(sale_max))
                    .format({ notation: "fixed" })
                    .done(),
                  this.props.base_precision
                )
              : "",
          },
        });
      }, 10);
    }
  }
  // 关闭杠杆弹层
  closeLever = (key, e) => {
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        [key]: null,
      },
    });
  };
  // 打开杠杆弹层
  openMargin = (key, e) => {
    this.setState({
      width: document.querySelector(".i1").offsetWidth,
    });
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        [key]: e.currentTarget,
      },
    });
  };
  // 计算杠杠下拉列表
  // 默认杠杠列表，如：[5,10,20,50,100,200]
  // 根据当前风险限额的起始保证金率计算最大杠杆值 maxLever = 1/initialMargin, 保留2位小数, 假如 maxLever = 33.33
  // 当前杠杆列表 = [5,10,20,33.33]
  // type = BUY_OPEN|SELL_OPEN
  leversList = (type) => {
    const symbolId = (this.props.match.params.symbolId || "").toUpperCase();

    // 杠杆列表
    const symbol_info = this.props.config.symbols_obj.all[symbolId] || {};
    // 风险限额列表
    let defaultLevers = symbol_info.baseTokenFutures
      ? symbol_info.baseTokenFutures.levers
      : [];

    if (!type) {
      return defaultLevers;
    }
    // 当前永续合约用户的配置信息
    let symbol_setting = this.props.order_setting[symbolId] || {};
    let riskLimits = symbol_setting["riskLimit"] || [];
    if (!riskLimits.length) {
      return defaultLevers;
    }
    let riskLimit = null;
    riskLimits.map((item) => {
      if (item.side == type) {
        riskLimit = item;
      }
    });
    if (!riskLimit) {
      return defaultLevers;
    }

    let maxLever = math
      .chain(1)
      .divide(math.bignumber(riskLimit.initialMargin))
      .format({ notation: "fixed" })
      .done();
    maxLever = Number(helper.digits(maxLever, CONST.lever_decimal));
    let v = [];
    v.push(maxLever);
    defaultLevers.map((item) => {
      if (maxLever - item > 0) {
        v.push(item);
      }
    });
    v.sort((a, b) => (a - b > 0 ? 1 : -1));
    return v;
  };
  changeProps = (obj, e) => {
    this.props.dispatch({
      type: "future/handleChange",
      payload: obj,
    });
  };
  // 开发风险限额
  changeRisk = (key) => (e) => {
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        modal_risk: true,
        key_risk: key,
      },
    });
  };
  // 修改价格类型
  changePriceType = async (name, v) => {
    // const target = e.target;
    // const v = target.value;
    // const name = target.name;
    let data = {
      [name]: v,
      [name + "_modal"]: false,
    };
    // 根据类型，修改价格框的值
    if (Number(v) > 0) {
      if (name.indexOf("buy") > -1) {
        data.buy_price = this.props.intl.formatMessage({
          id: this.props.price_types_desc[v],
        });
      }
      if (name.indexOf("sale") > -1) {
        data.sale_price = this.props.intl.formatMessage({
          id: this.props.price_types_desc[v],
        });
      }
    } else {
      const symbol_quote = WSDATA.getData("symbol_quote_source");
      const symbolId = (this.props.match.params.symbolId || "").toUpperCase();
      const q = symbol_quote[symbolId] || {};
      if (name.indexOf("buy") > -1) {
        data.buy_price =
          q && q.c ? helper.digits(q.c, Number(this.props.max_digits)) : "";
      }
      if (name.indexOf("sale") > -1) {
        data.sale_price =
          q && q.c ? helper.digits(q.c, Number(this.props.max_digits)) : "";
      }
    }
    // 获取不到当前模式的价格时，进行提示
    const side = /buy/i.test(name) ? "BUY" : "SELL";
    const price = this.getPrice(side, Number(v));
    let msg = "";
    if (!price) {
      switch (Number(v)) {
        case 1:
          msg = this.props.intl.formatMessage({ id: "暂无市价" });
          break;
        case 2:
          msg = this.props.intl.formatMessage({ id: "暂无对手价" });
          break;
        case 3:
          msg = this.props.intl.formatMessage({ id: "暂无排队价" });
          break;
        case 4:
          msg = this.props.intl.formatMessage({ id: "暂无超价" });
          break;
      }
    }
    this.setState({
      [name.indexOf("buy") > -1 ? "buy_price" : "sale_price"]: {
        msg: msg,
      },
    });
    await this.props.dispatch({
      type: "future/handleChange",
      payload: data,
    });
    // 修改价格类型后，重新计算最大值
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        buy_max: this.getMax("BUY"),
        sale_max: this.getMax("SELL"),
      },
    });
  };
  // 下拉修改杠杠值
  leverageChange = (name, value, e) => {
    window.localStorage[
      this.props.match.params.symbolId.toUpperCase() +
        +this.props.order_choose +
        name
    ] = value;
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        [name]: value,
      },
    });
    this.closeLever("buy_lever");
    this.closeLever("sale_lever");
  };
  // 需求变更：成本改为保证金；成本=起始保证金 + 开仓手续费； 保证金=起始保证金；
  // 计算成本(委托保证金) = 起始保证金 + 开仓手续费
  // 起始保证金 = (反向合约 ? 1/价格 : 价格) * 合约乘数 * 数量 * 起始保证金率(1/杠杠)[8位小数,向上进位]
  // 开仓手续费 = (反向合约 ? 1/价格 : 价格) * 合约乘数 * 数量 * 费率(maker,taker取最大值)
  // price = 价格
  // quantity = 数量
  // type = 方向 BUY_OPEN/SELL_OPEN
  // return [值,法币符号,法币值,起始保证金];
  cost = (quantity, type) => {
    let suffix = (
      window.WEB_CONFIG.supportLanguages.find(
        (list) => list.lang == window.localStorage.unit
      ) || { suffix: "" }
    ).suffix;
    const side = type.replace("_OPEN", "");
    const price_type =
      side == "BUY" ? this.props.buy_price_type : this.props.sale_price_type;
    let price = this.getPrice(side, price_type);
    if (
      !Boolean(Number(price)) ||
      !Boolean(Number(quantity)) ||
      !type ||
      this.props.order_choose == 1
    ) {
      return ["--", suffix, "--", ""];
    }
    const symbolId = (this.props.match.params.symbolId || "").toUpperCase();
    const order_setting = this.props.order_setting;

    if (!symbolId || !order_setting || !order_setting[symbolId]) {
      return ["--", suffix, "--", ""];
    }
    const riskLimits = order_setting[symbolId];
    if (!riskLimits || !riskLimits.riskLimit) {
      return ["--", suffix, "--", ""];
    }
    let symbol_info = this.props.config.symbols_obj.all[symbolId];
    if (!symbol_info) {
      return ["--", suffix, "--", ""];
    }
    // 反向合约
    if (symbol_info.isReverse) {
      price = 1 / price;
    }
    let riskLimit = {}; // 当前方向的风险数据
    riskLimits.riskLimit.map((item) => {
      if (item.side == type) {
        riskLimit = item;
      }
    });
    const initialMargin = riskLimit.initialMargin; // 起始保证金率,最小值
    const leverage =
      type == "BUY_OPEN" ? this.props.buy_leverage : this.props.sale_leverage;
    let currentMargin = leverage
      ? math
          .chain(1)
          .divide(math.bignumber(leverage))
          .format({ notation: "fixed" })
          .done()
      : 0; // 当前杠杠下的保证金率
    // 当前保证金率，保留8位小数，向上取整;
    currentMargin = helper.digits2(currentMargin, CONST.initialMargin);
    const contractMultiplier = symbol_info.baseTokenFutures.contractMultiplier; // 合约乘数
    //const fee = this.getFee(); // 费率
    const fee = 0; // 需求变更，仅展示保证金
    const marginPrecision =
      CONST["depth"][symbol_info.baseTokenFutures.marginPrecision]; // 保证金精度
    const v = math
      .chain(math.bignumber(currentMargin))
      .add(math.bignumber(fee))
      .multiply(math.bignumber(contractMultiplier))
      .multiply(math.bignumber(price))
      .multiply(math.bignumber(quantity))
      .format({ notation: "fixed" })
      .done();
    const _v = helper.digits(v, marginPrecision);
    const coin = symbol_info.quoteTokenId;
    const __v = helper.currencyValue(
      this.props.rates,
      _v,
      coin,
      window.localStorage.unit,
      true
    );
    // 保证金
    let v2 = math
      .chain(math.bignumber(currentMargin))
      .multiply(math.bignumber(contractMultiplier))
      .multiply(math.bignumber(price))
      .multiply(math.bignumber(quantity))
      .format({ notation: "fixed" })
      .done();
    v2 = helper.digits(v2, marginPrecision);
    return [_v, __v[2], __v[1], v2];
  };
  valueLabelFormat(value) {
    return `${value.toFixed(0)}%`;
  }
  changeRadioCallback(price) {
    this.setState({ loading: false });
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        buy_price_type: 0,
        buy_price: price || "",
        sale_price_type: 0,
        sale_price: price || "",
      },
    });
  }
  handleRadioChange = (value, price) => {
    let symbolId = (this.props.match.params.symbolId || "").toUpperCase();
    if (!symbolId) return;
    this.setState({
      loading: true,
      orderSetting:
        value == this.state.orderSetting ? CONST.time_in_force : value,
    });
    if (price && Number(price)) {
      this.changeRadioCallback(price);
    }
    // const order_setting = this.props.order_setting[symbolId] || {};
    // let orderSetting = order_setting.orderSetting || {};
    // orderSetting["time_in_force"] = value;
    // let old = {};
    // old.time_in_force = orderSetting.timeInForce;
    // old.is_confirm = orderSetting.isConfirm;
    // if (currentValue == value) {
    //   value = "GTC";
    // }
    // if (this.props.userinfo.userId) {
    //   this.props.dispatch({
    //     type: "future/set_order_setting",
    //     payload: {
    //       symbol_id: symbolId,
    //       ...old,
    //       time_in_force: value,
    //     },
    //     dispatch: this.props.dispatch,
    //     callback: () => {
    //       this.changeRadioCallback(price);
    //     },
    //   });
    // } else {
    //   this.props.dispatch({
    //     type: "future/update_order_setting",
    //     payload: {
    //       timeInForce: value,
    //       isConfirm: "1",
    //     },
    //     callback: () => {
    //       this.changeRadioCallback(price);
    //     },
    //   });
    // }
  };
  render() {
    const { classes, hasAnimation, ...otherProps } = this.props;
    const token1_name = this.props.intl.formatMessage({
      id: "张",
    });
    let symbolId = this.props.match.params.symbolId;
    if (!symbolId) {
      return <div />;
    }
    symbolId = symbolId.toUpperCase();
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const tokenQuote = symbol_quote[symbolId] || {};

    // 当前永续合约基础信息
    let symbol_info = this.props.config.symbols_obj.all[symbolId];

    // 当前永续合约用户的配置信息
    let symbol_setting = this.props.userinfo.userId
      ? this.props.order_setting[symbolId] || {}
      : this.props.order_setting;
    const isConfirm =
      symbol_setting && symbol_setting.orderSetting
        ? Boolean(symbol_setting.orderSetting.isConfirm)
        : false;
    // 风险限额列表
    let futuresRiskLimits = symbol_info.baseTokenFutures.riskLimits;
    let token2_name = symbol_info.quoteTokenName;
    // 杠杆列表
    let futuresLevers = symbol_info.baseTokenFutures
      ? symbol_info.baseTokenFutures.levers
      : [];
    // 风险总额信息,风险限额右值
    let buy_risk_info = {};
    let sale_risk_info = {};
    futuresRiskLimits.map((item) => {
      if (item.riskLimitId == this.props.buy_risk) {
        buy_risk_info = item;
      }
      if (item.riskLimitId == this.props.sale_risk) {
        sale_risk_info = item;
      }
    });
    // 当前可交易信息：风险额,风险限额左值
    let tradeable = this.props.future_tradeable[symbolId] || {};

    const {
      buy_lever,
      sale_lever,
      buy_price_type_modal,
      sale_price_type_modal,
    } = this.props;
    const displayTokenId =
      symbol_info.baseTokenFutures &&
      symbol_info.baseTokenFutures.displayTokenId
        ? symbol_info.baseTokenFutures.displayTokenId
        : "";
    const buy_price_rates =
      Number(this.props.buy_price) &&
      symbol_info.baseTokenFutures &&
      symbol_info.baseTokenFutures.displayTokenId
        ? helper.currencyValue(
            this.props.rates,
            this.props.buy_price,
            symbol_info.baseTokenFutures.displayTokenId,
            window.localStorage.unit,
            true
          )
        : ["", "", ""];
    const sale_price_rates =
      Number(this.props.sale_price) &&
      symbol_info.baseTokenFutures &&
      symbol_info.baseTokenFutures.displayTokenId
        ? helper.currencyValue(
            this.props.rates,
            this.props.sale_price,
            symbol_info.baseTokenFutures.displayTokenId,
            window.localStorage.unit,
            true
          )
        : ["", "", ""];
    const buy_trigger_rates =
      Number(this.props.buy_trigger_price) &&
      symbol_info.baseTokenFutures &&
      symbol_info.baseTokenFutures.displayTokenId
        ? helper.currencyValue(
            this.props.rates,
            this.props.buy_trigger_price,
            symbol_info.baseTokenFutures.displayTokenId,
            window.localStorage.unit,
            true
          )
        : ["", "", ""];
    const sale_trigger_rates =
      Number(this.props.sale_trigger_price) &&
      symbol_info.baseTokenFutures &&
      symbol_info.baseTokenFutures.displayTokenId
        ? helper.currencyValue(
            this.props.rates,
            this.props.sale_trigger_price,
            symbol_info.baseTokenFutures.displayTokenId,
            window.localStorage.unit,
            true
          )
        : ["", "", ""];
    // buy 成本
    const buy_cost = this.cost(
      //this.props.buy_price,
      this.props.buy_quantity,
      "BUY_OPEN"
    );
    // sell 成本
    const sale_cost = this.cost(
      //this.props.sale_price,
      this.props.sale_quantity,
      "SELL_OPEN"
    );
    const orderSetting = symbol_setting.orderSetting || {
      //isPassiveOrder: "1",
      timeInForce: "GTC",
      isConfirm: "1",
    };
    const buy_max = this.getMax("BUY");
    const sale_max = this.getMax("SELL");
    const buy_amount = Number(buy_max)
      ? helper.digits(
          math
            .chain(math.bignumber(100))
            .divide(100)
            .multiply(math.bignumber(buy_max))
            .format({ notation: "fixed" })
            .done(),
          this.props.base_precision
        )
      : 0;
    const sell_amount = Number(sale_max)
      ? helper.digits(
          math
            .chain(math.bignumber(100))
            .divide(100)
            .multiply(math.bignumber(sale_max))
            .format({ notation: "fixed" })
            .done(),
          this.props.base_precision
        )
      : 0;
    return (
      <div className={classes.exchange}>
        <div className={classes.limitTrading}>
          <Grid container justify="space-between" style={{ padding: "0 12px" }}>
            <Grid item>
              <ButtonGroup className={classes.tradeBtn}>
                <Button
                  className={this.props.buy_type == 0 ? "on" : ""}
                  style={{ whiteSpace: "nowrap" }}
                  onClick={this.changeProps.bind(this, {
                    buy_type: 0,
                    buy_trigger_price: "",
                    buy_price_type: 0,
                    buy_price: tokenQuote.c || "",
                    sale_type: 0,
                    sale_trigger_price: "",
                    sale_price_type: 0,
                    sale_price: tokenQuote.c || "",
                  })}
                >
                  {this.props.intl.formatMessage({ id: "普通委托" })}
                </Button>
                <Button
                  className={this.props.buy_type == 1 ? "on" : ""}
                  style={{ whiteSpace: "nowrap" }}
                  onClick={this.changeProps.bind(this, {
                    buy_type: 1,
                    buy_trigger_price: "",
                    buy_price_type: 0,
                    buy_price: tokenQuote.c || "",
                    sale_type: 1,
                    sale_trigger_price: "",
                    sale_price_type: 0,
                    sale_price: tokenQuote.c || "",
                  })}
                >
                  {this.props.intl.formatMessage({ id: "计划委托" })}
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item className={classes.tradeDesc}>
              <span>{this.props.intl.formatMessage({ id: "逐仓" })}</span>
              <TooltipCommon
                title={this.props.intl.formatMessage({
                  id: "交易单位",
                })}
                placement="top"
                mode={true}
              >
                <span>{this.props.intl.formatMessage({ id: "张" })}</span>
              </TooltipCommon>
            </Grid>
          </Grid>
          {this.props.buy_type == 0 ? (
            <div className={classes.radioGroup}>
              <div
                className={classnames(
                  "item",
                  this.state.orderSetting == "MAKER" ? "on" : ""
                )}
                onClick={this.handleRadioChange.bind(
                  this,
                  "MAKER",
                  tokenQuote.c
                )}
              >
                <em>
                  <Iconfont type="checkedRadio2" size="14" />
                </em>
                <TooltipCommon
                  title={this.props.intl.formatMessage({
                    id:
                      "只做Maker (Post only) 订单不会立刻在市场成交，保证用户始终为Maker, 如果委托会立即与已有委托成交，那么该委托会被取消。",
                  })}
                  placement="top"
                  mode={true}
                >
                  <label>
                    {this.props.intl.formatMessage({
                      id: "只做Maker",
                    })}
                  </label>
                </TooltipCommon>
              </div>
              <div
                className={classnames(
                  "item",
                  this.state.orderSetting == "IOC" ? "on" : ""
                )}
                onClick={this.handleRadioChange.bind(this, "IOC", tokenQuote.c)}
              >
                <em>
                  <Iconfont type="checkedRadio2" size="14" />
                </em>
                <TooltipCommon
                  title={this.props.intl.formatMessage({
                    id:
                      "IOC (Immediately or Cancel) 订单若不能立即成交则未成交的部分立即取消。",
                  })}
                  placement="top"
                  mode={true}
                >
                  <label>
                    {this.props.intl.formatMessage({
                      id: "IOC",
                    })}
                  </label>
                </TooltipCommon>
              </div>
              <div
                className={classnames(
                  "item",
                  this.state.orderSetting == "FOK" ? "on" : ""
                )}
                onClick={this.handleRadioChange.bind(this, "FOK", tokenQuote.c)}
              >
                <em>
                  <Iconfont type="checkedRadio2" size="14" />
                </em>
                <TooltipCommon
                  title={this.props.intl.formatMessage({
                    id: "FOK (Fill or Kill) 订单若不能全部成交则立即全部取消。",
                  })}
                  placement="top"
                  mode={true}
                >
                  <label>
                    {this.props.intl.formatMessage({
                      id: "FOK",
                    })}
                  </label>
                </TooltipCommon>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className={classes.form}>
            {/* <div className={classes.t1}>
              <Grid container justify="space-between">
                <Grid item>
                  {this.props.order_choose == 0 ? (
                    <div
                      className={classes.leverBox}
                      onClick={this.openMargin.bind(this, "buy_lever")}
                    >
                      <InputBase
                        value={this.props.buy_leverage}
                        name="buy_leverage"
                        autoComplete="off"
                        startAdornment={
                          <span>
                            {this.props.intl.formatMessage({ id: "杠杆" })}:
                          </span>
                        }
                        endAdornment={<span>X</span>}
                        onChange={this.handleChange}
                        onBlur={this.leverBlurChange(
                          "buy_leverage",
                          this.leversList("BUY_OPEN")
                        )}
                        className={classes.lever}
                      />
                      <Iconfont
                        aria-owns={buy_lever ? "buy_lever" : undefined}
                        type="arrowDown"
                        aria-haspopup="true"
                        size="20"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </div> */}
            {this.props.buy_type == 1 ? (
              <div className={classes.t2}>
                <TooltipCommon
                  open={Boolean(this.state.buy_trigger_price.msg)}
                  placement="top"
                  title={this.state.buy_trigger_price.msg}
                  mode={true}
                >
                  <em />
                </TooltipCommon>
                <OutlinedInput
                  error={this.state.buy_trigger_price.msg ? true : false}
                  name="buy_trigger_price"
                  value={this.props.buy_trigger_price}
                  onChange={this.handleChange}
                  onFocus={this.focus.bind(this, "buy_trigger_focus", true)}
                  onBlur={this.focus.bind(this, "buy_trigger_focus", false)}
                  autoComplete="off"
                  placeholder={
                    this.props.intl.formatMessage({
                      id: "触发价格",
                    }) + `(${displayTokenId})`
                  }
                  classes={{
                    root: classes.inputRoot,
                    focused: classes.inputFocused,
                    error: classes.inputError,
                  }}
                  startAdornment={
                    this.props.buy_trigger_price &&
                    this.state.buy_trigger_focus ? (
                      <p className={classes.startAdorn}>
                        {this.props.rates[this.props.token2]
                          ? `≈ ${buy_trigger_rates[1]} ${buy_trigger_rates[2]}`
                          : ""}
                      </p>
                    ) : (
                      ""
                    )
                  }
                />
              </div>
            ) : (
              ""
            )}
            <div className={classes.t2}>
              <div className={classnames(classes.i1, "i1")}>
                <TooltipCommon
                  open={Boolean(this.state.buy_price.msg)}
                  placement="top"
                  title={this.state.buy_price.msg}
                  mode={true}
                >
                  <em />
                </TooltipCommon>
                <OutlinedInput
                  error={this.state.buy_price.msg ? true : false}
                  name="buy_price"
                  value={this.props.buy_price}
                  onChange={this.handleChange}
                  onFocus={this.focus.bind(this, "buy_focus", true)}
                  onBlur={this.focus.bind(this, "buy_focus", false)}
                  autoComplete="off"
                  disabled={Boolean(Number(this.props.buy_price_type))}
                  // placeholder={this.props.intl.formatMessage({
                  //   id: this.props.price_types_desc[
                  //     this.props.buy_price_type
                  //   ]
                  // })}
                  placeholder={
                    this.props.intl.formatMessage({
                      id: "买入价",
                    }) + `(${displayTokenId})`
                  }
                  classes={{
                    root: classes.inputRoot,
                    focused: classes.inputFocused,
                    error: classes.inputError,
                    input: hasAnimation ? classes.inputAnimation : "",
                  }}
                  startAdornment={
                    this.props.buy_price && this.state.buy_focus ? (
                      <p className={classes.startAdorn}>
                        {this.props.rates[this.props.token2]
                          ? `≈ ${buy_price_rates[1]} ${buy_price_rates[2]}`
                          : ""}
                      </p>
                    ) : (
                      ""
                    )
                  }
                  endAdornment={
                    this.props.buy_type == 0 ? (
                      // <Select
                      //   name="buy_price_type"
                      //   value={this.props.buy_price_type}
                      //   onChange={this.changePriceType}
                      //   className={classnames(classes.selectType, "select")}
                      //   MenuProps={{
                      //     classes: {
                      //       list: classes.menuList
                      //     }
                      //   }}
                      // >
                      //   {this.props.price_types.map((item, i) => {
                      //     return (
                      //       <MenuItem value={i} key={i} className={classes.menuItem}>
                      //         {this.props.intl.formatMessage({
                      //           id: this.props.price_types_desc[i]
                      //         })}
                      //       </MenuItem>
                      //     );
                      //   })}
                      // </Select>
                      <Iconfont
                        aria-owns={
                          buy_price_type_modal
                            ? "buy_price_type_modal"
                            : undefined
                        }
                        type="arrowDown"
                        aria-haspopup="true"
                        size="20"
                        className={classnames(
                          classes.priceTypeIcon,
                          Boolean(buy_price_type_modal) ? "on" : ""
                        )}
                        onClick={this.openMargin.bind(
                          this,
                          "buy_price_type_modal"
                        )}
                      />
                    ) : (
                      ""
                    )
                  }
                />
              </div>
              {this.props.order_choose == 0 ? (
                <div className={classes.i2}>
                  <div
                    className={classnames(
                      classes.leverBox,
                      Boolean(buy_lever) ? "on" : ""
                    )}
                    onClick={this.openMargin.bind(this, "buy_lever")}
                  >
                    <InputBase
                      value={this.props.buy_leverage}
                      name="buy_leverage"
                      autoComplete="off"
                      endAdornment={<span>X</span>}
                      onChange={this.handleChange}
                      onBlur={this.leverBlurChange(
                        "buy_leverage",
                        this.leversList("BUY_OPEN")
                      )}
                      className={classes.lever}
                    />
                    <Iconfont
                      aria-owns={buy_lever ? "buy_lever" : undefined}
                      type="arrowDown"
                      aria-haspopup="true"
                      size="20"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {/* <label className={classes.label}>
                {this.props.intl.formatMessage({
                  id: "价格"
                })}
                ({displayTokenId})
              </label>
              <Grid container>
                <Grid item style={{ flex: 1 }}>
                  <TextField
                    error={this.state.buy_price.msg ? true : false}
                    className={classes.input}
                    name="buy_price"
                    value={this.props.buy_price}
                    onChange={this.handleChange}
                    disabled={Boolean(Number(this.props.buy_price_type))}
                    placeholder={this.props.intl.formatMessage({
                      id: this.props.price_types_desc[
                        this.props.buy_price_type
                      ]
                    })}
                    autoComplete="off"
                    InputProps={{
                      classes: {
                        root: classes.filed,
                        disabled: classes.filed_diabled
                      }
                    }}
                  />
                </Grid>
                {this.props.buy_type == 0 ? (
                  <Grid item>
                    <Select
                      name="buy_price_type"
                      value={this.props.buy_price_type}
                      onChange={this.changePriceType}
                      className={classes.filed}
                    >
                      {this.props.price_types.map((item, i) => {
                        return (
                          <MenuItem value={i} key={i}>
                            {this.props.intl.formatMessage({
                              id: this.props.price_types_desc[i]
                            })}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>

              <FormHelperText className={classes.msg} error>
                <span>{this.state.buy_price.msg}</span>
                <span>{`≈ ${buy_price_rates[0]}${buy_price_rates[1]}`}</span>
              </FormHelperText> */}
            </div>
            <div className={classes.t2}>
              <TooltipCommon
                open={Boolean(this.state.buy_quantity.msg)}
                placement="top"
                title={this.state.buy_quantity.msg}
                mode={true}
              >
                <em />
              </TooltipCommon>
              <OutlinedInput
                error={this.state.buy_quantity.msg ? true : false}
                name="buy_quantity"
                value={this.props.buy_quantity}
                onChange={this.handleChange}
                autoComplete="off"
                placeholder={
                  this.props.intl.formatMessage({
                    id: "买入量",
                  }) +
                  "(" +
                  token1_name +
                  ")"
                }
                classes={{
                  root: classes.inputRoot,
                  focused: classes.inputFocused,
                  error: classes.inputError,
                }}
              />
            </div>
            <div className={classes.progress}>
              <Slider
                step={1}
                marks={this.state.marks}
                value={this.state.buy_progress}
                valueLabelFormat={this.valueLabelFormat}
                onChange={this.progressChange.bind(this, "buy_progress")}
                valueLabelDisplay="auto"
                aria-labelledby="buy_progress"
                ValueLabelComponent={TooltipCommon}
              />
            </div>
            {this.props.order_choose == 0
              ? [
                  <p className={classes.amount} key="count">
                    <span>
                      {this.props.intl.formatMessage({
                        id: "可开多",
                      })}
                    </span>
                    <label>
                      {buy_amount || "--"}{" "}
                      {this.props.intl.formatMessage({ id: "张" })}
                    </label>
                  </p>,
                  <p className={classes.amount} key="margin">
                    <TooltipCommon
                      title={this.props.intl.formatMessage({
                        id: "委托或成交后所需的保证金",
                      })}
                      placement="top"
                      mode={true}
                    >
                      <span>
                        {this.props.intl.formatMessage({
                          id: "保证金",
                        })}
                      </span>
                    </TooltipCommon>
                    <label>
                      {buy_cost[0]} {token2_name} ≈ {buy_cost[2]} {buy_cost[1]}
                    </label>
                  </p>,
                ]
              : [
                  <p className={classes.amount} key="count">
                    <span>
                      {this.props.intl.formatMessage({
                        id: "可平空",
                      })}
                    </span>
                    <label>
                      {tradeable.shortAvailable && symbol_info.basePrecision
                        ? helper.digits(
                            tradeable.shortAvailable,
                            CONST["depth"][symbol_info.basePrecision]
                          )
                        : tradeable.shortAvailable || "--"}{" "}
                      {this.props.intl.formatMessage({ id: "张" })}
                    </label>
                  </p>,
                  <p className={classes.amount} key="margin" />,
                ]}
            {/* {this.props.order_choose == 0 ? (
              <p className={classes.amount}>
                <TooltipCommon
                  title={this.props.intl.formatMessage({
                    id:
                      "对于持仓量不同的用户要求不一样的维持保证金率。持仓量越大，所需要的维持保金率越高，这样可以减少重仓用户爆仓给其他用户带来减仓事件的的风险。"
                  })}
                  placement="top"
                >
                  <span className={classes.underline}>
                    {this.props.intl.formatMessage({
                      id: "风险限额"
                    })}
                  </span>
                </TooltipCommon>
                :
                <label>
                  {tradeable.longTotal || "--"} /{" "}
                  {buy_risk_info.riskLimitAmount || "--"}{" "}
                  {this.props.intl.formatMessage({ id: "张" })}{" "}
                  <Iconfont
                    type="edit"
                    size="20"
                    onClick={this.changeRisk("buy_risk")}
                  />
                </label>
              </p>
            ) : (
              ""
            )} */}
            {this.state.buy_other.msg ? (
              <FormHelperText className={classes.msg} error>
                <span>{this.state.buy_other.msg}</span>
              </FormHelperText>
            ) : (
              ""
            )}

            {this.props.userinfo.userId ? (
              this.props.loading.effects["future/createOrder"] &&
              this.props.orderStatusBUY ? (
                <Button className={classes.btn} disabled>
                  <p className={classes.btn_loading}>
                    <CircularProgress size={18} color="primary" />
                  </p>
                </Button>
              ) : this.props.option_status > 0 ? (
                <Button disabled className={classes.btn}>
                  {`${this.props.intl.formatMessage({
                    id: this.props.option_status == 1 ? "交割中" : "已交割",
                  })}`}
                </Button>
              ) : (
                <Button
                  onClick={this.orderCreate.bind(this, "BUY", true)}
                  className={classnames(classes.btn, "green")}
                >
                  {`${this.props.intl.formatMessage({
                    id: "买入",
                  })}(${this.props.intl.formatMessage({
                    id: this.props.order_choose == 0 ? "开多" : "平空",
                  })})`}
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
          <div className={classes.form}>
            {/* <div className={classes.t1}>
                <Grid container justify="space-between">
                  <Grid item>
                    {this.props.order_choose == 0 ? (
                      <div
                        className={classes.leverBox}
                        onClick={this.openMargin.bind(this, "sale_lever")}
                      >
                        <InputBase
                          value={this.props.sale_leverage}
                          name="sale_leverage"
                          onChange={this.handleChange}
                          onBlur={this.leverBlurChange(
                            "sale_leverage",
                            this.leversList("SELL_OPEN")
                          )}
                          startAdornment={
                            <span>
                              {this.props.intl.formatMessage({ id: "杠杆" })}:
                            </span>
                          }
                          autoComplete="off"
                          endAdornment={<span>X</span>}
                          className={classes.lever}
                          //onFocus={this.openMargin.bind(this, "sale_lever")}
                        />
                        <Iconfont
                          aria-owns={sale_lever ? "sale_lever" : undefined}
                          type="arrowDown"
                          aria-haspopup="true"
                          size="20"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
              </div> */}
            {this.props.sale_type == 1 ? (
              <div className={classes.t2}>
                <TooltipCommon
                  open={Boolean(this.state.sale_trigger_price.msg)}
                  placement="top"
                  title={this.state.sale_trigger_price.msg}
                  mode={true}
                >
                  <em />
                </TooltipCommon>
                <OutlinedInput
                  error={this.state.sale_trigger_price.msg ? true : false}
                  name="sale_trigger_price"
                  value={this.props.sale_trigger_price}
                  onChange={this.handleChange}
                  onFocus={this.focus.bind(this, "sale_trigger_focus", true)}
                  onBlur={this.focus.bind(this, "sale_trigger_focus", false)}
                  autoComplete="off"
                  placeholder={
                    this.props.intl.formatMessage({
                      id: "触发价格",
                    }) + `(${displayTokenId})`
                  }
                  classes={{
                    root: classes.inputRoot,
                    focused: classes.inputFocused,
                    error: classes.inputError,
                  }}
                  startAdornment={
                    this.props.sale_trigger_price &&
                    this.state.sale_trigger_focus ? (
                      <p className={classes.startAdorn}>
                        {this.props.rates[this.props.token2]
                          ? `≈ ${sale_trigger_rates[1]} ${sale_trigger_rates[2]}`
                          : ""}
                      </p>
                    ) : (
                      ""
                    )
                  }
                />
              </div>
            ) : (
              ""
            )}
            <div className={classes.t2}>
              <div className={classnames(classes.i1, "i1")}>
                <TooltipCommon
                  open={Boolean(this.state.sale_price.msg)}
                  placement="top"
                  title={this.state.sale_price.msg}
                  mode={true}
                >
                  <em />
                </TooltipCommon>
                <OutlinedInput
                  error={this.state.sale_price.msg ? true : false}
                  name="sale_price"
                  value={this.props.sale_price}
                  onChange={this.handleChange}
                  onFocus={this.focus.bind(this, "sell_focus", true)}
                  onBlur={this.focus.bind(this, "sell_focus", false)}
                  autoComplete="off"
                  disabled={Boolean(Number(this.props.sale_price_type))}
                  // placeholder={this.props.intl.formatMessage({
                  //   id: this.props.price_types_desc[
                  //     this.props.sale_price_type
                  //   ]
                  // })}
                  placeholder={
                    this.props.intl.formatMessage({
                      id: "卖出价",
                    }) + `(${displayTokenId})`
                  }
                  classes={{
                    root: classes.inputRoot,
                    focused: classes.inputFocused,
                    error: classes.inputError,
                    input: hasAnimation ? classes.inputAnimation : "",
                  }}
                  startAdornment={
                    this.props.sale_price && this.state.sell_focus ? (
                      <p className={classes.startAdorn}>
                        {this.props.rates[this.props.token2]
                          ? `≈ ${sale_price_rates[1]} ${sale_price_rates[2]}`
                          : ""}
                      </p>
                    ) : (
                      ""
                    )
                  }
                  endAdornment={
                    this.props.buy_type == 0 ? (
                      // <Select
                      //   name="sale_price_type"
                      //   value={this.props.sale_price_type}
                      //   onChange={this.changePriceType}
                      //   className={classnames(classes.selectType, "select")}
                      //   MenuProps={{
                      //     classes: {
                      //       list: classes.menuList
                      //     }
                      //   }}
                      // >
                      //   {this.props.price_types.map((item, i) => {
                      //     return (
                      //       <MenuItem value={i} key={i} className={classes.menuItem}>
                      //         {this.props.intl.formatMessage({
                      //           id: this.props.price_types_desc[i]
                      //         })}
                      //       </MenuItem>
                      //     );
                      //   })}
                      // </Select>
                      <Iconfont
                        aria-owns={
                          sale_price_type_modal
                            ? "sale_price_type_modal"
                            : undefined
                        }
                        type="arrowDown"
                        aria-haspopup="true"
                        size="20"
                        className={classnames(
                          classes.priceTypeIcon,
                          Boolean(sale_price_type_modal) ? "on" : ""
                        )}
                        onClick={this.openMargin.bind(
                          this,
                          "sale_price_type_modal"
                        )}
                      />
                    ) : (
                      ""
                    )
                  }
                />
              </div>
              {this.props.order_choose == 0 ? (
                <div className={classes.i2}>
                  <div
                    className={classnames(
                      classes.leverBox,
                      Boolean(sale_lever) ? "on" : ""
                    )}
                    onClick={this.openMargin.bind(this, "sale_lever")}
                  >
                    <InputBase
                      value={this.props.sale_leverage}
                      name="sale_leverage"
                      autoComplete="off"
                      endAdornment={<span>X</span>}
                      onChange={this.handleChange}
                      onBlur={this.leverBlurChange(
                        "sale_leverage",
                        this.leversList("SELL_OPEN")
                      )}
                      className={classes.lever}
                    />
                    <Iconfont
                      aria-owns={sale_lever ? "sale_lever" : undefined}
                      type="arrowDown"
                      aria-haspopup="true"
                      size="20"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {/* <label className={classes.label}>
                  {this.props.intl.formatMessage({
                    id: "价格"
                  })}
                  ({displayTokenId})
                </label>
                <Grid container>
                  <Grid item style={{ flex: 1 }}>
                    <TextField
                      error={this.state.sale_price.msg ? true : false}
                      className={classes.input}
                      name="sale_price"
                      value={this.props.sale_price}
                      disabled={Boolean(Number(this.props.sale_price_type))}
                      onChange={this.handleChange}
                      placeholder={this.props.intl.formatMessage({
                        id: this.props.price_types_desc[
                          this.props.sale_price_type
                        ]
                      })}
                      autoComplete="off"
                      InputProps={{
                        classes: {
                          root: classes.filed,
                          disabled: classes.filed_diabled
                        }
                      }}
                    />
                  </Grid>
                  {this.props.sale_type == 0 ? (
                    <Grid item>
                      <Select
                        name="sale_price_type"
                        value={this.props.sale_price_type}
                        onChange={this.changePriceType}
                        className={classes.filed}
                      >
                        {this.props.price_types.map((item, i) => {
                          return (
                            <MenuItem value={i} key={i}>
                              {this.props.intl.formatMessage({
                                id: this.props.price_types_desc[i]
                              })}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
                <FormHelperText className={classes.msg} error>
                  <span>{this.state.sale_price.msg}</span>
                  <span>
                    {`≈ ${sale_price_rates[0]}${sale_price_rates[1]}`}
                  </span>
                </FormHelperText> */}
            </div>
            <div className={classes.t2}>
              <TooltipCommon
                open={Boolean(this.state.sale_quantity.msg)}
                placement="top"
                title={this.state.sale_quantity.msg}
                mode={true}
              >
                <em />
              </TooltipCommon>
              <OutlinedInput
                error={this.state.sale_quantity.msg ? true : false}
                name="sale_quantity"
                value={this.props.sale_quantity}
                onChange={this.handleChange}
                autoComplete="off"
                placeholder={
                  this.props.intl.formatMessage({
                    id: "卖出量",
                  }) +
                  "(" +
                  token1_name +
                  ")"
                }
                classes={{
                  root: classes.inputRoot,
                  focused: classes.inputFocused,
                  error: classes.inputError,
                }}
              />
            </div>
            <div className={classnames(classes.progress, "red")}>
              <Slider
                step={1}
                marks={this.state.marks}
                value={this.state.sale_progress}
                valueLabelFormat={this.valueLabelFormat}
                onChange={this.progressChange.bind(this, "sale_progress")}
                valueLabelDisplay="auto"
                aria-labelledby="sale_progress"
                ValueLabelComponent={TooltipCommon}
              />
            </div>
            {this.props.order_choose == 0
              ? [
                  <p className={classes.amount} key="count1">
                    <span>
                      {this.props.intl.formatMessage({
                        id: "可开空",
                      })}
                    </span>
                    <label>
                      {sell_amount || "--"}{" "}
                      {this.props.intl.formatMessage({ id: "张" })}
                    </label>
                  </p>,
                  <p className={classes.amount} key="margin1">
                    <TooltipCommon
                      title={this.props.intl.formatMessage({
                        id: "委托或成交后所需的保证金",
                      })}
                      placement="top"
                      mode={true}
                    >
                      <span>
                        {this.props.intl.formatMessage({
                          id: "保证金",
                        })}
                      </span>
                    </TooltipCommon>
                    <label>
                      {sale_cost[0]} {token2_name} ≈ {sale_cost[2]}{" "}
                      {sale_cost[1]}
                    </label>
                  </p>,
                ]
              : [
                  <p className={classes.amount} key="count1">
                    <span>
                      {this.props.intl.formatMessage({
                        id: "可平多",
                      })}
                    </span>
                    <label>
                      {tradeable.longAvailable && symbol_info.basePrecision
                        ? helper.digits(
                            tradeable.longAvailable,
                            CONST["depth"][symbol_info.basePrecision]
                          )
                        : tradeable.longAvailable || "--"}{" "}
                      {this.props.intl.formatMessage({ id: "张" })}
                    </label>
                  </p>,
                  <p className={classes.amount} key="margin1" />,
                ]}
            {/* {this.props.order_choose == 0 ? (
                <p className={classes.amount}>
                  <TooltipCommon
                    title={this.props.intl.formatMessage({
                      id:
                        "对于持仓量不同的用户要求不一样的维持保证金率。持仓量越大，所需要的维持保金率越高，这样可以减少重仓用户爆仓给其他用户带来减仓事件的的风险。"
                    })}
                    placement="top"
                  >
                    <span className={classes.underline}>
                      {this.props.intl.formatMessage({
                        id: "风险限额"
                      })}
                    </span>
                  </TooltipCommon>
                  :
                  <label>
                    {tradeable.shortTotal || "--"} /{" "}
                    {sale_risk_info.riskLimitAmount || "--"}{" "}
                    {this.props.intl.formatMessage({ id: "张" })}{" "}
                    <Iconfont
                      type="edit"
                      size="20"
                      onClick={this.changeRisk("sale_risk")}
                    />
                  </label>
                </p>
              ) : (
                ""
              )} */}
            {this.state.sale_other.msg ? (
              <FormHelperText className={classes.msg} error>
                <span>{this.state.sale_other.msg}</span>
              </FormHelperText>
            ) : (
              ""
            )}
            {this.props.userinfo.userId ? (
              this.props.loading.effects["future/createOrder"] &&
              this.props.orderStatusSELL ? (
                <Button className={classes.btn} disabled>
                  <p className={classes.btn_loading}>
                    <CircularProgress size={18} color="primary" />
                  </p>
                </Button>
              ) : this.props.option_status > 0 ? (
                <Button disabled className={classes.btn}>
                  {`${this.props.intl.formatMessage({
                    id: this.props.option_status == 1 ? "交割中" : "已交割",
                  })}`}
                </Button>
              ) : (
                <Button
                  onClick={this.orderCreate.bind(this, "SELL", true)}
                  className={classnames(classes.btn, "red")}
                >
                  {`${this.props.intl.formatMessage({
                    id: "卖出",
                  })}(${this.props.intl.formatMessage({
                    id: this.props.order_choose == 0 ? "开空" : "平多",
                  })})`}
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
        <Popper
          open={Boolean(buy_lever)}
          anchorEl={buy_lever}
          id="buy_lever"
          onClose={this.closeLever.bind(this, "buy_lever")}
          placement="bottom-end"
          style={{ zIndex: 200 }}
        >
          <Paper className={classes.commonPaper}>
            <ClickAwayListener
              onClickAway={this.closeLever.bind(this, "buy_lever")}
            >
              <MenuList>
                {this.leversList("BUY_OPEN").map((item) => {
                  return (
                    <MenuItem
                      key={item}
                      selected={this.props.buy_leverage === item}
                      onClick={this.leverageChange.bind(
                        this,
                        "buy_leverage",
                        item
                      )}
                    >
                      {item}X
                    </MenuItem>
                  );
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
        <Popper
          open={Boolean(sale_lever)}
          anchorEl={sale_lever}
          id="sale_lever"
          onClose={this.closeLever.bind(this, "sale_lever")}
          placement="bottom-end"
          style={{ zIndex: 200 }}
        >
          <Paper className={classes.commonPaper}>
            <ClickAwayListener
              onClickAway={this.closeLever.bind(this, "sale_lever")}
            >
              <MenuList>
                {(this.leversList("SELL_OPEN") || []).map((item) => {
                  return (
                    <MenuItem
                      key={item}
                      selected={this.props.sale_leverage === item}
                      onClick={this.leverageChange.bind(
                        this,
                        "sale_leverage",
                        item
                      )}
                    >
                      {item}X
                    </MenuItem>
                  );
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>

        <Popper
          open={Boolean(this.props.buy_price_type_modal)}
          anchorEl={this.props.buy_price_type_modal || null}
          id="buy_price_type_modal"
          onClose={this.closeLever.bind(this, "buy_price_type_modal")}
          placement="bottom-end"
          style={{ zIndex: 200 }}
        >
          <Paper className={classes.commonPaper}>
            <ClickAwayListener
              onClickAway={this.closeLever.bind(this, "buy_price_type_modal")}
            >
              <MenuList style={{ width: this.state.width }}>
                {this.props.price_types.map((item, i) => {
                  if (
                    this.props.settingCombin[orderSetting.timeInForce].indexOf(
                      i
                    ) == -1 ||
                    // 下单设置为FOK时，不显示市价选项
                    (orderSetting.timeInForce == "FOK" &&
                      item == "MARKET_PRICE")
                  ) {
                    return "";
                  }
                  return (
                    <MenuItem
                      key={i}
                      className={classes.menuItem}
                      selected={this.props.buy_price_type === i}
                      onClick={this.changePriceType.bind(
                        this,
                        "buy_price_type",
                        i
                      )}
                    >
                      {this.props.intl.formatMessage({
                        id: this.props.price_types_desc[i],
                      })}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
        <Popper
          open={Boolean(this.props.sale_price_type_modal)}
          anchorEl={this.props.sale_price_type_modal || null}
          id="sale_price_type_modal"
          onClose={this.closeLever.bind(this, "sale_price_type_modal")}
          placement="bottom-end"
          style={{ zIndex: 200 }}
        >
          <Paper className={classes.commonPaper}>
            <ClickAwayListener
              onClickAway={this.closeLever.bind(this, "sale_price_type_modal")}
            >
              <MenuList style={{ width: this.state.width }}>
                {this.props.price_types.map((item, i) => {
                  if (
                    this.props.settingCombin[orderSetting.timeInForce].indexOf(
                      i
                    ) == -1 ||
                    (orderSetting.timeInForce == "FOK" &&
                      item == "MARKET_PRICE")
                  ) {
                    return "";
                  }
                  return (
                    <MenuItem
                      key={i}
                      className={classes.menuItem}
                      selected={this.props.sale_price_type === i}
                      onClick={this.changePriceType.bind(
                        this,
                        "sale_price_type",
                        i
                      )}
                    >
                      {this.props.intl.formatMessage({
                        id: this.props.price_types_desc[i],
                      })}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
        <ModalOrder
          open={this.props.modal_order}
          {...otherProps}
          orderCreate={this.orderCreate}
          isConfirm={isConfirm}
          cost={this.props.order_side == 0 ? buy_cost[3] : sale_cost[3]}
          handleClose={() => {
            this.props.dispatch({
              type: "future/handleChange",
              payload: {
                modal_order: false,
              },
            });
          }}
        />
        <ModalRisk open={this.props.modal_risk} {...otherProps} />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(LimitTrading));
