// 活动账户资产
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
import route_map from "../../config/route_map";
import TransferModal from "../public/transfer_modal";

const ActivityAccountRC = (props) => {
  const {
    classes,
    intl,
    functions,
    total_asset,
    rates,
    hidden_balance,
    userinfo,
    dispatch,
    history,
    account_activity_index,
  } = props;
  const [unit, setUnit] = useState("");
  const [financeRate, setFinanceRate] = useState(["", "--"]);
  const [datas, setData] = useState([]);
  const [hasLimit, setLimit] = useState(true);
  const [first, setFirst] = useState(true);
  const [applyDialog, setApplyDialog] = useState(false);
  const [resultDialog, setResultDialog] = useState(false);
  const [submitDialog, setSubmitDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [info, setInfo] = useState({
    orgId: "",
    time: "",
    total: 0,
    userTotal: 0,
    isBuy: false,
    tokenId: "",
    userUnderweight: {},
  });
  const [avai, setAvai] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentToken, setToken] = useState("USDT");
  const column = [
    {
      title: intl.formatMessage({
        id: "币种",
      }),
      key: "tokenName",
      render: (text, record) => {
        return (
          <div className={classes.tokenIcon}>
            {record.iconUrl ? (
              <img src={record.iconUrl} />
            ) : (
              <em className="noIcon" />
            )}
            <p>
              <span>{record.tokenName}</span>
              <span>{record.tokenFullName}</span>
            </p>
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "可用",
      }),
      key: "available",
      render: (text, record) => {
        return (
          <span>{hidden_balance ? "********" : helper.digits(text, 2)}</span>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "冻结",
      }),
      key: "locked",
      render: (text, record) => {
        return (
          <span>{hidden_balance ? "********" : helper.digits(text, 2)}</span>
        );
      },
    },
    {
      title: "",
      key: "tokenId",
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              setToken(text);
              setModal(true);
            }}
          >
            {text == "USDT" ? intl.formatMessage({ id: "划转" }) : ""}
          </a>
        );
      },
    },
  ];
  function handleChange(e) {
    let v = e.target.value;
    v = v
      .replace(/[^0-9\.]/, "")
      .replace(/^0{1,}/, "0")
      .replace(/^(0)([1-9])/, ($1, $2) => {
        return $2;
      })
      .replace(/^\./, "0.");
    let d = v.split(".");
    if (v && !vali.isFloat(v)) {
      return;
    } else {
      let precision = info.userTotal.split(".");
      let p = precision && precision[1] ? precision[1].length : 0;
      if (d[1] && d[1].length > p) {
        v = helper.digits(v, p);
      }
      const m = Math.min(info.userTotal, info.total);
      if (parseFloat(v) > parseFloat(m)) {
        setAmount(m);
      } else {
        setAmount(v);
      }
    }
  }

  function getFinance() {
    dispatch({
      type: "layout/getTotalAsset",
      payload: {
        unit: "USDT",
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
        setData(res);
        const arr = res.filter((list) => list.tokenName == unit);
        if (arr && arr[0]) {
          setAvai(arr[0].available);
        }
        setFirst(false);
      },
      fail: (code, msg) => {
        msg && message.error(msg);
      },
    });
  }
  function getAccountInfo() {
    if (!userinfo.userId) {
      return;
    }
    dispatch({
      type: "finance/commonReq",
      payload: {},
      url: "underweight_info",
      success: (res) => {
        setInfo(res);
        setUnit(res.tokenId);
      },
      fail: (code, msg) => {
        msg && message.error(msg);
      },
    });
  }
  function setTotal() {
    setAmount(Math.min(info.userTotal, info.total));
  }
  async function apply() {
    let new_info = info;
    if (!userinfo.userId || loading) {
      return;
    }
    await setLoading(true);
    await dispatch({
      type: "finance/commonReq",
      url: "underweight",
      payload: {
        amount,
      },
      success: (res) => {
        setApplyDialog(false);
        setSubmitDialog(true);
        setLoading(false);
        new_info["isBuy"] = true;
        setInfo(new_info);
      },
      fail: (code, msg) => {
        msg && message.error(msg);
        setLoading(false);
      },
    });
  }
  function goTrade() {
    history.push(route_map.flash_trade + "/" + unit + "/" + avai);
  }
  useEffect(() => {
    const cRate = helper.currencyValue(
      rates,
      total_asset ? total_asset.activeCoinAsset : 0,
      total_asset ? total_asset.unit : 0
    );
    setFinanceRate(cRate);
  }, [rates, total_asset]);

  useEffect(() => {
    getList();
  }, [getList, unit, userinfo]);

  useEffect(() => {
    getAccountInfo();
  }, [getAccountInfo, userinfo]);

  useEffect(() => {
    getFinance();
  }, [getFinance]);
  return (
    <div className={classes.list}>
      <FinanceHeader tab="activity" functions={functions} {...props} />
      <div className={classes.financeCont}>
        <div className={classes.card_bg}>
          <Grid container className={classes.card}>
            <Grid item xs={8}>
              <p>
                {intl.formatMessage({ id: "当日可申请流通" })} {unit}:{" "}
                {info.total == "0"
                  ? intl.formatMessage({ id: "待计算" })
                  : info.total}
              </p>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <Button
                variant="outlined"
                className={classes.btn1}
                href={route_map.underweight_list}
              >
                {intl.formatMessage({ id: "申请记录" })}
              </Button>
              {info.status == 2 ? (
                <Button
                  variant="contained"
                  className={classes.btn2}
                  disabled={info.status == 2 && !info.isBuy}
                  onClick={() => {
                    if (info.status == 2 && info.isBuy) {
                      setResultDialog(true);
                    }
                  }}
                >
                  {intl.formatMessage({ id: "结果公布" })}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className={classes.btn2}
                  disabled={
                    info.total == "0" || (info.status == 1 && !info.isBuy)
                  }
                  onClick={() => {
                    if (info.isBuy) {
                      setSubmitDialog(true);
                    } else if (info.status == 0 && !info.isBuy) {
                      setApplyDialog(true);
                    }
                  }}
                >
                  {intl.formatMessage({ id: "申请流通" })}
                </Button>
              )}
            </Grid>
          </Grid>
        </div>
        <div className={classNames("second", classes.activity_finance)}>
          <p className={classes.info}>
            <span>
              {intl.formatMessage({ id: "资产折合" })}(
              {total_asset ? total_asset.unit : ""}
              ):
            </span>
            {total_asset &&
            total_asset.activeCoinAsset &&
            rates &&
            rates[total_asset.unit]
              ? hidden_balance
                ? "********"
                : helper.digits(total_asset.activeCoinAsset, 2)
              : ""}{" "}
            {total_asset &&
            total_asset.activeCoinAsset &&
            rates[total_asset.unit]
              ? `≈ ${financeRate[0]}${
                  hidden_balance ? "********" : financeRate[1]
                }`
              : ""}
          </p>
        </div>
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
              hasMore={false}
              refresh={hidden_balance}
            />
          )
        ) : (
          ""
        )}
        <div className={classes.flash_trades}>
          <Button variant="contained" color="primary" onClick={goTrade}>
            {intl.formatMessage({ id: "闪电交易" })}
          </Button>
          <p>
            {intl.formatMessage({
              id:
                "温馨提示：获得的出售额度的HBC没有出售完成之前，不能提交下一次减持出售申请",
            })}
          </p>
        </div>
      </div>
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={applyDialog}
        classes={{ paperScrollPaper: classes.apply_paper }}
      >
        <DialogTitle id="customized-dialog-title">
          <p>{intl.formatMessage({ id: "申请流通" })}</p>
          <Iconfont
            type="close"
            size={20}
            onClick={() => {
              setApplyDialog(false);
            }}
          />
        </DialogTitle>
        <DialogContent>
          <div className={classes.reduce_info_bg}>
            <div className={classes.reduce_info}>
              <p>
                {intl.formatMessage({ id: "当日可申请流通" })} {unit}
              </p>
              <h2>{info.total}</h2>
            </div>
          </div>
          <TextField
            placeholder={intl.formatMessage({ id: "输入流通额度" })}
            name="amount"
            autoComplete="off"
            value={amount}
            onChange={handleChange}
            className={classes.reduce_input}
            InputProps={{
              endAdornment: (
                <p>
                  <span>{unit}</span>
                  <span onClick={setTotal}>
                    {intl.formatMessage({ id: "全部" })}
                  </span>
                </p>
              ),
            }}
          />
          <p className={classes.avai}>
            {intl.formatMessage({ id: "可用" })} {info.userTotal} {unit}
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={apply}
            disabled={loading || !amount}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              intl.formatMessage({ id: "确认申请" })
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={submitDialog}
        classes={{ paperScrollPaper: classes.submit_paper }}
      >
        <DialogContent>
          <img src={require("../../assets/apply_success.png")} />
          <p>{intl.formatMessage({ id: "申请成功，请等待结果" })}</p>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setSubmitDialog(false);
            }}
          >
            {intl.formatMessage({ id: "确定" })}
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={resultDialog}
        classes={{
          paperScrollPaper: classes.result_paper,
        }}
      >
        <DialogContent>
          <h3>{intl.formatMessage({ id: "结果公布" })}</h3>
          <div className="info">
            <h2>
              {info.userUnderweight.total}
              {unit}
            </h2>
            <p>{intl.formatMessage({ id: "当日可申请流通" })}</p>
          </div>
          <div className="info">
            <h2>
              {info.userUnderweight.totalReduction}
              {unit}
            </h2>
            <p>{intl.formatMessage({ id: "总申请额度" })}</p>
          </div>
          <div className="info">
            <h2>
              {helper.format(
                math
                  .chain(parseFloat(info.userUnderweight.rate))
                  .multiply(100)
                  .format({ notation: "fixed" })
                  .done(),
                5
              )}
              %
            </h2>
            <p>{intl.formatMessage({ id: "分配率" })}</p>
          </div>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setResultDialog(false);
            }}
          >
            {intl.formatMessage({ id: "确定" })}
          </Button>
        </DialogContent>
      </Dialog>
      <TransferModal
        open={modal}
        source_type={account_activity_index}
        target_type={0}
        onCancel={() => {
          setModal(false);
        }}
        submitCallback={() => {
          getList();
        }}
        token_id={currentToken}
        {...props}
      />
    </div>
  );
};

export default withStyles(styles)(injectIntl(ActivityAccountRC));
