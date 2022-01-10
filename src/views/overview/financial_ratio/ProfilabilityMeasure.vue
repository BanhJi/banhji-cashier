<template>
  <v-card color="white" class="pa-3 no_border" elevation="0">
    <v-row>
      <v-col sm="8" cols="12" class="py-0">
        <h3 class="text-left mb-1 font_20 line_24">
          {{ $t("profitability_measures") }}
        </h3>
      </v-col>
    </v-row>
    <!-- Search -->
    <v-row class="mt-0">
      <v-col sm="3" cols="12" class="pr-0">
        <label class="mb-1">{{ $t("base_month") }}:</label>
        <app-datepicker :initialDate="date" @emitDate="date = $event" />
      </v-col>
      <v-col sm="3" cols="12">
        <!-- Reporting Language -->
        <label class="mb-1">{{ $t("reporting_language") }}:</label>
        <app-reporting-language
          :initLanguage="reportingLanguage"
          @emitLanguage="reportingLanguage = $event"
        />
      </v-col>
      <v-col sm="2" cols="12" class="py-1 pl-0 pt-9">
        <v-btn
          color="primary"
          class=" white--text"
          @click="search"
        >
          {{ $t("run_report") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="pr-1">
      <v-col cols="12" class="py-0">
        <v-simple-table class="my_tb">
          <template v-slot:default>
            <tbody>
              <tr>
                <td class="text-bold text-left">
                  {{ $t("profitability_measures") }}
                </td>
                <td class="text-bold">1</td>
                <td class="text-bold">2</td>
                <td class="text-bold">3</td>
                <td class="text-bold">4</td>
                <td class="text-bold">5</td>
                <td class="text-bold">6</td>
                <td class="text-bold">7</td>
                <td class="text-bold">8</td>
                <td class="text-bold">9</td>
                <td class="text-bold">10</td>
                <td class="text-bold">11</td>
                <td class="text-bold">12</td>
              </tr>
              <tr v-for="(i, index) in profitableMeasure" :key="index">
                <td>{{ i.text }}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                 <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import { i18n } from "@/i18n";
export default {
  data: () => ({
    date: "",
     profitableMeasure:[
        {
            text: i18n.t('return_on_capital_employed'),
        },
        {
            text: i18n.t('profit_margin'),
        },
        {
            text: i18n.t('asset_turnover'),
        },
        {
            text: i18n.t('return_on_assets'),
        },
        {
            text: i18n.t('return_on_equity'),
        },
        {
            text:i18n.t('gross_profit_margin'),
        },
        {
            text: i18n.t('ebitda_margin'),
        },
        {
            text: i18n.t('net_profit_margin'),
        },
        {
            text: i18n.t('mom_sale_growth_rate '),
        },
        
    ],
    
  }),
  components: {
    // "LoadingMe": () => import('@/components/Loading'),
    "app-reporting-language": () =>
      import("@/components/kendo_templates/ReportingLanguageDropDownList"),
    "app-datepicker": () =>
      import("@/components/custom_templates/DatePickerComponent"),
  },
};
</script>
<style scoped>
.theme--light.v-data-table {
  background-color: transparent !important;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  height: 32px !important;
  border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
  border-right: none !important;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr:first-child > td {
  border-top: thin solid rgba(0, 0, 0, 0.12) !important;
}
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: transparent !important;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > thead > tr > td,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
  font-size: 14px;
  height: 40px !important;
  font-weight: 200 !important;
}
.my_tb .v-data-table__wrapper {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
