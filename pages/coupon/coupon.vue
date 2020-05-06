<template>
<view>
<nav-bar :navbar-data="nvabarData"></nav-bar>
<block v-for="(couponItem, couponPosition) in couponList" :key="couponPosition">
  <view class="couponRoot" @tap="clickCoupon" :data-couponItem="couponItem">
    <image class="couponBackground" mode="scaleToFill" :src="couponImages.couponBackground"></image>
    <view class="couponContent couponLeft">
      <text :class="'couponPrice' + (couponItem.isOverTime?' overTime':'')">{{couponItem.discount}}</text>
      <text :class="'couponUnit' + (couponItem.isOverTime?' overTime':'')">{{couponItem.unit}}</text>
    </view>
    <view class="couponContent couponRight">
      <text :class="'couponTitle' + (couponItem.isOverTime?' overTime':'')">{{couponItem.product}}</text>
      <text :class="'couponIntro' + (couponItem.isOverTime?' overTime':'')">{{couponItem.condition}}</text>
      <text :class="'couponTime' + (couponItem.isOverTime?' overTime':'')">有效期至：{{couponItem.expire}}</text>
    </view>
    <block v-if="couponItem.isOverTime">
      <image class="couponOverTime" mode="scaleToFill" :src="couponImages.couponOverTime"></image>
    </block>
  </view>
</block>
</view>
</template>

<script>
/** 优惠券界面 */
const app = getApp().globalData;
const displayUtils = require("../../utils/displayUtils.js");
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      couponList: [],
      checkId: null,
      checkType: null,
      couponImages: {
        couponBackground: "https://uimg.gximg.cn/v/res/201912/24-18/ic_coupon.png",
        couponOverTime: "https://uimg.gximg.cn/v/res/201912/24-18/ic_over_time.png"
      },
      nvabarData: {
        showCapsule: 1,
        // 是否显示左上角胶囊按钮 1 显示 0 不显示
        title: '我的优惠券'
      },
      choiceCouponId: "",
      choiceCouponEnName: ""
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
    var couponListJson = options.couponList;
    var couponListTemp = JSON.parse(decodeURIComponent(couponListJson));
    var promotionList = [];
    couponListTemp.forEach(function (element, index, array) {
      if ("couponcode" != element.enname) {
        element.isOverTime = false;

        if (element.status && '已过期' == element.status) {
          element.isOverTime = true;
        }

        promotionList.push(element);
      }
    });
    this.setData({
      couponList: promotionList,
      checkId: options.checkId,
      checkType: options.checkType
    });
  },
  methods: {
    /**
     * 点击优惠券条目
     */
    clickCoupon: function (event) {
      var couponItem = event.currentTarget.dataset.couponitem;

      if (couponItem && !couponItem.isOverTime) {
        var pageList = getCurrentPages();
        var lastPage = pageList[pageList.length - 2];

        if ("pages/order/order" == lastPage.route) {
          lastPage.setData({
            choiceCouponId: couponItem.id,
            // 选择的优惠券的ID
            choiceCouponEnName: couponItem.enname // 选择的优惠券的EnName

          });
          wx.navigateBack({
            delta: 1
          });
        }
      }
    }
  }
};
</script>
<style>
@import "./coupon.css";
</style>