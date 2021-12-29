<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col sm="12" cols="12" class="pr-5">
                    <v-card outlined dense class="pa-4 no_border rounded-sm" color="white">
                        <v-card outlined dense class="no_border">
                            <h2 class="mb-0 font_20">{{ $t('functional_currency') }}</h2>
                            <v-icon
                                onclick="window.history.go(-1); return false;"
                                style="cursor: pointer; color: #333; font-size: 40px;"
                                class="float-right"
                            >close
                            </v-icon>
                        </v-card>
                        <v-row>
                            <v-col sm="12" cols="12" class="py-0">
                                <template>
                                    <v-dialog v-model="dialogM1" max-width="500px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn color="primary"
                                                   class="rounded-pill text-capitalize white--text float-right"
                                                   v-bind="attrs"
                                                   v-on="on">
                                                <v-icon size="15" class="ma-1 mr-2">mdi-plus</v-icon>
                                                {{ $t('new') }}
                                            </v-btn>
                                        </template>

                                        <v-card>
                                            <v-card-title>{{ $t('functional_currency') }}</v-card-title>
                                            <v-icon class="btn_close" @click="dialogM1 = false">
                                                close
                                            </v-icon>
                                            <v-divider/>
                                            <v-card-text
                                                style="height: 120px; background-color: #EDF1F5; color: #333;">
                                                <v-row>
                                                    <v-col sm="12" cols="12" class="">
                                                        <label class="label">{{ $t('enable_new_currency') }}</label>
                                                        <p class="text_tip">{{ $t('pls_sl_currency_record') }}</p>
                                                        <v-select class="mt-1"
                                                                  :items="currencyJSON"
                                                                  v-model="mCurrency"
                                                                  item-value="code"
                                                                  :item-text="item =>`${item.code} - ${item.name}`"
                                                                  return-object
                                                                  outlined>
                                                        </v-select>
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                            <v-card-actions class="pa-5">
                                                <v-row>
                                                    <v-col sm="6" cols="6" class="py-0 text-left">
                                                        <v-btn color="black" outlined
                                                               class=" text-capitalize rounded-pill black--text float-left"
                                                               @click="dialogM1 = false">{{ $t('close') }}
                                                        </v-btn>
                                                    </v-col>
                                                    <v-col sm="6" cols="6" class="py-0 text-right">
                                                        <v-btn color="primary" @click="onSaveClose"
                                                               class="px-3 rounded-pill white--text text-capitalize">
                                                            {{ $t('save_close') }}
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </template>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="12" cols="12">
                                <LoadingMe
                                    :isLoading="showLoading"
                                    :fullPage="true"
                                    :myLoading="true"
                                    :alertMessage="loadingAlert"
                                    :color="loadingColorAlert"
                                    :alertText="loadingTextAlert"/>
                                <kendo-datasource ref="dataSource"
                                                  :data="currencyList"/>

                                <kendo-grid id="grid" class="grid-function"
                                            :data-source-ref="'dataSource'"
                                            :sortable="false"
                                            :filterable="false"
                                            :column-menu="true"
                                            :editable="false"
                                            :scrollable-virtual="true">
                                    <kendo-grid-column
                                        :title="$t('date')"
                                        :template="formatDate"
                                        :column-menu="false"
                                        :headerAttributes="{
                            style: 'background-color: #EDF1F5;',
                            class: 'text-products'
                        }"
                                        :attributes="{
                            style: 'text-align: products'
                        }"/>
                                    <kendo-grid-column
                                        :field="'code'"
                                        :title="$t('code')"
                                        :template="'<span>#=code?code:``#</span>'" ,
                                        :headerAttributes="{
                            style: 'background-color: #EDF1F5'
                        }"/>
                                    <kendo-grid-column
                                        :field="'name'"
                                        :attributes="{class:'tb_name_td'}"
                                        :title="$t('name')"
                                        :template="'<span>#=name?name:``#</span>'" ,
                                        :headerAttributes="{
                            style: 'background-color: #EDF1F5'
                        }"/>
                                    <kendo-grid-column
                                        :field="'symbol'"
                                        :title="$t('symbol')"
                                        :template="'<span>#=symbol?symbol:``#</span>'" ,
                                        :headerAttributes="{
                            style: 'background-color: #EDF1F5'
                        }"/>
                                    <kendo-grid-column
                                        :field="'symbolNative'"
                                        :title="$t('native_symbol')"
                                        :template="'<span>#=symbolNative?symbolNative:``#</span>'" ,
                                        :headerAttributes="{style: ' background-color: #EDF1F5'}"
                                        :attributes="{style: ''}"/>
                                    <!--                                    <kendo-grid-column-->
                                    <!--                                        :command="{ iconClass: 'k-icon k-i-edit', text: 'Edit', class: 'btn-plus' , click: goEdit}"-->
                                    <!--                                        :title="$t('action')"-->
                                    <!--                                        :headerAttributes="{-->
                                    <!--                            style: 'text-align: right; background-color: #EDF1F5'-->
                                    <!--                        }"-->
                                    <!--                                    />-->
                                </kendo-grid>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import CurrencyModel from "@/scripts/currency/model/Currency";
import kendo from "@progress/kendo-ui";

const $ = require("jquery")
const currencyHandler = require("@/scripts/currency/handler/currencyHandler")
const currencyModel = new CurrencyModel({})
const currencyType = {
    FUNCTIONAL_CURRENCY: 'fun-c',
    TRANSACTION_CURRENCY: 'txn-c',
    REPORTING_CURRENCY: 'rpt-c',
    TAX_EXCHANGE_CURRENCY: 'tax-c',
}
export default {
    name: "FunctionalCurrency",
    components: {
        LoadingMe: () => import(`@/components/Loading`),
    },
    data: () => ({
        dialogM1: false,
        showLoading: true,
        loadingAlert: false,
        loadingColorAlert: '',
        loadingTextAlert: '',
        currency: currencyModel,
        mCurrency: {},
        dateFormat: currencyModel.dateFormat,
        currencyJSON: [],
        currencyList: []
    }),
    methods: {
        goEdit(e) {
            e.preventDefault()
            let grid = kendo.jQuery("#grid").data("kendoGrid")
            let dataItem = grid.dataItem($(e.currentTarget).closest("tr"))
            this.mCurrency = dataItem
            this.dialogM1 = true
        },
        formatDate(dataItem) {
            if (dataItem.hasOwnProperty('createdAt')) {
                return kendo.toString(new Date(dataItem.createdAt), `${this.dateFormat}`)
            }
            return ''
        },
        async loadCurrencyJSON() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    currencyHandler.getJson().then(res => {
                        this.currencyJSON = Object.values(res.data)

                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 300)
            })
        },
        cancel() {
            this.dialogM1 = false
        },
        close() {
            window.history.back(-1)
        },
        async loadCurrencyData() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.showLoading = true
                    currencyHandler.list(currencyType.FUNCTIONAL_CURRENCY).then(response => {
                        if (response.data.statusCode === 200) {
                            this.currencyList = response.data.data
                            this.showLoading = false
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 300)
            })
        },
        async onSaveClose() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    const exist = this.currencyList.filter(n => n.code === this.mCurrency.code)
                    if (exist.length === 0) {
                        let data = {
                            "id": this.currency.id ? this.currency.id : '',
                            "type": currencyType.FUNCTIONAL_CURRENCY,
                            "name": this.mCurrency.name,
                            "code": this.mCurrency.code,
                            "symbol": this.mCurrency.symbol,
                            "rate": 1,
                            "symbolNative": this.mCurrency.symbol_native
                        }
                        currencyHandler.create(data).then(response => {
                            if (response.data.statusCode === 201) {
                                this.$snotify.success('Successfully')
                                this.cancel()
                                const res = response.data.data
                                const index = this.currencyList.findIndex(item => {
                                    return (res.id === item.id)
                                })
                                if (this.currencyList.length === 0) {
                                    this.loadCurrencyData()
                                }
                                if (index < 0) {
                                    this.currencyList.push(res)
                                } else {
                                    this.currencyList.splice(index, 1, res)
                                }
                            }
                        }).catch(e => {
                            this.$snotify.error('Something went wrong')
                            this.errors.push(e)
                        })
                    }

                }, 300);
            })
        },
    },
    mounted: async function () {
        await this.loadCurrencyJSON()
        await this.loadCurrencyData()
    }
};
</script>
<style scoped>
@media (min-width: 1264px) {
    .container {
        max-width: 1080px !important;
    }
}
</style>
