// 杠杆借币modal
import React, { useState, useCallback, useEffect } from "react";
import {
  connect,
  // useSelector, useDispatch
} from "dva";
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
  Slider,
} from "@material-ui/core";

import { message } from "../../lib";
import math from "../../utils/mathjs";
import CONST from "../../config/const";
import TooltipCommon from "../public/tooltip";
import { Iconfont } from "../../lib";
import styles from "./borrow_coin_modal.style";
import helper from "../../utils/helper";
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

function useGetTokenInterest(token, dispatch) {
  // const dispatch = useDispatch();
  const [interest, setInterest] = useState({});
  const [loanSituation, setLoanSituation] = useState({});
  useEffect(() => {
    // 查询借币利率
    const queryTokenInterestConfig = async function (token_id) {
      const result = await dispatch({
        type: "lever/queryTokenInterest",
        payload: {
          token_id,
        },
      });

      setInterest(result || {});
      // setInterest(result && result.length ? result[0] : {});
    };
    // 查询借币情况
    const queryLoanSituation = async function (token_id) {
      const result = await dispatch({
        type: "lever/queryLoanSituation",
        payload: {
          token_id,
        },
      });
      setLoanSituation(result && result.length ? result[0] : {});
    };
    if (token) {
      queryTokenInterestConfig(token);
      queryLoanSituation(token);
    } else {
      setLoanSituation({});
      setInterest({});
    }
  }, [dispatch, token]);
  return { interest, loanSituation };
}

function LeverModal({ classes, dispatch, lever, ...props }) {
  // const dispatch = useDispatch();
  // const { borrowableTokens } = useSelector((state) => state.lever);
  const { borrowableTokens } = lever;
  const [openDialog, setOpenDialog] = useState(props.open);

  const hideDialog = function () {
    setTokenId("");
    setBorrowProgress(0);
    setQuantity("");
    setOpenDialog(false);
    props.onClose && props.onClose();
  };
  const [tokenId, setTokenId] = useState("");
  const [tokenConfig, setTokenConfig] = useState({});
  const [quantity, setQuantity] = useState("");
  const [borrowProgress, setBorrowProgress] = useState(0);

  useEffect(() => {
    let defaultToken = props.token
      ? props.token
      : borrowableTokens && borrowableTokens[0]
      ? borrowableTokens[0].tokenId
      : "";
    const getTokenConfig = (tokenId) => {
      let result;
      borrowableTokens.forEach((item) => {
        if (item.tokenId == tokenId) {
          result = item;
          return;
        }
      });
      if (!result) {
        result = borrowableTokens[0] || {};
      }
      return result;
    };
    setOpenDialog(props.open);
    const tokenConfig = getTokenConfig(defaultToken);
    setTokenId(tokenConfig.tokenId);
    setTokenConfig(tokenConfig);
  }, [props.open, props.token, borrowableTokens]);

  const { interest, loanSituation } = useGetTokenInterest(tokenId, dispatch);

  // 切换币种
  function handleChangeToken(e, val) {
    setTokenId(e.target.value);
    const tokenConfig = borrowableTokens[val.key];
    setTokenConfig(tokenConfig);
  }
  // 改变借币数量
  function handleQtyChange(e) {
    let qty = e.target.value;
    setQuantity(qty);
    if (!loanSituation || !loanSituation.loanable) {
      return;
    }
    if (qty && Number.isFinite(Number(qty))) {
      const sliderValue = math
        .chain(math.bignumber(qty))
        .divide(math.bignumber(loanSituation.loanable))
        .multiply(100)
        .format({ notation: "fixed", precision: 2 })
        .done();
      setBorrowProgress(Number(sliderValue));
    } else {
      setBorrowProgress(0);
    }
  }
  function valueLabelFormat(number) {
    return `${number.toFixed(0)}%`;
  }

  // 处理slider变化
  function handleProgressChange(event, sliderValue) {
    setBorrowProgress(sliderValue);
    if (!loanSituation || !loanSituation.loanable) {
      return;
    }
    const quantity = sliderValue
      ? helper.digits(
          math
            .chain(math.bignumber(sliderValue))
            .divide(100)
            .multiply(math.bignumber(loanSituation.loanable))
            .format({ notation: "fixed" })
            .done(),
          tokenConfig.quantityPrecision
        )
      : "";
    setQuantity(quantity);
  }

  // 确认借币
  function confirmBorrow() {
    const { maxQuantity, minQuantity, quantityPrecision } = tokenConfig;
    if (!tokenId) {
      message.error(
        props.intl.formatMessage({
          id: "lever.error.emptyTokenId",
        })
      );
      return;
    }

    if (!quantity || isNaN(quantity)) {
      message.error(
        props.intl.formatMessage({
          id: "数量错误，请重新输入",
        })
      );
      return;
    }

    if (quantity < Number(minQuantity) || quantity > Number(maxQuantity)) {
      // 不存在, 小于最小借币数量, 大于最大借币数量 拒绝交易
      message.error(
        props.intl.formatMessage(
          {
            id: "lever.error.lessOrMore",
          },
          {
            minQuantity,
            maxQuantity,
          }
        )
      );
      return;
    }

    if (quantity > Number(loanSituation.loanable)) {
      // 大于可借
      message.error(
        props.intl.formatMessage(
          {
            id: "lever.error.exceedLoanable",
          },
          {
            minQuantity,
            maxQuantity,
          }
        )
      );
      return;
    }

    const payload = {
      client_order_id: new Date().getTime(),
      token_id: tokenId,
      loan_amount: quantity,
    };

    dispatch({
      type: "lever/loan",
      payload,
    }).then((ret) => {
      props.onSuccess && props.onSuccess(tokenId);
      hideDialog();
    });
  }

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
      onClose={props.onClose}
      maxWidth="lg"
      disableBackdropClick
      disableScrollLock
      disableEscapeKeyDown
      onEnter={stopBodyScroll}
      onExited={enableBodyScroll}
    >
      <DialogTitle>
        {props.intl.formatMessage({ id: "lever.borrow" })}
      </DialogTitle>
      <DialogContent>
        <div className={classes.content}>
          <div className="item">
            <label>{props.intl.formatMessage({ id: "币种" })}</label>
            <Select
              value={tokenId}
              variant="outlined"
              onChange={handleChangeToken}
              className={classes.select}
              classes={{ icon: classes.icon }}
            >
              {borrowableTokens && borrowableTokens.length
                ? borrowableTokens.map((item, index) => {
                    return (
                      <MenuItem
                        value={item.tokenId}
                        key={index}
                        className={classes.menuItem}
                      >
                        {item.tokenId}{" "}
                        <span className={classes.leverage}>
                          {item.leverage}x
                        </span>
                      </MenuItem>
                    );
                  })
                : ""}
            </Select>
          </div>
          <div className={classes.borrowInstructions}>
            <div className="item">
              <label>
                {props.intl.formatMessage({ id: "lever.borrow.borrowed" })}
              </label>
              <span>
                {helper.digits(
                  loanSituation.borrowed,
                  tokenConfig.quantityPrecision || 8
                )}
              </span>
            </div>
            <div className="item">
              <label>
                {props.intl.formatMessage({ id: "lever.borrow.borrowable" })}
              </label>
              <span>
                {helper.digits(
                  loanSituation.loanable,
                  tokenConfig.quantityPrecision || 8
                )}
              </span>
            </div>
            <div className="item">
              <label>
                {props.intl.formatMessage({ id: "lever.borrow.dailyRate" })}
              </label>
              <span>
                {interest.interest
                  ? Number(interest.interest) < 0
                    ? "0%"
                    : math
                        .chain(math.bignumber(interest.interest))
                        .multiply(86400)
                        .divide(interest.interestPeriod)
                        .multiply(100)
                        .format({
                          notation: "fixed",
                          precision: 4,
                        }) + "%"
                  : "--"}
              </span>
            </div>
          </div>
          <div className="item">
            <label>
              {props.intl.formatMessage({ id: "lever.borrow.qty" })}
            </label>
            <OutlinedInput
              value={quantity}
              className={classes.input}
              onChange={handleQtyChange}
              name="quantity"
              autoComplete="off"
              endAdornment={<span className={classes.endAdorn}>{tokenId}</span>}
            />
          </div>
          <div className={classes.progress}>
            <Slider
              step={1}
              marks={marks}
              value={borrowProgress}
              valueLabelFormat={valueLabelFormat}
              onChange={handleProgressChange}
              valueLabelDisplay="auto"
              aria-labelledby="borrow_progress"
              ValueLabelComponent={TooltipCommon}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideDialog} color="primary">
          {props.intl.formatMessage({ id: "取消" })}
        </Button>
        <Button onClick={confirmBorrow} color="primary" autoFocus>
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
  injectIntl(connect(mapStateToProps)(LeverModal))
);
