// 资产列表
import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./style";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import TransferModal from "../public/transfer_modal";
import FinanceHeader from "../public/finance_header";
import { Table, Iconfont } from "../../lib";
import {
  FormControlLabel,
  Checkbox,
  TextField,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
} from "@material-ui/core";
import TooltipCommon from "../public/tooltip";
import WSDATA from "../../models/data_source";

class FinanceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideZero: props.hideZero == 1,
      search: "",
      modal: false,
      choose_token_id: "USDT",
      subed: false,
      first_loading: false,
      anchorEl: null,
      tokenId: "BTC",
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    const { dispatch } = this.props;
    const t = e.target;
    const n = t.name;
    if (t.type == "checkbox") {
      dispatch({
        type: "finance/saveHideZero",
        payload: !this.state.hideZero,
      });
    }
    const v = t.type == "checkbox" ? !this.state.hideZero : t.value;
    this.setState({
      [n]: v,
    });
  }
  componentDidMount() {
    this.updateBalance();
  }
  // 2秒更新一次资产
  async updateBalance() {
    try {
      await this.props.dispatch({
        type: "layout/getAccount",
        payload: {},
      });
      await this.props.dispatch({
        type: "layout/getTotalAsset",
        payload: {
          unit: "USDT",
        },
      });
      await this.props.dispatch({
        type: "ws/user_balance",
        payload: {
          user_balance_source: WSDATA.getData("user_balance_source"),
        },
      });
    } catch (e) {}
    if (!this.state.first_loading) {
      this.setState({
        first_loading: true,
      });
    }
    await helper.delay(3000);
    this.updateBalance();
  }

  changeModal(status) {
    this.setState({
      modal: status,
    });
  }
  changeModal2 = (tokenId, target_type) => () => {
    this.setState(
      {
        choose_token_id: tokenId,
      },
      () => {
        this.setState({
          modal: true,
        });
      }
    );
  };
  openModal = (id, e) => {
    this.setState({
      tokenId: id,
      anchorEl: e.currentTarget,
    });
  };
  closeModal = () => {
    this.setState({
      tokenId: "",
      anchorEl: null,
    });
  };
  render() {
    const { classes, functions, quote_tokens, ...otherProps } = this.props;
    let unit = this.props.total_asset ? this.props.total_asset.unit : "";
    if (
      !this.props.userinfo.userId ||
      this.props.loading.effects["layout/get_all_token"]
    ) {
      return "";
    }
    // 资产列表
    const column_current = [
      {
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
        key: "tokenName",
        render: (text, record) => {
          return (
            <div className={classes.tokenIcon}>
              {record.iconUrl ? (
                <img src={record.iconUrl} />
              ) : (
                <em className="noIcon" />
              )}
              <p>
                <span>{record.tokenName}</span>
                <span>{record.tokenFullName}</span>
              </p>
            </div>
          );
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
              {this.props.hidden_balance ? "********" : helper.digits(text, 8)}
            </span>
          );
        },
      },
      {
        title: this.props.intl.formatMessage({
          id: "冻结",
        }),
        key: "locked",
        render: (text, record) => {
          return (
            <span>
              {this.props.hidden_balance ? "********" : helper.digits(text, 8)}
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
          const rates = helper.currencyValue(this.props.rates, text, "USDT");
          return (
            <div>
              <div>
                {this.props.hidden_balance
                  ? "********"
                  : !text && text != 0
                  ? "--"
                  : helper.digits(text, 8)}
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
          const style =
            window.localStorage.lang == "zh-cn"
              ? {}
              : { flex: "0 0 auto", margin: "0 0 0 10px" };
          return (
            <div
              className={classes.action}
              style={{ justifyContent: "flex-end" }}
            >
              {this.props.tokens[record.tokenId] &&
              this.props.tokens[record.tokenId].allowDeposit ? (
                <div style={style}>
                  <a href={route_map.rechange + "/" + record.tokenId}>
                    {this.props.intl.formatMessage({
                      id: "充币",
                    })}
                  </a>
                </div>
              ) : (
                <div style={style}>
                  {this.props.intl.formatMessage({
                    id: "充币",
                  })}
                </div>
              )}
              {(this.props.tokens[record.tokenId] &&
                this.props.tokens[record.tokenId].allowWithdraw) ||
              record.canWithdraw ? (
                <div style={style}>
                  <a href={route_map.cash + "/" + record.tokenId}>
                    {this.props.intl.formatMessage({
                      id: "提币",
                    })}
                  </a>
                </div>
              ) : (
                <div style={style}>
                  {this.props.intl.formatMessage({
                    id: "提币",
                  })}
                </div>
              )}
              <div style={style}>
                <a
                  onMouseEnter={this.openModal.bind(this, record.tokenId)}
                  aria-owns={
                    this.state.anchorEl
                      ? "anchorEl" + this.state.tokenId
                      : undefined
                  }
                >
                  {this.props.intl.formatMessage({
                    id: "交易",
                  })}
                </a>
              </div>
              <div style={style}>
                <a href={route_map.address + "/" + record.tokenId}>
                  {this.props.intl.formatMessage({
                    id: "地址管理",
                  })}
                </a>
              </div>
              <div style={style}>
                <a onClick={this.changeModal2(record.tokenId)}>
                  {this.props.intl.formatMessage({ id: "划转" })}
                </a>
              </div>
            </div>
          );
        },
      },
    ];
    const user_balance = this.props.user_balance; // 账户资产 []
    const tokens = this.props.tokens; // 所有token {}
    let balances = {};
    let fix_token = [];
    user_balance.map((item) => {
      balances[item.tokenId] = item;
      if (!tokens[item.tokenId]) {
        fix_token.push(item);
      }
    });

    let data = [];
    const regrep = new RegExp(this.state.search, "i");
    (this.props.config.token || []).map((item) => {
      let d = { ...item };
      if (balances[item.tokenId]) {
        d = { ...item, ...balances[item.tokenId] };
      }
      if (this.state.hideZero) {
        if (
          regrep.test(d["tokenName"]) &&
          d["usdtValue"] &&
          d["usdtValue"] >= 0.001
        ) {
          data.push(d);
        }
      } else {
        if (regrep.test(d["tokenName"])) {
          data.push(d);
        }
      }
    });
    (fix_token || []).map((item) => {
      if (this.state.hideZero) {
        if (
          regrep.test(item["tokenName"]) &&
          item["usdtValue"] &&
          item["usdtValue"] >= 0.001
        ) {
          data.push(item);
        }
      } else {
        if (regrep.test(item["tokenName"])) {
          data.push(item);
        }
      }
    });
    // const cRates = helper.currencyValue(
    //   this.props.rates,
    //   this.props.total_asset ? this.props.total_asset.totalAsset : 0,
    //   this.props.total_asset ? this.props.total_asset.unit : null
    // );
    const cRates2 = helper.currencyValue(
      this.props.rates,
      this.props.total_asset ? this.props.total_asset.coinAsset : 0,
      this.props.total_asset ? this.props.total_asset.unit : 0
    );
    return (
      <div className={classNames(classes.list, classes.finance_list)}>
        <FinanceHeader tab="exchange" functions={functions} {...otherProps} />
        <div className={classes.financeCont}>
          <div className={classes.topic}>
            <div className="first">
              <FormControlLabel
                className={classes.select}
                classes={{ label: classes.label }}
                control={
                  <Checkbox
                    name="hideZero"
                    onChange={this.handleChange}
                    checked={this.state.hideZero}
                    color="primary"
                  />
                }
                label={this.props.intl.formatMessage({ id: "隐藏小额币种" })}
              />
              <TooltipCommon
                title={this.props.intl.formatMessage({
                  id: "小于0.001BTC",
                })}
                placement="top"
              >
                <span>
                  <Iconfont className={classes.grey} type="info" size="20" />
                </span>
              </TooltipCommon>
            </div>
            <div className="second">
              <p className={classes.info}>
                <span>
                  {this.props.intl.formatMessage({ id: "钱包资产折合" })}(
                  {this.props.total_asset ? this.props.total_asset.unit : ""}
                  ):
                </span>
                {this.props.total_asset &&
                this.props.total_asset.coinAsset &&
                this.props.rates &&
                this.props.rates[this.props.total_asset.unit]
                  ? this.props.hidden_balance
                    ? "********"
                    : helper.digits(this.props.total_asset.coinAsset, 2)
                  : ""}{" "}
                {this.props.total_asset &&
                this.props.total_asset.coinAsset &&
                this.props.rates[this.props.total_asset.unit]
                  ? `≈ ${cRates2[0]}${
                      this.props.hidden_balance ? "********" : cRates2[1]
                    }`
                  : ""}
              </p>
              {/* {this.props.accountList.length > 1 ? (
                <a onClick={this.changeModal.bind(this, true)}>
                  {this.props.intl.formatMessage({ id: "划转" })}
                </a>
              ) : (
                ""
              )} */}
            </div>
            <div className="third">
              <TextField
                placeholder={this.props.intl.formatMessage({ id: "搜索币种" })}
                name="search"
                autoComplete="off"
                value={this.state.search}
                onChange={this.handleChange}
                InputProps={{
                  classes: { root: classes.inputHeight },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconfont type="search" size="24" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          {this.props.userinfo.userId ? (
            this.state.first_loading ? (
              <Table
                // className={classes.order_table}
                // widthStyle={classes.order_table_width}
                data={data}
                titles={column_current}
                hasMore={false}
                getMore={this.getMore}
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
            open={this.state.modal}
            source_type={this.props.account_coin_index}
            target_type={1}
            onCancel={this.changeModal.bind(this, false)}
            token_id={this.state.choose_token_id}
            {...otherProps}
          />
        </div>
        <Popper
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          id={"anchorEl" + this.state.tokenId}
          onMouseLeave={this.closeModal.bind(this)}
          placement="bottom-start"
          style={{ zIndex: 200 }}
        >
          <Paper>
            <ClickAwayListener onClickAway={this.closeModal.bind(this)}>
              <MenuList>
                {quote_tokens[this.state.tokenId] &&
                quote_tokens[this.state.tokenId].length ? (
                  quote_tokens[this.state.tokenId].map((item, i) => {
                    return (
                      <MenuItem key={i} className={classes.menuitem}>
                        <a
                          href={
                            route_map.exchange +
                            "/" +
                            this.state.tokenId.toLowerCase() +
                            "/" +
                            item.quoteTokenId.toLowerCase()
                          }
                        >
                          {item.baseTokenName.toUpperCase() +
                            "/" +
                            item.quoteTokenName.toUpperCase()}
                        </a>
                      </MenuItem>
                    );
                  })
                ) : (
                  <MenuItem className={classes.menuitem}>
                    {this.props.intl.formatMessage({ id: "暂无记录" })}
                  </MenuItem>
                )}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(FinanceList));
