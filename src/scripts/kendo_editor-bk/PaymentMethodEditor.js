import kendo from '@progress/kendo-ui';

// const $ = require("jquery");
const store = require("@/institute.js");
const {paymentOptionHandler} = require("@/scripts/AppHandlers");

export default (container, options) => {
    // Use local data
    let ds = new kendo.data.DataSource({
        data: store.default.state.paymentOptions
    })
    const strFilter = options.model.payment_method_as || ''
    window.console.log(strFilter)
    // Define dropdownlist
    let ddl = kendo.jQuery('<input name="' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoWidth: true,
            height: 400,
            filter: "startswith",
            dataTextField: "name",
            dataValueField: "id",
            optionLabel: "--- Select ---",
            dataSource: ds
        }).data("kendoDropDownList");

    // Use remote data
    if (store.default.state.paymentOptions.length === 0) {
        paymentOptionHandler.list(strFilter)
            .then(res => {
                if (res.data.statusCode === 200) {
                    let remoteDS = new kendo.data.DataSource({
                        data: res.data.data
                    })

                    ddl.setDataSource(remoteDS);
                }
            });
    }

    return ddl;
}