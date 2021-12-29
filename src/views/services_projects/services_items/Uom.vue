<template>
  <v-row>
    <v-col sm="12" cols="12" class="pt-0">
      <h2 class="float-left font_18">{{ $t('unit_of_measure') }}</h2>
      <v-dialog v-model="dialogm2" max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" class="btn_create_new float-right rounded-pill" v-on="on"
                 @click="newClick">
            {{ $t('new_uom') }}
          </v-btn>
        </template>
        <v-card>
          <v-card-title>{{ $t('service_uom') }}</v-card-title>
          <v-icon class="btn_close" @click="dialogm2 = false">close</v-icon>
          <v-card-text style="height: 270px; background-color: #EDF1F5; color: #333;">
            <v-row>
              <v-col sm="6" cols="12">

                <p> Base UOM </p>
                <p class="text-bold"> {{ baseUOMName }}</p>
                <p> The conversion is based on a unit of base uom</p>

              </v-col>
              <v-col sm="6" cols="12">
                <label class="label">{{ $t('new_uom') }}</label>
                <p class="text_tip">{{ $t('1_day_base_uom') }}</p>
                <v-select class=""
                          tage="UOM"
                          v-model="mUOM"
                          :items="uom"
                          item-value="id"
                          item-text="name"
                          @change="onUOMChanged"
                          return-object
                          outlined/>

                <label>{{ $t('rate') }}</label>
                <v-text-field class=" my-2"
                              outlined
                              v-model="uomConversion.rate"
                              type="number"
                              tage="rate"
                              clearable/>
                <p class="text_tip">{{ $t('conversion_rate') }}</p>
                <label> {{ conversionUOM }}</label>
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
      <LoadingMe
          :isLoading="showLoading"
          :fullPage="false"
          type="loading"
          :myLoading="true">

      </LoadingMe>
      <kendo-datasource ref="dataSource"
                        :data="uomServiceConversion"
                        :schema="gridSchema"/>
      <kendo-grid id="gridServiceUOM"
                  class="grid-function"
                  v-on:databound="dataBound"
                  :data-source-ref="'dataSource'"
                  :style="{width: '100%'}"
                  :noRecords="true"
                  :pageable-numeric="false"
                  :pageable-previous-next="false"
                  :pageable-messages-display="'Showing {2} data items'"
                  :scrollable-virtual="true">
        <kendo-grid-column
            :field="'toUOM'"
            :title="$t('uom')"
            :width="100"
            :template="'<span>#=toUOM.name#</span>'"
            :groupHeaderColumnTemplate="'#=value#'"
            :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
        <kendo-grid-column
            :field="'rate'"
            :title="$t('rate')"
            :width="100"
            :template="'<span>#=rate#</span>'"
            :attributes="{ style: 'text-align: right; ' }"
            :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
        <kendo-grid-column
            :field="'conversionRate'"
            :title="$t('conversion_rate')"
            :attributes="{ style: 'text-align: right; ' }"
            :template="'<span>#=conversionRate#</span>'"
            :width="150"
            :headerAttributes="{style: 'text-align: left; background-color: #EDF1F5'}"/>
        <kendo-grid-column
            :field="''"
            :title="$t('action')"
            :width="70"
            :command="[{ text: $t('edit'), click: goEdit, className: 'k-state-disabled isSystem' }]"
            :headerAttributes="{style: 'text-align: left; background-color: #EDF1F5'}"/>
      </kendo-grid>
    </v-col>
  </v-row>
</template>
<script>

import UOMConversion from "@/scripts/model/UOMConversion"

const uomHandler = require("@/scripts/uomHandler")
const uomServiceConversionHandler = require("@/scripts/uomServiceConversionHandler")
const $ = require("jquery")
import kendo from "@progress/kendo-ui";

let uomConversionModel = new UOMConversion({})
export default {
  props: {
    service: {}
  },
  components: {
    LoadingMe: () => import(`@/components/Loading`)
  },
  data: () => ({
    dialogm2: false,
    uom: [],
    uoms: [],
    mUOM: {},
    mBaseUOM: {},
    uomServiceConversion: [],
    uomName: '',
    gridSchema: {
      model: {
        id: "id"
      }
    },
    showLoading: false,
    uomConversion: uomConversionModel
  }),
  methods: {
    dataBound: function (e) {
      const grid = kendo.jQuery("#gridServiceUOM").data("kendoGrid")
      const items = e.sender.items()
      // window.console.log(items)
      items.each(function () {
        let dataItem = grid.dataItem(this);
        $("tr[data-uid='" + dataItem.uid + "']").find(".isSystem").each(function () {
          if (dataItem.isSystem === 0) {
            $(this).removeClass('k-state-disabled')
          }
        })
      })
    },
    close() {
      // window.history.go(-1)
      this.dialogm2 = false
    },
    newClick() {
      // this.uom = this.uoms.filter(item => {
      //     return item.category.id === this.service.uom.category.id
      // })
      this.uomConversion = {}
      this.mUOM = {}
    },
    onUOMChanged() {
      this.uom = this.uoms.filter(item => {
        return item.category.id === this.baseUOM.category.id && item.id !== this.baseUOM.id
      })
    },
    async loadUOM() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          if (this.service) {
            if (this.service.hasOwnProperty('uom')) {
              uomHandler.get().then(res => {
                this.uoms = res
                this.showLoading = true
                this.uom = this.uoms.filter(item => {
                  this.showLoading = false
                  return item.category.id === this.baseUOM.category.id && item.id !== this.baseUOM.id
                })
              })
            }
          }
        }, 300)
      })
    },
    async loadUOMServiceConversion() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          if (this.service) {
            // window.console.log(this.product)
            if (this.service.hasOwnProperty('uom')) {
              uomServiceConversionHandler.get(this.serviceId).then(res => {
                this.uomServiceConversion = res
              })
            }
          }
        }, 300)
      })
    },
    async goEdit(e) {
      e.preventDefault();
      let grid = kendo.jQuery("#gridServiceUOM").data("kendoGrid");
      let dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
      this.uomConversion = dataItem
      this.mUOM = dataItem.toUOM
      this.dialogm2 = true
      window.console.log(dataItem, 'val')
    },
    async onSaveClose() {
      // if (!this.$refs.form.validate()) {
      //   this.$refs.form.validate()
      //   return
      // }
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          let data = {
            "id": this.uomConversion.id,
            "serviceId": this.serviceId,
            "fromUOM": this.baseUOM,
            "toUOM": this.mUOM,
            "rate": this.uomConversion.rate,
            "skip": this.uomServiceConversion.length > 0
          }
          this.showLoading = true
          uomServiceConversionHandler.create(this.serviceId, data).then(response => {
            if (response.data.statusCode === 201) {
              this.showLoading = false
              let res = response.data.data
              const index = this.uomServiceConversion.findIndex(item => {
                return (res.id === item.id)
              })
              if (index < 0) {
                this.uomServiceConversion.push(res)
              } else {
                this.uomServiceConversion.splice(index, 1, res)
              }
              // this.uomServiceConversion.push(response.data.data)
              this.$snotify.success('Success')
              this.close()
            }
          }).catch(e => {
            this.$snotify.error('Something went wrong')
            this.showLoading = false
            this.errors.push(e)
          })
        }, 50);
      })
    },
  },
  watch: {
    service() {
      if (this.service !== undefined) {
        this.showLoading = true
        this.loadUOMServiceConversion()
        this.showLoading = false
      }
    },
    // '$route': 'loadUOMConversion'
  },
  mounted: async function () {
    await this.loadUOM()
    await this.loadUOMServiceConversion()
  },
  computed: {
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
          return {}
        }
      } else {
        return {}
      }
    },
    serviceId() {
      if (this.service) {
        if (this.service.hasOwnProperty('id')) {
          return this.service.id
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    conversionUOM() {
      if (this.mUOM) {
        return '1 ' + this.mUOM.name + ' = ' + (1 / this.uomConversion.rate) + ' ' + this.baseUOMName
      } else {
        return ''
      }
    }
  },
}
</script>
