<template>
    <el-dialog customClass="cusTomClass" v-model="dialogTableVisible" width="50vw" title="发送短信" @open="open" :close-on-press-escape="false" >
        <el-form :model="voucherSendForm" :rules="rules" ref="voucherSendRef" label-width="100px" label-position="left">
			<el-form-item label="卡号" >
				{{ voucherData.id }}
			</el-form-item> 
			<el-form-item label="GUID" >
				{{ voucherData.guid }}
			</el-form-item> 
			<el-form-item label="面额" >
				{{ voucherData.amount }}
			</el-form-item> 
			<el-form-item label="手机号" prop="phone" >
				<el-input v-model="voucherSendForm.phone" clearable placeholder="手机号" />
			</el-form-item> 
        </el-form>
        <template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogTableVisible = false">取消</el-button>
				<el-button type="primary" :disabled="loading" :loading="loading" @click="submitForm(voucherSendRef)">提交表单</el-button>
			</span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, inject, toRefs, computed, watch } from 'vue';  
import router from "@/router/guard" 
import { cateStore } from '@/stores/cate'; 
import { genFileId,ElNotification, ElMessage } from 'element-plus'
import test from '@/utils/test.js'
const cate = cateStore();
import useProductSku from '@/hook/useProductSku.ts'
import {isObjectEqual} from '@/utils/index'
let { freight_list } = toRefs(cate);  
import { useVouchersStore } from '@/stores/vouchers'
const vouchers = useVouchersStore()
const {  page_update } = toRefs(vouchers)
const $api:any = inject('$api')
const props = defineProps({
	id: {
		type: String,
        default: ''
	},
    show: {
        type: Boolean,
        default: false
    },
	voucherData: {
		type: Object,
		default: () => {
			return {}
		}
	}

}); 
const voucherSendRef = ref(null)
const checkMobile = (rule: any, value: any, callback: any) => {
  if (!value) { 
    callback(new Error('请输入手机号'))
  }
    else if (!test.mobile(value)) { 
    callback(new Error('手机格式有误'))
  } else {
    callback()
  }
}
const routerName = computed(() => {
    return router.currentRoute.value.name
})
const rules = reactive<FormRules<typeof ruleForm>>({ 
    phone: [{
		validator: checkMobile, 
		trigger: ['blur', 'change'],
	}], 
})      
const voucherSendForm = ref({
	phone: ''
})
const loading = ref(false)
const emit = defineEmits(["setShow", "success"]);
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

async function submitForm (formName) {
    formName.validate(async (valid) => {
		if (valid) { 
			if(loading.value) return
			loading.value = true
			try {
				const res = await $api.send_vouchers({params: {id: props.voucherData.id, ...voucherSendForm.value}})
				if(res.code != 1) return; 
				ElMessage.success(res.msg)
				// emit('success')
				if(routerName.value == 'vouchers_list') page_update.value = true
				dialogTableVisible.value = false 
			} catch (error) {
				
			}
	        loading.value = false
		} else {
			console.log('error submit!!');
			return false;
		}
	});
     
	
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