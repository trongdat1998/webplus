// 邀请活动
import React from "react";
import route_map from "../../config/route_map";
import { injectIntl } from "react-intl";
import { message, Iconfont, Table } from "../../lib";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Poster from "../../utils/poster";
import {
  Button,
  Grid,
  Popover,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@material-ui/core";
import styles from "./usercenter_style";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";

class UserCenter extends React.Component {
  constructor() {
    super();
    this.state = {
      download: "",
      download_octet: [],
      anchorEl: null,
      tab: 0,
      modal: false,
    };
  }
  codeStatusChange = (status) => (e) => {
    this.setState({
      anchorEl: Boolean(status) ? e.currentTarget : null,
    });
  };
  componentDidMount() {
    this.props.dispatch({
      type: "layout/commonConfig",
      payload: {},
    });
    this.props.dispatch({
      type: "user/invite_share_info",
      payload: {},
    });
    this.props.dispatch({
      type: "user/invite",
      payload: {},
    });
    this.props.dispatch({
      type: "user/level_list",
      payload: {},
    });
    this.getMore();
  }
  getMore = (key) => {
    this.props.dispatch({
      type: `user/${key}`,
      payload: {},
    });
  };
  componentDidUpdate(preProps) {
    if (!preProps.invite_info.inviteCode && this.props.invite_info.inviteCode) {
      this.props.dispatch({
        type: "layout/getQrCode",
        payload: {
          content: encodeURIComponent(
            window.location.protocol +
              "//" +
              window.location.hostname +
              route_map.register +
              "/" +
              this.props.invite_info.inviteCode
          ),
        },
      });
    }
    if (
      this.props.invite_share_info &&
      this.props.invite_share_info.posterUrls
    ) {
      this.download(
        this.props.invite_share_info.posterUrls,
        this.props.invite_share_info.shareUrl
      );
    }
  }
  copy = () => {
    message.info(
      this.props.intl.formatMessage({
        id: "复制成功",
      })
    );
  };
  download = (urls, shareUrl) => {
    if (!urls || this.state.download) return;
    let pics = [];
    urls.map((item, i) => {
      Poster(
        item,
        shareUrl,
        (base64) => {
          pics[i] = base64;
          this.setState({
            download: base64,
            download_octet: pics,
          });
        },
        i
      );
    });
  };
  tabChange = (e, v) => {
    this.setState({
      tab: v,
    });
    this.getMore(["invite_list", "bonus_info_list"][v]);
  };
  changeModal(modal) {
    this.setState({ modal: modal });
  }
  render() {
    const { classes } = this.props;
    const column = [
      {
        title: this.props.intl.formatMessage({
          id: "日期",
        }),
        key: "statisticsTime",
      },
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "token",
      },

      {
        title: this.props.intl.formatMessage({
          id: "交易返佣",
        }),
        key: "bonusAmount",
      },
    ];
    const column_info = [
      {
        title: this.props.intl.formatMessage({
          id: "被邀请人账号",
        }),
        key: "inviteId",
        render: (text, record) => {
          if (record.registerType == 1) {
            return <span>{record.mobile}</span>;
          }
          return <span>{record.email}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "邀请时间",
        }),
        key: "registerDate",
        render: (text) => {
          return text
            ? moment.utc(Number(text)).local().format("YYYY-MM-DD HH:mm:ss")
            : "";
        },
      },

      {
        title: this.props.intl.formatMessage({
          id: "邀请关系",
        }),
        key: "inviteType",
        render: (text) => {
          return this.props.intl.formatMessage({
            id: text == 1 ? "直接邀请" : "间接邀请",
          });
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "状态",
        }),
        key: "bonusAmount",
        render: (text) => {
          return this.props.intl.formatMessage({ id: "成功" });
        },
      },
    ];
    return (
      <div className={classes.invite}>
        <canvas
          id="canvas"
          style={{ position: "absolute", top: "-10000px", opacity: 0 }}
        />
        <div
          className={classes.invite_banner}
          style={
            this.props.commonConfig &&
            this.props.commonConfig.list &&
            this.props.commonConfig.list.invite_title_pic_pc
              ? {
                  background: `url(${this.props.commonConfig.list.invite_title_pic_pc}) no-repeat center`,
                }
              : {}
          }
        >
          {this.props.commonConfig &&
          this.props.commonConfig.list &&
          this.props.commonConfig.list.invite_activity_rule_url ? (
            <a
              href={this.props.commonConfig.list.invite_activity_rule_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              &nbsp;
            </a>
          ) : (
            ""
          )}
        </div>
        <div className={classes.center}>
          <div className={classes.password_title}>
            {this.props.intl.formatMessage({
              id: "我的邀请",
            })}
          </div>
          <Grid container className={classes.invite_info}>
            <Grid item xs={3}>
              <h2>
                {this.props.intl.formatMessage({
                  id: "邀请码",
                })}
              </h2>
              <div className={classes.invite_line}>
                <p>{this.props.invite_info.inviteCode}</p>
                <CopyToClipboard
                  text={this.props.invite_info.inviteCode}
                  onCopy={this.copy}
                >
                  <em>
                    {this.props.intl.formatMessage({
                      id: "复制",
                    })}
                  </em>
                </CopyToClipboard>
              </div>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={5}>
              <h2>
                {this.props.intl.formatMessage({
                  id: "邀请链接",
                })}
              </h2>
              <div className={classes.invite_line}>
                <p>
                  {window.location.protocol +
                    "//" +
                    window.location.hostname +
                    route_map.register +
                    "/" +
                    this.props.invite_info.inviteCode}
                </p>
                <Iconfont
                  onMouseEnter={this.codeStatusChange(true)}
                  onMouseLeave={this.codeStatusChange(false)}
                  type="code1"
                  size="22"
                />
                <Popover
                  open={Boolean(this.state.anchorEl)}
                  className={classes.invite_popover}
                  anchorEl={this.state.anchorEl}
                  onClose={this.codeStatusChange(false)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  disableRestoreFocus
                >
                  {this.props.qrcode ? (
                    <img
                      alt=""
                      src={"data:image/png;base64," + this.props.qrcode}
                      style={{ width: 200, height: 200 }}
                    />
                  ) : (
                    <div style={{ height: "200px", width: 200 }} />
                  )}
                </Popover>
                <CopyToClipboard
                  text={
                    window.location.protocol +
                    "//" +
                    window.location.hostname +
                    route_map.register +
                    "/" +
                    this.props.invite_info.inviteCode
                  }
                  onCopy={this.copy}
                >
                  <em>
                    {this.props.intl.formatMessage({
                      id: "复制",
                    })}
                  </em>
                </CopyToClipboard>
              </div>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={2}>
              <h2>
                {this.props.intl.formatMessage({
                  id: "邀请海报",
                })}
              </h2>
              <Button
                color="primary"
                variant="contained"
                onClick={this.changeModal.bind(this, true)}
              >
                {this.props.intl.formatMessage({
                  id: "点击下载",
                })}
              </Button>
            </Grid>
          </Grid>

          <div className={classes.invite_con}>
            <div className={classes.invite_title}>
              {this.props.intl.formatMessage({
                id: "邀请人数",
              })}
            </div>
            <Paper elevation={1}>
              <Grid container className={classes.invite_count}>
                <Grid item xs={3}>
                  <strong>{this.props.invite_info.inviteCount}</strong>
                  <span>
                    {this.props.intl.formatMessage({
                      id: "总数",
                    })}
                  </span>
                </Grid>
                <Grid item xs={1} className={classes.invite_count_line} />
                <Grid item xs={3}>
                  <strong>
                    {this.props.invite_info.inviteDirectVaildCount}
                  </strong>
                  <span>
                    {this.props.intl.formatMessage({
                      id: "直接邀请",
                    })}
                  </span>
                </Grid>
                <Grid item xs={1} className={classes.invite_count_line} />
                <Grid item xs={4}>
                  <strong>
                    {this.props.invite_info.inviteIndirectVaildCount}
                  </strong>
                  <span>
                    {this.props.intl.formatMessage({
                      id: "间接邀请",
                    })}
                  </span>
                </Grid>
              </Grid>
            </Paper>
          </div>
          <div className={classes.invite_con}>
            <Tabs
              value={this.state.tab}
              onChange={this.tabChange}
              indicatorColor="primary"
              textColor="primary"
              classes={{
                root: classes.tabsRoot,
                indicator: classes.tabsIndicator,
              }}
            >
              <Tab
                label={this.props.intl.formatMessage({ id: "返佣记录" })}
                classes={{ root: classes.tabRoot }}
              />
              <Tab
                label={this.props.intl.formatMessage({ id: "邀请明细" })}
                classes={{ root: classes.tabRoot }}
              />
            </Tabs>
            {this.state.tab == 0 ? (
              <Table
                className={classes.apiList}
                widthStyle={classes.inviteListTitle}
                data={this.props.bonus_list}
                titles={column}
                getMore={this.getMore.bind(this, "invite_list")}
                useWindow={true}
                hasMore={
                  !this.props.loading.effects["user/invite_list"] &&
                  this.props.bonus_list_more
                }
              />
            ) : (
              ""
            )}
            {this.state.tab == 1 ? (
              <Table
                className={classes.apiList}
                widthStyle={classes.inviteListTitle2}
                data={this.props.bonus_info_list}
                titles={column_info}
                getMore={this.getMore.bind(this, "bonus_info_list")}
                useWindow={true}
                hasMore={
                  !this.props.loading.effects["user/bonus_info_list"] &&
                  this.props.bonus_info_list_more
                }
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <Dialog
          open={this.state.modal}
          onClose={this.changeModal.bind(this, false)}
          classes={{ paperScrollPaper: classes.modal }}
        >
          <DialogTitle className={classes.modalTitle}>
            <p>
              {this.props.intl.formatMessage({
                id: "captain.detail.invite.user",
              })}
            </p>
            <Iconfont
              type="close"
              size="24"
              onClick={this.changeModal.bind(this, false)}
            />
          </DialogTitle>
          <DialogContent className={classes.modalContent}>
            {(this.props.invite_share_info.posterUrls || []).map((item, i) => {
              const pic = this.state.download_octet[i];
              return (
                <div className={classes.posterItem}>
                  {pic ? (
                    <img src={pic} />
                  ) : (
                    <div className={classes.loading}>
                      <CircularProgress />
                    </div>
                  )}
                  <Button
                    color="primary"
                    variant="contained"
                    id="downloadlink"
                    download="invite_poster.png"
                    disabled={!pic}
                    href={
                      pic ? pic.replace("image/png", "image/octet-stream") : ""
                    }
                  >
                    {this.props.intl.formatMessage({
                      id: "captain.detail.invite.download_poster",
                    })}
                  </Button>
                </div>
              );
            })}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(UserCenter));
