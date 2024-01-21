import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./tooltip_style";
import { Tooltip } from "@material-ui/core";

class TooltipCommon extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {
      classes,
      title,
      placement,
      children,
      mode, //true,false; true为行情页专用，false为白色通用版
      open,
      value, // slider组件专用
      ...otherProps
    } = this.props;
    // 白色通用版
    let classesOpt = {
      arrow: classes.arrow,
      tooltip: classes.tooltip,
    };
    // 行情页专用
    if (mode) {
      classesOpt = {
        arrow: classes.modeArrow,
        tooltip: classes.modeTooltip,
      };
    }
    // 行情页slider组件专用
    if (value) {
      classesOpt = {
        arrow: classes.silderArrow,
        tooltip: classes.silderTooltip,
      };
    }
    return (
      <Tooltip
        title={value ? value : title}
        classes={classesOpt}
        placement={placement || "top"}
        arrow
        open={open}
        enterTouchDelay={0}
        {...otherProps}
      >
        {children}
      </Tooltip>
    );
  }
}
TooltipCommon.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(injectIntl(TooltipCommon));
