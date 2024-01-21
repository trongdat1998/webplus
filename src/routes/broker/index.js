// 经纪人管理
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/broker/index";
import withRoot from "../../withRoot";

function BrokerIndexPage({
  layout,
  broker,
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
      <Content
        {...layout}
        {...broker}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, broker, loading }) {
  return { layout, broker, loading };
}

export default withRoot(connect(mapStateToProps)(BrokerIndexPage));
