// 导航
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Fab } from "@material-ui/core";
import { Iconfont } from "../../lib";

const styles = (theme) => ({
  nav: {
    display: "flex",
    width: "100%",
    height: "40px",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "48px auto 23px",
  },
  back: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    margin: " 0 32px 0 0",
  },
  button: {
    width: "40px",
    height: "40px",
    background: theme.palette.common.background,
    color: theme.palette.common.text,
  },
  title: {
    ...theme.typography.heading,
    color: theme.palette.common.text,
    lineHeight: "30px",
  },
});

class Nav extends React.Component {
  constructor() {
    super();
    this.back = this.back.bind(this);
  }
  back() {
    window.history.back();
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.nav}>
        <div className={classes.back}>
          {/* <div className={classes.icon}>
            <Fab
              onClick={this.back}
              // variant="fab"
              aria-label="Add"
              className={classes.button}
            >
              <Iconfont type="prevPage" size="24" />
            </Fab>
          </div> */}
          <div className={classes.title}>{this.props.title}</div>
        </div>
        <div className={classes.side}>{this.props.side}</div>
      </div>
    );
  }
}

export default withStyles(styles)(Nav);
