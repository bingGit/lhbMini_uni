<template>
<view>
<template name="ablum-list">
	<view @tap.stop="goAlbum" :data-url="album['url']" :data-idx="idx" :data-id="album['id']" :data-ablum="album" class="ablum-list-container">

		<view v-if="album['product_type'] == 7010" class="ablum-view-c">
			<video autoplay="false" :muted="muted" custom-cache="false" class="ablum-video" objectFit="fill" enable-play-gesture="true" id="myVideo" :src="coverHidden ? album['url'] : ''" controls>
				<cover-image @tap.stop="videoPlay" :data-idx="idx" :data-url="album['url']" :data-id="album['id']" :hidden="coverHidden" class="ablum-list-img ablum-video-img" :src="album['cover']"></cover-image>
			</video>
		</view>

		<view v-else-if="album['product_type'] == 7036" class="ablum-list-ad-item">
			<image class="ablum-list-ad-img" :src="album['cover']"></image>
		</view>

		<view v-else-if="album['product_type'] == 7032" :class="idx % 2 == 0 ?  'ablum-list-cover-view' : 'ablum-list-cover-view2'">
			<image class="ablum-list-cover-img" :src="album['square']"></image>
		</view>

		<view v-else-if="album['product_type'] == 7038" :class="idx % 2 == 0 ?  'ablum-list-cover-view' : 'ablum-list-cover-view2'">
			<view class="ablum-list-waiting">
				<text class="ablum-list-waiting-title">{{album['title']}}</text>
				<text class="ablum-list-waiting-text{">
					<text class="ablum-list-waiting-cont">{{album['content']}}</text>
					<text class="ablum-list-waiting-cont-bg"></text>
				</text>
				
			</view>
		</view>
	</view>

</template>
</view>
</template>

<style>
@import "./ablum-listv1.css";
</style>