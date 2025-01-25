<template>
    <el-table 
        v-loading="loading" 
        :data="dataList" 
        style="width: 100%"  
        :maxHeight="maxHeight"
        :highlight-current-row="isRadioGroup"
        @current-change="handleCurrentTableChange"
        > 
        <el-table-column label="ID" :width="isRadioGroup ?70:50" >
            <template #default="{ row }">
                <div class="u-flex">
                    <span>{{ row.id }}</span> 
                    <span class="u-m-l-10" v-if="isRadioGroup && currentRow && currentRow.id == row.id ">
                        <el-Icon color="#ff0000">
                            <i-ep-CircleCheck></i-ep-CircleCheck>
                        </el-Icon>
                    </span>
                </div>
                
            </template>
        </el-table-column>
        <el-table-column label="内容" >
            <template #default="{row}"> 
                <div>{{ row.bank_memo }}</div>  
            </template>
        </el-table-column>
        <el-table-column label="金额" >
            <template #default="{row}">  
                <div class="u-flex u-flex-items-end"> 
                    <el-statistic class="u-m-r-5 u-m-l-5 u-m-b-2 " value-style="font-size: 13px; " :value="row.amount/100" precision="2" />
                    <el-text class="u-m-r-5">元</el-text>
                </div>   
            </template>
        </el-table-column> 
        <el-table-column label="状态" >
            <template #default="{row}"> 
                <div>{{ row.status }}</div>  
            </template>
        </el-table-column> 
        <el-table-column label="时间" >
            <template #default="{row}">
                <div>{{ row.ctime }}</div> 
            </template>
        </el-table-column>  
        <template #empty>
            <el-empty description="列表为空" />
        </template>
    </el-table>
    <div class="list-page-box u-p-t-20 u-p-b-20">
        <el-pagination
            v-model:current-page="curP"
            :page-size="pageSize"
            small
            background
            layout="prev, pager, next, slot"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        >
            <span class="u-p-l-10">共 {{ total }} 条数据</span>
        </el-pagination>
    </div> 
</template>

<script setup lang='ts'>
import { reactive,ref,computed, inject, onMounted } from 'vue'
import router from "@/router/guard" 
import { deepClone } from '@/utils';
import useProductSku from '@/hook/useProductSku'
const {
    sku2treeData
} = useProductSku()
const props = defineProps({
    isRadioGroup: {
        type: Boolean,
        default: false
    },
    isEditBtn: {
        type: Boolean,
        default: false
    },
    maxHeight: {
        type: [String, Number],
        default: 'auto'
    },
    currentRow: {
        type: Object,
        default: () => ({})
    },
});
const emit = defineEmits(["setCurrentRow"]);
const currentRow = ref()
const $api = inject('$api')
const dataList = ref([])
const loading = ref(false)
const curP = ref(1)
const total = ref(0)
const pageSize = ref(20)
const paramsObj = computed(() => {
    return {
        p: curP.value
    }
})
const defaultProps = {
  children: 'children',
  label: 'label',
}
onMounted(async () => {
    loading.value = true; 
    try {
        await getData()
    } catch (error) {
        
    }
    
    loading.value = false;

})

const getData = async () => { 
    const res = await $api.fund_withdraw_list({params: paramsObj.value, loading: false}) 
    dataList.value = res.list
    total.value = +res.total 
}
 
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
} 

const handleCurrentTableChange = (val, oldVal) => { 
    if(!props.isRadioGroup) return 
    console.log(val, oldVal)
    currentRow.value = val
    emit('setCurrentRow', {val, oldVal})
}

</script>
<style lang='scss' scoped>
@import "@/styles/table.scss";
// 
.el-tree {
    background-color: transparent;
}
</style>