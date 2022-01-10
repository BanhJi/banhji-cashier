<template>
  <div>
    <LoadingMe
      :isLoading="showLoading"
      :fullPage="false"
      :myLoading="true"
      :type="'loading'"
    />

    <h2
      style="line-height: 22px"
      class="primary--text niradei_black mb-1 pa-0 text-right col-sm-12"
    >
      {{ Number(total).toLocaleString() }}
    </h2>

    <chart
      ref="chart"
      :data-source="pieData"
      :chart-area-background="''"
      :legend-visible="false"
      :series-defaults-type="'pie'"
      :series="series"
      :series-defaults-labels-visible="true"
      :series-defaults-labels-position="'outsideEnd'"
      :series-defaults-labels-background="'transparent'"
      :series-defaults-labels-template="labelTemplate"
      :tooltip-visible="true"
      :tooltip-template="tooltipTemplate"
      :chartArea="chartArea"
      fit
      :theme="'sass'"
    />
  </div>
</template>

<script>
// import kendo from '@progress/kendo-ui';
import { i18n } from "@/i18n";
import { Chart } from "@progress/kendo-charts-vue-wrapper";

const JournalHandler = require("@/scripts/journalHandler");
const EntityType = require("@/scripts/default_setup/EntityType");
const AccountTypeCode = require("@/scripts/default_setup/AccountTypeCode");

export default {
  name: "FundReceiptGraph",
  components: {
    chart: Chart,
    LoadingMe: () => import(`@/components/Loading`),
  },
  data: function () {
    return {
      transactions: [],
      pieData: [],
      total: 0,
      series: [
        {
          field: "value",
          autoFit: true,
          categoryField: "category",
        },
      ],
      labelTemplate: " #= kendo.format('{0:P}', percentage)#",
      tooltipTemplate:
        "#= category # : #= kendo.toString(value, 'n') # (#= kendo.format('{0:P}', percentage) #)",
      showLoading: false,
      chartArea: {
        background: "transparent",
        margin: 0,
        height: 198,
      },
    };
  },
  methods: {
    initialize() {
      this.showLoading = true;
      JournalHandler.getJournalByTransactionType(EntityType.FUND_RECEIPT, {
        params: {
          as_of_date: new Date().toISOString().substr(0, 10) + "T23:59:59.999Z",
        },
      })
        .then((res) => {
          if (res) {
            this.transactions = res.data;
            this.bindData();
          } else {
            this.$snotify.error(i18n.t("error_something_wrong"));
          }
        })
        .finally(() => {
          this.showLoading = false;
        });
    },
    bindData() {
      let g = {};
      let total_ = 0;
      const colors = [
        "#c80000",
        "#642828",
        "#f44336",
        "#522D2DFF",
        "#d85604",
        "#ED1A3A",
        "#7a4141",
        "#e88d14",
        "#f1aa45",
      ];
      let index = 0;
      this.transactions.forEach((value) => {
        /* Filter Revenue Accounts */
        if (value.account.type_code === AccountTypeCode.REVENUE) {
          if (g[value.primary_contact.name]) {
            g[value.primary_contact.name].value += value.amount * -1;
            total_ += value.amount * -1;
          } else {
            g[value.primary_contact.name] = {
              category: value.primary_contact.name,
              value: value.amount * -1,
              color: colors[index],
            };
            total_ += value.amount * -1;
          }
          index += 1;
          if (index > colors.length) {
            index = 0;
          }
        }
      });
      this.total = total_;

      window.console.log(g);
      /* Bind data */
      this.pieData = Object.values(g);
    },
  },
  mounted() {
    this.initialize();
  },
};
</script>