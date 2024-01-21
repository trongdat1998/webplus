// currency detail
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/other/currency_detail";
import withRoot from "../../withRoot";

function CurrencyDetail({
  layout,
  exchange,
  loading,
  dispatch,
  location,
  match,
  history,
}) {
  return (
    <LayoutRC
      {...layout}
      dispatch={dispatch}
      loading={loading}
      location={location}
    >
      <Content
        {...layout}
        {...exchange}
        match={match}
        history={history}
        loading={loading}
        dispatch={dispatch}
        location={location}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, exchange, loading }) {
  return { layout, exchange, loading };
}

export default withRoot(connect(mapStateToProps)(CurrencyDetail));
