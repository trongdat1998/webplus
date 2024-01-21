// 闪电平仓
import React, { useState, useEffect } from "react";
import { connect } from "dva";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  FormControlLabel,
  FormControl,
  Checkbox,
  RadioGroup,
  Button,
} from "@material-ui/core";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import styles from "./modal_close_position_style";

function ModalClosePosition(props) {
  const { classes, loading, item } = props;

  const [notShowAlert, setNotShowAlert] = useState(false);

  const handleClose = (event) => {
    if (props.onClose) {
      props.onClose();
    }
  };

  const handleCancel = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  const handleSubmitStop = () => {
    if (props.onClose) {
      props.onClose();
    }
    // 下次不再提醒
    if (notShowAlert) {
      props.dispatch({
        type: "layout/setCustomConfig",
        payload: {
          quickCloseConfirm: !notShowAlert,
        },
      });
    }
    props.dispatch({
      type: "future/flashClosePosition",
      payload: {
        client_order_id: new Date().getTime(),
        symbol_id: item.symbolId,
        is_long: item.isLong,
        exchange_id: item.exchangeId,
      },
    });
  };

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle id="alert-dialog-slide-title">
        {props.intl.formatMessage({
          id: "闪电平仓",
        })}{" "}
        |{" "}
        {Number(item.isLong) > 0
          ? props.intl.formatMessage({
              id: "卖出（平多）",
            })
          : props.intl.formatMessage({
              id: "买入（平空）",
            })}
      </DialogTitle>
      {loading.effects["future/flashClosePosition "] ? (
        <DialogContent style={{ width: 390 }}>
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{ height: 305, width: "100%" }}
          >
            <Grid>
              <CircularProgress color="primary" size={30} />
            </Grid>
          </Grid>
        </DialogContent>
      ) : (
        <DialogContent style={{ width: 390 }}>
          <div className={classes.formRow}>
            <label className={classes.formLabel}>
              {props.intl.formatMessage({
                id: "价格",
              })}
              :
            </label>
            <span>
              {props.intl.formatMessage({
                id: "市价",
              })}
            </span>
          </div>
          <div className={classes.formRow}>
            <label className={classes.formLabel}>
              {props.intl.formatMessage({
                id: "数量:",
              })}
            </label>
            <span>
              {props.item.total}
              {props.intl.formatMessage({
                id: "张",
              })}
            </span>
          </div>
          <div className={classes.formRow}>
            <p className={classes.desc}>
              {props.intl.formatMessage({
                id: "flashClose.tips",
              })}
            </p>
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={notShowAlert}
                color="primary"
                onChange={(e) => setNotShowAlert(e.target.checked)}
              />
            }
            label={props.intl.formatMessage({ id: "不再提示" })}
          />
        </DialogContent>
      )}
      <DialogActions>
        <Button color="primary" onClick={handleCancel}>
          {props.intl.formatMessage({ id: "取消" })}
        </Button>
        {loading.effects["future/flashClosePosition"] ||
        loading.effects["future/setCustomConfig"] ? (
          <Button disabled color="primary">
            <CircularProgress color="primary" size={20} />
          </Button>
        ) : (
          <Button onClick={handleSubmitStop} color="primary">
            {props.intl.formatMessage({
              id: "闪电平仓",
            })}
            （
            {Number(item.isLong) > 0
              ? props.intl.formatMessage({
                  id: "卖出",
                })
              : props.intl.formatMessage({
                  id: "买入",
                })}
            ）
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state) {
  return {
    layout: state.layout,
    loading: state.loading,
  };
}

export default withStyles(styles)(
  injectIntl(connect(mapStateToProps)(ModalClosePosition))
);
