// 交易订单
import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import moment from "moment";
import classnames from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { Table, message, Iconfont } from "../../lib";
import math from "../../utils/mathjs";
import helper from "../../utils/helper";
import CONST from "../../config/const";
import route_map from "../../config/route_map";
import WSDATA from "../../models/data_source";
import getData from "../../services/getData";
import { withStyles } from "@material-ui/core/styles";
import {
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  ButtonGroup,
} from "@material-ui/core";

import styles from "../public/quote_style";
import RepayCoinModal from "../public/repay_coin_modal";
import { turn } from "mathjs/lib/type/bignumber";

class TradingHistory extends React.Component {
  constructor() {
    super();
    this.state = {
      open: {},
      openPlan: {},
      confirm: false,
      openOrderId: "", // 当前加载详情orderid
      openPlanOrderId: "", // 当前加载详情的计划委托orderid
      all_symbol: false,
      all_borrow_record: false,
      subed: false,
      tabs: [
        {
          name: "当前委托",
          key: "currentOrder",
        },
        {
          name: "历史委托",
          key: "historyOrder",
        },
        {
          name: "历史成交",
          key: "historyTrade",
        },
        {
          name: "我的资产",
          key: "myAsset",
          needLogin: true,
        },
        {
          name: "lever.currentMargin",
          key: "currentMargin",
        },
        // "lever.forceCloseOrders",
      ],
      repayModal: false,
      lendOrder: {},
      tokenId: "",
      entrust_type: CONST.ENTRUST_TYPE.NORMAL, // 委托类型
    };
    this.orderCancel = this.orderCancel.bind(this);
    this.getMore = this.getMore.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.first = this.prepareData.bind(this);
    this.showMoreDetails = this.showMoreDetails.bind(this);
    this.showMorePlanDetails = this.showMorePlanDetails.bind(this);
  }
  componentDidMount() {
    this.prepareData();
  }
  componentDidUpdate(preProps) {
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
    if (
      preProps.symbol_id &&
      this.props.symbol_id &&
      preProps.symbol_id != this.props.symbol_id &&
      !this.state.all_symbol
    ) {
      this.prepareData();
    }
  }
  httpAction = async (payload) => {
    await this.props.dispatch({
      type: "lever/httpUpdateOrder",
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
      type: "lever/httpUpdatePlanOrder",
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
  // 当前委托ws回调
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
  // 历史成交ws回调
  callbackMatch = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("margin_trades_source", data.data);
  };
  // after ws reopen, refresh data
  reopen = (id, reopen) => {
    if (reopen) {
      this.prepareData();
    }
  };
  async prepareData() {
    WSDATA.clear("margin_new_order_source");
    await this.props.dispatch({
      type: "lever/save",
      payload: {
        lever_open_orders: [], // 当前委托
        lever_open_orders_more: true, // 是否还有更多数据

        lever_open_plan_orders: [], // 当前计划委托
        lever_open_plan_orders_more: true, // 是否还有更多数据

        lever_history_orders: [], // 历史委托
        lever_history_orders_more: true, // 是否还有更多数据

        lever_history_plan_orders: [], // 历史计划委托
        lever_history_plan_orders_more: true, // 是否还有更多数据

        lever_history_trades: [], // 历史成交
        margin_trades_source: [], // 历史成交源数据
        lever_history_trades_more: true, // 是否还有更多数据

        force_close_orders: [], // 强平订单,
        force_close_orders_more: true,

        loan_orders: [], // 当前借币,
        loan_orders_more: true,
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
    // 获取当前借币
    this.getMore("loan_orders");
  }
  onSelect = (event, value) => {
    this.props.dispatch({
      type: "lever/handleChange",
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
    if (this.state.openOrderId) return;
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
          openOrderId: record.orderId,
        },
        () => {
          this.props
            .dispatch({
              type: "lever/getOrderDetail",
              payload: {
                order_id: record.orderId,
                limit: 10,
              },
            })
            .then((result) => {
              let n = { data: result, more: true, loading: true };
              let newopen = { ...this.state.open };
              newopen[record.orderId] = n;
              this.setState({
                open: newopen,
                openOrderId: "",
              });
            });
        }
      );
    }
  }
  showMorePlanDetails(record) {
    const n = this.state.openPlan;
    if (this.state.openPlanOrderId) return;
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
                limit: 10,
              },
            })
            .then((result) => {
              if (result) {
                let n = {
                  data: result.order ? [result.order] : [],
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
  clearMoreDetails = () => {
    this.setState({
      open: {},
      openPlan: {},
    });
  };

  async orderCancel(record, i) {
    this.setState({
      cancel_order_id: record.orderId,
    });
    // 撤单
    if (!record.triggerPrice) {
      await this.props.dispatch({
        type: "lever/cancel_order",
        payload: {
          client_order_id: new Date().getTime(),
          account_id: record.accountId,
          order_id: record.orderId,
          i,
        },
      });
    } else {
      await this.props.dispatch({
        type: "lever/cancel_plan_order",
        payload: {
          client_order_id: new Date().getTime(),
          account_type: CONST.ACCOUNT_TYPE.MARGIN,
          order_id: record.orderId,
          i,
        },
      });
    }
    // 拉取最新资产信息
    this.props.dispatch({
      type: "lever/getAccount",
      payload: {},
    });
    this.getMore("lever_history_orders");
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
          account_type: CONST.ACCOUNT_TYPE.MARGIN,
          last_id: "",
          is_liquidation_order: column == "force_close_orders",
          symbol_id: this.state.all_symbol
            ? ""
            : (
                this.props.match.params.token1 +
                this.props.match.params.token2 +
                ""
              ).toUpperCase(),
        },
      });
    } else if (column == "lever_history_trades") {
      // 历史成交
      this.props.dispatch({
        type: "lever/getDeals",
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
    } else if (column == "loan_orders") {
      this.props.dispatch({
        type: "lever/getLoanOrders",
      });
    }
  }
  cancel_all = () => {
    let params = {
      account_type: CONST.ACCOUNT_TYPE.MARGIN,
    };
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
  copy = () => {
    message.info(
      this.props.intl.formatMessage({
        id: "复制成功",
      })
    );
  };
  handleRepay = (record) => {
    this.setState({
      repayModal: true,
      lendOrder: record,
      tokenId: record.tokenId,
    });
  };
  closeRepayModal = () => {
    this.setState({
      repayModal: false,
      lendOrder: {},
      tokenId: "",
    });
  };
  onEntrustTypeChange = (type) => {
    this.setState({
      entrust_type: type,
    });
  };
  renderTab() {
    const { classes, userinfo } = this.props;
    let { tabs } = this.state;
    const data = [];
    tabs.forEach((item) => {
      if (!item.needLogin || userinfo.userId) {
        data.push(item);
      }
    });
    return (
      <Tabs
        value={this.props.trading_index}
        onChange={this.onSelect}
        indicatorColor="primary"
        textColor="inherit"
        className={classnames(classes.tabs, "orderTabs")}
      >
        {data.map((item, i) => {
          return (
            <Tab
              value={i}
              key={item.key}
              label={this.props.intl.formatMessage({
                id: item.name,
              })}
            />
          );
        })}
      </Tabs>
    );
  }
  render() {
    let sysmbols = this.props.config.symbols;
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
                  : record.origQty}
                <span>{record.quoteTokenName}</span>
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
          id: "未成交数量",
        }),
        key: "icebergQty",
        render: (text, record) => {
          // 市价买单
          if (record.type === "MARKET" && record.side === "BUY") {
            return "--";
          }
          return (
            <p>
              {sysmbols[record.baseTokenId + record.quoteTokenId]
                ? helper.digits(
                    math
                      .chain(math.bignumber(record.origQty))
                      .subtract(math.bignumber(record.executedQty))
                      .format({ notation: "fixed" })
                      .done(),
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "basePrecision"
                      ]
                    ]
                  )
                : math
                    .chain(math.bignumber(record.origQty))
                    .subtract(math.bignumber(record.executedQty))
                    .format({ notation: "fixed", precision: 8 })
                    .done()}
              <span className="grey02"> {record.baseTokenName}</span>
            </p>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "operate",
        render: (text, record, i) => {
          if (record.type === "MARKET") {
            return "";
          }
          return this.props.loading.effects["lever/cancel_order"] &&
            this.state.cancel_order_id == record.orderId ? (
            <p className={classes.operate}>
              <CircularProgress
                size={12}
                color="default"
                style={{
                  position: "relative",
                  top: 2,
                  right: 5,
                }}
              />
            </p>
          ) : (
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
        key: "operate",
        render: (text, record, i) => {
          return record.status == "CANCELED" && record.executedQty <= 0 ? (
            <span />
          ) : (
            <span
              onClick={this.showMoreDetails.bind(this, record, i)}
              id={"s" + record.orderId}
              className={classes.operate}
            >
              {this.state.openOrderId == record.orderId ? (
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
        key: "",
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
                    CONST["depth"][
                      sysmbols[record.baseTokenId + record.quoteTokenId][
                        "quotePrecision"
                      ]
                    ]
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
          // 行情价大于触发价，说明要跌到触发价
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
              onClick={this.showMorePlanDetails.bind(this, record)}
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
        key: "amount",
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
        key: "operate",
        render: (text, record, i) => {
          return record.status == "CANCELED" && record.executedQty <= 0 ? (
            <span />
          ) : (
            <span
              onClick={this.showMoreDetails.bind(this, record, i)}
              id={"s" + record.orderId}
              className={classes.operate}
            >
              {this.state.openOrderId == record.orderId ? (
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
    // 我的借币
    const column_my_borrow = [
      {
        title: this.props.intl.formatMessage({
          id: "借币时间",
        }),
        key: "createdAt",
        render: (text, record) => {
          return moment.utc(Number(text)).local().format("YYYY/MM/DD HH:mm:ss");
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
                precision: 4,
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
          id: "未还币数量",
        }),
        key: "unpaidAmount",
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
          let interest = math
            .chain(math.bignumber(record.interestUnpaid))
            .add(math.bignumber(record.interestPaid))
            .format({
              notation: "fixed",
              precision: 8,
            })
            .done();
          return <span>{interest}</span>;
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
        key: "total",
        render: (text, record) => {
          let total = math
            .chain(math.bignumber(record.interestUnpaid))
            .add(math.bignumber(record.unpaidAmount))
            .format({
              notation: "fixed",
              precision: 8,
            })
            .done();
          return <span>{total}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "借币状态",
        }),
        key: "status",
        render: (text, record) => {
          return record.status == 2 ? (
            <span>
              {this.props.intl.formatMessage({
                id: "已还完",
              })}
            </span>
          ) : (
            <span>
              {this.props.intl.formatMessage({
                id: "未还完",
              })}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "operate",
        render: (text, record) => {
          return (
            <a
              onClick={
                record.status == 2 ? null : this.handleRepay.bind(this, record)
              }
              className={classnames({
                option: true,
                disabled: record.status == 2,
              })}
            >
              {record.status == 1
                ? this.props.intl.formatMessage({
                    id: "还币",
                  })
                : ""}
            </a>
          );
        },
      },
    ];
    const loading = this.props.loading || { effects: {} };
    const { userinfo, classes } = this.props;
    // 当前订单
    let currentList = (
      helper.excludeRepeatArray(
        "orderId",
        this.props.lever_open_orders,
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

    // 当前计划委托
    const currentPlanList = (
      helper.excludeRepeatArray(
        "orderId",
        this.props.lever_open_plan_orders,
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

    // 历史订单
    const historyOrders = (
      helper.excludeRepeatArray(
        "orderId",
        this.props.lever_history_orders,
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

    const historyPlanOrderList = (
      helper.excludeRepeatArray(
        "orderId",
        this.props.lever_history_plan_orders,
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

    // 我的资产
    const myAssets = this.props.lever_balances
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
          return a.tokenId.toUpperCase() >= b.tokenId.toUpperCase() ? -1 : 1;
        }
        return a.free - b.free > 0 ? -1 : 1;
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
              {helper.digits(record.usdtValue, 2)} USDT ≈ {rates[0]}
              {rates[1]}
            </span>
          );
        },
      },
    ];

    // 借币订单
    const loanOrders = (
      helper.excludeRepeatArray(
        "loanOrderId",
        this.props.loan_orders,
        "updatedAt"
      ) || []
    ).filter((a) => {
      if (this.state.all_borrow_record) {
        return true;
      }
      return a.status != 2;
    });

    const symbolInfo = this.props.symbol_info;

    let { tabs } = this.state;

    const enableCancelAllButton =
      (this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL &&
        currentList.length > 0) ||
      (this.state.entrust_type == CONST.ENTRUST_TYPE.PLAN &&
        currentPlanList.length > 0);

    return (
      <div className={this.props.className || classes.orderList}>
        <div className={classes.tabBg}>
          {this.renderTab(tabs)}
          {/* 展示全部币对按钮 */}
          {this.props.trading_index < 3 ? (
            <div className={classes.selectAllSymbol}>
              <FormControlLabel
                className={classes.coin_select}
                classes={{
                  label: classes.label,
                }}
                control={
                  <Checkbox
                    name="all_symbol"
                    onChange={() => {
                      if (loading.effects["lever/getOrders"]) {
                        return;
                      }
                      this.setState(
                        {
                          all_symbol: !this.state.all_symbol,
                        },
                        () => {
                          this.prepareData();
                        }
                      );
                      this.clearMoreDetails();
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
              {this.props.trading_index === 0 && this.props.userinfo.userId ? (
                loading.effects["lever/order_cancel_all"] ? (
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
          {this.props.trading_index === 4 && this.props.userinfo.userId ? (
            <div className={classes.selectAllSymbol}>
              <FormControlLabel
                className={classes.coin_select}
                classes={{
                  label: classes.label,
                }}
                control={
                  <Checkbox
                    name="all_borrow_record"
                    onChange={() => {
                      if (loading.effects["lever/getLoanOrders"]) {
                        return;
                      }
                      this.setState(
                        {
                          all_borrow_record: !this.state.all_borrow_record,
                        },
                        () => {
                          this.prepareData();
                        }
                      );
                      this.clearMoreDetails();
                    }}
                    checked={Boolean(this.state.all_borrow_record)}
                    color="primary"
                    classes={{
                      root: classes.checkRoot,
                    }}
                  />
                }
                label={this.props.intl.formatMessage({ id: "全部借币记录" })}
              />
              <Link
                className="option"
                to={route_map.finance_record + "?tabValue=lever"}
              >
                {this.props.intl.formatMessage({ id: "资产记录" })}
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>
        {this.props.trading_index == 0 && symbolInfo.allowPlan ? (
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
          // 当前委托
          <Table
            className={classes.order_table}
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
            hasMore={this.props.lever_open_orders_more}
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["lever/getOrders"])
                : false
            }
            showNoMoreData={true}
            useWindow={false}
            getMore={this.getMore.bind(
              this,
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? "lever_open_orders"
                : "lever_open_plan_orders"
            )}
          />
        ) : (
          ""
        )}
        {this.props.trading_index == 1 && symbolInfo.allowPlan ? (
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
                ? historyOrders
                : historyPlanOrderList
            }
            titles={
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? column_history
                : column_history_plan_orders
            }
            hasMore={
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? this.props.lever_history_orders_more
                : this.props.history_plan_orders_more
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
              this.state.entrust_type == CONST.ENTRUST_TYPE.NORMAL
                ? "lever_history_orders"
                : "lever_history_plan_orders"
            )}
          />
        ) : (
          ""
        )}
        {this.props.trading_index === 2 ? (
          // 历史成交
          <Table
            className={classes.history_order}
            widthStyle="order_table_width"
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
        {this.props.trading_index === 3 ? (
          // 我的资产
          <Table
            className={classes.mycount}
            widthStyle="order_table_width"
            data={myAssets}
            titles={column_asset}
            hasMore={false}
          />
        ) : (
          ""
        )}
        {this.props.trading_index === 4 ? (
          // 当前借币
          <Table
            className={classes.lever_margin_table}
            widthStyle="order_table_width"
            data={loanOrders}
            titles={column_my_borrow}
            hasMore={this.props.loan_orders_more}
            showNoMoreData={true}
            useWindow={false}
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["lever/getLoanOrders"])
                : false
            }
            getMore={this.getMore.bind(this, "loan_orders")}
          />
        ) : (
          ""
        )}
        {this.props.trading_index === 5 ? (
          // 强平订单
          <Table
            className={classes.order_table}
            widthStyle="order_table_width"
            data={forceCloseOrders}
            titles={column_forse_close_order}
            hasMore={this.props.force_close_orders_more}
            showNoMoreData={true}
            useWindow={false}
            loading={
              userinfo.userId
                ? Boolean(this.props.loading.effects["lever/getOrders"])
                : false
            }
            getMore={this.getMore.bind(this, "force_close_orders")}
          />
        ) : (
          ""
        )}

        <RepayCoinModal
          open={this.state.repayModal}
          onClose={this.closeRepayModal}
          lendOrder={this.state.lendOrder}
          tokenId={this.state.tokenId}
        />
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
                        ? "请确认您要撤销当前全部杠杆委托单？"
                        : "请确认您要撤销{token1}/{token2}杠杆委托单？"
                      : this.state.all_symbol
                      ? "请确认您要撤销当前全部计划委托单？"
                      : "请确认您要撤销{token1}/{token2}计划委托单？",
                },
                {
                  token1: this.props.token1_name,
                  token2: this.props.token2_name,
                }
              )}
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
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TradingHistory));
