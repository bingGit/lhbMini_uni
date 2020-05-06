<template>
<view>
<nav-bar :navbar-data="nvabarData"></nav-bar>
<view class="payRoot">
  <text class="payTitle">订单提交成功</text>
  <text class="payNumber">订单号{{payDetail.payment.order_id}}</text>
  <text class="payAllPrice">应付金额：{{payDetail.payment.order_amt}}元</text>
  <block v-if="payDetail.payment.amount">
    <text class="payRealPrice">{{payDetail.payment.amount}}</text>
  </block>
  <!-- 支付按钮 -->
  <form @submit="clickPay" report-submit="true">
    <button class="removeButtonStyle confirmPay" formType="submit">
      <view class="confirmPay" @tap="clickPay">确认支付</view>
    </button>
  </form>
</view>
</view>
</template>

<script>
/** 订单界面 */
const app = getApp().globalData;
const netUtils = require("../../utils/util.js");
const displayUtils = require("../../utils/displayUtils.js");
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      nvabarData: {
        showCapsule: 1,
        // 是否显示左上角胶囊按钮 1 显示 0 不显示
        title: '支付订单'
      },
      netUrl: null,
      payDetail: null
    };
  },

  components: {
    navBar
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      netUrl: options.url
    });
    this.getPayDetailFromServer(this.netUrl); // 网络请求
  },
  methods: {
    /**
     * 获取订单详情数据
     */
    getPayDetailFromServer: function (netUrl) {
      var that = this;
      netUtils.getRequest(netUrl, null, function (netData) {
        var payDetail = netData.data;
        console.log(payDetail);

        if ("9999" == payDetail.e) {
          that.setData({
            payDetail: netData.data
          });
        }
      });
    },

    /**
     * 点击确认支付
     */
    clickPay: function (event) {
      // 网络支付
      getApp().globalData.collectFormId(event.detail.formId); // 收集表单标识

      var that = this;

      if (this.payDetail && this.payDetail.payment && this.payDetail.payment.sdk && this.payDetail.payment.sdk.length > 0) {
        // 微信支付
        netUtils.getRequest(this.payDetail.payment.sdk[0].url, null, function (netData) {
          console.log(netData);

          if (200 == netData.statusCode) {
            wx.requestPayment({
              timeStamp: netData.data.timeStamp,
              nonceStr: netData.data.nonceStr,
              package: netData.data.package,
              signType: netData.data.signType,
              paySign: netData.data.paySign,
              success: function (res) {
                // 支付成功
                that.goPayResult(); // 支付完成-重定向完成的界面
              },
              fail: function (res) {
                // 支付失败
                console.log(res);
                displayUtils.showsToast("支付失败");
              }
            });
          }
        });
      } else if (this.payDetail.payment.confirm_url) {
        netUtils.getRequest(this.payDetail.payment.confirm_url, null, function (netData) {
          console.log(netData);
          that.goPayResult(); // 支付完成-重定向完成的界面
        });
      }
    },

    /**
     * 跳转结果界面
     */
    goPayResult: function () {
      if (this.payDetail && this.payDetail.payment && this.payDetail.payment.order_id) {
        wx.redirectTo({
          url: '../deal/deal?orderId=' + this.payDetail.payment.order_id
        });
      }
    },

    /**
     * 关闭当前界面
     */
    finish: function () {
      wx.navigateBack({
        delta: 1
      });
    }
  }
};
</script>
<style>
@import "./pay.css";
</style>