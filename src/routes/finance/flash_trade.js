// 减持记录
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import List from "../../components/finance/flash_trade";
import withRoot from "../../withRoot";

function tradePage({
  layout,
  dispatch,
  finance,
  ws,
  loading,
  location,
  match,
  history,
}) {
  return (
    <LayoutRC
      {...layout}
      loading={loading}
      dispatch={dispatch}
      location={location}
    >
      <List
        {...layout}
        {...finance}
        {...ws}
        loading={loading}
        dispatch={dispatch}
        location={location}
        match={match}
        history={history}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, finance, ws, loading }) {
  return { layout, finance, ws, loading };
}

export default withRoot(connect(mapStateToProps)(tradePage));
