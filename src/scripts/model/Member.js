export default class Member {
    constructor(data = {}) {
        this.id                     = data.id || ''
        this.abbr                   = data.abbr || ''
        this.number                 = data.number || ''
        this.firstName              = data.firstName || ''
        this.lastName               = data.lastName || ''
        this.memberType             = data.memberType || {}
        this.registeredDate         = data.registeredDate || new Date().toISOString().substr(0, 10)
        this.customer               = data.customer || {}
        this.vendor                 = data.vendor || {}
        this.gender                 = data.gender || {}
        this.familyStatus           = data.familyStatus || {}
        this.familyMember           = data.familyMember || 0
        this.phoneNumber            = data.phoneNumber || ''
        this.idNumber               = data.idNumber || ''
        this.dob                    = data.dob || new Date().toISOString().substr(0, 10)
        this.addresses              = data.addresses || []
        this.priceLevel             = data.priceLevel || {}
        this.defaultDiscount        = data.defaultDiscount || {}
        this.paymentTerm            = data.paymentTerm || {}
        this.paymentMethod          = data.paymentMethod || {}
        this.accountReceivable      = data.accountReceivable || {}
        this.accountDeposit         = data.contactAddress || {
            gender: {},
            phoneNumber: '',
            email: '',
            dob: new Date().toISOString().substr(0, 10),
            address: [],
            latitude: '',
            longitude: '',
            website: '',
            description: ''
        }
        this.accountDiscount        = data.accountDiscount || {}
        this.defaultTax             = data.defaultTax || {}
        this.note                   = data.note || ''
        this.attachFile             = data.attachFile || {}
    }

    constuct(data) {
        this.constructor(data);
    }
}