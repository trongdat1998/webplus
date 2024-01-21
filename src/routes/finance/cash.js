// 提币
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Cash from "../../components/finance/cash_mui";
import withRoot from "../../withRoot";

function CashPage({
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
      <Cash
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

//export default connect(mapStateToProps)(CashPage);
export default withRoot(connect(mapStateToProps)(CashPage));
