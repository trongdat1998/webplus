import React from "react";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import styles from "./list_style";
import route_map from "../../config/route_map";

const StakingCurrentRC = (props) => {
  const { classes, productList, intl, history } = props;
  const c = classes;

  function goTrade(v) {
    // history.push(route_map.coinplusOrder + "/" + v.product_id);
    window.location.href = route_map.coinplusOrder + "/" + v.product_id;
  }
  function getBtn(obj) {
    const { status, allowPurchase } = obj;
    const text =
      status == 1
        ? lang("立即申购")
        : status == 0
        ? lang("即将开抢")
        : lang("已售罄");
    const disabled = status !== 1 || (status === 1 && !allowPurchase);
    return (
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          goTrade(obj);
        }}
        disabled={disabled}
        size="medium"
      >
        {text}
      </Button>
    );
  }
  function lang(str) {
    if (!str) return "";
    return intl.formatMessage({ id: str });
  }
  function renderCoinplus(v, i) {
    return (
      <div className={c.coinplusCell} key={"coinplus" + i}>
        <div className={c.coinplusCellName}>{v.name}</div>
        <div className={c.coinplusCellRate}>
          <dl>
            <dd>
              {v.rate}
              <em>%</em>
            </dd>
            <dd>{lang("近七日年化")}</dd>
          </dl>
        </div>
        <div className={c.coinplusCellLeft}>
          <dl>
            <dd>{v.left}</dd>
            <dd>
              {lang("剩余开放额度")}({v.unit})
            </dd>
          </dl>
        </div>
        <div className={c.coinplusBtn}>{getBtn(v)}</div>
      </div>
    );
  }
  if (!productList) return null;
  return productList.map(renderCoinplus);
};
export default withStyles(styles)(injectIntl(StakingCurrentRC));
