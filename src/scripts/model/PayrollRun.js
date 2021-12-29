const store = require("@/institute.js")
const {institute} = store.default.state
export default class PayrollRun {
    constructor(data = {}) {
        this.id                     = data.id || ''
        this.timeFormat             = 'hh:mm:ss tt' 
        this.monthOf                = data.monthOf || ''
        this.number                 = data.number   || ''
        this.payNumber              = data.payNumber || {}
        this.abbr                   = data.abbr || ''
        this.lastNumber             = data.lastNumber || 0
        this.referenceNumber        = data.referenceNumber || ''
        this.type                   = data.type || ''
        this.location               = data.location || {}
        this.currency               = data.currency || {}
        this.exchangeRate           = data.exchangeRate || {}
        this.totalEmployee          = data.totalEmployee || 0
        this.totalGross             = data.totalGross || 0
        this.totalBenefits          = data.totalBenefits || 0
        this.totalTaxBenefit        = data.totalTaxBenefit || 0
        this.status                 = data.status || 0
        this.payrollList            = data.payrollList || []
        this.step                   = data.step || 0
        this.totaleTax              = data.totaleTax || 0
        this.totalNetPay            = data.totalNetPay || 0
        this.totalNetSalary         = data.totalNetSalary || 0
        this.totalDeduction         = data.totalDeduction || 0
        this.totalTaxPaymentUS      = data.totalTaxPaymentUS || 0
        this.totalTaxPaymentKHM     = data.totalTaxPaymentKHM || 0
        this.final                  = data.final || ''
        this.payDate                = data.payDate || ''
        this.created                = data.created || ''
        this.adjustment             = data.adjustment || []
        this.dateFormat             = data.dateFormat || institute.dateFormat
        this.payrollLiabilitieName  = data.payrollLiabilitieName || ''
        this.payrollLiabilitieNumber= data.payrollLiabilitieNumber || ''
        this.payrollLiabilitieUuid  = data.payrollLiabilitieUuid || ''
    }
    constuct(data) {
        this.constructor(data);
    }
}