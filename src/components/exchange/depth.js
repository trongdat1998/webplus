import React from "react";
import classnames from "classnames";
import helper from "../../utils/helper";
import { injectIntl } from "react-intl";
import math from "../../utils/mathjs";
import WSDATA from "../../models/data_source";
import { withStyles } from "@material-ui/core/styles";
import styles from "../public/quote_style";
import { Grid } from "@material-ui/core";
import CONST from "../../config/const";

let state_data = {};
let sell_data = [];
let buy_data = [];
let maxAmount_data = 1;
let mouse_position = [];
let palette2 = window.palette2[localStorage.quoteMode];
class DepthChart extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
      gap: 6,
      color: ["", palette2.grey[300], palette2.grey[500]], // buy ,sell, textcolor
      bgColor: palette2.grey[800],
      sell: [
        helper.hex_to_rgba(window.palette.down.main, 0.4),
        helper.hex_to_rgba(window.palette.down.main, 0.1),
        window.palette.down.main,
      ],
      buy: [
        helper.hex_to_rgba(window.palette.up.main, 0.4),
        helper.hex_to_rgba(window.palette.up.main, 0.1),
        window.palette.up.main,
      ],
      space: [140, 50],
      limit: 100,
      // 浮层样式
      descStyle: {
        w: 240,
        h: 140,
        r: [20, 12],
        text: "22px 'Roboto', 'Helvetica', 'Arial', sans-serif",
        textColor: palette2.white,
        bgColor: helper.hex_to_rgba(palette2.black, 0.8),
        pointColor: [
          helper.hex_to_rgba(window.palette.down.main, 0.3),
          window.palette.down.main,
          helper.hex_to_rgba(window.palette.up.main, 0.3),
          window.palette.up.main,
        ],
      },
    };
    this.draw = this.draw.bind(this); // 深度图
    this.drawLayer = this.drawLayer.bind(this); // 原点及价格浮层绘图
    this.getPoint = this.getPoint.bind(this);
    this.clear = this.clear.bind(this);

    this.reset = this.reset.bind(this);
    this.change = this.change.bind(this);
  }
  componentDidMount() {
    this.update();
  }
  update = async () => {
    if (this.props.chartType == "depth") {
      this.reset();
    }
    await helper.delay(CONST.refresh_depth);
    this.update();
  };
  shouldComponentUpdate(preProps) {
    if (
      preProps.chartType != this.props.chartType ||
      preProps.symbol_id != this.props.symbol_id ||
      preProps.quoteMode != this.props.quoteMode
    ) {
      return true;
    }
    return false;
  }
  componentDidUpdate(preProps, preState) {
    // 换肤不需要改变订阅
    if (preProps.quoteMode != this.props.quoteMode) {
      return;
    }
    // 不展示深度图的时候，取消深度数据订阅
    if (this.props.chartType != "depth") {
      this.cancel("depth" + preProps.exchange_id + "." + preProps.symbol_id);
      this.cancel(
        "depth" + this.props.exchange_id + "." + this.props.symbol_id
      );
    }
    // 展示深度图的时候，尝试取消之前币对的深度数据，重新订阅当前币对的数据
    if (this.props.symbol_id && this.props.chartType == "depth") {
      // 取消之前的订阅
      if (preProps.exchange_id && preProps.symbol_id) {
        this.cancel("depth" + preProps.exchange_id + "." + preProps.symbol_id);
      }
      // 重新订阅
      this.sub(this.props.exchange_id, this.props.symbol_id);
    }
    if (preProps.quoteMode != this.props.quoteMode) {
      palette2 = window.palette2[this.props.quoteMode];
      let descStyle = this.state.descStyle;
      descStyle.textColor = palette2.white;
      (descStyle.bgColor = helper.hex_to_rgba(palette2.black, 0.8)),
        this.setState({
          color: ["", palette2.grey[300], palette2.grey[500]], // buy ,sell, textcolor
          bgColor: palette2.grey[800],
          descStyle: descStyle,
        });
    }
    // 展示深度图的时候，执行reset
    if (this.props.chartType == "depth") {
      this.reset();
    }
  }
  httpAction = async (payload) => {
    await this.props.dispatch({
      type: "ws/depth_http",
      payload: {
        symbol: this.props.exchange_id + "." + this.props.symbol_id,
        limit: this.state.limit,
      },
    });
  };
  /**
   * data={
   *   topic:'depth',
   *   params:{},
   *   f: true/false,
   *   id: 'mergedDepth2,
   *   shared: true/false,
   *   data:[{a:[ [120,1],[111,2] ],b:[ [12,3], [123,13] ]}] m:涨跌幅
   * }
   */
  callback = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("depth_source", data.data, data.id, 1);
  };
  sub = (exchange_id, symbol_id) => {
    this.props.qws.sub(
      {
        id: "depth" + exchange_id + "." + symbol_id,
        topic: window.Worker ? "depth" : "depth",
        event: "sub",
        symbol: exchange_id + "." + symbol_id,
        limit: this.state.limit,
        params: {
          binary: !Boolean(window.localStorage.ws_binary),
        },
      },
      this.httpAction,
      this.callback
    );
  };
  change(t) {
    this.props.dispatch({
      type: "exchange/save",
      payload: {
        chartType: t,
      },
    });
  }
  // 取消之前的订阅
  cancel = (id) => {
    if (this.props.qws && id) {
      this.props.qws.cancel(id);
    }
  };
  setDepthData = (data) => {
    const symbol_quote = this.props.symbol_quote;
    const symbol_id = this.props.symbol_id;
    const tokenInfo = symbol_quote[symbol_id] || {};
    if (!symbol_id || !tokenInfo.c) {
      return {
        sell: [],
        buy: [],
        maxAmount: 1,
      };
    }

    let buy = data && data.b ? data.b : [];
    let sell = data && data.a ? data.a : [];
    let maxAmount = 0;
    let t = 0;
    let b = [];
    let s = [];
    buy.length = buy.length >= 100 ? 100 : buy.length;
    sell.length = sell.length >= 100 ? 100 : sell.length;

    for (let i = 0; i < buy.length; i++) {
      if (
        buy[i][0] - tokenInfo.c <= 0 &&
        Math.abs((buy[i][0] - tokenInfo.c) / tokenInfo.c) <= 0.6
      ) {
        b.push(buy[i]);
        b[b.length - 1][2] =
          Number(buy[i][1]) + Number(b.length > 1 ? b[b.length - 2][2] : 0);
        t = b[b.length - 1][2];
        if (t > maxAmount) {
          maxAmount = t;
        }
      }
    }
    for (let i = 0; i < sell.length; i++) {
      if (
        sell[i][0] - tokenInfo.c >= 0 &&
        Math.abs((sell[i][0] - tokenInfo.c) / tokenInfo.c) <= 0.6
      ) {
        s.push(sell[i]);
        s[s.length - 1][2] =
          Number(sell[i][1]) + Number(s.length > 1 ? s[s.length - 2][2] : 0);
        t = s[s.length - 1][2];
        if (t > maxAmount) {
          maxAmount = t;
        }
      }
    }
    return {
      sell: s,
      buy: b,
      maxAmount: maxAmount * 1.05,
    };
  };
  reset(cb) {
    if (
      !this.props.depth ||
      !this.props.depth[
        "depth" + this.props.exchange_id + "." + this.props.symbol_id
      ]
    ) {
      return;
    }

    const width = this.bg.parentNode.parentNode.offsetWidth * 2;
    const height = this.bg.parentNode.parentNode.offsetHeight * 2;
    //if (width == this.state.width) return;

    this.bg.setAttribute("width", width);
    this.bg.setAttribute("height", height);
    this.des.setAttribute("width", width);
    this.des.setAttribute("height", height);

    const sizes = this.des.parentNode.parentNode.getBoundingClientRect();
    let data = {
      width,
      height,
      canvasPageX: math
        .chain(sizes.left)
        .add(window.pageXOffset)
        .format({ notation: "fixed", precision: 2 })
        .done(),
      canvasPageY: math
        .chain(sizes.top)
        .add(window.pageYOffset)
        .format({ notation: "fixed", precision: 2 })
        .done(),
      ctx: this.bg.getContext("2d"),
    };

    //data.scaleW = scaleW;
    //}
    state_data = data;
    this.draw();
  }

  draw() {
    //window.console.log("depth draw");
    // 价格精度
    const max_digits = this.props.max_digits || 4;
    // 数量精度
    const base_precision = this.props.base_precision || 4;
    let { width, height } = state_data;
    let { gap, color, space } = this.state;
    const datas = WSDATA.getData("depth_source");
    let { sell, buy, maxAmount } = this.setDepthData(
      datas["depth" + this.props.exchange_id + "." + this.props.symbol_id]
    );
    sell_data = sell;
    buy_data = buy;
    maxAmount_data = maxAmount;
    width -= space[0];
    height -= space[1];
    let context = this.bg.getContext("2d");
    //let context2 = this.bg.getContext("2d");
    if (!mouse_position.length) {
      this.clear();
    }

    const min_buy_price = buy.length ? buy[buy.length - 1][0] : 0;
    const max_buy_price = buy.length ? buy[0][0] : 0;
    const fix_buy = max_buy_price - min_buy_price;
    const min_sell_price = sell.length ? sell[0][0] : 0;
    const max_sell_price = sell.length ? sell[sell.length - 1][0] : 0;
    const fix_sell = max_sell_price - min_sell_price;
    let x = 0,
      y = 0;
    if (buy.length) {
      //开始一个连续绘制路径
      context.beginPath();
      context.strokeStyle = this.state.buy[2]; // 买入区域边框颜色
      //从中间向上、向左绘制买单图 buy
      for (let i = 0; i < buy.length; i++) {
        x =
          (width / 2 - gap) *
          (fix_buy ? 1 - (max_buy_price - buy[i][0]) / fix_buy : 0);
        y = height - (buy[i][2] / maxAmount) * height;
        if (i === 0) {
          context.moveTo(width / 2 - gap + 0.5, height);
          x = width / 2 - gap + 0.5;
        }
        context.lineTo(x, y);
      }

      context.lineTo(0, y); //延伸到最左侧边缘
      context.lineTo(0, height);
      context.lineTo(width / 2 - gap + 0.5, height);

      var lingrad = context.createLinearGradient(0, 0, 0, height);
      lingrad.addColorStop(0, this.state.buy[0]);
      lingrad.addColorStop(1, this.state.buy[1]);
      context.fillStyle = lingrad;

      context.fill(); //形成一个封装区域 并按fillStyle指定的颜色填充
      context.closePath();
    }
    x = 0;
    y = 0;
    if (buy.length) {
      //开始一个连续绘制路径
      context.beginPath();
      context.strokeStyle = this.state.buy[2]; // 买入区域边框颜色
      context.lineWidth = 4;
      context.lineCap = "round";
      //从中间向上、向左绘制买单图 buy
      for (let i = 0; i < buy.length; i++) {
        x =
          (width / 2 - gap) *
          (fix_buy ? 1 - (max_buy_price - buy[i][0]) / fix_buy : 0);
        y = height - (buy[i][2] / maxAmount) * height;
        if (i === 0) {
          context.moveTo(width / 2 - gap + 0.5, height);
          x = width / 2 - gap + 0.5;
        }
        context.lineTo(x, y);
      }

      context.lineTo(0, y); //延伸到最左侧边缘

      context.stroke();
    }

    //同上 开始绘制卖单深度图 sell
    if (sell.length) {
      context.beginPath();
      for (let i = 0; i < sell.length; i++) {
        //x = Math.min(width / 2 + i * scaleW + gap, width);
        x =
          width / 2 +
          (width / 2) *
            (fix_sell ? 1 - (max_sell_price - sell[i][0]) / fix_sell : 0) +
          gap;
        y = height - (sell[i][2] / maxAmount) * height;
        if (i === 0) {
          context.moveTo(width / 2 + gap - 0.5, height);
          x = width / 2 + gap - 0.5;
        }
        context.lineTo(x, y);
      }

      context.lineTo(width + gap, y);
      context.lineTo(width + gap, height);
      context.lineTo(width / 2 + gap - 0.5, height);

      var lingrad2 = context.createLinearGradient(0, 0, 0, height);
      lingrad2.addColorStop(0, this.state.sell[0]);
      //lingrad2.addColorStop(0.5, this.state.sell[0]);
      lingrad2.addColorStop(1, this.state.sell[1]);
      context.fillStyle = lingrad2;

      context.fill();
      context.closePath();
    }

    if (sell.length) {
      context.beginPath();
      context.strokeStyle = this.state.sell[2];
      //context.fillStyle = color[1];
      for (let i = 0; i < sell.length; i++) {
        //x = Math.min(width / 2 + i * scaleW + gap, width);
        x =
          width / 2 +
          (width / 2) *
            (fix_sell ? 1 - (max_sell_price - sell[i][0]) / fix_sell : 0) +
          gap;
        y = height - (sell[i][2] / maxAmount) * height;
        if (i === 0) {
          context.moveTo(width / 2 + gap - 0.5, height);
          x = width / 2 + gap - 0.5;
        }
        context.lineTo(x, y);
      }

      context.lineTo(width + gap, y);
      context.stroke();
    }

    // x轴
    context.lineWidth = 1;
    context.beginPath();
    context.strokeStyle = color[2];
    context.moveTo(0, height + 1.5);
    context.lineTo(width + gap + 10, height + 1.5);
    context.stroke();
    context.closePath();

    context.fillStyle = color[2];
    context.font = "22px 'Roboto', 'Helvetica', 'Arial', sans-serif";
    context.canvasLetterSpacing = 0;

    // 原 x轴
    for (let i = 0; i < 4; i++) {
      x = width / 2 - (i * 0.25 * width) / 2 - gap - 32;
      y = height + 32;
      context.fillStyle = color[1];
      context.font = "22px 'Roboto', 'Helvetica', 'Arial', sans-serif";
      context.canvasLetterSpacing = 0;
      context.fillText(
        math
          .chain(max_buy_price)
          .subtract(
            math
              .chain(fix_buy)
              .multiply(i)
              .multiply(0.25)
              .format({ notation: "fixed" })
              .done()
          )
          .format({ notation: "fixed", precision: max_digits })
          .done(),
        // Acc.div(
        //   Acc.mul(Number(max_buy_price) - fix_buy * i * 0.25, 1000),
        //   1000,
        //   max_digits
        // ),
        x,
        y
      );
      context.beginPath();
      context.strokeStyle = color[2];
      context.moveTo(x + 32.5, y - 32);
      context.lineTo(x + 32.5, y - 24);
      context.stroke();
      context.closePath();
    }

    for (let i = 1; i <= 3; i++) {
      //x = width / 2 + i * scaleW - 32;
      x = width / 2 + (i * 0.3 * width) / 2 - 32;
      y = height + 32;
      context.fillStyle = color[1];
      context.font = "22px 'Roboto', 'Helvetica', 'Arial', sans-serif";
      context.canvasLetterSpacing = 0;
      context.fillText(
        math
          .chain(min_sell_price)
          .add(
            math
              .chain(fix_sell)
              .multiply(i)
              .multiply(0.3)
              .format({ notation: "fixed" })
              .done()
          )
          .format({ notation: "fixed", precision: max_digits })
          .done(),
        // Acc.div(
        //   Acc.mul(Number(min_sell_price) + fix_sell * i * 0.3, 1000),
        //   1000,
        //   max_digits
        // ),
        x,
        y
      );

      context.beginPath();
      context.strokeStyle = color[2];
      context.moveTo(x + 32.5, y - 32);
      context.lineTo(x + 32.5, y - 24);
      context.stroke();
      context.closePath();
    }

    // y 轴
    context.lineWidth = 1;
    context.beginPath();
    context.strokeStyle = color[2];
    context.moveTo(width + gap + 0.5, height);
    context.lineTo(width + gap + 0.5, 0);
    context.stroke();
    context.closePath();

    let seg = maxAmount / 7;
    for (let i = 0; i <= 7; i++) {
      x = width + 28;
      y = height - ((seg * i) / maxAmount) * height + 12;
      if (i == 7) {
        y = 20;
      }
      context.fillStyle = color[1];
      context.font = "22px 'Roboto', 'Helvetica', 'Arial', sans-serif";
      context.canvasLetterSpacing = 0;
      context.fillText(
        seg * i > 1000
          ? math
              .chain(seg)
              .multiply(i)
              .divide(1000)
              .format({ notation: "fixed", precision: 2 })
              .done() + "K"
          : math
              .chain(seg)
              .multiply(i)
              .format({ notation: "fixed", precision: base_precision })
              .done(),
        // seg * i > 1000
        //   ? Acc.div(seg * i, 1000, base_precision) + "K"
        //   : Acc.mul(seg, i, base_precision),
        x - 8,
        y
      );
      if (i > 0) {
        context.beginPath();
        context.strokeStyle = color[2];
        context.moveTo(x - 20.5, y - 8);
        context.lineTo(x - 11.5, y - 8);
        context.stroke();
        context.closePath();
      }
    }
    if (mouse_position.length) {
      this.mousemove();
    }
  }
  clear() {
    let ctx = this.des.getContext("2d");
    ctx.clearRect(0, 0, 30000, 30000);
    mouse_position = [];
  }
  mousemove = (e) => {
    let { width, height, canvasPageX, canvasPageY, ctx } = state_data;
    let { gap, space, descStyle } = this.state;

    if (!sell_data.length && !buy_data.length) return;
    const sell = sell_data;
    const buy = buy_data;
    const maxAmount = maxAmount_data;
    width -= space[0];
    height -= space[1];
    const left = e ? e.pageX - canvasPageX : mouse_position[0];
    const top = e ? e.pageY - canvasPageY : mouse_position[1];
    mouse_position = [left, top];
    const max_digits = this.props.max_digits;
    const base_precision = this.props.base_precision;
    // 图形区域
    //const area = [0, 0, width, height];
    if (
      left < 0 ||
      left * 2 > width ||
      top < 0 ||
      top * 2 > height ||
      (left * 2 > width / 2 - gap && left * 2 < width / 2)
    ) {
      this.clear();
      return;
    }
    // 获取原点位置
    const size = this.getPoint(left, top, width, height, ctx);
    if (size > width / 2 - gap + 0.5 && size < width / 2 + gap - 0.5) {
      return;
    }
    let price = 0;
    let type = "";
    if (size[0] <= width / 2 - gap + 0.5) {
      type = "buy";
      const scale = math
        .chain(size[0])
        .divide(width / 2 - gap)
        .format({ notation: "fixed", precision: 6 })
        .done();
      const fix =
        buy[0] && buy[buy.length - 1]
          ? math
              .chain(buy[0][0])
              .subtract(buy[buy.length - 1][0])
              .format({ notation: "fixed" })
              .done()
          : 0;
      price = buy.length
        ? size[0] == width / 2 - gap + 0.5
          ? buy[0][0]
          : math
              .chain(scale)
              .multiply(fix)
              .add(buy[buy.length - 1][0])
              .format({ notation: "fixed" })
              .done()
        : 0;
    }
    if (size[0] >= width / 2 + gap - 0.5) {
      type = "sell";
      const scale = math
        .chain(size[0] - gap - width / 2)
        .divide(width / 2)
        .format({ notation: "fixed", precision: 6 })
        .done();
      const fix =
        sell[0] && sell[sell.length - 1]
          ? math
              .chain(sell[sell.length - 1][0])
              .subtract(sell[0][0])
              .format({ notation: "fixed" })
              .done()
          : 0;
      price = sell.length
        ? size[0] === width / 2 + gap - 0.5
          ? sell[sell.length - 1][0]
          : math
              .chain(scale)
              .multiply(fix)
              .add(sell[0][0])
              .format({ notation: "fixed" })
              .done()
        : 0;
    }
    //price = Acc.div(Acc.mul(price, 100), 100, max_digits);
    price = helper.digits(price, max_digits);

    let amount = math
      .chain(height - size[1])
      .divide(height)
      .multiply(maxAmount)
      .format({ notation: "fixed", precision: 2 })
      .done();
    //let amount = Acc.mul(Acc.div(height - size[1], height, 2), maxAmount);
    amount = helper.digits(amount, base_precision);
    // 获取文本框位置
    let descSize = {
      x: 20 + size[0],
      y: 20 + size[1],
      w: descStyle.w,
      h: descStyle.h,
    };
    if (descSize.x + descSize.w > width) {
      descSize.x = descSize.x - descSize.w - descStyle.r[0] * 2;
    }
    if (descSize.y + descSize.h > height) {
      descSize.y = descSize.y - descSize.h - descStyle.r[0] * 2;
    }

    this.drawLayer(
      size[0],
      size[1],
      descSize.x,
      descSize.y,
      descSize.w,
      descSize.h,
      price,
      amount,
      type
    );
  };
  // 获取x坐标点，第一位有颜色的像素
  getPoint(x, y, w, h, ctx) {
    // const space = this.state.space;
    if (!ctx) return;
    // 二分查找
    /**
     *
     * @param {Number} x1 第一个点的x坐标
     * @param {Number} y1 第一个点的y坐标
     * @param {Number} y2 第二个点的y坐标，y2 < y1, y2点在y1点上面
     */
    const search = (x1, y1, y2) => {
      //上下2点接近
      if (y1 - y2 <= 2) {
        return [x1, y1 - 1];
      }
      let data = ctx.getImageData(x1, y1, 1, 1).data;
      let data2 = ctx.getImageData(x1, y2, 1, 1).data;
      ////window.console.log(data[3], data2[3], y1, y2, x1);
      // y1 y2点有颜色,向上找半点
      if (data2[3] != 0 && data[3] != 0) {
        return search(x1, y2, 0);
      }
      // 两点都没颜色
      if (data2[3] == 0 && data[3] == 0) {
        return search(x1, h - 1, y1);
      }
      // y1 有颜色，y2 无颜色
      if (data2[3] == 0 && data[3] != 0) {
        let ny = math
          .chain(y1)
          .subtract(y2)
          .divide(2)
          .add(y2)
          .format({ notation: "fixed", precision: 0 })
          .done();
        //let ny = Acc.add(y2, Acc.div(y1 - y2, 2, 0));
        let d = ctx.getImageData(x1, ny, 1, 1).data;
        if (d[3] != 0) {
          return search(x1, ny, y2);
        } else {
          return search(x1, y1, ny);
        }
      }
    };
    const size = search(x * 2, Math.floor(h / 2), 0);
    return size;
  }
  /**
   *
   * @param {Number} x 原点x坐标
   * @param {Number} y 原点y坐标
   * @param {Number} x1 文本框x坐标
   * @param {Number} y1 文本框y坐标
   * @param {Number} price 价格
   * @param {Number} amount 成交量
   * @param {String} type 买、卖
   */
  drawLayer(x, y, x1, y1, width, height, price, amount, type) {
    const ctx = this.des.getContext("2d");
    const style = this.state.descStyle;
    ctx.clearRect(0, 0, 30000, 30000);

    // 原点
    ctx.beginPath();
    ctx.fillStyle = type == "buy" ? style.pointColor[2] : style.pointColor[0];
    ctx.arc(x, y, style.r[0], 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // 原点
    ctx.beginPath();
    ctx.fillStyle = type == "buy" ? style.pointColor[3] : style.pointColor[1];
    ctx.arc(x, y, style.r[1], 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // 文本框
    let min_size = Math.min(x1 + width, y1 + height);
    let r = 10;
    if (r > min_size / 2) r = min_size / 2;
    // 开始绘制
    ctx.beginPath();
    ctx.fillStyle = style.bgColor;
    ctx.moveTo(x1 + r, y1);

    ctx.arcTo(x1 + width, y1, x1 + width, y1 + height, r);
    ctx.arcTo(x1 + width, y1 + height, x1, y1 + height, r);
    ctx.arcTo(x1, y1 + height, x1, y1, r);
    ctx.arcTo(x1, y1, x1 + width, y1, r);
    ctx.closePath();
    ctx.fill();

    // 文字
    ctx.font = style.text;
    ctx.fillStyle = style.textColor;
    ctx.fillText(
      `${this.props.intl.formatMessage({
        id: "委托价",
      })}  ${price}`,
      x1 + 30,
      y1 + 48
    );
    ctx.fillText(
      `${this.props.intl.formatMessage({
        id: "累计",
      })}  ${amount}`,
      x1 + 30,
      y1 + 98
    );
  }
  render() {
    //window.console.log("depth render");
    const { classes } = this.props;
    return (
      <div
        className={
          this.props.chartType == "depth"
            ? classnames(this.props.classes.depthchart, "on")
            : this.props.classes.depthchart
        }
        onMouseMove={this.mousemove}
        onMouseOut={this.clear}
      >
        <Grid container className={classes.kline_btns} alignItems="center">
          <Grid
            style={{
              flex: 1,
              height: "24px",
              lineHeight: "24px",
              justifyContent: "flex-end",
            }}
          >
            <div className={classes.chartype}>
              <span
                className={this.props.chartType == "kline" ? "choose" : ""}
                onClick={this.change.bind(this, "kline")}
              >
                {this.props.intl.formatMessage({
                  id: "K线图",
                })}
              </span>
              <span
                className={this.props.chartType == "depth" ? "choose" : ""}
                onClick={this.change.bind(this, "depth")}
              >
                {this.props.intl.formatMessage({
                  id: "深度图",
                })}
              </span>
            </div>
          </Grid>
        </Grid>
        <canvas ref={(canvas) => (this.bg = canvas)} />
        <canvas ref={(canvas) => (this.des = canvas)} />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(DepthChart));
