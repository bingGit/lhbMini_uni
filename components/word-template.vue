<template name="word-template">
  <view v-if="word['is_lock'] == 1" :class="'word-container ' + (idx==wordLen &&!noWordsShow ?' word-bottom-margin':'')" :style="isList && idx==wordLen ? ' border-bottom:0rpx;' :''">
    <view class="word-head-foot">
      <view class="word-header">
        <text class="word-no">{{idx +1}}.</text>
        <!-- <text class='word-letter'>{{word['word']}}</text> -->
        <text class="word-title">{{word['title']}}</text>
      </view>
      <!-- <view class='word-outline'> -->
      <text class="outline-text">{{word['outline']}}</text>
      <!-- </view> -->
      <view class="word-footer">
        <!-- <text class='word-date' style="{{word['ctime'] =='今日'?'background-color: #00BAA2;border-radius: 100rpx;color: #fff;padding-right: 12rpx;':''}}">{{word['ctime']}}</text> -->
        <image class="word-today" :hidden="word['ctime'] == 1 ? false :true" src="/static/image/icon/img_status_today.png"></image>
        <text class="word-hot">{{word['hot']}}人已收听</text>
        <text class="word-hot">{{word['comment_num']}}条评论</text>
        <text class="word-time">{{word['duration']}}</text>
      </view>
    </view>

    <image v-if="isPlayingMusic && currentId==word['id']" @tap.stop="onMusicTap" :data-musicUrl="idx" :data-musicId="idx" class="word-icon" src="/static/image/icon/img_list_pause.png"></image>
    <image v-else @tap.stop="onMusicTap" :data-musicUrl="idx" :data-musicId="idx" class="word-icon" src="/static/image/icon/img_list_play.png"></image>
  </view>

  <view v-else-if="isRelation" class="word-container" @tap.stop :data-id="word['id']" :data-idx="idx">
    <view class="word-head-foot">
      <view class="word-header">
        <text class="word-no-lock">{{idx + 1}}.</text>
        <text class="word-title-lock">{{word['title']}}</text>
      </view>
      <text class="outline-text-lock">{{word['outline']}}</text>
      <view class="word-footer">
      <image class="word-today" :hidden="word['ctime'] == 1 ? false :true" src="/static/image/icon/img_status_today.png"></image>
        <text class="word-hot">{{word['hot']}}人已收听</text>
        <text class="word-time">{{word['duration']}}</text>
      </view>
    </view>
  </view>

  <view v-else :class="'word-container  ' + ( idx==noWordLen ? ' word-bottom-margin' :'')" @tap.stop :data-id="word['id']" :data-idx="idx">
    <view class="word-head-foot">
      <view class="word-header">
        <text class="word-no-lock">{{idx + wordLen + 2}}.</text>
        <text class="word-title-lock">{{word['title']}}</text>
      </view>
      <text class="outline-text-lock">{{word['outline']}}</text>
      <view class="word-footer">
      <image class="word-today" :hidden="word['ctime'] == 1 ? false :true" src="/static/image/icon/img_status_today.png"></image>
        <text class="word-hot">{{word['hot']}}人已收听</text>
         <text class="word-hot">{{word['comment_num']}}条评论</text>
        <text class="word-time">{{word['duration']}}</text>
      </view>
    </view>
  </view>
</template>