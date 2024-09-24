<!--  -->
<template>
	<div>
		<div class="u-p-10 box">
			<table-coupon @addInvoiceEvent="showAddInvoice"></table-coupon>
		</div>
	</div>
</template>

<script setup lang='ts'>
const $api: any = inject('$api') 
const addWelfareInvoiceShow = ref(false); 
const currentData = ref({})
onMounted(async () => { 
}) 
function setShow(v) {
    addWelfareInvoiceShow.value = v
} 
function showAddInvoice(data) { 
	currentData.value = {}
	console.log(data)
	currentData.value = data
	addWelfareInvoiceShow.value = true
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
.welfare_info {
    width: 100%;
    p, img {
        display: block;
        width: 100%!important;
    }
}
</style>