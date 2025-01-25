import {
	defineStore
} from 'pinia';
import apis from '@/apis/index'
// import { useStoreB } from '@/store/modules/page_b';
// const storeB = useStoreB();
// let { pniaBcuntData } = storeToRefs(storeB);

export const useApplymentsStore = defineStore('applyments', {
	persist: {
		// enabled: true, 
	},
	state: () => {
		return { 
            applyments_detail: {},
            applyments_sign: {},
            applyments_alert: '',
            applyments_detail_loading: false,
		};
	},
	getters: {
        applyments_zt: (state) => state.applyments_detail.zt , 
    }, 
	actions: { 
		async getApplymentsDetail(needLoading = false) { 
            if(this.applyments_detail_loading) return 
            this.applyments_detail_loading = true;
            try {
                const res = await apis.applyments_detail();
                if(res.code == 1) {
                    this.applyments_detail = res.list || {};
                    this.applyments_alert = res.info || '';
                    this.applyments_sign = res.applyments || {};
                }
            } catch (error) {
                
            }
            this.applyments_detail_loading = false;
			
		}, 
		async checkNeedBankBranch (needLoading = false) { 
            const res = await apis.search_bank({params: {name: this.applyments_detail.account_bank}});
            if(res.code == 1) {//bank_alias
                let need = 0
                if(res.list && res.list.length > 0) {
                    res.list.some(ele => {
                        if(ele.bank_alias == this.applyments_detail.account_bank) {
                            need = ele.need_bank_branch
                        }
                        return ele.bank_alias == this.applyments_detail.account_bank
                    })
                }
                if(need == 0) {
                    this.applyments_detail.bank_name= ''
                    this.applyments_detail.bank_branch_id = ''
                }
            } 
			
		}, 
	},
});
