export default class Setting {
    constructor(data = {}) {
        this.id = data.id || ''
        this.startDate = data.startDate || ''
        this.lastRefNum = data.lastRefNum || 1
        this.searchOption = data.searchOption || ''
        this.paymentOption = data.paymentOption || {}
        this.msgJournal = data.msgJournal || ''
        this.user = data.user || {}
        this.segment = data.segment || ''
    }

    constuct(data) {
        this.constructor(data);
    }
}