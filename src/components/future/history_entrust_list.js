// 永续合约 历史委托
import React from "react";
import PropTypes from "prop-types";
import { Table, Iconfont, message } from "../../lib";
import { injectIntl } from "react-intl";
import moment from "moment";
import helper from "../../utils/helper";
import getData from "../../services/getData";
import CONST from "../../config/const";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import classnames from "classnames";

class OrderList extends React.Component {
  constructor() {
    super();
    this.state = {
      open: {},
      open_loading: false,
      dialog: false,
      dialog_info: {
        price: "",
        liquidationPrice: "",
        symbol_name: "",
        time: "",
      },
    };
    this.getMore = this.getMore.bind(this);
    this.showMoreDetials = this.showMoreDetials.bind(this);
  }
  componentDidMount() {
    this.getMore(true);
  }

  componentDidUpdate(preProps) {
    if (
      this.props.params.order_type != preProps.params.order_type ||
      (preProps.tab != 3 && this.props.tab == 3)
    ) {
      this.clearMoreDetials();
      this.props.dispatch({
        type: "future/save",
        payload: {
          history_entrust: [],
          history_entrust_more: true,
        },
      });
      this.getMore(true, 0, this.props.params.order_type);
    }
    if (this.props.tab != preProps.tab) {
      this.clearMoreDetials();
    }
  }
  // 获取更多
  // params n table组件调用此方法时会传入第二个参数
  getMore(firstReq, n, order_type) {
    let params = this.props.params;
    params.firstReq = firstReq;
    let obj = { ...params };
    if (order_type) {
      obj.type = order_type;
      obj.order_type = order_type;
    }
    this.props.dispatch({
      type: "future/getHistoryEntrust",
      payload: obj,
    });
  }
  dialog = (type, record) => (e) => {
    if (type == "close") {
      this.setState({
        dialog: false,
        dialog_info: {
          time: "",
          symbol_name: "",
          price: "",
          liquidationPrice: "",
        },
      });
      return;
    }
    if (type == "open" && record) {
      this.setState({
        dialog: true,
        dialog_info: {
          time: record.time,
          symbol_name: record.symbolName,
          price: record.price,
          liquidationPrice: record.liquidationPrice,
        },
      });
    }
  };
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
          this.getMoreDetails(record.orderId, record.tradeId, record);
        }
      );
    }
  }
  clearMoreDetials = () => {
    this.setState({
      open: {},
    });
  };
  getMoreDetails = async (order_id, trade_id = "", record) => {
    const result = await getData(
      record.type == "STOP" && record.planOrderType != "STOP_COMMON"
        ? "futures_order_get"
        : "futures_match_info"
    )({
      payload: {
        order_id:
          record.type == "STOP" && record.planOrderType != "STOP_COMMON"
            ? record.executedOrderId
            : order_id,
        trade_id,
        limit: 10,
      },
      method: "get",
    });
    if (result.code == "OK") {
      let n = {
        data:
          Object.prototype.toString.call(result.data) == "[object Object]"
            ? [result.data]
            : result.data,
        more: true,
        loading: true,
      };
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
  render() {
    const { classes, config } = this.props;
    const sideMap = CONST["sideMap"];
    let symbols = config.symbols_obj.futures;

    const column_common = [
      {
        title: this.props.intl.formatMessage({
          id: "合约",
        }),
        key: "symbolName",
        render: (text, record) => {
          return <span data-orderid={record.orderId}>{text}</span>;
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
          // debugger
          if (record.side.indexOf("CLOSE") > -1) {
            return <span>--</span>;
          }
          return text ? <span>{text}X</span> : "--";
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
          id: "成交价格",
        })}｜${this.props.intl.formatMessage({
          id: "委托价格",
        })}`,
        key: "price",
        render: (text, record) => {
          // 委托价格  市价,爆仓单显示--
          // 成交价格  爆仓单显示--
          if (record.liquidationType == "IOC") {
            return (
              <span>
                -- |{" "}
                {record.priceType && record.priceType == "MARKET_PRICE"
                  ? "--"
                  : "--"}
              </span>
            );
          }
          return (
            <span>
              {record.avgPrice}｜{text}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "下单条件",
        }),
        key: "timeInForce",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      // {
      //   title: this.props.intl.formatMessage({
      //     id: "盈亏"
      //   }),
      //   key: "realisedPnl",
      //   render: (text, record) => {
      //     return <span>{text}</span>;
      //   }
      // },
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
              {record.liquidationType == "IOC"
                ? "(" + this.props.intl.formatMessage({ id: "强平" }) + ")"
                : record.liquidationType == "ADL"
                ? "(" + this.props.intl.formatMessage({ id: "减仓" }) + ")"
                : ""}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "orderId",
        render: (text, record, i) => {
          // 爆仓单
          if (record.liquidationType == "IOC") {
            return (
              <span
                className={classes.operate}
                onClick={this.dialog("open", record)}
              >
                {this.props.intl.formatMessage({
                  id: "详情",
                })}
                <Iconfont type="arrowDown" size="16" />
              </span>
            );
          }
          return (
            <span
              onClick={this.showMoreDetials.bind(this, record, i)}
              id={"s" + record.orderId}
              className={classes.operate}
            >
              {record.status == "CANCELED" && record.executedQty <= 0
                ? ""
                : this.props.intl.formatMessage({
                    id: "详情",
                  })}
              {record.status == "CANCELED" && record.executedQty <= 0 ? (
                ""
              ) : (
                <Iconfont
                  type="arrowDown"
                  size={16}
                  className={this.state.open[record.orderId] ? "on" : ""}
                />
              )}
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
              {moment.utc(Number(text)).local().format("YYYY-MM-DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "价格",
        }),
        key: "price",
      },
      {
        title: this.props.intl.formatMessage({
          id: "数量",
        }),
        key: "quantity",
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
        title: this.props.intl.formatMessage({ id: "盈亏" }),
        key: "pnl",
        render: (text, record) => {
          return (
            <p>
              {text} {record.quoteTokenName}
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
    const column_plan = [
      {
        title: this.props.intl.formatMessage({
          id: "合约",
        }),
        key: "symbolName",
        render: (text, record) => {
          return <span>{text}</span>;
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
          // debugger
          return text ? <span>{text}X</span> : <span>--</span>;
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
          // 市价显示--
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
        title: this.props.intl.formatMessage({
          id: "实际委托价格",
        }),
        key: "executedPrice",
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
              {this.props.intl.formatMessage({ id: text })}
              {record.isLiquidationOrder
                ? "(" + this.props.intl.formatMessage({ id: "强平" }) + ")"
                : ""}
            </span>
          );
        },
      },
    ];
    const column_loss = [
      {
        title: this.props.intl.formatMessage({
          id: "合约",
        }),
        key: "symbolName",
        render: (text, record) => {
          return <span>{text}</span>;
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
      // {
      //   title: this.props.intl.formatMessage({
      //     id: "成交均价"
      //   }),
      //   key: "avgPrice",
      //   render: (text, record) => {
      //     return (
      //       <span>
      //         {text}{" "}
      //         {symbols[record.symbolId] &&
      //         symbols[record.symbolId]["baseTokenFutures"]
      //           ? symbols[record.symbolId]["baseTokenFutures"]["displayTokenId"]
      //           : ""}
      //       </span>
      //     );
      //   }
      // },
      // {
      //   title: this.props.intl.formatMessage({
      //     id: "已成交数量"
      //   }),
      //   key: "executedQty",
      //   render: (text, record) => {
      //     return <span>{text}</span>;
      //   }
      // },
      {
        title: this.props.intl.formatMessage({
          id: "状态",
        }),
        key: "status",
        render: (text, record) => {
          return (
            <span>
              {this.props.intl.formatMessage({ id: text })}
              {record.isLiquidationOrder
                ? "(" + this.props.intl.formatMessage({ id: "强平" }) + ")"
                : ""}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "orderId",
        render: (text, record, i) => {
          return (
            <span
              onClick={this.showMoreDetials.bind(this, record, i)}
              id={"s" + record.orderId}
              className={classes.operate}
            >
              {record.status == "ORDER_FILLED"
                ? this.props.intl.formatMessage({
                    id: "详情",
                  })
                : ""}
              {record.status == "ORDER_FILLED" ? (
                <Iconfont
                  type="arrowDown"
                  size={16}
                  className={this.state.open[record.orderId] ? "on" : ""}
                />
              ) : (
                ""
              )}
            </span>
          );
        },
      },
    ];
    // 止盈止损订单详情
    const column_loss_detail = [
      {
        title: this.props.intl.formatMessage({
          id: "合约",
        }),
        key: "symbolName",
        render: (text, record) => {
          return <span data-orderid={record.orderId}>{text}</span>;
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
              {moment.utc(Number(text)).local().format("YYYY-MM-DD HH:mm:ss")}
            </span>
          );
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
          id: "成交均价",
        }),
        key: "avgPrice",
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
        title: `${this.props.intl.formatMessage({
          id: "数量",
        })}(${this.props.intl.formatMessage({ id: "张" })})`,
        key: "origQty",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },

      {
        title: this.props.intl.formatMessage({
          id: "已成交数量",
        }),
        key: "executedQty",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      // {
      //   title: this.props.intl.formatMessage({
      //     id: "盈亏"
      //   }),
      //   key: "realisedPnl",
      //   render: (text, record) => {
      //     return <span>{text}</span>;
      //   }
      // },
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
              {record.liquidationType == "IOC"
                ? "(" + this.props.intl.formatMessage({ id: "强平" }) + ")"
                : record.liquidationType == "ADL"
                ? "(" + this.props.intl.formatMessage({ id: "减仓" }) + ")"
                : ""}
            </span>
          );
        },
      },
    ];
    let data = this.props.history_entrust;
    data = data.filter((item) => {
      // 止盈止损单
      if (this.props.params.order_type == "STOP_LOSS" && item.type == "STOP") {
        return item.planOrderType != "STOP_COMMON";
      } else {
        // 普通委托，计划委托
        return item.type == this.props.params.order_type;
      }
    });
    // data = data.filter(item => item.type == this.props.params.order_type);
    if (!this.props.checked) {
      data = data.filter(
        (item) => item.symbolId == this.props.match.params.symbolId
      ); // 当前永续合约id
    }
    if (this.props.params.time_range && this.props.sever_time) {
      const server_time = this.props.sever_time;
      const w = 7 * 24 * 60 * 60 * 1000;
      data = data.filter((item) => {
        if (this.props.params.time_range == "1w") {
          return server_time - item.time <= w;
        } else {
          return server_time - item.time >= w;
        }
      });
    }
    let title = {
      LIMIT: column_common,
      STOP: column_plan,
      STOP_LOSS: column_loss,
    }[this.props.params.order_type];
    const userinfo = this.props.userinfo;
    data = (helper.excludeRepeatArray("orderId", data, "time") || []).sort(
      (a, b) => (a.time - b.time > 0 ? -1 : 1)
    );
    return (
      <div>
        {this.props.tab === "3" || !this.props.tab ? (
          <Table
            titles={title}
            widthStyle={
              this.props.params.order_type == "STOP_LOSS"
                ? classes.history_table_width_loss
                : classnames(
                    classes.history_table_width,
                    this.props.params.order_type == "STOP" ? "stop" : ""
                  )
            }
            dataDescKey="orderId"
            dataDesc={this.state.open}
            dataDescTitles={
              this.props.params.order_type == "STOP_LOSS"
                ? column_loss_detail
                : column_history_detail
            }
            dataStyle={classes.match_details}
            listHeight={44}
            dataDescTitleStyle={
              this.props.params.order_type == "STOP_LOSS"
                ? classes.match_title_loss
                : classes.match_title
            }
            dataDescStyle={
              this.props.params.order_type == "STOP_LOSS"
                ? classes.match_info_loss
                : classes.match_info
            }
            data={data}
            useWindow={this.props.useWindow}
            noResultText=""
            hasMore={
              !this.props.loading.effects["future/getHistoryEntrust"] &&
              this.props.history_entrust_more
            }
            showNoMoreData={true}
            getMore={this.getMore.bind(this, false)}
            loading={
              userinfo.userId
                ? Boolean(
                    this.props.loading.effects["future/getHistoryEntrust"]
                    // || this.props.ws_order_req
                  )
                : false
            }
            className={classnames(
              this.props.tab == "3" ? classes.commonTable : "",
              "entrust"
            )}
          />
        ) : (
          ""
        )}
        <Dialog open={this.state.dialog} onClose={this.dialog("close")}>
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "强平明细" })}
          </DialogTitle>
          <DialogContent style={{ width: 350 }}>
            <p>
              {this.props.intl.formatMessage({
                id: "您的仓位保证金低于仓位维持保证金，所以触发强制平仓。",
              })}
            </p>
            <div style={{ margin: "10px 0" }}>
              <Grid
                container
                justify="space-between"
                className={classes.qplayer}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "时间" })}
                </Grid>
                <Grid item>
                  {this.state.dialog_info.time &&
                  Number(this.state.dialog_info.time)
                    ? moment
                        .utc(Number(this.state.dialog_info.time))
                        .local()
                        .format("MM-DD HH:mm:ss")
                    : ""}
                </Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                className={classes.qplayer}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "合约" })}
                </Grid>
                <Grid item>{this.state.dialog_info.symbol_name}</Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                className={classes.qplayer}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "强平价格" })}
                </Grid>
                <Grid item>{this.state.dialog_info.liquidationPrice}</Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="contained"
              onClick={this.dialog("close")}
            >
              {this.props.intl.formatMessage({ id: "确认" })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
OrderList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default injectIntl(OrderList);
