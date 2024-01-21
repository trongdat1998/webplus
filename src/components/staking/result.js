// 理财申购结果
import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import styles from "./periodic_style";
import classnames from "classnames";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import { message } from "../../lib";
import moment from "moment";
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

const StakingResultRC = (props) => {
  const { classes, intl, match, dispatch } = props;
  const product_id = match.params.product_id;
  const order_id = match.params.order_id;
  const [firstReq, setFirstReq] = useState(true);
  const [lists, setList] = useState([]);
  const [result, setResult] = useState({
    referenceApr: "",
    amount: "",
    orderId: "",
    tokenName: "",
  });
  const [time, setTime] = useState(6000);

  function handleRate(str) {
    const arr = str.split(",");
    let res = [];
    if (arr[1]) {
      res[0] = arr[0];
      res[1] = arr[1];
    } else {
      res[0] = arr[0];
    }
    return res;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (result.tokenName && lists.length) {
        clearInterval(timer);
      } else {
        setTime((t) => {
          if (t - 1000 < 0) {
            clearInterval(timer);
            return 0;
          } else if (t - 1000 >= 0) {
            return Math.max(0, t - 1000);
          } else {
            clearInterval(timer);
            return 0;
          }
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lists.length, result]);

  useEffect(() => {
    async function getPlan() {
      const res = await dispatch({
        type: "coinplus/commonReq",
        payload: {
          product_id,
          order_id,
        },
        url: "repayment_schedule",
      });
      if (res.code == "OK" && res.data) {
        setList(res.data.schedules || []);
        setFirstReq(false);
      } else {
        if (time <= 0) {
          message.error(res.msg);
        }
      }
    }
    async function getResult() {
      const res = await dispatch({
        type: "coinplus/commonReq",
        payload: {
          product_id,
          transfer_id: order_id,
        },
        url: "subscribe_result",
      });
      if (res.code == "OK" && res.data) {
        setResult(res.data);
      } else {
        if (time <= 0) {
          message.error(res.msg);
          setTimeout(function () {
            window.location.href =
              route_map.staking_periodical + "/" + product_id;
          }, 2000);
        }
      }
    }
    const m = helper.deadlineFormat(time)[3];
    if (m / 2 === Math.floor(m / 2)) {
      getPlan();
      getResult();
    }
  }, [order_id, product_id, dispatch, time]);

  return (
    <div className={classes.result}>
      {time && !result.tokenName ? (
        <div className={classnames(classes.loading, classes.screenWidth)}>
          <p>
            <CircularProgress size={60} />
            <span>{helper.deadlineFormat(time)[3]}s</span>
          </p>
          <p>{intl.formatMessage({ id: "处理中..." })}</p>
        </div>
      ) : result.tokenName ? (
        <div>
          <h2 className={classes.screenWidth}>
            {intl.formatMessage({ id: "申购成功" })}
          </h2>
          <div
            className={classnames(
              classes.screenWidth,
              classes.center,
              classes.result_con
            )}
          >
            <img src={require("../../assets/confirm.png")} />
            <p>
              {intl.formatMessage({ id: "申购成功" })} {result.amount}{" "}
              {result.tokenName}
            </p>
            <p>
              {intl.formatMessage({ id: "约定年化" })}{" "}
              {/* {(Number(handleRate(result.referenceApr || "")[0]) * 10000) / 100}% */}
              {result.referenceApr}%
            </p>
          </div>
          <div className={classes.result_em}></div>
          <div className={classes.screenWidth}>
            <div className={classes.schedule}>
              <h3>{intl.formatMessage({ id: "还款计划" })}</h3>
              {firstReq ? (
                <div
                  style={{
                    minHeight: 300,
                    textAlign: "center",
                    lineHeight: "300px",
                  }}
                >
                  <CircularProgress />
                </div>
              ) : (
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell>
                        {intl.formatMessage({ id: "还款次数" })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({ id: "还款时间" })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({ id: "预计还款金额" })}
                      </TableCell>
                      <TableCell align="right">
                        {intl.formatMessage({ id: "状态" })}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lists.map((item, i) => {
                      const term = lists.length;
                      return (
                        <TableRow key={i} className={classes.tableList}>
                          <TableCell>
                            {i + 1}/{term}
                            {intl.formatMessage({ id: "期" })}
                          </TableCell>
                          <TableCell>
                            {item.rebateDate
                              ? moment
                                  .utc(Number(item.rebateDate))
                                  .local()
                                  .format("YYYY/MM/DD")
                              : ""}
                          </TableCell>
                          {item.rebateAmount == 0 ? (
                            <TableCell>
                              {intl.formatMessage({ id: "floating" })}
                            </TableCell>
                          ) : (
                            <TableCell>
                              {item.rebateAmount} {item.tokenName}
                            </TableCell>
                          )}
                          <TableCell align="right">
                            {intl.formatMessage({
                              id: item.status == 0 ? "未开始" : "已完成",
                            })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
            <div className={classnames(classes.center, classes.result_btn)}>
              <Button
                variant="outlined"
                color="primary"
                href={route_map.staking_finance}
              >
                {intl.formatMessage({ id: "查看资产" })}
              </Button>
              <Button
                variant="contained"
                color="primary"
                href={route_map.staking_periodical + "/" + product_id}
              >
                {intl.formatMessage({ id: "继续申购" })}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default withStyles(styles)(injectIntl(StakingResultRC));
