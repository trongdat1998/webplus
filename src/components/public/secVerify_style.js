export default theme => ({
  noVerify_title: {
    padding: "24px 24px 8px"
  },
  noVerify: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    "& p": {
      fontSize: 14,
      color: theme.palette.grey[800],
      letterSpacing: 1,
      padding: "2px 0 10px",
      lineHeight: "20px",
      textAlign: "left",
      width: "100%"
    },
    "& em": {
      cursor: "pointer",
      height: 48,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      color: theme.palette.common.white,
      borderTop: `1px solid ${theme.palette.grey[200]}`,
      width: "100%",
      borderRadius: "5px 5px 0 0",
      "&:hover": {
        background: "rgba(0, 0, 0, 0.1)"
      }
    },
    "& div": {
      display: "flex",
      "& a": {
        display: "flex",
        position: "relative",
        width: 164,
        height: 88,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        color: theme.palette.common.text,
        border: `1px solid ${theme.palette.grey[100]}`,
        transition: "all 0.3s ease-in-out",
        background: theme.palette.grey[100],
        borderRadius: "3px",
        "&:nth-child(2n + 1)": {
          margin: "0 20px 0 0"
        },
        "&:hover": {
          border: `1px solid ${theme.palette.primary.main}`,
          color: theme.palette.primary.main
        },
        "& i": {
          position: "absolute",
          right: 8,
          top: 8,
          fontSize: 12,
          color: theme.palette.common.white,
          background: "linear-gradient(90deg, #FF695E -2.73%, #FF985E 97.21%)",
          display: "inline-block",
          height: 16,
          lineHeight: "16px",
          padding: "0 9px",
          borderRadius: "6px 6px 6px 0"
        }
      }
    }
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    height: 60,
    color: theme.palette.common.text,
    padding: "0 58px",
    fontSize: 16,
    borderBottom: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: "5px 5px 0 0",
    "& div": {
      width: 160,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  },
  title_one: {
    justifyContent: "center",
    "& div": {
      border: 0
    }
  },
  choose: {
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    cursor: "default"
  },
  veriBox: {
    margin: "20px 0px 10px",
    minHeight: 60,
    minWidth: 395
  },
  item: {
    display: "none"
  },
  on: {
    margin: "0 0 30px",
    display: "flex",
    justifyContent: "space-between",
    "& p": {
      padding: "4px 0 0",
      "& i": {
        fontSize: 12
      }
    }
  },
  verify_title: {
    "& span": {
      ...theme.typography.subtitle2,
      display: "inline-block",
      margin: "0 10px 0 0",
      cursor: "pointer"
    }
  },
  emailtype: {
    display: "flex",
    alignItems: "flex-start"
  }
});
