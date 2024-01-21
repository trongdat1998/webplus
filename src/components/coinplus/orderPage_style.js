export default theme => ({
  container: {
    minHeight: "600px",
    width: "100%",
    width: "100%",
  },
  screenWidth: {
    margin: "0 auto",
    maxWidth: "1200px",
    minWidth: "1040px"
  },
  screenWidthBorder: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`
  },
  borderShadow: {
    borderImage: "linear-gradient(#C4C4C4, rgba(196, 196, 196, 0))",
    opacity: 0.3,
    borderBottom: "32px solid transparent",
    borderImageSlice: "33%",
  },
  title: {
    ...theme.typography.display2,
    color: theme.palette.secondary.contrastText,
    marginTop: "45px",
    fontSize: "34px",
    width: "100%",
    paddingBottom: "8px"
  },
  backIcon: {
    backgroundColor: theme.palette.common.white
  },
  formHead: {
    color: "#000",
    padding: "50px 0 0",
    position: "relative",
    "&>button": {
      left: "-88px",
      position: "absolute",
      bottom: "1px"
    },
    "&>h2": {
      ...theme.typography.display2,
      color: "#000"
    }
  },
  formTitle: {
    ...theme.typography.heading,
    fontSize: "20px",
    margin: "40px 0 32px",
    fontWeight: "bold"
  },

  orderInfo: {
    display: "flex",
    justifyContent: "flex-start",

    "&>div:nth-child(1)": {
      flex: 1,
      padding: "39px 0",
      borderRight: `1px solid ${theme.palette.grey[100]}`
    },
    "&>div:nth-child(2)": {
      flex: 1,
      "&>div": {
        width: "390px",
        margin: "auto",
        padding: "39px 0 48px"
      }
    }
  },
  info: {
    overflow: "hidden",
    display: "flex",
    justifyContent: "space-between",
    "&>dl": {
      fontSize: "34px",
      "& dd:nth-child(1)": {
        ...theme.typography.display2,
        lineHeight: "32px",
        height: 32,
        minWidth: "175px",
        color: theme.palette.text.primary,
      },
      "& dd:nth-child(1)>em": {
        ...theme.typography.body1,
      },
      "& dd:nth-child(2)": {
        ...theme.typography.body2,
        color: theme.palette.grey[500],
        marginTop: "5px",
        minWidth: "175px"
      },
      "& dd:nth-child(3)": {
        minWidth: "175px"
      }
    }
  },
  highLight: {
    color: `${theme.palette.secondary.dark} !important`,
    "& em": {
      color: `${theme.palette.secondary.dark} !important`,
    }
  },
  labels: {
    padding: "60px 0 49px",
    display: "flex",
    justifyContent: "flex-start",
    "&>button": {
      marginTop: "10px",
      cursor: "default",
      padding: "6px 22px",
      height: "auto",
      marginRight: "24px",
      backgroundColor: "#ecf5ff",
      color: theme.palette.grey[800],
      boxShadow: "none",
      "&:active": { boxShadow: "none" },
      "&:hover": { backgroundColor: "#ecf5ff" }
    }
  },
  tab: {
    display: "inline-block",
    color: theme.palette.common.text,
    marginRight: "32px",
    "&>button": {
      padding: "0",
      fontSize: "16px",
      lineHeight: "20px"
    }
  },
  active: {
    color: theme.palette.primary.main,
    borderBottom: `1px solid ${theme.palette.primary.main}`
  },
  table1: {
    padding: "40px 0 0",
    whiteSpace: "no-wrap",
    "& dl": {
      position: "relative",
      marginBottom: "22px"
    },
    "& dt": {
      color: theme.palette.grey[500],
      width: "72px",
      position: "absolute",
      left: 0,
      top: 0
    },
    "& dd": {
      marginLeft: "80px",
      paddingRight:"200px"
    }
  },
  table2: {
    whiteSpace: "no-wrap",
    padding: "40px 0 0",
    "& dl": {
      marginBottom: "22px"
    },
    "& dt": {
      color: theme.palette.grey[800]
    },
    "& dd": {}
  },
  redeemOrder: {
    paddingBottom: 200
  },
  rules: {
    paddingBottom: "20px",
    margin: "11px auto 0",
    maxWidth: "1200px",
    minWidth: "1040px"
  }
});
