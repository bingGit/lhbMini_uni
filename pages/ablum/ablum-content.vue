<template>
<view>
<nav-bar :navbar-data="nvabarData"></nav-bar>
<view class="ablum-content-container">
  <view class="ablum-c-cover">
    <image :src="cover"></image>
  </view>
  <view class="ablum-c-title">{{audioTitle}}</view>
  <!-- 进度条 -->
  <view class="ablum-c-slider">
    <view @tap.stop="backTap" class="fast-15">
      <image src="https://uimg.gximg.cn/v/res/201907/15-11/kt15@3x.png"></image>
    </view>
    <view class="ablum-c-left-t">{{timeStep}}</view>
    <slider min="0" :max="max" backgroundColor="#dddee1" activeColor="#298CEF" step="2" block-size="16" @change="bindChangeTap" @changing="changeingTap" :value="seeker" class="ablum-slider"></slider>
    <view class="ablum-c-left-r">{{timeTotal}}</view>
    <view @tap.stop="fastTap" class="fast-15">
      <image src="https://uimg.gximg.cn/v/res/201907/15-11/kj15@3x.png"></image>
    </view>
    <view hidden="true" class="ablum-slider-enlarg-p" :style="'left:' + timeEnlarg + 'rpx'">
      <view class="ablum-slider-enlarg">
        <em></em>{{timeStep}}{{timeTotal}}</view>
    </view>
    <view hidden="true" class="ablum-slider-time" :style="'left:' + timeSlider + 'rpx'">
      <view>{{timeStep}}{{timeTotal}}</view>
    </view>
    <view v-if="false" class="ablum-slider-time-try" :style="'left:' + timeSlider + 'rpx'">
      <view>试听结束</view>
    </view>
  </view>

  <!-- 播放控制 -->
  <view class="ablum-c-contro">
    <view @tap.stop="preAudio" class="ablum-c-c-prev">
      <image src="https://uimg.gximg.cn/v/res/201905/22-17/play_last@3x.png"></image>
    </view>
    <view @tap.stop="audioPlay" class="ablum-c-c-play">
      <image v-if="!isPlaying" src="https://uimg.gximg.cn/v/res/201905/22-17/play@3x.png"></image>
      <image v-else src="https://uimg.gximg.cn/v/res/201905/23-15/fdpause@3x.png"></image>
    </view>
    <view @tap.stop="nextAudio" class="ablum-c-c-next">
      <image src="https://uimg.gximg.cn/v/res/201905/22-17/play_next@3x.png"></image>
    </view>
  </view>
  <!-- 列表，评论，文稿 -->
  <view class="ablum-c-around">
    <!-- 列表 -->
    <view @tap.stop="showAudioList" class="ablum-c-c-list">
      <image src="https://uimg.gximg.cn/v/res/201905/23-18/play_list@3x.png"></image>
      <view>{{idx + 1}}/{{ablums.length}}</view>
    </view>
    <!-- 评论 -->
    <view @tap.stop="showComment" class="ablum-c-c-comment">
      <view class="ablum-c-c-comment-img">
        <image src="https://uimg.gximg.cn/v/res/201905/22-18/dianping_num@3x.png"></image>
        <view>{{reqData[pid]['comment']['number']}}</view>
      </view>
      <view>评论</view>
    </view>
    <!-- 文稿 -->
    <view @tap.stop="showArticle" class="ablum-c-c-article" :style="articleData.intro.length == 0 || !hasAuth ? 'opacity:0.6' : ''">
      <image src="https://uimg.gximg.cn/v/res/201905/23-18/wengao@3x.png"></image>
      <view>文稿</view>
    </view>
    <!-- 测试 -->
    <view :hidden="testHidden" @tap.stop="goTest" class="ablum-c-c-test">
      <image src="https://uimg.gximg.cn/v/res/201906/01-16/test@3x.png"></image>
      <view>测试</view>
    </view>
  </view>
  <view v-if="!hasAuth" @tap.stop="goCustom" class="ablum-lock-view" :style="isHuawei ? 'margin-top:35rpx;' : ''">
    <text class="ablum-lock-view-text">{{authMsg.text}}\n<text class="ablum-lock-expire-text">{{authMsg.expire}}</text></text>
  </view>
  <view v-if="hasAuth && hasRank" @tap.stop="goRank" class="ablum-lock-view" :style="isHuawei ? 'margin-top:35rpx;' : ''">
    <text class="ablum-lock-view-text">排行榜</text>
  </view>
</view>


<!-- 播放列表 -->
<modals-bottom id="modals-bottom" ref="modalsBottom" radius="true" :height="75 * ablums.length + 130">
  <view slot="body">
    <view @touchstart="touchmoveStart" @touchend="touchmoveEnd" class="modals-bottom-list-container">
      <view class="modals-bottom-title">课程列表</view>

      <!-- <scroll-view bindscrolltoupper="hideModal" scroll-y style='height:{{75 * ablums.length}}px;' bindtouchstart='touchmoveStart' bindtouchend='touchmoveEnd'> -->
      <block v-for="(ablum, lidx) in ablums" :key="lidx">
        <view class="modals-bottom-list" @tap.stop="listPlay" :data-idx="lidx" :style="(lidx==0 ? 'border-top: 1rpx solid #e9eaec;' : '') + '' + (lidx != 0 && !hasAuth ? 'background:#efefef' : '')">
          <view class="modals-bottom-playing">
            <image v-if="lidx == idx && isPlaying" src="https://uimg.gximg.cn/v/res/201905/27-10/playlist_playing@3x.png"></image>
            <image v-else-if="authMsg.status == 0 && lidx != 0" src="https://uimg.gximg.cn/v/res/201906/05-16/list_lock@3x.png"></image>
            <image v-else src="https://uimg.gximg.cn/v/res/201906/05-16/playlist_btn@3x.png"></image>
          </view>
          <view class="modals-bottom-content-body">
            <view class="modals-bottom-content">{{ablum['title']}}</view>
            <view class="modals-bottom-time">{{ablum['time']}}</view>
          </view>
        </view>
      </block>

      <!-- </scroll-view> -->

      <view @tap.stop="hideCommentList" :class="'modals-bottom-bottom-c ' + (ablums.length <3 ? '' : '')">
        <view class="modals-bottom-bottom">关闭</view>
      </view>
    </view>
  </view>
</modals-bottom>

<!-- 评论列表 -->
<modals-bottom id="modalsComment" ref="modalsComment" radius="true" :height="windowH">
  <view slot="body">
    <view class="modals-bottom-comment-container">

      <view class="m-b-c-title">
        <view class="m-b-c-title-left">
          <image @tap.stop="hideComment" src="https://uimg.gximg.cn/v/res/201905/27-14/pk_answer_back2@3x.png"></image>
          <view class="m-b-c-comment-t" @tap.stop="hideComment">评论</view>
          <view class="m-b-c-user-ping-num">
            <text>({{commentListData.rows}})</text>
          </view>
        </view>
      </view>

      <!-- 评论按钮 -->
      <cover-view :hidden="writeHidden" class="comment-btn" @tap.stop="showWrite">
        <cover-image src="https://uimg.gximg.cn/v/res/201907/05-15/ic_lecture_input.png"></cover-image>
      </cover-view>

      <!-- 正文内容 -->
      <scroll-view @scrolltoupper="hideModalFun" scroll-y :style="'height:' + windowH + 'px;'" @touchstart="touchmoveStart" @touchend="touchmoveEnd">

        <view class="m-b-c-weibo" :hidden="commentWData.comment_image.list.length == 0">
          <view class="m-b-cweibo-title">{{commentWData.comment_image.title}}</view>
          <view class="m-b-cweibo-list">
            <block v-for="(weiboImg, commentWData) in commentWData.comment_image.list" :key="commentWData">
              <image :src="weiboImg['url']" :style="'width:' + weiboImg['width'] + 'rpx;height:' + weiboImg['height'] + 'rpx;'"></image>
            </block>
          </view>
        </view>

        <view class="m-b-c-user">
          <view class="m-b-c-user-ping">
            <view class="m-b-c-user-p-t-text">
              <view class="m-b-c-user-p-text">{{commentWData.comment.title}}</view>

            </view>

          </view>
          <view class="m-b-c-user-content">
            <block v-for="(commnetL, commentListData) in commentListData.comments" :key="commentListData">
              <view class="m-b-c-user-c-ping">
                <view class="m-b-c-user-c-user">
                  <image :src="commnetL['avatar']"></image>
                  <view>{{commnetL['username']}}</view>
                </view>

                <view class="m-b-c-user-c-content">
                  <text>{{commnetL['content']}}</text>
                </view>

                <view class="m-b-c-user-c-bottom">
                  <view class="m-b-c-user-c-time">
                    <text>{{commnetL['ctime']}}</text>
                  </view>
                  <view :hidden="commnetL['place'].length == 0" class="m-b-c-user-c-location">
                    <image src="https://uimg.gximg.cn/v/res/201905/27-16/location@3x.png"></image>
                    <view class="m-b-c-user-c-l-loca">
                      <text>{{commnetL['place']}}</text>
                    </view>
                  </view>
                </view>
              </view>
            </block>
            <view @tap.stop="moreText == '加载更多' ? 'gotMore' : ''" class="got-more">
              <text>{{moreText}}</text>
            </view>
          </view>
        </view>

        <view class="bottom-blank"></view>

      </scroll-view>

    </view>

  </view>
</modals-bottom>

<!-- 写评论 -->
<modals-bottom id="modalsBottomWrite" ref="modalsBottomWrite" @hideModal="hideModalFun" radius="true" :height="windowH">
  <view slot="body">
    <view class="modals-bottom-write-container">
      <form @submit="formSubmit">
        <view class="modals-bottom-write-top">
          <view class="m-b-c-w-title">
            <image @tap.stop="hideWrite" src="https://uimg.gximg.cn/v/res/201905/27-14/pk_answer_back2@3x.png"></image>
            <view @tap.stop="hideWrite">写评论</view>
          </view>
          <button class="modals-bottom-write-t-r" form-type="submit">完成</button>
        </view>

        <view class="modals-bottom-write-content">
          <textarea name="comment" :value="textareaValue" placeholder-class="write-content-style" class="write-content-style" placeholder="在此写评论..." :maxlength="maxlength" :auto-focus="autoFocus" @confirm adjust-position="false" @input="bindWordLimit" fixed="true">
          </textarea>
        </view>
      </form>


      <button v-if="!hasLocation && address.length == 0" open-type="openSetting" @opensetting="gotLocation" class="modals-bottom-write-location">
        <image class="modals-bottom-write-location-image" src="https://uimg.gximg.cn/v/res/201905/27-16/location@3x.png"></image>
        <text class="modals-bottom-write-location-text">添加定位</text>
      </button>

      <view v-if="hasLocation && address.length == 0" @tap.stop="gotLocation" class="modals-bottom-write-location">
        <image class="modals-bottom-write-location-image" src="https://uimg.gximg.cn/v/res/201905/27-16/location@3x.png"></image>
        <text class="modals-bottom-write-location-text">添加定位</text>
      </view>

      <view v-else-if="hasLocation && address.length != 0" @tap.stop="gotLocation" class="modals-bottom-write-location-else">
        <image class="modals-bottom-write-location-image" src="https://uimg.gximg.cn/v/res/201905/27-16/location@3x.png"></image>
        <text class="modals-bottom-write-location-text">{{address}}</text>
      </view>

    </view>
    <view class="bottom-blank"></view>
  </view>
</modals-bottom>

<!-- 文稿 -->
<modals-bottom id="modalsArticle" ref="modalsArticle" radius="true" :height="windowH">
  <view slot="body">
    <view @touchstart="touchmoveStart" @touchend="touchmoveEnd" class="modal-article-container">
      <view class="m-b-c-title">
        <view class="m-b-c-title-left">
          <image @tap.stop="hideArticle" src="https://uimg.gximg.cn/v/res/201905/27-14/pk_answer_back2@3x.png"></image>
          <view>文稿</view>
        </view>
      </view>

      <scroll-view @scrolltoupper="hideModalFun" scroll-y :style="'height:' + windowH + 'px;'" @touchstart="touchmoveStart" @touchend="touchmoveEnd">
        <view class="modal-article-body">
          <view class="modal-article-title">
            <text>{{articleData.title}}</text>
          </view>

          <view :hidden="articleData.foreword.length == 0" class="modal-article-t-word">
            <view class="modal-article-t-text">
              <text>{{articleData.foreword.title}}</text>
            </view>
            <view class="modal-article-t-words">
              <text>{{articleData.foreword.intro}}</text>
            </view>
          </view>

          <view :hidden="articleData.intro.length == 0" class="modal-article-desc">
            <text space="ensp">{{articleData.intro}}</text>
          </view>

          <!-- 文稿 -->
          <view :hidden="articleData.detail.length == 0">
            <view class="modal-article-content-title">
              <text>正文</text>
            </view>
            <view class="modal-article-content">
              <text space="ensp">{{articleData.detail}}</text>
            </view>
          </view>

          <!-- 例句 -->
          <view :hidden="articleData.phrase_list.length == 0">
            <view class="modal-article-example">
              <text>例句</text>
            </view>

            <block v-for="(articleD, idx) in articleData.phrase_list" :key="idx">
              <view class="modal-article-example-content">
                <text>{{idx+1}}.<text style="font-size: 28rpx;color: #333333;letter-spacing: 0.28rpx;line-height: 50rpx;">{{articleD['word']}}</text>{{articleD['phonetics']}}{{articleD['word_cn']}}</text>
                <text>{{articleD['phrase']}}</text>
                <text>{{articleD['phrase_cn']}}</text>
              </view>
            </block>
          </view>

          <view class="bottom-blank"></view>

        </view>
      </scroll-view>
    </view>
  </view>
</modals-bottom>

<!-- 客服弹框 -->
<custom-modal id="customModal" ref="customModal" :cfg="custom_cfg" confirmText="解锁" modalSize="md" title="提示" @cancelEvent="_cancelEvent" @confirmEvent="_confirmEventThird" @invitShareEvent="_invitShareEvent">
  <view class="custom-modal">
    <view class="custom-avatar-warp">
      <view>
        <text>{{custom_cfg.content}}</text>
      </view>
    </view>
  </view>
</custom-modal>
</view>
</template>

<script>
const app = getApp().globalData;
var util = require("../../utils/util");
var unitUrl = "https://v.xueweigui.com/ApiWordCourse/unitList?book_id=";
const step = 15;
import customModal from "../../component/easyModal/custom-modal/custom-modal";
import modalsBottom from "../../component/modals/modals";
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      isListening: false,
      hasAuth: true,
      seeker: 0,
      timeSlider: 60,
      timeEnlarg: 31,
      timeTotal: '60:21',
      timeStep: '00:00',
      enlarg: true,
      tryListen: false,
      //是否为试听
      isPlaying: false,
      isPause: true,
      idx: 0,
      //点击的索引值
      hideModal: true,
      //模态框的状态  true-隐藏  false-显示
      animationData: {},
      //
      listData: [1, 2, 7, 7],
      windowH: wx.getSystemInfoSync().windowHeight - 80,
      allowComment: true,
      textareaValue: '',
      maxlength: 600,
      //最大输入字数
      location: '',
      address: '',
      audioTitle: '',
      //音频标题地址
      ablums: [],
      //当前unit集合
      reqData: [],
      //book集合
      cover: '',
      commentWData: [],
      //评论数据
      commentListData: [],
      //评论内容
      articleData: [],
      //文稿数据
      moreText: '',
      autoFocus: false,
      custom_cfg: getApp().globalData.g_custom_msg,
      testHidden: true,
      //是否隐藏测试题
      hasRank: true,
      isPlayFloat: false,
      //是否来自浮动播放
      nvabarData: {
        showCapsule: 1,
        // 是否显示左上角胶囊按钮 1 显示 0 不显示
        title: '刘洪波讲单词'
      },
      writeHidden: false,
      //是否隐藏写评论按钮
      hasLocation: true,
      //是否有地址位置权限
      tryend: false //试听是否结束
      ,
      pid: "",
      isHuawei: "",
      albums: "",
      authMsg: "",
      playerHidden: false,
      max: 0,
      touchStartY: ""
    };
  },

  components: {
    customModal,
    modalsBottom,
    navBar
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('ablum:', options, getApp().globalData.g_audio_pid);
    let pid = options.pid || getApp().globalData.g_audio_pid;
    this.setData({
      pid: pid,
      hasAuth: getApp().globalData.g_audio_auth,
      isHuawei: getApp().globalData.g_is_huawei,
      custom_cfg: getApp().globalData.g_custom_msg,
      hasRank: getApp().globalData.g_req_data[pid]['test_ti']['has_rank']
    });
    getApp().globalData.g_has_rank = getApp().globalData.g_req_data[pid]['test_ti']['has_rank'];
    getApp().globalData.g_test_stime = getApp().globalData.g_req_data[pid]['test_ti']['stime'];
    getApp().globalData.g_test_etime = getApp().globalData.g_req_data[pid]['test_ti']['etime']; // app.globalData.g_audio_pid = pid;
    //判断是否有权限
    //app.globalData.g_audio_auth = false;

    if (util.getListenRecord() && getApp().globalData.g_audio_pid == util.getListenRecord().pid && getApp().globalData.g_audio_idx == util.getListenRecord().idx && getApp().globalData.g_audio_bookid == util.getListenRecord().book_id && (getApp().globalData.g_audio_playing == null || getApp().globalData.g_audio_playing == false)) {
      console.log('float play plying');
      getApp().globalData.g_audio_obj = wx.getBackgroundAudioManager();
      this.setData({
        isPlayFloat: true
      });
      this.audioPlay();
      this.audioListen();
    } else {
      this.setData({
        isPlayFloat: false
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('ablum-content onReady2');
    this.customModal = this.$refs.customModal;
    this.modals = this.$refs.modalsBottom;
    this.modalComment = this.$refs.modalsComment;
    this.modalWrite = this.$refs.modalsBottomWrite;
    this.modalArticle = this.$refs.modalsArticle; //判断是播放视频or 音频

    if (!getApp().globalData.g_audio_obj) {
      console.log('create getBackgroundAudioManager2');
      getApp().globalData.g_audio_obj = wx.getBackgroundAudioManager();
    }

    this.setData({
      hasAuth: getApp().globalData.g_audio_auth,
      reqData: getApp().globalData.g_req_data,
      authMsg: getApp().globalData.g_auth_msg
    }); //监听进度

    this.audioListen();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('on show'); //从其它页面操作音频控制同步本页

    let isPlaying = false;
    let tryListen = false;

    if (this.pid == getApp().globalData.g_audio_pid && getApp().globalData.g_audio_playing) {
      isPlaying = true;
    }

    if (!getApp().globalData.g_audio_auth && getApp().globalData.g_audio_tryListen) {
      tryListen = true;
    }

    if (this.pid == getApp().globalData.g_audio_pid && getApp().globalData.g_audio_pause) {
      this.setData({
        timeStep: getApp().globalData.g_audio_timeStep
      });
    }

    if (getApp().globalData.g_audio_seeker > 0) {
      let timeSlider = getApp().globalData.g_audio_seeker * 10;

      if (timeSlider >= 560) {
        timeSlider = 560;
      } else if (timeSlider <= 40) {
        timeSlider = 40;
      }

      this.setData({
        timeSlider: timeSlider
      });
    }

    this.setData({
      isPlaying: isPlaying,
      tryListen: tryListen,
      audioTitle: getApp().globalData.g_req_data[this.pid]['title'],
      ablums: this.ablumsEvnet(this.pid),
      cover: getApp().globalData.g_req_data[this.pid]['cover'],
      testHidden: getApp().globalData.g_req_data[this.pid]['test_ti']['url'].length == 0 ? true : false,
      timeTotal: getApp().globalData.g_req_data[this.pid]['audio'][getApp().globalData.g_audio_idx]['time'] // reqData:

    });
    this.isCurrentEvnet();
    this.reqArticle(this.pid);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: getApp().globalData.g_req_data[this.pid]['title'],
      //'刘洪波讲单词',
      imageUrl: getApp().globalData.g_share_img,
      path: '/pages/ablum/ablum-detail?id=' + getApp().globalData.g_audio_bookid + '&url=' + encodeURIComponent(getApp().globalData.g_audio_reqUrl) + '&share_idx=' + this.pid
    };
  },
  methods: {
    //直接跳详情请求数据
    reqBookData: function (url) {
      var that = this;
      util.getRequest(url, {}, function (res) {
        if (res.data.e != '9999') {
          wx.showToast({
            title: '网络繁忙,稍后重试',
            icon: 'none'
          });
        } else {
          res.data.data.map(reg => reg.audio = JSON.parse(util.secret(reg.media, reg.media_iv)));
          that.setData({
            albums: res.data.data,
            authMsg: res.data.auth
          });
          getApp().globalData.g_auth_msg = res.data.auth;
          getApp().globalData.g_audio_auth = res.data.auth.status == 0 ? false : true;
          getApp().globalData.g_try_time = res.data.auth.try_time;
          getApp().globalData.g_audio_plen = res.data.data.length;
          getApp().globalData.g_req_data = res.data.data;
          console.log('ablum-content-res', res);
        }
      });
    },
    //内容处理func
    ablumsEvnet: function (pid) {
      console.log('this.data.pid', this.pid, pid);
      getApp().globalData.g_req_data[pid]['audio'].map(res => res.time = util.formLoadMTime(res.duration));
      console.log('app.globalData.g_req_data', 'app.globalData.g_req_data', getApp().globalData.g_audio_pid);
      return getApp().globalData.g_req_data[pid]['audio'];
    },

    //是否为当前播放的id
    isCurrentEvnet() {
      if (getApp().globalData.g_audio_ablum_id != getApp().globalData.g_audio_ablum_temid) {
        console.log('not current');
        this.setData({
          isPlaying: false,
          playerHidden: false,
          timeSlider: 40,
          max: 0
        });
      }
    },

    //初始播放
    audioPlay: function () {
      let pid = this.pid;
      console.log('pid2-', pid); //仅控制当前对应的音频

      if (getApp().globalData.g_audio_ablum_id == getApp().globalData.g_audio_ablum_temid && pid == getApp().globalData.g_audio_pid && !getApp().globalData.g_audio_ended) {
        //已播放过且不是当前
        if (getApp().globalData.g_audio_playing != null) {
          if (getApp().globalData.g_audio_playing) {
            console.log('click pause2');
            getApp().globalData.g_audio_obj.pause();
          }

          if (getApp().globalData.g_audio_pause == true) {
            console.log('click play2');
            getApp().globalData.g_audio_obj.play();
          }

          return;
        }
      }

      console.log('init play2--pid', pid);
      getApp().globalData.g_audio_pid = pid;
      getApp().globalData.g_audio_idx = 0;
      getApp().globalData.g_audio_obj.src = getApp().globalData.g_req_data[pid]['audio'][0]['url'];
      getApp().globalData.g_audio_obj.title = getApp().globalData.g_req_data[pid]['audio'][0]['title'];
      getApp().globalData.g_audio_obj.play();
      getApp().globalData.g_audio_ended = false;
      this.upTryTime(pid); //悬浮播放

      if (this.isPlayFloat && !getApp().globalData.g_audio_playing) {
        let user_seek = parseInt(util.getListenRecord().time);
        var seekTime = getApp().globalData.g_audio_auth ? user_seek : user_seek > getApp().globalData.g_try_time ? getApp().globalData.g_try_time : user_seek;
        console.log('start2 play');
        getApp().globalData.g_audio_obj.seek(seekTime);
      }
    },
    //列表播放
    listPlay: function (event) {
      var that = this;
      let idx = event.currentTarget.dataset.idx;

      if (!getApp().globalData.g_audio_auth && idx !== 0) {
        wx.showModal({
          title: '提示',
          content: '购买后,可听全部课程',
          success: function (res) {
            if (res.confirm) {
              that.goCustom();
            }
          }
        });
        return;
      }

      console.log('listPlay--', idx);
      getApp().globalData.g_audio_obj.stop();
      getApp().globalData.g_audio_idx = idx;
      getApp().globalData.g_audio_obj.src = getApp().globalData.g_req_data[this.pid]['audio'][getApp().globalData.g_audio_idx]['url'];
      getApp().globalData.g_audio_obj.title = getApp().globalData.g_req_data[this.pid]['audio'][getApp().globalData.g_audio_idx]['title'];
      getApp().globalData.g_audio_obj.play();
      this.upTryTime(this.pid); //文档切换

      this.reqArticle(getApp().globalData.g_audio_pid);
      this.setData({
        pid: getApp().globalData.g_audio_pid,
        idx: getApp().globalData.g_audio_idx,
        timeSlider: 40 //初始化进度条

      });
    },
    //上一个音频
    preAudio: function () {
      var that = this;
      let sub_len = getApp().globalData.g_req_data[getApp().globalData.g_audio_pid].audio.length;
      console.log('子集长度--', sub_len);
      getApp().globalData.g_audio_obj.stop(); //子集长度判断

      if (getApp().globalData.g_audio_idx - 1 < 0) {
        //子集重置为0 & 父级判断
        getApp().globalData.g_audio_idx = 0;

        if (parseInt(getApp().globalData.g_audio_pid - 1) < 0) {
          getApp().globalData.g_audio_pid = parseInt(getApp().globalData.g_audio_plen - 1);
        } else {
          getApp().globalData.g_audio_pid = parseInt(getApp().globalData.g_audio_pid - 1);
        }
      } else {
        getApp().globalData.g_audio_idx = parseInt(getApp().globalData.g_audio_idx - 1);
      }

      if (!getApp().globalData.g_audio_auth && getApp().globalData.g_audio_idx != 0) {
        wx.showModal({
          title: '提示',
          content: '购买后,可听全部课程',
          success: function (res) {
            if (res.confirm) {
              that.goCustom();
            }
          }
        });
        return;
      }

      getApp().globalData.g_audio_obj.src = getApp().globalData.g_req_data[getApp().globalData.g_audio_pid]['audio'][getApp().globalData.g_audio_idx]['url'];
      getApp().globalData.g_audio_obj.title = getApp().globalData.g_req_data[getApp().globalData.g_audio_pid]['audio'][getApp().globalData.g_audio_idx]['title'];
      this.upTryTime(getApp().globalData.g_audio_pid); //文档切换

      this.reqArticle(getApp().globalData.g_audio_pid);
      this.setData({
        pid: getApp().globalData.g_audio_pid,
        idx: getApp().globalData.g_audio_idx,
        timeSlider: 40,
        //初始化进度条
        ablums: this.ablumsEvnet(getApp().globalData.g_audio_pid)
      });
    },
    //下一个音频
    nextAudio: function () {
      var that = this;
      let sub_len = getApp().globalData.g_req_data[getApp().globalData.g_audio_pid].audio.length;
      console.log('子集长度--', sub_len);
      getApp().globalData.g_audio_obj.stop(); //子集长度判断

      if (getApp().globalData.g_audio_idx + 1 > sub_len - 1) {
        //子集重置为0 & 父级判断
        getApp().globalData.g_audio_idx = 0;

        if (parseInt(getApp().globalData.g_audio_pid + 1) > getApp().globalData.g_audio_plen - 1) {
          getApp().globalData.g_audio_pid = 0;
        } else {
          getApp().globalData.g_audio_pid = parseInt(getApp().globalData.g_audio_pid + 1);
        }
      } else {
        getApp().globalData.g_audio_idx = parseInt(getApp().globalData.g_audio_idx + 1);
      }

      if (!getApp().globalData.g_audio_auth && getApp().globalData.g_audio_idx != 0) {
        wx.showModal({
          title: '提示',
          content: '购买后,可听全部课程',
          success: function (res) {
            if (res.confirm) {
              that.goCustom();
            }
          }
        });
        return;
      }

      getApp().globalData.g_audio_obj.src = getApp().globalData.g_req_data[getApp().globalData.g_audio_pid]['audio'][getApp().globalData.g_audio_idx]['url'];
      getApp().globalData.g_audio_obj.title = getApp().globalData.g_req_data[getApp().globalData.g_audio_pid]['audio'][getApp().globalData.g_audio_idx]['title'];
      getApp().globalData.g_audio_obj.play(); //文档切换

      this.reqArticle(getApp().globalData.g_audio_pid);
      this.upTryTime(getApp().globalData.g_audio_pid);
      this.setData({
        pid: getApp().globalData.g_audio_pid,
        idx: getApp().globalData.g_audio_idx,
        timeSlider: 40,
        //初始化进度条
        ablums: this.ablumsEvnet(getApp().globalData.g_audio_pid)
      });
    },
    //更新每个音频的测试时间
    upTryTime: function (currentIdx) {
      let that = this;
      setTimeout(function () {
        console.log('uptrytime2', currentIdx, getApp().globalData.g_req_data, getApp().globalData.g_req_data[currentIdx].try_time);
        ;
        getApp().globalData.g_try_time = getApp().globalData.g_req_data[currentIdx].try_time;
      }, 1000);
    },
    //保存收听记录
    saveListenRecord: function () {
      var _reg = {
        pid: getApp().globalData.g_audio_pid,
        idx: getApp().globalData.g_audio_idx,
        time: getApp().globalData.g_audio_seeker,
        book_id: getApp().globalData.g_audio_bookid,
        cover: getApp().globalData.g_audio_cover_square,
        tmp_id: getApp().globalData.g_audio_ablum_temid
      };
      console.log('save_reg', _reg);
      util.saveListenRecord(_reg);
    },
    //监听事件
    audioListen: function () {
      var that = this;

      if (getApp().globalData.g_audio_duration != null && getApp().globalData.g_audio_ablum_id == getApp().globalData.g_audio_ablum_temid && getApp().globalData.g_audio_idx == this.idx) {
        console.log('app.globalData.g_audio_max', getApp().globalData.g_audio_max);
        that.setData({
          timeTotal: getApp().globalData.g_audio_duration,
          max: getApp().globalData.g_audio_max
        }); //记忆播放跳转到上次位置

        if (util.getListenRecord() && getApp().globalData.g_audio_pid == util.getListenRecord().pid && getApp().globalData.g_audio_idx == util.getListenRecord().idx && getApp().globalData.g_audio_bookid == util.getListenRecord().book_id && getApp().globalData.g_audio_playing == null) {}
      } //监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放


      getApp().globalData.g_audio_obj.onCanplay(function () {
        // let max = app.globalData.g_audio_obj.duration;
        let _duration = getApp().globalData.g_req_data[getApp().globalData.g_audio_pid]['audio'][getApp().globalData.g_audio_idx]['duration'];
        let max = _duration / 1000;
        let duratoin = util.formLoadMTime(_duration);
        getApp().globalData.g_audio_duration = duratoin;
        getApp().globalData.g_audio_max = max;
        console.log('duration--', duratoin);
        console.log('onCanplay2--max', max);
        that.setData({
          timeTotal: duratoin,
          max: max
        });
      }); //监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发

      getApp().globalData.g_audio_obj.onWaiting(function () {
        console.log('onWaiting2');
      }); //监听背景音频播放错误事件

      getApp().globalData.g_audio_obj.onError(function (e) {
        console.log('onError2--', e);
      }); //监听背景音频播放事件

      getApp().globalData.g_audio_obj.onPlay(function () {
        getApp().globalData.g_audio_cover_square = getApp().globalData.g_req_data[getApp().globalData.g_audio_pid]['cover_square'];
        getApp().globalData.g_audio_playing = true;
        getApp().globalData.g_audio_player = false;
        getApp().globalData.g_audio_pause = false;
        getApp().globalData.g_audio_title = getApp().globalData.g_req_data[getApp().globalData.g_audio_pid]['audio'][getApp().globalData.g_audio_idx]['title'];
        getApp().globalData.g_audio_tryListen = false;
        getApp().globalData.g_audio_ablum_id = getApp().globalData.g_audio_ablum_temid; // app.globalData.g_audio_pid = that.data.pid;

        that.setData({
          isPlaying: true,
          tryListen: false,
          pid: getApp().globalData.g_audio_pid,
          audioTitle: getApp().globalData.g_req_data[getApp().globalData.g_audio_pid]['title'],
          cover: getApp().globalData.g_req_data[getApp().globalData.g_audio_pid]['cover']
        }); //保存收听记录

        that.saveListenRecord();
        console.log('onPlay2');
      }); //监听背景音频暂停事件

      getApp().globalData.g_audio_obj.onPause(function () {
        getApp().globalData.g_audio_cover_square = getApp().globalData.g_req_data[getApp().globalData.g_audio_pid]['cover_square'];
        getApp().globalData.g_audio_playing = false;
        getApp().globalData.g_audio_pause = true;
        that.setData({
          isPlaying: false,
          isPause: true
        }); //保存收听记录

        that.saveListenRecord();
        console.log('onPause2');
      });
      getApp().globalData.g_audio_obj.onEnded(function () {
        getApp().globalData.g_audio_timeStep = '00:00';
        getApp().globalData.g_audio_playing = false;
        getApp().globalData.g_audio_ended = true;
        that.setData({
          isPlaying: false,
          seeker: 0,
          timeStep: '00:00',
          timeEnlarg: 40
        });
        console.log('onEnded2');
      });
      getApp().globalData.g_audio_obj.onStop(function () {
        getApp().globalData.g_audio_playing = null;
        getApp().globalData.g_audio_timeStep = '00:00';
        that.setData({
          isPlaying: false
        });
        console.log('onStop2');
      }); //监听背景音频播放进度更新事件

      getApp().globalData.g_audio_obj.onTimeUpdate(function () {
        if (that.pid != getApp().globalData.g_audio_pid || getApp().globalData.g_audio_ablum_id != getApp().globalData.g_audio_ablum_temid) return;
        let seeker = getApp().globalData.g_audio_obj.currentTime;
        let num = util.formLoadTime(seeker);
        that.setData({
          timeStep: num,
          seeker: seeker
        }); //todo 开通权限后需要重新请求数据 设为非试听

        if (!getApp().globalData.g_audio_auth && getApp().globalData.g_audio_obj.currentTime >= getApp().globalData.g_try_time) {
          getApp().globalData.g_audio_obj.stop();
          getApp().globalData.g_audio_obj.stop();
          getApp().globalData.g_audio_obj.stop();
          getApp().globalData.g_audio_tryListen = true;
          that.setData({
            tryListen: true,
            seeker: getApp().globalData.g_try_time
          });
          console.log('***********试听', seeker);
          util.throttle(function () {
            wx.showModal({
              title: '提示',
              content: '购买后,可听全部课程',
              success: function (res) {
                if (res.confirm) {
                  that.goCustom();
                }
              }
            });
          }, 10)();
          return;
        }

        getApp().globalData.g_audio_timeStep = num;
        getApp().globalData.g_audio_seeker = seeker;
      });
    },
    goCustom: function () {
      console.log('gocustom--');
      var system = wx.getSystemInfoSync().system;
      var that = this;

      if (system.indexOf('iOS') === -1) {
        util.payAction(this.authMsg.order_url, function () {
          getApp().globalData.g_audio_auth = true;
          that.setData({
            hasAuth: true
          });
        }); // let url = this.data.authMsg.order_url || '';
        // wx.navigateTo({
        //   url: '../order/order?url=' + url,
        // })
      } else {
        this.customModal.show();
      }
    },
    bindChangeTap: function (event) {
      let seeker = event.detail.value; //console.log('bindChangeTap', seeker);

      if (!this.hasAuth && seeker > getApp().globalData.g_try_time) {
        getApp().globalData.g_audio_obj.seek(parseInt(getApp().globalData.g_try_time));
        return;
      }

      let that = this;
      if (seeker == 0) return;
      let timeSlider = seeker * 10;

      if (timeSlider >= 560) {
        timeSlider = 560;
      } else if (timeSlider <= 40) {
        timeSlider = 40;
      }

      let timeEnlarg = timeSlider - 24;
      console.log(timeSlider);
      that.setData({
        seeker: seeker,
        timeSlider: timeSlider,
        timeEnlarg: timeEnlarg,
        enlarg: false,
        timeStep: util.formLoadTime(seeker)
      });
      setTimeout(function () {
        that.setData({
          enlarg: true
        });
      }, 500);
      getApp().globalData.g_audio_obj.seek(seeker);
    },
    changeingTap: function (event) {
      let that = this;
      let seeker = event.detail.value;
      let timeSlider = seeker * 10;

      if (timeSlider >= 560) {
        timeSlider = 560;
      } else if (timeSlider <= 40) {
        timeSlider = 40;
      }

      let timeEnlarg = timeSlider - 24;
      that.setData({
        seeker: seeker,
        timeSlider: timeSlider,
        timeEnlarg: timeEnlarg,
        enlarg: false,
        timeStep: util.formLoadTime(seeker)
      });
      getApp().globalData.g_audio_obj.seek(seeker);
    },
    goTest: function (event) {
      var that = this;

      if (!this.hasAuth) {
        wx.showModal({
          title: '提示',
          content: '购买后，可参加测试',
          success: function (res) {
            if (res.confirm) {
              that.goCustom();
            }
          }
        });
        return;
      }

      wx.navigateTo({
        url: '/pages/wtest/wtest?url=' + encodeURIComponent(getApp().globalData.g_req_data[this.pid]['test_ti']['url']) + '&id=' + getApp().globalData.g_req_data[this.pid]['id']
      });
    },
    goRank: function () {
      wx.navigateTo({
        url: '/pages/wtest/rank?pid=' + this.pid + '&id=' + getApp().globalData.g_req_data[this.pid]['id']
      });
    },
    //展示音频列表
    showAudioList: function () {
      this.modals.showModal();
    },
    //隐藏音频list
    hideCommentList: function () {
      this.modals.hideModalFun();
    },
    //展示评论列表
    showComment: function () {
      var that = this;
      this.setData({
        writeHidden: false
      });
      util.getRequest(this.reqData[getApp().globalData.g_audio_pid].comment.url, {}, res => {
        res.data.comment_image.list.map(function (res) {
          res.width = res.size.split(',')[0];
          res.height = res.size.split(',')[1];
        });
        util.getRequest(res.data.comment.list_url, {}, comList => {
          that.setData({
            commentListData: comList.data,
            moreText: comList.data.next.length == 0 ? '没有更多了' : '加载更多'
          });
        });
        that.setData({
          commentWData: res.data,
          autoFocus: true
        });
        this.modalComment.showModal();
      });
    },
    hideComment: function () {
      this.setData({
        writeHidden: true
      });
      this.modalComment.hideModalFun();
    },
    //展示写评论
    showWrite: function () {
      this.setData({
        writeHidden: true
      });
      this.modalWrite.showModal();
    },
    //隐藏写评论
    hideWrite: function (event) {
      this.setData({
        writeHidden: false
      });
      this.modalWrite.hideModalFun();
    },
    showArticle: function () {
	  if(this.$data.articleData.intro ==0 || !this.$data.hasAuth){
		  return;
	  }
      this.modalArticle.showModal();
    },
    //隐藏文稿
    hideArticle: function () {
      this.modalArticle.hideModalFun();
    },
    //请求文稿数据
    reqArticle: function (pid) {
      var that = this;
      util.getRequest(getApp().globalData.g_req_data[pid].document.url, {}, res => {
        that.setData({
          articleData: res.data
        });
      });
    },
    bindWordLimit: function (e) {
      var value = e.detail.value,
          len = parseInt(value.length);

      if (len >= this.maxlength) {
        this.setData({
          allowComment: false
        });
        wx.showToast({
          title: '最多允许输入' + this.maxlength + '个字',
          icon: 'none'
        });
      }
    },
    //加载更多
    gotMore: function () {
      var that = this;
      console.log('加载更多');
      util.getRequest(this.commentListData.next, {}, res => {
        let c = that.commentListData.comments.concat(res.data.comments);
        that.commentListData.next = res.data.next;
        that.commentListData.comments = c;
        that.setData({
          commentListData: that.commentListData,
          moreText: res.data.next.length == 0 ? '没有更多了' : '加载更多'
        });
      });
    },
    bindconfirm: function (e) {
      var value = e.detail.value;
    },
    formSubmit: function (e) {
      var that = this;
      let content = e.detail.value.comment;
      let len = e.detail.value.comment.length;

      if (len < 1) {
        wx.showToast({
          title: '评论不能为空',
          icon: 'none'
        });
        return;
      }

      wx.showToast({
        title: '评论成功',
        icon: 'none'
      }); //todo 提交评论

      util.getRequest(this.commentWData.comment.submit_url, {
        uid: 10775054,
        //todo uid
        content: content,
        place: that.address
      }, res => {
        that.setData({
          textareaValue: '',
          address: ''
        });
        console.log('提交评论结果', res);
      });
      this.modalWrite.hideModalFun();
    },
    //地图
    gotLocation: function (e) {
      var that = this;
      wx.chooseLocation({
        success: function (res) {
          var location = {
            name: res.name,
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          };
          that.setData({
            location: location,
            address: res.name,
            hasLocation: true
          });
        },
        fail: function () {
          wx.getSetting({
            success: function (res) {
              var statu = res.authSetting; //console.log('auth-stauts-',res);

              if (!statu['scope.userLocation']) {
                wx.authorize({
                  scope: 'scope.userLocation',

                  success() {
                    wx.chooseLocation({
                      success: function (res) {
                        var location = {
                          name: res.name,
                          address: res.address,
                          latitude: res.latitude,
                          longitude: res.longitude
                        };
                        that.setData({
                          location: location,
                          address: res.name
                        });
                      }
                    });
                  },

                  fail(res) {
                    that.setData({
                      hasLocation: false
                    });
                  }

                });
              }
            },
            fail: function (res) {
              wx.showToast({
                title: '调用授权窗口失败',
                icon: 'none'
              });
            }
          });
        }
      });
    },
    //touch start
    touchmoveStart: function (e) {
      this.setData({
        touchStartY: e.changedTouches[0].clientY
      });
    },
    //touch end
    touchmoveEnd: function (e) {
      let diff = e.changedTouches[0].clientY - this.touchStartY;

      if (diff >= 0 && this.hideModal) {
        this.setData({
          writeHidden: true
        });
        this.modals.hideModalFun();
        this.modalArticle.hideModalFun();
        this.modalComment.hideModalFun();
      } else {
        this.setData({
          hideModal: false
        });
      }
    },
    //滑动到顶部触发事件
    hideModalFun: function () {
      this.setData({
        hideModal: true
      });
    },
    //前进
    fastTap: util.throttle(function () {
      var that = this;
      var des = this.seeker + step;
      des = des >= this.max ? this.max : des;

      if (des == this.max) {
        des = 0;
      }

      getApp().globalData.g_audio_obj.seek(des);
      that.setData({
        seeker: des
      });
      console.log('fast--', des);
    }, 200),
    //后退
    backTap: util.throttle(function () {
      var that = this;
      var des = this.seeker - step;
      des = des <= 0 ? 0 : des;
      getApp().globalData.g_audio_obj.seek(des);
      that.setData({
        seeker: des
      });
      console.log('back--', des);
    }, 200)
  }
};
</script>
<style>
@import "./ablum-content.css";
</style>