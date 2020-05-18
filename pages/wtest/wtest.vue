<template>
<view>
<!--pages/test/test.wxml-->
<nav-bar v-if="!navBarHidden" :navbar-data="nvabarData" :has-custom="hasCustom" @testBackEvent="testBackEvent" @testHomeEvent="testHomeEvent"></nav-bar>
<view :hidden="pageHidden" class="test_page">

  <view class="test_question_type">{{test_question_type}}/{{category}}</view>
  <!-- 题目 -->
  <view class="test_top" :hidden="hidden_text">
    <text class="test_question">{{test_question_title}}</text>
  </view>

  <!-- 音频按钮 -->
  <view @tap.stop="repeatPlay" class="audio_img" :hidden="hidden_audio">
    <image class="img" :src="is_end ? 'https://uimg.gximg.cn/v/res/201906/06-19/sound_1.png' : 'https://uimg.gximg.cn/v/res/201906/06-19/sound_2.png'"></image>
  </view>

  <!-- 单选题 -->
  <view class="test_static">

    <view>
      <!-- <view class='test_line_left'></view> -->
      <view class="test_type">
        <text>{{current_queation_index}}</text>/<text>{{totla_question}}</text>
      </view>
      <view :hidden="timerHidden" class="test_pagination">
        <text class="test_timer">{{test_timer}}s</text>
      </view>
    </view>
  </view>

  <!-- 问题 -->
  <view v-for="(item, index) in test_data" :key="index" :data-index="index" :class="'test_item ' + (select_flag==index && select_flag == right_idx?'test_select':(select_flag==index && select_flag != right_idx ?'test_error' : '')) + ' ' + (select_flag != null && index === right_idx?'test_select': '')" @tap="add_select">{{item}}<view class="answer_icon">
      <image v-if="select_flag==index && select_flag == right_idx" src="https://uimg.gximg.cn/v/res/201906/01-17/right_icon.png"></image>
      <image v-if="select_flag==index && select_flag != right_idx" src="https://uimg.gximg.cn/v/res/201906/01-17/wrong_icon.png"></image>
      <image v-if="select_flag != null && index === right_idx" src="https://uimg.gximg.cn/v/res/201906/01-17/right_icon.png"></image>
    </view>
  </view>


  <!-- 下一题 -->
  <!-- <button class='test_nextone_btn {{test_nextone_btn_flag?"test_select":""}}' bindtap='test_nextone_btn_end'>{{button_text}}</button> -->

</view>
</view>
</template>

<script>
// pages/test/test.js'
var app = getApp().globalData;
var util = require("../../utils/util");
var testUrl = "https://v.xueweigui.com/Words/ieltsMiniQ?id=";
const manager = wx.createInnerAudioContext();
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      _data_list: '',
      //哪一套题
      test_data: '',
      //存放测试题
      select_flag: '',
      //选中样式
      test_nextone_btn_flag: '',
      //下一题按钮样式
      timer_daojishi: '',
      //倒计时timer
      test_timer: 1,
      //倒计时总长
      totla_question: '',
      //题目个数
      current_queation_index: 1,
      //当前题的索引
      hidden_text: false,
      //控制文字题目的显示和隐藏
      hidden_audio: true,
      //控制音频的显示和隐藏
      test_question_type: '',
      //题目类型：单选题
      test_question_title: '',
      //文字题目的标题
      correct_number: 0,
      //选对的数量
      data_right: '',
      //数据中正确的一项
      button_text: "下一题",
      //按钮状态
      use_time_total: 0,
      //用户做题所用时间
      use_time_timer: '',
      //定时器
      user_select: false,
      //判断用户是否选择了
      result_data_fail_css: [],
      //结果页单词错误标红
      category: '',
      is_end: true,
      timerHidden: true,
      play_id: 0,
      //播放idx
      pageHidden: true,
      //默认隐藏页面内容
      nvabarData: {
        showCapsule: 1,
        title: '测试'
      },
      hasCustom: true //触发自定义返回
      ,
      right_idx: "",
      duration: "",
      audio_src: "",
      test_id: "",
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
    console.log('options', options);
    var pid = options.pid || null;
    var id = options.id || 0;
    var tid = options.tid || 0;
    var goUrl = decodeURIComponent(options.url) || '';
    var that = this;
    var index = 0;
    that.use_time();
    console.log('tid---', tid);
    console.log('pid---', pid);
    console.log('id---', id);
    console.log('gourl---', goUrl);
    getApp().globalData.g_test_id = id != 0 ? id : tid;
    console.log('app.globalData.g_test_id', getApp().globalData.g_test_id); //var urls = tid == 0 ? app.globalData.g_req_data[pid]['test_ti']['url'] : testUrl + tid;

    var urls = '';

    if (options.stime != undefined) {
      console.log(options.stime, 'stime');
      getApp().globalData.g_test_stime = options.stime;
    }

    if (options.etime != undefined) {
      getApp().globalData.g_test_etime = options.etime;
    }

    if (options.test_type != undefined) {
      getApp().globalData.g_test_type = options.test_type;
    }

    if (options.isrank != undefined) {
      console.log(options.isrank, options.isrank != 'undefined', options.isrank != undefined, typeof options.isrank, 'app.globalData.g_has_rank');
      getApp().globalData.g_has_rank = options.isrank;
    }

    console.log('option,', getApp().globalData.g_test_etime);

    if (goUrl != 'undefined') {
      urls = goUrl;
    } else if (tid == 0) {
      urls = getApp().globalData.g_req_data[pid]['test_ti']['url'];
      console.log('22222--', urls);
    } else {
      urls = testUrl + tid;
      console.log('33333--', urls);
    }

    console.log('testUrl---', urls);
    util.getRequest(urls,{},function(res) {
        if (res.statusCode == 200) {
			console.log('test_data', res);
          // wx.hideLoading();
          that.queryData(res.data.data, index); //获取上一级小程序传过来的数据，判断是哪一套题
        }
      }
    );
    this.setData({
      test_id: id
    });
    getApp().globalData.g_audio_obj.pause();
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
  onError: function (e) {
    util.backLog(e);
  },
  onHide: function () {
    console.log('onHIde');
  },
  onUnload: function () {
    clearInterval(this.$data.timer_daojishi);
    console.log('onUnLoad');
  },
  methods: {
    //选项添加样式
    add_select: function (e) {
      var that = this;

      if (this.$data.select_flag != null) {
        return;
      }

      let selected_idx = e.currentTarget.dataset.index;
      let data = that.$data._data_list;
      let right_idx = data[that.$data.current_queation_index - 1].right;
      that.setData({
        right_idx: right_idx,
        select_flag: selected_idx,
        test_nextone_btn_flag: true,
        user_select: true
      });

      let _timer = setInterval(function () {
        that.test_nextone_btn_end('dao');
        clearInterval(_timer);
      }, 500); //this.test_nextone_btn_end('dao');
      //倒计时
      //that.daojishi();

    },
    //用户测试用时
    use_time: function () {
      var that = this;
      this.$data.use_time_timer = setInterval(function () {
        that.setData({
          use_time_total: that.$data.use_time_total + 1
        });
      }, 1000);
    },
    // 下一题按钮
    test_nextone_btn_end: function (flag) {
      var that = this;

      if (that.$data.user_select) {
        that.setData({
          user_select: false
        });
        var index = that.$data.current_queation_index;
        if (flag != "dao") clearInterval(that.$data.timer_daojishi); //如果是倒计时时间到？？？

        if (index == that.$data.totla_question - 1) {
          that.setData({
            button_text: "查看成绩"
          });
        }

        if (index <= that.$data.totla_question) {
          if (index <= that.$data.totla_question - 1) {
            that.setData({
              test_nextone_btn_flag: false,
              current_queation_index: that.$data.current_queation_index + 1
            });
            that.daojishi();
          }

          that.bindData();

          if (index == that.$data.totla_question) {
            clearInterval(that.$data.use_time_timer);
            clearInterval(that.$data.timer_daojishi);
            that.jump_retult_page();
          }
        }
      }
    },
    // 倒计时
    daojishi: function (_total) {
      var total = this.$data.duration || 1;
      if (total <= 1) return;
      clearInterval(this.$data.timer_daojishi);
      var that = this;
      that.setData({
        test_timer: total
      });
      var flag_dao = "dao";
      that.$data.timer_daojishi = setInterval(function () {
        total--;

        if (total > 0) {
          that.setData({
            test_timer: total
          });
        }

        if (total == 0) {
          that.setData({
            user_select: true
          });
          clearInterval(that.$data.timer_daojishi);
          that.setData({
            data_right: -1
          });
          that.test_nextone_btn_end(flag_dao);
        }
      }, 1000);
    },
    // 做对的题目数量
    correct_num: function (right) {
      var that = this;
      var _right = right;
      var select_flag = that.$data.select_flag;
      if (select_flag == null || _right == null || _right, right.length == 0) return;

      if (select_flag == _right) {
        var correct_num = that.$data.correct_number + 1;

        if (correct_num <= that.$data.totla_question) {
          that.setData({
            correct_number: correct_num
          });
          that.$data.result_data_fail_css.push(0);
        }
      } else {
        that.$data.result_data_fail_css.push(1);
      }
    },
    //最后一题
    jump_retult_page: function () {
      //console.log(this.data.result_data_fail_css)
      getApp().globalData.result_data_fail_css = this.$data.result_data_fail_css; //赋值给全局变量

	  // wx.navigateTo({
   //      url: '/pages/wtest/result_list'
   //    });
      wx.navigateTo({
        url: '/pages/wtest/result?correct_number=' + this.$data.correct_number + "&use_time_total=" + this.$data.use_time_total + "&totla_question=" + this.$data.totla_question + "&test_id=" + this.$data.test_id //把用的时间，做对多少题，总共的题目
      });
    },
    //获取数据
    queryData: function (data, index) {
      var _data = data; //此处的index还不确定
      console.log('_data.content',_data.content);;

      var result = _data.result; //结果页单词展示
      var _data_title = _data.desc;
      var _data_total = _data.total;
      var duration = _data.duration;
      var that = this;
      that.setData({
        test_question_type: _data_title,
        totla_question: _data_total,
        _data_list: _data.content,
        duration: duration,
        pageHidden: false,
        timerHidden: duration <= 1 ? true : false
      });
	  setTimeout(()=>{
		  that.setData({
		    _data_list: _data.content
		  });
	  },3000);
      getApp().globalData.result_data = result; //赋值给全局变量

      that.bindData(); //修改

      that.daojishi();
    },
    bindData: function () {
      //通过改变索引达到改变题目
      var that = this;
      var data = that.$data._data_list;
      var current_index = that.$data.current_queation_index; //当前第几题的索引

      var type = data[current_index - 1].type; //判断题目类型：音频或者文字

      var category = data[current_index - 1].type_text;
      var answer = data[current_index - 1].answer;
      var right = data[current_index - 1].right;
      var url = data[current_index - 1].url;
      var question = data[current_index - 1].question;
      that.correct_num(this.$data.data_right);
console.log('bniddata',data,that.$data.duration,url,manager);
      if (type == 1) {
        console.log('hidden_audio');
        this.setData({
          hidden_text: true,
          hidden_audio: false,
          category: category || '听力类'
        });
      } else {
        that.setData({
          hidden_text: false,
          hidden_audio: true,
          test_question_title: question
        });
      }

      if (type == 2) {
        that.setData({
          category: category || '阅读类'
        });
      }

      if (type == 3) {
        that.setData({
          category: category || '口语&阅读类'
        });
      }

      that.setData({
        test_data: answer,
        select_flag: null,
        data_right: right
      });

      if (type == 1) {
        that.setData({
          is_end: true
        });
        manager.src = url;
        manager.title = '测试题'; // manager.onCanplay(() =>{
        //   console.log('即将播放');
        //   var flag_dao = "dao";
        //   var total = this.data.duration || 1;
        //   console.log('duration', total);
        //   that.data.timer_daojishi = setInterval(function () {
        //     total--;
        //     if (total > 0) {
        //       that.setData({
        //         test_timer: total,
        //       })
        //     }
        //     if (total == 0) {
        //       that.setData({
        //         user_select: true
        //       })
        //       clearInterval(that.data.timer_daojishi);
        //       that.setData({
        //         data_right: -1
        //       });
        //       that.test_nextone_btn_end(flag_dao);
        //     }
        //   }, 1000)
        // });

        manager.play();
        manager.onPlay(() => {
          console.log('play');
          that.setData({
            audio_src: url
          });
        });
        manager.onEnded(() => {
          that.setData({
            is_end: false
          });
        });
        manager.onError(e => {
          util.backLog(e);
          console.log(e);
        }); // manager.offCanplay(() => {
        //   console.log('offcanplay');
        // });
      }
    },
    //播放动画处理
    audioPlay: function () {
      var that = this;

      for (let i = 0; i < 6; i++) {
        console.log('audipPlys--', i);
        that.setData({
          play_id: i
        });
      }
    },
    repeatPlay: function () {
      var that = this;

      for (let i = 0; i < 5; i++) {
        that.setData({
          play_id: i
        });
      }

      manager.src = this.$data.audio_src || '';
      manager.title = '测试题';
      manager.obeyMuteSwitch = false;
      manager.play();
      manager.onPlay(() => {
        that.setData({
          is_end: true
        });
        console.log('play');
      });
      manager.onError(e => {
        util.backLog(e);
        console.log(e);
      });
    },
    //测试点击返回
    testBackEvent: function () {
      console.log('testBackEvent');
      wx.showModal({
        title: '提示',
        content: '退出将不计入成绩',

        success(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            });
          } else if (res.cancel) {}
        }

      });
    },
    //测试点击home
    testHomeEvent: function () {
      console.log('testHomeEvent');
      wx.showModal({
        title: '提示',
        content: '退出将不计入成绩',

        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/ablum/ablum'
            });
          } else if (res.cancel) {}
        }

      });
    }
  }
};
</script>
<style>
@import "./wtest.css";
</style>