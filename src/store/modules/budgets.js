const BudgetHandler = require('@/scripts/handler/workingcapital/budgetHandler');
const BudgetTypes = require('@/scripts/default_setup/BudgetTypes');

// initial state
const state = () => ({
    list: [],
    isLoaded: false,
})

// getters
const getters = {
    segment (state) {
        return state.list.filter((item) => item.budget_type === BudgetTypes.STANDARD && item.segment_uuid !== "");
    },
    location (state) {
        return state.list.filter((item) => item.budget_type === BudgetTypes.STANDARD && item.location_uuid !== "");
    },
    project (state) {
        return state.list.filter((item) => item.budget_type === BudgetTypes.STANDARD && item.project_uuid !== "");
    },
}

// actions
const actions = {
    async getList ({ state, commit }) {
        if(!state.isLoaded){
            let response = await BudgetHandler.getAll();
            commit("setList", response.data);
            commit("setLoaded", true);
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
    save(state, value){
        let index = state.list.findIndex((item) => item.uuid === value.uuid);

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