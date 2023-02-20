<template>
	<view class="table">
		<uni-table :border="props.border"
							 :loading="props.loading"
							 :type="props.type"
							 emptyText="暂无更多数据"
							 stripe @selection-change="selectionChange">
			<uni-tr>
				<uni-th v-for="(value,index) in props.thSetting"
								:key="index"
								:align="props.align"
								:width="!props.freeWidth ? (windowWidth / props.thSetting.length - (props.thSetting.length + 1)) : ''">
					{{ value.value }}
				</uni-th>
			</uni-tr>
			<uni-tr v-for="(v,i) in props.tableData" :key="i">
				<uni-td v-for="(value,label) in props.thSetting" :key="label" :align="props.align">{{ v[value.key] }}</uni-td>
			</uni-tr>
		</uni-table>
	</view>
</template>

<script lang="ts" setup>
import {onBeforeMount, ref, toRaw} from "vue"

interface Props {
	border? : boolean,
	freeWidth? : boolean,
	loading? : boolean,
	type? : string,
	align? : string,
	thSetting : any[],
	tableData : any[]
}

const props = withDefaults(defineProps<Props>(), {
	border : false,
	freeWidth : false,
	loading : false,
	type : "",
	align : 'left',
	thSetting : () => ([]),
	tableData : () => ([]),
})

const emit = defineEmits<{
	(e : 'selection-change', array : any[]) : void
}>()

let windowWidth = ref(0)

onBeforeMount(() => {
	uni.getSystemInfo({
		success : res => {
			windowWidth.value = res.windowWidth
		}
	})
})

const selectionChange = (event : any) => {
	let arr : any[] = []
	event.detail.index.forEach((item : number) => arr.push(toRaw(props.tableData[item])))
	emit('selection-change', arr)
}
</script>

<style lang="scss" scoped></style>
