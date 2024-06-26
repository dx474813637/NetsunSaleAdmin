<template> 
    <el-form 
        ref="formRef" 
        :model="dynamicValidateForm" 
        label-width="120px" 
        :rules="rules" 
        class="demo-dynamic u-p-20 box-border"
        label-position="top"
        scroll-to-error
        inline-message
        > 
        <el-form-item label="保证金类型" prop="cate">
            <el-select v-model="dynamicValidateForm.cate" placeholder="保证金类型" :disabled="quickMode" style="max-width: 400px; width: 100%">
                <el-option
                    v-for="item in cateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
            <el-input 
                v-model="dynamicValidateForm.amount"  
                autocomplete="off" 
                clearable 
                style="max-width: 400px;"
            />
        </el-form-item>
        <el-form-item label="交易单号" prop="order" :required="dynamicValidateForm.cate == '1'" v-show="dynamicValidateForm.cate == '1'">
            <el-input 
                v-model="dynamicValidateForm.order"  
                autocomplete="off" 
                placeholder="交易单号"
                clearable 
                style="max-width: 400px;"
            />
        </el-form-item> 
        <el-form-item>
            <el-button type="primary" @click="submitForm(formRef)">提交</el-button> 
        </el-form-item>
    </el-form>  
</template>
  
<script lang="ts" setup>
import { reactive, ref, inject, watch, toRefs, computed } from 'vue'
import router from '@/router/guard'
import { genFileId, ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import test from '@/utils/test.js'
import { deepClone } from '@/utils' 
import { useSettingsStore } from '@/stores/settings'
import {isNumber} from '@/utils'
const settings = useSettingsStore(); 
const props = defineProps({
    id: {
        type: String,
        default: ''
    },  
    cate: {
        type: String,
        default: ''
    },  
}); 
const mode = ref('')
const $api: any = inject('$api')  
const formRef = ref<FormInstance>()  
const dynamicValidateForm = reactive<{ 
    // id: string 
    amount: string
    cate: string  
    order: string  
}>({ 
    // id: '', 
    amount: '', 
    cate: '',  
    order: '',  
}) 
const cateOptions = [
    {
        value: '1',
        label: '增加',
    },
    {
        value: '2',
        label: '退还',
    },
]
watch(
    () => router.currentRoute.value.name,
    (newVal:any ) => { 
        // console.log(newVal)
        if(newVal == "bond_add") {
            mode.value = 'add'
        }
        if(newVal == "bond_edit") {
            mode.value = 'edit'
        }
    },
    {immediate: true}
)
watch(
    () => props.id,
    (newVal ) => {
        // console.log('id:' +newVal ); 
        if(!newVal) return
        dynamicValidateForm.id = newVal
    },
    {immediate: true}
) 
const quickMode = computed(() => router.currentRoute.value.query.cate ? true : false) 
watch(
    () => router.currentRoute.value.query.cate,
    (newVal ) => {
        console.log('cate:' +newVal ); 
        if(!newVal) return
        if(cateOptions.some(ele => ele.value == newVal)) {
            dynamicValidateForm.cate = newVal
        } 
    },
    {immediate: true}
) 
const rules = reactive<FormRules<typeof ruleForm>>( {
    amount: [{
        required: true,
        validator: (rule: any, value: any, callback: any) => { 
            if (isNumber(value)) {
                callback() 
            }
            else {
                callback(new Error('输入正确的金额'))
            }
            
        }, 
        trigger: ['change', 'blur'],
    }], 
    cate: [{
        required: true,
        message: '请选择',
        trigger: ['change', 'blur'],
    }], 
    order: [{ 
        message: '不能为空',
        validator: (rule: any, value: any, callback: any) => { 
            if(dynamicValidateForm.cate == '1') {
                if (value === '') {
                    callback(new Error('不能为空'))
                }
            }
            callback()
        },
        trigger: ['change', 'blur'],
    }], 
})  
  
function submitForm(formEl: FormInstance | undefined) {
    if (!formEl) return 
    formEl.validate(async (valid) => { 
        if (valid) {
            console.log('submit!')
            // console.log(dynamicValidateForm)
            // let params = formParams2apiParams()
            let params = deepClone(dynamicValidateForm);
            console.log(params)
            await submitApi(params)
        } else {
            console.log('error submit!')
            return false
        }
    })
}
 
 

async function submitApi(data) { 
    let fun = mode.value == 'add'? 'add_deposit' : ''
    const res = await $api[fun]({
        params: {...data}
    })
    if(res.code == 1) {
        ElMessage.success(res.msg)
        
        router.push({
            name: 'bond_list_admin'
        })
        
    }
}
 

</script>
  
<style lang='scss' scoped> 
::v-deep {
    
    .el-table {
        // --el-table-border-color: #dcdfe6;
        thead tr th{
            border-color: #dcdfe6;
        }
    } 
    .el-form-item__label {
        font-weight: bold;
        font-size: 15px;
    } 
 

} 
</style>