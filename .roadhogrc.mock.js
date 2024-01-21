import fs from "fs";
import path from "path";
import http from "http";
import querystring from "querystring";

const dev_local = 1; // 1 : 本地mock数据， 0 : 后台接口
const api_host = "localhost"; // 接口host
const port = 9600;

const readFile = (req, res) => {
  const _path = req.originalUrl.replace(/\//g, "_").replace(/^_/, "");
  console.log(_path);
  const result = fs.readFileSync(path.join(__dirname, `./mock/${_path}.json`), {
    encoding: "utf8",
  });
  res.send(result);
};

export default {
  "POST /*": (req, res) => {
    if (dev_local) {
      /**
       * 开发阶段，使用本地mock数据
       */
      readFile(req, res);
    } else {
      /**
       * 联调阶段，转发到以下接口
       */
      const headers = {
        "user-agent": req.headers["user-agent"] || "",
        Cookie: req.headers.cookie || "",
        Referer: req.headers.referer || "",
        "X-Requested-With": "XMLHttpRequest",
      };
      if (req.headers["content-type"]) {
        headers["Content-Type"] = req.headers["content-type"];
      }
      let _req = http.request(
        {
          hostname: api_host,
          port,
          path: req.path,
          method: "POST",
          headers,
        },
        (_res) => {
          _res.setEncoding("utf8");
          // 服务端cookie写入
          const cookie = _res.headers["set-cookie"];
          if (cookie) {
            res.setHeader("Set-Cookie", cookie);
          }
          let body = [];
          _res.on("data", (chunk) => {
            body.push(Buffer.from(chunk));
          });
          _res.on("end", () => {
            let buffer = Buffer.concat(body);
            const str = buffer.toString();

            res.send(str);
          });
        }
      );
      req.pipe(_req);
    }
  },
};
