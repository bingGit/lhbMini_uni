<template name="audio-play-template">
  <view class="music-container">
    <image v-if="isPlayingMusic" @tap.stop="onMusicDetailTap" src="/static/image/icon/btn_detail_pause.png" class="music-img"></image>
    <image v-else @tap.stop="onMusicDetailTap" src="/static/image/icon/btn_detail_play.png" class="music-img"></image>
    <view class="body-view">
      <slider min="0" :max="max" activeColor="#00BAA2" step="2" block-size="11" @change="bindChangeTap" @changing="changeingTap" :value="currentTime"></slider>
      <!-- <view class='audio-loading' hidden='{{isLoadingHidden}}'>
        <text>加载中...</text>
      </view> -->
    </view>
    <text @tap.stop="onTime" class="music-time">{{processNum}}</text>
  </view>
</template>