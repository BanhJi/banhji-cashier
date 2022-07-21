// import VarianceRuleModel from "@/scripts/model/VarianceRule";
import ResponseDataModel from "@/scripts/model/ResponseData";

const VarianceRuleHandler = require("@/scripts/handler/accounting/varianceRuleHandler");

// initial state
const state = () => ({
    list : [],
    isLoaded : false,
})

// getters
const getters = {
    getById: (state) => (id) => {
        let index = state.list.findIndex(item => item.uuid === id);
        if(index > -1){
            return state.list[index];
        }
    },
}

// actions
const actions = {
    async getList({ state, commit }) {
        if(!state.isLoaded){
            commit("setLoaded", true);
            
            /* Query */
            const response = new ResponseDataModel(await VarianceRuleHandler.getAll());
            const data = response.data.filter((item) => item.is_deleted !== 1);

            /* Set List */
            commit("setList", data);
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
        let index = state.list.findIndex((item) => item.uuid === value.uuid);

        if (index > -1) { /* Update */
            Object.assign(state.list[index], value);
        }else{/* Add New */
            state.list.push(value);
        }
    },
    removeItem(state, value){
        let index = state.list.findIndex((item) => item.uuid === value.uuid);
        
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