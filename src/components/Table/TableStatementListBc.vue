<template>
    <el-table 
        v-loading="loading" 
        :data="dataList" 
        style="width: 100%"  
        :maxHeight="maxHeight" 
        >  
        <el-table-column prop="oid" label="订单ID" />  
        <el-table-column prop="total_fee" label="金额"  > 
            <template #default="{ row }">
                <el-statistic :precision="2" :value="row.total_fee" value-style="font-size: 14px; color: #f00" />
            </template>
        </el-table-column> 
        <el-table-column prop="info" label="备注" />  
        <el-table-column prop="ctime" label="时间" />   
        <template #empty>
            <div class="u-flex u-flex-center u-p-t-20 u-p-b-20">
                <el-empty description="无数据" />
            </div>
        </template>
    </el-table> 
</template>

<script setup lang='ts'>
import { reactive,ref,computed, inject, onMounted, watch } from 'vue'
import router from "@/router/guard" 
import { ElMessage } from "element-plus";
import { deepClone } from '@/utils';
import useProductSku from '@/hook/useProductSku'
const {
    sku2treeData
} = useProductSku()
const props = defineProps({
    dataList: {
        type: Boolean,
        default: false
    }, 
    maxHeight: {
        type: [String, Number],
        default: 'auto'
    }, 
});
const emit = defineEmits(["detailEvent"]);
const currentRow = ref()
const $api = inject('$api') 
const loading = ref(false) 
onMounted(async () => { 
})     
  

</script>
<style lang='scss' scoped>
@import "@/styles/table.scss";
// 
.el-tree {
    background-color: transparent;
}
</style>