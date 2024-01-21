// 盘口数据列表
import React from "react";
import math from "../../../utils/mathjs";
import { injectIntl } from "react-intl";
import helper from "../../../utils/helper";
import styles from "./quote_style";
import { withStyles } from "@material-ui/core/styles";
import { Iconfont } from "../../../lib";
import Tooltip from "../../public/tooltip";
import { CircularProgress } from "@material-ui/core";
import { truncate } from "lodash";

class HandicapList extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.click = this.click.bind(this);
  }
  componentDidMount() {
    this.resetScroll();
  }
  componentDidUpdate(preProps, preState) {
    if (
      this.props.symbol_id !== preProps.symbol_id ||
      this.props.aggTrade_digits !== preProps.aggTrade_digits
    ) {
      this.resetScroll();
    }
  }
  resetScroll = () => {
    if (this.props.type == "0") {
      this.refbox.scrollTop = 900;
    } else {
      this.refbox.scrollTop = 0;
    }
  };
  click(t, p, q) {
    let position_list = [];

    if (p) {
      let data = {
        type: "future/handleChange",
        payload: { hasAnimation: true },
      };
      // 价格写入到当前持仓价格框
      if (this.props.position_list && this.props.position_list.length) {
        this.props.position_list.map((item) => {
          let d = { ...item };
          // id相同，且没有主动填值
          if (item.symbolId == this.props.symbol_id) {
            d.exitPrice = p;
          }
          position_list.push(d);
        });
        if (position_list.length) {
          data.payload = { ...data.payload, position_list };
        }
      }
      this.props.dispatch(data);
      const that = this;
      setTimeout(() => {
        that.props.dispatch({
          type: "future/handleChange",
          payload: {
            hasAnimation: false,
          },
        });
      }, 1000);
      this.props.createOrderFormChange({
        target: { name: "buy_price", value: p, from: "handicap" },
      });
      this.props.createOrderFormChange({
        target: { name: "sale_price", value: p, from: "handicap" },
      });
    }
  }
  cancelOrder = (price) => async (e) => {
    e && e.stopPropagation();
    if (this.state["loading" + price]) return;
    await this.setState({
      ["loading" + price]: true,
    });
    await this.props.cancelOrders(this.props.type, price);
    this.setState({
      ["loading" + price]: false,
    });
  };
  render() {
    //window.console.log("handicapList render");
    const { classes } = this.props;
    let ar2 = [...this.props.data];
    // // 使用深度图数据，深度图数据100条，盘口只需30条
    const length = this.props.length || 8;
    const ar = new Array(length).fill(1);
    const fix = this.props.fix;
    return (
      <div
        className={
          this.props.aggTrade_type == "all"
            ? classes.HandicapBox
            : classes.HandicapBox2
        }
        ref={(ref) => (this.refbox = ref)}
      >
        <div className={classes.HandicapList}>
          {[...ar.keys()].map((item, i) => {
            const it = ar2[i];
            return (
              <div key={i} className={classes.item}>
                {it && fix ? (
                  <div
                    className={classes.bgprogness}
                    style={{
                      width: `${it && it[2] && fix ? (it[2] / fix) * 100 : 0}%`,
                      background: `${helper.hex_to_rgba(
                        this.props.type === "1"
                          ? window.palette.up.main
                          : window.palette.down.main,
                        0.08
                      )}`,
                    }}
                  />
                ) : (
                  ""
                )}
                {it ? (
                  <div
                    className="data"
                    onClick={this.click.bind(
                      this,
                      this.props.type,
                      ar2[i][0],
                      ar2[i][4]
                    )}
                  >
                    {/* <div className={this.props.type == "1" ? s.u : s.d}>
                      {this.props.type == "1"
                        ? this.props.intl.formatMessage({
                            id: "买"
                          })
                        : this.props.intl.formatMessage({
                            id: "卖"
                          })}
                      {this.props.type == "1" ? 1 + i : ar2.length - i}
                    </div> */}
                    <div
                      className={
                        this.props.type === "1" ? classes.up : classes.down
                      }
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {ar2[i][0]}
                      {ar2[i][0] && this.props.prices[ar2[i][0]] ? (
                        <Tooltip
                          title={this.props.intl.formatMessage({
                            id: "您在此价格有挂单",
                          })}
                          disableFocusListener
                          disableTouchListener
                        >
                          <i
                            style={{
                              fontSize: 18,
                              lineHeight: "20px",
                              margin: "0 0 0 5px",
                            }}
                          >
                            •
                          </i>
                        </Tooltip>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      {helper.digits(ar2[i][1], this.props.base_precision)}
                    </div>
                    <div>
                      {helper.digits(ar2[i][4], this.props.base_precision)}
                      {ar2[i][0] && this.props.prices[ar2[i][0]] ? (
                        <Tooltip
                          title={this.props.intl.formatMessage({
                            id: "取消您在此价格上的最近委托单",
                          })}
                          disableFocusListener
                          disableTouchListener
                        >
                          <i className="delete">
                            {this.state[
                              "loading" + this.props.prices[ar2[i][0]]
                            ] ? (
                              <CircularProgress size={12} />
                            ) : (
                              <Iconfont
                                type="delete"
                                onClick={this.cancelOrder(
                                  this.props.prices[ar2[i][0]]
                                )}
                              />
                            )}
                          </i>
                        </Tooltip>
                      ) : (
                        <i className="delete"></i>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="data" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(HandicapList));
