export default (theme) => ({
  tokenList: {
    width: "100%",
    minWidth: 1040,
    maxWidth: 1200,
    margin: "24px auto 40px",
  },
  tokenType: {
    fontSize: 22,
    color: theme.palette.grey[800],
    height: 64,
    padding: "0",
  },
  tokenTypeItem: {
    position: "relative",
  },
  tokenTypeBtn: {
    fontSize: 20,
    padding: "9px 32px",
    fontWeight: 500,
    "&:hover": {
      background: theme.palette.common.white,
      color: theme.palette.primary.main,
    },
  },
  choose: {
    color: theme.palette.primary.main,
  },
  token_title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    background: theme.palette.background.part,
    padding: "0 16px 0 32px",
    position: "relative",
  },
  inputRoot: {
    flex: 1,
    padding: "0 5px",
    height: 36,
    width: 160,
    fontSize: 12,
    position: "relative",
    background: theme.palette.common.white,
    "& legend": {
      height: 0,
    },
    "& fieldset": {
      top: 0,
      border: `1px solid ${theme.palette.grey[100]} !important`,
      borderRadius: 4,
    },
    "& input": {
      color: theme.palette.common.text,
      fontSize: 14,
      padding: "0 10px 0 3px",
      height: "100%",
      caretColor: theme.palette.common.text,
      "&::placeholder": {
        color: theme.palette.grey[200],
        opacity: 1,
      },
    },
    "& i": {
      "&:last-of-type": {
        cursor: "pointer",
        color: theme.palette.grey[200],
        "&:hover": {
          color: theme.palette.grey[500],
        },
      },
      "&:first-of-type": {
        color: theme.palette.grey[200],
      },
    },
  },
  inputFocused: {
    "& fieldset": {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },
  tokens_arrow: {
    position: "absolute",
    border: "12px solid rgba(0,0,0,0)",
    borderBottom: `12px solid ${theme.palette.background.part}`,
    left: 62,
    bottom: -8,
    width: 0,
    height: 0,
    display: "block",
  },
  sort: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& span": {
      position: "relative",
      width: 12,
      height: 18,
    },
    "& em": {
      width: 0,
      height: 0,
      border: `4px solid transparent`,
      display: "block",
      position: "absolute",
      left: 3,
      "&:first-of-type": {
        borderBottom: `4px solid ${theme.palette.grey[200]}`,
        top: 0,
      },
      "&:last-of-type": {
        borderTop: `4px solid ${theme.palette.grey[200]}`,
        bottom: 0,
      },
      "&.active": {
        "&:first-of-type": {
          borderBottom: `4px solid ${theme.palette.primary.main}`,
        },
        "&:last-of-type": {
          borderTop: `4px solid ${theme.palette.primary.main}`,
        },
      },
    },
  },
  tokens: {
    display: "flex",
    alignItems: "center",
    "& div": {
      flex: 1,
      ...theme.typography.body1,
      color: theme.palette.common.text,
      whiteSpace: "nowrap",
      margin: "0 32px 0 0",
      cursor: "pointer",
      borderBottom: `1px solid rgba(0,0,0,0)`,
      "&.on": {
        ...theme.typography.subtitle1,
        color: theme.palette.primary.main,
        borderBottom: `1px solid ${theme.palette.primary.main}`,
      },
    },
    "& button": {
      height: 36,
      borderRadius: 4,
      color: theme.palette.grey[800],
      background: "transparent",
      fontSize: 16,
      margin: "0 24px 0 0",
      padding: "0 10px",
      minWidth: 80,
      fontWeight: "normal",
      "&:hover": {
        color: theme.palette.primary.main,
        background: "transparent",
      },
      "&.on": {
        color: theme.palette.common.white,
        background: theme.palette.primary.main,
        "&:hover": {
          color: theme.palette.common.white,
          background: theme.palette.primary.main,
        },
      },
    },
  },
  list_title: {
    display: "flex",
    height: 56,
    alignItems: "center",
    color: theme.palette.grey[500],
    "& >div": {
      "&:nth-child(27n+1)": {
        width: 32,
      },
      "&:nth-child(27n+2)": {
        flex: 3.8,
      },
      "&:nth-child(27n+3)": {
        flex: 3.6,
      },
      "&:nth-child(27n+4)": {
        flex: 2,
        // padding: "0 40px 0 0"
      },
      "&:nth-child(27n+5)": {
        flex: 3.6,
      },
      "&:nth-child(27n+6)": {
        flex: 3.6,
      },
      "&:nth-child(27n+7)": {
        flex: 3,
      },
      "&:nth-child(27n+8)": {
        flex: 3,
        padding: "0 16px 0 0",
      },
    },
  },
  order_table: {
    borderTop: `1px solid ${theme.palette.grey[50]}`,
    minHeight: 400,
    // maxHeight: 561,
    overflowY: "auto",
  },
  up: {
    color: theme.palette.up.main,
  },
  down: {
    color: theme.palette.down.main,
  },
  order_table_width: {
    display: "flex",
    width: "100%",
    color: theme.palette.common.text,
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
    height: 56,
    cursor: "pointer",
    "&:hover": {
      background: theme.palette.grey[50],
    },
    "& span": {
      color: theme.palette.grey[500],
    },
    "&  div": {
      display: "flex",
      alignItems: "center",
      padding: "0 !important",
      "&:nth-child(27n+1)": {
        width: 32,
        flex: "0 0 auto !important",
        justifyContent: "center",
        padding: "0 8px 0 0 !important",
        color: theme.palette.grey[200],
      },
      "&:nth-child(27n+2)": {
        flex: 3.8,
        "& em": {
          margin: "0 8px 0 0",
          padding: "0 3px",
          display: "inline-block",
          fontSize: 12,
          background: "transparent",
          borderRadius: 2,
          minWidth: 30,
          textAlign: "center",
        },
        "& span": {
          maxWidth: 34,
          height: 16,
          fontSize: 12,
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
      "&:nth-child(27n+3)": {
        flex: 3.6,
      },
      "&:nth-child(27n+4)": {
        flex: 2,
        // padding: "0 40px 0 0 !important",
        justifyContent: "flex-start",
      },
      "&:nth-child(27n+5)": {
        flex: 3.6,
      },
      "&:nth-child(27n+6)": {
        flex: 3.6,
      },
      "&:nth-child(27n+7)": {
        flex: 3,
      },
      "&:nth-child(27n+8)": {
        flex: 3,
        padding: "0 16px 0 0 !important",
        justifyContent: "flex-end",
      },
    },
  },
  nodata: {
    height: 400,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.grey[500],
    flexDirection: "column",
    "& img": {
      width: 64,
      margin: "0 0 10px",
    },
  },
  upTab: {
    color: theme.palette.down.main,
    border: `1px solid ${theme.palette.down.main}`,
  },
  downTab: {
    color: theme.palette.up.main,
    border: `1px solid ${theme.palette.up.main}`,
  },
});
