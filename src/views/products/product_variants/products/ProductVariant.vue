<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="12" sm="12">
          <v-card
              outlined
              dense
              class="pa-4 no_border rounded-sm"
              color="white">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card outlined dense class="no_border">
                <h2 class="mb-0">{{ $t("product_variant") }}</h2>
                <v-icon
                    onclick="window.history.go(-1); return false;"
                    style="cursor: pointer; color: #333; font-size: 40px;"
                    class="float-right">close
                </v-icon>
              </v-card>
              <v-card outlined dense class="px-3 no_border">
                <v-row>
                  <v-col sm="5" cols="12" class="py-0 px-0">
                    <v-card color="grayBg" outlined dense class="px-3 no_border">
                      <v-row>
                        <v-col cols="12">
                          <kendo-datasource ref="variantDS"
                            :data="varLists"/>
                          <kendo-grid id="grid" class="grid-function"
                            :data-source-ref="'variantDS'"
                            :editable="true"
                            :scrollable-virtual="true">
                            <kendo-grid-column
                                :field="'no'"
                                :title="$t('no')"
                                :template="rowNumberTmpl"
                                :width="45"
                                :column-menu="false"
                                :headerAttributes="{ style: 'background-color: #EDF1F5;', class: 'text-center'	}"
                                :attributes="{style: 'text-align: center'}"/>
                            <kendo-grid-column
                                :field="'variant'"
                                :title="$t('variant')"
                                :width="150"
                                :template="'<span>#=variant.name#</span>'"
                                :editor="variantDropDownEditor"
                                :headerAttributes="{ style: 'background-color: #EDF1F5' }"/>
                            <kendo-grid-column
                                :field="'attribute'"
                                :title="$t('attribute')"
                                :width="100"
                                :template="'<span>#=attribute.name?attribute.name:\'\'#</span>'"
                                :editor="attributeDropDownEditor"
                                :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"/>
                          </kendo-grid>

                        </v-col>
                      </v-row>
                    </v-card>

                    <v-card outlined dense class="mt-3 no_border">
                      <h2 class="font_20 mb-2">{{ $t('suppliers_customers_code') }}</h2>
                    </v-card>
                  </v-col>
                  <v-col sm="7" cols="12" class="pl-4 pr-0 py-0">
                    <v-card color="greyDark" outlined dense class="px-3 mb-4 rounded-0"
                            height="145px">
                      <v-row>
                        <v-col sm="12" cols="12">
                          <p class="mb-0 color_grey">
                            {{ $t("add_funct_prod_variant_desc") }}
                          </p>
                        </v-col>
                        <v-col class="py-0" sm="6" cols="12">
                          <label class="label">{{ $t("variant_name") }}</label>
                          <v-text-field
                              class="mt-1"
                              tage="Variant Name"
                              v-model="productVariant.name"
                              outlined/>
                        </v-col>
                        <v-col class="py-0" sm="6" cols="12">
                          <label class="label">{{ $t("variant_sku") }}</label>
                          <v-row class="mt-0 mr-0">
                            <v-col sm="7" cols="7" class="pt-0 pl-0 pr-1">
                              <v-text-field
                                  class="mt-1"
                                  v-model="productVariant.sku"
                                  outlined
                                  tage="Variant SKU"
                                  :rules="[(v) => !!v || 'Number is required']"
                                  required/>
                            </v-col>
                            <v-col sm="2" cols="2" class="pt-1 px-0">
                              <v-icon style="background: #fff;"
                                      color="black"
                                      size="30"
                                      class="border_qrcode">mdi-qrcode
                              </v-icon>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card>
                    <v-card outlined dense class="px-3 rounded-0" height="175px">
                      <v-row>
                        <v-col sm="6" cols="12">
                          <label class="label">{{
                              $t("recorder_qty")
                            }}</label>
                          <v-text-field
                              class="mt-1"
                              tage="Recorder Qty"
                              type="number"
                              min="1"
                              v-model="productVariant.reOrderQty"
                              outlined
                          />
                          <label class="label">{{
                              $t("barcode_upc")
                            }}</label>
                          <v-text-field
                              class="mt-1"
                              tage="Barcode UPC"
                              v-model="productVariant.barcode"
                              outlined
                          />
                        </v-col>
                        <v-col sm="6" cols="12">
                          <label class="label">{{ $t("brand") }}</label>
                          <v-select
                              class="pt-1"
                              outlined
                              tage="Variant Brand"
                              :placeholder="$t('select_brand')"
                              :rules="[v => !!v || 'Number is required']"
                              v-model="mBrand"
                              :items="brands"
                              item-value="id"
                              :item-text="item =>`${item.code} - ${item.name}`"
                              return-object/>
                          <label class="label  mb-0">{{ $t("country_of_origin") }}</label>
                          <v-select
                              class="mt-1"
                              outlined
                              tage="Country Of Origin"
                              :placeholder="$t('select_country')"
                              v-model="mCountry"
                              :items="country"
                              item-value="abbreviation"
                              :item-text="item =>`${item.abbreviation} - ${item.country}`"
                              return-object/>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>

              <v-card outlined dense class="mt-1 no_border">
                <v-row>
                  <v-col sm="12" cols="12" class="pb-0 pr-0">
                    <v-card outlined dense class="pa-3 rounded-0" height="180px">
                      <h2 class="font_20 mb-0">{{ $t('sale_description') }}</h2>
                      <p class="grayBg---text mb-0 font_12">{{ $t('this_will_be_used') }}</p>
                      <v-textarea class="mt-1" height="100px" no-resize
                                  v-model="productVariant.saleDescription"
                                  outlined
                                  clearable
                                  rows="3"/>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
              <v-card outlined dense class="no_border my-1">
                <v-row>
                  <v-col sm="4" cols="12" class="my_checkbox">
                    <v-card outlined dense class="px-3 rounded-0" height="325px">
                      <v-row>
                        <v-col sm="12">
                          <h2 class="mb-2 font_20 ">{{ $t("points_of_sale_") }}</h2>
                          <v-row>
                            <v-col sm="5" cols="12" class="pt-0">
                              <p class="color_grey font_14">{{
                                  $t("add_prod_variant_desc")
                                }}</p>
                            </v-col>
                            <v-col sm="7" cols="12" class="py-0">
                              <input
                                  type="checkbox"
                                  id="isForPOS"
                                  v-model="productVariant.isForPOS"/>
                              <label
                                  for="isForPOS">{{
                                  $t("sale_in_point_of_sale")
                                }}</label>
                              <input
                                  type="checkbox"
                                  id="useAsFavorite"
                                  v-model="productVariant.useAsFavorite"/>
                              <label for="useAsFavorite">{{
                                  $t("use_as_favourite")
                                }}</label>
                              <input
                                  type="checkbox"
                                  id="isNegativeSale"
                                  v-model="productVariant.isNegativeSale"/>
                              <label
                                  for="isNegativeSale">{{
                                  $t("selling_pass_on_pos")
                                }}</label>

                              <label class="label">{{ $t("pos_uom") }}</label>
                              <v-select
                                  class="mt-1"
                                  :placeholder="$t('pos_uom')"
                                  tage="Pos Uom"
                                  v-model="mUOM"
                                  :items="uom"
                                  item-value="id"
                                  :item-text="item =>`${item.toUOM.name || ``}`"
                                  return-object
                                  outlined
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <v-col sm="4" cols="12" class="my_checkbox pl-1">
                    <v-card outlined dense class="px-3 rounded-0" height="325px">
                      <v-row>
                        <v-col sm="12">
                          <h2 class="mb-0 font_20">{{ $t("ecommerce") }}</h2>
                          <v-row>
                            <v-col sm="5" cols="12" class="pt-0">
                              <p class="color_grey font_14">
                                {{ $t("add_funct_prod_variant_desc2") }}
                              </p>
                            </v-col>
                            <v-col sm="7" cols="12" class="py-0 pl-0">
                              <input
                                  type="checkbox"
                                  id="isForEcommerce"
                                  v-model="productVariant.isForEcommerce"/>
                              <label for="isForEcommerce">{{ $t("sold_ecom") }}</label>
                              <input
                                  type="checkbox"
                                  id="isNegativeSaleForSaleChannel"
                                  v-model="productVariant.isNegativeSaleForSaleChannel"/>
                              <label
                                  for="isNegativeSaleForSaleChannel">{{
                                  $t("selling_past_inter")
                                }}</label>

                              <label
                                  class="label  mb-0">{{
                                  $t("minimum_order_qty")
                                }}</label>
                              <v-text-field
                                  class="mt-1"
                                  tage="Minimum Order QTY"
                                  type="number"
                                  min="1"
                                  v-model="productVariant.minOrderQty"
                                  outlined/>
                              <label
                                  class="label">{{
                                  $t("maximum_online_stock")
                                }}</label>
                              <v-text-field
                                  class="mt-1"
                                  type="number"
                                  min="1"
                                  tage="Maximum Order QTY"
                                  v-model="productVariant.maxOnlineStock"
                                  outlined/>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <v-col sm="4" cols="12" class="pl-1">
                    <v-card outlined dense class="px-3 rounded-0" height="325px">
                      <v-row>
                        <v-col sm="12" class="">
                          <h2 class="mb-2 font_20 width_100">{{ $t("default_image") }}</h2>
                          <v-row>
                            <v-col sm="5" cols="12" lass="pt-2">
                              <p class="color_grey font_14">
                                {{ $t("add_funct_prod_variant_desc3") }}
                              </p>
                            </v-col>
                            <v-col sm="7" cols="12" class="py-0">
                              <v-img
                                  width="100px"
                                  height="150px"
                                  :src="src"/>
                              <label>
                                <input
                                    type="file"
                                    name="image"
                                    class="file_width"
                                    id="image"
                                    :rules="fileSizeRules"
                                    accept=".png, .jpg, .jpeg"
                                    ref="fileupload"
                                    @change="onFileChange"/>

                              </label>
                              <!-- <p class="upload_btn mb-0" @click="doUpload">
                                  {{ $t("upload_image") }}
                              </p> -->
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>

              <v-divider/>
              <v-card outlined dense class="no_border function_footer">
                <v-btn
                    color="black"
                    onclick="window.history.go(-1); return false;"
                    class="text-capitalize rounded-pill white--text float-left">{{ $t("cancel") }}
                </v-btn>
                <v-btn
                    color="primary" @click="onSaveClose"
                    class="float-right white--text text-capitalize rounded-pill">{{ $t("save_close") }}
                </v-btn>
              </v-card>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
      <LoadingMe
          :isLoading="showLoading"
          :fullPage="false"
          type="loading"
          :myLoading="true"/>
    </v-container>
  </v-app>
</template>
<script>
import kendo from "@progress/kendo-ui";
import VariantModel from "@/scripts/model/Variants";
import ProductVariantModel from "@/scripts/model/ProductVariants";
const brandHandler = require("@/scripts/brandHandler")
const uomHandler = require("@/scripts/uomHandler")
const otherHandler = require("@/scripts/otherHandler")
const productVariantHandler = require("@/scripts/productVariantHandler")
const variantHandler = require("@/scripts/variantTypeHandler")
const attributeHandler = require("@/scripts/attributeHandler")
const variantModel = new VariantModel({})
const productVariantModel = new ProductVariantModel({})
const uomConversionHandler = require("@/scripts/uomConversionHandler")
// const $ = require("jquery")
export default {
  name: "",
  components: {
    LoadingMe: () => import(`@/components/Loading`)
  },
  props: ['id'],
  data: () => ({
    showLoading: false,
    valid: "",
    proVariant: '',
    mBrand: {},
    mUOM: {},
    mCountry: {},
    variant: variantModel,
    brands: [],
    uom: [],
    country: [],
    varLists: [],
    variantTypes: [],
    attributes: [],
    productVariant: productVariantModel,
    imgFile: '',
    src: '',
    fileSizeRules: [
      files => !files || !files.some(file => file.size > 1024 * 1024) || 'Image size should be less than 1 MB!'
    ],
  }),
  methods: {
    UOMTemplatePOS(dataItem) {
      const uom = dataItem.uom || {}
      const toUOM = uom.toUOM || {}
      if (toUOM) {
        return toUOM.name || ''
      } else {
        return ``
      }
    },
    onUpdate() {
      this.$emit('onUpdate', this.productVariant)
    },
    // DataSource Changes
    onDataSourceChanges(e) {
      window.console.log("im changed", e)
      // if (e.field) {
      //   let dataRow = e.items[0]
      //
      //   switch (e.field) {
      //     case "variant":
      //
      //       break
      //     case "attribute":
      //       // this.attribute_ = this.attributes.filter(m => m.type.id === dataRow.variant.id)
      //       window.console.log("--", dataRow.variant.id)
      //       break
      //     default:
      //       break
      //   }
      // }
    },
    async initData() {
      // window.console.log('me', this.$route.params)
      if (this.$route.params.id !== undefined) {
        await this.loadSingleVariant()
      } else {
        let ds = this.$refs.variantDS.kendoWidget()
        ds.data([])
        this.addRow()
      }
    },
    addRow() {
      let ds = this.$refs.variantDS.kendoWidget(),
          total = ds.total();
      ds.insert(total, {
        variant: this.variant,
        attribute: {}
      })
    },
    // Row Number Template
    rowNumberTmpl(dataItem) {
      let ds = this.$refs.variantDS.kendoWidget(),
          index = ds.indexOf(dataItem);
      return index + 1;
    },
    // Grid Custom Editor
    variantDropDownEditor(container, options) {
      kendo.jQuery('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoDropDownList({
            autoBind: false,
            autoWidth: true,
            height: 400,
            filter: "startswith",
            dataTextField: "name",
            dataValueField: "id",
            template: "<span>#=name#</span>",
            optionLabel: "--- Select ---",
            dataSource: new kendo.data.DataSource({
              data: this.variantTypes,
            })
          })
    },
    attributeDropDownEditor(container, options) {
      kendo.jQuery('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoDropDownList({
            autoBind: true,
            autoWidth: true,
            height: 400,
            filter: "startswith",
            dataTextField: "name",
            dataValueField: "id",
            cascadeFrom: "variant",
            template: "<span>#=code# - #=name#</span>",
            optionLabel: "--- Select ---",
            dataSource: new kendo.data.DataSource({
              data: this.attribute_.filter(m => m.type.id === options.model.variant.id),
            })
          })
    },
    async loadBrand() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          brandHandler.get().then(res => {
            this.showLoading = false
            this.brands = res
          })
        }, 50);
      })
    },
    async loadVariants() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          variantHandler.get().then(res => {
            this.showLoading = false
            this.variantTypes = res
            if (this.variantTypes.length > 0) {
              this.initData()
            }
          })
        }, 50);
      })
    },
    async loadUOM() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          uomHandler.get().then(res => {
            this.showLoading = false
            this.uom = res
          })
        }, 50);
      })
    },
    async loadCountry() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          otherHandler.country().then(res => {
            this.showLoading = false
            this.country = res
          })
        }, 50);
      })
    },
    async loadSingleVariant() {
      new Promise(resolve => {
        resolve('resolved');
        setTimeout(() => {
          this.showLoading = true
          productVariantHandler.getOne(this.$route.query.p, this.$route.params.id).then(res => {
            this.productVariant = res
            this.mBrand = this.productVariant.brand
            this.mCountry = this.productVariant.countryOrigin
            this.mUOM = this.productVariant.uom

            this.varLists = []
            let variant = []
            this.src = ''
            if (this.productVariant.variant.length === 0 || this.productVariant.variant === {} || this.productVariant.variant.length === undefined) {
              variant = this.productVariant.product.variant.variant
              this.src = ''
            } else {
              variant = this.productVariant.variant
              let hasImg = this.productVariant.hasOwnProperty('images')
              let imgUrl = ''
              if (hasImg) {
                if (this.productVariant.images.hasOwnProperty('default')) {
                  imgUrl = this.productVariant.images.default.thumb
                  this.src = 'https://s3-ap-southeast-1.amazonaws.com/images.banhji/' + imgUrl
                }
              }
            }
            if (this.$route.query.type === 'new') {
              this.src = ''
            }
            this.showLoading = false
            variant.forEach(m => {
              this.varLists.push({
                variant: {
                  name: m.hasOwnProperty('variant') ? m.variant.name : '',
                  id: m.hasOwnProperty('variant') ? m.variant.id : '',
                  code: m.hasOwnProperty('variant') ? m.variant.code : '',
                },
                attribute: {
                  name: m.hasOwnProperty('attribute') ? m.attribute.name : '',
                  id: m.hasOwnProperty('attribute') ? m.attribute.id : '',
                  code: m.hasOwnProperty('attribute') ? m.attribute.code : '',
                }
              })
            })
            // }
          })
        }, 50)
      })
    },
    async loadAttributes() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          attributeHandler.get().then(res => {
            this.showLoading = false
            this.attributes = res
            this.attribute_ = res
          })
        }, 50);
      })
    },
    async doUpload() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          let data = {
            file: this.imgFile,
            key: '6305850114'
          }
          productVariantHandler.upload(data).then(response => {
            if (response.data.statusCode === 201) {
              window.console.log(response, 'success')
            }
          }).catch(e => {
            this.errors.push(e)
          })
        }, 50);
      })
    },
    onFileChange(e) {
      // const file = e.target.files[0];
      let input = e.target
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        if (input.files[0].size > 1024 * 1024) {
          e.preventDefault();
          alert('File too big (> 1MB)');
          this.src = ''
          this.imgFile = ''
          this.$refs.fileupload.value = null;
        } else {
          // create a new FileReader to read this image and convert to base64 format
          let reader = new FileReader()
          // Define a callback function to run, when FileReader finishes its job
          reader.onloadend = (e) => {
            // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
            // Read image as base64 and set to imageData
            this.imgFile = e.target.result
          }
          // Start the reader job - read file as a data url (base64 format)
          reader.readAsBinaryString(input.files[0])
          // this.url = input.files[0]
          this.src = URL.createObjectURL(e.target.files[0])
        }
      }
    },
    async onSaveClose() {
      let ds = this.$refs.variantDS.kendoWidget();
      let d1 = ds.data()
      let dataValidate = 0
      d1.forEach((value, index) => {
        if(value.attribute == undefined || value.attribute.id  == undefined || value.attribute.id == null || value.attribute.id == ''){
          this.$snotify.error('Please check Attribute  on row ' + (index + 1))
        }else{
          dataValidate  += 1
        }
      });
      if (!this.$refs.form.validate()) {
        this.$refs.form.validate()
        return
      }
      if(d1.length == dataValidate){
        new Promise(resolve => {
          setTimeout(() => {
            resolve('resolved')
            const variantDS = this.$refs.variantDS.kendoWidget()
            window.console.log('variant', variantDS.data())
            const variants = variantDS.data().map(o => {
              return {
                attribute: o.attribute,
                variant: o.variant
              }
            })

            let data = {
              id: this.$route.params.id ? this.$route.params.id : '',
              productId: this.$route.query.p,
              name: this.productVariant.name,
              sku: this.productVariant.sku,
              variant: variants,
              product: this.productVariant.product,
              uom: this.mUOM,
              reOrderQty: this.productVariant.reOrderQty,
              saleDescription: this.productVariant.saleDescription,
              brand: this.mBrand,
              countryOrigin: this.mCountry,
              supplier: {},
              barcode: this.productVariant.barcode,
              isForPOS: this.productVariant.isForPOS,
              useAsFavorite: this.productVariant.useAsFavorite,
              isNegativeSale: this.productVariant.isNegativeSale,
              isForEcommerce: this.productVariant.isForEcommerce,
              isNegativeSaleForSaleChannel: this.productVariant.isNegativeSaleForSaleChannel,
              minOrderQty: this.productVariant.minOrderQty,
              maxOnlineStock: this.productVariant.maxOnlineStock,
              images: this.productVariant.images,
              file: this.imgFile,
              type: this.$route.query.type
            }
            this.showLoading = true
            productVariantHandler.create(data).then(response => {
              if (response.data.statusCode === 201) {
                // this.loadSaleUC()
                // this.clear()
                // this.$refs.form.reset()
                this.showLoading = false
                data.id = response.data.data.id
                data.images = response.data.data.images
                this.$snotify.success('Success')
                // this.close(data)
                this.close()
              }
            }).catch(e => {
              this.$snotify.error('Something went wrong')
              this.errors.push(e)
            })
          })
        })
      }
    },
    close() {
      window.history.go(-1)
      // this.$router.push({
      //   name: 'Products', params: {
      //     data: data
      //   }
      // })
    },
    async loadUOMConversion() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved')
          uomConversionHandler.get(this.$route.params.id).then(res => {
            this.uom = res
          })
        }, 50)
      })
    }
  },
  mounted: async function () {
    // await this.loadUOM()
    await this.loadBrand()
    await this.loadCountry()
    await this.loadVariants()
    await this.loadAttributes()
    await this.loadUOMConversion()
  },
  watch: {
    id() {
      window.console.log('watch', this.$route.params)
      if (this.$route.params.id !== undefined) {
        this.showLoading = true
        this.loadSingleVariant()
        this.loadUOMConversion()
        this.showLoading = false
      }
    }
  }
}
</script>

<style scoped>
.function_content {
  padding: 0 25px 25px;
  border-bottom: 0;
  background-color: #fff !important;
}

@media (min-width: 1264px) {
  .container {
    /* max-width: 1185px; */
    max-width: 1080px !important;
  }
}

.grayBg {
  background-color: #F8F8F9;
}

@media (max-width: 576px) {
  .mb-6 {
    margin-bottom: 0 !important;
  }
}

.section2 {
  border: 1px solid #d6d7d8;
}

.border_grey {
  border: 1px solid #d6d7d8;
}

.attachment_table {
  width: 100%;
}

.greyDark {
  background-color: #f2f2f2;
}

.upload_btn {
  padding: 10px 6px;
  text-align: center;
  color: white;
  margin-top: 15px;
  margin-bottom: none !important;
  border-radius: 22px;
  background: #92d050;
}

.my_box_min_heihgt {
  min-height: 356px;
}

.width_100 {
  width: 100px;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: transparent !important;
}
</style>
