'use strict'

const store = require("./institute.js")
const {dataStore} =  require('./observable/store')
const jwt = require('jsonwebtoken');
module.exports.cookie = {
    init: () => getCookieData()
}

let getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
}

let getCookieData =  function (){
    window.console.log('banhji-token-cashier' + process.env.VUE_APP_MODE, 'coookie')
    let cookie = getCookie('banhji-token-cashier' + process.env.VUE_APP_MODE);
    if (cookie !== ''){
        jwt.verify(cookie,process.env.VUE_APP_JWT_SESCRET, (err, decoded) => {
            if (!err){
            //    window.console.log(decoded, 'cookie') 
               store.default.state.cookies = decoded;
               dataStore.isValidUser = true
               let data = decoded
               if(data.plan == 4){
                   dataStore.productType = 'cooperative'
               }else if(data.plan == 3){
                dataStore.productType = "Advanced";
               }else if(data.plan == 2){
                dataStore.productType = "Premium";
               }
               else{
                   dataStore.productType = 'Standard'
               }
            }else{
                dataStore.isValidUser = false
            }
        });
  
        // store.default.state.cookies.accessToken = data.accessToken
        // store.default.state.cookies.refreshToken = data.refreshToken
        // store.default.state.cookies.expiresIn = data.expiresIn
        // store.default.state.cookies.email = data.email
        // store.default.state.cookies.instituteId = data.instituteId
        // store.default.state.cookies.creator = data.creator
    }else{
        dataStore.isValidUser = false
    }
}