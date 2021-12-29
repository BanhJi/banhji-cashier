export default class EmploymentRecord {
    constructor(data = {}) {
        this.id             = data.id || ''
        this.date           = data.date || ''
        this.employee       = data.employee || {}
        this.location       = data.location || {}
        this.natureContract = data.natureContract || {}
        this.position       = data.position || {}
        this.salaryType     = data.salaryType || {}
        this.natureSalary   = data.natureSalary || {}
        this.currency       = data.currency || {}
        this.benefit        = data.benefit || []
        this.segment        = data.segment || []
        this.applyOvertime  = data.applyOvertime || ''
    }
    constuct(data) {
        this.constructor(data);
    }
}