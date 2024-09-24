<template>
    <el-table 
        v-loading="loading" 
        :data="list" 
        style="width: 100%"  
        :maxHeight="maxHeight"  
        > 
        <el-table-column prop="id" label="ID" width="70"   />  
        <el-table-column prop="name" label="公司名称"   />  
        <el-table-column label="开票信息"   > 
            <template #default="{ row }"> 
                <div>纳税人识别号: {{ row.no }}</div>
                <div>开户行: {{ row.bank }}</div>
                <div>银行账号: {{ row.account }}</div>
            </template>
        </el-table-column>
        <el-table-column label=""   > 
            <template #default="{ row }"> 
                <div>地址: {{ row.address }}</div>
                <div>电话: {{ row.tel }}</div>
                <div>邮箱: {{ row.email }}</div>
            </template>
        </el-table-column> 
        <el-table-column prop="aid" label="充值记录id"   />  
        <el-table-column prop="ctime" label="时间"   />  

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
const emit = defineEmits(["setCurrentRow" ]);
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
    const res = await $api.welfare_invoice_list({params: paramsObj.value, loading: false}) 
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