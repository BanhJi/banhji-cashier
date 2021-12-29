<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col sm="12" cols="12" class="pr-5">
          <div class="function_wrapper">
            <div class="function_header">
              <h2 class="mb-0">{{$t('functional_currency')}}</h2>
              <v-icon
                  onclick="window.history.go(-1); return false;"
                  style="cursor: pointer; color: #333; font-size: 40px;"
                  class="float-right"
              >close
              </v-icon>
            </div>
            <v-row>
              <v-col sm="12" cols="12" class="py-0">
                <template>
                  <v-dialog v-model="dialog1" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="btn_create_new" v-bind="attrs" @click="btnFUNCNew"
                             v-on="on">
                        <v-icon size="15" class="ma-1 mr-2">mdi-plus</v-icon>
                        {{$t('new')}}
                      </v-btn>
                    </template>

                    <v-card>
                      <v-card-title>Functional Currency</v-card-title>
                      <v-icon class="btn_close" @click="dialog1 = false">
                        close
                      </v-icon>
                      <v-divider/>
                      <v-card-text
                          style="height: 120px; background-color: #EDF1F5; color: #333;">
                        <v-row>
                          <v-col sm="12" cols="12" class="">
                            <label class="label">{{$t('enable_new_currency')}}</label>
                            <p class="text_tip">{{$t('pls_sl_curreny_record')}}</p>
                            <v-select class=""
                                      :items="currencies"
                                      v-model="currency"
                                      @change="onChanged"
                                      item-value="code"
                                      return-object
                                      :item-text="item =>`${item.code} - ${item.name}`"
                                      outlined>
                            </v-select>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-divider/>
                      <v-card-actions class="function_footer">
                        <v-btn class="btn_cancel float-left"
                               @click="dialog1 = false">{{$t('close')}}
                        </v-btn>
                        <v-btn class="btn_save_close float-right" @click="onSaveClose" :disabled='isDisabled'>Save &
                          {{$t('close')}}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </template>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" cols="12">
                <template>
                  <v-simple-table class="exchange-table" height="500px">
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th class="">{{$t('date')}}</th>
                        <th class="text-right">{{$t('code')}}</th>
                        <th class="">{{$t('currency')}}</th>
                        <th class="text-center">{{$t('symbol')}}</th>
                        <th class="text-center">{{$t('native_symbol')}}</th>
                        <th class="text-center">{{$t('last_rate')}}</th>
                        <th class="text-center">{{$t('action')}}</th>
                        <th/>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="item in functionalXchangeRate" :key="item.sk">
                        <td class="text-center">{{
                            new Date(item.createdAt).toLocaleString('en-US', {
                              timeZone: timezone
                            })
                          }}
                        </td>
                        <td class="text-right">{{ item.code }}</td>
                        <td>{{ item.name }}</td>
                        <td class="text-center">{{ item.symbol }}</td>
                        <td class="text-center">{{ item.symbolNative }}</td>
                        <td class="text-center">{{ item.rate }}</td>
                        <td>
                          <v-btn width="100%" color="primary" class="rounded-0" @click="onRowClick(item)">
                            <span class="text-capitalize text-bold text-white">{{$t('edit')}}</span>
                          </v-btn>
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                  <LoadingMe
                      :isLoading="completedLoading"
                      :fullPage="isFullPage"
                      :myLoading="true"/>
                </template>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import apiUrl from '../../../apiUrl'
import LoadingMe from '@/components/Loading'

const store = require("../../../institute.js")
const axios = require('axios')

export default {
  name: "",
  components: {LoadingMe},
  data: () => ({
    myDate: '',
    dialog: false,
    dialog1: false,
    dialog3: false,
    menuJDate: false,
    completedLoading: true,
    isFullPage: false,
    isDisabled: false,
    currency: '',
    funcSK: '',
    timezone: store.default.state.institute.timezone,
    txn_date: new Date().toISOString().substr(0, 10),
    currencies: [],
    functionalXchangeRate: []
  }),
  methods: {
    async loadCurrencies() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          axios.get(apiUrl.currencies)
              .then(res => {
                //eslint-disable-next-line no-console
                this.currencies = Object.values(res.data)
              })
        }, 500);
      })
    },
    async onChanged() {
      window.console.log("item select", this.currency)
    },
    async btnFUNCNew() {
      this.funcSK = ''
    },
    async loadFunctionalXchangeRate() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          axios.get(apiUrl.xchange_get + 'fnc')
              .then(res => {
                //eslint-disable-next-line no-console
                console.log(res.data.data)
                this.functionalXchangeRate = res.data.data
                this.completedLoading = false
              })
        }, 500);
      })
    },
    async onSaveClose() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          this.isDisabled = true
          //eslint-disable-next-line no-console
          let strUrl = apiUrl.xchange_post
          let method = 'post'
          let rate = 1
          let symbolNative = ' '
          // console.log(this.currency)
          if (this.funcSK !== '') {
            strUrl = apiUrl.xchange_post + "/update/" + this.funcSK
            method = 'put'
            rate = this.currency.rate ? this.currency.rate : 1
            symbolNative = this.currency.symbolNative ? this.currency.symbolNative : this.currency.symbol_native
          } else {
            symbolNative = this.currency.symbol_native
          }
          axios({
            method: method,
            url: strUrl,
            data: {
              "type": "fnc",
              "code": this.currency.code,
              "name": this.currency.name,
              "symbol": this.currency.symbol,
              "symbolNative": symbolNative,
              "reportingPeriod": ' ',
              "rate": rate,
              "method": "Manual",
              "source": "",
              "recordDate": ""
            }
          }).then(response => {
            // eslint-disable-next-line no-console
            console.log(response)
            this.dialog1 = false
            this.isDisabled = false
            this.completedLoading = true
            this.loadFunctionalXchangeRate()
            // this.loadAccountPrefixes()
          }).catch(e => {
            this.errors.push(e)
          })
        }, 200);
      })
    },
    async onRowClick(row) {
      window.console.log("Row click", row.sk)
      this.funcSK = row.sk
      let filter = this.functionalXchangeRate.filter(
          m => m.code === row.code
      )
      if (filter) {
        this.currency = filter[0]
      }
      this.dialog1 = true
    },
  },
  mounted: async function () {
    await this.loadCurrencies()
    await this.loadFunctionalXchangeRate()
  }
};
</script>
<style scoped>
.wrapper-content .block-green {
  background-color: #2CA01C;
  padding: 10px;
  min-height: 50px;
  justify-content: center;
  display: flex;
  align-items: center;
  border: none !important;
  border-radius: 0 !important;
}

.wrapper-content .block-green p {
  color: #fff;
  text-transform: uppercase;
  font-family: "Krasar-Bold", serif !important;
}

.tab_wrapper {
  position: relative;
  display: inherit;
}


.theme--light.v-tabs >>> .v-tabs-bar {
  border-bottom: 1px solid #ddd !important;
}

.v-card__text {
  /*padding: 15px !important;*/
}

.v-card__actions .v-btn.v-btn {
  padding: 0 16px;
}

.exchange-table.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-family: 'Krasar-Bold', serif;
  color: #000 !important;
  border-top: 1px solid #000 !important;
  border-bottom: 0 !important;
  font-size: 15px !important;
}

.exchange-table.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > td {
  color: #000 !important;
  padding: 5px !important;
}

.exchange-table.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row) {
  border-top: 1px solid #000 !important;
  border-bottom: 1px solid #000 !important;
}

.exchange-table.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  height: 40px !important;
  border-bottom: 1px solid #000 !important;
}

.function_footer {
  padding: 15px;
  display: inline-block;
}

.v-select__selections {
  min-height: 30px;
}
</style>
	