// 换绑email，ga，mobile
import React from "react";
import ChangeBindGARC from "./changeBindGA";
import ChangeBindMobileRC from "./changeBindMobile";
import ChangeBindEmailRC from "./changeBindEmail";

class UserCenterChangeBind extends React.Component {
  render() {
    const type = this.props.match.params.type.toLowerCase();
    if (type === "mobile") {
      return <ChangeBindMobileRC {...this.props} />;
    }
    if (type === "email") {
      return <ChangeBindEmailRC {...this.props} />;
    }
    if (type === "ga") {
      return <ChangeBindGARC {...this.props} />;
    }
  }
}

export default UserCenterChangeBind;
