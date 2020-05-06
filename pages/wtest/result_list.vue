<template>
<view>
<nav-bar :navbar-data="nvabarData"></nav-bar>
<view class="container">
  <view class="result_word_list" v-for="(item, index) in word_list" :key="index">
    <text :class="'result_word_list_index ' + (item.num?'fail_select':'')">{{index+1}}.</text>
    <text :class="'result_word_list_word ' + (item.num?'fail_select':'')">{{item.word}}</text>
    <text :class="'result_word_list_dec ' + (item.num?'fail_select':'')">{{item.ext}}</text>
  </view>
  <view class="blank"></view>
</view>
</view>
</template>

<script>
var app = getApp().globalData;
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      word_list: null,
      //单词列表
      nvabarData: {
        showCapsule: 1,
        title: '答案'
      },
      result_data_fail_css: ""
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
    this.bindData();
  },
  methods: {
    // 绑定单词释义列表
    bindData: function () {
      var that = this;
      var resultArr = getApp().globalData.result_data;
      var _result_data_fail_css = getApp().globalData.result_data_fail_css;

      for (let i = 0; i < resultArr.length; i++) {
        resultArr[i].num = _result_data_fail_css[i];
      }

      that.setData({
        word_list: resultArr,
        result_data_fail_css: _result_data_fail_css
      });
    }
  }
};
</script>
<style>
@import "./result_list.css";
</style>