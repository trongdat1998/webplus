export default (theme) => ({
  finance_title_con: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "0px auto",
  },
  finance_title_box: {
    background: theme.palette.grey[50],
    padding: "40px 0 0",
  },
  finance_title: {
    margin: "0 0 40px 0",
    alignItems: "center",
    display: "flex",
    "& h2": {
      ...theme.typography.display2,
      padding: "0 40px 0 0",
      borderRight: `1px solid ${theme.palette.grey[100]}`,
    },
    "& p": {
      flex: 1,
      display: "block",
      height: "auto",
      marginLeft: 20,
      "& >span": {
        display: "block",
      },
    },
    "& a": {
      color: theme.palette.primary.main,
    },
  },
  header: {
    display: "flex",
    margin: "0 0 23px",
    "& ul": {
      display: "flex",
      flex: 1,
      "& li": {
        ...theme.typography.body1,
        minWidth: 70,
        margin: "0 32px 0 0",
        textAlign: "center",
        lineHeight: "40px",
        cursor: "pointer",
        "& a": {
          color: theme.palette.text.primary,
          display: "block",
          borderBottom: `2px solid rgba(0,0,0,0)`,
          "&:hover": {
            color: theme.palette.primary.main,
          },
        },
      },
      "& li.active a": {
        color: theme.palette.primary.main,
        fontWeight: "bold",
        borderBottom: `2px solid ${theme.palette.primary.main}`,
      },
    },
  },
  menu_hover: {
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  info: {
    ...theme.typography.body2,
    height: 32,
    display: "flex",
    alignItems: "center",
    "& span": {
      color: theme.palette.grey[500],
    },
    "& i": {
      color: theme.palette.common.text,
      margin: "0 0 0 10px",
    },
  },
});
