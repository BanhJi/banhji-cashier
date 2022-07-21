const cookier = require("@/cookier.js").cookie
cookier.init()
const store = require("@/institute.js")
const { instituteId } = store.default.state.cookies
// const myUrl = require("@/url")
const baseUrl = 'https://sandbox.banhji.com'
const url          = baseUrl + '/session/'

module.exports = {
    sessionCreate                               : url + 'session/institute/' + instituteId + '/create',
    sessionGets                                 : url + 'session/institute/' + instituteId + '/list',
    sessionGet                                  : url + 'session/institute/' + instituteId + '/list/',
    lastNumber                                  : url + 'lastnumber/institute/' + instituteId + '/lastnumber',
    checkSession                                : url + 'session/institute/' + instituteId + '/check',
    byUser                                      : url + 'session/institute/' + instituteId + '/user',
    txnSession                                  : url + 'session/institute/' + instituteId + '/txn',
    cashierSetting                              : url + 'cashier/institute/' + instituteId + '/setting',
    collectionReport                            : url + 'session/institute/' + instituteId + '/collection',
    reconcileCreate                             : url + 'reconcile/institute/' + instituteId + '/create',
    sessionTxnReport                            : url + 'session/institute/' + instituteId + '/txnreport',
}