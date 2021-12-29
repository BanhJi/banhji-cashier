import kendo from '@progress/kendo-ui';
// import { DataSource, DataSourceInstaller } from '@progress/kendo-datasource-vue-wrapper'
import BudgetModel from "@/scripts/model/workingcapital/Budget.js";

const store = require("@/institute.js");
const apiUrl = require('@/apiUrl.js');
const urlPath = apiUrl.working_capital + '/budgets';

// Bind kendo datasource
if(store.default.state.budgetDS === null){
    let dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: urlPath,
                dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                contentType: "application/json",
                type: "GET",
            },
            create: {
                url: urlPath,
                dataType: "json",
                contentType: "application/json",
                type: "POST",
            },
            update: {
                url: urlPath,
                dataType: "json",
                contentType: "application/json",
                type: "POST",
            },
            destroy: {
                url: urlPath,
                dataType: "json",
                contentType: "application/json",
                type: "POST",
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    window.console.log(options.models)
                    return kendo.stringify(options.models);
                }
            }
        },
        schema: {
            model: BudgetModel,
            total: function(response) {
                let total = 0;
                if(response.data){
                    total = response.data.length;
                }

                return total; // total is returned in the "total" field of the response
            },
            errors: function(response) {
                /* The result can be observed in the DevTools(F12) console of the browser. */
                window.console.log("errors as function", response.errors)
                return response.errors;
            },
            error: function(e) {
                /* The result can be observed in the DevTools(F12) console of the browser. */
                window.console.log("error event handler", e.errors);
            }
        },
        serverFiltering: true,
    });

    // Store in vuex
    store.default.commit("setBudgetDS", dataSource);
}

export default store.default.state.budgetDS;

/*
    // How To Use:
    import Person from "@/scripts/Person.js";
*/