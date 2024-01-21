import getData from "../services/getData";
import { message } from "../lib";
import helper from "../utils/helper";
import math from "../utils/mathjs";
import cookie from "../utils/cookie";
import CONSTS from "../config/const";

// 闪兑的model
// USDT 兑 HBC

export default {
  namespace: "convert",
  state: {
    purchaseTokenList: [], // 申购币种 usdt
    purchaseTokenMap: {},
    offeringsTokenList: [], // 发售币种 hbc
    offeringsTokenMap: {},
    symbolMap: {}, // 币对
    tokenId: "",
    available: 0,

    orders: [],
    ordersHasMore: true,
    ordersLoading: false,
    lastOrderId: 0,
  },
  subscriptions: {
    init({ dispatch, history }) {
      dispatch({
        type: "getConvertSymbols",
      });
    },
  },

  effects: {
    *getConvertSymbols({ payload }, { call, put, select }) {
      const tokens = yield select((state) => state.layout.config.tokens);
      const ret = yield call(getData("get_convert_symbols"), {
        method: "get",
        payload: {},
      });
      if (ret.code == "OK") {
        let purchaseTokens = ret.data.purchaseTokenIds.map((item) => {
          let token = tokens[item];
          if (token) {
            return {
              iconUrl: token.iconUrl,
              tokenFullName: token.tokenFullName,
              tokenId: token.tokenId,
              tokenName: token.tokenName,
            };
          }
        });

        let offeringsTokens = ret.data.offeringsTokenIds.map((item) => {
          let token = tokens[item];
          if (token) {
            return {
              iconUrl: token.iconUrl,
              tokenFullName: token.tokenFullName,
              tokenId: token.tokenId,
              tokenName: token.tokenName,
            };
          }
        });

        let purchaseTokenMap = {};
        // 组装币对列表关系
        ret.data.purchaseTokenIds.forEach((item) => {
          purchaseTokenMap[item] = purchaseTokenMap[item] || [];
          ret.data.symbols.forEach((symbol) => {
            if (symbol.purchaseTokenId == item) {
              let token = tokens[symbol.offeringsTokenId];
              if (token) {
                purchaseTokenMap[item].push({
                  iconUrl: token.iconUrl,
                  tokenFullName: token.tokenFullName,
                  tokenId: token.tokenId,
                  tokenName: token.tokenName,
                });
              }
            }
          });
        });

        let offeringsTokenMap = {};
        ret.data.offeringsTokenIds.forEach((item) => {
          offeringsTokenMap[item] = offeringsTokenMap[item] || [];
          ret.data.symbols.forEach((symbol) => {
            if (symbol.offeringsTokenId == item) {
              let token = tokens[symbol.purchaseTokenId];
              if (token) {
                offeringsTokenMap[item].push({
                  iconUrl: token.iconUrl,
                  tokenFullName: token.tokenFullName,
                  tokenId: token.tokenId,
                  tokenName: token.tokenName,
                });
              }
            }
          });
        });

        let symbolMap = {};
        ret.data.symbols.forEach((item) => {
          symbolMap[`${item.offeringsTokenId}${item.purchaseTokenId}`] = item;
        });
        yield put({
          type: "save",
          payload: {
            purchaseTokenList: purchaseTokens,
            purchaseTokenMap,
            offeringsTokenList: offeringsTokens,
            offeringsTokenMap,
            symbolMap,
          },
        });
      }
    },

    *getSymbolPrice({ payload, callback, errorCallback }, { call, put }) {
      const ret = yield call(getData("get_symbol_price"), {
        method: "get",
        payload,
      });
      if (ret.code == "OK") {
        callback(ret.data);
      } else {
        errorCallback();
      }
    },

    *createConvertOrder({ payload, callback }, { call, put }) {
      const ret = yield call(getData("create_convert_order"), {
        payload,
      });
      if (ret.code == "OK") {
        message.success(window.appLocale.messages["兑换成功"]);
        yield put({
          type: "getAvailable",
          payload: {},
        });
        return "success";
      } else {
        message.error(ret.msg);
      }
    },

    *getConvertOrders({ payload }, { call, put, select }) {
      let { orders, ordersHasMore, ordersLoading, lastOrderId } = yield select(
        (state) => state.convert
      );
      if (ordersLoading) {
        return;
      }
      if (!ordersHasMore) {
        return;
      }
      yield put({
        type: "save",
        payload: {
          ordersLoading: true,
        },
      });
      const ret = yield call(getData("query_convert_order"), {
        payload: {
          ...payload,
          from_order_id: lastOrderId,
          limit: CONSTS.rowsPerPage1,
        },
      });
      if (ret.code == "OK") {
        orders = orders.concat(ret.data);
        if (ret.data.length < CONSTS.rowsPerPage) {
          ordersHasMore = false;
        }
        yield put({
          type: "save",
          payload: {
            orders,
            ordersHasMore,
            lastOrderId: ret.data[ret.data.length - 1] && ret.data[ret.data.length - 1].orderId,
            ordersLoading: false,
          },
        });
      }
    },

    // 请求币种余额
    *getAvailable({ payload }, { call, put, select }) {
      if (!cookie.read("account_id")) {
        return;
      }
      const { tokenId } = yield select((state) => state.convert);
      const result = yield call(getData("get_asset"), {
        payload: {
          token_ids: payload && payload.token_id ? payload.token_id : tokenId,
        },
      });
      if (result.code === "OK") {
        let asset = result.data[0];
        if (asset) {
          let available = asset.free;
          yield put({
            type: "save",
            payload: {
              tokenId: asset.tokenId,
              available: available,
            },
          });
        } else {
          yield put({
            type: "save",
            payload: {
              tokenId: payload && payload.token_id ? payload.token_id : tokenId,
              available: 0,
            },
          });
        }
      } else if (result.code === 30000) {
        message.error(result.msg);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateAvailable(state, { payload }) {
      let { tokenId, available } = state;
      const changed = payload.changed;
      changed.forEach((item) => {
        if (item.tokenId == tokenId) {
          available = item.free;
        }
      });
      return {
        ...state,
        tokenId,
        available,
      };
    },
  },
};
