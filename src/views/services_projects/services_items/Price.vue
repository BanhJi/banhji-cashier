<template>
  <v-row>
    <v-col sm="12" cols="12" class="pt-0">
      <h2 class="float-left font_18">{{ $t('service_price') }}</h2>
      <v-dialog v-model="dialogm2" max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" class="btn_create_new float-right rounded-pill" v-on="on"
                 @click="newClick">
            {{ $t('new_price') }}
          </v-btn>
        </template>
        <v-card>
          <v-card-title>{{ $t('service_price') }}</v-card-title>
          <v-icon class="btn_close" @click="dialogm2 = false, close">close</v-icon>
          <v-card-text style="background-color: #EDF1F5; color: #333;">
            <v-row>
              <v-col sm="6" cols="12" class="pb-0">
                <label>{{ $t('applied_date') }}</label>
                <app-datepicker :initialDate="uomPrice.appliedDate"
                                @emitDate="appliedDate = $event"/>
              </v-col>
              <v-col sm="6" cols="12" class="pb-0">
                <label class="label">{{ $t('uom') }}</label>
                <v-select class="mt-1"
                          tage="UOM"
                          v-model="mUOM"
                          :items="uomConversion"
                          item-value="id"
                          item-text="toUOM.name"
                          return-object
                          outlined/>
              </v-col>
              <!--                            <v-col sm="12" cols="12" class="py-0"><p class="font_24 mb-0">{{ $t('price_model') }}</p></v-col>-->
              <v-col sm="6" cols="12">
                <label class="label">{{ $t('price_level') }}</label>
                <v-select class="mt-1"
                          tage="Price Level"
                          v-model="mPriceLevel"
                          :items="priceLevel"
                          :placeholder="$t('price_level')"
                          item-value="id"
                          @change="dynamicHeaderTemplate"
                          item-text="name"
                          return-object
                          outlined/>

              </v-col>
              <v-col sm="6" cols="12">
                <label>{{ $t('price') }}</label>
                <v-row>
                  <v-col sm="3" cols="3" class="mt-1 pt-0 pr-0">
                    <div class="code_text text-bold">{{ code }}</div>
                  </v-col>
                  <v-col sm="9" cols="9" class="mt-1 py-0 pl-0 pr-1">
                    <v-text-field class="custom-border"
                                  outlined
                                  type="number"
                                  tage="Price"
                                  v-model="uomPrice.price"
                                  clearable/>
                  </v-col>
                </v-row>
              </v-col>
              <!--                            <v-col sm="6" cols="12">-->
              <!--                                <label class="label">{{ $t('type') }}</label>-->
              <!--                                <v-select :items="types" item-text="name" item-value="id" v-model="type" class="mt-1"-->
              <!--                                          :placeholder="$t('type')"-->
              <!--                                          :disabled="mPriceLevel.id === undefined"-->
              <!--                                          return-object-->
              <!--                                          outlined/>-->
              <!--                            </v-col>-->
              <v-col v-if="type.id === 3" sm="12" cols="12" class="py-0">
                <label>{{ $t('price') }}</label>
              </v-col>
              <v-col v-if="type.id === 3" sm="4" cols="4" class="pb-1 py-0">
                <v-select v-model="data.type" return-object outlined item-value="id" item-text="name"
                          :items="modes"
                          class=""/>
              </v-col>
              <v-col v-if="type.id === 3" sm="6" cols="12" class="py-0">
                <v-text-field class=""
                              v-if="type.id === 3"
                              outlined
                              tage="Price"
                              v-model="data.amount"
                              clearable/>
              </v-col>
              <v-col v-if="type.id === 2" sm="12" cols="12" class="py-0">
                <kendo-datasource ref="volumeDS"
                                  :change="dataSourceChanged"
                                  :data="volumes"/>
                <kendo-grid id="gridVolumeDS" class="grid-function"
                            :data-source-ref="'volumeDS'"
                            :editable="true"
                            :scrollable-virtual="true">
                  <kendo-grid-column
                      :field="'isMin'"
                      :title="''"
                      :editor="rowTitle"
                      :width="80"
                      :column-menu="false"
                      :headerTemplate="headerTemplate"
                      :headerAttributes="{ style: 'background-color: #EDF1F5;', class: 'text-center'	}"
                      :attributes="{style: 'text-align: center'}"/>
                  <!--                                    <kendo-grid-column-->
                  <!--                                        :field="'firstUnit'"-->
                  <!--                                        :title="$t('first_unit')"-->
                  <!--                                        :width="100"-->
                  <!--                                        :template="'<span>#=firstUnit#</span>'"-->
                  <!--                                        :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>-->
                  <kendo-grid-column
                      :field="'lastUnit'"
                      :title="$t('last_unit')"
                      :width="100"
                      :editor="LastUnitEditor"
                      :template="'<span>#=lastUnit#</span>'"
                      :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
                  <kendo-grid-column
                      :field="'price'"
                      :title="$t('price')"
                      :width="100"
                      :template="'<span>#=price#</span>'"
                      :headerTemplate="headerPriceTemplate"
                      :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
                  <kendo-grid-column
                      :field="''"
                      :title="$t('action')"
                      :width="70"
                      :command="[{ iconClass: 'k-icon k-i-trash', text: 'Delete', click: removeRow }]"
                      :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"/>
                </kendo-grid>
                <v-btn @click="addRow" class="float-left btn_plus mt-2 rounded-0">
                  <v-icon size="" class="ma-1">mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pa-5">
            <v-row>
              <v-col sm="6" cols="6" class="py-0 text-left">
                <v-btn color="black" outlined
                       class=" text-capitalize rounded-pill black--text float-left"
                       @click="dialogm2 = false">{{ $t('cancel') }}
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
    </v-col>
    <v-col sm="12" clos="12" class="pt-0">
      <div>
        <LoadingMe
            :isLoading="showLoading"
            :fullPage="false"
            type="loading"
            :myLoading="true"/>
      </div>
      <kendo-datasource ref="dataSource"
                        :data="priceList"
                        :schema="gridSchema"/>
      <kendo-grid id="gridPrice"
                  class="grid-function"
                  :data-source-ref="'dataSource'"
                  :style="{width: '100%'}"
                  :noRecords="true"
                  :pageable-numeric="false"
                  :pageable-previous-next="false"
                  :pageable-messages-display="'Showing {2} data items'"
                  :scrollable-virtual="true">

        <kendo-grid-column
            :field="'uom'"
            :title="$t('uom')"
            :width="60"
            :template="uom"
            :groupHeaderColumnTemplate="'#=value#'"
            :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
        <kendo-grid-column
            :field="'priceLevel'"
            :title="$t('price_level')"
            :width="90"
            :template="'<span>#=priceLevel.name#</span>'"
            :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
        <!--                <kendo-grid-column-->
        <!--                    :field="'types'"-->
        <!--                    :title="$t('price_model')"-->
        <!--                    :width="90"-->
        <!--                    :template="'<span>#=types.name#</span>'"-->
        <!--                    :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>-->
        <kendo-grid-column
            :field="'price'"
            :title="$t('price')"
            :template="'<span>#=price#</span>'"
            :width="60"
            :attributes="{ style: 'text-align: right; ' }"
            :headerAttributes="{style: 'text-align: left; background-color: #EDF1F5'}"/>
        <kendo-grid-column
            :field="'appliedDate'"
            :title="$t('applied_date')"
            :template="'<span>#=appliedDate#</span>'"
            :width="80"
            :headerAttributes="{style: 'text-align: left; background-color: #EDF1F5'}"/>
        <kendo-grid-column
            :field="''"
            :title="$t('action')"
            :width="60"
            :command="[{ text: $t('edit'), click: goEdit }]"
            :headerAttributes="{style: 'text-align: left; background-color: #EDF1F5'}"/>
      </kendo-grid>
    </v-col>
  </v-row>
</template>
<script>
import UOMServicePrice from "@/scripts/model/UOMServicePrice"
import kendo from "@progress/kendo-ui";
import DatePickerComponent from "@/components/custom_templates/DatePickerComponent";

const uomServiceConversionHandler = require("@/scripts/uomServiceConversionHandler")
const priceLevelHandler = require("@/scripts/priceLevelHandler")
const uomServicePriceHandler = require("@/scripts/uomServicePriceHandler")
const $ = require("jquery")
let uomServicePriceModel = new UOMServicePrice({})

export default {
  props: {
    service: {}
  },
  components: {
    'app-datepicker': DatePickerComponent,
    LoadingMe: () => import(`@/components/Loading`)
  },
  data: () => ({
    dialogm2: false,
    showLoading: false,
    uomConversion: [],
    priceList: [],
    priceLevel: [],
    mPriceLevel: [],
    mUOM: {},
    menuDate: false,
    appliedDate: new Date().toISOString().substr(0, 10),
    uomPrice: uomServicePriceModel,
    gridSchema: {
      model: {
        id: "id"
      }
    },
    dateFormat: "dd-MM-yyyy",
    // {id: 2, name: 'Volume Pricing'},
    types: [{id: 1, name: 'Standard'}, {id: 3, name: 'Performance Based'}],
    type: 'Standard',
    modes: [{id: 1, name: '%'}, {id: 2, name: 'Amount'}],
    data: {amount: '', type: ''},
    volumes: [],
    minNum: 0,
  }),
  methods: {
    uom(dataItem) {
      if (dataItem.hasOwnProperty('uom')) {
        if (dataItem.uom.hasOwnProperty('toUOM')) {
          return dataItem.uom.toUOM.name
        }
      } else {
        return ''
      }
    },
    dataSourceChanged(e) {
      if (e.field) {
        let dataRow = e.items[0]
        switch (e.field) {
          case "lastUnit":
            this.minNum = dataRow.lastUnit
            break
          default:
            break
        }
      }
    },
    LastUnitEditor(container, options) {
      let ds = this.$refs.volumeDS.kendoWidget()
      if (ds.at(0).uid === options.model.uid) {
        this.minNum = -1
      }

      kendo.jQuery('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoNumericTextBox({min: this.minNum + 1})
    },
    removeRow(e) {
      e.preventDefault();
      const grid = kendo.jQuery("#gridVolumeDS").data("kendoGrid"),
          dataSource = grid.dataSource,
          dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
      if (dataSource.total() > 1) {
        dataSource.remove(dataItem);
      }
    },
    addRow() {
      let ds = this.$refs.volumeDS.kendoWidget(),
          total = ds.total();
      if (total === 0) {
        ds.insert(total, {
          lastUnit: 0,
          price: '',
        })
      } else {
        ds.insert(total, {
          lastUnit: '',
          price: '',
        })
      }

    },
    headerTemplate() {
      return '<input type="checkbox"/> is Min'
    },
    dynamicHeaderTemplate() {
      const title = 'price (' + this.symbol + ')'
      kendo.jQuery("#gridVolumeDS th[data-field=price]").html(title);
      window.console.log(title)
    },
    headerPriceTemplate() {
      return 'price (' + this.symbol + ')'
    },
    selectTemplate(dataItem) {
      if (dataItem.isMin) {
        return '<input checked type="checkbox"/>'
      } else {
        return '<input type="checkbox"/>'
      }

    },
    rowTitle(container, options) {
      let ds = this.$refs.volumeDS.kendoWidget()
      if (ds.at(0).uid === options.model.uid) {
        return kendo.jQuery('<input type="checkbox" name="' + options.field + '"/>')
            .appendTo(container)
      } else {
        return ''
      }

    },
    onDateChange() {
      this.menuDate = false
      // window.console.log(this.uomPrice.appliedDate)
    },
    close() {
      // window.history.go(-1)
      this.dialogm2 = false
    },
    newClick() {
      this.uomPrice = {}
      this.mUOM = {}
      this.volumes = []
      this.data = {amount: '', type: ''}
      this.uomPrice.appliedDate = new Date().toISOString().substr(0, 10)
      this.mPriceLevel = {}
      if (this.service !== undefined) {
        this.loadConversionList()
      }
    },
    async loadConversionList() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          if (this.service) {
            if (this.service.hasOwnProperty('uom')) {
              uomServiceConversionHandler.get(this.serviceId).then(res => {
                this.uomConversion = res
              })
            }
          }
        }, 300)
      })
    },
    async loadUOMPrice() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          if (this.service) {
            if (this.service.hasOwnProperty('uom')) {
              this.showLoading = true
              uomServicePriceHandler.get(this.serviceId, '?type=Service').then(res => {
                this.showLoading = false
                this.priceList = res
              })
            }
          }
        }, 300)
      })
    },
    async loadPriceLevel() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          if (this.service) {
            // window.console.log(this.product)
            if (this.service.hasOwnProperty('uom')) {
              priceLevelHandler.get().then(res => {
                this.priceLevel = res
              })
            }
          }
        }, 300)
      })
    },
    async goEdit(e) {
      e.preventDefault();
      let grid = kendo.jQuery("#gridPrice").data("kendoGrid");
      let dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
      this.uomPrice = dataItem
      this.mUOM = dataItem.uom
      // this.type = dataItem.priceType
      // if (dataItem.data.hasOwnProperty('price')) {
      //     this.data = dataItem.data
      // } else {
      //     this.volumes = dataItem.data
      // }
      this.mPriceLevel = dataItem.priceLevel
      this.dialogm2 = true
    },
    async onSaveClose() {
      new Promise(resolve => {
        // if (this.type.id !== 1) {
        //     if (this.$refs.volumeDS !== undefined) {
        //         let ds = this.$refs.volumeDS.kendoWidget()
        //         let dataRow = ds.data()
        //         if (dataRow.length > 0) {
        //             this.data = dataRow
        //         }
        //     }
        //     this.uomPrice.price = 0
        // } else {
        //     this.data = {}
        // }

        setTimeout(() => {
          resolve('resolved');
          let data = {
            "id": this.uomPrice.id,
            "serviceId": this.serviceId,
            "uom": this.mUOM,
            "priceLevel": this.mPriceLevel,
            "type": "Service",
            "priceType": this.type,
            "price": this.uomPrice.price,
            "item": this.service ? this.service : {},
            "data": this.data,
            "appliedDate": this.uomPrice.appliedDate
          }
          this.showLoading = true
          uomServicePriceHandler.create(this.serviceId, data).then(response => {
            if (response.data.statusCode === 201) {
              this.showLoading = false
              let res = response.data.data
              const index = this.priceList.findIndex(item => {
                return (res.id === item.id)
              })
              if (index < 0) {
                if (this.priceList.length === 0) {
                  this.priceList = [res]
                } else {
                  this.priceList.push(res)
                }
                const grid = kendo.jQuery("#gridPrice").data("kendoGrid");
                grid.refresh()
                window.console.log(res)
              } else {
                this.priceList.splice(index, 1, res)
              }
              this.$snotify.success('Success')
              this.close()
            }
          }).catch(e => {
            this.$snotify.error('Something went wrong')
            this.errors.push(e)
          })
        }, 300)
      })
    },
  },
  mounted: async function () {
    await this.loadPriceLevel()
    await this.loadConversionList()
    await this.loadUOMPrice()
  },
  watch: {
    service() {
      if (this.service !== undefined) {
        this.loadConversionList()
        this.loadUOMPrice()
        this.loadPriceLevel()
      }
    },
  },
  computed: {
    code() {
      if (this.mPriceLevel) {
        if (this.mPriceLevel.hasOwnProperty('currency')) {
          const currency = this.mPriceLevel.currency
          if (currency.hasOwnProperty('code')) {
            return currency.code
          } else {
            return ''
          }
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    dateFormatted() {
      return this.uomPrice.appliedDate ? kendo.toString(new Date(this.uomPrice.appliedDate), this.dateFormat) : ''
    },
    baseUOMName() {
      if (this.service) {
        if (this.service.hasOwnProperty('uom')) {
          return this.service.uom.name
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    baseUOM() {
      if (this.service) {
        if (this.service.hasOwnProperty('uom')) {
          return this.service.uom
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    serviceId() {
      if (this.service) {
        window.console.log(this.service, 'sserviceId')
        if (this.service.hasOwnProperty('id')) {
          return this.service.id
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
}
</script>
