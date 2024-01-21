export default theme => ({
  "@global": {
    html: {
      "&::-webkit-scrollbar": {
        width: 5,
        height: 5,
        backgroundColor: "transparent"
      },
      "&::-webkit-scrollbar-track": {
        width: 5,
        height: 5,
        backgroundColor: "transparent"
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(127, 143, 164, 0.6)",
        borderRadius: 5
      }
    }
  },
  chart: {
    position: "relative",
    zIndex: 1,
    overflow: "hidden",
    height: "100%",
    borderRadius: 2
  },
  exchange_light_bg: {
    backgroundColor: window.palette2.Light.grey[700],
  },
  exchange_bg: {
    backgroundColor: window.palette2.Dark.grey[700],
  },
  exchange: {
    width: "100%",
    display: "flex",
    alignItems: "stretch",
    padding: "4px 0 0",
    minWidth: 1280,
    height: "calc(100vh - 56px)",
    minHeight: 672,
    // backgroundColor: window.palette2.Dark.grey[700]
  },
//   exchange_light: {
//     backgroundColor: window.palette2.Light.grey[700]
//   },
  sidebar: {
    width: 210,
    padding: "0 2px 0 0",
    minHeight: "100%",
    overflow: "hidden"
  },
  content: {
    flex: 1,
    overflow: "hidden"
  },
  item: {
    display: "flex",
    margin: "0 0 4px",
    "&:last-child": {
      margin: 0
    }
  },
  left: {
    flex: 1,
    overflow: "hidden",
    height: "100%"
  },
  right: {
    // flex: "0 0 25%",
    padding: "0 0 0 4px",
    overflow: "hidden",
    width: 304,
    height: "100%"
  },
  left2: {
    flex: 1,
    overflow: "hidden",
  },
  right2: {
    // flex: "0 0 35%",
    // padding: "0 0 0 4px",
    // overflow: "hidden",
    display: "flex",
  },
  r11: {
    borderRadius: 2,
    width: "272px",
    overflow: "hidden",
    margin: "0 0 0 4px",
  },
  r12: {
    borderRadius: 2,
    margin: "0 0 0 4px",
    width: "272px",
    overflow: "hidden"
  },
  r13: {
    width: 548,
    margin: "0 0 0 4px",
    position: "relative"
  },
  r14: {
    borderRadius: 2,
    width: 0,
    overflow: "hidden",
    opacity: 0,
    transition: "all 0.2s",
    "&.open": {
      width: 272,
      opacity: 1,
      margin: "0 0 0 4px",
    }
  }
})  