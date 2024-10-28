<template>
    <div style="width: 100%;">
        <!-- <div class="u-p-5">
            <el-alert title="旺铺信息已认证" :closable="false" type="success" v-if="cpy_info.rz == 1" />
            <el-alert title="旺铺信息未认证" :closable="false" type="error" v-else />
        </div> -->
        <el-form ref="formRef" :model="dynamicValidateForm" label-width="120px" :rules="rules"
            class="demo-dynamic u-p-20 box-border" label-position="top" scroll-to-error inline-message>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="主体类型" prop="organization_type">
                        <el-select style="width: 100%" v-model="dynamicValidateForm.organization_type" placeholder="类型"
                            clearable v-loading="init_loading">
                            <el-option v-for="item in organization_type" :key="item.id" :label="`${item.name}`"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="营业执照扫描件" prop="business_license_copy" required>
                        <!-- <el-input v-model="dynamicValidateForm.business_license_copy" /> -->
                        <el-upload ref="business_license_copy" action="" :class="{
                            limit: dynamicValidateForm.business_license_copy.length == 1
                        }" v-model:file-list="dynamicValidateForm.business_license_copy" list-type="picture-card"
                            :limit="1" :headers="configHeader"
                            :http-request="(options) => upload(options, dynamicValidateForm.business_license_copy)"
                            :before-upload="beforeUpload">
                            <el-icon>
                                <Plus />
                            </el-icon>

                            <template #file="{ file }">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-preview"
                                            @click="handlePictureCardPreview(file)">
                                            <el-icon><zoom-in /></el-icon>
                                        </span>
                                        <span v-if="!disabled" class="el-upload-list__item-delete"
                                            @click="handleRemove(file, undefined, 'business_license_copy')">
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
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item prop="business_license_number" label="营业执照注册号">
                        <el-input v-model="dynamicValidateForm.business_license_number" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item prop="merchant_name" label="商户名称">
                        <el-input v-model="dynamicValidateForm.merchant_name" clearable />
                    </el-form-item>
                    <el-form-item prop="legal_person" label="经营者/法定代表人姓名">
                        <el-input v-model="dynamicValidateForm.legal_person" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="身份证人像面照片" prop="id_card_copy" required clearable>
                        <!-- <el-input v-model="dynamicValidateForm.id_card_copy" /> -->
                        <el-upload ref="id_card_copy" action="" :class="{
                            limit: dynamicValidateForm.id_card_copy.length == 1
                        }" v-model:file-list="dynamicValidateForm.id_card_copy" list-type="picture-card" :limit="1"
                            :headers="configHeader"
                            :http-request="(options) => upload(options, dynamicValidateForm.id_card_copy)"
                            :before-upload="beforeUpload">
                            <el-icon>
                                <Plus />
                            </el-icon>

                            <template #file="{ file }">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-preview"
                                            @click="handlePictureCardPreview(file)">
                                            <el-icon><zoom-in /></el-icon>
                                        </span>
                                        <span v-if="cpy_info.rz != 1" class="el-upload-list__item-delete"
                                            @click="handleRemove(file, undefined, 'id_card_copy')">
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
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="身份证国徽面照片" prop="id_card_national" required clearable>
                        <!-- <el-input v-model="dynamicValidateForm.id_card_national" /> -->
                        <el-upload ref="id_card_national" action="" :class="{
                            limit: dynamicValidateForm.id_card_national.length == 1
                        }" v-model:file-list="dynamicValidateForm.id_card_national" list-type="picture-card" :limit="1"
                            :headers="configHeader"
                            :http-request="(options) => upload(options, dynamicValidateForm.id_card_national)"
                            :before-upload="beforeUpload">
                            <el-icon>
                                <Plus />
                            </el-icon>

                            <template #file="{ file }">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-preview"
                                            @click="handlePictureCardPreview(file)">
                                            <el-icon><zoom-in /></el-icon>
                                        </span>
                                        <span v-if="cpy_info.rz != 1" class="el-upload-list__item-delete"
                                            @click="handleRemove(file, undefined, 'id_card_national')">
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
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item prop="id_card_name" label="身份证姓名">
                        <el-input v-model="dynamicValidateForm.id_card_name" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item prop="id_card_number" label="身份证号码">
                        <el-input v-model="dynamicValidateForm.id_card_number" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-if="!isH5">
                <el-col :span="12" :xs="24">
                    <el-form-item label="身份证有效期" prop="id_card_valid_date" required>
                        <el-date-picker v-model="dynamicValidateForm.id_card_valid_date" type="datetimerange"
                            range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="x" />
                    </el-form-item>
                </el-col>
            </el-row>
            <template v-else>
                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="身份证开始时间" prop="id_card_valid_time_begin" required>
                            <el-date-picker style="width: 100%" placeholder="开始"
                                v-model="dynamicValidateForm.id_card_valid_time_begin" type="datetime"
                                value-format="x" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item label="身份证结束时间" prop="id_card_valid_time" required>
                            <el-date-picker style="width: 100%" placeholder="结束"
                                v-model="dynamicValidateForm.id_card_valid_time" type="datetime" value-format="x" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item prop="account_bank" label="开户银行"> 
                        <div class="u-flex" style="width: 100%">
                            <el-input 
                                v-model="dynamicValidateForm.account_bank"   
                                autocomplete="off" 
                                readonly 
                                class="u-flex-1" 
                            />
                            <el-button type="warning" plain class="u-m-l-20" @click.prevent="showBank = true" >点击查询</el-button>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item prop="account_name" label="开户名称">
                        <el-input v-model="dynamicValidateForm.account_name" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <div v-show="need_bank_branch">
                <!-- <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item prop="bank_area" label="开户银行所在城市">
                            <el-cascader
                                v-model="dynamicValidateForm.bank_area"
                                style="width: 100%;"
                                placeholder="请选择地区，可输入关键字筛选"
                                :options="bank_address_code_arr"
                                filterable
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row :gutter="20">
                    <el-col :span="6" :xs="24">
                        <el-form-item prop="bank_province" label="开户银行所在省份">
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
                    <el-col :span="6" :xs="24">
                        <el-form-item prop="bank_city" label="所在城市">
                            <el-cascader 
                                v-model="dynamicValidateForm.bank_city"
                                style="width: 100%;"
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
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item prop="bank_name" label="开户银行全称 （含支行）"> 
                            <div class="u-flex" style="width: 100%">
                                <el-input 
                                    v-model="dynamicValidateForm.bank_name"   
                                    autocomplete="off" 
                                    readonly 
                                    class="u-flex-1" 
                                />
                                <el-button type="warning" plain class="u-m-l-20" @click.prevent="showBankSub = true" >点击查询</el-button>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20">
                    <el-col :span="12" :xs="24">
                        <el-form-item prop="bank_branch_id" label="开户银行联行号">
                            <el-input v-model="dynamicValidateForm.bank_branch_id" clearable />
                        </el-form-item>
                    </el-col>
                </el-row> -->
            </div>
            
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item prop="account_number" label="银行账号">
                        <el-input v-model="dynamicValidateForm.account_number" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item prop="mobile_phone" label="超级管理员手机">
                        <el-input v-model="dynamicValidateForm.mobile_phone" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item prop="store_name" label="店铺全称">
                        <el-input v-model="dynamicValidateForm.store_name" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item prop="merchant_shortname" label="商户简称">
                        <el-input v-model="dynamicValidateForm.merchant_shortname" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <div>
        <el-dialog v-model="showImg">
            <img w-full style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
    </div>
    <el-dialog v-model="showBank" title="银行检索" width="800px" > 
        <table-apply-bank-list
            isRadioGroup
            isSearchBar
            maxHeight="50vh" 
            @setCurrentRow="setCurrentRow"
        ></table-apply-bank-list> 
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="showBank = false">退出</el-button> 
                <el-button type="primary" @click="bankTableConfirm">选择该银行</el-button> 
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="showBankSub" title="银行检索" width="800px" > 
        <table-apply-bank-sub-list
            isRadioGroup 
            maxHeight="50vh" 
            :params="bankSubParams"
            @setCurrentRow="setCurrentRow2"
        ></table-apply-bank-sub-list> 
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="showBankSub = false">退出</el-button> 
                <el-button type="primary" @click="bankSubTableConfirm">选择该银行</el-button> 
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
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
// import { DomEditor } from '@wangeditor/editor'
import {
    Delete, Plus, ZoomIn, CirclePlus, FolderOpened
} from '@element-plus/icons-vue'

const dialogImageUrl = ref('')
const disabled = ref(false)
const showImg = ref(false)
const init_loading = ref(false)
const showBank = ref(false)
const showBankSub = ref(false)
const cityloading = ref(false)
const $api: any = inject('$api')
const formRef = ref<FormInstance>()
const dynamicValidateForm = reactive<{
    organization_type: string
    business_license_copy: Array<any>
    business_license_number: string
    merchant_name: string
    legal_person: string
    id_card_copy: Array<any>
    id_card_national: Array<any>
    id_card_valid_date: Array<any>
    id_card_name: string
    id_card_number: string
    id_card_valid_time_begin: string
    id_card_valid_time: string
    account_bank: string
    account_name: string
    bank_address_code: string
    bank_branch_id: string
    bank_name: string
    account_number: string
    mobile_phone: string
    store_name: string
    merchant_shortname: string
    bank_area: string
    bank_province: string
    bank_city: string
}>({
    organization_type: '',
    business_license_copy: [],
    business_license_number: '',
    merchant_name: '',
    legal_person: '',
    id_card_copy: [],
    id_card_national: [],
    id_card_valid_date: [],
    id_card_name: '',
    id_card_number: '',
    id_card_valid_time_begin: '',
    id_card_valid_time: '',
    account_bank: '',
    account_name: '',
    bank_address_code: '',
    bank_branch_id: '',
    bank_name: '',
    account_number: '',
    mobile_phone: '',
    store_name: '',
    merchant_shortname: '',
    bank_area: '',
    bank_province: '',
    bank_city: ''
})
const selectBank = ref({}) 
const applyments_detail = ref({})
const bank_city_list = ref([])
const applyments_options_data = ref({})
const bank_address_code = computed(() => applyments_options_data.value.bank_address_code?.filter(ele => ele.name.split(',').length != 3) || [])
const bank_address_code_arr = computed(() => { 
    return filterAddressData(bank_address_code.value) || []
})
const organization_type = computed(() => applyments_options_data.value.organization_type || [])
const provinces = computed(() => applyments_options_data.value.provinces || [])
 
const bankSubParams = computed(() => {
    return {
        bank_alias_code: selectBank.value.bank_alias_code,
        city_code: dynamicValidateForm.bank_city[0]
    }
})

const need_bank_branch = ref(false)
function filterAddressData(data, index=0) {   
    let arr = data.filter(ele => ele.name.split(',').length == index+1)
    let data_filter2 = data.filter(ele => ele.name.split(',').length != index+1) 
    arr = arr.map(ele => {
        let name = ele.name.split(',')[index]
        let obj = {
            value: ele.code,
            label: name,
        }
        let data_by_last = data_filter2.filter(item => item.name.split(',').findIndex(item => item == name) != -1)
        if(index != 2) { 
            obj.children = filterAddressData(data_by_last, index+1)
        }
        return obj
    })
      
    return arr
}

const checkPic = (rule: any, value: any, callback: any) => {
    if (value.length == 0) {
        callback(new Error('请上传，不能为空'))
    } else {
        callback()
    }
}
const rules = reactive<FormRules<typeof ruleForm>>({
    id_card_copy: [{
        validator: checkPic,
        trigger: ['change', 'blur'],
    }]
})
watch(
    () => dynamicValidateForm.id_card_copy[0],
    (n) => {
        formRef.value.validateField('id_card_copy')
    },
    {
        deep: true
    }
)
watch(
    () => dynamicValidateForm.id_card_valid_date,
    (n) => {
        dynamicValidateForm.id_card_valid_time_begin = n[0]
        dynamicValidateForm.id_card_valid_time = n[1]

    }
)
watch(
    () => dynamicValidateForm.bank_province,
    async (n) => {
        cityloading.value = true
        await getCityData()
        cityloading.value = false
    } 
)
onMounted(async () => {
    await initData()
})
async function getCityData() {
    const res = await $api.search_city({params: {province_code: dynamicValidateForm.bank_province[0]}})
    if(res.code == 1) {
        bank_city_list.value = res.list.data || []
    }
}
function setCurrentRow({data = {}}) {
    console.log(data) 
    selectBank.value = data 
}
function setCurrentRow2({data = {}}) {
    console.log(data)  
}
function bankTableConfirm() {
    dynamicValidateForm.account_bank = selectBank.value.bank_alias 
    need_bank_branch.value = selectBank.value.need_bank_branch == 1 ? true : false
    showBank.value = false
}
function bankSubTableConfirm() { 
    showBankSub.value = false
}
async function initData() {
    init_loading.value = true
    await getApplymentsOptions()
    init_loading.value = false
    // await getApplymentsDetail()
}
async function getApplymentsOptions() {
    const res = await $api.applyments_options();
    if (res.code == 1) {
        let arr = res.list.bank_address_code.filter(ele => String(ele.code).includes('0000') && ele.name.includes('市'))
        res.list.bank_address_code = [
            ...res.list.bank_address_code,
            ...arr.map(ele => ({code: Number(`${String(ele.code).slice(0,2)}0100`), name: `${ele.name},${ele.name}`}))
        ]
        applyments_options_data.value = res.list || {}  
    }
}
async function getApplymentsDetail() {
    const res = await $api.applyments_detail();
    if (res.code == 1) {
        applyments_detail.value = res.list || {}
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
                business_license_copy: dynamicValidateForm.business_license_copy[0].url,
                id_card_copy: dynamicValidateForm.id_card_copy[0].url,
                id_card_national: dynamicValidateForm.id_card_national[0].url
            })
        } else {
            console.log('error submit!')
            return false
        }
    })
}
async function submitApi(data) {
    const res = await $api.edit_applyments({
        ...data
    })
    if (res.code == 1) {
        ElMessage.success(res.msg)
        // router.push({
        //     name: 'product_list'
        // })
    }
}
async function upload(param: any, propName, index: any) {
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

const handleRemove = (file: UploadFile, index: string, propName, propName2, quick = false) => {
    if (typeof (index) != "undefined") {
        propName[index].clearFiles();
        propName2.filesList = []
        // if(quick) {
        //     uploadImgIndex.value = +index
        //     render({prop:'img', positionArr: [0, index]})
        // }
    } else {
        console.log(file)
        let i = dynamicValidateForm[propName].findIndex(ele => ele.url == file.url)
        dynamicValidateForm[propName].splice(i, 1)
    }
    ElMessage.success('图片移除成功')
}

const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!
    showImg.value = true
}
async function handlePictureExceed(files: UploadFile, uploadFiles, propName) {
    console.log('handlePictureExceed')
    const res = await upload({ file: files[0] }, propName)
    if (res) {
        // console.log(uploadRefs)
        uploadRefs[index].clearFiles()
        const file = files[0] as UploadRawFile
        file.uid = genFileId()
        uploadRefs[index]!.handleStart(file)
    }
}

</script>

<style lang='scss' scoped>
.domains2Price-rows {
    @include flex(x, start, start);
    width: 100%;
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

    .limit {
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

    .el-upload-list--picture-card .el-upload-list__item {
        --el-upload-list-picture-card-size: 65px;

    }

}

.table-box {
    ::v-deep {
        .el-upload--picture-card {
            --el-upload-picture-card-size: 55px;
        }

        .el-upload-list--picture-card .el-upload-list__item {
            --el-upload-list-picture-card-size: 55px;
        }

        .el-upload-list--picture-card .el-upload-list__item-actions span+span {
            margin-left: 8px
        }
    }
}

.domain2Item-box {
    @include flex(x, start, start);
    flex-wrap: wrap;
    width: 100%;

    .domain2Item {
        flex: 0 0 33%;

        .domain2Item-inp {
            width: 100%;
            @include flex(x);

            .item {
                flex: 1;

                &.remove-btn {
                    flex: 0 0 40px;

                    &>div {
                        @include flex(x, start, center);
                        cursor: pointer;

                        &:hover {
                            .el-icon {
                                color: $uni-color-error;
                            }
                        }
                    }
                }
            }
        }
    }

}

.domains2Price-rows {
    ::v-deep {
        .el-upload-list--picture-card .el-upload-list__item {
            margin: 0;
        }
    }
}

.tabs-item {
    @include flex(x)
}

.domains-box {
    padding: 20px 0;
    border-radius: 10px;
    transition: all .3s;
    border: 1px dashed #eee;

    &:hover {
        background-color: #f8f8f8;
        border-color: $uni-color-primary;
    }
}
</style>