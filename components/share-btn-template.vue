<template name="share-btn-template">
  <view @tap.stop="hideModal" :style="'height:' + windowHeight + 'rpx;'" v-if="chooseShare" class="maskLayer"></view>
  <view v-if="chooseShare" @tap="hideModal" class="share-container" :animation="animationData">
    <view class="share-item">
      <button open-type="share" class="share_btn">发给微信好友</button>
    </view>
    <view class="share-item" @tap="savePicTap">
      <button open-type="getUserInfo" @getuserinfo="savePicTap" lang="zh_CN" class="share_btn">保存二维码图片</button>
    </view>
    <view class="share-cancel">取消</view>
  </view>
</template>