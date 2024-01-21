import React from "react";
import { injectIntl } from "react-intl";
import Banner from "./Banner";
import CoinplusList from "./CoinplusList";
import { withStyles } from "@material-ui/core/styles";
import styles from "./index_style";
import { productTransfer } from "./transfers";
// import WarnIcon from "@material-ui/icons/Warning";
// import { Stepper, Button, Radio, Checkbox } from "@material-ui/core";

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.dispatch({
      type: "coinplus/getCoinplusListTimer",
      payload: { timer: 20000 },
      dispatch: this.props.dispatch
    });
  }
  lang(str) {
    if (!str) return "";
    return this.props.intl.formatMessage({ id: str });
  }

  render() {
    const c = this.props.classes;
    const list = this.props.coinplusIndexProductList;
    const { classes, ...otherProps } = this.props;
    if (!list || !list.length) return null;
    return (
      <div className={c.container}>
        <Banner />
        <div className={c.coinplusList}>
          <CoinplusList
            {...otherProps}
            productList={list.map(productTransfer)}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Page));
