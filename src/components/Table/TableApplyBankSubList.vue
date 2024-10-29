<template> 
    <el-form ref="formRef" :model="dynamicValidateForm" >
        <el-row :gutter="20" class="u-m-b-10">
            <el-col :span="10" :xs="24">
                <el-form-item label="省份" prop="organization_type">
                    <el-cascader
                        v-model="dynamicValidateForm.bank_province"
                        style="width: 100%;"
                        placeholder="请选择省份，可输入关键字筛选"
                        :options="provinces"
                        :props="{
                            value: 'province_code',
                            label: 'province_name'
                        }"
                        filterable
                        clearable
                    />
                </el-form-item>
            </el-col>
            <el-col :span="10" :xs="24">
                <el-form-item prop="bank_city" label="城市">
                    <el-cascader 
                        v-model="dynamicValidateForm.bank_city"
                        style="width: 100%;"
                        v-loading="cityloading"
                        placeholder="请选择城市，可输入关键字筛选"
                        :options="bank_city_list"
                        :props="{
                            value: 'city_code',
                            label: 'city_name'
                        }"
                        filterable
                        clearable
                    />
                </el-form-item>
            </el-col>
            <el-col :span="4" :xs="24">
                <el-button type="danger" @click="refreshData" style="width: 100%;" plain>搜索</el-button>
            </el-col>
        </el-row>
    </el-form>
    
    <el-table 
        v-loading="loading" 
        :data="dataList" 
        style="width: 100%"  
        :maxHeight="maxHeight"
        :highlight-current-row="isRadioGroup"
        @current-change="handleCurrentTableChange"
        > 
        <el-table-column label="ID" >
            <template #default="{ row }">
                <div class="u-flex">
                    <span>{{ row.bank_branch_id }}</span> 
                    <span class="u-m-l-10" v-if="isRadioGroup && currentRow && currentRow.bank_branch_id == row.bank_branch_id ">
                        <el-Icon color="#ff0000">
                            <i-ep-CircleCheck></i-ep-CircleCheck>
                        </el-Icon>
                    </span>
                </div>
                
            </template>
        </el-table-column>
        <el-table-column prop="bank_branch_name" label="银行名称" />    
        <template #empty>
            <div class="u-flex u-flex-center u-p-t-20 u-p-b-20">
                <el-empty description="无数据" />
            </div>
        </template>
    </el-table>
    <!-- <div class="list-page-box u-p-t-20 u-p-b-20">
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
    </div>  -->
</template>

<script setup lang='ts'>
import { reactive,ref,computed, inject, onMounted } from 'vue'
import router from "@/router/guard" 
import { ElMessage } from "element-plus";
import { deepClone } from '@/utils'; 
import { watch } from 'vue';
const props = defineProps({
    isSearchBar: {
        type: Boolean,
        default: false
    },
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
    terms: {
        type: String,
        default: ''
    },
    params: {
        type: Object,
        deafult: () => ({})
    },
    initData: {
        type: Object,
        deafult: () => ({})
    },
});
const emit = defineEmits(["setCurrentRow"]);
const dynamicValidateForm = reactive({
    bank_province: '',
    bank_city: ''
})
const currentRow = ref({})
const $api = inject('$api')
const dataList = ref([])
const bank_city_list = ref([])
const loading = ref(false)
const cityloading = ref(false)
const curP = ref(1)
const total = ref(0)
const pageSize = ref(20)
const paramsObj = computed(() => {
    return {
        p: curP.value,
        city_code: dynamicValidateForm.bank_city[0],
        ...props.params, 
    }
})
const terms = ref('')
const defaultProps = {
  children: 'children',
  label: 'label',
}
const provinces = computed(() => props.initData.provinces || [])
onMounted(async () => {
    // refreshData()
})
watch(
    () => dynamicValidateForm.bank_province,
    async (n) => {  
        if(n[0]) {
            getCityList()
        }
    },
    { deep: true }
)
watch(
    () => props.params,
    async (n) => {
        console.log(n)
        initData()
        // if(Object.values(n).every(ele => ele)) {
        //     await refreshData()
        // }  
    },
    { 
        deep: true
    }
)
 
async function getCityList() {
    cityloading.value = true
    const res = await $api.search_city({params: {province_code: dynamicValidateForm.bank_province[0]}})
    cityloading.value = false
    if(res.code == 1) {
        bank_city_list.value = res.list.data
    }
}
function initData() {
    currentRow.value = {}
    dataList.value = [] 
}
async function refreshData() {
    initData()
    loading.value = true; 
    await getData()
    loading.value = false;
}

const getData = async () => { 
    // if(!paramsObj.value.name) return
    const res = await $api.search_branches({params: {...paramsObj.value}}) 
   
    if(res.code == 1) {
        dataList.value = res.list.data
        total.value = res.list.total_count
    }
}
 
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = async (val: number) => {
  console.log(`current page: ${val}`)
  await refreshData()
} 

const handleCurrentTableChange = (val: any | undefined) => {  
    if(!props.isRadioGroup) return 
    currentRow.value = val || {}
    emit('setCurrentRow', {data: deepClone(currentRow.value)})
} 

</script>
<style lang='scss' scoped>
@import "@/styles/table.scss";
// 
.el-tree {
    background-color: transparent;
}
</style>