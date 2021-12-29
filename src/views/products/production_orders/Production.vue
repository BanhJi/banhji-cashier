<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col sm="12" cols="12">
          <v-card outlined dense class="pa-4 no_border rounded-sm" color="white">
            <v-row>
              <v-col class="bigSide py-0" sm="8" cols="12" style="transition: .3s ease-in;"
                     :class="{'hide_big_bar_class':isHideBar}">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-card outlined dense class="no_border">
                    <h2 class="mb-0">{{ $t('production') }}</h2>
                    <v-icon v-if="isHideBar" onclick="window.history.go(-1); return false;"
                            style="cursor: pointer; color: #333; font-size: 40px;"
                            class="float-right">close
                    </v-icon>
                    <span style="transition: .3s ease-in; z-index:10;"
                          :class="{'iconArrow': !isHideBar,'iconArrowHide': isHideBar }">
                                        <v-icon size="22" class="arr_icon" @click="hideSmallSideBar" v-if="isHideBar"> fa fa-chevron-circle-left
                                        </v-icon>
                                        <v-icon size="22" class="arr_icon" @click="hideSmallSideBar" v-if="!isHideBar"> fa fa-chevron-circle-right
                                        </v-icon>
                                    </span>
                  </v-card>
                  <v-card outlined dense class="px-3 no_border" color="grayBg" height="90px">
                    <v-row>
                      <v-col sm="4" cols="12" class="pb-0">
                        <label class="label">{{ $t('production_no') }}</label>
                        <h3 class="text-bold  py-1">{{ production.abbr }}-{{
                            production.number
                          }}</h3>
                      </v-col>
                      <v-col sm="4" cols="12" class="pb-0">
                        <label class="label">{{ $t('completion_date') }}</label>
                        <app-datepicker :initialDate="completedAt"
                                        @emitDate="completedAt = $event"/>
                      </v-col>

                    </v-row>
                  </v-card>
                  <v-row style="background-color: #fff;">
                    <v-col cols="12" class="pb-0">
                      <h2 class="primary--text mb-0 font_20 text-uppercase">
                        {{ $t('finish_product_variant') }}</h2>
                    </v-col>
                    <v-col sm="12" cols="12" class="pt-0">
                      <kendo-datasource ref="finishProductDS" :data="finishProducts"/>
                      <kendo-grid
                          id="gridFinishProduct"
                          class="grid-function"
                          :data-source-ref="'finishProductDS'"
                          :sortable="false"
                          :filterable="false"
                          :column-menu="true"
                          :editable="false"
                          :scrollable-virtual="true">
                        <kendo-grid-column :template="rowNumberFP"
                                           :title="$t('no.')"
                                           :width="55"
                                           :column-menu="false"
                                           :headerAttributes="{
                                                        style: 'background-color: #EDF1F5;',
                                                        class: 'text-variants'
                                                    }"
                                           :attributes="{
                                                        style: 'text-align: variants'
                                                    }"/>
                        <kendo-grid-column :field="'item'"
                                           :title="$t('items')"
                                           :width="200"
                                           :template="itemTemplate"
                                           :headerAttributes="{
                                                        style: 'background-color: #EDF1F5'
                                                    }"/>
                        <kendo-grid-column :field="'description'"
                                           :title="$t('description')"
                                           :width="200"
                                           :headerAttributes="{
                                                        style: 'background-color: #EDF1F5'
                                                    }"/>
                        <kendo-grid-column :field="'buom'"
                                           :title="$t('base_uom')"
                                           :width="150"
                                           :template="UOMTemplate"
                                           :editable="()=>{ return false}"
                                           :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                           :attributes="{style: 'text-align: right; '}"/>
                        <kendo-grid-column :field="'yieldQty'"
                                           :title="$t('yield_qty')"
                                           :attributes="{class: 'k-state-disabled', style: 'text-align: right'}"
                                           :width="150"
                                           :template="'<span>#=kendo.toString(yieldQty || 0, decimalFormat) || 0#</span>'"
                                           :headerAttributes="{
                                                            style: 'text-align: right; background-color: #EDF1F5'
                                                        }"/>
                        <kendo-grid-column :field="'cost'"
                                           :title="$t('cost')"
                                           :width="150"
                                           :template="'<span>#=kendo.toString(cost || 0, decimalFormat) || 0#</span>'"
                                           :headerAttributes="{
                                                            style: 'text-align: right; background-color: #EDF1F5'
                                                        }"
                                           :attributes="{
                                                            style: 'text-align: right'
                                                        }"/>
                        <kendo-grid-column :field="'amount'"
                                           :title="$t('amount')"
                                           :width="150"
                                           :template="'<span>#=kendo.toString(amount || 0, decimalFormat) || 0#</span>'"
                                           :headerAttributes="{
                                                            style: 'text-align: right; background-color: #EDF1F5'
                                                        }"
                                           :attributes="{
                                                            style: 'text-align: right'
                                                        }"/>
                      </kendo-grid>
                    </v-col>

                  </v-row>
                  <!-- Grid Two -->
                  <v-row style="background-color: #fff;">
                    <v-col cols="12" class="pb-0">
                      <h2 class="primary--text mb-0 font_20 text-uppercase">
                        {{ $t('other_finished_by_product') }}</h2>
                    </v-col>
                    <v-col sm="12" cols="12" class="pt-0">
                      <kendo-datasource ref="otherProductDS" :data="otherFinishProducts"/>
                      <kendo-grid id="gridOtherProducts" class="grid-function"
                                  :data-source-ref="'otherProductDS'" :sortable="false"
                                  :filterable="false" :column-menu="true" :editable="false"
                                  :scrollable-virtual="true">
                        <kendo-grid-column
                            :template="rowNumberOP"
                            :title="$t('no.')"
                            :width="55"
                            :column-menu="false"
                            :headerAttributes="{
                                                    style: 'background-color: #EDF1F5;',
                                                    class: 'text-variants'
                                                }"
                            :attributes="{
                                                    style: 'text-align: variants'
                                                }"/>
                        <kendo-grid-column :field="'item'"
                                           :title="$t('item')"
                                           :width="200"
                                           :editable="()=>{ return false}"
                                           :template="itemTemplate"
                                           :headerAttributes="{
                                                        style: 'background-color: #EDF1F5'
                                                    }"/>
                        <kendo-grid-column :field="'description'"
                                           :title="$t('description')"
                                           :width="200"
                                           :editable="()=>{ return false}"
                                           :headerAttributes="{
                                                        style: 'background-color: #EDF1F5'
                                                    }"/>
                        <kendo-grid-column :field="'buom'"
                                           :title="$t('base_uom')"
                                           :width="150"
                                           :template="UOMTemplate"
                                           :editable="()=>{ return false}"
                                           :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                           :attributes="{style: 'text-align: right; '}"/>
                        <kendo-grid-column :field="'yieldQty'"
                                           :title="$t('yield_qty')"
                                           :width="150"
                                           :editable="()=>{ return false}"
                                           :template="'<span>#=kendo.toString(yieldQty || 0, decimalFormat) || 0#</span>'"
                                           :headerAttributes="{
                                                            style: 'text-align: right; background-color: #EDF1F5'
                                                        }"
                                           :attributes="{
                                                            style: 'text-align: right'
                                                        }"/>
                        <kendo-grid-column :field="'cost'"
                                           :title="$t('cost')"
                                           :width="150"
                                           :editable="()=>{ return false}"
                                           :template="'<span>#=kendo.toString(cost || 0, decimalFormat) || 0#</span>'"
                                           :headerAttributes="{
                                                            style: 'text-align: right; background-color: #EDF1F5'
                                                        }"
                                           :attributes="{
                                                            style: 'text-align: right'
                                                        }"/>
                        <kendo-grid-column :field="'amount'"
                                           :title="$t('amount')"
                                           :width="150"
                                           :editable="()=>{ return false}"
                                           :template="'<span>#=kendo.toString(amount || 0, decimalFormat) || 0#</span>'"
                                           :headerAttributes="{
                                                            style: 'text-align: right; background-color: #EDF1F5'
                                                        }"
                                           :attributes="{
                                                            style: 'text-align: right'
                                                        }"/>
                      </kendo-grid>
                    </v-col>
                  </v-row>
                  <!-- Grid Three -->
                  <!--                  <v-row style="background-color: #fff;">-->
                  <!--                    <v-col cols="12" class="pb-0">-->
                  <!--                      <h2 class="greyText&#45;&#45;text mb-0 font_20 text-uppercase">-->
                  <!--                        {{ $t('components_used') }}</h2>-->
                  <!--                    </v-col>-->
                  <!--                    <v-col sm="12" cols="12" class="pt-0">-->
                  <!--                      <kendo-datasource ref="componentUsedDS"-->
                  <!--                                        :data="componentUseds"/>-->
                  <!--                      <kendo-grid id="gridComponentUsed"-->
                  <!--                                  class="grid-function"-->
                  <!--                                  :data-source-ref="'componentUsedDS'"-->
                  <!--                                  :sortable="false"-->
                  <!--                                  :filterable="false"-->
                  <!--                                  :column-menu="true"-->
                  <!--                                  :editable="true"-->
                  <!--                                  :scrollable-virtual="true">-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :template="rowNumberCU"-->
                  <!--                            :title="$t('no.')"-->
                  <!--                            :width="55"-->
                  <!--                            :column-menu="false"-->
                  <!--                            :headerAttributes="{-->
                  <!--                                                        style: 'background-color: #EDF1F5;',-->
                  <!--                                                        class: 'text-variants'-->
                  <!--                                                    }"-->
                  <!--                            :attributes="{-->
                  <!--                                                        style: 'text-align: variants'-->
                  <!--                                                    }"/>-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :field="'item'"-->
                  <!--                            :title="$t('item')"-->
                  <!--                            :width="200"-->
                  <!--                            :template="itemTemplate"-->
                  <!--                            :headerAttributes="{-->
                  <!--                                                            style: 'background-color: #EDF1F5'-->
                  <!--                                                        }"/>-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :field="'description'"-->
                  <!--                            :title="$t('description')"-->
                  <!--                            :width="200"-->
                  <!--                            :headerAttributes="{-->
                  <!--                                                            style: 'background-color: #EDF1F5'-->
                  <!--                                                        }"/>-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :template="UOMTemplate"-->
                  <!--                            :field="'buom'"-->
                  <!--                            :title="$t('base_uom')"-->
                  <!--                            :width="160"-->
                  <!--                            :editable="()=>{ return false}"-->
                  <!--                            :headerAttributes="{-->
                  <!--                                                            style: 'background-color: #EDF1F5'-->
                  <!--                                                        }"/>-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :field="'qty'"-->
                  <!--                            :title="$t('qty')"-->
                  <!--                            :width="150"-->
                  <!--                            :template="'<span>#=kendo.toString(qty || 0, decimalFormat) || 0#</span>'"-->
                  <!--                            :headerAttributes="{-->
                  <!--                                                                style: 'text-align: right; background-color: #EDF1F5'-->
                  <!--                                                            }"-->
                  <!--                            :attributes="{-->
                  <!--                                                                style: 'text-align: right'-->
                  <!--                                                            }"/>-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :field="'cost'"-->
                  <!--                            :title="$t('cost')"-->
                  <!--                            :width="150"-->
                  <!--                            :template="'<span>#=kendo.toString(cost || 0, decimalFormat) || 0#</span>'"-->
                  <!--                            :headerAttributes="{-->
                  <!--                                                                style: 'text-align: right; background-color: #EDF1F5'-->
                  <!--                                                            }"-->
                  <!--                            :attributes="{-->
                  <!--                                                                style: 'text-align: right'-->
                  <!--                                                            }"/>-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :field="'amount'"-->
                  <!--                            :title="$t('amount')"-->
                  <!--                            :width="150"-->
                  <!--                            :editable="()=>{ return false}"-->
                  <!--                            :template="'<span>#=kendo.toString(amount || 0, decimalFormat) || 0#</span>'"-->
                  <!--                            :headerAttributes="{-->
                  <!--                                                            style: 'text-align: right; background-color: #EDF1F5'-->
                  <!--                                                        }"-->
                  <!--                            :attributes="{-->
                  <!--                                                            style: 'text-align: right'-->
                  <!--                                                        }"/>-->
                  <!--                      </kendo-grid>-->
                  <!--                    </v-col>-->
                  <!--                  </v-row>-->
                  <!-- Grid Four -->
                  <v-row style="background-color: #fff;">
                    <v-col sm="12" cols="12" class="py-0">
                      <v-row>
                        <v-col sm="6" cols="6" class="pb-0">
                          <v-textarea no-resize
                                      height="90px"
                                      outlined
                                      clearable
                                      rows="3"
                                      @change="rawJournal(production.productionOrder)"
                                      v-model="production.transactionNote"
                                      placeholder="Memo"/>
                        </v-col>
                        <v-col sm="6" cols="6" class="py-0">
                          <v-simple-table>
                            <template v-slot:default>
                              <tbody>
                              <tr>
                                <td class="text-left text-uppercase">
                                  {{ $t('total_cost') }}
                                </td>
                                <td class="text-center">:</td>
                                <td class="text-right">{{ numberFormat(production.amount) }}</td>
                              </tr>
                              <tr>
                                <td class="text-left text-uppercase">
                                  {{ $t('wip_amount') }}
                                </td>
                                <td class="text-center">:</td>
                                <td class="text-right">({{ numberFormat(production.wipAmount) }})</td>
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
                    <v-alert type="warning"
                             v-model="alert"
                             dismissible>
                      <span v-html="errorMessage"/>
                    </v-alert>
                    <v-btn color="black"
                           class="text-capitalize rounded-pill white--text float-left"
                           @click="cancel">{{ $t('cancel') }}
                    </v-btn>
                    <!--                    <v-menu>-->
                    <!--                      <template v-slot:activator="{ on }">-->
                    <!--                        <v-btn color="primary"-->
                    <!--                               class="ml-2 float-right text-capitalize rounded-pill white&#45;&#45;text"-->
                    <!--                               v-on="on">-->
                    <!--                          {{ $t('save_option') }}-->
                    <!--                          <v-icon size="" class="ma-1">expand_more</v-icon>-->
                    <!--                        </v-btn>-->
                    <!--                      </template>-->
                    <!--                      <v-list rounded>-->
                    <!--                        <v-list-item-group>-->
                    <!--                          <v-list-item>-->
                    <!--                            <v-list-item-content>-->
                    <!--                              <v-list-item-title v-if="!isEdit" @click="saveNew">-->
                    <!--                                {{ $t('save_new') }}-->
                    <!--                              </v-list-item-title>-->
                    <!--                            </v-list-item-content>-->
                    <!--                          </v-list-item>-->
                    <!--                          <v-list-item>-->
                    <!--                            <v-list-item-content>-->
                    <!--                              <v-list-item-title @click="savePrint">{{ $t('save_print') }}-->
                    <!--                              </v-list-item-title>-->
                    <!--                            </v-list-item-content>-->
                    <!--                          </v-list-item>-->
                    <!--                        </v-list-item-group>-->
                    <!--                      </v-list>-->
                    <!--                    </v-menu>-->
                    <div v-if="production.status===1">
                      <v-btn color="primary" @click="saveNew"
                             class="float-right white--text text-capitalize rounded-pill">
                        {{ $t('save_close') }}
                      </v-btn>
                    </div>
                  </v-card>
                </v-form>
              </v-col>
              <v-col class="smallSide" sm="4" style="transition: .3s ease-in;"
                     :class="{'hide_small_bar_class':isHideBar}">
                <h3 style="color: #b3b5bc; font-size:20px;" v-if="!isHideBar"
                    class="text-uppercase float-right mt-n3">Help
                  <v-icon onclick="window.history.go(-1); return false;"
                          style="cursor: pointer; color: #333; font-size: 40px;"
                          class="float-right mt-n1">close
                  </v-icon>
                </h3>

                <div v-if="!isHideBar" class="small_sidebar mt-9 grayBg">
                  <v-row>
                    <v-col sm="12" cols="12">
                      <h4 class="mb-3 text-uppercase">{{ $t("analysis") }}</h4>
                      <label class="label mb-0">{{ $t('segment') }}</label>
                      <v-select class="mt-2"
                                v-model="production.segment"
                                :items="segments"
                                item-value="id"
                                :item-text="item =>`${item.code} - ${item.name}`"
                                return-object
                                tage="sub Of"
                                placeholder="Sub Of"
                                outlined=""/>
                      <label class="label mb-0">{{ $t('location') }}</label>
                      <v-select class="mt-2"
                                v-model="production.location"
                                :items="locations"
                                item-value="id"
                                :item-text="item =>`${item.code} - ${item.name}`"
                                return-object
                                tage="Location"
                                placeholder="bu/location"
                                outlined=""/>
                      <label class="label">{{ $t("project") }}</label>
                      <v-select
                          class="mt-1"
                          v-model="production.project"
                          :items="projects"
                          :item-text="item =>`${item.code} - ${item.name}`"
                          item-value="id"
                          tage="Project"
                          outlined
                      />
                      <label class="label">{{ $t("for_month_of") }}</label>
                      <app-monthpicker
                          :initMonthOf="monthOf"
                          @emitMonthOf="monthOf = $event"
                      />
                    </v-col>
                  </v-row>
                  <p class="mb-0 detial_smallside_p">{{ $t('production_funt_desc') }}</p>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <LoadingMe
          :isLoading="showLoading"
          :fullPage="false"
          type="loading"
          :myLoading="true"/>
    </v-container>
  </v-app>
</template>

<script>
import DatePickerComponent from '@/components/custom_templates/DatePickerComponent'
import MonthOfPicker from "@/components/kendo_templates/MonthOfPicker";
import kendo from "@progress/kendo-ui";
import Journal from "@/scripts/model/Journal";
import Production from "@/scripts/model/Production";
import ComponentUsedModel from "@/scripts/start_production/model/ComponentUsed";
import {uuid} from "vue-uuid";

const productionHandler = require("@/scripts/productionHandler")
const locationHandler = require("@/scripts/locationHandler")
const projectHandler = require("@/scripts/projectHandler")
const settingsHandler = require("@/scripts/settingsHandler")
export default {
  name: "Production",
  components: {
    LoadingMe: () => import(`@/components/Loading`),
    'app-datepicker': DatePickerComponent,
    'app-monthpicker': MonthOfPicker,
  },
  computed: {
    segment() {
      if (this.production.productionOrder) {
        if (this.production.productionOrder.segment) {
          return this.production.productionOrder.segment
        } else {
          return {}
        }
      } else {
        return {}
      }
    },
    location() {
      if (this.production.productionOrder) {
        if (this.production.productionOrder.location) {
          return this.production.productionOrder.location
        } else {
          return {}
        }
      } else {
        return {}
      }
    },
    project() {
      if (this.production.productionOrder) {
        if (this.production.productionOrder.project) {
          return this.production.productionOrder.project
        } else {
          return {}
        }
      } else {
        return {}
      }
    }
  },
  data: () => ({
    alert: false,
    isEdit: false,
    showLoading: false,
    valid: true,
    isHideBar: false,
    production: new Production({}),
    finishProducts: [],
    otherFinishProducts: [],
    componentUseds: [],
    otherCosts: [],
    segments: [],
    locations: [],
    projects: [],
    monthOf: '',
    decimalFormat: 'n2',
    journal: new Journal({}),
    completedAt: new Date().toISOString().substr(0, 10),
    jRaw: []
  }),
  methods: {
    numberFormat(value) {
      return kendo.toString(value, `n${this.decimalFormat}`)
    },
    itemTemplate(dataItem) {
      const item = dataItem.item
      if (item) {
        return `<span>${item.name ? item.name : ``}</span>`
      } else {
        return ``
      }
    },
    async initData() {
      this.showLoading = true
      // const pd = this.$route.params.data
      // const id = this.$route.params.id
      if (this.$route.params.id) {
        const id = this.$route.params.id
        await productionHandler.getById(id).then(res => {
          this.production = res
          this.showLoading = false
          const productionOrder = this.production.productionOrder || {}
          this.finishProducts = productionOrder.finishProduct
          this.otherFinishProducts = productionOrder.otherFinishProduct
          let amount = 0
          this.otherFinishProducts.forEach(n => {
            const lineId = 'lin-' + uuid.v1()
            n['id'] = lineId
            amount += n.amount
          })
          this.finishProducts.forEach(n => {
            const lineId = 'lin-' + uuid.v1()
            n['id'] = lineId
            amount += n.amount
          })

          this.componentUseds = productionOrder.componentUsed
          let wipAmount = 0
          this.componentUseds.forEach(n => {
            wipAmount += n.amount
          })
          this.production.wipAmount = wipAmount
          this.production.amount = amount
          this.production.exchangeAmount = amount
          this.otherCosts = productionOrder.otherCost
          this.rawJournal(productionOrder)
        })

      }
      // if (pd) {
      //   this.production = pd
      // } else {
      //
      // }

    },
    rawJournal(productionOrder) {
      try {
        let nature = ''
        this.jRaw = []
        // const data = productionOrder.componentUsed || []
        const data = productionOrder.finishProduct || []
        const dataOther = productionOrder.otherFinishProduct || []
        const rows = data.filter(m => parseFloat(m.amount) > 0)
        const rowOthers = dataOther.filter(m => parseFloat(m.amount) > 0)
        const currency = productionOrder.currency || {}
        const xRate = productionOrder.exchangeRate || {}
        const txnRate = xRate.rate || 1
        this.production.txnRate = txnRate
        this.production.exchangeRate = xRate
        this.production.currency = currency
        rows.forEach(value => {
          const amt = kendo.parseFloat(value.amount)
          const itemXAmount = amt * kendo.parseFloat(txnRate)
          const item = value.item
          if ((amt > 0)) {
            nature = 'dr'
          } else {
            nature = 'cr'
          }
          if (item) {
            if (item.type === 'Service') {
              if (item.hasOwnProperty('costOfGoodsSoldAcc')) {
                if (item.costOfGoodsSoldAcc.hasOwnProperty('id')) {
                  let costOfGoodsSoldAcc = item.costOfGoodsSoldAcc
                  this.jRaw.push({
                    id: costOfGoodsSoldAcc.id + '-' + nature,
                    line: new ComponentUsedModel(value),
                    description: this.production.transactionNote,
                    account: item.costOfGoodsSoldAcc,
                    accountId: item.costOfGoodsSoldAcc.id,
                    amount: amt, // qty*avg_cost ,
                    exchangeAmount: itemXAmount,//xAmount,
                    type: nature,
                    typeAs: 'item'
                  })
                }

              }
              if (item.hasOwnProperty('deferredIncomeAcc')) {
                if (item.deferredIncomeAcc.hasOwnProperty('id')) {
                  let deferredInAcc = item.deferredIncomeAcc
                  this.jRaw.push({
                    id: deferredInAcc.id + '-' + nature,
                    line: new ComponentUsedModel(value),
                    description: this.production.transactionNote,
                    account: deferredInAcc,
                    accountId: deferredInAcc.id,
                    amount: amt, // qty*avg_cost ,
                    exchangeAmount: itemXAmount,//,
                    type: nature,
                    typeAs: 'item'
                  })
                }
              }
            } else if (item.type === 'Variant') {
              if (item.hasOwnProperty('inventoryAcc')) {
                if (item.inventoryAcc.hasOwnProperty('id')) {
                  let inventoryAcc = item.inventoryAcc
                  this.jRaw.push({
                    id: inventoryAcc.id + '-' + nature,
                    line: new ComponentUsedModel(value),
                    description: this.production.transactionNote,
                    account: item.inventoryAcc,
                    accountId: item.inventoryAcc.id,
                    amount: amt, // qty*avg_cost ,
                    exchangeAmount: itemXAmount,//xAmount,
                    type: nature,
                    typeAs: 'item'
                  })
                }
              }
            } else if (item.type === 'Fixed Asset') {
              if (item.hasOwnProperty('assetAcc')) {
                if (item.assetAcc.hasOwnProperty('id')) {
                  let assetAcc = item.assetAcc
                  this.jRaw.push({
                    id: assetAcc.id + '-' + nature,
                    line: new ComponentUsedModel(value),
                    description: this.production.transactionNote,
                    account: item.assetAcc,
                    accountId: item.assetAcc.id,
                    amount: amt, // qty*avg_cost ,
                    exchangeAmount: itemXAmount,//xAmount,
                    type: nature,
                    typeAs: 'item'
                  })
                }
              }

            } else if (item.type === 'Transaction Item') {
              if (item.hasOwnProperty('account')) {
                if (item.account.hasOwnProperty('id')) {
                  this.jRaw.push({
                    id: item.account.id + '-' + nature,
                    line: new ComponentUsedModel(value),
                    description: this.production.transactionNote,
                    account: item.account,
                    accountId: item.account.id,
                    amount: amt, // qty*avg_cost ,
                    exchangeAmount: itemXAmount,//xAmount,
                    type: nature,
                    typeAs: 'item'
                  })
                }
              }
            }
          }
        })
        rowOthers.forEach(value => {
          const amt = kendo.parseFloat(value.amount)
          const itemXAmount = amt * kendo.parseFloat(txnRate)
          const item = value.item
          if ((amt > 0)) {
            nature = 'dr'
          } else {
            nature = 'cr'
          }
          if (item) {
            if (item.type === 'Service') {
              if (item.hasOwnProperty('costOfGoodsSoldAcc')) {
                if (item.costOfGoodsSoldAcc.hasOwnProperty('id')) {
                  let costOfGoodsSoldAcc = item.costOfGoodsSoldAcc
                  this.jRaw.push({
                    id: costOfGoodsSoldAcc.id + '-' + nature,
                    line: new ComponentUsedModel(value),
                    description: this.production.transactionNote,
                    account: item.costOfGoodsSoldAcc,
                    accountId: item.costOfGoodsSoldAcc.id,
                    amount: amt, // qty*avg_cost ,
                    exchangeAmount: itemXAmount,//xAmount,
                    type: nature,
                    typeAs: 'item'
                  })
                }

              }
              if (item.hasOwnProperty('deferredIncomeAcc')) {
                if (item.deferredIncomeAcc.hasOwnProperty('id')) {
                  let deferredInAcc = item.deferredIncomeAcc
                  this.jRaw.push({
                    id: deferredInAcc.id + '-' + nature,
                    line: new ComponentUsedModel(value),
                    description: this.production.transactionNote,
                    account: deferredInAcc,
                    accountId: deferredInAcc.id,
                    amount: amt, // qty*avg_cost ,
                    exchangeAmount: itemXAmount,//,
                    type: nature,
                    typeAs: 'item'
                  })
                }
              }
            } else if (item.type === 'Variant') {
              if (item.hasOwnProperty('inventoryAcc')) {
                if (item.inventoryAcc.hasOwnProperty('id')) {
                  let inventoryAcc = item.inventoryAcc
                  this.jRaw.push({
                    id: inventoryAcc.id + '-' + nature,
                    line: new ComponentUsedModel(value),
                    description: this.production.transactionNote,
                    account: item.inventoryAcc,
                    accountId: item.inventoryAcc.id,
                    amount: amt, // qty*avg_cost ,
                    exchangeAmount: itemXAmount,//xAmount,
                    type: nature,
                    typeAs: 'item'
                  })
                }
              }
            } else if (item.type === 'Fixed Asset') {
              if (item.hasOwnProperty('assetAcc')) {
                if (item.assetAcc.hasOwnProperty('id')) {
                  let assetAcc = item.assetAcc
                  this.jRaw.push({
                    id: assetAcc.id + '-' + nature,
                    line: new ComponentUsedModel(value),
                    description: this.production.transactionNote,
                    account: item.assetAcc,
                    accountId: item.assetAcc.id,
                    amount: amt, // qty*avg_cost ,
                    exchangeAmount: itemXAmount,//xAmount,
                    type: nature,
                    typeAs: 'item'
                  })
                }
              }

            } else if (item.type === 'Transaction Item') {
              if (item.hasOwnProperty('account')) {
                if (item.account.hasOwnProperty('id')) {
                  this.jRaw.push({
                    id: item.account.id + '-' + nature,
                    line: new ComponentUsedModel(value),
                    description: this.production.transactionNote,
                    account: item.account,
                    accountId: item.account.id,
                    amount: amt, // qty*avg_cost ,
                    exchangeAmount: itemXAmount,//xAmount,
                    type: nature,
                    typeAs: 'item'
                  })
                }
              }
            }
          }
        })
        // todo: Working Progress Acc
        // todo: raw Journal
        if (this.production.wipAmount * -1 > 0) {
          nature = 'dr'
        } else {
          nature = 'cr'
        }
        // window.console.log(this.accWPI, 'accWPI')
        if (productionOrder.hasOwnProperty('account')) {
          const account = productionOrder.account || {}
          if (account.hasOwnProperty('id')) {
            this.jRaw.push({
              id: account.id + '-' + nature,
              line: new ComponentUsedModel({}),
              description: this.production.transactionNote,
              account: account,
              accountId: account.id,
              exchangeAmount: this.production.wipAmount * -1,
              amount: this.production.wipAmount * -1,
              type: nature,
              typeAs: 'wip'
            })
          }
        }
        this.shrinkData(this.jRaw)
      } catch (e) {
        window.console.log(e, 'error')
      }
    },
    shrinkData(obj) {
      const uniques = this.removeDuplicate(obj)
      uniques.forEach(n => {
        const found = obj.filter(m => m.id === n.id)
        let amount = 0, exchangeAmount = 0
        found.forEach(z => {
          amount += parseFloat(z.amount || 0)
          exchangeAmount += parseFloat(z.exchangeAmount || 0)
        })
        n.amount = parseFloat(amount) //this.numberFormat(amount)
        n.exchangeAmount = parseFloat(exchangeAmount)
      })
      this.jRaw = uniques
      let dr = 0, cr = 0
      this.jRaw.forEach(j => {
        switch (j.type) {
          case 'cr':
            cr += parseFloat(j.amount)
            break
          case 'dr':
            dr += parseFloat(j.amount)
            break
          default:
            break
        }
      })
      this.dr = dr
      this.cr = cr
      window.console.log('dr=', dr, 'cr=', cr, 'dr+cr = ', dr + cr)
      window.console.log(JSON.stringify(uniques), 'uniques')

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
    taxTemplate(dataItem) {
      window.console.log('vat', dataItem.tax)
      const vat = dataItem.tax
      if (vat) {
        return `<span>${vat.defaultTax ? vat.defaultTax : ``}</span>`
      } else {
        return ``
      }
    },
    TaxDropDownEditor(container, options) {
      kendo.jQuery('<input name="' + options.field + '"/>')
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
              data: this.vatTax
            })
          })
    },
    rowNumberOC(dataItem) {
      let ds = this.$refs.otherCostDS.kendoWidget(),
          index = ds.indexOf(dataItem);
      return index + 1;
    },
    rowNumberFP(dataItem) {
      let ds = this.$refs.finishProductDS.kendoWidget(),
          index = ds.indexOf(dataItem);
      return index + 1;
    },
    UOMTemplate(dataItem) {
      const uom = dataItem.buom
      if (uom) {
        return `<span>${uom.name ? uom.name : ``}</span>`
      } else {
        return ``
      }
    },
    rowNumberOP(dataItem) {
      let ds = this.$refs.otherProductDS.kendoWidget(),
          index = ds.indexOf(dataItem);
      return index + 1;
    },
    UOMTemplateOP(dataItem) {
      const uom = dataItem.uom
      if (uom) {
        return `<span>${uom.uom ? uom.uom.toUOM.name : ``}</span>`
      } else {
        return ``
      }
    },
    UOMTemplateCU(dataItem) {
      const uom = dataItem.uom
      if (uom) {
        return `<span>${uom.uom ? uom.uom.toUOM.name : ``}</span>`
      } else {
        return ``
      }
    },
    rowNumberCU(dataItem) {
      let ds = this.$refs.componentUsedDS.kendoWidget(),
          index = ds.indexOf(dataItem);
      return index + 1;
    },
    async loadProjects() {
      await projectHandler.list().then(res => {
        this.projects = res.data.data
      })
    },
    async loadSegment() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          this.segments = []
          settingsHandler.getSeg().then(res => {
            this.showLoading = true
            if (res.data.statusCode === 200) {
              this.showLoading = false
              this.segments = res.data.data
            }
          }).catch()
          {
            this.showLoading = false
          }
        }, 10)
      })
    },
    async loadLocation() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          this.locations = []
          locationHandler.list().then(res => {
            this.showLoading = true
            if (res.data.statusCode === 200) {
              this.showLoading = false
              this.locations = res.data.data
            }
          }).catch()
          {
            this.showLoading = false
          }
        }, 10)
      })
    },
    savePrint() {

    },
    saveNew() {
      try {
        this.production.status = 3
        this.production.actionType = 'new'
        this.production.jRaw = this.jRaw
        this.production.type = 'Production'
        this.production.completedAt = this.completedAt
        this.showLoading = true
        this.production.moment = 1
        window.console.log(this.production, 'this.production')
        this.showLoading = true
        productionHandler.create(this.production)
        this.showLoading = false
      } catch (e) {
        this.showLoading = false
        window.console.log(e, 'error')
      }

    },
    saveClose() {

    },
    removeRow() {
    },
    generateNumber() {

    },
    errorMessage() {

    },
    addRow() {
    },
    accountDropDownEditor() {
    },
    cancel() {
      window.history.go(-1);
      return false
    },
    hideSmallSideBar() {
      this.isHideBar = !this.isHideBar;
    }
  },
  watch: {
    // call again the method if the route changes

  },
  activated() {
    this.initData()
  },
  deactivated() {
    this.jRaw = []
    this.production = {}
  },
  created() {
    this.loadProjects()
    this.loadLocation()
    this.loadSegment()
  },
  async mounted() {
    await this.initData()

  },
};
</script>

<style scoped>
.small_sidebar {
  height: 97%;
  position: relative;
  padding: 12px;
}

.hide_small_bar_class {
  max-width: 0;
  transition: .5s ease-in;
  flex: 0 0 0;
  padding: 0;
}

.hide_big_bar_class {
  max-width: 100%;
  transition: .5s ease-in;
  flex: 0 0 100%;
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

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: transparent !important;
}

.detial_smallside_p {
  position: absolute;
  bottom: 10px;
}

</style>
