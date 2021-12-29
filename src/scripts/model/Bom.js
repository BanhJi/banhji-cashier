export default class Bom {
    constructor(data = {}) {
        this.id = data.id || ''
        this.number = data.number || ''
        this.referenceNo = data.referenceNo || ''
        this.abbr = data.abbr || ''
        this.materialType = data.materialType || {}
        this.structure = data.structure || ''
        this.transactionDate = data.transactionDate || ''
        this.sequcencing = data.sequcencing || ''
        this.typeBom = data.typeBom || {}
        this.type = data.type || 'Bill Of Material'
        this.transactionType = data.transactionType || {}
        this.lastNumber = data.lastNumber || ''
        this.warehouse = data.warehouse || {}
        this.finishProduct = data.finishProduct || [{
            item: {},
            description: '',
            buom: {},
            uom: {},
            qoh: 0,
            yieldQty: 0,
            cost: 0,
            amount: 0,
            decimalFormat: ''
        }]
        this.otherFinishProduct = data.otherFinishProduct || [{
            item: {},
            description: '',
            buom: {},
            uom: {},
            qoh: 0,
            yieldQty: 0,
            cost: 0,
            amount: 0,
            decimalFormat: ''
        }]
        this.componentUsed = data.componentUsed || [{
            item: {},
            description: '',
            buom: {},
            uom: {},
            qoh: 0,
            qty: 0,
            cost: 0,
            amount: 0,
            decimalFormat: ''
        }]
        this.otherCost = data.otherCost || [{
            account: {},
            description: '',
            amount: 0,
            tax: {}
        }]
        this.amount = data.amount || 0
        this.exchangeAmount = data.exchangeAmount || 0
        this.variance = data.variance || 0
        this.transactionNote = data.transactionNote || ''
        this.status = data.status || ''
        this.currency = data.currency || {}
        this.exchangeRate = data.exchangeRate || {}
        this.txnRate = data.txnRate || {}
    }

    constuct(data) {
        this.constructor(data);
    }
}
