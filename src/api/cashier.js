const cookier = require("@/cookier.js").cookie
cookier.init()
const store = require("@/institute.js")
const { instituteId } = store.default.state.cookies
const myUrl = require("@/url")
const baseUrl = myUrl.url
const url          = baseUrl + '/checkout/'

module.exports = {
    settingCreate                               : url + 'setting/institute/' + instituteId + '/create',
    sessionGet                                  : url + 'setting/institute/' + instituteId + '/get',
}