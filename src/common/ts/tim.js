import TIM from "tim-wx-sdk";
import TIMUploadPlugin from "tim-upload-plugin";
import TIMProfanityFilterPlugin from "tim-profanity-filter-plugin";
import {getUserSig} from "../api/login";

//全局录音器
const recorderManager = uni.getRecorderManager()
const recordOptions = {
	duration: 60 * 1000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
	sampleRate: 44100, // 采样率
	numberOfChannels: 1, // 录音通道数
	encodeBitRate: 192000, // 编码码率
	format: 'aac', // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和Web）互通
}
recorderManager.onError(errMsg => {})


let tim = null

function init_TIM() { //初始化im实时聊天
	if (uni.isInit) return console.log('im实例已创建')  //这里设置了一个全局变量isLogin来标记是否已登录,避免重复创建im实例

	let options = {
		SDKAppID: 1400631896, //接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
	}

	//创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
	tim = TIM.create(options) //SDK 实例通常用 tim 表示
	//设置SDK日志输出级别，详细分级请参见 setLogLevel 接口的说明
	tim.setLogLevel(1) //普通级别，日志量较多，接入时建议使用
	//tim.setLogLevel(1) // release 级别，SDK 输出关键信息，生产环境时建议使用
	// 注册腾讯云即时通信 IM 上传插件
	tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin})
	// 注册腾讯云即时通信 IM 本地审核插件
	tim.registerPlugin({'tim-profanity-filter-plugin': TIMProfanityFilterPlugin})

	// 监听事件
	tim.on(TIM.EVENT.SDK_READY,SDK_READY)
	tim.on(TIM.EVENT.MESSAGE_RECEIVED,MESSAGE_RECEIVED)
	tim.on(TIM.EVENT.MESSAGE_REVOKED,MESSAGE_REVOKED)
	tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER,MESSAGE_READ_BY_PEER)
	tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED,CONVERSATION_LIST_UPDATED)
	tim.on(TIM.EVENT.GROUP_LIST_UPDATED,GROUP_LIST_UPDATED)
	tim.on(TIM.EVENT.PROFILE_UPDATED,PROFILE_UPDATED)
	tim.on(TIM.EVENT.BLACKLIST_UPDATED,BLACKLIST_UPDATED)
	tim.on(TIM.EVENT.ERROR,ERROR)
	tim.on(TIM.EVENT.SDK_NOT_READY,SDK_NOT_READY)
	tim.on(TIM.EVENT.KICKED_OUT,KICKED_OUT)
	tim.on(TIM.EVENT.NET_STATE_CHANGE,NET_STATE_CHANGE)

	uni.isInit = true  //完成im实例创建后设置标志为true
	console.log('im初始化完成')
}

function SDK_READY(event) {
	/*tim.updateMyProfile({nick: `牧野`}).then(() => {
	 console.log('更新资料成功')
	 }).catch(err2 => {
	 // 更新资料失败的相关信息
	 console.warn('updateMyProfile error:',err2)
	 })*/
	// 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
	// event.name - TIM.EVENT.SDK_READY
}

function MESSAGE_RECEIVED(event) {
	setGlobalMsg(event,'received')
	// 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
	// event.name - TIM.EVENT.MESSAGE_RECEIVED
	// event.data - 存储 Message 对象的数组 - [Message]
}

function MESSAGE_REVOKED(event) {
	// 收到消息被撤回的通知
	// event.name - TIM.EVENT.MESSAGE_REVOKED
	// event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
}

function MESSAGE_READ_BY_PEER(event) {
	// SDK 收到对端已读消息的通知，即已读回执。使用前需要将 SDK 版本升级至 v2.7.0 或以上。仅支持单聊会话。
	// event.name - TIM.EVENT.MESSAGE_READ_BY_PEER
	// event.data - event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
}

function CONVERSATION_LIST_UPDATED(event) {
	// 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
	// event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
	// event.data - 存储 Conversation 对象的数组 - [Conversation]
}

function GROUP_LIST_UPDATED(event) {
	// 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
	// event.name - TIM.EVENT.GROUP_LIST_UPDATED
	// event.data - 存储 Group 对象的数组 - [Group]
}

function PROFILE_UPDATED(event) {
	// 收到自己或好友的资料变更通知
	// event.name - TIM.EVENT.PROFILE_UPDATED
	// event.data - 存储 Profile 对象的数组 - [Profile]
}

function BLACKLIST_UPDATED(event) {
	// 收到黑名单列表更新通知
	// event.name - TIM.EVENT.BLACKLIST_UPDATED
	// event.data - 存储 userID 的数组 - [userID]
}

function ERROR(event) {
	// 收到 SDK 发生错误通知，可以获取错误码和错误信息
	// event.name - TIM.EVENT.ERROR
	// event.data.code - 错误码
	// event.data.message - 错误信息
}

function SDK_NOT_READY(event) {
	// 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
	// event.name - TIM.EVENT.SDK_NOT_READY
}

function KICKED_OUT(event) {
	// 收到被踢下线通知
	// event.name - TIM.EVENT.KICKED_OUT
	// event.data.type - 被踢下线的原因，例如:
	//    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
	//    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
	//    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢 （v2.4.0起支持）。
}

function NET_STATE_CHANGE(event) {
	//  网络状态发生改变（v2.5.0 起支持）。
	// event.name - TIM.EVENT.NET_STATE_CHANGE
	// event.data.state 当前网络状态，枚举值及说明如下：
	//     \- TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
	//     \- TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
	//    \- TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
}


/**
 * 外部调用
 * */

//登录
function login_TIM(userID) {
	getUserSig(Object.assign({},{userid: userID})).then(res0 => {
		tim.login({userID: userID,userSig: res0.data.userSig}).then(res1 => {
			uni.setStorageSync('userSig',res0.data.userSig)
			console.log('登录成功')
			if (res1.data.repeatLogin) {
				// 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
				console.log('当前重复登录')
			}
		}).catch(err1 => {
			// 登录失败的相关信息
			console.warn('login error:',err1)
		})
	})
}

//发送图片文字信息
function sendMessage_TIM(to,type,msg) {
	if (type === 'text') {
		let message = tim.createTextMessage({
			to: to,
			conversationType: TIM.TYPES.CONV_C2C,
			payload: {
				text: msg,
			},
		})
		tim.sendMessage(message).then(res => {
			setGlobalMsg(res,'send')
		}).catch(err => {
			console.log('发送失败')
		})
	} else if (type === 'image') {
		uni.chooseMedia({
			count: 1,
			mediaType: ['image'], // 图片
			sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], // 从相册选择
			success: res => {
				let message = tim.createImageMessage({
					to: to,
					conversationType: TIM.TYPES.CONV_C2C,
					payload: {
						file: res,
					},
					//onProgress: function (event) { console.log('file uploading:',event) },
				})
				tim.sendMessage(message).then(res => {
					setGlobalMsg(res,'send')
				}).catch(err => {
					console.log('发送失败')
				})
			},
		})
	}
}

//发送语音信息
function sendAudioMessage_TIM(to) {
	recorderManager.stop()
	recorderManager.onStop(res => {
		// 4. 创建消息实例，接口返回的实例可以上屏
		let message = tim.createAudioMessage({
			to: to,
			conversationType: TIM.TYPES.CONV_C2C,
			// 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
			// 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
			// priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
			payload: {
				file: res,
			},
			// 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
			// cloudCustomData: 'your cloud custom data'
		})
		// 5. 发送消息
		tim.sendMessage(message).then(res => {
			setGlobalMsg(res,'send')
		}).catch(err => {
			console.log('发送失败')
		})
	})
}

//录音开始
function audioStart_TIM() {
	recorderManager.start()
}

//获取历史对话记录
function getMsgList_TIM(userID,nextReqMessageID) {
	tim.getMessageList({conversationID: 'C2C' + userID,nextReqMessageID}).then(res => {
		const messageList = res.data.messageList // 消息列表。
		const nextReqMessageID = res.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
		const isCompleted = res.data.isCompleted // 表示是否已经拉完所有消息。
		/*let msgarr = uni.MSG || {}
		 if (msgarr && msgarr[userID] !== undefined) {
		 msgarr[userID] = messageList.concat(msgarr[userID])
		 } else {
		 msgarr[userID] = messageList
		 }
		 uni.MSG = msgarr*/
		// 发布'renderMsg'通知页面进行对话列表初始化渲染
		uni.$emit('conversationRender',messageList,nextReqMessageID,isCompleted)
	})
}

//处理数据的方法
function setGlobalMsg(data,type) {
	let msgarr = uni.MSG || {},newMsgForm = ''

	if (type === 'received') {
		/*newMsgForm = data.data[0].from
		 if (msgarr && msgarr[newMsgForm] !== undefined) {
		 msgarr[newMsgForm].push(data.data[0])
		 } else {
		 msgarr[newMsgForm] = [data.data[0]]
		 }
		 uni.MSG = msgarr*/
		uni.$emit('renderMsg',data.data[0])
	} else if (type === 'send') {
		/*newMsgForm = data.data.message.to
		 if (msgarr && msgarr[newMsgForm] !== undefined) {
		 msgarr[newMsgForm].push(data.data.message)
		 } else {
		 msgarr[newMsgForm] = [data.data.message]
		 }
		 uni.MSG = msgarr*/
		uni.$emit('renderMsg',data.data.message)
	}
}

//登出
function logout_TIM() {
	let promise = tim.logout()
	promise.then(function (imResponse) {
		console.log(imResponse.data)
	}).catch(function (imError) {
		console.warn('logout error:',imError)
	})
}

export {init_TIM,login_TIM,logout_TIM,sendMessage_TIM,audioStart_TIM,sendAudioMessage_TIM,getMsgList_TIM}
