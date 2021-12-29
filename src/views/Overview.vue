<template>
  <v-app>
    <v-container>
      <v-row class="d_centerd_b mt-4">
        <v-col  md="12"  sm="12" cols="12" class="pb-0 pt-0">
          <v-row>
            <v-col md="4" sm="6" cols="12" class="hide_form_alert py-0 pr-md-2">

              <v-card
                color="white"
                outlined
                dense
                class="pa-4  no_border"
                min-height="347"
              >
                <v-row>
                  <v-col class="py-0">
                    <h1 class="my-1" :class="{'line_34 mb-1':this.$i18n.locale=='kh'} ">{{ $t("welcome") }}</h1>
                    <p class="mb-2">{{ $t("here_is_your_business_glance") }}</p>
                    <v-card
                      outlined
                      dense
                      color="secondary"
                      class="niradei_bold px-3 white--text mb-3 no_border d-flex justify-center align-center"
                      min-height="55"
                    >
                      <v-row>
                        <h6
                          class="align-self-center text-left py-0 font_20 col-sm-12 col-md-7"
                        >
                          {{ dueThisWeekInvoice }}
                        </h6>
                        <h4
                          class="py-0 text-uppercase line_14 text-right col-sm-12 col-md-5 font_13"
                        >
                          {{ $t("due_this_week") }}
                        </h4>
                      </v-row>
                    </v-card>
                    <v-card
                      outlined
                      dense
                      color="secondary"
                      class="niradei_bold px-3 white--text mb-3 no_border d-flex justify-center align-center"
                      min-height="55"
                    >
                      <v-row>
                        <h6
                          class="align-self-center py-0 text-left font_20 col-sm-12 col-md-7"
                        >
                          {{ dueThisWeekPExpense }}
                        </h6>
                        <h4
                          class="py-0 text-uppercase col-sm-12 text-right line_14 col-md-5 font_13"
                        >
                          {{ $t("to_be_pay_this_week") }}
                        </h4>
                      </v-row>
                    </v-card>
                    <v-card
                      outlined
                      dense
                      color="third"
                      class="niradei_bold px-3 mb-3 white--text no_border d-flex justify-center align-center "
                      min-height="55"
                    >
                      <v-row>
                        <h6
                          class="align-self-center py-0 text-left font_20 col-sm-12 col-md-7"
                        >
                          {{ dayToPay }}
                        </h6>
                        <h4
                          class="py-0 text-uppercase line_14 col-sm-12 text-right col-md-5 font_13"
                        >
                          {{ $t("days_payroll") }}
                        </h4>
                      </v-row>
                    </v-card>
                    <v-card
                      outlined
                      dense
                      color="third"
                      class="niradei_bold px-3 white--text no_border d-flex justify-center align-center "
                      min-height="55"
                    >
                      <v-row>
                        <h6
                          class="align-self-center py-0 text-left font_20 col-sm-12 col-md-7"
                        >
                          {{ insights.dayNextFilling }}
                        </h6>
                        <h4
                          class="py-0 text-uppercase col-sm-12 line_14 text-right col-md-5 font_13"
                        >
                          {{ $t("days_till_next_tax_filling") }}
                        </h4>
                      </v-row>
                    </v-card>
                  </v-col>
                  <LoadingMe
                    :isLoading="showLoading1"
                    :fullPage="false"
                    type="loading"
                    :myLoading="true"
                  />
                </v-row>
              </v-card>

              <v-card
                color="white"
                outlined
                dense
                class="pa-4 mt-4 no_border"
                min-height="338"
              >
                <h3 class="font_20" :class="{line_34:this.$i18n.locale=='kh'}" >{{ $t("your_cash_position") }}</h3>
                <p class="mb-0">
                  {{ $t("cash_balance_its_reconciliation_as_of_today") }}
                </p>
                <v-row>
                  <v-col sm="12" class="py-0" cols="12">
                    <CashPosition height="178" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="6" class="pr-0 py-0">
                    <v-btn
                      to="cash"
                      class="mt-1 font_16 text-capitalize rounded-0 white--text"
                      color="primary"
                    >
                      + {{ $t("cash") }}
                    </v-btn>
                  </v-col>
                  <v-col sm="6" class="pl-0 text-right pt-2">
                    <span
                      @click="ReporttAmontBudget"
                      class="mb-0 pointer py-5 niradei_bold font_16 primary--text text-right"
                      >{{ $t("view_report") }}
                    </span>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col class="py-md-0 px-md-2" md="4" sm="6" cols="12">
              <v-card
                color="white"
                outlined
                dense
                class="pa-4 no_border"
                min-height="347"
              >
                <LoadingMe
                  :isLoading="showLoading"
                  :fullPage="false"
                  type="loading"
                  :myLoading="true"
                />
                <h3 class="font_20" :class="{line_34:this.$i18n.locale=='kh'}" >{{ $t("expected_due") }}</h3>
                <p class="mb-0">{{ $t("amount_to_receive") }}</p>
                <h2
                  class="col-sm-12 niradei_black pa-0 primary--text text-right mb-1"
                >
                  {{ expectedBalance }}
                </h2>
                <template>
                  <v-simple-table class="my-7">
                    <template>
                      <tbody>
                        <tr v-for="item in expectedDue" :key="item.name">
                          <td style="width:30px" class="text-left pr-0 pl-0">
                            <span class="niradei_medium font_14 grey--text">
                              {{ item.name }} {{ $t(item.locale) }}
                            </span>
                          </td>
                          <td class="text-center pr-0">
                            <span class="niradei_heavy font_18 dark_grey">
                              {{
                                numberFormat(
                                  item.openbalanceP,
                                  item.decimalFormat
                                )
                              }}%
                            </span>
                          </td>
                          <td class="text-right pr-0">
                            <span class="niradei_heavy font_18 dark_grey">
                              {{ numberFormat(item.value, item.decimalFormat) }}
                            </span>
                          </td>
                        </tr>
                        <!--                        <tr>-->
                        <!--                          <td class="text-left pl-0">-->
                        <!--                            <span class="niradei_medium font_14 grey&#45;&#45;text">-->
                        <!--                              1 – 2 {{ $t("weeks") }}-->
                        <!--                            </span>-->
                        <!--                          </td>-->
                        <!--                          <td class="text-center pr-0">-->
                        <!--                            <span class="niradei_heavy font_18 dark_grey">-->
                        <!--                              40%-->
                        <!--                            </span>-->
                        <!--                          </td>-->
                        <!--                          <td class="text-right pr-0">-->
                        <!--                            <span class="niradei_heavy font_18 dark_grey">-->
                        <!--                              8,000-->
                        <!--                            </span>-->
                        <!--                          </td>-->
                        <!--                        </tr>-->
                        <!--                        <tr>-->
                        <!--                          <td class="text-left pl-0">-->
                        <!--                            <span class="niradei_medium font_14 grey&#45;&#45;text">-->
                        <!--                              > 2 {{ $t("weeks") }}-->
                        <!--                            </span>-->
                        <!--                          </td>-->
                        <!--                          <td class="text-center pr-0">-->
                        <!--                            <span class="niradei_heavy font_18 dark_grey">-->
                        <!--                              30%-->
                        <!--                            </span>-->
                        <!--                          </td>-->
                        <!--                          <td class="text-right pr-0">-->
                        <!--                            <span class="niradei_heavy font_18 dark_grey">-->
                        <!--                              2,000-->
                        <!--                            </span>-->
                        <!--                          </td>-->
                        <!--                        </tr>-->
                      </tbody>
                    </template>
                  </v-simple-table>
                </template>
                <v-row>
                  <v-col sm="6" class="pr-0 py-0">
                    <v-btn
                      :to="lang + '/cash_receipt'"
                      class="text-capitalize font_16 rounded-0 white--text"
                      color="primary"
                    >
                      + {{ $t("receipt") }}
                    </v-btn>
                  </v-col>
                  <v-col sm="6" class="pl-0 text-right pt-2">
                    <span
                      @click="CheckPart"
                      class="mb-0 py-5 pointer niradei_bold font_16 primary--text text-right"
                    >
                      {{ $t("view_report") }}
                    </span>
                  </v-col>
                </v-row>
              </v-card>
              <v-card
                color="white"
                outlined
                dense
                class="pa-4 mt-4 no_border"
                min-height="338"
              >
                <h3 class="font_20" :class="{line_34:this.$i18n.locale=='kh'}">{{ $t("revenue") }}</h3>
                <p class="mb-0">{{ $t("from_beginning_year") }}</p>
                <v-row class="mt-0">
                  <v-col sm="12" cols="12" class="pl-1  py-0">
                    <Revenue />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="6" class="pr-0 py-0">
                    <v-btn
                      :to="lang + '/invoice'"
                      class="mt-2 font_16 text-capitalize rounded-0 white--text"
                      color="primary"
                    >
                      + {{ $t("invoice") }}
                    </v-btn>
                  </v-col>
                  <v-col sm="6" class="pl-0 text-right pt-2">
                    <router-link
                      :to="lang + '/statement_of_profit_or_loss'"
                      class="mb-0 py-5 niradei_bold font_16 primary--text text-right"
                      >{{ $t("view_report") }}
                    </router-link>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col class="py-0 pl-md-2" md="4" sm="12" cols="12">
              <v-card
                color="white"
                outlined
                dense
                class="pa-4 no_border"
                min-height="347"
              >
                <LoadingMe
                  :isLoading="showLoading2"
                  :fullPage="false"
                  type="loading"
                  :myLoading="true"
                />
                <h3 class="font_20" :class="{line_34:this.$i18n.locale=='kh'}">{{ $t("amount_to_pay") }}</h3>
                <p class="mb-0">{{ $t("amount_to_pay_to_suppliers") }}</p>
                <h2
                  class="primary--text niradei_black mb-1 pa-0 text-right col-sm-12"
                >
                  {{ amountToPayBalance }}
                </h2>
                <template>
                  <v-simple-table class="my-7">
                    <template>
                      <tbody>
                        <tr v-for="item in amountToPay" :key="item.name">
                          <td style="width:30px" class="text-left px-0">
                            <span class="niradei_medium font_14 grey--text">
                              {{ item.name }} {{ $t(item.locale) }}
                            </span>
                          </td>
                          <td class="text-center pr-0">
                            <span class="niradei_heavy font_18 dark_grey">
                              {{
                                numberFormat(
                                  item.openbalanceP,
                                  item.decimalFormat
                                )
                              }}%
                            </span>
                          </td>
                          <td class="text-right pr-0">
                            <span class="niradei_heavy font_18 dark_grey">
                              {{ numberFormat(item.value, item.decimalFormat) }}
                            </span>
                          </td>
                        </tr>
                        <!--                      <tr>-->
                        <!--                        <td style="width:30px" class="text-left px-0">-->
                        <!--                            <span class="niradei_medium font_14 grey&#45;&#45;text">-->
                        <!--                              1 – 2 {{ $t("weeks") }}-->
                        <!--                            </span>-->
                        <!--                        </td>-->
                        <!--                        <td class="text-center pr-0">-->
                        <!--                            <span class="niradei_heavy font_18 dark_grey">-->
                        <!--                              40%-->
                        <!--                            </span>-->
                        <!--                        </td>-->
                        <!--                        <td class="text-right pr-0">-->
                        <!--                            <span class="niradei_heavy font_18 dark_grey">-->
                        <!--                              8,000-->
                        <!--                            </span>-->
                        <!--                        </td>-->
                        <!--                      </tr>-->
                        <!--                      <tr>-->
                        <!--                        <td style="width:30px" class="text-left px-0">-->
                        <!--                            <span class="niradei_medium font_14 grey&#45;&#45;text">-->
                        <!--                              > 2 {{ $t("weeks") }}-->
                        <!--                            </span>-->
                        <!--                        </td>-->
                        <!--                        <td class="text-center pr-0">-->
                        <!--                            <span class="niradei_heavy font_18 dark_grey">-->
                        <!--                              30%-->
                        <!--                            </span>-->
                        <!--                        </td>-->
                        <!--                        <td class="text-right pr-0">-->
                        <!--                            <span class="niradei_heavy font_18 dark_grey">-->
                        <!--                              2,000-->
                        <!--                            </span>-->
                        <!--                        </td>-->
                        <!--                      </tr>-->
                      </tbody>
                    </template>
                  </v-simple-table>
                </template>
                <v-row>
                  <v-col sm="6" class="pr-0 py-0">
                    <v-btn
                      :to="lang + '/cash_payment'"
                      class="text-capitalize font_16 rounded-0 white--text"
                      color="primary"
                    >
                      + {{ $t("payment") }}
                    </v-btn>
                  </v-col>
                  <v-col sm="6" class="pl-0 text-right pt-2">
                    <span
                      @click="ReprotAmontTopay"
                      class="mb-0 py-5 pointer niradei_bold font_16 primary--text text-right"
                      >{{ $t("view_report") }}
                    </span>
                  </v-col>
                </v-row>
              </v-card>
              <v-card
                color="white"
                outlined
                dense
                class="pa-4 mt-4 no_border"
                min-height="338"
              >
                <h3 class="font_20" :class="{line_34:this.$i18n.locale=='kh'}">{{ $t("expense") }}</h3>
                <p class="mb-0">{{ $t("from_beginning_year") }}</p>
                <Expense />
                <v-row>
                  <v-col sm="6" class="pr-0 mt-2 py-0">
                    <v-btn
                      :to="lang + '/credit_purchase'"
                      class="text-capitalize font_16 rounded-0 white--text"
                      color="primary"
                    >
                      + {{ $t("purchase") }}
                    </v-btn>
                  </v-col>
                  <v-col sm="6" class="pl-0 text-right pt-2">
                    <router-link
                      :to="lang + '/statement_of_profit_or_loss'"
                      class="mb-0 py-5 niradei_bold font_16 primary--text text-right"
                      >{{ $t("view_report") }}
                    </router-link>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <!--        <LoadingMe-->
        <!--            :isLoading="showLoading"-->
        <!--            :fullPage="false"-->
        <!--            type="loading"-->
        <!--            :myLoading="true"/>-->
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { i18n } from "@/i18n";
import kendo from "@progress/kendo-ui";

// const instituteHandler = require("@/scripts/instituteHandler");
// const otherHandler = require("@/scripts/otherHandler");
// const store = require("@/institute");
const billingHandler = require("@/scripts/invoice/handler/billingHandler");
const monthlyReturnHandler = require("@/scripts/compliance/handler/monthlyReturnHandler");
const payrollHandler = require("@/scripts/payrollHandler");
import {
  setTabActive,
  setTabActiveVendor,
  setTabActiveBudget,
} from "@/observable/store";
export default {
  components: {
    LoadingMe: () => import(`@/components/Loading`),
    Expense: () => import(`@/components/overview/Expense`),
    Revenue: () => import(`@/components/overview/Revenue`),
    CashPosition: () => import(`@/components/overview/CashPosition`),
  },
  data: () => ({
    //Bar
    isLoading: true,
    institutes: [],
    mInstitute: {},
    asOf: new Date().toISOString().substr(0, 10),
    expectedBalance: 0,
    decimalFormat: "n2",
    lastUpdated: "",
    showLoading: false,
    showLoading1: false,
    showLoading2: false,
    expectedDue: [],
    insights: {},
    dayToPay: 0,
    dueThisWeekInvoice: 0,
    dueThisWeekPExpense: 0,
    amountToPayBalance: 0,
    amountToPay: [],
  }),
  mounted: async function() {
    // await this.loadInstitute();
    // await this.loadInstitutes();
    // await this.getCookieData();
    await this.loadExpectedDue();
    await this.dashboardReceivableOverview();

    await this.onloadInsight();
    await this.loadDayToPay();
    await this.loadAmountToPay();
    window.console.log("API APP", process.env.VUE_APP_API);
  },
  methods: {
    CheckPart() {
      setTabActive(2, 3);
      this.$router.push({ name: "Customers" });
    },
    ReprotAmontTopay() {
      setTabActiveVendor(2, 4);
      this.$router.push({ name: "Vendors" });
    },
    ReporttAmontBudget() {
      setTabActiveBudget(1, 2);
      this.$router.push({ name: "WorkingCapital" });
    },

    async dashboardReceivableOverview() {
      this.showLoading2 = true;
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          let strFilter = "";
          strFilter = "?asOf=" + this.asOf;
          billingHandler.dashboardReceivableOverview(strFilter).then((res) => {
            if (res.data.statusCode === 200) {
              const response = res.data.data;
              this.dueThisWeekPExpense = response.dueThisWeekPExpense;
              this.dueThisWeekInvoice = response.dueThisWeekInvoice;
              this.showLoading2 = false;
            }
          });
        }, 10);
      });
    },
    async loadExpectedDue() {
      this.showLoading = true;
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          let strFilter = "";
          strFilter = "?asOf=" + this.asOf + "&type=expected_due";
          // this.showLoading = true
          billingHandler.wcpReceivableOverviewList(strFilter).then((res) => {
            if (res.data.statusCode === 200) {
              const response = res.data.data[0];
              this.expectedDue = response.lines;
              this.decimalFormat = response.decimalFormat;
              this.lastUpdated = response.lastUpdatedAt;
              const paymentTerm = response.paymentTermUsed;
              this.mostPaymentTermUsed = paymentTerm.name;
              this.expectedBalance = this.numberFormat(
                response.openBalance,
                response.decimalFormat
              );
              this.showLoading = false;
            }
          });
        }, 10);
      });
    },
    async onloadInsight() {
      this.showLoading1 = true;
      monthlyReturnHandler.getInsight().then((res) => {
        this.insights = res.data.data;
        this.showLoading1 = false;
      });
    },
    numberFormat(value, format) {
      return kendo.toString(value, format);
    },
    async loadDayToPay() {
      let dateNow = kendo.toString(new Date(), "yyyy-MM-dd");
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          payrollHandler
            .getDayToPay(dateNow)
            .then((res) => {
              this.showLoading = false;
              if (res.statusCode === 200) {
                this.showLoading = false;
                this.dayToPay = res.data;
              }
            })
            .catch();
          {
            this.showLoading = false;
          }
        }, 300);
      });
    },
    async loadAmountToPay() {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          let strFilter = "";
          strFilter = "?asOf=" + this.asOf + "&type=amount_to_pay";
          // this.showLoading = true
          billingHandler.wcpPableOverviewList(strFilter).then((res) => {
            if (res.data.statusCode === 200) {
              const response = res.data.data[0];
              this.amountToPay = response.lines;
              // this.decimalFormat = response.decimalFormat
              // this.lastUpdated = response.lastUpdatedAt
              // const paymentTerm = response.paymentTermUsed
              // this.mostPaymentTermUsed = paymentTerm.name
              this.amountToPayBalance = this.numberFormat(
                response.openBalance,
                response.decimalFormat
              );
              // this.showLoading = false
            }
          });
        }, 10);
      });
    },
  },
  computed: {
    lang() {
      return "/" + i18n.locale;
    },
  },
};
</script>
<style scoped>
.k-chart {
  height: 173px !important;
}

.five {
  font-weight: 700;
  font-size: 26px;
}

.theme--light.v-data-table {
  background-color: transparent !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  height: 41px !important;
  border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

/*.v-data-table > .v-data-table__wrapper > table > tbody > tr:first-child > td {*/
/*    border-top: thin solid rgba(0, 0, 0, 0.12) !important;*/
/*}*/

.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: transparent !important;
}

.border-bottom {
  border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

.font-small {
  font-size: 12px;
  line-height: 15px;
}

.font-26 {
  font-size: 26px !important;
}

.round_checkbox label:after {
  content: "";
  height: 7px;
  left: 3px !important;
  opacity: 0;
  position: absolute;
  top: 4px !important;
}

.round_checkbox label {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  height: 20px !important;
  left: 0;
  position: absolute;
  top: 0;
  width: 20px !important;
}

.dark_grey {
  color: #7e7a7a;
}

.font_19 {
  font-size: 19px;
}

.d_center {
  height: 100vh;
  display: flex;
  justify-content: center;
  /* align-content: center; */
  align-items: center;
}

@media (max-width: 576px) {
}
</style>
