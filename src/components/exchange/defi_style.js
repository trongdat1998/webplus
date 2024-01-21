import helper from "../../utils/helper";

export default (theme) => ({
  tokenInfo: {
    background: theme.palette.background.default,
  },
  topic: {
    background: "#031A5B",
    "& div": {
      background: `url(${require("../../assets/defi_bg.png")}) no-repeat #031A5B`,
      backgroundSize: "center",
      margin: "0 auto",
      width: 1200,
      height: 280,
    },
    "& h2": {
      fontSize: 46,
      color: theme.palette.common.white,
      padding: "50px 0 12px",
    },
    "& a": {
      background: "rgba(51, 117, 224, 0.2)",
      border: "1px solid #3D68AD",
      color: theme.palette.common.white,
      fontSize: 12,
      height: 30,
      display: "inline-flex",
      alignItems: "center",
      padding: "0 8px",
    },
    "& img": {
      margin: "0 0 0 6px",
    },
    "& p": {
      color: theme.palette.grey[100],
      fontSize: 14,
      lineHeight: "20px",
      margin: "20px 0 0",
      maxWidth: 600,
    },
  },
  tabsbox: {
    minWidth: 1200,
    width: "100%",
    background: "linear-gradient(180deg, #1A265E 0%, #162152 100%)",
  },
  tbs: {
    width: 1200,
    margin: "0 auto",
  },
  conbox: {
    padding: "0 20px",
    width: 1200,
    margin: "0 auto 200px",
    minHeight: 600,
  },
  tab: {
    fontSize: 14,
    color: theme.palette.common.white,
  },
  selected: {
    color: theme.palette.common.white,
  },
  tokenItem: {
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
    height: 80,
    "&:hover": {
      background: "rgba(51, 117, 224, 0.03)",
    },
    "& p": {
      display: "block",
      lineHeight: "16px",
      color: theme.palette.grey[500],
    },
    "& label": {
      display: "block",
      lineHeight: "24px",
    },
    "& strong, & label": {
      display: "block",
      lineHeight: "24px",
      fontWeight: 500,
      fontSize: 18,
      width: "100%",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    "& i": {
      color: theme.palette.primary.contrastText,
      height: 24,
      lineHeight: "24px",
      fontSize: 20,
      minWidth: 64,
      borderRadius: 2,
      "&.green": {
        color: theme.palette.up.main,
      },
      "&.red": {
        color: theme.palette.down.main,
      },
    },
    "& a": {
      background: helper.hex_to_rgba(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
      fontSize: 16,
      fontWeight: 500,
      display: "block",
      padding: "2px 0",
      textAlign: "center",
      height: 32,
      lineHeight: "28px",
      maxWidth: 100,
      minWidth: 80,
    },
  },
});
