import BankAccountModel from "@/scripts/model/BankAccount.js";

export default class ConnectBankPartnerService {
    constructor(data = {}) {
        this.id = data.id || ''
        this.instituteName = data.instituteName || ''
        this.nature = data.nature || ''
        this.merchant = data.merchant || { id:'', apiUrl:'', apiKey:'' }
        this.coa = data.coa || new BankAccountModel()
        this.fi = data.fi || ''
        this.serviceType = data.serviceType || ''
        this.image = data.image || ''
    }
    
    constuct(data) {
        this.constructor(data);
    }
}