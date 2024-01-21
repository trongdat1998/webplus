// 极验行为验证

import React from "react";
// import initSense from "../../utils/sense.js";
import CONST from "../../config/const";

const SCRIPT_ID = "react-geetest";

class Sense extends React.Component {
  static defaultProps = {
    className: "i-geetest",
    lang: "zh-cn",
    gt: "",
    challenge: "",
    offline: false,
  };

  constructor() {
    super();
    this.state = {
      senseReady: false,
      interactive: 3, // 1:注册;2:登录;3:短信接口;4:领券\抽奖;5:下单;6:发帖评论;0:其他
      senseInstance: null,
    };
    this.script = null;
  }

  componentDidMount() {
    this.create();
  }

  // componentDidUpdate() {
  //   this.create();
  // }

  create = () => {
    const _this = this;
    if (window.initGeetest) {
      return this.onReady();
    }
    let script = document.getElementById(SCRIPT_ID);
    if (script) {
      return;
    }

    script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.type = "text/javascript";
    script.async = true;
    script.chartset = "utf-8";
    script.onload = () => {
      _this.onReady();
    };
    script.src = `https://static.geetest.com/static/tools/gt.js?_t=${new Date().getTime()}`;
    const s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(script, s);
    this.script = s;
  };

  onReady = () => {
    const { geetestData, dispatch } = this.props;
    if (geetestData && geetestData.gt) {
      this.initGeetest(geetestData);
    } else {
      dispatch({
        type: "layout/registGeetest",
        payload: {
          captcha_id: CONST.SENSE_ID,
        },
        onSuccess: (geetestData) => {
          this.initGeetest(geetestData);
        },
      });
    }
  };

  initGeetest = (geetestData) => {
    const _this = this;
    window.initGeetest(
      {
        gt: geetestData.gt,
        challenge: geetestData.challenge,
        offline: !geetestData.success, // 表示用户后台检测极验服务器是否宕机
        new_captcha: geetestData.new_captcha, // 用于宕机时表示是新验证码的宕机
        product: "bind",
        width: "300px",
      },
      (ret) => {
        ret.onReady(() => {
          _this.setState({
            senseReady: true,
          });
        });
        ret.onSuccess(() => {
          const geeResult = _this.state.senseInstance.getValidate();
          _this.props.onSuccess &&
            _this.props.onSuccess({
              challenge: geeResult.geetest_challenge,
              captcha_response: geeResult.geetest_validate,
              captcha_id: CONST.SENSE_ID,
            });
        });
        ret.onError((error) => {
          console.error(error);
          _this.props.onError && _this.props.onError(error);
        });
        this.setState({
          senseInstance: ret,
        });
      }
    );
  };

  // 执行验证
  sense() {
    this.state.senseInstance && this.state.senseInstance.verify();
  }
  execute() {
    this.sense();
  }
  // 重置验证
  reset() {
    this.state.senseInstance && this.state.senseInstance.reset();
  }
  render() {
    return <span />;
  }
}

export default Sense;
