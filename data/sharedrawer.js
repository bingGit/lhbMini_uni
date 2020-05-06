var canvasdrawer = {
  width: 750,
  height: 1184,
  views: [{
    type: 'rect',
    background: '#00BAA2',
    top: 20,
    left: 20,
    width: 55,
    height: 55
  }, {
    type: 'rect',
    background: '#fff',
    top: 20,
    left: 20,
    width: 55,
    height: 55
  }, {
    type: 'image',
    url: "/static/image/icon/img_sharecard_white_logo.png",
    top: 443,
    left: 85,
    width: 68,
    height: 68,
    borderRadius: false
  }, {
    type: 'text',
    content: '',
    fontSize: 14,
    color: '#fff',
    textAlign: 'left',
    top: 33,
    left: 96,
    width: 190,
    bolder: false
  }, {
    type: 'image',
    url: '',
    top: 443,
    left: 85,
    width: 68,
    height: 68,
    borderRadius: false
  }, {
    type: 'text',
    content: '',
    fontSize: 19,
    color: '#666',
    textAlign: 'left',
    top: 33,
    left: 96,
    breakWord: true,
    width: 190
  }, {
    type: 'text',
    content: '',
    fontSize: 19,
    color: '#666',
    textAlign: 'left',
    top: 33,
    left: 96
  }, {
    type: 'text',
    content: '',
    fontSize: 19,
    color: '#666',
    textAlign: 'left',
    top: 33,
    left: 96,
    breakWord: true,
    width: 190
  }, {
    type: 'text',
    content: '',
    fontSize: 19,
    color: '#FFFFFF',
    textAlign: 'left',
    top: 33,
    left: 96
  }, {
    type: 'text',
    content: '',
    fontSize: 19,
    color: '#FFFFFF',
    textAlign: 'left',
    top: 33,
    left: 96
  }, {
    type: 'image',
    url: "/static/image/icon/mini_qr.png",
    top: 460,
    left: 265,
    width: 66,
    height: 68,
    borderRadius: false
  } // {
  //   type: 'image',
  //   url: '/image/icon/mini_qr.png',
  //   top: 600,
  //   left: 100,
  //   width: 30,
  //   height: 30,
  // },
  ]
};
module.exports = {
  canvasdrawer: canvasdrawer
};