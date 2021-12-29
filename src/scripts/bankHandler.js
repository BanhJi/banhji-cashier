const baseHandler 	= require('@/scripts/baseHandler.js')
const apiUrl 	= require('@/apiUrl.js') 
const axios 	= require('axios')
const store		= require("@/institute.js")

// GET BY ID
module.exports.getOne = async (id) => {
    baseHandler.getOne(apiUrl.banking + '/banks', id).then(result=>{
        return result.data;
    })
}
// GET LIST
module.exports.getAll = async () => {
    try {
        if(store.default.state.banks.length === 0){
            const response = await axios.get(apiUrl.banking + '/banks')
            
            store.default.commit("setBanks", response.data)
        }
        
        return store.default.state.banks
    } catch (error) {
        window.console.error(error)
    }
}

// SAVE
module.exports.save = async (data) => {
    return baseHandler.save(apiUrl.banking + '/banks', data)
}
module.exports.createQr = async function (bankName, data) {
    try {
        const response = await axios.post(apiUrl.bank_qr + bankName, data)
        return response.data
    } catch (error) {
        window.console.error(error)
    }
}