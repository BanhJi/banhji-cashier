/* Cookie */
const cookieJS = require("@/cookie.js");
const { instituteId } = cookieJS.getCookie();

const myUrl = require("@/url")
const baseUrl = myUrl.url
const url          = baseUrl + '/loan-settings/'
// const url          = 'https://dev-apis.banhji.com/loan-settings/'

module.exports = {
    purpose_post                                : url + 'loanpurpose/institute/' + instituteId + '/add',
    purpose_get                                 : url + 'loanpurpose/institute/' + instituteId + '/list',
    product_post                                : url + 'loanproduct/institute/' + instituteId + '/add',
    product_get                                 : url + 'loanproduct/institute/' + instituteId + '/list',
    saving_post                                : url + 'savingproduct/institute/' + instituteId + '/add',
    saving_get                                 : url + 'savingproduct/institute/' + instituteId + '/list',
    member_type_post                                : url + 'membertype/institute/' + instituteId + '/add',
    member_type_get                                 : url + 'membertype/institute/' + instituteId + '/list',
}