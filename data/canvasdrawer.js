var canvasdrawer = {
  width: 750,
  height: 1184,
  views: [{
    type: 'image',
    url: "/static/image/icon/zhuli.jpg",
    top: 0,
    left: 0,
    width: 750,
    height: 755
  }, {
    type: 'rect',
    background: '#ffffff',
    top: 27.5,
    left: 0,
    width: 55,
    height: 55
  }, {
    type: 'text',
    content: '',
    fontSize: 16,
    color: '#333333',
    textAlign: 'left',
    top: 33,
    left: 96,
    breakWord: true,
    width: 190,
    bolder: true
  }, {
    type: 'text',
    content: '发现一件好货，邀请你一起0元免费拿！',
    fontSize: 12,
    color: '#666666',
    textAlign: 'left',
    top: 59.5,
    left: 96
  }, {
    type: 'image',
    url: '',
    top: 136,
    left: 42.5,
    width: 290,
    height: 186
  }, {
    type: 'image',
    url: '',
    top: 443,
    left: 85,
    width: 68,
    height: 68,
    borderRadius: false
  } // {
  //   type: 'image',
  //   url: '/image/icon/img_home_banner.jpg',
  //   top: 443,
  //   left: 85,
  //   width: 68,
  //   height: 68
  // },
  // {
  //   type: 'text',
  //   content: '正品MAC魅可口红礼盒生日唇膏小辣椒Chili西柚情人',
  //   fontSize: 16,
  //   lineHeight: 21,
  //   color: '#383549',
  //   textAlign: 'left',
  //   top: 336,
  //   left: 44,
  //   width: 287,
  //   MaxLineNumber: 2,
  //   breakWord: true,
  //   bolder: true
  // },
  // {
  //   type: 'text',
  //   content: '￥0.00',
  //   fontSize: 19,
  //   color: '#E62004',
  //   textAlign: 'left',
  //   top: 387,
  //   left: 44.5,
  //   bolder: true
  // },
  // {
  //   type: 'text',
  //   content: '原价:￥138.00',
  //   fontSize: 13,
  //   color: '#7E7E8B',
  //   textAlign: 'left',
  //   top: 391,
  //   left: 110,
  //   textDecoration: 'line-through'
  // },
  // {
  //   type: 'text',
  //   content: '长按识别图中二维码帮我砍个价呗~',
  //   fontSize: 14,
  //   color: '#383549',
  //   textAlign: 'left',
  //   top: 460,
  //   left: 165.5,
  //   lineHeight: 20,
  //   MaxLineNumber: 2,
  //   breakWord: true,
  //   width: 125
  // }
  ]
};
module.exports = {
  canvasdrawer: canvasdrawer
};