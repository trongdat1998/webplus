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
import moment from "moment";

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
    this.props.dispatch({
      type: "coinplus/getPeriodicalFinance",
      payload: {},
    });
  }

  goto(url, canGo) {
    if (canGo) {
      window.location.href = url;
    }
  }

  handleRate(str) {
    const arr = str.split(",");
    let res = [];
    if (arr[1]) {
      res[0] = arr[0];
      res[1] = arr[1];
    } else {
      res[0] = arr[0];
    }
    return res;
  }

  render() {
    const { classes, functions, ...otherProps } = this.props;
    const {
      financeList,
      periodicalFinanceList,
      intl,
      rates,
      total_asset,
      hidden_balance,
    } = this.props;
    // 活期资产列表
    const column = [
      {
        title: intl.formatMessage({
          id: "产品名称",
        }),
        key: "productName",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: intl.formatMessage({
          id: "持有资产",
        }),
        key: "balance",
        render: (text, record) => {
          return (
            <span>
              {hidden_balance
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
        title: intl.formatMessage({
          id: "昨日收益",
        }),
        key: "lastProfit",
        render: (text, record) => {
          return (
            <span>
              {hidden_balance ? "********" : text} {record.token}
            </span>
          );
        },
      },
      {
        title: intl.formatMessage({
          id: "累计收益",
        }),
        key: "totalProfit",
        render: (text, record) => {
          return (
            <span>
              {hidden_balance ? "********" : text} {record.token}
            </span>
          );
        },
      },
      {
        title: intl.formatMessage({
          id: "近七日年化",
        }),
        key: "sevenYearRate",
        render: (text, record) => {
          return (
            <span className={classes.profit}>
              {hidden_balance ? "**" : helper.digits((text || 0) * 100, 2)}
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
                {intl.formatMessage({ id: "申购" })}
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
                {intl.formatMessage({ id: "赎回" })}
              </Button>
              {/* </a> */}
            </div>
          );
        },
      },
    ];
    // 定期资产列表
    const columnPeriodcal = [
      {
        title: intl.formatMessage({
          id: "项目名称",
        }),
        key: "productName",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: intl.formatMessage({
          id: "持有资产",
        }),
        key: "currentAmount",
        render: (text, record) => {
          return (
            <span>
              {hidden_balance ? "********" : text} {record.tokenName}
            </span>
          );
        },
      },
      {
        title: intl.formatMessage({
          id: "期限(天)",
        }),
        key: "timeLimit",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: intl.formatMessage({
          id: "到期时间",
        }),
        key: "endDate",
        render: (text, record) => {
          return (
            <span>{moment.utc(Number(text)).local().format("YYYY/MM/DD")}</span>
          );
        },
      },
      {
        title: intl.formatMessage({
          id: "约定年化",
        }),
        key: "referenceApr",
        render: (text, record) => {
          return (
            <span className={classes.profit}>
              {/* {hidden_balance
                ? "**"
                : (Number(this.handleRate(text || "")[0]) * 10000) / 100}
              <em>%</em> */}
              {hidden_balance ? "**" : text}
              <em>%</em>
            </span>
          );
        },
      },
      {
        title: "",
        key: "action",
        render: (text, record) => {
          return <div className={classes.action}></div>;
        },
      },
    ];
    const cRates = helper.currencyValue(
      rates,
      total_asset ? total_asset.totalAsset : 0,
      total_asset ? total_asset.unit : null
    );
    const cRates2 = helper.currencyValue(
      rates,
      total_asset
        ? Number(total_asset.financeAsset) + Number(total_asset.stakingAsset)
        : 0,
      total_asset ? total_asset.unit : null
    );
    return (
      <div className={classes.list}>
        <FinanceHeader tab="bonus" functions={functions} {...otherProps} />
        <div className={classes.financeCont}>
          <p className={classes.info}>
            <span>{intl.formatMessage({ id: "币多多资产折合" })}(USDT):</span>
            {total_asset &&
            total_asset.financeAsset &&
            total_asset.stakingAsset &&
            rates &&
            rates[total_asset.unit]
              ? hidden_balance
                ? "********"
                : helper.digits(
                    math
                      .chain(total_asset.financeAsset)
                      .add(total_asset.stakingAsset)
                      .format({
                        notation: "fixed",
                      })
                      .done(),
                    8
                  )
              : ""}{" "}
            {total_asset && total_asset.financeAsset && rates[total_asset.unit]
              ? `≈ ${hidden_balance ? "" : cRates2[0]}${
                  hidden_balance ? "********" : cRates2[1]
                }`
              : ""}
          </p>
          {periodicalFinanceList.length
            ? periodicalFinanceList.map((item, i) => {
                const title = {
                  "0": "定期项目",
                  "1": "活期项目",
                  "2": "锁仓项目",
                };
                if (!item.assets || !item.assets.length) {
                  return "";
                }
                return (
                  <div key={i}>
                    <h2>{intl.formatMessage({ id: title[item.type] })}</h2>
                    {this.props.userinfo.userId ? (
                      <Table
                        data={item.assets}
                        widthStyle={classes.order_table_width}
                        titles={columnPeriodcal}
                        hasMore={false}
                        refresh={hidden_balance}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              })
            : ""}
          {financeList.length ? (
            <div>
              <h2>{intl.formatMessage({ id: "活期项目" })}</h2>
              {this.props.userinfo.userId ? (
                <Table
                  data={financeList}
                  widthStyle={classes.order_table_width}
                  titles={column}
                  hasMore={false}
                  refresh={hidden_balance}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(FinanceList));
