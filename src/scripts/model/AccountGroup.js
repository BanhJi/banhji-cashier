import { UserModel } from "@/scripts/model/AppModels";

const store = require("@/institute.js");
const { instituteId } = store.default.state.cookies;

export default class AccountGroup {
    constructor(data = {}) {
        this.uuid               = data.uuid || ''
        this.code               = data.code || 0
        this.type_code          = data.type_code || 0
        this.name               = data.name || ''
        this.local_name         = data.local_name || ''
        this.description        = data.description || ''
        this.institute_id       = data.institute_id || instituteId
        this.accounts           = data.accounts || []
        this.account_type       = data.account_type || {}

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