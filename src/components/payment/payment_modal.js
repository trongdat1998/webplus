import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "dva";
import {
  Button,
  TextField,
  Dialog,
  IconButton,
  DialogContent,
  CircularProgress,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import styles from "./payment_modal.style";
import { FormattedHTMLMessage, injectIntl } from "react-intl";
import { Date } from "core-js";
import { parse } from "search-params";
import VerfiCodeRC from "../public/verificationCode_mui";

function deadlineFormat(t) {
  const n = Number(t);
  if (!n) {
    return ["00", "00", "00", "00"];
  }
  const d = Math.floor(n / (24 * 60 * 60 * 1000));
  const h = Math.floor((t - d * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
  const m = Math.floor(
    (t - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000) / (60 * 1000)
  );
  const s = Math.floor(
    (t - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000 - m * 60 * 1000) / 1000
  );
  return [format(d), format(h), format(m), format(s)];
}
function format(i) {
  return i > 9 ? i : "0" + i;
}
function PaymentModal({
  classes,
  intl,
  open,
  desc,
  onClose,
  orderId,
  ...otherProps
}) {
  const [openModal, setOpenModal] = useState(open);

  useEffect(() => {
    setOpenModal(open);
  }, [open]);

  const {
    orderInfo,
    userInfo,
    codeOrderId,
    payStatus,
    payList,
    prepayList,
    mapList,
    isMapping,
    authType,
    need2FA,
  } = useSelector((state) => {
    return state.payment;
  });

  const closePayOrderModal = function () {
    onClose && onClose();
  };
  const dispatch = useDispatch();
  useEffect(() => {
    if (orderId) {
      dispatch({
        type: "payment/getPayData",
        payload: {
          order_id: orderId,
        },
      });
    }
  }, [dispatch, orderId]);

  const [remainTime, setRemainTime] = useState(0);
  useEffect(() => {
    let interval;
    const run = () => {
      setRemainTime((time) => {
        if (time && Math.max(0, time - 1000) <= 0) {
          dispatch({
            type: "payment/handleChange",
            payload: {
              payStatus: "EXPIRED",
            },
          });
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
        }
        return Math.max(0, time - 1000);
      });
    };
    if (orderInfo.expired) {
      setRemainTime(orderInfo.expired - Date.now());
    }
    if (orderInfo.expired) {
      interval = setInterval(() => {
        run();
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [dispatch, orderInfo.expired]);

  const [code, setCode] = useState({
    mobileCode: "",
    emailCode: "",
    gaCode: "",
  });

  const changeStatus = (n, e) => {
    let value = e.target.value;
    value = value.replace(/\s/g, "");
    setCode({
      ...code,
      [n]: value,
    });
  };

  const sendCode = () => {
    dispatch({
      type: "payment/sendVerifyCode",
      payload: {
        order_id: orderId,
      },
    });
  };
  const [codeMsg, setCodeMsg] = useState("");

  const pay = async (type) => {
    let msg = "";
    let typeMap = {
      MOBILE: "mobileCode",
      EMAIL: "emailCode",
      GA: "gaCode",
    };
    if (need2FA && !code[typeMap[type]]) {
      msg = intl.formatMessage({
        id: "此项不能为空",
      });
      setCodeMsg(msg);
      return;
    }
    const ret = await dispatch({
      type: "payment/pay",
      payload: {
        order_id: `${orderId}`,
        verify_code_order_id: `${codeOrderId}`,
        verify_code: code[typeMap[type]],
      },
    });
    if (ret && ret.code == "OK" && ret.data.processIsEnd) {
      otherProps.onSuccess && otherProps.onSuccess(ret.data);
    }
  };
  const renderAuthType = () => {
    if (authType == "MOBILE") {
      return (
        <li>
          <span>{intl.formatMessage({ id: "手机号码" })} ：</span>
          <p className={classes.grey}>{userInfo.mobile}</p>
        </li>
      );
    } else if (authType == "EMAIL") {
      return (
        <li>
          <span>{intl.formatMessage({ id: "邮箱" })} ：</span>
          <p className={classes.grey}>{userInfo.email}</p>
        </li>
      );
    } else {
      return "";
    }
  };
  const renderCode = () => {
    if (authType == "MOBILE") {
      return (
        <TextField
          placeholder={intl.formatMessage({
            id: "请输入手机验证码pay",
          })}
          value={code.mobileCode}
          onChange={(e) => changeStatus("mobileCode", e)}
          helperText={codeMsg}
          error={Boolean(codeMsg)}
          style={{ flex: 1, width: "100%" }}
          InputProps={{
            endAdornment: (
              <VerfiCodeRC
                value={userInfo.mobile}
                onClick={sendCode}
                className={classes.verfCode}
                variant="text"
              />
            ),
          }}
        />
      );
    } else if (authType == "EMAIL") {
      return (
        <TextField
          placeholder={intl.formatMessage({
            id: "请输入邮箱验证码pay",
          })}
          value={code.emailCode}
          onChange={(e) => changeStatus("emailCode", e)}
          helperText={codeMsg}
          error={Boolean(codeMsg)}
          style={{ flex: 1, width: "100%" }}
          InputProps={{
            endAdornment: (
              <VerfiCodeRC
                value={userInfo.email}
                onClick={sendCode}
                className={classes.verfCode}
                variant="text"
              />
            ),
          }}
        />
      );
    } else {
      return (
        <TextField
          placeholder={intl.formatMessage({
            id: "请输入谷歌验证码pay",
          })}
          value={code.gaCode}
          onChange={(e) => changeStatus("gaCode", e)}
          helperText={codeMsg}
          error={Boolean(codeMsg)}
          style={{ flex: 1, width: "100%" }}
        />
      );
    }
  };
  const render = () => {
    const remainTimeStr = deadlineFormat(remainTime);
    if (payStatus == "") {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );
    } else if (payStatus == "WAIT_FOR_PAYMENT") {
      // 待支付
      return (
        <div className={classes.payment}>
          <ul>
            <li>
              <span>{intl.formatMessage({ id: "用途" })} ：</span>
              <p>{desc || orderInfo.desc}</p>
            </li>
            {payList && payList.length ? (
              <li>
                <span>{intl.formatMessage({ id: "支付金额" })} ：</span>
                <p>
                  {payList.map((item, index) => {
                    return (
                      <span key={index}>
                        {item.amount} {item.tokenId}
                      </span>
                    );
                  })}
                </p>
              </li>
            ) : (
              ""
            )}
            {prepayList && prepayList.length ? (
              <li>
                <span>{intl.formatMessage({ id: "预付金额" })} ：</span>
                <p>
                  {prepayList.map((item, index) => {
                    return (
                      <span key={index}>
                        {item.amount} {item.tokenId}
                      </span>
                    );
                  })}
                </p>
              </li>
            ) : (
              ""
            )}
            {isMapping ? (
              <li>
                <span>{intl.formatMessage({ id: "映射金额" })} ：</span>
                <p>
                  {mapList.map((item, index) => {
                    return (
                      <span key={index}>
                        {item.amount} {item.tokenId}
                      </span>
                    );
                  })}
                </p>
              </li>
            ) : (
              ""
            )}
            {need2FA && authType ? renderAuthType() : ""}
            {need2FA ? (
              <li>
                <span>{intl.formatMessage({ id: "验证码" })} ：</span>
                <div className={classes.emailtype}>
                  {authType ? renderCode() : ""}
                </div>
              </li>
            ) : (
              ""
            )}
          </ul>
          <Button
            variant="contained"
            color="primary"
            fullWidth={true}
            onClick={(e) => pay(authType)}
          >
            {intl.formatMessage({ id: "立即付款" })}
          </Button>
          <FormattedHTMLMessage
            id="请在{time}之内完成操作"
            values={{
              time:
                (remainTimeStr[0] != "00" ? remainTimeStr[0] : "") +
                (remainTimeStr[0] != "00"
                  ? intl.formatMessage({ id: "天" }) + " "
                  : "") +
                remainTimeStr[1] +
                ":" +
                remainTimeStr[2] +
                ":" +
                remainTimeStr[3],
            }}
            tagName="p"
          />
        </div>
      );
    } else if (payStatus == "FAIL" || payStatus == "EXPIRED") {
      let text = {
        FAIL: "支付失败",
        EXPIRED: "订单已失效",
      };
      return (
        <div className={classes.status}>
          <img src={require("../../assets/fail.png")} />
          <h1>{intl.formatMessage({ id: text[payStatus] })}</h1>
        </div>
      );
    } else if (payStatus == "COMPLETED" || payStatus == "PROCESSING") {
      let text = {
        COMPLETED: "支付成功",
        PROCESSING: "已经成功提交付款，请耐心等待",
      };
      return (
        <div className={classes.status}>
          <img src={require("../../assets/success.png")} />
          <h1>{intl.formatMessage({ id: text[payStatus] })}</h1>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <Dialog
      open={openModal}
      keepMounted
      maxWidh="lg"
      onClose={closePayOrderModal}
      disableBackdropClick
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent className={classes["modal--content"]}>
        <div className={classes["modal--title"]}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={closePayOrderModal}
          >
            <CloseIcon />
          </IconButton>
        </div>
        {render()}
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(styles)(injectIntl(PaymentModal));
