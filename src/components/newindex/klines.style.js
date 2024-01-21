export default (theme) => ({
  kline_bg: {
    padding: "0px 0 24px",
    background: theme.palette.black[800],
  },
  kline_box: {
    margin: "0 auto",
    width: "100%",
    minWidth: 1040,
    maxWidth: 1200,
    overflowY: "auto",
  },
  kline_content: {
    width: "100%",
    display: "flex",
  },
  kline_item: {
    width: 232,
    height: 112,
    position: "relative",
    zIndex: 1,
    border: `1px solid ${theme.palette.common.black}`,
    margin: "12px 10px 0 0",
    borderRadius: 4,
    overflow: "hidden",
    "&:last-of-type": {
      marginRight: 0,
    },
    "&:hover": {
      border: `1px solid ${theme.palette.primary.main}`,
      transition: "border-color .5s",
      // animationName: "$Float, $Bob",
      // animationDuration: ".5s, 1.5s",
      // animationDelay: "0s, .5s",
      // animationTimingFunction: "ease-out, ease-in-out",
      // animationIterationCount: "1, infinite",
      // animationFillMode: "forwards",
      // animationDirection: "normal, alternate"
      animationName: "$Float",
      animationDuration: ".3s",
      animationDelay: "0s",
      animationTimingFunction: "ease-out",
      animationIterationCount: 1,
      animationFillMode: "forwards",
      animationDirection: "normal",
    },
  },
  kline_line: {
    width: 1,
    height: 60,
    position: "absolute",
    right: 0,
    top: 30,
    background: theme.palette.grey[50],
  },
  kline_item_info: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: "16px 20px 7px 16px",
    zIndex: 2,
    cursor: "pointer",
    color: theme.palette.common.text,
    width: "100%",
    "& strong": {
      marginTop: 8,
      fontSize: 24,
      lineHeight: "35px",
      display: "inline-block",
      fontWeight: "bold",
      // "&:nth-of-type(2)": {
      "&.green": {
        color: theme.palette.up.main,
      },
      "&.red": {
        color: theme.palette.down.main,
      },
      // }
    },
    "& span": {
      ...theme.typography.subtitle2,
      lineHeight: "23px",
      fontWeight: "bold",
      color: theme.palette.common.white,
      display: "inline-block",
    },
    "& div": {
      display: "inline-block",
      fontSize: 16,
      fontWeight: "bold",
      lineHeight: "23px",
      float: "right",
    },
    "& p": {
      ...theme.typography.body2,
      lineHeight: "22px",
      color: theme.palette.grey[200],
    },
  },
  green: {
    color: theme.palette.up.main,
  },
  red: {
    color: theme.palette.down.main,
  },
  kline_canvas: {
    width: 230,
    height: 112,
    position: "absolute",
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  "@keyframes Float": {
    "100%": {
      transform: "translateY(-8px)",
    },
  },
  "@keyframes Bob": {
    "0%": {
      transform: "translateY(-8px)",
    },
    "50%": {
      transform: "translateY(-4px)",
    },
    "100%": {
      transform: "translateY(-8px)",
    },
  },
});
