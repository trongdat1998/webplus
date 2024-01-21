export default theme => ({
  broker: {
    margin: "50px auto 100px",
    minWidth: 1040,
    maxWidth: 1200,
    "& h2": {
      ...theme.typography.display1,
      color: theme.palette.secondary.contrastText,
      "& a": {
        color: theme.palette.secondary.contrastText,
        cursor: "pointer",
        marginRight: 20,
        paddingBottom: 5,
        "&.active": {
          color: theme.palette.primary.main,
          borderBottom: `2px solid ${theme.palette.primary.main}`
        }
      }
    }
  },
  invite_popover: {
    pointerEvents: "none"
  },
  broker_code: {
    marginTop: 40,
    "& h3": {
      ...theme.typography.body1,
      color: theme.palette.grey[800],
      fontWeight: 400,
      margin: "0 0 10px"
    },
    "& em": {
      color: theme.palette.primary.main,
      cursor: "pointer",
      margin: "0 0 0 10px"
    },
    "& i": {
      color: theme.palette.primary.main,
      cursor: "pointer",
      borderRight: `1px solid ${theme.palette.grey[100]}`,
      padding: "0 10px 0 0"
    },
    "& p": {
      flex: 1
    }
  },
  invite_line: {
    borderBottom: `1px solid ${theme.palette.grey[500]}`,
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0 5px"
  },
  qrcode: {
    display: "grid",
    marginTop: 20,
    alignItems: "flex-end",
    "& img": {
      boxShadow: theme.shadows[1],
      borderRadius: "4px",
      margin: "0 20px 20px 0"
    },
    "& button, & a": {
      width: 200,
      height: 40,
      fontSize: 14
    }
  },
  broker_list: {
    marginTop: 20,
  },
  header: {
    height: 28,
    display: "flex",
    "& li": {
      "&.active": {
        "& a": {
          display: "block",
          color: theme.palette.primary.main,
          borderBottom: `1px solid ${theme.palette.primary.main}`,
          fontWeight: "bold"
        }
      }
    }
  },
  search: {
    margin: "20px 0",
    "& >div": {
      marginRight: 20
    }
  },
  search_input: {
    "& input": {
      height: 24
    }
  },
  action: {
    color: theme.palette.primary.main,
    cursor: "pointer"
  },
  pagination: {
    height: 48,
    lineHeight: "48px",
    textAlign: "right",
    "& i": {
      width: 48,
      height: 48,
      lineHeight: "48px",
      textAlign: "center",
      cursor: "pointer",
      "&.disabled": {
        color: theme.palette.grey[500],
        cursor: "default"
      }
    }
  },
  table: {
    "& th, & td": {
      padding: "4px 5px"
    }
  },
  noData: {
    textAlign: "center",
    "& img": {
      width: 77,
      height: 66,
      margin: "0 0 16px"
    },
    "& p": {
      ...theme.typography.caption,
      color: theme.palette.grey[500]
    }
  },
  rate: {
    lineHeight: "36px",
    marginTop: 8,
    "& span": {
      "&:nth-of-type(1)": {
        marginRight: 8
      }
    }
  },
  dialog: {
    "& >div": {
      padding: 24
    }
  },
  dialog_content: {
    padding: "0 !important"
  },
  dialog_action: {
    padding: 0,
    margin: "10px 0 0"
  }
})