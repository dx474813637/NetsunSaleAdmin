<!--  -->
<template>
    <div style="width: 100%;" v-loading="loading">

        <el-form ref="formRef" :model="dynamicValidateForm" label-width="120px" :rules="rules"
            class="demo-dynamic u-p-20 box-border" label-position="top" scroll-to-error inline-message :disabled="origin.zt == 1">  
            <div class="bg u-p-10 box-border u-p-l-20 u-p-r-20 u-m-b-14" v-if="!isH5">
                <el-row :gutter="20" > 
                    <el-col :span="6" :xs="24" class="u-flex u-flex-items-center">
                        <img class="u-m-r-10" height="50" :src="`https://www.sunmaxx.cn/Public/fulizq/yhicon.png?time=${new Date().getTime()}`" alt="">
                        <div class="u-flex-1 u-flex-colum ">
                            <div>
                                <el-text class="u-font-20" style="color: #000">优惠活动温馨提示</el-text>
                            </div>
                            <div>
                                <el-text type="info">发券前请先查看右侧发券说明</el-text>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="18" :xs="24" class="u-flex u-flex-end"> 
                        <div class="u-flex-1 u-flex " style="width: 100%;">
                            <el-divider direction="vertical" style="height: 50px;" />
                            <div class=" " >  
                                <el-text type="info" class="u-font-14">店铺优惠券仅支持全店通用券，创建后将在店铺首页及商详页相关位置有优惠标识。发券数量不限，单用户领券与使用时间有限制。</el-text> 
                                <el-text type="primary" class="u-font-14">发券额由商家承担，并在结算时从供货价可提现金额中扣除。请谨慎发券，做好成本控制，平台不承担发券带来的商家损失。</el-text> 
                            </div>
                        </div>  
                    </el-col> 
                </el-row>  
            </div>
            <div v-else class="u-p-8  u-radius-8 u-p-l-15 u-p-r-15 u-m-b-14" style="background-image: linear-gradient(to bottom, #FAFBFF, #DBE4F9);">
                <el-text class="u-font-16" style="color: #000;">店铺优惠券仅支持全店通用券，创建后将在店铺首页及商详页相关位置有优惠标识。发券数量不限，单用户领券与使用时间有限制。发券额由商家承担，并在结算时从供货价可提现金额中扣除。请谨慎发券，做好成本控制，平台不承担发券带来的商家损失。</el-text>
            </div>
            <div class="u-m-b-20" v-if="origin.zt == 1" >
                <el-alert title="当前状态无法被编辑" type="error" /> 
            </div>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="活动名称" prop="title" required> 
                        <el-input
                            v-model="dynamicValidateForm.title"  
                            type="text"
                            placeholder="活动名称"
                        /> 
                    </el-form-item>  
                </el-col> 
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6" :xs="24">
                    <el-form-item label="活动门槛/满" label-position="left" label-width="120px" prop="full" required>  
                        <div class="u-flex u-flex-items-center">
                            <el-input
                                v-model="dynamicValidateForm.full"  
                                type="number"
                                placeholder="活动门槛"
                            />
                            <el-text class="u-m-l-5">元</el-text>
                        </div> 
                    </el-form-item>  
                </el-col> 
                <el-col :span="6" :xs="24">
                    <el-form-item label="优惠金额/减" label-position="left" label-width="120px" prop="minus" required> 
                        <div class="u-flex u-flex-items-center">
                            <el-input
                                v-model="dynamicValidateForm.minus"  
                                type="number"
                                placeholder="优惠金额"
                            />
                            <el-text class="u-m-l-5">元</el-text>
                        </div> 
                        
                    </el-form-item> 
                </el-col> 
            </el-row>
            <el-row :gutter="20" v-if="!isH5">
                <el-col :span="12" :xs="24">
                    <el-form-item label="活动时间" prop="date" required>  
                        <el-date-picker
                            v-model="dynamicValidateForm.date"
                            type="datetimerange" 
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            value-format="x"
                        />
                    </el-form-item>  
                </el-col>  
            </el-row>
            <template v-else>
                <el-row :gutter="20" >
                    <el-col :span="12" :xs="24">
                        <el-form-item label="活动开始时间" prop="begin" required> 
                            <el-date-picker
                                style="width: 100%"
                                placeholder="开始时间"
                                v-model="dynamicValidateForm.begin"
                                type="datetime"   
                                value-format="x"
                            />
                        </el-form-item>  
                    </el-col>  
                </el-row>
                <el-row :gutter="20" >
                    <el-col :span="12" :xs="24">
                        <el-form-item label="活动结束时间" prop="end" required>  
                            <el-date-picker
                                style="width: 100%"
                                placeholder="结束时间"
                                v-model="dynamicValidateForm.end"
                                type="datetime"   
                                value-format="x"
                            />
                        </el-form-item>  
                    </el-col>  
                </el-row>
            </template>
            
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="单个用户领取数量" prop="num" required> 
                        <el-input
                            v-model="dynamicValidateForm.num"  
                            type="number"
                            placeholder="数量"
                        />
                        <el-text type="danger">数字"0"代表单个用户可无限领取</el-text>
                    </el-form-item>  
                </el-col> 
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="活动内容" prop="info" required> 
                        <el-input
                            v-model="dynamicValidateForm.info" 
                            :rows="4"
                            type="textarea"
                            placeholder="活动介绍"
                        />
                    </el-form-item>  
                </el-col> 
            </el-row>
            <!-- <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="活动背景图片" prop="pic" required>
                        <el-upload 
                            ref="pic" 
                            action=""  
                            :class="{
                                limit: dynamicValidateForm.pic.length == 1
                            }"  
                            v-model:file-list="dynamicValidateForm.pic"
                            list-type="picture-card" 
                            :limit="1"
                            :headers="configHeader"  
                            :http-request="(options) => upload(options, dynamicValidateForm.pic) "
                            :before-upload="beforeUpload">
                            <el-icon>
                                <Plus />
                            </el-icon>

                            <template #file="{ file }"> 
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                            <el-icon><zoom-in /></el-icon>
                                        </span>
                                        <span v-if="!disabled" class="el-upload-list__item-delete"
                                            @click="handleRemove(file, undefined, 'pic')">
                                            <el-icon>
                                                <Delete />
                                            </el-icon>
                                        </span>
                                    </span>
                                </div>
                            </template>
                        </el-upload> 
                    </el-form-item> 
                </el-col>
            </el-row>  -->
            
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item>
                        <el-button style="width: 100%" type="primary" @click="submitForm(formRef)" v-if="origin.zt != 1">提 交</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            
            
            
            
        </el-form>
    </div>
     
    <div>
        <upload-popup
            :show="uploadShow"  
            :title="uploadTitle"
            :list="dynamicValidateForm.pic"
            imgDrag
            @setShow="setShow"
            @updateData="updateData"
        ></upload-popup>
    </div>
    <!-- <div class="u-p-10 box-border">
        <div class="welfare_title">
            <div style="width: 100%;" class="box-border " v-html="welfare_info.title"></div>
        </div>
        <div class="welfare_info">
            <div style="width: 100%;" class="box-border " v-html="welfare_info.info"></div>
        </div>
    </div> -->
	
</template>

<script setup lang='ts'>
import { reactive, ref, inject, onMounted, watch } from 'vue'
import router from '@/router/guard'
import { genFileId, ElMessage } from 'element-plus' 
import type { FormInstance, UploadFile, UploadRequestOptions, UploadRawFile, UploadProps, FormRules, TableColumnCtx  } from 'element-plus'
import { deepClone } from '@/utils'
import test from '@/utils/test'
import { baseStore } from '@/stores/main'
import { userStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings' 
const settings = useSettingsStore()
const { isH5 } = toRefs(settings)
const { configHeader } = baseStore()
// import { DomEditor } from '@wangeditor/editor'
import {
    Delete, Plus, ZoomIn, CirclePlus, FolderOpened 
} from '@element-plus/icons-vue'

const loading = ref(false)
const coupon_id = ref('')
const user = userStore()
const {showXcxMenus } = toRefs(user)
const dialogImageUrl = ref('')
const disabled = ref(false)
const dialogVisible = ref(false)
const uploadShow = ref(false) 
const uploadTitle = ref('活动背景图片编辑')
const $api: any = inject('$api')
const origin = ref({})
const formRef = ref<FormInstance>()
const dynamicValidateForm = reactive<{ 
    pic: Array<any> 
    full: Number
    minus: Number 
    num: Number 
    begin: String 
    end: String 
    title: String 
    info: String 
    date: Array<any> 
}>({ 
    pic: [],  
    full: 0, 
    minus: 0, 
    num: 0,  
    title: '', 
    begin: '',  
    end: '',   
    info: '', 
    date: [] 
})  
const rules = {
    title: {
        required: true,
        trigger: [ 'change','blur'],
        message: '不能为空' 
    }, 
    info: {
        required: true,
        trigger: [ 'change','blur'],
        message: '不能为空' 
    },  
    date: {
        required: true,
        trigger: [ 'change','blur'],
        message: '不能为空' 
    },  
    num: {
        required: true,
        trigger: [ 'change','blur'],
        message: '不能为空' 
    },  
    begin: {
        required: true,
        trigger: [ 'change','blur'],
        message: '不能为空' 
    },  
    end: {
        validator: (rule: any, value: any, callback: any) => { 
            if (!value) { 
                callback(new Error('结束时间不能为空'))
            } else if (+value<=new Date().getTime()) { 
                callback(new Error('结束时间不能早于当前时间'))
            } else if (+value < +dynamicValidateForm.begin) { 
                callback(new Error('结束时间不能早于开始时间'))
            }
            else {
                callback()
            }
        },
        trigger: [ 'change','blur'] 
    },  
    minus: {
        validator: (rule: any, value: any, callback: any) => { 
            if (!value) { 
                callback(new Error('请输入优惠金额'))
            } else if (+value<=0) { 
                callback(new Error('优惠金额不能小于等于0'))
            } else if (+value > +dynamicValidateForm.full) { 
                callback(new Error('优惠金额不能大于活动门槛'))
            }
            else {
                callback()
            }
        },
        trigger: [ 'change','blur'], 
    }, 
    full: { 
        validator: (rule: any, value: any, callback: any) => { 
            if (!value) { 
                callback(new Error('请输入活动门槛'))
            } else if (+value<=0) { 
                callback(new Error('活动门槛不能小于等于0'))
            } else if (+value < +dynamicValidateForm.minus) { 
                callback(new Error('活动门槛不能小于优惠金额'))
            }
            else {
                callback()
            }
        },
        trigger: [ 'change','blur'], 
    }, 
    pic: {
        required: true,
        trigger: [ 'change','blur'],
        message: '不能为空' 
    }, 
}  
watch(
    () => dynamicValidateForm.date,
    (n) => { 
        dynamicValidateForm.begin = n[0]
        dynamicValidateForm.end = n[1]

    }
)
watch(
    () => router.currentRoute.value.query.id,
    async (n) => {
        console.log(n) 
        if(n) {
            coupon_id.value = n
            loading.value = true
            try {
                await getInitData()
            } catch (error) {
                
            }
            loading.value = false
           
        }
    },
    {
        immediate: true,
        deep: true
    }
)
onMounted(async () => {
    
})
async function getInitData() { 
    const res = await $api.coupon_detail({params: {id: coupon_id.value}})  
    if(res.code == 1) {
        if(res.list.zt == 1) {
            ElMessage.error('当前优惠活动无法编辑') 
        } 
        origin.value = res.list
        dynamicValidateForm.title = origin.value.title 
        dynamicValidateForm.info = origin.value.info 
        dynamicValidateForm.date = [new Date(origin.value.begin).getTime(), new Date(origin.value.end).getTime()]
        dynamicValidateForm.full = +origin.value.full
        dynamicValidateForm.minus = +origin.value.minus
        dynamicValidateForm.num = +origin.value.num
        dynamicValidateForm.pic = origin.value.img.split(',').map(ele => ({url: ele}))
         
        
    }
}
function submitForm(formEl: FormInstance | undefined) { 
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            let params = deepClone(dynamicValidateForm); 
            await submitApi({
                ...params, 
                id: coupon_id.value,
                img: dynamicValidateForm.pic.map(ele => ele.url).join(','),  
            })
        } else {
            console.log('error submit!')
            return false
        }
    })
}
async function submitApi(data) {
    const res = await $api.coupon_activities_update({
        ...data
    })
    if (res.code == 1) {
        ElMessage.success(res.msg)
        router.push({
            name: 'coupon_list'
        })
    }
} 
async function upload(param: any , propName, index:any) {
    // console.log(propName) 
    const formData = new FormData()
    formData.append('file', param.file)
    const res = await $api.upimg(formData)
    // console.log(res)
    if (res.code == 1) { 
        propName[propName.length - 1].url = res.list[0];  
        ElMessage.success('图片上传成功')  
        return true
    }
    return false
}
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    //   if (rawFile.type !== 'image/jpeg' ) {
    // console.log(rawFile.type)
    if (!/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(rawFile.type)) {
        ElMessage.error('图片格式有误！请检查！')
        return false
    } 
    // else if (rawFile.size / 1024 / 1024 > 2) {
    //     ElMessage.error('图片大小请勿超过2MB！')
    //     return false
    // }
    return true
}

const handleRemove = (file: UploadFile, index: string, propName, propName2, quick = false ) => { 
    if(typeof(index) != "undefined") {
        propName[index].clearFiles(); 
        propName2.filesList = []
        // if(quick) {
        //     uploadImgIndex.value = +index
        //     render({prop:'img', positionArr: [0, index]})
        // }
    }else {
        console.log(file)
        let i = dynamicValidateForm[propName].findIndex(ele => ele.url == file.url)
        dynamicValidateForm[propName].splice(i, 1)
    }
    ElMessage.success('图片移除成功')
}

const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!
    dialogVisible.value = true
}
function setShow(v) {
	uploadShow.value = v
}
function showPopup() {
    setShow(true)
}
function updateData(data) {
    dynamicValidateForm.pic = data
}
// function copyEvent(text) {
     
//     let content = text
//     let flag = exeCommandCopyText(content)
//     if(flag) {
//         ElMessage.success('复制成功')
//     }
//     else { 
//         ElMessage.error('复制失败')
//     }  
// }
// function exeCommandCopyText(text) {
//     try {
//         const t = document.createElement('textarea')
//         t.nodeValue = text
//         t.value = text
//         document.body.appendChild(t)
//         t.select()
//         document.execCommand('copy');
//         document.body.removeChild(t)
//         return true
//     } catch (e) {
//         console.log(e)
//         return false
//     }
// } 
</script>
<style lang='scss' scoped>

.card {
	width: 100%;
	background-color: #a19ed3;
	color: #fff;
	height: 160px;
}

.card-header {
	width: 100%;
}
.welfare_info {
    width: 100%;
    p, img {
        display: block;
        width: 100%!important;
    }
}
.bg {
    background-image: url("https://www.sunmaxx.cn/Public/fulizq/fulibg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat
}

::v-deep {

    .el-table {

        // --el-table-border-color: #dcdfe6;
        thead tr th {
            border-color: #dcdfe6;
        }
    }

    .el-tabs--border-card>.el-tabs__header {
        border-radius: 5px 5px 0 0;
    }

    .el-tabs--border-card {
        border-radius: 5px;
    }

    .el-form-item__label {
        font-weight: bold;
        font-size: 15px;
    }

    .el-upload--picture-card {
        --el-upload-picture-card-size: 65px;
        // background-color: var(--el-color-primary-light-9);
    }

    .limit, .draggable-mode {
        .el-upload--picture-card {
            display: none;
        }

        .el-upload-list--picture-card {
            display: flex;
        }

        .el-upload-list--picture-card .el-upload-list__item {
            margin: 0
        }
    }
    .draggable-mode {
        .el-upload--picture-card {
            display: none;
        } 
        .el-upload-list--picture-card .el-upload-list__item {
            margin: 0 8px 8px 0
        }
    }

    .el-upload-list--picture-card .el-upload-list__item {
        --el-upload-list-picture-card-size: 65px;

    }

}
</style>