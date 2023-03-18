<template>
	<view class="index">
		<button @click.stop="init">TIM初始化</button>
		<button @click.stop="toLogin">TIM登录</button>
		<button @click.stop="toLoginOut">TIM登出</button>
		<button @click.stop="toConversation(`fusheng`)">跳转一对一图文语音页面</button>
		<button @click.stop="toVideo">跳转音视频页面</button>
	</view>
</template>

<script setup>
import {init_TIM,login_TIM,logout_TIM} from "../../common/ts/tim";

//TIM初始化 项目启动时介入,传参TIM应用的SDKAppID number
const init = () => init_TIM(1400631896)

//登录 用户登录时介入,传参当前用户的ID string
const toLogin = () => login_TIM(`caisheng`)

//登出 用户退出登录时介入
const toLoginOut = () => logout_TIM()

//跳转一对一图文语音页面,传参目标用户的ID string,目标用户需登录过TIM
const toConversation = (id) => {
	uni.navigateTo({
		url: `/conversation/index?id=${id}`,
	})
}

//跳转音视频页面
const toVideo = () => {
	let obj = {
		type: '视频',
		sdkAppID: 1400631896,
		userID: `caisheng`,
		userSig: uni.getStorageSync('userSig'),
		strRoomID: '332211',
		enableCamera: `视频`,
		enableMic: true,
		beautyLevel: 9,
	}
	uni.navigateTo({
		url: `/videoCall/index?obj=${encodeURIComponent(JSON.stringify(obj))}`,
	})
}

</script>

<style lang="scss" scoped>
@import "index.scss";
</style>
