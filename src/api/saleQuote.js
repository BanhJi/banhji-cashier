/* Cookie */
const cookieJS = require("@/cookie.js");
const { instituteId } = cookieJS.getCookie();

const myUrl = require("@/url")
const baseUrl = myUrl.url
const url          = baseUrl + '/sale-quote/'
// const url          = 'https://gddzkiu7m0.execute-api.ap-southeast-1.amazonaws.com/dev/v1/sale-quote/'

module.exports = {
    sale_quote_post                               : url + 'quote/institute/' + instituteId + '/add',
    sale_quote_get                                : url + 'quote/institute/' + instituteId + '/list',
    sale_quote_history                            : url + 'quote/institute/' + instituteId + '/history',
}