const productOrder = require("./ProductionOrder")
const bom          = require("./Bom")
export default class Production {
  constructor(data = {}) {
    if (!data) {
      this.id                           = data.id || ''
      this.uuid                         = data.uuid || ''
      this.type                         = data.type || ''
      this.journal_uuid                 = data.journal_uuid || ''
      this.number                       = data.number || ''
      this.abbr                         = data.abbr || 'PD'
      this.structure                    = data.structure || ''
      this.transactionDate              = data.transactionDate || ''
      this.sequcencing                  = data.sequcencing || ''
      this.lastNumber                   = data.lastNumber || ''
      this.amount                       = data.totalCost || 0
      this.exchangeAmount               = data.exchangeAmount || 0
      this.wipAmount                    = data.wipAmount || 0
      this.variance                     = data.variance || 0
      this.transactionType              = data.transactionType || {}
      this.productionOrder              = data.productionOrder || new productOrder({})
      this.qty                          = data.qty || ''
      this.product                      = data.product || {}
      this.uom                          = data.uom || {}
      this.transactionNote              = data.transactionNote || ''
      this.bom                          = data.bom || new bom({})
      this.jRaw                         = data.jRaw || {}
      this.txnRate                      = data.txnRate || 1
      this.currency                     = data.currency || {}
      this.segment                      = data.segment || {}
      this.location                     = data.location || {}
      this.project                      = data.project || {}
      this.exchangeRate                 = data.exchangeRate || {}
      this.startedAt                    = data.startAt || new Date().toISOString().substr(0, 10)
      this.completedAt                  = data.completeAt || ''
      this.status                       = data.status || {}
      this.loggedUser                   = data.loggedUser || {}
    }
  }
  constuct(data) {
    this.constructor(data);
  }
}
