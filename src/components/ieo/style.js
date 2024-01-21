export default theme => ({
  ieo: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "0 auto 20px"
  },
  s1: {
    padding: "24px 0 0",
    margin: "0 0 24px"
  },
  s1_p1: {
    width: 375,
    margin: "0 50px 0 0",
    "& img": {
      width: "100%"
    }
  },
  s1_p2: {
    flex: 1,
    margin: "0 80px 0 0",
    color: theme.palette.grey[800],
    fontSize: 14,
    "& h2": {
      color: theme.palette.common.text,
      fontSize: 20,
      fontWeight: 700,
      lineHeight: "30px",
      margin: "0 0 8px"
    },
    "& h3": {
      color: theme.palette.secondary.dark,
      fontSize: 18,
      lineHeight: "26px",
      margin: "0 0 8px",
      fontWeight: 700
    },
    "& h4": {
      color: theme.palette.common.text,
      fontSize: 18,
      lineHeight: "26px",
      margin: "0 0 8px"
    },
    "& div": {
      lineHeight: "24px"
    }
  },
  s1_p3: {
    flex: 1
  },
  timer: {
    position: "relative",
    height: 24,
    lineHeight: "24px",
    color: theme.palette.secondary.dark,
    "& div": {
      display: "flex",
      alignItems: "center",
      width: "100%",
      position: "absolute",
      height: 24,
      lineHeight: "24px",
      left: 0,
      top: 0,
      padding: "0 5px",
      "&:nth-child(2n)": {
        background: theme.palette.secondary.dark,
        opacity: 0.2
      },
      "& svg": {
        margin: "0 5px 0 0"
      }
    }
  },
  p3_2: {
    height: 24,
    margin: "8px 0",
    "& a": {
      color: theme.palette.primary.main
    }
  },
  buy_btn2: {
    "&:hover": {
      background: theme.palette.primary.light,
      color: theme.palette.primary.contrastText
    }
  },
  title: {
    margin: "24px 0 0",
    height: 40,
    lineHeight: "40px",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    "& span": {
      display: "block",
      width: 4,
      height: 16,
      background: theme.palette.primary.main,
      overflow: "hidden",
      margin: "0 10px 0 0"
    }
  },
  progress: {
    width: 580,
    "& svg": {
      fontSize: 32
    },
    "& .steps_span": {
      display: "block",
      color: theme.palette.grey[800]
    }
  },
  desc: {
    wordBreak: "break-all",
    "& img": {
      maxWidth: "100%"
    },
    "& p": {
      lineHeight: 1.5,
      margin: "10px 0"
    },
    // "& label": {
    //   width: 160,
    //   wordBreak: "break-all",
    //   color: theme.palette.grey[800]
    // },
    // "& span": {
    //   flex: 1,
    //   wordBreak: "break-all",
    //   "& img": {
    //     maxWidth: "100%"
    //   }
    // },
    "& a": {
      color: theme.palette.primary.main
    }
  },
  result: {
    margin: "10px -4px",
    "& span": {
      color: theme.palette.grey[800],
      margin: "0 0 8px",
      display: "block"
    },
    "& strong": {
      color: theme.palette.common.text,
      fontSize: 18,
      display: "block"
    }
  },
  result_title: {
    padding: "8px"
  },
  result_con: {
    textAlign: "center",
    padding: "14px 0",
    display: "flex",
    height: 104,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "column",
    "& p": {
      "& a": {
        color: theme.palette.primary.main
      }
    },
    "& h2": {
      fontSize: 16,
      color: theme.palette.secondary.dark
    },
    "& span": {
      background: theme.palette.secondary.dark,
      opacity: 0.7,
      display: "block",
      padding: "2px 10px",
      borderRadius: "18px"
    }
  },
  result_con2: {
    display: "flex",
    height: 200,
    alignItems: "center",
    justifyContent: "center"
  },
  result_bg: {
    background: `url(${require("../../assets/resultbg.png")}) no-repeat left top`,
    backgroundSize: "100% auto"
  },
  finance: {
    textAlign: "center",
    margin: "5px 0 0",
    "& a": {
      color: theme.palette.primary.main
    }
  },
  list: {},
  banner: {
    background: `url(${require("../../assets/ieo_bg.png")}) no-repeat center ${
      theme.palette.primary.main
    }`,
    backgroundSize: "auto 100%",
    height: 200,
    textAlign: "center",
    "& h2": {
      ...theme.typography.display2,
      color: theme.palette.primary.contrastText,
      lineHeight: "200px",
      height: 200
    }
  },
  content: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "20px auto"
  },

  datas: {
    padding: "0",
    borderTop: `1px solid ${theme.palette.grey[100]}`,
    "& .g-table": {
      background: "none",
      "& .tbody": {
        borderTop: `1px solid ${theme.palette.grey[100]}`
      }
    }
  },
  item: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    padding: "16px 0"
  },
  item_s1: {
    width: 260,
    margin: "0 25px 0 0",
    "& img": {
      width: "100%"
    }
  },
  item_s2: {
    minWidth: 400,
    flex: 1,
    padding: "0 100px 0 0",
    "& h3": {
      ...theme.typography.heading,
      color: theme.palette.common.text,
      height: 30,
      overflow: "hidden",
      whiteSpace: "nowrap",
      margin: "0 0 8px",
      "& a": {
        color: theme.palette.common.text,
        "&:hover": {
          color: theme.palette.primary.main
        }
      }
    },
    "& p": {
      ...theme.typography.body1,
      color: theme.palette.grey[800],
      height: 44,
      lineHeight: "22px",
      wordBreak: "break-all",
      overflow: "hidden",
      margin: "0 0 16px"
    },
    "& li": {
      color: theme.palette.grey[800]
    },
    "& span": {
      display: "inline-block",
      margin: "0 10px 0 0"
    }
  },
  item_s3: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 250
  },
  white: {
    color: theme.palette.primary.contrastText,
    "&:hover": {
      color: theme.palette.primary.contrastText
    }
  },
  order_table_width: {},
  order: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "50px auto",
    "& .g-table": {
      background: "none",
      "& .tbody": {
        borderTop: `1px solid ${theme.palette.grey[100]}`
      }
    }
  },
  order_title: {
    ...theme.typography.subtitle1,
    color: theme.palette.primary.main,
    margin: "0 0 50px"
  },
  order_more: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    "& p": {
      color: theme.palette.grey[500]
    }
  }
});
