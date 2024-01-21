module.exports = {
  "/s_api": {
    target: "https://www.headsc.dev",
    changeOrigin: true,
    https: true,
    headers: {
      Referer: "https://www.headsc.dev",
    },
    cookieDomainRewrite: "localhost",
  },
  "/api/ws/": {
    target: "wss://www.headsc.dev",
    ws: true,
    changeOrigin: true,
    secure: false,
    logLevel: "debug",
    cookieDomainRewrite: "localhost",
  },
  "/api": {
    target: "https://www.headsc.dev",
    changeOrigin: true,
    https: true,
    headers: {
      Referer: "https://www.headsc.dev",
    },
    cookieDomainRewrite: "localhost",
  },
  "/ws/quote/": {
    target: "wss://www.headsc.dev",
    ws: true,
    changeOrigin: true,
    secure: false,
    logLevel: "debug",
    cookieDomainRewrite: "localhost",
  },
};
