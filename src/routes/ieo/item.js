// ieo 活动页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/ieo/item";
import withRoot from "../../withRoot";

function CoinplusPage({
  layout,
  ieo,
  loading,
  dispatch,
  location,
  history,
  match
}) {
  return (
    <LayoutRC
      {...layout}
      loading={loading}
      dispatch={dispatch}
      location={location}
    >
      <Content
        {...layout}
        {...ieo}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, ieo, loading }) {
  return { layout, ieo, loading };
}

export default withRoot(connect(mapStateToProps)(CoinplusPage));
