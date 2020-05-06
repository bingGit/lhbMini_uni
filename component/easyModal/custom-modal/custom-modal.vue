<template>
<view>
<base-modal id="baseModal" :modalSize="modalSize" :animated="animated" :backdrop="backdrop">
  <!-- <view slot="header" class='modal-header'>
    <text>{{title}}</text>
  </view> -->

  <view slot="body" class="modal-body">
    <slot></slot>
  </view>

  <view slot="footer" class="modal-footer" @tap="share">
    <!-- <text catchtap='_cancelModal' class='btn btn-default btn-border'>{{cancelText}}</text> -->
    <button class="modal-footer-button" open-type="contact" :send-message-title="cfg.title" :send-message-img="cfg.img" show-message-card="true" :send-message-path="cfg.path" @tap.stop="shareFun">
      <text class="btn-contact-text">{{confirmText}}</text>
    </button>
    <!-- <text catchtap='_share' class='btn btn-primary'>{{confirmText}}</text>    -->
  </view>
  <view style="position:absolutez-index:101">
    <canvas style="position:absolutewidth:100%height:540px" canvas-id="myCanvas"></canvas>
  </view>
</base-modal>
</view>
</template>

<script>
var shareUtil = require("../../../utils/canvas-share"); // common/component/customModal.js
import baseModal from "../base/baseModal";

export default {
  data() {
    return {};
  },

  components: {
    baseModal
  },
  props: {
    cfg: {
      type: Object,
      default: () => ({
        content: '',
        title: '',
        img: '',
        path: 'pages/audio/audio?scene=xly_group_buy'
      })
    },
    title: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
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
      default: "la"
    }
  },
  mounted: function () {
    //获得baseModal节点
    if (!this.selectComponent) {
      throw new Error("小程序sdk暂不支持节点操作selectComponent");
    }

    this.baseModal = this.selectComponent('#baseModal');
  },
  methods: {
    show: function () {
      this.baseModal.showModal();
    },
    hide: function () {
      this.baseModal.hideModal();
    },
    //cancel
    cancelModalFun: function () {
      this.hide();
      this.$emit("cancelEvent");
    },
    //success
    confirmModalFun: function () {
      this.$emit("confirmEvent");
    },
    shareFun: function () {
      this.hide();
      this.$emit("invitShareEvent"); // shareUtil.proInvitPic();      
      // wx.previewImage({
      //   urls: ["https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJTRwcfGSQYQ57ZeWI6LxhwpxyJBibvI1WZKkuKZqTqvtBDRLPFYmYNNs1EQFtM2Wz5lHjbz1eiaUhA/132"]
      // })
    }
  }
};
</script>
<style>
@import "./custom-modal.css";
</style>