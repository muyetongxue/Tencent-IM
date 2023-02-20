<template>
	<view :style="{backgroundColor: props.backgroundColor,height: props.height + 'vh'}" class="no-record"
				@catchtouchmove="false">
		<view class="msg-content">
			<slot>暂无数据</slot>
		</view>
	</view>
</template>

<script lang="ts" setup>
interface Props {
	backgroundColor? : string
	height? : string | number
}

const props = withDefaults(defineProps<Props>(), {
	backgroundColor : '#ffffff',
	height : 100
})
</script>

<style lang="scss" scoped>
.no-record {
	width: 100%;
	position: relative;
	overflow: hidden;
	animation: fadeIn .3s;
	.msg-content {
		position: absolute;
		top: 50%;
		right: 0;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: vw(280);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		font-size: vw(30);
		color: #999999;
		background: url("./wu_gray_icon@3x.png") no-repeat center 0 / vw(300) vw(198);
	}
}
</style>
