<template>
  <v-row>
    <v-col sm="12" cols="12" class="pt-0">
      <v-card color="white" class="pl-2 no_border" elevation="0">
        <!--                <h2 class="mb-0">{{ $t('services_sale_transactions') }}</h2>-->
        <v-row>
          <v-col sm="9" cols="12" class="py-0">
            <app-searchdate :initStartDate="startDate" @emitStartDate="startDate = $event"
                            :initEndDate="endDate" @emitEndDate="endDate = $event"/>
          </v-col>

          <v-col sm="1" cols="12" class="py-0 mt-1">
            <v-btn class="btn_search" style="background-color: rgb(237, 241, 245)" @click="searchTransaction">
              <i class="b-search" style="font-size: 18px; color:#fff !important;"/>
            </v-btn>
          </v-col>

        </v-row>
        <v-row>
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
                    :field="'exchangePrice'"
                    :title="$t('price')"
                    :template="'<span>#=kendo.toString(exchangePrice, decimalFormat)#</span>'"
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
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import SearchDateComponent from "@/components/custom_templates/SearchDate";
import LinkTemplate from "@/components/kendo_templates/LinkTemplate";

const billingHandler = require("@/scripts/invoice/handler/billingHandler")
export default {
  name: "ServiceTransactions",
  props: {
    service: {}
  },
  computed: {
    id() {
      if (this.service) {
        return this.service.id
      } else {
        return ''
      }
    }
  },
  components: {
    LoadingMe: () => import(`@/components/Loading`),
    'app-searchdate': SearchDateComponent,
  },
  data: () => ({
    showLoading: false,
    mDateSorter: 'Today',
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    dateSorters: ['Today', 'This Week', 'This Month', 'This Year'],
    group: {field: 'type'},
    isLoaded: false,
    inventoryList: []
  }),
  methods: {
    async onloadTransction() {
      if (this.id !== '') {
        billingHandler.txnItem(this.id).then(res => {
          this.transctions = res.data.data
        })
      }
    },
    async searchTransaction() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          this.showLoading = true
          const startDate = this.startDate
          const endDate = this.endDate
          let strFilter = '?start=' + startDate + '&end=' + endDate + '&item=0'
          if (this.id !== undefined || this.id !== null) {
            strFilter = '?start=' + startDate + '&end=' + endDate + '&id=' + this.id + '&item=0'
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
  },
  async mounted() {
    await this.searchTransaction()
  },
  watch: {
    'id': 'searchTransaction'
  },
};
</script>
<style scoped>
</style>
