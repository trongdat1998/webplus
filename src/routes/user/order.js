// 订单-币币订单
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Order from "../../components/exchange/order";
import withRoot from "../../withRoot";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";

let j = false;
function OrderPage({ layout, exchange, loading, dispatch, location, history }) {
  if (helper.changeVersion()) {
    if (!j) {
      j = true;
      window.location.href = route_map.m_order;
    }
    return;
  }
  return (
    <LayoutRC
      {...layout}
      loading={loading}
      dispatch={dispatch}
      location={location}
    >
      <Order
        {...layout}
        {...exchange}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, exchange, loading }) {
  return { layout, exchange, loading };
}

export default withRoot(connect(mapStateToProps)(OrderPage));
