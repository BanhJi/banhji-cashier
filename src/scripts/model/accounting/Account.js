import kendo from "@progress/kendo-ui";
import AccountGroupModel from "@/scripts/model/AccountGroup.js";
import AccountTypeModel from "@/scripts/model/AccountType.js";
import UserModel from "@/scripts/model/User.js";

const store = require("@/institute.js");
const { instituteId } = store.default.state.cookies;

let model = kendo.data.Model.define({
    id: "uuid", // the identifier of the model
    fields: {
        "type_code": { type: "string" },
        "group_code": { type: "string" },
        "banhji_account_number": { type: "string" },
        "number": { type: "string" },
        "name": { type: "string" },
        "local_name": { type: "string" },
        "description": { type: "string" },
        "balance_as_of": { type: "number" },
        "is_taxable": { type: "number" },
        "status": { type: "string" },
        "institute": { type: "string", defaultValue: instituteId },
        "is_deleted": { type: "number" },

        "account_type": { type: "object",  defaultValue: new AccountTypeModel() },
        "account_group": { type: "object",  defaultValue: new AccountGroupModel() },
        "parent_account": { type: "object" },
        "bank_account": { type: "object" },

        "created_by": { type: "object",  defaultValue: new UserModel() },
        "created_date": { type: "date" },
        "modified_by": { type: "object",  defaultValue: new UserModel() },
        "modified_date": { type: "date" },
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