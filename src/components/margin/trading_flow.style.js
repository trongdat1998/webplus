export default (theme) => ({
  tradingFlow: {
    height: 32,
    margin: "4px 0",
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    background: theme.palette2.grey[900],
    "& label": {
      color: "#6E8196",
      fontSize: "12px",
      lineHeight: "16px",
    },
  },
  leverSteps: {
    display: "flex",
    alignItems: "center",
  },
  leverStepItem: {
    fontSize: "12px",
    lineHeight: "16px",
    color: theme.palette.primary.main,
    margin: "0 20px",
    display: "flex",
    alignItems: "center",
    "& em": {
      border: `1px solid ${theme.palette.primary.main}`,
      width: 14,
      height: 14,
      lineHeight: "12px",
      fontSize: "12px",
      borderRadius: "50%",
      marginRight: "3px",
      textAlign: "center",
      display: "inline-block",
    },
    "& a": {
      cursor: "pointer",
    },
    "&:hover": {
      cursor: "handle",
    },
  },
  leverStepSplit: {
    color: theme.palette2.grey[300],
  },
});
