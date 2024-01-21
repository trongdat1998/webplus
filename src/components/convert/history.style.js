export default (theme) => ({
  convertHistory: {
    minWidth: 1040,
    maxWidth: 1200,
    margin: "40px auto",
    "& h2": {
      ...theme.typography.display2,
      color: theme.palette.common.text,
      margin: "0 0 20px",
    },
    "& .g-table": {
      background: "none",
      "& .item": {
        color: theme.palette.common.text,
        border: 0,
        "&:hover": {
          background: theme.palette.grey[50],
        },
      },
      "& .loading": {
        color: theme.palette.grey[500],
      },
    },
    "& .theader": {
      color: theme.palette.grey[500],
      borderBottom: `1px solid ${theme.palette.grey[100]}`,
      "& div": {
        "&:first-child": {
          padding: 0,
        },
      },
    },
    "& .tbody": {
      borderTop: 0,
      marginTop: 8,
      maxHeight: "calc(100vh - 267px)",
    },
  },

  order_table_width: {
    "& div": {
      padding: "0 !important",
    },
  },
});
