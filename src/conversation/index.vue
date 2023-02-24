<template>
	<view class="index">
		<view v-for="(value,index) in list.value" :key="index"
					:class="['line' , value.flow === 'in' ? 'left' : value.flow === 'out' ? 'right' : '']">
			<view class="portrait">{{ value.flow === 'in' ? value.nick.substring(0,1) : '我' }}</view>
			<view class="text-area" v-if="value.type === 'TIMTextElem'">{{ value.payload.text }}</view>
			<image class="image" v-if="value.type === 'TIMImageElem'"
						 mode="widthFix"
						 :src="value.payload.imageInfoArray[0].imageUrl"
						 @click.stop="toPreviewImage(value.payload.imageInfoArray[0].imageUrl)"></image>
			<view :class="['audio' , value.isDeleted ? 'play' : '']"
						v-if="value.type === 'TIMSoundElem'"
						@click.stop="playToggle(value,index)">
				{{ value.payload.second + 'S' }}
			</view>
		</view>
		<view class="input-area">
			<view class="iconfont icon-fayuyin"
						@click.stop="audioToggle = !audioToggle"></view>
			<input v-show="!audioToggle" v-model="txt" @confirm="confirm('text')" cursor-spacing="15"
						 class="input" type="text"
						 confirm-type="send">
			<input v-show="audioToggle" value="按住 说话" cursor-spacing="15"
						 class="audio" type="text" disabled
						 @longpress.stop="soundRecording"
						 @touchend="stopRecording">
			<view class="iconfont icon-fatupian" @click.stop="confirm('image')"></view>
		</view>
		<!--		<view class="audio-mask">
					<image class="img" src="/sessionBox/static/record.gif"></image>
				</view>-->
	</view>
</template>

<script setup>
import {reactive,ref} from 'vue';
import {onLoad,onUnload,onPullDownRefresh} from '@dcloudio/uni-app';
import {getMsgList_TIM,sendMessage_TIM,audioStart_TIM,sendAudioMessage_TIM} from '../common/ts/tim';

let reqMessageID = ''
let completed = false
const list = reactive({value: []})

//订阅conversationRender事件渲染页面
uni.$on('conversationRender',(msgList,nextReqMessageID,isCompleted) => {
	list.value = msgList.concat(list.value)
	reqMessageID = nextReqMessageID
	completed = isCompleted
	uni.stopPullDownRefresh()
	list.value.length === 15 && scrollToBottom()
})

//订阅renderMsg事件渲染页面
uni.$on('renderMsg',msg => {
	list.value = list.value.concat(msg)
	scrollToBottom()
})

//聊天区域滑动至底部
const scrollToBottom = () => {
	uni.createSelectorQuery().select(".index").boundingClientRect(data => {
		uni.pageScrollTo({
			duration: 0,
			scrollTop: data.height,
			selector: '.index',
		})
	}).exec()
}

//开始语音录制
const soundRecording = () => audioStart_TIM()
//结束语音录制
const stopRecording = () => sendAudioMessage_TIM(`fusheng`)

//语音文字切换 播放
const audioToggle = ref(false)
const innerAudioContext = uni.createInnerAudioContext()
let timer = null
const playToggle = (obj,index) => {
	if (timer) {
		clearTimeout(timer)
		timer = null
	}
	if (!obj.isDeleted) {
		innerAudioContext.stop()
		clearTimeout(timer)
		timer = null

		innerAudioContext.src = obj.payload.url
		innerAudioContext.play()
		timer = setTimeout(() => obj.isDeleted = false,obj.payload.second * 1000 + 500)
		for (let i = 0; i < list.value.length; i++) {
			if (i === index) {
				list.value[i].isDeleted = true
				continue
			}
			list.value[i].isDeleted = false
		}
	} else {
		innerAudioContext.stop()
		clearTimeout(timer)
		timer = null

		list.value[index].isDeleted = false
	}
}

//文字 图片消息发送
const txt = ref('')
const confirm = (type) => {
	if (type === 'text') {
		if (!txt.value) return
		sendMessage_TIM(`fusheng`,'text',txt.value)
		txt.value = ''
	} else if (type === 'image') {
		sendMessage_TIM(`fusheng`,'image')
	}
	scrollToBottom()
}

//图片全屏
const toPreviewImage = (src) => {
	uni.previewImage({
		urls: [src],
		longPressActions: {
			itemList: ['发送给朋友','保存图片','收藏'],
		},
	})
}

//订阅初始化获取聊天记录
onLoad(() => getMsgList_TIM(`fusheng`))

//页面卸载关闭录音器
onUnload(() => {
	innerAudioContext.stop()
	clearTimeout(timer)
	timer = null
})


//下拉刷新
onPullDownRefresh(() => {
	if (completed) return uni.stopPullDownRefresh()
	getMsgList_TIM(`fusheng`,reqMessageID)
})

</script>

<style lang="scss">
@import "index.scss";
</style>
