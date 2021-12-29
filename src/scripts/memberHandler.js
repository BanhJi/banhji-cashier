const axios = require('axios')
const apiUrl = require('../apiUrl.js')
const unknown = require('../api/unknown')

// Gender
module.exports.gender = function () {
    try {
        const gender = unknown.gender
        // const response = await axios.get(unknown.gender)

        return gender
    } catch (error) {
        window.console.error(error)
    }
}
// // Center
// module.exports.center = async function (customerTypeId, customerGroupId, search) {
//     try {
//         let response = []
//         if (search !== '' && search !== null && search !== 'null') {
//             response = await axios.get(apiUrl.customer.customer_center + '/' + customerTypeId + '/center/' + customerGroupId + '/' + search)
//             return response
//         } else {
//             response = await axios.get(apiUrl.customer.customer_center + '/' + customerTypeId + '/center/' + customerGroupId)
//             return response
//         }
//     } catch (error) {
//         window.console.error(error)
//     }
// }

// List
module.exports.list = async function () {
    try {
        const response = await axios.get(apiUrl.member.member_get)

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
        const response = await axios.post(apiUrl.member.member_post, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}

// Search
module.exports.search = function () {
    try {
        const response = apiUrl.member.member_search
        return response
    } catch (error) {
        window.console.error(error)
    }
}

// upload
module.exports.upload = async (data) => {
    try {
        const response = await axios.post("https://ck3f4yltlf.execute-api.ap-southeast-1.amazonaws.com/dev/v1/uploads/file/upload", data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
// saving account
// save
module.exports.createSavingAccount = async (data) => {
    try {
        const response = await axios.post(apiUrl.member.saving_account_post, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.getSavingAccountById = async function (id) {
    try {
        const response = await axios.get(apiUrl.member.saving_account_getByMember + id)

        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.getDepositAccountById = async function (id) {
    try {
        const response = await axios.get(apiUrl.member.saving_deposit_getByAccount + id)

        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.createSavingDeposit = async (data) => {
    try {
        const response = await axios.post(apiUrl.member.saving_deposit_post, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.createSavingWithdraw = async (data) => {
    try {
        const response = await axios.post(apiUrl.member.saving_withdraw_post, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}

//last number
module.exports.getLastNumber = async (data) => {
    try {
        const response = await axios.post(apiUrl.member.lastnumber, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
