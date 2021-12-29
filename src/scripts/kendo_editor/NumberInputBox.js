import kendo from "@progress/kendo-ui";

export default (container, options) => {
    return kendo.jQuery('<input name="' + options.field + '" />')
            .appendTo(container)
            .kendoNumericTextBox({
                format: "c",
                decimals: 5,
                restrictDecimals: true,
                round: false,
                min: 0,
                step: 1
            });
}