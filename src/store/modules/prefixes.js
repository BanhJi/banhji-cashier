import kendo from '@progress/kendo-ui';
const prefixHandler = require('@/scripts/prefixHandler');
const EntityType = require("@/scripts/default_setup/EntityType");

// initial state
const state = () => ({
    list: [],
    isLoaded: false,
})

// getters
const getters = {
    getByType: (state) => (type) => {
        return state.list.find(value => value.type.toLowerCase() === type.toLowerCase());
    },
    getNumber: (state) => async (params) => {
        const pf = state.list.find(value => value.type.toLowerCase() === params.prefix_type.toLowerCase());

        // Structure
        let structure = '', tdate = new Date(params.transaction_date);
        switch (pf.structure.toLowerCase()) {
            case 'yyyy':
                structure = tdate.getFullYear().toString();
                break;
            case 'yy':
                structure = tdate.getFullYear().toString().substr(2);
                break;
            case 'yyyymm':
                structure = tdate.getFullYear().toString() + (tdate.getMonth() + 1).toString().padStart(2, '0');
                break;
            case 'yymm':
                structure = tdate.getFullYear().toString().substr(2) + (tdate.getMonth() + 1).toString().padStart(2, '0');
                break;

            default:// None structure
                break;
        }

        // Prefix Format "JE-yymm-00000"
        let shortPrefix = pf.abbr + pf.prefixSeparator + structure + pf.numberSeparator,
            fullPrefix = pf.abbr + pf.prefixSeparator + pf.structure + pf.numberSeparator + '0'.repeat(pf.format) + `@${pf.sequcencing}`;

        // Call Last Number
        let paramData = {
                params : {
                    prefix          : fullPrefix,
                    shorten_prefix  : shortPrefix,
                    journal_date    : tdate,
                }
            };
        let response = [];
        if(params.prefix_type === EntityType.EXPENSE_SUMMARY){ /* From Expenses */
            response = await prefixHandler.lastNumberExpense(paramData);
        }else{ /* From Journals */
            response = await prefixHandler.lastNumber(paramData);
        }
        const LastNumbers = response.data;

        /* Starting Number */
        let lastNumber = pf.number;

        /* Sequcencing */
        switch (pf.sequcencing.toLowerCase()) {
            case 'month':// Month
                lastNumber = kendo.parseInt(LastNumbers.monthly_last_number);
                break;
            case 'year':// Year
                lastNumber = kendo.parseInt(LastNumbers.yearly_last_number);
                break;
            default:// Prefix
                lastNumber = kendo.parseInt(LastNumbers.last_number);
                break;
        }
        /* Increase Number By 1 */
        lastNumber++;

        /* Full Number */
        let number = pf.abbr + pf.prefixSeparator + structure + pf.numberSeparator + lastNumber.toString().padStart(pf.format, '0');

        /* Result */
        return {
            number: number,
            last_number: lastNumber,
            prefix_format: fullPrefix,
            prefix: pf,
            structure: structure,
            transaction_date: tdate,
        }
    },
    getByLastNumber: (state) => (params) => {
        const pf = state.list.find(value => value.type.toLowerCase() === params.prefix_type.toLowerCase());

        // Structure
        let structure = '', tdate = new Date(params.transaction_date);
        switch (pf.structure.toLowerCase()) {
            case 'yyyy':
                structure = tdate.getFullYear().toString();
                break;
            case 'yy':
                structure = tdate.getFullYear().toString().substr(2);
                break;
            case 'yyyymm':
                structure = tdate.getFullYear().toString() + (tdate.getMonth() + 1).toString().padStart(2, '0');
                break;
            case 'yymm':
                structure = tdate.getFullYear().toString().substr(2) + (tdate.getMonth() + 1).toString().padStart(2, '0');
                break;

            default:// None structure
                break;
        }

        /* Full Number */
        let number = pf.abbr + pf.prefixSeparator + structure + pf.numberSeparator + params.last_number.toString().padStart(pf.format, '0');

        /* Return result */
        return number;
    },
}

// actions
const actions = {
    async getList ({ state, commit }) {
        if(!state.isLoaded){
            commit("setLoaded", true);
            let response = await prefixHandler.getAll();
            commit("setList", response.data.data);
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