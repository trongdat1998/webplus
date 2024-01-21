import helper from "../../utils/helper";
export default (theme) => ({
  coinplusCell: {
    "& > div:nth-child(1)": {
      ...theme.typography.body1,
      minWidth: "350px",
    },
    "& > div:nth-child(2)": {
      minWidth: "180px",
    },
    "& > div:nth-child(3)": {
      minWidth: "350px",
    },
    "& > div:nth-child(4)": {
      minWidth: "160px",
    },
    display: "flex",
    padding: "24px 0",
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    justifyContent: "space-between",
    "&:nth-of-type(1)": {
      borderTop: `1px solid ${theme.palette.grey[100]}`,
    },
    "&:hover": {
      background: helper.hex_to_rgba(theme.palette.primary.main, 0.03),
    },
    "& div": {
      ...theme.typography.body2,
      alignSelf: "center",
      lineHeight: "24px",
    },
  },
  coinplusCellRate: {
    "& > dl >dd:nth-child(1)": {
      ...theme.typography.heading,
      color: theme.palette.secondary.dark,
      fontWeight: "bold",
      lineHeight: "30px",
      "&>em ": {
        ...theme.typography.subtitle2,
      },
    },
    "& > dl >dd:nth-child(2)": {
      ...theme.typography.caption,
      color: theme.palette.grey[500],
      lineHeight: "17px",
    },
  },
  coinplusCellLeft: {
    "& > dl >dd:nth-child(1)": {
      ...theme.typography.body2,
    },
    "& > dl >dd:nth-child(2)": {
      ...theme.typography.caption,
      color: theme.palette.grey[500],
    },
  },
  coinplusBtn: {
    "&>button": {
      minWidth: "160px",
      padding: "6px",
      height: 32,
      color: theme.palette.primary.contrastText,
    },
  },
  coinplusHalfBtn: {
    minWidth: "160px",
    display: "flex",
    "&>a": {
      minWidth: 76,
      height: 32,
      margin: "0 8px 0 0",
      padding: 8,
      "&:last-of-type": {
        margin: 0,
      },
    },
  },
});
