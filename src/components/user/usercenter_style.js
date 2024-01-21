export default (theme) => ({
  btn: {
    minWidth: 112,
  },
  center: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "50px auto 100px",
  },
  usercenter_title: {
    ...theme.typography.display1,
    color: theme.palette.common.text,
    margin: "0 0 40px",
  },
  custom_config_title: {},
  password_title: {
    ...theme.typography.display1,
    color: theme.palette.common.text,
    margin: "0 0 15px",
  },
  apikey: {
    fontSize: 12,
  },
  password_tip: {
    ...theme.typography.body2,
    color: theme.palette.grey[500],
    margin: "0 0 40px",
  },
  kyc_title: {
    fontSize: 32,
    color: theme.palette.common.text,
    margin: "0 0 15px",
  },
  kyc_tip: {
    margin: "40px 0 32px",
    background: theme.palette.grey[50],
    padding: 16,
    "& h3": {
      ...theme.typography.subtitle2,
      fontWeight: "bold",
      marginBottom: 8,
    },
    "& ul": {
      padding: "0 0 0 20px",
    },
    "& li": {
      ...theme.typography.body2,
      color: theme.palette.grey[800],
      lineHeight: "20px",
      listStyle: "disc",
    },
  },
  formItem: {
    margin: "0 0 20px",
    display: "flex",
    minHeight: 65,
  },
  formItem2: {
    display: "flex",
    minHeight: 90,
    padding: "24px 0 20px",
    alignItems: "center",
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
  },
  selectoutline: {
    padding: "7px 15px",
  },
  forget: {
    width: 500,
  },
  userinfo: {
    display: "flex",
    "& img": {
      width: 72,
      height: 72,
      borderRadius: "50%",
      margin: "0 32px 0 0",
      boxShadow: theme.shadows[1],
    },
    "& ul": {
      flex: 1,
    },
    "& em": {
      ...theme.typography.caption,
      color: theme.palette.secondary.dark,
      display: "inline-block",
      lineHeight: "16px",
      padding: "0 6px",
      margin: "6px 10px 0 0",
      borderRadius: "2px",
      border: `1px solid ${theme.palette.secondary.dark}`,
    },
    "& strong": {
      ...theme.typography.display1,
      color: theme.palette.common.text,
      display: "inline-block",
      lineHeight: "40px",
    },
    "& li": {
      color: theme.palette.grey[500],
      display: "flex",
      alignItems: "flex-start",
    },
    "& a": {
      ...theme.typography.caption,
      color: theme.palette.primary.main,
      display: "inline-block",
      lineHeight: "16px",
      padding: "0 6px",
      borderRadius: "2px",
      border: `1px solid ${theme.palette.primary.main}`,
      margin: "6px 10px 0",
      "&:hover": {
        color: theme.palette.primary.dark,
      },
    },
    "& span": {
      ...theme.typography.caption,
      display: "inline-block",
      lineHeight: "16px",
      padding: "0 6px",
      borderRadius: "2px",
      margin: "6px 10px 0",
      border: `1px solid ${theme.palette.primary.main}`,
      color: theme.palette.primary.main,
    },
    "& i": {
      color: theme.palette.grey[200],
      margin: "-2px 0 0",
    },
    "& p": {
      lineHeight: "24px",
    },
  },
  module: {
    margin: "48px 0 64px",
  },
  module_item: {
    padding: "0 16px 16px 0",
    "& div": {
      width: "100%",
      height: "100%",
      background: theme.palette.grey[50],
      padding: 24,
      borderTop: `1px solid ${theme.palette.primary.main}`,
    },
    "&:nth-child(29n+1)": {
      "& div": {
        background: `url(${require("../../assets/u-icon-1.png")}) 336px 116px no-repeat ${
          theme.palette.grey[50]
        } `,
      },
    },
    "&:nth-child(29n+2)": {
      "& div": {
        background: `url(${require("../../assets/u-icon-7.png")}) 336px 116px no-repeat ${
          theme.palette.grey[50]
        } `,
      },
    },
    "&:nth-child(29n+3)": {
      "& div": {
        background: `url(${require("../../assets/u-icon-6.png")}) 352px 116px no-repeat ${
          theme.palette.grey[50]
        } `,
      },
    },
    "&:nth-child(29n+4)": {
      "& div": {
        background: `url(${require("../../assets/u-icon-3.png")}) 336px 116px no-repeat ${
          theme.palette.grey[50]
        } `,
      },
    },
    "&:nth-child(29n+5)": {
      "& div": {
        background: `url(${require("../../assets/u-icon-2.png")}) 336px 116px no-repeat ${
          theme.palette.grey[50]
        } `,
      },
    },
    "&:nth-child(29n+6)": {
      "& div": {
        background: `url(${require("../../assets/u-icon-5.png")}) 352px 116px no-repeat ${
          theme.palette.grey[50]
        } `,
      },
    },
    "&:nth-child(29n+7)": {
      "& div": {
        background: `url(${require("../../assets/u-center-fish.png")}) 336px 116px no-repeat ${
          theme.palette.grey[50]
        } `,
      },
    },
    "&:nth-child(29n+8)": {
      "& div": {
        background: `url(${require("../../assets/u-icon-4.png")}) 336px 116px no-repeat ${
          theme.palette.grey[50]
        } `,
      },
    },
    "&:nth-child(29n+9)": {
      "& div": {
        background: `url(${require("../../assets/u-icon-9.png")}) 352px 116px no-repeat ${
          theme.palette.grey[50]
        } `,
      },
    },
    "&:nth-child(3n)": {
      padding: "0 0 16px",
    },
    "& h2": {
      ...theme.typography.display1,
      color: theme.palette.common.text,
      "& i": {
        ...theme.typography.body1,
        color: theme.palette.grey[500],
      },
    },
    "& p": {
      height: 48,
      lineHeight: "24px",
      overflow: "hidden",
      margin: "0 0 16px",
      color: theme.palette.grey[500],
    },
  },
  sendTip: {
    color: theme.palette.grey[500],
    margin: "6px 0 0",
    fontSize: 12,
  },
  ga_item: {
    margin: "0 0 50px",
    "& dl": {
      display: "flex",
      margin: "0 0 16px",
      "& dt": {
        width: 24,
        margin: "0 16px 0 0",
        "& i": {
          display: "block",
          width: 24,
          height: 24,
          ...theme.typography.caption,
          background: theme.palette.grey[500],
          color: theme.palette.common.surface,
          textAlign: "center",
          lineHeight: "24px",
          borderRadius: "50%",
        },
      },
      "& dd": {
        flex: 1,
        padding: "4px 0 0",
        "& p": {
          ...theme.typography.body2,
          color: theme.palette.common.text,
        },
      },
    },
  },
  ga_link: {
    "& img": {
      width: 150,
      margin: "0 20px 0 0",
    },
  },
  api_item: {
    "& em": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
  api_tip: {
    color: theme.palette.grey[500],
  },
  add_address: {
    width: 460,
  },
  invite: {
    margin: "-5px 0 0",
  },
  invite_banner: {
    width: "100%",
    margin: "0 auto",
    height: 400,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  invite_info: {
    "& h2": {
      ...theme.typography.body1,
      color: theme.palette.grey[800],
      fontWeight: 400,
      margin: "0 0 10px",
    },
    "& em": {
      color: theme.palette.primary.main,
      cursor: "pointer",
      margin: "0 0 0 10px",
    },
    "& i": {
      color: theme.palette.primary.main,
      cursor: "pointer",
      borderRight: `1px solid ${theme.palette.grey[100]}`,
      padding: "0 10px 0 0",
    },
    "& p": {
      flex: 1,
    },
  },
  invite_line: {
    borderBottom: `1px solid ${theme.palette.grey[500]}`,
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0 5px",
  },
  invite_popover: {
    pointerEvents: "none",
  },
  invite_title: {
    ...theme.typography.subtitle1,
    color: theme.palette.common.text,
    margin: "40px 0 8px",
  },
  invite_count: {
    padding: "20px 24px 12px",
    "& strong": {
      ...theme.typography.heading,
      fontWeight: 700,
    },
    "& span": {
      ...theme.typography.body2,
      color: theme.palette.common.text,
      display: "block",
    },
  },
  invite_count_line: {
    borderLeft: `1px solid ${theme.palette.grey[100]}`,
  },
  tabsRoot: {
    margin: "30px 0 0",
  },
  tabRoot: {
    minWidth: 72,
    margin: "0 40px 0 0",
  },
  tabsIndicator: {},
  apiList: {
    background: "none",
    margin: "20px 0 0",
    "& .tbody": {
      borderTop: `1px solid ${theme.palette.grey[100]}`,
    },
    "& .item": {
      color: theme.palette.common.text,
      borderBottom: `1px solid ${theme.palette.grey[100]}`,
      "&:hover": {
        background: theme.palette.grey[100],
      },
    },
  },
  inviteListTitle2: {
    "& div": {
      "&:nth-child(5n + 1)": {
        flex: "0 0 auto",
        width: "25%",
      },
      "&:nth-child(5n + 2)": {
        flex: "0 0 auto",
        width: "25%",
      },
      "&:nth-child(5n + 3)": {
        flex: "0 0 auto",
        width: "25%",
      },
      "&:nth-child(5n + 4)": {
        flex: "0 0 auto",
        width: "25%",
        textAlign: "right",
        padding: "0 20px 0 0",
      },
    },
  },
  veriBox: {
    margin: "20px 0px 10px",
    minHeight: 60,
    minWidth: 395,
  },
  item: {
    display: "none",
  },
  on: {
    margin: "0 0 30px",
    display: "flex",
    justifyContent: "space-between",
    "& p": {
      padding: "4px 0 0",
      "& i": {
        fontSize: 12,
      },
    },
  },
  verify_title: {
    "& span": {
      ...theme.typography.subtitle2,
      display: "inline-block",
      margin: "0 10px 0 0",
      cursor: "pointer",
    },
  },
  emailtype: {
    display: "flex",
    alignItems: "flex-start",
  },
  grey100: {
    color: theme.palette.grey[100],
  },
  grey200: {
    color: theme.palette.grey[200],
  },
  grey500: {
    color: theme.palette.grey[500],
  },
  pics: {
    margin: "45px 0 0",
  },
  pic_tip: {
    margin: "16px 0",
    "& strong": {
      ...theme.typography.subtitle2,
      color: theme.palette.common.black,
      fontWeight: 500,
      lineHeight: "24px",
      display: "block",
    },
    "& ul": {
      display: "flex",
    },
    "& li": {
      margin: "0 10px 0 0",
      color: theme.palette.grey[500],
      lineHeight: "18px",
    },
    "& p": {
      ...theme.typography.body2,
      margin: "0 10px 0 0",
      color: theme.palette.grey[500],
      lineHeight: "21px",
    },
  },
  upload: {
    marginTop: 24,
  },
  kyc_uploads: {
    margin: "16px 0 0",
  },
  kyc_upload: {
    display: "flex",
    justifyContent: "space-between",
    "& div": {
      width: 250,
      height: 156,
    },
    "& img": {
      maxWidth: "100%",
      maxHeight: "100%",
      display: "block",
    },
  },
  kyc_upload_image: {
    display: "block",
    position: "relative",
    border: `1px dashed ${theme.palette.grey[500]}`,
    textAlign: "center",
    "& img": {
      maxWidth: "100%",
      maxHeight: "100%",
      margin: "0 auto",
    },
    "& strong": {
      display: "flex",
      width: "100%",
      height: "100%",
      position: "absolute",
      left: 0,
      top: 0,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      color: theme.palette.grey[500],
    },
    "& i": {
      marginBottom: 15,
    },
  },
  key_loading: {
    height: 500,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  kyc_review: {
    margin: "20px 0",
  },
  kyc_success: {
    "& em": {
      ...theme.typography.subtitle3,
      color: theme.palette.common.black,
      fontWeight: 500,
      lineHeight: "24px",
      display: "block",
      margin: "0 0 10px",
    },
    "& li": {
      margin: "0 0 10px",
      "& label": {
        display: "inline-block",
        margin: "0 10px 0 0",
      },
    },
  },
  kyc_fail: {
    "& em": {
      ...theme.typography.subtitle3,
      color: theme.palette.common.black,
      fontWeight: 500,
      lineHeight: "24px",
      display: "block",
      margin: "0 0 10px",
    },
    "& p": {
      margin: "15px 0",
    },
  },
  tableCell: {
    padding: "4px 18px",
  },
  submit: {
    width: 240,
    height: 48,
    marginTop: 40,
    fontSize: 16,
  },
  basic_status: {
    marginTop: 80,
    textAlign: "center",
    "& img": {
      width: 48,
      height: 48,
    },
    "& h2": {
      ...theme.typography.display1,
      color: theme.palette.common.black,
      marginTop: 24,
    },
    "& p": {
      ...theme.typography.body1,
      marginTop: 8,
      color: theme.palette.grey[800],
    },
  },
  btn_group: {
    margin: "40px auto 0",
    "& button": {
      width: 200,
      height: 48,
      margin: "0 40px",
      fontSize: 16,
    },
  },
  senior: {
    "& h2": {
      ...theme.typography.display1,
      color: theme.palette.common.text,
    },
    "& ul": {
      margin: "24px 0",
      "& li": {
        ...theme.typography.body2,
        margin: "0 0 8px",
        lineHeight: "32px",
        "& label": {
          margin: "0 10px 0 0",
          width: "134px",
          display: "inline-block",
          color: theme.palette.grey[500],
        },
      },
    },
  },
  reAuth: {
    ...theme.typography.body1,
    paddingBottom: 24,
    color: theme.palette.grey[800],
    lineHeight: "32px",
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    "& span": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
  vedio: {
    marginTop: 32,
    "& h2": {
      ...theme.typography.display1,
      color: theme.palette.common.text,
    },
    "& p": {
      marginTop: 16,
      fontSize: 16,
      lineHeight: "29px",
    },
    "& img": {
      marginTop: 24,
      width: 200,
      height: 200,
      boxShadow: theme.shadows[1],
    },
  },
  str: {
    ...theme.typography.caption,
    margin: "24px 0 0",
    color: theme.palette.grey[500],
    lineHeight: "16px",
    "& li": {
      ...theme.typography.caption,
      color: theme.palette.grey[500],
      lineHeight: "16px",
    },
  },
  select: {
    "& svg": {
      width: "7px !important",
      height: "7px !important",
      borderLeft: `1px solid ${theme.palette.common.text}`,
      borderBottom: `1px solid ${theme.palette.common.text}`,
      transform: "rotate(-45deg)",
      right: 6,
      top: 8,
      fill: theme.palette.common.white,
    },
  },
  tab: {
    display: "flex",
    height: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "0 0px 24px",
    "& i": {
      height: 20,
      borderLeft: `1px solid ${theme.palette.grey[200]}`,
      display: "block",
      width: 0,
    },
    "& div": {
      fontSize: 20,
      lineHeight: "24px",
      height: 24,
      padding: 0,
      cursor: "pointer",
      "&.on": {
        color: theme.palette.primary.main,
      },
      "&:first-child": {
        margin: "0 50px 0 0",
      },
      "&:last-child": {
        padding: "0 0 0 50px",
      },
    },
  },
  tab_on: {
    color: theme.palette.primary.main,
  },
  modal: {
    width: 628,
    maxWidth: 628,
    minHeight: 480,
    "& img": {
      maxWidth: 180,
      maxHeight: 320,
      display: "block",
      marginBottom: 24,
      background: "#F4F4F5",
      border: "1px solid #E9EAEB",
      boxSizing: "border-box",
      borderRadius: 2,
    },
  },
  modalTitle: {
    padding: 0,
    "& h2": {
      display: "flex",
      height: 56,
      borderBottom: `1px solid ${theme.palette.grey[50]}`,
      fontSize: 16,
      alignItems: "center",
      padding: "0 24px",
    },
    "& p": {
      flex: 1,
    },
  },
  modalContent: {
    margin: "0 24px",
    padding: "24px 0",
    justifyContent: "center",
    display: "flex",
  },
  posterItem: {
    textAlign: "center",
    width: 180,
    margin: "0 20px 0 0",
    "& .MuiButton-root": {
      width: "100%",
    },
    "&:last-of-type": {
      marginRight: 0,
    },
  },
  loading: {
    width: 180,
    height: 320,
    marginBottom: 24,
    background: "#F4F4F5",
    border: "1px solid #E9EAEB",
    boxSizing: "border-box",
    borderRadius: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  captchaWrapper: {
    display: "flex",
    justifyContent: "flex-end",
  },
});
