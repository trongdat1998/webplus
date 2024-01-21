import React from "react";
import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import route_map from "../../config/route_map";
import moment from "moment";
import { Iconfont } from "../../lib";
import TextFieldCN from "../public/textfiled";
import vali from "../../utils/validator";

class BrokerIndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      max_rate: 100,
      agentUID: "",
      name: "",
      direction: "",
      open: false,
      // userinfo: {},
      user_id: "",
      agent_name: "",
      leader: "",
      leader_mobile: "",
      mark: "",

      coin_rate: 0,
      contract_rate: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.reset = this.reset.bind(this);
    this.fix_digits = this.fix_digits.bind(this);
  }

  componentDidMount() {
    this.props.dispatch({
      type: "broker/get_agent_info",
      payload: {},
    });
    this.getList();
  }
  componentWillReceiveProps(nextProps) {}
  handleChange(e) {
    const t = e.target;
    const n = t.name;
    let v = t.type == "checkbox" ? t.checked : t.value;
    if (n == "coin_rate" || n == "contract_rate") {
      v = v
        .replace(/[^0-9\.]/, "")
        .replace(/^0{1,}/, "0")
        .replace(/^(0)([1-9])/, ($1, $2) => {
          return $2;
        })
        .replace(/^\./, "0.");
      let d = v
        ? Number(v) >= this.state.max_rate
          ? `${this.state.max_rate}`
          : v
        : "";
      if (v && !vali.isFloat(v)) {
        return;
      }
      const abs = this.props.agent_info.isAbs;
      const childrenDefaultRate = this.props.agent_info.childrenDefaultRate;
      const contractChildrenDefaultRate = this.props.agent_info
        .contractChildrenDefaultRate;
      if (abs) {
        if (n == "coin_rate" && Number(v) > Number(childrenDefaultRate)) {
          d = childrenDefaultRate;
        }
        if (
          n == "contract_rate" &&
          Number(v) > Number(contractChildrenDefaultRate)
        ) {
          d = contractChildrenDefaultRate;
        }
      }
      v = this.fix_digits(`${d}`, abs ? 5 : 2);
    }
    this.setState({
      [n]: v,
    });
  }
  fix_digits(v, digits) {
    if (!digits) {
      return v ? Math.floor(v) : v;
    }
    if (!v && v !== 0) return v;
    if (digits <= 0) {
      return Math.floor(v);
    }
    let string_v = `${v}`;
    let d = string_v.split(".");
    if (!d[1] || d[1].length <= digits) {
      return string_v;
    }
    d[1] = d[1].split("");
    d[1].length = digits;
    d[1] = d[1].join("");
    return d[0] + "." + d[1];
  }
  reset() {
    this.setState({
      agentUID: "",
      name: "",
      direction: "",
    });
    this.getList();
  }
  getList(params) {
    this.props.dispatch({
      type: "broker/get_brokerlist",
      payload: params || {},
    });
  }
  search() {
    this.setState({
      direction: "",
    });
    this.getList({
      user_id: this.state.agentUID,
      user_name: this.state.name,
    });
  }
  page(direction) {
    this.setState({
      direction: direction,
    });
    this.getList({
      user_contact: this.state.agentUID,
      user_name: this.state.name,
      direction: direction,
    });
  }
  save() {
    this.props.dispatch({
      type: "broker/update_broker",
      payload: {
        user_id: this.state.user_id,
        agent_name: this.state.agent_name,
        leader: this.state.leader,
        leader_mobile: this.state.leader_mobile,
        mark: this.state.mark,
        coin_rate: this.state.coin_rate,
        contract_rate: this.state.contract_rate,
      },
      callback: () => {
        this.changeModal(false);
        window.location.reload();
      },
    });
  }
  changeModal(open, data) {
    let obj = {
      open: open,
    };
    if (data && data.agentUserId) {
      obj = {
        ...obj,
        user_id: data.agentUserId || "",
        agent_name: data.agentName || "",
        leader: data.leader || "",
        leader_mobile: data.leaderMobile || "",
        mark: data.mark || "",
        coin_rate: data.coinRate || 0,
        contract_rate: data.contractRate || 0,
        // userinfo: data ? data : {}
      };
    }
    this.setState(obj);
  }
  renderItem() {
    const { classes, intl, broker_list } = this.props;
    if (
      this.props.loading.effects &&
      this.props.loading.effects["broker/get_brokerlist"]
    ) {
      return (
        <TableCell
          className={classes.noborder}
          colSpan="10"
          style={{ height: 40 * 10 + "px" }}
        >
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{ height: 40 * 10 + "px" }}
          >
            <CircularProgress />
          </Grid>
        </TableCell>
      );
    }
    if (!broker_list.length) {
      return (
        <TableCell
          className={classes.noborder}
          colSpan="10"
          style={{ height: 40 * 10 + "px" }}
        >
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{ height: 40 * 10 + "px" }}
          >
            <div className={classes.noData}>
              <img alt="" src={require("../../assets/noData.png")} />
              <p>{intl.formatMessage({ id: "这里还是空的" })}</p>
            </div>
          </Grid>
        </TableCell>
      );
    }
    return (
      <React.Fragment>
        {broker_list.map((item, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{item.agentName}</TableCell>
              <TableCell>{item.agentUserId}</TableCell>
              <TableCell>{item.level}</TableCell>
              <TableCell>{item.leader}</TableCell>
              <TableCell>{item.leaderMobile}</TableCell>
              <TableCell>{item.parentAgentName}</TableCell>
              <TableCell>{item.mark}</TableCell>
              <TableCell>{item.subMemberCount}</TableCell>
              <TableCell>
                {Number(item.registerTime)
                  ? moment(Number(item.registerTime)).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : ""}
              </TableCell>
              <TableCell
                className={classes.action}
                onClick={this.changeModal.bind(this, true, item)}
              >
                {intl.formatMessage({ id: "修改" })}
              </TableCell>
            </TableRow>
          );
        })}
      </React.Fragment>
    );
  }
  render() {
    const {
      classes,
      intl,
      agent_info,
      broker_list,
      limit,
      member_count,
    } = this.props;
    return (
      <div className={classes.broker}>
        <h2>
          <a href={route_map.broker}>
            {intl.formatMessage({
              id: "用户管理",
            })}
          </a>
          <a className="active">
            {intl.formatMessage({
              id: "经纪人管理",
            })}
          </a>
          <a href={route_map.broker_ommission}>
            {intl.formatMessage({
              id: "分佣管理",
            })}
          </a>
        </h2>
        <Grid item xs={12} className={classes.broker_list}>
          <Grid container className={classes.search}>
            <Grid item xs={3}>
              <TextFieldCN
                fullWidth
                name="agentUID"
                value={this.state.agentUID}
                onChange={this.handleChange}
                placeholder={intl.formatMessage({
                  id: "经纪人UID",
                })}
                InputProps={{
                  classes: { root: classes.search_input },
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextFieldCN
                fullWidth
                name="name"
                autoComplete="off"
                value={this.state.name}
                onChange={this.handleChange}
                placeholder={intl.formatMessage({
                  id: "经纪人姓名",
                })}
                InputProps={{
                  classes: { root: classes.search_input },
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={this.search.bind(this)}
              >
                {intl.formatMessage({
                  id: "搜索",
                })}
              </Button>
            </Grid>
            {/* <Grid item xs={2} >
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={this.reset}
              >
                {intl.formatMessage({
                  id: "重置"
                })}
              </Button>
            </Grid> */}
          </Grid>
          <p>
            {intl.formatMessage({
              id: "直属下级代理总数：",
            })}
            {member_count}
          </p>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>
                  {intl.formatMessage({
                    id: "经纪人名称",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "经纪人UID",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "代理级别",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "负责人",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "手机号",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "上级经纪人",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "说明",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "发展会员数",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "注册时间",
                  })}
                </TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: "操作",
                  })}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.renderItem()}</TableBody>
          </Table>
          {!this.state.direction && !broker_list.length ? (
            ""
          ) : (
            <div className={classes.pagination}>
              {!this.state.direction ||
              (this.state.direction == "prev" && broker_list.length < limit) ? (
                <Iconfont className="disabled" type="arrowLeft" size="24" />
              ) : (
                <Iconfont
                  onClick={this.page.bind(this, "prev")}
                  type="arrowLeft"
                  size="24"
                />
              )}
              {(!this.state.direction || this.state.direction == "next") &&
              broker_list.length < limit ? (
                <Iconfont className="disabled" type="arrowRight" size="24" />
              ) : (
                <Iconfont
                  onClick={this.page.bind(this, "next")}
                  type="arrowRight"
                  size="24"
                />
              )}
            </div>
          )}
        </Grid>
        <Dialog
          open={Boolean(this.state.open)}
          aria-labelledby="form-dialog-title"
          classes={{ scrollPaper: classes.dialog }}
        >
          <DialogContent className={classes.dialog_content}>
            <h2>{intl.formatMessage({ id: "修改经纪人" })}</h2>
            <TextFieldCN
              autoFocus
              margin="dense"
              name="agent_name"
              value={this.state.agent_name}
              label={intl.formatMessage({ id: "经纪人名称" })}
              type="text"
              onChange={this.handleChange}
              fullWidth
            />
            <TextFieldCN
              autoFocus
              margin="dense"
              name="leader"
              value={this.state.leader}
              label={intl.formatMessage({ id: "负责人（选填）" })}
              type="text"
              onChange={this.handleChange}
              fullWidth
            />
            <TextFieldCN
              autoFocus
              margin="dense"
              name="leader_mobile"
              value={this.state.leader_mobile}
              label={intl.formatMessage({ id: "手机号（选填）" })}
              type="text"
              onChange={this.handleChange}
              fullWidth
            />
            <TextFieldCN
              autoFocus
              margin="dense"
              name="mark"
              value={this.state.mark}
              label={intl.formatMessage({ id: "说明（选填）" })}
              type="text"
              onChange={this.handleChange}
              fullWidth
            />
            <div className={classes.rate}>
              <span>{intl.formatMessage({ id: "币币返佣" })}</span>
              {/* <FormattedHTMLMessage
                  id="当前获得佣金比例{rate}%"
                  values={{
                    rate: agent_info.coinRate
                  }}
                  tagName="span"
              />  */}
            </div>
            <Grid container className={classes.rate}>
              <Grid item xs={6}>
                <span>
                  {intl.formatMessage({
                    id: "分配给下级代理商比例",
                  })}
                </span>
                <TextField
                  name="coin_rate"
                  value={this.state.coin_rate}
                  onChange={this.handleChange}
                  className={classes.rate_input}
                  InputProps={{
                    endAdornment: <span>%</span>,
                  }}
                />
              </Grid>
              {agent_info.isAbs ? (
                <Grid item xs={6}>
                  <p>
                    <label>{intl.formatMessage({ id: "最大可配置" })}</label>
                    {agent_info.childrenDefaultRate}%
                  </p>
                  <p>
                    <label>{intl.formatMessage({ id: "您获得" })}</label>
                    {this.fix_digits(
                      (agent_info.childrenDefaultRate * 10000000 -
                        this.state.coin_rate * 10000000) /
                        10000000,
                      agent_info.isAbs ? 5 : 2
                    )}
                    %
                  </p>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
            <div className={classes.rate}>
              <span>{intl.formatMessage({ id: "合约返佣" })}</span>
              {/* <FormattedHTMLMessage
                  id="当前获得佣金比例{rate}%"
                  values={{
                    rate: agent_info.contractRate
                  }}
                  tagName="span"
              />  */}
            </div>
            <Grid container className={classes.rate}>
              <Grid item xs={6}>
                <span>
                  {intl.formatMessage({
                    id: "分配给下级代理商比例",
                  })}
                </span>
                <TextField
                  name="contract_rate"
                  value={this.state.contract_rate}
                  onChange={this.handleChange}
                  className={classes.rate_input}
                  InputProps={{
                    endAdornment: <span>%</span>,
                  }}
                />
              </Grid>
              {agent_info.isAbs ? (
                <Grid item xs={6}>
                  <p>
                    <label>{intl.formatMessage({ id: "最大可配置" })}</label>
                    {agent_info.contractChildrenDefaultRate}%
                  </p>
                  <p>
                    <label>{intl.formatMessage({ id: "您获得" })}</label>
                    {this.fix_digits(
                      (agent_info.contractChildrenDefaultRate * 10000000 -
                        this.state.contract_rate * 10000000) /
                        10000000,
                      agent_info.isAbs ? 5 : 2
                    )}
                    %
                  </p>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
          </DialogContent>
          <DialogActions className={classes.dialog_action}>
            <Button
              disabled={!this.state.agent_name}
              onClick={this.save.bind(this)}
              color="primary"
              variant="contained"
            >
              {intl.formatMessage({ id: "确认" })}
            </Button>
            <Button
              onClick={this.changeModal.bind(this, false)}
              color="primary"
              variant="contained"
            >
              {intl.formatMessage({ id: "取消" })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(BrokerIndexRC));
