import AccountGroupModel from "@/scripts/model/AccountGroup";
import ResponseDataModel from "@/scripts/model/ResponseData";

const AccountGroupHandler = require("@/scripts/handler/accounting/accountGroup");

// initial state
const state = () => ({
    list : [],
    isLoaded : false,
})

// getters
const getters = {
    getList (state) {
        return state.list;
    },
    getByCode: (state) => (code) => {
        let index = state.list.findIndex(item => item.code === code);
        if(index > -1){
            return state.list[index];
        }else{
            return new AccountGroupModel();
        }
    },
    getByTypeCode: (state) => (code) => {
        return state.list.filter(item => item.type_code === code);
    }
}

// actions
const actions = {
    async getList({ state, commit, rootState }) {
        if(!state.isLoaded){
            commit("setLoaded", true);

            /* Query */
            const response = new ResponseDataModel(await AccountGroupHandler.getAll());
            const groups = response.data.filter((item) => item.is_deleted !== 1);

            /* Update Accounts */
            if(rootState.accounts.list.length > 0){
                rootState.accounts.list.forEach(value => {
                    if(value.group_code != 0){
                        let accountGroup = groups.find((i) => i.code === value.group_code);
                        if(accountGroup){
                            value.account_group = accountGroup;
                        }
                    }else{
                        value.account_group = null;
                    }
                });
            }

            /* Set List */
            commit("setList", groups);
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