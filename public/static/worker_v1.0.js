importScripts("./pako_inflate.min_v1.0.11.js");

onmessage = function (e) {
  const data = e.data;
  let reader = new FileReader();
  reader.onload = function (evt) {
    if (evt.target.readyState == FileReader.DONE) {
      let result = new Uint8Array(evt.target.result);
      if (result) {
        let data = JSON.parse(pako.inflate(result, { to: "string" }));
        postMessage(data);
      }
    }
  };
  reader.readAsArrayBuffer(data);
};

onerror = function (e) {
  //console.log(e.msg);
};
