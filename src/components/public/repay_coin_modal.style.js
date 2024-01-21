export default (theme) => ({
  content: {
    width: 488,
    "& .item": {
      flex: 1,
      marginBottom: 18,
      position: "relative",
      "&:last-of-type": {
        marginBottom: 8,
      },
      "& label": {
        ...theme.typography.caption,
        color: theme.palette.grey[500],
        fontSize: 14,
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

  float: {
    position: "absolute",
    top: 0,
    right: 0,
    color: theme.palette.grey[500],
  },

  repayInstructions: {
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
        alignItems: "center",
        lineHeight: "24px",
      },
    },
    "& .item:last-child": {
      textAlign: "right",
      "& label": {
        justifyContent: "flex-end",
      },
    },
  },
  totalInstruction: {
    background: theme.palette.grey[50],
    borderRadius: 4,
    padding: 16,
    display: "flex",
    justifyContent: "space-between",
    "& .item": {
      textAlign: "center",
      marginBottom: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      "& label": {
        justifyContent: "flex-start",
        lineHeight: "22px",
        marginRight: 15,
      },
    },
    "& .row:last-child": {
      flex: 1,
      marginLeft: 20,
      "& .item": {
        textAlign: "right",
        justifyContent: "flex-end",
        "& label": {
          justifyContent: "flex-end",
        },
      },
    },
  },
  select: {
    width: "100%",
    height: 48,
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

  repayWrapper: {
    display: "flex",
    marginTop: 6,
  },

  // 还款方式
  repayWay: {
    width: 120,
    marginRight: 12,
  },

  tip: {
    ...theme.typography.caption,
    textAlign: "left",
    lineHeight: "40px",
    height: 40,
    fontSize: 14,
    margin: "10px 0",
    display: "flex",
    alignItems: "center",
    letterSpacing: "0.05em",
    color: "#50555B",
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
});
