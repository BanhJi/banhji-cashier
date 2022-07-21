import ResponseDataModel from "@/scripts/model/ResponseData";

const BankAccountHandler = require("@/scripts/bankAccountHandler.js");

// initial state
const state = () => ({
    list : [],
    isLoaded : false,
})

// getters
const getters = {
    getById: (state) => (id) => {
        return state.list.find(item => item.uuid === id);
    },
}

// actions
const actions = {
    async getList({ state, commit }) {
        if(!state.isLoaded){
            commit("setLoaded", true);

            /* Query */
            const response = new ResponseDataModel(await BankAccountHandler.getAll());
            const bankAccounts = response.data.filter((item) => item.is_deleted !== 1);

            /* Set List */
            commit("setList", bankAccounts);
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
        let index = state.list.findIndex(i => i.uuid === value.uuid);

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