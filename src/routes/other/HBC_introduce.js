// HBC introduce
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/other/HBC_introduce";
import withRoot from "../../withRoot";

function HBCIntroduce({ layout, loading, dispatch, location, match, history }) {
  return (
    <LayoutRC
      {...layout}
      dispatch={dispatch}
      loading={loading}
      location={location}
    >
      <Content
        {...layout}
        match={match}
        history={history}
        loading={loading}
        dispatch={dispatch}
        location={location}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, loading }) {
  return { layout, loading };
}

export default withRoot(connect(mapStateToProps)(HBCIntroduce));
