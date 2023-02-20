<template>
	<view class="time-line">
		<view class="time-content">
			<view :style="{width : width + 'vw'}" class="time-wrap">
				<view v-for="(value,index) in timeList.value"
							:key="index"
							:class="['time-node' , index === active ? 'active' : '' , index === active - 1 ? 'previous' : '']"
							:style="index === active ? styleObject : ''"
							@click="onChange(index)">
					<text class="day">{{ value.day }}</text>
					<text class="date">{{ value.formatDate }}</text>
					<view v-if="index === active" class="selected"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import moment from 'moment'
import {onMounted, reactive, ref, toRaw} from "vue"

interface Props {
	beginDate : string,
	endDate : string,
	reverse? : boolean,
	color? : string
	activeDate? : string
}

const props = withDefaults(defineProps<Props>(), {
	beginDate : '',
	endDate : '',
	reverse : false,
	color : '#0E75FC',
	activeDate : ''
})

const width = ref(0)
const active = ref(0)
const timeList : any = reactive({value : []})
const styleObject : any = reactive({
	color : props.color,
	backgroundColor : props.color + '1A',
	borderColor : props.color
})

const emit = defineEmits<{
	(event : 'call-back', obj : object) : object
}>()

onMounted(() => init())

const init = () => {
	const days = Math.abs(moment(props.beginDate).diff(moment(props.endDate), 'days')) + 1
	width.value = 97 / 7.5 * days
	timeList.value = getTimeList(days)
	active.value = timeList.value.findIndex((item : { date : string }) => item.date === (props.activeDate ? props.activeDate : props.beginDate))
}

const onChange = (index : number) => {
	if (active.value === index) return
	active.value = index
	emit('call-back', toRaw(timeList.value)[active.value])
}

const getTimeList = (days : number) => {
	let ab = moment(props.beginDate).format('YYYY-MM-DD').split('-'),
		ae = moment(props.endDate).format('YYYY-MM-DD').split('-'),
		db = new Date(),
		de = new Date(),
		arr = []
	db.setUTCFullYear(parseInt(ab[0]), parseInt(ab[1]) - 1, parseInt(ab[2]))
	de.setUTCFullYear(parseInt(ae[0]), parseInt(ae[1]) - 1, parseInt(ae[2]))
	let unixDb = db.getTime(),
		unixDe = de.getTime(),
		weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
	for (let k = unixDb; k <= unixDe;) {
		let obj : object | any = {}
		obj.date = moment(k).format('YYYY-MM-DD')
		obj.formatDate = moment(k).format('MM.DD')
		obj.day = moment().format('YYYY-MM-DD') === obj.date ? '今天' : weeks[moment(obj.date).day()]
		arr.push(obj)
		k = k + 24 * 60 * 60 * 1000
	}
	days ? arr = arr.slice(0, days) : arr
	props.reverse ? arr.reverse() : arr
	return arr
}
</script>

<style lang="scss" scoped>
.time-line {
	width: 100%;
	padding: 0 vw(36);
	background-color: #FFFFFF;
	box-shadow: 0 0 vw(12) rgba(61, 156, 253, 0.26);
	border-radius: vw(20);
	overflow-y: hidden;
	.time-content {
		overflow-x: scroll;
		-webkit-overflow-scrolling: touch;
		transform: translateZ(0);
		.time-wrap {
			//根据node长度和数量,自动计算该节点长度
			.time-node {
				position: relative;
				float: left;
				width: vw(97);
				padding: vw(30) 0;
				display: flex;
				flex-flow: column nowrap;
				align-items: center;
				font-size: vw(24);
				color: #2D3239;
				//border: vw(3) solid transparent;
				border-right: none;
				border-radius: vw(8);
				.day, .date {
					margin: 0 0 vw(8) 0;
				}
				.selected {
					position: absolute;
					right: vw(-1);
					bottom: vw(-1);
					width: vw(48);
					height: vw(48);
					background: url("data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPjxkZWZzPjxzdHlsZT5AZm9udC1mYWNle2ZvbnQtZmFtaWx5OmZlZWRiYWNrLWljb25mb250O3NyYzp1cmwoJnF1b3Q7Ly9hdC5hbGljZG4uY29tL3QvZm9udF8xMDMxMTU4X3U2OXc4eWh4ZHUud29mZjI/dD0xNjMwMDMzNzU5OTQ0JnF1b3Q7KSBmb3JtYXQoJnF1b3Q7d29mZjImcXVvdDspLHVybCgmcXVvdDsvL2F0LmFsaWNkbi5jb20vdC9mb250XzEwMzExNThfdTY5dzh5aHhkdS53b2ZmP3Q9MTYzMDAzMzc1OTk0NCZxdW90OykgZm9ybWF0KCZxdW90O3dvZmYmcXVvdDspLHVybCgmcXVvdDsvL2F0LmFsaWNkbi5jb20vdC9mb250XzEwMzExNThfdTY5dzh5aHhkdS50dGY/dD0xNjMwMDMzNzU5OTQ0JnF1b3Q7KSBmb3JtYXQoJnF1b3Q7dHJ1ZXR5cGUmcXVvdDspfTwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik04NTMuMzMzIDEwMjRIMEwxMDI0IDB2ODUzLjMzM0ExNzAuNjY3IDE3MC42NjcgMCAwIDEgODUzLjMzMyAxMDI0em0tMjg2LjA4LTM2OC4xN2wtMjkuNTY4IDI5Ljg2NiAxMzMuMjQ4IDEzMy4wNzcgMjYxLjU5LTI2MS41ODktMjkuNTY4LTI5Ljg2N0w2NzAuOTc2IDc1OS4zNHoiIGZpbGw9IiMwRTc1RkMiLz48L3N2Zz4=");
					background-size: 100% 100%;
				}
				&.active {
					font-weight: bold;
					//border-width: vw(3);
					//border-style: solid;
				}
				&:not(:last-child):after {
					content: "";
					position: absolute;
					right: 0;
					top: vw(30);
					width: vw(2);
					height: calc(100% - vw(60));
					background-color: #E1E5EC;
				}
				&.active:after, &.previous:after {
					display: none;
				}
			}
			&:after {
				content: "";
				display: table;
				clear: both;
			}
		}
	}
	::-webkit-scrollbar {
		height: 0 !important;
	}
}
</style>
