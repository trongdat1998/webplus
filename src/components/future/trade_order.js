// 合约交易面板订单
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./index_order_style";
import { Iconfont } from "../../lib";
import {
  FormControlLabel,
  Checkbox,
  // Select,
  MenuItem,
  Tabs,
  Tab,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  Button
} from "@material-ui/core";
import CurrentList from "./current_entrust_list";
import PositionList from "./position_order_list";
import HistoryEntrustList from "./history_entrust_list";
import HistoryOrderList from "./history_order_list";
import Introduce from "./introduce";
import WSDATA from "../../models/data_source";
// import helper from "../../utils/helper";
import classnames from "classnames";

class Order extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
      orderTab: "1",
      // modalOpen: false,
      "1": {
        checked: false
      },
      "2": {
        checked: false,
        order_type: "LIMIT"
      },
      "3": {
        checked: false,
        order_type: "LIMIT"
      },
      "4": {
        checked: false,
        order_type: "LIMIT"
      },
      anchorEl: null,
      tabs: ["当前持仓", "未完成委托", "历史委托", "历史成交", "合约介绍"],
      order_type: [
        {
          value: "LIMIT",
          label: "普通委托"
        },
        {
          value: "STOP",
          label: "计划委托"
        },
        {
          value: "STOP_LOSS",
          label: "止盈止损"
        }
      ],
      tab_modal: null
    };
  }
  componentDidMount() {
    // 启动订阅
    //this.sub();
  }
  componentDidUpdate() {
    if (this.props.ws && !this.state.subed) {
      this.setState(
        {
          subed: true
        },
        () => {
          // 当前委托
          this.props.ws.sub(
            {
              id: "futures_order",
              topic: "futures_order",
              event: "sub",
              params: {
                org: this.props.config.orgId,
                binary: !Boolean(window.localStorage.ws_binary)
              }
            },
            this.httpAction,
            this.callback
          );
          // 当前持仓
          this.props.ws.sub(
            {
              id: "futures_position",
              topic: "futures_position",
              event: "sub",
              params: {
                org: this.props.config.orgId,
                binary: !Boolean(window.localStorage.ws_binary)
              }
            },
            this.httpAction2,
            this.callback2
          );
        }
      );
    }
  }
  // 当前委托http
  httpAction = async payload => {
    // 当前委托
    await this.props.dispatch({
      type: "future/updateCurrentEntrust",
      payload: this.state["2"]
    });
    // 历史委托
    await this.props.dispatch({
      type: "future/updateHistoryEntrust",
      payload: this.state["3"]
    });
  };
  // 当前持仓
  httpAction2 = async payload => {
    await this.props.dispatch({
      type: "future/updatePositionOrder",
      payload: this.state["1"]
    });
  };
  // 历史成交
  httpAction3 = async payload => {
    // 历史成交
    await this.props.dispatch({
      type: "future/updateHistoryOrder",
      payload: this.state["4"]
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
  callback = data => {
    data && data.data && WSDATA.setData("future_order_source", data.data);
  };
  callback2 = data => {
    data && data.data && WSDATA.setData("future_position_source", data.data);
  };

  // async sub() {
  //   const ws = this.props.ws;
  //   const userinfo = this.props.userinfo;
  //   if (!ws.oid || !userinfo.defaultAccountId) {
  //     await helper.delay(200);
  //     return this.sub();
  //   }
  //   if (window.location.pathname.indexOf(route_map.future) === -1) {
  //     return;
  //   }
  //   // 启动订单订阅
  //   this.props.dispatch({
  //     type: "layout/ws_sub",
  //     payload: {},
  //     dispatch: this.props.dispatch,
  //     success: () => {}
  //   });
  // }
  changeTab = (event, value) => {
    this.setState({
      orderTab: value
    });
  };
  change = value => {
    this.setState({
      orderTab: value + "",
      tab_modal: null
    });
  };
  handleChange = e => {
    let orderTab = this.state.orderTab;
    let obj = JSON.parse(JSON.stringify(this.state[orderTab]));
    obj["checked"] = e.target.checked;
    this.setState({
      "1": {
        checked: e.target.checked
      },
      "2": {
        checked: e.target.checked,
        order_type: this.state["2"]["order_type"]
      },
      "3": {
        checked: e.target.checked,
        order_type: this.state["3"]["order_type"]
      },
      "4": {
        checked: e.target.checked,
        order_type: this.state["4"]["order_type"]
      }
    });
  };
  changeEntrustType = v => {
    this.closeModal("anchorEl");
    let orderTab = this.state.orderTab;
    let checked = this.state[orderTab].checked;
    this.setState({
      [orderTab]: {
        order_type: v,
        checked: checked
      }
    });
  };
  openModal = (key, e) => {
    this.setState({
      [key]: e.currentTarget
    });
  };
  closeModal = (key, e) => {
    this.setState({
      [key]: null
    });
  };
  render() {
    const { classes } = this.props;
    let { current_list, position_list } = this.props;
    const { tabs, orderTab } = this.state;
    let params1 = this.state["1"],
      params2 = this.state["2"],
      params3 = this.state["3"],
      params4 = this.state["4"];
    let currentSymbolId = this.props.match.params.symbolId;
    if (!params1.checked) {
      position_list = position_list.filter(
        item => item.symbolId == currentSymbolId
      ); // 隐藏其他齐全
    }
    if (!params2.checked) {
      current_list = current_list.filter(
        item => item.symbolId == currentSymbolId
      ); // 隐藏其他齐全
    }
    const symbol_quote = WSDATA.getData("symbol_quote_source");
    const symbolId = (this.props.match.params.symbolId || "").toUpperCase();
    const tokenQuote = symbol_quote[symbolId] || {};
    // 币对信息
    let symbolInfo = this.props.config.symbols_obj.all[symbolId];
    let symbolName = symbolInfo.symbolName;
    const width = window.document.documentElement.offsetWidth;
    const id = this.state.anchorEl ? "anchorEl" : undefined;
    return (
      <div className={classes.orderList}>
        <div
          className={classnames(
            classes.tabBg,
            this.props.showFinance ? "" : classes.shrink
          )}
        >
          {this.props.showFinance && width < 1600 ? (
            <div className={classes.selectTabs}>
              <p onClick={this.openModal.bind(this, "tab_modal")}>
                <span>
                  {this.props.intl.formatMessage({
                    id: tabs[Number(orderTab) - 1 + ""]
                  })}
                  {Number(orderTab) - 1 == 0
                    ? `(${position_list.length})`
                    : Number(orderTab) - 1 == 1
                    ? `(${current_list.length})`
                    : ""}
                </span>
                <Iconfont
                  aria-owns={this.state.tab_modal ? "tab_modal" : undefined}
                  type="arrowDown"
                  aria-haspopup="true"
                  size="20"
                />
              </p>
            </div>
          ) : (
            <Tabs
              value={orderTab}
              onChange={this.changeTab}
              indicatorColor="primary"
              textColor="inherit"
              className={classnames(classes.tabs, "orderTabs")}
            >
              {tabs.map((item, i) => {
                let count =
                  i == 0
                    ? `(${position_list.length})`
                    : i == 1
                    ? `(${current_list.length})`
                    : "";
                return (
                  <Tab
                    value={`${i + 1}`}
                    key={i}
                    label={
                      this.props.intl.formatMessage({
                        id: item
                      }) + `${count}`
                    }
                  />
                );
              })}
            </Tabs>
          )}
          <div className={classes.selectAllSymbol}>
            {orderTab != "5" ? (
              <FormControlLabel
                className={classes.coin_select}
                classes={{
                  label: classes.label
                }}
                control={
                  <Checkbox
                    name="hideZero"
                    onChange={this.handleChange.bind(this)}
                    checked={this.state[orderTab].checked}
                    color="primary"
                    classes={{
                      root: classes.checkRoot
                    }}
                  />
                }
                label={this.props.intl.formatMessage({ id: "全部合约" })}
              />
            ) : (
              ""
            )}
            
          </div>
        </div>
        {orderTab == "2" || orderTab == "3" ? (
          <div className={classes.selectBtnGroup}>
            {this.state.order_type.map(item => {
              return (
                <Button
                  variant="outlined"
                  onClick={this.changeEntrustType.bind(this, item.value)}
                  key={item.value}
                  className={
                    this.state[orderTab].order_type === item.value
                      ? "selected"
                      : ""
                  }
                >
                  {this.props.intl.formatMessage({
                    id: item.label
                  })}
                </Button>
              );
            })}
          </div>
        ) : (
          ""
        )}
        <PositionList
          params={params1}
          {...this.props}
          tab={orderTab}
          checked={params1.checked}
          classes={classes}
          useWindow={false}
        />
        <CurrentList
          params={params2}
          {...this.props}
          tab={orderTab}
          checked={params2.checked}
          classes={classes}
          useWindow={false}
        />
        <HistoryEntrustList
          params={params3}
          {...this.props}
          tab={orderTab}
          checked={params3.checked}
          select_type={orderTab["order_type"]}
          classes={classes}
          useWindow={false}
        />
        <HistoryOrderList
          params={params4}
          {...this.props}
          tab={orderTab}
          checked={params4.checked}
          select_type={orderTab["order_type"]}
          classes={classes}
          useWindow={false}
        />
        {orderTab === "5" ? <Introduce {...this.props} /> : ""}
        
        {orderTab === "5" ? (
          ""
        ) : (
          <Popper
            open={Boolean(this.state.anchorEl)}
            anchorEl={this.state.anchorEl}
            id={id}
            onClose={this.closeModal.bind(this, "anchorEl")}
            placement="bottom-end"
            style={{ zIndex: 2 }}
          >
            <Paper className={classes.paper}>
              <ClickAwayListener
                onClickAway={this.closeModal.bind(this, "anchorEl")}
              >
                <MenuList className={classes.menulist}>
                  {this.state.order_type.map(item => {
                    return (
                      <MenuItem
                        key={item.value}
                        selected={
                          this.state[orderTab].order_type === item.value
                        }
                        onClick={this.changeEntrustType.bind(this, item.value)}
                        classes={{ selected: classes.menuselect }}
                      >
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Popper>
        )}
        <Popper
          open={Boolean(this.state.tab_modal)}
          anchorEl={this.state.tab_modal}
          id="tab_modal"
          onClose={this.closeModal.bind(this, "tab_modal")}
          placement="bottom-start"
          style={{ zIndex: 200 }}
        >
          <Paper className={classnames(classes.commonPaper, classes.tabPaper)}>
            <ClickAwayListener
              onClickAway={this.closeModal.bind(this, "tab_modal")}
            >
              <MenuList>
                {tabs.map((item, i) => {
                  let count =
                    i == 0
                      ? `(${position_list.length})`
                      : i == 1
                      ? `(${current_list.length})`
                      : "";
                  return (
                    <MenuItem
                      selected={orderTab == i + 1}
                      key={i}
                      onClick={this.change.bind(this, i + 1)}
                    >
                      {this.props.intl.formatMessage({
                        id: item
                      }) + `${count}`}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </div>
    );
  }
}
Order.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(injectIntl(Order));
