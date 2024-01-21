//协议页专用
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import ProtocolsComponent from "../../components/protocols/index";
import withRoot from "../../withRoot";

function Protocols({
  layout,
  protocols,
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
      <ProtocolsComponent
        {...layout}
        {...protocols}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, protocols, loading }) {
  return { layout, protocols, loading };
}

export default withRoot(connect(mapStateToProps)(Protocols));
