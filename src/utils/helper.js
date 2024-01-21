import _ from "lodash";
import math from "./mathjs";
import cookie from "./cookie";
const obj = {
  /**
   * @desc 'en-us', 'zh-cn', 'zh-hk', 'ko-kr', 'ja-jp', 'ru-ru', 'de-de','es-es','fr-fr','th-th','vi-vi','tr-tr'
   * @returns {string} browser language
   */
  browserLang: () => {
    const ls = navigator.languages ? navigator.languages.length : 0;
    let res = (ls
      ? navigator.languages[0]
      : navigator.language || navigator.userLanguage
    ).toLowerCase();
    // es, es-us, es-mx,es-gt等等西班牙语，统一使用 es
    if (/^es-?/.test(res)) {
      res = "es-es";
    }
    return res;
  },

  delay: function (timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  },
  /**
   * bex颜色转为rgba
   * @param String #ff00ff #f0f
   * @param Number a 0-1
   * @return String rgba(r,g,b,a)
   */
  hex_to_rgba: (hex, a) => {
    if (!hex || hex.indexOf("#") == -1) {
      return "rgba(0,0,0,0)";
    }
    if (hex.length != 7 && hex.length != 4) {
      console.error(`${hex} is not hex color`);
      return "rgba(0,0,0,0)";
    }
    let s = hex.replace("#", "").match(/^(..?)(..?)(..?)/);
    return `rgba(${parseInt(
      "0x" + s[1] + (s[1].length == 1 ? s[1] : "")
    )},${parseInt("0x" + s[2] + (s[2].length == 1 ? s[2] : ""))},${parseInt(
      "0x" + s[3] + (s[3].length == 1 ? s[3] : "")
    )},${Number(a) || 1})`;
  },

  trim(str) {
    return (str || "").replace(/^\s+|\s+$/g, "");
  },
  // 去除表情
  removeEmoji(content) {
    return content.replace(
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
      ""
    );
  },
  /**
   * 数组排重
   * @param key 根据key进行排重
   * @param ar  数组
   * @param time 如果重复，根据time进行保留最新
   */
  excludeRepeatArray(key, ar, time) {
    let obj = {};
    if (!key || !ar || Object.prototype.toString.call(ar) !== "[object Array]")
      return;
    ar.map((item) => {
      if (obj[item[key]]) {
        // 如果重复，保留time最新的数据
        if (time && item[time] - obj[item[key]][time] >= 0) {
          obj[item[key]] = item;
        }
      } else {
        obj[item[key]] = item;
      }
    });
    let newar = [];
    for (let k in obj) {
      newar.push(obj[k]);
    }
    return newar;
  },
  /**
   * 法币估值
   * 计算公式= rates[token][moneys[choose][1]]*value
   * @param {object} rates 所有汇率 { BTC:{ BTC:1, CNY: 4000, USD: 3000} }
   * @param {number} value token的值, 如 33.2
   * @param {string} token tokenId, 如BTC，ETH
   * @param {string} choose 转换成何种法币，如 en-us, zh-cn， 默认en-us
   * @param {bool} suffix 是否返回后货币符号，默认false返回如[¥, 100]，为true时返回如[CNY, 100]
   * @return {array} [法币标志,法币估值], 如 ['usd',2323.231] , 法币估值保留2位小数，如果小于0.01，保留5位小数, 如果估值为负数, value返回'--';
   */
  currencyValue(
    rates,
    value,
    token,
    choose = window.localStorage.unit,
    suffix = false
  ) {
    const money = window.WEB_CONFIG.supportLanguages;
    if (
      !rates ||
      !money ||
      !money.length ||
      (!value && value !== 0) ||
      !token ||
      !rates[token]
    ) {
      return suffix ? ["", "--", ""] : ["", "--"];
    }
    let moneys = {};
    money.map((item) => {
      moneys[item.lang.toLowerCase()] = [item.prefix, item.suffix];
    });
    // 要获取的法币是否有汇率，如果没有，默认获取en-us
    const realChoose = moneys[choose] && moneys[choose][0] ? choose : "en-us";
    if (!moneys[realChoose]) {
      return suffix ? ["", "--", ""] : ["", "--"];
    }
    const name = moneys[realChoose][0];
    const endName = moneys[realChoose][1];
    let v = rates[token.toUpperCase()][moneys[realChoose][1]];
    //选择币对的汇率不存在
    if (!v) {
      return suffix ? [name, "--", endName] : [name, "--"];
    }
    v = math
      .chain(v)
      .multiply(Number(value) || 0)
      .format({ notation: "fixed" })
      .done();
    const fix = v - 0.1 < 0 && Number(v) !== 0 ? 5 : 2;
    v = this.digits(v, fix);
    if (Number(v) < 0) {
      v = "--";
    } else {
      v = this.format(v, fix);
    }
    return suffix ? [name, v, endName] : [name, v];
  },

  /**
   * 估值单位转换 比如将USDT转化为BTC 用来处理极端情况下，btc估值为0，但是usdt估值不为0的情况
   * 会损失一定的精度
   * @param {object} rates 所有汇率 { BTC:{ BTC:1, CNY: 4000, USD: 3000} }
   * @param {number} value token的值, 如 33.2
   * @param {string} sourceToken 转换前tokenId, 如BTC，ETH
   * @param {string} targetToken 转换后tokenId, 如BTC，ETH
   */
  convertValuationUnit(rates, value, sourceToken, targetToken) {
    let convertRate = rates[sourceToken][targetToken];
    let v = math
      .chain(value)
      .multiply(Number(convertRate) || 0)
      .format({ notation: "fixed" })
      .done();
    return v;
  },
  arrayClone(ar = []) {
    let a = [];
    ar.forEach((item) => {
      const type = Object.prototype.toString.call(item);
      if (type === "[object Object]") {
        a.push(Object.assign({}, item));
      } else if (type === "[object Array]") {
        a.push(this.arrayClone(item));
      } else {
        a.push(item);
      }
    });
    return a;
  },
  /**
   * 数字格式化
   * @param {Number} n 待格式的数字
   * @param {Number} f 保留小数位数，0=不展示小数位，默认0
   */
  format(n, f) {
    n = Number(n);
    if (!Number.isFinite(n)) return null;
    let s = n;
    s = `${s}`.split(".");
    s[0] = s[0]
      .split("")
      .reverse()
      .join("")
      .replace(/(\d{3})/g, function ($1) {
        return $1 + ",";
      })
      .replace(/\,$/, "")
      .split("")
      .reverse()
      .join("");
    s[1] = s[1] ? s[1] : 0;
    if (Number.isFinite(f)) {
      s[1] = (s[1]
        ? s[1] + "000000000000000000000"
        : "000000000000000000000"
      ).split("");
      s[1].length = Math.max(0, Math.min(Math.floor(f), 16));
      if (f < 1 || f > 16) {
        //window.console.log("f is to small or big~~~");
      }
      s[1] = s[1].join("");
      return f < 1 || f > 16 ? s[0] : s[0] + "." + s[1];
    } else {
      return s[1] ? s[0] + "." + s[1] : s[0];
    }
  },
  /**
   * 数字小数位截取
   * 精度以外全部舍弃
   * d -3,-2,-1,0,1,2,3,4
   */
  digits(v, d = 0) {
    let a = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    if (!v && v !== 0) {
      if (!d) return v;
      a.length = d;
      return "0." + a.join("");
    }
    if (d === 0 || d === "0" || !d || !Number(d)) {
      return Math.floor(v);
    }
    // 整数截取
    if (d <= 0) {
      let r = math
        .chain(v)
        .multiply(
          math
            .chain(math.pow(10, math.bignumber(d)))
            .format({ notation: "fixed" })
            .done()
        )
        .format({ notation: "fixed" })
        .done();
      r = Math.floor(r);
      r = math
        .chain(r)
        .divide(
          math
            .chain(math.pow(10, math.bignumber(d)))
            .format({ notation: "fixed" })
            .done()
        )
        .format({ notation: "fixed" })
        .done();
      return r;
    }
    let s = v;
    let c = `${s}`.split(".");
    if (!c[1]) {
      c[1] = "";
    }
    if (c[1].length == d) {
      return s;
    }
    if (c[1].length < d) {
      a.length = d - c[1].length;
      return c[1] ? s + a.join("") : a.length ? s + "." + a.join("") : s;
    }
    if (c[1].length > d) {
      c[1] = c[1].split("");
      c[1].length = d;
      return c[0] + "." + c[1].join("");
    }
    return v;
  },
  /**
   * 精度截取，精度以外的值按照，0舍去，> 0 向上进一位
   * 12.10 -> 12.1
   * 12.11 -> 12.2
   * @param {Number} value
   * @param {Number} 位数
   */
  digits2(v, d = 0) {
    if (!v && v !== 0) {
      return this.digits(v, d);
    }
    if (!d || d === "0" || !d || !Number(d)) {
      return Math.ceil(Number(v));
    }
    let n = Number(d);
    let s = math
      .chain(math.bignumber(Number(v)))
      .multiply(
        math
          .chain(math.pow(10, math.bignumber(d)))
          .format({ notation: "fixed" })
          .done()
      )
      .format({ notation: "fixed" })
      .done();
    s = Math.ceil(Number(s));
    s = math
      .chain(math.bignumber(Number(s)))
      .divide(
        math
          .chain(math.pow(10, math.bignumber(d)))
          .format({ notation: "fixed" })
          .done()
      )
      .format({ notation: "fixed" })
      .done();
    if (d <= 0) {
      return s;
    }
    return this.digits(s, n);
  },
  /**
   * 匹配url中的参数
   */
  matchUrl(name) {
    var reg = new RegExp("(^|&)" + name + "=(.*?)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  //文档内容实际高度
  getScrollHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  },
  //窗口滚动条高度
  getScrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop;
  },
  // 窗口可视范围的高度
  getClientHeight() {
    let clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight =
        document.body.clientHeight < document.documentElement.clientHeight
          ? document.body.clientHeight
          : document.documentElement.clientHeight;
    } else {
      clientHeight =
        document.body.clientHeight > document.documentElement.clientHeight
          ? document.body.clientHeight
          : document.documentElement.clientHeight;
    }
    return clientHeight;
  },
  isScrollBottom() {
    return (
      this.getScrollHeight() - this.getScrollTop() - this.getClientHeight() < 10
    );
  },
  countClip(count) {
    count = Number(count);
    let result = count;
    let unit = "";
    if (window.localStorage.lang === "zh-cn") {
      if (count >= 10000 && count < 100000000) {
        result = Math.floor(count / 10000);
        unit = result === count / 10000 ? "万" : "万+";
      } else if (count >= 100000000 && count < 1000000000000) {
        result = Math.floor(count / 100000000);
        unit = result === count / 100000000 ? "亿" : "亿+";
      } else if (count >= 1000000000000) {
        result = Math.floor(count / 100000000);
        unit = "亿+";
      }
      return result + unit;
    } else {
      if (count >= 10000 && count < 1000000) {
        result = Math.floor(count / 1000);
        unit = result === count / 1000 ? "k" : "k+";
      } else if (count >= 1000000 && count < 1000000000) {
        result = Math.floor(count / 1000000);
        unit = result === count / 1000000 ? "m" : "m+";
      } else if (count >= 1000000000 && count < 1000000000000) {
        result = Math.floor(count / 1000000000);
        unit = result === count / 1000000000 ? "b" : "b+";
      } else if (count >= 1000000000000) {
        result = Math.floor(count / 1000000000);
        unit = "b+";
      }
      return result + unit;
    }
  },
  // 字符串重组
  dataReform(str) {
    var result = "";
    var c;
    for (var i = 0; i < str.length; i++) {
      c = str.substr(i, 1);
      if (c == "\n") result = result + "</br>";
      else if (c == " " || c == "\\s") result = result + " ";
      else if (c != "\r") result = result + c;
    }
    return result;
  },
  // 区分中英文截取规定长度字符串
  limitText(message, MaxLenght) {
    var strlenght = 0; //初始定义长度为0
    // var txtval = message.trim();
    var txtval = message;
    var newStr = "";
    for (var i = 0; i < txtval.length; i++) {
      if (this.isCN(txtval.charAt(i))) {
        if (strlenght + 2 <= MaxLenght) {
          strlenght = strlenght + 2; //中文为2个字符
          newStr += txtval.charAt(i);
        }
      } else {
        if (strlenght + 1 <= MaxLenght) {
          strlenght = strlenght + 1; //英文一个字符
          newStr += txtval.charAt(i);
        }
      }
    }
    return {
      text: newStr,
      length: strlenght,
    };
  },
  isCN(str) {
    //判断是不是中文
    return str.match(/[^\x00-\xff]/gi);
  },
  handleChar(str) {
    str.replace(/<script>|<\/script>/gi, "");
    str = str.replace(/&lt;/gi, "<");
    str = str.replace(/&gt;/gi, ">");
    str = str.replace(/&quot;/gi, '"');
    str = str.replace(/&amp;/gi, "&");
    str = str.replace(/&#39;/gi, "'");
    return str;
  },
  /**
   * 判断url是否为当前域
   * @param {string} url
   */
  sameDomain(url) {
    if (!url) {
      return false;
    }
    const host = window.location.hostname
      .replace("www.", "")
      .replace("www", "");
    const _url = decodeURIComponent(`${url}`)
      .replace("www.", "")
      .replace("www", "");
    let r = false;
    if (host.indexOf(_url) > -1 || _url.indexOf(host) > -1) {
      r = true;
    }
    return r;
  },
  /**
   * 回调地址过滤
   * 1、非当前域地址，返回当前域首页
   * 2、回调为空，返回当前域首页
   * @param {string} _url 回调地址
   * @return {string} url
   */
  filterRedirect(_url) {
    const host = window.location.host.toLowerCase();
    const protorl = window.location.protocol;
    const url = decodeURIComponent(_url || "").toLowerCase();
    // url不存在，非http,https开头
    if (!url || !/^https?\:\/\//i.test(url)) {
      return protorl + "//" + host;
    }
    let url_host = url.replace(/^https?\:\/\//i, "").split("/");
    if (url_host[0] != host) {
      return protorl + "//" + host;
    }
    return _url;
  },
  isMobile() {
    return /iphone|android/i.test(window.navigator.userAgent);
  },
  /**
   * 是否跳转m站
   */
  changeVersion() {
    // 搜索引擎
    const spider = /googlebot|spider|bingbot|YandexBot|LinkpadBot|MJ12bot|HeadlessChrome/i.test(
      window.navigator.userAgent
    );
    if (spider) {
      return false;
    }
    // mobile
    // 未主动选择pc版
    if (this.isMobile() && !window.localStorage.keepWeb) {
      return true;
    }
    return false;
  },
  deadlineFormat(t) {
    const n = Number(t);
    if (!n) {
      return ["0", "00", "00", "00"];
    }
    const d = Math.floor(n / (24 * 60 * 60 * 1000));
    const h = Math.floor((t - d * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
    const m = Math.floor(
      (t - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000) / (60 * 1000)
    );
    const s = Math.floor(
      (t - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000 - m * 60 * 1000) / 1000
    );
    return [d, this.textFormat(h), this.textFormat(m), this.textFormat(s)];
  },
  textFormat(i) {
    return i > 9 ? i : "0" + i;
  },

  // 设置语言
  set_lang_unit: (lang, unit) => {
    const default_langs = {
      "en-us": "en-us",
      "zh-cn": "zh-cn",
    };
    const default_lang = default_langs[obj.browserLang()] || "en-us";
    let _langList = [];
    // var _langIcon = {};
    let _langText = {};
    for (let i = 0, l = window.WEB_CONFIG.supportLanguages.length; i < l; i++) {
      _langList.push(
        window.WEB_CONFIG.supportLanguages[i]["lang"].toLowerCase()
      );
      _langText[window.WEB_CONFIG.supportLanguages[i]["lang"].toLowerCase()] =
        window.WEB_CONFIG.supportLanguages[i]["text"];
    }
    let _lang =
        lang ||
        cookie.read("locale") ||
        (localStorage.lang
          ? localStorage.lang.toLowerCase()
          : obj.browserLang()),
      _langDefault = _langList[0] ? _langList[0] : default_lang;
    // 不在语言列表,默认为en-us;
    if (!_lang || _langList.indexOf(_lang) === -1) {
      _lang = _langDefault;
    }
    let _unit = unit;
    // unit存在，并且不在语言列表
    if (unit && _langList.indexOf(unit) == -1) {
      _unit = _lang;
    }

    localStorage.lang = _lang; // 选择的语言
    localStorage.unit = _unit; // 法币单位
    localStorage.lang_text = _langText[_lang];
    var tmp = location.hostname.split(".");
    cookie.write({
      name: "locale",
      value: _lang,
      domain: location.hostname.replace(tmp.shift() + ".", ""),
    });
  },
  // 红涨绿跌
  set_up_down: (n) => {
    if (
      Number(n) == 0 ||
      !window.palette ||
      !window.palette.up ||
      !window.palette.down
    ) {
      return;
    }
    if (Number(n) == 1) {
      window.localStorage.up_down = n;
      let tmp = { ...window.palette.up };
      window.palette.up = { ...window.palette.down };
      window.palette.down = tmp;
    }
  },
  /**
   * 处理精度
   * 如果输入的数量的小数位个数 小于 digits，不处理
   * 如果输入的数量的小数位个数 大于 digits，按digits进行截位
   * @param {String} v v=number时，传入999. , 返回的数值会被忽略.
   * @param {Number} digits   -10,-1,1,2,3,4
   */
  fixDigits(v, digits) {
    if (!digits) {
      return v ? Math.floor(v) : v;
    }
    if (!v && v !== 0) return v;
    if (digits <= 0) {
      return Math.floor(v);
    }
    let string_v = `${v}`;
    let d = string_v.split(".");
    if (!d[1] || d[1].length <= digits) {
      return string_v;
    }
    d[1] = d[1].split("");
    d[1].length = digits;
    d[1] = d[1].join("");
    return d[0] + "." + d[1];
  },
};

export default obj;
