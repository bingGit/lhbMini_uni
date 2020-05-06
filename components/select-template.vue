<template name="select-template">
  <view class="select_container" :hidden="selectHidden" @tap="selectTap">
    <text :class="'select_one ' + (currentSelect == 1? 'select-active': '')" style="border-bottom:1rpx solid #BBBBBB;" data-selectno="1">全部</text>
    <text :class="'select_one ' + (currentSelect == 2? 'select-active': '')" style="border-bottom:1rpx solid #BBBBBB;" data-selectno="2">已听</text>
    <text :class="'select_one ' + (currentSelect == 3? 'select-active': '')" style="border-bottom:0;" data-selectno="3">未听</text>
  </view>
</template>