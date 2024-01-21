// 修改密码
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import ResetPassword from "../../components/user/resetpassword";
import withRoot from "../../withRoot";

function ResetPasswordPage({
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
      <ResetPassword
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

export default withRoot(connect(mapStateToProps)(ResetPasswordPage));
