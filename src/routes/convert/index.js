import React from "react";
import { connect } from "dva";

import Layout from "../../components/layout_new";
import ConvertContent from "../../components/convert/content";

import withRoot from "../../withRoot";

function ConvertPage({ layout, dispatch }) {
  return (
    <Layout {...layout} dispatch={dispatch}>
      <ConvertContent></ConvertContent>
    </Layout>
  );
}

function mapStateToProps(state) {
  return {
    layout: state.layout,
  };
}

export default withRoot(connect(mapStateToProps)(ConvertPage));
