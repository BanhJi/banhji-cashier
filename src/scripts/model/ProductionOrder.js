export default class ProductionOrder {
    constructor(data = {}) {
        if (!data) {
            this.id = data.id || ''
            this.number = data.number || ''
            this.account = data.account || {}
            this.abbr = data.abbr || ''
            this.type = data.type || 'Production Order'
            this.structure = data.structure || ''
            this.transactionDate = data.transactionDate || ''
            this.startedAt = data.startedAt || ''
            this.completedAt = data.completedAt || ''
            this.sequcencing = data.sequcencing || ''
            this.lastNumber = data.lastNumber || ''
            this.amount = data.amount || 0
            this.exchangeAmount = data.exchangeAmount || 0
            this.variance = data.variance || 0
            this.otherFinishProduct = data.otherFinishProduct || []
            this.finishProduct = data.finishProduct || []
            this.componentUsed = data.componentUsed || []
            this.otherCost = data.otherCost || []
            this.transactionType = data.transactionType || {}
            this.product = data.product || {}
            this.qty = data.qty || 1
            this.yieldUOM = data.yieldUOM || ''
            this.bom = data.bom || {}
            this.txnRate = data.txnRate || 1
            this.currency = data.currency || {}
            this.exchangeRate = data.exchangeRate || {}
            this.dueDate = data.dueDate || new Date().toISOString().substr(0, 10)
            this.monthOf = data.monthOf || new Date().toISOString().substr(0, 10)
            this.segment = data.segment || {}
            this.location = data.location || {}
            this.project = data.project || {}
            this.status = data.status || 1
            this.transactionNote = data.transactionNote || ''
            this.journalNote = data.journalNote || ''
            this.warehouse = data.warehouse || {}
            this.jRaw = data.jRaw || {}
            this.actionType = data.actionType || ''
        }
    }
}
