const axios 	= require('axios');
const apiUrl 	= require('@/apiUrl.js');
const store		= require("@/institute.js");
const baseHandler 	= require('@/scripts/baseHandler.js')

// GET LIST
module.exports.getAll = async function () {
    try {
        if(store.default.state.accountTypes.length === 0){
            const response = await axios.get(apiUrl.account_types);

            store.default.commit("setAccountTypes", response.data);
        }
        
        return store.default.state.accountTypes;
    } catch (error) {
        window.console.error(error);
    }
}

// SAVE
module.exports.save = async (data) => {
    // window.console.log("save in data",JSON.stringify(data))
    try {
        const response = await baseHandler.save(apiUrl.account_types,data);
        return response.data;
    } catch (error) {
        window.console.error(error);
    }
}