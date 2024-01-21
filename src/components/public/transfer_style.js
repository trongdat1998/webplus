export default (theme) => ({
  content: {
    width: 344,
    "& .item": {
      flex: 1,
      marginBottom: 30,
      "&:last-of-type": {
        marginBottom: 8,
      },
      "& label": {
        ...theme.typography.caption,
        color: theme.palette.grey[500],
        display: "flex",
        "& span": {
          flex: 1,
          textAlign: "right",
        },
      },
    },
  },
  whole: {
    width: "100%",
    display: "flex",
    "& .item:first-child": {
      // marginRight: 56
    },
  },
  transIcon: {
    width: 56,
    height: 50,
    textAlign: "center",
    paddingTop: 25,
    cursor: "pointer",
  },
  select: {
    display: "block",
    width: "100%",
    position: "relative",
    "& svg": {
      width: "7px !important",
      height: "7px !important",
      borderLeft: `1px solid ${theme.palette.common.text}`,
      borderBottom: `1px solid ${theme.palette.common.text}`,
      transform: "rotate(-45deg)",
      right: 6,
      top: 8,
      fill: theme.palette.common.white,
    },
    "& .MuiSelect-select": {
      paddingRight: 0,
    },
  },
  tip: {
    ...theme.typography.caption,
    color: theme.palette.error.main,
    textAlign: "right",
  },
  total: {
    ...theme.typography.caption,
    position: "absolute",
    right: 0,
    top: 0,
    lineHeight: "30px",
    cursor: "pointer",
    color: theme.palette.primary.main,
    padding: "0 !important",
  },
  menuItem: {
    height: 32,
    padding: "0 16px",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  account_msg: {
    margin: "5px 0 10px",
    color: theme.palette.error.main,
  },
});
