export default class UOMConversion {
    constructor(data = {}) {
        this.id = data.id || ''
        this.variantId = data.variantId || ''
        this.fromUOM = data.fromUOM || {}
        this.toUOM = data.toUOM || {}
        this.rate = data.rate || 1
        this.conversionRate = data.conversionRate || 1
    }

    constuct(data) {
        this.constructor(data);
    }
}