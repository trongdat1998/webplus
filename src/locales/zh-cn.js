import appLocaleData from "react-intl/locale-data/zh";
// 引入组件的多语言
import componentsMsg from "../lib/locales/zh-cn.message";

window.appLocale = {
  // 合并所有 messages, 加入组件的 messages
  messages: Object.assign({}, componentsMsg, window.WEB_LOCALES_ALL || {}),

  // locale
  locale: "zh-cn",

  // react-intl locale-data
  data: appLocaleData,

  // 自定义 formates
  formats: {
    // 日期、时间
    date: {
      normal: {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      },
    },
    // 货币
    money: {
      currency: "CNY",
    },
  },
};

export default window.appLocale;
