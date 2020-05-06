<template>
<view>
<nav-bar :navbar-data="nvabarData"></nav-bar>
<view class="container" style="background-color:white">
  <view class="inputView" style>
    <view class="title">手机号</view>
    <input class="inputText" type="number" maxlength="11" @input="phoneInput" auto-focus="true" :value="phoneNumber"></input>
  </view>
  <view class="lineView"></view>
  <view class="inputView" style="margin-top:10rpx">
    <view class="title">验证码</view>
    <input class="inputText" type="number" maxlength="11" @input="codeInput" :value="codeNumber"></input>
    <view class="code" @tap="codeClick">{{code}}</view>
  </view>
  <view class="lineView"></view>
  <view class="loginBtn" @tap="bindingClick">绑定</view>
</view>
</view>
</template>

<script>
// pages/login/bindingPhone.js
const md5 = require("../../utils/md5.js");
const util = require("../../utils/util.js");
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      code: '获取验证码',
      phoneNumber: '',
      codeNumber: '',
      enable: true,
      nvabarData: {
        showCapsule: 1,
        // 是否显示左上角胶囊按钮 1 显示 0 不显示
        title: '绑定手机号'
      }
    };
  },

  components: {
    navBar
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  methods: {
    phoneInput: function (e) {
      this.setData({
        phoneNumber: e.detail.value
      });
    },
    codeInput: function (e) {
      this.setData({
        codeNumber: e.detail.value
      });
    },
    //获取验证码
    codeClick: function () {
      var that = this;

      if (that.phoneNumber.length == 0) {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
      } else if (that.phoneNumber.length != 11 || that.isWrong) {
        wx.showToast({
          title: '请输入正确手机号',
          icon: 'none'
        });
      } else if (that.code == '获取验证码') {
        var keyStr = "guixue" + md5.hexMD5(that.phoneNumber); //创建参数

        var data = {
          mobile: that.phoneNumber,
          k: md5.hexMD5(keyStr)
        };
        console.log(data);
        util.postRequest("https://passport.xueweigui.com/mobile/send", data, function (res) {
          console.log(res.data);

          if (res.data.e == '9999') {
            that.codeStart();
          } else {
            wx.showToast({
              title: res.data.m,
              icon: 'none'
            });
          }
        });
      }
    },
    codeStart: function () {
      var that = this; //验证码倒计时

      that.setData({
        code: '60s'
      });
      var id = setInterval(function () {
        that.setData({
          code: parseInt(that.code) - 1 + 's'
        });

        if (parseInt(that.code) == 0) {
          that.setData({
            code: '获取验证码'
          });
          clearInterval(id);
        }
      }, 1000);
    },
    //验证码登录
    bindingClick: function () {
      var that = this;

      if (that.enable) {
        if (that.phoneNumber.length == 0) {
          wx.showToast({
            title: '请输入手机号',
            icon: 'none'
          });
        } else if (that.phoneNumber.length != 11 || that.isWrong) {
          wx.showToast({
            title: '请输入正确手机号',
            icon: 'none'
          });
        } else if (that.codeNumber.length < 4) {
          wx.showToast({
            title: '验证码错误',
            icon: 'none'
          });
        } else {
          that.setData({
            enable: false
          });
          setTimeout(function () {
            that.setData({
              enable: true
            });
          }, 5000);
          var data = {
            mobile: that.phoneNumber,
            captcha: that.codeNumber
          };
          util.postRequest("https://passport.xueweigui.com/mobile/verify", data, function (res) {
            console.log(res);

            if (res.data.e == '9999') {
              wx.showToast({
                title: res.data.m
              });
              wx.navigateBack();
            } else {
              wx.showToast({
                title: res.data.m,
                icon: 'none'
              });
            }
          });
        }
      }
    }
  }
};
</script>
<style>
@import "./bindingPhone.css";
</style>