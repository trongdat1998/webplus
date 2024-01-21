// 活动账户资产列表页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import List from "../../components/finance/activity_account";
import withRoot from "../../withRoot";

function ListPage({
  layout,
  dispatch,
  finance,
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
        loading={loading}
        dispatch={dispatch}
        location={location}
        match={match}
        history={history}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, finance, loading }) {
  return { layout, finance, loading };
}

export default withRoot(connect(mapStateToProps)(ListPage));
