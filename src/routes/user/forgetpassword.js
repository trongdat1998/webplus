// 用户中心
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import ForgetPassword from "../../components/user/forgetpassword";
import withRoot from "../../withRoot";

function ForgetPasswordPage({
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
      <ForgetPassword
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

export default withRoot(connect(mapStateToProps)(ForgetPasswordPage));
