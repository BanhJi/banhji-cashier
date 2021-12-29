import AccountGroupModel from "@/scripts/model/AccountGroup.js";
import AccountTypeModel from "@/scripts/model/AccountType.js";
import UserModel from "@/scripts/model/User.js";
const store = require("@/institute.js");
const { instituteId } = store.default.state.cookies;

export default class Account {
    constructor(data = {}) {
        this.uuid               = data.uuid || ''
        this.type_code          = data.type_code || 0
        this.group_code         = data.group_code || 0
        this.banhji_account_number = data.banhji_account_number || ''
        this.number             = data.number || ''
        this.name               = data.name || ''
        this.local_name         = data.local_name || ''
        this.description        = data.description || ''
        this.balance_as_of      = data.balance_as_of || 0
        this.institute          = data.institute || instituteId // uuid
        this.account_type       = new AccountTypeModel(data.account_type)
        this.account_group      = new AccountGroupModel(data.account_group)
        this.parent_account     = data.parent_account || {}
        this.bank_account       = data.bank_account || {}
        this.status             = data.status || 1
        this.is_taxable         = data.is_taxable || 0
        this.is_in_used         = data.is_in_used || 0
        this.is_deleted         = data.is_deleted || 0

        // Trackable Entity
        this.created_by                 = data.created_by || new UserModel();
        this.modified_by                = data.modified_by || new UserModel();
        this.created_date               = data.created_date || null;
        this.modified_date              = data.modified_date || null;
    }
    
    constuct(data) {
        this.constructor(data);
    }
}