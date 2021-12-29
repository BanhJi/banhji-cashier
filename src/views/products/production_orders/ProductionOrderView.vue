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
                    <h2 class="mb-0">
                      {{ $t('production_order') + ` (#${productionOrder.abbr + '-' + productionOrder.number})` }}</h2>
                    <v-icon v-if="isHideBar"
                            onclick="window.history.go(-1); return false;"
                            style="cursor: pointer; color: #333; font-size: 40px;"
                            class="float-right"
                    >close
                    </v-icon>
                    <span style="transition: .3s ease-in; z-index:10;"
                          :class="{'iconArrow': !isHideBar,'iconArrowHide': isHideBar }">
                                            <v-icon size="22"
                                                    class="arr_icon"
                                                    @click="hideSmallSideBar"
                                                    v-if="isHideBar"> fa fa-chevron-circle-left
                                            </v-icon>
                                            <v-icon size="22"
                                                    class="arr_icon"
                                                    @click="hideSmallSideBar"
                                                    v-if="!isHideBar"> fa fa-chevron-circle-right
                                            </v-icon>
										</span>
                  </v-card>
                  <v-card outlined dense class="px-3 no_border" color="grayBg">
                    <v-row>
                      <v-col sm="4" class="pr-1">
                        <label class="label  mb-0">{{ $t('finished_product_variance') }}</label>
                        <h3 class="text-bold  py-1">{{
                            productionOrder.product ? productionOrder.product.name : ''
                          }}</h3>
                      </v-col>
                      <v-col sm="2" class="px-1">
                        <label class="label  mb-0">{{ $t('produce_qty') }}</label>
                        <h3 class="text-bold  py-1">{{ productionOrder.qty }}</h3>
                      </v-col>
                      <v-col sm="2" class="px-1">
                        <label class="label  mb-0">{{ $t('yield_uom') }}</label>
                        <h3 class="text-bold  py-1">{{ uom }}</h3>
                      </v-col>
                      <v-col sm="2" class="pl-1">
                        <label class="label  mb-0">{{ $t('due_date') }}</label>
                        <h3 class="text-bold  py-1">{{
                            productionOrder.dueDate ? new Date(productionOrder.dueDate).toISOString().substr(0, 10) : ''
                          }}</h3>
                      </v-col>
                    </v-row>
                  </v-card>

                  <v-row style="background-color: #fff;">
                    <v-col cols="12" class="py-1 pb-0">
                      <h2 class="primary--text mb-0 font_20">
                        {{ $t('other_finished_by_product') }}</h2>
                    </v-col>
                    <v-col sm="12" cols="12">
                      <kendo-datasource ref="otherProductDS"
                                        :data="otherFinishProducts"
                      />
                      <kendo-grid id="gridOtherProduct" class="grid-function"
                                  :data-source-ref="'otherProductDS'"
                                  :sortable="false"
                                  :filterable="false"
                                  :column-menu="true"
                                  :editable="false"
                                  :scrollable-virtual="true"
                      >
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
                                           :width="150"
                                           :template="'<span>#=kendo.toString(yieldQty || 0, (decimalFormat || `n2`)) || 0#</span>'"
                                           :headerAttributes="{
                                                            style: 'text-align: right; background-color: #EDF1F5'
                                                        }"
                                           :attributes="{
                                                            style: 'text-align: right'
                                                        }"/>
                        <kendo-grid-column :field="'cost'"
                                           :title="$t('cost')"
                                           :width="150"
                                           :template="'<span>#=kendo.toString(cost || 0, (decimalFormat || `n2`)) || 0#</span>'"
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
                                           :template="'<span>#=kendo.toString(amount || 0, (decimalFormat || `n2`)) || 0#</span>'"
                                           :headerAttributes="{
                                                            style: 'text-align: right; background-color: #EDF1F5'
                                                        }"
                                           :attributes="{
                                                            style: 'text-align: right'
                                                        }"/>
                      </kendo-grid>

                    </v-col>
                  </v-row>
                  <v-row style="background-color: #fff;">
                    <v-col cols="12" class="py-1 pb-0">
                      <h2 class="greyText--text mb-0 font_20">
                        {{ $t('components_used_for_productions') }}</h2>
                    </v-col>
                    <v-col sm="12" cols="12">
                      <kendo-datasource ref="componentUsedDS"
                                        :data="componentUseds"
                      />
                      <kendo-grid id="gridComponentUsed" class="grid-function"
                                  :data-source-ref="'componentUsedDS'"
                                  :sortable="false"
                                  :filterable="false"
                                  :column-menu="true"
                                  :editable="false"
                                  :scrollable-virtual="true"
                      >
                        <kendo-grid-column
                            :title="$t('no.')"
                            :template="rowNumberCU"
                            :width="55"
                            :column-menu="false"
                            :headerAttributes="{style: 'background-color: #EDF1F5;',class: 'text-variants',}"
                            :attributes="{style: 'text-align: variants',}"
                        />
                        <kendo-grid-column
                            :field="'item'"
                            :title="$t('items')"
                            :width="200"
                            :template="'<span>#=item.name#</span>'"
                            :headerAttributes="{style: 'background-color: #EDF1F5',}"
                        />
                        <kendo-grid-column
                            :field="'description'"
                            :title="$t('description')"
                            :width="200"
                            :headerAttributes="{
                                                            style: 'background-color: #EDF1F5'
                                                        }"/>
                        <kendo-grid-column
                            :template="UOMTemplate"
                            :field="'buom'"
                            :title="$t('base_uom')"
                            :width="160"
                            :editable="()=>{ return false}"
                            :headerAttributes="{
                                                            style: 'background-color: #EDF1F5'
                                                        }"/>
                        <kendo-grid-column
                            :field="'qty'"
                            :title="$t('qty')"
                            :width="150"
                            :template="'<span>#=kendo.toString(qty || 0, (decimalFormat || `n2`)) || 0#</span>'"
                            :headerAttributes="{
                                                                style: 'text-align: right; background-color: #EDF1F5'
                                                            }"
                            :attributes="{
                                                                style: 'text-align: right'
                                                            }"/>
                        <kendo-grid-column
                            :field="'cost'"
                            :title="$t('cost')"
                            :width="150"
                            :template="'<span>#=kendo.toString(cost || 0, (decimalFormat || `n2`)) || 0#</span>'"
                            :headerAttributes="{
                                                                style: 'text-align: right; background-color: #EDF1F5'
                                                            }"
                            :attributes="{
                                                                style: 'text-align: right'
                                                            }"/>
                        <kendo-grid-column
                            :field="'amount'"
                            :title="$t('amount')"
                            :width="150"
                            :editable="()=>{ return false}"
                            :template="'<span>#=kendo.toString(amount || 0, (decimalFormat || `n2`)) || 0#</span>'"
                            :headerAttributes="{
                                                            style: 'text-align: right; background-color: #EDF1F5'
                                                        }"
                            :attributes="{
                                                            style: 'text-align: right'
                                                        }"/>
                      </kendo-grid>
                    </v-col>
                  </v-row>
                  <!--                  <v-row style="background-color: #fff;">-->
                  <!--                    <v-col cols="12" class="py-1 pb-0">-->
                  <!--                      <h2 class="greyText&#45;&#45;text mb-0 font_20">{{ $t('other_cost') }}</h2>-->
                  <!--                    </v-col>-->
                  <!--                    <v-col sm="12" cols="12">-->
                  <!--                      <kendo-datasource ref="otherCostDS"-->
                  <!--                                        :data="otherCosts"-->
                  <!--                      />-->
                  <!--                      <kendo-grid id="gridOtherCost" class="grid-function"-->
                  <!--                                  :data-source-ref="'otherCostDS'"-->
                  <!--                                  :sortable="false"-->
                  <!--                                  :filterable="false"-->
                  <!--                                  :column-menu="true"-->
                  <!--                                  :editable="false"-->
                  <!--                                  :scrollable-virtual="true"-->
                  <!--                      >-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :template="roNumberOC"-->
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
                  <!--                            :field="'account'"-->
                  <!--                            :title="$t('account')"-->
                  <!--                            :width="200"-->
                  <!--                            :template="'<span>#=account.name#</span>'"-->
                  <!--                            :editor="accountDropDownEditor"-->
                  <!--                            :headerAttributes="{-->
                  <!--                                                        style: 'background-color: #EDF1F5'-->
                  <!--                                                    }"/>-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :field="'description'"-->
                  <!--                            :title="$t('description')"-->
                  <!--                            :width="200"-->
                  <!--                            :headerAttributes="{-->
                  <!--                                                        style: 'background-color: #EDF1F5'-->
                  <!--                                                    }"/>-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :field="'amount'"-->
                  <!--                            :title="$t('amount')"-->
                  <!--                            :width="160"-->
                  <!--                            :headerAttributes="{-->
                  <!--                                                        style: 'background-color: #EDF1F5'-->
                  <!--                                                    }"/>-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :field="'tax'"-->
                  <!--                            :editor="TaxDropDownEditor"-->
                  <!--                            :template="taxTemplate"-->
                  <!--                            :title="$t('tax')"-->
                  <!--                            :format="'{0:n}'"-->
                  <!--                            :width="150"-->
                  <!--                            :headerAttributes="{-->
                  <!--                                                            style: 'text-align: right; background-color: #EDF1F5'-->
                  <!--                                                        }"-->
                  <!--                            :attributes="{-->
                  <!--                                                            style: 'text-align: right'-->
                  <!--                                                        }"/>-->
                  <!--                      </kendo-grid>-->
                  <!--                    </v-col>-->
                  <!--                  </v-row>-->
                  <v-row style="background-color: #fff;">
                    <v-col sm="12" cols="12" class="py-0">
                      <v-row>
                        <v-col sm="6" cols="6">
                          <v-textarea class="mt-1"
                                      outlined
                                      clearable
                                      v-model="productionOrder.transactionNote"
                                      tag="Memo"
                                      height="90px"
                                      rows="3"
                                      no-resize
                                      placeholder="Memo"
                          />
                        </v-col>
                        <v-col sm="6" cols="6">
                          <v-simple-table>
                            <template v-slot:default>
                              <tbody>
                              <tr>
                                <td class="text-left text-uppercase">
                                  {{ $t('total_cost') }}
                                </td>
                                <td class="text-center">:</td>
                                <td class="text-right">{{
                                    productionOrder.exchangeAmount
                                  }}
                                </td>
                              </tr>
                              <tr>
                                <td class="text-left text-uppercase">
                                  {{ $t('cost_per_unit') }}
                                </td>
                                <td class="text-center">:</td>
                                <td class="text-right">{{
                                    productionOrder.variance
                                  }}
                                </td>
                              </tr>
                              <tr>
                                <td class="text-left text-uppercase">
                                  {{ $t('dr') }}
                                </td>
                                <td class="text-center">:</td>
                                <td class="text-right">{{
                                    dr
                                  }}
                                </td>
                              </tr>
                              <tr>
                                <td class="text-left text-uppercase">
                                  {{ $t('cr') }}
                                </td>
                                <td class="text-center">:</td>
                                <td class="text-right">{{
                                    cr
                                  }}
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
                  <v-divider/>
                  <v-card outlined dense class="no_border function_footer py-2">
                    <p class="float-left py-2 mb-0  color_grey">
                      {{ $t('standard_commercial_invoice') }}</p>
                    <v-btn class="float-right save_option mx-1">
                      {{ $t('print') }}
                    </v-btn>
                    <v-btn class="float-right white--text mx-1" color="primary">
                      {{ $t('delete') }}
                    </v-btn>
                    <v-btn class="float-right white--text  mx-1" color="primary">
                      {{ $t('edit') }}
                    </v-btn>
                  </v-card>
                  <v-divider/>
                </v-form>
              </v-col>
              <v-col class="smallSide" sm="4" style="transition: .3s ease-in;"
                     :class="{'hide_small_bar_class':isHideBar}">
                <h3 style="color: #b3b5bc; font-size:20px;" v-if="!isHideBar"
                    class="text-uppercase float-right mt-n3">Help
                  <v-icon
                      onclick="window.history.go(-1); return false;"
                      style="cursor: pointer; color: #333; font-size: 40px;"
                      class="float-right mt-n1"
                  >close
                  </v-icon>
                </h3>

                <div v-if="!isHideBar" class="small_sidebar mt-9 px-4 grayBg">
                  <h4 class="my-2 text-uppercase">{{ $t('analysis') }}</h4>
                  <v-row>
                    <v-col sm="6" cols="6" class="py-1">
                      <label class="label">{{ $t('warehouse') }}</label>
                      <h4 class="text-bold py-1">{{ warehouse }}</h4>

                      <label class="label">{{ $t('segment') }}</label>
                      <h4 class="text-bold py-1">{{ productionOrder.segment ? productionOrder.segment.name : '' }}</h4>
                      <label class="label">{{ $t('location') }}</label>
                      <h4 class="text-bold py-1">{{
                          productionOrder.location ? productionOrder.location.name : ''
                        }}</h4>
                      <!--                                            <label class="label">{{ $t('sale_channel') }}</label>-->
                      <!--                                            <h4 class="text-bold py-1">{{ productionOrder.saleChannel.name }}</h4>-->
                    </v-col>
                    <v-col sm="6" cols="6" class="py-1">
                      <label class="label">{{ $t('project') }}</label>
                      <h4 class="text-bold py-1">{{ productionOrder.project ? productionOrder.project.name : '' }}</h4>
                      <!--                                            <label class="label">{{ $t('month_Of') }}</label>-->
                      <!--                                            <h4 class="text-bold py-1">{{ new Date(productionOrder.monthOf).toISOString().substr(0, 7) }}</h4>-->
                    </v-col>
                  </v-row>
                  <div class="my-3" style="height:3px; background-color:#ffffff;width:100%;"></div>
                  <h4 class="my-2 text-uppercase">{{ $t('added_transaction') }}</h4>
                  <h4 class="my-2 text-capitalize">{{ $t('bill_of_material') }}</h4>
                  <h4 class="color_grey">
                    {{ bomReferenceNo }}</h4>
                  <div class="my-3" style="height:3px; background-color:#ffffff;width:100%;"></div>
                  <v-btn @click="onStartProduction"
                         :disabled="disabledMe"
                         class="text-capitalize rounded-0 white--text"
                         width="100%"
                         color="primary">
                    {{ $t('start_production') }}
                  </v-btn>
                  <v-dialog v-model="dialogM" max-width="600px" eager>
                    <v-card>
                      <v-card-title>{{ $t('start_production') }}</v-card-title>
                      <v-icon class="btn_close" @click="dialogM = false">close</v-icon>
                      <v-divider/>
                      <v-card-text style="height: 240px; background-color: #EDF1F5; color: #333;">
                        <v-row class="pt-4">
                          <v-col sm="6" cols="12" class="py-0">
                            <label class="mb-0">{{ $t('start_date') }}</label>
                            <app-datepicker :initialDate="productionOrder.startedAt"
                                            @emitDate="productionOrder.startedAt = $event"/>
                          </v-col>
                          <v-col sm="6" cols="12" class="py-0">
                            <label class="mb-0">{{ $t('working_progress_account') }}</label>
                            <v-select class="mt-1"
                                      :items="accWPIs"
                                      item-text="name"
                                      item-value="id"
                                      @change="rawJournal"
                                      return-object
                                      v-model="accWPI"
                                      outlined/>
                          </v-col>
                          <!--                          <v-col sm="6" cols="12" class="py-0">-->
                          <!--                            <label class="label mb-0 mt-1">{{ $t('production_no') }}</label>-->
                          <!--                            <v-row class="mt-1 mr-0">-->
                          <!--                              <v-col sm="3" cols="3" class="py-0 pr-0">-->
                          <!--                                <div class="code_text text-uppercase"> {{ production.abbr }}</div>-->
                          <!--                              </v-col>-->
                          <!--                              <v-col sm="7" cols="7" class="pt-0 pl-0 pr-1">-->
                          <!--                                <v-text-field-->
                          <!--                                    disabled-->
                          <!--                                    class="custom-border"-->
                          <!--                                    v-model="production.number"-->
                          <!--                                    tage="Product Order Number"-->
                          <!--                                    outlined-->
                          <!--                                    :rules="[(v) => !!v || 'Number is required']"-->
                          <!--                                    required-->
                          <!--                                />-->
                          <!--                              </v-col>-->
                          <!--                              <v-col sm="2" cols="2" class="pt-0 px-0">-->
                          <!--                                <v-icon-->
                          <!--                                    color="black"-->
                          <!--                                    size="30"-->
                          <!--                                    class="border_qrcode"-->
                          <!--                                    @click="generateNumber"-->
                          <!--                                >mdi-qrcode-->
                          <!--                                </v-icon>-->
                          <!--                              </v-col>-->
                          <!--                            </v-row>-->

                          <!--                          </v-col>-->
                          <!--                          <v-col sm="6" cols="6" class="py-0">-->
                          <!--                            <label class="mb-0">{{ $t('memo') }}</label>-->
                          <!--                            <v-textarea class="mt-1"-->
                          <!--                                        outlined-->
                          <!--                                        clearable-->
                          <!--                                        no-resize-->
                          <!--                                        v-model="production.transactionNote"-->
                          <!--                                        tag="Memo"-->
                          <!--                                        height="90px"-->
                          <!--                                        rows="2"-->
                          <!--                                        placeholder="Memo">-->
                          <!--                            </v-textarea>-->

                          <!--                          </v-col>-->

                        </v-row>
                      </v-card-text>
                      <v-divider/>
                      <v-card-actions class="function_footer">
                        <v-btn class="btn_cancel float-left ml-4 mb-2" @click="dialogM = false">
                          {{ $t('cancel') }}
                        </v-btn>
                        <v-btn @click="saveClose" class="btn_save_close float-right mr-4 mb-2">
                          {{ $t('save_close') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <div class="my-3" style="height:3px; background-color:#ffffff;width:100%;"></div>
                  <v-row>
                    <v-col cols="12" class="py-0">
                      <h4 class="my-2 text-uppercase">{{ $t('production') }}</h4>
                      <v-row>
                        <v-col sm="6" cols="12" class="py-0">
                          <h4 class="my-2 text-capitalize">{{ $t('start_date_time') }}</h4>
                        </v-col>
                        <v-col sm="6" cols="12" class="py-0">
                          <h4 class="my-2">PO0720-001</h4>
                        </v-col>
                      </v-row>
                      <v-card class=" text-bold rounded-0  no-boxshadow" color="primary">
                        <p class="text-center pa-2 color_white mb-1">
                          {{ $t('complete_production') }}</p>
                      </v-card>
                    </v-col>
                  </v-row>


                  <p class="mb-0 detial_smallside_p">{{ $t('prouduct_funct_order_desc') }}</p>
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
import Production from "@/scripts/model/Production";
import kendo from "@progress/kendo-ui";
import ProductionOrder from "@/scripts/model/ProductionOrder";
import ComponentUsedModel from "@/scripts/start_production/model/ComponentUsed";

const productionOrderHandler = require("@/scripts/productionOrderHandler")
const productionHandler = require("@/scripts/productionHandler")
const accountHandler = require("@/scripts/handler/accounting/accountHandler")
const prefixHandler = require("@/scripts/prefixHandler")
const billingHandler = require("@/scripts/invoice/handler/billingHandler")
const production = new Production({})

export default {
  name: "ProductionOrderView",
  components: {
    LoadingMe: () => import(`@/components/Loading`),
    'app-datepicker': DatePickerComponent,
  },
  data: () => ({
    isEdit: false,
    showLoading: false,
    alert: false,
    valid: true,
    isHideBar: false,
    production: production,
    productionOrder: new ProductionOrder({}),
    otherFinishProducts: [],
    componentUseds: [],
    otherCosts: [],
    transactionTypes: [],
    dialogM: false,
    uom: '',
    accWPIs: [],
    accWPI: {},
    decimalFormat: 'n2',
    jRaw: [],
    loggedUser: {
      id: 'cf3d10ab-bce6-47b3-8405-b448c23dad84',
      name: 'Mr. Inspector'
    },
    dr: 0,
    cr: 0,
  }),
  computed: {
    bomReferenceNo() {
      if (this.productionOrder) {
        const bom = this.productionOrder.bom || {}
        if (bom) {
          return bom.referenceNo || ''
        }
      }
      return ''
    },
    disabledMe() {
      if (this.productionOrder) {
        return this.productionOrder.status === 2;
      }
      return false
    },
    id() {
      if (this.$route.params.id !== '') {
        return this.$route.params.id
      } else {
        return ''
      }
    },
    warehouse() {
      if (this.productionOrder) {
        if (this.productionOrder.hasOwnProperty('warehouse')) {
          if (this.productionOrder.warehouse.hasOwnProperty('id')) {
            return this.productionOrder.warehouse.name
          }
        }
      }
      return ''
    },
  },
  methods: {
    rawJournal() {
      try {
        let nature = ''
        this.jRaw = []
        const data = this.productionOrder.componentUsed || []
        const rows = data.filter(m => parseFloat(m.amount) > 0)
        const bom = this.productionOrder.bom
        const currency = bom.currency || {}
        const xRate = bom.exchangeRate || {}
        const txnRate = xRate.rate || 1
        this.productionOrder.txnRate = txnRate
        this.productionOrder.exchangeRate = xRate
        this.productionOrder.currency = currency
        rows.forEach(value => {
          const amt = kendo.parseFloat(value.amount) * -1
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
                    description: this.productionOrder.transactionNote,
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
                    description: this.productionOrder.transactionNote,
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
                    description: this.productionOrder.transactionNote,
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
                    description: this.productionOrder.transactionNote,
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
                    description: this.productionOrder.transactionNote,
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
        if (this.productionOrder.amount > 0) {
          nature = 'dr'
        } else {
          nature = 'cr'
        }
        // window.console.log(this.accWPI, 'accWPI')
        if (this.accWPI) {
          if (this.accWPI.hasOwnProperty('id')) {
            this.jRaw.push({
              id: this.accWPI.id + '-' + nature,
              line: new ComponentUsedModel({}),
              description: this.productionOrder.transactionNote,
              account: this.accWPI,
              accountId: this.accWPI.id,
              exchangeAmount: this.productionOrder.amount,
              amount: this.productionOrder.amount,
              type: nature,
              typeAs: 'wpa'
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
    async onStartProduction() {
      await this.generateNumber()
      this.showLoading = true
      this.productionOrder.startedAt = new Date().toISOString().substr(0, 10)
      this.dialogM = true
      this.showLoading = false
    },
    taxTemplate(dataItem) {
      // window.console.log('vat', dataItem.tax)
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
    roNumberOC(dataItem) {
      let ds = this.$refs.otherCostDS.kendoWidget(),
          index = ds.indexOf(dataItem);
      return index + 1;
    },
    rowNumberOP(dataItem) {
      let ds = this.$refs.otherProductDS.kendoWidget(),
          index = ds.indexOf(dataItem);
      return index + 1;
    },
    itemTemplate(dataItem) {
      const item = dataItem.item
      if (item) {
        return `<span>${item.name ? item.name : ``}</span>`
      } else {
        return ``
      }
    },
    UOMTemplate(dataItem) {
      const uom = dataItem.buom
      if (uom) {
        return `<span>${uom.name ? uom.name : ``}</span>`
      } else {
        return ``
      }
    },
    UOMTemplateOP(dataItem) {
      const uom = dataItem.uom
      if (uom) {
        return `<span>${uom.uom ? uom.name : ``}</span>`
      } else {
        return ``
      }
    },
    UOMTemplateCU(dataItem) {
      const uom = dataItem.uom
      if (uom) {
        return `<span>${uom.uom ? uom.name : ``}</span>`
      } else {
        return ``
      }
    },
    rowNumberCU(dataItem) {
      let ds = this.$refs.componentUsedDS.kendoWidget(),
          index = ds.indexOf(dataItem);
      return index + 1;
    },
    async loadAccount() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          accountHandler.getAll().then(res => {
            this.showLoading = false
            this.accWPIs = res.filter(m => m.account_type.name === 'Inventory').map(item => {
              return {
                id: item.uuid,
                uuid: item.uuid,
                name: item.name,
                local_name: item.local_name,
                number: item.number,
                is_taxable: item.is_taxable,
                banhjiAccCode: item.banhjiAccCode,
                group_code: item.group_code,
                parent_account: item.parent_account,
                type_code: item.type_code,
                account_type: item.account_type
              }
            })
            if (this.accWPIs.length > 0) {
              this.accWPI = this.accWPIs[0]
            }
          })
        }, 10);
      })
    },
    async initData() {
      const po = this.$route.params.productionOrder
      const id = this.$route.params.id
      if (id !== '' && po === undefined) {
        await productionOrderHandler.getById(id).then(res => {
          this.productionOrder = res
          this.otherFinishProducts = this.productionOrder ? this.productionOrder.otherFinishProduct : []
          this.componentUseds = this.productionOrder ? this.productionOrder.componentUsed : []
          this.otherCosts = this.productionOrder ? this.productionOrder.otherCost : []
          if (this.productionOrder.yieldUOM) {
            this.uom = this.productionOrder.yieldUOM.name || ''
          }

          // window.console.log(res, this.otherCosts, this.otherFinishProducts, this.componentUseds, 'load po')
        })
      } else if (po !== undefined) {
        this.productionOrder = po
        this.otherFinishProducts = this.productionOrder ? this.productionOrder.otherFinishProduct : []
        this.componentUseds = this.productionOrder ? this.productionOrder.componentUsed : []
        this.otherCosts = this.productionOrder ? this.productionOrder.otherCost : []
        if (this.productionOrder.yieldUOM) {
          this.uom = this.productionOrder.yieldUOM.name || ''
        }
        // window.console.log(this.productionOrder, this.otherCosts, this.otherFinishProducts, this.componentUseds, 'data po')
      } else {
        this.clear()
      }
    },
    savePrint() {

    },
    saveNew() {

    },
    clear() {
      this.productionOrder = {}
      this.production = production
      this.otherFinishProducts = []
      this.componentUseds = []
      this.uom = ''
      this.otherCosts = []
    },
    async loadPrefix() {
      new Promise(resolve => {
        setTimeout(async () => {
          resolve('resolved');
          await prefixHandler.get('production').then(async res => {
            if (res.data.statusCode === 200) {
              this.showLoading = false
              this.transactionTypes = res.data.data
              if (this.transactionTypes.length > 0) {
                this.production.transactionType = this.transactionTypes[0]
                // if (this.$route.params.id === undefined) {
                await this.generateNumber()
                // }
              }
            }

          })
        }, 10);
      })
    },
    async generateNumber() {

      let data = {
        abbr: this.production.transactionType.abbr,
        structure: this.production.transactionType.structure,
        transactionDate: this.production.transactionDate,
        sequcencing: this.production.transactionType.sequcencing,
        type: 'Production',
        entity: 2
      }
      this.production.abbr = data.abbr
      // window.console.log('data.abbr', data.abbr)
      this.production.structure = data.structure
      this.production.sequcencing = data.sequcencing
      this.production.transactionDate = data.transactionDate
      this.production.type = data.type
      await billingHandler.lastNumber(data).then(response => {
        if (response.data.statusCode === 200) {
          const res = response.data.data
          const lastNumber = this.zeroPad(parseInt(res.lastNumber), this.production.transactionType.format)
          this.production.number = res.suffix + this.production.transactionType.numberSeparator + lastNumber
          this.production.abbr = res.abbr
          this.production.lastNumber = res.suffix + lastNumber
          // window.console.log(this.production.number, 'production')
        }
      }).catch(e => {
        this.errors.push(e)
      })
    },
    zeroPad(num, places) {
      return String(num).padStart(places, '0')
    },
    async saveClose() {
      this.production.productionNo = ''//'PD-' + this.production.productionNo
      // this.production.accWPI = this.accWPI
      this.production.bom = this.productionOrder.bom
      this.production.productionOrder = this.productionOrder
      this.production.product = this.productionOrder.product
      this.production.qty = this.productionOrder.qty
      this.production.uom = this.productionOrder.yieldUOM
      this.production.amount = this.productionOrder.amount
      this.production.exchangeAmount = this.productionOrder.exchangeAmount
      this.production.variance = this.productionOrder.variance
      this.production.startedAt = this.productionOrder.startedAt
      this.production.status = 1
      // this.production.actionType = 'new'
      // this.production.jRaw = this.jRaw
      this.productionOrder.jRaw = this.jRaw
      this.productionOrder.status = 2

      this.productionOrder.type = 'Production Order'
      // this.productionOrder.startedAt = this.production.transactionDate
      this.productionOrder.actionType = 'new'
      this.productionOrder.account = this.accWPI
      //todo: create Raw production
      this.showLoading = true
      await productionHandler.create(this.production).then(res => {
        window.console.log(res)
      })
      //todo: update production order / inventory / Journal
      await productionOrderHandler.create(this.productionOrder).then(res => {
        window.console.log(res)
        this.dialogM = false
        this.initData()
      })
      this.showLoading = false
    },
    removeRow() {
    },
    errorMessage() {

    },
    addRow() {
    },
    accountDropDownEditor() {
    },
    cancel() {

    },
    numberFormat(value) {
      return kendo.toString(value, `n${this.decimalFormat}`)
    },
    hideSmallSideBar() {
      this.isHideBar = !this.isHideBar;
    }
  },
  watch: {
    'id': 'initData'
    // call again the method if the route changes

  },
  async created() {
    await this.loadPrefix()
    await this.loadAccount()
  },
  async mounted() {
    this.production.transactionDate = new Date().toISOString().substr(0, 10)
    await this.initData()
  },
};
</script>

<style scoped>
.function_wrapper {
  box-shadow: none !important;
}

.custom_grid table th:last-child {
  text-align: right !important;
}

.color_green {
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
  padding: 0;
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
  height: 97%;
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

.border_radius10 {
  border-radius: 10px !important;
  background-color: #F2F2F2;
}

</style>
