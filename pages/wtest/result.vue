<template>
<view>
<nav-bar v-if="!navBarHidden" :navbar-data="nvabarData" :has-custom="hasCustom" @testBackEvent="testBackEvent" @testHomeEvent="testHomeEvent"></nav-bar>
<view class="result_page">
  <view class="result_top">
    <view class="top-img">
      <!-- <image src="{{ad.image}}"></image> -->
      <view class="top_text">
        <view>
          <text class="top_text1">{{ad.top1}}</text>
        </view>
        <view>
          <text class="top_text2">{{ad.top2}}</text>
        </view>
      </view>
      <!-- <view class='top-avatar'>
        <image src="{{usr_msg.avatar}}"></image>
      </view> -->
    </view>

  </view>

  <view v-if="hasRank" class="rank-class">
    <image @tap.stop="goRank" src="https://uimg.gximg.cn/v/res/201906/12-16/paihangxx@3x.png"></image>
    <text>排行榜</text>
  </view>
  <!-- <view class='user-name'>
    <text>{{usr_msg.name}}</text>
  </view> -->

  <!-- 圆环进度 --> 
  <view class="result_bg">
    <view class="page">
      <view class="page__bd page__bd_spacing" style="text-align:center;position:relative">
		  <view class="content">
		      
		  	<view class="circleprogress">
				<view class="progresstext-title">正确率</view>
		  		<view class="progresstext">{{progresstext}}%</view>
		  		<view class="wrapper">
		  			<view class="leftprogress" :style="{ transform: leftprogress}"></view>
		  		</view>
		  		<view class="wrapper">
		  			<view class="rightprogress" :style="{ transform: rightprogress}"></view>
		  		</view>
		  	</view>
		  </view>
        <!-- <view class="_percent">
          <view class="zhengque">正确率</view>{{ percent + '%' }}</view>
        <wux-circle :percent="percent" :sAngle="sAngle" class="wux-circle_self" :strokeWidth="strokeWidth" :size="size" :circleBg="circleBg">
        </wux-circle> -->
      </view>
    </view>
    <!-- 结果数据 -->
    <view class="result_user_grade">
      <view class="result_user_item">
        <view class="result_user_num_title">本次测试</view>
        <view class="result_user_number">
          <text class="result_test_total">{{result_test_total}}</text>个</view>
      </view>
      <view class="result_user_item">
        <view class="result_user_num_title">正确</view>
        <view class="result_user_number">
          <text class="result_test_true">{{result_test_true}}</text>个</view>
      </view>
      <view class="result_user_item">
        <view class="result_user_num_title">用时</view>
        <view class="result_user_number">
          <text class="result_test_time">{{result_test_time}}</text>秒</view>
      </view>
    </view>

    <view class="look_father">
      <view @tap="lookResult" class="look_answer">
        <text>查看答案</text>
      </view>
    </view>

    <view :hidden="!fromApp" class="app-btn-view">
      <button class="app-btn-class" open-type="launchApp" app-parameter="wechat">
        <text class="app-btn-text-class">返回 词会App</text>
      </button>
    </view>
  </view>
  <!-- <view class='bottom_ad'>
    <view>
      <view class='ad1'>
        <block wx:for="{{ad1}}" wx:key='ad1'>
          <text style="{{index == 0 ?'font-size:35rpx;' :''}}">{{item}}</text>
        </block>
      </view>
      <view class='ad2'>
        <text>{{ad.ad2}}</text>
      </view>
    </view>
    <view class='ad-bottom-r'>
      <image src="{{ad.mini_qr}}"></image>
    </view>
  </view> -->
</view>
<!-- <button class='app-btn-class' open-type="launchApp" app-parameter="wechat">返回词会</button> -->
<view hidden="true" class="result_button">
  <view class="result_reset" @tap="lookResult">查看答案</view>
  <view class="result_share" @tap="fenxiang_jietu">分享截图</view>
</view>
<view hidden="true" class="botom_black"></view>

<view :hidden="true" @tap.stop="fenxiang_jietu" class="result-share">
  <image src="https://uimg.gximg.cn/v/res/201906/06-18/share@3x.png"></image>
</view>

<!-- 生成截图 -->
<canvasdrawer :painting="painting" @getImage="eventGetImage"></canvasdrawer>
</view>
</template>

<script>
// pages/result/result.js
var app = getApp().globalData;
const util = require("../../utils/util.js");
const pkHiddenKey = 'pk_hidden_key';
const pkLogKey = 'pk_log_key';
const userinfo = 'userinfo';
import canvasdrawer from "../../component/canvasdrawer/canvasdrawer";
import wuxCircle from "../../component/component_circle/circle/index";
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
		leftprogress: 'rotate(-45deg)',
		rightprogress: 'rotate(45deg)',
		progresstext:'0',
      percent: 50,
      //圆环占比
      sAngle: -90,
      // 起始角度
      strokeWidth: 15,
      //圆环宽度
      size: 160,
      result_test_total: 20,
      //题目总数
      result_test_true: 10,
      //正确题目数量
      result_test_time: 60,
      //所耗时间
      word_list: null,
      //单词列表
      word_width_ary: null,
      //对应单词标签的宽度
      result_page_height: null,
      result_page_width: null,
      circleBg: '#fff',
      painting: {},
      result_data_fail_css: null,
      //单词列表的错误标红
      ad: {},
      fromApp: getApp().globalData.g_from_app,
      hasRank: false,
      //是否展示排行榜
      nvabarData: {
        showCapsule: 1,
        title: '测试结果'
      },
      hasCustom: true //触发自定义返回
      ,
      screen_h: "",
      screen_w: "",
      ratio: "",
      shareImage: "",
      test_id: "",
      ad1: "",
	  navBarHidden:false//自定义菜单是否隐藏
    };
  },

  components: {
    canvasdrawer,
    wuxCircle,
    navBar
  },
  props: {},
  onShow: function () {
	  //自定义菜单隐藏判断
	  if(getApp().globalData.g_app == 'alipay'){
	  	this.setData({
	  		navBarHidden: true
	  	})
	  }
  },
  onHide:function() {
	  console.log('result-onhide');
	  // wx.navigateBack({delta:2});
  },
  onLoad: function (options) {
    var that = this;

    var _persent = options.correct_number / options.totla_question * 100 || 0;
    this.drawCircle(Math.ceil(_persent));
    that.canvasToImg();
    that.bindData();
    var reg = {
      result_test_total: options.totla_question,
      result_test_true: options.correct_number,
      result_test_time: options.use_time_total,
      test_id: getApp().globalData.g_test_id,
      usr_msg: wx.getStorageSync(userinfo) || {},
      //todo app.globalData.userInfo
      percent: Math.ceil(_persent)
    };
    that.setData(reg);
    console.log('result---', reg); //todo 保存记录结果

    wx.request({
      url: 'https://v.xueweigui.com/Words/testResultSet',
      data: {
        msg: reg,
        type: getApp().globalData.g_test_type
      },
      //todo 测试
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值

      },

      success(res) {}

    });
    console.log(getApp().globalData.g_from_app, 'app.globalData.g_from_app');
    this.setData({
      fromApp: getApp().globalData.g_from_app,
      test_id: options.test_id,
      hasRank: getApp().globalData.g_has_rank
    }); //app.globalData.g_audio_bookid = 10;

    wx.request({
      url: 'https://v.xueweigui.com/Words/ieltsResult?type=' + getApp().globalData.g_audio_bookid,
      header: {
        'content-type': 'application/json' // 默认值

      },

      success(res) {
        that.setData({
          ad: res.data.data,
          ad1: res.data.data.ad1.split('\r\n')
        });
      }

    });
  },
  onUnload: function () {
    console.log('onUnload');
	 wx.navigateBack({delta:1});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.canvasToImg();
  },
  onError: function (e) {
    util.backLog(e);
  },
  methods: {
	  drawCircle:function(val){
	  	this.progresstext = val;
	  	var deg = val/100*360;
	  	if(deg<=180)
	  	{
	  		this.rightprogress = 'rotate('+(45+deg)+'deg)'
	  		this.leftprogress = 'rotate('+(-45)+'deg)'
	  	}else
	  	{
	  		this.rightprogress = 'rotate('+(45+180)+'deg)'
	  		this.leftprogress = 'rotate('+(-45+(deg-180))+'deg)'
	  	}
	  },
    /**
     * 生命周期函数--监听页面加载
     */
    //判断页面的长度
    page_height: function () {
      var that = this;
      var result_page_height = null;
      var result_page_width = null;
      var query = wx.createSelectorQuery();
      query.selectAll('.result_page').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(function (res) {
        result_page_height = res[0][0].height;
        result_page_width = res[0][0].width;
        that.setData({
          result_page_height: result_page_height + 25,
          result_page_width: result_page_width
        });
      });
    },
    // 判断每一个单词的长度
    word_width: function () {
      var ary = [];
      var that = this;
      var query = wx.createSelectorQuery();
      query.selectAll('.result_word_list_word').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(function (res) {
		  console.log('word-width',res);
        // res[0].forEach(function (item, index) {
        //   ary.push(item.width);
        // });
        that.setData({
          word_width_ary: ary
        });
      });
    },

    eventDraw() {
      var that = this;
      wx.getSystemInfo({
        success: function (res) {
          let height = res.windowHeight;
          let width = res.windowWidth;

          if (res.platform == 'android') {
            height = height + 30;
          }

          that.setData({
            screen_h: height,
            screen_w: width
          });
          that.setData({
            // 屏幕宽度 375px = 750rpx，1px=2rpx
            // 1px = （750 / 屏幕宽度）rpx；
            // 1rpx = （屏幕宽度 / 750）px;
            ratio: that.screen_w / 750
          });
        }
      });
      var word_lists = JSON.stringify(that.word_list);
      var word_list = JSON.parse(word_lists);
      var tt = [];
      var word_width = that.word_width_ary;
      let center_w = that.result_page_width / 2;
      let center_h = that.result_page_height / 2;
      let cut_title_h = 60;
      let cut_title_l = 190;
      let cut_title_d = 20;
      let cut_avatar_h = 0; //********* */

      let rule_w = 750; //rpx

      let rule_h = that.ad.height * that.ratio; //let rule_h = 1140 * that.data.ratio;

      var view = [{
        type: 'rect',
        background: '#3075C6',
        width: rule_w * that.ratio || 800,
        height: rule_h,
        top: 0,
        left: 0
      }, // {
      //   type: 'image',
      //   url: that.data.ad.image,
      //   top: 0,
      //   left: 0,
      //   width: rule_w * that.data.ratio,
      //   height: 322 * that.data.ratio
      // },
      {
        type: 'text',
        content: that.ad.share_top1 || '',
        color: '#FFFFFF',
        fontSize: 28 * that.ratio,
        textAlign: 'center',
        top: 100 * that.ratio,
        left: 362 * that.ratio
      }, {
        type: 'text',
        content: that.ad.share_top2 || '',
        color: '#FFFFFF',
        fontSize: 44 * that.ratio,
        textAlign: 'center',
        top: 140 * that.ratio,
        left: 372 * that.ratio
      }, // {
      //   type: 'image',
      //   url:  '',
      //   top: 268 * that.data.ratio,
      //   left: 315 * that.data.ratio,
      //   width: 120 * that.data.ratio,
      //   height: 120 * that.data.ratio,
      //   borderRadius: 60 * that.data.ratio
      // },
      // {
      //   type: 'text',
      //   content: that.data.usr_msg.name + '的测试结果' || '',
      //   color: '#333333',
      //   fontSize: 28 * that.data.ratio,
      //   textAlign: 'center',
      //   top: 395 * that.data.ratio,
      //   left: 370 * that.data.ratio,
      // },
      {
        type: 'rect',
        background: "#AABBFF",
        width: 320 * that.ratio,
        height: 320 * that.ratio,
        top: 320 * that.ratio,
        left: 216 * that.ratio,
        radius: 160 * that.ratio
      }, {
        type: 'circle',
        background: '#fff',
        r: 150 * that.ratio,
        centerX: 375 * that.ratio,
        centerY: 480 * that.ratio,
        end: that.percent,
        lineWidth: 16 * that.ratio
      }, {
        type: 'rect',
        background: '#3075C6',
        width: 280 * that.ratio,
        height: 280 * that.ratio,
        top: 340 * that.ratio,
        left: 234 * that.ratio,
        radius: 140 * that.ratio
      }, {
        type: 'text',
        content: '正确率',
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        top: 400 * that.ratio,
        left: 375 * that.ratio
      }, {
        type: 'text',
        content: that.percent + "%",
        color: '#fff',
        fontSize: 60 * that.ratio,
        textAlign: 'center',
        top: 470 * that.ratio,
        left: 380 * that.ratio
      }, {
        type: 'text',
        content: '本次测试',
        fontSize: 28 * that.ratio,
        color: '#fff',
        textAlign: 'center',
        top: 710 * that.ratio,
        left: 160 * that.ratio
      }, {
        type: 'text',
        content: '正确',
        fontSize: 28 * that.ratio,
        color: '#fff',
        textAlign: 'center',
        top: 710 * that.ratio,
        left: 379 * that.ratio
      }, {
        type: 'text',
        content: '用时',
        fontSize: 28 * that.ratio,
        color: '#fff',
        textAlign: 'center',
        top: 710 * that.ratio,
        left: 597 * that.ratio
      }, {
        type: 'text',
        content: that.result_test_total + '个',
        fontSize: 40 * that.ratio,
        color: '#fff',
        textAlign: 'center',
        top: 750 * that.ratio,
        left: 157 * that.ratio
      }, {
        type: 'text',
        content: that.result_test_true + '个',
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        top: 750 * that.ratio,
        left: 375 * that.ratio
      }, {
        type: 'text',
        content: that.result_test_time + '秒',
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        top: 750 * that.ratio,
        left: 595 * that.ratio
      }, {
        type: 'image',
        url: that.ad.mini_qr || '',
        top: 940 * that.ratio,
        left: 485 * that.ratio,
        width: 157 * that.ratio,
        height: 157 * that.ratio
      }];
      let ad_offset_1 = 7;
      let ad_offset_2 = 14;
      let ad_offset_3 = 30;
      let cut_base_h = 40;
      let cut_ad_h = 930;
      let ad_msg = that.ad.ad1;
      let ad_arr = ad_msg.split('\r\n');
      let _ad = [];

      for (let i = 0; i < ad_arr.length; i++) {
        let _view = {
          type: 'text',
          content: '和一套终身受益的词汇学习方法',
          fontSize: 28 * that.ratio,
          color: '#fff',
          // textAlign: 'center',
          top: cut_avatar_h,
          left: cut_title_l
        };

        if (i == 1) {
          _view.top = cut_ad_h * that.ratio + 45 * i * that.ratio;
        } else {
          _view.top = cut_ad_h * that.ratio + cut_base_h * i * that.ratio;
        }

        _view.content = ad_arr[i];

        if (i == 0) {
          _view.fontSize = 35 * that.ratio;
        }

        if (ad_arr[i].length <= ad_offset_1) {
          //_view.left = 370 * that.data.ratio;
          _view.left = 75 * that.ratio;
        }

        if (ad_arr[i].length > ad_offset_1 && ad_arr[i].length <= ad_offset_2) {
          //_view.left = 380 * that.data.ratio;
          _view.left = 75 * that.ratio;
        }

        if (ad_arr[i].length > ad_offset_2 && ad_arr[i].length <= ad_offset_3) {
          //_view.left = 360 * that.data.ratio;
          _view.left = 75 * that.ratio;
        }

        _ad.push(_view);
      }

      let last_ad_h = _ad[_ad.length - 1].top;
      let custom_ad = {
        type: 'text',
        content: that.ad.ad2,
        fontSize: 24 * that.ratio,
        color: '#ffcc64',
        // textAlign: 'center',
        top: last_ad_h + 50 * that.ratio,
        //left: 370 * that.data.ratio
        left: 75 * that.ratio
      };

      _ad.push(custom_ad);

      view = view.concat(_ad);
      // wx.showLoading({
      //   title: '绘制分享图片中',
      //   mask: true
      // });
      this.setData({
        painting: {
          width: that.result_page_width,
          height: rule_h,
          background: "#fff",
          clear: true,
          views: view
        }
      });
    },

    eventSave() {
      wx.saveImageToPhotosAlbum({
        filePath: this.shareImage,

        success(res) {
          wx.showToast({
            title: '保存图片成功',
            icon: 'success',
            duration: 2000
          });
        }

      });
    },

    eventGetImage(event) {
      wx.hideLoading(); //隐藏loading

      this.setData({
        painting: {}
      });
      wx.previewImage({
        urls: [event.detail.tempFilePath]
      });
      const {
        tempFilePath,
        errMsg
      } = event.detail;

      if (errMsg === 'canvasdrawer:ok') {
        this.setData({
          shareImage: tempFilePath
        });
      }
    },

    // 重新测试
    test_again: function () {
      wx.navigateTo({
        url: '/pages/wtest/wtest?id=' + this.test_id + '&tid=' + this.test_id
      });
    },
    // 把canvas生成图片
    canvasToImg: function () {
      var that = this;
      var query = that.createSelectorQuery();
      query.selectAll('#shadow-root').boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(function (res) {});
    },
    // 分享截图
    fenxiang_jietu: function () {
      this.eventDraw();
    },
    // 绑定单词释义列表
    bindData: function () {
      const manager = wx.getBackgroundAudioManager();
      manager.stop();
      var that = this;
      var resultArr = getApp().globalData.result_data;
      var _result_data_fail_css = getApp().globalData.result_data_fail_css;
      console.log(1111, resultArr);
      console.log(3333, _result_data_fail_css); // resultArr = [
      //   {
      //     ext:"ne33",
      //     num:0,
      //     word:"nice"
      //   }
      //   ];
      // _result_data_fail_css = [0];

      for (let i = 0; i < resultArr.length; i++) {
        resultArr[i].num = _result_data_fail_css[i];
      }

      that.setData({
        word_list: resultArr,
        result_data_fail_css: _result_data_fail_css
      });
      that.word_width();
      that.page_height();
    },
    lookResult: function () {
      wx.navigateTo({
        url: '/pages/wtest/result_list'
      });
    },
    goRank: function () {
      wx.navigateTo({
        url: '/pages/wtest/rank?id=' + getApp().globalData.g_test_id
      });
    },
    //测试点击返回
    testBackEvent: function () {
      console.log('testBackEvent');
      wx.navigateBack({
        delta: 2
      });
    },
    //测试点击home
    testHomeEvent: function () {
      console.log('testHomeEvent');
      wx.switchTab({
        url: '/pages/ablum/ablum'
      });
    }
  }
};
</script>
<style>
@import "./result.css";
.content {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		flex-flow: wrap;
		align-items: center;
		border-radius: 50%;
		text-align: center;
		height: 400rpx;
		padding-top: 50rpx;
	}
	.circleprogress{
		width: 100%;
		height: 200rpx;
		display: flex;
		justify-content: center;
		
	}
	.circleprogress .progresstext-title{
		position: absolute;
		top: 206rpx;
		font-size: 30rpx;
		width: 200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
		color: #fff;
	}
	.circleprogress .progresstext{
		position: absolute;
		font-size: 40rpx;
		top: 172rpx;
		width: 200rpx;
		height: 200rpx; 
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
		color: #fff;
	}
	.circleprogress .wrapper{
		width: 100rpx;
		height: 200rpx;
		overflow: hidden;
	}
	.circleprogress .leftprogress,.rightprogress{
		width: 160rpx;
		height: 160rpx;
		border:20rpx solid #AABBFF;
		
		border-bottom:20rpx solid #fff;
		border-radius: 50%;
		
	}
	.circleprogress .leftprogress{
		border-right:20rpx solid #fff;
	}
	.circleprogress .rightprogress{
		border-left:20rpx solid #fff;
		margin-left: -100rpx;
	}
	.section{
		width: 80%;
		margin-top: 50rpx;
	}
</style>