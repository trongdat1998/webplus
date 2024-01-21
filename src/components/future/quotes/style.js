export default (theme) => ({
  calcPaper: {
    minWidth: 712,
  },
  calculator: {
    padding: "0 !important",
    overflowX: "hidden",
  },
  cal_tab: {
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
    padding: "0 24px",
    height: 56,
    "& i": {
      cursor: "pointer",
      color: theme.palette.grey[500],
    },
    "& .MuiTab-root": {
      minWidth: "auto",
      paddingLeft: 0,
      paddingRight: 0,
      margin: "0 24px 0 0",
      fontSize: 16,
      color: theme.palette.common.text,
      minHeight: 56,
    },
  },
  cal_content: {
    padding: 20,
    overflow: "hidden",
    "& > div": {
      padding: "12px !important",
    },
  },
  cal_item: {
    height: 48,
    "& label": {
      ...theme.typography.caption,
      color: theme.palette.grey[800],
      lineHeight: "32px",
    },
    "& button": {
      height: 32,
      paddingTop: 5,
      paddingBottom: 5,
    },
    "&:last-child": {
      height: 32,
    },
  },
  cal_result: {
    color: theme.palette.common.text,
    fontWeight: 700,
    padding: 16,
    height: "100%",
    background: theme.palette.grey[50],
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: 2,
    "& label": {
      ...theme.typography.caption,
      color: theme.palette.grey[800],
      fontWeight: 400,
    },
    "& .MuiGrid-item": {
      lineHeight: "32px",
      height: 32,
      margin: "0 0 16px",
    },
  },
  cal_result2: {
    background: theme.palette.grey[50],
    border: `1px solid ${theme.palette.grey[100]}`,
    color: theme.palette.grey[800],
    padding: 16,
    height: "100%",
    borderRadius: 2,
    fontSize: 16,
    "& strong": {
      color: theme.palette.common.text,
      fontSize: 20,
    },
    "& p": {
      margin: "0 0 16px",
      lineHeight: "32px",
    },
  },
  symbolSelect: {
    padding: "7px 8px",
    fontSize: 14,
  },
  label: {
    ...theme.typography.caption,
    display: "block",
    color: theme.palette.grey[800],
    height: 16,
  },
  input: {
    width: "100%",
    color: theme.palette.grey[500],
  },
  filed: {
    color: theme.palette.grey[500],
    height: 32,
    "&:before": {
      borderBottom: `1px solid ${theme.palette.grey[500]}`,
    },
    "&:hover": {
      "&:before": {
        borderBottom: `1px solid ${theme.palette.grey[500]} !important`,
      },
    },
    "& svg": {
      color: theme.palette.grey[500],
    },
    "& input": {
      "&:-webkit-autofill": {
        "-webkit-box-shadow": "0 0 0 30px #1e2430 inset",
        "-webkit-text-fill-color": `${theme.palette.grey[500]}  !important`,
        "&:focus": {
          "-webkit-text-fill-color": `${theme.palette.grey[500]}  !important`,
        },
      },
    },
  },
  filed_diabled: {
    color: theme.palette.grey[500],
    height: 32,
    cursor: "not-allowed",
    "&:after": {
      borderBottom: "0 !important",
    },
    "&:before": {
      borderBottom: `1px solid ${theme.palette.grey[500]}`,
    },
    "&:hover": {
      "&:before": {
        borderBottom: `1px solid ${theme.palette.grey[500]} !important`,
      },
    },
  },
  // focus: {
  //   borderBottom: `0 !important`
  // },
  msg: {
    ...theme.palette.caption,
    display: "flex",
    color: theme.palette.grey[500],
    height: "16px !important",
    margin: "4px 0 0 !important",
    "& :nth-child(1)": {
      flex: 1,
    },
    "& :nth-child(2)": {
      flex: 1,
      textAlign: "right",
      color: `${theme.palette.grey[500]}`,
    },
  },
  setting_list: {
    width: 360,
  },
  glossary: {
    width: 460,
    margin: "0 0 20px",
    display: "flex",
    "& span": {
      width: 90,
      color: theme.palette.grey[500],
    },
    "& p": {
      flex: 1,
      color: theme.palette.common.text,
    },
  },
  // order 确认弹层
  order: {
    width: 360,
    padding: "0 24px 20px",
    "& p": {
      color: theme.palette.grey[800],
      margin: "0 0 10px",
    },
    "& div": {
      color: theme.palette.grey[800],
      margin: "0 0 10px",
      "& span": {
        color: theme.palette.grey[500],
        display: "inline-block",
        width: 88,
      },
    },
  },
  // 增加保证金 弹层
  margin: {
    width: 360,
    padding: "0 24px 20px",
    "& p": {
      color: theme.palette.grey[800],
      margin: "0 0 10px",
    },
    "& div": {
      color: theme.palette.grey[800],
      margin: "0 0 10px",
      display: "flex !important",
      "& span": {
        color: theme.palette.grey[500],
        // display: "inline-block",
        width: "50%",
        // width: 188
      },
    },
  },
  margin_input: {
    margin: "0 !important",
    width: "50% !important",
    "& input": {
      padding: 0,
    },
  },
  active: {
    color: theme.palette.primary.main,
  },
  future: {
    width: 560,
    padding: "0 24px 20px",
    "& p": {
      color: theme.palette.grey[800],
      margin: "0 0 20px",
    },
    "& div": {
      color: theme.palette.grey[800],
      margin: "0 0 10px",
      "& span": {
        color: theme.palette.grey[500],
      },
    },
  },
  risk: {
    width: 560,
    padding: "0 24px 20px",
  },
  sides: {
    "& span": {
      margin: "0 10px 0 0",
      cursor: "pointer",
    },
  },
  side: {
    color: theme.palette.primary.main,
  },
  inputRoot: {
    flex: 1,
    height: 32,
    width: "100%",
    fontSize: 14,
    position: "relative",
    "& .MuiOutlinedInput-root": {
      padding: "0 8px",
    },
    "& .MuiFormHelperText-contained": {
      margin: "0 0 0 8px",
      fontSize: 12,
      lineHeight: "16px",
    },
    "& legend": {
      height: 0,
    },
    "& fieldset": {
      top: 0,
      borderWidth: "1px !important",
      borderColor: theme.palette.grey[200],
      borderRadius: 2,
    },
    "& input": {
      color: theme.palette.common.text,
      fontSize: 14,
      padding: "0 8px 0 0",
      height: "100%",
      boxSizing: "border-box",
      "&.Mui-disabled": {
        fontWeight: "normal",
      },
      "&::placeholder": {
        color: theme.palette.grey[200],
        opacity: 1,
      },
    },
    "& label": {
      fontSize: 14,
    },
  },
  inputFocused: {
    backgroundColor: "transparent",
    "& fieldset": {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },
  inputError: {
    "& fieldset": {
      border: `1px solid ${theme.palette.error.main} !important`,
    },
  },
  dragPopper: {
    zIndex: 1300,
    background: theme.palette.common.white,
    borderRadius: 5,
    width: 712,
    position: "fixed",
    top: 0,
    left: 0,
  },
});
