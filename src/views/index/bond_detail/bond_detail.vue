<template> 
<div class="u-p-20 u-font-14">
    <el-row :gutter="20" class="u-m-b-10" > 
        <el-col :span="24">
            业务ID： {{ list.id }}
        </el-col>
    </el-row>
    <el-row :gutter="20" class="u-m-b-10" >
        <el-col :span="24">
            订单ID/交易单号： {{ list.order || '无' }}
        </el-col>
    </el-row>
    <el-row :gutter="20" class="u-m-b-10" >
        <el-col :span="24" class="u-flex ">
            金额： <el-statistic class="u-m-l-10" :precision="2" :value="list.amount" value-style="font-size: 14px; color: #f00" />
        </el-col>
    </el-row>
    <el-row :gutter="20" class="u-m-b-10" >
        <el-col :span="24">
            类型： {{ list.cate == '1' ?  '收入' : '支出' }}
        </el-col>
    </el-row>
    <el-row :gutter="20" class="u-m-b-10" >
        <el-col :span="24">
            备注： {{ list.info }}
        </el-col>
    </el-row>
    <el-row :gutter="20" class="u-m-b-10" >
        <el-col :span="24">
            状态： {{ $filters.bond_status(list.zt) }}
        </el-col>
    </el-row>
</div>
    
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
}); 
const list = ref({})
const $api: any = inject('$api')  
const formRef = ref<FormInstance>()   
watch(
    () => props.id,
    async (newVal ) => {
        // console.log('id:' +newVal ); 
        if(!newVal) return
        await getData()
    },
    {immediate: true}
)  
async function getData() {
    const res = await $api.deposit_detail({loading: true, params: {id: props.id}})
    if(res.code == 1) {
        list.value = res.list
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