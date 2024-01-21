// 订单-杠杆订单
import React from "react";
import classnames from "classnames";

import { FormattedMessage, injectIntl } from "react-intl";
import moment from "moment";

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

import { CopyToClipboard } from "react-copy-to-clipboard";
import { withStyles } from "@material-ui/core/styles";

import OpenMarginModal from "../public/open_margin_modal";
import { Iconfont, Table, message } from "../../lib";
import math from "../../utils/mathjs";
import helper from "../../utils/helper";
import CONST from "../../config/const";
import route_map from "../../config/route_map";
import WSDATA from "../../models/data_source";
import styles from "./order.style";

class MarginOrder extends React.Component {
  constructor() {
    super();
    this.state = {
      open: {},
      openPlan: {},
      confirm: false,
      open_loading: false,
      side: "ALL",
      token1: "",
      token2: "ALL",
      lever_index:
        localStorage.lever_index && localStorage.lever_index != "undefined"
          ? Number(localStorage.lever_index)
          : 0,
      entrust_type: CONST.ENTRUST_TYPE.NORMAL,
      marginProtocolModal: false,
    };
    this.orderCancel = this.orderCancel.bind(this);
    this.getMore = this.getMore.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.showMoreDetials = this.showMoreDetials.bind(this);
    this.showPlanOrderDetails = this.showPlanOrderDetails.bind(this);
    this.onEntrustTypeChange = this.onEntrustTypeChange.bind(this);
    this.closeMarginProtocolModal = this.closeMarginProtocolModal.bind(this);
  }

  componentDidMount() {
    if (!this.props.userinfo.openMargin) {
      this.setState({
        marginProtocolModal: true,
      });
    }
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    // 只要 props. 改变，就改变 state
    if (nextProps.userinfo.openMargin !== this.props.userinfo.openMargin) {
      this.setState({
        marginProtocolModal: !nextProps.userinfo.openMargin,
      });
    }
  }

  closeMarginProtocolModal() {
    this.setState({
      marginProtocolModal: false,
    });
  }

  // http拉取第一次数据
  // 等待ws失败3次后发起第一次请求
  async fetchData() {
    WSDATA.clear("margin_new_order_source");
    await this.props.dispatch({
      type: "lever/save",
      payload: {
        lever_open_orders: [], // 当前委托
        lever_open_orders_more: true, // 是否还有更多数据
        lever_open_plan_orders: [], // 当前委托
        lever_open_plan_orders_more: true, // 是否还有更多数据
        lever_history_orders: [], // 历史委托
        lever_history_orders_more: true, // 是否还有更多数据
        lever_history_plan_orders: [], // 历史委托
        lever_history_plan_orders_more: true, // 是否还有更多数据
        lever_history_trades: [], // 历史成交
        margin_trades_source: [], // 历史成交源数据
        lever_history_trades_more: true, // 是否还有更多数据
        force_close_orders: [], // 强平订单,
        force_close_orders_more: true,
        loan_orders: [], // 借还历史,
        loan_orders_more: true,
        repay_records: [], // 还币记录
        repay_records_more: true,
      },
    });
    // 获取当前委托
    this.getMore("lever_open_orders");
    this.getMore("lever_open_plan_orders");
    // 获取历史委托
    this.getMore("lever_history_orders");
    this.getMore("lever_history_plan_orders");
    // 获取历史成交
    this.getMore("lever_history_trades");
    // 获取强平订单
    this.getMore("force_close_orders");
    // 获取借还历史
    this.getMore("loan_history");
    this.getMore("repay_history");
  }
  reopen = (id, reopen) => {
    if (reopen) {
      this.fetchData();
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
              id: "margin_order",
              topic: "margin_order",
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
          this.props.ws.sub(
            {
              id: "margin_plan_order",
              topic: "margin_plan_order",
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
              id: "margin_match",
              topic: "margin_match",
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
      type: "lever/httpUpdateOrder",
      payload: {},
    });
  };

  httpUpdatePlanOrder = async (payload) => {
    await this.props.dispatch({
      type: "lever/httpUpdatePlanOrder",
      payload: {},
    });
  };

  callback = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("margin_new_order_source", data.data);
  };

  // 计划委托ws回调
  callbackPlanOrder = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("margin_plan_order_source", data.data);
  };

  callbackMatch = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("margin_trades_source", data.data);
  };

  onSelect(e, index) {
    window.localStorage.lever_index = index;
    this.setState({
      lever_index: index,
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
    // 折叠详情
    if (n[record.orderId]) {
      delete newn[record.orderId];
      this.setState({
        open: newn,
        open_orderid: null,
        open_loading: false,
      });
    } else {
      newn[record.orderId] = {
        data: [],
        loading: true,
      };
      this.setState(
        {
          open: newn,
          open_loading: true,
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
              type: "lever/getPlanOrderDetail",
              payload: {
                account_type: CONST.ACCOUNT_TYPE.MARGIN,
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
    const result = await this.props.dispatch({
      type: "lever/getOrderDetail",
      payload: {
        order_id,
        trade_id,
        limit: 10,
      },
    });
    if (result) {
      let n = { data: result, loading: false };
      let newopen = { ...this.state.open };
      newopen[order_id] = n;
      this.setState({
        open: newopen,
        open_orderid: "",
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
          ? "lever/cancel_order"
          : "lever/cancel_plan_order",
      payload: {
        client_order_id: new Date().getTime(),
        account_id: record.accountId,
        account_type: CONST.ACCOUNT_TYPE.MARGIN,
        order_id: record.orderId,
        i,
      },
    });
    // 拉取最新资产信息
    await this.props.dispatch({
      type: "layout/getAccount",
      payload: {},
    });
    await this.props.dispatch({
      type: "lever/setAvailable",
      payload: {
        user_balance: this.props.user_balance,
        base_precision: this.props.base_precision,
      },
    });
  }
  // 获取更多
  getMore(column) {
    if (
      column == "lever_open_orders" ||
      column == "lever_open_plan_orders" ||
      column == "lever_history_orders" ||
      column == "lever_history_plan_orders" ||
      column == "force_close_orders"
    ) {
      this.props.dispatch({
        type: "lever/getOrders",
        payload: {
          api: `${column}`,
        },
      });
    } else if (column == "lever_history_trades") {
      this.props.dispatch({
        type: "lever/getDeals",
        payload: {},
      });
    } else if (column == "loan_history") {
      this.props.dispatch({
        type: "lever/getLoanOrders",
        payload: {},
      });
    } else if (column == "repay_history") {
      this.props.dispatch({
        type: "lever/getRepayRecords",
        payload: {},
      });
    }
  }
  cancel_all = () => {
    const state = this.state;
    let params = {
      account_type: CONST.ACCOUNT_TYPE.MARGIN,
    };
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
              ? "lever/order_cancel_all"
              : "lever/cancelAllPlanOrder",
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
          id: "委托总额",
        }),
        key: "executed_amount",
        render: (text, record) => {
          // 市价买单
          if (record.type === "MARKET" && record.side === "BUY") {
            return (
              <p>
                {" "}
                {helper.digits(
                  record.origQty,
                  CONST["depth"][
                    sysmbols[record.baseTokenId + record.quoteTokenId][
                      "quotePrecision"
                    ]
                  ]
                )}
                <span className={classes.grey}> {record.quoteTokenName}</span>
              </p>
            );
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
          id: "未成交数量",
        }),
        key: "icebergQty",
        render: (text, record) => {
          // 市价买单
          if (record.type === "MARKET" && record.side === "BUY") {
            return "--";
          }
          const q = math
            .chain(math.bignumber(record.origQty))
            .subtract(math.bignumber(record.executedQty))
            .format({ notation: "fixed" })
            .done();
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    q,
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "basePrecision"
                      ]
                    ]
                  )
                : q}
              <span className={classes.grey}> {record.baseTokenName}</span>
            </p>
          );
        },
      },
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
          const legal = record.quotePrecision > record.text ? "≥" : "≤";
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
                <span className={classes.grey}> {record.quoteTokenName}</span>
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
              onClick={this.showMoreDetials.bind(this, record, i)}
              id={"s" + record.orderId}
              className={classes.cancel}
            >
              {this.state.open_orderid == record.orderId ? (
                <CircularProgress
                  size={12}
                  color="primary"
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
          const legal = record.quotePrecision > record.text ? "≥" : "≤";
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
          // limit, market && sell  展示数量， 其他展示金额; origQty:接口已处理成对应的值
          if (record.type == "MARKET" && record.side == "BUY") {
            return "--";
          } else {
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
        key: "updateTime",
        render: (text, record) => {
          if (!text) {
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
                ? `${helper.format(record.price * record.quantity, 8)}`
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
    // 历史计划委托详细信息
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
    // 强平订单
    const column_forse_close_order = [
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
          id: "状态",
        }),
        key: "status",
        render: (text, record) => {
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
              onClick={this.showMoreDetials.bind(this, record, i)}
              id={"s" + record.orderId}
              className={classes.cancel}
            >
              {this.state.open_orderid == record.orderId ? (
                <CircularProgress
                  size={12}
                  color="primary"
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
    // 借币历史
    const column_loan_history = [
      {
        title: this.props.intl.formatMessage({
          id: "借币时间",
        }),
        key: "createdAt",
        render: (text, record) => {
          return (
            <span data-orderid={record.lendOrderId}>
              {moment
                .utc(Number(record.createdAt))
                .local()
                .format("YYYY/MM/DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "tokenId",
      },
      {
        title: this.props.intl.formatMessage({
          id: "lever.borrow.dailyRate",
        }),
        key: "interestRate1",
        render: (text, record) => {
          return (
            math
              .chain(math.bignumber(record.interestRate1))
              .multiply(86400)
              .multiply(100)
              .format({
                notation: "fixed",
                precision: 5,
              }) + "%"
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "借币数量",
        }),
        key: "loanAmount",
        render: (text, record) => {
          return helper.digits(math.chain(text).done(), 8);
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "产生币息",
        }),
        key: "interestPaid",
        render: (text, record) => {
          return helper.digits(
            math
              .chain(math.bignumber(record.interestPaid))
              .add(math.bignumber(record.interestUnpaid))
              .format({
                notation: "fixed",
              })
              .done(),
            8
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "未还币数量",
        }),
        key: "unpaidAmount",
        render: (text, record) => {
          return helper.digits(math.chain(text).done(), 8);
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "未还币息",
        }),
        key: "interestUnpaid",
        render: (text, record) => {
          return helper.digits(math.chain(text).done(), 8);
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "总应还",
        }),
        key: "",
        render: (text, record) => {
          return (
            <span>
              {helper.digits(
                math
                  .chain(math.bignumber(record.unpaidAmount))
                  .add(math.bignumber(record.interestUnpaid))
                  .format({
                    notation: "fixed",
                  })
                  .done(),
                8
              )}
            </span>
          );
        },
      },
    ];
    // 还币历史
    const column_repay_records = [
      {
        title: this.props.intl.formatMessage({
          id: "还币时间",
        }),
        key: "createdAt",
        render: (text, record) => {
          return (
            <span data-orderid={record.lendOrderId}>
              {moment
                .utc(Number(record.createdAt))
                .local()
                .format("YYYY/MM/DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "tokenId",
      },
      {
        title: this.props.intl.formatMessage({
          id: "已还数量",
        }),
        key: "amount",
        render: (text, record) => {
          return helper.digits(math.chain(text).done(), 8);
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "已还币息",
        }),
        key: "interest",
        render: (text, record) => {
          return helper.digits(math.chain(text).done(), 8);
        },
      },
    ];

    const userinfo = this.props.userinfo;
    const loading = this.props.loading || { effects: {} };

    const openOrdersData = (
      helper.excludeRepeatArray(
        "orderId",
        this.props.lever_open_orders,
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

    const openPlanOrdersData = (
      helper.excludeRepeatArray(
        "orderId",
        this.props.lever_open_plan_orders,
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

    const historyOrdersData = (
      helper.excludeRepeatArray(
        "orderId",
        this.props.lever_history_orders,
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

    const historyPlanOrdersData = (
      helper.excludeRepeatArray(
        "orderId",
        this.props.lever_history_plan_orders,
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

    // 历史成交
    const historyTrades = (
      helper.excludeRepeatArray(
        "tradeId",
        this.props.lever_history_trades,
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
    // 强平订单
    const forceCloseOrders = (
      helper.excludeRepeatArray(
        "orderId",
        this.props.force_close_orders,
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

    // 借币订单
    const loanHistoryOrders = (
      helper.excludeRepeatArray(
        "loanOrderId",
        this.props.loan_orders,
        "updatedAt"
      ) || []
    ).sort((a, b) => (a.createdAt - b.createdAt >= 0 ? -1 : 1));

    // 还币历史
    const repayRecords = (
      helper.excludeRepeatArray(
        "repayOrderId",
        this.props.repay_records,
        "updatedAt"
      ) || []
    ).sort((a, b) => (a.createdAt - b.createdAt >= 0 ? -1 : 1));

    const { entrust_type } = this.state;

    return (
      <div className={classes.order}>
        <h2>{this.props.intl.formatMessage({ id: "lever.orders" })}</h2>
        <div style={{ display: "flex" }}>
          <Tabs
            value={this.state.lever_index}
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

            <Tab
              classes={{ root: classes.tab }}
              label={this.props.intl.formatMessage({ id: "lever.loanHistory" })}
            />
            <Tab
              classes={{ root: classes.tab }}
              label={this.props.intl.formatMessage({
                id: "lever.repayHistory",
              })}
            />
            {/* <Tab
            classes={{ root: classes.tab }}
            label={this.props.intl.formatMessage({
              id: "lever.forceCloseOrders",
            })}
          /> */}
          </Tabs>
          {this.state.lever_index < 3 ? (
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
                {this.state.lever_index == 0 || this.state.lever_index == 1 ? (
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
                {this.state.lever_index == 0 ? (
                  loading.effects["lever/order_cancel_all"] ? (
                    <Button
                      color="primary"
                      variant="contained"
                      disabled
                      className={classes.cancelBtn}
                    >
                      <CircularProgress color="primary" fontSize="12" />
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
          ) : (
            ""
          )}
        </div>
        {this.state.lever_index == 0 ? (
          <Table
            className={classes.order_table}
            widthStyle={classes.order_table_width}
            data={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? openOrdersData
                : openPlanOrdersData
            }
            titles={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? column_current
                : column_current_plan_orders
            }
            hasMore={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? this.props.lever_open_orders_more
                : this.props.lever_open_plan_orders_more
            }
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["lever/getOrders"])
                : false
            }
            showNoMoreData={true}
            useWindow={false}
            getMore={this.getMore.bind(
              this,
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? "lever_open_orders"
                : "lever_open_plan_orders"
            )}
          />
        ) : (
          ""
        )}
        {this.state.lever_index == 1 ? (
          <Table
            className={classes.order_table}
            widthStyle={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? classes.order_table_width
                : classes.order_table_width1
            }
            dataDescKey="orderId"
            dataDesc={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? this.state.open
                : this.state.openPlan
            }
            dataStyle={classes.match_details}
            dataDescTitles={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? column_history_detail
                : column_history_plan_order_detail
            }
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
                ? historyOrdersData
                : historyPlanOrdersData
            }
            titles={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? column_history_orders
                : column_history_plan_orders
            }
            hasMore={
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? this.props.lever_history_orders_more
                : this.props.lever_history_plan_orders_more
            }
            showNoMoreData={true}
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["lever/getOrders"])
                : false
            }
            useWindow={false}
            getMore={this.getMore.bind(
              this,
              entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? "lever_history_orders"
                : "lever_history_plan_orders"
            )}
          />
        ) : (
          ""
        )}
        {this.state.lever_index == 2 ? (
          <Table
            className={classes.order_table}
            widthStyle={classnames(
              classes.order_table_width,
              classes.order_table_width2
            )}
            data={historyTrades}
            titles={column_trade}
            showNoMoreData={true}
            hasMore={this.props.lever_history_trades_more}
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["lever/getDeals"])
                : false
            }
            useWindow={false}
            getMore={this.getMore.bind(this, "lever_history_trades")}
          />
        ) : (
          ""
        )}

        {this.state.lever_index == 3 ? (
          <Table
            className={classes.order_table}
            widthStyle={classnames(classes.order_table_width3)}
            data={loanHistoryOrders}
            titles={column_loan_history}
            showNoMoreData={true}
            hasMore={this.props.loan_orders_more}
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["lever/getLoanOrders"])
                : false
            }
            useWindow={false}
            getMore={this.getMore.bind(this, "loan_history")}
          />
        ) : (
          ""
        )}
        {this.state.lever_index == 4 ? (
          <Table
            className={classes.order_table}
            data={repayRecords}
            titles={column_repay_records}
            showNoMoreData={true}
            hasMore={this.props.repay_records_more}
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["lever/getRepayRecords"])
                : false
            }
            useWindow={false}
            getMore={this.getMore.bind(this, "repay_history")}
          />
        ) : (
          ""
        )}
        {/* 强平订单 */}
        {this.state.lever_index == 5 ? (
          <Table
            className={classes.order_table}
            widthStyle={classes.order_table_width}
            dataDescKey="orderId"
            dataDesc={this.state.open}
            dataDescTitles={column_history_detail}
            dataStyle={classes.match_details}
            dataDescTitleStyle={classes.match_title}
            dataDescStyle={classes.match_info}
            listHeight={40}
            data={forceCloseOrders}
            titles={column_forse_close_order}
            showNoMoreData={true}
            hasMore={this.props.force_close_orders_more}
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["lever/getOrders"])
                : false
            }
            useWindow={false}
            getMore={this.getMore.bind(this, "force_close_orders")}
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
                id: "请确认您要撤销当前全部杠杆委托单",
              })}
              ？
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
        <OpenMarginModal
          open={this.state.marginProtocolModal}
          onClose={this.closeMarginProtocolModal}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(MarginOrder));
