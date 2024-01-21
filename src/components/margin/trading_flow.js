// 杠杆交易流程导航
import React, { useState } from "react";
import {
  connect,
  // useDispatch
} from "dva";

import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";

import styles from "./trading_flow.style";

import TransferModal from "../public/transfer_modal";
import BorrowCoinModal from "../public/borrow_coin_modal";
import RepayCoinModal from "../public/repay_coin_modal";
import route_map from "../../config/route_map";

function TradingFlow({ classes, intl, lever, layout, ...otherProps }) {
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [borrowCoinModalOpen, setBorrowCoinModalOpen] = useState(false);
  const [repayCoinModalOpen, setRepayCoinModalOpen] = useState(false);

  // const dispatch = useDispatch();
  const { dispatch } = otherProps;
  const { userinfo } = layout;
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
  // 开启还币dialog
  function openRepayDialog() {
    setRepayCoinModalOpen(true);
  }
  // 关闭还币dialog
  function closeRepayDialog() {
    setBorrowCoinModalOpen(false);
  }
  return (
    <div className={classes.tradingFlow}>
      <label>
        {intl.formatMessage({
          id: "lever.tradingFlow",
        })}
        :
      </label>
      <div className={classes.leverSteps}>
        <div className={classes.leverStepItem}>
          <em>1</em>
          <a onClick={openTransferDialog}>
            {intl.formatMessage({
              id: "lever.step.assetTransfer",
            })}
          </a>
        </div>
        <div className={classes.leverStepSplit}>&gt;</div>
        <div className={classes.leverStepItem}>
          <em>2</em>
          <a onClick={openBorrowDialog}>
            {intl.formatMessage({
              id: "lever.step.applyBorrow",
            })}
          </a>
        </div>
        <div className={classes.leverStepSplit}>&gt;</div>
        <div className={classes.leverStepItem}>
          <em>3</em>
          <a>
            {intl.formatMessage({
              id: "lever.step.leverTrade",
            })}
          </a>
        </div>
        <div className={classes.leverStepSplit}>&gt;</div>
        <div className={classes.leverStepItem}>
          <em>4</em>
          <a href={route_map.margin_finance}>
            {intl.formatMessage({
              id: "lever.step.repayment",
            })}
          </a>
        </div>
      </div>
      {userinfo.userId ? (
        <TransferModal
          open={transferModalOpen}
          source_type={layout.account_coin_index}
          target_type={layout.account_lever_index}
          source_readonly
          target_readonly
          onCancel={closeTransferDialog}
          {...lever}
          {...layout}
          {...otherProps}
          dispatch={dispatch}
        />
      ) : null}
      <BorrowCoinModal
        open={borrowCoinModalOpen}
        onClose={closeBorrowDialog}
        token={lever.token2}
      />
      <RepayCoinModal open={repayCoinModalOpen} onClose={closeRepayDialog} />
    </div>
  );
}

function mapStateToProps({ layout, lever }) {
  return { layout, lever };
}

export default withStyles(styles)(
  connect(mapStateToProps)(injectIntl(TradingFlow))
);
