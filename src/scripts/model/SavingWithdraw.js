const store = require("@/institute.js")
const {institute} = store.default.state
export default class SavingWithdraw {
    constructor(data = {}) {
        this.id = data.id || ''
        this.lastNumber = data.lastNumber || 1
        this.abbr = data.abbr || ''
        this.savingAccount = data.savingAccount || {}
        this.customer = data.customer || {}
        this.member = data.member || {}
        this.number = data.number || ''
        this.amount = data.amount || 0
        this.referenceNumber = data.referenceNumber || ''
        this.cashAccount = data.cashAccount || {}
        this.note = data.note || ''
        this.issuedDate = data.issuedDate ||new Date().toISOString().substr(0, 10)
        this.saveOption = data.saveOption || ''
        this.deleted = data.deleted || 0
        this.dateFormat = data.dateFormat || institute.dateFormat
    }

    constuct(data) {
        this.constructor(data);
    }
}