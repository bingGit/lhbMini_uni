<template>
<view>
<!--pages/lab/lab.wxml-->

<view style="padding: 0 30px; border-bottom:1px solid #eee;">
  <view style="text-align:center; font-weight:bold;margin-top:20px;">实验室功能1: 动态插入</view>
  <view style="text-align:center;color: #333;margin-top:5px;margin-bottom:10px;">本功能是一种扩展的可能,我们可以在需要动态插入标签的地方动态使用此方法</view>
  <jyf-parser :html="article_insertData"></jyf-parser>
  <view style="text-align:center">
    <button type="default" size="mini" @tap="insertNodeTap">点击插入节点</button>
  </view>
</view>

<view style="padding: 0 30px; border-bottom:1px solid #eee;">
  <view style="text-align:center; font-weight:bold;margin-top:20px;">实验室功能2: a标签跳转</view>
  <view style="text-align:center;color: #333;margin-top:5px;margin-bottom:10px;">在阅读类场景下，很可能需要在文中使用路由跳转。试验在动态获取解析到的src来转换本地路由</view>
  <jyf-parser :html="article_aHrefHrefData"></jyf-parser>
</view>

<view style="padding: 0 30px; border-bottom:1px solid #eee;">
  <view style="text-align:center; font-weight:bold;margin-top:20px;">实验室功能2: 小表情emoji</view>
  <view style="text-align:center;color: #333;margin-top:5px;margin-bottom:10px;">在回复等场景下，很可能会出现小表情，添加进来</view>
  <jyf-parser :html="article_emojisData"></jyf-parser>
</view>
</view>
</template>

<script>


export default {
  data() {
    return {
      article_insertData: "",
      article_aHrefHrefData: "",
      article_emojisData: ""
    };
  },

  components: {},
  props: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var aHrefHrefData = '<div style="color:red;text-align:center;padding:20px;"><a href="https://weappdev.com/index.html">点击我，可以跳转</a></div>';
    //WxParse.wxParse('aHrefHrefData', 'html', aHrefHrefData, that)
    setTimeout(() => {
      that.article_aHrefHrefData = aHrefHrefData;
    }, 200);
    var emojisData = '<div style="color:red;text-align:center;padding:20px;">我带有小表情[00][01][02][03]</div>';
    //WxParse.wxParse('emojisData', 'html', emojisData, that)
    setTimeout(() => {
      that.article_emojisData = emojisData;
    }, 200);
  },
  onReady: function () {// 页面渲染完成
  },
  onShow: function () {// 页面显示
  },
  onHide: function () {// 页面隐藏
  },
  onUnload: function () {// 页面关闭
  },
  methods: {
    insertNodeTap: function (e) {
      var that = this;
      var insertData = '<div style="color:red;text-align:center;padding:20px;">我是一个被插入的元素</div>';
      //WxParse.wxParse('insertData', 'html', insertData, that)
      setTimeout(() => {
        that.article_insertData = insertData;
      }, 200);
    },
    wxParseTagATap: function (e) {
      var href = e.currentTarget.dataset.src;
      console.log(href); //我们可以在这里进行一些路由处理

      if (href.indexOf(index) > 0) {// wx.redirectTo({
        //   url: '../index/index'
        // })
      }
    }
  }
};
</script>
<style>
@import "./lab.css";
</style>