export default (theme) => ({
  financeCont: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "40px auto 48px",
  },
  list: {
    "& .g-table": {
      background: theme.palette.common.white,
      margin: "20px 0 0",
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
      },
      "& .loading": {
        color: theme.palette.grey[500],
      },
    },
    "& h3": {
      ...theme.typography.body1,
      color: theme.palette.secondary.contrastText,
      margin: "40px 0 0",
      "&:nth-of-type(1)": {
        margin: "20px 0 0",
      },
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
  option_info: {
    height: 88,
    width: "100%",
    background: theme.palette.grey[50],
    borderRadius: 4,
    padding: 24,
    margin: "16px 0 20px",
    display: "flex",
    alignItems: "center",
    "& img": {
      width: 40,
      height: 40,
      borderRadius: "50%",
      marginRight: 110,
    },
    "& p": {
      flex: 1,
      "& label": {
        ...theme.typography.body2,
        color: theme.palette.grey[500],
        display: "block",
      },
      "& em": {
        ...theme.typography.body2,
        color: theme.palette.common.text,
      },
    },
    "& a": {
      minWidth: 40,
      cursor: "pointer",
      color: theme.palette.primary.main,
    },
  },
  topic: {
    display: "flex",
    margin: "40px 0 24px",
    height: 32,
    alignItems: "center",
    "& .second": {
      height: 32,
      display: "flex",
      alignItems: "center",
      flex: 1,
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
  action: {
    display: "flex",
    color: theme.palette.grey[500],
    "& a": {
      color: theme.palette.primary.main,
      fontSize: 12,
      fontWeight: "bold",
      cursor: "pointer",
    },
    "& div:last-child": {
      textAlign: "right",
    },
  },
  up: {
    color: theme.palette.up.main,
  },
  down: {
    color: theme.palette.down.main,
  },
  upTab: {
    margin: "0 0 0 8px",
    padding: "0 10px",
    fontSize: 12,
    display: "inline-block",
    color: theme.palette.common.white,
    background: `rgba(81, 211, 114, 0.8)`,
  },
  downTab: {
    margin: "0 0 0 8px",
    padding: "0 10px",
    fontSize: 12,
    display: "inline-block",
    color: theme.palette.common.white,
    background: `rgba(247, 58, 70, 0.8)`,
  },
  order_table_width: {
    //marginTop: 20,
    "& div": {
      "&:nth-child(8n+1)": {
        minWidth: 200,
      },
      "&:nth-child(8n+2)": {
        minWidth: 90,
      },
      "&:nth-child(8n+3), &:nth-child(8n+4), &:nth-child(8n+5), &:nth-child(8n+6), &:nth-child(8n+7)": {
        minWidth: 130,
      },
      "&:last-child": {
        minWidth: 100,
        textAlign: "right",
      },
    },
  },
  order_table_ava_width: {
    "& div": {
      flex: 1,
      minWidth: 200,
    },
  },
  icon: {
    color: theme.palette.grey[500],
    marginLeft: 10,
  },
});
