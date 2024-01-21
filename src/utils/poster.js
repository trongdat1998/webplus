import QRCode from "qrcode";
const getImg = (url, cb) => {
    let img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      cb(img);
    };
    img.src = url;
  },
  drawImg = (backgound, code, cb, i) => {
    let bgSize = {
      height: 1472,
      width: 828,
    };
    let codeSize = {
      height: 212,
      width: 212,
      right: 48,
      bottom: 48,
    };
    //背景图片，上面图片
    let canvas = document.createElement("canvas");
    canvas.width = bgSize.width;
    canvas.height = bgSize.height;
    let context = canvas.getContext("2d");

    getImg(backgound, (backgound) => {
      context.drawImage(backgound, 0, 0, bgSize.width, bgSize.height);
      //绘制二维码
      getImg(code, (code) => {
        context.drawImage(
          code,
          bgSize.width - codeSize.width - codeSize.right,
          bgSize.height - codeSize.height - codeSize.bottom,
          codeSize.width,
          codeSize.height
        );
        cb(canvas.toDataURL("image/png"), i);
      });
    });
  },
  draw = (backgound, url, cb, i = 0) => {
    QRCode.toDataURL(
      url,
      {
        margin: 1.5,
      },
      (err, url) => {
        drawImg(backgound, url, cb, i);
      }
    );
  };

export default draw;
