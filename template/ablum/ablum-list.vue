<template>
<view>
<template name="ablum-list">
  <view @tap.stop="goAlbum" :data-url="album['url']" :data-idx="idx" :data-id="album['id']" class="ablum-list-container">

    <view v-if="album['product_type'] != 7010" class="ablum-list-item">
      <image class="ablum-list-img" :src="album['cover']"></image>
    </view>

    <view v-if="album['product_type'] == 7010" class="ablum-view-c">
      <video autoplay="false" :muted="muted" custom-cache="false" class="ablum-video" objectFit="fill" enable-play-gesture="true" id="myVideo" :src="coverHidden ? album['url'] : ''" controls>
        <cover-image @tap.stop="videoPlay" :data-idx="idx" :data-url="album['url']" :data-id="album['id']" :hidden="coverHidden" class="ablum-list-img ablum-video-img" :src="album['cover']"></cover-image>
        <!-- <image wx:if="{{selectId != album['id']}}" class='ablum-list-img ablum-video-img' src="{{album['cover']}}" mode='aspectFill'></image> -->
      </video>
    </view>
  </view>

</template>
</view>
</template>

<style>
@import "./ablum-list.css";
</style>