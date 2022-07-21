// import AccountTypeModel from "@/scripts/model/AccountType";
// import ResponseDataModel from "@/scripts/model/ResponseData";

const ReconcileRuleHandler = require("@/scripts/handler/accounting/reconcileRule");

// initial state
const state = () => ({
    list : [],
    isLoaded : false,
})

// getters
const getters = {}

// actions
const actions = {
    async getList({ state, commit }) {
        if(!state.isLoaded){
            commit("setLoaded", true);
            
            /* Query */
            const response = await ReconcileRuleHandler.getAll();

            /* Set List */
            commit("setList", response.data.data);
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
        let index = state.list.findIndex((item) => item.pk === value.pk);
        
        if (index > -1) { /* Update */
            Object.assign(state.list[index], value);
        }else{/* Add New */
            state.list.push(value);
        }
    },
    removeItem(state, value){
        let index = state.list.findIndex((item) => item.pk === value.pk);
        
        /* Remove at specific index */
        if (index > -1) {
            state.list.splice(index, 1);
        }
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}