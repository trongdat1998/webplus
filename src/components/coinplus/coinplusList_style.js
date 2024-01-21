export default theme => ({
  coinplusCell: {
    "& > div:nth-child(1)": {
      minWidth: "350px"
    },
    "& > div:nth-child(2)": {
      minWidth: "180px"
    },
    "& > div:nth-child(3)": {
      minWidth: "350px"
    },
    "& > div:nth-child(4)": {
      minWidth: "160px"
    },
    display: "flex",
    padding: "24px 0",
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    justifyContent: "space-between",
    "& div": {
      ...theme.typography.body2,
      alignSelf: "center",
      lineHeight: "24px"
    }
  },
  coinplusCellRate: {
    "& > dl >dd:nth-child(1)": {
      "&>em ": {
        ...theme.typography.subtitle2,
        color: theme.palette.secondary.dark
      },
      ...theme.typography.heading,
      color: theme.palette.secondary.dark,
      fontWeight: "bold",
      lineHeight: "30px"
    },
    "& > dl >dd:nth-child(2)": {
      ...theme.typography.caption,
      color: theme.palette.grey[500],
      lineHeight: "17px"
    }
  },
  coinplusCellLeft: {
    "& > dl >dd:nth-child(1)": {
      ...theme.typography.body2
    },
    "& > dl >dd:nth-child(2)": {
      ...theme.typography.caption,
      color: theme.palette.grey[500],
      margin: "2px 0 0 0"
    }
  },

  coinplusBtn: {
    "&>button": {
      minWidth: "160px",
      padding: "6px 24px",
      height: 32
    }
  }
});
