const exec = require("child_process").exec;
const path = require("path");
const AWS_ACCESS_KEY_ID = process.env.WEB_AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.WEB_AWS_SECRET_ACCESS_KEY;

const pathurl = path.join(__dirname, "build/static");
const upload = [
  `AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}`,
  `AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}`,
  "aws s3 sync",
  pathurl,
  `s3://static.headsc.dev/static/ --exclude '*.svg' --cache-control max-age=31536000 --region ap-northeast-1`,
].join(" ");
const upload_svg = [
  `AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}`,
  `AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}`,
  "aws s3 sync",
  pathurl,
  "s3://static.headsc.dev/static/ --exclude '*' --include '*.svg' --content-type='image/svg+xml' --cache-control max-age=31536000 --region ap-northeast-1",
].join(" ");

// exec(upload, (error, stdout, stderr) => {
//   console.log("stdout: " + stdout, "+++++++++++", "stderr: " + stderr);
//   if (error !== null) {
//     console.log("execSync error: " + error);
//   }
//   exec(upload_svg, (error, stdout, stderr) => {
//     console.log("stdout: " + stdout, "+++++++++++", "stderr: " + stderr);
//     if (error !== null) {
//       console.log("execSync error: " + error);
//     }
//   });
// });

async function run() {
  try {
    await exec(upload);
    await exec(upload_svg);
  } catch (e) {
    console.error(e);
  }
}
run();
