<template>
<view>
<!--pages/my/my.wxml-->
<nav-bar :navbar-data="nvabarData"></nav-bar>
<view class="container">
  <view v-if="isLogin" class="topTitle">
    <image class="avatar" :src="avatar" @tap="avatarClick"></image>
    <!-- <image wx:if='{{identity.length>0&&identity!=0}}' class='vipImage' src='../images/vipImage{{identity}}.png' mode='aspectFit'></image> -->
    <view class="name">{{name}}</view>
    <view class="uid">{{uid}}</view>
    <image src="/static/pages/images/exitBtn.png" class="btn" mode="aspectFit" @tap="exitClick"></image>
  </view>
  <view v-else-if="!isLogin" class="topTitle" @tap="loginClick">
    <image class="avatar" :src="avatar"></image>
    <view class="unLogin">{{name}}</view>
    <image src="/static/pages/images/loginBtn.png" class="btn" mode="aspectFit"></image>
  </view>
  <block v-for="(item, index) in menu" :key="index">
    <view v-if="item.product_type != -9999" class="list" @tap="listClick" :data-dic="item">
      <view class="title">{{item.title}}</view>
      <view class="info">{{item.info}}</view>
      <image v-if="item.product_type.length > 0" src="/static/pages/images/right.png" mode="aspectFit" style="width:28rpx;height:40rpx;margin-right:30rpx;"></image>
    </view>
    <button v-else class="list listflex" open-type="contact" :send-message-title="item.message_title" :send-message-img="item.img" show-message-card="true" :send-message-path="item.path">
      <view>{{item.title}}</view>
      <image src="/static/pages/images/right.png" mode="aspectFit" style="width:28rpx;height:40rpx"></image>
    </button>
  </block>



</view>
<auth id="auth" @oauthFailEvent="oauthFailEvent" @bindOkEvent="bindOkEvent" backdrop="false">
</auth>
</view>
</template>

<script>
const util = require("../../utils/util.js");
const enterHelp = require("../../utils/enterHelp.js");
const userKey = 'user_msg';
const userinfo = 'userinfo';
const increTestCount = "https://v.xueweigui.com/apiWordCourse/incrTestCount";
var app = getApp().globalData;
import easyModal from "../../component/easyModal/easy/easyModal";
import canvasdrawer from "../../component/canvasdrawer/canvasdrawer";
import auth from "../../component/easyModal/auth/auth";
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      name: '未登录',
      avatar: "/static/pages/images/login.png",
      uid: '',
      identity: '',
      other: null,
      menu: [],
      isLogin: false,
      nvabarData: {
        showCapsule: 1,
        // 是否显示左上角胶囊按钮 1 显示 0 不显示
        title: '我的'
      }
    };
  },

  components: {
    easyModal,
    canvasdrawer,
    auth,
    navBar
  },
  props: {},
  onLoad: function () {
    if (!util.isLogin()) {
      console.log('go login');
      wx.navigateTo({
        url: '../login/login'
      });
    }
  },
  onReady: function () {
    this.oauthModal = this.selectComponent("#auth");
  },
  onShow: function () {
    if (util.isLogin()) {
      this.setData({
        isLogin: true
      });
      this.requestData();
    } else {
      wx.removeStorageSync(userKey);
      wx.removeStorageSync(userinfo);
      this.setData({
        isLogin: false
      });
    }

    getApp().globalData.g_has_index_toggle = true;
  },
  methods: {
    listClick: function (e) {
      let dic = e.currentTarget.dataset.dic;
      if (dic.product_type.length == 0) return; //测试题判断

      console.log('dic.other', dic.other);

      if (dic.product_type == '-9000' && dic.other.content.length != 0) {
        wx.showModal({
          title: '提示',
          content: dic.other.content,
          success: res => {
            if (res.confirm) {
              if (dic.other.count < 0 || dic.other.is_auth != 2) return;
              enterHelp.enterWithDic(e.currentTarget.dataset.dic); //次数更新

              util.getRequest(increTestCount);
            } else if (res.cancel) {}
          }
        });
        return;
      }

      enterHelp.enterWithDic(e.currentTarget.dataset.dic);
    },
    exitClick: function (e) {
      wx.removeStorageSync('cookie');
      wx.removeStorageSync(userKey);
      wx.removeStorageSync(userinfo);
      this.setData({
        isLogin: false,
        avatar: "/static/pages/images/login.png",
        uid: '',
        name: '未登录',
        menu: [],
        identity: ""
      });
      getApp().globalData.g_is_login = false;
    },
    avatarClick: function () {// if (!util.isLogin()) {
      //   wx.navigateTo({
      //     url: '../login/login',
      //   })
      // }
    },
    loginClick: function (e) {
      wx.navigateTo({
        url: '../login/login'
      });
    },
    bindOkEvent: function () {
      this.requestData();
      getApp().globalData.is_login = true;
    },
    requestData: function () {
      var that = this;
      util.getRequest("https://v.xueweigui.com/apiWeChat/home?wechat=104", {}, function (res) {
        var identity = '';

        if (res.data.userinfo.identity == '221' || res.data.userinfo.identity == '222' || res.data.userinfo.identity == '223' || res.data.userinfo.identity == '224') {
          identity = res.data.userinfo.identity; //wx.setStorageSync('identity', identity)
        } else {//wx.setStorageSync('identity', '0')
          }

        wx.setStorageSync('userinfo', res.data.userinfo); // 隐藏我的订单

        var menu = [];
        var system = wx.getSystemInfoSync().system;

        if (system.indexOf('iOS') >= 0) {
          for (var index in res.data.menu) {
            var menuDic = res.data.menu[index];

            if (menuDic.product_type != '30') {
              menu.push(menuDic);
            }
          }
        } else {
          menu = res.data.menu;
        }

        that.setData({
          name: res.data.userinfo.name,
          avatar: res.data.userinfo.avatar,
          identity: identity,
          uid: "UID:" + res.data.userinfo.uid,
          menu: menu
        }); //用于记录音频信息
        //wx.setStorageSync(userKey, res.data.userinfo);
      });
    }
  }
};
</script>
<style>
@import "./my.css";
</style>