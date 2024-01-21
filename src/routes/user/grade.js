// 用户等级
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/user/grade";
import withRoot from "../../withRoot";

function UserGradePage({ layout, user, loading, dispatch, location, history }) {
  return (
    <LayoutRC
      {...layout}
      loading={loading}
      dispatch={dispatch}
      location={location}
    >
      <Content
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

export default withRoot(connect(mapStateToProps)(UserGradePage));
