const store = require("@/institute.js");
const { instituteId } = store.default.state.cookies;

export default class AccountType {
    constructor(data = {}) {
        this.uuid               = data.uuid || ''
        this.number             = data.number || 0
        this.code               = data.code || 0
        this.name               = data.name || ''
        this.local_name         = data.local_name || ''
        this.nature             = data.nature || ''
        this.nature_code        = data.nature_code || 0
        this.description        = data.description || ''
        this.statement_group    = data.statement_group || ''
        this.institute_id       = data.institute_id || instituteId
        this.is_in_used         = data.is_in_used || 0
        this.is_deteled         = data.is_deteled || 0
    }
    
    constuct(data) {
        this.constructor(data);
    }
}