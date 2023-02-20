<template>
	<view class="index">
		<!--		<input v-model="idcard" class="input" type="idcard" placeholder="输入身份证" maxlength="18">
				<button size="mini" @click="toMiniProgram">跳转</button>-->
		<button @click.stop="toLogin">IM登录</button>
		<button @click.stop="toConversation">跳转会话页面</button>
		<button @click.stop="toVideo">跳转音视频页面</button>
	</view>
</template>

<script setup>
//import Encrypt from "../../common/ts/encrypt";
import {ref} from "vue";
import {onLoad,onReachBottom,onReady,onShareAppMessage} from "@dcloudio/uni-app";
import {init_TIM,login_TIM,sendMessage_TIM,getMsgList_TIM} from "../../common/ts/tim";
import {roomNo} from "../../common/api/login";

/*const idcard = ref()
 const toMiniProgram = () => {
 uni.navigateToMiniProgram({
 appId: "wx90306cc2e7ae9567",
 envVersion: "trial",
 path: `package1/pages/hmHospitalLoan/homepage/homepage?channelId=HN00000010&code=${Encrypt.base64(encodeURIComponent(idcard.value))}`,
 fail: () => {
 },
 })
 }*/

onLoad(() => init_TIM())

const toLogin = () => login_TIM(`charge-9000727221-yc`)

const toConversation = () => {
	uni.navigateTo({
		url: `/conversation/index`,
	})
}

const toVideo = () => {
	roomNo(Object.assign({},{
		patientId: `charge-9000727221-yc`,
		doctorPhone: '13871863559',
	})).then(res => {
		let obj = {
			type: '视频',
			sdkAppID: 1400631896,
			userID: `charge-9000727221-yc`,
			userSig: uni.getStorageSync('userSig'),
			roomID: 4294967293,
			enableCamera: `视频`,
			enableMic: true,
			beautyLevel: 9,
		}
		uni.navigateTo({
			url: `/videoCall/index?obj=${encodeURIComponent(JSON.stringify(obj))}`,
		})
	})
}

</script>

<style lang="scss" scoped>
@import "index.scss";
</style>
