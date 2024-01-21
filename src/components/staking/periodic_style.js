import helper from "../../utils/helper";
export default (theme) => ({
  container: {
    minHeight: "600px",
    width: "100%",
    width: "100%",
  },
  screenWidth: {
    margin: "0 auto",
    maxWidth: "1200px",
    minWidth: "1040px",
  },
  screenWidthBorder: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
  },
  title: {
    ...theme.typography.display2,
    color: theme.palette.secondary.contrastText,
    marginTop: "48px",
    fontSize: "32px",
    lineHeight: "40px",
    width: "100%",
    paddingBottom: "8px",
    height: 48,
  },
  orderInfo: {
    display: "flex",
    justifyContent: "flex-start",

    "&>div:nth-child(1)": {
      flex: 1,
      padding: "39px 37px 39px 0",
      borderRight: `1px solid ${theme.palette.grey[100]}`,
    },
    "&>div:nth-child(2)": {
      flex: 1,
      padding: "0 20px",
      "&>div": {
        width: "390px",
        margin: "auto",
        padding: "20px 0 33px",
      },
    },
  },
  info: {
    overflow: "hidden",
    display: "flex",
    justifyContent: "space-between",
    "&>dl": {
      fontSize: "32px",
      "&:nth-of-type(1)": {
        flex: "1 1 30%",
        minWidth: 140,
      },
      "&:nth-of-type(2)": {
        flex: "1 1 40%",
        minWidth: 200,
      },
      "&:nth-of-type(3)": {
        flex: "1 1 30%",
        minWidth: 140,
        textAlign: "right",
      },
      "& dd:nth-child(1)": {
        ...theme.typography.display2,
        lineHeight: "32px",
        height: 32,
        "& em": {
          ...theme.typography.body1,
        },
      },
      "& dd:nth-child(2)": {
        ...theme.typography.body2,
        color: theme.palette.grey[500],
        lineHeight: "24px",
        height: 24,
        marginTop: "8px",
      },
    },
  },
  highLight: {
    color: `${theme.palette.secondary.dark} !important`,
    "& em": {
      color: `${theme.palette.secondary.dark} !important`,
    },
  },
  buyProgress: {
    "& p": {
      ...theme.typography.body1,
      lineHeight: "24px",
      display: "flex",
      "& span": {
        flex: 1,
        color: theme.palette.primary.main,
        "&:last-child": {
          textAlign: "right",
          color: theme.palette.grey[800],
        },
      },
    },
  },
  progressRoot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.grey[100],
    margin: "40px 0 16px",
  },
  progressBar: {
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
  detail: {
    backgroundColor: theme.palette.grey[50],
    padding: 20,
  },
  detail_con: {
    borderRadius: 10,
    backgroundColor: theme.palette.common.white,
    padding: 30,
  },
  progress: {
    width: 680,
    margin: "0 auto",
    "& svg": {
      fontSize: 16,
    },
    "& .steps_span": {
      display: "block",
      color: theme.palette.grey[800],
      fontSize: 12,
      lineHeight: "24px",
    },
    "& .MuiStepper-root": {
      padding: "24px 16px 30px",
    },
  },
  desc: {
    wordBreak: "break-all",
    lineHeight: 1.5,
    "& img": {
      maxWidth: "100%",
    },
    "& p": {
      lineHeight: 1.5,
      margin: "10px 0",
    },
    "& a": {
      color: theme.palette.primary.main,
    },
  },
  detail_title: {
    height: 40,
    lineHeight: "40px",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    position: "relative",
    padding: "0 0 0 8px",
    fontWeight: "bold",
    "&:before": {
      position: "absolute",
      content: '""',
      width: 4,
      height: 16,
      background: theme.palette.primary.main,
      overflow: "hidden",
      left: 0,
      top: 12,
    },
  },
  step_root: {
    "& .MuiStepLabel-iconContainer": {
      width: 56,
      height: 56,
      padding: 4,
      borderRadius: "100%",
      backgroundColor: helper.hex_to_rgba(theme.palette.grey[200], 0.2),
      "& em": {
        ...theme.typography.ubtitle2,
        width: 48,
        height: 48,
        borderRadius: "100%",
        backgroundColor: theme.palette.grey[200],
        lineHeight: "48px",
        textAlign: "center",
        fontSize: 18,
        color: theme.palette.grey[500],
      },
    },
    "& .MuiStepConnector-alternativeLabel": {
      top: 28,
      left: "calc(-50% + 28px)",
      right: "calc(50% + 28px)",
    },
    "& .MuiStepConnector-line": {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
    "& .MuiStepIcon-text": {
      fontSize: 10,
      fill: theme.palette.grey[500],
    },
    "& .MuiStepLabel-label": {
      color: theme.palette.common.text,
      fontWeight: "normal",
      lineHeight: "24px",
    },
    "& .Mui-disabled .MuiStepConnector-line": {
      borderColor: theme.palette.grey[200],
    },
  },
  step_active: {
    "& .MuiStepLabel-iconContainer": {
      backgroundColor: helper.hex_to_rgba(theme.palette.primary.main, 0.2),
      "& em": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
    },
  },
  orderWrap: {
    width: "390px",
    "& a": {
      margin: "4px",
      color: theme.palette.primary.main,
    },
  },
  top: {
    ...theme.typography.body2,
    lineHeight: "24px",
    marginBottom: "8px",
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    color: theme.palette.grey[800],
    "& em": {
      color: theme.palette.secondary.dark,
      cursor: "pointer",
      padding: "0 5px",
    },
  },
  link: {
    color: theme.palette.primary.main,
    cursor: "pointer",
  },
  order: {
    width: "100%",
    "& + label": {
      // marginTop: "-2px",
      height: 32,
      "& span": {
        ...theme.typography.body2,
      },
    },
  },
  input: {
    fontSize: "20px",
    "& input": {
      padding: "8px 0",
    },
    "&::input-placeholder": {
      fontSize: "14px",
    },
  },
  helper: {
    ...theme.typography.body2,
    lineHeight: "24px",
    minHeight: 24,
    margin: 0,
  },
  agreement: {
    color: theme.palette.primary.main,
  },
  bottomButton: {
    marginTop: "40px",
    padding: "6px 0px",
  },
  checkAlert: {
    color: theme.palette.error.main,
  },
  // result
  result: {
    padding: "48px 0",
    "& h2": {
      ...theme.typography.display2,
      marginBottom: 24,
    },
  },
  center: {
    textAlign: "center",
  },
  result_con: {
    marginBottom: 32,
    "& img": {
      width: 48,
      height: 48,
      margin: "0 0 16px",
    },
    "& p": {
      ...theme.typography.body1,
      color: theme.palette.grey[500],
      "&:nth-of-type(1)": {
        color: theme.palette.secondary.contrastText,
      },
    },
  },
  result_btn: {
    marginTop: 40,
    "& .MuiButton-root": {
      ...theme.typography.button,
      minWidth: 152,
      height: 32,
      margin: "0 32px",
    },
  },
  result_em: {
    width: "100%",
    height: 32,
    background:
      "linear-gradient(180deg, #C4C4C4 0%, rgba(196, 196, 196, 0) 100%)",
    opacity: 0.1,
  },
  schedule: {
    "& h3": {
      ...theme.typography.subtitle1,
      fontWeight: "bold",
      margin: "8px 0",
      lineHeight: "40px",
    },
    "& .MuiTableCell-head": {
      ...theme.typography.caption,
      padding: "5px 0",
      color: theme.palette.grey[500],
    },
    "& .MuiTableCell-body": {
      ...theme.typography.caption,
      padding: "10px 0",
      color: theme.palette.grey[800],
      "&:nth-of-type(2)": {
        color: theme.palette.grey[500],
      },
    },
  },
  loading: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
    "& p": {
      fontSize: 20,
      "&:nth-of-type(1)": {
        fontSize: 16,
        position: "relative",
        marginBottom: 10,
        "& span": {
          position: "absolute",
          top: 0,
          width: 60,
          height: 60,
          lineHeight: "60px",
          left: "calc(50% - 30px)",
        },
      },
    },
  },
});
