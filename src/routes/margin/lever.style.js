export default (theme) => ({
  "@global": {
    html: {
      "&::-webkit-scrollbar": {
        width: 5,
        height: 5,
        backgroundColor: "transparent",
      },
      "&::-webkit-scrollbar-track": {
        width: 5,
        height: 5,
        backgroundColor: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(127, 143, 164, 0.6)",
        borderRadius: 5,
      },
    },
  },

  chart: {
    position: "relative",
    zIndex: 1,
    overflow: "hidden",
    height: 360,
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
    padding: "6px 0",
    minWidth: 1280,
    height: 692,
    backgroundColor: window.palette2.Dark.grey[700],
  },
  exchange_light: {
    backgroundColor: window.palette2.Light.grey[700],
  },
  sidebar: {
    width: 306,
    padding: "0 6px 0 0",
    height: "100%",
    minHeight: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    height: "100%",
  },
  item: {
    display: "flex",
    margin: "0 0 6px",
    height: "100%",
  },

  left: {
    flex: "0 0 68%",
    overflow: "hidden",
    // background: @bg001;
    height: "100%",
  },

  right: {
    flex: "0 0 32%",
    padding: "0 0 0 6px",
    overflow: "hidden",
    height: "100%",
  },
  left2: {
    flex: "0 0 62%",
    overflow: "hidden",
    // background: @bg001;
    height: "100%",
  },

  right2: {
    flex: "0 0 38%",
    padding: "0 0 0 6px",
    overflow: "hidden",
    display: "flex",
    height: "100%",
  },

  h450: {
    height: 514,
  },
  h320: {
    height: 320,
  },
  r11: {
    borderRadius: 2,
    width: "100%",
    overflow: "hidden",
  },
  r12: {
    borderRadius: 2,
    margin: "0 0 0 6px",
    width: "100%",
    overflow: "hidden",
  },

  tip_dialog: {
    "& > div": {
      maxWidth: 560,
    },
  },
  tip_dialog_title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tip_title: {
    color: "#242B32",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "bold",
  },
  tip_close_btn: {
    position: "absolute",
    top: 5,
    right: 12,
  },
  tip_action: {
    margin: "24px",
    display: "flex",
    justifyContent: "space-between",
    "& button": {
      ...theme.typography.button,
      width: 152,
      height: 40,
      color: theme.palette.common.white,
    },
  },
  tip_content: {
    padding: "16px 24px !important",
    ...theme.typography.body2,
    color: theme.palette.grey[800],
    fontSize: 14,
    lineHeight: "20px",
    border: "1px solid #f4f4f5",
    "& a": {
      color: theme.palette.primary.main,
    },
  },
  tip_detail: {
    width: "100%",
    height: 208,
    marginTop: "8px",
  },
  tip_checkbox_label: {
    color: theme.palette.common.text,
    fontSize: "12px",
    lineHeight: "16px",
  },
  tip_btn: {
    width: 152,
    height: 40,
    borderRadius: 4,
  },
});
