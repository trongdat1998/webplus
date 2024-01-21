// 充币
import React from "react";
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from "react-intl";
import { message, Iconfont } from "../../lib";
import route_map from "../../config/route_map";
import { CopyToClipboard } from "react-copy-to-clipboard";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import layout_styles from "../layout_style";
import { Grid, Button, Paper, Fab } from "@material-ui/core";

class Rechange extends React.Component {
  constructor() {
    super();
    this.state = {
      copied: false,
      jump: false,
      chain_type: "",
      error_msg: "",
      error_code: "",
    };
    this.copy = this.copy.bind(this);
  }
  componentDidMount() {
    this.setState({
      jump: false,
      to: "",
    });
    const token = (this.props.match.params.token || "").toUpperCase();
    if (this.props.tokens && this.props.tokens[token]) {
      const chainTypes = this.props.tokens[token]["chainTypes"] || [];
      const chain_type =
        chainTypes.length && chainTypes[0]["allowDeposit"]
          ? chainTypes[0]["chainType"]
          : "";
      this.getData(token, chain_type);
    }
  }
  componentWillReceiveProps(nextProps) {
    const token = (this.props.match.params.token || "").toUpperCase();
    if (!token) return;
    if (!this.props.tokens[token] && nextProps.tokens[token]) {
      const chainTypes = nextProps.tokens[token]["chainTypes"] || [];
      const chain_type =
        chainTypes.length && chainTypes[0]["allowDeposit"]
          ? chainTypes[0]["chainType"]
          : "";
      this.getData(token, chain_type);
    }
  }
  getData = (token, chain_type) => {
    const loading = Boolean(
      this.props.loading &&
        this.props.loading["effects"] &&
        this.props.loading["effects"]["finance/getAddress"]
    );
    if ((chain_type && chain_type == this.state.chain_type) || loading) return;
    this.props.dispatch({
      type: "finance/propsChange",
      payload: {
        deposit: {},
      },
    });
    this.setState(
      {
        chain_type,
        error_msg: "",
        error_code: "",
      },
      () => {
        this.props.dispatch({
          type: "finance/getAddress",
          payload: {
            token_id: token,
            chain_type: chain_type,
          },
          errorCallback: (code, msg) => {
            if (msg) {
              this.setState({
                error_code: code,
                error_msg: msg,
              });
            }
          },
        });
      }
    );
  };
  componentWillUnmount() {
    this.props.dispatch({
      type: "finance/propsChange",
      payload: {
        deposit: {},
      },
    });
  }
  copy() {
    this.setState({
      copied: true,
    });
    message.info(
      this.props.intl.formatMessage({
        id: "复制成功",
      })
    );
  }
  render() {
    const token = (this.props.match.params.token || "").toUpperCase();
    const allTokens = this.props.tokens || {};
    if (allTokens["BTC"] && !allTokens[token]) {
      const url =
        window.location.protocol +
        "//" +
        window.location.host +
        route_map.finance_list;
      return (window.location.href = url);
    }

    let desc = "";
    for (let key in this.props.tokens) {
      const item = this.props.tokens[key];
      if (item.tokenId === token) {
        desc = item.tokenFullName;
      }
    }
    const { classes } = this.props;
    const chainTypes = allTokens[token] ? allTokens[token]["chainTypes"] : [];
    const loading = Boolean(
      this.props.loading &&
        this.props.loading["effects"] &&
        this.props.loading["effects"]["finance/getAddress"]
    );
    return (
      <Grid
        container
        className={classnames(classes.g_layout, classes.rechange)}
      >
        {/* <Grid item className={classes.rechange_s1}>
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
        <Grid item className={classes.rechange_s2}>
          <h2>{this.props.intl.formatMessage({ id: "充币" })}</h2>

          <div className={classes.s2_title}>
            {this.props.tokens[token] ? (
              <img src={this.props.tokens[token]["iconUrl"]} />
            ) : (
              ""
            )}
            <em>
              {this.props.tokens[token]
                ? this.props.tokens[token]["tokenName"]
                : ""}
            </em>
            <span> {desc}</span>
          </div>

          {chainTypes && chainTypes.length ? (
            <div className={classes.s2_usdt_title}>
              <p>{this.props.intl.formatMessage({ id: "链名称" })}</p>
              {chainTypes.map((item) => {
                if (item.allowDeposit) {
                  if (item.chainType == this.state.chain_type) {
                    return (
                      <Button
                        onClick={this.getData.bind(this, token, item.chainType)}
                        key={item.chainType}
                        variant="outlined"
                        color="primary"
                        style={{
                          margin: "0 10px 0 0",
                          padding: "5px 32px",
                          background: `url(${require("../../assets/btn_check.png")})  no-repeat right bottom`,
                        }}
                        className={
                          item.chainType == this.state.chain_type
                            ? ""
                            : classes.chain_type
                        }
                      >
                        {item.chainType}
                      </Button>
                    );
                  } else {
                    return (
                      <Button
                        onClick={this.getData.bind(this, token, item.chainType)}
                        key={item.chainType}
                        variant="contained"
                        style={{ margin: "0 10px 0 0", padding: "6px 32px" }}
                        className={
                          item.chainType == this.state.chain_type
                            ? ""
                            : classes.chain_type
                        }
                      >
                        {item.chainType}
                      </Button>
                    );
                  }
                } else {
                  return (
                    <Button
                      disabled
                      variant="contained"
                      style={{ margin: "0 10px 0 0" }}
                      key={item.chainType}
                    >
                      {item.chainType}
                    </Button>
                  );
                }
              })}
            </div>
          ) : (
            ""
          )}
          <div className={classes.s2_address}>
            <h3>{this.props.intl.formatMessage({ id: "充币地址" })}</h3>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <p>
                  {this.props.deposit.allowDeposit === false
                    ? this.props.intl.formatMessage({ id: "充币已关闭" })
                    : this.props.deposit.address}
                </p>
              </Grid>
              <Grid item>
                {this.props.deposit.address &&
                this.props.deposit.allowDeposit === true ? (
                  <CopyToClipboard
                    text={this.props.deposit.address}
                    onCopy={this.copy}
                  >
                    <Button color="primary" variant="contained">
                      {this.props.intl.formatMessage({
                        id: "复制地址",
                      })}
                    </Button>
                  </CopyToClipboard>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </div>
          {this.props.deposit.needAddressTag &&
          this.props.deposit.allowDeposit === true ? (
            <div className={classes.s2_address}>
              <h3>TAG</h3>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <p>{this.props.deposit.addressExt}</p>
                </Grid>
                <Grid>
                  <CopyToClipboard
                    text={this.props.deposit.addressExt}
                    onCopy={this.copy}
                  >
                    <Button color="primary" variant="contained">
                      {this.props.intl.formatMessage({
                        id: "复制",
                      })}
                      TAG
                    </Button>
                    {/*  <FormattedMessage id="复制地址" /> 不可用，影响copy */}
                  </CopyToClipboard>
                </Grid>
              </Grid>
            </div>
          ) : (
            ""
          )}
          {this.props.deposit.needAddressTag ? (
            <label className={classes.taglevel}>
              Tag{" "}
              <FormattedMessage id="(充币时请务必填写Tag并仔细核对，否则将造成资产损失并不可找回)" />
            </label>
          ) : (
            ""
          )}
          <p className={classes.rechange_error_msg}>
            {this.state.error_msg}{" "}
            {this.state.error_code == 31102 ? (
              <a href={route_map.setpwd}>
                {this.props.intl.formatMessage({ id: "设置密码" })}
              </a>
            ) : (
              ""
            )}
          </p>
          <div className={classes.s2_desc}>
            <p>{this.props.intl.formatMessage({ id: "温馨提示" })}</p>
            <ul>
              <li>
                <FormattedHTMLMessage
                  tagName="span"
                  id="deposit.desc.1"
                  values={{
                    name: this.props.tokens[token]
                      ? this.props.tokens[token]["tokenName"]
                      : "",
                  }}
                />
              </li>
              <li>
                <FormattedHTMLMessage
                  tagName="span"
                  id="deposit.desc.4"
                  values={{
                    token: this.props.tokens[token]
                      ? this.props.tokens[token]["tokenName"]
                      : "",
                    v: this.props.deposit.requiredConfirmNum
                      ? this.props.deposit.requiredConfirmNum
                      : "",
                    m: this.props.deposit
                      ? this.props.deposit.canWithdrawConfirmNum
                      : "",
                  }}
                />
              </li>
              <li>
                <FormattedHTMLMessage
                  tagName="span"
                  id="deposit.desc.2"
                  values={{
                    name: this.props.tokens[token]
                      ? this.props.tokens[token]["tokenName"]
                      : "",
                  }}
                />
              </li>
              <li>
                <FormattedHTMLMessage
                  tagName="span"
                  id="deposit.desc.3"
                  values={{
                    name: this.props.deposit.minQuantity || "",
                  }}
                />
              </li>
              <li>
                <FormattedHTMLMessage
                  tagName="span"
                  id="deposit.desc.5"
                  values={{
                    name: this.props.deposit.minQuantity || "",
                  }}
                />
              </li>
              {this.props.deposit.tokenType == "ERC20_TOKEN" ? (
                <li>
                  <FormattedHTMLMessage
                    tagName="span"
                    id="deposit.desc.erc20"
                    values={{
                      name: this.props.tokens[token]
                        ? this.props.tokens[token]["tokenName"]
                        : "",
                    }}
                  />
                </li>
              ) : (
                ""
              )}
              {token == "ETH" ? (
                <li>
                  <FormattedHTMLMessage tagName="span" id="deposit.desc.eth" />
                </li>
              ) : (
                ""
              )}
              {token == "ETH" ? (
                <li>
                  <FormattedHTMLMessage tagName="span" id="deposit.desc.eth2" />
                </li>
              ) : (
                ""
              )}
              {token == "ZEC" ? (
                <li>
                  <FormattedHTMLMessage tagName="span" id="deposit.desc.zec" />
                </li>
              ) : (
                ""
              )}
              {token == "TRX" ? (
                <li>
                  <FormattedHTMLMessage tagName="span" id="deposit.desc.trx" />
                </li>
              ) : (
                ""
              )}
            </ul>
          </div>
        </Grid>
        <Grid item className={classes.rechange_s3}>
          <p className={classes.s3_link}>
            <Button
              variant="outlined"
              color="primary"
              href={route_map.finance_record}
            >
              {this.props.intl.formatMessage({ id: "充币记录" })}
            </Button>
          </p>
          {this.props.deposit.allowDeposit === true ? (
            <Paper className={classes.qrcode}>
              {this.props.deposit && this.props.deposit.qrcode ? (
                <img
                  src={"data:image/png;base64," + this.props.deposit.qrcode}
                />
              ) : (
                ""
              )}
              <p>{this.props.intl.formatMessage({ id: "扫描二维码" })}</p>
            </Paper>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles((theme) => ({
  ...layout_styles(theme),
  ...styles(theme),
}))(injectIntl(Rechange));
