import helper from "../../utils/helper";
export default (theme) => ({
  up_newdata: {
    animation: `$fadeInUp .2s ease-in-out .1s 1 forwards`,
    transition: "all .2s ease-in-out",
  },
  down_newdata: {
    animation: `$fadeInDown .2s ease-in-out .1s 1 forwards`,
    transition: "all .2s ease-in-out",
  },
  "@keyframes fadeInDown": {
    from: {
      color: `${theme.palette.error.light} !important`,
    },
    to: {
      color: `${theme.palette.error.main} !important`,
    },
  },
  "@keyframes fadeInUp": {
    from: {
      color: `${theme.palette.success.light} !important`,
    },
    to: {
      color: `${theme.palette.up.main} !important`,
    },
  },
  down: {
    color: `${theme.palette.down.main} !important`,
  },
  up: {
    color: `${theme.palette.up.main} !important`,
  },
  // 下划线
  underline: {
    borderBottom: `1px dashed ${theme.palette2.grey[300]}`,
    cursor: "pointer",
    "& a": {
      color: theme.palette2.grey[300],
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
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
      minHeight: "auto",
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
  // tab
  tabBg: {
    background: theme.palette2.grey[900],
    display: "flex",
    height: 36,
    padding: "0 16px 0 0",
    "& .orderTabs": {
      height: 36,
      minHeight: 36,
      flex: 1,
      "& .MuiTab-root": {
        marginRight: 40,
      },
    },
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
  // 盘口
  handicap_bg: {
    background: theme.palette2.grey[800],
    overflow: "hidden",
    borderRadius: 2,
    height: "100%",
  },
  handicap_title: {
    background: theme.palette2.grey[900],
    height: 50,
    borderBottom: `1px solid ${theme.palette2.line}`,
    display: "flex",
    "& span": {
      fontSize: 14,
      padding: "0 16px",
      color: theme.palette2.grey[200],
      height: 50,
      alignItems: "center",
      display: "flex",
      cursor: "pointer",
      borderTop: "2px solid transparent",
      "&.on": {
        borderTop: `2px solid ${theme.palette.primary.main}`,
        background: theme.palette2.grey[800],
        color: theme.palette2.white,
      },
    },
  },
  handicap: {
    background: theme.palette2.grey[800],
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  title: {
    height: 36,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
  },
  icons: {
    display: "flex",
    alignItems: "center",
    "& span": {
      width: 24,
      height: 24,
      margin: "0 8px 0 0",
      display: "inline-block",
      textAlign: "center",
      lineHeight: "24px",
      border: `1px solid ${theme.palette2.grey[500]}`,
      borderRadius: 2,
      cursor: "pointer",
      "&.on": {
        borderColor: theme.palette.primary.main,
        cursor: "default",
      },
      "&:hover": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& img": {
      width: 12,
      height: 12,
    },
  },
  select1: {
    height: 23,
    position: "relative",
    cursor: "pointer",
    marginTop: -1,
    "&.selected": {
      background: theme.palette2.grey[700],
      color: theme.palette.primary.main,
    },
    "& ul": {
      display: "none",
      position: "absolute",
      top: 23,
      right: "50%",
      transform: "translate(50%, 0)",
      background: theme.palette2.background.paper,
      overflow: "hidden",
      width: "100%",
      borderRadius: 2,
      textAlign: "center",
      fontSize: 12,
    },
    "& li": {
      height: 24,
      lineHeight: "24px",
      color: theme.palette2.grey[200],
      "&:hover": {
        background: theme.palette2.grey[900],
      },
      "&.selected": {
        background: theme.palette2.grey[900],
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
        color: theme.palette2.grey[300],
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
  header: {
    height: 32,
    padding: "0 16px",
    margin: 0,
    display: "flex",
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
    "& li": {
      textAlign: "right",
      flex: "0 0 35%",
      fontSize: 12,
      color: theme.palette2.grey[300],
      "&:nth-child(3n+1)": {
        flex: "0 0 30%",
        textAlign: "left",
      },
    },
  },
  handicap_list_all: {
    width: "100%",
    overflowY: "auto",
    height: "calc(100% - 122px)",
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
  handicap_list: {
    width: "100%",
    overflow: "hidden",
    height: "calc(100% - 122px)",
  },
  HandicapBox: {
    // height: "calc(50% - 22px)",
    // overflowY: "auto",
    // "&::-webkit-scrollbar": {
    //   width: 5,
    //   height: 5,
    //   backgroundColor: "transparent"
    // },
    // "&::-webkit-scrollbar-track": {
    //   width: 5,
    //   height: 5,
    //   backgroundColor: "transparent"
    // },
    // "&::-webkit-scrollbar-thumb": {
    //   backgroundColor: "rgba(127, 143, 164, 0.6)",
    //   borderRadius: 5
    // }
  },
  HandicapBox2: {
    height: "calc(100% - 44px)",
    overflowY: "auto",
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
  item: {
    position: "relative",
    height: 20,
    width: "100%",
    overflow: "hidden",
    fontSize: 12,
    // fontWeight: 500,
    "& .data": {
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      height: "100%",
      position: "relative",
      zIndex: 1,
      "&:hover": {
        backgroundColor: theme.palette2.grey[700],
        "& i.delete": {
          visibility: "initial",
        },
      },
      "& >div": {
        textAlign: "right",
        flex: "0 0 35%",
        fontSize: 12,
        color: theme.palette2.grey[200],
        "&:nth-child(3n+1)": {
          flex: "0 0 30%",
          textAlign: "left",
        },
      },
      "& i.delete": {
        display: "inline-block",
        width: 16,
        fontSize: 16,
        visibility: "hidden",
        color: theme.palette2.grey[200],
      },
    },
  },
  bgprogness: {
    position: "absolute",
    height: "100%",
    width: "100%",
    right: 0,
    top: 0,
    zIndex: 1,
    //transition: "all ease-in-out 0.2s",
    transformOrigin: "right",
  },
  bgprogness2: {
    position: "absolute",
    height: "100%",
    width: "100%",
    right: 0,
    top: 0,
    zIndex: 1,
    transformOrigin: "right",
  },
  green: {
    background: `${theme.palette.up.main} !important`,
    opacity: "8%",
  },
  red: {
    background: `${theme.palette.down.main} !important`,
    opacity: "8%",
  },
  arrow: {
    background: theme.palette2.grey[800],
    height: 40,
    padding: "0 16px",
    margin: "2px 0",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: `1px solid ${theme.palette2.line}`,
    borderBottom: `1px solid ${theme.palette2.line}`,
    "& i": {
      color: theme.palette2.grey[300],
      fontSize: 14,
      fontWeight: 500,
      "&:first-child": {
        fontSize: 16,
      },
    },
  },
  delivery: {
    height: "calc(100% - 122px)",
    color: theme.palette2.background.switch,
    textAlign: "center",
    "& img": {
      margin: "150px 0 16px",
      width: 48,
      height: 48,
    },
  },
  // 最新成交
  lists: {
    background: theme.palette2.grey[800],
    height: "100%",
    width: "100%",
    overflow: "hidden",
    "& .list": {
      overflowY: "auto",
      width: "100%",
      height: "calc(100% - 82px)",
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
      "& ul": {
        height: 20,
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "0 16px",
        // fontWeight: 500,
        "& li": {
          textAlign: "right",
          flex: "0 0 35%",
          fontSize: 12,
          color: theme.palette2.grey[200],
          "&:nth-child(3n+1)": {
            flex: "0 0 30%",
            textAlign: "left",
          },
        },
        "&:hover": {
          background: theme.palette2.grey[700],
        },
      },
    },
  },
  // 产品信息
  tokenInfo: {
    height: 50,
    background: theme.palette2.grey[900],
    // overflow: "hidden",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: `1px solid ${theme.palette2.line}`,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    padding: "7px 8px 7px 16px",
    color: theme.palette2.grey[200],
    fontSize: 12,
    width: "100%",
  },
  symbol_name: {
    color: theme.palette2.white,
    fontSize: 16,
    lineHeight: "20px",
    flexShrink: "inherit",
    padding: "0 16px 0 0",
    "& em": {
      "& i": {
        margin: "-2px 0 0",
        color: theme.palette2.grey[200],
      },
    },
    "& span.label": {
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
    "& p": {
      color: theme.palette2.grey[300],
      fontSize: 12,
      lineHeight: "16px",
      padding: "0 0 0 2px",
    },
  },
  option_symbol_name: {
    fontSize: 14,
    "& em": {
      lineHeight: "20px",
      fontWeight: 500,
      margin: "0 0 3px",
      display: "inline-block",
    },
    "& p": {
      padding: 0,
      "& span": {
        color: theme.palette.up.main,
        border: `1px solid ${theme.palette.up.main}`,
        display: "inline-block",
        padding: "0 4px",
        borderRadius: 2,
        margin: "0 8px 0 0",
      },
      "& strong i": {
        fontWeight: 500,
        position: "relative",
        top: 1,
      },
    },
  },
  future_symbol_name: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    color: theme.palette2.white,
    position: "relative",
    padding: "0 16px 0 0",
    "& em": {
      fontWeight: 500,
    },
    "& span.label": {
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
  riskwarning: {
    position: "absolute",
    background: theme.palette.common.white,
    width: "100%",
    height: 32,
    right: 0,
    top: -34,

    fontSize: 12,

    borderRadius: 2,
    color: theme.palette.common.text,
    "& div": {
      background: helper.hex_to_rgba(theme.palette.secondary.main, 0.2),
      display: "flex",
      alignItems: "center",
      width: "100%",
      height: 32,
      padding: "0 16px 0 10px",
    },
    "& p": {
      flex: 1,
      lineHeight: "20px",
      height: 20,
      overflow: "hidden",
      padding: "0 7px",
      whiteSpace: "nowrap",
    },
    "& a": {
      color: theme.palette.primary.main,
    },
    "& i": {
      lineHeight: "20px",
      width: 20,
      cursor: "pointer",
      "&:nth-child(3n+1)": {
        color: theme.palette.secondary.main,
        cursor: "inherit",
      },
    },
  },
  info: {
    flex: 1,
    display: "flex",
    flexShrink: "unset",
    // margin: "0 0 0 16px",
    justifyContent: "flex-start",
    "& div": {
      fontSize: 12,
      padding: "0 16px 0 0",
      whiteSpace: "nowrap",
      "& > span": {
        color: theme.palette2.grey[300],
        lineHeight: "20px",
      },
      "&:last-child": {
        padding: 0,
      },
    },
  },
  option_info: {
    "& div": {
      "& > span": {
        lineHeight: "16px",
        height: 17,
        display: "inline-block",
        margin: "3px 0 5px",
      },
    },
  },
  switch: {
    height: "100%",
    display: "flex",
    width: 40,
    alignItems: "center",
    justifyContent: "flex-end",
    "& .g-switch": {
      minWidth: 32,
      height: 18,
      lineHeight: "18px",
      border: 0,
      background: theme.palette2.background.switch,
      "&:after, &:before": {
        left: 1,
        top: 1,
        width: 16,
        height: 16,
      },
      "& i": {
        position: "absolute",
        left: 1,
        top: 1,
        color: theme.palette.primary.main,
        zIndex: 1,
        transition: "all 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86)",
      },
      "&.g-switch-checked": {
        "& span": {
          margin: "0 24px 0 6px",
        },
        "&:after, &:before": {
          left: "100%",
          marginLeft: -17,
        },
        "& i": {
          left: 15,
          transition: "all 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86)",
        },
      },
    },
    "& .MuiSwitch-root": {
      padding: "10px 0px",
      width: 32,
    },
    "& .MuiSwitch-track": {
      borderRadius: 9,
      background: `${theme.palette2.background.switch} !important`,
      opacity: "0.3 !important",
    },
    "& .MuiIconButton-label": {
      width: 16,
      height: 16,
      borderRadius: "100%",
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.main,
    },
    "& .MuiSwitch-switchBase": {
      top: 11,
      left: 1,
      padding: 0,
      "&.Mui-checked": {
        transform: "translateX(14px)",
      },
    },
    "& .MuiTouchRipple-root": {
      // display: "none"
    },
  },
  tokenListModal: {
    position: "absolute",
    top: 45,
    left: -16,
    zIndex: 100,
    background: theme.palette2.background.paper,
    boxShadow: `0px 6px 10px ${theme.palette2.shadowColor[0]}`,
    borderRadius: 4,
    width: 480,
    height: 420,
    overflow: "auto",
    transform: "scale(0)",
    opacity: 0,
    transition: "all 0.2s ease-out",
    transformOrigin: "top left",
    "&.on": {
      transform: "scale(1)",
      opacity: 1,
    },
  },
  popover: {
    pointerEvents: "none",
    // "& >div:last-child": {
    //   background: theme.palette2.grey[700]
    // },
    "& .MuiPaper-root": {
      background: theme.palette2.background.paper,
    },
  },
  token_info: {
    background: theme.palette2.background.paper,
    borderRadius: 4,
    color: theme.palette2.white,
    width: 630,
    height: 380,
    pointerEvents: "all",
  },
  token_info_title: {
    padding: "15px 24px",
    color: theme.palette2.grey[200],
    "& p": {
      fontSize: 14,
      lineHeight: "23px",
      cursor: "pointer",
    },
  },
  token_info_link: {
    padding: "20px 0 12px",
    "& > div": {
      "&:nth-of-type(1)": {
        minWidth: 50,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
        maxWidth: 80,
        "& img": {
          width: 50,
          height: 50,
          margin: "0 0 1px",
        },
        "& p": {
          lineHeight: "23px",
        },
      },
      "&:nth-of-type(2)": {
        minWidth: 182,
        maxWidth: 220,
      },
      "&:nth-of-type(3)": {},
    },
    "& .label": {
      lineHeight: "20px",
      height: 20,
      maxWidth: 90,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: theme.palette2.grey[300],
      margin: "0 0 8px",
    },
    "& .item": {
      width: 180,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      textAlign: "right",
      height: 20,
      lineHeight: "20px",
      color: theme.palette.primary.main,
      margin: "0 0 8px",
    },
    "& .item1": {
      textAlign: "right",
      lineHeight: "20px",
      height: 20,
      maxWidth: 140,
      overflow: "hidden",
      color: theme.palette2.white,
      margin: "0 0 8px",
    },
  },
  token_info_content: {
    height: 169,
    overflowY: "auto",
    margin: "20px 0",
    padding: "0 24px",
    fontSize: 14,
    lineHeight: "22px",
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
  // K线、深度图
  kline: {
    background: theme.palette2.grey[800],
    position: "relative",
    height: "100%",
    width: "100%",
    zIndex: 1,
    "& iframe": {
      background: theme.palette2.grey[800],
      "& .chart-page": {
        background: "red",
      },
    },
    "& .chart": {
      height: "calc(100% - 24px)",
    },
  },
  kline_mark: {
    position: "absolute",
    height: "100%",
    width: "100%",
    background: theme.palette2.grey[800],
    zIndex: 1,
    left: 0,
    top: 0,
    textAlign: "center",
    "& div": {
      // marginTop: "calc(25% - 24px)",
      color: theme.palette2.grey[200],
      position: "relative",
      top: "50%",
    },
  },
  kline_btns: {
    height: 24,
    borderBottom: `1px solid ${theme.palette2.line}`,
    padding: "0 8px 0 0",
    fontSize: 12,
    color: theme.palette2.grey[300],
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
          background: theme.palette2.grey[700],
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
  kline_actions: {
    "& i": {
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
  },
  order_confirm: {
    padding: "20px 0",
    lineHeight: 1.6,
    fontSize: 14,
    maxWidth: 300,
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
        color: theme.palette.primary.main,
      },
    },
  },
  depthchart: {
    width: "100%",
    height: "100%",
    position: "absolute",
    background: theme.palette2.grey[800],
    top: 0,
    left: 0,
    transform: "translate(0, -100%) translateZ(0)",
    zIndex: 10,
    "&.on": {
      transform: "translate(0, 0) translateZ(0)",
    },
    "& canvas": {
      width: "200%",
      height: "calc(200% - 48px)",
      position: "absolute",
      left: 0,
      top: 24,
      transform: "scale(0.5, 0.5) scaleZ(1)",
      transformOrigin: "0 0",
      pointerEvents: "none",
    },
  },
  // 交易面板
  more: {
    float: "right",
    fontSize: 12,
    height: 32,
    lineHeight: "32px",
    color: theme.palette.primary.main,
    cursor: "pointer",
    position: "absolute",
    right: 16,
    top: 0,
    "&:hover": {
      color: theme.palette.primary.light,
    },
  },
  tradingForm: {
    margin: "2px 0 0 0",
    background: theme.palette2.grey[800],
    borderRadius: 2,
    position: "relative",
    zIndex: 2,
  },

  trading: {
    width: "100%",
    overflow: "hidden",
  },
  form: {
    padding: "14px 16px",
    width: "50%",
    float: "left",
    color: theme.palette2.grey[300],
    position: "relative",
    overflow: "hidden",
    "&:nth-child(2n)": {
      borderLeft: `1px dashed ${theme.palette2.grey[700]}`,
    },
    "& h3": {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: "20px",
      margin: "0 0 2px",
    },
  },
  t1: {
    fontSize: 12,
    height: 16,
    margin: "0 0 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& i": {
      color: theme.palette2.grey[200],
    },
    "& a": {
      color: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.primary.light,
      },
    },
  },
  t2: {
    height: 30,
    margin: "0 0 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    "& > div": {
      fontSize: 12,
      "&:nth-child(2n + 1)": {
        width: 48,
      },
      "&:nth-child(2n)": {
        flex: 1,
        "& .g-input": {
          height: 30,
          borderColor: theme.palette2.grey[500],
          "&.g-input-focus": {
            borderColor: theme.palette.primary.main,
            background: "transparent",
          },
          "& .g-input-suffix": {
            color: theme.palette2.grey[300],
          },
          "& input": {
            color: theme.palette2.grey[100],
            padding: "0 8px",
            caretColor: theme.palette2.grey[100],
            fontWeight: "bold",
            "&:disabled": {
              fontWeight: "normal",
            },
          },
          "& .g-input-tip": {
            background: theme.palette2.grey[700],
            color: theme.palette2.grey[300],
          },
        },
      },
    },
    "& em": {
      position: "absolute",
      width: "100%",
      height: 1,
      top: -1,
      left: 0,
    },
  },
  progress: {
    margin: "7px 7px",
    height: 28,
    "& .MuiSlider-root": {
      padding: "13px 0 !important",
    },
    "& .MuiSlider-rail": {
      height: 2,
      backgroundColor: theme.palette2.grey[700],
      opacity: 1,
    },
    "& .MuiSlider-track": {
      backgroundColor: theme.palette.up.main,
    },
    "& .MuiSlider-mark": {
      width: 8,
      height: 8,
      borderRadius: "100%",
      border: `1px solid ${theme.palette2.grey[800]}`,
      top: 9,
      opacity: 1,
      backgroundColor: theme.palette2.grey[700],
      marginLeft: -5,
    },
    "& .MuiSlider-markActive": {
      backgroundColor: theme.palette.up.main,
    },
    "& .MuiSlider-thumb": {
      width: 14,
      height: 14,
      backgroundColor: theme.palette.up.main,
      top: 12,
      border: `1px solid ${theme.palette2.grey[800]}`,
      margin: "-5px 0 0 -7px",
      "&:hover": {
        borderColor: "transparent",
        boxShadow: `0px 0px 0px 6px ${helper.hex_to_rgba(
          theme.palette.up.main,
          0.3
        )} !important`,
      },
    },
    "& .MuiSlider-active": {
      borderColor: "transparent",
      boxShadow: `0px 0px 0px 6px ${helper.hex_to_rgba(
        theme.palette.up.main,
        0.3
      )} !important`,
    },
    "&.red": {
      "& .MuiSlider-track": {
        backgroundColor: theme.palette.down.main,
      },
      "& .MuiSlider-markActive": {
        backgroundColor: theme.palette.down.main,
      },
      "& .MuiSlider-thumb": {
        backgroundColor: theme.palette.down.main,
        "&:hover": {
          boxShadow: `0px 0px 0px 6px ${helper.hex_to_rgba(
            theme.palette.down.main,
            0.3
          )} !important`,
        },
      },
      "& .MuiSlider-active": {
        boxShadow: `0px 0px 0px 6px ${helper.hex_to_rgba(
          theme.palette.down.main,
          0.3
        )} !important`,
      },
    },
  },
  amount: {
    fontSize: 12,
    height: 16,
    display: "flex",
    alignItems: "center",
    margin: "0 0 8px",
    "& i": {
      color: theme.palette2.grey[200],
      margin: "0 0 0 8px",
      flex: 1,
    },
    "& strong": {
      color: theme.palette.up.main,
      border: `1px solid ${theme.palette.up.main}`,
      display: "inline-block",
      padding: "0 4px",
      float: "right",
      fontSize: 12,
      borderRadius: 2,
      fontWeight: "normal",
    },
  },
  btn: {
    width: "100%",
    height: 32,
    lineHeight: "32px",
    display: "block",
    textAlign: "center",
    background: theme.palette2.grey[700],
    color: theme.palette2.grey[200],
    borderRadius: 2,
    padding: 0,
    fontSize: 14,
    "& a": {
      color: theme.palette.primary.main,
    },
    "&:disabled": {
      cursor: "not-allowed",
      color: theme.palette2.grey[500],
    },
    "&.green": {
      background: helper.hex_to_rgba(window.palette.up.main, 0.8),
      color: theme.palette.common.white,
      "&:hover": {
        background: `${theme.palette.up.main} !important`,
      },
    },
    "&.red": {
      background: helper.hex_to_rgba(window.palette.down.main, 0.8),
      color: theme.palette.common.white,
      "&:hover": {
        background: `${theme.palette.down.main} !important`,
      },
    },
  },
  btn_loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
      fontWeight: 500,
      fontSize: 14,
      padding: "0 8px 0 0",
      height: "100%",
      boxSizing: "border-box",
      caretColor: theme.palette2.grey[100],
      fontFamily: "system-ui",
      transformOrigin: "left",
      "&.Mui-disabled": {
        fontWeight: "normal",
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
      border: `1px solid ${theme.palette.error.main} !important`,
    },
  },
  inputAnimation: {
    animation: `$zoom .5s ease-in`,
  },
  "@keyframes zoom": {
    "0%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(1.2)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
  endAdorn: {
    color: theme.palette2.grey[300],
    padding: 0,
  },
  startAdorn: {
    background: theme.palette2.grey[700],
    color: theme.palette2.grey[300],
    position: "absolute",
    top: 29,
    left: 0,
    width: "100%",
    borderRadius: 2,
    height: 24,
    lineHeight: "24px",
    zIndex: 1,
    padding: "0 8px",
  },
  riskTip: {
    fontSize: 12,
    lineHeight: "16px",
    color: theme.palette.grey[500],
  },
  riskCheckRoot: {
    padding: 4,
    color: theme.palette.common.black,
  },
  // 订单
  orderList: {
    height: 508,
    padding: "0 0 6px",
    background: theme.palette2.grey[700],
    display: "flex",
    flexDirection: "column",
    "& .g-table": {
      height: "calc(100% - 36px)",
      background: theme.palette2.grey[800],
      "& .theader": {
        height: 32,
        color: theme.palette2.grey[300],
      },
      "& .tbody": {
        border: 0,
        fontSize: 12,
        height: "calc(100% - 62px)",
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
    },
    "& .order_table_width": {
      padding: "0 16px",
      "& div": {
        textAlign: "right",
        "&:first-child": {
          textAlign: "left",
          padding: 0,
        },
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
  label: {
    color: theme.palette2.grey[200],
    fontSize: 12,
    lineHeight: "36px",
  },
  checkRoot: {
    color: theme.palette2.grey[500],
  },
  order_table: {
    "&.g-table .item .grey02": {
      color: `${theme.palette2.grey[200]} !important`,
    },
    "& .order_table_width": {
      "& div": {
        flex: "0 0 11% !important",
        "&:nth-child(10n + 1)": {
          flex: "0 0 10% !important",
        },
        " &:nth-child(10n + 2), &:nth-child(10n + 4), &:nth-child(10n + 10)": {
          flex: "0 0 8% !important",
        },
      },
    },
  },
  order_table2: {
    "&.g-table .item .grey02": {
      color: `${theme.palette2.grey[200]} !important`,
    },
    "& .order_table_width": {
      "& div": {
        flex: "0 0 12% !important",
        "&:nth-child(9n + 1), &:nth-child(9n + 2), &:nth-child(9n + 4), &:nth-child(9n + 9)": {
          flex: "0 0 10% !important",
        },
      },
    },
  },
  order_table3: {
    "&.g-table .item .grey02": {
      color: `${theme.palette2.grey[200]} !important`,
    },
    "& .order_table_width": {
      "& div": {
        flex: "0 0 9% !important",
        "&:nth-child(11n + 4)": {
          flex: "0 0 7% !important",
        },
        "&:nth-child(11n + 7), &:nth-child(11n + 8), &:nth-child(11n + 9)": {
          flex: "0 0 10% !important",
        },
      },
    },
  },
  history_order: {
    "&.g-table .item .grey02": {
      color: theme.palette2.grey[200],
    },
    "& .order_table_width": {
      "& div": {
        flex: "0 0 14%",
        "&:nth-child(8n + 1)": {
          flex: "0 0 12%",
        },
        "&:nth-child(8n + 2), &:nth-child(8n + 4)": {
          flex: "0 0 9%",
        },
      },
    },
  },
  mycount: {
    "&.g-table .item .grey02": {
      color: theme.palette2.grey[200],
    },
    "& .order_table_width": {
      "& div": {
        flex: "0 0 20%",
        "&:nth-child(5n + 1)": {
          flex: "0 0 15%",
        },
        "&:nth-child(5n + 5)": {
          flex: "0 0 25%",
        },
      },
    },
  },
  lever_margin_table: {
    "&.g-table .item .grey02": {
      color: theme.palette2.grey[200],
    },
    "& .order_table_width": {
      "& div": {
        "&:nth-child(9n + 2)": {
          flex: "0 0 9%",
        },
      },
      "& .option": {
        cursor: "pointer",
        "&.disabled": {
          color: theme.palette2.grey[200],
        },
      },
    },
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
        "&:nth-child(1)": {
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
  match_title: {
    padding: "0 16px",
    "& div": {
      color: theme.palette2.grey[300],
      borderBottom: `1px solid ${theme.palette2.grey[700]}`,
    },
  },
  match_info: {
    padding: "0 16px",
    "&:hover": {
      background: theme.palette2.grey[700],
    },
    "& div": {
      color: theme.palette2.grey[200],
      borderBottom: `1px solid ${theme.palette2.grey[700]}`,
      "& span": {
        margin: "0 0 0 5px",
      },
    },
  },
  // 持仓订单
  custom_order: {
    margin: " 0 16px",
    "& ul": {
      "& li": {
        borderBottom: `1px solid ${theme.palette2.grey[700]}`,
        padding: "24px 0",
      },
    },
    "& .first": {
      flex: 1.6,
    },
    "& .second": {
      flex: 1.6,
      marginLeft: 40,
    },
    "& .three": {
      flex: 1,
      marginLeft: 46,
    },
    "& .four": {
      flex: 1,
      marginLeft: 40,
    },
    "& .order_item": {
      height: 24,
    },
    "& label": {
      color: theme.palette2.grey[300],
      fontSize: 14,
      fontWeight: "normal",
    },
  },
  listTitle: {
    display: "flex",
    height: 24,
    alignItems: "center",
    margin: "0 0 8px 0",
    "& .first": {
      display: "flex",
      "& label": {
        ...theme.typography.subtitle3,
        color: theme.palette2.white,
        fontWeight: "bold",
        flex: 1,
        maxWidth: 224,
      },
      "& span": {
        ...theme.typography.subtitle3,
        flex: 1.12,
        "& em": {
          margin: "0 0 0 8px",
          padding: "0 10px",
          fontSize: 12,
          display: "inline-block",
          color: theme.palette.common.white,
          position: "relative",
          top: -1,
          lineHeight: "16px",
        },
      },
    },
    "& .four": {
      height: 24,
      position: "relative",
      top: 0,
      right: 0,
      textAlign: "right",
      color: theme.palette2.grey[300],
    },
  },
  content: {
    display: "flex",
    color: theme.palette2.grey[200],
    "& .underline": {
      cursor: "pointer",
      borderBottom: "1px dashed #68778b",
    },
    "& .first, & .second": {
      "& .order_item": {
        display: "flex",
        alignItems: "center",
        "& label": {
          flex: 1,
          maxWidth: 224,
        },
        "& span": {
          flex: 1.12,
        },
      },
    },
    "& .three, & .four": {
      "& label": {
        width: 72,
      },
    },
    "& .three": {
      "& .order_item": {
        "&:nth-child(2)": {
          marginTop: 48,
          "& :before, & :after": {
            display: "none",
          },
        },
      },
    },
    "& .four": {
      "& .order_item": {
        "&:nth-child(2)": {
          marginTop: 40,
        },
      },
      "& button": {
        minHeight: 32,
        width: "100%",
        padding: 0,
      },
    },
  },
  content_en: {
    "& .three, & .four": {
      "& label": {
        width: 90,
      },
    },
  },
  switchRoot: {
    width: 44,
    height: 24,
    margin: "0 3px 0 0",
    padding: 5,
  },
  switchBase: {
    padding: 0,
    top: 2,
    left: 3,
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: theme.palette.primary.main,
      opacity: 0.2,
    },
    "&.Mui-checked .MuiSwitch-thumb": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  switchThumb: {
    width: 20,
    height: 20,
    background: theme.palette2.grey[500],
  },
  switchTrack: {
    transition: theme.transitions.create(["background-color"]),
    borderRadius: 7,
    background: theme.palette2.grey[300],
    opacity: 0.2,
  },
  un: {
    color: theme.palette2.grey[300],
    fontSize: 14,
  },
  inputHeight: {
    height: 24,
    color: theme.palette2.grey[200],
    fontSize: 14,
  },
  filed: {
    color: theme.palette2.grey[200],
    height: 24,
    fontSize: 14,
    fontWeight: 500,
    "&:before": {
      borderBottom: `1px solid ${theme.palette2.grey[500]}`,
    },
    "&:hover": {
      "&:before": {
        borderBottom: `1px solid ${theme.palette2.grey[500]} !important`,
      },
    },
  },
  noBorder: {
    border: 0,
  },
  whole: {
    width: "100%",
  },

  tradeBtn: {
    margin: "0",
    padding: "8px 16px",
    background: theme.palette2.grey[800],
    "& .MuiButton-outlined": {
      border: `1px solid ${theme.palette2.grey[500]}`,
    },
    "& button": {
      fontSize: 12,
      color: theme.palette2.grey[300],
      backgroundColor: theme.palette2.background.paper,
      padding: "0 10px",
      lineHeight: "22px",
      minWidth: 72,
      fontWeight: "normal",
      transition: "none",
      marginRight: 8,
      "&.on": {
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.common.white,
        backgroundColor: `${theme.palette.primary.main}`,
      },
    },
  },

  trading_form_footer: {
    width: "100%",
    marginTop: 30,
  },

  planTradingBtn: {
    marginTop: 16,
  },

  inputSelectGroup: {
    height: 30,
    margin: "10px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: `1px solid ${theme.palette2.grey[500]}`,
    borderRadius: 2,
    "& .MuiInput-underline": {
      "&::after": {
        display: "none",
      },
      "&::before": {
        display: "none",
      },
    },
  },
  inputSelectGroup_inputRoot: {
    flex: 1,
    padding: "0 8px",
    width: "100%",
    fontSize: 12,
    position: "relative",
    border: "none",
    "& legend": {
      height: 0,
    },
    "& fieldset": {
      top: 0,
    },
    "& input": {
      color: theme.palette2.grey[100],
      fontWeight: 500,
      fontSize: 14,
      padding: "0 8px 0 0",
      height: "100%",
      boxSizing: "border-box",
      caretColor: theme.palette2.grey[100],
      fontFamily: "system-ui",
      "&.Mui-disabled": {
        fontWeight: "normal",
      },
    },
  },

  inputSelectGroup_inputFocus: {
    backgroundColor: "transparent",
    "& fieldset": {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },

  inputSelectGroup_selectRoot: {
    width: 48,
    padding: "0 8px",
    fontSize: 13,
    color: theme.palette.primary.main,
    alignItems: "center",
    position: "relative",
    "&::before": {
      content: '" "',
      display: "block",
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      margin: "auto 8px auto 0",
      height: 12,
      width: 1,
      borderRight: `1px solid ${theme.palette.primary.main}`,
    },
    "& .MuiSelect-select.MuiSelect-select": {
      paddingRight: 0,
    },
  },

  inputSelectGroup_selectFocus: {
    border: "none !important",
    backgroundColor: "transparent",
    "& fieldset": {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },

  selectIcon: {
    color: theme.palette.primary.main,
    top: 0,
    bottom: 0,
  },

  inputSelectGroup_select: {
    paddingRight: "0!important",
    display: "block",
  },
});
