// defi
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import List from "../../components/exchange/defi";
import withRoot from "../../withRoot";

function ListPage({ layout, dispatch, ws, loading, location, match, history }) {
  return (
    <LayoutRC
      {...layout}
      loading={loading}
      dispatch={dispatch}
      location={location}
    >
      <List
        {...layout}
        {...ws}
        loading={loading}
        dispatch={dispatch}
        location={location}
        match={match}
        history={history}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, ws, loading }) {
  return { layout, ws, loading };
}

export default withRoot(connect(mapStateToProps)(ListPage));
