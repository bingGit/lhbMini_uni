<script>
import util from "./utils/util";
const userKey = 'user'; //copy 需修改
//copy 需修改
const userInfoKey = 'userInfo'; //copy 需修改
//app.js

export default {
  onLaunch: function (e) {
    if (util.isLogin()) {
      this.globalData.g_is_login = true;
    } //app跳小程序 || App 分享消息卡片


    if (e.scene == 1069 || e.scene == 1036) {
      this.globalData.g_from_app = true;
    } else {
      this.globalData.g_from_app = false;
    }

    console.log('getLaunchOptionsSync', e);

    if (e.scene == 1006) {
      this.globalData.listen_type = 3;
    } else if (e.scene == 1007) {
      this.globalData.listen_type = 2;
    } else if (e.scene == 1011 || e.scene == 1012 || e.scene == 1048) {
      this.globalData.listen_type = 4;
    } //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    //这个最初我是在组件中获取，但是出现了一个问题，当第一次进入小程序时导航栏会把
    //页面内容盖住一部分,当打开调试重新进入时就没有问题，这个问题弄得我是莫名其妙


    wx.getSystemInfo({
      success: res => {
        console.log('system', res);
        var _bar_height = 64;
        if (res.model.indexOf('samsung') !== -1) {
          _bar_height = 72;
        } else if (res.system.indexOf('Android') !== -1) {
          _bar_height = 68;
        } else if (res.model.indexOf('iPhone X') !== -1 || res.model.indexOf('iPhone XS') !== -1 || res.model.indexOf('iPhone XR') !== -1 || res.model.indexOf('iPhone XS Max') !== -1) {
          _bar_height = 88;
        } else if (res.model.indexOf('iPhone') !== -1) {
          _bar_height = 64;
        }
		this.globalData.g_app = res.app;
        this.globalData.g_bar_height = _bar_height;
        this.globalData.g_status_height = res.statusBarHeight;
        this.globalData.g_win_height = res.windowHeight;
      }
    }); // 这里省略掉了登录和获取用户信息等函数
    // 因为我在别的页面也需要使用此信息，所以没有单独获得 statusBarHeight

    wx.getSystemInfo({
      // 获取设备信息
      success: res => {
        this.globalData.systeminfo = res;
      }
    }); // 获得胶囊按钮位置信息

    // this.globalData.headerBtnPosi = wx.getMenuButtonBoundingClientRect();
    var version = wx.getSystemInfoSync().SDKVersion;
    console.log('version', version); //兼容新版本库
    // this.globalData.g_old_version = true;

    // if (util.compareVersion(version, '2.6.2') < 0) {
    //   this.globalData.g_old_version = true;
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前微信版本过低，可能会影响使用体验，请及时升级到最新版本。',
    //     showCancel: false,
    //     confirmText: '知道了'
    //   });
    // }
  },
  globalData: {
    /**
     * 收集表单标识
     */
    collectFormId: function (formId) {
      if (formId) {
        // 不空
        this.formIdList.push(formId);
      }
    },
    g_audio_ablum_id: 0,
    //集合id
    g_audio_ablum_temid: 0,
    //当前选择id
    g_audio_obj: null,
    g_audio_playing: null,
    g_audio_pause: null,
    g_audio_ablum: 0,
    g_audio_pid: 0,
    //当前播放的父索引值
    g_audio_plen: 0,
    //父音频总长度
    g_audio_idx: 0,
    //当前播放的索引值
    g_audio_bookid: 0,
    g_audio_reqUrl: '',
    //请求详情url
    g_auth_msg: [],
    //权限信息
    g_audio_title: '',
    g_audio_cover: '',
    g_audio_duration: null,
    g_audio_ended: false,
    g_audio_max: 0,
    g_play_type: 0,
    //1音频 2视频
    g_audio_timeStep: '00:00',
    //当前进度时间
    g_audio_seeker: 0,
    //当前进度ms
    g_audio_auth: false,
    //是否已拥有权限
    g_audio_tryListen: false,
    //试听是否结束
    g_audio_player: true,
    //播放器是否隐藏
    g_try_time: 300,
    //试听时长
    g_audio_cover_square: '',
    //封面缩略图
    g_req_data: [],
    g_is_login: false,
    g_is_huawei: false,
    //是否为华为机型,虚拟按键判断
    g_from_app: true,
    //是否来自app
    g_test_id: 0,
    //测试题id
    g_custom_msg: {},
    //客服弹框提示信息
    share: false,
    // 分享默认为false
    g_bar_height: 0,
    //状态栏高度
    g_status_height: 0,
    //信息栏的高度
    g_win_height: 500,
    //可使用窗口宽度
    g_test_type: 10,
    //默认记录雅思测试
    g_test_stime: '',
    //测试题开始时间
    g_test_etime: '',
    //测试题结束时间
    g_has_rank: false,
    //是否有排行榜
    g_share_img: '',
    //分享图
    g_has_index_toggle: false,
    //是否切换了tabbar,用户判断视频封面是否隐藏
    systeminfo: {},
    // 系统信息
    headerBtnPosi: {},
    // 胶囊按钮位置信息
    g_old_version: false,
    //是否是旧版本
    formIdList: [] ,//收集表单数据
	//当前运行环境 alipay 支付宝
	g_app:'weixin'

  },
  onHide: function (e) {
    console.log('app.js onhide', this.globalData.g_audio_pid);
    if (this.globalData.g_req_data.length == 0) return; //保存收听记录

    var _reg = {
      pid: this.globalData.g_audio_pid,
      idx: this.globalData.g_audio_idx,
      time: this.globalData.g_audio_seeker,
      book_id: this.globalData.g_audio_bookid,
      cover: this.globalData.g_req_data[this.globalData.g_audio_pid]['cover_square'],
      tmp_id: this.globalData.g_audio_ablum_temid
    };
    util.saveListenRecord(_reg);
  },
  methods: {}
};
</script>
<style>
@import "./app.css";
</style>