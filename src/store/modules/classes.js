import ClassModel from "@/scripts/model/Clazz";
const classHandler = require('@/scripts/classHandler');

// initial state
const state = () => ({
    list: [],
    isLoaded: false,
})

// getters
const getters = {
    getById: (state) => (id) => {
        let index = state.list.findIndex(item => item.id === id);
        if(index > -1){
            return state.list[index];
        }else{
            return new ClassModel();
        }
    },
    getByCode: (state) => (code) => {
        let index = state.list.findIndex(item => item.code === code);
        if(index > -1){
            return state.list[index];
        }else{
            return new ClassModel();
        }
    },
}

// actions
const actions = {
    async getList ({ state, commit }) {
        if(!state.isLoaded){
            let response = await classHandler.getAll();
            commit("setList", response.data.data);
            commit("setLoaded", true);
        }

        return state.list;
    },
    addList ({ commit }, list) {
        commit('setList', list);
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
    addList({ commit }, list) {
        commit("setList", list);
        commit("setLoaded", true);
    },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}