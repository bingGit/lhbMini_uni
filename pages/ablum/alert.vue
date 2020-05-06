<template>
<view>
<!-- // 引入自定义组价。'navbar-data'中navbar是自定义名字，决定了组件中'navbarData'的名字 -->
<nav-bar :navbar-data="nvabarData"></nav-bar>

<view class="home-page"> 
   <text>上面是自定义导航栏↑↑↑</text> 
   <text>下面是主体内容↓↓↓</text> 
   <navigator url="./testPage">跳转到测试页</navigator> 
</view>
</view>
</template>

<script>
const app = getApp().globalData;
import navBar from "../../component/nav-bar/nav-bar";

export default {
  data() {
    return {
      // 组件所需的参数
      nvabarData: {
        showCapsule: 1,
        //是否显示左上角图标   1表示显示    0表示不显示
        title: '我的主页' //导航栏 中间的标题

      },
      // 此页面 页面内容距最顶部的距离
      height: getApp().globalData.g_bar_height
    };
  },

  components: {
    navBar
  },
  props: {},

  onLoad() {
    console.log(this.height);
  },

  methods: {}
};
</script>
<style>
@import "./alert.css";
</style>