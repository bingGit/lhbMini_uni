<template>
<!--pages/order/myOrder.wxml-->
<scroll-view :scroll-y="isScroll" :style="'height:' + windowHeight + 'px;  background-color: #fafafa'">
  <view class="noData" v-if="data.length == 0">您当前还没有订单</view>
  <block v-for="(item, index) in data" :key="index">
    <view :data-index="index" class="order-item" @touchstart="drawStart" @touchmove="drawMove" @touchend="drawEnd" :style="'right:' + item.right + 'rpx'">
    <view class="content">
      <!-- 状态 -->
      <view v-if="item.status== 'wait'" class="status" style="color:#ff775d">{{item.status_text}}</view>
      <view v-else-if="item.status== 'succ'" class="status" style="color:#23c97d">{{item.status_text}}</view>
      <view v-else-if="item.status== 'close'" class="status" style="color:#8a8a8a">{{item.status_text}}</view>
      <view v-else-if="item.status== 'refund'" class="status" style="color:#8a8a8a">{{item.status_text}}</view>
      <!-- 订单号 -->
      <view class="orderid" style="color:#454545">订单号：{{item.id}}</view>
      <!-- 价格 -->
      <view v-if="item.status== 'wait'" class="price" style="color:#ff775d">订单号：{{item.price}}</view>
      <view v-else class="price" style="color:#454545">订单号：{{item.price}}</view>
      <!-- 产品名称 -->
      <view class="productName">{{item.product_name}}</view>
      <view class="time">下单时间：{{item.time}}</view>
      <button v-if="item.status== 'wait'" @tap="payClick" :data-url="item.payurl" class="payBtn">支付</button>
    </view>
    <view class="remove" :data-index="index" :data-url="item.closeorder" @tap="delClick">删除</view> 
    </view>
    <view style="width:100%;height:10rpx;"></view>
  </block>
</scroll-view>
</template>

<script>
/** 我的订单 */
const util = require("../../utils/util.js");
const enterHelp = require("../../utils/enterHelp.js");
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      nvabarData: {
        showCapsule: 1,
        // 是否显示左上角胶囊按钮 1 显示 0 不显示
        title: '我的订单'
      },
      delBtnWidth: 160,
      data: [],
      isScroll: true,
      windowHeight: 0,
      startY: "",
      startX: ""
    };
  },

  components: {
    navBar
  },
  props: {},
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
  },
  onShow: function (options) {
    var that = this;
    util.getRequest("https://v.xueweigui.com/apihome/myorder", null, function (res) {
      console.log(res.data);

      if (res.data.data) {
        that.setData({
          data: res.data.data
        });
      }
    });
  },
  methods: {
    drawStart: function (e) {
      // console.log("drawStart");  
      var touch = e.touches[0];

      for (var index in this.data) {
        var item = this.data[index];
        item.right = 0;
      }

      this.setData({
        data: this.data,
        startY: touch.clientY,
        startX: touch.clientX
      });
    },
    drawMove: function (e) {
      var touch = e.touches[0];
      var item = this.data[e.currentTarget.dataset.index];
      var disX = this.startX - touch.clientX;
      var disY = this.startY - touch.clientY;
      console.log(disY);

      if (disX >= 20) {
        if (disX > this.delBtnWidth) {
          disX = this.delBtnWidth;
        }

        item.right = disX;
        this.setData({
          isScroll: false,
          data: this.data
        });
      } else {
        item.right = 0;
        this.setData({
          isScroll: true,
          data: this.data
        });
      }
    },
    drawEnd: function (e) {
      var item = this.data[e.currentTarget.dataset.index];

      if (item.right >= this.delBtnWidth / 2) {
        item.right = this.delBtnWidth;
        this.setData({
          isScroll: true,
          data: this.data
        });
      } else {
        item.right = 0;
        this.setData({
          isScroll: true,
          data: this.data
        });
      }
    },
    // 删除
    delClick: function (e) {
      this.data.splice(e.target.dataset.index, 1);
      this.setData({
        data: this.data
      });

      if (e.target.dataset.url) {
        util.getRequest(e.target.dataset.url, null, function (res) {});
      }
    },
    // 支付
    payClick: function (e) {
      var url = e.target.dataset.url + '&channel=48';
      wx.navigateTo({
        url: '../pay/pay?url=' + encodeURIComponent(url)
      });
    }
  }
};
</script>
<style>
@import "./myOrder.css";
</style>