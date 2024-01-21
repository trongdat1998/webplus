// 提币地址管理
import React from "react";
import { Iconfont, Table } from "../../lib";
import { FormattedMessage, injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import SecVerify from "../public/secVerify_mui";
import helper from "../../utils/helper";
import { withStyles } from "@material-ui/core/styles";
import layout_styles from "../layout_style";
import styles from "./style";
import { Grid, Button, TextField, Fab } from "@material-ui/core";
import classnames from "classnames";
import TextFieldCN from "../public/textfiled";

class Address extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      isopen: false,
      token: {
        value: "",
        id: "",
        msg: "",
      },
      address: {
        msg: "",
        value: "",
        code: "",
      },
      address_ext: {
        msg: "",
        value: "",
        code: "",
      },
      remark: {
        value: "",
        msg: "",
      },
      add: 8, // 短信验证码类别
      del: 9, // 短信验证码类别
      verifyType: 8,
      chainTypes: [],
      chain_type: "",
      set_chain_type: false,
    };
    this.dropchange = this.dropchange.bind(this);
    this.change = this.change.bind(this);
    this.step2 = this.step2.bind(this);
    this.vali = this.vali.bind(this);
    this.delStep1 = this.delStep1.bind(this);
    this.addStep1 = this.addStep1.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }
  componentDidUpdate() {
    const token_id = (this.props.match.params.token || "").toUpperCase();
    if (token_id && !this.state.set_chain_type && this.props.tokens[token_id]) {
      this.setTypes();
    }
  }
  setTypes = () => {
    const token_id = (this.props.match.params.token || "").toUpperCase();
    const tokens = this.props.tokens;
    if (token_id && tokens[token_id]) {
      const chainTypes = tokens[token_id]["chainTypes"];
      this.setState({
        chainTypes,
        chain_type: chainTypes.length ? chainTypes[0]["chainType"] : "",
        set_chain_type: true,
      });
    }
  };
  setData = (chain_type) => {
    //if (chain_type == this.state.chain_type) return;
    this.setState({
      chain_type,
    });
  };
  onCancel() {
    this.setState({
      isopen: false,
    });
  }
  addStep1() {
    const r = this.vali();
    if (!r) return;
    this.setState({
      verifyType: 8,
      isopen: true,
    });
  }
  delStep1(record, n) {
    this.setState(
      {
        verifyType: 9,
        //isopen: true,
        address: {
          value: "",
          code: record.id,
          msg: "",
        },
        n,
      },
      this.step2
    );
  }
  step2(obj) {
    //window.console.log(obj);
    const token_id = this.props.match.params.token.toUpperCase();
    // let token_id = "";
    // for (let key in this.props.tokens) {
    //   const item = this.props.tokens[key];
    //   if (item.tokenName === token) {
    //     token_id = item.tokenId;
    //   }
    // }
    // verifyType=8 , add
    if (this.state.verifyType === 8) {
      this.props.dispatch({
        type: "finance/address_add",
        payload: {
          token_id,
          address: this.state.address.value,
          // 注释 1
          address_ext: this.state.address_ext.value,
          remark: this.state.remark.value,
          auth_type: obj.auth_type,
          order_id: this.props.order_id,
          verify_code: obj.verify_code,
          chain_type: this.state.chain_type,
        },
        success: () => {
          this.setState({
            isopen: false,
            address: {
              msg: "",
              value: "",
              code: "",
            },
            address_ext: {
              msg: "",
              value: "",
              code: "",
            },
            remark: {
              msg: "",
              value: "",
            },
          });
          this.input2 && this.input2.clear();
        },
        fail: (code) => {
          if (code == 31024 || code == 31015 || code == 31026) {
          } else {
            this.setState({
              isopen: false,
            });
          }
        },
      });
    }
    // verifyType=9 del
    if (this.state.verifyType === 9) {
      this.props.dispatch({
        type: "finance/address_del",
        payload: {
          address_id: this.state.address.code,
          //auth_type: obj.auth_type,
          order_id: this.props.order_id,
          //verify_code: obj.verify_code
        },
        n: this.state.n,
        success: () => {
          this.setState({
            isopen: false,
            address: {
              msg: "",
              value: "",
              code: "",
            },
            remark: {
              msg: "",
              value: "",
            },
            address_ext: {
              msg: "",
              value: "",
              code: "",
            },
          });
        },
      });
    }
  }
  // 验证值是否都有
  vali() {
    const address = this.state.address.value;
    const remark = this.state.remark.value;
    // 注释 1
    const address_ext = this.state.address_ext.value;

    if (!address) {
      this.setState({
        address: {
          value: "",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "此项不能为空",
              })}
            </React.Fragment>
          ),
        },
      });
      return false;
    }
    if (!remark) {
      this.setState({
        remark: {
          value: "",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "此项不能为空",
              })}
            </React.Fragment>
          ),
        },
      });
      return false;
    }
    if (remark && remark.length > 20) {
      this.setState({
        remark: {
          value: remark,
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "备注长度限制20字符以内",
              })}
            </React.Fragment>
          ),
        },
      });
      return false;
    }
    // 注释 1
    // if (address_ext && address_ext.length > 20) {
    //   this.setState({
    //     address_ext: {
    //       value: address_ext,
    //       msg: (
    //         <React.Fragment>
    //           {this.props.intl.formatMessage({
    //             id: "Tag长度限制20字符以内"
    //           })}
    //         </React.Fragment>
    //       )
    //     }
    //   });
    //   return false;
    // }

    return true;
  }
  change(n, e) {
    const t = e.target;
    let value =
      t.type === "checkbox"
        ? t.checked
        : helper.removeEmoji(t.value.replace(/\s/g, ""));
    this.setState({
      [n]: {
        value,
        msg: "",
      },
    });
  }
  dropchange(v) {
    const d = v.value.split("-");
    //this.props.history.push(route_map.address + "/" + d[0]);
  }
  render() {
    const { classes } = this.props;
    const token_id = this.props.match.params.token.toUpperCase();
    const token_name = this.props.tokens[token_id]
      ? this.props.tokens[token_id]["tokenName"]
      : "";
    // let token_id = "";
    let options = [];
    let desc = "";
    let isEOS = false;
    for (let key in this.props.tokens) {
      const item = this.props.tokens[key];
      if (item.tokenId === token_id) {
        // token_id = item.tokenId;
        desc = item.tokenFullName;
        isEOS = item.needAddressTag;
      }
      options.push({
        label: (
          <React.Fragment>
            <span>{item.tokenName}</span>
          </React.Fragment>
        ),
        value: item.tokenId + "-" + item.tokenName,
      });
    }
    const selected = {
      label: token_name,
      value: token_id + "-" + token_name,
    };
    let column = [
      {
        key: "tokenName",
        title: this.props.intl.formatMessage({
          id: "币种",
        }),
      },
      {
        key: "address",
        title: this.props.intl.formatMessage({
          id: "地址",
        }),
      },
      // 注释 1
      {
        key: "addressExt",
        title: "Tag",
        render: (text) => {
          return text || "--";
        },
      },
      {
        key: "remark",
        title: this.props.intl.formatMessage({
          id: "备注",
        }),
      },
      {
        key: "id",
        title: this.props.intl.formatMessage({
          id: "操作",
        }),
        render: (text, record, n) => {
          return (
            <em onClick={this.delStep1.bind(this, record, n)}>
              <FormattedMessage id="删除" />
            </em>
          );
        },
      },
    ];
    if (this.state.chainTypes.length) {
      column.push({
        key: "chainType",
        title: this.props.intl.formatMessage({
          id: "链名称",
        }),
      });
    }
    return (
      <div className={classnames(classes.list, classes.financeCont)}>
        <Grid container className={classnames(classes.address)}>
          {/* <Grid item className={classes.address_s1}>
            <Fab
              href={
                this.props.location.state
                  ? this.props.location.state.path
                  : route_map.finance_list
              }
              className={classes.fab}
              size="small"
            >
              <Iconfont type="arrowLeft" size={30} />
            </Fab>
          </Grid> */}
          <Grid item className={classes.address_s2}>
            <h2>{this.props.intl.formatMessage({ id: "提币地址管理" })}</h2>
            <div className={classes.s2_title}>
              {this.props.tokens[token_id] ? (
                <img src={this.props.tokens[token_id]["iconUrl"]} />
              ) : (
                ""
              )}
              <em>{token_name}</em>
              <span> {desc}</span>
            </div>
            {this.state.chainTypes && this.state.chainTypes.length ? (
              <div className={classes.s2_usdt_title}>
                <p>{this.props.intl.formatMessage({ id: "链名称" })}</p>
                {this.state.chainTypes.map((item) => {
                  return (
                    <Button
                      onClick={this.setData.bind(this, item.chainType)}
                      key={item.chainType}
                      color={
                        item.chainType == this.state.chain_type
                          ? "primary"
                          : "default"
                      }
                      variant="contained"
                      style={{ margin: "0 10px 0 0" }}
                    >
                      {item.chainType}
                    </Button>
                  );
                })}
              </div>
            ) : (
              ""
            )}
            <ul className={classes.s2_form}>
              <li>
                <TextField
                  error={Boolean(this.state.address.msg)}
                  helperText={this.state.address.msg}
                  value={this.state.address.value}
                  fullWidth
                  onChange={this.change.bind(this, "address")}
                  placeholder={this.props.intl.formatMessage({
                    id: "提币地址",
                  })}
                />
              </li>
              {isEOS ? (
                <li>
                  <TextField
                    error={Boolean(this.state.address_ext.msg)}
                    helperText={this.state.address_ext.msg}
                    value={this.state.address_ext.value}
                    onChange={this.change.bind(this, "address_ext")}
                    fullWidth
                    placeholder={this.props.intl.formatMessage({
                      id: "Tag(选填)",
                    })}
                  />
                </li>
              ) : (
                ""
              )}
              <li>
                <TextFieldCN
                  error={Boolean(this.state.remark.msg)}
                  helperText={this.state.remark.msg}
                  value={this.state.remark.value}
                  fullWidth
                  onChange={this.change.bind(this, "remark")}
                  placeholder={this.props.intl.formatMessage({ id: "备注" })}
                />
              </li>
              <li>
                {this.state.loading ? (
                  <Button
                    color="primary"
                    variant="contained"
                    className={classes.btn}
                    disabled
                  >
                    {this.props.intl.formatMessage({
                      id: "确定",
                    })}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.addStep1}
                  >
                    {this.props.intl.formatMessage({
                      id: "确定",
                    })}
                  </Button>
                )}
              </li>
            </ul>
          </Grid>
        </Grid>

        <Table
          className={classes.addressList}
          widthStyle={classes.addressListTitle}
          data={this.props.address_list}
          titles={column}
          hasMore={false}
          loading={this.props.loading.effects["finance/address_list"]}
        />
        <SecVerify
          userinfo={this.props.userinfo}
          dispatch={this.props.dispatch}
          verifyType={this.state.verifyType}
          loading={
            this.state.verifyType === 8
              ? this.props.loading.effects["finance/address_add"]
              : this.props.loading.effects["finance/address_del"]
          }
          isopen={this.state.isopen}
          callback={this.step2}
          onCancel={this.onCancel}
        />
      </div>
    );
  }
}

export default withStyles((theme) => ({
  ...layout_styles(theme),
  ...styles(theme),
}))(injectIntl(Address));
