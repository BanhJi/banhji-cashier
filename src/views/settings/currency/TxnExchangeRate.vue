<template>
    <v-row class="">
        <v-col sm="12" cols="12" class="pt-0">
            <template>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" class="rounded-pill text-capitalize white--text float-right"
                               @click="clear"
                               v-bind="attrs"
                               v-on="on">
                            <v-icon size="15" class="ma-1 mr-2">mdi-plus
                            </v-icon>
                            {{ $t('new') }}
                        </v-btn>
                    </template>

                    <v-card>
                        <v-card-title>{{ $t('transaction_exchange_rate') }}
                        </v-card-title>
                        <v-icon class="btn_close" @click="dialog = false">
                            close
                        </v-icon>
                        <v-divider/>
                        <v-card-text style="height: 340px; background-color: #EDF1F5; color: #333;">
                            <v-row>
                                <v-col sm="12" cols="12" class="pb-0">
                                    <label class="label ">{{ $t('effective_rate_date') }}</label>
                                    <app-datepicker :initialDate="txnCurrency.effectiveDate"
                                                    @emitDate="txnDate = $event"/>

                                    <label class="label">{{ $t('currency') }}</label>
                                    <p class="text_tip">{{
                                            $t('pls_select_currency')
                                        }}</p>
                                    <v-select class="mt-1"
                                              :items="funcCurrencyList"
                                              v-model="mCurrency"
                                              item-value="code"
                                              :item-text="item =>`${item.code} - ${item.name}`"
                                              return-object
                                              outlined>
                                    </v-select>
                                </v-col>

                                <v-col sm="6" cols="12" class="py-0">
                                    <label class="label">{{ $t('rate') }}</label>
                                    <v-text-field outlined class="mt-1" v-model="txnCurrency.rate"/>
                                </v-col>
                                <v-col sm="6" cols="12" class="py-0">
                                    <label class="label">{{ $t('source') }}</label>
                                    <v-text-field outlined class="mt-1"
                                                  v-model="txnCurrency.source"
                                                  placeholder=""/>
                                </v-col>
                                <v-col sm="12" cols="12" class="py-0">
                                    <p>{{ $t('note_exc_rate') }}</p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-divider/>
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
                :fullPage="true"
                :myLoading="true"
                :alertMessage="loadingAlert"
                :color="loadingColorAlert"
                :alertText="loadingTextAlert"/>
            <kendo-datasource ref="dataSource" :data="currencyList"/>

            <kendo-grid id="grid" class="grid-function"
                        :data-source-ref="'dataSource'"
                        :sortable="false"
                        :filterable="false"
                        :column-menu="true"
                        :editable="false"
                        :scrollable-virtual="true"
            >
                <kendo-grid-column
                    :field="'createdAt'"
                    :title="$t('date')"
                    :column-menu="false"
                    :template="formatCreatedAt"
                    :headerAttributes="{
                            style: 'background-color: #EDF1F5;',
                            class: 'text-products'
                        }"
                    :attributes="{
                            style: 'text-align: products'
                        }"/>
                <kendo-grid-column
                    :field="'effectiveDate'"
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
                    :field="'symbol'"
                    :title="$t('symbol')"
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
                    :field="'method'"
                    :title="$t('method')"
                    :hidden="true"
                    :headerAttributes="{style: 'background-color: #EDF1F5'}"
                    :attributes="{style: ''}"/>
                <kendo-grid-column
                    :command="{ iconClass: 'k-icon k-i-edit', text: 'Edit', class: 'btn-plus', click: goEdit }"
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
import TxnCurrencyModel from "@/scripts/currency/model/TxnCurrency";
import kendo from "@progress/kendo-ui";

const currencyHandler = require("@/scripts/currency/handler/currencyHandler")
const txnCurrencyModel = new TxnCurrencyModel({})
const $ = require("jquery")

const currencyType = {
    FUNCTIONAL_CURRENCY: 'fun-c',
    TRANSACTION_CURRENCY: 'txn-c',
    REPORTING_CURRENCY: 'rpt-c',
    TAX_EXCHANGE_CURRENCY: 'tax-c',
}
export default {
    name: "TransactionCurrency",
    components: {
        'app-datepicker': DatePickerComponent,
        LoadingMe: () => import(`@/components/Loading`),
    },
    data: () => ({
        dialog: false,
        showLoading: true,
        loadingAlert: false,
        loadingColorAlert: '',
        loadingTextAlert: '',
        currencyList: [],
        txnCurrencyList: [],
        funcCurrencyList: [],
        mCurrency: {},
        txnDate: '',
        txnCurrency: txnCurrencyModel,
        dateFormat: txnCurrencyModel.dateFormat,
    }),
    methods: {
        async loadCurrencyData(type) {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.showLoading = true
                    currencyHandler.list(type).then(response => {
                        if (response.data.statusCode === 200) {
                            if (type === currencyType.FUNCTIONAL_CURRENCY) {
                                this.funcCurrencyList = response.data.data
                            } else if (type === currencyType.TRANSACTION_CURRENCY) {
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
                    if (this.txnCurrency.rate && this.mCurrency.code && this.txnDate) {
                        let data = {
                            "id": this.txnCurrency.id ? this.txnCurrency.id : '',
                            "type": currencyType.TRANSACTION_CURRENCY,
                            "name": this.mCurrency.name,
                            "code": this.mCurrency.code,
                            "symbol": this.mCurrency.symbol,
                            "effectiveDate": this.txnDate,
                            "source": this.txnCurrency.source,
                            "method": 'Manual',
                            "rate": this.txnCurrency.rate,
                            "symbolNative": this.mCurrency.symbolNative
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
                                    this.loadCurrencyData(currencyType.TRANSACTION_CURRENCY)
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
            this.txnCurrency = {}
        },
        goEdit(e) {
            e.preventDefault()
            let grid = kendo.jQuery("#grid").data("kendoGrid")
            let dataItem = grid.dataItem($(e.currentTarget).closest("tr"))
            this.txnCurrency = dataItem
            this.mCurrency = dataItem
            this.txnDate = dataItem.effectiveDate
            this.dialog = true
        },
        formatEffectiveDate(dataItem) {
            if (dataItem.hasOwnProperty('effectiveDate')) {
                return kendo.toString(new Date(dataItem.effectiveDate), `${this.dateFormat}`)
            }
            return ''
        },
        formatCreatedAt(dataItem) {
            if (dataItem.hasOwnProperty('createdAt')) {
                return kendo.toString(new Date(dataItem.createdAt), `${this.dateFormat}`)
            }
            return ''
        },
    },
    mounted: async function () {
        await this.loadCurrencyData(currencyType.FUNCTIONAL_CURRENCY)
        await this.loadCurrencyData(currencyType.TRANSACTION_CURRENCY)
    }
}
</script>
<style scoped>
</style>
	