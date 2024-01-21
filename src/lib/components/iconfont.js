import React from "react";
import classNames from "classnames";
import "../css/iconfont_new.css";

/*
 *
 *  <Icon size="" color="" type="" className=""></Icon>
 *
 *
 *
 */
function Iconfont(props) {
  let { className, size, color, style, type, loading, ...prop } = props;

  let classSet = new Set();
  let styles = { ...(style || {}) };
  classSet.add("b-icon");
  if (type) {
    classSet.add("b-icon-" + type);
  }
  size = size || 16;
  if (size) {
    styles.fontSize = size + "px";
  }
  if (className) {
    classSet.add(className);
  }
  return (
    <i {...prop} className={classNames(Array.from(classSet))} style={styles}>
      {props.children}
    </i>
  );
}

export default Iconfont;
