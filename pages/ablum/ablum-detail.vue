<template>
	<view>
		<nav-bar v-if="!navBarHidden" :navbar-data="nvabarData"></nav-bar>
		<view class="ablum-detail-title">
			<text>{{title}}</text>
			<text v-if="hasIntro" @tap.stop="goIntro" :data-id="bookid">介绍</text>
		</view>
		<view class="container">
			<block data-type="template" data-is="ablum-detail" data-attr="albums:albums,isPlaying:isPlaying,swiperIndex:swiperIndex,upSwiperIndex:upSwiperIndex,currentIdx:currentIdx,title:title,authMsg:authMsg">
				<view class="ablum-detail-container">
					<view class="ablum-detail-swiper-title">
						<text class="ablum-detail-swiper-title1">{{albums.length<1 ? '' : upSwiperIndex}}</text>
						<text class="ablum-detail-swiper-title2">{{albums.length<1 ? '' : '/' + albums.length}}</text>
					</view>
					<swiper class="imageContainer" @change="handleChange" previous-margin="40rpx" next-margin="35rpx" :current="currentIdx"
					 circular>
						<block v-for="(ablum, index) in albums" :key="swiper">
							<swiper-item class="item" key="swiper-item-{{index}}" :current="currentIdx">
								<view :class="'ablum-detail-swiper-item  ' + (swiperIndex == index ? 'ablum-detail-swiper-item-active': '')"
								 @tap.stop="goContent" :data-pid="swiperIndex">
									<view :class="'ablum-detail-swiper-item-content ' + (swiperIndex == index ? 'ablum-detail-swiper-item-content-active': '')">

										<view class="ablum-detail-s-i-top">
											<view class="ablum-detail-s-i-top1">{{title}}</view>
											<!-- <image catchlongtap='' class='ablum-detail-s-i-top2' src='https://uimg.gximg.cn/v/res/201905/21-19/dianping@3x.png'></image> -->
										</view>
										<view class="ablum-detail-s-i-title">{{ablum['title']}}</view>
										<view class="ablum-detail-s-i-img">
											<image :class="'itemImg ' + (swiperIndex == index ? 'active': '')" :src="ablum['cover']"></image>
											<image @tap.stop="audioPlay" :data-pid="swiperIndex" class="ablum-detail-s-play-img" :src="'https://uimg.gximg.cn/v/res/201905/22-10/' + (isPlaying && swiperIndex == currentIdx ? 'play_stop@3x.png' : 'play@3x.png')"></image>
											<image class="ablum-detail-s-tagyinpin" src="https://uimg.gximg.cn/v/res/201905/22-10/tag_yinpin@3x.png"></image>
											<!-- <image src='https://uimg.gximg.cn/v/res/201905/22-10/play_stop@3x.png'></image> -->
										</view>
										<view v-if="authMsg.status == 0" class="ablum-detail-s-i-tip">
											<view style="position:relative;">
												<image class="ablum-detail-s-i-tip-img" src="https://uimg.gximg.cn/v/res/201905/22-11/shitingbg@3x.png">
												</image>
												<text>{{authMsg.try_text}}</text>
											</view>
										</view>
									</view>
								</view>
							</swiper-item>
						</block>
					</swiper>
				</view>
			</block>

			<view class="ablum-lock-view" :style="isHuawei ? 'margin-top:20rpx;' : ''">
				<view :hidden="playerHidden">
					<block data-type="template" data-is="player-button" data-attr="isPlaying:isPlaying,audioTitle:audioTitle,playerCloseHidden:playerCloseHidden,timeStep:timeStep,timeTotal:timeTotal,tryListen:tryListen,currentIdx:currentIdx,authMsg:authMsg,albums:albums,isHuawei:isHuawei,bookid:bookid">
						<view class="play-bttuon-view" :style="isHuawei ? 'height:120rpx' : ''">
							<view :hidden="playerCloseHidden" @tap.stop="closePlayer" class="play-button-close">
								<image src="https://uimg.gximg.cn/v/res/201905/22-16/fdclose@3x.png"></image>
							</view>
							<view class="play-button-cover" @tap.stop="goContent" :data-pid="currentIdx">
								<image :src="albums[currentIdx]['cover_square']"></image>
							</view>
							<view class="play-button-content" @tap.stop="goContent" :data-pid="currentIdx">
								<view v-if="!tryListen">
									<view class="play-button-content1">{{audioTitle}}</view>
									<view class="play-button-content2">{{timeStep}}{{timeTotal}}</view>
								</view>
								<view v-else>
									<view @tap.stop="goCustom" class="play-button-content3">{{authMsg.try_end_text}}</view>
								</view>
							</view>

							<view class="play-button-contro">
								<block v-if="!tryListen">
									<view @tap.stop="preAudio" class="play-button-prev">
										<image src="https://uimg.gximg.cn/v/res/201905/22-16/fdplay_previous@3x.png"></image>
									</view>
									<view @tap.stop="audioPlayer" :data-pid="currentIdx" class="play-button-play">
										<image v-if="isPlaying" src="https://uimg.gximg.cn/v/res/201905/23-15/fdpause@3x.png"></image>
										<image v-else src="https://uimg.gximg.cn/v/res/201905/22-16/fdplay@3x.png"></image>
									</view>
									<view @tap.stop="nextAudio" class="play-button-next">
										<image src="https://uimg.gximg.cn/v/res/201905/22-16/fdplay_next@3x.png"></image>
									</view>
								</block>
								<block v-else class="play-button-buy-view">
									<view v-if="bookid == 70" class="play-button-buy">
										<navigator target="miniProgram" open-type="navigate" app-id="wx4d08202062ac8130" path="/pages/service-card/service-card?id=100010"
										 version="release">{{authMsg.btn_text}}</navigator>
									</view>
									<text v-else @tap.stop="goCustom" class="play-button-buy">{{authMsg.btn_text}}</text>
								</block>
							</view>
						</view>
					</block>
				</view>
				<navigator :hidden="!playerHidden" class="ablum-lock-view-text" v-if="bookid == 79 && authMsg.status == 0" target="miniProgram"
				 open-type="navigate" app-id="wx4d08202062ac8130" path="/pages/service-card/service-card?id=100010" version="release">{{authMsg.text}}</navigator>
				<text v-else-if="authMsg.status == 0 && playerHidden" @tap.stop="goCustom" class="ablum-lock-view-text">
					<text>{{authMsg.text}}\n<text class="ablum-lock-expire-text">{{authMsg.expire}}</text>
					</text>
				</text>
				<text v-else-if="authMsg.status == 1 && playerHidden && authMsg.expire_text.length != 0" :style="authMsg.expire_text.length == 0 ? '' : 'line-height:7rpx;'"
				 @tap.stop="goCustom" class="ablum-lock-view-text">{{authMsg.expire_text}}</text>
			</view>
		</view>

		<!-- 客服弹框 -->
		<!-- <custom-modal id="customModal" ref="customModal" :cfg="custom_cfg" confirmText="解锁" modalSize="md" title="提示" @cancelEvent="_cancelEvent" @confirmEvent="_confirmEventThird" @invitShareEvent="invitShareEventFun">
  <view class="custom-modal">
    <view class="custom-avatar-warp">
      <view>
        <text>{{custom_cfg.content}}</text>
      </view>
    </view>
  </view>
</custom-modal> -->
	</view>
</template>

<script>
	// const log = console.log().bind(console,'[ablum-detail]');
	const app = getApp().globalData;
	var util = require("../../utils/util");
	const displayUtils = require("../../utils/displayUtils.js");
	var unitUrl = "https://v.xueweigui.com/ApiWordCourse/unitList?book_id="; // var unitUrl = "https://v.xueweigui.com/ApiWordCourse/unitList?book_id=";
	import customModal from "../../component/easyModal/custom-modal/custom-modal";
	import navBar from "../../component/nav-bar/nav-bar";

	export default {
		data() {
			return {
				albums: [],
				isListening: false,
				//是否已监听
				indicatorDots: false,
				swiperIndex: 0,
				upSwiperIndex: 1,
				currentIdx: 0,
				lockText: "",
				listening: false,
				isPlaying: false,
				isPause: true,
				audioTitle: '',
				playerHidden: true,
				playerCloseHidden: true,
				timeTotal: '/00:00',
				timeStep: '00:00',
				hasAuth: false,
				//是否有权限收听
				tryListen: false,
				//试听是否结束
				title: '',
				hasIntro: false,
				//是否展示介绍哦
				isHuawei: false,
				authMsg: {},
				//权限信息
				custom_cfg: {
					content: '点我解锁听课权限\n(• ̀ω•́ )✧',
					img: 'https://uimg.gximg.cn/v/res/201903/14-11/img_banner.jpg',
					path: 'pages/ablum/ablum-detail?scene=custom_order&product_type=50&product_id=211'
				},
				nvabarData: {
					showCapsule: 1,
					showGoHome: true,
					// 是否显示左上角胶囊按钮 1 显示 0 不显示
					title: '刘洪波讲单词'
				},
				share_idx: "",
				bookid: "",
				reqUrl: "",
				hasInfoUrl: "",
				navBarHidden: true, //自定义菜单是否隐藏
				isFisrtShow: false //是否首次载入
			};
		},

		components: {
			customModal,
			navBar
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			// wx.showLoading({
			//   title: '加载中...'
			// });
			let share_idx = options.share_idx || 0; //分享的音频下标-默认第一个

			this.setData({
				share_idx: share_idx
			});
			console.log('ablum-detail-onload', options, this.$data.share_idx);
			let id = options.id;
			var url = decodeURIComponent(options.url);

			if (url == 'undefined') {
				url = unitUrl + id;
			}

			let title = '';
			var path = '';
			var cus_title = '';
			var cus_content = '';
			var img = '';
			this.setData({
				title: title,
				bookid: id,
				reqUrl: url,
				isHuawei: getApp().globalData.g_is_huawei
			});
			getApp().globalData.g_audio_bookid = id;
			getApp().globalData.g_audio_reqUrl = url;
			var that = this;
			util.getRequest(url, {}, function(res) {
				if (res.data.e != '9999') {
					wx.showToast({
						title: '网络繁忙,稍后重试',
						icon: 'none'
					});
				} else {
					res.data.data.map(reg => reg.audio = JSON.parse(util.secret(reg.media, reg.media_iv)));
					that.setData({
						albums: res.data.data,
						authMsg: res.data.auth
					});
					var custom_cfg_reg = res.data.custom_cfg;
					that.setData({
						hasIntro: res.data.mini_intro.isshow, //false,
						hasInfoUrl: res.data.mini_intro.url
					});
					getApp().globalData.g_test_type = id;
					var custom_cfg = {
						title: custom_cfg_reg.cus_title,
						content: custom_cfg_reg.cus_content,
						img: custom_cfg_reg.img,
						path: custom_cfg_reg.path
					};
					that.setData({
						custom_cfg: custom_cfg
					});
					getApp().globalData.g_custom_msg = custom_cfg;
					getApp().globalData.g_auth_msg = res.data.auth;
					getApp().globalData.g_audio_auth = res.data.auth.status == 0 ? false : true;
					getApp().globalData.g_try_time = res.data.auth.try_time;
					getApp().globalData.g_audio_plen = res.data.data.length;
					getApp().globalData.g_share_img = res.data.mini_share.url;
					getApp().globalData.g_req_data = res.data.data;
					console.log(res);
				}
			}); //判断是播放视频or 音频

			if (!getApp().globalData.g_audio_obj) {
				getApp().globalData.g_audio_obj = wx.getBackgroundAudioManager();

				console.log('****create getBackgroundAudioManager', getApp().globalData.g_audio_obj);
			} //初始化数据


			console.log('onLoad1');
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			this.customModal = this.$refs.customModal;
			this.setData({
				isFisrtShow:true
			});
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		async onShow() {
			console.log('ablum-detail--onshow'); //TODO 判断是否有购买后开通权限操作
			var that = this;
			const res = await this.reqData(this.reqUrl);
			this.setData({
				albums: res.data,
				authMsg: res.auth
			});
			this.setDuratoin(res.data);
			getApp().globalData.g_auth_msg = res.auth;
			getApp().globalData.g_audio_auth = res.auth.status == 0 ? false : true;
			getApp().globalData.g_try_time = res.auth.try_time;
			getApp().globalData.g_audio_plen = res.data.length;
			getApp().globalData.g_share_img = res.mini_share.url;
			getApp().globalData.g_req_data = res.data;

			//    util.getRequest(this.$data.reqUrl, {}, function (res) {
			//      console.log('onshow req', res);
			//      if (res.data.e != '9999') {
			//        wx.showToast({
			//          title: '网络繁忙,稍后重试',
			//          icon: 'none'
			//        });
			//      } else {
			//        res.data.data.map(reg => reg.audio = JSON.parse(util.secret(reg.media, reg.media_iv)));
			//        that.setData({
			//          albums: res.data.data,
			//          authMsg: res.data.auth
			//        });
			// 	setTimeout(()=>{
			// 		that.setDuratoin(that.ablums);
			// 	},3000);
			//        getApp().globalData.g_auth_msg = res.data.auth;
			//        getApp().globalData.g_audio_auth = res.data.auth.status == 0 ? false : true;
			//        getApp().globalData.g_try_time = res.data.auth.try_time;
			//        getApp().globalData.g_audio_plen = res.data.data.length;
			//        getApp().globalData.g_share_img = res.data.mini_share.url;
			//        getApp().globalData.g_req_data = res.data.data;
			//        console.log(res);
			//      }
			//    }); //从其它页面操作音频控制同步本页

			let isPlaying = false;
			let tryListen = false;
			getApp().globalData.g_has_index_toggle = true;

			if (getApp().globalData.g_audio_playing) {
				isPlaying = true;
			}

			if (!getApp().globalData.g_audio_auth && getApp().globalData.g_audio_tryListen) {
				tryListen = true;
			}
			if (getApp().globalData.g_audio_pause) {
				this.setData({
					timeStep: getApp().globalData.g_audio_timeStep
				});
			}
			let currentIdx;
			if (this.$data.share_idx != 0) {
				currentIdx = this.$data.share_idx;
			} else {
				currentIdx = getApp().globalData.g_audio_ablum_id == getApp().globalData.g_audio_ablum_temid ? getApp().globalData
					.g_audio_pid : this.share_idx;
			}

			console.log('currentIdx', currentIdx);

			this.setData({
				isPlaying: isPlaying,
				tryListen: tryListen,
				playerHidden: getApp().globalData.g_audio_player,
				playerCloseHidden: !getApp().globalData.g_audio_pause,
				swiperIndex: currentIdx,
				currentIdx: currentIdx,
				upSwiperIndex: parseInt(currentIdx) + 1,
				audioTitle: getApp().globalData.g_audio_title
			}); //监听
			//为了使currentIdx生效
			if (!this.isFisrtShow) {
				this.setData({
					currentIdx: currentIdx + 1
				});
				setTimeout(() => {
					that.setData({
						currentIdx: currentIdx,
					});
				})
			} else {
				this.setData({
					currentIdx: currentIdx
				});
			}

			this.audioManagerLister(); // app.globalData.g_req_data = this.data.reqData;
			this.isCurrentEvnet();
			this.upTryTime(currentIdx);
			wx.hideLoading();
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			this.setData({
				isFisrtShow :false
			});
		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			getApp().globalData.g_audio_player = true;
			this.setData({
				playerHidden: true
			});
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			return {
				title: this.$data.title,
				imageUrl: getApp().globalData.g_share_img,
				path: '/pages/ablum/ablum-detail?id=' + this.bookid + '&url=' + encodeURIComponent(this.$data.reqUrl) +
					'&share_idx=' + getApp().globalData.g_audio_pid
			};
		},
		methods: {
			/**
			 * 获取音频数据
			 * @param {Object} url
			 */
			reqData(url) {
				return new Promise((resolve, reject) => {
					util.getRequest(url, {}, function(res) {
						console.log('onshow req', res);
						if (res.data.e != '9999') {
							reject({
								...res.data.e,
								message: '请求获取数据异常'
							});
						} else {
							res.data.data.map(reg => reg.audio = JSON.parse(util.secret(reg.media, reg.media_iv)));
							resolve(res.data);
						}
					})
				});
			},
			//是否为当前播放的id
			isCurrentEvnet() {
				//console.log('isCureentEvnet', app.globalData.g_audio_ablum_id, app.globalData.g_audio_ablum_temid);
				if (getApp().globalData.g_audio_playing && getApp().globalData.g_audio_ablum_id == getApp().globalData.g_audio_ablum_temid) {
					this.setData({
						isPlaying: true,
						playerHidden: false
					});
				} else if (getApp().globalData.g_audio_playing && getApp().globalData.g_audio_ablum_id != getApp().globalData.g_audio_ablum_temid) {
					this.setData({
						isPlaying: false,
						playerHidden: true
					}); //noting
				} else if (getApp().globalData.g_audio_playing != null && getApp().globalData.g_audio_ablum_id != getApp().globalData
					.g_audio_ablum_temid) {
					getApp().globalData.g_audio_playing = false;
					getApp().globalData.g_audio_player = true;
					this.setData({
						isPlaying: false,
						playerHidden: true
					});
				} else {}
			},

			//更新每个音频的测试时间
			upTryTime: function(currentIdx) {
				let that = this;
				setTimeout(function() {
					console.log('uptrytime', currentIdx, getApp().globalData.g_req_data, getApp().globalData.g_req_data[currentIdx]
						.try_time);;
					getApp().globalData.g_try_time = getApp().globalData.g_req_data[currentIdx].try_time;
				}, 1000);
			},
			handleChange: function(e) {
				console.log('upSwiperIndex', e, e.detail.current, e.detail.current == null);
				//let currentIdx = e.detail.current == null ? 1 : e.detail.current''
				this.setData({
					upSwiperIndex: parseInt(e.detail.current + 1),
					swiperIndex: e.detail.current,
					// currentIdx:e.detail.current
				});
			},
			//跳转webview
			goIntro: function(evnet) {
				console.log('hasInfoUrl', this.$data.hasInfoUrl);
				wx.navigateTo({
					url: '/pages/webview/award?url=' + encodeURIComponent(this.$data.hasInfoUrl)
				});
			},
			//初始播放
			audioPlay: function(event) {
				let pid = event.currentTarget.dataset.pid; //已播放过且不是当前

				console.log('audio play 1--', getApp().globalData.g_audio_ablum_id, getApp().globalData.g_audio_ablum_temid);

				if (getApp().globalData.g_audio_ablum_id == getApp().globalData.g_audio_ablum_temid && getApp().globalData.g_audio_playing !=
					null && pid == getApp().globalData.g_audio_pid && !getApp().globalData.g_audio_ended) {
					console.log(getApp().globalData.g_audio_pid, getApp().globalData.g_audio_ended);

					if (getApp().globalData.g_audio_playing) {
						getApp().globalData.g_audio_obj.pause();
					}

					if (getApp().globalData.g_audio_pause == true) {
						console.log('click play');
						getApp().globalData.g_audio_obj.play();
					}

					return;
				}

				console.log('init play pid--', pid);
				getApp().globalData.g_audio_obj.stop();
				getApp().globalData.g_audio_pid = pid;
				getApp().globalData.g_audio_idx = 0;
				getApp().globalData.g_audio_obj.src = this.$data.albums[pid]['audio'][0]['url'];
				getApp().globalData.g_audio_obj.title = this.$data.albums[pid]['audio'][0]['title'];
				getApp().globalData.g_audio_obj.play();
				this.setData({
					tryListen: false,
					playerCloseHidden: true
				});
				getApp().globalData.g_audio_ended = false;
				this.upTryTime(pid); //更新试听时间
			},
			//控制面板播放
			audioPlayer: function(event) {
				let pid = event.currentTarget.dataset.pid;
				console.log('audioPlay pid-----', pid);

				if (getApp().globalData.g_audio_playing) {
					console.log('click pause');
					getApp().globalData.g_audio_obj.pause();
					return;
				}

				if (getApp().globalData.g_audio_pause == true) {
					console.log('click play');
					getApp().globalData.g_audio_obj.play();
					return;
				}

				getApp().globalData.g_audio_obj.stop();
				getApp().globalData.g_audio_pid = pid;
				getApp().globalData.g_audio_obj.src = this.$data.albums[pid]['audio'][0]['url'];
				getApp().globalData.g_audio_obj.title = this.$data.albums[pid]['audio'][0]['title'];
				getApp().globalData.g_audio_obj.play();
				this.setData({
					tryListen: false,
					playerCloseHidden: true
				});
				getApp().globalData.g_audio_ended = false;
			},
			//跳转详情
			goContent: function(event) {
				let pid = event.currentTarget.dataset.pid;
				console.log('pid-', pid);
				wx.navigateTo({
					url: '/pages/ablum/ablum-content?pid=' + pid
				});
			},
			//上一个音频
			preAudio: function() {
				var that = this;
				let sub_len = this.$data.albums[getApp().globalData.g_audio_pid].audio.length;
				console.log('子集长度--', sub_len);
				getApp().globalData.g_audio_obj.stop(); //子集长度判断

				if (getApp().globalData.g_audio_idx - 1 < 0) {
					//子集重置为0 & 父级判断
					getApp().globalData.g_audio_idx = 0;

					if (parseInt(getApp().globalData.g_audio_pid - 1) < 0) {
						getApp().globalData.g_audio_pid = parseInt(getApp().globalData.g_audio_plen - 1);
					} else {
						getApp().globalData.g_audio_pid = parseInt(getApp().globalData.g_audio_pid - 1);
					}
				} else {
					getApp().globalData.g_audio_idx = parseInt(getApp().globalData.g_audio_idx - 1);
				}

				if (!getApp().globalData.g_audio_auth && getApp().globalData.g_audio_idx != 0) {
					wx.showModal({
						title: '提示',
						content: '购买后,可听全部课程',
						success: function(res) {
							if (res.confirm) {
								that.goCustom();
							}
						}
					});
					return;
				}

				getApp().globalData.g_audio_obj.src = this.$data.albums[getApp().globalData.g_audio_pid]['audio'][getApp().globalData
					.g_audio_idx
				]['url'];
				getApp().globalData.g_audio_obj.title = this.$data.albums[getApp().globalData.g_audio_pid]['audio'][getApp().globalData
					.g_audio_idx
				]['title'];
				getApp().globalData.g_audio_obj.play();
				this.setData({
					upSwiperIndex: parseInt(getApp().globalData.g_audio_pid + 1),
					swiperIndex: getApp().globalData.g_audio_pid
				});

				this.upTryTime(getApp().globalData.g_audio_pid); //更新试听时间
			},
			//下一个音频
			nextAudio: function() {
				var that = this;
				let sub_len = this.$data.albums[getApp().globalData.g_audio_pid].audio.length;
				console.log('子集长度--', sub_len);
				getApp().globalData.g_audio_obj.stop(); //子集长度判断

				if (getApp().globalData.g_audio_idx + 1 > sub_len - 1) {
					//子集重置为0 & 父级判断
					getApp().globalData.g_audio_idx = 0;

					if (parseInt(getApp().globalData.g_audio_pid + 1) > getApp().globalData.g_audio_plen - 1) {
						getApp().globalData.g_audio_pid = 0;
					} else {
						getApp().globalData.g_audio_pid = parseInt(getApp().globalData.g_audio_pid + 1);
					}
				} else {
					getApp().globalData.g_audio_idx = parseInt(getApp().globalData.g_audio_idx + 1);
				}

				console.log('app.globalData.g_audio_idx', getApp().globalData.g_audio_idx);

				if (!getApp().globalData.g_audio_auth && getApp().globalData.g_audio_idx != 0) {
					wx.showModal({
						title: '提示',
						content: '购买后,可听全部课程',
						success: function(res) {
							if (res.confirm) {
								that.goCustom();
							}
						}
					});
					return;
				}

				getApp().globalData.g_audio_obj.src = this.$data.albums[getApp().globalData.g_audio_pid]['audio'][getApp().globalData
					.g_audio_idx
				]['url'];
				getApp().globalData.g_audio_obj.title = this.$data.albums[getApp().globalData.g_audio_pid]['audio'][getApp().globalData
					.g_audio_idx
				]['title'];
				getApp().globalData.g_audio_obj.play();
				this.setData({
					upSwiperIndex: parseInt(getApp().globalData.g_audio_pid + 1),
					swiperIndex: getApp().globalData.g_audio_pid
				});
				this.upTryTime(getApp().globalData.g_audio_pid); //更新试听时间
			},
			//关闭播放控制
			closePlayer: function() {
				getApp().globalData.g_audio_player = true;
				this.setData({
					playerCloseHidden: true,
					playerHidden: true
				});
			},
			/**
			 * 获取用户授权
			 */
			aliGetAuthCode: function(scopeCode = 'auth_user') {
				return new Promise((resolve, reject) => {
					my.getAuthCode({
						scopes: scopeCode,
						success: (auth) => {
							resolve(auth);
						},
						fail: (err) => {
							reject({ ...err,
								message: '获取用户授权失败'
							});
						}
					})
				});
			},
			/**
			 * 获取用户信息
			 * @param {Object} authCode
			 */
			getUserByAuthCode: function(authCode) {
				let url = '';
				return new Promise((resolve, reject) => {
					util.getRequest(url, {
						authCode: authCode
					}, (res) => {
						if (res.data.e = '9999') {
							resolve(res.data);
						} else {
							reject({ ...res.data,
								message: '获取用户信息失败'
							})
						}
					});
				});
			},
			/**
			 * 创建支付交易订单
			 * @param {Object} authCode
			 * @param {Object} uid
			 */
			getTradeNo: function(authCode, uid) {
				let url = '';
				let reqData = {
					total_amount: '0.01',
					out_trade_no: `${new Date().getTime()}_demo_pay`,
					scene: 'bar_code',
					auth_code: authCode,
					subject: '小程序支付演示DEMO',
					buyer_id: uid
				};
				return new Promise((resolve, reject) => {
					util.getRequest(url, reqData, (res) => {
						if (res.data.e = '9999') {
							resolve(res.data);
						} else {
							reject({ ...res.data,
								message: '获取用户信息失败'
							})
						}
					});
				});
			},
			/**
			 * 发起支付
			 * @param {Object} tradeNo
			 */
			cashPaymentTrade: function(tradeNo) {
				return new Promise((resolve, reject) => {
					my.tradePay({
						tradeNO: tradeNo,
						success: (result) => {
							if (result.resultCode != 9000) {
								resolve({
									status: false,
									message: result.memo,
									...result
								});
							} else {
								resolve({
									status: true,
									message: '支付成功',
									...result
								});
							}
						},
						fail: (err) => {
							reject({
								status: false,
								message: '支付异常',
								...err
							});
						}
					});
				});
			},
			showToast: function(message, type = 'none') {
				my.showToast({
					type,
					content: message,
					duration: 3000
				});
			},
			async goCustom() {
				console.log('gocustom--');
				var that = this;
				var system = wx.getSystemInfoSync().system;
				console.log('g_app', getApp().globalData.g_app);
				if (getApp().globalData.g_app == 'alipay') {
					util.aliPay(this.authMsg.order_url);
					return;
				}

				if (system.indexOf('iOS') === -1) {
					util.payAction(this.$data.authMsg.order_url); // let url = this.$data.data.authMsg.order_url || '';
					// wx.navigateTo({
					//   url: '../order/order?url=' + url,
					// })
				} else {
					this.customModal.show();
				}
			},
			//保存收听记录
			saveListenRecord: function() {
				var _reg = {
					pid: getApp().globalData.g_audio_pid,
					idx: getApp().globalData.g_audio_idx,
					time: getApp().globalData.g_audio_seeker,
					book_id: getApp().globalData.g_audio_bookid,
					cover: getApp().globalData.g_audio_cover_square,
					tmp_id: getApp().globalData.g_audio_ablum_temid
				};
				util.saveListenRecord(_reg);
			},
			/**
			 * 设置时长
			 * @param {Object} data
			 */
			setDuratoin: function(data) {
				console.log('***setDuration', data,
					getApp().globalData.g_audio_pid,
					getApp().globalData.g_audio_idx
				);
				let _duration = data[getApp().globalData.g_audio_pid]['audio'][getApp().globalData.g_audio_idx]['duration'];
				let max = _duration / 1000;
				let duratoin = util.formLoadMTime(_duration);
				getApp().globalData.g_audio_duration = duratoin;
				getApp().globalData.g_audio_max = max;
				this.setData({
					timeTotal: '/' + duratoin,
					max: max
				});
			},
			//监听操作
			audioManagerLister: function() {
				// getApp().globalData.g_audio_obj = my.getBackgroundAudioManager();
				console.log('****ablum-detail-managerlister', getApp().globalData.g_audio_obj, getApp().globalData.g_audio_duration);
				var that = this;

				if (getApp().globalData.g_audio_duration != null) {
					that.setData({
						timeTotal: '/' + getApp().globalData.g_audio_duration
					});
				} else {
					console.log('****g_audio_duration-if-1')
					console.log('****g_audio_duration-if', getApp().globalData.g_audio_duration);
				}

				getApp().globalData.g_audio_obj.onError((res) => {
					console.log('backgroundAudioManager 背景音频播放错误事件 onError ')
					my.alert({
						content: 'backgroundAudioManager 背景音频播放错误事件 onError' + JSON.stringify(res)
					});
				});

				getApp().globalData.g_audio_obj.onCanplay(function() {
					let _duration = getApp().globalData.g_req_data[getApp().globalData.g_audio_pid]['audio'][getApp().globalData.g_audio_idx]
						['duration'];
					let max = _duration / 1000;
					let duratoin = util.formLoadMTime(_duration);
					getApp().globalData.g_audio_duration = duratoin;
					getApp().globalData.g_audio_max = max;
					console.log('****onCanplay2', getApp().globalData.g_audio_duration);
					console.log('onCanplay');
					that.setData({
						timeTotal: '/' + duratoin
					});
				}); //监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发

				getApp().globalData.g_audio_obj.onWaiting(function() {
					console.log('onWaiting');
				}); //监听背景音频播放错误事件

				getApp().globalData.g_audio_obj.onError(function() {
					console.log('onError');
				}); //监听背景音频播放事件

				getApp().globalData.g_audio_obj.onPlay(function() {
					console.log('onPlay1');
					getApp().globalData.g_audio_cover_square = that.$data.albums[getApp().globalData.g_audio_pid]['cover_square'];
					getApp().globalData.g_audio_playing = true;
					getApp().globalData.g_audio_pause = false;
					getApp().globalData.g_audio_title = that.$data.albums[getApp().globalData.g_audio_pid]['audio'][getApp().globalData
						.g_audio_idx
					]['title'];
					getApp().globalData.g_audio_tryListen = false;
					getApp().globalData.g_audio_player = false;
					getApp().globalData.g_audio_ablum_id = getApp().globalData.g_audio_ablum_temid;
					getApp().globalData.g_audio_obj.coverImgUrl = that.$data.albums[getApp().globalData.g_audio_pid]['cover'];
					that.setData({
						playerHidden: false,
						playerCloseHidden: true,
						isPlaying: true,
						currentIdx: getApp().globalData.g_audio_pid,
						audioTitle: that.$data.albums[getApp().globalData.g_audio_pid]['audio'][getApp().globalData.g_audio_idx][
							'title'
						]
					}); //保存收听记录

					that.saveListenRecord();
				}); //监听背景音频暂停事件

				getApp().globalData.g_audio_obj.onPause(function() {
					getApp().globalData.g_audio_cover_square = that.$data.albums[getApp().globalData.g_audio_pid]['cover_square'];
					getApp().globalData.g_audio_playing = false;
					getApp().globalData.g_audio_pause = true;
					that.setData({
						isPlaying: false,
						isPause: true,
						playerCloseHidden: false
					}); //保存收听记录

					that.saveListenRecord();
					console.log('onPause');
				});
				getApp().globalData.g_audio_obj.onEnded(function() {
					getApp().globalData.g_audio_timeStep = '00:00';
					getApp().globalData.g_audio_ended = true;
					that.setData({
						isPlaying: false,
						timeStep: '00:00'
					});
					console.log('onEnded');
				});
				getApp().globalData.g_audio_obj.onStop(function() {
					getApp().globalData.g_audio_playing = null;
					getApp().globalData.g_audio_timeStep = '00:00';
					that.setData({
						isPlaying: false
					});
					console.log('onStop');
				}); //监听背景音频播放进度更新事件

				getApp().globalData.g_audio_obj.onTimeUpdate(function() {
					if (getApp().globalData.g_audio_ablum_id != getApp().globalData.g_audio_ablum_temid) return;
					let seeker = getApp().globalData.g_audio_obj.currentTime;
					let num = util.formLoadTime(seeker);
					getApp().globalData.g_audio_player = false;
					that.setData({
						timeStep: num,
						playerHidden: false
					}); //todo 开通权限后需要重新请求数据 设为非试听
					//console.log('ablum-datail-',getApp().globalData.g_audio_auth,getApp().globalData.g_audio_obj.currentTime >= getApp().globalData.g_try_time);
					if (!getApp().globalData.g_audio_auth && getApp().globalData.g_audio_obj.currentTime >= getApp().globalData.g_try_time) {
						that.setData({
							tryListen: true,
							playerCloseHidden: false
						});
						getApp().globalData.g_audio_tryListen = true;
						getApp().globalData.g_audio_obj.stop();
					}

					getApp().globalData.g_audio_timeStep = num;
					getApp().globalData.g_audio_seeker = seeker;
				});
				this.setData({
					isListening: true
				});
			},
			navigatorFail: function(e) {
				console.log('navigator', e);
			},
			invitShareEventFun: function() {}
		}
	};
</script>
<style>
	@import "./ablum-detail.css";
</style>
