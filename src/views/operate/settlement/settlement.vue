<!--  -->
<template>
  <div class="box">
    <el-row class="u-p-10" :gutter="10">
        <el-col :span="24" :xs="24" >
            <el-card  shadow="hover">
                <div >
                    <div class="u-flex u-flex-items-center u-m-b-5">
                      <div class="flex flex-col items-start gap-4">
                        <el-segmented size="large" v-model="segmented_value" :options="segmented_list" :disabled="loading" >
                          <template #default="scope"> 
                              <div>{{ scope.item.label }}</div> 
                          </template>
                        </el-segmented>
                      </div> 
                    </div> 
                    <el-row :gutter="10" class="u-m-t-15" v-loading="loading">
                        <el-col :span="12" :xs="24" >
                          <div class="u-flex u-flex-items-center u-p-12 u-flex-between u-radius-5" style="background-color: var(--el-color-primary-light-9)" > 
                                <div class="item">
                                    <div>
                                        <div class="u-flex u-flex-items-center">
                                            <el-text class="u-font-15">{{ initData.today_title }}</el-text>
                                            <el-icon   
                                              class="u-m-l-5 u-font-16" 
                                              style="cursor: pointer;"
                                              color="#aaa" 
                                              @click="openShow('today')"  
                                            ><QuestionFilled /></el-icon> 
                                        </div>  
                                    </div>
                                    
                                </div>
                                <div class="item u-flex u-flex-items-center" style="height: 24px; line-height: 24px;">
                                    <el-statistic value-style="font-size: 18px;" :value="initData.today" precision="2" /> 
                                    <el-text class="u-m-l-5 u-font-16" >元</el-text>
                                </div>
                                
                            </div>  
                                
                        </el-col>
                        <el-col :span="12" :xs="24" > 
                            <div class="u-flex u-flex-items-center u-p-12 u-flex-between u-radius-5" style="background-color: var(--el-color-primary-light-9)" > 
                                <div class="item">
                                    <div>
                                        <div class="u-flex u-flex-items-center">
                                            <el-text class="u-font-15">{{ initData.settlement_title }}</el-text> 
                                            <el-icon   
                                              class="u-m-l-5 u-font-16" 
                                              style="cursor: pointer;"
                                              color="#aaa"   
                                              @click="openShow('settlement')"  
                                            ><QuestionFilled /></el-icon> 
                                        </div>  
                                    </div>
                                    
                                </div>
                                <div class="item u-flex u-flex-items-center" style="height: 24px; line-height: 24px;">
                                    <el-statistic value-style="font-size: 18px;" :value="initData.settlement" precision="2" /> 
                                    <el-text class="u-m-l-5 u-font-16" >元</el-text>
                                </div>
                                
                            </div>  
                                
                        </el-col>
                    </el-row> 
                      
                </div>  
            </el-card>
            
        </el-col> 
    </el-row> 
    <div  class="u-p-10 ">
        <div class="u-p-10 u-flex u-flex-items-center">
            <el-icon color="#666"><Document /></el-icon>
            <el-text class="text-bold u-m-l-6" size="large">提现记录</el-text>
        </div>
        <table-withdraw-operate isFileUploadShow ></table-withdraw-operate>
    </div>
    
    <el-dialog  
      v-model="dialogTableVisible" 
      destroy-on-close 
      draggable 
      width="800px" 
      :title="title"  
      :close-on-press-escape="false" 
      >
      <div v-html="context"></div>
    </el-dialog>
  </div>
  
</template>

<script setup lang='ts'>
import { computed, ref, inject, nextTick, onMounted } from 'vue'
import { genFileId, ElMessage } from 'element-plus'  
const $api: any = inject('$api')
const segmented_list = ref([
	{ label: '商家', value: 'operator_settlement' },
	{ label: '团长', value: 'operator_settlement1' }, 
])
const segmented_value = ref('operator_settlement') 
const money_info_key = ref('today');
const loading = ref(false);
const dialogTableVisible = ref(false);

const initData = ref({
  settlement: 0,
  settlement_info: '',
  settlement_title: '可提现',
  today: 0,
  today_info: '',
  today_title: '今日预估收入',
})
const title = computed(() => {
  return initData.value[`${money_info_key.value}_title`]
})
const context = computed(() => {
  return initData.value[`${money_info_key.value}_info`]
})
const customParams = computed(() => {
	return {
		sid: detail_id.value
		// type: value.value,
		// role: role.value
	}
}) 
const detail_id = ref(''); 
onMounted(async () => { 
  await getInitData()
}) 
watch(
  () => segmented_value.value,
  async (n) => {
    await getInitData()
  }
)
function openShow(key) {
  dialogTableVisible.value = true
  money_info_key.value = key
}
async function getInitData() {
  if(loading.value) return
  loading.value = true
  try {
    const res = await $api[segmented_value.value]()
    if(res.code == 1) {
      initData.value = res.price
    }
  } catch (error) {
    
  }
  loading.value = false
  
}
</script> 
<style lang='scss' scoped>
.box {
	@extend %box-sizing;
  
}
.box .el-segmented {
  --el-segmented-item-selected-color: var(--el-text-color-primary);
  --el-segmented-item-selected-bg-color: #ffd100;
  --el-border-radius-base: 25px;
}
</style>