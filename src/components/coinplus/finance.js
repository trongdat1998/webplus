// 币多多资产列表
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./finance_style";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import math from "../../utils/mathjs";
import { Table } from "../../lib";
import { Button } from "@material-ui/core";
import FinanceHeader from "../public/finance_header";

class FinanceList extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({
      type: "coinplus/getFinance",
      payload: {},
    });
  }

  goto(url, canGo) {
    if (canGo) {
      window.location.href = url;
    }
  }

  render() {
    const { classes, functions, ...otherProps } = this.props;
    // 资产列表
    const column = [
      {
        title: this.props.intl.formatMessage({
          id: "产品名称",
        }),
        key: "productName",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "持有资产",
        }),
        key: "balance",
        render: (text, record) => {
          return (
            <span>
              {this.props.hidden_balance
                ? "********"
                : math
                    .chain(math.bignumber(record.balance || 0))
                    .add(math.bignumber(record.purchase || 0))
                    .add(math.bignumber(record.redeem || 0))
                    .format({
                      notation: "fixed",
                    })
                    .done()}{" "}
              {record.token}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "昨日收益",
        }),
        key: "lastProfit",
        render: (text, record) => {
          return (
            <span>
              {this.props.hidden_balance ? "********" : text} {record.token}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "累计收益",
        }),
        key: "totalProfit",
        render: (text, record) => {
          return (
            <span>
              {this.props.hidden_balance ? "********" : text} {record.token}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "近七日年化",
        }),
        key: "sevenYearRate",
        render: (text, record) => {
          return (
            <span className={classes.profit}>
              {this.props.hidden_balance
                ? "**"
                : helper.digits((text || 0) * 100, 2)}
              <em>%</em>
            </span>
          );
        },
      },
      {
        title: "",
        key: "action",
        render: (text, record) => {
          return (
            <div className={classes.action}>
              {/* <a href={route_map.coinplusOrder + "/" + record.productId} > */}
              <Button
                variant="contained"
                color="primary"
                disabled={!record.allowPurchase}
                onClick={this.goto.bind(
                  this,
                  route_map.coinplusOrder + "/" + record.productId,
                  record.allowPurchase
                )}
              >
                {this.props.intl.formatMessage({ id: "申购" })}
              </Button>
              {/* </a> */}
              {/* <a href={route_map.coinplusRedeem + "/" + record.productId} > */}
              <Button
                variant="outlined"
                color="primary"
                disabled={!record.allowRedeem}
                onClick={this.goto.bind(
                  this,
                  route_map.coinplusRedeem + "/" + record.productId,
                  record.allowRedeem
                )}
              >
                {this.props.intl.formatMessage({ id: "赎回" })}
              </Button>
              {/* </a> */}
            </div>
          );
        },
      },
    ];
    const cRates = helper.currencyValue(
      this.props.rates,
      this.props.total_asset ? this.props.total_asset.totalAsset : 0,
      this.props.total_asset ? this.props.total_asset.unit : null
    );
    const cRates2 = helper.currencyValue(
      this.props.rates,
      this.props.total_asset ? this.props.total_asset.financeAsset : 0,
      this.props.total_asset ? this.props.total_asset.unit : null
    );
    return (
      <div className={classes.list}>
        <FinanceHeader tab="bonus" functions={functions} {...otherProps} />
        <div className={classes.financeCont}>
          <p className={classes.info}>
            <span>
              {this.props.intl.formatMessage({ id: "币多多资产折合" })}(USDT):
            </span>
            {this.props.total_asset &&
            this.props.total_asset.financeAsset &&
            this.props.rates &&
            this.props.rates[this.props.total_asset.unit]
              ? this.props.hidden_balance
                ? "********"
                : helper.digits(
                    math
                      .chain(this.props.total_asset.financeAsset)
                      .multiply(
                        this.props.rates[this.props.total_asset.unit]["BTC"]
                      )
                      .format({
                        notation: "fixed",
                      })
                      .done(),
                    8
                  )
              : ""}{" "}
            {this.props.total_asset &&
            this.props.total_asset.financeAsset &&
            this.props.rates[this.props.total_asset.unit]
              ? `≈ ${this.props.hidden_balance ? "" : cRates2[0]}${
                  this.props.hidden_balance ? "********" : cRates2[1]
                }`
              : ""}
          </p>
          {this.props.userinfo.userId ? (
            <Table
              data={this.props.financeList}
              widthStyle={classes.order_table_width}
              titles={column}
              hasMore={false}
              refresh={this.props.hidden_balance}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(FinanceList));
