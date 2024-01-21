import React from "react";
import classNames from "classnames";
// import Icon from "./icon";
import "../css/button.css";

/*
 *
 *  <Button loading="" type=""></Button>
 *
 *
 *
 */
function Button(props) {
  let { className, type, disabled, button_type, loading, ...prop } = props;

  let classSet = new Set();
  classSet.add("g-btn");
  if (type) {
    let arr = type.split(" ");
    for (let i = 0; i < arr.length; i++) {
      classSet.add("g-btn-" + arr[i]);
    }
  }
  if (loading) {
    classSet.add("g-btn-" + loading);
  }
  if (className) {
    classSet.add(className);
  }
  if (loading) {
    return (
      <button
        {...prop}
        className={classNames(Array.from(classSet))}
        disabled="disable"
      >
        {/* <Icon type="loading-3-quarters" loading /> */}
      </button>
    );
  }
  if (button_type) {
    return (
      <button
        {...prop}
        type={button_type}
        className={classNames(Array.from(classSet))}
        disabled={loading || disabled ? "disable" : disabled}
        onDoubleClick={() => {
          //window.console.log("onDoubleClick");
        }}
      >
        {props.children}
      </button>
    );
  }
  return (
    <button
      {...prop}
      className={classNames(Array.from(classSet))}
      disabled={loading || disabled ? "disable" : disabled}
      onDoubleClick={() => {
        //window.console.log("onDoubleClick");
      }}
    >
      {props.children}
    </button>
  );
}

export default Button;
