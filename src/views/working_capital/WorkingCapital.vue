<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col sm="12" cols="12">
          <v-card color="white" class="pa-4 no_border" elevation="0">
            <v-row>
              <v-col sm="12" cols="12" class="tab_wrapper py-0">
                <v-tabs v-model="active_in_tabs">
                  <v-row>
                    <v-col
                      sm="10"
                      cols="10"
                      class="py-0 pr-0"
                      style="display: inherit;"
                    >
  
                      <v-tab>
                        <span class="hidden-sm-and-up">
                          <v-icon left>mdi-attachment</v-icon>
                        </span>
                        <span class="hidden-sm-and-down">
                          {{ $t("cash") }}
                        </span>
                      </v-tab>
                      <v-tab>
                        <span class="hidden-sm-and-up">
                          <v-icon left>mdi-attachment</v-icon>
                        </span>
                        <span class="hidden-sm-and-down">
                          {{ $t("fund") }}
                        </span>
                      </v-tab>
                    </v-col>
                    <v-col sm="2" cols="2" class="px-0">
                      <!-- Dropdown New-->
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
                            <v-btn
                              icon
                              v-on="on"
                              class="dropdown_transactions"
                              style="right: 0;"
                            >
                              <v-icon size="17" class="ma-1">mdi-plus</v-icon>
                              {{ $t("new") }}
                              <v-icon size="" class="ma-1">expand_more</v-icon>
                            </v-btn>
                          </span>
                        </template>

                        <v-list>
                      
                          <v-list-item link route to="cash_transactions">
                            <v-list-item-title>{{
                              $t("cash_transaction")
                            }}</v-list-item-title>
                          </v-list-item>
                          <v-list-item link route to="fund_receipt">
                            <v-list-item-title>{{
                              $t("fund_receipt")
                            }}</v-list-item-title>
                          </v-list-item>
      
                        </v-list>
                      </v-menu>
                    </v-col>
                  </v-row>

                  <v-tab-item>
                    <v-card flat>
                      <v-card-text class="">
                        <CashMovement />
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text class="">
                       
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
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
import { data } from "@/observable/store";
export default {
  name: "",
  components: {
    CashMovement: () => import("./cash/CashMovement"),
  },
  data: () => ({
    // active_tab: data.budget_tab.main
    active_in_tabs: data.budget_tab_main,
  }),
  computed: {
    active_tab() {
      return data.budget_tab_main;
    },
  },
  watch: {
    active_tab() {
      window.console.log("is change", this.active_tab);
      this.active_in_tabs = this.active_tab;
    },
    active_in_tabs() {
      data.budget_tab_main = this.active_in_tabs;
    },
  },
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
  margin-right: 0;
}

.theme--light.v-tabs >>> .v-tabs-bar {
  border-bottom: 1px solid #ddd !important;
}

.v-card__text {
  padding: 0 !important;
}
</style>
