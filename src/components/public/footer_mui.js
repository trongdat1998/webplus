// 公共头
import React from "react";
import { Link } from "dva/router";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import { Iconfont } from "../../lib";
import { withStyles } from "@material-ui/core/styles";
import styles from "./header_footer_style";
import classnames from "classnames";

class Footer extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {}
  componentDidCatch(error, info) {}
  close = () => {
    this.setState({
      close: true,
    });
  };
  render() {
    const { classes } = this.props;
    if (this.props.hide_footer) {
      return "";
    }
    return (
      <div className={classes.footerBox}>
        <div className={classes.footer}>
          <div className={classes.f_logo}>
            <a href={route_map.index}>
              <img src={this.props.index_config.logo} />
            </a>
            <p className={classes.copyright}>
              {this.props.index_config && this.props.index_config.copyright}
            </p>
            <ul className={classes.contact}>
              {this.props.index_config
                ? this.props.index_config.shares.map((item, index) => {
                    return (
                      <li key={index}>
                        <a
                          title={item.title}
                          target="_blank"
                          rel="noopener noreferrer"
                          href={item.shareUrl}
                        >
                          <Iconfont type={item.shareKey} size={32} />
                        </a>
                        {{ wechat: 1, line: 1, discord: 1 }[item.shareKey] &&
                        item.shareUrl ? (
                          <div className={classes.qrcode_bg}>
                            <img src={item.shareUrl} />
                          </div>
                        ) : (
                          ""
                        )}
                      </li>
                    );
                  })
                : ""}
            </ul>
          </div>
          <ul className={classes.f_content}>
            {this.props.index_config
              ? this.props.index_config.footConfigList.map((item, index) => {
                  return (
                    <li key={index}>
                      <h3>{item.caption}</h3>
                      <ul className={classes.f_subcontent}>
                        {item.items.map((list, i) => {
                          return (
                            <li key={`list${i}`}>
                              <a
                                title={list.text}
                                target={list.blank ? "_blank" : ""}
                                href={list.link}
                                rel="noopener noreferrer"
                              >
                                {list.text}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })
              : ""}
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Footer));
