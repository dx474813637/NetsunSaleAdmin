<template>
    <el-dialog 
        customClass="cusTomClass" 
        v-model="dialogTableVisible" 
        destroy-on-close 
        draggable 
        width="1000px" 
        :title="title" 
        @open="open"  
        :close-on-press-escape="false" 
        >
        <div class="home-w"> 
            <div class="u-m-b-10 u-flex u-flex-items-center">
                <img src="https://www.sunmaxx.cn/Public/fulizq/jingao.png" height="18" class="u-m-r-5" alt="">
                <el-text type="danger" class="u-font-16">请按照模板表格填写，手机和面额请认真核对。</el-text>
                <el-button type="primary" plain size="small" @click="downloadBtn">点我下载模板</el-button> 
            </div>
            <div>
                <el-upload
                    class="upload-demo"
                    action="" 
                    drag 
                    multiple
                    :headers="configHeader"  
                    :http-request="(options) => upload(options, dataList) "
                    :before-upload="beforeUpload" 
                >
                    <div class="u-p-t-40 u-p-b-40">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            拖拽文件至虚线框内 或 <em>点击进行上传</em>
                        </div>

                    </div> 
                    <template #tip>
                        <div class="el-upload__tip">
                            <el-text type="info">本次上传列表</el-text>
                        </div>
                    </template>
                </el-upload>
            </div>
        </div>
    </el-dialog> 
</template>

<script setup lang="ts">
import { reactive, ref, inject, onMounted, watch, computed } from 'vue'
import router from '@/router/guard'
import { genFileId, ElMessage } from 'element-plus' 
import type { FormInstance, UploadFile, UploadRequestOptions, UploadRawFile, UploadProps, FormRules, TableColumnCtx  } from 'element-plus'
import { deepClone } from '@/utils'
import Editor from '@/components/Editor/Editor.vue'
import { useVouchersStore } from '@/stores/vouchers'
const vouchers = useVouchersStore()
const { page_update } = toRefs(vouchers)
import { baseStore } from '@/stores/main'
const { configHeader } = baseStore();
const configHeader2 = computed(() => ({...configHeader, 'content-type': 'multiple/form-data'}))
// import { DomEditor } from '@wangeditor/editor'
// import {
//     ZoomIn, Delete
// } from '@element-plus/icons-vue'
import draggable from "vuedraggable";

const disabled = ref(false)
const dialogVisible = ref(false)
 
const $api: any = inject('$api')

const props = defineProps({
	id: {
		type: String,
        default: ''
	},
    show: {
        type: Boolean,
        default: false
    },
    title: {
		type: String,
        default: ''
	},
    list: {
        type: Array,
        default: () => []
    }
});   
const file_success = ref(false)
const emit = defineEmits(["setShow", "updateData"]);
const dialogTableVisible = computed({
    set(v) { 
        if(!v && file_success.value) {  
            page_update.value = true
            vouchers.getVouchersData()  
            file_success.value = false
        }
        emit('setShow', v)
    },
    get() {
        return props.show
    }
})  
const viewerIndex = ref(0)
const previewSrcList = computed(() => props.list.map(ele => ele.url))
const dataList = computed({
    set(v) {
		console.log(v)
        emit('updateData', v)
    },
    get() {
        return props.list
    }
})
const showViewer = ref(false)
async function open() {
    
} 

const showImgView = (item, index) => { 
    showViewer.value = true 
    viewerIndex.value = index
}
const deleteImgView = (item, index) => {
    const list = deepClone(dataList.value)
    list.splice(index, 1)
    dataList.value = list
}
async function upload(param: any , propName ) {
    // console.log(propName) 
    const formData = new FormData()
    formData.append('file', param.file) 
    const res = await $api.excel_add(formData)
    // console.log(res)
    if (res.code == 1) { 
        // propName[propName.length - 1].url = res.list[0];  
        // let list = deepClone(dataList.value);
        // list.push({
        //     url: res.list[0]
        // })
        // dataList.value = list
        ElMessage.success('上传成功')  
        return true
    }
    return false
}
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const validExtensions = ['xls', 'xlsx'];
    const extension = rawFile.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(extension)) {
        ElMessage.error('execl文件后缀不符合！请检查！') 
        return false;
    } 
    // 检查MIME类型
    const validMimeTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const mimeType = rawFile.type;
    if (!validMimeTypes.includes(mimeType)) { 
        ElMessage.error('execl文件类型有误！请检查！')  
        return false;
    }  
    file_success.value = true
    // if (rawFile.size / 1024 / 1024 > 2) {
    //     ElMessage.error('图片大小请勿超过2MB！')
    //     return false
    // }
    return true
}
// 关闭
const confirm = () => {
//   emit("update:dragDialog", false);
};
// 提交
const submitDrag = () => {
//   emit("submitDrag");
}; 
// 拖动前
const onDragStart = () => {
//   emit("onDragStart");
}; 
const onDragEnd = () => { 
//   emit("onDragEnd");
}; 
const onDragUpdate = (e) => {
    // console.log(e)
//   emit("onDragUpdate");
}; 
function downloadBtn() { 
    window.open('https://www.sunmaxx.cn/Public/vouchers_up.xlsx', '_blank', '');
}
</script> 
<style lang='scss' scoped>
.draggable-w { 
    .draggable-item {
        .image-w {
            position: relative;  
            overflow: hidden;
            border-radius: 5px; 
            transition: all .3s;
            &:hover {
                box-shadow: 0 0 8px rgba(0,0,0,.6);
            }
            .image-item { 
                width: 80px;
                height: 80px;
                display: block;
                cursor: move
            }
            .image-icon-w { 
                width: 100%;
                height: 100%;  
                background-color: rgba(0,0,0,.5);
                color: #fff; 
                .icon-item {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>