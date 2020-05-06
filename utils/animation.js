//分享动画
function shareAnimation(that) {
  var height = 0;
  wx.getSystemInfo({
    success: function (e) {
      // height = e.windowHeight;
      height = e.screenHeight + 999;
    }
  }); // var that = this;
  // 创建一个动画实例

  var animation = wx.createAnimation({
    // 动画持续时间
    duration: 500,
    // 定义动画效果，当前是匀速
    timingFunction: 'linear'
  }); // 将该变量赋值给当前动画

  that.animation = animation; // 先在y轴偏移，然后用step()完成一个动画

  animation.translateY(height).step(); // 用setData改变当前动画

  that.setData({
    // 通过export()方法导出数据
    animationData: animation.export(),
    // 改变view里面的Wx：if
    chooseShare: true,
    windowHeight: height
  }); // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动

  setTimeout(function () {
    animation.translateY(0).step();
    that.setData({
      animationData: animation.export()
    });
  }, 200);
} //模态框隐藏


function hideModal(that) {
  var height = 0;
  wx.getSystemInfo({
    success: function (e) {
      height = e.windowHeight;
    }
  }); // var that = this;

  var animation = wx.createAnimation({
    duration: 1000,
    timingFunction: 'linear'
  });
  that.animation = animation;
  animation.translateY(height).step();
  that.setData({
    animationData: animation.export()
  });
  animation.translateY(0).step();
  that.setData({
    animationData: animation.export(),
    chooseShare: false
  });
}

module.exports = {
  shareAnimation: shareAnimation,
  hideModal: hideModal
};