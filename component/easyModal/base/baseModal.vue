<template>
<view :animation="animationData" :hidden="!isShow" class="modal">

     <view data-type="mask" @tap.stop="hideModal" class="modal-mask"></view>
  
      <view :class="'modal-layer  modal-layer-radius ' + (modalSize == 'sm' ? ' modal-layer-sm' : (modalSize == 'la' ? ' modal-layer-la' :' modal-layer-md') )">

        <!-- 头部 -->
          <view class="modal-header">        
              <slot name="header"></slot>             
          </view>

          <!-- 内容区域 -->
          <view class="modal-body">         
               <slot name="body"></slot>                          
          </view>

          <view class="modal-footer">
               <slot name="footer"></slot>                     
          </view>
      </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      isShow: false,
      animation: '',
      animationData: ""
    };
  },

  components: {},
  props: {
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
    },
    animationOption: {
      type: Object,
      default: () => ({
        duration: 300
      })
    }
  },
  options: {
    multipleSlots: true
  },
  mounted: function () {
    // console.log(this.data.modalSize,1111);return;
    this.animation = wx.createAnimation({
      duration: this.animationOption.duration,
      timingFunction: "linear",
      delay: 0
    });
  },
  methods: {
    hideModal: function (e) {
      if (e) {
        let type = e.currentTarget.dataset.type;

        if (type == 'mask' && !this.backdrop) {
          return;
        }
      }

      if (this.isShow) this.toggleModalFun();
    },
    showModal: function () {
      if (!this.isShow) {
        this.toggleModalFun();
      }
    },
    toggleModalFun: function () {
      if (!this.animated) {
        this.setData({
          isShow: !this.isShow
        });
      } else {
        let isShow = !this.isShow;
        this.executeAnimationFun(isShow);
      }
    },
    executeAnimationFun: function (isShow) {
      let animation = this.animation;

      if (isShow) {
        animation.opacity(0).step();
        this.setData({
          animationData: animation.export(),
          isShow: true
        });
        setTimeout(function () {
          animation.opacity(1).step();
          this.setData({
            animationData: animation.export()
          });
        }.bind(this), 50);
      } else {
        animation.opacity(0).step();
        this.setData({
          animationData: animation.export()
        });
        setTimeout(function () {
          this.setData({
            isShow: isShow
          });
        }.bind(this), this.animationOption.duration);
      }
    }
  }
};
</script>
<style>
@import "./baseModal.css";
</style>