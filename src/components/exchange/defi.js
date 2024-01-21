// DeFi 专区
import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Grid, Button, List, Tabs, Tab } from "@material-ui/core";
import styles from "./defi_style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import route_map from "../../config/route_map";
import CONST from "../../config/const";

class TokenInfoRC extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
      tab: 0,
      data: [],
    };
  }
  componentDidMount() {
    window.document.title = this.props.intl.formatMessage({ id: "DeFi专区" });
    this.props.dispatch({
      type: "layout/get_custom_kv",
      payload: {
        custom_keys: "cust.platformData",
      },
      cb: (res) => {
        if (res.code == "OK" && res.data) {
          let list = res.data["cust.platformData"]
            ? res.data["cust.platformData"]["list"]
            : [];
          list.map((item) => {
            if (item.key == "defiZone") {
              let v = item.value;
              v = JSON.parse(v);

              this.setState({
                data: v,
              });
            }
          });
        }
      },
    });
  }
  componentDidUpdate() {
    if (this.props.qws && !this.state.subed) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.props.qws.sub(
            {
              id: "broker",
              topic: "slowBroker",
              event: "sub",
              params: {
                org: this.props.config.orgId,
                binary: !Boolean(window.localStorage.ws_binary),
              },
            },
            this.httpAction,
            this.callback
          );
        }
      );
    }
  }
  httpAction = (payload) => {
    return this.props.dispatch({
      type: "ws/broker_quote_http",
      payload,
    });
  };
  /**
   * data={
   *   topic:'broker',
   *   params:{},
   *   f: true/false,
   *   id: 'broker,
   *   shared: true/false,
   *   data:[{t:123123123123,s:'BTCUSDT',c:1,o:1,e:301,h:1,l:1,m:0,v:0,qv:0}] m:涨跌幅
   * }
   */
  callback = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("symbol_quote_source", data.data);
  };
  goto = (link) => () => {
    if (link) {
      window.location.href = link;
    }
  };
  handleStepChange = (key) => (step) => {
    this.setState({
      [key]: step,
    });
  };
  handleChange = (e, v) => {
    this.setState({
      tab: v,
    });
  };
  renderItem = (_tokenInfo, data) => {
    const { classes, config } = this.props;
    const tokens = config.tokens || {};
    const tokenInfo = _tokenInfo || {};
    const rates =
      data.c && tokenInfo.quoteTokenId
        ? helper.currencyValue(
            this.props.rates,
            data.c,
            tokenInfo.quoteTokenId,
            window.localStorage.unit,
            true
          )
        : ["", "", ""];
    return (
      <Grid
        container
        className={classes.tokenItem}
        alignItems="center"
        onClick={this.goto(
          route_map.exchange +
            "/" +
            tokenInfo.baseTokenId +
            "/" +
            tokenInfo.quoteTokenId
        )}
        justify="space-between"
      >
        <Grid item style={{ width: 72, textAlign: "center" }}>
          {tokens &&
          tokenInfo.baseTokenId &&
          tokens[tokenInfo.baseTokenId].iconUrl ? (
            <img src={tokens[tokenInfo.baseTokenId].iconUrl} width={32} />
          ) : (
            ""
          )}
        </Grid>
        <Grid item style={{ width: 185 }}>
          <strong>{tokenInfo.baseTokenName}</strong>
          <p>
            {tokens && tokenInfo.baseTokenId && tokens[tokenInfo.baseTokenId]
              ? tokens[tokenInfo.baseTokenId]["tokenFullName"]
              : ""}
          </p>
        </Grid>
        <Grid item style={{ width: 200 }}>
          <label>{data.c}</label>
          <p>
            {rates[1]} {rates[2]}
          </p>
        </Grid>
        <Grid item style={{ flex: 1 }}>
          <i className={Number(data.m || 0) >= 0 ? "green" : "red"}>
            {Number(data.m)
              ? helper.format(Math.floor(Number(data.m) * 10000) / 100, 2) + "%"
              : "0.00%"}
          </i>
        </Grid>
        <Grid item>
          <Button
            onClick={this.goto(
              route_map.exchange +
                "/" +
                tokenInfo.baseTokenId +
                "/" +
                tokenInfo.quoteTokenId
            )}
            color="primary"
            variant="contained"
            style={{ width: 150 }}
          >
            {this.props.intl.formatMessage({ id: "去交易" })}
          </Button>
        </Grid>
      </Grid>
    );
  };
  render() {
    const { classes } = this.props;
    const symbol_quote = this.props.symbol_quote;
    const data = this.state.data[this.state.tab]
      ? this.state.data[this.state.tab]
      : {};
    const symbols_obj = this.props.config.symbols_obj || {};
    const link = "";

    return (
      <div className={classes.tokenInfo}>
        <div className={classes.topic}>
          <div>
            <h2>{this.props.intl.formatMessage({ id: "DeFi专区" })}</h2>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <span>{this.props.intl.formatMessage({ id: "了解DeFi" })}</span>
              <img
                src={require("../../assets/icon_arrow_18_24.png")}
                height={12}
              />
            </a>
            <p>{this.props.intl.formatMessage({ id: "defi.desc" })}</p>
          </div>
        </div>
        <div className={classes.tabsbox}>
          <Tabs
            value={this.state.tab}
            onChange={this.handleChange}
            variant="scrollable"
            indicatorColor="primary"
            textColor="primary"
            className={classes.tbs}
          >
            {this.state.data.map((item) => {
              return (
                <Tab
                  key={Object.keys(item)[0]}
                  className={classes.tab}
                  label={Object.keys(item)[0]}
                  classes={{ selected: classes.selected }}
                />
              );
            })}
          </Tabs>
        </div>
        <div className={classes.conbox}>
          {Object.keys(data) && data[Object.keys(data)[0]]
            ? data[Object.keys(data)[0]].map((_item) => {
                const item = (_item || "").toUpperCase();
                const tokeninfo =
                  symbols_obj && symbols_obj.coin && symbols_obj.coin[item]
                    ? symbols_obj.coin[item]
                    : {};
                const data = symbol_quote[item] || {};
                return this.renderItem(tokeninfo, data);
              })
            : ""}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TokenInfoRC));
