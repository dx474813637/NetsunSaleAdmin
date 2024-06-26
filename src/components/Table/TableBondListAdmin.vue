<template>
    <div>
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
            :highlight-current-row="isRadioGroup"
            @current-change="handleCurrentTableChange"
            > 
            <el-table-column prop="id" label="ID" />  
            <el-table-column prop="order" label="交易单号"  > 
                <template #default="{ row }">
                    <el-text>
                        <template v-if="row.order">{{ row.order }}</template> 
                        <template v-else >无</template>
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
            <el-table-column prop="info" label="状态"  > 
                <template #default="{ row }">
                    <el-text>{{ $filters.bond_status(row.zt) }}</el-text>
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
    }
});
const emit = defineEmits(["setCurrentRow"]);
const currentRow = ref()
const $api = inject('$api')
const dataList = ref([])
const loading = ref(false)
const curP = ref(1)
const total = ref(0)
const pageSize = ref(20)
const paramsObj = computed(() => {
    return {
        p: curP.value,
        ...diyFormData.data,
    }
})
let diyFormData = reactive({
    title: "title", 
    name: "bondFilterForm",
    name2: "bondFilterForm2",
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
            label: "交易单号",
            el: "input",
            prop: "order",
            class: 'width-auto',
            place: "交易单号", 
            required: false
        },  
        {
            label: "保证金类型",
            el: "select",
            prop: "cate",
            props: {
                label: 'label',
                value: 'value'
            },
            class: 'width-auto',
            place: "保证金类型", 
            required: false,
            options: [
                {
                    value: '',
                    label: '全部',
                },
                {
                    value: '1',
                    label: '增加',
                },
                {
                    value: '2',
                    label: '退还',
                },
            ]
        },  
    ], 
}) 
watch(
    () => router.currentRoute.value.query.order,
    (n) => {
        if(n) diyFormData.data.order = n
    }
)
const defaultProps = {
  children: 'children',
  label: 'label',
}
onMounted(async () => {
    refreshData()
})
async function refreshData() {
    
    loading.value = true; 
    await getData()
    loading.value = false;
}
const getData = async () => { 
    const res = await $api.deposit2({params: paramsObj.value, loading: false}) 
    dataList.value = res.list 
    total.value = +res.total
}
 
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = async (val: number) => {
  console.log(`current page: ${val}`)
  await refreshData()
} 

const handleCurrentTableChange = (val: User | undefined) => { 
    if(!props.isRadioGroup) return 
    currentRow.value = val
    emit('setCurrentRow', {value: deepClone(currentRow.value)})
} 

async function onDiyFormRemove() {
    await refreshData()
}
async function onDiyFormConfirm(e) {  
    await refreshData()
}

</script>
<style lang='scss' scoped>
@import "@/styles/table.scss";
// 
.el-tree {
    background-color: transparent;
}
</style>