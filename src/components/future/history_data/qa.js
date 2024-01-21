import React from "react";
import classnames from "classnames";
import helper from "../../../utils/helper";
import { injectIntl } from "react-intl";
import WSDATA from "../../../models/data_source";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { Grid } from "@material-ui/core";
import CONST from "../../../config/const";

class MenuRC extends React.Component {
  constructor() {
    super();
  }
  render() {
    return <div>常见问题</div>;
  }
}

export default withStyles(styles)(injectIntl(MenuRC));
