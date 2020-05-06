<template>
<view>
<!--pages/login/changePhone.wxml-->
<nav-bar :navbar-data="nvabarData"></nav-bar>
<view class="root">
	<!-- <image src="../../images/login/login_top.png" mode="widthFix" class="topImage"></image> -->
	<!-- <image src="../../images/login/login_bottom.png" mode="widthFix" class="bottomImage"></image> -->
	<view class="mainView2">
		<view class="login-title">更换手机号</view>
		<view class="login-inputView">
			<input class="login-input" value type="number" placeholder="输入旧手机号" placeholder-class="login-input2" @input="oldPhoneInput"></input>
		</view>
		<view class="login-inputLine"></view>
		<view class="login-inputView">
			<input class="login-input" value type="number" placeholder="输入新手机号" placeholder-class="login-input2" @input="phoneInput"></input>
		</view>
		<view class="login-inputLine"></view>
    <view class="login-inputView">
      <input class="login-input" :focus="isFocus" value type="number" placeholder="输入验证码" placeholder-class="login-input2" @input="codeInput"></input>
      <view class="getCode" @tap="getCode" :style="'opacity:' + (phoneNumber.length?1.0:0.5) + ';'">
        <text v-if="!isLoading">{{code}}</text>
        <mp-loading type="circle" :show="isLoading" tips></mp-loading>
      </view>
    </view>
    <view class="login-inputLine"></view>
    <view class="loginBtn" @tap="confirmTap" style>确定</view>
	</view>
</view>
</view>
</template>

<script>
// pages/login/changePhone.js
const md5 = require("../../utils/md5.js");
const util = require("../../utils/util.js");
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      phoneNumber: '',
      oldPhoneNumber: '',
      codeNumber: '',
      code: "获取验证码",
      enable: true,
      isFocus: false,
      isLoading: false,
      nvabarData: {
        showCapsule: 1,
        // 是否显示左上角胶囊按钮 1 显示 0 不显示
        title: '更换手机号'
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    phoneInput: function (e) {
      this.setData({
        phoneNumber: e.detail.value
      });
    },
    oldPhoneInput: function (e) {
      this.setData({
        oldPhoneNumber: e.detail.value
      });
    },
    codeInput: function (e) {
      this.setData({
        codeNumber: e.detail.value
      });

      if (e.detail.value.length == 6) {
        this.confirmTap();
      }
    },
    getCode: function () {
      console.log("getCode");

      if (this.phoneNumber.length == 0) {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
      } else if (this.phoneNumber.length < 11) {
        wx.showToast({
          title: '请输入正确手机号',
          icon: 'none'
        });
      } else if (this.code == '获取验证码') {
        //消除空格
        this.phoneNumber = this.phoneNumber.replace(/\s*/g, "");

        if (this.phoneNumber.length > 11) {
          this.phoneNumber = this.phoneNumber.substring(0, 11);
        }

        this.requestBindCode();
      }
    },
    requestBindCode: function () {
      var that = this;
      var keyStr = "X&W!G19gx" + md5.hexMD5(that.phoneNumber); //创建参数

      var data = {
        mobile: that.phoneNumber,
        k: md5.hexMD5(keyStr),
        op: '12'
      };
      console.log(data);
      this.setData({
        isLoading: true
      });
      util.getRequest("https://passport.xueweigui.com/mobile/sendCode", data, function (res) {
        console.log(res.data);
        that.setData({
          isLoading: false
        });

        if (res.data.e == '9999') {
          that.codeStart();
        }

        wx.showToast({
          title: res.data.m,
          icon: 'none'
        });
      });
    },
    codeStart: function () {
      var that = this; //验证码倒计时

      that.setData({
        isFocus: true,
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
    confirmTap: function () {
      if (this.enable) {
        if (this.oldPhoneNumber.length != 11) {
          wx.showToast({
            title: '旧手机号格式错误',
            icon: 'none'
          });
        } else if (this.phoneNumber.length != 11) {
          wx.showToast({
            title: '新手机号格式错误',
            icon: 'none'
          });
        } else if (this.codeNumber.length < 4) {
          wx.showToast({
            title: '验证码错误',
            icon: 'none'
          });
        } else {
          this.setData({
            enable: false
          });
          setTimeout(function () {
            this.setData({
              enable: true
            });
          }.bind(this), 5000);
          var data = {
            oldmobile: this.oldPhoneNumber,
            mobile: this.phoneNumber,
            captcha: this.codeNumber
          };
          util.getRequest("https://passport.xueweigui.com/mobile/reBind", data, function (res) {
            wx.showToast({
              title: res.data.m,
              icon: 'none'
            });

            if (res.data.e == '9999') {
              wx.navigateBack({
                delta: 1
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
@import "./changePhone.css";
</style>