// 首页
import React from "react";
import { injectIntl } from "react-intl";
import classnames from "classnames";
import styles from "./style.js";
import { withStyles } from "@material-ui/core/styles";
import helper from "../../utils/helper";

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      classname: ""
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  handleScroll() {
    const { classes } = this.props;
    let dom = document.getElementById("feature");
    let getClientHeight = helper.getClientHeight(); // 窗口可视范围的高度
    if (dom) {
      let offset = dom.offsetTop;
      if (helper.getScrollTop() + getClientHeight > offset + 180) {
        this.setState({
          classname: classes.featureFadeIn
        });
      }
    }
  }
  render() {
    const { classes } = this.props;
    const index_config = this.props.index_config;
    const indexModules = index_config.indexModules || {};
    const platform_info = indexModules.platform || {
      content: { featureTitle: "", features: [] }
    };
    let style = {};
    if (platform_info.content.image) {
      style.backgroundImage = `url(${platform_info.content.image})`;
      style.backgroundPosition = "center";
    }
    if (platform_info.content.background) {
      style.backgroundColor = platform_info.content.background;
    }
    return (
      <div className={classes.feature} id="feature" style={style}>
        <h1 className={classes.title}>{platform_info.content.featureTitle}</h1>
        <ul className={this.state.classname}>
          {platform_info.content.features.map((item, index) => {
            return (
              <li key={index}>
                <div className={classes.img}>
                  <img src={item.image} />
                </div>
                <h2>{item.title}</h2>
                <p
                  dangerouslySetInnerHTML={{
                    __html: helper.dataReform(
                      item.description
                        ? item.description.replace(/<script>|<\/script>/gi, "")
                        : ""
                    )
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Index));
