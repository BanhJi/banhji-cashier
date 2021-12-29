import kendo from '@progress/kendo-ui';

// const $ = require("jquery");
const store	= require("@/institute.js");
const { taxHandler } = require("@/scripts/AppHandlers");
const { EntityType } = require("@/scripts/default_setup/Collections");

// Filter Tax Expense
function filterTaxExpense(taxes) {
    // return taxes.filter(value => ~EntityType.TAX_EXPENSE_CODES.indexOf(value.code));
    return taxes.filter(value => ~EntityType.TAX_EXPENSE_CODES.indexOf(value.taxType.typeId) && value.transactionType === 'Purchase');
    // return taxes.filter(m => (m.taxType.typeId === 1 || m.taxType.typeId === 10 || m.taxType.typeId === 2) && m.transactionType === 'Purchase') // valuable tax
}

export default (container, options) => {
    // Use local data
    let ds = new kendo.data.DataSource({
        data: filterTaxExpense(store.default.state.taxes)
    })

    // Define dropdownlist
    let ddl = kendo.jQuery('<input name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoWidth: true,
                height: 400,
                filter:"startswith",
                dataTextField: "defaultTax",
                dataValueField: "id",
                optionLabel: "--- Select ---",
                dataSource: ds
            }).data("kendoDropDownList");
    
    // Use remote data
    if(store.default.state.taxes.length === 0){
        taxHandler.getAll()
        .then(res => {
            let remoteDS = new kendo.data.DataSource({
                data: filterTaxExpense(res)
            })

            ddl.setDataSource(remoteDS);
        });
    }

    return ddl;
}