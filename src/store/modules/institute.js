/* Cookie */
const cookieJS = require("@/cookie.js");
const { instituteId } = cookieJS.getCookie();

const instituteHandler = require("@/scripts/instituteHandler.js");

const defaultData = {
    id : '',
    dateFormat : "dd-MM-yyyy",
    baseCurrency : {
        name : "United States dollar",
        symbol : "US$",
        code : "USD"
    },
    reportingCurrency : {
        name : "Cambodian riel",
        symbol : "៛",
        code : "KHR"
    },
    approvedReportingDate : new Date().getFullYear() + "-04-30T00:00:00.000Z",
    fiscalDate : [{
        end_date : new Date().getFullYear() + '-12-31',
        institute : "",
        uuid : "",
        first_fiscal_year : new Date().getFullYear() + '-01-01',
        start_date : new Date().getFullYear() + '-01-01'
    }],
    timeZone : {
        name : "Phnom Penh",
        value : "Asia/Phnom_Penh"
    },
};

// initial state
const state = () => ({
    institute : defaultData
})

// getters
const getters = {
    instituteId (state) {
        return state.institute.id;
    },
    dateFormat (state) {
        return state.institute.dateFormat;
    },
    baseCurrency (state) {
        return state.institute.baseCurrency;
    },
    reportingCurrency (state) {
        return state.institute.reportingCurrency;
    },
    approvedReportingDate (state) {
        return state.institute.approvedReportingDate;
    },
    fiscalDate (state) {
        return state.institute.fiscalDate;
    },
};

// actions
const actions = {
    async init({ commit }) {
        if (instituteId !== '') {
            let response = await instituteHandler.init();
            commit("setInstitute", response.data.data);
        } else {
            commit("setInstitute", defaultData);
        }
    },
};

// mutations
const mutations = {
    setInstitute(state, value) {
        state.institute = value;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}