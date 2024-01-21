// 个性化配置
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import CustomConfig from "../../components/user/customConfig";
import withRoot from "../../withRoot";

function CustomConfigPage({
  layout,
  user,
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
      <CustomConfig
        {...layout}
        {...user}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, user, loading }) {
  return { layout, user, loading };
}

export default withRoot(connect(mapStateToProps)(CustomConfigPage));
