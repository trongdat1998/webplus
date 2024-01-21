// 杠杆资产
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Finance from "../../components/margin/finance";
import withRoot from "../../withRoot";

function LeverFinancePage({
  layout,
  lever,
  ws,
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
      <Finance
        {...lever}
        {...layout}
        {...ws}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, lever, ws, loading }) {
  return { layout, lever, ws, loading };
}

export default withRoot(connect(mapStateToProps)(LeverFinancePage));
