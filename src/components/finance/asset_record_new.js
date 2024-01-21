// 资产记录
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Table, Iconfont, message } from "../../lib";
import { injectIntl } from "react-intl";
import moment from "moment";
import styles from "./style";
import helper from "../../utils/helper";
import { parse } from "search-params";
import {
  Tabs,
  Tab,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import Nav from "./nav";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
let search = window.location.search.replace("?", "");
search = parse(search);
const tabValue = search.tabValue
  ? search.tabValue
  : window.localStorage.TabValue
  ? window.localStorage.TabValue
  : "rechange";
class Record extends React.Component {
  constructor() {
    super();
    this.state = {
      open: {},
      TabValue: tabValue,
      loading: null,
      loading2: null,
      data: null,
      i: -1,
    };
    this.getMore = this.getMore.bind(this);
  }
  componentDidMount() {
    // 充币记录
    this.getMore("rechange", true);
    // 提币记录
    this.getMore("cash", true);
    // 其他
    this.getMore("other", true);
    // 币多多
    this.getMore("coinplus", true);
    // 永续合约交易
    this.getMore("future", true);
    // 杠杆记录
    this.getMore("lever", true);
    // 定期
    this.getMore("staking", true);
  }
  // 获取更多
  getMore(column, firstReq) {
    this.props.dispatch({
      type: "finance/getOrders",
      payload: {
        column,
        firstReq,
      },
    });
  }
  open = (record, i, t, e) => {
    const { classes } = this.props;
    let open = Object.assign({}, this.state.open);
    let target = e.target;
    if (target.nodeName == "I") {
      target = target.parentNode;
    }
    const div = target.parentNode.parentNode.parentNode;
    if (open[i]) {
      open[i] = false;
      this.setState({
        open,
      });
      const ul = document.querySelector("#ul_" + i);
      if (ul) {
        ul.parentNode.removeChild(ul);
      }
      return;
    } else {
      open[i] = true;
      this.setState({
        open,
      });
      const ul = div.querySelector("ul");
      if (!ul) {
        const element = document.createElement("ul");
        const a = record.isInternalTransfer
          ? `${this.props.intl.formatMessage({ id: "钱包内部转账" })}`
          : `<a href="${
              record.txidUrl || ""
            }" target="_blank"  rel="noopener noreferrer">
            ${record.txid}
          </a>`;
        const b = record.kernelId
          ? `<li><label>Kernel ID:</label><em>${
              record.kernelId || ""
            }</em></li>`
          : "";
        element.id = "ul_" + i;
        element.className = classes.order_ul;
        element.innerHTML = `<li>
        <label>
          Txid:
        </label>
        <em>
        ${a}
        </em>
      </li>
      <li style="display:${t ? "none" : "flex"}">
      <label>
          ${this.props.intl.formatMessage({ id: "手续费" })}:
        </label>
        <em>${record.fee || ""}</em>
      </li>
      <li>
        <label>
          ${this.props.intl.formatMessage({ id: "钱包处理时间" })}:
        </label>
        <em>
          ${
            record.walletHandleTime
              ? moment
                  .utc(Number(record.walletHandleTime))
                  .local()
                  .format("YYYY-MM-DD HH:mm:ss")
              : ""
          }
        </em>
      </li>
      <li style="display: ${
        t && record.isInternalTransfer && record.fromAddress ? "flex" : "none"
      }">
        <label>
        Account ID:
        </label>
        <em>
        ${
          t && record.isInternalTransfer && record.fromAddress
            ? record.fromAddress
            : ""
        }
        </em>
      </li>${b}`;
        const parent = div.parentNode;
        const divs = parent.querySelectorAll(".item");
        if (i == divs.length - 1) {
          parent.appendChild(element);
        } else {
          parent.insertBefore(element, divs[i + 1]);
        }
      }
    }
  };
  handleChange = (event, value) => {
    this.setState({ TabValue: value });
    window.localStorage.setItem("TabValue", value);
    this.clearMoreDetials();
  };
  clearMoreDetials = () => {
    this.setState({
      open: {},
    });
  };
  close = () => {
    this.setState({
      loading: false,
      loading2: null,
      data: null,
      i: -1,
    });
  };
  openDialog = (data, i) => () => {
    this.setState({
      loading: data.orderId,
      data: data,
      i: i,
    });
  };
  cancel_order = () => {
    if (this.state.loading2 == this.state.data.orderId) {
      return;
    }
    this.setState(
      {
        loading2: this.state.data.orderId,
      },
      () => {
        this.props.dispatch({
          type: "finance/cancelCash",
          payload: {
            order_id: this.state.data.orderId,
          },
          success: (res) => {
            let cashLog = [...this.props.cashLog];
            cashLog[this.state.i] = {
              ...cashLog[this.state.i],
              statusDesc: res.data.statusDesc,
              canBeCancelled: false,
            };
            this.props.dispatch({
              type: "finance/save",
              payload: {
                cashLog,
              },
            });
            this.close();
          },
          fail: (res) => {
            this.close();
            res && res.msg && message.error(res.msg);
          },
        });
      }
    );
  };
  render() {
    const { classes, functions } = this.props;
    const TabValue = this.state.TabValue || "rechange";
    const typeMap = { 0: "申购", 1: "赎回", 2: "收益" }; // 订单类型
    // type=0时，status=1:申购成功，其余状态显示：申购中；type=1时，status=1:赎回成功 其余状态显示：赎回中；type=2时，status=1:发放成功 其余状态显示：待发放
    const statusMap = {
      0: { 0: "申购中", 1: "申购成功" },
      1: { 0: "赎回中", 1: "赎回成功" },
      2: { 0: "待发放", 1: "发放成功" },
    };
    // 充币记录
    const column_current = [
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "tokenId",
        render: (text, record) => {
          return (
            <span className={classes.tokenIcon}>
              {this.props.tokens[text] && this.props.tokens[text]["iconUrl"] ? (
                <img src={this.props.tokens[text]["iconUrl"]} />
              ) : (
                ""
              )}
              {record.tokenName}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "time",
        render: (text, record) => {
          return (
            <span>
              {moment
                .utc(Number(record.time))
                .local()
                .format("YYYY-MM-DD HH:mm:ss")}
            </span>
          );
        },
      },

      {
        title: this.props.intl.formatMessage({
          id: "金额数量",
        }),
        key: "quantity",
        render: (text, record) => {
          return <span>+{helper.digits(text, 8)}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "地址",
        }),
        key: "address",
        render: (text, record) => {
          if (record.addressExt) {
            return (
              <div>
                <span style={{ margin: "0 20px 0 0", display: "inline" }}>
                  {text}
                </span>
                <span style={{ display: "inline" }}>
                  Tag:{record.addressExt}
                </span>
              </div>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "进度",
        }),
        key: "confirmNum",
        render: (text, record) => {
          return (
            <span>
              {text}/{record.requiredConfirmNum}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "状态",
        }),
        key: "statusDesc",
        render: (text, record, i) => {
          return (
            <React.Fragment>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 30px 0 0",
                }}
              >
                {text}
                <span
                  style={{
                    float: "right",
                    cursor: "pointer",
                    color: "#2F7DF6",
                  }}
                  onClick={this.open.bind(this, record, i, 1)}
                >
                  {this.props.intl.formatMessage({ id: "详情" })}
                  {this.state.open[i] ? (
                    <Iconfont
                      type="arrowUp"
                      style={{ fontSize: "18px", margin: "-3px 0 0" }}
                    />
                  ) : (
                    <Iconfont
                      type="arrowDown"
                      style={{ fontSize: "18px", margin: "-3px 0 0" }}
                    />
                  )}
                </span>
              </p>
            </React.Fragment>
          );
        },
      },
    ];
    // 提币记录
    const column_history = [
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "tokenId",
        render: (text, record) => {
          return (
            <span className={classes.tokenIcon}>
              {this.props.tokens[text] && this.props.tokens[text]["iconUrl"] ? (
                <img src={this.props.tokens[text]["iconUrl"]} />
              ) : (
                ""
              )}
              {record.tokenName}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "time",
        render: (text, record) => {
          return (
            <span>
              {moment
                .utc(Number(record.time))
                .local()
                .format("YYYY-MM-DD HH:mm:ss")}
            </span>
          );
        },
      },

      {
        title: this.props.intl.formatMessage({
          id: "金额数量",
        }),
        key: "quantity",
        render: (text, record) => {
          return <span>-{helper.digits(text, 8)}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "地址",
        }),
        key: "address",
        render: (text, record) => {
          return record.addressExt ? (
            <React.Fragment>
              <span>{text}</span>
              <span style={{ margin: "0 0 0 40px" }}>
                Tag:{record.addressExt}
              </span>
            </React.Fragment>
          ) : (
            text
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "状态",
        }),
        key: "statusDesc",
      },
      {
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        key: "statusCode",
        render: (text, record, i) => {
          return (
            <React.Fragment>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {record.canBeCancelled ? (
                  this.state.loading == record.orderId ? (
                    <Button disabled>
                      <CircularProgress size={20} color="primary" />
                    </Button>
                  ) : (
                    <Button
                      onClick={this.openDialog(record, i)}
                      color="primary"
                      variant="outlined"
                    >
                      {this.props.intl.formatMessage({ id: "取消" })}
                    </Button>
                  )
                ) : (
                  ""
                )}
                <span
                  style={{
                    float: "right",
                    cursor: "pointer",
                    color: "#2F7DF6",
                    margin: "0 0 0 30px",
                  }}
                  onClick={this.open.bind(this, record, i, 0)}
                >
                  {this.props.intl.formatMessage({ id: "详情" })}
                  {this.state.open[i] ? (
                    <Iconfont
                      type="arrowUp"
                      style={{ fontSize: "18px", margin: "-3px 0 0" }}
                    />
                  ) : (
                    <Iconfont
                      type="arrowDown"
                      style={{ fontSize: "18px", margin: "-3px 0 0" }}
                    />
                  )}
                </span>
              </p>
            </React.Fragment>
          );
        },
      },
    ];
    // 永续合约交易
    const futures = [
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "tokenId",
        render: (text, record) => {
          return <span className={classes.tokenIcon}>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "created",
        render: (text, record) => {
          return (
            <span>
              {moment.utc(Number(text)).local().format("YYYY-MM-DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "类型",
        }),
        key: "flowType",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "金额数量",
        }),
        key: "change",
        render: (text, record) => {
          return (
            <span>
              {Number(text) > 0 ? "+" : ""}
              {text ? helper.digits(text, 8) : ""}
            </span>
          );
        },
      },
    ];
    // 币多多
    const cionplus = [
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "token",
        render: (text, record) => {
          return <span className={classes.tokenIcon}>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "createdAt",
        render: (text, record) => {
          return (
            <span>
              {moment.utc(Number(text)).local().format("YYYY/MM/DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "数量",
        }),
        key: "amount",
        render: (text) => {
          return <span>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "类型",
        }),
        key: "type",
        render: (text) => {
          return (
            <span>
              {typeMap[text]
                ? this.props.intl.formatMessage({ id: typeMap[text] })
                : ""}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "状态",
        }),
        key: "status",
        render: (text, record) => {
          const status = text == 1 ? text : 0;
          return (
            <span>
              {this.props.intl.formatMessage({
                id: statusMap[record.type][status],
              })}
            </span>
          );
          // const span =
          //   record.type == 2 ? (
          //     <span>
          //       {text == 1
          //         ? this.props.intl.formatMessage({
          //             id: `${typeMap[record.type]}成功`
          //           })
          //         :this.props.intl.formatMessage({
          //           id: "待发放"
          //         })}
          //     </span>
          //   ) : (
          //     <span>
          //       {this.props.intl.formatMessage({
          //         id: `${typeMap[record.type]}${text == 1 ? "成功" : "中"}`
          //       })}
          //     </span>
          //   );
          // return span;
        },
      },
    ];
    // 定期
    const staking = [
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "tokenName",
        render: (text, record) => {
          return <span className={classes.tokenIcon}>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "createdAt",
        render: (text, record) => {
          return (
            <span>
              {moment.utc(Number(text)).local().format("YYYY/MM/DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "数量",
        }),
        key: "amount",
        render: (text) => {
          return <span>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "类型",
        }),
        key: "type",
        render: (text) => {
          return (
            <span>
              {typeMap[text]
                ? this.props.intl.formatMessage({ id: typeMap[text] })
                : ""}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "状态",
        }),
        key: "status",
        render: (text, record) => {
          return (
            <span>
              {this.props.intl.formatMessage({
                id: "成功",
              })}
            </span>
          );
        },
      },
    ];

    // 杠杆记录
    const lever_order = [
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "tokenId",
        render: (text, record) => {
          return (
            <span className={classes.tokenIcon}>
              {this.props.tokens[text] && this.props.tokens[text]["iconUrl"] ? (
                <img src={this.props.tokens[text]["iconUrl"]} />
              ) : (
                ""
              )}
              {record.tokenName}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "created",
        render: (text, record) => {
          return (
            <span>
              {moment.utc(Number(text)).local().format("YYYY-MM-DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "类型",
        }),
        key: "flowType",
        render: (text) => {
          return <span>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "数量",
        }),
        key: "change",
        render: (text) => {
          return (
            <span>
              {Number(text) > 0 ? "+" : ""}
              {text ? helper.digits(text, 18) : ""}
            </span>
          );
        },
      },
    ];
    // 其他
    const column_other = [
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "tokenId",
        render: (text, record) => {
          return (
            <span className={classes.tokenIcon}>
              {this.props.tokens[text] && this.props.tokens[text]["iconUrl"] ? (
                <img src={this.props.tokens[text]["iconUrl"]} />
              ) : (
                ""
              )}
              {record.tokenName}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "时间",
        }),
        key: "createdAt",
        render: (text, record) => {
          return (
            <span>
              {moment
                .utc(Number(record.created))
                .local()
                .format("YYYY-MM-DD HH:mm:ss")}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "类型",
        }),
        key: "flowType",
        render: (text) => {
          return <span>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "金额数量",
        }),
        key: "change",
        render: (text, record) => {
          return (
            <span>
              {Number(text) > 0 ? "+" : ""}
              {text ? helper.digits(text, 8) : ""}
            </span>
          );
        },
      },
    ];

    return (
      <div
        className={classNames(
          classes.list,
          classes.financeCont,
          classes.orderList
        )}
      >
        <Nav
          history={this.props.history}
          title={this.props.intl.formatMessage({ id: "资产记录" })}
        />
        <Tabs
          value={TabValue}
          className={classes.tabs}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
        >
          {functions && functions["exchange"] ? (
            <Tab
              classes={{ root: classes.tab }}
              label={this.props.intl.formatMessage({
                id: "充币",
              })}
              value="rechange"
            />
          ) : (
            ""
          )}
          {functions && functions["exchange"] ? (
            <Tab
              classes={{ root: classes.tab }}
              label={this.props.intl.formatMessage({
                id: "提币",
              })}
              value="cash"
            />
          ) : (
            ""
          )}
          {functions && functions["futures"] ? (
            <Tab
              classes={{ root: classes.tab }}
              label={this.props.intl.formatMessage({
                id: "永续合约交易",
              })}
              value="future"
            />
          ) : (
            ""
          )}
          {functions && functions["bonus"] ? (
            <Tab
              classes={{ root: classes.tab }}
              label={this.props.intl.formatMessage({
                id: "币多多",
              })}
              value="coinplus"
            />
          ) : (
            ""
          )}
          {functions && functions["bonus"] ? (
            <Tab
              classes={{ root: classes.tab }}
              label={this.props.intl.formatMessage({
                id: "定期",
              })}
              value="staking"
            />
          ) : (
            ""
          )}
          {functions && functions["margin"] ? (
            <Tab
              classes={{ root: classes.tab }}
              label={this.props.intl.formatMessage({
                id: "lever.trade",
              })}
              value="lever"
            />
          ) : (
            ""
          )}
          <Tab
            classes={{ root: classes.tab }}
            label={this.props.intl.formatMessage({
              id: "其他",
            })}
            value="other"
          />
        </Tabs>
        {TabValue === "rechange" && (
          <TabContainer>
            <Table
              widthStyle={classes.order_table_width_rechange}
              data={this.props.rechangeLog}
              titles={column_current}
              hasMore={
                !this.props.loading.effects["finance/getOrders"] &&
                this.props.rechange_more
              }
              showNoMoreData={true}
              loading={this.props.loading.effects["finance/getOrders"]}
              useWindow={true}
              getMore={this.getMore.bind(this, "rechange", false)}
            />
          </TabContainer>
        )}
        {TabValue === "cash" && (
          <TabContainer>
            <Table
              widthStyle={classes.order_table_width_cash}
              data={this.props.cashLog}
              titles={column_history}
              useWindow={true}
              showNoMoreData={true}
              hasMore={
                !this.props.loading.effects["finance/getOrders"] &&
                this.props.cash_more
              }
              loading={this.props.loading.effects["finance/getOrders"]}
              getMore={this.getMore.bind(this, "cash", false)}
            />
          </TabContainer>
        )}
        {TabValue === "future" && (
          <TabContainer>
            <Table
              widthStyle={classes.order_table_width_rechange}
              data={this.props.futureLog}
              titles={futures}
              useWindow={true}
              showNoMoreData={true}
              hasMore={
                !this.props.loading.effects["finance/getOrders"] &&
                this.props.future_more
              }
              loading={this.props.loading.effects["finance/getOrders"]}
              getMore={this.getMore.bind(this, "future", false)}
            />
          </TabContainer>
        )}
        {TabValue === "coinplus" && (
          <TabContainer>
            <Table
              widthStyle={classes.order_table_width_coinplus}
              data={this.props.coinplusLog}
              titles={cionplus}
              useWindow={true}
              showNoMoreData={true}
              hasMore={
                !this.props.loading.effects["finance/getOrders"] &&
                this.props.coinplus_more
              }
              loading={this.props.loading.effects["finance/getOrders"]}
              getMore={this.getMore.bind(this, "coinplus", false)}
            />
          </TabContainer>
        )}
        {TabValue === "staking" && (
          <TabContainer>
            <Table
              widthStyle={classes.order_table_width_coinplus}
              data={this.props.stakingLog}
              titles={staking}
              useWindow={true}
              showNoMoreData={true}
              hasMore={
                !this.props.loading.effects["finance/getOrders"] &&
                this.props.staking_more
              }
              loading={this.props.loading.effects["finance/getOrders"]}
              getMore={this.getMore.bind(this, "staking", false)}
            />
          </TabContainer>
        )}

        {TabValue === "lever" && (
          <TabContainer>
            <Table
              widthStyle={classes.order_table_width}
              data={this.props.leverLog}
              titles={lever_order}
              useWindow={true}
              showNoMoreData={true}
              hasMore={
                !this.props.loading.effects["finance/getOrders"] &&
                this.props.lever_more
              }
              loading={this.props.loading.effects["finance/getOrders"]}
              getMore={this.getMore.bind(this, "lever", false)}
            />
          </TabContainer>
        )}
        {TabValue === "other" && (
          <TabContainer>
            <Table
              widthStyle={classes.order_table_width}
              data={this.props.otherLog}
              titles={column_other}
              useWindow={true}
              showNoMoreData={true}
              hasMore={
                !this.props.loading.effects["finance/getOrders"] &&
                this.props.other_more
              }
              loading={this.props.loading.effects["finance/getOrders"]}
              getMore={this.getMore.bind(this, "other", false)}
            />
          </TabContainer>
        )}
        <Dialog open={Boolean(this.state.loading)} onClose={this.close}>
          <DialogContent style={{ minWidth: 400, padding: 24 }}>
            <h4 style={{ fontSize: 20, margin: "0 0 10px" }}>
              {this.props.intl.formatMessage({ id: "提示" })}
            </h4>
            <p style={{ margin: "0 0 30px" }}>
              {this.props.intl.formatMessage({ id: "确定要取消提币吗?" })}
            </p>
          </DialogContent>
          <DialogActions style={{ padding: "0 20px", margin: "8px 4px" }}>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={this.close}
            >
              {this.props.intl.formatMessage({ id: "取消" })}
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={this.cancel_order}
              fullWidth
              style={{ margin: "0 0 0 10px" }}
            >
              {this.props.intl.formatMessage({ id: "确定" })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Record));
