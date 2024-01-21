// 行情页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import TokenInfo from "../../components/exchange/tokenInfo";
import Trading from "../../components/exchange/trading";
import TradingHistory from "../../components/exchange/tradingHistory";
import Kline from "../../components/exchange/kline";
import DepthChart from "../../components/exchange/depth";
import TokenList from "../../components/exchange/tokenList";
import Handicap from "../../components/exchange/handicap";
import LastTrading from "../../components/exchange/lastTrading";
import HandicapOrLastTrading from "../../components/exchange/HandicapOrLastTrading";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import ThemeData from "../../theme_data";
import Globalcss from "../../theme_global";
import styles from "./style";
import classnames from "classnames";

let quoteMode = localStorage.quoteMode;
let data = { ...ThemeData };
data.palette2 = window.palette2[quoteMode];
let theme = createMuiTheme(data);
// 全局样式
const GlobalCss = withStyles(Globalcss(theme))(() => null);

let j = false;
function Exchange({
  layout,
  exchange,
  ws,
  classes,
  loading,
  dispatch,
  location,
  match,
  history,
}) {
  const token1 = (match.params.token1 || "").toUpperCase();
  const token2 = (match.params.token2 || "").toUpperCase();
  const exchangeId = match.params.exchangeId || "";
  if (exchangeId) {
    if (!j) {
      j = true;
      let url = route_map.exchange;
      if (token1 && token2) {
        url += `/${token1}/${token2}`;
      }
      window.location.href = url;
    }
    return;
  }
  // const symbol = layout.config.symbols_obj.coin[token1 + token2];
  const symbol = layout.config.symbols[token1 + token2];
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
    const coin = layout.config.symbol[0];
    if (coin) {
      window.location.href =
        route_map.exchange +
        "/" +
        (coin["baseTokenId"] ? coin["baseTokenId"] : "BTC") +
        "/" +
        (coin["quoteTokenId"] ? coin["quoteTokenId"] : "USDT");
    } else {
      window.location.href = route_map.index;
    }
    return;
  }
  if (exchange.quoteMode != quoteMode) {
    quoteMode = exchange.quoteMode;
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
    chart: [304, 354, 404, 474],
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
              exchange.quoteMode == "Light"
                ? s.exchange_light_bg
                : s.exchange_bg
            }
          >
            <div
              className={
                exchange.quoteMode == "Light"
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
                  {...exchange}
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
                      {...exchange}
                      {...ws}
                      loading={loading}
                      match={match}
                      dispatch={dispatch}
                      history={history}
                    />
                    <div
                      className={s.chart}
                      style={{
                        height: heightMap["chart"][level],
                      }}
                    >
                      <Kline
                        {...layout}
                        {...exchange}
                        {...ws}
                        match={match}
                        loading={loading}
                        dispatch={dispatch}
                        location={location}
                        history={history}
                      />

                      <DepthChart
                        {...layout}
                        {...exchange}
                        {...ws}
                        match={match}
                        loading={loading}
                        dispatch={dispatch}
                        location={location}
                        history={history}
                      />
                    </div>
                    <Trading
                      layout={layout}
                      exchange={exchange}
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
                        {...exchange}
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
                        {...exchange}
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
              {...exchange}
              {...ws}
              match={match}
              loading={loading}
              dispatch={dispatch}
            />
          </div>
        </LayoutRC>
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
            exchange.quoteMode == "Light" ? s.exchange_light_bg : s.exchange_bg
          }
        >
          <div
            className={
              exchange.quoteMode == "Light"
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
                {...exchange}
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
                    {...exchange}
                    {...ws}
                    loading={loading}
                    match={match}
                    dispatch={dispatch}
                    history={history}
                  />
                  <div
                    className={s.chart}
                    style={{
                      height: heightMap["chart"][level],
                    }}
                  >
                    <Kline
                      {...layout}
                      {...exchange}
                      {...ws}
                      match={match}
                      loading={loading}
                      dispatch={dispatch}
                      location={location}
                      history={history}
                    />

                    <DepthChart
                      {...layout}
                      {...exchange}
                      {...ws}
                      match={match}
                      loading={loading}
                      dispatch={dispatch}
                      location={location}
                      history={history}
                    />
                  </div>
                  <Trading
                    layout={layout}
                    exchange={exchange}
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
                    {...exchange}
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
            {...exchange}
            {...ws}
            match={match}
            loading={loading}
            dispatch={dispatch}
          />
        </div>
      </LayoutRC>
    </MuiThemeProvider>
  );
}

function mapStateToProps({ layout, exchange, ws, loading }) {
  return { layout, exchange, ws, loading };
}

export default withStyles(styles)(connect(mapStateToProps)(Exchange));
