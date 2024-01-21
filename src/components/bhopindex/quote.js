export default (theme) => ({
  tokenList: {
    width: "100%",
    minWidth: 1040,
    maxWidth: 1200,
    margin: "0 auto 50px",
    background: "#333c5a",
  },
  tokenType: {
    fontSize: 22,
    color: theme.palette.grey[800],
    height: 64,
    padding: "0 16px",
  },
  tokenTypeItem: {
    position: "relative",
  },
  tokenTypeBtn: {
    fontSize: 22,
    padding: "9px 32px",
    fontWeight: 500,
    "&:hover": {
      background: theme.palette.common.white,
      color: theme.palette.primary.main,
    },
  },
  token_title: {
    display: "flex",
    // justifyContent: "space-between",
    // alignItems: "center",
    height: 60,
    padding: "0 20px",
    position: "relative",
    borderBottom: "1px solid #424c6d",
    lineHeight: "60px",
    justifyContent: "center",
    alignItems: "center",
    "& >div": {
      textAlign: "center",
      cursor: "pointer",
      color: "#c4cad7",
      fontSize: 16,
      lineHeight: "22px",
      letterSpacing: "1.5px",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 15px",
      flex: 1,
      "& .title_item": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 10px",
        height: "100%",
        cursor: "pointer",
        borderBottom: "2px solid transparent",
      },
      "&.on .title_item": {
        color: "#2f7df6",
        borderBottom: "2px solid #2f7df6",
      },
      "&:last-child": {
        width: 230,
        flex: "0 0 auto",
        justifyContent: "flex-end",
      },
    },
    "& img": {
      width: 24,
      height: 24,
      margin: "0 10px 0 0",
    },
  },
  search_area: {
    width: "100%",
    height: "30px !important",
    padding: "0 !important",
    "& i": {
      color: "#67759f",
    },
    "& fieldset": {
      height: 30,
      top: 0,
      border: "1px solid #67759f !important",
      padding: "0 10px !important",
      "& legend": {
        display: "none",
      },
    },
    "& >div": {
      border: 0,
      height: 30,
    },
  },
  search_text: {
    height: 28,
    padding: "0 10px",
    color: theme.palette.common.white,
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
      "& img": {
        width: 24,
        height: 24,
        margin: "0 10px 0 0",
      },
    },
    "& button": {
      height: 36,
      borderRadius: 4,
      color: theme.palette.grey[800],
      background: "transparent",
      fontSize: 18,
      margin: "0 24px 0 0",
      padding: "0 10px",
      minWidth: 80,
      fontWeight: "normal",
      "&.on": {
        color: theme.palette.common.white,
        background: theme.palette.primary.main,
      },
      "&:hover": {
        color: theme.palette.common.white,
        background: theme.palette.primary.main,
      },
    },
  },
  list_title: {
    display: "flex",
    height: 40,
    color: "#616f82",
    "& .sort": {
      position: "relative",
      justifyItems: "center",
      height: "100%",
      alignItems: "center",
      border: 0,
      display: "flex",
      cursor: "pointer",
      color: "#9ca5b0",
      "& span": {
        position: "relative",
        width: 10,
        height: 16,
      },
      "& em": {
        width: 0,
        height: 0,
        border: `3px solid transparent`,
        display: "block",
        position: "absolute",
        left: 3,
        "&:first-of-type": {
          borderBottom: `4px solid #9ca5b0`,
          top: 0,
        },
        "&:last-of-type": {
          borderTop: `4px solid #9ca5b0`,
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
    "& >div": {
      "&:nth-child(27n+1)": {
        width: "4%",
      },
      "&:nth-child(27n+2)": {
        width: "12%",
      },
      "&:nth-child(27n+3)": {
        width: "14%",
      },
      "&:nth-child(27n+4)": {
        width: "10%",
        padding: "0 50px 0 0",
        "& .sort": {
          justifyContent: "flex-end",
        },
      },
      "&:nth-child(27n+5), &:nth-child(27n+6)": {
        width: "14%",
        padding: "0 0 0 50px",
      },
      "&:nth-child(27n+7), &:nth-child(27n+8)": {
        width: "14%",
        "& .sort": {
          justifyContent: "flex-end",
        },
      },
    },
  },
  list_item: {},
  order_table: {
    borderTop: "1px solid #424c6d",
    minHeight: 400,
  },
  order_table_width: {
    display: "flex",
    width: "100%",
    color: theme.palette.common.white,
    borderBottom: "1px solid #424c6d",
    height: 50,
    cursor: "pointer",
    "&:hover": {
      background: "#2b3555",
    },
    "& span": {
      color: theme.palette.grey[500],
    },
    "&  >div": {
      display: "flex",
      alignItems: "center",
      // padding: "0 !important",
      height: "100%",
      "&:nth-child(27n+1)": {
        flex: "0 0 4%",
        //   justifyContent: "center",
        padding: "0 !important",
        //   color: theme.palette.grey[200]
      },
      "&:nth-child(27n+2)": {
        flex: "0 0 12%",
      },
      "&:nth-child(27n+3)": {
        flex: "0 0 14%",
      },
      "&:nth-child(27n+4)": {
        flex: "0 0 10%",
        textAlign: "right",
        "& div": {
          padding: "0 50px 0 0",
          justifyContent: "flex-end",
          display: "flex",
          flex: 1,
        },
      },
      "&:nth-child(27n+5), &:nth-child(27n+6)": {
        flex: "0 0 14%",
        padding: "0 0 0 50px",
      },
      "&:nth-child(27n+7), &:nth-child(27n+8)": {
        flex: "0 0 14%",
        textAlign: "right",
        justifyContent: "flex-end",
      },
    },
    "& .up": {
      color: theme.palette.up.main,
      "& span": {
        color: theme.palette.up.main,
      },
    },
    "& .down": {
      color: theme.palette.down.main,
      "& span": {
        color: theme.palette.down.main,
      },
    },
    "& i": {
      fontSize: 14,
      margin: "0 0 0 3px",
      width: 7,
      height: 14,
      display: "block",
    },
  },
  fav: {
    width: 35,
    alignItems: "center",
    display: "flex",
    padding: "0 0 0 20px",
    justifyContent: "flex-start",
    "& i": {
      color: "#67759f",
      cursor: "pointer",
      margin: "-5px 0 0",
    },
    "& i.choose": {
      color: theme.palette.primary.main,
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
});
