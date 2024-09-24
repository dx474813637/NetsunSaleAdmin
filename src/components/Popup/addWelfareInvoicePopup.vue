<template>
    <el-dialog customClass="cusTomClass" draggable v-model="dialogTableVisible" append-to-body width="1000px" title="福利券充值发票申请" @open="open" :close-on-press-escape="false" >
        <div class="home-w" v-loading="loading"> 
			<div>
				<DiyForm
					:ddata="diyFormData.data"
					:form="diyFormData.form"
					:name="diyFormData.name"
					:flex="diyFormData.flex"
					:align="diyFormData.align"
					:nowDialog="diyFormData"
					:confirmBtnDisabled="renderDataloading"
					:confirmBtnLoading="renderDataloading"
					sureText="提交"
					showClear
					:isView="false"
					:showCancel="false"  
					@confirm="onDiyFormConfirm" 
					@remove="onDiyFormRemove"  
				></DiyForm>
			</div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, inject, toRefs, computed, watch } from 'vue'; 
import router from "@/router/guard"  
import { genFileId,ElNotification, ElMessage, ElMessageBox } from 'element-plus' 
import test from '@/utils/test.js'
import { cateStore } from '@/stores/cate'; 
const cate = cateStore();   
const $api:any = inject('$api') 
const props = defineProps({
	id: {
		type: String,
        default: ''
	},
	currentData: {
		type: Object,
        default: () => {
			return {}
		}
	},
    show: {
        type: Boolean,
        default: false
    }
});   
 
let diyFormData:any = reactive({
    title: "title", 
    name: "form",
    name2: "form2",
    show: true,
    data: {
        name: '',
        no: '', 
		address: '', 
		tel: '', 
		bank: '', 
		account: '', 
		email: '', 
		aid: ''
    },
    flex: 'col',
    align: 'start', 
    form: 
    [
        {
            label: "充值记录ID",
            el: "input",
            prop: "aid", 
            place: "", 
			type: 'text',
			disabled: true
        },  
        {
            label: "公司名称",
            el: "input",
            prop: "name", 
            place: "公司名称", 
			type: 'text',
            required: true
        },  
        {
            label: "纳税人识别号",
            el: "input",
            prop: "no", 
            place: "纳税人识别号", 
			type: 'text',
            required: true
        },  
        {
            label: "地址",
            el: "input",
            prop: "address", 
            place: "地址", 
			type: 'text',
            required: true
        },  
        {
            label: "电话",
            el: "input",
            prop: "tel", 
            place: "电话", 
			type: 'text',
            required: true
        },  
        {
            label: "开户行",
            el: "input",
            prop: "bank", 
            place: "开户行", 
			type: 'text',
            required: true
        },  
        {
            label: "银行账号",
            el: "input",
            prop: "account", 
            place: "银行账号", 
			type: 'text',
            required: true
        },  
        {
            label: "邮箱",
            el: "input",
            prop: "email", 
            place: "邮箱", 
			type: 'text',
			required: false
        },  
    ], 
})   
const routerName = computed(() => {
    return router.currentRoute.value.name
})
const list = ref({})
const renderDataloading = ref(false)
const loading = ref(false)
const emit = defineEmits(["setShow" ]);
const dialogTableVisible = computed({
    set(v) {
		console.log(v)
        emit('setShow', v)
    },
    get() {
        return props.show
    }
})  
watch(
	() => props.currentData,
	(n) => { 
		diyFormData.data.aid = n.id
	},
	{
        immediate: true,
		deep: true
	}
)
   
onMounted(async () => { 
	
})   
async function open() { 
} 
async function onDiyFormRemove() {
	
}
 
async function onDiyFormConfirm(e) {   
	let data:any = {
		...diyFormData.data
	} 
	renderDataloading.value = true
	try {
		const res = await $api.add_invoice(data)
		if(res.code == 1) { 
			ElMessageBox.confirm(
				`${res.msg}，是否跳至福利券充值开票记录`,
				'提示',
				{
					confirmButtonText: '跳转',
					cancelButtonText: '取消',
					type: 'success',
				}
			)
			.then(() => {  
				router.push({name: 'welfare_invoice_list'})
				
			}) 
		}
	} catch (error) {
		
	}
	renderDataloading.value = false
	
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