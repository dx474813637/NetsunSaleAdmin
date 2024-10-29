import {
	defineStore
} from 'pinia';
import apis from '@/apis/index'
// import { useStoreB } from '@/store/modules/page_b';
// const storeB = useStoreB();
// let { pniaBcuntData } = storeToRefs(storeB);

export const useApplymentsStore = defineStore('applyments', {
	persist: {
		enabled: true, 
	},
	state: () => {
		return { 
            applyments_detail: {},
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
                }
            } catch (error) {
                
            }
            this.applyments_detail_loading = false;
			
		}, 
	},
});
