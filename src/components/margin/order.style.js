export default (theme) => ({
  order: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "40px auto",
    "& h2": {
      ...theme.typography.display2,
      color: theme.palette.common.text,
      margin: "0 0 20px",
    },
    "& .g-table": {
      background: "none",
      "& .item": {
        color: theme.palette.common.text,
        border: 0,
        "& div": {
          "&:first-child": {
            padding: 0,
          },
        },
        "&:hover": {
          background: theme.palette.grey[50],
        },
      },
      "& .loading": {
        color: theme.palette.grey[500],
      },
    },
    "& .theader": {
      color: theme.palette.grey[500],
      borderBottom: `1px solid ${theme.palette.grey[100]}`,
      "& div": {
        "&:first-child": {
          padding: 0,
        },
      },
    },
    "& .tbody": {
      borderTop: 0,
      marginTop: 8,
      maxHeight: "calc(100vh - 267px)",
    },
  },
  order_header: {
    "& ul": {
      display: "flex",
      margin: "0 0 32px",
      flex: 1,
      "& li": {
        ...theme.typography.body1,
        minWidth: 70,
        margin: "0 48px 0 0",
        textAlign: "center",
        lineHeight: "32px",
        cursor: "pointer",
        "& a": {
          color: theme.palette.text.primary,
          display: "block",
          borderBottom: `1px solid ${theme.palette.common.white}`,
          "&:hover": {
            color: theme.palette.primary.main,
          },
        },
      },
      "& li.active a": {
        color: theme.palette.primary.main,
        fontWeight: "bold",
        borderBottom: `1px solid ${theme.palette.primary.main}`,
      },
    },
  },

  filter_wrapper: {
    "& button": {
      minHeight: 32,
      padding: 0,
    },
  },

  select: {
    boxShadow: theme.shadows[1],
    borderRadius: 2,
    padding: "2px 8px",
    height: 32,
    minWidth: 104,
    margin: "0 16px 0 0",
    "&:before, &:after": {
      display: "none",
    },
    "& svg": {
      width: 7,
      height: 7,
      borderLeft: `1px solid ${theme.palette.common.text}`,
      borderBottom: `1px solid ${theme.palette.common.text}`,
      transform: "rotate(-45deg)",
      right: 6,
      top: 10,
      fill: theme.palette.common.white,
    },
    "& select": {
      background: theme.palette.common.white,
    },
  },
  time_select: {
    padding: "6px 16px",
    boxShadow: theme.shadows[1],
    borderRadius: 2,
    cursor: "pointer",
    "& span": {
      padding: "0 8px",
      color: theme.palette.grey[500],
      borderRight: `1px solid ${theme.palette.grey[200]}`,
      "&:last-child": {
        border: 0,
      },
      "&.active": {
        color: theme.palette.common.text,
      },
    },
  },
  order_table_width: {
    "& div": {
      overflow: "hidden",
      flex: "0 0 12%",
      "&:nth-child(10n + 1)": {
        flex: "0 0 12%",
        padding: "0 !important",
      },
      "&:nth-child(10n + 2)": {
        flex: "0 0 7%",
        textAlign: "center",
      },
      "&:nth-child(10n + 3)": {
        flex: "0 0 8%",
      },
      "&:nth-child(10n + 4)": {
        flex: "0 0 7%",
        textAlign: "center",
      },
      "&:nth-child(10n)": {
        flex: " 0 0 6%",
        "& p": {
          justifyContent: "flex-start",
          padding: "0 0 0 10px",
        },
      },
      "&:last-child": {
        textAlign: "right",
      },
    },
  },
  order_table_width1: {
    "& div": {
      overflow: "hidden",
      flex: "0 0 12%",
      "&:nth-child(11n + 1)": {
        flex: "0 0 12%",
        padding: "0 !important",
      },
      "&:nth-child(11n + 2)": {
        flex: "0 0 6%",
        textAlign: "center",
      },
      "&:nth-child(11n + 3)": {
        flex: "0 0 8%",
      },
      "&:nth-child(11n + 4)": {
        flex: "0 0 6%",
        textAlign: "center",
      },
      "&:nth-child(11n + 9)": {
        flex: "0 0 12%",
        textAlign: "center",
      },
      "&:nth-child(11n + 10)": {
        textAlign: "center",
      },
      "&:nth-child(11n)": {
        flex: " 0 0 6%",
        "& p": {
          justifyContent: "flex-start",
          padding: "0 0 0 10px",
        },
      },
      "&:last-child": {
        textAlign: "right",
      },
    },
  },
  order_table_width2: {
    "& div": {
      "&:nth-child(10n + 8)": {
        flex: "0 0 30%",
      },
    },
  },
  order_table_width3: {
    "& div": {
      "&:nth-child(8n+1)": {
        flex: "0 0 15%",
      },
    },
  },
  action: {
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  },
  selectSymbol: {
    // margin: "20px 0 20px",
    display: "flex",
    justifyContent: "space-between",
    height: 32,
  },
  tabRoot: {
    minHeight: 34,
    margin: "0 0 20px",
    flex: 1,
  },
  tab: {
    ...theme.typography.body1,
    color: theme.palette.common.text,
    minWidth: 70,
    minHeight: 32,
    padding: 0,
    margin: "0 32px 0 0",
    "&.Mui-selected": {
      fontWeight: "bold",
    },
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  chooseSymbol: {
    display: "flex",
    alignItems: "center",
  },
  grey: {
    color: `${theme.palette.grey[500]} !important`,
  },
  cancel: {
    color: `${theme.palette.primary.main}  !important`,
    cursor: "pointer",
  },
  green: {
    color: `${theme.palette.up.main} !important`,
  },
  red: {
    color: `${theme.palette.down.main} !important`,
  },
  indicator: {
    transform: "scale(1,1)",
  },
  match_details: {
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
    "& div": {
      height: 40,
      display: "flex",
      alignItems: "center",
      color: theme.palette.grey[500],
      "&:nth-child(6n + 1)": {
        flex: "0 0 15%",
        padding: "0 0 0 20px",
      },
      "&:nth-child(6n + 2)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n + 3)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n + 4)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n + 5)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n)": {
        flex: 1,
      },
    },
  },
  plan_match_title: {
    display: "flex",
    "& div": {
      height: 40,
      display: "flex",
      alignItems: "center",
      color: theme.palette.grey[500],
      "&:nth-child(6n + 1)": {
        flex: "0 0 18%",
        padding: "0 0 0 20px",
      },
      "&:nth-child(6n + 2)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n + 3)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n + 4)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n + 5)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n)": {
        flex: 1,
      },
    },
  },
  match_info: {
    display: "flex",
    "& div": {
      height: 40,
      display: "flex",
      alignItems: "center",
      "&:nth-child(6n + 1)": {
        flex: "0 0 15%",
        padding: "0 0 0 20px",
      },
      "&:nth-child(6n + 2)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n + 3)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n + 4)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n + 5)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n)": {
        flex: 1,
      },
      "& span": {
        margin: "0 0 0 5px",
        color: theme.palette.grey[500],
      },
    },
  },
  plan_match_info: {
    display: "flex",
    "& div": {
      height: 40,
      display: "flex",
      alignItems: "center",
      "&:nth-child(6n + 1)": {
        flex: "0 0 18%",
        padding: "0 0 0 20px",
      },
      "&:nth-child(6n + 2)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n + 3)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n + 4)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n + 5)": {
        flex: "0 0 16%",
      },
      "&:nth-child(6n)": {
        flex: 1,
      },
      "& span": {
        margin: "0 0 0 5px",
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
  cancelBtn: {
    marginLeft: 25,
    height: 32,
  },
});
