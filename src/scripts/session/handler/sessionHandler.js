const axios = require('axios')
const apiUrl = require('../../../apiUrl.js')

// List
module.exports.list = async function () {
    try {
        const response = await axios.get(apiUrl.session.sessionGets)

        return response
    } catch (error) {
        window.console.error(error)
    }
}
// Get One
module.exports.get = async function (id) {
    try {
        const response = await axios.get(apiUrl.member.member_getOne + id)

        return response
    } catch (error) {
        window.console.error(error)
    }
}

// save
module.exports.create = async (data) => {
    try {
        const response = await axios.post(apiUrl.session.sessionCreate, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
//last number
module.exports.getLastNumber = async (data) => {
    try {
        const response = await axios.post(apiUrl.session.lastNumber, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.checkSession = async (data) => {
    try {
        const response = await axios.post(apiUrl.session.checkSession, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.byuser = async (data) => {
    try {
        const response = await axios.get(apiUrl.session.byUser + '/' + data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}