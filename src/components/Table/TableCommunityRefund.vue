<template>  
    <el-table 
        v-loading="loading" 
        :data="dataList" 
        style="width: 100%"  
        :maxHeight="maxHeight"
        :highlight-current-row="isRadioGroup"
        @current-change="handleCurrentTableChange"
        > 
        <!-- <el-table-column label="ID" :width="isRadioGroup ?70:50" >
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
        </el-table-column> -->   
        <el-table-column label="ID" prop="id" width="80" > 
        </el-table-column>   
        <el-table-column label="买家" width="160">
            <template #default="{row}">  
                <div  class="u-flex u-flex-items-center u-m-b-5">   
                    <el-tag size="small" type="primary">订单ID</el-tag>
                    <el-text class="u-m-l-5">{{ row.oid }}</el-text>  
                </div>
                <div  class="u-flex u-flex-items-center u-m-b-5">   
                    <el-text >{{ row.zname }}</el-text> 
                    <el-text  class="u-m-l-5">{{ row.ztel }}</el-text> 
                </div>
            </template>
        </el-table-column>   
        <el-table-column  label="内容">
            <template #default="{row}"> 
                <div v-for="item in row.pid"> 
                    <el-text class="u-m-r-15" type="danger" >数量：{{ item.num }}</el-text>
                    <el-text >{{ item.name }}</el-text> 
                </div>
            </template>
        </el-table-column>  
        <el-table-column label="自提点信息" >
            <template #default="{row}">   
                <div class="u-flex u-flex-items-center " > 
                    <el-tag size="small" type="primary">{{ row.address_name }}</el-tag> 
                    <el-tag size="small" class="u-m-l-5" type="info">{{ row.name }}</el-tag> 
                    <el-tag size="small" class="u-m-l-5" type="info">{{ row.tel }}</el-tag> 
                </div>
                <div class="u-flex u-flex-items-center u-m-t-8" > 
                    <el-text>{{ row.area_name }}</el-text>
                    <el-text>{{ row.address }}</el-text>
                </div>
                
            </template>
        </el-table-column>  
        <el-table-column label="时间" width="150" >
            <template #default="{row}">
                <div>{{ row.uptime }}</div> 
            </template>
        </el-table-column>  
    </el-table> 
</template>

<script setup lang='ts'>
import { reactive,ref,computed, inject, onMounted } from 'vue'
import locale from 'element-plus/dist/locale/zh-cn.mjs'  
import router from "@/router/guard" 
import { deepClone, initAddressData } from '@/utils';
import useProductSku from '@/hook/useProductSku'
import { genFileId,ElNotification, ElMessage } from 'element-plus' 
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
    customParams: {
        type: Object,
        default: () => ({})
    },
});
const emit = defineEmits(["setCurrentRow", "admin", "returnData"]);
const currentRow = ref()
const $api = inject('$api')
const dataList = ref([])
const originData = ref({})
const loading = ref(false)
const curP = ref(1) 
const pageSize = ref(20)
const riqi = ref('')
const paramsObj = computed(() => {
    return {
        p: curP.value, 
        ...props.customParams, 
    }
})
// watch(
//     () => props.aid,
//     async (n) => {
//         console.log(n)
//         if(n) {
//             loading.value = true; 
//             await getData()
//             loading.value = false;
//         }
//     },
//     {
//         immediate: true
//     }
// ) 
const defaultProps = {
  children: 'children',
  label: 'label',
}
onMounted(async () => { 
    
    loading.value = true; 
    await getData()
    loading.value = false;
})

const getData = async () => { 
    const res = await $api.order_community_refund({params: paramsObj.value, loading: false}) 
    originData.value = res
    dataList.value = res.list
    emit("returnData", res)
}
async function handleDateChange() {
    loading.value = true; 
    await getData()
    loading.value = false;
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
async function adminBtn(data) { 
    emit('admin', data)
}

</script>
<style lang='scss' scoped>
@import "@/styles/table.scss";
// 
.el-tree {
    background-color: transparent;
}
    ::v-deep {
        .el-table__header-wrapper {
            // display: none;
        }
    }
.table-box {
    ::v-deep { 
        .el-upload--picture-card { 
            --el-upload-picture-card-size: 55px;
        }
        .el-upload-list--picture-card .el-upload-list__item {
            --el-upload-list-picture-card-size: 55px;
        }
        .el-upload-list--picture-card .el-upload-list__item-actions span+span {
            margin-left: 8px
        }
            
        .limit {
            .el-upload--picture-card {
                display: none;
            }
            .el-upload-list--picture-card {
                display: flex;
            }
            .el-upload-list--picture-card .el-upload-list__item {
                margin: 0
            }
        }
    }
} 
</style>