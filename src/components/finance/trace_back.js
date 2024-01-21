// 资产追溯
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./style";
import { Grid, CircularProgress } from "@material-ui/core";
import moment from "moment";

const colors = {
  ROOT: window.palette.primary.light, // root
  RELEVANT: window.palette.primary.main, // 相关节点
  NODE: window.palette.secondary.dark, // 其他不相关节点
  USER: window.palette.secondary.main, // user
  SELF: window.palette.up.main, // self
};

class TraceBack extends React.Component {
  constructor() {
    super();
    this.state = {
      proofExists: false,
      amount: "",
      createTime: "",
      treeData: [],
      rendered: false,
    };
  }
  componentDidMount() {
    this.loadscript();
    const token_id = this.props.match.params.tokenId;
    if (token_id) {
      this.props.dispatch({
        type: "finance/proff",
        payload: {
          token_id: token_id.toUpperCase(),
        },
        cb: (res) => {
          if (res.code == "OK" && res.data) {
            this.setState({
              proofExists: res.data.proofExists,
              amount: res.data.amount,
              createTime: res.data.createTime,
              treeData:
                res.data.json && res.data.json != "{}"
                  ? [JSON.parse(res.data.json)]
                  : [],
            });
          }
        },
      });
    }
  }
  componentDidUpdate() {
    if (this.state.createTime && this.state.d3 && !this.state.rendered) {
      this.setState(
        {
          rendered: true,
        },
        () => {
          this.draw();
        }
      );
    }
  }
  loadscript = () => {
    const script = document.createElement("script");
    script.async = true;
    script.onload = () => {
      this.setState({
        d3: window.d3,
      });
    };
    script.onerror = () => {
      setTimeout(this.loadscript, 3000);
    };
    script.src = "https://static.nucleex.com/public/d3.min.js";
    document.querySelector("head").appendChild(script);
  };
  draw = () => {
    const classes = this.props.classes;
    const d3 = this.state.d3;
    if (!this.state.treeData[0]) {
      return "";
    }
    const level = this.state.treeData[0]
      ? Number(this.state.treeData[0]["level"]) + 1
      : 10;
    const size = {
      x: 180,
      y: 62,
      r: 6,
      r2: 10,
      t: "0",
      t2: "1em",
      x_range: [0, 920],
    };

    var margin = { top: 40, right: 140, bottom: 40, left: 140 },
      width = 1200 - margin.right - margin.left,
      height = Math.max((level + 2) * size.y, 500) - margin.top - margin.bottom;
    var i = 0,
      duration = 750,
      root;

    var tree = d3.layout.tree().size([height, width]);

    var diagonal = d3.svg.diagonal().projection(function (d) {
      return [d.y, d.x];
    });

    var svg = d3
      .select("#root2")
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = this.state.treeData[0];
    root.x0 = height;
    root.y0 = width;

    update(root);

    function update(source) {
      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);
      // Normalize for fixed-depth.
      // nodes.forEach(function(d, i) {
      //   // d.x =
      //   //   d.depth * size.y -
      //   //   (i < Math.floor(nodes.length / 2) ? size.y * 1.1 : 0);
      //   //
      //   // if (d.y > size.x_range[1]) {
      //   //   d.y = size.x_range[1] - (d.y - size.x_range[1]);
      //   //   //d.y = single_height + single_height - d.y;
      //   // }
      //   // //小于 0
      //   // if (d.y < size.x_range[0]) {
      //   //   d.y = size.x_range[0] + (size.x_range[0] - d.y);
      //   // }
      // });

      // Update the nodes…
      var node = svg.selectAll("g.node").data(nodes, function (d) {
        return d.id || (d.id = ++i);
      });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("data-id", function (d) {
          return (d.children || d._children) && d.level == 1
            ? "level1"
            : d.level;
        })
        .attr("transform", function (d) {
          return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on("click", click);
      nodeEnter
        .append("circle")
        .attr("r", function (d) {
          return d.type == "ROOT" ? size.r2 : size.r;
        })
        .style("fill", function (d) {
          return colors[d.type];
        });

      nodeEnter
        .append("text")
        .attr("x", function (d) {
          return d.children || d._children ? -13 : 13;
        })
        .attr("dy", size.t)
        .attr("text-anchor", function (d) {
          return d.children || d._children ? "end" : "start";
        })
        .text(function (d) {
          return d.amount;
        })
        .style("fill-opacity", 1e-6);
      nodeEnter
        .append("text")
        .attr("x", function (d) {
          return d.children || d._children ? -13 : 13;
        })
        .attr("dy", size.t2)
        .attr("text-anchor", function (d) {
          return d.children || d._children ? "end" : "start";
        })
        .text(function (d) {
          return d.hash;
        })
        .style("fill", "#919598");

      // Transition nodes to their new position.
      var nodeUpdate = node
        .transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

      nodeUpdate
        .select("circle")
        .attr("r", function (d) {
          return d.type == "ROOT" ? size.r2 : size.r;
        })
        .style("fill", function (d) {
          return colors[d.type];
        });

      nodeUpdate.select("text").style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

      nodeExit.select("circle").attr("r", function (d) {
        return d.type == "ROOT" ? size.r2 : size.r;
      });

      nodeExit.select("text").style("fill-opacity", 1e-6);

      // Update the links…
      var link = svg.selectAll("path.link").data(links, function (d) {
        return d.target.id;
      });

      // Enter any new links at the parent's previous position.
      link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("d", function (d) {
          var o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      // Transition links to their new position.
      link.transition().duration(duration).attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", function (d) {
          var o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }

    //<animate attributeName='opacity' dur='2s' values="1;.2;1" repeatCount="indefinite"/>
    // <circle r="6" style="fill: rgb(51, 117, 224);"></circle>
    var a = d3.select("g[data-id=level1]");
    a.append("circle")
      .attr("r", 10)
      .attr("style", "fill: rgb(51, 117, 224);")
      .attr("id", "level_circle");

    d3.select("circle#level_circle")
      .append("animate")
      .attr("attributeName", "opacity")
      .attr("dur", "2s")
      .attr("values", "0.8;.2;0.8")
      .attr("repeatCount", "indefinite");
  };
  render() {
    const { classes } = this.props;
    const token_id = (this.props.match.params.tokenId || "").toUpperCase();
    let token_name = "";
    if (token_id || this.props.config.tokens[token_id]) {
      token_name = this.props.config.tokens[token_id]["tokenName"];
    }
    const loading = this.props.loading || { effects: {} };
    return (
      <div className={classes.trace}>
        <div className={classes.trace_title}>
          <div>
            <h1>
              {this.props.intl.formatMessage({ id: "100%准备金证明" })}
              <a href="" target="_blank" rel="noopener noreferrer">
                {this.props.intl.formatMessage({ id: "详细说明" })} {`>>`}
              </a>
            </h1>
            <p>{this.props.intl.formatMessage({ id: "什么是准备金？" })}</p>
            <p>
              {this.props.intl.formatMessage({
                id: "准备金就是平台留存的资产。100%准备金率就是用户存100 BTC，平台必须保留100 BTC；",
              })}
            </p>
            <p>
              {this.props.intl.formatMessage({
                id: "10%就是存100 BTC，平台可以只保留10 BTC，另外的90 BTC可以做别的事情。",
              })}
            </p>
          </div>
        </div>
        <Grid container className={classes.trace_desc} justify="space-between">
          <Grid item>
            <strong>{this.props.intl.formatMessage({ id: "图例" })}</strong>
            <ul>
              <li>
                <i style={{ background: colors.ROOT }} />
                <span>{this.props.intl.formatMessage({ id: "root节点" })}</span>
              </li>
              <li>
                <i style={{ background: colors.NODE }} />
                <span>{this.props.intl.formatMessage({ id: "节点" })}</span>
              </li>
              <li>
                <i style={{ background: colors.USER }} />
                <span>{this.props.intl.formatMessage({ id: "用户" })}</span>
              </li>
              <li>
                <i style={{ background: colors.SELF }} />
                <span>{this.props.intl.formatMessage({ id: "自己" })}</span>
              </li>
              <li>
                <i style={{ background: colors.RELEVANT }} />
                <span>{this.props.intl.formatMessage({ id: "相关节点" })}</span>
              </li>
            </ul>
          </Grid>
          <Grid item>
            <Grid container justify="flex-end">
              <Grid item>
                <dl>
                  <dt>{this.props.intl.formatMessage({ id: "生成日期" })}</dt>
                  <dd>
                    {Number(this.state.createTime)
                      ? moment
                          .utc(Number(this.state.createTime))
                          .format("YYYY-MM-DD HH:mm:ss")
                      : ""}
                    {Number(this.state.createTime) ? "(UTC)" : ""}
                  </dd>
                </dl>
              </Grid>
              <Grid item>
                <dl>
                  <dt>{this.props.intl.formatMessage({ id: "储值额度" })}</dt>
                  <dd>{this.state.amount}</dd>
                </dl>
              </Grid>
              <Grid item>
                <dl>
                  <dt>{this.props.intl.formatMessage({ id: "币种" })}</dt>
                  <dd>{token_name}</dd>
                </dl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div className={classes.trace_conbox}>
          <div id="root2" className={classes.trace_con}>
            {!this.state.d3 || loading.effects["finance/proff"] ? (
              <Grid
                container
                justify="center"
                alignItems="center"
                style={{ height: 500 }}
              >
                <Grid item>
                  <CircularProgress color="primary" size={40} />
                </Grid>
              </Grid>
            ) : (
              ""
            )}
            {this.state.d3 &&
            !loading.effects["finance/proff"] &&
            !this.state.treeData.length ? (
              <Grid
                container
                justify="center"
                alignItems="center"
                style={{ height: 500 }}
              >
                <Grid item>
                  <p>{this.props.intl.formatMessage({ id: "暂无数据" })}</p>
                </Grid>
              </Grid>
            ) : (
              ""
            )}
          </div>
          <span className={classes.trace_tip}>
            {this.props.intl.formatMessage({ id: "以下数据为真实数据" })}
          </span>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TraceBack));
