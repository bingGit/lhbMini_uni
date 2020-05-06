<template>
<view>
<template name="comment-template">
  <view class="comment-container">
    <view class="comment-head">
      <text class="comment-head-title">精选留言</text>
      <text class="comment-head-no">({{commentNum}})</text>
      <image @tap.stop="commentTap" class="comment-head-write" src="/static/image/icon/btn_record.png"></image>
    </view>
    <block v-for="(comment, idx) in commentList" :key="idx">
      <view class="comment-body" :style="commentNum == idx+1 ? 'border-bottom:none;' : ''">
        <view class="comment-body-head">
          <image :src="comment['avatar']" class="comment-avatar"></image>
          <text class="comment-name">{{comment['username']}}</text>
          <text class="comment-date">{{comment['ctime']}}</text>
        </view>
        <view class="comment-content">
          <text>{{comment['content']}}</text>
        </view>
      </view>
    </block>
    <!-- <view hidden='{{nomoreHidden}}' class='no-more'>
      <text>没有更多了</text>
    </view> -->
  </view>
</template>
</view>
</template>

<style>
@import "./comment-template.css";
</style>