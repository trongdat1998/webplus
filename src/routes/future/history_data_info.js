// 合约资金费率
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/future/history_data/info";
import withRoot from "../../withRoot";

function FutureCurrentEntrustPage({
  layout,
  future,
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
      <Content
        {...layout}
        {...future}
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

function mapStateToProps({ layout, future, ws, loading }) {
  return { layout, future, ws, loading };
}

export default withRoot(connect(mapStateToProps)(FutureCurrentEntrustPage));
