export default class TransactionSession {
    constructor(data = {}) {
        this.id = data.id || ''
        this.sessionId = data.sessionId || ''
        this.receiptId = data.receiptId || ''
        this.invoiceId = data.invoiceId || ''
        this.amountTobePaid = data.amountTobePaid || 0
        this.paidAmount = data.paidAmount || 0
        this.user = data.user || {}
        this.issuedDate = data.issuedDate || ''
        this.printObj = data.printObj || {}
    }

    constuct(data) {
        this.constructor(data);
    }
}