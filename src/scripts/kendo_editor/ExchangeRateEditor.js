import kendo from '@progress/kendo-ui';

const { exchangeRateHandler } = require("@/scripts/AppHandlers");

export default (container, options) => {
    // Use local data
    let ds = new kendo.data.DataSource({
        data: []
    })

    // Definde dropdownlist
    let ddl = kendo.jQuery('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoWidth: true,
                height: 400,
                filter:"startswith",
                dataTextField: "code",
                dataValueField: "sk",
                optionLabel: "--- Select ---",
                dataSource: ds
            }).data("kendoDropDownList");
    
    // Use remote data
    
        exchangeRateHandler.getAll()
        .then(res => {
            let remoteDS = new kendo.data.DataSource({
                data: res.data.data
            })

            ddl.setDataSource(remoteDS);
        });

    return ddl;
}