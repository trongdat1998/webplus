export default theme => ({
  orderWrap: {
    width: "390px",
    "& a": {
      margin: "4px",
      color: theme.palette.primary.main
    }
  },
  top: {
    marginBottom: "12px"
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    color: theme.palette.grey[500]
  },
  available: {
    color: "#4f4f4f",
    "&>em": {
      color: theme.palette.secondary.dark,
      cursor: "pointer",
      padding: "0 5px"
    }
  },
  recharge: {
    color: theme.palette.primary.dark,
    cursor: "pointer"
  },
  order: {
    width: "100%",
    "& + label": {
      marginTop: "-2px"
    }
  },
  input: {
    fontSize: "20px",
    // fontWeight: "bold",
    color: "#242B32",
    "&::input-placeholder": {
      fontSize: "14px"
    }
  },
  helper: {
    ...theme.typography.body2,
    lineHeight: "24px",
    minHeight: 24,
    margin: 0,
  },
  agreement: {
    color: theme.palette.primary.main
  },
  bottomButton: {
    marginTop: "28px",
    padding: "6px 0px"
  },

  checkAlert: {
    color: "red"
  },
  bottomText: {
    lineHeight: "32px",
    color: theme.palette.grey[800]
  },
  select: {
    ...theme.typography.body2,
    height: 32,
    margin: 0,
    "& >span": {
      padding: "7px 4px 7px 0"
    },
    "& svg": {
      width: 18,
      height: 18
    }
  },
  label: {
    ...theme.typography.body2,
    color: theme.palette.grey[500],
  },
  checkRoot: {
    color: theme.palette.grey[800]
  },
});
