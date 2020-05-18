<template>
<view>
<nav-bar v-if="!navBarHidden" :navbar-data="nvabarData"></nav-bar>
<view class="rank-container">
  <view :hidden="rankData.length ==0" class="rank-top">
    <view class="rank-top-detail">

    </view>
    <text class="rank-top-detail-t">{{rankData.top_text}}</text>
  </view>

  <view :hidden="rankData.self ==0" class="rank-my">
    <view class="rank-my-score">
      <text>我的排名</text>
      <text>{{rankData.self.rank}}</text>
    </view>

    <view class="rank-my-avatar">
      <image :src="rankData.self.msg.avatar"></image>
    </view>

    <view class="rank-my-nick">
      <text>{{rankData.self.msg.nickname}}</text>
      <text>UID:{{rankData.self.msg.uid}}</text>
    </view>

    <view class="rank-my-right">
      <text>{{rankData.self.msg.percent}}%</text>
      <text>正确率</text>
    </view>

    <view class="rank-my-right">
      <text>{{rankData.self.msg.duration}}秒</text>
      <text>用时</text>
    </view>

  </view>

  <view class="rank-middle">
    <view class="rank-m-top">
      <text>排名</text>
      <text>用户</text>
      <text>正确率</text>
      <text>用时</text>
    </view>

    <view v-if="rankData.data !=0">
      <block v-for="(score, idx) in rankData.data" :key="idx">
        <view class="rank-m-front">
          <view v-if="idx < 3" class="rank-m-score">
            <image :src="'https://uimg.gximg.cn/v/res/201906/11-11/paihang0' + (idx + 1) + '@3x.png'"></image>
          </view>
          <view v-else class="rank-m-score rank-m-score-s">
            <text>{{idx + 1}}</text>
          </view>
          <view class="rank-fr-avatar" :style="idx > 2 ? '' : ''">
            <view class="rank-fr-avatar1">
              <image :style="idx > 2 ? 'width:60rpx;height:60rpx;' : ''" :src="score.avatar"></image>
            </view>

            <view class="rank-fr-nick">
              <text>{{score.nickname}}</text>
              <text>UID:{{score.uid}}</text>
            </view>
          </view>

          <view class="rank-fr-common" :style="idx > 2? '' : ''">
            <text :style="idx > 2 ? 'font-size:28rpx;' : ''">{{score.percent}}%</text>
          </view>

          <view class="rank-fr-common">
            <text :style="idx > 2 ? 'font-size:28rpx;' : ''">{{score.duration}}秒</text>
          </view>

        </view>
      </block>
    </view>
    <view v-else style="text-align: center;">暂无记录</view>


  </view>

  <view class="rank-bottom">
    <view class="rank-b-top1">
      <view class="rank-b-line"></view>
      <text>活动说明</text>
      <view class="rank-b-line"></view>
    </view>

    <view class="rank-b-top2">
      <block v-for="(tip, index) in rankData.bottom_text" :key="index">
        <view class="rank-b-text">
          <text>{{tip}}</text>
        </view>
      </block>
    </view>

  </view>



</view>
</view>
</template>

<script>
var app = getApp().globalData;
const util = require("../../utils/util.js");
const userinfo = 'userinfo';
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      rankData: {},
      nvabarData: {
        showCapsule: 1,
        title: '排行榜'
      },
	  navBarHidden:false//自定义菜单是否隐藏
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
    console.log('rank--', options);
    var that = this; // options.id = 168;

    var goUrl = decodeURIComponent(options.url) || '';

    if (goUrl != 'undefined') {
      console.log('11111--', goUrl);
      wx.request({
        url: goUrl,
        data: {
          uid: wx.getStorageSync(userinfo)['uid'] || 0
        },
        method: 'get',
        header: {
          'content-type': 'application/json' // 默认值

        },

        success(res) {
          console.log('rank1111--', res);
          that.setData({
            rankData: res.data.data
          });
        }

      });
    } else {
      wx.request({
        url: 'https://v.xueweigui.com/Words/testResultGet',
        data: {
          test_id: options.id,
          uid: wx.getStorageSync(userinfo)['uid'] || 0,
          type: getApp().globalData.g_test_type,
          stime: getApp().globalData.g_test_stime,
          etime: getApp().globalData.g_test_etime
        },
        //todo 测试
        method: 'get',
        header: {
          'content-type': 'application/json' // 默认值

        },

        success(res) {
          console.log('rank2222--', res);
          that.setData({
            rankData: res.data.data
          });
        }

      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	  //自定义菜单隐藏判断
	  if(getApp().globalData.g_app == 'alipay'){
	  	this.setData({
	  		navBarHidden: true
	  	})
	  }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  methods: {}
};
</script>
<style>
@import "./rank.css";
</style>