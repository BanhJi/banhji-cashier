<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col sm="12" cols="12" class="pb-0">
          <v-card color="white" class="pa-4 no_border" elevation="0">
            <v-row>
              <v-col sm="12" cols="12" class="tab_wrapper py-0">
                <v-tabs>
                  <v-row>
                    <v-col
                      sm="9"
                      cols="9"
                      class="py-0 pr-0"
                      style="display: inherit;"
                    >
                      <v-tab>
                        <span class="hidden-sm-and-up">
                          {{ $t("products") }}
                        </span>
                        <span class="hidden-sm-and-down">
                          {{ $t("products") }}
                        </span>
                      </v-tab>
                      <v-tab>
                        <span class="">
                          {{ $t("stock_report") }}
                        </span>
                      </v-tab>
                      <!-- <v-tab v-if="(businessType == 'Supply')||(businessType == 'Service')">
                                            </v-tab>
                                            <v-tab v-else>
                                                <span class="hidden-sm-and-up">
                                                     {{ $t('production_order') }}
                                                </span>
                                                <span class="hidden-sm-and-down">
                                                    {{ $t('production_order') }}
                                                </span>
                                            </v-tab>
                                            <v-tab v-if="(businessType == 'Supply')||(businessType == 'Service')">
                                           </v-tab>
                                           <v-tab v-else>
                                                <span class="hidden-sm-and-up">
                                                      {{ $t('production') }}
                                                </span>
                                               <span class="hidden-sm-and-down">
                                                    {{ $t('production') }}
                                                </span>
                                           </v-tab> -->
                    </v-col>
                    <v-col sm="3" cols="3" class="px-0 py-0">
                      <v-btn
                        color="primary"
                        class="float-right white--text capitalize pr-6"
                        style="border-radius: 2px !important;"
                        to="product"
                        >{{ $t("add_new_product") }}
                      </v-btn>
                    </v-col>
                    <!-- <v-col sm="2" cols="2" class="px-0">
                                 
                                            <v-menu
                                                nudge-bottom="4"
                                                bottom
                                                offset-y
                                                origin="bottom top"
                                                transition="scroll-y-reverse-transition"
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <span class="hidden-sm-and-up">
                                                        <div class="dropdown_transactions ml-6">
                                                            <v-icon v-on="on" left>mdi-plus</v-icon>
                                                        </div>
                                                    </span>
                                                    <span class="hidden-sm-and-down">
                                                        <v-btn icon v-on="on" class="dropdown_transactions" style="right: 0;">
                                                            <v-icon size="17" class="ma-1">mdi-plus</v-icon>
                                                                {{ $t('new') }}
                                                            <v-icon size="" class="ma-1">expand_more</v-icon>
                                                        </v-btn>
                                                    </span>
                                                </template>
        
                                                <v-list>
                                                    <v-list-item><h3 class="">{{ $t('inventory_control') }}</h3></v-list-item>
                                                    <v-list-item link route to="receipt_order">
                                                        <v-list-item-title>{{ $t('receipt_order') }}</v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item link route to="delivery_order">
                                                        <v-list-item-title>{{ $t('delivery_order') }}</v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item link route to="inventory_adjustment">
                                                        <v-list-item-title>{{ $t('inventory_adjustment') }}</v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item link route to="build_assembly">
                                                        <v-list-item-title>{{ $t('build_assembly') }}</v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item link route to="production">
                                                        <v-list-item-title>{{ $t('production') }}</v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item link route to="internal_usage">
                                                        <v-list-item-title>{{ $t('internal_usage') }}</v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item link route to="warranty">
                                                        <v-list-item-title>{{ $t('warranty') }}</v-list-item-title>
                                                    </v-list-item>
            
                                                    <v-list-item><h3 class="">{{ $t('add_new_items') }}</h3></v-list-item>
                                                    <v-list-item link route to="product">
                                                        <v-list-item-title>{{ $t('add_product') }}</v-list-item-title>
                                                    </v-list-item>
                                      
                                                    <v-list-item link route to="bom">
                                                        <v-list-item-title>{{ $t('add_bill_of_material') }}</v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item link route to="catalog">
                                                        <v-list-item-title>{{ $t('add_new_catalog') }}</v-list-item-title>
                                                    </v-list-item>
                        
                                                </v-list>
                                            </v-menu>
                                        </v-col> -->
                  </v-row>

                  <v-tab-item>
                    <v-card flat>
                      <v-card-text class="">
                        <Variants />
                      </v-card-text>
                    </v-card>
                  </v-tab-item>

                  <v-tab-item>
                    <v-card flat>
                      <v-card-text class="">
                        <Detail />
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <!-- <v-tab-item>
                    <v-card flat>
                      <v-card-text class="">
                        <ProductionOrders />
                      </v-card-text>
                    </v-card>
                  </v-tab-item>

                  <v-tab-item>
                    <v-card flat>
                      <v-card-text class="">
                        <Productions />
                      </v-card-text>
                    </v-card>
                  </v-tab-item> -->
                </v-tabs>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
const store = require("@/institute.js");
import { dataStore } from "@/observable/store";
export default {
  name: "",
  components: {
    Variants: () => import("./product_variants/variants/Variants.vue"),
    // ProductionOrders: () => import("./production_orders/ProductionOrders.vue"),
    // Productions: () => import("./production_orders/Productions.vue"),
    Detail: () => import("./stock_report/Detail")
  },
  computed: {
    businessType() {
      return dataStore.businessType;
    },
    user() {
      window.console.log(store.default.state.user, "cookie user");
      return store.default.state.user;
    },
    productType() {
      return dataStore.productType;
    },
  },
  data: () => ({}),
  watch: {},
  methods: {
    clickMe(data) {
      this.$route.push(data.link);
    },
  },
};
</script>
<style scoped>
.v-menu__content .v-list .v-list-item {
  min-height: 35px !important;
}

.tab_wrapper {
  position: relative;
  display: inherit;
}

.v-tab {
  min-width: 30px;
  font-size: 20px;
  text-transform: capitalize;
}

.v-icon--left {
  margin-right: 0px;
}

.theme--light.v-tabs > .v-tabs-bar {
  border-bottom: 1px solid #ddd !important;
}

.menuable__content__active {
  right: 40px !important;
  left: auto !important;
}

.v-tab--active {
  background-color: #e5effa;
  color: #000;
}

.theme--light.v-tabs >>> .v-tabs-bar {
  border-bottom: 1px solid #ddd !important;
}

.v-card__text {
  padding: 0 !important;
}
</style>
