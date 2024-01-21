// 用户中心
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import UserCenter from "../../components/user/index";
import withRoot from "../../withRoot";

function UserCenterPage({
  layout,
  user,
  loading,
  dispatch,
  location,
  history
}) {
  return (
    <LayoutRC
      {...layout}
      loading={loading}
      dispatch={dispatch}
      location={location}
    >
      <UserCenter
        {...layout}
        {...user}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, user, loading }) {
  return { layout, user, loading };
}

export default withRoot(connect(mapStateToProps)(UserCenterPage));
