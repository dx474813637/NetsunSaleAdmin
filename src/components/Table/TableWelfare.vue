<template>
    <el-table 
        v-loading="loading" 
        :data="list" 
        style="width: 100%"  
        :maxHeight="maxHeight"  
        > 
        <el-table-column prop="id" label="ID" width="70" align="center"  /> 
        <el-table-column label="付款账户信息" align="center" > 
            <template #default="{ row }">
                <div v-if="row.name">付款户名:{{ row.name }}</div>
                <div v-if="row.bank">开户行:{{ row.bank }}</div>
                <div v-if="row.bankno">付款账号:{{ row.bankno }}</div>
                <div v-if="row.remarks">备注:{{ row.remarks }}</div> 
            </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额/元" width="200" > 
            <template #default="{ row }">
                <el-statistic :precision="2" :value="row.amount" value-style="font-size: 14px; color: #f00" />
            </template>
        </el-table-column>
        <el-table-column label="充值凭证" width="auto"  align="center" > 
            <template #default="{ row }">
                <div class="u-p-t-10">
                    <el-badge :value="row.img.split(',').length" class="item">
                        <el-image
                            style="width: 55px; height: 55px"
                            :src="row.img.split(',')[0]"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            class="u-radius-5"
                            :min-scale="0.2"
                            :preview-src-list="row.img.split(',')"
                            :initial-index="0"
                            :zIndex="500"
                            preview-teleported
                            fit="cover"
                        />
                    </el-badge>
                </div>
                
                
            </template>
        </el-table-column>
        <el-table-column prop="ctime" label="时间" width="auto" align="center"  /> 
        <el-table-column label="状态"  align="center" > 
            <template #default="{ row }">
                <div class="u-flex u-flex-center">
                    <template v-if="row.zt == '1'">
                        <el-text type="success" >通过</el-text>  
                    </template>
                    <template v-else-if="row.zt == '2'">
                        <el-text type="danger" >拒绝</el-text>  
                    </template>
                    <template v-else>
                        <el-text type="info" >审核中</el-text>  
                    </template>
                </div> 
                <template v-if="row.fapiao == '1'">
                    <el-button class="u-m-t-8" type="primary" plain size="small" @click="emit('addInvoiceEvent', row)">申请发票</el-button>
                </template> 
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
const emit = defineEmits(["setCurrentRow", "addInvoiceEvent"]);
const currentRow = ref()
const $api = inject('$api')
const list = ref([])
const loading = ref(false)
const curP = ref(1)
const total = ref(0)
const pageSize = ref(20)
const paramsObj = computed(() => {
    return {
        p: curP.value,
        ...props.customParams
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
    () => [curP.value, props.customParams],
    async (val) => {
        loading.value = true; 
        await getData()
        loading.value = false;
    },
    {deep: true}
)
const getData = async () => { 
    const res = await $api.welfare_list({params: paramsObj.value, loading: false}) 
    if(res.code == 1) {
        list.value = res.list
        total.value = +res.total
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