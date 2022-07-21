const uomHandler = require('@/scripts/uomHandler');
const defaultUOM = {id:"",name:""};

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
            return defaultUOM;
        }
    },
}

// actions
const actions = {
    async getList ({ state, commit }) {
        if(!state.isLoaded){
            commit("setLoaded", true);
            let response = await uomHandler.getAll();
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