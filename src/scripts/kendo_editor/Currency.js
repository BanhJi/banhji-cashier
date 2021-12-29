import kendo from '@progress/kendo-ui';

import store from '@/store';

const apiUrl = require('@/apiUrl.js');

export default (container, options) => {
    // Use local data
    let ds = new kendo.data.DataSource({
        data: store.state.currencies.list,
    })

    // Definde dropdownlist
    let ddl = kendo.jQuery('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoWidth: true,
                height: 400,
                filter:"startswith",
                dataTextField: "name",
                dataValueField: "code",
                template: "<span>#=code# - #=name#</span>",
                optionLabel: "--- Select ---",
                dataSource: ds
            }).data("kendoDropDownList");
    
    // Use remote data
    if(!store.state.currencies.isLoaded){
        let remoteDS = new kendo.data.DataSource({
            transport: {
                read: {
                    url: apiUrl.currency.currency_get + 'fun-c',
                },
                dataType: "json",
            },
            schema: {
                model: {
                    id: "id"
                },
                data: (response) => {
                    /* Add to store */
                    store.dispatch('currencies/addList', response.data);
                    
                    return response.data;
                },
            },
        })

        ddl.setDataSource(remoteDS);
    }

    return ddl;
}