export default (theme) => ({
  container: {
    minHeight: 600,
  },
  topImg: {
    display: "block",
    width: "56px",
    margin: "auto",
  },
  flex: {
    height: 600,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  flexCenter: {
    minWidth: 480,
  },
  title: {
    fontSize: "24px",
    textAlign: "center",
    margin: "25px 0 8px",
    lineHeight: "40px",
  },
  subTitle: {
    textAlign: "center",
    color: theme.palette.grey[500],
  },
  slider: {
    margin: "40px 0 16px -8px",
    padding: "5px 0",
    height: 4,
    "&.MuiSlider-root": {
      display: "block",
    },
    "& .MuiSlider-rail": {
      height: 2,
      background: theme.palette.grey[100],
      opacity: 1,
      borderRadius: 6,
      left: 8,
    },
    "& .MuiSlider-mark": {
      width: 16,
      height: 16,
      backgroundColor: theme.palette.common.white,
      border: `2px solid #e9e9e9`,
      borderRadius: "100%",
      boxSizing: "border-box",
      top: -2,
    },
    "& .MuiSlider-markActive": {
      borderColor: theme.palette.primary.light,
      opacity: 1,
    },
    "& .MuiSlider-thumb": {
      opacity: 0,
    },
    "& .MuiSlider-track": {
      background: theme.palette.primary.light,
      left: "8px !important",
    },
  },
  btns: {
    textAlign: "center",
    marginTop: "100px",
    "&>button": {
      width: 152,
      height: 32,
      margin: "0 32px",
      padding: 0,
    },
  },
  info: {
    display: "flex",
    marginTop: "22px",
    justifyContent: "space-between",
    "&>dl": {
      textAlign: "center",
    },
    "&>dl:nth-child(1)": {
      textAlign: "left",
    },

    "&>dl:last-child": {
      textAlign: "right",
    },
    "& dl dd:nth-child(1)": {
      color: theme.palette.grey[800],
      fontSize: "14px",
    },
    "& dl dd:nth-child(2)": {
      color: theme.palette.grey[500],
      fontSize: "12px",
    },
  },
});
