export default class Production {
    constructor(data = {}) {
        this.item = data.item || ''
        this.description = data.description || ''
        this.buom = data.buom || {}
        this.qoh = data.qoh || 0
        this.qty = data.qty || 1
        this.cost = data.cost || 0
        this.amount = data.amount || 0
        this.decimalFormat = data.decimalFormat || 'n2'

    }

    constuct(data) {
        this.constructor(data);
    }
}
