<template>
<view>
<template name="player-button">
  <view class="play-bttuon-view" :style="isHuawei ? 'height:120rpx;' : ''">
    <view :hidden="playerCloseHidden" @tap.stop="closePlayer" class="play-button-close">
      <image src="https://uimg.gximg.cn/v/res/201905/22-16/fdclose@3x.png"></image>
    </view>
    <view class="play-button-cover" @tap.stop="goContent" :data-pid="currentIdx">
      <image :src="albums[currentIdx]['cover_square']"></image>
    </view>
    <view class="play-button-content" @tap.stop="goContent" :data-pid="currentIdx">
      <view v-if="!tryListen">
        <view class="play-button-content1">{{audioTitle}}</view>
        <view class="play-button-content2">{{timeStep}}{{timeTotal}}</view>
      </view>
      <view v-else>
        <view @tap.stop="goCustom" class="play-button-content3">{{authMsg.try_end_text}}</view>
      </view>
    </view>

    <view class="play-button-contro">
      <block v-if="!tryListen">
        <view @tap.stop="preAudio" class="play-button-prev">
          <image src="https://uimg.gximg.cn/v/res/201905/22-16/fdplay_previous@3x.png"></image>
        </view>
        <view @tap.stop="audioPlayer" :data-pid="currentIdx" class="play-button-play">
          <image v-if="isPlaying" src="https://uimg.gximg.cn/v/res/201905/23-15/fdpause@3x.png"></image>
          <image v-else src="https://uimg.gximg.cn/v/res/201905/22-16/fdplay@3x.png"></image>
        </view>
        <view @tap.stop="nextAudio" class="play-button-next">
          <image src="https://uimg.gximg.cn/v/res/201905/22-16/fdplay_next@3x.png"></image>
        </view>
      </block>
      <block v-else class="play-button-buy-view">
        <view v-if="bookid == 70" class="play-button-buy">
          <navigator target="miniProgram" open-type="navigate" app-id="wx4d08202062ac8130" path="/pages/service-card/service-card?id=100010" version="release">{{authMsg.btn_text}}</navigator>
        </view>
        <text v-else @tap.stop="goCustom" class="play-button-buy">{{authMsg.btn_text}}</text>
      </block>
    </view>
  </view>
</template>
</view>
</template>

<style>
@import "./player-button.css";
</style>