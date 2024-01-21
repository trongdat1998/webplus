export default (theme) => ({
  financeCont: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "40px auto 48px",
  },
  leverFinanceWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    background: theme.palette.grey[50],
    borderRadius: 4,
  },
  leverAssets: {
    display: "flex",
    "& img": {
      width: "40px",
      height: "40px",
      marginRight: 112,
    },
  },
  leverAssetItem: {
    ...theme.typography.body2,
    height: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: "14px",
    marginRight: 12,
    minWidth: 248,
    "& label": {
      color: theme.palette.grey[500],
      fontSize: "14px",
    },
  },
  list: {
    "& .g-table": {
      background: theme.palette.common.white,
      margin: "20px 0 0",
      minHeight: 400,
      "& .theader": {
        color: theme.palette.grey[500],
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
        "& div:first-child": {
          padding: 0,
        },
        "& .action": {
          textAlign: "right",
          display: "block",
        },
      },
      "& .tbody": {
        borderTop: 0,
        marginTop: 12,
      },
      "& .item": {
        borderBottom: 0,
        color: theme.palette.text.primary,
        fontSize: 14,
        height: 40,
        "& div:first-child": {
          padding: 0,
        },
        "&:hover": {
          background: theme.palette.common.white,
        },
      },
      "& .loading": {
        color: theme.palette.grey[500],
      },
    },
    "& h3": {
      ...theme.typography.body1,
      color: theme.palette.secondary.contrastText,
      margin: "40px 0 0",
      "&:nth-of-type(1)": {
        margin: "20px 0 0",
      },
    },
  },
  right: {
    height: 33,
    display: "flex",
    alignItems: "center",
    "& p": {
      borderRight: `1px solid ${theme.palette.grey[100]}`,
      paddingRight: 24,
      marginRight: 24,
    },
    "& a": {
      color: theme.palette.primary.main,
    },
  },
  option_info: {
    height: 88,
    width: "100%",
    background: theme.palette.grey[50],
    borderRadius: 4,
    padding: 24,
    margin: "16px 0 20px",
    display: "flex",
    alignItems: "center",
    "& img": {
      width: 40,
      height: 40,
      borderRadius: "50%",
      marginRight: 110,
    },
    "& p": {
      flex: 1,
      "& label": {
        ...theme.typography.body2,
        color: theme.palette.grey[500],
        display: "block",
      },
      "& em": {
        ...theme.typography.body2,
        color: theme.palette.common.text,
      },
    },
    "& a": {
      minWidth: 40,
      cursor: "pointer",
      color: theme.palette.primary.main,
    },
  },
  topic: {
    display: "flex",
    margin: "40px 0 24px",
    height: 32,
    alignItems: "center",
    "& .second": {
      height: 32,
      display: "flex",
      alignItems: "center",
      flex: 1,
      "& a": {
        marginLeft: 15,
        color: theme.palette.primary.main,
        cursor: "pointer",
      },
    },
    "& .third": {
      "& i": {
        fontSize: 16,
      },
    },
  },

  action: {
    display: "flex",
    color: theme.palette.grey[500],
    "& a": {
      color: theme.palette.primary.main,
      fontSize: 12,
      fontWeight: "bold",
      cursor: "pointer",
    },
    "& div:last-child": {
      textAlign: "right",
    },
  },
  up: {
    color: theme.palette.up.main,
  },
  down: {
    color: theme.palette.down.main,
  },
  upTab: {
    margin: "0 0 0 8px",
    padding: "0 10px",
    fontSize: 12,
    display: "inline-block",
    color: theme.palette.common.white,
    background: `rgba(81, 211, 114, 0.8)`,
  },
  downTab: {
    margin: "0 0 0 8px",
    padding: "0 10px",
    fontSize: 12,
    display: "inline-block",
    color: theme.palette.common.white,
    background: `rgba(247, 58, 70, 0.8)`,
  },
  order_table_width: {
    "& div": {
      "&:nth-child(8n+1)": {
        minWidth: 200,
      },
      "&:nth-child(8n+2)": {
        minWidth: 90,
      },
      "&:nth-child(8n+3), &:nth-child(8n+4), &:nth-child(8n+5), &:nth-child(8n+6), &:nth-child(8n+7)": {
        minWidth: 130,
      },
      "&:last-child": {
        minWidth: 100,
        textAlign: "right",
      },
    },
  },
  order_table_ava_width: {
    "&>div": {
      flex: 1,
      minWidth: 200,
    },
  },
  icon: {
    color: theme.palette.grey[500],
    marginLeft: 10,
  },

  match_details: {
    padding: 0,
    background: theme.palette.grey[50],
    height: 0,
    opacity: 0,
    "&.on": {
      opacity: 1,
      transition: "height 0.2s, opacity 0.25s",
    },
  },
  match_title: {
    display: "flex",
    padding: "0 20px 0 0",
    "&>div": {
      height: 40,
      display: "flex",
      alignItems: "center",
      color: theme.palette.grey[500],
      flex: 1,
      "&:nth-child(7n + 1)": {
        flex: "0 0 20%",
        padding: "0 0 0 20px",
      },
    },
  },
  match_info: {
    display: "flex",
    padding: "0 20px 0 0",
    "&>div": {
      height: 40,
      display: "flex",
      alignItems: "center",
      flex: 1,
      "&:nth-child(7n + 1)": {
        flex: "0 0 20%",
        padding: "0 0 0 20px",
      },
      "&:nth-child(7n)": {
        justifyContent: "flex-end",
      },
      "& span": {
        margin: "0px",
        color: theme.palette.grey[500],
      },
    },
  },
  match_more: {
    margin: "10px auto",
    color: theme.palette.grey[500],
    cursor: "pointer",
    width: 100,
  },

  operate: {
    color: theme.palette.primary.main,
    cursor: "pointer",
    display: "flex",
    "& a[disabled]": {
      color: "grey",
      pointerEvents: "none",
    },
  },
  btn: {
    flex: 1,
    textAlign: "right",
    "& svg": {
      width: 12,
      height: 12,
    },
  },
  btnGroup: {
    "& a": {
      cursor: "pointer",
    },
  },
});
