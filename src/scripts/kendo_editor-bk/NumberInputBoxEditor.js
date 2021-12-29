// const $ = require("jquery");
import kendo from "@progress/kendo-ui";
export default (container, options) => {
    return kendo.jQuery('<input name="' + options.field + '" type="number" class="k-textbox" />')
            .appendTo(container)
}