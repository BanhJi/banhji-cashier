import CurrencyModel from "@/scripts/model/Currency";
const currencyHandler = require('@/scripts/currency/handler/currencyHandler');

// initial state
const state = () => ({
    list: [],
    isLoaded: false,
})

// getters
const getters = {
    getByCode: (state) => (code) => {
        let index = state.list.findIndex(item => item.code === code);
        if(index > -1){
            return state.list[index];
        }else{
            return new CurrencyModel();
        }
    },
}

// actions
const actions = {
    async getList ({ state, commit }) {
        if(!state.isLoaded){
            let response = await currencyHandler.getAll();
            commit("setList", response.data.data);
            commit("setLoaded", true);
        }

        return state.list;
    },
    addList({ commit }, list) {
        commit("setList", list);
        commit("setLoaded", true);
    },
}

// mutations
const mutations = {
    setList (state, list) {
        state.list = list
    },
    setLoaded (state, status) {
        state.isLoaded = status
    },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}