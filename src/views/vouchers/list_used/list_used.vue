<!--  -->
<template>
    <div class="box u-p-10 u-radius-15 bg-white ">
        <voucher-header></voucher-header>
        <table-vouchers-list api="use_vouchers" ></table-vouchers-list> 
    </div>
  </template>
  
  <script setup lang='ts'>
  import { reactive,ref, inject} from 'vue'  
  const $api: any = inject('$api')
  // $api.product()   
  </script>
  <style lang='scss' scoped>
  .box {
    @extend %box-sizing;
  }
  </style>