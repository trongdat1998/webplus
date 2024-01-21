// 邀请注册第一步
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Register from "../../components/user/invite_register_step1";
import withRoot from "../../withRoot";

function RegisterPage({
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
      <Register
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

export default withRoot(connect(mapStateToProps)(RegisterPage));
