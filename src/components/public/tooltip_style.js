export default theme => ({
  // 白色通用版
  tooltip: {
    ...theme.typography.body2,
    color: theme.palette.common.black,
    background: theme.palette.common.white,
    padding: "8px 16px",
    borderRadius: 4,
    opacity: 1,
    boxShadow: theme.shadows[2]
  },
  arrow: {
    color: theme.palette.common.white
  },

  // 行情页专用
  modeTooltip: {
    ...theme.typography.body2,
    color: theme.palette2.grey[200],
    background: theme.palette2.background.paper,
    padding: "8px 16px",
    borderRadius: 4,
    opacity: 1,
    fontSize: 12,
    boxShadow: theme.shadows[2]
  },
  modeArrow: {
    color: theme.palette2.background.paper
  },

  // 行情页slider组件专用
  silderTooltip: {
    ...theme.typography.body2,
    color: theme.palette2.grey[200],
    background: theme.palette2.grey[700],
    padding: "4px 6px",
    borderRadius: 2,
    opacity: 1,
    bottom: 1,
    fontSize: 12
  },
  silderArrow: {
    color: theme.palette2.grey[700]
  }
});
