import helper from "../../utils/helper";

export default (theme) => ({
  title_desc: {
    margin: "10px 0 5px",
    padding: "10px 0 0",
    borderTop: `1px solid ${theme.palette.grey[50]}`,
  },
  profit_show: {},
  profit_hide: {
    color: theme.palette.grey[500],
  },
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
  ul_desc: {
    fontSize: 12,
    lineHeight: "16px",
    listStyle: "decimal",
    padding: "0 0 0 20px",
    color: theme.palette.grey[800],
  },
  labelPlacementStart: {
    marginLeft: 0,
  },
  trade_order: {
    margin: "0 auto 2px",
    padding: "8px 0",
    background: "#1E2430",
    height: 420,
    // minWidth: 1200,
    "& >h2": {
      ...theme.typography.display2,
      color: theme.palette.secondary.contrastText,
      margin: "0 0 40px",
    },
    "& .g-table": {
      background: "#1E2430",
      height: 330,
      "& .theader": {
        padding: "0 40px",
        color: theme.palette.grey[800],
        borderBottom: `1px solid ${theme.palette.common.text}`,
        minHeight: 40,
        "& div:first-child": {
          padding: 0,
        },
      },
      "& .tbody": {
        borderTop: 0,
        marginTop: 8,
        padding: "0 40px",
        // height: 333
      },
      "& .item": {
        borderBottom: 0,
        color: theme.palette.grey[500],
        fontSize: 14,
        "& div:first-child": {
          padding: 0,
        },
        "&:hover": {
          background: "#1E2430",
        },
      },
      "& .loading": {
        color: theme.palette.grey[500],
      },
      "& .noresult": {
        minHeight: 282,
      },
    },
  },
  order_header: {
    display: "flex",
    padding: "0 40px",
    "& ul": {
      display: "flex",
      margin: "0 0 4px",
      flex: 1,
      "& li": {
        ...theme.typography.body1,
        minWidth: 70,
        margin: "0 48px 0 0",
        textAlign: "center",
        lineHeight: "32px",
        cursor: "pointer",
        "& a": {
          color: theme.palette.grey[500],
          display: "block",
          padding: "16px 0",
          borderBottom: `1px solid #1E2430`,
          "&:hover": {
            color: theme.palette.common.white,
          },
        },
      },
      "& li.active a": {
        color: theme.palette.common.white,
        // fontWeight: "bold",
        borderBottom: `1px solid ${theme.palette.common.white}`,
      },
    },
  },
  action_position: {
    height: 32,
    display: "flex",
    padding: "16px 0",
    "& button": {
      ...theme.typography.body2,
      minHeight: 32,
      padding: 0,
      color: theme.palette.primary.main,
      marginLeft: 48,
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
  selectType: {
    boxShadow: theme.shadows[1],
    borderRadius: 2,
    padding: "2px 8px",
    height: 30,
    margin: 0,
    color: theme.palette2.grey[200],
    fontSize: 12,
    "&:before, &:after": {
      display: "none",
    },
    "& svg": {
      width: 6,
      height: 6,
      borderLeft: `1px solid ${theme.palette2.grey[200]}`,
      borderBottom: `1px solid ${theme.palette2.grey[200]}`,
      transform: "rotate(-45deg)",
      right: 5,
      top: 10,
      fill: theme.palette.common.black,
    },
    "& select": {
      background: theme.palette.common.black,
      color: theme.palette.grey[500],
    },
    "&.MuiSelect-select": {
      paddingRight: 10,
    },
  },
  selectMenu: {
    background: "red",
  },
  up: {
    color: `${theme.palette.up.main} !important`,
  },
  down: {
    color: `${theme.palette.down.main} !important`,
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
    "& i": {
      transform: "rotate(0deg)",
      "&.on": {
        transform: "rotate(180deg)",
        transition: "transform .2s",
      },
    },
  },
  // 持仓
  custom_order: {
    padding: "0 16px",
    // minWidth: 832,
    "& ul": {
      "& li": {
        borderBottom: `1px solid ${theme.palette2.grey[700]}`,
        padding: "16px 0",
        // margin: "0 0 16px"
      },
    },
    "& .first": {
      flex: 1.1,
    },
    "& .second": {
      flex: 1.1,
      marginLeft: 8,
    },
    "& .three": {
      flex: 1,
      marginLeft: 8,
    },
    "& .four": {
      flex: 1,
      marginLeft: 8,
    },
    "& .order_item": {
      height: 24,
      fontSize: 12,
      lineHeight: "24px",
      "& .icon-btn": {
        marginLeft: 4,
        width: 16,
        height: 16,
        borderRadius: 2,
        display: "flex",
        background: helper.hex_to_rgba(theme.palette.primary.main, 0.1),
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      },
      "& i": {
        color: theme.palette.primary.main,
        // fontWeight: 700
      },
    },
    "& label": {
      color: theme.palette.grey[500],
    },
  },
  title: {
    display: "flex",
    height: 24,
    alignItems: "center",
    margin: "0 0 8px 0",
    "& .first": {
      display: "flex",
      alignItems: "center",
      "& label": {
        fontSize: 14,
        lineHeight: "24px",
        color: theme.palette2.white,
        fontWeight: "bold",
        minWidth: 120,
        margin: "0 8px 0 0",
      },
      "& span": {
        // flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        border: `1px solid`,
        borderRadius: 2,
        padding: "0 4px",
        lineHeight: "16px",
        "& em": {
          margin: "0 0 0 8px",
          padding: "0 10px",
          fontSize: 12,
          display: "inline-block",
          color: theme.palette.common.white,
        },
      },
    },
    "& .four": {
      height: 24,
      position: "relative",
      top: -12,
      right: 0,
      textAlign: "right",
      color: theme.palette.grey[500],
    },
  },
  content: {
    display: "flex",
    "& .underline": {
      cursor: "pointer",
      borderBottom: "1px dashed #68778b",
    },
    "& .first, & .second": {
      "& .order_item": {
        display: "flex",
        alignItems: "center",
        "& label": {
          flex: 1.1,
          color: theme.palette2.grey[300],
        },
        "& span": {
          flex: 1,
          color: theme.palette2.grey[200],
        },
      },
    },
    "& .three, & .four": {
      "& .order_item": {
        color: theme.palette2.grey[200],
        "& label": {
          color: theme.palette2.grey[300],
        },
        "&:nth-child(1)": {
          marginTop: -24,
          "& label": {
            fontSize: 12,
          },
        },
      },
    },
    "& .three": {
      "& .order_item": {
        "&:nth-child(2)": {
          marginTop: 48,
          "& :before, & :after": {
            display: "none",
          },
          "& label": {
            width: 120,
          },
        },
        "& i.green": {
          color: theme.palette.up.main,
          fontWeight: 400,
        },
        "& i.red": {
          color: theme.palette.down.main,
          fontWeight: 400,
        },
      },
      "& .order_select": {
        position: "relative",
        "& .select": {
          position: "absolute",
          right: 0,
          bottom: -30,
          background: "transparent",
        },
      },
    },
    "& .four": {
      "& .order_item": {
        "&:nth-child(2)": {
          marginTop: 60,
          display: "flex",
        },
      },
      "& button": {
        minHeight: 32,
        margin: "0 0 0 4px",
        padding: "0 12px",
        "&:nth-child(2)": {
          minWidth: 80,
          letterSpacing: 0,
          flex: 1,
        },
      },
    },
  },
  switch: {
    margin: "0 -8px 0 0",
  },
  un: {
    color: theme.palette.primary.main,
    width: 35,
    textAlign: "right",
    cursor: "pointer",
    fontSize: 12,
  },
  inputHeight: {
    height: 24,
    color: theme.palette2.grey[200],
  },
  filed: {
    color: theme.palette2.grey[100],
    height: 30,
    fontSize: 12,
    "&:before": {
      borderBottom: `1px solid ${theme.palette2.grey[500]}`,
    },
    "&:hover": {
      "&:before": {
        borderBottom: `1px solid ${theme.palette2.grey[500]} !important`,
      },
    },
    "& input::placeholder": {
      color: theme.palette2.grey[500],
    },
  },
  noBorder: {
    border: 0,
  },
  order_table_width: {
    padding: "0 16px",
    "& div": {
      // minWidth: 72,
      textAlign: "right",
      flex: "0 0 16%",
      minWidth: 128,
      // whiteSpace: "normal !important",
      "&:nth-child(8n+1)": {
        textAlign: "left",
        flex: "0 0 12%",
        minWidth: 96,
        padding: "0 !important",
      },
      "&:nth-child(8n+3)": {
        flex: "0 0 6%",
        minWidth: 48,
      },
      "&:nth-child(8n+4)": {
        flex: "0 0 13%",
        minWidth: 104,
      },
      "&:nth-child(8n+6)": {
        flex: "0 0 12%",
        minWidth: 96,
      },
      "&:nth-child(8n+5)": {
        flex: "0 0 9%",
        minWidth: 72,
      },
    },
  },
  position_table_width: {
    "& div": {
      minWidth: 90,
      "&:nth-child(9n+1)": {
        minWidth: 120,
      },
      "&:nth-child(9n+2)": {
        minWidth: 80,
      },
      "&:last-child": {
        minWidth: 80,
        textAlign: "right",
      },
    },
  },
  current_table_width: {
    padding: "0 16px",
    "& div": {
      textAlign: "right",
      flex: "0 0 12%",
      minWidth: 96,
      // whiteSpace: "normal !important",
      padding: "0 0 0 4px",
      "&:nth-child(12n+1)": {
        textAlign: "left",
        padding: "0 !important",
        // flex: "0 0 12%",
        // minWidth: 96,
      },
      "&:nth-child(12n+2)": {
        flex: "0 0 10.25%",
        minWidth: 88,
      },
      "&:nth-child(12n+3)": {
        flex: "0 0 5%",
        minWidth: 40,
      },
      "&:nth-child(12n+4)": {
        flex: "0 0 7.25%",
        minWidth: 58,
      },
      "&:nth-child(12n+6), &:nth-child(12n+7)": {
        flex: "0 0 15%",
        minWidth: 120,
      },
      "&:nth-child(12n+9)": {
        flex: "0 0 7%",
        minWidth: 56,
      },
      "&:nth-child(12n+10)": {
        flex: "0 0 4.5%",
        minWidth: 36,
      },
    },
    "&.stop div": {
      "&:nth-child(12n+6), &:nth-child(12n+7)": {
        flex: "0 0 14%",
        minWidth: 112,
      },
      "&:nth-child(12n+9)": {
        flex: "0 0 9%",
        minWidth: 72,
      },
    },
  },
  current_table_width2: {
    padding: "0 16px",
    "& div": {
      textAlign: "right",
      flex: "0 0 12%",
      minWidth: 96,
      // whiteSpace: "normal !important",
      padding: "0 0 0 4px",
      "&:nth-child(12n+1)": {
        textAlign: "left",
        padding: "0 !important",
      },
      "&:nth-child(12n+2), &:nth-child(12n+6)": {
        flex: "0 0 15%",
        minWidth: 120,
      },
      "&:nth-child(12n+4), &:nth-child(12n+5)": {
        flex: "0 0 18%",
        minWidth: 144,
      },
      "&:nth-child(12n+7)": {
        flex: "0 0 10%",
        minWidth: 80,
      },
    },
  },
  history_table_width: {
    padding: "0 16px",
    "& div": {
      textAlign: "right",
      flex: "0 0 12%",
      minWidth: 96,
      // whiteSpace: "normal !important",
      padding: "0 0 0 4px",
      "&:nth-child(12n+1)": {
        textAlign: "left",
        padding: "0 !important",
      },
      "&:nth-child(12n+2)": {
        flex: "0 0 11%",
        minWidth: 88,
      },
      "&:nth-child(12n+3)": {
        flex: "0 0 5%",
        minWidth: 40,
      },
      "&:nth-child(12n+6), &:nth-child(12n+7)": {
        flex: "0 0 15%",
        minWidth: 120,
      },
      "&:nth-child(12n+8), &:nth-child(12n+9)": {
        flex: "0 0 7%",
        minWidth: 56,
      },
      "&:nth-child(12n+4), &:nth-child(12n+10)": {
        flex: "0 0 8%",
        minWidth: 64,
      },
    },
    "&.stop div": {
      "&:nth-child(12n+4)": {
        flex: "0 0 7%",
        minWidth: 56,
      },
      "&:nth-child(12n+5), &:nth-child(12n+6), &:nth-child(12n+7), &:nth-child(12n+8)": {
        flex: "0 0 12%",
        minWidth: 96,
      },
      "&:nth-child(12n+9)": {
        flex: "0 0 10%",
        minWidth: 80,
      },
      "&:nth-child(12n+10)": {
        flex: "0 0 7%",
        minWidth: 56,
      },
    },
  },
  history_table_width_loss: {
    padding: "0 16px",
    "& div": {
      textAlign: "right",
      flex: "0 0 12%",
      minWidth: 96,
      // whiteSpace: "normal !important",
      padding: "0 0 0 4px",
      "&:nth-child(12n+1)": {
        textAlign: "left",
        padding: "0 !important",
      },
      "&:nth-child(12n+2), &:nth-child(12n+4), &:nth-child(12n+5)": {
        flex: "0 0 18%",
        minWidth: 144,
      },
    },
  },
  // 交易面板订单
  option_select: {
    ...theme.typography.body2,
    height: 32,
    margin: "0 0 0 24px",
    "& svg": {
      width: 18,
      height: 18,
    },
  },
  label: {
    ...theme.typography.body2,
    color: theme.palette.grey[500],
  },
  checkRoot: {
    color: theme.palette.grey[800],
  },
  button_disabled: {
    color: `${theme.palette.grey[800]} !important`,
    cursor: "auto !important",
  },
  colorBar: {
    backgroundColor: "#D3D5D6",
    opacity: 0.2,
  },
  whole: {
    width: "100%",
  },
  menuItem: {
    height: 28,
    padding: "0 16px",
    fontSize: 12,
    color: theme.palette2.white,
    "&:hover": {
      background: theme.palette2.grey[900],
    },
    "&.Mui-selected": {
      background: theme.palette2.grey[900],
      color: theme.palette.primary.main,
      "&:hover": {
        background: theme.palette2.grey[900],
      },
    },
  },
  menuList: {
    background: theme.palette2.background.paper,
    padding: "4px 0",
    boxShadow: "0px 2px 4px rgba(36, 43, 50, 0.2)",
  },
  // match_details: {
  //   padding: "0 30px",
  //   border: 0,
  //   background: "transparent"
  // },
  match_details: {
    background: theme.palette2.background.list,
    height: 0,
    opacity: 0,
    overflow: "hidden",
    "& >div": {
      display: "flex",
      "& div": {
        fontSize: 12,
        height: 44,
        display: "flex",
        alignItems: "center",
        flex: 1.5,
        justifyContent: "flex-end",
        "&:nth-child(6n + 1)": {
          flex: 1,
          justifyContent: "flex-start",
        },
      },
    },
    "&.on": {
      opacity: 1,
      transition: "height 0.2s, opacity 0.25s",
    },
  },
  // match_title: {
  //   padding: "0 16px",
  //   "& div": {
  //     color: theme.palette2.grey[300],
  //     borderBottom: `1px solid ${theme.palette2.grey[700]}`
  //   }
  // },
  match_title: {
    display: "flex",
    padding: "0 16px",
    "& div": {
      fontSize: 12,
      // height: 40,
      display: "flex",
      alignItems: "center",
      color: theme.palette2.grey[300],
      borderBottom: `1px solid ${theme.palette2.grey[700]}`,
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
    padding: "0 16px",
    "& div": {
      fontSize: 12,
      // height: 40,
      display: "flex",
      alignItems: "center",
      color: theme.palette2.grey[300],
      borderBottom: `1px solid ${theme.palette2.grey[700]}`,
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
    padding: "0 16px",
    display: "flex",
    "&:hover": {
      background: theme.palette2.grey[700],
    },
    "& div": {
      fontSize: 12,
      // height: 40,
      display: "flex",
      alignItems: "center",
      // borderTop: `1px solid ${theme.palette.grey[800]}`,
      fontSize: 14,
      color: theme.palette2.grey[200],
      borderBottom: `1px solid ${theme.palette2.grey[700]}`,
      "&:nth-child(6n + 1)": {
        flex: "0 0 19%",
        "& span": {
          margin: 0,
        },
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
    padding: "0 16px",
    display: "flex",
    "&:hover": {
      background: theme.palette2.grey[700],
    },
    "& div": {
      fontSize: 12,
      // height: 40,
      display: "flex",
      alignItems: "center",
      // borderTop: `1px solid ${theme.palette.grey[800]}`,
      fontSize: 14,
      flex: 1,
      color: theme.palette2.grey[200],
      borderBottom: `1px solid ${theme.palette2.grey[700]}`,
      "&:nth-child(12n+1)": {
        minWidth: 120,
        "& span": {
          margin: 0,
        },
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
  changeModal: {
    margin: "0 4px 0 0",
    padding: "0 12px",
    minHeight: 32,
    lineHeight: 1.75,
    letterSpacing: "0.02875rem",
    position: "relative",
    minWidth: 80,
    zIndex: 1,
    cursor: "pointer",
    flex: 1,
    fontWeight: "bold",
    borderRadius: 2,
    overflow: "hidden",
    "& span": {
      display: "flex",
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 2,
      color: theme.palette.primary.main,
      alignItems: "center",
      justifyContent: "center",
      left: 0,
      top: 0,
    },
    "& i": {
      display: "block",
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 1,
      background: theme.palette.primary.main,
      opacity: 0.1,
      left: 0,
      top: 0,
    },
  },
  grey: {
    color: theme.palette.grey[500],
  },

  // 下划线
  underline: {
    borderBottom: `1px dashed ${theme.palette2.grey[300]}`,
    cursor: "pointer",
  },
  // tooltip提示框
  tooltip_arrow: {
    color: theme.palette2.grey[700],
  },
  tooltip: {
    ...theme.typography.body2,
    color: theme.palette2.grey[200],
    background: theme.palette2.grey[700],
    padding: "4px 6px",
    borderRadius: 2,
    opacity: 1,
    bottom: 1,
    fontSize: 12,
  },
  // 下拉
  choose: {
    border: `1px solid ${theme.palette2.grey[500]}`,
    borderRadius: 2,
    "&:hover": {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  select: {
    height: 22,
    padding: "0 4px",
    fontSize: 12,
    color: theme.palette2.grey[200],
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& span": {
      minWidth: 52,
    },
    "& i": {
      transform: "rotate(0deg)",
    },
    "&.on": {
      "& i": {
        transform: "rotate(180deg)",
        transition: "transform .2s",
      },
    },
    "&:hover": {
      "& span": {
        color: theme.palette.primary.main,
      },
    },
  },
  paper: {
    background: theme.palette2.background.paper,
  },
  menulist: {
    padding: "4px 0",
    "& li": {
      color: theme.palette2.grey[200],
      fontSize: 12,
      minWidth: 76,
      padding: "6px 13px",
      "&:hover": {
        background: theme.palette2.grey[900],
      },
    },
  },
  menuselect: {
    color: `${theme.palette.primary.main} !important`,
    background: `${theme.palette2.grey[900]} !important`,
  },
  // tab
  tabBg: {
    background: theme.palette2.grey[900],
    display: "flex",
    height: 32,
    padding: "0 16px 0 0",
    "& .orderTabs": {
      height: 32,
      minHeight: 32,
      flex: 1,
      "& .MuiTab-root": {
        marginRight: 16,
      },
    },
  },
  shrink: {
    padding: "0 40px 0 0",
  },
  tabs: {
    minHeight: 32,
    height: 32,
    background: theme.palette2.grey[900],
    borderBottom: `1px solid ${theme.palette2.line}`,
    "& .MuiTabs-flexContainer": {
      height: "100%",
      padding: "0 16px",
    },
    "& .MuiTab-root": {
      minWidth: "auto",
      minHeight: "100%",
      color: theme.palette2.grey[200],
      padding: 0,
      marginRight: 16,
      display: "flex",
      alignItems: "center",
      fontSize: 14,
      lineHeight: "20px",
      opacity: 1,
      "&.Mui-selected": {
        color: theme.palette2.white,
      },
    },
    "& .MuiTabs-indicator": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  financeTabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: "transparent",
    },
  },
  selectTabs: {
    flex: 1,
    padding: "0 13px",
    "& p": {
      height: 32,
      lineHeight: "32px",
      display: "inline-block",
      color: theme.palette2.white,
      fontSize: 14,
      cursor: "pointer",
    },
  },
  // 订单
  orderList: {
    height: "100%",
    background: theme.palette2.grey[700],
    borderRadius: 2,
    overflow: "hidden",
    "& .g-table": {
      height: 288,
      background: theme.palette2.grey[800],
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
      "& .theader": {
        minHeight: 32,
        color: theme.palette2.grey[300],
      },
      "& .tbody": {
        border: 0,
        minHeight: "calc(100% - 32px)",
        fontSize: 14,
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
        "& .item": {
          fontSize: 12,
          height: 44,
          color: theme.palette2.grey[200],
          borderBottom: `1px solid ${theme.palette2.grey[700]}`,
          "&:hover": {
            background: theme.palette2.grey[700],
          },
        },
      },
      "& .noresult": {
        minHeight: 210,
        "& img": {
          width: 48,
          height: 48,
        },
        "& span": {
          margin: "16px 0 0",
          fontSize: 14,
          color: theme.palette2.grey[200],
        },
      },
      "& .loading, & .loading2": {
        color: theme.palette2.grey[300],
      },
      "& .loading2": {
        minHeight: "100%",
      },
    },
  },
  selectAllSymbol: {
    float: "right",
    display: "flex",
    alignItems: "center",
    height: "100%",
    fontSize: 12,
    "& .option": {
      margin: "0 0 0 16px",
      display: "inline-block",
      cursor: "pointer",
      color: theme.palette.primary.main,
      "&.disabled": {
        cursor: "default",
        color: theme.palette2.grey[200],
      },
    },
  },
  coin_select: {
    height: 32,
    margin: 0,
    lineHeight: "1.5",
    "& >span": {
      padding: "0px 1px",
    },
    "& svg": {
      width: 18,
      height: 18,
    },
  },
  selectBtnGroup: {
    height: 40,
    padding: "8px 16px",
    background: theme.palette2.grey[800],
    "& button": {
      margin: "0 4px 0 0",
      border: `1px solid ${theme.palette2.grey[500]}`,
      color: theme.palette2.grey[300],
      fontSize: 12,
      borderRadius: 2,
      minWidth: 72,
      height: 24,
      padding: "0 8px",
      fontWeight: "normal",
      transition: "none",
      "&:hover": {
        color: theme.palette2.grey[100],
      },
      "&.selected": {
        borderColor: theme.palette.primary.main,
        color: theme.palette2.grey[100],
      },
    },
  },
  label: {
    color: theme.palette2.grey[200],
    fontSize: 12,
    lineHeight: "36px",
  },
  checkRoot: {
    color: theme.palette2.grey[500],
  },
  minTable: {
    "& .tbody": {
      minWidth: "auto",
    },
  },
  positionTable: {
    overflowX: "auto",
    "& .tbody": {
      minWidth: 832,
    },
  },
  commonTable: {
    overflowX: "auto",
    "& .theader, & .tbody": {
      minWidth: 874,
    },
    "&.entrust": {
      height: 248,
    },
  },
  // 合约介绍
  future_introduce: {
    padding: 16,
    background: theme.palette2.grey[800],
    color: theme.palette2.grey[200],
    height: "calc(100% - 32px)",
    overflowX: "auto",
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
    "& h3": {
      fontSize: 14,
      fontWeight: "bold",
      lineHeight: "24px",
      color: theme.palette2.white,
      margin: "0 0 16px",
    },
    "& p": {
      fontSize: 12,
      lineHeight: "24px",
      margin: "0 0 8px",
      display: "flex",
      alignItems: "center",
      "& label": {
        flex: 1.2,
        color: theme.palette2.grey[300],
      },
      "& span": {
        flex: 1,
      },
    },
  },
  inputRoot: {
    flex: 1,
    padding: "0 8px",
    height: 30,
    width: "100%",
    fontSize: 12,
    position: "relative",
    "& legend": {
      height: 0,
    },
    "& fieldset": {
      top: 0,
      border: `1px solid ${theme.palette2.grey[500]} !important`,
      borderRadius: 2,
    },
    "& input": {
      color: theme.palette2.grey[100],
      fontSize: 12,
      padding: "0 8px 0 0",
      height: "100%",
      boxSizing: "border-box",
      caretColor: theme.palette2.grey[100],
      fontFamily: "system-ui",
      "&.Mui-disabled": {
        fontWeight: "normal",
      },
      "&::placeholder": {
        color: theme.palette2.grey[300],
        opacity: 1,
      },
    },
  },
  inputFocused: {
    backgroundColor: "transparent",
    "& fieldset": {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },
  inputError: {
    "& fieldset": {
      border: `1px solid ${theme.palette.down.main} !important`,
    },
  },
  priceTypeIcon: {
    height: 28,
    lineHeight: "28px",
    width: 28,
    textAlign: "center",
    color: `${theme.palette2.grey[200]} !important`,
    marginRight: -8,
    padding: "0 4px",
    cursor: "pointer",
    fontWeight: "normal !important",
    "&.on": {
      transform: "rotate(180deg)",
    },
  },
  commonPaper: {
    background: theme.palette2.background.paper,
    color: theme.palette2.white,
    boxShadow: "0 0 4px rgba(36, 43, 50, 0.2)",
    "& ul": {
      padding: "4px 0",
      "& li": {
        fontSize: 12,
        justifyContent: "center",
        minWidth: 72,
        minHeight: "auto",
        paddingTop: 5,
        paddingBottom: 5,
        fontWeight: "normal",
        "&.Mui-selected": {
          background: theme.palette2.grey[900],
          color: theme.palette.primary.main,
          "&:hover": {
            background: theme.palette2.grey[900],
          },
        },
        "&:hover": {
          background: theme.palette2.grey[900],
        },
      },
    },
  },
  tabPaper: {
    "& ul": {
      "& li": {
        fontSize: 14,
        paddingTop: 10,
        paddingBottom: 10,
        lineHeight: "20px",
      },
    },
  },
});
