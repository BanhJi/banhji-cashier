export default class Setting {
    constructor(data = {}) {
        this.id = data.id || ''
        this.startDate = data.startDate || ''
        this.lastRefNum = data.lastRefNum || 1
        this.searchOption = data.searchOption || ''
        this.paymentOption = data.paymentOption || {}
        this.msgJournal = data.msgJournal || ''
    }

    constuct(data) {
        this.constructor(data);
    }
}