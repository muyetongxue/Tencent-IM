<template>
	<view class="index">
		<view class="player-container" v-for="item in playerList" :key="item.streamID">
			<live-player v-if="item.src && (item.hasVideo || item.hasAudio)" class="player" :id="item.streamID"
									 :data-userid="item.userID" :data-streamid="item.streamID" :data-streamtype="item.streamType"
									 :src="item.src"
									 mode="RTC" :autoplay="item.autoplay" :mute-audio="item.muteAudio" :mute-video="item.muteVideo"
									 :orientation="item.orientation" :object-fit="item.objectFit"
									 :background-mute="item.enableBackgroundMute"
									 :min-cache="item.minCache" :max-cache="item.maxCache" :sound-mode="item.soundMode"
									 :enable-recv-message="item.enableRecvMessage" :auto-pause-if-navigate="item.autoPauseIfNavigate"
									 :auto-pause-if-open-native="item.autoPauseIfOpenNative" :debug="debug"
									 picture-in-picture-mode="pop"
									 @statechange="_playerStateChange"
									 @fullscreenchange="_playerFullscreenChange" @netstatus="_playerNetStatus"
									 @audiovolumenotify="_playerAudioVolumeNotify"/>
		</view>
		<view :class="['pusher-container',pusherClass]">
			<live-pusher class="pusher" :url="pusher.url" :mode="pusher.mode" :autopush="pusher.autopush"
									 :enable-camera="pusher.enableCamera" :enable-mic="pusher.enableMic" :muted="!pusher.enableMic"
									 :enable-agc="pusher.enableAgc" :enable-ans="pusher.enableAns"
									 :enable-ear-monitor="pusher.enableEarMonitor"
									 :auto-focus="pusher.enableAutoFocus" :zoom="pusher.enableZoom" :min-bitrate="pusher.minBitrate"
									 :max-bitrate="pusher.maxBitrate" :video-width="pusher.videoWidth" :video-height="pusher.videoHeight"
									 :beauty="pusher.beautyLevel" :whiteness="pusher.whitenessLevel"
									 :orientation="pusher.videoOrientation"
									 :aspect="pusher.videoAspect" :device-position="pusher.frontCamera"
									 :remote-mirror="pusher.enableRemoteMirror"
									 :local-mirror="pusher.localMirror" :background-mute="pusher.enableBackgroundMute"
									 :audio-quality="pusher.audioQuality" :audio-volume-type="pusher.audioVolumeType"
									 :audio-reverb-type="pusher.audioReverbType" :waiting-image="pusher.waitingImage" :debug="debug"
									 picture-in-picture-mode="pop"
									 @statechange="_pusherStateChangeHandler" @netstatus="_pusherNetStatusHandler"
									 @error="_pusherErrorHandler"
									 @bgmstart="_pusherBGMStartHandler" @bgmprogress="_pusherBGMProgressHandler"
									 @bgmcomplete="_pusherBGMCompleteHandler" @audiovolumenotify="_pusherAudioVolumeNotify"/>
			<view class="loading" v-if="playerList.length === 0">
				<image class="loading-img" src="/videoCall/static/loading.png"></image>
				<view class="loading-text">???????????????...</view>
			</view>
			<!--			<view class="oncall" v-if="playerList.length !== 0">
							<view class="oncall-text">??????????????????????????????</view>
						</view>-->
		</view>
		<view class="bottom-btns">
			<!--			????????? ????????????????????????-->
			<view class="btn-item" v-if="obj.type === '??????'" @click="pusherCameraHandler">
				<view :class="['camera-switch' , pusher.enableCamera ? 'open' : 'close']"></view>
				<view class="desc-txt">
					{{ pusher.enableCamera ? '???????????????' : '???????????????' }}
				</view>
			</view>
			<!--			??????????????? ????????????????????????-->
			<view class="btn-item" v-if="obj.type === '??????'" @click="pusherAudioHandler">
				<view :class="['microphone-switch' , pusher.enableMic ? 'open' : 'close']"></view>
				<view class="desc-txt">
					{{ pusher.enableMic ? '???????????????' : '???????????????' }}
				</view>
			</view>
			<!--			???????????????????????? ????????????????????????-->
			<view class="btn-item" v-if="obj.type === '??????'" @click="pusherSwitchCamera">
				<view class="camera-flip"></view>
				<view class="desc-txt">???????????????</view>
			</view>
			<!--			??????????????? ????????????????????????-->
			<view class="btn-item" v-if="obj.type === '??????'" @click="soundModeChange">
				<view
					:class="['soundmode-change' , soundMode === 'speaker' ? 'open' : soundMode === 'ear' ? 'close' : '']"></view>
				<view class="desc-txt">
					{{ soundMode === 'speaker' ? '???????????????' : soundMode === 'ear' ? '???????????????' : '' }}
				</view>
			</view>
			<!--			????????? ??????????????????-->
			<view class="btn-item" @click="">
				<view class="prescription"></view>
				<view class="desc-txt">????????????</view>
			</view>
			<!--			???????????? ??????????????????-->
			<!--			<view class="btn-normal" @click="pusherBeautyHandler">
							<image class="btn-image" :src="getStaticImage(`${pusher.beautyLevel === 9 ? 'beauty-true' : 'beauty-false'}`)">
							</image>
						</view>-->
		</view>
		<view class="hang-up" @click="hangup"></view>
	</view>
</template>

<script>
import TRTC from "trtc-wx-sdk";

export default {
	data() {
		return {
			pusher: {},
			playerList: [],
			debug: '',
			soundMode: 'speaker',
			obj: {},
		}
	},

	computed: {
		pusherClass() {
			// ???uni-app??????bug?????????????????????????????? https://github.com/dcloudio/uni-app/issues/1033
			return this.playerList.length > 0 ? '' : 'fullscreen'
		},
	},

	onLoad(options) {
		this.obj = JSON.parse(decodeURIComponent(options.obj))
		this.TRTC = new TRTC(this)
		this.pusher = this.TRTC.createPusher()
		this.bindTRTCRoomEvent()
		this.enterRoom()
	},

	onUnload() {
		this.exitRoom()
	},

	methods: {
		enterRoom() {
			this.pusher = this.TRTC.enterRoom({
				userID: this.obj.userID,
				sdkAppID: this.obj.sdkAppID,
				userSig: this.obj.userSig,
				roomID: '',
				strRoomID: this.obj.strRoomID,
				enableCamera: this.obj.enableCamera === '??????' ? true : this.obj.enableCamera === '??????' ? false : '',
				enableMic: this.obj.enableMic,
				beautyLevel: this.obj.beautyLevel,
			})
			this.TRTC.getPusherInstance().start() // ???????????????autoPush????????????????????????
		},

		exitRoom() {
			const {pusher,playerList} = this.TRTC.exitRoom()
			this.pusher = pusher
			this.playerList = playerList
		},

		pusherAudioHandler() {
			this.setPusherAttributesHandler({
				enableMic: !this.pusher.enableMic,
			})
			this.$forceUpdate()
		},

		pusherCameraHandler() {
			this.setPusherAttributesHandler({
				enableCamera: !this.pusher.enableCamera,
			})
			this.$forceUpdate()
		},

		//????????????
		pusherBeautyHandler() {
			const beautyLevel = this.pusher.beautyLevel === 0 ? 9 : 0
			this.setPusherAttributesHandler({
				beautyLevel,
			})
		},

		mutePlayerHandle(key,player) {
			this.setPlayerAttributesHandler(player,{
				[key]: !player[key],
			})
		},

		hangup() {
			this.exitRoom()
			uni.navigateBack()
		},

		//???????????????
		soundModeChange() {
			if (this.playerList.length === 0) return
			const players = this.TRTC.getPlayerList()
			players.forEach((player) => {
				this.setPlayerAttributesHandler(player,{
					soundMode: this.soundMode = this.soundMode === 'speaker' ? 'ear' : this.soundMode === 'ear' ? 'speaker' : '',
				})
			})
			this.$forceUpdate()
		},

		//????????????????????????
		pusherSwitchCamera() {
			const frontCamera = this.pusher.frontCamera === 'front' ? 'back' : 'front'
			this.TRTC.getPusherInstance().switchCamera(frontCamera)
		},
		// ?????? pusher ??????
		setPusherAttributesHandler(options) {
			this.pusher = this.TRTC.setPusherAttributes(options)
		},
		// ???????????? player ??????
		setPlayerAttributesHandler(player,options) {
			this.playerList = this.TRTC.setPlayerAttributes(player.streamID,options)
		},
		// ????????????
		bindTRTCRoomEvent() {
			// ?????????????????????
			const TRTC_EVENT = this.TRTC.EVENT
			// ???????????????????????????????????????????????????????????????????????????
			this.TRTC.on(TRTC_EVENT.LOCAL_JOIN,(event) => {
				console.log('* room LOCAL_JOIN',event)

				this.setPusherAttributesHandler({
					enableCamera: this.obj.type === '??????' ? true : this.obj.type === '??????' ? false : '',
				})
				this.setPusherAttributesHandler({
					enableMic: true,
				})
			})

			this.TRTC.on(TRTC_EVENT.LOCAL_LEAVE,(event) => console.log('* room LOCAL_LEAVE',event))

			this.TRTC.on(TRTC_EVENT.ERROR,(event) => console.log('* room ERROR',event))

			// ??????????????????
			this.TRTC.on(TRTC_EVENT.REMOTE_USER_LEAVE,(event) => {
				console.log('* room REMOTE_USER_LEAVE',event)
				const {playerList} = event.data
				this.playerList = playerList
				this.hangup()
			})

			// ????????????????????????
			this.TRTC.on(TRTC_EVENT.REMOTE_VIDEO_ADD,(event) => {
				console.log('* room REMOTE_VIDEO_ADD',event)
				// ??????????????????????????????????????????????????????
				const {player} = event.data

				this.setPlayerAttributesHandler(player,{
					muteVideo: false,
				})
			})

			// ??????????????????????????????
			this.TRTC.on(TRTC_EVENT.REMOTE_VIDEO_REMOVE,(event) => {
				console.log('* room REMOTE_VIDEO_REMOVE',event)
				const {player} = event.data
				this.setPlayerAttributesHandler(player,{
					muteVideo: true,
				})
			})

			// ????????????????????????
			this.TRTC.on(TRTC_EVENT.REMOTE_AUDIO_ADD,(event) => {
				console.log('* room REMOTE_AUDIO_ADD',event)
				const {player} = event.data
				this.setPlayerAttributesHandler(player,{
					muteAudio: false,
				})
			})

			// ??????????????????????????????
			this.TRTC.on(TRTC_EVENT.REMOTE_AUDIO_REMOVE,(event) => {
				console.log('* room REMOTE_AUDIO_REMOVE',event)
				const {player} = event.data
				this.setPlayerAttributesHandler(player,{
					muteAudio: true,
				})
			})
		},

		// ???????????? wxml ??????????????????????????????
		_pusherStateChangeHandler(event) {
			this.TRTC.pusherEventHandler(event)
		},

		_pusherNetStatusHandler(event) {
			this.TRTC.pusherNetStatusHandler(event)
		},

		_pusherErrorHandler(event) {
			this.TRTC.pusherErrorHandler(event)
		},

		_pusherBGMStartHandler(event) {
			this.TRTC.pusherBGMStartHandler(event)
		},

		_pusherBGMProgressHandler(event) {
			this.TRTC.pusherBGMProgressHandler(event)
		},

		_pusherBGMCompleteHandler(event) {
			this.TRTC.pusherBGMCompleteHandler(event)
		},

		_pusherAudioVolumeNotify(event) {
			this.TRTC.pusherAudioVolumeNotify(event)
		},

		_playerStateChange(event) {
			this.TRTC.playerEventHandler(event)
		},

		_playerFullscreenChange(event) {
			this.TRTC.playerFullscreenChange(event)
		},

		_playerNetStatus(event) {
			this.TRTC.playerNetStatus(event)
		},

		_playerAudioVolumeNotify(event) {
			this.TRTC.playerAudioVolumeNotify(event)
		},
	},
}
</script>
<style lang="scss">
@import "index.scss";
</style>
