import helper from "../../utils/helper";

export default (theme) => ({
  container: {
    width: 544,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "80px auto",
    border: "1px",
    borderRadius: 4,
    background: "#fff",
    boxShadow:
      "rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px, rgba(0, 0, 0, 0.01) 0px 24px 32px",
  },
  convertHead: {
    width: "100%",
    height: 56,
    background: theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    fontSize: 14,
    color: "#FFF",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  convertHead_left: {
    display: "flex",
    alignItems: "center",

    "& label": {
      marginRight: 4,
    },
  },

  breathingLamp: {
    position: "relative",
    width: 18,
    height: 18,
    marginRight: 4,
  },

  breathingLamp_bg: {
    background: "#e4f8e4",
    animation: "$lightCircle infinite 1.2s",
    cursor: "pointer",
    position: "absolute",
    left: 0,
    top: 0,
    width: 18,
    height: 18,
    borderRadius: "50%",
  },

  "@keyframes lightCircle": {
    "0%": {
      transform: "scale(0.6)",
    },
    "50%": {
      transform: "scale(0.9)",
    },
    "100%": {
      transform: "scale(0.6)",
    },
  },

  breathingLamp_inner: {
    background: "#01AC8F",
    cursor: "pointer",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 6,
    height: 6,
    borderRadius: "50%",
  },

  convertHead_btn: {
    height: 32,
    width: 80,
    fontSize: 12,
    lineHeight: "32px",
    textAlign: "center",
    color: "#fff",
    background: theme.palette.primary.dark,
    borderRadius: 32,
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "none !important",
      background: helper.hex_to_rgba(theme.palette.primary.dark, 0.5),
    },
  },

  convertContent: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    padding: "88px 40px 56px 40px",
    position: "relative",
  },

  assetAvaliable: {
    position: "absolute",
    top: 48,
    right: 40,
    "& span": {
      color: theme.palette.primary.main,
    },
    "& .loading": {
      width: 10,
      height: 10,
    },
  },

  convertContentRow: {
    width: 464,
    height: 72,
    background: "#FFFFFF",
    border: "1px solid #E9EAEB",
    boxSizing: "border-box",
    borderRadius: 4,
    padding: "12px 24px",
    position: "relative",
    "& .inputLabel": {
      fontSize: 12,
      color: "#50555B",
      marginBottom: 4,
      display: "block",
    },
    "& .input": {
      width: 240,
      height: "100%",
      padding: 0,
      border: "none",
      fontWeight: 500,
      fontSize: 20,
      lineHeight: "24px",
      "&::-webkit-input-placeholder": {
        color: "#D3D5D6",
      },
      "&:focus": {
        outline: "none",
      },
    },

    "& .inputSelect": {
      display: "block",
      width: 176,
      height: "100%",
      outlined: "none",
    },
  },

  inputGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },

  convertTo: {
    margin: "18px 0",
    padding: "0 24px",
    position: "relative",
    "& svg": {
      color: theme.palette.primary.main,
    },
  },

  error: {
    position: "absolute",
    right: 24,
    top: 0,
    display: "none",
    color: "#ED3756",
    "&.active": {
      display: "block",
    },
  },

  convertBtn: {
    width: "100%",
    marginTop: 48,
    height: 48,
    fontWeight: 500,
    fontSize: 16,
  },

  confirmDialog: {},

  confirmDialogContent: {
    width: 320,
    height: 138,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    fontSize: 16,
    lineHeight: "24px",
    textAlign: "center",
    color: "#242B32",
  },
  confirmBtnGroup: {
    width: "100%",
    justifyContent: "space-between",
    "& .MuiButton-root": {
      width: "50%",
      textAlign: "center",
    },
  },
});
