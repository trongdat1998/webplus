// 订单-币币订单
import React from "react";
import { Iconfont, Table, message } from "../../lib";
import { FormattedMessage, injectIntl } from "react-intl";
import moment from "moment";
import math from "../../utils/mathjs";
import helper from "../../utils/helper";
import CONST from "../../config/const";
import classnames from "classnames";
import route_map from "../../config/route_map";
import WSDATA from "../../models/data_source";
import getData from "../../services/getData";
import {
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./order.style";
import { CopyToClipboard } from "react-copy-to-clipboard";

class TradingHistory extends React.Component {
  constructor() {
    super();
    this.state = {
      open: {},
      openPlan: {}, // 展开的计划委托订单
      confirm: false,
      open_loading: false,
      side: "ALL",
      token1: "",
      token2: "ALL",
      entrust_type: CONST.ENTRUST_TYPE.NORMAL,
    };
    this.orderCancel = this.orderCancel.bind(this);
    this.getMore = this.getMore.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.first = this.first.bind(this);
    this.showMoreDetials = this.showMoreDetials.bind(this);
    this.onEntrustTypeChange = this.onEntrustTypeChange.bind(this);
  }
  componentDidMount() {
    // 用户订单页
    if (window.location.pathname === route_map.order) {
      const trading_index = window.localStorage.trading_index;
      if (
        (trading_index || trading_index === 0) &&
        this.props.trading_index !== trading_index
      ) {
        this.props.dispatch({
          type: "layout/handleChange",
          payload: {
            trading_index: Number(trading_index) || 0,
          },
        });
      }
    }
    this.first();
  }

  // 拉取第一次数据
  // 等待ws失败3次后发起第一次请求
  async first() {
    WSDATA.clear("new_order_source");
    await this.props.dispatch({
      type: "layout/save",
      payload: {
        // 当前委托
        open_orders: [],
        open_orders_more: true, // 是否还有更多数据
        open_plan_orders: [],
        open_plan_orders_more: true, // 是否还有更多数据
        // 历史委托
        history_orders: [],
        history_orders_more: true, // 是否还有更多数据
        history_plan_orders: [],
        history_plan_orders_more: true, // 是否还有更多数据
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

  reopen = (id, reopen) => {
    if (reopen) {
      this.first();
    }
  };

  componentDidUpdate() {
    if (this.props.ws && !this.state.subed && this.props.userinfo.userId) {
      this.setState(
        {
          subed: true,
        },
        () => {
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
            this.httpAction,
            this.callback,
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
  }
  httpAction = async (payload) => {
    await this.props.dispatch({
      type: "layout/httpUpdateOrder",
      payload: {},
    });
  };
  httpUpdatePlanOrder = async (payload) => {
    await this.props.dispatch({
      type: "layout/httpUpdatePlanOrder",
      payload: {},
    });
  };
  callback = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("new_order_source", data.data);
  };
  callbackPlanOrder = (data) => {
    if (data.data && data.data.length) {
      WSDATA.setData("new_plan_order_source", data.data);
    }
  };
  callbackMatch = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("history_trades_source", data.data);
  };

  onSelect(e, index) {
    this.props.dispatch({
      type: "layout/handleChange",
      payload: {
        trading_index: index,
      },
    });
    if (index != 1) {
      this.setState({
        open: {},
      });
    }
  }

  onEntrustTypeChange(event) {
    this.setState({
      entrust_type: event.target.value,
    });
  }

  showMoreDetials(record, i, e) {
    const n = this.state.open;
    if (this.state.open_loading) return;
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
          open_loading: true,
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
        open_loading: false,
      });
    }
  };
  copy = () => {
    message.info(
      this.props.intl.formatMessage({
        id: "复制成功",
      })
    );
  };
  async orderCancel(record, i) {
    // 撤单
    await this.props.dispatch({
      type:
        this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
          ? "layout/orderCancel"
          : "layout/cancelPlanOrder",
      payload: {
        client_order_id: new Date().getTime(),
        account_id: record.accountId,
        order_id: record.orderId,
        i,
      },
    });
    // 拉取最新资产信息
    await this.props.dispatch({
      type: "layout/getAccount",
      payload: {},
    });

    // await this.props.dispatch({
    //   type: "exchange/setAvailable",
    //   payload: {
    //     user_balance: this.props.user_balance,
    //     base_precision: this.props.base_precision
    //   }
    // });
  }
  // 获取更多
  getMore(column) {
    this.props.dispatch({
      type: "layout/getOrders",
      payload: {
        column,
      },
    });
  }
  cancel_all = () => {
    const state = this.state;
    let params = {};
    if (state.token1 && state.token2) {
      params["symbol_ids"] = (state.token1 + state.token2 + "").toUpperCase();
    }
    if (state.side && state.side != "ALL") {
      params["side"] = state.side;
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
  tokenChange = (key) => (e) => {
    this.setState({
      [key]: (e.target.value || "").toUpperCase(),
    });
    this.clearMoreDetials();
  };

  render() {
    const classes = this.props.classes;
    let sysmbols = this.props.config.symbols_obj.coin;
    // 当前委托
    const column_current_orders = [
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
          return <FormattedMessage id={text} />;
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
            <em className={record.side === "BUY" ? classes.green : classes.red}>
              <FormattedMessage id={text} />
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
            return <FormattedMessage id={record.type} />;
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
              <span className={classes.grey}> {record.quoteTokenName}</span>
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
              <span className={classes.grey}> {record.baseTokenName}</span>
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
              <span className={classes.grey}> {record.baseTokenName}</span>
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
            return "--";
          }
          const q = math
            .chain(math.bignumber(record.price))
            .multiply(math.bignumber(record.origQty))
            .format({ notation: "fixed" })
            .done();
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    q,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "quotePrecision"
                      ]
                    ]
                  )
                : q}
              <span className={classes.grey}> {record.quoteTokenName}</span>
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
      //     const q = math
      //       .chain(math.bignumber(record.origQty))
      //       .subtract(math.bignumber(record.executedQty))
      //       .format({ notation: "fixed" })
      //       .done();
      //     return (
      //       <p>
      //         {sysmbols[record.baseTokenId + record.quoteTokenId]
      //           ? helper.digits(
      //               q,
      //               CONST["depth"][
      //                 sysmbols[record.baseTokenId + record.quoteTokenId][
      //                   "basePrecision"
      //                 ]
      //               ]
      //             )
      //           : q}
      //         <span className={classes.grey}> {record.baseTokenName}</span>
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
            <span
              className={classes.cancel}
              onClick={this.orderCancel.bind(this, record, i)}
            >
              {this.props.intl.formatMessage({
                id: "撤单",
              })}
            </span>
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
              className={classes.cancel}
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
    const column_history_orders = [
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
          return <FormattedMessage id={text || ""} />;
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
            <em className={record.side === "BUY" ? classes.green : classes.red}>
              <FormattedMessage id={text} />
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
            return <FormattedMessage id={record.type} />;
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
                <span className={classes.grey}> {record.quoteTokenName}</span>
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
              <span className={classes.grey}> {record.quoteTokenName}</span>
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
                <span className={classes.grey}> {record.baseTokenName}</span>
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
                <span className={classes.grey}> {record.quoteTokenName}</span>
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
              <span className={classes.grey}> {record.baseTokenName}</span>
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
                ? helper.digits(
                    text,
                    8
                    // CONST["depth"][
                    //   sysmbols[record.baseTokenId + record.quoteTokenId][
                    //     "minPricePrecision"
                    //   ]
                    // ]
                    // CONST["depth"][
                    //   sysmbols[record.baseTokenId + record.quoteTokenId][
                    //     "quotePrecision"
                    //   ]
                    // ]
                  )
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
          return (
            <span
              onClick={this.showMoreDetials.bind(this, record, i)}
              id={"s" + record.orderId}
              className={classes.cancel}
            >
              {this.props.intl.formatMessage({
                id: "详情",
              })}
              {this.state.open[record.orderId] ? (
                <Iconfont type="arrowUp" style={{ fontSize: "12px" }} />
              ) : (
                <Iconfont type="arrowDown" style={{ fontSize: "12px" }} />
              )}
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
          if (record.type == "MARKET" && record.side == "BUY") {
            return "--";
          } else {
            return (
              <p>
                {sysmbols[record.baseTokenId + record.quoteTokenId]
                  ? helper.digits(
                      record.origQty,
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
              className={classes.cancel}
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
            <span>
              {moment.utc(Number(text)).local().format("YYYY/MM/DD HH:mm:ss")}
            </span>
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
                ? `${helper.format(
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
                <span>{this.props.intl.formatMessage({ id: "复制" })}</span>
              </p>
            </CopyToClipboard>
          );
        },
      },
    ];
    // 历史计划委托详情
    const column_plan_history_detail = [
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
          return <FormattedMessage id={text} />;
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
            <em className={record.side === "BUY" ? classes.green : classes.red}>
              <FormattedMessage id={text} />
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
              <span className={classes.grey}> {record.quoteTokenName}</span>
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
              <span className={classes.grey}> {record.baseTokenName}</span>
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
          const q = math
            .chain(math.bignumber(record.price))
            .multiply(math.bignumber(record.quantity))
            .format({ notation: "fixed" })
            .done();
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    q,
                    8
                    // CONST["depth"][
                    //   sysmbols[record.baseTokenId + record.quoteTokenId][
                    //     "quotePrecision"
                    //   ]
                    // ]
                  )
                : q}
              <span className={classes.grey}> {record.quoteTokenName}</span>
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
              <span className={classes.grey}> {record.feeTokenName}</span>
            </p>
          );
        },
      },
    ];

    const data_current_orders = (
      helper.excludeRepeatArray("orderId", this.props.open_orders, "time") || []
    )
      .sort((a, b) => (a.time - b.time >= 0 ? -1 : 1))
      .filter((a) => {
        if (
          (!this.state.token1 ||
            a.baseTokenName.indexOf(this.state.token1) > -1 ||
            a.baseTokenId.indexOf(this.state.token1) > -1) &&
          (a.quoteTokenId == this.state.token2 || this.state.token2 == "ALL") &&
          (a.side == this.state.side || this.state.side == "ALL")
        ) {
          return true;
        }
        return false;
      });

    const data_current_plan_orders = (
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
          (!this.state.token1 ||
            a.baseTokenName.indexOf(this.state.token1) > -1 ||
            a.baseTokenId.indexOf(this.state.token1) > -1) &&
          (a.quoteTokenId == this.state.token2 || this.state.token2 == "ALL") &&
          (a.side == this.state.side || this.state.side == "ALL")
        ) {
          return true;
        }
        return false;
      });

    const data_history_orders = (
      helper.excludeRepeatArray("orderId", this.props.history_orders, "time") ||
      []
    )
      .sort((a, b) => (a.time - b.time >= 0 ? -1 : 1))
      .filter((a) => {
        if (
          (!this.state.token1 ||
            a.baseTokenName.indexOf(this.state.token1) > -1 ||
            a.baseTokenId.indexOf(this.state.token1) > -1) &&
          (a.quoteTokenId == this.state.token2 || this.state.token2 == "ALL") &&
          (a.side == this.state.side || this.state.side == "ALL")
        ) {
          return true;
        }
        return false;
      });

    const data_history_plan_orders = (
      helper.excludeRepeatArray(
        "orderId",
        this.props.history_plan_orders,
        "time"
      ) || []
    )
      .sort((a, b) => (a.time - b.time >= 0 ? -1 : 1))
      .filter((a) => {
        if (
          (!this.state.token1 ||
            a.baseTokenName.indexOf(this.state.token1) > -1 ||
            a.baseTokenId.indexOf(this.state.token1) > -1) &&
          (a.quoteTokenId == this.state.token2 || this.state.token2 == "ALL") &&
          (a.side == this.state.side || this.state.side == "ALL")
        ) {
          return true;
        }
        return false;
      });

    const userinfo = this.props.userinfo;
    const loading = this.props.loading || { effects: {} };
    const { entrust_type } = this.state;

    return (
      <div className={classes.order}>
        <h2>{this.props.intl.formatMessage({ id: "币币订单" })}</h2>
        <div style={{ display: "flex" }}>
          <Tabs
            value={this.props.trading_index}
            onChange={this.onSelect}
            indicatorColor="primary"
            textColor="primary"
            className={classes.tabRoot}
            classes={{
              indicator: classes.indicator,
            }}
          >
            <Tab
              classes={{
                root: classes.tab,
                labelContainer: classes.labelContainer,
              }}
              label={this.props.intl.formatMessage({ id: "当前委托" })}
            />
            <Tab
              classes={{ root: classes.tab }}
              label={this.props.intl.formatMessage({ id: "历史委托" })}
            />
            <Tab
              classes={{ root: classes.tab }}
              label={this.props.intl.formatMessage({ id: "历史成交" })}
            />
          </Tabs>
          <div className={classes.selectSymbol}>
            <div className={classes.chooseSymbol}>
              <TextField
                value={this.state.token1}
                onChange={this.tokenChange("token1")}
                style={{ margin: "0 5px 0 0", width: 100 }}
                placeholder={this.props.intl.formatMessage({ id: "币种" })}
              />
              <span className={classes.grey}>/</span>
              <Select
                value={this.state.token2}
                onChange={this.tokenChange("token2")}
                style={{ margin: "0 25px 0 5px" }}
              >
                <MenuItem value="ALL">
                  {this.props.intl.formatMessage({ id: "全部" })}
                </MenuItem>
                {(this.props.coin_quoteToken || []).map((item) => {
                  return (
                    <MenuItem key={item.tokenId} value={item.tokenId}>
                      {item.tokenName}
                    </MenuItem>
                  );
                })}
              </Select>
              <Select
                style={{ margin: "0 25px 0 0" }}
                value={this.state.side}
                onChange={this.tokenChange("side")}
              >
                <MenuItem value="ALL">
                  {this.props.intl.formatMessage({ id: "全部" })}
                </MenuItem>
                <MenuItem value="BUY">
                  {this.props.intl.formatMessage({ id: "买入" })}
                </MenuItem>
                <MenuItem value="SELL">
                  {this.props.intl.formatMessage({ id: "卖出" })}
                </MenuItem>
              </Select>
              {this.props.trading_index == 0 ||
              this.props.trading_index == 1 ? (
                <Select
                  style={{ margin: "0 25px 0 0" }}
                  value={this.state.entrust_type}
                  onChange={this.onEntrustTypeChange}
                >
                  <MenuItem value={CONST.ENTRUST_TYPE.NORMAL}>
                    {this.props.intl.formatMessage({ id: "普通委托" })}
                  </MenuItem>
                  <MenuItem value={CONST.ENTRUST_TYPE.PLAN}>
                    {this.props.intl.formatMessage({ id: "计划委托" })}
                  </MenuItem>
                </Select>
              ) : (
                ""
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  this.setState({
                    side: "ALL",
                    token2: "ALL",
                    token1: "",
                  });
                  this.clearMoreDetials();
                }}
              >
                {this.props.intl.formatMessage({ id: "重置" })}
              </Button>
            </div>
            <div>
              {this.props.trading_index === 0 ? (
                loading.effects["exchange/order_cancel_all"] ? (
                  <Button
                    color="primary"
                    variant="contained"
                    disabled
                    className={classes.cancelBtn}
                  >
                    <CircularProgress color="primary" size={20} />
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.confirm_open}
                    className={classes.cancelBtn}
                  >
                    {this.props.intl.formatMessage({ id: "全部撤单" })}
                  </Button>
                )
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {this.props.trading_index == 0 ? (
          <Table
            className={classes.order_table}
            widthStyle={classes.order_table_width}
            data={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? data_current_orders
                : data_current_plan_orders
            }
            titles={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? column_current_orders
                : column_current_plan_orders
            }
            hasMore={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
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
            getMore={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? this.getMore.bind(this, "open_orders")
                : this.getMore.bind(this, "open_plan_orders")
            }
          />
        ) : (
          ""
        )}
        {this.props.trading_index == 1 ? (
          <Table
            className={classes.order_table}
            widthStyle={classes.order_table_width3}
            dataDescKey="orderId"
            dataDesc={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? this.state.open
                : this.state.openPlan
            }
            dataDescTitles={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? column_history_detail
                : column_plan_history_detail
            }
            dataStyle={classes.match_details}
            dataDescTitleStyle={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? classes.match_title
                : classes.plan_match_title
            }
            dataDescStyle={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? classes.match_info
                : classes.plan_match_info
            }
            listHeight={40}
            data={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? data_history_orders
                : data_history_plan_orders
            }
            titles={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? column_history_orders
                : column_history_plan_orders
            }
            hasMore={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
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
            getMore={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? this.getMore.bind(this, "history_orders")
                : this.getMore.bind(this, "history_plan_orders")
            }
          />
        ) : (
          ""
        )}
        {this.props.trading_index == 2 ? (
          <Table
            className={classes.order_table}
            widthStyle={classnames(
              classes.order_table_width,
              classes.order_table_width2
            )}
            data={(
              helper.excludeRepeatArray(
                "tradeId",
                this.props.history_trades,
                "time"
              ) || []
            )
              .sort((a, b) => (a.time - b.time >= 0 ? -1 : 1))
              .filter((a) => {
                if (
                  (!this.state.token1 ||
                    a.baseTokenName.indexOf(this.state.token1) > -1 ||
                    a.baseTokenId.indexOf(this.state.token1) > -1) &&
                  (a.quoteTokenId == this.state.token2 ||
                    this.state.token2 == "ALL") &&
                  (a.side == this.state.side || this.state.side == "ALL")
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
        <Dialog open={this.state.confirm}>
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "撤单确认" })}
          </DialogTitle>
          <DialogContent>
            <p style={{ margin: "0 0 15px" }}>
              {this.props.intl.formatMessage({
                id:
                  this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                    ? "请确认您要撤销当前全部币币委托单？"
                    : "请确认您要撤销当前全部计划委托单？",
              })}
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
