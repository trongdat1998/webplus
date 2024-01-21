const fs = require("fs");
const path = require("path");
const mockPath = path.join(__dirname, "mock");

// 存放文件路径
const mockFiles = [];
fs.readdirSync(mockPath).forEach((file) => {
  console.log(file);
  mockFiles.push(path.resolve("./mock/" + file));
});
module.exports = mockFiles;
