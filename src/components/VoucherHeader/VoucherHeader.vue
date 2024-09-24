<!--  -->
<template>
    <div>
        <div class="bg u-p-10 box-border u-p-l-20 u-p-r-20">
            <div v-if="showXcxMenus == 1"> 
                <div class="u-flex u-flex-items-center">
                    <img class="u-m-r-10" height="50" :src="`https://www.sunmaxx.cn/Public/fulizq/yhicon.png?time=${new Date().getTime()}`" alt="">
                    <div class="u-flex-1 u-flex-colum ">
                        <div>
                            <el-text class="u-font-20" style="color: #000">企业福利券</el-text>
                        </div>
                        <div>
                            <el-text type="info">仅用于发券，不可提现</el-text>
                        </div>
                    </div>
                </div> 
                <el-divider class="u-m-5 u-m-t-20" />
                <div class="u-flex u-flex-items-end u-flex-between" >  
                    <el-text type="info" class="u-font-14">福利券分发额度(可用)：</el-text>
                    <div >
                        <el-statistic :precision="2" :value="vouchers_amount"
                            value-style="font-size: 24px; color: #f00" /> 
                    </div> 
                </div> 
                <div class="u-flex u-flex-items-center u-flex-between" > 
                    <div class="">
                        <el-text type="info" class="u-font-14">福利券生成与发放：</el-text>
                    </div>
                    <div class="u-flex u-flex-items-center u-flex-wrap u-m-t-5"> 
                        <el-button plain type="primary" icon="circle-plus" @click="showAddBtn">添加福利券</el-button> 
                    </div>
                    
                </div>
            </div>
            <el-row :gutter="20" v-else> 
                <el-col :span="7" :xs="24" class="u-flex u-flex-items-center">
                    <img class="u-m-r-10" height="50" :src="`https://www.sunmaxx.cn/Public/fulizq/yhicon.png?time=${new Date().getTime()}`" alt="">
                    <div class="u-flex-1 u-flex-colum ">
                        <div>
                            <el-text class="u-font-20" style="color: #000">企业福利券</el-text>
                        </div>
                        <div>
                            <el-text type="info">仅用于发券，不可提现</el-text>
                        </div>
                    </div>
                </el-col>
                <el-col :span="7" :xs="24" class="u-flex u-flex-end">
                    <div class="u-flex-1 u-flex " style="width: 100%;">
                        <el-divider direction="vertical" style="height: 50px;" />
                        <div class="u-m-l-30">
                            <el-text type="info">福利券分发额度(可用)：</el-text>
                            <div class="u-m-t-5">
                                <el-statistic :precision="2" :value="vouchers_amount"
                                    value-style="font-size: 24px; color: #f00" /> 
                            </div>
                        </div>
                        <div class="u-flex-1 u-flex-end u-flex">
                            <el-divider direction="vertical" style="height: 50px;" />
                        </div>
                    </div>
                </el-col>
                <el-col :span="10" :xs="24" class="u-flex u-flex-end">
                    <div class="u-flex-1 u-flex-colum ">
                        <el-text type="info">福利券生成与发放：</el-text>
                        <div class="u-flex u-flex-items-center u-flex-wrap u-m-t-5"> 
                            <el-button plain type="primary" icon="circle-plus" @click="showAddBtn">添加福利券</el-button>
                            <el-button plain type="primary" icon="download" :disabled="downloadLoading" :loading="downloadLoading"
                                @click="downloadBtn">下载未使用福利券</el-button>
                            <el-button plain type="primary" icon="upload" @click="showExeUploadBtn">导入生成</el-button>
                        </div>
                    </div>
                    
                </el-col>
            </el-row>
        </div>
        
        <div class="u-m-t-10 box">
            <el-tabs v-model="tab_active" class="demo-tabs" @tab-change="tabsChangeEvent">
                <el-tab-pane v-for="item in tabs_list" :key="item.value" :label="item.label"
                    :name="item.value"></el-tab-pane>
            </el-tabs>
        </div>
        
        <upload-exe-popup
            :show="uploadShow"  
            :title="uploadTitle"
            :list="uploadList"
            @setShow="setShow2"
            @updateData="updateData"
        ></upload-exe-popup> 
        <add-voucher-popup :show="addVoucherShow" @setShow="setShow"></add-voucher-popup>
    </div>
</template>

<script setup lang='ts'>
import router from "@/router/guard"
import { useVouchersStore } from '@/stores/vouchers'
const vouchers = useVouchersStore()
const { vouchers_amount, vouchers_amount_loading, page_update } = toRefs(vouchers)
const $api: any = inject('$api')
import { userStore } from '@/stores/user'
const user = userStore()
const { showXcxMenus } = toRefs(user)

const downloadLoading = ref(false) 
const tab_active = ref('vouchers_list')
const addVoucherShow = ref(false); 
const tabs_list = ref([
    { label: '福利券列表', value: 'vouchers_list' },
    { label: '福利券使用列表', value: 'vouchers_list_used' },
])

const uploadShow = ref(false) 
const uploadTitle = ref('文件上传') 
const uploadList = ref([]) 
const routerName = computed(() => {
    return router.currentRoute.value.name
})
watch(
    () => routerName.value,
    (n) => {
        if (n) {
            console.log(n)
            tab_active.value = n
        }
    },
    {
        immediate: true
    }
)

function tabsChangeEvent() {
    console.log(tab_active.value)
    router.push({ name: tab_active.value })
    // detail_id.value = '';
}

function showAddBtn() {
    addVoucherShow.value = true
}
function showExeUploadBtn() {
    uploadShow.value = true
    // window.open('https://www.sunmaxx.cn/User/up_vouchers', '_blank', '');
}
async function downloadBtn() {
    downloadLoading.value = true
    try {
        await $api.down_vouchers_export({
            responseType: 'blob', //二进制流
            // headers: {
            //     'Content-Type': 'application/x-msdownload;charset=UTF-8'
            // }
        })
        // .then(res => {
        //     console.log(res)
        //     // 这里 data 是返回来的二进制数据
        //     var blob = new Blob([res], {
        //         type: "application/x-msdownload;charset=UTF-8",
        //     });
        //     // 创建一个blob的对象链接
        //     const url = window.URL.createObjectURL(blob);
        //     const link = document.createElement('a');
        //     link.href = url;
        //     // 把获得的blob的对象链接赋值给新创建的这个 a 链接
        //     link.setAttribute('download', '未使用福利券列表.xls'); // 设置下载文件名
        //     document.body.appendChild(link);
        //     // 使用js点击这个链接
        //     link.click();
        //     // document.body.removeChild(link) // 下载完成移除元素
        //     // window.URL.revokeObjectURL(url) // 释放blob对象
        // })
    } catch (error) {
        
    }
    downloadLoading.value = false
    
 
}

function setShow(v) {
    addVoucherShow.value = v
} 

function setShow2(v) {
	uploadShow.value = v
} 
function updateData(data) { 
    console.log(data)
}
</script>
<style lang='scss' scoped>
    
.card {
    width: 100%;
    background-color: #f5005a;
    color: #fff;
}
.bg {
    background-image: url("https://www.sunmaxx.cn/Public/fulizq/fulibg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat
}
.card-header {
    width: 100%;
}
 
</style>