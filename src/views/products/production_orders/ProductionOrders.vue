<template>
  <v-row class="">
    <v-col sm="12" cols="12" class="pt-3">
      <!-- <v-card color="white" class="pa-3 no_border" elevation="0"> -->
      <v-row>
        <!-- <v-col sm="9" cols="12" class="py-0">
          <h2 class="mb-0 font_20">{{ $t('production_orders') }}</h2>
        </v-col> -->
        <!-- <v-col sm="3" cols="12" class="py-0">
          <router-link routes link to="production_order" style="text-decoration: none;">
            <v-btn color="primary" class="rounded-pill white--text float-right text-capitalize">
              {{ $t('new_production_order') }}
            </v-btn>
          </router-link>
        </v-col> -->
      </v-row>
      <v-row class="mt-0">
            <v-col sm="10" cols="12" class="py-0">
              <app-searchdate :initStartDate="startDate" @emitStartDate="startDate = $event"
                              :initEndDate="endDate" @emitEndDate="endDate = $event"/>

            </v-col>
            <v-col sm="1" cols="2" class="pt-1" @click="onloadProductionOrder">
              <v-btn class="btn_search" style="background-color: rgb(237, 241, 245)">
                <i class="b-search" style="font-size: 18px; color:#fff !important;"/>
              </v-btn>
            </v-col>
      </v-row>

      <v-row class="">
        <v-col sm="12" cols="12" class="py-0">
          <!-- <template>
              <v-simple-table class="attachment_table">
                  <template v-slot:default>
                      <thead>
                          <tr>
                              <th>{{$t('num')}} </th>
                              <th>{{$t('product')}} </th>
                              <th>{{$t('sku')}} </th>
                              <th>{{$t('order_qty')}} </th>
                              <th>{{$t('status')}} </th>
                              <th>{{$t('action')}} </th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>01</td>
                              <td>JB00009</td>
                              <td>15/July/2020</td>
                              <td>VARIANCE</td>
                              <td>15/July/2020</td>
                              <td>
                                  <v-btn class="third rounded-0 white--text">
                                      {{$t('view')}}
                                  </v-btn>
                              </td>
                          </tr>
                      </tbody>
                  </template>
              </v-simple-table>
          </template> -->
          <kendo-datasource ref="dataSource" :data="productionOrders"/>
          <kendo-grid id="gridProductionOrder" class="grid-function" :data-source-ref="'dataSource'"
                      :sortable="false"
                      :noRecords="true"
                      :filterable="false" :column-menu="true" :editable="false"
                      :scrollable-virtual="true">
            <kendo-grid-column :template="referenceTemplateOD" :field="'number'" :title="$t('num')"
                               :width="100" :column-menu="'false'"
                               :headerAttributes="{
                                        style: 'background-color: #EDF1F5;',
                                        class: 'text-variants'
                                    }" :attributes="{
                                        style: 'text-align: variants'
                                    }"/>
            <kendo-grid-column :field="'product'" :title="$t('product')" :width="130"
                               :template="'<span>#=product.name#</span>'" :headerAttributes="{
                                        style: 'background-color: #EDF1F5'
                                    }"/>
            <kendo-grid-column :field="'product'" :template="'<span>#=product.sku#</span>'"
                               :title="$t('sku')" :width="100" :headerAttributes="{
                                        style: 'background-color: #EDF1F5'
                                    }"/>
            <kendo-grid-column :field="'dueDate'"
                               :template="'<span>#=new Date(dueDate).toISOString().substr(0, 10)#</span>'"
                               :title="$t('due_date')" :width="120" :headerAttributes="{
                                        style: 'background-color: #EDF1F5'
                                    }"/>
            <kendo-grid-column :field="'qty'" :title="$t('order_qty')" :format="'{0:n}'" :width="120"
                               :headerAttributes="{
                                            style: 'text-align: right; background-color: #EDF1F5'
                                        }" :attributes="{
                                            style: 'text-align: right'
                                        }"/>
            <kendo-grid-column :field="'status'" :template="statusTemplate" :title="$t('status')"
                               :format="'{0:n}'" :width="110"
                               :headerAttributes="{
                                            style: 'text-align: right; background-color: #EDF1F5'
                                        }" :attributes="{
                                            style: 'text-align: right'
                                        }"/>

            <!--                        <kendo-grid-column :field="'action'" :title="$t('action')" :format="'{0:n}'" :width="110"-->
            <!--                                           :headerAttributes="{-->
            <!--                                        style: 'text-align: right; background-color: #EDF1F5'-->
            <!--                                    }" :attributes="{-->
            <!--                                        style: 'text-align: right'-->
            <!--                                    }"/>-->
            <!--                        <kendo-grid-column :field="'product'" :template="'<span>#=product.yieldQTY#</span>'" :title="$t('yield_qty')" :format="'{0:n}'" :width="120"-->
            <!--                                           :headerAttributes="{-->
            <!--                                style: 'text-align: right; background-color: #EDF1F5'-->
            <!--                            }" :attributes="{-->
            <!--                                style: 'text-align: right'-->
            <!--                            }"/>-->
            <!--                        <kendo-grid-column :field="'started_at'" :title="$t('started_at')" :format="'{0:n}'"-->
            <!--                                           :width="150" :headerAttributes="{-->
            <!--                                style: 'text-align: right; background-color: #EDF1F5'-->
            <!--                            }" :attributes="{-->
            <!--                                style: 'text-align: right'-->
            <!--                            }"/>-->
            <!--                        <kendo-grid-column :field="'completed_at'" :title="$t('completed_at')" :format="'{0:n}'"-->
            <!--                                           :width="150" :headerAttributes="{-->
            <!--                                style: 'text-align: right; background-color: #EDF1F5'-->
            <!--                            }" :attributes="{-->
            <!--                                style: 'text-align: right'-->
            <!--                            }"/>-->
            <kendo-grid-column :template="referenceTemplateBOM" :field="'bom'" :hidden="true"
                               :title="$t('bom')" :width="150"
                               :headerAttributes="{
                                    style: 'text-align: right; background-color: #EDF1F5'
                                }" :attributes="{
                                    style: 'text-align: right'
                                }"/>

<!--            <kendo-grid-column-->
<!--                :command="{ text: 'Start', click: startProductionOrder , class: 'btn-plus' }"-->
<!--                :attributes="{-->
<!--                                    style: 'text-align: right'-->
<!--                                }"-->
<!--                :title="'Action'" :width="100" :headerAttributes="{-->
<!--                                        style: 'text-align: right; background-color: #EDF1F5'-->
<!--                                    }"/>-->

          </kendo-grid>
        </v-col>
      </v-row>
      <LoadingMe
          :isLoading="showLoading"
          :fullPage="false"
          :myLoading="true"
          type="loading"
      />
      <!-- </v-card> -->
    </v-col>
  </v-row>
</template>

<script>
import LinkTemplate from "@/components/kendo_templates/LinkTemplate";
import kendo from "@progress/kendo-ui";

const productionOrderHandler = require("@/scripts/productionOrderHandler")
const $ = require("jquery")
export default {
  data: () => ({
    showLoading: false,
    mDateSorter: 'Today',
    startDate: '',
    endDate: '',
    dateSorters: ['Today', 'This Week', 'This Month', 'This Year'],
    productionOrders: [],
    productionOrder: {},
  }),
  props: ['dataPO'],
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
    referenceTemplateOD(data) {
      let url = `production_order_view/${data.id}`
      let args = {
        text: data.number,
        url: url,
        data: data,
      }
      return {
        template: LinkTemplate,
        templateArgs: args
      }
    },
    referenceTemplateBOM(data) {
      const bom = data.bom
      let url = `bom_view/${bom.id}`
      let args = {
        text: bom.id,
        url: url,
        data: bom,
      }
      return {
        template: LinkTemplate,
        templateArgs: args
      }
    },
    statusTemplate(dataItem) {
      const status = dataItem.status
      if (status) {
        return `<span>${status == 1 ? 'Pre-Production' : status == 2 ? 'In Production' : status == 3 ? 'Complete' : ''}</span>`
      } else {
        return ``
      }
    },
    async onloadProductionOrder() {
      this.showLoading = true
      let strFilter = ''
      if (this.startDate !== '' && this.endDate !== '') {
        strFilter = '?start=' + this.startDate + '&end=' + this.endDate
      }
      await productionOrderHandler.getAll(strFilter).then(res => {
        this.productionOrders = res
        this.showLoading = false
      })
    },
    async startProductionOrder(e) {
      e.preventDefault()
      let grid = kendo.jQuery("#gridProductionOrder").data("kendoGrid")
      let dataItem = grid.dataItem($(e.currentTarget).closest("tr"))
      this.productionOrder = dataItem
      await this.$router.push({
        name: 'View Production Order',
        path: 'production_order_view',
        params: {id: this.productionOrder.id, productionOrder: this.productionOrder}
      })
    },
    rowNumber(dataItem) {
      let ds = this.$refs.dataSource.kendoWidget(),
          index = ds.indexOf(dataItem);
      return index + 1;
    },
    // onUpdate() {
    //     if (Object.keys(this.poData).length !== 0 && this.poData.constructor === Object) {
    //         this.productionOrders.push(this.poData)
    //     }
    // }
  },
  // watch: {'poData': 'onUpdate'},
  async mounted() {
    await this.onloadProductionOrder()
  },
  async activated() {
    await this.onloadProductionOrder()
  },
  computed: {
    poData() {
      if (this.dataPO) {
        return this.dataPO
      } else {
        return {}
      }
    }
  },
  components: {
    'app-searchdate': () => import('@/components/custom_templates/SearchDate'),
    LoadingMe: () => import("@/components/Loading")
  },
};
</script>

<style scoped>
.function_footer {
  padding: 15px;
  display: inline-block;
}

p {
  color: rgba(0, 0, 0, 0.87);
}

.actionBtn {
  height: 47.2px !important;
}

.text_tip {
  font-size: 9px;
  line-height: 10px;
}

@media (max-width: 576px) {
}
</style>
