/* Cookie */
const cookieJS = require("@/cookie.js");
const { instituteId } = cookieJS.getCookie();

const myUrl = require("@/url")
const baseUrl = myUrl.url
const url          = baseUrl + '/transaction/'

// const url          = 'https://dev-apis.banhji.com/transaction/'

module.exports = {
    transaction_post                               : url + 'transaction/institute/' + instituteId + '/add',
    transaction_delete                             : url + 'transaction/institute/' + instituteId + '/delete',
    transaction_get                                : url + 'transaction/institute/' + instituteId + '/list',
    transaction_history                            : url + 'transaction/institute/' + instituteId + '/history',
    transaction_search                             : url + 'transaction/institute/' + instituteId + '/search',
    transaction_filter                             : url + 'transaction/institute/' + instituteId + '/filter',
    txn_search                                     : url + 'transaction-search/institute/' + instituteId + '/filter',

    transaction_saleOrder_delete                   : url + 'sale-order/institute/' + instituteId + '/delete'
}