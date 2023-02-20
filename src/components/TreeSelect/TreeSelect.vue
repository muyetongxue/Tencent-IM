<template>
	<view class="tree-select">
		<view class="left-list">
			<view v-for="(value, index) in props.leftItems"
						:key="index"
						:class="['tabs' , leftIndex === index ? 'active' : '' , value.disabled ? 'disabled' : '']"
						:style="leftIndex === index ? styleObject : ''"
						@click="clickNav(value, index)">
				<slot :value="value" name="left"></slot>
			</view>
		</view>
		<view class="right-list">
			<view v-for="(value, index) in props.rightItems" :key="index">
				<slot :value="value" name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import {reactive, ref, toRaw} from "vue"

interface Props {
	color? : string,
	leftItems : any[],
	rightItems : any[]
}

const props = withDefaults(defineProps<Props>(), {
	color : '#0E75FC',
	leftItems : () => ([]),
	rightItems : () => ([])
})

const emit = defineEmits<{
	(e : 'click-nav', value : any, index : number) : void
}>()

const styleObject = reactive({
	'--color' : props.color
})

const leftIndex = ref(0)

const clickNav = (value : any, index : number) => {
	if (value.disabled || leftIndex.value === index) return
	leftIndex.value = index
	emit('click-nav', toRaw(value), index)
}

</script>

<style lang="scss" scoped>
.tree-select {
	width: 100vw;
	height: 100vh;
	display: flex;
	.left-list {
		min-height: 100vh;
		overflow-x: hidden;
		overflow-y: scroll;
		background-color: #F2F2F2;
		-webkit-overflow-scrolling: touch;
		.tabs {
			position: relative;
			max-width: vw(286.5);
			height: vw(90);
			line-height: vw(90);
			padding: 0 vw(30);
			font-size: vw(30);
			color: #333333;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			&.active {
				color: var(--color);
				background-color: #ffffff;
				&:before {
					content: "";
					position: absolute;
					left: 0;
					top: 50%;
					transform: translate(0, -50%);
					width: vw(8);
					height: vw(45);
					background-color: var(--color);
				}
			}
			&.disabled {
				color: #c8c9cc;
			}
		}
	}
	.right-list {
		flex: 1;
		padding: vw(30);
		min-height: 100vh;
		overflow-x: hidden;
		overflow-y: scroll;
		background-color: #ffffff;
		-webkit-overflow-scrolling: touch;
	}
}
</style>
