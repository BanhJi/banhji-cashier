import kendo from '@progress/kendo-ui';
import store from '@/store';

const apiUrl = require('@/apiUrl.js');
const AccountTypeCode = require("@/scripts/default_setup/AccountTypeCode");

function filterCashAccount(accounts) {
    return accounts.filter(item => ~AccountTypeCode.CASH_ACCOUNTS.indexOf(item.account_type.number));
}

export default (container, options) => {
    // Defind ordering by number
    let compare = function(a, b) {
        if (a.items[0].number === b.items[0].number) {
            return 0;
        } else if (a.items[0].number > b.items[0].number) {
            return 1;
        } else {
            return -1;
        }
    };

    // Defind default group
    let group = { 
        field: "account_type.name",
        compare: compare
    };

    // Use local data
    let ds = new kendo.data.DataSource({
        data: filterCashAccount(store.state.accounting.accounts),
        group: group,
    })

    // Definde dropdownlist
    let ddl = kendo.jQuery('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                autoWidth: true,
                height: 400,
                filter:"startswith",
                dataTextField: "name",
                dataValueField: "uuid",
                optionLabel: "--- Select ---",
                dataSource: ds
            }).data("kendoDropDownList");

    // Use remote data
    if(!store.state.accounting.accountLoaded){
        let remoteDS = new kendo.data.DataSource({
            transport: {
                read: {
                    url: apiUrl.accounts,
                },
                dataType: "json",
            },
            schema: {
                model: {
                    id: "uuid"
                },
                data: function (response) {
                    /* Add to store */
                    store.dispatch('accounting/putAccounts', response);
                    
                    return filterCashAccount(response);
                },
            },
            group: group
        })

        ddl.setDataSource(remoteDS);
    }

    return ddl;
}