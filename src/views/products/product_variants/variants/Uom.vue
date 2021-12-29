<template>
  <v-row>
    <v-col sm="12" cols="12" class="pt-0">
      <h2 class="float-left font_18">{{ $t("unit_of_measure") }}</h2>
      <v-dialog v-model="dialogm2" max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            class="btn_create_new float-right "
            v-on="on"
            @click="newClick"
          >
            {{ $t("new_uom") }}
          </v-btn>
        </template>
        <v-card>
          <div class="modal_header">
            <v-card-title>{{ $t("product_uom") }}</v-card-title>
            <v-icon @click="dialogm2 = false">close</v-icon>
          </div>

          <v-card-text class="modal_text_content">
            <v-row>
              <v-col sm="12" cols="12" class="pb-0">
                <p class="mb-1">{{ $t("base_uom") }}</p>
                <p class="text-bold mb-1">{{ baseUOMName }}</p>
                <p class="mb-0">{{ $t("base_uom_desc") }}</p>
              </v-col>
            </v-row>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row class="mt-0">
                <v-col class="pt-0" sm="6" cols="12">
                  <label class="label">{{ $t("new_uom") }}</label>
                  <p class="text_tip">{{ $t("1_day_base_uom") }}</p>
                  <v-select
                    class=""
                    tage="UOM"
                    v-model="mUOM"
                    :items="uom"
                    item-value="id"
                    item-text="name"
                    :rules="[(v) => !!v['id'] || $t('is_required')]"
                    @change="onUOMChanged"
                    return-object
                    outlined
                  />
                  <p class="text_tip mb-0">{{ $t("conversion_rate") }}</p>
                  <label> {{ conversionUOM }}</label>
                </v-col>
                <v-col class="pt-0" sm="6" cols="12">
                  <label>{{ $t("rate") }}</label>
                  <v-text-field
                    class="mt-6"
                    outlined
                    v-model="uomConversion.rate"
                    :rules="[(v) => !!v || $t('is_required')]"
                    type="number"
                    min="0.00000001"
                    clearable
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="modal_footer">
            <v-row>
              <v-col sm="6" cols="6" class="py-0 text-left">
                <v-btn
                  color="black"
                  outlined
                  class=" text-capitalize  black--text float-left"
                  @click="dialogm2 = false"
                  >{{ $t("cancel") }}
                </v-btn>
              </v-col>
              <v-col sm="6" cols="6" class="py-0 text-right">
                <v-btn
                  color="primary"
                  class="px-3  white--text text-capitalize"
                  @click="onSaveClose"
                >
                  {{ $t("save_close") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col sm="12" clos="12" class="pt-0">
      <LoadingMe
        :isLoading="showLoading"
        :fullPage="false"
        type="loading"
        :myLoading="true"
      />
      <kendo-datasource
        ref="dataSource"
        :data="conversionList"
        :schema="gridSchema"
      />
      <kendo-grid
        id="gridUOM"
        class="grid-function"
        :data-source-ref="'dataSource'"
        v-on:databound="dataBound"
        :style="{ width: '100%' }"
        :noRecords="true"
        :pageable-numeric="false"
        :pageable-previous-next="false"
        :pageable-messages-display="'Showing {2} data items'"
        :scrollable-virtual="true"
      >
        <kendo-grid-column
          :field="'toUOM'"
          :title="$t('uom')"
          :width="100"
          :template="'<span>#=toUOM.name#</span>'"
          :groupHeaderColumnTemplate="'#=value#'"
          :headerAttributes="{ style: 'background-color: #EDF1F5' }"
        />
        <kendo-grid-column
          :field="'rate'"
          :title="$t('rate')"
          :width="50"
          :template="'<span>#=rate#</span>'"
          :headerAttributes="{ style: 'background-color: #EDF1F5' }"
        />
        <kendo-grid-column
          :field="'conversionRate'"
          :title="$t('conversion_rate')"
          :template="'<span>#=conversionRate#</span>'"
          :width="80"
          :headerAttributes="{
            style: 'text-align: left; background-color: #EDF1F5',
          }"
        />
        <kendo-grid-column
          :field="''"
          :title="$t('action')"
          :width="70"
          :command="[
            {
              text: $t('edit'),
              click: goEdit,
              className: 'k-state-disabled isSystem',
            },
          ]"
          :headerAttributes="{
            style: 'text-align: left; background-color: #EDF1F5',
          }"
        />
      </kendo-grid>
    </v-col>
  </v-row>
</template>
<script>
import UOMConversion from "@/scripts/model/UOMConversion";
import kendo from "@progress/kendo-ui";

const uomHandler = require("@/scripts/uomHandler");
const uomConversionHandler = require("@/scripts/uomConversionHandler");
const $ = require("jquery");

let uomConversionModel = new UOMConversion({});
export default {
  components: {
    LoadingMe: () => import(`@/components/Loading`),
  },
  props: {
    product: {},
  },
  data: () => ({
    dialogm2: false,
    valid: true,
    showLoading: false,
    uom: [],
    uoms: [],
    mUOM: {},
    conversionList: [],
    gridSchema: {
      model: {
        id: "id",
      },
    },
    uomConversion: uomConversionModel,
  }),
  methods: {
    dataBound: function(e) {
      const grid = kendo.jQuery("#gridUOM").data("kendoGrid");
      const items = e.sender.items();
      items.each(function() {
        let dataItem = grid.dataItem(this);
        $("tr[data-uid='" + dataItem.uid + "']")
          .find(".isSystem")
          .each(function() {
            if (dataItem.isSystem === 0) {
              $(this).removeClass("k-state-disabled");
            }
          });
      });
    },
    close() {
      // window.history.go(-1)
      this.dialogm2 = false;
    },
    newClick() {
      if (this.product) {
        const uom = this.product.uom;
        let uCategory = {};
        if (uom.hasOwnProperty("category")) {
          uCategory = uom.category;
        } else if (uom.hasOwnProperty("toUOM")) {
          uCategory = uom.toUOM.category;
        }
        this.uom = this.uoms.filter((item) => {
          return item.category.id === uCategory.id;
        });
        window.console.log("uCategory", this.uom);
        this.uomConversion = {};
        this.mUOM = {};
      }
    },
    onUOMChanged() {
      // let rate = this.uomConversion.rate
      if (this.mUOM.id === this.baseUOM.id) {
        this.uomConversion.rate = 1;
      }
    },
    async loadUOM() {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          if (this.product) {
            if (this.product.hasOwnProperty("uom")) {
              uomHandler.get().then((res) => {
                this.uoms = res;
                const uom = this.product.uom;
                let uCategory = {};
                if (uom.hasOwnProperty("category")) {
                  uCategory = uom.category;
                } else if (uom.hasOwnProperty("toUOM")) {
                  uCategory = uom.toUOM.category;
                }
                window.console.log(uom, "uCategory", uCategory);
                this.uom = this.uoms.filter((item) => {
                  return item.category.id === uCategory.id;
                });
                // this.uom = this.uoms.filter(item => {
                //   return item.category.id === this.product.uom.category.id
                // })
              });
            }
          }
        }, 50);
      });
    },
    async loadUOMConversion() {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          if (this.product) {
            if (this.uoms) {
              if (this.product.hasOwnProperty("uom")) {
                const uom = this.product.uom;
                let uCategory = {};
                if (uom.hasOwnProperty("category")) {
                  uCategory = uom.category;
                } else if (uom.hasOwnProperty("toUOM")) {
                  uCategory = uom.toUOM.category;
                }
                this.uom = this.uoms.filter((item) => {
                  return item.category.id === uCategory.id;
                });
                this.showLoading = true;
                uomConversionHandler.get(this.variantId).then((res) => {
                  this.showLoading = false;
                  this.conversionList = res;
                });
              }
            }
          }
        }, 50);
      });
    },
    async goEdit(e) {
      e.preventDefault();
      let grid = kendo.jQuery("#gridUOM").data("kendoGrid");
      let dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
      this.uomConversion = dataItem;
      this.mUOM = dataItem.toUOM;
      this.dialogm2 = true;
      window.console.log(dataItem, "val");
    },
    async onSaveClose() {
      if (!this.$refs.form.validate()) {
        this.$refs.form.validate();
        return;
      }
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("resolved");
          const bUOM = this.baseUOM;
          const bUOM_ = {
            id: bUOM.id,
            category: bUOM.category,
            name: bUOM.name,
          };
          const mUOM = {
            id: this.mUOM.id,
            category: this.mUOM.category,
            name: this.mUOM.name,
          };
          let data = {
            id: this.uomConversion.id,
            variantId: this.variantId,
            fromUOM: bUOM_,
            toUOM: mUOM,
            rate: this.uomConversion.rate,
            skip: this.conversionList.length > 0,
          };
          uomConversionHandler
            .create(this.variantId, data)
            .then((response) => {
              if (response.data.statusCode === 201) {
                let res = response.data.data;
                const index = this.conversionList.findIndex((item) => {
                  return res.id === item.id;
                });
                if (index < 0) {
                  this.conversionList.push(res);
                } else {
                  this.conversionList.splice(index, 1, res);
                }

                // this.conversionList.push(response.data.data)
                this.$snotify.success("Success");
                this.close();
              }
            })
            .catch((e) => {
              this.$snotify.error("Something went wrong");
              this.errors.push(e);
            });
        }, 50);
      });
    },
  },
  watch: {
    product() {
      if (this.product !== undefined) {
        this.showLoading = true;
        this.loadUOM();
        this.loadUOMConversion();
        this.showLoading = false;
      }
    },
    // '$route': 'loadUOMConversion'
  },
  mounted: async function() {
    await this.loadUOM();
    await this.loadUOMConversion();
  },
  computed: {
    baseUOMName() {
      if (this.product) {
        const uom = this.product.uom || {};
        if (uom.hasOwnProperty("toUOM")) {
          return uom.toUOM.name || "";
        } else {
          return uom.name || "";
        }
      } else {
        return "";
      }
    },
    baseUOM() {
      if (this.product) {
        const uom = this.product.uom || {};
        if (uom.hasOwnProperty("toUOM")) {
          return uom.toUOM;
        } else {
          return uom;
        }
      } else {
        return "";
      }
    },
    variantId() {
      if (this.product) {
        if (this.product.hasOwnProperty("id")) {
          return this.product.id;
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    conversionUOM() {
      if (this.mUOM) {
        return (
          "1 " +
          this.mUOM.name +
          " = " +
          1 / this.uomConversion.rate +
          " " +
          this.baseUOMName
        );
      } else {
        return "";
      }
    },
  },
};
</script>
