<!--  -->
<template>
    <div class="box u-p-10 u-radius-15 bg-white ">
        <table-vouchers-list isSendBtn :update="update" @sendEvent="sendEvent" @updateBackEvent="updateBackEvent"></table-vouchers-list> 
        <voucher-send-popup :show="dialogTableVisible" :update="update" :voucherData="voucherData" @setShow="setShow" @success="successEvent"></voucher-send-popup> 
    </div>
  </template>
  
  <script setup lang='ts'>
  import { reactive,ref, inject} from 'vue'  
  const $api: any = inject('$api')
  // $api.product()  
  const voucherData = ref({});
  const update = ref(false) 
  const dialogTableVisible = ref(false); 
  function setShow(v) {
      dialogTableVisible.value = v
  }
  function updateBackEvent() {
    update.value = false 
  }
  function sendEvent({data}) {
    voucherData.value = data
    setShow(true)
  }
  function successEvent() {
    update.value = true
  }
  </script>
  <style lang='scss' scoped>
  .box {
    @extend %box-sizing;
  }
  </style>