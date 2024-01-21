// 永续合约字段解释
import React from "react";
import { injectIntl } from "react-intl";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import style from "./style";
import quote_style from "./quote_style";

class ModalGlossary extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [
        {
          key: "限价",
          value: "用户指定价格与数量进行委托"
        },
        {
          key: "市价",
          value: "以当前市场最优价格进行委托"
        },
        {
          key: "对手价",
          value:
            "以对手方最佳价格进行开仓或平仓委托；例如开多仓，则以对手价（即卖1）为价格进行委托。"
        },
        {
          key: "排队价",
          value:
            "以相同方最佳价格进行开仓或平仓委托；例如开多仓，则以排队价（即买1）为价格进行委托。"
        },
        {
          key: "超价",
          value:
            "以对手价格+系统变动价格进行开仓或平仓委托。例如开多仓，则以对手价（即卖1）+系统变动价格进行委托，以达到在一定价格范围内可以快速下单的目的。"
        }
      ]
    };
  }
  handleClose = key => {
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        modal_glossary: false
      }
    });
  };
  render() {
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="customized-dialog-title"
        open={this.props.open}
      >
        <DialogContent>
          {this.state.data.map((item, i) => {
            return (
              <div key={i} className={this.props.classes.glossary}>
                <span>{this.props.intl.formatMessage({ id: item.key })}:</span>
                <p>{this.props.intl.formatMessage({ id: item.value })}</p>
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
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
}))(injectIntl(ModalGlossary));
