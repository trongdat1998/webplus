/**
 * canvas k线组件
 * props:
 *    width  number
 *    height number
 *    borderColor string
 *    gradientColor array[string]
 *    data   array[Object] {c,h,l,o,s,t,v}
 */
import React from "react";

class Canvas extends React.Component {
  constructor() {
    super();
    this.state = {
      max: 0,
      defaultWidth: 100,
      defaultHeight: 100
    };
  }
  componentDidMount() {
    this.setState({
      defaultWidth: this.props.defaultWidth || this.state.defaultWidth,
      defaultHeight: this.props.defaultHeight || this.state.defaultHeight
    });
    this.getMax(() => this.draw());
    // this.props.onRef(this);
  }
  getMax = cb => {
    if (this.props.data) {
      let max = 0;
      let min = -1;
      this.props.data.map(item => {
        if (min == -1) {
          min = Number(item.c);
        }
        if (item.c && Number(item.c) > max) {
          max = Number(item.c);
        }
        if (item.c && Number(item.c) < min) {
          min = Number(item.c);
        }
      });
      max = max * 1.01;
      min = Math.max(0, min * 0.99);
      this.setState(
        {
          max,
          min
        },
        () => {
          cb && cb();
        }
      );
    }
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.borderColor != nextProps.borderColor ||
      (this.props.gradientColor &&
        nextProps.gradientColor &&
        (this.props.gradientColor[0] != nextProps.gradientColor[0] ||
          this.props.gradientColor[1] != nextProps.gradientColor[1])) ||
      this.props.width != nextProps.width ||
      this.props.height != nextProps.height
    ) {
      return true;
    }
    let r = false;
    if (nextProps.data) {
      nextProps.data.map((item, i) => {
        if (!this.props.data || !this.props.data[i]) {
          r = true;
        } else {
          if (
            this.props.data &&
            this.props.data[i] &&
            this.props.data[i]["c"] != nextProps.data[i]["c"]
          ) {
            r = true;
          }
        }
      });
    }
    return r;
  }
  draw = () => {
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, 30000, 30000);
    if (this.state.max && this.props.data) {
      let x = 0;
      let y = 0;
      let realh = this.state.max - this.state.min;
      const width = this.props.width
        ? this.props.width * 2
        : this.state.defaultWidth;
      const height = this.props.height
        ? this.props.height * 2
        : this.state.defaultHeight;
      const line = new Path2D();
      const area = new Path2D();
      for (let i = 0, l = Math.max(this.props.data.length, 200); i < l; i++) {
        x = (i / l) * width;
        y =
          ((this.props.data[i] && this.props.data[i]["c"]
            ? this.state.max - this.props.data[i]["c"]
            : 0) /
            realh) *
          height;
        line.lineTo(x, y);
        area.lineTo(x, y);
      }
      line.lineTo(width + 2, y);
      area.lineTo(width + 2, y);
      area.lineTo(width + 2, height + 2);
      area.lineTo(-2, height + 2);
      area.lineTo(
        0,
        ((this.props.data[0] && this.props.data[0]["c"]
          ? this.state.max - this.props.data[0]["c"]
          : 0) /
          realh) *
          height
      );
      var lingrad2 = ctx.createLinearGradient(0, 0, 0, height);
      lingrad2.addColorStop(
        0,
        this.props.gradientColor && this.props.gradientColor[0]
          ? this.props.gradientColor[0]
          : "rgba(0,0,0,1)"
      );
      lingrad2.addColorStop(
        1,
        this.props.gradientColor && this.props.gradientColor[1]
          ? this.props.gradientColor[1]
          : "rgba(0,0,0,0.01)"
      );
      area.fillStyle = lingrad2;
      ctx.fillStyle = lingrad2;
      ctx.strokeStyle = this.props.borderColor || "green";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.fill(area);
      ctx.stroke(line);
      setTimeout(() => {
        this.draw();
      }, 500);
    }
  };
  componentDidUpdate() {
    this.getMax(() => this.draw());
  }
  render() {
    const width = this.props.width || this.state.defaultWidth;
    const height = this.props.height || this.state.defaultHeight;
    return (
      <div style={{ width: width, height: height, overflow: "hidden" }}>
        <canvas
          width={width * 2}
          height={height * 2}
          ref={ref => (this.canvas = ref)}
          style={{
            width: width * 2,
            height: height * 2,
            transform: "scale(0.5, 0.5) scaleZ(1)",
            transformOrigin: "0 0"
          }}
        />
      </div>
    );
  }
}

export default Canvas;
