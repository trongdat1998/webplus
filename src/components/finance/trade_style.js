import helper from "../../utils/helper";

export default (theme) => ({
  trade: {
    margin: "40px auto 0",
    minWidth: 1040,
    maxWidth: 1200,
  },
  title: {
    ...theme.typography.display2,
    color: theme.palette.secondary.contrastText,
    lineHeight: "40px",
    marginBottom: 30,
  },
  con: {
    display: "flex",
    minHeight: 440,
  },
  left: {
    flex: "1 1 55%",
    margin: "0 25px 20px 0",
  },
  right: {
    flex: "1 1 45%",
    margin: "0 0 20px 25px",
    padding: "30px 40px",
    height: 423,
    background: theme.palette.common.white,
    boxShadow: "0px 2px 10px rgba(163, 177, 204, 0.25)",
    borderRadius: 10,
    "& h3": {
      ...theme.typography.heading2,
      fontWeight: "bold",
    },
    "& .MuiTextField-root": {
      margin: "20px 0 0",
    },
    "& button": {
      ...theme.typography.button,
      margin: "20px 0 0",
      height: 32,
    },
    "& p": {
      ...theme.typography.caption,
      color: theme.palette.error.main,
      margin: "20px 0 0",
      lineHeight: "16px",
    },
  },
  header: {
    color: theme.palette.grey[500],
    "& li": {
      ...theme.typography.caption,
      padding: "0 20px",
      alignItems: "center",
      display: "flex",
      height: 40,
      "& p": {
        flex: 1,
        "&:last-of-type": {
          textAlign: "right",
        },
      },
    },
  },
  body: {
    "& li": {
      padding: "0 20px",
      height: 40,
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      "&:hover": {
        background: theme.palette.grey[50],
      },
      "& p": {
        flex: 1,
        "&:last-of-type": {
          textAlign: "right",
        },
      },
    },
  },
});
