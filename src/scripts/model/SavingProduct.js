const store = require("@/institute.js")
const {institute} = store.default.state
export default class SavingProduct {
    constructor(data = {}) {
        this.id = data.id || ''
        this.name = data.name || ''
        this.savingType = data.savingType || {}
        this.interestRatePerYear = data.interestRatePerYear || 0
        this.daysInYear = data.daysInYear || {}
        this.priceLevel = data.priceLevel || {}
        this.Account = data.Account || {}
        this.interestExpenseAccount = data.interestExpenseAccount || {}
        this.savingMethod = data.savingMethod || {}
        this.saveOption = data.saveOption || ''
        this.dateFormat = data.dateFormat || institute.dateFormat
    }

    constuct(data) {
        this.constructor(data);
    }
}