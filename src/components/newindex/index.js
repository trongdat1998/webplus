// 首页
import React from "react";
import BannerAnim from "../../utils/banner-anim";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { injectIntl } from "react-intl";
import Swiper from "../public/swiper";
const { Element, Thumb } = BannerAnim;
const BgElement = Element.BgElement;

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      amount: "",
      coin: "USDT",
      slidesPerView: 3,
      thumb: 0,
      width: 391,
      height: 180,
      direction: "vertical",
      position: "translate(0, 0)",
      autoplay: 10000,
    };
  }
  componentDidMount() {
    // window.document.body.style.cssText = "background:none";
    // if (/iphone|android|ipad/i.test(navigator.userAgent)) {
    //   window.location.href = '/m/other/download' + window.location.search;
    // }
  }

  componentWillUnmount() {
    window.document.body.style.cssText = "";
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.index_config.logo != nextProps.index_config.logo ||
      this.state.coin !== nextState.coin
    ) {
      return true;
    }
    return false;
  }
  render() {
    let smallBanners = this.props.index_config.smallBanners.length
      ? this.props.index_config.smallBanners
      : [];
    let banners = this.props.index_config.banners.length
      ? smallBanners.length
        ? this.props.index_config.banners.slice(0, 1)
        : this.props.index_config.banners
      : "";
    // let announcements = this.props.index_config.announcements.length
    //   ? this.props.index_config.announcements
    //   : [{}, {}, {}, {}];
    //banner = banner ? banner["imgUrl"] : "";
    // let style = {
    //   margin: "0 0 40px"
    // };
    // if (banner) {
    //   style.backgroundImage = "url(" + banner + ")";
    // }
    // let ps = [];
    // announcements.map((item, i) => {
    //   if (item.isDirect) {
    //     ps.push(
    //       <a href={item.directUrl} target="_blank" className={s.item} key={i}>
    //         <em>{item.title}</em>
    //       </a>
    //     );
    //   } else {
    //     ps.push(
    //       <p className={s.item} key={i}>
    //         <em>{item.title}</em>
    //       </p>
    //     );
    //   }
    // });
    const { classes } = this.props;
    return (
      <div className={classes.home}>
        <div
          className={classes.banner}
          style={{
            backgroundImage: `url('${require("../../assets/new_index/small_banner_bg.png")}'`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            width: "100%",
            height: 400,
          }}
        >
          {!smallBanners.length && banners ? (
            <BannerAnim
              autoPlay
              autoPlaySpeed={this.state.autoplay}
              arrow={false}
              type="grid"
              ref={(c) => {
                this.banner = c;
              }}
            >
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
                        backgroundSize: "cover",
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
              <Thumb prefixCls="thumb">
                {banners
                  ? banners.map((item, i) => {
                      return (
                        <div key={i} className={classes.thumb}>
                          <span />
                        </div>
                      );
                    })
                  : ""}
              </Thumb>
            </BannerAnim>
          ) : (
            ""
          )}
          {smallBanners && smallBanners.length ? (
            <div className={classes.small_banner_bg}>
              <Swiper
                lists={smallBanners}
                width={296}
                imgWidth={264}
                height={144}
                direction="vertical1"
                autoplay={this.state.autoplay}
                slidesPerView={4}
                className=""
              />
            </div>
          ) : (
            ""
          )}
          {/* <div className={classes.notice_bg}>
            <div className={classes.notice}>
              <Iconfont type="announcement" size={20} style={{marginRight: 5}} />
              {[1, 2, 3].map((item, i) => {
                return this.props.index_config.announcements &&
                  this.props.index_config.announcements[i] ? (
                  <div key={i}>
                    <a
                      href={
                        this.props.index_config.announcements[i]["directUrl"]
                      }
                      target="_blank"
                    >
                      {this.props.index_config.announcements[i]["title"]}
                    </a>
                    {i < 2 &&
                    this.props.index_config.announcements[i] &&
                    this.props.index_config.announcements.length - 1 != i ? (
                      <span>|</span>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                );
              })}
              <a
                href={window.localStorage.lang == "zh-cn" ?
                  "https://bhpc.zendesk.com/hc/zh-cn/categories/360000882773" :
                  "https://bhpc.zendesk.com/hc/en-us/categories/360000882773"}
                target="_blank"
              >
                {this.props.intl.formatMessage({id: "更多"})}
                <Iconfont type="arrowRight" size={20} />
              </a>
            </div>
          </div> */}
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

export default withStyles(styles)(injectIntl(Index));
