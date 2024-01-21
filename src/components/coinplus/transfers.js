import math from "../../utils/mathjs";
import helper from "../../utils/helper";
const productTransfer = data => {
  //精度默认传入是0.0001这样的数
  const tradeScale =
    !isNaN(data.tradeScale) && data.tradeScale.split(".").length > 1
      ? data.tradeScale.split(".")[1].length
      : 8;
  return {
    ...data,
    tradeScale, //8
    tradeScaleNumber: (!isNaN(data.tradeScale) && data.tradeScale) || 0, //0.00000001
    name: data.productName,
    userLimit:
      (!isNaN(data.userLimit) &&
        helper.format(
          math
            .chain(math.bignumber(data.userLimit || 0))
            .format({
              notation: "fixed"
            })
            .done(),
          tradeScale
        )) ||
      0,
    userLastLimit:
      (!isNaN(data.userLastLimit) &&
        !isNaN(tradeScale) &&
        helper.format(
          math
            .chain(math.bignumber(data.userLastLimit || 0))
            .format({
              notation: "fixed"
            })
            .done(),
          tradeScale
        )) ||
      0,
    rate:
      (data.sevenYearRate &&
        helper.format(
          math
            .chain(math.bignumber(data.sevenYearRate || 0))
            .multiply(100)
            .format({
              notation: "fixed"
            })
            .done(),
          2
        )) ||
      0,
    left:
      (!isNaN(tradeScale) &&
        !isNaN(data.dailyLastLimit) &&
        math
          .chain(math.bignumber(data.dailyLastLimit || 0))
          .format({
            notation: "fixed"
          })
          .done()) ||
      0,
    product_id: data.id,
    inputDigitLength: (!isNaN(tradeScale) && Number(tradeScale) + 1) || 8,
    unit: data.token,
    status: data.status,
    orderMinTrade:
      (!isNaN(data.purchaseMinAmount) &&
        math.chain(math.bignumber(data.purchaseMinAmount)).format({
          notation: "fixed"
        })) ||
      0,
    redeemMinTrade:
      (!isNaN(data.redeemMinAmount) &&
        math.chain(math.bignumber(data.redeemMinAmount)).format({
          notation: "fixed"
        })) ||
      0,
    redeemBalance:
      (data.wallet &&
        !isNaN(data.wallet.balance) &&
        !isNaN(data.wallet.purchase) &&
        helper.digits(
          math
            .chain(math.bignumber(data.wallet.balance))
            .add(data.wallet.purchase)
            .format({
              notation: "fixed"
            })
            .done(),
          tradeScale
        )) ||
      0,
    balance:
      (data.userBalance &&
        !isNaN(data.userBalance.free) &&
        helper.digits(
          math
            .chain(math.bignumber(data.userBalance.free))
            .format({
              notation: "fixed"
            })
            .done(),
          tradeScale
        )) ||
      0
  };
};

const resultTransfer = data => {
  const calcDate = (
    type = data.type,
    current = data.serverTime,
    create = data.createdAt
  ) => {
    if (isNaN(current) || isNaN(create) || current < create) {
      return {
        status: "waiting",
        step: 0
      };
    }
    const day = (current - create) / 60 / 60 / 24 / 1000;
    if (type == 0) {
      return {
        status: day <= 1 ? "waiting" : "success",
        step: day < 1 ? 0 : day >= 1 && day < 2 ? 50 : day >= 2 ? 100 : 0
      };
    } else {
      return {
        status: data.status == 2 ? "success" : "waiting",
        step: data.status == 2 ? 100 : 0
      };
    }
  };
  const calcWeek = time => {
    if (isNaN(time)) return;
    const timeNumber = Number(time);
    let day = new Date(timeNumber).getDay();
    switch (day) {
      case 1: {
        return "星期一";
      }
      case 2: {
        return "星期二";
      }
      case 3: {
        return "星期三";
      }
      case 4: {
        return "星期四";
      }
      case 5: {
        return "星期五";
      }
      case 6: {
        return "星期六";
      }
      case 0: {
        return "星期日";
      }
      default: {
        return "日期错误";
      }
    }
  };
  return {
    ...data,
    unit: data.token || "",
    type: data.type == "0" ? "order" : "redeem",
    value:
      (!isNaN(data.amount) &&
        math
          .chain(Number(data.amount))
          .format({
            notation: "fixed"
          })
          .done()) ||
      0,
    step: calcDate().step,
    status:
      data.type == "0"
        ? calcDate().status
        : data.status == "2"
        ? "success"
        : "waiting",
    startTime: !isNaN(data.createdAt) ? Number(data.createdAt) : 0,
    week: calcWeek
  };
};
export { productTransfer, resultTransfer };
