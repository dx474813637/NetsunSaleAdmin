<template> 
    <div class="u-p-5 u-p-l-10 u-p-r-10 box-border">
        <!-- <div class="">
            <div class="u-p-10 u-flex u-flex-items-center">
                <el-icon color="#666"><Document /></el-icon>
                <el-text class="text-bold u-m-l-6" size="large">账户信息</el-text>
            </div> 
        </div>  -->
        <el-alert class="u-m-b-10" v-if="applyments_alert" :title="applyments_alert" type="warning" /> 
        <div class="u-m-b-10">
            <el-card  shadow="none" class="bg" style="width: 100%; border: none;" v-loading="applyments_detail_loading">
                <el-row :gutter="20" > 
                    <el-col :span="8" :xs="24" class="u-flex u-flex-items-center">
                        <img class="u-m-r-10" height="50" :src="`https://www.sunmaxx.cn/Public/fulizq/yhicon.png?time=${new Date().getTime()}`" alt="">
                        <div class="u-flex-1 u-flex-colum ">
                            <div>
                                <el-text class="u-font-20" style="color: #000">{{ applyments_detail.store_name || '无' }}</el-text>
                            </div>
                            <div>
                                <el-text type="info">{{ applyments_detail.merchant_name || '无' }}</el-text>
                            </div>
                        </div>
                    </el-col> 
                    <el-col :span="16" :xs="24" class="u-flex u-flex-end">
                        <div class="u-flex-1 u-flex-colum ">
                            <el-text type="info">
                                账户状态：{{ $filters.applyments_status(applyments_zt) }}
                                <template v-if="applyments_zt != '2'"> - {{ applyments_detail.reason}}</template>
                            </el-text>
                            <div class="u-flex u-flex-items-center u-flex-wrap u-m-t-5"> 
                                <el-button type="primary" size="small" 
                                    @click="router.push({name: 'applyments' })" 
                                    v-if="!applyments_detail.hasOwnProperty('id')"
                                >账户申请</el-button> 
                                <el-button type="primary" size="small" 
                                    @click="router.push({name: 'applyments', query: {mode: 'edit'}})" 
                                    v-if="applyments_zt == '0'"
                                >编辑信息</el-button>   
                                <el-button type="warning" size="small" 
                                    @click="router.push({name: 'applyments', query: {mode: 'readonly'}})" 
                                    v-if="applyments_detail.hasOwnProperty('id')"
                                >预览详情</el-button> 
                                <el-popconfirm 
                                    title="确认提交申请"  
                                    @confirm="submitBtn"
                                    confirm-button-text="确认"
                                    cancel-button-text="取消">
                                    <template #reference>
                                        <el-button type="danger" size="small" v-if="applyments_zt == '0'">提交申请</el-button> 
                                    </template> 
                                </el-popconfirm>
                            </div>
                        </div>
                        
                    </el-col>
                </el-row>
                <template v-if="applyments_sign.hasOwnProperty('applyment_id')">
                    <el-divider border-style="dashed" />
                    <el-row :gutter="20" >
                        <el-col :span="8" :xs="24">
                            <div class="u-flex u-flex-items-center u-m-b-10">
                                <el-tag type="danger">签约状态</el-tag>
                                <el-text class="u-m-l-10">{{ applyments_sign.applyment_state_desc }}</el-text>
                            </div>  
                            <div class="u-flex u-flex-items-start u-m-b-10" v-if="applyments_sign.sign_url">
                                <el-tag type="danger">法人扫码下一步</el-tag>
                                <el-text class="u-m-l-10">
                                    <el-image
                                        style="width: 100px; height: 100px"
                                        :src="applyments_sign.sign_url" 
                                        :preview-src-list="[applyments_sign.sign_url]"
                                        :initial-index="0"
                                        fit="cover"
                                        />
                                </el-text>
                            </div> 
                        </el-col> 
                    </el-row> 
                </template>
            </el-card>
            <!-- <el-card  shadow="hover" style="width: 100%;" v-loading="applyments_detail_loading">
                <div> 
                    <el-row :gutter="20" >
                        <el-col :span="8" :xs="24">
                            <div class="u-flex u-flex-items-center u-m-b-10">
                                <el-tag type="primary">商户名</el-tag>
                                <el-text class="u-m-l-10">{{ applyments_detail.merchant_name || '无' }}</el-text>
                            </div>
                            <div class="u-flex u-flex-items-center u-m-b-10">
                                <el-tag type="primary">店铺名</el-tag>
                                <el-text class="u-m-l-10">{{ applyments_detail.store_name || '无' }}</el-text>
                            </div>
                        </el-col> 
                        <el-col :span="8" :xs="24"> 
                            <div class="u-flex u-flex-items-center u-m-b-10" v-if="applyments_detail.hasOwnProperty('id')">
                                <el-tag type="primary">账户状态</el-tag>
                                <el-text class="u-m-l-10">{{ $filters.applyments_status(applyments_zt) }}</el-text> 
                            </div>
                            <div class="u-flex u-flex-items-center u-m-b-10">
                                <el-button type="primary" size="small" 
                                    @click="router.push({name: 'applyments' })" 
                                    v-if="!applyments_detail.hasOwnProperty('id')"
                                >账户申请</el-button> 
                                <el-button type="primary" size="small" 
                                    @click="router.push({name: 'applyments', query: {mode: 'edit'}})" 
                                    v-if="applyments_zt == '0'"
                                >编辑信息</el-button>   
                                <el-button type="warning" size="small" 
                                    @click="router.push({name: 'applyments', query: {mode: 'readonly'}})" 
                                    v-if="applyments_detail.hasOwnProperty('id')"
                                >预览详情</el-button> 
                                <el-popconfirm 
                                    title="确认提交申请"  
                                    @confirm="submitBtn"
                                    confirm-button-text="确认"
                                    cancel-button-text="取消">
                                    <template #reference>
                                        <el-button type="danger" size="small" v-if="applyments_zt == '0'">提交申请</el-button> 
                                    </template> 
                                </el-popconfirm>
                                
                            </div> 
                           
                        </el-col> 
                    </el-row> 
                    <template v-if="applyments_sign.hasOwnProperty('applyment_id')">
                        <el-divider border-style="dashed" />
                        <el-row :gutter="20" >
                            <el-col :span="8" :xs="24">
                                <div class="u-flex u-flex-items-center u-m-b-10">
                                    <el-tag type="primary">签约状态</el-tag>
                                    <el-text class="u-m-l-10">{{ applyments_sign.applyment_state_desc }}</el-text>
                                </div>  
                                <div class="u-flex u-flex-items-start u-m-b-10" v-if="applyments_sign.sign_url">
                                    <el-tag type="primary">扫码下一步</el-tag>
                                    <el-text class="u-m-l-10">
                                        <el-image
                                            style="width: 100px; height: 100px"
                                            :src="applyments_sign.sign_url" 
                                            :preview-src-list="[applyments_sign.sign_url]"
                                            :initial-index="0"
                                            fit="cover"
                                            />
                                    </el-text>
                                </div> 
                            </el-col> 
                        </el-row> 
                    </template>
                    
                </div>
            </el-card> -->
        </div>
        <template v-if="applyments_zt == 2">
            <el-row :gutter="10">
                <el-col :span="24" :xs="24" >
                    <el-card  shadow="hover">
                        <div style="min-height: 140px;" >
                            <div class="u-flex u-flex-items-center ">
                                <div class="item"><el-text tag="b">基本账户</el-text></div>
                                <div class="item u-m-l-10" >
                                    <el-button type="primary" size="small" plain @click="withdrawShow = true">预约提现</el-button>
                                </div>
                            </div> 
                            <el-row :gutter="10" class="u-m-b-5">
                                <el-col :span="12" :xs="24" >
                                    <el-card :body-style="{padding: '8px'}" class="u-m-t-5" shadow="none" v-loading="base_account.loading1">
                                        <div class="u-flex u-flex-items-center u-flex-between" > 
                                            <div class="item">
                                                <div>
                                                    <div class="u-flex u-flex-items-center">
                                                        <el-text>可用余额</el-text>
                                                        <el-tooltip
                                                            class="box-item"
                                                            effect="dark"
                                                            content="刷新数据"
                                                            placement="right"
                                                        > 
                                                            <el-icon   
                                                                class="u-m-l-5 u-font-14" 
                                                                style="cursor: pointer;"
                                                                color="#007aff"  
                                                                @click="refreshBtn1"
                                                            ><Refresh /></el-icon>
                                                        </el-tooltip> 
                                                    </div> 
                                                </div>
                                                
                                            </div>
                                            <div class="item" style="height: 24px; line-height: 24px;">
                                                <el-statistic value-style="font-size: 16px;" :value="base_account.available_amount" precision="2" /> 
                                            </div>
                                            
                                        </div> 
                                    </el-card>
                                        
                                </el-col>
                                <el-col :span="12" :xs="24" >
                                    <el-card :body-style="{padding: '8px'}" class="u-m-t-5" shadow="none" v-loading="base_account.loading1">
                                        <div class="u-flex u-flex-items-center u-flex-between" > 
                                            <div class="item">
                                                <div>
                                                    <div class="u-flex u-flex-items-center">
                                                        <el-text>不可用余额</el-text> 
                                                    </div> 
                                                </div> 
                                            </div>
                                            <div class="item" style="height: 24px; line-height: 24px;">
                                                <el-statistic value-style="font-size: 16px;" :value="base_account.pending_amount" precision="2" /> 
                                            </div>
                                            
                                        </div> 
                                    </el-card>
                                        
                                </el-col>
                            </el-row> 
                             
                            <el-row :gutter="10">
                                <el-col :span="24" :xs="24" >
                                    <el-card :body-style="{padding: '8px'}" class="u-m-t-5" shadow="none" v-loading="base_account.loading2">
                                        <div class="" > 
                                            <div class="item">
                                                <div class="u-flex u-flex-items-center">
                                                    <div class="u-flex u-flex-items-center">
                                                        <el-text>日终余额查询</el-text>
                                                        <el-tooltip
                                                            class="box-item"
                                                            effect="dark"
                                                            content="刷新数据"
                                                            placement="right"
                                                        > 
                                                            <el-icon   
                                                                v-if="base_account.date"
                                                                class="u-m-l-5 u-font-14" 
                                                                style="cursor: pointer;"
                                                                color="#007aff"  
                                                                @click="refreshBtn2"
                                                            ><Refresh /></el-icon>
                                                        </el-tooltip> 
                                                    </div>
                                                    <div class="u-m-l-10">
                                                        <el-config-provider :locale="locale">
                                                            <el-date-picker
                                                                style="max-width: 200px;"
                                                                v-model="base_account.date"
                                                                type="date"
                                                                clearable
                                                                placeholder="选择日期" 
                                                                size="small"
                                                                @change="handleDateChange"
                                                            />
                                                        </el-config-provider> 
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            <div>
                                                <el-text size="small" type="info">可查询90天内的日终余额。当日日终余额在次日生成，建议商户在上午 10 点以后查询。</el-text>
                                            </div>
                                            <div class="item u-m-t-8">
                                                <el-row :gutter="10">
                                                    <el-col :span="12" :xs="24" >
                                                        <div class="u-radius-5 u-p-8 u-flex u-flex-between" :class="{'u-m-b-5': isH5}" style="background-color: var(--el-color-primary-light-9)" >
                                                            <el-text size="small">可用余额</el-text>
                                                            <el-statistic value-style="font-size: 16px;" :value="base_account.dayend_available_amount" precision="2" /> 
                                                        </div>
                                                    </el-col> 
                                                    <el-col :span="12" :xs="24" >
                                                        <div class="u-radius-5 u-p-8 u-flex u-flex-between" style="background-color: var(--el-color-primary-light-9)" >
                                                            <el-text size="small">不可用余额</el-text>
                                                            <el-statistic value-style="font-size: 16px;" :value="base_account.dayend_pending_amount" precision="2" /> 
                                                        </div>
                                                    </el-col>
                                                </el-row>
                                            </div>
                                            <!-- <div class="item" style="height: 24px; line-height: 24px;">
                                                <el-statistic value-style="font-size: 16px;" :value="base_account.dayend_moeny" precision="2" /> 
                                            </div> -->
                                            
                                        </div> 
                                    </el-card>
                                        
                                </el-col>
                                <!-- <el-col :span="12" :xs="24" >
                                    <el-text type="info" size="small">可查询90天内的日终余额。当日日终余额在次日生成，建议商户在上午 10 点以后查询。</el-text>
                                </el-col> -->
                            </el-row>
                        </div>  
                    </el-card>
                    
                </el-col>
                <!-- <el-col :span="24" :xs="24" v-for="(item, index) in fund_list" :key="index">
                    <el-card  shadow="hover">
                        <div style="min-height: 140px;" >
                            <div class="u-flex u-flex-items-end u-flex-between">
                                <div class="item"><el-text tag="b">{{item.name}}</el-text></div>
                                <div class="item" v-if="item.withdraw">
                                    <el-button type="primary" size="small" plain @click="withdrawBtn(item)">预约提现</el-button>
                                </div>
                            </div>
                            
                            <el-card :body-style="{padding: '8px'}" class="u-m-t-5" v-for="(ele, i) in item.list" :key="i" shadow="none">
                                <div class="u-flex u-flex-items-end u-flex-between" v-loading="ele.loading" > 
                                    <div class="item">
                                        <div class="u-flex u-flex-items-center">
                                            <el-text>{{ ele.name }}</el-text>
                                            <el-tooltip
                                                class="box-item"
                                                effect="dark"
                                                content="刷新数据"
                                                placement="right"
                                            > 
                                                <el-icon 
                                                    v-if="ele.api == 'fund_balance' || (ele.api == 'fund_enddaybalance' && ele.date)"
                                                    class="u-m-l-5 u-font-14" 
                                                    style="cursor: pointer;"
                                                    color="#007aff"  
                                                    @click="refreshBtn(ele.api, index)"
                                                ><Refresh /></el-icon>
                                            </el-tooltip> 
                                        </div>
                                        <div v-if="ele.api == 'fund_enddaybalance'">
                                            <el-config-provider :locale="locale">
                                                <el-date-picker
                                                    style="width: 110px;"
                                                    v-model="ele.date"
                                                    type="date"
                                                    clearable
                                                    placeholder="选择日期" 
                                                    size="small"
                                                    @change="(e) => {handleDateChange(e, index)}"
                                                />
                                            </el-config-provider>
                                            
                                        </div>
                                    </div>
                                    <div class="item" style="height: 24px; line-height: 24px;">

                                        <template v-if="ele.showMoney">
                                            <el-statistic value-style="font-size: 16px;" :value="ele.money" precision="2" />
                                        </template>
                                        <template v-else>
                                            <el-text >****</el-text>
                                        </template> 
                                    </div>
                                </div> 
                            </el-card>
                            
                        </div>  
                    </el-card>
                    
                </el-col>  -->
            </el-row> 
            <div class="u-m-t-10">
                <div class="u-p-10 u-flex u-flex-items-center">
                    <el-icon color="#666"><Document /></el-icon>
                    <el-text class="text-bold u-m-l-6" size="large">预约提现列表</el-text>
                </div>
                <table-withdraw></table-withdraw>
            </div>
            <withdraw-popup :show="withdrawShow" @setShow="setShow" :account="withdrawData"></withdraw-popup>
        </template>
        
    </div> 
    
</template>

<script lang="ts" setup>
import { dayjs } from 'element-plus'
import locale from 'element-plus/dist/locale/zh-cn.mjs'
import { reactive, ref, inject, onMounted, watch, toRefs } from 'vue'
import router from '@/router/guard'
import { genFileId, ElMessage } from 'element-plus'
import type { FormInstance, UploadFile, UploadRequestOptions, UploadRawFile, UploadProps, FormRules, TableColumnCtx } from 'element-plus'
import { deepClone } from '@/utils'
import Editor from '@/components/Editor/Editor.vue'
import { baseStore } from '@/stores/main'
const { configHeader } = baseStore()
import { useSettingsStore } from '@/stores/settings'
const settings = useSettingsStore()
const { isH5 } = toRefs(settings)
import { userStore } from '@/stores/user'
const user = userStore()
const { cpy_info } = toRefs(user)
import { useApplymentsStore } from '@/stores/applyments'
const applyments = useApplymentsStore()
const { applyments_detail, applyments_sign, applyments_zt, applyments_detail_loading, applyments_alert } = toRefs(applyments)
// import { DomEditor } from '@wangeditor/editor'
import {
    Delete, Plus, ZoomIn, CirclePlus, FolderOpened
} from '@element-plus/icons-vue'

const withdrawShow = ref(false)
const withdrawData = ref({
    type: 'BASIC',
    string: '基本账户'
})
const $api: any = inject('$api') 
const base_account = ref({
    pending_amount: '',
    available_amount: '',
    loading1: false, 
    date: '',
    dayend_pending_amount: '',
    dayend_available_amount: '',
    loading2: false,
})


const fund_list = ref([
    {
        name: '基本账户',
        account_type: 'BASIC',
        withdraw: true,
        list: [
            {
                name: '实时余额',
                api: 'fund_balance',
                money: '',
                showMoney: false,
                loading: false
            },
            {
                name: '日终余额',
                api: 'fund_enddaybalance',
                money: '',
                date: '',
                loading: false
            },
        ]
    },
    // {
    //     name: '手续费账户',
    //     account_type: 'FEES',
    //     withdraw: false,
    //     list: [
    //         {
    //             name: '实时余额',
    //             api: 'fund_balance',
    //             money: '',
    //             showMoney: false,
    //             loading: false
    //         }, 
    //     ]
    // },
    // {
    //     name: '运营账户',
    //     account_type: 'OPERATION',
    //     withdraw: true,
    //     list: [
    //         {
    //             name: '实时余额',
    //             api: 'fund_balance',
    //             money: '',
    //             showMoney: false,
    //             loading: false
    //         },
    //         {
    //             name: '日终余额',
    //             api: 'fund_enddaybalance',
    //             money: '',
    //             date: '',
    //             loading: false
    //         },
    //     ]
    // },
    // {
    //     name: '保证金账户',
    //     account_type: 'DEPOSIT',
    //     withdraw: false,
    //     list: [
    //         {
    //             name: '实时余额',
    //             api: 'fund_balance',
    //             money: '',
    //             showMoney: false,
    //             loading: false
    //         } 
    //     ]
    // }
]) 

onMounted(async () => {
    applyments.getApplymentsDetail(true)
    refreshBtn1()
})

function handleDateChange(e) { 
    if(e) {
        base_account.value.date = dayjs(e).format('YYYY-MM-DD')
        refreshBtn2()
    }
    else {
        base_account.value.date = ''
        base_account.value.dayend_moeny = ''
        base_account.value.showMoney = false
    }
}
async function refreshBtn1() {
    if(base_account.value.loading1) return;
    base_account.value.loading1 = true
    try {
        const res = await getData('fund_balance', {account_type: 'BASIC'})  
        if(res.code == 1) {
            if(res.list.hasOwnProperty('code') && res.list.hasOwnProperty('message')) {
                ElMessage.error(res.list.message)
            }
            else {
                base_account.value.available_amount = res.list.available_amount/100
                base_account.value.pending_amount = res.list.pending_amount/100
            }
            
        }
    }catch{}
    
    base_account.value.loading1 = false
}
async function refreshBtn2() {
    if(base_account.value.loading2) return;
    base_account.value.loading2 = true
    try {
        const res = await getData('fund_enddaybalance', {account_type: 'BASIC', date: base_account.value.date})  
        if(res.code == 1) {
            if(res.list.hasOwnProperty('code') && res.list.hasOwnProperty('message')) {
                ElMessage.error(res.list.message)
            }
            else { 
                base_account.value.dayend_available_amount = res.list.available_amount/100
                base_account.value.dayend_pending_amount = res.list.pending_amount/100 
            }
            
        }
    }catch{}
    
    base_account.value.loading2 = false
}
// async function refreshBtn(api, index, i=0) {
//     // let i = i;
//     let params = {
//         account_type: fund_list.value[index].account_type
//     }
    
//     if(api == 'fund_enddaybalance') {
//         i = 1; 
//         params.date = fund_list.value[index].list[i].date
//     }  
//     let data = fund_list.value[index].list[i]
//     console.log(data)
//     if(data.loading) return;
//     data.loading = true
//     try {
//         const res = await getData(api, params)  
//         if(res.code == 1) {
//             if(res.list.hasOwnProperty('code') && res.list.hasOwnProperty('message')) {
//                 ElMessage.error(res.list.message)
//             }
//             else {
//                 console.log(data.key)
//                 if(data.hasOwnProperty('key')) {
//                     data.money = res.list[data.key]/100
//                 } else data.money = res.list.available_amount /100
//                 data.showMoney = true 
//             }
            
//         }
//     } catch (error) {
//         console.log(error)
//     }
//     data.loading = false
// }
function getData(apiName, params) {
    return new Promise((resolve, rej) => { 
        $api[apiName]({params})
        .then((res) => {
            if(res.code == 1) {
                resolve(res)
            }
        }).catch(err => {
            rej(err)
        }) 
    })
     
} 
function withdrawBtn(data) {
    withdrawData.value = {}
    withdrawData.value = {
        type: data.account_type,
        string: data.name
    }
    withdrawShow.value = true
}
function setShow(v) {
    withdrawShow.value = v
} 
async function submitBtn() {
    const res = await $api.submit_applyments()
    if(res.code == 1) {
        ElMessage.success(res.msg)
        applyments.getApplymentsDetail(true)
    }
}

</script>

<style lang='scss' scoped> 
.loadingclass {
    transform: scale(.5);
}
.bg {
    background-image: url("https://www.sunmaxx.cn/Public/fulizq/fulibg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat
}
// a
</style>