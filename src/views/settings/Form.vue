<template>
  <v-row class="">
    <v-col sm="12" cols="12">
      <h2>{{ $t("account_form") }}</h2>
      <p class="mb-3">{{ $t("acc_form_prefix") }}</p>

      <v-row>
        <v-col sm="2" cols="12" class="px-0">
          <v-list nav dense>
            <v-list-item-group v-model="selectedItem" color="primary">
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="selectedForm(item.id)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col sm="10" cols="12" class="pt-0">
          <div v-if="selected_form == 0">
            <v-row class="mt-2 mb-3">
              <v-col cols="12" class="py-0">
                <v-btn class="btn_create_new float-right" @click="EdtiForm(1)">
                  {{ $t("edit") }}
                </v-btn>
                <v-btn
                  class="btn_create_new float-right mx-3"
                  @click="_print(1)"
                  >{{ $t("preview") }}</v-btn
                >
              </v-col>
            </v-row>
            <div v-html="form_invoice"></div>

            <!-- defaul invoice 2 -->
            <v-divider class="my-4" />

            <v-row class="mt-2 mb-3">
              <v-col cols="12" class="py-0">
                <v-btn class="btn_create_new float-right" @click="EdtiForm(2)">
                  {{ $t("edit") }}
                </v-btn>
                <v-btn
                  class="btn_create_new float-right mx-3"
                  @click="_print(1)"
                  >{{ $t("preview") }}</v-btn
                >
              </v-col>
            </v-row>
            <div v-html="form_invoice2"></div>
          </div>
          <div v-else-if="selected_form == 1">
            home
          </div>
          <div v-else-if="selected_form == 2">
            home
          </div>
          <div v-else>
            home
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
                  class=" mb-3"
                  outlined
                  tage="Form Title"
                  @change="UpdateFormChange"
                  placeholder=""
                  v-model="invoice_setting.title"
                />
                <label>{{ $t("address") }}</label>
                <v-text-field
                  class=" mb-3"
                  outlined
                  @change="UpdateFormChange"
                  placeholder=""
                  v-model="invoice_setting.address.title"
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
                  <v-col sm="4" cols="4" class="text-center pt-0">
                    <v-text-field
                      class=""
                      outlined
                      disabled
                      @change="UpdateFormChange"
                      placeholder="Color"
                    />
                  </v-col>
                  <v-col sm="8" cols="4" class="text-center pt-0">
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
                  <v-col sm="12" cols="4" class=" pt-0">
                    <button class="logo_pos">
                      Defualt
                    </button>
                  </v-col>
                </v-row>
              </v-col>
              <v-col sm="9" cols="11" class="bg_white">
                <div class="ma-3 mt-6">
                  <div v-if="invoice_default == 1" >
                    <div v-html="form_invoice"></div>
                  </div>
                  <div v-else-if="invoice_default == 2">
                    <div v-html="form_invoice2"></div>
                  </div>
          
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions class="function_footer">
            <v-btn class="btn_save_close float-right">Save & Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
// const axios = require("axios");
import { defaulFormGoute } from "@/form/form.js";
import { DefaultInvoice, DefaultInvoice2, print } from "@/form/invoices.js";
// import { i18n } from "@/i18n";
// import LoadingMe from '@/components/Loading'
let def = {
  title: "Invoice Default 1",
  logo: { width: 200, height: 200, position: "left", hide: false },
  color: { background: "#3B393E", color: "#ffffff" },
  signature: {
    prepared_by: { status: true, text: "Prepare By" },
    reviewed_by: { status: true, text: "Prepare By" },
    verified_by: { status: true, text: "Prepare By" },
    approved_by: { status: false, text: "Approved By" },
    recorded_by: { status: false, text: "Recorded By" },
  },
  language: "English",
  address: { title: "St, 120 Kamport", align: "center" },
};
let def2 = {
  title: "Invoice Default 2",
  logo: { width: 200, height: 200, position: "left", hide: false },
  color: { background: "#3B393E", color: "#ffffff" },
  signature: {
    prepared_by: { status: true, text: "Prepare By" },
    reviewed_by: { status: true, text: "Prepare By" },
    verified_by: { status: true, text: "Prepare By" },
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
      selected_form: 0,
      invoice_default: 1,
      selectedItem: 0,
      inv_def_save_1 : def,
      inv_def_save_2 : def2,
      invoice_setting: {
        title: "Home back",
        logo: { width: 200, height: 120, position: "left", hide: false },
        color: { background: "#3B393E", color: "#ffffff" },
        signature: {
          prepared_by: { status: true, text: "Prepare By" },
          reviewed_by: { status: true, text: "Prepare By" },
          verified_by: { status: true, text: "Prepare By" },
          approved_by: { status: false, text: "Approved By" },
          recorded_by: { status: false, text: "Recorded By" },
        },
        language: "English",
        address: { title: "St, 120 Kamport", align: "center" },
      },
      items: [
        { text: "invoice", id: 0, icon: "mdi-folder" },
        { text: "Vendor Deposit", id: 1, icon: "mdi-account-multiple" },
        { text: "Purchase Voucher", id: 2, icon: "mdi-star" },
        { text: "Payment Voucher", id: 3, icon: "mdi-history" },
        { text: "Tax Invoice", id: 4, icon: "mdi-check-circle" },
        { text: "Receipt", id: 5, icon: "mdi-upload" },
        { text: "Credit Note", id: 6, icon: "mdi-cloud-upload" },
      ],
      form_invoice: DefaultInvoice(this.items, "id_23e", def),
      form_invoice2: DefaultInvoice2(this.items, "id_23e", def2),
      form_goute: defaulFormGoute([], "idd", "Khmer"),
      slider_widht: 5,
      slider_height: 5,
      image_size: {
        width: "100px",
        height: "100px",
      },
      language: ["English", "Khmer"],
      dialogm1: "",
      dialog: false,
      compeletLoading: true,
      editedIndex: -1,
      option: 1,
      update_id: "",
    };
  },

  methods: {
    UpdateFormChange() {
      if (this.invoice_default == 1) {
        this.form_invoice = DefaultInvoice(
          this.items,
          this.invoice_default,
          this.invoice_setting
        );
        this.inv_def_save_1 = this.invoice_setting
      } else if (this.invoice_default == 2) {
        this.form_invoice2 = DefaultInvoice2(
          this.items,
          this.invoice_default,
          this.invoice_setting
        );
        this.inv_def_save_2 = this.invoice_setting
      }
    },
    logoPosition(pos) {
      this.invoice_setting.logo.position = pos;
      if (this.invoice_default == 1) {
        this.form_invoice = DefaultInvoice(
          this.items,
          this.invoice_default,
          this.invoice_setting
        );
         this.inv_def_save_1 = this.invoice_setting
      } else if (this.invoice_default == 2) {
        this.form_invoice2 = DefaultInvoice2(
          this.items,
          this.invoice_default,
          this.invoice_setting
        );
         this.inv_def_save_2 = this.invoice_setting
      }
    },
    selectedForm(val) {
      this.selected_form = val;
    },
    _print(id) {
      print(this.items, id, this.invoice_setting);
    },
    EdtiForm(n) {
      window.console.log("invoice number",n)
      this.invoice_default = n;
      if(n == 1){
        this.invoice_setting = this.inv_def_save_1
        this.form_invoice = DefaultInvoice(
          this.items,
          this.invoice_default,
          this.invoice_setting
        );
      }else if(n==2){
        this.invoice_setting = this.inv_def_save_2
        this.form_invoice2 = DefaultInvoice2(
          this.items,
          this.invoice_default,
          this.invoice_setting
        );
      }
      window.console.log(this.invoice_setting)
      this.dialog = true;

    },
    async loadFormSetting() {
      // new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve("resolved");
      //     axios.get("http://laravelapi.com/api/getformdata").then((res) => {
      //     });
      //   }, 500);
      // });
    },
  },
  computed: {},
  mounted: async function() {
    this.loadFormSetting();
  },
};
</script>
<style scoped>
table.acc_form {
  border-top: 1px solid #ccc;
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  color: #000;
}
table.acc_form tr th {
  text-transform: uppercase;
  padding: 10px;
  border-top: 1px solid #ccc;
  border-bottom: 3px solid #ccc;
  vertical-align: middle;
}
table.acc_form tr td {
  border-bottom: 1px solid #ccc;
  padding: 8px;
  vertical-align: middle;
}
table.acc_form tr td:first-child {
  font-weight: 700;
}
table.acc_form tr td:last-child {
  text-align: center;
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

table.tbl_form {
  border-top: 1px solid #ccc;
  width: 95%;
  padding: 0 10px;
  border-collapse: collapse;
  margin-top: 10px;
  color: #000;
  margin-left: 10px;
}
table.tbl_form tr th {
  text-transform: uppercase;
  padding: 10px;
  border-top: 1px solid #ccc;
  border-bottom: 3px solid #ccc;
  vertical-align: middle;
}
table.tbl_form tr td {
  border: 1px solid #ccc;
  padding: 8px;
  vertical-align: middle;
}
table.tbl_form tr td:first-child {
  border-left: none;
  text-align: center;
}
table.tbl_form tr td:last-child {
  border-right: none;
}
.exchange-table.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > thead
  > tr
  > th {
  font-family: "Krasar-Bold", serif;
  color: #000 !important;
  border-top: 1px solid #000 !important;
  border-bottom: 0 !important;
  font-size: 15px !important;
}
.exchange-table.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > thead
  > tr
  > td {
  color: #000 !important;
  padding: 5px !important;
}
.exchange-table.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr
  > td:not(.v-data-table__mobile-row) {
  border-top: 1px solid #000 !important;
  border-bottom: 0;
}
.exchange-table.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:last-child
  td {
  border-bottom: 1px solid #000 !important;
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
