<template>
  <v-row>
    <v-col sm="12" cols="12" class="py-0">
      <v-row class="">
        <v-col sm="4" cols="12" class="py-0">
          <v-select class="mt-1"
                    :items="dateSorters"
                    v-model="mDateSorter"
                    @change="onSorterChanges"
                    clearable
                    outlined
                    placeholder="ALL"
          />
        </v-col>
        <v-col sm="3" cols="12" class="py-0">
          <app-datepicker :initialDate="startDate" @emitDate="startDate = $event"/>
        </v-col>
        <v-col sm="3" cols="12" class="py-0">
          <app-datepicker :initialDate="endDate" @emitDate="endDate = $event"/>
        </v-col>
        <v-col sm="1" cols="1" class="pt-1">
          <v-btn
              class="btn_search" @click="searchTransaction"
              style="background-color: rgb(237, 241, 245)"
          >
            <i class="b-search" style="font-size: 18px; color:#fff !important;"/>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-col sm="12" cols="12">
      <template>
        <LoadingMe
            :isLoading="showLoading"
            :fullPage="false"
            type="loading"
            :myLoading="true">

        </LoadingMe>
        <kendo-datasource ref="productTxnDS"
                          :group="group"
                          :data="inventoryList"/>
        <kendo-grid id="gridProductTXN" class="grid-function"
                    :data-source-ref="'productTxnDS'"
                    :sortable="false"
                    :groupable="true"
                    :filterable="false"
                    :column-menu="true"
                    :editable="false"
                    :style="{width: '100%'}"
                    :noRecords="true"
                    :scrollable-virtual="true"
        >
          <kendo-grid-column
              :field="'type'"
              :title="$t('type')"
              :template="'<span>#=type#</span>'"
              :width="150"
              :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
          <kendo-grid-column
              :field="'txnDate'"
              :title="$t('date')"
              :template="'<span>#=kendo.toString(new Date(txnDate), dateFormat)#</span>'"
              :width="150"
              :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
          <kendo-grid-column
              :field="'name'"
              :title="$t('supplier')"
              :template="'<span>#=name#</span>'"
              :width="200"
              :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
          <kendo-grid-column
              :field="'txnNumber'"
              :title="$t('reference_no')"
              :template="referenceTemplate"
              :width="200"
              :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>

          <kendo-grid-column
              :field="'uom'"
              :title="$t('txn_uom')"
              :template="'<span>#=uom.uom.name || ``#</span>'"
              :width="150"
              :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
          <kendo-grid-column
              :field="'qty'"
              :title="$t('qty')"
              :template="'<span>#=kendo.toString(qty, decimalFormat)#</span>'"
              :width="100"
              :attributes="{style: 'text-align: right'}"
              :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
          <kendo-grid-column
              :field="'exchangeCost'"
              :title="$t('cost')"
              :template="'<span>#=kendo.toString(exchangeCost, decimalFormat)#</span>'"
              :width="100"
              :attributes="{style: 'text-align: right'}"
              :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
          <kendo-grid-column
              :field="'additionalCost'"
              :title="$t('addlc')"
              :template="'<span>#=kendo.toString(additionalCost, decimalFormat)#</span>'"
              :width="180"
              :hidden="true"
              :attributes="{style: 'text-align: right'}"
              :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
          <kendo-grid-column
              :field="'exchangeAmount'"
              :title="$t('amount')"
              :template="'<span>#=kendo.toString(exchangeAmount, decimalFormat)#</span>'"
              :width="180"
              :attributes="{style: 'text-align: right'}"
              :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>

        </kendo-grid>
      </template>
    </v-col>
  </v-row>
</template>
<script>
import DatePickerComponent from "@/components/custom_templates/DatePickerComponent";
import kendo from "@progress/kendo-ui";
import LinkTemplate from "@/components/kendo_templates/LinkTemplate";

const billingHandler = require("@/scripts/invoice/handler/billingHandler")

export default {
  name: "ProductTXN",
  props: {
    item: {}
  },
  components: {
    LoadingMe: () => import(`@/components/Loading`),
    "app-datepicker": DatePickerComponent,
  },
  watch: {
    item() {
      if (this.item !== undefined) {
        this.showLoading = true
        this.searchTransaction()
        this.showLoading = false
      }
    },
  },
  computed: {
    id() {
      if (this.item) {
        return this.item.id
      } else {
        return ''
      }
    }
  },
  data: () => ({
    showLoading: false,
    mDateSorter: 'Today',
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    dateSorters: ['Today', 'This Week', 'This Month', 'This Year'],
    group: {field: 'itemName'},
    isLoaded: false,
    inventoryList: []
  }),
  methods: {
    onSorterChanges(val) {
      let today = new Date()
      switch (val) {
        case "Today":
          this.startDate = kendo.toString(today, 'yyyy-MM-dd')
          this.endDate = kendo.toString(today, 'yyyy-MM-dd')

          break
        case "This Week":
          var first = today.getDate() - today.getDay(),
              last = first + 6

          this.startDate = kendo.toString(new Date(today.setDate(first)), 'yyyy-MM-dd')
          this.endDate = kendo.toString(new Date(today.setDate(last)), 'yyyy-MM-dd')

          break
        case "This Month":
          this.startDate = kendo.toString(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd')
          this.endDate = kendo.toString(new Date(today.getFullYear(), today.getMonth(), 31), 'yyyy-MM-dd')

          break
        case "This Year":
          this.startDate = kendo.toString(new Date(today.getFullYear(), 0, 1), 'yyyy-MM-dd')
          this.endDate = kendo.toString(new Date(today.getFullYear(), 11, 31), 'yyyy-MM-dd')

          break
        default:
          this.startDate = ""
          this.endDate = ""
      }
    },
    async searchTransaction() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          this.showLoading = true
          const startDate = this.startDate
          const endDate = this.endDate
          let strFilter = '?start=' + startDate + '&end=' + endDate + '&item=1'
          if (this.id !== undefined || this.id !== null) {
            strFilter = '?start=' + startDate + '&end=' + endDate + '&id=' + this.id + '&item=1'
          }
          billingHandler.inventoryListByFunction(strFilter).then(res => {
            if (res.data.statusCode === 200) {
              this.inventoryList = res.data.data
            }
            this.showLoading = false
          })

        }, 10)
      })
    },
    referenceTemplate(data) {
      let url = `#`
      if (data.type === 'Invoice') {
        url = `invoice_view/${data.id}`
      } else if (data.type === 'Sale Quote') {
        url = `sale_quote_view/${data.id}`
      } else if (data.type === 'Delayed Invoice') {
        url = `delayed_invoice_view/${data.id}`
      } else if (data.type === 'Sale Order') {
        url = `sale_order_view/${data.id}`
      } else if (data.type === 'Purchase Order') {
        url = `purchase_order_view/${data.id}`
      } else if (data.type === 'Credit Memo') {
        url = `credit_memo_view/${data.id}`
      } else if (data.type === 'Debit Memo') {
        url = `debit_memo_view/${data.id}`
      } else if (data.type === 'Inventory Adjustment') {
        url = `inventory_adjustment_view/${data.id}`
      } else if (data.type === 'Purchase') {
        url = `credit_purchase_view/${data.id}`
      } else if (data.type === 'Production Order') {
        url = `production_order_view/${data.id}`
      } else if (data.type === 'Production') {
        url = `production/${data.id}`
      }

      let args = {
        text: data.txnNumber,
        url: url,
        data: data,
      }
      return {
        template: LinkTemplate,
        templateArgs: args
      }
    },
  }
};
</script>
<style scoped>
</style>