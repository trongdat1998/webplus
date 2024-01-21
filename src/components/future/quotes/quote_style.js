import helper from "../../../utils/helper";
export default (theme) => ({
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
  financeTabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: "transparent",
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
    height: 32,
    borderBottom: `1px solid ${theme.palette2.line}`,
    display: "flex",
    "& span": {
      fontSize: 14,
      padding: "0 16px",
      color: theme.palette2.grey[200],
      height: 32,
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
    height: "calc(100% - 104px)",
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
    height: "calc(100% - 104px)",
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
      padding: "0 0 0 16px",
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
    },
    "& i.delete": {
      display: "inline-block",
      width: 16,
      fontSize: 16,
      visibility: "hidden",
      color: theme.palette2.grey[200],
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
    padding: "0 21px 0 16px",
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
      lineHeight: "20px",
      //   fontWeight: 500,
      "&:first-child": {
        fontSize: 16,
      },
    },
    "& em": {
      flex: "0 0 30%",
      display: "flex",
      flexDirection: "column",
      "&:nth-of-type(2)": {
        flex: "0 0 35%",
        textAlign: "right",
      },
      "& span": {
        fontSize: 12,
        color: theme.palette2.grey[300],
        lineHeight: "16px",
        margin: "4px 0 0",
      },
    },
  },
  arrow_all: {
    padding: "0 16px",
  },
  delivery: {
    height: "calc(100% - 104px)",
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
      height: "calc(100% - 64px)",
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
  // 交易面板
  more: {
    float: "right",
    fontSize: 12,
    height: 32,
    lineHeight: "32px",
    color: theme.palette.primary.main,
    cursor: "pointer",
    position: "absolute",
    right: 40,
    top: 0,
    "&:hover": {
      color: theme.palette.primary.light,
    },
  },
  tradeMore: {
    color: theme.palette2.grey[300],
    right: 12,
    "&:hover": {
      color: theme.palette2.grey[300],
    },
    "& i:hover": {
      color: theme.palette.primary.light,
    },
  },
  tradingForm: {
    background: theme.palette2.grey[800],
    borderRadius: 2,
    overflow: "hidden",
    position: "relative",
    height: "100%",
  },
  shrink: {
    position: "absolute",
    top: 4,
    left: -28,
    width: 24,
    height: 24,
    background: theme.palette.primary.main,
    textAlign: "center",
    lineHeight: "22px",
    cursor: "pointer",
    transition: "background 0.2s",
    "&:hover": {
      background: theme.palette.primary.light,
    },
    "& i": {
      color: theme.palette.common.white,
    },
  },
  limitTrading: {
    width: "100%",
    overflow: "hidden",
    padding: "16px 4px",
  },
  tradeBtn: {
    margin: "0 0 12px",
    "& .MuiButton-outlined": {
      border: `1px solid ${theme.palette2.grey[500]}`,
    },
    "& button": {
      fontSize: 12,
      color: theme.palette2.grey[300],
      padding: "0 10px",
      lineHeight: "22px",
      minWidth: 72,
      fontWeight: "normal",
      transition: "none",
      "&.on": {
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette2.grey[100],
      },
      "&:last-child": {
        borderLeftColor: theme.palette.primary.main,
      },
    },
  },
  tradeDesc: {
    "& span": {
      minWidth: 72,
      padding: "0 12px",
      margin: "0 0 0 8px",
      border: `1px solid ${theme.palette2.grey[500]}`,
      borderRadius: 2,
      color: theme.palette2.grey[100],
      fontSize: 12,
      lineHeight: "22px",
      display: "inline-block",
      textAlign: "center",
    },
  },
  radioGroup: {
    height: 30,
    padding: "0 12px",
    margin: "0 0 8px",
    display: "flex",
    "& .item": {
      padding: "3px 0",
      marginRight: 24,
      fontSize: 12,
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      "& em": {
        width: 16,
        height: 16,
        margin: 4,
        borderRadius: "100%",
        boxSizing: "border-box",
        border: `1px solid ${theme.palette2.grey[500]}`,
        "& i": {
          opacity: 0,
        },
      },
      "& label": {
        color: theme.palette2.grey[300],
        cursor: "pointer",
        borderBottom: `1px dashed ${theme.palette2.grey[300]}`,
      },
      "&.on": {
        "& em": {
          background: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "& i": {
            opacity: 1,
          },
        },
        "& label": {
          color: theme.palette2.grey[200],
        },
      },
    },
  },
  form: {
    padding: "0 12px",
    width: "50%",
    float: "left",
    color: theme.palette2.grey[300],
    position: "relative",
    overflow: "hidden",
    // margin: "8px 0 0",
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
    margin: "8px 0 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    "&:nth-child(4n+1)": {
      margin: "0",
    },
    // "& > div": {
    //   fontSize: 12,
    //   "&:nth-child(2n + 1)": {
    //     width: 48
    //   },
    //   "&:nth-child(2n)": {
    //     flex: 1,
    //     "& .g-input": {
    //       height: 30,
    //       borderColor: theme.palette2.grey[500],
    //       "&.g-input-focus": {
    //         borderColor: theme.palette.primary.main,
    //         background: "transparent"
    //       },
    //       "& .g-input-suffix": {
    //         color: theme.palette2.grey[300]
    //       },
    //       "& input": {
    //         color: theme.palette2.grey[100],
    //         padding: "0 8px",
    //         caretColor: theme.palette2.grey[100],
    //         fontWeight: "bold",
    //         "&:disabled": {
    //           fontWeight: "normal"
    //         }
    //       },
    //       "& .g-input-tip": {
    //         background: theme.palette2.grey[700],
    //         color: theme.palette2.grey[300]
    //       }
    //     }
    //   }
    // },
    "& em": {
      position: "absolute",
      width: "100%",
      height: 1,
      top: -1,
      left: 0,
    },
  },
  i1: {
    flex: 1,
    "& fieldset": {
      borderTopRightRadius: "0 !important",
      borderBottomRightRadius: "0 !important",
    },
  },
  i2: {
    width: 72,
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
  leverBox: {
    border: `1px solid ${theme.palette2.grey[500]}`,
    borderLeft: 0,
    borderRadius: 2,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: "0 0 0 3px",
    display: "flex",
    "& i": {
      color: theme.palette2.grey[200],
      lineHeight: "28px",
    },
    "&.on i": {
      transform: "rotate(180deg)",
    },
  },
  lever: {
    color: theme.palette2.grey[100],
    fontSize: 12,
    "& input": {
      textAlign: "right",
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
  progress: {
    margin: "5px 7px",
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
    margin: "0 0 4px",
    color: theme.palette2.grey[300],
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
    "& label": {
      color: theme.palette2.grey[200],
      marginLeft: 8,
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
    margin: "8px 0 0",
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
        background: theme.palette.up.main,
      },
    },
    "&.red": {
      background: helper.hex_to_rgba(window.palette.down.main, 0.8),
      color: theme.palette.common.white,
      "&:hover": {
        background: theme.palette.down.main,
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
      "&::placeholder": {
        color: theme.palette2.grey[300],
        opacity: 1,
        fontSize: 12,
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
  priceTypeIcon: {
    height: 28,
    lineHeight: "28px",
    width: 28,
    textAlign: "center",
    color: theme.palette2.grey[200],
    marginRight: -8,
    padding: "0 4px",
    cursor: "pointer",
    "&.on": {
      transform: "rotate(180deg)",
    },
  },
  //资产
  financeBg: {
    position: "relative",
    height: "100%",
    background: theme.palette2.grey[800],
  },
  finance: {
    padding: "16px 16px 0",
    "& ul": {
      height: "calc(100% - 32px)",
      background: theme.palette2.grey[800],
      borderBottom: `1px solid ${theme.palette2.grey[700]}`,
      "& li": {
        margin: "0 0 16px",
        display: "flex",
        fontSize: 12,
        lineHeight: "16px",
        "& span": {
          color: theme.palette2.grey[300],
          cursor: "pointer",
        },
        "& label": {
          flex: 1,
          color: theme.palette2.grey[200],
          textAlign: "right",
        },
      },
    },
  },
  riskAmount: {
    display: "flex",
    alignItems: "center",
    fontSize: 12,
    lineHeight: "16px",
    margin: "8px 0 0",
    "& span": {
      color: theme.palette2.grey[300],
      cursor: "pointer",
    },
    "& p": {
      flex: 1,
      color: theme.palette2.grey[200],
      margin: "0 -5px 0 0",
      "& i": {
        color: theme.palette2.grey[300],
        "&:hover": {
          color: theme.palette.primary.main,
        },
      },
      "& label": {
        display: "block",
        textAlign: "right",
        lineHeight: "24px",
        "&:nth-of-type(2)": {
          margin: "8px 0 0",
        },
      },
    },
  },
});
