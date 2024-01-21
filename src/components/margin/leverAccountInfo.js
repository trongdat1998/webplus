// 杠杆账户信息
import React, { useState, useEffect } from "react";
import { connect } from "dva";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { FormattedMessage, injectIntl } from "react-intl";
import math from "../../utils/mathjs";

import WSDATA from "../../models/data_source";
import TransferModal from "../public/transfer_modal";
import BorrowCoinModal from "../public/borrow_coin_modal";
// import RepayCoinModal from "../public/repay_coin_modal";
import styles from "./leverAccountInfo.style";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
const COIN = "USDT";
function LeverAccountInfo({ classes, lever, layout, ...props }) {
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [borrowCoinModalOpen, setBorrowCoinModalOpen] = useState(false);
  // const [repayCoinModalOpen, setRepayCoinModalOpen] = useState(false);
  const [safetyAngle, setSafetyAngle] = useState(0);

  const { dispatch } = props;
  // const dispatch = useDispatch();
  // const { openMargin, safety, leverAsset, riskConfig } = useSelector(
  //   (state) => state.lever
  // );
  // const { userinfo, ws } = useSelector((state) => state.layout);

  const { openMargin, safety, leverAsset, riskConfig } = lever;
  const { userinfo, ws } = layout;

  // 开启划转dialog
  function openTransferDialog() {
    if (userinfo.openMargin) {
      setTransferModalOpen(true);
    } else {
      dispatch({
        type: "lever/showLeverProtocol",
      });
    }
  }
  // 关闭划转dialog
  function closeTransferDialog() {
    setTransferModalOpen(false);
  }
  // 开启借币dialog
  function openBorrowDialog() {
    if (userinfo.openMargin) {
      setBorrowCoinModalOpen(true);
    } else {
      dispatch({
        type: "lever/showLeverProtocol",
      });
    }
  }
  // 关闭借币dialog
  function closeBorrowDialog() {
    setBorrowCoinModalOpen(false);
  }

  function goToMarginFinance() {
    window.open(route_map.margin_finance, "_blank");
  }

  // 订阅逻辑
  const [subed, setSubed] = useState(false);
  useEffect(() => {
    function httpAction() {
      dispatch({
        type: "lever/getSafety",
      });
    }
    function callback(safetyData) {
      if (safetyData.data) {
        WSDATA.setData("margin_safety", safetyData.data);
      }
    }
    function reconnect() {}

    let unsub;
    if (props.userinfo.userId && props.userinfo.openMargin && ws && !subed) {
      unsub = ws.sub(
        {
          id: "margin_safety",
          topic: "margin_safety",
          event: "sub",
        },
        httpAction,
        callback,
        reconnect
      );
    }
    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [ws, props.userinfo, subed, dispatch]);

  // 定时任务
  useEffect(() => {
    function interval() {
      dispatch({
        type: "lever/getLeverTotalAsset",
      });
      dispatch({
        type: "lever/getLeverAsset",
      });
      dispatch({
        type: "lever/getSafety",
      });
    }
    let intervalId;
    if (props.userinfo && props.userinfo.userId && props.userinfo.openMargin) {
      intervalId = setInterval(interval, 10000);
    }
    interval();
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [props.userinfo, dispatch]);

  useEffect(() => {
    function calculateRiskAngle() {
      const { withdrawLine, stopLine, warnLine, appendLine } = riskConfig;
      let angle = 0;
      if (safety > withdrawLine || !safety) {
        return 0;
      }
      // 预警 0 ~ 30
      if (safety <= withdrawLine && safety > warnLine) {
        angle = 30 * ((withdrawLine - safety) / (withdrawLine - warnLine));
      }

      // 追加 30 ~ 120
      else if (safety <= warnLine && safety > appendLine) {
        angle = 90 * ((warnLine - safety) / (warnLine - appendLine)) + 30;
      }

      // 止损 120 ~ 180
      else if (safety <= appendLine && safety > stopLine) {
        // 最大 - 最小
        angle = 60 * ((appendLine - safety) / (appendLine - stopLine)) + 120;
      } else if (safety <= stopLine) {
        angle = 180;
      }
      return angle;
    }
    const riskRateAngle = calculateRiskAngle();
    setSafetyAngle(riskRateAngle);
  }, [riskConfig, safety]);

  function renderRiskRateDesc() {
    const { withdrawLine, stopLine, appendLine, warnLine } = riskConfig;
    if (safety) {
      if (safety >= warnLine) {
        return (
          <span>
            {props.intl.formatMessage({
              id: "无风险",
            })}
          </span>
        );
      } else if (safety >= appendLine && safety <= warnLine) {
        return props.intl.formatMessage({
          id: "有风险",
        });
      } else if (safety < appendLine && safety > stopLine) {
        return props.intl.formatMessage({
          id: "高风险",
        });
      }
    }
  }

  return (
    <div className={classes.leverAccountInfo}>
      <div className={classes.header}>
        <div className={classes.left}>
          <FormattedMessage
            id="lever.account"
            className="title"
            tagName="div"
          ></FormattedMessage>
          <span>
            {props.intl.formatMessage({
              id: "lever.fullPosition",
            })}
          </span>
        </div>
        <div className={classes.right}>
          {props.userinfo.userId
            ? safety && safety !== "0"
              ? props.intl.formatMessage(
                  {
                    id: "lever.riskRation",
                  },
                  { riskRation: helper.digits(safety, 2) }
                )
              : "--"
            : null}
        </div>
      </div>
      {props.userinfo.userId ? (
        <div className={classes.content}>
          <div className={classes.accountInfoWrapper}>
            <div className={classes.accountInfo}>
              <div className={classes.accountInfoItem}>
                <label>
                  {props.intl.formatMessage({
                    id: "lever.account.totalAsset",
                  })}
                </label>
                <p>
                  {leverAsset.usdtTotal ? (
                    <>
                      <span>
                        {helper.digits2(
                          math
                            .chain(math.bignumber(leverAsset.usdtTotal))
                            .format({
                              precision: 2,
                              notation: "fixed",
                            })
                            .done(),
                          2
                        ) +
                          " " +
                          COIN}
                      </span>
                      <span style={{ color: "#6e8196", marginLeft: 4 }}>
                        ≈{" "}
                        {helper
                          .currencyValue(
                            props.rates,
                            leverAsset.usdtTotal,
                            COIN,
                            window.localStorage.unit,
                            true
                          )
                          .slice(1)
                          .join(" ")}
                      </span>
                    </>
                  ) : (
                    "--"
                  )}
                </p>
              </div>
              <div className={classes.accountInfoItem}>
                <label>
                  {props.intl.formatMessage({
                    id: "lever.account.cautionMoney",
                  })}
                </label>
                <p>
                  <span>
                    {leverAsset.usdtMarginAmount
                      ? helper.digits2(
                          math
                            .chain(math.bignumber(leverAsset.usdtMarginAmount))
                            .format({
                              precision: 2,
                              notation: "fixed",
                            })
                            .done(),
                          2
                        ) +
                        " " +
                        COIN
                      : "--"}
                  </span>
                </p>
              </div>
              <div className={classes.accountInfoItem}>
                <label>
                  {props.intl.formatMessage({
                    id: "lever.account.usedMargin",
                  })}
                </label>
                <p>
                  <span>
                    {leverAsset.usdtOccupyMargin
                      ? helper.digits2(
                          math
                            .chain(math.bignumber(leverAsset.usdtOccupyMargin))
                            .format({
                              precision: 2,
                              notation: "fixed",
                            })
                            .done(),
                          2
                        ) +
                        " " +
                        COIN
                      : "--"}
                  </span>
                </p>
              </div>
              <div className={classes.accountInfoItem}>
                <label>
                  {props.intl.formatMessage({
                    id: "lever.account.borrowed",
                  })}
                </label>
                <p>
                  <span>
                    {leverAsset.usdtLoanAmount
                      ? helper.format(
                          math
                            .chain(math.bignumber(leverAsset.usdtLoanAmount))
                            .format({
                              notation: "fixed",
                              precision: 2,
                            })
                            .done(),
                          2
                        ) +
                        " " +
                        COIN
                      : "--"}
                  </span>
                </p>
              </div>
            </div>
            <div className={classes.dashboard}>
              <div className={classes.dashboardBg}>
                <em
                  className={classes.dashboardPointer}
                  style={{ transform: "rotate(" + safetyAngle + "deg)" }}
                ></em>
              </div>
              <p className={classes.riskRate}>{renderRiskRateDesc()}</p>
            </div>
          </div>
          <div className={classes.operation}>
            <Button color="primary" onClick={openTransferDialog}>
              {props.intl.formatMessage({
                id: "lever.transfer",
              })}
            </Button>
            <Button color="primary" onClick={openBorrowDialog}>
              {props.intl.formatMessage({
                id: "lever.borrow",
              })}
            </Button>
            <Button color="primary" onClick={goToMarginFinance}>
              {props.intl.formatMessage({
                id: "还币",
              })}
            </Button>
          </div>
        </div>
      ) : (
        <div className={classnames(classes.content, classes.empty)}>
          <img
            src={require("../../assets/lever_dashboard_nologin.png")}
            alt=""
          />
          <div className={classes.btn}>
            <a
              href={
                route_map.login +
                "?redirect=" +
                encodeURIComponent(window.location.href)
              }
            >
              {props.intl.formatMessage({
                id: "登录",
              })}
            </a>{" "}
            {props.intl.formatMessage({
              id: "或",
            })}{" "}
            <a
              href={
                route_map.register +
                "?redirect=" +
                encodeURIComponent(window.location.href)
              }
            >
              {props.intl.formatMessage({
                id: "注册",
              })}
            </a>
          </div>
        </div>
      )}
      {props.userinfo.userId ? (
        <TransferModal
          open={transferModalOpen}
          source_type={props.account_coin_index}
          target_type={props.account_lever_index}
          source_readonly
          target_readonly
          onCancel={closeTransferDialog}
          token_id={props.token1}
          {...props}
          availWithdrawAmount={layout.availWithdrawAmount}
        />
      ) : null}
      {props.userinfo.userId && openMargin ? (
        <BorrowCoinModal
          open={borrowCoinModalOpen}
          onClose={closeBorrowDialog}
          token={props.match.params.token2}
        />
      ) : null}
    </div>
  );
}

const mapState = (state) => {
  return {
    lever: state.lever,
    layout: state.layout,
  };
};

export default withStyles(styles)(
  injectIntl(connect(mapState)(LeverAccountInfo))
);
