<!--  -->
<template>
	<div>
		<div class="u-p-10 box">
			<table-community-refund ></table-community-refund> 
		</div>
	</div>
</template>

<script setup lang='ts'>
const $api: any = inject('$api') 
const dialogTableVisible = ref(false); 
const dialogTableVisible2 = ref(false); 
const currentData = ref({})
onMounted(async () => { 
}) 
function adminEvent(data) { 
	currentData.value = data
	setShow(true)
}
function setShow(v) {
    dialogTableVisible.value = v
}  
function adminEvent2(data) { 
	currentData.value = data
	setShow2(true)
}
function setShow2(v) {
    dialogTableVisible2.value = v
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