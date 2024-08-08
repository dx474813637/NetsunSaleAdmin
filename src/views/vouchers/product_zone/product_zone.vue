<!--  -->
<template>
	<div class="u-p-10 box">
		 

		<table-product-zone @detailEvent="detailEvent"></table-product-zone>
		
		<product-popup :show="dialogTableVisible" api="product_detail1" :id="detail_id" @setShow="setShow"></product-popup>
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