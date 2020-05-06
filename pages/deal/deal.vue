<template>
<view>
<nav-bar :navbar-data="nvabarData"></nav-bar>
<view class="dealRoot">
  <text class="dealTitle">支付成功</text>
  <text class="dealResult">{{dealDetail.result}}</text>
  <view class="dealLine"></view>

  <block v-for="(couponItem, couponPosition) in dealDetail.message" :key="couponPosition">
    <view class="dealPoint">
      <text class="dealPointTitle">{{dealDetail.message[couponPosition][0]}}</text>
      <text class="dealPointIntro">{{dealDetail.message[couponPosition][1]}}</text>
    </view>
  </block>

  <!-- 底部按钮 -->
  <view class="confirmPay" @tap="clickPay">
    <text class="bottomTitle">{{dealDetail.btn_text}}</text>
    <block v-if="dealDetail.btn_tip">
      <text class="bottomIntro">{{dealDetail.btn_tip}}</text>
    </block>
  </view>

</view>
</view>
</template>

<script>
/** 支付结果界面 */
const app = getApp().globalData;
const netUtils = require("../../utils/util.js");
const displayUtils = require("../../utils/displayUtils.js");
const jumpUtils = require("../../utils/enterHelp.js");
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      nvabarData: {
        showCapsule: 1,
        // 是否显示左上角胶囊按钮 1 显示 0 不显示
        title: '支付结果'
      },
      netUrl: "https://v.xueweigui.com/morders/result?order_id=",
      dealDetail: null
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
    console.log(options.orderId); // 从上个界面获取数据

    this.setData({
      netUrl: this.netUrl + options.orderId
    });
    this.getDealDetailFromServer(this.netUrl); // 网络请求
  },
  methods: {
    /**
     * 获取交易详情数据
     */
    getDealDetailFromServer: function (netUrl) {
      var that = this;
      netUtils.getRequest(netUrl, null, function (netData) {
        var dealDetail = netData.data;
        console.log(dealDetail);

        if ("9999" == dealDetail.e) {
          that.setData({
            dealDetail: netData.data
          });
        }
      });
    },

    /**
     * 点击底部按钮
     */
    clickBottom: function (event) {
      console.log(this.dealDetail);

      if (this.dealDetail && this.dealDetail.product_type) {
        // 通过 PushID 进行跳转
        var jump = {
          product_type: this.dealDetail.product_type,
          url: this.dealDetail.url
        };
        jumpUtils.enterWithDic(jump);
      } else {
        // 直接关闭
        this.finish();
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
@import "./deal.css";
</style>