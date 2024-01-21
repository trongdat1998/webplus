import React, { createRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import styles from "./TokenSelect.style";
import { Iconfont } from "../../lib";

function TokenSelect(props) {
  const {
    classes,
    inputValue,
    selectValue,
    list,
    onSelectChange,
    onInputChange,
  } = props;
  const selectPoperRef = createRef();
  // 是否展示列表
  const [showSelect, setShowSelect] = useState(false);

  const toggleSelectItem = (e) => {
    setShowSelect((visible) => !visible);
    setSearchInput("");
    if (showSelect) {
      // 如果是为了隐藏下拉框，则不传播事件
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  const [searchInput, setSearchInput] = useState("");
  const [tokenList, setTokenList] = useState([]);

  const [selectedToken, setSelectedToken] = useState(props.selectValue);

  const [qty, setQty] = useState(props.inputValue);

  /**
   * 选中某一条
   * @param {}
   * @param {*} item
   */
  const handleSelectItem = (e, item) => {
    onSelectChange(item);
    setShowSelect(false);
    setSearchInput("");
    e.nativeEvent.stopImmediatePropagation();
  };

  useEffect(() => {
    if (list.length && props.selectValue) {
      setSelectedToken(props.selectValue);
    }
  }, [props.selectValue, list.length]);

  useEffect(() => {
    setQty(props.inputValue);
  }, [props.inputValue]);

  useEffect(() => {
    let filteredList = list.filter((item) => {
      return (
        item &&
        (item.tokenName.indexOf((searchInput || "").toUpperCase()) > -1 ||
          item.tokenFullName
            .toUpperCase()
            .indexOf((searchInput || "").toUpperCase()) > -1)
      );
    });
    setTokenList(filteredList);
  }, [searchInput, list]);

  useEffect(() => {
    const cancel = (e) => {
      if (!selectPoperRef.current.contains(e.target) && showSelect) {
        setShowSelect(false);
        setSearchInput("");
      }
    };
    if (showSelect) {
      document.addEventListener("click", cancel, false);
    }
    return () => {
      document.removeEventListener("click", cancel);
    };
  }, [selectPoperRef, showSelect]);

  return (
    <div className={classes.tokenSelectContainer}>
      <div className={classes.inputGroup}>
        <div className="left">
          <label className={classnames("inputLabel")}>{props.label}</label>
          <input
            type="text"
            value={qty}
            onChange={onInputChange}
            placeholder={props.placeholder}
            className={classnames("input")}
          />
        </div>
        <div className={classes.tokenSelect} onClick={toggleSelectItem}>
          <div className="tokenSelect-wrap">
            <img className="token-logo" src={selectedToken.iconUrl} />
            <div className="token-symbol">{selectedToken.tokenName}</div>
          </div>
          <Iconfont
            className={classnames(
              "tokenSelect-icon",
              showSelect ? "reverse" : ""
            )}
            type="arrowDown"
            size={26}
          />
        </div>
      </div>
      <div
        className={classnames(classes.tokenSelectPoper, showSelect ? "on" : "")}
        ref={selectPoperRef}
      >
        <div className={classes.selectPoperHeader}>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className={classes.selectPoperItems}>
          {tokenList.map((item) => (
            <div
              key={item.tokenId}
              className={classes.selectPoperItem}
              onClick={(e) => handleSelectItem(e, item)}
            >
              <img className="token-logo" src={item.iconUrl} />
              <div className="token-symbol">{item.tokenName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

TokenSelect.propTypes = {
  onSelectChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
};
function mapStateToProps(state) {
  return {};
}

export default withStyles(styles)(connect(mapStateToProps)(TokenSelect));
