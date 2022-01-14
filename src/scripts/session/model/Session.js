export default class Session {
    constructor(data = {}) {
        this.id = data.id || ''
        this.startDate = data.startDate || ''
        this.endDate = data.endDate || ''
        this.user = data.user || {}
        this.lastNumber = data.lastNumber || 1
    }

    constuct(data) {
        this.constructor(data);
    }
}