export default (theme) => ({
  doc: {
    width: 1150,
    background: "#333c5a",
    padding: 30,
    margin: "50px auto",
    "& h2": {
      fontSize: 16,
      color: "#c4cad7",
      lineHeight: "40px",
      margin: "0 0 20px",
    },
    "& p": {
      fontSize: 14,
      color: "#9ca5b0",
      lineHeight: "24px",
      margin: "0 0 20px",
    },
  },
  willopen: {
    width: 1150,
    background: "rgba(39, 45, 66, 1)",
    margin: "30px auto",
    position: "relative",
    "& h2": {
      color: "#c4cad7",
      fontSize: 20,
      fontWeight: 300,
      lineHeight: "24px",
      margin: "0 0 20px",
    },
    "& div": {
      background: "#333c5a",
      padding: "30px 50px",
      color: theme.palette.common.white,
      fontSize: 14,
      lineHeight: "22px",
      height: 544,
      "& p": {
        fontSize: 16,
        margin: "20px 0 0",
      },
    },
    "& em": {
      fontSize: 32,
      lineHeight: "45px",
      width: 1150,
      color: "#68778b",
      position: "absolute",
      top: 290,
      left: 0,
      textAlign: "center",
    },
  },
  exchange: {
    width: "100%",
    minHeight: 682,
    position: "relative",
    textAlign: "center",
    "& div": {
      position: "absolute",
      left: "50%",
      top: 250,
      transform: "translate(-50%, -50%)",
    },
  },
  access: {
    background: theme.palette.common.white,
    width: "100%",
    padding: "100px 0",
  },
  content: {
    width: 760,
    margin: "0 auto",
    textAlign: "center",
    "& img": {
      height: 48,
    },
    "& div": {
      margin: "40px 0 0",
      color: theme.palette.common.black,
      textAlign: "left",
      "& p": {
        fontSize: 14,
        lineHeight: "20px",
      },
      "& a": {
        color: theme.palette.primary.main,
      },
    },
  },
  body: {
    overflow: "hidden",
  },
  banner: {
    width: 1232,
    margin: "0 auto 50px",
    padding: "0 24px 0 40px",
    "& h2": {
      fontSize: 86,
      margin: "66px 0 0",
      color: "#fff",
      fontWeight: "bold",
      lineHeight: "116px",
    },
    "& img": {
      height: 182,
      display: "block",
      margin: 0,
    },
    "& p": {
      fontSize: 50,
      fontWeight: 500,
      height: 90,
      lineHeight: "88px",
      color: "#56CCF2",
      margin: "-18px 0 0",
    },
  },
  hbccontent: {
    width: 1232,
    margin: "0 auto",
    textAlign: "center",
    "& > div": {
      margin: "0 0 16px",
      "&:last-of-type": {
        margin: "0 0 48px",
      },
    },
    "& h3": {
      fontSize: 28,
      lineHeight: "41px",
      height: 32,
      color: "#56CCF2",
      fontWeight: 500,
    },
  },
  bg: {
    background:
      "linear-gradient(90deg, rgba(1, 57, 255, 0.1) 0%, rgba(1, 57, 255, 0) 100%), linear-gradient(90deg, rgba(86, 204, 242, 0.05) 0%, rgba(86, 204, 242, 0) 100%)",
    borderTop: "1px solid rgba(12, 44, 105, 1)",
    position: "relative",
    "&:before, &:after": {
      position: "absolute",
      content: `""`,
      top: 0,
      height: "95%",
      width: 1,
      background:
        "linear-gradient(180deg, rgba(12, 44, 105, 1), rgba(12, 44, 105, 0))",
    },
    "&:before": {
      left: 0,
    },
    "&:after": {
      right: 0,
    },
  },
});
