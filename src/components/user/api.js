// api管理
import React from "react";
import { message } from "../../lib";
import { FormattedMessage, injectIntl } from "react-intl";
import moment from "moment";
import SecVerify from "../public/secVerify_mui";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Vali from "../../utils/validator";
import helper from "../../utils/helper";
import {
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Switch,
  Select,
  MenuItem,
} from "@material-ui/core";
import styles from "./usercenter_style";
import { withStyles } from "@material-ui/core/styles";
import GoBackRC from "./goBack";
import TextFieldCN from "../public/textfiled";

class API extends React.Component {
  constructor() {
    super();
    this.secverifyRef = React.createRef();
    this.state = {
      step: "", // 当前步骤，create, update,del,status
      isopen: false,
      isopen2: false,
      copied: false,
      serVerify: false,
      verifyType: 11, // 11=create , 12= update, status, 13= del
      status: false, // 启用，禁用当前选项的值
      i: "",
      index: -1, // 当前修改的data index
      apiname: {
        value: "",
        msg: "",
      },
      apitype: 1,
      address: [
        {
          value: "",
          msg: "",
          status: false,
        },
        {
          value: "",
          msg: "",
          status: false,
        },
        {
          value: "",
          msg: "",
          status: false,
        },
        {
          value: "",
          msg: "",
          status: false,
        },
        {
          value: "",
          msg: "",
          status: false,
        },
      ],
      choose: 0,
    };
    this.addressChange = this.addressChange.bind(this);
    this.renderLayer = this.renderLayer.bind(this);
    this.addressChangeStaus = this.addressChangeStaus.bind(this);
    this.layerHide = this.layerHide.bind(this);
    this.distorySecret = this.distorySecret.bind(this);
    this.copy = this.copy.bind(this);
    this.create = this.create.bind(this);
    this.secVerifyCallback = this.secVerifyCallback.bind(this);
    this.setAddress = this.setAddress.bind(this);
    this.update = this.update.bind(this);
    this.start = this.start.bind(this);
    this.del = this.del.bind(this);
    this.hideSecVerify = this.hideSecVerify.bind(this);

    this.composition = false;
  }
  componentDidMount() {}
  choose = (e) => {
    this.setState({
      choose: e.target.value,
    });
  };
  componentWillReceiveProps(nextProps) {
    if (
      !this.props.child_account_list.length &&
      nextProps.child_account_list.length
    ) {
      let choose = -1;
      nextProps.child_account_list.map((item, i) => {
        if (item.accountType == 1 && choose == -1) {
          choose = i;
        }
      });
      if (choose != -1) {
        this.setState({
          choose,
        });
      }
    }
  }
  hideSecVerify() {
    this.setState({
      serVerify: false,
    });
  }
  // 添加
  create() {
    const tag = this.state.apiname.value;
    if (!tag) {
      this.setState({
        apiname: {
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请输入API备注名",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      return;
    }
    if (tag && tag.length > 10) {
      this.setState({
        apiname: {
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "API备注名长度限制1-10字符",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      return;
    }
    this.setState({
      serVerify: true,
      step: "create",
      verifyType: 11,
    });
  }
  // 启用、禁用
  start(status, i, id) {
    this.setState({
      serVerify: true,
      step: "status",
      verifyType: 12,
      status: status,
      i,
      id,
    });
  }
  // 更新
  update() {
    let n = -1;
    let hasvalue = 0;
    let list = [];
    let m = -1;
    let temp = [];
    let newiplist = "";
    let hasChange = "";
    this.state.address.forEach((item, i) => {
      list[i] = item;
      newiplist += item.value;
      //window.console.log(temp, item.value, temp.indexOf(item.value));
      if (item.value && !Vali.isIp(item.value)) {
        n = i;
      }
      if (item.value && temp.indexOf(item.value) > -1) {
        m = i;
      }
      if (item.value) {
        temp[i] = item.value;
        hasvalue++;
      }
    });
    if (n != -1) {
      list[n] = {
        value: list[n].value,
        msg: (
          <React.Fragment>
            {this.props.intl.formatMessage({
              id: "请输入正确的IP地址",
            })}
          </React.Fragment>
        ),
        status: list[n].status,
      };
      this.setState({
        address: list,
      });
      return;
    }
    if (m != -1) {
      list[m] = {
        value: list[m].value,
        msg: (
          <React.Fragment>
            {this.props.intl.formatMessage({
              id: "IP地址重复",
            })}
          </React.Fragment>
        ),
        status: list[m].status,
      };
      this.setState({
        address: list,
      });
      return;
    }

    if (newiplist != this.props.api_list[this.state.index]["ipWhiteList"]) {
      this.setState({
        serVerify: true,
        step: "update",
        verifyType: 12,
      });
    } else {
      this.setState({
        isopen: false,
      });
    }
    // if (hasvalue > 0) {
    //   this.setState({
    //     serVerify: true,
    //     step: "update",
    //     verifyType: 12
    //   });
    // } else {
    //   this.setState({
    //     isopen: false
    //   });
    // }
  }
  // del
  del(i, id) {
    this.setState({
      serVerify: true,
      step: "del",
      verifyType: 13,
      i,
      id,
    });
  }
  setAddress(record, i) {
    let list = record.ipWhiteList.split(",");
    let data = [];
    [1, 2, 3, 4, 5].forEach((item, i) => {
      data[i] = {
        value: list[i] || "",
        msg: "",
        status: false,
      };
    });
    this.setState({
      address: data,
      isopen: true,
      id: record.id,
      index: i,
    });
  }
  secVerifyCallback(obj) {
    //window.console.log(obj, this.state.step);
    let data = {
      account_id: this.props.userinfo.defaultAccountId,
      account_type: this.props.child_account_list[this.state.choose][
        "accountType"
      ],
      account_index: this.props.child_account_list[this.state.choose][
        "accountIndex"
      ],
      auth_type: obj.auth_type,
      order_id: this.props.order_id,
      verify_code: obj.verify_code,
      id: this.state.id || "",
      type: this.state.apitype,
    };
    // 创建
    if (this.state.step === "create") {
      data.tag = this.state.apiname.value;
      this.props.dispatch({
        type: "user/api_create",
        payload: data,
        success: (secretKey) => {
          this.setState(
            {
              serVerify: false,
              isopen2: true,
              id: "",
              secretKey,
              apiname: {
                value: "",
                msg: "",
              },
            },
            () => {
              //console.log(this.state);
            }
          );
          this.props.dispatch({
            type: "user/api_list",
            payload: {},
          });
        },
      });
    }
    // update
    if (this.state.step === "update") {
      let list = [];
      this.state.address.forEach((item) => {
        if (item.value && Vali.isIp(item.value)) {
          list.push(item.value);
        }
      });
      data.ip_white_list = list.join(",");
      this.props.dispatch({
        type: "user/api_update",
        payload: data,
        success: () => {
          this.setState({
            isopen: false,
            serVerify: false,
            id: "",
          });
          this.props.dispatch({
            type: "user/api_list",
            payload: {},
          });
        },
      });
    }
    // del
    if (this.state.step === "del") {
      this.props.dispatch({
        type: "user/api_del",
        payload: data,
        i: this.state.i,
        success: () => {
          this.setState({
            serVerify: false,
            id: "",
            // apiname: {
            //   value: "",
            //   msg: ""
            // }
          });
          this.props.dispatch({
            type: "user/api_list",
            payload: {},
          });
        },
      });
    }
    // status 启用/禁用
    if (this.state.step === "status") {
      data.status = this.state.status == 2 ? 1 : 2;
      this.props.dispatch({
        type: "user/api_status",
        payload: data,
        i: this.state.i,
        success: () => {
          this.setState({
            serVerify: false,
          });
          this.props.dispatch({
            type: "user/api_list",
            payload: {},
          });
        },
      });
    }
  }
  distorySecret() {
    this.setState({
      isopen2: false,
    });
  }
  copy() {
    this.setState({
      copied: true,
    });
    message.info(
      this.props.intl.formatMessage({
        id: "复制成功",
      })
    );
    setTimeout(() => {
      if (this.state.isopen2) {
        this.setState({
          isopen2: false,
        });
      }
    }, 1000);
  }
  layerHide() {
    this.setState({
      isopen: false,
    });
  }
  addressChangeStaus(n) {
    let list = helper.arrayClone(this.state.address);
    list[n] = {
      value: list[n].value,
      msg: list[n].msg,
      status: !list[n].status,
    };
    this.setState({
      address: list,
    });
  }
  addressChange(n, e) {
    let v = e.target.value;
    v = v.replace(/\s/g, "");
    let list = helper.arrayClone(this.state.address);
    list[n] = {
      value: v,
      msg: "",
      status: list[n].status,
    };
    this.setState({
      address: list,
    });
  }
  changeStatus(n, e) {
    const t = e.target;
    let value = helper.removeEmoji(t.value.replace(/\s/g, ""));
    this.setState({
      [n]: {
        msg: "",
        value: value,
      },
    });
  }
  apiTypeChange = (e) => {
    this.setState({
      apitype: e.target.value,
    });
  };

  renderLayer() {
    return [1, 2, 3, 4, 5].map((item, i) => {
      return (
        <li key={i} style={{ margin: "0 0 10px" }}>
          <TextField
            disabled={this.state.address[i].status}
            value={this.state.address[i].value || ""}
            placeholder="0.0.0.0"
            onChange={this.addressChange.bind(this, i)}
            error={Boolean(this.state.address[i].msg)}
            helperText={this.state.address[i].msg}
            fullWidth
          />
        </li>
      );
    });
  }
  render() {
    const { classes } = this.props;
    if (!this.props.userinfo.defaultAccountId) {
      return (
        <div className={classes.center}>
          <Grid container justify="center" alignItems="center">
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        </div>
      );
    }
    if (this.props.userinfo.defaultAccountId) {
      // 未绑定二次验证
      if (
        !this.props.userinfo.bindGA &&
        !(this.props.userinfo.registerType === 1
          ? this.props.userinfo.email
          : this.props.userinfo.mobile)
      ) {
        return <SecVerify userinfo={this.props.userinfo} isopen={true} />;
      }
    }

    return (
      <div className={classes.center}>
        <Grid container>
          <Grid item xs={12} style={{ margin: "0 0 33px" }}>
            <GoBackRC />
          </Grid>
          <Grid item xs={12}>
            <div className={classes.password_title}>
              <FormattedMessage id="创建API" />
            </div>
            <Grid container justify="space-between">
              <Grid item xs={6}>
                <div className={classes.password_tip}>
                  <p>
                    <FormattedMessage id="api.desc.1" />{" "}
                    <FormattedMessage id="api.desc.2" />{" "}
                    <FormattedMessage id="api.desc.3" />{" "}
                    <FormattedMessage id="api.desc.4" />
                  </p>
                </div>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={5}>
                <div className={classes.formItem}>
                  <div className={classes.formContent} style={{ flex: 2 }}>
                    <Select
                      fullWidth
                      value={this.state.choose}
                      onChange={this.choose}
                      style={{ height: 32 }}
                    >
                      {this.props.child_account_list.map((item, i) => {
                        return (item.accountType == 2 ||
                          item.accountType == 3 ||
                          item.accountType == 27) &&
                          item.accountIndex == 0 ? (
                          ""
                        ) : (
                          <MenuItem key={i} value={i}>
                            {item.accountType == 1 && item.accountIndex == 0
                              ? this.props.intl.formatMessage({
                                  id: "钱包账户",
                                })
                              : item.accountName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                  <div className={classes.formContent} style={{ flex: 2 }}>
                    <Select
                      fullWidth
                      value={this.state.apitype}
                      onChange={this.apiTypeChange}
                      style={{ height: 32 }}
                    >
                      <MenuItem value={1}>
                        {this.props.intl.formatMessage({
                          id: "可操作",
                        })}
                      </MenuItem>
                      <MenuItem value={0}>
                        {this.props.intl.formatMessage({
                          id: "只读",
                        })}
                      </MenuItem>
                    </Select>
                  </div>
                  <div className={classes.formContent} style={{ flex: 3 }}>
                    <TextFieldCN
                      value={this.state.apiname.value}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入API备注名",
                      })}
                      onChange={this.changeStatus.bind(this, "apiname")}
                      error={Boolean(this.state.apiname.msg)}
                      helperText={this.state.apiname.msg}
                      fullWidth
                    />
                  </div>

                  <div className={classes.formContent}>
                    {this.props.loading.effects["user/editpassword"] ||
                    !this.props.child_account_list.length ? (
                      <Button
                        color="primary"
                        variant="contained"
                        className={classes.btn2}
                        style={{ height: 32 }}
                        disabled
                        size="small"
                      >
                        {this.props.intl.formatMessage({
                          id: "创建API",
                        })}
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        variant="contained"
                        className={classes.btn2}
                        onClick={this.create}
                        style={{ height: 32 }}
                        size="small"
                      >
                        {this.props.intl.formatMessage({
                          id: "创建API",
                        })}
                      </Button>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell}>
                    {this.props.intl.formatMessage({
                      id: "时间",
                    })}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {this.props.intl.formatMessage({
                      id: "账户",
                    })}
                  </TableCell>
                  <TableCell className={classes.tableCell}>API key</TableCell>
                  <TableCell className={classes.tableCell}>
                    {this.props.intl.formatMessage({
                      id: "类型",
                    })}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {this.props.intl.formatMessage({
                      id: "备注名",
                    })}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {this.props.intl.formatMessage({
                      id: "白名单",
                    })}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    {this.props.intl.formatMessage({
                      id: "操作",
                    })}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.api_list && this.props.api_list.length ? (
                  this.props.api_list.map((item, i) => {
                    return (
                      <TableRow key={item.id} className={classes.api_item}>
                        <TableCell className={classes.tableCell}>
                          {moment
                            .utc(Number(item.created))
                            .local()
                            .format("YYYY/MM/DD HH:mm:ss")}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {item.accountName}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <p className={classes.apikey}>{item.apiKey}</p>
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {this.props.intl.formatMessage({
                            id: item.type == 1 ? "可操作" : "只读",
                          })}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {item.tag}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <em onClick={this.setAddress.bind(this, item, i)}>
                            <FormattedMessage id="设置" />
                          </em>
                        </TableCell>
                        <TableCell className={classes.tableCell} align="right">
                          <Switch
                            checked={item.status == 2 ? false : true}
                            color="primary"
                            onChange={this.start.bind(
                              this,
                              item.status,
                              i,
                              item.id
                            )}
                          ></Switch>
                          <em
                            onClick={this.del.bind(this, i, item.id)}
                            style={{ margin: "0 0 0 20px" }}
                          >
                            <FormattedMessage id="删除" />
                          </em>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow></TableRow>
                )}
              </TableBody>
            </Table>
          </Grid>
        </Grid>

        {/* 白名单设置 */}
        <Dialog
          open={this.state.isopen}
          showclosebtn={"true"}
          onCancel={this.layerHide}
        >
          <DialogTitle>
            {this.props.intl.formatMessage({
              id: "白名单设置",
            })}
          </DialogTitle>
          <DialogContent className={classes.add_address}>
            <div className={classes.api_tip}>
              <FormattedMessage id="提示" />：
              <FormattedMessage id="白名单最多可以添加5个IP地址" />
            </div>
            <ul>{this.renderLayer()}</ul>
          </DialogContent>
          <DialogActions>
            <Button
              className={classes.btn3}
              onClick={() => {
                this.setState({
                  isopen: false,
                });
              }}
            >
              {this.props.intl.formatMessage({
                id: "取消",
              })}
            </Button>
            <Button
              color="primary"
              className={classes.btn3}
              onClick={this.update}
            >
              {this.props.intl.formatMessage({
                id: "保存",
              })}
            </Button>
          </DialogActions>
        </Dialog>
        {/* secret */}
        {this.state.secretKey ? (
          <Dialog open={this.state.isopen2}>
            <DialogTitle>Secret</DialogTitle>
            <DialogContent>
              <em>{this.state.secretKey}</em>
            </DialogContent>
            <div
              style={{
                display: "flex",
                margin: "8px 4px",
                flex: "0 0 auto",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <CopyToClipboard
                text={this.state.secretKey}
                onCopy={() => this.copy()}
                options={{ debug: true }}
              >
                <Button color="primary" className={classes.btn3}>
                  {this.props.intl.formatMessage({
                    id: "复制",
                  })}
                </Button>
              </CopyToClipboard>
            </div>
          </Dialog>
        ) : (
          ""
        )}
        <SecVerify
          userinfo={this.props.userinfo}
          isopen={this.state.serVerify}
          callback={this.secVerifyCallback}
          dispatch={this.props.dispatch}
          verifyType={this.state.verifyType}
          onCancel={this.hideSecVerify}
          showCloseBtn={true}
          ref={this.secverifyRef}
        />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(API));
