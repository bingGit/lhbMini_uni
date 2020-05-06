<template>
<web-view :src="url" @message="getMessage"></web-view>
</template>

<script>
import auth from "../../component/easyModal/auth/auth";

export default {
  data() {
    return {
      url: ""
    };
  },

  components: {
    auth
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url = decodeURIComponent(options.url);
    this.setData({
      url: url
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    console.log('web-veiw分享---', options.webViewUrl);
  },
  methods: {
    getMessage: function (e) {
      console.log('接受h5小心--', e);
    }
  }
};
</script>
<style>
@import "./award.css";
</style>