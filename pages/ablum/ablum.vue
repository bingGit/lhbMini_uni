<template>
<view>
<nav-bar :navbar-data="nvabarData"></nav-bar>
<auth id="auth" :cfg="oauth_cfg" @oauthFailEvent="oauthFailEvent" @bindOkEvent="bindOkEvent" backdrop="false">
</auth>
<!-- <movable-area style="height: {{win_height}}px; width: 100%;"> -->
  <view class="container">
    <!-- <scroll-view style='height:{{win_height}}px;' scroll-y> -->
    <view v-for="(album, idx) in albums" :key="idx">
      <block data-type="template" data-is="ablum-list" data-attr="album:album,idx:idx,selectId:selectId,muted:muted,coverHidden:coverHidden">
  <view @tap.stop="goAlbum" :data-url="album['url']" :data-idx="idx" :data-id="album['id']" class="ablum-list-container">

    <view v-if="album['product_type'] != 7010" class="ablum-list-item">
      <image class="ablum-list-img" :src="album['cover']"></image>
    </view>

    <view v-if="album['product_type'] == 7010" class="ablum-view-c">
      <video autoplay="false" :muted="muted" custom-cache="false" class="ablum-video" objectFit="fill" enable-play-gesture="true" id="myVideo" :src="coverHidden ? album['url'] : ''" controls>
        <cover-image @tap.stop="videoPlay" :data-idx="idx" :data-url="album['url']" :data-id="album['id']" :hidden="coverHidden" class="ablum-list-img ablum-video-img" :src="album['cover']"></cover-image>
        <!-- <image wx:if="{{selectId != album['id']}}" class='ablum-list-img ablum-video-img' src="{{album['cover']}}" mode='aspectFill'></image> -->
      </video>
    </view>
  </view>

</block>
    </view>
    <!-- </scroll-view> -->

    <!-- 悬浮窗 -->
    <!-- <movable-view catchtap='goDetail' hidden='{{playFloatHidden}}' class="play-float{{playFloating ? ' xuanzhun' : ''}}" x="{{280}}" y="{{450}}" direction="all"> -->
      <view @tap.stop="goDetail" :hidden="playFloatHidden" :class="'play-float' + (playFloating ? ' xuanzhun' : '')">
      <image :src="playFloatCover"></image>
      </view>
    <!-- </movable-view> -->

  </view>
<!-- </movable-area> -->
</view>
</template>

<script>
var util = require("../../utils/util");
const app = getApp().globalData;
var listUrl = 'https://v.guixue.com/ApiWordCourse/list';
var unitUrl = "https://v.xueweigui.com/ApiWordCourse/unitList?book_id=";
import auth from "../../component/easyModal/auth/auth";
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      albums: [],
      is_oauth: true,
      win_height: getApp().globalData.g_win_height,
      coverHidden: false,
      playFloatHidden: true,
      playFloating: false,
      playFloatCover: '',
      muted: false,
      //是否静音播放
      oauth_cfg: {
        oauthTipName: '为了更好的体验\n需要您的授权\n(• ̀ω•́ )✧',
        oauthButtonName: '好的'
      },
      nvabarData: {
        showCapsule: 0,
        // 是否显示左上角胶囊按钮 1 显示 0 不显示
        title: '刘洪波讲单词'
      },
      selectId: "",
      videoPlaying: false,
      coverPlay: false
    };
  },

  components: {
    auth,
    navBar
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload');
    wx.showLoading({
      title: '加载中...'
    });
    wx.getSystemInfo({
      success: function (res) {
        getApp().globalData.g_is_huawei = res.model.indexOf('HUAWEI') != -1 ? true : false;
      }
    }); //判断是播放视频or 音频

    if (!getApp().globalData.g_audio_obj) {
      getApp().globalData.g_audio_obj = wx.getBackgroundAudioManager();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady');
    this.oauthModal = this.selectComponent("#auth");
    this.videoContext = wx.createVideoContext('myVideo');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    this.videoContext = wx.createVideoContext('myVideo');

    this.videoContext.bindplay = () => {
      that.setData({
        videoPlaying: true
      });
    };

    wx.hideLoading();
    this.dataLoad();

    if (getApp().globalData.g_has_index_toggle) {
      this.setData({
        coverHidden: false,
        muted: true
      });
      this.videoContext.stop();
    }

    ; //浮动播放

    var playRecord = util.getListenRecord();

    if (playRecord || getApp().globalData.g_audio_playing != null) {
      this.setData({
        playFloatHidden: false,
        playFloatCover: getApp().globalData.g_audio_cover_square.length > 0 ? getApp().globalData.g_audio_cover_square : playRecord.cover
      });

      if (getApp().globalData.g_audio_playing) {
        this.setData({
          playFloating: true
        });
      } else {
        this.setData({
          playFloating: false
        });
      }
    }

    this.screenResize();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.videoContext.pause();
    this.videoContext.stop();
    this.setData({
      videoPlaying: false,
      coverHidden: false,
      muted: true
    });
    console.log('onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      videoPlaying: false
    });
    this.videoContext.stop();
    console.log('on unload');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '刘洪波讲单词',
      path: '/pages/ablum/ablum'
    };
  },
  methods: {
    dataLoad: function () {
      var that = this;
      util.getRequest(listUrl, {}, function (res) {
        if (res.data.e != '9999') {
          wx.showToast({
            title: '网络繁忙,稍后重试',
            icon: 'none'
          });
        } else {
          that.setData({
            albums: res.data.data
          });
        } //console.log(that.data.albums);

      });
    },
    //当前点击ablum事件
    clickAblum: function (event) {
      let id = event.currentTarget.dataset.id;
      this.setData({
        selectId: id
      });
    },
    //授权失败 
    oauthFailEvent: function () {
      console.log('未授权');
    },
    //绑定成功
    bindOkEvent: function () {
      console.log('绑定成功');
    },
    onResize: function (res) {
      console.log('屏幕方向旋转', res);
    },
    goAlbum: function (event) {
      //已授权且登录
      console.log('app.globalData.g_is_login', getApp().globalData.g_is_login);

      if (!getApp().globalData.g_is_login) {
        wx.switchTab({
          url: '/pages/my/my'
        });
        return;
      }

      let url = encodeURIComponent(event.currentTarget.dataset.url);
      let id = event.currentTarget.dataset.id;
      let idx = event.currentTarget.dataset.idx;

      if (url.length == 0) {
        wx.showToast({
          title: '详情地址错误',
          icon: "none"
        });
        return;
      }

      if (idx != 0) {
        this.setData({
          coverHidden: false
        });
        this.videoContext.pause();
      }

      if (this.albums[idx]['product_type'] == 7010) {
        return;
      }

      getApp().globalData.g_audio_ablum_temid = idx;
      wx.navigateTo({
        url: '/pages/ablum/ablum-detail?url=' + url + '&id=' + id
      });
    },
    //播放视频触发
    videoPlay: function (event) {
      var that = this;
      this.setData({
        coverHidden: true,
        videoPlaying: true,
        muted: false,
        coverPlay: true //观看试播放

      });
      this.videoContext.play();
      getApp().globalData.g_has_index_toggle = false;

      if (getApp().globalData.g_audio_playing) {
        this.setData({
          playFloating: false
        });
        getApp().globalData.g_audio_obj.pause();
      }

      setTimeout(function () {
        that.videoContext.play();
      }, 1000);
      console.log('play video');
    },
    //暂停视频触发
    videoPause: function (e) {
      console.log('暂停视频触发', e);
      this.setData({
        videoPlaying: false
      }); // this.videoContext.pause();
    },
    //判断横竖屏
    screenResize: function () {
      var lastState,
          nowState = 0;
      let lastTime = Date.now();
      wx.startAccelerometer();
      wx.onAccelerometerChange(res => {
        const now = Date.now(); // 500ms检测一次

        if (now - lastTime < 500) {
          return;
        }

        lastTime = now;
        let nowState; // 57.3 = 180 / Math.PI

        const Roll = Math.atan2(-res.x, Math.sqrt(res.y * res.y + res.z * res.z)) * 57.3;
        const Pitch = Math.atan2(res.y, res.z) * 57.3; // 横屏状态

        if (Roll > 50) {
          if (Pitch > -180 && Pitch < -60 || Pitch > 130) {
            nowState = 1;
          } else {
            nowState = lastState;
          }
        } else if (Roll > 0 && Roll < 30 || Roll < 0 && Roll > -30) {
          let absPitch = Math.abs(Pitch); // 如果手机平躺，保持原状态不变，40容错率

          if (absPitch > 140 || absPitch < 40) {
            nowState = lastState;
          } else if (Pitch < 0) {
            /*收集竖向正立的情况*/
            nowState = 0;
          } else {
            nowState = lastState;
          }
        } else {
          nowState = lastState;
        } // 状态变化时，触发


        if (nowState !== lastState) {
          lastState = nowState;

          if (nowState === 1) {
            this.videoPlaying ? this.videoContext.requestFullScreen() : null;
            console.log('change:横屏');
          } else {
            this.videoContext.exitFullScreen();
            console.log('change:竖屏');
          }
        }
      });
    },
    //直接跳详情请求数据
    reqBookData: function () {
      var that = this; //console.log(util.getListenRecord().book_id, util.getListenRecord());

      let url = unitUrl + util.getListenRecord().book_id;
      getApp().globalData.g_audio_pid = util.getListenRecord().pid;
      getApp().globalData.g_audio_idx = util.getListenRecord().idx;
      getApp().globalData.g_audio_seeker = util.getListenRecord().time;
      getApp().globalData.g_audio_bookid = util.getListenRecord().book_id;
      util.getRequest(url, {}, function (res) {
        if (res.data.e != '9999') {
          wx.showToast({
            title: '网络繁忙,稍后重试',
            icon: 'none'
          });
        } else {
          res.data.data.map(reg => reg.audio = JSON.parse(util.secret(reg.media, reg.media_iv)));
          getApp().globalData.g_auth_msg = res.data.auth;
          getApp().globalData.g_audio_auth = res.data.auth.status == 0 ? false : true;
          getApp().globalData.g_try_time = res.data.auth.try_time;
          getApp().globalData.g_audio_plen = res.data.data.length;
          getApp().globalData.g_req_data = res.data.data; //console.log(res);

          wx.navigateTo({
            url: '/pages/ablum/ablum-content?float=1&pid=' + util.getListenRecord().pid
          });
        }
      });
    },
    //进入收听详情
    goDetail: function () {
      getApp().globalData.g_audio_ablum_temid = util.getListenRecord().tmp_id || 0; //console.log('go-detail--', util.getListenRecord(),util.getListenRecord().tmp_id);

      this.reqBookData();
    },
    //监听操作
    audioManagerLister: function () {
      var that = this; //监听背景音频播放错误事件

      getApp().globalData.g_audio_obj.onError(function () {
        console.log('onError0');
      }); //监听背景音频播放事件

      getApp().globalData.g_audio_obj.onPlay(function () {
        that.setData({
          playFloating: true
        });
        console.log('onPlay0');
      }); //监听背景音频暂停事件

      getApp().globalData.g_audio_obj.onPause(function () {
        that.setData({
          playFloating: false
        });
        console.log('onPause0');
      });
      getApp().globalData.g_audio_obj.onEnded(function () {
        that.setData({
          playFloating: false
        });
        console.log('onEnded0');
      });
      getApp().globalData.g_audio_obj.onStop(function () {
        that.setData({
          playFloating: false
        });
        console.log('onStop0');
      });
    }
  }
};
</script>
<style>
@import "./ablum.css";
</style>