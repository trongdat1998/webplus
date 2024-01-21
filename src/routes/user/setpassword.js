// 设置密码
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import SetPassword from "../../components/user/setpassword";
import withRoot from "../../withRoot";

function SetPasswordPage({
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
      <SetPassword
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

export default withRoot(connect(mapStateToProps)(SetPasswordPage));
