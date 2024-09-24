<template>
    <div class="u-flex u-flex-end u-m-b-8" v-if="button == 1" > 
        <el-button type="primary" plain @click="$router.push({name: 'coupon_add'})" >优惠活动添加</el-button>
    </div>
    <el-table 
        v-loading="loading" 
        :data="list" 
        style="width: 100%"  
        :maxHeight="maxHeight"  
        > 
        <el-table-column prop="id" label="ID" width="70" align="center"  />  
        <el-table-column label="活动内容" width="200" > 
            <template #default="{ row }">
                <div>
                    <el-text>满</el-text>
                    <el-text type="error" >{{ row.full }}</el-text>
                    <el-text>元</el-text>
                </div>
                <div>
                    <el-text>减</el-text>
                    <el-text type="error">{{ row.minus }}</el-text>
                    <el-text>元</el-text>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="活动介绍" > 
            <template #default="{ row }">
                <div v-html="row.info"></div> 
            </template>
        </el-table-column>
        <el-table-column label="活动时间" > 
            <template #default="{ row }">
                <div> 
                    开始时间：{{ row.begin }} 
                </div>
                <div> 
                    结束时间：{{ row.end }} 
                </div>
            </template>
        </el-table-column>
        <!-- <el-table-column label="活动图片" width="auto"  align="center" > 
            <template #default="{ row }">
                <div class="u-p-t-10"> 
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
                </div>
                
                
            </template>
        </el-table-column> -->
        <el-table-column prop="ctime" label="创建时间" width="auto" align="center"  /> 
        <el-table-column label="状态"  align="center" > 
            <template #default="{ row }">
                <div class="u-flex u-flex-center">
                    <el-button :type="row.zt == 1 ? 'success' : 'primary'" plain size="small" @click="$router.push({name: 'coupon_edit', query:{id: row.id}})">
                        {{ row.zt == 1 ? '预览' : '编辑'}}
                    </el-button> 
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
const button = ref(0)
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
    const res = await $api.coupon_list({params: paramsObj.value, loading: false}) 
    if(res.code == 1) {
        list.value = res.list
        total.value = +res.total
        button.value = res.button
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