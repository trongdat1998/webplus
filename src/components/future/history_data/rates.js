import React from "react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { Grid } from "@material-ui/core";
import MenuRC from "./menu";
import SelectRC from "./select";
import moment from "moment";
import math from "../../../utils/mathjs";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = {
      sid: "",
      sname: "",
      eid: "",
      data: [],
      limit: 10,
      side: "next",
      loading: false,
      no: 0,
      hasmore: true,
    };
  }
  onChange = (sid, sname, eid) => {
    // 下一页
    let payload = {
      symbol_id: sid || this.state.sid,
      symbol_name: sname || this.state.sname,
      exchange_id: eid || this.state.eid,
      page: sid ? 0 : this.state.no,
      from_id: this.state.data.length
        ? this.state.data[this.state.data.length - 1]["id"]
        : "",
      limit: this.state.limit,
    };
    // 上一页
    if (this.state.side == "pre") {
      delete payload.from_id;
      payload.end_id = this.state.data.length ? this.state.data[0]["id"] : "";
    }
    // 切换币对
    if (sid) {
      delete payload.from_id;
      delete payload.end_id;
    }
    this.setState(
      {
        sid: payload.symbol_id,
        sname: payload.symbol_name,
        eid: payload.exchange_id,
        no: sid ? 0 : this.state.no,
        hasmore: sid ? true : this.state.hasmore,
        loading: true,
      },
      () => {
        try {
          this.props.dispatch({
            type: "layout/commonRequest",
            payload,
            urlKey: "history_funding_rates",
            cb: (res) => {
              if (res.code == "OK" && res.data) {
                this.setState({
                  data: res.data,
                  no:
                    this.state.side == "next"
                      ? Number(this.state.no) + 1
                      : Number(this.state.no) - 1,
                  hasmore: res.data.length < this.state.limit ? false : true,
                  loading: false,
                });
              }
            },
          });
        } catch (e) {
          this.setState({
            loading: true,
          });
        }
      }
    );
  };
  page = (side) => () => {
    if (this.state.loading) {
      return;
    }
    this.setState(
      {
        side: side,
        loading: true,
      },
      () => {
        this.onChange();
      }
    );
  };
  render() {
    const { classes, ...otherProps } = this.props;
    return (
      <div className={classes.content}>
        <div className={classes.nav}>
          <MenuRC />
        </div>
        <div className={classes.con}>
          <h2>{this.props.intl.formatMessage({ id: "资金费率" })}</h2>
          <div className={classes.item}>
            <p>
              {this.props.intl.formatMessage({
                id: "历史资金费率表",
              })}
            </p>
            <FormattedHTMLMessage
              tagName="p"
              id="future.history.data.rates.desc"
            />
          </div>
          <div className={classes.item}>
            <p>{this.props.intl.formatMessage({ id: "选择合约" })}</p>
            <Grid container justify="space-between">
              <Grid item>
                <SelectRC onChange={this.onChange} {...otherProps} />
              </Grid>
              <Grid item>
                {this.state.no <= 1 ? (
                  ""
                ) : (
                  <span className={classes.pageBtn} onClick={this.page("pre")}>
                    {this.props.intl.formatMessage({ id: "上一页" })}
                  </span>
                )}
                {this.state.hasmore ? (
                  <span className={classes.pageBtn} onClick={this.page("next")}>
                    {this.props.intl.formatMessage({ id: "下一页" })}
                  </span>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </div>
          <div className={classes.item}>
            <Grid container className={classes.table}>
              <Grid item xs={3}>
                {this.props.intl.formatMessage({ id: "时间" })}
              </Grid>
              <Grid item xs={3}>
                {this.props.intl.formatMessage({ id: "合约" })}
              </Grid>
              <Grid item xs={3}>
                {this.props.intl.formatMessage({ id: "资金费率" })}
              </Grid>
              <Grid item xs={3}>
                {this.props.intl.formatMessage({ id: "日化资金费率" })}
              </Grid>
              {(this.state.data || []).map((item) => {
                return (
                  <React.Fragment key={item.id}>
                    <Grid key={item.id + "a"} item xs={3}>
                      {moment
                        .utc(Number(item.settleTime))
                        .local()
                        .format("YYYY-MM-DD HH:mm:ss")}
                    </Grid>
                    <Grid key={item.id + "b"} item xs={3}>
                      {this.state.sname}
                    </Grid>
                    <Grid key={item.id + "c"} item xs={3}>
                      {item.settleRate
                        ? math
                            .chain(math.bignumber(Number(item.settleRate)))
                            .multiply(100)
                            .format({
                              notation: "fixed",
                              precision: 4,
                            })
                            .done()
                        : "0"}
                      %
                    </Grid>
                    <Grid key={item.id + "d"} item xs={3}>
                      {item.settleRate
                        ? math
                            .chain(math.bignumber(Number(item.settleRate)))
                            .multiply(300)
                            .format({
                              notation: "fixed",
                              precision: 4,
                            })
                            .done()
                        : "0"}
                      %
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
