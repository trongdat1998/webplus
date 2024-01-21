// 行情页
import React, { useState, useEffect } from "react";
import { connect } from "dva";
import { injectIntl } from "react-intl";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
} from "@material-ui/core/styles";
import classnames from "classnames";
import CssBaseline from "@material-ui/core/CssBaseline";

import LayoutRC from "../../components/layout_new";
import TokenList from "../../components/margin/tokenList";
import LeverAccountInfo from "../../components/margin/leverAccountInfo";
import TokenInfo from "../../components/margin/tokenInfo";
import TradingFlow from "../../components/margin/trading_flow";
import Trading from "../../components/margin/trading";
import TradingHistory from "../../components/margin/tradingHistory";
import Kline from "../../components/margin/kline";
import DepthChart from "../../components/margin/depth";
import Handicap from "../../components/margin/handicap";
import LastTrading from "../../components/margin/lastTrading";
import HandicapOrLastTrading from "../../components/margin/HandicapOrLastTrading";
import OpenMarginModal from "../../components/public/open_margin_modal";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import ThemeData from "../../theme_data";
import Globalcss from "../../theme_global";
import styles from "./lever.style";

let quoteMode = localStorage.quoteMode;
let data = { ...ThemeData };
data.palette2 = window.palette2[quoteMode];
let theme = createMuiTheme(data);
// 全局样式
const GlobalCss = withStyles(Globalcss(theme))(() => null);

let j = false;
function LeverExchange({
  layout,
  lever,
  ws,
  classes,
  loading,
  dispatch,
  location,
  match,
  history,
  intl,
}) {
  const [showProtocol, setShowProtocol] = useState(false);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (layout.userinfo && layout.userinfo.userId) {
      dispatch({
        type: "lever/isLeverOpened",
      });
    }
  }, [dispatch, layout.userinfo, layout.userinfo.userId]);
  // 当openMargin变化时，切换协议展示状态
  useEffect(() => {
    setShowProtocol(!lever.openMargin);
  }, [lever.openMargin]);
  // 确认开通
  function handleConfirm() {
    setShowProtocol(false);
    dispatch({
      type: "lever/openMargin",
    });
  }
  // 关闭弹框
  function handleClose() {
    setShowProtocol(false);
    dispatch({
      type: "lever/hideLeverProtocol",
    });
  }
  const token1 = (match.params.token1 || "").toUpperCase();
  const token2 = (match.params.token2 || "").toUpperCase();
  const exchangeId = match.params.exchangeId || "";

  if (exchangeId) {
    if (!j) {
      j = true;
      let url = route_map.margin;
      if (token1 && token2) {
        url += `/${token1}/${token2}`;
      }
      window.location.href = url;
    }
    return;
  }
  const symbol = layout.config.symbols_obj.lever[token1 + token2];
  if (helper.changeVersion()) {
    if (!j) {
      j = true;
      let url = route_map.m_exchange;
      if (token1 && token2) {
        url += `/${token1}/${token2}`;
      }
      window.location.href = url;
    }
    return;
  }
  if (!symbol) {
    const coin = layout.config.marginSymbol[0];
    if (coin) {
      window.location.href =
        route_map.margin +
        "/" +
        (coin["baseTokenId"] ? coin["baseTokenId"] : "BTC") +
        "/" +
        (coin["quoteTokenId"] ? coin["quoteTokenId"] : "USDT");
    } else {
      window.location.href = route_map.index;
    }
    return;
  }
  if (lever.quoteMode != quoteMode) {
    quoteMode = lever.quoteMode;
    data.palette2 = window.palette2[quoteMode];
    theme = createMuiTheme(data);
  }
  const s = classes;
  const width = window.document.documentElement.offsetWidth;
  const height = helper.getClientHeight();
  let level = 0;
  if (height > 750 && height <= 800) {
    level = 1;
  } else if (height > 800 && height <= 850) {
    level = 2;
  } else if (height > 850) {
    level = 3;
  }
  let heightMap = {
    content: [642, 692, 742, 812],
    chart: [272, 322, 372, 442],
  };
  if (width >= 1850) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalCss />
        <LayoutRC
          {...layout}
          dispatch={dispatch}
          loading={loading.global}
          location={location}
        >
          <div
            className={
              lever.quoteMode == "Light" ? s.exchange_light_bg : s.exchange_bg
            }
          >
            <div
              className={
                lever.quoteMode == "Light"
                  ? classnames(s.exchange, s.exchange_light)
                  : s.exchange
              }
              style={{
                height: heightMap["content"][level],
              }}
            >
              <div className={s.sidebar}>
                <TokenList
                  {...layout}
                  {...lever}
                  {...ws}
                  dispatch={dispatch}
                  loading={loading}
                  match={match}
                  location={location}
                  history={history}
                />
                <LeverAccountInfo
                  {...layout}
                  {...lever}
                  {...ws}
                  dispatch={dispatch}
                  loading={loading}
                  match={match}
                  location={location}
                  history={history}
                />
              </div>
              <div className={s.content}>
                <div className={s.item}>
                  <div className={s.left2}>
                    <TokenInfo
                      {...layout}
                      {...lever}
                      {...ws}
                      loading={loading}
                      match={match}
                      dispatch={dispatch}
                    />
                    <div
                      className={s.chart}
                      style={{
                        height: heightMap["chart"][level],
                      }}
                    >
                      <Kline
                        {...layout}
                        {...lever}
                        {...ws}
                        match={match}
                        loading={loading}
                        dispatch={dispatch}
                        location={location}
                        history={history}
                      />

                      <DepthChart
                        {...layout}
                        {...lever}
                        {...ws}
                        match={match}
                        loading={loading}
                        dispatch={dispatch}
                        location={location}
                        history={history}
                      />
                    </div>
                    <TradingFlow />
                    <Trading
                      layout={layout}
                      lever={lever}
                      ws={ws}
                      loading={loading}
                      match={match}
                      dispatch={dispatch}
                      location={location}
                      history={history}
                    />
                  </div>
                  <div className={s.right2}>
                    <div className={s.r11}>
                      <Handicap
                        {...layout}
                        {...lever}
                        {...ws}
                        loading={loading}
                        match={match}
                        dispatch={dispatch}
                        location={location}
                      />
                    </div>
                    <div className={s.r12}>
                      <LastTrading
                        {...layout}
                        {...lever}
                        {...ws}
                        loading={loading}
                        match={match}
                        dispatch={dispatch}
                        location={location}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <TradingHistory
              {...layout}
              {...lever}
              {...ws}
              match={match}
              loading={loading}
              dispatch={dispatch}
            />
          </div>
        </LayoutRC>
        <OpenMarginModal
          open={showProtocol}
          onClose={handleClose}
          dispatch={dispatch}
        />
      </MuiThemeProvider>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalCss />
      <LayoutRC
        {...layout}
        dispatch={dispatch}
        loading={loading.global}
        location={location}
      >
        <div
          className={
            lever.quoteMode == "Light" ? s.exchange_light_bg : s.exchange_bg
          }
        >
          <div
            className={
              lever.quoteMode == "Light"
                ? classnames(s.exchange, s.exchange_light)
                : s.exchange
            }
            style={{
              height: heightMap["content"][level],
            }}
          >
            <div className={s.sidebar}>
              <TokenList
                {...layout}
                {...lever}
                {...ws}
                dispatch={dispatch}
                loading={loading}
                match={match}
                location={location}
                history={history}
              />
              <LeverAccountInfo
                {...layout}
                {...lever}
                {...ws}
                dispatch={dispatch}
                loading={loading}
                match={match}
                location={location}
                history={history}
              />
            </div>
            <div className={s.content}>
              <div className={s.item}>
                <div className={s.left}>
                  <TokenInfo
                    {...layout}
                    {...lever}
                    {...ws}
                    loading={loading}
                    match={match}
                    dispatch={dispatch}
                  />
                  <div
                    className={s.chart}
                    style={{
                      height: heightMap["chart"][level],
                    }}
                  >
                    <Kline
                      {...layout}
                      {...lever}
                      {...ws}
                      match={match}
                      loading={loading}
                      dispatch={dispatch}
                      location={location}
                      history={history}
                    />

                    <DepthChart
                      {...layout}
                      {...lever}
                      {...ws}
                      match={match}
                      loading={loading}
                      dispatch={dispatch}
                      location={location}
                      history={history}
                    />
                  </div>
                  <TradingFlow />
                  <Trading
                    layout={layout}
                    lever={lever}
                    ws={ws}
                    loading={loading}
                    match={match}
                    dispatch={dispatch}
                    location={location}
                    history={history}
                  />
                </div>
                <div className={s.right}>
                  <HandicapOrLastTrading
                    {...layout}
                    {...lever}
                    {...ws}
                    loading={loading}
                    match={match}
                    dispatch={dispatch}
                    location={location}
                  />
                </div>
              </div>
            </div>
          </div>
          <TradingHistory
            {...layout}
            {...lever}
            {...ws}
            match={match}
            loading={loading}
            dispatch={dispatch}
          />
        </div>
      </LayoutRC>
      <Dialog
        open={showProtocol}
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
          {/* <Button
            className={classes.tip_btn}
            variant="contained"
            color="primary"
            disabled={true}
          >
            {intl.formatMessage({ id: "敬请期待" })}
          </Button> */}
        </DialogActions>
      </Dialog>
    </MuiThemeProvider>
  );
}

function mapStateToProps({ layout, lever, ws, loading }) {
  return { layout, lever, ws, loading };
}

export default withStyles(styles)(
  connect(mapStateToProps)(injectIntl(LeverExchange))
);
