export default (theme) => ({
  login: {
    padding: "40px 60px",
  },
  content: {
    width: 480,
    margin: "0px auto",
    padding: 40,
    "& h1": {
      ...theme.typography.display2,
      color: theme.palette.common.text,
      margin: " 0 0 8px",
    },
  },
  formItem: {
    width: "100%",
    margin: "0 0 8px",
    minHeight: 66,
  },
  wrap: {
    backgroundSize: "cover !important",
    minHeight: "calc(100vh - 280px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mobile: {
    display: "flex",
  },
  loginbtn: {
    fontSize: "1.14285rem",
    fontWeight: 500,
    margin: "24px 0 32px",
    height: 48,
  },
  selectbox: {
    width: 100,
  },
  forgetpwd: {
    display: "flex",
    justifyContent: "space-between",
    "& span": {
      color: theme.palette.error.main,
    },
  },
  tab: {
    ...theme.typography.body1,
    color: theme.palette.common.text,
    margin: "16px 0 24px",
    display: "flex",
    "& div": {
      height: 32,
      margin: "0 40px 0 0",
      lineHeight: "24px",
      cursor: "pointer",
    },
  },
  tab_on: {
    ...theme.typography.subtitle2,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  national_code: {
    minWidth: 90,
    "&::before": {
      border: 0,
    },
  },
  link: {
    ...theme.typography.body2,
    color: theme.palette.grey[500],
    "& a": {
      color: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.primary.light,
      },
    },
  },
  checkbox: {
    padding: 0,
  },
  invite_register: {
    height: "100%",
    minHeight: 650,
    background: `url(${require("../../assets/landingbg.png")}) no-repeat center bottom #fff`,
  },
  invite_user: {
    padding: "96px 0 0",
    textAlign: "center",
    "& strong": {
      ...theme.typography.subtitle1,
      color: theme.palette.common.text,
      display: "block",
    },
    "& span": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
    },
  },
  invite_logo: {
    ...theme.typography.display2,
    color: theme.palette.common.text,
    textAlign: "center",
    margin: "32px 0 120px",
  },
  invite_btn: {
    textAlign: "center",
    "& a": {
      width: 150,
    },
  },
  invite_register2: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  invite_logo2: {
    textAlign: "center",
    "& h1": {
      ...theme.typography.display2,
      color: theme.palette.common.text,
      textAlign: "center",
      margin: "50px auto 0",
    },
    "& img": {
      maxHeight: 53,
    },
  },
  invite_download: {
    textAlign: "center",
    "& p": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
      margin: "0 0 28px",
    },
  },
  register_guide: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "70px auto 160px",
    "& h2": {
      ...theme.typography.display2,
      color: theme.palette.common.text,
      margin: "0 0 20px",
    },
    "& div": {
      textAlign: "center",
    },
    "& p": {
      textAlign: "center",
      "& a": {
        color: theme.palette.primary.main,
      },
    },
  },

  noTabFormItem: {
    marginTop: 16,
  },

  captchaWrapper: {
    display: "flex",
    justifyContent: "flex-end",
  },
});
