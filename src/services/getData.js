import urls from "../config/api";
import request from "../utils/request";

/**
 * 通用请求
 * @param {string} key 请求地址，参考urls中的key
 * @param {object} params 请求参数
 * @return {promise}
 */
export default function getData(key) {
  return ({ payload, ...props }) => {
    return request(urls[key], { body: payload, ...props });
  };
}
