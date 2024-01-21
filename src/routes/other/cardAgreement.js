// 首页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Index from "../../components/other/cardAgreement";
import withRoot from "../../withRoot";

function IndexPage({ layout, dispatch, location }) {
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location} darkBg={true}>
      <Index />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, index }) {
  return { layout, index };
}

export default withRoot(connect(mapStateToProps)(IndexPage));
