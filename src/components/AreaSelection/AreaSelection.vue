<template>
	<view v-show="props.show" class="area-selection">
		<view :class="['content' , props.show ? 'show' : '']">
			<view class="subtitle">
				<button size="mini" style="margin: 0" @click="close">取消</button>
				<button size="mini" style="margin: 0" type="default" @click="sure">确定</button>
			</view>
			<!-- #ifdef H5 -->
			<picker-view class="picker" @change="areaChange0">
				<picker-view-column>
					<view class="column">{{ props.topArea.areaName }}</view>
				</picker-view-column>
				<picker-view-column>
					<view v-for="(value,index) in areaList0.value"
								:key="index"
								class="column">{{ value.name }}
					</view>
				</picker-view-column>
				<picker-view-column>
					<view v-for="(value,index) in areaList1.value"
								:key="index"
								class="column">{{ value.name }}
					</view>
				</picker-view-column>
			</picker-view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<picker-view class="picker" @change="areaChange1">
				<picker-view-column>
					<view class="column">{{ props.topArea.areaName }}</view>
				</picker-view-column>
				<picker-view-column>
					<view v-for="(value,index) in areaList0.value"
								:key="index"
								class="column">{{ value.name }}
					</view>
				</picker-view-column>
				<picker-view-column>
					<view v-for="(value,index) in areaList1.value"
								:key="index"
								class="column">{{ value.name }}
					</view>
				</picker-view-column>
			</picker-view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<picker-view class="picker" @change="areaChange2">
				<picker-view-column>
					<view class="column">{{ props.topArea.areaName }}</view>
				</picker-view-column>
				<picker-view-column>
					<view v-for="(value,index) in areaList0.value"
								:key="index"
								class="column">{{ value.name }}
					</view>
				</picker-view-column>
				<picker-view-column>
					<view v-for="(value,index) in areaList1.value"
								:key="index"
								class="column">{{ value.name }}
					</view>
				</picker-view-column>
			</picker-view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script lang="ts" setup>
import {onMounted, reactive} from "vue"
import {sysarealist} from '../../common/api'

const areaList0 : any = reactive({value : []})
const areaList1 : any = reactive({value : []})
let areaCode0 : string
let areaCode1 : string
let obj : object

interface Props {
	show : boolean
	topArea : any
}

const props = withDefaults(defineProps<Props>(), {
	show : false,
	topArea : () => ({
		areaName : '',
		areaCode : '',
	}),
})

const emit = defineEmits<{
	(e : 'close') : void
	(e : 'sure', obj : object | any) : void
}>()

onMounted(() => init())

const init = async () => {
	const res0 : any = await sysarealist(Object.assign({}, {
		parentCode : props.topArea.areaCode,
	}))
	areaList0.value = res0.data
	areaCode0 = res0.data[0].areaCode

	const res1 : any = await sysarealist(Object.assign({}, {
		parentCode : areaCode0,
	}))
	areaList1.value = res1.data
	areaCode1 = res1.data[0].areaCode

	obj = Object.assign({}, {
		areaName : `${props.topArea.areaName}-${areaList0.value[0].name}-${areaList1.value[0].name}`,
		areaCode : areaCode1,
	})
}

//#ifdef H5
const areaChange0 = (event : any) => {
	if (!event.detail.value[1]) {
		return obj = Object.assign({}, {
			areaName : `${props.topArea.areaName}-${areaList0.value[0].name}-${areaList1.value[event.detail.value[2]].name}`,
			areaCode : areaCode1,
		})
	}

	if (areaList0.value[event.detail.value[1]].areaCode !== areaCode0) {
		areaCode0 = areaList0.value[event.detail.value[1]].areaCode
		sysarealist(Object.assign({}, {
			parentCode : areaCode0,
		})).then((res : any) => {
			if (res.code === 0 && res.data.length !== 0) {
				areaList1.value = res.data
				areaCode1 = res.data[0].areaCode
			} else {
				areaList1.value = []
				areaCode1 = areaCode0
			}
			if (event.detail.value.length === 2) {
				obj = Object.assign({}, {
					areaName : `${props.topArea.areaName}-${areaList0.value[event.detail.value[1]].name}-${areaList1.value[0].name}`,
					areaCode : areaCode1,
				})
			} else {
				obj = Object.assign({}, {
					areaName : `${props.topArea.areaName}-${areaList0.value[event.detail.value[1]].name}${areaList1.value.length !== 0 ? '-' + areaList1.value[event.detail.value[2]].name : ''}`,
					areaCode : areaCode1,
				})
			}
		})
	} else {
		obj = Object.assign({}, {
			areaName : `${props.topArea.areaName}-${areaList0.value[event.detail.value[1]].name}-${areaList1.value[event.detail.value[2]].name}`,
			areaCode : areaList1.value[event.detail.value[2]].areaCode,
		})
	}
}
//#endif

//#ifdef MP-WEIXIN
const areaChange1 = (event : any) => {
	if (areaList0.value[event.detail.value[1]].areaCode !== areaCode0) {
		areaCode0 = areaList0.value[event.detail.value[1]].areaCode
		sysarealist(Object.assign({}, {
			parentCode : areaCode0,
		})).then((res : any) => {
			if (res.code === 0 && res.data.length !== 0) {
				areaList1.value = res.data
				areaCode1 = res.data[0].areaCode
			} else {
				areaList1.value = []
				areaCode1 = areaCode0
			}
			obj = Object.assign({}, {
				areaName : `${props.topArea.areaName}-${areaList0.value[event.detail.value[1]].name}${areaList1.value.length !== 0 ? '-' + areaList1.value[event.detail.value[2]].name : ''}`,
				areaCode : areaCode1,
			})
		})
	} else {
		obj = Object.assign({}, {
			areaName : `${props.topArea.areaName}-${areaList0.value[event.detail.value[1]].name}-${areaList1.value[event.detail.value[2]].name}`,
			areaCode : areaList1.value[event.detail.value[2]].areaCode,
		})
	}
}
//#endif

//#ifdef APP-PLUS
const areaChange2 = (event : any) => {
	if (event.detail.value[1] !== null) {
		areaCode0 = areaList0.value[event.detail.value[1]].areaCode
		sysarealist(Object.assign({}, {
			parentCode : areaCode0,
		})).then((res : any) => {
			if (res.code === 0 && res.data.length !== 0) {
				areaList1.value = res.data
				areaCode1 = res.data[0].areaCode
			} else {
				areaList1.value = []
				areaCode1 = areaCode0
			}
			obj = Object.assign({}, {
				areaName : `${props.topArea.areaName}-${areaList0.value[event.detail.value[1]].name}${areaList1.value.length !== 0 ? '-' + areaList1.value[event.detail.value[2]].name : ''}`,
				areaCode : areaCode1,
			})
		})
	}
}
//#endif

const close = () => {
	emit('close')
}

const sure = () => {
	emit('sure', obj)
	close()
}
</script>

<style lang="scss" scoped>
.area-selection {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, .3);
	.content {
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 1000;
		width: 100%;
		height: 40%;
		margin: 0;
		background-color: #ffffff;
		.subtitle {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			padding: vw(20);
			border-bottom: vw(2) solid #e1e1e1;
		}
		.picker {
			width: 100%;
			height: 100%;
			.column {
				font-size: vw(32);
				color: #333333;
				line-height: 34px;
				text-align: center;
			}
		}
		&.show {
			animation: showModal .4s;
		}
	}
}

@keyframes showModal {
	from {
		bottom: -50%;
	}
	to {
		bottom: 0;
	}
}
</style>
