// wss组件
import React from "react";
import helper from "../../utils/helper";

function SymbolListHOC(Component) {
  return class extends React.Component {
    constructor() {
      super();
      this.state = {
        ws: null,
        isMount: false
      };
      this.createWs = this.createWs.bind(this);
      this.loop = this.loop.bind(this);
      this.getData = this.getData.bind(this);
      this.setData = this.setData.bind(this);
    }
    componentWillUnmount() {
      this.state.ws && this.state.ws.close();
      this.setState({
        isMount: false,
        ws: null
      });
    }
    getData() {}
    setData() {}
    createWs(url, cb) {
      if (!this.state.isMount) {
        this.state.ws && this.state.ws.close();
        return;
      }
      if (!url) {
        this.loop(url);
        return;
      }
      const ws = new WebSocket(url);
      ws.addEventListener("open", () => {});
      ws.addEventListener("message", msg => {
        let data = msg.data;
        if (data && data != "null") {
          data = JSON.parse(data);
          //this.setData(data);
          cb(data);
        }
      });
      ws.addEventListener("close", () => {
        this.loop(url);
      });
      this.setState({
        ws
      });
    }
    async loop(url, cb) {
      if (!this.state.isMount) {
        this.state.ws && this.state.ws.close();
        return;
      }
      await cb();
      await helper.delay(5000);
      this.createWs(url);
    }
    render() {
      //window.console.log("wssHOC render");
      return (
        <Component
          ws={this.state.ws}
          isMount={this.state.isMount}
          createWs={this.createWs}
          loop={this.loop}
          {...this.props}
        />
      );
    }
  };
}

export default SymbolListHOC;
