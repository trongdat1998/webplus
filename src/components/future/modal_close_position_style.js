import helper from "../../utils/helper";
export default (theme) => ({
  formRow: {
    color: theme.palette.primary.main,
    margin: "8px 0",
    "& span": {
      color: "#000",
    },
  },
  formLabel: {
    color: "#919598",
    fontSize: "14px",
    lineHeight: "20px",
    minWidth: "88px",
    marginRight: 16,
    display: "inline-block",
  },
  desc: {
    fontSize: "12px",
    color: "#50555B",
    lineHeight: "20px",
  },
});
