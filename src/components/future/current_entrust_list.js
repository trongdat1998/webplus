// 永续合约未成交委托 普通委托订单列表
import React from "react";
import PropTypes from "prop-types";
import { Table, message } from "../../lib";
import { injectIntl } from "react-intl";
import moment from "moment";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import WSDATA from "../../models/data_source";
import CONST from "../../config/const";
import classnames from "classnames";
class OrderList extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.getMore = this.getMore.bind(this);
  }
  componentDidMount() {
    this.getMore(true);
    //this.first();
    // http轮询更新
    //this.update();
    // 从源数据更新到展示数据
    //this.updateData();
    this.props.dispatch({
      type: "layout/getServerTime",
      payload: {},
    });
  }
  componentDidUpdate(preProps) {
    if (
      preProps.params.order_type != this.props.params.order_type ||
      (preProps.tab != 2 && this.props.tab == 2)
    ) {
      this.props.dispatch({
        type: "future/save",
        payload: {
          current_list: [],
          current_more: true,
        },
      });
      this.getMore(true, 0, this.props.params.order_type);
    }
  }
  componentWillReceiveProps(nextProps) {
    // if (this.props.params.order_type != nextProps.params.order_type) {
    //   this.props.dispatch({
    //     type: "future/save",
    //     payload: {
    //       current_list: [],
    //       current_more: true
    //     }
    //   });
    //   this.getMore(true, 0, nextProps.params.order_type);
    // }
  }
  // componentDidUpdate(preProps) {
  //   if (this.props.current_list.length) {
  //     const data = this.props.current_list.filter(
  //       item => item.type.indexOf(this.props.params.order_type) > -1
  //     );
  //     if (data.length != this.props.current_list.length) {
  //       this.props.dispatch({
  //         type: "future/save",
  //         payload: {
  //           current_list: data
  //         }
  //       });
  //     }
  //   }
  // }
  getMore(firstReq, n, order_type) {
    let params = this.props.params;
    params.firstReq = firstReq;
    let obj = { ...params };
    if (order_type) {
      obj.type = order_type;
      obj.order_type = order_type;
    }
    this.props.dispatch({
      type: "future/getCurrentEntrust",
      payload: obj,
    });
  }
  async cancel(id) {
    await this.props.dispatch({
      type: "future/cancelOrder",
      payload: {
        order_id: id,
        client_order_id: new Date().getTime(),
        type: this.props.params.order_type,
      },
      success: () => {
        this.props.dispatch({
          type: "layout/getFuturesAsset",
          payload: {
            token_ids: this.props.match.params.symbolId || "",
          },
        });
      },
    });
  }
  // 止盈止损单撤单
  cancel_loss = (order_id, i) => (e) => {
    this.props.dispatch({
      type: "future/cancelOrder",
      payload: {
        order_id,
        type: "STOP",
        client_order_id: new Date().getTime(),
      },
      cb: (res) => {
        // 撤销成功
        if (res.code == "OK") {
          let data = [...this.props.current_list];
          data.splice(i, 1);
          this.props.dispatch({
            type: "future/save",
            payload: {
              current_list: data,
            },
          });
        } else {
          res.msg && message.error(res.msg);
        }
      },
    });
  };
  // 切换
  goto = async (exchangeId, symbolId) => {
    let url = route_map.future + "/" + symbolId;
    if (
      window.location.pathname.indexOf(route_map.future_current_entrust) > -1
    ) {
      window.location.href = url;
      return;
    }
    this.props.history.push(url);
    // 清除k线时间记录
    window.g_k_update_time = 0;

    // 清除最新成交,深度，盘口数据
    let future_info = this.props.config.symbols_obj.all[symbolId];
    let token2 = future_info.quoteTokenId;
    let token2_name = future_info.quoteTokenName;
    const symbol_quote = this.props.symbol_quote;
    const tokenInfo = symbol_quote[symbolId] || {};
    const buy =
      symbolId.toUpperCase() + this.props.order_choose + "buy_leverage";
    const sale =
      symbolId.toUpperCase() + this.props.order_choose + "sale_leverage";

    const order_setting =
      this.props.order_setting[symbolId.toUpperCase()] || {};
    let buy_risk = "";
    let sale_risk = "";
    (order_setting.riskLimit || []).map((item) => {
      if (item.side == "BUY_OPEN") {
        buy_risk = item.riskLimitId;
      }
      if (item.side == "SELL_OPEN") {
        sale_risk = item.riskLimitId;
      }
    });

    WSDATA.clearAll("qws");
    this.props.dispatch({
      type: "ws/save",
      payload: {
        merged_depth: {},
        depth: {},
        trades: {},
      },
    });

    await this.props.dispatch({
      type: "future/handleChange",
      payload: {
        newTrade: [],
        depth: {
          sell: [],
          buy: [],
        },
        symbol_id: symbolId, // 币对id
        exchange_id: exchangeId,

        sale_quantity: "",
        sale_price: tokenInfo.c || "",
        sale_lever: null, // 杠杠dom节点
        sale_type: 0, // 0= 限价， 1 = 计划委托
        sale_price_type: 0, // 价格类型 : price_types[n]
        sale_trigger_price: "", // 计划委托触发价格
        sale_leverage:
          window.localStorage[sale] || future_info.baseTokenFutures.levers[0], // 杠杆值
        sale_progress: 0, // 买入进度条
        sale_max: 0, // 限价买入最大值，根据用户价格进行计算
        sale_risk, // 风险限额id

        buy_quantity: "",
        buy_price: tokenInfo.c || "",
        buy_lever: null, // 杠杠dom节点
        buy_type: 0, // 0= 限价， 1 = 计划委托
        buy_price_type: 0, // 价格类型 : price_types[n]
        buy_trigger_price: "", // 计划委托触发价格
        buy_leverage:
          window.localStorage[buy] || future_info.baseTokenFutures.levers[0], // 杠杆值
        buy_progress: 0, // 买入进度条
        buy_max: 0, // 限价买入最大值，根据用户价格进行计算
        buy_risk, // 风险限额id

        digitMerge: (future_info.digitMerge || "").split(","),
        aggTrade_digits: CONST.depth[future_info.minPricePrecision],
        max_digits: CONST.depth[future_info.minPricePrecision],
        base_precision: CONST.depth[future_info.basePrecision], // 数量精度 如 8 表示小数留8位
        quote_precision: CONST.depth[future_info.quotePrecision], // 金额精度 如 8 表示小数留8位
        min_price_precision: future_info.minPricePrecision, // 价格交易step, 如 0.1
        min_trade_quantity: future_info.minTradeQuantity, // 数量交易step 如 0.1
        min_trade_amount: future_info.minTradeAmount, // 金额交易step  如 0.1

        token2,
        token2_name,
        future_info: future_info,
      },
    });
  };
  render() {
    const { classes } = this.props;
    let symbols = this.props.config.symbols_obj.futures;
    const sideMap = CONST["sideMap"];
    // 普通委托
    const column_common = [
      {
        title: this.props.intl.formatMessage({
          id: "合约",
        }),
        key: "symbolName",
        render: (text, record) => {
          return (
            <span
              onClick={this.goto.bind(
                this,
                record.exchangeId,
                record.symbolId,
                record.quoteTokenId
              )}
              style={{ cursor: "pointer" }}
              data-orderid={record.orderId}
            >
              {text}
            </span>
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
            <span>
              {moment.utc(Number(text)).local().format("MM-DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "杠杆",
        }),
        key: "leverage",
        render: (text, record) => {
          // 平仓单不显示杠杆
          if (record.side.indexOf("CLOSE") > -1) {
            return <span>--</span>;
          }
          return <span>{text}X</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "类型",
        }),
        key: "priceType",
        render: (text, record) => {
          return (
            <span>
              {text
                ? this.props.intl.formatMessage({
                    id: text,
                  })
                : ""}
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
            <span>
              {sideMap[text] &&
                this.props.intl.formatMessage({
                  id: sideMap[text],
                })}
            </span>
          );
        },
      },
      {
        title: `${this.props.intl.formatMessage({
          id: "已成数量",
        })}｜${this.props.intl.formatMessage({
          id: "委托总量",
        })}`,
        key: "origQty",
        render: (text, record) => {
          return (
            <span>
              {record.executedQty}｜{text}{" "}
              {this.props.intl.formatMessage({ id: "张" })}
            </span>
          );
        },
      },
      {
        title: `${this.props.intl.formatMessage({
          id: "成交均价",
        })}｜${this.props.intl.formatMessage({
          id: "委托价格",
        })}`,
        key: "price",
        render: (text, record) => {
          // 非限价单，不显示价格，显示类型
          if (record.priceType && record.priceType == "MARKET_PRICE") {
            return <span>{record.avgPrice}｜--</span>;
          }
          return (
            <span>
              {record.avgPrice}｜{text}
              {/* {" "}
              {symbols[record.symbolId] &&
              symbols[record.symbolId]["baseTokenFutures"]
                ? symbols[record.symbolId]["baseTokenFutures"]["displayTokenId"]
                : ""} */}
            </span>
          );
        },
      },
      {
        title: `${this.props.intl.formatMessage({
          id: "保证金",
        })}`,
        key: "margin",
        render: (text, record) => {
          const marginPrecision =
            symbols[record.symbolId] &&
            symbols[record.symbolId]["baseTokenFutures"]
              ? CONST["depth"][
                  symbols[record.symbolId]["baseTokenFutures"][
                    "marginPrecision"
                  ]
                ]
              : "";
          return (
            <span>
              {text} {record.quoteTokenName}
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
          return (
            <span>
              {this.props.intl.formatMessage({
                id: text,
              })}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "orderId",
        render: (text, record) => {
          return (
            <span
              className={classes.operate}
              onClick={this.cancel.bind(this, record.orderId)}
            >
              {this.props.intl.formatMessage({
                id: "撤单",
              })}
            </span>
          );
        },
      },
    ];
    // 计划委托
    const column_plan = [
      {
        title: this.props.intl.formatMessage({
          id: "合约",
        }),
        key: "symbolName",
        render: (text, record) => {
          return (
            <span
              onClick={this.goto.bind(
                this,
                record.exchangeId,
                record.symbolId,
                record.quoteTokenId
              )}
              style={{ cursor: "pointer" }}
            >
              {text}
            </span>
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
            <span>
              {moment.utc(Number(text)).local().format("MM-DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "杠杆",
        }),
        key: "leverage",
        render: (text, record) => {
          // 平仓单不显示杠杆
          if (record.side.indexOf("CLOSE") > -1) {
            return <span>--</span>;
          }
          return <span>{text}X</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "类型",
        }),
        key: "priceType",
        render: (text, record) => {
          return (
            <span>
              {text
                ? this.props.intl.formatMessage({
                    id: text,
                  })
                : ""}
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
            <span>
              {sideMap[text]
                ? this.props.intl.formatMessage({
                    id: sideMap[text],
                  })
                : ""}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "触发价格",
        }),
        key: "triggerPrice",
        render: (text, record) => {
          return (
            <span>
              {text}{" "}
              {symbols[record.symbolId] &&
              symbols[record.symbolId]["baseTokenFutures"]
                ? symbols[record.symbolId]["baseTokenFutures"]["displayTokenId"]
                : ""}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "委托价格",
        }),
        key: "price",
        render: (text, record) => {
          // 非限价单，不显示价格，显示类型
          if (record.priceType && record.priceType == "MARKET_PRICE") {
            return <span>--</span>;
          }
          return (
            <span>
              {text}{" "}
              {symbols[record.symbolId] &&
              symbols[record.symbolId]["baseTokenFutures"]
                ? symbols[record.symbolId]["baseTokenFutures"]["displayTokenId"]
                : ""}
            </span>
          );
        },
      },
      {
        title: `${this.props.intl.formatMessage({
          id: "委托数量",
        })}(${this.props.intl.formatMessage({ id: "张" })})`,
        key: "origQty",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "状态",
        }),
        key: "status",
        render: (text, record) => {
          return (
            <span>
              {this.props.intl.formatMessage({
                id: text,
              })}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "orderId",
        render: (text, record) => {
          return (
            <span
              className={classes.operate}
              onClick={this.cancel.bind(this, record.orderId)}
            >
              {this.props.intl.formatMessage({
                id: "撤单",
              })}
            </span>
          );
        },
      },
    ];
    // 止盈止损
    const column_stop_loss = [
      {
        title: this.props.intl.formatMessage({
          id: "合约",
        }),
        key: "symbolName",
        render: (text, record) => {
          return (
            <span
              onClick={this.goto.bind(
                this,
                record.exchangeId,
                record.symbolId,
                record.quoteTokenId
              )}
              style={{ cursor: "pointer" }}
            >
              {text}
            </span>
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
            <span>
              {moment.utc(Number(text)).local().format("MM-DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "类型",
        }),
        key: "planOrderType",
        render: (text, record) => {
          return (
            <span>
              {text
                ? this.props.intl.formatMessage({
                    id: text,
                  })
                : ""}
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
            <span>
              {sideMap[text]
                ? this.props.intl.formatMessage({
                    id: sideMap[text],
                  })
                : ""}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "触发价格",
        }),
        key: "triggerPrice",
        render: (text, record) => {
          return (
            <span>
              {text}{" "}
              {symbols[record.symbolId] &&
              symbols[record.symbolId]["baseTokenFutures"]
                ? symbols[record.symbolId]["baseTokenFutures"]["displayTokenId"]
                : ""}
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
          return (
            <span>
              {this.props.intl.formatMessage({
                id: text,
              })}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "orderId",
        render: (text, record, n) => {
          return (
            <span
              className={classes.operate}
              onClick={this.cancel_loss(record.orderId, n)}
            >
              {this.props.intl.formatMessage({
                id: "撤单",
              })}
            </span>
          );
        },
      },
    ];

    let data = this.props.current_list || [];
    data = data.filter((item) => {
      // 止盈止损单
      if (this.props.params.order_type == "STOP_LOSS") {
        return item.type == "STOP" && item.planOrderType != "STOP_COMMON";
      } else {
        // 普通委托，计划委托
        return item.type == this.props.params.order_type;
      }
    });
    if (!this.props.checked) {
      data = data.filter(
        (item) => item.symbolId == this.props.match.params.symbolId
      ); // 当前永续合约id
    }
    // if (this.props.params.time_range && this.props.sever_time) {
    //   const server_time = this.props.sever_time;
    //   const w = 7 * 24 * 60 * 60 * 1000;
    //   data = data.filter(item => {
    //     if (this.props.params.time_range == "1w") {
    //       return server_time - item.time <= w;
    //     } else {
    //       return server_time - item.time >= w;
    //     }
    //   });
    // }
    let title = {
      LIMIT: column_common,
      STOP: column_plan,
      STOP_LOSS: column_stop_loss,
    }[this.props.params.order_type];
    const userinfo = this.props.userinfo;
    return (
      <div>
        {this.props.tab === "2" || !this.props.tab ? (
          <Table
            titles={title}
            widthStyle={
              this.props.params.order_type == "STOP_LOSS"
                ? classes.current_table_width2
                : classnames(
                    classes.current_table_width,
                    this.props.params.order_type == "STOP" ? "stop" : ""
                  )
            }
            data={(
              helper.excludeRepeatArray("orderId", data, "time") || []
            ).sort((a, b) => (a.time - b.time > 0 ? -1 : 1))}
            useWindow={this.props.useWindow}
            noResultText=""
            hasMore={
              !this.props.loading.effects["future/getCurrentEntrust"] &&
              this.props.current_more
            }
            showNoMoreData={true}
            getMore={this.getMore.bind(this, false)}
            loading={
              userinfo.userId
                ? Boolean(
                    this.props.loading.effects["future/getCurrentEntrust"]
                  )
                : false
            }
            className={classnames(
              this.props.tab == "2" ? classes.commonTable : "",
              "entrust"
            )}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
OrderList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default injectIntl(OrderList);
