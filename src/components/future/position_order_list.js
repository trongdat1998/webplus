// 永续合约 当前持仓
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "./index_order_style";
import { Table, message, Iconfont } from "../../lib";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import math from "../../utils/mathjs";
import vali from "../../utils/validator";
import CONST from "../../config/const";
import WSDATA from "../../models/data_source";
import ModalMargin from "./quotes/modal_margin";
import ModalFlashClosePosition from "./modal_close_position";
import {
  Button,
  TextField,
  FormHelperText,
  MenuItem,
  Dialog,
  DialogContent,
  Grid,
  DialogActions,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  OutlinedInput,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
} from "@material-ui/core";
import TooltipCommon from "../public/tooltip";
import ModalOrder from "./quotes/modal_order";
import classnames from "classnames";

const priceType = {
  INPUT: "限价",
  MARKET_PRICE: "市价",
  OPPONENT: "对手价",
  QUEUE: "排队价",
  OVER: "超价",
};
const priceTypeIndex = {
  INPUT: 0,
  MARKET_PRICE: 1,
  OPPONENT: 2,
  QUEUE: 3,
  OVER: 4,
};

class OrderList extends React.Component {
  constructor() {
    super();
    this.state = {
      side: "add",
      item: {},
      params: {},
      modal_order: false,
      refresh: false,
      open: false,
      switch: false,
      tokenName: "",
      stop_profit: false, // 是否止盈
      profit_price: "", // 止盈价格
      profit_condition_type: "1", // 触发价格条件类型 0-按最新价触发  1-按指数价触发 默认为1
      profit_close_type: "0", // 平仓类型 0-只平当前可平仓位  1-平所有仓位 默认为0

      stop_loss: false, // 是否止损
      loss_price: "", // 止损价格
      loss_condition_type: "1", // 触发价格条件类型 0-按最新价触发  1-按指数价触发 默认为1
      loss_close_type: "0", // 平仓类型 0-只平当前可平仓位  1-平所有仓位 默认为0

      is_long: "",
      symbol_id: "",
      exchange_id: "",
      set_msg: "",
      currentId: "",
      width: 0,
      price_types: [
        {
          name: "限价",
          value: "INPUT",
        },
        {
          name: "市价",
          value: "MARKET_PRICE",
        },
        {
          name: "对手价",
          value: "OPPONENT",
        },
        {
          name: "排队价",
          value: "QUEUE",
        },
        {
          name: "超价",
          value: "OVER",
        },
      ],

      modal_flash_close_position_open: false, // 闪电平仓
      flash_close_position_item: {},
    };
    this.getMore = this.getMore.bind(this);
  }
  componentDidMount() {
    this.getMore(true);
    // http轮询更新
    //this.update();
    // // 从源数据更新到展示数据
    //this.updateData();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      params: nextProps.params,
    });
  }
  // 获取更多
  getMore(firstReq) {
    let params = this.state.params;
    params.firstReq = firstReq;
    this.props.dispatch({
      type: "future/getPositionOrder",
      payload: params,
    });
  }
  // 输入框监听
  handleChange(id, msgType, item, e) {
    const t = e.target;
    const n = t.name;
    let v = t.value;
    let msg = "",
      maxLimit = 8,
      minLimit = 3,
      priceMaxLimit = 99999999;
    if (!v) {
      // msg = this.props.intl.formatMessage({
      //   id: n === "exitQuantity" ? "请填写数量" : "请填写价格"
      // });
    }
    if (v.match(/[^0-9\.]/)) {
      msg = this.props.intl.formatMessage({ id: "请填写数字" });
    }
    v = v
      .replace(/[^0-9\.]/, "")
      .replace(/^0{1,}/, "0")
      .replace(/^(0)([1-9])/, ($1, $2) => {
        return $2;
      })
      .replace(/^\./, "0.");
    let d = v.split(".");
    // if (d[0] && d[0].length > maxLimit && n === "exitPrice") {
    //   v = d[0].slice(0, maxLimit);
    //   msg = this.props.intl.formatMessage({ id: "价格超过展示最大值" });
    // }
    if (n === "exitPrice" && Number(v) > priceMaxLimit) {
      v = priceMaxLimit;
      //msg = this.props.intl.formatMessage({ id: "价格超过展示最大值" });
    }
    if (v && n === "exitQuantity") {
      // 平仓数量处理
      minLimit = item.basePrecision;
      let available = Math.abs(item.available);
      if (Number(v) > Number(available)) {
        v = available;
        msg =
          this.props.intl.formatMessage({ id: "平仓数量不能大于" }) +
          item.available;
      } else if (Number(v) <= Number(available) && v < item.minTradeQuantity) {
        // 最小交易数量处理
        msg =
          this.props.intl.formatMessage({
            id: item.isLong > 0 ? "做空数量不能小于" : "做多数量不能小于",
          }) + item.minTradeQuantity;
      }
    } else {
      // 平仓数量价格
      minLimit = item.minPricePrecision;
    }
    if (d[1] && d[1].length > minLimit) {
      // 小数点后精度处理
      v = d[1].slice(0, minLimit) ? d[0] + "." + d[1].slice(0, minLimit) : d[0];
      // msg = this.props.intl.formatMessage({
      //   id: n === "exitQuantity" ? "数量超过展示最小值" : "价格超过展示最小值"
      // });
    }
    if (v && !vali.isFloat(v)) {
      return;
    }
    let params = {
      id: id,
      name: n,
      value: v,
    };
    this.changePositionInfo(params); // 修改数量、价格
    this.changePositionInfo({ id: id, name: msgType, value: msg }); // 修改错误信息
  }
  changePositionInfo(params) {
    this.props.dispatch({
      type: "future/changePositionInfo",
      payload: params,
    });
  }
  resetQuantity(item) {
    if (!item.exitQuantity) {
      this.changePositionInfo({
        id: item.positionId,
        name: "exitQuantity",
        value: item.available,
      });
    }
  }
  changeModal = (side, item) => {
    this.setState(
      {
        side,
        item,
      },
      () => {
        this.props.dispatch({
          type: "future/handleChange",
          payload: {
            modal_margin: true,
          },
        });
      }
    );
  };
  // 修改价格类型
  changePriceType(id, v) {
    this.closeModal("type_modal");
    this.changePositionInfo({
      id: id,
      name: "type",
      value: v,
    });
    this.changePositionInfo({
      id: id,
      name: "exitPrice",
      value: "",
    });
    this.changePositionInfo({
      id: id,
      name: "priceMsg",
      value: "",
    });
  }
  // 数量设置全部
  setTotalQuantity(item) {
    this.changePositionInfo({
      id: item.positionId,
      name: "exitQuantity",
      value: helper.digits(item.available, item.basePrecision),
    });
    this.changePositionInfo({
      id: item.positionId,
      name: "quantityMsg",
      value: "",
    });
  }
  // 切换
  goto = async (exchangeId, symbolId) => {
    let url = route_map.future + "/" + symbolId;
    if (window.location.pathname.indexOf(route_map.future_position) > -1) {
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
  // 买入、卖出
  submit = (order_side, where, _item, e) => {
    let item = {};
    if (_item) {
      this.setState({
        item: _item,
      });
      item = _item;
    } else {
      item = this.state.item;
    }
    // let msg = "";
    if (item.type == "INPUT" && !item.exitPrice) {
      this.changePositionInfo({
        id: item.positionId,
        name: "priceMsg",
        value: this.props.intl.formatMessage({ id: "请填写价格" }),
      });
      return;
    }
    if (!item.exitQuantity) {
      this.changePositionInfo({
        id: item.positionId,
        name: "quantityMsg",
        value: this.props.intl.formatMessage({ id: "请填写数量" }),
      });
      return;
    }
    if (item.exitQuantity > Math.abs(item.available)) {
      this.changePositionInfo({
        id: item.positionId,
        name: "quantityMsg",
        value:
          this.props.intl.formatMessage({ id: "平仓数量不能大于" }) +
          item.available,
      });
      return;
    }
    if (item.exitQuantity < item.minTradeQuantity) {
      this.changePositionInfo({
        id: item.positionId,
        name: "quantityMsg",
        value:
          this.props.intl.formatMessage({ id: "交易数量不能小于" }) +
          item.minTradeQuantity,
      });
      return;
    }

    // 当前永续合约用户的配置信息
    let symbol_setting = this.props.order_setting[item.symbolId] || {};
    const isConfirm =
      symbol_setting && symbol_setting.orderSetting
        ? Boolean(symbol_setting.orderSetting.isConfirm)
        : false;

    if (isConfirm && where) {
      this.setState({
        modal_order: true,
      });
      return;
    }

    let params = {
      symbol_id: item.symbolId,
      side: Number(item.isLong) > 0 ? "SELL_CLOSE" : "BUY_CLOSE",
      type: "LIMIT",
      //trigger_price: "",
      price_type: item.type,
      //leverage: item.leverage,
      time_in_force: CONST.time_in_force,
      price: item.exitPrice || "",
      quantity: item.exitQuantity,
      exchange_id: item.exchangeId,
      client_order_id: new Date().getTime(),
      futures: true,
      order_side: item.positionId,
    };
    this.props.dispatch({
      type: "future/createOrder",
      payload: params,
      // callback: () => {
      //   this.refs["exitQuantity"+item.positionId].click();
      // }
    });
  };
  changeProfit = (k) => (e) => {
    const v = e.target.checked;
    // 止盈
    if (k) {
      this.setState({
        stop_profit: v,
        profit_price: "",
        profit_condition_type: "1",
        profit_close_type: "0",
      });
      return;
    }
    // 止损
    this.setState({
      stop_loss: v,
      loss_price: "",
      loss_condition_type: "1",
      loss_close_type: "0",
    });
  };
  // 触发类型，平仓方式变化
  radioChange = (k) => (e) => {
    this.setState({
      [k]: e.target.value,
    });
  };
  openStop = (symbol_id, is_long, tokenName, exchange_id) => (e) => {
    this.setState(
      {
        open: true,
        symbol_id,
        exchange_id,
        is_long,
        tokenName,
        set_msg: "",
      },
      () => {
        this.props.dispatch({
          type: "future/stop_profit_loss_get",
          payload: {
            symbol_id,
            is_long,
          },
          cb: (res) => {
            if (res.code == "OK") {
              const data = res.data;
              this.setState({
                stop_profit: data.stopProfit,
                profit_price: data.stopProfitPrice || "",
                profit_price_msg: "",
                profit_condition_type: data.stopProfitTriggerConditionType + "",
                profit_close_type: data.stopProfitCloseType + "",

                stop_loss: data.stopLoss,
                loss_price: data.stopLossPrice || "",
                loss_price_msg: "",
                loss_condition_type: data.stopLossTriggerConditionType + "",
                loss_close_type: data.stopLossCloseType + "",
              });
            } else {
              res.msg && message.error(res.msg);
            }
          },
        });
      }
    );
  };

  closeModal = (key, e) => {
    this.setState({
      [key]: null,
      currentId: "",
    });
  };
  openModal = (key, id, e) => {
    this.setState({
      [key]: e.currentTarget,
      currentId: id,
      width: document.querySelector(".three").offsetWidth,
    });
  };
  renderBody(data) {
    const { classes, position_list, config } = this.props;
    const futures = config.symbols_obj.futures;
    return (
      <div className={classes.custom_order}>
        <ul>
          {data
            ? data.map((item, index) => {
                const configItem = futures[item.symbolId];
                if (!configItem) {
                  return "";
                }
                item.basePrecision =
                  Number(configItem.basePrecision) > 0.1
                    ? 0
                    : CONST["depth"][configItem.basePrecision];
                item.minPricePrecision =
                  Number(configItem.minPricePrecision) > 0.1
                    ? 0
                    : CONST["depth"][configItem.minPricePrecision];
                item.minTradeQuantity = configItem.minTradeQuantity;
                item.exchangeId = configItem.exchangeId;
                const marginPrecision =
                  CONST["depth"][configItem.baseTokenFutures.marginPrecision];
                return (
                  <li key={index}>
                    <div className={classes.title}>
                      <div className="first">
                        <label
                          onClick={this.goto.bind(
                            this,
                            item.exchangeId,
                            item.symbolId,
                            item.quoteTokenId
                          )}
                          style={{ cursor: "pointer" }}
                          data-positionid={item.positionId}
                        >
                          {item.symbolName}
                        </label>
                        <span
                          className={
                            Number(item.isLong) > 0 ? classes.up : classes.down
                          }
                        >
                          {this.props.intl.formatMessage({
                            id: Number(item.isLong) > 0 ? "多仓" : "空仓",
                          })}
                        </span>
                      </div>
                      <div className="second" />
                      <div className="three" />
                      <div className="four" />
                    </div>
                    <div className={classes.content}>
                      <div className="first">
                        <div className="order_item">
                          <label>
                            {this.props.intl.formatMessage({
                              id: "杠杆",
                            })}
                          </label>
                          <span>{item.leverage}X</span>
                        </div>
                        <div className="order_item">
                          <label>
                            <TooltipCommon
                              title={this.props.intl.formatMessage(
                                {
                                  id: "{n1}/{n2}，数量{n1}为可以平仓的仓位，数量{n2}为当前持仓的全部仓位",
                                },
                                {
                                  n1: item.available,
                                  n2: item.total,
                                }
                              )}
                              placement="top"
                              mode={true}
                            >
                              <em className={classes.underline}>
                                {this.props.intl.formatMessage({
                                  id: "仓位",
                                })}
                              </em>
                            </TooltipCommon>
                            (
                            {this.props.intl.formatMessage({
                              id: "张",
                            })}
                            )
                          </label>
                          <span>
                            {item.available
                              ? helper.digits(
                                  item.available,
                                  item.basePrecision
                                )
                              : item.available}
                            /
                            {item.total
                              ? helper.digits(item.total, item.basePrecision)
                              : item.total}
                          </span>
                        </div>
                        <div className="order_item">
                          <label>
                            <TooltipCommon
                              title={this.props.intl.formatMessage({
                                id: "仓位的名义价值",
                              })}
                              placement="top"
                              mode={true}
                            >
                              <em className={classes.underline}>
                                {this.props.intl.formatMessage({
                                  id: "仓位价值",
                                })}
                              </em>
                            </TooltipCommon>
                            ({configItem.baseTokenFutures.coinToken})
                          </label>
                          <span>
                            {item.positionValues
                              ? helper.digits(
                                  item.positionValues,
                                  marginPrecision
                                )
                              : item.positionValues}
                          </span>
                        </div>
                        <div className="order_item">
                          <label>
                            <TooltipCommon
                              title={this.props.intl.formatMessage({
                                id: "被仓位使用被锁定的保证金",
                              })}
                              placement="top"
                              mode={true}
                            >
                              <em className={classes.underline}>
                                {this.props.intl.formatMessage({
                                  id: "仓位保证金",
                                })}
                              </em>
                            </TooltipCommon>
                            ({configItem.baseTokenFutures.coinToken})
                          </label>

                          <span
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {item.margin && marginPrecision
                              ? helper.digits(item.margin, marginPrecision)
                              : item.margin}{" "}
                            <TooltipCommon
                              title={this.props.intl.formatMessage({
                                id: "点击按钮调整保证金",
                              })}
                              placement="top"
                              mode={true}
                            >
                              <i
                                onClick={this.changeModal.bind(
                                  this,
                                  "add",
                                  item
                                )}
                                className="icon-btn"
                              >
                                ±
                              </i>
                            </TooltipCommon>
                          </span>
                        </div>
                      </div>
                      <div className="second">
                        <div className="order_item">
                          <label>
                            <TooltipCommon
                              title={this.props.intl.formatMessage({
                                id: "仓位的平均开仓价格",
                              })}
                              placement="top"
                              mode={true}
                            >
                              <em className={classes.underline}>
                                {this.props.intl.formatMessage({
                                  id: "开仓均价",
                                })}
                              </em>
                            </TooltipCommon>
                            ({configItem.baseTokenFutures.displayTokenId})
                          </label>

                          <span>
                            {Number(item.avgPrice)
                              ? helper.digits(
                                  Number(item.avgPrice),
                                  item.minPricePrecision
                                )
                              : ""}
                          </span>
                        </div>
                        <div className="order_item">
                          <label>
                            <TooltipCommon
                              title={this.props.intl.formatMessage({
                                id: "合约的标的指数价格低于该价格（多仓）或高于该价格（空仓），您会被强制平仓",
                              })}
                              placement="top"
                              mode={true}
                            >
                              <em className={classes.underline}>
                                {this.props.intl.formatMessage({
                                  id: "预估强平价",
                                })}
                              </em>
                            </TooltipCommon>
                            ({configItem.baseTokenFutures.displayTokenId})
                          </label>

                          <span>
                            {item.liquidationPrice
                              ? helper.digits(
                                  item.liquidationPrice,
                                  item.minPricePrecision
                                )
                              : item.liquidationPrice}
                          </span>
                        </div>
                        <div className="order_item">
                          <label>
                            <TooltipCommon
                              title={this.props.intl.formatMessage({
                                id: "当前仓位的保证金剩余的百分比",
                              })}
                              placement="top"
                              mode={true}
                            >
                              <em className={classes.underline}>
                                {this.props.intl.formatMessage({
                                  id: "保证金率",
                                })}
                              </em>
                            </TooltipCommon>
                          </label>

                          <span>
                            {helper.format(
                              Math.floor(item.marginRate * 10000) / 100,
                              2
                            )}
                            %
                          </span>
                        </div>
                        <div className="order_item">
                          <label>
                            <TooltipCommon
                              title={this.props.intl.formatMessage({
                                id: "强平仓位的参考指数",
                              })}
                              placement="top"
                              mode={true}
                            >
                              <em className={classes.underline}>
                                {this.props.intl.formatMessage({
                                  id: "标的指数",
                                })}
                              </em>
                            </TooltipCommon>
                          </label>
                          <span>
                            {item.indices
                              ? helper.digits(
                                  item.indices,
                                  item.minPricePrecision
                                )
                              : item.indices}
                          </span>
                        </div>
                      </div>
                      <div className="three">
                        <div
                          className={classNames("order_item", "order_select")}
                        >
                          <label>
                            {this.props.intl.formatMessage({
                              id: "平仓价格",
                            })}
                            ({configItem.baseTokenFutures.displayTokenId})
                          </label>
                          <OutlinedInput
                            className={classes.whole}
                            value={
                              item.type == "INPUT"
                                ? item.exitPrice || ""
                                : this.props.intl.formatMessage({
                                    id: priceType[item.type],
                                  })
                            }
                            name="exitPrice"
                            error={item.priceMsg ? true : false}
                            autoComplete="off"
                            onChange={this.handleChange.bind(
                              this,
                              item.positionId,
                              "priceMsg",
                              item
                            )}
                            readOnly={item.type == "INPUT" ? false : true}
                            classes={{
                              root: classes.inputRoot,
                              focused: classes.inputFocused,
                              error: classes.inputError,
                            }}
                            placeholder={
                              item.type == "INPUT"
                                ? this.props.intl.formatMessage({
                                    id: "请输入价格",
                                  })
                                : ""
                            }
                            endAdornment={
                              <Iconfont
                                aria-owns={
                                  this.state.type_modal
                                    ? "type_modal" + item.positionId
                                    : undefined
                                }
                                type="arrowDown"
                                aria-haspopup="true"
                                size="20"
                                className={classnames(
                                  classes.priceTypeIcon,
                                  Boolean(this.state.type_modal) &&
                                    item.positionId == this.state.currentId
                                    ? "on"
                                    : ""
                                )}
                                onClick={this.openModal.bind(
                                  this,
                                  "type_modal",
                                  item.positionId
                                )}
                              />
                            }
                          />
                          {/* <Select
                            value={item.type}
                            onChange={this.changePriceType.bind(
                              this,
                              item.positionId
                            )}
                            className={classNames(classes.selectType, "select")}
                            classes={{ icon: classes.icon }}
                            displayEmpty
                            inputProps={{
                              name: "price_type",
                              id: "price_type"
                            }}
                            MenuProps={{
                              classes: {
                                list: classes.menuList
                              }
                            }}
                          >
                            <MenuItem
                              value="INPUT"
                              className={classes.menuItem}
                            >
                              {this.props.intl.formatMessage({ id: "限价" })}
                            </MenuItem>
                            <MenuItem
                              value="MARKET_PRICE"
                              className={classes.menuItem}
                            >
                              {this.props.intl.formatMessage({ id: "市价" })}
                            </MenuItem>
                            <MenuItem
                              value="OPPONENT"
                              className={classes.menuItem}
                            >
                              {this.props.intl.formatMessage({ id: "对手价" })}
                            </MenuItem>
                            <MenuItem
                              value="QUEUE"
                              className={classes.menuItem}
                            >
                              {this.props.intl.formatMessage({ id: "排队价" })}
                            </MenuItem>
                            <MenuItem value="OVER" className={classes.menuItem}>
                              {this.props.intl.formatMessage({ id: "超价" })}
                            </MenuItem>
                          </Select> */}
                          <FormHelperText error>
                            {item.priceMsg ? item.priceMsg : ""}
                          </FormHelperText>
                        </div>
                        <div className="order_item" style={{ display: "flex" }}>
                          <label style={{ flex: 1.3 }}>
                            <em>
                              {this.props.intl.formatMessage({
                                id: "收益率",
                              })}
                            </em>{" "}
                          </label>
                          <i
                            className={
                              Number(item.profitRate) >= 0 ? "green" : "red"
                            }
                            style={{ flex: 1 }}
                          >
                            {item.profitRate
                              ? math
                                  .chain(math.bignumber(item.profitRate))
                                  .multiply(100)
                                  .done() + "%"
                              : item.profitRate}
                          </i>
                        </div>
                        <div className="order_item" style={{ display: "flex" }}>
                          <label style={{ flex: 1.3 }}>
                            <TooltipCommon
                              title={this.props.intl.formatMessage({
                                id: "仓位的未实现盈亏",
                              })}
                              placement="top"
                              mode={true}
                            >
                              <em className={classes.underline}>
                                {this.props.intl.formatMessage({
                                  id: "未实现盈亏",
                                })}
                              </em>
                            </TooltipCommon>
                            ({configItem.baseTokenFutures.coinToken}){" "}
                          </label>
                          <i
                            className={
                              Number(item.unrealisedPnl) >= 0 ? "green" : "red"
                            }
                            style={{ flex: 1 }}
                          >
                            {item.unrealisedPnl}
                          </i>
                        </div>
                      </div>
                      <div className="four">
                        <div className="order_item">
                          <label>
                            {this.props.intl.formatMessage({
                              id: "平仓数量",
                            })}
                            ({this.props.intl.formatMessage({ id: "张" })})
                          </label>
                          <OutlinedInput
                            className={classes.whole}
                            value={item.exitQuantity}
                            autoComplete="off"
                            onChange={this.handleChange.bind(
                              this,
                              item.positionId,
                              "quantityMsg",
                              item
                            )}
                            onBlur={this.resetQuantity.bind(this, item)}
                            // placeholder={item.available}
                            error={item.quantityMsg ? true : false}
                            name="exitQuantity"
                            id={"exitQuantity" + item.positionId}
                            classes={{
                              root: classes.inputRoot,
                              focused: classes.inputFocused,
                              error: classes.inputError,
                            }}
                            endAdornment={
                              <span
                                className={classes.un}
                                onClick={this.setTotalQuantity.bind(this, item)}
                              >
                                {this.props.intl.formatMessage({
                                  id: "全部",
                                })}
                              </span>
                            }
                          />
                          <FormHelperText error>
                            {item.quantityMsg ? item.quantityMsg : ""}
                          </FormHelperText>
                        </div>
                        <div className="order_item">
                          {/* <Button
                            onClick={this.changeModal.bind(this, "add", item)}
                            variant="contained"
                            color="primary"
                            className={classes.changeModal}
                          >
                            {this.props.intl.formatMessage({
                              id: "调整保证金"
                            })}
                          </Button> */}
                          <div
                            onClick={this.openStop(
                              item.symbolId,
                              item.isLong,
                              configItem.baseTokenFutures.displayTokenId,
                              item.exchangeId
                            )}
                            className={classes.changeModal}
                          >
                            <span>
                              {this.props.intl.formatMessage({
                                id: "止盈止损",
                              })}
                            </span>
                            <i />
                          </div>
                          <div
                            onClick={(e) => this.handleFlashClosePosition(item)}
                            className={classes.changeModal}
                          >
                            <span>
                              {this.props.intl.formatMessage({
                                id: "闪电平仓",
                              })}
                            </span>
                            <i />
                          </div>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.submit.bind(
                              this,
                              Number(item.isLong),
                              true,
                              item,
                              index
                            )}
                          >
                            {this.props.intl.formatMessage({
                              id: "平仓",
                            })}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            : ""}
        </ul>
      </div>
    );
  }
  changePrice = (key) => (e) => {
    if (Number(e.target.value) || Number(e.target.value) >= 0) {
      this.setState({
        [key]: e.target.value,
        [key + "_msg"]: "",
      });
    }
  };
  cancel = () => {
    this.setState({
      open: false,
      stop_profit: false,
      profit_price: "",
      profit_price_msg: "",
      profit_condition_type: "1",
      profit_close_type: "0",

      stop_loss: false,
      loss_price: "",
      loss_price_msg: "",
      loss_condition_type: "1",
      loss_close_type: "0",

      symbol_id: "",
      exchange_id: "",
      tokenName: "",
      is_long: "",
      set_msg: "",
    });
  };

  // 止盈止损 提交
  submitStop = () => {
    // 止盈
    if (this.state.stop_profit) {
      if (!this.state.profit_price) {
        this.setState({
          profit_price_msg: this.props.intl.formatMessage({ id: "请输入价格" }),
        });
        return;
      }
    }
    // 止损
    if (this.state.stop_loss) {
      if (!this.state.loss_price) {
        this.setState({
          loss_price_msg: this.props.intl.formatMessage({ id: "请输入价格" }),
        });
        return;
      }
    }

    const type =
      this.state.stop_profit || this.state.stop_loss
        ? "future/stop_profit_loss_set"
        : "future/stop_profit_loss_cancel";
    let data = {
      symbol_id: this.state.symbol_id,
      exchange_id: this.state.exchange_id,
      is_long: this.state.is_long,
    };
    if (this.state.stop_profit) {
      data.stop_profit_price = this.state.profit_price;
      data.sp_trigger_condition_type = this.state.profit_condition_type;
      data.sp_close_type = this.state.profit_close_type;
    }
    if (this.state.stop_loss) {
      data.stop_loss_price = this.state.loss_price;
      data.sl_trigger_condition_type = this.state.loss_condition_type;
      data.sl_close_type = this.state.loss_close_type;
    }
    this.props.dispatch({
      type: type,
      payload: data,
      cb: (res) => {
        if (res.code != "OK") {
          res.msg && message.error(res.msg);
        } else {
          this.cancel();
        }
      },
    });
  };

  // 快速平仓
  openFlashClosePositionModal = (item) => {
    this.setState({
      modal_flash_close_position_open: true,
      flash_close_position_item: item,
    });
  };
  // 闪电平仓 关闭
  closeFlashClosePositionModal = () => {
    this.setState({
      modal_flash_close_position_open: false,
    });
  };

  //
  handleFlashClosePosition = (item) => {
    // 快速平仓提示
    if (this.props.customConfig.quickCloseConfirm) {
      this.openFlashClosePositionModal(item);
    } else {
      this.props.dispatch({
        type: "future/flashClosePosition",
        payload: {
          client_order_id: new Date().getTime(),
          symbol_id: item.symbolId,
          is_long: item.isLong,
          exchange_id: item.exchangeId,
        },
      });
    }
  };

  render() {
    const { classes, ...otherProps } = this.props;
    const { position_list, loading, position_more } = this.props;
    let symbolId = this.props.match.params.symbolId;
    if (!symbolId) {
      return <div />;
    }
    symbolId = symbolId.toUpperCase();
    let data = position_list;
    if (!this.props.checked) {
      data = data.filter(
        (item) => item.symbolId == this.props.match.params.symbolId
      ); // 当前永续合约id
    }
    const userinfo = this.props.userinfo;
    // 当前永续合约用户的配置信息
    let symbol_setting = this.props.order_setting[symbolId] || {};
    const isConfirm =
      symbol_setting && symbol_setting.orderSetting
        ? Boolean(symbol_setting.orderSetting.isConfirm)
        : false;
    let palette2 = window.palette2[this.props.quoteMode];
    return (
      <div>
        {this.props.tab == "1"
          ? [
              data.length ? (
                ""
              ) : (
                <div
                  style={{
                    height: 32,
                    background: palette2.grey[800],
                  }}
                  key="count"
                />
              ),
              <Table
                data={(
                  helper.excludeRepeatArray("positionId", data, "positionId") ||
                  []
                ).sort((a, b) => (a.positionId - b.positionId >= 0 ? -1 : 1))}
                useWindow={this.props.useWindow}
                notitle={true}
                noResultText=""
                showNoMoreData={true}
                hasMore={
                  !loading.effects["future/getPositionOrder"] && position_more
                }
                getMore={this.getMore.bind(this, false)}
                loading={
                  userinfo.userId
                    ? Boolean(
                        this.props.loading.effects["future/getPositionOrder"]
                      )
                    : false
                }
                className={data.length ? classes.commonTable : classes.minTable}
                key="table"
              >
                {this.renderBody(data)}
              </Table>,
            ]
          : ""}
        <Popper
          open={Boolean(this.state.type_modal)}
          anchorEl={this.state.type_modal}
          id={"type_modal" + this.state.currentId}
          onClose={this.closeModal.bind(this, "type_modal")}
          placement="bottom-end"
          style={{ zIndex: 200 }}
        >
          <Paper className={classes.commonPaper}>
            <ClickAwayListener
              onClickAway={this.closeModal.bind(this, "type_modal")}
            >
              <MenuList style={{ width: this.state.width }}>
                {this.state.price_types.map((item, i) => {
                  let currentData =
                    data.find(
                      (list) => list.positionId == this.state.currentId
                    ) || {};
                  return (
                    <MenuItem
                      key={i}
                      className={classes.menuItem}
                      selected={currentData.type === item.value}
                      onClick={this.changePriceType.bind(
                        this,
                        this.state.currentId,
                        item.value
                      )}
                    >
                      {this.props.intl.formatMessage({
                        id: item.name,
                      })}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>

        <ModalMargin
          open={this.props.modal_margin}
          side={this.state.side}
          item={this.state.item}
          {...otherProps}
        />
        <ModalOrder
          open={this.state.modal_order}
          orderCreate={(order_side, where) =>
            this.submit(order_side, where, null)
          }
          handleClose={() => {
            this.setState({
              modal_order: false,
            });
          }}
          {...otherProps}
          isConfirm={isConfirm}
          order_choose={1} // 平仓，固定值
          buy_type={0} // 固定值
          sale_type={0} // 固定值
          order_side={Number(this.state.item.isLong)} // 平仓买，平仓卖
          buy_price_type={priceTypeIndex[this.state.item.type || "INPUT"]} // 价格类型 0,1,2,3,4
          sale_price_type={priceTypeIndex[this.state.item.type || "INPUT"]} // 价格类型  0,1,2,3,4
          buy_price={this.state.item.exitPrice} // 限价，用户输入的价格
          sale_price={this.state.item.exitPrice} // 限价，用户输入的价格
          buy_quantity={this.state.item.exitQuantity} // 平仓数量
          sale_quantity={this.state.item.exitQuantity} // 平仓数量
        />

        <Dialog open={this.state.open}>
          {loading.effects["future/stop_profit_loss_get"] ? (
            <DialogContent style={{ width: 390 }}>
              <Grid
                container
                justify="center"
                alignItems="center"
                style={{ height: 305, width: "100%" }}
              >
                <Grid>
                  <CircularProgress color="primary" size={30} />
                </Grid>
              </Grid>
            </DialogContent>
          ) : (
            <DialogContent style={{ width: 390 }}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        color="primary"
                        checked={this.state.stop_profit}
                        onChange={this.changeProfit(1)}
                      />
                    }
                    classes={{
                      labelPlacementStart: classes.labelPlacementStart,
                    }}
                    label={this.props.intl.formatMessage({ id: "止盈" })}
                    labelPlacement="start"
                  />
                </Grid>
              </Grid>
              <TextField
                // label={this.props.intl.formatMessage({ id: "止盈价格" })}
                placeholder={this.props.intl.formatMessage({
                  id: "止盈触发价格",
                })}
                helperText={this.state.profit_price_msg}
                disabled={!this.state.stop_profit}
                value={this.state.profit_price}
                onChange={this.changePrice("profit_price")}
                autoFocus
                fullWidth
                InputProps={{
                  endAdornment: (
                    <span className={classes.grey}>{this.state.tokenName}</span>
                  ),
                }}
                error={Boolean(this.state.profit_price_msg)}
                style={{ margin: "0 0 10px" }}
              />
              <Grid container alignItems="center">
                <Grid
                  item
                  xs={4}
                  className={
                    this.state.stop_profit
                      ? classes.profit_show
                      : classes.profit_hide
                  }
                >
                  {this.props.intl.formatMessage({ id: "触发价格类型" })}:
                </Grid>
                <Grid item xs={8}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={this.state.profit_condition_type}
                      onChange={this.radioChange("profit_condition_type")}
                      row
                    >
                      <FormControlLabel
                        disabled={!this.state.stop_profit}
                        value="1"
                        control={<Radio color="primary" />}
                        label={
                          <TooltipCommon
                            title={this.props.intl.formatMessage({
                              id: "profit_condition_type_1",
                            })}
                            placement="top"
                            mode={true}
                          >
                            <span className={classes.underline}>
                              {this.props.intl.formatMessage({
                                id: "指数价格",
                              })}
                            </span>
                          </TooltipCommon>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart,
                        }}
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        disabled={!this.state.stop_profit}
                        value="0"
                        control={<Radio color="primary" />}
                        label={
                          <TooltipCommon
                            title={this.props.intl.formatMessage({
                              id: "profit_condition_type_0",
                            })}
                            placement="top"
                            mode={true}
                          >
                            <span className={classes.underline}>
                              {this.props.intl.formatMessage({
                                id: "市场价格",
                              })}
                            </span>
                          </TooltipCommon>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart,
                        }}
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container alignItems="center">
                <Grid
                  item
                  xs={4}
                  className={
                    this.state.stop_profit
                      ? classes.profit_show
                      : classes.profit_hide
                  }
                >
                  {this.props.intl.formatMessage({ id: "平仓方式" })}:
                </Grid>
                <Grid item xs={8}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={this.state.profit_close_type}
                      onChange={this.radioChange("profit_close_type")}
                      row
                    >
                      <FormControlLabel
                        disabled={!this.state.stop_profit}
                        value="0"
                        control={<Radio color="primary" />}
                        label={
                          <TooltipCommon
                            title={this.props.intl.formatMessage({
                              id: "profit_close_type_0",
                            })}
                            placement="top"
                            mode={true}
                          >
                            <span className={classes.underline}>
                              {this.props.intl.formatMessage({
                                id: "可平仓位",
                              })}
                            </span>
                          </TooltipCommon>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart,
                        }}
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        disabled={!this.state.stop_profit}
                        value="1"
                        control={<Radio color="primary" />}
                        label={
                          <TooltipCommon
                            title={this.props.intl.formatMessage({
                              id: "profit_close_type_1",
                            })}
                            placement="top"
                            mode={true}
                          >
                            <span className={classes.underline}>
                              {this.props.intl.formatMessage({
                                id: "全部仓位",
                              })}
                            </span>
                          </TooltipCommon>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart,
                        }}
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                alignItems="center"
                style={{ margin: "10px 0 10px" }}
              >
                <Grid item>
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        color="primary"
                        checked={this.state.stop_loss}
                        onChange={this.changeProfit()}
                      />
                    }
                    classes={{
                      labelPlacementStart: classes.labelPlacementStart,
                    }}
                    label={this.props.intl.formatMessage({ id: "止损" })}
                    labelPlacement="start"
                  />
                </Grid>
              </Grid>
              <TextField
                // label={this.props.intl.formatMessage({ id: "止损价格" })}
                placeholder={this.props.intl.formatMessage({
                  id: "止损触发价格",
                })}
                helperText={this.state.loss_price_msg}
                disabled={!this.state.stop_loss}
                value={this.state.loss_price}
                onChange={this.changePrice("loss_price")}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <span className={classes.grey}>{this.state.tokenName}</span>
                  ),
                }}
                error={Boolean(this.state.loss_price_msg)}
                style={{ margin: "0 0 10px" }}
              />
              <Grid container alignItems="center">
                <Grid
                  item
                  xs={4}
                  className={
                    this.state.stop_loss
                      ? classes.profit_show
                      : classes.profit_hide
                  }
                >
                  {this.props.intl.formatMessage({ id: "触发价格类型" })}:
                </Grid>
                <Grid item xs={8}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={this.state.loss_condition_type}
                      onChange={this.radioChange("loss_condition_type")}
                      row
                    >
                      <FormControlLabel
                        disabled={!this.state.stop_loss}
                        value="1"
                        control={<Radio color="primary" />}
                        label={
                          <TooltipCommon
                            title={this.props.intl.formatMessage({
                              id: "loss_condition_type_1",
                            })}
                            placement="top"
                            mode={true}
                          >
                            <span className={classes.underline}>
                              {this.props.intl.formatMessage({
                                id: "指数价格",
                              })}
                            </span>
                          </TooltipCommon>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart,
                        }}
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        disabled={!this.state.stop_loss}
                        value="0"
                        control={<Radio color="primary" />}
                        label={
                          <TooltipCommon
                            title={this.props.intl.formatMessage({
                              id: "loss_condition_type_0",
                            })}
                            placement="top"
                            mode={true}
                          >
                            <span className={classes.underline}>
                              {this.props.intl.formatMessage({
                                id: "市场价格",
                              })}
                            </span>
                          </TooltipCommon>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart,
                        }}
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container alignItems="center">
                <Grid
                  item
                  xs={4}
                  className={
                    this.state.stop_loss
                      ? classes.profit_show
                      : classes.profit_hide
                  }
                >
                  {this.props.intl.formatMessage({ id: "平仓方式" })}:
                </Grid>
                <Grid item xs={8}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={this.state.loss_close_type}
                      onChange={this.radioChange("loss_close_type")}
                      row
                    >
                      <FormControlLabel
                        disabled={!this.state.stop_loss}
                        value="0"
                        control={<Radio color="primary" />}
                        label={
                          <TooltipCommon
                            title={this.props.intl.formatMessage({
                              id: "loss_close_type_0",
                            })}
                            placement="top"
                            mode={true}
                          >
                            <span className={classes.underline}>
                              {this.props.intl.formatMessage({
                                id: "可平仓位",
                              })}
                            </span>
                          </TooltipCommon>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart,
                        }}
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        disabled={!this.state.stop_loss}
                        value="1"
                        control={<Radio color="primary" />}
                        label={
                          <TooltipCommon
                            title={this.props.intl.formatMessage({
                              id: "loss_close_type_1",
                            })}
                            placement="top"
                            mode={true}
                          >
                            <span className={classes.underline}>
                              {this.props.intl.formatMessage({
                                id: "全部仓位",
                              })}
                            </span>
                          </TooltipCommon>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart,
                        }}
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {/* <p style={{ margin: "0 0 10px" }}>{this.state.set_msg}</p> */}
              <p className={classes.title_desc}>
                {this.props.intl.formatMessage({ id: "温馨提示" })}
              </p>
              <ul className={classes.ul_desc}>
                <li>
                  {this.props.intl.formatMessage({
                    id: "condition_type_0_des",
                  })}
                </li>
                <li>
                  {this.props.intl.formatMessage({ id: "close_type_1_des" })}
                </li>
              </ul>
            </DialogContent>
          )}
          <DialogActions>
            <Button color="primary" onClick={this.cancel}>
              {this.props.intl.formatMessage({ id: "取消" })}
            </Button>
            {loading.effects["future/stop_profit_loss_set"] ||
            loading.effects["future/stop_profit_loss_cancel"] ? (
              <Button disabled color="primary">
                <CircularProgress color="primary" size={20} />
              </Button>
            ) : (
              <Button onClick={this.submitStop} color="primary">
                {this.props.intl.formatMessage({ id: "确定" })}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        <ModalFlashClosePosition
          open={this.state.modal_flash_close_position_open}
          onClose={this.closeFlashClosePositionModal}
          item={this.state.flash_close_position_item}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}
OrderList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(injectIntl(OrderList));
