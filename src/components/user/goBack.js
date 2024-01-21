// 导航
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import { Iconfont } from "../../lib";

const styles = (theme) => ({
  icon: {},
  button: {
    width: "40px",
    height: "40px",
    background: theme.palette.common.background,
    color: theme.palette.common.text,
  },
});

class Nav extends React.Component {
  constructor() {
    super();
  }
  back = () => {
    window.history.back();
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.icon}>
        {/* <Fab onClick={this.back} aria-label="Add" className={classes.button}>
          <Iconfont type="prevPage" size="24" />
        </Fab> */}
      </div>
    );
  }
}

export default withStyles(styles)(Nav);
