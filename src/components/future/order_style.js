import helper from "../../utils/helper";
export default (theme) => ({
  qplayer: {
    background: helper.hex_to_rgba(theme.palette.primary.main, 0.05),
    color: theme.palette.grey[800],
    borderBottom: `1px solid ${theme.palette.common.white}`,
    lineHeight: "32px",
    padding: "0 16px",
  },
  qpdesc: {
    color: theme.palette.grey[800],
    fontSize: 12,
  },
  order: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "40px auto",
    "& >h2": {
      ...theme.typography.display2,
      color: theme.palette.secondary.contrastText,
      margin: "0 0 20px",
    },
    "& .g-table": {
      background: theme.palette.common.white,
      "& .theader": {
        color: theme.palette.grey[500],
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
        "& div:first-child": {
          padding: 0,
        },
      },
      "& .tbody": {
        borderTop: 0,
        marginTop: 8,
        maxHeight: "calc(100vh - 267px)",
      },
      "& .item": {
        borderBottom: 0,
        color: theme.palette.text.primary,
        fontSize: 14,
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
  },
  order_header: {
    display: "flex",
    "& ul": {
      display: "flex",
      margin: "0 0 20px",
      flex: 1,
      "& li": {
        ...theme.typography.body1,
        minWidth: 70,
        margin: "0 32px 0 0",
        textAlign: "center",
        lineHeight: "34px",
        cursor: "pointer",
        "& a": {
          color: theme.palette.text.primary,
          display: "block",
          borderBottom: `2px solid ${theme.palette.common.white}`,
          height: 34,
          "&:hover": {
            color: theme.palette.primary.main,
          },
        },
      },
      "& li.active a": {
        color: theme.palette.primary.main,
        fontWeight: "bold",
        borderBottom: `2px solid ${theme.palette.primary.main}`,
      },
    },
  },
  action_position: {
    height: 32,
    display: "flex",
    "& button": {
      minHeight: 32,
      padding: 0,
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
  select: {
    boxShadow: theme.shadows[1],
    borderRadius: 2,
    padding: "2px 8px",
    height: 32,
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
  up: {
    color: theme.palette.up.main,
  },
  down: {
    color: theme.palette.down.main,
  },
  upTab: {
    background: `rgba(81, 211, 114, 0.8)`,
  },
  downTab: {
    background: `rgba(247, 58, 70, 0.8)`,
  },
  operate: {
    color: theme.palette.primary.main,
    cursor: "pointer",
  },
  // 持仓
  custom_order: {
    "& ul": {
      "& li": {
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
        padding: "0 0 16px",
        margin: "0 0 16px",
      },
    },
    "& .first": {
      flex: 1.48,
      marginRight: 24,
    },
    "& .second": {
      flex: 1.36,
      marginRight: 24,
    },
    "& .three": {
      flex: 1,
      marginRight: 32,
    },
    "& .four": {
      flex: 1,
    },
    "& .order_item": {
      height: 24,
      "& i": {
        color: theme.palette.primary.main,
        fontWeight: 700,
      },
    },
    "& label": {
      color: theme.palette.grey[500],
    },
  },
  noBorder: {
    border: 0,
  },
  order_table_width: {
    "& div": {
      minWidth: 72,
      "&:nth-child(7n+1), &:nth-child(7n+2)": {
        minWidth: 120,
      },
      "&:last-child": {
        minWidth: 200,
      },
    },
  },
  order_table_width1: {
    "& div": {
      flex: "none !important",
      width: 176,
    },
  },
  position_table_width: {
    "& div": {
      minWidth: 90,
      "&:nth-child(9n+1)": {
        width: 100,
        flex: "0 0 auto",
      },
      "&:nth-child(9n+2)": {
        width: 60,
        flex: "0 0 auto",
      },
      "&:nth-child(9n+3)": {
        width: 60,
        flex: "0 0 auto",
      },
      "&:last-child": {
        width: 80,
        textAlign: "right",
        flex: "0 0 auto",
      },
    },
  },
  current_table_width: {
    paddingRight: 10,
    "& div": {
      "&:nth-child(12n+1)": {
        width: 120,
        flex: "0 0 auto",
      },
      "&:nth-child(12n+2)": {
        width: 160,
        flex: "0 0 auto",
      },
      "&:nth-child(12n+4)": {
        width: 50,
        flex: "0 0 auto",
      },
      "&:nth-child(12n+3)": {
        width: 50,
        flex: "0 0 auto",
      },
      "&:nth-child(12n+5)": {
        width: 70,
        flex: "0 0 auto",
      },
      "&:last-child": {
        width: 60,
        textAlign: "right",
        flex: "0 0 auto",
      },
    },
  },
  current_table_width2: {
    paddingRight: 10,
    "& div": {
      "&:nth-child(12n+1)": {
        width: 120,
        flex: "0 0 auto",
      },
      "&:nth-child(12n+2)": {
        width: 160,
        flex: "0 0 auto",
      },
      "&:last-child": {
        width: 60,
        textAlign: "right",
        flex: "0 0 auto",
      },
    },
  },
  // 历史委托
  history_table_width: {
    paddingRight: 10,
    "& div": {
      minWidth: 72,
      "&:nth-child(12n+1)": {
        minWidth: 120,
      },
      "&:nth-child(12n+2)": {
        minWidth: 120,
      },
      "&:nth-child(12n+3)": {
        minWidth: 32,
      },
      "&:nth-child(12n+4), &:nth-child(12n+11)": {
        minWidth: 64,
      },
      "&:nth-child(13n+5), &:nth-child(13n+12)": {
        minWidth: 64,
      },
      "&:nth-child(13n+6)": {
        minWidth: 130,
      },
      "&:nth-child(13n+7)": {
        minWidth: 160,
      },
      "&:last-child": {
        minWidth: 40,
        textAlign: "right",
      },
    },
  },

  // 历史止盈止损委托
  history_table_width_loss: {
    paddingRight: 10,
    "& div": {
      minWidth: 72,
      "&:nth-child(12n+1)": {
        minWidth: 120,
      },
      "&:nth-child(12n+2)": {
        minWidth: 160,
      },
      "&:nth-child(12n+3)": {
        minWidth: 32,
      },
      "&:nth-child(12n+4), &:nth-child(12n+11)": {
        minWidth: 64,
      },
      "&:nth-child(13n+5), &:nth-child(13n+12)": {
        minWidth: 64,
      },
      "&:last-child": {
        width: 100,
        flex: "0 0 auto",
        textAlign: "right",
      },
    },
  },
  // 历史成交
  history_trade_table_width: {
    paddingRight: 10,
    "& div": {
      minWidth: 72,
      "&:nth-child(7n+1), &:nth-child(6n+2)": {
        minWidth: 120,
      },
      "&:last-child": {
        minWidth: 200,
      },
    },
  },
  menuItem: {
    height: 32,
    padding: "0 16px",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  match_details: {
    padding: "0 30px",
    border: 0,
    height: 0,
    opacity: 0,
    background: theme.palette.common.background,
    "&.on": {
      opacity: 1,
      transition: "height 0.2s, opacity 0.25s",
    },
  },
  match_title: {
    display: "flex",
    "& div": {
      fontSize: 12,
      height: 40,
      display: "flex",
      alignItems: "center",
      color: theme.palette.grey[500],
      "&:nth-child(6n + 1)": {
        flex: "0 0 19%",
      },
      "&:nth-child(6n + 2)": {
        flex: "0 0 12%",
      },
      "&:nth-child(6n + 3)": {
        flex: "0 0 12%",
      },
      "&:nth-child(6n + 4)": {
        flex: "0 0 15%",
      },
      "&:nth-child(6n + 5)": {
        flex: "0 0 15%",
      },
      "&:nth-child(6n)": {
        flex: 1,
      },
    },
  },
  match_title_loss: {
    display: "flex",
    "& div": {
      fontSize: 12,
      height: 40,
      display: "flex",
      alignItems: "center",
      color: theme.palette.grey[500],
      flex: 1,
      "&:nth-child(12n+1)": {
        minWidth: 120,
      },
      "&:nth-child(12n+2)": {
        minWidth: 160,
      },
      "&:nth-child(12n+3)": {
        minWidth: 32,
      },
      "&:nth-child(12n+4), &:nth-child(12n+11)": {
        minWidth: 64,
      },
      "&:nth-child(13n+5), &:nth-child(13n+12)": {
        minWidth: 64,
      },
      "&:last-child": {
        minWidth: 40,
        textAlign: "right",
      },
    },
  },
  match_info: {
    display: "flex",
    "& div": {
      fontSize: 12,
      height: 40,
      display: "flex",
      alignItems: "center",
      borderTop: `1px solid ${theme.palette.grey[100]}`,
      fontSize: 14,
      "&:nth-child(6n + 1)": {
        flex: "0 0 19%",
      },
      "&:nth-child(6n + 2)": {
        flex: "0 0 12%",
      },
      "&:nth-child(6n + 3)": {
        flex: "0 0 12%",
      },
      "&:nth-child(6n + 4)": {
        flex: "0 0 15%",
      },
      "&:nth-child(6n + 5)": {
        flex: "0 0 15%",
      },
      "&:nth-child(6n)": {
        flex: 1,
      },
      "& span": {
        margin: "0 0 0 5px",
      },
    },
  },
  match_info_loss: {
    display: "flex",
    "& div": {
      fontSize: 12,
      height: 40,
      display: "flex",
      alignItems: "center",
      borderTop: `1px solid ${theme.palette.grey[100]}`,
      fontSize: 14,
      flex: 1,
      "&:nth-child(12n+1)": {
        minWidth: 120,
      },
      "&:nth-child(12n+2)": {
        minWidth: 160,
      },
      "&:nth-child(12n+3)": {
        minWidth: 32,
      },
      "&:nth-child(12n+4), &:nth-child(12n+11)": {
        minWidth: 64,
      },
      "&:nth-child(13n+5), &:nth-child(13n+12)": {
        minWidth: 64,
      },
      "&:last-child": {
        minWidth: 40,
        textAlign: "right",
      },
      "& span": {
        margin: "0 0 0 5px",
      },
    },
  },
  goto: {
    color: theme.palette.primary.main,
  },
});
