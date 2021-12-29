<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col sm="12" cols="12">
          <v-card color="white" class="pa-4 no_border" elevation="0">
            <v-row>
              <v-col sm="12" cols="12" class="tab_wrapper py-0">
                <v-tabs>
                  <v-row>
                    <v-col
                      sm="12"
                      cols="12"
                      class="py-0 pr-0"
                      style="display: inherit;"
                    >
                      <v-tab>
                        <span class="hidden-sm-and-up">
                          <v-icon left>mdi-pen</v-icon>
                        </span>
                        <span class="hidden-sm-and-down">
                          {{ $t("general_setting") }}
                        </span>
                      </v-tab>
                      <v-tab>
                        <span class="hidden-sm-and-up">
                          <v-icon left>mdi-pen</v-icon>
                        </span>
                        <span class="hidden-sm-and-down">
                          {{ $t("form") }}
                        </span>
                      </v-tab>
                      <v-tab>
                        <span class="hidden-sm-and-up">
                          <v-icon left>mdi-pen</v-icon>
                        </span>
                        <span class="hidden-sm-and-down">
                          {{ $t("currency") }}
                        </span>
                      </v-tab>
                    </v-col>
                  </v-row>

                  <v-tab-item>
                    <v-card flat>
                      <v-card-text class="">
                        <GeneralSettings />
                      </v-card-text>
                    </v-card>
                  </v-tab-item>

                  <v-tab-item>
                    <v-card flat>
                      <v-card-text class="">
                        <Form />
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text class="">
                        <Currency />
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
  name: "Customers",
  components: {
    GeneralSettings: () => import("./GeneralSettings"),
    Form: () => import("./form/Form"),
    Currency: () => import("./currency/Currency"),
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
  left: 448px !important;
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
