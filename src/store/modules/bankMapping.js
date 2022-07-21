import BankMappingModel from "@/scripts/model/BankMapping";
import ResponseDataModel from "@/scripts/model/ResponseData";

const bankMappingHandler = require("@/scripts/bankMappingHandler.js");
const BankMappingType = require("@/scripts/default_setup/BankMappingType");

// initial state
const state = () => ({
    list : [],
    isLoaded : false,
})

// getters
const getters = {
    rule (state) {
        return state.list.filter(item => item.type === BankMappingType.RULE);
    },
    importMapping (state) {
        return state.list.filter(item => item.type === BankMappingType.IMPORT_MAPPING);
    },
    getById: (state) => (id) => {
        let index = state.list.findIndex(item => item.uuid === id);
        if(index > -1){
            return state.list[index];
        }else{
            return new BankMappingModel();
        }
    },
    getImportMappingByBankId: (state) => (id) => {
        let index = state.list.findIndex(item => item.bank_uuid === id);
        if(index > -1){
            return state.list[index];
        }else{
            return new BankMappingModel();
        }
    },
}

// actions
const actions = {
    async getList({ state, commit }) {
        if(!state.isLoaded){
            commit("setLoaded", true);

            /* Query */
            const response = new ResponseDataModel(await bankMappingHandler.getAll());
            const results = response.data.filter((item) => item.is_deleted !== 1);

            /* Set List */
            commit("setList", results);
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}