<template>
  <v-row class="">
    <v-col sm="12" cols="12">
      <v-row>
        <v-col sm="12" cols="12" class="pt-0 px-10">
          <v-row class="mt-2 mb-3">
            <v-col cols="12" class="py-0">
              <v-btn class="btn_create_new float-right" @click="EdtiForm(1)">
                {{ $t("edit") }}
              </v-btn>
              <v-btn
                class="btn_create_new float-right mx-3"
                @click="_print(3)"
                >{{ $t("preview") }}</v-btn
              >
            </v-col>
          </v-row>
          <div class="a4">
            <div v-html="form_invoice"></div>
          </div>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" scrollable max-width="1124px">
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

                <v-select
                  @change="UpdateFormChange"
                  outlined
                  :items="language"
                  v-model="invoice_setting.language"
                ></v-select>
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

                <label class="label">{{ $t("signature") }}</label>
                <v-row>
                  <v-col sm="2" cols="2" class="text-center py-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      v-model="invoice_setting.signature.prepared_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center">
                    <v-text-field
                      class=""
                      @change="UpdateFormChange"
                      outlined
                      placeholder="Prepared by"
                      v-model="invoice_setting.signature.prepared_by.text"
                    />
                  </v-col>

                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      class="mt-1"
                      v-model="invoice_setting.signature.reviewed_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      @change="UpdateFormChange"
                      placeholder="Reviewed by"
                      v-model="invoice_setting.signature.reviewed_by.text"
                    />
                  </v-col>

                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      class="mt-1"
                      v-model="invoice_setting.signature.verified_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      @change="UpdateFormChange"
                      placeholder="Verified by"
                      v-model="invoice_setting.signature.verified_by.text"
                    />
                  </v-col>

                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      class="mt-1"
                      v-model="invoice_setting.signature.approved_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      @change="UpdateFormChange"
                      placeholder="Approved by"
                      v-model="invoice_setting.signature.approved_by.text"
                    />
                  </v-col>

                  <v-col sm="2" cols="2" class="text-center pt-0">
                    <v-checkbox
                      @change="UpdateFormChange"
                      class="mt-1"
                      v-model="invoice_setting.signature.recorded_by.status"
                    />
                  </v-col>
                  <v-col sm="10" cols="10" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      @change="UpdateFormChange"
                      placeholder="Recorded by"
                      v-model="invoice_setting.signature.recorded_by.text"
                    />
                  </v-col>
                  <!-- color -->
                  <v-divider />
                  <label>{{ $t("color_background") }}</label>
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
                <div class="ma-3 mt-6">
                  <div>
                    <div v-html="form_invoice"></div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions class="function_footer">
            <v-btn @click="saveForm" class="btn_save_close float-right"
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
import { BanhjiInvoice, print } from "@/form/invoices.js";
import { i18n } from "@/i18n";
const {
  getFormSetting,
  formSettingCreate,
} = require("@/scripts/settingsHandler.js");

let def = {
  title: "Banhji Invoice",
  logo: { width: 200, height: 200, position: "center", hide: true },
  color: { background: "#3B393E", color: "#ffffff" },
  page: "A4",
  header: false,
  column: {
    one: true,
    two: false,
    three: false,
    four: false,
    five: true,
    six: false,
    seven: true,
    eight: true,
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
  signature: {
    prepared_by: { status: false, text: "Prepare By" },
    reviewed_by: { status: false, text: "Prepare By" },
    verified_by: { status: false, text: "Prepare By" },
    approved_by: { status: false, text: "Approved By" },
    recorded_by: { status: false, text: "Recorded By" },
  },
  language: "English",
  address: { title: "St, 120 Kamport", align: "center" },
};
export default {
  components: {
    // LoadingMe
  },
  data() {
    return {
      pk: "",
      sk: "",
      invoice_setting: {
        title: "Banhji Invoice",
        logo: { width: 200, height: 200, position: "center", hide: true },
        color: { background: "#3B393E", color: "#ffffff" },
        header: false,
        page: "A4",
        column: {
          one: true,
          two: false,
          three: false,
          four: false,
          five: true,
          six: false,
          seven: true,
          eight: true,
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
        signature: {
          prepared_by: { status: false, text: "Prepare By" },
          reviewed_by: { status: false, text: "Prepare By" },
          verified_by: { status: false, text: "Prepare By" },
          approved_by: { status: false, text: "Approved By" },
          recorded_by: { status: false, text: "Recorded By" },
        },
        language: "English",
        address: { title: "St, 120 Kamport", align: "center" },
      },
      address_location: ["center", "left", "right"],
      form_invoice: BanhjiInvoice(this.items, "2", def),
      slider_widht: 5,
      slider_height: 5,
      image_size: {
        width: "100px",
        height: "100px",
      },
      language: ["English", "Khmer", "Both"],
      dialogm1: "",
      dialog: false,
    };
  },

  methods: {
    saveForm() {
      let data = {
        type: "form",
        formType: "Banhji Invoice",
        settings: this.invoice_setting,
        sk: this.sk,
        pk: this.pk,
      };
      formSettingCreate(data).then((res) => {
        window.console.log(res);
        if (res.status == 201) {
          this.dialog = false;
          this.$snotify.success(i18n.t("success"));
          this.sk = res.data.data["0"].sk;
          this.pk = res.data.data["0"].pk;
        } else {
          this.$snotify.error(i18n.t("failed"));
        }
      });
    },
    getFormSettingS() {
      let params = "?formType=Banhji Invoice";
      getFormSetting(params).then((res) => {
        if (res.data.statusCode === 200) {
          if (res.data.data.length > 0) {
            this.sk = res.data.data["0"].sk;
            this.pk = res.data.data["0"].pk;
            this.invoice_setting = res.data.data["0"].settings;
            this.form_invoice = BanhjiInvoice(
              this.items,
              this.invoice_default,
              this.invoice_setting
            );
          }
        }
      });
    },

    UpdateFormChange() {
      this.form_invoice = BanhjiInvoice(
        this.items,
        this.invoice_default,
        this.invoice_setting
      );
    },
    logoPosition(pos) {
      this.invoice_setting.logo.position = pos;
      this.form_invoice = BanhjiInvoice(
        this.items,
        this.invoice_default,
        this.invoice_setting
      );
    },
    selectedForm(val) {
      this.selected_form = val;
    },
    _print(id) {
      print(this.items, id, this.invoice_setting);
    },
    EdtiForm() {
      this.form_invoice = BanhjiInvoice(
        this.items,
        this.invoice_default,
        this.invoice_setting
      );
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
