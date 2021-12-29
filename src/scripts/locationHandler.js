const axios = require('axios')
const apiUrl = require('@/apiUrl.js')

// GET LIST
module.exports.list = async function () {
    try {
        const response = await axios.get(apiUrl.setting.location_get)

        return response
    } catch (error) {
        window.console.error(error)
    }
}
// GET LIST (BY DAWINE)
module.exports.getAll = async () => {
    try {
        const response = await axios.get(apiUrl.setting.location_get);

        return response;
    } catch (error) {
        window.console.error(error)
    }
}

// save
module.exports.create = async (data) => {
    try {
        const response = await axios.post(apiUrl.setting.location_post, data)
        return response
    } catch (error) {
        window.console.error(error)
    }
}
