export default (theme) => ({
  trade: {
    width: "100%",
    padding: "0 0 60px",
    background: "#0B131B",
  },
  banner: {
    width: "100%",
    height: 400,
    // position: "relative",
    backgroundColor: "#0D0D0D",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    "& img": {
      width: "100%",
      display: "block",
    },
  },
  t1: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    marginBottom: 8,
    background: `url(${require("../../assets/title_bg02.png")}) no-repeat`,
    backgroundSize: "368px 100%",
    "& p": {
      color: theme.palette.primary.contrastText,
      fontSize: 16,
      lineHeight: "23px",
      // letterSpacing: "4px",
      fontWeight: "bold",
      textAlign: "center",
    },
  },
  t2: {
    margin: "24px auto 36px",
    fontSize: 40,
    lineHeight: "40px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    padding: "0 20px",
    "& div": {
      "& em": {
        width: 56,
        height: 84,
        background:
          "radial-gradient(50% 50% at 50% 50%, #3375E0 0%,rgba(51, 117, 224, 0) 100%)",
        // "radial-gradient(50% 50% at 50% 50%, rgba(223, 157, 73, 0.5) 0%, rgba(223, 157, 73, 0) 100%)",
        opacity: 0.3,
        margin: 0,
        display: "block",
      },
    },
    "& p": {
      paddingTop: 16,
      fontSize: 40,
      lineHeight: "58px",
      fontWeight: "bold",
      color: theme.palette.primary.main,
      display: "flex",
      flexDirection: "column",
      marginTop: -84,
    },
    "& span": {
      fontSize: 16,
      lineHeight: "23px",
      fontWeight: "normal",
      color: theme.palette.grey[500],
    },
    "& em": {
      fontSize: 32,
      lineHeight: "56px",
      margin: "16px 4px 0",
      fontWeight: "bold",
      // alignItems: "center",
      color: theme.palette.primary.main,
      display: "flex",
      width: 16,
      justifyContent: "center",
    },
  },
  list: {
    width: 752,
    margin: "0 auto 16px",
    background: "#181B22",
    // boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${theme.palette.common.black}`,
    borderRadius: 6,
    padding: "0 32px 23px",
    "& h2": {
      ...theme.typography.heading,
      // fontWeight: "bold",
      fontSize: 26,
      lineHeight: "38px",
    },
    "& thead": {
      "& tr": {
        height: 64,
        "& th": {
          ...theme.typography.body2,
          color: theme.palette.grey[500],
          border: 0,
          padding: "0 10px",
          boxShadow: `0px 1px 0px ${theme.palette.common.black}`,
          "&:nth-of-type(1)": {
            paddingLeft: 0,
            width: "10%",
          },
          "&:nth-of-type(2)": {
            width: "35%",
          },
          "&:nth-of-type(3)": {
            width: "34%",
          },
          "&:nth-of-type(4)": {
            width: "21%",
          },
          "&:last-of-type": {
            padding: 0,
            textAlign: "right",
          },
        },
      },
    },
    "& tbody": {
      color: theme.palette.grey[800],
      "& tr": {
        height: 40,
        "&:nth-of-type(1), &:nth-of-type(2), &:nth-of-type(3)": {
          height: 56,
        },
        "& td": {
          ...theme.typography.body2,
          boxShadow: `0px 1px 0px ${theme.palette.common.black}`,
          padding: "0 10px",
          border: 0,
          color: theme.palette.grey[100],
          "&:nth-of-type(1)": {
            width: 24,
            height: 24,
            paddingLeft: 3,
            width: "10%",
            "& img": {
              width: 24,
              height: 24,
              top: 3,
              position: "relative",
            },
            "& span": {
              width: 24,
              textAlign: "center",
              display: "inherit",
            },
          },
          "&:nth-of-type(2)": {
            width: "35%",
          },
          "&:nth-of-type(3)": {
            width: "34%",
            "& p": {
              width: 210,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          },
          "&:nth-of-type(4)": {
            width: "21%",
          },
          "&:last-of-type": {
            padding: 0,
            fontWeight: "bold",
            textAlign: "right",
          },
        },
      },
    },
  },
  down: {
    color: `${theme.palette.down.main} !important`,
  },
  up: {
    color: `${theme.palette.up.main} !important`,
  },
  rule: {
    width: 752,
    margin: "0 auto",
    "& h3": {
      ...theme.typography.subtitle1,
      height: 40,
      display: "flex",
      alignItems: "center",
      fontWeight: "bold",
      color: theme.palette.common.white,
    },
    "& div": {
      marginTop: 8,
      color: theme.palette.grey[100],
      "& p": {
        fontSize: 14,
        lineHeight: "30px",
        color: theme.palette.grey[100],
      },
      "& a": {
        color: theme.palette.primary.main,
      },
    },
  },
  noborder: {
    border: 0,
  },
  noData: {
    textAlign: "center",
    color: theme.palette.grey[100],
  },
  status: {
    ...theme.typography.body1,
    height: 48,
    lineHeight: "48px",
    textAlign: "center",
    color: theme.palette.common.white,
    "& a": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
    "& p": {
      width: 752,
      margin: "0 auto",
      position: "relative",
      "& em": {
        position: "absolute",
        left: 0,
        top: 0,
        height: 2,
        width: "100%",
        background:
          "linear-gradient(90deg, rgba(51, 117, 224, 0) 0%, #3383E0 48.96%, rgba(51, 117, 224, 0) 100%)",
        // "linear-gradient(91.08deg, rgba(223, 157, 73, 0) 0%, #DF9D49 48.96%, rgba(223, 157, 73, 0) 100%)",
        opacity: 0.5,
        "&:last-of-type": {
          bottom: 0,
          top: "unset",
        },
        "&:first-of-type": {
          top: 0,
        },
      },
    },
  },
  tabs: {
    height: 56,
    display: "flex",
    margin: "0 auto 8px",
    cursor: "pointer",
    "& p": {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
      fontWeight: "bold",
      lineHeight: "29px",
      color: theme.palette.grey[500],
      position: "relative",
      "&.active": {
        color: theme.palette.primary.main,
        "& span": {
          borderBottom: `2px solid ${theme.palette.primary.main}`,
        },
      },
      "& span": {
        height: 64,
        lineHeight: "64px",
      },
    },
  },
  info: {
    margin: "24px auto 32px",
    width: 752,
    display: "flex",
    "& >div": {
      background: "#181B22",
      // boxShadow: "0px 2px 10px rgba(51, 117, 224, 0.16)",
      borderRadius: 6,
      flex: 1,
      border: `1px solid ${theme.palette.common.black}`,
      "&:nth-of-type(1)": {
        marginRight: 8,
      },
      "&:nth-of-type(2)": {
        marginLeft: 8,
      },
    },
  },
  personal_info: {
    "& ul": {
      padding: "0 24px",
      "& li": {
        height: 32,
        display: "flex",
        fontSize: 14,
        lineHeight: "20px",
        borderBottom: `1px solid ${theme.palette.common.black}`,
        alignItems: "center",
        "&:last-of-type": {
          border: 0,
        },
        "& label": {
          width: "50%",
          color: theme.palette.grey[200],
        },
        "& p": {
          width: "50%",
          textAlign: "right",
          color: theme.palette.common.white,
        },
      },
    },
  },
  loading: {
    color: theme.palette.grey[100],
  },
  bg: {
    width: 752,
    height: 432,
    background: "#181B22",
    border: `1px solid ${theme.palette.common.black}`,
    boxSizing: "border-box",
    borderRadius: 6,
    margin: "-16px auto 0",
    padding: "0 32px",
    "& >div": {
      width: 400,
      margin: "0 auto",
    },
    "& button": {
      height: 48,
      fontSize: 16,
    },
  },
  sign_up: {
    "& h2": {
      height: 63,
      fontSize: 20,
      color: theme.palette.primary.main,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderBottom: `1px solid ${theme.palette.common.black}`,
      fontWeight: "bold",
    },
    "& >div": {
      margin: "72px auto 0",
    },
  },
  text: {
    width: "100%",
    display: "block",
    height: 48,
    marginBottom: 32,
  },
  input: {
    height: 24,
    padding: "12px 16px",
    color: theme.palette.common.white,
  },
  root: {
    width: "100%",
    borderRadius: 2,
    "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.grey[800],
    },
    "&.Mui-focused:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: `${theme.palette.primary.main}`,
    },
    "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: `${theme.palette.error.main}`,
    },
    "& label": {
      minWidth: 48,
      color: theme.palette.grey[500],
    },
  },
  result: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
    "& i": {
      color: theme.palette.primary.main,
    },
    "& h2": {
      ...theme.typography.heading2,
      color: theme.palette.common.white,
      margin: "15px auto 98px",
      fontWeight: "bold",
    },
  },
});
