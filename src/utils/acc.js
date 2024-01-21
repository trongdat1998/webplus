/*
 * 浮点计算方法，加减乘除
 * 小数部分转化为整数，计算完再转化为小数
 * 支持的数值范围：
 * 		1、在数字转变为科学计数法之前
 * 		2、整数及小数的位数和在16位以内，超出后js无法精确表示及计算
 *
 * 使用示例
 * 加 acc.add(101,0.23123, 2, 3) -> 101 + 0.23123 + 2 + 3
 * 减 acc.sub(101,0.23123, 2, 3) -> 101 - 0.23123 - 2 - 3
 * 乘 acc.mul(101,0.23123, 2, 3) -> 101 * 0.23123 * 2 * 3
 * 除 acc.div(101,0.23123,3)     -> (101/0.23123).toFixed(3)
 *
 */

/*
 * 加法
 * @param number 传入要计算的值
 * @param number 传入要计算的值
 * @return number
 */
function add(...args) {
  let m = 0;
  args.forEach(item => {
    m = _add(m, item);
  });
  return m;
}
function _add(a, b) {
  if (a === undefined || b === undefined) return;
  let m = 0,
    x,
    y;
  x = ("" + a).split(".");
  y = ("" + b).toString().split(".");
  m = Math.max((x[1] || "").length, (y[1] || "").length);
  return (mul(a, Math.pow(10, m)) + mul(b, Math.pow(10, m))) / Math.pow(10, m);
}
/*
 * 减法
 * @param number 传入要计算的值
 * @param number 传入要计算的值
 * @return number
 */
function sub(a, ...args) {
  if (a === undefined) return;
  let m = a;
  args.forEach(item => {
    m = _sub(a, item);
  });
  return m;
}
function _sub(a, b) {
  if (a === undefined || b === undefined) return;
  let m = 0,
    x,
    y;
  x = ("" + a).split(".");
  y = ("" + b).split(".");
  m = Math.max((x[1] || "").length, (y[1] || "").length);
  return (mul(a, Math.pow(10, m)) - mul(b, Math.pow(10, m))) / Math.pow(10, m);
}
/*
 * 乘法
 * @param number 传入要计算的值
 * @param number 传入要计算的值
 * @return number
 */
function mul(a, b, c) {
  if (a === undefined || b === undefined) return;
  let m = 0;
  let s1 = a.toString();
  let s2 = b.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}
  let r =
    (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
    Math.pow(10, m);
  if (c === 0) {
    return Math.round(r);
  }
  if (c > 0) {
    r = mul(r, Math.pow(10, c));
    r = Math.round(r);
    r = div(r, Math.pow(10, c), c);
    return r;
  }
  return r;
}
/*
 * 除法
 * @param number $a 传入要计算的值
 * @param number $b 传入要计算的值
 * @param number $p toFixed保留的位数
 * @return number
 */
function div(a, b, p) {
  if (a === undefined || b === undefined) return;
  let m = 0,
    x,
    y;
  x = ("" + a).split(".");
  y = ("" + b).split(".");
  m = (y[1] || "").length - (x[1] || "").length;
  x = ("" + a).replace(".", "");
  y = ("" + b).replace(".", "");
  p = p || p === 0 ? p : 4;
  return p || p === 0
    ? ((x / y) * Math.pow(10, m)).toFixed(p)
    : (x / y) * Math.pow(10, m);
}

export default {
  add,
  sub,
  mul,
  div
};
