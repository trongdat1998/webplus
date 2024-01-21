import dashboardBg from "../../assets/dashboard_bg.png";
import dashboardPointer from "../../assets/dashboard_pointer.png";

export default (theme) => ({
  leverAccountInfo: {
    flex: "1",
    height: 270,
  },
  header: {
    background: theme.palette2.grey[900],
    height: 32,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 12px",
    "& $left": {
      display: "flex",
      alignItems: "center",
      color: theme.palette2.grey[300],
      fontSize: "14px",
    },
    "& span": {
      fontSize: 12,
      height: "16px",
      minWidth: 24,
      lineHeight: "16px",
      display: "flex",
      alignItems: "center",
      marginLeft: "2px",
      textAlign: "center",
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: 2,
      fontWeight: "500",
      margin: "0 2px",
      letterSpacing: "0.004em",
      padding: "0 2px",
    },
    "& $right": {
      color: theme.palette2.grey[300],
      fontSize: 12,
      fontWeight: "500",
    },
  },
  left: {},
  right: {},
  content: {
    padding: "8px 16px",
    background: theme.palette2.grey[800],
  },
  empty: {
    height: 238,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      width: 56,
      height: "auto",
      marginBottom: 25,
    },
  },
  accountInfo: {
    background: theme.palette2.grey[800],
    marginBottom: 13,
  },
  accountInfoWrapper: {
    position: "relative",
  },
  accountInfoItem: {
    marginBottom: 8,
    "&:nth-last-child": {
      marginBottom: 13,
    },
    "& label": {
      color: theme.palette2.grey[300],
      fontSize: 12,
      lineHeight: "16px",
      fontWeight: 500,
    },
    "& span": {
      fontSize: 12,
      color: theme.palette2.grey[100],
    },
    "& p": {
      color: theme.palette2.grey[300],
      fontSize: 12,
      lineHeight: "16px",
    },
  },
  // 仪表盘
  dashboard: {
    position: "absolute",
    width: 72,
    height: 72,
    top: 52,
    right: 14,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  dashboardBg: {
    width: 56,
    height: 32,
    background: `url(${dashboardBg}) 0 0 no-repeat`,
    backgroundSize: "100% auto",
    position: "relative",
  },
  dashboardPointer: {
    width: 22,
    height: 8,
    position: "absolute",
    top: 24,
    left: 8,
    display: "inline-block",
    transition: "all .35s",
    transform: "rotate(0deg)",
    transformOrigin: "83% 53%",
    background: `url(${dashboardPointer}) 0 0 no-repeat`,
    backgroundSize: "100%",
  },
  riskRate: {
    marginTop: 12,
    color: "#6e8196",
    fontSize: 12,
    textAlign: "center",
  },
  // 操作
  operation: {
    paddingTop: 6,
    display: "flex",
    borderTop: `1px dashed ${theme.palette2.line}`,
  },
});
