<!--  -->
<template>
	<div class="box u-p-15 u-radius-15 bg-white ">
		<el-alert :title="title" type="warning" show-icon v-if="isParams" class="u-m-b-15 u-radius-15"
			@close="closeEvent" :close-text="isH5 ? '移除筛选' : '取消筛选，查看所有商品列表'" />
		<div class="u-p-15 box u-radius-15 bg-white ">
			<table-product-om :customParams="customParams" @detailEvent="detailEvent"
				@detailPriceEvent="detailPriceEvent"></table-product-om>
			<product-mobile-popup :show="dialogTableVisible" :id="detail_id" @setShow="setShow"></product-mobile-popup>
			<product-sku-popup :show="dialogTableVisible2" :id="detail_id" @setShow="setShow2"></product-sku-popup>
		</div>
	</div>
</template>

<script setup lang='ts'>
import router from "@/router/guard"
import { reactive, ref, inject, onMounted, toRefs, watch, computed } from 'vue'
const $api: any = inject('$api')
import { genFileId, ElMessage, ElMessageBox } from 'element-plus'
import { cateStore } from '@/stores/cate'
import { userStore } from '@/stores/user'
const user = userStore()
import { useSettingsStore } from '@/stores/settings'
const settings = useSettingsStore()
const { isH5 } = toRefs(settings)
const { role } = toRefs(user)
const cate = cateStore()
// $api.product() 
const detail_id = ref('');
const login = ref('');
const dialogTableVisible = ref(false);
const dialogTableVisible2 = ref(false);
const title = computed(() => {
	if (login.value) {
		return `当前商家LOGIN：${login.value}`
	}
	return ''
})

const customParams = computed(() => {
	return {
		login: login.value
	}
})
const isParams = computed(() => Object.keys(router.currentRoute.value.query).length > 0 ? true : false)
watch(
	() => router.currentRoute.value.query,
	(n) => {
		login.value = n.login
	},
	{
		deep: true,
		immediate: true
	}
)
onMounted(() => { 
    showInitMessage()
})

const showInitMessage = () => {
	ElMessageBox.confirm(
		'尊敬的伙伴您好！请在审核商品上架时，请仔细查看商详是否合法合规。以下部份列举商品或类请不要审核上架。【药品、保健品类、械字号类、妆特字类、大健康类、白酒、珠宝玉石类、带酒精及农药成份的商品、标有治疗性质的化妆品食品等】，后期根据实际情况逐步开放相关类目，谢谢您的配合！',
		'提示',
		{
			confirmButtonText: '我已知晓',
			showCancelButton: false, 
			showClose: false,
			closeOnPressEscape: false,
			closeOnClickModal: false,
			type: 'warning',
		}
	) 
}
function closeEvent() {
	router.replace({ name: 'om_product_list' })
}
function detailEvent(data) {
	detail_id.value = data;
	dialogTableVisible.value = true
}
function detailPriceEvent(data) {
	detail_id.value = data;
	dialogTableVisible2.value = true
}


function setShow(v) {
	dialogTableVisible.value = v
}
function setShow2(v) {
	dialogTableVisible2.value = v
}
</script>
<style lang='scss' scoped>
.box {
	@extend %box-sizing;
}
</style>