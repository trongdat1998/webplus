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
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import { Iconfont } from "../../lib";
import TextFieldCN from "../public/textfiled";

class BrokerIndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      agentUID: "",
      direction: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount() {
    this.getList({target_user_id: 0});
  }
  componentWillReceiveProps(nextProps) {
    
  }
  handleChange(e) {
    const t = e.target;
    const n = t.name;
    let v = t.value;
    this.setState({
      [n]: v
    });
  }
  getList(params){
    this.props.dispatch({
      type: "broker/get_commission_list",
      payload: params || {}
    });
  }
  search() {
    this.setState({
      direction: ""
    })
    this.getList(
      {
        target_user_id: this.state.agentUID,
      }
    );
  }
  page(direction) {
    this.setState({
      direction: direction
    });
    this.getList(
      {
        target_user_id: this.state.agentUID,
        direction: direction
      }
    )
  }
  renderItem(){
    const { classes } = this.props;
    if (
      this.props.loading.effects &&
      this.props.loading.effects["broker/get_commission_list"]
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
    if (!this.props.commission_list.length) {
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
              <p>{this.props.intl.formatMessage({ id: "这里还是空的" })}</p>
            </div>
          </Grid>
        </TableCell>
      );
    }
    return (
      <React.Fragment>
        {this.props.commission_list.map((item, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{item.time}</TableCell>
              <TableCell>{item.agentName}</TableCell>
              <TableCell>{item.userId}</TableCell>
              <TableCell>{item.superiorName}</TableCell>
              <TableCell>{item.tokenId}</TableCell>
              <TableCell>{item.agentFee}{item.tokenId}</TableCell>
            </TableRow>
          );
        })}
      </React.Fragment>
    );
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.broker}>
        <h2>
          <a href={route_map.broker}>
            {this.props.intl.formatMessage({
              id: "用户管理"
            })}
          </a>
          <a href={route_map.broker_list}>
            {this.props.intl.formatMessage({
              id: "经纪人管理"
            })}
          </a>
          <a className="active">
            {this.props.intl.formatMessage({
              id: "分佣管理"
            })}
          </a>
        </h2>
        <Grid item xs={12} className={classes.broker_list}>
          <Grid container className={classes.search}>
            <Grid item xs={3} >
              <TextFieldCN
                fullWidth
                name="agentUID"
                value={this.state.agentUID}
                onChange={this.handleChange}
                placeholder={this.props.intl.formatMessage({
                  id: "经纪人UID"
                })}
                InputProps={{
                  classes: { root: classes.search_input }
                }}
              />
            </Grid>
            <Grid item xs={2} >
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={this.search.bind(this)}
              >
                {this.props.intl.formatMessage({
                  id: "搜索"
                })}
              </Button>
            </Grid>
          </Grid>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>
                  {this.props.intl.formatMessage({
                    id: "日期"
                  })}
                </TableCell>
                <TableCell>
                  {this.props.intl.formatMessage({
                    id: "经纪人名称"
                  })}
                </TableCell>
                <TableCell>
                  {this.props.intl.formatMessage({
                    id: "经纪人UID"
                  })}
                </TableCell>
                <TableCell>
                  {this.props.intl.formatMessage({
                    id: "上级经纪人"
                  })}
                </TableCell>
                <TableCell>
                  {this.props.intl.formatMessage({
                    id: "币种"
                  })}
                </TableCell>
                <TableCell>
                  {this.props.intl.formatMessage({
                    id: "佣金数量"
                  })}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.renderItem()}
            </TableBody>
          </Table>
          {!this.state.direction && !this.props.commission_list.length ? "" :
            <div className={classes.pagination}>
              {!this.state.direction || (this.state.direction == "prev" && this.props.commission_list.length < this.props.limit) ? 
                <Iconfont 
                  className="disabled" 
                  type="arrowLeft" 
                  size="24" 
                /> :
                <Iconfont 
                  onClick={this.page.bind(this, "prev")} 
                  type="arrowLeft" 
                  size="24" 
                />
              }
              {(!this.state.direction || this.state.direction == "next") && this.props.commission_list.length < this.props.limit ?
                <Iconfont 
                  className="disabled"  
                  type="arrowRight" 
                  size="24" 
                /> :
                <Iconfont 
                  onClick={this.page.bind(this, "next")} 
                  type="arrowRight" 
                  size="24" 
                />
              }
            </div>
          }
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(BrokerIndexRC));
