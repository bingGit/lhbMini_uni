var lineHeight = 20;
var windowWidth;
var windowHeight;
var offset;
var contentHeight;
/***** */

/*****邀请分享图 */

function getInviteImg(qr) {
  var avatarurl_width = 60; //绘制的头像宽度

  var avatarurl_heigth = 60; //绘制的头像高度

  let that = this;
  wx.getSystemInfo({
    success: function (res) {
      windowWidth = res.windowWidth;
      windowHeight = res.windowHeight;
      offset = res.windowWidth * 0.25 / 2;
    }
  });
  let ctx = wx.createCanvasContext('myCanvas');
  let contentHeight = windowHeight;
  ctx.rect(0, 0, windowWidth, contentHeight);
  ctx.setFillStyle("pink");
  ctx.fill();
  ctx.drawImage("/static/image/icon/zhuli.jpg", 0, 0, windowWidth, windowHeight * 0.56); //底部
  //ctx.rect(20, windowHeight-200, windowWidth * 0.7, windowHeight - 440);
  // ctx.setFillStyle('pink')
  // ctx.setFillStyle("pink");  
  // ctx.rect(0, windowHeight*0.55 , windowHeight, 100)
  // ctx.fill()

  ctx.setFillStyle('black');
  ctx.setFontSize(12);
  ctx.fillText('我正在听刘洪波讲单词故事', 30, windowHeight - 230);
  ctx.fillText('帮我点个赞吧', 30, windowHeight - 210);
  ctx.setFontSize(8);
  ctx.setFillStyle('#333');
  ctx.fillText('长按识别二维码为单唱点赞', 30, windowHeight - 190);
  ctx.drawImage("/static/image/think.png", windowWidth * 0.7, windowHeight * 0.56, 80, 80);
  ctx.save(); // // Draw coordinates

  var avatarurl_x = 40; //绘制的头像在画布上的位置

  var avatarurl_y = windowHeight * 0.5; //绘制的头像在画布上的位置
  //ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2)
  //ctx.setFillStyle('#fff')
  //ctx.fill();
  //ctx.clip()

  ctx.drawImage('https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJTRwcfGSQYQ57ZeWI6LxhwpxyJBibvI1WZKkuKZqTqvtBDRLPFYmYNNs1EQFtM2Wz5lHjbz1eiaUhA/132', avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
  ctx.restore();
  ctx.draw();
  return contentHeight;
} //设置文字大小，并填充颜色。


function drawFont(ctx, content, height, size, offset, color) {
  ctx.setFontSize(size);
  ctx.setFillStyle(color);
  ctx.fillText(content, offset, height);
}
/***单词分享图 */


function getData(that, title = '', desc = '', content = '', listenNum = 0, url = '') {
  wx.getSystemInfo({
    success: function (res) {
      windowWidth = res.windowWidth;
      windowHeight = res.windowHeight;
      offset = res.windowWidth * 0.25 / 2;
    }
  });
  let i = 0;
  let lineNum = 1;
  let thinkStr = '';
  let filterList = [];
  let thinkList = [];
  let pattern = new RegExp('<p.*?>(.*?)<\/p>', 'gi');
  let pattenContent = content.match(pattern); // for (let i in pattenContent){
  //   thinkList.push(pattenContent[i].replace(/<[^>]+>/g, ""));
  //   lineNum += 1;
  // }

  for (let i in pattenContent) {
    filterList.push(pattenContent[i].replace(/<[^>]+>/g, ""));
  }

  var fialContent = filterList.join('') + '\n';

  for (let item of fialContent) {
    if (item === '\n') {
      thinkList.push(thinkStr);
      thinkList.push('a');
      i = 0;
      thinkStr = '';
      lineNum += 1;
    } else if (i === 20) {
      thinkList.push(thinkStr);
      i = 1;
      thinkStr = item;
      lineNum += 1;
    } else {
      thinkStr += item;
      i += 1;
    }
  } // thinkList.push(thinkStr);


  createNewImg(lineNum, title, desc, thinkList, listenNum, url);
  return windowHeight - 50;
} //画矩形，也是整块画布的大小，宽度是屏幕宽度，高度根据内容多少来动态设置。


function drawSquare(ctx, height) {
  ctx.rect(0, 0, windowWidth, height);
  ctx.setFillStyle("#00BAA2");
  ctx.fill();
} //画线。


function drawLine(ctx, height) {
  ctx.beginPath();
  ctx.moveTo(offset, height);
  ctx.lineTo(windowWidth - offset, height);
  ctx.stroke('#eee');
  ctx.closePath();
}

function drawWhiteSquare(ctx, height) {
  ctx.rect(20, windowWidth * 0.18, windowWidth * 0.89, height);
  ctx.setFillStyle("#fff");
  ctx.fill();
}

function drawListenFont(ctx, content, height, size) {
  ctx.setFontSize(size);
  ctx.setFillStyle("#999999");
  ctx.fillText(content, windowWidth * 0.72, height);
}

function getImageInfo(url) {
  var cache;
  return new Promise((resolve, reject) => {
    if (cache) {
      resolve(cache);
    } else {
      const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);

      if (objExp.test(url)) {
        wx.getImageInfo({
          src: url,
          complete: res => {
            if (res.errMsg === 'getImageInfo:ok') {
              cache = res.path;
              resolve(res.path);
            } else {}
          }
        });
      } else {
        cache = url;
        resolve(url);
      }
    }
  });
  return cache;
} //根据文字多少动态计算高度，然后依次画出矩形，文字，横线和小程序码。


function createNewImg(lineNum, title, desc, thinkList, listenNum, url) {
  let that = this;
  let ctx = wx.createCanvasContext('myCanvas'); // contentHeight = lineNum * lineHeight + 500;

  contentHeight = windowHeight;
  drawSquare(ctx, windowHeight); //logo

  ctx.drawImage("/static/image/icon/img_sharecard_white_logo.png", 20, windowHeight * 0.02, windowWidth * 0.25, windowHeight * 0.06);
  drawLine(ctx, lineNum * lineHeight + 120); //text

  drawFont(ctx, '英语真经派 学为贵出品', windowHeight * 0.062, 12, windowWidth * 0.6, '#fff'); //白底

  drawWhiteSquare(ctx, windowHeight * 0.66); //banner图

  let imgUrl = 'https' + url.substring(4);
  console.log(imgUrl);
  wx.downloadFile({
    url: "https://uimg.gximg.cn/v/words/liuhongbo/images/201807/3.png",
    success: res => {
      wx.setStorageSync('tmpPath', res.tempFilePath);
      tmpPath = res.tempFilePath;
      console.log(res); //ctx.drawImage(res.tempFilePath, 20, windowHeight * 0.11, windowWidth * 0.89, contentHeight * 0.3);
    }
  });
  var tmpPath = wx.getStorageInfoSync('tmpPath');
  console.log(tmpPath);
  ctx.drawImage(tmpPath, 20, windowHeight * 0.11, windowWidth * 0.89, contentHeight * 0.3);
  let text_word_height = 300; // drawListenFont(ctx, listenNum + '人收听', text_word_height, 12);

  if (title.length > 0) {
    drawFont(ctx, title, text_word_height, 19, offset, '#666666');
    var descHeight = text_word_height + 25;
  } else {
    var descHeight = text_word_height;
  }

  drawFont(ctx, desc, descHeight, 19, offset, '#666666');
  let height = text_word_height + 50;
  ctx.setFontSize(15);

  for (let item of thinkList) {
    if (item !== 'a') {
      drawFont(ctx, item, height, 13, offset, '#666666');
      height += lineHeight;
    }
  }

  let author_height = contentHeight - 90;
  drawFont(ctx, '刘洪波讲单词', author_height, 19, offset - 20, '#fff');
  drawFont(ctx, '每个单词背后都有属于它的故事', author_height + 20, 12, offset - 20, '#fff'); //小程序码

  ctx.drawImage("/static/image/icon/mini_qr.png", windowWidth * 0.77, author_height - 32, 66, 66);
  ctx.draw();
}

module.exports = {
  getData: getData,
  getInviteImg: getInviteImg
};