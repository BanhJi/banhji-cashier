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
                      sm="12"
                      cols="12"
                      class="py-0 pr-0"
                      style="display: inherit;"
                    >
                      <v-tab>
                        <span>
                          {{ $t("services") }}
                        </span>
                      </v-tab>
                      <v-tab>
                        <span>
                          {{ $t("services_transactions") }}
                        </span>
                      </v-tab>
                    </v-col>
                  </v-row>

                  <v-tab-item>
                    <v-card flat>
                      <v-card-text class="">
                        <ServicesItems />
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text class="">
                        <ServicesSaleTransactions />
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
export default {
  name: "Service",
  components: {
    ServicesItems: () => import("./services_items/ServicesItems"),
    ServicesSaleTransactions: () => import('./ServicesSaleTransactions')
  },
  data: () => ({
  }),
  computed: {

  },

  methods: {

  },
};
</script>
<style scoped>
/* .v-menu__content{
  top: 141px !important;
  left: 1098px !important;
} */
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
