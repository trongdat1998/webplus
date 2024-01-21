// 首页
import React from "react";
import { injectIntl } from "react-intl";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";

class Index extends React.Component {
  render() {
    const { classes } = this.props;
    const s = classes;
    const index_config = this.props.index_config;
    if (index_config.featureTitle && index_config.features.length) {
      return (
        <div
          className={
            window.localStorage.lang === "zh-cn"
              ? s.feature
              : classnames(s.feature, s.feature_en)
          }
        >
          <h1>{index_config.featureTitle}</h1>
          <ul>
            {index_config.features.map((item, index) => {
              return (
                <li key={index}>
                  <div className="em">
                    <div className="img">
                      <img src={item.image} />
                    </div>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else {
      return "";
    }
  }
}

export default withStyles(styles)(injectIntl(Index));
