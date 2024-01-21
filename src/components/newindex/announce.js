// 首页
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { injectIntl } from "react-intl";
import { Iconfont } from "../../lib";

class Announce extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.notice_bg}>
        <div className={classes.notice}>
          {[1, 2, 3].map((item, i) => {
            return this.props.index_config.announcements &&
              this.props.index_config.announcements[i] ? (
              <div key={i}>
                {this.props.index_config.announcements[i]["isDirect"] ? (
                  <a
                    href={this.props.index_config.announcements[i]["directUrl"]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {this.props.index_config.announcements[i]["title"]}
                  </a>
                ) : (
                  <a>{this.props.index_config.announcements[i]["title"]}</a>
                )}
                {i < 2 &&
                this.props.index_config.announcements[i] &&
                this.props.index_config.announcements.length - 1 != i ? (
                  <span>|</span>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            );
          })}
          {this.props.index_config.announcementMoreUrl ? (
            <div>
              <span>|</span>
              <a
                href={this.props.index_config.announcementMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {this.props.intl.formatMessage({ id: "查看更多" })}
                <Iconfont type="arrowRight" size="20" />
              </a>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Announce));
