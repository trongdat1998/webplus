// 修改密码
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import KYC from "../../components/user/kyc";
import withRoot from "../../withRoot";

function KYCPage({
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
      <KYC
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

export default withRoot(connect(mapStateToProps)(KYCPage));
