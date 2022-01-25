import { AccountModel, UserModel } from "@/scripts/model/AppModels";
export default class Reconcile {
    constructor(data = {}) {
        this.id = data.id || ''
        this.number = data.number || ''
        this.lastNumber = data.lastNumber || 1
        this.issuedDate = data.issuedDate || new Date().toISOString().substr(0, 10)
        this.endingBalanceDate = data.endingBalanceDate || null
        this.actualAmount = data.actualAmount || 0
        this.endingBalance = data.endingBalance || 0
        this.varianceAmount = data.varianceAmount || 0
        this.account = data.account || new AccountModel()
        this.adjustmentAccount = data.adjustmentAccount || new AccountModel()
        this.session = data.session || {}
        this.user = data.user || {}
        this.type = data.type || ''
        this.reconcileEntries = data.reconcileEntries || []
        this.is_draft = data.is_draft || 0
        this.created_by = data.created_by || new UserModel()
        this.modified_by = data.modified_by || new UserModel()
        this.journalId = data.journalId || ''
        this.countNotes = data.countNotes || []
    }

    constuct(data) {
        this.constructor(data);
    }
}