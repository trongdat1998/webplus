// 首页
import React from "react";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style.js";
import helper from "../../utils/helper";
import classnames from "classnames";

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      bonus_show: true,
      open: false,
      modules: [0, 0, 0],
      classname: []
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.setState({
      classname: [
        this.props.classes.organization,
        this.props.classes.organization,
        this.props.classes.organization
      ]
    });
  }
  handleScroll() {
    const indexModules = this.props.index_config.indexModules;
    const modules = [
      indexModules.userDefine1,
      indexModules.userDefine2,
      indexModules.userDefine3
    ];
    const ids = [
      modules[0] ? document.getElementById(modules[0]["moduleName"]) : "",
      modules[1] ? document.getElementById(modules[1]["moduleName"]) : "",
      modules[2] ? document.getElementById(modules[2]["moduleName"]) : ""
    ];
    let getClientHeight = helper.getClientHeight(); // 窗口可视范围的高度
    ids.map((item, i) => {
      if (item && !this.state.modules[i]) {
        let offset = item.offsetTop;
        if (helper.getScrollTop() + getClientHeight > offset) {
          let classname = [...this.state.classname];
          classname[i] = classnames(
            classname[i],
            this.props.classes.organizationFadeIn
          );
          let modules = [...this.state.modules];
          modules[i] = 1;
          this.setState({
            classname,
            modules
          });
        }
      }
    });
    // if (organization) {
    //   let offset = organization.offsetTop;
    //   if (helper.getScrollTop() + getClientHeight > offset) {
    //     this.setState({
    //       classname: s.organizationFadeIn
    //     });
    //   }
    // }
    // if (download) {
    //   let offset = download.offsetTop;
    //   if (helper.getScrollTop() + getClientHeight > offset + 150) {
    //     this.setState({
    //       classname1: s.downloadFadeIn
    //     });
    //   }
    // }
  }
  render() {
    const { classes, index_config } = this.props;
    const indexModules = index_config.indexModules;
    const modules = [
      indexModules.userDefine1,
      indexModules.userDefine2,
      indexModules.userDefine3
    ];
    return (
      <div>
        {modules.map((item, i) => {
          if (item && item.content) {
            const style = item.content.background
              ? { background: item.content.background }
              : {};
            return item.content.link ? (
              <a href={item.content.link} key={item.moduleName}>
                <div
                  className={this.state.classname[i]}
                  id={item.moduleName}
                  style={style}
                >
                  <h1 className={classes.title}>{item.content.title}</h1>
                  {item.content.image ? <img src={item.content.image} /> : ""}
                </div>
              </a>
            ) : (
              <div
                className={this.state.classname[i]}
                key={item.moduleName}
                id={item.moduleName}
                style={style}
              >
                <h1 className={classes.title}>{item.content.title}</h1>
                {item.content.image ? <img src={item.content.image} /> : ""}
              </div>
            );
          }
        })}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Index));
