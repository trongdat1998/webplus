// 合约介绍
import React from "react";
import { injectIntl } from "react-intl";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import style from "./style";
import quote_style from "../../public/quote_style";

class ModalFuture extends React.Component {
  constructor() {
    super();
  }
  handleClose = key => {
    // 确定按钮
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        modal_future: false
      }
    });
  };
  render() {
    return (
      <Dialog onClose={this.handleClose} open={this.props.open}>
        <DialogTitle>BTC/USDT合约</DialogTitle>
        <DialogContent className={this.props.classes.future}>
          <p>
            这里是文字介绍，云易护基金，在不可预的区4年，12个云交易1/4块链技术及业云交易发生后，用易负担，不依云交易资产安全和交易可信介绍文字的目标励。
          </p>
          <div>
            <span>乘数</span>: 3
          </div>
          <div>
            <span>最大杠杆</span>: 300M
          </div>
          <div>
            <span>计价单位</span>: USDT
          </div>
          <div>
            <span>交割指数</span>: 3345
          </div>
          <div>
            <span>基本风险限额</span>: 321USDT
          </div>
          <div>
            <span>基本起始保证金</span>: 3.4%
          </div>
          <div>
            <span>基本维持保证金</span>: 3.4%
          </div>
          <div>
            <span>标的交易时间</span>: 上午：9.30-11.30 下午：13:00-15:00
          </div>
          <div>
            <span>每日下单价格最大限制(标的交易时间)</span>:
            上一个交易时间段结算价的±10%
          </div>
          <div>
            <span>每日下单价格最大限制(非标的交易时间)</span>:
            上一个交易时间段结算价的±10%
          </div>
          <div>
            <span>交割时间</span>:2月23日 16：00
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.handleClose}>
            {this.props.intl.formatMessage({ id: "取消" })}
          </Button>
          <Button color="primary" onClick={this.handleClose}>
            {this.props.intl.formatMessage({ id: "确定" })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(theme => ({
  ...quote_style(theme),
  ...style(theme)
}))(injectIntl(ModalFuture));
