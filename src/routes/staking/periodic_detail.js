// 定期详情
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/staking/periodic_detail";
import withRoot from "../../withRoot";

function PeriodicDetailPage({
  layout,
  coinplus,
  loading,
  dispatch,
  location,
  history,
  match,
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
        {...coinplus}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, coinplus, loading }) {
  return { layout, coinplus, loading };
}

export default withRoot(connect(mapStateToProps)(PeriodicDetailPage));
