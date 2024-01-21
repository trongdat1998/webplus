// 交割订单
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/future/delivery_order";
import withRoot from "../../withRoot";

function FutureDeliveryPage({
  layout,
  future,
  loading,
  dispatch,
  location,
  history,
  match,
}) {
  return (
    <LayoutRC
      {...layout}
      loading={loading}
      dispatch={dispatch}
      location={location}
    >
      <Content
        {...layout}
        {...future}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, future, loading }) {
  return { layout, future, loading };
}

export default withRoot(connect(mapStateToProps)(FutureDeliveryPage));
