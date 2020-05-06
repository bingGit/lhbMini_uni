<template>
<view>
<!-- 登录提示 -->
<base-modal id="baseModal" :modalSize="modalSize" :animated="animated" :backdrop="backdrop">
  <view slot="header" class="modal-header">
    <text>{{title}}</text>
  </view>

  <view slot="body" class="modal-body">
    <view class="body-content">
      <view class="phone-number">
        <view class="phone-tip">手机号:</view>
        <input maxlength="11" type="number" class="phone-number-input" @input="phoneInput" :value="phoneNumber">
        </input>
      </view>
      <view class="phone-number">
        <view class="phone-tip">验证码:</view>
        <input class="phone-code" maxlength="6" type="number" @input="codeInput" :value="codeNumber">
        </input>
        <view class="code" @tap.stop="codeClick">{{code}}</view>
      </view>
    </view>
  </view>

    <view slot="footer" class="modal-footer">
         <!-- <text catchtap='_cancelModal' class='btn btn-default btn-border'>{{cancelText}}</text> -->
         <!-- <text> -->
         <!-- <view>
<button open-type='share' class='share_btn'>发给微信好友</button>
         </view> -->
         <!-- <button open-type="share" class='btn btn-primary share-btns'>{{confirmText}}</button></text> -->
         <text @tap.stop="checkCode" class="btn btn-primary">{{confirmText}}</text>      
    </view>
</base-modal>

<!-- 授权提示 -->
<base-modal id="oauthTip" :modalSize="modalSize" :animated="animated" :backdrop="backdrop">
  <view slot="header" class="modal-header">
    <!-- <text>{{oauthTitle}}</text> -->
  </view>

  <view slot="body" class="modal-body" style="text-align: centerpadding: 25rpx 0rpx 25rpx 0rpxvertical-align: middlecolor: #80848f">
  <view class="tile-modal">
    <view class="tile-avatar-warp">
    <view><text>{{cfg.oauthTipName}}</text>
</view>
    </view>
  </view>
  </view>

    <view slot="footer" class="modal-footer" style="border-top: 1rpx solid #e5e5e5color:">
         <!-- <text catchtap='_cancelOauthModal' class='btn btn-default btn-border'>{{cancelText}}</text> -->
         <!-- <text> -->
         <!-- <view>
<button open-type='share' class='share_btn'>发给微信好友</button>
         </view> -->
         <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="confirmOauthModalFun" class="btn-oauth" style="border-bottom-left-radius: 10rpx"><text style="color: #19be6b">{{cfg.oauthButtonName}}</text></button>
         <!-- </text> -->
         <!-- <text catchtap='checkCode'  class='btn btn-primary'>{{confirmText}}</text>-->
    </view>
</base-modal>
</view>
</template>

<script>
const md5 = require("../../../utils/md5.js");
const util = require("../../../utils/util.js");
const app = getApp().globalData; //TODO 复制需要替换
//TODO 复制需要替换
const oauthType = 25; // component/auth/auth.js
import baseModal from "../base/baseModal";

export default {
  data() {
    return {
      isShow: true,
      animation: '',
      code: '获取验证码',
      phoneNumber: '',
      codeNumber: '',
      enable: true,
      oauthTip: true
    };
  },

  components: {
    baseModal
  },
  props: {
    cfg: {
      type: Object,
      default: () => ({
        oauthTipName: '为了更好的体验\n需要您的授权\n(• ̀ω•́ )✧',
        oauthButtonName: '好的'
      })
    },
    title: {
      type: String,
      default: '登录'
    },
    oauthTitle: {
      type: String,
      default: '授权提示'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    backdrop: {
      type: Boolean,
      default: true
    },
    animated: {
      type: Boolean,
      default: true
    },
    modalSize: {
      type: String,
      default: "md"
    }
  },
  mounted: function () {
    //获得baseModal节点
    if (!this.selectComponent) {
      throw new Error("小程序sdk暂不支持节点操作selectComponent");
    } // if (JSON.stringify(this.data.cfg) != "{}") {
    // }


    this.baseModal = this.selectComponent('#baseModal');
    this.oauthModal = this.selectComponent('#oauthTip'); // this.baseModal.showModal();
    // this.baseModal.showModal();
    // this.oauthCheck();
    // this.wxLogin();
  },
  methods: {
    //授权查询
    oauthCheck: function () {
      var that = this;
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            that.oauthModal.showModal();
            console.log('scope.userInfo.no'); //授权登录
          } else {
            //已授权
            var U = wx.getStorageSync('cookie')['U'];

            if (U) {
              //已登录则绑定
              that.wxLogin('webbind');
              console.log('已登录则绑定');
              that.$emit("bindOkEvent");
            } else {
              that.wxLogin();
            }

            console.log('scope.userInfo.true');
          }
        }

      });
    },
    //微信登录
    wxLogin: function (category = 'weblogin') {
      console.log('wxlogin');
      var that = this;
      wx.login({
        success: function (resCode) {
          if (resCode.code) {
            console.log('code:', resCode.code);
            wx.getUserInfo({
              success: res => {
                //获取cookie & save cookie
                util.getRequest("https://passport.xueweigui.com/mobile/oauthlogin", {
                  type: oauthType,
                  category: category,
                  code: resCode.code,
                  encryptedData: res["encryptedData"],
                  iv: res['iv']
                }, function (res) {
                  console.log('login-user', res);

                  if (res.data.e != '9999') {
                    wx.showModal({
                      title: '提示',
                      content: res.data.m,
                      showCancel: false
                    });
                    return;
                  } //是否已绑定


                  if (!res.data.r.uid) {
                    that.baseModal.showModal();
                    that.$emit("oauthFailEvent");
                  } else if (util.getUserMsg() && util.getUserMsg()['ID'] != res.data.r.uid) {
                    wx.removeStorageSync('user_msg'); //更换账号则重置cookie

                    console.log('cookie', res.header["Set-Cookie"]);
                    util.saveCookie(res.header["Set-Cookie"]);
                    getApp().globalData.userInfo = util.getUserMsg();
                    console.log('wxlogin remove user_msg');
                    that.$emit("bindOkEvent");
                  } else if (res.data.r.uid && !wx.getStorageSync('cookie')) {
                    //已绑定但未写入cookie
                    console.log('cookie', res.header["Set-Cookie"]);
                    util.saveCookie(res.header["Set-Cookie"]);
                    getApp().globalData.userInfo = util.getUserMsg();
                    console.log('globalData.userInfo2', getApp().globalData.userInfo);
                    console.log('已绑定写入cookie操作');
                    that.$emit("bindOkEvent");
                  }
                });
              },
              fail: error => {
                console.log('oauth-fail', error);
              }
            }); // that.oauthLogin(res.code);
          } else {
            console.log('登录失败！' + res.errMsg);
          }
        },
        fail: function (e) {
          console.log(e);
        }
      });
    },
    //微信授权绑定
    oauthLogin: function (code, category = 'weblogin') {
      console.log('auth');
      var that = this;
      wx.getUserInfo({
        success: res => {
          //获取cookie & save cookie
          util.getRequest("https://passport.xueweigui.com/mobile/oauthlogin", {
            type: oauthType,
            category: category,
            code: code,
            encryptedData: res["encryptedData"],
            iv: res['iv']
          }, function (res) {
            console.log(res); //是否已绑定

            if (!res.data.r.uid) {
              that.baseModal.showModal();
            }
          });
        },
        fail: error => {
          console.log('oauth-fail', error);
        }
      });
    },
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
      console.log('valide-code');
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
        }; //that.codeStart();

        util.getRequest("https://passport.xueweigui.com/mobile/sendOnlyMobile", data, function (res) {
          console.log('send-code', res.data);

          if (res.data.e == '9999') {
            wx.showToast({
              title: '发送成功',
              icon: 'none'
            });
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
    //cancel
    cancelModalFun: function () {
      this.baseModal.hideModal();
    },
    //success
    confirmModalFun: function () {
      this.baseModal.hideModal();
    },
    //取消确认授权事件
    cancelOauthModalFun: function () {
      wx.showToast({
        title: '未授权会影响使用体验哦',
        icon: 'none'
      });
      this.oauthModal.hideModal();
      this.$emit("oauthFailEvent");
    },
    //确认授权事件
    confirmOauthModalFun: function (e) {
      if (e.detail.errMsg == 'getUserInfo:ok') {
        var U = wx.getStorageSync('cookie')['U'];

        if (U) {
          //已登录则绑定
          this.wxLogin('webbind');
          console.log('已登录则绑定2');
        } else {
          //绑定操作
          this.wxLogin();
        }
      } else {
        wx.showToast({
          title: '未授权会影响使用体验哦',
          icon: 'none'
        });
        this.$emit("oauthFailEvent");
      }

      console.log('oauth', e);
      this.oauthModal.hideModal();
    },
    showOauthModal: function () {
      this.oauthModal.showModal();
    },
    //校验登录
    checkCode: function () {
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
          console.log('codeNumber.length', that.codeNumber.length);
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
          console.log('codeNumber', that.codeNumber);
          util.getRequest("https://passport.xueweigui.com/mobile/fastloginreg", data, function (res) {
            console.log('login', res);

            if (res.data.e == '9999') {
              wx.showToast({
                title: '操作成功',
                icon: 'none'
              });
              that.baseModal.hideModal();
              that.wxLogin('webbind');
              util.saveCookie(res.header["Set-Cookie"]);

              if (util.getUserMsg() && util.getUserMsg()['ID'] != res.data.uid) {
                console.log('login remove user_msg');
                wx.removeStorageSync('user_msg');
              }

              getApp().globalData.userInfo = util.getUserMsg();
              console.log('globalData.userInfo2', getApp().globalData.userInfo);
              that.$emit("bindOkEvent"); //wx.navigateBack()
            } else {
              console.log('codeNumber-fail', res);
              wx.showToast({
                title: res.data.m,
                icon: 'none'
              });
            }
          });
        }
      }
    },
    //未授权提示
    oauthShow: function () {}
  }
};
</script>
<style>
@import "./auth.css";
</style>