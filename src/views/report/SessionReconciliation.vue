<template>
    <v-row>
        <v-col sm="12" cols="12" class="grayBg px-6">
            <v-card color="white" class="pa-3 no_border" elevation="0">
                <v-row>
                    <v-col sm="12" cols="12" class="py-0">
                        <!-- <h2 class="mb-1 font_20">{{ $t("customer_receipt_report") }}</h2> -->
                        <p class="mb-0">{{ $t("collection_management_desc") }}</p>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col sm="9" cols="12" class="py-0">
                        <app-searchdate
                            :initStartDate="startDate"
                            @emitStartDate="startDate = $event"
                            :initEndDate="endDate"
                            @emitEndDate="endDate = $event"
                        />
                    </v-col>

                    <v-col sm="1" cols="12" class="py-1">
                        <v-btn
                            class="btn_search"
                            style="background-color: rgb(237, 241, 245)"
                            @click="searchTransaction()"
                        >
                            <i
                                class="b-search"
                                style="font-size: 18px; color:#fff !important;"
                            />
                        </v-btn>
                    </v-col>
                    <!-- <v-col sm="2" cols="12" class="py-0 text-right">
                                <v-btn icon color="black" class="bg-none float-right ">
                                  <v-icon class="font_34">fa fa-file-excel</v-icon>
                                </v-btn>
                                <v-btn icon color="black" class="bg-none float-right ml-2">
                                  <v-icon class="font_34">fa fa-print</v-icon>
                                </v-btn>
                              </v-col> -->
                </v-row>
                <v-row>
                    <v-col sm="12" cols="12" class="py-0">
                        <template>
                            <LoadingMe
                                :isLoading="showLoading"
                                :fullPage="false"
                                :myLoading="true"
                                type="loading"
                                :alertMessage="loadingAlert"
                                :color="loadingColorAlert"
                                :alertText="loadingTextAlert"
                            />
                            <kendo-datasource
                                ref="gridCollectionDS"
                                :type="'JSON'"
                                :data="transactions"
                                :group="group"
                                :server-paging="false"
                            />
                            <kendo-grid
                                id="gridCollection"
                                class="grid-function"
                                :data-source-ref="'gridCollectionDS'"
                                :editable="false"
                                :groupable="true"
                                :column-menu="true"
                                :resizable="true"
                                :noRecords="true"

                                :sortable="true"
                                :excel-file-name="$t('session_reconciliation_report')+'.xlsx'"
                                :excel-filterable="true"
                                :excel-all-pages="true"
                                :toolbar="['excel']"

                                :scrollable-virtual="true"
                            >
                                <kendo-grid-column
                                    :field="'user'"
                                    :title="$t('cahsier')"
                                    :width="200"
                                    :headerAttributes="{ style: 'background-color: #EDF1F5, color: green !important' }"
                                    :attributes="{style: 'text-align: left; '}"
                                />
                                <kendo-grid-column
                                    :field="'number'"
                                    :title="$t('number')"
                                    :width="200"
                                    :headerAttributes="{ style: 'background-color: #EDF1F5, color: green !important' }"
                                    :attributes="{style: 'text-align: left; '}"
                                />
                                <kendo-grid-column
                                    :field="'startDate'"
                                    :title="$t('start')"
                                    :template="'<span>#= kendo.toString(new Date(startDate), `yyyy-MM-dd H:m:s`) #</span>'"
                                    :headerAttributes="{ style: 'background-color: #EDF1F5, color: green !important' }"
                                    :attributes="{style: 'text-align: left; '}"
                                />
                                <kendo-grid-column
                                    :field="'endDate'"
                                    :title="$t('end')"
                                    :template="'<span>#= endDate != `` ? kendo.toString(new Date(endDate), `yyyy-MM-dd H:m:s`) : ``#</span>'"
                                    :headerAttributes="{ style: 'background-color: #EDF1F5, color: green !important' }"
                                    :attributes="{style: 'text-align: left; '}"
                                />
                                <kendo-grid-column
                                    :field="'endingBalance'"
                                    :title="$t('ending_balance')"
                                    :template="'<span>#= kendo.toString(endingBalance, format)#</span>'"
                                    :headerAttributes="{ style: 'background-color: #EDF1F5, color: green !important' }"
                                    :attributes="{style: 'text-align: right; '}"
                                />
                                <kendo-grid-column
                                    :field="'actualAmount'"
                                    :title="$t('actual_amount')"
                                    :template="'<span>#= kendo.toString(actualAmount, format)#</span>'"
                                    :headerAttributes="{ style: 'background-color: #EDF1F5, color: green !important' }"
                                    :attributes="{style: 'text-align: right; '}"
                                />
                                <kendo-grid-column
                                    :field="'variance'"
                                    :title="$t('variance')"
                                    :template="'<span>#= kendo.toString(variance, format)#</span>'"
                                    :headerAttributes="{ style: 'background-color: #EDF1F5, color: green !important' }"
                                    :attributes="{style: 'text-align: right; '}"
                                />
                            </kendo-grid>
                        </template>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import SearchDateComponent from "@/components/custom_templates/SearchDate";
import LinkTemplate from "@/components/kendo_templates/LinkTemplate";
import kendo from '@progress/kendo-ui';
import {i18n} from '@/i18n';
import ItemLineModel from "@/scripts/cash-receipt/model/ItemLine";

const sessionHandler = require("@/scripts/session/handler/sessionHandler")
const itemLineModel = new ItemLineModel({});
const cookieJS = require("@/cookie.js");
const cookie = cookieJS.getCookie()
const store = require("@/institute.js");
const { instituteId } = store.default.state.cookies
const saleFormContentHandler = require("@/scripts/saleFormContentHandler")
import JSZip from "jszip";
window.JSZip = JSZip;
export default {
    data: () => ({
        startDate: new Date(),
        endDate: new Date(),
        group: {field: "name"},
        transactions: [],
        dateFormat: itemLineModel.dateFormat,
        showLoading: false,
        loadingAlert: false,
        loadingColorAlert: "",
        loadingTextAlert: "",
        collectedAmount: 0,
        collectedInvoice: 0,
        collectedInvoiceOverDue: 0,
        decimalFormat: "n2",
        saleFormContent: {}
    }),
    components: {
        "app-searchdate": SearchDateComponent,
        LoadingMe: () => import(`@/components/Loading`)
    },
    methods: {
        numberFormat(value) {
            return kendo.toString(value, `${this.decimalFormat}`);
        },
        transactionDate(dataItem) {
            return kendo.toString(
                new Date(dataItem.transactionDate),
                `${this.dateFormat}`
            );
        },
        goToConvert() {
        },
        source(dataItem) {
            if (dataItem.hasOwnProperty("paymentOption")) {
                if (dataItem.paymentOption.hasOwnProperty("name")) {
                    return dataItem.paymentOption.name;
                }
            }
            return "";
        },
        rowNumberTmpl(dataItem) {
            let ds = this.$refs.gridCollectionDS.kendoWidget(),
                index = ds.indexOf(dataItem);
            return index + 1;
        },
        receiptRefTemplate(data) {
            let url = `cash_receipt/${data.id}`;
            let args = {
                text: data.receiptReferenceNo,
                url: url,
                data: data,
            };
            return {
                template: LinkTemplate,
                templateArgs: args,
            };
        },
        invoiceRefTemplate(data) {
            let url = `invoice_view/${data.txnId}`;
            let args = {
                text: data.txnReferenceNo,
                url: url,
                data: data,
            };
            return {
                template: LinkTemplate,
                templateArgs: args,
            };
        },
        async searchTransaction() {
            this.showLoading = true;
            window.console.log(this.startDate, this.endDate, 'sd')
            if(this.startDate == '' || this.endDate == ''){
                this.$snotify.error('Please check date')
                return
            }
            let startDate = kendo.toString(this.startDate, 'yyyy-MM-dd') + ' 00:00:00'
            let endDate = kendo.toString(this.endDate, 'yyyy-MM-dd') + ' 23:59:59'
            let data = {
                startDate: 'recon#' + cookie.email + '#' + instituteId + '#' + Date.parse(startDate),
                endDate: 'recon#' + cookie.email + '#' + instituteId + '#' + Date.parse(endDate),
            }
            this.transactions = []
            sessionHandler.sessionTxnReport(data).then((res) => {
                if (res.data.statusCode === 200) {
                    let transactions = [];
                    if (res.data.data.length > 0) {
                        res.data.data.forEach(e => {
                            transactions.push({
                                user: e.user.name,
                                number: e.number,
                                startDate: e.session.startDate,
                                endDate: e.endingBalanceDate,
                                endingBalance: e.endingBalance,
                                actualAmount: e.actualAmount,
                                variance: e.varianceAmount,
                                format: 'n' + this.saleFormContent.decimal
                            })
                        })
                        this.transactions = transactions
                    }
                }
                this.showLoading = false;
            });
        },
        status(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty("status")) {
                    const status = dataItem.status;
                    let statusText = "";
                    switch (status) {
                        case 1:
                            statusText = "OPEN";
                            break;
                        case 2:
                            statusText = "Partially Paid";
                            break;
                        case 4:
                            statusText = "VOID";
                            break;
                        case 3:
                            statusText = "PAID";
                            break;
                    }
                    return statusText;
                }
            }
            return "";
        },
        statusTmpl(dataItem) {
            let st = i18n.t('open')
            if(parseInt(dataItem.status) == 2){
                st = i18n.t('reconciled')
            }
            return st
        },
        async loadSaleFormContent() {
            saleFormContentHandler.list().then(res => {
                if (res.data.statusCode === 200) {
                    const data = res.data.data
                    if (data.length > 0) {
                        this.saleFormContent = data[0]
                    }
                }
            })
        },
    },
    computed: {},
    mounted() {
        this.loadSaleFormContent()
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

.theme--light.v-data-table
> .v-data-table__wrapper
> table
> tbody
> tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background-color: transparent !important;
}

.b-search:before {
    color: #fff !important;
}
</style>
