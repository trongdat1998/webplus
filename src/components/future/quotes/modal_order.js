// 下单确认框
import React from "react";
import { injectIntl } from "react-intl";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Button,
  FormControlLabel,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import style from "./style";
import quote_style from "./quote_style";
import helper from "../../../utils/helper";
import mathjs from "../../../utils/mathjs";
import CONST from "../../../config/const";
import WSDATA from "../../../models/data_source";

class ModalOrder extends React.Component {
  constructor() {
    super();
    this.state = {
      checked: false,
    };
  }
  componentDidMount() {
    this.setState({
      checked: !this.props.isConfirm,
    });
  }
  componentDidUpdate(preProps) {
    if (preProps.isConfirm != this.props.isConfirm) {
      this.setState({
        checked: !this.props.isConfirm,
      });
    }
  }
  handleChange = (e) => {
    this.setState({
      checked: !this.state.checked,
    });
  };
  handleClose = (key) => (e) => {
    // 关闭弹窗
    this.props.handleClose && this.props.handleClose();
    // this.props.dispatch({
    //   type: "future/handleChange",
    //   payload: {
    //     modal_order: false
    //   }
    // });
    // 确定按钮
    if (key) {
      if (
        (this.state.checked && this.props.isConfirm != 0) ||
        (!this.state.checked && this.props.isConfirm != 1)
      ) {
        this.props.dispatch({
          type: "future/set_order_setting",
          payload: {
            is_confirm: !this.state.checked ? 1 : 0,
          },
        });
      }
      this.props.orderCreate(
        this.props.order_sides[this.props.order_side],
        false
      );
    }
  };
  /**
   * 显示下单时价格
   * @param {string} price_type 如下:
   * price_type = 0 限价， 用户输入的价格
   * price_type != 0 不显示
   */
  getPrice = (price_type) => {
    const order_side = this.props.order_side;
    let price = "";
    if (price_type == 0) {
      price = order_side == 0 ? this.props.buy_price : this.props.sale_price;
      return price;
    }
    return "";
  };
  /**
   * 下单时,预估强平价
   * 开仓价值 x =  (反向合约 ? 1/开仓价格 : 开仓价格) * 合约乘数 * 开仓手数
   * 起始保证金= cost
   * 正向合约
   * 开多：（开仓价值  - 起始保证金）/ （(1 - 维持保证金率）* 合约乘数 * 开仓手数）
   * 开空：（开仓价值  + 起始保证金）/ （(1 + 维持保证金率）* 合约乘数 * 开仓手数）
   * 反向合约
   * 开多：（(1 + 维持保证金率）* 合约乘数 * 开仓手数）/（开仓价值  + 起始保证金）
   * 开空：（(1 - 维持保证金率）* 合约乘数 * 开仓手数） / （开仓价值  - 起始保证金)
   */
  closePrice = () => {
    const order_side = this.props.order_side; // 买卖
    const order_choose = this.props.order_choose; // 开仓，平仓
    if (order_choose == 1) {
      return "";
    }
    let p = "";
    const symbolId = (this.props.match.params.symbolId || "").toUpperCase();
    let symbol_info = this.props.config.symbols_obj.all[symbolId];

    const order_setting = this.props.order_setting;
    const riskLimits = order_setting[symbolId];
    let riskLimit = {}; // 当前方向的风险数据
    if (riskLimits) {
      riskLimits.riskLimit.map((item) => {
        if (
          item.side ===
          this.props.order_sides[this.props.order_side] + "_OPEN"
        ) {
          riskLimit = item;
        }
      });
    }
    if (
      symbol_info &&
      order_side == 0 &&
      this.props.buy_quantity &&
      riskLimit.maintainMargin
    ) {
      let price = this.getPrice(this.props.buy_price_type);
      if (!price) return "";
      // 反向合约
      // 开多： （(1 + 维持保证金率）* 合约乘数 * 开仓手数）/（开仓价值  + 起始保证金）
      if (symbol_info.isReverse) {
        price = 1 / price;
        p =
          ((1 + Number(riskLimit.maintainMargin)) *
            symbol_info.baseTokenFutures.contractMultiplier *
            this.props.buy_quantity) /
          (price *
            symbol_info.baseTokenFutures.contractMultiplier *
            Number(this.props.buy_quantity) +
            Number(this.props.cost));
      } else {
        // 正向合约
        // 开多： 开仓价值  - 起始保证金）/ （(1 - 维持保证金率）* 合约乘数 * 开仓手数）
        p =
          (price *
            symbol_info.baseTokenFutures.contractMultiplier *
            this.props.buy_quantity -
            this.props.cost) /
          ((1 - riskLimit.maintainMargin) *
            symbol_info.baseTokenFutures.contractMultiplier *
            this.props.buy_quantity);
      }
    }
    if (
      symbol_info &&
      order_side == 1 &&
      this.props.sale_quantity &&
      riskLimit.maintainMargin
    ) {
      let price = this.getPrice(this.props.sale_price_type);
      // 反向合约
      // 开空：（(1 - 维持保证金率）* 合约乘数 * 开仓手数） / （开仓价值  - 起始保证金)
      if (symbol_info.isReverse) {
        price = 1 / price;
        p =
          ((1 - riskLimit.maintainMargin) *
            symbol_info.baseTokenFutures.contractMultiplier *
            this.props.sale_quantity) /
          (price *
            symbol_info.baseTokenFutures.contractMultiplier *
            this.props.sale_quantity -
            this.props.cost);
      } else {
        // 正向合约
        // 开空：（开仓价值  + 起始保证金）/ （(1 + 维持保证金率）* 合约乘数 * 开仓手数）
        p =
          (price *
            symbol_info.baseTokenFutures.contractMultiplier *
            Number(this.props.sale_quantity) +
            Number(this.props.cost)) /
          ((1 + Number(riskLimit.maintainMargin)) *
            symbol_info.baseTokenFutures.contractMultiplier *
            this.props.sale_quantity);
      }
    }
    if (p > 0) {
      if (`${p}`.indexOf("e") > -1) {
        p = mathjs.chain(p).format({ notation: "fixed" }).done();
      }
      p = helper.digits(p, CONST["depth"][symbol_info.minPricePrecision] || 8);
    }
    if (p <= 0) {
      p = 0;
    }
    return p;
  };
  render() {
    const symbolId = (this.props.match.params.symbolId || "").toUpperCase();
    let symbol_info = this.props.config.symbols_obj.all[symbolId];
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const tokenQuote = symbol_quote[symbolId] || {};

    const displayTokenId =
      symbol_info &&
      symbol_info.baseTokenFutures &&
      symbol_info.baseTokenFutures.displayTokenId
        ? symbol_info.baseTokenFutures.displayTokenId
        : "";
    const price = this.getPrice(
      this.props.order_side == 0
        ? this.props.buy_price_type
        : this.props.sale_price_type
    );
    // 普通委托 买入价格高于最新价20%
    const confirm2 =
      Number(this.props.buy_type) == 0 &&
      Number(price) &&
      Number(tokenQuote.c) &&
      this.props.order_side == 0 &&
      price / tokenQuote.c > 1.2;
    // 普通委托 卖出价格低于最新价20%
    const confirm3 =
      Number(this.props.buy_type) == 0 &&
      Number(price) &&
      Number(tokenQuote.c) &&
      tokenQuote.c * 0.8 - price > 0 &&
      this.props.order_side == 1;
    // 计划委托 买入价格高于触发价20%
    const confirm4 =
      Number(this.props.buy_type) == 1 &&
      this.props.order_side == 0 &&
      Number(this.props.buy_trigger_price) &&
      price / this.props.buy_trigger_price > 1.2;

    // 计划委托 卖出价格低于触发价20%
    const confirm5 =
      Number(this.props.buy_type) == 1 &&
      this.props.order_side == 1 &&
      Number(this.props.sale_trigger_price) &&
      this.props.sale_trigger_price * 0.8 - price > 0;
    return (
      <Dialog onClose={this.handleClose(false)} open={this.props.open}>
        <DialogTitle>
          {this.props.intl.formatMessage({
            id: this.props.order_choose == 0 ? "开仓" : "平仓",
          })}{" "}
          |{" "}
          {this.props.intl.formatMessage({
            id: this.props.order_side == 0 ? "买入" : "卖出",
          })}
        </DialogTitle>
        <DialogContent className={this.props.classes.order}>
          {this.props.order_side == 0 && this.props.buy_type == 1 ? (
            <p>
              {this.props.intl.formatMessage(
                {
                  id: "当最新价{price}时，将进行如下委托",
                },
                {
                  price: this.props.buy_trigger_price,
                }
              )}
            </p>
          ) : (
            ""
          )}
          {this.props.order_side == 1 && this.props.sale_type == 1 ? (
            <p>
              {this.props.intl.formatMessage(
                {
                  id: "当最新价{price}时，将进行如下委托",
                },
                {
                  price: this.props.sale_trigger_price,
                }
              )}
            </p>
          ) : (
            ""
          )}
          {this.props.order_choose == 0 ? (
            <React.Fragment>
              <div>
                <span>{this.props.intl.formatMessage({ id: "杠杆" })}:</span>
                {this.props.order_side == 0
                  ? this.props.buy_leverage
                  : this.props.sale_leverage}
                X
              </div>
              <div>
                <span>
                  {this.props.intl.formatMessage({ id: "价格" })}(
                  {displayTokenId}):
                </span>
                {price}(
                {this.props.intl.formatMessage({
                  id: this.props.price_types_desc[
                    this.props.order_side == 0
                      ? this.props.buy_price_type
                      : this.props.sale_price_type
                  ],
                })}
                )
              </div>
              <div>
                <span>{this.props.intl.formatMessage({ id: "数量" })}:</span>
                {this.props.order_side == 0
                  ? this.props.buy_quantity
                  : this.props.sale_quantity}
                {this.props.intl.formatMessage({ id: "张" })}
              </div>
              <div>
                <span>{this.props.intl.formatMessage({ id: "保证金" })}:</span>
                {this.props.cost}
                {symbol_info ? symbol_info.baseTokenFutures.coinToken : ""}
              </div>
              {(this.props.order_side == 0 && this.props.buy_price_type == 0) ||
              (this.props.order_side == 1 &&
                this.props.sale_price_type == 0) ? (
                <div>
                  <span>
                    {this.props.intl.formatMessage({ id: "预估强平价" })}:
                  </span>
                  {this.closePrice()}
                </div>
              ) : (
                ""
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div>
                <span>
                  {this.props.intl.formatMessage({ id: "价格" })}(
                  {displayTokenId}):
                </span>
                {price}(
                {this.props.intl.formatMessage({
                  id: this.props.price_types_desc[
                    this.props.order_side == 0
                      ? this.props.buy_price_type
                      : this.props.sale_price_type
                  ],
                })}
                )
              </div>
              <div>
                <span>{this.props.intl.formatMessage({ id: "数量" })}:</span>
                {this.props.order_side == 0
                  ? this.props.buy_quantity
                  : this.props.sale_quantity}
                {this.props.intl.formatMessage({ id: "张" })}
              </div>
            </React.Fragment>
          )}
          {confirm2 ? (
            <p>
              {this.props.intl.formatMessage(
                { id: "您的委托价格高于最新成交价{percent}%，是否确定下单？" },
                { percent: 20 }
              )}
            </p>
          ) : (
            ""
          )}
          {confirm3 ? (
            <p>
              {this.props.intl.formatMessage(
                { id: "您的委托价格低于最新成交价{percent}%，是否确定下单？" },
                { percent: 20 }
              )}
            </p>
          ) : (
            ""
          )}
          {confirm4 ? (
            <p>
              {this.props.intl.formatMessage(
                { id: "您的委托价格高于触发价格{percent}%，是否确定下单？" },
                { percent: 20 }
              )}
            </p>
          ) : (
            ""
          )}
          {confirm5 ? (
            <p>
              {this.props.intl.formatMessage(
                { id: "您的委托价格低于触发价格{percent}%，是否确定下单？" },
                { percent: 20 }
              )}
            </p>
          ) : (
            ""
          )}
          {!confirm2 && !confirm3 && !confirm4 && !confirm5 ? (
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={this.state.checked}
                  onChange={this.handleChange}
                />
              }
              label={this.props.intl.formatMessage({ id: "不再提示" })}
            />
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.handleClose(false)}>
            {this.props.intl.formatMessage({ id: "取消" })}
          </Button>
          <Button color="primary" onClick={this.handleClose(true)}>
            {this.props.intl.formatMessage({
              id: this.props.order_choose == 0 ? "开仓" : "平仓",
            })}
            (
            {this.props.intl.formatMessage({
              id: this.props.order_side == 0 ? "买入" : "卖出",
            })}
            )
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles((theme) => ({
  ...quote_style(theme),
  ...style(theme),
}))(injectIntl(ModalOrder));
