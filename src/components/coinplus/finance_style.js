export default (theme) => ({
  financeCont: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "40px auto 48px",
  },
  list: {
    "& .g-table": {
      background: theme.palette.common.white,
      minHeight: 400,
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
        // marginTop: 12
      },
      "& .item": {
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
        color: theme.palette.text.primary,
        fontSize: 14,
        height: 60,
        padding: "3px 0 25px",
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
  action: {
    display: "flex",
    color: theme.palette.grey[500],
    // "& a": {
    //   color: theme.palette.primary.main,
    //   fontSize: 12,
    //   fontWeight: "bold",
    //   marginLeft: 40,
    //   "&:first-child": {
    //     marginLeft: 0
    //   }
    // },
    "& div:last-child": {
      textAlign: "right",
    },
    "& button": {
      width: 120,
      height: 32,
      padding: "2px 5px",
      marginLeft: 40,
      "&:first-child": {
        marginLeft: 0,
      },
    },
  },
  up: {
    color: theme.palette.up.main,
  },
  down: {
    color: theme.palette.down.main,
  },
  order_table_width: {
    marginTop: 20,
    "& div": {
      "&:nth-child(6n+1)": {
        minWidth: 200,
      },
      "&:nth-child(6n+2)": {
        minWidth: 130,
      },
      "&:nth-child(6n+3), &:nth-child(6n+4), &:nth-child(6n+5)": {
        minWidth: 150,
      },
      "&:last-child": {
        minWidth: 280,
        textAlign: "right",
      },
    },
  },
  profit: {
    ...theme.typography.heading,
    color: theme.palette.secondary.dark,
    "& em": {
      ...theme.typography.subtitle2,
      color: theme.palette.secondary.dark,
    },
  },
});
