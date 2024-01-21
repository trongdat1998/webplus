// 理财申购结果
import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import styles from "./order_style";
import classnames from "classnames";
import route_map from "../../config/route_map";
import CONST from "../../config/const";
import helper from "../../utils/helper";
import { message, Table, Iconfont } from "../../lib";
import moment from "moment";
import {
  CircularProgress,
  Popper,
  Paper,
  ClickAwayListener,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import TableNew from "@material-ui/core/Table";

const StakingOrderRC = (props) => {
  const { classes, intl, userinfo, dispatch } = props;
  const [firstReq, setFirstReq] = useState(true);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lists, setList] = useState([]);
  const [modal, setModal] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const column = [
    {
      title: intl.formatMessage({
        id: "项目名称",
      }),
      key: "productName",
      render: (text, record) => {
        return <span>{text}</span>;
      },
    },
    {
      title: intl.formatMessage({
        id: "申购时间",
      }),
      key: "createdAt",
      render: (text, record) => {
        return (
          <span className="time">
            {text
              ? moment.utc(Number(text)).local().format("YYYY/MM/DD HH:mm:ss")
              : ""}
          </span>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "持有金额",
      }),
      key: "payAmount",
      render: (text, record) => {
        return (
          <span>
            {text} {record.tokenName}
          </span>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "约定年化",
      }),
      key: "referenceApr",
      render: (text, record) => {
        return (
          <span className="apr">
            {/* <em>{(Number(handleRate(text || "")[0]) * 10000) / 100}</em>% */}
            <em>{text}</em>%
          </span>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "期限",
      }),
      key: "timeLimit",
      render: (text, record) => {
        return (
          <span>
            {text}
            {intl.formatMessage({ id: "天" })}
          </span>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "到期时间",
      }),
      key: "productEndDate",
      render: (text, record) => {
        return (
          <span className="time">
            {text
              ? moment.utc(Number(text)).local().format("YYYY/MM/DD HH:mm:ss")
              : ""}
          </span>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "状态",
      }),
      key: "status",
      render: (text, record) => {
        const statusMap = {
          0: "申购中",
          1: "待计息",
          2: "申购取消",
          3: "计息中",
          4: "已完成",
        };
        return <span>{intl.formatMessage({ id: statusMap[text] })}</span>;
      },
    },
    {
      title: intl.formatMessage({
        id: "操作",
      }),
      key: "",
      render: (text, record) => {
        return (
          <p
            className="action"
            onClick={(e) => {
              getDetail(e, record.productId, record.orderId);
            }}
            aria-describedby={
              modal && record.orderId == orderId
                ? "modal" + record.orderId
                : undefined
            }
            // aria-haspopup={record.orderId == orderId}
          >
            {intl.formatMessage({ id: "查看更多" })}
            <Iconfont type="arrowDown" size="20" />
          </p>
        );
      },
    },
  ];

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

  async function getList() {
    const order_id = firstReq
      ? 0
      : lists.length
      ? lists[lists.length - 1]["orderId"]
      : "";
    setLoading(true);
    const res = await dispatch({
      type: "coinplus/commonReq",
      payload: {
        from_order_id: order_id,
        limit: CONST.rowsPerPage2,
      },
      url: "staking_order_list",
    });
    if (res.code == "OK" && res.data) {
      setList([...lists].concat(res.data || []));
      setMore(!(res.data.length < CONST.rowsPerPage2));
      setFirstReq(false);
    } else {
      message.error(res.msg);
    }
    setLoading(false);
  }

  async function getPlan(product_id, order_id) {
    setScheduleLoading(true);
    const res = await props.dispatch({
      type: "coinplus/commonReq",
      payload: {
        product_id,
        order_id,
      },
      url: "repayment_schedule",
    });
    if (res.code == "OK" && res.data) {
      setSchedule(res.data.schedules || []);
      setScheduleLoading(false);
    } else {
      message.error(res.msg);
    }
  }

  async function getDetail(e, product_id, order_id) {
    setModal(modal ? null : e.currentTarget);
    setOrderId(order_id);
    getPlan(product_id, order_id);
  }

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className={classnames(classes.order, classes.screenWidth)}>
      <h2>{intl.formatMessage({ id: "理财订单" })}</h2>
      {loading ? (
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
        <Table
          widthStyle={classes.order_table_width}
          data={lists}
          titles={column}
          hasMore={more}
          loading={userinfo.userId ? loading : false}
          showNoMoreData={true}
          useWindow={false}
          getMore={getList}
        />
      )}
      <Popper
        open={Boolean(modal)}
        anchorEl={modal}
        id={"modal" + orderId}
        placement="bottom-end"
        style={{ zIndex: 200 }}
      >
        <Paper className={classes.commonPaper}>
          <ClickAwayListener
            onClickAway={(e) => {
              setModal(null);
            }}
          >
            <div className={classes.schedule}>
              {scheduleLoading ? (
                <div
                  style={{
                    minHeight: 240,
                    textAlign: "center",
                    lineHeight: "240px",
                  }}
                >
                  <CircularProgress />
                </div>
              ) : (
                <TableNew className={classes.table}>
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell>
                        {intl.formatMessage({ id: "还款次数" })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({ id: "还款时间" })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({ id: "还款金额" })}
                      </TableCell>
                      <TableCell align="right">
                        {intl.formatMessage({ id: "状态" })}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedule.map((item, i) => {
                      const term = schedule.length;
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
                </TableNew>
              )}
            </div>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </div>
  );
};

export default withStyles(styles)(injectIntl(StakingOrderRC));
