// 盘口、历史成交列表切换
import React from "react";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import styles from "../public/quote_style";
import Handicap from "./handicap";
import LastTrading from "./lastTrading";

class HandicapOrLastTrading extends React.Component {
  constructor() {
    super();
    this.state = {
      item: 1
    };
  }
  changeItem(n){
    this.setState({
      item: n
    })
  }
  renderItem() {
    if(this.state.item == 1) {
      return(
        <Handicap 
          {...this.props}
        />
      )
    }
    return (
      <LastTrading 
        {...this.props}
      />
    )
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.handicap_bg}>
        <div className={classes.handicap_title}>
          <span className={this.state.item == 1 ? "on" : ""} onClick={this.changeItem.bind(this, 1)}>
            {this.props.intl.formatMessage({
              id: "盘口"
            })}
          </span>
          <span className={this.state.item == 2 ? "on" : ""} onClick={this.changeItem.bind(this, 2)}>
            {this.props.intl.formatMessage({
              id: "最新成交"
            })}
          </span>
        </div>
        {this.renderItem()}
      </div>
    )
  }
}

export default withStyles(styles)(injectIntl(HandicapOrLastTrading));