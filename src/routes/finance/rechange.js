// 充值
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Rechange from "../../components/finance/rechange";
import withRoot from "../../withRoot";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";

let j = false;
function RechangePage({
  layout,
  dispatch,
  finance,
  loading,
  location,
  match,
  history
}) {
  if (helper.changeVersion()) {
    if (!j) {
      j = true;
      window.location.href = route_map.m_rechange + `/${match.params.token}`;
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
      <Rechange
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

export default withRoot(connect(mapStateToProps)(RechangePage));
