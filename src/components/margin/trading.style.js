export default (theme) => ({
  tradingForm: {
    height: 302,
    margin: "4px 0 0",
    background: theme.palette2.grey[800],
    borderRadius: 2,
    overflow: "hidden",
    position: "relative",
  },
  tabs: {
    minHeight: 32,
    height: 32,
    background: theme.palette2.grey[900],
    borderBottom: `1px solid ${theme.palette2.line}`,
    "& .MuiTabs-flexContainer": {
      height: "100%",
      padding: "0 16px",
    },
    "& .MuiTab-root": {
      minWidth: "auto",
      minHeight: "100%",
      color: theme.palette2.grey[200],
      padding: 0,
      marginRight: 16,
      display: "flex",
      alignItems: "center",
      fontSize: 14,
      lineHeight: "20px",
      opacity: 1,
      "&.Mui-selected": {
        color: theme.palette2.white,
      },
    },
    "& .MuiTabs-indicator": {
      backgroundColor: theme.palette.primary.main,
    },
  },
});
