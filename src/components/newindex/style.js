export default theme => ({
  home: {
    // marginTop: -67
  },
  banner: {
    position: "relative",
    height: "500px",
    width: "100%",
    overflow: "hidden",
    fontSize: "0",
    color: "rgba(0,0,0,0)",
    textIndex: "-200px",
    background: theme.palette.common.text,
    margin: "-2px 0 0",
    "& .banner-anim": {
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden"
    },
    "& .banner-anim-elem": {
      width: "100%",
      height: "100%",
      overflow: "hidden"
    },
    "& .banner-anim-thumb": {
      position: "absolute",
      height: 24,
      bottom: 16,
      width: "100%",
      textAlign: "center",
      zIndex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
      // "& span": {
      //   cursor: "pointer",
      //   width: 28,
      //   height: 4,
      //   display: "inline-block",
      //   // borderRadius: 4,
      //   margin: "0 10px 0 0",
      //   background: "rgba(255,255,255,.2)",
      //   "&.active": {
      //     background: theme.palette.common.white
      //   }
      // }
    }
  },
  slick_item: {
    width: "100%",
    height: "100%"
  },
  trading: {
    margin: "56px auto 72px",
    background: `url(${require("../../assets/Vector_bg2.png")}) no-repeat left top`,
    width: "100%",
    minWidth: 1040,
    maxWidth: 1200
  },
  title: {
    ...theme.typography.display4,
    color: theme.palette.common.text,
    textAlign: "center",
    lineHeight: "46px",
    fontSize: 32,
    fontWeight: "normal",
    margin: "0 auto 50px",
    letterSpacing: "2px",
    minWidth: 1040,
    maxWidth: 1200
  },
  notice_bg: {
    width: "100%",
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    height: 48,
    background: theme.palette.background.part,
    zIndex: 1
  },
  notice: {
    width: "100%",
    minWidth: 1040,
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    color: theme.palette.grey[200],
    "& div": {
      display: "flex",
      alignItems: "center",
      ...theme.typography.caption,
      color: theme.palette.common.text,
      fontSize: 12,
      fontWeight: 300,
      lineHeight: "16px"
    },
    "& a": {
      ...theme.typography.caption,
      color: theme.palette.common.text,
      lineHeight: "21px",
      display: "block",
      alignItems: "center",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      maxWidth: 280,
      textAlign: "center",
      "&:hover": {
        color: theme.palette.primary.main
      }
    },
    "& span": {
      display: "inline-block",
      margin: "0 16px",
      fontSize: "1.2142rem"
    },
    "& button": {
      minWidth: 70,
      height: 24,
      padding: "0 7px",
      lineHeight: "24px",
      border: "1px solid",
      marginLeft: 38,
      borderRadius: 4,
      "& span": {
        fontSize: "0.9285rem",
        margin: 0,
        display: "inline"
      }
    }
  },
  tradeDesc: {
    "& div": {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",

      "&:nth-child(3n)": {
        alignItems: "stretch"
      },
      "& em": {
        width: "336px",
        height: "192px",
        display: "block",
        "&:nth-child(3n+1)": {
          background: `url(${require("../../assets/Securities.png")}) no-repeat`,
          backgroundSize: "cover"
        },
        "&:nth-child(3n+2)": {
          background: `url(${require("../../assets/Custody.png")}) no-repeat`,
          backgroundSize: "cover"
        },
        "&:nth-child(3n)": {
          background: `url(${require("../../assets/Multfariou.png")}) no-repeat`,
          backgroundSize: "cover"
        }
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
        }
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
        }
      }
    }
  },
  founder: {
    width: "100%",
    minWidth: 1040,
    maxWidth: 1200,
    margin: "0 auto 70px"
  },
  founderDesc: {
    display: "flex",
    justifyContent: "space-between",
    background: `url(${require("../../assets/Vector_bg.png")}) no-repeat left top`,
    "& div": {
      width: "260px",
      padding: "0 0 0 45px",
      textAlign: "center"
    },
    "& img": {
      width: "150px",
      height: "150px",
      margin: "0 0 15px"
    },
    "& strong": {
      ...theme.typography.heading,
      color: theme.palette.common.text,
      lineHeight: "30px",
      display: "block"
    },
    "& em": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
      lineHeight: "21px",
      display: "block"
    },
    "& p": {
      ...theme.typography.body2,
      color: theme.palette.common.text,
      lineHeight: "21px",
      //flex: 1,
      maxWidth: "900px"
    }
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
        margin: "0"
      },
      "&:hover": {
        color: theme.palette.primary.main,
        "& em": {
          color: theme.palette.primary.light
        },
        "& p": {
          color: theme.palette.primary.main
        }
      },
      "& em": {
        ...theme.typography.caption,
        color: theme.palette.grey[500],
        display: "block",
        lineHeight: "16px",
        margin: "0 0 24px",
        transition: "all .3s ease-in-out"
      },
      "& p": {
        ...theme.typography.subtitle1,
        color: theme.palette.common.text,
        lineHeight: "24px",
        margin: "0 24px 0 0",
        transition: "all .3s ease-in-out"
      }
    }
  },
  download_bg: {
    width: "100%",
    backgroundColor: theme.palette.gray[50],
    backgroundImage: `url(${require("../../assets/new_index/download_bg.png")})`,
    backgroundSize: "100%",
    padding: "80px 0",
    height: "auto",
    overflow: "hidden",
    "& h1": {
      textAlign: "center",
      width: "100%",
      margin: "0 auto"
    }
  },
  download: {
    minWidth: 1040,
    maxWidth: 1200,
    minHeight: 472,
    margin: "0 auto",
    // display: "flex",
    background: `url(${require("../../assets/new_index/download.png")}) no-repeat`,
    backgroundSize: "792px 448px",
    backgroundPositionX: "right",
    backgroundPositionY: 24,
    padding: "72px 0 0"
  },
  download_qr: {
    width: 168,
    textAlign: "center",
    marginTop: 48,
    "& img": {
      width: 168,
      height: 168,
      border: `1px solid rgba(66, 153, 255, 0.5)`
    },
    "& p": {
      ...theme.typography.body2,
      color: theme.palette.common.text,
      lineHeight: "20px",
      margin: "16px 0 0"
    }
  },
  links: {
    display: "flex",
    height: 80,
    // alignItems: "center",
    // width: 360,
    "& i": {
      color: theme.palette.primary.main
      // marginRight: 7,
    },
    "& >div": {
      margin: "0 16px 0 0",
      width: 80,
      textAlign: "center"
      // textAlign: "center"
      // "&:nth-of-type(1)": {
      //   "& i": {
      //     top: -1,
      //     position: "relative",
      //     marginLeft: -5
      //   }
      // }
    },
    "& em": {
      display: "block",
      width: "100%",
      margin: "16px 0 0",
      textAlign: "center",
      ...theme.typography.body1,
      color: theme.palette.common.text,
      fontSize: 14,
      lineHeight: "23px"
    },
    "& img": {
      width: 40,
      transform: "scale(1,1)",
      transition: "all .2s ease-in-out",
      "&:hover": {
        transform: "scale(1.2,1.2)"
      }
    }
  },
  download2: {
    width: 384
    // margin: "0 auto",
    // "& img": {
    //   width: 168,
    //   height: 168
    // }
  },
  button: {
    width: 40,
    height: 40,
    margin: "0 auto 16px",
    background: "linear-gradient(135deg, #C9E0FD, #EFF5FC)",
    boxShadow: "none",
    color: theme.palette.primary.main,
    borderRadius: "100%",
    display: "flex",
    border: 0,
    "&:hover": {
      boxShadow: "0px 4px 10px rgba(51, 117, 224, 0.3)"
    }
  },
  quote: {
    width: "100%",
    maxWidth: 1200,
    minWidth: 1040
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
      paddingBottom: 8
    }
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
      margin: "0 0 10px"
    },
    "& img": {
      width: "105px",
      height: "105px"
    },
    "& em": {}
  },
  tooltip: {
    background: "none",
    opacity: 1
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
    borderBottom: `1px solid ${theme.palette.grey[100]}`
  },
  flex: {
    display: "flex"
  },
  cardDesc: {
    // width: 408,
    flex: 4,
    display: "flex",
    "& img": {
      width: "78px",
      height: "72px",
      marginRight: 18
    },
    "& >div": {
      display: "flex",
      alignItems: "center"
    },
    "& h2": {
      ...theme.typography.body2
      // margin: "8px 10px 0 0"
    },
    "& p": {
      ...theme.typography.subtitle1,
      color: theme.palette.secondary.dark,
      margin: "0 10px 0 0"
    },
    "& a": {
      color: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.primary.dark
      }
    }
  },
  second: {
    width: 412
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
          display: "inline-block"
          //width: 112
          // display: "block"
        },
        "& em": {
          ...theme.typography.body2,
          color: theme.palette.secondary.dark
        }
      }
    },
    "& p": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
      marginRight: 16,
      textAlign: "right",
      flex: 1,
      "& span": {
        color: theme.palette.secondary.dark,
        fontWeight: 500
      }
    },
    "& button": {
      ...theme.typography.buttonRadius,
      minHeight: 32,
      minWidth: 96,
      padding: "6px 10px",
      margin: "3px 0 0"
    },
    "& >div": {
      flex: 2,
      display: "flex",
      alignItems: "center"
    }
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
          borderRight: 0
        },
        "& em": {
          display: "block",
          ...theme.typography.Caption
        },
        "& button": {
          ...theme.typography.buttonRadius,
          minHeight: 32,
          minWidth: 80,
          width: 100,
          marginTop: 8
        },
        "& h3": {
          ...theme.typography.subtitle1
        },
        "& p": {
          ...theme.typography.Caption,
          color: theme.palette.grey[500]
        }
      }
    }
  },
  organization: {
    width: "100%",
    minWidth: 1040,
    textAlign: "center",
    margin: "0 auto",
    padding: "40px 0 68px",
    overflow: "hidden",
    "& h1": {
      margin: "0 auto 36px"
    },
    "& span": {
      ...theme.typography.body2,
      display: "inline-block",
      padding: 16,
      background: theme.palette.common.white,
      color: theme.palette.grey[500]
    },
    "& img": {
      width: "100%",
      opacity: 0,
      maxWidth: 1200,
      transform: "translate3d(0, 100%, 0)"
    }
  },
  organization_img: {
    padding: 0,
    display: "flex",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    "& img": {
      width: 162,
      height: 56,
      border: `1px solid ${theme.palette.grey[100]}`,
      borderRadius: 2,
      margin: "0 11px 10px 0",
      // flex: 1
      "&:last-child": {
        marginRight: 0
      }
    }
  },

  organizationFadeIn: {
    "& img": {
      animation: "$fadeInUp .8s ease-in-out .2s 1 forwards"
    }
  },
  shadow: {
    height: 24,
    backgroundImage:
      "linear-gradient(-180deg,rgba(196, 196, 196, 1) 0%,rgba(196, 196, 196, 0) 100%)",
    opacity: 0.08
  },
  pointcardBg: {
    width: "100%"
  },
  register: {
    padding: "49px 0 56px",
    textAlign: "center",
    "& h1": {
      color: theme.palette.common.white,
      margin: "0 auto 40px"
    },
    "& div": {
      margin: "40px auto 0px",
      height: 64,
      width: 640,
      display: "flex"
    },
    "& input": {
      flex: 1,
      borderRadius: "2px 0 0 2px",
      padding: "20px 16px",
      border: 0,
      fontSize: 16,
      lineHeight: "23px",
      color: theme.palette.common.text,
      outline: "none",
      margin: 0,
      background: theme.palette.common.white,
      "&::placeholder": {
        color: theme.palette.grey[500]
      }
    },
    "& button": {
      width: 160,
      height: "100%",
      borderRadius: "0 2px 2px 0",
      fontSize: 20,
      background: theme.palette.primary.dark
    }
  },
  fix_contract: {
    position: "fixed",
    right: 24,
    top: 200,
    width: 40,
    zIndex: 100,
    "& li": {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: theme.palette.primary.main,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 0 18px",
      position: "relative",
      "& i": {
        color: theme.palette.common.white,
        fontSize: 22
      },
      "&:hover": {
        "& div": {
          display: "block",
          animation: "mymove 0.3s 1",
          transform: "scale(1,1)",
          opacity: 1,
          transition: "all 0.3s ease-in-out"
        }
      },
      "& div": {
        transform: "scale(0)",
        opacity: 0,
        position: "absolute",
        top: -30,
        left: -110,
        width: 100,
        height: 100,
        background: theme.palette.background.default,
        borderRadius: "3px",
        boxShadow: theme.shadows[2],
        "& img": {
          width: 100,
          height: 100,
          borderRadius: "3px"
        },
        "&:after": {
          content: "",
          borderTop: `5px solid ${theme.palette.common.white}`,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          position: "absolute",
          bottom: -5,
          left: "50%",
          marginLeft: -5
        }
      }
    }
  },
  buy_bg: {
    background: theme.palette.black[800],
    padding: "24px 0 12px",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    "& .item": {
      flex: 1
    }
  },
  refer_price: {
    textAlign: "right",
    margin: 0,
    "& p": {
      ...theme.typography.body2,
      color: theme.palette.grey[100],
      lineHeight: "20px",
      marginRight: 16,
      "&:first-of-type": {
        ...theme.typography.body1,
        color: theme.palette.grey[500],
        lineHeight: "24px",
        height: 24
      },
      "& i": {
        cursor: "pointer",
        marginTop: -3
      }
    }
  },
  buy: {
    // bottom: 78,
    height: 48,
    background: theme.palette.common.white,
    width: 588,
    position: "relative",
    // left: "50%",
    // margin: "0 auto",
    display: "flex",
    fontSize: 16,
    lineHeight: "23px",
    padding: 0,
    zIndex: 3,
    borderRadius: "2px 4px 4px 2px",
    "& button": {
      width: 136,
      height: 48,
      background: theme.palette.primary.main,
      borderRadius: "0px 2px 2px 0px",
      // marginTop: -12,
      fontSize: 18
    }
  },
  icon_select: {
    width: 158,
    padding: "12px 0px 12px 16px",
    color: theme.palette.text.primary,
    display: "flex",
    background: theme.palette.common.white,
    alignItems: "center",
    position: "relative",
    cursor: "pointer",
    borderRadius: 2,
    "& img": {
      width: 22,
      height: 22,
      borderRadius: "100%",
      marginRight: 8
    },
    "& >div": {
      flex: 1,
      display: "flex",
      alignItems: "center",
      padding: "0 16px 0 0",
      borderRight: `1px solid ${theme.palette.grey[200]}`,
      width: 158,
      "& p": {
        flex: 1
      },
      "& i": {
        color: theme.palette.text.primary
      },
      "& ul": {
        display: "none"
      },
      "&:hover": {
        "& ul": {
          display: "block",
          padding: "2px 0",
          top: 35,
          left: 0,
          right: 0,
          background: "transparent",
          minWidth: 160,
          "& li": {
            background: theme.palette.common.white,
            height: 36,
            width: "100%",
            borderRadius: 2,
            marginBottom: 1,
            lineHeight: "36px",
            display: "flex",
            padding: "0 17px",
            color: theme.palette.common.title
          }
        }
      }
    }
  },
  dMenuList: {
    display: "none",
    position: "absolute",
    zIndex: 501,
    top: 48,
    right: 0,
    background: theme.palette.background.default,
    padding: "8px 0",
    borderRadius: "2px",
    boxShadow: theme.shadows[1],
    overflow: "hidden"
  },
  dMenuItem: {
    color: theme.palette.common.text,
    minWidth: 158,
    padding: "12px 16px",
    display: "flex",
    "&:hover": {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.grey[50]
    },
    "& a": {
      padding: "11px 16px",
      display: "block",
      color: theme.palette.common.text,
      fontSize: "1rem",
      lineHeight: "20px",
      "&:hover": {
        color: theme.palette.primary.main
      }
    }
  },
  buy_input: {
    flex: 1,
    display: "flex",
    paddingRight: 24,
    alignItems: "center",
    background: theme.palette.common.white,
    "& input": {
      border: 0,
      lineHeight: "20px",
      height: 36,
      outline: "none",
      padding: "10px 18px",
      flex: 1,
      fontSize: 16,
      color: theme.palette.common.title,
      "&::placeholder": {
        color: theme.palette.grey[500]
      }
    },
    "& span": {
      color: theme.palette.grey[500],
      fontSize: 16
    }
  },
  thumb: {
    width: 32,
    height: 24,
    lineHeight: "24px",
    cursor: "pointer",
    "& span": {
      width: 24,
      height: 4,
      background: "rgba(255,255,255,.2)",
      margin: "0 auto !important",
      display: "inline-block",
      cursor: "pointer"
    },
    "&.active": {
      "& span": {
        background: "rgba(255,255,255,.6)"
      }
    }
  },
  feature: {
    width: "100%",
    margin: "0 auto",
    padding: "40px 0 0",
    color: theme.palette.common.text,
    overflow: "hidden",
    "& h1": {
      margin: "0 auto 24px"
    },
    "& ul": {
      minWidth: 1040,
      maxWidth: 1200,

      display: "flex",
      // padding: "0 8px",
      margin: "0 auto",
      opacity: 0,
      transform: "translate3d(0, 100%, 0)",
      "& li": {
        padding: "24px 24px 40px",
        flex: 1,
        position: "relative",
        margin: "0 12px",
        textAlign: "center",
        "& h2": {
          fontSize: 22,
          lineHeight: "32px",
          marginTop: 16
        },
        "& p": {
          fontSize: 14,
          lineHeight: "24px",
          color: theme.palette.grey[800],
          marginTop: 16
          // minHeight: 70,
        }
      }
    }
  },
  feature_en: {
    "& ul": {
      "& li": {
        "& p": {
          lineHeight: "20px !important"
        }
      }
    }
  },
  img: {
    width: "100%",
    height: 96,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      maxWidth: 96
    }
  },
  bonus: {
    position: "fixed",
    right: 50,
    top: 300,
    width: 200,
    height: 150,
    zIndex: 100,
    textAlign: "center",
    "& img": {
      width: 169,
      height: 134,
      cursor: "pointer"
    },
    "& i": {
      color: "rgba(255, 255, 255, .7)",
      cursor: "pointer",
      position: "absolute",
      top: -24,
      right: -13
    }
  },
  other: {
    background: theme.palette.primary.main,
    height: 680,
    "& .content": {
      width: 1200,
      height: "100%",
      margin: "0 auto",
      display: "flex",
      position: "relative"
    },
    "& .left": {
      width: 633
    },
    "& .right": {
      position: "absolute",
      right: 40,
      bottom: 0,
      "& img": {
        width: 537,
        height: 592
      }
    }
  },
  dialog: {
    "& >div": {
      // background: `url(${require("../../assets/activity/dialog_bg.png")})no-repeat`,
      // backgroundSize: "544px 651px",
      width: 544,
      minHeight: 800,
      padding: "0",
      boxShadow: "none"
    }
  },
  dialog_en: {
    "& >div": {
      width: 550,
      minHeight: 800,
      padding: "0",
      boxShadow: "none"
    }
  },
  dialog_con_bg: {
    width: 532,
    height: "auto",
    minHeight: 300,
    margin: "265px auto 0",
    padding: "20px 50px 50px",
    position: "relative"
  },
  dialog_title: {
    fontWeight: "bold",
    lineHeight: "34px",
    padding: 0,
    textAlign: "center",
    "& h6": {
      fontSize: 26,
      color: "#e2102a"
    }
  },
  dialog_con: {
    fontSize: 16,
    padding: 0,
    "& >p": {
      textAlign: "center",
      color: "#999",
      fontSize: 14,
      lineHeight: "22px"
    },
    "& ul": {
      paddingTop: 20
    },
    "& li": {
      fontSize: 16,
      padding: 15,
      width: "100%",
      height: 74,
      boxShadow: "0 13px 16px 0px rgba(242, 190, 177, 1)",
      "& >div": {
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        background: "rgba(225, 253, 255, 0.15)",
        padding: 6,
        borderRadius: 9,
        "& div": {
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:nth-of-type(1)": {
            width: 175,
            textAlign: "left",
            color: theme.palette.common.white,
            fontSize: 17,
            textAlign: "center"
          },
          "&:nth-of-type(2)": {
            flex: 1,
            textAlign: "center",
            color: "#fff479",
            fontSize: 18,
            display: "flex",
            flexDirection: "column",
            "& p:nth-of-type(2)": {
              fontSize: 12,
              color: theme.palette.common.white
            }
          },
          "&:nth-of-type(3)": {
            width: 109,
            height: 36
          }
        }
      }
    },
    "& button": {
      border: 0,
      color: "#ed363f",
      fontSize: 18,
      cursor: "pointer",
      padding: "0 10px",
      outline: "none",
      padding: "0 10px",
      minWidth: 109,
      height: 36,
      borderRadius: 8,
      fontWeight: "bold",
      boxShadow: "0 7px 7px 0px rgba(239, 50, 70, .6)"
    }
  },
  dialog_action: {
    margin: "24px 0 0",
    position: "absolute",
    bottom: -30,
    left: "50%",
    marginLeft: -90,
    "& button": {
      color: "#646464",
      fontSize: 21,
      padding: 0,
      margin: 0,
      height: 36,
      width: 180,
      background: "#d2d2d2",
      borderRadius: 18,
      "& spoan": {
        background: "#d2d2d2"
      },
      "&:hover": {
        background: "#d2d2d2"
      }
    }
  },
  small_banner_bg: {
    width: 1152,
    height: 175,
    margin: "0 auto",
    position: "absolute",
    bottom: 97,
    left: "50%",
    marginLeft: -576,
    zIndex: 1
  },
  qoutesTabs: {
    width: "100%",
    minWidth: 1040,
    margin: "0 auto",
    "& div": {
      minWidth: 1040,
      maxWidth: 1200,
      margin: "0 auto",
      height: 67,
      display: "flex",
      padding: "0 24px"
    },
    "& span": {
      height: "100%",
      display: "flex",
      alignItems: "center",
      margin: "0 16px 0 0",
      padding: "0 24px",
      fontSize: 22,
      color: theme.palette.grey[800],
      position: "relative",
      cursor: "pointer",
      "&.active": {
        color: theme.palette.primary.main,
        "& em": {
          position: "absolute",
          border: "12px solid transparent",
          borderBottom: `12px solid ${theme.palette.background.part}`,
          left: "50%",
          bottom: 0,
          marginLeft: -10
        }
      }
    }
  },
  downloadFadeIn: {
    animation: "$fadeInUp 1s ease-in-out 1 forwards"
  },
  featureFadeIn: {
    animation: "$fadeInUp 1s ease-in-out 1 forwards"
  },
  "@keyframes fadeInUp": {
    from: {
      opacity: 0,
      transform: "translate3d(0, 100%, 0)"
    },

    to: {
      opacity: 1,
      transform: "translate3d(0, 0, 0)"
    }
  }
});
