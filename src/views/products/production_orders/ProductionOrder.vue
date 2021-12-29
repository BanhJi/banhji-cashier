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
                    <h2 class="mb-0">{{ $t("production_order") }}</h2>
                    <v-icon
                        v-if="isHideBar"
                        onclick="window.history.go(-1); return false;"
                        style="cursor: pointer; color: #333; font-size: 40px;"
                        class="float-right"
                    >close
                    </v-icon>
                    <span style="transition: .3s ease-in; z-index:10;"
                          :class="{iconArrow: !isHideBar,iconArrowHide: isHideBar,}">
                                          <v-icon
                                              size="22"
                                              class="arr_icon"
                                              @click="hideSmallSidebar"
                                              v-if="isHideBar"
                                          >
                                            fa fa-chevron-circle-left
                                          </v-icon>
                                          <v-icon
                                              size="22"
                                              class="arr_icon"
                                              @click="hideSmallSidebar"
                                              v-if="!isHideBar"
                                          >
                                            fa fa-chevron-circle-right
                                          </v-icon>
                                        </span>
                  </v-card>
                  <v-card
                      outlined
                      dense
                      class="px-3 no_border"
                      color="grayBg"
                  >
                    <v-row>
                      <v-col sm="4" cols="12" class="pb-0">
                        <label class="label  mb-0">{{
                            $t("finished_product_variance")
                          }}</label>
                        <v-col sm="12" cols="12"
                               class="kendo_dropdown_custom pl-0 pb-3 pt-0">
                          <dropdownlist
                              :data-items="productList"
                              @change="onChange"
                              :value="productionOrder.product"
                              :data-item-key="dataItemKey"
                              :text-field="textField"
                              :default-item="defaultItem"
                              :filterable="true"
                              @filterchange="onFilterChange">
                          </dropdownlist>
                        </v-col>
                        <label class="label mb-0 mt-1" style="">{{ $t("bom") }}</label>
                        <v-select
                            class="mt-1"
                            :items="boms"
                            :disabled="boms.length <= 0"
                            :item-text="item => item.abbr + '-' + item.number "
                            v-model="productionOrder.bom"
                            item-value="id"
                            v-on:change="onChangeBom"
                            :placeholder="$t('bom')"
                            :rules="[(v) => !!v || 'BOM is required']"
                            return-object
                            clearable
                            tage="Bom"
                            outlined
                        />
                      </v-col>
                      <v-col sm="4" cols="12" class="pb-0">
                        <v-row>
                          <v-col sm="12" cols="12" class="pb-0">
                            <!--                                                        <label class="label mb-0">{{$t("qty") }}</label>-->
                            <v-text-field
                                :placeholder="$t('Produce Qty')"
                                v-model="productionOrder.qty"
                                type="number"
                                @change="onChangeQty"
                                min="1"
                                class="mt-1"
                                tage="Quantity to Produce"
                                outlined/>
                          </v-col>
                          <v-col class="pt-0">
                            <label class="label mb-0" style="">{{ $t("yield_uom") }}</label>
                            <h3>{{ uom }}</h3>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col sm="4" cols="12" class="pb-0">
                        <label class="label">{{ $t("due_date") }}</label>
                        <app-datepicker
                            :initialDate="productionOrder.dueDate"
                            @emitDate="productionOrder.dueDate = $event"
                        />
                        <label class="label mb-0 mt-1">{{
                            $t("product_order_num")
                          }}</label>
                        <v-row class="mt-1 mr-0">
                          <v-col sm="3" cols="3" class="py-0 pr-0">
                            <div class="code_text text-uppercase"> {{ productionOrder.abbr }}</div>
                          </v-col>
                          <v-col sm="7" cols="7" class="pt-0 pl-0 pr-1">
                            <v-text-field
                                disabled
                                class="custom-border"
                                v-model="productionOrder.number"
                                tage="Product Order Number"
                                outlined
                                :rules="[(v) => !!v || 'Number is required']"
                                required
                            />
                          </v-col>
                          <v-col sm="2" cols="2" class="pt-0 px-0">
                            <v-icon
                                color="black"
                                size="30"
                                class="border_qrcode"
                                @click="generateNumber"
                            >mdi-qrcode
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card>

                  <v-row style="background-color: #fff;">
                    <v-col cols="12" class="py-1 pb-0">
                      <h2 class="primary--text mb-0 font_20 text-uppercase">
                        {{ $t("other_finished_by_product") }}
                      </h2>
                    </v-col>
                    <v-col sm="12" cols="12">
                      <kendo-datasource
                          ref="otherProductDS"
                          :data="otherFinishProductData"
                      />
                      <kendo-grid
                          id="otherFinishProduct"
                          class="grid-function"
                          :data-source-ref="'otherProductDS'"
                          :sortable="false"
                          :filterable="false"
                          :column-menu="true"
                          :editable="false"
                          :scrollable-virtual="true"
                      >
                        <kendo-grid-column :template="rowNumberOP"
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
                      <h2 class="greyText--text mb-0 font_20 text-uppercase">
                        {{ $t("components_used_for_productions") }}
                      </h2>
                    </v-col>
                    <v-col sm="12" cols="12">
                      <kendo-datasource
                          ref="componentUseDS"
                          :data="componentUsedData"
                      />
                      <kendo-grid
                          id="componentUse"
                          class="grid-function"
                          :data-source-ref="'componentUseDS'"
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
                  <!--                      <h2 class="greyText&#45;&#45;text mb-0 font_20 text-uppercase">-->
                  <!--                        {{ $t("other_cost") }}-->
                  <!--                      </h2>-->
                  <!--                    </v-col>-->
                  <!--                    <v-col sm="12" cols="12">-->
                  <!--                      <kendo-datasource-->
                  <!--                          ref="otherCostDS"-->
                  <!--                          :data="bomSeleted.otherCost"-->
                  <!--                      />-->
                  <!--                      <kendo-grid-->
                  <!--                          id="otherCost"-->
                  <!--                          class="grid-function"-->
                  <!--                          :data-source-ref="'otherCostDS'"-->
                  <!--                          :sortable="false"-->
                  <!--                          :filterable="false"-->
                  <!--                          :column-menu="true"-->
                  <!--                          :editable="false"-->
                  <!--                          :scrollable-virtual="true"-->
                  <!--                      >-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :title="$t('no.')"-->
                  <!--                            :template="rowNumberOC"-->
                  <!--                            :width="55"-->
                  <!--                            :column-menu="false"-->
                  <!--                            :headerAttributes="{style: 'background-color: #EDF1F5;',class: 'text-variants',}"-->
                  <!--                            :attributes="{style: 'text-align: variants',}"-->
                  <!--                        />-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :field="'account'"-->
                  <!--                            :title="$t('account')"-->
                  <!--                            :width="200"-->
                  <!--                            :template="'<span>#=account.name#</span>'"-->
                  <!--                            :editor="accountDropDownEditor"-->
                  <!--                            :headerAttributes="{style: 'background-color: #EDF1F5',}"-->
                  <!--                        />-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :field="'description'"-->
                  <!--                            :title="$t('description')"-->
                  <!--                            :width="200"-->
                  <!--                            :headerAttributes="{style: 'background-color: #EDF1F5',}"-->
                  <!--                        />-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :field="'amount'"-->
                  <!--                            :title="$t('amount')"-->
                  <!--                            :width="160"-->
                  <!--                            :headerAttributes="{style: 'background-color: #EDF1F5',}"-->
                  <!--                        />-->
                  <!--                        <kendo-grid-column-->
                  <!--                            :field="'tax'"-->
                  <!--                            :title="$t('tax')"-->
                  <!--                            :format="'{0:n}'"-->
                  <!--                            :editor="TaxDropDownEditor"-->
                  <!--                            :template="taxTemplate"-->
                  <!--                            :width="150"-->
                  <!--                            :headerAttributes="{style:'text-align: right; background-color: #EDF1F5',}"-->
                  <!--                            :attributes="{style: 'text-align: right',}"-->
                  <!--                        />-->
                  <!--                      </kendo-grid>-->
                  <!--                    </v-col>-->
                  <!--                  </v-row>-->
                  <v-row style="background-color: #fff;">
                    <v-col sm="12" cols="12" class="py-0">
                      <v-row>
                        <v-col sm="6" cols="6" class="py-0">
                          <v-textarea
                              class="mt-1"
                              outlined
                              clearable
                              v-model="transactionNote"
                              tag="Memo"
                              height="90px"
                              rows="3"
                              placeholder="Memo"
                          />
                        </v-col>
                        <v-col sm="6" cols="6">
                          <v-simple-table>
                            <template v-slot:default>
                              <tbody>
                              <tr>
                                <td class="text-left text-uppercase">
                                  {{ $t("total_cost") }}
                                </td>
                                <td class="text-center">:</td>
                                <td class="text-right">{{ numberFormat(totalCost) }}</td>
                              </tr>
                              <tr>
                                <td class="text-left text-uppercase">
                                  {{ $t("variance") }}
                                </td>
                                <td class="text-center">:</td>
                                <td class="text-right">{{ numberFormat(variance) }}</td>
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
                    <!--                    <v-menu>-->
                    <!--                      <template v-slot:activator="{ on }">-->
                    <!--                        <v-btn-->
                    <!--                            color="black"-->
                    <!--                            outlined-->
                    <!--                            class="mr-2 text-capitalize rounded-pill black&#45;&#45;text float-left"-->
                    <!--                            v-on="on"-->
                    <!--                        >-->
                    <!--                          {{ $t("select_template") }}-->
                    <!--                          <v-icon size="" class="ma-1">expand_more</v-icon>-->
                    <!--                        </v-btn>-->
                    <!--                      </template>-->
                    <!--                      <v-list>-->
                    <!--                        <v-list-item-->
                    <!--                            v-for="(item, index) in templates"-->
                    <!--                            :key="index"-->
                    <!--                        >-->
                    <!--                          <v-list-item-title>{{-->
                    <!--                              item.title-->
                    <!--                            }}-->
                    <!--                          </v-list-item-title>-->
                    <!--                        </v-list-item>-->
                    <!--                      </v-list>-->
                    <!--                    </v-menu>-->
                    <v-btn
                        color="black"
                        class="text-capitalize rounded-pill white--text float-left"
                        @click="cancel"
                    >{{ $t("cancel") }}
                    </v-btn
                    >
                    <v-menu>
                      <template v-slot:activator="{ on }">
                        <v-btn
                            color="primary"
                            class="ml-2 float-right text-capitalize rounded-pill white--text"
                            v-on="on"
                        >
                          {{ $t("save_option") }}
                          <v-icon size="" class="ma-1">expand_more</v-icon>
                        </v-btn>
                      </template>
                      <v-list rounded>
                        <v-list-item-group>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ $t("save_draft") }}
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title @click="savePrint"
                              >{{ $t("save_print") }}
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-menu>
                    <v-btn
                        color="primary"
                        v-if="!isEdit"
                        @click="saveNew"
                        class="float-right white--text text-capitalize rounded-pill">
                      {{ $t("save_close") }}
                    </v-btn>
                  </v-card>
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
                                    <span class="pointer" @click="Help('production order')">
                                        {{ $t('help') }}
                                    </span>
                  <v-icon
                      onclick="window.history.go(-1); return false;"
                      style="cursor: pointer; color: #333; font-size: 40px;"
                      class="float-right mt-n1"
                  >close
                  </v-icon>
                </h3>

                <div v-if="!isHideBar" class="small_sidebar mt-9 grayBg">
                  <v-row>
                    <v-col sm="12" cols="12">
                      <h4 class="mb-3 text-uppercase">{{ $t("analysis") }}</h4>
                      <label class="label mb-0">{{ $t("default_warehouse") }}</label>
                      <v-select
                          :items="warehouses"
                          class="mt-2"
                          v-model="productionOrder.warehouse"
                          item-text="name"
                          item-value="id"
                          :placeholder="$t('warehouse')"
                          :rules="[(v) => !!v || 'Warehouse is required',]"
                          return-object
                          tage="Warehouse"
                          outlined
                      />
                      <label class="label mb-0">{{ $t('segment') }}</label>
                      <v-select class="mt-2"
                                v-model="productionOrder.segment"
                                :items="segments"
                                item-value="id"
                                :item-text="item =>`${item.code} - ${item.name}`"
                                return-object
                                tage="segment"
                                placeholder="segment"
                                outlined=""/>
                      <!--                                            <label class="label mb-0">{{ $t('location') }}</label>-->
                      <!--                                            <v-select class="mt-2"-->
                      <!--                                                      v-model="productionOrder.location"-->
                      <!--                                                      :items="locations"-->
                      <!--                                                      item-value="id"-->
                      <!--                                                      :item-text="item =>`${item.code} - ${item.name}`"-->
                      <!--                                                      return-object-->
                      <!--                                                      tage="Location"-->
                      <!--                                                      placeholder="bu/location"-->
                      <!--                                                      outlined=""/>-->
                      <!--                                            <label class="label font_14">{{ $t('sale_channel') }}</label>-->
                      <!--                                            <v-select class=" my-2"-->
                      <!--                                                      v-model="productionOrder.saleChannel"-->
                      <!--                                                      :items="saleChannelList"-->
                      <!--                                                      item-value="id"-->
                      <!--                                                      item-text="name"-->
                      <!--                                                      return-object-->
                      <!--                                                      tage="Sale Channel"-->
                      <!--                                                      placeholder="Channel"-->
                      <!--                                                      outlined-->
                      <!--                                            />-->
                      <label class="label">{{ $t("project") }}</label>
                      <v-select
                          class="mt-1"
                          v-model="productionOrder.project"
                          :items="projects"
                          :item-text="item =>`${item.code} - ${item.name}`"
                          item-value="id"
                          tage="Project"
                          outlined
                      />
                      <!--                                            <label class="label">{{ $t("default_employee") }}</label>-->
                      <!--                                            <v-select-->
                      <!--                                                class="mt-1"-->
                      <!--                                                :items="suppliers"-->
                      <!--                                                :rules="[(v) => !!v || 'Payble Account is required']"-->
                      <!--                                                return-object-->
                      <!--                                                tage="Default Employee"-->
                      <!--                                                outlined-->
                      <!--                                            />-->
                      <!--                                            <label class="label">{{ $t("for_month_of") }}</label>-->
                      <!--                                            <app-monthpicker-->
                      <!--                                                :initMonthOf="productionOrder.monthOf"-->
                      <!--                                                @emitMonthOf="productionOrder.monthOf = $event"-->
                      <!--                                            />-->
                    </v-col>
                  </v-row>
                  <v-divider class="mb-3"/>
                  <v-row>
                    <!--                                        <v-col sm="12" cols="12" class="pt-0">-->
                    <!--                                            <v-row v-for="(bom, index) in boms" v-bind:key="bom.id">-->
                    <!--                                                <label-->
                    <!--                                                    class="text-bold ml-9 pr-16 text-uppercase"-->
                    <!--                                                    style="font-size: 12px;"-->
                    <!--                                                >{{ index + 1 }} {{ $t("bom") }}</label-->
                    <!--                                                >-->
                    <!--                                                <v-col sm="9" cols="9" class="py-0 pr-0">-->
                    <!--                                                    <v-card-->
                    <!--                                                        outlined-->
                    <!--                                                        class="px-3 py-1 text-white no-boxshadow no_border justify-left d-flex"-->
                    <!--                                                        style="background-color: #92d050; height: 30px"-->
                    <!--                                                    >-->
                    <!--                                                        &lt;!&ndash;                                                        <input&ndash;&gt;-->
                    <!--                                                        &lt;!&ndash;                                                            type="checkbox"&ndash;&gt;-->
                    <!--                                                        &lt;!&ndash;                                                            class="checkbox_inv float-left"&ndash;&gt;-->
                    <!--                                                        &lt;!&ndash;                                                        />&ndash;&gt;-->
                    <!--                                                        <p class="mb-0" style="width: 100%">-->
                    <!--                                                            <span class="pl-3 float-left">No. {{ bom.abbr + '-' + bom.number }}</span>-->
                    <!--                                                            <span class="float-right">{{-->
                    <!--                                                                    bom.totalCost.toLocaleString()-->
                    <!--                                                                }}</span>-->
                    <!--                                                        </p>-->
                    <!--                                                    </v-card>-->
                    <!--                                                </v-col>-->
                    <!--                                                <v-col v-if="bomSeleted.id === undefined && bomSeleted.id !== bom.id"-->
                    <!--                                                       sm="3" cols="3" class="py-0  pl-1">-->
                    <!--                                                    <v-btn-->
                    <!--                                                        @click="selectBom(bom)"-->
                    <!--                                                        class="text-white text-bold rounded-0 float-right text-uppercase"-->
                    <!--                                                        style="height: 30px !important; background-color: rgb(0, 176, 80) !important"-->
                    <!--                                                    >{{ $t("add") }}-->
                    <!--                                                    </v-btn>-->
                    <!--                                                </v-col>-->
                    <!--                                                <v-col v-else sm="3" cols="3" class="py-0 pl-1">-->
                    <!--                                                    <v-btn-->
                    <!--                                                        disabled-->
                    <!--                                                        class="text-white text-bold pa-0 rounded-0 float-right text-uppercase"-->
                    <!--                                                        style="height: 30px !important; background-color: rgb(0, 176, 80) !important"-->
                    <!--                                                    >{{ $t("added") }}-->
                    <!--                                                    </v-btn>-->
                    <!--                                                </v-col>-->
                    <!--                                            </v-row>-->
                    <!--                                        </v-col>-->
                  </v-row>

                  <p class="mb-0 detial_smallside_p">
                    {{ $t("product_funct_order_desc") }}
                  </p>
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
          :myLoading="true"
      />
    </v-container>
  </v-app>
</template>

<script>
import DatePickerComponent from "@/components/custom_templates/DatePickerComponent";
import {DropDownList} from "@progress/kendo-vue-dropdowns";
import ProductionOrder from "@/scripts/model/ProductionOrder";
import kendo from "@progress/kendo-ui";
import {ShowResource} from '@/observable/store'
import BomModel from "@/scripts/model/Bom";
// import {uuid} from "vue-uuid";

const productVariantHandler = require("@/scripts/productVariantHandler")
const warehouseHandler = require("@/scripts/warehouseHandler")
const bomHandler = require("@/scripts/bomHandler")
const settingsHandler = require("@/scripts/settingsHandler")
const saleChannelHandler = require("@/scripts/saleChannelHandler")
const locationHandler = require("@/scripts/locationHandler")
const projectHandler = require("@/scripts/projectHandler")
const prefixHandler = require("@/scripts/prefixHandler")
const billingHandler = require("@/scripts/invoice/handler/billingHandler")
const productionOrderHandler = require("@/scripts/productionOrderHandler")
const keyField = 'id'
const textField = 'name'
const emptyItem = {[textField]: 'loading ...'}
const bomModel = new BomModel({})
// const $ = require("jquery")
export default {
  name: "ProductionOrder",
  components: {
    LoadingMe: () => import(`@/components/Loading`),
    "app-datepicker": DatePickerComponent,
    'dropdownlist': DropDownList
  },
  data: () => ({
    isEdit: false,
    showLoading: false,
    loadingAlert: false,
    alert: false,
    valid: true,
    templates: [
      {title: "Draft"},
      {title: "Open"},
      {title: "Paid"},
      {title: "Partially Paid"},
    ],
    isHideBar: false,
    productBaseUrl: productVariantHandler.itemSearchURL(),
    productList: [],
    dataItemKey: 'id',
    textField: 'name',
    defaultItem: {[textField]: 'Select product...', [keyField]: null},
    requestStarted: false,
    productionOrder: new ProductionOrder({}),
    bom: bomModel,
    projects: [],
    boms: [],
    bomSeleted: {},
    yieldUoms: [],
    warehouses: [],
    warehouse: {},
    segments: [],
    saleChannelList: [],
    locations: [],
    transactionTypes: [],
    uom: '',
    transactionNote: '',
    componentUsedData: [],
    otherFinishProductData: [],
    totalCost: 0,
    variance: 0,
    decimalFormat: 2
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
    UOMTemplate(dataItem) {
      const uom = dataItem.buom
      if (uom) {
        return `<span>${uom.name ? uom.name : ``}</span>`
      } else {
        return ``
      }
    },
    Help(key_search) {
      ShowResource(key_search)
    },
    onChangeQty() {
      const produceQty = this.productionOrder.qty
      let fpAmount = 0
      const finishProduct = this.bomSeleted.finishProduct || []
      finishProduct.map(n => {
        if (!n.hasOwnProperty('decimalFormat')) {
          n['decimalFormat'] = 'n2'
        }
        const yQty = n.yieldQty * kendo.parseFloat(produceQty)
        const iCost = n.cost
        const amount = iCost * yQty
        n['yieldQty'] = yQty
        n['amount'] = amount
        fpAmount += amount
        return {
          ...n
        }
      })
      this.productionOrder.finishProduct = finishProduct
      const componentUseAmt = this.addGridComponentUsed(this.bomSeleted.componentUsed, produceQty)
      const otherFinishProductUseAmt = this.addGridOtherProduct(this.bomSeleted.otherFinishProduct, produceQty)

      this.productionOrder.amount = componentUseAmt
      this.totalCost = componentUseAmt
      this.productionOrder.exchangeAmount = componentUseAmt
      this.productionOrder.variance = (fpAmount + otherFinishProductUseAmt) - componentUseAmt
      this.varince = (fpAmount + otherFinishProductUseAmt) - componentUseAmt
      // this.calculateVariance(fpAmount)
      // window.console.log(produceQty, 'change qty')
    },
    async onChangeBom(e) {
      this.bomSeleted = e
      // this.productionOrder = e
      this.transactionNote = this.bomSeleted.transactionNote
      this.productionOrder.warehouse = this.bomSeleted.warehouse
      const otherFinishProduct = this.bomSeleted.otherFinishProduct || []
      otherFinishProduct.map(n => {
        if (!n.hasOwnProperty('decimalFormat')) {
          n['decimalFormat'] = 'n2'
        }
        return {
          ...n
        }
      })
      this.otherFinishProductData = otherFinishProduct
      const componentUsed = this.bomSeleted.componentUsed || []
      componentUsed.map(n => {
        if (!n.hasOwnProperty('decimalFormat')) {
          n['decimalFormat'] = 'n2'
        }
        return {
          ...n
        }
      })
      this.componentUsedData = componentUsed
      this.productionOrder.qty = 1
      this.productionOrder.yieldUOM = e.finishProduct[0].buom || {}
      const yieldUOM = this.productionOrder.yieldUOM
      if (yieldUOM.hasOwnProperty('name')) {
        this.uom = this.productionOrder.yieldUOM.name
      }
      this.totalCost = this.bomSeleted.amount
      this.productionOrder.amount = this.bomSeleted.amount
      this.productionOrder.exchangeAmount = this.bomSeleted.amount
      this.productionOrder.variance = this.bomSeleted.variance
      this.variance = this.bomSeleted.variance
    },
    addGridComponentUsed(data, produceQty) {
      try {
        let totalCost_ = 0
        this.componentUsedData = data || []
        kendo.jQuery("#componentUse").data('kendoGrid').dataSource.data([]);
        let ds = this.$refs.componentUseDS.kendoWidget()
        this.componentUsedData.forEach((itm, index) => {
          const yQty = itm.qty * kendo.parseFloat(produceQty)
          const iCost = itm.cost
          const amount = iCost * yQty
          totalCost_ += amount
          ds.insert(index + 1, {
            id: itm.id,
            item: itm.item,
            description: itm.description,
            buom: itm.buom || {},
            uom: itm.uom,
            qty: yQty,
            cost: iCost,
            amount: amount,
            sku: itm.sku,
            decimalFormat: itm.decimalFormat,
          })
        })
        this.totalCost = totalCost_
        this.productionOrder.amount = totalCost_
        this.productionOrder.exchangeAmount = totalCost_
        this.productionOrder.componentUsed = ds.data().map(itm => {
          return {
            id: itm.id,
            item: itm.item,
            description: itm.description,
            buom: itm.buom || {},
            uom: itm.uom,
            qty: itm.qty,
            cost: itm.cost,
            amount: itm.amount,
            sku: itm.sku,
            decimalFormat: itm.decimalFormat,
          }
        })
        return totalCost_
      } catch (e) {
        window.console.log('error', e)
        return 0
      }
    },
    addGridOtherProduct(data, produceQty) {
      try {
        let oFpAmount = 0
        this.otherFinishProductData = data || []
        kendo.jQuery("#otherFinishProduct").data('kendoGrid').dataSource.data([]);
        let ds = this.$refs.otherProductDS.kendoWidget()
        this.otherFinishProductData.forEach((itm, index) => {
          const yQty = itm.yieldQty * kendo.parseFloat(produceQty)
          const iCost = itm.cost
          const amount = iCost * yQty
          oFpAmount += amount
          ds.insert(index + 1, {
            id: itm.id,
            item: itm.item,
            description: itm.description,
            buom: itm.buom || {},
            uom: itm.uom,
            yieldQty: yQty,
            cost: iCost,
            amount: amount,
            sku: itm.sku,
            decimalFormat: itm.decimalFormat,
          })
        })
        this.productionOrder.otherFinishProduct = ds.data().map(itm => {
          return {
            id: itm.id,
            item: itm.item,
            description: itm.description,
            buom: itm.buom || {},
            uom: itm.uom,
            yieldQty: itm.yieldQty,
            cost: itm.cost,
            amount: itm.amount,
            sku: itm.sku,
            decimalFormat: itm.decimalFormat,
          }
        })
        return oFpAmount
      } catch (e) {
        window.console.log('error', e)
        return 0
      }
    },
    calculateVariance() {
      const cDS = this.$refs.componentUseDS.kendoWidget()
      const oPDS = this.$refs.otherProductDS.kendoWidget()
      let amount = 0
      cDS.data().forEach(n => {
        amount += parseFloat(n.amount)
      })
      oPDS.data().forEach(n => {
        amount += parseFloat(n.amount)
      })
      this.productionOrder.amount = amount
    },

    async loadPrefix() {
      new Promise(resolve => {
        setTimeout(async () => {
          resolve('resolved');
          await prefixHandler.get('production order').then(async res => {
            if (res.data.statusCode === 200) {
              this.showLoading = false
              this.transactionTypes = res.data.data
              if (this.transactionTypes.length > 0) {
                this.productionOrder.transactionType = this.transactionTypes[0]
                if (this.$route.params.id === undefined) {
                  await this.generateNumber()
                }
              }
            }

          })
        }, 10);
      })
    },
    async generateNumber() {
      if (this.productionOrder.dueDate !== '') {
        let data = {
          abbr: this.productionOrder.transactionType.abbr,
          structure: this.productionOrder.transactionType.structure,
          transactionDate: this.productionOrder.dueDate,
          sequcencing: this.productionOrder.transactionType.sequcencing,
          type: 'Production Order',
          entity: 2
        }
        this.productionOrder.abbr = data.abbr
        this.productionOrder.structure = data.structure
        this.productionOrder.sequcencing = data.sequcencing
        this.productionOrder.transactionDate = data.transactionDate
        this.productionOrder.type = data.type
        await billingHandler.lastNumber(data).then(response => {
          if (response.data.statusCode === 200) {
            const res = response.data.data
            const lastNumber = this.zeroPad(parseInt(res.lastNumber), this.productionOrder.transactionType.format)
            this.productionOrder.number = res.suffix + this.productionOrder.transactionType.numberSeparator + lastNumber
            this.productionOrder.lastNumber = res.suffix + lastNumber
            window.console.log(this.productionOrder.number, 'production')
          }
        }).catch(e => {
          this.errors.push(e)
        })
      }
    },
    zeroPad(num, places) {
      return String(num).padStart(places, '0')
    },
    suffix(transactionDate) {
      return kendo.toString(new Date(transactionDate), `yymm`)
    },
    async loadProjects() {
      await projectHandler.list().then(res => {
        this.projects = res.data.data
        if (this.projects.length > 0) {
          this.productionOrder.project = this.projects[0]
        }
      })
    },
    async loadWarehouses() {
      warehouseHandler.getWarehouseSettingAll().then(res => {
        this.warehouses = res
      })
    },
    async onChange(event) {
      const value = event.value
      if (value && value[textField] === emptyItem[textField]) {
        return;
      }
      this.showLoading = true
      window.console.log(value)
      this.productionOrder.product = value
      await this.onloadBom(value.id)
    },
    onFilterChange() {
      // const filter = event.filter.value
      this.requestData(0, this.productBaseUrl)
    },
    requestData(skip, baseUrl) {
      const url = baseUrl
      this.requestStarted = true;
      fetch(url)
          .then((response) => {
            // window.console.log(response.json())
            return response.json()
          })
          .then(this.afterFetch)

    },
    afterFetch(json) {
      this.productList = json.data
    },
    async onloadBom(productId) {
      bomHandler.getByProduct(productId).then(res => {
        this.boms = res
        this.transactionNote = res.transactionNote
        this.showLoading = false
      })
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
    rowNumberCU(dataItem) {
      let ds = this.$refs.componentUseDS.kendoWidget(),
          index = ds.indexOf(dataItem);
      return index + 1;
    },
    rowNumberOP(dataItem) {
      let ds = this.$refs.otherProductDS.kendoWidget(),
          index = ds.indexOf(dataItem);
      return index + 1;
    },
    UOMTemplateOP(dataItem) {
      const uom = dataItem.uom
      if (uom) {
        return `<span>${uom.uom ? uom.uom.name : ``}</span>`
      } else {
        return ``
      }
    },
    UOMTemplateCU(dataItem) {
      const uom = dataItem.uom
      if (uom) {
        return `<span>${uom.uom ? uom.uom.name : ``}</span>`
      } else {
        return ``
      }
    },
    rowNumberOC(dataItem) {
      let ds = this.$refs.otherCostDS.kendoWidget(),
          index = ds.indexOf(dataItem);
      return index + 1;
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
              if (this.segments.length > 0) {
                this.productionOrder.segment = this.segments[0]
              }
              // this.segmentList = res.data.data
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
              if (this.locations.length > 0) {
                this.productionOrder.location = this.locations[0]
              }
            }
          }).catch()
          {
            this.showLoading = false
          }
        }, 10)
      })
    },
    async loadSaleChannel() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          this.showLoading = true
          saleChannelHandler.get().then(res => {
            if (res.data.statusCode === 200) {
              this.showLoading = false
              this.saleChannelList = res.data.data
              if (this.saleChannelList.length > 0) {
                this.productionOrder.saleChannel = this.saleChannelList[0]
              }
            } else {
              this.showLoading = false
            }
          })
        }, 10);
      })
    },
    savePrint() {
    },
    saveNew() {
      this.showLoading = true
      this.productionOrder.bom = new BomModel(this.bomSeleted)
      this.productionOrder.transactionNote = this.transactionNote
      this.productionOrder.status = 1

      productionOrderHandler.create(this.productionOrder).then(res => {
        this.showLoading = false
        // this.$router.push({
        //   name: 'Products',
        //   path: 'product',
        //   params: {dataPO: res.data.data}
        // })
        window.console.log(res)
      })
    },
    errorMessage() {
    },
    accountDropDownEditor() {
    },
    cancel() {
    },
    hideSmallSidebar() {
      this.isHideBar = !this.isHideBar;
    },
  },
  watch: {
    // call again the method if the route changes
  },
  async created() {
    // fetch the data when the view is created and the data is
    // already being observed
    // this.loadObj()
    // await this.loadPrefix()
    this.productionOrder.dueDate = new Date().toISOString().substr(0, 10)
    this.productionOrder.monthOf = new Date().toISOString().substr(0, 7)
    await this.loadPrefix()
  },
  async mounted() {
    // await this.loadPrefix()
    await this.loadWarehouses()
    await this.loadSaleChannel()
    await this.loadSegment()
    await this.loadLocation()
    await this.loadProjects()
    this.requestData(0, this.productBaseUrl)
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
  transition: 0.5s ease-in;
  flex: 0 0 0;
  padding: 0;
}

.hide_big_bar_class {
  max-width: 100%;
  transition: 0.5s ease-in;
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

.theme--light.v-data-table
> .v-data-table__wrapper
> table
> tbody
> tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: transparent !important;
}

.detial_smallside_p {
  position: absolute;
  bottom: 10px;
}
</style>
