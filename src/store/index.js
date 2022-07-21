import Vue from 'vue';
import Vuex from 'vuex';

import accountGroups from './modules/accountGroups';
import accounting from './modules/accounting';
import accounts from './modules/accounts';
import accountTypes from './modules/accountTypes';
import bankAccounts from './modules/bankAccounts';
import bankAccountTypes from './modules/bankAccountTypes';
import banking from './modules/banking';
import banks from './modules/banks';
import bankMapping from './modules/bankMapping';
import budgets from './modules/budgets';
import classes from './modules/classes';
import compliance from './modules/compliance';
import currencies from './modules/currencies';
import customers from './modules/customers';
import discountItems from './modules/discountItems';
import donors from './modules/donors';
import employees from './modules/employees';
import fundCategories from './modules/fundCategories';
import historyPage from './modules/historyPage';
import institute from './modules/institute';
import locations from './modules/locations';
import paymentOptions from './modules/paymentOptions';
import paymentTerms from './modules/paymentTerms';
import prefixes from './modules/prefixes';
import projects from './modules/projects';
import reconcileRules from './modules/reconcileRules';
import segments from './modules/segments';
import suppliers from './modules/suppliers';
import taxes from './modules/taxes';
import unitOfMeasurements from './modules/unitOfMeasurements';
import varianceRules from './modules/varianceRules';
// import createLogger from '../../../src/plugins/logger';

Vue.use(Vuex);

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        accountGroups,
        accounting,
        accounts,
        accountTypes,
        bankAccounts,
        bankAccountTypes,
        banking,
        banks,
        bankMapping,
        budgets,
        classes,
        compliance,
        currencies,
        customers,
        discountItems,
        donors,
        employees,
        fundCategories,
        historyPage,
        institute,
        locations,
        paymentOptions,
        paymentTerms,
        prefixes,
        projects,
        reconcileRules,
        segments,
        suppliers,
        taxes,
        unitOfMeasurements,
        varianceRules,
    }, 
    // strict: debug,
    // plugins: debug ? [createLogger()] : []
})