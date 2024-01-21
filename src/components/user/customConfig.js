// 个性化配置
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import helper from "../../utils/helper";
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Select,
  MenuList,
  MenuItem,
  Radio,
} from "@material-ui/core";
import styles from "./usercenter_style";
import { withStyles } from "@material-ui/core/styles";
import GoBackRC from "./goBack";
import classnames from "classnames";

class UserCenterConfig extends React.Component {
  constructor() {
    super();
    this.state = {
      lang: window.localStorage.lang,
      unit: window.localStorage.unit,
      up_down: window.localStorage.up_down,
    };
  }
  componentDidMount() {}
  langChange = async (e) => {
    const v = e.target.value;
    await this.props.dispatch({
      type: "layout/setCustomConfig",
      payload: {
        lang: v,
      },
    });
    const s = window.location.search;
    let paramLang = s.match(/lang\=([^&]{0,})/);
    if (paramLang && paramLang[1]) {
      let link = window.location.href;
      link = link.replace(/lang\=[^&]{0,}/, "lang=" + v);
      window.location.href = link;
    } else {
      window.location.reload();
    }
  };
  unitChange = async (e) => {
    const v = e.target.value;
    window.localStorage.unit = v;
    this.setState({
      unit: v,
    });
    await this.props.dispatch({
      type: "layout/setCustomConfig",
      payload: {
        unit: v,
      },
    });
  };
  colorChange = (e) => {
    const v = e.target.value;
    window.localStorage.up_down = Number(v);
    this.setState({
      up_down: Number(v),
    });
    this.props.dispatch({
      type: "layout/setCustomConfig",
      payload: {
        up_down: v,
      },
    });
  };
  render() {
    const classes = this.props.classes;
    let suffix = [];
    (window.WEB_CONFIG.supportLanguages || []).map((item) => {
      if (suffix.findIndex((it) => it.suffix == item.suffix) == -1) {
        suffix.push(item);
      }
    });
    return (
      <div className={classes.center}>
        <Grid container>
          <Grid item xs={3}>
            <GoBackRC />
          </Grid>
          <Grid item xs={6}>
            <div className={classes.usercenter_title}>
              {this.props.intl.formatMessage({ id: "偏好设置" })}
            </div>
            <div className={classes.custom_config}>
              <div className={classes.g_form}>
                <div
                  className={classnames(classes.formItem, classes.formItem2)}
                >
                  <div className={classes.formContent} style={{ flex: 1 }}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        {this.props.intl.formatMessage({ id: "语言" })}
                      </Grid>
                      <Grid item>
                        <Select
                          value={this.state.lang}
                          onChange={this.langChange}
                          variant="outlined"
                          classes={{
                            root: classes.selectoutline,
                          }}
                        >
                          {(window.WEB_CONFIG.supportLanguages || []).map(
                            (item) => {
                              return (
                                <MenuItem
                                  className={classes.dMenuItem}
                                  key={item.lang}
                                  value={item.lang}
                                >
                                  {item.text}
                                </MenuItem>
                              );
                            }
                          )}
                        </Select>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <div
                  className={classnames(classes.formItem, classes.formItem2)}
                >
                  <div className={classes.formContent} style={{ flex: 1 }}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        {this.props.intl.formatMessage({ id: "法币汇率" })}
                      </Grid>
                      <Grid item>
                        <Select
                          value={this.state.unit}
                          onChange={this.unitChange}
                          variant="outlined"
                          classes={{
                            root: classes.selectoutline,
                          }}
                        >
                          {suffix.map((item) => {
                            return (
                              <MenuItem
                                className={classes.dMenuItem}
                                key={item.lang + item.suffix}
                                value={item.lang}
                              >
                                {item.suffix}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </Grid>
                    </Grid>
                  </div>
                </div>

                <div
                  className={classnames(classes.formItem, classes.formItem2)}
                >
                  <div className={classes.formContent} style={{ flex: 1 }}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item style={{ flex: 1 }}>
                        {this.props.intl.formatMessage({ id: "颜色配置" })}
                      </Grid>
                      <Grid item style={{ width: 420 }}>
                        <Grid container>
                          <Grid item style={{ flex: 1 }}>
                            <img
                              src={require("../../assets/up_down_0.png")}
                              style={{ width: 186, cursor: "pointer" }}
                              onClick={this.colorChange.bind(this, {
                                target: { value: 0 },
                              })}
                            />
                          </Grid>
                          <Grid item style={{ width: 196 }}>
                            <img
                              src={require("../../assets/up_down_1.png")}
                              style={{ width: 186, cursor: "pointer" }}
                              onClick={this.colorChange.bind(this, {
                                target: { value: 1 },
                              })}
                            />
                          </Grid>
                          <Grid item style={{ flex: 1 }}>
                            <Grid container alignItems="center">
                              <Grid item>
                                <Radio
                                  value={0}
                                  color="primary"
                                  checked={this.state.up_down == 0}
                                  onChange={this.colorChange}
                                />
                              </Grid>
                              <Grid item>
                                <span>
                                  {this.props.intl.formatMessage({
                                    id: "绿涨红跌",
                                  })}
                                </span>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item style={{ width: 196 }}>
                            <Grid container alignItems="center">
                              <Grid item>
                                <Radio
                                  value={1}
                                  color="primary"
                                  checked={this.state.up_down == 1}
                                  onChange={this.colorChange}
                                />
                              </Grid>
                              <Grid item>
                                <span>
                                  {this.props.intl.formatMessage({
                                    id: "红涨绿跌",
                                  })}
                                </span>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(UserCenterConfig));
