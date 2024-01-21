import helper from "../../../utils/helper";
export default (theme) => ({
  tokenList: {
    width: "100%",
    background: theme.palette2.background.paper,
    height: "100%",
    borderRadius: 2,
  },
  token_title: {
    // display: "flex",
    padding: "8px 0 0",
    margin: "0 8px 0 16px",
    height: 40,
    // lineHeight: "24px",
    whiteSpace: "nowrap",
    overflowX: "auto",
    overflowY: "hidden",
    "& span": {
      color: theme.palette2.grey[200],
      margin: "0 16px 0 0",
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: "22px",
      display: "inline-block",
      borderBottom: "2px solid transparent",
      cursor: "pointer",
      "&:last-of-type": {
        margin: 0,
      },
      "&.on": {
        color: theme.palette.primary.main,
        borderBottom: `2px solid ${theme.palette.primary.main}`,
      },
    },
  },
  search: {
    // height: 28,
    // padding: "0 8px 0 16px",
    // display: "flex",
    // alignItems: "center",
    // color: theme.palette2.grey[300],
    // margin: "4px 0 8px"
    flex: 1,
    display: "block",
  },
  inputroot: {
    flex: 1,
    padding: "0 4px",
    height: 28,
    width: 128,
    float: "right",
    "& legend": {
      height: 0,
    },
    "& fieldset": {
      top: 0,
      border: `1px solid ${theme.palette2.grey[500]} !important`,
      borderRadius: 2,
    },
    "& input": {
      color: theme.palette2.white,
      fontSize: 12,
      padding: "0 5px 0 0",
      height: "100%",
      boxSizing: "border-box",
      caretColor: theme.palette.primary.main,
      "&::placeholder": {
        color: theme.palette2.grey[300],
        opacity: 1,
      },
    },
    "& i": {
      "&:last-of-type": {
        cursor: "pointer",
        color: theme.palette2.grey[500],
        right: 6,
        "&:hover": {
          color: theme.palette2.grey[300],
        },
      },
      "&:first-of-type": {
        color: theme.palette2.grey[300],
      },
    },
  },
  inputfocused: {
    // backgroundColor: theme.palette2.grey[700],
    backgroundColor: "transparent",
    "& fieldset": {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },
  trans_switch: {
    color: theme.palette2.grey[300],
    margin: "0 0 0 12px",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "&.on": {
      color: theme.palette.primary.main,
    },
  },
  list_type: {
    height: 48,
    width: "100%",
    borderBottom: `1px solid ${helper.hex_to_rgba(
      theme.palette2.grey[500],
      0.5
    )}`,
    color: theme.palette2.grey[200],
    fontSize: 14,
    display: "flex",
    padding: "0 24px",
    alignItems: "center",
    "& span": {
      margin: "0 16px 0 0",
      height: 48,
      lineHeight: "48px",
      cursor: "pointer",
    },
  },
  check: {
    color: theme.palette2.white,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  list_title: {
    height: 40,
    display: "flex",
    color: theme.palette2.grey[300],
    fontSize: 12,
    letterSpacing: "0.004em",
    padding: "0 24px",
  },
  list_item: {
    width: 96,
    "& .hoc_title": {
      position: "relative",
      display: "flex",
      justifyItems: "center",
      height: "100%",
      justifyContent: "flex-end",
      alignItems: "center",
      border: 0,
      "& span": {
        top: -8,
        right: -2,
        position: "relative",
        display: "block",
      },
      "& i": {
        color: theme.palette2.grey[500],
        position: "absolute",
        left: -14,
        fontSize: 12,
        transform: "scale(0.5)",
        "&:nth-child(2n + 1)": {
          top: -4,
        },
        "&:nth-child(2n)": {
          top: 4,
        },
      },
      "& div": {
        cursor: "pointer",
        fontSize: 12,
        padding: "0 12px 0 0",
        lineHeight: "16px",
      },
    },
    "& .hoc_choose": {
      "& span.up i:nth-child(2n)": {
        color: `${theme.palette.primary.main} !important`,
      },
      "& span.down i:nth-child(2n + 1)": {
        color: `${theme.palette.primary.main} !important`,
      },
    },
    "&:nth-of-type(1)": {
      width: 144,
      "& .hoc_title": {
        justifyContent: "flex-start",
      },
    },
    "&:nth-of-type(2)": {
      width: 80,
    },
    "&:nth-of-type(4)": {
      width: 112,
    },
  },
  list_data: {
    overflowY: "auto",
    overflowX: "hidden",
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
  info: {
    margin: 0,
  },
  item: {
    height: "auto !important",
    lineHeight: "16px",
    padding: "4px 24px",
    background: theme.palette2.background.paper,
    cursor: "pointer",
    alignItems: "center",
    display: "flex",
    fontWeight: "normal !important",
    minHeight: 40,
    "& div": {
      textAlign: "right",
      color: theme.palette2.white,
      fontSize: 12,
      width: 96,
      "&:nth-of-type(1)": {
        textAlign: "left",
        whiteSpace: "nowrap",
        overflow: "hidden",
        display: "flex",
        width: 144,
        "& span": {
          maxWidth: 34,
          height: 16,
          overflow: "hidden",
          lineHeight: "16px",
          borderRadius: "2px",
          display: "flex",
          alignItems: "center",
          marginLeft: 4,
          padding: "0 2px",
          textAlign: "center",
          color: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.main}`,
          fontWeight: "500",
        },
      },
      "&:nth-of-type(2)": {
        width: 80,
      },
      "&:nth-of-type(4)": {
        width: 112,
      },
    },
    "&:hover": {
      background: theme.palette2.background.list,
    },
  },
  item_on: {
    background: theme.palette2.background.list,
  },
  up: {
    color: theme.palette.up.main,
  },
  down: {
    color: theme.palette.down.main,
  },
  fav: {
    display: "flex",
    alignItems: "center",
    "& i": {
      color: theme.palette2.grey[500],
      margin: "0 8px 0 0",
    },
  },
  choose: {
    color: `${theme.palette.primary.main} !important`,
  },
  finance: {
    background: theme.palette2.grey[900],
    padding: "5px 8px 5px 16px",
    color: theme.palette2.grey[300],
    fontSize: 12,
    lineHeight: "16px",
    borderBottom: `1px solid ${theme.palette2.line}`,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    minHeight: 50,
    "& p": {
      "&:first-of-type": {
        display: "flex",
        alignItems: "center",
      },
      "&:last-of-type": {
        fontWeight: 500,
        margin: "-1px 0 0",
        "& span": {
          color: theme.palette2.grey[100],
        },
      },
    },
    "& i": {
      cursor: "pointer",
    },
  },
  noresult: {
    color: theme.palette2.grey[300],
    fontSize: 14,
    lineHeight: "20px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    margin: "152px 0 0",
    "& img": {
      width: 40,
      height: 40,
    },
    "& p": {
      margin: "16px 0 0",
    },
  },
});
