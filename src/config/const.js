export default {
  CNY: "￥",
  UST: "$",
  // 行情页model/ws数据更新频率
  refresh_ws: 1000,
  // 当前币对 刷新频率 ms，
  refresh: 200,
  // 深度刷新频率
  refresh_depth: 1000,
  // 行情页token列表刷新频率
  refresh_tokens: 500,
  // 盘口刷新频率
  refresh_handicap: 500,
  // 最新成交刷新频率
  refresh_trade: 300,
  // 深度精度值，"0"跟K线价格精度0区别
  depth: {
    100000000: -8,
    10000000: -7,
    1000000: -6,
    100000: -5,
    10000: -4,
    1000: -3,
    100: -2,
    10: -1,
    1: 0,
    0: 0,
    0.1: 1,
    0.01: 2,
    0.001: 3,
    0.0001: 4,
    0.00001: 5,
    0.000001: 6,
    "0.0000001": 7,
    "0.00000001": 8,
    "0.000000001": 9,
    "0.0000000001": 10,
    "0.00000000001": 11,
    "0.000000000001": 12,
    "0.000000000000000001": 18,
  },
  // k线价格精度
  k: {
    0: 1,
    1: 10,
    2: 100,
    3: 1000,
    4: 10000,
    5: 100000,
    6: 1000000,
    7: 10000000,
    8: 100000000,
    9: 1000000000,
    10: 10000000000,
    11: 100000000000,
    12: 1000000000000,
  },
  // 最新成交展示条数
  trade_limit: 60,
  // 工会列表每页条数
  rowsPerPage: 10,
  rowsPerPage1: 20,
  rowsPerPage2: 50,
  rowsPerPageOptions: [5, 10, 20],
  // img host
  imghost: "https://static.nucleex.com",

  // 状态
  optionStatus: {
    SETTLE_NO: 0,
    SETTLE_DOING: 1,
    SETTLE_DONE: 2,
  },
  // 永续合约杠杆小数位
  lever_decimal: 2,
  fee: 0.005,
  // 保证金率保留8位小数
  initialMargin: 8,
  // 永续合约买卖方向
  sideMap: {
    BUY_OPEN: "买入开多",
    SELL_OPEN: "卖出开空",
    BUY_CLOSE: "买入平空",
    SELL_CLOSE: "卖出平多",
  },
  kline_type: [
    "1",
    "5",
    "15",
    "30",
    "60",
    "120",
    "240",
    "360",
    "720",
    "1440",
    "10080",
    "44640",
  ],
  kline_btns: [
    {
      slug: "Time", // 窄屏展示
      resolution: "1", // 传给K线的参数
      chartType: 3, // 图表类型
      res: "Time", // 区分分时与1m
      full: "Time", // 宽屏展示
    },
    {
      slug: "1m",
      resolution: "1",
      res: "1",
      option: [
        {
          resolution: "1",
          slug: "1m",
          full: "1min",
          res: "1",
        },
        {
          resolution: "5",
          slug: "5m",
          full: "5min",
          res: "5",
        },
        {
          resolution: "15",
          slug: "15m",
          full: "15min",
          res: "15",
        },
        {
          resolution: "30",
          slug: "30m",
          full: "30min",
          res: "30",
        },
      ],
    },
    {
      slug: "1H",
      resolution: "60",
      res: "60",
      option: [
        {
          resolution: "60",
          slug: "1H",
          full: "1hour",
          res: "60",
        },
        {
          resolution: "120",
          slug: "2H",
          full: "2hour",
          res: "120",
        },
        {
          resolution: "240",
          slug: "4H",
          full: "4hour",
          res: "240",
        },
        {
          resolution: "360",
          slug: "6H",
          full: "6hour",
          res: "360",
        },
        {
          resolution: "720",
          slug: "12H",
          full: "12hour",
          res: "720",
        },
      ],
    },
    {
      slug: "1D",
      resolution: "1440",
      res: "1440",
      full: "1day",
    },
    {
      slug: "1W",
      resolution: "10080",
      res: "10080",
      full: "1week",
    },
    {
      slug: "1M",
      resolution: "44640",
      res: "44640",
      full: "1mon",
    },
  ],
  REGIST_TYPE: {
    MOBILE: 1,
    EMAIL: 2,
  },
  REGISTER_OPTIONS: {
    ALL: 1,
    ONLY_PHONE: 2,
    ONLY_EMAIL: 3,
    EMAIL_AND_CHINA_PHONE: 4,
  },

  time_in_force: "GTC",

  REPAY_WAY: {
    PRINCIPAL: 1, // 还本金
    ALL: 2, // 还币还息
  },

  // 个性化配置默认值
  customConfig: {
    // 闪电平仓
    quickCloseConfirm: true,
    // 默认语言
    lang: window.localStorage.lang,
    // 默认法币
    unit: window.localStorage.unit,
    // 行情颜色方案,  0 = 绿涨红跌; 1 = 红涨绿跌
    up_down: 0,
  },

  ORDER_TYPE: {
    LIMIT: "limit",
    MARKET: "market",
    PLAN: "plan",
  },

  ENTRUST_TYPE: {
    NORMAL: "normal", // 普通委托
    PLAN: "plan", // 计划委托
  },

  RECEIVER_TYPE: {
    MOBILE: 1,
    EMAIL: 2,
  },

  CONVERT: {
    PRICE_TYPE: {
      STATIC: 1, // 固定价格
      FLOAT: 2, // 浮动价格
    },
  },

  // 验证码方式
  CODE_TYPE: {
    BIND_MOBILE: 5,
    BIND_EMAIL: 6,
    BIND_GA: 7,
    UNBIND_EMAIL: 17,
    UNBIND_MOBILE: 18,
    UNBIND_GA: 19,
    QUICK_LOGIN: 22,
    CHANGE_BIND_EMAIL: 25,
    CHANGE_BIND_MOBILE: 26,
    CHANGE_BIND_GA: 27,
  },

  ACCOUNT_TYPE: {
    COIN: 0,
    MARGIN: 27,
  },

  CAPTCHA_TYPES: {
    GOOGLE: 1,
    SENSE: 2,
  },
  // 校验方式
  CAPTCHA_TYPE: 1,
  SENSE_ID: "", // 极验的id todo 修改
  SITE_KEY: "6Lc5QT0eAAAAAMjmfiaSnCz758eNJIdjVePLcsDV", // google_captchaId todo 修改
  // 默认区号
  DEFAULT_NATIONAL_CODE: 65,
};
