// 交易模块
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  ButtonGroup,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";

import { Table, message, Iconfont } from "../../lib";
import math from "../../utils/mathjs";
import helper from "../../utils/helper";
import CONST from "../../config/const";
import route_map from "../../config/route_map";
import WSDATA from "../../models/data_source";
import getData from "../../services/getData";
import styles from "../public/quote_style";

class TradingHistory extends React.Component {
  constructor() {
    super();
    this.state = {
      open: {},
      openPlan: {},
      confirm: false,
      all_symbol: false,
      subed: false,
      tabs: ["当前委托", "历史委托", "历史成交"],
      open_orderid: "", // 当前加载详情orderid
      openPlanOrderId: "",
      entrust_type: CONST.ENTRUST_TYPE.NORMAL,
    };
    this.orderCancel = this.orderCancel.bind(this);
    this.getMore = this.getMore.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.first = this.first.bind(this);
    this.showMoreDetails = this.showMoreDetails.bind(this);
  }
  componentDidMount() {
    const trading_index = window.localStorage.trading_index;
    if (
      (trading_index || trading_index === 0) &&
      this.props.trading_index !== trading_index
    ) {
      this.props.dispatch({
        type: "layout/handleChange",
        payload: {
          trading_index: Number(trading_index),
        },
      });
    }
    this.first();
  }
  componentDidUpdate(preProps) {
    if (this.props.ws && !this.state.subed && this.props.userinfo.userId) {
      this.setState(
        {
          subed: true,
        },
        () => {
          // 订阅普通订单
          this.props.ws.sub(
            {
              id: "order",
              topic: "order",
              event: "sub",
              params: {
                org: this.props.config.orgId,
                binary: !Boolean(window.localStorage.ws_binary),
              },
            },
            this.httpUpdateOrder,
            this.callbackOrder,
            this.reopen
          );
          // 计划委托
          this.props.ws.sub(
            {
              id: "plan_order",
              topic: "plan_order",
              event: "sub",
              params: {
                org: this.props.config.orgId,
                binary: !Boolean(window.localStorage.ws_binary),
              },
            },
            this.httpUpdatePlanOrder,
            this.callbackPlanOrder,
            this.reopen
          );
          // 成交
          this.props.ws.sub(
            {
              id: "match",
              topic: "match",
              event: "sub",
              params: {
                org: this.props.config.orgId,
                binary: !Boolean(window.localStorage.ws_binary),
              },
            },
            null,
            this.callbackMatch
          );
        }
      );
    }
    if (
      preProps.symbol_id &&
      this.props.symbol_id &&
      preProps.symbol_id != this.props.symbol_id &&
      !this.state.all_symbol
    ) {
      this.first();
    }
  }
  httpUpdateOrder = async (payload) => {
    await this.props.dispatch({
      type: "layout/httpUpdateOrder",
      payload: {
        symbol_id: this.state.all_symbol
          ? ""
          : (
              this.props.match.params.token1 +
              this.props.match.params.token2 +
              ""
            ).toUpperCase(),
      },
    });
  };
  httpUpdatePlanOrder = async (payload) => {
    await this.props.dispatch({
      type: "layout/httpUpdatePlanOrder",
      payload: {
        symbol_id: this.state.all_symbol
          ? ""
          : (
              this.props.match.params.token1 +
              this.props.match.params.token2 +
              ""
            ).toUpperCase(),
      },
    });
  };

  callbackOrder = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("new_order_source", data.data);
  };

  callbackPlanOrder = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("new_plan_order_source", data.data);
  };

  callbackMatch = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("history_trades_source", data.data);
  };
  // after ws reopen, refresh data
  reopen = (id, reopen) => {
    if (reopen) {
      this.first();
    }
  };
  async first() {
    WSDATA.clear("new_order_source");
    WSDATA.clear("new_plan_order_source");
    await this.props.dispatch({
      type: "layout/save",
      payload: {
        // 当前委托
        open_orders: [],
        open_orders_more: true, // 是否还有更多数据
        // 当前计划委托
        open_plan_orders: [],
        open_plan_orders_more: true,
        // 历史委托
        history_orders: [],
        history_orders_more: true, // 是否还有更多数据
        history_plan_orders: [],
        history_plan_orders_more: true,
        // 历史成交源数据
        history_trades_source: [],
        // 历史成交
        history_trades: [],
        // 第一次拉取历史成交记录，用于拉取历史成交最新数据的凭据，如果false，不进行最新拉取
        history_trades_first_req: false,
        history_trades_more: true, // 是否还有更多数据
      },
    });
    // 获取当前委托
    this.getMore("open_orders");
    this.getMore("open_plan_orders");
    // 获取历史委托
    this.getMore("history_orders");
    this.getMore("history_plan_orders");
    // 获取历史成交
    this.getMore("history_trades");
  }
  onSelect = (event, value) => {
    this.props.dispatch({
      type: "layout/handleChange",
      payload: {
        trading_index: value,
      },
    });
    if (value != 1) {
      this.setState({
        open: {},
      });
    }
  };
  showMoreDetails(record, i, e) {
    const n = this.state.open;
    if (this.state.open_orderid) {
      return;
    }
    let newn = { ...n };
    if (n[record.orderId]) {
      delete newn[record.orderId];
      this.setState({
        open: newn,
      });
    } else {
      newn[record.orderId] = {
        data: [],
        more: true,
        loading: true,
      };
      this.setState(
        {
          open: newn,
          open_orderid: record.orderId,
        },
        () => {
          this.getMoreDetails(record.orderId, "", record);
        }
      );
    }
  }
  showPlanOrderDetails(record) {
    const n = this.state.openPlan;
    if (this.state.openPlanOrderId) {
      return;
    }
    let newn = { ...n };
    if (n[record.orderId]) {
      delete newn[record.orderId];
      this.setState({
        openPlan: newn,
      });
    } else {
      newn[record.orderId] = {
        data: [],
        more: true,
        loading: true,
      };
      this.setState(
        {
          openPlan: newn,
          openPlanOrderId: record.orderId,
        },
        () => {
          this.props
            .dispatch({
              type: "exchange/getPlanOrderDetail",
              payload: {
                account_type: CONST.ACCOUNT_TYPE.COIN,
                order_id: record.orderId,
              },
            })
            .then((ret) => {
              if (ret) {
                let n = {
                  data: ret.order ? [ret.order] : [],
                  more: true,
                  loading: true,
                };
                let newopen = { ...this.state.openPlan };
                newopen[record.orderId] = n;
                this.setState({
                  openPlan: newopen,
                  openPlanOrderId: "",
                });
              } else {
                this.setState({
                  openPlanOrderId: "",
                });
              }
            });
        }
      );
    }
  }
  clearMoreDetials = () => {
    this.setState({
      open: {},
      openPlan: {},
    });
  };
  getMoreDetails = async (order_id, trade_id, record) => {
    const result = await getData("match_info")({
      payload: {
        order_id,
        trade_id,
        limit: 10,
      },
    });
    if (result.code == "OK") {
      let n = { data: result.data, more: true, loading: true };
      let newopen = { ...this.state.open };
      newopen[order_id] = n;
      this.setState({
        open: newopen,
        open_orderid: "",
      });
    }
  };
  async orderCancel(record, i) {
    // 撤单
    if (!record.triggerPrice) {
      await this.props.dispatch({
        type: "layout/orderCancel",
        payload: {
          client_order_id: new Date().getTime(),
          account_id: record.accountId,
          order_id: record.orderId,
          i,
        },
      });
    } else {
      await this.props.dispatch({
        type: "layout/cancelPlanOrder",
        payload: {
          client_order_id: new Date().getTime(),
          account_type: 0, // 币币账户
          order_id: record.orderId,
          i,
        },
      });
    }
    // 拉取最新资产信息
    await this.props.dispatch({
      type: "layout/getAccount",
      payload: {},
    });
  }
  // 获取更多
  getMore(column) {
    this.props.dispatch({
      type: "layout/getOrders",
      payload: {
        column,
        symbol_id: this.state.all_symbol
          ? ""
          : (
              this.props.match.params.token1 +
              this.props.match.params.token2 +
              ""
            ).toUpperCase(),
      },
    });
  }
  cancel_all = () => {
    let params = {};
    if (!Boolean(this.state.all_symbol)) {
      params.symbol_ids = (
        this.props.match.params.token1 +
        this.props.match.params.token2 +
        ""
      ).toUpperCase();
    }
    this.setState(
      {
        confirm: false,
      },
      () => {
        this.props.dispatch({
          type:
            this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
              ? "exchange/order_cancel_all"
              : "exchange/cancelAllPlanOrder",
          payload: params,
        });
      }
    );
  };
  confirm_cancel = () => {
    this.setState({
      confirm: false,
    });
  };
  confirm_open = () => {
    this.setState({
      confirm: true,
    });
  };
  copy = () => {
    message.info(
      this.props.intl.formatMessage({
        id: "复制成功",
      })
    );
  };
  // 切换计划委托和普通委托
  onEntrustTypeChange = (type) => {
    this.setState({
      entrust_type: type,
    });
  };
  render() {
    let sysmbols = this.props.config.symbols;
    const symbolInfo = this.props.symbol_info;
    // 当前委托
    const column_current = [
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "time",
        render: (text, record) => {
          return (
            <span data-orderid={record.orderId}>
              {moment
                .utc(Number(record.time))
                .local()
                .format("YYYY/MM/DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "交易类型",
        }),
        key: "type",
        render: (text, record) => {
          return text ? <FormattedMessage id={text} /> : "";
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "币对",
        }),
        key: "symbol",
        render: (text, record) => {
          return (
            <span>
              {record.baseTokenName}/{record.quoteTokenName}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "方向",
        }),
        key: "side",
        render: (text, record) => {
          return (
            <em className={record.side === "BUY" ? classes.up : classes.down}>
              {text ? <FormattedMessage id={text} /> : ""}
            </em>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "价格",
        }),
        key: "price",
        render: (text, record) => {
          if (record.type === "MARKET") {
            return record.type ? <FormattedMessage id={record.type} /> : "";
          }
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "minPricePrecision"
                      ]
                    ]
                  )
                : text}
              <span className="grey02"> {record.quoteTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "数量",
        }),
        key: "origQty",
        render: (text, record) => {
          // 市价买单
          if (record.type === "MARKET" && record.side === "BUY") {
            return "--";
          }
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "basePrecision"
                      ]
                    ]
                  )
                : text}
              <span className="grey02"> {record.baseTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "已成交数量",
        }),
        key: "executedQty",
        render: (text, record) => {
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "basePrecision"
                      ]
                    ]
                  )
                : text}
              <span className="grey02"> {record.baseTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "委托总额",
        }),
        key: "executed_amount",
        render: (text, record) => {
          // 市价买单
          if (record.type === "MARKET" && record.side === "BUY") {
            return (
              <p>
                {" "}
                {sysmbols[record.baseTokenId + record.quoteTokenId]
                  ? helper.digits(
                      record.origQty,
                      CONST["depth"][
                        sysmbols[record.baseTokenId + record.quoteTokenId][
                          "quotePrecision"
                        ]
                      ]
                    )
                  : record.origQty}
                <span className="grey02"> {record.quoteTokenName}</span>
              </p>
            );
          }
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    math
                      .chain(math.bignumber(record.price))
                      .multiply(math.bignumber(record.origQty))
                      .format({ notation: "fixed" })
                      .done(),
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "quotePrecision"
                      ]
                    ]
                  )
                : math
                    .chain(math.bignumber(record.price))
                    .multiply(math.bignumber(record.origQty))
                    .format({ notation: "fixed", precision: 8 })
                    .done()}
              <span className="grey02"> {record.quoteTokenName}</span>
            </p>
          );
        },
      },
      // {
      //   title: this.props.intl.formatMessage({
      //     id: "未成交数量"
      //   }),
      //   key: "icebergQty",
      //   render: (text, record) => {
      //     // 市价买单
      //     if (record.type === "MARKET" && record.side === "BUY") {
      //       return "--";
      //     }
      //     return (
      //       <p>
      //         {sysmbols[record.baseTokenId + record.quoteTokenId]
      //           ? helper.digits(
      //               math
      //                 .chain(math.bignumber(record.origQty))
      //                 .subtract(math.bignumber(record.executedQty))
      //                 .format({ notation: "fixed" })
      //                 .done(),
      //               CONST["depth"][
      //                 sysmbols[record.baseTokenId + record.quoteTokenId][
      //                   "basePrecision"
      //                 ]
      //               ]
      //             )
      //           : math
      //               .chain(math.bignumber(record.origQty))
      //               .subtract(math.bignumber(record.executedQty))
      //               .format({ notation: "fixed", precision: 8 })
      //               .done()}
      //         <span className="grey02"> {record.baseTokenName}</span>
      //       </p>
      //     );
      //   }
      // },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "",
        render: (text, record, i) => {
          if (record.type === "MARKET") {
            return "";
          }
          return (
            <p
              className={classes.operate}
              onClick={this.orderCancel.bind(this, record, i)}
            >
              {this.props.intl.formatMessage({
                id: "撤单",
              })}
            </p>
          );
        },
      },
    ];
    // 当前计划委托
    const column_current_plan_orders = [
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "time",
        render: (text, record) => {
          return (
            <span data-orderid={record.orderId}>
              {moment
                .utc(Number(record.time))
                .local()
                .format("YYYY/MM/DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "交易类型",
        }),
        key: "type",
        render: (text, record) => {
          return text ? <FormattedMessage id={text} /> : "";
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "币对",
        }),
        key: "symbol",
        render: (text, record) => {
          return (
            <span>
              {record.baseTokenName}/{record.quoteTokenName}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "方向",
        }),
        key: "side",
        render: (text, record) => {
          return (
            <em className={record.side === "BUY" ? classes.up : classes.down}>
              {text ? <FormattedMessage id={text} /> : ""}
            </em>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "触发价格",
        }),
        key: "triggerPrice",
        render: (text, record) => {
          const legal = Number(record.quotePrice) > Number(text) ? "≤" : "≥";
          return (
            <p>
              {legal}{" "}
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "minPricePrecision"
                      ]
                    ]
                  )
                : text}
              <span className="grey02"> {record.quoteTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "委托价格",
        }),
        key: "price",
        render: (text, record) => {
          if (record.type === "MARKET") {
            return record.type ? <FormattedMessage id={record.type} /> : "";
          } else {
            return (
              <p>
                {sysmbols[record.baseTokenId + record.quoteTokenId]
                  ? helper.digits(
                      text,
                      CONST["depth"][
                        sysmbols[record.baseTokenId + record.quoteTokenId][
                          "minPricePrecision"
                        ]
                      ]
                    )
                  : text}
                <span className="grey02"> {record.quoteTokenName}</span>
              </p>
            );
          }
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "委托数量",
        }),
        key: "origQty",
        render: (text, record) => {
          // 市价买单
          if (record.type === "MARKET" && record.side === "BUY") {
            return "--";
          }
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "basePrecision"
                      ]
                    ]
                  )
                : text}
              <span className="grey02"> {record.baseTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "委托总额",
        }),
        key: "executed_amount",
        render: (text, record) => {
          // 市价买单
          if (record.type === "MARKET" && record.side === "BUY") {
            return (
              <p>
                {sysmbols[record.baseTokenId + record.quoteTokenId]
                  ? helper.digits(
                      record.origQty,
                      CONST["depth"][
                        sysmbols[record.baseTokenId + record.quoteTokenId][
                          "quotePrecision"
                        ]
                      ]
                    )
                  : record.amount}
                <span className="grey02"> {record.quoteTokenName}</span>
              </p>
            );
          }
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    math
                      .chain(math.bignumber(record.price))
                      .multiply(math.bignumber(record.origQty))
                      .format({ notation: "fixed" })
                      .done(),
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "quotePrecision"
                      ]
                    ]
                  )
                : math
                    .chain(math.bignumber(record.price))
                    .multiply(math.bignumber(record.origQty))
                    .format({ notation: "fixed", precision: 8 })
                    .done()}
              <span className="grey02"> {record.quoteTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "状态",
        }),
        key: "status",
        render: (text, record) => {
          return text ? <FormattedMessage id={text} /> : "";
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "",
        render: (text, record, i) => {
          return (
            <p
              className={classes.operate}
              onClick={this.orderCancel.bind(this, record, i)}
            >
              {this.props.intl.formatMessage({
                id: "撤单",
              })}
            </p>
          );
        },
      },
    ];
    // 历史委托
    const column_history = [
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "time",
        render: (text, record) => {
          return (
            <span data-orderid={record.orderId}>
              {moment
                .utc(Number(record.time))
                .local()
                .format("YYYY/MM/DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "交易类型",
        }),
        key: "type",
        render: (text, record) => {
          return text ? <FormattedMessage id={text || ""} /> : "";
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "币对",
        }),
        key: "symbol",
        render: (text, record) => {
          return (
            <span>
              {record.baseTokenName}/{record.quoteTokenName}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "方向",
        }),
        key: "side",
        render: (text, record) => {
          return (
            <em className={record.side === "BUY" ? classes.up : classes.down}>
              {text ? <FormattedMessage id={text} /> : ""}
            </em>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "价格",
        }),
        key: "price",
        render: (text, record) => {
          if (record.type === "MARKET") {
            return record.type ? <FormattedMessage id={record.type} /> : "";
          } else {
            return (
              <p>
                {sysmbols[record.baseTokenId + record.quoteTokenId]
                  ? helper.digits(
                      text,
                      CONST["depth"][
                        sysmbols[record.baseTokenId + record.quoteTokenId][
                          "minPricePrecision"
                        ]
                      ]
                    )
                  : text}
                <span className="grey02"> {record.quoteTokenName}</span>
              </p>
            );
          }
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "成交均价",
        }),
        key: "avgPrice",
        render: (text, record) => {
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "minPricePrecision"
                      ]
                    ]
                  )
                : text}
              <span className="grey02"> {record.quoteTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "委托量",
        }),
        key: "origQty",
        render: (text, record) => {
          // limit, market && sell  展示数量， 其他展示金额; origQty:接口已处理成对应的值
          if (
            record.type === "LIMIT" ||
            (record.type == "MARKET" && record.side == "SELL")
          ) {
            return (
              <p>
                {sysmbols[record.baseTokenId + record.quoteTokenId]
                  ? helper.digits(
                      text,
                      CONST["depth"][
                        sysmbols[record.baseTokenId + record.quoteTokenId][
                          "basePrecision"
                        ]
                      ]
                    )
                  : text}
                <span className="grey02"> {record.baseTokenName}</span>
              </p>
            );
          } else {
            return (
              <p>
                {sysmbols[record.baseTokenId + record.quoteTokenId]
                  ? helper.digits(
                      text,
                      CONST["depth"][
                        sysmbols[record.baseTokenId + record.quoteTokenId][
                          "quotePrecision"
                        ]
                      ]
                    )
                  : text}
                <span className="grey02"> {record.quoteTokenName}</span>
              </p>
            );
          }
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "已成交数量",
        }),
        key: "executedQty",
        render: (text, record) => {
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "basePrecision"
                      ]
                    ]
                  )
                : text}
              <span className="grey02"> {record.baseTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "成交额",
        }),
        key: "executedAmount",
        render: (text, record) => {
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId] && text
                ? helper.digits(text, 8)
                : text}{" "}
              <span className="grey02">{record.quoteTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "状态",
        }),
        key: "status",
        render: (text, record) => {
          // status === cancel && 已成交数量 > 0 状态展示为部分成交
          if (text === "CANCELED" && record.executedQty > 0) {
            return this.props.intl.formatMessage({
              id: "PARTIALLY_FILLED",
            });
          }
          return this.props.intl.formatMessage({
            id: text,
          });
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "",
        render: (text, record, i) => {
          return record.status == "CANCELED" && record.executedQty <= 0 ? (
            <span />
          ) : (
            <span
              onClick={this.showMoreDetails.bind(this, record, i)}
              id={"s" + record.orderId}
              className={classes.operate}
            >
              {this.state.open_orderid == record.orderId ? (
                <CircularProgress
                  size={12}
                  color="default"
                  style={{
                    position: "relative",
                    top: 2,
                    right: 5,
                  }}
                />
              ) : (
                ""
              )}
              {this.props.intl.formatMessage({
                id: "详情",
              })}
              <Iconfont
                type="arrowDown"
                size={16}
                className={this.state.open[record.orderId] ? "on" : ""}
              />
            </span>
          );
        },
      },
    ];
    // 历史计划委托
    const column_history_plan_orders = [
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "time",
        render: (text, record) => {
          return (
            <span data-orderid={record.orderId}>
              {moment
                .utc(Number(record.time))
                .local()
                .format("YYYY/MM/DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "交易类型",
        }),
        key: "type",
        render: (text, record) => {
          return text ? <FormattedMessage id={text || ""} /> : "";
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "币对",
        }),
        key: "symbol",
        render: (text, record) => {
          return (
            <span>
              {record.baseTokenName}/{record.quoteTokenName}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "方向",
        }),
        key: "side",
        render: (text, record) => {
          return (
            <em className={record.side === "BUY" ? classes.up : classes.down}>
              {text ? <FormattedMessage id={text} /> : ""}
            </em>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "触发价格",
        }),
        key: "triggerPrice",
        render: (text, record) => {
          const legal = Number(record.quotePrice) > Number(text) ? "≤" : "≥";
          return (
            <p>
              {legal}
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "minPricePrecision"
                      ]
                    ]
                  )
                : text}
              <span className="grey02"> {record.quoteTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "委托价格",
        }),
        key: "price",
        render: (text, record) => {
          if (record.type === "MARKET") {
            return record.type ? <FormattedMessage id={record.type} /> : "";
          } else {
            return (
              <p>
                {sysmbols[record.baseTokenId + record.quoteTokenId]
                  ? helper.digits(
                      text,
                      CONST["depth"][
                        sysmbols[record.baseTokenId + record.quoteTokenId][
                          "minPricePrecision"
                        ]
                      ]
                    )
                  : text}
                <span className="grey02"> {record.quoteTokenName}</span>
              </p>
            );
          }
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "委托数量",
        }),
        key: "origQty",
        render: (text, record) => {
          // limit, market && sell  展示数量， 其他展示金额; origQty:接口已处理成对应的值
          if (
            record.type === "LIMIT" ||
            (record.type == "MARKET" && record.side == "SELL")
          ) {
            return (
              <p>
                {sysmbols[record.baseTokenId + record.quoteTokenId]
                  ? helper.digits(
                      text,
                      CONST["depth"][
                        sysmbols[record.baseTokenId + record.quoteTokenId][
                          "basePrecision"
                        ]
                      ]
                    )
                  : text}
                <span className="grey02"> {record.baseTokenName}</span>
              </p>
            );
          } else {
            return (
              <p>
                {sysmbols[record.baseTokenId + record.quoteTokenId]
                  ? helper.digits(
                      record.amount,
                      CONST["depth"][
                        sysmbols[record.baseTokenId + record.quoteTokenId][
                          "quotePrecision"
                        ]
                      ]
                    )
                  : text}
                <span className="grey02"> {record.quoteTokenName}</span>
              </p>
            );
          }
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "委托总额",
        }),
        key: "executedQty",
        render: (text, record) => {
          // 市价买单
          if (record.type === "MARKET" && record.side === "BUY") {
            return (
              <p>
                {sysmbols[record.baseTokenId + record.quoteTokenId]
                  ? helper.digits(
                      record.origQty,
                      CONST["depth"][
                        sysmbols[record.baseTokenId + record.quoteTokenId][
                          "quotePrecision"
                        ]
                      ]
                    )
                  : record.origQty}
                <span className="grey02"> {record.quoteTokenName}</span>
              </p>
            );
          }
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    math
                      .chain(math.bignumber(record.price))
                      .multiply(math.bignumber(record.origQty))
                      .format({ notation: "fixed" })
                      .done(),
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "quotePrecision"
                      ]
                    ]
                  )
                : math
                    .chain(math.bignumber(record.price))
                    .multiply(math.bignumber(record.origQty))
                    .format({ notation: "fixed", precision: 8 })
                    .done()}
              <span className="grey02"> {record.quoteTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "触发时间",
        }),
        key: "triggerTime",
        render: (text, record) => {
          if (!text || text == 0 || record.status == "ORDER_CANCELED") {
            return <span>-</span>;
          }
          return (
            <span data-orderid={record.orderId}>
              {moment.utc(Number(text)).local().format("YYYY/MM/DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "状态",
        }),
        key: "status",
        render: (text, record) => {
          return this.props.intl.formatMessage({
            id: text,
          });
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "",
        render: (text, record) => {
          return record.status == "ORDER_CANCELED" ||
            record.status == "ORDER_REJECTED" ? (
            <span />
          ) : (
            <span
              onClick={this.showPlanOrderDetails.bind(this, record)}
              id={"s" + record.orderId}
              className={classes.operate}
            >
              {this.state.openPlanOrderId == record.orderId ? (
                <CircularProgress
                  size={12}
                  color="default"
                  style={{
                    position: "relative",
                    top: 2,
                    right: 5,
                  }}
                />
              ) : (
                ""
              )}
              {this.props.intl.formatMessage({
                id: "详情",
              })}
              <Iconfont
                type="arrowDown"
                size={16}
                className={this.state.openPlan[record.orderId] ? "on" : ""}
              />
            </span>
          );
        },
      },
    ];
    // 历史委托详细信息
    const column_history_detail = [
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "time",
        render: (text) => {
          return (
            <p>
              {moment.utc(Number(text)).local().format("YYYY/MM/DD HH:mm:ss")}
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "价格",
        }),
        key: "price",
        render: (text, record) => {
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "minPricePrecision"
                      ]
                    ]
                  )
                : text}
              <span>{record.quoteTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "数量",
        }),
        key: "quantity",
        render: (text, record) => {
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? `${helper.digits(
                    record.quantity,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "basePrecision"
                      ]
                    ]
                  )}`
                : text}
              <span>{record.baseTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "成交额",
        }),
        key: "quantity",
        render: (text, record) => {
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? `${helper.digits(
                    math
                      .chain(math.bignumber(record.price))
                      .multiply(math.bignumber(record.quantity))
                      .format({ notation: "fixed" })
                      .done(),
                    8
                  )}`
                : text}
              <span>{record.quoteTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "手续费",
        }),
        key: "fee",
        render: (text, record) => {
          return (
            <p>
              {record.fee}
              <span>{record.feeTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "成交单号",
        }),
        key: "tradeId",
        render: (text, record) => {
          return (
            <CopyToClipboard text={text} onCopy={this.copy}>
              <p>
                {text}
                <span className={classes.operate}>
                  {this.props.intl.formatMessage({ id: "复制" })}
                </span>
              </p>
            </CopyToClipboard>
          );
        },
      },
    ];

    const column_history_plan_order_detail = [
      {
        title: this.props.intl.formatMessage({
          id: "订单ID",
        }),
        key: "orderId",
        render: (text, record) => {
          return (
            <CopyToClipboard text={text} onCopy={this.copy}>
              <p>
                {text}
                <span className={classes.operate}>
                  {this.props.intl.formatMessage({ id: "复制" })}
                </span>
              </p>
            </CopyToClipboard>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "time",
        render: (text, record) => {
          return (
            <span data-orderid={record.orderId}>
              {moment
                .utc(Number(record.time))
                .local()
                .format("YYYY/MM/DD HH:mm:ss")}
            </span>
          );
        },
      },

      {
        title: this.props.intl.formatMessage({
          id: "币对",
        }),
        key: "symbol",
        render: (text, record) => {
          return (
            <span>
              {record.baseTokenName}/{record.quoteTokenName}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "方向",
        }),
        key: "side",
        render: (text, record) => {
          return (
            <em className={record.side === "BUY" ? classes.up : classes.down}>
              {text ? <FormattedMessage id={text} /> : ""}
            </em>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "价格",
        }),
        key: "price",
        render: (text, record) => {
          if (record.type === "MARKET") {
            return record.type ? <FormattedMessage id={record.type} /> : "";
          } else {
            return (
              <p>
                {sysmbols[record.baseTokenId + record.quoteTokenId]
                  ? helper.digits(
                      text,
                      CONST["depth"][
                        sysmbols[record.baseTokenId + record.quoteTokenId][
                          "minPricePrecision"
                        ]
                      ]
                    )
                  : text}
                <span className="grey02"> {record.quoteTokenName}</span>
              </p>
            );
          }
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "数量",
        }),
        key: "origQty",
        render: (text, record) => {
          // 市价买单
          if (record.type === "MARKET" && record.side === "BUY") {
            return "--";
          }
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "basePrecision"
                      ]
                    ]
                  )
                : text}
              <span className="grey02"> {record.baseTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "已成交数量",
        }),
        key: "executedQty",
        render: (text, record) => {
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "basePrecision"
                      ]
                    ]
                  )
                : text}
              <span className="grey02"> {record.baseTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "状态",
        }),
        key: "status",
        render: (text, record) => {
          return text ? <FormattedMessage id={text} /> : "";
        },
      },
    ];

    // 历史成交
    const column_trade = [
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "time",
        render: (text, record) => {
          return (
            <span data-tradeid={record.tradeId} data-orderid={record.orderId}>
              {moment
                .utc(Number(record.time))
                .local()
                .format("YYYY/MM/DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "交易类型",
        }),
        key: "type",
        render: (text, record) => {
          return text ? this.props.intl.formatMessage({ id: text }) : text;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "市场",
        }),
        key: "symbol",
        render: (text, record) => {
          return (
            <span>
              {record.baseTokenName}/{record.quoteTokenName}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "方向",
        }),
        key: "side",
        render: (text, record) => {
          return (
            <em className={record.side === "BUY" ? classes.up : classes.down}>
              {text ? <FormattedMessage id={text} /> : ""}
            </em>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "成交价",
        }),
        key: "price",
        render: (text, record) => {
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "minPricePrecision"
                      ]
                    ]
                  )
                : text}
              <span className="grey02"> {record.quoteTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "数量",
        }),
        key: "quantity",
        render: (text, record) => {
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    text,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "basePrecision"
                      ]
                    ]
                  )
                : text}
              <span className="grey02"> {record.baseTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "成交额",
        }),
        key: "baseToken",
        render: (text, record) => {
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    math
                      .chain(math.bignumber(record.price))
                      .multiply(math.bignumber(record.quantity))
                      .format({ notation: "fixed" })
                      .done(),
                    8
                    // CONST["depth"][
                    //   sysmbols[record.baseTokenId + record.quoteTokenId][
                    //     "quotePrecision"
                    //   ]
                    // ]
                  )
                : math
                    .chain(math.bignumber(record.price))
                    .multiply(math.bignumber(record.quantity))
                    .format({ notation: "fixed", precision: 8 })
                    .done()}
              <span className="grey02"> {record.quoteTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "手续费",
        }),
        key: "fee",
        render: (text, record) => {
          return (
            <p>
              {text}
              <span className="grey02"> {record.feeTokenName}</span>
            </p>
          );
        },
      },
    ];
    // 我的资产
    const column_asset = [
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "tokenName",
      },
      {
        title: this.props.intl.formatMessage({
          id: "持有数量",
        }),
        key: "total",
        render: (text, record) => {
          return helper.digits(math.chain(text).done(), 8);
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "可用数量",
        }),
        key: "free",
        render: (text, record) => {
          return helper.digits(math.chain(text).done(), 8);
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "冻结数量",
        }),
        key: "locked",
        render: (text, record) => {
          return helper.digits(math.chain(text).done(), 8);
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "估值",
        }),
        key: "baseTokenName",
        render: (text, record) => {
          const rates = helper.currencyValue(
            this.props.rates,
            record.usdtValue,
            "USDT"
          );
          return (
            <span>
              {helper.digits(record.usdtValue, 8)} USDT ≈ {rates[0]}
              {rates[1]}
            </span>
          );
        },
      },
    ];
    const userinfo = this.props.userinfo;
    const loading = this.props.loading || { effects: {} };
    const { classes } = this.props;

    // 当前委托数据
    const currentList = (
      helper.excludeRepeatArray("orderId", this.props.open_orders, "time") || []
    )
      .sort((a, b) => (a.time - b.time >= 0 ? -1 : 1))
      .filter((a) => {
        if (this.state.all_symbol) {
          return true;
        }
        if (
          a.baseTokenId == this.props.token1 &&
          a.quoteTokenId == this.props.token2
        ) {
          return true;
        }
        return false;
      });

    // 当前计划委托
    const currentPlanList = (
      helper.excludeRepeatArray(
        "orderId",
        this.props.open_plan_orders,
        "time"
      ) || []
    )
      .sort((a, b) => (a.time - b.time >= 0 ? -1 : 1))
      .filter((a) => {
        if (this.state.all_symbol) {
          return true;
        }
        if (
          a.baseTokenId == this.props.token1 &&
          a.quoteTokenId == this.props.token2
        ) {
          return true;
        }
        return false;
      });

    // 历史委托
    const historyOrderList = (
      helper.excludeRepeatArray("orderId", this.props.history_orders, "time") ||
      []
    )
      .sort((a, b) => (a.time - b.time >= 0 ? -1 : 1))
      .filter((a) => {
        if (this.state.all_symbol) {
          return true;
        }
        if (
          a.baseTokenId == this.props.token1 &&
          a.quoteTokenId == this.props.token2
        ) {
          return true;
        }
        return false;
      });

    const historyPlanOrderList = (
      helper.excludeRepeatArray(
        "orderId",
        this.props.history_plan_orders,
        "time"
      ) || []
    )
      .sort((a, b) => (a.time - b.time >= 0 ? -1 : 1))
      .filter((a) => {
        if (this.state.all_symbol) {
          return true;
        }
        if (
          a.baseTokenId == this.props.token1 &&
          a.quoteTokenId == this.props.token2
        ) {
          return true;
        }
        return false;
      });

    let tabs =
      userinfo.userId && window.location.href.indexOf(route_map.exchange) > -1
        ? this.state.tabs.concat(["我的资产"])
        : this.state.tabs;

    const enableCancelAllButton =
      (this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL &&
        currentList.length > 0) ||
      (this.state.entrust_type == CONST.ENTRUST_TYPE.PLAN &&
        currentPlanList.length > 0);
    return (
      <div className={this.props.className || classes.orderList}>
        <div className={classes.tabBg}>
          <Tabs
            value={this.props.trading_index}
            onChange={this.onSelect}
            indicatorColor="primary"
            textColor="inherit"
            className={classnames(classes.tabs, "orderTabs")}
          >
            {tabs.map((item, i) => {
              return (
                <Tab
                  value={i}
                  key={i}
                  label={this.props.intl.formatMessage({
                    id: item,
                  })}
                />
              );
            })}
          </Tabs>
          {this.props.trading_index < 3 ? (
            <div className={classes.selectAllSymbol}>
              {window.location.href.indexOf(route_map.exchange) > -1 ? (
                <FormControlLabel
                  className={classes.coin_select}
                  classes={{
                    label: classes.label,
                  }}
                  control={
                    <Checkbox
                      name="all_symbol"
                      onChange={() => {
                        if (loading.effects["layout/getOrders"]) {
                          return;
                        }
                        this.setState(
                          {
                            all_symbol: !this.state.all_symbol,
                          },
                          () => {
                            this.first();
                          }
                        );
                        this.clearMoreDetials();
                      }}
                      checked={Boolean(this.state.all_symbol)}
                      color="primary"
                      classes={{
                        root: classes.checkRoot,
                      }}
                    />
                  }
                  label={this.props.intl.formatMessage({ id: "全部币对" })}
                />
              ) : (
                ""
              )}
              {this.props.trading_index === 0 && this.props.userinfo.userId ? (
                loading.effects["exchange/order_cancel_all"] ? (
                  <span className="option disabled">
                    {this.props.intl.formatMessage({ id: "全部撤单中" })}
                  </span>
                ) : enableCancelAllButton ? (
                  <span onClick={this.confirm_open} className="option">
                    {this.props.intl.formatMessage({ id: "全部撤单" })}
                  </span>
                ) : (
                  <span className="option disabled">
                    {this.props.intl.formatMessage({ id: "全部撤单" })}
                  </span>
                )
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        {this.props.trading_index === 0 && symbolInfo.allowPlan ? (
          <ButtonGroup className={classes.tradeBtn}>
            <Button
              className={
                this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL ? "on" : ""
              }
              style={{ whiteSpace: "nowrap" }}
              onClick={this.onEntrustTypeChange.bind(
                this,
                CONST.ENTRUST_TYPE.NORMAL
              )}
            >
              {this.props.intl.formatMessage({ id: "普通委托" })}
            </Button>
            <Button
              className={
                this.state.entrust_type == CONST.ENTRUST_TYPE.PLAN ? "on" : ""
              }
              style={{ whiteSpace: "nowrap" }}
              onClick={this.onEntrustTypeChange.bind(
                this,
                CONST.ENTRUST_TYPE.PLAN
              )}
            >
              {this.props.intl.formatMessage({ id: "计划委托" })}
            </Button>
          </ButtonGroup>
        ) : (
          ""
        )}
        {this.props.trading_index === 0 ? (
          <Table
            className={
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? classes.order_table2
                : classes.order_table
            }
            widthStyle="order_table_width"
            data={
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? currentList
                : currentPlanList
            }
            titles={
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? column_current
                : column_current_plan_orders
            }
            hasMore={
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? this.props.open_orders_more
                : this.props.open_plan_orders_more
            }
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["layout/getOrders"])
                : false
            }
            showNoMoreData={true}
            useWindow={false}
            getMore={this.getMore.bind(
              this,
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? "open_orders"
                : "open_plan_orders"
            )}
          />
        ) : (
          ""
        )}
        {this.props.trading_index === 1 && symbolInfo.allowPlan ? (
          <ButtonGroup className={classes.tradeBtn}>
            <Button
              className={
                this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL ? "on" : ""
              }
              style={{ whiteSpace: "nowrap" }}
              onClick={this.onEntrustTypeChange.bind(
                this,
                CONST.ENTRUST_TYPE.NORMAL
              )}
            >
              {this.props.intl.formatMessage({ id: "普通委托" })}
            </Button>
            <Button
              className={
                this.state.entrust_type == CONST.ENTRUST_TYPE.PLAN ? "on" : ""
              }
              style={{ whiteSpace: "nowrap" }}
              onClick={this.onEntrustTypeChange.bind(
                this,
                CONST.ENTRUST_TYPE.PLAN
              )}
            >
              {this.props.intl.formatMessage({ id: "计划委托" })}
            </Button>
          </ButtonGroup>
        ) : (
          ""
        )}
        {this.props.trading_index === 1 ? (
          <Table
            className={classes.order_table3}
            widthStyle="order_table_width"
            dataDescKey="orderId"
            dataDesc={
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? this.state.open
                : this.state.openPlan
            }
            dataDescTitles={
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? column_history_detail
                : column_history_plan_order_detail
            }
            dataStyle={classes.match_details}
            dataDescTitleStyle={classes.match_title}
            dataDescStyle={classes.match_info}
            listHeight={44}
            data={
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? historyOrderList
                : historyPlanOrderList
            }
            titles={
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? column_history
                : column_history_plan_orders
            }
            hasMore={
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? this.props.history_orders_more
                : this.props.history_plan_orders_more
            }
            showNoMoreData={true}
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["layout/getOrders"])
                : false
            }
            useWindow={false}
            getMore={this.getMore.bind(
              this,
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? "history_orders"
                : "history_plan_orders"
            )}
          />
        ) : (
          ""
        )}
        {this.props.trading_index === 2 ? (
          <Table
            className={classes.history_order}
            widthStyle="order_table_width"
            data={(
              helper.excludeRepeatArray(
                "tradeId",
                this.props.history_trades,
                "time"
              ) || []
            )
              .sort((a, b) => (a.time - b.time >= 0 ? -1 : 1))
              .filter((a) => {
                if (this.state.all_symbol) {
                  return true;
                }
                if (
                  a.baseTokenId == this.props.token1 &&
                  a.quoteTokenId == this.props.token2
                ) {
                  return true;
                }
                return false;
              })}
            titles={column_trade}
            showNoMoreData={true}
            hasMore={this.props.history_trades_more}
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["layout/getOrders"])
                : false
            }
            useWindow={false}
            getMore={this.getMore.bind(this, "history_trades")}
          />
        ) : (
          ""
        )}
        {this.props.trading_index === 3 &&
        userinfo.userId &&
        window.location.href.indexOf(route_map.exchange) > -1 ? (
          <Table
            className={classes.mycount}
            widthStyle="order_table_width"
            data={this.props.user_balance
              .filter(
                (a) =>
                  math
                    .chain(math.bignumber(a.free))
                    .subtract(math.bignumber(0.00000001))
                    .format({ notation: "fixed" })
                    .done() >= 0 || Number(a.locked) >= 0
              )
              .sort((a, b) => {
                if (a.free - b.free == 0) {
                  return a.tokenId.toUpperCase() >= b.tokenId.toUpperCase()
                    ? -1
                    : 1;
                }
                return a.free - b.free > 0 ? -1 : 1;
              })}
            titles={column_asset}
            hasMore={false}
          />
        ) : (
          ""
        )}
        <Dialog open={this.state.confirm}>
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "撤单确认" })}
          </DialogTitle>
          <DialogContent>
            <p style={{ margin: "0 0 15px" }}>
              {this.props.intl.formatMessage(
                {
                  id:
                    this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                      ? this.state.all_symbol
                        ? "请确认您要撤销当前全部币币委托单？"
                        : "请确认您要撤销{token1}/{token2}全部币币委托单？"
                      : this.state.all_symbol
                      ? "请确认您要撤销当前全部计划委托单？"
                      : "请确认您要撤销{token1}/{token2}全部计划委托单？",
                },
                {
                  token1: this.props.token1_name,
                  token2: this.props.token2_name,
                }
              )}
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.confirm_cancel}>
              {this.props.intl.formatMessage({ id: "取消" })}
            </Button>
            <Button onClick={this.cancel_all} color="primary">
              {this.props.intl.formatMessage({ id: "确认" })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TradingHistory));
