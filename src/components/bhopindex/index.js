// 首页
import React from "react";
import BannerAnim from "../../utils/banner-anim";
import "../../utils/banner-anim/index.module.css";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
const { Element } = BannerAnim;
const BgElement = Element.BgElement;

class Index extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {
    window.document.body.style.cssText = "background:none";
  }
  componentWillUnmount() {
    window.document.body.style.cssText = "";
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.index_config.logo != nextProps.index_config.logo) {
      return true;
    }
    return false;
  }
  render() {
    let banners = this.props.index_config.banners.length
      ? this.props.index_config.banners
      : "";
    let announcements = this.props.index_config.announcements.length
      ? this.props.index_config.announcements
      : [{}, {}, {}, {}];
    //banner = banner ? banner["imgUrl"] : "";
    let style = {
      margin: "0 0 40px",
    };
    // if (banner) {
    //   style.backgroundImage = "url(" + banner + ")";
    // }
    const { classes } = this.props;
    return (
      <div className={classes.home}>
        <div className={classes.banner}>
          {banners ? (
            <BannerAnim autoPlay autoPlaySpeed={6000} arrow={false} type="grid">
              {banners.map((item, i) => {
                return (
                  <Element key={"b" + i} prefixCls="banner-user-elem">
                    <BgElement
                      key="bg"
                      style={{
                        backgroundImage: `url(${item.imgUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "100%",
                        backgroundSize: "auto 100%",
                      }}
                    >
                      <div key={i} style={{ width: "100%", height: "100%" }}>
                        {item.directUrl || item.imgUrl ? (
                          <a
                            href={item.directUrl || ""}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "block",
                            }}
                          >
                            &nbsp;
                          </a>
                        ) : (
                          ""
                        )}
                      </div>
                    </BgElement>
                  </Element>
                );
              })}
            </BannerAnim>
          ) : (
            ""
          )}
          <div className={classes.notice_bg}>
            <div className={classes.notice}>
              {[1, 2, 3].map((item, i) => {
                return this.props.index_config.announcements &&
                  this.props.index_config.announcements[i] ? (
                  <div key={i}>
                    <a
                      href={
                        this.props.index_config.announcements[i]["directUrl"]
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {this.props.index_config.announcements[i]["title"]}
                    </a>
                    {i < 2 &&
                    this.props.index_config.announcements[i] &&
                    this.props.index_config.announcements.length - 1 != i ? (
                      <span>/</span>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                );
              })}
            </div>
          </div>
        </div>
        {/* <div className={s.con}>
          <p />
          {ps}
          <p />
        </div> */}
      </div>
    );
  }
}

export default withStyles(styles)(Index);
