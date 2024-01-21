// 个人等级
import React from "react";
import { injectIntl } from "react-intl";
import classnames from "classnames";
import style from "./grade_style";
import { withStyles } from "@material-ui/core/styles";
import { Iconfont } from "../../lib";
import {
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import math from "../../utils/mathjs";
import helper from "../../utils/helper";

class UserGrade extends React.Component {
  constructor() {
    super();
    this.state = {
      tab: "exchange",
      unit: "BTC",
      tabs: [],
      totalTabs: [
        {
          v: "exchange",
          n: "user.grade.exchange",
        },
        {
          v: "futures",
          n: "user.grade.futures",
        },
        // {
        //   v: "option",
        //   n: "user.grade.option",
        // },
        {
          v: "margin",
          n: "user.grade.margin",
        },
      ],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const ua = window.navigator.userAgent;
    const pathname = window.location.pathname;
    if (/iphone|android|ipad/i.test(ua)) {
      window.location.href = "/m" + pathname;
    }
    this.props.dispatch({
      type: "user/get_level_configs",
      payload: {},
    });
    if (this.props.userinfo && this.props.userinfo.userId) {
      this.props.dispatch({
        type: "user/get_level_info",
        payload: {},
      });
    }
    const functions = this.props.functions || {};
    let tabs = [];
    this.state.totalTabs.map((item, i) => {
      if (functions[item.v]) {
        tabs.push(item);
      }
    });
    this.setState({
      tabs: tabs,
    });
    this.props.dispatch({
      type: "user/getMarginTokens",
      payload: {},
    });
    this.props.dispatch({
      type: "user/getMarginLevelInterest",
      payload: {},
    });
  }

  handleChange = (event, v) => {
    this.setState({
      tab: v,
    });
  };
  handleRate(rate) {
    if (!rate) {
      return "--";
    }
    rate = (rate || 0).toString();
    if (rate == "0") {
      return "0%";
    }
    let arr = rate.split(".");
    let l = arr[1] ? arr[1].length : 0;
    let c = Math.max(Math.min(l - 2, 2), 0);
    return (rate * 100).toFixed(c) + "%";
  }
  renderCondition(conditions) {
    const { classes, intl } = this.props;
    if (conditions && conditions.length) {
      return conditions.map((item, i) => {
        return (
          <div className={classes.item} key={i}>
            {conditions.length > 1 ? (
              <h4>
                {i > 0
                  ? intl.formatMessage({
                      id: "user.grade.desc.condition.or",
                    })
                  : ""}{" "}
                {intl.formatMessage({
                  id: "user.grade.desc.condition.name",
                })}
                {i + 1}:
              </h4>
            ) : (
              ""
            )}
            {item.map((l, n) => {
              if (l.key == "kycLevel") {
                return (
                  <p key={n}>
                    {n > 0 ? "&" : ""}{" "}
                    {`${intl.formatMessage({
                      id: "user.grade.desc.condition.kyc",
                    })} >= ${l.value}`}
                  </p>
                );
              }
              if (l.key == "bindMobile") {
                return (
                  <p key={n}>
                    {n > 0 ? "&" : ""}{" "}
                    {intl.formatMessage({
                      id: "user.grade.desc.condition.bind",
                    })}
                  </p>
                );
              }
              if (l.key == "spotUserFee") {
                return (
                  <p key={n}>
                    {n > 0 ? "&" : ""} {l.maxValue ? `${l.maxValue} > ` : ""}
                    {`${intl.formatMessage({
                      id: "user.grade.desc.condition.exchangeUserFee",
                    })} >= ${l.minValue}`}
                  </p>
                );
              }
              if (l.key == "contractUserFee") {
                return (
                  <p key={n}>
                    {n > 0 ? "&" : ""} {l.maxValue ? `${l.maxValue} > ` : ""}
                    {`${intl.formatMessage({
                      id: "user.grade.desc.condition.futuresUserFee",
                    })} >= ${l.minValue}`}
                  </p>
                );
              }
              if (l.key == "30dSpotTradeAmountBtc") {
                return (
                  <p key={n}>
                    {n > 0 ? "&" : ""} {l.maxValue ? `${l.maxValue} > ` : ""}
                    {`${intl.formatMessage({
                      id: "user.grade.desc.condition.30ExchangeTradeAmountBTC",
                    })} >= ${l.minValue}`}
                  </p>
                );
              }
              if (l.key == "30dContractTradeAmountBtc") {
                return (
                  <p key={n}>
                    {n > 0 ? "&" : ""} {l.maxValue ? `${l.maxValue} > ` : ""}
                    {`${intl.formatMessage({
                      id: "user.grade.desc.condition.30FuturesTradeAmountBTC",
                    })} >= ${l.minValue}`}
                  </p>
                );
              }
              if (l.key == "balanceAmount") {
                return (
                  <p key={n}>
                    {n > 0 ? "&" : ""} {l.maxValue ? `${l.maxValue} > ` : ""}
                    {`${l.tokenId} ${intl.formatMessage({
                      id: "user.grade.desc.condition.balanceAmount",
                    })} >= ${l.minValue}`}
                  </p>
                );
              }
              if (l.key == "7dBalanceAmount") {
                return (
                  <p key={n}>
                    {n > 0 ? "&" : ""} {l.maxValue ? `${l.maxValue} > ` : ""}
                    {`${l.tokenId} ${intl.formatMessage({
                      id: "user.grade.desc.condition.7dbalanceAmount",
                    })} >= ${l.minValue}`}
                  </p>
                );
              }
              if (l.key == "30dBalanceAmount") {
                return (
                  <p key={n}>
                    {n > 0 ? "&" : ""} {l.maxValue ? `${l.maxValue} > ` : ""}
                    {`${l.tokenId} ${intl.formatMessage({
                      id: "user.grade.desc.condition.30dbalanceAmount",
                    })} >= ${l.minValue}`}
                  </p>
                );
              }
            })}
          </div>
        );
      });
    } else {
      return "--";
    }
  }
  renderCondition2(arr, key) {
    let str = "--";
    arr.forEach((el) => {
      if (key == el.key) {
        str = "≥ " + el.minValue + (el.tokenId || "BTC");
      }
    });
    return str;
  }
  render() {
    const {
      classes,
      user_level_info,
      level_configs,
      have_token_discount,
      borrowableTokens,
      marginLevelInterest,
      functions,
      intl,
    } = this.props;
    // const MakerTableMap = {
    //   exchange: "user.grade.desc.exchangeMakerRate",
    //   futures: "user.grade.desc.futuresMakerRate",
    //   option: "user.grade.desc.optionMakerRate",
    // };
    // const TakerTableMap = {
    //   exchange: "user.grade.desc.exchangeTakerRate",
    //   futures: "user.grade.desc.futuresTakerRate",
    //   option: "user.grade.desc.optionTakerRate",
    // };
    const nameMap = {
      exchange: "spot",
      futures: "contract",
      // option: "option",
    };
    let monthTrade = user_level_info.monthTradeAmountInBtc || {};
    let userConfigId =
      user_level_info.levelConfigIds && user_level_info.levelConfigIds.length
        ? user_level_info.levelConfigIds[
            user_level_info.levelConfigIds.length - 1
          ]
        : 0;
    let currentLevel = {};
    if (
      user_level_info &&
      user_level_info.levelConfigIds &&
      user_level_info.levelConfigIds.length &&
      level_configs.length
    ) {
      currentLevel =
        level_configs.find((list) => list.configId == userConfigId) || {};
    }
    return (
      <div>
        {this.props.userinfo && this.props.userinfo.userId ? (
          <div className={classes.grade}>
            <h2 className={classes.section}>
              {intl.formatMessage({ id: "user.grade.title" })}
            </h2>
            <div className={classnames(classes.section, classes.con)}>
              <div className={classes.grade_icon}>
                <img src={currentLevel.levelIcon} />
                <p>{currentLevel.levelName}</p>
              </div>
              <div className={classes.trade_info}>
                <p>
                  {intl.formatMessage({
                    id: "user.grade.monthTrade.title",
                  })}
                </p>
                <ul>
                  {functions["exchange"] ? (
                    <li>
                      <label>
                        {intl.formatMessage({
                          id: "user.grade.exchange",
                        })}
                      </label>
                      <span>
                        {monthTrade["1"] || 0} {this.state.unit}
                      </span>
                    </li>
                  ) : (
                    ""
                  )}
                  {functions["futures"] ? (
                    <li>
                      <label>
                        {intl.formatMessage({
                          id: "user.grade.futures",
                        })}
                      </label>
                      <span>
                        {monthTrade["3"] || 0} {this.state.unit}
                      </span>
                    </li>
                  ) : (
                    ""
                  )}
                  {/* {functions["option"] ? (
                    <li>
                      <label>
                        {intl.formatMessage({
                          id: "user.grade.option",
                        })}
                      </label>
                      <span>
                        {monthTrade["2"] || 0} {this.state.unit}
                      </span>
                    </li>
                  ) : (
                    ""
                  )} */}
                </ul>
              </div>
              <div className={classes.fee_info}>
                <p>
                  {/* <label>
                    {intl.formatMessage({
                      id: "user.grade.withdrawLimit",
                    })}
                  </label>
                  <span>
                    <em>{user_level_info.withdrawUpperLimitInBtc || 0}</em>
                    {this.state.unit}
                  </span> */}
                </p>
                <ul>
                  {["exchange", "futures"].map((item, i) => {
                    return functions[item] ? (
                      <li key={i}>
                        <label>
                          {intl.formatMessage({
                            id: "user.grade.fee." + item,
                          })}
                        </label>
                        <span>
                          {intl.formatMessage({
                            id: "user.grade.fee.buyMaker",
                          })}
                          <em>
                            {this.handleRate(
                              user_level_info[
                                nameMap[item] + "BuyMakerDiscount"
                              ]
                            )}
                          </em>
                        </span>
                        <span>
                          {intl.formatMessage({
                            id: "user.grade.fee.buyTaker",
                          })}
                          <em>
                            {this.handleRate(
                              user_level_info[
                                nameMap[item] + "BuyTakerDiscount"
                              ]
                            )}
                          </em>
                        </span>
                        <span></span>
                        <span></span>
                      </li>
                    ) : (
                      ""
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div
          className={classnames(
            classes.section,
            classes.desc,
            this.props.userinfo && this.props.userinfo.userId ? "" : "unlogin"
          )}
        >
          <h2>{intl.formatMessage({ id: "user.grade.desc.title" })}</h2>
          <div className={classes.desc_con}>
            <Tabs
              value={this.state.tab}
              onChange={this.handleChange}
              aria-label="desc"
              indicatorColor="primary"
              textColor="primary"
              className={classes.tabs}
              classes={{
                indicator: classes.indicator,
              }}
            >
              {this.state.tabs.map((item, i) => {
                return (
                  <Tab
                    key={i}
                    value={item.v}
                    label={intl.formatMessage({ id: item.n })}
                    classes={{
                      root: classes.tab,
                    }}
                  />
                );
              })}
            </Tabs>
            {this.state.tab !== "margin" ? (
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      {intl.formatMessage({
                        id: "user.grade.desc.name",
                      })}
                    </TableCell>
                    <TableCell align="center">
                      <p className={classes.up}>
                        {intl.formatMessage({
                          id: "user.grade.desc.condition",
                        })}
                      </p>
                      <div className={classnames("whole", classes.down)}>
                        <div className={classes.way}>
                          <p className="whole">
                            {intl.formatMessage({ id: "user.grade.desc.way1" })}
                          </p>
                          <p className="whole">
                            <em>
                              {intl.formatMessage({
                                id: "user.grade.desc.balanceAmount",
                              })}
                            </em>
                            <em>
                              {intl.formatMessage({
                                id: "user.grade.desc.30dSpotTradeAmountBtc",
                              })}
                            </em>
                          </p>
                        </div>
                        <div className={classes.way}>
                          <p className="whole">
                            {intl.formatMessage({ id: "user.grade.desc.way2" })}
                          </p>
                          <p className="whole">
                            <em>
                              {intl.formatMessage({
                                id: "user.grade.desc.balanceAmount",
                              })}
                            </em>
                            <em>
                              {intl.formatMessage({
                                id: "user.grade.desc.30dContractTradeAmountBtc",
                              })}
                            </em>
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    {functions["exchange"] && this.state.tab == "exchange" ? (
                      <TableCell align="center">
                        <p className={classes.up}>
                          {intl.formatMessage({
                            id: "user.grade.desc.exchangeDiscount",
                          })}
                        </p>
                        <div className={classnames("whole", classes.down)}>
                          <div className={classes.way}>
                            <p className="whole">--</p>
                            <p className="whole">
                              <em>Maker</em>
                              <em>Taker</em>
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    ) : (
                      ""
                    )}
                    {functions["exchange"] &&
                    this.state.tab == "exchange" &&
                    have_token_discount &&
                    have_token_discount["spotSwitch"] ? (
                      <TableCell align="center">
                        <p className={classes.up}>
                          {intl.formatMessage({
                            id: "user.grade.desc.exchangeDiscount",
                          })}
                        </p>
                        <div className={classnames("whole", classes.down)}>
                          <div className={classes.way}>
                            <p className={classnames("whole", classes.red)}>
                              {intl.formatMessage(
                                {
                                  id: "user.grade.desc.holding{name}",
                                },
                                {
                                  name: have_token_discount["tokenName"],
                                }
                              )}
                              {" ≥ "}
                              {have_token_discount["number"]}
                            </p>
                            <p className="whole">
                              <em>Maker</em>
                              <em>Taker</em>
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    ) : (
                      ""
                    )}
                    {functions["futures"] && this.state.tab == "futures" ? (
                      <TableCell align="center">
                        <p className={classes.up}>
                          {intl.formatMessage({
                            id: "user.grade.desc.futuresDiscount",
                          })}
                        </p>
                        <div className={classnames("whole", classes.down)}>
                          <div className={classes.way}>
                            <p className="whole">--</p>
                            <p className="whole">
                              <em>Maker</em>
                              <em>Taker</em>
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    ) : (
                      ""
                    )}
                    {functions["futures"] &&
                    this.state.tab == "futures" &&
                    have_token_discount &&
                    have_token_discount["contractSwitch"] ? (
                      <TableCell align="center">
                        <p className={classes.up}>
                          {intl.formatMessage({
                            id: "user.grade.desc.futuresDiscount",
                          })}
                        </p>
                        <div className={classnames("whole", classes.down)}>
                          <div className={classes.way}>
                            <p className={classnames("whole", classes.red)}>
                              {intl.formatMessage(
                                {
                                  id: "user.grade.desc.holding{name}",
                                },
                                {
                                  name: have_token_discount["tokenName"],
                                }
                              )}
                              {" ≥ "}
                              {have_token_discount["number"]}
                            </p>
                            <p className="whole">
                              <em>Maker</em>
                              <em>Taker</em>
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    ) : (
                      ""
                    )}
                    {/* <TableCell align="center">
                      {intl.formatMessage({
                        id: "user.grade.desc.withdrawLimit",
                      })}
                      <p>{this.state.unit}</p>
                    </TableCell>
                    <TableCell align="center">
                      {intl.formatMessage({
                        id: "user.grade.desc.otcLimit",
                      })}
                    </TableCell> */}
                    {functions["invite"] ? (
                      <TableCell align="center">
                        {intl.formatMessage({
                          id: "user.grade.desc.inviteBonusStatus",
                        })}
                      </TableCell>
                    ) : (
                      ""
                    )}
                  </TableRow>
                </TableHead>
                {level_configs.length ? (
                  <TableBody>
                    {level_configs.map((item, i) => {
                      return (
                        <TableRow
                          className={
                            item.configId == userConfigId ? "selected" : ""
                          }
                          key={i}
                        >
                          <TableCell align="center">
                            {item.configId == userConfigId ? (
                              <Iconfont type="levelcheck" size="24" />
                            ) : (
                              ""
                            )}
                            <p>{item.levelName}</p>
                          </TableCell>
                          <TableCell align="center">
                            {/* {this.renderCondition(item.conditions)} */}
                            <span className="whole">
                              <em>
                                {this.renderCondition2(
                                  item.conditions && item.conditions[0]
                                    ? item.conditions[0]
                                    : [],
                                  "balanceAmount"
                                )}
                              </em>
                              <em>
                                {this.renderCondition2(
                                  item.conditions && item.conditions[0]
                                    ? item.conditions[0]
                                    : [],
                                  "30dSpotTradeAmountBtc"
                                )}
                              </em>
                              <em>
                                {this.renderCondition2(
                                  item.conditions && item.conditions[1]
                                    ? item.conditions[1]
                                    : [],
                                  "balanceAmount"
                                )}
                              </em>
                              <em>
                                {this.renderCondition2(
                                  item.conditions && item.conditions[1]
                                    ? item.conditions[1]
                                    : [],
                                  "30dContractTradeAmountBtc"
                                )}
                              </em>
                            </span>
                          </TableCell>
                          {functions["exchange"] &&
                          this.state.tab == "exchange" ? (
                            <TableCell align="center">
                              <span className="whole">
                                <em>
                                  {this.handleRate(
                                    item["spotBuyMakerDiscount"]
                                  )}
                                </em>
                                <em>
                                  {this.handleRate(
                                    item["spotBuyTakerDiscount"]
                                  )}
                                </em>
                              </span>
                            </TableCell>
                          ) : (
                            ""
                          )}
                          {functions["exchange"] &&
                          this.state.tab == "exchange" &&
                          have_token_discount &&
                          have_token_discount["spotSwitch"] ? (
                            <TableCell align="center">
                              <span className="whole">
                                <em>
                                  {item["spotBuyMakerDiscount"] < 0
                                    ? this.handleRate(
                                        item["spotBuyMakerDiscount"]
                                      )
                                    : Math.ceil(
                                        helper.digits(
                                          item["spotBuyMakerDiscount"] *
                                            have_token_discount["discount"] *
                                            100,
                                          1
                                        )
                                      ) + "%"}
                                </em>
                                <em>
                                  {item["spotBuyTakerDiscount"] < 0
                                    ? this.handleRate(
                                        item["spotBuyTakerDiscount"]
                                      )
                                    : Math.ceil(
                                        helper.digits(
                                          item["spotBuyTakerDiscount"] *
                                            have_token_discount["discount"] *
                                            100,
                                          1
                                        )
                                      ) + "%"}
                                </em>
                              </span>
                            </TableCell>
                          ) : (
                            ""
                          )}
                          {functions["futures"] &&
                          this.state.tab == "futures" ? (
                            <TableCell align="center">
                              <span className="whole">
                                <em>
                                  {this.handleRate(
                                    item["contractBuyMakerDiscount"]
                                  )}
                                </em>
                                <em>
                                  {this.handleRate(
                                    item["contractBuyTakerDiscount"]
                                  )}
                                </em>
                              </span>
                            </TableCell>
                          ) : (
                            ""
                          )}
                          {functions["futures"] &&
                          this.state.tab == "futures" &&
                          have_token_discount &&
                          have_token_discount["contractSwitch"] ? (
                            <TableCell align="center">
                              <span className="whole">
                                <em>
                                  {item["contractBuyMakerDiscount"] < 0
                                    ? this.handleRate(
                                        item["contractBuyMakerDiscount"]
                                      )
                                    : Math.ceil(
                                        helper.digits(
                                          item["contractBuyMakerDiscount"] *
                                            have_token_discount["discount"] *
                                            100,
                                          1
                                        )
                                      ) + "%"}
                                </em>
                                <em>
                                  {item["contractBuyTakerDiscount"] < 0
                                    ? this.handleRate(
                                        item["contractBuyTakerDiscount"]
                                      )
                                    : Math.ceil(
                                        helper.digits(
                                          item["contractBuyTakerDiscount"] *
                                            have_token_discount["discount"] *
                                            100,
                                          1
                                        )
                                      ) + "%"}
                                </em>
                              </span>
                            </TableCell>
                          ) : (
                            ""
                          )}
                          {/* <TableCell align="center">
                            {item.withdrawUpperLimitInBtc}
                          </TableCell>
                          <TableCell
                            align="center"
                            className={
                              item.cancelOtc24hWithdrawLimit ? "" : "error"
                            }
                          >
                            <Iconfont
                              type={
                                item.cancelOtc24hWithdrawLimit
                                  ? "finished1"
                                  : "cancelled1"
                              }
                              size={24}
                            />
                            <br />
                            <span>
                              {intl.formatMessage({
                                id: item.cancelOtc24hWithdrawLimit
                                  ? "user.grade.desc.noLimit"
                                  : "user.grade.desc.limit",
                              })}
                            </span>
                          </TableCell> */}
                          {functions["invite"] ? (
                            <TableCell
                              align="center"
                              className={item.inviteBonusStatus ? "" : "error"}
                            >
                              <Iconfont
                                type={
                                  item.inviteBonusStatus
                                    ? "finished1"
                                    : "cancelled1"
                                }
                                size={24}
                              />
                              <br />
                              <span>
                                {intl.formatMessage({
                                  id: item.inviteBonusStatus
                                    ? "user.grade.desc.support"
                                    : "user.grade.desc.unsupport",
                                })}
                              </span>
                            </TableCell>
                          ) : (
                            ""
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : (
                  <TableBody></TableBody>
                )}
              </Table>
            ) : (
              [
                <div className={classes.rate_table} key="table">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">
                          <div className={classes.mask}>
                            <div>{intl.formatMessage({ id: "等级" })}</div>
                            <div>{intl.formatMessage({ id: "币种" })}</div>
                          </div>
                        </TableCell>
                        {borrowableTokens && borrowableTokens.length ? (
                          borrowableTokens.map((item, index) => {
                            return (
                              <TableCell key={index} align="center">
                                <div>{item.tokenId}</div>
                              </TableCell>
                            );
                          })
                        ) : (
                          <TableCell align="center"></TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    {level_configs.length ? (
                      <TableBody>
                        {level_configs.map((item, i) => {
                          const levelInterestInfo = marginLevelInterest[
                            item.configId
                          ]
                            ? marginLevelInterest[item.configId]
                            : [];
                          return (
                            <TableRow key={i}>
                              <TableCell align="center">
                                <div>{item.levelName}</div>
                              </TableCell>
                              {borrowableTokens && borrowableTokens.length ? (
                                borrowableTokens.map((token, index) => {
                                  const tokenInterestInfo = levelInterestInfo.filter(
                                    (list) => list.tokenId == token.tokenId
                                  )[0];
                                  const showInterest =
                                    tokenInterestInfo &&
                                    tokenInterestInfo["showInterest"]
                                      ? helper.digits(
                                          math
                                            .chain(
                                              math.bignumber(
                                                tokenInterestInfo[
                                                  "showInterest"
                                                ] < 0
                                                  ? "0"
                                                  : tokenInterestInfo[
                                                      "showInterest"
                                                    ]
                                              )
                                            )
                                            .multiply(100)
                                            .format({ notation: "fixed" })
                                            .done(),
                                          4
                                        ) + "%"
                                      : "--";
                                  return (
                                    <TableCell key={index} align="center">
                                      <div>{showInterest}</div>
                                    </TableCell>
                                  );
                                })
                              ) : (
                                <TableCell align="center"></TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    ) : (
                      ""
                    )}
                  </Table>
                </div>,
                have_token_discount && have_token_discount["marginSwitch"] ? (
                  <p className={classes.tip} key="tip">
                    {intl.formatMessage(
                      {
                        id: "{token}user.grade.margin.tip{num}{rate}",
                      },
                      {
                        token: have_token_discount["tokenName"],
                        num: have_token_discount["number"],
                        rate:
                          Number(
                            helper.digits(
                              (have_token_discount["discount"] * 10000) / 100,
                              0
                            )
                          ) + "%",
                      }
                    )}
                  </p>
                ) : (
                  ""
                ),
              ]
            )}
          </div>
          <h3>{intl.formatMessage({ id: "user.grade.rule.title" })}</h3>
          <div
            className={classes.about}
            dangerouslySetInnerHTML={{
              __html: this.props.levelSettings.summary
                ? this.props.levelSettings.summary
                : "",
            }}
          ></div>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(UserGrade));
