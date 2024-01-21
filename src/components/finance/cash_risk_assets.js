// 风险资产列表
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Table } from "../../lib";
import { injectIntl } from "react-intl";
import moment from "moment";
import styles from "./style";
import classnames from "classnames";

class RiskAssetsRC extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: "finance/quota_info",
      payload: {
        tokenId: (this.props.match.params.token || "").toUpperCase(),
        chain_type: (this.props.match.params.chain_type || "").toUpperCase()
      }
    });
  }
  render() {
    const classes = this.props.classes;
    const column = [
      {
        title: this.props.intl.formatMessage({
          id: "时间"
        }),
        key: "createdAt",
        render: text => {
          return (
            <span>
              {moment
                .utc(Number(text))
                .local()
                .format("YYYY-MM-DD HH:mm:ss")}
            </span>
          );
        }
      },

      {
        title: this.props.intl.formatMessage({
          id: "币种"
        }),
        key: "tokenName"
      },
      {
        title: this.props.intl.formatMessage({
          id: "数量"
        }),
        key: "amount"
      },
      {
        title: this.props.intl.formatMessage({
          id: "估值"
        }),
        key: "btcAmount",
        render: (text, record) => {
          return <span>≈ {text}</span>;
        }
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作"
        }),
        key: "reason"
      }
    ];
    const cash = this.props.cash;
    return (
      <div className={classnames(classes.cash_risk, classes.list)}>
        <h2>{this.props.intl.formatMessage({ id: "风险资产明细" })}</h2>
        <p>{this.props.intl.formatMessage({ id: "cash.risk.desc" })}</p>
        <Table
          widthStyle={classes.cash_risk_table}
          data={cash.riskBalance || []}
          titles={column}
          hasMore={false}
          showNoMoreData={true}
          loading={this.props.loading.effects["finance/quota_info"]}
        />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(RiskAssetsRC));
