// 用户中心
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import FoundPassword from "../../components/user/fundpassword";
import withRoot from "../../withRoot";

function FundPasswordPage({
  layout,
  user,
  loading,
  dispatch,
  location,
  history,
  match
}) {
  return (
    <LayoutRC
      {...layout}
      loading={loading}
      dispatch={dispatch}
      location={location}
    >
      <FoundPassword
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

export default withRoot(connect(mapStateToProps)(FundPasswordPage));
