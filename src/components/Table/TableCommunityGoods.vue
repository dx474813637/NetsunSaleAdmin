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
        <el-table-column label="商品信息" :width="isH5? '300' :'auto'"  >
            <template #default="{row}">   
                <div class="u-flex u-flex-items-center " >
                    <div class="u-m-r-10" style="flex: 0 0 45px">
                        <el-image class="u-radius-5" lazy style="width: 45px; height: 45px" :src="row.product.img" fit="fill" />
                    </div> 
                    <div class="u-flex-1">
                        <el-text class="text-black" :underline="false" >
                            {{ row.product.name }} 
                        </el-text>   
                    </div>
                </div>
                
            </template>
        </el-table-column>   
        <el-table-column label="数量" width="120" >
            <template #default="{row}">
                <div>{{ row.num }}</div> 
            </template>
        </el-table-column>  
        <el-table-column label="sku" width="150" >
            <template #default="{row}">
                <div>{{ row.product.spec_no }}</div> 
            </template>
        </el-table-column>  
        <template #empty>
            <el-empty description="列表为空" />
        </template>
    </el-table> 
</template>

<script setup lang='ts'>
import { reactive,ref,computed, inject, onMounted } from 'vue'
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
    show: {
        type: Boolean,
        default: false
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
const paramsObj = computed(() => {
    return {
        p: curP.value,
        ...props.customParams
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
watch(
    () => props.show,
    async (n) => {
        if(n) {
            loading.value = true; 
            await getData()
            loading.value = false;
        }
        else {
            originData.value = {}
            dataList.value = []
        }
    },
    {
        immediate: true
    }
)
const defaultProps = {
  children: 'children',
  label: 'label',
}
onMounted(async () => { 
    
})

const getData = async () => { 
    const res = await $api.order_list2({params: paramsObj.value, loading: false}) 
    originData.value = res
    dataList.value = Object.values(res.list)  
    emit("returnData", res)
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