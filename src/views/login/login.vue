<!--  -->
<template> 
	<div class="u-m-15 u-p-t-20 u-p-b-20 u-m-t-40 bg-white u-radius-8">
		<el-form 
            ref="formRef" 
            :model="dynamicValidateForm" 
            label-width="120px" 
            :rules="rules"
            class="demo-dynamic u-p-20 box-border" 
            label-position="top" 
            scroll-to-error 
            inline-message
            > 
			<div class="u-m-b-20"> 
				<div class="u-flex u-flex-between u-flex-items-end" >
					<el-text style="color: #000;" tag="b" class="u-font-22" >账号登录</el-text>
					<div>
						<el-switch
							v-model="codeLogin" 
							active-text="验证码登录" 
						/>
					</div>
				</div>
			</div>
			<template v-if="codeLogin">
				<el-form-item prop="phone" class="u-m-b-30"> 
					<el-input size="large" suffix-icon="phone" v-model="dynamicValidateForm.phone" clearable placeholder="手机号" />
				</el-form-item> 
				<el-form-item prop="code" class="u-m-b-30">
					<div class="u-flex u-flex-items-center ">
						<el-input 
							class="u-flex-1 u-m-r-20"
							size="large"
							v-model="dynamicValidateForm.code"   
							clearable
							suffix-icon="ChatLineRound"
							placeholder="验证码"
						/>
						<el-button 
							type="primary"   
							icon="Message"
							size="large"
							:disabled="getCodeDisabled"  
							:loading="getCodeLoading"   
							@click="getCodeBtn"
							> 
							<span v-if="!getCodeCountDownShow">发送验证码</span> 
							<div class="u-flex u-flex-items-center" v-else>
								<el-countdown 
									:valueStyle="{
										color: '#fff',
										fontSize: '14px', 
									}" 
									style="margin-top: -5px;"
									format="ss"
									:value="time" 
									@finish="countDownFinish"  
								/>
								<span>秒后可重新发送</span>
							</div>
							
						</el-button>
					</div>
					
				</el-form-item> 
			</template>
			<template v-if="!codeLogin">
				<el-form-item prop="username" class="u-m-b-30"> 
					<el-input size="large" suffix-icon="user" v-model="dynamicValidateForm.username" clearable placeholder="账号" />
				</el-form-item> 
				<el-form-item prop="password" class="u-m-b-30"> 
					<el-input size="large" type="password" suffix-icon="lock" v-model="dynamicValidateForm.password" clearable placeholder="密码" />
				</el-form-item> 

			</template>
            
            <el-form-item>
                <el-button plain class="u-m-t-30" size="large" style="width: 100%;" type="primary" @click="submitForm(formRef)">提交</el-button>
            </el-form-item>
            <el-form-item > 
                <div>
					<router-link :to="{name: 'reg'}">没有账号？立即注册</router-link> 
				</div>
            </el-form-item> 
        </el-form>
	</div>
</template>

<script setup lang='ts'>

import { ref, watch, computed, onMounted, toRefs  } from "vue";
import router from "@/router/guard" 
import { userStore } from '@/stores/user'
import { ElMessage } from 'element-plus' 
import test from '@/utils/test.js'
import { deepClone } from '@/utils' 
const $api: any = inject('$api')  
import type { FormInstance, FormRules } from 'element-plus'
const user = userStore()
const { role,showVouchersMenus, showXcxMenus } = toRefs(user)
const routerName = computed(() => { 
	return router.currentRoute.value.name
}) 
const TIME_COUNT_DOWN = 1000 * 60
const TIME_COUNT_DOWN2 = 1000 * 5
const time = ref(TIME_COUNT_DOWN)
const getCodeLoading = ref(false)
const getCodeDisabled = computed(() => getCodeLoading.value || getCodeCountDownShow.value || !test.mobile(dynamicValidateForm.phone))
const getCodeCountDownShow = ref(false)
const formRef = ref<FormInstance>() 
const props = defineProps({
	customStyle: {
		type: Object,
		deafult: () => {
			return {
        backgroundImage: 'radial-gradient(transparent 1px, #F1F6FD 1px)',
        boxShadow: 'none'
      }
		}
	},
	simple: {
		type: Boolean,
		deafult: false
	}
})
const codeLogin = ref(false)
const checkMobile = (rule: any, value: any, callback: any) => {
  if (!value) { 
    callback(new Error('请输入手机号'))
  }
    else if (!test.mobile(value)) { 
    callback(new Error('手机格式有误'))
  } else {
    callback()
  }
}
const rules = {
	phone: [{
		required: true,
		message: '不能为空',
		trigger: 'blur'
	},{ 
		validator: checkMobile, 
		trigger: ['blur', 'change'],
	}],
	code: {
		required: true,
		message: '验证码不能为空',
		trigger: 'blur'
	},
	username: {
		required: true,
		message: '账号不能为空',
		trigger: 'blur'
	},
	password: {
		required: true,
		message: '密码不能为空',
		trigger: 'blur'
	}
}

watch(
	() => router.currentRoute.value.query,
	(n) => { 
		if(n.phone == 1) codeLogin.value = true
	},
	{
		immediate: true,
		deep: true
	}
)
const dynamicValidateForm = reactive<{
    phone: string 
	code: string
	username: string
	password: string
}>({
    phone: '', 
	code: '', 
	username: '', 
	password: ''
})
function countDownFinish() { 
    console.log('f') 
    getCodeLoading.value = false
    getCodeCountDownShow.value = false
}
async function getCodeBtn() {
    if(getCodeLoading.value) return
    getCodeLoading.value = true
    try {
        const res = await $api.get_code_login({
            params: {
                phone: dynamicValidateForm.phone
            },
            loading: false
        })
        if(res.code == 1) {
            ElMessage.success(res.msg) 
            getCodeCountDownShow.value = true 
            time.value = Date.now() + TIME_COUNT_DOWN 
        }
    } catch (error) { 
        getCodeCountDownShow.value = true 
        time.value = Date.now() + TIME_COUNT_DOWN2
    }
    getCodeLoading.value = false
    
}
function submitForm(formEl: FormInstance | undefined) { 
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            console.log('submit!')
            let params = deepClone(dynamicValidateForm);
            await submitApi({
                ...params 
            })
        } else {
            console.log('error submit!')
            return false
        }
    })
}
async function submitApi(data) {
    const res = await $api.login({
        params: {
			...data
		}
    })
    if (res.code == 1) {
        ElMessage.success(res.msg)
		user.setCookie('sunmaxx_st_company', res.list, 30)
        router.push({
            name: 'welfare'
        })
    }
} 
</script>
<style lang='scss' scoped>

header {
	transition: all .3s;
}
::v-deep .input-with-select {
	background-color: transparent;
	.el-input__wrapper {
		box-shadow: none;
	}
}
.input-with-select {
	height: 40px;
}

.search-in-select {
	width: 115px;
}

header {
	color: $uni-text-color-grey;
	// background: #fff;
	border-bottom: 1px solid #f8f8f8;
	
	background-image: radial-gradient(transparent 1px, #fff 1px);
	// background-size: 4px 4px;
  //   backdrop-filter: saturate(50%) blur(4px);
  //   -webkit-backdrop-filter: saturate(50%) blur(4px);
	position: relative;
	z-index: 50;
	&.header {
		.header-top {
			background-color: #fafafa;
			font-size: 12px;
			border-bottom: 1px solid #e7e7e7;

			.home-w {
				@include flex(x, between);
				height: 40px;

				.top-left {
					@include flex(x);

					.login {
						cursor: pointer;
						color: $uni-color-primary;
					}

					.reg {
						border-left: 1px solid #ddd;
						cursor: pointer;
					}
				}

				.top-right {
					& > a,
					> span {
						padding: 0 5px;
					}
				}
			}
		}

		.header-main {
			.home-w {
				@include flex(x, between);
				height: $header-h;
			}

			.main-logo {
				flex: 0 0 300px;

				.logo {
					height: 40px;
				}
			}
			.main-nav {
				@include flex(x);
				.nav-item {
					padding: 0 8px;
					margin-left: 15px;
					font-size: 14px;
					cursor: pointer;
				}
			}
 
		} 
	}
}
</style>