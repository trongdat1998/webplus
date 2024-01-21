// 用户中心
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import UserCenterBind from "../../components/user/bind";
import withRoot from "../../withRoot";

function UserCenterBindPage({
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
      <UserCenterBind
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

export default withRoot(connect(mapStateToProps)(UserCenterBindPage));
