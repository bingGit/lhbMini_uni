<template>
<view>
<nav-bar :navbar-data="nvabarData"></nav-bar>
<!-- 单个订单 -->
<block v-if="orderLegth==1">
  <block v-for="(subItem, subPosition) in orderDetail.sub" :key="subPosition">
    <view class="singleRoot">
      <text class="singlePrice">{{subItem.price}}元</text>
      <view class="singleDescRoot">
        <text class="singleTitle">{{subItem.title}}</text>
        <block v-if="orderDetail.begintime">
          <text class="singleTime">{{subItem.desc}}</text>
        </block>
      </view>
    </view>
  </block>
</block>

<!-- 多条 -->
<block v-if="orderLegth>1">
  <block v-for="(subItem, subPosition) in orderDetail.sub" :key="subPosition">
    <view class="singleRoot multiRoot" @tap="clickChoiceItem" :data-subItem="subItem">
      <image class="orderChoice" :src="'1'==subItem.active?orderImages.orderOn:orderImages.orderOff"></image>
      <view class="singleDescRoot">
        <view class="multiLine">
          <text class="singleTitle">{{subItem.title}}</text>
          <text class="multiPrice">{{subItem.price}}元</text>
        </view>
        <block v-if="orderDetail.begintime">
          <text class="singleTime">{{subItem.desc}}</text>
        </block>
      </view>
    </view>
  </block>
</block>

<!-- 选择优惠券 -->
<block v-if="couponPrice&&couponName">
  <view class="couponRoot" @tap="clickCoupon">
    <image class="couponNext" :src="orderImages.couponNext"></image>
    <text class="couponPrice">{{couponPrice}}</text>
    <text class="couponTitle">{{couponName}}</text>
  </view>
</block>

<block v-if="realPrice">

  <!-- 实际价格 -->
  <view class="realPrice">合计： {{realPrice}}元</view>

  <!-- 支付按钮 -->
  <view class="confirmPay" @tap="clickPay">确认订单</view>

</block>
</view>
</template>

<script>
/** 订单界面 */
const app = getApp().globalData;
const netUtils = require("../../utils/util.js");
const jumpUtils = require("../../utils/enterHelp.js");
const displayUtils = require("../../utils/displayUtils.js");
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      nvabarData: {
        showCapsule: 1,
        // 是否显示左上角胶囊按钮 1 显示 0 不显示
        title: '确认订单'
      },
      netUrl: null,
      orderDetail: null,
      orderImages: {
        couponNext: "https://uimg.gximg.cn/v/res/201912/24-18/right.png",
        orderOn: "https://uimg.gximg.cn/v/res/201912/24-18/ic_order_on.png",
        orderOff: "https://uimg.gximg.cn/v/res/201912/24-18/ic_order_off.png"
      },
      orderLegth: 0,
      // 可选订单个数
      realPrice: null,
      // 实际价钱
      couponName: null,
      // 优惠名称
      couponPrice: null,
      // 优惠价钱
      couponList: null,
      // 优惠券的列表
      choiceCouponId: null,
      // 选择的优惠券的ID
      choiceCouponEnName: null,
      // 选择的优惠券的EnName
      realPay: null // 最终支付接口

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
      netUrl: options.url // netUrl: "https%3A%2F%2Fv.xueweigui.com%2Fmorders%2Fshow%3Ftype%3D3%26id%3D1666"

    });
    this.getOrderDetailFromServer(this.netUrl); // 网络请求
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.choiceCouponId) {
      // 不空
      var newBuyUrl = this.netUrl + "&promotion_id=" + this.choiceCouponId + "&promotion_enname=" + this.choiceCouponEnName;
      this.getOrderDetailFromServer(newBuyUrl); // 网络请求
    }
  },
  methods: {
    /**
     * 获取订单详情数据
     */
    getOrderDetailFromServer: function (netUrl) {
      var that = this;
      netUtils.getRequest(netUrl, null, function (netData) {
        var orderDetail = netData.data;
        console.log(orderDetail);

        if ("9999" == orderDetail.e) {
          that.setData({
            orderDetail: netData.data
          });
          var subLength = 0; // 选项长度

          if (orderDetail.sub) {
            // 选项列表不空
            subLength = orderDetail.sub.length;
          }

          var promotionId = orderDetail.promotion_id;
          var promotionEnName = orderDetail.promotion_enname;
          var couponNameTemp = "";
          var couponPriceTemp = "";
          var promotionList = orderDetail.promotion_list;

          if (promotionList) {
            // 优惠券长度
            for (var i = 0; i < promotionList.length; i++) {
              if (promotionId == promotionList[i].id && promotionEnName == promotionList[i].enname) {
                couponNameTemp = promotionList[i].name;
                couponPriceTemp = promotionList[i].discount + promotionList[i].unit;
                break;
              }
            }
          }

          var realPriceTemp = orderDetail.price; // 价钱

          var commitUrl = orderDetail.buyurl; // 支付接口

          that.setData({
            orderLegth: subLength,
            realPrice: realPriceTemp,
            couponName: couponNameTemp,
            couponPrice: couponPriceTemp,
            couponList: promotionList,
            realPay: commitUrl + '&channel=48'
          });
        } else if ("9003" == orderDetail.e) {
          if (!netUtils.isLogin()) {
            // 未登录
            wx.navigateTo({
              url: '../login/login'
            });
          }
        } else {
          displayUtils.showsToast(orderDetail.m);
          setTimeout(function () {
            that.finish();
          }, 2200);
        }
      });
    },

    /**
     * 点击优惠券
     */
    clickCoupon: function (event) {
      var that = this;
      var couponListJson = JSON.stringify(this.couponList);
      wx.navigateTo({
        url: '../coupon/coupon?couponList=' + encodeURIComponent(couponListJson) + '&checkId=' + that.orderDetail.id + '&checkType=' + that.orderDetail.type
      });
    },

    /**
     * 点击确认支付
     */
    clickPay: function (event) {
      // 网络支付
      netUtils.getRequest(this.realPay, null, function (netData) {
        console.log(netData);

        if ("9999" == netData.data.e) {
          // 网络请求成功
          wx.redirectTo({
            url: '../pay/pay?url=' + encodeURIComponent(netData.data.r.payurl)
          });
        } else {
          displayUtils.showsToast(netData.data.m);
        }
      });
    },

    /**
     * 点击确认支付
     */
    clickChoiceItem: function (event) {
      // 点击选择条目
      console.log(event);
      var subItem = event.currentTarget.dataset.subitem;
      this.setData({
        netUrl: subItem.url
      });
      this.getOrderDetailFromServer(this.netUrl); // 网络请求
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
@import "./order.css";
</style>