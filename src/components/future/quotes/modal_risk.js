// 风险限额
import React from "react";
import { injectIntl } from "react-intl";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import style from "./style";
import quote_style from "./quote_style";
import math from "../../../utils/mathjs";

class ModalRisk extends React.Component {
  constructor() {
    super();
    this.state = {
      now: ""
    };
  }
  change = id => e => {
    const key_risk = this.props.key_risk;
    const selectId = this.props[key_risk];
    if (id == selectId) {
      return;
    }
    this.setState({
      now: id
    });
  };
  handleClose = (key, underlying_id) => e => {
    // 确定按钮
    if (key && this.state.now) {
      const v =
        key && this.state.now
          ? this.state.now
          : this.props[this.props.key_risk];
      this.props.dispatch({
        type: "future/set_risk_limit",
        dispatch: this.props.dispatch,
        payload: {
          side: this.props.key_risk == "buy_risk" ? "BUY_OPEN" : "SELL_OPEN",
          risk_limit_id: v,
          underlying_id,
          key: this.props.key_risk,
          symbol_id: this.props.match.params.symbolId.toUpperCase()
        }
      });
    } else {
      this.props.dispatch({
        type: "future/handleChange",
        payload: {
          modal_risk: false
        }
      });
    }
    this.setState({
      now: ""
    });
  };
  render() {
    // 根据key_risk获取当前的风险值 this.props.key_risk = buy_risk , sale_risk
    const key_risk = this.props.key_risk;
    const selectId = this.props[key_risk];
    let symbolId = this.props.match.params.symbolId;

    if (!symbolId) {
      return (
        <Dialog onClose={this.handleClose(false)} open={this.props.open} />
      );
    }

    // 风险限额配置表

    symbolId = symbolId.toUpperCase();
    let symbol_info = this.props.config.symbols_obj.all[symbolId];
    let futuresRiskLimits = symbol_info.baseTokenFutures
      ? symbol_info.baseTokenFutures.riskLimits
      : [];
    let underlying_id = symbol_info.secondLevelUnderlyingId;

    let current = {};
    let now = {};
    futuresRiskLimits.map(item => {
      if (item.riskLimitId == selectId) {
        current = item;
      }
      if (item.riskLimitId == this.state.now) {
        now = item;
      }
    });
    let coinToken = this.props.intl.formatMessage({ id: "张" });
    return (
      <Dialog onClose={this.handleClose(false)} open={this.props.open}>
        <DialogTitle>
          {this.props.intl.formatMessage({ id: "更改风险限额" })}
        </DialogTitle>
        <DialogContent className={this.props.classes.risk}>
          <Grid container spacing={2}>
            {futuresRiskLimits.map(item => {
              return (
                <Grid item key={item.riskLimitId}>
                  <Button
                    color={
                      this.state.now == item.riskLimitId ? "primary" : "default"
                    }
                    disabled={selectId == item.riskLimitId}
                    variant="contained"
                    onClick={this.change(item.riskLimitId)}
                  >
                    {item.riskLimitAmount}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
          <Table className={this.props.classes.table}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="center">
                  {this.props.intl.formatMessage({ id: "风险限额" })}
                </TableCell>
                <TableCell align="center">
                  {this.props.intl.formatMessage({ id: "维持保证金" })}
                </TableCell>
                <TableCell align="center">
                  {this.props.intl.formatMessage({ id: "起始保证金" })}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  {this.props.intl.formatMessage({ id: "当前值" })}
                </TableCell>
                <TableCell align="center">
                  {current.riskLimitAmount}
                  {coinToken}
                </TableCell>
                <TableCell align="center">
                  {current.maintainMargin
                    ? math
                        .chain(math.bignumber(current.maintainMargin))
                        .multiply(100)
                        .done() + "%"
                    : "-"}
                </TableCell>
                <TableCell align="center">
                  {current.initialMargin
                    ? math
                        .chain(math.bignumber(current.initialMargin))
                        .multiply(100)
                        .done() + "%"
                    : "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  {this.props.intl.formatMessage({ id: "最新值" })}
                </TableCell>
                <TableCell align="center">
                  {now.riskLimitAmount || "-"}
                  {now.riskLimitAmount ? coinToken : ""}
                </TableCell>
                <TableCell align="center">
                  {now.maintainMargin
                    ? math
                        .chain(math.bignumber(now.maintainMargin))
                        .multiply(100)
                        .done() + "%"
                    : "-"}
                </TableCell>
                <TableCell align="center">
                  {now.initialMargin
                    ? math
                        .chain(math.bignumber(now.initialMargin))
                        .multiply(100)
                        .done() + "%"
                    : "-"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.handleClose(false)}>
            {this.props.intl.formatMessage({ id: "取消" })}
          </Button>
          <Button
            color="primary"
            onClick={this.handleClose(true, underlying_id)}
          >
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
}))(injectIntl(ModalRisk));