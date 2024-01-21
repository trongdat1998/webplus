import React from "react";
import { connect } from "dva";

import withRoot from "../../withRoot";
import ConvertHistory from "../../components/convert/history";
import Layout from "../../components/layout_new";

function ConvertHistoryPage({ layout, dispatch }) {
  return (
    <Layout dispatch={dispatch} {...layout}>
      <ConvertHistory />
    </Layout>
  );
}

function mapStateToProps(state) {
  return {
    layout: state.layout,
  };
}

export default withRoot(connect(mapStateToProps)(ConvertHistoryPage));
