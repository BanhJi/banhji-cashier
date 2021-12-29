<template>
  <v-row>
    <v-col sm="12" cols="12" class="pt-3">
      <!-- <v-card color="white" class="pa-3 no_border" elevation="0"> -->
      <v-row>
        <!-- <v-col sm="8" cols="12" class="py-0">
          <h2 class="mb-0 font_20">{{ $t('production') }}</h2>
        </v-col> -->
      </v-row>
      <v-row class="">
        <v-col sm="12" cols="12" class="py-0">
          <v-row class="">
            <v-col sm="10" cols="12" class="py-0">
              <app-searchdate :initStartDate="startDate" @emitStartDate="startDate = $event"
                              :initEndDate="endDate" @emitEndDate="endDate = $event"/>
            </v-col>
            <v-col sm="1" cols="1" class="pt-1">
              <v-btn class="btn_search" style="background-color: rgb(237, 241, 245)" @click="onloadProduction">
                <i class="b-search" style="font-size: 18px; color:#fff !important;"/>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <!--                <v-col sm="3" cols="12" class="py-0">-->
        <!--                    <v-btn to="production" color="primary"-->
        <!--                           class="rounded-pill white&#45;&#45;text float-right text-capitalize">-->
        <!--                        {{ $t('new_production') }}-->
        <!--                    </v-btn>-->
        <!--                </v-col>-->
      </v-row>

      <v-row class="">
        <v-col sm="12" cols="12" class="py-0">
          <kendo-datasource ref="dataSource" :data="productions"/>
          <kendo-grid id="grid" class="grid-function" :data-source-ref="'dataSource'" :sortable="false"
                      :filterable="false" :column-menu="true" :editable="false" :scrollable-virtual="true">
            <kendo-grid-column
                :template="referenceTemplatePD"
                :field="'referenceNo'"
                :title="$t('reference_no')"
                :width="180"
                :column-menu="'false'"
                :headerAttributes="{
                                        style: 'background-color: #EDF1F5;',
                                        class: 'text-variants'
                                    }"
                :attributes="{
                                        style: 'text-align: variants'
                                    }"/>
            <kendo-grid-column
                :field="'itemName'"
                :title="$t('item')"
                :width="180"
                :template="'<span>#=itemName#</span>'"
                :headerAttributes="{
                                        style: 'background-color: #EDF1F5'
                                    }"/>
            <kendo-grid-column
                :field="'sku'"
                :template="'<span>#=sku#</span>'"
                :title="$t('sku')"
                :width="100"
                :headerAttributes="{
                                        style: 'background-color: #EDF1F5'
                                    }"/>
            <kendo-grid-column
                :field="'qty'"
                :hidden="true"
                :title="$t('qty')"
                :format="'{0:n}'"
                :width="100"
                :headerAttributes="{
                                            style: 'text-align: right; background-color: #EDF1F5'
                                        }"
                :attributes="{
                                            style: 'text-align: right'
                                        }"/>
            <kendo-grid-column
                :template="UOMTemplate"
                :hidden="true"
                :field="'uom'"
                :title="$t('uom')"
                :width="110"
                :headerAttributes="{
                                            style: 'text-align: right; background-color: #EDF1F5'
                                        }"
                :attributes="{
                                            style: 'text-align: right'
                                        }"/>
            <!--            <kendo-grid-column :field="'productionOrder'"-->
            <!--                               :template="referenceTemplateOD"-->
            <!--                               :title="$t('production_order')" :width="120"-->
            <!--                               :headerAttributes="{-->
            <!--                                    style: 'text-align: right; background-color: #EDF1F5'-->
            <!--                                }" :attributes="{-->
            <!--                                    style: 'text-align: right'-->
            <!--                                }"/>-->
            <kendo-grid-column
                :field="'startedAt'"
                :template="'<span>#=new Date(startedAt).toISOString().substr(0, 10)#</span>'"
                :title="$t('started_at')"
                :width="150"
                :headerAttributes="{
                                    style: 'text-align: right; background-color: #EDF1F5'
                                }"
                :attributes="{
                                    style: 'text-align: right'
                                }"/>
            <kendo-grid-column :field="'completedAt'"
                               :template="'<span>#=new Date(completedAt).toISOString().substr(0, 10)#</span>'"
                               :title="$t('completed_at')"
                               :width="150"
                               :headerAttributes="{
                                    style: 'text-align: right; background-color: #EDF1F5'
                                }"
                               :attributes="{
                                    style: 'text-align: right'
                                }"/>
            <kendo-grid-column
                :field="'bomNo'"
                :hidden="true"
                :title="$t('bom_no')"
                :width="150"
                :headerAttributes="{
                                    style: 'text-align: right; background-color: #EDF1F5'
                                }"
                :attributes="{
                                    style: 'text-align: right'
                                }"/>
            <kendo-grid-column
                :field="'status'"
                :title="$t('status')"
                :width="150"
                :template="statusTemplate"
                :headerAttributes="{
                                    style: 'text-align: right; background-color: #EDF1F5'
                                }"
                :attributes="{
                                    style: 'text-align: right'
                                }"/>

            <!--            <kendo-grid-column-->
            <!--                :command="{ text: 'View', click: onComplete , class: 'btn-plus' }"-->
            <!--                :attributes="{-->
            <!--                                    style: 'text-align: right'-->
            <!--                                }"-->
            <!--                :title="'action'"-->
            <!--                :width="100"-->
            <!--                :headerAttributes="{-->
            <!--                                        style: 'text-align: right; background-color: #EDF1F5'-->
            <!--                                    }"/>-->

          </kendo-grid>
        </v-col>
      </v-row>
      <LoadingMe
          :isLoading="showLoading"
          :fullPage="false"
          type="loading"
          :myLoading="true"
      />
      <!-- </v-card> -->
    </v-col>
  </v-row>
</template>

<script>
import LinkTemplate from "@/components/kendo_templates/LinkTemplate";
import kendo from "@progress/kendo-ui";

const productionHandler = require("@/scripts/productionHandler")
const $ = require("jquery")
export default {
  data: () => ({
    mDateSorter: 'Today',
    startDate: '',
    endDate: '',
    dateSorters: ['Today', 'This Week', 'This Month', 'This Year'],
    showLoading: false,
    dialogM3: false,
    // LoadingMe
    isLoaded: false,
    productions: [],
    production: {}
  }),
  props: {},
  methods: {
    statusTemplate(dataItem) {
      const status = dataItem.status
      let statusText = ''
      switch (status) {
        case 1:
          statusText = 'In Production'
          break
        case 3:
          statusText = 'Completed'
          break
        default:
          break
      }
      return statusText
    },
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
    onClickLink(data) {
      this.router.push({path: `productionOrder_view/${data.productionOrder.id}`})
    },
    referenceTemplatePD(data) {
      let url = `production/${data.id}`
      let args = {
        text: data.referenceNo,
        url: url,
        data: data,
      }
      return {
        template: LinkTemplate,
        templateArgs: args
      }
    },
    referenceTemplateOD(dataItem) {
      let url = `productionOrder_view/${dataItem.productionOrder.id}`
      let args = {
        text: dataItem.productionOrder.abbr + '-' + dataItem.productionOrder.number,
        url: url,
        data: dataItem.productionOrder,
      }
      return {
        template: LinkTemplate,
        templateArgs: args
      }
    },
    async onComplete(e) {
      e.preventDefault()
      let grid = kendo.jQuery("#grid").data("kendoGrid")
      let dataItem = grid.dataItem($(e.currentTarget).closest("tr"))
      this.production = dataItem
      await this.$router.push({
        name: 'Production',
        path: 'production',
        params: {id: this.production.id, production: this.production}
      })
    },
    async onloadProduction() {
      this.showLoading = true
      let strFilter = ''
      if (this.startDate !== '' && this.endDate !== '') {
        strFilter = '?start=' + this.startDate + '&end=' + this.endDate
      }
      await productionHandler.getAll(strFilter).then(res => {
        this.productions = res
        this.showLoading = false
        window.console.log(res)
      })
    },
    UOMTemplate(dataItem) {
      const uom = dataItem.uom
      if (uom) {
        return `<span>${uom.name ? uom.name : ``}</span>`
      } else {
        return ``
      }
    },
  },
  async mounted() {
    await this.onloadProduction()
  },
  computed: {},
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
