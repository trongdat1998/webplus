// 地址管理
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Address from "../../components/finance/address_mui";
import withRoot from "../../withRoot";

function AddressPage({
  layout,
  dispatch,
  finance,
  loading,
  location,
  match,
  history
}) {
  return (
    <LayoutRC
      {...layout}
      loading={loading}
      dispatch={dispatch}
      location={location}
    >
      <Address
        {...layout}
        {...finance}
        loading={loading}
        dispatch={dispatch}
        location={location}
        match={match}
        history={history}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, finance, loading }) {
  return { layout, finance, loading };
}

export default withRoot(connect(mapStateToProps)(AddressPage));
