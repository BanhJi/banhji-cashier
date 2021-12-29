<template>
  <v-row class="">
    <v-col sm="3" cols="12">
      <v-card outlined dense class="pa-3 no_border mb-3" height="180px" color="grayBg">
        <v-text-field class=""
                      v-model="search"
                      @change="onCustomerTypeChanged"
                      outlined
                      :placeholder="$t('search')"
                      append-icon="search"
                      clearable/>
        <v-select class=""
                  :items="customerTypes"
                  @change="onCustomerTypeChanged"
                  item-value="id"
                  item-text="name"
                  v-model="mCustomerType"
                  :placeholder="$t('customer_type')"
                  clearable
                  outlined/>
        <v-select class=""
                  :items="customerGroups"
                  @change="onCustomerTypeChanged"
                  item-value="id"
                  item-text="name"
                  v-model="mCustomerGroup"
                  :placeholder="$t('customer_group')"
                  clearable
                  outlined/>
      </v-card>
      <v-card outlined dense class="pa-3 no_border hidden-sm-and-down" color="grayBg">
        <LoadingMe
            :isLoading="showLoading"
            :fullPage="false"
            :myLoading="true"/>
        <kendo-datasource ref="customerDS"
                          :data="customers"
                          :schema="schemaDefinition"
        />

        <kendo-grid id="gridCustomer" class="grid-center"
                    :change="onChanged"
                    :data-source-ref="'customerDS'"
                    :selectable="true"
                    :persistSelection="true"
                    :noRecords="true"
                    :scrollable="true"
                    :height="535"
                    :pageable-numeric="false"
                    :pageable-previous-next="false"
                    :pageable-messages-display="'Showing {2} data items'">
          <kendo-grid-column
              :field="'name'"
              :title="'name'"
              :attributes="{class:'tb_name_td'}"
              :hidden="true"
              :group-header-template="'#=value#'"
          />
          <kendo-grid-column
              :field="'name'"
              :title="'&nbsp;'"
              :template="'<span>#=number# - #=name#</span>'"
          />
        </kendo-grid>
      </v-card>
    </v-col>
    <v-col sm="9" cols="12">
      <v-row>
        <v-col sm="6" cols="12" class="pt-0">
          <v-card outlined dense color="primary" class="pa-3 no_border" height="88px">
            <router-link
                :to="{path: routerTo, query: { type: 'edit'} }">
              <v-btn class="btn_edit float-right" @click="goEdit" :disabled="btnEnabled">
                {{ $t('edit') }}
              </v-btn>
            </router-link>

            <span>{{ customer.name }}</span><br/>
            <span>{{ customer.number }}</span><br/>
            <span>{{ customer.customerType.name }}</span>
            <!--                        <v-tooltip top>-->
            <!--                            <template v-slot:activator="{ on, attrs }">-->
            <!--                                <p class="title" color="whiteR"-->
            <!--                                   dark-->
            <!--                                   v-bind="attrs"-->
            <!--                                   v-on="on">-->
            <!--                                    <span>{{ customer.name }}</span>-->
            <!--                                </p>-->
            <!--                            </template>-->
            <!--&lt;!&ndash;                            <span>{{ customer.name }}</span>&ndash;&gt;-->
            <!--                        </v-tooltip>-->

          </v-card>

        </v-col>
        <v-col sm="6" cols="12" class="pt-0">
          <v-row>
            <v-col sm="6" cols="12" class="py-0 pl-0">
              <v-card outlined dense class="pa-2 no_border mb-2 white--text"
                      color="primary" height="40px">
                <p class="mb-0">
                  <span class="float-left text-uppercase">{{ $t('balance') }}</span>
                  <span class="float-right text-bold" v-text="forwarded"/>
                </p>
              </v-card>
              <v-card outlined dense class="pa-2 no_border white--text"
                      color="primary" height="40px">
                <p class="mb-0">
                  <span class="float-left text-uppercase">{{ $t('deposit') }}</span>
                  <span class="float-right text-bold" v-text="forwarded"/>
                </p>
              </v-card>
            </v-col>
            <v-col sm="6" cols="12" class="py-0 pl-0">
              <v-card outlined dense class="pa-2 no_border mb-2 white--text"
                      color="third" height="40px">
                <p class="mb-0">
                  <span class="float-left text-uppercase">{{ $t('open') }}</span>
                  <span class="float-right text-bold" v-text="forwarded"/>
                </p>
              </v-card>
              <v-card outlined dense class="pa-2 no_border white--text"
                      color="third" height="40px">
                <p class="mb-0">
                  <span class="float-left text-uppercase">{{ $t('over_due') }}</span>
                  <span class="float-right text-bold" v-text="forwarded"/>
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" cols="12" class="tab_txn_att">
          <v-tabs>
            <v-tab>
							<span class="hidden-sm-and-up">
								<v-icon left>mdi-pen</v-icon>
							</span>
              <span class="hidden-sm-and-down  text-upercase">
								{{ $t('transactions') }}
							</span>
            </v-tab>
            <v-tab>
							<span class="hidden-sm-and-up">
								<v-icon left>mdi-pen</v-icon>
							</span>
              <span class="hidden-sm-and-down text-upercase">
								{{ $t('communications') }}
							</span>
            </v-tab>
            <v-tab>
							<span class="hidden-sm-and-up">
								<v-icon left>mdi-pen</v-icon>
							</span>
              <span class="hidden-sm-and-down text-upercase">
								{{ $t('attachments') }}
							</span>
            </v-tab>

            <!-- Transactions -->
            <v-tab-item>
              <v-row>
                <v-col sm="12" cols="12" class="pt-0 pl-6">
                  <v-row class="grayBg">
                    <v-col sm="12" cols="12" class="">
                      <v-card outlined color="white" class="pa-3">
                        <v-row class="">
                          <v-col sm="4" cols="12" class="pt-1 pb-0">
                            <v-select class=""
                                      :items="dateSorters"
                                      clearable
                                      outlined
                                      placeholder="ALL"
                            />
                          </v-col>

                          <v-col sm="3" cols="12" class="py-0">
                            <app-datepicker :initialDate="start_date"
                                            @emitDate="start_date = $event"/>
                          </v-col>

                          <v-col sm="3" cols="12" class="py-0">
                            <app-datepicker :initialDate="end_date"
                                            @emitDate="end_date = $event"/>
                          </v-col>

                          <v-col sm="1" cols="1" class="py-0 mt-1">
                            <v-btn color="primary white--text"
                            >
                              <i class="b-search" style="font-size: 18px; color:#fff !important;"/>
                            </v-btn>
                          </v-col>
                        </v-row>

                        <v-row class="">
                          <v-col sm="12" cols="12" class="py-0">
                            <v-simple-table class="attachment_table" fixed-header
                                            height="300px">
                              <v-data-table
                                  :headers="headers"
                                  :items="journal_entries"
                                  class="elevation-1"
                              >
                                <!-- Journal Date -->
                                <template v-slot:item.journal_date="{ item }">
                                  <span>{{ dateFormat(item.journal_date) }}</span>
                                </template>

                                <!-- Journal Number as Link -->
                                <template v-slot:item.journal_number="{ item }">
                                  <router-link :to="'journal/view/' + item.id">{{
                                      item.journal_number
                                    }}
                                  </router-link>
                                </template>
                              </v-data-table>
                            </v-simple-table>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-tab-item>
            <!-- Communication -->
            <v-tab-item>
              <v-row>
                <v-col sm="12" cols="12" class="pt-0 pl-6">
                  <v-row class="grayBg">
                    <v-col sm="12" cols="12" class="">
                      <v-card outlined color="white" class="pa-3">
                        <v-row>
                          <v-col sm="12" cols="12" class="py-0">
                            <v-btn class="white--text text-capitalize float-right"
                                   color="primary" to="cash_reconciliation">
                              {{ $t('new_note') }}
                            </v-btn>
                          </v-col>

                          <v-col sm="12" cols="12" class="">
                            <template>
                              <v-simple-table class="attachment_table">
                                <template v-slot:default>
                                  <thead>
                                  <tr>
                                    <th>{{ $t('date') }}</th>
                                    <th>{{ $t('note') }}</th>
                                    <th>{{ $t('topic') }}</th>
                                    <th>{{ $t('who') }}</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  <tr>
                                    <td>01</td>
                                    <td>JB00009</td>
                                    <td>15/July/2020</td>
                                    <td>VARIANCE</td>
                                  </tr>
                                  </tbody>
                                </template>
                              </v-simple-table>
                            </template>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-tab-item>
            <!-- Attachment -->
            <v-tab-item>
              <v-row>
                <v-col sm="12" cols="12" class="pt-0 pl-6">
                  <v-row class="grayBg">
                    <v-col sm="12" cols="12" class="">
                      <v-card outlined color="white" class="pa-3">
                        <v-row class="">
                          <v-col sm="12" cols="12" class="py-0">
                            <p class="mb-2">{{ $t('file_type') }} [PDF, JPG, JPEG, TIFF,
                              PNG, GIF]</p>
                            <template>
                              <v-file-input
                                  v-model="files"
                                  :placeholder="$t('attachments')"
                                  multiple
                                  prepend-icon="mdi-paperclip">
                                <template v-slot:selection="{ text }">
                                  <v-chip
                                      small
                                      label
                                      color="primary"
                                  >
                                    {{ text }}
                                  </v-chip>
                                </template>
                              </v-file-input>
                            </template>

                            <v-simple-table class="attachment_table mb-3">
                              <template v-slot:default>
                                <thead>
                                <tr>
                                  <th>{{ $t('file_name') }}</th>
                                  <th>{{ $t('description') }}</th>
                                  <th>{{ $t('date') }}</th>
                                  <th class="text-center"/>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="item in attachments" :key="item.file">
                                  <td>{{ item.file }}</td>
                                  <td>{{ item.desc }}</td>
                                  <td>{{ item.date }}</td>
                                  <td class="text-center">
                                    <v-btn color="primary" class="mr-2 pa-0">
                                      <v-icon size="" class="ma-1">edit</v-icon>
                                    </v-btn>
                                    <v-btn color="primary" class="mr-2 pa-0">
                                      <v-icon size="" class="ma-1">delete</v-icon>
                                    </v-btn>
                                  </td>
                                </tr>
                                </tbody>
                              </template>
                            </v-simple-table>

                            <v-btn color="primary" class="text-capitalize white--text">
                              <v-icon size="15" class="mr-2">fa-check</v-icon>
                              {{ $t('save') }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-tab-item>

          </v-tabs>
        </v-col>
      </v-row>
    </v-col>

  </v-row>

</template>

<script>
import DatePickerComponent from '@/components/custom_templates/DatePickerComponent'
import CustomerModel from "@/scripts/model/Customer";
import kendo from '@progress/kendo-ui'
const customerModel = new CustomerModel({})
// const $ = require("jquery")
const customerTypeHandler = require("@/scripts/customerTypeHandler")
const customerGroupHandler = require("@/scripts/customerGroupHandler")
const customerHandler = require("@/scripts/customerHandler")

export default {
  name: "CustomerCenter",
  components: {
    LoadingMe: () => import(`@/components/Loading`),
    'app-datepicker': DatePickerComponent,
  },
  data: () => ({
    showLoading: true,
    info: {},
    customers: [],
    start_date: '',
    end_date: '',
    customerTypes: [],
    mCustomerType: {},
    dateSorters: [],
    headers: [],
    customerGroups: [],
    mCustomerGroup: {},
    journal_entries: [],
    forwarded: '',
    files: '',
    search: '',
    customer: customerModel,
    schemaDefinition: {
      model: {id: "id"}
    },
    groupDefinition: {
      field: "type",
    },
  }),
  methods: {
    goEdit() {
    },
    onCustomerTypeChanged() {
      this.showLoading = true
      this.loadCustomerCenter()
    },
    async loadCustomerGroup() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          customerGroupHandler.get().then(res => {
            this.customerGroups = res
            if (this.customerGroups.length > 0) {
              this.mCustomerGroup = this.customerGroups[0]
              this.loadCustomerCenter()
            }
          })
        }, 300)
      })
    },
    async customerInfo() {
      this.$emit('onUpdate', this.customer)
    },
    async onChanged() {
      let grid = kendo.jQuery("#gridCustomer").data("kendoGrid")
      let selectedItem = grid.dataItem(grid.select())
      this.customer = selectedItem
      this.$emit('onUpdate', selectedItem)
      // window.console.log(this.customer.name, 'selected')
    },
    async loadCustomerType() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          customerTypeHandler.get().then(res => {
            this.customerTypes = res
            if (this.customerTypes.length > 0) {
              this.mCustomerType = this.customerTypes[0]
            }
          })
        }, 300)
      })
    },
    async loadCustomerCenter() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          this.customers = []
          let groupId = undefined
          let customerTypeId = undefined
          if (this.mCustomerGroup) {
            groupId = this.mCustomerGroup.hasOwnProperty('id') ? this.mCustomerGroup.id : this.mCustomerGroup
          }
          if (this.mCustomerType) {
            customerTypeId = this.mCustomerType.hasOwnProperty('id') ? this.mCustomerType.id : this.mCustomerType
          }
          customerHandler.center(customerTypeId, groupId, this.search).then(res => {
            this.showLoading = true
            if (res.data.statusCode === 200) {
              this.showLoading = false
              this.customers = res.data.data
            }
          })
        }, 300)
      })
    },
    callback() {
      if (this.$route.params !== null && this.$route.params.hasOwnProperty('data')) {
        const customer = this.$route.params.data
        const index = this.customers.findIndex(item => {
          return (customer.id === item.id)
        })
        if (index < 0) {
          this.customers.push(customer)
        } else {
          this.customers.splice(index, 1, customer)
        }
      }
      window.console.log('im changed', this.$route.params)
    }
  },
  mounted() {
    this.loadCustomerType()
    this.loadCustomerGroup()
  },
  computed: {
    btnEnabled() {
      return !this.customer.name
    },
    routerTo() {
      if (this.customer.type === 'Individual') {
        return 'individual_customer' + `/${this.customer ? this.customer.id : ''}`
      } else if (this.customer.type === 'Company') {
        return 'company_customer' + `/${this.customer ? this.customer.id : ''}`
      }
      return ''
    }
  },
  watch: {
    '$route': 'callback'
  },
};
</script>
<style scoped>
</style>