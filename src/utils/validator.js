import CONST from "../config/const";
import math from "../utils/mathjs";

const MAX = 999999999;

function OrderException(message, value) {
  this.value = value;
  this.message = message;
}

const vaildator = {
  /**
   * isMobilePhone
   * @param {String} mobile 手机号
   * @param {String} locale 默认en-us
   * @return {Boolean} true/false
   */
  isMobilePhone: (str, locale = "en-us") => {
    const phones = {
      "zh-cn": /^(\+?0?86\-?)?1[345789]\d{9}$/,
      "zh-tw": /^(\+?886\-?|0)?9\d{8}$/,
      "en-za": /^(\+?27|0)\d{9}$/,
      "en-au": /^(\+?61|0)4\d{8}$/,
      "en-hk": /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
      "fr-fr": /^(\+?33|0)[67]\d{8}$/,
      "pt-pt": /^(\+351)?9[1236]\d{7}$/,
      "el-gr": /^(\+30)?((2\d{9})|(69\d{8}))$/,
      "en-gb": /^(\+?44|0)7\d{9}$/,
      "en-us": /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
      "en-zm": /^(\+26)?09[567]\d{7}$/,
      "ru-ru": /^(\+?7|8)?9\d{9}$/,
      "nb-no": /^(\+?47)?[49]\d{7}$/,
      "nn-no": /^(\+?47)?[49]\d{7}$/,
    };
    if (locale in phones) {
      return phones[locale].test(str);
    }
    return false;
  },
  /**
   * isEmail
   * @param {String} email 邮箱
   * @return {Boolean} true/false
   */
  isEmail: (email) => {
    const regexp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regexp.test(email);
  },
  /**
   * isCreditCard
   * @param {Number} creditCard 信用卡卡号
   * @return {Boolean} true/false
   */
  isCreditCard: (creditCard) => {
    const regexp = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    const sanitized = creditCard.replace(/[^0-9]+/g, "");
    if (!regexp.test(sanitized)) {
      return false;
    }
    let sum = 0,
      digit,
      tmpNum,
      shouldDouble;
    for (let i = sanitized.length - 1; i >= 0; i--) {
      digit = sanitized.substring(i, i + 1);
      tmpNum = parseInt(digit, 10);
      if (shouldDouble) {
        tmpNum *= 2;
        if (tmpNum >= 10) {
          sum += (tmpNum % 10) + 1;
        } else {
          sum += tmpNum;
        }
      } else {
        sum += tmpNum;
      }
      shouldDouble = !shouldDouble;
    }
    return !!(sum % 10 === 0 ? sanitized : false);
  },
  /**
   * isNumeric 是否为数字
   * @param {Number} num
   */
  isNumeric: (num) => {
    return /^[-+]?[0-9]+$/.test(num);
  },
  /**
   * isInt 是否为整数
   * @param {Number} num
   */
  isInt: (num) => {
    return /^(?:[-+]?(?:0|[1-9][0-9]*))$/.test(num);
  },
  /**
   * isFloat 是否为浮点数
   * @param {Number} num
   */
  isFloat: (num) => {
    if (num === "" || num === ".") {
      return false;
    }
    // /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/
    return /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/.test(
      num
    );
  },
  /**
   * isIp
   */
  isIp: (str) => {
    if (str === "") {
      return false;
    }
    return /^((25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(25[0-5]|2[0-4]\d|1?\d?\d)$/.test(
      str
    );
  },

  // 精度是否相等
  // d 100,10,1,0,0.1,0.01
  equalDigit(v, d) {
    if (!v && v !== 0) return false;
    if (!d && d !== 0) return false;
    let s = `${v}`.split(".");
    s = s[1] || "";
    if (d - 1 >= 0 || d == 0) {
      if (s.length > 0 || v < d) {
        return false;
      } else {
        return true;
      }
    }
    if (s.length > CONST["depth"][d]) return false;
    return true;
  },
  // 是否为精度整倍数
  // d  100，10，1，0.1，0.01，0.001
  multipleDigit(v, d) {
    if (!v && v !== 0) return false;
    if (!d && d !== 0) return false;
    const r = math
      .chain(math.bignumber(v))
      .divide(d)
      .format({ notation: "fixed" })
      .done();
    if (!this.isInt(r)) {
      return false;
    }
    return true;
  },

  /**
   * 检验订单信息是否合法
   * 
   * 限价买
   * 价格：精度(min_price_precision)，可输入最大值(99,999,999)
   * 数量：精度(base_precision)及精度倍数，最小值(min_trade_quantity)
   * 金额：无

   * 限价卖
   * 价格：精度(min_price_precision)，可输入最大值(99,999,999)
   * 数量：精度(base_precision)及精度倍数，最小值(min_trade_quantity)
   * 金额：无

   * 市价买
   * 金额：最小值(min_trade_amount)，精度(quote_precision)及精度倍数

   * 市价卖
   * 数量：精度(base_precision)及精度倍数，最小值(min_trade_quantity)
   */
  isValidOrder(orderInfo, rules) {
    const {
      order_type,
      order_side,
      buy_price,
      sale_price,
      buy_quantity,
      sale_quantity,
      trigger_price,
    } = orderInfo;
    if (!trigger_price) {
      throw new OrderException("触发价不正确");
    }
    if (order_type == CONST.ORDER_TYPE.LIMIT) {
      // 最小交易价格、最小交易数量 不存在：拒绝交易
      if (order_side === "BUY") {
        // 价格不存在或=0
        if (!Number(buy_price)) {
          throw new OrderException("买入价格不正确");
        }
        // 价格小于最小值
        if (Number(buy_price) < Number(rules.min_price_precision)) {
          window.console.error(
            "价格小于最小值",
            buy_price,
            rules.min_price_precision
          );
          throw new OrderException(
            "买入价格不能小于",
            rules.min_price_precision
          );
        }
        // 价格大于最大值
        if (Number(buy_price) > Number(MAX)) {
          window.console.error("价格大于最大值", buy_price, MAX);
          throw new OrderException("买入价格不能大于", MAX);
        }
        // 价格精度不正确
        if (!this.equalDigit(Number(buy_price), rules.min_price_precision)) {
          window.console.error(
            "价格精度不正确",
            buy_price,
            rules.min_price_precision
          );
          throw new OrderException("买入价格精度不正确");
        }
        // 数量不存在
        if (!Number(buy_quantity)) {
          window.console.error("数量不存在", buy_quantity);
          throw new OrderException("买入数量不正确");
        }
        // 数量精度不正确
        if (
          !this.equalDigit(
            Number(buy_quantity),
            math
              .chain(math.pow(10, math.bignumber(-rules.base_precision)))
              .format({ notation: "fixed" })
              .done()
          ) ||
          !this.multipleDigit(
            Number(buy_quantity),
            math
              .chain(math.pow(10, math.bignumber(-rules.base_precision)))
              .format({ notation: "fixed" })
              .done()
          )
        ) {
          window.console.error(
            "数量精度不正确",
            buy_quantity,
            rules.base_precision
          );
          throw new OrderException("买入数量精度不正确");
        }
        // 数量小于最小值
        if (Number(buy_quantity) < Number(rules.min_trade_quantity)) {
          window.console.error(
            "数量小于最小值",
            buy_quantity,
            rules.min_trade_quantity
          );
          throw new OrderException(
            "买入数量不能小于",
            rules.min_trade_quantity
          );
        }
        // 数量大于最大值
        if (Number(buy_quantity) > MAX) {
          window.console.error("数量大于最大值", buy_quantity, MAX);
          throw new OrderException("买入数量不能大于", MAX);
        }
        // 数量大于buy_max
        if (Number(buy_quantity) > rules.buy_max) {
          window.console.error(
            "数量大于买入最大值",
            buy_quantity,
            rules.buy_max
          );
          throw new OrderException("买入数量超出余额");
        }
      } else if (order_side === "SELL") {
        // 价格不存在或=0
        if (!Number(orderInfo.sale_price)) {
          throw new OrderException("卖出价格不正确");
        }
        // 价格小于最小值
        if (Number(orderInfo.sale_price) < Number(rules.min_price_precision)) {
          window.console.error(
            "价格小于最小值",
            orderInfo.sale_price,
            rules.min_price_precision
          );
          throw new OrderException(
            "卖出价格不能小于",
            rules.min_price_precision
          );
        }
        // 价格大于最大值
        if (Number(orderInfo.sale_price) > MAX) {
          window.console.error("价格大于最大值", orderInfo.sale_price, MAX);
          throw new OrderException("卖出价格不能大于", MAX);
        }
        // 价格精度不正确
        if (
          !this.equalDigit(
            Number(orderInfo.sale_price),
            rules.min_price_precision
          )
        ) {
          window.console.error(
            "价格精度不正确",
            orderInfo.sale_price,
            rules.min_price_precision
          );
          throw new OrderException("卖出价格精度不正确");
        }
        // 卖出数量不存在
        if (!Number(sale_quantity)) {
          window.console.error("卖出数量不存在", sale_quantity);
          throw new OrderException("卖出数量不正确");
        }
        // 卖出数量小于最小值
        if (Number(sale_quantity) < Number(rules.min_trade_quantity)) {
          window.console.error(
            "卖出数量小于最小值",
            sale_quantity,
            rules.min_trade_quantity
          );
          throw new OrderException(
            "卖出数量不能小于",
            rules.min_trade_quantity
          );
        }
        // 卖出数量大于最大值
        if (Number(sale_quantity) > MAX) {
          window.console.error("卖出数量大于最大值", sale_quantity, MAX);
          throw new OrderException("卖出数量不能大于", MAX);
        }
        // 卖出数量大于金额
        if (Number(sale_quantity) > Number(rules.token1_quantity)) {
          window.console.error(
            "卖出数量超出余额",
            sale_quantity,
            rules.token1_quantity
          );
          throw new OrderException("卖出数量超出余额");
        }
        // 数量精度不正确, 非整倍数
        if (
          !this.equalDigit(
            Number(sale_quantity),
            math
              .chain(math.pow(10, math.bignumber(-rules.base_precision)))
              .format({ notation: "fixed" })
              .done()
          ) ||
          !this.multipleDigit(
            Number(sale_quantity),
            math
              .chain(math.pow(10, math.bignumber(-rules.base_precision)))
              .format({ notation: "fixed" })
              .done()
          )
        ) {
          window.console.error(
            "卖出数量精度不正确",
            sale_quantity,
            rules.base_precision
          );
          throw new OrderException("卖出数量精度不正确");
        }
      }
    } else if (order_type == CONST.ORDER_TYPE.MARKET) {
      if (order_side == "BUY") {
        // 数量不存在
        if (!Number(buy_quantity)) {
          window.console.error("数量不存在", buy_quantity);
          throw new OrderException("买入数量不正确");
        }
      }else if (order_side == "SELL") {
        // 数量不存在
        if (!Number(sale_quantity)) {
          window.console.error("数量不存在", sale_quantity);
          throw new OrderException("卖出数量不正确");
        }
        // 卖出数量小于最小值
        if (Number(sale_quantity) < Number(rules.min_trade_quantity)) {
          window.console.error(
            "卖出数量小于最小值",
            sale_quantity,
            rules.min_trade_quantity
          );
          throw new OrderException(
            "卖出数量不能小于",
            rules.min_trade_quantity
          );
        }
      }
    }
    return true;
  },
};

export default vaildator;
