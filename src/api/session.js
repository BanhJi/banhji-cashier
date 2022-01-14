const cookier = require("@/cookier.js").cookie
cookier.init()
const store = require("@/institute.js")
const { instituteId } = store.default.state.cookies
const myUrl = require("@/url")
const baseUrl = myUrl.url
const url          = baseUrl + '/session/'

module.exports = {
    sessionCreate                               : url + 'session/institute/' + instituteId + '/add',
    sessionGets                                 : url + 'session/institute/' + instituteId + '/list',
    sessionGet                                  : url + 'session/institute/' + instituteId + '/list/',
}