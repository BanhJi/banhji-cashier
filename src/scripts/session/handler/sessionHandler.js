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
        window.console.log(data, 'handler')
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
        // window.console.log(data, 'handler')
        const response = await axios.post(apiUrl.session.collectionReport, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.getTxnBySession = async (id) => {
    try {
        const response = await axios.get(apiUrl.session.txnSession + '/' + id)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
module.exports.reconcileCreate = async (data) => {
    try {
        const response = await axios.post(apiUrl.session.reconcileCreate, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}

module.exports.sessionTxnReport = async (data) => {
    try {
        // window.console.log(data, 'handler')
        const response = await axios.post(apiUrl.session.sessionTxnReport, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
const instance = axios.create();
const getToken = async () => {
    // let url = process.env.deployStage === 'dev' ? process.env.camisDev : process.env.camisProd
    // let url = 'https://api-rupp.camemis-learn.com/rupp-api/v1'
    let url = 'https://api-rupp.camemis-learn.com/rupp-api/v1'
    const FormData = require('form-data')
    let data = new FormData()
    window.console.log(data, 'formdata')
    data.append('email', 'banhji@gmail.com')
    data.append('password', 'Dfa$UZpaG4TT-k%e')
    const config = {
        method: 'post',
        url: `${url}/identify`,
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        },
        data : data
    }

    try {
        const result = await instance(config)
        return result.data.token
    } catch (err) {
        window.console.log(err, 'error on get token')
        return err
    }
}
module.exports.notifyCamis = async (paymentCode) => {
    try {
        // let url = process.env.deployStage === 'dev' ? process.env.camisDev : process.env.camisProd
        let url = 'https://api-rupp.camemis-learn.com/rupp-api/v1'
        // let url = process.env.CAMIS_NOT
        // window.console.log(paymentCode, 'handler camis')
        const token = await getToken()
        // window.console.log(token, 'camis token')
        const config = {
            method: 'post',
            url: `${url}/paymentcode/${paymentCode}`,
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            }
        }
        // window.console.log(config, 'camis config')
        const result = await instance(config)
        // window.console.log(result, 'camis result')
        return result.data
    } catch (error) {
        window.console.log(error, 'error on noti camis')
        return error
    }
}