import React from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import moment from "moment";
import { injectIntl } from "react-intl";
import helper from "../../utils/helper";

class ItemRC extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {
    if (helper.changeVersion()) {
      window.location.href = "/activity/xo/?/order";
      return;
    }
    this.getMore();
  }
  getMore = () => {
    this.props.dispatch({
      type: "ieo/getOrder",
      payload: {}
    });
  };
  render() {
    const { classes } = this.props;
    const data = helper
      .excludeRepeatArray("orderId", this.props.ieo_orders)
      .sort((a, b) => (a.orderId - b.orderId > 0 ? -1 : 1));
    return (
      <div className={classes.order}>
        <div className={classes.order_title}>
          {this.props.intl.formatMessage({ id: "申购订单" })}
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {this.props.intl.formatMessage({
                  id: "时间"
                })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({
                  id: "项目名称"
                })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({
                  id: "申购金额"
                })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({
                  id: "申购份数"
                })}
              </TableCell>
              <TableCell>
                {this.props.intl.formatMessage({
                  id: "订单号"
                })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(item => {
              return (
                <TableRow key={item.orderId}>
                  <TableCell>
                    {Number(item.purchaseTime)
                      ? moment(Number(item.purchaseTime)).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      : ""}
                  </TableCell>
                  <TableCell>{item.projectName}</TableCell>
                  <TableCell>
                    {Number(item.price) && Number(item.orderQuantity)
                      ? Number(item.price * item.orderQuantity)
                      : ""}
                  </TableCell>
                  <TableCell>{item.orderQuantity}</TableCell>
                  <TableCell>{item.orderId}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className={classes.order_more}>
          {this.props.ieo_order_more ? (
            this.props.loading.effects["ieo/getOrder"] ? (
              <CircularProgress />
            ) : (
              <Button
                color="primary"
                variant="contained"
                onClick={this.getMore}
              >
                {this.props.intl.formatMessage({ id: "加载更多" })}
              </Button>
            )
          ) : (
            <p>{this.props.intl.formatMessage({ id: "无更多数据" })}</p>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(ItemRC));
