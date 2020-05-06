const CryptoJS = require("./cryptojs.js");	

const source = 1; //copy 需修改

const listen_type = 0;
const uidKey = 'uid1'; //copy 需修改

const cookieKey = 'cookie'; //copy 需修改

const userKey = 'user'; //copy 需修改

const userInfoKey = 'userInfo'; //copy 需修

const oauthType = 25; //copy 需修改改

const userListenRecord = 'user_listen_record';

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
} // 格式化时间戳


function getTime(timestamp) {
  var time = arguments[0] || 0;
  var t, y, m, d, h, i, s;
  t = time ? new Date(time * 1000) : new Date();
  y = t.getFullYear(); // 年

  m = t.getMonth() + 1; // 月

  d = t.getDate(); // 日

  h = t.getHours(); // 时

  i = t.getMinutes(); // 分

  s = t.getSeconds(); // 秒

  return [y, m, d].map(formatNumber).join('-') + ' ' + [h, i, s].map(formatNumber).join(':');
} //获取月日


function getMonthDate(date) {
  var date = date.split(/[- : \/]/);
  var curDate = new Date();
  var month = curDate.getMonth() + 1;
  var day = curDate.getDate();

  if (parseInt(date[1]) == month && parseInt(date[2]) == day) {
    // return '今天';
    return 1;
  }

  return 0; // return parseInt(date[1]) + '月' + parseInt(date[2]) + '日';
} //格式化播放时间


function formPlayTime(duration) {
  var date = duration.split(/[分秒]/);
  return (date[0] < 10 ? '0' + date[0] : date[0]) + ':' + date[1];
}

function isLogin() {
  var cookie = wx.getStorageSync("cookie");

  if (cookie) {
    return true;
  }

  return false;
} //保存图片


function savePicToAlbum(that, tempFilePath) {
  // let that = this;
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',

          success() {
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,

              success(res) {
                wx.showToast({
                  title: '保存成功'
                });
                that.setData({
                  sharePicHidden: true
                });
              },

              fail(res) {
                that.setData({
                  sharePicHidden: true
                });
                console.log(res);
              }

            });
          },

          fail() {
            // 用户拒绝授权,打开设置页面
            wx.openSetting({
              success: function (data) {
                that.setData({
                  sharePicHidden: true
                });
                console.log("openSetting: success");
              },
              fail: function (data) {
                that.setData({
                  sharePicHidden: true
                });
                console.log("openSetting: fail");
              }
            });
          }

        });
      } else {
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,

          success(res) {
            wx.showToast({
              title: '保存成功'
            });
            that.setData({
              sharePicHidden: true
            });
          },

          fail(res) {
            that.setData({
              sharePicHidden: true
            });
            console.log(res);
          }

        });
      }
    },

    fail(res) {
      console.log(res);
    }

  });
}

function postRequest(netUrl, data, success) {
  netUrl = decodeURIComponent(netUrl);
  var cookie = getCookie();
  wx.request({
    url: netUrl.replace("http:", "https:").replace("v.guixue.com", "v.xueweigui.com").replace("fast.guixue.com", "v.xueweigui.com"),
    data: data,
    header: {
      'content-type': "application/x-www-form-urlencoded",
      cookie: cookie
    },
    method: 'POST',
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      wx.showToast({
        title: res.errMsg,
        icon: 'none'
      });
    }
  });
} //存储已收听过的音频


function saveListentedStorage(audio_id) {
  // var user = app.globalData.userInfo.nickName || '';
  var user = 'bing';
  let userData = wx.getStorageSync(user);
  let lisettedVideo = [];

  if (userData == 0) {
    lisettedVideo.push(audio_id);
    var users = lisettedVideo;
  } else {
    if (userData.indexOf(audio_id) != -1) {
      return;
    }

    userData.push(audio_id);
    var users = userData;
  }

  wx.setStorageSync(user, users);
} //带cookie请求


function getRequest(netUrl, data, success) {
  netUrl = decodeURIComponent(netUrl);
  var cookie = getCookie();

  if (!data) {
    data = {};
  }

  wx.request({
    url: netUrl.replace("http:", "https:").replace("v.guixue.com", "v.xueweigui.com").replace("fast.guixue.com", "v.xueweigui.com"),
    data: data,
    header: {
      cookie: cookie,
      'x-user-agent': '79:1.3.2'
    },
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      wx.showToast({
        title: res.errMsg,
        icon: 'none'
      });
    }
  });
} //log 记录


function backLog(content) {
  const logger = wx.getLogManager({
    level: 1
  });
  logger.debug(content); //发起网络请求

  let userMsg = wx.getStorageSync(userKey);
  wx.request({
    url: 'https://v.guixue.com/Words/errorLog',
    data: {
      uid: userMsg.ID || 1,
      type: 'cet',
      error: content instanceof Object ? JSON.stringify(content) : content
    },
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    success: function (res) {
      let msg = res.data;

      if (msg.e == '9999') {}
    },
    fail: function (e) {
      console.log(e);
    }
  });
} //格式化姓名


function formName(data) {
  let patten = /[#wx_]/;

  for (let i in data) {
    if (patten.test(data[i]['username'])) {
      data[i]['username'] = data[i]['username'].substring(4);
    }
  }

  return data;
} //获取评论id


function getCommentId(id) {
  let openidMsg = wx.getStorageSync(userKey); // return 'lhbjdc_' + openidMsg['openId'] + '_' + id;

  return 'lhbjdc_oESK45bwmxQuhs0kj50Zv1UKrY3U_' + id;
} //获取cookie


function getCookie() {
  var cookieObj = wx.getStorageSync(cookieKey);
  var cookieStr = '';

  for (var key in cookieObj) {
    cookieStr += key + '=' + cookieObj[key] + ';';
  }

  return cookieStr;
} //写评论


function comment() {} //格式化时间 &&解锁


function formCreateTime(data) {
  let lockData = wx.getStorageSync('lockData') || [];
  let lockLen = lockData.length;
  let pattern = new RegExp('<p.*?>(.*?)<\/p>', 'gi');

  for (let i in data) {
    data[i]['outline'] = data[i].outline.replace(/<[^>]+>/g, "");
    data[i]['ctime'] = getMonthDate(data[i].ctime);
  }

  return data;
} //存储openid


function saveUserOpenid() {
  let userMsg = wx.getStorageSync(userKey);

  if (userMsg.length != 0) {
    wx.checkSession({
      success: function () {
        //注册用户
        wx.login({
          success: res => {
            reqCookie(res.code);
          }
        });
        return userMsg;
      },
      fail: function () {
        return reqUserOpenid();
      }
    });
  } else {
    return reqUserOpenid();
  }
} //获取&存储cookie


function reqCookie(code) {
  wx.getUserInfo({
    success: res => {
      //获取cookie & save cookie
      getRequest("https://passport.xueweigui.com/mobile/oauthlogin", {
        type: oauthType,
        code: code,
        encryptedData: res["encryptedData"],
        iv: res['iv']
      }, saveUser);
    },
    fail: error => {
      console.log(error);
    }
  });
}

function saveUser(res) {
  saveCookie(res.header["Set-Cookie"]); //保存用户信息

  saveUserDb(res);
} //保存用户信息入库


function saveUserDb(res) {
  // console.log(res);return;
  var openMsg = wx.getStorageSync(userKey);
  var userInfo = wx.getStorageSync(userInfoKey) || [];
  var avatarUrl = userInfo.avatarUrl;
  var uidData = res.data.r.uid;
  wx.setStorageSync(uidKey, uidData); // 发起网络请求

  wx.request({
    url: 'https://v.xueweigui.com/Words/setUser',
    data: {
      uid: res.data.r.uid,
      openid: openMsg['openId'],
      sessinid: openMsg['sessinId'],
      nick_name: userInfo.nickName,
      avatar_url: userInfo.avatarUrl,
      source: source,
      listen_type: listen_type
    },
    method: 'GET',
    success: function (res) {},
    fail: function (e) {
      console.log(e);
    }
  });
} //获取用户收听操作记录


function getListenRecord() {
  return wx.getStorageSync(userListenRecord) || null;
} //保存用户收听操作记录


function saveListenRecord(reg) {
  wx.setStorageSync(userListenRecord, reg);
} //保存用户文章转发操作记录


function saveArticleRecord() {
  var uid = wx.getStorageSync(uidKey);
  var openMsg = wx.getStorageSync(userKey); // 发起网络请求

  wx.request({
    url: 'https://v.xueweigui.com/Words/setListened',
    data: {
      uid: uid,
      openid: openMsg['openId'],
      article_transmit: 1,
      source: source
    },
    method: 'GET',
    success: function (res) {},
    fail: function (e) {
      console.log(e);
    }
  });
} //保存用户单词列表转发操作记录


function saveWordRecord() {
  var uid = wx.getStorageSync(uidKey);
  var openMsg = wx.getStorageSync(userKey); // 发起网络请求

  wx.request({
    url: 'https://v.xueweigui.com/Words/setListened',
    data: {
      uid: uid,
      openid: openMsg['openId'],
      word_transmit: 1,
      source: source
    },
    method: 'GET',
    success: function (res) {},
    fail: function (e) {
      console.log(e);
    }
  });
} //保存用户单词转发操作记录


function saveZanRecord() {
  var uid = wx.getStorageSync(uidKey);
  var openMsg = wx.getStorageSync(userKey); // 发起网络请求

  wx.request({
    url: 'https://v.xueweigui.com/Words/setListened',
    data: {
      uid: uid,
      openid: openMsg['openId'],
      zan_transmit: 1,
      source: source
    },
    method: 'GET',
    success: function (res) {},
    fail: function (e) {
      console.log(e);
    }
  });
} //记录点赞信息


function saveZanInfo() {
  var uid = wx.getStorageSync(uidKey);
  var openMsg = wx.getStorageSync(userKey); // 发起网络请求

  wx.request({
    url: 'https://v.xueweigui.com/Words/setListened',
    data: {
      uid: uid,
      openid: openMsg['openId'],
      zan_transmit: 1,
      source: source
    },
    method: 'GET',
    success: function (res) {},
    fail: function (e) {
      console.log(e);
    }
  });
} // function saveCookie(cookieStr) {
//   var cookieArr = cookieStr.split(";")
//   var newCookie = {}
//   for (var i = 0; i < cookieArr.length; i++) {
//     var arrStr = cookieArr[i]
//     var arr = arrStr.split("=")
//     if (arr.length == 2) {
//       var firstKey = arr[0]
//       var firstValue = arr[1]
//       //拼接 第一个key
//       if (firstKey.indexOf('path') < 0 && firstKey.indexOf('expires') < 0 && firstKey.indexOf('domain') < 0) {
//         newCookie[firstKey] = firstValue
//       }
//     } else if (arr.length == 3) {
//       var firstKey = arr[0]
//       var valueAndKey = arr[1]
//       var firstValue = valueAndKey.substring(0, valueAndKey.lastIndexOf(','))
//       //拼接 第一个key
//       if (firstKey.indexOf('path') < 0 && firstKey.indexOf('expires') < 0 && firstKey.indexOf('domain') < 0) {
//         newCookie[firstKey] = firstValue
//       }
//       //拼接 第二个key
//       var secondKey = valueAndKey.substring(valueAndKey.lastIndexOf(',') + 1, valueAndKey.length)
//       var secondValue = arr[2]
//       if (secondKey.indexOf('path') < 0 && secondKey.indexOf('expires') < 0 && secondKey.indexOf('domain') < 0) {
//         newCookie[secondKey] = secondValue
//       }
//     }
//   }
//   wx.setStorageSync(cookieKey, newCookie)
// }
//请求openid


function reqUserOpenid() {
  var user = {};
  wx.login({
    success: function (res) {
      if (res.code) {
        // 发起网络请求
        wx.request({
          url: 'https://v.xueweigui.com/Words/getOpenid',
          data: {
            code: res.code,
            type: miniType
          },
          method: 'GET',
          success: function (res) {
            let msg = res.data;

            if (msg.e == '9999') {
              let openId = msg.data.openid; //获取到的openid

              let sessionId = msg.data.session_key; //获取到session_key

              user['openId'] = openId;
              user['sessinId'] = sessionId;
              wx.setStorageSync(userKey, user); //首次登陆为用户注册账号

              wx.login({
                success: res => {
                  reqCookie(res.code);
                }
              });
            }
          }
        });
      } else {
        console.log('登录失败！' + res.errMsg);
      }
    }
  });
} //获取用户解锁ids


function getLockData(that) {
  let userToken = wx.getStorageSync(userKey);

  if (userToken.length != 0) {
    //发起网络请求
    wx.request({
      url: 'https://v.xueweigui.com/Words/getLockData',
      data: {
        key: userToken['openId']
      },
      method: 'GET',
      success: function (res) {
        let msg = res.data;

        if (msg.e == '9999') {
          that.setData({
            unlockData: msg.data
          });
          wx.setStorageSync('lockData', msg.data);
        }
      },
      fail: function (e) {
        console.log(e);
      }
    });
  } else {
    that.setData({
      isLock: false
    });
  }
} //获取带参数二维码


function getAccessQr(that, key) {
  var uid = wx.getStorageSync(uidKey);
  var token = {};
  let userToken = wx.getStorageSync(userKey);

  if (userToken.length != 0) {
    //发起网络请求
    wx.request({
      url: 'https://v.xueweigui.com/Words/getAccessQr',
      data: {
        scene: key,
        uid: uid,
        type: miniType,
        openid: userToken['openId']
      },
      method: 'GET',
      success: function (res) {
        let msg = res.data;

        if (msg.e == '9999') {
          that.setData({
            userQr: msg.data.url
          });
        } else {
          that.setData({
            userQr: ''
          });
        }
      },
      fail: function (e) {
        console.log(e);
      }
    });
  }
} //记录当前用户信息


function saveUserMsg(data) {
  var userInfo = wx.getStorageSync(userInfoKey) || [];
  var avatarUrl = userInfo.avatarUrl; //发起网络请求

  wx.request({
    url: 'https://v.xueweigui.com/Words/saveUserMsg',
    data: {
      key: data,
      info: userInfo.avatarUrl
    },
    method: 'get',
    success: function (res) {
      let msg = res.data;

      if (msg.e != '9999') {}
    }
  });
} //获取被点赞用户信息


function getReqUserMsg(that, data) {
  //发起网络请求
  wx.request({
    url: 'https://v.xueweigui.com/Words/getUserMsg',
    data: {
      key: data
    },
    method: 'get',
    success: function (res) {
      let msg = res.data;

      if (msg.e == '9999') {
        that.setData({
          reqAvatar: msg.data.avatarUrl
        });
      } else {
        console.log(res);
      }
    },
    fail: function (e) {
      console.log(e);
    }
  });
} //获取已点赞好友信息


function getHelpMsg(that, key) {
  //发起网络请求
  wx.request({
    url: 'https://v.xueweigui.com/Words/getHelpMsg',
    data: {
      key: key
    },
    method: 'get',
    success: function (res) {
      let msg = res.data;

      if (msg.e == '9999') {
        that.setData({
          tileAvatar: msg.data
        });
      } else {
        console.log(res);
      }
    },
    fail: function (e) {
      console.log(e);
    }
  });
} //赞


function saveHelpMsg(that, data, uid) {
  var zan_uid = wx.getStorageSync(uidKey);
  var userInfo = wx.getStorageSync(userInfoKey) || [];
  var openMsg = wx.getStorageSync(userKey) || {}; // var op = "Q2Wz5lHjbz1eiaUhY";
  //发起网络请求

  wx.request({
    url: 'https://v.xueweigui.com/Words/saveHelpMsg',
    data: {
      info: userInfo.avatarUrl || '',
      openid: openMsg.openId,
      // openid: op,
      key: data,
      uid: uid,
      zan_uid: zan_uid,
      source: source
    },
    method: 'get',
    success: function (res) {
      let msg = res.data;

      if (msg.e == '9999') {}
    },
    fail: function (e) {
      console.log(e);
    }
  });
} //存储用户信息


function saveWxUserInfo(data) {
  getApp().globalData.userInfo = data;
}

function isZaned(that, open, zanopen) {
  //发起网络请求
  wx.request({
    url: 'https://v.xueweigui.com/Words/isZaned',
    data: {
      openid: zanopen,
      key: open
    },
    method: 'get',
    success: function (res) {
      let msg = res.data;

      if (msg.e == '9999') {} else if (msg.e == '103' || msg.e == '106') {
        that.setData({
          zanOk: false
        });
      }
    },
    fail: function (e) {
      console.log(e);
    }
  });
} //清空点赞人员计数


function clearUnlock() {
  var openMsg = wx.getStorageSync(userKey) || {}; //发起网络请求

  wx.request({
    url: 'https://v.xueweigui.com/Words/clearUnlock',
    data: {
      key: openMsg.openId
    },
    method: 'get',
    success: function (res) {
      console.log(res);
      let msg = res.data;

      if (msg.e == '9999') {}
    },
    fail: function (e) {
      console.log(e);
    }
  });
} //更新收听人数 uid id-父级id  childId子id type 0 音频播放次数+1 1 每天音频播放次数 2完播记录 3记录测试题完测情况


function updateHot(uid, id, childId, type = 0) {
  //发起网络请求
  wx.request({
    url: 'https://v.xueweigui.com/Words/updateHot',
    data: {
      uid: uid,
      child_id: childId,
      id: id,
      type: type
    },
    method: 'get',
    success: function (res) {
      let msg = res.data;

      if (msg.e == '9999') {}
    },
    fail: function (e) {
      console.log(e);
    }
  });
}

function compareVersion(v1, v2) {
  v1 = v1.split('.');
  v2 = v2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }

  while (v2.length < len) {
    v2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
} //更新评论人数


function updateComment(id) {
  //发起网络请求
  wx.request({
    url: 'https://v.xueweigui.com/Words/updateComment',
    data: {
      id: id
    },
    method: 'get',
    success: function (res) {
      let msg = res.data;

      if (msg.e == '9999') {}
    },
    fail: function (e) {
      console.log(e);
    }
  });
} //获取url中的参数


function getQueryString(strs, name) {
  var reg = new RegExp("(^''|&)" + name + "=([^&]*)(&|$)", "i");
  var result = strs.match(reg); // 对querystring匹配目标参数

  console.log(result, strs, name);
  return;

  if (result != null) {
    return result[2];
  } else {
    return null;
  }
} //获取url中的参数


function getQueryVariable(query, variable) {
  var vars = query.substring(query.indexOf("?") + 1).split("&");

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");

    if (pair[0] == variable) {
      return pair[1];
    }
  }

  return false;
} // 同步请求


function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res);
      };

      obj.fail = function (res) {
        reject(res);
      };

      fn(obj);
    });
  };
}

function getUserMsg() {
  var M = wx.getStorageSync('user_msg');
  console.log('user-msg', M);

  if (M) {
    // app.globalData.userInfo = M;
    // console.log('globalData.userInfo', app.globalData.userInfo);
    return M;
  }

  var U = wx.getStorageSync('cookie')['U'];

  if (!U) {
    return false;
  }

  U = decodeURIComponent(U);
  var a = U.split('&');

  if (a.length < 2) {
    return false;
  }

  var info = {};
  var b;

  for (var i = 0; i < a.length; i++) {
    b = a[i].split('=');
    info[b[0]] = decodeURIComponent(b[1]);
  }

  console.log('user-info', info); //存储

  if (JSON.stringify(info) != "{}") {
    wx.setStorageSync('user_msg', info); // app.globalData.userInfo = info;
    // console.log('globalData.userInfo2', app.globalData.userInfo);

    return info;
  }

  return false;
} //格式化播放进度,单位秒


function formLoadTime(time) {
  var load = 0;
  let m = parseInt(time / 60);
  m = m < 10 ? '0' + m : m;
  let i = parseInt(time % 60);
  i = i >= 10 ? i : '0' + i; // let h = parseInt(time / 3600);
  // h = h > 10  ? h : '0' + h;
  //return m > 0 ? h + ':' +  m + ':' + i : '00:00:' + i;

  return m > 0 ? m + ':' + i : '00:' + i;
} //格式化播放进度,单位毫秒


function formLoadMTime(time) {
  var load = 0;
  let m = parseInt(time / 60000);
  m = m < 10 ? '0' + m : m;
  let i_t = parseInt(time % 60000);
  let i = (Array(2).join(0) + i_t).slice(1, 3); // let i = Math.floor(i_t * 100) / 100;

  i = i >= 10 ? i : '0' + i; // let h = parseInt(time / 3600);
  // h = h > 10  ? h : '0' + h;
  //return m > 0 ? h + ':' +  m + ':' + i : '00:00:' + i;

  return m > 0 ? m + ':' + i : '00:' + i;
} //secret 加解密 string 要加密/解密的字符串  code 秘钥字符串 operation 默认true表示解密，传入false表示解密 iv:与后端协商好的固定值


function secret(string, ivs = '', operation = true) {
  // let code = CryptoJS.MD5(ivs).toString();
  var iv = CryptoJS.enc.Utf8.parse(ivs);
  var key = CryptoJS.enc.Utf8.parse('t+gWB+-8a_^)=)@)W8+G=xgf7LmGnc7g');

  if (operation) {
    return CryptoJS.AES.decrypt(string, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }

  return CryptoJS.AES.encrypt(string, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
}

function saveCookie(cookieStr) {
  var cookieArr = cookieStr.split(";");
  var newCookie = {};

  for (var i = 0; i < cookieArr.length; i++) {
    var arrStr = cookieArr[i];
    var arr = arrStr.split("=");

    if (arr.length == 2) {
      var firstKey = arr[0];
      var firstValue = arr[1]; //拼接 第一个key

      if (firstKey.indexOf('path') < 0 && firstKey.indexOf('expires') < 0 && firstKey.indexOf('domain') < 0) {
        newCookie[firstKey] = firstValue;
      }
    } else if (arr.length == 3) {
      var firstKey = arr[0];
      var valueAndKey = arr[1];
      var firstValue = valueAndKey.substring(0, valueAndKey.lastIndexOf(',')); //拼接 第一个key

      if (firstKey.indexOf('path') < 0 && firstKey.indexOf('expires') < 0 && firstKey.indexOf('domain') < 0) {
        newCookie[firstKey] = firstValue;
      } //拼接 第二个key


      var secondKey = valueAndKey.substring(valueAndKey.lastIndexOf(',') + 1, valueAndKey.length);
      var secondValue = arr[2];

      if (secondKey.indexOf('path') < 0 && secondKey.indexOf('expires') < 0 && secondKey.indexOf('domain') < 0) {
        newCookie[secondKey.replace(/^\s*|\s*$/g, "")] = secondValue;
      }
    }
  }

  var openid = wx.getStorageSync('openid');
  newCookie['openid'] = openid;
  console.log(newCookie);
  wx.setStorageSync('cookie', newCookie);
}
/**
 * 防止重复点击
 * fn 原函数
 * gapTime 间隔时间
 */


function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500;
  }

  let _lastTime = null; // 返回新的函数

  return function () {
    let _nowTime = +new Date();

    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      console.log('2343243', gapTime, _nowTime, _lastTime, _nowTime - _lastTime);
      fn.apply(this, arguments); //将this和参数传给原函数

      _lastTime = _nowTime;
    }
  };
}

function debounce(fn, delay) {
  // 持久化一个定时器 timer
  let timer = null; // 闭包函数可以访问 timer

  return function () {
    // 通过 'this' 和 'arguments'
    // 获得函数的作用域和参数
    let context = this;
    let args = arguments; // 如果事件被触发，清除 timer 并重新开始计时

    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
/**
 * 支付
 */


function payAction(url, fn = function () {}) {
  console.log('payActin', url);
  getRequest(url, null, function (netData1) {
    console.log('netData1', netData1);

    if ("9999" == netData1.data.e) {
      // 网络请求成功
      getRequest(netData1.data.buyurl + '&channel=' + 48, null, function (netData2) {
        console.log('netData2', netData2);

        if ("9999" == netData2.data.e) {
          // 网络请求成功
          getRequest(netData2.data.r.payurl + '&channel=' + 48, null, function (netData3) {
            console.log('netData3', netData3);

            if (netData3.data && netData3.data.payment && netData3.data.payment.sdk && netData3.data.payment.sdk.length > 0) {
              getRequest(netData3.data.payment.sdk[0].url, null, function (netData4) {
                console.log('netData4', netData4);

                if (200 == netData4.statusCode) {
                  wx.requestPayment({
                    timeStamp: netData4.data.timeStamp,
                    nonceStr: netData4.data.nonceStr,
                    package: netData4.data.package,
                    signType: netData4.data.signType,
                    paySign: netData4.data.paySign,
                    success: function (res) {
                      // 支付成功
                      wx.navigateTo({
                        url: '/pages/deal/deal?orderId=' + netData3.data.payment.order_id
                      });
                      fn();
                    },
                    fail: function (res) {
                      // 支付失败
                      setTimeout(function () {
                        wx.showToast({
                          title: '支付失败',
                          icon: 'none',
                          duration: 2000
                        });
                      }, 500);
                    }
                  });
                }
              });
            } else if (netData3.data.payment.confirm_url) {
              getRequest(this.data.payDetail.payment.confirm_url, null, function (netData5) {
                console.log('netData', netData5);
                wx.navigateTo({
                  url: '/pages/deal/deal?orderId=' + netData3.data.payment.order_id
                });
                fn();
              });
            }
          });
        } else {
          setTimeout(function () {
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 2000
            });
          }, 500);
        }
      });
    }
  });
}

module.exports = {
  formatTime: formatTime,
  getMonthDate: getMonthDate,
  formCreateTime: formCreateTime,
  savePicToAlbum: savePicToAlbum,
  getTime: getTime,
  saveUserOpenid: saveUserOpenid,
  saveWxUserInfo: saveWxUserInfo,
  saveHelpMsg: saveHelpMsg,
  isZaned: isZaned,
  getReqUserMsg: getReqUserMsg,
  getLockData: getLockData,
  getAccessQr: getAccessQr,
  saveUserMsg: saveUserMsg,
  getHelpMsg: getHelpMsg,
  wxPromisify: wxPromisify,
  updateHot: updateHot,
  clearUnlock: clearUnlock,
  formPlayTime: formPlayTime,
  getRequest: getRequest,
  formName: formName,
  getCommentId: getCommentId,
  updateComment: updateComment,
  saveListentedStorage: saveListentedStorage,
  saveListenRecord: saveListenRecord,
  getListenRecord: getListenRecord,
  saveArticleRecord: saveArticleRecord,
  saveWordRecord: saveWordRecord,
  saveZanRecord: saveZanRecord,
  getQueryVariable: getQueryVariable,
  getQueryString: getQueryString,
  formLoadTime: formLoadTime,
  formLoadMTime: formLoadMTime,
  backLog: backLog,
  isLogin: isLogin,
  getUserMsg: getUserMsg,
  saveCookie: saveCookie,
  postRequest: postRequest,
  compareVersion,
  secret: secret,
  throttle,
  debounce,
  payAction,
  AJAX: function (url, data = {}, fn, method = "get", header = {}) {
    wx.request({
      url: url,
      method: method ? method : 'get',
      data: data,
      header: header ? header : {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.e == '9999') {
          fn(res.data.data);
        } else {
          fn({});
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  }
};