<!--  -->
<template>
	<div>
		<div class="u-p-10 box">
			<!-- <el-tabs v-model="api" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane v-for="item in tabs_list" :key="item.value" :label="item.label"
					:name="item.value"></el-tab-pane>
			</el-tabs>
			<el-alert v-show="detail_id && api == 'order_statement_list3'" class="u-m-b-10" :title="`明细ID：${detail_id}`"
				type="warning" @click="close" /> -->
			<table-bond-list :customParams="customParams" :api="api"
				@detailEvent="detailEvent"></table-bond-list>
 
		</div>
	</div>

</template>

<script setup lang='ts'>
import { computed, ref, inject, nextTick, onMounted } from 'vue'
import { genFileId, ElMessage } from 'element-plus'
const $api: any = inject('$api')
// const tabs_list = ref([
// 	{ label: '待结算列表', value: 'order_statement_list1' },
// 	{ label: '已结算列表', value: 'order_statement_list2' },
// 	{ label: '已提现列表', value: 'order_statement_list3' },
// 	{ label: '提现记录', value: 'order_statement_cash' },
// ])
const api = ref('deposit')
const value = ref('');
const role = ref('');
const initData = ref({
	order_statement_num1: 0,
	order_statement_num2: 0,
	config: {}
})
const customParams = computed(() => {
	return {
		sid: detail_id.value
		// type: value.value,
		// role: role.value
	}
}) 
const detail_id = ref('');
const dialogTableVisible = ref(false);
function detailEvent(data) {
	detail_id.value = data.id;
	api.value = 'order_statement_list3'
}
onMounted(async () => {
	await getInitData()
})
async function getInitData() {
	// await getMoney('order_statement_num1')
	// await getMoney('order_statement_num2')
}
// async function getMoney(name) {
//     const res = await $api[name]({loading: false}) 
//     initData.value[name] = res.statement  
// 	if(name == 'order_statement_num2') {
// 		initData.value.config = res
// 	}
// } 
function close() {
	detail_id.value = '';
	api.value = ''
	nextTick(() => {
		api.value = 'order_statement_list3'
	})

}
</script>
<style lang='scss' scoped>
.box {
	@extend %box-sizing;

	::v-deep {
		.el-tabs {
			// --el-tabs-header-height: 50px!important;
		}

		.el-tabs__item {
			// color: #707173; 
		}

		.el-tabs__item.is-active {
			color: var(--el-color-primary);
		}

		.el-tabs__nav-wrap::after {
			height: 1px;
		}
	}
}

.card {
	width: 100%;
	background-color: #f5005a;
	color: #fff;
	height: 160px;
}

.card-header {
	width: 100%;
}
</style>