const palette2 = window.palette2.Light;
export default (theme) => ({
  content: {
    display: "flex",
    width: 1200,
    margin: "32px auto 40px",
  },
  nav: {
    width: 280,
    overflow: "hidden",
  },
  con: {
    width: 920,
    padding: "0 16px 0 32px",
    "& h2": {
      fontSize: 24,
      textAlign: "center",
      padding: "16px 0 0",
      height: 64,
      color: theme.palette.grey[800],
      borderBottom: `1px solid ${theme.palette.grey[100]}`,
      margin: "0 0 32px",
    },
  },
  menu: {
    fontSize: 14,
    color: theme.palette.grey[800],
    lineHeight: "20px",
    "& div": {
      fontWeight: 700,
      display: "block",
      padding: "22px 0 0 24px",
      height: 64,
    },
    "& a": {
      display: "block",
      padding: "14px 0 0 24px",
      height: 48,
      width: "100%",
      color: theme.palette.grey[800],
      "&.on": {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
        "&:hover": {
          color: theme.palette.common.white,
        },
      },
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
    "& ul": {
      borderTop: `1px solid ${theme.palette.grey[100]}`,
    },
  },
  borderTop: {
    borderTop: `1px solid ${theme.palette.grey[100]}`,
  },
  item: {
    margin: "0 0 32px",
    fontSize: 14,
    lineHeight: "20px",
    color: theme.palette.grey[800],
    "& p": {
      margin: "0 0 10px",
    },
  },
  pageBtn: {
    display: "inline-block",
    height: 32,
    lineHeight: "32px",
    padding: "0 24px",
    fontWeight: 700,
    fontSize: 12,
    color: theme.palette.grey[700],
    border: `1px solid ${theme.palette.grey[100]}`,
    margin: "0 0 0 20px",
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  select: {
    border: `1px solid ${theme.palette.grey[100]}`,
    width: 240,
    height: 40,
    zIndex: 100,
    position: "relative",
    "&.on": {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  selectValue: {
    width: 240,
    height: 40,
    padding: "0 8px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    justifyContent: "space-between",
    "& i": {
      color: theme.palette.primary.main,
    },
  },
  selectOptions: {
    position: "absolute",
    display: "none",
    top: 38,
    left: -1,
    width: 240,
    maxHeight: 320,
    background: theme.palette.common.white,
    border: `1px solid ${theme.palette.primary.main}`,
    overflow: "hidden",
    "& ul": {
      maxHeight: 234,
      overflow: "auto",
    },
    "& li": {
      borderBottom: `1px solid ${theme.palette.grey[100]}`,
      color: theme.palette.grey[800],
      fontSize: 14,
      fontWeight: 500,
      height: 40,
      lineHeight: "40px",
      padding: "0 0 0 14px",
      cursor: "pointer",
      "&:hover": {
        background: theme.palette.grey[50],
      },
    },
    "&.on": {
      display: "block",
    },
  },
  selectSearch: {
    margin: "10px 0 10px 14px",
    width: 208,
  },
  selectSearchRoot: {
    borderRadius: 0,
    padding: "0 0 0 10px",
    "& i": {
      color: theme.palette.grey[200],
    },
  },
  selectSearchInput: {
    padding: "10px 10px 10px 3px",
  },
  table: {
    color: theme.palette.grey[800],
    fontSize: 14,
    lineHeight: "20px",
    borderTop: `1px solid ${theme.palette.grey[100]}`,
    borderLeft: `1px solid ${theme.palette.grey[100]}`,
    "& div": {
      borderRight: `1px solid ${theme.palette.grey[100]}`,
      borderBottom: `1px solid ${theme.palette.grey[100]}`,
      padding: "10px 16px 0",
      height: 40,
    },
  },
  kline_btns: {
    height: 24,
    borderBottom: `1px solid ${palette2.line}`,
    padding: "0 8px 0 0",
    fontSize: 12,
    color: palette2.grey[300],
    "& >div:first-of-type": {
      "& span": {
        minWidth: 48,
        textAlign: "center",
        height: 23,
        lineHeight: "23px",
        cursor: "pointer",
        marginTop: -1,
        "&:hover": {
          color: theme.palette.primary.main,
        },
        "&.selected": {
          color: theme.palette.primary.main,
          background: palette2.grey[700],
        },
      },
      "& p": {
        minWidth: 48,
        textAlign: "center",
      },
    },
    "& i": {
      margin: "0 8px 0 0",
      cursor: "pointer",
    },
  },
  chartype: {
    float: "right",
    display: "flex",
    alignItems: "center",
    height: "100%",
    "& span": {
      minWidth: "52px !important",
      height: "18px !important",
      lineHeight: "18px !important",
      padding: "1px 8px",
      border: `1px solid ${theme.palette2.grey[500]}`,
      color: theme.palette2.grey[300],
      fontSize: 12,
      borderRadius: 2,
      margin: "0 0 0 8px",
      cursor: "pointer",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        color: theme.palette.primary.main,
      },
      "&.choose": {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        background: theme.palette.primary.main,
      },
    },
  },
  kline: {
    border: `1px solid ${theme.palette.grey[100]}`,
    background: "#fff",
    position: "relative",
    height: "100%",
    width: "100%",
    zIndex: 1,
    "& iframe": {
      background: "#fff",
      "& .chart-page": {
        background: "red",
      },
    },
    "& .chart": {
      height: "calc(100% - 24px)",
    },
  },
  select1: {
    height: 23,
    position: "relative",
    cursor: "pointer",
    marginTop: -1,
    "&.selected": {
      background: palette2.grey[700],
      color: theme.palette.primary.main,
    },
    "& ul": {
      display: "none",
      position: "absolute",
      top: 23,
      right: "50%",
      transform: "translate(50%, 0)",
      background: palette2.background.paper,
      overflow: "hidden",
      width: "100%",
      borderRadius: 2,
      textAlign: "center",
      fontSize: 12,
    },
    "& li": {
      height: 24,
      lineHeight: "24px",
      color: palette2.grey[200],
      "&:hover": {
        background: palette2.grey[900],
      },
      "&.selected": {
        background: palette2.grey[900],
        color: theme.palette.primary.main,
      },
    },
    "& p": {
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& i": {
        margin: "0 -4px 0 0",
        color: palette2.grey[300],
        transform: "scale(0.5)",
        height: 10,
      },
    },
    "&:hover": {
      color: theme.palette.primary.main,
      "& ul": {
        display: "block",
      },
      "& p i": {
        transform: "rotate(180deg) scale(0.5)",
      },
    },
  },
});
