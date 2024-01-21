// 投票
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/topics/vote.js";
import withRoot from "../../withRoot";

function votePage({
  layout,
  topic,
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
      style={{ backgroundColor: "#00081D" }}
    >
      <Content
        {...layout}
        {...topic}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, topic, loading }) {
  return { layout, topic, loading };
}

export default withRoot(connect(mapStateToProps)(votePage));
