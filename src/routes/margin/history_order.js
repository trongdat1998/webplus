// 杠杆历史成交
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/margin/history_order";
import withRoot from "../../withRoot";

function LeverHistoryOrderPage({
  layout,
  lever,
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
        {...lever}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, lever, loading }) {
  return { layout, lever, loading };
}

export default withRoot(connect(mapStateToProps)(LeverHistoryOrderPage));
