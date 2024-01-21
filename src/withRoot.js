import React from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import data from "./theme_data";
import globalcss from "./theme_global";

// A theme with custom primary and secondary color.
// It's optional.
let d = data;
d.palette2 = window.palette2[localStorage.quoteMode];
const theme = createMuiTheme(d);

// 全局样式
const GlobalCss = withStyles(globalcss(theme))(() => null);

function withRoot(Component) {
  function ComponentWrapper(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <GlobalCss />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return ComponentWrapper;
}

export default withRoot;
