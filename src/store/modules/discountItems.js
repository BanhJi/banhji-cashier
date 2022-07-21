const discountItemHandler = require('@/scripts/discountItemHandler');
const defaultDiscountItem = {id:"",name:""};

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
            return defaultDiscountItem;
        }
    },
    purchase (state) {
        return state.list.filter(item => item.type.toLowerCase() === "purchase");
    },
}

// actions
const actions = {
    async getList ({ state, commit }) {
        if(!state.isLoaded){
            commit("setLoaded", true);
            let response = await discountItemHandler.getAll();
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}