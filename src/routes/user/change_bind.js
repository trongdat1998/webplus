// 用户中心
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import UserCenterChangeBind from "../../components/user/changeBind";
import withRoot from "../../withRoot";

/**
 * 换绑页面
 */
function UserCenterChangeBindPage({
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
      <UserCenterChangeBind
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

export default withRoot(connect(mapStateToProps)(UserCenterChangeBindPage));
