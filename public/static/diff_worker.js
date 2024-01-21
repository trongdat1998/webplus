// 盘口，深度，增量数据处理
/**
 * 二分查找
 * @param {Array} ar 源数据[[price,quantity],[],[]]
 * @param {Array} d  新增数据[price,quantity]
 * @param {Boolean} t true:ar从低到高排序; false:ar从高到低排序;  depth.a: 从低到高，depth.b: 从高到低
 * @return {Array} [i,n]  i=-1: 新增数据,n:新增数据插入数组后的序号=n；i>-1: 修改ar[i]的数据
 */
function binarySearch(ar, d, t) {
  let i = 0;
  let lang = ar.length - 1;
  while (i <= lang) {
    let m = Math.floor((i + lang) / 2);
    if (ar[m]) {
      if (ar[m][0] > d[0]) {
        // 从低到高排序
        if (t) {
          lang = m - 1;
        } else {
          i = m + 1;
        }
      } else if (ar[m][0] < d[0]) {
        // 从低到高排序
        if (t) {
          i = m + 1;
        } else {
          lang = m - 1;
        }
      } else {
        return [m, 0];
      }
    }
  }
  return [-1, i];
}

/**
 * diff数据处理
 * @param {Object} data: {a:[],b:[]} 原数据
 * @param {Object} d : {a:[],b:[]} 新增的数据
 * @return {Object} _data: {a:[],b:[]} 处理过的数据
 */
let log_price = "";
function diff(data, d, name) {
  if (data.a && data.a.length) {
    data.a.map(function (item) {
      item[2] = 0;
    });
  }
  if (data.b && data.b.length) {
    data.b.map(function (item) {
      item[2] = 0;
    });
  }

  if (d.a && d.a.length) {
    d.a.map(function (item, m) {
      let i = binarySearch(data.a, item, 1);
      if (
        Number(log_price) &&
        Number(log_price) == Number(item[0]) &&
        name == "mergedDepth_source"
      ) {
        console.log(item, "sell");
      }
      // 修改原数据
      if (i[0] > -1) {
        if (Number(item[1])) {
          data.a[i[0]][1] = item[1];
          data.a[i[0]][2] = 1;
        } else {
          data.a.splice(i[0], 1);
        }
      }
      // 新增数据
      if (i[0] == -1 && Number(item[1])) {
        data.a.splice(i[1], 0, [item[0], item[1], 1]);
      }
      //console.log(JSON.stringify(data.a[m]), item, m);
    });
  }
  if (d.b && d.b.length) {
    d.b.map(function (item, m) {
      let i = binarySearch(data.b, item, 0);
      if (
        Number(log_price) &&
        Number(log_price) == Number(item[0]) &&
        name == "mergedDepth_source"
      ) {
        console.log(item, "buy");
      }
      // 修改原数据
      if (i[0] > -1) {
        if (Number(item[1])) {
          data.b[i[0]][1] = item[1];
          data.b[i[0]][2] = 1;
        } else {
          data.b.splice(i[0], 1);
        }
      }
      // 新增数据
      if (i[0] == -1 && Number(item[1])) {
        data.b.splice(i[1], 0, [item[0], item[1], 1]);
      }
      //console.log(JSON.stringify(data.b[m]), item, m);
    });
  }
  return data;
}

onmessage = function (e) {
  let data = e.data;
  let payload = data.payload;
  if (data.type == "log") {
    log_price = data.payload.price;
  }
  if (data.type == "diff") {
    if (payload.source && payload.target) {
      payload.source = diff(payload.source, payload.target, payload.name);
      postMessage(data);
    }
  }
};

onerror = function (e) {
  e.preventDefault();
  //console.log(e.msg);
};
