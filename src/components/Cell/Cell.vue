<template>
	<view :class="['cell' , props.rightIcon ? 'active' : '']"
				@click="props.url ? jumpLink(props.linkType) : callBack()">
		<view :class="['cell-line' ,
									props.border === 'border' ? 'border' :
									props.border === 'last-border' ? 'lastBorder' :
									props.border === 'no-border' ? '' : '']">
			<view class="left-area">
				<slot name="left"></slot>
				<text v-if="props.leftIcon" :class="['iconfont' , props.leftIcon ? props.leftIcon.toString() : '']"></text>
				<text class="label">{{ props.label }}</text>
			</view>
			<view class="right-area">
				<text v-if="props.value" class="value">{{ props.value }}</text>
				<text v-if="props.rightIcon" class="iconfont"></text>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
interface Props {
	label? : string,
	value? : string,
	leftIcon? : string,
	rightIcon? : boolean,
	border? : string,
	linkType? : string,
	url? : string
}

const props = withDefaults(defineProps<Props>(), {
	label : '',
	value : '',
	leftIcon : '',
	rightIcon : false,
	border : 'border',
	linkType : 'navigateTo',
	url : ''
})

const emit = defineEmits<{
	(e : 'call-back') : void
}>()

const jumpLink = (linkType : string) => {
	if (linkType === 'navigateTo') {
		uni.navigateTo({
			url : props.url
		})
	} else if (linkType === 'redirectTo') {
		uni.redirectTo({
			url : props.url
		})
	} else if (linkType === 'switchTab') {
		uni.switchTab({
			url : props.url
		})
	} else if (linkType === 'reLaunch') {
		uni.reLaunch({
			url : props.url
		})
	}
}

const callBack = () => emit('call-back')
</script>

<style lang="scss" scoped>
.cell {
	width: 100%;
	padding: 0 vw(24);
	font-size: vw(28);
	background-color: #ffffff;
	.cell-line {
		min-height: vw(70);
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left-area {
			width: 45%;
			display: flex;
			align-items: center;
			margin: 0 vw(20) 0 0;
			.label {
				font-size: vw(28);
				color: #666;
			}
			.iconfont {
				font-size: vw(36);
				color: #999;
				margin: 0 vw(10) 0 0;
			}
		}
		.right-area {
			flex: 1;
			line-height: 1.5;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.value {
				font-size: vw(28);
				color: #999;
				text-align: right;
			}
			.iconfont {
				width: vw(28);
				height: vw(28);
				background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M700.075 485.675L376.533 162.133a37.248 37.248 0 1 0-52.65 52.651L621.099 512 323.883 809.216a37.248 37.248 0 0 0 52.65 52.65l323.542-323.54a37.248 37.248 0 0 0 0-52.651z' fill='%23999'/%3E%3C/svg%3E");
				background-repeat: no-repeat;
				background-size: 100% 100%;
				margin: 0 0 0 vw(10);
			}
		}
		&.border {
			min-height: vw(90);
			border-bottom: 1px solid #e1e1e1;
		}
		&.lastBorder {
			min-height: vw(90);
		}
	}
	&.active:active {
		background-color: #f2f3f5;
	}
}
</style>
