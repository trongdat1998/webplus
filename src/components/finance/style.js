import helper from "../../utils/helper";

export default (theme) => ({
  rechange_error_msg: {
    margin: "16px 0",
    color: theme.palette.error.main,
  },
  financeCont: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "16px auto 48px",
  },
  forbidTime: {
    minHeight: 24,
    margin: "-23px 0 0",
    position: "relative",
    "& p": {
      color: theme.palette.secondary.dark,
    },
  },
  forbidTimebg: {
    background: theme.palette.secondary.dark,
    opacity: 0.1,
    height: 40,
  },
  forbidTimeInfo: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 40,
    width: "100%",
    display: "flex",
    alignItems: "center",
    minWidth: 1040,
    maxWidth: 1200,
    left: "50%",
    transform: "translate(-50%,0)",
  },
  list: {
    "& .g-table": {
      background: theme.palette.common.white,
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
        "& a": {
          cursor: "pointer",
        },
      },
      "& .loading": {
        color: theme.palette.grey[500],
      },
    },
  },
  finance_list: {
    "& .g-table .item": {
      height: 56,
    },
  },
  orderList: {
    "& >div:last-child": {
      padding: "10px 0 !important",
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
  tokenIcon: {
    display: "flex",
    alignItems: "center",
    "& img": {
      width: 18,
      height: 18,
      margin: "0 15px 0 0",
    },
    "& em": {
      width: 18,
      height: 18,
      margin: "0 15px 0 0",
      borderRadius: "50%",
      background: theme.palette.grey[100],
    },
    "& p": {
      "& span": {
        display: "block",
      },
      flex: 1,
      "& span:nth-child(1)": {
        ...theme.typography.body2,
        color: theme.palette.secondary.contrastText,
      },
      "& span:nth-child(2)": {
        ...theme.typography.caption,
        color: theme.palette.grey[500],
      },
    },
  },
  action: {
    display: "flex",
    color: theme.palette.grey[500],
    fontSize: 12,
    fontWeight: "bold",
    "& a": {
      color: theme.palette.primary.main,
      fontSize: 12,
      fontWeight: "bold",
      "& .rc-menu": {
        "& >li.rc-menu-submenu": {
          background: theme.palette.common.white,
        },
      },
      "& .rc-menu-submenu-title": {
        background: theme.palette.common.white,
        color: theme.palette.primary.main,
      },
    },
    "& div:last-child": {
      textAlign: "right",
    },
  },
  menu: {
    background: theme.palette.common.white,
  },
  menuitem: {
    ...theme.typography.body1,
    height: 40,
    lineHeight: "20px",
    background: theme.palette.common.white,
    "&:first-child": {
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
    },
    "&:last-child": {
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 2,
    },
    "&:hover": {
      background: theme.palette.grey[50],
    },
    "& a": {
      color: `${theme.palette.common.black} !important`,
      "&:hover": {
        color: `${theme.palette.primary.main} !important`,
      },
    },
  },
  menuitem2: {
    ...theme.typography.body1,
    height: 40,
    lineHeight: "20px",
    background: theme.palette.common.white,
    color: `${theme.palette.common.black} !important`,
    "&:first-child": {
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
    },
    "&:last-child": {
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 2,
    },
    "&:hover": {
      background: theme.palette.grey[50],
    },
  },
  topic: {
    display: "flex",
    margin: "8px 0 24px",
    height: 32,
    alignItems: "center",
    "& .accountList": {
      marginRight: 8,
      paddingRight: 16,
      borderRight: `1px solid ${theme.palette.grey[100]}`,
      display: "flex",
      alignItems: "center",
    },
    "& .second": {
      height: 32,
      display: "flex",
      alignItems: "center",
      flex: 1,
      marginLeft: 8,
      paddingLeft: 16,
      borderLeft: `1px solid ${theme.palette.grey[100]}`,
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
  select: {
    height: 32,
    margin: 0,
    "& >span": {
      padding: "7px 2px",
    },
    "& svg": {
      width: 18,
      height: 18,
    },
  },
  label: {
    ...theme.typography.body2,
    color: theme.palette.grey[500],
  },
  grey: {
    color: theme.palette.grey[500],
  },
  tabs: {
    background: theme.palette.common.white,
    color: theme.palette.common.text,
    padding: 0,
    "& button": {
      ...theme.typography.body2,
      minWidth: "auto",
    },
  },
  tab: {
    margin: "0 32px 0 0",
    "& > span": {
      "& >span": {
        padding: "6px 0",
      },
    },
  },
  order_table_width_rechange: {
    "& div": {
      flex: "0 0 auto !important",
      "&:nth-child(6n + 1)": {
        width: 120,
        padding: "0 0 0 30px",
        "& span": {
          display: "flex",
          alignItems: "center",
        },
        "& img": {
          margin: "0 5px 0 0",
        },
      },
      "&:nth-child(6n + 2)": {
        width: 150,
      },
      "&:nth-child(6n + 3)": {
        width: 150,
      },
      "&:nth-child(6n + 4)": {
        width: 300,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
      "&:nth-child(6n + 5)": {
        width: 55,
      },
      "&:nth-child(6n)": {
        flex: "1 !important",
      },
    },
  },
  order_table_width_cash: {
    "& div": {
      flex: "0 0 auto !important",
      "&:nth-child(6n + 1)": {
        width: 120,
        padding: "0 0 0 30px",
        "& span": {
          display: "flex",
          alignItems: "center",
        },
        "& img": {
          margin: "0 5px 0 0",
        },
      },
      "&:nth-child(6n + 2)": {
        width: 150,
      },
      "&:nth-child(6n + 3)": {
        width: 150,
      },
      "&:nth-child(6n + 4)": {
        width: 400,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
      "&:nth-child(6n + 5)": {
        width: 150,
      },
      "&:nth-child(6n)": {
        flex: "1 !important",
        textAlign: "right",
      },
    },
  },
  order_table_width: {
    "& div": {
      flex: "0 0 auto !important",
      "&:nth-child(6n + 1)": {
        width: 120,
        padding: "0 0 0 30px",
        "& span": {
          display: "flex",
          alignItems: "center",
        },
        "& img": {
          margin: "0 5px 0 0",
        },
      },
      "&:nth-child(6n + 2)": {
        width: 150,
      },
      "&:nth-child(6n + 3)": {
        width: 160,
      },
      "&:nth-child(6n + 4)": {
        width: 130,
      },
      "&:nth-child(6n + 5)": {
        flex: "1 !important",
      },
    },
  },
  order_table_width_coinplus: {
    "& div": {
      minWidth: 180,
      "&:last-child": {
        textAlign: "right",
      },
    },
  },
  order_ul: {
    minHeight: 80,
    padding: "0 30px 0 22px",
    "& li": {
      height: 40,
      display: "flex",
      alignItems: "center",
      "&:nth-child(2n)": {
        // borderTop: `1px solid ${theme.palette.grey[100]}`
      },
      "& label": {
        color: theme.palette.grey[500],
        margin: "0 10px 0 0",
      },
      "& em": {
        // color:
        //width: 520,
        "&:nth-child(4)": {
          //width: 360
        },
      },
      "& a": {
        color: theme.palette.common.black,
        "&:hover": {
          color: theme.palette.primary.main,
        },
      },
    },
  },
  fab: {
    background: theme.palette.background.default,
  },
  rechange: {
    padding: "42px 0 0",
    minWidth: 1040,
    maxWidth: 1200,
    margin: "0 auto",
  },
  rechange_s1: {
    width: 88,
  },
  rechange_s2: {
    flex: 1,
    padding: "0 150px 0 0",
    "& h2": {
      ...theme.typography.display2,
      color: theme.palette.common.text,
    },
  },
  s2_title: {
    margin: "32px 0 23px",
    display: "flex",
    alignItems: "flex-end",
    "& img": {
      width: 32,
      margin: "0 8px 0 0",
    },
    "& em": {
      ...theme.typography.display1,
      color: theme.palette.common.text,
      margin: "0 8px 0 0",
    },
    "& span": {
      ...theme.typography.body1,
      color: theme.palette.grey[500],
    },
  },
  s2_usdt_title: {
    margin: "0 0 23px",
    "& p": {
      margin: "0 10px 10px 0",
      color: theme.palette.grey[500],
    },
  },
  s2_address: {
    borderBottom: `1px dashed ${theme.palette.grey[500]}`,
    padding: "0 0 12px",
    margin: "24px 0 3px",
    "& p": {
      ...theme.typography.heading2,
      color: theme.palette.common.text,
      maxWidth: 660,
      wordBreak: "break-all",
    },
    "& h3": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
      margin: "0 0 4px",
    },
  },
  taglevel: {
    ...theme.typography.caption,
    color: theme.palette.error.main,
  },
  s2_desc: {
    margin: "48px 0",
    "& p": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
    },
    "& ul": {
      padding: "0 0 0 20px",
    },
    "& li": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
      listStyle: "initial",
      "& i": {
        color: theme.palette.secondary.dark,
        fontWeight: 700,
      },
    },
  },
  cash_tip: {
    "& p": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
    },
    "& ul": {
      padding: "0 0 0 20px",
    },
    "& li": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
      listStyle: "initial",
      "& i": {
        color: theme.palette.secondary.dark,
        fontWeight: 700,
      },
    },
  },
  rechange_s3: {
    width: 200,
  },
  s3_link: {
    textAlign: "right",
  },
  qrcode: {
    margin: "40px 0 0",
    "& img": {
      maxWidth: 200,
      margin: "0 0 5px",
    },
    "& p": {
      ...theme.typography.body1,
      textAlign: "center",
      color: theme.palette.grey[500],
      padding: "0 0 16px",
    },
  },
  address: {
    margin: "0 0 40px",
  },
  address_s1: {
    width: 88,
  },
  address_s2: {
    flex: 1,
    padding: "0 150px 0 0",
    "& h2": {
      ...theme.typography.display2,
      color: theme.palette.common.text,
    },
  },
  s2_form: {
    "& li": {
      height: 60,
      width: 520,
    },
  },
  addressListTitle: {
    "& div": {
      flex: "0 0 auto !important",
      "&:nth-child(6n + 1)": {
        width: 120,
      },
      "&:nth-child(6n + 2)": {
        minWidth: 570,
        maxWidth: 730,
        flex: "1 !important",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      "&:nth-child(6n + 3)": {
        width: 120,
      },
      "&:nth-child(6n + 4)": {
        width: 150,
      },
      "&:nth-child(6n + 5)": {
        width: 80,
        textAlign: "right",
        "& em": {
          color: theme.palette.primary.main,
          cursor: "pointer",
        },
      },
      "&:nth-child(6n)": {
        width: 150,
        textAlign: "right",
      },
    },
  },
  cash_kyc: {
    //width: 500
    "& p": {
      width: 250,
    },
  },
  cash_s1: {
    width: 88,
  },
  cash_s2: {
    flex: 1,
    padding: "0 130px 0 0",
    "& h2": {
      ...theme.typography.display2,
      color: theme.palette.common.text,
    },
  },
  cash_s3: {
    width: 200,
  },
  cash_from: {
    margin: "0 0 30px",
    position: "relative",
    "& ul": {
      position: "absolute",
    },
  },
  cash_on: {
    display: "block",
  },
  cash_hide: {
    display: "none",
  },
  cash_choose: {
    background: theme.palette.grey[100],
  },
  speed: {
    width: 500,
    margin: "20px 0 30px",
  },
  speed_left: {
    fontWeight: 700,
  },
  fee: {
    margin: "56px 0 0",
    "& span": {
      fontWeight: 700,
    },
  },
  cash_action: {
    margin: "0 0 30px",
    "& em": {
      fontWeight: 700,
      display: "block",
      margin: "0 0 10px",
    },
  },
  orderStatus: {
    margin: "30px auto",
    width: 584,
  },
  cash_status_tip: {
    ...theme.typography.display1,
    color: theme.palette.common.text,
    display: "block",
    margin: "40px auto 50px",
    textAlign: "center",
  },
  steproot: {
    padding: "24px 0",
  },
  orderStatusLabel: {
    color: theme.palette.grey[500],
    display: "block",
    lineHeight: "48px",
  },
  createAccount: {
    ...theme.typography.body2,
    color: theme.palette.common.text,
    borderRadius: 2,
    boxShadow: theme.shadows[1],
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  create_title: {
    padding: "24px 24px 0",
    ...theme.typography.subtitle2,
    color: theme.palette.common.text,
    fontWeight: 600,
    lineHeight: "24px",
    margin: "0 0 16px",
  },
  create_desc: {
    position: "relative",
    lineHeight: "40px",
    ...theme.typography.body2,
    color: theme.palette.secondary.dark,
    margin: "0 0 16px",
    "& p": {
      width: "100%",
      height: 40,
      lineHeight: "40px",
      padding: "0 24px",
      position: "absolute",
      left: 0,
      top: 0,
    },
    "& span": {
      display: "block",
      height: 40,
      background: theme.palette.secondary.dark,
      opacity: 0.05,
      width: "100%",
    },
  },
  create_form: {
    padding: "0 24px",
    margin: "0 0 24px",
    "& label": {
      ...theme.typography.body1,
      color: theme.palette.grey[500],
    },
  },
  risk: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "auto",
    color: theme.palette.grey[500],
    "& a": {
      color: theme.palette.primary.main,
    },
  },
  cash_risk: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "48px auto",
    "& h2": {
      ...theme.typography.display2,
      color: theme.palette.common.text,
    },
    "& p": {
      ...theme.typography.caption,
      color: theme.palette.secondary.dark,
      margin: "24px 0",
    },
    "& .theader": {
      "& div:last-child": {
        textAlign: "right",
      },
    },
    "& .item": {
      "& div:last-child": {
        textAlign: "right",
      },
    },
  },
  "@global": {
    ".node": {
      cursor: "pointer",
      "& circle": {
        stroke: "rgba(0,0,0,0)",
        strokeWidth: 3,
        position: "relative",
        "& div": {
          position: "absolute",
          width: 18,
          height: 18,
          background: "#fff",
        },
      },
      "& text": {
        fontSize: 12,
      },
    },
    ".link": {
      fill: "none",
      stroke: theme.palette.grey[200],
      strokeWidth: 2,
    },
  },
  trace: {
    minWidth: 1200,
  },
  trace_title: {
    height: 240,
    minWidth: 1200,
    margin: "0 auto",
    background: `url(${require("../../assets/trace_bg.jpg")}) no-repeat center;`,
    backgroundSize: "100% 100%",
    "& a": {
      color: theme.palette.secondary.main,
      fontSize: 14,
      margin: "0 0 0 20px",
      "&:hover": {
        color: theme.palette.secondary.light,
      },
    },
    "& div": {
      width: 1200,
      margin: "0 auto",
      color: theme.palette.primary.contrastText,
      padding: "48px 0",
    },
    "& h1": {
      fontSize: 36,
      margin: "0 0 24px",
    },
    "& p": {
      fontSize: 16,
      lineHeight: "24px",
    },
  },
  trace_conbox: {
    width: 1200,
    margin: "0 auto 40px",
    position: "relative",
  },
  trace_con: {
    width: 1200,
    margin: "0 auto",
    border: `1px solid ${theme.palette.grey[50]}`,
    minHeight: 500,
    "& p": {
      color: theme.palette.grey[500],
    },
  },
  trace_desc: {
    background: helper.hex_to_rgba(theme.palette.primary.main, 0.05),
    width: 1200,
    margin: "24px auto 16px",
    height: 96,
    padding: "16px 24px",
    "& strong": {
      fontSize: 14,
      color: theme.palette.grey[500],
    },
    "& ul": {
      display: "flex",
      margin: "20px 0 0",
    },
    "& li": {
      display: "flex",
      margin: "0 40px 0 0",
      alignItems: "center",
    },
    "& i": {
      width: 10,
      height: 10,
      borderRadius: 10,
      display: "block",
      margin: "0 8px 0 0",
    },
    "& dl": {
      margin: "0 0 0 40px",
      textAlign: "right",
    },
    "& dt": {
      fontWeight: 500,
      color: theme.palette.grey[500],
    },
    "& dd": {
      margin: "20px 0 0",
    },
  },
  trace_tip: {
    color: theme.palette.grey[800],
    position: "absolute",
    right: 16,
    top: 16,
  },
  card_bg: {
    background: "linear-gradient(180deg, #737B92 0%, #6A728A 100%)",
    borderRadius: 4,
    overflow: "hidden",
  },
  card: {
    background: `url(${require("../../assets/finance_card.png")}) no-repeat top right`,
    backgroundSize: "530px 60px",
    height: 60,
    alignItems: "center",
    color: theme.palette.common.white,
    fontSize: 15,
    padding: "0 20px 0 30px",
    "& button, & a": {
      minWidth: 100,
      height: 34,
      fontSize: 12,
      borderRadius: 17,
      marginLeft: 20,
    },
  },
  btn1: {
    borderColor: theme.palette.common.white,
    color: theme.palette.common.white,
    "&.Mui-disabled": {
      borderColor: "#A3AABE",
      color: "#A3AABE",
    },
  },
  btn2: {
    color: "#17181A",
    background: theme.palette.common.white,
    "&.Mui-disabled": {
      background: "#A3AABE",
      color: "rgba(0, 0, 0, 0.5)",
    },
  },
  activity_finance: {
    padding: "15px 0",
  },
  submit_paper: {
    width: 345,
    minHeight: 220,
    textAlign: "center",
    "& img": {
      width: 50,
      height: 60,
      margin: "0 0 10px",
    },
    "& p": {
      fontSize: 15,
      lineHeight: "22px",
      fontWeight: "bold",
    },
    "& button": {
      margin: "24px 0 0",
      height: 44,
    },
  },
  apply_paper: {
    width: 375,
    minHeight: 377,
    "& .MuiDialogTitle-root": {
      padding: "20px 15px 10px",
      "& h2": {
        display: "flex",
        alignItems: "center",
      },
      "& p": {
        flex: 1,
        fontSize: 16,
        lineHeight: "24px",
      },
      "& i": {
        cursor: "pointer",
      },
    },
    "& .MuiDialogContent-root": {
      padding: "10px 15px",
    },
    "& .MuiDialogActions-root": {
      padding: 20,
      "& button": {
        height: 44,
        fontSize: 14,
        "&.Mui-disabled": {
          color: helper.hex_to_rgba(theme.palette.common.white, 0.8),
          background: theme.palette.grey[200],
          "& .MuiCircularProgress-colorPrimary": {
            color: helper.hex_to_rgba(theme.palette.common.white, 0.8),
          },
        },
      },
    },
  },
  reduce_info_bg: {
    background: "linear-gradient(180deg, #737B92 0%, #6A728A 100%)",
    borderRadius: 4,
    overflow: "hidden",
  },
  reduce_info: {
    background: `url(${require("../../assets/reduce_info_bg.png")}) no-repeat top right`,
    backgroundSize: "345px 100px",
    height: 100,
    textAlign: "center",
    color: theme.palette.common.white,
    padding: "20px 10px",
    "& p": {
      fontSize: 12,
      lineHeight: "16px",
    },
    "& h2": {
      fontSize: 30,
      lineHeight: "35px",
      fontWeight: 500,
      margin: "12px 0 0",
    },
  },
  reduce_input: {
    height: 70,
    width: "100%",
    "& .MuiInput-root": {
      height: "100%",
      "&:before, &:after": {
        borderColor: "#F9F9F9 !important",
      },
      "& input": {
        flex: 1,
        fontSize: 20,
        fontWeight: "bold",
        "&::placeholder": {
          color: theme.palette.grey[200],
          opacity: 1,
        },
      },
      "& p": {
        "& span": {
          marginRight: 10,
          "&:last-of-type": {
            color: theme.palette.primary.main,
            marginRight: 0,
            cursor: "pointer",
          },
        },
      },
    },
  },
  avai: {
    height: 50,
    color: theme.palette.grey[500],
    display: "flex",
    alignItems: "center",
  },
  result_paper: {
    background: `url(${require("../../assets/Coin.png")}) no-repeat top center, url(${require("../../assets/result_bg.png")}) no-repeat top center`,
    backgroundSize: "345px 155px, 100% 100%",
    boxShadow: "none",
    width: 345,
    height: 406,
    color: theme.palette.common.white,
    textAlign: "center",
    "& h3": {
      margin: "0 0 117px",
    },
    "& .info": {
      margin: "0 0 10px",
      "& h2": {
        fontSize: 18,
        lineHeight: "27px",
        fontWeight: "bold",
      },
      "& p": {
        fontSize: 12,
        lineHeight: "18px",
      },
    },
    "& button": {
      margin: "10px 0 0",
      background: "#E4C094",
      borderRadius: 3,
      color: "#28242A",
      fontWeight: 500,
      height: 44,
      fontSize: 14,
      "&:hover": {
        background: "#E4C094",
      },
    },
  },
  underweight_title: {
    padding: "40px 0 30px",
    fontSize: "2.4285rem",
    lineHeight: "46px",
    fontWeight: 400,
    letterSpacing: ".0025em",
  },
  text_right: {
    textAlign: "right",
  },
  flash_trades: {
    margin: "26px 0 0",
    "& button": {
      ...theme.typography.button,
      minWidth: 207,
      height: 32,
    },
    "& p": {
      color: theme.palette.error.main,
      fontSize: 13,
      lineHeight: "19px",
      margin: "11px 0 0",
    },
  },
});
