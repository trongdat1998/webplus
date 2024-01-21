export default theme => ({
  container: {
    width: "100%",
    minHeight: 600,
    backgroundColor: theme.palette.primary.contrastText
  },
  banner: {
    backgroundColor: "#3275e0",
    position: "relative",
    height: "240px",
    backgroundSize: "cover",
    width: "100%",
    marginTop: "-8px"
  },
  absolute: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%"
  },
  bannerContent: {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    color: theme.palette.primary.contrastText,
    "& h2": { fontSize: "30px" }
  },
  line: {
    marginTop: "15px",
    marginBottom: "3%",
    "&>h4": {
      borderRadius: "40px",
      padding: "5px 27px",
      border: `1px solid ${theme.palette.primary.contrastText}`,
      float: "left",
      margin: "0 18px",
      lineHeight: "20px"
    }
  },
  button: {
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.contrastText,
    padding: "5px 32px",
    "&:hover": {
      borderColor: theme.palette.primary.contrastText
    }
  },

  coinplusList: {
    width: "100%",
    maxWidth: 1200,
    minWidth: 1040,
    margin: "16px auto"
  }
});
