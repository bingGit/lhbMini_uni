<template>
	<view>
		<nav-bar v-if="!navBarHidden" :navbar-data="nvabarData"></nav-bar>
		<view class="container">
			<!-- 视频区块 -->
			<view v-if="video['product_type'] == 7010" @tap.stop="goAlbum" :data-url="video['url']" :data-id="video['id']"
			 :data-ablum="video" class="">
				<view class="ablum-view-c">
					<block v-if="coverHidden">
						<video autoplay="false" custom-cache="false" class="ablum-video" objectFit="fill" enable-play-gesture="true" id="myVideo"
						 :src="coverHidden ? video['url'] : ''" controls>
						</video>
					</block>
					<block v-else>
						<cover-image @click="videoPlay" :data-idx="idx" :data-url="video['url']" :data-id="video['id']" :hidden="coverHidden"
						 class="ablum-list-img ablum-video-img" :src="video['cover']"></cover-image>
					</block>
				</view>
			</view>

			<!-- 广告区块 -->
			<view v-if="ad['product_type'] == 7036" @tap.stop="goAlbum" :data-url="ad['url']" :data-id="ad['id']" :data-ablum="ad"
			 class="">
				<view class="ablum-list-ad-item">
					<image class="ablum-list-ad-img" :src="ad['cover']"></image>
				</view>
			</view>

			<!-- 列表区块 -->
			<block v-for="(album, idx) in albums" :key="idx">
				<block data-type="template" data-is="ablum-list" data-attr="album:album,idx:idx,selectId:selectId,muted:muted,coverHidden:coverHidden">
					<view v-if="(['7032','7038'].includes(album['product_type']))" @tap.stop="goAlbum" :data-url="album['url']"
					 :data-idx="idx" :data-id="album['id']" :data-ablum="album" class="ablum-list-cover-v11">

						<view v-if="album['product_type'] == 7032" :class="idx % 2 == 0 ? 'ablum-list-cover-view2' : 'ablum-list-cover-v1'">
							<image class="ablum-list-cover-img" :src="album['square']"></image>
						</view>

						<view v-else-if="album['product_type'] == 7038" :class="idx % 2 == 0 ?  'ablum-list-cover-view2' : 'ablum-list-cover-view1'">
							<view class="ablum-list-waiting">
								<text class="ablum-list-waiting-title">{{album['title']}}</text>
								<text class="ablum-list-waiting-cont">{{album['content']}}</text>
								<text class="ablum-list-waiting-cont-bg"></text>
							</view>
						</view>
					</view>
				</block>
			</block>
			<!-- </scroll-view> -->

			<!-- 悬浮窗 -->
			<!-- <movable-view catchtap='goDetail' hidden='{{playFloatHidden}}' class="play-float{{playFloating ? ' xuanzhun' : ''}}" x="{{280}}" y="{{450}}" direction="all"> -->
			<view @tap.stop="goDetail" :hidden="playFloatHidden" :class="'play-float' + (playFloating ? ' xuanzhun' : '')">
				<image :src="playFloatCover"></image>
			</view>
			<!-- </movable-view> -->

		</view>
		<!-- </movable-area> -->
	</view>
</template>

<script>
	var util = require("../../utils/util");
	const app = getApp().globalData;
	var listUrl = 'https://v.guixue.com/ApiWordCourse/list';
	var unitUrl = "https://v.xueweigui.com/ApiWordCourse/unitList?book_id=";
	import auth from "../../component/easyModal/auth/auth";
	import navBar from "../../component/nav-bar/nav-bar";

	export default {
		data() {
			return {
				albums: [],
				ad: [],
				video: [],
				channel: 0,
				is_oauth: true,
				win_height: getApp().globalData.g_win_height,
				coverHidden: false,
				playFloatHidden: true,
				playFloating: false,
				playFloatCover: '',
				muted: false,
				//是否静音播放
				oauth_cfg: {
					oauthTipName: '为了更好的体验\n需要您的授权\n(• ̀ω•́ )✧',
					oauthButtonName: '好的'
				},
				nvabarData: {
					showCapsule: 0,
					// 是否显示左上角胶囊按钮 1 显示 0 不显示
					title: '刘洪波讲单词'
				},
				selectId: "",
				videoPlaying: false,
				coverPlay: false,
				navBarHidden: true //自定义菜单是否隐藏
			};
		},

		components: {
			auth,
			navBar
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			console.log('ablumv1-onload', options);
			wx.showLoading({
				title: '加载中...'
			});
			wx.getSystemInfo({
				success: function(res) {
					getApp().globalData.g_is_huawei = res.model.indexOf('HUAWEI') != -1 ? true : false;
				}
			}); //判断是播放视频or 音频

			if (!getApp().globalData.g_audio_obj) {
				console.log('ablum-create-background-manager')
				getApp().globalData.g_audio_obj = wx.getBackgroundAudioManager();
			}
			//检查监听上报来源数据
			if (options.channel) {
				this.setData({
					channel: options.channel
				});
				console.log('onload-options')
			}
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			console.log('onReady');
			this.oauthModal = this.selectComponent("#auth");
			this.videoContext = wx.createVideoContext('myVideo');
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let that = this;
			this.videoContext = wx.createVideoContext('myVideo');

			this.videoContext.bindplay = () => {
				that.setData({
					videoPlaying: true
				});
			};

			wx.hideLoading();
			this.dataLoad();

			if (getApp().globalData.g_has_index_toggle) {
				this.setData({
					coverHidden: false,
					muted: true
				});
				this.videoContext.stop();
			}

			var playRecord = util.getListenRecord();

			if (playRecord || getApp().globalData.g_audio_playing != null) {
				this.setData({
					playFloatHidden: false,
					playFloatCover: getApp().globalData.g_audio_cover_square.length > 0 ? getApp().globalData.g_audio_cover_square :
						playRecord.cover
				});

				if (getApp().globalData.g_audio_playing) {
					this.setData({
						playFloating: true
					});
				} else {
					this.setData({
						playFloating: false
					});
				}
			}
			//自定义菜单隐藏判断
			if (getApp().globalData.g_app == 'alipay') {
				this.setData({
					navBarHidden: true
				})
			}
			//为了防止切换页面后  onTimeUpdate失效
			getApp().globalData.g_audio_obj.onTimeUpdate((res) => {
				// console.log('backgroundAudioManager onTimeUpdate onTimeUpdate ')
			});
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			this.videoContext.pause();
			this.videoContext.stop();
			this.setData({
				videoPlaying: false,
				coverHidden: false,
				muted: true
			});
			console.log('onHide');
		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			this.setData({
				videoPlaying: false
			});
			this.videoContext.stop();
			console.log('on unload');
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			return {
				title: '刘洪波讲单词',
				path: '/pages/ablum/ablum'
			};
		},
		methods: {
			dataLoad: function() {
				var that = this;
				let _listUrl = listUrl + '?channel=' + this.channel;
				util.getRequest(_listUrl, {}, function(res) {
					if (res.data.e != '9999') {
						wx.showToast({
							title: '网络繁忙,稍后重试',
							icon: 'none'
						});
					} else {
						that.setData({
							albums: res.data.data,
							ad: res.data.ad,
							video: res.data.video
						});
					} //console.log(that.data.albums);

				});
			},
			//当前点击ablum事件
			clickAblum: function(event) {
				let id = event.currentTarget.dataset.id;
				this.setData({
					selectId: id
				});
			},
			//授权失败 
			oauthFailEvent: function() {
				console.log('未授权');
			},
			//绑定成功
			bindOkEvent: function() {
				console.log('绑定成功');
			},
			onResize: function(res) {
				console.log('屏幕方向旋转', res);
			},
			goAlbum: function(event) {
				//已授权且登录
				console.log('app.globalData.g_is_login', getApp().globalData.g_is_login);

				if (!util.isLogin()) {
					wx.switchTab({
						url: '/pages/my/my'
					});
					return;
				}

				let url = encodeURIComponent(event.currentTarget.dataset.url);
				let id = event.currentTarget.dataset.id;
				let idx = event.currentTarget.dataset.idx;
				const ablum = event.currentTarget.dataset.ablum;
				if (ablum.product_type == '7036') {
					wx.navigateTo({
						url: '/pages/webview/award?url=' + encodeURIComponent(ablum.url)
					})
					return;
				}
				if (url.length == 0) {
					my.showToast({
						content: '尽情期待',
						type: "none",
						duration:1000
					});
					return;
				}

				if (ablum.product_type != '7010') {
					this.setData({
						coverHidden: false
					});
					this.videoContext.pause();
				}

				if (ablum.product_type == '7010') {
					return;
				}

				getApp().globalData.g_audio_ablum_temid = idx;
				wx.navigateTo({
					url: '/pages/ablum/ablum-detail?url=' + url + '&id=' + id
				});
			},
			//播放视频触发
			videoPlay: function(event) {
				if (!getApp().globalData.g_is_login) {
					return;
				}
				var that = this;
				this.setData({
					coverHidden: true,
					videoPlaying: true,
					muted: false,
					coverPlay: true //观看试播放

				});
				setTimeout(function() {
					that.videoContext.play();
				}, 1000);
				getApp().globalData.g_has_index_toggle = false;

				if (getApp().globalData.g_audio_playing) {
					this.setData({
						playFloating: false
					});
					getApp().globalData.g_audio_obj.pause();
				}

				setTimeout(function() {
					that.videoContext.play();
				}, 1000);
				console.log('play video');
			},
			//暂停视频触发
			videoPause: function(e) {
				console.log('暂停视频触发', e);
				this.setData({
					videoPlaying: false
				}); // this.videoContext.pause();
			},
			//判断横竖屏
			screenResize: function() {
				var lastState,
					nowState = 0;
				let lastTime = Date.now();
				//wx.startAccelerometer();
				wx.onAccelerometerChange(res => {
					const now = Date.now(); // 500ms检测一次

					if (now - lastTime < 500) {
						return;
					}

					lastTime = now;
					let nowState; // 57.3 = 180 / Math.PI

					const Roll = Math.atan2(-res.x, Math.sqrt(res.y * res.y + res.z * res.z)) * 57.3;
					const Pitch = Math.atan2(res.y, res.z) * 57.3; // 横屏状态

					if (Roll > 50) {
						if (Pitch > -180 && Pitch < -60 || Pitch > 130) {
							nowState = 1;
						} else {
							nowState = lastState;
						}
					} else if (Roll > 0 && Roll < 30 || Roll < 0 && Roll > -30) {
						let absPitch = Math.abs(Pitch); // 如果手机平躺，保持原状态不变，40容错率

						if (absPitch > 140 || absPitch < 40) {
							nowState = lastState;
						} else if (Pitch < 0) {
							/*收集竖向正立的情况*/
							nowState = 0;
						} else {
							nowState = lastState;
						}
					} else {
						nowState = lastState;
					} // 状态变化时，触发


					if (nowState !== lastState) {
						lastState = nowState;

						if (nowState === 1) {
							this.videoPlaying ? this.videoContext.requestFullScreen() : null;
							console.log('change:横屏');
						} else {
							this.videoContext.exitFullScreen();
							console.log('change:竖屏');
						}
					}
				});
			},
			//直接跳详情请求数据
			reqBookData: function() {
				var that = this; //console.log(util.getListenRecord().book_id, util.getListenRecord());

				let url = unitUrl + util.getListenRecord().book_id;
				getApp().globalData.g_audio_pid = util.getListenRecord().pid;
				getApp().globalData.g_audio_idx = util.getListenRecord().idx;
				getApp().globalData.g_audio_seeker = util.getListenRecord().time;
				getApp().globalData.g_audio_bookid = util.getListenRecord().book_id;
				util.getRequest(url, {}, function(res) {
					if (res.data.e != '9999') {
						wx.showToast({
							title: '网络繁忙,稍后重试',
							icon: 'none'
						});
					} else {
						res.data.data.map(reg => reg.audio = JSON.parse(util.secret(reg.media, reg.media_iv)));
						getApp().globalData.g_auth_msg = res.data.auth;
						getApp().globalData.g_audio_auth = res.data.auth.status == 0 ? false : true;
						getApp().globalData.g_try_time = res.data.auth.try_time;
						getApp().globalData.g_audio_plen = res.data.data.length;
						getApp().globalData.g_req_data = res.data.data; //console.log(res);

						wx.navigateTo({
							url: '/pages/ablum/ablum-content?float=1&pid=' + util.getListenRecord().pid
						});
					}
				});
			},
			//进入收听详情
			goDetail: function() {
				getApp().globalData.g_audio_ablum_temid = util.getListenRecord().tmp_id || 0; //console.log('go-detail--', util.getListenRecord(),util.getListenRecord().tmp_id);

				this.reqBookData();
			}
		}
	};
</script>
<style>
	@import "./ablumv1.css";
</style>
