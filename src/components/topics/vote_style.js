import helper from "../../utils/helper";
export default theme => ({
  vote_bg: {
    background: "#00081D",
    width: "100%"
  },
  banner: {
    width: "100%",
    height: 400,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover"
  },
  content: {
    width: 1232,
    margin: "0 auto"
  },
  section: {
    background: "linear-gradient(90deg, #05163d 0%, rgba(5, 22, 61, 0) 100%)",
    padding: "0 24px 32px",
    position: "relative",
    marginBottom: 40,
    "&:before": {
      content: `""`,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: 2,
      background:
        "linear-gradient(91.76deg, rgba(72, 189, 255, 0) 0%, #48bdff 48.96%, rgba(72, 189, 255, 0) 100%)"
    },
    "&.section02": {
      marginBottom: 0,
      "&:before": {
        background:
          "linear-gradient(91.76deg, rgba(249, 35, 72, 0) 0%, #ff4848 48.96%, rgba(249, 35, 72, 0) 100%)"
      }
    }
  },
  top: {
    display: "flex",
    padding: "24px 0",
    alignItems: "center",
    "& em": {
      position: "relative",
      width: 18,
      height: 18,
      border: "1px solid #48bdff",
      boxSizing: "border-box",
      borderRadius: 2,
      cursor: "pointer",
      "& img": {
        width: 18
      }
    },
    "& p": {
      fontSize: 18,
      lineHeight: "26px",
      color: "#48bdff",
      padding: "0 0 0 14px",
      flex: 1
    },
    "& a": {
      color: "#48bdff",
      fontSize: 16,
      lineHeight: "23px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      "& i": {
        background: `url(${require("../../assets/vote/down.png")}) no-repeat center`,
        backgroundSize: 18,
        width: 18,
        height: 18,
        marginLeft: 12,
        transform: "rotate(0deg)",
        transition: "transform 0.3s"
      },
      "&.open i": {
        transform: "rotate(180deg)"
      }
    },
    "&.top02": {
      "& em": {
        borderColor: "#FD412E"
      },
      "& p": {
        color: "#FD412E"
      },
      "& a": {
        color: "#FD412E",
        "& i": {
          background: `url(${require("../../assets/vote/down02.png")}) no-repeat center`,
          backgroundSize: 18
        }
      }
    }
  },
  down: {
    borderTop: `1px solid rgba(72, 189, 255, 0.2)`,
    padding: "0 34px",
    height: 72,
    overflow: "hidden",
    "& h4": {
      fontSize: 16,
      lineHeight: "23px",
      fontWeight: 500,
      color: helper.hex_to_rgba("#48BDFF", 0.8),
      marginTop: 16
    },
    "& p": {
      fontSize: 14,
      lineHeight: "24px",
      color: helper.hex_to_rgba("#ffffff", 0.8),
      margin: "8px 0",
      "&:last-of-type": {
        marginBottom: 0
      }
    },
    "&.down02": {
      borderTop: `1px solid rgba(249, 35, 72, 0.2)`,
      "& h4": {
        color: helper.hex_to_rgba("#FD412E", 0.8)
      }
    }
  },
  btn: {
    "&.MuiButton-root": {
      width: 400,
      height: 56,
      fontSize: 17,
      lineHeight: "25px",
      color: "#48bdff",
      fontWeight: "bold",
      padding: "13px 15px",
      margin: "16px auto",
      backgroundColor: "rgba(72, 189, 255, 0.1)",
      borderColor: "rgba(72, 189, 255, 0.3)",
      boxSizing: "border-box",
      display: "flex",
      "&:hover": {
        borderColor: "rgba(72, 189, 255, 0.3)"
      }
    },
    "&.voted": {
      backgroundImage: `url(${require("../../assets/vote/finger.png")})`,
      backgroundSize: 56,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center"
    }
  },
  rule: {
    color: "rgba(255, 255, 255, 0.8)",
    margin: "32px 0 40px",
    padding: "40px 58px 32px",
    background: "linear-gradient(90deg, #05163d 0%, rgba(5, 22, 61, 0) 100%)",
    "& h3": {
      fontSize: 24,
      lineHeight: "35px",
      margin: "0 0 14px",
      position: "relative",
      paddingLeft: 12,
      fontWeight: 500,
      "&:before": {
        content: '""',
        position: "absolute",
        top: 4,
        left: 0,
        width: 4,
        height: 26,
        background: "#56ccf2"
      }
    },
    "& p": {
      margin: "8px 0",
      fontSize: 15,
      lineHeight: "22px",
      position: "relative",
      paddingLeft: 24,
      "&:before": {
        position: "absolute",
        width: 6,
        height: 6,
        background: "#56ccf2",
        content: '""',
        left: 0,
        top: 8,
        transform: "rotate(45deg)"
      }
    }
  },
  vote: {
    display: "flex",
    position: "relative",
    margin: "0 0 24px",
    "& .approve, & .oppose": {
      position: "relative",
      paddingBottom: 34,
      minWidth: "4%",
      maxWidth: "96%",
      "& i": {
        position: "absolute",
        width: 16,
        height: 16,
        top: 4,
        left: 16,
        zIndex: 1
      },
      "& .bg": {
        position: "relative",
        height: 24,
        width: "0%",
        transition: "width 3s",
        "&.start": {
          width: "100%"
        }
      }
    },
    "& .approve": {
      "& i": {
        background: `url(${require("../../assets/vote/pointer.png")}) no-repeat center`,
        backgroundSize: 16
      },
      "& .bg": {
        background: "linear-gradient(90deg, #00a3ff, #56ccf2)"
      }
    },
    "& .oppose": {
      textAlign: "right",
      marginTop: 4,
      top: 25,
      transform: "rotate(180deg)",
      transformOrigin: "top",
      "& i": {
        background: `url(${require("../../assets/vote/pointer02.png")}) no-repeat center`,
        backgroundSize: 16,
        transform: "rotate(180deg)"
      },
      "& .bg": {
        background:
          "linear-gradient(90deg, #ff7a30 2.08%, #fa002b 102.08%), #f92348",
        transform: "rotate(-180deg)"
      }
    },
    "& .mask": {
      background: `url(${require("../../assets/vote/mask.png")}) no-repeat center`,
      backgroundSize: "19px 28px",
      position: "absolute",
      top: 0,
      width: 19,
      height: 28
    },
    "& .vote-p": {
      position: "absolute",
      display: "flex",
      marginTop: 28,
      width: "100%",
      fontSize: 15,
      fontWeight: 500,
      "& p": {
        fontSize: 15,
        fontWeight: 500,
        flex: 1,
        height: 24,
        lineHeight: "24px",
        margin: "12px 0 0",
        "&:first-of-type": {
          color: "#48bdff"
        },
        "&:last-of-type": {
          textAlign: "right",
          color: "#fd412e"
        },
        "& span": {
          fontSize: 24
        }
      }
    }
  },
  dialog: {
    "& .MuiDialog-paper": {
      backgroundColor: "rgba(5, 22, 61, 0.9)",
      borderRadius: 4
    },
    "& .MuiBackdrop-root": {
      background: "transparent"
    },
    "& .MuiDialogContent-root": {
      textAlign: "center",
      padding: 24,
      color: "#56ccf2",
      minWidth: 160
    },
    "& img": {
      width: 40,
      marginBottom: 16
    },
    "& p": {
      margin: 0,
      fontSize: 19,
      lineHeight: "28px"
    }
  }
});
