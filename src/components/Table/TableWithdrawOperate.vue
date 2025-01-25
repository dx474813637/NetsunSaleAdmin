<template>
    <el-table 
        v-loading="loading" 
        :data="dataList" 
        style="width: 100%"  
        :maxHeight="maxHeight"
        :highlight-current-row="isRadioGroup"
        @current-change="handleCurrentTableChange"
        > 
        <el-table-column label="ID" :width="130" >
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
        <el-table-column label="备注" width="auto" >
            <template #default="{row}"> 
                <div>{{ row.info }}</div>  
            </template>
        </el-table-column>
        <el-table-column label="金额" >
            <template #default="{row}">  
                <div class="u-flex u-flex-items-end"> 
                    <el-statistic class="u-m-r-5 u-m-l-5 u-m-b-2 " value-style="font-size: 15px; " :value="row.money" precision="2" />
                    <el-text >元</el-text>
                </div>   
            </template>
        </el-table-column> 
        <el-table-column label="发票" align="center" width="auto" v-if="props.isFileUploadShow"> 
            <template #default="{row, $index}">  
                    <el-button 
                        type="warning" 
                        size="small" 
                        plain 
                        @click="showPopup(row)"
                    > {{ currentRow.zt == 1? '管理' : '预览' }}{{ row.fileList.length }}个文件(点击上传发票)</el-button> 
            </template>
        </el-table-column>
        <!-- <el-table-column label="状态" >
            <template #default="{row}"> 
                <div>{{ row.zt }}</div>  
            </template>
        </el-table-column>  -->
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
    <upload-fapiao-popup
        :show="uploadShow"  
        :title="uploadTitle"
        :list="uploadList"
        :imgDrag="false" 
        :readonly="currentRow.zt != 1"
        confirmShow
        @confirm="submitImgEvent"
        @setShow="setShow"
        @updateData="updateData" 
    ></upload-fapiao-popup> 
</template>

<script setup lang='ts'>
import { reactive,ref,computed, inject, onMounted } from 'vue'
import router from "@/router/guard" 
import { deepClone } from '@/utils';
import { ElMessage } from "element-plus";
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
    isFileUploadShow: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(["setCurrentRow"]);
const currentRow = ref({})
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
const uploadShow = ref(false) 
const uploadTitle = ref('发票管理') 
const defaultProps = {
  children: 'children',
  label: 'label',
}
const uploadList = computed(() => {
    let i = dataList.value.findIndex(ele => ele.id == currentRow.value?.id);
    if(i == -1) return [];
    return dataList.value[i].fileList
})
onMounted(async () => {
    loading.value = true; 
    try {
        await getData()
    } catch (error) {
        
    }
    
    loading.value = false;

})

function setShow(v) {
	uploadShow.value = v
}
function showPopup(data) {
    console.log(data)  
    currentRow.value = data
    setShow(true)
}
async function submitImgEvent(data) {
    let i = dataList.value.findIndex(ele => ele.id == currentRow.value.id);
    if(i == -1) return [];
    let img = data.map(ele => ele.url).join(',')  
    const res = await $api.operator_settlement_edit({id: currentRow.value.id, img: img})
    if(res.code == 1) {
        dataList.value[i].fileList = data;
        dataList.value[i].img = img; 
        ElMessage.success(res.msg)
    } 
}
async function updateData(data) {
    console.log(data, 'updateData')
    let i = dataList.value.findIndex(ele => ele.id == currentRow.value.id);
    if(i == -1) return [];
    let img = data.map(ele => ele.url).join(',')  
    dataList.value[i].fileList = data;
    dataList.value[i].img = img;  
    // refreshData()
}
const getData = async () => { 
    const res = await $api.operator_settlement_list({params: paramsObj.value, loading: false}) 
    dataList.value = res.list.map(ele => { 
        return {
            ...ele,
            fileList: ele.img ? ele.img.split(',')?.map(url => ({url})) || [] : []
        }
    }) 
    total.value = +res.total 
}
 
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = async (val: number) => {
  console.log(`current page: ${val}`)
  await refreshData()
} 

async function refreshData() {
    
    loading.value = true; 
    await getData()
    loading.value = false;
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