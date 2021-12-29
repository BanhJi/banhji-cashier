export default class UOMPrice {
    constructor(data = {}) {
        this.id = data.id || ''
        this.variantId = data.variantId || ''
        this.uom = data.uom || {}
        this.price = data.price || '0'
        this.priceLevel = data.priceLevel || {}
        this.priceType = data.priceType || 'Standard'
        this.appliedDate = data.appliedDate || new Date().toISOString().substr(0, 10)
    }

    constuct(data) {
        this.constructor(data);
    }
}