// 子账户资产
import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./style";
import helper from "../../utils/helper";
import TransferModal from "../public/transfer_modal";
import FinanceHeader from "../public/finance_header";
import { Table, Iconfont } from "../../lib";
import {
  FormControlLabel,
  Checkbox,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  Popover,
  Dialog,
  Grid,
  DialogContent,
  DialogActions,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";
import TooltipCommon from "../public/tooltip";
import TextFieldCN from "../public/textfiled";
import moment from "moment";
import NumberFormat from "react-number-format";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      format="####-##-## ##:##:##"
      placeholder="YYYY-MM-DD HH:mm:ss"
      mask="_"
    />
  );
}

class FinanceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideZero: props.hideZero == 1,
      search: "",
      modal: false,
      open: false,
      anchorEl: null,
      create: false,
      accountName: "",
      accountType: 1,
      choose: -1,
      choose_data: {},
      choose_token_id: "USDT",
      target_type: 0,
      authorized_org: false,

      accout_type: {
        1: "钱包账户",
        3: "合约账户",
        4: "币币账户",
      },
      forbidStartTime: "",
      forbidTime: "",
      forbidTimeMsg: "",
      first_loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  change = (key) => (e) => {
    this.setState({
      [key]: e.target.type == "checkbox" ? e.target.checked : e.target.value,
    });
  };
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
    if (n == "accountName") {
      let d = v
        .replace(/^\s/g, "")
        .replace(/\s$/g, "")
        .replace(/\</g, "")
        .replace(/\>/g, "");
      if (d.length <= 10) {
        this.setState({
          accountName_msg: "",
          [n]: d,
        });
      }
    }
  }
  handleChangeTime = (e) => {
    this.setState({
      forbidTime: e.target.value,
      forbidTimeMsg: "",
    });
  };
  componentDidMount() {
    this.props.dispatch({
      type: "layout/getTotalAsset",
      payload: {
        unit: "USDT",
      },
    });
    this.props.dispatch({
      type: "layout/account_type",
      payload: {},
    });
    this.updateBalance();
    if (this.props.child_account_list.length) {
      this.init(this.props.child_account_list);
    }
  }
  init = (child_account_list) => {
    if (child_account_list.length) {
      let choose = -1;
      let choose_data = {};
      child_account_list.map((item, i) => {
        if (item.accountIndex >= 1 && item.accountType == 1 && choose == -1) {
          choose = i;
          choose_data = item;
        }
      });
      if (choose != -1) {
        this.setState({
          choose,
          choose_data,
        });
      }
    }
  };
  choose = (n, data) => () => {
    this.setState({
      choose: n,
      choose_data: data,
      open: false,
      anchorEl: null,
    });
    this.props.dispatch({
      type: "layout/save",
      payload: {
        child_account_balance: {
          ...this.props.child_account_balance,
          [data.accountId]: [],
        },
      },
    });
  };
  componentWillReceiveProps(nextProps) {
    if (
      !this.props.child_account_list.length &&
      nextProps.child_account_list.length
    ) {
      this.init(nextProps.child_account_list);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const tokens = this.props.tokens;
    const n_tokens = nextProps.tokens;
    if (Object.keys(tokens).length != Object.keys(n_tokens).length) {
      return true;
    }
    const loading =
      this.props.loading && this.props.loading.effects
        ? this.props.loading.effects
        : {};
    const nextloading =
      nextProps.loading && nextProps.loading.effects
        ? nextProps.loading.effects
        : {};
    if (
      loading["layout/get_rates"] != nextloading["layout/get_rates"] ||
      loading["layout/child_account_balance_req"] !=
        nextloading["layout/child_account_balance_req"] ||
      this.props.hidden_balance != nextProps.hidden_balance
    ) {
      return true;
    }
    return true;
  }
  // 2秒更新一次资产
  async updateBalance() {
    if (
      this.props.userinfo.defaultAccountId &&
      this.props.child_account_list.length &&
      this.state.choose > -1
    ) {
      const d = this.props.child_account_list[this.state.choose];
      try {
        await this.props.dispatch({
          type: "layout/child_account_balance_req",
          payload: {
            account_type: d.accountType,
            account_index: d.accountIndex,
            account_id: d.accountId,
            account_name: d.accountName,
          },
        });
      } catch (e) {}
    }
    await helper.delay(2000);
    if (!this.state.first_loading) {
      this.setState({
        first_loading: true,
      });
    }
    this.updateBalance();
  }
  changeModal2 = (tokenId, target_type) => () => {
    this.setState(
      {
        choose_token_id: tokenId,
        target_type,
      },
      () => {
        this.setState({
          modal: true,
        });
      }
    );
  };
  changeModal(status) {
    this.setState({
      modal: status,
    });
  }
  closeCreate = () => {
    this.setState({
      create: false,
    });
  };
  create = () => {
    this.setState({
      create: true,
      open: false,
      anchorEl: null,
    });
  };
  handleClose = () => {
    this.setState({
      open: false,
      anchorEl: null,
    });
  };
  // 创建账户
  createAccount = () => {
    const name = this.state.accountName.trim();
    if (!name) {
      this.setState({
        accountName_msg: "请输入账户名",
      });
      return;
    }
    const len = name.length;
    if (len > 30) {
      this.setState({
        accountName_msg: "最多30个字符和数字",
      });
      return;
    }
    this.props.dispatch({
      type: "layout/create_account",
      payload: {
        account_type: this.state.accountType,
        desc: name,
        authorized_org: this.state.authorized_org,
      },
      cb: () => {
        this.setState({
          create: false,
          accountName: "",
          accountName_msg: "",
        });
      },
    });
  };
  // 设置禁止时间
  setForbidTime = () => {
    if (!Number(this.state.forbidTime)) {
      this.setState({
        forbidTimeMsg: this.props.intl.formatMessage({ id: "请输入时间" }),
      });
      return;
    }

    const time = `${this.state.forbidTime}`.match(
      /^(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?$/
    );
    if (!time) {
      this.setState({
        forbidTimeMsg: this.props.intl.formatMessage({
          id: "请输入正确的时间",
        }),
      });
      return;
    }
    let d = new Date(
      time[1] +
        "-" +
        (time[2] || "1") +
        "-" +
        (time[3] || "1") +
        " " +
        (time[4] || "0") +
        ":" +
        (time[5] || "0") +
        ":" +
        (time[6] || "0")
    ).getTime();
    if (!Number(d)) {
      this.setState({
        forbidTimeMsg: this.props.intl.formatMessage({
          id: "请输入正确的时间",
        }),
      });
      return;
    }
    if (d < new Date().getTime()) {
      this.setState({
        forbidTimeMsg: this.props.intl.formatMessage({
          id: "结束时间需要大于当前时间",
        }),
      });
      return;
    }
    if (d < new Date(this.state.forbidStartTime).getTime()) {
      this.setState({
        forbidTimeMsg: this.props.intl.formatMessage({
          id: "结束时间需要大于开始时间",
        }),
      });
      return;
    }
    if (
      this.state.choose_data.forbidEndTime &&
      d < Number(this.state.choose_data.forbidEndTime)
    ) {
      this.setState({
        forbidTimeMsg: this.props.intl.formatMessage({
          id: "结束时间需要大于上次设置时间",
        }),
      });
      return;
    }
    this.props.dispatch({
      type: "finance/forbid_time",
      payload: {
        sub_account_id: this.state.choose_data.accountId,
        limit_time: d,
      },
      cb: () => {
        this.setState({
          forbidTime: "",
          forbidTimeMsg: "",
          forbid: false,
          choose_data: {
            ...this.state.choose_data,
            forbidEndTime: d,
            forbidStartTime: new Date(this.state.forbidStartTime).getTime(),
          },
        });
      },
    });
  };
  cancel = () => {
    this.setState({
      forbid: false,
      forbidTime: "",
      forbidTimeMsg: "",
    });
  };
  openforbid = () => {
    this.setState({
      forbid: true,
      forbidStartTime: moment(new Date().getTime()).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    });
  };
  render() {
    const { classes, functions, ...otherProps } = this.props;
    if (!this.props.userinfo.userId) {
      return "";
    }
    const loading =
      this.props.loading && this.props.loading.effects
        ? this.props.loading.effects
        : {};
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
              {/* <img className={record.iconUrl ? "" : "noIcon"} src={record.iconUrl ? record.iconUrl : ''} /> */}
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
          id: "BTC估值",
        }),
        key: "btcValue",
        render: (text, record) => {
          const btcRates = helper.currencyValue(this.props.rates, text, "BTC");
          return (
            <div>
              <div>
                {this.props.hidden_balance
                  ? "********"
                  : !text && text != 0
                  ? "--"
                  : helper.digits(text, 8)}
                {` ≈ ${this.props.hidden_balance ? "" : btcRates[0]}${
                  this.props.hidden_balance ? "********" : btcRates[1]
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
            <div className={classes.action}>
              <div>
                <a
                  onClick={this.changeModal2(record.tokenId, this.state.choose)}
                >
                  {this.props.intl.formatMessage({ id: "划转" })}
                </a>
              </div>
            </div>
          );
        },
      },
    ];
    const accountId = this.state.choose_data.accountId || "";
    const accountType = this.state.choose_data.accountType || 1;
    const user_balance =
      accountId && this.props.child_account_balance[accountId]
        ? this.props.child_account_balance[accountId]
        : []; // 账户资产 []
    let tokens = this.props.config.tokens; // 所有token {}
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
    const coins = this.props.config.token || [];
    coins.map((item) => {
      if (
        (accountType == 3 &&
          this.props.futures_coin_token.includes(item.tokenId)) ||
        accountType == 1
      ) {
        let d = { ...item };
        if (balances[item.tokenId]) {
          d = { ...item, ...balances[item.tokenId] };
        }
        if (this.state.hideZero) {
          if (
            regrep.test(d["tokenName"]) &&
            d["btcValue"] &&
            d["btcValue"] >= 0.001
          ) {
            data.push(d);
          }
        } else {
          if (regrep.test(d["tokenName"])) {
            data.push(d);
          }
        }
      }
    });
    (fix_token || []).map((item) => {
      if (this.state.hideZero) {
        if (
          regrep.test(item["tokenName"]) &&
          item["btcValue"] &&
          item["btcValue"] >= 0.001
        ) {
          data.push(item);
        }
      } else {
        if (regrep.test(item["tokenName"])) {
          data.push(item);
        }
      }
    });
    let account_value = {};
    this.props.total_asset &&
    this.props.total_asset.subAccountBalances &&
    this.state.choose_data.accountId
      ? this.props.total_asset.subAccountBalances.map((item) => {
          if (item.accountId == this.state.choose_data.accountId) {
            account_value = item;
          }
        })
      : "";
    const cRates2 =
      Number(account_value.btcValue) &&
      this.props.total_asset &&
      this.props.total_asset.unit
        ? helper.currencyValue(
            this.props.rates,
            Number(account_value.btcValue),
            this.props.total_asset.unit
          )
        : ["", ""];
    const hasChildAccount = this.props.child_account_list.filter(
      (item) => item.accountIndex >= 1
    );
    const now = new Date().getTime();
    return (
      <div className={classNames(classes.list, classes.finance_list)}>
        <FinanceHeader tab="child" functions={functions} {...otherProps} />
        <div className={classes.forbidTime}>
          {Number(this.state.choose_data.forbidEndTime) &&
          Number(this.state.choose_data.forbidEndTime) > now ? (
            <div className={classes.forbidTimebg} />
          ) : (
            ""
          )}
          {Number(this.state.choose_data.forbidEndTime) &&
          Number(this.state.choose_data.forbidEndTime) > now ? (
            <div className={classes.forbidTimeInfo}>
              <p>
                {this.props.intl.formatMessage({ id: "禁止划转时间" })}:
                {moment(Number(this.state.choose_data.forbidStartTime)).format(
                  "YYYY-MM-DD HH:mm:ss"
                ) +
                  " -- " +
                  moment(Number(this.state.choose_data.forbidEndTime)).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
              </p>
              <Button onClick={this.openforbid} size="small" color="primary">
                {this.props.intl.formatMessage({ id: "延长禁转" })}
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={classes.financeCont}>
          <div className={classes.topic}>
            <div className="accountList">
              {loading["layout/account_list"] ? (
                ""
              ) : this.props.child_account_list.length &&
                hasChildAccount.length ? (
                <div
                  onClick={(e) => {
                    this.setState({
                      open: true,
                      anchorEl: e.target,
                    });
                  }}
                  className={classes.createAccount}
                >
                  <Iconfont type="Icon_Authentication" size="18" />
                  <span
                    style={{ display: "inline-block", margin: "0 20px 0 4px" }}
                  >
                    {this.state.choose != -1
                      ? this.props.intl.formatMessage({
                          id: this.state.accout_type[
                            this.props.child_account_list[this.state.choose][
                              "accountType"
                            ] == 1 &&
                            this.props.child_account_list[this.state.choose][
                              "accountIndex"
                            ] > 0
                              ? 4
                              : this.props.child_account_list[
                                  this.state.choose
                                ]["accountType"]
                          ],
                        })
                      : ""}
                    {" / "}
                    {this.state.choose != -1
                      ? this.props.child_account_list[this.state.choose][
                          "accountName"
                        ]
                      : ""}
                  </span>{" "}
                  <Iconfont type="arrowDown" />
                </div>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.create}
                >
                  <Iconfont tye="add" />
                  {this.props.intl.formatMessage({ id: "创建子账户" })}
                </Button>
              )}

              <Popover
                id="simple-popper"
                open={Boolean(this.state.open)}
                anchorEl={this.state.anchorEl}
                onClose={this.handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                {this.props.child_account_list.map((item, i) => {
                  return Number(item.accountIndex) > 0 ? (
                    <MenuItem value={i} key={i} onClick={this.choose(i, item)}>
                      {this.props.intl.formatMessage({
                        id: this.state.accout_type[
                          item.accountType == 1 && item.accountIndex > 0
                            ? 4
                            : item.accountType
                        ],
                      })}{" "}
                      / {item.accountName}
                    </MenuItem>
                  ) : (
                    ""
                  );
                })}

                <MenuItem>
                  <Button
                    color="primary"
                    variant="contained"
                    style={{ minWidth: 146 }}
                    onClick={this.create}
                  >
                    {this.props.intl.formatMessage({ id: "创建子账户" })}
                  </Button>
                </MenuItem>
              </Popover>
            </div>
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
                  {this.props.intl.formatMessage({ id: "子账户资产折合" })}(
                  {this.props.total_asset ? this.props.total_asset.unit : ""}):
                </span>
                {Number(account_value.btcValue)
                  ? this.props.hidden_balance
                    ? "********"
                    : helper.digits(account_value.btcValue, 2)
                  : ""}{" "}
                {`≈ ${this.props.hidden_balance ? "" : cRates2[0]}${
                  this.props.hidden_balance ? "********" : cRates2[1]
                }`}
              </p>
              {(this.state.choose_data.accountType == 1 &&
                Number(this.state.choose_data.accountIndex) > 0) ||
              (this.state.choose_data.accountType == 3 &&
                Number(this.state.choose_data.accountIndex) > 0) ? (
                Number(this.state.choose_data.forbidEndTime) &&
                Number(this.state.choose_data.forbidEndTime) > now ? (
                  ""
                ) : (
                  <Button
                    size="small"
                    onClick={this.openforbid}
                    color="primary"
                  >
                    {this.props.intl.formatMessage({
                      id: "禁止划转",
                    })}
                  </Button>
                )
              ) : (
                <Button size="small" disabled color="primary">
                  {this.props.intl.formatMessage({
                    id: "禁止划转",
                  })}
                </Button>
              )}
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
                // className={s.order_table}
                // widthStyle={s.order_table_width}
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
                  justifyContent: "center",
                  alignItems: "center",
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
            target_type={this.state.target_type}
            onCancel={this.changeModal.bind(this, false)}
            token_id={this.state.choose_token_id}
            {...otherProps}
          />
        </div>
        <Dialog open={Boolean(this.state.create)} onClose={this.closeCreate}>
          <Grid
            container
            justify="space-between"
            className={classes.create_title}
            alignItems="flex-start"
          >
            <Grid item>
              <strong>
                {this.props.intl.formatMessage({ id: "创建子账户" })}
              </strong>
            </Grid>
            <Grid item>
              <span style={{ cursor: "pointer" }} onClick={this.closeCreate}>
                <Iconfont size="18" type="close" />
              </span>
            </Grid>
          </Grid>
          <div className={classes.create_desc}>
            <p>
              <Iconfont type="info" />
              {this.props.intl.formatMessage({
                id: "单个账户类型最多可创建5个子账户",
              })}
            </p>
            <span />
          </div>
          <div className={classes.create_form}>
            <Grid container alignItems="center">
              <Grid item xs={4} style={{ height: 32, margin: "0 0 16px" }}>
                <label>{this.props.intl.formatMessage({ id: "类型" })}:</label>
              </Grid>
              <Grid item xs={8} style={{ height: 32, margin: "0 0 16px" }}>
                <Select
                  fullWidth
                  name="accountType"
                  value={this.state.accountType}
                  onChange={this.handleChange}
                >
                  {this.props.child_account_type.map((item) => {
                    return (
                      <MenuItem value={item} key={item}>
                        {this.props.intl.formatMessage({
                          id: this.state.accout_type[item == 1 ? 4 : item],
                        })}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              <Grid item xs={4} style={{ height: 32, margin: "0 0 16px" }}>
                <label>
                  {this.props.intl.formatMessage({ id: "账户名" })}:
                </label>
              </Grid>
              <Grid item xs={8} style={{ height: 32, margin: "0 0 16px" }}>
                <TextFieldCN
                  fullWidth
                  name="accountName"
                  value={this.state.accountName}
                  onChange={this.handleChange}
                  placeholder={this.props.intl.formatMessage({
                    id: "最多30个字符和数字",
                  })}
                  error={Boolean(this.state.accountName_msg)}
                  helperText={this.state.accountName_msg}
                />
              </Grid>
              {this.props.authorizedOrg ? (
                <Grid item xs={4} style={{ height: 32, margin: "0 0 40px" }}>
                  <label>
                    {this.props.intl.formatMessage({ id: "授权" })}:
                  </label>
                </Grid>
              ) : (
                ""
              )}
              {this.props.authorizedOrg ? (
                <Grid
                  item
                  xs={8}
                  style={{ height: 32, margin: "0 0 40px -14px" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <Checkbox
                      checked={Boolean(this.state.authorized_org)}
                      onChange={this.change("authorized_org")}
                    />
                    <p>
                      {this.props.intl.formatMessage({
                        id: "允许授权操作后，则交易所或第三方将可根据指令操作此子账户资产",
                      })}
                    </p>
                  </div>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={this.createAccount}
            >
              {this.props.intl.formatMessage({ id: "创建" })}
            </Button>
          </div>
        </Dialog>
        <Dialog open={Boolean(this.state.forbid)} onClose={this.closeForbid}>
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "禁止划转" })}
          </DialogTitle>
          <DialogContent style={{ width: 450 }}>
            <TextField
              disabled
              fullWidth
              value={this.state.forbidStartTime}
              label={this.props.intl.formatMessage({ id: "开始时间" })}
            />
            <TextField
              className={classes.formControl}
              value={this.state.forbidTime}
              onChange={this.handleChangeTime}
              fullWidth
              style={{ margin: "16px 0 0" }}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
              error={Boolean(this.state.forbidTimeMsg)}
              helperText={this.state.forbidTimeMsg}
              label={this.props.intl.formatMessage({ id: "结束时间" })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancel} color="primary">
              {this.props.intl.formatMessage({ id: "取消" })}
            </Button>
            {loading["finance/forbid_time"] ? (
              <Button color="primary">
                <CircularProgress color="primary" size={20} />
              </Button>
            ) : (
              <Button onClick={this.setForbidTime} color="primary">
                {this.props.intl.formatMessage({ id: "确定" })}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(FinanceList));
