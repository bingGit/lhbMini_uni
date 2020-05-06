<template>
<view class="modals modals-bottom-dialog" :hidden="hideModal">
  <view class="modals-cancel" @tap="hideModalFun"></view>
  <view :class="'bottom-dialog-body bottom-pos ' + (radius ? 'dialog-radius':'')" :animation="animationData" :style="'height:' + height + 'px;'">
    <view>
      <slot name="body"></slot>
    </view>
  </view>
</view>

<!-- <button bindtap="showModal">点我</button> -->
</template>

<script>

export default {
  data() {
    return {
      hideModal: true,
      //模态框的状态  true-隐藏  false-显示
      animationData: {} //

    };
  },

  components: {},
  props: {
    radius: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: Number,
      default: 390
    }
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持

  },
  mounted: function () {},
  methods: {
    // 显示遮罩层
    showModal: function () {
      var that = this;
      that.setData({
        hideModal: false
      });
      var animation = wx.createAnimation({
        duration: 400,
        //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease' //动画的效果 默认值是linear

      });
      this.animation = animation;
      setTimeout(function () {
        that.fadeIn(); //调用显示动画
      }, 300);
    },
    // 隐藏遮罩层
    hideModalFun: function () {
      var that = this;
      var animation = wx.createAnimation({
        duration: 800,
        //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease' //动画的效果 默认值是linear

      });
      this.animation = animation;
      that.fadeDown(); //调用隐藏动画   

      setTimeout(function () {
        that.setData({
          hideModal: true
        });
      }, 780); //先执行下滑动画，再隐藏模块
    },
    //动画集
    fadeIn: function () {
      this.animation.translateY(0).step();
      this.setData({
        animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性

      });
    },
    fadeDown: function () {
      var height = this.height;
      console.log(height);
      this.animation.translateY(height + 50).step(); // if (height == 390){
      //   this.animation.translateY(height).step()
      // } else {
      //   // this.animation.translateY(780).step()
      //   this.animation.translateY(this.data.height).step()
      // }

      this.setData({
        animationData: this.animation.export()
      });
    },
    scrollHideModal: function (e) {
      console.log('touch-hideModal');
      this.$emit("hideModal");
    },
    bindscroll: function (e) {
      console.log('bindscroll', e);
      this.$emit("bindScroll");
    }
  }
};
</script>
<style>
@import "./modals.css";
</style>