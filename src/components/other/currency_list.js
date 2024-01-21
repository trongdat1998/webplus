//  currency list
import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import styles from "./currency_style";
import classnames from "classnames";
import helper from "../../utils/helper";
import { Button } from "@material-ui/core";
import TextFieldCN from "../public/textfiled";
import { Iconfont } from "../../lib";
import route_map from "../../config/route_map";

const CurrencyListRC = (props) => {
  const { classes, intl, config, history } = props;
  const [searchText, setSearch] = useState("");
  const [orderType, setOrderType] = useState(0);
  const [tokenList, setTokenList] = useState([]);

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

  useEffect(() => {
    handleList(searchText);
  }, [config, config.token, orderType, searchText]);

  return (
    <div className={classes.currency_list}>
      <h2>{intl.formatMessage({ id: "币种资料库" })}</h2>
      <div>
        <div className={classes.bar}>
          <Button
            className={orderType == 0 ? "select" : ""}
            onClick={() => {
              setOrderType(0);
            }}
          >
            {intl.formatMessage({ id: "默认排序" })}
          </Button>
          <Button
            className={orderType == 1 ? "select" : ""}
            onClick={() => {
              setOrderType(1);
            }}
          >
            {intl.formatMessage({ id: "按字母排序" })}
          </Button>
          <TextFieldCN
            value={searchText}
            onChange={search}
            placeholder={intl.formatMessage({ id: "搜索币种" })}
            variant="outlined"
            className={classes.textField}
            InputProps={{
              endAdornment: <Iconfont type="search" size={24} />,
              classes: {
                root: classes.inputRoot,
                focused: classes.inputFocused,
              },
            }}
          />
        </div>
        <ul>
          {tokenList.map((item, index) => {
            return (
              <li
                key={index}
                onClick={() => {
                  history.replace(route_map.currency_list + "/" + item.tokenId);
                }}
              >
                <img src={item.iconUrl} />
                <p className={classes.name}>{item.tokenName}</p>
                <p className={classes.fullName}>{item.tokenFullName}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default withStyles(styles)(injectIntl(CurrencyListRC));
