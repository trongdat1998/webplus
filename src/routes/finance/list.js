// // 资产列表页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import List from "../../components/finance/list_new";
import withRoot from "../../withRoot";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";

let j = false;
function ListPage({
  layout,
  dispatch,
  finance,
  ws,
  loading,
  location,
  match,
  history
}) {
  if (helper.changeVersion()) {
    if (!j) {
      j = true;
      window.location.href = route_map.m_finance_list;
    }
    return;
  }
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

export default withRoot(connect(mapStateToProps)(ListPage));
