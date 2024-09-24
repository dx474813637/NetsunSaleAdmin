<!--  -->
<template>
	<div>
		<el-row :gutter="20" class="u-p-10">
			<el-col :span="12" :xs="24">
				<div class="u-radius-8 card u-flex-column u-flex-items-center u-flex-center u-p-10 box-border">
					<div class="card-header">
						<el-text tag="b" class="u-font-16 text-white">待结算金额</el-text>
					</div>
					<div class="u-flex-1 u-flex u-flex-center">
						<el-statistic :precision="2" :value="initData.order_statement_num1" value-style="font-size: 30px; color: #fff" />
					</div>
				</div>
			</el-col>
			<el-col :span="12" :xs="24">
				<div class="u-radius-8 card u-flex-column u-flex-items-center u-flex-center u-p-10 box-border">
					<div class="card-header u-flex u-flex-between u-flex-items-center">
						<el-text tag="b" class="u-font-16 text-white">可提现金额</el-text>
						<el-button type="danger" plain size="small" v-if="initData.order_statement_num2 > 0" :loading="btnLoading" :disabled="btnLoading" @click="tixianBtn">提现</el-button>
					</div>
					<div class="u-flex-1 u-flex u-flex-center">
						<el-statistic :precision="2" :value="initData.order_statement_num2" value-style="font-size: 30px; color: #fff" />
						<el-button type="danger" text bg  class="u-flex u-flex-items-center u-m-l-10" v-if="initData.config.bc > 0" @click="dialogTableVisible2 = true">
							<el-text style="color: #F5005A;" >{{ initData.config.bc_name }}</el-text>
							<el-statistic :precision="2" :value="initData.config.bc" value-style="font-size: 18px; color: #F5005A" />
							<el-icon size="16" class="u-m-l-5" color="#F5005A"><InfoFilled /></el-icon>
						</el-button>
					</div>
				</div>
			</el-col>
		</el-row>
		<div class="u-p-10 u-m-10 u-radius-5 bg u-font-14"> 
			<el-row :gutter="20">
				<el-col :span="8" :xs="24">
					<el-form-item label="名称" label-width="60px" label-position="left" class="u-m-b-0">
						<div class="u-flex u-flex-items-center" style="cursor: pointer;" @click="copyEvent('浙江网盛跨境电商服务有限公司')"> 
							<div class="u-m-r-5">浙江网盛跨境电商服务有限公司</div>
							<el-icon color="#007aff" ><CopyDocument /></el-icon>
						</div>
					</el-form-item>   
				</el-col>
				<el-col :span="8" :xs="24">
					<el-form-item label="税号" label-width="60px" label-position="left" class="u-m-b-0">
						<div class="u-flex u-flex-items-center" style="cursor: pointer;" @click="copyEvent('91330109322902277U')"> 
							<div class="u-m-r-5">91330109322902277U</div>
							<el-icon color="#007aff" ><CopyDocument /></el-icon>
						</div>
					</el-form-item>    
				</el-col>
				<el-col :span="8" :xs="24">
					<el-form-item label="邮箱" label-width="60px" label-position="left" class="u-m-b-0">
						<div class="u-flex u-flex-items-center" style="cursor: pointer;" @click="copyEvent('jyf@netsun.com')"> 
							<div class="u-m-r-5">jyf@netsun.com</div>
							<el-icon color="#007aff" ><CopyDocument /></el-icon>
						</div>
					</el-form-item>   
				</el-col> 
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8" :xs="24">
					<el-form-item label="电话" label-width="60px" label-position="left" class="u-m-b-0">
						<div class="u-flex u-flex-items-center" style="cursor: pointer;" @click="copyEvent('0571-87397967')"> 
							<div class="u-m-r-5">0571-87397967</div>
							<el-icon color="#007aff" ><CopyDocument /></el-icon>
						</div>
					</el-form-item>   
				</el-col>
				<el-col :span="8" :xs="24">
					<el-form-item label="开户行" label-width="60px" label-position="left" class="u-m-b-0">
						<div class="u-flex u-flex-items-center" style="cursor: pointer;" @click="copyEvent('兴业银行杭州萧山支行')"> 
							<div class="u-m-r-5">兴业银行杭州萧山支行</div>
							<el-icon color="#007aff" ><CopyDocument /></el-icon>
						</div>
					</el-form-item>    
				</el-col>
				<el-col :span="8" :xs="24">
					<el-form-item label="账号" label-width="60px" label-position="left" class="u-m-b-0">
						<div class="u-flex u-flex-items-center" style="cursor: pointer;" @click="copyEvent('359590100100155451')"> 
							<div class="u-m-r-5">359590100100155451</div>
							<el-icon color="#007aff" ><CopyDocument /></el-icon>
						</div>
					</el-form-item>    
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="24" :xs="24">
					<el-form-item label="地址" label-width="60px" label-position="left" class="u-m-b-0">
						<div class="u-flex u-flex-items-center" style="cursor: pointer;" @click="copyEvent('中国（浙江）杭州自由贸易试验区杭州市滨江区长河街道立业路788号网盛大厦3308室')"> 
							<div class="u-m-r-5">中国（浙江）杭州自由贸易试验区杭州市滨江区长河街道立业路788号网盛大厦3308室</div>
							<el-icon color="#007aff" ><CopyDocument /></el-icon>
						</div>
					</el-form-item>    
				</el-col>
			</el-row>
		</div>
		<div class="u-p-10 box">
			<el-tabs v-model="api" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane v-for="item in tabs_list" :key="item.value" :label="item.label"
					:name="item.value"></el-tab-pane>
			</el-tabs>
			<el-alert v-show="detail_id && api == 'order_statement_list3'" class="u-m-b-10" :title="`明细ID：${detail_id}`"
				type="warning" @click="close" />
			<table-statement-list :customParams="customParams" :api="api" isFileUploadShow
				@detailEvent="detailEvent"></table-statement-list>

			<!-- <product-popup :show="dialogTableVisible" :id="detail_id" @setShow="setShow"></product-popup> -->
			<order-statement2-popup :show="dialogTableVisible2" :dataList="initData.config.bc_list" @setShow="setShow2"></order-statement2-popup>
		</div>
	</div>

</template>

<script setup lang='ts'>
import { computed, ref, inject, nextTick, onMounted } from 'vue'
import { genFileId, ElMessage } from 'element-plus'
const $api: any = inject('$api')
const tabs_list = ref([
	{ label: '待结算列表', value: 'order_statement_list1' },
	{ label: '已结算列表', value: 'order_statement_list2' },
	{ label: '已提现列表', value: 'order_statement_list3' },
	{ label: '提现记录', value: 'order_statement_cash' },
])
const api = ref('order_statement_list1')
const value = ref('');
const role = ref('');
const initData = ref({
	order_statement_num1: 0,
	order_statement_num2: 0,
	config: {}
})
const customParams = computed(() => {
	return {
		sid: detail_id.value,
		js: '1'
		// type: value.value,
		// role: role.value
	}
}) 
const detail_id = ref('');
const dialogTableVisible = ref(false); 
const dialogTableVisible2 = ref(false);
const btnLoading = ref(false);
function detailEvent(data) {
	detail_id.value = data.id;
	api.value = 'order_statement_list3'
}
onMounted(async () => {
	await getInitData()
})
async function getInitData() {
	await getMoney('order_statement_num1')
	await getMoney('order_statement_num2')
}
async function getMoney(name) {
    const res = await $api[name]({params: {js: '1'},loading: false}) 
    initData.value[name] = res.statement  
	if(name == 'order_statement_num2') {
		initData.value.config = res
	}
}
function setShow(v) {
	dialogTableVisible.value = v
}
function setShow2(v) {
	dialogTableVisible2.value = v
}
async function tixianBtn() {
	if(btnLoading.value) return
	btnLoading.value = true
	try {
		const res = await $api.order_statement_draw({...initData.value.config, js: '1'}, {loading: true}) 
		btnLoading.value = false
		if(res.code == 1) {
			ElMessage.success(res.msg)
			await getInitData()
		}
	} catch (error) {
		btnLoading.value = false
		
	}

}
function handleClick() {
	detail_id.value = '';
}
function close() {
	detail_id.value = '';
	api.value = ''
	nextTick(() => {
		api.value = 'order_statement_list3'
	})

}
function copyEvent(text) {
     
    let content = text
    let flag = exeCommandCopyText(content)
    if(flag) {
        ElMessage.success('复制成功')
    }
    else { 
        ElMessage.error('复制失败')
    }  
}
function exeCommandCopyText(text) {
    try {
        const t = document.createElement('textarea')
        t.nodeValue = text
        t.value = text
        document.body.appendChild(t)
        t.select()
        document.execCommand('copy');
        document.body.removeChild(t)
        return true
    } catch (e) {
        console.log(e)
        return false
    }
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
	background-color: #a19ed3;
	color: #fff;
	height: 160px;
}

.card-header {
	width: 100%;
}
.bg {
    background-image: url("https://www.sunmaxx.cn/Public/fulizq/fulibg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat
}
</style>