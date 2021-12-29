import kendo from "@progress/kendo-ui";

export default (container, options) => {
    return kendo.jQuery('<input name="' + options.field + '" />')
            .appendTo(container)
            .kendoDatePicker({
                format: "dd-MM-yyyy",
                parseFormats: ["dd-MM-yyyy"]
            });
}