const store = require("@/institute.js");
const { instituteId } = store.default.state.cookies;

export default class FiscalDate {
    constructor(data = {}) {
        this.uuid               = data.uuid || ''
        this.start_date         = data.start_date || new Date().getFullYear() + '-01-01'
        this.end_date           = data.end_date || new Date().getFullYear() + '-12-31'
        this.first_fiscal_year  = data.first_fiscal_year || new Date().getFullYear() + '-01-01'
        this.institute          = data.institute || instituteId
    }
    
    constuct(data) {
        this.constructor(data);
    }
}