// 盘口数据列表
import React from "react";
import math from "../../utils/mathjs";
import classnames from "classnames";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import helper from "../../utils/helper";
import styles from "../public/quote_style";

const ismobile = /iphone|android|ipad/i.test(window.navigator.userAgent);

class HandicapList extends React.Component {
  constructor() {
    super();
    this.click = this.click.bind(this);
  }
  componentDidMount() {
    //this.resetScroll();
  }
  componentDidUpdate(preProps, preState) {
    // if (
    //   this.props.symbol_id !== preProps.symbol_id ||
    //   this.props.aggTrade_digits !== preProps.aggTrade_digits
    // ) {
    //   this.resetScroll();
    // }
  }
  resetScroll = () => {
    if (this.props.type == "0") {
      this.refbox.scrollTop = 900;
    } else {
      this.refbox.scrollTop = 0;
    }
  };
  click(t, _p, q) {
    const p = _p || this.props.buy_price;
    const buy_max =
      Number(p) && Number(this.props.token2_quantity)
        ? helper.digits(
            math
              .chain(math.bignumber(this.props.token2_quantity))
              .divide(math.bignumber(p))
              .format({ notation: "fixed" })
              .done(),
            this.props.base_precision
          )
        : 0;
    let buy_progress = 0;
    let sale_progress = 0;
    const sell_max = Number(
      helper.digits(this.props.token1_quantity, this.props.base_precision)
    );

    if (q) {
      buy_progress = Number(buy_max)
        ? math
            .chain(math.bignumber(Number(q) > buy_max ? buy_max : q))
            .divide(math.bignumber(buy_max))
            .multiply(100)
            .format({ notation: "fixed" })
            .done()
        : 0;
      sale_progress = Number(sell_max)
        ? math
            .chain(math.bignumber(Number(q) > sell_max ? sell_max : q))
            .divide(math.bignumber(sell_max))
            .multiply(100)
            .format({ notation: "fixed" })
            .done()
        : 0;
    }
    let payload = {
      buy_quantity: helper.digits(
        Number(q) > buy_max ? buy_max : q,
        this.props.base_precision
      ),
      sale_quantity: helper.digits(
        Number(q) > sell_max ? sell_max : q,
        this.props.base_precision
      ),
      buy_max,
      buy_progress: Math.max(0, Math.min(100, buy_progress)),
      sale_progress: sale_progress,
      hasAnimation: true,
    };
    if (this.props.order_type == "market") {
      delete payload.buy_quantity;
      payload.buy_progress = 0;
    }

    if (p) {
      payload.buy_price = p;
      payload.sale_price = p;
    }
    // t=1 买盘，t=0 卖盘
    if (Number(t)) {
      payload.buy_quantity = "";
      buy_progress = 0;
      payload.buy_progress = buy_progress;
    } else {
      sale_progress = 0;
      payload.sale_quantity = "";
      payload.sale_progress = 0;
    }
    this.props.dispatch({
      type: "lever/handleChange",
      payload,
    });
    const that = this;
    setTimeout(() => {
      that.props.dispatch({
        type: "lever/handleChange",
        payload: {
          hasAnimation: false,
        },
      });
    }, 1000);
    if (this.props.order_type == "limit") {
      this.props.setProgress &&
        this.props.setProgress(
          "buy_progress",
          "",
          Math.max(0, Math.min(100, buy_progress))
        );
      this.props.setProgress &&
        this.props.setProgress(
          "sale_progress",
          "",
          Math.max(0, Math.min(100, sale_progress))
        );
    }

    if (this.props.order_type == "market") {
      this.props.setProgressMarket &&
        this.props.setProgressMarket(
          "sale_progress",
          "",
          Math.max(0, Math.min(100, sale_progress))
        );
    }
  }
  render() {
    //window.console.log("handicapList render");
    const { classes } = this.props;
    let ar2 = [...this.props.data];
    // // 使用深度图数据，深度图数据100条，盘口只需30条
    const length = this.props.length;
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
                    className={
                      ismobile || !ar2[i][5]
                        ? classes.bgprogness2
                        : classes.bgprogness
                    }
                    style={{
                      //width: `${it && it[2] && fix ? (it[2] / fix) * 100 : 0}%`,
                      width: "100%",
                      transform: `scale3d(${
                        it && it[2] && fix ? it[2] / fix : 0
                      },1,1)`,
                      background: `${helper.hex_to_rgba(
                        this.props.type === "1"
                          ? window.palette.up.main
                          : window.palette.down.main,
                        0.08
                      )}`,
                    }}
                  />
                ) : (
                  <div
                    className={
                      ismobile ? classes.bgprogness2 : classes.bgprogness
                    }
                  ></div>
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
                    <div
                      className={
                        this.props.type === "1" ? classes.up : classes.down
                      }
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {ar2[i][0]}
                      {ar2[i][0] && this.props.prices[ar2[i][0]] ? (
                        <i
                          style={{
                            fontSize: 18,
                            lineHeight: "20px",
                            margin: "0 0 0 5px",
                          }}
                        >
                          •
                        </i>
                      ) : (
                        ""
                      )}
                    </div>
                    <div span={7}>
                      {helper.digits(ar2[i][1], this.props.base_precision)}
                    </div>
                    <div span={7}>
                      {helper.digits(ar2[i][4], this.props.base_precision)}
                    </div>
                  </div>
                ) : (
                  <div className="data">
                    <div
                      className={
                        this.props.type === "1" ? classes.up : classes.down
                      }
                    >
                      --
                    </div>
                    <div>--</div>
                    <div>--</div>
                  </div>
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
