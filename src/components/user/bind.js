// 绑定二次验证，email，ga，mobile
import React from "react";
import GARC from "./bindGA";
import MobileRC from "./bindMobile";
import EmailRC from "./bindEmail";

class UserCenterBind extends React.Component {
  render() {
    const type = this.props.match.params.type.toLowerCase();
    if (type === "mobile") {
      return <MobileRC {...this.props} />;
    }
    if (type === "email") {
      return <EmailRC {...this.props} />;
    }
    if (type === "ga") {
      return <GARC {...this.props} />;
    }
  }
}

export default UserCenterBind;
