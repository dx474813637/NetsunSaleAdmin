<template> 
    <div class="u-radius-8 card u-flex-column u-flex-items-start u-flex-center u-p-15 box-border u-m-b-20">
        <div class="card-header u-flex u-flex-items">
            <el-text tag="b" class="u-font-16" >保证金账户</el-text>
        </div>
        <div class="u-flex-1 u-flex">
            <el-statistic :precision="2" :value="amount" value-style="font-size: 24px; color: #f00" />
            <el-text class="u-m-l-5">元</el-text>
            <el-button size="small" type="danger" class="u-m-l-20" @click="router.push({name: 'bond_add', query: {cate: '1'}})">充值</el-button>
            <el-button size="small" type="primary" plain @click="router.push({name: 'bond_add', query: {cate: '2'}})" >提现</el-button>
        </div>
    </div> 
    <div>
        <div class="u-m-l-8 u-m-b-8">
            <el-text tag="b" class="u-font-16">业务流水</el-text>
        </div>
        <div>
            <DiyForm
                :ddata="diyFormData.data"
                :form="diyFormData.form"
                :name="diyFormData.name"
                :flex="diyFormData.flex"
                :align="diyFormData.align"
                :nowDialog="diyFormData"
                sureText="搜 索"
                showClear
                :isView="false"
                :showCancel="false"  
                @confirm="onDiyFormConfirm" 
                @remove="onDiyFormRemove" 
            ></DiyForm>
        </div>
        <el-table 
            v-loading="loading" 
            :data="dataList" 
            style="width: 100%"  
            :maxHeight="maxHeight" 
            >  
            <el-table-column prop="id" label="ID" />  
            <el-table-column prop="order" label="业务ID"  > 
                <template #default="{ row }">
                    <el-text>
                        <template v-if="row.order">{{ row.order }}</template> 
                        <template v-else >无</template>
                    </el-text>
                    <el-text type="primary" v-if="row.order" @click="router.push({name: 'bond_detail', params: {id: row.order}})" >
                        详情
                    </el-text>
                    <!-- <el-statistic :precision="2" :value="row.sale_money" value-style="font-size: 14px; color: #f00" /> -->
                </template>
            </el-table-column> 
            <el-table-column prop="cate" label="类型"  > 
                <template #default="{ row }">
                    <el-text>
                        <template v-if="row.cate == 1">收入</template>
                        <template v-else-if="row.cate == 2">支出</template>
                        <template v-else >{{ row.cate }}</template>
                    </el-text>
                    <!-- <el-statistic :precision="2" :value="row.sale_money" value-style="font-size: 14px; color: #f00" /> -->
                </template>
            </el-table-column> 
            <el-table-column prop="amount" label="金额"  > 
                <template #default="{ row }">
                    <el-statistic :precision="2" :value="row.amount" value-style="font-size: 14px; color: #f00" />
                </template>
            </el-table-column>   
            <el-table-column prop="info" label="备注"  > 
                <template #default="{ row }">
                    <el-text>{{ row.info }}</el-text>
                </template>
            </el-table-column>    
            <template #empty>
                <div class="u-flex u-flex-center u-p-t-20 u-p-b-20">
                    <el-empty description="无数据" />
                </div>
            </template>
        </el-table>
        
    </div>
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
import { reactive,ref,computed, inject, onMounted, watch } from 'vue'
import router from "@/router/guard" 
import { ElMessage } from "element-plus";
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
    api: {
        type: String,
        default: 'auto'
    },
    customParams: {
        type: Object,
        default: () => ({})
    },
});
const emit = defineEmits(["detailEvent"]);
const currentRow = ref()
const $api = inject('$api')
const dataList = ref([])
const loading = ref(false)
const curP = ref(1)
const amount = ref(0)
const total = ref(0)
const pageSize = ref(20)
const paramsObj = computed(() => {
    return {
        p: curP.value,
        ...diyFormData.data,
        ...props.customParams
    }
})
let diyFormData = reactive({
    title: "title", 
    name: "orderFilterForm",
    name2: "orderFilterForm2",
    show: true,
    data: {
        order: '',
        cate: ''
    },
    flex: 'row',
    align: 'start',
    form: 
    [
        {
            label: "业务ID",
            el: "input",
            prop: "order",
            class: 'width-auto',
            place: "业务ID", 
            required: false
        },  
        {
            label: "资金流向",
            el: "select",
            prop: "cate",
            props: {
                label: 'label',
                value: 'value'
            },
            class: 'width-auto',
            place: "资金流向", 
            required: false,
            options: [
                {
                    value: '',
                    label: '全部',
                },
                {
                    value: '1',
                    label: '收入',
                },
                {
                    value: '2',
                    label: '支出',
                },
            ]
        },  
    ], 
}) 
const defaultProps = {
  children: 'children',
  label: 'label',
}
onMounted(async () => { 
    refreshData()
})
watch(
    () => props.api,
    async (val) => {
        curP.value = 1
        refreshData()
    },
    {deep: true}
)
function detailBtn(item) {
    emit('detailEvent', item)
}
async function refreshData() {
    
    loading.value = true; 
    await getData()
    loading.value = false;
}
const getData = async () => { 
    if(!props.api) return
    const res = await $api[props.api]({params: paramsObj.value, loading: false}) 
    dataList.value = res.list 
    total.value = +res.total
    amount.value = +res.amount
}
 
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = async (val: number) => {
  console.log(`current page: ${val}`)
  await refreshData()
} 
 
async function getOrderStatusData(data) {
    let i = dataList.value.findIndex(ele => ele.id == data.id);
    if(i == -1) return
    if(dataList.value[i].loading) return;
    dataList.value[i].loading = true
    try {
        const res = await $api.sinopay({action: 'OUT_QUERY',  order_id: data.id }); 
        if(res.code == 1) {
            dataList.value[i].status = res.list.title

        }
    } catch (error) {
        
    }
    dataList.value[i].loading = false
   
} 

async function onDiyFormRemove() {
    loading.value = true; 
    await getData()
    loading.value = false;
}
async function onDiyFormConfirm(e) {  
    loading.value = true; 
    await getData()
    loading.value = false;
}
</script>
<style lang='scss' scoped>
@import "@/styles/table.scss";
// 
.el-tree {
    background-color: transparent;
}

.card {
	width: 100%; 
    border: 1px solid #eee;
}

</style>