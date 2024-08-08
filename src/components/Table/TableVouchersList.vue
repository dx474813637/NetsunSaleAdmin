<template>
    <el-table 
        v-loading="loading" 
        :data="dataList" 
        style="width: 100%"  
        :highlight-current-row="isRadioGroup"
        @current-change="handleCurrentTableChange"
        :max-height="maxHeight" 
        >  
        <!-- <el-table-column label="用户" align="center" prop="user" width="60" ></el-table-column>  -->
        <el-table-column label="面额" align="center" prop="amount" width="120" ></el-table-column> 
        <el-table-column label="卡号" align="center" prop="id" ></el-table-column> 
        <el-table-column label="GUID" align="center" prop="guid" ></el-table-column> 
        <el-table-column label="创建时间" align="center" prop="ctime" ></el-table-column> 
        <!-- <el-table-column label="更新时间" align="center" prop="uptime" ></el-table-column>  -->
        <el-table-column label="状态" align="center" width="100" >
            <template #default="{ row }"> 
                <el-tag type="warning" v-if="row.zt == 1">已发送</el-tag>
                <el-tag type="success" v-else-if="row.zt == 2">已充值</el-tag>
                <el-tag type="primary" v-else>未使用</el-tag>
            </template>
        </el-table-column> 
        <el-table-column label="操作" align="center" width="100" v-if="isSendBtn">
            <template #default="{ row }"> 
                <el-button type="primary" size="small" v-if="row.zt == 0" @click="handleSendBtn(row)">发送短信</el-button>
            </template>
        </el-table-column> 
        <template #empty>
            <div class="u-flex u-flex-center u-p-t-20 u-p-b-20">
                <el-empty description="无数据" />
            </div>
        </template>
    </el-table>
    <div class="list-page-box u-p-t-20 u-p-b-20">
        <el-pagination
            v-model:current-page="curP"
            v-model:page-size="pageSize" 
            background
            layout="prev, pager, next, slot"
            :total="total" 
        >
            <el-text class="u-p-l-10 u-font-12 " type="info">共 {{ total }} 条数据</el-text>
        </el-pagination>
    </div> 
    <el-dialog v-model="dialogVisible">
        <img w-full style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
</template>

<script setup lang='ts'>
import { reactive,ref,computed, inject, onMounted, toRefs,watch } from 'vue'
import type { UploadFile  } from 'element-plus'
import { genFileId,ElNotification, ElMessage } from 'element-plus'
import { useVouchersStore } from '@/stores/vouchers'
import router from "@/router/guard" 
import { cateStore } from '@/stores/cate' 
import {useSettingsStore} from '@/stores/settings' 
const vouchers = useVouchersStore()
const { vouchers_amount, vouchers_amount_loading, page_update } = toRefs(vouchers)
const cate = cateStore()
const settings = useSettingsStore()
const { freight_list } = toRefs(cate)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const emit = defineEmits(["sendEvent", "updateBackEvent"]);
const props = defineProps({
    isRadioGroup: {
        type: Boolean,
        default: false
    },
    update: {
        type: Boolean,
        default: false
    },
    api: {
        type: String,
        default: 'vouchers'
    },
    isSendBtn: {
        type: Boolean,
        default: false
    },
    maxHeight: {
        type: [String, Number],
        default: 'auto'
    },
    customParams: {
        type: Object,
        default: () => ({})
    },
});
const currentRow = ref()
const $api:any = inject('$api')
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
    await getData()
    loading.value = false;

})
watch(
    () => [curP.value, props.customParams, props.update],
    async (val) => {
        loading.value = true; 
        await getData()
        loading.value = false; 
    },
    {deep: true}
)
watch(
    () => page_update.value,
    async (val) => {
        console.log('22', val)
        if(!val) return
        loading.value = true; 
        await getData()
        loading.value = false;
        page_update.value = false
    },
    {deep: true}
)
let uploadRefs2: any = [] 

const getData = async () => { 
    const res = await $api[props.api]({params: paramsObj.value, loading: false})
    if(res.code == 1) {
        // console.log(res)
        dataList.value = res.list 
        total.value = +res.total
        emit("updateBackEvent")
    }
   
}
  
const handleCurrentTableChange = (val: User | undefined) => { 
    if(!props.isRadioGroup) return 
    currentRow.value = val
}

const beforeProdOnChange = async (item) => {
    item.switchLoading = true  
    return new Promise(async (resolve, reject)=>{
        
        let res = await changeProductOnStatus(item) 
        item.switchLoading = false
        if(res.code == 1) { 
            ElNotification({
                title: '系统消息',
                message: res.msg,
                type: 'success',
                position: 'bottom-right',
            })
            return resolve(true)
        }else { 
            ElNotification({
                title: '系统消息',
                message: res.msg,
                type: 'success',
                position: 'bottom-right',
            })
            return resolve(false)
        } 
    })
    
}
function download(src) {
    window.open(src)
}
const changeProductOnStatus = async (prod) => { 
    const res = await $api.change_product_status({params: {id: prod.id}}); 
    return res
}

function handleSendBtn(data) {
    emit('sendEvent', {data})
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