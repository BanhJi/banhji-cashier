const store = require("@/institute.js")
const {institute} = store.default.state
export default class SavingAccount {
    constructor(data = {}) {
        this.id = data.id || ''
        this.lastNumber = data.lastNumber || 1
        this.abbr = data.abbr || ''
        this.savingProduct = data.savingProduct || {}
        this.customer = data.customer || {}
        this.member = data.member || {}
        this.number = data.number || ''
        this.savingType = data.savingType || ''
        this.interestRatePerYear = data.interestRatePerYear || 0
        this.daysInYear = data.daysInYear || {}
        this.priceLevel = data.priceLevel || {}
        this.registeredDate = data.registeredDate ||new Date().toISOString().substr(0, 10)
        this.saveOption = data.saveOption || ''
        this.deleted = data.deleted || 0
        this.dateFormat = data.dateFormat || institute.dateFormat
    }

    constuct(data) {
        this.constructor(data);
    }
}