<template>
  <v-row class="ml-1">
    <v-col sm="12" cols="12" class="pt-4">
      <div style="background-color: #fff;">
        <v-tabs
          vertical
          class="tab_setting overiew_tab_sub"
          slider-color="grayBg"
          slider-size="7"
          :class="{
            tab_product_service_hide: isHide,
            tab_product_service_show: !isHide,
          }"
        >
          <span class="hideAbs">
            <v-icon size="16" class="arr_icon" @click="hideTabs" v-if="!isHide">
              mdi-chevron-left-circle
            </v-icon>
            <v-icon size="16" class="arr_icon1" @click="hideTabs" v-if="isHide">
              mdi-chevron-right-circle
            </v-icon>
          </span>
          <v-tab>
            <span class="hidden-sm-and-up">
              FR
            </span>
            <span class="hidden-sm-and-down text-capitalize text-left">
              {{ $t("financial_ratios") }}
            </span>
          </v-tab>
          <!-- <v-tab>
            <span class="hidden-sm-and-up">
              PM
            </span>
            <span class="hidden-sm-and-down text-capitalize text-left">
              {{ $t("profitability_measures") }}
            </span>
          </v-tab>
          <v-tab>
            <span class="hidden-sm-and-up">
              FSM
            </span>
            <span class="hidden-sm-and-down text-capitalize text-left">
              {{ $t("financial_strength_measure") }}
            </span>
          </v-tab>
          <v-tab>
            <span class="hidden-sm-and-up">
              LM
            </span>
            <span class="hidden-sm-and-down text-capitalize text-left">
              {{ $t("liquidity_measures") }}
            </span>
          </v-tab>
          <v-tab>
            <span class="hidden-sm-and-up">
              WCM
            </span>
            <span class="hidden-sm-and-down text-capitalize text-left">
              {{ $t("working_capital_measures") }}
            </span>
          </v-tab>
          <v-tab>
            <span class="hidden-sm-and-up">
              BM
            </span>
            <span class="hidden-sm-and-down text-capitalize text-left">
              {{ $t("bankruptcy_measures") }}
            </span>
          </v-tab> -->
            <v-tab-item>
            <v-row>
              <v-col sm="12" cols="12" class="pl-5 pt-0"> 
                  <FinancialRatios/>
              </v-col>
            </v-row>
          </v-tab-item>
            <!-- <v-tab-item>
            <v-row>
              <v-col sm="12" cols="12" class="pl-5 pt-0"> 
                  <ProfilabilityMeasure/>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item>
            <v-row>
              <v-col sm="12" cols="12" class="pl-5 pt-0"> 
                  <FinancialStrength/>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item>
            <v-row>
              <v-col sm="12" cols="12" class="pl-5 pt-0"> 
                  <LiquidityMeasure/>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item>
            <v-row>
              <v-col sm="12" cols="12" class="pl-5 pt-0"> 
                  <WorkingCaptialMeasure/>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item>
            <v-row>
                <v-col sm="12" cols="12" class="pl-5 pt-0">
                  <BankruptcyMeasures/>
                </v-col>
            </v-row>
          </v-tab-item> -->
        </v-tabs>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "CustomerTab",
  data: () => ({
    isHide: false,
  }),
  props: {},
  methods: {
    hideTabs() {
      this.isHide = !this.isHide;
    },
  },
  components: {
    FinancialRatios: () => import('./FinancialRatio'),
    // ProfilabilityMeasure: () => import('./ProfilabilityMeasure'),
    // FinancialStrength: () => import('./FinancialStrength'),
    // LiquidityMeasure: () => import('./LiquidityMeasure'),
    // WorkingCaptialMeasure: () => import('./WorkingCaptialMeasure'),
    // BankruptcyMeasures: () => import('./BankruptcyMeasures')
  },
};
</script>
<style scoped>
.arr_icon {
  color: #2ca01c;
}

.arr_icon1 {
  color: #4c9aff;
  color: #2ca01c;
}

.v-tab {
  justify-content: left;
  font-size: 16px;
}

.v-tab--active {
  background-color: rgb(255, 255, 255);
}

.tab_setting .v-tab--active {
  font-weight: 700;
  color: #000;
}

.v-tab--active {
  background-color: #ffffff !important;
  border-bottom: 4px solid #92d050;
  border-left: none;
}

.tab_product_service_show.theme--light .v-slide-group__content {
  width: 140px !important;
}

p {
  color: rgba(0, 0, 0, 0.87);
}

@media (max-width: 576px) {
  .tab_setting.theme--light.v-tabs.tab_setting > .v-tabs-bar {
    width: 55px !important;
  }

  .hideAbs {
    display: none !important;
  }
}
</style>
