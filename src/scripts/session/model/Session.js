export default class Session {
    constructor(data = {}) {
        this.id = data.id || ''
        this.startDate = data.startDate || ''
        this.endDate = data.endDate || ''
        this.user = data.user || {}
        this.lastNumber = data.lastNumber || 1
        this.number = data.number || ''
        this.openBalance = data.openBalance || []
        this.status = data.status || 1
        this.totalReceipt = data.totalReceipt || 0
        this.countNotes = data.countNotes || []
        this.adjustmentAccount = data.adjustmentAccount || {}
    }

    constuct(data) {
        this.constructor(data);
    }
}