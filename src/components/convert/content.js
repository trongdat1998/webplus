import React, { useState, useEffect, useCallback } from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { connect } from "dva";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import ArrowDownIcon from "@material-ui/icons/ArrowDownwardOutlined";
import { withStyles } from "@material-ui/core/styles";

import WSDATA from "../../models/data_source";
import TokenSelect from "./TokenSelect";
import TooltipCommon from "../public/tooltip";
import { Iconfont } from "../../lib";
import route_map from "../../config/route_map.js";
import useInterval from "../../utils/useInterval";
import math from "../../utils/mathjs";
import styles from "./content.style.js";
import CONSTS from "../../config/const";
import helper from "../../utils/helper";

function ConvertContent(props) {
  const { classes, dispatch, layout, convert, loading } = props;

  const [countDown, setCountDown] = useState(60); // 倒计时时间
  const [start, setStart] = useState(false); // 开始倒计时

  const [symbol, setSymbol] = useState({}); // 币对

  const [symbolPrice, setSymbolPrice] = useState({}); // 币对价格

  const [baseToken, setBaseToken] = useState({}); // 兑换币种
  const [offeringsTokenList, setOfferingsTokenList] = useState(
    convert.offeringsTokenList
  );
  const [quoteToken, setQuoteToken] = useState({}); // 申购计价币种
  const [purchaseTokenList, setPurchaseTokenList] = useState(
    convert.purchaseTokenList
  );

  useEffect(() => {
    setOfferingsTokenList(convert.offeringsTokenList);
    setPurchaseTokenList(convert.purchaseTokenList);
    if (!quoteToken.tokenId && convert.purchaseTokenList.length) {
      setQuoteToken(convert.purchaseTokenList[0]);
    }
    // if (!baseToken.tokenId && convert.offeringsTokenList.length) {
    //   setBaseToken(convert.offeringsTokenList[0]);
    // }
  }, [
    convert.offeringsTokenList,
    convert.purchaseTokenList,
    quoteToken.tokenId,
  ]);

  // 切换基础币种后的逻辑
  // useEffect(() => {
  //   if (baseToken.tokenId) {
  //     let quoteTokenList = convert.offeringsTokenMap[baseToken.tokenId];
  //     setPurchaseTokenList(quoteTokenList);
  //     setQuoteToken(quoteTokenList[0] || {});
  //   }
  // }, [baseToken, convert.offeringsTokenMap]);

  // 切换计价币种后的逻辑
  useEffect(() => {
    if (quoteToken.tokenId) {
      let tokenList = convert.purchaseTokenMap[quoteToken.tokenId];
      // 更新兑换币种列表
      setOfferingsTokenList(tokenList);
      setBaseToken(tokenList[0] || {});
    }
  }, [convert.purchaseTokenMap, quoteToken.tokenId]);

  // 获取资产
  useEffect(() => {
    if (quoteToken.tokenId) {
      dispatch({
        type: "convert/getAvailable",
        payload: {
          token_id: quoteToken.tokenId,
        },
      });
    }
  }, [dispatch, quoteToken]);

  useEffect(() => {
    const ws = layout.ws;
    if (ws) {
      ws.sub(
        {
          id: "balance",
          topic: "balance",
          event: "sub",
        },
        () => {
          dispatch({
            type: "convert/getAvailable",
            payload: {},
          });
        },
        (dataInfo) => {
          if (dataInfo && dataInfo.data) {
            dispatch({
              type: "convert/updateAvailable",
              payload: {
                changed: dataInfo.data,
              },
            });
          }
        }
      );
    }
    return () => {
      ws && ws.cancel("balance");
    };
  }, [dispatch, layout.ws]);

  useEffect(() => {
    if (quoteToken.tokenId && baseToken.tokenId) {
      let symbol =
        convert.symbolMap[`${baseToken.tokenId}${quoteToken.tokenId}`];
      setSymbol(symbol || {});
      setError({ showError: false });
    }
  }, [baseToken, convert.symbolMap, quoteToken]);

  // 获取价格
  const queryPrice = useCallback(() => {
    dispatch({
      type: "convert/getSymbolPrice",
      payload: {
        convert_symbol_id: symbol.convertSymbolId,
      },
      callback: (obj) => {
        setSymbolPrice(obj);
        if (obj.priceType == CONSTS.CONVERT.PRICE_TYPE.FLOAT) {
          setStart(true);
          setCountDown(Number(obj.time));
        }
      },
      errorCallback: (ret) => {
        setSymbolPrice({});
      },
    });
  }, [dispatch, symbol.convertSymbolId]);

  useEffect(() => {
    if (symbol.convertSymbolId) {
      queryPrice();
    }
  }, [queryPrice, symbol.convertSymbolId]);

  useInterval(
    () => {
      setCountDown((count) => count - 1);
      if (countDown <= 1) {
        queryPrice();
        setStart(false);
      }
    },
    start,
    1000
  );

  const [baseQty, setBaseQty] = useState("");
  const [quoteQty, setQuoteQty] = useState("");
  // 以这个为基准
  const [standard, setStandard] = useState("");
  const handleBaseQtyInputChange = (e) => {
    let inputStr = e.target.value;
    if (!inputStr) {
      setBaseQty("");
      setQuoteQty("");
    } else {
      if (isNaN(inputStr)) {
        return;
      }
      // 限制数量精度
      const { offeringsPrecision } = symbol;
      inputStr = helper.fixDigits(inputStr, offeringsPrecision);
      setBaseQty(inputStr);
      setStandard("baseQty");
    }
  };

  const handleQuoteQtyInputChange = (e) => {
    let inputStr = e.target.value;
    if (!inputStr) {
      setQuoteQty("");
      setBaseQty("");
    } else {
      if (isNaN(inputStr)) {
        return;
      }
      // 限制数量精度
      const { purchasePrecision } = symbol;
      inputStr = helper.fixDigits(inputStr, purchasePrecision);
      setQuoteQty(inputStr);
      setStandard("quoteQty");
    }
  };

  // 价格变化了，需要重新计算数量
  useEffect(() => {
    if (standard == "quoteQty" && quoteQty && symbolPrice.price) {
      // 如果是输入了价格，需要截位去计算兑换数量
      let baseQtyStr = helper.digits(
        math
          .chain(math.bignumber(quoteQty))
          .divide(math.bignumber(symbolPrice.price))
          .format({
            notation: "fixed",
          })
          .done(),
        symbol.offeringsPrecision
      );
      setBaseQty(baseQtyStr);
    } else if (standard == "baseQty" && baseQty && symbolPrice.price) {
      // 如果是输入了兑换数量，我得进一位去计算价格
      let quoteQtyStr = helper.digits2(
        math
          .chain(math.bignumber(baseQty))
          .multiply(math.bignumber(symbolPrice.price))
          .format({
            notation: "fixed",
          })
          .done(),
        symbol.purchasePrecision
      );
      setQuoteQty(quoteQtyStr);
    }
  }, [
    symbolPrice.price,
    baseQty,
    quoteQty,
    standard,
    symbol.offeringsPrecision,
    symbol.purchasePrecision,
  ]);

  // 处理兑换
  const [error, setError] = useState({
    showError: false,
    errorMsg: "",
  });

  const handleConvert = () => {
    const { available } = convert;
    if (Number(available) < Number(quoteQty)) {
      setError({
        showError: true,
        errorMsg: props.intl.formatMessage({
          id: "已超出您的可用余额范围",
        }),
      });
      return;
    }
    if (Number(baseQty) > Number(symbol.maxQuantity)) {
      setError({
        showError: true,
        errorMsg: props.intl.formatMessage(
          {
            id: "more.than.max",
          },
          { s: `${symbol.maxQuantity} ${symbol.offeringsTokenName}` }
        ),
      });
      return;
    }

    if (Number(baseQty) < Number(symbol.minQuantity)) {
      setError({
        showError: true,
        errorMsg: props.intl.formatMessage(
          {
            id: "less.than.min",
          },
          { s: `${symbol.minQuantity} ${symbol.offeringsTokenName}` }
        ),
      });
      return;
    }
    setError({
      showError: false,
    });
    setShowConfirmDialog(true);
  };

  // 登录
  const goLogin = () => {
    window.location.href =
      route_map.login + "?redirect=" + encodeURIComponent(window.location.href);
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const onCloseConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  const onConfirmCreateOrder = () => {
    dispatch({
      type: "convert/createConvertOrder",
      payload: {
        convert_symbol_id: symbol.convertSymbolId,
        client_order_id: Date.now(),
        purchase_quantity: quoteQty,
        offerings_quantity: baseQty, // 发售币数量
        price: symbolPrice.price,
        order_token_id:
          standard == "quoteToken" ? quoteToken.tokenId : baseToken.tokenId,
      },
    }).then(() => {
      setShowConfirmDialog(false);
      setBaseQty("");
      setQuoteQty("");
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.convertHead}>
        <div className={classes.convertHead_left}>
          <TooltipCommon
            title={props.intl.formatMessage({
              id: "报价实时更新中",
            })}
            placement="bottom"
          >
            <div className={classes.breathingLamp}>
              <div className={classes.breathingLamp_bg}></div>
              <div className={classes.breathingLamp_inner}></div>
            </div>
          </TooltipCommon>
          <label>
            {props.intl.formatMessage({
              id: "参考单价",
            })}
            ：
          </label>
          {loading.effects["convert/getSymbolPrice"] ? (
            <CircularProgress size={12} style={{ color: "#fff" }} />
          ) : (
            <span>
              {baseToken.tokenId && quoteToken.tokenId && symbolPrice.price
                ? `1 ${baseToken.tokenName} = ${symbolPrice.price} ${quoteToken.tokenName}`
                : " -- "}
            </span>
          )}
        </div>
        <Link
          className={classes.convertHead_btn}
          to={layout.userinfo.userId ? route_map.convert_history : route_map.login + "?redirect=" + encodeURIComponent(window.location.href)}
        >
          {props.intl.formatMessage({
            id: "历史订单",
          })}
        </Link>
      </div>
      <div className={classes.convertContent}>
        <div className={classes.assetAvaliable}>
          <label>
            {props.intl.formatMessage({
              id: "可用资产",
            })}
            ：
          </label>

          {loading.effects["convert/getAvailable"] ? (
            <CircularProgress size={10} />
          ) : layout.userinfo.userId && quoteToken.tokenId ? (
            <span>{`${helper.digits(
              convert.available,
              symbol.purchasePrecision
            )} ${quoteToken.tokenName}`}</span>
          ) : (
            <span> -- </span>
          )}
        </div>
        <TokenSelect
          className={classes.convertContentRow}
          selectValue={quoteToken}
          onSelectChange={(value) => setQuoteToken(value)}
          list={purchaseTokenList}
          inputValue={quoteQty}
          onInputChange={handleQuoteQtyInputChange}
          label={props.intl.formatMessage({
            id: "兑换",
          })}
          placeholder={props.intl.formatMessage({
            id: "请输入兑换数量",
          })}
        />

        <div className={classnames(classes.convertTo)}>
          <ArrowDownIcon size={20}></ArrowDownIcon>
          <div
            className={classnames(
              classes.error,
              error.showError ? "active" : ""
            )}
          >
            {error.errorMsg}
          </div>
        </div>
        <TokenSelect
          className={classes.convertContentRow}
          selectValue={baseToken}
          onSelectChange={(value) => setBaseToken(value)}
          list={offeringsTokenList}
          inputValue={baseQty}
          onInputChange={handleBaseQtyInputChange}
          label={props.intl.formatMessage({
            id: "兑换为",
          })}
          placeholder={props.intl.formatMessage({
            id: "请输入兑换数量",
          })}
        />

        {layout.userinfo.userId ? (
          <Button
            variant="contained"
            color="primary"
            className={classes.convertBtn}
            onClick={handleConvert}
            disabled={
              props.loading.effects["convert/createConvertOrder"] ||
              !symbolPrice.price
            }
          >
            {props.intl.formatMessage({
              id: "兑换",
            })}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            className={classes.convertBtn}
            onClick={goLogin}
          >
            {props.intl.formatMessage({
              id: "登录后兑换",
            })}
          </Button>
        )}
      </div>
      <Dialog
        maxWidth="lg"
        open={showConfirmDialog}
        onClose={onCloseConfirmDialog}
      >
        <DialogContent className={classes.confirmDialogContent}>
          <p className={classes.confirmText}>
            {props.intl.formatMessage({
              id: "确认兑换",
            })}？
          </p>
        </DialogContent>
        <DialogActions className={classes.confirmBtnGroup}>
          <Button onClick={onCloseConfirmDialog}>
            {props.intl.formatMessage({ id: "取消" })}
          </Button>
          <Button color="primary" onClick={onConfirmCreateOrder}>
            {props.intl.formatMessage({ id: "确认" })}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading,
    convert: state.convert,
    layout: state.layout,
  };
}
export default withStyles(styles)(
  connect(mapStateToProps)(injectIntl(ConvertContent))
);
