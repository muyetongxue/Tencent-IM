<template>
	<view class="base-list">
		<PersonInfo v-if="props.showTitle" :color="props.color" :show-org="props.showOrg"
								@callBack="changeInfo"></PersonInfo>
		<view class="space"></view>
		<uni-segmented-control v-if="props.showTab"
													 :activeColor="props.color"
													 :current="current"
													 :values="props.tabs"
													 styleType="text"
													 @clickItem="clickItem">
		</uni-segmented-control>
		<view class="base-list-content">
			<slot name="content"></slot>
			<view class="load-data">没有更多数据了</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import {onPullDownRefresh, onReachBottom} from "@dcloudio/uni-app"
import {ref} from "vue"

interface Props {
	showTitle? : boolean,
	showOrg? : boolean,
	showTab? : boolean,
	tabs? : string[],
	color? : string
}

const props = withDefaults(defineProps<Props>(), {
	showTitle : false,
	showOrg : false,
	showTab : false,
	tabs : () => ([]),
	color : '#0E75FC'
})

const emit = defineEmits<{
	(event : 'change-info', perInfo : any, orgInfo : any) : void
	(event : 'change-tabs', num : number) : void
	(event : 'onPullDown-refresh') : void
	(event : 'onReach-bottom') : void
}>()

const current = ref(0)

const changeInfo = (perInfo : any, orgInfo : any) => emit('change-info', perInfo, orgInfo)

const clickItem = (event : any) => {
	if (current.value !== event.currentIndex) current.value = event.currentIndex
	emit('change-tabs', event.currentIndex)
}

onPullDownRefresh(() => emit('onPullDown-refresh'))

onReachBottom(() => emit('onReach-bottom'))
</script>

<style lang="scss" scoped>
.base-list {
	width: 100vw;
	min-height: 100vh;
	padding: vw(24);
	background-color: #ffffff;
	.space {
		height: vw(20);
	}
	.base-list-content {
		.load-data {
			position: relative;
			width: 100%;
			height: vw(106);
			line-height: vw(106);
			color: #999999;
			text-align: center;
			&:before {
				content: "";
				position: absolute;
				left: 5%;
				top: 49%;
				width: 30%;
				height: 1px;
				background-color: transparent;
				border-top: 1px dashed #999999;
			}
			&:after {
				content: "";
				position: absolute;
				right: 5%;
				top: 49%;
				width: 30%;
				height: 1px;
				background-color: transparent;
				border-top: 1px dashed #999999;
			}
		}
	}
}
</style>
