// 首页
import React from "react";
import { injectIntl } from "react-intl";
import { Tooltip, Fab } from "@material-ui/core";
import { Iconfont } from "../../lib";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style.js";

class Index extends React.Component {
  constructor() {
    super();
  }
  render() {
    const { classes } = this.props;
    const shareConfig =
      this.props.index_config && this.props.index_config.shareConfig
        ? this.props.index_config.shareConfig
        : {
            openUrl: "",
            openUrlImgBase64: "",
          };
    if (!shareConfig.openUrlImgBase64 || !shareConfig.openUrl) {
      return <div />;
    }
    return (
      <div>
        <h1 className={classes.download_title}>
          {this.props.intl.formatMessage({ id: "客户端下载" })}
        </h1>
        <div className={classes.download}>
          <div className={classes.download2}>
            <strong>
              {this.props.intl.formatMessage({
                id: "全平台交易终端，助赢交易每一刻。",
              })}
            </strong>
            <p />
            <div className={classes.links}>
              <div>
                <Tooltip
                  classes={{
                    tooltip: classes.tooltip,
                  }}
                  title={
                    <div className={classes.qrcode}>
                      <span>
                        {this.props.intl.formatMessage({
                          id: "扫码下载",
                        })}
                      </span>
                      <img
                        alt=""
                        src={
                          "data:image/png;base64," +
                          shareConfig.openUrlImgBase64
                        }
                      />
                      <em />
                    </div>
                  }
                  placement="top"
                >
                  <Fab
                    // variant="fab"
                    aria-label="Add"
                    color="primary"
                    className={classes.button}
                    href={shareConfig.openUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Iconfont type="apple" size="24" />
                  </Fab>
                </Tooltip>
                <em>IOS</em>
              </div>

              <div>
                <Tooltip
                  classes={{
                    tooltip: classes.tooltip,
                  }}
                  title={
                    <div className={classes.qrcode}>
                      <span>
                        {this.props.intl.formatMessage({
                          id: "扫码下载",
                        })}
                      </span>
                      <img
                        alt=""
                        src={
                          "data:image/png;base64," +
                          shareConfig.openUrlImgBase64
                        }
                      />
                      <em />
                    </div>
                  }
                  placement="top"
                >
                  <Fab
                    // variant="fab"
                    aria-label="Add"
                    color="primary"
                    className={classes.button}
                    href={shareConfig.openUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Iconfont type="android" size="24" />
                  </Fab>
                </Tooltip>
                <em>Android</em>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Index));
