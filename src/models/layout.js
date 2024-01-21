import getData from "../services/getData";
import route_map from "../config/route_map";
import helper from "../utils/helper";
import { message } from "../lib/index";
import CONST from "../config/const";
import Cookie from "../utils/cookie";
import math from "../utils/mathjs";
import API from "../config/api";
import WSDATA from "./data_source";
import WS from "../utils/ws";

export default {
  namespace: "layout",

  // layout的state全局共用，需要注意key重复问题，其他model的key如果跟layout的key重名，值会覆盖layout的值
  state: {
    // 个性化配置项
    index_config: {
      logo: "", // 券商logo url
      copyright: "", // copyright data
      zendesk: "", // zendesk url
      title: "", // website title
      banners: [],
      smallBanners: [], // 小banner
      announcements: [],
      userAgreement: "", // 用户协议页面地址
      privacyAgreement: "", // 隐私协议地址
      legalDescription: "", // 法律说明地址
      helpCenter: "", // 帮助中心地址

      featureTitle: "", // 平台特点
      features: [],
      shares: [],
      footConfigList: [],
      /**
        { moduleName: "oneKeyBuy" },
        { moduleName: "recommended" },
        { moduleName: "symbols", content: 0 },
        {
          moduleName: "platform",
          content: {
            featureTitle: "",
            features: [{ image: "", title: "", description: "", index: 0 }]
          }
        },
        { moduleName: "userDefine1", content: { title: "", image: "" } },
        { moduleName: "userDefine2", content: { title: "", image: "" } },
        { moduleName: "download", content: { title: "", image: "" } }
       */
      indexModules: {},
    },
    config: {
      ...(window.WEB_CONFIG.token
        ? {
            ...window.WEB_CONFIG,
            tokens: (() => {
              let tokens = {};
              window.WEB_CONFIG.token &&
                window.WEB_CONFIG.token.map((item) => {
                  tokens[item.tokenId] = item;
                  if (
                    item.tokenId == "USDT" &&
                    item.chainTypes &&
                    item.chainTypes.length
                  ) {
                    tokens[item.tokenId]["chainTypes"] = item.chainTypes.sort(
                      (a, b) => {
                        if (a.chainType == "ERC20") {
                          return -1;
                        }
                        if (b.chainType == "ERC20") {
                          return 1;
                        }
                        if (a.chainType == "TRC20") {
                          return -1;
                        }
                        if (b.chainType == "TRC20") {
                          return 1;
                        }
                        return a.chainType.toUpperCase() >=
                          b.chainType.toUpperCase()
                          ? 1
                          : -1;
                      }
                    );
                  }
                });
              return tokens;
            })(),
            // key: 币对
            // value: 对象
            symbols: (() => {
              let symbols = {};
              window.WEB_CONFIG.symbol &&
                window.WEB_CONFIG.symbol.map((item) => {
                  symbols[item.symbolId] = item;
                });
              return symbols;
            })(),
            symbols_obj: (() => {
              let symbols_obj = {
                coin: {},
                option: {},
                futures: {},
                lever: {},
                all: {},
              };
              (window.WEB_CONFIG.symbol || []).map((item, i) => {
                symbols_obj.coin[item.symbolId] = item;
                symbols_obj.all[item.symbolId] = item;
              });
              (window.WEB_CONFIG.optionSymbol || []).map((item, i) => {
                symbols_obj.option[item.symbolId] = item;
                symbols_obj.all[item.symbolId] = item;
              });
              (window.WEB_CONFIG.futuresSymbol || []).map((item, i) => {
                symbols_obj.futures[item.symbolId] = item;
                symbols_obj.all[item.symbolId] = item;
              });
              (window.WEB_CONFIG.marginSymbol || []).map((item, i) => {
                if (item.allowMargin) {
                  symbols_obj.lever[item.symbolId] = item;
                  // 杠杆id与币币id相同，放入all，会覆盖币币的，杠杠币对不放入all
                  //symbols_obj.all[item.symbolId] = item;
                }
              });
              return symbols_obj;
            })(),
          }
        : {
            token: [],
            tokens: {},
            symbol: [], // 这是币币交易的币对数组
            symbols: {}, // 这个是币币交易的币对对象，key是"btcusdt",
            supportLanguages: [],
            recommendSymbols: [],
            quoteToken: [],
            page: {},
            orgId: "",
            optionUnderlying: [],
            optionToken: [],
            customQuoteToken: [],
            optionSymbol: [],
            optionQuoteToken: [],
            optionCoinToken: [],
            kycCardType: [],
            futuresUnderlying: [],
            futuresSymbol: [],
            futuresCoinToken: [],
            functions: {},
            exploreToken: [],
            customKV: {},
            checkInviteCode: false,
            symbols_obj: {
              coin: {},
              option: {},
              futures: {},
              lever: {},
              all: {},
            },
            marginQuoteToken: [], // 杠杆计价币种
            marginSymbol: [], // 杠杆币对
          }),
    },
    // 是否登录
    islogin: false,
    // 用户信息
    userinfo: window.sessionStorage.userinfo
      ? JSON.parse(window.sessionStorage.userinfo)
      : {
          email: "",
          defaultAccountId: "",
          bindGA: false,
          mobile: "",
          userId: "",
          accounts: [],
          registerType: "",
          verifyStatus: "",
        },
    // 用户自选 {exchangeId+sysmbolId:1...}
    favorite: {},
    // 账户资产ws推送，源数据
    user_balance_source: {},
    // 账户资产
    user_balance: [],
    hidden_balance: JSON.parse(window.localStorage.hidden_balance || false),
    // 总资产
    total_asset: null,
    getBalance: false,
    lang: "en-us",
    // kline 语言 与 locale map表
    kline_locale: {
      "en-us": "en",
      "zh-cn": "zh",
      "ko-kr": "ko",
      "ja-jp": "ja",
      "vi-vn": "vi",
      "es-es": "es",
    },
    // 手机号区号与语言关系
    areacode: {
      "zh-cn": 86,
      "en-us": 65,
      "ko-kr": 82,
      "ja-jp": 81,
      "ru-ru": 7,
      "vi-vn": 84,
      "es-es": 34,
    },
    // 币列表
    tokens: {},
    // 当前token可交易的右币对列表，如： BTC/USDT, BTC/ETH, BTC/EOS
    quote_tokens: {},
    // symbol_xxxx  币对市场列表数据
    // 行情页当前选择币种栏目
    symbol_types: [""],
    option_symbol_type: [],
    symbolId_types: [""],
    symbol_choose: 1,
    // 行情页搜索字段
    symbol_search: "",
    // 当前顺序
    // [0]: 0=null, 1=市场，2=最新价，3=涨跌幅,4=24h成交量,5=24h最高价，6=24h最低价, 7=成交额
    // [1]: 0=null， 1=从高到低，2=从低到高
    symbol_filter: [0, 0],
    // 币对列表数据
    symbol_list: [],
    // futures 标的列表 {id:'',name:'',secondLevels:[{}]}
    underlying: [],
    // futures 计价货币 ['USDT']
    coinToken: [],
    // 当前展示的币对列表数据
    symbol_data: [],
    // 币币原始数据
    coin_quoteToken: [],
    coin_symbol_list: [],
    coin_token: [],
    /**
     * 币对的行情数据
     * symbol_quote : {
     *  '301ETCBTC': {
     *    "t": "1531193421003",//time
     *    "s": "USDTBTC", // symbol
     *    "c": "0.1531193171219",//close price
     *    "h": "0.1531193171219",//high price
     *    "l": "0.1531193168802",//low price
     *    "o": "0.1531193171219", //open price
     *    "v": "0.0", //volume
     *    "e": "301" //exchange id
     *  }
     * }
     */
    symbol_quote: {},
    exchangeId: "", // 交易所id
    //当前委托,历史委托成交记录,我的资产，当前选择项，0-3
    trading_index: 0,
    // ws请求订单数据时，为true，请求完成，为false
    ws_order_req: false,
    // 订单ws推送，源数据
    new_order_source: [],
    new_plan_order_source: [],
    // 当前委托
    open_orders: [],
    open_orders_more: true, // 是否还有更多数据
    // 当前计划委托
    open_plan_orders: [],
    open_plan_orders_more: true, // 是否还有更多数据
    // 历史委托
    history_orders: [],
    history_orders_more: true, // 是否还有更多数据
    // 历史计划委托
    history_plan_orders: [],
    history_plan_orders_more: true, // 是否还有更多数据
    // 历史成交源数据
    history_trades_source: [],
    // 历史成交
    history_trades: [],
    // 第一次拉取历史成交记录，用于拉取历史成交最新数据的凭据，如果false，不进行最新拉取
    history_trades_first_req: false,
    history_trades_more: true, // 是否还有更多数据
    // 订单记录limit
    TradingHistoryLimit: 50,
    // 某账户下，我的资产
    asset_get: {
      btcValue: "",
    },
    // ws 地址
    ws_address: {},
    // 汇率
    rates: {},
    order_id: "",
    // 订单ws
    // ws: {
    //   oid: "", // websocket 实例
    //   url: "", // path
    //   name: "ws",
    //   count: 0
    // },
    // 订单ws,重试次数=3，启动http
    // ws_status: 0,
    // 已订阅的频道
    // ws_sub: {},
    // 行情ws
    // qws: {
    //   oid: "", // websocket 实例
    //   url: "", // path
    //   name: "qws",
    //   count: 0
    // },
    // 行情ws,重试次数=3，启动http
    // qws_status: 0,
    // 已订阅的频道
    // qws_sub: {},
    // client id
    // qws_id: 0,

    // 默认k线分辨率
    resolution: "15m",
    // depth limit
    depth_limit: 100,
    // layout, exchange
    newTradingLimit: 60,
    // 国家列表
    countries: [],
    memberProfile: {},
    stage: 0,
    packList: [],
    totalCount: 0,
    remainCount: 0,
    balanceList: [], // 余额列表
    pointLimit: 0,
    getOrders_status: true,
    // 功能配置入口
    function_list: [],
    // 通用配置
    commonConfig: {},
    // 划转账户列表
    accountList: [
      {
        value: "coin",
        name: "钱包账户",
      },
    ],
    functions: {}, // 开通功能开关
    explore_token: [], // 体验币
    /**
     * 永续合约列表信息 future_asset
     * [{
     *  "tokenId":"USDT", // 资产余额（币）
     *  "tokenName":"USDT", // 资产余额（币）
     *  "tokenFullName":"USDT", //资产余额（币）
     *  "availableMargin":"10000.89",//可用保证金
     *  "positionMargin":"2000.89",//仓位保证金
     *  "orderMargin":"300.89",//委托保证金
     * }]
     */
    future_asset: [],
    target_list: [], // 合约标的列表
    futures_coin_token: [], // 永续合约交易币种

    // 子账户列表
    child_account_list: [],
    account_coin_index: 0, // 币币主账户在账户列表中的index
    account_future_index: 0, // 合约主账户在账户列表中的index
    account_lever_index: 0,
    account_activity_index: 0, // 活动账户在账户列表中的index
    // 子账户类型
    child_account_type: [],
    // 子账户资产
    /**
     *  {
     *    accountId: [{token:USDT,free:3.5},...]
     *  }
     */
    child_account_balance: {},
    //风险提示
    indexWarning: {},
    indexWarningStatus: false,
    getWarning: false,
    // kyc配置信息
    kycSettings: {},
    // ieo配置信息
    ieoSettings: {},
    // 用户等级配置信息
    levelSettings: {},
    stakingSettings: {},
    // 杠杆币种
    lever_coin_token: [],
    // 杠杆账户可提
    availWithdrawAmount: 0,

    // 用户自定义配置
    customConfig: JSON.parse(window.sessionStorage.customConfig || "{}"),

    geetestData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      // 获取所有币种
      let countries_payload = { for_area_code: true };
      if (window.location.pathname.indexOf(route_map.user_kyc) > -1) {
        countries_payload = {
          for_nationality: true,
        };
      }
      dispatch({
        type: "countries",
        payload: countries_payload,
      });
      dispatch({
        type: "get_all_token",
        payload: { type: "all" },
        dispatch,
      });
      dispatch({
        type: "get_custom_kv",
        payload: {},
      });
      dispatch({
        type: "getFunctionConfig",
        payload: {},
      });

      // 本地时间与服务器时间差，上报日志用
      dispatch({
        type: "getServerTime",
        payload: {},
      });

      // 启动行情qws
      const qws = new WS(API.qws);
      dispatch({
        type: "save",
        payload: {
          qws,
        },
      });

      history.listen((location) => {
        const pathname = location.pathname;
        const search = location.search;
        const preview = /preview/.test(search);

        // 根据Cookie  account_id 判断是否登录
        let r = false;
        route_map.noLogin.map((item) => {
          if (
            (route_map[item] !== "/" &&
              pathname.indexOf(route_map[item]) > -1) ||
            (route_map[item] === "/" && pathname === "/")
          ) {
            r = true;
          }
        });
        // 需登录才可访问的页面 && 未登录，，直接跳登录页
        if (!r && pathname !== route_map.login && !Cookie.read("account_id")) {
          window.location.href =
            route_map.login +
            "?redirect=" +
            encodeURIComponent(window.location.href);
          return;
        }

        dispatch({
          type: "getConfig",
          payload: {
            preview,
          },
        });
        dispatch({
          type: "userinfo",
          payload: {},
          dispatch,
        });
        // 除资产记录页外清空localStorage中存储tab
        if (pathname !== route_map.finance_record) {
          window.localStorage.removeItem("TabValue");
        }

        // 我的资产
        if (
          (pathname.indexOf(route_map.option_finance_list) > -1 ||
            pathname.indexOf(route_map.future_finance) > -1) &&
          pathname != route_map.finance_child_account
        ) {
          dispatch({
            type: "getAccount",
            payload: {},
          });
        }
        // 永续合约资产
        if (pathname.indexOf(route_map.future_finance) > -1) {
          // 获取永续合约资产
          dispatch({
            type: "getFuturesAsset",
            payload: {},
          });
        }
        // 期权资产余额、总资产
        if (
          pathname.indexOf(route_map.option_position_order) > -1 ||
          pathname.indexOf(route_map.option_finance_list) > -1 ||
          pathname.indexOf(route_map.finance_list) > -1 ||
          pathname.indexOf(route_map.option) > -1 ||
          pathname.indexOf(route_map.coinplus_finance) > -1 ||
          pathname.indexOf(route_map.staking_finance) > -1 ||
          pathname.indexOf(route_map.future_finance) > -1 ||
          pathname.indexOf(route_map.future) > -1
        ) {
          dispatch({
            type: "getOptionAssetAva",
            payload: {},
          });
          dispatch({
            type: "getTotalAsset",
            payload: {
              unit: "USDT",
            },
          });
        }
        if (
          pathname.indexOf(route_map.future_position) > -1 ||
          pathname.indexOf(route_map.future_current_entrust) > -1 ||
          pathname.indexOf(route_map.future_history_entrust) > -1 ||
          pathname.indexOf(route_map.future_history_order) > -1 ||
          pathname.indexOf(route_map.future_delivery) > -1
        ) {
          // 获取永续合约标的列表
          dispatch({
            type: "getTargetList",
            payload: {},
          });
        }
      });

      // 设置用户自定义配置
      if (window.sessionStorage.customConfig) {
        dispatch({
          type: "saveCustomConfig",
          payload: {
            customConfig: window.sessionStorage.customConfig,
          },
        });
      }
    },
  },

  effects: {
    // countries
    *countries({ payload }, { call, put }) {
      const result = yield call(getData("countries"), { payload });
      if (result.code == "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            countries: result.data,
          },
        });
      } else {
        yield helper.delay(200);
        yield put({
          type: "countries",
          payload: {},
        });
      }
    },
    // 通用配置接口
    *commonConfig({ payload }, { call, put }) {
      const result = yield call(getData("language_list"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            commonConfig:
              result.data && result.data.data ? result.data.data : {},
          },
        });
      }
    },
    *getFunctionConfig({ payload }, { call, put }) {
      const result = yield call(getData("function_list"), { payload });
      if (result.code === "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            function_list: result.data,
          },
        });
      }
    },
    *getPackList({ payload }, { call, put }) {
      const result = yield call(getData("get_pact_list"), {
        payload,
        method: "get",
      });
      if (result.code === "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            stage: result.data.stage,
            packList: result.data.list,
            totalCount: result.data.totalCount,
            remainCount: result.data.remainCount,
          },
        });
      }
    },
    *getConfig({ payload }, { call, put, select }) {
      const result = yield call(getData("index_config"), {
        payload,
        method: "get",
      });
      if (result.code === "OK" && result.data) {
        window.sessionStorage.index_config = JSON.stringify(result.data);
        let indexModules = {};
        (result.data.indexModules || []).map((item) => {
          indexModules[item.moduleName] = item;
        });
        yield put({
          type: "save",
          payload: {
            index_config: { ...result.data, indexModules },
          },
        });
        if (result.data.title) {
          window.document.title = result.data.title;
        }
        if (result.data.keywords) {
          const meta = document.createElement("meta");
          meta.setAttribute("content", result.data.keywords);
          meta.setAttribute("name", "keywords");
          document.querySelector("head").appendChild(meta);
        }
        if (result.data.description) {
          const meta = document.createElement("meta");
          meta.setAttribute("content", result.data.description);
          meta.setAttribute("name", "description");
          document.querySelector("head").appendChild(meta);
        }
        let favicon = document.getElementById("favicon");
        if (result.data.favicon) {
          favicon.href = result.data.favicon;
        }
        if (result.data.zendesk && /\.js/.test(result.data.zendesk)) {
          setTimeout(() => {
            window.addZdassets && window.addZdassets(result.data.zendesk);
          }, 5000);
        }
      }
    },
    /**
     * http 轮询更新,订单信息,资金信息
     * 当前委托：全量更新，如果数据量较大，全量更新前100条
     * 历史委托：只请求最新的数据
     * 历史成交：只请求最新的数据
     */
    *httpUpdateOrder({ payload }, { call, put, select }) {
      const { userinfo } = yield select((state) => state.layout);
      const loading = yield select((state) => state.loading);
      // 切换全部币对时，暂停轮询，等待切换完成，再轮询
      if (loading.effects["layout/getOrders"]) return;
      if (!userinfo.defaultAccountId) return;
      const { open_orders, history_orders, history_trades } = yield select(
        (state) => state.layout
      );
      // 当前委托更新, http状态下更新最新的100条
      const max_limit = 100;

      let [new_open, new_trade, new_history_trades] = yield [
        call(getData("open_orders"), {
          payload: {
            account_id: userinfo.defaultAccountId,
            end_order_id: 0,
            limit: Math.min(max_limit, open_orders ? open_orders.length : 50),
            symbol_id: payload.symbol_id,
          },
        }),
        call(getData("history_orders"), {
          payload: {
            account_id: userinfo.defaultAccountId,
            end_order_id:
              history_orders && history_orders[0]
                ? history_orders[0]["orderId"]
                : 0,
            limit: 50,
            symbol_id: payload.symbol_id,
          },
        }),
        call(getData("history_trades"), {
          payload: {
            account_id: userinfo.defaultAccountId,
            end_trade_id:
              history_trades && history_trades[0]
                ? history_trades[0]["tradeId"]
                : 0,
            limit: 50,
            symbol_id: payload.symbol_id,
          },
        }),
      ];
      let data = {};
      if (new_open.code === "OK") {
        data.open_orders = new_open.data || [];
      }

      // 当前委托覆盖
      yield put({
        type: "save",
        payload: {
          open_orders: data.open_orders,
        },
      });

      // 历史委托
      if (history_orders[0]) {
        WSDATA.setData("new_order_source", new_trade.data || []);
      }

      // 历史成交
      if (history_trades[0]) {
        WSDATA.setData("history_trades_source", new_history_trades.data || []);
      }
    },
    // 获取汇率
    *get_rates({ payload, dispatch }, { call, put, select }) {
      const { coin_token, coin_quoteToken } = yield select(
        (state) => state.layout
      );
      let tokens = [];
      (coin_token || []).map((item) => {
        tokens.push(item.tokenId);
      });
      let keys = [...tokens, "BTC", "USDT"];
      let values = new Set();
      values.add("BTC");
      values.add("USDT");
      values.add("USD");
      window.WEB_CONFIG.supportLanguages.map((item) => {
        if (item.lang == window.localStorage.unit) {
          values.add(item.suffix);
        }
      });
      // (coin_quoteToken || []).map(item => {
      //   values.add(item.tokenId);
      // });
      values = Array.from(values);
      const result = yield call(getData("rate2"), {
        payload: {
          tokens: keys.join(",").toUpperCase(),
          legalCoins: values.join(",").toUpperCase(),
        },
      });
      if (
        result.code == "OK" &&
        result.data &&
        (result.data.code == 0 || result.data.code == 200) &&
        result.data.data
      ) {
        let rates = {};
        result.data.data.map((item, i) => {
          if (item) {
            rates[item.token] = item.rates;
          }
        });
        yield put({
          type: "save",
          payload: {
            rates,
          },
        });
      }
    },
    // 获取配置信息（区分语言）
    *get_custom_kv({ payload, cb }, { call, put, select }) {
      const result = yield call(getData("custom_kv"), {
        payload: {
          ...payload,
          custom_keys: [
            "cust.indexWarningStatus,cust.indexWarning,cust.kycSettings,cust.ieoSettings,cust.levelSettings,cust.stakingSettings",
            payload.custom_keys || "",
          ].join(","),
        },
        method: "get",
      });
      cb && cb(result);
      if (result.code == "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            //风险提示
            indexWarning: result.data["cust.indexWarning"] || {},
            indexWarningStatus: result.data["cust.indexWarningStatus"] || false,
            getWarning: true,
            // kyc配置信息
            kycSettings: result.data["cust.kycSettings"] || {},
            // kyc配置信息
            ieoSettings: result.data["cust.ieoSettings"] || {},
            // 等级配置信息
            levelSettings: result.data["cust.levelSettings"] || {},
            stakingSettings: result.data["cust.stakingSettings"] || {},
          },
        });
      }
    },
    // 获取所有币种，币对，币选项
    *get_all_token({ payload, dispatch }, { call, put, select }) {
      const result = window.WEB_CONFIG.orgId
        ? { code: "OK", data: window.WEB_CONFIG }
        : { code: "unknow" };
      let { accountList } = yield select((state) => state.layout);
      if (result.code === "OK" && result.data) {
        // 根据路径，写入symbol_list,token,quoteToken的值,默认写入exchange的币对信息
        const option =
          window.location.pathname.indexOf("/option") > -1 ||
          window.location.pathname === route_map.option_index ||
          window.location.pathname.indexOf(route_map.option_busdt) > -1
            ? true
            : false;
        const future =
          window.location.pathname.indexOf("/contract") > -1 ? true : false;
        const lever = window.location.pathname.indexOf("/lever") > -1;

        // 币币
        let quoteToken = result.data.quoteToken || [];
        let token = result.data.token;
        let symbol_list = result.data.symbol;
        let coin_quoteToken = result.data.quoteToken || [];
        let coin_token = token;
        let coin_symbol_list = symbol_list;
        const orgId = result.data.orgId;
        // 合约
        const future_symbold = result.data.futuresSymbol;
        const recommendSymbols = result.data.recommendSymbols;
        let symbol_types = ["CHOOSE"];
        let symbolId_types = [""];
        let symbol_choose = 1;
        let underlying = [];
        // 重新写入永续合约币对信息
        if (future) {
          symbol_types = [];
          symbolId_types = [];
          quoteToken = [];
          token = [];
          underlying = result.data.futuresUnderlying;
        }

        let tokens = {};
        let quote_tokens = {};
        (token || []).map((item) => {
          tokens[item.tokenId] = item;
          quote_tokens[item.tokenId] = item.baseTokenSymbols;
        });
        quoteToken.map((item) => {
          symbol_types.push(item.tokenName);
          symbolId_types.push(item.tokenId);
        });

        let functions = result.data.functions;
        if (result.data && result.data.functions) {
          if (result.data.functions["futures"]) {
            accountList.push({
              value: "futures",
              name: "永续合约账户",
            });
          }
          if (result.data.functions["margin"]) {
            accountList.push({
              value: "lever",
              name: "杠杆账户",
            });
          }
        }
        // 体验币
        let explore_token = result.data.exploreToken || [];
        yield put({
          type: "save",
          payload: {
            tokens,
            quote_tokens,
            symbol_types,
            symbolId_types,
            symbol_list,
            orgId,
            symbol_choose,
            //countries,
            underlying,
            coin_quoteToken,
            coin_symbol_list,
            coin_token,
            functions,
            accountList,
            futures_coin_token: result.data.futuresCoinToken || [],
            recommendSymbols,
            future_symbold,
            explore_token,
          },
        });
      } else {
      }
    },

    /**
     * 发送验证码
     * @param payload {Object}
     * @param email {String} 发送email验证码
     * @param mobile {Number} 发送mobile验证码
     * @param n {String} 默认0，0=登录前，1=登录后,2=登录时二次验证,3=设置密码的验证码
     * @param order_id_name {String} 有值，返回的order_id的key,用在页面同时出现2个及验证码时
     */
    *get_verify_code(
      { payload, errorCallback, n = 0, order_id_name = "order_id" },
      { call, put }
    ) {
      const result = yield call(
        getData(
          payload.email
            ? [
                "send_email_verify_code",
                "send_email2_verify_code",
                "send_email_verify_code_authorize_advance",
                "send_verify_code_set_password",
              ][n]
            : [
                "send_sms_verify_code",
                "send_sms2_verify_code",
                "send_sms_verify_code_authorize_advance",
                "send_verify_code_set_password",
              ][n]
        ),
        {
          payload,
        }
      );
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            [order_id_name]: result.data.orderId,
          },
        });
      } else {
        message.error(result.msg);
        // 失败，如google验证未通过等
        errorCallback && errorCallback();
      }
    },

    /**
     * 此接口用于用户**在登陆状态**并且系统已知用户的手机号或者邮箱的情况下请求发送验证码
     * @param {*} param0
     * @param {*} param1
     */
    *send_verify_code({ payload, errorCallback }, { call, put }) {
      const result = yield call(getData("send_verify_code"), {
        payload: {
          receiver_type: payload.receiver_type,
          type: payload.type,
        },
      });
      if (result.code == "OK") {
        return result.data;
      } else {
        message.error(result.msg);
        // 失败，如google验证未通过等
        errorCallback && errorCallback();
      }
    },
    /**
     * @param {*} param0
     * @param {*} param1
     */
    *send_common_verify_code({ payload, errorCallback }, { call, put }) {
      const result = yield call(getData("send_common_verify_code"), {
        payload,
      });
      if (result.code == "OK") {
        return result.data;
      } else {
        message.error(result.msg);
        // 失败，如google验证未通过等
        errorCallback && errorCallback();
      }
    },
    *getServerTime({ payload }, { call, put }) {
      const result = yield call(getData("serverTime"), {
        payload,
        method: "get",
      });
      if (result.code == "OK") {
        yield put({
          type: "save",
          payload: {
            sever_time: result.data.data.time,
            diff_time: result.data.data.time - new Date().getTime(), // 服务器时间与本地时间差值
          },
        });
        /**
         * diff_time: 服务器时间与本地时间差值
         */
        window.diff_time = new Date().getTime() - result.data.data.time;
      }
    },
    // 通用callback请求方式
    *commonRequest({ payload, urlKey, method, cb }, { call }) {
      if (!urlKey) {
        console.error("缺少 url");
        return;
      }
      const result = yield call(getData(urlKey), {
        payload,
        method: method || "get",
      });
      cb && cb(result);
    },
    // get user info
    *userinfo({ payload, update, dispatch }, { put, call, select }) {
      if (!Cookie.read("account_id")) {
        // 未登录，写入本地自选数据
        const locale = JSON.parse(
          !window.localStorage.favorite ||
            window.localStorage.favorite == "undefined" ||
            typeof window.localStorage.favorite === "undefined"
            ? "{}"
            : window.localStorage.favorite
        );
        yield put({
          type: "save",
          payload: {
            favorite: locale,
          },
        });
        return;
      }
      const ws = yield select((state) => state.layout.ws);
      try {
        const result = yield call(getData("userinfo"), {
          payload,
          method: "get",
        });
        if (result.code == "OK") {
          const favorites = result.data.favorites || [];
          let favorite = {};
          favorites.forEach((item) => {
            favorite[item.symbolId] = true;
          });
          window.sessionStorage.userinfo = JSON.stringify(result.data);
          let payload = { userinfo: result.data, favorite: favorite };
          if (!ws) {
            payload.ws = new WS(API.ws);
          }
          yield put({
            type: "save",
            payload,
          });
          yield put({
            type: "account_list",
            payload: {},
          });
        } else {
          // 30000 鉴权失败，其他code是后端业务失败
          if (result.code === 30000) {
            let r = false;
            const pathname = window.location.pathname;
            route_map.noLogin.forEach((item) => {
              if (
                (route_map[item] !== "/" &&
                  pathname.indexOf(route_map[item]) > -1) ||
                (route_map[item] === "/" && pathname === "/")
              ) {
                r = true;
              }
            });
            Cookie.del("account_id");
            window.sessionStorage.removeItem("userinfo");
            // 需登录才可访问的页面 && 未登录，，直接跳登录页
            if (!r && pathname !== route_map.login) {
              // 公会首页
              if (pathname === route_map.guild) {
                window.location.href =
                  route_map.guild_home + window.location.search;
                return;
              }
              // 公会邀请落地页
              if (pathname === route_map.guild_invite) {
                window.location.href =
                  route_map.register +
                  "?redirect=" +
                  encodeURIComponent(window.location.href);
                return;
              }
              window.location.href =
                route_map.login +
                "?redirect=" +
                encodeURIComponent(window.location.href);
              return;
            }
          }

          // 未登录，写入本地自选数据
          const locale = JSON.parse(
            !window.localStorage.favorite ||
              window.localStorage.favorite == "undefined" ||
              typeof window.localStorage.favorite === "undefined"
              ? "{}"
              : window.localStorage.favorite
          );
          yield put({
            type: "save",
            payload: {
              favorite: locale,
            },
          });
        }
      } catch (e) {}
    },
    /**
     * 获取个人信息
     * @param {String} guild_id
     */
    *getMemberProfile({ payload }, { call, put }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("get_member_profile"), {
        payload,
      });
      if (result.code === "OK") {
        if (payload.member_id) {
          yield put({
            type: "save",
            payload: {
              authorProfile: result.data,
            },
          });
          return;
        }
        yield put({
          type: "save",
          payload: {
            memberProfile: result.data,
          },
        });
      }
    },
    // 获取用户资产
    *getAccount({ payload, callback }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) {
        return;
      }
      const r = yield call(getData("get_asset"), {
        payload: {
          account_id: defaultAccountId,
        },
        method: "get",
      });
      if (r.code === "OK") {
        WSDATA.setData("user_balance_source", r.data);
        yield put({
          type: "save",
          payload: {
            user_balance: r.data || [],
          },
        });
        callback && callback(r.data);
      }
    },
    // logout
    *logout({ payload }, { call }) {
      const result = yield call(getData("logout"), {
        payload,
      });
      // 注册成功，跳转登录页
      if (result.code == "OK") {
        //message.info(window.appLocale.messages["登出成功"]);
        Cookie.del("account_id");
        window.sessionStorage.removeItem("userinfo");
        helper.delay(1000).then(() => {
          window.location.href =
            window.location.protocol + "//" + window.location.hostname;
        });
      } else {
        message.error(result.msg);
      }
    },
    // http获取币对24小时行情
    *symbol_quote({}, { call, put, select }) {
      const symbol_list = yield select((state) => state.layout.symbol_list);
      if (!symbol_list.length) return;
      let symbols = [];
      symbol_list.forEach((item) => {
        symbols.push([item.exchangeId + "." + item.symbolId]);
      });
      symbols = symbols.join(",");
      const result = yield call(getData("quote"), {
        payload: {
          symbol: symbols,
          realtimeInterval: window.WEB_CONFIG.realtimeInterval,
        },
        method: "get",
      });
      if (result.code === "OK") {
        WSDATA.setData("symbol_quote_source", result.data.data);
      }
    },

    // 自选
    *favorite({ payload }, { call, put, select }) {
      let { userinfo, favorite } = yield select((state) => state.layout);
      let favorite_new = Object.assign({}, favorite);
      if (favorite[payload.symbolId]) {
        delete favorite_new[payload.symbolId];
      } else {
        favorite_new[payload.symbolId] = true;
      }
      yield put({
        type: "save",
        payload: {
          favorite: favorite_new,
        },
      });
      if (userinfo.defaultAccountId) {
        yield call(
          getData(
            favorite[payload.symbolId] ? "favorite_cancel" : "favorite_create"
          ),
          {
            payload: {
              symbol_id: payload.symbolId,
              exchange_id: payload.exchangeId,
            },
          }
        );
      } else {
        window.localStorage.favorite = JSON.stringify(favorite_new);
      }
    },
    // 更新币对24小时行情数据
    *symbol_quote_reducers({ payload }, { put, select }) {
      const symbol_quote_source = payload.symbol_quote_source || {};
      const symbol_quote = yield select((state) => state.layout.symbol_quote);
      let obj = Object.assign({}, symbol_quote, symbol_quote_source);
      yield put({
        type: "save",
        payload: {
          symbol_quote: obj,
        },
      });
    },
    // 属性变化
    *handleChange({ payload }, { put }) {
      if (payload.trading_index || payload.trading_index === 0) {
        window.localStorage.trading_index = payload.trading_index;
      }
      yield put({
        type: "save",
        payload,
      });
    },
    // 撤单
    *orderCancel({ payload }, { call, put, select }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("cancelOrder"), {
        payload,
      });
      if (result.code == "OK") {
        message.info(window.appLocale.messages["撤单成功"]);
        // 删除数组中撤单数据
        let { open_orders, TradingHistoryLimit, open_orders_more } =
          yield select((state) => state.layout);
        let newdata = helper.arrayClone(open_orders);
        let i = payload.i;
        if (i === -1) {
          newdata.map((item, _i) => {
            if (item.orderId == payload.order_id) {
              i = _i;
            }
          });
        }
        newdata.splice(i, 1);
        yield put({
          type: "save",
          payload: {
            open_orders: newdata,
          },
        });
        // 剩余数据小于一页，并且有更多数据时，自动加载下一页
        if (newdata.length < TradingHistoryLimit && open_orders_more) {
          yield put({
            type: "getOrders",
            payload: {
              column: "open_orders",
            },
          });
        }
      } else {
        message.error(result.msg);
      }
    },

    /**
     * 取消订单
     * @param {*} param0
     * @param {*} param1
     */
    *cancelPlanOrder({ payload }, { call, put, select }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("cancel_plan_order"), {
        payload,
      });
      if (result.code == "OK") {
        message.info(window.appLocale.messages["撤单成功"]);
        // 删除数组中撤单数据
        let { open_plan_orders, TradingHistoryLimit, open_plan_orders_more } =
          yield select((state) => state.layout);
        let newData = helper.arrayClone(open_plan_orders);
        let i = payload.i;
        if (i === -1) {
          newData.map((item, _i) => {
            if (item.orderId == payload.order_id) {
              i = _i;
            }
          });
        }
        newData.splice(i, 1);
        yield put({
          type: "save",
          payload: {
            open_plan_orders: newData,
          },
        });
        // 剩余数据小于一页，并且有更多数据时，自动加载下一页
        if (newData.length < TradingHistoryLimit && open_plan_orders_more) {
          yield put({
            type: "getOrders",
            payload: {
              column: "open_plan_orders",
            },
          });
        }
      } else {
        message.error(result.msg);
      }
    },
    /**
     * 生成二维码
     */
    *getQrCode({ payload }, { call, put }) {
      const result = yield call(getData("qrcode"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            qrcode: result.data.qrcode,
          },
        });
      }
    },
    // 当前委托，历史委托，历史成交, 拉取历史数据
    *getOrders({ payload }, { select, put, call }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId || "undefined" == defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
        if (!defaultAccountId) {
          return;
        }
      }
      if (defaultAccountId) {
        const layout = yield select((state) => state.layout);
        const lastId = layout[payload.column].length
          ? layout[payload.column][layout[payload.column].length - 1]["orderId"]
          : "";
        if (
          !layout[payload.column + "_more"] ||
          layout[payload.column + "_loading"]
        ) {
          return;
        }
        yield put({
          type: "save",
          payload: {
            [payload.column + "_loading"]: true,
          },
        });
        let p = {
          account_id: defaultAccountId,
          from_order_id: lastId || 0,
          limit: layout.TradingHistoryLimit,
          s: "getOrders",
        };
        if (payload.symbol_id) {
          p.symbol_id = payload.symbol_id;
        }
        if (payload.column == "history_trades") {
          p.from_trade_id = layout[payload.column].length
            ? layout[payload.column][layout[payload.column].length - 1][
                "tradeId"
              ]
            : 0;
          delete p.from_order_id;
        }
        try {
          const result = yield call(getData(payload.column), {
            payload: p,
            method: "get",
          });
          if (result.code == "OK") {
            const data = result.data;
            const source = layout[payload.column];
            const TradingHistoryLimit = layout.TradingHistoryLimit;
            let ar = helper.excludeRepeatArray(
              payload.column == "history_trades" ? "tradeId" : "orderId",
              [...source, ...data]
            );
            ar.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
            yield put({
              type: "save",
              payload: {
                [payload.column]: ar,
                [payload.column + "_more"]:
                  data.length == TradingHistoryLimit ? true : false,
                [payload.column + "_loading"]: false,
              },
            });
          }
        } catch (e) {}
        yield put({
          type: "save",
          payload: {
            //[payload.column + "_more"]: true,
            [payload.column + "_loading"]: false,
          },
        });
      }
    },
    // 账户列表
    *account_list({ payload }, { call, put }) {
      const result = yield call(getData("account_list"), { payload });
      if (result.code == "OK" && result.data && result.data.length) {
        let data = [];
        let account_coin_index = 0;
        let account_future_index = 0;
        let account_lever_index = 0;
        let account_activity_index = 0;
        result.data.map((item, i) => {
          if (Number(item.accountIndex) == 0 && !item.accountName) {
            let accountName = "";
            switch (item.accountType) {
              case 1:
                accountName =
                  (window.WEB_LOCALES_ALL &&
                    window.WEB_LOCALES_ALL["钱包账户"]) ||
                  "钱包账户";
                break;
              case 3:
                accountName =
                  (window.WEB_LOCALES_ALL &&
                    window.WEB_LOCALES_ALL["合约账户"]) ||
                  "合约账户";
                break;
              case 27:
                accountName =
                  (window.WEB_LOCALES_ALL &&
                    window.WEB_LOCALES_ALL["杠杆账户"]) ||
                  "杠杆账户";
                break;
              case 42:
                accountName =
                  (window.WEB_LOCALES_ALL &&
                    window.WEB_LOCALES_ALL["奖励账户"]) ||
                  "奖励账户";
                break;
            }
            data.push({
              ...item,
              accountName,
            });
          } else {
            data.push(item);
          }
          if (item.accountType == 1 && item.accountIndex == 0) {
            account_coin_index = i;
          }
          if (item.accountType == 3 && item.accountIndex == 0) {
            account_future_index = i;
          }
          if (item.accountType == 27 && item.accountIndex == 0) {
            account_lever_index = i;
          }
          if (item.accountType == 42 && item.accountIndex == 0) {
            account_activity_index = i;
          }
        });
        yield put({
          type: "save",
          payload: {
            child_account_list: data,
            account_coin_index,
            account_future_index,
            account_lever_index,
            account_activity_index,
          },
        });
      }
    },
    // 账户类型
    *account_type({ payload }, { call, put }) {
      const result = yield call(getData("account_type"), { payload });
      if (result.code == "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            child_account_type: result.data.supportAccountTypes,
            authorizedOrg: result.data.authorizedOrg,
          },
        });
      }
    },
    // 创建账户
    *create_account({ payload, cb }, { call, put, select }) {
      const result = yield call(getData("create_account"), { payload });
      if (result.code == "OK") {
        let child_account_list = yield select(
          (state) => state.layout.child_account_list
        );
        const data = result.data;
        yield put({
          type: "save",
          payload: {
            child_account_list: [...child_account_list, data],
          },
        });
        cb && cb();
      } else {
        result.msg && message.error(result.msg);
      }
    },
    // 账户资产
    *child_account_balance_req({ payload, callback }, { call, put, select }) {
      try {
        const result = yield call(getData("get_asset"), { payload });
        if (result.code === "OK") {
          const child_account_balance = yield select(
            (state) => state.layout.child_account_balance
          );
          yield put({
            type: "save",
            payload: {
              child_account_balance: {
                ...child_account_balance,
                [payload.account_id]: result.data,
              },
            },
          });
        }
      } catch (e) {}
      callback && callback();
    },
    // 账户可划转资产查询
    *child_account_balance({ payload, callback }, { call, put, select }) {
      try {
        const result = yield call(getData("transfer_available"), { payload });
        if (result.code === "OK") {
          const child_account_balance = yield select(
            (state) => state.layout.child_account_balance
          );
          const data = child_account_balance[payload.account_id] || [];
          const res_data = result.data;
          const i = data.findIndex((item) => item.tokenId == payload.token_id);
          if (i > -1) {
            data[i] = { tokenId: payload.token_id, free: res_data.amount };
          } else {
            data.push({ tokenId: payload.token_id, free: res_data.amount });
          }
          yield put({
            type: "save",
            payload: {
              child_account_balance: {
                ...child_account_balance,
                [payload.account_id]: data,
              },
            },
          });
        }
      } catch (e) {}
      callback && callback();
    },

    // 融币账户可出金
    *getAvailWithdraw({ payload, api }, { call, put, select }) {
      const ret = yield call(getData("get_avail_withdraw"), { payload });
      if (ret && ret.code == "OK") {
        yield put({
          type: "save",
          payload: { ...ret.data },
        });
      }
    },
    // 资产划转
    *assetTransfer({ payload, callback }, { call, put, select }) {
      const { ws } = yield select((state) => state.layout);
      const result = yield call(getData("asset_transfer"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "getOptionAssetAva",
          payload: {},
        });
        yield put({
          type: "getAccount",
          payload: {},
        });
        yield put({
          type: "getFuturesAsset",
          payload: {},
        });
        yield put({
          type: "getTotalAsset",
          payload: {
            unit: "USDT",
          },
        });
        yield put({
          type: "lever/getLeverTotalAsset",
          payload: {},
        });
        yield put({
          type: "lever/getLeverAsset",
          payload: {},
        });
        yield put({
          type: "future/tradeable_req",
          payload: {},
        });
        if (callback && typeof callback === "function") {
          callback();
        }
      } else {
        result.msg && message.error(result.msg);
      }
    },
    // ws 获取资产可交易信息
    *getTradeable({ paylod }, { select, put }) {
      const { symbol_list, ws } = yield select((state) => state.layout);
      const pathname = window.location.pathname.split("/");
      const symbolId = pathname[pathname.length - 1].toUpperCase();
      yield put({
        type: "getOptionAssetAva",
        payload: {
          token_ids: symbolId,
        },
      });
    },

    // 获取永续合约资产列表
    *getFuturesAsset({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const result = yield call(getData("get_futures_asset"), {
        payload: {},
        method: "get",
      });
      if (result.code === "OK") {
        let data = result.data || [];
        if (data.length) {
          data.map((item, index) => {
            data[index].available = item.availableMargin;
          });
        }
        WSDATA.setData("future_balance_source", data);
        yield put({
          type: "save",
          payload: {
            future_asset: data,
          },
        });
      } else {
        // message.error(result.msg);
      }
    },
    // 拉取永续合约，期权，杠杆支持的币种
    *coin_tokens({ payload }, { call, put }) {
      const result = yield call(getData("coin_tokens"), { payload });
      if (result.code == "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            option_coin_token: result.data.optionCoinToken,
            futures_coin_token: result.data.futuresCoinToken,
            lever_coin_token: result.data.marginCoinToken || [],
            activity_coin_token: ["USDT"],
          },
        });
      }
    },

    // 获取总资产
    *getTotalAsset({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const result = yield call(getData("get_total_asset"), {
        payload,
        method: "get",
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            total_asset: result.data,
          },
        });
      }
    },
    // 获取标的列表
    *getTargetList({ payload, callback }, { call, put, select }) {
      const result = yield call(getData("get_target_list"), {
        payload,
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            target_list: result.data || [],
          },
        });
      }
    },

    // 获取用户自定义配置
    *getCustomConfig({ payload, callback }, { call, put, select }) {
      const { userinfo } = yield select((state) => state.layout);
      if (userinfo != null && userinfo.userId) {
        // 用户已经登录了
        const ret = yield call(getData("get_custom_config"), {
          payload,
        });
        if (ret.code == "OK" && ret.data.commonConfig) {
          yield put({
            type: "saveCustomConfig",
            payload: {
              customConfig: ret.data.commonConfig,
            },
          });
        }
      }
    },

    // 设置用户自定义配置
    *setCustomConfig({ payload, callback }, { call, put, select }) {
      const { userinfo } = yield select((state) => state.layout);
      if (userinfo != null && userinfo.userId) {
        // 用户已经登录了
        let customConfig = yield select((state) => state.layout.customConfig);
        customConfig = {
          ...customConfig,
          ...payload,
        };
        const ret = yield call(getData("set_custom_config"), {
          payload: {
            common_config: JSON.stringify(customConfig),
          },
        });
        if (ret.code == "OK") {
          yield put({
            type: "getCustomConfig",
          });
        }
      }
    },

    *registGeetest({ payload, onSuccess }, { call, put, select }) {
      const ret = yield call(getData("regist_geetest"), {
        payload,
      });
      if (ret.code == "OK") {
        yield put({
          type: "save",
          geetestData: ret.data,
        });
        onSuccess && onSuccess(ret.data);
      }
    },
  },

  reducers: {
    save(state, action) {
      // open_orders , history_orders,  history_trades 时，排重，排序
      if (
        action.payload["open_orders"] &&
        Object.prototype.toString.call(action.payload["open_orders"]) ===
          "[object Array]"
      ) {
        action.payload["open_orders"] = action.payload["open_orders"].sort(
          (a, b) => (a.time - b.time >= 0 ? -1 : 1)
        );
        action.payload["open_orders"] = helper.excludeRepeatArray(
          "orderId",
          action.payload["open_orders"]
        );
      }
      if (
        action.payload["history_orders"] &&
        Object.prototype.toString.call(action.payload["history_orders"]) ===
          "[object Array]"
      ) {
        action.payload["history_orders"] = action.payload[
          "history_orders"
        ].sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
        action.payload["history_orders"] = helper.excludeRepeatArray(
          "orderId",
          action.payload["history_orders"]
        );
      }
      if (
        action.payload["history_trades"] &&
        Object.prototype.toString.call(action.payload["history_trades"]) ===
          "[object Array]"
      ) {
        action.payload["history_trades"] = action.payload[
          "history_trades"
        ].sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
        action.payload["history_trades"] = helper.excludeRepeatArray(
          "tradeId",
          action.payload["history_trades"]
        );
      }
      return { ...state, ...action.payload };
    },

    // 订单订阅源数据
    new_order_source(state, action) {
      let new_order_source = helper.arrayClone(state.new_order_source);
      new_order_source.push(action.payload.data);
      return { ...state, new_order_source };
    },
    // 订单ws订阅, 批量处理订单变化
    // 新订单或订单变化
    // 订单可能完成成交，需要移到历史委托
    new_order(state, action) {
      const new_order_source = action.payload.new_order_source;
      let open_orders = helper.arrayClone(state.open_orders);
      let history_orders = helper.arrayClone(state.history_orders);
      // let order_notice = WSDATA.getData("order_notice");
      const l = new_order_source.length;
      if (!l) {
        return { ...state };
      }

      // 市价单,查询订单是否存在，否则直接扔历史委托；  ~~~~~ 20180911变更：市价单不在单独处理 ~~~~
      // if (type === "MARKET") {
      //   // 历史委托
      //   let history_orders = [].concat(state.history_orders);
      //   history_orders.unshift(new_order);
      //   return { ...state, history_orders };
      //   //return { ...state };
      // }
      // 限价单,市价单
      // status
      // 1、NEW 新订单,放入当前委托，
      // 2、PARTIALLY_FILLED 部分成交，更新当前委托里面的某条订单信息,如果当前委托没有此订单，直接插入历史委托
      // 3、FILLED 完全成交，提醒用户有成交，当前委托的中订单信息更新，并放入历史委托，如果当前委托没有，直接插入历史委托
      // 4、CANCELED 已撤销，点击撤销按钮时，已删除当前委托中的订单，直接插入历史委托即可
      // 1,2 排序规则：按time排序，如果不在列表里并且time大于最大的time那么unshift到list里，不在列表里并且小于最小的time不做处理，其余排序插入对应位置
      new_order_source.forEach((item, i) => {
        const status = item.status;

        let n = -1;
        open_orders.forEach((it, j) => {
          if (item.orderId === it.orderId) {
            n = j;
            return;
          }
        });

        // 新订单 or 部分成交
        if (status === "NEW" || status === "PARTIALLY_FILLED") {
          if (n === -1) {
            if (open_orders[0]) {
              if (item.time - open_orders[open_orders.length - 1]["time"] > 0) {
                open_orders.unshift(item);
              }
            } else {
              open_orders[0] = item;
            }
          } else {
            open_orders[n] = item;
          }
          return;
        }

        let m = -1;
        history_orders.forEach((it, k) => {
          if (it.orderId === item.orderId) {
            m = k;
            return;
          }
        });

        if (status === "FILLED" || status === "CANCELED") {
          if (status === "FILLED") {
            WSDATA.setData("order_notice", 1, false);
          }
          if (m === -1) {
            // 不在当前列表中，且时间大于最后一条
            if (history_orders[0]) {
              if (
                item.time - history_orders[history_orders.length - 1]["time"] >
                0
              ) {
                history_orders.unshift(item);
              }
            } else {
              history_orders[0] = item;
            }
          } else {
            history_orders[m] = item;
          }
          if (n > -1) {
            open_orders.splice(n, 1);
          }
        }
      });
      WSDATA.clear("new_order_source");
      open_orders.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      history_orders.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      return {
        ...state,
        open_orders: helper.excludeRepeatArray("orderId", open_orders),
        history_orders: helper.excludeRepeatArray("orderId", history_orders),
        new_order_source: [],
      };
    },
    // 订单ws订阅, 批量处理订单变化
    // 新订单或订单变化
    // 订单可能完成成交，需要移到历史委托
    plan_order(state, action) {
      const new_plan_order_source = action.payload.new_plan_order_source;
      let open_plan_orders = helper.arrayClone(state.open_plan_orders);
      let history_plan_orders = helper.arrayClone(state.history_plan_orders);
      const l = new_plan_order_source.length;
      if (!l) {
        return { ...state };
      }
      new_plan_order_source.forEach((item, i) => {
        const status = item.status;
        let n = -1;
        open_plan_orders.forEach((it, j) => {
          if (item.orderId === it.orderId) {
            n = j;
            return;
          }
        });
        // 新订单 or 部分成交
        if (status === "ORDER_NEW") {
          if (n === -1) {
            if (open_plan_orders[0]) {
              if (
                item.time -
                  open_plan_orders[open_plan_orders.length - 1]["time"] >
                0
              ) {
                open_plan_orders.unshift(item);
              }
            } else {
              open_plan_orders[0] = item;
            }
          } else {
            open_plan_orders[n] = item;
          }
          return;
        }

        let m = -1;
        history_plan_orders.forEach((it, k) => {
          if (it.orderId === item.orderId) {
            m = k;
            return;
          }
        });

        if (
          status === "ORDER_FILLED" ||
          status == "ORDER_REJECTED" ||
          status === "ORDER_CANCELED"
        ) {
          if (m === -1) {
            // 不在当前列表中，且时间大于最后一条
            if (history_plan_orders[0]) {
              if (
                item.time -
                  history_plan_orders[history_plan_orders.length - 1]["time"] >
                0
              ) {
                history_plan_orders.unshift(item);
              }
            } else {
              history_plan_orders[0] = item;
            }
          } else {
            history_plan_orders[m] = item;
          }
          if (n > -1) {
            open_plan_orders.splice(n, 1);
          }
        }
      });
      WSDATA.clear("new_plan_order_source");
      open_plan_orders.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      history_plan_orders.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      return {
        ...state,
        open_plan_orders: helper.excludeRepeatArray(
          "orderId",
          open_plan_orders
        ),
        history_plan_orders: helper.excludeRepeatArray(
          "orderId",
          history_plan_orders
        ),
        new_plan_order_source: [],
      };
    },
    // 订单请求,翻页加载 or 全量更新
    order_req(state, action) {
      const data = action.payload.data;
      const extData = action.payload.extData;
      let open_orders = helper.arrayClone(state.open_orders);
      let history_orders = helper.arrayClone(state.history_orders);
      const dataType = extData.dataType;
      let name = "open_orders_more";
      let result = data.length < state.TradingHistoryLimit ? false : true;
      // 第一页
      if (!extData.fromId) {
        if (dataType === "current_order") {
          open_orders = data;
        }
        if (dataType === "history_order") {
          history_orders = data;
          name = "history_orders_more";
        }
      } else {
        if (dataType === "current_order") {
          open_orders = open_orders.concat(data);
          open_orders.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
        }
        if (dataType === "history_order") {
          history_orders = history_orders.concat(data);
          history_orders.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
          name = "history_orders_more";
        }
      }
      return {
        ...state,
        open_orders: helper.excludeRepeatArray("orderId", open_orders),
        history_orders: helper.excludeRepeatArray("orderId", history_orders),
        ws_order_req: false,
        [name]: result,
      };
    },
    // 订阅ws订单成交,源数据
    history_trades_source(state, action) {
      let history_trades_source = helper.arrayClone(
        state.history_trades_source
      );
      history_trades_source.unshift(action.payload.data);
      return { ...state, history_trades_source };
    },
    // 更新订单成交信息
    history_trades(state, action) {
      let history_trades_source = action.payload.history_trades_source;
      history_trades_source = history_trades_source.concat(
        state.history_trades
      );
      history_trades_source.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      WSDATA.clear("history_trades_source");
      return {
        ...state,
        history_trades: helper.excludeRepeatArray(
          "tradeId",
          history_trades_source
        ),
      };
    },
    // 历史成交查询
    history_trades_req(state, action) {
      let history_trades = helper.arrayClone(state.history_trades);
      const extData = action.payload.extData;
      const data = action.payload.data;
      let result = data.length < state.TradingHistoryLimit ? false : true;
      if (!extData.fromId) {
        history_trades = data;
      } else {
        history_trades = history_trades.concat(data);
        history_trades.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      }
      return {
        ...state,
        history_trades: helper.excludeRepeatArray("tradeId", history_trades),
        ws_order_req: false,
        history_trades_more: result,
      };
    },
    // 资产订阅,源数据
    user_balance_source(state, action) {
      let user_balance_source = Object.assign({}, state.user_balance_source);
      let data = action.payload.data[0];
      user_balance_source[data["tokenId"]] = data;
      return { ...state, user_balance_source };
    },

    // 更新期权资产
    option_balance(state, action) {
      const option_balance_source = action.payload.option_balance_source;
      const option_tradeable_source = action.payload.option_tradeable_source;
      if (!Object.keys(option_balance_source).length) {
        return { ...state };
      }

      let option_asset_avas = helper.arrayClone(state.option_asset_avas);
      option_asset_avas.map((item, index) => {
        if (item.tokenId == option_balance_source.tokenId) {
          option_asset_avas[index] = option_balance_source;
        }
      });
      let option_tradeable = Object.assign({}, state.option_tradeable);
      if (
        option_tradeable_source &&
        Object.keys(option_tradeable_source).length
      ) {
        option_tradeable = Object.assign(
          option_tradeable,
          state.option_tradeable,
          option_tradeable_source
        );
      }
      return {
        ...state,
        option_asset_avas: option_asset_avas,
        option_tradeable,
      };
    },

    /**
     * 保存用户自定义配置
     * @param {*} state
     * @param {*} action
     */
    saveCustomConfig(state, { payload }) {
      if (payload.customConfig) {
        try {
          let customConfig = JSON.parse(payload.customConfig);
          return {
            ...state,
            customConfig,
          };
        } catch (e) {}
      }
      return state;
    },
  },
};
