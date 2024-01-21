import React from "react";
import { injectIntl } from "react-intl";
import Order from "./Order";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./orderPage_style";
import { Fab } from "@material-ui/core";
import BackIcon from "@material-ui/icons/ChevronLeft";
import { productTransfer } from "./transfers";

class Page extends React.Component {
  constructor() {
    super();
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    if (!this.props.userinfo || !this.props.userinfo.userId) return;
    if (!this.props.match || !this.props.match.params.product_id) return;
    const product_id = this.props.match.params.product_id;
    this.props.dispatch({
      type: "coinplus/getProductDetail",
      method: "get",
      payload: {
        id: product_id,
      },
    });
    this.props.dispatch({
      type: "coinplus/getCoinplusAsset",
      method: "get",
      payload: {
        productId: product_id,
      },
    });
  }

  lang(str) {
    if (!str) return "";
    return this.props.intl.formatMessage({ id: str });
  }

  goBack() {
    this.props.history.go(-1);
  }

  render() {
    let { product, wallet } = this.props;
    if (!product) return <div>{this.lang("未找到该产品")}</div>;

    product = productTransfer({ ...product, wallet });
    const c = this.props.classes;
    return (
      <div className={classnames(c.container, c.screenWidth)}>
        <div className={classnames(c.formHead, c.content)}>
          {/* <Fab
            color="inherit"
            size="small"
            className={c.backIcon}
            onClick={this.goBack}
          >
            <BackIcon />
          </Fab> */}
          <h2>{this.lang("赎回")}</h2>
        </div>
        <h3 className={classnames(c.content, c.formTitle)}>{product.name}</h3>
        <div className={classnames(c.content, c.redeemOrder)}>
          <Order {...this.props} {...product} orderType="redeem" />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Page));
