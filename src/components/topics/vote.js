import React from "react";
import { Button, Dialog, DialogContent } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./vote_style";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import classnames from "classnames";
import helper from "../../utils/helper";
import math from "../../utils/mathjs";
import { message } from "../../lib";

class VoteRC extends React.Component {
  constructor() {
    super();
    this.state = {
      opt: 0,
      loading: false,
      open: false,
      detailRule: false,
      detailRule02: false
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (helper.changeVersion() && id) {
      window.location.href = "/activity/vote/?id=" + id;
    }
    if (id) {
      this.init();
    }
  }
  init = () => {
    const id = this.props.match.params.id;
    this.props.dispatch({
      type: "topic/get_vote_info",
      payload: {
        voteId: id
      }
    });
  };
  check(v) {
    let opt = this.state.opt;
    this.setState({
      opt: opt == v ? 0 : v
    });
  }
  openRule(name) {
    const v =
      name == "detailRule" ? this.state.detailRule : this.state.detailRule02;
    this.setState({
      [name]: !v
    });
  }
  async vote() {
    const id = this.props.match.params.id;
    const opt = this.state.opt;
    const that = this;
    if (opt) {
      await this.setState({
        loading: true
      });
      this.props.dispatch({
        type: "topic/vote",
        payload: {
          voteId: id,
          opt
        },
        callback: () => {
          that.setState({
            loading: false,
            opt: 0,
            open: true
          });
          setTimeout(function () {
            that.setState({
              open: false
            });
          }, 2000);
        },
        error: () => {
          that.setState({
            loading: false,
            opt: 0
          });
        }
      });
    } else {
      message.tip(this.lang("activity.vote.selectFirst"));
      this.setState({
        loading: false,
        opt: 0
      });
    }
  }

  lang(str) {
    if (!str) return "";
    return this.props.intl.formatMessage({ id: str });
  }
  render() {
    const { classes, vote_info, get_vote_info, vote_result } = this.props;
    let userId = this.props.userinfo && this.props.userinfo.userId;
    let voteId = this.props.match.params.id;
    let result = vote_result["1"]
      ? math
          .chain(math.bignumber(vote_result["1"]))
          .divide(vote_info.total)
          .multiply(100)
          .format({ notation: "fixed", precision: 2 })
          .done()
      : 0;

    let result2 = vote_result["2"]
      ? math
          .chain(math.bignumber(vote_result["2"]))
          .divide(vote_info.total)
          .multiply(100)
          .format({ notation: "fixed", precision: 2 })
          .done()
      : 0;
    let width = 0,
      maskp = 0;
    if (get_vote_info && !result && !result2) {
      width = 50;
    } else {
      width = result;
    }
    maskp = width > 96 ? 96 : width < 4 ? 4 : width;
    const bannerMap = {
      "1": "activity.vote.headImage",
      "2": "activity.vote2.headImage",
      "3": "activity.vote3.headImage"
    };
    const optionAMap = {
      "1": "activity.vote.option.a",
      "2": "activity.vote2.option.a",
      "3": "activity.vote3.option.a"
    };
    const optionAContentAMap = {
      "1": "activity.vote.option.aContent.a",
      "2": "activity.vote2.option.aContent.a",
      "3": "activity.vote3.option.aContent.a"
    };
    const optionAContentBMap = {
      "1": "activity.vote.option.aContent.b",
      "3": "activity.vote3.option.aContent.b"
    };
    const optionBMap = {
      "1": "activity.vote.option.b",
      "2": "activity.vote2.option.b",
      "3": "activity.vote3.option.b"
    };
    const optionBContentAMap = {
      "1": "activity.vote.option.bContent.a",
      "2": "activity.vote2.option.bContent.a",
      "3": "activity.vote3.option.bContent.a"
    };
    const optionBContentBMap = {
      "1": "activity.vote.option.bContent.b",
      "3": "activity.vote3.option.bContent.b"
    };
    const rulesDtailMap = {
      "1": "activity.vote.rulesDtail",
      "2": "activity.vote2.rulesDtail",
      "3": "activity.vote3.rulesDtail"
    };
    const banner = this.lang(bannerMap[voteId]);
    return (
      <div className={classes.vote_bg}>
        <div
          className={classes.banner}
          style={{
            backgroundImage: `url(${banner})`
          }}
        ></div>
        <div className={classes.content}>
          <div className={classes.vote}>
            <div
              className="approve"
              style={{
                width: width + "%"
              }}
            >
              <i></i>
              <div
                className={classnames("bg", get_vote_info ? "start" : "")}
              ></div>
            </div>
            <div
              className="oppose"
              style={{
                width: 100 - width + "%"
              }}
            >
              <i></i>
              <div
                className={classnames("bg", get_vote_info ? "start" : "")}
              ></div>
            </div>
            <div
              className="mask"
              style={{ left: get_vote_info ? `calc(${maskp}% - 10px)` : "" }}
            ></div>
            <div className="vote-p">
              <p>
                {result}% <span>{vote_result["1"] || 0}</span>
                {this.lang("activity.vote.voteNum")}
              </p>
              <p>
                <span>{vote_result["2"] || 0}</span>
                {this.lang("activity.vote.voteNum")} {result2}%
              </p>
            </div>
          </div>
          <div className={classes.section}>
            <div className={classes.top}>
              <em onClick={this.check.bind(this, 1)}>
                {this.state.opt == 1 ? (
                  <img src={require("../../assets/vote/approve_icon.png")} />
                ) : (
                  ""
                )}
              </em>
              <p>{this.lang(optionAMap[voteId])}</p>
              <a
                onClick={this.openRule.bind(this, "detailRule")}
                className={this.state.detailRule ? "open" : ""}
              >
                {this.lang("activity.vote.more")}
                <i></i>
              </a>
            </div>
            <div
              className={classes.down}
              style={{ height: this.state.detailRule ? "auto" : "" }}
            >
              <h4>{this.lang("activity.vote.optionTitle.a")}</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: this.lang(optionAContentAMap[voteId])
                }}
              ></div>
              {voteId == "2" ? (
                ""
              ) : (
                <h4>{this.lang("activity.vote.optionTitle.b")}</h4>
              )}
              {voteId == "2" ? (
                ""
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.lang(optionAContentBMap[voteId])
                  }}
                ></div>
              )}
            </div>
          </div>
          <div className={classnames(classes.section, "section02")}>
            <div className={classnames(classes.top, "top02")}>
              <em onClick={this.check.bind(this, 2)}>
                {this.state.opt == 2 ? (
                  <img src={require("../../assets/vote/oppose_icon.png")} />
                ) : (
                  ""
                )}
              </em>
              <p>{this.lang(optionBMap[voteId])}</p>
              <a
                onClick={this.openRule.bind(this, "detailRule02")}
                className={this.state.detailRule02 ? "open" : ""}
              >
                {this.lang("activity.vote.more")}
                <i></i>
              </a>
            </div>
            <div
              className={classnames(classes.down, "down02")}
              style={{ height: this.state.detailRule02 ? "auto" : "" }}
            >
              <h4>{this.lang("activity.vote.optionTitle.a")}</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: this.lang(optionBContentAMap[voteId])
                }}
              ></div>
              {voteId == "2" ? (
                ""
              ) : (
                <h4>{this.lang("activity.vote.optionTitle.b")}</h4>
              )}

              {voteId == "2" ? (
                ""
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.lang(optionBContentBMap[voteId])
                  }}
                ></div>
              )}
            </div>
          </div>
          {userId ? (
            vote_info.isLeader ? (
              vote_info.isVoted ? (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  className={classnames(classes.btn, "voted")}
                >
                  {this.lang("activity.vote.buttonVoted")}
                </Button>
              ) : this.state.loading ? (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  className={classes.btn}
                >
                  ...
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  className={classes.btn}
                  onClick={this.vote.bind(this)}
                >
                  {this.lang("activity.vote.buttonVote")}
                </Button>
              )
            ) : (
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                className={classes.btn}
              >
                {this.lang("activity.vote.noVoting")}
              </Button>
            )
          ) : (
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              className={classes.btn}
              href={
                route_map.login +
                "?redirect=" +
                encodeURIComponent(window.location.href)
              }
            >
              {this.lang("activity.vote.buttonLogin")}
            </Button>
          )}
          <div className={classes.rule}>
            <h3>{this.lang("activity.vote.rule")}</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: this.lang(rulesDtailMap[voteId])
              }}
            ></div>
          </div>
        </div>
        <Dialog open={this.state.open} classes={{ root: classes.dialog }}>
          <DialogContent>
            <img src={require("../../assets/vote/success.png")} />
            <p>{this.lang("activity.vote.voteSuccess")}</p>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(VoteRC));
