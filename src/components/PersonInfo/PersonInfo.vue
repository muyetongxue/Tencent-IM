<template>
	<view class="person-info">
		<view class="top-area">
			<view
				:class="['user-avatarUrl' , perInfo.value.sex === '男' ? 'nan' : perInfo.value.sex === '女' ? 'nv' : '']"></view>
			<view class="info">
				<view class="name">{{ perInfo.value.patientName }}</view>
				<view class="age">{{ perInfo.value.sex }}</view>
			</view>
			<view :style="styleObject" class="per-change-area">
				<view class="per-change">
					<picker :range="actions0"
									:range-key="'patientName'"
									@change="perSelect">
						<text class="txt">切换用户</text>
					</picker>
				</view>
			</view>
		</view>
		<view v-if="props.showOrg" :style="styleObject" class="org-change">
			<picker :range="actions1"
							:range-key="'orgname'"
							@change="orgSelect">
				<text class="txt">当前机构：{{ Object.values(orgInfo.value).length > 0 ? orgInfo.value.orgname : '' }}</text>
				<text class="iconfont"></text>
			</picker>
		</view>
	</view>
</template>

<script lang="ts" setup>
import {onMounted, reactive, toRaw} from "vue";
import {getHospitalInfo} from "../../common/api";
import utils from "../../common/ts/utils";

interface Props {
	color? : string,
	perIndex? : number,
	showOrg? : boolean
}

const props = withDefaults(defineProps<Props>(), {
	color : '#0E75FC',
	perIndex : 0,
	showOrg : false,
})

let index0 = props.perIndex ? props.perIndex : 0
let actions0 : any = reactive(uni.getStorageSync('cardList'))

let index1 = 0
let actions1 : any = reactive({value : []})

const perInfo : any = reactive({value : {}})
const orgInfo : any = reactive({value : {}})


const emit = defineEmits<{
	(e : 'call-back', perInfo : any, orgInfo : any) : void
}>()

const styleObject = reactive({'--color' : props.color})

onMounted(() => init())

const init = async () => {
	//用户
	perInfo.value = Object.assign({}, actions0[index0])

	//机构
	if (props.showOrg) {
		let res = await getHospitalInfo(Object.assign({}, {areacode : utils.bodyParams.req_data.vercode}))
		if (res.code === '200') {
			actions1 = res.baseinfo
			orgInfo.value = Object.assign({}, actions1[index1])
		}
	}
	emit('call-back', toRaw(actions0[index0]), toRaw(actions1[index1]))
}

//人员切换
const perSelect = (event : { detail : { value : number } }) => {
	index0 = event.detail.value * 1
	perInfo.value = Object.assign({}, actions0[index0])
	emit('call-back', toRaw(actions0[index0]), toRaw(actions1[index1]))
}

//机构切换
const orgSelect = (event : { detail : { value : number } }) => {
	index1 = event.detail.value * 1
	orgInfo.value = Object.assign({}, actions1[index1])
	emit('call-back', toRaw(actions0[index0]), toRaw(actions1[index1]))
}
</script>

<style lang="scss" scoped>
.person-info {
	width: 100%;
	padding: vw(40) vw(20);
	background-color: #ffffff;
	box-shadow: 0 0 vw(12) rgba(61, 156, 253, 0.26);
	border-radius: vw(20);
	.top-area {
		display: flex;
		align-items: center;
		.user-avatarUrl {
			width: vw(80);
			height: vw(80);
			margin: 0 vw(20) 0 0;
			background-repeat: no-repeat;
			background-position: 0 0;
			background-size: 100% 100%;
			&.nan {
				background-image: url("./nan@3x.png");
			}
			&.nv {
				background-image: url("./nv@3x.png");
			}
		}
		.info {
			height: vw(80);
			display: flex;
			flex-flow: column nowrap;
			justify-content: space-between;
			.name {
				font-size: vw(30);
				font-weight: bold;
				color: #333333;
			}
			.age {
				font-size: vw(24);
				color: #555555;
			}
		}
		.per-change-area {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.per-change {
				display: flex;
				align-items: center;
				padding: vw(5) vw(20);
				color: #ffffff;
				background-color: var(--color);
				border-radius: vw(18);
				.txt {
					font-size: vw(22);
				}
			}
		}
	}
	.org-change {
		position: relative;
		width: 100%;
		height: vw(70);
		line-height: vw(70);
		color: #ffffff;
		text-align: center;
		background-color: var(--color);
		border-radius: vw(35);
		margin: vw(40) 0 0 0;
		.txt {
			font-size: vw(24);
		}
		.iconfont {
			position: absolute;
			top: 50%;
			right: 3%;
			transform: translate(0, -50%);
			width: vw(32);
			height: vw(32);
			background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M700.075 485.675L376.533 162.133a37.248 37.248 0 1 0-52.65 52.651L621.099 512 323.883 809.216a37.248 37.248 0 0 0 52.65 52.65l323.542-323.54a37.248 37.248 0 0 0 0-52.651z' fill='%23fff'/%3E%3C/svg%3E");
			background-repeat: no-repeat;
			background-size: 100% 100%;
		}
	}
}
</style>
