import React from "react";
import { Grid, Button, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import helper from "../../utils/helper";
import styles from "./style";
import moment from "moment";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";

function deadlineFormat(t) {
  const n = Number(t);
  if (!n) {
    return [0, 0, 0, 0];
  }
  const d = Math.floor(n / (24 * 60 * 60 * 1000));
  const h = Math.floor((t - d * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
  const m = Math.floor(
    (t - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000) / (60 * 1000)
  );
  const s = Math.floor(
    (t - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000 - m * 60 * 1000) / 1000
  );
  return [d, h, m, s];
}

class ItemRC extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {
    if (helper.changeVersion()) {
      window.location.href = "/activity/xo";
      return;
    }
    this.getMore();
    this.run();
  }
  run = async () => {
    const project_list = [...this.props.project_list];
    if (project_list.length) {
      project_list.map(item => {
        item.remainMillSecondForStart = Math.max(
          0,
          item.remainMillSecondForStart - 1000
        );
        item.remainMillSecondForEnd = Math.max(
          0,
          item.remainMillSecondForEnd - 1000
        );
        if (item.remainMillSecondForStart == 0 && item.status == 1) {
          item.status = 2;
        }
        return item;
      });
      await this.props.dispatch({
        type: "ieo/save",
        payload: {
          project_list
        }
      });
    }
    await helper.delay(1000);
    this.run();
  };
  getMore = () => {
    this.props.dispatch({
      type: "ieo/project_list",
      payload: {}
    });
  };
  render() {
    const project_list = this.props.project_list || [];
    const { classes } = this.props;
    const loading = Boolean(
      this.props.loading &&
        this.props.loading.effects &&
        this.props.loading.effects["ieo/project_list"]
    );

    return (
      <div className={classes.list}>
        <div
          className={classes.banner}
          style={{
            height: 350,
            backgroundSize: 'cover',
            backgroundImage:
              `url(${this.props.ieoSettings.webBackground})` || ""
          }}
        >
          <h2>{this.props.ieoSettings.title}</h2>
        </div>
        <div className={classes.content}>
          <Grid container justify="flex-end" className={classes.order}>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                href={route_map.ieo_order}
              >
                {this.props.intl.formatMessage({ id: "申购订单" })}
              </Button>
            </Grid>
          </Grid>
          <div className={classes.datas}>
            {project_list.map(item => {
              const remainMillSecondForStart = deadlineFormat(
                item.remainMillSecondForStart
              );
              const remainMillSecondForEnd = deadlineFormat(
                item.remainMillSecondForEnd
              );
              return (
                <Grid container className={classes.item} key={item.id}>
                  <Grid item className={classes.item_s1}>
                    <a href={route_map.ieo_item + "/" + item.projectCode}>
                      <img src={item.url} />
                    </a>
                  </Grid>
                  <Grid item className={classes.item_s2}>
                    <h3>
                      <a href={route_map.ieo_item + "/" + item.projectCode}>
                        {item.projectName}
                      </a>
                    </h3>
                    <p>{item.introducation}</p>
                    <ul>
                      <li>
                        <span>
                          {this.props.intl.formatMessage({ id: "分配总量" })}
                        </span>
                        <i>
                          {item.offeringsVolume}
                          {item.offeringsToken}
                        </i>
                      </li>
                      <li>
                        <span>
                          {this.props.intl.formatMessage({ id: "结束时间" })}
                        </span>
                        <i>
                          {Number(item.endTime)
                            ? moment
                                .utc(Number(item.endTime))
                                .local()
                                .format("YYYY-MM-DD HH:mm:ss")
                            : ""}
                        </i>
                      </li>
                    </ul>
                  </Grid>
                  <Grid item className={classes.item_s3}>
                    {item.status == 1 ? (
                      <Button
                        className={classes.white}
                        fullWidth
                        color="secondary"
                        variant="contained"
                        href={route_map.ieo_item + "/" + item.projectCode}
                      >
                        {this.props.intl.formatMessage({
                          id: "距离开始还剩"
                        })}
                        :{remainMillSecondForStart[0]}
                        {this.props.intl.formatMessage({ id: "天" })}
                        {remainMillSecondForStart[1]}
                        {this.props.intl.formatMessage({ id: "时" })}
                        {remainMillSecondForStart[2]}
                        {this.props.intl.formatMessage({ id: "分" })}
                        {remainMillSecondForStart[3]}
                        {this.props.intl.formatMessage({ id: "秒" })}
                      </Button>
                    ) : (
                      ""
                    )}
                    {item.status == 2 ? (
                      <Button
                        className={classes.white}
                        fullWidth
                        color="secondary"
                        variant="contained"
                        href={route_map.ieo_item + "/" + item.projectCode}
                      >
                        {this.props.intl.formatMessage({
                          id: "距离结束还剩"
                        })}
                        :{remainMillSecondForEnd[0]}
                        {this.props.intl.formatMessage({ id: "天" })}
                        {remainMillSecondForEnd[1]}
                        {this.props.intl.formatMessage({ id: "时" })}
                        {remainMillSecondForEnd[2]}
                        {this.props.intl.formatMessage({ id: "分" })}
                        {remainMillSecondForEnd[3]}
                        {this.props.intl.formatMessage({ id: "秒" })}
                      </Button>
                    ) : (
                      ""
                    )}
                    {item.status == 3 ? (
                      <Button
                        className={classes.white}
                        fullWidth
                        color="secondary"
                        variant="contained"
                        href={route_map.ieo_item + "/" + item.projectCode}
                      >
                        {this.props.intl.formatMessage({ id: "结果计算中" })}
                      </Button>
                    ) : (
                      ""
                    )}
                    {item.status == 4 ? (
                      <Button
                        className={classes.white}
                        fullWidth
                        color="primary"
                        variant="contained"
                        href={route_map.ieo_item + "/" + item.projectCode}
                      >
                        {this.props.intl.formatMessage({ id: "公布结果" })}
                      </Button>
                    ) : (
                      ""
                    )}
                    {item.status == 5 ? (
                      <Button
                        className={classes.white}
                        fullWidth
                        variant="contained"
                        href={route_map.ieo_item + "/" + item.projectCode}
                      >
                        {this.props.intl.formatMessage({ id: "已结束" })}
                      </Button>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
              );
            })}
          </div>
          <div className={classes.order_more}>
            {this.props.ieo_project_more ? (
              loading ? (
                <CircularProgress />
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.getMore}
                >
                  {this.props.intl.formatMessage({ id: "加载更多" })}
                </Button>
              )
            ) : (
              <p>{this.props.intl.formatMessage({ id: "无更多数据" })}</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(ItemRC));
