<template>
<view>
<nav-bar v-if="!navBarHidden" :navbar-data="nvabarData"></nav-bar>
<view class="container" style="background-color:white">
  <view class="inputView" style="margin-top:80rpx">
    <view class="title">手机号</view>
    <input class="inputText" type="number" maxlength="11" @input="phoneInput" :value="phoneNumber"></input>
  </view>
  <view class="lineView"></view>
  <view class="inputView" style="margin-top:20rpx">
    <view class="title">验证码</view>
    <input class="inputText" type="number" maxlength="11" @input="codeInput" :value="codeNumber"></input>
    <view class="code" @tap="codeClick">{{code}}</view>
  </view>
  <view class="lineView"></view>
  <view class="loginBtn" @tap="loginClick">登录</view>
<!-- <button class="thirdBtn" @tap="thirdClick" open-type="getAuthorize" scope="userInfo" @onGetAuthorize="onGetAuthorize"  @getuserinfo="getUserInfo">
  <image src="/static/pages/images/weixin_icon.png" mode="aspectFit" style="width: 60rpx; height: 60rpx;"></image>
  <text class="loginText">微信登录</text>
</button> -->
</view>
<!-- <auth id="auth" ref="auth" :cfg="oauth_cfg" @oauthFailEvent="oauthFailEvent" @bindOkEvent="bindOkEvent" backdrop="false">
</auth> -->
</view>
</template>

<script>
const md5 = require("../../utils/md5.js");
const util = require("../../utils/util.js");
const app = getApp().globalData;
import auth from "../../component/easyModal/auth/auth";
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      code: '获取验证码',
      phoneNumber: '',
      codeNumber: '',
      enable: true,
      thirdEnable: true,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      wxCode: '',
      oauth_cfg: {
        oauthTipName: '为了更好的体验\n需要您的授权\n(• ̀ω•́ )✧',
        oauthButtonName: '好的'
      },
      nvabarData: {
        showCapsule: 1,
        // 是否显示左上角胶囊按钮 1 显示 0 不显示
        title: '登录'
      },
	  navBarHidden:false//自定义菜单是否隐藏
    };
  },

  components: {
    // auth,
    navBar
  },
  props: {},
  onLoad: function () {
    var that = this;
    wx.login({
      success: function (res) {
        that.setData({
          wxCode: res.code
        });
      }
    });
  },
  onReady: function () {
    // this.oauthModal = this.selectComponent("#auth");
	this.oauthModal = this.$refs.auth;
  },
  onShow:function(){
	  //自定义菜单隐藏判断
	  if(getApp().globalData.g_app == 'alipay'){
	  	this.setData({
	  		navBarHidden: true
	  	})
	  }
  },
  methods: {
    phoneInput: function (e) {
      this.setData({
        phoneNumber: e.detail.value
      });
    },
	onGetAuthorize(res) {  
	                 my.getOpenUserInfo({  
	                  fail: (res) => {  
	                  },  
	                  success: (res) => {  
	                    let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response  
	                  }  
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
        util.getRequest("https://passport.xueweigui.com/mobile/sendOnlyMobile?bb=bb&db_cache=1", data, function (res) {
          console.log(res);

          if (res.data.e == '9999') {
			  wx.showToast({
			   title: '发送成功' });
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
    loginClick: function () {
      var that = this
	  //alipay 授权
	  //util.aliOauth();
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
          util.getRequest("https://passport.xueweigui.com/mobile/fastloginreg", data, function (res) {
            console.log(res);
            if (res.data.e == '9999') {
			  wx.showToast({
			    title: '登录成功'
			  });
              setTimeout(function () {
                getApp().globalData.g_is_login = true;
				let cookieVal = res.header['Set-Cookie'] || res.header['set-cookie'];
				console.log('cookie-save',cookieVal);
				util.saveCookie(cookieVal);
                //util.saveCookie(res.header["Set-Cookie"]);
                wx.navigateBack();
              }, 1500);
            } else {
              wx.showToast({
                title: '手机号或验证码错误',
                icon: 'none'
              });
            }
          });
        }
      }
    },
    thirdClick: function () {
      this.oauthModal.oauthCheck();
    },
    //授权失败 
    oauthFailEvent: function () {
      console.log('未授权');
    },
    //绑定成功
    bindOkEvent: function () {
      console.log('绑定成功11');
      wx.showToast({
        title: '登录成功'
      });
      getApp().globalData.g_is_login = true;
      setTimeout(function () {
        wx.switchTab({
          url: '/pages/my/my'
        });
      }, 1500);
    },
    getUserInfo: function (e) {
      console.log('logig', e); // this.oauthModal.oauthCheck();

      return;
      var that = this; //发起网络请求

      if (this.wxCode) {
        var data = {
          code: this.wxCode,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        };
        that.wxLogin(data);
      } else {
        wx.login({
          success: function (res) {
            var data = {
              code: res.code,
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData
            };
            that.wxLogin(data);
          }
        });
      }
    },
    wxLogin: function (data) {
      console.log(data);
      util.getRequest("https://passport.xueweigui.com/mobile/oauthlogin?type=22", data, function (res) {
        console.log(res);
        if (res.data.e == '9999') {
			console.log('getApp().globalData.g_app',getApp().globalData.g_app);
			let cookie_key = 'Set-Cookie';
			let cookieVal = '';
			if(getApp().globalData.g_app == 'alipay'){
			   //cookie_key = 'set-cookie';
			   //cookieVal = res.header[cookie_key][0];
			} else {
				cookieVal = res.header[cookie_key];
			}
			cookieVal = res.header[cookie_key];
			console.log('set-cookie',cookieVal);
			util.saveCookie(cookieVal);
            wx.navigateBack();
        } else {
          wx.showToast({
            title: res.data.m,
            icon: 'none'
          });
        }
      });
    },
    // 重新授权
    againAuthorize: function (data) {
      var that = this;
      wx.openSetting({
        complete: function (res) {
          console.log(res.authSetting);

          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                console.log(res);
                data.iv = res.iv;
                data.encryptedData = res.encryptedData; //调用服务端接口

                that.wxLogin(data);
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style>
@import "./login.css";
</style>