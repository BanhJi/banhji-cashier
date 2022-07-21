const taxHandler = require('@/scripts/taxHandler');
const defaultTax = {id:"",name:""};

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
            return defaultTax;
        }
    },
    purchase (state) {
        return state.list.filter(item => item.transactionType.toLowerCase() === "purchase");
    },
}

// actions
const actions = {
    async getList ({ state, commit }) {
        if(!state.isLoaded){
            commit("setLoaded", true);
            let response = await taxHandler.getAll();
            commit("setList", response.data.data);
        }

        return state.list;
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