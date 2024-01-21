import fetch from "dva/fetch";
import cookie from "./cookie";

function checkStatus(response, timer) {
  clearTimeout(timer);
  timer = null;
  if (response.status >= 200 && response.status < 502) {
    return response;
  } else {
    return Promise.reject(response.statusText);
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const ctoken = cookie.read("c_token");
  if (ctoken) {
    url = [url, ["c_token", ctoken].join("=")].join(
      url.indexOf("?") > -1 ? "&" : "?"
    );
  }

  const t_start = new Date().getTime();
  const fheaders = new Headers();
  fheaders.append("X-Requested-With", "XMLHttpRequest");
  if (!options.upload) {
    fheaders.append("Content-Type", "application/x-www-form-urlencoded");
  }
  fheaders.append("Accept-Language", window.localStorage.lang);
  if (options.headers) {
    for (const key in options.headers) {
      if ({}.hasOwnProperty.call(options.headers, key)) {
        fheaders.append(key, options.headers[key]);
      }
    }
  }

  options = Object.assign(
    {
      credentials: options.credentials || "include", // 是否跨域访问cookie， omit默认，same-origin同域，include
      method: options.method || "POST",
      //mode: options.mode || "cors", // 是否允许跨域请求，no-cors默认，same-origin同域，cors跨域
      headers: fheaders,
    },
    options
  );
  if (options.data && !options.body) {
    options.body = options.data;
  }
  if (
    options.body &&
    Object.prototype.toString.call(options.body) === "[object Object]" &&
    !options.upload
  ) {
    let str = "";
    //let form = new FormData();
    const fn = (item, key) => {
      str += `${key}[]=${item}&`;
    };
    for (const key in options.body) {
      if ({}.hasOwnProperty.call(options.body, key)) {
        const v = options.body[key];
        if (Object.prototype.toString.call(v) === "[object Array]") {
          for (let i = 0, l = v.length; i < l; i += 1) {
            fn(v[i], key);
          }
        } else {
          str += `${key}=${options.body[key]}&`;
        }
      }
      //form.append(key, options.body[key]);
    }
    str = str.replace(/&$/, "");
    if (/get/i.test(options.method)) {
      if (str) {
        url += url.indexOf("?") > -1 ? `&${str}` : `?${str}`;
      }
      delete options.body;
    }
    if (/post/i.test(options.method)) {
      options.body = str;
    }
  }

  // 添加请求超时
  let timeout = 20000; // 默认20秒超时
  let abort = null;
  let timer = null;
  const abortPromise = new Promise((resolve, reject) => {
    abort = () => {
      return reject(`请求超时: ${url}`);
    };
  });
  const promise = Promise.race([
    abortPromise,
    fetch(`${url}`, options)
      .then(checkStatus)
      .then((res) => {
        clearTimeout(timer);
        timer = null;
        // 服务端返回的body可能为空
        // http code [ 200 - 300) 返回body为具体数据内容
        // http code <200 || >=300 返回body为报错信息 { code: 415, message, title, ... }
        return res.text().then((d) => {
          let json = {
            request_url: url,
            cost: new Date().getTime() - t_start,
            type: "api_call",
            http_code: res.status,
          };

          if (res.status >= 200 && res.status < 300 && d) {
            let data = {};
            if (d && d.length) {
              data = JSON.parse(d);
            }
            window.trackPageError(json);
            return {
              code: "OK",
              data,
            };
          } else {
            if (res.status == 403) {
              window.trackPageError(json);
              return {
                code: 403,
                msg: window.appLocale.messages["包含非法内容，请求被拒绝"],
              };
            }
            let data =
              d && d.length
                ? JSON.parse(d)
                : {
                    code: 1000,
                    msg: "unknown error",
                  };
            if (data.code === 30000) {
              window.sessionStorage.removeItem("userinfo");
            }
            data.code = data.code || data.status;
            json.error_code = data.code;
            json.error_message = data.msg;
            window.trackPageError(json);
            return data;
          }
        });
      })
      .catch((err) => {
        const end = new Date().getTime();
        window.trackPageError({
          request_url: url,
          cost: end - t_start,
          type: "api_error",
          // error_code: err.status,
          error_message: err,
        });
        return Promise.reject(err);
        // return Promise.reject("fetch error");
      }),
  ]);

  Object.defineProperty(promise, "timeout", {
    set: (ts) => {
      if ((ts = +ts)) {
        timeout = ts;
        timer = setTimeout(() => {
          abort("请求超时");
        }, timeout);
      }
    },
    get: () => {
      return timeout;
    },
  });
  promise.timeout = options.timeout || timeout;

  return promise;
}
