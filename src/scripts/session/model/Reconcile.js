export default class Reconcile {
    constructor(data = {}) {
        this.id = data.id || ''
        this.number = data.number || ''
        this.lastNumber = data.lastNumber || 1
        this.issuedDate = data.issuedDate || ''
        this.endDate = data.endDate || ''
        this.currentBalance = data.currentBalance || 0
        this.endingBalance = data.endingBalance || 0
        this.variance = data.variance || 0
        this.account = data.account || {}
        this.notes = data.notes || []
        this.user = this.user || {}
    }

    constuct(data) {
        this.constructor(data);
    }
}