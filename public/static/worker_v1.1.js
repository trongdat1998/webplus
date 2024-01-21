importScripts("./pako_inflate.min_v1.0.11.js");

onmessage = function (e) {
  var data = e.data;
  var result = new Uint8Array(data);
  if (result) {
    var d = JSON.parse(pako.inflate(result, { to: "string" }));
    postMessage(d);
  }
  // let reader = new FileReader();
  // reader.readAsArrayBuffer(data);
  // reader.onload = evt => {
  //   if (evt.target.readyState == FileReader.DONE) {
  //     let result = new Uint8Array(evt.target.result);
  //     if (result) {
  //       let data = JSON.parse(pako.inflate(result, { to: "string" }));
  //       postMessage(data);
  //     }
  //   }
  // };
};

onerror = function (e) {
  //console.log(e.msg);
};
