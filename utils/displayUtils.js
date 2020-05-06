/**
 * 显示消息提示框
 */
function showsToast(showTitle, showIcon, showDuration) {
  var showsIcon = "none";

  if ("success" == showIcon || "loading" == showIcon) {
    showsIcon = showIcon;
  }

  var showsDuration = 2000;

  if (showDuration != null) {
    showsDuration = showDuration;
  }

  wx.showToast({
    title: showTitle,
    icon: showsIcon,
    duration: showsDuration
  });
}

module.exports = {
  showsToast: showsToast
};