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

                <v-row class="mt-0">
                    <v-col sm="6" cols="12" class="pt-0">
                        <v-card
                            outlined
                            dense
                            class="pa-3 rounded-4 no_border white--text "
                            color="third"
                            height="60px"
                        >
                            <h3 class="text-left flex-1 font_13 text-uppercase">
                                {{ $t("invoices_to_be_collected") }}
                            </h3>
                            <h3 class="text-right flex-1 font_20">
                                {{ collectedInvoice }}
                            </h3>
                        </v-card>
                    </v-col>
                    <v-col sm="6" cols="12" class="pt-0">
                        <v-card
                            outlined
                            dense
                            class="pa-3 rounded-4 no_border white--text "
                            color="third"
                            height="60px"
                        >
                            <h3 class="text-left flex-1  font_12 text-uppercase">
                                {{ $t("total_collected_amount") }}
                            </h3>
                            <h3 class="text-right flex-1  font_20">
                                {{ numberFormat(collectedAmount) }}
                            </h3>
                        </v-card>
                    </v-col>
<!--                    <v-col sm="4" cols="12" class="pt-0">-->
<!--                        <v-card-->
<!--                            outlined-->
<!--                            dense-->
<!--                            class="pa-3 rounded-4 no_border white&#45;&#45;text "-->
<!--                            color="third"-->
<!--                            height="60px"-->
<!--                        >-->
<!--                            <h3 class="text-left flex-1  font_12 text-uppercase">-->
<!--                                {{ $t("overdue_invoice_collected") }}-->
<!--                            </h3>-->
<!--                            <h3 class="text-right flex-1 font_20">-->
<!--                                {{ collectedInvoiceOverDue }}-->
<!--                            </h3>-->
<!--                        </v-card>-->
<!--                    </v-col>-->
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
                                :hidden="true"
                                :column-menu="true"
                                :resizable="true"
                                :noRecords="true"
                                :scrollable-virtual="true"
                            >
                                <!--                                <kendo-grid-column-->
                                <!--                                    :field="'no'"-->
                                <!--                                    :title="$t('no')"-->
                                <!--                                    :template="rowNumberTmpl"-->
                                <!--                                    :width="90"-->
                                <!--                                    :column-menu="false"-->
                                <!--                                    :headerAttributes="{ style: 'background-color: #EDF1F5;', class: 'text-center'	}"-->
                                <!--                                    :attributes="{style: 'text-align: center'}"/>-->
                                <kendo-grid-column
                                    :field="'issuedDate'"
                                    :title="$t('receipt_date')"
                                    :width="180"
                                    :template="transactionDate"
                                    :headerAttributes="{ style: 'background-color: #EDF1F5' }"
                                />
                                <kendo-grid-column
                                    :field="'name'"
                                    :attributes="{ class: 'tb_name_td' }"
                                    :title="$t('name')"
                                    :width="200"
                                    :template="'<span>#=name#</span>'"
                                    :headerAttributes="{ style: 'background-color: #EDF1F5' }"
                                />
                                <kendo-grid-column
                                    :field="'txnReferenceNo'"
                                    :title="$t('invoice_number')"
                                    :width="200"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5, color: green !important',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'receiptReferenceNo'"
                                    :title="$t('receipt_number')"
                                    :width="200"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5, color: green !important',
                  }"
                                />
                                <kendo-grid-column
                                    :field="'txnExchangeAmount'"
                                    :title="$t('invoice_amount')"
                                    :width="200"
                                    :attributes="{ style: 'text-align: right; ' }"
                                    :template="
                    '<span>#= kendo.toString(txnExchangeAmount, decimalFormat)#</span>'
                  "
                                    :headerAttributes="{ style: 'background-color: #EDF1F5' }"
                                />
                                <kendo-grid-column
                                    :field="'exchangePaidAmount'"
                                    :title="$t('receipt_amount')"
                                    :width="200"
                                    :attributes="{ style: 'text-align: right; ' }"
                                    :template="
                    '<span>#= kendo.toString(exchangePaidAmount, decimalFormat)#</span>'
                  "
                                    :headerAttributes="{ style: 'background-color: #EDF1F5' }"
                                />
                                <kendo-grid-column
                                    :field="'exchangePenalty'"
                                    :title="$t('penalty')"
                                    :width="200"
                                    :hidden="true"
                                    :attributes="{ style: 'text-align: right; ' }"
                                    :template="
                    '<span>#= kendo.toString(exchangePenalty, decimalFormat)#</span>'
                  "
                                    :headerAttributes="{ style: 'background-color: #EDF1F5' }"
                                />
                                <kendo-grid-column
                                    :field="'exchangeDiscount'"
                                    :title="$t('discount')"
                                    :width="200"
                                    :hidden="true"
                                    :attributes="{ style: 'text-align: right; ' }"
                                    :template="
                    '<span>#= kendo.toString(exchangeDiscount, decimalFormat)#</span>'
                  "
                                    :headerAttributes="{ style: 'background-color: #EDF1F5' }"
                                />
<!--                                <kendo-grid-column-->
<!--                                    :field="'gainOrLoss'"-->
<!--                                    :title="$t('gain_or_loss')"-->
<!--                                    :width="200"-->
<!--                                    :attributes="{ style: 'text-align: right; ' }"-->
<!--                                    :template="-->
<!--                    '<span>#= kendo.toString(gainOrLoss, decimalFormat)#</span>'-->
<!--                  "-->
<!--                                    :headerAttributes="{ style: 'background-color: #EDF1F5' }"-->
<!--                                />-->
                                <kendo-grid-column
                                    :field="'paymentOption'"
                                    :title="$t('source')"
                                    :width="200"
                                    :headerAttributes="{
                    style: 'background-color: #EDF1F5, color: green !important',
                  }"
                                />
<!--                                <kendo-grid-column-->
<!--                                    :field="'bankReferenceNo'"-->
<!--                                    :title="$t('bank_reference_no')"-->
<!--                                    :width="200"-->
<!--                                    :template="'<span>#= bankReferenceNo#</span>'"-->
<!--                                    :headerAttributes="{-->
<!--                    style: 'background-color: #EDF1F5, color: green !important',-->
<!--                  }"-->
<!--                                />-->
                                <kendo-grid-column
                                    :field="'memo'"
                                    :title="$t('memo')"
                                    :width="200"
                                    :template="'<span>#= memo #</span>'"
                                    :headerAttributes="{ style: 'background-color: #EDF1F5' }"
                                />
                                <kendo-grid-column
                                    :title="$t('action')"
                                    :width="200"
                                    :attributes="{class: 'btn-int'}"
                                    :command="{ iconClass: 'k-icon', text: 'Print', click: printForm, class: 'btn-plus' }"
                                    :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                />
                            </kendo-grid>
                        </template>
                    </v-col>
                </v-row>
                <v-dialog v-model="showPrint" max-width="1000px">
                    <template v-slot:activator="{ on }">
                    </template>
                    <v-form ref="form" lazy-validation>
                        <v-card>
                            <v-card-title>{{ $t('print_receipt') }}</v-card-title>
                            <v-icon class="btn_close" @click="showPrint = false">close</v-icon>
                            <v-divider/>
                            <v-card-text
                                style="background-color: #EDF1F5; color: #333333;">
                                <div id="invoiceContent" style="margin-bottom: 15px;page-break-after: always;">
                                    <div class="invoice-pcg" >
                                        <div class="invoicepcg-header" style="border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 10px;position: relative;overflow: hidden;">
                                            <div style="overflow: hidden; width: 15%; float: left;">
                                                <img style="text-align: center; width: 80%; margin-bottom: 10px;" v-bind:src="company.logoUrl" />
                                            </div>
                                            <div style="width: 75%; float: left; text-align: center;">
                                                <h1 style="margin: 0px;font-family: 'Moul', Arial!important;font-size: 35px;line-height: 60px;">{{company.name}}</h1>
                                                <h2 style="text-transform: uppercase; margin: 0;float: none;width: 100%; font-size:28px; font-weight: bold;text-align: center;">{{company.legalName}}</h2>
                                                <div style="width: 100%; float: left; margin-top: 15px;">
                                                    <p style="margin-bottom: 8px;font-size: 14px; font-weight: bold;">{{company.companyAddress}}</p>
                                                    <p style="font-size: 14px; font-weight: bold;">Tel: {{company.companyPhone}}</p>
                                                </div>
                                                <div style="width: auto;position: absolute;right: 0;border: 1px solid #333; padding: 4px;">
                                                    <p style="margin: 0;">បង់ប្រាក់រួចមិនអាចដកវិញបាន</p>
                                                    <p style="margin: 0;font-style: italic">Nonerefundable</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="invoicepcg-content" style="margin-bottom: 20px;">
                                            <div style="position: relative;overflow: hidden;min-height: 75px;">
                                                <div style="position: absolute; overflow: hidden; left: 0;top: 0;">
                                                    <!--                                                        <img :src="barcode" style="height:75px;margin-top:3px;width: 250px;" />-->
                                                    <barcode
                                                        :value="txnPrint.connectId"
                                                        type="code128"
                                                        :width="310"
                                                        :height="60"
                                                        renderAs="svg"
                                                    >
                                                    </barcode>
                                                </div>
                                                <div style="width: 100%; float: left; text-align: center;">
                                                    <h2 style="width: 100%;"><span style="font-size: 20px;font-family: 'Moul', Arial!important;color: #000;font-style: normal;">បង្កាន់ដៃបង់ប្រាក់</span> / <span style="text-transform: uppercase;color: #000;font-style: normal;font-weight: bold; font-size: 18px;">receipt</span></h2>
                                                </div>
                                                <div style="position: absolute; right: 0; top: 0;">
                                                    <table style="width: 100%; border: none; margin-bottom: 0">
                                                        <tr>
                                                            <td style="border: none;line-height: 17px;">លេខបង្កាន់ដៃ : </td>
                                                            <td style="border: none;">{{txnPrint.number}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="border: none;line-height: 17px;">កាលបរិច្ឆេទ : </td>
                                                            <td style="border: none;">{{kendo.toString(new Date(txnPrint.issuedDate), "dd, M, yyyy h:mm:ss tt")}}</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                            <div >
                                                <table style="width:100%; border: none;">
                                                    <tr style="line-height: 50px;">
                                                        <td style="border: none; vertical-align: top;width: 25%">ឈ្មោះ : {{txnPrint.name}}</td>
                                                        <td style="border: none; vertical-align: top;width: 25%">ឈ្មោះឡាតាំង : <span style="text-transform: uppercase;">{{txnPrint.otherName}}</span></td>
                                                        <td style="border: none; vertical-align: top;width: 25%">ភេទ : {{ txnPrint.gender != 'male' ? 'ស្រី' : 'ប្រុស'}}</td>
                                                        <td style="border: none; vertical-align: top;width: 25%">វិធីសាស្រ្តទូទាត់ : {{txnPrint.paymentMethod}}</td>

                                                    </tr>
                                                </table>
                                            </div>
                                            <div >
                                                <table style="width:100%; border: none;">
                                                    <thead>
                                                    <tr style="padding: 10px; line-height: 50px; background: #ccc; background-color: #ccc!important;">
                                                        <th style="width: 15%; line-height: 50px;">លេខកូដទូទាត់</th>
                                                        <th style="width: 45%; line-height: 50px;">ពិពណ៍នា</th>
                                                        <th style="width: 15%; line-height: 50px;">ចំនួនត្រូវទូទាត់</th>
                                                        <th style="width: 15%; line-height: 50px;">ចំនួនទទួល</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td style="padding: 5px;text-align: left;">{{txnPrint.paymentCode}}</td>
                                                        <td style="padding: 5px;text-align: left;">{{txnPrint.transactionNote}}</td>
                                                        <td style="padding: 5px;text-align: right;">{{ kendo.toString(txnPrint.amountTobePaid, 'n2')}} {{txnPrint.currencyCode}}</td>
                                                        <td style="padding: 5px;text-align: right;">{{ kendo.toString(txnPrint.paidAmount, 'n2')}} {{txnPrint.currencyCode}}</td>
                                                    </tr>
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <td colspan="2" style="padding: 5px;text-align: right;"><b>សរុប : </b></td>
                                                        <td style="padding: 5px;text-align: right;"><b>{{ kendo.toString(txnPrint.amountTobePaid, 'n2')}} {{txnPrint.currencyCode}}</b></td>
                                                        <td style="padding: 5px;text-align: right;"><b>{{ kendo.toString(txnPrint.paidAmount, 'n2')}} {{txnPrint.currencyCode}}</b></td>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="invoicepcg-footer" style="overflow: hidden;margin-top: 40px;clear:both;">
                                            <div style="float: right; width: 100%; ">
                                                <p style="float: left;">
                                                    <span >អ្នករៀបចំបង្កាន់ដៃ : </span>
                                                    <span style="margin-left: 10px;">{{loggedUser.name}}</span>
                                                </p>
                                                <p style="float: right;">
                                                    <span >ហត្ថលេខា</span>
                                                    <span style="margin-left: 10px;">..............................................</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-card-text>
                            <v-divider/>
                            <v-card-actions class="pa-4">
                                <v-row>
                                    <v-col sm="6" cols="6" class="py-0">
                                        <v-btn color="black"
                                               outlined
                                               class=" text-capitalize  black--text float-left"
                                               @click="showPrint = false">{{ $t('cancel') }}
                                        </v-btn>
                                    </v-col>
                                    <v-col sm="6" cols="6" class="py-0">
                                        <v-btn color="secondary"
                                               class="px-3  white--text text-capitalize float-right"
                                               @click="printHtml">
                                            {{ $t('print') }}
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-actions>
                        </v-card>
                    </v-form>
                </v-dialog>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import SearchDateComponent from "@/components/custom_templates/SearchDate";
import LinkTemplate from "@/components/kendo_templates/LinkTemplate";
import kendo from "@progress/kendo-ui";
import ItemLineModel from "@/scripts/cash-receipt/model/ItemLine";

// const billingHandler = require("@/scripts/invoice/handler/billingHandler");
const itemLineModel = new ItemLineModel({});
const sessionHandler = require("@/scripts/session/handler/sessionHandler")
const cookieJS = require("@/cookie.js");
const cookie = cookieJS.getCookie()
const $ = kendo.jQuery
const instituteHandler = require("@/scripts/instituteHandler")
const store = require("@/institute.js");
const { instituteId } = store.default.state.cookies;
import { Barcode } from '@progress/kendo-barcodes-vue-wrapper';

export default {
    data: () => ({
        showPrint: false,
        kendo: kendo,
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
        txnPrint: {},
        company: {},
        loggedUser: {
            id: cookie.creator,
            name: cookie.user['custom:firstName'] + ' ' + cookie.user['custom:lastName'],
            username: cookie.email
        },
    }),
    components: {
        "app-searchdate": SearchDateComponent,
        LoadingMe: () => import(`@/components/Loading`),
        'barcode': Barcode
    },
    methods: {
        numberFormat(value) {
            return kendo.toString(value, `${this.decimalFormat}`);
        },
        transactionDate(dataItem) {
            return kendo.toString(
                new Date(dataItem.issuedDate),
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
        onClickLink(data){
            window.console.log(data,' dddd')
        },
        async searchTransaction() {
            // new Promise((resolve) => {
            //     setTimeout(() => {
            //         resolve("resolved");
            //         this.showLoading = true;
            //         let startDate = this.startDate;
            //         let endDate = this.endDate;
            //         let strFilter = "";
            //
            //         if (type !== "" && startDate !== "" && endDate !== "") {
            //             strFilter =
            //                 "?start=" + startDate + "&end=" + endDate + "&type=" + type;
            //         } else {
            //             startDate = "";
            //             endDate = "";
            //             strFilter = "?start=" + "&end=" + "&type=" + type;
            //         }
            //
            //         billingHandler.txn(strFilter).then((res) => {
            //             if (res.data.statusCode === 200) {
            //                 this.transactions = res.data.data;
            //                 if (this.transactions.length > 0) {
            //                     const results = res.data.result;
            //                     this.decimalFormat = res.data.data[0].decimalFormat || "n2";
            //                     this.collectedAmount = results.cash || 0;
            //                     const inv = results.invoice;
            //                     this.collectedInvoice = inv.total || 0;
            //                     this.collectedInvoiceOverDue = inv.overDue || 0;
            //                 }
            //             }
            //             this.showLoading = false;
            //         });
            //     }, 100);
            // });
            this.showLoading = true;
            window.console.log(this.startDate, this.endDate, 'sd')
            if(this.startDate == '' || this.endDate == ''){
                this.$snotify.error('Please check date')
                return
            }
            let startDate = kendo.toString(this.startDate, 'yyyy-MM-dd') + ' 00:00:00'
            let endDate = kendo.toString(this.endDate, 'yyyy-MM-dd') + ' 23:59:59'
            let data = {
                startDate: cookie.email + '#' + Date.parse(startDate),
                endDate: cookie.email + '#' + Date.parse(endDate),
            }
            this.transactions = []
            sessionHandler.collectionReport(data).then((res) => {
                if (res.data.statusCode === 200) {
                    let transactions = [];
                    window.console.log(transactions, 'txn')
                    if (res.data.data.length > 0) {
                        this.decimalFormat = "n2";
                        let total = 0
                        res.data.data.forEach(el => {
                            total += parseFloat(el.paidAmount)
                            transactions.push({
                                issuedDate: el.issuedDate,
                                name: el.printObj.customer.name,
                                txnReferenceNo: el.printObj.invoiceNumber,
                                receiptReferenceNo: el.printObj.number,
                                txnExchangeAmount: el.amountTobePaid,
                                exchangePaidAmount: el.paidAmount,
                                exchangePenalty: el.printObj.penalty,
                                exchangeDiscount: el.printObj.discount,
                                paymentOption: el.printObj.paymentMethod,
                                memo: el.printObj.transactionNote,
                                decimalFormat: "n2",
                                printObj: el.printObj
                            })
                        })
                        this.transactions = transactions

                        this.collectedAmount = total;
                        this.collectedInvoice = res.data.data.length || 0;
                        window.console.log(total, transactions, this.collectedAmount, 'after txn')
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
        printForm(e){
            e.preventDefault();
            const grid = $("#gridCollection").data("kendoGrid"),
                dataItem = grid.dataItem($(e.currentTarget).closest("tr"))
            window.console.log(dataItem)
            this.txnPrint = dataItem.printObj
            this.showPrint = true
        },
        printHtml(){
            window.console.log('is print')
            var  Win;
            Win = window.open('', '', 'width=1048, height=900');
            // pHeight = "210mm";
            // pWidth = "150mm";
            var printableContent = '',
                win = Win,
                doc = win.document.open();
            var htmlStart =
                '<!DOCTYPE html>' +
                '<html>' +
                '<head>' +
                '<meta charset="utf-8" />' +
                '<title></title>' +
                '<link href="https://raw.githubusercontent.com/choeun88/css/main/kendo.common.min.css" rel="stylesheet" type="text/css">'+
                '<link href="https://raw.githubusercontent.com/choeun88/css/main/spa.css" rel="stylesheet" type="text/css">'+
                '<link href="https://fonts.googleapis.com/css?family=Content:400,700" rel="stylesheet" type="text/css">'+
                '<link href="https://fonts.googleapis.com/css?family=Moul" rel="stylesheet">' +
                '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
                '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
                '<link href="https://fonts.googleapis.com/css2?family=Hanuman:wght@300&display=swap" rel="stylesheet">'+
                '<link href="https://fonts.googleapis.com/css?family=Preahvihear" rel="stylesheet">'+
                '<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Battambang&amp;subset=khmer" media="all">'+
                '<link href="https://fonts.googleapis.com/css?family=Roboto+Slab:300" rel="stylesheet">' +
                '<style>' +
                '*{font-family: \'Hanuman\', Arial;}' +
                'table, th, td {' +
                '  border: 1px solid black;' +
                '  border-collapse: collapse;' +
                '}</style>'
            '<style type="text/css" media="print">' +
            '@page { size: landscape; margin:0.05cm;' +
            '} '+
            '@media print {' +
            'html, body {' +
            '}' +
            '.main-color {' +
            '-webkit-print-color-adjust:exact; ' +
            '} ' +
            '}' +
            '* {' +
            '-webkit-print-color-adjust:exact; ' +
            '} ' +
            '.inv1 .light-blue-td { ' +
            'background-color: #c6d9f1!important;' +
            'text-align: left;' +
            'padding-left: 5px;' +
            '-webkit-print-color-adjust:exact; ' +
            '}' +
            '.logoP{ max-height 50px;max-width100px}' +
            '.inv1 thead tr {'+
            'background-color: rgb(242, 242, 242)!important;'+
            '-webkit-print-color-adjust:exact; ' +
            '}'+
            '.pcg .mid-title div {}' +
            '.pcg .mid-header {' +
            'background-color: #dce6f2!important; ' +
            '-webkit-print-color-adjust:exact; ' +
            '}'+
            '.winvoice-print table thead .darkbblue, .winvoice-print table tbody td.darkbblue { ' +
            'background-color: #355176!important;' +
            'color: #fff!important;' +
            '-webkit-print-color-adjust:exact; ' +
            '}' +
            '.winvoice-print table td.greyy {' +
            'background-color: #ccc!important;-webkit-print-color-adjust:exact;' +
            '}' +
            '.inv1 span.total-amount { ' +
            'color:#fff!important;' +
            '}</style>' +
            '</head>' +
            '<body><div class="row-fluid" ><div id="invoicecontent" style="background: none!important;color: #000!important;" class="k-content document-body">';
            var htmlEnd =
                '</div></div></body>' +
                '</html>';
            printableContent = $('#invoiceContent').html();
            doc.write(htmlStart + printableContent + htmlEnd);
            doc.close();
            setTimeout(function(){
                win.print();
                win.close();
            },1000);
        },
        async loadInstituteInfo() {
            instituteHandler.getOneCompany(instituteId).then((res) => {
                this.company = res;
                window.console.log(this.company, 'company')
            });
            sessionHandler.getImage(instituteId, cookie.creator).then((res) => {
                window.console.log(res, 'image')
                let a = res.filter((obj) => {return obj.isPrimary == 1})
                if(a.length > 0){
                    this.company.logoUrl = a[0].url
                }
            });
        },
    },
    computed: {},
    created: async function () {
        await this.loadInstituteInfo()
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
