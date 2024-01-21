// 支持中文的textfiled
import React from "react";
import { TextField } from "@material-ui/core";

class TextFieldCN extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempInput: this.props.value || "",
      focus: false
    };
    this.isOnComposition = false;
    this.emittedInput = true;
  }
  handleComposition = event => {
    if (event.type === "compositionstart") {
      this.isOnComposition = true;
      this.emittedInput = false;
    } else if (event.type === "compositionend") {
      this.isOnComposition = false;
      // fixed for Chrome v53+ and detect all Chrome
      // https://chromium.googlesource.com/chromium/src/+/afce9d93e76f2ff81baaa088a4ea25f67d1a76b3%5E%21/
      // also fixed for the native Apple keyboard which emit input event before composition event
      // subscribe this issue: https://github.com/facebook/react/issues/8683
      if (!this.emittedInput) {
        this.inputChange(event);
      }
    }
  };
  inputChange = e => {
    let userInputValue = e.target.value;
    if (!this.isOnComposition) {
      this.setState({
        tempInput: userInputValue
      });
      e.target.value = userInputValue;
      this.props.onChange && this.props.onChange(e);
      this.emittedInput = true;
    } else {
      this.setState({
        tempInput: userInputValue
      });
      this.emittedInput = false;
    }
  };
  onFocus = e => {
    this.setState({
      focus: true
    });
    this.props.onFocus && this.props.onFocus(e);
  };
  onBlur = e => {
    this.setState({
      focus: false
    });
    this.props.onBlur && this.props.onBlur(e);
  };
  componentDidUpdate(preProps) {
    if (preProps.value != this.props.value && !this.state.focus) {
      this.setState({
        tempInput: this.props.value
      });
    }
  }
  render() {
    const { value, onChange, onBlur, onFocus, ...otherProps } = this.props;
    return (
      <TextField
        value={this.state.tempInput}
        onCompositionStart={this.handleComposition}
        onCompositionEnd={this.handleComposition}
        onChange={this.inputChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        {...otherProps}
      />
    );
  }
}

export default TextFieldCN;
