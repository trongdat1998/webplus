// 定期
import React, { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import styles from "./list_style";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import math from "../../utils/mathjs";

const StakingPeriodicRC = (props) => {
  const { classes, productList, intl, list, type, history } = props;
  const c = classes;
  function goTrade(v) {
    // history.push(route_map.staking_periodical + "/" + v.productId);
    window.location.href = route_map.staking_periodical + "/" + v.productId;
  }
  function getBtn(obj) {
    // const { timeToSubscribe } = obj;
    // const start = helper.deadlineFormat(timeToSubscribe);
    const text =
      obj.status == 1
        ? lang("立即申购")
        : obj.status == 0
        ? // ? `${lang("距开始")}:${start[0]}$lang("天")}${start[1]}:${
          //     start[2]
          //   }:${start[3]}`
          lang("未开始")
        : lang("本期售罄");
    return (
      <Button
        color={obj.status > 1 ? "default" : "primary"}
        variant="contained"
        onClick={() => {
          goTrade(obj);
        }}
        size="medium"
      >
        {text}
      </Button>
    );
  }
  // function handleRate(str) {
  //   const arr = str.split(",");
  //   let res = [];
  //   if (arr[1]) {
  //     res[0] = arr[0];
  //     res[1] = arr[1];
  //   } else {
  //     res[0] = arr[0];
  //   }
  //   return res;
  // }
  function lang(str) {
    if (!str) return "";
    return intl.formatMessage({ id: str });
  }
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     const project_list = [...productList];
  //     const periodicalList = list || [];
  //     if (project_list.length) {
  //       project_list.map((item) => {
  //         item.timeToSubscribe = Math.max(0, item.timeToSubscribe - 1000);
  //         if (item.timeToSubscribe == 0 && item.status == 0) {
  //           item.status = 1;
  //         }
  //         return item;
  //       });
  //       periodicalList.map((list, i) => {
  //         if (list.type == type) {
  //           list.products = project_list;
  //         }
  //       });
  //       props.dispatch({
  //         type: "coinplus/save",
  //         payload: {
  //           periodicalList,
  //         },
  //       });
  //     }
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, []);
  function renderCoinplus(item, i) {
    const c = classes;
    let precision = 0;
    if (item.perLotAmount) {
      const arr = item.perLotAmount.split(".");
      precision = arr[1] && arr[1].length ? arr[1].length : 0;
    }
    return (
      <div className={c.coinplusCell} key={"coinplus" + i}>
        <div className={c.coinplusCellName}>{item.productName}</div>
        <div className={c.coinplusCellRate}>
          <dl>
            <dd>
              {/* {(Number(handleRate(item.referenceApr || "")[0]) * 10000) /
                100}
              <em>%</em> */}
              {item.referenceApr}
              <em>%</em>
            </dd>
            <dd>{lang("约定年化")}</dd>
          </dl>
        </div>
        <div className={c.coinplusCellLeft}>
          <dl>
            <dd>
              {helper.digits(
                math
                  .chain(item.upLimitLots - item.soldLots)
                  .multiply(item.perLotAmount || 0)
                  .format({ notation: "fixed" })
                  .done(),
                precision
              )}
            </dd>
            <dd>
              {lang("剩余开放额度")}({item.tokenName})
            </dd>
          </dl>
        </div>
        <div className={c.coinplusBtn}>{getBtn(item)}</div>
      </div>
    );
  }
  if (!productList) return null;
  return productList.map(renderCoinplus);
};

export default withStyles(styles)(injectIntl(StakingPeriodicRC));
