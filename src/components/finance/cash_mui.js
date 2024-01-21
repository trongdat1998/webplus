// 提现
import React from "react";
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from "react-intl";
import { message, Iconfont } from "../../lib";
import route_map from "../../config/route_map";
import vali from "../../utils/validator";
//import math from "mathjs";
import math from "../../utils/mathjs";
import SecVerify from "../public/secVerify_mui";
import helper from "../../utils/helper";
import VerfiCodeRC from "../public/verificationCode_mui";
import classnames from "classnames";
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Fab,
  Checkbox,
  MenuItem,
  Popper,
  Paper,
  Switch,
  CircularProgress,
  Slider,
} from "@material-ui/core";
import TooltipCommon from "../public/tooltip";
// import { Slider } from "@material-ui/lab";
import { withStyles } from "@material-ui/core/styles";
import layout_styles from "../layout_style";
import styles from "./style";

class Cash extends React.Component {
  constructor() {
    super();
    this.state = {
      inlist: false,
      msg: false,
      getVerfiCode: true,
      address_checked: false, // 当前选择的地址是否已经checked
      address_id: "", // 当前选择的地址id
      address: "", // 当前选择的地址
      show: false, // 地址列表浮层显示
      checked: true, // 是否开启提现速度
      fee: "0.00000000", // 手续费
      slider: -1, // 滑动条的值 0-100
      available: "", // 提币数量,
      miner_fee: 0, // 加速的矿工费
      suggestMinerFee: 0, // 矿工费建议值
      fixfee: 0, // 旷工费差额
      order_id: "", // 第一步返回的id
      code_order_id: "", // 第一步返回的id
      isopen: false, // 二次验证的框
      isopen2: false, // 第二步验证的layer
      isopen3: false, // 资金密码验证框
      isopen4: false, // 身份验证框
      isopen5: false, // kyc引导框
      isopen6: false, // 资金密码引导框
      isopen7: false, // 地址黑名单
      code: "", //第二步验证码
      code_msg: "", //第二步验证码提示
      trade_code: "", // 资金密码
      trade_code_msg: "", // 资金密码提示
      kyc_code: "", // 身份验证
      kyc_code_msg: "", // 身份验证提示
      address_ext: "", // eos tag
      notag: false,
      verify_code: "",
      auth_type: "",
      trade_password: "",
      isInnerAddress: false, // 是否为内部地址,如果为内部地址，手续费为0
      chainTypes: [],
      chain_type: "",
      set_chain_type: false,
      order_info: {},
    };

    this.cash_step1 = this.cash_step1.bind(this);
    this.onChange = this.onChange.bind(this);
    this.dropchange = this.dropchange.bind(this);
    this.layer = this.layer.bind(this);
    this.addAddress = this.addAddress.bind(this);
    this.sliderChange = this.sliderChange.bind(this);
    this.availableChange = this.availableChange.bind(this);
    this.getMinerFee = this.getMinerFee.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.cash_step1_request = this.cash_step1_request.bind(this);
    this.cash_step2 = this.cash_step2.bind(this);
    this.Verify = this.Verify.bind(this);
    this.actual_arrival = this.actual_arrival.bind(this);
    this.default_slider = this.default_slider.bind(this);
    this.getUserFee = this.getUserFee.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
  }
  Verify(n, e) {
    let v = e.target.value;
    v = helper.removeEmoji(v);
    v = helper.trim(v);
    this.setState(
      {
        [n]: e.target.value,
      },
      () => {
        // if (v.length == 6 && n == "code") {
        //   this.cash_step2();
        // }
      }
    );
  }
  componentDidMount() {
    if (this.props.cash.maxMinerFee) {
      this.setState({
        fixfee: math
          .chain(math.bignumber(this.props.cash.maxMinerFee))
          .subtract(math.bignumber(this.props.cash.minMinerFee))
          .format({ notation: "fixed" })
          .done(),
      });
    }

    window.document.body.addEventListener(
      "click",
      this.layer.bind(this, 0),
      false
    );
  }
  componentDidUpdate() {
    const token_id = (this.props.match.params.token || "").toUpperCase();
    if (token_id && !this.state.set_chain_type && this.props.tokens[token_id]) {
      this.setTypes();
    }
  }
  setTypes = async () => {
    const token_id = (this.props.match.params.token || "").toUpperCase();
    let chain_type = (this.props.match.params.chain_type || "").toUpperCase();
    const tokens = this.props.tokens;
    if (token_id && tokens[token_id]) {
      const chainTypes = tokens[token_id]["chainTypes"];
      if (!chain_type) {
        chain_type = chainTypes.length ? chainTypes[0]["chainType"] : "";
      }
      this.setData(chain_type);
      this.setState({
        chainTypes,
        set_chain_type: true,
      });
    }
  };
  setData = async (chain_type) => {
    //if (chain_type == this.state.chain_type) return;
    await this.props.dispatch({
      type: "finance/save",
      payload: {
        address_list: [],
      },
    });
    await this.setState({
      chain_type,
      address: "",
    });
    try {
      this.props.dispatch({
        type: "finance/quota_info",
        payload: {
          tokenId: (this.props.match.params.token || "").toUpperCase(),
          chain_type,
        },
      });
      this.props.dispatch({
        type: "finance/address_list",
        payload: {
          tokenId: (this.props.match.params.token || "").toUpperCase(),
          chain_type,
        },
      });
    } catch (e) {}
  };
  componentWillUnmount() {
    this.props.dispatch({
      type: "finance/propsChange",
      payload: {
        cash_status: false, // 提币状态
        cash: {
          available: "0", // 可用
          minQuantity: "0", // 最小提币数量
          dayQuota: "0", // 24小时最大提币额度
          usedQuota: "", // 已使用额度
          fee: "0", // 手续费
          minMinerFee: "0", // 最小矿工费
          maxMinerFee: "0", // 最大矿工费
          suggestMinerFee: "0", // 建议矿工费
          convertFee: "0",
          convertRate: "0",
          isEOS: false,
          needAddressTag: false,
          allowWithdraw: true, // 是否允许提币
          refuseReason: "",
          minPrecision: 8,
          needKycCheck: true, // 是否需要校验KYC
          needKycQuotaQuantity: 0,
          needKycQuotaUnit: "",
          needKycQuantity: 0, // 此次提币如果超过${needKycQuotaQuantity}个${needKycQuotaUnit}，需进行KYC
          internalWithdrawFee: 0, // 内部地址收取的手续费，internalWithdrawHasFee=false时，internalWithdrawFee=0；接口已处理
          internalWithdrawHasFee: false, // 内部地址是否收费，true=收费，false=不收费。
        },
        withdraw: {
          address_id: "", // 地址id
          quantity: "", // 数量
          verficode: "", // 验证码
        },
        address_list: [],
      },
    });
    window.document.body.removeEventListener(
      "click",
      this.layer.bind(this, 0),
      false
    );
  }
  availableChange(e) {
    const t = e.target;
    let v = (t.value || "").replace(/e/gi, "");
    if (!Number.isNaN(Number(v)) || v === "") {
      if (v) {
        // if (v - this.props.cash.available >= 0) {
        //   v = helper.digits(
        //     this.props.cash.available,
        //     this.props.cash.minPrecision
        //   );
        // } else {
        const s = `${v}`.split(".");
        if (s[1] && s[1].length > this.props.cash.minPrecision) {
          v = helper.digits(v, this.props.cash.minPrecision);
        }
        // }
      }
      if (Number(v) >= 0) {
        this.setState({
          available: v,
        });
      }
    }
  }
  onCancel(n, name) {
    this.setState({
      [n]: false,
    });
    if (name && typeof name == "String") {
      this.setState({
        [name]: "",
      });
    }
    if (name == "trade_code") {
      this.setState({
        trade_code: "",
        trade_code_msg: "",
      });
    }
    if (name == "kyc_code") {
      this.setState({
        kyc_code: "",
        kyc_code_msg: "",
        trade_code: "",
        trade_code_msg: "",
      });
    }
    if (name == "code") {
      this.setState({
        code: "",
        code_msg: "",
        kyc_code: "",
        kyc_code_msg: "",
        trade_code: "",
        trade_code_msg: "",
      });
    }
    if (n === "isopen2") {
      this.verfiCode && this.verfiCode.reset();
    }
  }

  onChange(n, v, sliderValue) {
    let data = {
      [n]: v.target ? (n == "slider" ? sliderValue : v.target.value) : v,
    };
    if (n == "slider") {
      const cash = Object.assign({}, this.props.cash);
      if (!cash.minMinerFee && Number(cash.minMinerFee) !== 0) {
        return;
      }
      const fixfee = this.getMinerFee(0).fixfee;
      cash.suggestMinerFee = math
        .chain(math.bignumber(fixfee))
        .multiply(data["slider"])
        .divide(100)
        .add(math.bignumber(cash.minMinerFee))
        .format({ notation: "fixed" })
        .done();
      // if (Number.isNaN(cash.suggestMinerFee)) {
      //   return;
      // }
      this.props.dispatch({
        type: "finance/propsChange",
        payload: {
          cash,
        },
      });
    }
    if (n == "checked") {
      if (!v) {
        data.miner_fee = 0;
      } else {
        data.slider = 0;
        data.miner_fee = 0;
      }
    }
    this.setState(data);
  }
  sliderChange(v) {
    let value = this.state.slider;
    if (!!v) {
      value = 1 + this.state.slider;
    } else {
      value = this.state.slider - 1;
    }
    value = Math.max(Math.min(100, value), 0);
    const obj = this.getMinerFee(value);
    this.setState({
      slider: value,
      ...obj,
    });
  }
  // 添加地址
  addAddress(token) {
    //this.props.history.push(route_map.address + "/" + token);
    window.location.href = route_map.address + "/" + token;
    // this.props.history.push({
    //   pathname: route_map.address + "/" + token,
    //   state: { path: window.location.pathname }
    // });
  }
  dropchange(address_id, address, address_ext) {
    this.setState(
      {
        address_id,
        address,
        address_ext,
        show: false,
        isInnerAddress: false,
        address_checked: false,
      },
      () => {
        this.addressCheck();
      }
    );
  }
  addressChange = (e) => {
    let v = e.target.value;
    v = helper.trim(v);
    v = helper.removeEmoji(v);
    this.setState({
      address: v,
      address_id: "",
      isInnerAddress: false,
      address_checked: false,
    });
  };
  layer(v) {
    this.setState({
      show: typeof v == "object" ? false : !!v,
    });
  }
  cash_step1(e) {
    if (!this.props.cash.allowWithdraw) {
      message.info(
        this.props.intl.formatMessage({
          id: "当前不允许提币",
        })
      );
      return;
    }
    // 提币地址
    if (!this.state.address) {
      message.info(
        this.props.intl.formatMessage({
          id: "提币地址不能为空",
        })
      );
      return;
    }
    if (this.state.available === "") {
      message.info(
        this.props.intl.formatMessage({
          id: "请输入提币金额",
        })
      );
      return;
    }
    if (this.state.available == 0) {
      message.info(
        this.props.intl.formatMessage({
          id: "提币金额不能为0",
        })
      );
      return;
    }
    if (!this.state.notag && this.props.cash.needAddressTag) {
      if (!this.state.address_ext) {
        message.info(
          this.props.intl.formatMessage({
            id: "请填写Tag",
          })
        );
        return;
      }
      // if (this.state.address_ext.length > 20) {
      //   message.info(
      //     this.props.intl.formatMessage({
      //       id: "Tag长度限制20字符以内"
      //     })
      //   );
      //   return;
      // }
    }

    let fix = math
      .chain(math.bignumber(this.state.available))
      .subtract(math.bignumber(this.props.cash.minQuantity))
      .format({ notation: "fixed" })
      .done();
    if (this.state.available - this.props.cash.minQuantity < 0) {
      message.info(
        this.props.intl.formatMessage({
          id: "提币金额小于最小金额",
        })
      );
      return;
    }
    // 提币数量 大于 可用数量
    if (
      math
        .chain(this.state.available)
        .subtract(this.props.cash.available)
        .format({ notation: "fixed" })
        .done() > 0
    ) {
      message.info(
        this.props.intl.formatMessage({
          id: "余额不足",
        })
      );
      return;
    }
    // 提币金额 大于 24小时最大提币额度
    if (
      math
        .chain(this.state.available)
        .subtract(this.props.cash.dayQuota)
        .format({ notation: "fixed" })
        .done() > 0
    ) {
      message.info(
        this.props.intl.formatMessage({
          id: "提币金额大于24小时最大提币额度",
        })
      );
      return;
    }
    // 到账金额大于0
    if (Number(this.actual_arrival()) < 0) {
      message.info(
        this.props.intl.formatMessage({
          id: "提币金额小于手续费",
        })
      );
      return;
    }
    /**
     * 提币地址框change时，检测是否在黑名单
     * 7、判断地址是否黑名单
     *
     * 提币地址为列表中的，输入资金密码即可提现
     * 提币流程：
     * 2、此次提币如果 needKycCheck=true && available > needKycQuantity ，需进行KYC，，如果无，进行引导
     * 1、需要有资金密码，如果无，进行引导
     * 3、累计5笔达25btc(根据接口返回进行验证), 身份验证信息
     * 4、托管验证码
     *
     * 提币地址不在地址列表中
     * 提币流程：
     * 2、二次验证，如果无，进行引导
     * 3、kyc验证，如果无，进行引导
     * 1、资金密码验证，如果无，进行引导
     * 4、二次验证+资金密码
     * 5、累计5笔达25btc(根据接口返回进行验证), 身份验证信息
     * 6、托管验证码
     */

    const address_list = this.props.address_list || [];
    let inlist = false;
    address_list.forEach((item) => {
      // eos地址是相同的
      if (item.address == this.state.address) {
        // eos 需要对比tag才能确定地址
        if (this.props.cash.needAddressTag) {
          if (this.state.address_ext == item.addressExt) {
            inlist = true;
            this.setState({
              address_id: item.id,
            });
          }
        } else {
          inlist = true;
          this.setState({
            address_id: item.id,
          });
        }
      }
    });
    this.setState({
      inlist,
    });
    // 在提币列表中
    if (inlist) {
      // step1
      if (
        this.props.cash.needKycCheck &&
        this.state.available - this.props.cash.needKycQuantity > 0
      ) {
        // 未实名, 实名认证引导
        if (this.props.userinfo.verifyStatus !== 2) {
          this.setState({
            isopen5: true,
          });
          return;
        }
      }
      // step2, 未绑定资金密码
      if (!this.props.userinfo.bindTradePwd) {
        this.setState({
          isopen6: true,
        });
        return;
      }
      // 资金密码
      this.setState({
        isopen3: true,
      });
      return;
    }
    this.setState({
      isopen: true,
    });
  }
  // 判断地址是否在黑名单
  addressCheck = async () => {
    setTimeout(() => {
      this.setState({
        anchorEl: null,
      });
    }, 200);
    if (!this.state.address) return;
    try {
      await this.props.dispatch({
        type: "finance/address_check",
        payload: {
          token_id: this.props.match.params.token.toUpperCase(),
          address_id: this.state.address_id,
          address: this.state.address,
          address_ext: this.state.address_ext,
          chain_type: this.state.chain_type,
        },
        success: (data) => {
          // 当前地址在黑名单
          if (data.address == this.state.address && data.isInBlackList) {
            this.setState({
              isopen7: true,
            });
          }
          // 是否为内部地址
          if (data.address == this.state.address) {
            this.setState({
              isInnerAddress: data.isInnerAddress,
            });
          }
        },
      });
      this.setState({
        address_checked: true,
      });
    } catch (e) {
      this.setState({
        address_checked: true,
      });
    }
  };
  sendVerfiCode() {
    this.props.dispatch({
      type: "finance/cash_re_verify_code",
      payload: {
        request_id: this.state.request_id,
      },
      success: (obj) => {
        //console.log(obj);
        this.setState(
          {
            ...obj,
          },
          () => {
            //console.log(this.state);
          }
        );
      },
      fail(code) {
        // 再次发送验证点击失败
        this.verfiCode && this.verfiCode.reset();
      },
    });
    // this.cash_step1_request({
    //   verify_code: this.state.verify_code,
    //   auth_type: this.state.auth_type
    // });
  }
  // 第一步请求前，检查验证框 this.state[n] 内容
  pre_cash_step1_request = (n) => {
    let v = this.state[n];
    if (!v) {
      this.setState({
        [n + "_msg"]: (
          <React.Fragment>
            {this.props.intl.formatMessage({
              id: "请输入验证码",
            })}
          </React.Fragment>
        ),
      });
      return;
    }
    if (n == "trade_code") {
      if (v < 6 && v > 20) {
        this.setState({
          [n + "_msg"]: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "密码仅限6-20位字符",
              })}
            </React.Fragment>
          ),
        });
        return;
      }
    }
    this.cash_step1_request({
      verify_code: "",
      auth_type: "",
      trade_password: this.state.trade_code,
    });
  };
  cash_step1_request(obj) {
    const client_order_id = new Date().getTime();
    this.setState({
      ...obj,
      client_order_id,
      order_info: {},
    });
    this.props.dispatch({
      type: "finance/withdraw_step1",
      payload: {
        client_order_id,
        token_id: this.props.match.params.token,
        address: this.state.address,
        address_id: this.state.inlist ? this.state.address_id : "",
        // 用户输入的值
        quantity: this.state.available,
        // 到账的值
        arrive_quantity: this.actual_arrival(),
        // 用户选择的手续费
        miner_fee: this.props.cash.suggestMinerFee,
        // 加速百分比，0-1
        // accelerate_scale: math
        //   .chain(this.state.slider)
        //   .divide(100)
        //   .round(2)
        //   .done(),
        verify_code: obj.verify_code,
        auth_type: obj.auth_type,
        trade_password: obj.trade_password,
        //miner_fee_convert_rate: this.props.cash.minerFeeConvertRate,
        order_id: this.props.order_id,
        convert_rate: this.props.cash.convertRate,
        auto_convert: true,
        address_ext: this.state.address_ext,
        chain_type: this.state.chain_type,
      },
      success: (obj) => {
        if (obj.order_info) {
          this.setState({
            order_info: obj.order_info,
          });
        }
        // 需要身份验证
        if (obj.needCheckIdCardNo) {
          this.setState({
            code_order_id: obj.code_order_id,
            request_id: obj.request_id,
            isopen3: false, // 资金密码
            isopen: false, // 二次验证
            isopen2: false, //  资产托管
            isopen4: true, // 身份验证
          });
        } else {
          this.setState({
            code_order_id: obj.code_order_id,
            request_id: obj.request_id,
            isopen3: false, // 资金密码
            isopen: false, // 二次验证
            isopen2: true, //  资产托管
            isopen4: false, // 身份验证
          });
          // isopen = true, 组件渲染需要时间，渲染完成前 this.verfiCode=null，完成后this.verfiCode才能正确获取值
          setTimeout(() => {
            this.verfiCode && this.verfiCode.start();
          }, 100);
        }
      },
      fail: (code, msg) => {
        // 用户未kyc，弹出引导框
        if (code == 31076) {
          this.setState({
            isopen5: true,
            isopen3: false,
          });
        } else {
          message.error(msg);
        }
        // 再次发送验证点击失败
        this.verfiCode && this.verfiCode.reset();
      },
    });
  }
  // 身份认证框提交
  pre_cash_step2_skip = () => {
    this.props.dispatch({
      type: "finance/withdraw_step2",
      payload: {
        account_id: this.props.userinfo.defaultAccountId,
        token_id: this.props.match.params.token,
        client_order_id: this.state.client_order_id,
        request_id: this.state.request_id,
        skip_input_id_card_no: true,
        id_card_no: "",
      },
      success: (obj) => {
        // 身份认证隐藏，展示资产托管框
        this.setState({
          isopen4: false,
          isopen2: true,
          ...obj,
        });
        // isopen = true, 组件渲染需要时间，渲染完成前 this.verfiCode=null，完成后this.verfiCode才能正确获取值
        setTimeout(() => {
          this.verfiCode && this.verfiCode.start();
        }, 100);
      },
      fail: (code, msg) => {
        msg && message.error(msg);
      },
    });
  };
  pre_cash_step2 = () => {
    const v = this.state.kyc_code;
    if (!v) {
      this.setState({
        kyc_code: "",
        kyc_code_msg: (
          <React.Fragment>
            {this.props.intl.formatMessage({
              id: "输入错误",
            })}
          </React.Fragment>
        ),
      });
      return;
    }
    this.props.dispatch({
      type: "finance/withdraw_step2",
      payload: {
        account_id: this.props.userinfo.defaultAccountId,
        token_id: this.props.match.params.token,
        client_order_id: this.state.client_order_id,
        request_id: this.state.request_id,
        skip_input_id_card_no: false,
        id_card_no: v,
      },
      success: (obj) => {
        // 身份认证隐藏，展示资产托管框
        this.setState({
          isopen4: false,
          isopen2: true,
          ...obj,
        });
        // isopen = true, 组件渲染需要时间，渲染完成前 this.verfiCode=null，完成后this.verfiCode才能正确获取值
        setTimeout(() => {
          this.verfiCode && this.verfiCode.start();
        }, 100);
      },
      fail: (code, msg) => {
        msg && message.error(msg);
      },
    });
  };
  cash_step2() {
    if (!this.state.code) {
      this.setState({
        code: "",
        code_msg: (
          <React.Fragment>
            {this.props.intl.formatMessage({
              id: "请输入验证码",
            })}
          </React.Fragment>
        ),
      });
      return false;
    }
    if (!/^[0-9a-zA-Z]{6,8}$/.test(this.state.code)) {
      this.setState({
        code: this.state.code,
        code_msg: (
          <React.Fragment>
            {this.props.intl.formatMessage({
              id: "验证码错误",
            })}
          </React.Fragment>
        ),
      });
      return false;
    }
    this.props.dispatch({
      type: "finance/withdraw_step2",
      payload: {
        account_id: this.props.userinfo.defaultAccountId,
        token_id: this.props.match.params.token,
        client_order_id: this.state.client_order_id,
        code_order_id: this.state.code_order_id,
        verify_code: this.state.code,
        request_id: this.state.request_id,
      },
      history: this.props.history,
      fail: (code, msg) => {
        // 用户未kyc，弹出引导框
        if (code == 31076) {
          this.setState({
            isopen5: true,
          });
        } else {
          msg && message.error(msg);
        }
        this.verfiCode && this.verfiCode.reset();
      },
    });
  }
  // 计算suggestMinerFee，fixfee
  getMinerFee(v) {
    let fixfee = math
      .chain(math.bignumber(this.props.cash.maxMinerFee))
      .subtract(math.bignumber(this.props.cash.minMinerFee))
      .format({ notation: "fixed" })
      .done();
    return {
      suggestMinerFee: math
        .chain(math.bignumber(fixfee))
        .multiply(v)
        .divide(100)
        .add(math.bignumber(this.props.cash.minMinerFee))
        .format({ notation: "fixed" })
        .done(),
      fixfee,
    };
  }
  // 刷动条value
  default_slider() {
    let default_slider = 0;
    let fixfee = this.getMinerFee(0).fixfee;
    if (this.props.cash.suggestMinerFee && Number(fixfee)) {
      default_slider = math
        .chain(math.bignumber(this.props.cash.suggestMinerFee))
        .subtract(math.bignumber(this.props.cash.minMinerFee))
        .divide(math.bignumber(fixfee))
        .multiply(100)
        .format({ notation: "fixed", precision: 4 })
        //.round(4)
        .done();
    }
    return default_slider;
  }

  // 计算手续费
  // 填写地址后计算手续费
  // tokenId == minerFeeTokenId ： fee + 用户选择的矿工费
  // tokenId == feeTokenId : fee + (用户选择的矿工费 * convertRate)
  // else : convertFee + (用户选择的矿工费 * convertRate)
  getUserFee() {
    // 填写地址后计算手续费
    if (!this.state.address) return 0;
    // 余额为0
    if (!this.props.cash.available || this.props.cash.available == 0) {
      return 0;
    }
    // 内部地址，手续费=internalWithdrawFee；
    if (this.state.isInnerAddress) {
      return Number(this.props.cash.internalWithdrawFee)
        ? Number(this.props.cash.internalWithdrawFee)
        : 0;
    }
    const tokenId = this.props.match.params.token.toUpperCase();
    const fee = this.props.cash.fee;
    const convertRate = this.props.cash.convertRate;
    const convertFee = this.props.cash.convertFee;
    const minerFeeTokenId = this.props.cash.minerFeeTokenId;
    const feeTokenId = this.props.cash.feeTokenId;
    let v = 0;
    if (tokenId === minerFeeTokenId) {
      v = math
        .chain(math.bignumber(this.props.cash.suggestMinerFee))
        .add(math.bignumber(this.props.cash.fee))
        .format({ notation: "fixed" })
        .done();
    } else {
      if (tokenId === feeTokenId) {
        v = math
          .chain(math.bignumber(this.props.cash.suggestMinerFee))
          .multiply(math.bignumber(convertRate))
          .add(math.bignumber(fee))
          .format({ notation: "fixed" })
          .done();
      } else {
        v = math
          .chain(math.bignumber(this.props.cash.suggestMinerFee))
          .multiply(math.bignumber(convertRate))
          .add(math.bignumber(convertFee))
          .format({ notation: "fixed" })
          .done();
      }
    }
    return v;
  }
  /**
   * 实际到账
   * // arrivalAccountAmount 到账金额
      if(tokenId == minerFeeTokenId) {
          arrivalAccountAmount = 用户输入的提币数量 - fee - 用户选择的矿工费
      } else {
          if(tokenId == feeTokenId) {
              arrivalAccountAmount = 用户输入的提币数量 -  fee - (用户选择的矿工费 * convertRate)
          } else {
              arrivalAccountAmount = 用户输入的提币数量 -  convertFee - (用户选择的矿工费 * convertRate)
          }
      }
   */
  actual_arrival() {
    // const tokenId = this.props.match.params.token.toUpperCase();
    // const minerFeeTokenId = this.props.cash.minerFeeTokenId;
    // const feeTokenId = this.props.cash.feeTokenId;
    // const convertRate = this.props.cash.convertRate;
    // const fee = this.props.cash.fee;
    // const convertFee = this.props.cash.convertFee;
    let v = 0;
    const user_select_fee = Number(this.getUserFee()); // fee + 用户选择的矿工费
    const available =
      this.state.available - this.props.cash.available > 0
        ? helper.digits(this.props.cash.available, this.props.cash.minPrecision)
        : this.state.available;
    v = math
      .chain(math.bignumber(available))
      //.subtract(math.bignumber(fee))
      .subtract(math.bignumber(user_select_fee))
      .format({ notation: "fixed" })
      .done();
    return v;
  }
  notagChange = (e) => {
    this.setState({
      notag: !this.state.notag,
      address_ext: "",
    });
  };
  render() {
    const { classes } = this.props;
    const token = (this.props.match.params.token || "").toUpperCase();
    const allTokens = this.props.tokens;
    const tokenName = allTokens[token] ? allTokens[token]["tokenName"] : "";
    let desc = "";
    for (let key in this.props.tokens) {
      const item = this.props.tokens[key];
      if (item.tokenId === token) {
        desc = item.tokenFullName;
      }
    }

    // if (!this.props.userinfo.defaultAccountId) {
    //   return (
    //     <div className={gs.g_layout}>
    //       <div className={gs.g_path}>
    //         <a href={route_map.finance_list}>
    //           <Icon type="left" />
    //           <FormattedMessage id="提币" />
    //         </a>
    //       </div>
    //       <div className={gs.g_title}>
    //         <div className={classes.address_title}>
    //           {this.props.tokens[token] ? (
    //             <img src={this.props.tokens[token]["iconUrl"]} />
    //           ) : (
    //             ""
    //           )}
    //           <em>{tokenName}</em>
    //           <span>/ {desc}</span>
    //         </div>
    //       </div>
    //       <div className={gs.g_content}>
    //         <div className={classes.cash} style={{ height: "200px" }}>
    //           <Loading loading={true} />
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }

    if (this.props.userinfo.defaultAccountId) {
      // 未绑定二次验证
      // if (
      //   !this.props.userinfo.bindGA &&
      //   !(this.props.userinfo.registerType === 1
      //     ? this.props.userinfo.email
      //     : this.props.userinfo.mobile)
      // ) {
      //   return <SecVerify userinfo={this.props.userinfo} isopen={true} />;
      // }
      // kyc未通过
      // if (this.props.userinfo.verifyStatus !== 2) {
      //   return (
      //   );
      // }
      // step2 引导 资金密码, 提币并且没绑定资金密码
      if (!this.props.userinfo.bindTradePwd) {
        return (
          <Dialog
            open={true}
            onClose={() => {
              window.location.href = route_map.finance_list;
            }}
            className={classes.cash_kyc}
          >
            <DialogTitle>
              {this.props.intl.formatMessage({ id: "安全提示" })}
            </DialogTitle>
            <DialogContent>
              <FormattedHTMLMessage
                tagName="p"
                id="为了您的账户安全<br/>请您先设置资金密码"
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" href={route_map.finance_list}>
                {this.props.intl.formatMessage({
                  id: "暂不需要",
                })}
              </Button>
              <Button color="primary" href={route_map.fund_password}>
                {this.props.intl.formatMessage({
                  id: "设置",
                })}
              </Button>
            </DialogActions>
          </Dialog>
        );
      }
    }

    if (allTokens["BTC"] && !allTokens[token]) {
      const url =
        window.location.protocol +
        "//" +
        window.location.host +
        route_map.finance_list;
      return (window.location.href = url);
    }
    let options = [];
    options = this.props.address_list.map((item) => {
      const data = Object.assign({}, item);
      return (
        <MenuItem
          key={data.id}
          className={
            data.id == this.state.address_id
              ? classnames(classes.cash_choose, classes.cash_menu)
              : classes.cash_menu
          }
          onClick={this.dropchange.bind(
            this,
            data.id,
            data.address,
            data.addressExt
          )}
        >
          {data.remark}/{data.address}
        </MenuItem>
      );
    });
    if (!this.props.address_list.length) {
      options = (
        <MenuItem
          onClick={this.addAddress.bind(this, token)}
          classnames={classes.cash_menu}
        >
          {this.props.intl.formatMessage({
            id: "暂无地址，请先添加",
          })}
        </MenuItem>
      );
    }

    const loading = this.props.loading || { effects: {} };
    const actual_arrival_value = this.state.available
      ? this.actual_arrival()
      : 0;
    const actual_arrival = this.state.available
      ? actual_arrival_value - 0 >= 0
        ? actual_arrival_value
        : 0
      : "";
    const userfee = helper.digits(this.getUserFee(), 8);
    return (
      <div>
        <Grid
          container
          className={classnames(classes.list, classes.financeCont)}
        >
          {/* <Grid item className={classes.cash_s1}>
            <Fab
              href={route_map.finance_list}
              className={classes.fab}
              size="small"
            >
              <Iconfont type="arrowLeft" size={30} />
            </Fab>
          </Grid> */}
          <Grid item className={classes.cash_s2}>
            <h2>{this.props.intl.formatMessage({ id: "提币" })}</h2>
            <div className={classes.s2_title}>
              {this.props.tokens[token] ? (
                <img src={this.props.tokens[token]["iconUrl"]} />
              ) : (
                ""
              )}
              <em>{tokenName}</em>
              <span> {desc}</span>
            </div>
            {this.state.chainTypes && this.state.chainTypes.length ? (
              <div className={classes.s2_usdt_title}>
                <p>{this.props.intl.formatMessage({ id: "链名称" })}</p>
                {this.state.chainTypes.map((item) => {
                  if (item.allowWithdraw) {
                    if (item.chainType == this.state.chain_type) {
                      return (
                        <Button
                          style={{
                            margin: "0 10px 0 0",
                            padding: "5px 32px",
                            background: `url(${require("../../assets/btn_check.png")})  no-repeat right bottom`,
                          }}
                          color="primary"
                          variant="outlined"
                          key={item.chainType}
                        >
                          {item.chainType}
                        </Button>
                      );
                    } else {
                      return (
                        <Button
                          href={
                            route_map.cash + "/" + token + "/" + item.chainType
                          }
                          key={item.chainType}
                          variant="contained"
                          style={{
                            margin: "0 10px 0 0",
                            padding: "6px 32px",
                          }}
                        >
                          {item.chainType}
                        </Button>
                      );
                    }
                  } else {
                    return (
                      <Button
                        style={{ margin: "0 10px 0 0", padding: "6px 32px" }}
                        disabled
                        variant="contained"
                        key={item.chainType}
                      >
                        {item.chainType}
                      </Button>
                    );
                  }
                })}
              </div>
            ) : (
              ""
            )}

            <Grid container className={classes.cash_from} alignItems="flex-end">
              <Grid item style={{ width: 500 }}>
                <TextField
                  value={this.state.address}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.setState({
                      anchorEl: e.currentTarget,
                    });
                  }}
                  onChange={this.addressChange}
                  onBlur={this.addressCheck}
                  label={this.props.intl.formatMessage({ id: "提币地址" })}
                  placeholder={this.props.intl.formatMessage({
                    id: "提币地址",
                  })}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <Button
                        size="small"
                        color="primary"
                        onClick={this.addAddress.bind(this, token)}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {this.props.intl.formatMessage({
                          id: "添加地址",
                        })}
                      </Button>
                    ),
                  }}
                />
                {/* {token == "HBC" ? (
                  <p
                    style={{ margin: "6px 0 0", color: "rgba(0, 0, 0, 0.54)" }}
                  >
                    {this.props.intl.formatMessage({
                      id: "可提币到对方UID地址",
                    })}
                  </p>
                ) : (
                  ""
                )} */}
                <Popper
                  open={Boolean(this.state.anchorEl)}
                  anchorEl={this.state.anchorEl}
                >
                  <Paper style={{ width: 500 }}>{options}</Paper>
                </Popper>
              </Grid>
            </Grid>
            {this.props.cash.needAddressTag ? (
              <Grid container className={classes.cash_from} alignItems="center">
                <Grid item xs={12}>
                  <Switch
                    checked={this.state.notag}
                    color="primary"
                    name="notag"
                    value="notag"
                    checkedIcon={<Iconfont type="dark" size="16" />}
                    icon={<Iconfont type="whiite" size="16" />}
                    onClick={this.notagChange}
                  />
                  No Tag
                </Grid>
                <Grid item style={{ width: 500 }}>
                  <TextField
                    disabled={this.state.notag ? true : false}
                    value={this.state.address_ext}
                    autoComplete="new-password"
                    onChange={this.onChange.bind(this, "address_ext")}
                    onBlur={this.addressCheck}
                    label="Tag"
                    helperText={this.props.intl.formatMessage({
                      id:
                        "(请务必填写Tag并仔细核对，否则将造成资产损失并不可找回)",
                    })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            ) : (
              ""
            )}
            <Grid container className={classes.cash_from} alignItems="flex-end">
              <Grid
                item
                style={{
                  width: 500,
                  position: "relative",
                  padding: "10px 0 0",
                }}
              >
                <TextField
                  //name="available"
                  value={this.state.available}
                  onChange={this.availableChange}
                  label={`${this.props.intl.formatMessage({
                    id: "可提数量",
                  })}:${helper.digits(
                    this.props.cash.available,
                    this.props.cash.minPrecision
                  )}`}
                  placeholder={`${this.props.intl.formatMessage({
                    id: "可提数量",
                  })}:${helper.digits(
                    this.props.cash.available,
                    this.props.cash.minPrecision
                  )}`}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <Button
                        className={classes.addAddress}
                        color="primary"
                        onClick={() => {
                          this.setState({
                            available: helper.digits(
                              this.props.cash.available,
                              this.props.cash.minPrecision
                            ),
                          });
                        }}
                        size="small"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {this.props.intl.formatMessage({
                          id: "全部提币",
                        })}
                      </Button>
                    ),
                  }}
                />
                {Number(this.props.cash.riskBalanceBtcValue) ? (
                  <Grid container alignItems="center" className={classes.risk}>
                    <Grid item>
                      <TooltipCommon
                        title={this.props.intl.formatMessage({
                          id: "风险资产不可提币",
                        })}
                        placement="top"
                      >
                        <span>
                          <Iconfont type="info_line" />
                        </span>
                      </TooltipCommon>
                    </Grid>
                    <Grid item>
                      <a
                        href={
                          route_map.cash_risk +
                          "/" +
                          (this.props.match.params.token || "").toUpperCase() +
                          "/" +
                          this.state.chain_type
                        }
                      >
                        {this.props.intl.formatMessage({ id: "风险资产" })}:{" "}
                        {this.props.cash.riskBalanceBtcValue} BTC
                      </a>
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
              <Grid item></Grid>
            </Grid>

            {this.state.address && this.state.address_checked ? (
              <div className={classes.fee}>
                <span>{this.props.intl.formatMessage({ id: "手续费" })}: </span>
                <em>{userfee}</em>
                <i> {tokenName}</i>
              </div>
            ) : (
              ""
            )}

            {this.state.address && this.state.address_checked ? (
              <Grid
                className={classes.speed}
                container
                alignItems="center"
                style={{
                  display:
                    this.props.cash.minMinerFee ==
                      this.props.cash.maxMinerFee || this.state.isInnerAddress
                      ? "none"
                      : "flex",
                }}
              >
                <Grid item xs={3} className={classes.speed_left}>
                  {this.props.intl.formatMessage({ id: "提现加速" })}
                </Grid>
                <Grid item xs={8} className={classes.speed_right}>
                  {this.state.checked ? (
                    <Slider
                      value={Number(this.default_slider())}
                      onChange={this.onChange.bind(this, "slider")}
                    />
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            ) : (
              ""
            )}

            <div className={classes.cash_action}>
              <em>
                {this.props.intl.formatMessage({ id: "实际到账" })}:{" "}
                {actual_arrival}
              </em>
              <br />
              {this.props.cash_status ? (
                <Button
                  color="primary"
                  variant="contained"
                  disabled
                  style={{ padding: "9px 42px" }}
                >
                  <CircularProgress size={20} />
                </Button>
              ) : this.props.cash.allowWithdraw &&
                !loading["finance/address_check"] ? (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.cash_step1}
                  style={{ padding: "9px 42px" }}
                >
                  {this.props.intl.formatMessage({
                    id: "提币",
                  })}
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  disabled
                  style={{ padding: "9px 42px" }}
                >
                  {this.props.intl.formatMessage({
                    id: "提币",
                  })}
                </Button>
              )}
              <br />
              <span
                style={{
                  margin: "10px 0 0",
                  color: "#f00",
                  fontSize: "12px",
                  display: "block",
                }}
              >
                {this.props.cash.refuseReason}
              </span>
            </div>
            <div className={classes.cash_tip}>
              <p>
                <FormattedMessage id="温馨提示" />
              </p>
              <ul>
                {/Grin|Beam/i.test(token) ? (
                  <li>
                    {this.props.intl.formatMessage({
                      id:
                        "如果您提币使用个人钱包，必须在发起提币前打开并开启个人钱包，否则请自行承担收不到资产的风险",
                    })}
                  </li>
                ) : (
                  ""
                )}

                <li>
                  {this.props.intl.formatMessage({
                    id: "请务必核对提币地址正确性，否则资产将不可找回",
                  })}
                </li>
                <li>
                  {this.props.intl.formatMessage({
                    id: "最小提币金额",
                  })}
                  : <i>{this.props.cash.minQuantity}</i>
                </li>
                <li>{this.props.intl.formatMessage({ id: "cash.desc.1" })}</li>
                <li>{this.props.intl.formatMessage({ id: "cash.desc.2" })}</li>
                <li>{this.props.intl.formatMessage({ id: "cash.desc.3" })}</li>
                {this.props.cash.tokenType == "ERC20_TOKEN" ? (
                  <li>
                    {this.props.intl.formatMessage(
                      { id: "cash.desc.erc20" },
                      {
                        name: token,
                      }
                    )}
                  </li>
                ) : (
                  ""
                )}
                {token == "ETH" ? (
                  <li>
                    {this.props.intl.formatMessage({
                      id: "cash.desc.eth",
                    })}
                  </li>
                ) : (
                  ""
                )}
                {token == "ZEC" ? (
                  <li>
                    {this.props.intl.formatMessage({
                      id: "cash.desc.zec",
                    })}
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </Grid>
          <Grid item className={classes.cash_s3}>
            <Button
              color="primary"
              className={classes.s3_link}
              variant="outlined"
              onClick={() => {
                window.localStorage.setItem("TabValue", "cash");
                window.location.href = route_map.finance_record;
              }}
            >
              {this.props.intl.formatMessage({ id: "提现记录" })}
            </Button>
          </Grid>
        </Grid>
        <SecVerify
          userinfo={this.props.userinfo}
          dispatch={this.props.dispatch}
          verifyType={14}
          loading={this.props.loading.effects["finance/withdraw_step1"]}
          isopen={this.state.isopen}
          callback={this.cash_step1_request}
          showCloseBtn={true}
          onCancel={this.onCancel.bind(this, "isopen")}
        />
        {/* 资产托管验证框 */}
        <Dialog
          open={Boolean(this.state.isopen2)}
          onClose={this.onCancel.bind(this, "isopen2", "code")}
        >
          <DialogTitle>
            {this.props.intl.formatMessage({
              id: "资产托管验证",
            })}
          </DialogTitle>
          <DialogContent style={{ maxWidth: 450 }}>
            <div className={classes.cash_step2}>
              <div style={{ margin: "0 0 16px" }}>
                {this.props.intl.formatMessage({
                  id: "验证码已发送到",
                })}
                {this.props.userinfo.registerType === 1
                  ? this.props.userinfo.mobile
                  : this.props.userinfo.email}
                ,{" "}
                {this.props.intl.formatMessage({
                  id: "请注意查收",
                })}
              </div>
              <Grid container justify="space-between">
                <Grid item style={{ flex: 1 }}>
                  <TextField
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入验证码",
                    })}
                    fullWidth
                    value={this.state.code}
                    onChange={this.Verify.bind(this, "code")}
                    helperText={this.state.code_msg}
                    error={Boolean(this.state.code_msg)}
                    InputProps={{
                      endAdornment: (
                        <VerfiCodeRC
                          value={this.props.userinfo.defaultAccountId}
                          onClick={this.sendVerfiCode}
                          className={classes.verfCode}
                          ref={(ref) => (this.verfiCode = ref)}
                          variant="text"
                        />
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <h3 style={{ margin: "20px 0 0" }}>
                {this.props.intl.formatMessage({ id: "订单信息" })}
              </h3>
              <TextField
                fullWidth
                disabled
                value={this.state.order_info.address}
                style={{ margin: "10px 0 0" }}
                InputProps={{
                  startAdornment: (
                    <label
                      style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}
                    >
                      {this.props.intl.formatMessage({ id: "提币地址" })}
                    </label>
                  ),
                }}
              />
              {this.state.order_info.addressExt ? (
                <TextField
                  disabled
                  value={this.state.order_info.addressExt}
                  style={{ margin: "10px 0 0" }}
                  label="Tag"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <label
                        style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}
                      >
                        Tag
                      </label>
                    ),
                  }}
                />
              ) : (
                ""
              )}
              <TextField
                fullWidth
                disabled
                value={
                  (this.state.order_info.quantity || "") +
                  " " +
                  (tokenName || "")
                }
                style={{ margin: "10px 0 0" }}
                InputProps={{
                  startAdornment: (
                    <label
                      style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}
                    >
                      {this.props.intl.formatMessage({ id: "提币金额" })}
                    </label>
                  ),
                }}
              />
              <TextField
                fullWidth
                disabled
                value={
                  (this.state.order_info.fee || 0) + " " + (tokenName || "")
                }
                style={{ margin: "10px 0 0" }}
                InputProps={{
                  startAdornment: (
                    <label
                      style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}
                    >
                      {this.props.intl.formatMessage({ id: "手续费" })}
                    </label>
                  ),
                }}
              />
              <TextField
                fullWidth
                disabled
                value={
                  (this.state.order_info.arriveQuantity || "") +
                  " " +
                  (tokenName || "")
                }
                style={{ margin: "10px 0 0" }}
                InputProps={{
                  startAdornment: (
                    <label
                      style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}
                    >
                      {this.props.intl.formatMessage({ id: "实际到账" })}
                    </label>
                  ),
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onCancel.bind(this, "isopen2", "code")}>
              {this.props.intl.formatMessage({ id: "取消" })}
            </Button>
            <Button color="primary" onClick={this.cash_step2}>
              {this.props.intl.formatMessage({
                id: "确定",
              })}
            </Button>
          </DialogActions>
        </Dialog>
        {/* 资金密码验证框 */}
        <Dialog
          open={Boolean(this.state.isopen3)}
          showCloseBtn={true}
          onClose={this.onCancel.bind(this, "isopen3", "trade_code")}
        >
          <DialogTitle>
            {this.props.intl.formatMessage({
              id: "资金密码",
            })}
          </DialogTitle>
          <DialogContent style={{ maxWidth: 448 }}>
            <div className={classes.cash_step2} style={{ width: 400 }}>
              <TextField
                type="password"
                placeholder={this.props.intl.formatMessage({
                  id: "请输入资金密码",
                })}
                fullWidth
                value={this.state.trade_code}
                onChange={this.Verify.bind(this, "trade_code")}
                helperText={this.state.trade_code_msg}
                error={Boolean(this.state.trade_code_msg)}
              />
            </div>
            <h3 style={{ margin: "20px 0 0" }}>
              {this.props.intl.formatMessage({ id: "订单信息" })}
            </h3>
            <TextField
              fullWidth
              disabled
              value={this.state.address}
              style={{ margin: "10px 0 0", maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <label style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}>
                    {this.props.intl.formatMessage({ id: "提币地址" })}
                  </label>
                ),
              }}
            />
            {this.state.address_ext ? (
              <TextField
                disabled
                value={this.state.address_ext}
                style={{ margin: "10px 0 0", maxWidth: 400 }}
                label="Tag"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <label
                      style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}
                    >
                      Tag
                    </label>
                  ),
                }}
              />
            ) : (
              ""
            )}
            <TextField
              fullWidth
              disabled
              value={(this.state.available || "") + " " + (tokenName || "")}
              style={{ margin: "10px 0 0", maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <label style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}>
                    {this.props.intl.formatMessage({ id: "提币金额" })}
                  </label>
                ),
              }}
            />
            <TextField
              fullWidth
              disabled
              value={userfee + " " + (tokenName || "")}
              style={{ margin: "10px 0 0", maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <label style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}>
                    {this.props.intl.formatMessage({ id: "手续费" })}
                  </label>
                ),
              }}
            />
            <TextField
              fullWidth
              disabled
              value={(actual_arrival || "") + " " + (tokenName || "")}
              style={{ margin: "10px 0 0", maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <label style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}>
                    {this.props.intl.formatMessage({ id: "实际到账" })}
                  </label>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onCancel.bind(this, "isopen3", "trade_code")}>
              {this.props.intl.formatMessage({
                id: "取消",
              })}
            </Button>
            <Button
              onClick={this.pre_cash_step1_request.bind(this, "trade_code")}
              color="primary"
            >
              {this.props.intl.formatMessage({
                id: "确定",
              })}
            </Button>
          </DialogActions>
        </Dialog>
        {/* 身份验证框 */}
        <Dialog
          open={Boolean(this.state.isopen4)}
          onClose={this.onCancel.bind(this, "isopen4", "kyc_code")}
        >
          <DialogTitle>
            {this.props.intl.formatMessage({
              id: "信息验证",
            })}
          </DialogTitle>
          <DialogContent style={{ maxWidth: 500 }}>
            <div className={classes.cash_step2}>
              <div style={{ margin: "0 0 10px" }}>
                <strong>
                  {this.props.intl.formatMessage({
                    id: "有效证件",
                  })}
                </strong>
                <br />
                <span>
                  {this.props.intl.formatMessage({
                    id:
                      "填写正确的有效证件号加快提币审核速度，跳过此项我们将对您的提币进行人工审核，请耐心等待工作人员电话或邮件联系。",
                  })}
                </span>
              </div>
              <TextField
                placeholder={this.props.intl.formatMessage({
                  id: "请填写您的实名有效证件",
                })}
                fullWidth
                value={this.state.kyc_code}
                onChange={this.Verify.bind(this, "kyc_code")}
                helperText={this.state.kyc_code_msg}
                error={Boolean(this.state.kyc_code_msg)}
              />
            </div>
            <h3 style={{ margin: "20px 0 0" }}>
              {this.props.intl.formatMessage({ id: "订单信息" })}
            </h3>
            <TextField
              fullWidth
              disabled
              value={this.state.order_info.address}
              style={{ margin: "10px 0 0" }}
              InputProps={{
                startAdornment: (
                  <label style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}>
                    {this.props.intl.formatMessage({ id: "提币地址" })}
                  </label>
                ),
              }}
            />
            {this.state.order_info.addressExt ? (
              <TextField
                disabled
                value={this.state.order_info.addressExt}
                style={{ margin: "10px 0 0" }}
                label="Tag"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <label
                      style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}
                    >
                      Tag
                    </label>
                  ),
                }}
              />
            ) : (
              ""
            )}
            <TextField
              fullWidth
              disabled
              value={
                (this.state.order_info.quantity || "") + " " + (tokenName || "")
              }
              style={{ margin: "10px 0 0" }}
              InputProps={{
                startAdornment: (
                  <label style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}>
                    {this.props.intl.formatMessage({ id: "提币金额" })}
                  </label>
                ),
              }}
            />
            <TextField
              fullWidth
              disabled
              value={(this.state.order_info.fee || 0) + " " + (tokenName || "")}
              style={{ margin: "10px 0 0" }}
              InputProps={{
                startAdornment: (
                  <label style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}>
                    {this.props.intl.formatMessage({ id: "手续费" })}
                  </label>
                ),
              }}
            />
            <TextField
              fullWidth
              disabled
              value={
                (this.state.order_info.arriveQuantity || "") +
                " " +
                (tokenName || "")
              }
              style={{ margin: "10px 0 0" }}
              InputProps={{
                startAdornment: (
                  <label style={{ whiteSpace: "nowrap", margin: "0 10px 0 0" }}>
                    {this.props.intl.formatMessage({ id: "实际到账" })}
                  </label>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.pre_cash_step2_skip}>
              {this.props.intl.formatMessage({
                id: "跳过",
              })}
            </Button>
            <Button color="primary" onClick={this.pre_cash_step2}>
              {this.props.intl.formatMessage({
                id: "确定",
              })}
            </Button>
          </DialogActions>
        </Dialog>
        {/* 实名认证引导框 */}
        <Dialog
          open={Boolean(this.state.isopen5)}
          onClose={() => {
            window.location.href = route_map.finance_list;
          }}
          className={classes.cash_kyc}
        >
          <DialogContent>
            <FormattedHTMLMessage
              tagName="p"
              id="为了您的账户安全<br/>请您实名认证后再进行提币"
            />
          </DialogContent>

          <DialogActions>
            <Button href={route_map.finance_list}>
              {this.props.intl.formatMessage({
                id: "暂不需要",
              })}
            </Button>
            <Button color="primary" href={route_map.user_kyc}>
              {this.props.intl.formatMessage({
                id: "实名认证",
              })}
            </Button>
          </DialogActions>
        </Dialog>
        {/* 地址黑名单提示 */}
        <Dialog
          open={Boolean(this.state.isopen7)}
          onClose={() => {
            this.setState({
              isopen7: false,
            });
          }}
          className={classes.cash_kyc}
        >
          <DialogContent>
            <p style={{ padding: "10px 0px", textAlign: "left" }}>
              {this.props.intl.formatMessage({
                id:
                  "您输入的提币地址存在安全风险，资产可能无法到账。请慎重考虑是否更换提币地址？",
              })}
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({
                  isopen7: false,
                });
              }}
            >
              {this.props.intl.formatMessage({
                id: "继续提币",
              })}
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.setState({
                  isopen7: false,
                  address: "",
                  address_ext: "",
                  address_id: "",
                });
              }}
            >
              {this.props.intl.formatMessage({
                id: "更换地址",
              })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles((theme) => ({
  ...layout_styles(theme),
  ...styles(theme),
}))(injectIntl(Cash));
