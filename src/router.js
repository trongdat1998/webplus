import React from "react";
import { Router, Route, Switch, Redirect } from "dva/router";
import dynamic from "dva/dynamic";
import route_map from "./config/route_map";

function RouterConfig({ history, app }) {
  // 404
  const NotFountRC = dynamic({
    app,
    component: () => import("./routes/404"),
  });
  // card agreement
  const CardAgreementRC = dynamic({
    app,
    component: () => import("./routes/other/cardAgreement"),
  });

  // 首页
  const IndexRC = dynamic({
    app,
    models: () => [import("./models/index"), import("./models/ws")],
    component: () => import("./routes/index/index_new"),
  });
  // defi
  const DeFiRC = dynamic({
    app,
    models: () => [import("./models/ws")],
    component: () => import("./routes/exchange/defi"),
  });
  // bhop首页
  const BhopIndexRC = dynamic({
    app,
    models: () => [import("./models/index"), import("./models/ws")],
    component: () => import("./routes/index/index_bhop"),
  });
  // login 登录
  const LoginRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/login"),
  });
  // register 注册
  const RegisterRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/register"),
  });
  // register guide 注册
  const RegisterGuideRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/register_guide"),
  });
  // 邀请注册第一步
  const InviteRegisterStep1 = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/invite_register_step1"),
  });

  // 用户中心
  const UserCenterRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/index"),
  });
  // 个性化配置
  const UserCustomConfigRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/custom_config"),
  });
  // 绑定验证方式
  const UserCenterBindRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/bind"),
  });

  // 换绑验证
  const UserCenterChangeBindRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/change_bind"),
  });

  // 忘记密码
  const ForgetPasswordRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/forgetpassword"),
  });
  // 修改密码
  const ResetPasswordRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/resetpassword"),
  });
  // 设置密码
  const SetPasswordRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/setpassword"),
  });
  // 资金密码
  const FundPasswordRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/fundpassword"),
  });
  // KYC
  const KYCRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/kyc"),
  });
  // api
  const APIRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/api"),
  });
  // 邀请
  const InviteRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/invite"),
  });
  // 用户等级
  const GradeRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/grade"),
  });

  // order
  const OrderRC = dynamic({
    app,
    models: () => [import("./models/exchange"), import("./models/ws")],
    component: () => import("./routes/user/order"),
  });
  //finance list 资产列表页
  const FinanceListRC = dynamic({
    app,
    models: () => [import("./models/finance"), import("./models/ws")],
    component: () => import("./routes/finance/list"),
  });
  // 资产追溯
  const TraceBackRC = dynamic({
    app,
    models: () => [import("./models/finance")],
    component: () => import("./routes/finance/trace_back"),
  });
  // 子账户资产列表页
  const FinanceChildListRC = dynamic({
    app,
    models: () => [import("./models/finance")],
    component: () => import("./routes/finance/child"),
  });
  //finance record 资产记录页
  const FinanceRecordRC = dynamic({
    app,
    models: () => [import("./models/finance")],
    component: () => import("./routes/finance/asset_record"),
  });
  //finance cash 提币
  const CashRC = dynamic({
    app,
    models: () => [import("./models/finance")],
    component: () => import("./routes/finance/cash"),
  });
  // 提币结果页
  const CashStatusRC = dynamic({
    app,
    models: () => [import("./models/finance")],
    component: () => import("./routes/finance/cash_status"),
  });
  // 风险资产
  const CashRiskRC = dynamic({
    app,
    models: () => [import("./models/finance")],
    component: () => import("./routes/finance/cash_risk"),
  });
  //finance address 提币地址管理
  const AddressRC = dynamic({
    app,
    models: () => [import("./models/finance")],
    component: () => import("./routes/finance/address"),
  });
  //finance rechange 充币
  const RechangeRC = dynamic({
    app,
    models: () => [import("./models/finance")],
    component: () => import("./routes/finance/rechange"),
  });
  // 活动账户资产
  const FinanceActivityListRC = dynamic({
    app,
    models: () => [import("./models/finance")],
    component: () => import("./routes/finance/activity"),
  });
  // 减持记录
  const FinanceUnderwieghtRC = dynamic({
    app,
    models: () => [import("./models/finance")],
    component: () => import("./routes/finance/underweight_list"),
  });
  // 闪电交易
  const FinanceFlashTradeRC = dynamic({
    app,
    models: () => [import("./models/finance"), import("./models/ws")],
    component: () => import("./routes/finance/flash_trade"),
  });

  // 永续合约行情
  const FutureRC = dynamic({
    app,
    models: () => [import("./models/future"), import("./models/ws")],
    component: () => import("./routes/future/quotes"),
  });
  // 理财首页
  const CoinplusRC = dynamic({
    app,
    models: () => [import("./models/coinplus")],
    component: () => import("./routes/coinplus"),
  });
  const coinplus_protocolsRC = dynamic({
    app,
    component: () => import("./routes/protocols/index"),
  });
  // 理财下单
  const CoinplusOrderRC = dynamic({
    app,
    models: () => [import("./models/coinplus")],
    component: () => import("./routes/coinplus/orderPage"),
  });
  // 理财赎回
  const CoinplusRedeemRC = dynamic({
    app,
    models: () => [import("./models/coinplus")],
    component: () => import("./routes/coinplus/redeemPage"),
  });
  // 理财状态
  const CoinplusResultRC = dynamic({
    app,
    models: () => [import("./models/coinplus")],
    component: () => import("./routes/coinplus/resultPage"),
  });
  // 理财资产
  const CoinplusFinanceRC = dynamic({
    app,
    models: () => [import("./models/coinplus")],
    component: () => import("./routes/coinplus/finance"),
  });
  // 新理财首页
  const StakingRC = dynamic({
    app,
    models: () => [import("./models/coinplus")],
    component: () => import("./routes/staking/index"),
  });
  // 新理财资产
  const StakingFinanceRC = dynamic({
    app,
    models: () => [import("./models/coinplus")],
    component: () => import("./routes/staking/finance"),
  });
  // 定期理财详情
  const StakingPeriodicalRC = dynamic({
    app,
    models: () => [import("./models/coinplus")],
    component: () => import("./routes/staking/periodic_detail"),
  });
  // 理财购买结果
  const StakingResultRC = dynamic({
    app,
    models: () => [import("./models/coinplus")],
    component: () => import("./routes/staking/result"),
  });
  const StakingOrderRC = dynamic({
    app,
    models: () => [import("./models/coinplus")],
    component: () => import("./routes/staking/order"),
  });
  // 永续合约资产
  const FutureFinanceRC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/finance"),
  });
  // 永续合约当前持仓
  const FuturePositionRC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/position"),
  });
  // 永续合约未完成委托
  const FutureCurrentEntrustRC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/current_entrust"),
  });
  // 永续合约历史委托
  const FutureHistoryEntrustRC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/history_entrust"),
  });
  // 永续合约历史成交
  const FutureHistoryOrderRC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/hisotry_order"),
  });
  // 合约新手引导
  const FutureGuestRC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/guest"),
  });
  // 交割记录
  const FutureDeliveryOrderRC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/delivery"),
  });
  // 保险基金
  const FutureInsuranceFundRC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/insurance_fund"),
  });
  // 合约历史数据，指数
  const FutureHistoryDataIndexRC = dynamic({
    app,
    models: () => [import("./models/future"), import("./models/ws")],
    component: () => import("./routes/future/history_data_index"),
  });
  // 合约历史数据，资金费率
  const FutureHistoryDataRatesRC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/history_data_rates"),
  });
  // 合约历史数据，保险基金
  const FutureHistoryDataFundingRC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/history_data_funding"),
  });
  // 合约历史数据，合约介绍
  const FutureHistoryDataInfoRC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/history_data_info"),
  });
  // 合约历史数据，合约qa
  const FutureHistoryDataQARC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/history_data_qa"),
  });
  // exchange 行情
  const ExchangeRC = dynamic({
    app,
    models: () => [import("./models/exchange"), import("./models/ws")],
    component: () => import("./routes/exchange/index"),
  });

  const ProtocolsRC = dynamic({
    app,
    component: () => import("./routes/protocols"),
  });

  // ieo index
  const IEORC = dynamic({
    app,
    models: () => [import("./models/ieo")],
    component: () => import("./routes/ieo/list"),
  });
  // ieo 活动页
  const IEOITEMRC = dynamic({
    app,
    models: () => [import("./models/ieo")],
    component: () => import("./routes/ieo/item"),
  });
  // ieo 订单列表页
  const IEOOrderRC = dynamic({
    app,
    models: () => [import("./models/ieo")],
    component: () => import("./routes/ieo/order"),
  });
  // 第三方支付
  const paymentRC = dynamic({
    app,
    models: () => [import("./models/payment")],
    component: () => import("./routes/payment/index"),
  });
  // ip无访问权限
  const noAccessRC = dynamic({
    app,
    component: () => import("./routes/other/noaccess"),
  });
  // 经纪人管理
  const brokerIndexRC = dynamic({
    app,
    models: () => [import("./models/broker")],
    component: () => import("./routes/broker/index"),
  });
  // 经纪人列表
  const brokerListRC = dynamic({
    app,
    models: () => [import("./models/broker")],
    component: () => import("./routes/broker/list"),
  });
  // 分佣列表
  const brokerCommissionRC = dynamic({
    app,
    models: () => [import("./models/broker")],
    component: () => import("./routes/broker/commission"),
  });

  // 杠杆交易
  const LeverExchangeRC = dynamic({
    app,
    models: () => [import("./models/lever"), import("./models/ws")],
    component: () => import("./routes/margin"),
  });
  //finance list 杠杆资产列表页
  const LeverFinanceListRC = dynamic({
    app,
    models: () => [import("./models/lever"), import("./models/ws")],
    component: () => import("./routes/margin/finance"),
  });

  // 杠杆订单
  const LeverOrdersRC = dynamic({
    app,
    models: () => [import("./models/lever"), import("./models/ws")],
    component: () => import("./routes/margin/order"),
  });

  // 币种资料列表
  const CurrencyListRC = dynamic({
    app,
    models: () => [import("./models/exchange")],
    component: () => import("./routes/other/currency_list"),
  });

  // 币种详情
  const CurrencyDetailRC = dynamic({
    app,
    models: () => [import("./models/exchange")],
    component: () => import("./routes/other/currency_detail"),
  });

  const ConvertRC = dynamic({
    app,
    models: () => [import("./models/convert")],
    component: () => import("./routes/convert/index"),
  });

  const ConvertHistoryRC = dynamic({
    app,
    models: () => [import("./models/convert")],
    component: () => import("./routes/convert/history"),
  });

  return (
    <Router history={history}>
      <Switch>
        <Route
          exact
          path={route_map.protocols + "/:protocolType"}
          component={ProtocolsRC}
        />
        {/* waitGuild */}
        {/* <Route exact path={route_map.waitGuild} component={WaitGuildRC} /> */}
        {/* 登录 */}
        <Route exact path={route_map.login} component={LoginRC} />
        {/* 注册 */}
        <Route
          exact
          path={route_map.register + "/:invite_code"}
          component={RegisterRC}
        />
        {/* 注册引导页 */}
        <Route
          exact
          path={route_map.register_guide}
          component={RegisterGuideRC}
        />
        <Route exact path={route_map.register} component={RegisterRC} />
        {/* 邀请注册第一步 */}
        <Route
          exact
          path={route_map.invite_register_step1}
          component={InviteRegisterStep1}
        />
        {/* 账户管理 */}
        {/* <Route exact path={route_map.user_account} component={UserAccountRC} /> */}
        {/* 用户中心 */}
        <Route exact path={route_map.user_center} component={UserCenterRC} />
        {/* 个性化配置 */}
        <Route
          exact
          path={route_map.custom_config}
          component={UserCustomConfigRC}
        />
        {/* 绑定验证方式 */}
        <Route
          exact
          path={route_map.user_bind + "/:type"}
          component={UserCenterBindRC}
        />
        {/* 解绑验证方式 */}
        <Route
          exact
          path={route_map.user_change_bind + "/:type"}
          component={UserCenterChangeBindRC}
        />
        {/* 忘记密码 */}
        <Route
          exact
          path={route_map.forgetpwd + "/:type"}
          component={ForgetPasswordRC}
        />
        {/* 修改密码 */}
        <Route exact path={route_map.resetpwd} component={ResetPasswordRC} />
        {/* 设置密码 */}
        <Route exact path={route_map.setpwd} component={SetPasswordRC} />
        {/* 资金密码 */}
        <Route
          exact
          path={route_map.fund_password}
          component={FundPasswordRC}
        />
        {/* kyc */}
        <Route exact path={route_map.user_kyc} component={KYCRC} />
        {/* api */}
        <Route exact path={route_map.user_api} component={APIRC} />
        {/* 邀请 */}
        <Route exact path={route_map.invite} component={InviteRC} />
        {/* 用户等级 */}
        <Route exact path={route_map.grade} component={GradeRC} />
        {/* 订单 */}
        <Route exact path={route_map.order} component={OrderRC} />
        {/* 资产列表 */}
        <Route exact path={route_map.finance_list} component={FinanceListRC} />
        {/* 资产追溯 */}
        <Route
          exact
          path={route_map.trace_back + "/:tokenId"}
          component={TraceBackRC}
        />
        {/* 子账户资产列表页 */}
        <Route
          exact
          path={route_map.finance_child_account}
          component={FinanceChildListRC}
        />
        {/* 活动账户资产列表页 */}
        <Route
          exact
          path={route_map.finance_activity_account}
          component={FinanceActivityListRC}
        />
        {/* 减持记录 */}
        <Route
          exact
          path={route_map.underweight_list}
          component={FinanceUnderwieghtRC}
        />
        <Route
          exact
          path={route_map.flash_trade + "/:token"}
          component={FinanceFlashTradeRC}
        />
        <Redirect
          path={route_map.flash_trade}
          to={route_map.flash_trade + "/HBC"}
          component={FinanceFlashTradeRC}
        />
        {/* 资产记录 */}
        <Route
          exact
          path={route_map.finance_record}
          component={FinanceRecordRC}
        />
        {/* 充币 */}
        <Route
          exact
          path={route_map.rechange + "/:token"}
          component={RechangeRC}
        />
        <Redirect
          path={route_map.rechange}
          to={route_map.rechange + "/BTC"}
          component={RechangeRC}
        />
        {/* 提币 */}
        <Redirect
          exact
          path={route_map.cash + "/USDT"}
          to={route_map.cash + "/USDT/TRC20"}
          component={CashRC}
        />
        <Route exact path={route_map.cash + "/:token"} component={CashRC} />
        <Route
          exact
          path={route_map.cash + "/:token/:chain_type"}
          component={CashRC}
        />
        <Redirect
          path={route_map.cash}
          to={route_map.finance_list}
          component={FinanceListRC}
        />
        {/* 提币结果页 */}
        <Route
          exact
          path={route_map.cash_status + "/:orderId"}
          component={CashStatusRC}
        />
        {/* 风险资产 */}
        <Route
          exact
          path={route_map.cash_risk + "/:token/:chain_type"}
          component={CashRiskRC}
        />
        {/* 地址管理 */}
        <Route
          exact
          path={route_map.address + "/:token"}
          component={AddressRC}
        />
        <Redirect
          path={route_map.address}
          to={route_map.address + "/BTC"}
          component={AddressRC}
        />
        {/* 首页 */}
        <Route
          exact
          path={route_map.index}
          component={
            window.WEB_CONFIG && window.WEB_CONFIG.indexNewVersion
              ? IndexRC
              : BhopIndexRC
          }
        />

        {/* 合约行情 */}
        <Route
          exact
          path={route_map.future + "/:exchangeId" + "/:symbolId/"}
          component={FutureRC}
        />
        <Route
          exact
          path={route_map.future + "/:symbolId/"}
          component={FutureRC}
        />
        <Route path={route_map.future} component={FutureRC} />
        {/* 理财首页 */}
        <Route exact path={route_map.coinplus} component={StakingRC} />
        {/* 理财下单 */}
        <Route
          exact
          path={route_map.coinplusOrder + "/:product_id"}
          component={CoinplusOrderRC}
        />
        {/* 理财赎回 */}
        <Route
          exact
          path={route_map.coinplusRedeem + "/:product_id"}
          component={CoinplusRedeemRC}
        />
        {/* 理财协议 */}
        <Route
          exact
          path={route_map.coinplus_protocols + "/:protocolType"}
          component={coinplus_protocolsRC}
        />
        {/* 理财状态 */}
        <Route
          exact
          path={route_map.coinplusResult + "/:recordId"}
          component={CoinplusResultRC}
        />
        {/* 理财资产 */}
        <Route
          exact
          path={route_map.coinplus_finance}
          component={StakingFinanceRC}
        />
        {/* 新理财首页 */}
        <Route exact path={route_map.staking} component={StakingRC} />
        {/* 新理财资产 */}
        <Route
          exact
          path={route_map.staking_finance}
          component={StakingFinanceRC}
        />
        {/* 定期理财详情 */}
        <Route
          exact
          path={route_map.staking_periodical + "/:product_id"}
          component={StakingPeriodicalRC}
        />
        {/* 定期购买结果 */}
        <Route
          exact
          path={route_map.staking_result + "/:product_id/:order_id"}
          component={StakingResultRC}
        />
        {/* 定期订单 */}
        <Route
          exact
          path={route_map.staking_result + "/:product_id/:order_id"}
          component={StakingResultRC}
        />
        <Route
          exact
          path={route_map.staking_order}
          component={StakingOrderRC}
        />
        {/* 永续合约资产 */}
        <Route
          exact
          path={route_map.future_finance}
          component={FutureFinanceRC}
        />
        {/* 永续合约当前持仓 */}
        <Route
          exact
          path={route_map.future_position}
          component={FuturePositionRC}
        />
        {/* 永续合约未完成委托 */}
        <Route
          exact
          path={route_map.future_current_entrust}
          component={FutureCurrentEntrustRC}
        />
        {/* 永续合约历史委托 */}
        <Route
          exact
          path={route_map.future_history_entrust}
          component={FutureHistoryEntrustRC}
        />
        {/* 永续合约历史成交 */}
        <Route
          exact
          path={route_map.future_history_order}
          component={FutureHistoryOrderRC}
        />
        {/* 永续合约交割 */}
        <Route
          exact
          path={route_map.future_delivery}
          component={FutureDeliveryOrderRC}
        />
        {/* 合约引导 */}
        <Route exact path={route_map.future_guest} component={FutureGuestRC} />
        {/* 保险基金 */}
        <Route
          exact
          path={route_map.future_insurance_fund}
          component={FutureInsuranceFundRC}
        />
        {/* 合约历史数据，指数 */}
        <Route
          exact
          path={route_map.future_history_data_index + "/:symbol_id"}
          component={FutureHistoryDataIndexRC}
        />
        <Route
          exact
          path={route_map.future_history_data_index}
          component={FutureHistoryDataIndexRC}
        />
        {/* 合约历史数据，资金费率 */}
        <Route
          exact
          path={route_map.future_history_data_rate + "/:symbol_id"}
          component={FutureHistoryDataRatesRC}
        />
        <Route
          exact
          path={route_map.future_history_data_rate}
          component={FutureHistoryDataRatesRC}
        />
        {/* 合约历史数据，保险基金 */}
        <Route
          exact
          path={route_map.future_history_data_funding + "/:symbold_id"}
          component={FutureHistoryDataFundingRC}
        />
        <Route
          exact
          path={route_map.future_history_data_funding}
          component={FutureHistoryDataFundingRC}
        />
        {/* 合约历史数据，介绍 */}
        <Route
          exact
          path={route_map.future_history_data_info}
          component={FutureHistoryDataInfoRC}
        />
        {/* 合约历史数据，QA */}
        <Route
          exact
          path={route_map.future_history_data_qa}
          component={FutureHistoryDataQARC}
        />
        <Redirect
          exact
          path={route_map.future_history_data}
          to={route_map.future_history_data_index}
        />
        {/* 行情 */}
        <Route
          exact
          path={route_map.exchange + "/:exchangeId/:token1/:token2"}
          component={ExchangeRC}
        />
        <Route
          exact
          path={route_map.exchange + "/:token1/:token2"}
          component={ExchangeRC}
        />
        <Redirect
          exact
          path={route_map.exchange}
          to={
            route_map.exchange +
            `/${
              window.WEB_CONFIG.symbol && window.WEB_CONFIG.symbol[0]
                ? window.WEB_CONFIG.symbol[0]["baseTokenId"]
                : ""
            }/${
              window.WEB_CONFIG.symbol && window.WEB_CONFIG.symbol[0]
                ? window.WEB_CONFIG.symbol[0]["quoteTokenId"]
                : ""
            }`
          }
        />
        {/* defi */}
        <Route exace path={route_map.defi} component={DeFiRC} />
        {/* IEO 首页 */}
        <Route exact path={route_map.ieo} component={IEORC} />
        {/* IEO 活动页 */}
        <Redirect
          path={"/ieo/item/:projectCode"}
          to={route_map.ieo_item + "/:projectCode"}
          component={IEOITEMRC}
        />
        <Route
          exact
          path={route_map.ieo_item + "/:projectCode"}
          component={IEOITEMRC}
        />
        {/* ieo 订单列表页 */}
        <Route exact path={route_map.ieo_order} component={IEOOrderRC} />
        {/* 第三方支付 */}
        <Route exact path={route_map.payment} component={paymentRC} />
        {/* ip无访问权限 */}
        <Route exact path={route_map.noaccess} component={noAccessRC} />
        {/* 经纪人管理 */}
        <Route exact path={route_map.broker} component={brokerIndexRC} />
        <Route exact path={route_map.broker_list} component={brokerListRC} />
        <Route
          exact
          path={route_map.broker_ommission}
          component={brokerCommissionRC}
        />
        {/* 杠杆订单 */}
        <Route exact path={route_map.margin_order} component={LeverOrdersRC} />
        <Route
          exact
          path={route_map.margin + "/:exchangeId/:token1/:token2"}
          component={LeverExchangeRC}
        />
        <Route
          exact
          path={route_map.margin + "/:token1/:token2"}
          component={LeverExchangeRC}
        />
        <Route exact path={route_map.margin} component={LeverExchangeRC} />
        {/* 杠杆资产列表 */}
        <Route
          exact
          path={route_map.margin_finance}
          component={LeverFinanceListRC}
        />
        {/* 币种资料列表 */}
        <Route
          exact
          path={route_map.currency_list}
          component={CurrencyListRC}
        />
        {/* 币种详情 */}
        <Route
          exact
          path={route_map.currency_list + "/:token"}
          component={CurrencyDetailRC}
        />
        {/* 币种详情 */}
        {/* <Redirect
          exact
          path={route_map.currency_detail}
          to={
            route_map.currency_detail +
            `/${
              window.WEB_CONFIG.token && window.WEB_CONFIG.token[0]
                ? window.WEB_CONFIG.token[0]["tokenId"]
                : ""
            }`
          }
        /> */}
        <Route component={ConvertRC} exact path={route_map.convert} />
        <Route
          component={ConvertHistoryRC}
          exact
          path={route_map.convert_history}
        />
        <Route component={NotFountRC} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
