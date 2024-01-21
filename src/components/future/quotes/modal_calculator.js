// 计算器
import React from "react";
import { injectIntl } from "react-intl";
import {
  Button,
  TextField,
  Tabs,
  Tab,
  Grid,
  Select,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import quote_style from "./quote_style";
import style from "./style";
import { Iconfont } from "../../../lib";

class ModalCalculator extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      tab: 0,
      symbolId: "",
      islong: 0,
      leverage: "",
      leverage_msg: "",
      symbol_info: {
        baseTokenFutures: {},
      },
      res: {},
      error_msg: "",
      initX: 0,
      initY: 0,
      positionX: 0,
      positionY: 0,
      isDragging: false,
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }
  componentDidUpdate(preProps, preState) {
    if (!preState.open && this.state.open) {
      this.setState({
        symbolId: this.props.match.params.symbolId,
        symbol_info: this.props.config.symbols_obj.all[
          (this.props.match.params.symbolId || "").toUpperCase()
        ],
      });
    }
  }
  componentDidMount() {
    let that = this;
    let node = this.refs.dragPanel;
    window.addEventListener("mousedown", function (e) {
      if (node) {
        that.setState({
          initX: e.clientX, // 鼠标点击初始X
          initY: e.clientY, // 鼠标点击初始Y
          positionX: node.offsetLeft, // 弹框初始偏移X
          positionY: node.offsetTop, // 弹框初始偏移Y
        });
      }
    });
    window.addEventListener("mouseup", function (e) {
      that.setState({
        isDragging: false,
      });
    });
    window.addEventListener("mousemove", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let _state = that.state;
      let x = e.clientX;
      let y = e.clientY;
      if (_state.isDragging && node) {
        node.style.top = _state.positionY + y - _state.initY + "px";
        node.style.left = _state.positionX + x - _state.initX + "px";
        node.style.cursor = "move";
      }
    });
  }
  handleMouseEnter(e) {
    let node = this.refs.dragPanel;
    node.style.cursor = "pointer";
  }
  handleMouseDown(e) {
    this.setState({
      isDragging: true,
    });
  }
  handleMouseMove(e) {
    let node = this.refs.dragPanel;
    if (!this.state.isDragging) {
      node.style.cursor = "pointer";
    }
  }

  changeModal = (v) => (e) => {
    if (v) {
      let node = this.refs.dragPanel;
      node.style.left = `calc(50% - ${712 / 2}px)`;
      node.style.top = `calc(50% - ${474 / 2}px)`;
    }
    this.setState({
      open: v,
      error_msg: "",
      res: {},
      leverage: "",
      leverage_msg: "",
      price: "",
      price_msg: "",
      quantity: "",
      quantity_msg: "",
      price2: "",
      price2_msg: "",
      quantity2: "",
      quantity2_msg: "",
      cost: "",
      cost_msg: "",
    });
  };
  handleChange = (e, v) => {
    this.setState({
      tab: v,
      error_msg: "",
    });
  };
  changeSymbol = (k) => (e) => {
    if (k == "symbolId") {
      this.setState({
        [k]: e.target.value,
        symbol_info: this.props.config.symbols_obj.all[e.target.value],
        error_msg: "",
      });
    }
    let v = Number.isNaN(Number(e.target.value));
    if (v) {
      return;
    }

    this.setState({
      [k]: e.target.value,
      [k + "_msg"]: "",
      error_msg: "",
    });
  };
  change = (k, v) => (e) => {
    this.setState({
      [k]: v,
      error_msg: "",
    });
  };
  checkForm = () => {
    const values = [
      ["leverage", "price", "quantity", "price2", "quantity2"],
      ["leverage", "price", "quantity"],
    ];
    let v = true;
    values[this.state.tab].map((item) => {
      if (!this.state[item]) {
        this.setState({
          [item + "_msg"]: this.props.intl.formatMessage({
            id: "此项不可为空",
          }),
        });
        v = false;
      }
    });
    // 收益率
    if (this.state.tab == 0) {
      if (Number(this.state.quantity2) > Number(this.state.quantity)) {
        this.setState({
          quantity2_msg: this.props.intl.formatMessage({
            id: "平仓数量大于开仓数量",
          }),
        });
        v = false;
      }
    }
    return v;
  };
  submit = () => {
    const v = this.checkForm();
    if (!v) {
      return;
    }
    this.props.dispatch({
      type: "future/calculator",
      payload: {
        symbol_id: this.state.symbolId,
        is_long: this.state.islong,
        leverage: this.state.leverage,
        open_price: this.state.price,
        open_quantity: this.state.quantity,
        close_price: this.state.price2 || "",
        close_quantity: this.state.quantity2 || "",
        margin_call: this.state.cost || "",
      },
      key: ["calculator_profit_info", "calculator_liquidation_price"][
        this.state.tab
      ],
      callback: (res) => {
        if (res.code == "OK") {
          this.setState({
            res: res.data,
            error_msg: "",
          });
        } else {
          this.setState({
            res: {},
            error_msg: res.msg,
          });
        }
      },
    });
  };
  render() {
    const { classes } = this.props;
    const displayTokenId = this.state.symbol_info.baseTokenFutures
      ? this.state.symbol_info.baseTokenFutures.displayTokenId
      : "";
    const token2_name = this.state.symbol_info.quoteTokenName;
    return [
      <Iconfont
        type="count"
        size="24"
        onClick={this.changeModal(true)}
        key="icon"
      />,
      <div
        key="popper"
        className={classes.dragPopper}
        onMouseEnter={this.handleMouseEnter}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        ref="dragPanel"
        style={{
          display: this.state.open ? "block" : "none",
        }}
      >
        <div className={classes.calculator}>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.cal_tab}
          >
            <Grid item>
              <Tabs
                value={this.state.tab}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab
                  value={0}
                  label={this.props.intl.formatMessage({ id: "收益率计算" })}
                />
                <Tab
                  value={1}
                  label={this.props.intl.formatMessage({
                    id: "强平价格计算",
                  })}
                />
              </Tabs>
            </Grid>
            <Grid item>
              <Iconfont
                type="close"
                size="24"
                onClick={this.changeModal(false)}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.cal_content} spacing={2}>
            <Grid item xs={6} style={{ flex: "0 0 55%", maxWidth: "55%" }}>
              <Grid container className={classes.cal_item}>
                <Grid item xs={3}>
                  <label>{this.props.intl.formatMessage({ id: "合约" })}</label>
                </Grid>
                <Grid item xs={9}>
                  <Select
                    value={this.state.symbolId}
                    onChange={this.changeSymbol("symbolId")}
                    fullWidth
                    variant="outlined"
                    classes={{
                      outlined: classes.symbolSelect,
                    }}
                  >
                    {this.props.config.futuresSymbol.map((item) => {
                      return (
                        <MenuItem key={item.symbolId} value={item.symbolId}>
                          {item.symbolName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Grid>
              </Grid>
              <Grid container className={classes.cal_item}>
                <Grid item xs={3}>
                  <label>{this.props.intl.formatMessage({ id: "类型" })}</label>
                </Grid>
                <Grid item xs={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        color={this.state.islong == 1 ? "primary" : "default"}
                        variant="contained"
                        onClick={this.change("islong", 1)}
                      >
                        {this.props.intl.formatMessage({ id: "多仓" })}
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        color={this.state.islong == 0 ? "primary" : "default"}
                        variant="contained"
                        onClick={this.change("islong", 0)}
                      >
                        {this.props.intl.formatMessage({ id: "空仓" })}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container className={classes.cal_item}>
                <Grid item xs={3}>
                  <label>{this.props.intl.formatMessage({ id: "杠杆" })}</label>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入杠杆",
                    })}
                    classes={{
                      root: classes.inputRoot,
                      // focused: classes.inputFocused,
                      // error: classes.inputError
                    }}
                    onChange={this.changeSymbol("leverage")}
                    InputProps={{
                      endAdornment: (
                        <label>
                          {this.props.intl.formatMessage({ id: "倍" })}
                        </label>
                      ),
                    }}
                    error={Boolean(this.state.leverage_msg)}
                    value={this.state.leverage}
                    helperText={this.state.leverage_msg}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.cal_item}>
                <Grid item xs={3}>
                  <label>
                    {this.props.intl.formatMessage({ id: "开仓价格" })}
                  </label>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入开仓价格",
                    })}
                    classes={{
                      root: classes.inputRoot,
                      // focused: classes.inputFocused,
                      // error: classes.inputError
                    }}
                    onChange={this.changeSymbol("price")}
                    InputProps={{
                      endAdornment: <label>{displayTokenId}</label>,
                    }}
                    error={Boolean(this.state.price_msg)}
                    value={this.state.price}
                    helperText={this.state.price_msg}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.cal_item}>
                <Grid item xs={3}>
                  <label>
                    {this.props.intl.formatMessage({ id: "开仓数量" })}
                  </label>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入开仓数量",
                    })}
                    classes={{
                      root: classes.inputRoot,
                      // focused: classes.inputFocused,
                      // error: classes.inputError
                    }}
                    onChange={this.changeSymbol("quantity")}
                    InputProps={{
                      endAdornment: (
                        <label>
                          {this.props.intl.formatMessage({ id: "张" })}
                        </label>
                      ),
                    }}
                    error={Boolean(this.state.quantity_msg)}
                    value={this.state.quantity}
                    helperText={this.state.quantity_msg}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              {this.state.tab == 0 ? (
                <Grid container className={classes.cal_item}>
                  <Grid item xs={3}>
                    <label>
                      {this.props.intl.formatMessage({ id: "平仓价格" })}
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入平仓价格",
                      })}
                      classes={{
                        root: classes.inputRoot,
                        // focused: classes.inputFocused,
                        // error: classes.inputError
                      }}
                      onChange={this.changeSymbol("price2")}
                      InputProps={{
                        endAdornment: <label>{displayTokenId}</label>,
                      }}
                      error={Boolean(this.state.price2_msg)}
                      value={this.state.price2}
                      helperText={this.state.price2_msg}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              ) : (
                ""
              )}

              {this.state.tab == 0 ? (
                <Grid container className={classes.cal_item}>
                  <Grid item xs={3}>
                    <label>
                      {this.props.intl.formatMessage({ id: "平仓数量" })}
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入平仓数量",
                      })}
                      classes={{
                        root: classes.inputRoot,
                        // focused: classes.inputFocused,
                        // error: classes.inputError
                      }}
                      onChange={this.changeSymbol("quantity2")}
                      InputProps={{
                        endAdornment: (
                          <label>
                            {this.props.intl.formatMessage({
                              id: "张",
                            })}
                          </label>
                        ),
                      }}
                      error={Boolean(this.state.quantity2_msg)}
                      value={this.state.quantity2}
                      helperText={this.state.quantity2_msg}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              ) : (
                ""
              )}

              {this.state.tab == 1 ? (
                <Grid container className={classes.cal_item}>
                  <Grid item xs={3}>
                    <label>
                      {this.props.intl.formatMessage({ id: "追加保证金" })}
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      placeholder={this.props.intl.formatMessage({
                        id: "非必填",
                      })}
                      onChange={this.changeSymbol("cost")}
                      InputProps={{
                        endAdornment: <label>{token2_name}</label>,
                      }}
                      classes={{
                        root: classes.inputRoot,
                        // focused: classes.inputFocused,
                        // error: classes.inputError
                      }}
                      variant="outlined"
                      error={Boolean(this.state.cost_msg)}
                      value={this.state.cost}
                      helperText={this.state.cost_msg}
                    />
                  </Grid>
                </Grid>
              ) : (
                ""
              )}

              <Grid container className={classes.cal_item}>
                <Grid item xs={3}></Grid>
                <Grid item xs={9}>
                  {this.props.loading &&
                  this.props.loading.effects &&
                  this.props.loading.effects["future/calculator"] ? (
                    <Button
                      fullWidth
                      onClick={this.submit}
                      disabled
                      color="primary"
                      variant="contained"
                    >
                      <CircularProgress size={20} color="primary" />
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      onClick={this.submit}
                      color="primary"
                      variant="contained"
                    >
                      {this.props.intl.formatMessage({ id: "计算" })}
                    </Button>
                  )}
                  <p>{this.state.error_msg}</p>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} style={{ flex: "0 0 45%", maxWidth: "45%" }}>
              {this.state.tab == 0 ? (
                <Grid container className={classes.cal_result}>
                  <Grid item xs={6}>
                    <label>
                      {this.props.intl.formatMessage({ id: "开仓保证金" })}
                    </label>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    {this.state.res.orderMargin}{" "}
                    <label>{this.state.res.tokenId}</label>
                  </Grid>
                  <Grid item xs={6}>
                    <label>
                      {this.props.intl.formatMessage({
                        id: "Taker手续费(开仓)",
                      })}
                    </label>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    {this.state.res.takerOpenFee}{" "}
                    <label>{this.state.res.tokenId}</label>
                  </Grid>
                  <Grid item xs={6}>
                    <label>
                      {this.props.intl.formatMessage({
                        id: "Maker手续费(开仓)",
                      })}
                    </label>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    {this.state.res.makerOpenFee}{" "}
                    <label>{this.state.res.tokenId}</label>
                  </Grid>
                  <Grid item xs={6}>
                    <label>
                      {this.props.intl.formatMessage({
                        id: "Taker手续费(平仓)",
                      })}
                    </label>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    {this.state.res.takerCloseFee}{" "}
                    <label>{this.state.res.tokenId}</label>
                  </Grid>
                  <Grid item xs={6}>
                    <label>
                      {this.props.intl.formatMessage({
                        id: "Maker手续费(平仓)",
                      })}
                    </label>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    {this.state.res.makerCloseFee}{" "}
                    <label>{this.state.res.tokenId}</label>
                  </Grid>
                  <Grid item xs={6}>
                    <label>
                      {this.props.intl.formatMessage({ id: "收益" })}
                    </label>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    {this.state.res.profit}{" "}
                    <label>{this.state.res.tokenId}</label>
                  </Grid>
                  <Grid item xs={6}>
                    <label>
                      {this.props.intl.formatMessage({ id: "收益率" })}
                    </label>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    {this.state.res.profitRate
                      ? Math.floor(this.state.res.profitRate * 10000) / 100
                      : this.state.res.profitRate}
                    <label>%</label>
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
              {this.state.tab == 1 ? (
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  className={classes.cal_result2}
                >
                  <Grid item>
                    <p>{this.props.intl.formatMessage({ id: "强平价格" })}</p>
                    <strong>{this.state.res.liquidationPrice} </strong>
                    <span>{displayTokenId}</span>
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </div>
      </div>,
    ];
  }
}

export default withStyles((theme) => ({
  ...quote_style(theme),
  ...style(theme),
}))(injectIntl(ModalCalculator));
