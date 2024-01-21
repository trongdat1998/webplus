import React from "react";
import { injectIntl, FormattedDate, FormattedHTMLMessage } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import styles from "./resultPage_style";
import { Button, Slider } from "@material-ui/core";
import { message } from "../../lib";
import route_map from "../../config/route_map";
import { resultTransfer, productTransfer } from "./transfers";
import _ from "lodash";
class Page extends React.Component {
  constructor() {
    super();
    this.goAsset = this.goAsset.bind(this);
    this.goOrder = this.goOrder.bind(this);
  }

  componentDidMount() {
    if (!this.props.match || !this.props.match.params.recordId) {
      message.error("order id not found");
    }
    const recordId = this.props.match.params.recordId;
    this.props.dispatch({
      type: "coinplus/result",
      method: "get",
      payload: {
        recordId
      },
      dispatch: this.props.dispatch
    });
  }

  shouldComponentUpdate(nextProps, nextStates) {
    return !_.isEqual(nextProps.resultData, this.props.resultData);
  }

  goAsset() {
    window.location.href = route_map.coinplus_finance;
  }
  goOrder() {
    window.location.href =
      route_map.coinplusOrder + "/" + this.props.resultData.productId;
  }

  lang(str) {
    if (!str) return "";
    return this.props.intl.formatMessage({ id: str });
  }

  render() {
    if (!this.props.resultData) {
      return <div>{this.lang("未找到该订单")}</div>;
    }
    const c = this.props.classes;
    const { resultData } = this.props;
    const { unit, step, value, type, status, startTime, week } = resultTransfer(
      resultData
    );
    const { rate } = productTransfer(resultData);
    return (
      <div className={c.container}>
        <div className={c.flex}>
          <div className={c.flexCenter}>
            {status == "success" && (
              <img
                className={c.topImg}
                src={require("../../assets/confirm.png")}
              />
            )}
            {status == "waiting" && (
              <img
                className={c.topImg}
                src={require("../../assets/waiting.png")}
              />
            )}
            <div className={c.title}>
              {type == "order" && `${this.lang("申购成功")} ${value} ${unit}`}
              {type == "redeem" &&
                status == "success" &&
                this.lang("成功赎回至钱包账户")}
              {type == "redeem" &&
                status == "waiting" &&
                this.lang("赎回申请已经提交，请耐心等待处理")}
            </div>
            <div className={c.subTitle}>
              {type == "order" ? (
                <FormattedHTMLMessage
                  id="近七日年化收益率{rate}%"
                  values={{ rate: rate }}
                  tagName="span"
                />
              ) : (
                ""
              )}
              {type == "redeem" ? (
                <FormattedHTMLMessage
                  id="赎回{amount}{unit}至钱包账户"
                  values={{
                    amount: value,
                    unit: unit
                  }}
                  tagName="span"
                />
              ) : (
                ""
              )}
            </div>
            <Slider
              className={c.slider}
              marks={type == "order" ? [{value: 0}, {value: 50}, {value: 100}] : [{value: 0}, {value: 100}]}
              value={step}
            />

            {type == "order" ? (
              <div className={c.info}>
                <dl>
                  <dd>{this.lang("申购成功")}</dd>
                  <dd>
                    <FormattedDate value={new Date(startTime)} />
                    {this.lang(week(startTime))}
                  </dd>
                </dl>
                <dl>
                  <dd>{this.lang("开始产生收益")}</dd>
                  <dd>
                    <FormattedDate
                      value={new Date(startTime + 24 * 60 * 60 * 1000)}
                    />
                    {this.lang(week(startTime + 24 * 60 * 60 * 1000))}
                  </dd>
                </dl>
                <dl>
                  <dd>{this.lang("收益到账")}</dd>
                  <dd>
                    <FormattedDate
                      value={new Date(startTime + 48 * 60 * 60 * 1000)}
                    />
                    {this.lang(week(startTime + 48 * 60 * 60 * 1000))}
                  </dd>
                </dl>
              </div>
            ) : (
              <div className={c.info}>
                <dl>
                  <dd>{this.lang("申购赎回")}</dd>
                  <dd>
                    <FormattedDate value={new Date(startTime)} />
                    {this.lang(week(startTime))}
                  </dd>
                </dl>
                <dl>
                  <dd>{this.lang("赎回成功")}</dd>
                  <dd>{this.lang("预计24小时到账")}</dd>
                </dl>
              </div>
            )}
          </div>
          <div className={c.btns}>
            <Button
              color="primary"
              variant="outlined"
              size="medium"
              onClick={this.goAsset}
            >
              {this.lang("查看资产")}
            </Button>
            {type == "order" && (
              <Button
                color="primary"
                variant="contained"
                size="medium"
                onClick={this.goOrder}
              >
                {this.lang("继续申购")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Page));
