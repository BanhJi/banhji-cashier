const axios = require('axios')
const apiUrl = require('../apiUrl.js')

// Get SubClassByClass
module.exports.byClassURL = function () {
    try {
        // const response = apiUrl.setting.class_subclass_get

        return apiUrl.setting.class_subclass_get
    } catch (error) {
        window.console.error(error)
    }
}

// Get One
module.exports.getClazz = async function () {
    try {
        const response = await axios.get(apiUrl.setting.class_get)

        return response
    } catch (error) {
        window.console.error(error)
    }
}

// save
module.exports.create = async (data) => {
    try {
        const response = await axios.post(apiUrl.setting.class_post, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}

// Get One
module.exports.getSeg = async function (id='') {
    try {
        if( id != ''){
            const response = await axios.get(apiUrl.setting.segment_get+"?id="+id)
            return response
        }else{
            const response = await axios.get(apiUrl.setting.segment_get)
            return response
        }

    } catch (error) {
        window.console.error(error)
    }
}

// save
module.exports.createSeg = async (data) => {
    try {
        const response = await axios.post(apiUrl.setting.segment_post, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
// save sub class
module.exports.createSubClass = async (data) => {
    try {
        const response = await axios.post(apiUrl.setting.subclass_post, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}

// Get prefix list
module.exports.getPrefixes = async function () {
    try {
        const response = await axios.get(apiUrl.setting.prefix_get)

        return response
    } catch (error) {
        window.console.error(error)
    }
}

// Get payment term
module.exports.getPaymentTerm = async function (strFilter = '') {
    try {
        const response = await axios.get(apiUrl.setting.payment_setting_get + strFilter)

        return response
    } catch (error) {
        window.console.error(error)
    }
}
// save payment term
module.exports.addPaymentTerm = async (data) => {
    try {
        const response = await axios.post(apiUrl.setting.payment_setting_post, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}

// Get other account
module.exports.getOtherAccount = async function (strFilter = '') {
    try {
        const response = await axios.get(apiUrl.setting.other_account_get + strFilter)
        return response
    } catch (error) {
        window.console.error(error)
    }
}

// Get form setting by formType
module.exports.getFormSetting = async function (strFilter = '') {
    try {
        const response = await axios.get(apiUrl.setting.form_get + strFilter)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.deleteFormSetting = async function (strFilter = '') {
    try {
        const response = await axios.get(apiUrl.setting.form_delete + strFilter)
        return response
    } catch (error) {
        window.console.error(error)
    }
}

// Post form setting
module.exports.formSettingCreate = async (data) => {
    try {
        const response = await axios.post(apiUrl.setting.form_post, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}