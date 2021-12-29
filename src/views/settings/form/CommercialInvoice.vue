<template>
  <v-row class="">
    <v-col sm="12" cols="12">
      <v-row>
        <v-col sm="12" cols="12" class="pt-0">
          <v-row class="mt-2 mb-3">
            <v-col cols="12" class="py-0 px-10">
              <v-btn
                color="third"
                class=" white--text capitalize float-right"
                @click="EdtiForm(1)"
              >
                {{ $t("edit") }}
              </v-btn>
              <v-btn
                class=" float-right white--text capitalize mx-3"
                color="third"
                @click="_print(2)"
                >{{ $t("preview") }}</v-btn
              >
              <v-btn
                class=" capitalize float-right mx-0"
                color="primary"
                @click="ResetForm"
                >{{ $t("default") }}</v-btn
              >
            </v-col>
          </v-row>
          <div class="a4">
            <div
              style="box-shadow: rgb(0 0 0 / 20%) 0px 6px 12px 0px;;padding: 20px;  min-height: 297mm;"
            >
              <div v-html="form_invoice"></div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" scrollable max-width="1024px">
        <v-card>
          <v-card-title>{{ $t("account_form") }}</v-card-title>
          <v-icon class="btn_close" @click="dialog = false">close</v-icon>
          <v-divider />
          <v-card-text
            style="height: 600px; background-color: #EDF1F5; color: #333; padding-right: 0;"
          >
            <v-row>
              <v-col sm="3" cols="12" class="">
                <label class="label">{{ $t("form_title") }}</label>
                <p class="text_tip">Input title form</p>
                <v-text-field
                  outlined
                  tage="Form Title"
                  @change="UpdateFormChange"
                  placeholder=""
                  v-model="invoice_setting.title"
                />
                <!-- <label>{{ $t("address") }}</label>
                <v-text-field
                  class=" mb-3"
                  outlined
                  @change="UpdateFormChange"
                  placeholder=""
                  v-model="invoice_setting.address.title"
                /> -->
                <label>{{ $t("address_location") }}</label>
                <v-select
                  outlined
                  @change="UpdateFormChange"
                  placeholder=""
                  :items="address_location"
                  v-model="invoice_setting.address.align"
                />

                <label class="label">Position Logo,Size,and Size </label>
                <v-slider
                  @change="UpdateFormChange"
                  v-model="invoice_setting.logo.width"
                  max="400"
                  min="20"
                  thumb-label
                ></v-slider>
                <v-slider
                  @change="UpdateFormChange"
                  v-model="invoice_setting.logo.height"
                  max="400"
                  min="20"
                  thumb-label
                ></v-slider>
                <label>{{ $t("hide_logo") }}</label>
                <v-checkbox
                  class="mt-0"
                  @change="UpdateFormChange"
                  v-model="invoice_setting.logo.hide"
                />
                <label>{{ $t("hide_address_section") }}</label>
                <v-checkbox
                  class="mt-0"
                  @change="UpdateFormChange"
                  v-model="invoice_setting.header"
                />
                <v-row class="mt-0 mb-4">
                  <v-col sm="4" cols="4" class="text-center py-0">
                    <button @click="logoPosition('center')" class="logo_pos">
                      Center
                    </button>
                  </v-col>
                  <v-col sm="4" cols="4" class="text-center py-0">
                    <button @click="logoPosition('left')" class="logo_pos">
                      Left
                    </button>
                  </v-col>
                  <v-col sm="4" cols="4" class="text-center py-0">
                    <button @click="logoPosition('right')" class="logo_pos">
                      Right
                    </button>
                  </v-col>
                </v-row>
                <v-select
                  @change="UpdateFormChange"
                  outlined
                  :items="language"
                  v-model="invoice_setting.language"
                ></v-select>

                <label class="label">{{ $t("signature") }}</label>
                <v-row>
                  <v-col sm="2" cols="2" class="text-center py-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      disabled
                      v-model="invoice_setting.signature.prepared_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center">
                    <v-text-field
                      class=""
                      @change="UpdateFormChange"
                      outlined
                      disabled
                      placeholder="Prepared by"
                      v-model="invoice_setting.signature.prepared_by.text"
                    />
                  </v-col>

                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      disabled
                      class="mt-1"
                      v-model="invoice_setting.signature.reviewed_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      disabled
                      @change="UpdateFormChange"
                      placeholder="Reviewed by"
                      v-model="invoice_setting.signature.reviewed_by.text"
                    />
                  </v-col>

                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      disabled
                      class="mt-1"
                      v-model="invoice_setting.signature.verified_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      disabled
                      @change="UpdateFormChange"
                      placeholder="Verified by"
                      v-model="invoice_setting.signature.verified_by.text"
                    />
                  </v-col>

                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      disabled
                      class="mt-1"
                      v-model="invoice_setting.signature.approved_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      disabled
                      @change="UpdateFormChange"
                      placeholder="Approved by"
                      v-model="invoice_setting.signature.approved_by.text"
                    />
                  </v-col>

                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      disabled
                      class="mt-1"
                      v-model="invoice_setting.signature.recorded_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      disabled
                      @change="UpdateFormChange"
                      placeholder="Recorded by"
                      v-model="invoice_setting.signature.recorded_by.text"
                    />
                  </v-col>
                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      class="mt-1"
                      v-model="invoice_setting.signature.customer.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      disabled
                      outlined
                      @change="UpdateFormChange"
                      placeholder="Customer's Signature"
                    />
                  </v-col>
                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      class="mt-1"
                      v-model="invoice_setting.signature.seller.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      disabled
                      @change="UpdateFormChange"
                      placeholder="Seller's Signature"
                    />
                  </v-col>
                  <!--  -->

                  <!-- color -->
                  <v-divider />
                  <label>{{ $t("color_background") }}</label>
                  <v-col sm="12" cols="4" class="text-center d-flex pt-2">
                    <input
                      class="color_option"
                      type="color"
                      @change="UpdateFormChange"
                      v-model="invoice_setting.color.color2"
                    />
                    <input
                      class="color_option"
                      type="color"
                      @change="UpdateFormChange"
                      v-model="invoice_setting.color.background2"
                    />
                  </v-col>
                  <v-col sm="12" cols="4" class="text-center d-flex pt-2">
                    <input
                      class="color_option"
                      type="color"
                      @change="UpdateFormChange"
                      v-model="invoice_setting.color.color"
                    />
                    <input
                      class="color_option"
                      type="color"
                      @change="UpdateFormChange"
                      v-model="invoice_setting.color.background"
                    />
                  </v-col>
                  <label>{{ $t("page_size") }}</label>
                  <v-col sm="12" cols="4" class="">
                    <div>
                      <v-btn
                        :class="{
                          'primary--text': invoice_setting.page == 'A4',
                        }"
                        @click="invoice_setting.page = 'A4'"
                        >A4</v-btn
                      >
                      <v-btn
                        :class="{
                          'primary--text': invoice_setting.page == 'A5',
                        }"
                        @click="invoice_setting.page = 'A5'"
                        class="mx-2"
                        >A5</v-btn
                      >
                    </div>
                  </v-col>
                  <v-col sm="12" cols="4" class="pl-0 py-0">
                    <p>{{ $t("show_payment_option") }}</p>
                    <v-checkbox
                      @change="UpdateFormChange"
                      class="mt-1"
                      v-model="invoice_setting.paymentOption"
                    />
                  </v-col>
                  <v-col sm="12" cols="4" class="pl-0">
                    <p>{{ $t("show_table_column") }}</p>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        disabled
                        v-model="invoice_setting.column.one"
                      />
                      <label>{{ $t("no.") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.two"
                      />
                      <label>{{ $t("date_from") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.three"
                      />
                      <label>{{ $t("date_to") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.four"
                      />
                      <label>{{ $t("item") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0"
                        v-model="invoice_setting.column.five"
                      />
                      <label>{{ $t("desciption") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        disabled
                        v-model="invoice_setting.column.six"
                      />
                      <label>{{ $t("on_hand") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        disabled
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.seven"
                      />
                      <label>{{ $t("qty") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.eight"
                      />
                      <label>{{ $t("uom") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.nine"
                      />
                      <label>{{ $t("price") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        disabled
                        v-model="invoice_setting.column.ten"
                      />
                      <label>{{ $t("amount") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten1"
                      />
                      <label>{{ $t("modefier") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten2"
                      />
                      <label>{{ $t("discount") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten3"
                      />
                      <label>{{ $t("vat") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten4"
                      />
                      <label>{{ $t("specifc_tax") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten5"
                      />
                      <label>{{ $t("other_tax") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten6"
                      />
                      <label>{{ $t("pl_tax") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten7"
                      />
                      <label>{{ $t("sale_unit") }}</label>
                    </div>
                    <div class="d-flex">
                      <v-checkbox
                        @change="UpdateFormChange"
                        class="mt-0 pt-0"
                        v-model="invoice_setting.column.ten8"
                      />
                      <label>{{ $t("employee") }}</label>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col sm="9" cols="11" class="bg_white">
                <div
                  class="ma-3 mt-6"
                  style="box-shadow: rgb(0 0 0 / 20%) 0px 6px 12px 0px;;padding: 20px;  min-height: 297mm;"
                >
                  <div>
                    <div v-html="form_invoice"></div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions class="function_footer">
            <v-btn
              @click="saveForm"
              :loading="loading"
              class="btn_save_close float-right"
              >Save & Close</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
// const axios = require("axios");
import { CommercialInvoice, print } from "@/form/invoices.js";
import { i18n } from "@/i18n";
const {
  getFormSetting,
  formSettingCreate,
  deleteFormSetting,
} = require("@/scripts/settingsHandler.js");

let def = {
  title: "Commercial Invoice",
  logo: { width: 200, height: 120, position: "left", hide: false },
  header: false,
  paymentOption: true,
  page: "A4",
  color: {
    background: "#3B393E",
    color: "#ffffff",
    background2: "#000000",
    color2: "#ffffff",
  },
  signature: {
    prepared_by: { status: false, text: "Prepare By" },
    reviewed_by: { status: false, text: "Prepare By" },
    verified_by: { status: false, text: "Prepare By" },
    approved_by: { status: false, text: "Approved By" },
    recorded_by: { status: false, text: "Recorded By" },
    customer: { status: true, text: "" },
    seller: { status: true, text: "" },
  },
  column: {
    one: true,
    two: false,
    three: false,
    four: false,
    five: true,
    six: false,
    seven: true,
    eight: false,
    nine: true,
    ten: true,
    ten1: false,
    ten2: false,
    ten3: false,
    ten4: false,
    ten5: false,
    ten6: false,
    ten7: false,
    ten8: false,
  },
  language: "English",
  address: { title: "St, 120 Kamport", align: "left" },
};
export default {
  components: {
    // LoadingMe
  },
  data() {
    return {
      loading: false,
      pk: "",
      sk: "",
      invoice_setting: {
        title: "Commercial Invoice",
        logo: { width: 200, height: 120, position: "left", hide: false },
        color: {
          background: "#3B393E",
          color: "#ffffff",
          background2: "#000000",
          color2: "#ffffff",
        },
        header: false,
        paymentOption: true,
        page: "A4",
        signature: {
          prepared_by: { status: false, text: "Prepare By" },
          reviewed_by: { status: false, text: "Prepare By" },
          verified_by: { status: false, text: "Prepare By" },
          approved_by: { status: false, text: "Approved By" },
          recorded_by: { status: false, text: "Recorded By" },
          customer: { status: true, text: "" },
          seller: { status: true, text: "" },
        },
        column: {
          one: true,
          two: false,
          three: false,
          four: false,
          five: true,
          six: false,
          seven: true,
          eight: false,
          nine: true,
          ten: true,
          ten1: false,
          ten2: false,
          ten3: false,
          ten4: false,
          ten5: false,
          ten6: false,
          ten7: false,
          ten8: false,
        },
        language: "English",
        address: { title: "St, 120 Kamport", align: "center" },
      },
      form_invoice: CommercialInvoice(this.items, def),
      slider_widht: 5,
      slider_height: 5,
      image_size: {
        width: "100px",
        height: "100px",
      },
      language: ["English", "Khmer", "Both"],
      address_location: ["center", "left", "right"],
      dialogm1: "",
      dialog: false,
    };
  },

  methods: {
    ResetForm() {
      let params = "?id=" + this.pk;
      if (this.pk != "") {
        deleteFormSetting(params).then((res) => {
          window.console.log(res.data);
          if (res.data.statusCode === 200) {
            this.invoice_setting = def;
            this.$snotify.success(i18n.t("success"));
            this.form_invoice = CommercialInvoice(
              this.items,
              this.invoice_setting
            );
          } else {
            this.$snotify.error(i18n.t("failed"));
          }
        });
      }
    },
    saveForm() {
      this.loading = true;
      let data = {
        type: "form",
        formType: "Commercial Invoice",
        settings: this.invoice_setting,
        sk: this.sk,
        pk: this.pk,
      };
      formSettingCreate(data).then((res) => {
        if (res.data.statusCode == 201 || res.data.statusCode == 200) {
          this.dialog = false;
          this.loading = false;
          this.$snotify.success(i18n.t("success"));
          this.sk = res.data.data.sk;
          this.pk = res.data.data.pk;
        } else {
          this.$snotify.error(i18n.t("failed"));
        }
        this.loading = false;
      });
    },
    getFormSettingS() {
      let params = "?formType=Commercial Invoice";
      getFormSetting(params).then((res) => {
        if (res.data.statusCode === 200) {
          if (res.data.data.length > 0) {
            this.sk = res.data.data["0"].sk;
            this.pk = res.data.data["0"].pk;
            this.invoice_setting = res.data.data["0"].settings;
            this.form_invoice = CommercialInvoice(
              this.items,
              this.invoice_setting
            );
          }
        }
      });
    },

    UpdateFormChange() {
      this.form_invoice = CommercialInvoice(this.items, this.invoice_setting);
    },
    logoPosition(pos) {
      this.invoice_setting.logo.position = pos;
      this.form_invoice = CommercialInvoice(this.items, this.invoice_setting);
    },
    selectedForm(val) {
      this.selected_form = val;
    },
    _print(id) {
      print(this.items, id, this.invoice_setting);
    },
    EdtiForm() {
      this.form_invoice = CommercialInvoice(this.items, this.invoice_setting);
      this.dialog = true;
    },
  },
  computed: {},
  mounted: async function() {
    this.getFormSettingS();
  },
};
</script>
<style scoped>
.a4 {
  width: 205mm;
  /* to centre page on screen*/
  margin-left: auto;
  margin-right: auto;
}
.btn_edit {
  background-color: #4e6470 !important;
  color: #fff !important;
  height: 35px;
}
.v-card__actions .v-btn.v-btn {
  padding: 0 16px;
}
.function_footer {
  padding: 15px;
  display: inline-block;
}
.bg_white {
  background-color: #fff;
  padding-left: 0;
  padding-top: 0;
}
.wrapper_form {
  width: 99%;
  margin: 0 auto;
}
.wrapper_form .header .logo_company {
  text-align: center;
  padding-top: 0;
}
.wrapper_form .header .logo_company img {
  width: 100px;
  height: auto;
}
.wrapper_form .header h2 {
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-size: 25px;
}
.wrapper_form .header p {
  text-align: center;
  margin-bottom: 8px;
  width: 93%;
  margin: 0 auto;
}
.wrapper_form .header p.phone_email {
  text-align: center;
}
.wrapper_form .content h3.title {
  text-transform: uppercase;
  text-align: center;
  font-size: 25px !important;
  font-weight: 700 !important;
}
.new_line {
  clear: both;
}

.logo_pos {
  padding: 5px 5px;
  background: #fff;
  width: 60px;
  font-size: 12px;
  border-radius: 6px;
}
.color_option {
  width: 62px;
  border: 1px solid #808080;
  margin-right: 4px;
  height: 37px;
  border-radius: 6px;
}

@media (max-width: 576px) {
}
</style>
