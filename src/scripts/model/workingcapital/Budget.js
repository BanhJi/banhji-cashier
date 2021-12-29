import kendo from "@progress/kendo-ui";
import UserModel from "@/scripts/model/User.js";

const store = require("@/institute.js");
const { instituteId } = store.default.state.cookies;

let model = kendo.data.Model.define({
    id: "uuid", // the identifier of the model
    fields: {
        "number"            : { type: "string" },
        "name"              : { type: "string" },
        "description"       : { type: "string" },
        "segment_uuid"      : { type: "string" },
        "fiscal_year"       : { type: "object" },
        "lines"             : { type: "object" },
        "institute_id"      : { type: "string", defaultValue: instituteId },
        "use_consolidation" : { type: "number", defaultValue: 0 },

        // Trackable Entity
        "created_by"        : { type: "object", defaultValue: new UserModel() },
        "created_date"      : { type: "date" },
        "modified_by"       : { type: "object", defaultValue: new UserModel() },
        "modified_date"     : { type: "date" },
    }
});

export default model;

/*
    // How To Use:
    import Person from "@/scripts/model/Person.js";

    var person = new Person({
        name: "John Doe",
        age: 42
    });

    // The result can be observed in the DevTools(F12) console of the browser.
    console.log(person.get("name")); // outputs "John Doe"

    // The available dataType options are:
    "string"
    "number"
    "boolean"
    "date"
    "object"
    (Default) "default"

    // More Information:
    https://docs.telerik.com/kendo-ui/api/javascript/data/model/methods/define
*/