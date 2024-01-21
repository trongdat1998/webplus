import "react-app-polyfill/ie11";
import "intl-polyfill";
import React from "react";
import dva from "dva";
import { IntlProvider, addLocaleData } from "react-intl";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import createLoading from "dva-loading";
import cookie from "./utils/cookie";
import getData from "./services/getData";
import CONST from "./config/const";
import helper from "./utils/helper";

import "./roboto.module.css";
import "./index.module.css";

// models
import Layout from "./models/layout";
// routes
import Routes from "./router";

//import sw from './registerServiceWorker';
// import { message } from "./lib/index";
/**
 * 获取国际化资源文件
 *
 * @param {any} lang
 * @returns
 */
async function getLocale(lang, cb) {
  let jsLoadUrls = [];
  window.WEB_CONFIG.supportLanguages &&
    window.WEB_CONFIG.supportLanguages.map((el) => {
      if (el.lang == lang) {
        jsLoadUrls = el.jsLoadUrls || [];
      }
    });
  if (!jsLoadUrls.length) {
    window.WEB_LOCALES_ALL = {};
    getLocaleCb(lang, cb);
    return;
  }
  let c = 0;
  function loadall() {
    c = 1 + c;
    if (c == jsLoadUrls.length) {
      window.WEB_LOCALES_ALL = {
        ...(window.WEB_LOCALES || {}),
        ...(window.WEB_LOCALES_USER || {}),
      };
      getLocaleCb(lang, cb);
    }
  }
  function load(src) {
    const script = document.createElement("script");
    script.onload = function () {
      loadall();
    };
    script.onerror = function () {
      loadall();
    };
    script.src = src;
    window.document
      .querySelector("script")
      .parentNode.insertBefore(script, window.document.querySelector("script"));
  }
  jsLoadUrls.map((item) => {
    load(item);
  });
}
async function getLocaleCb(lang, cb) {
  let result = {};
  switch (lang) {
    case "zh-cn":
      result = await import("./locales/zh-cn");
      break;
    case "en-us":
      result = await import("./locales/en-us");
      break;
    case "ja-jp":
      result = await import("./locales/ja-jp");
      break;
    case "ru-ru":
      result = await import("./locales/ru-ru");
      break;
    case "ko-kr":
      result = await import("./locales/ko-kr");
      break;
    case "es":
      result = await import("./locales/es-es");
      break;
    default:
      result = await import("./locales/en-us");
  }
  setTimeout(() => {
    cb(result.default || result);
  }, 0);
}

if (!window.WEB_CONFIG.orgId) {
  window.location.href = "/error.html";
}

const start = async () => {
  const user_id = cookie.read("user_id");
  // 默认个性化配置
  const default_custom_config = CONST.customConfig;
  let customConfig = {};
  // 读取用户个性化配置
  try {
    if (user_id) {
      const res = await getData("get_custom_config")({
        payload: {},
        method: "post",
      });
      if (res.code == "OK" && res.data) {
        customConfig = res.data.commonConfig;
        customConfig = JSON.parse(customConfig);
      }
    }
    customConfig = Object.assign(default_custom_config, customConfig);
  } catch (e) {
    customConfig = default_custom_config;
  }
  window.sessionStorage.customConfig = JSON.stringify(customConfig);
  // 重置 默认语言, 法币单位
  if (customConfig.lang || customConfig.unit) {
    helper.set_lang_unit(customConfig.lang, customConfig.unit);
  }
  // 重置 红涨绿跌
  if (Number(customConfig.up_down)) {
    helper.set_up_down(Number(customConfig.up_down));
  }

  // 1. Initialize
  const data = {
    history: createBrowserHistory(),
    //onAction: createLogger(),
    onError(e) {
      window.console.log(e);
    },
  };
  const app = dva(data);

  // 2. Plugins
  app.use(createLoading());

  // 3. Model
  app.model(Layout);

  // 4. Router
  app.router(Routes);

  // 5. Start
  const App = app.start();

  getLocale(window.localStorage.lang, function (appLocale) {
    addLocaleData(...appLocale.data);
    window.react_intl_msgs = new Set();
    ReactDOM.render(
      <IntlProvider
        locale={appLocale.locale}
        messages={appLocale.messages}
        formats={appLocale.formats}
        onError={(info) => {
          let keys = info.match(/"[^"]{1,}"/);
          if (keys[0]) {
            window.react_intl_msgs.add(keys[0].replace(/"/g, ""));
          }
        }}
      >
        <App />
      </IntlProvider>,
      document.querySelector("#root")
    );
    //sw();
  });
};
start();
