export default (theme) => ({
  content: {
    width: 488,
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
    "& .item:first-child": {},
  },
  borrowInstructions: {
    display: "flex",
    justifyContent: "space-between",
    "& .item:first-child": {
      textAlign: "left",
      "& label": {
        justifyContent: "flex-start",
      },
    },
    "& .item": {
      textAlign: "center",
      "& label": {
        justifyContent: "center",
      },
    },
    "& .item:last-child": {
      textAlign: "right",
      "& label": {
        justifyContent: "flex-end",
      },
    },
  },
  select: {
    //   display: "block",
    width: "100%",
    height: 48,
    //   position: "relative",
    //   "& svg": {
    // width: "7px !important",
    // height: "7px !important",
    // borderLeft: `1px solid ${theme.palette.common.text}`,
    // borderBottom: `1px solid ${theme.palette.common.text}`,
    // transform: "rotate(-45deg)",
    // fill: theme.palette.common.white,
    //   },
    "& .MuiSelect-icon": {
      width: "7px !important",
      height: "7px !important",
      borderLeft: `1px solid ${theme.palette.common.text}`,
      borderBottom: `1px solid ${theme.palette.common.text}`,
      transform: "rotate(-45deg)",
      fill: theme.palette.common.white,
      right: 18,
      top: 18,
    },
  },
  input: {
    width: "100%",
    height: 48,
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
  progress: {
    margin: "5px 7px",
    height: 28,
    "& .MuiSlider-root": {
      padding: "13px 0 !important",
    },
    // 轨道
    "& .MuiSlider-rail": {
      height: 2,
      backgroundColor: "#E9EAEB",
      opacity: 1,
    },
    // 选择
    "& .MuiSlider-track": {
      backgroundColor: theme.palette.primary.main,
    },
    "& .MuiSlider-mark": {
      width: 8,
      height: 8,
      borderRadius: "100%",
      border: `1px solid #FFF`,
      top: 9,
      opacity: 1,
      backgroundColor: "#E5EDFE",
      marginLeft: -5,
    },
    "& .MuiSlider-markActive": {
      backgroundColor: theme.palette.primary.main,
    },
    "& .MuiSlider-thumb": {
      width: 14,
      height: 14,
      backgroundColor: theme.palette.primary.main,
      top: 12,
      border: `1px solid #FFF`,
      margin: "-5px 0 0 -7px",
      "&:hover": {
        borderColor: "transparent",
      },
    },
  },
  leverage: {
    minWidth: "24px",
    height: "16px",
    lineHeight: "16px",
    borderRadius: "2px",
    marginLeft: "2px",
    marginLeft: 3,
    textAlign: "center",
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    fontWeight: "500",
    display: "inline-block",
  },
});
