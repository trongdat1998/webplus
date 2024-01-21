/**
 * type: html_slow, png_slow, api_slow, websocket_slow, png_error, api_error, websocket_error
 * url: png/api/websocket url, urlencoded
 * cost: cost time, in seconds
 * code: error code, if any
 * msg: error msg, if any
 */

// import request from "./request";
// import api from "../config/api";

// let data = [];
// let timer = null;
function report(type = "default_type", url, cost = "", code = "", msg = "") {

  window.trackPageError({
    type: type,
    cost: cost,
    requestUrl: url,
    message: msg,
    httpCode: code == "OK" ? 0 : code
  });
  // data.push({
  //   type,
  //   url: encodeURIComponent(url || window.location.href),
  //   cost,
  //   code,
  //   msg
  // });
}

// async function update() {
//   if (data.length) {
//     try {
//       await request(api.analyze, { body: { datas: JSON.stringify(data) } });
//     } catch (err) {}
//     data = [];
//   }
//   clearTimeout(timer);
//   timer = null;
//   timer = setTimeout(update, 5000);
// }
window.g_report = report;
//window.addEventListener("load", update, false);
export default report;
