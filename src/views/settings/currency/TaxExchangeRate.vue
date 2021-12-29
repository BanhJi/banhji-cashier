<template>
    <v-row class="">
        <v-col sm="12" cols="12" class="pt-0">
            <template>
                <v-dialog v-model="dialog" max-width="500px">

                    <template v-slot:activator="{ on, attrs }">
                        <!--                                    <div v-if="baseCurrency==='USD'">-->
                        <v-btn color="primary" class="rounded-pill text-capitalize white--text float-right"
                               @click="clear"
                               v-bind="attrs"
                               v-on="on">
                            <v-icon size="15" class="ma-1 mr-2">mdi-plus
                            </v-icon>
                            {{ $t('new') }}
                        </v-btn>
                        <!--                                    </div>-->
                    </template>

                    <v-card>
                        <v-card-title>{{ $t('tax_exchange_rate') }}
                        </v-card-title>
                        <v-icon class="btn_close"
                                @click="dialog = false">
                            close
                        </v-icon>
                        <v-divider/>
                        <v-card-text
                            style="height: 400px; background-color: #EDF1F5; color: #333;">
                            <v-row>
                                <v-col sm="12" cols="12" class="pb-0">
                                    <label class="label">{{
                                            $t('record_date')
                                        }}</label>
                                    <app-datepicker :initialDate="taxExchangeCurrency.recordDate"
                                                    @emitDate="txnDate = $event"/>
                                </v-col>
                                <v-col sm="12" cols="12" class="pb-0">
                                    <label class="label">{{
                                            $t('currency')
                                        }}</label>
                                    <!-- <v-select class="mt-1"
                                              :items="funcCurrencyList"
                                              v-model="mCurrency"
                                              item-value="code"
                                              :item-text="item =>`${item.code} - ${item.name}`"
                                              return-object
                                              outlined>
                                    </v-select> -->
                                    <v-autocomplete ref="field"
                                        class="col-sm-6"
                                        tage="Rate"
                                        v-model="mCurrency"
                                        :items="mCurrency"
                                        :item-text="item =>`${item.code} - ${item.name}`"
                                        outlined/>
                                </v-col>
                                <v-col sm="6" cols="12" class="py-0">
                                    <label class="label">{{
                                            $t('rate')
                                        }}</label>
                                    <v-text-field ref="field"
                                        v-model="taxExchangeCurrency.rate"
                                        tage="Rate"
                                        class="col-sm-6"
                                        outlined/>
                                </v-col>
                                <v-col sm="6" cols="12" class="py-0">
                                    <label class="label">{{
                                            $t('source')
                                        }}</label>
                                    <v-text-field
                                        class=" col-sm-6"
                                        v-model="taxExchangeCurrency.source"
                                        tage="Source"
                                        outlined
                                        placeholder=""/>
                                </v-col>

                                <v-col sm="12" cols="12" class="py-0">
                                    <label class="label">{{
                                            $t('for_report_period')
                                        }}</label>
                                    <app-datepicker :initialDate="taxExchangeCurrency.effectiveDate"
                                                    @emitDate="txnTaxPeriodDate = $event"/>
                                </v-col>
                                <v-col sm="12" cols="12" class="py-0">
                                    <p>{{ $t('note_exc_rate') }}</p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-actions class="pa-5">
                            <v-row>
                                <v-col sm="6" cols="6" class="py-0 text-left">
                                    <v-btn color="black" outlined
                                           class=" text-capitalize rounded-pill black--text float-left"
                                           @click="dialog = false">{{
                                            $t('cancel')
                                        }}
                                    </v-btn>
                                </v-col>
                                <v-col sm="6" cols="6" class="py-0 text-right">
                                    <v-btn color="primary" class="px-3 rounded-pill white--text text-capitalize"
                                           @click="onSaveClose">
                                        {{ $t('save_close') }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-actions>

                    </v-card>
                </v-dialog>
            </template>
        </v-col>

        <v-col sm="12" cols="12" class="pt-0">
            <LoadingMe
                :isLoading="showLoading"
                :fullPage="false"
                :myLoading="true"
                :alertMessage="loadingAlert"
                :color="loadingColorAlert"
                :alertText="loadingTextAlert"
                type="loading"/>
            <kendo-datasource ref="TaxDS" :data="currencyList"/>

            <kendo-grid id="gridTaxExchangeRate" class="grid-function"
                        :data-source-ref="'TaxDS'"
                        :sortable="false"
                        :filterable="false"
                        :column-menu="true"
                        :editable="false"
                        :scrollable-virtual="true">
                <kendo-grid-column
                    :title="$t('date')"
                    :column-menu="false"
                    :template="formatRecordDate"
                    :headerAttributes="{
                            style: 'background-color: #EDF1F5;',
                            class: 'text-products'
                        }"
                    :attributes="{
                            style: 'text-align: products'
                        }"/>
                <kendo-grid-column
                    :title="$t('effective_date')"
                    :column-menu="false"
                    :template="formatEffectiveDate"
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
                    :headerAttributes="{
                            style: 'background-color: #EDF1F5'
                        }"/>
                <kendo-grid-column
                    :field="'name'"
                    :attributes="{class:'tb_name_td'}"
                    :title="$t('name')"
                    :headerAttributes="{
                            style: 'background-color: #EDF1F5'
                        }"/>
                <kendo-grid-column
                    :field="'rate'"
                    :title="$t('rate')"
                    :headerAttributes="{style: ' background-color: #EDF1F5'}"
                    :attributes="{style: ''}"/>
                <kendo-grid-column
                    :field="'source'"
                    :title="$t('sources')"
                    :headerAttributes="{
                            style: 'background-color: #EDF1F5'
                        }"/>
                <kendo-grid-column
                    :command="{ iconClass: 'k-icon k-i-edit', text: 'Edit', class: 'btn-plus' , click: goEdit}"
                    :title="$t('action')"
                    :headerAttributes="{
                            style: 'text-align: right; background-color: #EDF1F5'
                        }"
                />
            </kendo-grid>
        </v-col>
    </v-row>
</template>

<script>
import DatePickerComponent from "@/components/custom_templates/DatePickerComponent";
import TaxExchangeCurrencyModel from "@/scripts/currency/model/TaxExchangeCurrency";
import kendo from "@progress/kendo-ui";
const store = require("@/institute.js")
const {instituteId} = store.default.state.cookies
const instituteHandler = require("@/scripts/instituteHandler")
const currencyHandler = require("@/scripts/currency/handler/currencyHandler")
const taxExchangeCurrencyModel = new TaxExchangeCurrencyModel({})
const $ = require("jquery")

const currencyType = {
    TAX_EXCHANGE_CURRENCY: 'tax-c',
}
export default {
    name: "TaxExchangeCurrency",
    components: {
        'app-datepicker': DatePickerComponent,
        LoadingMe: () => import(`@/components/Loading`),
    },
    data: () => ({
        company: {},
        dialog: false,
        showLoading: false,
        loadingAlert: false,
        loadingColorAlert: '',
        loadingTextAlert: '',
        currencyList: [],
        funcCurrencyList: [],
        txnDate: new Date().toISOString().substr(0, 10),
        txnTaxPeriodDate: new Date().toISOString().substr(0, 10),
        taxExchangeCurrency: taxExchangeCurrencyModel,
        dateFormat: taxExchangeCurrencyModel.dateFormat,
    }),
    methods: {
        async loadInstituteInfo() {
            new Promise(resolve => {
                setTimeout(() => {
                    instituteHandler.getOneCompany(instituteId).then(res => {
                        this.company = res
                        window.console.log(12,this.company)
                    })
                    resolve('resolved');
                }, 200);
            });
        },
        async loadCurrencyData(type) {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.showLoading = true
                    currencyHandler.list(type).then(response => {
                        if (response.data.statusCode === 200) {
                            if (type === currencyType.TAX_EXCHANGE_CURRENCY) {
                               this.currencyList = response.data.data
                            }
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
                    if (this.taxExchangeCurrency.rate && this.mCurrency.code && this.txnDate && this.txnTaxPeriodDate) {
                        let data = {
                            "id": this.taxExchangeCurrency.id ? this.taxExchangeCurrency.id : '',
                            "type": currencyType.TAX_EXCHANGE_CURRENCY,
                            "name": this.mCurrency.name,
                            "code": this.mCurrency.code,
                            "symbol": this.mCurrency.symbol,
                            "recordDate": this.txnDate,
                            "effectiveDate": this.txnTaxPeriodDate,
                            "source": this.taxExchangeCurrency.source,
                            "method": 'Manual',
                            "rate": this.taxExchangeCurrency.rate,
                            "symbolNative": this.mCurrency.symbolNative ? this.mCurrency.symbolNative: ''
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
                                    this.loadCurrencyData(currencyType.TAX_EXCHANGE_CURRENCY)
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
        cancel() {
            this.dialog = false
        },
        clear() {
            this.taxExchangeCurrency = {}
        },
        goEdit(e) {
            e.preventDefault()
            let grid = kendo.jQuery("#gridTaxExchangeRate").data("kendoGrid")
            let dataItem = grid.dataItem($(e.currentTarget).closest("tr"))
            this.taxExchangeCurrency = dataItem
            this.mCurrency = dataItem
            this.txnDate = dataItem.recordDate
            this.txnTaxPeriodDate = dataItem.effectiveDate
            this.dialog = true
        },
        formatEffectiveDate(dataItem) {
            if (dataItem.hasOwnProperty('effectiveDate')) {
                return kendo.toString(new Date(dataItem.effectiveDate), `${this.dateFormat}`)
            }
            return ''
        },
        formatRecordDate(dataItem) {
            if (dataItem.hasOwnProperty('recordDate')) {
                return kendo.toString(new Date(dataItem.recordDate), `${this.dateFormat}`)
            }
            return ''
        }
    },
    mounted: async function () {
        await this.loadCurrencyData(currencyType.TAX_EXCHANGE_CURRENCY)
        await this.loadInstituteInfo()
    },
    computed:{
        mCurrency() {
            if (this.company) {
                if (this.company.hasOwnProperty('taxCurrency')) {
                    const cur = this.company.taxCurrency
                    return cur
                }
            }
            return ''
        },
    }
}
</script>
<style scoped>
</style>
	