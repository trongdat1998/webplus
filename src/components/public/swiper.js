// 
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "./swiper_style";
import { injectIntl } from "react-intl";
import classnames from "classnames";

import { Iconfont } from "../../lib";

class Swiper extends React.Component {
  constructor() {
    super();
    this.state = {
        lists: [],
        slidesPerView: 3,
        thumb: 0,
        width: 391,
        imgWidth: 380,
        height: 180,
        direction: "horizontal",
        position: "translate(0, 0)",
        autoplay: 1000,
        className: "",
        pagination: true
    };
    this.scroll = this.scroll.bind(this);
    this.changeBanner = this.changeBanner.bind(this);
  }
  componentDidMount() {
    let obj = { ...this.state, ...this.props }
    this.setState(obj)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.lists !==
      nextProps.list
    ) {
      this.setState({
        scroll: setTimeout(this.scroll, this.props.autoplay)
      })
    }
  }
  scroll() {
    let n = this.state.thumb;
    const page = Math.ceil(this.state.lists.length/this.state.slidesPerView); // 小banner页数
    // console.log(page)
    // console.log(n)
    if(n == page - 1){
      n = 0;
    }else {
      n = n+1;
    }
    this.changeBanner(n);
  }
  async clickBanner(n) {
    clearTimeout(this.state.scroll);
    await this.setState({
      scroll: null
    });
    this.changeBanner(n);
  }
  changeBanner(n) {
    let position = "";
    if(this.state.direction == "vertical"){
      position = `translate(0, -${n * this.state.height}px)`
    }else {
      position = `translate(-${n * this.state.slidesPerView * this.state.width}px, 0)`
    }
    this.setState({
      position: position,
      thumb: n,
      scroll: setTimeout(this.scroll, this.state.autoplay)
    })
  }
  
  render() {
    const { classes } = this.props;
    const page = Math.ceil(this.state.lists.length/this.state.slidesPerView); // 小banner页数
    let thumb = new Array(page).join(',').split(',');
    return (
        <div className={classnames(classes.banner, this.state.className)}>
            <ul style={{ transform: this.state.position, flexWrap: (this.state.direction == "vertical" ? "wrap" : "")}}>
            {this.state.lists.map((item, index) => {
                return(
                <li key={index} style={{ height: this.state.height, width: this.state.imgWidth, marginRight: this.state.width-this.state.imgWidth }}>
                    <a href={item.directUrl}>
                    <img src={item.imgUrl} style={{ height: this.state.height, width: this.state.imgWidth }}/>
                    </a>
                </li>
                )
            })}
            </ul>
            {this.state.pagination ?
                <div className="thumb">
                    {thumb && thumb.length > 1 ? thumb.map((i, n) => {
                        return (
                        <div 
                            key={n}
                            onClick={this.clickBanner.bind(this, n)}
                        >
                            <span 
                            className={this.state.thumb == n ? "active" : ""}
                            ></span>
                        </div>
                        )
                    }) : ""}
                </div> : ""
            }
        </div>
    );
  }
}
Swiper.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(injectIntl(Swiper));
