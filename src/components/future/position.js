// 当前持仓
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Table } from "../../lib";
import { injectIntl } from "react-intl";
import styles from "./order_style";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
//import { Button, MenuItem, Select } from "@material-ui/core";
import Header from "./order_header";
import WSDATA from "../../models/data_source";
import CONST from "../../config/const";

class Order extends React.Component {
  constructor() {
    super();
    this.state = {
      firstRender: false,
    };
    this.getMore = this.getMore.bind(this);
  }
  componentDidMount() {
    this.getMore(true);
    this.first();
    // 启动订阅
    //this.sub();
    // http轮询更新
    this.update();
    // // 从源数据更新到展示数据
    //this.updateData();
    this.setState({
      firstRender: true,
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: "layout/ws_cancel",
      payload: {},
      dispatch: this.props.dispatch,
    });
  }
  // http拉取第一次数据
  // 等待ws失败3次后发起第一次请求
  async first() {
    this.getMore(true);
  }
  async update() {
    // 下拉，下单时，等待完成后再更新
    // if (this.props.loading.effects["future/getPositionOrder"]) {
    //   await helper.delay(200);
    //   return this.update();
    // }
    // future/updatePositionOrder 如果触发错误，直接抛出异常，后面的await就不执行了
    try {
      await this.props.dispatch({
        type: "future/updatePositionOrder",
        payload: {},
      });
    } catch (err) {}
    // 3s 后再次更新数据
    await helper.delay(3000);
    this.update();
  }
  // async updateData() {
  //   if (this.props.userinfo.defaultAccountId) {
  //     const future_position_source = WSDATA.getData("future_position_source");
  //     this.props.dispatch({
  //       type: "future/update_position",
  //       payload: {
  //         future_position_source
  //       }
  //     });
  //   }
  //   await helper.delay(400);
  //   this.updateData();
  // }
  // async sub() {
  //   const ws = this.props.ws;
  //   const userinfo = this.props.userinfo;
  //   if (!ws.oid || !userinfo.defaultAccountId) {
  //     await helper.delay(200);
  //     return this.sub();
  //   }
  //   if (window.location.pathname.indexOf(route_map.future_position) === -1) {
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
  async handleChange(type, e) {
    await this.setState({
      [type]: e.target.value,
    });
    this.getMore(true, true);
  }
  async changeTime(type) {
    await this.setState({
      time_range: type,
    });
    this.getMore(true, true);
  }
  // 获取更多
  getMore(firstReq, isHttp) {
    let params = this.state || {};
    params.firstReq = firstReq;
    params.http = isHttp || "";
    this.props.dispatch({
      type: "future/getPositionOrder",
      payload: params,
    });
  }
  // 切换
  async goto(exchangeId, symbolId, tokenId) {
    if (window.location.href.indexOf(route_map.future) < 0) {
      window.location.href = route_map.future + "/" + symbolId;
    }
    // if (window.g_k_line_loading) return;
    // window.g_k_line_loading = true;
    // let url = route_map.future + "/" + symbolId;
    // this.props.history.push(url);
    // 取消订阅
    await this.props.dispatch({
      type: "layout/qws_cancel",
      payload: {},
    });
    // 清除行情数据
    WSDATA.clearAll("qws");
    // 更新服务器时间
    await this.props.dispatch({
      type: "layout/getServerTime",
      payload: {},
    });
    // 清除最新成交,深度，盘口数据
    let future_info = this.props.config.symbols_obj.futures[symbolId] || {};
    let token2 = future_info.quoteTokenId;
    let token2_name = future_info.quoteTokenName;

    await this.props.dispatch({
      type: "future/handleChange",
      payload: {
        newTrade: [],
        depth: {
          sell: [],
          buy: [],
        },
        symbol_id: symbolId, // 币对id
        exchange_id: exchangeId,
        buy_lever: null, // 杠杠dom节点
        buy_type: 0, // 0= 限价， 1 = 计划委托
        buy_price: "", // 价格
        buy_price_type: 0, // 价格类型 : price_types[n]
        buy_trigger_price: "", // 计划委托触发价格
        buy_leverage: "", // 杠杆值
        buy_quantity: "", // 数量
        buy_progress: 0, // 买入进度条
        buy_max: 0, // 限价买入最大值，根据用户价格进行计算
        buy_risk: "", // 风险限额id

        sale_lever: null, // 杠杠下拉选项 dom节点
        sale_type: 0, // 0= 限价， 1 = 计划委托
        sale_price: "", // 价格
        sale_price_type: 0, // 价格类型 : price_types[n]
        sale_trigger_price: "", // 计划委托触发价格
        sale_leverage: "", // 杠杆值
        sale_quantity: "", // 数量
        sale_max: 0, // 限价卖出最大值，用户余额
        sale_progress: 0, // 卖出进度条
        sale_risk: "", // 风险限额id

        token2,
        token2_name,
        future_info,
      },
    });
    // // 更新余额
    // await this.props.dispatch({
    //   type: "layout/getOptionAssetAva",
    //   payload: {
    //     token_ids: this.props.match.params.symbolId
    //   }
    // });
    await this.props.dispatch({
      type: "layout/getFuturesAsset",
      payload: {},
    });
    // 更新币对信息
    // await this.props.dispatch({
    //   type: "layout/filterChange",
    //   payload: {},
    //   reset: true
    // });
    // 重新订阅
    // await this.props.dispatch({
    //   type: "layout/qws_sub",
    //   payload: {
    //     dispatch: this.props.dispatch
    //   }
    // });
    // 更新kline， reset
    // if (this.props.datafeed_reset) {
    //   this.props.datafeed_reset(
    //     symbolId,
    //     CONST["k"][this.props.max_digits],
    //     this.props.base_precision,
    //     this.props.max_digits
    //   );
    //   if (this.props.tvwidget) {
    //     this.props.tvwidget.chart().resetData();
    //     this.props.tvwidget.chart().setSymbol(future_info.symbolName);
    //   }
    // }
    // if (window.location.pathname.indexOf(route_map.future) > -1) {
    //   let path = window.location.pathname.split("/");
    //   let symbolId = "";
    //   this.props.symbol_list.map(v => {
    //     if (path[4] && v.baseTokenId === path[4].toUpperCase()) {
    //       symbolId = v.quoteTokenId;
    //     }
    //   });
    //   let n = this.props.symbol_types.findIndex(v => {
    //     return symbolId && v == symbolId.toUpperCase();
    //   });
    // this.props.dispatch({
    //   type: "layout/filterChange",
    //   payload: {
    //     symbol_choose: n
    //   }
    // });
    // }
    setTimeout(() => {
      window.g_k_line_loading = false;
    }, 1000);
  }

  render() {
    const { classes, userinfo, position_list } = this.props;
    const column_detail = [
      {
        title: this.props.intl.formatMessage({
          id: "合约",
        }),
        key: "symbolName",
        render: (text, record) => {
          return (
            <span
              onClick={this.goto.bind(this, record.exchangeId, record.symbolId)}
              style={{ cursor: "pointer" }}
              className={classes.goto}
            >
              {text}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "杠杆",
        }),
        key: "leverage",
        render: (text, record) => {
          return <span>{text}X</span>;
        },
      },
      {
        title: `${this.props.intl.formatMessage({
          id: "仓位",
        })}(${this.props.intl.formatMessage({ id: "张" })})`,
        key: "total",
        render: (text, record) => {
          let symbolInfo =
            this.props.config.symbols_obj.all[record.symbols_obj] || {};
          return (
            <span
              className={text > 0 ? classes.up : text < 0 ? classes.down : ""}
            >
              {text && symbolInfo.basePrecision
                ? helper.digits(text, CONST["depth"][symbolInfo.basePrecision])
                : text}
            </span>
          );
        },
      },
      {
        title: `${this.props.intl.formatMessage({
          id: "仓位价值",
        })}`,
        key: "positionValues",
        render: (text, record) => {
          let symbolInfo =
            this.props.config.symbols_obj.all[record.symbols_obj] || {};
          return (
            <span>
              {text && symbolInfo.baseTokenFutures
                ? helper.digits(
                    text,
                    CONST["depth"][symbolInfo.baseTokenFutures.marginPrecision]
                  )
                : text}
              {record.unit}
            </span>
          );
        },
      },
      {
        title: `${this.props.intl.formatMessage({
          id: "仓位保证金",
        })}`,
        key: "margin",
        render: (text, record) => {
          let symbolInfo =
            this.props.config.symbols_obj.all[record.symbols_obj] || {};
          return (
            <span>
              {text &&
              symbolInfo.baseTokenFutures &&
              symbolInfo.baseTokenFutures.marginPrecision
                ? helper.digits(
                    text,
                    CONST["depth"][symbolInfo.baseTokenFutures.marginPrecision]
                  )
                : text}
              {record.unit}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "开仓均价",
        }),
        key: "avgPrice",
        render: (text, record) => {
          let symbolInfo =
            this.props.config.symbols_obj.all[record.symbols_obj] || {};
          return (
            <span>
              {text && symbolInfo.minPricePrecision
                ? helper.digits(
                    text,
                    CONST["depth"][symbolInfo.minPricePrecision]
                  )
                : text}{" "}
              {symbolInfo && symbolInfo.baseTokenFutures
                ? symbolInfo.baseTokenFutures.displayTokenId
                : ""}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "预估强平价",
        }),
        key: "liquidationPrice",
        render: (text, record) => {
          let symbolInfo =
            this.props.config.symbols_obj.all[record.symbols_obj] || {};
          return (
            <span>
              {text && symbolInfo.minPricePrecision
                ? helper.digits(
                    text,
                    CONST["depth"][symbolInfo.minPricePrecision]
                  )
                : text}{" "}
              {symbolInfo && symbolInfo.baseTokenFutures
                ? symbolInfo.baseTokenFutures.displayTokenId
                : ""}
            </span>
          );
        },
      },
      {
        title: `${this.props.intl.formatMessage({
          id: "未实现盈亏",
        })}`,
        key: "unrealisedPnl",
        render: (text, record) => {
          let symbolInfo =
            this.props.config.symbols_obj.all[record.symbols_obj] || {};
          return (
            <span>
              {text &&
              symbolInfo.baseTokenFutures &&
              symbolInfo.baseTokenFutures.marginPrecision
                ? helper.digits(
                    text,
                    CONST["depth"][symbolInfo.baseTokenFutures.marginPrecision]
                  )
                : text}
              {record.unit}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "标的指数",
        }),
        key: "indices",
        render: (text, record) => {
          let symbolInfo =
            this.props.config.symbols_obj.all[record.symbols_obj] || {};
          return (
            <span>
              {text && symbolInfo.minPricePrecision
                ? helper.digits(
                    text,
                    CONST["depth"][symbolInfo.minPricePrecision]
                  )
                : text}
            </span>
          );
        },
      },
    ];

    return (
      <div className={classes.order}>
        <h2>{this.props.intl.formatMessage({ id: "永续合约订单" })}</h2>
        <div className={classes.order_header}>
          <Header />
          <div className={classes.action_position} style={{ display: "none" }}>
            {/* <Select
              value={this.state.underlying_id}
              onChange={this.handleChange.bind(this, "underlying_id")}
              className={classes.select}
              classes={{ icon: classes.icon }}
              displayEmpty
              inputProps={{
                name: "underlying_id",
                id: "underlying_id"
              }}
            >
              <MenuItem value="" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "全部" })}
              </MenuItem>
              {this.props.target_list.length
                ? this.props.target_list.map(item => {
                    return (
                      <MenuItem
                        value={item.id}
                        key={item.id}
                        className={classes.menuItem}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  })
                : ""}
            </Select> */}
            {/* <Select
              value={this.state.side}
              onChange={this.handleChange.bind(this, "side")}
              className={classes.select}
              classes={{ icon: classes.icon }}
              displayEmpty
              inputProps={{
                name: "side",
                id: "side"
              }}
            >
              <MenuItem value="" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "全部" })}
              </MenuItem>
              <MenuItem value="BUY_OPEN" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "买入开多" })}
              </MenuItem>
              <MenuItem value="SELL_OPEN" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "卖出平多" })}
              </MenuItem>
              <MenuItem value="BUY_CLOSE" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "买入平空" })}
              </MenuItem>
              <MenuItem value="SELL_CLOSE" className={classes.menuItem}>
                {this.props.intl.formatMessage({ id: "卖出平空" })}
              </MenuItem>
            </Select> */}
            {/* <div className={classes.time_select}>
              <span
                className={this.state.time_range == "1w" ? "active" : ""}
                onClick={this.changeTime.bind(this, "1w")}
              >
                {this.props.intl.formatMessage({ id: "最近一周" })}
              </span>
              <span
                className={this.state.time_range == "1w" ? "" : "active"}
                onClick={this.changeTime.bind(this, "-1w")}
              >
                {this.props.intl.formatMessage({ id: "一周以前" })}
              </span>
            </div> */}
          </div>
        </div>
        <Table
          titles={column_detail}
          data={(
            helper.excludeRepeatArray(
              "positionId",
              position_list,
              "positionId"
            ) || []
          ).sort((a, b) => (a.positionId - b.positionId >= 0 ? -1 : 1))}
          widthStyle={classes.position_table_width}
          useWindow={false}
          noResultText=""
          showNoMoreData={true}
          hasMore={
            !this.props.loading.effects["future/getPositionOrder"] &&
            this.props.position_more
          }
          loading={
            userinfo.userId
              ? Boolean(this.props.loading.effects["future/getPositionOrder"])
              : false
          }
          getMore={this.getMore.bind(this, false)}
        />
      </div>
    );
  }
}
Order.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(injectIntl(Order));
