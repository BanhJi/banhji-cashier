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
        {
            path: '/',
            name: 'Overview',
            component: load('overview/OverviewTab'),
            meta: {
                moduleId: 1,
                mainMenu: 'welcome',
                title: 'Overview'
            }
        },
        {
            path: 'session',
            name: 'Session',
            component: () => import('../views/session/Session'),
            meta: {
                title: 'Session'
            }
        },
        {
            path: 'receipt',
            name: 'Receipt',
            component: () => import('../views/receipt/Receipt'),
            meta: {
                title: 'Receipt'
            }
        },
        {
            path: 'reconcile',
            name: 'Reconcile',
            component: () => import('../views/reconcile/Reconcile'),
            meta: {
                title: 'Reconcile'
            }
        },
        {
            path: 'report',
            name: 'Report',
            component: () => import('../views/report/Index'),
            meta: {
                title: 'Report'
            }
        }
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
