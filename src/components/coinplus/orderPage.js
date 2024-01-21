import React from "react";
import { injectIntl } from "react-intl";
import Order from "./Order";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./orderPage_style";
import { Fab, Button } from "@material-ui/core";
import { productTransfer } from "./transfers";
import _ from "lodash";

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      tabIndex: 0,
    };
    this.changeTab = this.changeTab.bind(this);
    this.fetchProduct = this.fetchProduct.bind(this);
  }

  componentDidMount() {
    if (!this.props.match || !this.props.match.params.product_id) return;
    const { product_id } = this.props.match.params;
    this.fetchProduct(product_id);
    this.fetchCoinplusAsset(product_id);
  }

  fetchCoinplusAsset(product_id) {
    if (!this.props.userinfo || !this.props.userinfo.userId) return;
    this.props.dispatch({
      type: "coinplus/getCoinplusAsset",
      payload: {
        productId: product_id,
      },
    });
  }
  fetchProduct(product_id) {
    this.props.dispatch({
      type: "coinplus/getProductDetail",
      method: "get",
      payload: {
        id: product_id,
        timer: 2000,
      },
    });
  }

  lang(str) {
    if (!str) return "";
    return this.props.intl.formatMessage({ id: str });
  }

  changeTab(tabIndex) {
    this.setState({ tabIndex });
  }

  render() {
    if (!this.props.product) return <div>{this.lang("未找到该产品")}</div>;
    const tab1 = this.lang("交易规则");
    const tab2 = this.lang("常见问题");
    const c = this.props.classes;
    const { tabIndex } = this.state;
    let { product, wallet, userLastLimit, userBalance } = this.props;
    const { classes, ...otherProps } = this.props;
    product = productTransfer({
      ...product,
      ...wallet,
      userLastLimit,
      userBalance,
    });
    return (
      <div className={c.container}>
        <div className={classnames(c.screenWidth, c.screenWidthBorder)}>
          <h2 className={classnames(c.content, c.title)}>{product.name}</h2>
        </div>
        <div className={classnames(c.screenWidth)}>
          <div className={c.content}>
            <div className={c.orderInfo}>
              <div className={c.infos}>
                <div className={c.info}>
                  <dl>
                    <dd className={c.highLight}>
                      {product.rate}
                      <em>%</em>
                    </dd>
                    <dd>{this.lang("近七日年化")}</dd>
                  </dl>
                  <dl>
                    <dd>
                      T+1<em>{this.lang("天")}</em>
                    </dd>
                    <dd>{this.lang("收益起始日")}</dd>
                  </dl>
                  <dl>
                    <dd>
                      {product.left}
                      <em>{product.unit}</em>
                    </dd>
                    <dd>{this.lang("剩余开放额度")}</dd>
                  </dl>
                </div>
                <div className={c.labels}>
                  <Fab
                    variant="extended"
                    disableRipple={true}
                    focusRipple={false}
                  >
                    {this.lang("随买随取")}
                  </Fab>
                  <Fab
                    variant="extended"
                    disableRipple={true}
                    focusRipple={false}
                  >
                    {this.lang("按日计息")}
                  </Fab>
                  <Fab
                    variant="extended"
                    disableRipple={true}
                    focusRipple={false}
                  >
                    {this.lang("收益稳定")}
                  </Fab>
                </div>
              </div>

              <div className={c.order}>
                <Order {...otherProps} {...product} orderType="order" />
              </div>
            </div>
          </div>
        </div>
        <div className={c.borderShadow} />
        <div className={classnames(c.content, c.rules)}>
          <div className={c.tabs}>
            <div
              className={classnames(c.tab, { [c.active]: tabIndex == 0 })}
              onClick={this.changeTab.bind(null, 0)}
            >
              <Button color="inherit">{tab1}</Button>
            </div>
            <div
              className={classnames(c.tab, { [c.active]: tabIndex == 1 })}
              onClick={this.changeTab.bind(null, 1)}
            >
              <Button color="inherit">{tab2}</Button>
            </div>
          </div>

          {tabIndex === 0 && (
            <div className={c.table1}>
              <dl>
                <dt>{this.lang("发售额度")}</dt>
                <dd>
                  {this.lang(
                    "每天0:00（UTC+8）更新当日发售额度，以当天公布的额度为准，先到先得，注意提前充值。"
                  )}
                </dd>
              </dl>
              <dl>
                <dt>{this.lang("购买额度")}</dt>
                <dd>
                  {`${this.lang("每人限购")}
                  ${product.userLimit}
                  ${product.unit}
                  ${"，"}
                  ${product.orderMinTrade}
                  ${product.unit} ${this.lang("起购")}
                  ${"，"}
                  ${product.tradeScaleNumber}
                  ${product.unit}
                  ${this.lang("递增购买。")}`}
                </dd>
              </dl>
              <dl>
                <dt>{this.lang("计息规则")}</dt>
                <dd>{this.lang("T+0购买，T+1计息，T+2到账至钱包账户。")}。</dd>
              </dl>
              <dl>
                <dt>{this.lang("赎回方式")}</dt>
                <dd>
                  {this.lang("提交申请等待审核，审核通过最晚T+1到账。")}
                  <br />
                  {this.lang("提现当日不计利息。")}
                </dd>
              </dl>
              <dl>
                <dt>{this.lang("安全保障")}</dt>
                <dd>
                  {this.lang(
                    "平台将使用理财资金做杠杆借贷业务和流动性提供，不会挪作其他用途。杠杆借贷业务和流动性提供都是交易所的低风险稳定利润的业务，对小概率情况下产生的任何资金风险，都由平台负责兜底。用户的资金不会有损失。"
                  )}
                </dd>
              </dl>
              <dl>
                <dt>{this.lang("收益范围")}</dt>
                <dd>
                  {this.props.intl.formatMessage(
                    {
                      id:
                        "利率在{a}%-{b}%之间浮动，每天0:00（UTC+8）更新收益率。",
                    },
                    { a: 5, b: 6 }
                  )}
                </dd>
              </dl>
            </div>
          )}
          {tabIndex === 1 && (
            <div className={c.table2}>
              <dl>
                <dt>{this.lang("如果当日额度被抢完了，还可以申购吗？")}</dt>
                <dd>
                  {this.lang(
                    "当日发售额度抢完后，您当日无法申购，可以待第二天新额度释放再参与申购或选择申购其他数字资产增值产品。"
                  )}
                </dd>
              </dl>
              <dl>
                <dt>{this.lang("如何查询利息？")}</dt>
                <dd>
                  {this.lang(
                    "您可以到钱包账户查询利息，在钱包账户的资产不计利息收益。"
                  )}
                </dd>
              </dl>
              <dl>
                <dt>{this.lang("申购成功后，可以立即赎回吗？")}</dt>
                <dd>
                  {this.lang(
                    "您可以随时赎回资产，只需要选择申请赎回的金额即可。"
                  )}
                </dd>
              </dl>
              <dl>
                <dt>{this.lang("如果我赎回金额，还可以继续申购吗？")}</dt>
                <dd>
                  {this.lang("可以，只要当前还有剩余额度，您可以随时申购。")}
                </dd>
              </dl>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Index));
