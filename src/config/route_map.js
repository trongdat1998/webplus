const local = ""; // :lang or '' 多语言是否配置在路径中
const m = "/m";

export default {
  a: `${local}/a`,
  b: `${local}/b`,

  // 未登录，允许访问的地址
  noLogin: [
    "index",
    "register",
    "login",
    "exchange",
    "forgetpwd",
    "cardAgreement",
    "noaccess",
    "guild_home",
    "guild_blocks",
    "guild_shared",
    "willopen",
    "download",
    "download2",
    "waitGuild",
    "invite_register_step1",
    "coinplus",
    "coinplusOrder",
    "coinplusRedeem",
    "future",
    "future_tbtc",
    "coinplus_protocols",
    "ieo",
    "ieo_item",
    "ieo_item_old",
    "topics_trade_activity",
    "topics_mining",
    "topics_vote",
    "grade",
    "HBC_introduce",
    "topics_vote",
    "future_history_data_index",
    "future_history_data_rate",
    "future_history_data_funding",
    "future_history_data_info",
    "future_history_data_qa",
    "future_history_data",
    "margin", // 杠杆
    "currency_list",
    "convert", // 闪兑页面
    "staking",
    "staking_periodical",
    "defi",
  ],
  // download
  download2: `${local}/download.html`,
  // 点卡协议
  cardAgreement: `${local}/other/cardAgreement`,
  // 敬请期待
  willopen: `${local}/other/willOpen`,
  // 等待公会
  waitGuild: `${local}/other/waitGuild`,
  // 无权限
  noaccess: `${local}/other/noaccess`,
  // hbc介绍
  HBC_introduce: `${local}/other/hbc_introduce`,
  // 首页
  index: `${local}/`,
  // 首页 H5
  m_index: `${m}/`,
  // otc
  otc: `${local}/otc`,
  // 注册
  register: `${local}/register`,
  // 注册引导页
  register_guide: `${local}/reg_guide`,
  // 邀请注册第一步
  invite_register_step1: `${local}/invite/register/step1`,
  // 登录
  login: `${local}/login`,
  // 忘记密码
  forgetpwd: `${local}/user/forgetpassword`,
  // 修改密码
  resetpwd: `${local}/user/resetpassword`,
  // 设置密码
  setpwd: `${local}/user/setpassword`,
  // 账户管理
  user_account: `${local}/user/account`,
  // 用户中心
  user_center: `${local}/user`,
  // 用户绑定设置
  user_bind: `${local}/user/bind`,
  user_change_bind: `${local}/user/change_bind`,
  user_kyc_old: `${local}/user/kyc_old`,
  user_kyc: `${local}/user/kyc`,
  user_api: `${local}/user/service_api`,
  // 资金密码
  fund_password: `${local}/user/fundpassword`,
  // 个性化配置
  custom_config: `${local}/user/custom_config`,
  // 等级管理
  grade: `${local}/user/grade`,
  // 订单
  order: `${local}/order`,
  // 订单H5
  m_order: `${m}/order/coin`,
  // 行情
  exchange: `${local}/exchange`,
  // defi
  defi: `${local}/defi`,
  // 行情h5
  m_exchange: `${m}/trade`,
  // 资产列表页
  finance_list: `${local}/finance/`,
  // 资产H5
  m_finance_list: `${m}/finance`,
  // 资产追溯
  trace_back: `/finance/trace_back`,
  // 子账户
  finance_child_account: `${local}/finance/child`,
  // 资产记录
  finance_record: `${local}/finance/record`,
  // 充币
  rechange: `${local}/finance/deposit`,
  // 充币H5
  m_rechange: `${m}/finance/deposit`,
  // 提币, 资金密码根据cash进行判断，cash的路径，请保持唯一
  cash: `${local}/finance/cash`,
  // 提币结果页
  cash_status: `${local}/finance/cashstatus`,
  // 风险资产
  cash_risk: `${local}/finance/cashrisk`,
  address: `${local}/finance/address`,
  // 活动账户
  finance_activity_account: `${local}/finance/activtiy`,
  // 减持记录
  underweight_list: `${local}/finance/underweight/list`,
  // flash trade
  flash_trade: `${local}/finance/flash_trade`,
  // 邀请活动
  invite: `${local}/user/invite`,

  // 理财
  coinplus: `${local}/bonus/`,
  // 理财下单
  coinplusOrder: `${local}/bonus/order`,
  // 理财赎回
  coinplusRedeem: `${local}/bonus/redeem`,
  // 理财结果
  coinplusResult: `${local}/bonus/result`,
  // 理财资产
  coinplus_finance: `${local}/bonus/finance`,
  // 理财协议
  coinplus_protocols: `${local}/protocols/bonus`,
  protocols: `${local}/protocols`,

  // 新理财
  staking: `${local}/staking/`,
  // 定期理财
  staking_periodical: `${local}/staking/periodical`,
  // 理财资产
  staking_finance: `${local}/staking/finance`,
  // 理财结果
  staking_result: `${local}/staking/result`,
  // 理财订单
  staking_order: `${local}/staking/order`,

  // 永续合约行情页
  future: `${local}/contract/quote`,
  future_tbtc: `${local}/contract/tbtc`,
  // 永续合约资产
  future_finance: `${local}/contract/finance`,
  // 永续合约持仓订单
  future_position: `${local}/contract/order/position`,
  // 永续合约当前委托
  future_current_entrust: `${local}/contract/order/current_entrust`,
  // 永续合约历史委托
  future_history_entrust: `${local}/contract/order/history_entrust`,
  // 永续合约历史成交
  future_history_order: `${local}/contract/order/history_order`,
  // 永续合约交割记录
  future_delivery: `${local}/contract/order/delivery`,
  // 永续合约保险基金
  future_insurance_fund: `${local}/contract/order/insurance_fund`,
  // 永续合约新手引导
  future_guest: `${local}/contract/guest`,
  // 合约历史数据
  future_history_data: `${local}/contract/history_data/`,
  // 合约历史数据 指数
  future_history_data_index: `${local}/contract/history_data/index`,
  // 合约历史数据 资金费率
  future_history_data_rate: `${local}/contract/history_data/rates`,
  // 合约历史数据 保险基金
  future_history_data_funding: `${local}/contract/history_data/funding`,
  // 合约历史数据 合约介绍
  future_history_data_info: `${local}/contract/history_data/introduction`,
  // 合约历史数据 常见问题
  future_history_data_qa: `${local}/contract/history_data/qa`,

  // ieo 首页
  ieo_item_old: `${local}/ieo/item`,
  ieo: `${local}/xo`,
  ieo_item: `${local}/xo/item`,
  ieo_order: `${local}/xo/order`,

  // 交易大赛
  topics_trade_activity: `${local}/topics/trade_activity`,
  // 投票
  topics_vote: `${local}/topics/vote`,
  // 第三方支付
  payment: `${local}/payment`,

  // 经纪人
  broker: `${local}/broker`,
  broker_list: `${local}/broker/list`,
  broker_ommission: `${local}/broker/commission`,

  // 杠杆交易
  margin: `${local}/cross-margin`,
  margin_finance: `${local}/margin/finance`,
  // 杠杆订单
  margin_order: `${local}/margin/order`,

  // 币种资料列表
  currency_list: `${local}/coininfo`,

  // 闪兑
  convert: `${local}/convert`,

  convert_history: `${local}/convert/history`,
};
