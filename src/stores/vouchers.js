
import pinia from '@/stores/index';  
import {
	defineStore
} from 'pinia';
import { ElNotification, ElMessageBox } from 'element-plus'
import apis from '@/apis/index'
// import menuList from '@/utils/menuList' 
// import menuList2 from '@/utils/menuList_operate' 
import {deepClone, initAddressData} from '@/utils/index' 
import router from '@/router/guard' 
// import {
// 	User, Setting, Handbag, Pointer, Postcard, Files, Box
// } from "@element-plus/icons-vue";   
export const useVouchersStore = defineStore('vouchers', { 
	state: () => {
		return {
            vouchers_amount: 0, 
            vouchers_amount_loading: false
		};
	},  
	actions: {  
		async getVouchersData(needLoading = false) {
            if(this.vouchers_amount_loading) return;
            this.vouchers_amount_loading = true
			const res = await apis.vouchers_amount({ needLoading });
			if (res.code == 1) {
				this.vouchers_amount = res.list || 0
			} 
            this.vouchers_amount_loading = false
		}, 
	},
});
 