import axios from '@/request/index';

// applyments_options 支付商户申请页
export const applyments_options = (data) => axios.get('Userapi/applyments_options', data)
// search_bank 搜索银行 参数name p没传name就返回全部的第一页 need_bank_branch=1才需要使用下面两个接口。
export const search_bank = (data) => axios.get('Userapi/search_bank', data)
// search_city 查询城市列表 参数province_code省code 根据applyments_options接口里的provinces 省份code列出省下的市
export const search_city = (data) => axios.get('Userapi/search_city', data)
// search_branches 查询支行列表 参数bank_alias_code city_code p
export const search_branches = (data) => axios.get('Userapi/search_branches', data)

// applyments_detail 支付商户信息 返回的zt=0未提交1已提交 2通过  不通过的状态会打回0。只有在0状态下可以修改。
export const applyments_detail = (data) => axios.get('Userapi/applyments_detail', data)

// edit_applyments 创建编辑支付商户信息
    // 参数：
    // `organization_type` '主体类型',
    // `business_license_copy` '营业执照扫描件',
    // `business_license_number`  '营业执照注册号',
    // `merchant_name` '商户名称',
    // `legal_person`  '经营者/法定代表人姓名',
    // `id_card_copy` '身份证人像面照片',
    // `id_card_national` '身份证国徽面照片',
    // `id_card_name`  '身份证姓名',
    // `id_card_number`  '身份证号码',
    // `id_card_valid_time_begin`  '身份证开始时间',
    // `id_card_valid_time`  '身份证结束时间',
    // `bank_account_type` '账户类型',
    // `account_bank`  '开户银行',
    // `account_name` '开户名称',
    // `bank_address_code` '开户银行省市编码',
    // `bank_branch_id`  '开户银行联行号',
    // `bank_name` '开户银行全称 （含支行）',
    // `account_number`  '银行账号',
    // `mobile_phone` '超级管理员手机',
    // `store_name` '店铺全称',
    // `merchant_shortname`  '商户简称',
export const edit_applyments = (data, config) => axios.post('Userapi/edit_applyments', data, config)  

// submit_applyments  提交申请(微信支付商户)  商户信息编辑好后提交微信申请商户号。
export const submit_applyments = (data) => axios.get('Userapi/submit_applyments', data)