import React, { useEffect } from "react";
import moment from "moment";
import { connect } from "dva";
import { injectIntl } from "react-intl";

import { withStyles } from "@material-ui/core/styles";

import { Iconfont, Table, message } from "../../lib";
import helper from "../../utils/helper";
import styles from "./history.style";

function ConvertHistory(props) {
  const { classes, layout, convert, dispatch } = props;

  useEffect(() => {
    dispatch({
      type: "convert/getConvertOrders",
      payload: {},
    });
  }, [dispatch]);

  const titles = [
    {
      title: props.intl.formatMessage({
        id: "时间",
      }),
      key: "created",
      render: (text, row) => {
        return (
          <span>
            {moment.utc(Number(text)).local().format("MM-DD HH:mm:ss")}
          </span>
        );
      },
    },
    {
      title: props.intl.formatMessage({
        id: "兑换数量",
      }),
      key: "offeringsQuantity",
      render: (text, row) => {
        return (
          <span>
            {row.offeringsQuantity} {row.offeringsTokenName}
          </span>
        );
      },
    },
    {
      title: props.intl.formatMessage({
        id: "支付数量",
      }),
      key: "purchaseQuantity",
      render: (text, row) => {
        return (
          <span>
            {row.purchaseQuantity} {row.purchaseTokenName}
          </span>
        );
      },
    },
    {
      title: props.intl.formatMessage({
        id: "单价",
      }),
      key: "price",
      render: (text, row) => {
        return (
          <span>
            {row.price} {row.purchaseTokenName}
          </span>
        );
      },
    },

    {
      title: props.intl.formatMessage({
        id: "订单状态",
      }),
      key: "status",
      render: (text) => {
        switch (text) {
          case 1:
            return (
              <span>
                {props.intl.formatMessage({
                  id: "未付款",
                })}
              </span>
            );
          case 2:
            return (
              <span>
                {props.intl.formatMessage({
                  id: "已付款",
                })}
              </span>
            );
          case 3:
            return (
              <span>
                {props.intl.formatMessage({
                  id: "付款失败",
                })}
              </span>
            );
          default:
            return "";
        }
      },
    },
    {
      title: props.intl.formatMessage({
        id: "手续费",
      }),
      key: "",
      render: (text, row) => {
        return "--";
      },
    },
  ];

  const handleGetMore = () => {
    dispatch({
      type: "convert/getConvertOrders",
    });
  };
  return (
    <div className={classes.convertHistory}>
      <h2>{props.intl.formatMessage({ id: "闪兑订单" })}</h2>
      <div className={classes.convertHistoryTable}>
        <Table
          widthStyle={classes.order_table_width}
          data={convert.orders}
          titles={titles}
          hasMore={convert.ordersHasMore}
          loading={
            layout.userinfo && layout.userinfo.userId
              ? Boolean(props.loading.effects["convert/getConvertOrders"])
              : false
          }
          showNoMoreData={true}
          useWindow={false}
          getMore={handleGetMore}
        />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading,
    convert: state.convert,
    layout: state.layout,
  };
}

export default withStyles(styles)(
  connect(mapStateToProps)(injectIntl(ConvertHistory))
);
