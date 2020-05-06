<template name="ablum-detail">
  <view class="ablum-detail-container">
    <view class="ablum-detail-swiper-title">
      <text class="ablum-detail-swiper-title1">{{albums.length<1 ? upSwiperIndex}}< text>
      <text class="ablum-detail-swiper-title2">{{albums.length<1 ? ' + albums.length}}< text>
    </1></text></1></text></view>
    <swiper class="imageContainer" @change="handleChange" previous-margin="90rpx" next-margin="85rpx" :current="currentIdx" circular indicator-dots="false">
      <block v-for="(ablum, swiper) in albums" :key="swiper">
        <swiper-item class="item">
          <view :class="'ablum-detail-swiper-item  ' + (swiperIndex == index ? 'ablum-detail-swiper-item-active': '')" @tap.stop="goContent" :data-pid="swiperIndex">
            <view :class="'ablum-detail-swiper-item-content ' + (swiperIndex == index ? 'ablum-detail-swiper-item-content-active': '')">

              <view class="ablum-detail-s-i-top">
                <view class="ablum-detail-s-i-top1">{{title}}</view>
                <!-- <image catchlongtap='' class='ablum-detail-s-i-top2' src='https://uimg.gximg.cn/v/res/201905/21-19/dianping@3x.png'></image> -->
              </view>
              <view class="ablum-detail-s-i-title">{{ablum['title']}}</view>
              <view class="ablum-detail-s-i-img">
                <image :class="'itemImg ' + (swiperIndex == index ? 'active': '')" :src="ablum['cover']"></image>
                <image @tap.stop="audioPlay" :data-pid="swiperIndex" class="ablum-detail-s-play-img" :src="'https://uimg.gximg.cn/v/res/201905/22-10/' + (isPlaying && swiperIndex == currentIdx ? 'play_stop@3x.png' : 'play@3x.png')"></image>
                <image class="ablum-detail-s-tagyinpin" src="https://uimg.gximg.cn/v/res/201905/22-10/tag_yinpin@3x.png"></image>
                <!-- <image src='https://uimg.gximg.cn/v/res/201905/22-10/play_stop@3x.png'></image> -->
              </view>
              <view v-if="authMsg.status == 0" class="ablum-detail-s-i-tip">
                <view style="position:relative;">
                  <image class="ablum-detail-s-i-tip-img" src="https://uimg.gximg.cn/v/res/201905/22-11/shitingbg@3x.png">
                  </image>
                  <text>{{authMsg.try_text}}</text>
                </view>
              </view>
            </view>
          </view>
        </swiper-item>
      </block>
    </swiper>
  </view>
</template>