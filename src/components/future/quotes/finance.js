// 资产
import React from "react";
import helper from "../../../utils/helper";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import styles from "./quote_style";
import { Tabs, Tab } from "@material-ui/core";
import { Iconfont } from "../../../lib";
import TransferModal from "../../public/transfer_modal";
import ModalRisk from "./modal_risk";
import CONST from "../../../config/const";
import WSDATA from "../../../models/data_source";
import TooltipCommon from "../../public/tooltip";
import classnames from "classnames";

class FinanceRC extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      tradeable_req: false,
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: "future/tradeable_req",
      payload: {},
    });
    this.props.dispatch({
      type: "future/getFutureAsset",
      payload: {},
    });
  }
  componentDidUpdate(preProps) {
    if (this.props.layout.ws && !this.state.subed) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.props.layout.ws.sub(
            {
              id: "futures_tradeable",
              topic: "futures_tradeable",
              event: "sub",
            },
            this.httpAction,
            this.callback
          );
          this.httpAction();
        }
      );
    }
  }

  httpAction = async (payload) => {
    await this.props.dispatch({
      type: "future/tradeable_req",
      payload: {},
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
    data && data.data && WSDATA.setData("future_tradeable_source", data.data);
  };
  change = (key) => () => {
    this.setState({
      open: key,
    });
  };
  // 开发风险限额
  changeRisk = (key) => (e) => {
    this.props.dispatch({
      type: "future/handleChange",
      payload: {
        modal_risk: true,
        key_risk: key,
      },
    });
  };
  render() {
    const { classes, layout, future, ...otherProps } = this.props;
    let token2_name = "";
    let symbolId = this.props.match.params.symbolId;
    if (!symbolId) {
      return <div />;
    }
    symbolId = symbolId.toUpperCase();
    const symbol_info = this.props.layout.config.symbols_obj.all[symbolId];
    token2_name = symbol_info.quoteTokenName;
    const marginPrecision = symbol_info.baseTokenFutures
      ? CONST["depth"][symbol_info.baseTokenFutures.marginPrecision]
      : "";
    const tradeable =
      this.props.future &&
      this.props.future.future_tradeable &&
      this.props.future.future_tradeable[symbolId] &&
      this.props.future.future_tradeable[symbolId]["profitLoss"]
        ? this.props.future.future_tradeable[symbolId]["profitLoss"]
        : {};

    // 风险限额列表
    let futuresRiskLimits = symbol_info.baseTokenFutures.riskLimits;
    // 风险总额信息,风险限额右值
    let buy_risk_info = {};
    let sale_risk_info = {};
    futuresRiskLimits.map((item) => {
      if (item.riskLimitId == this.props.future.buy_risk) {
        buy_risk_info = item;
      }
      if (item.riskLimitId == this.props.future.sale_risk) {
        sale_risk_info = item;
      }
    });
    // 当前可交易信息：风险额,风险限额左值
    let tradeableInfo =
      this.props.future &&
      this.props.future.future_tradeable &&
      this.props.future.future_tradeable[symbolId]
        ? this.props.future.future_tradeable[symbolId]
        : {};

    const width = window.document.documentElement.offsetWidth;
    const balances = this.props.future.future_balances.filter(
      (list) => token2_name == list.tokenName
    );
    return (
      <div className={classes.financeBg}>
        {/* {width >= 1440 ? ( */}
        <Tabs
          value={0}
          indicatorColor="primary"
          textColor="inherit"
          className={classnames(classes.tabs, classes.financeTabs)}
        >
          <Tab
            value={0}
            label={
              this.props.intl.formatMessage({
                id: "资产",
              }) + `(${token2_name})`
            }
          />
        </Tabs>
        {/* ) :
          ""
        } */}
        <div className={classes.more} key="more">
          {this.props.layout.userinfo && this.props.layout.userinfo.userId ? (
            <i onClick={this.change(true)}>
              {this.props.intl.formatMessage({
                id: "资金划转",
              })}
            </i>
          ) : (
            ""
          )}
        </div>
        <div className={classes.finance}>
          <ul>
            <li>
              {/* <TooltipCommon
                title={this.props.intl.formatMessage({ id: "当前可用的资产" })}
                placement="top"
                mode={true}
              > */}
              <span>{this.props.intl.formatMessage({ id: "可用余额" })}</span>
              {/* </TooltipCommon> */}
              <label>
                {balances.length
                  ? helper.digits(balances[0].availableMargin, marginPrecision)
                  : this.props.layout.userinfo.userId
                  ? helper.digits("0", marginPrecision)
                  : "--"}
              </label>
            </li>
            <li>
              <TooltipCommon
                title={this.props.intl.formatMessage({ id: "当前可用的资产" })}
                placement="top"
                mode={true}
              >
                <span>
                  {this.props.intl.formatMessage({ id: "可用保证金" })}
                </span>
              </TooltipCommon>
              <label>
                {tradeable.coinAvailable && marginPrecision
                  ? helper.digits(tradeable.coinAvailable, marginPrecision)
                  : tradeable.coinAvailable || "--"}
              </label>
            </li>
            <li>
              <TooltipCommon
                title={this.props.intl.formatMessage({
                  id: "当前持仓的冻结的保证金",
                })}
                placement="top"
                mode={true}
              >
                <span>
                  {this.props.intl.formatMessage({ id: "仓位保证金" })}
                </span>
              </TooltipCommon>
              <label>
                {tradeable.margin && marginPrecision
                  ? helper.digits(tradeable.margin, marginPrecision)
                  : tradeable.margin || "--"}
              </label>
            </li>
            <li>
              <TooltipCommon
                title={this.props.intl.formatMessage({
                  id: "未成交委托的冻结的保证金",
                })}
                placement="top"
                mode={true}
              >
                <span>
                  {this.props.intl.formatMessage({ id: "委托保证金" })}
                </span>
              </TooltipCommon>
              <label>
                {tradeable.orderMargin && marginPrecision
                  ? helper.digits(tradeable.orderMargin, marginPrecision)
                  : tradeable.orderMargin || "--"}
              </label>
            </li>
            <li>
              <TooltipCommon
                title={this.props.intl.formatMessage({
                  id: "当前持仓的已平仓所产生的收益",
                })}
                placement="top"
                mode={true}
              >
                <span>
                  {this.props.intl.formatMessage({ id: "已实现盈亏" })}
                </span>
              </TooltipCommon>
              <label>
                {tradeable.realisedPnl && marginPrecision
                  ? helper.digits(tradeable.realisedPnl, marginPrecision)
                  : tradeable.realisedPnl || "--"}
              </label>
            </li>
            <li>
              <TooltipCommon
                title={this.props.intl.formatMessage({
                  id: "未平仓所产生的收益",
                })}
                placement="top"
                mode={true}
              >
                <span>
                  {this.props.intl.formatMessage({ id: "未实现盈亏" })}
                </span>
              </TooltipCommon>
              <label>
                {tradeable.unrealisedPnl && marginPrecision
                  ? helper.digits(tradeable.unrealisedPnl, marginPrecision)
                  : tradeable.unrealisedPnl || "--"}
              </label>
            </li>
          </ul>
          {/* {this.props.order_choose == 0 ? ( */}
          <div className={classes.riskAmount}>
            <TooltipCommon
              title={this.props.intl.formatMessage({
                id:
                  "对于持仓量不同的用户要求不一样的维持保证金率。持仓量越大，所需要的维持保金率越高，这样可以减少重仓用户爆仓给其他用户带来减仓事件的的风险。",
              })}
              placement="top"
              mode={true}
            >
              <span>
                {this.props.intl.formatMessage({
                  id: "风险限额",
                })}
              </span>
            </TooltipCommon>
            :
            <p>
              <label>
                {tradeableInfo.longTotal || "--"} /{" "}
                {buy_risk_info.riskLimitAmount || "--"}{" "}
                {this.props.intl.formatMessage({ id: "张" })} (
                {this.props.intl.formatMessage({ id: "多" })})
                <Iconfont
                  type="edit2"
                  size="24"
                  onClick={this.changeRisk("buy_risk")}
                />
              </label>
              <label>
                {tradeableInfo.shortTotal || "--"} /{" "}
                {sale_risk_info.riskLimitAmount || "--"}{" "}
                {this.props.intl.formatMessage({ id: "张" })} (
                {this.props.intl.formatMessage({ id: "空" })})
                <Iconfont
                  type="edit2"
                  size="24"
                  onClick={this.changeRisk("sale_risk")}
                />
              </label>
            </p>
          </div>
          {/* ) : (
            ""
          )} */}
        </div>
        <TransferModal
          open={this.state.open}
          source_type={this.props.layout.account_coin_index}
          target_type={this.props.layout.account_future_index}
          onCancel={this.change(false)}
          token_id={token2_name}
          {...layout}
          {...future}
          {...otherProps}
        />
        <ModalRisk
          open={this.props.future.modal_risk}
          {...this.props.layout}
          {...this.props.future}
          {...otherProps}
        />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(FinanceRC));
