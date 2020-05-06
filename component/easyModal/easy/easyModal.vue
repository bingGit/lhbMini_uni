<template>
<base-modal id="baseModal" :modalSize="modalSize" :animated="animated" :backdrop="backdrop">
    <view slot="header" class="modal-header">
        <text>{{title}}</text>
    </view>

     <view slot="body" class="modal-body">
        <slot></slot>
    </view>
 
    <view slot="footer" class="modal-footer">
         <text @tap.stop="cancelModalFun" class="btn btn-default btn-border">{{cancelText}}</text>
         <!-- <text> -->
         <view>
<button open-type="share" class="share_btn">发给微信好友</button>
         </view>
         <!-- <button open-type="share" class='btn btn-primary share-btns'>{{confirmText}}</button></text> -->
         <!-- <text catchtap='_confirmModal'  class='btn btn-primary'>{{confirmText}}</text>       -->
    </view>
</base-modal>
</template>

<script>
import baseModal from "../base/baseModal";

export default {
  data() {
    return {};
  },

  components: {
    baseModal
  },
  props: {
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
      default: "md"
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
    }
  }
};
</script>
<style>
@import "./easyModal.css";
</style>