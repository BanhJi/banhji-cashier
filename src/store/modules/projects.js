import ProjectModel from "@/scripts/model/Project";
const projectHandler = require('@/scripts/projectHandler');

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
            return new ProjectModel();
        }
    },
    getByCode: (state) => (code) => {
        let index = state.list.findIndex(item => item.code === code);
        if(index > -1){
            return state.list[index];
        }else{
            return new ProjectModel();
        }
    },
    getDefault (state) {
        let index = state.list.findIndex(item => item.isSystem === 1);
        if(index > -1){
            return state.list[index];
        }else{
            return new ProjectModel();
        }
    },
}

// actions
const actions = {
    async getList ({ state, commit }) {
        if(!state.isLoaded){
            commit("setLoaded", true);
            let response = await projectHandler.getAll();
            commit("setList", response.data.data);
        }

        return state.list;
    },
    addList({ commit }, list) {
        commit("setLoaded", true);
        commit("setList", list);
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
    save(state, value){
        let index = state.list.findIndex((item) => item.id === value.id);

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