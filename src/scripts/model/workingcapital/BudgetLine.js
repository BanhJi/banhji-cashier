import kendo from "@progress/kendo-ui";
import CurrencyModel from "@/scripts/model/Currency.js";
import UserModel from "@/scripts/model/User.js";

let model = kendo.data.Model.define({
    id: "uuid", // the identifier of the model
    fields: {
        "account_uuid"          : { type: "string" },
        "currency"              : { type: "object",  defaultValue: new CurrencyModel() },
        "exchange_rate_uuid"    : { type: "string" },
        "exchange_rate"         : { type: "number" },
        "exchanged_amount"      : { type: "number" },
        "note"                  : { type: "string" },
        "monthly_amount"        : { type: "object" }, // [ month_of, amount ]

        // Trackable Entity
        "created_by"            : { type: "object",  defaultValue: new UserModel() },
        "created_date"          : { type: "date" },
        "modified_by"           : { type: "object",  defaultValue: new UserModel() },
        "modified_date"         : { type: "date" },
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