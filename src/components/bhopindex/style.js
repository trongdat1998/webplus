export default (theme) => ({
  home: {},
  banner: {
    position: "relative",
    height: "552px",
    width: "100%",
    overflow: "hidden",
    fontSize: "0",
    color: "rgba(0,0,0,0)",
    textIndex: "-200px",
    background: theme.palette.common.text,
    margin: "0 0 40px",
    "& .banner-anim": {
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
    },
    "& .banner-anim-elem": {
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },
    "& .banner-anim-thumb": {
      position: "absolute",
      zIndex: 20,
      height: 40,
      bottom: 20,
      width: "100%",
      left: 0,
      textAlign: "center",
      "& span": {
        cursor: "pointer",
        width: 8,
        height: 8,
        display: "inline-block",
        borderRadius: 4,
        margin: "0 10px 0 0",
        background: "rgba(255,255,255,.5)",
        "&.active": {
          background: "#fff",
        },
      },
    },
  },
  slick_item: {
    width: "100%",
    height: "100%",
  },
  trading: {
    margin: "56px auto 72px",
    background: `url(${require("../../assets/Vector_bg2.png")}) no-repeat left top`,
    width: "100%",
    minWidth: 1040,
    maxWidth: 1200,
  },
  title: {
    ...theme.typography.display1,
    color: theme.palette.common.text,
    textAlign: "center",
    lineHeight: "56px",
    margin: "0 0 48px",
  },
  notice_bg: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 40,
    zIndex: 30,
    background: "rgba(0,0,0,0.2)",
  },
  notice: {
    width: "100%",
    minWidth: 1040,
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    "& div": {
      display: "flex",
      alignItems: "center",
      ...theme.typography.body2,
      color: theme.palette.common.white,
    },
    "& a": {
      ...theme.typography.body2,
      color: theme.palette.common.white,
      lineHeight: "21px",
      display: "block",
      alignItems: "center",
    },
    "& span": {
      display: "inline-block",
      margin: "0 15px",
    },
  },
  tradeDesc: {
    "& div": {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",

      "&:nth-child(3n)": {
        alignItems: "stretch",
      },
      "& em": {
        width: "336px",
        height: "192px",
        display: "block",
        "&:nth-child(3n+1)": {
          background: `url(${require("../../assets/Securities.png")}) no-repeat`,
          backgroundSize: "cover",
        },
        "&:nth-child(3n+2)": {
          background: `url(${require("../../assets/Custody.png")}) no-repeat`,
          backgroundSize: "cover",
        },
        "&:nth-child(3n)": {
          background: `url(${require("../../assets/Multfariou.png")}) no-repeat`,
          backgroundSize: "cover",
        },
      },
      "& strong": {
        ...theme.typography.subtitle1,
        color: theme.palette.primary.main,
        display: "block",
        textAlign: "center",
        flex: 1,
        margin: "16px 0",
        width: "336px",
        "&:nth-child(3n)": {
          //padding: "0 0 0 60px"
        },
      },
      "& p": {
        ...theme.typography.body2,
        color: theme.palette.common.text,
        flex: 1,
        width: "336px",
        padding: "0 24px",
        textAlign: "left",

        "&:nth-child(3n)": {
          //padding: "0 0 0 30px"
        },
      },
    },
  },
  founder: {
    width: "100%",
    minWidth: 1040,
    maxWidth: 1200,
    margin: "0 auto 70px",
  },
  founderDesc: {
    display: "flex",
    justifyContent: "space-between",
    background: `url(${require("../../assets/Vector_bg.png")}) no-repeat left top`,
    "& div": {
      width: "260px",
      padding: "0 0 0 45px",
      textAlign: "center",
    },
    "& img": {
      width: "150px",
      height: "150px",
      margin: "0 0 15px",
    },
    "& strong": {
      ...theme.typography.heading,
      color: theme.palette.common.text,
      lineHeight: "30px",
      display: "block",
    },
    "& em": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
      lineHeight: "21px",
      display: "block",
    },
    "& p": {
      ...theme.typography.body2,
      color: theme.palette.common.text,
      lineHeight: "21px",
      //flex: 1,
      maxWidth: "900px",
    },
  },
  news: {
    display: "flex",
    justifyContent: "space-between",
    margin: "0 auto 88px",
    width: "100%",
    minWidth: 1040,
    maxWidth: 1200,
    "& a": {
      display: "block",
      flex: 1,
      color: theme.palette.common.text,
      "&:nth-child(4n)": {
        margin: "0",
      },
      "&:hover": {
        color: theme.palette.primary.main,
        "& em": {
          color: theme.palette.primary.light,
        },
        "& p": {
          color: theme.palette.primary.main,
        },
      },
      "& em": {
        ...theme.typography.caption,
        color: theme.palette.grey[500],
        display: "block",
        lineHeight: "16px",
        margin: "0 0 24px",
        transition: "all .3s ease-in-out",
      },
      "& p": {
        ...theme.typography.subtitle1,
        color: theme.palette.common.text,
        lineHeight: "24px",
        margin: "0 24px 0 0",
        transition: "all .3s ease-in-out",
      },
    },
  },
  download_title: {
    fontSize: 36,
    lineHeight: "36px",
    margin: "60px 0 40px 0",
    textAlign: "center",
    color: theme.palette.common.white,
    fontWeight: 200,
  },
  download: {
    width: "100%",
    maxWidth: 1200,
    minWidth: 1040,
    height: "209px",
    margin: "20px auto 63px",
    padding: "0 40px 0 425px",
    background: `url(${require("../../assets/download_bhop.png")}) no-repeat left center,url(${require("../../assets/download_bhop_2.png")}) no-repeat right center`,
    "& strong": {
      ...theme.typography.display1,
      color: theme.palette.common.white,
      lineHeight: "36px",
      width: "450px",
      display: "block",
      padding: "10px 0 0",
    },
    "& p": {
      ...theme.typography.caption,
      color: theme.palette.grey[200],
      lineHeight: "16px",
      margin: "10px 0 35px",
    },
  },
  links: {
    display: "flex",
    justifyContent: "center",
    width: 360,
    "& >div": {
      margin: "0 24px",
      width: "56px",
      textAlign: "center",
    },
    "& em": {
      display: "block",
      width: "56px",
      margin: "8px 0 0",
      textAlign: "center",
      ...theme.typography.caption,
      color: theme.palette.primary.main,
    },
  },
  download2: {
    width: 450,
    margin: "20px auto 0",
  },
  button: {
    width: "40px",
    height: "40px",
    margin: "0 auto",
    background: theme.palette.common.white,
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.common.white,
    },
  },
  quote: {
    width: "100%",
    maxWidth: 1200,
    minWidth: 1040,
  },
  coinplus: {
    width: "100%",
    maxWidth: 1200,
    minWidth: 1040,
    margin: "15px auto 45px",
    "&>h4": {
      ...theme.typography.body1,
      borderBottom: `1px solid ${theme.palette.grey[100]}`,
      lineHeight: "24px",
      paddingBottom: 8,
    },
  },
  qrcode: {
    background: theme.palette.common.white,
    padding: "16px",
    boxShadow: theme.shadows[2],
    borderRadius: "4px",
    "& span": {
      ...theme.typography.caption,
      color: theme.palette.common.text,
      display: "block",
      textAlign: "center",
      margin: "0 0 10px",
    },
    "& img": {
      width: "105px",
      height: "105px",
    },
    "& em": {},
  },
  tooltip: {
    background: "none",
    opacity: 1,
  },
  pointCard: {
    padding: "0 0 32px",
    background: theme.palette.common.background,
    // display: "flex",
    width: "100%",
    minWidth: 1040,
    maxWidth: 1200,
    margin: "0 auto",
    // boxShadow: theme.shadows[1],
    // borderRadius: 8,
    // position: "relative",
    zIndex: "1",
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
  },
  flex: {
    display: "flex",
  },
  cardDesc: {
    // width: 408,
    flex: 4,
    display: "flex",
    "& img": {
      width: "78px",
      height: "72px",
      marginRight: 18,
    },
    "& >div": {
      display: "flex",
      alignItems: "center",
    },
    "& h2": {
      ...theme.typography.body2,
      // margin: "8px 10px 0 0"
    },
    "& p": {
      ...theme.typography.subtitle1,
      color: theme.palette.secondary.dark,
      margin: "0 10px 0 0",
    },
    "& a": {
      color: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.primary.dark,
      },
    },
  },
  second: {
    width: 412,
  },
  firstList: {
    flex: 8,
    display: "flex",
    alignItems: "center",
    // paddingTop: 8,
    // height: 48,
    "& ul": {
      flex: 2,
      // display: "flex",
      margin: "0 7px 0 0",
      // alignItems: "center",
      textAlign: "center",
      "& li": {
        // width: 130,
        // fontSize: 14,
        // lineHeight: "21px",
        margin: 0,
        "& strong": {
          ...theme.typography.body2,
          display: "inline-block",
          //width: 112
          // display: "block"
        },
        "& em": {
          ...theme.typography.body2,
          color: theme.palette.secondary.dark,
        },
      },
    },
    "& p": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
      marginRight: 16,
      textAlign: "right",
      flex: 1,
      "& span": {
        color: theme.palette.secondary.dark,
        fontWeight: 500,
      },
    },
    "& button": {
      ...theme.typography.buttonRadius,
      minHeight: 32,
      minWidth: 96,
      padding: "6px 10px",
      margin: "3px 0 0",
    },
    "& >div": {
      flex: 2,
      display: "flex",
      alignItems: "center",
    },
  },
  secondList: {
    flex: 1,
    "& ul": {
      display: "flex",
      "& li": {
        flex: 1,
        textAlign: "center",
        borderRight: `1px solid ${theme.palette.grey[100]}`,
        padding: "0 28px",
        "&:last-child": {
          borderRight: 0,
        },
        "& em": {
          display: "block",
          ...theme.typography.Caption,
        },
        "& button": {
          ...theme.typography.buttonRadius,
          minHeight: 32,
          minWidth: 80,
          width: 100,
          marginTop: 8,
        },
        "& h3": {
          ...theme.typography.subtitle1,
        },
        "& p": {
          ...theme.typography.Caption,
          color: theme.palette.grey[500],
        },
      },
    },
  },
  organization: {
    width: "100%",
    minWidth: 1040,
    maxWidth: 1200,
    textAlign: "center",
    margin: "0 auto 43px",
    paddingBottom: "53px",
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    "& span": {
      ...theme.typography.body2,
      display: "inline-block",
      padding: 16,
      background: theme.palette.common.white,
      color: theme.palette.grey[500],
    },
  },
  organization_img: {
    padding: "13px 0 36px",
    display: "flex",
    justifyContent: "space-between",
    "& img": {
      width: 111,
      height: 48,
      // flex: 1
      "&:last-child": {
        marginRight: 0,
      },
    },
  },
  shadow: {
    height: 24,
    backgroundImage:
      "linear-gradient(-180deg,rgba(196, 196, 196, 1) 0%,rgba(196, 196, 196, 0) 100%)",
    opacity: 0.08,
  },
  pointcardBg: {
    width: "100%",
  },
  feature: {
    width: 1200,
    margin: "0 auto 40px",
    color: theme.palette.common.white,
    textAlign: "center",
    overflow: "hidden",
    "& h1": {
      fontSize: 36,
      lineHeight: "36px",
      fontWeight: 200,
      marginTop: 30,
    },
    "& ul": {
      marginTop: 40,
      display: "flex",
      "& li": {
        cursor: "pointer",
        background: "#191f32",
        color: "#c4cad7",
        borderRight: `1px solid #272d42`,
        padding: "140px 0 10px",
        flex: 1,
        position: "relative",
        transition: "all 0.5s",
        "& .em": {
          transform: "translateY(0)",
          transition: "all 0.5s",
        },
        "& .img": {
          width: "100%",
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& img": {
            width: 100,
            height: 100,
          },
        },
        "& h2": {
          fontSize: 24,
          lineHeight: "24px",
          fontWeight: 100,
          marginTop: 80,
          transition: "all 0.3s",
        },
        "& p": {
          fontSize: 14,
          lineHeight: "30px",
          height: 150,
          marginTop: 12,
          textAlign: "left",
          padding: "0 30px",
          opacity: 0,
          transition: "all 0.5s",
        },
        "&:hover": {
          color: theme.palette.common.white,
          background: theme.palette.primary.main,
          "& .em": {
            transform: "translateY(-100px)",
          },
          "& h2": {
            color: theme.palette.common.white,
            marginTop: 25,
          },
          "& p": {
            color: theme.palette.common.white,
            opacity: 1,
          },
        },
      },
    },
  },
  feature_en: {
    "& ul": {
      "& li": {
        "&:hover": {
          "& p": {
            lineHeight: "20px",
          },
        },
      },
    },
  },
});
