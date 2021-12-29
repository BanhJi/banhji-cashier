const axios = require('axios')
const apiUrl = require('@/apiUrl')

// List
module.exports.customerRevenue = async function (strFilter = '') {
    try {
        const response = await axios.get(apiUrl.dashboard.revenue + strFilter)

        return response
    } catch (error) {
        window.console.error(error)
    }
}
