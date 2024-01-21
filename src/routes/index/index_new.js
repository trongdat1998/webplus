// 新版首页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Index from "../../components/newindex/index";
import Quotes from "../../components/newindex/quotes";
import Feature from "../../components/newindex/feature";
import Other from "../../components/newindex/other";
import Buy from "../../components/newindex/buy";
import Klines from "../../components/newindex/klines";
import Register from "../../components/newindex/register";
import Announce from "../../components/newindex/announce";
import Download from "../../components/newindex/download";
import withRoot from "../../withRoot";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";

let j = false;
function IndexPage({ layout, index, ws, dispatch, location }) {
  if (helper.changeVersion()) {
    if (!j) {
      j = true;
      window.location.href = route_map.m_index;
    }
    return;
  }
  const indexModules = layout.index_config.indexModules || {};
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location}>
      <Index {...layout} dispatch={dispatch} location={location} />
      {indexModules.oneKeyBuy ? (
        <Buy {...layout} {...index} dispatch={dispatch} location={location} />
      ) : (
        ""
      )}
      {indexModules.recommended ? (
        <Klines
          {...layout}
          {...index}
          {...ws}
          dispatch={dispatch}
          location={location}
        />
      ) : (
        ""
      )}
      <Announce {...layout} dispatch={dispatch} location={location} />
      {indexModules.symbols ? (
        <Quotes
          {...layout}
          {...index}
          {...ws}
          dispatch={dispatch}
          location={location}
        />
      ) : (
        ""
      )}
      {indexModules.platform ? (
        <Feature
          {...layout}
          {...index}
          dispatch={dispatch}
          location={location}
        />
      ) : (
        ""
      )}
      {/* userDefine1，userDefine2，userDefine3 */}
      <Other {...layout} {...index} dispatch={dispatch} location={location} />
      {indexModules.download ? (
        <Download
          {...layout}
          {...index}
          dispatch={dispatch}
          location={location}
        />
      ) : (
        ""
      )}
      {indexModules.quickRegistration ? <Register {...layout} /> : ""}
    </LayoutRC>
  );
}

function mapStateToProps({ layout, index, ws }) {
  return { layout, index, ws };
}

export default withRoot(connect(mapStateToProps)(IndexPage));
