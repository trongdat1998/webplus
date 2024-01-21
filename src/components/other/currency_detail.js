//  currency list
import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import styles from "./currency_style";
import helper from "../../utils/helper";
import { Button, Grid } from "@material-ui/core";
import TextFieldCN from "../public/textfiled";
import { Iconfont } from "../../lib";
import route_map from "../../config/route_map";

const CurrencyListRC = (props) => {
  const { classes, intl, config, match, history, dispatch } = props;
  const [searchText, setSearch] = useState("");
  const [orderType, setOrderType] = useState(0);
  const [tokenList, setTokenList] = useState([]);
  const [token, setToken] = useState("");
  const [info, setInfo] = useState({
    iconUrl: "",
    tokenName: "",
    tokenFullName: "",
  });
  const [detail, setDetail] = useState({});

  function handleList(v) {
    let tokens = config.token.filter(
      (list) =>
        list.tokenName.indexOf((v || "").toUpperCase()) > -1 ||
        list.tokenFullName.toUpperCase().indexOf((v || "").toUpperCase()) > -1
    );
    if (orderType == 0) {
      setTokenList(tokens);
    } else {
      let data = [...tokens];
      data.sort((a, b) => {
        return a.tokenName.toUpperCase() >= b.tokenName.toUpperCase() ? 1 : -1;
      });
      setTokenList(data);
    }
  }

  function search(e) {
    let v = e.target.value;
    setSearch(v);
    handleList(v);
  }

  function goto(id) {
    history.replace(route_map.currency_list + "/" + id);
    if (!id || detail[id]) {
      return;
    }
    dispatch({
      type: "exchange/token_info",
      payload: {
        token_id: id,
      },
      callback: (data) => {
        detail[id] = data;
        setDetail(detail);
      },
    });
  }

  useEffect(() => {
    setToken(match.params.token);
  }, [match.params.token]);

  useEffect(() => {
    dispatch({
      type: "exchange/token_info",
      payload: {
        token_id: match.params.token,
      },
      callback: (data) => {
        detail[match.params.token] = data;
        setDetail(detail);
      },
    });
  }, []);

  useEffect(() => {
    const tokens = config.token.filter((list) => list.tokenId == token);
    setInfo(
      tokens.length
        ? tokens[0]
        : {
            iconUrl: "",
            tokenName: "",
            tokenFullName: "",
          }
    );
  }, [token, config.token]);

  useEffect(() => {
    handleList(searchText);
  }, [config, config.token, orderType, searchText]);

  return (
    <Grid container className={classes.currency_detail}>
      <Grid item xs={3} className={classes.left}>
        <TextFieldCN
          value={searchText}
          onChange={search}
          placeholder={intl.formatMessage({ id: "搜索币种" })}
          variant="outlined"
          className={classes.textFieldDetail}
          InputProps={{
            endAdornment: <Iconfont type="search" size={24} />,
            classes: {
              root: classes.inputRootDetail,
              focused: classes.inputFocused,
            },
          }}
        />
        <div className={classes.orderBtn}>
          <Button
            className={orderType == 0 ? "select" : ""}
            onClick={() => {
              setOrderType(0);
            }}
          >
            {intl.formatMessage({ id: "默认" })}
          </Button>
          <Button
            className={orderType == 1 ? "select" : ""}
            onClick={() => {
              setOrderType(1);
            }}
          >
            {intl.formatMessage({ id: "按字母" })}
          </Button>
        </div>
        <ul>
          {tokenList.map((item, index) => {
            return (
              <li
                key={index}
                className={item.tokenId == token ? "select" : ""}
                onClick={() => {
                  goto(item.tokenId);
                }}
              >
                <img src={item.iconUrl} />
                <div>
                  <p>{item.tokenName}</p>
                  <p>{item.tokenFullName}</p>
                </div>
                <Iconfont type="arrowRight" size={24} />
              </li>
            );
          })}
        </ul>
      </Grid>
      <Grid item xs={9} className={classes.right}>
        <div className={classes.detail_header}>
          <Iconfont type="brief" size={20} />
          <span
            onClick={() => {
              history.replace(route_map.currency_list);
            }}
          >
            {intl.formatMessage({ id: "币种资料库" })}
          </span>
          <span> / {token}</span>
        </div>
        <div className={classes.info}>
          <div className={classes.part1}>
            <img src={info.iconUrl} />
            <h3>{info.tokenName}</h3>
            <p>{info.tokenFullName}</p>
          </div>
          <div className={classes.part2}>
            <Grid
              container
              className={classes.token_info_link}
              justify="space-between"
            >
              <Grid item xs={6} style={{ padding: "0 40px 0 0" }}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs={4} className="label">
                    <span>
                      {intl.formatMessage({
                        id: "发行时间",
                      })}
                    </span>
                  </Grid>
                  <Grid item xs={8} className="item1">
                    {(detail[token] && detail[token].publishTime) || "--"}
                  </Grid>
                  <Grid item xs={4} className="label">
                    <span>
                      {intl.formatMessage({
                        id: "发行总量",
                      })}
                    </span>
                  </Grid>
                  <Grid item xs={8} className="item1">
                    {detail[token] && detail[token].maxQuantitySupplied
                      ? helper.format(
                          Number(
                            detail[token].maxQuantitySupplied.replace(/,/g, "")
                          )
                        )
                      : "--"}
                  </Grid>
                  <Grid item xs={4} className="label">
                    <span>
                      {intl.formatMessage({
                        id: "流通总量",
                      })}
                    </span>
                  </Grid>
                  <Grid item xs={8} className="item1">
                    {detail[token] && detail[token].currentTurnover
                      ? helper.format(
                          detail[token].currentTurnover.replace(/,/g, "")
                        )
                      : "--"}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container justify="space-between">
                  <Grid item xs={4} className="label">
                    <span>{intl.formatMessage({ id: "白皮书" })}</span>
                  </Grid>
                  <Grid xs={8} item className="item">
                    {detail[token] && detail[token].whitePaperUrl ? (
                      <a
                        href={detail[token].whitePaperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {detail[token].whitePaperUrl}
                      </a>
                    ) : (
                      "--"
                    )}
                  </Grid>
                  <Grid item xs={4} className="label">
                    <span>{intl.formatMessage({ id: "官网" })}</span>
                  </Grid>
                  <Grid xs={8} item className="item">
                    {detail[token] && detail[token].officialWebsiteUrl ? (
                      <a
                        href={detail[token].officialWebsiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {detail[token].officialWebsiteUrl}
                      </a>
                    ) : (
                      "--"
                    )}
                  </Grid>
                  <Grid item xs={4} className="label">
                    <span>
                      {intl.formatMessage({
                        id: "区块查询",
                      })}
                    </span>
                  </Grid>
                  <Grid xs={8} item className="item">
                    {detail[token] && detail[token].exploreUrl ? (
                      <a
                        href={detail[token].exploreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {detail[token].exploreUrl}
                      </a>
                    ) : (
                      "--"
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <div className={classes.token_info_content}>
              <h3>{intl.formatMessage({ id: "币种介绍" })}</h3>
              {detail[token] && detail[token]["description"] ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: helper.dataReform(detail[token]["description"]),
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(injectIntl(CurrencyListRC));
