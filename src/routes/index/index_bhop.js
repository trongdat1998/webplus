// 首页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Index from "../../components/bhopindex/index";
import Quotes from "../../components/bhopindex/quotes";
import Feature from "../../components/bhopindex/feature";
import Other from "../../components/bhopindex/other";
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
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location} darkBg={true}>
      <Index {...layout} dispatch={dispatch} location={location} />
      <Quotes {...layout} {...ws} dispatch={dispatch} location={location} />
      <Feature {...layout} />
      <Other {...layout} />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, index, ws }) {
  return { layout, index, ws };
}

export default withRoot(connect(mapStateToProps)(IndexPage));
