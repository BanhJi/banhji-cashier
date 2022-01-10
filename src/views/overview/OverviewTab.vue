<template>
  <v-app class="zoom-in">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-tabs class="overiew_tab"   slider-color="#F8F8F9" slider-size="1">
            <v-tab>
  
              <span class="text-uppercase">
                {{ $t("business_overview") }}
              </span>
            </v-tab>
            <v-tab>
          
              <span class="text-uppercase">
                {{ $t("financial_ratios") }}
              </span>
            </v-tab>
            <!-- Item  -->
            <v-tab-item v-if="appType === 'npo' " style="background: #F8F8F9 !important;"> 
              <OverviewNpo />
            </v-tab-item>
            <v-tab-item v-else style="background: #F8F8F9 !important;"> 
              <Overview />
            </v-tab-item>
            <v-tab-item> 
              <FinancialRatio/>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
import {dataStore} from "@/observable/store";
export default {
  components: {
    Overview: () => import("./Overview"),
    FinancialRatio: ()=> import('./financial_ratio/FinancialRatio'),
    OverviewNpo: () => import('./OverviewNpo')
  },
  computed:{
    appType(){
      return dataStore.productType
    }
  }
};
</script>
<style scoped>
    .overiew_tab .v-tabs-bar {
        background-color: none !important;
    }
</style>
