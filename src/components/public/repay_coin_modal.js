// 杠杆还币modal
import React, { useCallback, useState, useEffect } from "react";
import { connect } from "dva";
import moment from "moment";
import classnames from "classnames";
// import { useSelector, useDispatch } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  OutlinedInput,
  Tooltip,
  Slider,
} from "@material-ui/core";

import TooltipCommon from "./tooltip";
import { message, Iconfont } from "../../lib";
import helper from "../../utils/helper";
import math from "../../utils/mathjs";
import CONSTS from "../../config/const";
import styles from "./repay_coin_modal.style";
const marks = [
  {
    value: 0,
  },
  {
    value: 25,
  },
  {
    value: 50,
  },
  {
    value: 75,
  },
  {
    value: 100,
  },
];

function RepayCoinModal({ classes, dispatch, lever, ...props }) {
  // 查询借币情况
  function useGetLoanSituation(lendOrder) {
    // const dispatch = useDispatch();
    const [loanSituation, setLoanSituation] = useState(lendOrder || {});
    useEffect(() => {
      // 查询还币情况
      const getLoanOrderDetail = async function (loan_id) {
        const result = await dispatch({
          type: "lever/getLoanOrderDetail",
          payload: {
            loan_id,
          },
        });
        setLoanSituation(result && result.length ? result[0] : {});
      };
      const getLeverAsset = async function () {
        dispatch({
          type: "lever/getLeverAsset",
          payload: {},
        });
      };
      if (lendOrder && lendOrder.loanOrderId) {
        getLoanOrderDetail(lendOrder.loanOrderId);
      }
      getLeverAsset();
    }, [lendOrder]);
    return { loanSituation };
  }
  // const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(props.open);
  // const { lever_balances, borrowableTokens } = useSelector(
  //   (state) => state.lever
  // );
  const { lever_balances, borrowableTokens } = lever;
  // 还币币种
  const [tokenId, setTokenId] = useState(props.tokenId);
  const [quantity, setQuantity] = useState("");
  const [repayProgress, setRepayProgress] = useState(0);

  useEffect(() => {
    setOpenDialog(props.open);
  }, [props.open]);

  // 设置杠杆融币币对配置
  const [tokenConfig, setTokenConfig] = useState({});
  useEffect(() => {
    setTokenId(props.tokenId);
    borrowableTokens.forEach((item) => {
      if (item.tokenId == props.tokenId) {
        setTokenConfig(item);
      }
    });
  }, [borrowableTokens, props.tokenId]);

  const { loanSituation } = useGetLoanSituation(props.lendOrder);

  // 可用
  const [accountAsset, setAccountAsset] = useState({});
  useEffect(() => {
    if (lever_balances && tokenId) {
      const assets = {};
      lever_balances.forEach((item) => {
        assets[item.tokenId] = item;
      });
      setAccountAsset(assets[tokenId]);
    }
  }, [lever_balances, tokenId]);

  // 改变还币数量
  function handleQtyChange(e, val) {
    let qty = e.target.value;
    setQuantity(qty);
    if (!loanSituation || !accountAsset) {
      return;
    }
    const unpaid =
      Number(loanSituation.unpaidAmount) + Number(loanSituation.interestUnpaid);
    const free = Number(accountAsset.free);
    // 基数
    let baseValue = unpaid > free ? free : unpaid;
    // 还本金
    if (repayWay == CONSTS.REPAY_WAY.PRINCIPAL) {
      baseValue -= Number(loanSituation.interestUnpaid);
    }
    if (qty && !isNaN(qty)) {
      const sliderValue = helper.digits(
        math
          .chain(math.bignumber(qty))
          .divide(math.bignumber(baseValue))
          .multiply(100)
          .format({ notation: "fixed" })
          .done(),
        2
      );
      setRepayProgress(sliderValue);
    } else {
      setRepayProgress(0);
    }
  }

  function valueLabelFormat(number) {
    return `${number.toFixed(0)}%`;
  }
  function hideDialog() {
    setOpenDialog(false);
    setTokenId("");
    setTokenConfig({});
    setQuantity("");
    setRepayProgress(0);
    props.onClose && props.onClose();
  }

  // 处理slider变化
  function handleProgressChange(event, sliderValue) {
    setRepayProgress(sliderValue);
    if (!loanSituation || !accountAsset) {
      return;
    }
    const unpaid =
      Number(loanSituation.unpaidAmount) + Number(loanSituation.interestUnpaid);
    const free = Number(accountAsset.free);
    // 基数
    let baseValue = unpaid > free ? free : unpaid;
    if (repayWay == CONSTS.REPAY_WAY.PRINCIPAL) {
      baseValue -= Number(loanSituation.interestUnpaid);
    }
    const quantity = sliderValue
      ? helper.digits(
          math
            .chain(math.bignumber(sliderValue))
            .divide(100)
            .multiply(math.bignumber(baseValue))
            .format({ notation: "fixed" })
            .done(),
          8
        )
      : "";
    setQuantity(quantity);
  }

  function confirmRepay() {
    const { repayMinQuantity } = tokenConfig;
    if (!tokenId) {
      message.error(
        props.intl.formatMessage({
          id: "lever.error.emptyTokenId",
        })
      );
      return;
    }
    if (!quantity || isNaN(quantity)) {
      // 不存在, 小于最小借币数量, 大于最大借币数量 拒绝交易
      message.error(
        props.intl.formatMessage({
          id: "数量错误，请重新输入",
        })
      );
      return;
    }
    const unpaid =
      Number(loanSituation.unpaidAmount) + Number(loanSituation.interestUnpaid);
    // 如果未还数量小于最小还币，可以校验通过
    if (
      Number(quantity) < Number(repayMinQuantity) &&
      unpaid > Number(repayMinQuantity)
    ) {
      // 不存在, 小于最小借币数量, 大于最大借币数量 拒绝交易
      message.error(
        props.intl.formatMessage(
          {
            id: "lever.error.lessThanMinRepayQty",
          },
          {
            repayMinQuantity,
          }
        )
      );
      return;
    }
    if (quantity - accountAsset.free > 0.0001) {
      // 大于可用数量 拒绝交易
      message.error(
        props.intl.formatMessage({
          id: "可用数量不足",
        })
      );
      return;
    }

    const { loanOrderId } = props.lendOrder;

    const payload = {
      client_order_id: new Date().getTime(),
      loan_order_id: loanOrderId,
      repay_amount: quantity,
      repay_type: repayWay,
      repay_all:
        repayProgress == 100 &&
        Number(accountAsset.free) >= Number(loanSituation.unpaidAmount),
    };
    dispatch({
      type: "lever/repay",
      payload,
    }).then((ret) => {
      props.onSuccess && props.onSuccess();
      hideDialog();
    });
  }

  const [repayWay, setRepayWay] = useState(CONSTS.REPAY_WAY.ALL);

  const handleChangeRepayWay = (e) => {
    setRepayWay(e.target.value);
    const unpaid =
      Number(loanSituation.unpaidAmount) + Number(loanSituation.interestUnpaid);
    const free = Number(accountAsset.free);
    // 基数
    let baseValue = unpaid > free ? free : unpaid;
    if (e.target.value == 1) {
      // 还本金的, 减去利息
      baseValue -= Number(loanSituation.interestUnpaid);
    }
    const quantity = repayProgress
      ? helper.digits2(
          math
            .chain(math.bignumber(repayProgress))
            .divide(100)
            .multiply(math.bignumber(baseValue))
            .format({ notation: "fixed" })
            .done(),
          8
        )
      : "";
    setQuantity(quantity);
  };

  // 总应还
  const totalPay = math
    .chain(math.bignumber(loanSituation.unpaidAmount || 0))
    .add(math.bignumber(loanSituation.interestUnpaid || 0))
    .format({
      notation: "fixed",
    })
    .done();

  // 实际归还
  const actualPay =
    repayWay == CONSTS.REPAY_WAY.ALL
      ? isNaN(quantity)
        ? 0
        : quantity
      : math
          .chain(math.bignumber(quantity || 0))
          .add(math.bignumber(loanSituation.interestUnpaid || 0))
          .format({
            notation: "fixed",
          })
          .done();

  const stopBodyScroll = useCallback(() => {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "5px";
  }, []);

  const enableBodyScroll = useCallback(() => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }, []);

  return (
    <Dialog
      open={Boolean(openDialog)}
      onClose={hideDialog}
      maxWidth="lg"
      disableBackdropClick
      disableScrollLock
      disableEscapeKeyDown
      onEnter={stopBodyScroll}
      onExited={enableBodyScroll}
    >
      <DialogTitle>
        {props.intl.formatMessage({ id: "lever.repayment" })}
      </DialogTitle>
      <DialogContent>
        <div className={classes.content}>
          <div className="item">
            <label>{props.intl.formatMessage({ id: "币种" })}</label>
            <Select
              value={tokenId}
              variant="outlined"
              disabled
              className={classes.select}
              classes={{ icon: classes.icon }}
            >
              {borrowableTokens && borrowableTokens.length
                ? borrowableTokens.map((item, index) => {
                    return (
                      <MenuItem
                        value={item.tokenId}
                        key={item.tokenId}
                        className={classes.menuItem}
                      >
                        {item.tokenId}
                      </MenuItem>
                    );
                  })
                : ""}
            </Select>
          </div>
          <div className={classes.repayInstructions}>
            <div className="item">
              <label>
                {/* 未还数量 */}
                {props.intl.formatMessage({ id: "lever.repayment.borrowed" })}
              </label>
              <span>{helper.digits2(loanSituation.unpaidAmount, 8)}</span>
            </div>
            <div className="item">
              {/* 未还利息 */}
              <Tooltip
                title={props.intl.formatMessage({
                  id: "repay.tooltip.interestUnpaid",
                })}
                placement="bottom-start"
                arrow
              >
                <label>
                  {props.intl.formatMessage({ id: "lever.repayment.interest" })}
                  <Iconfont type="info_line" size="24"></Iconfont>
                </label>
              </Tooltip>
              {/* 向上进1 */}
              <span>{helper.digits2(loanSituation.interestUnpaid, 8)}</span>
            </div>
            {/* 总应还 */}
            <div className="item">
              <label>
                {props.intl.formatMessage({ id: "lever.repayment.totalRepay" })}
              </label>
              <span>{helper.digits2(totalPay, 8)}</span>
            </div>
          </div>
          <div className="item">
            <label>
              {props.intl.formatMessage({ id: "lever.repayment.way" })}
            </label>
            <div className={classes.repayWrapper}>
              <Select
                value={repayWay}
                onChange={handleChangeRepayWay}
                variant="outlined"
                className={classnames([classes.select, classes.repayWay])}
                classes={{ icon: classes.icon }}
              >
                <MenuItem
                  value={CONSTS.REPAY_WAY.PRINCIPAL}
                  className={classes.menuItem}
                >
                  {props.intl.formatMessage({ id: "lever.repayment.way.1" })}
                </MenuItem>
                <MenuItem
                  value={CONSTS.REPAY_WAY.ALL}
                  className={classes.menuItem}
                >
                  {props.intl.formatMessage({ id: "lever.repayment.way.2" })}
                </MenuItem>
              </Select>
              <OutlinedInput
                value={quantity}
                className={classes.input}
                onChange={handleQtyChange}
                placeholder={props.intl.formatMessage(
                  {
                    id: "lever.repayment.placeholder",
                  },
                  {
                    amount: tokenConfig && tokenConfig.repayMinQuantity,
                  }
                )}
                name="quantity"
                autoComplete="off"
                endAdornment={
                  <span className={classes.endAdorn}>{tokenId}</span>
                }
              />
            </div>

            <div className={classes.float}>
              {props.intl.formatMessage({ id: "可用" })}
              {helper.digits(accountAsset && accountAsset.free, 8)}
              {tokenId}
            </div>
          </div>

          <div className={classes.progress}>
            <Slider
              step={1}
              marks={marks}
              value={repayProgress}
              valueLabelFormat={valueLabelFormat}
              onChange={handleProgressChange}
              valueLabelDisplay="auto"
              aria-labelledby="borrow_progress"
              ValueLabelComponent={TooltipCommon}
            />
          </div>

          <div className={classes.tip}>
            <Tooltip
              title={props.intl.formatMessage({
                id: "repay.tooltip",
              })}
              placement="bottom-start"
              arrow
            >
              <span>
                <Iconfont type="info_line" size="24"></Iconfont>
              </span>
            </Tooltip>
            {props.intl.formatMessage({ id: "lever.repayment.tips" })} ≈
            {helper.digits2(actualPay, 8)}
            {tokenId}
          </div>
          <div className={classes.totalInstruction}>
            <div className="row">
              <div className="item">
                <label>
                  {props.intl.formatMessage({ id: "lever.borrow.qty" })}
                </label>
                <span>{helper.digits2(loanSituation.loanAmount, 8)}</span>
              </div>
              <div className="item">
                <label>
                  {props.intl.formatMessage({ id: "lever.totalInterest" })}
                </label>
                <span>
                  {/* 产生币息 */}
                  {helper.digits2(
                    Number(loanSituation.interestPaid) +
                      Number(loanSituation.interestUnpaid),
                    8
                  )}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="item">
                <label>
                  {props.intl.formatMessage({ id: "lever.borrowTime" })}
                </label>
                <span>
                  {moment
                    .utc(Number(loanSituation.createdAt))
                    .local()
                    .format("MM/DD HH:mm:ss")}
                </span>
              </div>
              <div className="item">
                <label>
                  {props.intl.formatMessage({ id: "lever.interestTime" })}
                </label>
                <span>
                  {moment
                    .utc(Number(loanSituation.interestStart))
                    .local()
                    .format("MM/DD HH:mm:ss")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideDialog} color="primary">
          {props.intl.formatMessage({ id: "取消" })}
        </Button>
        <Button onClick={confirmRepay} color="primary" autoFocus>
          {props.intl.formatMessage({ id: "确定" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
const mapStateToProps = (state) => {
  return {
    lever: state.lever,
  };
};

export default withStyles(styles)(
  injectIntl(connect(mapStateToProps)(RepayCoinModal))
);
