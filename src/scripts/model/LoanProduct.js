const store = require("@/institute.js")
const {institute} = store.default.state
export default class LoanProduct {
    constructor(data = {}) {
        this.id = data.id || ''
        this.name = data.name || ''
        this.loanLevel = data.loanLevel || {}
        this.interestRatePerMonth = data.interestRatePerMonth || 0
        this.daysInYear = data.daysInYear || 0
        this.priceLevel = data.priceLevel || {}
        this.loanAccount = data.loanAccount || {}
        this.interestRevenueAccount = data.interestRevenueAccount || {}
        this.loanMethod = data.loanMethod || {}
        this.purpose = data.purpose || {}
        this.dueOneMonth = data.dueOneMonth || 0
        this.dueTwoMonth = data.dueTwoMonth || 0
        this.dueThreeMonth = data.dueThreeMonth || 0
        this.saveOption = data.saveOption || ''
        this.dateFormat = data.dateFormat || institute.dateFormat
        this.usedDateAt = data.usedDateAt || new Date().toISOString().substr(0, 10)
        this.deletedAt = data.deletedAt || new Date().toISOString().substr(0, 10)
        this.deleted = data.deleted || 0
        this.createdAt = data.createdAt || new Date().toISOString().substr(0, 10)
    }

    constuct(data) {
        this.constructor(data);
    }
}