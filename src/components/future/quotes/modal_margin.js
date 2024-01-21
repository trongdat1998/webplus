// 保证金
import React from "react";
import { injectIntl } from "react-intl";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Input,
  TextField,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import style from "./style";
import quote_style from "../index_order_style";
import helper from "../../../utils/helper";
import CONST from "../../../config/const";
import { message } from "../../../lib";

class ModalMargin extends React.Component {
  constructor() {
    super();
    this.state = {
      quantity: "",
      msg: "",
      side: "add",
    };
  }
  change = (marginPrecision) => (e) => {
    let v = e.target.value.replace(/e/i, "");
    if (Number.isNaN(Number(v)) || Number(v) < 0) return;
    const max = this.getMaxMargin();
    v = Number(v) - max >= 0 ? max : v;
    let p = `${v}`.split(".");
    if (p[1] && p[1].length > marginPrecision) {
      p[1] = p[1].slice(0, marginPrecision);
      p = p[0] + "." + p[1];
      v = p;
    }
    this.setState({
      quantity: v,
      msg: "",
    });
  };
  blur = (marginPrecision, e) => {
    this.setState({
      quantity: Number(this.state.quantity)
        ? Number(this.state.quantity)
        : this.state.quantity,
    });
  };
  handleClose = (key) => (e) => {
    // 确定按钮
    if (key) {
      if (!this.state.quantity || !Number(this.state.quantity)) {
        this.setState({
          msg: this.props.intl.formatMessage({ id: "请输入金额" }),
        });
        return;
      }
      if (Number(this.state.quantity) < 0) {
        this.setState({
          msg: this.props.intl.formatMessage({ id: "请输入正确的金额" }),
          quantity: "",
        });
        return;
      }
      this.props.dispatch({
        type: "future/modify_margin",
        payload: {
          symbol_id: this.props.item.symbolId,
          type: this.state.side == "add" ? "INC" : "DEC",
          amount: this.state.quantity,
          is_long: this.props.item.isLong,
        },
        callback: (res) => {
          if (res.code == "OK" && res.data && res.data.success) {
            message.info(
              this.props.intl.formatMessage({
                id:
                  this.state.side == "add"
                    ? "保证金增加成功"
                    : "保证金减少成功",
              })
            );
            this.props.dispatch({
              type: "future/handleChange",
              payload: {
                modal_margin: false,
              },
            });
          } else {
            message.error(res.msg);
          }
        },
      });
    } else {
      this.setState({
        quantity: "",
        msg: "",
      });
      this.props.dispatch({
        type: "future/handleChange",
        payload: {
          modal_margin: false,
        },
      });
    }
  };
  /**
   * 最大可增加/减少的保证金数
   * 增加 = 剩余可用保证金 this.props.future_tradeable[symbol_id][profitLoss][coinAvailable]
   * 减少 = this.props.item.minMargin
   */
  getMaxMargin = () => {
    let p = 0;
    // 增加保证金
    const item = this.props.item;
    if (!item) return p;
    if (this.state.side == "add") {
      let tradeable = this.props.future_tradeable[item.symbolId];
      if (!tradeable) return p;
      p = tradeable.profitLoss.coinAvailable;
      return p;
    }
    p = item.minMargin || 0;
    return p;
  };
  changeSide = (key) => (e) => {
    this.setState({
      side: key,
      quantity: "",
      msg: "",
    });
  };
  /**
   * 增加，减少保证金时，预估强平价
   *  输入的保证金2 = 方向==增加 ？ 输入的保证金 ： -输入的保证金；
   * 正向
   * 多仓：(开仓价值 - 起始保证金 - 输入的保证金2) / ( (1 - 维持保证金率) * 合约乘数 * 手数)
   * 空仓：(开仓价值 + 起始保证金 + 输入的保证金2) / ( (1 + 维持保证金率) * 合约乘数 * 手数)
   * 反向
   * 多仓:  ( (1 + 维持保证金率) * 合约乘数 * 手数) / (开仓价值 + 起始保证金 + 输入的保证金2)
   * 空仓： ( (1 - 维持保证金率) * 合约乘数 * 手数) / (开仓价值 - 起始保证金 - 输入的保证金2)
   *
   * 开仓均价： item.avgPrice
   * 起始保证金: item.margin
   * 开仓价值: 正向 = item.avgPrice * item.total * 合约乘数 反向= (合约乘数/item.avgPrice) * item.total
   * 维持保证金率: riskLimit.maintainMargin
   * 手数: item.total
   *
   */
  closePrice = () => {
    let p = "";
    const item = this.props.item || {};
    const symbolId = item.symbolId;
    let symbol_info = this.props.config.symbols_obj.all[symbolId];

    if (!symbol_info) return "";
    const contractMultiplier = symbol_info.baseTokenFutures.contractMultiplier;
    const order_setting = this.props.order_setting || {};
    const riskLimits = order_setting[symbolId];
    if (!riskLimits) return;
    let riskLimit = {}; // 当前方向的风险数据
    if (riskLimits) {
      riskLimits.riskLimit.map((it) => {
        if (it.side === this.props.order_sides[item.isLong] + "_OPEN") {
          riskLimit = it;
        }
      });
    }

    if (this.state.quantity === "") {
      return "";
    }
    let quantity =
      this.state.side == "add"
        ? Number(this.state.quantity)
        : -Number(this.state.quantity);
    // 多仓
    if (Number(item.isLong) === 1) {
      // 反向
      // ( (1 + 维持保证金率) * 合约乘数 * 手数) / (开仓价值 + 起始保证金 + 输入的保证金)
      if (symbol_info.isReverse) {
        p =
          ((1 + Number(riskLimit.maintainMargin)) *
            contractMultiplier *
            item.total) /
          ((contractMultiplier / item.avgPrice) * item.total +
            Number(item.margin) +
            Number(quantity));
      } else {
        // 正向
        // (开仓价值 - 起始保证金 - 输入的保证金) / ( (1 - 维持保证金率) * 合约乘数 * 手数)
        p =
          (item.avgPrice * item.total * contractMultiplier -
            item.margin -
            quantity) /
          ((1 - riskLimit.maintainMargin) * contractMultiplier * item.total);
      }
    }
    // 空仓
    if (Number(item.isLong) === 0) {
      // 正向
      // (开仓价值 + 起始保证金 + 输入的保证金) / ( (1 + 维持保证金率) * 合约乘数 * 手数)
      // 反向
      // ( (1 - 维持保证金率) * 合约乘数 * 手数) / (开仓价值 - 起始保证金 - 输入的保证金)
      if (symbol_info.isReverse) {
        p =
          ((1 - riskLimit.maintainMargin) * contractMultiplier * item.total) /
          ((contractMultiplier / item.avgPrice) * item.total -
            item.margin -
            quantity);
      } else {
        p =
          (item.avgPrice * item.total * contractMultiplier +
            Number(item.margin) +
            Number(quantity)) /
          ((1 + Number(riskLimit.maintainMargin)) *
            contractMultiplier *
            item.total);
      }
    }
    if (p > 0) {
      p = helper.digits(p, CONST["depth"][symbol_info.minPricePrecision] || 8);
    }
    if (p <= 0) {
      p = 0;
    }
    return p;
  };
  render() {
    const { classes } = this.props;
    const propsItem = this.props.item || {};
    const symbolId = propsItem.symbolId || "";

    let symbol_info = this.props.config.symbols_obj.all[symbolId.toUpperCase()];

    const coinToken = symbol_info ? symbol_info.baseTokenFutures.coinToken : "";
    const displayTokenId = symbol_info
      ? symbol_info.baseTokenFutures.displayTokenId
      : "";
    // 保证金精度
    const marginPrecision =
      symbol_info && symbol_info.baseTokenFutures
        ? CONST["depth"][symbol_info.baseTokenFutures.marginPrecision]
        : "";
    return (
      <Dialog onClose={this.handleClose(false)} open={this.props.open}>
        <DialogTitle className={classes.sides}>
          <span
            onClick={this.changeSide("add")}
            className={this.state.side == "add" ? classes.side : ""}
          >
            {this.props.intl.formatMessage({
              id: "增加保证金",
            })}
          </span>
          <span
            onClick={this.changeSide("sub")}
            className={this.state.side == "add" ? "" : classes.side}
          >
            {this.props.intl.formatMessage({
              id: "减少保证金",
            })}
          </span>
        </DialogTitle>

        <DialogContent className={this.props.classes.margin}>
          <div>
            <span>
              {this.props.intl.formatMessage({
                id: "合约",
              })}
              :
            </span>
            {propsItem.symbolName}
          </div>
          <div>
            <span>
              {this.props.intl.formatMessage({ id: "仓位" })}(
              {this.props.intl.formatMessage({ id: "张" })}):
            </span>
            {propsItem.total}
          </div>
          <div>
            <span>
              {this.props.intl.formatMessage({ id: "仓位保证金" })}({coinToken}
              ):
            </span>
            {propsItem.margin && marginPrecision
              ? helper.digits(propsItem.margin, marginPrecision)
              : propsItem.margin}
          </div>
          <div>
            <span>
              {this.props.intl.formatMessage({
                id:
                  this.state.side == "add"
                    ? "最多增加保证金"
                    : "最多减少保证金",
              })}
              ({coinToken}):
            </span>
            {this.getMaxMargin()}
          </div>
          <div>
            <span>
              {this.props.intl.formatMessage({
                id: this.state.side == "add" ? "增加保证金" : "减少保证金",
              })}
              :
            </span>
            <TextField
              className={this.props.classes.margin_input}
              value={this.state.quantity}
              onChange={this.change(marginPrecision)}
              onBlur={this.blur.bind(this, marginPrecision)}
              error={Boolean(this.state.msg)}
              label={this.state.msg}
            />
          </div>
          {/* <div>
            <span>
              {this.props.intl.formatMessage({
                id:
                  this.state.side == "add" ? "增加后强平价格" : "减少后强平价格"
              })}
              ({displayTokenId}):
            </span>
            {this.closePrice()}
          </div> */}
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={this.handleClose(false)}>
            {this.props.intl.formatMessage({ id: "取消" })}
          </Button>
          <Button color="primary" onClick={this.handleClose(true)}>
            {this.props.intl.formatMessage({ id: "确定" })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles((theme) => ({
  ...quote_style(theme),
  ...style(theme),
}))(injectIntl(ModalMargin));
