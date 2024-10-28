<template>
    <el-table 
        v-loading="loading" 
        :data="addressList" 
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
        <el-table-column label="用户UID" width="120" align="center" >
            <template #default="{row}">
                <div>{{ row.login }}</div> 
            </template>
        </el-table-column>  
        <el-table-column label="联系人" >
            <template #default="{row}">
                <div class="u-flex">
                    <div>{{ row.name }}</div>
                    <el-text tag="b" type="danger" class="u-m-l-10" v-if="row.auto == 1" >默认</el-text> 
                </div>
                <div>{{ row.tel }}</div>
            </template>
        </el-table-column>
        <el-table-column label="自提点" >
            <template #default="{row}">
                <div>{{ row.address_name }}</div> 
            </template>
        </el-table-column>  
        <el-table-column label="详细地址" >
            <template #default="{row}">
                <div>{{ row.area_name }}</div>
                <div>{{ row.address }}</div>
            </template>
        </el-table-column>  
        <el-table-column label="创建时间" >
            <template #default="{row}">
                <div>{{ row.ctime }}</div> 
            </template>
        </el-table-column>  
        <el-table-column label="操作" >
            <template #default="{row, $index}">
                <el-button   
                    type="primary" 
                    size="small"  
                    plain
                    @click="adminBtn(row)"
                >管理</el-button>  
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
import { genFileId,ElNotification, ElMessage } from 'element-plus'
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
const emit = defineEmits(["setCurrentRow", "admin"]);
const currentRow = ref()
const $api = inject('$api')
const addressList = ref([])
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
    await getData()
    loading.value = false;

})

const getData = async () => { 
    const res = await $api.adress_list1({params: paramsObj.value, loading: false}) 
    addressList.value = res.list 
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