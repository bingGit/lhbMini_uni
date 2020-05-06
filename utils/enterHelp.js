const util = require("./util.js");

function enterWithDic(dic) {
  console.log(dic.product_type);

  if (dic.appid) {
    wx.navigateToMiniProgram({
      appId: dic.appid,
      envVersion: 'release',

      success(res) {// 打开成功
      }

    });
  } else {
    var url = encodeURIComponent(dic.url);
    console.log('dic', dic);

    switch (dic.product_type) {
      case '2':
        //入门真经
        wx.navigateTo({
          url: '../course/course?url=' + url
        });
        break;

      case '3':
        // 课程详情界面
        wx.navigateTo({
          url: '../courseDetail/courseDetail?url=' + url
        });
        break;

      case '22':
        //会员
        wx.navigateTo({
          url: '../myVip/myVip?url=' + url
        });
        break;

      case '30':
        // 我的订单
        wx.navigateTo({
          url: '../order/myOrder'
        });
        break;

      case '32':
        //绑定手机号
        wx.navigateTo({
          url: '../login/bindingPhone'
        });
        break;

      case '34':
        //更换手机号
        wx.navigateTo({
          url: '../login/changePhone'
        });
        break;

      case '231':
        //直播间
        if (!util.isLogin()) {
          wx.navigateTo({
            url: '../login/login'
          });
        } else {
          wx.navigateTo({
            url: '../livevc/livevc?url=' + url
          });
        }

        break;

      case '239':
        //回放
        if (!util.isLogin()) {
          wx.navigateTo({
            url: '../login/login'
          });
        } else {
          wx.navigateTo({
            url: '../livevc/vodvc?url=' + url
          });
        }

        break;

      case '310':
        // 确认订单界面
        var system = wx.getSystemInfoSync().system;

        if (system.indexOf('iOS') >= 0) {
          wx.showModal({
            title: '前往雅思学为贵APP进行购买',
            content: '基于微信小程序平台运营规范，小程序暂不支持购买，请前往学为贵雅思APP完成购买',
            showCancel: false,
            confirmText: '知道了'
          });
        } else {
          wx.navigateTo({
            url: '../order/order?url=' + url
          });
        }

        break;

      case '9100':
        //我的课程
        wx.navigateTo({
          url: '../myCourse/myCourse?url=' + url
        });
        break;

      case '9998':
        //跳转音频(活动需要,结束可删除)
        wx.navigateTo({
          url: '../audio/audio'
        });
        break;

      case '9999':
        wx.navigateTo({
          url: '../webview/webview?url=' + url
        });
        break;

      default:
        let urls = decodeURIComponent(url);

        if (urls.indexOf('isrank') !== -1) {
          console.log('is test count', urls, getQueryString(urls, 'id'));
          util.updateHot(wx.getStorageSync('userinfo')['uid'] || 0, getQueryString(urls, 'id'), 0, 4);
        }

        wx.navigateTo({
          url: urls
        });
        break;
    }
  }
}

function getQueryString(url, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = url.substr(1).match(reg); //search,查询？后面的参数，并匹配正则

  if (r != null) return unescape(r[2]);
  return null;
}

module.exports = {
  enterWithDic: enterWithDic
};