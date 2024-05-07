<!--  -->
<template>
	<div class="u-p-10 box">
		<el-alert 
			class="u-m-b-10"
			title="发布的商品特卖价，要小于等于抖音平台或其他平台的定价，否则平台有权无须通知即下架商品！" 
			type="warning" 
			:closable="false"
		/>

		<table-product isEditBtn @detailEvent="detailEvent"></table-product>
		
		<product-popup :show="dialogTableVisible" :id="detail_id" @setShow="setShow"></product-popup>
	</div>
</template>

<script setup lang='ts'>
import { reactive, ref, inject, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
const $api: any = inject('$api')
import { cateStore } from '@/stores/cate'
const cate = cateStore()
// $api.product() 
const detail_id = ref('');
const dialogTableVisible = ref(false);
function detailEvent(data) {
	detail_id.value = data;
	dialogTableVisible.value = true
}
onMounted(() => { 
})
function setShow(v) {
	dialogTableVisible.value = v
} 
</script>
<style lang='scss' scoped>
.box {
	@extend %box-sizing;
}
</style>