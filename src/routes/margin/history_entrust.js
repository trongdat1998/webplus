// 杠杆历史委托
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/margin/history_entrust";
import withRoot from "../../withRoot";

function LeverHistoryEntrustPage({
  layout,
  option,
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
        {...option}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, option, loading }) {
  return { layout, option, loading };
}

export default withRoot(connect(mapStateToProps)(LeverHistoryEntrustPage));
