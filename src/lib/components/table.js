import React from "react";
import classnames from "classnames";
import "../css/table.css";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedMessage, injectIntl } from "react-intl";

/**
 * table component
 * @param {Array} titles 表头 [{key,value}]
 * @param {Array} data 数据 [{titles[0][key]:value}, {titles[1][key]:value}]
 * @param {String} className
 * @param {String} Url
 *
 */
class TableRC extends React.Component {
  constructor() {
    super();
    this.state = {
      h: 0,
    };
    this.renderTitle = this.renderTitle.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.getMore = this.getMore.bind(this);
    this.itemClick = this.itemClick.bind(this);
    this.dataItemClick = this.dataItemClick.bind(this);
  }
  componentDidMount() {
    this.setState({
      h: this.table.offsetHeight,
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.isLast != nextProps.isLast ||
      this.props.widthStyle != nextProps.widthStyle ||
      this.props.getMore != nextProps.getMore ||
      this.props.className != nextProps.className ||
      this.props.data.length != nextProps.data.length ||
      this.props.hasMore != nextProps.hasMore ||
      this.props.refresh != nextProps.refresh ||
      this.props.loading != nextProps.loading ||
      Object.keys(this.props.dataDesc || {}).length !=
        Object.keys(nextProps.dataDesc || {}).length
    ) {
      return true;
    }
    let r = false;
    // 依次比较data的数据
    nextProps.data.map((item, i) => {
      for (let k in item) {
        // todo 优化 这里只要属性值是对象，肯定是true
        if (item[k] != this.props.data[i][k]) {
          r = true;
        }
      }
    });
    Object.keys(nextProps.dataDesc || {}).map((key) => {
      if (
        (nextProps.dataDesc[key].data &&
          this.props.dataDesc[key].data &&
          nextProps.dataDesc[key].data.length !=
            this.props.dataDesc[key].data.length) ||
        nextProps.dataDesc[key].forceUpdate == true
      ) {
        r = true;
      }
    });
    return r;
  }
  getMore() {}
  renderTitle(titles = []) {
    return (
      <div className={classnames("theader", this.props.widthStyle)}>
        {titles.map((item, i) => {
          return <div key={item.key + "title"}>{item.title}</div>;
        })}
      </div>
    );
  }
  itemClick(record) {
    this.props.itemClick && this.props.itemClick(record);
  }
  dataItemClick(reocrd, click) {
    if (click) {
      click(reocrd);
    }
  }
  renderBody(data = [], dataDesc = {}, dataDescKey = "") {
    if (!data.length && !this.props.loading) {
      return (
        <div className="list" ref={(ref) => (this.list = ref)}>
          <div className="noresult">
            <p>
              <img src={require("../../assets/noresult.png")} />
              {this.props.noResultText ? (
                <FormattedMessage id={this.props.noResultText} />
              ) : (
                <FormattedMessage id="暂无记录" />
              )}
            </p>
          </div>
        </div>
      );
    }
    // 自定义表格
    if (this.props.children) {
      return this.props.children;
    }

    const titles = this.props.titles;
    const titles2 = this.props.dataDescTitles;

    return (
      <div className="list" ref={(ref) => (this.list = ref)}>
        {data.map((item, i) => {
          let d = [];
          if (dataDescKey && dataDesc[item[dataDescKey]]) {
            d = dataDesc[item[dataDescKey]].data;
          }
          return (
            <div key={i}>
              <div
                className={classnames("item", this.props.widthStyle)}
                onClick={this.itemClick.bind(this, item)}
              >
                {titles.map((it, n) => {
                  return (
                    <div
                      key={it.key + "item"}
                      onClick={this.dataItemClick.bind(this, item, it.onClick)}
                    >
                      {it.render
                        ? it.render(item[it.key], item, i)
                        : item[it.key]}
                    </div>
                  );
                })}
              </div>
              <div
                className={classnames(
                  this.props.dataStyle,
                  d.length ? "on" : ""
                )}
                style={{
                  height: d.length ? (d.length + 1) * this.props.listHeight : 0,
                }}
              >
                {d.length ? (
                  <div className={classnames(this.props.dataDescTitleStyle)}>
                    {titles2.map((item, i) => {
                      return (
                        <div key={item.key + "title2" + i}>{item.title}</div>
                      );
                    })}
                  </div>
                ) : (
                  ""
                )}
                {d.length
                  ? d.map((itt, n) => {
                      return (
                        <div
                          className={this.props.dataDescStyle}
                          key={"dataDesc" + n}
                        >
                          {titles2.map((it, m) => {
                            return (
                              <div key={itt[dataDescKey] + m}>
                                {it.render
                                  ? it.render(itt[it.key], itt, n)
                                  : itt[it.key]}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
          );
          // }
          // return (
          //   <div
          //     key={i}
          //     className={classnames(s.item, this.props.widthStyle)}
          //     onClick={this.itemClick.bind(this, item)}
          //   >
          //     {titles.map((it, n) => {
          //       return (
          //         <div
          //           key={it.key + "item"}
          //           onClick={this.dataItemClick.bind(this, item, it.onClick)}
          //         >
          //           {it.render
          //             ? it.render(item[it.key], item, i)
          //             : item[it.key]}
          //         </div>
          //       );
          //     })}
          //   </div>
          // );
        })}
      </div>
    );
  }
  render() {
    return (
      <div className={classnames("g-table", this.props.className)}>
        {this.props.notitle ? "" : this.renderTitle(this.props.titles)}
        <div className="tbody" ref={(ref) => (this.table = ref)}>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.props.getMore || this.getMore}
            initialLoad={false}
            hasMore={this.props.hasMore}
            useWindow={this.props.useWindow || false}
            threshold={40}
          >
            {this.renderBody(
              this.props.data,
              this.props.dataDesc,
              this.props.dataDescKey
            )}
          </InfiniteScroll>
          {this.props.loading ? (
            <p className={this.props.data.length ? "loading" : "loading2"}>
              {this.props.intl.formatMessage({ id: "加载中..." })}
            </p>
          ) : (
            ""
          )}
          {!this.props.loading &&
          !this.props.hasMore &&
          this.props.data &&
          this.props.data.length &&
          this.props.showNoMoreData ? (
            <p className="loading">
              {this.props.intl.formatMessage({ id: "无更多数据" })}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default injectIntl(TableRC);
