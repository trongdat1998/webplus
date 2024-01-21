// 永续合约行情页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import TokenInfo from "../../components/future/quotes/tokenInfo";
import Finance from "../../components/future/quotes/finance";
import Trading from "../../components/future/quotes/trading";
import TradeOrder from "../../components/future/trade_order";
import Kline from "../../components/future/quotes/kline";
import DepthChart from "../../components/future/quotes/depth";
import TokenList from "../../components/future/quotes/tokenList";
import Handicap from "../../components/future/quotes/handicap";
import LastTrading from "../../components/future/quotes/lastTrading";
import HandicapOrLastTrading from "../../components/future/quotes/HandicapOrLastTrading";
import route_map from "../../config/route_map";
import CssBaseline from "@material-ui/core/CssBaseline";
import ThemeData from "../../theme_data";
import Globalcss from "../../theme_global";
import styles from "./quote_style";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";
import helper from "../../utils/helper";
import classnames from "classnames";

let quoteMode = localStorage.optionQuoteMode;
let data = { ...ThemeData };
data.palette2 = window.palette2[quoteMode];
let theme = createMuiTheme(data);
// 全局样式
const GlobalCss = withStyles(Globalcss(theme))(() => null);

let j = false;
function Exchange({
  layout,
  future,
  loading,
  ws,
  classes,
  dispatch,
  location,
  match,
  history
}) {
  const symbols = layout.config.symbols_obj.all;
  const symbol = layout.config.futuresSymbol;
  const symbolId = match.params.symbolId || "";

  const exchangeId = match.params.exchangeId || "";
  if (exchangeId) {
    if (!j) {
      j = true;
      let url = route_map.future;
      if (symbolId) {
        url += `/${symbolId}`;
      }
      window.location.href = url;
    }
    return;
  }

  const info = symbols[symbolId];
  if (!info) {
    if (symbol[0]) {
      window.location.href = route_map.future + "/" + symbol[0]["symbolId"];
    } else {
      window.location.href = route_map.index;
    }
    return;
  }
  if (future.quoteMode != quoteMode) {
    quoteMode = future.quoteMode;
    data.palette2 = window.palette2[quoteMode];
    theme = createMuiTheme(data);
  }
  const s = classes;
  const height = helper.getClientHeight();
  const width = window.document.documentElement.offsetWidth;
  return (
    <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalCss />
        <LayoutRC
          {...layout}
          dispatch={dispatch}
          loading={loading.global}
          location={location}
          hide_footer={true}
        >
          <div className={classnames(s.exchange, future.quoteMode == "Light" ? s.exchange_light_bg : s.exchange_bg)}>
            <div className={s.content}>
              <div className={s.item}>
                <TokenInfo
                  {...layout}
                  {...future}
                  {...ws}
                  loading={loading}
                  match={match}
                  dispatch={dispatch}
                  history={history}
                />
              </div>
              <div className={s.item} style={{height: "calc(100% - 378px)"}}>
                <div className={s.left2}>
                  <div className={s.chart}>
                    <Kline
                      {...layout}
                      {...future}
                      {...ws}
                      match={match}
                      loading={loading}
                      dispatch={dispatch}
                      location={location}
                      history={history}
                    />

                    <DepthChart
                      {...layout}
                      {...future}
                      {...ws}
                      match={match}
                      loading={loading}
                      dispatch={dispatch}
                      location={location}
                      history={history}
                    />
                  </div>
                </div>
                <div className={s.right2}>
                  <div className={s.r11}>
                    <Handicap
                      {...layout}
                      {...future}
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
                      {...future}
                      {...ws}
                      loading={loading}
                      match={match}
                      dispatch={dispatch}
                      location={location}
                    />
                  </div>
                </div>
              </div>
              <div className={s.item} style={{height: 320}}>
                <div className={s.left2}>
                  <TradeOrder
                    {...layout}
                    {...future}
                    {...ws}
                    loading={loading}
                    dispatch={dispatch}
                    match={match}
                    history={history}
                  />
                </div>
                <div className={s.right2}>
                  <div className={classnames(s.r14, future.showFinance ? "open" : "")}>
                    <Finance
                      layout={layout}
                      future={future}
                      ws={ws}
                      loading={loading}
                      match={match}
                      dispatch={dispatch}
                      location={location}
                      history={history}
                    />
                  </div>
                  <div className={s.r13}>
                    <Trading
                      layout={layout}
                      future={future}
                      ws={ws}
                      loading={loading}
                      match={match}
                      dispatch={dispatch}
                      location={location}
                      history={history}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LayoutRC>
      </MuiThemeProvider>
  )
  // if (width >= 1440) {
  //   return (
  //     <MuiThemeProvider theme={theme}>
  //       <CssBaseline />
  //       <GlobalCss />
  //       <LayoutRC
  //         {...layout}
  //         dispatch={dispatch}
  //         loading={loading.global}
  //         location={location}
  //       >
  //         <div className={classnames(s.exchange, future.quoteMode == "Light" ? s.exchange_light_bg : s.exchange_bg)}>
  //           <div className={s.content}>
  //             <div className={s.item}>
  //               <TokenInfo
  //                 {...layout}
  //                 {...future}
  //                 {...ws}
  //                 loading={loading}
  //                 match={match}
  //                 dispatch={dispatch}
  //                 history={history}
  //               />
  //             </div>
  //             <div className={s.item} style={{height: "calc(100% - 378px)"}}>
  //               <div className={s.left2}>
  //                 <div className={s.chart}>
  //                   <Kline
  //                     {...layout}
  //                     {...future}
  //                     {...ws}
  //                     match={match}
  //                     loading={loading}
  //                     dispatch={dispatch}
  //                     location={location}
  //                     history={history}
  //                   />

  //                   <DepthChart
  //                     {...layout}
  //                     {...future}
  //                     {...ws}
  //                     match={match}
  //                     loading={loading}
  //                     dispatch={dispatch}
  //                     location={location}
  //                     history={history}
  //                   />
  //                 </div>
  //               </div>
  //               <div className={s.right2}>
  //                 <div className={s.r11}>
  //                   <Handicap
  //                     {...layout}
  //                     {...future}
  //                     {...ws}
  //                     loading={loading}
  //                     match={match}
  //                     dispatch={dispatch}
  //                     location={location}
  //                   />
  //                 </div>
  //                 <div className={s.r12}>
  //                   <LastTrading
  //                     {...layout}
  //                     {...future}
  //                     {...ws}
  //                     loading={loading}
  //                     match={match}
  //                     dispatch={dispatch}
  //                     location={location}
  //                   />
  //                 </div>
  //               </div>
  //             </div>
  //             <div className={s.item} style={{height: 320}}>
  //               <div className={s.left2}>
  //                 <TradeOrder
  //                   {...layout}
  //                   {...future}
  //                   {...ws}
  //                   loading={loading}
  //                   dispatch={dispatch}
  //                   match={match}
  //                   history={history}
  //                 />
  //               </div>
  //               <div className={s.right2}>
  //                 <div className={s.r11}>
  //                   <Trading
  //                     layout={layout}
  //                     future={future}
  //                     ws={ws}
  //                     loading={loading}
  //                     match={match}
  //                     dispatch={dispatch}
  //                     location={location}
  //                     history={history}
  //                   />
  //                 </div>
  //                 <div className={s.r12}>
  //                   <Finance
  //                     layout={layout}
  //                     future={future}
  //                     ws={ws}
  //                     loading={loading}
  //                     match={match}
  //                     dispatch={dispatch}
  //                     location={location}
  //                     history={history}
  //                   />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </LayoutRC>
  //     </MuiThemeProvider>
  //   );
  // }
  // return (
  //   <MuiThemeProvider theme={theme}>
  //     <CssBaseline />
  //     <GlobalCss />
  //     <LayoutRC
  //       {...layout}
  //       dispatch={dispatch}
  //       loading={loading.global}
  //       location={location}
  //     >
  //       <div className={classnames(s.exchange, future.quoteMode == "Light" ? s.exchange_light_bg : s.exchange_bg)}>
  //         <div className={s.content}>
  //           <div className={s.item}>
  //             <TokenInfo
  //               {...layout}
  //               {...future}
  //               {...ws}
  //               loading={loading}
  //               match={match}
  //               dispatch={dispatch}
  //               history={history}
  //             />
  //           </div>
  //           <div className={s.item} style={{height: "calc(100% - 378px)"}}>
  //             <div className={s.left}>
  //               <div className={s.chart}>
  //                 <Kline
  //                   {...layout}
  //                   {...future}
  //                   {...ws}
  //                   match={match}
  //                   loading={loading}
  //                   dispatch={dispatch}
  //                   location={location}
  //                   history={history}
  //                 />

  //                 <DepthChart
  //                   {...layout}
  //                   {...future}
  //                   {...ws}
  //                   match={match}
  //                   loading={loading}
  //                   dispatch={dispatch}
  //                   location={location}
  //                   history={history}
  //                 />
  //               </div>
  //             </div>
  //             <div className={s.right}>
  //               <HandicapOrLastTrading
  //                 {...layout}
  //                 {...future}
  //                 {...ws}
  //                 loading={loading}
  //                 match={match}
  //                 dispatch={dispatch}
  //                 location={location}
  //               />
  //             </div>
  //           </div>
  //           <div className={s.item} style={{height: 320}}>
  //             <div className={s.left}>
  //               <TradeOrder
  //                 {...layout}
  //                 {...future}
  //                 {...ws}
  //                 loading={loading}
  //                 dispatch={dispatch}
  //                 match={match}
  //                 history={history}
  //               />
  //             </div>
  //             <div className={s.right}>
  //               <Trading
  //                 layout={layout}
  //                 future={future}
  //                 ws={ws}
  //                 loading={loading}
  //                 match={match}
  //                 dispatch={dispatch}
  //                 location={location}
  //                 history={history}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </LayoutRC>
  //   </MuiThemeProvider>
  // );
}

function mapStateToProps({ layout, future, ws, loading }) {
  return { layout, future, ws, loading };
}

export default withStyles(styles)(connect(mapStateToProps)(Exchange));