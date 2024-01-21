// 减持记录
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./trade_style";
import helper from "../../utils/helper";
import FinanceHeader from "../public/finance_header";
import { Table, Iconfont, message } from "../../lib";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import math from "../../utils/mathjs";
import vali from "../../utils/validator";
import CONST from "../../config/const";
import WSDATA from "../../models/data_source";
import route_map from "../../config/route_map";

const UnderweightListRC = (props) => {
  const { classes, intl, match, functions, userinfo, dispatch, qws } = props;
  const token = match.params.token || "HBC";
  const [lists, setList] = useState([]);
  const [count, setCount] = useState("");
  const [avai, setAvai] = useState("");
  const [first, setFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setInfo] = useState({
    exchange_id: "",
    symbol_id: "",
    digit: 0,
    min_trade_quantity: 0,
  });
  const datas = JSON.stringify(WSDATA.getData("mergedDepth_source"));

  function change(e) {
    let { value } = e.target;
    if (isNaN(value)) return false;
    const count = tokenInfo.digit;
    let reg = new RegExp(`([0-9]+.[0-9]{${count}})[0-9]*`);
    setCount(value.replace(reg, "$1"));
  }
  function sell() {
    if (!count || loading) {
      return;
    }
    if (Number(avai) < Number(tokenInfo.min_trade_quantity)) {
      message.error(
        intl.formatMessage({ id: "卖出数量不得小于最小交易量" }) +
          tokenInfo.min_trade_quantity
      );
      return;
    }
    setLoading(true);
    dispatch({
      type: "finance/commonReq",
      payload: {
        client_order_id: new Date().getTime(),
        price: count,
      },
      url: "quick_order",
      success: (res) => {
        setLoading(false);
        window.location.href = route_map.finance_activity_account;
      },
      fail: (code, msg) => {
        setLoading(false);
        msg && message.error(msg);
      },
    });
  }
  function getList() {
    if (!userinfo.userId) {
      return;
    }
    dispatch({
      type: "finance/commonReq",
      payload: {},
      url: "activity_account_list",
      success: (res) => {
        const arr = res.filter((list) => list.tokenName == token);
        if (arr && arr[0]) {
          setAvai(arr[0].available || "0");
        }
      },
      fail: (code, msg) => {
        msg && message.error(msg);
      },
    });
  }
  async function httpAction(payload) {
    await dispatch({
      type: "ws/merge_depth_http",
      payload: {
        dumpScale: tokenInfo.digit <= 0 ? tokenInfo.digit - 1 : tokenInfo.digit,
        symbol: tokenInfo.exchange_id + "." + tokenInfo.symbol_id,
        limit: 10,
      },
    });
  }
  /**
   * data={
   *   topic:'mergedDepth',
   *   params:{},
   *   f: true/false,
   *   id: 'mergedDepth2,
   *   shared: true/false,
   *   data:[{a:[ [120,1],[111,2] ],b:[ [12,3], [123,13] ]}] m:涨跌幅
   * }
   */
  const callback = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("mergedDepth_source", data.data, data.id, 1);
  };
  const sub = (exchange_id, symbol_id, digit) => {
    qws.sub(
      {
        id: exchange_id + "." + symbol_id + "" + digit,
        topic: "mergedDepth",
        event: "sub",
        symbol: exchange_id + "." + symbol_id,
        limit: 10,
        params: {
          dumpScale: digit <= 0 ? digit - 1 : digit,
          binary: !Boolean(window.localStorage.ws_binary),
        },
      },
      httpAction,
      callback
    );
  };
  useEffect(() => {
    if (window.WEB_CONFIG.symbol && window.WEB_CONFIG.symbol.length) {
      const symbol_id = token + "USDT";
      const arr = window.WEB_CONFIG.symbol.filter(
        (item) => item.symbolId == symbol_id
      );
      if (arr && arr[0]) {
        const mergeArr = (arr[0].digitMerge || "").split(",");
        const lastDigit =
          mergeArr.length > 0 ? mergeArr[mergeArr.length - 1] : "";
        setInfo({
          exchange_id: arr[0].exchangeId,
          symbol_id: symbol_id,
          digit: CONST.depth[lastDigit],
          min_trade_quantity: arr[0].minTradeQuantity,
        });
      }
    }
  }, [window.WEB_CONFIG.symbol]);

  useEffect(() => {
    getList();
  }, [token, userinfo]);

  useEffect(() => {
    if (tokenInfo.exchange_id && tokenInfo.symbol_id && tokenInfo.digit) {
      sub(tokenInfo.exchange_id, tokenInfo.symbol_id, tokenInfo.digit);
    }
  }, [tokenInfo]);

  useEffect(() => {
    const obj =
      JSON.parse(datas)[
        tokenInfo.exchange_id + "." + tokenInfo.symbol_id + tokenInfo.digit
      ] || {};
    setList(obj["b"] ? obj["b"].slice(0, 10) : []);
    setFirst(false);
  }, [datas, tokenInfo]);
  return (
    <div className={classes.trade}>
      <h2 className={classes.title}>
        {intl.formatMessage({ id: "闪电交易(FOK)" })}
      </h2>
      <div className={classes.con}>
        <div className={classes.left}>
          {first && lists && !lists.length ? (
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
            <div>
              <ol className={classes.header}>
                <li>
                  <p>
                    {intl.formatMessage({
                      id: "买方",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      id: "价格",
                    })}
                    (USDT)
                  </p>
                  <p>
                    {intl.formatMessage({
                      id: "数量",
                    })}
                    ({token})
                  </p>
                </li>
              </ol>
              <ul className={classes.body}>
                {lists.map((item, i) => {
                  return (
                    <li key={i} onClick={() => setCount(item[0])}>
                      <p>{i + 1}</p>
                      <p>{item[0]}</p>
                      <p>{item[1]}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <div className={classes.right}>
          <h3>
            {intl.formatMessage({ id: "可卖" })}：{avai} {token}
          </h3>
          <TextField
            fullWidth
            name="count"
            onChange={change}
            placeholder={intl.formatMessage({
              id: "请输入价格",
            })}
            InputLabelProps={{
              shrink: false,
            }}
            value={count}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={sell}
            disabled={!avai || !count || loading}
          >
            {loading ? (
              <CircularProgress size={12} />
            ) : (
              `${intl.formatMessage({ id: "卖出" })} ${token}`
            )}
          </Button>
          <p>
            {intl.formatMessage({
              id:
                "温馨提示：获得的出售额度的HBC没有出售完成之前，不能提交下一次减持出售申请",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(injectIntl(UnderweightListRC));
