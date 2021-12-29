<template>
  <v-row class="">
    <v-col sm="12" cols="12">
      <v-tabs
        vertical
        class="tab_setting tab_product_service_show"
        slider-color="grayBg"
        slider-size="7"
      >
        <v-tab>
          <span class="hidden-sm-and-up">
            <v-icon left>mdi-pen</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("company") }}
          </span>
        </v-tab>
        <v-tab v-if="user.plan > 1">
          <span class="hidden-sm-and-up">
            <v-icon left>mdi-pen</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("location") }}
          </span>
        </v-tab>
        <v-tab v-if="user.plan > 1">
          <span class="hidden-sm-and-up">
            <v-icon left>mdi-pen</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("segment") }}
          </span>
        </v-tab>
        <v-tab v-if="user.plan > 1">
          <span class="hidden-sm-and-up">
            <v-icon left>mdi-pen</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("class_") }}
          </span>
        </v-tab>
        <!-- <v-tab>
          <span class="hidden-sm-and-up">
            <v-icon left>mdi-pen</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("currency") }}
          </span>
        </v-tab> -->
        <v-tab>
          <span class="hidden-sm-and-up">
            <v-icon left>mdi-pen</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("prefix_setting") }}
          </span>
        </v-tab>
        <!-- <v-tab>
          <span class="hidden-sm-and-up">
            <v-icon left>mdi-pen</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("form") }}
          </span>
        </v-tab> -->
        <v-tab>
          <span class="hidden-sm-and-up">
            <v-icon left>mdi-pen</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("uom_category") }}
          </span>
        </v-tab>
        <v-tab>
          <span class="hidden-sm-and-up">
            <v-icon left>mdi-pen</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("uom") }}
          </span>
        </v-tab>
        <v-tab-item>
          <v-row>
            <v-col sm="12" cols="12" class="pl-6 pt-0">
              <Company />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item v-if="user.plan > 1">
          <v-row>
            <v-col sm="12" cols="12" class="pl-6 pt-0">
              <Location />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item v-if="user.plan > 1">
          <v-row>
            <v-col sm="12" cols="12" class="pl-6 pt-0">
              <Segment />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item v-if="user.plan > 1">
          <v-row>
            <v-col sm="12" cols="12" class="pl-6 pt-0">
              <Class />
            </v-col>
          </v-row>
        </v-tab-item>
        <!-- <v-tab-item>
          <v-row>
            <v-col sm="12" cols="12" class="pl-6 pt-0">
              <Currency />
            </v-col>
          </v-row>
        </v-tab-item> -->
        <v-tab-item>
          <v-row>
            <v-col sm="12" cols="12" class="pl-6 pt-0">
              <PrefixSetting />
            </v-col>
          </v-row>
        </v-tab-item>
        <!-- <v-tab-item>
          <v-row>
            <v-col sm="12" cols="12" class="pl-6 pt-0">
              <Form />
            </v-col>
          </v-row>
        </v-tab-item> -->
        <v-tab-item>
          <v-row>
            <v-col sm="12" cols="12" class="pl-6 pt-0">
              <UomCategory />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-row>
            <v-col sm="12" cols="12" class="pl-6 pt-0">
              <Uom />
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-row>
</template>

<script>
const store = require("@/institute");
export default {
  data: () => ({}),
  props: {},
  methods: {},
  computed: {
    user() {
      return store.default.state.user;
    },
  },
  components: {
    // TaxSetting: () => import('./TaxSetting'),
    Company: () => import("./Company"), // lazy load component
    // PaymentMethod: () => import('./PaymentMethod'),
    // PaymentOption: () => import('./PaymentOption'),
    // Form: () => import("./Form"),
    PrefixSetting: () => import("./PrefixSetting"),
    // Currency: () => import("./currency/Currency"),
    Location: () => import("./Location"),
    Segment: () => import("./Segment"),
    Class: () => import("./Class"),
    UomCategory: () => import("./UomCategory"),
    Uom: () => import("./Uom"),
  },
};
</script>
<style scoped>
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

.v-tabs-slider {
  background-color: #edf1f5 !important;
  padding-left: 6px;
  height: 100%;
  width: 100%;
}

@media (max-width: 576px) {
}
</style>
