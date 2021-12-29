import Vue from 'vue'
// import {businessSettingGet} from "../scripts/loanHandler";

// export const loanHandler = require("@/scripts/loanHandler")
export const data =  Vue.observable({
    name:{
        lastname: 'Chhin',
        firstname: 'Chhai'
    },
    show: false,
    resources: '',
    keyword:'',
    customer_tab_main:0,
    customer_tab_sub:0,
    vendor_tab_main:0,
    vendor_tab_sub:0,
    product_tab_main:0,
    product_tab_sub:0,
    budget_tab_main:0,
    budget_tab_sub:0,


})
export const dataStore =  Vue.observable({
    productType: 'advances',
    isValidUser: true,
    company: {},
    businessType: '',
    segment: {},
    category: []
})
export const ShowResource = (key) =>{
    data.show = true
    data.keyword =  key
}
export const setTabActive = (main,sub) =>{
   data.customer_tab_main = main
   data.customer_tab_sub  = sub
}
export const hideResource = () =>{
    data.show = false
    data.resources = ''
}
export const setTabActiveVendor  = (main,sub) =>{
    data.vendor_tab_main = main
    data.vendor_tab_sub  = sub
}
export const setTabActiveBudget  = (main,sub) =>{
    data.budget_tab_main = main
    data.budget_tab_sub  = sub
 }
// export const loadSegment  = async () =>{
//     businessSettingGet().then(res => {
//         if (res.data.statusCode === 200) {
//             let s = res.data.data.filter((obj) => {
//                 return obj.type == dataStore.businessType
//             })
//             if (s.length > 0) {
//                 dataStore.segment = s[0].segment
//                 let businessCategory = []
//                 if (s[0].productCategories.length > 0) {
//                     s[0].productCategories.forEach(item => {
//                         businessCategory.push(item.category.id)
//                     })
//                 }
//                 if (s[0].serviceCategories.length > 0) {
//                     s[0].serviceCategories.forEach(item => {
//                         businessCategory.push(item.category.id)
//                     })
//                 }
//                 dataStore.category = businessCategory
//             } else {
//                 // this.$snotify.error('Please select segment on setting page')
//             }
//         }
//     })
// }
