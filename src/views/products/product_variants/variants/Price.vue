<template>
  <v-row>
    <v-col sm="12" cols="12" class="pt-0">
      <h2 class="float-left font_18">{{ $t('variants_price') }}</h2>
      <v-dialog v-model="dialogm2" max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" class="btn_create_new float-right rounded-pill" v-on="on"
                 @click="newClick">
            {{ $t('new_price') }}
          </v-btn>
        </template>
        <v-card>
          <v-card-title>{{ $t('price_list') }}</v-card-title>
          <v-icon class="btn_close" @click="dialogm2 = false, close">close</v-icon>
          <v-card-text style="height: 180px; background-color: #EDF1F5; color: #333;">
            <v-row>
              <v-col sm="6" cols="12">
                <label>{{ $t('applied_date') }}</label>
                <v-menu
                    v-model="menuDate"
                    :close-on-content-click="false"
                    max-width="290">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        class="mt-1"
                        :value="dateFormatted"
                        readonly
                        outlined
                        v-model="uomPrice.appliedDate"
                        append-icon="event"
                        v-on="on"
                        v-bind="attrs"
                        @click:append="menuDate = true"/>
                  </template>

                  <v-date-picker
                      v-model="uomPrice.appliedDate"
                      @change="onDateChange"
                      no-title/>
                </v-menu>
                <!--                                <DatePicker :initialDate="appliedDate"-->
                <!--                                            @emitDate="appliedDate = $event"/>-->
                <label class="label">{{ $t('price_level') }}</label>
                <v-select class="mt-1"
                          tage="Price Level"
                          v-model="mPriceLevel"
                          :items="priceLevel"
                          item-value="id"
                          item-text="name"
                          return-object
                          outlined/>
              </v-col>
              <v-col sm="6" cols="12">
                <label class="label">{{ $t('uom') }}</label>
                <v-select class="mt-1"
                          tage="UOM"
                          v-model="mUOM"
                          :items="uomConversion"
                          item-value="id"
                          item-text="toUOM.name"
                          return-object
                          outlined/>
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
            :template="'<span>#=uom.toUOM.name#</span>'"
            :groupHeaderColumnTemplate="'#=value#'"
            :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
        <kendo-grid-column
            :field="'priceLevel'"
            :title="$t('price_level')"
            :width="90"
            :template="'<span>#=priceLevel.name#</span>'"
            :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
        <kendo-grid-column
            :field="'price'"
            :title="$t('price')"
            :template="'<span>#=price#</span>'"
            :width="60"
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
import UOMPrice from "@/scripts/model/UOMPrice"
// import UOMConversionPrice from "@/scripts/model/UOMConversion"
// import DatePickerComponent from '@/components/custom_templates/DatePickerComponent'
import kendo from "@progress/kendo-ui";

const uomConversionHandler = require("@/scripts/uomConversionHandler")
const priceLevelHandler = require("@/scripts/priceLevelHandler")
const uomPriceHandler = require("@/scripts/uomPriceHandler")
const $ = require("jquery")
let uomPriceModel = new UOMPrice({})

export default {
  props: {
    product: {}
  },
  components: {
    // 'DatePicker': DatePickerComponent
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
    uomPrice: uomPriceModel,
    gridSchema: {
      model: {
        id: "id"
      }
    },
    dateFormat: "dd-MM-yyyy",
  }),
  methods: {
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
      this.uomPrice.appliedDate = new Date().toISOString().substr(0, 10)
      this.mPriceLevel = {}
      if (this.product !== undefined) {
        this.loadConversionList()
      }
    },
    async loadConversionList() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          if (this.product) {
            if (this.product.hasOwnProperty('uom')) {
              this.showLoading = true
              uomConversionHandler.get(this.variantId).then(res => {
                this.showLoading = false
                this.uomConversion = res
              })
            }
          }
        }, 50)
      })
    },
    async loadUOMPrice() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          if (this.product) {
            if (this.product.hasOwnProperty('uom')) {
              this.showLoading = true
              uomPriceHandler.get(this.variantId).then(res => {
                this.showLoading = false
                this.priceList = res
              })
            }
          }
        }, 50)
      })
    },
    async loadPriceLevel() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          if (this.product) {
            // window.console.log(this.product)
            if (this.product.hasOwnProperty('uom')) {
              priceLevelHandler.get().then(res => {
                this.priceLevel = res
              })
            }
          }
        }, 50)
      })
    },
    async goEdit(e) {
      e.preventDefault();
      let grid = kendo.jQuery("#gridPrice").data("kendoGrid");
      let dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
      // window.console.log(dataItem, 'dataItem')
      // this.uomPrice = {
      //   appliedDate: dataItem.appliedDate || '',
      //   id: dataItem.id || '',
      //   price: dataItem.price || 0,
      //   priceLevel: dataItem.priceLevel || {},
      //   priceType: dataItem.priceType || {},
      //   uom: dataItem.uom || {}
      // }
      this.uomPrice = new UOMPrice(dataItem)
      this.mUOM = dataItem.uom
      this.mPriceLevel = dataItem.priceLevel
      this.dialogm2 = true
      window.console.log(this.uomPrice, 'val')
    },
    async onSaveClose() {
      // if (!this.$refs.form.validate()) {
      //   this.$refs.form.validate()
      //   return
      // }
      // window.console.log(this.uomPrice.appliedDate, 'my date_', this.appliedDate)
      // return
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          if (this.product) {
            const itm = this.product
            const item = {
              id: itm.id,
              barcode: itm.barcode,
              images: itm.images,
              name: itm.name,
              product: itm.product,
              productId: itm.productId,
              reOrderQty: itm.reOrderQty,
              sku: itm.sku,
              uom: itm.uom,
              variant: itm.variant
            }
            let data = {
              "id": this.uomPrice.id,
              "itemId": this.variantId,
              "uom": {
                conversionRate: this.mUOM.conversionRate,
                fromUOM: this.mUOM.fromUOM,
                id: this.mUOM.id,
                rate: this.mUOM.rate,
                isSystem: this.mUOM.isSystem,
                toUOM: this.mUOM.toUOM
              },
              "priceLevel": {
                code: this.mPriceLevel.code,
                id: this.mPriceLevel.id,
                name: this.mPriceLevel.name,
                currency: this.mPriceLevel.currency,
                type: this.mPriceLevel.type
              },
              "price": this.uomPrice.price,
              "type": "Variant",
              "item": item,
              "appliedDate": this.uomPrice.appliedDate
            }
            // window.console.log(JSON.stringify(data), data)
            this.showLoading = true
            uomPriceHandler.create(this.variantId, data).then(response => {
              if (response.data.statusCode === 201) {
                this.showLoading = false
                let res = response.data.data
                const index = this.priceList.findIndex(item => {
                  return (res.id === item.id)
                })
                if (index < 0) {
                  this.priceList.push(res)
                } else {
                  this.priceList.splice(index, 1, res)
                }
                this.$snotify.success('Success')
                this.close()
              }
            }).catch(e => {
              this.showLoading = false
              this.$snotify.error('Something went wrong')
              this.errors.push(e)
            })
          }
        }, 50)
      })
    },
  },
  mounted: async function () {
    await this.loadPriceLevel()
    await this.loadConversionList()
    await this.loadUOMPrice()
  },
  watch: {
    product() {
      if (this.product !== undefined) {
        this.showLoading = true
        this.loadConversionList()
        this.loadUOMPrice()
        this.showLoading = false
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
      if (this.product) {
        if (this.product.hasOwnProperty('uom')) {
          return this.product.uom.name
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    baseUOM() {
      if (this.product) {
        if (this.product.hasOwnProperty('uom')) {
          return this.product.uom
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    variantId() {
      if (this.product) {
        if (this.product.hasOwnProperty('id')) {
          return this.product.id
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
