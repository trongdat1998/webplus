// 合约资产
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./finance_style";
import helper from "../../utils/helper";
import { Table, Iconfont } from "../../lib";
import TransferModal from "../public/transfer_modal";
import FinanceHeader from "../public/finance_header";
import TooltipCommon from "../public/tooltip";
import { CircularProgress } from "@material-ui/core";

class FinanceList extends React.Component {
  constructor() {
    super();
    this.state = {
      tokenId: "",
      modal: false,
      subed: false,
      first_loading: false,
    };
  }

  async changeModal(status, tokenId) {
    await this.setState({
      tokenId,
    });
    this.setState({
      modal: status,
    });
  }
  componentDidMount() {
    this.props.dispatch({
      type: "future/getFutureAsset",
      payload: {},
      callback: () => {
        if (!this.state.first_loading) {
          this.setState({
            first_loading: true,
          });
        }
      },
    });
  }
  shouldComponentUpdate(nextProps) {
    const loading =
      this.props.loading && this.props.loading.effects
        ? this.props.loading.effects
        : {};
    const nextloading =
      nextProps.loading && nextProps.loading.effects
        ? nextProps.loading.effects
        : {};
    if (loading["layout/get_rates"] != nextloading["layout/get_rates"]) {
      return true;
    }
    return true;
  }
  render() {
    const { classes, ...otherProps } = this.props;
    const column_list = [
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "tokenId",
        render: (text, record) => {
          return (
            <span>
              {text}
              {this.props.explore_token.indexOf(text) > -1 ? (
                <TooltipCommon
                  title={this.props.intl.formatMessage({
                    id: "（注：该币为体验币，不计入个人资产折合）",
                  })}
                  placement="top"
                >
                  <span>
                    <Iconfont className={classes.icon} type="info" size="20" />
                  </span>
                </TooltipCommon>
              ) : (
                ""
              )}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "可用保证金",
        }),
        key: "availableMargin",
        render: (text, record) => {
          return (
            <span>
              {this.props.hidden_balance
                ? "********"
                : helper.digits(text || 0, 2)}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "仓位保证金",
        }),
        key: "positionMargin",
        render: (text, record) => {
          return (
            <span>
              {this.props.hidden_balance
                ? "********"
                : helper.digits(text || 0, 2)}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "委托保证金",
        }),
        key: "orderMargin",
        render: (text, record) => {
          return (
            <span>
              {this.props.hidden_balance
                ? "********"
                : helper.digits(text || 0, 2)}
            </span>
          );
        },
      },
      {
        title: (
          <span className="action">
            {this.props.accountList.length > 1
              ? this.props.intl.formatMessage({
                  id: "操作",
                })
              : ""}
          </span>
        ),
        key: "action",
        render: (text, record) => {
          return (
            <div className={classes.action}>
              {this.props.accountList.length > 1 ? (
                <div>
                  <a
                    onClick={this.changeModal.bind(this, true, record.tokenId)}
                  >
                    {this.props.intl.formatMessage({ id: "划转" })}
                  </a>
                </div>
              ) : (
                ""
              )}
            </div>
          );
        },
      },
    ];
    
    const cRates2 = helper.currencyValue(
      this.props.rates,
      this.props.total_asset && this.props.total_asset.futuresCoinAsset
        ? this.props.total_asset.futuresCoinAsset
        : 0,
      this.props.total_asset ? this.props.total_asset.unit : null
    );
    return (
      <div className={classes.list}>
        <FinanceHeader tab="future" {...otherProps} />
        <div className={classes.financeCont}>
          <p className={classes.info}>
            <span>
              {this.props.intl.formatMessage({ id: "永续合约资产折合" })}(
              {this.props.total_asset ? this.props.total_asset.unit : ""}):
            </span>
            {this.props.total_asset && this.props.total_asset.futuresCoinAsset
              ? this.props.hidden_balance
                ? "********"
                : helper.digits(this.props.total_asset.futuresCoinAsset, 2)
              : ""}{" "}
            {this.props.total_asset &&
            this.props.total_asset.futuresCoinAsset &&
            //this.props.total_asset.futuresAsset &&
            this.props.rates[this.props.total_asset.unit]
              ? `≈ ${cRates2[0]}${
                  this.props.hidden_balance ? "********" : cRates2[1]
                }`
              : ""}
            <TooltipCommon
              title={this.props.intl.formatMessage({
                id: "永续合约资产折合=可用保证金+仓位保证金+委托保证金",
              })}
              placement="top"
            >
              <span>
                <Iconfont className={classes.icon} type="info" size="20" />
              </span>
            </TooltipCommon>
          </p>
          {this.props.future_balances ? (
            this.state.first_loading ? (
              <Table
                data={this.props.future_balances}
                widthStyle={classes.order_table_ava_width}
                titles={column_list}
                hasMore={false}
                getMore={this.getMore}
                refresh={this.props.hidden_balance}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 500,
                }}
              >
                <CircularProgress />
              </div>
            )
          ) : (
            ""
          )}
          <TransferModal
            open={this.state.modal}
            source_type={this.props.account_coin_index}
            target_type={this.props.account_future_index}
            onCancel={this.changeModal.bind(this, false)}
            token_id={this.state.tokenId}
            {...otherProps}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(FinanceList));
