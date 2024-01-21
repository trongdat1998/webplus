// 杠杆资产列表
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { CircularProgress } from "@material-ui/core";
import moment from "moment";
import math from "../../utils/mathjs";
import styles from "./finance_style";
import helper from "../../utils/helper";
import { message, Table, Iconfont } from "../../lib";
import TransferModal from "../public/transfer_modal";
import BorrowCoinModal from "../public/borrow_coin_modal";
import RepayCoinModal from "../public/repay_coin_modal";
import FinanceHeader from "../public/finance_header";
import OpenMarginModal from "../public/open_margin_modal";

class FinanceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      open: {}, // 展开的还币记录
      open_tokenId: "",
      open_loading: false,
      tokenId: "",
      lendOrder: {},
      transferModal: false,
      repayModal: false,
      borrowModal: false,
      marginProtocolModal: false,
      subed: false,
      firstLoadComplete: false,
    };
    this.closeRepayModal = this.closeRepayModal.bind(this);
    this.closeBorrowModal = this.closeBorrowModal.bind(this);
    this.closeMarginProtocolModal = this.closeMarginProtocolModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const t = e.target;
    const n = t.name;
    const v = t.type == "checkbox" ? !this.state.hideZero : t.value;
    this.setState({
      [n]: v,
    });
  }

  componentDidMount() {
    if (!this.props.userinfo.openMargin) {
      this.setState({
        marginProtocolModal: true,
      });
    }
    this.updateBalance();
  }

  componentWillReceiveProps(nextProps) {
    // 只要 props.openMargin 改变，就改变 state
    if (nextProps.userinfo.openMargin !== this.props.userinfo.openMargin) {
      this.setState({
        marginProtocolModal: !nextProps.userinfo.openMargin,
      });
    }
  }

  // 2秒更新一次资产
  async updateBalance() {
    if (this.props.userinfo.defaultAccountId) {
      try {
        await Promise.all([
          await this.props.dispatch({
            type: "layout/getTotalAsset",
            payload: {
              unit: "USDT",
            },
          }),
          this.props.dispatch({
            type: "lever/getLeverAsset",
            payload: {},
          }),
          this.props.dispatch({
            type: "lever/getLeverTotalAsset",
            payload: {},
          }),
        ]);
        if (!this.state.firstLoadComplete) {
          this.setState({
            firstLoadComplete: true,
          });
        }
      } catch (e) {}
    }
    await helper.delay(10000);
    this.updateBalance();
  }

  // 转账
  async openTransferModal(status, tokenId) {
    if (this.props.userinfo && this.props.userinfo.openMargin) {
      await this.setState({
        tokenId,
      });
      this.setState({
        transferModal: status,
      });
    } else {
      this.setState({
        marginProtocolModal: true,
      });
    }
  }

  // 借币
  async openBorrowModal(status, tokenId) {
    if (this.props.userinfo.openMargin) {
      await this.setState({
        tokenId,
      });
      this.setState({
        borrowModal: status,
      });
    } else {
      this.setState({
        marginProtocolModal: true,
      });
    }
  }

  // 刷新还币记录
  refreshRepayRecord(tokenId) {
    if (!tokenId) {
      tokenId = this.state.tokenId;
    }
    if (this.state.open_tokenId != tokenId) {
      return;
    }
    this.props
      .dispatch({
        type: "lever/getLoanOrderDetail",
        payload: {
          token_id: tokenId,
        },
      })
      .then((ret) => {
        const data = ret.filter((item) => {
          return item.unpaidAmount > 0 || item.interestUnpaid > 0;
        });
        const n = { data, forceUpdate: true, loading: false };
        let newopen = { ...this.state.open, [tokenId]: n };
        this.setState({
          open: newopen,
        });
      });
  }

  // 关闭借币
  closeBorrowModal() {
    this.setState({
      borrowModal: false,
    });
  }

  // 还币
  async openRepayModal(status, tokenId, lendOrder) {
    await this.setState({
      tokenId,
      lendOrder,
    });
    this.setState({
      repayModal: status,
    });
  }

  closeRepayModal() {
    this.setState({
      tokenId: "",
      lendOrder: {},
      repayModal: false,
    });
  }

  // 展示借币详情
  showMoreDetail(tokenId) {
    const { dispatch } = this.props;
    const { open } = this.state;
    if (this.state.open_loading) {
      return;
    }
    let newRecord = { ...open };
    // 如果已经有了，说明是关闭还币内容，删除相关信息
    if (open[tokenId]) {
      delete newRecord[tokenId];
      this.setState({
        open: newRecord,
        open_tokenId: "",
        open_loading: false,
      });
    } else {
      newRecord[tokenId] = {
        data: [],
        loading: true,
      };
      this.setState({
        open: newRecord,
        open_loading: true,
        open_tokenId: tokenId,
      });
      dispatch({
        type: "lever/getLoanOrderDetail",
        payload: {
          token_id: tokenId,
        },
      }).then((ret) => {
        const data = ret.filter((item) => {
          return item.unpaidAmount > 0 || item.interestUnpaid > 0;
        });
        let temp = { data, loading: false };
        this.setState({
          open: { ...this.state.open, [tokenId]: temp },
          open_loading: false,
        });
      });
    }
  }

  closeMarginProtocolModal() {
    this.setState({
      marginProtocolModal: false,
    });
  }

  render() {
    const { classes, ...otherProps } = this.props;
    const { open } = this.state;
    const column_list = [
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "tokenId",
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "可用",
        }),
        key: "free",
        render: (text, record) => {
          return (
            <span>
              {this.props.hidden_balance
                ? "********"
                : helper.digits(text || 0, 8)}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "已借数量",
        }),
        key: "loanAmount",
        render: (text, record) => {
          return (
            <span>
              {this.props.hidden_balance
                ? "********"
                : helper.digits(text || 0, 8)}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "冻结数量",
        }),
        key: "locked",
        render: (text, record) => {
          return (
            <span>
              {this.props.hidden_balance
                ? "********"
                : helper.digits(text || 0, 8)}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "USDT估值",
        }),
        key: "usdtValue",
        render: (text, record) => {
          const rates = helper.currencyValue(otherProps.rates, text, "USDT");
          return (
            <div>
              <div>
                {this.props.hidden_balance
                  ? "********"
                  : !text && text != 0
                  ? "--"
                  : helper.digits(text, 2)}
                {` ≈ ${this.props.hidden_balance ? "" : rates[0]}${
                  this.props.hidden_balance ? "********" : rates[1]
                }`}
              </div>
            </div>
          );
        },
      },
      {
        title: (
          <span className="action">
            {this.props.intl.formatMessage({
              id: "操作",
            })}
          </span>
        ),
        key: "action",
        render: (text, record) => {
          return (
            <div className={classes.operate}>
              {!record.loanAmount || record.loanAmount <= 0 ? (
                <a className={classes.btn}>
                  <span>--</span>
                </a>
              ) : (
                <a
                  onClick={this.showMoreDetail.bind(this, record.tokenId)}
                  className={classes.btn}
                >
                  {open[record.tokenId] && open[record.tokenId].loading ? (
                    <CircularProgress
                      size={12}
                      color="primary"
                      style={{
                        position: "relative",
                        top: 2,
                        right: 5,
                      }}
                    />
                  ) : (
                    <>
                      <span>
                        {this.props.intl.formatMessage({ id: "还币" })}
                      </span>
                      <Iconfont
                        type={open[record.tokenId] ? "arrowUp" : "arrowDown"}
                      />
                    </>
                  )}
                </a>
              )}
            </div>
          );
        },
      },
    ];
    // 还币列表
    const column_loan_list = [
      {
        title: this.props.intl.formatMessage({
          id: "借币时间",
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
          id: "借币数量",
        }),
        key: "loanAmount",
        render: (text, record) => {
          return <span>{helper.digits(text || 0, 8)}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "lever.borrow.dailyRate",
        }),
        key: "interestRate1",
        render: (text, record) => {
          return (
            <span>
              {math
                .chain(math.bignumber(record.interestRate1))
                .multiply(86400)
                .multiply(100)
                .format({
                  notation: "fixed",
                  precision: 5,
                }) + "%"}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "未还数量",
        }),
        key: "unpaidAmount",
        render: (text, record) => {
          return <span>{helper.digits(text || 0, 8)}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "未还利息",
        }),
        key: "interestUnpaid",
        render: (text, record) => {
          return <span>{helper.digits(text || 0, 8)}</span>;
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "总应还",
        }),
        key: "",
        render: (text, record) => {
          const val = math
            .chain(math.bignumber(record.interestUnpaid))
            .add(math.bignumber(record.unpaidAmount))
            .format({
              notation: "fixed",
              precision: 8,
            })
            .done();
          return <span>{val}</span>;
        },
      },
      {
        title: <span className="action"></span>,
        key: "action",
        render: (text, record) => {
          return (
            <div className={classes.operate}>
              {record.unpaidAmount <= 0 ? (
                <a className={classes.btn}>
                  <span>--</span>
                </a>
              ) : (
                <a
                  disabled={
                    record.interestUnpaid <= 0 && record.unpaidAmount <= 0
                  }
                  onClick={this.openRepayModal.bind(
                    this,
                    true,
                    record.tokenId,
                    record
                  )}
                >
                  {this.props.intl.formatMessage({ id: "还币" })}
                </a>
              )}
            </div>
          );
        },
      },
    ];
    // debugger
    // 估算的总资产
    const estimatedTotalAssets = helper.currencyValue(
      this.props.rates,
      this.props.leverAsset && this.props.leverAsset.usdtTotal
        ? this.props.leverAsset.usdtTotal
        : 0,
      this.props.leverAsset ? this.props.leverAsset.unit : null
    );
    // 估算的保证金资产
    let occupyMargin =
      this.props.leverAsset && this.props.leverAsset.occupyMargin
        ? this.props.leverAsset.occupyMargin
        : 0;
    let marginAmount =
      this.props.leverAsset && this.props.leverAsset.usdtMarginAmount
        ? this.props.leverAsset.usdtMarginAmount
        : 0;
    const totalMargin = math
      .chain(math.bignumber(occupyMargin))
      .add(math.bignumber(marginAmount))
      .format({
        precision: 8,
        notation: "fixed",
      })
      .done();
    const estimatedMarginAssets = helper.currencyValue(
      this.props.rates,
      totalMargin,
      this.props.leverAsset ? this.props.leverAsset.unit : null
    );
    const rates = otherProps.rates["USDT"];
    const borrowableTokens = this.props.borrowableTokens; // 所有可借token
    const lever_balances = this.props.lever_balances;
    let balancesMap = {};
    lever_balances.forEach((item) => {
      balancesMap[item.tokenId] = item;
    });

    const data = this.props.lever_balances.map((item) => ({
      ...item,
      rates,
    }));

    return (
      <div className={classes.list}>
        <FinanceHeader tab="lever" {...otherProps} />
        <div className={classes.financeCont}>
          <div className={classes.leverFinanceWrapper}>
            <div className={classes.leverAssets}>
              <img src={require("../../assets/lever_asset.png")} alt="" />
              <p className={classes.leverAssetItem}>
                <label>
                  {this.props.intl.formatMessage({
                    id: "lever.asset.fullAsset",
                  })}
                  (
                  {this.props.leverAsset && this.props.leverAsset.unit
                    ? this.props.leverAsset.unit
                    : "--"}
                  )
                </label>
                {this.props.leverAsset && this.props.leverAsset.usdtTotal
                  ? this.props.hidden_balance
                    ? "********"
                    : helper.digits(this.props.leverAsset.usdtTotal, 2)
                  : "-"}
                {this.props.rates[this.props.leverAsset.unit]
                  ? this.props.hidden_balance
                    ? "********"
                    : `≈ ${estimatedTotalAssets[0]}${estimatedTotalAssets[1]}`
                  : "-"}
              </p>
              <p className={classes.leverAssetItem}>
                <label>
                  {this.props.intl.formatMessage({
                    id: "lever.asset.margin",
                  })}
                  (
                  {this.props.leverAsset && this.props.leverAsset.unit
                    ? this.props.leverAsset.unit
                    : "--"}
                  )
                </label>
                {this.props.leverAsset && this.props.leverAsset.usdtMarginAmount
                  ? this.props.hidden_balance
                    ? "********"
                    : helper.digits(totalMargin, 8)
                  : "-"}
                {this.props.rates[this.props.leverAsset.unit]
                  ? this.props.hidden_balance
                    ? "********"
                    : `≈ ${estimatedMarginAssets[0]}${estimatedMarginAssets[1]}`
                  : "-"}
              </p>
            </div>
            <div className={classes.btnGroup}>
              <a
                onClick={this.openTransferModal.bind(this, true, "")}
                style={{
                  marginRight: 16,
                }}
              >
                {this.props.intl.formatMessage({ id: "划转" })}
              </a>
              <a onClick={this.openBorrowModal.bind(this, true, "")}>
                {this.props.intl.formatMessage({ id: "借币" })}
              </a>
            </div>
          </div>
          {data ? (
            this.state.firstLoadComplete ? (
              <Table
                data={data}
                widthStyle={classes.order_table_ava_width}
                titles={column_list}
                hasMore={false}
                getMore={this.getMore}
                dataDescKey="tokenId"
                dataDesc={open}
                listHeight={44}
                dataDescTitles={column_loan_list}
                dataStyle={classes.match_details}
                dataDescTitleStyle={classes.match_title}
                dataDescStyle={classes.match_info}
                refresh={this.props.hidden_balance}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 500,
                }}
              >
                <CircularProgress />
              </div>
            )
          ) : (
            ""
          )}
          <TransferModal
            open={this.state.transferModal}
            source_type={this.props.account_coin_index}
            source_readonly
            target_type={this.props.account_lever_index}
            target_readonly
            onCancel={this.openTransferModal.bind(this, false)}
            token_id={this.state.tokenId}
            {...otherProps}
          />
          <BorrowCoinModal
            open={this.state.borrowModal}
            onClose={this.closeBorrowModal}
            onSuccess={this.refreshRepayRecord.bind(this)}
            tokenId={this.state.tokenId}
          />
          <RepayCoinModal
            open={this.state.repayModal}
            onClose={this.closeRepayModal}
            onSuccess={this.refreshRepayRecord.bind(this)}
            lendOrder={this.state.lendOrder}
            tokenId={this.state.tokenId}
          />
          <OpenMarginModal
            open={this.state.marginProtocolModal}
            onClose={this.closeMarginProtocolModal}
            dispatch={this.props.dispatch}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(FinanceList));
