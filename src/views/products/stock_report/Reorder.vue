<template>
  <v-row>
    <v-col sm="12" cols="12" class="grayBg px-6">
      <v-card color="white" class="pa-3 no_border" elevation="0">
        <v-row>
          <v-col sm="7" cols="12" class="pt-0">
            <h2 class="mb-0 font_20">{{ $t('inventory_to_be_reordered') }}</h2>
          </v-col>
          <v-col class="paddingTopB" sm="4" cols="12">
            <app-datepicker :initialDate="asOf"
                            @emitDate="asOf = $event"/>
          </v-col>
          <v-col sm="1" cols="12" class="pt-4 pl-0 paddingTopB">
            <v-btn color="primary white--text text-capitalize" @click="searchTransaction">
              <i class="b-search" style="font-size: 18px; color:#fff !important;"/>
            </v-btn>
          </v-col>
          <!-- <v-col sm="2" cols="12" class="py-0">
            <v-row>
              <v-col sm="12" cols="12" class="pt-4">
                <v-btn icon color="black" class="bg-none float-right ">
                  <v-icon class="font_34">fa fa-file-excel</v-icon>
                </v-btn>

                <v-btn icon color="black" class="bg-none float-right ml-2">
                  <v-icon class="font_34">fa fa-print</v-icon>
                </v-btn>
              </v-col>
            </v-row>

          </v-col> -->
        </v-row>
        <v-row>
          <v-col sm="12" cols="12" class="py-0">
            <template>
              <LoadingMe
                  :isLoading="showLoading"
                  :fullPage="false"
                  type="loading"
                  :myLoading="true">

              </LoadingMe>
              <kendo-datasource ref="dataSource"
                                :data="receivableList"
              />
              <kendo-grid id="gridReceivable" class="grid-function"
                          :data-source-ref="'dataSource'"
                          :sortable="false"
                          :filterable="false"
                          :column-menu="true"
                          :editable="false"
                          :style="{width: '100%'}"
                          :noRecords="true"
                          :scrollable-virtual="true"
              >
                <kendo-grid-column
                    :field="'name'"
                    :attributes="{class:'tb_name_td'}"
                    :title="$t('name')"
                    :template="'<span>#=name#</span>'"
                    :width="200"
                    :headerAttributes="{
                                                        style: 'background-color: #EDF1F5'
                                                    }"/>
                <kendo-grid-column
                    :field="'buom'"
                    :title="$t('base_uom')"
                    :width="150"
                    :template="'<span>#=buom.name || ``#</span>'"
                    :headerAttributes="{
                                                        style: 'background-color: #EDF1F5'
                                                    }"/>
                <kendo-grid-column
                    :field="'committedStock'"
                    :title="$t('committed')"
                    :width="150"
                    :attributes="{style: 'text-align: right; '}"
                    :template="'<span>#=kendo.toString(committedStock, decimalFormat)#</span>'"
                    :headerAttributes="{
                                                        style: 'background-color: #EDF1F5'
                                                    }"/>
                <!--                <kendo-grid-column-->
                <!--                    :field="'po'"-->
                <!--                    :title="$t('on_po')"-->
                <!--                    :width="150"-->
                <!--                    :attributes="{style: 'text-align: right; '}"-->
                <!--                    :template="'<span>#=kendo.toString(po, decimalFormat)#</span>'"-->
                <!--                    :headerAttributes="{-->
                <!--                                                        style: 'background-color: #EDF1F5'-->
                <!--                                                    }"/>-->
                <!--                <kendo-grid-column-->
                <!--                    :field="'so'"-->
                <!--                    :title="$t('on_so')"-->
                <!--                    :width="150"-->
                <!--                    :attributes="{style: 'text-align: right; '}"-->
                <!--                    :template="'<span>#=kendo.toString(so, decimalFormat)#</span>'"-->
                <!--                    :headerAttributes="{-->
                <!--                                                        style: 'background-color: #EDF1F5'-->
                <!--                                                    }"/>-->
                <kendo-grid-column
                    :field="'reOrderQty'"
                    :title="$t('reorder_qty')"
                    :width="150"
                    :attributes="{style: 'text-align: right; '}"
                    :template="'<span>#=kendo.toString(reOrderQty, decimalFormat)#</span>'"
                    :headerAttributes="{
                                                        style: 'background-color: #EDF1F5'
                                                    }"/>
                <kendo-grid-column
                    :field="'qoh'"
                    :title="$t('qoh')"
                    :width="150"
                    :attributes="{style: 'text-align: right; '}"
                    :template="'<span>#=kendo.toString(qoh, decimalFormat)#</span>'"
                    :headerAttributes="{
                                                        style: 'background-color: #EDF1F5'
                                                    }"/>
                <kendo-grid-column
                    :field="'wac'"
                    :title="$t('wac')"
                    :width="150"
                    :attributes="{style: 'text-align: right; '}"
                    :template="'<span>#=kendo.toString(wac, decimalFormat)#</span>'"
                    :headerAttributes="{
                                                        style: 'background-color: #EDF1F5'
                                                    }"/>
                <kendo-grid-column
                    :field="'bValue'"
                    :title="$t('value')"
                    :width="150"
                    :attributes="{style: 'text-align: right; '}"
                    :template="'<span>#=kendo.toString(bValue, decimalFormat)#</span>'"
                    :headerAttributes="{
                                                        style: 'background-color: #EDF1F5'
                                                    }"/>

              </kendo-grid>
            </template>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import DatePickerComponent from '@/components/custom_templates/DatePickerComponent'

const billingHandler = require("@/scripts/invoice/handler/billingHandler")

export default {
  data: () => ({
    asOf: new Date().toISOString().substr(0, 10),
    showLoading: false,
    group: {field: 'name'},
    receivableList: []
  }),
  components: {
    LoadingMe: () => import(`@/components/Loading`),
    'app-datepicker': DatePickerComponent
  },
  methods: {
    async searchTransaction() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          this.showLoading = true
          const startDate = this.asOf
          let strFilter = '?asOf=' + startDate + '&reOrder=true'
          billingHandler.inventoryBalance(strFilter).then(res => {
            if (res.data.statusCode === 200) {
              this.receivableList = res.data.data
            }
            this.showLoading = false
          })

        }, 10)
      })
    },
    status(dataItem) {
      let status = ''
      switch (dataItem.status) {
        case 1:
          status = 'Open'
          break
        case 2:
          status = 'Partially Paid'
          break
        case 3:
          status = 'Paid'
          break
        case 4:
          status = 'Void'
          break
      }
      return status
    },
  },
  computed: {},
  mounted: async function () {
    // await this.searchTransaction()
  }
};
</script>
<style scoped>
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

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: transparent !important;
}

@media (max-width: 576px) {
  .paddingTopB {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}
</style>