const store = require("@/institute")
const {institute} = store.default.state

export default class ApplyToLine {
    constructor(data = {}) {
        this.id                 = data.id || ''
        this.tick               = data.tick || false
        this.supplier           = data.supplier || {}
        this.paymentCode        = data.paymentCode || ''
        this.apAcc              = data.apAcc || {}
        this.referenceNo        = data.referenceNo || ''
        this.dueDate            = data.dueDate || new Date().toISOString().substr(0, 10)
        this.transactionDate    = data.transactionDate || new Date().toISOString().substr(0, 10)
        this.amount             = data.amount || 0
        this.paidAmount         = data.paidAmount || 0
        this.paidAmountTobase   = data.paidAmountTobase || 0
        this.amountTobePaid     = data.amountTobePaid || 0
        this.paymentOption      = data.paymentOption || {}
        this.bankReferenceNo    = data.bankReferenceNo || ''
        this.paymentTerm        = data.paymentTerm || {}
        this.discount           = data.discount || {}
        this.exchangeDiscount   = data.exchangeDiscount || 0
        this.exchangePenaltyTxn    = data.exchangePenaltyTxn || 0
        this.exchangeDiscountTxn    = data.exchangeDiscountTxn || 0
        this.paidAmountTxn      = data.paidAmountTxn || 0
        this.overDue            = data.overDue || 0
        this.deleted            = data.deleted || 0
        this.rate               = data.rate || 1
        this.rateTobase         = data.rateTobase || 1
        this.txnRate            = data.txnRate || 1
        this.currency           = data.currency || {}
        this.status             = data.status || 0
        this.type               = data.type || ''
        this.transactionType    = data.transactionType || {}
        this.dateFormat         = institute.dateFormat
        this.decimalFormat      = data.decimalFormat
    }

    constuct(data) {
        this.constructor(data);
    }
}