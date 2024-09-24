<!--  -->
<template>
    <div style="width: 100%;">

        <el-form ref="formRef" :model="dynamicValidateForm" label-width="120px" :rules="rules"
            class="demo-dynamic u-p-20 box-border" label-position="top" scroll-to-error inline-message>  
            
            <div class="u-p-8  u-radius-8 u-p-l-15 u-p-r-15 u-m-b-14" style="background-image: linear-gradient(to bottom, #FAFBFF, #DBE4F9);">
                <el-text class="u-font-16" style="color: #000;">向网盛跨境采购福利券总额度后，可点击右上角</el-text>
                <el-text class="u-font-16" type="primary">【企业福利】</el-text>
                <el-text class="u-font-16" style="color: #000;">菜单，可将福利券额切分并发送给对方，对方获得福利券卡密绑定，即可在网盛特卖“企福区"随心购物。</el-text>
                
            </div>

            <div :class="{
                'u-p-15': showXcxMenus == 1,
                'u-radius-8': showXcxMenus == 1, 
            }" :style="{
                border: showXcxMenus == 1 ? '1px solid #c0dcfb' : '0'
            }">
                
                <el-row :gutter="20">
                    <el-col :span="8" :xs="24">
                        <el-form-item label="收款人" label-width="80px" label-position="left" class="u-m-b-0">
                            <div class="u-flex u-flex-items-center" style="cursor: pointer;" @click="copyEvent('浙江网盛跨境电商服务有限公司')"> 
                                <div class="u-m-r-5">浙江网盛跨境电商服务有限公司</div>
                                <el-icon color="#007aff" ><CopyDocument /></el-icon>
                            </div>
                        </el-form-item>   
                    </el-col>
                    <el-col :span="8" :xs="24">
                        <el-form-item label="开户银行" label-width="80px" label-position="left" class="u-m-b-0">
                            <div class="u-flex u-flex-items-center" style="cursor: pointer;" @click="copyEvent('兴业银行杭州萧山支行')"> 
                                <div class="u-m-r-5">兴业银行杭州萧山支行</div>
                                <el-icon color="#007aff" ><CopyDocument /></el-icon>
                            </div>
                        </el-form-item>    
                    </el-col>
                    <el-col :span="8" :xs="24">
                        <el-form-item label="账号" label-width="80px" label-position="left" class="u-m-b-0">
                            <div class="u-flex u-flex-items-center" style="cursor: pointer;" @click="copyEvent('359590100100155451')"> 
                                <div class="u-m-r-5">359590100100155451</div>
                                <el-icon color="#007aff" ><CopyDocument /></el-icon>
                            </div>
                        </el-form-item>    
                    </el-col>
                </el-row>
            </div>
            <el-divider border-style="dashed" />
            <el-row :gutter="20">
                <el-col :span="8" :xs="24">
                    <el-form-item label="金额/元" prop="amount">
                        <el-input type="text" v-model="dynamicValidateForm.amount" placeholder="金额" />
                    </el-form-item>
                </el-col>
                <el-col :span="8" :xs="24">
                    <el-form-item label="付款户名" prop="name" required>
                        <el-input type="text" v-model="dynamicValidateForm.name" placeholder="付款户名" />
                    </el-form-item>  
                </el-col>
                <el-col :span="8" :xs="24">
                    <el-form-item label="开户行" prop="bank">
                        <el-input type="text" v-model="dynamicValidateForm.bank" placeholder="开户行" />
                    </el-form-item> 
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8" :xs="24">
                    <el-form-item label="付款账号" prop="bankno">
                        <el-input type="text" v-model="dynamicValidateForm.bankno" placeholder="付款账号" />
                    </el-form-item>
                </el-col>
                <el-col :span="8" :xs="24">
                    <el-form-item label="充值凭证" prop="pic" required>
                        <div class="u-flex u-flex-wrap u-flex-items-start">
                            <div class="el-upload el-upload--picture-card u-m-r-8 u-m-b-8" @click="showPopup" >
                                <el-icon>
                                    <Plus />
                                </el-icon> 
                            </div>
                            <el-upload 
                                ref="pic" 
                                action="" 
                                class="draggable-mode u-flex-1"
                                v-model:file-list="dynamicValidateForm.pic"
                                list-type="picture-card"  
                                :headers="configHeader"  
                                :http-request="(options) => upload(options, dynamicValidateForm.pic) "
                                :before-upload="beforeUpload" 
                                > 
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
                        </div>
                    </el-form-item> 
                </el-col>
                <el-col :span="8" :xs="24">
                    <el-form-item label="备注" prop="remarks">
                        <el-input type="text" v-model="dynamicValidateForm.remarks" placeholder="备注" />
                    </el-form-item>
                </el-col>
            </el-row>
            
            <el-row :gutter="20">
                <el-col :span="8" :xs="24">
                    <el-form-item>
                        <el-button style="width: 100%" type="primary" @click="submitForm(formRef)">提交</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            
            
            
            
        </el-form>
    </div>
    <div> 
        <el-dialog v-model="dialogVisible">
            <img w-full style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
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
    <div class="u-p-10 box-border">
        <div class="welfare_title">
            <div style="width: 100%;" class="box-border " v-html="welfare_info.title"></div>
        </div>
        <div class="welfare_info">
            <div style="width: 100%;" class="box-border " v-html="welfare_info.info"></div>
        </div>
    </div>
	
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
const { configHeader } = baseStore()
// import { DomEditor } from '@wangeditor/editor'
import {
    Delete, Plus, ZoomIn, CirclePlus, FolderOpened 
} from '@element-plus/icons-vue'

const user = userStore()
const {showXcxMenus } = toRefs(user)
const dialogImageUrl = ref('')
const disabled = ref(false)
const dialogVisible = ref(false)
const uploadShow = ref(false) 
const uploadTitle = ref('充值凭证图片编辑')
const $api: any = inject('$api')
const welfare_info = ref({})
const formRef = ref<FormInstance>()
const dynamicValidateForm = reactive<{ 
    pic: Array<any> 
    amount: String
    name: String 
    bank: String 
    bankno: String 
    remarks: String
}>({ 
    pic: [], 
    amount: '', 
    name: '', 
    bank: '', 
    bankno: '', 
    remarks: ''
})  
const rules = {
    name: {
        required: true,
        trigger: 'blur',
        message: '请输入' 
    },
    amount: [ 
        { 
            required: true,
            validator: (rule: any, value: any, callback: any) => {
                if (!test.amount(value)) {
                    callback(new Error('请输入正确金额'))
                } else {
                    callback()
                }
            },
            message: '请输入正确金额' 
        } 
    ]
}
onMounted(async () => {
    await getInitData()
})
async function getInitData() { 
    const res = await $api.welfare({loading: true})  
    if(res.code == 1) {
        welfare_info.value = res.list
    }
}
function submitForm(formEl: FormInstance | undefined) { 
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            console.log('submit!')
            let params = deepClone(dynamicValidateForm);
            await submitApi({
                ...params, 
                img: dynamicValidateForm.pic.map(ele => ele.url).join(','),  
            })
        } else {
            console.log('error submit!')
            return false
        }
    })
}
async function submitApi(data) {
    const res = await $api.add_welfare({
        ...data
    })
    if (res.code == 1) {
        ElMessage.success(res.msg)
        router.push({
            name: 'welfare_list'
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
function copyEvent(text) {
     
    let content = text
    let flag = exeCommandCopyText(content)
    if(flag) {
        ElMessage.success('复制成功')
    }
    else { 
        ElMessage.error('复制失败')
    }  
}
function exeCommandCopyText(text) {
    try {
        const t = document.createElement('textarea')
        t.nodeValue = text
        t.value = text
        document.body.appendChild(t)
        t.select()
        document.execCommand('copy');
        document.body.removeChild(t)
        return true
    } catch (e) {
        console.log(e)
        return false
    }
} 
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