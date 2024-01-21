// 首页
import React from "react";
import { Link } from "dva/router";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import { Iconfont } from "../../lib";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style.js";
import { Fab } from "@material-ui/core";
import math from "../../utils/mathjs";
import helper from "../../utils/helper";
import classnames from "classnames";

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      bonus_show: true,
      open: false,
      classname: "",
      classname1: "",
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  handleScroll() {
    const { classes } = this.props;
    let organization = document.getElementById("organization");
    let download = document.getElementById("download");
    let getClientHeight = helper.getClientHeight(); // 窗口可视范围的高度
    if (organization) {
      let offset = organization.offsetTop;
      if (helper.getScrollTop() + getClientHeight > offset) {
        this.setState({
          classname: classes.organizationFadeIn,
        });
      }
    }
    if (download) {
      let offset = download.offsetTop;
      if (helper.getScrollTop() + getClientHeight > offset + 150) {
        this.setState({
          classname1: classes.downloadFadeIn,
        });
      }
    }
  }
  render() {
    const { classes, index_config } = this.props;
    const indexModules = index_config.indexModules || {};
    const download_info = indexModules.download || { content: {} };

    const style = download_info.content.image
      ? { backgroundImage: `url(${download_info.content.image})` }
      : {};
    const style2 = download_info.content.background
      ? { background: `${download_info.content.background}` }
      : {};
    return (
      <div
        className={classes.download_bg}
        style={style2}
        key="download"
        id="download"
      >
        <h1 className={classes.title}>{download_info.content.title}</h1>
        <div
          className={classnames(classes.download, this.state.classname1)}
          style={style}
        >
          <div className={classes.download2}>
            <div className={classes.links}>
              {download_info.content.list.map((item) => {
                return (
                  <div key={item.tag}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.image ? <img src={item.image} /> : ""}
                      <em>{item.name}</em>
                    </a>
                  </div>
                );
              })}
            </div>
            {this.props.index_config.shareConfig &&
            this.props.index_config.shareConfig.openUrlImgBase64 ? (
              <div className={classes.download_qr}>
                <img
                  src={
                    "data:image/png;base64," +
                    this.props.index_config.shareConfig.openUrlImgBase64
                  }
                />
                <p>
                  {this.props.intl.formatMessage({
                    id: "ios_android_scan",
                  })}
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Index));
