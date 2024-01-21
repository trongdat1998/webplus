import React from "react";
import { connect } from "dva";
import { Redirect } from "dva/router";
import route_map from "../config/route_map";

function IndexPage({ layout, dispatch, location }) {
  return <Redirect to={route_map.index} />;
}

function mapStateToProps({ layout }) {
  return { layout };
}

export default connect(mapStateToProps)(IndexPage);
