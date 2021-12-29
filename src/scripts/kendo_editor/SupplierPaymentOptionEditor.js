import kendo from '@progress/kendo-ui';
import store from '@/store';
const apiUrl = require('@/api/setting');

export default (container, options) => {
    // Define ordering by code
    let compare = function(a, b) {
        if (a.items[0].code === b.items[0].code) {
            return 0;
        } else if (a.items[0].code > b.items[0].code) {
            return 1;
        } else {
            return -1;
        }
    };
    
    // Define default group
    let group = {
        field: "type",
        compare: compare
    };

    // Use local data
    let ds = new kendo.data.DataSource({
        data: store.state.paymentOptions.list.filter(i => i.optionType.toLowerCase() === "supplier"),
        group: group,
    })
    
    // Define Dropdownlist
    let ddl = kendo.jQuery('<input required name="' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            autoWidth: true,
            height: 400,
            filter: "startswith",
            dataTextField: "name",
            dataValueField: "id",
            optionLabel: "--- Select ---",
            dataSource: ds
        }).data("kendoDropDownList");

    // Use remote data
    if(!store.state.paymentOptions.list.isLoaded){
        let remoteDS = new kendo.data.DataSource({
            transport: {
                read: {
                    url: apiUrl.payment_option_get,
                },
                dataType: "json",
            },
            schema: {
                model: {
                    id: "id"
                },
                data: (response) => {
                    /* Add to store */
                    store.dispatch('paymentOptions/addList', response.data);

                    return response.data.filter(i => i.optionType.toLowerCase() === "supplier");
                },
            },
            group: group
        })

        ddl.setDataSource(remoteDS);
    }

    return ddl;
}