<template>
    <v-row class="">
        <v-col sm="12" cols="12" class="pt-6">
            <v-row>
                <v-col class="pt-0" sm="5" cols="12">
                    <v-card color="secondary" outlined dense class="pa-3 rounded-0 d-flex justify-space-between  align-center" height="70px">
                        <p class="white--text col-sm-6 pa-0 text-bold text-left font_14  mb-0">
                            {{ $t('base_currency') }}</p>
                        <p class="white--text col-sm-6 pa-0 text-bold  text-right font_18 text-right mb-0 font-bold">
                            {{ baseCurrency }}
                        </p>
                    </v-card>
                </v-col>
                <v-col class="pt-0" sm="5" cols="12">
                    <v-card color="third" outlined dense class="pa-3 rounded-0 d-flex justify-space-between align-center" height="70px">
                        <p class="white--text  pa-0 text-bold font_14 text-left  mb-0">
                            {{ $t('reporting_currency') }}</p>
                        <p class="white--text  pa-0 text-bold font_18  text-right mb-0 font-bold">
                            {{ reportingCurrency }}
                        </p>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col sm="5" cols="12">
                    <v-card color="secondary" outlined dense class="pa-3 rounded-0 d-flex justify-space-between  align-center" height="70px">
                        <p class="white--text  pa-0 text-bold font_14 text-left  mb-0">
                            {{ $t('tax__currency') }}</p>
                        <p class="white--text pa-0 text-bold text-right font_18 mb-0 font-bold">
                            {{taxCurrency}}</p>
                    </v-card>
                </v-col>
                <v-col sm="5" cols="12">
                    <v-card color="third" outlined dense class="pa-3 funct_click d-flex justify-space-between  align-center rounded-0" height="70px"
                            to="functional_currency">
                        <i class="fa fa-caret-right" aria-hidden="true"/>
                        <p class="white--text  pa-0 text-bold font_14  text-left mb-0">
                            {{ $t('functional_currency') }}</p>
                        <p class="white--text pa-0 text-bold font_18  text-right mb-0 font-bold">
                            {{ funcCurrencyUsed }}</p>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col sm="12" cols="12" class="tab_wrapper py-0">
                    <v-tabs>
                        <v-tab>
                            <span class="hidden-sm-and-up">
                                <v-icon left>mdi-pen</v-icon>
                            </span>
                            <span class="hidden-sm-and-down text-capitalize">
                                {{ $t('transaction_exchange_rate') }}
                            </span>
                        </v-tab>
                        <v-tab>
                            <span class="hidden-sm-and-up">
                                <v-icon left>mdi-pen</v-icon>
                            </span>
                            <span class="hidden-sm-and-down text-capitalize">
                                {{ $t('reporting_exchange_rate') }}
                            </span>
                        </v-tab>
                        <v-tab>
                            <span class="hidden-sm-and-up">
                                <v-icon left>mdi-pen</v-icon>
                            </span>
                            <span class="hidden-sm-and-down text-capitalize">
                                {{ $t('tax_exchange_rate') }}
                            </span>
                        </v-tab>

                        <v-tab-item>
                            <v-row>
                                <v-col sm="12" cols="12" class="py-3 px-6 grayBg">
                                    <TxnExchangeRate/>
                                </v-col>
                            </v-row>
                        </v-tab-item>

                        <v-tab-item>
                            <v-row>
                                <v-col sm="12" cols="12" class="py-3 px-6 grayBg">
                                    <ReportingExchangeRate/>
                                </v-col>
                            </v-row>
                        </v-tab-item>

                        <v-tab-item>
                            <v-row>
                                <v-col sm="12" cols="12" class="py-3 px-6 grayBg">
                                    <TaxExchangeRate/>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                    </v-tabs>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
const store = require("@/institute.js")
const {instituteId} = store.default.state.cookies

const instituteHandler = require("@/scripts/instituteHandler")
const currencyHandler = require("@/scripts/currency/handler/currencyHandler")
const currencyType = {
    FUNCTIONAL_CURRENCY: 'fun-c',
    TRANSACTION_CURRENCY: 'txn-c',
    REPORTING_CURRENCY: 'rpt-c',
    TAX_EXCHANGE_CURRENCY: 'tax-c',
}
export default {
    name: "Currency",
    components: {
        TxnExchangeRate: () => import('./TxnExchangeRate'),
        ReportingExchangeRate: () => import('./ReportingExchangeRate'),
        TaxExchangeRate: () => import('./TaxExchangeRate'),
    },
    data: () => ({
        company: {},
        currencyList: [],
    }),
    methods: {
        async loadInstituteInfo() {
            new Promise(resolve => {
                setTimeout(() => {
                    instituteHandler.getOneCompany(instituteId).then(res => {
                        this.company = res
                    })
                    resolve('resolved');
                }, 200);
            });
        },
        async loadCurrencyData() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    currencyHandler.list(currencyType.FUNCTIONAL_CURRENCY).then(response => {
                        if (response.data.statusCode === 200) {
                            this.currencyList = response.data.data
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 300)
            })
        },
    },
    mounted: async function () {
        await this.loadInstituteInfo()
        await this.loadCurrencyData()
    },
    computed: {
        baseCurrency() {
            if (this.company) {
                if (this.company.hasOwnProperty('baseCurrency')) {
                    const cur = this.company.baseCurrency
                    return cur.code
                }
            }
            return ''
        },
        reportingCurrency() {
            if (this.company) {
                if (this.company.hasOwnProperty('reportingCurrency')) {
                    const cur = this.company.reportingCurrency
                    return cur.code
                }
            }
            return ''
        },
        funcCurrencyUsed() {
            if (this.currencyList) {
                return this.currencyList.length
            }
            return ''
        },
        taxCurrency() {
            if (this.company) {
                if (this.company.hasOwnProperty('taxCurrency')) {
                    const cur = this.company.taxCurrency
                    return cur.code
                }
            }
            return ''
        },
    },
}
</script>
<style scoped>
.funct_click {
    transition: box-shadow 200ms;
    border-left: 4px solid #4d4848 !important;
    position: relative;
}

.funct_click::before {
    content: "";
    posistion: absolute;
    width: 0;
    height: 0;
    margin-top: 13px;
    marin-left: -10px;
    border-top: 10px solid transparent;
    border-left: 20px solid #f33;
    border-bottom: 10px solid transparent;
    float: left;
}

.funct_click i {
    color: #4d4848;
    font-size: 30px;
    transition: 0.5s ease-in;
    position: absolute;
    left: 2px;
    top: 18px;
}

.funct_click:hover i {
    position: absolute;
    left: 90%;

}
</style>
	