<template>
    <v-app class="zoom-in">
        <v-container>
            <v-row>
                <v-col sm="12" cols="12">
                    <v-card
                        outlined
                        dense
                        class="pa-4 no_border rounded-sm"
                        color="white"
                    >
                        <v-row>
                            <v-col
                                class="bigSide pr-2 py-0"
                                sm="12"
                                cols="12"
                                style="transition: .3s ease-in;"
                                :class="{ hide_big_bar_class: isHideBar }"
                            >
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-card outlined dense class="no_border">
                                        <h2 class="mb-0">{{ $t("invoice") }}</h2>
                                        <v-icon
                                            @click="cancel()"
                                            style="cursor: pointer; color: #333; font-size: 40px;"
                                            class="float-right"
                                        >close
                                        </v-icon>
                                    </v-card>
                                    <v-card outlined dense class="px-4 no_border" color="grayBg">
                                        <v-row>
                                            <v-col sm="4" cols="12" class="pb-0 pt-4">
                                                <label class="label  mb-0">{{ $t("customer") }}</label>
                                                <v-col
                                                    sm="12"
                                                    cols="12"
                                                    class="kendo_dropdown_custom px-0 pb-4 pt-0"
                                                >
                                                    <dropdownlist
                                                        :data-items="customerList"
                                                        @change="onChange"
                                                        :value="customer"
                                                        :data-item-key="dataItemKey"
                                                        :text-field="textField"
                                                        :default-item="defaultItem"
                                                        :filterable="true"
                                                        :required="true"
                                                        :disabled="disabledMe"
                                                        :valid="validCustomer"
                                                        @filterchange="onFilterChange"
                                                    >
                                                    </dropdownlist>
                                                </v-col>
                                                <label class="label mb-0">{{ $t("segment") }}</label>
                                                <v-select
                                                    class="mt-1"
                                                    v-model="invoice.segment"
                                                    :items="segments"
                                                    item-value="id"
                                                    @change="loadSaleOrder"
                                                    :item-text="(item) => `${item.code} - ${item.name}`"
                                                    :rules="[(v) => !!v['id'] || $t('is required!')]"
                                                    return-object
                                                    tage="sub Of"
                                                    disabled
                                                    placeholder="Sub Of"
                                                    outlined=""
                                                />
                                                <!-- <label class="label mb-0">{{ $t("location") }}</label>
                        <v-select
                          class="mt-1"
                          v-model="invoice.location"
                          :items="locations"
                          @change="loadSaleOrder"
                          item-value="id"
                          :item-text="(item) => `${item.code} - ${item.name}`"
                          :rules="[(v) => !!v['id'] || $t('is required!')]"
                          return-object
                          tage="Location"
                          placeholder="bu/location"
                          outlined=""
                        /> -->
                                            </v-col>
                                            <v-col sm="4" cols="12" class="pt-4 pb-0">
                                                <label class="label  mb-0">{{ $t("date") }}</label>
                                                <app-datepicker
                                                    :initialDate="invoice.transactionDate"
                                                    :disabled="disabledMe"
                                                    @onChanged="onInvoiceDateChanged"
                                                    @emitDate="invoice.transactionDate = $event"
                                                />
                                                <label class="label mb-0">{{ $t("number") }}</label>
                                                <div class="mt-1 d-flex mr-0">
                                                    <div class="code_text flex-1 text-bold">
                                                        {{ invoice.transactionType.abbr }}
                                                    </div>
                                                    <v-text-field
                                                        class="flex-2 custom-border "
                                                        v-model="invoice.number"
                                                        outlined
                                                        disabled
                                                        :rules="[(v) => !!v || 'Number is required']"
                                                        required
                                                    />
                                                    <v-icon
                                                        color="black"
                                                        size="30"
                                                        style="height:40px;"
                                                        class="border_qrcode ml-1"
                                                        @click="generateNumber"
                                                    >mdi-qrcode
                                                    </v-icon>
                                                </div>

                                                <!-- <label class="label mb-0">{{
                          $t("price_level")
                        }}</label>
                        <v-select
                          class="mt-1"
                          v-model="invoice.priceLevel"
                          :items="priceLevel"
                          item-value="id"
                          @change="onPriceLevelChange"
                          item-text="name"
                          return-object
                          placeholder="Price Level"
                          tage="Default Price Level"
                          outlined
                          :rules="[(v) => !!v['id'] || $t('is_required')]"
                        /> -->
                                            </v-col>
                                            <v-col sm="4" cols="12" class="pt-4 pb-0">
                                                <label class="label mb-0">{{ $t("term") }}</label>
                                                <v-select
                                                    class="mt-1"
                                                    v-model="invoice.paymentTerm"
                                                    :items="paymentTerms"
                                                    @change="onPaymentTermChanged"
                                                    placeholder="Term"
                                                    :rules="[(v) => !!v['id'] || $t('is required!')]"
                                                    item-text="name"
                                                    item-value="id"
                                                    return-object
                                                    outlined
                                                />
                                                <label class="label  mb-0">{{ $t("due_date") }}</label>
                                                <app-datepicker
                                                    :initialDate="invoice.dueDate"
                                                    @emitDate="dueDate = $event"
                                                />
                                            </v-col>
                                        </v-row>
                                    </v-card>

                                    <v-row style="background-color: #fff;">
                                        <v-col sm="12" cols="12" class="pt-4 pb-0 px-4">
                                            <kendo-datasource
                                                ref="itemLineDS"
                                                :data="itemLines"
                                                :change="dataSourceChanged"
                                            />
                                            <kendo-grid
                                                id="gridItemLine"
                                                class="grid-function"
                                                :data-source-ref="'itemLineDS'"
                                                :sortable="false"
                                                :column-menu="true"
                                                :editable="true"
                                                :scrollable-virtual="true"
                                            >
                                                <kendo-grid-column
                                                    :command="{
                            iconClass: 'k-icon k-i-trash',
                            text: ' ',
                            click: removeRow,
                            class: 'btn-plus',
                          }"
                                                    :title="''"
                                                    :width="63"
                                                    :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                                                />
                                                <kendo-grid-column
                                                    :title="$t('no.')"
                                                    :width="53"
                                                    :column-menu="false"
                                                    :template="rowNumberTmpl"
                                                    :headerAttributes="{
                            style: 'background-color: #EDF1F5;',
                            class: 'text-products',
                          }"
                                                    :attributes="{ style: 'text-align: products' }"
                                                />
                                                <kendo-grid-column
                                                    :field="'serviceDate'"
                                                    :title="$t('date_from')"
                                                    :width="200"
                                                    :hidden="!saleFormContent.serviceDate"
                                                    :template="
                            '<span>#= kendo.toString(new Date(serviceDate), dateFormat)#</span>'
                          "
                                                    :editor="ServiceDateEditor"
                                                    :headerAttributes="{
                            style: 'background-color: #EDF1F5',
                          }"
                                                />
                                                <kendo-grid-column
                                                    :field="'serviceDateTo'"
                                                    :title="$t('date_to')"
                                                    :width="200"
                                                    :hidden="!saleFormContent.serviceDateTo"
                                                    :template="
                            '<span>#= kendo.toString(new Date(serviceDateTo), dateFormat)#</span>'
                          "
                                                    :editor="ServiceDateToEditor"
                                                    :headerAttributes="{
                            style: 'background-color: #EDF1F5',
                          }"
                                                />
                                                <kendo-grid-column
                                                    :field="'item'"
                                                    :title="$t('item')"
                                                    :template="itemTemplate"
                                                    :editor="ItemDropDownEditor"
                                                    :attributes="{ class: 'tb_name_td' }"
                                                    :width="200"
                                                    :headerAttributes="{
                            style: 'background-color: #EDF1F5',
                          }"
                                                />
                                                <kendo-grid-column
                                                    :field="'description'"
                                                    :title="$t('description')"
                                                    :template="'<span>#=description#</span>'"
                                                    :width="200"
                                                    :headerAttributes="{
                            style: 'background-color: #EDF1F5',
                          }"
                                                />

                                                <kendo-grid-column
                                                    :field="'qoh'"
                                                    :title="$t('on_hand')"
                                                    :template="qohTemplate"
                                                    :width="170"
                                                    :editable="
                            () => {
                              return false;
                            }
                          "
                                                    :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                                                    :attributes="{ style: 'text-align: right; ' }"
                                                />
                                                <kendo-grid-column
                                                    :field="'qty'"
                                                    :title="$t('qty')"
                                                    :format="'{0:n}'"
                                                    :editor="numberEditor"
                                                    :template="'<span>#=qty || 0#</span>'"
                                                    :width="90"
                                                    :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                                                    :attributes="{ style: 'text-align: right; ' }"
                                                />
                                                <kendo-grid-column
                                                    :field="'uom'"
                                                    :title="$t('uom')"
                                                    :width="100"
                                                    :template="UOMTemplate"
                                                    :editor="UOMDropDownEditor"
                                                    :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                                                    :attributes="{ style: 'text-align: left' }"
                                                />
                                                <kendo-grid-column
                                                    :field="'price'"
                                                    :title="$t('price')"
                                                    :width="120"
                                                    :template="
                            '<span>#=kendo.toString(price || 0, decimalFormat)#</span>'
                          "
                                                    :editor="numberEditor"
                                                    :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                                                    :attributes="{ style: 'text-align: right' }"
                                                />
                                                <kendo-grid-column
                                                    :field="'amount'"
                                                    :title="$t('amount')"
                                                    :width="120"
                                                    :editable="
                            () => {
                              return false;
                            }
                          "
                                                    :template="
                            '<span>#=kendo.toString(amount || 0, decimalFormat)#</span>'
                          "
                                                    :editor="numberEditor"
                                                    :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                                                    :attributes="{ style: 'text-align: right' }"
                                                />

                                                <kendo-grid-column
                                                    :field="'discountItem'"
                                                    :title="$t('discount_item')"
                                                    :width="120"
                                                    :hidden="!saleFormContent.discountItem"
                                                    :template="discountItemTemplate"
                                                    :editor="DiscountItemDropDownEditor"
                                                    :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                                                    :attributes="{ style: 'text-align: left' }"
                                                />
                                                <kendo-grid-column
                                                    :field="'saleUnit'"
                                                    :title="$t('sale_unit')"
                                                    :width="200"
                                                    :hidden="!saleFormContent.saleUnit"
                                                    :template="saleUnitTemplate"
                                                    :editor="SaleUnitDropDownEditor"
                                                    :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                                                    :attributes="{ style: 'text-align: left' }"
                                                />
                                                <kendo-grid-column
                                                    :field="'employee'"
                                                    :title="$t('employee')"
                                                    :width="200"
                                                    :hidden="!saleFormContent.employee"
                                                    :template="empImpl"
                                                    :editor="EmployeeDropDownEditor"
                                                    :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                                                    :attributes="{ style: 'text-align: left' }"
                                                />
                                            </kendo-grid>
                                        </v-col>
                                        <v-col sm="12" cols="12" class="pt-2">
                                            <v-btn
                                                color="primary"
                                                class="float-left btn_plus mr-2"
                                                @click="addRow"
                                            >
                                                <v-icon size="" class="ma-1">mdi-plus</v-icon>
                                            </v-btn>
                                        </v-col>
                                        <v-col sm="12" cols="12" class="py-0">
                                            <v-row>
                                                <v-col class="pt-0" sm="5" cols="6">
                                                    <v-card
                                                        class="no-boxshadow rounded-4 pa-3"
                                                        color="grayBg"
                                                    >
                                                        <v-row>
                                                            <v-col class="py-0 pa-4" sm="12" cols="12">
                                                                <label class="label mb-0">{{
                                                                        $t("billing_address")
                                                                    }}</label>
                                                                <v-select
                                                                    class="mt-1"
                                                                    v-model="invoice.billingAddress"
                                                                    :items="billingAddress"
                                                                    item-value="id"
                                                                    item-text="name"
                                                                    tage="Billing Address"
                                                                    placeholder="address"
                                                                    outlined
                                                                />
                                                                <label class="label mb-0">{{
                                                                        $t("pickup_delivery_address")
                                                                    }}</label>
                                                                <v-select
                                                                    class="mt-1"
                                                                    v-model="invoice.deliveryAddress"
                                                                    :items="deliveryAddress"
                                                                    item-value="id"
                                                                    item-text="name"
                                                                    tage="Pickup/ Delivery Address"
                                                                    placeholder="address"
                                                                    outlined
                                                                />
                                                                <label class="label  mb-0">{{
                                                                        $t("pickup_delivery_date_time")
                                                                    }}</label>
                                                                <app-datepicker
                                                                    :initialDate="invoice.deliveryDateTime"
                                                                    @emitDate="deliveryDateTime = $event"
                                                                />
                                                            </v-col>
                                                        </v-row>
                                                    </v-card>
                                                </v-col>
                                                <v-col class="pt-0" sm="7" cols="6">
                                                    <v-simple-table>
                                                        <template v-slot:default>
                                                            <tbody>
                                                            <tr>
                                                                <td class="text-left pr-0">
                                                                    {{ $t("subtotal") }}
                                                                </td>
                                                                <td class="text-center">:</td>
                                                                <td class="text-right">
                                                                    {{ numberFormat(invoice.subTotal) }}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="text-left pr-0">
                                                                    {{ $t("general_discount") }}
                                                                </td>
                                                                <td class="text-center">:</td>
                                                                <td class="text-right">
                                                                    ({{ numberFormat(invoice.discountTotal) }})
                                                                </td>
                                                            </tr>

                                                            <tr style="background: #F8F8F9">
                                                                <td class="text-left text-uppercase pr-0">
                                                                    {{ $t("total") }}
                                                                </td>
                                                                <td class="text-center">:</td>
                                                                <td
                                                                    class="text-right color_green text-bold"
                                                                    id="total"
                                                                >
                                                                    {{ numberFormat(invoice.total) }}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="text-left pr-0">
                                                                    {{ $t("deposit") }}
                                                                    <span class="float-right color_green">{{
                                                                            numberFormat(invoice.depositAmount)
                                                                        }}</span>
                                                                </td>
                                                                <td class="text-center">:</td>
                                                                <td class="text-right hide_form_alert">
                                                                    <v-text-field
                                                                        type="number"
                                                                        min="0"
                                                                        class=" text-right float-right deposite_input"
                                                                        v-model="invoice.depositDeduction"
                                                                        @change="onDepositDeductionChange"
                                                                        tage="Deposit"
                                                                        width="80"
                                                                        outlined
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="text-left">
                                                                    {{ $t("amount_due") }}
                                                                </td>
                                                                <td class="text-center">:</td>
                                                                <td class="text-right color_green text-bold">
                                                                    {{ numberFormat(invoice.remainingAmount) }}
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
                                        <v-alert type="warning" v-model="alert" dismissible>
                                            <span v-html="errorMessage"/>
                                        </v-alert>
                                        <v-menu>
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                    class="mr-2 float-left select_template"
                                                    v-on="on"
                                                >
                                                    {{
                                                        template >= 0
                                                            ? templatesForm[template].name
                                                            : $t("select_template")
                                                    }}
                                                    <v-icon size="" class="ma-1">expand_more</v-icon>
                                                </v-btn>
                                            </template>
                                            <v-list>
                                                <v-list-item-group>
                                                    <v-list-item
                                                        v-for="(item, index) in templatesForm"
                                                        @click="ChoseTemplate(index)"
                                                        :key="index"
                                                    >
                                                        <v-list-item-content>
                                                            <v-list-item-title>
                                                                {{ item.name }}
                                                            </v-list-item-title>
                                                        </v-list-item-content>
                                                    </v-list-item>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-menu>
                                        <v-btn
                                            outlined
                                            class="text-capitalize  black--text float-left"
                                            color="primary"
                                            @click="cancel"
                                        >{{ $t("cancel") }}
                                        </v-btn>
                                        <!--                    <v-menu>-->
                                        <!--                      <template v-slot:activator="{ on }">-->
                                        <!--                        <v-btn-->
                                        <!--                            class="ml-2 float-right text-capitalize  white&#45;&#45;text"-->
                                        <!--                            color="secondary"-->
                                        <!--                            v-on="on"-->
                                        <!--                        >-->
                                        <!--                          {{ $t("save_option") }}-->
                                        <!--                          <v-icon size="" class="ma-1">expand_more</v-icon>-->
                                        <!--                        </v-btn>-->
                                        <!--                      </template>-->
                                        <!--                      <v-list rounded>-->
                                        <!--                        <v-list-item-group>-->
                                        <!--                          <v-list-item>-->
                                        <!--                            <v-list-item-content>-->
                                        <!--                              <v-list-item-title-->
                                        <!--                                  v-if="!isEdit"-->
                                        <!--                                  @click="saveNew"-->
                                        <!--                              >-->
                                        <!--                                {{ $t("save_new") }}-->
                                        <!--                              </v-list-item-title>-->
                                        <!--                            </v-list-item-content>-->
                                        <!--                          </v-list-item>-->
                                        <!--                          <v-list-item>-->
                                        <!--                            <v-list-item-content>-->
                                        <!--                              <v-list-item-title @click="onSaveClose(false, 1)">-->
                                        <!--                                {{ $t("save_print") }}-->
                                        <!--                              </v-list-item-title>-->
                                        <!--                            </v-list-item-content>-->
                                        <!--                          </v-list-item>-->
                                        <!--                          &lt;!&ndash; <v-list-item>-->
                                        <!--                            <v-list-item-content>-->
                                        <!--                              <v-list-item-title>{{-->
                                        <!--                                  $t('save_draft')-->
                                        <!--                                }}-->
                                        <!--                              </v-list-item-title>-->
                                        <!--                            </v-list-item-content>-->
                                        <!--                          </v-list-item> &ndash;&gt;-->
                                        <!--                          <v-list-item>-->
                                        <!--                            <v-list-item-content>-->
                                        <!--                              <v-list-item-title @click="onSaveClose(true, 0)"-->
                                        <!--                              >{{ $t("save_send_close") }}-->
                                        <!--                              </v-list-item-title>-->
                                        <!--                            </v-list-item-content>-->
                                        <!--                          </v-list-item>-->
                                        <!--                        </v-list-item-group>-->
                                        <!--                      </v-list>-->
                                        <!--                    </v-menu>-->
                                        <v-btn
                                            class="float-right text-capitalize  white--text"
                                            @click="onSaveClose('close', false, 0)"
                                            color="primary"
                                        >{{ $t("save_close") }}
                                        </v-btn>
                                        <v-btn
                                            color="secondary"
                                            style="margin-right: 10px !important"
                                            class="white--text float-right text-capitalize"
                                            @click="onSaveClose('new', false, 0)"
                                            :hidden="hiddenButton"
                                        >
                                            {{ $t("save_new") }}
                                        </v-btn>
                                    </v-card>
                                </v-form>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <LoadingMe :isLoading="showLoading" :fullPage="false" :myLoading="true"/>
        </v-container>
    </v-app>
</template>

<script>
// import kendo from "@progress/kendo-ui"
import {i18n} from "@/i18n";
import DatePickerComponent from "@/components/custom_templates/DatePickerComponent";
import InvoiceModel from "@/scripts/invoice/model/Invoice";
import ItemLineModel from "@/scripts/invoice/model/ItemLine";
import {uuid} from "vue-uuid";
import paymentTermHandler_ from "@/scripts/paymentterm/handler/paymentTermHandler";
import {DropDownList} from "@progress/kendo-vue-dropdowns";
import kendo from "@progress/kendo-ui";
import SaleFormContentModel from "@/scripts/model/SaleFormContent";
// import kendo from "@progress/kendo-ui";
import {ShowResource} from "@/observable/store";
import {getPrint} from "@/form/invoices.js";
import creditLimitHandler from "@/scripts/creditLimit/handler/creditLimitHandler";
import PaymentOptionModel from "@/scripts/model/PaymentOption";
import {PAYMENT_OPINION_TYPE} from "@/scripts/default_setup/Setting";

const customerHandler = require("@/scripts/customerHandler");

const projectHandler = require("@/scripts/projectHandler");
const priceLevelHandler = require("@/scripts/priceLevelHandler");
const currencyHandler = require("@/scripts/currency/handler/currencyHandler");
const saleOrderHandler = require("@/scripts/transactionHandler");

// const settingsHandler = require("@/scripts/settingsHandler");
const saleChannelHandler = require("@/scripts/saleChannelHandler");
const employeeHandler = require("@/scripts/employeeHandler");
const locationHandler = require("@/scripts/locationHandler");
// const paymentTermHandler = require("@/scripts/paymentTermHandler")

const paymentTermHandler = require("@/scripts/settingsHandler");
const accountHandler = require("@/scripts/handler/accounting/accountHandler");
const productVariantHandler = require("@/scripts/productVariantHandler");
const uomPriceHandler = require("@/scripts/uomPriceHandler");
const uomConversionHandler = require("@/scripts/uomConversionHandler");
const discountItemHandler = require("@/scripts/discountItemHandler");
const settingHandler = require("@/scripts/settingHandler");
const itemModifierHandler = require("@/scripts/itemModifierHandler");
const saleUnitItemHandler = require("@/scripts/saleUnitItemHandler");
const otherChargeHandler = require("@/scripts/otherChargeHandler");
const saleFormContentHandler = require("@/scripts/saleFormContentHandler");
const prefixHandler = require("@/scripts/prefixHandler");
const billingHandler = require("@/scripts/invoice/handler/billingHandler");
const lateFeeHandler = require("@/scripts/lateFeeHandler");
const paymentOptionHandler = require("@/scripts/paymentOptionHandler");
const catalogHandler = require("@/scripts/catalogHandler");
const loanHandler = require("@/scripts/loanHandler")
import {dataStore} from '@/observable/store'
const invoiceModel = new InvoiceModel({});
const itemLineModel = new ItemLineModel({});
const saleFormContentModel = new SaleFormContentModel({});
const $ = require("jquery");

const textField = "numberName";
const keyField = "id";
const defaultItem = {[textField]: "Select customer...", [keyField]: null};
const emptyItem = {[textField]: "loading ..."};
const pageSize = 10;
const itemLinePrefix = "lin-";
const loadingData = [];
while (loadingData.length < pageSize) {
    loadingData.push({...emptyItem});
}
const OPTION_TYPE = "Customer";
const strFilter = "?optionType=" + OPTION_TYPE;
const DISCOUNT_TYPE = "?type=Sale";
const cookieJS = require("@/cookie.js");
const cookie = cookieJS.getCookie();
export default {
    name: "CustomerInvoice",
    props: ["id", "transactionDate"],
    components: {
        LoadingMe: () => import(`@/components/Loading`),
        "app-datepicker": DatePickerComponent,
        dropdownlist: DropDownList,
    },
    data: () => ({
        isEdit: false,
        mOtherCharge: [],
        mOtherChargeAmount: [],
        numSelect: [1],
        dialogTax: false,
        customerList: [],
        showLoading: false,
        showLoadingTxn: false,
        alert: false,
        files: [],
        // Form validation
        valid: true,
        itemLines: [],
        invoiceDate: new Date().toISOString().substr(0, 10),
        template: -1,
        templatesForm: [],
        isHideBar: false,
        gridSchema: {
            model: {
                id: "id",
            },
        },
        customer: {},
        defaultItem: defaultItem,
        invoice: invoiceModel,
        transactionType: ["Invoice", "Commercial Invoice", "Tax Invoice"],
        cusBaseUrl: customerHandler.search(),
        empBaseUrl: employeeHandler.search(),
        init: {method: "GET", accept: "application/json", headers: []},
        pendingRequest: undefined,
        requestStarted: false,
        skip: 0,
        tempSkip: null,
        total: 0,
        filter: "",
        referenceNo: "",
        filter_: "",
        textField: "numberName",
        dataItemKey: "id",
        segments: [],
        saleChannelList: [],
        employees: [],
        mEmployee: {},
        customerProjects: [],
        billingAddress: [],
        deliveryAddress: [],
        deliveryDateTime: new Date().toISOString().substr(0, 10),
        priceLevel: [],
        locations: [],
        paymentTerms: [],
        receivableAcc: [],
        currencies: [],
        itemLine: itemLineModel,
        uoms: [],
        otherTax: [],
        vatTax: [],
        specificTax: [],
        publicLightingTax: [],
        saleUnitItemList: [],
        specificDiscountItem: [],
        otherChargeList: [],
        depositBalance: 0,
        schemaDefinition: {
            model: {
                id: "id",
            },
        },
        saleFormContent: saleFormContentModel,
        taxListTotal: {},
        invoiceTypes: [],
        customerDiscountItem: [],
        customerSaleUnit: [],
        customerSaleUnitLine: [],
        lateFeeList: [],
        loggedUser: {
            id: cookie.creator,
            name: cookie.email,
        },
        paymentOptionWBMobile: [],
        paymentOptionOnline: [],
        paymentOptionKHQR: [],
        paymentOptionBankTransfer: [],
        exchangeRate: {},
        baseCurrencyCode: "",
        currencyCode: "",
        transactionRate: 1,
        jRaw: [],
        catalogs: [],
        dialogCatalog: false,
        saleOrders: [],
        isPriceLevelChanged: false,
        cashPayment: [],
        billPayment: [],
        qrPayment: [],
        bankTransfer: [],
        refFrom: [],
        taxListDetail: [],
        tax: [],
        isAdded: false,
        businessCategory: [],
        itemList: [],
    }),
    methods: {
        autoCalculateTaxDetail() {
            let ids = [];
            this.taxListDetail.forEach((n) => {
                ids.push(n.id || "");
            });
            const unique = [...new Set(ids)];
            let result = [];
            unique.forEach((m) => {
                let amount = 0,
                    row = {},
                    discount = 0,
                    xDiscount = 0,
                    xAmount = 0,
                    taxAmount = 0,
                    xTaxAmount = 0;
                let taxDetail = [],
                    isVat = 0;
                const found = this.taxListDetail.filter((n) => n.id === m);
                // window.console.log('taxListDetailids', found)
                found.forEach((k) => {
                    row = k;
                    if (k.isVat === 1) {
                        isVat = 1;
                        const detail_ = k.detail || {};
                        taxDetail.push(detail_);
                    }
                    taxAmount += k.taxAmount_ || 0;
                    xTaxAmount += (k.taxAmount_ || 0) * (k.txnRate || 1);
                    amount += k.amount || 0;
                    xAmount += (k.amount || 0) * (k.txnRate || 1);
                    discount += k.discount || 0;
                    xDiscount += (k.discount || 0) * (k.txnRate || 1);
                });
                let spTaxAmt = 0,
                    spXTaxAmt = 0,
                    plTaxAmt = 0,
                    plXTaxAmt = 0,
                    otTaxAmt = 0,
                    otXTaxAmt = 0,
                    spTaxName = "",
                    plTaxName = "",
                    otTaxName = "",
                    spTaxNameLocale = "",
                    plTaxNameLocale = "",
                    otTaxNameLocale = "",
                    spAccId = "",
                    plAccId = "",
                    otAccId = "",
                    spRate = "",
                    plRate = "",
                    otRate = "";
                taxDetail.forEach((n) => {
                    const spTax = n.specificTax || {};
                    const plTax = n.publicLightingTax || {};
                    const otherTax = n.otherTax || {};
                    if (Object.keys(spTax).length > 0) {
                        spTaxAmt += spTax.taxAmount_ || 0;
                        spXTaxAmt += (spTax.taxAmount_ || 0) * (spTax.taxRate || 1);
                        spTaxName = spTax.defaultTax || "";
                        spTaxNameLocale = spTax.defaultTaxLocale || "";
                        spAccId = spTax.account ? spTax.account.id : "";
                        spRate = spTax.rate || 1;
                    }
                    if (Object.keys(plTax).length > 0) {
                        plTaxAmt += plTax.taxAmount_ || 0;
                        plXTaxAmt += (plTax.taxAmount_ || 0) * (plTax.taxRate || 1);
                        plTaxName = plTax.defaultTax || "";
                        plTaxNameLocale = plTax.defaultTaxLocale || "";
                        plAccId = plTax.account ? plTax.account.id : "";
                        plRate = plTax.rate || 1;
                    }
                    if (Object.keys(otherTax).length > 0) {
                        otTaxAmt += otherTax.taxAmount_ || 0;
                        otXTaxAmt += (otherTax.taxAmount_ || 0) * (plTax.taxRate || 1);
                        otTaxName = otherTax.defaultTax || "";
                        otTaxNameLocale = otherTax.defaultTaxLocale || "";
                        otAccId = otherTax.account ? otherTax.account.id : "";
                        otRate = otherTax.rate || 1;
                    }
                });
                if (isVat === 1) {
                    row.detail = {
                        specificTax: {
                            name: spTaxName,
                            nameLocale: spTaxNameLocale,
                            amount: spTaxAmt,
                            exchangeAmount: spXTaxAmt,
                            accountId: spAccId,
                            rate: spRate,
                        },
                        publicLightingTax: {
                            name: plTaxName,
                            nameLocale: plTaxNameLocale,
                            amount: plTaxAmt,
                            exchangeAmount: plXTaxAmt,
                            accountId: plAccId,
                            rate: plRate,
                        },
                        otherTax: {
                            name: otTaxName,
                            nameLocale: otTaxNameLocale,
                            amount: otTaxAmt,
                            exchangeAmount: otXTaxAmt,
                            accountId: otAccId,
                            rate: otRate,
                        },
                    };
                } else {
                    row.detail = {};
                }

                row["amount"] = amount;
                row["exchangeAmount"] = xAmount;
                row["taxAmount"] = taxAmount;
                row["exchangeTaxAmount"] = xTaxAmount;
                row["discount"] = discount;
                row["exchangeDiscount"] = xDiscount;
                row["currency"] = this.invoice.exchangeRate || {};
                result.push(row);
                taxDetail = [];
            });
            this.invoice.saleTaxDetail = result;
            window.console.log("saleTaxDetail", result);
        },
        ChoseTemplate(i) {
            window.console.log(i);
            this.template = i;
        },
        shrinkDiscountItem(discountItem, discountLine) {
            let uniqueDiscountItems = [];
            const unique = this.removeDuplicate(discountItem);
            unique.forEach((m) => {
                const found = discountLine.filter((n) => n.id === m.id);
                let amount = 0,
                    exchangeAmount = 0;
                found.map((o) => {
                    amount += o.amount;
                });
                found.map((o) => {
                    exchangeAmount += o.exchangeAmount;
                });
                uniqueDiscountItems.push({
                    id: m.id,
                    name: m.name,
                    amount: amount,
                    exchangeAmount: exchangeAmount,
                });
            });
            this.customerDiscountItem = uniqueDiscountItems;
            window.console.log(uniqueDiscountItems, "uniqueDiscountItems");
        },
        addSaleOrder(item) {
            if (item) {
                const itemLine = item.itemLines || [];
                this.refFrom.push({
                    id: item.id || "",
                    reference: item.referenceNo || "",
                });
                let ds = this.$refs.itemLineDS.kendoWidget(),
                    total = ds.total();
                itemLine.forEach((o) => {
                    this.itemLine = new ItemLineModel(o);
                    this.itemLine.id = itemLinePrefix + uuid.v1();
                    this.itemLine.decimalFormat = "n" + this.saleFormContent.decimal;
                    this.itemLine.sourceTransaction = {
                        id: item.id,
                        referenceNo: item.referenceNo,
                    };
                    this.itemLine.sourceTransactionRef = item.referenceNo;
                    ds.insert(total, this.itemLine);
                    // window.console.log(this.itemLine, 'itemLine')
                });
                this.itemLine = new ItemLineModel({});
                this.autoCalculate();
                const index = this.saleOrders.findIndex((itm) => {
                    return item.id === itm.id;
                });
                this.saleOrders.splice(index, 1);
                this.invoice.refFrom = this.removeDuplicate(this.refFrom);
            }
            // window.console.log(item, '--')
        },
        loadImage(dataItem) {
            if (dataItem.hasOwnProperty("images")) {
                if (dataItem.images.hasOwnProperty("default")) {
                    const url = this.imgURL + dataItem.images.default.thumb;
                    return (
                        "<img width='50' height='50' style= 'margin: auto;display: block;' src='" +
                        url +
                        "' />"
                    );
                }
            } else {
                return "";
            }
        },
        async loadCatalogs() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    this.showLoading = true;
                    catalogHandler.get().then((res) => {
                        this.showLoading = false;
                        this.catalogs = res;
                    });
                }, 10);
            });
        },
        addCatalog(e) {
            e.preventDefault();
            let grid = kendo.jQuery("#gridCatalog").data("kendoGrid");
            let dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
            // window.console.log(dataItem)
            if (dataItem.variants.length > 0) {
                dataItem.variants.forEach((m) => {
                    if (m.hasOwnProperty("variant")) {
                        if (m.variant.hasOwnProperty("id")) {
                            this.loadSingleItem(m.variant.id, "i");
                        }
                    }
                });
                this.dialogCatalog = false;
            }
            if (dataItem.services.length > 0) {
                dataItem.services.forEach((m) => {
                    if (m.hasOwnProperty("service")) {
                        if (m.service.hasOwnProperty("id")) {
                            this.loadSingleItem(m.service.id, "s");
                        }
                    }
                });
                this.dialogCatalog = false;
            }
        },
        qohTemplate(dataItem) {
            const buom = dataItem.buom || {};
            const qoh = dataItem.qoh || 0;
            if (buom.hasOwnProperty("name")) {
                return qoh + ` ` + buom.name;
            }
            return ``;
        },
        Help(key) {
            ShowResource(key);
        },
        numberEditor(container, options) {
            kendo
                .jQuery('<input data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    decimals: 30,
                    min: 0.00001,
                    format: `${this.saleFormContent.decimal}`,
                });
        },
        async loadPaymentOption() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    paymentOptionHandler
                        .list(strFilter)
                        .then((res) => {
                            this.showLoading = true;
                            if (res.data.statusCode === 200) {
                                this.showLoading = false;
                                const data = res.data.data || [];
                                this.cashPayment = data.filter(
                                    (m) => m.type === PAYMENT_OPINION_TYPE.CASH_PAYMENT
                                );
                                this.billPayment = data.filter(
                                    (m) => m.type === PAYMENT_OPINION_TYPE.BILL_PAYMENT
                                );
                                this.qrPayment = data.filter(
                                    (m) => m.type === PAYMENT_OPINION_TYPE.QR_PAYMENT
                                );
                                this.bankTransfer = data.filter(
                                    (m) => m.type === PAYMENT_OPINION_TYPE.BANK_TRANSFER
                                );
                            }
                        })
                        .catch();
                    {
                        this.showLoading = false;
                    }
                }, 10);
            });
        },
        vatTemplate(dataItem) {
            const vat = dataItem.vatTax;
            if (vat) {
                return `<span>${vat.defaultTax ? vat.defaultTax : ``}</span>`;
            } else {
                return ``;
            }
        },
        modifierTemplate(dataItem) {
            const modifier = dataItem.modifier;
            if (modifier) {
                return `<span>${modifier.name ? modifier.name : ``}</span>`;
            } else {
                return ``;
            }
        },
        itemTemplate(dataItem) {
            const item = dataItem.item;
            if (item) {
                return `<span>${item.name ? item.name : ``}</span>`;
            } else {
                return ``;
            }
        },
        UOMTemplate(dataItem) {
            const uom = dataItem.uom;
            if (uom) {
                return `<span>${uom.uom ? uom.uom.name : ``}</span>`;
            } else {
                return ``;
            }
        },
        saleUnitTemplate(dataItem) {
            const saleUnit = dataItem.saleUnit;
            if (saleUnit) {
                return `<span>${saleUnit.name ? saleUnit.name : ``}</span>`;
            } else {
                return ``;
            }
        },
        discountItemTemplate(dataItem) {
            const discountItem = dataItem.discountItem;
            if (discountItem) {
                return `<span>${discountItem.code ? discountItem.code : ``} - ${
                    discountItem.name ? discountItem.name : ``
                }</span>`;
            } else {
                return ``;
            }
        },
        addSelect() {
            let amount_num = this.numSelect.length;
            let num = this.numSelect[amount_num - 1];
            let new_num = num + 1;
            let lenghtItem = this.specificDiscountItem.length;
            if (new_num <= lenghtItem) {
                this.numSelect.push(new_num);
            }
        },
        removeSelect(index) {
            this.numSelect.splice(index, 1);
            // window.console.log(index, this.numSelect)
            // this.selectDiscount.splice(index,1)
            // window.console.log("remove",this.selectDiscount)
            // this.selectDiscount = this.selectDiscount.filter(item =>  item.id != val.id);
        },
        onOtherChargeChange() {
            let otherCharge = 0,
                amount = 0;
            this.invoice.otherChargeLine = [];
            this.mOtherCharge.forEach((m) => {
                amount = this.autoCalculateDiscount(m, this.invoice.subTotal);
                otherCharge += amount;
                this.invoice.otherChargeLine.push({
                    id: m.id,
                    name: m.name,
                    amount: amount,
                    exchangeAmount: amount * (this.invoice.txnRate || 1),
                });
            });
            this.invoice.otherChargeAmount = otherCharge;
            this.autoCalculate();
        },
        onOtherAmount(value) {
            return this.autoCalculateDiscount(value, this.invoice.subTotal);
        },
        onSpecificDiscountChanged() {
            this.invoice.specificDiscountTotal = 0;
            if (this.invoice.specificDiscountItem) {
                // window.console.log('-changed', this.invoice.specificDiscountItem)
                const discountInvoice = this.autoCalculateDiscount(
                    this.invoice.specificDiscountItem,
                    this.invoice.subTotal
                );
                this.invoice.specificDiscountTotal = kendo.parseFloat(
                    discountInvoice ? discountInvoice : 0
                );
                let total =
                    kendo.parseFloat(this.invoice.subTotal) -
                    (kendo.parseFloat(this.invoice.discountTotal) +
                        kendo.parseFloat(this.invoice.totalTaxAmount)) -
                    discountInvoice;
                this.invoice.total = total;
            }
            this.autoCalculate();
        },
        empImpl(dataItem) {
            let empIds = [];
            dataItem.employee.forEach((m) => {
                empIds.push(m.firstName + " - " + m.lastName);
            });
            // window.console.log(empIds.join(', '))
            return `<span>${empIds.join(", ")}</span>`;
        },
        async loadSaleFormContent() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    saleFormContentHandler.list().then((res) => {
                        if (res.data.statusCode === 200) {
                            const data = res.data.data;
                            if (data.length > 0) {
                                this.saleFormContent = data[0];
                                this.initData();
                            }
                        }
                    });
                }, 10);
            });
        },
        async loadSaleUnitItems() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    saleUnitItemHandler.list().then((res) => {
                        if (res.data.statusCode === 200)
                            this.saleUnitItemList = res.data.data;
                    });
                }, 10);
            });
        },
        uomTmp(dataItem) {
            window.console.log(dataItem);
            return dataItem;
        },
        loadItemUOM(itemId, priceLevelId) {
            window.console.log("p", itemId, priceLevelId);
        },
        async loadUOMPrice(itemId, priceLevelId) {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    uomPriceHandler.get(itemId).then((res) => {
                        const prices = res.filter((m) => m.priceLevel.id === priceLevelId);
                        window.console.log("price", prices, itemId, priceLevelId);
                    });
                }, 10);
            });
        },
        async loadUOMList(itemId) {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    uomConversionHandler.get(itemId).then((res) => {
                        this.uoms = res;
                        window.console.log("all UOm", res);
                    });
                }, 10);
            });
        },
        onInvoiceTypeChanged() {
            if (this.$route.params.id === null || this.$route.params.id === "") {
                this.generateNumber();
            }
            this.templateHandle();
        },
        templateHandle() {
            let temp = [];
            if (this.invoice.transactionType.name == "Commercial Invoice") {
                temp.push({
                    id: 0,
                    type: "Commercial Invoice",
                    name: "Template One",
                });
            } else if (this.invoice.transactionType.name == "General Invoice") {
                temp.push({
                    id: 0,
                    type: "General Invoice",
                    name: "Template One",
                });
            } else if (this.invoice.transactionType.name == "Tax Invoice") {
                temp.push({
                    id: 0,
                    type: "Tax Invoice",
                    name: "Template One",
                });
                temp.push({
                    id: 1,
                    type: "Tax Invoice2",
                    name: "Template Two",
                });
            }
            this.templatesForm = temp;
            this.template = 0;
        },
        autoCalculateTaxByType(tax) {
            // return by a key
            const groupAll = (list) =>
                list.reduce((tax, item) => {
                    const taxAmount = tax[item.name] || 0;
                    return Object.assign({}, tax, {
                        [item.name]: taxAmount + parseFloat(item.amount),
                    });
                }, {});
            this.taxListTotal = groupAll(tax);
            // window.console.log('nimol', groupAll(tax))
        },
        onDepositDeductionChange() {
            if (
                this.invoice.depositDeduction === "" ||
                this.invoice.depositDeduction === undefined
            ) {
                this.invoice.depositDeduction = 0;
            }

            const deduction = parseFloat(this.invoice.depositDeduction) || 0;
            const depA = parseFloat(this.invoice.depositAmount) || 0;
            const xAmount = parseFloat(this.invoice.exchangeAmount) || 0;
            let deduct = deduction;
            if (deduction > xAmount) {
                deduct = xAmount;
                if (deduct > depA) {
                    deduct = depA;
                }
            }
            this.invoice.depositDeduction = deduct;
            // if (deduction > this.invoice.depositAmount) {
            //     this.invoice.depositDeduction = this.invoice.depositAmount;
            // }
            // if (deduction > parseFloat(this.invoice.exchangeAmount)) {
            //     this.invoice.depositDeduction = this.invoice.exchangeAmount;
            // }
            window.console.log("this.invoice", this.invoice);
            this.autoCalculate();
        },
        autoCalculate() {
            let ds = this.$refs.itemLineDS.kendoWidget(),
                subTotal = 0,
                totalTax = 0,
                discountTotal = 0,
                spTax = 0,
                pltax = 0,
                otherTax = 0,
                vatTax = 0,
                discountInvoice = 0,
                taxList = [],
                taxListDetail = [],
                discountItem = [],
                saleUnit = [],
                inclusiveTax = 0,
                discountLine = [],
                saleUnitLine = [],
                itemSubtotal = 0,
                txnItmSubtotal = 0,
                serviceSubtotal = 0,
                itemDiscount = 0,
                serviceDiscount = 0,
                txnDiscount = 0;
            let nature = "";
            this.jRaw = [];
            const rows = ds.data().filter((m) => parseFloat(m.amount) > 0);
            rows.forEach((value) => {
                let modifierPrice = 0;
                let vatSpTax = {},
                    vatPLTax = {},
                    vatOtherTax = {};
                if (value.modifier) {
                    modifierPrice = kendo.parseFloat(value.modifier.price);
                }

                // subTotal += (kendo.parseFloat(value.amount) + modifierPrice)
                let discount = 0;
                if (value.discountItem) {
                    const disItemField = value.discountItem;
                    let subTo =
                        kendo.parseFloat(value.price) * kendo.parseFloat(value.qty);
                    discount = this.autoCalculateDiscount(value.discountItem, subTo);
                    value["discountAmount"] = discount;
                    value["discountExchangeAmount"] =
                        discount * kendo.parseFloat(this.invoice.txnRate);
                    // window.console.log('value', JSON.stringify(value))
                    if (value.discountItem.hasOwnProperty("id")) {
                        discountItem.push(value.discountItem);
                        discountLine.push({
                            id: value.discountItem.id,
                            name: value.discountItem.name,
                            amount: discount,
                            exchangeAmount: discount * parseFloat(this.invoice.txnRate),
                        });
                    }
                    discountTotal += discount ? discount : 0;
                    if (discount > 0) {
                        nature = "dr";
                    } else {
                        nature = "cr";
                    }
                    if (disItemField.account) {
                        if (disItemField.account.hasOwnProperty("id")) {
                            this.jRaw.push({
                                id: disItemField.account.id + "-" + nature,
                                // line: new ItemLineModel(value),
                                description: "Discount",
                                account: disItemField.account,
                                accountId: disItemField.account.id,
                                amount: discount,
                                exchangeAmount:
                                    discount * kendo.parseFloat(this.invoice.txnRate),
                                type: nature,
                                typeAs: "discount",
                            });
                        }
                    }
                }
                if (value.saleUnit) {
                    if (value.saleUnit.hasOwnProperty("id")) {
                        saleUnit.push(value.saleUnit);
                        const item_ = value.item || {};
                        const amount_ =
                            kendo.parseFloat(value.price) * kendo.parseFloat(value.qty) || 0;
                        const itemObj = {
                            id: item_.id || "",
                            name: item_.name || "",
                            amount: amount_ - (discount || 0),
                        };
                        saleUnitLine.push({
                            lineId: value.id || "",
                            id: value.saleUnit.id,
                            name: value.saleUnit.name,
                            item: itemObj,
                            amount: itemObj.amount,
                            exchangeAmount: itemObj.amount * (this.invoice.txnRate || 1),
                            discount: discount || 0,
                            exchangeDiscount: (discount || 0) * (this.invoice.txnRate || 1),
                        });
                    }
                }
                if (value.specificTax) {
                    spTax = this.autoCalculateTax(
                        value.specificTax,
                        kendo.parseFloat(value.amount) - kendo.parseFloat(discount)
                    );
                    spTax = kendo.parseFloat(spTax) ? kendo.parseFloat(spTax) : 0;
                    value["specificTaxAmount"] = spTax;
                    value["specificTaxExchangeAmount"] =
                        spTax * kendo.parseFloat(this.invoice.txnRate);
                    const tax = value.specificTax;
                    const baseAmount = tax.baseAmount;
                    if (baseAmount) {
                        if (baseAmount.toLowerCase() === "inclusive") {
                            inclusiveTax += spTax;
                        }
                    }
                    // window.console.log(value.specificTax)
                    if (value.specificTax.hasOwnProperty("taxType")) {
                        taxList.push({
                            name: value.specificTax.taxType.name,
                            amount: spTax,
                            id: value.specificTax.taxType.id,
                        });
                        const spTax_ = value.specificTax || {};
                        // spTax_['taxAmount'] = spTax
                        spTax_["taxAmount_"] = spTax;
                        spTax_["amount"] = value.amount || 0;
                        spTax_["discount"] = discount || 0;
                        spTax_["txnRate"] = this.invoice.txnRate || 1;
                        // delete tax_['account']
                        taxListDetail.push(spTax_);
                        vatSpTax = spTax_;
                    }
                    if (spTax * -1 > 0) {
                        nature = "dr";
                    } else {
                        nature = "cr";
                    }
                    const specificTaxField = value.specificTax;
                    if (specificTaxField.account) {
                        if (specificTaxField.account.hasOwnProperty("id")) {
                            this.jRaw.push({
                                id: specificTaxField.account.id + "-" + nature,
                                // line: new ItemLineModel(value),
                                description: "Tax",
                                account: specificTaxField.account,
                                accountId: specificTaxField.account.id,
                                amount: spTax * -1,
                                exchangeAmount:
                                    spTax * -1 * kendo.parseFloat(this.invoice.txnRate),
                                type: nature,
                                typeAs: "tax",
                            });
                        }
                    }
                }
                if (value.publicLightingTax) {
                    pltax = this.autoCalculateTax(
                        value.publicLightingTax,
                        kendo.parseFloat(value.amount) - kendo.parseFloat(discount)
                    );
                    pltax = kendo.parseFloat(pltax) ? kendo.parseFloat(pltax) : 0;
                    value["publicLightingTaxAmount"] = pltax;
                    value["publicLightingTaxExchangeAmount"] =
                        pltax * kendo.parseFloat(this.invoice.txnRate);
                    const tax = value.publicLightingTax;
                    const baseAmount = tax.baseAmount;
                    if (baseAmount) {
                        if (baseAmount.toLowerCase() === "inclusive") {
                            inclusiveTax += pltax;
                        }
                    }
                    if (value.publicLightingTax.hasOwnProperty("taxType")) {
                        taxList.push({
                            name: value.publicLightingTax.taxType.name,
                            amount: pltax,
                            id: value.publicLightingTax.taxType.id,
                        });
                        const plTax_ = value.publicLightingTax || {};
                        // plTax_['taxAmount'] = pltax
                        plTax_["taxAmount_"] = pltax;
                        plTax_["amount"] = value.amount || 0;
                        plTax_["discount"] = discount || 0;
                        plTax_["txnRate"] = this.invoice.txnRate || 1;
                        // delete tax_['account']
                        taxListDetail.push(plTax_);
                        vatPLTax = plTax_;
                    }
                    if (pltax * -1 > 0) {
                        nature = "dr";
                    } else {
                        nature = "cr";
                    }
                    const PLTaxField = value.publicLightingTax;
                    if (PLTaxField.account) {
                        if (PLTaxField.account.hasOwnProperty("id")) {
                            this.jRaw.push({
                                id: PLTaxField.account.id + "-" + nature,
                                // line: new ItemLineModel(value),
                                description: "Tax",
                                account: PLTaxField.account,
                                accountId: PLTaxField.account.id,
                                amount: pltax * -1,
                                exchangeAmount:
                                    pltax * kendo.parseFloat(this.invoice.txnRate) * -1,
                                type: nature,
                                typeAs: "tax",
                            });
                        }
                    }
                }
                if (value.otherTax) {
                    otherTax = this.autoCalculateTax(
                        value.otherTax,
                        kendo.parseFloat(value.amount) - kendo.parseFloat(discount)
                    );
                    otherTax = kendo.parseFloat(otherTax)
                        ? kendo.parseFloat(otherTax)
                        : 0;
                    value["otherTaxAmount"] = otherTax;
                    value["otherTaxExchangeAmount"] =
                        otherTax * kendo.parseFloat(this.invoice.txnRate);
                    const tax = value.otherTax;
                    const baseAmount = tax.baseAmount;
                    if (baseAmount) {
                        if (baseAmount.toLowerCase() === "inclusive") {
                            inclusiveTax += otherTax;
                        }
                    }
                    if (value.otherTax.hasOwnProperty("taxType")) {
                        taxList.push({
                            name: value.otherTax.taxType.name,
                            amount: otherTax,
                            id: value.otherTax.taxType.id,
                        });
                        const tax__ = value.otherTax || {};
                        // tax__['taxAmount'] = otherTax
                        tax__["taxAmount_"] = otherTax;
                        tax__["amount"] = value.amount || 0;
                        tax__["discount"] = discount || 0;
                        tax__["txnRate"] = this.invoice.txnRate || 1;
                        // delete tax_['account']
                        taxListDetail.push(tax__);
                        vatOtherTax = tax__;
                    }
                    if (otherTax * -1 > 0) {
                        nature = "dr";
                    } else {
                        nature = "cr";
                    }
                    const otherTaxField = value.otherTax;
                    if (otherTaxField.account) {
                        if (otherTaxField.account.hasOwnProperty("id")) {
                            this.jRaw.push({
                                id: otherTaxField.account.id + "-" + nature,
                                // line: new ItemLineModel(value),
                                description: "Tax",
                                account: otherTaxField.account,
                                accountId: otherTaxField.account.id,
                                amount: otherTax * -1,
                                exchangeAmount:
                                    otherTax * kendo.parseFloat(this.invoice.txnRate) * -1,
                                type: nature,
                                typeAs: "tax",
                            });
                        }
                    }
                }

                if (value.vatTax) {
                    // window.console.log('Vat Tax', value.vatTax)
                    let amt =
                        kendo.parseFloat(spTax ? spTax : 0) +
                        kendo.parseFloat(pltax ? pltax : 0) +
                        kendo.parseFloat(otherTax ? otherTax : 0) +
                        (kendo.parseFloat(value.amount ? value.amount : 0) -
                            (discount ? discount : 0));
                    vatTax = this.autoCalculateTax(value.vatTax, amt);
                    vatTax = kendo.parseFloat(vatTax) ? kendo.parseFloat(vatTax) : 0;
                    value["vatTaxAmount"] = vatTax;
                    value["vatTaxExchangeAmount"] =
                        vatTax * kendo.parseFloat(this.invoice.txnRate);
                    const tax = value.vatTax;
                    const baseAmount = tax.baseAmount;
                    if (baseAmount) {
                        if (baseAmount.toLowerCase() === "inclusive") {
                            inclusiveTax += vatTax;
                        }
                    }
                    if (value.vatTax.hasOwnProperty("taxType")) {
                        taxList.push({
                            name: value.vatTax.taxType.name,
                            amount: vatTax,
                            id: value.vatTax.taxType.id,
                        });
                        const vatTax_ = value.vatTax || {};
                        // vatTax_['taxAmount'] = vatTax
                        vatTax_["taxAmount_"] = vatTax;
                        vatTax_["amount"] = value.amount || 0;
                        vatTax_["discount"] = discount || 0;
                        vatTax_["txnRate"] = this.invoice.txnRate || 1;
                        vatTax_["isVat"] = 1;
                        vatTax_.detail = {
                            specificTax: vatSpTax,
                            publicLightingTax: vatPLTax,
                            otherTax: vatOtherTax,
                        };
                        // delete tax_['account']
                        taxListDetail.push(vatTax_);
                    }

                    if (vatTax * -1 > 0) {
                        nature = "dr";
                    } else {
                        nature = "cr";
                    }
                    const vatTaxField = value.vatTax;
                    if (vatTaxField.account) {
                        if (vatTaxField.account.hasOwnProperty("id")) {
                            this.jRaw.push({
                                id: vatTaxField.account.id + "-" + nature,
                                // line: new ItemLineModel(value),
                                description: "Tax",
                                account: vatTaxField.account,
                                accountId: vatTaxField.account.id,
                                amount: vatTax * -1,
                                exchangeAmount:
                                    vatTax * kendo.parseFloat(this.invoice.txnRate) * -1,
                                type: nature,
                                typeAs: "tax",
                            });
                        }
                    }
                }
                (vatSpTax = {}), (vatPLTax = {}), (vatOtherTax = {});
                totalTax +=
                    kendo.parseFloat(spTax ? spTax : 0) +
                    kendo.parseFloat(pltax ? pltax : 0) +
                    kendo.parseFloat(otherTax ? otherTax : 0) +
                    kendo.parseFloat(vatTax ? vatTax : 0);
                subTotal +=
                    kendo.parseFloat(value.amount) + modifierPrice - inclusiveTax;
                const amt =
                    kendo.parseFloat(value.amount) + modifierPrice - inclusiveTax;
                const xAmount =
                    kendo.parseFloat(amt) * kendo.parseFloat(this.invoice.txnRate) * -1;
                const item = value.item;
                const itmType = item.type || "";
                if (itmType === "Variant") {
                    itemSubtotal +=
                        kendo.parseFloat(value.price) * kendo.parseFloat(value.qty);
                    itemDiscount += kendo.parseFloat(discount);
                } else if (itmType === "Service") {
                    serviceSubtotal +=
                        kendo.parseFloat(value.price) * kendo.parseFloat(value.qty);
                    itemDiscount += kendo.parseFloat(discount);
                } else {
                    txnItmSubtotal +=
                        kendo.parseFloat(value.price) * kendo.parseFloat(value.qty);
                    itemDiscount += kendo.parseFloat(discount);
                }

                const conversionRate = value.conversionRate || 1;
                const bQty = parseFloat(value.qty * conversionRate);
                const wac = parseFloat(value.wac) || 0;
                const itemAmount = parseFloat(bQty) * wac;
                // const itemxAmount = itemAmount
                if (amt * -1 > 0) {
                    nature = "dr";
                } else {
                    nature = "cr";
                }
                if (item) {
                    if (item.type === "Service") {
                        if (value.isPlan) {
                            if (item.hasOwnProperty("deferredIncomeAcc")) {
                                if (item.deferredIncomeAcc.hasOwnProperty("id")) {
                                    let deferredInAcc = item.deferredIncomeAcc;
                                    this.jRaw.push({
                                        id: deferredInAcc.id + "-" + nature,
                                        // line: new ItemLineModel(value),
                                        description: this.invoice.journalNote,
                                        account: deferredInAcc,
                                        accountId: deferredInAcc.id,
                                        amount: amt * -1,
                                        exchangeAmount: xAmount,
                                        type: nature,
                                        typeAs: "item",
                                    });
                                }
                            }
                        } else {
                            let incomeAcc = item.incomeAcc;
                            if (item.hasOwnProperty("incomeAcc")) {
                                if (item.incomeAcc.hasOwnProperty("id")) {
                                    this.jRaw.push({
                                        id: incomeAcc.id + "-" + nature,
                                        // line: new ItemLineModel(value),
                                        description: this.invoice.journalNote,
                                        account: incomeAcc,
                                        accountId: incomeAcc.id,
                                        amount: amt * -1,
                                        exchangeAmount: xAmount,
                                        type: nature,
                                        typeAs: "item",
                                    });
                                }
                            }
                        }
                    } else if (item.type === "Variant") {
                        if (item.hasOwnProperty("incomeAcc")) {
                            if (item.incomeAcc.hasOwnProperty("id")) {
                                let incomeAcc = item.incomeAcc;
                                this.jRaw.push({
                                    id: incomeAcc.id + "-" + nature,
                                    // line: new ItemLineModel(value),
                                    description: this.invoice.journalNote,
                                    account: item.incomeAcc,
                                    accountId: item.incomeAcc.id,
                                    amount: amt * -1,
                                    exchangeAmount: xAmount,
                                    type: nature,
                                    typeAs: "item",
                                });
                            }
                        }
                        if (item.hasOwnProperty("inventoryAcc")) {
                            if (item.inventoryAcc.hasOwnProperty("id")) {
                                let inventoryAcc = item.inventoryAcc;
                                this.jRaw.push({
                                    id: inventoryAcc.id + "-" + "cr",
                                    // line: new ItemLineModel(value),
                                    description: this.invoice.journalNote,
                                    account: item.inventoryAcc,
                                    accountId: item.inventoryAcc.id,
                                    amount: 0, // qty*avg_cost ,
                                    exchangeAmount: itemAmount * -1, //xAmount,
                                    type: "cr",
                                    typeAs: "item",
                                });
                            }
                        }
                        if (item.hasOwnProperty("costOfGoodsSoldAcc")) {
                            if (item.costOfGoodsSoldAcc.hasOwnProperty("id")) {
                                let costOfGoodsSoldAcc = item.costOfGoodsSoldAcc;
                                this.jRaw.push({
                                    id: costOfGoodsSoldAcc.id + "-" + "dr",
                                    // line: new ItemLineModel(value),
                                    description: this.invoice.journalNote,
                                    account: item.costOfGoodsSoldAcc,
                                    accountId: item.costOfGoodsSoldAcc.id,
                                    amount: 0, // qty*avg_cost ,
                                    exchangeAmount: itemAmount, //xAmount,
                                    type: "dr",
                                    typeAs: "item",
                                });
                            }
                        }
                    } else if (item.type === "Fixed Asset") {
                        if (item.hasOwnProperty("assetAcc")) {
                            if (item.assetAcc.hasOwnProperty("id")) {
                                let assetAcc = item.assetAcc;
                                this.jRaw.push({
                                    id: assetAcc.id + "-" + nature,
                                    // line: new ItemLineModel(value),
                                    description: this.invoice.journalNote,
                                    account: item.assetAcc,
                                    accountId: item.assetAcc.id,
                                    amount: amt * -1,
                                    exchangeAmount: xAmount,
                                    type: nature,
                                    typeAs: "item",
                                });
                            }
                        }
                    } else if (item.type === "Transaction Item") {
                        if (item.hasOwnProperty("account")) {
                            if (item.account.hasOwnProperty("id")) {
                                this.jRaw.push({
                                    id: item.account.id + "-" + nature,
                                    // line: new ItemLineModel(value),
                                    description: this.invoice.journalNote,
                                    account: item.account,
                                    accountId: item.account.id,
                                    amount: amt * -1,
                                    exchangeAmount: xAmount,
                                    type: nature,
                                    typeAs: "item",
                                });
                            }
                        }
                    }
                }
                //include Tax Amount
                const amountNodiscount =
                    kendo.parseFloat(value.price) * kendo.parseFloat(value.qty) -
                    discount;
                const includeTaxAmount =
                    amountNodiscount + vatTax + pltax + spTax + otherTax;
                value["includeTaxAmount"] = includeTaxAmount;
                value["includeTaxExchangeAmount"] =
                    includeTaxAmount * kendo.parseFloat(this.invoice.txnRate);
                window.console.log("value", value);
            });
            this.invoice.itemSubtotal = itemSubtotal;
            this.invoice.exchangeItemSubtotal =
                itemSubtotal * kendo.parseFloat(this.invoice.txnRate);
            this.invoice.serviceSubtotal = serviceSubtotal;
            this.invoice.exchangeServiceSubtotal =
                serviceSubtotal * kendo.parseFloat(this.invoice.txnRate);
            this.invoice.txnItmSubtotal = txnItmSubtotal;
            this.invoice.exchangeTxnItmSubtotal =
                txnItmSubtotal * kendo.parseFloat(this.invoice.txnRate);
            this.invoice.itemDiscount = itemDiscount;
            this.invoice.exchangeItemDiscount =
                itemDiscount * kendo.parseFloat(this.invoice.txnRate);
            this.invoice.serviceDiscount = serviceDiscount;
            this.invoice.exchangeServiceDiscount =
                serviceDiscount * kendo.parseFloat(this.invoice.txnRate);
            this.invoice.txnItmDiscount = txnDiscount;
            this.invoice.exchangeTxnItmDiscount =
                txnDiscount * kendo.parseFloat(this.invoice.txnRate);
            // window.console.log(spTax, pltax, otherTax, vatTax)
            let total =
                kendo.parseFloat(subTotal) -
                kendo.parseFloat(discountTotal) +
                kendo.parseFloat(totalTax);
            this.invoice.subTotal = subTotal;
            this.invoice.exchangeSubTotal =
                subTotal * parseFloat(this.invoice.txnRate);
            // $("#subtotal").text(kendo.parseFloat(subTotal))
            this.invoice.totalTaxAmount = kendo.parseFloat(totalTax);
            this.invoice.discountTotal = kendo.parseFloat(discountTotal);
            if (this.invoice.specificDiscountItem) {
                discountInvoice = this.autoCalculateDiscount(
                    this.invoice.specificDiscountItem,
                    kendo.parseFloat(subTotal)
                );
                discountInvoice = discountInvoice ? discountInvoice : 0;
            }
            // this.onOtherChargeChange()
            this.invoice.total =
                kendo.parseFloat(total) -
                discountInvoice +
                kendo.parseFloat(this.invoice.otherChargeAmount);
            this.invoice.remainingAmount =
                kendo.parseFloat(this.invoice.total) -
                kendo.parseFloat(this.invoice.depositDeduction);
            this.invoice.amountDue =
                kendo.parseFloat(this.invoice.total) -
                kendo.parseFloat(this.invoice.depositDeduction);
            this.invoice.exchangeAmount =
                kendo.parseFloat(this.invoice.amountDue) *
                kendo.parseFloat(this.invoice.txnRate);
            // window.console.log('Exchange Amount', this.invoice.exchangeAmount)
            this.autoCalculateTaxByType(taxList);
            if (this.invoice.specificDiscountItem) {
                const specificDiscount = this.invoice.specificDiscountItem || {};
                if (specificDiscount.id) {
                    discountItem.push(specificDiscount);
                    discountLine.push({
                        id: specificDiscount.id,
                        name: specificDiscount.name,
                        amount: this.invoice.specificDiscountTotal,
                        exchangeAmount:
                            this.invoice.specificDiscountTotal * this.invoice.txnRate,
                    });
                }
            }
            const uniqueDiscountItem = this.removeDuplicate(discountItem);
            this.shrinkDiscountItem(uniqueDiscountItem, discountLine);
            this.customerSaleUnit = this.removeDuplicate(saleUnit);
            this.customerSaleUnitLine = saleUnitLine; //this.removeDuplicate(saleUnit)
            this.taxListDetail = taxListDetail;
            window.console.log("taxListDetail--", taxListDetail);
            // todo: raw Journal
            const receivableAcc = this.invoice.receivableAcc || {};
            if (this.invoice.amountDue > 0) {
                nature = "dr";
            } else {
                nature = "cr";
            }
            if (receivableAcc) {
                if (receivableAcc.hasOwnProperty("id")) {
                    this.jRaw.push({
                        id: receivableAcc.id + "-" + nature,
                        // line: new ItemLineModel({}),
                        description: this.invoice.journalNote,
                        account: receivableAcc,
                        accountId: receivableAcc.id,
                        exchangeAmount: this.invoice.exchangeAmount,
                        amount: this.invoice.amountDue,
                        type: nature,
                        typeAs: "ar",
                    });
                }
            }
            const specificDisc = this.invoice.specificDiscountItem;
            if (this.invoice.specificDiscountTotal > 0) {
                nature = "dr";
            } else {
                nature = "cr";
            }
            if (specificDisc) {
                if (specificDisc.hasOwnProperty("account")) {
                    if (specificDisc.account) {
                        if (specificDisc.hasOwnProperty("id")) {
                            this.jRaw.push({
                                id: specificDisc.account.id + "-" + nature,
                                // line: new ItemLineModel({}),
                                description: "Discount",
                                account: specificDisc.account || {},
                                accountId: specificDisc.account.id,
                                exchangeAmount:
                                    kendo.parseFloat(this.invoice.specificDiscountTotal) *
                                    kendo.parseFloat(this.invoice.txnRate),
                                amount: this.invoice.specificDiscountTotal,
                                type: nature,
                                typeAs: "discount",
                            });
                        }
                    }
                }
            }

            if (this.invoice.depositDeduction > 0) {
                nature = "dr";
            } else {
                nature = "cr";
            }
            this.invoice.exchangeDepositDeduction =
                (this.invoice.txnRate || 0) * this.invoice.depositDeduction;
            if (this.invoice.depositDeduction) {
                if (this.invoice.depositDeduction > 0) {
                    const saleDepositAcc = this.customer.saleDepositAcc || {};
                    if (saleDepositAcc) {
                        if (saleDepositAcc.hasOwnProperty("id")) {
                            this.jRaw.push({
                                id: saleDepositAcc.id + "-" + nature,
                                description: "Deposit",
                                // line: new ItemLineModel({}),
                                account: saleDepositAcc,
                                accountId: saleDepositAcc.id,
                                exchangeAmount: this.invoice.exchangeDepositDeduction,
                                amount: this.invoice.depositDeduction,
                                type: nature,
                                typeAs: "deposit",
                            });
                        }
                    }
                }
            }
            if (this.mOtherCharge.length > 0) {
                let otherCharge = 0;
                this.mOtherCharge.forEach((m) => {
                    otherCharge = this.autoCalculateDiscount(m, this.invoice.subTotal);
                    if (otherCharge * -1 > 0) {
                        nature = "dr";
                    } else {
                        nature = "cr";
                    }
                    if (m) {
                        if (m.hasOwnProperty("account")) {
                            if (m.account.hasOwnProperty("id")) {
                                const account = m.account;
                                if (account) {
                                    if (account.hasOwnProperty("id")) {
                                        this.jRaw.push({
                                            id: account.id + "-" + nature,
                                            // line: new ItemLineModel({}),
                                            description: "Other Charge",
                                            account: account,
                                            accountId: account.id,
                                            exchangeAmount:
                                                otherCharge *
                                                kendo.parseFloat(this.invoice.txnRate) *
                                                -1,
                                            amount: otherCharge * -1,
                                            type: nature,
                                            typeAs: "otherCharge",
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
                // this.invoice.otherChargeAmount = otherCharge

                window.console.log(this.mOtherCharge);
            }
            this.autoCalculateTaxDetail();
            // todo: end raw Journal
            // window.console.log(JSON.stringify(this.accounts), 'accounts')
            this.shrinkData(this.jRaw);
            // const unique = this.removeDuplicate(this.accounts)
            // window.console.log(unique, 'unique')
        },
        shrinkData(obj) {
            const uniques = this.removeDuplicate(
                obj
            ); /*[...new Set(accountId.map(i => {
                return {
                    id_: i.id_,
                    id: i.id,
                    type: i.type
                }
            }))]*/
            uniques.forEach((n) => {
                const found = obj.filter((m) => m.id === n.id);
                let amount = 0,
                    xAmount = 0;
                found.forEach((z) => {
                    amount += parseFloat(z.amount || 0);
                    xAmount += parseFloat(z.exchangeAmount || 0);
                });
                n.amount = parseFloat(amount); //this.numberFormat(amount)
                n.exchangeAmount = parseFloat(xAmount); //parseFloat(parseFloat(amount * parseFloat(this.invoice.txnRate))) //this.numberFormat(amount * parseFloat(this.invoice.txnRate)) //.toFixed(this.saleFormContent.decimal)
            });
            this.jRaw = uniques;
            let dr = 0,
                cr = 0;
            this.jRaw.forEach((j) => {
                switch (j.type) {
                    case "cr":
                        cr += parseFloat(j.amount);
                        break;
                    case "dr":
                        dr += parseFloat(j.amount);
                        break;
                    default:
                        break;
                }
            });
            this.invoice.dr = dr;
            this.invoice.cr = cr;
            window.console.log("dr=", dr, "cr=", cr, "dr+cr = ", dr + cr);
            window.console.log(JSON.stringify(uniques), "uniques");
        },
        rawForJournal() {
            //todo: DR side account receivable
            let itemLineDS = this.$refs.itemLineDS.kendoWidget();
            const dataRow = itemLineDS.data();
            this.jRaw = [];
            // window.console.log(dataRow, 'dataRow')
            dataRow.forEach((o) => {
                const item = o.item;
                const discountItem = o.discountItem;
                const vatTax = o.vatTax;
                const specificTax = o.specificTax;
                const PLTax = o.publicLightingTax;
                const otherTax = o.otherTax;
                if (item) {
                    if (item.type === "Service") {
                        let incomeAcc = item.incomeAcc;
                        if (item.hasOwnProperty("incomeAcc")) {
                            this.jRaw.push({
                                item: item,
                                line: o,
                                account: incomeAcc,
                                accountId: incomeAcc.id,
                                type: "cr",
                                typeAs: "item",
                            });
                        }
                        if (item.hasOwnProperty("deferredIncomeAcc")) {
                            let deferredInAcc = item.deferredIncomeAcc;
                            this.jRaw.push({
                                item: item,
                                line: o,
                                account: deferredInAcc,
                                accountId: deferredInAcc.id,
                                type: "cr",
                                typeAs: "item",
                            });
                        }
                    } else if (item.type === "Variant") {
                        this.jRaw.push({
                            item: item,
                            line: o,
                            account: item.incomeAcc,
                            accountId: item.incomeAcc.id,
                            type: "cr",
                            typeAs: "item",
                        });
                        this.jRaw.push({
                            item: item,
                            line: o,
                            account: item.inventoryAcc,
                            accountId: item.inventoryAcc.id,
                            type: "cr",
                            typeAs: "item",
                        });
                        this.jRaw.push({
                            item: item,
                            line: o,
                            account: item.costOfGoodsSoldAcc,
                            accountId: item.costOfGoodsSoldAcc.id,
                            type: "dr",
                            typeAs: "item",
                        });
                    } else if (item.type === "Fixed Asset") {
                        this.jRaw.push({
                            item: item,
                            line: o,
                            account: item.assetAcc,
                            accountId: item.assetAcc.id,
                            type: "cr",
                            typeAs: "item",
                        });
                    } else if (item.type === "Transaction Item") {
                        this.jRaw.push({
                            item: item,
                            line: o,
                            account: item.account,
                            accountId: item.account.id,
                            type: "cr",
                            typeAs: "item",
                        });
                    } else if (item.type === "Fixed Asset") {
                        this.jRaw.push({
                            item: item,
                            line: o,
                            account: item.account,
                            accountId: item.account.id,
                            type: "cr",
                            typeAs: "item",
                        });
                    }
                }
                if (discountItem.account) {
                    this.jRaw.push({
                        item: item,
                        line: o,
                        account: discountItem.account,
                        accountId: discountItem.account.id,
                        type: "dr",
                        typeAs: "discount",
                    });
                }
                if (vatTax.account) {
                    this.jRaw.push({
                        item: item,
                        line: o,
                        account: vatTax.account,
                        accountId: vatTax.account.id,
                        type: "cr",
                        typeAs: "tax",
                    });
                }
                if (specificTax.account) {
                    this.jRaw.push({
                        item: item,
                        line: o,
                        account: specificTax.account,
                        accountId: specificTax.account.id,
                        type: "cr",
                        typeAs: "tax",
                    });
                }
                if (PLTax.account) {
                    this.jRaw.push({
                        item: item,
                        line: o,
                        account: PLTax.account,
                        accountId: PLTax.account.id,
                        type: "cr",
                        typeAs: "tax",
                    });
                }
                if (otherTax.account) {
                    this.jRaw.push({
                        item: item,
                        line: o,
                        account: otherTax.account,
                        accountId: otherTax.account.id,
                        type: "cr",
                        typeAs: "tax",
                    });
                }
            });
            const receivableAcc = this.invoice.receivableAcc || {};
            if (receivableAcc) {
                this.jRaw.push({
                    item: {},
                    line: new ItemLineModel({}),
                    account: receivableAcc,
                    accountId: receivableAcc.id,
                    type: "dr",
                });
            }
            const specificDisc = this.invoice.specificDiscountItem;
            if (specificDisc.hasOwnProperty("account")) {
                if (specificDisc.account.hasOwnProperty("id")) {
                    this.jRaw.push({
                        item: {},
                        line: new ItemLineModel({}),
                        account: specificDisc.account || {},
                        accountId: specificDisc.account.id,
                        type: "dr",
                    });
                }
            }
            const saleDepositAcc = this.customer.saleDepositAcc || {};
            if (saleDepositAcc.hasOwnProperty("account")) {
                if (saleDepositAcc.account.hasOwnProperty("id")) {
                    this.jRaw.push({
                        item: {},
                        line: new ItemLineModel({}),
                        account: saleDepositAcc.account,
                        accountId: saleDepositAcc.account.id,
                        type: "dr",
                    });
                }
            }

            window.console.log(saleDepositAcc);
            if (this.mOtherCharge.length > 0) {
                window.console.log(this.mOtherCharge);
            }
            window.console.log(JSON.stringify(this.jRaw), "accounts");
            // todo: calculate Amount
        },
        removeDuplicate(array) {
            const result = [];
            const map = new Map();
            for (const item of array) {
                if (!map.has(item.id)) {
                    map.set(item.id, true); // set any value to Map
                    result.push(item);
                }
            }
            return result;
        },
        numberFormat(value) {
            // window.console.log(this.saleFormContent.decimal,'nimol')
            return kendo.toString(value, `n${this.saleFormContent.decimal}`);
        },
        autoCalculateDiscount(discountItem, subTotal) {
            if (discountItem) {
                const nature = discountItem.nature;
                const amount = discountItem.amount;
                if (nature === "Amount") {
                    const txnRate = this.invoice.txnRate || 1;
                    return kendo.parseFloat(amount) / txnRate;
                } else if (nature === "Percentage") {
                    return subTotal * (kendo.parseFloat(amount) / 100);
                }
            }
        },
        autoCalculateTax(tax, amount) {
            if (tax) {
                var formula = tax.formula;
                var inAmt = kendo.parseFloat(amount);
                var nAmt = kendo.parseFloat(amount);
                var taxBase = kendo.parseFloat(tax.taxBase) / 100;
                var rate = kendo.parseFloat(tax.rate) / 100;
                var total = eval(formula);
                window.console.log(inAmt, nAmt, taxBase, rate, formula, total);
                return total;
            }
            // return 0
        },
        async dataSourceChanged(e) {
            if (e.field) {
                let dataRow = e.items[0],
                    buom = {},
                    conversionRate = 1,
                    wac = 0,
                    qoh = 0,
                    amount = 0,
                    xAmount = 0;
                switch (e.field) {
                    case "item":
                        // this.attribute_ = this.attributes.filter(m => m.type.id === dataRow.variant.id)
                        dataRow.set("description", dataRow.item.description);
                        buom = dataRow.item.uom || {};
                        dataRow.set("buom", buom);
                        // dataRow.set('uom', buom)
                        // window.console.log(dataRow.item,'row')
                        // await this.inventoryBalance(dataRow, dataRow.item.id)
                        break;
                    case "price":
                        try {
                            amount = parseFloat(dataRow.price) * parseFloat(dataRow.qty);
                            xAmount = amount * parseFloat(this.invoice.txnRate);

                            dataRow.set("price", parseFloat(dataRow.price));
                            dataRow.set("amount", amount);
                            dataRow.set("exchangeAmount", xAmount);
                            // window.console.log('price',dataRow.price)
                        } catch {
                            dataRow.set("price", 0);
                            dataRow.set("amount", 0);
                            dataRow.set("exchangeAmount", 0);
                        }
                        break;
                    case "uom":
                        if (this.isPriceLevelChanged === false) {
                            try {
                                buom = dataRow.uom.buom || {};
                                qoh = dataRow.uom.qoh || 0;
                                conversionRate = dataRow.uom.conversionRate || 1;
                                wac = dataRow.uom.wac || 0;
                                dataRow.set("buom", buom);
                                dataRow.set("wac", wac);
                                dataRow.set("qoh", qoh);
                                dataRow.set("conversionRate", parseFloat(conversionRate));
                                if (dataRow.uom) {
                                    amount =
                                        parseFloat(dataRow.uom.price) * parseFloat(dataRow.qty);
                                    xAmount = amount * parseFloat(this.invoice.txnRate);

                                    dataRow.set("price", parseFloat(dataRow.uom.price));
                                    dataRow.set("amount", amount);
                                    dataRow.set("exchangeAmount", xAmount);
                                } else {
                                    amount = parseFloat(dataRow.price) * parseFloat(dataRow.qty);
                                    xAmount = amount * parseFloat(this.invoice.txnRate);

                                    dataRow.set("price", parseFloat(dataRow.price));
                                    dataRow.set("amount", amount);
                                    dataRow.set("exchangeAmount", xAmount);
                                }
                            } catch (err) {
                                window.console.log("error", err);
                                dataRow.set("buom", {});
                                dataRow.set("conversionRate", 1);
                                dataRow.set("price", 0);
                                dataRow.set("qoh", 0);
                                dataRow.set("wac", 0);
                                dataRow.set("amount", 0);
                                dataRow.set("exchangeAmount", 0);
                            }
                        }
                        break;
                    case "qty":
                        try {
                            amount = parseFloat(dataRow.price) * parseFloat(dataRow.qty);
                            xAmount = amount * parseFloat(this.invoice.txnRate);

                            dataRow.set("price", parseFloat(dataRow.price));
                            dataRow.set("amount", amount);
                            dataRow.set("exchangeAmount", xAmount);
                        } catch {
                            dataRow.set("price", 0);
                            dataRow.set("amount", 0);
                            dataRow.set("exchangeAmount", 0);
                        }
                        break;
                    case "otherTax":
                        // window.console.log("--", dataRow)
                        break;
                    default:
                        break;
                }
                if (e.field) {
                    this.autoCalculate();
                    // this.rawForJournal()
                }
            }
        },
        async inventoryBalance(dataRow, itemId) {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    this.showLoading = true;
                    const startDate = this.invoice.transactionDate;
                    let strFilter = "?asOf=" + startDate + "&id=" + itemId;
                    billingHandler.inventoryBalance(strFilter).then((res) => {
                        if (res.data.statusCode === 200) {
                            const balance = res.data.data;
                            if (balance.length > 0) {
                                dataRow.set("cost", balance[0].wac);
                                dataRow.set("qoh", balance[0].qoh);
                                dataRow.set(
                                    "amount",
                                    parseFloat(balance[0].wac) * parseFloat(dataRow.qty)
                                );
                                // dataRow.set('uom', balance[0].buom)
                            } else {
                                dataRow.set("cost", 0);
                            }
                            window.console.log("balance", res.data.data);
                        }
                        this.showLoading = false;
                    });
                }, 10);
            });
        },
        ServiceDateEditor(container, options) {
            kendo
                .jQuery('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDatePicker();

            // let ds = this.$refs.itemLineDS.kendoWidget()
            // window.console.log(ds.data())
            // // const dateString = kendo.toString((new Date(options.model.items.serviceDate)), this.itemLine.dateFormat)
            // // const dateString = kendo.toString(options.model.items.serviceDate)
            // const $input = $("<input value=" + options.model.serviceDate + " />").appendTo(container)
            // $input.kendoDatePicker()
            // // $input.appendTo(container)
            // // options.model.items.serviceDate = dateString
            // window.console.log($input)
        },
        ServiceDateToEditor(container, options) {
            kendo
                .jQuery('<input required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDatePicker();
        },
        ItemDropDownEditor(container, options) {
            kendo
                .jQuery('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "contains",
                    dataTextField: "name",
                    dataValueField: "id",
                    headerTemplate:
                        '<div class="dropdown-header k-widget k-header">' +
                        "<span>Items </span>" +
                        "<span></span>" +
                        "</div>",
                    template: "<span>#=name#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: this.itemList,
                });
        },
        UOMDropDownEditor(container, options) {
            kendo
                .jQuery('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "uom.name",
                    dataValueField: "uom.id",
                    cascadeFrom: "item",
                    template: "<span>#=uom.name || `No Price Level`#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: uomPriceHandler.uomPriceByPriceLevelURL(
                                    "id=" +
                                    options.model.item.id +
                                    "&plId=" +
                                    this.invoice.priceLevel.id +
                                    "&date=" +
                                    this.invoice.transactionDate
                                ),
                            },
                            dataType: "json",
                        },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "string"},
                                    // name: {type: "string"},
                                    // sku: {type: "string"},
                                },
                            },
                            data: function (response) {
                                return response.data;
                            },
                            total: function (response) {
                                return response.data.count;
                            },
                        },
                        // data: this.variants
                    }),
                });
        },
        DiscountItemDropDownEditor(container, options) {
            kendo
                .jQuery('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "name",
                    dataValueField: "id",
                    cascadeFrom: "item",
                    template: "<span>#=code# - #=name#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: discountItemHandler.getURL(DISCOUNT_TYPE),
                            },
                            dataType: "json",
                        },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "string"},
                                    // name: {type: "string"},
                                    // sku: {type: "string"},
                                },
                            },
                            data: function (response) {
                                return response.data;
                            },
                            total: function (response) {
                                return response.data.count;
                            },
                        },
                    }),
                });
        },
        SpecificTaxDropDownEditor(container, options) {
            kendo
                .jQuery('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "defaultTax",
                    dataValueField: "id",
                    template: "<span>#=defaultTax#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        data: this.specificTax.filter((m) => {
                            if (options.model.hasOwnProperty("vatTax")) {
                                const vat = options.model.vatTax;
                                if (vat) {
                                    if (
                                        options.model.vatTax !== null ||
                                        options.model.vatTax !== "null"
                                    ) {
                                        if (options.model.vatTax.baseAmount) {
                                            return (
                                                m.baseAmount.toLowerCase() ===
                                                options.model.vatTax.baseAmount.toLowerCase()
                                            );
                                        } else {
                                            return m;
                                        }
                                    }
                                } else {
                                    return m;
                                }
                            }
                        }),
                    }),
                });
        },
        PublicLightingTaxDropDownEditor(container, options) {
            kendo
                .jQuery('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "defaultTax",
                    dataValueField: "id",
                    template: "<span>#=defaultTax#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        data: this.publicLightingTax.filter((m) => {
                            if (options.model.hasOwnProperty("vatTax")) {
                                const vat = options.model.vatTax;
                                if (vat) {
                                    if (
                                        options.model.vatTax !== null &&
                                        options.model.vatTax !== "null"
                                    ) {
                                        if (options.model.vatTax.baseAmount) {
                                            return (
                                                m.baseAmount.toLowerCase() ===
                                                options.model.vatTax.baseAmount.toLowerCase()
                                            );
                                        } else {
                                            return m;
                                        }
                                    }
                                } else {
                                    return m;
                                }
                            }
                        }),
                    }),
                });
        },
        OtherTaxDropDownEditor(container, options) {
            kendo
                .jQuery('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "defaultTax",
                    dataValueField: "id",
                    template: "<span>#=defaultTax#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        data: this.otherTax.filter((m) => {
                            if (options.model.hasOwnProperty("vatTax")) {
                                const vat = options.model.vatTax;
                                if (vat) {
                                    if (
                                        options.model.vatTax !== null &&
                                        options.model.vatTax !== "null"
                                    ) {
                                        if (options.model.vatTax.baseAmount) {
                                            return (
                                                m.baseAmount.toLowerCase() ===
                                                options.model.vatTax.baseAmount.toLowerCase()
                                            );
                                        } else {
                                            return m;
                                        }
                                    }
                                } else {
                                    return m;
                                }
                            }
                        }),
                    }),
                });
        },
        VatTaxDropDownEditor(container, options) {
            kendo
                .jQuery('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "defaultTax",
                    dataValueField: "id",
                    template: "<span>#=defaultTax#</span>",
                    optionLabel: "--Select--",
                    dataSource: new kendo.data.DataSource({
                        data: this.vatTax,
                    }),
                });
        },
        SaleUnitDropDownEditor(container, options) {
            kendo
                .jQuery('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "startswith",
                    dataTextField: "name",
                    dataValueField: "id",
                    template: "<span>#=code# - #=name#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        data: this.saleUnitItemList,
                    }),
                });
        },
        ModifierDropDownEditor(container, options) {
            kendo
                .jQuery('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    filter: "contains",
                    dataTextField: "name",
                    dataValueField: "id",
                    headerTemplate:
                        '<div class="dropdown-header k-widget k-header">' +
                        "<span>Modifier </span>" +
                        "<span></span>" +
                        "</div>",
                    template: "<span>#=name#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: itemModifierHandler.searchURL(options.model.item.id),
                            },
                            dataType: "json",
                        },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "string"},
                                    name: {type: "string"},
                                    price: {type: "number"},
                                    uom: {type: "string"},
                                },
                            },
                            data: function (response) {
                                return response.data;
                            },
                            total: function (response) {
                                return response.data.count;
                            },
                        },
                    }),
                });
        },
        EmployeeDropDownEditor(container, options) {
            kendo
                .jQuery('<input data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoMultiSelect({
                    autoBind: true,
                    autoWidth: true,
                    height: 400,
                    suggest: true,
                    filter: "contains",
                    dataTextField: "name",
                    dataValueField: "id",
                    headerTemplate:
                        '<div class="dropdown-header k-widget k-header">' +
                        "<span>Employee </span>" +
                        "<span></span>" +
                        "</div>",
                    template: "<span>#=name#</span>",
                    optionLabel: "--- Select ---",
                    dataSource: new kendo.data.DataSource({
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: employeeHandler.searchURL(),
                            },
                            dataType: "json",
                        },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    id: {type: "string"},
                                    name: {type: "string"},
                                    firstName: {type: "string"},
                                    lastName: {type: "string"},
                                },
                            },
                            data: function (response) {
                                return response.data;
                            },
                            total: function (response) {
                                return response.data.count;
                            },
                        },
                    }),
                });
        },
        rowNumberTmpl(dataItem) {
            let ds = this.$refs.itemLineDS.kendoWidget(),
                index = ds.indexOf(dataItem);
            return index + 1;
        },
        addRow() {
            let ds = this.$refs.itemLineDS.kendoWidget(),
                total = ds.total();
            this.itemLine.id = itemLinePrefix + uuid.v1();
            this.itemLine.decimalFormat = "n" + this.saleFormContent.decimal;
            if (total < 36) {
                ds.insert(total, this.itemLine);
            }
            // this.itemLines.push(this.itemLine)
            // window.console.log('item Line', this.itemLine)
        },
        onPaymentTermChanged() {
            // this.onInvoiceDateChanged();
            window.console.log(
                "term",
                this.invoice.transactionDate,
                "-",
                this.invoice.transactionDate,
                "---",
                this.invoice.paymentTerm
            );
            if (this.customer) {
                if (this.invoice.hasOwnProperty("paymentTerm")) {
                    if (this.invoice.paymentTerm.hasOwnProperty("netDue")) {
                        const netDue = this.invoice.paymentTerm.netDue;
                        const someDate = new Date(this.invoice.transactionDate);
                        someDate.setDate(someDate.getDate() + parseInt(netDue)); //number  of days to add, e.x. 15 days
                        this.invoice.dueDate = someDate.toISOString().substr(0, 10);
                        // window.console.log('im', someDate, netDue)
                    }
                }
            }
        },
        async onInvoiceDateChanged() {
            await this.loadPaymentTermList();
            await this.loadCreditLimit();
            await this.loadCustomerBalance(this.customer.id);
            await this.onPriceLevelChange();

            if (this.customer) {
                const paymentTerm = this.invoice.paymentTerm || {};
                if (paymentTerm) {
                    const netDue = paymentTerm.netDue || 0;
                    const someDate = new Date(this.invoice.transactionDate);
                    someDate.setDate(someDate.getDate() + parseInt(netDue)); //number  of days to add, e.x. 15 days
                    this.invoice.dueDate = someDate.toISOString().substr(0, 10);
                    // window.console.log('im', someDate, netDue)
                }
                // this.loadCustomerBalance(this.customer.id);
            }
            if (this.$route.params.id === undefined) {
                await this.generateNumber();
            }
        },
        async loadPrefix() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    prefixHandler.get("invoice").then((res) => {
                        if (res.data.statusCode === 200) {
                            this.showLoading = false;
                            this.invoiceTypes = res.data.data;
                            if (this.invoiceTypes.length > 0) {
                                this.invoice.transactionType = this.invoiceTypes[0];
                                if (this.$route.params.id === undefined) {
                                    this.generateNumber();
                                }
                                this.templateHandle();
                            }
                        }
                    });
                }, 10);
            });
        },
        async loadPriceLevel() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    const strFilter = "?nature=sale";
                    priceLevelHandler.get(strFilter).then((res) => {
                        this.priceLevel = res;
                        // if (this.priceLevel.length > 0) {
                        //     this.invoice.priceLevel = this.priceLevel[0];
                        // }
                    });
                }, 10);
            });
        },
        async loadDiscountItem() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    discountItemHandler.list(DISCOUNT_TYPE).then((res) => {
                        if (res.data.statusCode === 200) {
                            this.specificDiscountItem = res.data.data;
                        }
                    });
                }, 10);
            });
        },
        async loadOtherCharge() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    otherChargeHandler.list().then((res) => {
                        if (res.data.statusCode === 200) {
                            this.otherChargeList = res.data.data;
                        }
                    });
                }, 10);
            });
        },
        async loadAccount() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    accountHandler.getAll().then((res) => {
                        this.showLoading = false;
                        //Receivable Account
                        this.receivableAcc = res.data
                            .filter((m) => m.account_type.number === 7)
                            .map((itm) => {
                                return {
                                    id: itm.uuid,
                                    uuid: itm.uuid,
                                    name: itm.name,
                                    local_name: itm.local_name,
                                    number: itm.number,
                                    is_taxable: itm.is_taxable,
                                    banhjiAccCode: itm.banhjiAccCode,
                                    group_code: itm.group_code,
                                    parent_account: itm.parent_account,
                                    type_code: itm.type_code,
                                    account_type: itm.account_type,
                                };
                            });
                        if (this.receivableAcc.length > 0) {
                            this.invoice.receivableAcc = this.receivableAcc[0];
                        }
                    });
                }, 10);
            });
        },
        async loadPaymentTerm() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    const strFilter = "?type=pmt-customer";
                    paymentTermHandler.getPaymentTerm(strFilter).then((res) => {
                        if (res.data.statusCode === 200) {
                            this.showLoading = false;
                            this.paymentTerms = res.data.data;
                            if (this.paymentTerms.length > 0) {
                                this.invoice.paymentTerm = this.paymentTerms[0];
                            }
                        }
                    });
                }, 10);
            });
        },
        async loadLocation() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    this.locations = [];
                    locationHandler
                        .list()
                        .then((res) => {
                            this.showLoading = true;
                            if (res.data.statusCode === 200) {
                                this.showLoading = false;
                                this.locations = res.data.data;
                                if (this.locations.length > 0) {
                                    this.invoice.location = this.locations[0];
                                }
                            }
                        })
                        .catch();
                    {
                        this.showLoading = false;
                    }
                }, 10);
            });
        },
        async loadProjectByCustomer() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    projectHandler
                        .getByCustomer(this.customer.id)
                        .then((res) => {
                            this.showLoading = true;
                            if (res.data.statusCode === 200) {
                                this.showLoading = false;
                                this.customerProjects = res.data.data;
                                if (this.customerProjects.length > 0) {
                                    this.invoice.project = this.customerProjects[0];
                                }
                            }
                        })
                        .catch();
                    {
                        this.showLoading = false;
                    }
                }, 10);
            });
        },
        async loadCustomerBalance(id) {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    const strFilter = id + "?type=bal";
                    this.invoice.currentBalance = 0;
                    billingHandler
                        .balance(strFilter)
                        .then((res) => {
                            if (res.data.statusCode === 200) {
                                const data = res.data.data;
                                if (data.length > 0) {
                                    this.invoice.currentBalance = data[0].balance;
                                }
                            }
                        })
                        .catch();
                    {
                        this.showLoading = false;
                    }
                }, 10);
            });
        },
        async loadCustomerDepositBalance(id) {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    const strFilter = id + "?type=dep";
                    billingHandler
                        .balance(strFilter)
                        .then((res) => {
                            this.invoice.depositAmount = 0;
                            if (res.data.statusCode === 200) {
                                const data = res.data.data;
                                if (data.length > 0) {
                                    const amountDeposit = data[0].balance;
                                    this.invoice.depositAmount =
                                        amountDeposit / this.invoice.txnRate;
                                }
                            }
                        })
                        .catch();
                    {
                        this.showLoading = false;
                    }
                }, 10);
            });
        },
        creditLimitUsage(balance, creditLimit) {
            if (creditLimit > 0) {
                return (
                    kendo.toString(
                        (balance / creditLimit) * 100,
                        `n${this.saleFormContent.decimal}`
                    ) + " %"
                );
            } else {
                return kendo.toString(0, `n${this.saleFormContent.decimal}`) + " %";
            }

            // const allowed = kendo.toString((balance / creditLimit) * 100, `n${this.saleFormContent.decimal}`)
            // return (isNaN(allowed) ? 0 : allowed) + ' %'
        },
        async loadEmployeeCenter() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    this.employees = [];
                    employeeHandler
                        .center(undefined)
                        .then((res) => {
                            this.showLoading = true;
                            if (res.data.statusCode === 200) {
                                this.showLoading = false;
                                this.employees = res.data.data;
                                if (this.employees.length > 0) {
                                    this.invoice.employee = this.employees[0];
                                }
                            }
                        })
                        .catch();
                    {
                        this.showLoading = false;
                    }
                }, 10);
            });
        },
        // async loadSegment() {
        //     new Promise((resolve) => {
        //         setTimeout(() => {
        //             resolve("resolved");
        //             this.segments = [];
        //             settingsHandler
        //                 .getSeg()
        //                 .then((res) => {
        //                     this.showLoading = true;
        //                     if (res.data.statusCode === 200) {
        //                         this.showLoading = false;
        //                         this.segments = res.data.data;
        //                         if (this.segments.length > 0) {
        //                             this.invoice.segment = this.segments[0];
        //                         }
        //                         // this.segmentList = res.data.data
        //                     }
        //                 })
        //                 .catch();
        //             {
        //                 this.showLoading = false;
        //             }
        //         }, 10);
        //     });
        // },
        async loadSaleOrder() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    let segmentId = "",
                        locationId,
                        priceLevelId = "",
                        customerId = "",
                        txnDate = "";
                    if (this.invoice.segment) {
                        segmentId = this.invoice.segment.id;
                    }
                    if (this.invoice.location) {
                        locationId = this.invoice.location.id;
                    }
                    if (this.invoice.customer) {
                        customerId = this.invoice.customer.id;
                    }
                    if (this.invoice.priceLevel) {
                        priceLevelId = this.invoice.priceLevel.id;
                    }
                    if (this.invoice.transactionDate) {
                        txnDate = this.invoice.transactionDate;
                    }
                    let strFilter = "";
                    if (
                        segmentId !== "" &&
                        customerId !== "" &&
                        locationId !== "" &&
                        priceLevelId !== "" &&
                        txnDate !== ""
                    ) {
                        strFilter =
                            "?id=" +
                            customerId +
                            "&segId=" +
                            segmentId +
                            "&locId=" +
                            locationId +
                            "&plId=" +
                            priceLevelId +
                            "&date=" +
                            txnDate;
                    }
                    if (strFilter !== "") {
                        this.invoice.refFrom = [];
                        this.showLoadingTxn = true;
                        saleOrderHandler.transactionFilter(strFilter).then((res) => {
                            if (res.data.statusCode === 200) {
                                this.showLoadingTxn = false;
                                this.saleOrders = res.data.data;
                            } else {
                                this.showLoadingTxn = false;
                            }
                        });
                    }
                }, 10);
            });
        },
        async loadSaleChannel() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    this.showLoading = true;
                    saleChannelHandler.get().then((res) => {
                        if (res.data.statusCode === 200) {
                            this.showLoading = false;
                            this.saleChannelList = res.data.data;
                            if (this.saleChannelList.length > 0) {
                                this.invoice.saleChannel = this.saleChannelList[0];
                            }
                        } else {
                            this.showLoading = false;
                        }
                    });
                }, 10);
            });
        },
        async loadTax() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    settingHandler.get().then((res) => {
                        this.tax = res;
                        this.otherTax = this.tax.filter(
                            (m) =>
                                (m.taxType.typeId === 7 || m.taxType.typeId === 10) &&
                                m.transactionType === "Sale"
                        ); // valuable tax
                        this.specificTax = this.tax.filter(
                            (m) =>
                                (m.taxType.typeId === 8 || m.taxType.typeId === 10) &&
                                m.transactionType === "Sale"
                        ); // valuable tax
                        this.publicLightingTax = this.tax.filter(
                            (m) =>
                                (m.taxType.typeId === 9 || m.taxType.typeId === 10) &&
                                m.transactionType === "Sale"
                        ); // valuable tax
                        this.vatTax = this.tax.filter(
                            (m) =>
                                (m.taxType.typeId === 1 ||
                                    m.taxType.typeId === 10) &&
                                m.transactionType === "Sale"
                        ); // valuable tax
                        // window.console.log('tax', JSON.stringify(this.vatTax))
                    });
                }, 10);
            });
        },
        async onSaveClose(saveNew, saveSend, isPrint) {
            if (!this.$refs.form.validate()) {
                // this.$refs.form.validate()
                this.$snotify.error(
                    "Field is required, please check field each of tabs!"
                );
                return;
            }
            let id = "";
            if (this.customer.hasOwnProperty("id")) {
                id = this.customer.id || "";
            }
            if (id === "") {
                this.$snotify.error("customer is require");
                return;
            }
            let ds = this.$refs.itemLineDS.kendoWidget();
            let d1 = ds.data().filter((n) => n.amount > 0);
            let dataValidate = 0;
            d1.forEach((value, index) => {
                if (
                    value.item.id == undefined ||
                    value.uom.uom.id == undefined ||
                    value.item.id == "" ||
                    value.uom.uom.id == ""
                ) {
                    this.$snotify.error(
                        "Please check Item or Uom  on row " + (index + 1)
                    );
                } else {
                    dataValidate += 1;
                }
            });
            if (d1.length == dataValidate) {
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("resolved");
                        let isAutoGenerate = 1;
                        if (this.$route.params.id) {
                            const tranDate = new Date(this.invoice.transactionDate);
                            const tranDateInvoice = new Date(this.invoice.transactionDate);
                            const tranDateM = tranDate.getFullYear() + tranDate.getMonth();
                            const tranDateInvoiceM =
                                tranDateInvoice.getFullYear() + tranDateInvoice.getMonth();
                            if (tranDateM === tranDateInvoiceM) {
                                isAutoGenerate = 0;
                            }
                        }
                        this.autoCalculate();
                        // this.autoCalculateTaxDetail();
                        let itemLineDS = this.$refs.itemLineDS.kendoWidget();
                        const dataRow = itemLineDS
                            .data()
                            .filter((o) => o.amount > 0)
                            .map((n) => {
                                return new ItemLineModel(n);
                            });
                        //todo: check Source
                        const sourceRef = dataRow.map((o) => {
                            return o.sourceTransaction;
                        });
                        const sourceTxn = this.removeDuplicate(sourceRef);

                        if (dataRow.length > 0) {
                            let data = {
                                id: this.invoice.id ? this.invoice.id : "",
                                uuid: this.invoice.uuid ? this.invoice.uuid : "",
                                journal_uuid: this.invoice.journal_uuid
                                    ? this.invoice.journal_uuid
                                    : "",
                                type: "Invoice",
                                number: this.invoice.number,
                                abbr: this.invoice.transactionType.abbr,
                                transactionDate: this.invoice.transactionDate,
                                dueDate: this.invoice.dueDate,
                                monthOf: this.invoice.monthOf,
                                customer: this.invoice.customer,
                                transactionType: this.invoice.transactionType,
                                paymentTerm: this.invoice.paymentTerm,
                                approvedTerm: this.invoice.approvedTerm,
                                discountPromotion: {},
                                receivableAcc: this.invoice.receivableAcc,
                                currency: this.invoice.currency,
                                txnRate: this.invoice.txnRate,
                                taxExchangeRate: this.invoice.taxExchangeRate,
                                rate: 1,
                                exchangeRate: this.invoice.exchangeRate,
                                exchangeAmount: this.invoice.exchangeAmount,
                                priceLevel: this.invoice.priceLevel,
                                itemLines: dataRow,
                                segment: this.invoice.segment,
                                location: this.invoice.location,
                                project: this.invoice.project,
                                saleChannel: this.invoice.saleChannel,
                                employee: this.invoice.employee,
                                billingAddress: this.invoice.billingAddress,
                                deliveryAddress: this.invoice.deliveryAddress,
                                deliveryDateTime: this.invoice.deliveryDateTime,
                                transactionNote: this.invoice.transactionNote,
                                journalNote: this.invoice.journalNote,
                                subTotal: this.invoice.subTotal,
                                exchangeSubTotal: this.invoice.exchangeSubTotal,
                                total: this.invoice.total,
                                exchangeTotal:
                                    parseFloat(this.invoice.total) *
                                    parseFloat(this.invoice.txnRate),
                                discountTotal: this.invoice.discountTotal,
                                specificDiscountTotal: this.invoice.specificDiscountTotal,
                                deliveryFee: this.invoice.deliveryFee,
                                totalTaxAmount: this.invoice.totalTaxAmount,
                                depositAmount: this.invoice.depositAmount,
                                depositDeduction: this.invoice.depositDeduction,
                                remainingAmount: this.invoice.remainingAmount,
                                amountDue: this.invoice.amountDue,
                                currentBalance: this.invoice.currentBalance,
                                balance: this.invoice.balance,
                                creditLimit: this.invoice.creditLimit,
                                saveOption: this.invoice.saveOption,
                                status: 1,
                                approvedBy: this.invoice.approvedBy,
                                formTemplate: this.templatesForm[this.template],
                                specificDiscountItem: this.invoice.specificDiscountItem,
                                otherCharge: this.mOtherCharge,
                                otherChargeLine: this.invoice.otherChargeLine,
                                otherChargeAmount: this.invoice.otherChargeAmount,
                                lateFee: this.invoice.lateFee,
                                // paymentOptionWBMobile: this.invoice.paymentOptionWBMobile,
                                // paymentOptionOnline: this.invoice.paymentOptionOnline,
                                // paymentOptionKHQR: this.invoice.paymentOptionKHQR,
                                publicLink: this.invoice.publicLink,
                                paymentCode: this.invoice.paymentCode,
                                taxListTotal: this.taxListTotal,
                                customerDiscountItem: this.customerDiscountItem,
                                customerSaleUnit: this.customerSaleUnit,
                                customerSaleUnitLine: this.customerSaleUnitLine,
                                paymentScheme: this.invoice.paymentScheme,
                                createdAt: this.invoice.createdAt,
                                loggedUser: this.loggedUser,
                                saveSend: saveSend,
                                isAutoGenerate: isAutoGenerate,
                                jRaw: this.jRaw,
                                sourceTransaction: sourceTxn,
                                itemSubtotal: this.invoice.itemSubtotal,
                                exchangeItemSubtotal: this.invoice.exchangeItemSubtotal,
                                serviceSubtotal: this.invoice.serviceSubtotal,
                                exchangeServiceSubtotal: this.invoice.exchangeServiceSubtotal,
                                txnItmSubtotal: this.invoice.txnItmSubtotal,
                                exchangeTxnItmSubtotal: this.invoice.exchangeTxnItmSubtotal,
                                itemDiscount: this.invoice.itemDiscount,
                                exchangeItemDiscount: this.invoice.exchangeItemDiscount,
                                serviceDiscount: this.invoice.serviceDiscount,
                                exchangeServiceDiscount: this.invoice.exchangeServiceDiscount,
                                txnItmDiscount: this.invoice.txnItmDiscount,
                                exchangeTxnItmDiscount: this.invoice.exchangeTxnItmDiscount,
                                cashPayment: new PaymentOptionModel(this.invoice.cashPayment),
                                qrPayment: new PaymentOptionModel(this.invoice.qrPayment),
                                bankTransfer: new PaymentOptionModel(this.invoice.bankTransfer),
                                billPayment: new PaymentOptionModel(this.invoice.billPayment),
                                refFrom: this.invoice.refFrom || [],
                                refTo: this.invoice.refTo || [],
                                saleTaxDetail: this.invoice.saleTaxDetail || [],
                                actionType: this.$route.params.id
                                    ? this.$route.query.type
                                    : "new",
                            };
                            if (this.$route.query.type === "recurring") {
                                data.id = "";
                            }
                            this.showLoading = true;
                            // window.console.log(1, data);
                            billingHandler
                                .create(data)
                                .then((response) => {
                                    if (response.data.statusCode === 201) {
                                        // this.close(response.data.data)
                                        // this.$refs.form.reset()
                                        this.showLoading = false;
                                        this.$snotify.success("Successfully");

                                        if (isPrint == 1) {
                                            getPrint(response.data.data);
                                        } else if (saveNew == "new") {
                                            this.setDefaultData();
                                        } else {
                                            // this.clear()
                                            this.close(response.data.data);
                                        }
                                    }
                                })
                                .catch((e) => {
                                    this.showLoading = false;
                                    this.$snotify.error("Something went wrong");
                                    this.errors.push(e);
                                });
                        }
                    }, 10);
                });
            }
        },
        close(data) {
            if (this.$route.params.id === undefined) {
                this.$router.push({
                    name: "Customers",
                    params: {
                        data: data,
                    },
                });
            } else {
                window.history.go(-1);
                // this.$router.push({
                //     path: "invoice_view",
                //     name: "Invoice View",
                //     params: {
                //         data: data,
                //     }
                // })
            }
            // window.console.log(data, 'data')
        },
        saveNew() {
        },
        removeRow(e) {
            e.preventDefault();
            const grid = kendo.jQuery("#gridItemLine").data("kendoGrid"),
                dataSource = grid.dataSource,
                dataItem = grid.dataItem($(e.currentTarget).closest("tr"));

            if (dataSource.total() > 1) {
                dataSource.remove(dataItem);
                this.autoCalculate();
            }
        },
        generateNumber() {
            if (this.$route.params.id) {
                const tranDate = new Date(this.invoice.transactionDate);
                const tranDateInvoice = new Date(this.invoice.transactionDate);
                const tranDateM = tranDate.getFullYear() + tranDate.getMonth();
                const tranDateInvoiceM =
                    tranDateInvoice.getFullYear() + tranDateInvoice.getMonth();
                if (tranDateM === tranDateInvoiceM) {
                    this.invoice.referenceNo = this.referenceNo;
                    return;
                }
            }

            if (this.invoice.transactionDate !== "" && this.invoiceTypes.length > 0) {
                let data = {
                    abbr: this.invoice.transactionType.abbr,
                    structure: this.invoice.transactionType.structure,
                    transactionDate: this.invoice.transactionDate,
                    sequcencing: this.invoice.transactionType.sequcencing,
                    type: "Invoice",
                    entity: 1,
                };
                billingHandler
                    .lastNumber(data)
                    .then((response) => {
                        if (response.data.statusCode === 200) {
                            const res = response.data.data;
                            const lastNumber = this.zeroPad(
                                parseInt(res.lastNumber),
                                this.invoice.transactionType.format
                            );
                            const number =
                                res.suffix +
                                this.invoice.transactionType.numberSeparator +
                                lastNumber;
                            this.invoice.number = number;
                        }
                    })
                    .catch((e) => {
                        this.errors.push(e);
                    });
            }
        },
        zeroPad(num, places) {
            return String(num).padStart(places, "0");
        },
        suffix(transactionDate) {
            return kendo.toString(new Date(transactionDate), `yymm`);
        },
        errorMessage() {
        },
        accountDropDownEditor() {
        },
        cancel() {
            this.$swal({
                title: i18n.t("msg_title_warning"),
                text: i18n.t("msg_discard"),
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: i18n.t("cancel"),
                confirmButtonColor: "#4d4848",
                cancelButtonColor: "#ED1A3A",
                confirmButtonText: i18n.t("discard"),
            }).then((result) => {
                if (result.value) {
                    this.clear();
                    this.$router.go(-1);
                }
            });
        },
        hideSmallSidebar() {
            this.isHideBar = !this.isHideBar;
        },
        requestData(skip, filter, baseUrl) {
            const url = baseUrl + `?filter=${filter}`;
            this.requestStarted = true;
            fetch(url)
                .then((response) => {
                    return response.json();
                })
                .then(this.afterFetch);
        },
        requestData_(skip, filter, baseUrl) {
            const url = baseUrl + `/${filter}`;
            this.requestStarted = true;
            fetch(url)
                .then((response) => {
                    return response.json();
                })
                .then(this.afterFetch_);
        },
        onChange(event) {
            const value = event.value;
            if (value && value[textField] === emptyItem[textField]) {
                return;
            }
            const id = value.id || "";
            if (id !== "") {
                window.console.log("value", value);
                this.customer = value;
                this.invoice.customer = value;
                this.invoice.billPayment = this.customer.billPayment;
                this.invoice.qrPayment = this.customer.qrPayment;
                this.invoice.cashPayment = this.customer.cashPayment;
                this.invoice.bankTransfer = this.customer.bankTransfer;
                // window.console.log(this.invoice.customer, 'Changed')
                // this.invoice = value
                this.invoice.receivableAcc = value.receivableAcc || {};
                // this.invoice.paymentTerm = value.hasOwnProperty("paymentTerm")
                //     ? value.paymentTerm
                //     : {};
                this.invoice.priceLevel = value.priceLevel || {};
                const baseCurrency = value.baseCurrency || {};
                if (baseCurrency.hasOwnProperty("code")) {
                    this.baseCurrencyCode = " " + baseCurrency.code;
                }
                const priceLevel = value.priceLevel || {};
                const currency = priceLevel.currency || {};
                const code = currency.code || "";
                window.console.log("priceLevel: " + JSON.stringify(priceLevel));
                if (code !== "") {
                    this.loadTransactionRate();
                }
                this.billingAddress = value.billingAddress || [];
                this.deliveryAddress = value.deliveryAddress || [];
                if (this.billingAddress.length > 0) {
                    this.invoice.billingAddress = this.billingAddress[0];
                }
                if (this.deliveryAddress.length > 0) {
                    this.invoice.deliveryAddress = this.deliveryAddress[0];
                }
                this.onInvoiceDateChanged();
                this.loadProjectByCustomer();
            }
            // this.loadCustomerBalance(this.customer.id);
            // this.loadCreditLimit();
            // this.loadPaymentTermList();
            // window.console.log(value, 'value')
        },
        onEmployeeChanged(event) {
            const value = event.value;
            if (value && value[textField] === emptyItem[textField]) {
                return;
            }
            this.mEmployee = value;
            this.invoice.employee = value;
        },
        afterFetch(json) {
            this.customerList = json.data;
        },
        afterFetch_(json) {
            this.employees = json.data;
        },
        onFilterChange(event) {
            const filter = event.filter.value;
            this.requestData(0, filter, this.cusBaseUrl);
            this.filter = filter;
        },
        onEmployeeFilterChanged(event) {
            const filter = event.filter.value;
            this.requestData_(0, filter, this.empBaseUrl);
            this.filter_ = filter;
        },
        async initData() {
            if (this.$route.params.id !== undefined) {
                await this.loadViewInvoice();
            } else {
                this.setDefaultData();
            }
        },
        async loadLateFee() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    lateFeeHandler.list().then((res) => {
                        if (res.data.statusCode === 200) this.showLoading = false;
                        this.lateFeeList = res.data.data;
                    });
                }, 10);
            });
        },
        async loadViewInvoice() {
            if (this.$route.params.id) {
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("resolved");
                        this.showLoading = true;
                        billingHandler
                            .view(this.$route.params.id)
                            .then((res) => {
                                if (res.data.statusCode === 200) {
                                    this.showLoading = false;
                                    this.invoice = res.data.data[0];
                                    this.referenceNo = this.invoice.referenceNo;
                                    this.invoice.transactionDate = new Date(
                                        this.invoice.transactionDate
                                    );
                                    this.customer = this.invoice.customer;
                                    this.mEmployee = this.invoice.employee;
                                    this.taxListTotal = this.invoice.taxListTotal;
                                    this.itemLines = this.invoice.itemLines;
                                    this.mOtherCharge = this.invoice.otherCharge;
                                    // const xRate = this.invoice.exchangeRate
                                    // this.currencyCode = xRate.code;
                                    // window.console.log('currencyCode', xRate)
                                    this.templateHandle();
                                    this.template = this.invoice.formTemplate.id;
                                    this.jRaw = this.invoice.jRaw || [];
                                    for (let i = 0; i < this.mOtherCharge.length - 1; i++) {
                                        this.addSelect();
                                    }
                                    this.loadProjectByCustomer();
                                    if (this.customer.hasOwnProperty("id")) {
                                        this.loadCustomerBalance(this.customer.id);
                                    }

                                    if (this.$route.query.type === "recurring") {
                                        if (this.$route.params.hasOwnProperty("transactionDate")) {
                                            window.console.log("type", this.$route.params);
                                            this.invoice.transactionDate = new Date(
                                                this.$route.params.transactionDate
                                            );
                                            this.invoice.transactionDate = new Date(
                                                this.$route.params.transactionDate
                                            );
                                            this.onInvoiceDateChanged();
                                            this.generateNumber();
                                        }
                                    }
                                }
                            })
                            .catch();
                        {
                            this.showLoading = false;
                        }
                    }, 10);
                });
            }
        },
        clear() {
            const term = this.invoice.paymentTerm || {};
            const priceL = this.invoice.priceLevel || {};
            this.id = undefined;
            this.itemLines = [];
            this.invoice = new InvoiceModel();
            this.invoice.paymentTerm = term;
            this.invoice.priceLevel = priceL;
            this.customer = "";
            this.employee = "";
            this.saleOrders = [];
            this.invoice.transactionType = this.invoiceTypes[0];
            this.generateNumber();
        },
        async loadTransactionRate() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    const date = new Date(this.invoice.transactionDate)
                        .toISOString()
                        .substr(0, 10);
                    const priceLevel = this.invoice.priceLevel || {};
                    const currency = priceLevel.currency || {};
                    const code = currency.code || "";
                    if (code) {
                        this.showLoading = true;
                        currencyHandler
                            .getLastExchangeRateByDate(date, code)
                            .then((res) => {
                                if (res.data.statusCode === 200) {
                                    this.showLoading = false;
                                    this.exchangeRate = res.data.data[0];
                                    this.currencyCode = this.exchangeRate.code;
                                    this.transactionRate = this.exchangeRate.rate;
                                    this.invoice.txnRate = this.exchangeRate.rate;
                                    this.invoice.exchangeRate = this.exchangeRate;
                                    this.showLoading = false;
                                    this.loadCustomerDepositBalance(this.customer.id);
                                }
                            });
                    }
                    this.loadSaleOrder();
                    this.loadTransactionTaxRate();
                }, 10);
            });
        },
        async loadTransactionTaxRate() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    const date = new Date(this.invoice.transactionDate)
                        .toISOString()
                        .substr(0, 10);
                    let code = "KHR";
                    if (code !== undefined || code !== "") {
                        currencyHandler
                            .getLastExchangeRateByDate(date, code)
                            .then((res) => {
                                if (res.data.statusCode === 200) {
                                    this.invoice.taxExchangeRate = res.data.data[0];
                                }
                            });
                    }
                }, 10);
            });
        },
        async loadCreditLimit() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    if (this.customer) {
                        const strFilter =
                            "?id=" +
                            this.customer.id +
                            "&transactionDate=" +
                            this.invoice.transactionDate +
                            "&type=Customer";
                        this.invoice.creditLimit = 0;
                        creditLimitHandler.get(strFilter).then((res) => {
                            if (res.data.statusCode === 200) {
                                // this.creditLimitItem = res.data.data
                                const credit = res.data.data;
                                this.invoice.creditLimit = kendo.parseFloat(credit.amount || 0);
                            }
                        });
                    }
                }, 10);
            });
        },
        async loadPaymentTermList() {
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve("resolved");
                    if (this.customer) {
                        const strFilter =
                            "?id=" +
                            this.customer.id +
                            "&transactionDate=" +
                            this.invoice.transactionDate +
                            "&type=Customer";
                        this.invoice.paymentTerm = {};
                        paymentTermHandler_.get(strFilter).then((res) => {
                            if (res.data.statusCode === 200) {
                                const terms = res.data.data;
                                this.invoice.paymentTerm = terms.term;
                                this.invoice.approvedTerm = terms.term;
                                this.onPaymentTermChanged();
                            }
                        });
                    }
                }, 10);
            });
        },
        onPriceLevelChange() {
            this.isPriceLevelChanged = true;
            this.loadTransactionRate();
            this.clearUOMItem();
        },
        async clearUOMItem() {
            let ds = this.$refs.itemLineDS.kendoWidget();
            ds.data().map((n) => {
                n.set("uom", {});
            });
            this.isPriceLevelChanged = false;
        },
        setDefaultData() {
            let ds = this.$refs.itemLineDS.kendoWidget();
            ds.data([]);
            const term = this.invoice.paymentTerm || {};
            const priceL = this.invoice.priceLevel || {};
            this.id = undefined;
            this.invoice = new InvoiceModel();
            this.invoice.paymentTerm = term;
            this.invoice.priceLevel = priceL;
            this.customer = {};
            this.mEmployee = {};
            this.saleOrders = [];
            this.invoice.transactionType = this.invoiceTypes[0];
            this.generateNumber();
            this.loadSegment();
            this.loadLocation();
            this.addRow();
            this.addRow();
            this.invoice.segment = this.segments[0]
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
                            window.console.log(s, 'segment')
                            if (s.length > 0) {
                                this.segments.push(s[0].segment)
                                this.invoice.segment = s[0].segment
                                this.businessCategory = []
                                if (s[0].productCategories.length > 0) {
                                    let self = this
                                    $.each(s[0].productCategories, function (i, v) {
                                        self.businessCategory.push(v.category.id)
                                    })
                                }
                                if (s[0].serviceCategories.length > 0) {
                                    let self = this
                                    $.each(s[0].serviceCategories, function (i, v) {
                                        self.businessCategory.push(v.category.id)
                                    })
                                }
                                window.console.log(this.businessCategory.length)
                                this.loadItem()
                                // productVariantHandler.itemSearchURLBySegment({category: this.businessCategory})
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
        async loadItem() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    productVariantHandler.itemSearchURLBySegment({category: this.businessCategory}).then(res => {
                        this.showLoading = true
                        if (res.data.statusCode === 200) {
                            this.showLoading = false
                            if(res.data.data.length > 0){
                                let self = this
                                this.itemList = []
                                $.each(res.data.data, function(i,v){
                                    if($.inArray(v.category.id, self.businessCategory) != -1) {
                                        self.itemList.push(v)
                                    }
                                })
                            }
                            window.console.log(this.itemList, 'item aaa')
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 300)
            })
        },
    },
    computed: {
        disabledMe() {
            return !!this.$route.params.id;
        },
        validCustomer: function () {
            return this.customer.id !== undefined && this.customer.id !== null;
        },
        hiddenButton() {
            if (this.$route.params.id) {
                return true;
            } else {
                return false;
            }
        },
    },
    watch: {
        // id() {
        //     if (this.$route.params.id === undefined) {
        //         this.setDefaultData();
        //     } else {
        //         this.showLoading = true;
        //         this.loadViewInvoice();
        //     }
        // },
        $route: "loadSaleFormContent",
    },
    created() {
        this.loadPriceLevel();
        this.loadTax();
        this.loadSaleUnitItems();
        this.loadPrefix();
        this.loadLateFee();
        this.loadLocation();
        this.loadPaymentOption();
    },
    mounted: async function () {
        await this.loadSaleFormContent();
        this.requestData(0, this.filter, this.cusBaseUrl);
        await this.loadDiscountItem();
        await this.loadSaleChannel();
        await this.loadEmployeeCenter();
        await this.loadPaymentTerm();
        await this.loadAccount();
        // await this.loadCurrency()
        await this.loadOtherCharge();
        // await this.loadCatalogs()
        // await this.initData()
        await this.loadViewInvoice();
        await this.loadSegment()
    },
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
    background-color: #f2f2f2;
}

.pa-3.v-card h4 {
    font-size: 18px;
    color: #333;
}

.pa-3.v-card p {
    font-size: 12px;
    color: #b5b5b5;
}

.attachment_file {
    background-color: #efeded;
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
    color: #7f7f7f;
}

.block_debit h5,
.block_credit h5,
.block_difference h5 {
    text-transform: uppercase;
    color: #7f7f7f;
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

.color_green {
    color: #c80000;
}

@media (min-width: 1264px) {
    .container {
        max-width: 1080px !important;
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
    transition: 0.5s ease-in;
    flex: 0 0 0;
}

.hide_big_bar_class {
    max-width: 100%;
    transition: 0.5s ease-in;
    flex: 0 0 100%;
}

.info_add {
    background-color: #ffffff;
}

.small_sidebar {
    height: 98%;
    position: relative;
    padding: 12px;
    background-color: #edf1f5;
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
    background-color: #c80000 !important;
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
    background-color: #edf1f5;
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
    background-color: #c80000 !important;
    color: #ffffff;
    border-radius: 0 !important;
}

.list_site_inv {
    background-color: #f44336;
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

.theme--light.v-data-table
> .v-data-table__wrapper
> table
> tbody
> tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background-color: transparent !important;
}

.b_add {
    height: 30px !important;
}

.help {
    font-size: 20px;
    text-transform: uppercase;
    margin-top: 10px;
}
</style>
