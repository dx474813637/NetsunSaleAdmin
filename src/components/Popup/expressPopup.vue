<template>
    <el-dialog customClass="cusTomClass" v-model="dialogTableVisible" width="1000px" title="物流详情" @open="open" :close-on-press-escape="false" >
        <div class="home-w" v-loading="loading"> 
			<el-row class="u-m-b-20">
				<el-col>
					<el-text class="u-font-16">快递公司：</el-text>
					<el-text class="u-font-16" type="primary">{{ list.com }}</el-text>
				</el-col>
				<el-col>
					<el-text class="u-font-16">快递单号：</el-text>
					<el-text class="u-font-16" type="primary">{{ list.nu }}</el-text>
				</el-col>
			</el-row>
			<el-steps direction="vertical" :active="0" >
				<el-step 
					class="u-m-b-10" 
					:title="item.context"  
					v-for="(item, index) in list.data"  
					:key="index"
				>
					<template #title>
						<el-text class="u-font-16" style="color: #000;">{{ item.context }}</el-text>
					</template>
					<template #description>
						<el-text>{{ item.ftime }}</el-text>
					</template>
				</el-step>
			</el-steps>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, inject, toRefs, computed, watch } from 'vue';   
import { cateStore } from '@/stores/cate'; 
const cate = cateStore();
import useProductSku from '@/hook/useProductSku.ts'
import {isObjectEqual} from '@/utils/index'
let { freight_list } = toRefs(cate);  
const $api = inject('$api')
const props = defineProps({
	id: {
		type: String,
        detail: ''
	},
    show: {
        type: Boolean,
        detail: false
    }
});      
const list = ref({})
const loading = ref(false)
const emit = defineEmits(["setShow"]);
const dialogTableVisible = computed({
    set(v) {
		console.log(v)
        emit('setShow', v)
    },
    get() {
        return props.show
    }
})  
   
onMounted(async () => { 
	
}) 
const getData = async () => {
	const res = await $api.wuliu({ params: { no: props.id } })
	if(res.code == 1) { 
		list.value = res.list
	}
}  
async function open() {
	initData()
    await getData() 
	loading.value = false
}
function initData() {
	loading.value = true
	list.value = {}
}
 
</script>
<!-- <style lang="scss">
	.cusTomClass {
		border-radius: 20px!important;
	}
</style> -->
<style lang='scss' scoped>
.main {
	.el-image {
		display: block;
	}
}

.shop-card {
	position: relative;
	overflow: hidden;
	border-radius: 5px;
	background-color: var(--el-color-primary-light-9);
	// min-height: 100%;
	@extend %box-sizing;
	&:after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 120px;
		background-color: var(--el-color-primary);
	}
	.shop-box {
		position: relative;
		z-index: 20;
		border-radius: 5px;
		background-color: #fff;
		box-shadow: 0 0 10px rgba(0,0,0,.1); 
		.shop-row {
			line-height: 18px;
			margin-bottom: 14px;
			padding-bottom: 10px;
			border-bottom: 1px dashed var(--el-border-color);
			.el-text {

			}
			&.shop-header {
				border-bottom: 0;
			}
		}
		.shop-header {
			.shop-logo {
				flex: 0 0 40px;
				width: 40px;
				height: 40px;
				.el-avatar {
					width: 100%;
					height: 100%;
				}
			}
			.shop-name { 
			}
		}
	}
}
.preview-img-tabs {
	.el-tabs {
		--el-tabs-header-height: auto;
		::v-deep {
			.el-tabs__nav-wrap {
				margin-bottom: 0;
			}
			.el-tabs__item {
				padding: 5px!important;
			}
			.el-tabs__content {
				display: none;
			}
			.el-tabs__header {
				border-bottom: 0;
			}
		}
	}
	.preview-img {
		width: 50px;
		height: 50px;
	}
}
 
.product-title {
	line-height: 25px;
}
.product-price {
	height: 40px;
	background-color: var(--el-color-primary-light-9);
}
.product-data {
	border-top: 1px dashed var(--el-border-color);
	border-bottom: 1px dashed var(--el-border-color);
} 
.info-row {
	.info-row-item {
		&.info-row-item-label {
			font-size: 12px;
			flex: 0 0 3em;
			width: 3em;  
			color: #999;
			line-height: 30px; 
			&.sku-label {
				width: auto;
    			flex: 0 1 auto;
				min-width: 3em;
			}
		}
		&.info-row-item-content {
			line-height: 30px;
			.content-item {
				&.radio {
						::v-deep {
							.el-check-tag {
								font-weight: normal;
							}
							// .el-button:focus {
							// 	color: var(--el-button-text-color);
							// 	border-color: var(--el-button-border-color);
							// 	// background-color: var(--el-button-bg-color); 
							// }
							// .el-button:not(.is-disabled):hover {
							// 	color: var(--el-button-text-color);
							// 	border-color: var(--el-button-border-color);
							// 	background-color: var(--el-fill-color); 
							// }
							// .el-button.is-plain:hover,
							// .el-button.is-plain:focus { 
							// 	background-color: var(--el-button-bg-color); 
							// }
					}
				}
				
				&.active {

				}
			}
		}
	}
}
.attribute-box {
	background-color: #f8f8f8;
	.item {
		flex: 0 0 33%;
		@extend %box-sizing;
		.el-text {
			align-self: auto;
		}
	}
}
</style>