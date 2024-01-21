// 减持记录
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./style";
import helper from "../../utils/helper";
import FinanceHeader from "../public/finance_header";
import { Table, Iconfont, message } from "../../lib";
import {
  TextField,
  Button,
  Dialog,
  Grid,
  DialogContent,
  DialogActions,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";
import math from "../../utils/mathjs";
import vali from "../../utils/validator";

const UnderweightListRC = (props) => {
  const { classes, intl, functions, userinfo, dispatch } = props;
  const limit = 20;
  const [datas, setData] = useState([]);
  const [first, setFirst] = useState(true);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const column = [
    {
      title: intl.formatMessage({
        id: "申请时间",
      }),
      key: "time",
      render: (text, record) => {
        return <span>{text}</span>;
      },
    },
    {
      title: intl.formatMessage({
        id: "当日可申请流通",
      }),
      key: "total",
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
        id: "总申请额度",
      }),
      key: "totalReduction",
      render: (text, record) => {
        return (
          <span>
            {record.status == 2 ? text : "--"} {record.tokenName}
          </span>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "分配率",
      }),
      key: "rate",
      render: (text, record) => {
        return (
          <span>
            {record.status == 2
              ? helper.format(
                  math
                    .chain(text)
                    .multiply(100)
                    .format({ notation: "fixed" })
                    .done(),
                  2
                ) + "%"
              : "--"}
          </span>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "当日申请流通",
      }),
      key: "amount",
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
        id: "分配额度",
      }),
      key: "realAmount",
      render: (text, record) => {
        return (
          <span>
            {record.status == 2 ? text : "--"} {record.tokenName}
          </span>
        );
      },
    },
    {
      title: (
        <span className="action">
          {intl.formatMessage({
            id: "状态",
          })}
        </span>
      ),
      key: "status",
      render: (text, record) => {
        const m = { 0: "申请流通", 1: "等待结果", 2: "已完成" };
        return (
          <div className={classes.text_right}>
            {intl.formatMessage({ id: m[text] })}
          </div>
        );
      },
    },
  ];
  async function getList() {
    if (!userinfo.userId || !more || loading) {
      return;
    }
    await setLoading(true);
    await dispatch({
      type: "finance/commonReq",
      payload: {
        limit,
        fromId: datas.length ? datas[datas.length - 1]["id"] : "",
      },
      url: "underweight_list",
      success: (res) => {
        if (res && res.length) {
          setData([...datas, ...res]);
        }
        setMore(res.length < limit ? false : true);
        if (first) {
          setFirst(false);
        }
      },
      fail: (code, msg) => {
        setFirst(!datas.length);
        msg && message.error(msg);
      },
    });
    setLoading(false);
  }
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className={classes.list}>
      <div className={classes.financeCont}>
        <h2 className={classes.underweight_title}>
          {intl.formatMessage({ id: "申请流通记录" })}
        </h2>
        {userinfo.userId ? (
          first ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <Table
              data={datas}
              titles={column}
              hasMore={more}
              useWindow={true}
              getMore={getList}
              showNoMoreData={true}
              loading={loading}
            />
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default withStyles(styles)(injectIntl(UnderweightListRC));
