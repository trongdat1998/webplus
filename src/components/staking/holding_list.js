import React from "react";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import styles from "./list_style";
import route_map from "../../config/route_map";

const StakingHoldingRC = (props) => {
  const { classes, productList, intl } = props;
  const c = classes;

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
            <dd>{lang("参考年华")}</dd>
          </dl>
        </div>
        <div className={c.coinplusCellLeft}>
          <dl>
            <dd>{v.left}</dd>
            <dd>
              {lang("每日最低持仓")}({v.unit})
            </dd>
          </dl>
        </div>
        <div className={c.coinplusHalfBtn}>
          <Button
            color="primary"
            variant="contained"
            size="medium"
            href={`/finance/deposit/${v.unit}`}
          >
            {lang("充值")}
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="medium"
            href={`${route_map.exchange}/${v.unit}/USDT`}
          >
            {lang("去交易")}
          </Button>
        </div>
      </div>
    );
  }
  if (!productList) return null;
  return productList.map(renderCoinplus);
};
export default withStyles(styles)(injectIntl(StakingHoldingRC));
