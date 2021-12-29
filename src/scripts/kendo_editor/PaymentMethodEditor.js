import kendo from '@progress/kendo-ui';

const {paymentOptionHandler} = require("@/scripts/AppHandlers");

export default (container, options) => {
    // Use local data
    let ds = new kendo.data.DataSource({
        data: []
    })
    const strFilter = options.model.payment_method_as || ''
    
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
    
        paymentOptionHandler.list(strFilter)
            .then(res => {
                if (res.data.statusCode === 200) {
                    let remoteDS = new kendo.data.DataSource({
                        data: res.data.data
                    })

                    ddl.setDataSource(remoteDS);
                }
            });
    

    return ddl;
}