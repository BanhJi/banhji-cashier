export default class Customer {
    constructor(data = {}) {
        this.id = data.id || ''
        this.type = data.type || {}
        this.crn = data.crn || ''
        this.customerType = data.customerType || {}
        this.number = data.number || ''
        this.subOfCustomer = data.subOfCustomer || {}
        this.billingType = data.billingType || {}
        this.name = data.name || ''
        this.registeredDate = data.registeredDate || new Date().toISOString().substr(0, 10)
        this.alternativeName = data.alternativeName || ''
        this.consumerId = data.consumerId || ''
        this.contactAddress = data.contactAddress || {
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
        this.paymentBilling = data.paymentBilling || {
            customerGroup: {},
            paymentTerm: {},
            priceLevel: {},
            paymentMethod: {},
            assignTo: {},
            warehouse: {},
            discountItem: {},
            creditLimit: 0
        }
        this.accountTax = data.accountTax || {
            receivableAcc: {},
            saleDepositAcc: {},
            saleDiscountAcc: {},
            defaultTax: {}
        }
        this.noteOnInvoice = data.noteOnInvoice || ''
        this.image = data.image || {}
        this.attachFile = data.attachFile || {}
        this.contactPerson = data.contactPerson || []
    }

    constuct(data) {
        this.constructor(data);
    }
}