// 用户实名认证
import React from "react";
import { Iconfont, message } from "../../lib";
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from "react-intl";
import route_map from "../../config/route_map";
import Upload from "rc-upload";
import URLS from "../../config/api";
import helper from "../../utils/helper";
import VerfiCodeRC from "../public/verificationCode_mui";
import cookie from "../../utils/cookie";
import {
  Select,
  MenuItem,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  CircularProgress,
  DialogTitle,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import SelectRC from "../public/select";
import styles from "./usercenter_style";
import { withStyles } from "@material-ui/core/styles";
import GoBackRC from "./goBack";
import CONST from "../../config/const";
import TextFieldCN from "../public/textfiled";

class KYC extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      isopen: false,
      country: {
        msg: "",
        value: "",
      },
      name: {
        value: "",
        msg: "",
      },
      lastName: {
        value: "",
        msg: "",
      },
      fullName: {
        value: "",
        msg: "",
      },
      fileType: {
        value: 1,
        msg: "",
      },
      file: {
        value: "",
        msg: "",
      },
      ID_NO: {
        value: "",
        msg: "",
      },
      sex: {
        value: 1,
        msg: "",
      },
      pic1: {
        value: "",
        msg: "",
      },
      pic2: {
        value: "",
        msg: "",
      },
      national_code: CONST.DEFAULT_NATIONAL_CODE,
      sendVerfiCode: false, // email发送验证码按钮点击状态
      sendMobileVerfiCode: false, // mobile发送验证码按钮点击状态
      mobile: {
        value: "",
        msg: "",
      },
      mobileCode: {
        value: "",
        msg: "",
      },
      emailCode: {
        value: "",
        msg: "",
      },
      isopen2: false,
    };
    this.change = this.change.bind(this);
    this.uploadSuccess = this.uploadSuccess.bind(this);
    this.vali = this.vali.bind(this);
    this.renderSuccess = this.renderSuccess.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);

    this.changeStatus = this.changeStatus.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.bindMobile = this.bindMobile.bind(this);
    this.basicAction = this.basicAction.bind(this);
    this.seniorAction = this.seniorAction.bind(this);
    this.updateVerifyInfo = this.updateVerifyInfo.bind(this);
  }
  componentDidMount() {
    this.setState({
      national_code:
        this.props.areacode[window.localStorage.lang] ||
        this.props.areacode["zh-cn"],
    });
    this.updateVerifyInfo();
  }
  updateVerifyInfo() {
    this.props.dispatch({
      type: "user/verify_info",
      payload: {},
      callback: (displayLevel, verifyStatus) => {
        let current_level = displayLevel;
        if (displayLevel == "0") {
          current_level = "1";
        } else if (displayLevel == "1" && verifyStatus == 2) {
          current_level = "2";
        } else if (displayLevel == "2" && verifyStatus == 2) {
          current_level = "3";
        }
        this.props.dispatch({
          type: "user/get_user_kycinfo",
          payload: {
            current_level: current_level,
          },
        });
      },
    });
  }
  onCancel() {
    this.setState({
      isopen: false,
    });
  }
  cancel = () => {
    this.setState({
      isopen2: false,
      national_code: "86",
      sendVerfiCode: false, // email发送验证码按钮点击状态
      sendMobileVerfiCode: false, // mobile发送验证码按钮点击状态
      mobile: {
        value: "",
        msg: "",
      },
      mobileCode: {
        value: "",
        msg: "",
      },
      emailCode: {
        value: "",
        msg: "",
      },
    });
    this.verfiCode.reset();
    this.verfiCode2.reset();
  };
  // 发送验证码
  sendVerfiCode(order_id_name) {
    if (order_id_name === "mobile_order_id") {
      if (!this.state.mobile.value) {
        this.setState({
          mobile: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "此项不能为空",
                })}
              </React.Fragment>
            ),
            value: "",
          },
        });
        this.verfiCode.reset();
        return;
      }
      if (
        this.state.national_code === "86" &&
        !/^1[3456789]\d{9}$/.test(this.state.mobile.value)
      ) {
        this.setState({
          mobile: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "无效的手机",
                })}
              </React.Fragment>
            ),
            value: "",
          },
        });
        this.verfiCode.reset();
        return;
      }
    }
    this.setState(
      {
        [order_id_name ? "sendMobileVerfiCode" : "sendVerfiCode"]: true,
      },
      () => {
        let data = {};

        if (order_id_name) {
          data.mobile = this.state.mobile.value;
          data.national_code = this.state.national_code;
        } else {
          data.email = this.props.userinfo.email;
        }
        data.type = 5;

        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          n: data.mobile ? 0 : 1,
          order_id_name: order_id_name || "order_id",
          errorCallback: () => {
            this.setState({
              [order_id_name ? "sendMobileVerfiCode" : "sendVerfiCode"]: false,
            });
            if (order_id_name) {
              this.verfiCode.reset();
            } else {
              this.verfiCode2.reset();
            }
          }, // 验证码错误回调
        });
      }
    );
  }
  changeStatus(n, e) {
    const t = e.target;
    if (n === "mobile") {
      this.verfiCode.reset();
      this.setState({
        sendMobileVerfiCode: false,
        mobileCode: {
          value: "",
          msg: "",
        },
      });
    }
    this.setState({
      [n]: {
        msg: "",
        value: helper.removeEmoji(t.value.replace(/\s/g, "")),
      },
    });
  }
  // 绑定
  bindMobile() {
    // 请获取手机验证码
    if (!this.state.sendMobileVerfiCode) {
      this.setState({
        mobileCode: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请获取验证码",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      this.verfiCode.reset();
      return;
    }
    // 请获取邮箱验证码
    if (!this.state.sendVerfiCode) {
      this.setState({
        emailCode: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请获取验证码",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      this.verfiCode.reset();
      return;
    }
    // 请输入手机号
    if (!this.state.mobile.value) {
      this.setState({
        mobile: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "此项不能为空",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      this.verfiCode.reset();
      return;
    }
    // 请输入正确的手机号
    if (
      this.state.national_code === "86" &&
      !/^1[3456789]\d{9}$/.test(this.state.mobile.value)
    ) {
      this.setState({
        mobile: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "无效的手机",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      this.verfiCode.reset();
      return;
    }
    // 手机验证码不正确
    if (!/^[a-z0-9A-Z]{6,8}$/.test(this.state.mobileCode.value)) {
      this.setState({
        mobileCode: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "验证码错误",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      this.verfiCode.reset();
      return;
    }

    // 请输入邮箱验证码
    if (!this.state.emailCode.value) {
      this.setState({
        emailCode: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "请输入验证码",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      this.verfiCode2.reset();
      return;
    }
    // 邮箱验证码不正确
    if (!/^[a-z0-9A-Z]{6,8}$/.test(this.state.emailCode.value)) {
      this.setState({
        emailCode: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "验证码错误",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      this.verfiCode2.reset();
      return;
    }

    this.props.dispatch({
      type: "user/bind_mobile",
      payload: {
        national_code: this.state.national_code,
        mobile: this.state.mobile.value,
        mobile_order_id: this.props.mobile_order_id,
        mobile_verify_code: this.state.mobileCode.value,
        order_id: this.props.order_id,
        verify_code: this.state.emailCode.value,
      },
      history: this.props.history,
      success: () => {
        this.props.dispatch({
          type: "layout/userinfo",
          payload: {},
        });
        this.setState({
          isopen2: false,
        });
        this.submitBasic();
      },
    });
  }
  uploadSuccess(file, ret) {
    this.setState({
      [file]: {
        value: ret.url,
        msg: "",
      },
    });
  }
  beforeUpload(pic, file, filelist) {
    return new Promise((resolve, reject) => {
      if (!/png|jpg|jpeg/i.test(file.type)) {
        this.setState({
          [pic]: {
            value: "",
            msg: this.props.intl.formatMessage({
              id: "图片格式不正确",
            }),
          },
        });
        return reject(
          this.props.intl.formatMessage({
            id: "图片格式不正确",
          })
        );
      }
      if (file.size > 10 * 1024 * 1024) {
        this.setState({
          [pic]: {
            value: "",
            msg: this.props.intl.formatMessage({
              id: "图片不能大于10M",
            }),
          },
        });
        return reject(
          this.props.intl.formatMessage({
            id: "图片不能大于10M",
          })
        );
      }
      return resolve(file);
    });
  }
  change(n, e) {
    const t = e.target;
    this.setState({
      [n]: {
        value:
          t.type === "checkbox"
            ? t.checked
            : helper.removeEmoji(t.value.replace(/\s/g, "")),
        msg: "",
      },
    });
  }
  fileTypeChange = (e) => {
    this.setState({
      fileType: {
        value: e.target.value,
        msg: "",
      },
    });
  };
  renderLoading() {
    const classes = this.props.classes;
    return (
      <div className={classes.key_loading}>
        <CircularProgress />
      </div>
    );
  }
  SelectChange = (v) => {
    this.setState({
      country: {
        msg: "",
        value: v,
      },
    });
  };
  // 基础认证按钮点击事件处理
  basicAction() {
    const r = this.vali("basic");
    if (!r) {
      return;
    }
    let id = "";
    const countries = this.props.countries || [];
    countries.forEach((item) => {
      if (item.countryName == this.state.country.value) {
        id = item.nationalCode;
      }
    });
    // 中国用户，如果没有绑定手机，先进行绑定手机
    // if (!this.props.userinfo.mobile && id == 86) {
    //   this.setState({
    //     isopen2: true
    //   });
    // } else {
    //   this.submitBasic();
    // }
    this.submitBasic();
  }
  seniorAction() {
    const r = this.vali();
    if (!r) {
      return;
    }
    let params = {
      card_front_url: encodeURIComponent(this.state.pic1.value),
      card_hand_url: encodeURIComponent(this.state.pic2.value),
    };
    this.props.dispatch({
      type: "user/save_seniorverify",
      payload: params,
      callback: () => {
        this.updateVerifyInfo();
      },
    });
  }
  // 基础信息验证值是否都有
  vali(basic) {
    const country = this.state.country.value;
    const name = this.state.name.value;
    const lastName = this.state.lastName.value;
    const file = this.state.file.value;
    const fullName = this.state.fullName.value;
    const ID_NO = this.state.ID_NO.value;
    const pic1 = this.state.pic1.value;
    const pic2 = this.state.pic2.value;
    const countries = this.props.countries;
    let id = "";
    countries.forEach((item) => {
      if (item.countryName == this.state.country.value) {
        id = item.id;
      }
    });
    if (basic) {
      // 基础认证校验
      if (!country) {
        this.setState({
          country: {
            value: "",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "请选择国家",
                })}
              </React.Fragment>
            ),
          },
        });
        return false;
      }
      if (id == "1") {
        if (!fullName) {
          this.setState({
            fullName: {
              value: "",
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "请输入姓名",
                  })}
                </React.Fragment>
              ),
            },
          });
          return false;
        }
        if (!ID_NO) {
          this.setState({
            ID_NO: {
              value: "",
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "请输入身份证号",
                  })}
                </React.Fragment>
              ),
            },
          });
          return false;
        }
        return true;
      } else {
        if (!name) {
          this.setState({
            name: {
              value: "",
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "请输入姓氏",
                  })}
                </React.Fragment>
              ),
            },
          });
          return false;
        }
        if (!lastName) {
          this.setState({
            lastName: {
              value: "",
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "请输入名字",
                  })}
                </React.Fragment>
              ),
            },
          });
          return false;
        }
        if (!file) {
          this.setState({
            file: {
              value: "",
              msg: (
                <React.Fragment>
                  {this.props.intl.formatMessage({
                    id: "请输入证件号码",
                  })}
                </React.Fragment>
              ),
            },
          });
          return false;
        }
        return true;
      }
      return true;
    } else {
      if (!pic1) {
        this.setState({
          pic1: {
            value: "",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "请上传有效证件正面照",
                })}
              </React.Fragment>
            ),
          },
        });
        return false;
      }
      if (!pic2) {
        this.setState({
          pic2: {
            value: "",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "请上传手持有效证件正面照和个人签字照",
                })}
              </React.Fragment>
            ),
          },
        });
        return false;
      }
      return true;
    }
  }
  // 提交基础认证信息
  submitBasic() {
    const country = this.state.country.value;
    const countries = this.props.countries;
    let shortName = "";
    countries.forEach((item) => {
      if (item.countryName == country) {
        shortName = item.shortName;
      }
    });
    let params = {
      country_code: shortName || countries[0]["shortName"],
    };
    if (shortName == "CN") {
      params["name"] = this.state.fullName.value;
      params["card_type"] = 1;
      params["card_no"] = this.state.ID_NO.value;
    } else {
      params["first_name"] = this.state.name.value;
      params["second_name"] = this.state.lastName.value;
      params["card_type"] = this.state.fileType.value;
      params["card_no"] = this.state.file.value;
    }
    this.props.dispatch({
      type: "user/save_basicverify",
      payload: params,
    });
  }
  changeVerifyInfo(params) {
    let { verify_info } = this.props;
    verify_info = Object.assign({}, verify_info, params);
    let current_level_info = {};
    if (params.showLevel) {
      current_level_info =
        this.props.user_kycinfo.find(
          (data) => data.displayLevel == params.showLevel
        ) || {};
    }
    this.props.dispatch({
      type: "user/propsChange",
      payload: {
        verify_info,
        current_level_info,
      },
    });
  }
  // 标题
  renderTitle() {
    const classes = this.props.classes;
    let { displayLevel, verifyStatus } = this.props.verify_info;
    let title = "";
    if (!displayLevel) {
      title = "";
    } else if (
      displayLevel == "0" ||
      (displayLevel == "1" && verifyStatus != 2)
    ) {
      title = "基础认证";
    } else if (displayLevel == "1" && verifyStatus == 2) {
      title = "高级认证";
    } else if (
      (displayLevel == "3" && verifyStatus == 0) ||
      (displayLevel == 2 && verifyStatus == 2 && this.props.needVedioVerify)
    ) {
      title = "视频认证";
    }
    return (
      <div className={classes.kyc_title}>
        {this.props.intl.formatMessage({ id: "个人实名认证" })}
        {title ? "-" + this.props.intl.formatMessage({ id: title }) : ""}
      </div>
    );
  }
  // 引导认证提示
  renderTip() {
    const classes = this.props.classes;
    const { displayLevel, verifyStatus } = this.props.verify_info;
    if (
      (!verifyStatus && verifyStatus !== 0) ||
      !displayLevel ||
      (displayLevel == "0" && [2, 3].indexOf(verifyStatus) > -1) ||
      (displayLevel == "1" && [1, 3].indexOf(verifyStatus) > -1)
    ) {
      return "";
    } else if (
      (displayLevel == "2" &&
        ([1, 3].indexOf(verifyStatus) > -1 ||
          (verifyStatus == 2 && !this.props.needVedioVerify))) ||
      (displayLevel == "3" && [1, 2, 3].indexOf(verifyStatus) > -1)
    ) {
      // 高级认证、视频认证
      return (
        <div className={classes.password_tip}>
          {this.props.intl.formatMessage({
            id: "用户提现，法币交易及API设置验证",
          })}
        </div>
      );
    }
    return (
      <div className={classes.kyc_tip}>
        <h3>{this.props.intl.formatMessage({ id: "认证后可获得以下权限" })}</h3>
        <ul>
          <FormattedHTMLMessage
            id="OTC每日限额 {amount} {unit}"
            values={{
              amount: this.props.current_level_info.otcDailyLimit,
              unit: this.props.current_level_info.otcLimitCurrency,
            }}
            tagName="li"
          />
          <FormattedHTMLMessage
            id="每日提现额度最大 {amount} {unit}"
            values={{
              amount: this.props.current_level_info.withdrawDailyLimit,
              unit: this.props.current_level_info.withdrawLimitToken,
            }}
            tagName="li"
          />
        </ul>
      </div>
    );
  }
  // 基础认证渲染
  renderBasic() {
    const classes = this.props.classes;
    const verifyStatus = this.props.verify_info.verifyStatus;
    const statusMap = {
      2: "认证通过",
      3: "认证失败",
    };
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const otc =
      protocol +
      "//" +
      (hostname.indexOf("www") > -1
        ? hostname.replace("www", "otc")
        : `otc.${hostname}`);
    if ((!verifyStatus && verifyStatus != "0") || verifyStatus == "1") {
      return "";
    } else if (verifyStatus == "0") {
      return this.renderBasicForm();
    } else if (verifyStatus == "2") {
      return (
        <div className={classes.basic_status}>
          <img src={require("../../assets/success.png")} />
          <h2>
            {this.props.intl.formatMessage({ id: statusMap[verifyStatus] })}
          </h2>
          <div className={classes.btn_group}>
            {this.props.config.functions && this.props.config.functions.otc ? (
              <a href={otc}>
                <Button variant="outlined" color="primary">
                  {this.props.intl.formatMessage({ id: "法币交易" })}
                </Button>
              </a>
            ) : (
              ""
            )}
            <Button
              onClick={this.updateVerifyInfo}
              variant="contained"
              color="primary"
            >
              {this.props.intl.formatMessage({ id: "继续高级认证" })}
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className={classes.basic_status}>
          <img src={require("../../assets/fail.png")} />
          <h2>
            {this.props.intl.formatMessage({ id: statusMap[verifyStatus] })}
          </h2>
          <p>
            {this.props.intl.formatMessage({
              id: "基础认证未通过，请重新认证",
            })}
          </p>
          <div className={classes.btn_group}>
            <Button
              onClick={this.changeVerifyInfo.bind(this, { verifyStatus: 0 })}
              variant="contained"
              color="primary"
            >
              {this.props.intl.formatMessage({ id: "重新认证" })}
            </Button>
          </div>
        </div>
      );
    }
  }
  // 基础认证表单渲染
  renderBasicForm() {
    const classes = this.props.classes;
    let options = [];
    this.props.countries.forEach((item) => {
      options.push({
        label: item.countryName,
        value: item.countryName,
        search:
          item.countryName +
          item.nationalCode +
          item.shortName +
          item.indexName,
        id: item.id,
      });
    });
    const selected = this.state.country.value;
    return (
      <div className={classes.kyc_form}>
        <SelectRC
          options={options}
          value={selected}
          onChange={this.SelectChange}
          label={this.props.intl.formatMessage({
            id: "国籍",
          })}
          noshrink={true}
        />
        <p className={classes.g_formMsg}>{this.state.country.msg}</p>
        {selected != "中国" && selected != "China" ? (
          <Grid container style={{ margin: "20px auto 0" }}>
            <Grid item xs={6} style={{ padding: "0 10px 0 0" }}>
              <TextFieldCN
                helperText={this.state.name.msg}
                error={Boolean(this.state.name.msg)}
                label={this.props.intl.formatMessage({ id: "姓氏" })}
                value={this.state.name.value}
                onChange={this.change.bind(this, "name")}
                fullWidth
                // InputLabelProps={{
                //   shrink: true
                // }}
                placeholder={this.props.intl.formatMessage({
                  id: "请输入姓氏",
                })}
                type="new-password"
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldCN
                helperText={this.state.lastName.msg}
                error={Boolean(this.state.lastName.msg)}
                label={this.props.intl.formatMessage({ id: "名字" })}
                value={this.state.lastName.value}
                onChange={this.change.bind(this, "lastName")}
                fullWidth
                type="new-password"
                placeholder={this.props.intl.formatMessage({
                  id: "请输入名字",
                })}
                // InputLabelProps={{
                //   shrink: true
                // }}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container style={{ margin: "20px auto 0" }}>
            <TextFieldCN
              helperText={this.state.fullName.msg}
              error={Boolean(this.state.fullName.msg)}
              label={this.props.intl.formatMessage({ id: "姓名" })}
              value={this.state.fullName.value}
              onChange={this.change.bind(this, "fullName")}
              fullWidth
              // InputLabelProps={{
              //   shrink: true
              // }}
              placeholder={this.props.intl.formatMessage({
                id: "请输入姓名",
              })}
              type="new-password"
            />
          </Grid>
        )}
        {selected != "中国" && selected != "China" ? (
          <Grid container style={{ margin: "20px auto 0" }}>
            <Grid item xs={4} style={{ padding: "0 10px 0 0" }}>
              <FormControl style={{ width: "100%" }}>
                <InputLabel htmlFor="file_type">
                  {this.props.intl.formatMessage({ id: "证件类型" })}
                </InputLabel>
                <Select
                  inputProps={{
                    id: "file_type",
                  }}
                  autoWidth
                  value={this.state.fileType.value}
                  onChange={this.fileTypeChange}
                  className={classes.select}
                >
                  {(this.props.id_card_type || []).map((item) => {
                    return (
                      <MenuItem key={item.key} value={item.key}>
                        {item.value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <TextField
                error={Boolean(this.state.file.msg)}
                helperText={this.state.file.msg}
                label={this.props.intl.formatMessage({ id: "证件号码" })}
                fullWidth
                value={this.state.file.value}
                onChange={this.change.bind(this, "file")}
                type="new-password"
                placeholder={this.props.intl.formatMessage({
                  id: "请输入证件号码",
                })}
                // InputLabelProps={{
                //   shrink: true
                // }}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container style={{ margin: "20px auto 0" }}>
            <TextField
              error={Boolean(this.state.ID_NO.msg)}
              helperText={this.state.ID_NO.msg}
              label={this.props.intl.formatMessage({ id: "身份证号" })}
              fullWidth
              value={this.state.ID_NO.value}
              onChange={this.change.bind(this, "ID_NO")}
              type="new-password"
              placeholder={this.props.intl.formatMessage({
                id: "请输入身份证号",
              })}
              // InputLabelProps={{
              //   shrink: true
              // }}
            />
          </Grid>
        )}
        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={this.basicAction}
        >
          {this.props.intl.formatMessage({ id: "提交" })}
        </Button>
      </div>
    );
  }
  goto(link) {
    window.location.href = link;
  }
  // 高级认证渲染
  renderSenior() {
    const classes = this.props.classes;
    const hostname = window.location.hostname;
    const imghost = window.location.protocol + "//" + hostname;
    const { verifyStatus } = this.props.verify_info;
    const { kycLevel } = this.props.current_level_info;
    if (!verifyStatus && verifyStatus != 0) {
      return "";
    }
    const level2 = this.props.kycSettings.level2 || {};
    return (
      <div className={classes.senior}>
        {this.renderSuccess("请先核对信息，然后开始验证")}
        <p className={classes.reAuth}>
          {this.props.intl.formatMessage({ id: "信息错误或不一致？" })}
          <span
            onClick={this.changeVerifyInfo.bind(this, {
              displayLevel: "0",
              verifyStatus: 0,
              showLevel: "1",
            })}
          >
            {this.props.intl.formatMessage({ id: "重新基础认证" })}
          </span>
        </p>
        {kycLevel == 20 ? (
          <div className={classes.upload}>
            <div className={classes.kyc_uploads}>
              <div className={classes.pic_tip}>
                <strong>{level2.frontTitle || ""}</strong>
                <p>{level2.frontDescription || ""}</p>
              </div>

              <div className={classes.kyc_upload}>
                <div>
                  <img alt="" src={level2.frontBackgroundWeb || ""} />
                </div>
                <Upload
                  component="div"
                  name="upload_image_file"
                  data={{
                    c_token: cookie.read("c_token") || "",
                  }}
                  action={URLS.upload_image}
                  withCredentials={true}
                  onSuccess={this.uploadSuccess.bind(this, "pic1")}
                  beforeUpload={this.beforeUpload.bind(this, "pic1")}
                  onError={(err, res) => {
                    //window.console.log(err, res);
                    message.info(res.msg);
                  }}
                >
                  {this.state.pic1.value ? (
                    <div className={classes.kyc_upload_image}>
                      <img alt="" src={imghost + this.state.pic1.value} />
                      <strong>
                        <Iconfont type="positive" size="48" />
                        <em>
                          {this.props.intl.formatMessage({ id: "点击修改" })}
                        </em>
                      </strong>
                    </div>
                  ) : (
                    <div className={classes.kyc_upload_image}>
                      <strong>
                        <Iconfont type="positive" size="48" />
                        <em>
                          {this.props.intl.formatMessage({ id: "点击上传" })}
                        </em>
                      </strong>
                    </div>
                  )}
                </Upload>
              </div>
              <p>{this.state.pic1.msg}</p>
            </div>
            <div className={classes.kyc_uploads}>
              <div className={classes.pic_tip}>
                <strong>{level2.holdTitle || ""}</strong>
                <p className={classes.tip}>{level2.holdDescription || ""}</p>
              </div>

              <div className={classes.kyc_upload}>
                <div>
                  <img alt="" src={level2.holdBackgroundWeb || ""} />
                </div>
                <Upload
                  component="div"
                  name="upload_image_file"
                  action={URLS.upload_image}
                  data={{
                    c_token: cookie.read("c_token") || "",
                  }}
                  withCredentials={true}
                  onSuccess={this.uploadSuccess.bind(this, "pic2")}
                  beforeUpload={this.beforeUpload.bind(this, "pic2")}
                  onError={(err, res) => {
                    message.info(res.msg);
                  }}
                >
                  {this.state.pic2.value ? (
                    <div className={classes.kyc_upload_image}>
                      <img alt="" src={imghost + this.state.pic2.value} />
                      <strong>
                        <Iconfont type="positive" size="48" />
                        <em>
                          {this.props.intl.formatMessage({ id: "点击修改" })}
                        </em>
                      </strong>
                    </div>
                  ) : (
                    <div className={classes.kyc_upload_image}>
                      <strong>
                        <Iconfont type="positive" size="48" />
                        <em>
                          {this.props.intl.formatMessage({ id: "点击上传" })}
                        </em>
                      </strong>
                    </div>
                  )}
                </Upload>
              </div>
              <p>{this.state.pic2.msg}</p>
              <div className={classes.str}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: helper.dataReform(
                      level2 && level2.extDescription
                        ? level2.extDescription.replace(
                            /<script>|<\/script>/gi,
                            ""
                          )
                        : ""
                    ),
                  }}
                />
              </div>
            </div>
            <Button
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.seniorAction}
            >
              {this.props.intl.formatMessage({ id: "提交" })}
            </Button>
          </div>
        ) : kycLevel == 25 ? (
          this.renderQrcode()
        ) : (
          ""
        )}
      </div>
    );
  }
  renderQrcode() {
    const classes = this.props.classes;
    return (
      <div className={classes.vedio}>
        <h2>
          {this.props.intl.formatMessage({
            id: "需要录制视频，请通过手机完成",
          })}
        </h2>
        <p
          dangerouslySetInnerHTML={{
            __html: this.props.intl.formatMessage({
              id: "手机上还未安装APP?<br/>请扫码二维码下载APP",
            }),
          }}
        />
        <img
          src={
            "data:image/png;base64," +
            this.props.index_config.shareConfig.openUrlImgBase64
          }
        />
      </div>
    );
  }
  renderVedio() {
    const classes = this.props.classes;
    const { verifyStatus } = this.props.verify_info;
    if (!verifyStatus && verifyStatus != 0) {
      return "";
    } else if (this.props.needVedioVerify) {
      return this.renderQrcode();
    } else {
      return this.renderSuccess("实名认证成功");
    }
  }
  // 认证成功
  renderSuccess(desc) {
    const classes = this.props.classes;
    const countries = this.props.countries || [];
    let id = "";
    countries.forEach((item) => {
      if (item.countryName == this.props.verify_info.nationality) {
        id = item.id;
      }
    });
    return (
      <div className={classes.senior}>
        <h2>{this.props.intl.formatMessage({ id: desc })}</h2>
        <ul>
          <li>
            <label>
              <FormattedMessage id="国籍" />
            </label>
            {this.props.verify_info.nationality}
          </li>
          {id == "1" ? (
            <li>
              <label>
                <FormattedMessage id="姓名" />
              </label>
              {this.props.verify_info.firstName}
              {this.props.verify_info.secondName}
            </li>
          ) : (
            <li>
              <label>
                <FormattedMessage id="姓氏" />
              </label>
              {this.props.verify_info.firstName}
            </li>
          )}
          {id == "1" ? (
            ""
          ) : (
            <li>
              <label>
                <FormattedMessage id="名字" />
              </label>
              {this.props.verify_info.secondName}
            </li>
          )}
          {id == "1" ? (
            ""
          ) : (
            <li>
              <label>
                <FormattedMessage id="证件类型" />
              </label>
              {this.props.verify_info.cardType}
            </li>
          )}
          <li>
            <label>
              <FormattedMessage id={id == "1" ? "身份证号" : "证件号码"} />
            </label>
            {this.props.verify_info.cardNo}
          </li>
        </ul>
      </div>
    );
  }
  // 二、三级资料审核中
  renderReview() {
    const classes = this.props.classes;
    return (
      <div className={classes.basic_status}>
        <img src={require("../../assets/waiting.png")} />
        <h2>
          {this.props.intl.formatMessage({ id: "资料审核中，请耐心等待" })}
        </h2>
        <div className={classes.btn_group}>
          <Button
            onClick={this.goto.bind(this, route_map.user_center)}
            variant="contained"
            color="primary"
          >
            {this.props.intl.formatMessage({ id: "返回" })}
          </Button>
        </div>
      </div>
    );
  }
  // 认证失败
  renderFail() {
    const classes = this.props.classes;
    const { displayLevel, kycLevel, verifyStatus } = this.props.verify_info;
    const desc = "审核失败";
    if (displayLevel == "2" && verifyStatus == 3) {
      return (
        <div className={classes.basic_status}>
          <img src={require("../../assets/fail.png")} />
          <h2>{this.props.intl.formatMessage({ id: desc })}</h2>
          <p>
            {this.props.verify_info.refusedReason
              ? this.props.verify_info.refusedReason
              : ""}
          </p>
          <div className={classes.btn_group}>
            <Button
              onClick={this.changeVerifyInfo.bind(this, {
                displayLevel: "1",
                verifyStatus: 2,
                showLevel: "2",
              })}
              variant="contained"
              color="primary"
            >
              {this.props.intl.formatMessage({ id: "重新认证" })}
            </Button>
          </div>
        </div>
      );
    }
    return (
      // 二、三级人脸提交失败（web端不会出现此状态，备用）
      <div className={classes.basic_status}>
        <img src={require("../../assets/fail.png")} />
        <h2>{this.props.intl.formatMessage({ id: desc })}</h2>
        <p>
          {this.props.verify_info.refusedReason
            ? this.props.verify_info.refusedReason
            : ""}
        </p>
      </div>
    );
  }
  render() {
    const classes = this.props.classes;
    const kyc_type =
      window.WEB_CONFIG && window.WEB_CONFIG.page && window.WEB_CONFIG.page.kyc
        ? window.WEB_CONFIG.page.kyc
        : "bhop";
    let options = [];
    this.props.countries.forEach((item) => {
      options.push({
        label: item.nationalCode,
        value: item.nationalCode + "/" + item.countryName,
        search:
          item.countryName +
          item.nationalCode +
          item.shortName +
          item.indexName,
        id: item.id,
      });
    });
    const { displayLevel, verifyStatus } = this.props.verify_info;
    return (
      <div className={classes.center}>
        <Grid container>
          <Grid item xs={3}>
            <GoBackRC />
          </Grid>
          <Grid item xs={6}>
            {this.renderTitle()}
            {/* {this.renderTip()} */}
            <div className={classes.password_tip}>
              {this.props.intl.formatMessage({
                id: "用户提现，法币交易及API设置验证",
              })}
            </div>
            {displayLevel &&
            (displayLevel == "0" || (displayLevel == "1" && verifyStatus == 0))
              ? this.renderBasic()
              : ""}
            {displayLevel &&
            ((displayLevel == "1" && verifyStatus == 2) ||
              (displayLevel == "2" && verifyStatus == 0))
              ? this.renderSenior()
              : ""}
            {displayLevel &&
            ((displayLevel == "2" && verifyStatus == 2) ||
              (displayLevel == "3" && verifyStatus == 0))
              ? this.renderVedio()
              : ""}
            {displayLevel && displayLevel == "3" && verifyStatus == 2
              ? this.renderSuccess("实名认证成功")
              : ""}
            {displayLevel &&
            ["1", "2", "3"].indexOf(displayLevel) > -1 &&
            verifyStatus == 1
              ? this.renderReview()
              : ""}
            {displayLevel &&
            ["1", "2", "3"].indexOf(displayLevel) > -1 &&
            verifyStatus == 3
              ? this.renderFail()
              : ""}
          </Grid>
          <Grid item xs={3} style={{ textAlign: "right" }}>
            {kyc_type == "bhexChina" ? (
              <a
                className={classes.kyc_update}
                href="http://jp.mikecrm.com/QbSXaxe"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage id="申请机构认证" />
              </a>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
        {/* <SecVerify
          userinfo={this.props.userinfo}
          dispatch={this.props.dispatch}
          verifyType={10}
          loading={this.props.loading.effects["user/save_basicverify"]}
          isopen={this.state.isopen}
          callback={this.submitBasic}
          showCloseBtn={true}
          onCancel={this.onCancel}
        /> */}
        <Dialog open={this.state.isopen2}>
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "绑定手机验证" })}
          </DialogTitle>
          <DialogContent style={{ width: 450 }}>
            <Grid container style={{ margin: "0 0 20px" }}>
              <Grid item xs={3}>
                <SelectRC
                  options={options}
                  value={this.state.national_code}
                  onChange={this.SelectChange2}
                  label={this.props.intl.formatMessage({
                    id: "区号",
                  })}
                />
              </Grid>
              <Grid item xs={9}>
                <TextField
                  label={this.props.intl.formatMessage({
                    id: "手机号",
                  })}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入手机号",
                  })}
                  value={this.state.mobile.value}
                  onChange={this.changeStatus.bind(this, "mobile")}
                  error={Boolean(this.state.mobile.msg)}
                  helperText={this.state.mobile.msg}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              InputProps={{
                endAdornment: (
                  <VerfiCodeRC
                    value={this.props.userinfo.email}
                    onClick={this.sendVerfiCode.bind(this, "mobile_order_id")}
                    className={classes.verfCode}
                    ref={(ref) => (this.verfiCode = ref)}
                  />
                ),
              }}
              placeholder={this.props.intl.formatMessage({
                id: "请输入验证码",
              })}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              style={{ margin: "0 0 20px" }}
              helperText={this.state.mobileCode.msg}
              error={Boolean(this.state.mobileCode.msg)}
              onChange={this.changeStatus.bind(this, "mobileCode")}
              value={this.state.mobileCode.value}
              label={this.props.intl.formatMessage({ id: "手机验证码" })}
            />

            <TextField
              label={this.props.intl.formatMessage({ id: "邮箱" })}
              value={this.props.userinfo.email}
              disabled
              fullWidth
              style={{ margin: "0 0 20px" }}
            />

            <TextField
              InputProps={{
                endAdornment: (
                  <VerfiCodeRC
                    value={this.props.userinfo.email}
                    onClick={this.sendVerfiCode.bind(this, "")}
                    className={classes.verfCode}
                    ref={(ref) => (this.verfiCode2 = ref)}
                  />
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              style={{ margin: "0 0 20px" }}
              placeholder={this.props.intl.formatMessage({
                id: "请输入验证码",
              })}
              helperText={this.state.emailCode.msg}
              error={Boolean(this.state.emailCode.msg)}
              value={this.state.emailCode.value}
              onChange={this.changeStatus.bind(this, "emailCode")}
              label={this.props.intl.formatMessage({ id: "邮箱验证码" })}
            />
          </DialogContent>
          <DialogActions>
            <div className={classes.btns}>
              <Button color="primary" onClick={this.cancel}>
                {this.props.intl.formatMessage({
                  id: "取消",
                })}
              </Button>
              {this.props.loading.effects["user/bind_mobile"] ? (
                <Button color="primary" className={classes.btn} disabled>
                  <CircularProgress />
                </Button>
              ) : (
                <Button color="primary" onClick={this.bindMobile}>
                  {this.props.intl.formatMessage({
                    id: "确定",
                  })}
                </Button>
              )}
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(KYC));
