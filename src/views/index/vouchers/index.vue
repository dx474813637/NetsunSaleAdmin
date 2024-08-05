<!--  -->
<template>
    <div>
        <div class="u-p-l-10 u-p-r-10 u-p-t-10 box-border">
            <el-row :gutter="20">
                <el-col :span="8" :xs="24">
                    <div
                        class="u-radius-8 card u-flex u-flex-items-center u-flex-between u-p-10 box-border vouchers-amount">
                        <div class="card-header">
                            <el-text tag="b" class="u-font-14 text-white">福利券额度</el-text>
                        </div>
                        <div class="u-flex-1 u-flex u-flex-end">
                            <el-statistic :precision="2" :value="vouchers_amount"
                                value-style="font-size: 18px; color: #fff; " />
                        </div>
                    </div>
                </el-col>
                <el-col :span="16" :xs="24" class="u-flex u-flex-end">
                    <el-button plain type="primary" icon="circle-plus" @click="showAddBtn">添加福利券</el-button>
                    <el-button plain type="primary" icon="download">下载未使用福利券</el-button>
                </el-col>
            </el-row>
            <div class="u-m-t-10 box">
                <el-tabs v-model="tab_active" class="demo-tabs" @tab-change="tabsChangeEvent">
                    <el-tab-pane v-for="item in tabs_list" :key="item.value" :label="item.label"
                        :name="item.value"></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <router-view class="u-flex-1" style="width: 100%;" :key="routerPath"></router-view>
        <add-voucher-popup :show="addVoucherShow" @setShow="setShow"></add-voucher-popup>
    </div>

</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, toRefs } from "vue";
import router from "@/router/guard"
import { useSettingsStore } from '@/stores/settings'
import { cateStore } from '@/stores/cate'
import { userStore } from '@/stores/user'
import { useVouchersStore } from '@/stores/vouchers'
const useSettings = useSettingsStore()
const cate = cateStore()
const vouchers = useVouchersStore()
const { menuListAll, menuList } = toRefs(cate)
const { vouchers_amount, vouchers_amount_loading } = toRefs(vouchers)
const user = userStore()
const { cpy_info } = toRefs(user)
const { webview, isH5 } = toRefs(useSettings)
const addVoucherShow = ref(false); 

const tabs_list = ref([
    { label: '福利券列表', value: 'vouchers_list' },
    { label: '福利券使用列表', value: 'vouchers_list_used' },
])
const routerPath = computed(() => {
    return router.currentRoute.value.fullPath
})
const routerName = computed(() => {
    return router.currentRoute.value.name
})
const $api: any = inject('$api')
const loading = ref(false)
const tab_active = ref('vouchers_list')

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
onMounted(async () => {
    if (vouchers_amount.value == 0) {
        await vouchers.getVouchersData()
    }

})
function tabsChangeEvent() {
    console.log(tab_active.value)
    router.push({ name: tab_active.value })
    // detail_id.value = '';
}

function showAddBtn() {
    addVoucherShow.value = true
}

function setShow(v) {
    addVoucherShow.value = v
  }

</script>
<style lang="scss" scoped>
.box {
    @extend %box-sizing;

    ::v-deep {
        .el-tabs {
            // --el-tabs-header-height: 50px!important;
        }

        .el-tabs__item {
            // color: #707173; 
        }

        .el-tabs__item.is-active {
            color: var(--el-color-primary);
        }

        .el-tabs__nav-wrap::after {
            height: 1px;
        }
    }
}

.card {
    width: 100%;
    background-color: #f5005a;
    color: #fff;
}

.card-header {
    width: 100%;
}
</style>
