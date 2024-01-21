// 理财首页
import React, { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import CurrentList from "./current_list";
import PeriodicList from "./periodic_list";
import HoldingList from "./holding_list";
import { withStyles } from "@material-ui/core/styles";
import styles from "./index_style";
import { productTransfer } from "../coinplus/transfers";

const StakingIndexRC = (props) => {
  const {
    classes,
    intl,
    coinplusIndexProductList,
    periodicalList,
    stakingSettings,
    index_config,
    dispatch,
    ...otherProps
  } = props;
  const c = classes;
  const title = {
    0: { name: "定期项目", index: "periodic" },
    1: { name: "活期项目", index: "current" },
    2: { name: "锁仓项目", index: "locked" },
  };
  function lang(str) {
    if (!str) return "";
    return intl.formatMessage({ id: str });
  }
  function scrollToAnchor(name) {
    if (name) {
      let anchorElement = document.getElementById(name);
      let top = anchorElement.offsetTop;
      if (anchorElement) {
        anchorElement.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }
  }
  function getList() {
    props.dispatch({
      type: "coinplus/getCoinplusList",
      payload: {},
    });
    props.dispatch({
      type: "coinplus/getFinancialList",
      payload: {},
    });
  }
  useEffect(() => {
    getList();
    const timer = setInterval(() => {
      getList();
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={c.container}>
      <div
        className={c.banner}
        style={{
          backgroundColor: !index_config.orgId
            ? ""
            : index_config.orgId == "6002"
            ? "#1E212E"
            : stakingSettings.webBackgroundColor,
        }}
      >
        {/* {index_config.orgId == "6002" ? (
          <div className={c.bannerMask}>
            <video
              src={require("../../assets/BGvideo.mp4")}
              autoplay="autoplay"
              height="auto"
              width="100%"
              loop="loop"
              muted="muted"
            ></video>
          </div>
        ) : ( */}
        <div className={c.pic}>
          <div
            style={{
              backgroundImage: !index_config.orgId
                ? ""
                : `url(${stakingSettings.webBackground})`,
            }}
          ></div>
        </div>
        {/* )} */}
        <div className={c.absolute}>
          <div
            className={c.bannerContent}
            // style={{
            //   backgroundImage:
            //     index_config.orgId == "6002"
            //       ? "radial-gradient(circle farthest-corner at 70% 50%, rgba(35, 37, 54, 0) 22%, #1e212e 44%)"
            //       : "none",
            // }}
          >
            <h2>{stakingSettings.webTitle || ""}</h2>
            <p>{stakingSettings.webDescription || ""}</p>
          </div>
        </div>
      </div>
      <div
        className={c.listNav}
        id={
          periodicalList && periodicalList.length
            ? title[0]["index"]
            : "current1"
        }
      >
        <ul>
          {periodicalList && periodicalList.length
            ? periodicalList.map((item, i) => {
                return (
                  <li
                    onClick={() =>
                      scrollToAnchor(
                        title[item.type] ? title[item.type]["index"] : ""
                      )
                    }
                    key={i}
                  >
                    {title[item.type] ? lang(title[item.type]["name"]) : ""}
                  </li>
                );
              })
            : ""}
          {coinplusIndexProductList && coinplusIndexProductList.length ? (
            <li onClick={() => scrollToAnchor("current1")}>
              {lang("活期项目")}
            </li>
          ) : (
            ""
          )}
          {/* <li onClick={() => scrollToAnchor("holding")}>
          {lang("持币生息")}
        </li> */}
        </ul>
      </div>
      <div className={c.list}>
        {periodicalList && periodicalList.length
          ? periodicalList.map((item, i) => {
              return (
                <div
                  className={c.coinplusList}
                  key={i}
                  id={title[item.type] ? title[item.type]["index"] : ""}
                >
                  <h2>
                    {title[item.type] ? lang(title[item.type]["name"]) : ""}
                  </h2>
                  <PeriodicList
                    {...otherProps}
                    list={periodicalList}
                    type={item.type}
                    dispatch={dispatch}
                    productList={item.products || []}
                  />
                </div>
              );
            })
          : ""}
        {coinplusIndexProductList && coinplusIndexProductList.length ? (
          <div
            className={c.coinplusList}
            id={periodicalList && periodicalList.length ? "current1" : ""}
          >
            <h2>{lang("活期项目")}</h2>
            <CurrentList
              {...otherProps}
              dispatch={dispatch}
              productList={coinplusIndexProductList.map(productTransfer)}
            />
          </div>
        ) : (
          ""
        )}
        {/* {coinplusIndexProductList && coinplusIndexProductList.length ? (
          <div className={c.coinplusList} id="holding">
            <h2>{lang("持币生息")}</h2>
            <HoldingList
              {...otherProps}
              productList={coinplusIndexProductList.map(productTransfer)}
            />
          </div>
        ) : (
          ""
        )} */}
      </div>
    </div>
  );
};

export default withStyles(styles)(injectIntl(StakingIndexRC));
