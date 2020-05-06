<template>
<view>
<!-- 自定义导航栏 -->
<cover-view class="place-holder" :style="'height:' + navbarHeight + 'px;'"></cover-view>
<cover-view class="navbar-wrap" :style="'background-color:' + navbarData.bgColor + ';height:' + navbarHeight + 'px;padding-top:' + statusBarHeight + 'px;'">  
  <cover-view class="navbar-text" :style="'color:' + navbarData.titleColor + ';line-height:' + (navbarBtn.height + navbarBtn.top) + 'px;'">{{navbarData.title ? navbarData.title : "默认标题"}}</cover-view>
  <cover-view class="navbar-icon" v-if="navbarData.showCapsule ? navbarData.showCapsule : false" :style="'top:' + (navbarBtn.top + statusBarHeight) + 'px;left:' + navbarBtn.right + 'px;height:' + navbarBtn.height + 'px;'"> 
      <cover-image v-if="haveBack" @tap="goBackFun" class="icon" src="https://uimg.gximg.cn/v/res/201906/06-15/back_btn@3x.png"></cover-image>  
      <cover-view v-if="haveBack" class="floatL"></cover-view>
      <cover-image @tap="goHomeFun" class="icon" src="https://uimg.gximg.cn/v/res/201906/06-15/home@3x.png"></cover-image>
  </cover-view>
</cover-view>
<!-- 手写loading -->
<!-- <view class="navbar-loading" style='height:{{navbarHeight}}px;line-height:{{navbarHeight}}px;'>
  <text>...</text>
</view> -->
</view>
</template>

<script>
const app = getApp().globalData;

export default {
  data() {
    return {
      haveBack: true,
      // 是否有返回按钮，true 有 false 没有 若从分享页进入则为 false
      statusBarHeight: 0,
      // 状态栏高度
      navbarHeight: 0,
      // 顶部导航栏高度
      navbarBtn: {
        // 胶囊位置信息
        height: 0,
        width: 0,
        top: 0,
        bottom: 0,
        right: 0
      }
    };
  },

  components: {},
  props: {
    navbarData: {
      // 由父页面传递的数据
      type: Object,
      default: () => ({
        showCapsule: 0,
        bgColor: "#3075c6",
        titleColor: "#fff",
        // 是否显示左上角胶囊按钮 1 显示 0 不显示
        title: '默认标题'
      })
    },
    //是否触发自定义事件
    hasCustom: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    navbarData: {
      handler: function (newVal, oldVal) {
        for (let i in oldVal) {
          if (!newVal.hasOwnProperty(i)) {
            newVal[i] = oldVal[i];
          }
        } // console.log('observer',newVal,oldVal);

      },
      deep: true
    },
    hasCustom: function (newVal, oldVal) {
      console.log('customEvnet', newVal, oldVal);
    }
  },
  // 微信7.0.0支持wx.getMenuButtonBoundingClientRect()获得胶囊按钮高度
  beforeMount: function () {
    // console.log('nav-bar-attached',this.data);
    let statusBarHeight = getApp().globalData.systeminfo.statusBarHeight; // 状态栏高度

    let headerPosi = getApp().globalData.headerBtnPosi; // 胶囊位置信息

    /**
     * wx.getMenuButtonBoundingClientRect() 坐标信息以屏幕左上角为原点
     * 菜单按键宽度： 87
     * 菜单按键高度： 32
     * 菜单按键左边界坐标： 278
     * 菜单按键上边界坐标： 26
     * 菜单按键右边界坐标： 365
     * 菜单按键下边界坐标： 58
     */

    let btnPosi = {
      // 胶囊实际位置，坐标信息不是左上角原点
      height: getApp().globalData.g_old_version ? 30 : headerPosi.height,
      //headerPosi.height,
      width: headerPosi.width,
      // 胶囊top - 状态栏高度
      top: getApp().globalData.g_old_version ? getApp().globalData.g_bar_height * 0.41 - statusBarHeight : headerPosi.top - statusBarHeight,
      // 胶囊bottom - 胶囊height - 状态栏height （现胶囊bottom 为距离导航栏底部的长度）
      bottom: headerPosi.bottom - headerPosi.height - statusBarHeight,
      // 屏幕宽度 - 胶囊right
      right: getApp().globalData.g_old_version ? 10 : getApp().globalData.systeminfo.screenWidth - headerPosi.right
    };
    let haveBack;

    if (getCurrentPages().length === 1) {
      // 当只有一个页面时
      haveBack = false;
    } else {
      haveBack = true;
    }

    this.setData({
      haveBack: haveBack,
      // 获取是否是通过分享进入的小程序
      statusBarHeight: statusBarHeight,
      navbarHeight: getApp().globalData.g_old_version ? getApp().globalData.g_bar_height : headerPosi.bottom + btnPosi.bottom,
      // 原胶囊bottom + 现胶囊bottom
      navbarBtn: btnPosi,
      navbarData: this.navbarData
    });
  },
  methods: {
    goBackFun: function () {
      if (this.hasCustom) {
        this.$emit("testBackEvent");
        return;
      }

      wx.navigateBack({
        delta: 1
      });
    },
    goHomeFun: function () {
      if (this.hasCustom) {
        this.$emit("testHomeEvent");
        return;
      }

      wx.switchTab({
        url: '/pages/ablum/ablum'
      });
    }
  }
};
</script>
<style>
@import "./nav-bar.css";
</style>