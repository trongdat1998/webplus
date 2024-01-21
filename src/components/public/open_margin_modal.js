// 开通杠杆
import React, { useState, useEffect } from "react";
import {
  Checkbox,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
  Button,
  FormControlLabel,
} from "@material-ui/core";
import { injectIntl } from "react-intl";

import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import styles from "./open_margin_modal.style.js";

function OpenMarginModal({ classes, intl, dispatch, ...props }) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  function handleClose(e) {
    setOpen(false);
    setChecked(false);
    props.onClose && props.onClose();
  }

  // 确认开通
  function handleConfirm() {
    setShowProtocol(false);
    dispatch({
      type: "lever/openMargin",
    });
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      classes={{ scrollPaper: classes.tip_dialog }}
      key="tip_dialog"
    >
      <DialogTitle
        id="alert-dialog-title"
        classes={{
          root: classes.tip_dialog_title,
        }}
      >
        {intl.formatMessage({
          id: "lever.protocol.dialogTitle",
        })}
        <IconButton
          aria-label="close"
          className={classes.tip_close_btn}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.tip_content}>
        <div className={classes.tip_title}>
          {intl.formatMessage({
            id: "lever.protocol.title",
          })}
        </div>
        <div className={classes.tip_detail}>
          {intl.formatMessage({
            id: "lever.protocol.content",
          })}
        </div>
      </DialogContent>
      <DialogActions className={classes.tip_action}>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              value={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className={classes.tip_checkbox}
            ></Checkbox>
          }
          label={intl.formatMessage({
            id: "lever.protocol.approve",
          })}
          classes={{
            label: classes.tip_checkbox_label,
          }}
        />
        <Button
          className={classes.tip_btn}
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={!checked}
        >
          {intl.formatMessage({ id: "lever.protocol.confirm" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withStyles(styles)(injectIntl(OpenMarginModal));
