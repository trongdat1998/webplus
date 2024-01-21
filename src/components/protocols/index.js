import React from "react";
import { injectIntl } from "react-intl";
import styles from "./style";
import { withStyles } from "@material-ui/core/styles";

class Protocols extends React.Component {
  lang() {
    return (localStorage && localStorage.getItem("lang")) || "zh-cn";
  }
  render() {
    const { classes } = this.props;
    const s = classes;
    let lang = this.lang().toUpperCase();
    if (!this.props.match || !this.props.match.params.protocolType) {
      return null;
    }
    return "";
  }
}
export default withStyles(styles)(injectIntl(Protocols));
