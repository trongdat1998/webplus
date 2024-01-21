import React from "react";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import styles from "./coinplusList_style";
import route_map from "../../config/route_map";

class Page extends React.Component {
  constructor() {
    super();
    this.renderCoinplus = this.renderCoinplus.bind(this);
    this.goTrade = this.goTrade.bind(this);
  }

  goTrade(v) {
    const { history } = this.props;
    window.location.href = route_map.coinplusOrder + "/" + v.product_id;
  }

  shouldComponentUpdate(prevProps, prevState) {
    return (
      JSON.stringify(prevProps.productList) !==
      JSON.stringify(this.props.productList)
    );
  }

  getBtn(obj) {
    const { status, allowPurchase } = obj;
    const text =
      status == 1
        ? this.lang("立即申购")
        : status == 0
        ? this.lang("即将开抢")
        : this.lang("已售罄");
    const disabled = status !== 1 || (status === 1 && !allowPurchase);
    return (
      <Button
        color="primary"
        variant="contained"
        onClick={this.goTrade.bind(null, obj)}
        disabled={disabled}
        size="medium"
      >
        {text}
      </Button>
    );
  }

  lang(str) {
    if (!str) return "";
    return this.props.intl.formatMessage({ id: str });
  }

  renderCoinplus(v, i) {
    const c = this.props.classes;
    return (
      <div className={c.coinplusCell} key={"coinplus" + i}>
        <div className={c.coinplusCellName}>{v.name}</div>
        <div className={c.coinplusCellRate}>
          <dl>
            <dd>
              {v.rate}
              <em>%</em>
            </dd>
            <dd>{this.lang("近七日年化")}</dd>
          </dl>
        </div>
        <div className={c.coinplusCellLeft}>
          <dl>
            <dd>{v.left}</dd>
            <dd>
              {this.lang("剩余开放额度")}({v.unit})
            </dd>
          </dl>
        </div>
        <div className={c.coinplusBtn}>{this.getBtn(v)}</div>
      </div>
    );
  }

  render() {
    const c = this.props.classes;
    const list = this.props.productList;
    if (!list) return null;
    return list.map(this.renderCoinplus);
  }
}

export default withStyles(styles)(injectIntl(Page));
