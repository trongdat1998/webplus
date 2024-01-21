const prefix = "/api";
const prefix2 = "/s_api";

let hostname = window.location.hostname;
let protocol = window.location.protocol === "http:" ? "ws:" : "wss:";
// 行情ws地址
const qws = "/ws/quote/v1";
// 订单ws地址
const ws = "/api/ws/user";

// local
if (/^local/.test(hostname)) {
  protocol = "wss:";
  hostname = "www.nucleex.com";
}

let qwsURL = /^local/.test(window.location.hostname)
  ? window.location.origin.replace("http", "ws") + qws
  : `${protocol}//${
      hostname.indexOf("www") > -1
        ? hostname.replace("www", "ws")
        : "ws." + hostname
    }${qws}`;

let wsURL = /^local/.test(window.location.hostname)
  ? window.location.origin.replace("http", "ws") + ws
  : `${protocol}//${
      hostname.indexOf("www") > -1
        ? hostname.replace("www", "ws")
        : "ws." + hostname
    }${ws}`;

if (
  window.location.hostname.indexOf("nucleex.com") > -1 ||
  window.location.hostname.indexOf("bhpc.us") > -1
) {
  qwsURL = `${protocol}//${hostname}${qws}`;
  wsURL = `${protocol}//${hostname}${ws}`;
}

export default {
  qws: qwsURL,
  ws: wsURL,
  // 国家区号前缀
  countries: `${prefix2}/basic/countries`,
  // 邮箱注册
  register: `${prefix}/user/email_sign_up`,
  // 手机注册
  register_mobile: `${prefix}/user/mobile_sign_up`,
  // 快捷注册
  quick_sign_up: `${prefix}/user/quick_sign_up`,
  // 快捷登录
  quick_authorize: `${prefix}/user/quick_authorize`,
  // 快捷登录二次验证
  quick_authorize_advance: `${prefix}/user/quick_authorize_advance`,
  // 邮箱登录step1
  login: `${prefix}/user/email_authorize`,
  // 手机登录step1
  login_mobile: `${prefix}/user/mobile_authorize`,
  // 手机或邮箱登录，step1
  login_all: `${prefix}/user/authorize`,
  // 登录step2
  login_step2: `${prefix}/user/authorize_advance`,
  // 登出
  logout: `${prefix}/user/authorize_cancel`,
  // 未登录状态 邮箱验证码
  send_email_verify_code: `${prefix}/common/send_email_verify_code`,
  // 登录时，二次验证邮箱验证码
  send_email_verify_code_authorize_advance: `${prefix}/user/send_email_verify_code/authorize_advance`,
  // 登录时，二次验证手机验证码
  send_sms_verify_code_authorize_advance: `${prefix}/user/send_sms_verify_code/authorize_advance`,
  // 已登录状态 邮箱验证码
  send_email2_verify_code: `${prefix}/user/send_email_verify_code`,
  // 未登录状态 手机验证码
  send_sms_verify_code: `${prefix}/common/send_sms_verify_code`,
  // 已登录状态 手机验证码
  send_sms2_verify_code: `${prefix}/user/send_sms_verify_code`,
  // 设置密码的验证码
  send_verify_code_set_password: `${prefix}/user/send_verify_code/set_password`,
  send_verify_code: `${prefix}/user/send_verify_code`,
  send_common_verify_code: `${prefix}/common/send_verify_code`,
  // 设置密码
  set_password: `${prefix}/user/set_password`,

  // 手机找回密码
  // mobile_find_password: `${prefix}/user/mobile_find_pwd_check`,
  // 邮箱找回密码
  // email_find_password: `${prefix}/user/email_find_pwd_check`,
  // 手机找回密码新接口
  mobile_find_password: `${prefix}/user/mobile_find_pwd_check1`,
  // 邮箱找回密码新接口
  email_find_password: `${prefix}/user/email_find_pwd_check1`,
  // 重置密码
  reset_password: `${prefix}/user/find_pwd`,
  // 修改密码
  update_pwd: `${prefix}/user/update_pwd`,
  // 找回密码二次验证（邮箱或手机）
  find_pwd: `${prefix}/user/send_verify_code/find_pwd`,
  // 找回密码step2-2FA验证
  find_pwd_check2: `${prefix}/user/find_pwd_check2`,

  // userinfo
  userinfo: `${prefix}/user/get_base_info`,
  // account
  get_total_asset: `${prefix}/asset/info`, // 获取总资产
  asset_transfer: `${prefix}/account/sub_account/transfer`, // 资产划转
  get_account: `${prefix}/account/get`, // 账户资产
  transfer_available: `${prefix}/account/sub_account/transfer/available`, // 可划转资产余额查询
  create_account: `${prefix}/account/sub_account/create`, // 创建子账户
  account_type: `${prefix}/basic/sub_account/support_account_type_v1`, // 子账户类型
  account_list: `${prefix}/account/sub_account/query`, // 账户列表,
  account_limit: `${prefix}/v1/account/sub_account/transfer/limit`, // 禁止划转设置
  // 获取ga数据,key
  ga_info: `${prefix}/user/before_bind_ga`,
  // 绑定ga
  bind_ga: `${prefix}/user/bind_ga`,
  new_ga_info: `${prefix}/user/before_alter_ga`,
  change_bind_ga: `${prefix}/user/alter_ga`,

  // bind mobile
  bind_mobile: `${prefix}/user/bind_mobile`,
  change_bind_mobile: `${prefix}/user/alter_mobile`,
  // bind email
  bind_email: `${prefix}/user/bind_email`,
  unbind_email: `${prefix}/user/unbind_email`,
  change_bind_email: `${prefix}/user/alter_email`,
  // 登录日志
  authorize_log: `${prefix}/user/authorize_log`,
  // 选择自选
  favorite_create: `${prefix}/user/favorite/create`,
  // 取消自选
  favorite_cancel: `${prefix}/user/favorite/cancel`,
  // 实名认证
  kyc: `${prefix}/user/verify`,
  // 实名信息
  verify_info: `${prefix}/user/verify_info`,
  // 获取用户KYC级别信息
  get_user_kycinfo: `${prefix}/user/kyclevel`,
  // 用户kyc基础认证
  kyc_basic_verify: `${prefix}/user/kyc/basicverify`,
  // 用户证件照KYC认证
  kyc_photo_verify: `${prefix}/user/kyc/photoverify`,
  // api
  api_list: `${prefix}/user/api_keys`,
  api_create: `${prefix}/user/api_key/create`,
  api_update: `${prefix}/user/api_key/update_ips`,
  api_del: `${prefix}/user/api_key/delete`,
  api_status: `${prefix}/user/api_key/change_status`, // 启用，禁用
  // 用户等级
  user_level_info: `${prefix}/user/get_userlevel_info`,
  // 等级配置信息
  user_level_configs: `${prefix}/user/get_userlevel_configs`,
  // 文案配置接口
  language_list: `${prefix}/common/language/list`,
  // 邀请信息
  invite_info: `${prefix}/invitation/info/get`,
  // 邀请分享信息
  invite_share_info: `${prefix}/invitation/share/template_info`,
  // 返佣记录
  bonus_list: `${prefix}/invitation/bonus/list`,
  bonus_info_list: `${prefix}/invitation/relation/list`,
  // 资金密码
  fund_password: `${prefix}/user/trade_pwd/set`,
  // 设置防钓鱼码
  fish_code: `${prefix}/user/edit_anti_phishing_code`,
  // 设置用户自定义配置
  set_custom_config: `${prefix}/user/set_settings`,
  get_custom_config: `${prefix}/user/get_settings`,

  // 下单
  createOrder: `${prefix}/order/create`, // 下单
  cancelOrder: `${prefix}/order/cancel`, // 撤单
  open_orders: `${prefix}/order/open_orders`, // 当前委托
  history_orders: `${prefix}/order/trade_orders`, // 历史委托，拉取历史数据
  history_trades: `${prefix}/order/my_trades`, // 历史成交 拉取历史数据
  match_info: `${prefix}/order/match_info`, // 成交明细
  get_ws_token: `${prefix}-/user/get_ws_token`, // 获取websocket握手token ,// 订单ws连接前，握手接口
  sell_config: `${prefix}/order/sell_buy/config`, // 卖出配置
  create_plan_order: `${prefix}/order/plan_spot/create`, // 创建计划委托
  cancel_plan_order: `${prefix}/order/plan_spot/cancel`, // 取消计划委托
  cancel_all_plan_order: `${prefix}/order/plan_spot/batch_cancel`, // 批量取消计划委托
  open_plan_orders: `${prefix}/order/plan_spot/open_orders`, // 获取当前计划委托
  history_plan_orders: `${prefix}/order/plan_spot/trade_orders`, // 获取历史计划委托
  get_plan_order_detail: `${prefix}/order/plan_spot/get`,

  // 基础接口
  config: `${prefix2}/basic/config_v2`, // 币，币对，币选项
  rate: `${prefix2}/basic/rates`, // 汇率
  rate2: `${prefix}/quote/v1/rates`, // 汇率2
  get_all_coins: `${prefix2}/basic/tokens`, // 获取所有币种
  symbols: `${prefix2}/basic/symbols`, // 所有币对列表
  id_card_type: `${prefix2}/basic/id_card_type`, // 证件类型
  upload_image: `${prefix}/user/verify/upload_image`, // 图片上传
  quote_tokens: `${prefix2}/basic/quote_tokens`, // 首页，行情页 币栏目
  analyze: `${prefix2}/analyze`, // 上报数据接口
  index_config: `${prefix2}/basic/index_config`, // 首页配置信息
  function_list: `${prefix}/common/function/config/list`, // 是否包含入口
  qrcode: `${prefix2}/basic/qrcode`,
  coin_tokens: `${prefix}/basic/coin_tokens`, // 永续合约，杠杆支持的币列表
  multi_kline: `${prefix}/quote/v1/multi/kline`, // 多币对k线
  token_info: `${prefix2}/basic/token`, // token信息
  custom_kv: `${prefix2}/basic/custom_kv`, // 获取配置信息（区分语言）

  // 充币，提币
  balance_deposit: `${prefix}/asset/deposit/address`, // 充币
  get_asset: `${prefix}/asset/get`, // 币余额查询
  proff: `${prefix}/asset/proof`, // 资产追溯
  quota_info: `${prefix}/asset/withdrawal/quota_info`, // 提币，获取余额，手续费
  deposit_order_list: `${prefix}/asset/deposit/order_list`, // 充币记录
  withdrawal_order_list: `${prefix}/asset/withdrawal/order_list`, // 提币历史记录
  // 取消提币
  withdrawal_order_cancel: `${prefix}/asset/withdrawal/order/cancel`,
  withdrawal_order: `${prefix}/asset/withdrawal/order`, // 单条提币记录
  other_order_list: `${prefix}/asset/balance_flow`, // 其他资产 历史记录
  get_token_address: `${prefix}/asset/deposit/address`, // 充币获取地址
  get_withraw_address: `${prefix}/asset/withdrawal/address_list`, // 获取提币地址
  add_withraw_address: `${prefix}/asset/withdrawal/address/add`, // 添加地址
  del_withraw_address: `${prefix}/asset/withdrawal/address/delete`, // 删除地址
  withdraw_address_check: `${prefix}/asset/withdrawal/address/check`, // 提币地址黑名单判断
  withdraw: `${prefix}/asset/withdrawal/create`, // 提币 step1
  withdrawal_verify_code: `${prefix}/asset/withdrawal/verify_code`, // 提币 brefore step2 重新发送验证码
  withdraw_verify: `${prefix}/asset/withdrawal/verify`, // 提币 step2 验证
  order_cancel_all: `${prefix}/order/batch_cancel`, // 全部撤单

  kline_history: `${prefix}/quote/v1/klines`, // k线http
  kline_option_history: `${prefix}/quote/v1/history/klines`, // 历史k线接口
  index_kline: `${prefix}/quote/v1/index/klines`, // 指数k线
  indices: `${prefix}/quote/v1/indices`, // 期权指数
  index_formula: `${prefix}/quote/v1/index/config`, // 指数计算公式
  depth: `${prefix}/quote/v1/depth`, // 深度图
  serverTime: `${prefix}/quote/v1/time`, // 服务器时间
  trade: `${prefix}/quote/v1/trades`, // 最新成交
  quote: `${prefix}/quote/v1/broker/tickers`, // 币对24小时行情http

  // 币多多
  get_coinplus_finance: `${prefix}/financing/assets/list`, // 获取币多多资产
  coinplus_order_list: `${prefix}/financing/record/list`, // 币多多资产记录
  get_coinplus_index_product_list: `${prefix}/financing/product/list`, // 获取频道首页的产品列表
  get_coinplus_detail: `${prefix}/financing/product/get`, //产品详情
  coinplus_purchase: `${prefix}/financing/purchase`, //购买下单
  coinplus_redeem: `${prefix}/financing/redeem`, //赎回下单
  get_coinplus_result: `${prefix}/financing/record/simple/get`, //订单状态/结果页
  get_coinplus_asset: `${prefix}/financing/assets/get`, //币多多资产
  get_coinplus_list: `${prefix}/financing/product/home/list`,

  // 理财
  get_staking_product_list: `${prefix}/v1/staking/product/list`, // 获取理财产品列表（定期、定期锁仓）
  get_staking_assets_list: `${prefix}/v1/staking/product/assets/list`, // 定期资产列表
  get_periodic_detail: `${prefix}/v1/staking/product/get`, // 获取定期产品详情
  staking_subscribe: `${prefix}/v1/staking/product/subscribe`, // 申购理财产品
  repayment_schedule: `${prefix}/v1/staking/product/repayment_schedule`, // 还款计划
  subscribe_result: `${prefix}/v1/staking/product/subscribe/result`, // 申购结果
  staking_order_list: `${prefix}/v1/staking/product/fixed_order/list`, // 获取理财订单
  staking_record: `${prefix}/v1/staking/product/jour/list`, // 定期资产明细

  // 永续合约
  future_record: `${prefix}/contract/asset/balance_flow`, // 永续合约资产记录
  get_futures_asset: `${prefix}/contract/asset/available`, // 永续合约资产列表
  get_target_list: `${prefix}/contract/underlying/list`, // 永续合约标的列表
  futures_delivery_order: `${prefix}/contract/order/delivery_record`, // 交割记录
  futures_fund_order: `${prefix}/contract/asset/insurance_fund`, // 保险基金
  futures_option_list: `${prefix}/contract/order/position`, // 当前持仓
  futures_current_entrust: `${prefix}/contract/order/open_orders`, // 未完成委托
  futures_history_entrust: `${prefix}/contract/order/trade_orders`, // 历史委托
  futures_history_order: `${prefix}/contract/order/my_trades`, // 历史成交
  futures_order_cancel: `${prefix}/contract/order/cancel`, // 撤单
  futures_order_create: `${prefix}/contract/order/create`, // 下单
  futures_match_info: `${prefix}/contract/order/match_info`, // 成交明细
  futures_order_get: `${prefix}/contract/order/get`, // 订单查询
  futures_order_setting: `${prefix}/contract/order/get_order_setting`, // 读取 永续合约下单配置项，费率，风险限额，杠杠
  set_order_setting: `${prefix}/contract/order/set_order_setting`, // 设置永续合约下单选项
  set_risk_limit: `${prefix}/contract/order/set_risk_limit`, // 设置风险限额
  futures_tradeable: `${prefix}/contract/asset/tradeable`, // 可交易信息，资产余额，可平
  modify_margin: `${prefix}/contract/asset/modify_margin`, // 增加/减少保证金
  funding_rates: `${prefix}/contract/funding_rates`, // 资金费率
  open_future: `${prefix}/user/open/futures`, // 打开合约
  stop_profit_loss_get: `${prefix}/contract/order/position/stop_profit_loss/get`, // 查询止盈止损
  stop_profit_loss_cancel: `${prefix}/contract/order/position/stop_profit_loss/cancel`, // 取消止盈止损
  stop_profit_loss_set: `${prefix}/contract/order/position/stop_profit_loss/set`, // 设置止盈止损
  calculator_profit_info: `${prefix}/contract/calculator/profit_info`, // 合约计算器 收益率
  calculator_liquidation_price: `${prefix}/contract/calculator/liquidation_price`, // // 合约计算器 强平价
  stop_profit_loss_open_orders: `${prefix}/contract/order/stop_profit_loss/open_orders`, // 当前委托 止盈止损 单
  stop_profit_loss_trade_orders: `${prefix}/contract/order/stop_profit_loss/trade_orders`, // 历史委托 止盈止损 单
  history_funding_rates: `${prefix}/contract/history_funding_rates`, // 合约历史 资金费率
  insurance_funding_balance: `${prefix}/contract/insurance_funding_balance`, // 合约历史 保险基金
  flash_close_position: `${prefix}/contract/order/close_promptly`, // 闪电平仓

  // ieo
  ieo_basic_info: `${prefix}/v1/activity/lock/interest/ieo/basic_info`, // 项目详情
  ieo_order: `${prefix}/v1/activity/lock/interest/new_order`, // 下单
  ieo_order_list: `${prefix}/v1/activity/lock/interest/order_list`, // 锁仓下单记录
  ieo_orders: `${prefix}/v1/activity/lock/interest/query_order`, // ieo订单列表
  ioe_project_list: `${prefix}/v1/activity/lock/interest/list`, // 活动列表

  // 支付
  get_payment_data: `${prefix}/payment/order/load_pay_data`, // 获取支付信息
  send_payment_verify_code: `${prefix}/payment/order/send_payment_verify_code`, //获取支付验证码
  payment_order: `${prefix}/payment/order/pay`, // 支付
  payment_order_v2: `${prefix}/payment/order/quick_pay`, // 支付

  // 经纪人
  agent_info: `${prefix}/v1/agent/info`, // 经纪人信息
  query_user_list: `${prefix}/v1/agent/query_user`, // 获取直属用户列表
  user_upgrade: `${prefix}/v1/agent/user_upgrade`, // 用户升级经纪人
  query_broker_list: `${prefix}/v1/agent/query_broker`, // 获取直属经纪人列表
  update_broker: `${prefix}/v1/agent/update_broker`, // 修改经纪人信息
  query_commission_list: `${prefix}/v1/agent/query_commission`, // 分佣列表

  // otc
  last_price: `${prefix}/v1/basic/otc_last_price`, // otc参考价

  // 杠杆
  open_lever: `${prefix}/user/open/margin`, // 开通杠杆
  get_risk_config: `${prefix}/v1/margin/get/risk_config`, // 风控配置列表
  get_safety: `${prefix}/v1/margin/get/safety`, // 安全度
  get_lever_total_asset: `${prefix}/v1/margin/get/all_position`, // 杠杆总资产
  get_lever_asset: `${prefix}/v1/margin/asset/get`, // 杠杆账户资产信息
  get_margin_tokens: `${prefix}/v1/margin/get/token_config`, // 获取保证金币种
  get_interest_config: `${prefix}/v1/margin/get/interest_config`,
  get_user_interest: `${prefix}/v1/margin/get/user/interest`, // 获取用户的等级利率
  get_funding_cross: `${prefix}/v1/margin/get/funding_cross`, // 查询已借可借
  loan: `${prefix}/v1/margin/loan`, // 借款
  cross_loan_position: `${prefix}/v1/margin/get/cross_loan_position`, // 查询持仓借币情况
  repay: `${prefix}/v1/margin/repay`, // 还币
  repayAll: `${prefix}/v1/margin/repay/all`, // 还全部的币
  lever_open_orders: `${prefix}/v1/margin/order/open_orders`, // 杠杆当前订单
  lever_open_plan_orders: `${prefix}/v1/order/plan_spot/open_orders`, // 杠杆计划委托订单
  lever_history_orders: `${prefix}/v1/margin/order/trade_orders`, // 杠杆历史订单
  lever_history_plan_orders: `${prefix}/v1/order/plan_spot/trade_orders`, // 杠杆历史计划委托订单
  force_close_orders: `${prefix}/v1/margin/order/trade_orders`, // 杠杆历史订单
  lever_history_trades: `${prefix}/v1/margin/order/my_trades`, // 杠杆历史成交
  get_loan_orders: `${prefix}/v1/margin/get/cross_loan_order`, // 借币记录
  get_repay_records: `${prefix}/v1/margin/get/repay_record`, // 还币记录
  get_avail_withdraw: `${prefix}/v1/margin/get/avail_withdraw`, // 可出金金额
  lever_record: `${prefix}/v1/margin/asset/balance_flow`, // 杠杆资产记录
  lever_order_create: `${prefix}/v1/margin/order/create`, // 下单
  lever_order_cancel: `${prefix}/v1/margin/order/cancel`, // 撤单
  lever_order_batch_cancel: `${prefix}/v1/margin/order/batch_cancel`, // 批量撤单
  margin_match_info: `${prefix}/v1/margin/order/match_info`,
  margin_level_interest: `${prefix}/v1/margin/get/interest_level_table`, // 获取杠杆利率

  // 闪兑
  get_convert_symbols: `${prefix}/v1/convert/symbols`,
  get_symbol_price: `${prefix}/v1/convert/price`,
  create_convert_order: `${prefix}/v1/convert/order/create`,
  query_convert_order: `${prefix}/v1/convert/order/query`,

  // 注册极验
  regist_geetest: `${prefix}/v1/basic/geev3/register`,
};
