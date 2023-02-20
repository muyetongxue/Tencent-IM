<script setup>
import {onHide,onLaunch,onShow} from "@dcloudio/uni-app";
import {init_TIM} from "./common/ts/tim";

onLaunch(() => init_TIM())

onShow(() => {})

onHide(() => {})

</script>

<style lang="scss">
@import "/src/common/fonts/iconfont";
</style>
