export default (theme) => ({
  tip_dialog: {
    "& > div": {
      maxWidth: 560,
    },
  },
  tip_dialog_title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tip_title: {
    color: "#242B32",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "bold",
  },
  tip_close_btn: {
    position: "absolute",
    top: 5,
    right: 12,
  },
  tip_action: {
    margin: "24px",
    display: "flex",
    justifyContent: "space-between",
    "& button": {
      ...theme.typography.button,
      width: 152,
      height: 40,
      color: theme.palette.common.white,
    },
  },
  tip_content: {
    padding: "16px 24px !important",
    ...theme.typography.body2,
    color: theme.palette.grey[800],
    fontSize: 14,
    lineHeight: "20px",
    border: "1px solid #f4f4f5",
    "& a": {
      color: theme.palette.primary.main,
    },
  },
  tip_detail: {
    width: "100%",
    height: 208,
    marginTop: "8px",
    textAlign: "justify",
  },
  tip_checkbox_label: {
    color: theme.palette.common.text,
    fontSize: "12px",
    lineHeight: "16px",
  },
  tip_btn: {
    width: 152,
    height: 40,
    borderRadius: 4,
  },
});
