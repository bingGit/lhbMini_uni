<template>
<view>
<template name="canvas-share-template">
  <view :hidden="sharePicHidden">
    <canvas :style="'position:absolute;width:100%;height:' + contentHeight + 'px'" canvas-id="myCanvas"></canvas>
  </view>
  
  <!-- <image style="position:absolute;width:100%;height:{{contentHeight}}px" hidden='{{canvasPicHidden}}' src='{{canvasPicPath}}'></image> -->
</template>
</view>
</template>

