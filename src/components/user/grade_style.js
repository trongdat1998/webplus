import helper from "../../utils/helper";
export default (theme) => ({
  section: {
    width: "100%",
    maxWidth: 1200,
    minWidth: 1040,
    margin: "0 auto",
  },
  grade: {
    height: 400,
    width: "100%",
    padding: "48px 0 0",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundColor: "#1E2943",
    color: theme.palette.common.white,
    "& h2": {
      fontSize: "2.2857rem",
      lineHeight: "46px",
      margin: "0 auto 24px",
    },
  },
  con: {
    ...theme.typography.body2,
    display: "flex",
    padding: "0 12px",
  },
  grade_icon: {
    width: 104,
    margin: "0 32px 0 0",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    "& img": {
      height: 104,
      width: 104,
    },
    "& p": {
      ...theme.typography.subtitle1,
      lineHeight: 1.5,
    },
  },
  trade_info: {
    lineHeight: 1.73,
    height: "100%",
    flex: 1,
    margin: "18px 0 0 56px",
    color: theme.palette.grey[50],
    borderRight: `1px solid ${helper.hex_to_rgba(
      theme.palette.common.white,
      0.1
    )}`,
    "& ul": {
      margin: "16px 0 0",
      "& li": {
        margin: "0 0 4px",
        display: "flex",
        "& label": {
          flex: 1,
          margin: "0 5px 0 0",
        },
        "& span": {
          flex: 1.6,
          color: theme.palette.primary.light,
        },
        "&:last-child": {
          margin: 0,
        },
      },
    },
  },
  fee_info: {
    flex: 2.84,
    lineHeight: 1.73,
    margin: "18px 40px 0 56px",
    color: theme.palette.grey[50],
    "& >p": {
      display: "flex",
      height: 24,
      "& label": {
        minWidth: 128,
        margin: "0 8px 0 0",
      },
      "& span": {
        color: theme.palette.primary.light,
        "& em": {
          fontSize: 20,
          lineHeight: "21px",
          margin: "0 5px 0 0",
        },
      },
    },
    "& ul": {
      margin: "16px 0 0",
      "& li": {
        margin: "0 0 4px",
        display: "flex",
        "& label": {
          flex: 1.23,
          margin: "0 5px 0 0",
        },
        "& span": {
          flex: 1,
          "& em": {
            color: theme.palette.primary.light,
            margin: "0 0 0 2px",
          },
        },
        "&:last-child": {
          margin: 0,
        },
      },
    },
  },
  desc: {
    margin: "-88px auto 48px",
    backgroundColor: theme.palette.common.white,
    borderRadius: 8,
    boxShadow:
      "0px 1px 10px rgba(0, 0, 0, 0.1), 0px 4px 5px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.08)",
    padding: "24px 32px 48px",
    "& h2": {
      fontSize: 24,
      lineHeight: "40px",
    },
    "& h3": {
      margin: "32px 0 16px",
      fontSize: 18,
      lineHeight: "32px",
    },
    "&.unlogin": {
      margin: "48px auto",
    },
  },
  desc_con: {
    margin: "16px 0 0",
  },
  about: {
    ...theme.typography.body2,
    wordBreak: "break-all",
    "& img": {
      maxWidth: "100%",
    },
    "& p": {
      lineHeight: 1.5,
      margin: "4px 0",
    },
    "& a": {
      color: theme.palette.primary.main,
    },
  },
  indicator: {
    transform: "scale(0.5,1)",
  },
  tabs: {
    minHeight: "auto",
    margin: "0 0 24px",
  },
  tab: {
    ...theme.typography.subtitle2,
    color: theme.palette.common.text,
    margin: "0 40px 0 0",
    padding: 0,
    minHeight: 42,
    minWidth: "auto",
  },
  table: {
    "& thead": {
      backgroundColor: theme.palette.background.part,
      "& .MuiTableRow-head": {
        // borderLeft: `1px solid ${theme.palette.background.part}`,
        // borderRight: `1px solid ${theme.palette.background.part}`,
        border: `1px solid ${theme.palette.grey[50]}`,
      },
    },
    "& tbody": {
      "& .MuiTableRow-root": {
        border: `1px solid ${theme.palette.grey[50]}`,
        borderTop: 0,
        "&:hover": {
          backgroundColor: theme.palette.background.part,
        },
        "&.selected": {
          border: `1px solid ${helper.hex_to_rgba(
            theme.palette.primary.main,
            0.4
          )}`,
          borderTop: 0,
          position: "relative",
          "& td": {
            borderTop: `1px solid ${helper.hex_to_rgba(
              theme.palette.primary.main,
              0.4
            )}`,
          },
          "& td:first-of-type": {
            color: theme.palette.primary.main,
            position: "relative",
            "& i": {
              position: "absolute",
              left: 8,
              top: "50%",
              marginTop: -12,
            },
          },
        },
        "& h4": {
          // fontWeight: 500,
          // margin: "3px 0"
        },
      },
    },
    "& th": {
      color: theme.palette.grey[800],
      padding: 0,
      border: 0,
      borderRight: `1px solid ${theme.palette.grey[50]}`,
      "&:last-of-type": {
        borderRight: 0,
      },
    },
    "& td": {
      border: 0,
      borderRight: `1px solid ${theme.palette.grey[50]}`,
      "&:nth-of-type(1)": {
        minWidth: 106,
        padding: "0 15px",
        "& p": {
          overflow: "hidden",
          maxWidth: 85,
          margin: "0 auto",
          whiteSpace: "nowrap",
        },
      },
      "&:nth-of-type(3), &:nth-of-type(4)": {
        minWidth: 128,
      },
      "&:nth-of-type(5)": {
        minWidth: 100,
      },
      "&:last-of-type": {
        borderRight: 0,
        color: theme.palette.primary.main,
        "&.error": {
          color: theme.palette.error.main,
        },
      },
    },
    "& .MuiTableCell-root": {
      paddingLeft: 0,
      paddingRight: 0,
      "& .whole": {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        "& em": {
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 35,
          height: "100%",
        },
      },
    },
    "& th em": {
      borderRight: `1px solid ${theme.palette.grey[50]}`,
      padding: "0 5px",
      "&:last-of-type": {
        borderRight: 0,
      },
    },
  },
  rate_table: {
    width: "100%",
    overflow: "scroll",
    border: `1px solid ${theme.palette.grey[50]}`,
    "& thead": {
      backgroundColor: theme.palette.background.part,
      "& .MuiTableRow-head": {
        borderTop: `1px solid ${theme.palette.grey[50]}`,
        borderBottom: `1px solid ${theme.palette.grey[50]}`,
      },
      "& th:first-of-type": {
        padding: 0,
        backgroundColor: theme.palette.background.part,
      },
    },
    "& tbody": {
      "& .MuiTableRow-root": {
        "& td": {
          backgroundColor: theme.palette.common.white,
        },
        "&:hover td": {
          backgroundColor: theme.palette.background.part,
        },
      },
    },
    "& th, & td": {
      color: theme.palette.grey[800],
      border: 0,
      borderRight: `1px solid ${theme.palette.grey[50]}`,
      minWidth: 115,
      borderBottom: `1px solid ${theme.palette.grey[50]}`,
      "&:last-of-type": {
        borderRight: 0,
      },
      "&:first-of-type": {
        position: "sticky",
        left: 0,
        boxShadow: "4px 4px 4px hsla(0,0%,39.2%,.1)",
        width: 115,
      },
    },
  },
  item: {
    margin: "0 0 15px",
    "&:last-of-type": {
      margin: 0,
    },
  },
  first: {
    "&.MuiTableRow-root:hover": {
      backgroundColor: "transparent !important",
    },
    "& td": {
      padding: "6px 5px",
    },
  },
  up: {
    padding: "9px 0",
    minHeight: 43,
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
  },
  down: {
    height: 80,
  },
  fold_up: {
    padding: 0,
    "& span": {
      fontSize: 12,
      lineHeight: "14px",
      color: theme.palette.error.main,
    },
  },
  red: {
    color: theme.palette.error.main,
  },
  way: {
    flex: 1,
    borderRight: `1px solid ${theme.palette.grey[50]}`,
    "& p": {
      minHeight: 40,
      "&:first-of-type": {
        borderBottom: `1px solid ${theme.palette.grey[50]}`,
      },
    },
    "&:last-of-type": {
      borderRight: 0,
    },
  },
  mask: {
    display: "flex",
    height: 66,
    position: "relative",

    "& >div:first-child": {
      textAlign: "center",
      flex: "1 1 0%",
      alignSelf: "flex-end",
      height: 33,
      lineHeight: "33px",
    },
    "& >div:last-child": {
      alignSelf: "flex-start",
      flex: "1 1 0%",
      height: 33,
      lineHeight: "33px",
    },
    "&:after": {
      position: "absolute",
      content: '""',
      width: 140,
      height: 1,
      background: theme.palette.grey[100],
      top: 30,
      left: -16,
      transform: "rotate(30deg)",
    },
  },
  tip: {
    margin: "8px 0",
    color: theme.palette.error.main,
  },
});
