import AccountModel from "@/scripts/model/Account";
import AccountTypeModel from "@/scripts/model/AccountType";
import AccountGroupModel from "@/scripts/model/AccountGroup";
import ResponseDataModel from "@/scripts/model/ResponseData";

const AccountHandler = require("@/scripts/handler/accounting/account");
const AccountTypeHandler = require("@/scripts/handler/accounting/accountType");
const AccountGroupHandler = require("@/scripts/handler/accounting/accountGroup");
const ReconcileRuleHandler = require("@/scripts/handler/accounting/reconcileRule");

// initial state
const state = () => ({
    accounts : [],
    secondaryAccounts : [],
    types : [],
    secondaryTypes : [],
    groups : [],
    reconcileRules : [],
    accountLoaded : false,
    typeLoaded : false,
    groupLoaded : false,
    reconcileRuleLoaded : false,
    secondaryAccount: false,
    accountLanguage: 'English',
    classSetting:{
        C1: true,
        C2: true,
        C3: false,
        C4: false,
        C5: false,
    },
})

// getters
const getters = {
    language (state) {
        return state.accountLanguage;
    },
}

// actions
const actions = {
    /* ACCOUNT */
    async getAccounts({ state, commit, dispatch}) {
        if(!state.accountLoaded){
            commit("setAccountLoaded", true);

            /* Queries */
            await dispatch("getTypes");
            await dispatch("getGroups");
            const response = await AccountHandler.getAll();
            const accounts = new ResponseDataModel(response);

            /* Filter Data */
            let primaryAccounts = [], secondaryAccounts = [];
            accounts.data.forEach(value => {
                let account = new AccountModel(value);

                if(value.is_secondary === 1){ /* Secondardy Account */
                    account.account_type = new AccountTypeModel(state.secondaryTypes.find((i) => i.uuid === value.secondary_type_uuid));

                    secondaryAccounts.push(account);
                }else{ /* Primary Account */
                    account.account_type = new AccountTypeModel(state.types.find((i) => i.code === value.type_code));
                    account.account_group = new AccountGroupModel(state.groups.find((i) => i.code === value.group_code));

                    primaryAccounts.push(account);
                }
            });

            /* Accounts */
            commit("setAccounts", primaryAccounts);
            commit("setSecondaryAccounts", secondaryAccounts);
        }

        return state.accounts;
    },
    async getSecondaryAccounts({ state, dispatch }) {
        if(!state.accountLoaded){
            await dispatch("getAccounts");
        }

        return state.secondaryAccounts;
    },
    putAccounts({ commit }, value) {
        commit("setAccounts", value);
        commit("setAccountLoaded", true);
    },
    saveAccount({ state, commit }, value) {
        let index = state.accounts.findIndex(i => i.uuid === value.uuid)
        if (index > -1) { /* Update account */
            /* Replaces 1 element at specific index */
            state.accounts.splice(index, 1, value);
        }else{
            /* Add new account */
            commit("pushAccount", value);
        }
    },

    /* TYPE */
    async getTypes({ state, commit }) {
        if(!state.typeLoaded){
            commit("setTypeLoaded", true);

            const response = await AccountTypeHandler.getAll();
            const types = new ResponseDataModel(response);

            /* Filter Data */
            let primaryTypes = [], secondaryTypes = [];
            types.data.forEach(value => {
                if(value.is_secondary === 1){ /* Secondardy Type */
                    secondaryTypes.push(value);
                }else{ /* Primary Type */
                    primaryTypes.push(value);
                }
            });
            
            commit("setTypes", primaryTypes);
            commit("setSecondaryTypes", secondaryTypes);
        }

        return state.types;
    },
    async getSecondaryTypes({ state, dispatch }) {
        if(!state.typeLoaded){
            await dispatch("getTypes");
        }

        return state.secondaryTypes;
    },
    putTypes({ commit }, value) {
        commit("setTypes", value);
        commit("setTypeLoaded", true);
    },
    saveType({ state, commit }, value) {
        let index = state.types.findIndex(i => i.code === value.code)
        if (index > -1) { /* Update account type */
            /* Replaces 1 element at specific index */
            state.types.splice(index, 1, value);
        }else{
            /* Add new account type */
            commit("pushType", value);
        }
    },

    /* GROUP */
    async getGroups({ state, commit, dispatch }) {
        if(!state.groupLoaded){
            commit("setGroupLoaded", true);

            await dispatch("getTypes");

            const response = await AccountGroupHandler.getAll();
            let groups = new ResponseDataModel(response);

            /* Group apply type */
            groups.data.forEach(value => {
                value.account_type = new AccountTypeModel(state.types.find((i) => i.code === value.type_code));
            });

            commit("setGroups", groups.data);
        }

        return state.groups;
    },
    putGroups({ commit }, value) {
        commit("setGroups", value);
        commit("setGroupLoaded", true);
    },
    saveGroup({ state, commit }, value) {
        let index = state.groups.findIndex(i => i.code === value.code)
        if (index > -1) { /* Update account group */
            /* Replaces 1 element at specific index */
            state.groups.splice(index, 1, value);
        }else{
            /* Add new account group */
            commit("pushGroup", value);
        }
    },

    /* RECONCILE RULE */
    async getReconcileRules({ state, commit }) {
        if(!state.reconcileRuleLoaded){
            commit("setReconcileRuleLoaded", true);
            
            let response = await ReconcileRuleHandler.getAll();
            
            commit("setReconcileRules", response.data.data);
        }

        return state.reconcileRules;
    },
    putReconcileRules({ commit }, value) {
        commit("setReconcileRules", value);
        commit("setReconcileRuleLoaded", true);
    },
    saveReconcileRule({ state, commit }, value) {
        let index = state.reconcileRules.findIndex(i => i.uuid === value.uuid)
        if (index > -1) { /* Update */
            /* Replaces 1 element at specific index */
            state.reconcileRules.splice(index, 1, value);
        }else{
            /* Add new reconcile rule */
            commit("pushReconcileRule", value);
        }
    },
    deleteReconcileRule({ state }, value) {
        let index = state.reconcileRules.findIndex(i => i.uuid === value.uuid)
        if (index > -1) {
            /* Remove 1 element at specific index */
            state.reconcileRules.splice(index, 1);
        }
    },
}

// mutations
const mutations = {
    /* ACCOUNT */
    setAccounts(state, value) {
        state.accounts = value;
    },
    setSecondaryAccounts(state, value) {
        state.secondaryAccounts = value;
    },
    setAccountLoaded(state, value) {
        state.accountLoaded = value;
    },
    pushAccount(state, value) {
        state.accounts.push(value);
    },

    /* TYPE */
    setTypes(state, value) {
        state.types = value;
    },
    setSecondaryTypes(state, value) {
        state.secondaryTypes = value;
    },
    setTypeLoaded(state, value) {
        state.typeLoaded = value;
    },
    pushType(state, value) {
        state.types.push(value);
    },

    /* GROUP */
    setGroups(state, value) {
        state.groups = value;
    },
    setGroupLoaded(state, value) {
        state.groupLoaded = value;
    },
    pushGroup(state, value) {
        state.groups.push(value);
    },

    /* RECONCILE RULE */
    setReconcileRules(state, value) {
        state.reconcileRules = value;
    },
    setReconcileRuleLoaded(state, value) {
        state.reconcileRuleLoaded = value;
    },
    pushReconcileRule(state, value) {
        state.reconcileRules.push(value);
    },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}