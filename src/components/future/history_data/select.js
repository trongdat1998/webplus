import React from "react";
import classnames from "classnames";
import helper from "../../../utils/helper";
import { injectIntl } from "react-intl";
import WSDATA from "../../../models/data_source";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { Grid } from "@material-ui/core";
import CONST from "../../../config/const";
import route_map from "../../../config/route_map";
import { Iconfont } from "../../../lib";
import TextfileCN from "../../public/textfiled";

let timer = null;
class MenuRC extends React.Component {
  constructor() {
    super();
    this.state = {
      sid: "",
      sname: "",
      eid: "",
      show: false,
      search_text: "",
      data: [],
    };
  }
  componentDidMount() {
    let symbol = null;
    const symbol_id = this.props.match.params.symbol_id || "";
    if (symbol_id) {
      (this.props.config.futuresSymbol || []).map((item) => {
        if (item.symbolId == symbol_id.toUpperCase()) {
          symbol = item;
        }
      });
    } else {
      symbol =
        this.props.config.futuresSymbol &&
        this.props.config.futuresSymbol.length
          ? this.props.config.futuresSymbol[0]
          : null;
    }
    this.setState({
      data: this.props.config.futuresSymbol,
    });
    if (!symbol) {
      return;
    }
    this.choose(
      symbol.symbolId,
      symbol.symbolName,
      symbol.exchangeId,
      symbol.baseTokenFutures.displayIndexToken
    )();
  }
  search = (e) => {
    const v = e.target.value;
    let data = [];
    const text = v.toUpperCase();
    (this.props.config.futuresSymbol || []).map((item) => {
      if (
        item.symbolId.indexOf(text) > -1 ||
        item.symbolName.indexOf(text) > -1
      ) {
        data.push(item);
      }
    });
    this.setState({
      data,
      search_text: v,
    });
  };
  show = () => {
    clearTimeout(timer);
    timer = null;
    this.setState({
      show: true,
    });
  };
  hide = () => {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      this.setState({
        show: false,
      });
      timer = null;
    }, 100);
  };
  choose = (sid, sname, eid, indexToken) => () => {
    if (sid == this.state.sid) {
      return;
    }
    this.setState(
      {
        search_text: "",
        show: false,
        sid: sid,
        sname: sname,
        eid: eid,
        data: this.props.config.futuresSymbol,
      },
      () => {
        this.props.onChange && this.props.onChange(sid, sname, eid, indexToken);
      }
    );
  };
  clear = () => {
    this.setState({
      search_text: "",
      data: this.props.config.futuresSymbol,
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classnames(classes.select, this.state.show ? "on" : "")}>
        <div
          className={classes.selectValue}
          onClick={this.show}
          onMouseLeave={this.hide}
        >
          <span>{this.state.sname}</span>
          <Iconfont type="arrowDown" />
        </div>
        <div
          className={classnames(
            classes.selectOptions,
            this.state.show ? "on" : ""
          )}
          onMouseLeave={this.hide}
          onMouseEnter={this.show}
        >
          <TextfileCN
            variant="outlined"
            value={this.state.search_text}
            onChange={this.search}
            className={classes.selectSearch}
            placeholder={this.props.intl.formatMessage({ id: "搜索" })}
            InputProps={{
              startAdornment: <Iconfont type="search" size={24} value="" />,
              endAdornment: this.state.search_text ? (
                <Iconfont type="delete" size={24} onClick={this.clear} />
              ) : (
                ""
              ),
              classes: {
                root: classes.selectSearchRoot,
                input: classes.selectSearchInput,
              },
            }}
          />
          <ul className={classes.selectOption}>
            {this.state.data.map((item) => {
              return (
                <li
                  onClick={this.choose(
                    item.symbolId,
                    item.symbolName,
                    item.exchangeId,
                    item.baseTokenFutures.displayIndexToken
                  )}
                  key={item.symbolId}
                >
                  {item.symbolName}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(MenuRC));
