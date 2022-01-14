/* Cookie */
const cookieJS = require("@/cookie.js");
const { instituteId } = cookieJS.getCookie();

const myUrl = require("@/url")
const baseUrl = myUrl.url
const url          = baseUrl + '/entity-members/'

// const url          = 'https://dev-apis.banhji.com/entity-members/'

module.exports = {
    member_post                               : url + 'member/institute/' + instituteId + '/add',
    member_get                                : url + 'member/institute/' + instituteId + '/list',
    member_getOne                             : url + 'member/institute/' + instituteId + '/list/',
    member_search                             : url + 'member/institute/' + instituteId + '/search',
    saving_account_post                       : url + 'savingaccount/institute/' + instituteId + '/add',
    saving_account_getOne                     : url + 'savingaccount/institute/' + instituteId + '/list/',
    saving_account_getByMember                : url + 'savingaccount/institute/' + instituteId + '/member/',
    saving_deposit_post                       : url + 'savingdeposit/institute/' + instituteId + '/add',
    saving_deposit_getByAccount               : url + 'savingdeposit/institute/' + instituteId + '/account/',
    saving_withdraw_post                      : url + 'savingwithdraw/institute/' + instituteId + '/add',
    lastnumber                                : url + 'lastnumber/institute/' + instituteId + '/add',
}