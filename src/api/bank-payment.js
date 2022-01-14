/* Cookie */
const cookieJS = require("@/cookie.js");
const { instituteId } = cookieJS.getCookie();

const myUrl = require("@/url")
const baseUrl = myUrl.url
const url          = baseUrl + '/partner-service/v1/'

module.exports = {
    bank_connected_get                                : url + 'institutes/' + instituteId + '/banks',
}