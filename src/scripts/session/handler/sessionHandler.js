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
const apiUrlP = require('@/api/setting');
module.exports.paymentoption = async function () {
    try {
        const response = await axios.get(apiUrlP.payment_option_detail + '?optionType=Customer')

        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.getImage = async function (instituteId, userId) {
    try {
        const result = await axios.get(apiUrl.save_image + userId + '/list', {params: {instituteId: instituteId}})
        return result.data.data
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.txnSession = async (data) => {
    try {
        const response = await axios.post(apiUrl.session.txnSession, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.cashierSetting = async function () {
    try {
        const response = await axios.get(apiUrl.session.cashierSetting)

        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.cashierSettingCreate = async (data) => {
    try {
        window.console.log(data, 'handler')
        const response = await axios.post(apiUrl.session.cashierSetting, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.collectionReport = async (data) => {
    try {
        window.console.log(data, 'handler')
        const response = await axios.post(apiUrl.session.collectionReport, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}