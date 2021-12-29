<template>
  <v-row class="">
    <v-col sm="12" cols="12">
      <v-tabs
        vertical
        class="tab_setting"
        slider-color="grayBg"
        slider-size="7"
      >
        <v-tab>
          <span class="hidden-sm-and-up">
            <v-icon left>inv</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("invoices") }}
          </span>
        </v-tab>
        <v-tab>
          <span class="hidden-sm-and-up">
            <v-icon left>inv</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("payment_voucher") }}
          </span>
        </v-tab>
        <v-tab>
          <span class="hidden-sm-and-up">
            <v-icon left>CN</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("credit_note") }}
          </span>
        </v-tab>
        <v-tab>
          <span class="hidden-sm-and-up">
            <v-icon left>CN</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("sale_order") }}
          </span>
        </v-tab>
        <v-tab>
          <span class="hidden-sm-and-up">
            <v-icon left>CN</v-icon>
          </span>
          <span class="hidden-sm-and-down text-capitalize">
            {{ $t("sale_quote") }}
          </span>
        </v-tab>
    
        <v-tab-item>
          <v-row>
            <v-col sm="12" cols="12" class="pl-5 px-0 pt-0">
              <Invoice />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-row>
            <v-col sm="12" cols="12" class="pl-5 px-0 pt-0">
              <PaymentVoucher />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-row>
            <v-col sm="12" cols="12" class="pl-5 px-0 pt-0">
              <CreditNote />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-row>
            <v-col sm="12" cols="12" class="pl-5 px-0 pt-0">
              <SaleOrderForm />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-row>
            <v-col sm="12" cols="12" class="pl-5 px-0 pt-0">
              <SaleQuoteForm />
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-row>
</template>

<script>

export default {
  data: () => ({}),
  props: {},
  methods: {},
  computed: {

  },
  components: {
    Invoice: () => import("./Invoices"), // lazy load component
    PaymentVoucher: () => import("./PaymentVoucher"), // lazy load component
    CreditNote: () => import("./CreditNote"), // lazy load component
    SaleOrderForm: () => import('./SaleOrderForm'),
    SaleQuoteForm: () => import('./SaleQuoteForm')
    
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
