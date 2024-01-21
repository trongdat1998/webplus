// 邀请
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Invite from "../../components/user/invitation";
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
      <Invite
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
