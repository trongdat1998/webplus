export default (theme) => ({
  footerBox: {
    width: "100%",
    background: theme.palette.black[800],
    zIndex: 5,
  },
  footer: {
    display: "flex",
    maxWidth: 1280,
    minWidth: 1280,
    margin: "0 auto",
    padding: "40px 0",
    minHeight: 256,
  },
  f_logo: {
    flex: 4,
    padding: "0 0 0 40px",
    "& a": {
      display: "flex",
      alignItems: "center",
      position: "relative",
      "& img": {
        maxWidth: 140,
        // maxHeight: 40
        maxHeight: 32,
      },
      "& span": {
        display: "flex",
        width: 32,
        height: 16,
        fontSize: 12,
        lineHeight: "14px",
        background: theme.palette.grey[500],
        color: theme.palette.common.text,
        borderRadius: "8px",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        right: 10,
        top: 2,
      },
      "&:hover": {
        "& i": {
          color: theme.palette.primary.main,
        },
        "& em": {
          color: theme.palette.primary.main,
        },
      },
    },
    "& em": {
      // fontSize: "1.14285rem",
      fontWeight: 500,
      letterSpacing: "0.0015em",
      color: theme.palette.grey[500],
      fontSize: 21,
      lineHeight: "24px",
    },
    "& p": {
      fontWeight: 400,
      fontSize: "0.857rem",
      letterSpacing: "0.004em",
      color: theme.palette.grey[500],
      margin: "10px 0 10px",
    },
  },
  contact: {
    display: "flex",
    flexWrap: "wrap",
    width: 246,
    "& li": {
      position: "relative",
      marginRight: 8,
      width: 32,
      "& a": {
        display: "block",
        "& i": {
          color: theme.palette.grey[200],
        },
        "&:hover": {
          "& i": {
            color: theme.palette.common.white,
          },
        },
      },
      "& img": {
        width: 23,
        height: 23,
      },
      "&:hover": {
        "& div": {
          display: "block",
          animation: "mymove 0.3s 1",
          transform: "scale(1,1)",
          opacity: 1,
          transition: "all 0.3s ease-in-out",
        },
      },
      "& div": {
        transform: "scale(0)",
        opacity: 0,
        position: "absolute",
        top: -115,
        left: -38,
        width: 100,
        height: 100,
        background: theme.palette.background.default,
        borderRadius: "3px",
        "& img": {
          width: 100,
          height: 100,
          borderRadius: "3px",
        },
        "&:after": {
          content: "",
          borderTop: `5px solid ${theme.palette.common.white}`,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          position: "absolute",
          bottom: -5,
          left: "50%",
          marginLeft: -5,
        },
      },
    },
  },
  f_content: {
    display: "flex",
    flex: 6,
    "&> li": {
      padding: "0 8px",
      flex: 1,
      "& h3": {
        ...theme.typography.body1,
        // paddingBottom: 8,
        fontWeight: 400,
        letterSpacing: "0.004em",
        color: theme.palette.grey[50],
        margin: "0 0 24px",
      },
      // "&:nth-child(3n)": {
      //   flex: 2
      // }
    },
  },
  f_subcontent: {
    "& li": {
      marginBottom: 8,
      lineHeight: "24px",
      "& a": {
        transition: "all 0.2s ease-in-out",
        fontWeight: 400,
        fontSize: "1rem",
        letterSpacing: "0.004em",
        color: theme.palette.grey[500],
        "&:hover": {
          color: theme.palette.common.white,
        },
      },
    },
  },
  header: {
    fontSize: "1.14285rem",
    height: 56,
    display: "flex",
    width: "100%",
    minWidth: 1280,
    justifyContent: "space-between",
    alignItems: "center",
    background: theme.palette.black[800],
    color: theme.palette.common.white,
    boxShadow: theme.shadows[1],
    zIndex: 5,
    letterSpacing: "0.005em",
  },
  left: {
    display: "flex",
    alignItems: "center",
    "& a": {
      color: theme.palette.common.white,
      whiteSpace: "nowrap",
      "&:hover": {
        // fontWeight: 500,
        color: theme.palette.common.white,
      },
      "&.active": {
        fontWeight: 500,
        color: theme.palette.common.white,
      },
    },
  },
  logo: {
    display: "flex",
    alignItems: "center",
    // width: 160px;
    padding: "0 16px",
    position: "relative",
    height: 56,
    "& img": {
      height: 26,
      display: "block",
    },
  },
  menu: {
    flex: 1,
    alignItems: "center",
    margin: 0,
    padding: 0,
    width: 400,
    display: "flex",
    marginLeft: 22,
    height: 56,
    "& div": {
      padding: "0 10px",
      position: "relative",
      display: "inline-block",
      lineHeight: "56px",
      zIndex: 500,
    },
    "& span": {
      whiteSpace: "nowrap",
      display: "block",
    },
  },
  mark: {
    fontSize: 12,
    color: theme.palette.common.white,
    height: 16,
    lineHeight: "16px",
    padding: "0 7px",
    display: "block",
    textAlign: "center",
    borderRadius: "4px",
    position: "absolute",
    right: 0,
    top: 3,
    transform: "scale(.8)",
    fontWeight: "bold",
    "& i": {
      border: `4px solid transparent`,
      width: 0,
      height: 0,
      position: "absolute",
      bottom: -3,
      left: 0,
    },
  },
  menuItem: {
    height: 18,
    "&:hover": {
      color: theme.palette.primary.main,
    },
    "& a": {
      color: theme.palette.common.text,
      display: "block",
      width: "100%",
      height: 46,
      lineHeight: "46px",
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
  },
  side: {
    display: "flex",
    alignItems: "center",
    padding: "0 6px 0 0",
    minWidth: 200,
    justifyContent: "flex-end",
    height: 56,
    lineHeight: "32px",
    "& a,& em": {
      color: theme.palette.common.white,
      whiteSpace: "nowrap",
      cursor: "pointer",
      "& i": {
        color: theme.palette.common.white,
      },
      "&:hover": {
        color: theme.palette.common.white,
        "& i": {
          color: theme.palette.common.white,
        },
      },
    },
  },
  active: {
    fontWeight: 500,
    color: theme.palette.common.white,
    "& i": {
      color: theme.palette.common.white,
    },
  },
  dMenu: {
    position: "relative",
    zIndex: 500,
    display: "flex",
    alignItems: "center",
    height: "100%",
    "&:hover": {
      "& ul": {
        display: "block",
      },
    },

    "& a": {
      display: "flex",
      alignItems: "center",
      padding: "0 10px",
      transition: "color .2s ease",
      "&:hover": {
        color: theme.palette.primary.main,
        "& i": {
          color: theme.palette.primary.main,
        },
      },
    },
  },

  dMenuLeft: {
    "& ul": {
      right: "50%",
      transform: "translate(50%, 0)",
    },
    "& a": {
      padding: 0,
    },
  },
  more: {
    color: theme.palette.common.white,
    marginTop: 1,
  },
  appdownload: {
    width: 150,
    right: -20,
    overflow: "hidden",
    padding: 0,
    "& ul": {
      display: "flex",
      alignItems: "center",
      color: theme.palette.common.text,
      textAlign: "left",
      "&:hover": {
        color: theme.palette.common.text,
        background: "none",
      },
    },
    "& strong": {
      display: "block",
      width: 220,
      wordBreak: "break-all",
      lineHeight: "22px",
      fontSize: 14,
      margin: "0 0 5px",
      maxHeight: 44,
      overflow: "hidden",
    },
    "& p": {
      ...theme.typography.subtitle2,
      color: theme.palette.common.text,
      fontSize: 14,
      // lineHeight: "18px",
      // maxHeight: 36,
      overflow: "hidden",
      textAlign: "center",
      paddingTop: 14,
      lineHeight: 1.5,
    },
  },
  userInfo: {
    fontWeight: 400,
    fontSize: "1.14285rem",
    letterSpacing: "0.00938em",
    display: "flex",
    flex: 1,
    alignItems: "center",
    margin: 0,
    height: "100%",
    "& div": {
      margin: 0,
      color: theme.palette.grey[500],
      display: "flex",
      alignItems: "center",
      height: "100%",
    },
    "& span": {
      whiteSpace: "nowrap",
      display: "block",
    },
    "& a,& em": {
      color: theme.palette.grey[200],
      whiteSpace: "nowrap",
      cursor: "pointer",
      transition: "color .2s",
      // padding: "0 10px",
      "& i": {
        color: theme.palette.grey[200],
      },
      "&:hover": {
        color: theme.palette.primary.main,
        "& i": {
          color: theme.palette.primary.main,
        },
      },
    },
  },
  login: {
    display: "flex",
    alignItems: "center",
    margin: 0,
    "& div": {
      fontWeight: 400,
      fontSize: "1.14285rem",
      letterSpacing: "0.00938em",
      padding: "0 10px",
      // flex: 1;
    },
    "& a": {
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
  },
  dMenuList: {
    display: "none",
    position: "absolute",
    zIndex: 501,
    top: 56,
    right: -6,
    background: theme.palette.background.default,
    padding: "8px 0",
    borderRadius: "4px",
    boxShadow: theme.shadows[1],
    overflow: "hidden",
  },
  dMenuItem: {
    color: theme.palette.common.text,
    minWidth: 150,
    "&:hover": {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.grey[50],
    },
    "& a": {
      padding: "8px 16px",
      display: "block",
      color: theme.palette.common.text,
      fontSize: "16px",
      lineHeight: "24px",
      "&:hover": {
        color: theme.palette.primary.main,
        fontWeight: "normal",
      },
    },
  },
  chooseLangBtn: {
    padding: 0,
    minWidth: 20,
    // marginLeft: 16,
    height: 28,
  },
  unread: {
    width: 8,
    height: 8,
    borderRadius: "100%",
    background: theme.palette.error.main,
    top: 12,
    right: 5,
    position: "absolute",
    zIndex: 10,
    // boxShadow: "0 0 0 1px #fff"
  },
  announce: {
    padding: "8px 0 0",
    textAlign: "left",
    color: theme.palette.common.black,
    "& h2": {
      ...theme.typography.subtitle2,
      padding: "7px 16px",
      fontSize: 16,
      fontWeight: "bold",
      borderBottom: `1px solid ${theme.palette.grey[50]}`,
      "& i": {
        marginRight: 8,
        marginTop: -2,
        color: theme.palette.common.black,
      },
    },
    "& li": {
      minWidth: 240,
      maxWidth: 380,
      ...theme.typography.body1,
      "& a": {
        padding: "7px 16px",
        fontSize: 14,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        lineHeight: "unset",
        "& span": {
          ...theme.typography.caption,
          color: theme.palette.grey[500],
          lineHeight: "16px",
        },
      },
    },
    "& p a": {
      ...theme.typography.body2,
      lineHeight: "56px",
      color: theme.palette.common.text,
      display: "block",
      textAlign: "center",
      borderTop: `1px solid ${theme.palette.grey[50]}`,
      "& i": {
        color: theme.palette.common.text,
      },
      "&:hover": {
        color: theme.palette.primary.main,
        "& i": {
          color: theme.palette.primary.main,
        },
      },
    },
  },
  user: {
    "& .info": {
      display: "flex",
      padding: "8px 16px 16px",
      alignItems: "center",
      maxWidth: 196,
      borderBottom: `1px solid ${theme.palette.grey[50]}`,
      "& img": {
        width: 40,
        height: 40,
        borderRadius: "100%",
        marginRight: 8,
      },
      "& strong": {
        color: theme.palette.common.text,
        fontSize: 14,
        lineHeight: "20px",
        fontWeight: "bold",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
    },
    "& li": {
      minWidth: 160,
      maxWidth: 196,
    },
  },
});
