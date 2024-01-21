/**
 * 发送验证码
 */
import React from "react";
import { Button } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

class VerificationCode extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      timer: null,
      count: 60,
      initText: <FormattedMessage id="发送验证码" />
    };
    this.click = this.click.bind(this);
    this.change = this.change.bind(this);
  }
  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }
  click(e) {
    if (this.state.loading || !this.props.value) return;
    this.setState(
      {
        loading: true,
        count: 60,
        timer: setTimeout(this.change, 1000)
      },
      () => {
        this.props.onClick(e);
      }
    );
  }
  async start() {
    if (this.state.loading || !this.props.value) return;
    await this.reset();
    await this.setState({
      loading: true,
      count: 60,
      timer: setTimeout(this.change, 1000)
    });
  }
  change() {
    let count = this.state.count;
    count--;
    if (count < 0) {
      this.setState({
        loading: false,
        count: 60,
        timer: null
      });
    } else {
      this.setState({
        loading: true,
        count,
        timer: setTimeout(this.change, 1000)
      });
    }
  }
  async reset() {
    clearTimeout(this.state.timer);
    await this.setState({
      loading: false,
      count: 60,
      timer: null
    });
  }
  render() {
    const style = this.props.style ? this.props.style : {};
    return (
      <Button
        disabled={this.state.loading || !this.props.value ? true : false}
        onClick={this.click}
        className={this.props.className}
        type="button"
        style={{ whiteSpace: "nowrap", ...style }}
        color={this.props.color ? this.props.color : "primary"}
        variant={this.props.variant ? this.props.variant : "contained"}
        size={this.props.size || "small"}
      >
        {this.state.loading ? this.state.count + "s" : this.state.initText}
      </Button>
    );
  }
}

export default VerificationCode;
