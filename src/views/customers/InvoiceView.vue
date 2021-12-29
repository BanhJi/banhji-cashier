<template>
  <v-app>
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
                class="bigSide py-0"
                sm="8"
                cols="12"
                style="transition: .3s ease-in;"
                :class="{ hide_big_bar_class: isHideBar }"
              >
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-card outlined dense class="no_border">
                    <h2 class="mb-0">
                      {{ $t("invoice") }} #{{ invoice.referenceNo }} ({{
                        invoiceStatus
                      }})
                    </h2>

                    <v-icon
                      v-if="isHideBar"
                      onclick="window.history.go(-1); return false;"
                      style="cursor: pointer; color: #333; font-size: 40px;"
                      class="float-right"
                      >close
                    </v-icon>
                    <span
                      style="transition: .3s ease-in; z-index:10;"
                      :class="{
                        iconArrow: !isHideBar,
                        iconArrowHide: isHideBar,
                      }"
                    >
                      <v-icon
                        size="22"
                        class="arr_icon"
                        @click="hideSmallSideBar"
                        v-if="isHideBar"
                      >
                        mdi-chevron-left-circle
                      </v-icon>
                      <v-icon
                        size="22"
                        class="arr_icon"
                        @click="hideSmallSideBar"
                        v-if="!isHideBar"
                      >
                        mdi-chevron-right-circle
                      </v-icon>
                    </span>
                  </v-card>
                  <v-card outlined dense class="px-3 no_border" color="grayBg">
                    <v-row>
                      <v-col sm="4" cols="12" class="pb-0">
                        <label class="label  mb-0">{{ $t("customer") }}</label>
                        <h3 class="text-bold  py-1">{{ customerName }}</h3>

                        <label class="label mb-0">{{
                          $t("invoice_type")
                        }}</label>
                        <h3 class="text-bold py-1">{{ transactionType }}</h3>
                        <label class="label mb-0">{{
                          $t("invoice_date")
                        }}</label>
                        <h3 class="text-bold py-1">{{ transactionDate }}</h3>
                      </v-col>
                      <v-col sm="8" cols="12" class="pr-1 pt-0">
                        <v-row class=" mr-2 pt-0">
                          <v-col sm="4" cols="12" class="">
                            <label class="label mb-0">{{ $t("term") }}</label>
                            <h3 class="text-bold py-1">{{ paymentTerm }}</h3>
                            <label class="label mb-0">{{
                              $t("account")
                            }}</label>
                            <h3 class="text-bold py-1">
                              {{ accountReceivable }}
                            </h3>
                          </v-col>
                          <v-col sm="4" cols="12" class="">
                            <label class="label mb-0">{{
                              $t("due_date")
                            }}</label>
                            <h3 class="text-bold py-1">{{ dueDate }}</h3>
                            <label class="label mb-0">{{
                              $t("invoice_currency")
                            }}</label>
                            <h3 class="text-bold py-1">{{ currency }}</h3>
                          </v-col>
                          <v-col sm="4" cols="12" class="">
                            <!--                                                        <label class="label mb-0">{{ $t('discount_promotion') }}</label>-->
                            <!--                                                        <h3 class="text-bold py-1">1% 10 Net 30</h3>-->
                            <label class="label mb-0">{{
                              $t("price_level")
                            }}</label>
                            <h3 class="text-bold py-1">{{ priceLevel }}</h3>
                            <label class="label mb-0">{{
                              $t("late_fee")
                            }}</label>
                            <h3 class="text-bold py-1">{{ lateFee }}</h3>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card>

                  <v-row class="pt-3" style="background-color: #fff;">
                    <v-col sm="12" cols="12" class="pt-0">
                      <LoadingMe
                        :isLoading="showLoading"
                        :fullPage="false"
                        type="loading"
                        :myLoading="true"
                      />
                      <kendo-datasource ref="itemLineDS" :data="itemLines" />
                      <kendo-grid
                        id="gridItemLine"
                        class="grid-function"
                        :data-source-ref="'itemLineDS'"
                        :sortable="false"
                        :column-menu="true"
                        :editable="false"
                        :scrollable-virtual="true"
                      >
                        <kendo-grid-column
                          :title="$t('no.')"
                          :width="55"
                          :column-menu="false"
                          :template="rowNumberTmpl"
                          :headerAttributes="{
                            style: 'background-color: #EDF1F5;',
                            class: 'text-products',
                          }"
                          :attributes="{
                            style: 'text-align: products',
                          }"
                        />
                        <kendo-grid-column
                          :field="'serviceDate'"
                          :title="$t('date_from')"
                          :width="200"
                          :hidden="!saleFormContent.serviceDate"
                          :template="
                            '<span>#= kendo.toString(new Date(serviceDate), dateFormat)#</span>'
                          "
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
                          :headerAttributes="{
                            style: 'background-color: #EDF1F5',
                          }"
                        />
                        <kendo-grid-column
                          :field="'item'"
                          :title="$t('item')"
                          :template="itemTemplate"
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
                          :field="'qty'"
                          :title="$t('qty')"
                          :template="'<span>#=qty#</span>'"
                          :width="120"
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
                          :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                          :attributes="{
                            style: 'text-align: left',
                          }"
                        />
                        <kendo-grid-column
                          :field="'price'"
                          :title="$t('price')"
                          :width="200"
                          :template="priceFormat"
                          :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                          :attributes="{
                            style: 'text-align: right',
                          }"
                        />
                        <kendo-grid-column
                          :field="'amount'"
                          :title="$t('amount')"
                          :width="200"
                          :template="amountFormat"
                          :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                          :attributes="{
                            style: 'text-align: right',
                          }"
                        />
    
                        <kendo-grid-column
                          :field="'discountItem'"
                          :title="$t('discount_item')"
                          :width="200"
                          :hidden="!saleFormContent.discountItem"
                          :template="discountItemTemplate"
                          :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                          :attributes="{
                            style: 'text-align: left',
                          }"
                        />
                        <kendo-grid-column
                          :field="'saleUnit'"
                          :title="$t('sale_unit')"
                          :width="200"
                          :hidden="!saleFormContent.saleUnit"
                          :template="saleUnitTemplate"
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
                          :headerAttributes="{
                            style:
                              'text-align: left; background-color: #EDF1F5',
                          }"
                          :attributes="{ style: 'text-align: left' }"
                        />
                      </kendo-grid>
                    </v-col>
                    <v-col sm="12" cols="12" class="py-0">
                      <v-row>
                        <v-col sm="7" cols="6">
                          <v-card class="no-boxshadow pa-3" color="grayBg">
                            <v-row>
                              <v-col sm="6" cols="12" class="pt-0">
                                <label>{{ $t("billing_address") }}</label>
                                <h4 class="text-bold font_16 py-2">
                                  {{ billingAddress }}
                                </h4>
                                <label>{{ $t("message_on_invoice") }}</label>
                                <h4 class="text-bold py-2 font_16">
                                  {{ transactionNote }}
                                </h4>
                              </v-col>
                              <v-col sm="6" cols="12" class="pt-0">
                                <label>{{
                                  $t("pickup_delivery_address")
                                }}</label>
                                <h4 class="text-bold py-2 font_16">
                                  {{ deliveryAddress }}
                                </h4>
                                <label>{{ $t("message_on_journal") }}</label>
                                <h4 class="text-bold py-2 font_16">
                                  {{ journalNote }}
                                </h4>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col
                                sm="12"
                                cols="12"
                                class="pt-0 px-4 pr-2 pb-0"
                              >
                                <v-row class="grayBg" style="width: 104%;">
                                  <v-col sm="12" cols="12" class="py-0">
                                    <v-card outlined color="white" class="pa-3">
                                      <v-row class="">
                                        <v-col sm="12" cols="12" class="py-0">
                                          <p class="mb-2">
                                            {{ $t("file_type") }}
                                            [PDF, JPG, JPEG, TIFF, PNG, GIF] -
                                            5MB
                                          </p>
                                          <template>
                                            <v-file-input
                                              v-model="files"
                                              @change="onFileChange"
                                              accept="image/jpg, image/jpeg, application/pdf"
                                              :placeholder="$t('attachments')"
                                              single
                                              prepend-icon="mdi-paperclip"
                                            >
                                              <template
                                                v-slot:selection="{ text }"
                                              >
                                                <v-chip
                                                  small
                                                  label
                                                  color="primary"
                                                >
                                                  {{ text }}
                                                </v-chip>
                                              </template>
                                            </v-file-input>
                                            <v-text-field
                                              v-model="fileDesc"
                                              outlined
                                              :placeholder="$t('description')"
                                              clearable
                                            />
                                          </template>
                                          <v-btn
                                            color="primary"
                                            class="text-capitalize mb-3 white--text"
                                            @click="uploadFile"
                                          >
                                            <v-icon size="15" class="mr-2"
                                              >fa-check
                                            </v-icon>
                                            {{ $t("upload") }}
                                          </v-btn>
                                          <template>
                                            <LoadingMe
                                              :isLoading="showLoadingAtch"
                                              :fullPage="false"
                                              type="loading"
                                              :myLoading="true"
                                            >
                                            </LoadingMe>
                                            <kendo-datasource
                                              ref="attachmentDS"
                                              :data="attachmentList"
                                            />
                                            <kendo-grid
                                              id="gridAttachment"
                                              class="grid-function"
                                              :data-source-ref="'attachmentDS'"
                                              :editable="false"
                                              :scrollable-virtual="true"
                                            >
                                              <kendo-grid-column
                                                :field="''"
                                                :title="$t('open')"
                                                :width="70"
                                                :template="fileUrl"
                                                :attributes="{
                                                  style: 'text-align: center',
                                                }"
                                                :headerAttributes="{
                                                  style:
                                                    'background-color: #EDF1F5',
                                                }"
                                              />
                                              <kendo-grid-column
                                                :field="'fileName'"
                                                :title="$t('file_name')"
                                                :width="250"
                                                :headerAttributes="{
                                                  style:
                                                    'background-color: #EDF1F5',
                                                }"
                                              />
                                              <kendo-grid-column
                                                :field="'description'"
                                                :title="$t('description')"
                                                :width="250"
                                                :headerAttributes="{
                                                  style:
                                                    'background-color: #EDF1F5',
                                                }"
                                              />
                                              <kendo-grid-column
                                                :field="'fileType'"
                                                :title="$t('file_type')"
                                                :width="150"
                                                :headerAttributes="{
                                                  style:
                                                    'background-color: #EDF1F5, color: green !important',
                                                }"
                                              />
                                              <kendo-grid-column
                                                :field="'size'"
                                                :title="$t('size')"
                                                :width="150"
                                                :template="byteToMB"
                                                :headerAttributes="{
                                                  style:
                                                    'background-color: #EDF1F5, color: green !important',
                                                }"
                                              />
                                              <kendo-grid-column
                                                :field="'createdAt'"
                                                :title="$t('date')"
                                                :width="120"
                                                :template="
                                                  '<span>#= kendo.toString(new Date(createdAt), dateFormat)#</span>'
                                                "
                                                :headerAttributes="{
                                                  style:
                                                    'background-color: #EDF1F5, color: green !important',
                                                }"
                                              />
                                            </kendo-grid>
                                          </template>
                                        </v-col>
                                      </v-row>
                                    </v-card>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-card>
                        </v-col>
                        <v-col sm="5" cols="6">
                          <v-simple-table>
                            <template v-slot:default>
                              <tbody>
                                <tr>
                                  <td class="text-left">
                                    {{ $t("subtotal") }}
                                  </td>
                                  <td class="text-center">:</td>
                                  <td class="text-right">
                                    {{ numberFormat(invoice.subTotal) }}
                                  </td>
                                </tr>
                                <tr>
                                  <td class="text-left">
                                    {{ $t("general_discount") }}
                                  </td>
                                  <td class="text-center">:</td>
                                  <td class="text-right">
                                    ({{ numberFormat(invoice.discountTotal) }})
                                  </td>
                                </tr>
                                <tr>
                                  <td class="text-left">
                                    {{ specificDiscount }}
                                  </td>
                                  <td class="text-center">:</td>
                                  <td class="text-right">
                                    {{
                                      numberFormat(
                                        invoice.specificDiscountTotal
                                      )
                                    }}
                                  </td>
                                </tr>
                                <tr
                                  v-for="item in invoice.otherCharge"
                                  v-bind:key="item.id"
                                >
                                  <td class="text-left text-uppercase">
                                    {{ item.name }}
                                  </td>
                                  <td class="text-center">:</td>
                                  <td class="text-right">
                                    {{ otherCharge(item) }}
                                  </td>
                                </tr>
                                <tr>
                                  <td class="text-left text-uppercase">
                                    {{ $t("total") }}
                                  </td>
                                  <td class="text-center">:</td>
                                  <td
                                    class="text-right primary--text text-bold"
                                  >
                                    {{ numberFormat(invoice.total) }}
                                  </td>
                                </tr>
                                <tr>
                                  <td class="text-left">
                                    {{ $t("deposit") }}
                                    <span class="float-right primary--text">{{
                                      numberFormat(invoice.depositAmount)
                                    }}</span>
                                  </td>
                                  <td class="text-center">:</td>
                                  <td class="text-right">
                                    {{ numberFormat(invoice.depositDeduction) }}
                                  </td>
                                </tr>
                                <tr>
                                  <td class="text-left">
                                    {{ $t("remaining") }}
                                  </td>
                                  <td class="text-center">:</td>
                                  <td
                                    class="text-right primary--text text-bold"
                                  >
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
                  <v-divider />
                  <v-card outlined dense class="no_border function_footer py-2">
                    <p class="float-left py-2 mb-0  color_grey">
                      {{ $t("standard_commercial_invoice") }}
                    </p>
                    <v-btn @click="_print" class="float-right save_print mx-1">
                      {{ $t("print") }}
                    </v-btn>
                    <div v-if="isVisible">
                      <v-btn
                        class="float-right btn_delete mx-1"
                        @click="onDeleteInvoice('delete')"
                      >
                        {{ $t("delete") }}
                      </v-btn>
                      <v-btn
                        class="float-right btn_save_draft mx-1"
                        @click="onEditInvoice('edit')"
                      >
                        {{ $t("edit") }}
                      </v-btn>
                    </div>
                  </v-card>
                  <v-divider />
                </v-form>
              </v-col>
              <v-col
                class="smallSide"
                sm="4"
                style="transition: .3s ease-in;"
                :class="{ hide_small_bar_class: isHideBar }"
              >
                <h3
                  style="color: #b3b5bc; font-size:20px;"
                  v-if="!isHideBar"
                  class="text-uppercase float-right mt-n3"
                >
                  Help
                  <v-icon
                    onclick="window.history.go(-1); return false;"
                    style="cursor: pointer; color: #333; font-size: 40px;"
                    class="float-right mt-n1"
                    >close
                  </v-icon>
                </h3>

                <div v-if="!isHideBar" class="small_sidebar mt-8 px-4 grayBg">
                  <v-card
                    style="margin-bottom: 2px;"
                    outlined
                    dense
                    class="pa-3 no_border my_card rounded-4 white--text"
                    color="primary"
                    height="60px"
                  >
                    <h3 class="text-left font_13 flex-1 text-uppercase">
                      {{ $t("amount_due") }}
                    </h3>
                    <h3 class="text-right flex-1 font_20 niradei_heavy">
                      {{ numberFormat(invoice.amountDue) }}
                    </h3>
                  </v-card>
                  <v-row>
                    <v-col sm="12" cols="12">
                      <!-- <h4 class="my-2 text-uppercase">{{ $t("analysis") }}</h4> -->
                      <v-row>
                        <v-col sm="6" cols="6" class="py-1">
                          <label class="label">{{ $t("segment") }}</label>
                          <h3 class="text-bold d-block py-1">{{ segment }}</h3>
                        </v-col>
                        <v-col sm="6" cols="6" class="py-1">
                          <label class="label">{{ $t("location") }}</label>
                          <h3 class="text-bold d-block py-1">{{ location }}</h3>
                        </v-col>
                        <v-col sm="6" cols="6" class="py-1">
                          <label class="label">{{ $t("employee") }}</label>
                          <h3 class="text-bold d-block py-1">{{ employee }}</h3>
                        </v-col>
                        <v-col sm="6" cols="6" class="py-1">
                          <label class="label">{{ $t("project") }}</label>
                          <h3 class="text-bold d-block py-1">{{ project }}</h3>
                        </v-col>
                        <v-col sm="6" cols="6" class="py-0">
                          <label class="label">{{ $t("sale_channel") }}</label>
                          <h3 class="text-bold d-block py-1">
                            {{ saleChannel }}
                          </h3>
                          <label class="label">{{ $t("ref_from") }}</label>
                          <div
                            v-for="itm in invoice.refFrom"
                            v-bind:key="itm.id"
                          >
                            <h4 class="text-bold d-block py-2">
                              <router-link
                                :to="{ path: '/en/sale_order_view/' + itm.id }"
                              >
                                {{ itm.reference || "" }}
                              </router-link>
                            </h4>

                            <!--                                                        <h3 class="text-bold d-block py-2">{{-->
                            <!--                                                                itm.reference || ''-->
                            <!--                                                            }}</h3>-->
                          </div>
                        </v-col>
                        <v-col sm="6" cols="6" class="py-0">
                          <label class="label">{{ $t("ref_to") }}</label>
                          <div v-for="itm in invoice.refTo" v-bind:key="itm.id">
                            <h4 class="text-bold d-block py-2">
                              <router-link
                                :to="{ path: '/en/cash_receipt/' + itm.id }"
                              >
                                {{ itm.reference || "" }}
                              </router-link>
                            </h4>
                            <!--                                                        <h3 class="text-bold d-block py-2">{{-->
                            <!--                                                                itm.reference || ''-->
                            <!--                                                            }}</h3>-->
                          </div>
                        </v-col>
                        <!--                                                <v-col sm="6" cols="6" class="py-0">-->
                        <!--                                                    <label class="label">{{ $t('batch_session_no') }}</label>-->
                        <!--                                                    <h4 class="text-bold py-1">1010101</h4>-->
                        <!--                                                </v-col>-->
                      </v-row>
                      <div
                        class="mt-3"
                        style="height:3px; background-color:#ffffff;width:100%;"
                      ></div>
                      <!--                                            <h4 class="my-2 text-uppercase">{{ $t('added_transaction') }}</h4>-->
                      <!--                                            <v-row>-->
                      <!--                                                <v-col sm="5" cols="12">-->
                      <!--                                                    <label-->
                      <!--                                                        class="label text-bold  text-capitalize pt-6">{{-->
                      <!--                                                            $t('purchase_order')-->
                      <!--                                                        }}</label><br>-->
                      <!--                                                </v-col>-->
                      <!--                                                <v-col sm="7" cols="12">-->
                      <!--                                                    <h4 class="color_grey">PO0720-001</h4>-->
                      <!--                                                    <h4 class="color_grey">PO0720-001</h4>-->
                      <!--                                                </v-col>-->
                      <!--                                            </v-row>-->
                      <!--                                            <div class="mt-3"-->
                      <!--                                                 style="height:3px; background-color:#ffffff;width:100%;"></div>-->

                      <v-row>
                        <v-col sm="12" cols="12" class="py-0">
                          <label
                            class="label color_grey font_10 text-capitalize pt-6"
                            >{{ $t("customer_reference_no") }}</label
                          ><br />
                          <h4 class="text-bold">{{ crn }}</h4>

                          <label
                            class="label color_grey font_10 text-capitalize pt-6"
                            >{{ $t("payment_code") }}</label
                          ><br />
                          <v-simple-table>
                            <template v-slot:default>
                              <tbody>
                                <tr>
                                  <td class="text-left px-2" width="120px">
                                    {{ $t("code") }}
                                  </td>
                                  <td class="text-center px-2">
                                    {{ $t("amount") }}
                                  </td>
                                  <!--                                                                <td class="text-center">{{ // $t('due_date') }}</td>-->
                                  <td class="text-center">
                                    {{ $t("status") }}
                                  </td>
                                </tr>
                                <tr
                                  v-for="item in invoiceScheduleList"
                                  v-bind:key="item.paymentCode"
                                >
                                  <td class="text-left px-2" width="120px">
                                    {{ paymentCode(item.paymentCode) }}
                                  </td>
                                  <td class="text-center px-2">
                                    {{ numberFormat(item.amount) }}
                                  </td>
                                  <!--                                                                <td class="text-center px-2">{{-->
                                  <!--                                                                        formatDate(item.dueDate)-->
                                  <!--                                                                    }}-->
                                  <!--                                                                </td>-->
                                  <td class="text-center px-2">
                                    {{ status(item.status) }}
                                  </td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </v-col>

                        <v-col sm="12" cols="12" class="py-0">
                          <label
                            class="label color_grey font_10 text-capitalize pt-6"
                            >{{ $t("invoice_link") }}</label
                          ><br />
                          <a
                            class="font_12 primary--text"
                            @click="openPublicLink"
                            >{{ invoice.referenceNo }}</a
                          >
                        </v-col>
                      </v-row>

                      <p class="color_grey mt-6 mb-2">
                        {{ $t("transaction_history") }}
                      </p>
                      <v-simple-table>
                        <template v-slot:default>
                          <tbody>
                            <tr
                              v-for="item in invoiceHistory"
                              v-bind:key="item.id"
                            >
                              <td class="text-left px-0 font_12">
                                {{ item.name }}
                              </td>
                              <td class="text-center px-0 font_12">
                                {{ formatDateTime(item.createdAt) }} &nbsp; ({{
                                  item.timeSince
                                }})
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                      <!--                                            <div class="my-3"-->
                      <!--                                                 style="height:3px; background-color:#ffffff;width:100%;"></div>-->

                      <!--                                            <p class="mb-1" color="color_grey">{{ $t('communication_history') }}</p>-->
                      <!--                                            <p class="mb-1">{{ $t('sent_on') }} : <span class="text-bold">20 May 2020 – 6:00 PM</span>-->
                      <!--                                            </p>-->
                      <!--                                            <p class="mb-1">{{ $t('seen_on') }} : <span class="text-bold">20 May 2020 – 6:00 PM</span>-->
                      <!--                                            </p>-->
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="dialogTax" max-width="450px">
        <v-card>
          <div class="modal_header">
            <v-card-title>{{ $t("tax_list") }}</v-card-title>
            <v-icon class="btn_close" @click="dialogTax = false">close</v-icon>
          </div>
          <v-card-text class="modal_text_content">
            <v-row>
              <v-col sm="12" cols="12" class="pb-0">
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr
                        v-for="(value, name) in invoice.taxListTotal"
                        v-bind:key="name"
                      >
                        <td class="text-left" width="180px">{{ name }}</td>
                        <td class="text-center">:</td>
                        <td class="text-right">
                          {{ numberFormat(value) }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left" width="180px">
                          {{ $t("total") }}
                        </td>
                        <td class="text-center">:</td>
                        <td class="text-right">
                          {{ numberFormat(invoice.totalTaxAmount) }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import InvoiceModel from "@/scripts/invoice/model/Invoice";
import SaleFormContentModel from "@/scripts/model/SaleFormContent";
import RecurringModel from "@/scripts/invoice/model/Recurring";
import kendo from "@progress/kendo-ui";
// import DatePickerComponent from "@/components/custom_templates/DatePickerComponent";
// import LinkTemplate from "@/components/kendo_templates/LinkTemplate";
import { getPrint } from "@/form/invoices.js";
import { dataStore } from "@/observable/store";

const cookieJS = require("@/cookie.js");
const cookie = cookieJS.getCookie();

const billingHandler = require("@/scripts/invoice/handler/billingHandler");
const recurringHandler = require("@/scripts/invoice/handler/recurringHandler");
const saleFormContentHandler = require("@/scripts/saleFormContentHandler");
const invoiceModel = new InvoiceModel({});
const saleFormContentModel = new SaleFormContentModel({});
const recurringModel = new RecurringModel({});
export default {
  name: "InvoiceView",
  props: ["id"],
  components: {
    LoadingMe: () => import(`@/components/Loading`),
    // "app-datepicker": DatePickerComponent,
  },
  data: () => ({
    showLoading: true,
    showLoadingAtch: false,
    loadingAlert: false,
    loadingColorAlert: "",
    loadingTextAlert: "",
    dialogM2: false,
    dialogM3: false,
    dialogTax: false,
    alert: false,
    is_invoice_opened: true,
    files: [],
    valid: true,
    itemLines: [],
    recurringInvoiceDate: new Date().toISOString().substr(0, 10),
    col_expand: 9,
    col_hide: 3,
    isHideBar: false,
    billingNumber: 1,
    billingLabel: "",
    billingMethod: ["Fixed Payment", "Equal Payment"],
    recurringPeriod: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
    renewSetting: ["Open", "Fixed"],
    mRenewSetting: "Open",
    mMethod: "Equal Payment",
    mRecurringPeriod: "Monthly",
    taxListTotal: [],
    invoice: invoiceModel,
    recurring: recurringModel,
    dateFormat: invoiceModel.dateFormat,
    saleFormContent: saleFormContentModel,
    invoiceScheduleList: [],
    invoiceHistory: [],
    loggedUser: {
      id: "cf3d10ab-bce6-47b3-8405-b448c23dad84",
      name: "Mr. Inspector",
    },
    // form
    form_setting: {},
    imgFile: "",
    src: "",
    file_: {},
    fileDesc: "",
    fileSize: 0,
    fileType: "",
    fileName: "",
    attachmentList: [],
  }),
  methods: {
    openPublicLink() {
      if (process.env.VUE_APP_MODE == "dev") {
        window.open(
          `http://localhost:8082/${this.$route.params.locale}/invoice/${this.invoice.publicLink}/${cookie.instituteId}`
        );
      } else {
        window.open(
          `https://invoices.banhji.com/${this.$route.params.locale}/invoice/${this.invoice.publicLink}/${cookie.instituteId}`
        );
      }
    },
    async loadAttachment() {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          if (this.$route.params.hasOwnProperty("id")) {
            this.showLoadingAtch = true;
            const strFilter = "?id=" + this.$route.params.id;
            billingHandler.attachmentList(strFilter).then((res) => {
              if (res.data.statusCode === 200) {
                this.showLoadingAtch = false;
                this.attachmentList = res.data.data;
              }
            });
          }
        }, 10);
      });
    },
    onFileChange(e) {
      if (e) {
        this.fileDesc = e.name;
        this.fileName = e.name;
        this.fileSize = e.size;
        this.fileType = e.type;
        let input = this.files;
        // Ensure that you have a file before attempting to read it
        if (input) {
          let reader = new FileReader();
          // Define a callback function to run, when FileReader finishes its job
          reader.onloadend = (e) => {
            // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
            // Read image as base64 and set to imageData
            this.imgFile = e.target.result;
          };
          // Start the reader job - read file as a data url (base64 format)
          reader.readAsBinaryString(input);
          this.src = URL.createObjectURL(input);
        }
      }
    },
    async uploadFile() {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          if (this.imgFile) {
            if (this.$route.params.hasOwnProperty("id")) {
              const id = this.$route.params.id || "";
              const name = this.invoice.referenceNo || "";
              let data = {
                file: this.imgFile,
                info: {
                  name: this.fileName,
                  description: this.fileDesc,
                  size: this.fileSize,
                  type: this.fileType,
                },
                type: "Transaction",
                id: id,
                name: name,
              };
              this.showLoading = true;
              billingHandler.attachment(data).then((res) => {
                if (res.data.statusCode === 201) {
                  this.showLoading = false;
                  this.imgFile = null;
                  this.src = "";
                  this.fileDesc = "";
                  this.fileName = "";
                  this.fileSize = 0;
                  this.fileType = "";
                  this.$snotify.success("Success");
                  this.loadAttachment();
                  // this.txnList = JSON.parse(JSON.stringify(res.data.data))
                  // window.console.log('transactions', this.txnList)
                }
              });
            }
          } else {
            this.showLoading = false;
            this.$snotify.error("Please browse to upload image");
          }
        }, 10);
      });
    },
    fileUrl(dataItem) {
      if (dataItem.fileUrl) {
        return `<a target="_blank" style="color:#ED1A3A !important" href="${dataItem.fileUrl}"><span>Open</span></a>`;
      }
      return ``;
    },
    byteToMB(dataItem) {
      const FileSize = dataItem.size || 0; // in MiB
      const marker = 1024; // Change to 1000 if required
      const decimal = 3; // Change as required
      const kiloBytes = marker; // One Kilobyte is 1024 bytes
      const megaBytes = marker * marker; // One MB is 1024 KB
      const gigaBytes = marker * marker * marker; // One GB is 1024 MB
      // const teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

      // return bytes if less than a KB
      if (FileSize < kiloBytes) {
        return FileSize + " Bytes";
      }
      // return KB if less than a MB
      else if (FileSize < megaBytes) {
        return (FileSize / kiloBytes).toFixed(decimal) + " KB";
      }
      // return MB if less than a GB
      else if (FileSize < gigaBytes) {
        return (FileSize / megaBytes).toFixed(decimal) + " MB";
      }
      // return GB if less than a TB
      else {
        return (FileSize / gigaBytes).toFixed(decimal) + " GB";
      }

      /* var FileSize = file.files[0].size / 1024 / 1024; // in MiB
            if (FileSize > 2) {
                alert('File size exceeds 2 MiB');
               // $(file).val(''); //for clearing with Jquery
            } else {
                        alert('File size' + FileSize);
            } */
    },
    _print() {
      let pub_link = "";
      if (process.env.VUE_APP_MODE == "dev") {
        pub_link = `http://localhost:8082/${this.$route.params.locale}/invoice/${this.invoice.publicLink}/${cookie.instituteId}`;
      } else {
        pub_link = `https://invoices.banhji.com/${this.$route.params.locale}/invoice/${this.invoice.publicLink}/${cookie.instituteId}`;
      }
      dataStore.publick_inv_link = pub_link;
      getPrint(this.invoice, this.invoiceScheduleList).then((res) => {
        window.console.log("res", res);
      });
    },

    hideMultiplePaymentBtn() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("status")) {
          if (this.invoice.status === 1) {
            return true;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    async onSaveCloseRecurring() {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          const data = {
            id: this.recurring.id,
            name: this.recurring.name,
            txnId: this.invoice.id,
            customer: this.invoice.customer,
            amount: this.invoice.total,
            referenceNo: this.invoice.referenceNo,
            transactionType: this.invoice.transactionType,
            transactionDate: this.invoice.transactionDate,
            txnStartDate: this.recurringInvoiceDate,
            frequency: this.recurring.frequency,
            noOfRecurring: this.recurring.noOfRecurring,
            type: "Recurring Invoice",
            status: 1,
          };
          recurringHandler
            .create(data)
            .then((response) => {
              if (response.data.statusCode === 201) {
                // this.invoiceScheduleList = response.data.data
                this.dialogM3 = false;
                this.$snotify.success("Successfully");
              }
            })
            .catch((e) => {
              this.$snotify.error("Something went wrong");
              this.errors.push(e);
            });
        }, 10);
      });
    },
    async onSaveClosePaymentScheme() {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          const data = {
            id: this.invoice.id,
            paymentScheme: {
              method: this.mMethod,
              number: this.billingNumber,
            },
            amountDue: this.invoice.amountDue,
            dueDate: this.invoice.dueDate,
            type: this.invoice.type,
            txnRate: this.invoice.txnRate,
            crn: this.invoice.customer.crn ? this.invoice.customer.crn : "",
            invoiceScheduleList: this.invoiceScheduleList,
          };
          window.console.log("data", data);
          billingHandler
            .schedule(data)
            .then((response) => {
              if (response.data.statusCode === 201) {
                this.invoiceScheduleList = response.data.data;
                this.dialogM2 = false;
                this.$snotify.success("Successfully");
              }
            })
            .catch((e) => {
              this.$snotify.error("Something went wrong");
              this.errors.push(e);
            });
        }, 10);
      });
    },
    onBillingMethodChanged() {
      if (this.mMethod === "Equal Payment") {
        this.billingLabel = "The number of months for payment";
      } else {
        this.billingLabel = "Payment Amount";
      }
    },
    numberFormat(value) {
      return kendo.toString(value, `n${this.saleFormContent.decimal}`);
    },
    formatDate(value) {
      return kendo.toString(new Date(value), this.dateFormat);
    },
    formatDateTime(value) {
      return kendo.toString(new Date(value), this.dateFormat + ` hh:mm tt`);
    },
    paymentCode(code) {
      return code.replace("psc-", "");
    },
    status(value) {
      let statusText = "";
      switch (value) {
        case 1:
          statusText = "OPEN";
          break;
        case 2:
          statusText = "PARTIALLY PAID";
          break;
        case 3:
          statusText = "PAID";
          break;
        case 4:
          statusText = "VOID";
          break;
      }
      return statusText;
    },
    amountFormat(value) {
      return kendo.toString(value.amount, `n${this.saleFormContent.decimal}`);
    },
    priceFormat(value) {
      return kendo.toString(value.price, `n${this.saleFormContent.decimal}`);
    },
    rowNumberTmpl(dataItem) {
      let ds = this.$refs.itemLineDS.kendoWidget(),
        index = ds.indexOf(dataItem);
      return index + 1;
    },
    vatTemplate(dataItem) {
      const vat = dataItem.vatTax;
      if (vat) {
        return `<span>${vat.defaultTax ? vat.defaultTax : ``}</span>`;
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
              }
            }
          });
        }, 10);
      });
    },
    async loadInvoiceHistory() {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          this.showLoading = true;
          billingHandler
            .history(this.$route.params.id)
            .then((res) => {
              if (res.data.statusCode === 200) {
                this.showLoading = false;
                this.invoiceHistory = res.data.data;
              }
            })
            .catch();
          {
            this.showLoading = false;
          }
        }, 10);
      });
    },
    async loadViewInvoice() {
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
                this.itemLines = this.invoice.itemLines;
                window.console.log("this.invoice", this.invoice);
              }
            })
            .catch();
          {
            this.showLoading = false;
          }
        }, 10);
      });
    },
    async loadPaymentScheduleList() {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          this.showLoading = true;
          billingHandler
            .scheduleList(this.$route.params.id)
            .then((res) => {
              if (res.data.statusCode === 200) {
                this.showLoading = false;
                this.invoiceScheduleList = res.data.data;
              }
            })
            .catch();
          {
            this.showLoading = false;
          }
        }, 10);
      });
    },
    clear() {},
    accountDropDownEditor() {},
    hideSmallSideBar() {
      this.isHideBar = !this.isHideBar;
    },
    async initData() {
      if (this.$route.params.id !== undefined) {
        await this.loadViewInvoice();
        await this.loadPaymentScheduleList();
        await this.loadInvoiceHistory();
      }
    },
    autoCalculateDiscount(discountItem, subTotal) {
      if (discountItem) {
        const nature = discountItem.nature;
        const amount = discountItem.amount;
        if (nature === "Amount") {
          return kendo.parseFloat(amount);
        } else if (nature === "Percentage") {
          return subTotal * (kendo.parseFloat(amount) / 100);
        }
      }
    },
    otherCharge(obj) {
      if (this.invoice) {
        const amount = this.autoCalculateDiscount(obj, this.invoice.subTotal);
        return this.numberFormat(amount);
      }
      return 0;
    },
    onEditInvoice(type) {
      const id = this.$route.params.id;
      this.$router.push({
        path: "invoice/" + id,
        name: "Invoice",
        params: { id: id },
        query: { type: type },
      });
      // window.console.log(this.$router.currentRoute)

      // const data = {
      //     query: {type: 'edit'},
      //     params: {id: id}
      // }
      // let args = {
      //     text: '',
      //     url: `invoice/${id}`,
      //     data: data,
      // }
      // return {
      //     template: LinkTemplate,
      //     templateArgs: args
      // }
    },
    onDeleteInvoice() {
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4d4848",
        cancelButtonColor: "#ED1A3A",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          this.onSaveInvoice();
          // this.clear()
          // this.$router.go(-1)
        }
      });
    },
    async onSaveInvoice() {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          const txnId = this.$route.params.id;
          if (txnId) {
            const data = {
              id: txnId,
              loggedUser: this.loggedUser,
              actionType: "delete",
            };
            billingHandler
              .create(data)
              .then((response) => {
                if (response.data.statusCode === 201) {
                  this.$snotify.success("Successfully");
                  this.close(data);
                }
              })
              .catch((e) => {
                this.$snotify.error("Something went wrong");
                this.errors.push(e);
              });
          }
        }, 10);
      });
    },
    close(data) {
      this.$router.push({
        name: "Customers",
        params: {
          data: data,
        },
      });
    },
    reloadData(value) {
      window.console.log("reload" + value, this.$route.params);
    },
  },
  computed: {
    isVisible: {
      get() {
        if (this.invoice) {
          if (this.invoice.hasOwnProperty("status")) {
            return this.invoice.status === 1;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
    },
    qrPayment() {
      if (this.invoice) {
        const qr = this.invoice.qrPayment || {};
        if (qr.id) {
          return qr.code + "-" + qr.name;
        }
      }
      return "-";
    },
    bankTransfer() {
      if (this.invoice) {
        const bank = this.invoice.bankTransfer || {};
        if (bank.id) {
          return bank.code + "-" + bank.name;
        }
      }
      return "-";
    },
    billPayment() {
      if (this.invoice) {
        const bill = this.invoice.billPayment || {};
        if (bill.id) {
          return bill.code + "-" + bill.name;
        }
      }
      return "-";
    },
    cashPayment() {
      if (this.invoice) {
        const cash = this.invoice.cashPayment || {};
        if (cash.id) {
          return cash.code + "-" + cash.name;
        }
      }
      return "-";
    },
    transactionType() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("transactionType")) {
          if (this.invoice.transactionType.hasOwnProperty("id")) {
            return this.invoice.transactionType.name;
          }
        }
      }
      return "";
    },
    paymentTerm() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("paymentTerm")) {
          if (this.invoice.paymentTerm.hasOwnProperty("id")) {
            return this.invoice.paymentTerm.name;
          }
        }
      }
      return "";
    },
    accountReceivable() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("receivableAcc")) {
          if (this.invoice.receivableAcc.hasOwnProperty("id")) {
            return this.invoice.receivableAcc.name;
          }
        }
      }
      return "";
    },
    dueDate() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("dueDate")) {
          return kendo.toString(
            new Date(this.invoice.dueDate),
            this.dateFormat
          );
        }
      }
      return "";
    },
    transactionDate() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("transactionDate")) {
          return kendo.toString(
            new Date(this.invoice.transactionDate),
            this.dateFormat
          );
        }
      }
      return "";
    },
    customerName() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("customer")) {
          if (this.invoice.customer.hasOwnProperty("id")) {
            return this.invoice.customer.name;
          }
        }
      }
      return "";
    },
    crn() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("customer")) {
          if (this.invoice.customer.hasOwnProperty("crn")) {
            return this.invoice.customer.crn;
          }
        }
      }
      return "-";
    },
    currency() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("priceLevel")) {
          if (this.invoice.priceLevel.hasOwnProperty("currency")) {
            return this.invoice.priceLevel.currency.code;
          }
        }
      }
      return "";
    },
    priceLevel() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("priceLevel")) {
          if (this.invoice.priceLevel.hasOwnProperty("id")) {
            return this.invoice.priceLevel.name;
          }
        }
      }
      return "";
    },
    lateFee() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("lateFee")) {
          if (this.invoice.lateFee.hasOwnProperty("id")) {
            return this.invoice.lateFee.name;
          }
        }
      }
      return "";
    },
    segment() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("segment")) {
          if (this.invoice.segment.hasOwnProperty("id")) {
            return this.invoice.segment.name;
          }
        }
      }
      return "";
    },
    location() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("location")) {
          if (this.invoice.location.hasOwnProperty("id")) {
            return this.invoice.location.name;
          }
        }
      }
      return "";
    },
    saleChannel() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("saleChannel")) {
          if (this.invoice.saleChannel.hasOwnProperty("id")) {
            return this.invoice.saleChannel.name;
          }
        }
      }
      return "";
    },
    project() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("project")) {
          if (this.invoice.project.hasOwnProperty("id")) {
            return this.invoice.project.name;
          }
        }
      }
      return "";
    },
    employee() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("employee")) {
          if (this.invoice.employee.hasOwnProperty("id")) {
            return (
              this.invoice.employee.firstName +
              " - " +
              this.invoice.employee.lastName
            );
          }
        }
      }
      return "";
    },
    billingAddress() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("billingAddress")) {
          if (this.invoice.billingAddress.hasOwnProperty("id")) {
            return this.invoice.billingAddress.name;
          }
        }
      }
      return "";
    },
    deliveryAddress() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("deliveryAddress")) {
          if (this.invoice.deliveryAddress.hasOwnProperty("id")) {
            return this.invoice.deliveryAddress.name;
          }
        }
      }
      return "";
    },
    transactionNote() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("transactionNote")) {
          return this.invoice.transactionNote;
        }
      }
      return "";
    },
    journalNote() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("journalNote")) {
          return this.invoice.journalNote;
        }
      }
      return "";
    },
    deliveryDateTime() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("deliveryDateTime")) {
          return kendo.toString(
            new Date(this.invoice.deliveryDateTime),
            this.dateFormat
          );
        }
      }
      return "";
    },
    specificDiscount() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("specificDiscountItem")) {
          if (this.invoice.specificDiscountItem.hasOwnProperty("id")) {
            return this.invoice.specificDiscountItem.name;
          }
        }
      }
      return "";
    },

    invoiceStatus() {
      if (this.invoice) {
        if (this.invoice.hasOwnProperty("status")) {
          const status = this.invoice.status;
          let statusText = "";
          switch (status) {
            case 1:
              statusText = "OPEN";
              break;
            case 2:
              statusText = "PARTIALLY PAID";
              break;
            case 3:
              statusText = "PAID";
              break;
            case 4:
              statusText = "VOID";
              break;
          }
          return statusText;
        }
      }
      return "";
    },
  },
  activated() {
    // this.visibleMe = this.hideMultiplePaymentBtn()
    // window.console.log(this.visibleMe, 'Activated')
  },
  watch: {
    id() {
      if (this.$route.params.id === undefined) {
        this.clear();
      } else {
        this.showLoading = true;
        this.loadViewInvoice();
        this.loadPaymentScheduleList();
        this.loadInvoiceHistory();
        this.loadAttachment();
      }
    },
    // isVisible(value) {
    //     this.visibleMe = value
    //     window.console.log('isVisible', value)
    // }
    // '$route': 'reloadData'/**/
  },
  mounted: async function() {
    await this.loadSaleFormContent();
    await this.initData();
    await this.loadAttachment();
    // this.getFormSetting()
  },
};
</script>

<style scoped>
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

.custom_grid table th:last-child {
  text-align: right !important;
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
  .save_print {
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
  background-color: #edf1f5;
  min-height: 120px;
}

.deposite_input {
  width: 100px;
}

.btn_add_small {
  height: 27px !important;
  min-width: 25px !important;
  font-size: 10px;
  padding: 0 22px !important;

  color: #ffffff;
  border-radius: 0 !important;
}

.list_site_inv {
  color: #ffffff;
  font-size: 12px;
}

.list_site_exp {
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
</style>
