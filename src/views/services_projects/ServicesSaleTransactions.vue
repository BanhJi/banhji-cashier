<template>
    <v-row>
        <v-col sm="12" cols="12" class="pt-3">
            <v-card color="white" class="pl-2 no_border" elevation="0">

                <v-row>
                    <v-col sm="9" cols="12" class="py-0">
                        <app-searchdate :initStartDate="startDate" @emitStartDate="startDate = $event"
                                        :initEndDate="endDate" @emitEndDate="endDate = $event"/>
                    </v-col>

                    <v-col sm="1" cols="12" class="py-0 mt-1">
                        <v-btn class="btn_search" style="background-color: rgb(237, 241, 245)"
                               @click="searchTransaction('Cash Receipt')">
                            <i class="b-search" style="font-size: 18px; color:#fff !important;"/>
                        </v-btn>
                    </v-col>

                </v-row>
                <v-row class="mt-0">
                    <v-col sm="12" cols="12" class="py-0">
                        <template>
                            <LoadingMe
                                :isLoading="showLoading"
                                :fullPage="false"
                                type="loading"
                                :myLoading="true"/>
                            <kendo-datasource ref="productTxnDS"
                                              :group="group"
                                              :data="transactions"/>
                            <kendo-grid id="gridProductTXN" class="grid-function"
                                        :data-source-ref="'productTxnDS'"
                                        :sortable="false"
                                        :groupable="true"
                                        :filterable="false"
                                        :column-menu="true"
                                        :editable="false"
                                        :style="{width: '100%'}"
                                        :noRecords="true"
                                        :scrollable-virtual="true"
                            >
                                <kendo-grid-column
                                    :field="'type'"
                                    :title="$t('type')"
                                    :template="'<span>#=type#</span>'"
                                    :width="150"
                                    :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                <kendo-grid-column
                                    :field="'txnDate'"
                                    :title="$t('date')"
                                    :template="'<span>#=kendo.toString(new Date(txnDate), dateFormat)#</span>'"
                                    :width="150"
                                    :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                <kendo-grid-column
                                    :field="'name'"
                                    :title="$t('name')"
                                    :template="'<span>#=name#</span>'"
                                    :width="200"
                                    :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                <kendo-grid-column
                                    :field="'txnNumber'"
                                    :title="$t('reference_no')"
                                    :template="referenceTemplate"
                                    :width="200"
                                    :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                <kendo-grid-column
                                    :field="'itemName'"
                                    :title="$t('item')"
                                    :template="'<span>#=itemName || ``#</span>'"
                                    :width="150"
                                    :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                <kendo-grid-column
                                    :field="'uom'"
                                    :title="$t('txn_uom')"
                                    :template="UOMTemplate"
                                    :width="150"
                                    :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                <kendo-grid-column
                                    :field="'qty'"
                                    :title="$t('txn_qty')"
                                    :template="'<span>#=kendo.toString(qty, decimalFormat)#</span>'"
                                    :width="150"
                                    :attributes="{style: 'text-align: right'}"
                                    :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                <kendo-grid-column
                                    :field="'exchangePrice'"
                                    :title="$t('price')"
                                    :template="'<span>#=kendo.toString(exchangePrice, decimalFormat)#</span>'"
                                    :width="150"
                                    :attributes="{style: 'text-align: right'}"
                                    :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                <kendo-grid-column
                                    :field="'exchangeBAmount'"
                                    :title="$t('amount')"
                                    :template="'<span>#=kendo.toString(exchangeBAmount, decimalFormat)#</span>'"
                                    :width="180"
                                    :attributes="{style: 'text-align: right'}"
                                    :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>

                                <kendo-grid-column
                                    :field="'buom'"
                                    :title="$t('base_uom')"
                                    :template="BUOMTemplate"
                                    :width="150"
                                    :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>

                                <kendo-grid-column
                                    :field="'bQty'"
                                    :title="$t('base_qty')"
                                    :template="'<span>#=kendo.toString(bQty, decimalFormat)#</span>'"
                                    :width="150"
                                    :attributes="{style: 'text-align: right'}"
                                    :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                            </kendo-grid>
                        </template>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import SearchDateComponent from '@/components/custom_templates/SearchDate'
import LinkTemplate from "@/components/kendo_templates/LinkTemplate";
import kendo from "@progress/kendo-ui";
import ItemLineModel from "@/scripts/cash-receipt/model/ItemLine";

const billingHandler = require("@/scripts/invoice/handler/billingHandler")
const itemLineModel = new ItemLineModel({})
import {dataStore} from '@/observable/store'
const loanHandler = require("@/scripts/loanHandler")
export default {
    data: () => ({
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
        mDateSorter: 'Today',
        dateSorters: ['Today', 'This Week', 'This Month', 'This Year'],
        group: {field: 'itemName'},
        transactions: [],
        dateFormat: itemLineModel.dateFormat,
        showLoading: false,
        decimalFormat: 'n2',
    }),
    components: {
        'app-searchdate': SearchDateComponent,
        LoadingMe: () => import(`@/components/Loading`),
    },
    methods: {
        onSorterChanges(val) {
            let today = new Date()
            switch (val) {
                case "Today":
                    this.startDate = kendo.toString(today, 'yyyy-MM-dd')
                    this.endDate = kendo.toString(today, 'yyyy-MM-dd')

                    break
                case "This Week":
                    var first = today.getDate() - today.getDay(),
                        last = first + 6

                    this.startDate = kendo.toString(new Date(today.setDate(first)), 'yyyy-MM-dd')
                    this.endDate = kendo.toString(new Date(today.setDate(last)), 'yyyy-MM-dd')

                    break
                case "This Month":
                    this.startDate = kendo.toString(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd')
                    this.endDate = kendo.toString(new Date(today.getFullYear(), today.getMonth(), 31), 'yyyy-MM-dd')

                    break
                case "This Year":
                    this.startDate = kendo.toString(new Date(today.getFullYear(), 0, 1), 'yyyy-MM-dd')
                    this.endDate = kendo.toString(new Date(today.getFullYear(), 11, 31), 'yyyy-MM-dd')

                    break
                default:
                    this.startDate = ""
                    this.endDate = ""
            }
        },
        async searchTransaction() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.showLoading = true
                    const startDate = this.startDate
                    const endDate = this.endDate
                    let strFilter = '?start=' + startDate + '&end=' + endDate + '&item=0&group=1'
                    billingHandler.inventoryListByFunction(strFilter).then(res => {
                        if (res.data.statusCode === 200) {
                            this.transactions = res.data.data.filter((obj) => {
                                return obj.segmentId == this.segment.id
                            });
                        }
                        this.showLoading = false
                    })
                }, 10)
            })
        },
        referenceTemplate(data) {
            let url = `#`
            if (data.type === 'Invoice') {
                url = `invoice_view/${data.id}`
            } else if (data.type === 'Sale Quote') {
                url = `sale_quote_view/${data.id}`
            } else if (data.type === 'Delayed Invoice') {
                url = `delayed_invoice_view/${data.id}`
            } else if (data.type === 'Sale Order') {
                url = `sale_order_view/${data.id}`
            } else if (data.type === 'Purchase Order') {
                url = `purchase_order_view/${data.id}`
            } else if (data.type === 'Credit Memo') {
                url = `credit_memo_view/${data.id}`
            } else if (data.type === 'Debit Memo') {
                url = `debit_memo_view/${data.id}`
            } else if (data.type === 'Inventory Adjustment') {
                url = `inventory_adjustment_view/${data.id}`
            } else if (data.type === 'Purchase') {
                url = `credit_purchase_view/${data.id}`
            }

            let args = {
                text: data.txnNumber,
                url: url,
                data: data,
            }
            return {
                template: LinkTemplate,
                templateArgs: args
            }
        },
        UOMTemplate(dataItem) {
            if (dataItem.hasOwnProperty('uom')) {
                const uom = dataItem.uom
                if (uom.hasOwnProperty('uom')) {
                    if (uom.uom.hasOwnProperty('name')) {
                        return uom.uom.name
                    }
                }
            }
            return ``
        },
        BUOMTemplate(dataItem) {
            if (dataItem.hasOwnProperty('buom')) {
                const buom = dataItem.buom
                if (buom.hasOwnProperty('name')) {
                    return buom.name
                }
            }
            return ``
        },
        async loadSegment() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.segment = {}
                    loanHandler.businessSettingGet().then(res => {
                        this.showLoading = true
                        if (res.data.statusCode === 200) {
                            this.showLoading = false
                            let s = res.data.data.filter((obj) => {
                                return obj.type == dataStore.businessType
                            })
                            if (s.length > 0) {
                                this.segment = s[0].segment
                            } else {
                                this.$snotify.error('Please select segment on setting page')
                                this.cancel()
                            }
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 300)
            })
        },
    },
    computed: {},
    created: async function () {
        await this.loadSegment()
    },
};
</script>
<style scoped>
.k-chart {
    height: 180px;
}

.theme--light.v-data-table {
    background-color: transparent !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    height: 32px !important;
    border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr:first-child > td {
    border-top: thin solid rgba(0, 0, 0, 0.12) !important;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background-color: transparent !important;
}
</style>
