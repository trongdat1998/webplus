// 无权访问
import React from "react";
import { connect } from "dva";
import Index from "../../components/other/noAccess";

function IndexPage({ layout, dispatch, location }) {
  return <Index {...layout} />;
}

function mapStateToProps({ layout }) {
  return { layout };
}

export default connect(mapStateToProps)(IndexPage);
