import React, { Component } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import CONST from "../../config/const";

/**
 * 最好的方式是，引入组件后，自动加载google的 script；
 * 然后登录或者其他地方需要二次校验的，调用google captch的execute方法
 * @returns
 */
class GoogleCaptcha extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recaptchaLoaded: false,
    };
    this._reCaptchaRef = React.createRef();
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {}

  // 异步加载完毕
  asyncScriptOnLoad = () => {
    this.setState({ recaptchaLoaded: true });
  };

  // 执行验证
  execute() {
    this._reCaptchaRef.current.executeAsync().then((response) => {
      console.log("executeAsync promise - Captcha value:", response);
      if (response) {
        this.props.onSuccess &&
          this.props.onSuccess({
            captcha_response: response,
            captcha_id: CONST.SITE_KEY,
          });
      }
    });
  }
  // 重置验证
  reset() {
    this._reCaptchaRef.current.reset();
  }

  onError(err) {
    this.props.onError && this.props.onError(err || "google captcha error");
  }

  render() {
    return (
      <ReCAPTCHA
        badge={this.props.badge ? this.props.badge : "inline"}
        size="invisible"
        ref={this._reCaptchaRef}
        sitekey={CONST.SITE_KEY}
        onErrored={this.onError}
        onExpired={this.onError}
        asyncScriptOnLoad={this.asyncScriptOnLoad}
      />
    );
  }
}

export default GoogleCaptcha;
