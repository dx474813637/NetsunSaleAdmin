<template>
    <el-dialog customClass="cusTomClass" draggable top="180px" v-model="dialogTableVisible" append-to-body width="50vw" title="添加福利券" @open="open" :close-on-press-escape="false" >
        <div class="home-w" v-loading="loading"> 
			<div>
				<DiyForm
					:ddata="diyFormData.data"
					:form="diyFormData.form"
					:name="diyFormData.name"
					:flex="diyFormData.flex"
					:align="diyFormData.align"
					:nowDialog="diyFormData"
					:confirmBtnDisabled="renderVouchersloading"
					:confirmBtnLoading="renderVouchersloading"
					sureText="提交"
					showClear
					:isView="false"
					:showCancel="false"  
					@confirm="onDiyFormConfirm" 
					@remove="onDiyFormRemove" 
					@itemsRemove="onDiyFormitemsRemove"
				>
					<template #btns>
						<el-button plain type="primary" @click="addPhoneBtn" v-show="diyFormData.data.cate == '2'">添加手机</el-button>
					</template>
				</DiyForm>
			</div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, inject, toRefs, computed, watch } from 'vue'; 
import router from "@/router/guard"  
import { genFileId,ElNotification, ElMessage } from 'element-plus'
import { useVouchersStore } from '@/stores/vouchers'
const vouchers = useVouchersStore()
import test from '@/utils/test.js'
import { cateStore } from '@/stores/cate'; 
const cate = cateStore();
const {  page_update } = toRefs(vouchers)
import useProductSku from '@/hook/useProductSku.ts'
import {isObjectEqual} from '@/utils/index'
let { freight_list } = toRefs(cate);  
const $api:any = inject('$api')
let phoneNum = ref(0)
const props = defineProps({
	id: {
		type: String,
        default: ''
	},
    show: {
        type: Boolean,
        default: false
    }
});   

const checkMobile = (rule: any, value: any, callback: any) => {
	if (!value) { 
		callback(new Error('请输入手机号'))
	}
	else if (!test.mobile(value)) { 
		callback(new Error('手机格式有误'))
	} else {
		let flag = 0
		for(let key in diyFormData.data) {
			if(key.includes('phone') && diyFormData.data[key] == value) {
				flag += 1
			}
		}
		if(flag >= 2) {
			callback(new Error('该手机已存在'))
		}
		callback()
	}
}
let diyFormData:any = reactive({
    title: "title", 
    name: "vouchersForm",
    name2: "vouchersForm2",
    show: true,
    data: {
        num: '',
        price: '', 
		cate: '1'
    },
    flex: 'col',
    align: 'start', 
    form: 
    [
        {
            label: "福利券面额",
            el: "input",
            prop: "price",
            class: 'u-m-b-10',
            place: "面额/元", 
			type: 'number',
            required: true
        }, 
        {
            label: "添加方式",
            el: "radio",
            prop: "cate",
            props: {
                label: 'label',
                value: 'value'
            },
            class: 'u-m-b-10',
            place: "添加方式", 
            required: false,
            options: [ 
                {
                    value: '1',
                    label: '根据福利券数量',
                },
                {
                    value: '2',
                    label: '根据手机号数量',
                },
            ]
        },   
    ], 
})  
watch(
	() => diyFormData.data.cate,
	(n) => {
		let arr:any = []
		if(n == '1') {
			arr = diyFormData.form.filter(ele => !ele.prop.includes('phone'))
			arr.push(
				{
					label: "福利券数量",
					el: "input",
					prop: "num",
					class: 'u-m-b-10',
					place: "数量", 
					type: 'number',
					required: true
				}
			)
			phoneNum.value = 0
		}
		if(n == '2') {
			arr = diyFormData.form.filter(ele => ele.prop != 'num') 
			// let phoneArr = arr.filter(ele => ele.prop.includes('phone'))
			phoneNum.value = 1
			arr.push(
				{
					label: "手机号",
					el: "input",
					prop: `phone0`,
					class: 'u-m-b-10',
					place: "手机号", 
					required: true,
					validator: checkMobile,
				}
			)
		}
		diyFormData.form = arr 
		let obj:any = { 
			price: diyFormData.data.price, 
			cate: n, 
		}
		if(n == '1') {
			obj.num = ''
		}
		else {
			obj.phone0 = ''
		}
		diyFormData.data = obj 
	},
	{
		immediate: true
	}
)

const routerName = computed(() => {
    return router.currentRoute.value.name
})
const list = ref({})
const renderVouchersloading = ref(false)
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
   
onMounted(async () => { 
	
})  
function addPhoneBtn() {
	let arr = diyFormData.form.filter(ele => ele.prop != 'num') 
	let phoneArr = arr.filter(ele => ele.prop.includes('phone'))
	phoneNum.value += 1
	arr.push(
		{
			label: `手机号`,
			el: "input",
			prop: `phone${phoneNum.value}`,
			class: 'u-m-b-10',
			place: "手机号", 
			required: true,
			validator: checkMobile,
			isRemoveBtn: true
		}
	)
	diyFormData.form = arr 
	diyFormData.data[`phone${phoneNum.value}`] = ''
}
async function open() { 
} 
async function onDiyFormRemove() {
	
}

async function onDiyFormitemsRemove({data}) {
	// console.log(data)
	let key = data.prop
	delete diyFormData.data[key]
	let i = diyFormData.form.findIndex(ele => ele.prop == key);
	diyFormData.form.splice(i, 1)
}
async function onDiyFormConfirm(e) {  
	console.log(e)
	let data:any = {
		price: diyFormData.data.price
	}
	if(diyFormData.data.cate == '1') {
		data.num = diyFormData.data.num
	}
	if(diyFormData.data.cate == '2') {
		let phone = [];
		for(let key in diyFormData.data) {
			if(key.includes('phone')) {
				phone.push(diyFormData.data[key])
			}
		}
		data.phone = phone.join(',')
	}
	renderVouchersloading.value = true
	try {
		const res = await $api.add_vouchers_up(data)
		if(res.code == 1) {
			ElMessage.success(res.msg)
			if(routerName.value == 'vouchers_list') page_update.value = true
			// console.log(page_update.value)
			await vouchers.getVouchersData() 
		}
	} catch (error) {
		
	}
	renderVouchersloading.value = false
	
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