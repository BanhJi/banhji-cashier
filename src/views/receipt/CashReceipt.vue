<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col sm="12" cols="12">
                    <v-card outlined dense class="pa-4 no_border rounded-sm" color="white">
                        <v-row>
                            <v-col class="bigSide py-0" sm="12" cols="12" style="transition: .3s ease-in;"
                                   :class="{'hide_big_bar_class':isHideBar}">
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-card outlined dense class="no_border">
                                        <h2 class="mb-0">{{ $t('cash_receipt') }} #{{ cashReceipt.referenceNo }}</h2>
                                        <v-icon v-if="!isHideBar"
                                                @click="cancel()"
                                                style="cursor: pointer; color: #333; font-size: 40px;"
                                                class="float-right"
                                        >close
                                        </v-icon>
                                        <!--                                        <span style="transition: .3s ease-in; z-index:10;"-->
                                        <!--                                              :class="{'iconArrow': !isHideBar,'iconArrowHide': isHideBar }">-->
                                        <!--                                            <v-icon size="22"-->
                                        <!--                                                    class="arr_icon"-->
                                        <!--                                                    @click="hideSmallSidebar"-->
                                        <!--                                                    v-if="isHideBar"> mdi-chevron-left-circle-->
                                        <!--                                            </v-icon>-->
                                        <!--                                            <v-icon size="22"-->
                                        <!--                                                    class="arr_icon"-->
                                        <!--                                                    @click="hideSmallSidebar"-->
                                        <!--                                                    v-if="!isHideBar"> mdi-chevron-right-circle-->
                                        <!--                                            </v-icon></span>-->
                                    </v-card>
                                    <v-card outlined dense class="px-3 no_border" color="grayBg" height="175px">
                                        <v-row>
                                            <v-col sm="7" cols="12" class="pb-0">
                                                <label class="label">{{ $t('select_option') }}</label>
                                                <v-select class="mt-1"
                                                          v-model="mPaymentOption"
                                                          :items="paymentOptions"
                                                          @change="searchOptionChanged"
                                                          :placeholder="$t('search')"
                                                          outlined>
                                                </v-select>

                                                <v-row class="pt-3" v-if="!showMe">
                                                    <v-col cols="10" class="pr-1">
                                                        <v-text-field
                                                            class=""
                                                            v-model="search"
                                                            outlined
                                                            :placeholder="$t('search')"
                                                        />
                                                    </v-col>
                                                    <v-col cols="2" class="pl-1">
                                                        <v-btn color="primary white--text" @click="searchInvoice">
                                                            <i class="b-search"
                                                               style="font-size: 18px; color:#fff !important;"/>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="pt-3" v-if="showMe">
                                                    <v-col cols="10" class="kendo_dropdown_custom mt-2 pb-3 pt-0 pr-0">
                                                        <dropdownlist
                                                            :data-items="customers"
                                                            @change="onCustomerChanged"
                                                            :value="mCustomer"
                                                            :data-item-key="'id'"
                                                            :text-field="'name'"
                                                            :default-item="defaultItem"
                                                            :filterable="true"
                                                            @filterchange="onCustomerFilterChanged">
                                                        </dropdownlist>
                                                    </v-col>
                                                    <v-col cols="2" class="pl-1">
                                                        <v-btn color="primary white--text" @click="searchInvoice">
                                                            <i class="b-search"
                                                               style="font-size: 18px; color:#fff !important;"/>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <v-col sm="5" cosl="12">
                                                <label class="label">{{ $t('date') }}</label>
                                                <app-datepicker :initialDate="cashReceipt.transactionDate"
                                                                :disabled="disabledMe"
                                                                @onChanged="onTransactionDateChanged"
                                                                @emitDate="cashReceipt.transactionDate = $event"/>
                                                <label class="label">{{ $t('customer_name') }}</label>
                                                <v-text-field
                                                    class="mt-1"
                                                    v-model="name"
                                                    readonly="readonly"
                                                    outlined
                                                />
                                                <v-row>
                                                    <v-col sm="6" cols="12" class="py-0">


                                                    </v-col>
                                                    <!--                                                    <v-col sm="6" cols="12" class="py-0">-->
                                                    <!--                                                        <div class="d-flex justify-space-between">-->
                                                    <!--                                                            <div>-->
                                                    <!--                                                                <p class="label mb-0">{{ $t('currency') }}</p>-->
                                                    <!--                                                                <p class="label mb-0">{{ currencyCode }}</p>-->
                                                    <!--                                                            </div>-->
                                                    <!--                                                            <div>-->
                                                    <!--                                                                <p class="label mb-0">{{ $t('rate') }}</p>-->
                                                    <!--                                                                <p class="label mb-0">{{ transactionRate }}</p>-->
                                                    <!--                                                            </div>-->
                                                    <!--                                                        </div>-->
                                                    <!--                                                    </v-col>-->
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                    </v-card>

                                    <v-row class="pt-3" style="background-color: #fff;">
                                        <v-col sm="12" cols="12" class="pt-0">
                                            <LoadingMe
                                                :isLoading="showLoading"
                                                :fullPage="false"
                                                :myLoading="true"
                                                :alertMessage="loadingAlert"
                                                :color="loadingColorAlert"
                                                :alertText="loadingTextAlert"/>
                                            <kendo-datasource ref="cashReceiptItemLineDS"
                                                              :change="dataSourceChanged"
                                                              :data="itemLines"/>
                                            <kendo-grid id="gridCashReceipt" class="grid-function"
                                                        :data-source-ref="'cashReceiptItemLineDS'"
                                                        :sortable="false"
                                                        :groupable="false"
                                                        :filterable="false"
                                                        :column-menu="true"
                                                        :resizable="true"
                                                        :editable="true"
                                                        :noRecords="true">
                                                <!--                                                <kendo-grid-column-->
                                                <!--                                                    :title="$t('no.')"-->
                                                <!--                                                    :width="55"-->
                                                <!--                                                    :column-menu="false"-->
                                                <!--                                                    :template="rowNumberTmpl"-->
                                                <!--                                                    :headerAttributes="{-->
                                                <!--                                                                    style: 'background-color: #EDF1F5;',-->
                                                <!--                                                                    class: 'text-products'-->
                                                <!--                                                                }"-->
                                                <!--                                                    :attributes="{-->
                                                <!--                                                                    style: 'text-align: products'-->
                                                <!--                                                                }"/>-->
                                                <!--                        <kendo-grid-column-->
                                                <!--                            :field="'check'"-->
                                                <!--                            :title="''"-->
                                                <!--                            :headerTemplate="headerTemplate"-->
                                                <!--                            :template="checkTemplate"-->
                                                <!--                            :width="60"-->
                                                <!--                            :column-menu="false"-->
                                                <!--                            :editable="()=>{ return false}"-->
                                                <!--                            :locked="true"-->
                                                <!--                            :headerAttributes="{ style: 'background-color: #EDF1F5;', class: 'text-center'	}"-->
                                                <!--                            :attributes="{style: 'text-align: center'}"/>-->
                                                <kendo-grid-column
                                                    :field="'referenceNo'"
                                                    :title="$t('invoice_no')"
                                                    :width="200"
                                                    :editable="()=>{ return false}"
                                                    :template="referenceNoTmp"
                                                    :locked="true"
                                                    :headerAttributes="{
                                                                    style: 'background-color: #EDF1F5'
                                                                }"/>
                                                <kendo-grid-column
                                                    :field="'crn'"
                                                    :title="$t('crn')"
                                                    :width="100"
                                                    :template="crnTmp"
                                                    :hidden="true"
                                                    :editable="()=>{ return false}"
                                                    :locked="true"
                                                    :headerAttributes="{
                                                                    style: 'background-color: #EDF1F5'
                                                                }"/>
                                                <kendo-grid-column
                                                    :field="'paymentCode'"
                                                    :title="$t('payment_code')"
                                                    :width="180"
                                                    :template="paymentCodeTmp"
                                                    :editable="()=>{ return false}"
                                                    :locked="true"
                                                    :lockable="false"
                                                    :headerAttributes="{
                                                                    style: 'background-color: #EDF1F5'
                                                                }"/>
                                                <kendo-grid-column
                                                    :field="'dueDate'"
                                                    :title="$t('due_date')"
                                                    :width="150"
                                                    :lockable="false"
                                                    :template="formatDate"
                                                    :editable="()=>{ return false}"
                                                    :headerAttributes="{
                                                                    style: 'background-color: #EDF1F5'
                                                                }"/>
                                                <kendo-grid-column
                                                    :field="'txnNote'"
                                                    :title="$t('note')"
                                                    :width="200"
                                                    :editable="()=>{ return false}"
                                                    :hidden="true"
                                                    :lockable="false"
                                                    :headerAttributes="{ style: 'text-align: left; background-color: #EDF1F5',}"
                                                    :attributes="{ style: 'text-align: left; ' }"
                                                />
                                                <kendo-grid-column
                                                    :field="'overDue'"
                                                    :title="$t('over_due')"
                                                    :width="150"
                                                    :lockable="false"
                                                    :hidden="true"
                                                    :editable="()=>{ return false}"
                                                    :template="overDue"
                                                    :headerAttributes="{
                                                                    style: 'background-color: #EDF1F5'
                                                                }"/>

                                                <kendo-grid-column
                                                    :field="'paymentTerm'"
                                                    :title="$t('payment_term')"
                                                    :width="220"
                                                    :lockable="false"
                                                    :hidden="true"
                                                    :template="settlementDiscount"
                                                    :editable="()=>{ return false}"
                                                    :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                                    :attributes="{style: 'text-align: right; '}"/>
                                                <kendo-grid-column
                                                    :field="'paymentOption'"
                                                    :title="$t('payment_option')"
                                                    :width="200"
                                                    :lockable="false"
                                                    :template="PMTTemplate"
                                                    :editor="PaymentOptionEditor"
                                                    :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                                    :attributes="{style: 'text-align: right; '}"/>
                                                <kendo-grid-column
                                                    :field="'bankReferenceNo'"
                                                    :title="$t('bank_reference_no')"
                                                    :width="180"
                                                    :lockable="false"
                                                    :template="bankReferenceNo"
                                                    :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                                    :attributes="{style: 'text-align: right; '}"/>
                                                <kendo-grid-column
                                                    :field="'status'"
                                                    :title="$t('status')"
                                                    :width="100"
                                                    :lockable="false"
                                                    :template="status"
                                                    :hidden="true"
                                                    :editable="()=>{ return false}"
                                                    :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                                    :attributes="{style: 'text-align: right; '}"/>
                                                <kendo-grid-column
                                                    :field="'currencyCode'"
                                                    :title="$t('currency')"
                                                    :width="150"
                                                    :lockable="false"
                                                    :editable="()=>{ return false}"
                                                    :template="currency"
                                                    :headerAttributes="{
                                                                    style: 'background-color: #EDF1F5'
                                                                }"/>
                                                <kendo-grid-column
                                                    :field="'amount'"
                                                    :title="$t('amount')"
                                                    :width="150"
                                                    :lockable="false"
                                                    :editable="()=>{ return false}"
                                                    :template="amount"
                                                    :attributes="{style: 'text-align: right; '}"
                                                    :headerAttributes="{
                                                                    style: 'background-color: #EDF1F5'
                                                                }"/>

                                                <kendo-grid-column
                                                    :field="'penalty'"
                                                    :title="$t('penalty')"
                                                    :width="150"
                                                    :lockable="false"
                                                    :editor="penaltyEditor"
                                                    :template="penalty"
                                                    :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                                    :attributes="{style: 'text-align: right; '}"/>
                                                <kendo-grid-column
                                                    :field="'discount'"
                                                    :title="$t('discount')"
                                                    :editor="discountEditor"
                                                    :template="discount"
                                                    :width="150"
                                                    :lockable="false"
                                                    :headerAttributes="{
                                                                        style: 'text-align: right; background-color: #EDF1F5'
                                                                    }"
                                                    :attributes="{
                                                                        style: 'text-align: right'
                                                                    }"/>
                                                <kendo-grid-column
                                                    :field="'amountTobePaid'"
                                                    :title="$t('amount_to_be_paid')"
                                                    :width="210"
                                                    :lockable="false"
                                                    :editable="()=>{ return false}"
                                                    :template="amountTobePaid"
                                                    :attributes="{style: 'text-align: right; '}"
                                                    :headerAttributes="{
                                                                    style: 'background-color: #EDF1F5'
                                                                }"/>
                                                <kendo-grid-column
                                                    :field="'paidAmount'"
                                                    :title="$t('paid_amount')"
                                                    :width="200"
                                                    :lockable="false"
                                                    :editor="paidAmountEditor"
                                                    :template="paidAmountTmp"
                                                    :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                                    :attributes="{style: 'text-align: right; '}"/>
                                            </kendo-grid>

                                        </v-col>
                                        <v-col sm="12" cols="12" class="pb-0">
                                            <v-row>
                                                <v-col sm="6" cols="12" class="">
                                                    <v-card class="no-boxshadow pa-3" color="grayBg">
                                                        <v-row>
                                                            <v-col class="py-0" sm="6" cols="6">
                                                                <label>{{ $t('message_on_receipt') }}</label>
                                                                <v-textarea class="mt-1"
                                                                            outlined
                                                                            v-model="cashReceipt.transactionNote"
                                                                            no-resize
                                                                            height="70px"
                                                                            rows="3"
                                                                            placeholder="This will appear on the invoice"
                                                                />
                                                            </v-col>
                                                            <v-col class="py-0" sm="6" cols="6">
                                                                <label>{{ $t('message_for_journal') }}</label>
                                                                <v-textarea class="mt-1"
                                                                            outlined
                                                                            v-model="cashReceipt.journalNote"
                                                                            no-resize
                                                                            height="70px"
                                                                            rows="3"
                                                                            placeholder="This will appear on the invoice"
                                                                />
                                                            </v-col>
                                                        </v-row>
                                                    </v-card>
                                                    <!--                                                    <template>-->
                                                    <!--                                                        <v-file-input class="mt-0 pt-0 " sm="3" cols="6"-->
                                                    <!--                                                                      v-model="files"-->
                                                    <!--                                                                      :placeholder="$t('attachment')"-->
                                                    <!--                                                                      multiple-->
                                                    <!--                                                                      prepend-icon="mdi-paperclip">-->
                                                    <!--                                                            <template v-slot:selection="{ text }">-->
                                                    <!--                                                                <v-chip-->
                                                    <!--                                                                    small-->
                                                    <!--                                                                    label-->
                                                    <!--                                                                    color="primary">-->
                                                    <!--                                                                    {{ text }}-->
                                                    <!--                                                                </v-chip>-->
                                                    <!--                                                            </template>-->
                                                    <!--                                                        </v-file-input>-->
                                                    <!--                                                    </template>-->
                                                </v-col>
                                                <v-col sm="6" cols="12">
                                                    <v-simple-table>
                                                        <template v-slot:default>
                                                            <tbody>
                                                            <tr>
                                                                <td class="text-left text-uppercase">{{ $t('penalty') }}
                                                                </td>
                                                                <td class="text-center">:</td>
                                                                <td class="text-left primary--text text-bold">
                                                                    {{ numberFormat(cashReceipt.penalty) }}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="text-left text-uppercase">{{
                                                                        $t('discount')
                                                                    }}
                                                                </td>
                                                                <td class="text-center">:</td>
                                                                <td class="text-left primary--text text-bold">
                                                                    {{ numberFormat(cashReceipt.discount) }}
                                                                </td>
                                                            </tr>
                                                            <!--                                                            <tr>-->
                                                            <!--                                                                <td class="text-left text-uppercase">{{ $t('total') }}-->
                                                            <!--                                                                </td>-->
                                                            <!--                                                                <td class="text-center">:</td>-->
                                                            <!--                                                                <td class="text-left primary--text text-bold">-->
                                                            <!--                                                                    {{ numberFormat(cashReceipt.total) }}-->
                                                            <!--                                                                </td>-->
                                                            <!--                                                            </tr>-->
                                                            <tr>
                                                                <td class="text-left text-uppercase">
                                                                    {{ $t('exchange_amount') }} - {{ baseCurrencyCode }}
                                                                </td>
                                                                <td class="text-center">:</td>
                                                                <td class="text-left primary--text text-bold">
                                                                    {{ numberFormat(cashReceipt.exchangeAmount) }}
                                                                </td>
                                                            </tr>

                                                            <tr hidden>
                                                                <td class="text-left text-uppercase">
                                                                    {{ $t('dr') }}
                                                                </td>
                                                                <td class="text-center">:</td>
                                                                <td class="text-left primary--text text-bold">
                                                                    {{ numberFormat(dr) }}
                                                                </td>
                                                            </tr>
                                                            <tr hidden>
                                                                <td class="text-left text-uppercase">
                                                                    {{ $t('cr') }}
                                                                </td>
                                                                <td class="text-center">:</td>
                                                                <td class="text-left primary--text text-bold">
                                                                    {{ numberFormat(cr) }}
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </template>
                                                    </v-simple-table>
                                                </v-col>
                                            </v-row>
                                        </v-col>

                                    </v-row>

                                    <v-divider/>
                                    <v-card outlined dense class="no_border function_footer">
                                        <!--                    <v-menu>-->
                                        <!--                      <template v-slot:activator="{ on }">-->
                                        <!--                        <v-btn color="black" outlined-->
                                        <!--                               class="mr-2 text-capitalize  black&#45;&#45;text float-left"-->
                                        <!--                               v-on="on">-->
                                        <!--                          {{ $t('select_template') }}-->
                                        <!--                          <v-icon size="" class="ma-1">expand_more</v-icon>-->
                                        <!--                        </v-btn>-->
                                        <!--                      </template>-->
                                        <!--                      <v-list>-->
                                        <!--                        <v-list-item v-for="(item, index) in templates" :key="index">-->
                                        <!--                          <v-list-item-title>{{ item.title }}</v-list-item-title>-->
                                        <!--                        </v-list-item>-->
                                        <!--                      </v-list>-->
                                        <!--                    </v-menu>-->
                                        <v-btn color="black"
                                               outlined
                                               class="text-capitalize  black--text float-left"
                                               @click="cancel">{{ $t('cancel') }}
                                        </v-btn>
                                        <!--                    <v-menu>-->
                                        <!--                      <template v-slot:activator="{ on }">-->
                                        <!--                        <v-btn color="primary"-->
                                        <!--                               class="ml-2 float-right text-capitalize  white&#45;&#45;text"-->
                                        <!--                               v-on="on">-->
                                        <!--                          {{ $t('save_option') }}-->
                                        <!--                          <v-icon size="" class="ma-1">expand_more</v-icon>-->
                                        <!--                        </v-btn>-->
                                        <!--                      </template>-->
                                        <!--                      <v-list rounded>-->
                                        <!--                        <v-list-item-group>-->
                                        <!--                          <v-list-item>-->
                                        <!--                            <v-list-item-content>-->
                                        <!--                              <v-list-item-title>{{ $t('save_print') }}-->
                                        <!--                              </v-list-item-title>-->
                                        <!--                            </v-list-item-content>-->
                                        <!--                          </v-list-item>-->
                                        <!--                          <v-list-item>-->
                                        <!--                            <v-list-item-content>-->
                                        <!--                              <v-list-item-title>{{ $t('save_draft') }}-->
                                        <!--                              </v-list-item-title>-->
                                        <!--                            </v-list-item-content>-->
                                        <!--                          </v-list-item>-->
                                        <!--                        </v-list-item-group>-->
                                        <!--                      </v-list>-->
                                        <!--                    </v-menu>-->
<!--                                        <v-btn color="primary"-->
<!--                                               class="float-right white&#45;&#45;text text-capitalize "-->
<!--                                               @click="onSaveClose('close')">-->
<!--                                            {{ $t('save_close') }}-->
<!--                                        </v-btn>-->
                                        <v-btn v-if="!check_id_edit" color="secondary"
                                               style="margin-right: 10px !important"
                                               class="white--text float-right text-capitalize"
                                               @click="onSaveClose('new')">{{ $t("save_new") }}
                                        </v-btn>
                                        <v-btn v-if="check_id_edit" color="secondary"
                                               class="white--text mx-2 float-right text-capitalize"
                                               @click="_print(4)">
                                            {{ $t("print") }}
                                        </v-btn>
                                    </v-card>
                                </v-form>
                            </v-col>
                        </v-row>

                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import {i18n} from '@/i18n';
import {DropDownList} from '@progress/kendo-vue-dropdowns'

import DatePickerComponent from '@/components/custom_templates/DatePickerComponent'
import CashReceiptModel from "@/scripts/cash-receipt/model/CashReceipt";
import ItemLineModel from "@/scripts/cash-receipt/model/ItemLine";
import kendo from "@progress/kendo-ui";
import PaymentOptionEditor from "@/scripts/kendo_editor/PaymentOptionEditor";
import Helper from "@/helper";

const prefixHandler = require("@/scripts/prefixHandler")
const saleFormContentHandler = require("@/scripts/saleFormContentHandler")
const billingHandler = require("@/scripts/invoice/handler/billingHandler")
const customerHandler = require("@/scripts/customerHandler")
const settingHandler = require("@/scripts/settingsHandler")

const $ = kendo.jQuery //require("jquery")
const paymentOptionHandler = require("@/scripts/paymentOptionHandler")
// const paymentOptionHandler = require("@/scripts/paymentOptionHandler")

const cashReceiptModel = new CashReceiptModel(new Object())
const itemLineModel = new ItemLineModel({})

const keyField = 'id'
const textField = 'numberName'
const defaultItem = {[textField]: 'Select customer...', [keyField]: null}
const emptyItem = {[textField]: 'loading ...'}
const OPTION_TYPE = 'Customer'
const strFilter = '?optionType=' + OPTION_TYPE

const cookieJS = require("@/cookie.js");
const cookie = cookieJS.getCookie();
// from
const {getFormSetting} = require("@/scripts/settingsHandler.js")
import {print} from "@/form/Sale.js";
const sessionHandler = require("@/scripts/session/handler/sessionHandler")

export default {
    name: "CashReceipt",
    props: ['id'],
    components: {
        LoadingMe: () => import(`@/components/Loading`),
        'app-datepicker': DatePickerComponent,
        'dropdownlist': DropDownList
    },
    data: () => ({
        check_id_edit: false,
        PaymentOptionEditor: PaymentOptionEditor,
        showLoading: false,
        loadingAlert: false,
        loadingColorAlert: '',
        loadingTextAlert: '',
        alert: false,
        files: [],
        valid: true,
        loggedUser: {
            id: cookie.creator,
            name: cookie.email
        },
        itemLines: [],
        templates: [
            {title: 'Draft'},
            {title: 'Open'},
            {title: 'Partially Closed'},
            {title: 'Closed'},
        ],
        col_expand: 9,
        col_hide: 3,
        isHideBar: false,
        paymentOptions: ['Invoice', 'CRN', 'Payment Code', 'Customer'],
        mPaymentOption: 'Invoice',
        paymentMethod: ['Cash', 'Cheque'],
        transactionDate: new Date().toISOString().substr(0, 10),
        cashReceipt: cashReceiptModel,
        itemLine: itemLineModel,
        saleFormContent: {},
        search: '',
        transactionTypes: [],
        customers: [],
        mCustomer: {},
        defaultItem: defaultItem,
        cusBaseUrl: customerHandler.search(),
        filter: '',
        name: '',
        referenceNo: '',
        oldTotal: 0,
        dateFormat: itemLineModel.dateFormat,
        group: {field: 'customer.name'},
        banks: [],
        txnList: [],
        currencyCode: '',
        transactionRate: 1,
        schemaDefinition: {
            model: {
                id: "id",
                fields: {
                    id: {editable: false},
                    check: {type: 'boolean'},
                    referenceNo: {editable: false},
                    amount: {type: 'number'},
                    amountTobePaid: {type: 'number'},
                    overDue: {type: 'number'},
                    crn: {type: 'string'},
                    paidAmount: {type: 'number'},
                    discount: {type: 'number'},
                    penalty: {type: 'number'},
                    paymentCode: {type: 'number'}
                }
            }
        },
        baseCurrency: {},
        baseCurrencyCode: '',
        jRaw: [],
        gainLossAcc: {},
        otherRevenueAcc: {},
        gainOrLossDescription: 'gain/loss on exchange rate',
        penaltyDescription: 'penalty',
        cr: 0,
        dr: 0,
        activeSession: {},
        paymentOption: {},
        txnPrint: {}
    }),
    methods: {
        _print(id) {
            let print_data = this.cashReceipt;
            print_data['baseCurrencyCode'] = this.baseCurrencyCode
            let params = "?formType=CashReceipt"
            getFormSetting(params).then(res => {
                if (res.data.statusCode === 200) {
                    if (res.data.data.length > 0) {
                        window.console.log(res.data.data["0"].settings);
                        print(print_data, id, res.data.data["0"].settings);
                    } else {
                        this.$snotify.error(i18n.t('please_save_form_in_setting'))
                    }
                }
            });
        },
        removeDuplicate(array) {
            const result = [];
            const map = new Map();
            for (const item of array) {
                if (!map.has(item.id)) {
                    map.set(item.id, true);    // set any value to Map
                    result.push(item)
                }
            }
            return result
        },
        crnTmp(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty('crn')) {
                    return dataItem.crn
                }
            }
            return ''
        },
        currency(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty('currencyCode')) {
                    return dataItem.currencyCode
                }
            }
            return ''
        },
        paymentCodeTmp(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty('paymentCode')) {
                    return dataItem.paymentCode
                }
            }
            return ''
        },
        referenceNoTmp(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty('referenceNo')) {
                    return dataItem.referenceNo
                }
            }
            return ''
        },
        paidAmountTmp(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty('paidAmount')) {
                    return kendo.toString(dataItem.paidAmount || 0, dataItem.decimalFormat)
                }
            }
            return 0
        },
        amountTobePaid(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty('amountTobePaid')) {
                    return kendo.toString(dataItem.amountTobePaid || 0, dataItem.decimalFormat)
                }
            }
            return 0
        },
        discount(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty('discount')) {
                    return kendo.toString(dataItem.discount || 0, dataItem.decimalFormat)
                }
            }
            return 0
        },
        amount(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty('amount')) {
                    return kendo.toString(dataItem.amount || 0, dataItem.decimalFormat)
                }
            }
            return 0
        },
        penalty(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty('penalty')) {
                    return kendo.toString(dataItem.penalty || 0, dataItem.decimalFormat)
                }
            }
            return 0
        },
        bankReferenceNo(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty('bankReferenceNo')) {
                    return dataItem.bankReferenceNo
                }
            }
            return ''
        },
        overDue(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty('overDue')) {
                    return dataItem.overDue || 0
                }
            }
            return 0
        },
        checkSession(){
            this.showLoading = true
            let data = {
                user_name : cookie.email
            }
            sessionHandler.checkSession(data).then(res => {
                this.showLoading = false
                if(res.data.data.length > 0){
                    this.hasSession = true
                    this.activeSession = res.data.data[0]
                }else{
                    this.$snotify.error('Please start session!')
                    this.$router.go(-1);
                }
            }).catch(e => {
                this.showLoading = false
                this.$snotify.error('Something went wrong')
                this.errors.push(e)
                window.console.log(e)
            })
        },
        // loadPaymentOption(){
        //     this.showLoading = true
        //     let data = {
        //         user_name : cookie.email
        //     }
        //     sessionHandler.checkSession(data).then(res => {
        //         this.showLoading = false
        //         if(res.data.data.length > 0){
        //             this.hasSession = true
        //             this.activeSession = res.data.data[0]
        //         }else{
        //             this.$snotify.error('Please start session!')
        //             this.$router.go(-1);
        //         }
        //     }).catch(e => {
        //         this.showLoading = false
        //         this.$snotify.error('Something went wrong')
        //         this.errors.push(e)
        //         window.console.log(e)
        //     })
        // },
        // async loadTransactionRate(code) {
        //     new Promise(resolve => {
        //         setTimeout(() => {
        //             resolve('resolved')
        //             const date = new Date(this.transactionDate).toISOString().substr(0, 10)
        //             // const priceLevel = this.invoice.priceLevel
        //             if (code !== undefined || code !== '') {
        //                 this.showLoading = true
        //                 currencyHandler.getLastExchangeRateByDate(date, code).then(res => {
        //                     if (res.data.statusCode === 200) {
        //                         this.showLoading = false
        //                         const exchangeRate = res.data.data
        //                         this.currencyCode = exchangeRate.code
        //                         this.transactionRate = exchangeRate.rate
        //                         this.cashReceipt.txnRate = exchangeRate.rate
        //                         this.cashReceipt.exchangeRate = exchangeRate
        //                         this.showLoading = false
        //                     }
        //                 })
        //             }
        //
        //         }, 10)
        //     })
        // },
        async initData() {
            this.checkSession()
            if (this.$route.params.id !== undefined) {
                this.check_id_edit = true
                const queryString = this.$route.query
                let type = ''
                let option = 0
                if (queryString.hasOwnProperty('type')) {
                    type = queryString.type
                    option = queryString.option
                    if (type === 'pmt') {
                        this.mPaymentOption = option
                        this.search = this.$route.params.id
                        this.searchInvoice()
                    }
                } else {
                    await this.loadCashReceiptView()
                }

            } else {
                this.check_id_edit = false
                this.initRow()
            }
        },
        paidAmountEditor(container, options) {
            kendo.jQuery('<input data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    decimals: 30,
                    format: `n${this.saleFormContent.decimal}`,
                    min: 0
                });
        },
        discountEditor(container, options) {
            kendo.jQuery('<input data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    decimals: 30,
                    format: `n${this.saleFormContent.decimal}`,
                    min: 0
                });
        },
        penaltyEditor(container, options) {
            kendo.jQuery('<input data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    decimals: 30,
                    format: `n${this.saleFormContent.decimal}`,
                    min: 0
                });
        },
        onTransactionDateChanged() {
            this.generateNumber()
            this.searchInvoice()
        },
        generateNumber() {
            if (this.$route.params.id) {
                const tranDate = new Date(this.cashReceipt.transactionDate)
                const tranDateReceipt = new Date(this.cashReceipt.transactionDate)
                const tranDateM = tranDate.getFullYear() + tranDate.getMonth()
                const tranDateReceiptM = tranDateReceipt.getFullYear() + tranDateReceipt.getMonth()
                if (tranDateM === tranDateReceiptM) {
                    this.cashReceipt.referenceNo = this.referenceNo
                    return
                }
            }
            if (this.cashReceipt.transactionDate !== '' && this.transactionTypes.length > 0) {
                let data = {
                    abbr: this.cashReceipt.transactionType.abbr,
                    structure: this.cashReceipt.transactionType.structure,
                    transactionDate: this.cashReceipt.transactionDate,
                    sequcencing: this.cashReceipt.transactionType.sequcencing,
                    type: 'Cash Receipt',
                    entity: 1
                }
                billingHandler.lastNumber(data).then(response => {
                    if (response.data.statusCode === 200) {
                        const res = response.data.data
                        const lastNumber = this.zeroPad(parseInt(res.lastNumber), this.cashReceipt.transactionType.format)
                        const number = res.suffix + this.cashReceipt.transactionType.numberSeparator + lastNumber
                        this.cashReceipt.number = number
                        if (this.cashReceipt.transactionType.hasOwnProperty('prefixSeparator')) {
                            const prefixSep = this.cashReceipt.transactionType.prefixSeparator
                            this.cashReceipt.referenceNo = this.cashReceipt.transactionType.abbr + prefixSep + number
                        }
                    }
                }).catch(e => {
                    this.errors.push(e)
                })
            }
        },
        zeroPad(num, places) {
            return String(num).padStart(places, '0')
        },
        getCircularReplacer() {
            const seen = new WeakSet();
            return (key, value) => {
                if (typeof value === "object" && value !== null) {
                    if (seen.has(value)) {
                        return;
                    }
                    seen.add(value);
                }
                return value;
            };
        },
        autoCalculate() {
            //todo: note : rateTobase is cash receipt rate , txnRate is invoice rate
            let ds = this.$refs.cashReceiptItemLineDS.kendoWidget(),
                receiptAmount = 0, discount = 0, penalty = 0, convertedAmount = 0, exchangeDiscount = 0,
                exchangePenalty = 0, paidAmountTxn = 0, exchangePenaltyTxn = 0, exchangeDiscountTxn = 0
            const row = ds.data().filter(n => n.paidAmount > 0)
            this.jRaw = []
            row.forEach(value => {
                let paidAmt = 0, nature = '', invRate = 0, receiptRate = 0, rawPaidAmount = 0, rawDiscountAmount = 0,
                    rawPenaltyAmount = 0, currencyCode = ''
                let discountAmount = 0, arAmount = 0, refNo = '', payOption = {}, penaltyAmount = 0,
                    currency = {}, gainLoss = 0, lastXRate = {}, location = {}, segment = {}, project = {},
                    locationId = '', segmentId = '', projectId = '', txnId = ''
                if (value.referenceNo) {
                    refNo = value.referenceNo
                }
                if (value.id) {
                    txnId = value.id || ''
                }
                if (value.txnRate) {
                    invRate = parseFloat(value.txnRate)
                }
                if (value.currencyCode) {
                    currencyCode = (value.currencyCode) || ''
                }
                if (value.currency) {
                    currency = (value.currency) || {}
                }
                if (value.location) {
                    location = (value.location) || {}
                    if (location.hasOwnProperty('id')) {
                        locationId = location.id
                    }
                }
                if (value.segment) {
                    segment = (value.segment) || {}
                    if (segment.hasOwnProperty('id')) {
                        segmentId = segment.id
                    }
                }
                if (value.project) {
                    project = (value.project) || {}
                    if (project.hasOwnProperty('id')) {
                        projectId = project.id
                    }
                }
                if (value.exchangeRate) {
                    lastXRate = (value.exchangeRate) || {}
                }
                if (value.rateTobase) {
                    receiptRate = parseFloat(value.rateTobase)
                }
                if (value.paidAmount) {
                    receiptAmount += kendo.parseFloat(value.paidAmount)
                    convertedAmount += (kendo.parseFloat(value.paidAmount) * receiptRate)
                    paidAmountTxn += (kendo.parseFloat(value.paidAmount) * invRate)
                    paidAmt = kendo.parseFloat(value.paidAmount) * receiptRate
                    rawPaidAmount = kendo.parseFloat(value.paidAmount)
                    window.console.log('convertedAmount', convertedAmount, '-', receiptRate)
                }
                if (value.discount) {
                    // discount += kendo.parseFloat(value.discount)
                    discount += (kendo.parseFloat(value.discount) * receiptRate)
                    exchangeDiscount += (kendo.parseFloat(value.exchangeDiscount) * receiptRate)
                    exchangeDiscountTxn += (kendo.parseFloat(value.discount) * invRate)
                    discountAmount = kendo.parseFloat(value.discount) * receiptRate
                    rawDiscountAmount = kendo.parseFloat(value.discount)
                }
                if (value.penalty) {
                    // penalty += kendo.parseFloat(value.penalty)
                    penalty += (kendo.parseFloat(value.penalty) * receiptRate)
                    penaltyAmount = (kendo.parseFloat(value.penalty)) * receiptRate
                    exchangePenalty += (kendo.parseFloat(value.exchangePenalty) * receiptRate)
                    rawPenaltyAmount = kendo.parseFloat(value.penalty)
                    exchangePenaltyTxn += kendo.parseFloat(value.penalty) * invRate
                    // todo: Other Revenue Penalty
                    if (penaltyAmount > 0) {
                        if (penaltyAmount * -1 > 0) {
                            nature = 'dr'
                        } else {
                            nature = 'cr'
                        }
                        if (this.otherRevenueAcc.hasOwnProperty('id')) {
                            const obj = {
                                id: this.otherRevenueAcc.id + '-' + nature + '-' + currencyCode + '-' + invRate + '-' + locationId + '-' + projectId + '-' + segmentId + '-' + txnId,
                                txnId: txnId,
                                projectId: projectId,
                                locationId: locationId,
                                segmentId: segmentId,
                                currencyCode: currencyCode,
                                currency: currency,
                                lastXRate: lastXRate,
                                referenceNo: refNo,
                                transactionDate: value.transactionDate || '',
                                paymentOption: value.paymentOption || '',
                                bankReferenceNo: value.bankReferenceNo || '',
                                // line: new ItemLineModel(value),
                                receiptRate: receiptRate,
                                description: 'Penalty',
                                cashBasicEntries: {},
                                account: this.otherRevenueAcc,
                                accountId: this.otherRevenueAcc.id,
                                amount: rawPenaltyAmount * -1,
                                exchangeAmount: penaltyAmount * -1,
                                type: nature,
                                typeAs: 'Penalty'
                            }
                            const objCashBasic = {
                                id: this.otherRevenueAcc.id + '-' + nature + '-' + currencyCode + '-' + invRate + '-' + locationId + '-' + projectId + '-' + segmentId + '-' + txnId,
                                txnId: txnId,
                                projectId: projectId,
                                locationId: locationId,
                                segmentId: segmentId,
                                currencyCode: currencyCode,
                                currency: currency,
                                lastXRate: lastXRate,
                                referenceNo: refNo,
                                transactionDate: value.transactionDate || '',
                                paymentOption: value.paymentOption || '',
                                bankReferenceNo: value.bankReferenceNo || '',
                                // line: new ItemLineModel(value),
                                receiptRate: receiptRate,
                                description: 'Penalty',
                                account: this.otherRevenueAcc,
                                accountId: this.otherRevenueAcc.id,
                                amount: rawPenaltyAmount * -1,
                                exchangeAmount: penaltyAmount * -1,
                                type: nature,
                                typeAs: 'Penalty'
                            }
                            obj.cashBasicEntries = objCashBasic
                            this.jRaw.push(obj)
                        }
                    }
                }
                // todo: gain or loss exchange rate
                gainLoss = parseFloat((invRate - receiptRate) * (rawPaidAmount + rawDiscountAmount - rawPenaltyAmount))
                if (gainLoss !== 0) {
                    if (gainLoss > 0) {
                        nature = 'dr'
                    } else {
                        nature = 'cr'
                    }
                    window.console.log('gainLoss', gainLoss, paidAmt, this.gainLossAcc)
                    // if (gainLoss) {
                    if (this.gainLossAcc.hasOwnProperty('id')) {
                        const obj = {
                            id: this.gainLossAcc.id + '-' + nature + '-' + currencyCode + '-' + invRate + '-' + locationId + '-' + projectId + '-' + segmentId + '-' + txnId,
                            txnId: txnId,
                            projectId: projectId,
                            locationId: locationId,
                            segmentId: segmentId,
                            currencyCode: currencyCode,
                            currency: currency,
                            lastXRate: lastXRate,
                            referenceNo: refNo,
                            transactionDate: value.transactionDate || '',
                            paymentOption: value.paymentOption || '',
                            bankReferenceNo: value.bankReferenceNo || '',
                            // line: new ItemLineModel(value),
                            receiptRate: gainLoss > 0 ? receiptRate : invRate,
                            description: this.gainOrLossDescription,
                            account: this.gainLossAcc,
                            cashBasicEntries: {},
                            accountId: this.gainLossAcc.id,
                            amount: 0,
                            exchangeAmount: gainLoss,
                            type: nature,
                            typeAs: 'GainOrLoss'
                        }
                        const objCashBasic = {
                            id: this.gainLossAcc.id + '-' + nature + '-' + currencyCode + '-' + invRate + '-' + locationId + '-' + projectId + '-' + segmentId + '-' + txnId,
                            txnId: txnId,
                            projectId: projectId,
                            locationId: locationId,
                            segmentId: segmentId,
                            currencyCode: currencyCode,
                            currency: currency,
                            lastXRate: lastXRate,
                            referenceNo: refNo,
                            transactionDate: value.transactionDate || '',
                            paymentOption: value.paymentOption || '',
                            bankReferenceNo: value.bankReferenceNo || '',
                            // line: new ItemLineModel(value),
                            receiptRate: gainLoss > 0 ? receiptRate : invRate,
                            description: this.gainOrLossDescription,
                            account: this.gainLossAcc,
                            accountId: this.gainLossAcc.id,
                            amount: 0,
                            exchangeAmount: gainLoss,
                            type: nature,
                            typeAs: 'GainOrLoss'
                        }
                        obj.cashBasicEntries = objCashBasic
                        this.jRaw.push(obj)
                    }
                    // }
                }

                //Todo: AR  Cr
                arAmount = (rawPaidAmount + rawDiscountAmount - rawPenaltyAmount)
                if (arAmount * -1 > 0) {
                    nature = 'dr'
                } else {
                    nature = 'cr'
                }
                if (value.hasOwnProperty('receivableAcc')) {
                    let cashBasicEntries = []
                    if (value.hasOwnProperty('cashBasicIncomeAcc')) {
                        const cashBasicIncomeAcc = value.cashBasicIncomeAcc || []
                        cashBasicIncomeAcc.forEach((k, index) => {
                            const account = k.account || {}
                            const accountId = k.accountId || ''
                            const amount = arAmount * (k.amountPercentage || 0)
                            if (accountId) {
                                cashBasicEntries.push({
                                    id: accountId + '-' + nature + '-' + currencyCode + '-' + invRate + '-' + locationId + '-' + projectId + '-' + segmentId + '-' + txnId,
                                    txnId: txnId,
                                    projectId: projectId,
                                    locationId: locationId,
                                    segmentId: segmentId,
                                    currencyCode: currencyCode,
                                    currency: currency,
                                    lastXRate: lastXRate,
                                    referenceNo: refNo,
                                    transactionDate: value.transactionDate || '',
                                    paymentOption: value.paymentOption || '',
                                    bankReferenceNo: value.bankReferenceNo || '',
                                    // line: new ItemLineModel(value),
                                    receiptRate: invRate,
                                    description: this.cashReceipt.journalNote || refNo,
                                    account: account,
                                    accountId: accountId,
                                    amount: amount * -1,
                                    exchangeAmount: amount * -1 * invRate,
                                    type: nature,
                                    typeAs: 'Income'
                                })
                                const receivableAcc = value.receivableAcc
                                if (receivableAcc) {
                                    if (receivableAcc.hasOwnProperty('id')) {
                                        this.jRaw.push({
                                            id: receivableAcc.id + '-' + nature + '-' + currencyCode + '-' + invRate + '-' + locationId + '-' + projectId + '-' + segmentId + '-' + txnId + '-' + index,
                                            txnId: txnId,
                                            projectId: projectId,
                                            locationId: locationId,
                                            segmentId: segmentId,
                                            currencyCode: currencyCode,
                                            currency: currency,
                                            lastXRate: lastXRate,
                                            referenceNo: refNo,
                                            transactionDate: value.transactionDate || '',
                                            paymentOption: value.paymentOption || '',
                                            bankReferenceNo: value.bankReferenceNo || '',
                                            // line: new ItemLineModel(value),
                                            receiptRate: invRate,
                                            description: this.cashReceipt.journalNote || refNo,
                                            account: receivableAcc,
                                            cashBasicEntries: cashBasicEntries[index],
                                            accountId: receivableAcc.id,
                                            amount: index === 0 ? (arAmount * -1) : 0,
                                            exchangeAmount: index === 0 ? (arAmount * -1 * invRate) : 0,
                                            type: nature,
                                            typeAs: 'AR'
                                        })
                                    }
                                }
                            }
                        })
                    }
                }

                //Todo: Cash Account  Dr
                if (value.paymentOption) {
                    payOption = value.paymentOption
                    const cashAmount = (rawPaidAmount) //+ ((invRate - receiptRate) * (rawPaidAmount + rawDiscountAmount))
                    // const cashAmount = rawPaidAmount + (gainLoss ) + rawPaidAmount
                    if (cashAmount > 0) {
                        nature = 'dr'
                    } else {
                        nature = 'cr'
                    }
                    if (payOption.hasOwnProperty('account')) {
                        const payOptionAcc = payOption.account || {}
                        if (payOptionAcc.hasOwnProperty('id')) {
                            const obj = {
                                id: payOptionAcc.id + '-' + nature + '-' + currencyCode + '-' + invRate + '-' + locationId + '-' + projectId + '-' + segmentId + '-' + txnId,
                                txnId: txnId,
                                projectId: projectId,
                                locationId: locationId,
                                segmentId: segmentId,
                                currencyCode: currencyCode,
                                currency: currency,
                                lastXRate: lastXRate,
                                referenceNo: refNo,
                                transactionDate: value.transactionDate || '',
                                paymentOption: value.paymentOption || '',
                                bankReferenceNo: value.bankReferenceNo || '',
                                receiptRate: invRate,
                                description: this.cashReceipt.journalNote || refNo,
                                account: payOptionAcc,
                                accountId: payOptionAcc.id,
                                amount: cashAmount,
                                cashBasicEntries: {},
                                exchangeAmount: cashAmount * receiptRate,
                                type: nature,
                                typeAs: 'CashAccount'
                            }
                            const objCashBasicEntry = {
                                id: payOptionAcc.id + '-' + nature + '-' + currencyCode + '-' + invRate + '-' + locationId + '-' + projectId + '-' + segmentId + '-' + txnId,
                                txnId: txnId,
                                projectId: projectId,
                                locationId: locationId,
                                segmentId: segmentId,
                                currencyCode: currencyCode,
                                currency: currency,
                                lastXRate: lastXRate,
                                referenceNo: refNo,
                                transactionDate: value.transactionDate || '',
                                paymentOption: value.paymentOption || '',
                                bankReferenceNo: value.bankReferenceNo || '',
                                receiptRate: invRate,
                                description: this.cashReceipt.journalNote || refNo,
                                account: payOptionAcc,
                                accountId: payOptionAcc.id,
                                amount: cashAmount,
                                exchangeAmount: cashAmount * receiptRate,
                                type: nature,
                                typeAs: 'CashAccount'
                            }
                            obj.cashBasicEntries = objCashBasicEntry
                            // obj.cashBasicEntries = objCashBasicEntry
                            // let obj1 = obj
                            // obj1['cashBasicEntries'] = obj
                            // window.console.log('cashBasicEntries', obj1)
                            this.jRaw.push(obj)
                        }
                    }
                }
                //Todo: Settlement Discount  Dr
                if (value.paymentTerm) {
                    if (discountAmount > 0) {
                        const settlementDisc = value.paymentTerm
                        if (discountAmount > 0) {
                            nature = 'dr'
                        } else {
                            nature = 'cr'
                        }
                        if (settlementDisc.hasOwnProperty('account')) {
                            const settlementDiscAcc = settlementDisc.account
                            if (settlementDiscAcc.hasOwnProperty('id')) {
                                const obj = {
                                    id: settlementDiscAcc.id + '-' + nature + '-' + currencyCode + '-' + invRate + '-' + locationId + '-' + projectId + '-' + segmentId + '-' + txnId,
                                    txnId: txnId,
                                    projectId: projectId,
                                    locationId: locationId,
                                    segmentId: segmentId,
                                    currencyCode: currencyCode,
                                    currency: currency,
                                    lastXRate: lastXRate,
                                    referenceNo: refNo,
                                    transactionDate: value.transactionDate || '',
                                    paymentOption: value.paymentOption || '',
                                    bankReferenceNo: value.bankReferenceNo || '',
                                    // line: new ItemLineModel(value),
                                    receiptRate: receiptRate,
                                    description: 'Receipt Settlement Discount',
                                    account: settlementDiscAcc,
                                    cashBasicEntries: {},
                                    accountId: settlementDiscAcc.id,
                                    amount: rawDiscountAmount,
                                    exchangeAmount: discountAmount,
                                    type: nature,
                                    typeAs: 'Settlement Discount'
                                }
                                const objCashbasic = {
                                    id: settlementDiscAcc.id + '-' + nature + '-' + currencyCode + '-' + invRate + '-' + locationId + '-' + projectId + '-' + segmentId + '-' + txnId,
                                    txnId: txnId,
                                    projectId: projectId,
                                    locationId: locationId,
                                    segmentId: segmentId,
                                    currencyCode: currencyCode,
                                    currency: currency,
                                    lastXRate: lastXRate,
                                    referenceNo: refNo,
                                    transactionDate: value.transactionDate || '',
                                    paymentOption: value.paymentOption || '',
                                    bankReferenceNo: value.bankReferenceNo || '',
                                    // line: new ItemLineModel(value),
                                    receiptRate: receiptRate,
                                    description: 'Receipt Settlement Discount',
                                    account: settlementDiscAcc,
                                    accountId: settlementDiscAcc.id,
                                    amount: rawDiscountAmount,
                                    exchangeAmount: discountAmount,
                                    type: nature,
                                    typeAs: 'Settlement Discount'
                                }
                                obj.cashBasicEntries = objCashbasic
                                this.jRaw.push(obj)
                            }
                        }
                    }
                }
            })
            // this.invoiceTxn(txnIds)

            this.cashReceipt.total = receiptAmount
            this.cashReceipt.exchangeAmount = convertedAmount
            this.cashReceipt.discount = discount
            this.cashReceipt.exchangeDiscount = exchangeDiscount

            this.cashReceipt.penalty = penalty

            this.cashReceipt.exchangePenaltyTxn = exchangePenaltyTxn
            this.cashReceipt.paidAmountTxn = paidAmountTxn
            this.cashReceipt.exchangeDiscountTxn = exchangeDiscountTxn
            this.cashReceipt.exchangePenalty = exchangePenalty

            this.shrinkData(this.jRaw)
            // let itemLineDS = this.$refs.itemLineDS.kendoWidget()
            // const dataRow = itemLineDS.data().filter(n => n.paidAmount > 0)
            //
            // window.console.log(this.jRaw, 'cash jRaw')
        },
        shrinkData(obj) {
            const uniques = this.removeDuplicate(obj) /*[...new Set(accountId.map(i => {
                return {
                    id_: i.id_,
                    id: i.id,
                    type: i.type
                }
            }))]*/
            uniques.forEach(n => {
                const found = obj.filter(m => m.id === n.id)
                let amount = 0, exchangeAmount = 0
                found.forEach(z => {
                    amount += parseFloat(z.amount || 0)
                    exchangeAmount += parseFloat(z.exchangeAmount || 0)
                })
                n.exchangeAmount = parseFloat(exchangeAmount) //this.numberFormat(amount)
                n.amount = parseFloat(amount)  //parseFloat(parseFloat(amount / parseFloat(n.receiptRate))) //this.numberFormat(amount * parseFloat(this.invoice.txnRate)) //.toFixed(this.saleFormContent.decimal)
            })
            this.jRaw = uniques
            let dr = 0, cr = 0
            this.jRaw.forEach(j => {
                switch (j.type) {
                    case 'cr':
                        cr += parseFloat(j.exchangeAmount)
                        break
                    case 'dr':
                        dr += parseFloat(j.exchangeAmount)
                        break
                    default:
                        break
                }
            })
            const txnId = this.jRaw.map(o => o.txnId)
            var uSet = new Set(txnId);
            const uniqueSet = [...uSet]
            let jRaws = []
            uniqueSet.forEach(n => {
                const found = this.jRaw.filter(m => m.txnId === n)
                jRaws.push({
                    id: n,
                    currencyCode: found[0].currencyCode,
                    projectId: found[0].projectId,
                    segmentId: found[0].segmentId,
                    locationId: found[0].locationId,
                    referenceNo: found[0].referenceNo,
                    entries: JSON.parse(JSON.stringify(found))
                })
            })
            this.jRaw = jRaws
            this.dr = dr
            this.cr = cr
            window.console.log('dr=', dr, 'cr=', cr, 'dr+cr = ', dr + cr)
            window.console.log(JSON.stringify(this.jRaw), 'uniques')

        },
        invoiceTxn() {
            let txnIds = [], ids = []
            const ds = this.$refs.cashReceiptItemLineDS.kendoWidget()
            const data = ds.data()
            data.forEach(value => {
                if (value.id) {
                    txnIds.push({
                        id: value.id,
                        status: 1
                    })
                }
            })
            ids = Object.values(txnIds.reduce((r, o) => (r[o.id] = o, r), {}))
            ids.forEach(m => {
                const lines = data.filter(n => n.id === m.id)
                let paidAmt = 0
                let amountTobePaid = 0
                lines.forEach(x => {
                    if (x.paidAmount) {
                        paidAmt += x.paidAmount
                    }
                    if (x.amountTobePaid) {
                        amountTobePaid += x.amountTobePaid
                    }
                })
                const pAmt = this.numberFormat(paidAmt)
                const amtTobePaid = this.numberFormat(amountTobePaid)
                if (pAmt === amtTobePaid) {
                    m['status'] = 3 //Paid
                } else {
                    m['status'] = 2 // Partially Paid
                }
            })
            this.txnList = ids
        },
        initRow() {
            let ds = this.$refs.cashReceiptItemLineDS.kendoWidget()
            ds.insert([this.itemLine])

        },
        async initGrid(that) {
            let grid = $('#gridCashReceipt').data('kendoGrid')
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    $('#header-chb').change(function (ev) {
                        let checked = ev.target.checked
                        data = []
                        $('.row-checkbox').each(function (idx, item) {
                            if (checked) {
                                if (!($(item).closest('tr').is('.k-state-selected'))) {
                                    $(item).click()
                                    let mRow = $(item).closest('tr')
                                    let dataItem = grid.dataItem(mRow)
                                    data.push(dataItem)
                                }

                            } else {
                                $(item).click()
                            }
                        })
                        that.checkedChanged(data)
                    })
                }, 10)
            })

            //
            // let checkedIds = {}
            let data = []
            //
            // function selectRow(that) {
            //     let checked = this.checked,
            //         row = $(this).closest("tr"),
            //         grid = $('#itemLine').data('kendoGrid'),
            //         dataItem = grid.dataItem(row)
            //
            //     checkedIds[dataItem.paymentCode] = checked;
            //     window.console.log('here',dataItem)
            //     if (checked) {
            //         //-select the row
            //         row.addClass("k-state-selected")
            //         data.push(dataItem)
            //
            //         that.checkedChanged(dataItem)
            //     } else {
            //         //-remove selection
            //         row.removeClass("k-state-selected")
            //     }
            // }
            // if (grid) {
            //     grid.table.on("click", ".row-checkbox", selectRow(that))
            // }

        },
        checkedChanged(data) {
            data.forEach(m => {
                if (parseFloat(m.paidAmount) === 0) {
                    m.paidAmount = m.amountTobePaid
                }
                const index = this.itemLines.findIndex(item => {
                    return ((m.paymentCode === item.paymentCode) && parseFloat(item.paidAmount) === 0)
                })
                this.itemLines.splice(index, 1, m)
            })
            this.autoCalculate()
        },
        headerTemplate() {
            return `<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox'>`
        },
        checkTemplate(dataItem) {
            return `<input type='checkbox' #= ${dataItem.check} ? \\'checked="checked"\\' : '' # class='k-checkbox row-checkbox' />`
        },
        formatDate(dataItem) {
            if (dataItem.hasOwnProperty('dueDate')) {
                return kendo.toString(new Date(dataItem.dueDate), this.dateFormat)
            }
            return ''
        },
        settlementDiscount(dataItem) {
            if (dataItem.hasOwnProperty('paymentTerm')) {
                return dataItem.paymentTerm.name || ''
            }
            return ''
        },
        status(dataItem) {
            if (dataItem) {
                if (dataItem.hasOwnProperty('status')) {
                    const status = dataItem.status
                    let statusText = ''
                    switch (status) {
                        case 1:
                            statusText = 'OPEN'
                            break
                        case 2:
                            statusText = 'Partially Paid'
                            break
                        case 4:
                            statusText = 'VOID'
                            break
                        case 3:
                            statusText = 'PAID'
                            break
                    }
                    return statusText
                }
            }
            return ''
        },
        onCustomerChanged(event) {
            const value = event.value
            if (value && value[textField] === emptyItem[textField]) {
                return;
            }
            this.mCustomer = value
            this.cashReceipt.customer = value
        },
        onCustomerFilterChanged(event) {
            const filter = event.filter.value
            this.loadData(0, filter, this.cusBaseUrl)
            this.filter = filter
        },
        loadData(skip, filter, baseUrl) {
            const url = baseUrl +
                `?filter=${filter}`
            this.requestStarted = true;
            fetch(url)
                .then((response) => {
                    return response.json()
                })
                .then(this.afterFetch)
        },
        afterFetch(json) {
            this.customers = json.data
        },
        numberFormat(value) {
            return kendo.toString(value, `n${this.saleFormContent.decimal}`)
        },
        rowNumberTmpl(dataItem) {
            let ds = this.$refs.cashReceiptItemLineDS.kendoWidget(),
                index = ds.indexOf(dataItem);
            return index + 1;
        },
        dataSourceChanged(e) {
            let dataRow = e.items[0] || {}
            if (Object.keys(dataRow).length > 0) {
                dataRow.set('optionType', OPTION_TYPE)
            }
            window.console.log(dataRow, 'data change')
            if (e.field) {
                let amountTobePaid = 0, paidAmount = 0, variance = 0
                switch (e.field) {
                    case "discount":
                        dataRow.set('amountTobePaid', (parseFloat(dataRow.amount) + parseFloat(dataRow.penalty)) - parseFloat(dataRow.discount))
                        dataRow.set('exchangeDiscount', (parseFloat(dataRow.discount) * parseFloat(dataRow.rateTobase)))
                        dataRow.set('exchangeDiscountTxn', parseFloat(dataRow.discount) * parseFloat(dataRow.txnRate))
                        window.console.log((parseFloat(dataRow.discount) * parseFloat(dataRow.rateTobase)), '----')
                        break
                    case "penalty":
                        dataRow.set('amountTobePaid', (parseFloat(dataRow.amount) + parseFloat(dataRow.penalty)) - parseFloat(dataRow.discount))
                        dataRow.set('exchangePenalty', parseFloat(dataRow.penalty) * parseFloat(dataRow.rateTobase))
                        dataRow.set('exchangePenaltyTxn', parseFloat(dataRow.penalty) * parseFloat(dataRow.txnRate))

                        break
                    case "paidAmount":
                        amountTobePaid = parseFloat(dataRow.amountTobePaid)
                        paidAmount = parseFloat(dataRow.paidAmount)
                        variance = parseFloat(dataRow.penalty) - parseFloat(dataRow.discount)
                        if (paidAmount > amountTobePaid) {
                            paidAmount = amountTobePaid
                        } else if (paidAmount < variance) {
                            paidAmount = variance
                        }
                        dataRow.set('paidAmount', paidAmount)
                        dataRow.set('paidAmountTobase', (paidAmount * parseFloat(dataRow.rateTobase)))
                        dataRow.set('paidAmountTxn', (paidAmount * parseFloat(dataRow.txnRate)))
                        break
                    default:
                        break
                }

                this.invoiceTxn()
                this.autoCalculate()

            }
        },
        searchOptionChanged() {
        },
        cancel() {
            this.$swal({
                title: i18n.t('msg_title_warning'),
                text: i18n.t('msg_discard'),
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: i18n.t('cancel'),
                confirmButtonColor: "#4d4848",
                cancelButtonColor: "#ED1A3A",
                confirmButtonText: i18n.t('discard'),
            }).then((result) => {
                if (result.value) {
                    this.clear();
                    this.$router.go(-1);
                }
            });
        },
        PMTTemplate(dataItem) {
            const pmt = dataItem.paymentOption || {}
            if (pmt) {
                return `<span>${pmt.name || ``}</span>`
            } else {
                return ``
            }
        },
        async loadPaymentOption() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.paymentMethod = []
                    paymentOptionHandler.list(strFilter).then(res => {
                        if (res.data.statusCode === 200) {
                            this.showLoading = false
                            this.paymentMethod = res.data.data
                            window.console.log(this.paymentMethod, 'payment option')
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 10)
            })
        },
        async loadOtherAccount() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    settingHandler.getOtherAccount().then(res => {
                        if (res.data.statusCode === 200) {
                            this.showLoading = false
                            const response = res.data.data
                            const data = response.filter(o => o.banhjiAccCode === '740010')
                            // window.console.log(data, ' this.gainLossAc')
                            if (data.length > 0) {
                                this.gainLossAcc = data[0].account
                                window.console.log(this.gainLossAcc, 'data[0].account')
                            }
                            const data_ = response.filter(o => o.banhjiAccCode === '740040')
                            if (data_.length > 0) {
                                this.otherRevenueAcc = data_[0].account
                            }
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 10)
            })
        },
        PaymentMethodDropDownEditor(container, options) {
            kendo.jQuery('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    dataTextField: "name",
                    dataValueField: "id",
                    template: "<span>#=name#</span>",
                    optionLabel: "--Select--",
                    dataSource: new kendo.data.DataSource({
                        data: this.paymentMethod
                    })
                })
        },
        hideSmallSidebar() {
            this.isHideBar = !this.isHideBar;
        },
        async loadPrefix() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    prefixHandler.get('cash receipt').then(res => {
                        if (res.data.statusCode === 200) {
                            this.showLoading = false
                            this.transactionTypes = res.data.data
                            if (this.transactionTypes.length > 0) {
                                this.cashReceipt.transactionType = this.transactionTypes[0]
                                if (!this.$route.params.id) {
                                    this.generateNumber()
                                }
                            }
                        }
                    })
                }, 10);
            })
        },
        async loadSaleFormContent() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    saleFormContentHandler.list().then(res => {
                        if (res.data.statusCode === 200) {
                            const data = res.data.data
                            if (data.length > 0) {
                                this.saleFormContent = data[0]
                            }
                        }
                    })
                }, 10)
            })
        },
        async searchInvoice() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    let data = {}
                    this.showLoading = true
                    if (this.mPaymentOption === 'Invoice') {
                        data = {
                            search: this.search,
                            type: 'invoice',
                            transactionDate: this.cashReceipt.transactionDate,
                        }
                    } else if (this.mPaymentOption === 'CRN') {
                        data = {
                            search: this.search,
                            type: 'crn',
                            transactionDate: this.cashReceipt.transactionDate,
                        }
                    } else if (this.mPaymentOption === 'Payment Code') {
                        data = {
                            search: this.search,
                            type: 'payment code',
                            transactionDate: this.cashReceipt.transactionDate,
                        }
                    } else if (this.mPaymentOption === 'Customer') {
                        data = {
                            search: this.mCustomer.id,
                            type: 'customer',
                            transactionDate: this.cashReceipt.transactionDate,
                        }
                    }
                    this.itemLines = []
                    if (data.search) {
                        if (data.search.length > 4) {
                            this.showLoading = true
                            try {
                                billingHandler.search(data).then(res => {
                                    if (res.data.statusCode === 200) {
                                        const response = res.data.data
                                        const result = res.data.result
                                        this.showLoading = false
                                        if (response.length > 0) {
                                            response.forEach(ele => {
                                                ele.paymentOption = this.paymentMethod[0]
                                                ele.paidAmount = ele.amountTobePaid
                                                this.txnPrint.amountTobePaid = ele.amountTobePaid
                                                this.txnPrint.transactionNote = ele.txnNote
                                                this.txnPrint.invoiceNumber = ele.referenceNo
                                            })
                                            this.itemLines = response
                                            window.console.log(this.itemLines, 'after search')
                                            const obj = response[0]
                                            this.autoCalculate()
                                            if (obj.hasOwnProperty('customer')) {
                                                this.cashReceipt.customer = obj.customer
                                                if (obj.customer.hasOwnProperty('name')) {
                                                    this.name = obj.customer.name
                                                    this.txnPrint.name = obj.customer.name
                                                    window.console.log(obj.customer, 'customer')
                                                    this.txnPrint.otherName = obj.customer.alternativeName
                                                }
                                            }
                                        }
                                        const baseCurrency = result
                                        this.baseCurrency = baseCurrency
                                        this.cashReceipt.currency = baseCurrency
                                        if (baseCurrency) {
                                            if (baseCurrency.hasOwnProperty('code')) {
                                                this.baseCurrencyCode = baseCurrency.code
                                                // if (code) {
                                                //     this.loadTransactionRate(baseCurrency.code)
                                                // }
                                            }
                                        }
                                    }
                                })
                            } catch (e) {
                                this.showLoading = false
                            }
                        } else {
                            this.showLoading = false
                        }

                    } else {
                        this.showLoading = false
                    }
                }, 10)
            })
        },
        async onSaveClose(save) {
            if (!this.$refs.form.validate()) {
                this.$refs.form.validate()
                return
            }
            let itemLineDS = this.$refs.cashReceiptItemLineDS.kendoWidget()
            let dataValidate = 0
            const dataRow = itemLineDS.data().filter(n => n.paidAmount > 0).map(o => {
                return new ItemLineModel(o)
            })

            if (dataRow.length > 0) {
                dataRow.forEach((value, index) => {
                    if (value.paymentOption.id == undefined || value.paymentOption.id == '') {
                        this.$snotify.error('Please check payment option again' + (index + 1))
                    } else {
                        dataValidate += 1
                    }
                });
                if (dataRow.length === dataValidate) {
                    let isAutoGenerate = 1
                    // this.autoCalculate()
                    if (this.$route.params.id) {
                        const tranDate = new Date(this.cashReceipt.transactionDate)
                        const tranDateReceipt = new Date(this.cashReceipt.transactionDate)
                        const tranDateM = tranDate.getFullYear() + tranDate.getMonth()
                        const tranDateReceiptM = tranDateReceipt.getFullYear() + tranDateReceipt.getMonth()
                        if (tranDateM === tranDateReceiptM) {
                            isAutoGenerate = 0
                        }
                    }
                    //todo: match Cash receipt model
                    this.cashReceipt.paidOption = this.mPaymentOption
                    this.cashReceipt.transactionDateTZ = Helper.toISODate(this.cashReceipt.transactionDate)
                    this.cashReceipt.paidOptionText = this.search ? this.search : this.mCustomer
                    this.cashReceipt.itemLine = dataRow
                    this.cashReceipt['jRaw'] = this.jRaw
                    this.cashReceipt.loggedUser = this.loggedUser
                    this.cashReceipt['oldTotal'] = this.oldTotal
                    this.cashReceipt['isAutoGenerate'] = isAutoGenerate
                    this.cashReceipt['txnList'] = this.txnList
                    this.cashReceipt['transactionDate'] = this.cashReceipt.transactionDate
                    this.cashReceipt['actionType'] = this.$route.params.id ? this.$route.query.type : 'new'
                    this.txnPrint.number = this.cashReceipt.transactionType.abbr + '-' + this.cashReceipt.number
                    this.showLoading = true
                    // let data = this.cashReceipt
                    // window.console.log(JSON.stringify(data), '----', isAutoGenerate)
                    window.console.log(this.cashReceipt, 'cash receipt')
                    this.txnPrint.paidAmount = this.cashReceipt.total
                    this.txnPrint.paymentMethod = this.cashReceipt.itemLine[0].paymentOption.name
                    billingHandler.createReceipt(this.cashReceipt).then(response => {
                        if (response.data.statusCode === 201) {
                            this.showLoading = false
                            this.printForm()
                            // this.close(response.data.data)
                            this.$snotify.success('Successfully')
                            if (save == 'new') {
                                this.clear()
                            } else {
                                this.clear()
                                this.close()
                            }
                        }
                    }).catch(e => {
                        this.$snotify.error('Something went wrong')
                        this.errors.push(e)
                    })
                }
            }
        },
        async loadCashReceiptView() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.itemLines = []
                    billingHandler.txnView(this.$route.params.id).then(res => {
                        if (res.data.statusCode === 200) {
                            this.showLoading = false
                            const response = res.data.data
                            if (response.length > 0) {
                                this.cashReceipt = response[0]
                                this.referenceNo = this.cashReceipt.referenceNo
                                this.oldTotal = this.cashReceipt.total
                                this.itemLines = response[0].itemLine
                                if (this.cashReceipt.hasOwnProperty('customer')) {
                                    if (this.cashReceipt.customer.hasOwnProperty('name')) {
                                        this.name = this.cashReceipt.customer.name
                                    }
                                }
                            }
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 10)
            })
        },
        clear() {
            let ds = this.$refs.cashReceiptItemLineDS.kendoWidget();
            ds.data([]);
            this.id = undefined
            this.mCustomer = {}
            this.name = ''
            this.mPaymentOption = 'Invoice'
            this.cashReceipt = new CashReceiptModel()
            this.cashReceipt.transactionType = this.transactionTypes[0]
            this.generateNumber()
        },
        close() {
            this.$router.go(-1);
        },
        printForm(){
            window.console.log(this.txnPrint, 'print obj')
            // this.showLoading = true
            // window.console.log(id)
            // billingHandler.txnView('txn-876857a0-75dc-11ec-b28b-e37839735269').then(res => {
            //     this.showLoading = false
            //     window.console.log(res, 'for print')
            // }).catch(e => {
            //     this.showLoading = false
            //     this.$snotify.error('Something went wrong')
            //     this.errors.push(e)
            //     window.console.log(e)
            // })
        }
    },
    watch: {
        id() {
            if (this.$route.params.id === undefined) {
                this.clear()
                this.check_id_edit = false

            } else {
                this.showLoading = true
                this.loadOtherAccount()
                this.initData()
            }
        }
    },
    created() {
        // fetch the data when the view is created and the data is
        // already being observed
        // this.loadObj()
        this.loadPaymentOption()
    },
    mounted: async function () {
        await this.loadOtherAccount()
        await this.loadPrefix()
        await this.loadSaleFormContent()
        this.loadData(0, this.filter, this.cusBaseUrl)
        await this.initGrid(this)
        await this.initData()
    },
    computed: {
        disabledMe() {
            return !!this.$route.params.id;
        },
        showMe() {
            return this.mPaymentOption === 'Customer' // or some other more complicated logic
        }
    }
};
</script>

<style scoped>
.k-dropdown {
    width: 100%;
    margin-top: 3px;
}

.function_wrapper {
    box-shadow: none !important;
}

.v-application--is-ltr .v-text-field .v-input__append-inner {
    margin-top: 0 !important;
}

.v-input__slot {
    background-color: #fff !important;
}

.function_content .label {
    margin-bottom: 10px;
    display: inline-block;
}

.border_radius10 {
    border-radius: 10px !important;
    background-color: #F2F2F2;
}

.pa-3.v-card h4 {
    font-size: 18px;
    color: #333;
}

.pa-3.v-card p {
    font-size: 12px;
    color: #B5B5B5;
}

.attachment_file {
    background-color: #EFEDED;
    border-radius: 0 !important;
}

.attachment_table.v-data-table table {
    border: thin solid rgba(0, 0, 0, 0.12);
}

.attachment_table table tr th {
    border-left: thin solid rgba(0, 0, 0, 0.12);
    height: 35px;
    border-right: thin solid rgba(0, 0, 0, 0.12);
}

.block_debit,
.block_credit {
    border-bottom: 1px solid #fff;
}

.block_debit p.number,
.block_credit p.number {
    font-size: 25px;
    color: #7F7F7F;
}

.block_debit h5,
.block_credit h5,
.block_difference h5 {
    text-transform: uppercase;
    color: #7F7F7F;
    font-size: 15px;
    font-weight: normal;
}

.block_difference h5 {
    font-size: 18px;
}

.block_difference h5 span {
    font-size: 15px;
}

.custom_grid table th:last-child {
    text-align: right !important;
}

.primary--text {
    color: #03b154;
}

@media (min-width: 1264px) {
    .container {
        max-width: 1250px;
    }
}

@media (max-width: 576px) {
    .pt-6.col-sm-5.col-12 {
        padding-top: 0 !important;
    }

    .code_text {
        width: 100%;
    }

    .phone_no_pt {
        padding-top: 0 !important;
    }

    .select_template,
    .save_option {
        margin-bottom: 10px;
    }
}

.hide_small_bar_class {
    max-width: 0;
    transition: .5s ease-in;
    flex: 0 0 0;
}

.hide_big_bar_class {
    max-width: 100%;
    transition: .5s ease-in;
    flex: 0 0 100%;
}

.info_add {
    background-color: #ffffff;
}

.small_sidebar {
    height: 98%;
    position: relative;
    padding: 12px;
    background-color: #EDF1F5;
}

.iconArrow {
    right: -35px;
    position: absolute;
    bottom: -10px;
}

.iconArrowHide {
    position: absolute;
    right: -7px;
    bottom: -10px;
}

.color_grey {
    color: #808080;
}

.card_green {
    min-height: 70px;
    background-color: #00b050 !important;
    color: #ffffff;
}

.lb_bold {
    font-size: 12px;
}

.detial_smallside_p {
    position: absolute;
    bottom: 10px;
}

.card_background {
    background-color: #EDF1F5;
    min-height: 120px;
}

.deposite_input {
    width: 100px;
}

.btn_save_draft {
    color: #ffffff;
    background-color: #00b0f0 !important;
    text-transform: capitalize;
}

.save_option {
    background-color: #203864 !important;
}

.btn_add_small {
    height: 27px !important;
    min-width: 25px !important;
    font-size: 10px;
    padding: 0 22px !important;
    background-color: #00b050 !important;
    color: #ffffff;
    border-radius: 0 !important;
}

.list_site_inv {
    background-color: #92d050;
    color: #ffffff;
    font-size: 12px;
}

.list_site_exp {
    background-color: #c5e0b4;
    color: #000000;
    font-size: 12px;
    line-height: 16px;
    min-height: 40px;
}

.checkbox_inv {
    padding: 2px;
    margin-top: 3px;
    margin-right: 2px;
}

.exp_select {
    font-size: 12px !important;
}

.theme--light.v-data-table td {
    border-bottom: 1px solid #808080;
    border-top: 1px solid #808080;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background-color: transparent !important;
}

</style>