import Vue from 'vue'
import VueRouter from 'vue-router'
import {Trans} from '@/plugins/Translation'
import {dataStore} from '@/observable/store'

const store = require("@/institute.js")

function load(component) {
    // '@' is aliased to src/components
    return () => import(`@/views/${component}.vue`)
}

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const routes = [{
    path: '/:locale',
    component: {
        template: "<keep-alive><router-view></router-view></keep-alive>"
    },
    beforeEnter: Trans.routeMiddleware,
    children: [
        // {
        //     path: '/customers',
        //     name: 'Overview',
        //     component: load('Overview'),
        //     meta: {
        //         mainMenu: 'welcome',
        //         title: 'Overview'
        //     }
        // },
        {
            path: 'customers',
            name: 'Customers',
            component: () => import('../views/customers/Customers'),
            meta: {
                mainMenu: 'customers_revenues',
                title: 'Customers & Revenues'
            }
        },
        {
            path: 'invoice/:id?',
            name: 'Invoice',
            component: () => import('../views/customers/Invoice'),
            props: true,
            meta: {
                mainMenu: 'customers_revenues',
                miniSideBar: false,
                title: 'Customers & Revenues'
            }
        },
        {
            path: 'invoice_view/:id?',
            name: 'Invoice View',
            component: () => import('../views/customers/InvoiceView'),
            props: true,
            meta: {
                mainMenu: 'customers_revenues',
                miniSideBar: true,
                title: 'Customers & Revenues'
            }
        },


        {
            path: 'cash_receipt/:id?',
            name: 'Cash Receipt',
            component: () => import('../views/customers/CashReceipt'),
            props: true,
            meta: {
                mainMenu: 'customers_revenues',
                miniSideBar: false,
                title: 'Customers & Revenues'
            }
        },
        {
            path: 'cash_receipt_view/:id?',
            name: 'Cash Receipt View',
            props: true,
            component: () => import('../views/customers/CashReceiptView'),
            meta: {
                mainMenu: 'customers_revenues',
                miniSideBar: true,
                title: 'Customers & Revenues'
            }
        },
        {
            path: 'vendors',
            name: 'Vendors',
            component: load('suppliers/Suppliers'),
            meta: {
                mainMenu: 'suppliers_purchases',
                title: 'Vendors & Purchases'
            }
        },
        {
            path: 'credit_purchase/:id?',
            name: 'Credit Purchase',
            component: load('suppliers/CreditPurchases'),
            props: true,
            meta: {
                mainMenu: 'suppliers_purchases',
                miniSideBar: false,
                title: 'Vendors & Purchases'
            }
        },
        {
            path: 'credit_purchase_view/:id?',
            name: 'Credit Purchase View',
            props: true,
            component: load('suppliers/CreditPurchaseViews'),
            meta: {
                mainMenu: 'suppliers_purchases',
                miniSideBar: true,
                title: 'Vendors & Purchases'
            }
        },
        {
            path: 'expenses/:id?',
            name: 'Expenses',
            component: load('suppliers/Expenses'),
            props: true,
            meta: {
                mainMenu: 'suppliers_purchases',
                miniSideBar: false,
                title: 'Vendors & Purchases'
            }
        },
        {
            path: 'expenses/view/:id',
            name: 'Expenses View',
            component: load('suppliers/ExpensesView'),
            props: true,
            meta: {
                mainMenu: 'suppliers_purchases',
                miniSideBar: false,
                title: 'Vendors & Purchases'
            }
        },
        {
            path: 'cash_payment/:id?',
            name: 'Cash Payment',
            component: load('suppliers/CashPayments'),
            props: false,
            meta: {
                mainMenu: 'suppliers_purchases',
                miniSideBar: false,
                title: 'Vendors & Purchases'
            }
        },
        {
            path: 'cash_payment_view/:id?',
            name: 'Cash Payment View',
            component: load('suppliers/CashPaymentView'),
            props: true,
            meta: {
                mainMenu: 'suppliers_purchases',
                miniSideBar: false,
                title: 'Vendors & Purchases'
            }
        },
        {
            path: 'products',
            name: 'Products',
            component: load('products/ProductTab'),
            meta: {
                mainMenu: 'products_productions',
                title: 'Products & Productions'
            }
        },

        {
            path: 'services_project/:id?',
            name: 'Services Project',
            props: true,
            component: load('services_projects/projects/Project'),
            meta: {
                mainMenu: 'services_projects_non',
                title: 'Services'
            }
        },
        {
            path: 'services_projects',
            name: 'Services Projects',
            component: load('services_projects/ServicesProjects'),
            props: true,
            meta: {
                mainMenu: 'services_projects_non',
                title: 'Services'
            }
        },
        {
            path: 'service/:id?',
            name: 'Service',
            props: true,
            component: load('services_projects/services_items/Service'),
            meta: {
                mainMenu: 'services_projects_non',
                title: 'Services'
            }
        },


        {
            path: 'product/:id?',
            name: 'Product',
            component: load('products/Product'),
            props: true,
            meta: {
                mainMenu: 'products_productions',
                title: 'Products & Productions',
            }
        },


        {
            path: 'production/:id',
            name: 'Production',
            props: true,
            component: load('products/production/production_orders/Production'),
            meta: {
                mainMenu: 'products_productions',
                miniSideBar: false,
                title: 'Products & Productions',
            }
        },

        {
            path: 'product_variant/:id?',
            name: 'Product Variant',
            component: load('products/product/product_variants/products/ProductVariant'),
            props: true,
            meta: {
                mainMenu: 'products_productions',
                title: 'Products & Productions',
            }
        },


        {
            path: 'working_capital',
            name: 'WorkingCapital',
            component: load('working_capital/WorkingCapital'),
            meta: {
                mainMenu: 'working_capital_meta',
                title: 'Cash & Working Capital',
            }
        },

        {
            path: 'budget/:id?',
            name: 'Budget',
            component: load('working_capital/budgets/Budget'),
            meta: {
                mainMenu: 'working_capital_meta',
                title: 'Cash & Working Capital',
            }
        },


        {
            path: 'cash_advance',
            name: 'Cash Advance',
            component: load('working_capital/CashAdvance'),
            props: true,
            meta: {
                mainMenu: 'working_capital_meta',
                title: 'Cash & Working Capital',
            }
        },
        {
            path: 'cash_advance/view/:id',
            name: 'Cash Advance View',
            component: load('working_capital/views/CashAdvanceView'),
            props: true,
            meta: {
                mainMenu: 'working_capital_meta',
                title: 'Cash & Working Capital',
            }
        },

        {
            path: 'cash_movement',
            name: 'Cash Movement',
            component: load('working_capital/CashMovement'),
            meta: {
                mainMenu: 'working_capital_meta',
                title: 'Cash & Working Capital',
            }
        },

        {
            path: 'settings',
            name: 'Settings',
            component: load('settings/Settings'),
            meta: {
                mainMenu: 'settings',
                title: 'Settings - BanhJi Accounting',
            }
        },

        {
            path: 'search',
            name: 'Search',
            component: load('Search'),
            meta: {
                mainMenu: 'search',
                title: 'Search - BanhJi Accounting',
            }
        },
        {
            path: 'individual_customer/:id?',
            name: 'Individual Customer',
            component: () => import('../views/customers/IndividualCustomer'),
            props: true,
            meta: {
                mainMenu: 'receiveable_revenue',
                miniSideBar: false,
                title: ('Receiveable revenue')
            }
        },
        {
            path: 'individual_supplier/:id?',
            name: 'Individual Supplier',
            component: load('suppliers/IndividualSupplier'),
            props: true,
            meta: {
                mainMenu: 'suppliers_purchases',
                title: 'Payables'
                // miniSideBar: true
            }
        },
        {
            path: 'product/:id?',
            name: 'Product',
            component: load('products/Product'),
            props: true,
            meta: {
                mainMenu: 'products',
                title: 'Products',
            }
        },


    ]
},
    {
        path: '*',
        redirect() {
            return Trans.defaultLocale;
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    // if (dataStore.productType == 'cooperative' && to.meta.type == 'insurance' || dataStore.productType == 'cooperative' && to.meta.type == 'compliance') {
    //     return
    // }

    if (dataStore.isValidUser == false) {
        document.title = "Unauthorization | គ្មានការអនុញ្ញាត"
        return
    }
    next()
})
// Router After Hooks
router.afterEach((to) => {
    let historyPages = store.default.state.historyPages

    // Remove existing route
    let oldIndex = historyPages.findIndex(i => i.name === to.name)
    if (oldIndex > -1) {
        historyPages.splice(oldIndex, 1)
    }
    // Add route
    store.default.commit("setHistoryPage", to)
})

export default router
