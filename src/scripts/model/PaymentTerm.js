import { AccountModel } from "@/scripts/model/AppModels";

export default class PaymentTerm {
    constructor(data = {}) {
        this.id                 = data.id || ''
        this.name               = data.name || ''
        this.type               = data.type || ''
        this.netDue             = data.netDue || 0
        this.discountPeriod     = data.discountPeriod || 0
        this.discountPercentage = data.discountPercentage || 0
        this.account            = data.account || new AccountModel()

        // Map with B Kethya's fields
        if(data.uuid){
            this.id = data.uuid;
        }else if(data.id){
            this.uuid = data.id;
        }
    }
    
    constuct(data) {
        this.constructor(data)
    }
}