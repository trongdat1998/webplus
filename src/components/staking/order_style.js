import helper from "../../utils/helper";
export default (theme) => ({
  screenWidth: {
    margin: "0 auto",
    maxWidth: "1200px",
    minWidth: "1040px",
  },
  order: {
    margin: "40px auto",
    "& h2": {
      ...theme.typography.display2,
      marginBottom: 20,
    },
    "& .g-table": {
      background: theme.palette.common.white,
      "& .theader": {
        ...theme.typography.caption,
        height: 40,
        "& >div": {
          color: theme.palette.grey[500],
        },
      },
      "& .tbody": {
        borderColor: theme.palette.grey[100],
        maxHeight: "calc(100vh - 198px)",
      },
      "& .item": {
        ...theme.typography.body2,
        color: theme.palette.common.text,
        borderColor: theme.palette.grey[100],
        height: 72,
        "&:hover": {
          background: helper.hex_to_rgba(theme.palette.primary.main, 0.03),
        },
        "& div .action": {
          color: theme.palette.common.text,
          "&:hover": {
            color: theme.palette.primary.main,
            cursor: "pointer",
          },
        },
      },
      "& .loading": {
        color: theme.palette.grey[500],
      },
    },
  },
  order_table_width: {
    "& .time": {
      color: theme.palette.grey[500],
    },
    "& .apr": {
      color: theme.palette.secondary.dark,
      "& em": {
        ...theme.typography.heading2,
      },
    },
    "& >div": {
      "&:first-child": {
        paddingLeft: "0 !important",
      },
      "&:last-child": {
        textAlign: "right",
      },
    },
  },
  schedule: {
    minWidth: 504,
    minHeight: 240,
    "& .MuiTableCell-root": {
      borderColor: theme.palette.grey[100],
    },
    "& .MuiTableCell-head": {
      ...theme.typography.caption,
      padding: "6px 0",
      color: theme.palette.grey[500],
      "&:first-child": {
        paddingLeft: 16,
      },
      "&:last-child": {
        paddingRight: 16,
      },
    },
    "& .MuiTableCell-body": {
      ...theme.typography.caption,
      padding: "2px 0",
      color: theme.palette.grey[800],
      "&:nth-of-type(2)": {
        color: theme.palette.grey[500],
      },
      "&:first-child": {
        paddingLeft: 16,
      },
      "&:last-child": {
        paddingRight: 16,
      },
    },
    "& .MuiTableRow-root": {
      "&:nth-of-type(even)": {
        background: theme.palette.grey[50],
      },
    },
  },
});
