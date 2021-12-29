export default class FinishProduct {
    constructor(data = {}) {
        this.id = data.id || ''
        this.item = data.item || {}
        this.description = data.description || ''
        this.buom = data.buom || {}
        this.uom = data.uom || {}
        this.qoh = data.qoh || 0
        this.qty = data.yieldQty || 0
        this.cost = data.cost || 0
        this.amount = data.amount || 0
        this.decimalFormat = data.decimalFormat || 'n2'
    }

    constuct(data) {
        this.constructor(data);
    }
}