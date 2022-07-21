import AccountModel from "@/scripts/model/Account";
// import AccountTypeModel from "@/scripts/model/AccountType";
// import AccountGroupModel from "@/scripts/model/AccountGroup";
// import AccountTreeListModel from "@/scripts/model/AccountGroup";

const AccountHandler = require("@/scripts/handler/accounting/account");
const AccountTypeCode = require("@/scripts/default_setup/AccountTypeCode");

// initial state
const state = () => ({
    list : [],
    isLoaded : false,
})

// getters
const getters = {
    primary (state) {
        return state.list.filter(item => item.is_secondary !== 1);
    },
    secondary (state) {
        return state.list.filter(item => item.is_secondary === 1);
    },
    cash (state) {
        return state.list.filter(item => item.is_secondary !== 1 && ~AccountTypeCode.CASH_ACCOUNTS.indexOf(item.type_code));
    },
    cashAdvance (state) {
        return state.list.filter(item => item.is_secondary !== 1 && item.type_code === AccountTypeCode.CASH_ADVANCE);
    },
    relatedExpense (state) {
        return state.list.filter(item => item.is_secondary !== 1 && ~AccountTypeCode.RELATED_EXPENSES.indexOf(item.type_code));
    },
    revenueDefferedGrant (state) {
        return state.list.filter(item => item.is_secondary !== 1 && ~AccountTypeCode.REVENUE_DEFFERED_GRANT_ACCOUNTS.indexOf(item.type_code));
    },
    advanceSettlementClearing (state) {
        let index = state.list.findIndex(item => item.banhji_account_number === AccountTypeCode.ADVANCE_SETTLEMENT_CLEARING_CODE);
        if(index > -1){
            return state.list[index];
        }else{
            return new AccountModel();
        }
    },
    otherClearingSuspense (state) {
        let index = state.list.findIndex(item => item.banhji_account_number === AccountTypeCode.OTHER_CLEARING_SUSPENSES_CODE);
        if(index > -1){
            return state.list[index];
        }else{
            return new AccountModel();
        }
    },
    taxRelatedExpense (state) {
        let index = state.list.findIndex(item => item.banhji_account_number === AccountTypeCode.TAX_RELATED_EXPENSE_CODE);
        if(index > -1){
            return state.list[index];
        }else{
            return new AccountModel();
        }
    },
    payable (state) {
        return state.list.filter(item => item.is_secondary !== 1 && ~AccountTypeCode.PAYABLE_ACCOUNTS.indexOf(item.type_code));
    },
    getById: (state) => (id) => {
        let index = state.list.findIndex(item => item.uuid === id);
        if(index > -1){
            return state.list[index];
        }else{
            return new AccountModel();
        }
    },
    getByNumber: (state) => (number) => {
        let index = state.list.findIndex(item => item.number === number);
        if(index > -1){
            return state.list[index];
        }else{
            return new AccountModel();
        }
    },
    getByBanhjiNumber: (state) => (number) => {
        let index = state.list.findIndex(item => item.banhji_account_number === number);
        if(index > -1){
            return state.list[index];
        }else{
            return new AccountModel();
        }
    },
    getByTypeCode: (state) => (code) => {
        return state.list.filter(item => item.type_code === code);
    },
    getByGroupCode: (state) => (code) => {
        return state.list.filter(item => item.group_code === code);
    },
    /* Tree List */
    treeListParse: () => (accounts) => {
        let g = {};

        accounts.forEach(value => {
            /* GROUPING TOP LEVEL */
            /* Account Type */
            if(!g[value.type_code]){
                g[value.type_code] = {
                    uuid : value.type_code,
                    number : value.type_code,
                    name : value.account_type.name,
                    local_name : value.account_type.local_name,
                    parentId : null,
                    account_type: null,
                    account_group: null,
                }
            }
            
            /* Child Level */
            if(!g[value.uuid]){
                g[value.uuid] = value;

                /* Set Account Type As Parent */
                if(value.parentId === null){
                    g[value.uuid]["parentId"] = value.type_code;
                }
            }
        });

        /* Remove object */
        return Object.values(g);
    },
    treeList (state, getters) {
        return getters.treeListParse(getters.primary);
    },
    treeListSecondary (state, getters) {
        return getters.treeListParse(getters.secondary);
    },
    treeListCash (state, getters) {
        return getters.treeListParse(getters.cash);
    },
    treeListByTypeCodes: (state, getters) => (typeCodes) => {
        let accounts = getters.primary.filter((item) => ~typeCodes.indexOf(item.type_code));

        return getters.treeListParse(accounts);
    },
    treeListByAccountIds: (state, getters) => (ids) => {
        let g = {}, accounts = [];
        
        /* Child Accoun */
        getters.primary.forEach(value => {
            if(~ids.indexOf(value.uuid)){
                g[value.parentId] = value.parentId;
                accounts.push(value);
            }
        });

        /* Parent Account */
        for (let key in g){
            let parent = getters.primary.find((item) => item.uuid === key);
            if(parent){
                accounts.push(parent);
            }
        }

        return getters.treeListParse(accounts);
    },
}

// actions
const actions = {
    /* Get List */
    async getList({ state, commit }) {
        if(!state.isLoaded){
            commit("setLoaded", true);

            /* Query */
            const response = await AccountHandler.getAll();
            
            /* Exclude system accounts */
            let systemAccountNumbers = ["331030", "331040"];

            /* Filter Data */
            let accounts = response.data.filter((item)=> item.is_deleted !== 1 && !~systemAccountNumbers.indexOf(item.number));
            
            accounts.forEach(value => {
                /* Parent Account */
                value.parentId = null;
                if(value.parent_account != undefined){
                    if(value.parent_account.banhji_account_number !== ""){ /* Get by banhji account number */
                        let pa = response.data.find((item) => item.banhji_account_number === value.parent_account.banhji_account_number);
                        if(pa){
                            value.parentId = pa.uuid;
                        }
                    }else{ /* Get by uuid */
                        let pa = response.data.find((item) => item.uuid === value.parent_account.uuid);
                        if(pa){
                            value.parentId = pa.uuid;
                        }
                    }
                }else{
                    value.parent_account = null;
                }

                /* Check if self id equal parentId */
                if(value.uuid === value.parentId){
                    value.parentId = null;
                }

                /* Account Group */
                if(value.account_group == undefined){
                    value.account_group = null;
                }
            });

            /* Set List */
            commit("setList", accounts);
        }
    },
    putList({ commit }, value) {
        commit("setList", value);
        commit("setLoaded", true);
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
  mutations,
}