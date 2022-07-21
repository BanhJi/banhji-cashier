import AccountTypeModel from "@/scripts/model/AccountType";
import ResponseDataModel from "@/scripts/model/ResponseData";

const AccountTypeHandler = require("@/scripts/handler/accounting/accountType");
const AccountTypeCode = require("@/scripts/default_setup/AccountTypeCode");

// initial state
const state = () => ({
    list : [],
    isLoaded : false,
})

// getters
const getters = {
    primary (state) {
        return state.list.filter(item => item.is_secondary !== 1)
    },
    secondary (state) {
        return state.list.filter(item => item.is_secondary === 1)
    },
    cash (state) {
        return state.list.filter(item => item.is_secondary !== 1 && ~AccountTypeCode.CASH_ACCOUNTS.indexOf(item.code));
    },
    getByCode: (state) => (code) => {
        let index = state.list.findIndex(item => item.code === code);
        if(index > -1){
            return state.list[index];
        }else{
            return new AccountTypeModel();
        }
    },
}

// actions
const actions = {
    async getList({ state, commit }) {
        if(!state.isLoaded){
            commit("setLoaded", true);
            
            /* Query */
            const response = new ResponseDataModel(await AccountTypeHandler.getAll());
            const types = response.data.filter((item) => item.is_deleted !== 1);

            /* Update Accounts */
            // if(rootState.accounts.list.length > 0){
            //     rootState.accounts.list.forEach(value => {
            //         let accountType = types.find((i) => i.code === value.type_code);
            //         if(accountType){
            //             value.account_type = accountType;
            //         }
            //     });
            // }

            /* Set List */
            commit("setList", types);
        }
    },
}

// mutations
const mutations = {
    setList(state, value) {
        state.list = value;
    },
    setLoaded(state, value) {
        state.isLoaded = value;
    },
    save(state, value){
        let index = state.list.findIndex((item) => item.code === value.code);

        if (index > -1) { /* Update */
            Object.assign(state.list[index], value);
        }else{/* Add New */
            state.list.push(value);
        }
    },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}