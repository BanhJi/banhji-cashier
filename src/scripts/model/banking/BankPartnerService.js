export default class BankPartnerService {
    constructor(data = {}) {
        this.id = data.id || ''
        this.name = data.name || ''
        this.type = data.type || ''
        this.image = data.image || ''
        this.bankNumber = data.bankNumber || ''
    }
    
    constuct(data) {
        this.constructor(data);
    }
}