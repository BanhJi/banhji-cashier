import BankModel from "@/scripts/model/Bank";
import ResponseDataModel from "@/scripts/model/ResponseData";

const BankHandler = require("@/scripts/bankHandler.js");

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
        }else{
            return new BankModel();
        }
    },
    getSort (state) {
        return state.list.sort(function (a, b) {
            // cast to lowercase
            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        });
    },
}

// actions
const actions = {
    async getList({ state, commit }) {
        if(!state.isLoaded){
            commit("setLoaded", true);

            /* Query */
            const response = new ResponseDataModel(await BankHandler.getAll());
            const banks = response.data.filter((item) => item.is_deleted !== 1);

            /* Set List */
            commit("setList", banks);
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}