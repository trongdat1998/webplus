// 提币结果页
import React from "react";
import { injectIntl } from "react-intl";
import { Iconfont } from "../../lib";
import route_map from "../../config/route_map";
import classnames from "classnames";
import { Grid, Button, Fab, Stepper, Step, StepLabel } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import moment from "moment";

class CashStatus extends React.Component {
  constructor() {
    super();
    this.state = {
      activeStep: 1,
      steps: ["提交", "审核", "处理中", "完成"],
      res: {
        code: "",
        msg: "",
        data: "",
      },
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    if (window.location.href.indexOf(route_map.cash_status) == -1) {
      return;
    }
    const orderId = this.props.match.params.orderId;
    if (orderId) {
      this.props.dispatch({
        type: "finance/order_status",
        payload: {
          order_id: orderId,
        },
        cb: (res) => {
          if (res.code !== "error") {
            const data = res.data || {};
            this.setState({
              res: {
                ...res,
              },
              activeStep:
                data.status == 1 ||
                data.status == 3 ||
                data.status == 5 ||
                data.status == 8
                  ? 2
                  : data.status == 2 ||
                    data.status == 4 ||
                    data.status == 6 ||
                    data.status == 7
                  ? 3
                  : 1,
            });
            if (
              data.status != 2 &&
              data.status != 4 &&
              data.status != 6 &&
              data.status != 7
            ) {
              setTimeout(() => {
                this.getData();
              }, 3000);
            }
          }
        },
      });
    }
  };
  render() {
    const classes = this.props.classes;
    const data = this.state.res.data;
    return (
      <Grid container className={classnames(classes.list, classes.financeCont)}>
        {/* <Grid item className={classes.cash_s1}>
          <Fab
            href={route_map.finance_record}
            className={classes.fab}
            size="small"
          >
            <Iconfont type="arrowLeft" size={30} />
          </Fab>
        </Grid> */}
        <Grid item className={classes.cash_s2}>
          <h2>{this.props.intl.formatMessage({ id: "提币" })}</h2>
          <div className={classes.orderStatus}>
            <strong className={classes.cash_status_tip}>
              {this.state.res.code == "OK"
                ? this.props.intl.formatMessage({
                    id: "提币申请已经提交，请耐心等待",
                  })
                : this.state.res.msg || ""}
            </strong>
            {this.state.res && this.state.res.code == "OK" ? (
              <Stepper
                activeStep={this.state.activeStep}
                alternativeLabel
                classes={{ root: classes.steproot }}
              >
                <Step key={1}>
                  <StepLabel>
                    {this.props.intl.formatMessage({ id: "提交" })}
                  </StepLabel>
                </Step>
                <Step key={2}>
                  <StepLabel>
                    {this.props.intl.formatMessage({ id: "审核" })}
                  </StepLabel>
                </Step>
                <Step key={3}>
                  <StepLabel>
                    {data &&
                    (data.status == 1 ||
                      data.status == 3 ||
                      data.status == 5 ||
                      data.status == 8)
                      ? data.statusDesc
                      : this.props.intl.formatMessage({ id: "处理中" })}
                  </StepLabel>
                </Step>
                <Step key={4}>
                  <StepLabel>
                    {data &&
                    (data.status == 2 ||
                      data.status == 4 ||
                      data.status == 6 ||
                      data.status == 6)
                      ? data.statusDesc
                      : this.props.intl.formatMessage({ id: "完成" })}
                  </StepLabel>
                </Step>
              </Stepper>
            ) : (
              ""
            )}
            {this.state.res.code == "OK" ? (
              <Grid
                container
                className={classes.orderStatus}
                alignItems="center"
              >
                <Grid item xs={4}>
                  <span className={classes.orderStatusLabel}>
                    {this.props.intl.formatMessage({ id: "币种" })}:
                  </span>
                </Grid>
                <Grid item xs={8}>
                  {data.tokenName}
                </Grid>
                <Grid item xs={4}>
                  <span className={classes.orderStatusLabel}>
                    {this.props.intl.formatMessage({ id: "提币地址" })}:
                  </span>
                </Grid>
                <Grid item xs={8}>
                  {data.address} {data.addressExt}
                </Grid>
                <Grid item xs={4}>
                  <span className={classes.orderStatusLabel}>
                    {this.props.intl.formatMessage({ id: "到账数量" })}:
                  </span>
                </Grid>
                <Grid item xs={8}>
                  {data.arriveQuantity}
                </Grid>
                <Grid item xs={4}>
                  <span className={classes.orderStatusLabel}>
                    {this.props.intl.formatMessage({ id: "手续费" })}:
                  </span>
                </Grid>
                <Grid item xs={8}>
                  {data.fee}
                </Grid>
                <Grid item xs={4}>
                  <span className={classes.orderStatusLabel}>
                    {this.props.intl.formatMessage({ id: "申请时间" })}
                  </span>
                </Grid>
                <Grid item xs={8}>
                  {data.time
                    ? moment
                        .utc(Number(data.time))
                        .local()
                        .format("YYYY-MM-DD HH:mm:ss")
                    : ""}
                </Grid>
              </Grid>
            ) : (
              ""
            )}
            {this.state.res.code == "OK" ? (
              <div style={{ margin: "40px auto", textAlign: "center" }}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    window.localStorage.setItem("TabValue", "cash");
                    window.location.href = route_map.finance_record;
                  }}
                >
                  {this.props.intl.formatMessage({
                    id: "查看提币记录跟踪状态",
                  })}
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(injectIntl(CashStatus));
