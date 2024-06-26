<template>
    <el-table 
        v-loading="loading" 
        :data="list" 
        style="width: 100%"  
        :maxHeight="maxHeight"  
        >  
        <el-table-column label="订单ID" width="90" align="center" >
            <template #default="{row}">
                <div class="u-flex-column"> 
                    <el-link type="primary" size="small"  @click="emit('detailEvent', row.order)">{{ row.order }}</el-link>
                </div>
                
            </template> 
        </el-table-column>
        <el-table-column prop="name" label="公司名称"  /> 
        <el-table-column prop="no" label="纳税人识别号" width="100"  /> 
        <el-table-column prop="address" label="地址" width="140"  /> 
        <el-table-column prop="tel" label="电话" width="80"  /> 
        <el-table-column prop="bank" label="开户行" width="100"  /> 
        <el-table-column prop="account" label="银行账号" width="100"  /> 
        <el-table-column prop="email" label="邮箱" width="100"  />  
        <el-table-column label="金额(元)" width="140" align="center"  >
            <template #default="{row}">
                <el-statistic :precision="2" :value="row.total_fee" value-style="font-size: 14px; color: #f00" /> 
            </template> 
        </el-table-column>  
        <el-table-column label="状态" width="80" align="center"  >
            <template #default="{row}">
                <el-text type="success" v-if="row.zt == 2">已开票</el-text>
            </template> 
        </el-table-column>  
        <el-table-column label="操作" align="center" width="80" > 
            <template #default="{row}">
                <div class="u-flex u-flex-center"> 
                    <div  v-if="row.zt != 2">
                        <el-popconfirm 
                            title="同意确认" 
                            @confirm="kaipiao({id: row.id})"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            >
                            <template #reference>
                                <el-button class="u-m-b-5" plain type="primary" size="small">开票</el-button>	 
                            </template>
                        </el-popconfirm> 
                    </div> 
                </div>
                <div class="u-flex u-flex-center"> 
                    <el-button plain type="primary" size="small" @click="copyInfo(row)">复制</el-button>
                </div>
                
               
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
            small
            background
            layout="prev, pager, next, slot"
            :total="total" 
        >
            <span class="u-p-l-10">共 {{ total }} 条数据</span>
        </el-pagination>
    </div>  
</template>

<script setup lang='ts'>
import { reactive,ref,computed, inject, onMounted, watch } from 'vue'
import router from "@/router/guard"  
import { genFileId,ElNotification, ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores/settings' 
const settings = useSettingsStore()
const { isH5 } = toRefs(settings)
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
    customParams: {
        type: Object,
        default: () => ({})
    },
}); 
const dialogVisible = ref(false)
const $api = inject('$api')
const list = ref([])
const loading = ref(false)
const curP = ref(1)
const total = ref(0)
const pageSize = ref(20) 
const curRowId = ref('')
const expressRef = ref()
const paramsObj = computed(() => {
    return {
        p: curP.value,
        ...props.customParams
    }
}) 
// const deliveryList = ref([]) 
const expressForm = ref({
    express: '',
    // delivery_id: ''
})

const rules = {
	express: [{
		required: true,
		message: '请输入快递单号',
		trigger: ['blur', 'change']
	}],
	// delivery_id: [{
	// 	required: true,
	// 	message: '请选择快递公司',
	// 	trigger: ['blur', 'change']
	// }], 
}
const emit = defineEmits(["detailEvent", "expressNoEvent"]);
onMounted(async () => {
	// getDeliveryListData()
    loading.value = true; 
    await getData()
    loading.value = false;

})
// const getDeliveryListData = async () => { 
//     const res = await $api.delivery_list({loading: false}) 
//     if(res.code == 1) {
//         deliveryList.value = res.list 
//     }
// }
watch(
    () => [curP.value, props.customParams],
    async (val) => {
        loading.value = true; 
        await getData()
        loading.value = false;
    },
    {deep: true}
)
function handleExpressClick(data) {
    emit('expressNoEvent', {no: data.express})
}
const getData = async () => { 
    const res = await $api.invoice_list({params: paramsObj.value, loading: false}) 
    if(res.code == 1) {
        list.value = res.list
        total.value = +res.total 
    }
}
async function kaipiao ({id}) {
    const res = await $api.fapiao({params: { id }})
	if(res.code == 1) {
		ElMessage.success(res.msg)
        await getData()
	}
} 
function close() {
    // expressForm.value.delivery_id = ''
    expressForm.value.express = ''
    expressRef.value.resetFields()
}

function copyInfo(data) {
    let content = `订单ID：${data.order}
公司名称：${data.name}
纳税人识别号：${data.no}
地址：${data.address}
电话：${data.tel}
开户行：${data.bank}
银行账号：${data.account}
邮箱：${data.email}
金额(元)：${data.total_fee}`
    let flag = exeCommandCopyText(content)
    if(flag) {
        ElMessage.success('复制成功')
    }
    else { 
        ElMessage.error('复制失败')
    } 
}
function exeCommandCopyText(text) {
    try {
        const t = document.createElement('textarea')
        t.nodeValue = text
        t.value = text
        document.body.appendChild(t)
        t.select()
        document.execCommand('copy');
        document.body.removeChild(t)
        return true
    } catch (e) {
        console.log(e)
        return false
    }
} 
</script>
<style lang='scss' scoped>
@import "@/styles/table.scss";
// 
.el-tree {
    background-color: transparent;
}
</style>