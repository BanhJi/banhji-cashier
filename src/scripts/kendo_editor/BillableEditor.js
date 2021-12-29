// const $ = require("jquery");
import kendo from "@progress/kendo-ui";
export default (container, options) => {
    return kendo.jQuery('<input class="k-checkbox" type="checkbox" data-type="boolean" data-bind="checked:billable" name="' + options.field + '"/>')
            .appendTo(container)
}